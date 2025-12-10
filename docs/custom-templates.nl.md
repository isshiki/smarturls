# 📘 SmartURLs Sjabloonhandleiding (v1.4.0+)

Deze handleiding legt uit hoe u de aangepaste sjabloonfunctie van SmartURLs gebruikt.
Sjablonen worden geschreven in een **invoerveld van één regel**, maar kunnen uitvoer met meerdere regels produceren met behulp van het `$nl`-token.

SmartURLs is opzettelijk lichtgewicht. Het **leest nooit webpagina-inhoud** en werkt **alleen met de URL en browserTab-informatie**.

## 1. Basis-tokens

SmartURLs vervangt tokens strikt gebaseerd op tabmetadata en de huidige URL.

| Token        | Beschrijving                        | Voorbeelduitvoer                              |
| ------------ | ----------------------------------- | --------------------------------------------- |
| `$title`     | Paginatitel weergegeven in het tabblad | `Why the Moon?`                               |
| `$url`       | Volledige URL                       | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Alleen hostnaam                     | `www.youtube.com`                             |
| `$path`      | Paddeel van de URL                  | `/watch`                                      |
| `$basename`  | Laatste segment van het pad         | `watch`                                       |
| `$idx`       | Tabindex (1-gebaseerd)              | `3`                                           |
| `$date`      | Lokale datum (YYYY-MM-DD)           | `2025-01-12`                                  |
| `$time`      | Lokale tijd (HH:MM:SS)              | `14:03:55`                                    |
| `$date(utc)` | UTC-datum                           | `2025-01-12`                                  |
| `$time(utc)` | UTC-tijd                            | `05:03:55`                                    |
| `$nl`        | Voegt een nieuwe regel in           | *(produceert regeleinden in uitvoer)*         |

### Voorbeeld URL en titel hierboven gebruikt

Om te laten zien hoe tokens zich uitbreiden, gebruiken deze voorbeelden:

📘 **Titel**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Uit deze URL:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (queryparameter) → `bmC-FwibsZg`

Data en tijden zijn voorbeelden; de werkelijke uitvoer hangt af van uw systeemklok.

## 2. Queryparameter-tokens

SmartURLs kan queryparameters direct uit de URL extraheren.

🔤 **Syntaxis**

```text
$<param>
```

📄 **Voorbeeld**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Uitvoer       |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Als een parameter niet bestaat, wordt de waarde een lege string.

## 3. Voorwaardelijke blokken

Voorwaardelijke blokken stellen sjablonen in staat om bepaalde tekst **alleen uit te voeren als specifieke queryparameters aanwezig zijn**.

🔤 **Syntaxis**

🔹 **Enkele parameter**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Meerdere parameters (EN-voorwaarde)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

Binnen een voorwaardelijk blok:

* `$v`, `$t`, enz. worden normaal uitgebreid
* `$nl`, `$title`, `$domain` werken ook
* Geneste blokken zijn niet toegestaan
* Geen `else` beschikbaar

Als aan de voorwaarden niet wordt voldaan, wordt het hele blok uit de uitvoer verwijderd.

## 4. Sjabloonvoorbeelden

Sjablonen worden geschreven als *één regel*, maar kunnen meerdere regels uitvoeren via `$nl`.

### 4.1 Markdown: Titel + URL

🛠 **Sjabloon**

```text
$title$nl$url
```

💬 **Uitvoer**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Markdown lijstitem

🛠 **Sjabloon**

```text
- [$title]($url)
```

💬 **Uitvoer**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 YouTube video-ID (alleen indien aanwezig)

🛠 **Sjabloon**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Uitvoer**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Als `v=` ontbreekt:

```text
Why the Moon?
https://example.com/page
```

### 4.4 GitHub issue-samenvatting

🛠 **Sjabloon**

```text
## ${$basename}: $title$nl$url
```

💬 **Uitvoer**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Logformaat (domein + pad)

🛠 **Sjabloon**

```text
[$domain] $path$nl$url
```

💬 **Uitvoer**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Praktische sjabloonpatronen

Hieronder staan gebruiksklare patronen voor Markdown, logs, YouTube-hulpprogramma's en voorwaardelijke opmaak.

Gebruikte voorbeeld-URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Klassiek Markdown

```text
$title$nl$url
```

Uitvoer:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Markdown-lijst

```text
- [$title]($url)
```

Uitvoer:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 Domein + Pad Log

```text
[$domain] $path$nl$url
```

Uitvoer:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 GitHub issue-stijl samenvatting

```text
## ${$basename}: $title$nl$url
```

Uitvoer:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 YouTube-hulpprogramma's

#### 5.5.1 Toon video-ID alleen wanneer aanwezig

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

#### 5.5.2 Genereer thumbnail-URL

Gebaseerd op het bekende YouTube-thumbnailpatroon:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Sjabloon:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

#### 5.5.3 Markdown-thumbnail insluiten

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.6 Tijdstempel (indien beschikbaar)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

Uitvoer:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 Multi-parameter voorwaardelijk

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

Uitvoer:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 Minimalistisch

```text
$title — $url
```

### 5.9 Dagelijkse logvermelding

```text
- [$title]($url) — $date $time
```

### 5.10 Bestandsnaam-stijl samenvatting

```text
$basename — $title
```

### 5.11 Meerdere regels met scheidingsteken

```text
$title$nl$url$nl$nl$domain
```

## 6. Beperkingen

SmartURLs blijft opzettelijk eenvoudig.

❌ SmartURLs doet `NIET`:

* Webpagina-inhoud parseren
* Metadata of thumbnails lezen
* JavaScript op de pagina uitvoeren
* OG-tags, auteurs of beschrijvingen extraheren
* Geneste voorwaarden of `else` ondersteunen

✔️ SmartURLs gebruikt `ALLEEN`:

* Tabtitel
* URL-componenten
* Queryparameters
* Eenvoudige tokenvervanging
* Optionele voorwaardelijke blokken

Dit zorgt voor consistent gedrag op alle websites.

## 7. Versiecompatibiliteit

Deze functies zijn beschikbaar in: **SmartURLs v1.4.0 en later**

## 8. Feedback

Voor functieverzoeken of vragen kunt u een issue openen op GitHub.
