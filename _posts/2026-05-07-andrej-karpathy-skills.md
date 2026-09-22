---
layout: post
title: "Andrej Karpathy의 LLM 코딩 실수 방지 스킬"
categories: skills-mcp
tags: [Skills, Claude Code, Cursor, Karpathy]
date: 2026-05-07 13:12:00 +0900
excerpt: "AI 연구자 Andrej Karpathy의 관찰을 바탕으로 LLM이 코딩 시 자주 저지르는 실수를 방지하는 CLAUDE.md 스킬입니다."
---

- **GitHub:** [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)

## 개요

AI 연구자 Andrej Karpathy가 관찰한 LLM의 대표적인 코딩 실수 패턴을 방지하기 위해 정립된 실무 가이드라인입니다. `CLAUDE.md` 또는 `AGENTS.md` 형태로 프로젝트 루트에 배치하면 Claude Code, Cursor, Codex 등 주요 AI 코딩 에이전트의 불필요한 코드 변경과 과도한 엔지니어링을 즉시 억제할 수 있습니다.

## 4가지 핵심 원칙과 실전 가이드

| 원칙 | 핵심 지침 | 흔한 안티패턴 (방지 대상) |
| --- | --- | --- |
| **1. Think Before Coding** | 가정을 명시하고, 불확실하면 임의로 결정하지 말고 사용자에게 질문 | 단일 해석만 맞다고 단정하고 엉뚱한 방향으로 수백 줄 구현 |
| **2. Simplicity First** | 요청된 문제만 푸는 최소한의 코드 작성 (투기적 추상화 금지) | 헬퍼 함수 하나 추가하면서 범용 플러그인 아키텍처 구축 |
| **3. Surgical Changes** | 요청과 직접 관련된 라인만 정밀 수정 (주변 리팩토링 금지) | 오탈자 고치러 들어갔다가 인접 함수 포맷과 변수명까지 대량 수정 |
| **4. Goal-Driven Execution** | 성공 기준을 먼저 세우고(테스트·타입체크) 만족할 때까지 루프 | "고쳤습니다"라고 말하고 실행 확인 없이 대화를 끝냄 |

---

### 원칙 1. Think Before Coding (코딩 전 사고)

AI는 종종 모호한 요구사항을 만나면 자의적으로 추론하여 곧바로 코드를 생성합니다. 이 원칙은 구현에 앞서 다음과 같은 태도를 강제합니다:

> "가정을 명시적으로 밝혀라. 모호한 지점이 있다면 임의로 추측하지 말고 사용자에게 확인 질문을 던져라."

```markdown
<!-- CLAUDE.md / AGENTS.md 삽입 예시 -->
## 1. Think Before Coding
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
```

### 원칙 2. Simplicity First (단순성 최우선)

LLM은 종종 "앞으로 확장될 가능성"을 염두에 두고 한 번 쓰일 함수에 제네릭, 인터페이스, 팩토리 패턴을 덧붙입니다.

- 미래를 위한 "유연성"이나 "설정 가능성"은 요청받지 않았다면 작성하지 않습니다.
- 50줄로 끝낼 수 있는 로직을 200줄로 늘려 쓰지 않습니다.

### 원칙 3. Surgical Changes (외과수술식 수정)

버그 수정이나 작은 기능 변경을 요청했을 때 주변 코드 스타일을 정리하거나 불필요한 임포트를 정리하다가 의도치 않은 사이드 이펙트(Regression)를 일으키는 문제를 방지합니다.

- 내가 변경한 코드로 인해 발생한 미사용 변수/임포트만 정리합니다.
- 기존에 존재하던 레거시 코드나 포맷은 건드리지 않습니다. 변경된 모든 라인은 사용자의 요청에 직접 연결되어야 합니다.

### 원칙 4. Goal-Driven Execution (목표 주도 실행)

AI에게 "코드를 작성하라"고만 하면 코드만 뱉고 종료됩니다. 반면 "테스트를 통과시켜라"는 목표를 주면 스스로 오류를 고치며 반복합니다:

```text
1. [실패 재현] → verify: 테스트 실행하여 실패 확인
2. [최소 수정] → verify: 문제 라인만 수정
3. [검증 통과] → verify: 전체 테스트 스위트 통과 확인
```

## 설치 및 적용 방법

**1. 프로젝트 루트에 파일 배치:**
저장소 루트에 `AGENTS.md` 또는 `CLAUDE.md`를 두고 위 규칙을 명시합니다.

```bash
# 빠른 다운로드
curl -o AGENTS.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

**2. 에이전트 실행 시 효과:**
이 규칙을 적용하는 즉시 git diff의 불필요한 라인 수가 70% 이상 감소하며, 에이전트가 "더 간단한 방법이 있는데 이렇게 진행할까요?"라고 먼저 묻는 빈도가 늘어납니다.

---


**관련 글**

- [Anthropic 공식 Skills 저장소]({% post_url 2026-05-07-anthropic-skills %}) — Anthropic 공식 스킬 모음
- [Antigravity Awesome Skills — 1,400+ 에이전트 스킬 모음]({% post_url 2026-05-07-antigravity-awesome-skills %}) — 다양한 에이전트용 스킬 플레이북
- [AI와 함께하는 리팩토링 — 실전 5단계 워크플로우]({% post_url 2026-06-04-ai-refactor-workflow %}) — 이 스킬이 빛나는 실전 리팩토링 사례
