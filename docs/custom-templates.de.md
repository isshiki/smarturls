# 📘 SmartURLs Template-Anleitung (v1.4.0+)

Diese Anleitung erklärt, wie Sie die benutzerdefinierte Vorlagenfunktion von SmartURLs verwenden.
Vorlagen werden in einem **einzeiligen Eingabefeld** geschrieben, können aber mit dem `$nl`-Token mehrzeilige Ausgaben erzeugen.

SmartURLs ist absichtlich leichtgewichtig. Es **liest niemals Webseiteninhalte** und funktioniert **nur mit der URL und Browser-Tab-Informationen**.

## 1. Basis-Tokens

SmartURLs ersetzt Tokens ausschließlich basierend auf Tab-Metadaten und der aktuellen URL.

| Token          | Beschreibung                                                                                                        | Beispielausgabe                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `$title`       | Seitentitel im Tab                                                                                                  | `Why the Moon?`                                                                         |
| `$title(html)` | HTML-escaped Seitentitel (konvertiert `&`, `<`, `>`, `"`, `'` in Entitäten). Sicher für HTML-Tags/-Attribute. | `Rock &amp; Roll &lt;Best Hits&gt;`<br>*(für Titel: "Rock & Roll \<Best Hits>")* |
| `$url`         | Vollständige URL                                                                                                    | `https://www.youtube.com/watch?v=bmC-FwibsZg`                                           |
| `$domain`    | Nur Hostname                    | `www.youtube.com`                             |
| `$path`      | Pfad-Teil der URL               | `/watch`                                      |
| `$basename`  | Letztes Segment des Pfads       | `watch`                                       |
| `$idx`       | Tab-Index (1-basiert)           | `3`                                           |
| `$date`      | Lokales Datum (YYYY-MM-DD)      | `2025-01-12`                                  |
| `$time`      | Lokale Zeit (HH:MM:SS)          | `14:03:55`                                    |
| `$date(utc)` | UTC-Datum                       | `2025-01-12`                                  |
| `$time(utc)` | UTC-Zeit                        | `05:03:55`                                    |
| `$nl`        | Fügt einen Zeilenumbruch ein    | *(erzeugt Zeilenumbrüche in der Ausgabe)*    |

> ⚠️ **Hinweis zu `$nl`**: Wird nur in Kopieren-benutzerdefinierten Vorlagen unterstützt. Kann nicht in Aus Text öffnen-benutzerdefinierten Vorlagen verwendet werden. Wenn Sie dieselbe Vorlage sowohl für Kopieren als auch für Öffnen wiederverwenden möchten, vermeiden Sie `$nl` in der Öffnungsvorlage oder verwenden Sie stattdessen den Intelligenten (automatische Erkennung)-Modus.

> ⚠️ **Hinweis zu `$title(html)`**: Wird nur in Kopieren-benutzerdefinierten Vorlagen unterstützt. Aus Text öffnen-benutzerdefinierte Vorlagen verarbeiten dieses Token nicht. Verwenden Sie für Öffnungsvorlagen stattdessen `$title`.

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

🔗 **Beispiel-URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Ausgabe       |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Wenn ein Parameter nicht existiert, wird sein Wert zu einem leeren String.

> ⚠️ **Hinweis zu Query-Parameter-Tokens**: Query-Parameter-Tokens (zum Beispiel `$v`, `$id`, `$tag`, etc.) werden nur in Kopieren-benutzerdefinierten Vorlagen ausgewertet. Sie werden nicht in Aus Text öffnen-benutzerdefinierten Vorlagen ausgewertet, verwenden Sie sie daher nicht in Öffnungsvorlagen.

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

> ⚠️ **Hinweis zu bedingten Blöcken**: Bedingte Blöcke (zum Beispiel `{{q=v: ...}}`) sind nur in Kopieren-benutzerdefinierten Vorlagen verfügbar. Sie funktionieren nicht in Aus Text öffnen-benutzerdefinierten Vorlagen. Wenn Sie flexible Filterung beim Öffnen von URLs benötigen, verwenden Sie stattdessen den Intelligenten (automatische Erkennung)-Modus.

## 4. Vorlagenbeispiele & Muster

Vorlagen werden als *eine Zeile* geschrieben, können aber über `$nl` mehrere Zeilen ausgeben.

Beispiel-URL und -Titel, die in diesem Abschnitt verwendet werden:

📘 **Titel**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.1 Markdown: Titel + URL

🛠 **Vorlage**

```template
$title$nl$url
```

💬 **Ausgabe**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.2 Markdown-Listenelement

🛠 **Vorlage**

```template
- [$title]($url)
```

💬 **Ausgabe**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.3 YouTube-Video-ID (nur wenn vorhanden)

🛠 **Vorlage**

```template
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Ausgabe**

```output
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

Wenn `v=` fehlt:

```output
Why the Moon?
https://example.com/page
```

### 4.4 YouTube-Thumbnail-URL generieren

Basierend auf dem bekannten YouTube-Thumbnail-Muster:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

🛠 **Vorlage**

```template
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

💬 **Ausgabe**

```output
Thumbnail: https://img.youtube.com/vi/bmC-FwibsZg/maxresdefault.jpg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.5 Markdown-Thumbnail einbetten

🛠 **Vorlage**

```template
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

💬 **Ausgabe**

```output
![thumb](https://img.youtube.com/vi/bmC-FwibsZg/mqdefault.jpg)
[Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.6 Zeitstempel (falls verfügbar)

🛠 **Vorlage**

```template
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

💬 **Ausgabe**

```output
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.7 Multi-Parameter-Bedingung

🛠 **Vorlage**

```template
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

💬 **Ausgabe**

```output
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.8 Log-Format (Domain + Pfad)

🛠 **Vorlage**

```template
[$domain] $path$nl$url
```

💬 **Ausgabe**

```output
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.9 Dateiname-Stil-Überschrift

🛠 **Vorlage**

```template
## $basename: $title$nl$url
```

💬 **Ausgabe**

```output
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.10 Minimalistisch

🛠 **Vorlage**

```template
$title — $url
```

💬 **Ausgabe**

```output
Why the Moon? — https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.11 Täglicher Log-Eintrag

🛠 **Vorlage**

```template
- [$title]($url) — $date $time
```

💬 **Ausgabe**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123) — 2025-01-12 14:03:55
```

### 4.12 Mehrzeilig mit Trennzeichen

🛠 **Vorlage**

```template
$title$nl$url$nl---$nl$domain
```

💬 **Ausgabe**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
---
www.youtube.com
```

## 5. Einschränkungen

SmartURLs bleibt absichtlich einfach.

❌ SmartURLs macht `NICHT`:

* Webseiteninhalte parsen (SmartURLs hat KEINE Berechtigung, auf HTML-Seiten zuzugreifen oder diese zu lesen)
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

## 6. Versionskompatibilität

Diese Funktionen sind verfügbar in: **SmartURLs v1.4.0 und später**

## 7. Feedback

Für Feature-Anfragen oder Fragen öffnen Sie bitte ein Issue hier:

<https://github.com/isshiki/SmartURLs/issues>
