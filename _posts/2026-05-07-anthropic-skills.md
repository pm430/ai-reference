---
layout: post
title: "Anthropic 공식 Skills 저장소"
categories: skills-mcp
tags: [Claude Code, Skills, Anthropic]
date: 2026-05-07 13:11:30 +0900
excerpt: "Claude가 반복 작업을 재사용 가능한 방식으로 수행하도록 돕는 Anthropic 공식 스킬 모음입니다."
---

- **GitHub:** [anthropics/skills](https://github.com/anthropics/skills)
- **라이선스:** Apache 2.0 (일부 문서 스킬은 소스 공개)

## 개요

스킬(Skill)은 `SKILL.md` 명세서와 부속 리소스로 구성된 자체 완결형(self-contained) 모듈입니다. Claude Code나 에이전트에게 특정 도메인 업무(예: 프론트엔드 E2E 테스트, 오피스 문서 편집, MCP 서버 스캐폴딩)를 수행하는 절차와 노하우를 가르쳐 재사용 가능한 전문 에이전트로 확장합니다.

Anthropic 공식 저장소([anthropics/skills](https://github.com/anthropics/skills))는 Agent Skills 개방형 사양(Open Specification)의 표준 레퍼런스 구현체입니다.

## 스킬의 동작 원리: 점진적 공개 (Progressive Disclosure)

에이전트에 수십 개의 스킬이 등록되어 있어도 컨텍스트 윈도우가 낭비되지 않는 이유는 **점진적 공개** 원리 덕분입니다:

1. **메타데이터만 상시 노출**: 세션 시작 시 에이전트는 스킬의 이름(`name`)과 설명(`description`)만 시스템 프롬프트에 로드합니다 (수십 토큰 수준).
2. **필요 시 온디맨드 로딩**: 사용자가 "docx 문서로 보고서를 뽑아줘"라고 요청하면, 에이전트가 해당 `description`을 인지하고 비로소 `SKILL.md` 본문과 부속 스크립트를 읽어 들여 작업을 수행합니다.
3. **토큰 효율 극대화**: 작업을 마치면 스킬의 세부 지침은 컨텍스트에서 빠져나가며, 상시 토큰 소모를 최소화합니다.

## 스킬 폴더 표준 구조

하나의 스킬은 일반적으로 다음과 같은 표준 레이아웃을 갖습니다:

```text
skills/
└── webapp-testing/
    ├── SKILL.md             # 필수: 메타데이터(Front matter) 및 단계별 실행 지침
    ├── scripts/             # 선택: 에이전트가 호출할 자동화 헬퍼 스크립트
    │   └── test_runner.py
    └── references/          # 선택: API 가이드, 체크리스트, 예제 파일
        └── assertion_rules.md
```

### SKILL.md 기본 양식

```yaml
---
name: webapp-testing
description: Playwright를 사용하여 로컬 웹 애플리케이션의 E2E 테스트를 작성하고 실행합니다.
---

# Web App Testing

이 스킬은 웹 애플리케이션의 화면 동작을 브라우저 subagent나 스크립트를 통해 검증합니다.

## 실행 절차
1. 로컬 개발 서버 포트가 열려 있는지 확인한다.
2. 대상 페이지에 접근하여 DOM 상태를 확인한다.
3. 사용자 시나리오에 따라 클릭, 입력 후 결과를 스크린샷으로 캡처한다.
```

## 공식 저장소의 대표 스킬

| 카테고리 | 대표 스킬 | 역할 |
| --- | --- | --- |
| **Document Skills** | `docx`, `pdf`, `pptx`, `xlsx` | LibreOffice나 복잡한 외부 도구 없이 에이전트가 직접 고품질 오피스 문서를 생성·수정 |
| **Development** | `mcp-builder` | 사내 API나 도구를 감싸는 MCP(Model Context Protocol) 서버 코드를 표준에 맞게 자동 생성 |
| **Testing** | `webapp-testing` | 빌드된 웹 앱의 UI 요소가 의도대로 상호작용하는지 헤드리스 브라우저로 실시간 검증 |
| **Architecture** | `codebase-curator` | 레거시 저장소를 분석하여 아키텍처 다이어그램과 온보딩 문서를 최신 상태로 유지 |

## 실무 팁: 커스텀 스킬 작성 시 주의점

- **`description`이 가장 중요**: 에이전트가 이 스킬을 호출할지 말지는 오직 `description`의 키워드 매칭과 의도 분석에 달려 있습니다. "언제 호출해야 하는지"를 명확한 트리거 조건으로 서술하세요.
- **결정적 스크립트와 결합**: 복잡한 파싱이나 포맷 변환은 AI에게 프롬프트로 시키는 것보다, `scripts/` 폴더에 파이썬 스크립트를 두고 에이전트가 실행하도록 지시하는 것이 실패율이 0%에 수렴합니다.

---


**관련 글**

- [Andrej Karpathy의 LLM 코딩 실수 방지 스킬]({% post_url 2026-05-07-andrej-karpathy-skills %}) — 커뮤니티의 대표 스킬 사례
- [Antigravity Awesome Skills — 1,400+ 에이전트 스킬 모음]({% post_url 2026-05-07-antigravity-awesome-skills %}) — 더 방대한 커뮤니티 스킬 모음
- [claude-code-setup — 코드베이스를 분석해 자동화를 추천하는 공식 플러그인]({% post_url 2026-06-08-claude-code-setup-guide %}) — 어떤 스킬을 추가할지 추천받기
