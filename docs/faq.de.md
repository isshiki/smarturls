# 📘 SmartURLs Notification FAQ (DE)

Diese FAQ erklärt, warum Bestätigungsbenachrichtigungen beim Verwenden von Tastenkürzeln möglicherweise nicht angezeigt werden.
Benachrichtigungen werden von den Einstellungen Ihres Betriebssystems und Browsers gesteuert. SmartURLs kann diese Regeln nicht überschreiben.

## 🪟 Windows Notification Behavior

**Q: Warum sehe ich unter Windows manchmal keine Benachrichtigungs-Pop-ups?**

Unter Windows hängt das Benachrichtigungsverhalten von **Systembenachrichtigungseinstellungen** und **Focus Assist (Do Not Disturb)** ab.
Das ist normales Systemverhalten und kein Fehler.

**Warum das passiert:**

- Windows steuert, wie und wann Benachrichtigungs-Pop-ups angezeigt werden
- Benachrichtigungen können:
  - Als Pop-ups angezeigt werden
  - Gruppiert oder eingeklappt werden
  - Durch **Focus Assist** unterdrückt werden
- SmartURLs kann die Sichtbarkeit von Benachrichtigungen nicht steuern

**Was Sie unter Windows prüfen können:**

- **Benachrichtigungen sind für Google Chrome aktiviert**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist ist deaktiviert**
  - Settings -> System -> Focus

**Wichtige Hinweise:**

- Tastenkürzel funktionieren auch, wenn Benachrichtigungen ausgeblendet sind
- Bestätigungsnachrichten werden möglicherweise trotzdem im Benachrichtigungscenter aufgezeichnet

---

## 🍎 macOS Notification Behavior

**Q: Warum sehe ich auf macOS keine Benachrichtigungs-Pop-ups, obwohl die Aktionen funktionieren?**

Unter macOS werden Benachrichtigungen von Chrome-Erweiterungen über **"Google Chrome Helper (Alerts)"** bereitgestellt und werden je nach Systemeinstellungen möglicherweise nicht als Pop-ups angezeigt.
Das ist normales Systemverhalten und kein Fehler.

**Warum das passiert:**

- macOS steuert die Benachrichtigungsanzeige vollständig
- Benachrichtigungen können unterdrückt werden durch:
  - Benachrichtigungsstil auf **None** gesetzt
  - **Focus Mode / Do Not Disturb**
  - Fokus-Einstellungen, die **zwischen Geräten geteilt** werden
- Chrome-Erweiterungen können diese Regeln nicht überschreiben

**Was Sie unter macOS prüfen können:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Wichtige Hinweise:**

- Auch wenn keine Pop-ups angezeigt werden, werden Benachrichtigungen normalerweise im Notification Center aufgezeichnet
- Wenn keine Aktion erfolgt, wird der Vorgang sicher abgebrochen

---

## 🐧 Linux Notification Behavior

**Q: Warum sehe ich unter Linux ein Benachrichtigungs-Popup, wenn ich Tastenkürzel benutze?**

Wenn Sie unter Linux Tastenkürzel verwenden (Ctrl+Shift+U oder Ctrl+Shift+V), kann ein kleines Benachrichtigungs-Popup angezeigt werden.
Das ist normales Verhalten und kein Fehler.

**Warum das passiert:**

- Linux-Desktop-Umgebungen (GNOME, KDE, Xfce usw.) steuern, wie Benachrichtigungen angezeigt werden
- SmartURLs verwendet Benachrichtigungen zur Bestätigung von Aktionen
- Die Erweiterung kann die Sichtbarkeit von Benachrichtigungen nicht steuern

**Was Sie unter Linux prüfen oder anpassen können:**

Sie können steuern, wie Benachrichtigungen angezeigt werden, indem Sie die Chrome-Benachrichtigungseinstellungen in Ihrer Desktopumgebung anpassen:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Tastenkürzel funktionieren unabhängig von der Sichtbarkeit der Benachrichtigungen normal.
