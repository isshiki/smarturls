# 📘 SmartURLs Notification FAQ (EN)

This FAQ explains why confirmation notifications may not appear when using keyboard shortcuts.
Notifications are controlled by your operating system and browser settings. SmartURLs cannot override those rules.

## 💻 Windows Notification Behavior

**Q: Why don't I see notification popups on Windows sometimes?**

On Windows, notification behavior depends on **system notification settings** and **Focus Assist (Do Not Disturb)**.
This is normal system behavior and not a bug.

**Why this happens:**

- Windows controls how and when notification popups are shown
- Notifications may be:
  - Shown as pop-ups
  - Grouped or collapsed
  - Suppressed by **Focus Assist**
- SmartURLs cannot control notification visibility

**What to check on Windows:**

- **Notifications are enabled for Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist is disabled**
  - Settings -> System -> Focus

**Important notes:**

- Keyboard shortcuts work even if notifications are hidden
- Confirmation messages may still be recorded in the notification center

---

## 🍎 macOS Notification Behavior

**Q: Why don't I see notification popups on macOS, even though actions are working?**

On macOS, notifications from Chrome extensions are delivered via **"Google Chrome Helper (Alerts)"** and may not appear as pop-ups depending on system settings.
This is normal behavior and not a bug.

**Why this happens:**

- macOS fully controls notification display
- Notifications may be suppressed by:
  - Notification style set to **None**
  - **Focus Mode / Do Not Disturb**
  - Focus settings being **shared across devices**
- Chrome extensions cannot override these rules

**What to check on macOS:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Important notes:**

- Even if pop-ups are not shown, notifications are usually recorded in Notification Center
- If no action is taken, the operation is safely cancelled

---

## 🐧 Linux Notification Behavior

**Q: Why do I see a notification popup when using keyboard shortcuts on Linux?**

When you use keyboard shortcuts (Ctrl+Shift+U or Ctrl+Shift+V) on Linux, you may see a small notification popup appear.
This is normal behavior and not a bug.

**Why this happens:**

- Linux desktop environments (GNOME, KDE, Xfce, etc.) control how notifications are displayed
- SmartURLs uses notifications to confirm actions
- The extension cannot control notification visibility

**What to check or adjust on Linux:**

You can change how notifications are shown by adjusting Chrome notification settings in your desktop environment:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Keyboard shortcuts continue to work normally regardless of notification visibility.
