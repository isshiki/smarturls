# 📘 Guia de modelos SmartURLs (v1.4.0+)

Este guia explica como usar o recurso de modelo personalizado do SmartURLs.
Os modelos são escritos em um **campo de entrada de linha única**, mas podem produzir saída de várias linhas usando o token `$nl`.

O SmartURLs é intencionalmente leve. Ele **nunca lê o conteúdo da página web** e funciona **apenas com a URL e as informações da guia do navegador**.

## 1. Tokens básicos

O SmartURLs substitui tokens estritamente com base nos metadados da guia e na URL atual.

| Token        | Descrição                         | Exemplo de saída                              |
| ------------ | --------------------------------- | --------------------------------------------- |
| `$title`     | Título da página mostrado na guia | `Why the Moon?`                               |
| `$url`       | URL completa                      | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Apenas nome do host               | `www.youtube.com`                             |
| `$path`      | Parte do caminho da URL           | `/watch`                                      |
| `$basename`  | Último segmento do caminho        | `watch`                                       |
| `$idx`       | Índice da guia (base 1)           | `3`                                           |
| `$date`      | Data local (YYYY-MM-DD)           | `2025-01-12`                                  |
| `$time`      | Hora local (HH:MM:SS)             | `14:03:55`                                    |
| `$date(utc)` | Data UTC                          | `2025-01-12`                                  |
| `$time(utc)` | Hora UTC                          | `05:03:55`                                    |
| `$nl`        | Insere uma quebra de linha        | *(produz quebras de linha na saída)*         |

### Exemplo de URL e título usados acima

Para mostrar como os tokens se expandem, estes exemplos usam:

📘 **Título**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Desta URL:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (parâmetro de consulta) → `bmC-FwibsZg`

Datas e horários são exemplos; a saída real depende do relógio do seu sistema.

## 2. Tokens de parâmetros de consulta

O SmartURLs pode extrair parâmetros de consulta diretamente da URL.

🔤 **Sintaxe**

```text
$<param>
```

📄 **Exemplo**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Saída         |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Se um parâmetro não existir, seu valor se torna uma string vazia.

## 3. Blocos condicionais

Os blocos condicionais permitem que os modelos produzam determinado texto **somente se parâmetros de consulta específicos estiverem presentes**.

🔤 **Sintaxe**

🔹 **Parâmetro único**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Múltiplos parâmetros (condição E)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

Dentro de um bloco condicional:

* `$v`, `$t`, etc. se expandem normalmente
* `$nl`, `$title`, `$domain` também funcionam
* Blocos aninhados não são permitidos
* Nenhum `else` está disponível

Se as condições não forem atendidas, o bloco inteiro é removido da saída.

## 4. Exemplos de modelos

Os modelos são escritos como *uma linha*, mas podem produzir várias linhas via `$nl`.

### 4.1 Markdown: Título + URL

🛠 **Modelo**

```text
$title$nl$url
```

💬 **Saída**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Item de lista Markdown

🛠 **Modelo**

```text
- [$title]($url)
```

💬 **Saída**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 ID do vídeo do YouTube (somente se presente)

🛠 **Modelo**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Saída**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Se `v=` estiver faltando:

```text
Why the Moon?
https://example.com/page
```

### 4.4 Resumo estilo nome de arquivo (usando $basename)

🛠 **Modelo**

```text
## $basename: $title$nl$url
```

💬 **Saída**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Formato de log (domínio + caminho)

🛠 **Modelo**

```text
[$domain] $path$nl$url
```

💬 **Saída**

```text
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Padrões de modelos práticos

Abaixo estão padrões prontos para uso para Markdown, logs, utilitários do YouTube e formatação condicional.

URL de exemplo usada:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Gerar URL da miniatura

Baseado no padrão de miniatura conhecido do YouTube:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Modelo:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

### 5.2 Incorporar miniatura Markdown

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.3 Timestamp (se disponível)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

Saída:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 Condicional multi-parâmetro

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

Saída:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 Minimalista

```text
$title — $url
```

### 5.6 Entrada de log diário

```text
- [$title]($url) — $date $time
```

### 5.7 Resumo estilo nome de arquivo

```text
$basename — $title
```

### 5.8 Multilinha com separador

```text
$title$nl$url$nl$nl$domain
```

## 6. Limitações

O SmartURLs permanece intencionalmente simples.

❌ O SmartURLs `NÃO`:

* Analisa conteúdo de páginas web
* Lê metadados ou miniaturas
* Executa JavaScript na página
* Extrai tags OG, autores ou descrições
* Suporta condicionais aninhados ou `else`

✔️ O SmartURLs usa `APENAS`:

* Título da guia
* Componentes de URL
* Parâmetros de consulta
* Substituição simples de tokens
* Blocos condicionais opcionais

Isso garante comportamento consistente em todos os sites.

## 7. Compatibilidade de versão

Estes recursos estão disponíveis em: **SmartURLs v1.4.0 e posterior**

## 8. Feedback

Para solicitações de recursos ou perguntas, por favor abra uma issue no GitHub.
