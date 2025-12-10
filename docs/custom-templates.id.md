# 📘 Panduan Template SmartURLs (v1.4.0+)

Panduan ini menjelaskan cara menggunakan fitur template kustom SmartURLs.
Template ditulis dalam **field input satu baris**, tetapi dapat menghasilkan output multi-baris menggunakan token `$nl`.

SmartURLs sengaja dibuat ringan. Ini **tidak pernah membaca konten halaman web** dan hanya bekerja **dengan URL dan informasi tab browser**.

## 1. Token Dasar

SmartURLs mengganti token berdasarkan metadata tab dan URL saat ini.

| Token        | Deskripsi                        | Contoh Output                                 |
| ------------ | -------------------------------- | --------------------------------------------- |
| `$title`     | Judul halaman di tab             | `Why the Moon?`                               |
| `$url`       | URL lengkap                      | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Hanya hostname                   | `www.youtube.com`                             |
| `$path`      | Bagian path dari URL             | `/watch`                                      |
| `$basename`  | Segmen terakhir dari path        | `watch`                                       |
| `$idx`       | Indeks tab (basis 1)             | `3`                                           |
| `$date`      | Tanggal lokal (YYYY-MM-DD)       | `2025-01-12`                                  |
| `$time`      | Waktu lokal (HH:MM:SS)           | `14:03:55`                                    |
| `$date(utc)` | Tanggal UTC                      | `2025-01-12`                                  |
| `$time(utc)` | Waktu UTC                        | `05:03:55`                                    |
| `$nl`        | Menyisipkan baris baru           | *(menghasilkan pemisah baris dalam output)*  |

### Contoh URL dan Judul yang Digunakan di Atas

Untuk menunjukkan bagaimana token diperluas, contoh ini menggunakan:

📘 **Judul**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Dari URL ini:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (parameter query) → `bmC-FwibsZg`

Tanggal dan waktu adalah contoh; output aktual bergantung pada jam sistem Anda.

## 2. Token Parameter Query

SmartURLs dapat mengekstrak parameter query langsung dari URL.

🔤 **Sintaks**

```text
$<param>
```

📄 **Contoh**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Output        |
| -- | - |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Jika parameter tidak ada, nilainya menjadi string kosong.

## 3. Blok Kondisional

Blok kondisional memungkinkan template menghasilkan teks tertentu **hanya jika parameter query tertentu ada**.

🔤 **Sintaks**

🔹 **Parameter tunggal**

```text
{{q=v: ... }}
```

🔸 **Beberapa parameter (kondisi DAN)**

```text
{{q=v,t: ... }}
```

Di dalam blok kondisional:

* `$v`, `$t`, dll. diperluas secara normal
* `$nl`, `$title`, `$domain` juga berfungsi
* Blok bersarang tidak diizinkan
* Tidak ada `else` yang tersedia

Jika kondisi tidak terpenuhi, seluruh blok dihapus dari output.

## 4. Contoh Template

Template ditulis sebagai *satu baris*, tetapi dapat menghasilkan beberapa baris melalui `$nl`.

### 4.1 Markdown: Judul + URL

🛠 **Template**

```text
$title$nl$url
```

💬 **Output**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Item Daftar Markdown

🛠 **Template**

```text
- [$title]($url)
```

💬 **Output**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 ID Video YouTube (hanya jika ada)

🛠 **Template**

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

💬 **Output**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Jika `v=` tidak ada:

```text
Why the Moon?
https://example.com/page
```

### 4.4 Ringkasan Issue GitHub

🛠 **Template**

```text
## ${$basename}: $title$nl$url
```

💬 **Output**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Format Log (domain + path)

🛠 **Template**

```text
[$domain] $path$nl$url
```

💬 **Output**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Pola Template Praktis

Berikut adalah pola siap pakai untuk Markdown, log, utilitas YouTube, dan pemformatan kondisional.

Contoh URL yang digunakan:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Markdown Klasik

```text
$title$nl$url
```

Output:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Daftar Markdown

```text
- [$title]($url)
```

Output:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 Log Domain + Path

```text
[$domain] $path$nl$url
```

Output:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 Ringkasan Gaya Issue GitHub

```text
## ${$basename}: $title$nl$url
```

Output:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 Utilitas YouTube

#### 5.5.1 Tampilkan ID video hanya jika ada

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

#### 5.5.2 Hasilkan URL Thumbnail

Berdasarkan pola thumbnail YouTube yang dikenal:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Template:

```text
{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}$title$nl$url
```

#### 5.5.3 Sematkan Thumbnail Markdown

```text
{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}[$title]($url)
```

### 5.6 Timestamp (jika tersedia)

```text
{{q=t:Timestamp: $t sec$nl}}$title$nl$url
```

Output:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 Kondisional Multi-parameter

```text
{{q=v,t:Video: $v ($t sec)$nl}}$url
```

Output:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 Minimalis

```text
$title — $url
```

### 5.9 Entri Log Harian

```text
- [$title]($url) — $date $time
```

### 5.10 Ringkasan Gaya Nama File

```text
$basename — $title
```

### 5.11 Multi-baris dengan Pemisah

```text
$title$nl$url$nl$nl$domain
```

## 6. Keterbatasan

SmartURLs sengaja tetap sederhana.

❌ SmartURLs `TIDAK`:

* Mengurai konten halaman web
* Membaca metadata atau thumbnail
* Menjalankan JavaScript di halaman
* Mengekstrak tag OG, penulis, atau deskripsi
* Mendukung kondisional bersarang atau `else`

✔️ SmartURLs `HANYA` menggunakan:

* Judul tab
* Komponen URL
* Parameter query
* Penggantian token sederhana
* Blok kondisional opsional

Ini memastikan perilaku konsisten di semua situs web.

## 7. Kompatibilitas Versi

Fitur-fitur ini tersedia di: **SmartURLs v1.4.0 dan yang lebih baru**

## 8. Umpan Balik

Untuk permintaan fitur atau pertanyaan, silakan buka issue di GitHub.
