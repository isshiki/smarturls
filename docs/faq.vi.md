# 📘 SmartURLs Notification FAQ (VI)

FAQ này giải thích vì sao thông báo xác nhận có thể không xuất hiện khi dùng phím tắt.
Thông báo được kiểm soát bởi cài đặt hệ điều hành và trình duyệt. SmartURLs không thể ghi đè các quy tắc này.

## 🪟 Windows Notification Behavior

**Q: Vì sao đôi khi tôi không thấy pop-up thông báo trên Windows?**

Trên Windows, hành vi thông báo phụ thuộc vào **cài đặt thông báo hệ thống** và **Focus Assist (Do Not Disturb)**.
Đây là hành vi bình thường của hệ thống và không phải lỗi.

**Vì sao điều này xảy ra:**

- Windows kiểm soát cách và thời điểm pop-up thông báo được hiển thị
- Thông báo có thể:
  - Hiển thị dưới dạng pop-up
  - Được nhóm hoặc thu gọn
  - Bị **Focus Assist** chặn
- SmartURLs không thể kiểm soát việc hiển thị thông báo

**Cần kiểm tra trên Windows:**

- **Thông báo đã được bật cho Google Chrome**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist đã tắt**
  - Settings -> System -> Focus

**Lưu ý quan trọng:**

- Phím tắt vẫn hoạt động ngay cả khi thông báo bị ẩn
- Thông điệp xác nhận vẫn có thể được ghi lại trong trung tâm thông báo

---

## 🍎 macOS Notification Behavior

**Q: Vì sao tôi không thấy pop-up thông báo trên macOS dù thao tác vẫn hoạt động?**

Trên macOS, thông báo từ các tiện ích Chrome được gửi qua **"Google Chrome Helper (Alerts)"** và có thể không hiện dưới dạng pop-up tùy theo cài đặt hệ thống.
Đây là hành vi bình thường của hệ thống và không phải lỗi.

**Vì sao điều này xảy ra:**

- macOS kiểm soát hoàn toàn việc hiển thị thông báo
- Thông báo có thể bị chặn bởi:
  - Kiểu thông báo đặt thành **None**
  - **Focus Mode / Do Not Disturb**
  - Cài đặt Focus **được chia sẻ giữa các thiết bị**
- Tiện ích Chrome không thể ghi đè các quy tắc này

**Cần kiểm tra trên macOS:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**Lưu ý quan trọng:**

- Dù pop-up không hiển thị, thông báo thường vẫn được ghi trong Notification Center
- Nếu không có hành động nào, thao tác sẽ được hủy an toàn

---

## 🐧 Linux Notification Behavior

**Q: Vì sao tôi thấy pop-up thông báo khi dùng phím tắt trên Linux?**

Khi dùng phím tắt (Ctrl+Shift+U hoặc Ctrl+Shift+V) trên Linux, có thể xuất hiện một pop-up thông báo nhỏ.
Đây là hành vi bình thường và không phải lỗi.

**Vì sao điều này xảy ra:**

- Các môi trường desktop Linux (GNOME, KDE, Xfce, v.v.) kiểm soát cách hiển thị thông báo
- SmartURLs dùng thông báo để xác nhận thao tác
- Tiện ích không thể kiểm soát việc hiển thị thông báo

**Cần kiểm tra hoặc điều chỉnh trên Linux:**

Bạn có thể thay đổi cách hiển thị thông báo bằng cách điều chỉnh cài đặt thông báo Chrome trong môi trường desktop của bạn:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

Phím tắt vẫn hoạt động bình thường bất kể thông báo có hiển thị hay không.
