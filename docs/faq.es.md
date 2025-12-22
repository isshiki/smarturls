# 📘 SmartURLs Notification FAQ (ES)

Este FAQ explica por qué las notificaciones de confirmación pueden no aparecer al usar atajos de teclado.
Las notificaciones están controladas por la configuración del sistema operativo y del navegador. SmartURLs no puede anular esas reglas.

## 🪟 Windows Notification Behavior

**Q: ¿Por qué a veces no veo ventanas emergentes de notificación en Windows?**

En Windows, el comportamiento de las notificaciones depende de la **configuración de notificaciones del sistema** y de **Focus Assist (Do Not Disturb)**.
Esto es un comportamiento normal del sistema y no es un error.

**Por qué ocurre:**

- Windows controla cómo y cuándo se muestran los pop-ups de notificación
- Las notificaciones pueden:
  - Mostrarse como pop-ups
  - Agruparse o contraerse
  - Ser suprimidas por **Focus Assist**
- SmartURLs no puede controlar la visibilidad de las notificaciones

**Qué revisar en Windows:**

- **Las notificaciones están habilitadas para Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist está deshabilitado**
  - Settings -> System -> Focus

**Notas importantes:**

- Los atajos de teclado funcionan aunque las notificaciones estén ocultas
- Los mensajes de confirmación aún pueden registrarse en el centro de notificaciones

---

## 🍎 macOS Notification Behavior

**Q: ¿Por qué no veo ventanas emergentes de notificación en macOS aunque las acciones funcionan?**

En macOS, las notificaciones de extensiones de Chrome se entregan a través de **"Google Chrome Helper (Alerts)"** y pueden no aparecer como pop-ups según la configuración del sistema.
Esto es un comportamiento normal del sistema y no es un error.

**Por qué ocurre:**

- macOS controla completamente la visualización de notificaciones
- Las notificaciones pueden ser suprimidas por:
  - Estilo de notificación configurado como **None**
  - **Focus Mode / Do Not Disturb**
  - Configuraciones de enfoque **compartidas entre dispositivos**
- Las extensiones de Chrome no pueden anular estas reglas

**Qué revisar en macOS:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Notas importantes:**

- Incluso si no se muestran pop-ups, las notificaciones suelen registrarse en el Notification Center
- Si no se realiza ninguna acción, la operación se cancela de forma segura

---

## 🐧 Linux Notification Behavior

**Q: ¿Por qué veo un popup de notificación al usar atajos de teclado en Linux?**

Cuando usas atajos de teclado (Ctrl+Shift+U o Ctrl+Shift+V) en Linux, puede aparecer un pequeño popup de notificación.
Esto es un comportamiento normal y no es un error.

**Por qué ocurre:**

- Los entornos de escritorio Linux (GNOME, KDE, Xfce, etc.) controlan cómo se muestran las notificaciones
- SmartURLs usa notificaciones para confirmar acciones
- La extensión no puede controlar la visibilidad de las notificaciones

**Qué revisar o ajustar en Linux:**

Puedes cambiar cómo se muestran las notificaciones ajustando la configuración de notificaciones de Chrome en tu entorno de escritorio:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Los atajos de teclado siguen funcionando normalmente, independientemente de la visibilidad de las notificaciones.
