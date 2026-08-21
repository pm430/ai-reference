---
layout: post
title: "AI 코딩 IDE 정리 — Orca, Antigravity, Cursor, Windsurf 비교"
categories: use-cases
tags: [Orca, Antigravity, Cursor, Windsurf, Zed, Kiro, AI IDE, 개발 환경]
date: 2026-08-21 00:00:00 +0900
excerpt: "요즘 주력으로 쓰는 Orca·Antigravity와 예전에 써봤던 Cursor·Windsurf를 실사용 관점에서 비교하고, 공식 링크·데모 영상과 함께 살펴볼 만한 다른 AI IDE도 정리합니다."
---

## 1. 왜 AI IDE를 정리하는가

AI 코딩 도구는 크게 두 갈래로 나뉩니다. 하나는 Claude Code, Codex CLI처럼 **터미널 위에서 동작하는 CLI 에이전트**이고, 다른 하나는 이번 글에서 다룰 **에디터/IDE 형태로 AI를 통합한 도구**입니다. 최근 반년 사이 Cursor, Windsurf에 이어 Google Antigravity, Orca 같은 도구들이 잇달아 나오면서 "AI 네이티브 IDE" 카테고리 자체가 빠르게 재편되고 있습니다.

지금 주력으로 쓰는 건 **Orca**와 **Antigravity**이고, 그 이전에는 **Cursor**와 **Windsurf**를 사용했습니다. 네 도구 모두 "AI가 코드를 직접 작성·수정한다"는 기본 전제는 같지만, 에이전트를 다루는 방식과 작업 단위가 꽤 다릅니다.

---

## 2. 네 도구의 기본 성격과 공식 링크

| 도구 | 형태 | 핵심 특징 | 공식 링크 |
|---|---|---|---|
| **Orca** | 멀티 에이전트 오케스트레이션 환경 | 워크스페이스·워크트리 단위로 여러 에이전트를 동시에 굴리고, 스킬/자동화로 작업을 표준화 | 사내·초대 기반 도구라 공개 URL은 별도로 정리 예정 |
| **Antigravity** | Google의 에이전트 우선 개발 플랫폼 | 에디터·터미널·브라우저를 에이전트가 함께 조작하는 "Manager View"로 여러 에이전트를 병렬 관리 | [antigravity.google](https://antigravity.google/) |
| **Cursor** | VS Code 포크 기반 AI 에디터 | 인라인 편집·채팅·Composer(멀티파일 편집)로 AI를 에디터 전체에 통합 | [cursor.com](https://cursor.com/) |
| **Windsurf** | VS Code 포크 기반 AI 에디터 | Cascade 에이전트 플로우로 변경 컨텍스트를 자동 추적하며 여러 파일을 순차 편집 | [windsurf.com](https://windsurf.com/) |

2026년 8월 기준으로 Cursor·Windsurf·Antigravity 세 도구 모두 개인 유료 플랜이 월 20달러 선으로 수렴했고, Antigravity는 2026년 5월 Google I/O에서 데스크톱 앱·CLI·SDK를 갖춘 "Antigravity 2.0"으로 확장 발표됐습니다. (관련 기사: [teacherandtask.com](https://www.teacherandtask.com/blog/cursor-windsurf-copilot-antigravity-ai-coding-ide-landscape))

Cursor와 Windsurf는 둘 다 "VS Code를 베이스로 AI 기능을 얹는다"는 같은 출발점에서 시작한 도구라 단축키나 UI 감각이 비슷합니다. 반면 Orca와 Antigravity는 에디터를 처음부터 에이전트 중심으로 다시 설계했다는 느낌이 강합니다.

### 영상으로 보기

{% include youtube.html id="T_fnhr5lVBw" title="Google Antigravity | I/O 2026 Keynote" %}

**출처:** [Google Antigravity | I/O 2026 Keynote](https://www.youtube.com/watch?v=T_fnhr5lVBw)

{% include youtube.html id="e_O2MsoVCQI" title="Cursor 2.0 Explained: New Agent Mode, Composer Model, and Built-In Browser" %}

**출처:** [Cursor 2.0 Explained](https://www.youtube.com/watch?v=e_O2MsoVCQI)

두 영상 모두 각 도구의 에이전트 모드(Antigravity의 Manager View, Cursor의 Composer/Agent Mode)를 화면으로 직접 보여주기 때문에, 표로 된 설명보다 실제 UI 흐름을 파악하기에 좋습니다.

---

## 3. 실사용 관점 비교와 예시

### Orca — 여러 에이전트를 동시에 굴릴 때

Orca를 주력으로 쓰는 이유는 **하나의 작업을 한 에이전트가 처음부터 끝까지 처리하게 두지 않고, 워크트리 단위로 병렬 작업을 나눠 굴릴 수 있기 때문**입니다. 예를 들어 기능 하나를 만들 때 "리서치용 에이전트"와 "구현용 에이전트"를 서로 다른 워크트리에서 동시에 돌리고, 완료되면 결과만 메인 브랜치로 합치는 식으로 작업합니다. 여러 브랜치 작업을 동시에 진행하고 싶을 때 특히 유용하며, 단일 파일을 빠르게 고치는 용도보다는 **작업을 오케스트레이션하는 용도**에 가깝습니다.

### Antigravity — 에이전트가 코드베이스를 주도적으로 탐색할 때

Antigravity는 에디터 자체가 "에이전트가 먼저 움직이고, 사람이 검토·개입한다"는 흐름에 맞춰져 있습니다. Manager View에서 여러 에이전트의 진행 상황을 병렬로 확인할 수 있고, Gemini 3 Pro를 기본 모델로 쓰면서 Claude Sonnet 4.5나 GPT-OSS 계열 모델도 선택할 수 있습니다. 코드베이스가 크거나 익숙하지 않은 저장소를 다룰 때, 에이전트에게 넓은 재량을 주고 결과를 확인하는 방식이 잘 맞습니다.

### Cursor — 익숙한 편집 경험이 필요할 때

Cursor는 VS Code에 익숙한 사람이라면 적응 비용이 거의 없습니다. 인라인 편집(Cmd+K)과 Composer로 특정 파일·함수 단위를 빠르게 고치는 데 강했고, 자동완성 품질도 좋았습니다. 다만 여러 에이전트를 병렬로 굴리거나 워크플로 자체를 자동화하는 쪽으로는 Orca만큼의 유연성은 없었습니다.

### Windsurf — 컨텍스트 자동 추적이 필요할 때

Windsurf의 Cascade는 변경 이력과 관련 파일을 자동으로 따라가면서 편집을 이어가는 감각이 좋았습니다. Cursor와 비슷한 축에 있지만, 연쇄적인 멀티파일 수정 작업에서 조금 더 매끄럽다는 인상이었습니다.

---

## 4. 함께 살펴볼 만한 다른 AI IDE

지금 쓰는 네 가지 외에도 2026년 기준으로 자주 언급되는 AI IDE들이 있습니다. 실제로 오래 써본 건 아니지만, 필요에 따라 시도해볼 만한 후보로 정리합니다.

| 도구 | 특징 | 공식 링크 |
|---|---|---|
| **Zed** | Rust로 처음부터 새로 만든 초고속 에디터. 실시간 공동 편집과 AI 기능을 함께 지원하며 에디터 자체는 무료 | [zed.dev](https://zed.dev/) |
| **Amazon Kiro** | AWS가 내놓은 VS Code 기반 IDE. 프롬프트로 바로 코드를 고치는 "Vibe 모드"와 요구사항·설계 문서를 먼저 만드는 "Spec 모드"를 함께 제공 | [kiro.dev](https://kiro.dev/) |
| **GitHub Copilot** | 인라인 자동완성 품질이 가장 안정적이라는 평가가 많고, 다른 AI 네이티브 IDE 대비 가격이 저렴한 편 | [github.com/features/copilot](https://github.com/features/copilot) |

VS Code 계열(Cursor, Windsurf, Kiro)에 익숙하다면 Zed로 넘어갈 때 속도 체감이 가장 크고, "코딩 전에 스펙부터 합의하고 싶다"면 Kiro의 Spec 모드가, 자동완성 위주로 가볍게만 쓰고 싶다면 Copilot이 각각 맞는 선택지입니다.

---

## 5. 선택 기준 정리

> 지금은 **작업 단위가 클수록 Orca, 코드베이스 탐색·수정이 중심이면 Antigravity**를 쓰고, Cursor·Windsurf는 VS Code 기반의 가벼운 AI 편집 경험이 필요할 때 여전히 유효한 선택지입니다.

- **여러 작업을 병렬로 조율해야 한다** → Orca
- **에이전트가 코드베이스를 넓게 탐색하며 작업하길 원한다** → Antigravity
- **VS Code 감각 그대로 AI 보조를 받고 싶다** → Cursor / Windsurf
- **에디터 속도 자체가 중요하다** → Zed
- **코딩 전에 스펙·설계 합의부터 하고 싶다** → Amazon Kiro
- **가볍게 자동완성 위주로만 쓰고 싶다** → GitHub Copilot

결국 "AI에게 얼마나 자율성을 주고, 사람은 어디서 개입할지"를 다르게 설계한 도구들입니다. 도구 자체보다 **지금 하려는 작업의 단위(파일 하나인지, 저장소 전체인지, 여러 작업의 병렬 조율인지)**를 먼저 정하고 도구를 고르는 편이 낫습니다. 추천은 어디까지나 출발점일 뿐, 팀 상황과 프로젝트 규모에 따라 조합해서 쓰는 게 현실적입니다.

---

**관련 글**

- {% post_url 2026-05-18-onboarding-guide-for-ai-reference %} — AI 에이전트 활용을 위한 기초 개념
- {% post_url 2026-05-29-ai-coding-agent-usecase %} — AI 코딩 에이전트 활용 사례
- {% post_url 2026-06-24-loop-engineering %} — 반복 작업 자동화와 에이전트 워크플로
