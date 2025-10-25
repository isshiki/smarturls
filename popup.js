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
function applyI18nTitle() {
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.title = t(key, el.title);
  });
}
applyI18n();
applyI18nTitle();

// ========== UI Helpers ==========
const $ = (sel) => document.querySelector(sel);
const toast = (msg, ok = true) => {
  const el = $("#toast");
  el.classList.remove("ok","err");
  el.classList.add(ok ? "ok" : "err");
  el.textContent = msg;
  el.classList.add("show");
  // 60秒表示 → 消す時に背景クラスも外す
  setTimeout(() => {
    if (el.textContent === msg) {
      el.classList.remove("show","ok","err");
      el.textContent = "";
    }
  }, 60000);
};


// ========== Theme helpers ==========
function applyTheme(mode) {
  const root = document.documentElement;
  if (!mode || mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode); // "dark" | "light"
  }
}

// ========== Storage (defaults) ==========
const defaults = {
  // copy
  fmt: "md",
  tpl: "[$title]($url)",

  // open
  openFmt: "smart",             // "smart" | "md" | "url" | "tsv" | "html" | "jsonl" | "custom"
  openTpl: "[$title]($url)",    // custom parser pattern

  // common
  source: "clipboard",          // "clipboard" | "textarea"
  scope: "current",             // "current" | "all"
  dedup: true,
  httpOnly: true,
  noPinned: false,
  excludeList: "",
  sort: "natural",
  desc: false,
  openLimit: 30,

  // ui
  theme: "system"               // "system" | "dark" | "light"
};

async function load() {
  const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));

  // theme
  $("#theme").value = cfg.theme;
  applyTheme(cfg.theme);

  // copy
  $("#fmt").value = cfg.fmt;
  $("#tpl").value = cfg.tpl;

  // open
  $("#openFmt").value = cfg.openFmt;
  $("#openTpl").value = cfg.openTpl;

  // source (radio <-> hidden select 同期)
  $("#source").value = cfg.source;
  const radio = document.querySelector(`input[name=sourceKind][value=${cfg.source}]`);
  if (radio) radio.checked = true;

  // scope
  const scopeRadio = document.querySelector(`input[name=scope][value=${cfg.scope}]`);
  if (scopeRadio) scopeRadio.checked = true;

  // filters & etc
  $("#chkDedup").checked = cfg.dedup;
  $("#chkHttp").checked = cfg.httpOnly;
  $("#chkNoPinned").checked = cfg.noPinned;
  $("#excludeList").value = cfg.excludeList;
  $("#sort").value = cfg.sort;
  $("#desc").checked = cfg.desc;
  $("#openLimit").value = cfg.openLimit;
}
async function save(partial) { await chrome.storage.sync.set(partial); }
load();

// Save on change (lightweight)
["fmt","tpl","sort","openLimit","openFmt","openTpl"].forEach(id => {
  $("#" + id).addEventListener("change", e => save({[id]: e.target.value}));
});
[["chkDedup","dedup"],["chkHttp","httpOnly"],["chkNoPinned","noPinned"],["desc","desc"]]
  .forEach(([id,key]) => $("#" + id).addEventListener("change", e => save({[key]: e.target.checked})));
["excludeList"].forEach(id => $("#" + id).addEventListener("input", e => save({[id]: e.target.value})));

// theme select
$("#theme").addEventListener("change", async (e) => {
  const v = e.target.value;
  applyTheme(v);
  await save({ theme: v });
});

// source radios <-> hidden select 同期（既存コード互換のため #source を引き続き参照）
document.querySelectorAll("input[name=sourceKind]").forEach(r => {
  r.addEventListener("change", async (e) => {
    if (!e.target.checked) return;
    $("#source").value = e.target.value;
    await save({ source: e.target.value });
  });
});

// ========== Core: Tabs fetch & filters ==========
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

// ========== Open (parsers) ==========
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
    const r = /\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/gi; let m;
    while ((m = r.exec(text)) !== null) addIf(m[1]);
  } else if (fmt === "url") {
    text.split(/\r?\n/).forEach(line => {
      const m = line.match(/https?:\/\/[^\s)>\]]+/i);
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
      try {
        const obj = JSON.parse(line);
        addIf(obj.url);
      } catch {}
    });
  } else if (fmt === "custom") {
    // very simple templated regex: replace $url with capture, other $tokens with non-greedy
    // escape everything else
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let pat = esc(tpl || "[$title]($url)");
    // other known tokens -> non-greedy match
    const otherTokens = ["$title","$domain","$path","$idx","$date","$time","$date(utc)","$time(utc)"];
    otherTokens.forEach(tok => { pat = pat.split(esc(tok)).join(".*?"); });
    // $url -> capture
    pat = pat.split(esc("$url")).join("(https?://[^\\s)>\"]+)");
    try {
      const re = new RegExp(pat, "gi");
      let m;
      while ((m = re.exec(text)) !== null) addIf(m[1]);
    } catch {
      // fallback to smart on invalid regex build
      return extractUrlsSmart(text);
    }
  }
  return Array.from(out);
}

// ========== Open ==========
$("#btnOpen").addEventListener("click", async () => {
  try {
    const cfg = Object.assign({}, defaults, await chrome.storage.sync.get(Object.keys(defaults)));

    // source
    let text = "";
    const sourceKind = $("#source").value; // hidden select kept in sync with radios
    if (sourceKind === "textarea") {
      text = $("#manualInput").value || "";
    } else {
      text = await navigator.clipboard.readText();
      if (!text) { toast(t("empty_clip","Clipboard is empty"), false); return; }
    }

    // parse by format
    const urls0 = extractByFormat(cfg.openFmt, text, cfg.openTpl);
    let urls = urls0;

    // filters
    const ex = (cfg.excludeList || "").trim();
    if (ex) urls = urls.filter(u => !excludeFilter(u, ex));
    if (cfg.httpOnly) urls = urls.filter(u => /^https?:\/\//i.test(u));
    if (cfg.dedup) urls = Array.from(new Set(urls));
    if (urls.length === 0) { toast(t("no_urls","No URLs found"), false); return; }

    // many check
    const limit = Number(cfg.openLimit) || 30;
    if (urls.length > limit) {
      if (!confirm(`${t("confirm_many","Open many tabs?")} ${urls.length}`)) return;
    }

    // 背景SWに委譲
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
