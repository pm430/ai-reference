---
layout: post
title: "Spec-Driven Development — 코드를 짜기 전 AI와 스펙부터 확정하는 개발 표준"
categories: onboarding
tags: [Spec-Driven, SDD, TDD, 코딩 에이전트, 소프트웨어 엔지니어링, 설계]
date: 2026-09-21 10:20:00 +0900
excerpt: "모호한 자연어 프롬프트로 인한 코드 재생성 낭비를 없애기 위해, 코드를 작성하기 전 AI와 엄격한 명세(Spec)를 먼저 문서로 합의하는 2026년 개발 표준 '스펙 주도 개발'을 정리합니다."
---

- **핵심 개념:** Spec-Driven Development (스펙 주도 개발, SDD)
- **대상:** 대규모 기능을 AI 에이전트에 위임하고자 하는 실무 개발팀

---

## 1. 자연어 프롬프트의 한계: "코드를 짜고 나서야 깨닫는 오해"

많은 개발자가 에이전트에게 기능을 요청할 때 다음과 같이 지시합니다:

> *"사용자가 비밀번호를 재설정할 수 있는 API를 만들어줘. 이메일로 링크를 보내고, 토큰은 1시간만 유효해야 해."*

이 요청을 받은 에이전트는 즉시 5개의 파일에 걸쳐 수백 줄의 코드를 작성합니다. 하지만 코드를 열어본 개발자는 곧 실망합니다:
- *"어? 왜 토큰을 Redis에 안 넣고 DB 테이블에 칼럼으로 추가했지?"*
- *"에러 응답 형식이 우리 사내 표준(`{ code: 400, message: ... }`)이랑 다른데?"*
- *"단위 테스트 케이스는 왜 성공 시나리오 딱 1개밖에 없지?"*

결국 수백 줄의 코드를 지우고 다시 프롬프트를 칩니다. 이 비효율을 해결하기 위해 2026년 업계 표준으로 떠오른 기법이 바로 **스펙 주도 개발(Spec-Driven Development)**입니다.

---

## 2. 스펙 주도 개발(SDD)의 3단계 파이프라인

```text
[Step 1: 스펙 문서 합의] ──▶ [Step 2: 실패하는 테스트 작성] ──▶ [Step 3: 본 코드 구현]
 (명세서 작성 ➡️ 사용자 승인)   (스펙 기반 계약 테스트 선행)     (에이전트 자율 패스 루프)
```

### Step 1. 코드 작성 금지! 스펙(SPEC.md) 먼저 승인받기
에이전트에게 곧바로 코드를 생성하지 못하도록 강제하고, 다음 4가지 항목이 포함된 마크다운 명세를 먼저 제출하도록 지시합니다:

1. **엔드포인트 및 데이터 스키마**: 입력(Request)과 출력(Response)의 정확한 JSON 필드와 타입.
2. **에러 코드 매핑표**: 발생 가능한 4xx, 5xx 에러 케이스와 반환 형식.
3. **상태 저장소(Storage) 전략**: RDB, Redis, 인메모리 중 어디에 어떤 키 구조로 저장할 것인가.
4. **수용 기준 (Acceptance Criteria)**: "이 5가지 조건을 만족하면 이 작업은 성공으로 간주한다."

```markdown
<!-- 에이전트가 먼저 제출한 SPEC.md 예시 -->
## Feature Spec: Password Reset Token API

### 1. Endpoint: POST /api/v1/auth/password-reset/request
- **Request:** `{ "email": "user@example.com" }`
- **Response:** `{ "status": "sent", "expire_in": 3600 }`
- **Storage:** Redis Key `pwd_reset:{token}` (TTL: 3600s, Value: `{userId}`)
- **Error Cases:**
  - 404: 등록되지 않은 이메일인 경우 (보안상 200 반환 후 무시 정책 적용)
  - 429: 동일 이메일로 1분 내 3회 이상 요청 시 차단
```

개발자는 수백 줄의 코드를 검토하는 대신, 단 1페이지짜리 스펙 문서를 보고 *"어, 토큰 저장 방식 좋네. 그대로 진행해"*라고 **1분 만에 의사결정(Sign-off)**을 마칩니다.

### Step 2. 스펙 기반 실패 테스트 작성 (Contract Testing)
스펙이 승인되면 에이전트에게 본 코드가 아니라 **스펙을 검증하는 테스트 코드만 먼저 작성**하게 합니다. 당연히 실제 구현이 없으므로 테스트는 모두 빨간색(실패)으로 뜹니다.

### Step 3. 테스트 통과를 위한 최소 코드 구현
이제 에이전트에게 본 코드를 작성하도록 허용합니다. 에이전트는 이미 명확한 '채점 기준표(테스트)'를 가지고 있으므로, 혼자서 코드를 수정하고 테스트를 돌리는 자율 루프(Self-healing Loop)를 돌아 초록색(성공)을 만들어냅니다.

---

## 3. 실전 에이전트 규칙: AGENTS.md에 SDD 강제하기

팀의 프로젝트 설정 파일(`AGENTS.md` 또는 `CLAUDE.md`)에 아래 규칙을 넣어두면 에이전트가 절대로 섣불리 코드를 먼저 쏟아내지 않습니다:

```markdown
# Rule: Enforce Spec-Driven Development

1. **No Code Before Spec**: For any new feature or multi-file refactoring, NEVER write implementation code immediately.
2. **Submit SPEC first**: First, create a `specs/<feature-name>.md` file defining:
   - Interface / Schema definitions
   - Acceptance criteria (Given-When-Then)
   - Edge cases & Error handling
3. **Wait for Approval**: Stop and request human review.
4. **TDD Loop**: Upon approval, write tests first, verify they fail, then implement the code until all tests pass.
```

---

## 4. 요약: AI 시대의 가장 강력한 무기는 '정밀한 스펙'

에이전트가 코딩을 잘하게 만들려고 프롬프트 수식어를 백 번 다듬는 것보다, **에이전트가 따라야 할 명세(Spec)를 먼저 합의하는 프로세스를 강제하는 것**이 소프트웨어 결함을 줄이는 가장 빠른 지름길입니다.

---

**관련 글**
- [AI가 짠 코드, 어떻게 믿을 것인가 — 검증 전략의 모든 것]({% post_url 2026-06-10-verify-ai-generated-code %}) — 스펙 기반 검증 체계 구축
- [하네스 엔지니어링 존재 이유부터 실전 예제까지]({% post_url 2026-05-07-harness-engineering %}) — 결정론적 평가자로 에이전트를 가두는 법
- [AGENTS.md — Claude Code·Codex·Gemini CLI를 관통하는 공통 설정 표준]({% post_url 2026-06-10-agents-md-cross-tool-standard %}) — 프로젝트 레벨 규칙 강제
