# 📘 SmartURLs Notification FAQ (JA)

このFAQでは、キーボードショートカット使用時に確認通知が表示されない理由を説明します。
通知はOSとブラウザの設定により制御されます。SmartURLsはそれらのルールを変更できません。

## 💻 Windows Notification Behavior

**Q: Windowsで通知ポップアップが表示されないことがあるのはなぜですか？**

Windowsの通知動作は、**システム通知設定** と **Focus Assist (Do Not Disturb)** に依存します。
これは通常のシステム動作であり、バグではありません。

**なぜ起きるのか:**

- Windowsが通知ポップアップの表示方法とタイミングを制御します
- 通知は以下のようになることがあります:
  - ポップアップとして表示
  - グループ化または折りたたみ
  - **Focus Assist** により抑制
- SmartURLsは通知の表示可否を制御できません

**Windowsで確認すること:**

- **Google Chromeの通知が有効になっている**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assistが無効になっている**
  - Settings -> System -> Focus

**重要な注意点:**

- 通知が非表示でもショートカットは正常に動作します
- 確認メッセージは通知センターに記録される場合があります

---

## 🍎 macOS Notification Behavior

**Q: macOSで通知ポップアップが表示されないのに動作するのはなぜですか？**

macOSでは、Chrome拡張の通知は **"Google Chrome Helper (Alerts)"** を通じて配信され、設定によってはポップアップ表示されない場合があります。
これは通常のシステム動作であり、バグではありません。

**なぜ起きるのか:**

- macOSが通知表示を完全に制御します
- 通知は以下で抑制される場合があります:
  - 通知スタイルが **None** に設定
  - **Focus Mode / Do Not Disturb**
  - フォーカス設定が **デバイス間で共有** されている
- Chrome拡張はこれらのルールを変更できません

**macOSで確認すること:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**重要な注意点:**

- ポップアップが表示されなくても通知センターに記録されるのが通常です
- 操作が行われない場合、処理は安全にキャンセルされます

---

## 🐧 Linux Notification Behavior

**Q: Linuxでキーボードショートカットを使うと通知ポップアップが出るのはなぜですか？**

Linuxでキーボードショートカット（Ctrl+Shift+U / Ctrl+Shift+V）を使うと、小さな通知ポップアップが表示されることがあります。
これは通常の動作であり、バグではありません。

**なぜ起きるのか:**

- Linuxのデスクトップ環境（GNOME、KDE、Xfceなど）が通知の表示方法を制御します
- SmartURLsは操作確認のために通知を使用します
- 拡張機能は通知の表示可否を制御できません

**Linuxで確認または調整すること:**

デスクトップ環境のChrome通知設定を調整することで、通知の表示方法を変更できます:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

通知の表示有無に関わらず、ショートカットは正常に動作します。
