---
layout: post
title: "Anthropic 공식 Skills 저장소"
categories: skills-mcp
tags: [Claude Code, Skills, Anthropic]
date: 2026-05-07 13:11:30 +0900
excerpt: "Claude가 반복 작업을 재사용 가능한 방식으로 수행하도록 돕는 Anthropic 공식 스킬 모음입니다."
---

- **GitHub:** [anthropics/skills](https://github.com/anthropics/skills)
- **라이선스:** Apache 2.0 (일부 문서 스킬은 소스 공개)

## 개요

스킬(Skill)은 `SKILL.md` 파일로 구성된 자체 완결형 폴더로, Claude에게 특정 작업을 반복 가능한 방식으로 수행하는 방법을 가르칩니다. 이 저장소는 Anthropic이 직접 제공하는 레퍼런스 구현체입니다.

## 스킬 구조

```yaml
---
name: my-skill-name
description: 이 스킬이 무엇을 하는지, 언제 사용하는지 설명
---

# 스킬 이름

[Claude가 이 스킬 활성화 시 따를 지침]
```

## 제공 스킬 카테고리

| 카테고리 | 내용 |
|---|---|
| Creative & Design | 아트, 음악, 디자인 관련 작업 |
| Development & Technical | 웹 앱 테스트, MCP 서버 생성 등 |
| Enterprise & Communication | 기업 워크플로우 자동화 |
| Document Skills | docx, pdf, pptx, xlsx 문서 생성/편집 |

## 핵심 포인트

> 스킬은 Claude Code를 단순 채팅 도구가 아닌 **도메인 전문 에이전트**로 확장하는 핵심 구조입니다.

- `./spec` 폴더에서 Agent Skills 전체 사양 확인 가능
- `./template` 폴더로 커스텀 스킬 직접 제작 가능
