---
layout: post
title: "클로드 스킬, 서브에이전트, 커맨드 개념 한번에 이해하기"
categories: onboarding
tags: [Claude, 스킬, 서브에이전트, 커맨드]
date: 2026-05-07 12:45:00 +0900
excerpt: "코딩알려주는누나 채널의 영상으로 Claude Code의 핵심 개념인 스킬, 서브에이전트, 커맨드를 한번에 정리합니다."
---

{% include youtube.html id="2eqPBLgVH0U" title="클로드 스킬, 서브에이전트, 커맨드 개념 몰랐던 사람 한번에 이해시켜드림" %}

**출처:** [코딩알려주는누나](https://www.youtube.com/@coding_unnie)

## 영상에서 다루는 내용

- **스킬(Skill)** — Claude Code에서 반복 작업을 자동화하는 슬래시 커맨드 형태의 기능
- **서브에이전트(Sub-agent)** — 복잡한 작업을 병렬로 처리하기 위해 Claude가 생성하는 하위 에이전트
- **커맨드(Command)** — 대화 중 특정 동작을 트리거하는 `/` 명령어

## 핵심 포인트

> 스킬, 서브에이전트, 커맨드는 Claude Code를 단순 채팅 도구가 아닌 **자동화 에이전트**로 활용하는 핵심 구조입니다.

- 스킬은 프로젝트 또는 글로벌 단위로 정의해 재사용 가능
- 서브에이전트는 독립된 컨텍스트로 실행되므로 메인 대화를 오염시키지 않음
- 커맨드(`/help`, `/clear`, `/review` 등)는 Claude Code 사용 효율을 크게 높여줌

---

**관련 글**

- [Claude Code 필수 지식 정리 — 13분 영상으로 입문하고, 핵심만 다시 짚기]({% post_url 2026-06-09-claude-code-essentials-20 %}) — Claude Code 전체 그림 잡기
- [Anthropic 공식 Skills 저장소]({% post_url 2026-05-07-anthropic-skills %}) — 바로 설치해 쓸 수 있는 공식 스킬
- [Gemini CLI Skill Creator: 나만의 맞춤형 에이전트 스킬 만들기]({% post_url 2026-05-18-gemini-cli-skill-creator %}) — Gemini CLI에서의 스킬 활용
