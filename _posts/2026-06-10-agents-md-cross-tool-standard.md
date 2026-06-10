---
layout: post
title: "AGENTS.md — Claude Code·Codex·Gemini CLI를 관통하는 공통 설정 표준"
categories: onboarding
tags: [AGENTS.md, CLAUDE.md, GEMINI.md, Codex CLI, Gemini CLI, 표준, 프로젝트 설정]
date: 2026-06-10 00:00:00 +0900
excerpt: "도구마다 다른 설정 파일(CLAUDE.md, GEMINI.md...)을 따로 관리하고 있나요? AGENTS.md는 20개 이상의 AI 코딩 도구가 함께 읽는 사실상의 공통 표준입니다. 하나의 파일로 모든 에이전트를 온보딩하는 방법을 정리합니다."
---

## 1. 문제: 도구마다 설정 파일이 다르다

AI 코딩 도구는 프로젝트 루트의 설정 파일을 읽고 시작합니다. 문제는 도구마다 파일 이름이 다르다는 것입니다.

| 도구 | 기본 설정 파일 |
|---|---|
| Claude Code | `CLAUDE.md` |
| OpenAI Codex CLI | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |

팀에서 Claude Code와 Codex를 함께 쓴다면, 같은 내용("테스트는 `./gradlew test`로 돌려라", "커밋 메시지는 한국어로")을 두 파일에 중복으로 관리해야 할까요?

---

## 2. 해답: AGENTS.md 표준

**AGENTS.md**는 OpenAI Codex CLI에서 시작해 지금은 **Linux Foundation이 관리하는 오픈 표준**이 된 에이전트 공통 설정 파일입니다. 6만 개 이상의 오픈소스 프로젝트가 채택했고, Codex CLI·Gemini CLI·Cursor·Copilot CLI·Zed·JetBrains Junie 등 **20개 이상의 도구**가 인식합니다.

- **공식 사이트:** [agents.md](https://agents.md/)

> 단 하나의 설정 파일만 관리할 수 있다면, AGENTS.md를 선택하세요. 2026년 현재 AI 코딩 에이전트 세계에서 공통 표준에 가장 가까운 파일입니다.

**Claude Code도 읽습니다.** 디렉터리에 `CLAUDE.md`가 없으면 Claude Code는 `AGENTS.md`를 폴백(fallback)으로 읽습니다. 즉 AGENTS.md 하나만 두면 Codex·Gemini·Claude Code를 모두 커버할 수 있습니다.

---

## 3. 무엇을 담아야 하나

AGENTS.md의 내용 원칙은 CLAUDE.md와 같습니다 — **"새로 온 팀원에게 처음 알려줄 것"**만 담습니다.

```markdown
# AGENTS.md 예시

## 빌드·테스트
- 빌드: ./gradlew build
- 테스트: ./gradlew test (커밋 전 반드시 통과)

## 코드 컨벤션
- Java 21, Spring Boot 3.x
- 서비스 레이어에 비즈니스 로직, 컨트롤러는 위임만

## 금지 사항
- src/main/resources/config/prod-*.yml 수정 금지
- DB 마이그레이션 파일은 직접 만들지 말고 사람에게 요청
```

빌드·테스트 명령, 아키텍처 규칙, 건드리면 안 되는 영역 — 이 세 가지가 핵심입니다. 무엇을 담고 무엇을 뺄지의 상세 원칙은 [CLAUDE.md 잘 쓰는 법]({% post_url 2026-06-09-claude-md-best-practices %})과 동일하게 적용됩니다.

---

## 4. 실전 운용 전략

팀 상황에 따라 두 가지 전략이 있습니다.

| 전략 | 방법 | 추천 상황 |
|---|---|---|
| **단일 파일** | `AGENTS.md` 하나만 유지 | 여러 도구를 혼용하는 팀, 오픈소스 |
| **심볼릭 링크** | `AGENTS.md`를 원본으로 두고 `ln -s AGENTS.md CLAUDE.md` | Claude Code 전용 지시가 필요 없는 경우 |

Claude Code만의 고유 기능(Hooks, 특정 스킬 지시 등)을 쓰고 싶다면, 공통 규칙은 AGENTS.md에 두고 `CLAUDE.md`에는 "AGENTS.md를 따르라"는 한 줄과 Claude 전용 지시만 추가하는 계층 구조도 좋습니다.

---

## 5. 마치며

도구는 계속 바뀝니다. 작년의 주력 도구가 올해는 아닐 수 있습니다. 그래서 **도구 중립적인 설정 파일에 팀의 규칙을 축적**해두는 것이 장기적으로 가장 안전한 투자입니다. AGENTS.md는 그 축적의 그릇으로 현재 가장 널리 합의된 선택지입니다.

**출처:** [agents.md 공식 사이트](https://agents.md/), [Agent Instruction Files — Codex Knowledge Base](https://codex.danielvaughan.com/2026/05/27/agent-instruction-files-agents-md-claude-md-cross-tool-portability-codex-cli/), [AI Coding Config Files Guide — DeployHQ](https://www.deployhq.com/blog/ai-coding-config-files-guide)

---

**관련 글**

- [CLAUDE.md 잘 쓰는 법 — 매 세션 읽히는 프로젝트 메모리 설계]({% post_url 2026-06-09-claude-md-best-practices %}) — 설정 파일에 담을 내용의 상세 원칙
- [AI 코딩 에이전트 CLI 설치 가이드 (Claude Code, Gemini, Codex, Ollama)]({% post_url 2026-05-07-ai-cli-tools-installation %}) — 각 도구 설치 방법
- [Claude Code 필수 지식 정리 — 13분 영상으로 입문하고, 핵심만 다시 짚기]({% post_url 2026-06-09-claude-code-essentials-20 %}) — Claude Code 전체 그림
