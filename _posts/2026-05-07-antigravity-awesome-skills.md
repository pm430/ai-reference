---
layout: post
title: "Antigravity Awesome Skills — 1,400+ 에이전트 스킬 모음"
categories: skills-mcp
tags: [Skills, Claude Code, Cursor, Codex, Gemini CLI]
date: 2026-05-07 13:11:20 +0900
excerpt: "Claude Code, Cursor, Codex CLI, Gemini CLI 등 다양한 AI 코딩 에이전트에 설치 가능한 1,400개 이상의 스킬 플레이북 모음입니다."
---

- **GitHub:** [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)

## 개요

커뮤니티에서 검증된 1,400개 이상의 재사용 가능한 에이전트 스킬(`SKILL.md` 플레이북)을 모아둔 메가 레포지토리입니다. Claude Code, Cursor, OpenAI Codex CLI, Gemini CLI, Antigravity IDE 등 마크다운 기반 스킬 사양을 따르는 모든 최신 AI 코딩 도구와 호환됩니다.

## 대화형 CLI를 통한 간편 설치

`npx` 명령어를 통해 별도의 번거로운 git clone 없이 터미널에서 대화형 인터페이스(TUI)로 원하는 스킬만 골라 담을 수 있습니다.

```bash
# 대화형 설치 마법사 실행
npx antigravity-awesome-skills
```

실행하면 다음과 같은 옵션을 선택할 수 있습니다:

1. **설치 범위 선택**:
   - `Global` (`~/.claude/skills/` 또는 `~/.gemini/config/skills/`): 모든 프로젝트에서 항상 사용
   - `Project-local` (`.agents/skills/` 또는 `.claude/skills/`): 현재 코드베이스에만 형상 관리
2. **설치 모드**:
   - `Curated Bundles`: 역할별로 엄선된 베스트 팩 설치 (추천)
   - `Search & Pick`: 1,400개 중 키워드 검색으로 필요한 스킬 1~2개만 선택
   - `Full Library`: 전체 라이브러리 일괄 다운로드

## 주요 추천 번들 (Role-based Bundles)

| 번들 이름 | 포함 스킬 예시 | 적합한 대상 |
| --- | --- | --- |
| **Full-Stack Engineer** | `api-design`, `react-patterns`, `sql-optimizer`, `e2e-playwright` | 웹 프론트/백엔드 전반을 아우르는 개발자 |
| **Security & Auditing** | `owasp-top10`, `secret-scanner`, `jwt-auditor`, `dependency-check` | 결제, 인증, 금융 등 높은 보안 수준이 요구되는 프로젝트 |
| **DevOps & Infra** | `dockerfile-lint`, `k8s-manifest`, `github-actions-ci`, `terraform-best-practice` | 배포 자동화 및 클라우드 인프라 엔지니어링 |
| **Code Review & Quality**| `surgical-diff`, `test-driven-dev`, `docstring-gen`, `complexity-checker` | 코드 리뷰 시간 단축 및 품질 표준화 |

## 스킬 선택 및 관리 가이드: "많다고 다 좋은 것이 아니다"

1,400개의 스킬이 존재한다고 해서 무턱대고 수십 개를 글로벌로 설치하면 다음과 같은 부작용이 생깁니다:

> **과도한 스킬 등록의 위험:**
> - 시스템 프롬프트에 수십 개 스킬의 `name`과 `description`이 나열되어 초기 토큰을 차지합니다.
> - 유사한 목적의 스킬이 중복되면 에이전트가 어떤 스킬을 골라야 할지 혼란을 겪거나 의도치 않은 규칙을 혼합 적용합니다.

**추천 전략**:
- **글로벌에는 3~5개만**: 팀 공통 코딩 스타일, 언어별 린트 보조 등 범용 스킬만 등록
- **프로젝트 단위로 특화**: 해당 저장소의 기술 스택(예: Next.js, FastAPI, Spring)에 특화된 스킬은 프로젝트 폴더에 두고 Git으로 팀원들과 동기화

---


**관련 글**

- [Anthropic 공식 Skills 저장소]({% post_url 2026-05-07-anthropic-skills %}) — Anthropic 공식 스킬 모음
- [Google Gemini Skills 저장소]({% post_url 2026-05-07-gemini-skills %}) — Google 공식 스킬 라이브러리
- [Matt Pocock의 grill-me 스킬 — 계획을 끝까지 심문하기]({% post_url 2026-05-08-mattpocock-grill-me-skill %}) — 개성 있는 단일 스킬 사례
