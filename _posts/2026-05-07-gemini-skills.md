---
layout: post
title: "Google Gemini Skills 저장소"
categories: skills-mcp
tags: [Gemini, Skills, Google]
excerpt: "Gemini API 활용 에이전트의 정확도를 높여주는 Google 공식 스킬 라이브러리입니다."
---

- **GitHub:** [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills)
- **MCP 서버:** `https://gemini-api-docs-mcp.dev`

## 개요

LLM은 특정 시점의 지식만 보유하고 있어 최신 API 코드를 정확히 생성하기 어렵습니다. 이 스킬 라이브러리는 Gemini API 관련 컨텍스트를 에이전트에 직접 주입해 코드 정확도를 높입니다.

## 성능 개선 결과

| 모델 | 스킬 적용 후 정확도 |
|---|---|
| Gemini 3 Flash | 87% |
| Gemini 3.1 Pro | 96% |

## 제공 스킬

| 스킬 | 설명 |
|---|---|
| `gemini-api-dev` | Gemini 기반 앱 개발 모범 사례 |
| `gemini-live-api-dev` | WebSocket 기반 실시간 오디오/비디오/텍스트 스트리밍 |
| `gemini-interactions-api` | 텍스트 생성, 멀티턴 채팅, 함수 호출, 구조화 출력 |

## 설치 방법

```bash
# Vercel skills CLI
npx skills add

# Context7 skills CLI
npx ctx7 skills install
```
