# 📘 SmartURLs 템플릿 가이드 (v1.4.0+)

이 가이드는 SmartURLs의 커스텀 템플릿 기능 사용 방법을 설명합니다.
템플릿은 **한 줄 입력 필드**에 작성하지만, `$nl` 토큰을 사용하여 여러 줄 출력을 생성할 수 있습니다.

SmartURLs는 의도적으로 가볍습니다. **웹페이지 내용을 읽지 않으며** **URL과 브라우저 탭 정보만으로** 작동합니다.

## 1. 기본 토큰

SmartURLs는 탭 메타데이터와 현재 URL을 기반으로 토큰을 교체합니다.

| 토큰         | 설명                           | 출력 예시                                     |
| ------------ | ------------------------------ | --------------------------------------------- |
| `$title`     | 탭에 표시되는 페이지 제목       | `Why the Moon?`                               |
| `$url`       | 전체 URL                       | `https://www.youtube.com/watch?v=bmC-FwibsZg` |
| `$domain`    | 호스트명만                     | `www.youtube.com`                             |
| `$path`      | URL의 경로 부분                | `/watch`                                      |
| `$basename`  | 경로의 마지막 세그먼트         | `watch`                                       |
| `$idx`       | 탭 인덱스 (1부터 시작)         | `3`                                           |
| `$date`      | 로컬 날짜 (YYYY-MM-DD)         | `2025-01-12`                                  |
| `$time`      | 로컬 시간 (HH:MM:SS)           | `14:03:55`                                    |
| `$date(utc)` | UTC 날짜                       | `2025-01-12`                                  |
| `$time(utc)` | UTC 시간                       | `05:03:55`                                    |
| `$nl`        | 줄 바꿈 삽입                   | *(출력에 줄 바꿈 생성)*                       |

### 위에서 사용된 예시 URL 및 제목

토큰이 어떻게 확장되는지 보여주기 위해 다음 예시를 사용합니다:

📘 **제목**

```text
Why the Moon?
```

🔗 **URL**

```text
https://www.youtube.com/watch?v=bmC-FwibsZg
```

이 URL에서:

* `$domain` → `www.youtube.com`
* `$path` → `/watch`
* `$basename` → `watch`
* `$v` (쿼리 매개변수) → `bmC-FwibsZg`

날짜와 시간은 예시이며, 실제 출력은 시스템 시계에 따라 다릅니다.

## 2. 쿼리 매개변수 토큰

SmartURLs는 URL에서 직접 쿼리 매개변수를 추출할 수 있습니다.

🔤 **구문**

```text
$<param>
```

📄 **예시**

URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

| 토큰 | 출력          |
| ---- | ------------- |
| `$v` | `bmC-FwibsZg` |
| `$t` | `123`         |

매개변수가 존재하지 않으면 그 값은 빈 문자열이 됩니다.

## 3. 조건부 블록

조건부 블록을 사용하면 템플릿이 **특정 쿼리 매개변수가 존재할 때만** 특정 텍스트를 출력할 수 있습니다.

🔤 **구문**

🔹 **단일 매개변수**

```text
{% raw %}{{q=v: ... }}{% endraw %}
```

🔸 **다중 매개변수 (AND 조건)**

```text
{% raw %}{{q=v,t: ... }}{% endraw %}
```

조건부 블록 내에서:

* `$v`, `$t` 등은 정상적으로 확장됩니다
* `$nl`, `$title`, `$domain`도 작동합니다
* 중첩된 블록은 허용되지 않습니다
* `else`는 사용할 수 없습니다

조건이 충족되지 않으면 전체 블록이 출력에서 제거됩니다.

## 4. 템플릿 예시

템플릿은 *한 줄*로 작성되지만 `$nl`을 통해 여러 줄을 출력할 수 있습니다.

### 4.1 Markdown: 제목 + URL

🛠 **템플릿**

```text
$title$nl$url
```

💬 **출력**

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.2 Markdown 리스트 항목

🛠 **템플릿**

```text
- [$title]($url)
```

💬 **출력**

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg)
```

### 4.3 YouTube 동영상 ID (존재할 때만)

🛠 **템플릿**

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

💬 **출력**

```text
Video ID: bmC-FwibsZg
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

`v=`가 없으면:

```text
Why the Moon?
https://example.com/page
```

### 4.4 GitHub 이슈 요약

🛠 **템플릿**

```text
## ${$basename}: $title$nl$url
```

💬 **출력**

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg
```

### 4.5 로그 형식 (도메인 + 경로)

🛠 **템플릿**

```text
[$domain] $path$nl$url
```

💬 **출력**

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg
```

## 5. 실용적인 템플릿 패턴

Markdown, 로그, YouTube 유틸리티 및 조건부 서식을 위한 즉시 사용 가능한 패턴입니다.

사용된 예시 URL:

```text
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.1 클래식 Markdown

```text
$title$nl$url
```

출력:

```text
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.2 Markdown 리스트

```text
- [$title]($url)
```

출력:

```text
- [Why the Moon?](https://www.youtube.com/watch?v=bmC-FwibsZg&t=123)
```

### 5.3 도메인 + 경로 로그

```text
[$domain] $path$nl$url
```

출력:

```text
[youtube.com] /watch
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.4 GitHub 이슈 스타일 요약

```text
## ${$basename}: $title$nl$url
```

출력:

```text
## watch: Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.5 YouTube 유틸리티

#### 5.5.1 동영상 ID가 있을 때만 표시

```text
{% raw %}{{q=v:Video ID: $v$nl}}{% endraw %}$title$nl$url
```

#### 5.5.2 썸네일 URL 생성

알려진 YouTube 썸네일 패턴 기반:

```text
https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
```

템플릿:

```text
{% raw %}{{q=v:Thumbnail: https://img.youtube.com/vi/$v/maxresdefault.jpg$nl}}{% endraw %}$title$nl$url
```

#### 5.5.3 Markdown 썸네일 삽입

```text
{% raw %}{{q=v:![thumb](https://img.youtube.com/vi/$v/mqdefault.jpg)$nl}}{% endraw %}[$title]($url)
```

### 5.6 타임스탬프 (가능한 경우)

```text
{% raw %}{{q=t:Timestamp: $t sec$nl}}{% endraw %}$title$nl$url
```

출력:

```text
Timestamp: 123 sec
Why the Moon?
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.7 다중 매개변수 조건

```text
{% raw %}{{q=v,t:Video: $v ($t sec)$nl}}{% endraw %}$url
```

출력:

```text
Video: bmC-FwibsZg (123 sec)
https://www.youtube.com/watch?v=bmC-FwibsZg&t=123
```

### 5.8 미니멀리스트

```text
$title — $url
```

### 5.9 일일 로그 항목

```text
- [$title]($url) — $date $time
```

### 5.10 파일명 스타일 요약

```text
$basename — $title
```

### 5.11 구분자가 있는 여러 줄

```text
$title$nl$url$nl$nl$domain
```

## 6. 제한사항

SmartURLs는 의도적으로 단순하게 유지됩니다.

❌ SmartURLs가 `하지 않는 것`:

* 웹페이지 내용 구문 분석
* 메타데이터 또는 썸네일 읽기
* 페이지에서 JavaScript 실행
* OG 태그, 작성자 또는 설명 추출
* 중첩된 조건 또는 `else` 지원

✔️ SmartURLs가 `오직 사용하는 것`:

* 탭 제목
* URL 구성 요소
* 쿼리 매개변수
* 단순 토큰 교체
* 선택적 조건부 블록

이것은 모든 웹사이트에서 일관된 동작을 보장합니다.

## 7. 버전 호환성

이 기능은 다음에서 사용할 수 있습니다: **SmartURLs v1.4.0 이상**

## 8. 피드백

기능 요청이나 질문이 있으면 GitHub에서 이슈를 열어주세요.
