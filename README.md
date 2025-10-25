# SmartURLs

SmartURLs is a Chrome extension that helps you **copy**, **manage**, and **open** URLs easily and flexibly.
Copy all tab URLs in multiple formats, or open URLs directly from text or your clipboard — all in one click.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue.svg)](https://chrome.google.com/webstore/detail/smarturls/your-extension-id)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](LICENSE)

---

![SmartURLs Screenshot](./screenshots/screenshot1.png)

---

## ✨ Features

### 📋 Copy URLs

* Export tab URLs as **Markdown**, **HTML**, **TSV**, **JSON**, or **custom templates**
* Include **page titles** for better readability
* Choose scope: **current window** or **all windows**
* Filter options: remove duplicates, HTTP/HTTPS only, skip pinned tabs
* Exclude URLs using **wildcard patterns**

### 🚀 Open URLs

* Detect and open URLs from **clipboard** or **pasted text**
* Supports various formats (Markdown, HTML, JSON, TSV, plain text, etc.)
* Automatically detects text format
* Optional confirmation before opening many tabs

### 🎨 Appearance & Settings

* **Themes:** System / Dark / Light
* **Languages:** 16 supported, switch instantly
* **Preferences:** Saved automatically via Chrome Storage
* Clean, lightweight, and responsive popup design

---

## 📦 Installation

### From Chrome Web Store

1. Visit the [SmartURLs listing](https://chrome.google.com/webstore/detail/smarturls/your-extension-id)
2. Click **Add to Chrome**

### Manual (Development)

1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `smarturls` folder

---

## 🗒 Version History

| Version | Date       | Notes                  |
| ------- | ---------- | ---------------------- |
| 1.0.0   | 2025-10-26 | Initial public release |

---

## 🛠️ Development

### Project Structure

```text
smarturls/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── sw.js
├── build.ps1
├── build.bat
├── _locales/
│   ├── en/
│   ├── ja/
│   └── ... (14 more)
├── icons/
└── README.md
```

### Build Script (PowerShell)

SmartURLs includes a PowerShell build script to package the extension automatically.

```powershell
# Run from the repository root
.\build.ps1
```

This will:

1. Create a clean `/build/` directory
2. Copy required files from the project root
3. Generate a release ZIP in `/dist/`
4. The final ZIP will have `manifest.json` at its root (required by Chrome Web Store)

You can also use the batch wrapper:

```bat
build.bat
```

The ZIP file can be uploaded directly to the Chrome Web Store.

---

### Updating the Version

Before packaging or publishing a new release:

1. Open `manifest.json`
2. Increment the `"version"` number (e.g., `1.2.3 → 1.2.4`)
3. Re-run the build script:

   ```powershell
   .\build.ps1
   ```

4. A new file will be generated in `/dist/` as:

   ```powershell
   smarturls-<version>.zip
   ```

5. Upload this new ZIP to the **Chrome Web Store Developer Dashboard**

> ⚠️ Chrome Web Store rejects updates if the `version` in `manifest.json` hasn’t changed.

---

## ⚖️ License

Licensed under the [Apache License 2.0](LICENSE).

---

## 💬 Feedback

* Report bugs or suggestions via [GitHub Issues](https://github.com/isshiki/smarturls/issues)
* Pull requests are always welcome
