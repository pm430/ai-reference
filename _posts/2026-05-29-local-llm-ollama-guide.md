---
layout: post
title: "Ollama를 활용한 로컬 LLM 설치 및 실전 가이드 (DeepSeek-R1, Llama 3)"
categories: local-llm
tags: [Ollama, 로컬 LLM, DeepSeek-R1, Llama 3, 오픈소스 LLM]
date: 2026-05-29 15:05:00 +0900
excerpt: "인터넷 연결 없이 개인 PC나 서버에서 보안 걱정 없이 대형 언어 모델을 구동하는 Ollama 사용법을 기초부터 실전 팁까지 정리합니다."
---

인터넷 연결 없이 개인 PC나 서버 환경에서 강력한 오픈소스 언어 모델을 무료로 구동하고 싶다면, **Ollama**가 가장 편리하고 효율적인 도구입니다. 이번 포스트는 개발 워크플로우 통합에 초점을 맞춘 **실전편**으로, OS별 설치 방법부터 인기 모델(Llama 3, DeepSeek-R1) 구동법, 그리고 API 외부 접근·IDE 연동 같은 환경 설정 팁을 정리합니다. "왜 로컬 LLM을 써야 하는가"부터 알고 싶다면 [입문편]({% post_url 2026-05-11-ollama-local-llm %})을 먼저 읽어보세요.

---

## 1. Ollama 설치하기

Ollama는 macOS, Linux, Windows 환경을 모두 네이티브로 지원합니다.

| OS | 설치 방법 |
|---|---|
| **macOS** | `brew install ollama` 또는 공식 홈페이지 다운로드 |
| **Linux** | `curl -fsSL https://ollama.com/install.sh | sh` |
| **Windows** | [ollama.com](https://ollama.com)에서 설치 파일 다운로드 후 실행 |

설치가 완료되면 백그라운드에서 Ollama 서비스가 실행됩니다. CLI(터미널)에서 아래 명령어를 실행하여 올바르게 작동하는지 확인합니다.

```bash
ollama --version
```

---

## 2. 주요 로컬 모델 구동 방법

Ollama 라이브러리에는 다양한 오픈소스 모델들이 등록되어 있습니다. 대표적인 인기 모델들을 실행해 보겠습니다.

### Llama 3 (Meta)
메타에서 공개한 고성능 다목적 오픈소스 모델입니다.
```bash
ollama run llama3
```

### DeepSeek-R1 (DeepSeek)
추론(Reasoning) 성능과 효율성으로 주목받고 있는 오픈소스 모델입니다.
```bash
ollama run deepseek-r1
```

> 처음 실행할 경우 모델 가중치 파일(수 GB ~ 수십 GB)을 다운로드하므로 네트워크 환경에 따라 수 분 정도 시간이 소요될 수 있습니다.

---

## 3. Ollama 실전 활용 팁

Ollama를 단순 챗봇뿐만 아니라 개발 워크플로우에 통합하기 위한 핵심 설정들입니다.

### 팁 1: 외부 호스트에서 Ollama API 접근 허용하기
기본적으로 Ollama는 로컬호스트(`127.0.0.1:11434`)에서만 접근할 수 있습니다. 로컬 네트워크의 다른 컴퓨터나 개발 서버에서 Ollama에 요청을 보내려면 환경 변수를 설정해야 합니다.

- **macOS/Linux:**
  ```bash
  export OLLAMA_HOST="0.0.0.0"
  ```
- **Windows (PowerShell):**
  ```powershell
  $env:OLLAMA_HOST="0.0.0.0"
  ```

### 팁 2: 로컬 IDE(VS Code, Cursor)와 연동하기
Ollama는 OpenAI API 규격과 호환되는 엔드포인트를 제공하므로, 다양한 AI 코딩 익스텐션의 백엔드로 활용할 수 있습니다.

1. **Continue 익스텐션 설치 (VS Code/Cursor)**
2. `config.json`에 로컬 Ollama 연동 설정 추가:
   ```json
   {
     "models": [
       {
         "title": "Ollama Llama 3",
         "provider": "ollama",
         "model": "llama3"
       }
     ]
   }
   ```

---

## 요약: 나에게 맞는 로컬 모델 스펙 선택

보유한 그래픽 카드(VRAM)의 용량에 따라 실행할 모델의 매개변수(Parameter) 크기를 결정해야 원활한 추론 속도가 나옵니다.

- **8GB 이하 VRAM (일반 M1/M2/M3 Mac, RTX 3060/4060):** Llama 3 (8B) 또는 DeepSeek-R1 (8B) 이하 권장.
- **16GB ~ 24GB VRAM (Mac 24GB+ 통합 메모리, RTX 3090/4090):** 14B ~ 32B 크기의 모델 실행 가능.
- **48GB 이상 VRAM (듀얼 GPU, Mac Studio 64GB+):** 70B 이상의 초대형 모델 구동 가능.

---

**관련 글**

- [Ollama: 왜 로컬 LLM을 써야 하고, 어떻게 시작할까?]({% post_url 2026-05-11-ollama-local-llm %}) — 입문편: 로컬 LLM의 장점과 첫 실행
- [LM Studio — Ollama의 GUI 대안, 로컬 LLM을 더 쉽게]({% post_url 2026-06-07-lm-studio-guide %}) — 터미널 없이 GUI로 로컬 LLM 운용
- [AI 코딩 에이전트 CLI 설치 가이드 (Claude Code, Gemini, Codex, Ollama)]({% post_url 2026-05-07-ai-cli-tools-installation %}) — AI CLI 도구 설치 모음
