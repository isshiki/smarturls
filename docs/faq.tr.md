# 📘 SmartURLs Notification FAQ (TR)

Bu SSS, klavye kısayolları kullanılırken onay bildirimlerinin neden görünmeyebileceğini açıklar.
Bildirimler işletim sistemi ve tarayıcı ayarları tarafından kontrol edilir. SmartURLs bu kuralları geçersiz kılamaz.

## 💻 Windows Notification Behavior

**Q: Windows'ta bazen neden bildirim pop-up'larını görmüyorum?**

Windows'ta bildirim davranışı, **sistem bildirim ayarları** ve **Focus Assist (Do Not Disturb)** ayarlarına bağlıdır.
Bu normal sistem davranışıdır ve bir hata değildir.

**Neden olur:**

- Windows, bildirim pop-up'larının nasıl ve ne zaman gösterileceğini kontrol eder
- Bildirimler şu şekilde olabilir:
  - Pop-up olarak gösterilir
  - Gruplanır veya daraltılır
  - **Focus Assist** tarafından bastırılır
- SmartURLs bildirim görünürlüğünü kontrol edemez

**Windows'ta kontrol edilecekler:**

- **Google Chrome için bildirimler etkin**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist devre dışı**
  - Settings -> System -> Focus

**Önemli notlar:**

- Bildirimler gizli olsa bile kısayollar çalışmaya devam eder
- Onay mesajları bildirim merkezine kaydedilmiş olabilir

---

## 🍎 macOS Notification Behavior

**Q: macOS'ta bildirim pop-up'larını görmüyorum ama işlemler çalışıyor. Neden?**

macOS'ta Chrome uzantılarından gelen bildirimler **"Google Chrome Helper (Alerts)"** aracılığıyla iletilir ve sistem ayarlarına bağlı olarak pop-up olarak görünmeyebilir.
Bu normal sistem davranışıdır ve bir hata değildir.

**Neden olur:**

- macOS bildirim gösterimini tamamen kontrol eder
- Bildirimler şu nedenle bastırılabilir:
  - Bildirim stili **None** olarak ayarlanmış
  - **Focus Mode / Do Not Disturb**
  - Odak ayarları **cihazlar arasında paylaşılıyor**
- Chrome uzantıları bu kuralları geçersiz kılamaz

**macOS'ta kontrol edilecekler:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Önemli notlar:**

- Pop-up'lar görünmese bile bildirimler genellikle Notification Center'da kaydedilir
- Herhangi bir işlem yapılmazsa işlem güvenle iptal edilir

---

## 🐧 Linux Notification Behavior

**Q: Linux'ta klavye kısayollarını kullanırken neden bildirim pop-up'ı görüyorum?**

Linux'ta klavye kısayolları (Ctrl+Shift+U veya Ctrl+Shift+V) kullanıldığında küçük bir bildirim pop-up'ı görünebilir.
Bu normal davranıştır ve bir hata değildir.

**Neden olur:**

- Linux masaüstü ortamları (GNOME, KDE, Xfce vb.) bildirimlerin nasıl gösterileceğini kontrol eder
- SmartURLs eylemleri doğrulamak için bildirimleri kullanır
- Uzantı bildirim görünürlüğünü kontrol edemez

**Linux'ta kontrol edilecekler veya ayarlanacaklar:**

Masaüstü ortamında Chrome bildirim ayarlarını değiştirerek bildirimlerin nasıl gösterileceğini ayarlayabilirsiniz:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Kısayollar, bildirimlerin görünürlüğünden bağımsız olarak normal çalışır.
