---
layout: post
title: "Anthropic Claude 실전 가이드 — Opus, Sonnet, Haiku 선택법"
categories: cloud-llm
tags: [Claude, Anthropic, Opus, Sonnet, Haiku, Extended Thinking, Tool Use]
date: 2026-06-06 10:00:00 +0900
excerpt: "Claude Opus, Sonnet, Haiku의 차이와 적정 사용처를 정리합니다. Extended Thinking과 Tool Use 같은 핵심 기능, 가격과 속도의 트레이드오프까지 한 번에 정리합니다."
---

## 1. 왜 Claude인가

2026년 현재 클라우드 LLM 시장은 **Anthropic, OpenAI, Google** 의 3강 구도입니다. 그중 Claude는 특히 다음 세 가지 영역에서 강점을 보입니다.

- **코딩과 복잡한 추론**: SWE-bench, Terminal-bench 같은 코딩 벤치마크에서 꾸준히 상위권
- **긴 컨텍스트 처리**: 200K 토큰 기본, 1M 토큰 베타 제공. 코드베이스나 문서 한 권을 통째로 넘기기에 적합
- **정제된 톤과 안전성**: 시스템 프롬프트를 잘 따르고, 과도한 거부를 적게 함

이 글에서는 **어떤 Claude를 언제 써야 하는지**, 그리고 핵심 기능 두 가지를 정리합니다.

---

## 2. 3-Tier 모델 라인업

Anthropic Claude는 모델을 **용도별 3단계**로 나눕니다. 이름을 외울 필요는 없고, *목적에 맞는 선택*만 기억하면 됩니다.

| 모델 라인업 | 위치 | 강점 | 적정 사용처 |
| --- | --- | --- | --- |
| **Opus 4.x** | 최상위 | 깊은 추론, 복잡한 다단계 문제 | 아키텍처 결정, 리팩토링 설계, 보안 검토 |
| **Sonnet 4.x** | 메인스트림 | 코딩·글쓰기 균형, 속도 적절 | 일상 코딩, 문서 작성, 데이터 분석 |
| **Haiku 4.x** | 경량 | 빠른 응답, 저비용 | 분류·요약·라우팅, 대량 처리 |

**자주 쓰는 한 줄 규칙**:

- "생각이 필요한 작업" → Opus
- "생각은 가볍지만 결과물의 품질이 중요" → Sonnet
- "판별·분류·요약처럼 단순한 처리" → Haiku

### 가격·속도 트레이드오프 (개념적 수치)

| 모델 | 입력 단가 (상대) | 출력 단가 (상대) | 응답 속도 (상대) |
| --- | --- | --- | --- |
| Opus | 5× | 5× | 1× |
| Sonnet | 1× | 1× | 3× |
| Haiku | 0.2× | 0.2× | 10× |

정확한 가격은 Anthropic Pricing 페이지에서 확인해야 하지만, **대략 이 비율**로 이해하면 의사결정이 빨라집니다. Opus가 무조건 좋지만, 매 호출에 5배 비싸므로 *어디에 쓸지*가 중요합니다.

---

## 3. 핵심 기능 1 — Extended Thinking

Extended Thinking은 모델이 **내부 추론 단계를 더 길게** 펼친 뒤 답하도록 하는 모드입니다. 2025년 정식 출시 이후, 복잡한 작업에서 일반 모드 대비 큰 품질 향상을 보였습니다.

### 사용 예시

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # 추론에 쓸 토큰 예산
    },
    messages=[
        {"role": "user", "content": "이 분산 시스템에서 정합성 깨질 수 있는 시나리오 5가지를 분석해줘."}
    ]
)
```

### 언제 켜고 언제 끄는가

| 상황 | Extended Thinking |
| --- | --- |
| 아키텍처 결정, 트레이드오프 분석 | ✅ 켜기 |
| 리팩토링 전략 설계 | ✅ 켜기 |
| 단순 코드 생성, 분류 | ❌ 끄기 (비용 낭비) |
| 대량 데이터 라우팅 | ❌ 끄기 |

**비용 주의**: `budget_tokens` 만큼의 추론 토큰이 *추가*로 청구됩니다. 1만 토큰을 쓰면, 그만큼 더 비싸진다는 뜻입니다. 작업의 복잡도에 맞춰 1,000~10,000 사이로 조절합니다.

---

## 4. 핵심 기능 2 — Tool Use (Function Calling)

Claude는 외부 도구(함수)를 호출할 수 있습니다. 이건 *클로드 코드 같은 에이전트*가 작동하는 핵심 메커니즘이기도 합니다.

### 기본 흐름

```python
import anthropic
import json

client = anthropic.Anthropic()

tools = [
    {
        "name": "search_documentation",
        "description": "내부 기술 문서에서 키워드로 검색한다. (vector search)",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "검색 키워드"},
                "top_k": {"type": "integer", "default": 5}
            },
            "required": ["query"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "결제 시스템의 멱등성 처리 방식이 어떻게 돼?"}
    ]
)

# 모델이 도구 호출을 결정하면 stop_reason == "tool_use"
if response.stop_reason == "tool_use":
    tool_call = response.content[1]
    print(tool_call.name, tool_call.input)
    # → search_documentation {"query": "결제 멱등성", "top_k": 5}
```

### 도구 설계의 3가지 원칙

1. **Description은 한 문장이지만 정확하게** — "DB 쿼리 실행" 보다는 "주문 ID로 단일 주문 조회. 실패 시 null 반환" 이 효과적입니다.
2. **Input schema는 엄격하게** — `enum`, `required` 를 활용해 호출 측 검증 로직을 줄입니다.
3. **부작용(side effect)을 명시** — "이 도구는 DB를 변경한다" 같은 정보를 description에 포함시키면 모델이 신중해집니다.

---

## 5. 워크플로우 — Sonnet과 Opus의 하이브리드 사용

실무에서는 **하나의 모델만 쓰지 않습니다**. 다음은 일반적인 패턴입니다.

```text
1단계 (Sonnet) — 사용자의 입력을 분석하고 의도 분류
2단계 (Opus + Extended Thinking) — 의도가 "복잡한 설계"인 경우 Opus로 전환
3단계 (Haiku) — 결과를 요약·분류해 라우팅/저장
```

이렇게 **라우터는 가볍게, 심사는 무겁게, 후처리는 빠르게** 분리하면, 비용을 50% 이상 줄이면서 품질은 유지할 수 있습니다. 이 패턴을 구현하려면 OpenRouter 같은 통합 API를 활용하는 것이 가장 간단합니다.

---

## 6. Claude Code — Claude의 가장 강력한 인터페이스

클라우드 LLM과 별개로, **Claude Code** 라는 터미널 에이전트는 현재 가장 생산적인 코딩 도구 중 하나입니다.

```bash
# 설치 (macOS/Linux)
curl -fsSL https://claude.ai/install.sh | bash

# 시작
claude

# 일반적인 사용 패턴
> "이 저장소의 README를 한국어로 번역해줘"
> "이 함수의 테스트 커버리지를 80%까지 올려줘"
> "PR #142 의 변경사항을 리뷰해줘"
```

Claude Code는 단순한 채팅 도구가 아니라, **Read/Write/Bash/Grep 같은 도구를 가진 에이전트**입니다. 이 사이트의 `skills-mcp` 카테고리에서 다루는 MCP 패턴이 가장 잘 녹아 있는 인터페이스이기도 합니다.

---

## 7. 한 단계 더 — 캐싱과 배치로 비용 더 줄이기

Anthropic은 **Prompt Caching** 과 **Message Batches API** 를 제공합니다.

- **Prompt Caching**: 동일한 시스템 프롬프트(예: 100K 코드베이스)를 반복해서 보낼 때, 두 번째부터 90% 저렴.
- **Message Batches API**: 24시간 내 결과를 보장하는 대신, 일반 호출 대비 50% 저렴.

**체감 사례**: 매일 1,000회 호출하는 시스템에서 캐싱을 켜면, 시스템 프롬프트가 큰 경우 **월 비용이 1/3** 로 줄어듭니다. 단순한 옵션이지만 효과는 매우 큽니다.

---

## 8. 마치며

Claude는 "Opus는 무조건 좋고 Haiku는 무조건 가볍다" 라는 단순 공식이 아니라, **작업의 성격에 따라 다른 모델을 쓰는 도구**입니다. 다음 한 줄만 기억하세요.

> **생각이 깊을수록 Opus, 결과가 균형 잡힌 일상 작업은 Sonnet, 대량 처리는 Haiku.**

이 원칙과 Extended Thinking, Tool Use를 조합하면, 어떤 클라우드 LLM 워크플로우든 효율적으로 설계할 수 있습니다.

---

**관련 포스트:**

- [OpenRouter: 왜 써야 하고, 어떻게 모든 LLM을 통합할까?]({% post_url 2026-05-11-openrouter-unified-api %})
- [Groq: 번개처럼 빠른 속도의 초고속 AI 추론 서비스]({% post_url 2026-05-11-groq-ultra-fast-inference %})
- [Anthropic 공식 Skills 저장소]({% post_url 2026-05-07-anthropic-skills %})
- [AI 코딩 에이전트 CLI 설치 가이드 (Claude Code, Gemini, Codex, Ollama)]({% post_url 2026-05-07-ai-cli-tools-installation %})
- [프롬프트 엔지니어링 5가지 핵심 패턴 — Zero-shot부터 ReAct까지]({% post_url 2026-06-03-prompt-engineering-5-patterns %})
