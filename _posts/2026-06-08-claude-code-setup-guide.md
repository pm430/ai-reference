---
layout: post
title: "claude-code-setup — 코드베이스를 분석해 자동화를 추천하는 공식 플러그인"
categories: skills-mcp
tags: [Claude Code, Plugin, 자동화, Skills, Hooks, MCP, Subagent]
date: 2026-06-08 10:00:00 +0900
excerpt: "Claude Code에 어떤 Hooks·Skills·MCP를 추가해야 할지 막막할 때, Anthropic 공식 claude-code-setup 플러그인이 코드베이스를 분석해 카테고리별 자동화를 직접 추천해줍니다."
---

## 무엇을 해결하나

Claude Code는 Hooks, Skills, Subagents, Slash Commands, MCP 서버로 끝없이 확장할 수 있습니다. 문제는 **"내 프로젝트엔 무엇을 추가해야 하지?"** 에서 막힌다는 점입니다. 선택지가 너무 많아 오히려 아무것도 설정하지 않게 됩니다.

[`claude-code-setup`](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup)은 Anthropic이 공식 플러그인 저장소(`claude-plugins-official`)에 올린 플러그인으로, 이 막막함을 해결합니다. 코드베이스를 **읽기 전용으로 스캔**한 뒤, 카테고리마다 가장 효과가 큰 자동화 1~2개를 골라 추천해줍니다.

핵심은 단 하나의 스킬, `claude-automation-recommender`입니다.

---

## 설치

Claude Code의 플러그인 시스템으로 설치합니다.

```bash
# 공식 마켓플레이스에서 바로 설치
/plugin install claude-code-setup@claude-plugins-official
```

마켓플레이스가 등록되어 있지 않다면 먼저 추가합니다.

```bash
/plugin marketplace add anthropics/claude-plugins-official
```

또는 `/plugin` → **Discover** 메뉴에서 목록을 둘러보며 설치할 수도 있습니다.

---

## 어떻게 동작하나

설치 후 자연어로 요청하면 스킬이 활성화됩니다.

```text
이 프로젝트에 어떤 자동화를 추가하면 좋을까?
help me set up Claude Code
what hooks should I use?
```

그러면 플러그인이 다음 순서로 분석합니다.

1. **코드베이스 프로파일링** — 언어, 프레임워크, 의존성을 읽어 기술 스택을 파악(React, Express, Prisma 등)
2. **신호 매칭** — 감지한 기술을 추천 매트릭스와 대조
3. **웹 검색 보강** — 템플릿에만 의존하지 않고, 감지된 라이브러리에 맞는 최신 도구를 검색해 보완
4. **카테고리별 추천 정리** — 각 영역에서 효과가 큰 1~2개만 선별

> **읽기 전용입니다.** 이 플러그인은 분석과 추천만 합니다. 파일을 만들거나 고치지 않으므로, 추천을 받은 뒤 직접 적용하거나 Claude에게 별도로 구현을 요청하면 됩니다.

---

## 추천하는 5가지 카테고리

| 카테고리 | 무엇을 추천하나 | 예시 |
|---|---|---|
| **MCP 서버** | 외부 시스템 연결 (DB, 문서, 브라우저) | context7(문서 조회), Playwright(프론트엔드) |
| **Skills** | 반복 작업을 묶은 재사용 워크플로우 | Plan 에이전트, frontend-design |
| **Hooks** | 도구 이벤트에 자동 실행되는 동작 | 자동 포맷, 자동 lint, 민감 파일 차단 |
| **Subagents** | 특정 관점의 전문 리뷰어 | 보안, 성능, 접근성 검토 |
| **Slash Commands** | 빠르게 호출하는 워크플로우 | `/test`, `/pr-review`, `/explain` |

기본은 카테고리마다 1~2개씩만 제안해 과부하를 막습니다. 특정 유형을 콕 집어 물으면(예: "MCP 서버 추천만 해줘") 3~5개까지 더 자세히 제시합니다.

---

## 추천 결과는 이렇게 나온다

스킬은 단순 목록이 아니라 구조화된 리포트로 답합니다.

- 감지된 코드베이스 프로파일 (언어 / 프레임워크 / 주요 라이브러리)
- 카테고리별 추천 항목과 **선택 이유**
- 설치·설정 방법 안내
- 호출 주체 표시 (사용자 전용 / Claude 전용 / 둘 다)
- "특정 카테고리를 더 추천받을까요?" 라는 후속 제안

즉 "이걸 왜 추천하는지"와 "어떻게 적용하는지"가 함께 와서, 받은 추천을 바로 행동으로 옮길 수 있습니다.

---

## 언제 쓰면 좋은가

- 새 프로젝트에 Claude Code를 **처음 도입**할 때 — 무엇부터 설정할지 출발점을 잡아줌
- 한동안 기본 설정으로만 쓰다가 **워크플로우를 최적화**하고 싶을 때
- 특정 영역만 보강하고 싶을 때 — "이 프로젝트에 어떤 hook이 필요해?" 처럼 좁혀서 질문

추천은 출발점일 뿐입니다. 받은 항목을 그대로 적용하기보다, 팀 상황에 맞는지 한 번 검토한 뒤 도입하는 것을 권합니다.

---

## 마무리

`claude-code-setup`은 "Claude Code를 어떻게 설정해야 하는가"라는 막연한 질문에, **내 코드베이스에 맞춘 구체적 답**을 주는 공식 플러그인입니다. 읽기 전용이라 부담 없이 돌려볼 수 있고, 추천 항목마다 이유와 적용법이 붙어 그대로 셋업으로 이어집니다.

설정 항목 하나하나를 직접 작성하는 법이 궁금하다면 아래 글들을 함께 보세요.

**관련 글**
- {% post_url 2026-06-09-claude-code-essentials-20 %} — Claude Code 필수 지식 정리(13분 영상)
- {% post_url 2026-05-07-ai-cli-tools-installation %} — Claude Code 설치 방법
- {% post_url 2026-05-18-mcp-the-future-of-ai-tooling %} — MCP 개념 심화
- {% post_url 2026-05-07-anthropic-skills %} — Anthropic 공식 스킬 목록
