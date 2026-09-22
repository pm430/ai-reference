---
layout: post
title: "Google Gemini Skills 저장소"
categories: skills-mcp
tags: [Gemini, Skills, Google]
date: 2026-05-07 13:11:10 +0900
excerpt: "Gemini API 활용 에이전트의 정확도를 높여주는 Google 공식 스킬 라이브러리입니다."
---

- **GitHub:** [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills)
- **MCP 서버:** `https://gemini-api-docs-mcp.dev`

## 개요

LLM은 학습 컷오프(Knowledge Cutoff)로 인해 급격하게 변화하는 클라우드 SDK와 API 명세를 정확히 알지 못해 구버전 문법이나 환각(Hallucination) 코드를 생성하는 경우가 많습니다. 특히 Google GenAI SDK는 최근 획기적인 개편(Python `google-genai` 통합 SDK 출시 등)을 거쳤습니다.

Google 공식 Gemini Skills 저장소([google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills))는 AI 코딩 에이전트에게 **최신 공식 SDK 스키마, 함수 호출(Tool Calling) 패턴, 실시간 스트리밍 명세**를 정밀하게 주입하여 에이전트의 개발 정확도를 비약적으로 끌어올립니다.

## 스킬 적용에 따른 정확도 향상 지표

Google의 벤치마크 결과에 따르면, 최신 스킬을 주입했을 때 복잡한 API 호출 생성 성공률이 급증했습니다:

| 모델 | 스킬 미적용 | 스킬 적용 후 정확도 | 주요 개선 영역 |
| :--- | :---: | :---: | :--- |
| **Gemini 3 Flash** | 54% | **87%** (+33%p) | JSON Schema 구조화 출력, 올바른 모델명 매핑 |
| **Gemini 3.1 Pro** | 71% | **96%** (+25%p) | 멀티턴 함수 호출(Tool Calling), 실시간 오디오 스트림 제어 |

---

## 제공되는 3대 핵심 스킬 상세

### 1. `gemini-api-dev` — 최신 Google GenAI SDK 표준

과거의 `google-generativeai` 대신 최신 표준인 `google-genai` 패키지 문법을 따르도록 에이전트를 가이드합니다.

```python
# 에이전트가 생성하는 최신 표준 코드 예시
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="데이터베이스 스키마 최적화 방안을 3줄로 요약해줘.",
    config=types.GenerateContentConfig(
        temperature=0.2,
        response_mime_type="application/json"
    )
)
```

### 2. `gemini-interactions-api` — 구조화 출력 및 도구 연동

- **Pydantic 스키마 기반 구조화 출력**: 복잡한 비즈니스 엔티티를 JSON으로 파싱할 때 환각 없이 엄격한 스키마를 준수하도록 보장합니다.
- **다중 함수 호출(Parallel Tool Use)**: 모델이 한 번의 응답에서 여러 개의 외부 API를 동시에 호출하고 결과를 취합하는 오케스트레이션 코드를 작성합니다.

### 3. `gemini-live-api-dev` — WebSocket 실시간 멀티모달

양방향(Bi-directional) WebSocket 기반의 Gemini Live API를 다루며, 실시간 음성 대화, 저지연(Low-latency) 비디오 분석 스트림 처리를 위한 비동기 파이프라인 설계를 지원합니다.

---

## 설치 및 연동 방법

**1. 대화형 스킬 매니저를 통한 설치:**
```bash
# Vercel skills CLI 활용
npx skills add google-gemini/gemini-skills

# 또는 Context7 도구 활용
npx ctx7 skills install gemini-skills
```

**2. MCP(Model Context Protocol) 서버로 문서 실시간 검색:**
로컬 스킬 외에도 Gemini 공식 API 문서 MCP 서버를 등록하면 에이전트가 실시간으로 최신 문서를 참조합니다:
- MCP Endpoint: `https://gemini-api-docs-mcp.dev`

---


**관련 글**

- [Gemini CLI Skill Creator: 나만의 맞춤형 에이전트 스킬 만들기]({% post_url 2026-05-18-gemini-cli-skill-creator %}) — 나만의 Gemini 스킬 직접 만들기
- [Antigravity Awesome Skills — 1,400+ 에이전트 스킬 모음]({% post_url 2026-05-07-antigravity-awesome-skills %}) — 에이전트 공용 스킬 모음
- [AI 코딩 에이전트 CLI 설치 가이드 (Claude Code, Gemini, Codex, Ollama)]({% post_url 2026-05-07-ai-cli-tools-installation %}) — Gemini CLI 설치 방법
