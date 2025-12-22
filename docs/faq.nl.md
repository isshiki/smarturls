# 📘 SmartURLs Notification FAQ (NL)

Deze FAQ legt uit waarom bevestigingsmeldingen mogelijk niet verschijnen bij het gebruik van sneltoetsen.
Meldingen worden bepaald door de instellingen van je besturingssysteem en browser. SmartURLs kan deze regels niet overschrijven.

## 💻 Windows Notification Behavior

**Q: Waarom zie ik soms geen meldingspop-ups in Windows?**

In Windows hangt het meldingsgedrag af van de **systeemmeldingsinstellingen** en **Focus Assist (Do Not Disturb)**.
Dit is normaal systeemgedrag en geen bug.

**Waarom dit gebeurt:**

- Windows bepaalt hoe en wanneer meldingspop-ups worden weergegeven
- Meldingen kunnen:
  - Als pop-ups worden weergegeven
  - Gegroepeerd of ingeklapt worden
  - Onderdrukt worden door **Focus Assist**
- SmartURLs kan de zichtbaarheid van meldingen niet beheren

**Wat je in Windows moet controleren:**

- **Meldingen zijn ingeschakeld voor Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist is uitgeschakeld**
  - Settings -> System -> Focus

**Belangrijke opmerkingen:**

- Sneltoetsen werken ook als meldingen verborgen zijn
- Bevestigingsberichten kunnen nog steeds in het meldingencentrum worden vastgelegd

---

## 🍎 macOS Notification Behavior

**Q: Waarom zie ik geen meldingspop-ups op macOS terwijl acties wel werken?**

Op macOS worden meldingen van Chrome-extensies geleverd via **"Google Chrome Helper (Alerts)"** en kunnen ze, afhankelijk van de systeeminstellingen, niet als pop-ups verschijnen.
Dit is normaal systeemgedrag en geen bug.

**Waarom dit gebeurt:**

- macOS beheert de meldingsweergave volledig
- Meldingen kunnen worden onderdrukt door:
  - Meldingsstijl ingesteld op **None**
  - **Focus Mode / Do Not Disturb**
  - Focusinstellingen die **tussen apparaten worden gedeeld**
- Chrome-extensies kunnen deze regels niet overschrijven

**Wat je op macOS moet controleren:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Belangrijke opmerkingen:**

- Ook als pop-ups niet worden weergegeven, worden meldingen meestal opgeslagen in Notification Center
- Als er geen actie wordt ondernomen, wordt de bewerking veilig geannuleerd

---

## 🐧 Linux Notification Behavior

**Q: Waarom zie ik een meldingspop-up wanneer ik sneltoetsen gebruik op Linux?**

Wanneer je sneltoetsen (Ctrl+Shift+U of Ctrl+Shift+V) gebruikt op Linux, kan er een klein meldingspop-up verschijnen.
Dit is normaal gedrag en geen bug.

**Waarom dit gebeurt:**

- Linux-desktopomgevingen (GNOME, KDE, Xfce, enz.) bepalen hoe meldingen worden weergegeven
- SmartURLs gebruikt meldingen om acties te bevestigen
- De extensie kan de zichtbaarheid van meldingen niet beheren

**Wat je op Linux kunt controleren of aanpassen:**

Je kunt aanpassen hoe meldingen worden weergegeven door de Chrome-meldingsinstellingen in je desktopomgeving te wijzigen:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Sneltoetsen blijven normaal werken, ongeacht of meldingen zichtbaar zijn.
