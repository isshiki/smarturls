# 📘 SmartURLs テンプレートガイド (v1.4.0+)

このガイドでは、SmartURLsのカスタムテンプレート機能の使用方法を説明します。
テンプレートは**1行の入力フィールド**に記述しますが、`$nl`トークンを使用して複数行の出力を生成できます。

SmartURLsは意図的に軽量です。**Webページのコンテンツを読み取ることはなく**、**URLとブラウザのタブ情報のみ**で動作します。

## 1. 基本トークン

SmartURLsは、タブのメタデータと現在のURLに基づいてトークンを置き換えます。

| トークン     | 説明                            | 出力例                                        |
| ------------ | ------------------------------- | --------------------------------------------- |
| `$title`     | タブに表示されるページタイトル  | `Why the Moon?`                               |
| `$url`       | 完全なURL                       | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | ホスト名のみ                    | `www.youtube.com`                             |
| `$path`      | URLのパス部分                   | `/watch`                                      |
| `$basename`  | パスの最後のセグメント          | `watch`                                       |
| `$idx`       | タブインデックス(1始まり)       | `3`                                           |
| `$date`      | ローカル日付(YYYY-MM-DD)        | `2025-01-12`                                  |
| `$time`      | ローカル時刻(HH:MM:SS)          | `14:03:55`                                    |
| `$date(utc)` | UTC日付                         | `2025-01-12`                                  |
| `$time(utc)` | UTC時刻                         | `05:03:55`                                    |
| `$nl`        | 改行を挿入                      | *(出力に改行を生成)*                          |

### 上記で使用した例のURLとタイトル

トークンがどのように展開されるかを示すため、これらの例では以下を使用します:

📘 **タイトル**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

このURLから:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (クエリパラメータ) → `bmC-FwibsZg`

日付と時刻は例です。実際の出力はシステムクロックに依存します。

## 2. クエリパラメータトークン

SmartURLsは、URLから直接クエリパラメータを抽出できます。

🔤 **構文**

```text
$<param>
```

📄 **例**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| トークン | 出力          |
| -------- | ------------- |
| `$v`     | `bmC-FwibsZg` |
| `$t`     | `123`         |

パラメータが存在しない場合、その値は空文字列になります。

## 3. 条件付きブロック

条件付きブロックを使用すると、**特定のクエリパラメータが存在する場合にのみ**、テンプレートが特定のテキストを出力できます。

🔤 **構文**

🔹 **単一パラメータ**

```text
{{q=v: ... }}
```

🔸 **複数パラメータ(AND条件)**

```text
{{q=v,t: ... }}
```

条件付きブロック内では:

* `$v`、`$t`などは通常通り展開されます
* `$nl`、`$title`、`$domain`も機能します
* ネストされたブロックは許可されていません
* `else`は使用できません

条件が満たされない場合、ブロック全体が出力から削除されます。

## 4. テンプレートの例

テンプレートは*1行*として記述されますが、`$nl`を使用して複数行を出力できます。

### 4.1 Markdown: タイトル + URL

🛠 **テンプレート**

```text
$title$nl$url
```

💬 **出力**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Markdownリストアイテム

🛠 **テンプレート**

```text
- [$title]($url)
```

💬 **出力**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 YouTube動画ID(存在する場合のみ)

🛠 **テンプレート**

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

💬 **出力**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

`v=`が欠けている場合:

```text
Why the Moon?
https://example.com/page
```

### 4.4 GitHubイシューの概要

🛠 **テンプレート**

```text
## ${$basename}: $title$nl$url
```

💬 **出力**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 ログ形式(ドメイン + パス)

🛠 **テンプレート**

```text
[$domain] $path$nl$url
```

💬 **出力**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. 実用的なテンプレートパターン

以下は、Markdown、ログ、YouTubeユーティリティ、条件付き書式設定のための即座に使用できるパターンです。

使用する例のURL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 クラシックMarkdown

```text
$title$nl$url
```

出力:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Markdownリスト

```text
- [$title]($url)
```

出力:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 ドメイン + パスログ

```text
[$domain] $path$nl$url
```

出力:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 GitHubイシュースタイルの概要

```text
## ${$basename}: $title$nl$url
```

出力:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 YouTubeユーティリティ

#### 5.5.1 動画IDが存在する場合のみ表示

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

#### 5.5.2 サムネイルURLを生成

既知のYouTubeサムネイルパターンに基づく:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

テンプレート:

```text
{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}$title$nl$url
```

#### 5.5.3 Markdownサムネイルを埋め込む

```text
{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}[$title]($url)
```

### 5.6 タイムスタンプ(利用可能な場合)

```text
{{q=t:Timestamp: $t sec$nl}}$title$nl$url
```

出力:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 複数パラメータ条件

```text
{{q=v,t:Video: $v ($t sec)$nl}}$url
```

出力:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 ミニマリスト

```text
$title — $url
```

### 5.9 日次ログエントリ

```text
- [$title]($url) — $date $time
```

### 5.10 ファイル名スタイルの概要

```text
$basename — $title
```

### 5.11 セパレータ付き複数行

```text
$title$nl$url$nl$nl$domain
```

## 6. 制限事項

SmartURLsは意図的にシンプルなままです。

❌ SmartURLsが`行わないこと`:

* Webページのコンテンツを解析
* メタデータやサムネイルを読み取り
* ページ上でJavaScriptを実行
* OGタグ、著者、または説明を抽出
* ネストされた条件や`else`をサポート

✔️ SmartURLsが`使用するもののみ`:

* タブのタイトル
* URLコンポーネント
* クエリパラメータ
* シンプルなトークン置換
* オプションの条件付きブロック

これにより、すべてのWebサイトで一貫した動作が保証されます。

## 7. バージョン互換性

これらの機能は以下で利用可能です: **SmartURLs v1.4.0以降**

## 8. フィードバック

機能リクエストや質問については、GitHubでイシューを開いてください。
