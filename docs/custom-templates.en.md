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

📘 **Title**

```text
Why the Moon?
```

🔗 **URL**

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

📄 **Example**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Output        |
| -- | - |
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

## 4. Template Examples

Templates are written as *one line*, but may output multiple lines via `$nl`.

### 4.1 Markdown: Title + URL

🛠 🛠 **Template**

```text
$title$nl$url
```

💬 **Output**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Markdown List Item

🛠 **Template**

```text
- [$title]($url)
```

💬 **Output**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 YouTube Video ID (only if present)

🛠 **Template**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

If `v=` is missing:

```text
Why the Moon?
https://example.com/page
```

### 4.4 GitHub Issue Summary

🛠 **Template**

```text
## ${$basename}: $title$nl$url
```

💬 **Output**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Log Format (domain + path)

🛠 **Template**

```text
[$domain] $path$nl$url
```

💬 **Output**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Practical Template Patterns

Below are ready-to-use patterns for Markdown, logs, YouTube utilities, and conditional formatting.

Example URL used:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Classic Markdown

```text
$title$nl$url
```

Output:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Markdown List

```text
- [$title]($url)
```

Output:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 Domain + Path Log

```text
[$domain] $path$nl$url
```

Output:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 GitHub Issue-style Summary

```text
## ${$basename}: $title$nl$url
```

Output:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 YouTube Utilities

#### 5.5.1 Show Video ID only when present

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

#### 5.5.2 Generate Thumbnail URL

Based on the known YouTube thumbnail pattern:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Template:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

#### 5.5.3 Markdown Thumbnail Embed

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.6 Timestamp (if available)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

Output:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 Multi-parameter Conditional

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

Output:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 Minimalist

```text
$title — $url
```

### 5.9 Daily Log Entry

```text
- [$title]($url) — $date $time
```

### 5.10 Filename-style Summary

```text
$basename — $title
```

### 5.11 Multi-line with Separator

```text
$title$nl$url$nl$nl$domain
```

## 6. Limitations

SmartURLs intentionally stays simple.

❌ SmartURLs `DOES NOT`:

* Parse webpage content
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

## 7. Version Compatibility

These features are available in: **SmartURLs v1.4.0 and later**

## 8. Feedback

For feature requests or questions, please open an issue on GitHub.
