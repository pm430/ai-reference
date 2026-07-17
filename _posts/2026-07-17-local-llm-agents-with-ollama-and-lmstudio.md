---
layout: post
title: "로컬 LLM 에이전트 실전 — Ollama·LM Studio로 Claude Code와 MCP 연결하기"
categories: local-llm
tags: [Local LLM, Ollama, LM Studio, Claude Code, MCP, Tool Calling]
date: 2026-07-17 00:00:00 +0900
excerpt: "이제 로컬 LLM도 단순 채팅을 넘어 에이전트처럼 쓸 수 있습니다. Ollama와 LM Studio의 최신 공식 문서를 바탕으로 Claude Code 호환, MCP 연결, 툴 호출까지 포함한 로컬 에이전트 구성을 정리합니다."
---

이 블로그의 로컬 LLM 글들은 지금까지 "어떻게 설치하고 돌릴까"에 강했습니다. 하지만 2026년 7월 17일 기준으로는 한 단계 더 가야 합니다. 이제 로컬 모델도 **에이전트형 도구와 연결해서 일하게 만드는 방법**이 중요해졌기 때문입니다.

> 지금 로컬 LLM의 핵심 질문은 "모델이 돌아가나?"가 아니라 "도구와 MCP를 붙여 실제 작업을 끝낼 수 있나?"입니다.

---

## 1. 왜 이 주제가 이제 중요해졌나

최근 공식 자료를 보면 두 가지 변화가 분명합니다.

1. Ollama는 Anthropic Messages API 호환을 제공해 Claude Code 같은 도구를 로컬 모델에 붙일 수 있게 했습니다.
2. LM Studio는 MCP host 역할과 Claude Code 연동 문서를 공식적으로 제공하고 있습니다.

즉 로컬 LLM은 더 이상 "오프라인 챗봇"에 머물지 않습니다. 잘 구성하면 아래 같은 흐름이 가능합니다.

```text
Claude Code / 로컬 에이전트
-> 로컬 모델 호출
-> MCP 서버 사용
-> 파일 읽기/수정/요약/검색
-> 산출물 생성
```

---

## 2. Ollama가 채팅 도구에서 에이전트 기반으로 넘어간 지점

Ollama는 이미 tool calling을 지원하고 있고, 2026년 1월에는 Anthropic Messages API 호환을 추가했습니다. 이건 의미가 큽니다.

- Claude Code 같은 도구가 로컬 모델을 백엔드로 사용할 수 있음
- 오픈웨이트 모델로 에이전트형 코딩 워크플로우를 시험해 볼 수 있음
- 로컬 우선 전략과 기존 에이전트 도구를 연결할 수 있음

즉 Ollama는 단순 실행기에서 **에이전트 호환 런타임**으로 한 단계 올라간 셈입니다.

---

## 3. LM Studio가 지금 강한 이유

LM Studio는 원래 GUI 중심 로컬 LLM 도구로 많이 알려졌습니다. 그런데 지금은 거기서 멈추지 않습니다.

- MCP host 지원
- Claude Code 연동 가이드
- 로컬 서버 운영
- 인증 토큰 설정
- 원격 장비 모델을 연결하는 LM Link

특히 공식 문서가 Claude Code 연동을 꽤 직접적으로 안내합니다.

```bash
lms server start --port 1234
export ANTHROPIC_BASE_URL=http://localhost:1234
export ANTHROPIC_AUTH_TOKEN=lmstudio
export CLAUDE_CODE_ATTRIBUTION_HEADER=0
claude --model openai/gpt-oss-20b
```

이건 "로컬 모델을 Claude Code 표면에서 쓴다"는 뜻입니다.

---

## 4. 로컬 에이전트 구성에서 꼭 알아야 할 세 층

실전 구성은 대체로 세 층으로 나뉩니다.

| 층 | 역할 |
| --- | --- |
| 모델 런타임 | Ollama, LM Studio |
| 에이전트 표면 | Claude Code, Codex 유사 CLI, 자체 앱 |
| 도구 계층 | MCP 서버, 함수 호출, 검색/파일/이슈 도구 |

이걸 섞어 생각하면 복잡하지만, 층으로 나누면 훨씬 단순합니다.

예를 들어:

- **Ollama**: 로컬 모델 실행 + tool calling + Anthropic 호환
- **LM Studio**: 로컬 모델 실행 + MCP host + Claude Code 연동
- **Claude Code**: 작업 분해, 파일 작업, 멀티스텝 실행

---

## 5. 언제 Ollama가 유리하고, 언제 LM Studio가 유리한가

### Ollama가 유리한 경우

- CLI 중심
- 서버/스크립트 자동화
- 경량하게 빠르게 붙이고 싶을 때
- 코드 기반 통합을 선호할 때

### LM Studio가 유리한 경우

- GUI와 로컬 서버를 함께 쓰고 싶을 때
- MCP를 앱 차원에서 관리하고 싶을 때
- Claude Code 같은 도구와 연결 실험을 쉽게 하고 싶을 때
- 원격 고성능 머신을 붙이고 싶을 때

요약하면:

> 자동화와 런타임 감각은 Ollama, 통합과 실험 편의성은 LM Studio가 강합니다.

---

## 6. 로컬 에이전트에서 자주 놓치는 현실적인 조건

### 6.1 컨텍스트 길이

LM Studio 문서도 Claude Code류 도구는 컨텍스트를 많이 먹는다고 안내합니다. 대략 25K 이상 컨텍스트를 권장하는 이유가 여기에 있습니다.

### 6.2 툴 사용 품질

로컬 모델이 tool calling을 지원한다고 해서, 클라우드 플래그십 수준의 도구 선택 품질이 바로 나오진 않습니다. 따라서:

- 도구 수를 줄이고
- 설명을 명확히 쓰고
- 작업 범위를 좁혀야 합니다

### 6.3 속도와 메모리

로컬은 프라이버시와 통제성이 좋지만, 장기 작업에서는 속도와 RAM/VRAM 제약이 바로 체감됩니다.

### 6.4 보안 감각

로컬이라고 무조건 안전한 건 아닙니다. 특히 MCP 서버를 붙이면 로컬 파일, 토큰, 문서, 사내 리소스 접근이 한 번에 열릴 수 있습니다.

---

## 7. 가장 현실적인 시작 시나리오

처음부터 모든 걸 로컬로 돌릴 필요는 없습니다. 아래 순서가 현실적입니다.

### 시나리오 A: 로컬 코딩 에이전트 실험

1. Ollama 또는 LM Studio로 모델 서버 시작
2. Claude Code를 해당 서버에 연결
3. 작은 리포지토리에서 파일 읽기/수정/테스트 작업 실험

### 시나리오 B: 로컬 문서/검색 워크플로우

1. LM Studio에서 MCP 서버 연결
2. 파일/검색/노트 도구만 최소 세트로 연결
3. 요약, 정리, 초안 작성 자동화 실험

### 시나리오 C: 하이브리드 운영

1. 민감 데이터는 로컬
2. 고난도 추론만 클라우드
3. 같은 워크플로우에서 백엔드만 교체

이 세 번째가 실제로 가장 현실적입니다.

---

## 8. 이 블로그에서 지금까지 빠져 있던 공백

기존 글은 잘 정리돼 있습니다.

- Ollama 시작법
- Ollama 실전 가이드
- LM Studio 소개

하지만 지금 시점의 핵심 공백은 **"로컬 모델을 실제 에이전트처럼 운영하는 구조"** 였습니다. 바로 그 지점이 현시점의 중요한 누락입니다.

---

## 9. 마치며

2026년 7월 17일 기준으로 로컬 LLM의 다음 단계는 분명합니다.

- 단순 채팅을 넘어서고
- 도구를 붙이고
- Claude Code 같은 에이전트 표면과 연결하고
- 필요하면 MCP까지 확장하는 것

이제 로컬 LLM 전략은 "클라우드를 안 쓴다"가 아니라, **어디까지 로컬에 두고 어디서 클라우드를 섞을지 설계한다**에 가깝습니다.

---

## 출처

- [Ollama, Claude Code with Anthropic API compatibility](https://ollama.com/blog/claude)
- [Ollama, Tool support](https://ollama.com/blog/tool-support)
- [Ollama, Streaming responses with tool calling](https://ollama.com/blog/streaming-tool)
- [LM Studio Docs, Use MCP Servers](https://lmstudio.ai/docs/app/mcp)
- [LM Studio Docs, Claude Code](https://lmstudio.ai/docs/integrations/claude-code)

---

**관련 포스트:**

- [LM Studio — Ollama의 GUI 대안, 로컬 LLM을 더 쉽게]({% post_url 2026-06-07-lm-studio-guide %}) — 로컬 LLM 도구 선택의 출발점
- [Ollama를 활용한 로컬 LLM 설치 및 실전 가이드 (DeepSeek-R1, Llama 3)]({% post_url 2026-05-29-local-llm-ollama-guide %}) — Ollama 기본기와 운영 감각
- [MCP 서버 직접 만들기 — Python으로 나만의 도구 등록하기]({% post_url 2026-06-09-build-mcp-server-python %}) — 로컬 에이전트에 붙일 도구를 직접 만드는 법
- [MCP 보안과 인증 — OAuth 2.1 시대에 서버를 안전하게 연결하는 법]({% post_url 2026-07-17-mcp-security-authorization %}) — 로컬이라고 보안을 생략하면 안 되는 이유
