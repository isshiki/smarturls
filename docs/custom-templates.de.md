# 📘 SmartURLs Template-Anleitung (v1.4.0+)

Diese Anleitung erklärt, wie Sie die benutzerdefinierte Vorlagenfunktion von SmartURLs verwenden.
Vorlagen werden in einem **einzeiligen Eingabefeld** geschrieben, können aber mit dem `$nl`-Token mehrzeilige Ausgaben erzeugen.

SmartURLs ist absichtlich leichtgewichtig. Es **liest niemals Webseiteninhalte** und funktioniert **nur mit der URL und Browser-Tab-Informationen**.

## 1. Basis-Tokens

SmartURLs ersetzt Tokens ausschließlich basierend auf Tab-Metadaten und der aktuellen URL.

| Token        | Beschreibung                    | Beispielausgabe                               |
| ------------ | ------------------------------- | --------------------------------------------- |
| `$title`     | Seitentitel im Tab              | `Why the Moon?`                               |
| `$url`       | Vollständige URL                | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Nur Hostname                    | `www.youtube.com`                             |
| `$path`      | Pfad-Teil der URL               | `/watch`                                      |
| `$basename`  | Letztes Segment des Pfads       | `watch`                                       |
| `$idx`       | Tab-Index (1-basiert)           | `3`                                           |
| `$date`      | Lokales Datum (YYYY-MM-DD)      | `2025-01-12`                                  |
| `$time`      | Lokale Zeit (HH:MM:SS)          | `14:03:55`                                    |
| `$date(utc)` | UTC-Datum                       | `2025-01-12`                                  |
| `$time(utc)` | UTC-Zeit                        | `05:03:55`                                    |
| `$nl`        | Fügt einen Zeilenumbruch ein    | *(erzeugt Zeilenumbrüche in der Ausgabe)*    |

### Beispiel-URL und -Titel von oben

Um zu zeigen, wie Tokens expandiert werden, verwenden diese Beispiele:

📘 **Titel**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Aus dieser URL:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (Query-Parameter) → `bmC-FwibsZg`

Datum und Uhrzeit sind Beispiele; die tatsächliche Ausgabe hängt von Ihrer Systemuhr ab.

## 2. Query-Parameter-Tokens

SmartURLs kann Query-Parameter direkt aus der URL extrahieren.

🔤 **Syntax**

```text
$<param>
```

📄 **Beispiel**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Ausgabe       |
| -- | - |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Wenn ein Parameter nicht existiert, wird sein Wert zu einem leeren String.

## 3. Bedingte Blöcke

Bedingte Blöcke ermöglichen es Vorlagen, bestimmten Text **nur dann auszugeben, wenn bestimmte Query-Parameter vorhanden sind**.

🔤 **Syntax**

🔹 **Einzelner Parameter**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Mehrere Parameter (UND-Bedingung)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

Innerhalb eines bedingten Blocks:

* `$v`, `$t`, etc. expandieren normal
* `$nl`, `$title`, `$domain` funktionieren auch
* Verschachtelte Blöcke sind nicht erlaubt
* Kein `else` ist verfügbar

Wenn die Bedingungen nicht erfüllt sind, wird der gesamte Block aus der Ausgabe entfernt.

## 4. Vorlagenbeispiele

Vorlagen werden als *eine Zeile* geschrieben, können aber über `$nl` mehrere Zeilen ausgeben.

### 4.1 Markdown: Titel + URL

🛠 **Vorlage**

```text
$title$nl$url
```

💬 **Ausgabe**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Markdown-Listenelement

🛠 **Vorlage**

```text
- [$title]($url)
```

💬 **Ausgabe**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 YouTube-Video-ID (nur wenn vorhanden)

🛠 **Vorlage**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Ausgabe**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Wenn `v=` fehlt:

```text
Why the Moon?
https://example.com/page
```

### 4.4 GitHub-Issue-Zusammenfassung

🛠 **Vorlage**

```text
## ${$basename}: $title$nl$url
```

💬 **Ausgabe**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Log-Format (Domain + Pfad)

🛠 **Vorlage**

```text
[$domain] $path$nl$url
```

💬 **Ausgabe**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Praktische Vorlagenmuster

Nachfolgend finden Sie gebrauchsfertige Muster für Markdown, Logs, YouTube-Utilities und bedingte Formatierung.

Verwendete Beispiel-URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Klassisches Markdown

```text
$title$nl$url
```

Ausgabe:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Markdown-Liste

```text
- [$title]($url)
```

Ausgabe:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 Domain + Pfad Log

```text
[$domain] $path$nl$url
```

Ausgabe:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 GitHub-Issue-Zusammenfassung

```text
## ${$basename}: $title$nl$url
```

Ausgabe:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 YouTube-Utilities

#### 5.5.1 Video-ID nur anzeigen, wenn vorhanden

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

#### 5.5.2 Thumbnail-URL generieren

Basierend auf dem bekannten YouTube-Thumbnail-Muster:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Vorlage:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

#### 5.5.3 Markdown-Thumbnail einbetten

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.6 Zeitstempel (falls verfügbar)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

Ausgabe:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 Multi-Parameter-Bedingung

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

Ausgabe:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 Minimalistisch

```text
$title — $url
```

### 5.9 Täglicher Log-Eintrag

```text
- [$title]($url) — $date $time
```

### 5.10 Dateiname-ähnliche Zusammenfassung

```text
$basename — $title
```

### 5.11 Mehrzeilig mit Trennzeichen

```text
$title$nl$url$nl$nl$domain
```

## 6. Einschränkungen

SmartURLs bleibt absichtlich einfach.

❌ SmartURLs macht `NICHT`:

* Webseiteninhalte parsen
* Metadaten oder Thumbnails lesen
* JavaScript auf der Seite ausführen
* OG-Tags, Autoren oder Beschreibungen extrahieren
* Verschachtelte Bedingungen oder `else` unterstützen

✔️ SmartURLs verwendet `NUR`:

* Tab-Titel
* URL-Komponenten
* Query-Parameter
* Einfache Token-Ersetzung
* Optionale bedingte Blöcke

Dies gewährleistet konsistentes Verhalten auf allen Webseiten.

## 7. Versionskompatibilität

Diese Funktionen sind verfügbar in: **SmartURLs v1.4.0 und später**

## 8. Feedback

Für Feature-Anfragen oder Fragen öffnen Sie bitte ein Issue auf GitHub.
