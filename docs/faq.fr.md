# 📘 SmartURLs Notification FAQ (FR)

Cette FAQ explique pourquoi les notifications de confirmation peuvent ne pas apparaître lors de l'utilisation de raccourcis clavier.
Les notifications sont contrôlées par les paramètres du système d'exploitation et du navigateur. SmartURLs ne peut pas contourner ces règles.

## 💻 Windows Notification Behavior

**Q: Pourquoi ne vois-je pas toujours les pop-ups de notification sur Windows ?**

Sous Windows, le comportement des notifications dépend des **paramètres de notifications du système** et de **Focus Assist (Do Not Disturb)**.
Il s'agit d'un comportement normal du système et non d'un bug.

**Pourquoi cela arrive :**

- Windows contrôle comment et quand les pop-ups de notification sont affichés
- Les notifications peuvent :
  - Être affichées en pop-ups
  - Être regroupées ou réduites
  - Être supprimées par **Focus Assist**
- SmartURLs ne peut pas contrôler la visibilité des notifications

**À vérifier sur Windows :**

- **Les notifications sont activées pour Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist est désactivé**
  - Settings -> System -> Focus

**Notes importantes :**

- Les raccourcis clavier fonctionnent même si les notifications sont masquées
- Les messages de confirmation peuvent encore être enregistrés dans le centre de notifications

---

## 🍎 macOS Notification Behavior

**Q: Pourquoi ne vois-je pas de pop-ups de notification sur macOS alors que les actions fonctionnent ?**

Sous macOS, les notifications des extensions Chrome sont délivrées via **"Google Chrome Helper (Alerts)"** et peuvent ne pas apparaître en pop-ups selon les paramètres du système.
Il s'agit d'un comportement normal du système et non d'un bug.

**Pourquoi cela arrive :**

- macOS contrôle entièrement l'affichage des notifications
- Les notifications peuvent être supprimées par :
  - Style de notification défini sur **None**
  - **Focus Mode / Do Not Disturb**
  - Paramètres de focus **partagés entre appareils**
- Les extensions Chrome ne peuvent pas contourner ces règles

**À vérifier sur macOS :**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Notes importantes :**

- Même si les pop-ups ne s'affichent pas, les notifications sont généralement enregistrées dans Notification Center
- Si aucune action n'est effectuée, l'opération est annulée en toute sécurité

---

## 🐧 Linux Notification Behavior

**Q: Pourquoi vois-je un pop-up de notification lors de l'utilisation des raccourcis clavier sur Linux ?**

Lorsque vous utilisez des raccourcis clavier (Ctrl+Shift+U ou Ctrl+Shift+V) sous Linux, un petit pop-up de notification peut apparaître.
Il s'agit d'un comportement normal et non d'un bug.

**Pourquoi cela arrive :**

- Les environnements de bureau Linux (GNOME, KDE, Xfce, etc.) contrôlent la manière dont les notifications sont affichées
- SmartURLs utilise des notifications pour confirmer les actions
- L'extension ne peut pas contrôler la visibilité des notifications

**À vérifier ou ajuster sur Linux :**

Vous pouvez changer la façon dont les notifications sont affichées en ajustant les paramètres de notifications de Chrome dans votre environnement de bureau :

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Les raccourcis clavier continuent de fonctionner normalement, quelle que soit la visibilité des notifications.
