# 📘 Guía de plantillas de SmartURLs (v1.4.0+)

Esta guía explica cómo usar la función de plantilla personalizada de SmartURLs.
Las plantillas se escriben en un **campo de entrada de una sola línea**, pero pueden producir salida de varias líneas usando el token `$nl`.

SmartURLs es intencionalmente ligero. **Nunca lee el contenido de la página web** y funciona **solo con la URL y la información de la pestaña del navegador**.

## 1. Tokens básicos

SmartURLs reemplaza tokens basándose estrictamente en los metadatos de la pestaña y la URL actual.

| Token        | Descripción                      | Ejemplo de salida                             |
| ------------ | -------------------------------- | --------------------------------------------- |
| `$title`     | Título de la página en la pestaña| `Why the Moon?`                               |
| `$url`       | URL completa                     | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Solo nombre de host              | `www.youtube.com`                             |
| `$path`      | Parte de ruta de la URL          | `/watch`                                      |
| `$basename`  | Último segmento de la ruta       | `watch`                                       |
| `$idx`       | Índice de pestaña (base 1)       | `3`                                           |
| `$date`      | Fecha local (YYYY-MM-DD)         | `2025-01-12`                                  |
| `$time`      | Hora local (HH:MM:SS)            | `14:03:55`                                    |
| `$date(utc)` | Fecha UTC                        | `2025-01-12`                                  |
| `$time(utc)` | Hora UTC                         | `05:03:55`                                    |
| `$nl`        | Inserta un salto de línea        | *(produce saltos de línea en la salida)*     |

### Ejemplo de URL y título usados arriba

Para mostrar cómo se expanden los tokens, estos ejemplos usan:

📘 **Título**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

De esta URL:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (parámetro de consulta) → `bmC-FwibsZg`

Las fechas y horas son ejemplos; la salida real depende del reloj de su sistema.

## 2. Tokens de parámetros de consulta

SmartURLs puede extraer parámetros de consulta directamente de la URL.

🔤 **Sintaxis**

```text
$<param>
```

📄 **Ejemplo**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Salida        |
| -- | - |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Si un parámetro no existe, su valor se convierte en una cadena vacía.

## 3. Bloques condicionales

Los bloques condicionales permiten que las plantillas generen cierto texto **solo si están presentes parámetros de consulta específicos**.

🔤 **Sintaxis**

🔹 **Parámetro único**

```text
{{q=v: ... }}
```

🔸 **Múltiples parámetros (condición Y)**

```text
{{q=v,t: ... }}
```

Dentro de un bloque condicional:

* `$v`, `$t`, etc. se expanden normalmente
* `$nl`, `$title`, `$domain` también funcionan
* No se permiten bloques anidados
* No hay `else` disponible

Si no se cumplen las condiciones, el bloque completo se elimina de la salida.

## 4. Ejemplos de plantillas

Las plantillas se escriben como *una línea*, pero pueden generar múltiples líneas a través de `$nl`.

### 4.1 Markdown: Título + URL

🛠 **Plantilla**

```text
$title$nl$url
```

💬 **Salida**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Elemento de lista Markdown

🛠 **Plantilla**

```text
- [$title]($url)
```

💬 **Salida**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 ID de video de YouTube (solo si está presente)

🛠 **Plantilla**

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

💬 **Salida**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Si falta `v=`:

```text
Why the Moon?
https://example.com/page
```

### 4.4 Resumen de issue de GitHub

🛠 **Plantilla**

```text
## ${$basename}: $title$nl$url
```

💬 **Salida**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Formato de registro (dominio + ruta)

🛠 **Plantilla**

```text
[$domain] $path$nl$url
```

💬 **Salida**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Patrones de plantillas prácticas

A continuación se muestran patrones listos para usar para Markdown, registros, utilidades de YouTube y formato condicional.

URL de ejemplo utilizada:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Markdown clásico

```text
$title$nl$url
```

Salida:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Lista Markdown

```text
- [$title]($url)
```

Salida:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 Registro de dominio + ruta

```text
[$domain] $path$nl$url
```

Salida:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 Resumen estilo issue de GitHub

```text
## ${$basename}: $title$nl$url
```

Salida:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 Utilidades de YouTube

#### 5.5.1 Mostrar ID de video solo cuando esté presente

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

#### 5.5.2 Generar URL de miniatura

Basado en el patrón conocido de miniaturas de YouTube:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Plantilla:

```text
{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}$title$nl$url
```

#### 5.5.3 Incrustar miniatura Markdown

```text
{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}[$title]($url)
```

### 5.6 Marca de tiempo (si está disponible)

```text
{{q=t:Timestamp: $t sec$nl}}$title$nl$url
```

Salida:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 Condicional de múltiples parámetros

```text
{{q=v,t:Video: $v ($t sec)$nl}}$url
```

Salida:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 Minimalista

```text
$title — $url
```

### 5.9 Entrada de registro diaria

```text
- [$title]($url) — $date $time
```

### 5.10 Resumen estilo nombre de archivo

```text
$basename — $title
```

### 5.11 Multilínea con separador

```text
$title$nl$url$nl$nl$domain
```

## 6. Limitaciones

SmartURLs se mantiene intencionalmente simple.

❌ SmartURLs `NO`:

* Analiza contenido de páginas web
* Lee metadatos o miniaturas
* Ejecuta JavaScript en la página
* Extrae etiquetas OG, autores o descripciones
* Soporta condicionales anidados o `else`

✔️ SmartURLs `SOLO` usa:

* Título de la pestaña
* Componentes de URL
* Parámetros de consulta
* Reemplazo simple de tokens
* Bloques condicionales opcionales

Esto asegura un comportamiento consistente en todos los sitios web.

## 7. Compatibilidad de versiones

Estas funciones están disponibles en: **SmartURLs v1.4.0 y posterior**

## 8. Comentarios

Para solicitudes de funciones o preguntas, abra un issue en GitHub.
