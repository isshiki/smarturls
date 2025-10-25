// ========== i18n ==========
function t(id, fallback) {
  try {
    const s = chrome.i18n.getMessage(id);
    return s || fallback || id;
  } catch { return fallback || id; }
}
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key, el.textContent);
  });
}
applyI18n();

// ========== UI Helpers ==========
const $ = (sel) => document.querySelector(sel);
const toast = (msg, ok = true) => {
  const el = $("#toast");
  el.className = ok ? "ok" : "err";
  el.textContent = msg;
  setTimeout(() => { if (el.textContent === msg) el.textContent = ""; }, 3000);
};

// ========== Storage (defaults) ==========
const defaults = {
  fmt: "md",
  tpl: "[$title]($url)",
  source: "clipboard",
  scope: "current",
  dedup: true,
  httpOnly: true,
  noPinned: false,
  excludeOn: false,
  excludeList: "https://chatgpt.com/c/*",
  sort: "natural",
  desc: false,
  openLimit: 30
};

async function load() {
  const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));
  $("#fmt").value = cfg.fmt;
  $("#tpl").value = cfg.tpl;
  $("#source").value = cfg.source;
  document.querySelector(`input[name=scope][value=${cfg.scope}]`).checked = true;
  $("#chkDedup").checked = cfg.dedup;
  $("#chkHttp").checked = cfg.httpOnly;
  $("#chkNoPinned").checked = cfg.noPinned;
  $("#chkExclude").checked = cfg.excludeOn;
  $("#excludeList").value = cfg.excludeList;
  $("#sort").value = cfg.sort;
  $("#desc").checked = cfg.desc;
  $("#openLimit").value = cfg.openLimit;
}
async function save(partial) { await chrome.storage.sync.set(partial); }
load();

// Save on change (lightweight)
["fmt","tpl","source","sort","openLimit"].forEach(id => {
  $( "#" + id ).addEventListener("change", e => save({[id]: e.target.value}));
});
[["chkDedup","dedup"],["chkHttp","httpOnly"],["chkNoPinned","noPinned"],["chkExclude","excludeOn"],["desc","desc"]]
  .forEach(([id,key]) => $( "#" + id ).addEventListener("change", e => save({[key]: e.target.checked})));
["excludeList"].forEach(id => $( "#" + id ).addEventListener("input", e => save({[id]: e.target.value})));
document.querySelectorAll("input[name=scope]").forEach(r => r.addEventListener("change", e => save({scope: e.target.value})));

// ========== Core: Tabs fetch & filters ==========
function wildcardToRegExp(pattern) {
  // escape regex special, then * -> .*, ? -> .
  const esc = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
                     .replace(/\*/g, ".*").replace(/\?/g, ".");
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

// ========== Copy ==========
function formatLine(tab, cfg, idx) {
  const url = tab.url;
  const u = new URL(url);
  const title = tab.title || url;
  const domain = u.hostname;
  const path = u.pathname + u.search + u.hash;

  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date();
  const localDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const localTime = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const du = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  const utcDate = `${du.getUTCFullYear()}-${pad(du.getUTCMonth()+1)}-${pad(du.getUTCDate())}`;
  const utcTime = `${pad(du.getUTCHours())}:${pad(du.getUTCMinutes())}:${pad(du.getUTCSeconds())}`;

  const tokens = {
    "$title": title.replaceAll("]", "\\]"),
    "$url": url,
    "$domain": domain,
    "$path": path,
    "$idx": (idx + 1).toString(),
    "$date": localDate,
    "$time": localTime,
    "$date(utc)": utcDate,
    "$time(utc)": utcTime
  };

  let tpl = cfg.fmt === "md" ? "[$title]($url)"
          : cfg.fmt === "url" ? "$url"
          : cfg.fmt === "tsv" ? "$title\t$url"
          : cfg.fmt === "html" ? "<a href=\"$url\">$title</a>"
          : cfg.fmt === "jsonl" ? "{\"title\":\"$title\",\"url\":\"$url\"}"
          : (cfg.tpl || "[$title]($url)");

  Object.entries(tokens).forEach(([k,v]) => { tpl = tpl.split(k).join(v); });
  return tpl;
}

$("#btnCopy").addEventListener("click", async () => {
  try {
    const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));
    let tabs = await fetchTabs(cfg.scope, { httpOnly: cfg.httpOnly, noPinned: cfg.noPinned });
    if (cfg.dedup) tabs = uniqueByUrl(tabs);
    tabs = sortTabs(tabs, cfg.sort, cfg.desc);
    if (cfg.excludeOn) tabs = tabs.filter(t => !excludeFilter(t.url, cfg.excludeList));
    const lines = tabs.map((t, i) => formatLine(t, cfg, i));
    await navigator.clipboard.writeText(lines.join("\n"));
    toast(t("copied_n", "Copied ") + `${lines.length}`);
  } catch (e) {
    console.error(e);
    toast(t("copy_failed", "Copy failed"), false);
  }
});

// ========== Open ==========
function extractUrls(text) {
  const urls = new Set();

  // 1) Markdown [title](url) — avoid swallowing trailing ')'
  const md = /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi;
  let m;
  while ((m = md.exec(text)) !== null) urls.add(m[1]);

  // 2) <https://...> — strip trailing '>'
  const angle = /<\s*(https?:\/\/[^>\s]+)\s*>/gi;
  while ((m = angle.exec(text)) !== null) urls.add(m[1]);

  // 3) HTML <a href="...">
  const ahref = /<a\s[^>]*href=["'](https?:\/\/[^"'>\s]+)["'][^>]*>/gi;
  while ((m = ahref.exec(text)) !== null) urls.add(m[1]);

  // 4) JSON Lines {"url":"..."}
  const jsonl = /"url"\s*:\s*"(https?:\/\/[^"]+)"/gi;
  while ((m = jsonl.exec(text)) !== null) urls.add(m[1]);

  // 5) Delimited or bare URLs (stop on space or ) ] >)
  const bare = /https?:\/\/[^\s)\]>]+/gi;
  while ((m = bare.exec(text)) !== null) {
    let u = m[0];
    // common trailing punctuation clean
    u = u.replace(/[),.>]+$/g, "");
    urls.add(u);
  }

  return Array.from(urls);
}

async function openUrls(list, limit) {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  if (list.length > limit) {
    if (!confirm(`${t("confirm_many","Open many tabs?")} ${list.length}`)) return;
  }
  for (const u of list) {
    try { await chrome.tabs.create({ url: u }); } catch (e) { console.warn(e); }
    await delay(60);
  }
  toast(t("opened_n","Opened ") + `${list.length}`);
}

$("#btnOpen").addEventListener("click", async () => {
  try {
    const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));
    let text = "";
    if ($("#source").value === "textarea") {
      text = $("#manualInput").value || "";
    } else {
      text = await navigator.clipboard.readText();
      if (!text) { toast(t("empty_clip","Clipboard is empty"), false); return; }
    }
    let urls = extractUrls(text);
    if (cfg.excludeOn) urls = urls.filter(u => !excludeFilter(u, cfg.excludeList));
    if (cfg.httpOnly) urls = urls.filter(u => /^https?:\/\//i.test(u));
    if (cfg.dedup) urls = Array.from(new Set(urls));
    if (urls.length === 0) { toast(t("no_urls","No URLs found"), false); return; }
    await openUrls(urls, Number(cfg.openLimit) || 30);
  } catch (e) {
    console.error(e);
    toast(t("open_failed","Open failed"), false);
  }
});
