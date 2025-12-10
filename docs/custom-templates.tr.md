# 📘 SmartURLs Şablon Kılavuzu (v1.4.0+)

Bu kılavuz, SmartURLs'nin özel şablon özelliğinin nasıl kullanılacağını açıklar.
Şablonlar **tek satırlık bir giriş alanında** yazılır, ancak `$nl` belirteci kullanılarak çok satırlı çıktı üretebilir.

SmartURLs kasıtlı olarak hafiftir. **Web sayfası içeriğini asla okumaz** ve **yalnızca URL ve tarayıcı sekmesi bilgileriyle** çalışır.

## 1. Temel Belirteçler

SmartURLs, belirteçleri kesinlikle sekme meta verilerine ve geçerli URL'ye göre değiştirir.

| Belirteç     | Açıklama                          | Örnek Çıktı                                   |
| ------------ | --------------------------------- | --------------------------------------------- |
| `$title`     | Sekmede gösterilen sayfa başlığı  | `Why the Moon?`                               |
| `$url`       | Tam URL                           | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Yalnızca ana bilgisayar adı       | `www.youtube.com`                             |
| `$path`      | URL'nin yol kısmı                 | `/watch`                                      |
| `$basename`  | Yolun son segmenti                | `watch`                                       |
| `$idx`       | Sekme dizini (1 tabanlı)          | `3`                                           |
| `$date`      | Yerel tarih (YYYY-MM-DD)          | `2025-01-12`                                  |
| `$time`      | Yerel saat (HH:MM:SS)             | `14:03:55`                                    |
| `$date(utc)` | UTC tarihi                        | `2025-01-12`                                  |
| `$time(utc)` | UTC saati                         | `05:03:55`                                    |
| `$nl`        | Yeni satır ekler                  | *(çıktıda satır sonları üretir)*             |

### Yukarıda Kullanılan Örnek URL ve Başlık

Belirteçlerin nasıl genişlediğini göstermek için bu örnekler şunları kullanır:

📘 **Başlık**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Bu URL'den:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (sorgu parametresi) → `bmC-FwibsZg`

Tarihler ve saatler örnektir; gerçek çıktı sistem saatinize bağlıdır.

## 2. Sorgu Parametresi Belirteçleri

SmartURLs, sorgu parametrelerini doğrudan URL'den çıkarabilir.

🔤 **Sözdizimi**

```text
$<param>
```

📄 **Örnek**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Belirteç | Çıktı         |
| -------- | ------------- |
| `$v`     | `bmC-FwibsZg` |
| `$t`     | `123`         |

Bir parametre mevcut değilse, değeri boş bir dize olur.

## 3. Koşullu Bloklar

Koşullu bloklar, şablonların **yalnızca belirli sorgu parametreleri mevcutsa** belirli metni çıkarmasına olanak tanır.

🔤 **Sözdizimi**

🔹 **Tek parametre**

```text
{{q=v: ... }}
```

🔸 **Çoklu parametreler (VE koşulu)**

```text
{{q=v,t: ... }}
```

Koşullu bir blok içinde:

* `$v`, `$t` vb. normal şekilde genişler
* `$nl`, `$title`, `$domain` da çalışır
* İç içe bloklar izin verilmez
* `else` kullanılamaz

Koşullar karşılanmazsa, bloğun tamamı çıktıdan kaldırılır.

## 4. Şablon Örnekleri

Şablonlar *tek satır* olarak yazılır, ancak `$nl` aracılığıyla birden çok satır çıkarabilir.

### 4.1 Markdown: Başlık + URL

🛠 **Şablon**

```text
$title$nl$url
```

💬 **Çıktı**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Markdown Liste Öğesi

🛠 **Şablon**

```text
- [$title]($url)
```

💬 **Çıktı**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 YouTube Video ID'si (yalnızca mevcutsa)

🛠 **Şablon**

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

💬 **Çıktı**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

`v=` eksikse:

```text
Why the Moon?
https://example.com/page
```

### 4.4 GitHub Issue Özeti

🛠 **Şablon**

```text
## ${$basename}: $title$nl$url
```

💬 **Çıktı**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Günlük Formatı (alan adı + yol)

🛠 **Şablon**

```text
[$domain] $path$nl$url
```

💬 **Çıktı**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Pratik Şablon Kalıpları

Aşağıda Markdown, günlükler, YouTube yardımcı programları ve koşullu biçimlendirme için kullanıma hazır kalıplar bulunmaktadır.

Kullanılan örnek URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Klasik Markdown

```text
$title$nl$url
```

Çıktı:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Markdown Listesi

```text
- [$title]($url)
```

Çıktı:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 Alan Adı + Yol Günlüğü

```text
[$domain] $path$nl$url
```

Çıktı:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 GitHub Issue Tarzı Özet

```text
## ${$basename}: $title$nl$url
```

Çıktı:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 YouTube Yardımcı Programları

#### 5.5.1 Video ID'sini yalnızca mevcutsa göster

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

#### 5.5.2 Küçük Resim URL'si Oluştur

Bilinen YouTube küçük resim desenine dayalı:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Şablon:

```text
{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}$title$nl$url
```

#### 5.5.3 Markdown Küçük Resmi Yerleştir

```text
{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}[$title]($url)
```

### 5.6 Zaman Damgası (varsa)

```text
{{q=t:Timestamp: $t sec$nl}}$title$nl$url
```

Çıktı:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 Çok Parametreli Koşul

```text
{{q=v,t:Video: $v ($t sec)$nl}}$url
```

Çıktı:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 Minimalist

```text
$title — $url
```

### 5.9 Günlük Günlük Girişi

```text
- [$title]($url) — $date $time
```

### 5.10 Dosya Adı Tarzı Özet

```text
$basename — $title
```

### 5.11 Ayırıcılı Çok Satırlı

```text
$title$nl$url$nl$nl$domain
```

## 6. Sınırlamalar

SmartURLs kasıtlı olarak basit kalır.

❌ SmartURLs `YAPMAZ`:

* Web sayfası içeriğini ayrıştırma
* Meta verileri veya küçük resimleri okuma
* Sayfada JavaScript yürütme
* OG etiketlerini, yazarları veya açıklamaları çıkarma
* İç içe koşulları veya `else`'i destekleme

✔️ SmartURLs `YALNIZCA` şunları kullanır:

* Sekme başlığı
* URL bileşenleri
* Sorgu parametreleri
* Basit belirteç değiştirme
* İsteğe bağlı koşullu bloklar

Bu, tüm web sitelerinde tutarlı davranış sağlar.

## 7. Sürüm Uyumluluğu

Bu özellikler şurada kullanılabilir: **SmartURLs v1.4.0 ve sonrası**

## 8. Geri Bildirim

Özellik istekleri veya sorular için lütfen GitHub'da bir issue açın.
