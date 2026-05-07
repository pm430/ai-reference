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

AI 연구자 Andrej Karpathy가 관찰한 LLM의 코딩 실수 패턴을 기반으로 만들어진 스킬입니다. `CLAUDE.md` 형태로 Claude Code에 적용하거나, Cursor 프로젝트 룰로도 활용할 수 있습니다.

## 4가지 핵심 스킬

| 스킬 | 내용 |
|---|---|
| **Think Before Coding** | 가정을 명시적으로 밝히고, 여러 해석이 있을 때 침묵하지 않고 제시 |
| **Simplicity First** | 요청된 것만 최소한으로 구현, 투기성 기능·추상화 금지 |
| **Surgical Changes** | 필요한 부분만 수정, 관련 없는 코드 개선·정리 금지 |
| **Goal-Driven Execution** | 검증 가능한 성공 기준 정의 후 충족될 때까지 반복 |

## 설치 방법

**Claude Code 플러그인으로 설치:**
```bash
# 마켓플레이스에서 설치
```

**프로젝트 CLAUDE.md로 적용:**
저장소의 `CLAUDE.md` 파일을 프로젝트 루트에 복사하면 즉시 적용됩니다.

## 핵심 포인트

> LLM은 막연한 지시보다 **검증 가능한 목표**가 주어질 때 훨씬 정확하게 반복 작업을 수행합니다.

단순해 보이지만 이 4가지 원칙을 적용하면 불필요한 코드 변경, 과도한 추상화, 반복적인 수정 요청을 크게 줄일 수 있습니다.
