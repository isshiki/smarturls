# SmartURLs

SmartURLs is a Chrome extension that helps you **copy** and **open** URLs in a simple and flexible way.  
Copy all tab URLs in different formats, or open URLs directly from text or your clipboard — all in one click.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue.svg)](https://chrome.google.com/webstore/detail/smarturls/your-extension-id)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](LICENSE)

---

## ✨ Features

### 📋 Copy URLs

- Export URLs in **Markdown**, **HTML**, **TSV**, **JSON**, or custom templates  
- Include **page titles** for clarity  
- Choose scope: **current window** or **all windows**  
- Filter options: remove duplicates, HTTP/HTTPS only, skip pinned tabs  
- Exclude URLs using **wildcard patterns**

### 🚀 Open URLs

- Detect and open URLs from **clipboard** or **pasted text**  
- Supports multiple formats (Markdown, HTML, JSON, TSV, etc.)  
- Automatically detects text formats  
- Optional confirmation before opening many tabs

### 🎨 Appearance & Settings

- **Themes**: System / Dark / Light  
- **Languages**: 16 supported, switch instantly  
- **Saved preferences**: Settings are stored automatically  
- Clean and responsive popup design

---

## 📦 Installation

### From Chrome Web Store

1. Visit the [SmartURLs page](https://chrome.google.com/webstore/detail/smarturls/your-extension-id)
2. Click **Add to Chrome**

### Manual (Development)

1. Download or clone this repository  
2. Open `chrome://extensions` in Chrome  
3. Enable **Developer mode**  
4. Click **Load unpacked** and select the `smarturls` folder

---

## 📖 Usage

1. Click the SmartURLs icon in the Chrome toolbar  
2. Select your preferred options  
3. **Copy Mode** → Click “Copy” to copy all tab URLs  
4. **Open Mode** → Click “Open” to open URLs from text or clipboard

---

## ⚙️ Settings Overview

| Category | Options |
|-----------|----------|
| **Theme** | System / Dark / Light |
| **Language** | 16 languages |
| **Copy Format** | Markdown / HTML / TSV / JSON / Custom |
| **Scope** | Current window / All windows |
| **Filters** | Duplicates / https Protocol / Pinned tabs / Exclusion patterns |
| **Open Source** | Clipboard / Text input |
| **Open Limit** | Confirmation threshold for many tabs |

---

## 🌍 Supported Languages

English, 日本語, 中文(简体), 中文(繁體), Español, Português, Français, Deutsch, 한국어, Русский, Italiano, Nederlands, Polski, Türkçe, Bahasa Indonesia, Tiếng Việt

---

## 🛠️ Development

### Structure

```text
smarturls/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── sw.js
├── _locales/
│   ├── en/
│   ├── ja/
│   └── ... (14 more)
├── icons/
└── README.md
```

### Local Development Tips

* The extension follows **Manifest V3**.
* UI text is localized through `_locales/<lang>/messages.json` (Chrome i18n API + manual loader).
* User settings are stored via `chrome.storage.local`.
* To reload changes quickly, enable **Developer mode** and click **Reload (⟳)** in `chrome://extensions`.

---

## ⚖️ License

Licensed under the [Apache License 2.0](LICENSE).

---

## 💬 Feedback

* Report issues or suggestions on [GitHub Issues](https://github.com/isshiki/smarturls/issues)
* Pull requests are welcome
