/*!
 * SmartURLs Service Worker (sw.js) - Open a (sanitized, rate-limited) list of URLs in background tabs
 *
 * Notes:
 * - Manifest V3 service worker context.
 * - Requires "tabs" permission to create tabs.
 * - This file intentionally avoids keeping the SW alive longer than necessary.
 */

'use strict';

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
 * Message handler: { type: "OPEN_URLS", urls: string[], limit?: number }
 * - Only accepts messages from the same extension (guards content-script misuse).
 * - Sanitizes & caps inputs; opens background tabs with a slight delay.
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.type !== 'OPEN_URLS') return; // ignore unrelated messages

  // Security: accept only messages from our own extension pages/content-scripts
  if (sender.id !== chrome.runtime.id) {
    sendResponse({ ok: false, error: 'unauthorized_sender' });
    return; // do not return true (no async work)
  }

  // Normalize and sanitize input
  const allUrls = Array.isArray(msg.urls) ? msg.urls.map(String) : [];
  const safeUrls = allUrls.filter(isSafeHttpUrl);

  // Cap limit defensively
  const requestedLimit = Number.isFinite(Number(msg.limit)) ? Number(msg.limit) : MAX_OPEN_TABS;
  const limit = Math.min(Math.max(0, requestedLimit), MAX_OPEN_TABS);
  const toOpen = safeUrls.slice(0, limit);

  // Do the work asynchronously; signal we'll use sendResponse later
  (async () => {
    let opened = 0;

    for (const url of toOpen) {
      try {
        await chrome.tabs.create({ url, active: false });
        opened += 1;
      } catch (e) {
        // Swallow individual tab failures; continue with the rest
        // Optional: console.warn('Failed to open tab:', url, e);
      }
      await delay(OPEN_DELAY_MS);
    }

    // Return detailed outcome for telemetry/UX
    sendResponse({
      ok: true,
      opened,
      requested: allUrls.length,
      accepted: safeUrls.length,       // after scheme filtering
      limitedTo: limit,                // after cap
      max: MAX_OPEN_TABS,
    });
  })()
    .catch((err) => {
      // Ensure we always respond, even on unexpected errors
      console.error('OPEN_URLS task failed:', err);
      sendResponse({ ok: false, error: 'unexpected_error' });
    });

  // Keep the message channel open for the async work above
  return true;
});
