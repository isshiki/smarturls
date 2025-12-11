# 📘 Przewodnik po szablonach SmartURLs (v1.4.0+)

Ten przewodnik wyjaśnia, jak korzystać z funkcji niestandardowych szablonów SmartURLs.
Szablony są zapisywane w **jednowierszowym polu wprowadzania**, ale mogą generować wielowierszowe dane wyjściowe za pomocą tokena `$nl`.

SmartURLs jest celowo lekki. **Nigdy nie odczytuje zawartości strony internetowej** i działa **tylko z adresem URL i informacjami o karcie przeglądarki**.

## 1. Podstawowe tokeny

SmartURLs zastępuje tokeny ściśle na podstawie metadanych karty i bieżącego adresu URL.

| Token          | Opis                                                                                                                         | Przykładowe wyjście                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `$title`       | Tytuł strony wyświetlany w karcie                                                                                            | `Why the Moon?`                                                                         |
| `$title(html)` | Tytuł strony z escapowaniem HTML (konwertuje `&`, `<`, `>`, `"`, `'` na encje). Bezpieczny dla tagów/atrybutów HTML. | `Rock &amp; Roll &lt;Best Hits&gt;`<br>*(dla tytułu: "Rock & Roll \<Best Hits>")* |
| `$url`         | Pełny adres URL                                                                                                              | `https://www.youtube.com/watch?v=bmC-FwibsZg`                                           |
| `$domain`    | Tylko nazwa hosta                | `www.youtube.com`                             |
| `$path`      | Część ścieżki adresu URL         | `/watch`                                      |
| `$basename`  | Ostatni segment ścieżki          | `watch`                                       |
| `$idx`       | Indeks karty (1-bazowy)          | `3`                                           |
| `$date`      | Data lokalna (YYYY-MM-DD)        | `2025-01-12`                                  |
| `$time`      | Czas lokalny (HH:MM:SS)          | `14:03:55`                                    |
| `$date(utc)` | Data UTC                         | `2025-01-12`                                  |
| `$time(utc)` | Czas UTC                         | `05:03:55`                                    |
| `$nl`        | Wstawia nową linię               | *(generuje łamanie linii na wyjściu)*        |

> ⚠️ **Uwaga dotycząca `$nl`**: Obsługiwany tylko w niestandardowych szablonach Kopiowania. Nie może być używany w niestandardowych szablonach Otwórz z tekstu. Jeśli chcesz ponownie użyć tego samego szablonu dla Kopiowania i Otwierania, unikaj `$nl` w szablonie otwierania lub użyj trybu Inteligentny (automatyczne wykrywanie).

> ⚠️ **Uwaga dotycząca `$title(html)`**: Obsługiwany tylko w niestandardowych szablonach Kopiowania. Niestandardowe szablony Otwórz z tekstu nie przetwarzają tego tokenu. W przypadku szablonów otwierania użyj zamiast tego `$title`.

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

🔗 **Przykładowy URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Wyjście       |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Jeśli parametr nie istnieje, jego wartość staje się pustym ciągiem znaków.

> ⚠️ **Uwaga dotycząca tokenów parametrów zapytania**: Tokeny parametrów zapytania (na przykład `$v`, `$id`, `$tag` itp.) są oceniane tylko w niestandardowych szablonach Kopiowania. Nie są oceniane w niestandardowych szablonach Otwórz z tekstu, więc nie używaj ich w szablonach otwierania.

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

> ⚠️ **Uwaga dotycząca bloków warunkowych**: Bloki warunkowe (na przykład `{{q=v: ...}}`) są dostępne tylko w niestandardowych szablonach Kopiowania. Nie działają w niestandardowych szablonach Otwórz z tekstu. Jeśli potrzebujesz elastycznego filtrowania podczas otwierania adresów URL, użyj trybu Inteligentny (automatyczne wykrywanie).

## 4. Przykłady i wzorce szablonów

Szablony są zapisywane jako *jedna linia*, ale mogą generować wiele linii przez `$nl`.

Przykładowy adres URL i tytuł użyte w tej sekcji:

📘 **Tytuł**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.1 Markdown: Tytuł + URL

🛠 **Szablon**

```template
$title$nl$url
```

💬 **Wyjście**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.2 Element listy Markdown

🛠 **Szablon**

```template
- [$title]($url)
```

💬 **Wyjście**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.3 Identyfikator filmu YouTube (tylko jeśli jest obecny)

🛠 **Szablon**

```template
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Wyjście**

```output
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

Jeśli brakuje `v=`:

```output
Why the Moon?
https://example.com/page
```

### 4.4 Wygeneruj adres URL miniatury YouTube

Na podstawie znanego wzorca miniatur YouTube:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

🛠 **Szablon**

```template
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

💬 **Wyjście**

```output
Thumbnail: https://img.youtube.com/vi/bmC-FwibsZg/maxresdefault.jpg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.5 Osadź miniaturę YouTube (Markdown)

🛠 **Szablon**

```template
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

💬 **Wyjście**

```output
![thumb](https://img.youtube.com/vi/bmC-FwibsZg/mqdefault.jpg)
[Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.6 Znacznik czasu (jeśli dostępny)

🛠 **Szablon**

```template
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

💬 **Wyjście**

```output
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.7 Warunek wieloparametrowy

🛠 **Szablon**

```template
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

💬 **Wyjście**

```output
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.8 Format dziennika (domena + ścieżka)

🛠 **Szablon**

```template
[$domain] $path$nl$url
```

💬 **Wyjście**

```output
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.9 Nagłówek w stylu nazwy pliku

🛠 **Szablon**

```template
## $basename: $title$nl$url
```

💬 **Wyjście**

```output
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.10 Minimalistyczny

🛠 **Szablon**

```template
$title — $url
```

💬 **Wyjście**

```output
Why the Moon? — https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.11 Wpis dziennika dziennego

🛠 **Szablon**

```template
- [$title]($url) — $date $time
```

💬 **Wyjście**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123) — 2025-01-12 14:03:55
```

### 4.12 Wiele linii z separatorem

🛠 **Szablon**

```template
$title$nl$url$nl---$nl$domain
```

💬 **Wyjście**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
---
www.youtube.com
```

## 5. Ograniczenia

SmartURLs celowo pozostaje prosty.

❌ SmartURLs `NIE`:

* Analizuje zawartości stron internetowych (SmartURLs NIE ma uprawnień do dostępu ani odczytu stron HTML)
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

## 6. Zgodność wersji

Te funkcje są dostępne w: **SmartURLs v1.4.0 i nowszych**

## 7. Opinie

W przypadku próśb o funkcje lub pytań otwórz problem tutaj:

<https://github.com/isshiki/SmartURLs/issues>
