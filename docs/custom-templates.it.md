# 📘 Guida ai modelli SmartURLs (v1.4.0+)

Questa guida spiega come utilizzare la funzione modello personalizzato di SmartURLs.
I modelli sono scritti in un **campo di input a riga singola**, ma possono produrre output su più righe usando il token `$nl`.

SmartURLs è intenzionalmente leggero. **Non legge mai il contenuto delle pagine web** e funziona **solo con l'URL e le informazioni della scheda del browser**.

## 1. Token di base

SmartURLs sostituisce i token basandosi strettamente sui metadati della scheda e sull'URL corrente.

| Token          | Descrizione                                                                                                                  | Esempio di output                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `$title`       | Titolo della pagina nella scheda                                                                                             | `Why the Moon?`                                                                         |
| `$title(html)` | Titolo di pagina con escape HTML (converte `&`, `<`, `>`, `"`, `'` in entità). Sicuro per tag/attributi HTML. | `Rock &amp; Roll &lt;Best Hits&gt;`<br>*(per titolo: "Rock & Roll \<Best Hits>")* |
| `$url`         | URL completo                                                                                                                 | `https://www.youtube.com/watch?v=bmC-FwibsZg`                                           |
| `$domain`    | Solo hostname                    | `www.youtube.com`                             |
| `$path`      | Parte del percorso dell'URL      | `/watch`                                      |
| `$basename`  | Ultimo segmento del percorso     | `watch`                                       |
| `$idx`       | Indice scheda (base 1)           | `3`                                           |
| `$date`      | Data locale (YYYY-MM-DD)         | `2025-01-12`                                  |
| `$time`      | Ora locale (HH:MM:SS)            | `14:03:55`                                    |
| `$date(utc)` | Data UTC                         | `2025-01-12`                                  |
| `$time(utc)` | Ora UTC                          | `05:03:55`                                    |
| `$nl`        | Inserisce un'interruzione di riga| *(produce interruzioni di riga nell'output)*  |

> ⚠️ **Nota su `$nl`**: Il token `$nl` può essere utilizzato nei modelli personalizzati di **Copia** per inserire interruzioni di riga nel testo generato. Tuttavia, **non è supportato** nei modelli personalizzati del lato **Apri da testo**, che elabora l'input riga per riga. Per questo motivo, un modello che utilizza `$nl` sul lato Copia non si comporterà allo stesso modo se lo si riutilizza come modello personalizzato di apertura. Se si desidera che Copia e Apri condividano lo stesso modello, evitare `$nl` nel modello di apertura o utilizzare la modalità **Intelligente (rilevamento automatico)** invece.

> ⚠️ **Nota su `$title(html)`**: Il token `$title(html)` è supportato solo nei modelli personalizzati di **Copia**. Viene utilizzato per inserire una versione con escape HTML del titolo della pagina nel testo generato. **Non è supportato** nei modelli personalizzati del lato **Apri da testo**. Se si riutilizza un modello che contiene `$title(html)` come modello personalizzato di apertura, questo token non verrà elaborato. Per i modelli di apertura, utilizzare invece `$title`.

### Esempio di URL e titolo usati sopra

Per mostrare come i token si espandono, questi esempi usano:

📘 **Titolo**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Da questo URL:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (parametro query) → `bmC-FwibsZg`

Date e ore sono esempi; l'output effettivo dipende dall'orologio del sistema.

## 2. Token dei parametri query

SmartURLs può estrarre i parametri query direttamente dall'URL.

🔤 **Sintassi**

```text
$<param>
```

📄 **Esempio**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Output        |
| -- | - |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Se un parametro non esiste, il suo valore diventa una stringa vuota.

> ⚠️ **Nota sui token dei parametri query**: I token dei parametri query come `$v`, `$id`, `$tag`, ecc. vengono valutati solo nei modelli personalizzati di **Copia**. Consentono di inserire o formattare valori presi dalla stringa di query dell'URL nell'output copiato. Questi token **non vengono valutati** nei modelli personalizzati del lato **Apri da testo**. I modelli personalizzati di apertura da testo non leggono né filtrano per parametri query; utilizzano solo il modello per individuare `$url` nel testo incollato.

## 3. Blocchi condizionali

I blocchi condizionali consentono ai modelli di produrre determinati testi **solo se sono presenti parametri query specifici**.

🔤 **Sintassi**

🔹 **Parametro singolo**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Parametri multipli (condizione AND)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

All'interno di un blocco condizionale:

* `$v`, `$t`, ecc. si espandono normalmente
* `$nl`, `$title`, `$domain` funzionano anche
* I blocchi annidati non sono consentiti
* Non è disponibile `else`

Se le condizioni non sono soddisfatte, l'intero blocco viene rimosso dall'output.

> ⚠️ **Nota sui blocchi condizionali**: I blocchi condizionali come `{{q=v: ...}}` o `{{q=v,t: ...}}` sono supportati solo nei modelli personalizzati di **Copia**. Consentono di includere o omettere parti dell'output a seconda dei parametri query dell'URL. I blocchi condizionali **non sono supportati** per i modelli personalizzati del lato **Apri da testo**. I modelli di apertura da testo non valutano queste condizioni e non possono filtrare quali URL vengono aperti in base ad esse. Se è necessario controllare quali URL aprire, utilizzare il filtro nel testo di origine o utilizzare la modalità **Intelligente (rilevamento automatico)** invece.

## 4. Esempi di modelli e modelli pratici

I modelli sono scritti come *una riga*, ma possono produrre più righe tramite `$nl`.

Esempio di URL e titolo usati in questa sezione:

📘 **Titolo**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.1 Markdown: Titolo + URL

🛠 **Modello**

```template
$title$nl$url
```

💬 **Output**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.2 Elemento elenco Markdown

🛠 **Modello**

```template
- [$title]($url)
```

💬 **Output**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.3 ID video YouTube (solo se presente)

🛠 **Modello**

```template
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```output
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

Se `v=` manca:

```output
Why the Moon?
https://example.com/page
```

### 4.4 Genera URL miniatura YouTube

Basato sul modello di miniatura YouTube noto:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

🛠 **Modello**

```template
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```output
Thumbnail: https://img.youtube.com/vi/bmC-FwibsZg/maxresdefault.jpg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.5 Incorpora miniatura YouTube (Markdown)

🛠 **Modello**

```template
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

💬 **Output**

```output
![thumb](https://img.youtube.com/vi/bmC-FwibsZg/mqdefault.jpg)
[Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.6 Timestamp (se disponibile)

🛠 **Modello**

```template
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```output
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.7 Condizionale multi-parametro

🛠 **Modello**

```template
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

💬 **Output**

```output
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.8 Formato log (dominio + percorso)

🛠 **Modello**

```template
[$domain] $path$nl$url
```

💬 **Output**

```output
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.9 Intestazione stile nome file

🛠 **Modello**

```template
## $basename: $title$nl$url
```

💬 **Output**

```output
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.10 Minimalista

🛠 **Modello**

```template
$title — $url
```

💬 **Output**

```output
Why the Moon? — https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.11 Voce log giornaliera

🛠 **Modello**

```template
- [$title]($url) — $date $time
```

💬 **Output**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123) — 2025-01-12 14:03:55
```

### 4.12 Multi-riga con separatore

🛠 **Modello**

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

## 5. Limitazioni

SmartURLs rimane intenzionalmente semplice.

❌ SmartURLs `NON`:

* Analizza il contenuto delle pagine web (SmartURLs NON ha il permesso di accedere o leggere pagine HTML)
* Legge metadati o miniature
* Esegue JavaScript sulla pagina
* Estrae tag OG, autori o descrizioni
* Supporta condizionali annidati o `else`

✔️ SmartURLs usa `SOLO`:

* Titolo della scheda
* Componenti URL
* Parametri query
* Semplice sostituzione di token
* Blocchi condizionali opzionali

Questo garantisce un comportamento coerente su tutti i siti web.

## 6. Compatibilità versione

Queste funzionalità sono disponibili in: **SmartURLs v1.4.0 e successive**

## 7. Feedback

Per richieste di funzionalità o domande, apri un issue su GitHub:

<https://github.com/isshiki/SmartURLs/issues>
