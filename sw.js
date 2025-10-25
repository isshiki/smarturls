// sw.js — 受け取ったURLリストをバックグラウンドで開く
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "OPEN_URLS" && Array.isArray(msg.urls)) {
    const urls = msg.urls;
    const limit = Number(msg.limit) || 30;

    const run = async () => {
      // 30件超の確認は popup 側で済ませておく前提
      for (const u of urls) {
        try { await chrome.tabs.create({ url: u, active: false }); }
        catch (e) { /* noop */ }
        await new Promise(r => setTimeout(r, 60));
      }
    };

    run().then(() => sendResponse({ ok: true, opened: urls.length }))
         .catch(() => sendResponse({ ok: false }));
    // 非同期sendResponseを許可
    return true;
  }
});
