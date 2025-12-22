# 📘 SmartURLs Notification FAQ (ZH-TW)

此FAQ說明在使用鍵盤快捷鍵時，確認通知為何可能不會出現。
通知由作業系統與瀏覽器設定控制，SmartURLs無法覆寫這些規則。

## 💻 Windows Notification Behavior

**Q: 為什麼我在 Windows 上有時看不到通知彈窗？**

在 Windows 上，通知行為取決於**系統通知設定**與**Focus Assist (Do Not Disturb)**。
這是正常的系統行為，並非錯誤。

**為什麼會這樣:**

- Windows 控制通知彈窗的顯示方式與時間
- 通知可能會:
  - 以彈窗形式顯示
  - 被分組或折疊
  - 被 **Focus Assist** 抑制
- SmartURLs 無法控制通知可見性

**在 Windows 上需要檢查:**

- **已為 Google Chrome 啟用通知**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist 已關閉**
  - Settings -> System -> Focus

**重要說明:**

- 即使通知被隱藏，快捷鍵仍可正常運作
- 確認訊息仍可能記錄在通知中心

---

## 🍎 macOS Notification Behavior

**Q: 為什麼我在 macOS 上看不到通知彈窗，但操作仍然有效？**

在 macOS 上，Chrome 擴充功能的通知透過 **"Google Chrome Helper (Alerts)"** 傳遞，並可能依系統設定而不顯示為彈窗。
這是正常的系統行為，並非錯誤。

**為什麼會這樣:**

- macOS 完全控制通知顯示
- 通知可能會被以下設定抑制:
  - 通知樣式設為 **None**
  - **Focus Mode / Do Not Disturb**
  - 焦點設定在 **裝置之間共享**
- Chrome 擴充功能無法覆寫這些規則

**在 macOS 上需要檢查:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**重要說明:**

- 即使未顯示彈窗，通知通常仍會記錄在 Notification Center
- 若未採取任何動作，操作會安全取消

---

## 🐧 Linux Notification Behavior

**Q: 為什麼我在 Linux 上使用快捷鍵時會看到通知彈窗？**

在 Linux 中使用快捷鍵（Ctrl+Shift+U 或 Ctrl+Shift+V）時，可能會出現小型通知彈窗。
這是正常行為，並非錯誤。

**為什麼會這樣:**

- Linux 桌面環境（GNOME、KDE、Xfce 等）控制通知的顯示方式
- SmartURLs 使用通知來確認操作
- 擴充功能無法控制通知可見性

**在 Linux 上需要檢查或調整:**

你可以在桌面環境中調整 Chrome 通知設定，改變通知顯示方式:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

無論通知是否可見，快捷鍵都能正常運作。
