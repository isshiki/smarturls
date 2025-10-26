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

function t(id, fallback) {
  try {
    if (currentLang === "AutoLang") {
      const s = chrome.i18n.getMessage(id);
      return s || fallback || id;
    }
    const entry = dict?.[id]?.message;
    return entry || fallback || id;
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

// Soft limits to avoid pathological regex backtracking on custom templates
const LIMITS = {
  customMaxTemplate: 500,         // max chars for template
  customMaxTextBytes: 200 * 1024, // ~200KB input cap
  customMaxLines: 5000,           // max lines to scan
  customMaxMatches: 1000          // max URLs to extract
};

// UTF-8 byte length (used for input cap)
function utf8ByteLength(str) {
  // TextEncoder is supported in MV3 environments
  return new TextEncoder().encode(str).length;
}

/* ===================== Theme ===================== */
function applyTheme(mode) {
  const root = document.documentElement;
  if (!mode || mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode); // "dark" | "light"
}

/* ===================== Storage & defaults ===================== */
const defaults = {
  // copy
  fmt: "md",
  tpl: "- [$title]($url)",
  // open
  openFmt: "smart",          // "smart" | "md" | "url" | "tsv" | "html" | "jsonl" | "custom"
  openTpl: "- [$title]($url)",
  // common
  source: "clipboard",       // "clipboard" | "textarea"
  scope: "current",          // "current" | "all"
  dedup: true,
  httpOnly: true,
  noPinned: false,
  excludeList: "",
  sort: "natural",
  desc: false,
  openLimit: 30,
  // ui
  theme: "system",           // "system" | "dark" | "light"
  lang: "AutoLang"           // "AutoLang" | language code
};

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
  $("#chkHttp").checked = cfg.httpOnly;
  $("#chkNoPinned").checked = cfg.noPinned;
  $("#excludeList").value = cfg.excludeList;
  $("#sort").value = cfg.sort;
  $("#desc").checked = cfg.desc;
  $("#openLimit").value = cfg.openLimit;

  return cfg;
}
async function save(partial) { await chrome.storage.sync.set(partial); }

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

  // 4) bindings
  ["fmt","tpl","sort","openLimit","openFmt","openTpl"].forEach(id => {
    $("#" + id).addEventListener("change", e => save({[id]: e.target.value}));
  });
  [["chkDedup","dedup"],["chkHttp","httpOnly"],["chkNoPinned","noPinned"],["desc","desc"]]
    .forEach(([id,key]) => $("#" + id).addEventListener("change", e => save({[key]: e.target.checked})));
  ["excludeList"].forEach(id => $("#" + id).addEventListener("input", e => save({[id]: e.target.value})));

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

  updatePasteBox();
  initPasteBoxDefault();
}

document.addEventListener("DOMContentLoaded", init);

/* ===================== Tabs: fetch & filters ===================== */
function wildcardToRegExp(pattern) {
  // escape regex specials, then only * -> .*
  const esc = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp("^" + esc + "$", "i");
}
function excludeFilter(url, patterns) {
  if (!patterns) return false;
  const list = patterns.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  return list.some(p => wildcardToRegExp(p).test(url));
}
async function fetchTabs(scope, { httpOnly, noPinned }) {
  let tabs = [];
  if (scope === "all") {
    const wins = await chrome.windows.getAll({ populate: true });
    wins.forEach(w => { if (w.tabs) tabs.push(...w.tabs); });
  } else {
    tabs = await chrome.tabs.query({ currentWindow: true });
  }
  return tabs.filter(t => {
    if (noPinned && t.pinned) return false;
    if (!t.url) return false;
    if (httpOnly && !/^https?:\/\//i.test(t.url)) return false;
    return true;
  });
}
function sortTabs(tabs, key, desc) {
  if (key === "natural") return tabs;
  const cmp = (a, b) => {
    const av = key === "domain" ? (new URL(a.url)).hostname : (key === "url" ? a.url : (a.title || ""));
    const bv = key === "domain" ? (new URL(b.url)).hostname : (key === "url" ? b.url : (b.title || ""));
    return av.localeCompare(bv);
  };
  const s = [...tabs].sort(cmp);
  return desc ? s.reverse() : s;
}
function uniqueByUrl(tabs) {
  const seen = new Set();
  return tabs.filter(t => {
    const u = t.url;
    if (seen.has(u)) return false;
    seen.add(u);
    return true;
  });
}

/* ===================== Copy ===================== */
function formatLine(tab, cfg, idx) {
  const url = tab.url;
  const u = new URL(url);
  const rawTitle = tab.title || url;   // keep raw for JSON
  const domain = u.hostname;
  const path = u.pathname + u.search + u.hash;

  // jsonl needs exact JSON, not token replacement
  if (cfg.fmt === "jsonl") {
    return JSON.stringify({ title: rawTitle, url });
  }

  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date();
  const localDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const localTime = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const utcDate = `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
  const utcTime = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;

  // For non-JSON formats keep the existing token replacement behavior
  const tokens = {
    "$title": rawTitle.replaceAll("]", "\\]"),
    "$url": url,
    "$domain": domain,
    "$path": path,
    "$idx": (idx + 1).toString(),
    "$date": localDate,
    "$time": localTime,
    "$date(utc)": utcDate,
    "$time(utc)": utcTime
  };

  let tpl = cfg.fmt === "md"   ? "[$title]($url)"
          : cfg.fmt === "url"  ? "$url"
          : cfg.fmt === "tsv"  ? "$title\t$url"
          : cfg.fmt === "html" ? "<a href=\"$url\">$title</a>"
          : /* custom */         (cfg.tpl || "- [$title]($url)");

  Object.entries(tokens)
    .sort(([a],[b]) => b.length - a.length)
    .forEach(([k,v]) => { tpl = tpl.split(k).join(v); });
  return tpl;
}

$("#btnCopy").addEventListener("click", async () => {
  try {
    const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));
    let tabs = await fetchTabs(cfg.scope, { httpOnly: cfg.httpOnly, noPinned: cfg.noPinned });
    if (cfg.dedup) tabs = uniqueByUrl(tabs);
    tabs = sortTabs(tabs, cfg.sort, cfg.desc);
    const ex = (cfg.excludeList || "").trim();
    if (ex) tabs = tabs.filter(t => !excludeFilter(t.url, ex));
    const lines = tabs.map((t, i) => formatLine(t, cfg, i));
    await navigator.clipboard.writeText(lines.join("\n"));
    toast(t("copied_n", "Copied ") + `${lines.length}`);
  } catch (e) {
    console.error(e);
    toast(t("copy_failed", "Copy failed"), false);
  }
});

/* ===================== Open (parsers) ===================== */
function extractUrlsSmart(text) {
  const urls = new Set();

  // 1) Markdown [title](url)
  const md = /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi; let m;
  while ((m = md.exec(text)) !== null) urls.add(m[1]);

  // 2) <https://...>
  const angle = /<\s*(https?:\/\/[^>\s]+)\s*>/gi;
  while ((m = angle.exec(text)) !== null) urls.add(m[1]);

  // 3) HTML <a href="...">
  const ahref = /<a\s[^>]*href=["'](https?:\/\/[^"'>\s]+)["'][^>]*>/gi;
  while ((m = ahref.exec(text)) !== null) urls.add(m[1]);

  // 4) JSON Lines {"url":"..."}
  const jsonl = /"url"\s*:\s*"(https?:\/\/[^"]+)"/gi;
  while ((m = jsonl.exec(text)) !== null) urls.add(m[1]);

  // 5) bare URLs
  const bare = /https?:\/\/[^\s)\]>]+/gi;
  while ((m = bare.exec(text)) !== null) {
    let u = m[0];
    u = u.replace(/[),.>]+$/g, "");
    urls.add(u);
  }
  return Array.from(urls);
}

function extractByFormat(fmt, text, tpl) {
  if (fmt === "smart") return extractUrlsSmart(text);

  const out = new Set();
  const addIf = (u) => { if (u && /^https?:\/\//i.test(u)) out.add(u); };

  if (fmt === "md") {
    const r = /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi; let m;
    while ((m = r.exec(text)) !== null) addIf(m[1]);

  } else if (fmt === "url") {
    text.split(/\r?\n/).forEach(line => {
      const s = line.trim();
      const m = s.match(/^https?:\/\/[^\s)>\]]+$/i);
      if (m) addIf(m[0]);
    });

  } else if (fmt === "tsv") {
    text.split(/\r?\n/).forEach(line => {
      const parts = line.split("\t");
      if (parts[1]) addIf(parts[1].trim());
    });

  } else if (fmt === "html") {
    const r = /<a\s[^>]*href=["'](https?:\/\/[^"'>\s]+)["'][^>]*>/gi; let m;
    while ((m = r.exec(text)) !== null) addIf(m[1]);

  } else if (fmt === "jsonl") {
    text.split(/\r?\n/).forEach(line => {
      try { const obj = JSON.parse(line); addIf(obj && obj.url); } catch {}
    });

  } else if (fmt === "custom") {
    // Build a permissive RegExp from the user's template ($url captured)
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Hard caps for safety (truncate but keep behavior otherwise)
    const safeTpl = String(tpl || "- [$title]($url)").slice(0, LIMITS.customMaxTemplate);
    let pat = esc(safeTpl);
    const otherTokens = ["$title","$domain","$path","$idx","$date","$time","$date(utc)","$time(utc)"];
    otherTokens.forEach(tok => { pat = pat.split(esc(tok)).join(".*?"); });
    pat = pat.split(esc("$url")).join("(https?://[^\\s)>\"]+)");

    let re;
    try {
      re = new RegExp(pat, "i"); // no global; we iterate per line
    } catch {
      return [];
    }

    // Apply input caps: byte length, lines, matches
    let textToScan = text || "";
    if (utf8ByteLength(textToScan) > LIMITS.customMaxTextBytes) {
      textToScan = textToScan.slice(0, LIMITS.customMaxTextBytes);
    }

    const lines = textToScan.split(/\r?\n/);
    const maxLines = Math.min(lines.length, LIMITS.customMaxLines);
    let matches = 0;

    for (let i = 0; i < maxLines; i++) {
      const line = lines[i];
      const m = re.exec(line);
      if (m && m[1]) {
        const u = m[1];
        if (/^https?:\/\//i.test(u)) out.add(u);
        matches++;
        if (matches >= LIMITS.customMaxMatches) break;
      }
    }
  }

  return Array.from(out);
}

/* ===================== Open ===================== */
$("#btnOpen").addEventListener("click", async () => {
  try {
    const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));

    // source
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

    // parse
    const urls0 = extractByFormat(cfg.openFmt, text, cfg.openTpl);
    let urls = urls0;

    // filters
    const ex = (cfg.excludeList || "").trim();
    if (ex) urls = urls.filter(u => !excludeFilter(u, ex));
    if (cfg.httpOnly) urls = urls.filter(u => /^https?:\/\//i.test(u));
    if (cfg.dedup) urls = Array.from(new Set(urls));
    if (urls.length === 0) { toast(t("no_urls","No URLs found"), false); return; }

    // confirmation for many tabs
    const limit = Number(cfg.openLimit) || 30;
    if (urls.length > limit) {
      if (!confirm(`${t("confirm_many","Open many tabs?")} ${urls.length}`)) return;
    }

    // delegate to background
    chrome.runtime.sendMessage(
      { type: "OPEN_URLS", urls, limit },
      (res) => {
        if (chrome.runtime.lastError) {
          toast(t("open_failed","Open failed") + ": " + chrome.runtime.lastError.message, false);
        } else if (res?.ok) {
          toast(t("opened_n","Opened ") + `${res.opened}`);
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
