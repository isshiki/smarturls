# 📘 SmartURLs Template Guide (v1.4.0+)

This guide explains how to use the custom template feature of SmartURLs.
Templates are written in a **single-line input field**, but can produce multi-line output using the `$nl` token.

SmartURLs is intentionally lightweight. It **never reads webpage contents** and works **only with the URL and browser tab information**.

## 1. Basic Tokens

SmartURLs replaces tokens based strictly on tab metadata and the current URL.

| Token        | Description                 | Example Output                                |
| ------------ | --------------------------- | --------------------------------------------- |
| `$title`     | Page title shown in the tab | `Why the Moon?`                               |
| `$url`       | Full URL                    | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Hostname only               | `www.youtube.com`                             |
| `$path`      | Path part of the URL        | `/watch`                                      |
| `$basename`  | Last segment of the path    | `watch`                                       |
| `$idx`       | Tab index (1-based)         | `3`                                           |
| `$date`      | Local date (YYYY-MM-DD)     | `2025-01-12`                                  |
| `$time`      | Local time (HH:MM:SS)       | `14:03:55`                                    |
| `$date(utc)` | UTC date                    | `2025-01-12`                                  |
| `$time(utc)` | UTC time                    | `05:03:55`                                    |
| `$nl`        | Inserts a newline           | *(produces line breaks in output)*            |

### Example URL and Title Used Above

To show how tokens expand, these examples use:

📘 **Example Title**

```text
Why the Moon?
```

🔗 **Example URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

From this URL:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (query parameter) → `bmC-FwibsZg`

Dates and times are examples; actual output depends on your system clock.

## 2. Query Parameter Tokens

SmartURLs can extract query parameters directly from the URL.

🔤 **Syntax**

```text
$<param>
```

🔗 **Example URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Output        |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

If a parameter does not exist, its value becomes an empty string.

## 3. Conditional Blocks

Conditional blocks allow templates to output certain text **only if specific query parameters are present**.

🔤 **Syntax**

🔹 **Single parameter**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Multiple parameters (AND condition)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

Inside a conditional block:

* `$v`, `$t`, etc. expand normally
* `$nl`, `$title`, `$domain` also work
* Nested blocks are not allowed
* No `else` is available

If conditions are not met, the entire block is removed from output.

## 4. Template Examples & Patterns

Templates are written as *one line*, but may output multiple lines via `$nl`.

Example URL and title used in this section:

📘 **Title**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.1 Markdown: Title + URL

🛠 **Template**

```template
$title$nl$url
```

💬 **Output**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.2 Markdown List Item

🛠 **Template**

```template
- [$title]($url)
```

💬 **Output**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.3 YouTube Video ID (only if present)

🛠 **Template**

```template
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```output
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

If `v=` is missing:

```output
Why the Moon?
https://example.com/page
```

### 4.4 Generate YouTube Thumbnail URL

Based on the known YouTube thumbnail pattern:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

🛠 **Template**

```template
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```output
Thumbnail: https://img.youtube.com/vi/bmC-FwibsZg/maxresdefault.jpg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.5 Embed YouTube Thumbnail (Markdown)

🛠 **Template**

```template
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

💬 **Output**

```output
![thumb](https://img.youtube.com/vi/bmC-FwibsZg/mqdefault.jpg)
[Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.6 Timestamp (if available)

🛠 **Template**

```template
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```output
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.7 Multi-parameter Conditional

🛠 **Template**

```template
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

💬 **Output**

```output
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.8 Log Format (domain + path)

🛠 **Template**

```template
[$domain] $path$nl$url
```

💬 **Output**

```output
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.9 Filename-style Heading

🛠 **Template**

```template
## $basename: $title$nl$url
```

💬 **Output**

```output
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.10 Minimalist

🛠 **Template**

```template
$title — $url
```

💬 **Output**

```output
Why the Moon? — https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.11 Daily Log Entry

🛠 **Template**

```template
- [$title]($url) — $date $time
```

💬 **Output**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123) — 2025-01-12 14:03:55
```

### 4.12 Multi-line with Separator

🛠 **Template**

```template
$title$nl$url$nl---$nl$domain
```

💬 **Output**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
---
www.youtube.com
```

## 5. Limitations

SmartURLs intentionally stays simple.

❌ SmartURLs `DOES NOT`:

* Parse webpage content (SmartURLs does NOT have permission to access or read HTML pages)
* Read metadata or thumbnails
* Execute JavaScript on the page
* Extract OG tags, authors, or descriptions
* Support nested conditionals or `else`

✔️ SmartURLs `ONLY` uses:

* Tab title
* URL components
* Query parameters
* Simple token replacement
* Optional conditional blocks

This ensures consistent behavior across all websites.

## 6. Version Compatibility

These features are available in: **SmartURLs v1.4.0 and later**

## 7. Feedback

For feature requests or questions, please open an issue here:

<https://github.com/isshiki/SmartURLs/issues>
