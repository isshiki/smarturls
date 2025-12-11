# 📘 Guide des modèles SmartURLs (v1.4.0+)

Ce guide explique comment utiliser la fonction de modèle personnalisé de SmartURLs.
Les modèles sont écrits dans un **champ de saisie d'une seule ligne**, mais peuvent produire une sortie multiligne en utilisant le token `$nl`.

SmartURLs est intentionnellement léger. Il **ne lit jamais le contenu des pages web** et fonctionne **uniquement avec l'URL et les informations de l'onglet du navigateur**.

## 1. Tokens de base

SmartURLs remplace les tokens strictement basés sur les métadonnées de l'onglet et l'URL actuelle.

| Token          | Description                                                                                                                  | Exemple de sortie                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `$title`       | Titre de la page dans l'onglet                                                                                               | `Why the Moon?`                                                                         |
| `$title(html)` | Titre de page échappé HTML (convertit `&`, `<`, `>`, `"`, `'` en entités). Sûr pour utilisation dans les balises/attributs HTML. | `Rock &amp; Roll &lt;Best Hits&gt;`<br>*(pour titre : "Rock & Roll \<Best Hits>")* |
| `$url`         | URL complète                                                                                                                 | `https://www.youtube.com/watch?v=bmC-FwibsZg`                                           |
| `$domain`    | Nom d'hôte uniquement            | `www.youtube.com`                             |
| `$path`      | Partie chemin de l'URL           | `/watch`                                      |
| `$basename`  | Dernier segment du chemin        | `watch`                                       |
| `$idx`       | Index de l'onglet (base 1)       | `3`                                           |
| `$date`      | Date locale (YYYY-MM-DD)         | `2025-01-12`                                  |
| `$time`      | Heure locale (HH:MM:SS)          | `14:03:55`                                    |
| `$date(utc)` | Date UTC                         | `2025-01-12`                                  |
| `$time(utc)` | Heure UTC                        | `05:03:55`                                    |
| `$nl`        | Insère un saut de ligne          | *(produit des sauts de ligne en sortie)*     |

> ⚠️ **Note sur `$nl`** : Le token `$nl` peut être utilisé dans les modèles personnalisés de **Copie** pour insérer des sauts de ligne dans le texte généré. Cependant, il n'est **pas pris en charge** dans les modèles personnalisés du côté **Ouvrir depuis le texte**, qui traite l'entrée ligne par ligne. Pour cette raison, un modèle qui utilise `$nl` du côté Copie ne se comportera pas de la même manière si vous le réutilisez comme modèle personnalisé d'ouverture. Si vous souhaitez que Copie et Ouvrir partagent le même modèle, évitez `$nl` dans le modèle d'ouverture ou utilisez le mode **Intelligent (détection automatique)** à la place.

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

🔗 **Exemple d'URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| Token | Sortie        |
| ----- | ------------- |
| `$v`  | `bmC-FwibsZg` |
| `$t`  | `123`         |

Si un paramètre n'existe pas, sa valeur devient une chaîne vide.

## 3. Blocs conditionnels

Les blocs conditionnels permettent aux modèles de produire certains textes **uniquement si des paramètres de requête spécifiques sont présents**.

🔤 **Syntaxe**

🔹 **Paramètre unique**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **Paramètres multiples (condition ET)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

À l'intérieur d'un bloc conditionnel :

* `$v`, `$t`, etc. se développent normalement
* `$nl`, `$title`, `$domain` fonctionnent également
* Les blocs imbriqués ne sont pas autorisés
* Aucun `else` n'est disponible

Si les conditions ne sont pas remplies, le bloc entier est supprimé de la sortie.

## 4. Exemples de modèles et motifs

Les modèles sont écrits sur *une ligne*, mais peuvent produire plusieurs lignes via `$nl`.

Exemple d'URL et de titre utilisés dans cette section :

📘 **Titre**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.1 Markdown : Titre + URL

🛠 **Modèle**

```template
$title$nl$url
```

💬 **Sortie**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.2 Élément de liste Markdown

🛠 **Modèle**

```template
- [$title]($url)
```

💬 **Sortie**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.3 ID de vidéo YouTube (uniquement si présent)

🛠 **Modèle**

```template
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **Sortie**

```output
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

Si `v=` est absent :

```output
Why the Moon?
https://example.com/page
```

### 4.4 Générer l'URL de vignette YouTube

Basé sur le modèle de vignette YouTube connu :

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

🛠 **Modèle**

```template
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

💬 **Sortie**

```output
Thumbnail: https://img.youtube.com/vi/bmC-FwibsZg/maxresdefault.jpg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.5 Intégrer une vignette YouTube (Markdown)

🛠 **Modèle**

```template
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

💬 **Sortie**

```output
![thumb](https://img.youtube.com/vi/bmC-FwibsZg/mqdefault.jpg)
[Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 4.6 Horodatage (si disponible)

🛠 **Modèle**

```template
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

💬 **Sortie**

```output
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.7 Conditionnel multi-paramètres

🛠 **Modèle**

```template
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

💬 **Sortie**

```output
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.8 Format de journal (domaine + chemin)

🛠 **Modèle**

```template
[$domain] $path$nl$url
```

💬 **Sortie**

```output
[www.youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.9 En-tête de style nom de fichier

🛠 **Modèle**

```template
## $basename: $title$nl$url
```

💬 **Sortie**

```output
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.10 Minimaliste

🛠 **Modèle**

```template
$title — $url
```

💬 **Sortie**

```output
Why the Moon? — https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 4.11 Entrée de journal quotidien

🛠 **Modèle**

```template
- [$title]($url) — $date $time
```

💬 **Sortie**

```output
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123) — 2025-01-12 14:03:55
```

### 4.12 Multiligne avec séparateur

🛠 **Modèle**

```template
$title$nl$url$nl---$nl$domain
```

💬 **Sortie**

```output
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
---
www.youtube.com
```

## 5. Limitations

SmartURLs reste intentionnellement simple.

❌ SmartURLs ne fait `PAS` :

* Analyser le contenu des pages web (SmartURLs n'a PAS la permission d'accéder ou de lire les pages HTML)
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

## 6. Compatibilité des versions

Ces fonctionnalités sont disponibles dans : **SmartURLs v1.4.0 et ultérieur**

## 7. Commentaires

Pour les demandes de fonctionnalités ou les questions, veuillez ouvrir un issue ici :

<https://github.com/isshiki/SmartURLs/issues>
