/*!
 * SmartURLs Actions Module - Shared logic for Copy and Open actions
 * Can be used by both popup.js and service worker (sw.js)
 */

'use strict';

/* ===================== Constants ===================== */

const LIMITS = {
  customMaxTemplate: 500,
  customMaxTextBytes: 200 * 1024,
  customMaxLines: 5000,
  customMaxMatches: 1000
};

/* ===================== HTML Escaping ===================== */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ===================== Defaults ===================== */

const defaults = {
  fmt: "md",
  tpl: "- [$title]($url)",
  openFmt: "smart",
  openTpl: "- [$title]($url)",
  source: "clipboard",
  scope: "current",
  dedup: true,
  httpOnly: true,
  noPinned: false,
  excludeList: "",
  sort: "natural",
  desc: false,
  openLimit: 30,
  theme: "system",
  lang: "AutoLang"
};

/* ===================== URL Filtering & Fetching ===================== */

function wildcardToRegExp(pattern) {
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

/* ===================== Copy Formatting ===================== */

function formatLine(tab, cfg, idx) {
  const url = tab.url;
  const title = tab.title || "";

  let tpl = cfg.tpl;
  if (cfg.fmt === "md") tpl = "[" + title + "](" + url + ")";
  else if (cfg.fmt === "url") tpl = url;
  else if (cfg.fmt === "tsv") tpl = title + "\t" + url;
  else if (cfg.fmt === "html") tpl = '<a href="' + escapeHtml(url) + '">' + escapeHtml(title) + '</a>';
  else if (cfg.fmt === "jsonl") tpl = JSON.stringify({ title, url });
  else if (cfg.fmt === "custom") tpl = cfg.tpl;

  try {
    const u = new URL(url);
    const now = new Date();
    const utcNow = new Date(now.toISOString());

    // Extract basename (last path segment)
    const pathSegments = u.pathname.split('/').filter(Boolean);
    const basename = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';

    // Extract query parameters
    const queryParams = {};
    u.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // PHASE 1: Process conditional blocks {{q=...: ...}}
    // Must be done FIRST before other token replacements
    let result = tpl.replace(/\{\{q=([A-Za-z0-9_,]+):(.*?)\}\}/gs, (match, keys, content) => {
      const requiredKeys = keys.split(',').map(k => k.trim());
      const allExist = requiredKeys.every(key => key in queryParams && queryParams[key] !== '');

      if (!allExist) return ''; // Remove block if conditions not met

      // Expand content with query param tokens from this block
      let expanded = content;
      requiredKeys.forEach(key => {
        // Use negative lookahead to prevent matching inside longer identifiers
        const regex = new RegExp('\\$' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_])', 'g');
        expanded = expanded.replace(regex, queryParams[key]);
      });
      return expanded;
    });

    // PHASE 2: Replace query parameter tokens (outside conditional blocks)
    for (const [key, value] of Object.entries(queryParams)) {
      // Use negative lookahead to prevent matching inside longer identifiers
      const regex = new RegExp('\\$' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_])', 'g');
      result = result.replace(regex, value);
    }

    // PHASE 3: Replace standard tokens
    result = result
      .replace(/\$title\(html\)/g, escapeHtml(title))
      .replace(/\$title/g, title)
      .replace(/\$url/g, url)
      .replace(/\$domain/g, u.hostname)
      .replace(/\$path/g, u.pathname)
      .replace(/\$basename/g, basename)
      .replace(/\$nl/g, '\n')
      .replace(/\$idx/g, String(idx + 1))
      .replace(/\$date\(utc\)/g, utcNow.toISOString().split('T')[0])
      .replace(/\$time\(utc\)/g, utcNow.toISOString().split('T')[1].split('.')[0])
      .replace(/\$date/g, now.toLocaleDateString())
      .replace(/\$time/g, now.toLocaleTimeString());

    return result;
  } catch {
    return tpl.replace(/\$title\(html\)/g, escapeHtml(title)).replace(/\$title/g, title).replace(/\$url/g, url);
  }
}

/* ===================== Open URL Extraction ===================== */

function utf8ByteLength(str) {
  return new TextEncoder().encode(str).length;
}

function extractUrlsSmart(text) {
  const urls = new Set();

  // 1) Markdown [title](url)
  const md = /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi;
  let m;
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
    const r = /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi;
    let m;
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
    const r = /<a\s[^>]*href=["'](https?:\/\/[^"'>\s]+)["'][^>]*>/gi;
    let m;
    while ((m = r.exec(text)) !== null) addIf(m[1]);

  } else if (fmt === "jsonl") {
    text.split(/\r?\n/).forEach(line => {
      try {
        const obj = JSON.parse(line);
        addIf(obj && obj.url);
      } catch {}
    });

  } else if (fmt === "custom") {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeTpl = String(tpl || "- [$title]($url)").slice(0, LIMITS.customMaxTemplate);
    let pat = esc(safeTpl);
    // Feature parity with Copy custom template tokens
    // These tokens act as wildcards in the pattern to match any content
    const otherTokens = ["$title", "$domain", "$path", "$basename", "$idx", "$date", "$time", "$date(utc)", "$time(utc)"];
    // Handle $nl as a newline in the pattern
    pat = pat.split(esc("$nl")).join("\\n");
    otherTokens.forEach(tok => { pat = pat.split(esc(tok)).join(".*?"); });
    // $url is the only token that captures (extracts the URL from matched text)
    pat = pat.split(esc("$url")).join("(https?://[^\\s)>\"]+)");

    let re;
    try {
      re = new RegExp(pat, "i");
    } catch {
      return [];
    }

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

/* ===================== Core Actions ===================== */

/**
 * Prepare copy data (fetch tabs and format)
 * Returns { text: string, count: number } or throws error
 */
async function prepareCopyData(config = null) {
  const cfg = config || Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));

  let tabs = await fetchTabs(cfg.scope, { httpOnly: cfg.httpOnly, noPinned: cfg.noPinned });
  if (cfg.dedup) tabs = uniqueByUrl(tabs);
  tabs = sortTabs(tabs, cfg.sort, cfg.desc);

  const ex = (cfg.excludeList || "").trim();
  if (ex) tabs = tabs.filter(t => !excludeFilter(t.url, ex));

  const lines = tabs.map((t, i) => formatLine(t, cfg, i));
  const text = lines.join("\n");

  return { text, count: lines.length };
}

/**
 * Prepare open URLs (parse text and filter)
 * Returns { urls: string[], count: number } or throws error
 */
async function prepareOpenUrls(text, config = null) {
  const cfg = config || Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));

  // Parse URLs
  const urls0 = extractByFormat(cfg.openFmt, text, cfg.openTpl);
  let urls = urls0;

  // Apply filters
  const ex = (cfg.excludeList || "").trim();
  if (ex) urls = urls.filter(u => !excludeFilter(u, ex));
  if (cfg.httpOnly) urls = urls.filter(u => /^https?:\/\//i.test(u));
  if (cfg.dedup) urls = Array.from(new Set(urls));

  return { urls, count: urls.length };
}

/* ===================== Exports ===================== */

// Export for both ES modules and global scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    defaults,
    prepareCopyData,
    prepareOpenUrls,
    fetchTabs,
    sortTabs,
    uniqueByUrl,
    excludeFilter,
    formatLine,
    extractByFormat,
    extractUrlsSmart
  };
}
