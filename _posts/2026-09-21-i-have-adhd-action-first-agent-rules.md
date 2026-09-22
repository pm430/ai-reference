---
layout: post
title: "i-have-adhd — 사족을 없애고 즉시 실행할 행동만 주는 프롬프트 룰셋"
categories: prompt-engineering
tags: [Prompt, ADHD, 생산성, Claude Code, Cursor, UX]
date: 2026-09-21 09:10:00 +0900
excerpt: "LLM 특유의 장황한 인사와 서론을 원천 차단하고, 개발자가 즉시 실행할 수 있는 '첫 줄 액션'과 번호화된 태스크만 출력하도록 강제하는 프롬프트 엔지니어링 패턴입니다."
---

- **오픈소스 레퍼런스:** `i-have-adhd` Agent Skill Specification
- **핵심 목표:** 인지 과부하(Cognitive Overload) 제거 및 실행 마찰력(Friction) 제로화

---

## 1. AI와 대화할 때 느끼는 '인지적 피로'의 정체

LLM과 장시간 페어 프로그래밍을 하다 보면 다음과 같은 패턴에 지치기 쉽습니다:

> *"네, 아주 좋은 질문입니다! 인증 흐름을 설계할 때는 몇 가지 고려해야 할 점들이 있습니다. 우선 JWT를 사용할 수도 있고 세션을 쓸 수도 있는데요, 상황에 따라 다릅니다. 제가 생각하기에는... (중략 30줄) ...따라서 다음과 같이 코드를 수정하시면 됩니다."*

이 답변을 마주한 개발자의 뇌는 다음 3가지 장애물에 부딪힙니다:
1. **작업 기억(Working Memory) 낭비**: 장황한 서론 속에서 "그래서 내가 지금 뭘 해야 하지?"를 찾느라 스크롤을 내리며 집중력이 분산됨.
2. **실행 마찰력 증가**: 알고 있는 것과 행동하는 것 사이의 간극이 벌어져, 시작조차 하기 싫어짐.
3. **불명확한 시간 감각**: "조금 작업하면 됩니다"라는 막연한 표현 때문에 일이 10분짜리인지 3시간짜리인지 가늠되지 않음.

**`i-have-adhd`** 룰셋은 독자의 뇌가 즉각적으로 행동할 수 있도록 출력을 재구성하는 실전 프롬프트 엔지니어링 사양입니다.

---

## 2. 5대 핵심 원칙과 출력 비교

```text
[일반 LLM 출력]                                [i-have-adhd 출력]
"안녕하세요! 말씀하신 오류를 분석해보니..."         `npm install jsonwebtoken`을 실행한 뒤
(장황한 배경 설명 4문단)                         `src/auth.ts:42`의 토큰 검증 함수를 교체하세요.
"그래서 이렇게 하시면 됩니다..."                 (작업 소요: 약 3분)
(코드 블록)                                     
"도움이 되셨길 바랍니다! 추가 질문 있으시면..."    
```

### 1) Lead with the next action (첫 줄은 무조건 행동)
답변의 가장 첫 문장은 배경 설명이나 맥락이 아니라, 개발자가 터미널이나 에디터에서 **지금 당장 실행할 수 있는 액션**이어야 합니다. 설명이 필요하다면 행동 지침 뒤에 덧붙입니다.

### 2) Number multi-step tasks (다단계 작업의 번호화)
작업이 2단계 이상이면 무조건 번호 매겨진 리스트(`1.`, `2.`, `3.`)로 제공합니다. 한 단계 안에서 "그리고 나서"라는 접속사가 2번 이상 들어가지 않도록 동작을 쪼갭니다.

### 3) End with ONE concrete next action (끝날 땐 2분 내 가능한 1가지 제시)
답변 말미에 "도움이 되셨길 바랍니다"라는 무의미한 인사말 대신, **2분 안에 완료할 수 있는 단 하나의 명확한 후속 행동**을 제시합니다.
- *Bad:* "더 궁금한 점이 있으시면 언제든 편하게 질문해 주세요."
- *Good:* "다음 단계: 터미널에 `npm test`를 실행하고 실패하는 첫 줄을 복사해 주세요."

### 4) No preamble, no pleasantries (서론·인사말 일체 금지)
- 금지된 시작 표현: *"좋은 질문입니다"*, *"제가 확인해보겠습니다"*, *"물론이죠!"*, *"살펴보니..."*
- 금지된 맺음 표현: *"도움이 되었길 바랍니다"*, *"언제든 말씀하세요"*

### 5) Specific time estimates (구체적인 시간 단위 명시)
"금방 끝납니다", "시간이 좀 걸립니다" 같은 모호한 수식어를 금지하고, `"테스트가 이미 작성되어 있다면 약 5분, 새로 작성해야 한다면 30분 소요"`처럼 숫자로 명시합니다.

---

## 3. 실전 룰 파일 스니펫 (CLAUDE.md / .cursorrules 적용)

프로젝트 루트나 전역 설정 파일(`~/.claude/CLAUDE.md` 또는 `.cursorrules`)에 아래 스니펫을 추가하면 모든 에이전트 대화에 즉시 적용됩니다:

```markdown
# Output Formatting Rule: Action-First Mode

The reader values minimal cognitive load and immediate actionability.
Follow these constraints on EVERY response:

1. **Lead with the action**: The first line MUST be something the user can do immediately (a command, file path, or concrete action). No preamble.
2. **Numbered steps**: Break multi-step work into a numbered list (1, 2, 3). Keep steps small and distinct.
3. **No pleasantries**: Strictly omit conversational openers ("Sure!", "Great question", "Let me check") and closers ("Hope this helps!").
4. **Concrete next action**: End with exactly ONE concrete action the user can finish in under 2 minutes.
5. **Time estimates**: Give explicit time estimates in minutes/hours, never vague terms like "soon" or "a bit of work".
6. **Cap lists**: Display at most 5 items per list to keep working memory small.
```

---

## 4. 실무 도입 효과

이 룰셋을 적용한 팀과 1인 개발자들의 피드백 공통점은 **"AI와의 대화 피로도가 극적으로 줄어든다"**는 것입니다.

- 에이전트의 답변을 읽는 데 들이는 스키밍(Skimming) 시간이 80% 이상 감소.
- AI가 제시한 첫 줄 명령어를 복사해 터미널에 붙여넣는 즉각적인 피드백 루프가 형성되어 개발 몰입(Flow) 상태가 오래 유지됨.

---

**관련 글**
- [Andrej Karpathy의 LLM 코딩 실수 방지 스킬]({% post_url 2026-05-07-andrej-karpathy-skills %}) — 단순성과 외과수술식 수정 원칙
- [게으른 시니어 개발자 — Ponytail 스킬로 AI 오버엔지니어링 차단하기]({% post_url 2026-09-21-ponytail-lazy-senior-developer-skill %}) — 불필요한 코드 작성을 줄이는 또 다른 룰셋
- [프롬프트 엔지니어링 5가지 핵심 패턴 — Zero-shot부터 ReAct까지]({% post_url 2026-06-03-prompt-engineering-5-patterns %}) — 실전 프롬프트 기초 패턴 총정리
