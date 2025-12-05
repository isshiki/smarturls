/*!
 * SmartURLs Service Worker (sw.js) - Background logic for SmartURLs extension
 *
 * Notes:
 * - Manifest V3 service worker context.
 * - Handles keyboard shortcuts via chrome.commands API
 * - Requires "tabs", "clipboardRead", "clipboardWrite" permissions
 * - This file intentionally avoids keeping the SW alive longer than necessary.
 */

'use strict';

console.log('[SW] Service worker initializing...');

// Import shared actions module (tab operations and URL parsing)
try {
  importScripts('actions.js');
  console.log('[SW] Shared actions module loaded');
} catch (err) {
  console.error('[SW] Failed to load actions.js:', err);
  throw err;
}

/** Hard cap to avoid tab spam even if popup validation fails. */
const MAX_OPEN_TABS = 30;

/** Small delay between opening tabs to reduce bursty behavior and throttling. */
const OPEN_DELAY_MS = 60;

/** Validate URL is well-formed and limited to http/https to avoid scheme abuse. */
function isSafeHttpUrl(value) {
  try {
    const u = new URL(String(value));
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Tiny sleep helper. */
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Open URLs in new background tabs with validation and throttling
 *
 * Sanitizes input, validates URLs (http/https only), and opens tabs with a delay
 * to avoid browser throttling. Enforces MAX_OPEN_TABS limit for safety.
 *
 * @param {string[]} urls - Array of URLs to open
 * @param {number} limit - Maximum number of tabs to open (capped at MAX_OPEN_TABS)
 * @returns {Promise<{ok: boolean, opened: number, requested: number, accepted: number, limitedTo: number, max: number}>}
 */
async function openUrlsInTabs(urls, limit = MAX_OPEN_TABS) {
  // Normalize and sanitize input
  const allUrls = Array.isArray(urls) ? urls.map(String) : [];
  const safeUrls = allUrls.filter(isSafeHttpUrl);

  // Cap limit defensively
  const requestedLimit = Number.isFinite(Number(limit)) ? Number(limit) : MAX_OPEN_TABS;
  const finalLimit = Math.min(Math.max(0, requestedLimit), MAX_OPEN_TABS);
  const toOpen = safeUrls.slice(0, finalLimit);

  let opened = 0;

  for (const url of toOpen) {
    try {
      await chrome.tabs.create({ url, active: false });
      opened += 1;
    } catch (e) {
      console.warn('[SW] Failed to open tab:', url, e);
    }
    await delay(OPEN_DELAY_MS);
  }

  return {
    ok: true,
    opened,
    requested: allUrls.length,
    accepted: safeUrls.length,
    limitedTo: finalLimit,
    max: MAX_OPEN_TABS,
  };
}

/**
 * Message handler: { type: "OPEN_URLS", urls: string[], limit?: number }
 *
 * Used by popup.js when the user clicks the Open button. The service worker's
 * keyboard shortcut handler (handleOpenCommand) calls openUrlsInTabs() directly
 * to avoid message-passing overhead.
 *
 * Security: Only accepts messages from the same extension to prevent abuse.
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.type !== 'OPEN_URLS') return; // ignore unrelated messages

  // Security: accept only messages from our own extension
  if (sender.id !== chrome.runtime.id) {
    sendResponse({ ok: false, error: 'unauthorized_sender' });
    return;
  }

  // Call the shared function and send response
  openUrlsInTabs(msg.urls, msg.limit)
    .then((result) => {
      sendResponse(result);
    })
    .catch((err) => {
      console.error('[SW] OPEN_URLS failed:', err);
      sendResponse({ ok: false, error: 'unexpected_error' });
    });

  // Keep the message channel open for the async work above
  return true;
});

/**
 * Chrome Commands API - System-wide keyboard shortcuts
 *
 * These work even when the popup is closed. Shortcuts are configured in manifest.json
 * and can be customized by the user via chrome://extensions/shortcuts.
 *
 * Commands:
 * - copy-smart-url: Copy URLs from current/all window tabs
 * - open-smart-url: Read clipboard and open URLs in new tabs
 */
chrome.commands.onCommand.addListener(async (command) => {
  console.log(`[SW] Command received: ${command}`);

  if (command === 'copy-smart-url') {
    await handleCopyCommand();
  } else if (command === 'open-smart-url') {
    await handleOpenCommand();
  } else {
    console.warn(`[SW] Unknown command: ${command}`);
  }
});

/**
 * Handle Copy URLs command (Ctrl/Cmd+Shift+U)
 *
 * Fetches tabs from current/all windows, formats them according to user settings,
 * and copies to clipboard via offscreen document (required in MV3 service workers).
 */
async function handleCopyCommand() {
  try {
    const { text, count } = await prepareCopyData();
    await copyToClipboard(text);

    await chrome.notifications.create('copy-success', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'SmartURLs - Copy',
      message: `Copied ${count} URL(s) to clipboard`,
      priority: 1
    });

    console.log(`[SW] Copy succeeded: ${count} URLs`);
  } catch (err) {
    console.error('[SW] Copy failed:', err);

    await chrome.notifications.create('copy-error', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'SmartURLs - Copy Failed',
      message: err.message || 'Failed to copy URLs',
      priority: 2
    });
  }
}

/**
 * Handle Open URLs command (Ctrl/Cmd+Shift+V)
 *
 * Reads clipboard via offscreen document (required in MV3), parses URLs according
 * to user settings, and opens them in new background tabs.
 */
async function handleOpenCommand() {
  try {
    const text = await readFromClipboard();

    if (!text || !text.trim()) {
      await chrome.notifications.create('open-empty', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'SmartURLs - Open',
        message: 'Clipboard is empty',
        priority: 1
      });
      return;
    }

    const { urls, count } = await prepareOpenUrls(text);

    if (count === 0) {
      await chrome.notifications.create('open-no-urls', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'SmartURLs - Open',
        message: 'No URLs found in clipboard',
        priority: 1
      });
      return;
    }

    // Open tabs directly (avoids message-passing overhead)
    const response = await openUrlsInTabs(urls, MAX_OPEN_TABS);

    if (response?.ok) {
      await chrome.notifications.create('open-success', {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'SmartURLs - Open',
        message: `Opened ${response.opened} tab(s)`,
        priority: 1
      });
      console.log(`[SW] Open succeeded: ${response.opened} tabs`);
    } else {
      throw new Error('Failed to open tabs');
    }
  } catch (err) {
    console.error('[SW] Open failed:', err);

    await chrome.notifications.create('open-error', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'SmartURLs - Open Failed',
      message: err.message || 'Failed to open URLs',
      priority: 2
    });
  }
}

/**
 * Offscreen document management for clipboard access
 *
 * MV3 service workers cannot access navigator.clipboard directly. We use an offscreen
 * document as a bridge to perform clipboard operations via document.execCommand().
 */
let offscreenDocumentCreating = null;

/**
 * Ensures the offscreen document exists (creates it if needed)
 *
 * Uses a singleton pattern to prevent race conditions when multiple clipboard
 * operations are triggered simultaneously.
 */
async function setupOffscreenDocument() {
  const path = 'offscreen.html';

  // Check if document already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(path)]
  });

  if (existingContexts.length > 0) {
    return;
  }

  // Create offscreen document
  if (offscreenDocumentCreating) {
    await offscreenDocumentCreating;
  } else {
    offscreenDocumentCreating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['CLIPBOARD'],
      justification: 'Read and write clipboard for SmartURLs copy/open actions'
    });
    await offscreenDocumentCreating;
    offscreenDocumentCreating = null;
  }
}

/**
 * Copy text to clipboard via offscreen document
 *
 * @param {string} text - Text to copy to clipboard
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
  await setupOffscreenDocument();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'CLIPBOARD_WRITE', text },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response?.ok) {
          resolve();
        } else {
          reject(new Error(response?.error || 'Failed to write clipboard'));
        }
      }
    );
  });
}

/**
 * Read text from clipboard via offscreen document
 *
 * @returns {Promise<string>} - Clipboard text content
 */
async function readFromClipboard() {
  await setupOffscreenDocument();

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'CLIPBOARD_READ' },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response?.ok) {
          resolve(response.text);
        } else {
          reject(new Error(response?.error || 'Failed to read clipboard'));
        }
      }
    );
  });
}

console.log('[SW] Service worker initialized successfully. Ready to handle commands.');
