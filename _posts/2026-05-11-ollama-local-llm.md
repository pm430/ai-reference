---
layout: post
title: "Ollama: 왜 로컬 LLM을 써야 하고, 어떻게 시작할까?"
categories: local-llm
tags: [Ollama, Local LLM, Llama3, Open Source, Privacy]
date: 2026-05-11 16:30:00 +0900
excerpt: "클라우드 API 비용과 프라이버시 걱정 없이, 내 컴퓨터에서 직접 Llama 3를 실행하는 가장 완벽한 방법 Ollama를 소개합니다."
---

## 1. Ollama란 무엇인가?

**Ollama**는 Llama 3, Mistral, Phi-3와 같은 오픈 소스 거대 언어 모델(LLM)을 내 컴퓨터에서 직접 실행할 수 있게 해주는 가장 쉽고 강력한 도구입니다. 복잡한 환경 설정 없이 설치 파일 하나로 로컬 AI 환경을 구축할 수 있습니다.

- **공식 사이트:** [ollama.com](https://ollama.com/)

---

## 2. Why: 왜 클라우드가 아닌 '로컬 LLM'인가?

ChatGPT나 Claude가 있는데 왜 굳이 내 컴퓨터에서 직접 돌려야 할까요?

1. **완벽한 프라이버시**: 데이터가 외부 서버로 전송되지 않습니다. 기업의 내부 기밀이나 개인적인 데이터를 다룰 때 가장 안전한 선택입니다.
2. **비용 제로**: API 호출당 비용이 발생하지 않습니다. 수만 번의 요청을 보내도 전기세 외에는 추가 비용이 없습니다.
3. **오프라인 사용**: 인터넷 연결이 끊긴 환경에서도 AI의 도움을 받을 수 있습니다.
4. **커스터마이징**: 특정 목적에 맞게 튜닝된 다양한 오픈 소스 모델을 자유롭게 갈아 끼우며 테스트할 수 있습니다.

---

## 3. How: 5분 만에 나만의 AI 구축하기

### 1단계: 설치
[ollama.com](https://ollama.com/download)에서 자신의 OS(macOS, Windows, Linux)에 맞는 설치 프로그램을 내려받아 실행합니다.

### 2단계: 모델 실행 (CLI)
터미널을 열고 다음 명령어를 입력하면 모델 다운로드와 실행이 동시에 진행됩니다.

```bash
# 가장 인기 있는 Llama 3 실행
ollama run llama3

# 가벼운 모델을 원한다면 Phi-3 추천
ollama run phi3
```

### 3단계: 유용한 명령어 모음
| 명령어 | 설명 |
|---|---|
| `ollama list` | 내 컴퓨터에 설치된 모델 목록 확인 |
| `ollama pull [모델명]` | 모델 미리 다운로드하기 |
| `ollama rm [모델명]` | 필요 없는 모델 삭제 (용량 확보) |
| `ollama serve` | 백그라운드에서 API 서버 실행 |

---

## 4. 추천 모델 및 하드웨어 가이드

내 컴퓨터 사양에 맞는 모델을 선택해 보세요.

- **RAM 8GB**: `phi3` (3.8B), `gemma:2b` 등 소형 모델 추천
- **RAM 16GB**: `llama3` (8B), `mistral` (7B) 등 표준 모델 원활
- **RAM 32GB 이상**: `llama3:70b` 등 대형 모델 시도 가능 (속도는 느릴 수 있음)

---

## 5. 한 단계 더 나아가기: GUI 연동

터미널 채팅이 불편하다면 다음과 같은 도구들과 연동해 보세요.
- **Open WebUI**: ChatGPT와 유사한 웹 인터페이스 제공
- **Raycast / Alfred**: 맥용 런처에서 바로 Ollama 호출
- **VS Code (Continue)**: 코딩 어시스턴트로 Ollama 활용

---

**관련 포스트:**
- [Andrej Karpathy의 LLM101n: 직접 LLM 만들기]({% post_url 2026-05-11-andrej-karpathy-llm101n %}) - 모델의 내부 원리가 궁금하다면?
- [OpenRouter: 모든 LLM을 하나의 API로]({% post_url 2026-05-11-openrouter-unified-api %}) - 로컬 사양이 부족할 때 가장 합리적인 대안
