/*!
 * SmartURLs Popup Script (popup.js)
 * Purpose: Popup UI logic for Chrome extension (Manifest V3)
 * Note: Behavior intentionally preserved; comments minimized.
 */
"use strict";

/* ===================== i18n ===================== */
let currentLang = "AutoLang";
let dict = null; // manual dictionary when lang != AutoLang

async function loadDict(lang) {
  // Use Chrome i18n when Auto; clear manual dict
  if (lang === "AutoLang") { dict = null; return "auto"; }

  try {
    const url = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
    // Avoid stale caches; tolerate slow file systems
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    if (!json || typeof json !== "object") throw new Error("Invalid locale JSON");

    dict = json;
    return "ok";
  } catch (err) {
    // Fallback safely to AutoLang without breaking the UI
    console.warn(`[i18n] Failed to load locale "${lang}". Falling back to AutoLang.`, err);
    dict = null;
    currentLang = "AutoLang";
    return "fallback";
  }
}

function unescapeDollar(s) {
  // Convert $$ -> $ to match Chrome i18n behavior
  return s.replace(/\$\$/g, "$");
}

function t(id, fallback) {
  try {
    if (currentLang === "AutoLang") {
      const s = chrome.i18n.getMessage(id);
      return s || fallback || id;
    }
    const entry = dict?.[id]?.message;
    if (!entry) return fallback || id;
    // Apply same $$ escaping as Chrome i18n
    return unescapeDollar(entry);
  } catch {
    return fallback || id;
  }
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key, el.textContent);
  });
}
function applyI18nTitle() {
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.title = t(key, el.title);
  });
}
function applyI18nPlaceholder() {
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key, el.placeholder);
  });
}

/* ===================== Help link URL mapping ===================== */
const HELP_URLS = {
  en: "https://isshiki.github.io/SmartURLs/custom-templates.en",
  ja: "https://isshiki.github.io/SmartURLs/custom-templates.ja",
  ko: "https://isshiki.github.io/SmartURLs/custom-templates.ko",
  es: "https://isshiki.github.io/SmartURLs/custom-templates.es",
  fr: "https://isshiki.github.io/SmartURLs/custom-templates.fr",
  de: "https://isshiki.github.io/SmartURLs/custom-templates.de",
  it: "https://isshiki.github.io/SmartURLs/custom-templates.it",
  pt_BR: "https://isshiki.github.io/SmartURLs/custom-templates.pt_BR",
  ru: "https://isshiki.github.io/SmartURLs/custom-templates.ru",
  nl: "https://isshiki.github.io/SmartURLs/custom-templates.nl",
  pl: "https://isshiki.github.io/SmartURLs/custom-templates.pl",
  tr: "https://isshiki.github.io/SmartURLs/custom-templates.tr",
  vi: "https://isshiki.github.io/SmartURLs/custom-templates.vi",
  id: "https://isshiki.github.io/SmartURLs/custom-templates.id",
  zh_CN: "https://isshiki.github.io/SmartURLs/custom-templates.zh_CN",
  zh_TW: "https://isshiki.github.io/SmartURLs/custom-templates.zh_TW"
};

function getEffectiveLang() {
  // Get the effective language code
  if (currentLang !== "AutoLang") return currentLang;
  // When AutoLang, get the browser's UI language
  const uiLang = chrome.i18n.getUILanguage(); // e.g., "en", "ja", "pt-BR"
  // Normalize to our locale code format (pt-BR -> pt_BR)
  return uiLang.replace("-", "_");
}

function updateHelpLink() {
  const helpLink = $("#custom-tpl-help");
  if (!helpLink) return;

  const effectiveLang = getEffectiveLang();
  const url = HELP_URLS[effectiveLang] || HELP_URLS.en; // Fallback to English
  helpLink.href = url;
}

/* ===================== UI helpers ===================== */
const $ = (sel) => document.querySelector(sel);

const toast = (msg, ok = true) => {
  const el = $("#toast");
  el.classList.remove("ok","err");
  el.classList.add(ok ? "ok" : "err", "show");
  el.textContent = msg;
  setTimeout(() => {
    if (el.textContent === msg) {
      el.classList.remove("show","ok","err");
      el.textContent = "";
    }
  }, 60000); // 60s
};

function applyVersionBadge() {
  const el = document.querySelector("[data-version]");
  if (!el || !chrome.runtime?.getManifest) return;
  try {
    const version = chrome.runtime.getManifest().version;
    if (version) el.textContent = `${version}`;
  } catch (err) {
    console.warn("[popup] Failed to render version badge", err);
  }
}

/* ===================== Theme ===================== */
function applyTheme(mode) {
  const root = document.documentElement;
  if (!mode || mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode); // "dark" | "light"
}

/* ===================== Storage & Config ===================== */
const isMac = navigator.platform.toLowerCase().includes("mac");

async function load() {
  const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));

  // theme & lang
  $("#theme").value = cfg.theme;
  applyTheme(cfg.theme);
  $("#lang").value = cfg.lang;

  // copy
  $("#fmt").value = cfg.fmt;
  $("#tpl").value = cfg.tpl;

  // open
  $("#openFmt").value = cfg.openFmt;
  $("#openTpl").value = cfg.openTpl;

  // source (radio <-> hidden select)
  $("#source").value = cfg.source;
  const radio = document.querySelector(`input[name=sourceKind][value=${cfg.source}]`);
  if (radio) radio.checked = true;

  // scope
  const scopeRadio = document.querySelector(`input[name=scope][value=${cfg.scope}]`);
  if (scopeRadio) scopeRadio.checked = true;

  // filters & others
  $("#chkDedup").checked = cfg.dedup;
  $("#chkCopyProtocolRestrict").checked = cfg.copyProtocolRestrict;
  $("#copyProtocolAllowed").value = cfg.copyProtocolAllowed;
  updateProtocolInputState("copy");
  $("#chkNoPinned").checked = cfg.noPinned;
  $("#excludeList").value = cfg.excludeList;
  $("#sort").value = cfg.sort;
  $("#desc").checked = cfg.desc;
  $("#openLimit").value = cfg.openLimit;

  $("#chkOpenProtocolRestrict").checked = cfg.openProtocolRestrict;
  $("#openProtocolAllowed").value = cfg.openProtocolAllowed;
  updateProtocolInputState("open");

  return cfg;
}
async function save(partial) {
  try {
    await chrome.storage.sync.set(partial);
  } catch (err) {
    // Suppress quota/rate-limit errors to avoid "Uncaught (in promise)" in extension errors
    if (err.message && (err.message.includes('QUOTA') || err.message.includes('MAX_WRITE'))) {
      console.debug('[popup] Storage sync quota/rate limit hit, write skipped:', err.message);
    } else {
      // Re-throw unexpected errors
      throw err;
    }
  }
}

/* ===================== Paste box ===================== */
function updatePasteBox(forceKind) {
  const box = $("#pasteBox");
  const ta  = $("#manualInput");
  if (!box || !ta) return;

  const kind = (forceKind !== undefined ? forceKind : $("#source").value);
  const show = (kind === "textarea");

  if (show) {
    box.removeAttribute("hidden");
    box.style.display = "block";
    ta.style.display = "block";
  } else {
    box.setAttribute("hidden", "");
    box.style.display = "none";
    ta.style.display = "none";
  }
}

function initPasteBoxDefault() {
  const ta = $("#manualInput");
  if (!ta) return;
  if (ta.value && ta.value.trim().length > 0) {
    $("#source").value = "textarea";
    const r = document.querySelector('input[name="sourceKind"][value="textarea"]');
    if (r) r.checked = true;
  }
  updatePasteBox();
}

/* ===================== Protocol Input State ===================== */

/**
 * Update protocol input field enabled state based on checkbox
 * @param {string} side - "copy" or "open"
 */
function updateProtocolInputState(side) {
  const checkbox = $(`#chk${side === "copy" ? "Copy" : "Open"}ProtocolRestrict`);
  const input = $(`#${side}ProtocolAllowed`);

  if (!checkbox || !input) return;

  if (checkbox.checked) {
    input.disabled = false;
    input.style.opacity = "1";
  } else {
    input.disabled = true;
    input.style.opacity = "0.5";
  }
}

/* ===================== Init ===================== */
async function init() {
  // 1) load settings first
  const cfg = await load();
  currentLang = cfg.lang || "AutoLang";

  // 2) load dictionary if needed
  await loadDict(currentLang);

  // 3) initial apply
  applyI18n();
  applyI18nTitle();
  applyI18nPlaceholder();
  applyVersionBadge();
  updateHelpLink(); // Set help link URL based on current language

  // 4) bindings
  ["fmt","tpl","sort","openFmt","openTpl"].forEach(id => {
    $("#" + id).addEventListener("change", e => save({[id]: e.target.value}));
  });

  // OpenLimit with clamping (1-999, default 30)
  const openLimitInput = $("#openLimit");
  function clampOpenLimit() {
    let v = Number(openLimitInput.value);
    // Fallback for empty/NaN
    if (!Number.isFinite(v)) v = 30;
    // Clamp to range
    if (v < 1) v = 1;
    if (v > 999) v = 999;
    // Update displayed value
    openLimitInput.value = v;
    return v;
  }
  if (openLimitInput) {
    openLimitInput.addEventListener("input", clampOpenLimit);
    openLimitInput.addEventListener("change", () => {
      const v = clampOpenLimit();
      save({ openLimit: v });
    });
  }

  // Template length warning
  const tplInput = $("#tpl");
  const tplWarning = $("#tpl-warning");
  let checkTplLength = null; // Store reference for language change updates
  if (tplInput && tplWarning) {
    checkTplLength = () => {
      const len = tplInput.value.length;
      // Get suffix dynamically to reflect current language
      const warnSuffix = t("tplTooLongSuffix", " — too long");
      tplWarning.textContent = len > 1800 ? warnSuffix : "";
    };
    tplInput.addEventListener("input", checkTplLength);
    checkTplLength(); // Check initial value
  }

  // Open template length warning
  const openTplInput = $("#openTpl");
  const openTplWarning = $("#openTpl-warning");
  let checkOpenTplLength = null; // Store reference for language change updates
  if (openTplInput && openTplWarning) {
    checkOpenTplLength = () => {
      const len = openTplInput.value.length;
      // Get suffix dynamically to reflect current language
      const warnSuffix = t("tplTooLongSuffix", " — too long");
      openTplWarning.textContent = len > 800 ? warnSuffix : "";
    };
    openTplInput.addEventListener("input", checkOpenTplLength);
    checkOpenTplLength(); // Check initial value
  }

  // Exclude list length warning
  const excludeListInput = $("#excludeList");
  const excludeListWarning = $("#excludeList-warning");
  let checkExcludeListLength = null; // Store reference for language change updates
  if (excludeListInput && excludeListWarning) {
    checkExcludeListLength = () => {
      const len = excludeListInput.value.length;
      // Get suffix dynamically to reflect current language
      const warnSuffix = t("tplTooLongSuffix", " — too long");
      excludeListWarning.textContent = len > 3800 ? warnSuffix : "";
    };
    excludeListInput.addEventListener("input", checkExcludeListLength);
    checkExcludeListLength(); // Check initial value
  }

  // Manual input length warning
  const manualInput = $("#manualInput");
  const manualInputWarning = $("#manualInput-warning");
  let checkManualInputLength = null; // Store reference for language change updates
  if (manualInput && manualInputWarning) {
    checkManualInputLength = () => {
      const len = manualInput.value.length;
      // Get suffix dynamically to reflect current language
      const warnSuffix = t("tplTooLongSuffix", " — too long");
      manualInputWarning.textContent = len > 99800 ? warnSuffix : "";
    };
    manualInput.addEventListener("input", checkManualInputLength);
    checkManualInputLength(); // Check initial value
  }

  // Helper: Check if protocol allowlist has invalid tokens
  const hasInvalidProtocol = (input) => {
    if (!input || !input.trim()) return false;
    const schemePattern = /^[a-z][a-z0-9+.-]*$/i;
    const entries = input.split(',');
    return entries.some(entry => {
      let scheme = entry.trim().toLowerCase();
      if (!scheme) return false;
      if (scheme.endsWith(':')) scheme = scheme.slice(0, -1);
      return !schemePattern.test(scheme);
    });
  };

  // Copy protocol allowlist warnings (length + validity)
  const copyProtocolInput = $("#copyProtocolAllowed");
  const copyProtocolWarning = $("#copyProtocolAllowed-warning");
  let checkCopyProtocolLength = null;
  if (copyProtocolInput && copyProtocolWarning) {
    checkCopyProtocolLength = () => {
      const len = copyProtocolInput.value.length;

      // Priority 1: Length warning (if > 100)
      if (len > 100) {
        const warnSuffix = t("tplTooLongSuffix", " — too long");
        copyProtocolWarning.textContent = warnSuffix;
        return;
      }

      // Priority 2: Invalid protocol warning (if length OK but has invalid)
      if (hasInvalidProtocol(copyProtocolInput.value)) {
        const warnSuffix = t("invalidProtocolSuffix", " — invalid protocol");
        copyProtocolWarning.textContent = warnSuffix;
        return;
      }

      // No warnings
      copyProtocolWarning.textContent = "";
    };
    copyProtocolInput.addEventListener("input", checkCopyProtocolLength);
    checkCopyProtocolLength(); // Check initial value
  }

  // Open protocol allowlist warnings (length + validity)
  const openProtocolInput = $("#openProtocolAllowed");
  const openProtocolWarning = $("#openProtocolAllowed-warning");
  let checkOpenProtocolLength = null;
  if (openProtocolInput && openProtocolWarning) {
    checkOpenProtocolLength = () => {
      const len = openProtocolInput.value.length;

      // Priority 1: Length warning (if > 100)
      if (len > 100) {
        const warnSuffix = t("tplTooLongSuffix", " — too long");
        openProtocolWarning.textContent = warnSuffix;
        return;
      }

      // Priority 2: Invalid protocol warning (if length OK but has invalid)
      if (hasInvalidProtocol(openProtocolInput.value)) {
        const warnSuffix = t("invalidProtocolSuffix", " — invalid protocol");
        openProtocolWarning.textContent = warnSuffix;
        return;
      }

      // No warnings
      openProtocolWarning.textContent = "";
    };
    openProtocolInput.addEventListener("input", checkOpenProtocolLength);
    checkOpenProtocolLength(); // Check initial value
  }

  [["chkDedup","dedup"],["chkNoPinned","noPinned"],["desc","desc"],
   ["chkCopyProtocolRestrict","copyProtocolRestrict"],
   ["chkOpenProtocolRestrict","openProtocolRestrict"]]
    .forEach(([id,key]) => $("#" + id).addEventListener("change", e => save({[key]: e.target.checked})));
  ["excludeList","copyProtocolAllowed","openProtocolAllowed"].forEach(id => $("#" + id).addEventListener("change", e => save({[id]: e.target.value})));

  $("#chkCopyProtocolRestrict").addEventListener("change", () => {
    updateProtocolInputState("copy");
  });

  $("#chkOpenProtocolRestrict").addEventListener("change", () => {
    updateProtocolInputState("open");
  });

  $("#theme").addEventListener("change", async (e) => {
    const v = e.target.value;
    applyTheme(v);
    await save({ theme: v });
  });

  // language switch
  $("#lang").addEventListener("change", async (e) => {
    const v = e.target.value; // "AutoLang" | "en" | "ja" | ...
    currentLang = v;
    await save({ lang: v });
    await loadDict(currentLang);
    applyI18n();
    applyI18nTitle();
    applyI18nPlaceholder();
    await displayCurrentShortcuts(); // Update shortcut displays with new language
    // Update template warnings to reflect new language
    if (checkTplLength) checkTplLength();
    if (checkOpenTplLength) checkOpenTplLength();
    if (checkExcludeListLength) checkExcludeListLength();
    if (checkManualInputLength) checkManualInputLength();
    if (checkCopyProtocolLength) checkCopyProtocolLength();
    if (checkOpenProtocolLength) checkOpenProtocolLength();
    // Update help link URL to reflect new language
    updateHelpLink();
  });

  // source radio<->select sync
  document.querySelectorAll('input[name="sourceKind"]').forEach(r => {
    r.addEventListener("change", async (e) => {
      if (!e.target.checked) return;
      const v = e.target.value;
      $("#source").value = v;
      await save({ source: v });
      updatePasteBox(v);
    });
  });

  // scope radio sync
  document.querySelectorAll('input[name="scope"]').forEach(r => {
    r.addEventListener("change", async (e) => {
      if (!e.target.checked) return;
      const v = e.target.value;
      await save({ scope: v });
    });
  });

  // Keyboard shortcuts: display current bindings and add configure handlers
  await displayCurrentShortcuts();

  // Add click handlers for "Configure in Chrome" buttons
  const copyConfigureBtn = $("#copyShortcutConfigure");
  const openConfigureBtn = $("#openShortcutConfigure");

  if (copyConfigureBtn) {
    copyConfigureBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });
  }

  if (openConfigureBtn) {
    openConfigureBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });
  }

  updatePasteBox();
  initPasteBoxDefault();
}

/**
 * Display current keyboard shortcuts from chrome.commands API
 * Populates the Copy and Open shortcut displays separately
 * Also updates the shortcut hints on the main action buttons
 */
async function displayCurrentShortcuts() {
  const copyDisplay = $("#copyShortcutDisplay");
  const openDisplay = $("#openShortcutDisplay");

  if (!copyDisplay || !openDisplay) return;

  try {
    const commands = await chrome.commands.getAll();

    // Find Copy and Open commands
    const copyCmd = commands.find(c => c.name === 'copy-smart-url');
    const openCmd = commands.find(c => c.name === 'open-smart-url');

    // Get i18n "Not set" text (fallback to English)
    const notSetText = t('shortcut_not_set', 'Not set');

    // Update displays in advanced section
    copyDisplay.textContent = copyCmd?.shortcut || notSetText;
    openDisplay.textContent = openCmd?.shortcut || notSetText;

    // Update shortcut hints on main action buttons
    const copyHint = $("#copyShortcutHint");
    const openHint = $("#openShortcutHint");

    if (copyHint) {
      copyHint.textContent = copyCmd?.shortcut || '';
    }

    if (openHint) {
      openHint.textContent = openCmd?.shortcut || '';
    }

  } catch (err) {
    console.warn('[popup] Failed to load shortcuts:', err);
    copyDisplay.textContent = '-';
    openDisplay.textContent = '-';
  }
}

document.addEventListener("DOMContentLoaded", init);

/* ===================== Copy Button ===================== */
$("#btnCopy").addEventListener("click", async () => {
  try {
    // Use shared prepareCopyData function
    const { text, count, skippedByProtocol, skippedProtocols } = await prepareCopyData();
    await navigator.clipboard.writeText(text);

    let message = t("copied_n", "Copied ") + `${count}`;

    // Add protocol skip count if any
    if (skippedByProtocol > 0) {
      let suffix;

      if (skippedProtocols && skippedProtocols.length > 0) {
        // Use protocol-specific template
        const protocols = skippedProtocols.join(',');
        suffix = t("protocol_skipped_with_proto_suffix", ` (Skipped: ${skippedByProtocol} / {protocols})`)
          .replace("{count}", skippedByProtocol)
          .replace("{protocols}", protocols);
      } else {
        // Use generic template
        suffix = t("protocol_skipped_suffix", ` (Skipped: ${skippedByProtocol} / protocol filtered)`)
          .replace("{count}", skippedByProtocol);
      }

      message += suffix;
    }

    toast(message);
  } catch (e) {
    console.error(e);
    toast(t("copy_failed", "Copy failed"), false);
  }
});

/* ===================== Open Button ===================== */
$("#btnOpen").addEventListener("click", async () => {
  try {
    const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));

    // Get text from source
    let text = "";
    const sourceKind = $("#source").value;
    if (sourceKind === "textarea") {
      text = $("#manualInput").value || "";
    } else {
      try {
        text = await navigator.clipboard.readText();
      } catch (e) {
        const name = e && e.name;
        if (name === "NotAllowedError" || name === "SecurityError") {
          toast(t("err_clipboard_denied", "Clipboard read was blocked by the browser."), false);
        } else if (name === "NotFoundError") {
          toast(t("err_clipboard_unavailable", "Clipboard is unavailable on this page."), false);
        } else {
          toast(t("err_unknown", "Unknown error") + (e?.message ? `: ${e.message}` : ""), false);
        }
        return;
      }
      if (!text) { toast(t("empty_clip","Clipboard is empty"), false); return; }
    }

    // Use shared prepareOpenUrls function
    const { urls, count, skippedByProtocol, skippedProtocols, allowedProtocols } = await prepareOpenUrls(text, cfg);

    if (count === 0) {
      toast(t("no_urls","No URLs found"), false);
      return;
    }

    // Confirmation for many tabs
    const limit = Number(cfg.openLimit) || 30;
    if (count > limit) {
      if (!confirm(`${t("confirm_many","Open many tabs?")} ${count}`)) return;
    }

    // Delegate to background service worker
    chrome.runtime.sendMessage(
      {
        type: "OPEN_URLS",
        urls,
        limit,
        allowedProtocols: allowedProtocols ? Array.from(allowedProtocols) : null
      },
      (res) => {
        if (chrome.runtime.lastError) {
          toast(t("open_failed","Open failed") + ": " + chrome.runtime.lastError.message, false);
        } else if (res?.ok) {
          let message = t("opened_n","Opened ") + `${res.opened}`;

          if (skippedByProtocol > 0) {
            let suffix;

            if (skippedProtocols && skippedProtocols.length > 0) {
              // Use protocol-specific template
              const protocols = skippedProtocols.join(',');
              suffix = t("protocol_skipped_with_proto_suffix", ` (Skipped: ${skippedByProtocol} / {protocols})`)
                .replace("{count}", skippedByProtocol)
                .replace("{protocols}", protocols);
            } else {
              // Use generic template
              suffix = t("protocol_skipped_suffix", ` (Skipped: ${skippedByProtocol} / protocol filtered)`)
                .replace("{count}", skippedByProtocol);
            }

            message += suffix;
          }

          const totalFailed = (res.rejectedBySecurityBoundary || 0) + (res.failed || 0);
          if (totalFailed > 0) {
            let suffix;

            if (res.failedProtocols && res.failedProtocols.length > 0) {
              // Use protocol-specific template
              const protocols = res.failedProtocols.join(',');
              suffix = t("protocol_failed_with_proto_suffix", ` (Failed: ${totalFailed} / {protocols})`)
                .replace("{count}", totalFailed)
                .replace("{protocols}", protocols);
            } else {
              // Use generic template
              suffix = t("protocol_failed_suffix", ` (Failed: ${totalFailed})`)
                .replace("{count}", totalFailed);
            }

            message += suffix;
          }

          toast(message);
        } else {
          const error = res?.error || "Unknown error";
          toast(t("open_failed","Open failed") + ": " + error, false);
        }
      }
    );
  } catch (e) {
    console.error(e);
    toast(t("open_failed","Open failed"), false);
  }
});
