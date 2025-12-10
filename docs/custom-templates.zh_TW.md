# 📘 SmartURLs 範本指南 (v1.4.0+)

本指南說明如何使用 SmartURLs 的自訂範本功能。
範本在**單行輸入欄位**中編寫，但可以使用 `$nl` 標記產生多行輸出。

SmartURLs 有意保持輕量。它**從不讀取網頁內容**，僅使用 **URL 和瀏覽器分頁資訊**工作。

## 1. 基本標記

SmartURLs 嚴格基於分頁中繼資料和目前 URL 替換標記。

| 標記         | 描述                     | 範例輸出                                      |
| ------------ | ------------------------ | --------------------------------------------- |
| `$title`     | 分頁中顯示的頁面標題     | `Why the Moon?`                               |
| `$url`       | 完整 URL                 | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | 僅主機名稱               | `www.youtube.com`                             |
| `$path`      | URL 的路徑部分           | `/watch`                                      |
| `$basename`  | 路徑的最後一段           | `watch`                                       |
| `$idx`       | 分頁索引（從 1 開始）    | `3`                                           |
| `$date`      | 本地日期 (YYYY-MM-DD)    | `2025-01-12`                                  |
| `$time`      | 本地時間 (HH:MM:SS)      | `14:03:55`                                    |
| `$date(utc)` | UTC 日期                 | `2025-01-12`                                  |
| `$time(utc)` | UTC 時間                 | `05:03:55`                                    |
| `$nl`        | 插入換行符               | *(在輸出中產生換行)*                          |

### 上面使用的範例 URL 和標題

為了展示標記如何展開，這些範例使用：

📘 **標題**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

從此 URL：

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (查詢參數) → `bmC-FwibsZg`

日期和時間是範例；實際輸出取決於您的系統時鐘。

## 2. 查詢參數標記

SmartURLs 可以直接從 URL 中擷取查詢參數。

🔤 **語法**

```text
$<param>
```

📄 **範例**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| 標記 | 輸出          |
| ---- | ------------- |
| `$v` | `bmC-FwibsZg` |
| `$t` | `123`         |

如果參數不存在，其值將變為空字串。

## 3. 條件區塊

條件區塊允許範本**僅在存在特定查詢參數時**輸出某些文字。

🔤 **語法**

🔹 **單一參數**

```text
{{q=v: ... }}
```

🔸 **多個參數（AND 條件）**

```text
{{q=v,t: ... }}
```

在條件區塊內：

* `$v`、`$t` 等正常展開
* `$nl`、`$title`、`$domain` 也可以使用
* 不允許巢狀區塊
* 沒有 `else` 可用

如果不滿足條件，整個區塊將從輸出中刪除。

## 4. 範本範例

範本寫成*一行*，但可以透過 `$nl` 輸出多行。

### 4.1 Markdown: 標題 + URL

🛠 **範本**

```text
$title$nl$url
```

💬 **輸出**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Markdown 清單項目

🛠 **範本**

```text
- [$title]($url)
```

💬 **輸出**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 YouTube 影片 ID（僅在存在時）

🛠 **範本**

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

💬 **輸出**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

如果缺少 `v=`：

```text
Why the Moon?
https://example.com/page
```

### 4.4 GitHub Issue 摘要

🛠 **範本**

```text
## ${$basename}: $title$nl$url
```

💬 **輸出**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 日誌格式（網域 + 路徑）

🛠 **範本**

```text
[$domain] $path$nl$url
```

💬 **輸出**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. 實用範本模式

以下是用於 Markdown、日誌、YouTube 工具和條件格式化的即用模式。

使用的範例 URL：

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 經典 Markdown

```text
$title$nl$url
```

輸出：

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Markdown 清單

```text
- [$title]($url)
```

輸出：

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 網域 + 路徑日誌

```text
[$domain] $path$nl$url
```

輸出：

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 GitHub Issue 樣式摘要

```text
## ${$basename}: $title$nl$url
```

輸出：

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 YouTube 工具

#### 5.5.1 僅在存在時顯示影片 ID

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

#### 5.5.2 產生縮圖 URL

基於已知的 YouTube 縮圖模式：

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

範本：

```text
{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}$title$nl$url
```

#### 5.5.3 嵌入 Markdown 縮圖

```text
{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}[$title]($url)
```

### 5.6 時間戳記（如果可用）

```text
{{q=t:Timestamp: $t sec$nl}}$title$nl$url
```

輸出：

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 多參數條件

```text
{{q=v,t:Video: $v ($t sec)$nl}}$url
```

輸出：

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 極簡主義

```text
$title — $url
```

### 5.9 每日日誌條目

```text
- [$title]($url) — $date $time
```

### 5.10 檔案名稱樣式摘要

```text
$basename — $title
```

### 5.11 帶分隔符的多行

```text
$title$nl$url$nl$nl$domain
```

## 6. 限制

SmartURLs 有意保持簡單。

❌ SmartURLs `不會`：

* 解析網頁內容
* 讀取中繼資料或縮圖
* 在頁面上執行 JavaScript
* 擷取 OG 標籤、作者或描述
* 支援巢狀條件或 `else`

✔️ SmartURLs `僅`使用：

* 分頁標題
* URL 元件
* 查詢參數
* 簡單的標記替換
* 可選的條件區塊

這確保了在所有網站上的一致行為。

## 7. 版本相容性

這些功能適用於：**SmartURLs v1.4.0 及更高版本**

## 8. 回饋

如有功能請求或問題，請在 GitHub 上開 issue。
