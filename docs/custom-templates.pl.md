# 📘 Przewodnik po szablonach SmartURLs (v1.4.0+)

Ten przewodnik wyjaśnia, jak korzystać z funkcji niestandardowych szablonów SmartURLs.
Szablony są zapisywane w **jednowierszowym polu wprowadzania**, ale mogą generować wielowierszowe dane wyjściowe za pomocą tokena `$nl`.

SmartURLs jest celowo lekki. **Nigdy nie odczytuje zawartości strony internetowej** i działa **tylko z adresem URL i informacjami o karcie przeglądarki**.

## 1. Podstawowe tokeny

SmartURLs zastępuje tokeny ściśle na podstawie metadanych karty i bieżącego adresu URL.

| Token        | Opis                             | Przykładowe wyjście                           |
| ------------ | -------------------------------- | --------------------------------------------- |
| `$title`     | Tytuł strony wyświetlany w karcie| `Why the Moon?`                               |
| `$url`       | Pełny adres URL                  | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Tylko nazwa hosta                | `www.youtube.com`                             |
| `$path`      | Część ścieżki adresu URL         | `/watch`                                      |
| `$basename`  | Ostatni segment ścieżki          | `watch`                                       |
| `$idx`       | Indeks karty (1-bazowy)          | `3`                                           |
| `$date`      | Data lokalna (YYYY-MM-DD)        | `2025-01-12`                                  |
| `$time`      | Czas lokalny (HH:MM:SS)          | `14:03:55`                                    |
| `$date(utc)` | Data UTC                         | `2025-01-12`                                  |
| `$time(utc)` | Czas UTC                         | `05:03:55`                                    |
| `$nl`        | Wstawia nową linię               | *(generuje łamanie linii na wyjściu)*        |

### Przykładowy adres URL i tytuł użyte powyżej

Aby pokazać, jak rozwijają się tokeny, w tych przykładach używamy:

📘 **Tytuł**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Z tego adresu URL:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (parametr zapytania) → `bmC-FwibsZg`

Daty i czasy są przykładami; rzeczywiste wyjście zależy od zegara systemowego.

## 2. Tokeny parametrów zapytania

SmartURLs może wyodrębniać parametry zapytania bezpośrednio z adresu URL.

🔤 **Składnia**

```text
$<param>
```

📄 **Przykład**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Wyjście       |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Jeśli parametr nie istnieje, jego wartość staje się pustym ciągiem znaków.

## 3. Bloki warunkowe

Bloki warunkowe pozwalają szablonom generować określony tekst **tylko wtedy, gdy obecne są określone parametry zapytania**.

🔤 **Składnia**

🔹 **Pojedynczy parametr**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Wiele parametrów (warunek I)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

Wewnątrz bloku warunkowego:

* `$v`, `$t` itp. rozwijają się normalnie
* `$nl`, `$title`, `$domain` również działają
* Zagnieżdżone bloki nie są dozwolone
* Nie ma dostępnego `else`

Jeśli warunki nie są spełnione, cały blok jest usuwany z wyjścia.

## 4. Przykłady szablonów

Szablony są zapisywane jako *jedna linia*, ale mogą generować wiele linii przez `$nl`.

### 4.1 Markdown: Tytuł + URL

🛠 **Szablon**

```text
$title$nl$url
```

💬 **Wyjście**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Element listy Markdown

🛠 **Szablon**

```text
- [$title]($url)
```

💬 **Wyjście**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 Identyfikator filmu YouTube (tylko jeśli jest obecny)

🛠 **Szablon**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Wyjście**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Jeśli brakuje `v=`:

```text
Why the Moon?
https://example.com/page
```

### 4.4 Nagłówek w stylu nazwy pliku (z $basename)

🛠 **Szablon**

```text
## $basename: $title$nl$url
```

💬 **Wyjście**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Format dziennika (domena + ścieżka)

🛠 **Szablon**

```text
[$domain] $path$nl$url
```

💬 **Wyjście**

```text
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Praktyczne wzorce szablonów

Poniżej znajdują się gotowe wzorce dla Markdown, dzienników, narzędzi YouTube i formatowania warunkowego.

Użyty przykładowy adres URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Wygeneruj adres URL miniatury

Na podstawie znanego wzorca miniatur YouTube:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Szablon:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

### 5.2 Osadź miniaturę Markdown

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.3 Znacznik czasu (jeśli dostępny)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

Wyjście:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 Warunek wieloparametrowy

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

Wyjście:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 Minimalistyczny

```text
$title — $url
```

### 5.6 Wpis dziennika dziennego

```text
- [$title]($url) — $date $time
```

### 5.7 Podsumowanie w stylu nazwy pliku

```text
$basename — $title
```

### 5.8 Wiele linii z separatorem

```text
$title$nl$url$nl$nl$domain
```

## 6. Ograniczenia

SmartURLs celowo pozostaje prosty.

❌ SmartURLs `NIE`:

* Analizuje zawartości stron internetowych
* Czyta metadanych ani miniatur
* Wykonuje JavaScript na stronie
* Wyodrębnia tagów OG, autorów ani opisów
* Obsługuje zagnieżdżonych warunków ani `else`

✔️ SmartURLs `TYLKO` używa:

* Tytułu karty
* Składników URL
* Parametrów zapytania
* Prostego zastępowania tokenów
* Opcjonalnych bloków warunkowych

Zapewnia to spójne zachowanie na wszystkich stronach internetowych.

## 7. Zgodność wersji

Te funkcje są dostępne w: **SmartURLs v1.4.0 i nowszych**

## 8. Opinie

W przypadku próśb o funkcje lub pytań otwórz problem na GitHub.
