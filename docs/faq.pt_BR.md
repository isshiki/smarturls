# 📘 SmartURLs Notification FAQ (PT-BR)

Este FAQ explica por que as notificações de confirmação podem não aparecer ao usar atalhos de teclado.
As notificações são controladas pelas configurações do sistema operacional e do navegador. O SmartURLs não pode substituir essas regras.

## 🪟 Windows Notification Behavior

**Q: Por que às vezes não vejo pop-ups de notificação no Windows?**

No Windows, o comportamento das notificações depende das **configurações de notificações do sistema** e do **Focus Assist (Do Not Disturb)**.
Isso é um comportamento normal do sistema e não é um bug.

**Por que isso acontece:**

- O Windows controla como e quando os pop-ups de notificação são exibidos
- As notificações podem:
  - Ser exibidas como pop-ups
  - Ser agrupadas ou recolhidas
  - Ser suprimidas pelo **Focus Assist**
- O SmartURLs não pode controlar a visibilidade das notificações

**O que verificar no Windows:**

- **As notificações estão habilitadas para o Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **O Focus Assist está desativado**
  - Settings -> System -> Focus

**Notas importantes:**

- Atalhos de teclado funcionam mesmo que as notificações estejam ocultas
- As mensagens de confirmação ainda podem ser registradas no centro de notificações

---

## 🍎 macOS Notification Behavior

**Q: Por que não vejo pop-ups de notificação no macOS mesmo quando as ações funcionam?**

No macOS, as notificações de extensões do Chrome são entregues via **"Google Chrome Helper (Alerts)"** e podem não aparecer como pop-ups dependendo das configurações do sistema.
Isso é um comportamento normal do sistema e não é um bug.

**Por que isso acontece:**

- O macOS controla totalmente a exibição de notificações
- As notificações podem ser suprimidas por:
  - Estilo de notificação definido como **None**
  - **Focus Mode / Do Not Disturb**
  - Configurações de Focus **compartilhadas entre dispositivos**
- As extensões do Chrome não podem substituir essas regras

**O que verificar no macOS:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Notas importantes:**

- Mesmo que os pop-ups não sejam mostrados, as notificações geralmente são registradas na Notification Center
- Se nenhuma ação for tomada, a operação é cancelada com segurança

---

## 🐧 Linux Notification Behavior

**Q: Por que vejo um pop-up de notificação ao usar atalhos de teclado no Linux?**

Quando você usa atalhos de teclado (Ctrl+Shift+U ou Ctrl+Shift+V) no Linux, um pequeno pop-up de notificação pode aparecer.
Isso é um comportamento normal e não é um bug.

**Por que isso acontece:**

- Ambientes de desktop Linux (GNOME, KDE, Xfce etc.) controlam como as notificações são exibidas
- O SmartURLs usa notificações para confirmar ações
- A extensão não pode controlar a visibilidade das notificações

**O que verificar ou ajustar no Linux:**

Você pode alterar como as notificações são exibidas ajustando as configurações de notificações do Chrome no seu ambiente desktop:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Os atalhos de teclado continuam funcionando normalmente, independentemente da visibilidade das notificações.
