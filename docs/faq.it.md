# 📘 SmartURLs Notification FAQ (IT)

Questa FAQ spiega perché le notifiche di conferma potrebbero non apparire quando si usano le scorciatoie da tastiera.
Le notifiche sono controllate dalle impostazioni del sistema operativo e del browser. SmartURLs non può sovrascrivere queste regole.

## 💻 Windows Notification Behavior

**Q: Perché a volte non vedo i pop-up di notifica su Windows?**

In Windows, il comportamento delle notifiche dipende dalle **impostazioni di notifica del sistema** e da **Focus Assist (Do Not Disturb)**.
Questo è un comportamento normale del sistema e non è un bug.

**Perché succede:**

- Windows controlla come e quando vengono mostrati i pop-up di notifica
- Le notifiche possono:
  - Essere mostrate come pop-up
  - Essere raggruppate o ridotte
  - Essere soppresse da **Focus Assist**
- SmartURLs non può controllare la visibilità delle notifiche

**Cosa verificare su Windows:**

- **Le notifiche sono abilitate per Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist è disabilitato**
  - Settings -> System -> Focus

**Note importanti:**

- Le scorciatoie da tastiera funzionano anche se le notifiche sono nascoste
- I messaggi di conferma possono comunque essere registrati nel centro notifiche

---

## 🍎 macOS Notification Behavior

**Q: Perché non vedo i pop-up di notifica su macOS anche se le azioni funzionano?**

Su macOS, le notifiche delle estensioni Chrome vengono fornite tramite **"Google Chrome Helper (Alerts)"** e potrebbero non apparire come pop-up a seconda delle impostazioni di sistema.
Questo è un comportamento normale del sistema e non è un bug.

**Perché succede:**

- macOS controlla completamente la visualizzazione delle notifiche
- Le notifiche possono essere soppresse da:
  - Stile notifica impostato su **None**
  - **Focus Mode / Do Not Disturb**
  - Impostazioni di focus **condivise tra dispositivi**
- Le estensioni Chrome non possono sovrascrivere queste regole

**Cosa verificare su macOS:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Note importanti:**

- Anche se i pop-up non vengono mostrati, le notifiche di solito sono registrate nel Notification Center
- Se non viene intrapresa alcuna azione, l'operazione viene annullata in sicurezza

---

## 🐧 Linux Notification Behavior

**Q: Perché vedo un pop-up di notifica quando uso le scorciatoie da tastiera su Linux?**

Quando si usano le scorciatoie da tastiera (Ctrl+Shift+U o Ctrl+Shift+V) su Linux, può apparire un piccolo pop-up di notifica.
Questo è un comportamento normale e non è un bug.

**Perché succede:**

- Gli ambienti desktop Linux (GNOME, KDE, Xfce, ecc.) controllano come vengono mostrate le notifiche
- SmartURLs usa le notifiche per confermare le azioni
- L'estensione non può controllare la visibilità delle notifiche

**Cosa verificare o modificare su Linux:**

Puoi modificare come vengono mostrate le notifiche regolando le impostazioni di notifica di Chrome nel tuo ambiente desktop:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Le scorciatoie da tastiera continuano a funzionare normalmente indipendentemente dalla visibilità delle notifiche.
