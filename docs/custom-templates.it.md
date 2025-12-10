# 📘 Guida ai modelli SmartURLs (v1.4.0+)

Questa guida spiega come utilizzare la funzione modello personalizzato di SmartURLs.
I modelli sono scritti in un **campo di input a riga singola**, ma possono produrre output su più righe usando il token `$nl`.

SmartURLs è intenzionalmente leggero. **Non legge mai il contenuto delle pagine web** e funziona **solo con l'URL e le informazioni della scheda del browser**.

## 1. Token di base

SmartURLs sostituisce i token basandosi strettamente sui metadati della scheda e sull'URL corrente.

| Token        | Descrizione                      | Esempio di output                             |
| ------------ | -------------------------------- | --------------------------------------------- |
| `$title`     | Titolo della pagina nella scheda | `Why the Moon?`                               |
| `$url`       | URL completo                     | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Solo hostname                    | `www.youtube.com`                             |
| `$path`      | Parte del percorso dell'URL      | `/watch`                                      |
| `$basename`  | Ultimo segmento del percorso     | `watch`                                       |
| `$idx`       | Indice scheda (base 1)           | `3`                                           |
| `$date`      | Data locale (YYYY-MM-DD)         | `2025-01-12`                                  |
| `$time`      | Ora locale (HH:MM:SS)            | `14:03:55`                                    |
| `$date(utc)` | Data UTC                         | `2025-01-12`                                  |
| `$time(utc)` | Ora UTC                          | `05:03:55`                                    |
| `$nl`        | Inserisce un'interruzione di riga| *(produce interruzioni di riga nell'output)*  |

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

## 4. Esempi di modelli

I modelli sono scritti come *una riga*, ma possono produrre più righe tramite `$nl`.

### 4.1 Markdown: Titolo + URL

🛠 **Modello**

```text
$title$nl$url
```

💬 **Output**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Elemento elenco Markdown

🛠 **Modello**

```text
- [$title]($url)
```

💬 **Output**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 ID video YouTube (solo se presente)

🛠 **Modello**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Output**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Se `v=` manca:

```text
Why the Moon?
https://example.com/page
```

### 4.4 Intestazione stile nome file (usando $basename)

🛠 **Modello**

```text
## $basename: $title$nl$url
```

💬 **Output**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Formato log (dominio + percorso)

🛠 **Modello**

```text
[$domain] $path$nl$url
```

💬 **Output**

```text
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Modelli pratici

Di seguito sono riportati modelli pronti all'uso per Markdown, log, utilità YouTube e formattazione condizionale.

URL di esempio utilizzato:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Genera URL miniatura

Basato sul modello di miniatura YouTube noto:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Modello:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

### 5.2 Incorpora miniatura Markdown

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.3 Timestamp (se disponibile)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

Output:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 Condizionale multi-parametro

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

Output:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 Minimalista

```text
$title — $url
```

### 5.6 Voce log giornaliera

```text
- [$title]($url) — $date $time
```

### 5.7 Riepilogo stile nome file

```text
$basename — $title
```

### 5.8 Multi-riga con separatore

```text
$title$nl$url$nl$nl$domain
```

## 6. Limitazioni

SmartURLs rimane intenzionalmente semplice.

❌ SmartURLs `NON`:

* Analizza il contenuto delle pagine web
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

## 7. Compatibilità versione

Queste funzionalità sono disponibili in: **SmartURLs v1.4.0 e successive**

## 8. Feedback

Per richieste di funzionalità o domande, apri un issue su GitHub.
