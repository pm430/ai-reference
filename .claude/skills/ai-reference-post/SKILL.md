---
name: ai-reference-post
description: >-
  Use this skill whenever the user wants to create, add, draft, rewrite, fix, or
  cross-link a post on their personal AI/dev blog — the ai-reference Jekyll site at
  pm430.github.io/ai-reference. Trigger on any request to "add/write a new post,"
  "정리 포스트 만들어줘," "글 하나 더 올리자/추가해줘," "다시 써줘," whether the source is a
  topic, concept, news/announcement, tool, GitHub repo, YouTube video, or a roundup of
  articles. Trigger when the user names one of this site's categories (onboarding,
  skills-mcp, cloud-llm, local-llm, prompt-engineering, use-cases), or asks to link new
  and existing posts together. The skill knows the site's _posts naming, front matter,
  categories, cross-link, YouTube-embed, and GitHub Pages publishing rules so the build
  never breaks. Do NOT use it for setting up a brand-new Jekyll/blog site from scratch,
  editing _config.yml or layouts alone, writing CLAUDE.md, or general non-blog coding tasks.
---

# ai-reference 블로그 글 작성

이 스킬은 `ai-reference` Jekyll 사이트(`https://pm430.github.io/ai-reference`)에 글을 쓰거나 고칠 때의 모든 컨벤션을 담는다. 목표는 **빌드를 깨지 않으면서** 사이트 톤과 구조에 맞는 글을 만드는 것이다.

## 작업 흐름

1. **무엇을/어떤 카테고리로** 쓸지 정한다 → 확인: 카테고리가 아래 6개 중 하나인가
2. 필요하면 출처(영상·문서·repo)를 **읽어 사실을 확인**한다 → 확인: 지어내지 않았는가
3. `_posts/`에 파일을 만든다 → 확인: 파일명·front matter·날짜 규칙을 지켰는가
4. 본문을 쓰고 **교차링크 대상이 실제로 존재하는지** 확인한다 → 확인: 모든 `{% post_url %}` 대상 파일이 있는가
5. **발행 안전성**을 점검한다 → 확인: 미래 날짜 함정에 걸리지 않는가 (아래 "발행 규칙" 필독)
6. git 브랜치를 따고 커밋한다 → 확인: 푸시는 사용자 승인 후에만

## 파일 위치와 이름

- 글은 `_posts/YYYY-MM-DD-<slug>.md` 에 둔다.
- `<slug>` 는 URL이 된다. permalink가 `/:categories/:title/` 라서 최종 주소는 `/<category>/<slug>/` 다. 날짜는 URL에 들어가지 않는다.
- slug는 영문 소문자·하이픈으로 짓는다 (예: `claude-code-essentials-20`).

## Front matter

기존 글과 동일한 형식을 쓴다. 모든 필드를 채운다.

```yaml
---
layout: post
title: "한국어 제목 — 부제는 em dash로"
categories: skills-mcp
tags: [Claude Code, Plugin, 자동화]
date: 2026-06-09 09:00:00 +0900
excerpt: "검색 결과·목록에 노출되는 1~2문장 요약. 글의 핵심 가치를 압축한다."
---
```

- `categories`: **단수 id 하나만**. 사용 가능한 값과 의미:

  | id | 이름 | 용도 |
  |---|---|---|
  | `onboarding` | 온보딩 | AI 기초·입문, 설치, 개념 소개 |
  | `skills-mcp` | 스킬 & MCP | Claude Code 스킬, MCP 서버, 플러그인 |
  | `cloud-llm` | 클라우드 LLM | Claude/GPT/Gemini 등 동향 |
  | `local-llm` | 로컬 LLM | Ollama, LM Studio 등 |
  | `prompt-engineering` | 프롬프트 엔지니어링 | 프롬프트 작성 기법 |
  | `use-cases` | 적용 사례 | 실제 활용 경험·사례 |

  목록에 없는 카테고리는 만들지 않는다. 새 카테고리가 필요하면 `_config.yml`의 `categories_list`에 먼저 추가해야 한다고 사용자에게 알린다.

- `tags`: 대괄호 배열. 한국어/영어 섞어도 됨. 3~7개가 적당.
- `title`/`excerpt`: 큰따옴표로 감싼다. 콜론이 들어가면 YAML이 깨지므로 따옴표는 필수.
- `date`: **발행 규칙**을 반드시 읽고 정한다 (아래).

## 발행 규칙 — 미래 날짜 함정 (가장 중요)

GitHub Pages는 `future: false`로 빌드한다. **빌드 시점(UTC)보다 미래인 날짜의 글은 통째로 건너뛴다.** 그리고 건너뛴 글을 다른 글이 `{% post_url %}`로 참조하면 **사이트 전체 빌드가 실패한다.** (실제로 이 함정 때문에 사이트가 깨진 적 있다.)

그래서:

- 새 글 날짜는 **"지금"보다 과거**여야 한다. 타임존을 조심하라: `date: 2026-06-09 10:00:00 +0900` 는 UTC로 `06-09 01:00`이다. 한국 오전에 빌드가 돌면 이 글은 "미래"로 걸러진다.
- 안전책: 날짜를 **그날 이른 시각**(예: `00:00:00 +0900` = 전날 15:00 UTC)으로 두거나, 확실히 지난 날짜를 쓴다.
- **published 글이 future-dated 글을 `{% post_url %}`로 참조하게 두지 마라.** 교차링크하는 두 글 모두 발행 상태(과거 날짜)여야 한다.
- 의도적으로 예약 발행하려면(미래 날짜 유지), 그 글을 **아무도 `post_url`로 참조하지 않도록** 한다. 건너뛰어도 빌드는 안 깨진다.

## 교차링크

- 내부 링크는 `{% post_url YYYY-MM-DD-slug %}` 를 쓴다 (확장자 `.md` 없이, 날짜 포함 = `_posts/`의 파일명 그대로).
- **존재하지 않는 글을 참조하면 빌드가 실패한다.** 링크를 걸기 전에 `_posts/`에 대상 파일이 실제로 있는지 확인하라.
- 글 끝에 **관련 글** 섹션을 둔다. 형식:

  ```markdown
  **관련 글**
  - {% post_url 2026-05-07-ai-cli-tools-installation %} — Claude Code 설치 방법
  - {% post_url 2026-05-18-mcp-the-future-of-ai-tooling %} — MCP 개념 심화
  ```

- 새 글과 관련된 기존 글이 있으면, **양방향**으로 연결한다 (기존 글의 "관련 글"에도 새 글을 추가).

## YouTube 영상 글

영상을 다루는 글은 사이트의 include를 쓴다.

```liquid
{% include youtube.html id="VIDEO_ID" title="영상 제목" %}

**출처:** [채널/영상 제목](https://youtu.be/VIDEO_ID)
```

- `VIDEO_ID`는 `youtu.be/<ID>` 또는 `watch?v=<ID>`의 ID 부분.
- 영상의 자막·설명을 직접 확인할 수 없으면, **영상이 다룬 내용을 임의로 단정하지 마라.** 영상을 "요약/입문 영상"으로 소개하고, 본문은 검증 가능한 사실로 직접 쓴다. 채널명을 확신할 수 없으면 영상 URL 자체를 출처로 링크한다.

## 본문 스타일

기존 글들과 톤·구조를 맞춘다.

- 한국어로 쓴다. 군더더기 없이, 핵심을 먼저.
- 섹션은 `##`로 나누고, 큰 단락 사이에 `---`(수평선)을 넣는다.
- 비교·정리는 표를 적극 활용한다.
- 가장 중요한 한 줄은 `>` 인용 블록으로 강조한다.
- 코드/명령은 펜스 코드블록(언어 지정: ```bash, ```yaml, ```text 등).
- 과장하지 않는다. "추천은 출발점일 뿐" 같은 균형 잡힌 마무리를 선호한다.

## markdownlint

이 저장소는 markdownlint를 따른다(과거 커밋에서 정리 이력 있음). 자주 걸리는 것:

- 제목(`#`) 위아래로 빈 줄 (MD022)
- 리스트 위아래로 빈 줄 (MD032)
- 줄 끝 공백 금지 (MD009)
- 파일 끝에 개행 하나

기본 markdownlint 규칙에 맞춰 쓰면 된다.

## git

- 이 저장소에서 사용자는 **`main`에 직접 커밋·푸시**하는 것을 선호한다. 별도 지시가 없으면 브랜치를 따지 말고 `main`에서 바로 커밋하고 푸시한다.
- 단, `main`은 곧 라이브 사이트다. **푸시 전 반드시 "발행 전 최종 점검"을 통과**시킨다 (미래 날짜·`post_url`·YAML). 점검 없이 푸시해서 빌드를 깨지 않는다.
- 커밋 메시지는 한국어, conventional prefix를 쓴다: `feat:`(새 글), `fix:`(수정), `chore:`(설정).
- 커밋 메시지 끝에 `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` 를 붙인다.
- 푸시 후 GitHub Actions 빌드 결과가 success인지 확인한다. 실패하면 즉시 고친다.

## 발행 전 최종 점검

푸시하기 전에 가능하면 빌드를 검증한다.

- 로컬에 Jekyll이 있으면: `bundle exec jekyll build` 로 에러가 없는지 확인.
- Jekyll이 없으면 최소한:
  1. 모든 `{% post_url %}` 대상 파일이 `_posts/`에 존재하는가
  2. 새 글과 그 글을 참조하는 글의 날짜가 **미래가 아닌가**
  3. front matter YAML이 유효한가 (따옴표·콜론)
- 푸시 후에는 GitHub Actions(`pages build and deployment`) 결과가 success인지 확인한다. 실패하면 로그의 `Liquid Exception` / `has a future date` 를 보고 위 규칙으로 고친다.
