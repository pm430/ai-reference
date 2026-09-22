---
layout: post
title: "Jev와 Prompt Caching — 에이전트 루프 비용을 90% 이상 절감하는 아키텍처"
categories: cloud-llm
tags: [Jev, TypeSafe AI, Prompt Caching, 에이전트 비용 최적화, System 1]
date: 2026-09-21 10:00:00 +0900
excerpt: "에이전트 루프에서 발생하는 수백 번의 소형 판단을 70ms 초저지연으로 처리하는 Jev 모델과 대규모 컨텍스트 재사용을 돕는 Prompt Caching을 결합해 운영 비용을 90% 절감하는 아키텍처를 분석합니다."
---

- **Jev 개발사:** [TypeSafe AI](https://typesafe.ai/) (ChatGPT 초기 인스트럭션 연구진 Diogo Almeida 설립)
- **핵심 기술:** System-1 고속 결정 모델(Jev) + KV Cache 재사용(Prompt Caching)

---

## 1. 에이전트 운영의 최대 장벽: '비용 폭탄'과 '지연 시간'

자율 코딩 에이전트가 단 하나의 버그를 고치기 위해 수행하는 내부 루프는 보통 20~50턴에 달합니다:

```text
[파일 목록 확인] ➡️ [grep 검색] ➡️ [파일 열기] ➡️ [테스트 실행] ➡️ [에러 파싱] ➡️ [코드 수정] ...
```

이 루프의 매 턴마다 수만 토큰의 코드베이스를 플래그십 LLM(Claude 3.7 Sonnet, GPT-4o)에 통째로 전송하면 두 가지 치명적인 문제가 발생합니다:
1. **막대한 API 비용**: 단순 판단(예: "이 파일이 관련된 파일인가?") 하나를 위해 수백만 토큰의 비용을 지불함.
2. **누적 지연 시간**: 매 턴마다 3~5초씩 걸려, 30턴 루프가 끝나려면 사용자가 2분 넘게 멍하니 터미널만 바라봐야 함.

이 병목을 해결하기 위한 최신 엔지니어링 해법이 **Jev(경량 결정 모델)**와 **Prompt Caching(프롬프트 캐싱)**의 결합입니다.

---

## 2. Jev: 텍스트를 쓰지 않는 'System 1' 결정 전용 모델

대니얼 카너먼의 생각에 관한 생각(Thinking, Fast and Slow)에서 유래한 **System 1(빠른 직관)**과 **System 2(깊은 사고)**의 분업입니다:

```text
┌─────────────────────────────────────────────────────────────┐
│                 에이전트 오케스트레이션 루프                 │
│                                                             │
│   [단순 판단 & 필터링]                    [심층 코드 작성]  │
│   - 도구 라우팅                         - 비즈니스 로직 설계│
│   - 가드레일 통과 여부                   - 알고리즘 리팩토링 │
│   - 오래된 로그 압축 여부                                   │
│           │                                     │           │
│           ▼                                     ▼           │
│     ⚡ Jev (TypeSafe AI)                 🧠 Claude Sonnet 3.7 │
│     70~500ms / $0.042 (1M당)              3~5s / $3.00 (1M당) │
└─────────────────────────────────────────────────────────────┘
```

### Jev의 3대 출력 타입
Jev는 긴 자연어 텍스트나 소스 코드를 생성하지 않습니다. 오직 수학적으로 보정된(Calibrated) 신뢰도 점수와 함께 다음 3가지 타입만 반환합니다:
- **`Choice`**: 여러 도구 중 다음으로 호출할 최적의 도구 하나를 선택
- **`Score`**: 특정 파일이나 로그가 현재 작업과 얼마나 관련 있는지 0~100점 척도로 평가
- **`Noul` (Boolean)**: 이 명령어(`rm -rf` 등)를 차단할 것인가? Yes/No 확률 반환

가격은 **1M 입력 토큰당 $0.042**(출력 토큰 무료)로, 대형 모델 대비 **98% 이상 저렴**합니다.

---

## 3. Prompt Caching: 대규모 코드베이스의 'KV 캐시 재사용'

Anthropic, Google Gemini, OpenAI가 제공하는 **프롬프트 캐싱**은 에이전트의 시스템 프롬프트와 프로젝트 파일들의 Key-Value(KV) 연산 결과를 GPU 메모리에 캐싱해 두는 기술입니다.

### 프롬프트 캐싱 아키텍처 원칙
1. **정적 컨텍스트를 맨 앞에 배치**:
   자주 바뀌지 않는 사내 코딩 컨벤션, DB 스키마, `CLAUDE.md`, 핵심 라이브러리 인터페이스를 프롬프트의 가장 앞부분(Prefix)에 고정합니다.
2. **동적 메시지는 맨 뒤에 배치**:
   매 턴마다 바뀌는 사용자의 질문, 터미널 실행 결과 로그는 프롬프트의 가장 마지막에 둡니다.
3. **캐시 히트(Cache Hit) 시 혜택**:
   - 입력 토큰 비용 **최대 90% 할인** (Anthropic 기준 $3.00 ➡️ $0.30/1M)
   - 최초 토큰 생성 지연 시간(TTFT) **최대 80% 단축**

---

## 4. 실전 듀얼 최적화 파이프라인

```python
# 에이전트 루프 비용 최적화 의사코드
def optimized_agent_loop(user_task: str, codebase_context: str):
    # 1. 고정된 코드베이스 컨텍스트는 캐싱 활성화 (Prompt Caching)
    cached_prompt = wrap_with_cache_control(codebase_context)
    
    while not task_finished:
        # 2. 다음 도구 선택 및 파일 필터링은 초저가 Jev에게 위임 (System 1)
        next_tool = jev_client.decide_next_tool(state=current_state)
        
        if next_tool == "execute_terminal":
            # 3. 위험 명령어 가드레일도 Jev가 70ms 만에 검증
            if not jev_client.is_safe_command(cmd):
                ask_human_confirmation(cmd)
                
        elif next_tool == "write_complex_code":
            # 4. 복잡한 실제 코드 작성 시에만 대형 LLM 호출 (캐시 히트 적용)
            code_diff = claude_client.generate(cached_prompt, task_info)
            apply_diff(code_diff)
```

이 듀얼 아키텍처를 도입하면 한 번의 에이전트 세션 비용이 **평균 2,000원에서 150원 수준으로 급락**하며, 전체 실행 속도는 3배 이상 빨라집니다.

---

**관련 글**
- [Groq: 번개처럼 빠른 속도의 초고속 AI 추론 서비스]({% post_url 2026-05-11-groq-ultra-fast-inference %}) — 하드웨어 단에서의 저지연 추론 아키텍처
- [Context Engineering — AI에게 무엇을 주고, 무엇을 뺄 것인가]({% post_url 2026-06-08-context-engineering %}) — 효율적인 컨텍스트 설계의 기초
- [GLM-5.3과 ZCode — 1M 컨텍스트와 극단적 가성비의 오픈 코딩 에이전트]({% post_url 2026-09-21-glm-5-zcode-agent-guide %}) — 대형 컨텍스트의 또 다른 저비용 대안
