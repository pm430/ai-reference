---
layout: post
title: "Gemini CLI Skill Creator: 나만의 맞춤형 에이전트 스킬 만들기"
categories: skills-mcp
tags: [Gemini CLI, Skill, Automation, Agent, Customization]
date: 2026-05-18 10:00:00 +0900
excerpt: "반복되는 작업과 복잡한 프롬프트를 자동화하는 Gemini CLI의 'Skill' 기능을 활용해 나만의 전문가 에이전트를 구축하는 방법을 알아봅니다."
---

## 1. Skill이란 무엇인가?

Gemini CLI에서 **Skill**은 특정 도메인이나 작업에 특화된 지침, 워크플로우, 그리고 도구 활용법을 묶어놓은 '전문가 패키지'입니다. 매번 복잡한 프롬프트를 입력할 필요 없이, `activate_skill` 명령을 통해 에이전트에게 특정 역할의 전문성을 즉시 부여할 수 있습니다.

---

## 2. 왜 Skill Creator를 사용해야 하는가?

단순히 "코드를 리뷰해줘"라고 요청하는 것보다, 잘 정의된 **Skill**을 사용하는 것이 훨씬 강력한 이유는 다음과 같습니다.

1. **일관성**: 팀 내에서 동일한 품질의 결과물을 보장할 수 있는 표준 가이드를 제공합니다.
2. **효율성**: 복잡한 상황 설명이나 제약 사항을 매번 반복할 필요가 없습니다.
3. **확장성**: `SKILL.md` 파일을 통해 누구나 새로운 스킬을 정의하고 공유할 수 있습니다.

---

## 3. 나만의 스킬 만드는 법

### 1단계: Skill 구조 이해하기

모든 스킬은 전용 디렉토리 내의 `SKILL.md` 파일을 중심으로 구성됩니다. 이 파일에는 다음과 같은 내용이 포함됩니다.

- **Instructions**: 에이전트가 따라야 할 상세 행동 지침
- **Available Resources**: 스킬 실행에 필요한 문서나 템플릿의 위치
- **Workflows**: 권장되는 작업 순서 (예: Research -> Implementation -> Review)

### 2단계: `skill-creator` 활성화

Gemini CLI에는 새로운 스킬 제작을 돕는 전용 스킬인 `skill-creator`가 내장되어 있습니다.

```bash
# skill-creator 활성화
activate_skill(name="skill-creator")
```

활성화된 후에는 에이전트가 스킬 정의서 작성을 가이드해 줍니다.

### 3단계: `SKILL.md` 작성 및 등록

스킬의 핵심인 지침을 작성합니다. 예를 들어 'Python Performance Optimizer' 스킬을 만든다면, 성능 측정 도구 활용법과 병목 지점 식별 규칙을 상세히 적습니다. 작성된 스킬은 설정된 경로에 저장하면 즉시 사용 가능합니다.

---

## 4. 실전 예시: 코드 리뷰어 스킬

잘 만들어진 코드 리뷰어 스킬은 단순한 오타 수정을 넘어 다음을 체크합니다.

- **보안**: API 키 노출이나 취약한 패턴 감지
- **아키텍처**: 레이어 간 의존성 및 디자인 패턴 준수 여부
- **성능**: 불필요한 루프나 무거운 연산 최적화 제안

---

## 5. 결론

> "에이전트에게 물고기를 잡아주는 것이 아니라, 낚시하는 법(Skill)을 가르치세요."

Gemini CLI의 Skill 기능을 통해 단순한 AI 비서를 넘어, 우리 팀만의 커스텀 전문가 그룹을 만들어 보세요. 작은 자동화 스킬 하나가 개발 생산성에 거대한 변화를 가져올 것입니다.

---

**관련 포스트:**

- [Claude Skill과 Subagent 활용법]({% post_url 2026-05-07-claude-skill-subagent-command %}) - 에이전트 확장의 기초 개념 이해하기
- [ai-reference 프로젝트 온보딩 가이드]({% post_url 2026-05-18-onboarding-guide-for-ai-reference %}) - 저장소 협업 규칙 알아보기
