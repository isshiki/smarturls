/*!
 * SmartURLs Offscreen Document Script
 *
 * Handles clipboard read/write operations for the service worker.
 *
 * Why this exists:
 * - MV3 service workers cannot access navigator.clipboard directly
 * - Offscreen documents provide a DOM context for clipboard operations
 * - Uses document.execCommand() which works without document focus
 *
 * Handles only:
 * - CLIPBOARD_WRITE: Copy text to clipboard
 * - CLIPBOARD_READ: Read text from clipboard
 *
 * All other message types are ignored (not an error - they're meant for other handlers)
 */

'use strict';

console.log('[Offscreen] Document loaded');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // Only accept messages from our service worker
  if (sender.id !== chrome.runtime.id) {
    console.warn('[Offscreen] Unauthorized sender');
    sendResponse({ ok: false, error: 'unauthorized' });
    return false;
  }

  if (msg.type === 'CLIPBOARD_WRITE') {
    handleClipboardWrite(msg.text, sendResponse);
    return true; // Keep channel open for async response
  }

  if (msg.type === 'CLIPBOARD_READ') {
    handleClipboardRead(sendResponse);
    return true; // Keep channel open for async response
  }

  // Ignore messages not meant for us (e.g., OPEN_URLS is for the service worker)
  return false;
});

/**
 * Write text to clipboard using execCommand
 *
 * Uses legacy execCommand('copy') because navigator.clipboard.writeText() requires
 * focus even in offscreen documents, but execCommand works without focus.
 */
function handleClipboardWrite(text, sendResponse) {
  try {
    // Create a temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    // Select and copy
    textarea.select();
    const success = document.execCommand('copy');

    // Cleanup
    document.body.removeChild(textarea);

    if (success) {
      sendResponse({ ok: true });
    } else {
      console.error('[Offscreen] execCommand(copy) failed');
      sendResponse({ ok: false, error: 'execCommand(copy) failed' });
    }
  } catch (err) {
    console.error('[Offscreen] Clipboard write error:', err);
    sendResponse({ ok: false, error: err.message });
  }
}

/**
 * Read text from clipboard using execCommand
 *
 * Uses legacy execCommand('paste') because navigator.clipboard.readText() requires
 * focus even in offscreen documents, but execCommand works without focus.
 */
function handleClipboardRead(sendResponse) {
  try {
    // Create a temporary textarea
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed'; // Prevent scrolling
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    // Focus and paste
    textarea.focus();
    const success = document.execCommand('paste');

    const text = textarea.value;

    // Cleanup
    document.body.removeChild(textarea);

    if (success) {
      sendResponse({ ok: true, text });
    } else {
      console.error('[Offscreen] execCommand(paste) failed');
      sendResponse({ ok: false, error: 'execCommand(paste) failed' });
    }
  } catch (err) {
    console.error('[Offscreen] Clipboard read error:', err);
    sendResponse({ ok: false, error: err.message });
  }
}
