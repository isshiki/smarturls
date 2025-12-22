# 📘 SmartURLs Notification FAQ (ID)

FAQ ini menjelaskan mengapa notifikasi konfirmasi mungkin tidak muncul saat menggunakan pintasan keyboard.
Notifikasi dikendalikan oleh pengaturan sistem operasi dan browser Anda. SmartURLs tidak dapat menimpa aturan tersebut.

## 💻 Windows Notification Behavior

**Q: Mengapa terkadang saya tidak melihat pop-up notifikasi di Windows?**

Di Windows, perilaku notifikasi bergantung pada **pengaturan notifikasi sistem** dan **Focus Assist (Do Not Disturb)**.
Ini adalah perilaku sistem yang normal dan bukan bug.

**Mengapa ini terjadi:**

- Windows mengontrol bagaimana dan kapan pop-up notifikasi ditampilkan
- Notifikasi dapat:
  - Ditampilkan sebagai pop-up
  - Dikelompokkan atau disembunyikan
  - Ditekan oleh **Focus Assist**
- SmartURLs tidak dapat mengontrol visibilitas notifikasi

**Apa yang perlu diperiksa di Windows:**

- **Notifikasi diaktifkan untuk Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist dinonaktifkan**
  - Settings -> System -> Focus

**Catatan penting:**

- Pintasan keyboard tetap berfungsi meskipun notifikasi disembunyikan
- Pesan konfirmasi mungkin tetap tercatat di pusat notifikasi

---

## 🍎 macOS Notification Behavior

**Q: Mengapa saya tidak melihat pop-up notifikasi di macOS meskipun tindakan berfungsi?**

Di macOS, notifikasi dari ekstensi Chrome dikirim melalui **"Google Chrome Helper (Alerts)"** dan mungkin tidak muncul sebagai pop-up tergantung pengaturan sistem.
Ini adalah perilaku sistem yang normal dan bukan bug.

**Mengapa ini terjadi:**

- macOS sepenuhnya mengontrol tampilan notifikasi
- Notifikasi dapat ditekan oleh:
  - Gaya notifikasi disetel ke **None**
  - **Focus Mode / Do Not Disturb**
  - Pengaturan fokus yang **dibagikan antar perangkat**
- Ekstensi Chrome tidak dapat menimpa aturan ini

**Apa yang perlu diperiksa di macOS:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Catatan penting:**

- Walaupun pop-up tidak muncul, notifikasi biasanya tercatat di Notification Center
- Jika tidak ada tindakan yang diambil, operasi dibatalkan dengan aman

---

## 🐧 Linux Notification Behavior

**Q: Mengapa saya melihat pop-up notifikasi saat menggunakan pintasan keyboard di Linux?**

Saat menggunakan pintasan keyboard (Ctrl+Shift+U atau Ctrl+Shift+V) di Linux, pop-up notifikasi kecil dapat muncul.
Ini adalah perilaku normal dan bukan bug.

**Mengapa ini terjadi:**

- Lingkungan desktop Linux (GNOME, KDE, Xfce, dll.) mengontrol bagaimana notifikasi ditampilkan
- SmartURLs menggunakan notifikasi untuk mengonfirmasi tindakan
- Ekstensi tidak dapat mengontrol visibilitas notifikasi

**Apa yang perlu diperiksa atau disesuaikan di Linux:**

Anda dapat mengubah cara notifikasi ditampilkan dengan menyesuaikan pengaturan notifikasi Chrome di lingkungan desktop Anda:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Pintasan keyboard tetap berfungsi normal terlepas dari visibilitas notifikasi.
