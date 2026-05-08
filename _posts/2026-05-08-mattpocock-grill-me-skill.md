---
layout: post
title: "Matt Pocock의 grill-me 스킬 — 계획을 끝까지 심문하기"
categories: skills-mcp
tags: [Skills, Claude Code, Matt Pocock, Planning]
date: 2026-05-08 10:00:00 +0900
excerpt: "계획이나 설계의 모든 분기점을 집요하게 질문해 합의에 도달시키는 Matt Pocock의 grill-me 스킬을 소개합니다."
---

- **GitHub:** [mattpocock/skills](https://github.com/mattpocock/skills)
- **스킬 위치:** `skills/productivity/grill-me/SKILL.md`

## 개요

`grill-me`는 사용자가 가진 **계획·설계를 끝까지 심문(grill)** 해서 의사결정 트리의 모든 분기를 해소하는 스킬입니다. Claude가 구현에 들어가기 전, 모호한 부분을 한 번에 하나씩 질문해 합의에 도달시키는 인터뷰형 워크플로우입니다.

## SKILL.md 핵심 내용

```yaml
---
name: grill-me
description: Interview the user relentlessly about a plan or design
  until reaching shared understanding, resolving each branch of the
  decision tree. Use when user wants to stress-test a plan, get
  grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we
reach a shared understanding. Walk down each branch of the design
tree, resolving dependencies between decisions one-by-one. For each
question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the
codebase instead.
```

## 작동 방식

| 단계 | 내용 |
|---|---|
| **1. 트리 탐색** | 설계의 각 분기를 따라 내려가며 의존성 있는 결정을 순차적으로 해결 |
| **2. 단일 질문** | 한 번에 하나의 질문만 던져 사용자 부담 최소화 |
| **3. 추천 답변 동반** | 모든 질문에 Claude의 추천 답변을 함께 제시 |
| **4. 코드 우선 탐색** | 코드베이스를 읽으면 알 수 있는 질문은 묻지 않고 직접 탐색 |

## 트리거 키워드

> "grill me", "이 계획을 stress-test 해줘", "내 설계를 검증해줘"

위와 같은 의도가 감지되면 자동으로 활성화됩니다.

## 설치 방법

저장소를 클론하거나 `SKILL.md`를 직접 복사합니다.

```bash
# 프로젝트 단위 설치
mkdir -p .claude/skills/grill-me
curl -o .claude/skills/grill-me/SKILL.md \
  https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grill-me/SKILL.md

# 사용자 글로벌 설치 (Windows)
mkdir %USERPROFILE%\.claude\skills\grill-me
curl -o %USERPROFILE%\.claude\skills\grill-me\SKILL.md ^
  https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grill-me/SKILL.md
```

## 비슷한 스킬과의 차이

| 스킬 | 성격 |
|---|---|
| **grill-me** | 짧고 단호한 인터뷰 — 의사결정 트리 끝까지 |
| **grill-with-docs** | 인터뷰 + 도메인 모델·문서와 대조 검증 |
| **design-align** | 구조화된 Q&A 후 합의를 마크다운으로 산출 |

## 핵심 포인트

> 좋은 코드는 결국 **명확한 의사결정**의 결과물입니다. `grill-me`는 구현 전에 결정의 빈틈을 모두 드러내는 도구입니다.

- 한 번에 하나의 질문 → 사용자 인지 부하 최소화
- 추천 답변 동반 → 단순 질문 폭격이 아닌 **협업적 인터뷰**
- 코드로 답할 수 있는 건 코드를 본다 → 불필요한 핑퐁 차단
