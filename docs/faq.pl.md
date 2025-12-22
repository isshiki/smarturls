# 📘 SmartURLs Notification FAQ (PL)

To FAQ wyjaśnia, dlaczego powiadomienia potwierdzające mogą się nie pojawić podczas używania skrótów klawiszowych.
Powiadomienia są kontrolowane przez ustawienia systemu operacyjnego i przeglądarki. SmartURLs nie może nadpisać tych zasad.

## 🪟 Windows Notification Behavior

**Q: Dlaczego czasami nie widzę wyskakujących powiadomień w Windows?**

W Windows zachowanie powiadomień zależy od **ustawień powiadomień systemu** i **Focus Assist (Do Not Disturb)**.
To normalne zachowanie systemu, a nie błąd.

**Dlaczego tak się dzieje:**

- Windows kontroluje jak i kiedy wyświetlane są wyskakujące powiadomienia
- Powiadomienia mogą:
  - Być wyświetlane jako pop-upy
  - Być grupowane lub zwijane
  - Być tłumione przez **Focus Assist**
- SmartURLs nie może kontrolować widoczności powiadomień

**Co sprawdzić w Windows:**

- **Powiadomienia są włączone dla Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist jest wyłączony**
  - Settings -> System -> Focus

**Ważne uwagi:**

- Skróty klawiszowe działają nawet, gdy powiadomienia są ukryte
- Wiadomości potwierdzające mogą być nadal rejestrowane w centrum powiadomień

---

## 🍎 macOS Notification Behavior

**Q: Dlaczego nie widzę wyskakujących powiadomień na macOS, mimo że działania działają?**

W macOS powiadomienia z rozszerzeń Chrome są dostarczane przez **"Google Chrome Helper (Alerts)"** i mogą nie pojawiać się jako pop-upy w zależności od ustawień systemu.
To normalne zachowanie systemu, a nie błąd.

**Dlaczego tak się dzieje:**

- macOS całkowicie kontroluje wyświetlanie powiadomień
- Powiadomienia mogą być tłumione przez:
  - Styl powiadomień ustawiony na **None**
  - **Focus Mode / Do Not Disturb**
  - Ustawienia Focus **współdzielone między urządzeniami**
- Rozszerzenia Chrome nie mogą nadpisać tych zasad

**Co sprawdzić w macOS:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Ważne uwagi:**

- Nawet jeśli pop-upy nie są wyświetlane, powiadomienia zwykle są rejestrowane w Notification Center
- Jeśli nie zostanie podjęta żadna akcja, operacja zostaje bezpiecznie anulowana

---

## 🐧 Linux Notification Behavior

**Q: Dlaczego widzę wyskakujące powiadomienie podczas używania skrótów klawiszowych w Linux?**

Podczas używania skrótów klawiszowych (Ctrl+Shift+U lub Ctrl+Shift+V) w Linux może pojawić się małe wyskakujące powiadomienie.
To normalne zachowanie i nie jest to błąd.

**Dlaczego tak się dzieje:**

- Środowiska pulpitu Linux (GNOME, KDE, Xfce itp.) kontrolują sposób wyświetlania powiadomień
- SmartURLs używa powiadomień do potwierdzania działań
- Rozszerzenie nie może kontrolować widoczności powiadomień

**Co sprawdzić lub dostosować w Linux:**

Możesz zmienić sposób wyświetlania powiadomień, dostosowując ustawienia powiadomień Chrome w swoim środowisku pulpitu:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Skróty klawiszowe działają normalnie niezależnie od widoczności powiadomień.
