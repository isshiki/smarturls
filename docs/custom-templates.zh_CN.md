# 📘 SmartURLs 模板指南 (v1.4.0+)

本指南介绍如何使用 SmartURLs 的自定义模板功能。
模板在**单行输入字段**中编写，但可以使用 `$nl` 标记生成多行输出。

SmartURLs 有意保持轻量。它**从不读取网页内容**，仅使用 **URL 和浏览器标签页信息**工作。

## 1. 基本标记

SmartURLs 严格基于标签页元数据和当前 URL 替换标记。

| 标记         | 描述                   | 示例输出                                      |
| ------------ | ---------------------- | --------------------------------------------- |
| `$title`     | 标签页中显示的页面标题 | `Why the Moon?`                               |
| `$url`       | 完整 URL               | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | 仅主机名               | `www.youtube.com`                             |
| `$path`      | URL 的路径部分         | `/watch`                                      |
| `$basename`  | 路径的最后一段         | `watch`                                       |
| `$idx`       | 标签页索引（从 1 开始）| `3`                                           |
| `$date`      | 本地日期 (YYYY-MM-DD)  | `2025-01-12`                                  |
| `$time`      | 本地时间 (HH:MM:SS)    | `14:03:55`                                    |
| `$date(utc)` | UTC 日期               | `2025-01-12`                                  |
| `$time(utc)` | UTC 时间               | `05:03:55`                                    |
| `$nl`        | 插入换行符             | *(在输出中生成换行)*                          |

### 上面使用的示例 URL 和标题

为了展示标记如何展开，这些示例使用：

📘 **标题**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

从此 URL：

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (查询参数) → `bmC-FwibsZg`

日期和时间是示例；实际输出取决于您的系统时钟。

## 2. 查询参数标记

SmartURLs 可以直接从 URL 中提取查询参数。

🔤 **语法**

```text
$<param>
```

📄 **示例**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| 标记 | 输出          |
| ---- | ------------- |
| `$v` | `bmC-FwibsZg` |
| `$t` | `123`         |

如果参数不存在，其值将变为空字符串。

## 3. 条件块

条件块允许模板**仅在存在特定查询参数时**输出某些文本。

🔤 **语法**

🔹 **单个参数**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **多个参数（AND 条件）**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

在条件块内：

* `$v`、`$t` 等正常展开
* `$nl`、`$title`、`$domain` 也可以使用
* 不允许嵌套块
* 没有 `else` 可用

如果不满足条件，整个块将从输出中删除。

## 4. 模板示例和模式

模板写成*一行*，但可以通过 `$nl` 输出多行。

本节中使用的示例 URL 和标题：

📘 **标题**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.1 Markdown: 标题 + URL

🛠 **模板**

```template
$title$nl$url
```

💬 **输出**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.2 Markdown 列表项

🛠 **模板**

```template
- [$title]($url)
```

💬 **输出**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.3 YouTube 视频 ID（仅在存在时）

🛠 **模板**

```template
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **输出**

```output
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

如果缺少 `v=`：

```output
Why the Moon?
https://example.com/page
```

### 4.4 生成 YouTube 缩略图 URL

基于已知的 YouTube 缩略图模式：

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

🛠 **模板**

```template
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

💬 **输出**

```output
Thumbnail: https://img.youtube.com/vi/bmC-FwibsZg/maxresdefault.jpg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.5 嵌入 YouTube 缩略图 (Markdown)

🛠 **模板**

```template
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

💬 **输出**

```output
![thumb](https://img.youtube.com/vi/bmC-FwibsZg/mqdefault.jpg)
[Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.6 时间戳（如果可用）

🛠 **模板**

```template
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

💬 **输出**

```output
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.7 多参数条件

🛠 **模板**

```template
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

💬 **输出**

```output
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.8 日志格式（域名 + 路径）

🛠 **模板**

```template
[$domain] $path$nl$url
```

💬 **输出**

```output
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.9 文件名样式标题

🛠 **模板**

```template
## $basename: $title$nl$url
```

💬 **输出**

```output
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.10 极简主义

🛠 **模板**

```template
$title — $url
```

💬 **输出**

```output
Why the Moon? — https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.11 每日日志条目

🛠 **模板**

```template
- [$title]($url) — $date $time
```

💬 **输出**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123) — 2025-01-12 14:03:55
```

### 4.12 带分隔符的多行

🛠 **模板**

```template
$title$nl$url$nl$nl$domain
```

💬 **输出**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123

www.youtube.com
```

## 5. 限制

SmartURLs 有意保持简单。

❌ SmartURLs `不会`：

* 解析网页内容（SmartURLs 没有访问或读取 HTML 页面的权限）
* 读取元数据或缩略图
* 在页面上执行 JavaScript
* 提取 OG 标签、作者或描述
* 支持嵌套条件或 `else`

✔️ SmartURLs `仅`使用：

* 标签页标题
* URL 组件
* 查询参数
* 简单的标记替换
* 可选的条件块

这确保了在所有网站上的一致行为。

## 6. 版本兼容性

这些功能适用于：**SmartURLs v1.4.0 及更高版本**

## 7. 反馈

如有功能请求或问题，请在 GitHub 上开 issue：

<https://github.com/isshiki/SmartURLs/issues>
