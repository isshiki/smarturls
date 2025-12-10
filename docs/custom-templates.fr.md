# 📘 Guide des modèles SmartURLs (v1.4.0+)

Ce guide explique comment utiliser la fonction de modèle personnalisé de SmartURLs.
Les modèles sont écrits dans un **champ de saisie d'une seule ligne**, mais peuvent produire une sortie multiligne en utilisant le token `$nl`.

SmartURLs est intentionnellement léger. Il **ne lit jamais le contenu des pages web** et fonctionne **uniquement avec l'URL et les informations de l'onglet du navigateur**.

## 1. Tokens de base

SmartURLs remplace les tokens strictement basés sur les métadonnées de l'onglet et l'URL actuelle.

| Token        | Description                      | Exemple de sortie                             |
| ------------ | -------------------------------- | --------------------------------------------- |
| `$title`     | Titre de la page dans l'onglet   | `Why the Moon?`                               |
| `$url`       | URL complète                     | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | Nom d'hôte uniquement            | `www.youtube.com`                             |
| `$path`      | Partie chemin de l'URL           | `/watch`                                      |
| `$basename`  | Dernier segment du chemin        | `watch`                                       |
| `$idx`       | Index de l'onglet (base 1)       | `3`                                           |
| `$date`      | Date locale (YYYY-MM-DD)         | `2025-01-12`                                  |
| `$time`      | Heure locale (HH:MM:SS)          | `14:03:55`                                    |
| `$date(utc)` | Date UTC                         | `2025-01-12`                                  |
| `$time(utc)` | Heure UTC                        | `05:03:55`                                    |
| `$nl`        | Insère un saut de ligne          | *(produit des sauts de ligne en sortie)*     |

### Exemple d'URL et de titre utilisés ci-dessus

Pour montrer comment les tokens se développent, ces exemples utilisent :

📘 **Titre**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

De cette URL :

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (paramètre de requête) → `bmC-FwibsZg`

Les dates et heures sont des exemples ; la sortie réelle dépend de l'horloge de votre système.

## 2. Tokens de paramètres de requête

SmartURLs peut extraire les paramètres de requête directement de l'URL.

🔤 **Syntaxe**

```text
$<param>
```

📄 **Exemple**

URL :

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Sortie        |
| -- | - |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Si un paramètre n'existe pas, sa valeur devient une chaîne vide.

## 3. Blocs conditionnels

Les blocs conditionnels permettent aux modèles de produire certains textes **uniquement si des paramètres de requête spécifiques sont présents**.

🔤 **Syntaxe**

🔹 **Paramètre unique**

```text
{{q=v: ... }}
```

🔸 **Paramètres multiples (condition ET)**

```text
{{q=v,t: ... }}
```

À l'intérieur d'un bloc conditionnel :

* `$v`, `$t`, etc. se développent normalement
* `$nl`, `$title`, `$domain` fonctionnent également
* Les blocs imbriqués ne sont pas autorisés
* Aucun `else` n'est disponible

Si les conditions ne sont pas remplies, le bloc entier est supprimé de la sortie.

## 4. Exemples de modèles

Les modèles sont écrits sur *une ligne*, mais peuvent produire plusieurs lignes via `$nl`.

### 4.1 Markdown : Titre + URL

🛠 **Modèle**

```text
$title$nl$url
```

💬 **Sortie**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Élément de liste Markdown

🛠 **Modèle**

```text
- [$title]($url)
```

💬 **Sortie**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 ID de vidéo YouTube (uniquement si présent)

🛠 **Modèle**

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

💬 **Sortie**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

Si `v=` est absent :

```text
Why the Moon?
https://example.com/page
```

### 4.4 Résumé d'issue GitHub

🛠 **Modèle**

```text
## ${$basename}: $title$nl$url
```

💬 **Sortie**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 Format de journal (domaine + chemin)

🛠 **Modèle**

```text
[$domain] $path$nl$url
```

💬 **Sortie**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. Modèles pratiques

Voici des modèles prêts à l'emploi pour Markdown, journaux, utilitaires YouTube et formatage conditionnel.

URL d'exemple utilisée :

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 Markdown classique

```text
$title$nl$url
```

Sortie :

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Liste Markdown

```text
- [$title]($url)
```

Sortie :

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 Journal domaine + chemin

```text
[$domain] $path$nl$url
```

Sortie :

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 Résumé style issue GitHub

```text
## ${$basename}: $title$nl$url
```

Sortie :

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 Utilitaires YouTube

#### 5.5.1 Afficher l'ID de vidéo uniquement lorsqu'il est présent

```text
{{q=v:Video ID: $v$nl}}$title$nl$url
```

#### 5.5.2 Générer l'URL de la vignette

Basé sur le modèle de vignette YouTube connu :

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

Modèle :

```text
{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}$title$nl$url
```

#### 5.5.3 Intégrer une vignette Markdown

```text
{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}[$title]($url)
```

### 5.6 Horodatage (si disponible)

```text
{{q=t:Timestamp: $t sec$nl}}$title$nl$url
```

Sortie :

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 Conditionnel multi-paramètres

```text
{{q=v,t:Video: $v ($t sec)$nl}}$url
```

Sortie :

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 Minimaliste

```text
$title — $url
```

### 5.9 Entrée de journal quotidien

```text
- [$title]($url) — $date $time
```

### 5.10 Résumé style nom de fichier

```text
$basename — $title
```

### 5.11 Multiligne avec séparateur

```text
$title$nl$url$nl$nl$domain
```

## 6. Limitations

SmartURLs reste intentionnellement simple.

❌ SmartURLs ne fait `PAS` :

* Analyser le contenu des pages web
* Lire les métadonnées ou les vignettes
* Exécuter JavaScript sur la page
* Extraire les balises OG, auteurs ou descriptions
* Prendre en charge les conditionnels imbriqués ou `else`

✔️ SmartURLs utilise `UNIQUEMENT` :

* Titre de l'onglet
* Composants d'URL
* Paramètres de requête
* Remplacement simple de tokens
* Blocs conditionnels optionnels

Cela garantit un comportement cohérent sur tous les sites web.

## 7. Compatibilité des versions

Ces fonctionnalités sont disponibles dans : **SmartURLs v1.4.0 et ultérieur**

## 8. Commentaires

Pour les demandes de fonctionnalités ou les questions, veuillez ouvrir un issue sur GitHub.
