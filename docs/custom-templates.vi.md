# 📘 Hướng dẫn mẫu SmartURLs (v1.4.0+)

Hướng dẫn này giải thích cách sử dụng tính năng mẫu tùy chỉnh của SmartURLs.
Các mẫu được viết trong **trường nhập một dòng**, nhưng có thể tạo ra đầu ra nhiều dòng bằng cách sử dụng token `$nl`.

SmartURLs cố tình nhẹ. Nó **không bao giờ đọc nội dung trang web** và chỉ hoạt động **với URL và thông tin tab trình duyệt**.

## 1. Token cơ bản

SmartURLs thay thế token dựa trên siêu dữ liệu tab và URL hiện tại.

| Token        | Mô tả                             | Ví dụ đầu ra                                  |
| ------------ | --------------------------------- | --------------------------------------------- |
| `$title`     | Tiêu đề trang hiển thị trong tab  | `Why the Moon?`                               |
| `$url`       | URL đầy đủ                        | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Chỉ tên máy chủ                   | `www.youtube.com`                             |
| `$path`      | Phần đường dẫn của URL            | `/watch`                                      |
| `$basename`  | Phân đoạn cuối cùng của đường dẫn | `watch`                                       |
| `$idx`       | Chỉ số tab (bắt đầu từ 1)        | `3`                                           |
| `$date`      | Ngày địa phương (YYYY-MM-DD)      | `2025-01-12`                                  |
| `$time`      | Giờ địa phương (HH:MM:SS)         | `14:03:55`                                    |
| `$date(utc)` | Ngày UTC                          | `2025-01-12`                                  |
| `$time(utc)` | Giờ UTC                           | `05:03:55`                                    |
| `$nl`        | Chèn dòng mới                     | *(tạo ngắt dòng trong đầu ra)*               |

### Ví dụ URL và Tiêu đề được sử dụng ở trên

Để cho thấy cách token mở rộng, các ví dụ này sử dụng:

📘 **Tiêu đề**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Từ URL này:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (tham số truy vấn) → `bmC-FwibsZg`

Ngày và giờ là ví dụ; đầu ra thực tế phụ thuộc vào đồng hồ hệ thống của bạn.

## 2. Token tham số truy vấn

SmartURLs có thể trích xuất tham số truy vấn trực tiếp từ URL.

🔤 **Cú pháp**

```text
$<param>
```

📄 **Ví dụ**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Đầu ra        |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Nếu tham số không tồn tại, giá trị của nó trở thành chuỗi rỗng.

## 3. Khối có điều kiện

Các khối có điều kiện cho phép mẫu xuất ra văn bản nhất định **chỉ khi có các tham số truy vấn cụ thể**.

🔤 **Cú pháp**

🔹 **Tham số đơn**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Nhiều tham số (điều kiện VÀ)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

Bên trong khối có điều kiện:

* `$v`, `$t`, v.v. mở rộng bình thường
* `$nl`, `$title`, `$domain` cũng hoạt động
* Không cho phép khối lồng nhau
* Không có `else`

Nếu điều kiện không được đáp ứng, toàn bộ khối sẽ bị xóa khỏi đầu ra.

## 4. Ví dụ về mẫu

Các mẫu được viết dưới dạng *một dòng*, nhưng có thể xuất ra nhiều dòng thông qua `$nl`.

### 4.1 Markdown: Tiêu đề + URL

🛠 **Mẫu**

```text
$title$nl$url
```

💬 **Đầu ra**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Mục danh sách Markdown

🛠 **Mẫu**

```text
- [$title]($url)
```

💬 **Đầu ra**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 ID video YouTube (chỉ khi có)

🛠 **Mẫu**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Đầu ra**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Nếu thiếu `v=`:

```text
Why the Moon?
https://example.com/page
```

### 4.4 Tiêu đề kiểu tên tệp (sử dụng $basename)

🛠 **Mẫu**

```text
## $basename: $title$nl$url
```

💬 **Đầu ra**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Định dạng nhật ký (tên miền + đường dẫn)

🛠 **Mẫu**

```text
[$domain] $path$nl$url
```

💬 **Đầu ra**

```text
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Mẫu thực tế

Dưới đây là các mẫu sẵn sàng sử dụng cho Markdown, nhật ký, tiện ích YouTube và định dạng có điều kiện.

Ví dụ URL được sử dụng:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Tạo URL hình thu nhỏ

Dựa trên mẫu hình thu nhỏ YouTube đã biết:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Mẫu:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

### 5.2 Nhúng hình thu nhỏ Markdown

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.3 Dấu thời gian (nếu có)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

Đầu ra:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 Điều kiện đa tham số

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

Đầu ra:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 Tối giản

```text
$title — $url
```

### 5.6 Mục nhật ký hàng ngày

```text
- [$title]($url) — $date $time
```

### 5.7 Tóm tắt kiểu tên tệp

```text
$basename — $title
```

### 5.8 Nhiều dòng với dấu phân cách

```text
$title$nl$url$nl$nl$domain
```

## 6. Giới hạn

SmartURLs cố tình giữ đơn giản.

❌ SmartURLs `KHÔNG`:

* Phân tích nội dung trang web
* Đọc siêu dữ liệu hoặc hình thu nhỏ
* Thực thi JavaScript trên trang
* Trích xuất thẻ OG, tác giả hoặc mô tả
* Hỗ trợ điều kiện lồng nhau hoặc `else`

✔️ SmartURLs `CHỈ` sử dụng:

* Tiêu đề tab
* Thành phần URL
* Tham số truy vấn
* Thay thế token đơn giản
* Khối có điều kiện tùy chọn

Điều này đảm bảo hành vi nhất quán trên tất cả các trang web.

## 7. Khả năng tương thích phiên bản

Các tính năng này có sẵn trong: **SmartURLs v1.4.0 trở lên**

## 8. Phản hồi

Đối với yêu cầu tính năng hoặc câu hỏi, vui lòng mở issue trên GitHub.
