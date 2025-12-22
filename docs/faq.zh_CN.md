# 📘 SmartURLs Notification FAQ (ZH-CN)

此FAQ说明在使用键盘快捷键时，确认通知为何可能不会出现。
通知由操作系统和浏览器设置控制，SmartURLs无法覆盖这些规则。

## 🪟 Windows Notification Behavior

**Q: 为什么我在 Windows 上有时看不到通知弹窗？**

在 Windows 上，通知行为取决于**系统通知设置**和**Focus Assist (Do Not Disturb)**。
这是正常的系统行为，并非错误。

**为什么会这样:**

- Windows 控制通知弹窗的显示方式和时间
- 通知可能会:
  - 以弹窗形式显示
  - 被分组或折叠
  - 被 **Focus Assist** 抑制
- SmartURLs 无法控制通知可见性

**在 Windows 上需要检查:**

- **已为 Google Chrome 启用通知**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist 已关闭**
  - Settings -> System -> Focus

**重要说明:**

- 即使通知被隐藏，快捷键仍可正常工作
- 确认消息仍可能记录在通知中心

---

## 🍎 macOS Notification Behavior

**Q: 为什么我在 macOS 上看不到通知弹窗，但操作仍然有效？**

在 macOS 上，来自 Chrome 扩展的通知通过 **"Google Chrome Helper (Alerts)"** 投递，并可能根据系统设置不显示为弹窗。
这是正常的系统行为，并非错误。

**为什么会这样:**

- macOS 完全控制通知显示
- 通知可能会被以下设置抑制:
  - 通知样式设为 **None**
  - **Focus Mode / Do Not Disturb**
  - 焦点设置在 **设备之间共享**
- Chrome 扩展无法覆盖这些规则

**在 macOS 上需要检查:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**重要说明:**

- 即使没有显示弹窗，通知通常也会记录在 Notification Center
- 如果未采取任何操作，操作会安全取消

---

## 🐧 Linux Notification Behavior

**Q: 为什么我在 Linux 上使用快捷键时会看到通知弹窗？**

在 Linux 中使用快捷键（Ctrl+Shift+U 或 Ctrl+Shift+V）时，可能会出现小的通知弹窗。
这是正常行为，并非错误。

**为什么会这样:**

- Linux 桌面环境（GNOME、KDE、Xfce 等）控制通知的显示方式
- SmartURLs 使用通知来确认操作
- 扩展无法控制通知可见性

**在 Linux 上需要检查或调整:**

你可以通过在桌面环境中调整 Chrome 通知设置来改变通知显示方式:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

无论通知是否可见，快捷键都能正常工作。
