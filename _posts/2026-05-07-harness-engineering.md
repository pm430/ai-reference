---
layout: post
title: "하네스 엔지니어링 존재 이유부터 실전 예제까지"
categories: onboarding
tags: [Claude, 하네스 엔지니어링, Claude Code]
date: 2026-05-07 12:47:00 +0900
excerpt: "코딩알려주는누나 채널의 영상으로 하네스 엔지니어링의 개념과 실전 예제를 정리합니다."
---

{% include youtube.html id="3yyLg1xbQSs" title="하네스 엔지니어링 존재 이유부터 실전 예제까지 다 가져가라!" %}

**출처:** [코딩알려주는누나](https://www.youtube.com/@coding_unnie)

## 하네스 엔지니어링(Harness Engineering)이란?

말에게 마구(Harness)를 씌워야 기수의 의도대로 안전하게 달릴 수 있듯이, **하네스 엔지니어링**은 확률적으로 동작하는 비결정적(Non-deterministic) LLM을 **결정론적 소프트웨어의 안전 경계(Guardrails) 안에 가두어 통제하는 아키텍처 기법**을 말합니다.

프롬프트 엔지니어링이 "AI에게 말을 예쁘게 거는 법"이라면, 하네스 엔지니어링은 "AI가 헛소리를 하거나 위험한 명령을 실행하려 해도 시스템이 원천 차단하고 스스로 바로잡도록 틀을 짜는 엔지니어링"입니다.

---

## 하네스를 구성하는 4대 필수 레이어

```text
[ 사용자 입력 ]
       │
  ▼ 1. Input Guardrail (의도 분류, 프롬프트 인젝션 차단, 컨텍스트 축소)
┌──────────────────────────────────────────────┐
│  AI 에이전트 (LLM 계획 및 도구 호출)          │
└──────────────────────────────────────────────┘
       │
  ▼ 2. Execution Sandbox (권한 제한: 파일 쓰기 제한, 가상 격리)
┌──────────────────────────────────────────────┐
│  도구 실행 (코드 실행, API 호출, DB 쿼리)      │
└──────────────────────────────────────────────┘
       │
  ▼ 3. Deterministic Evaluator (테스트·린트 실행 후 피드백 반환)
       │
  ▼ 4. Circuit Breaker (3회 실패 시 중단 후 사람 승인 요청)
       │
[ 최종 승인된 결과물 ]
```

### 1. 입력 가드레일 (Input Boundary)
- **컨텍스트 제한**: 불필요한 전체 저장소를 주입하지 않고, 작업과 관련된 파일 목록만 주입
- **프롬프트 인젝션 방지**: 외부 웹 페이지나 사용자 입력 데이터에서 시스템 명령을 탈취하려는 시도 무력화

### 2. 실행 샌드박스 (Execution Sandbox)
- **위험 명령어 차단**: `rm -rf`, `DROP TABLE`, 외부 결제 API 호출 등 비가역적 위험 작업은 에이전트 단독으로 실행하지 못하도록 시스템 레벨에서 승인(Human-in-the-loop) 요구
- **파일 변경 격리**: 변경 사항을 별도의 임시 브랜치나 가상 파일 시스템에 먼저 반영하고 검증

### 3. 결정론적 평가자 (Deterministic Evaluator)
- "코드가 잘 작성되었는가?"를 다시 LLM에게 묻지 않고, **단위 테스트(`pytest`), 타입 체커(`mypy`), 린터(`ruff`, `eslint`)**라는 절대적인 컴파일러/테스트 도구에 맡깁니다.
- 테스트가 실패하면 실패 스택트레이스를 다시 에이전트의 피드백 입력으로 되먹임(Feedback Loop)합니다.

### 4. 서킷 브레이커 (Circuit Breaker)
- 에이전트가 버그를 수정하지 못하고 동일한 오류를 3~5회 반복하면 무한 루프로 인한 토큰 낭비와 코드 오염을 막기 위해 실행을 강제 중단하고 사람에게 제어권을 넘깁니다.

---

## 실전 파이썬 하네스 패턴 예시

```python
def agent_harness_loop(task_description: str, max_trials: int = 3):
    """결정론적 테스트가 통과할 때까지 에이전트를 루프 안에 가두는 하네스"""
    context = prepare_focused_context(task_description)
    trials = 0

    while trials < max_trials:
        # 1. AI 코드 수정 제안
        plan_and_edits = agent.generate_edits(context, task_description)
        
        # 2. 격리된 샌드박스에 반영
        apply_edits_sandbox(plan_and_edits)
        
        # 3. 결정론적 검증 (테스트 스위트 실행)
        test_result = run_deterministic_tests()
        
        if test_result.passed:
            # 4. 검증 통과 시에만 본 코드베이스에 병합
            merge_to_working_branch()
            return "Task completed successfully"
            
        # 실패 시 에러 피드백을 주입하여 재시도
        trials += 1
        context.append_feedback(test_result.error_message)

    # 서킷 브레이커 발동
    alert_human_developer("Harness stopped: Failed after max trials.")
```

> **요약:**  
> 에이전트의 지능을 믿는 것이 아니라, 에이전트를 둘러싼 **테스트 하네스와 자동 검증 루프**를 믿는 것이 프로덕션 레벨 에이전트 구축의 핵심입니다.

---


**관련 글**

- [Loop Engineering — 에이전트 완성도를 끝까지 올리는 반복 설계]({% post_url 2026-06-25-loop-engineering-quality-automation %}) — 하네스 바깥이 아니라, 하네스 위에서 도는 품질 개선 루프
- [클로드 스킬, 서브에이전트, 커맨드 개념 한번에 이해하기]({% post_url 2026-05-07-claude-skill-subagent-command %}) — 같은 채널의 핵심 개념 정리 영상
- [Context Engineering — AI에게 무엇을 주고, 무엇을 뺄 것인가]({% post_url 2026-06-08-context-engineering %}) — 하네스 설계의 핵심인 컨텍스트 관리
- [AI 에이전트 활용을 위한 기초 지식: 필수 온보딩 가이드]({% post_url 2026-05-18-onboarding-guide-for-ai-reference %}) — 에이전트 기초 개념
- [결제 시스템에서 AI 코딩 에이전트 쓰는 법 — 실수가 허용되지 않는 도메인의 원칙]({% post_url 2026-06-10-ai-agent-high-stakes-payment %}) — 하네스 통제 구조 실전 적용
