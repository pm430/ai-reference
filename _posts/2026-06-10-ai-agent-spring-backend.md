---
layout: post
title: "Spring 백엔드 개발에 AI 코딩 에이전트 적용하기 — 실무 가이드"
categories: use-cases
tags: [Spring, Spring Boot, Java, AI 코딩, JUnit, 백엔드, 실무]
date: 2026-06-10 00:20:00 +0900
excerpt: "레이어드 아키텍처, JPA, 테스트 피라미드 — Spring 프로젝트의 관례를 AI 에이전트에게 지키게 하는 방법과, 백엔드 실무에서 효과가 검증된 작업 유형을 정리합니다."
---

## 1. Spring 프로젝트가 AI와 잘 맞는 이유

Spring 생태계는 사실 AI 에이전트와 궁합이 좋습니다.

- **관례가 강하다**: Controller → Service → Repository 레이어, 어노테이션 기반 설정 등 패턴이 정형화되어 있어 모델이 학습한 관례와 일치합니다.
- **테스트 인프라가 성숙하다**: JUnit, AssertJ, Testcontainers, `@SpringBootTest` — 에이전트가 스스로 검증 루프를 돌릴 수단이 풍부합니다.
- **빌드 도구가 명확하다**: `./gradlew test`, `./mvnw verify` 한 줄로 성공/실패가 판정됩니다.

> 에이전트에게 "테스트를 돌려 검증하라"고 시킬 수 있는 환경 — 이것이 Spring 프로젝트가 가진 가장 큰 무기입니다.

---

## 2. 먼저 할 일: 프로젝트 규칙을 설정 파일에

Spring 프로젝트용 AGENTS.md(또는 CLAUDE.md)에 들어가야 할 최소 항목입니다.

```markdown
## 빌드·테스트
- 전체 테스트: ./gradlew test
- 특정 테스트: ./gradlew test --tests "com.example.OrderServiceTest"
- 코드 수정 후 반드시 관련 테스트 통과 확인

## 아키텍처 규칙
- 비즈니스 로직은 Service에만. Controller는 요청 검증과 위임만
- Repository 직접 호출은 Service에서만 (Controller에서 금지)
- DTO ↔ Entity 변환은 매퍼 클래스에서

## 기술 결정
- Java 21 / Spring Boot 3.x
- 조회는 QueryDSL, 단순 CRUD는 Spring Data JPA
- 새 의존성 추가 전 반드시 사람에게 확인
```

이 파일이 없으면 에이전트는 "일반적인 Spring 프로젝트"를 가정하고, 팀 컨벤션과 어긋난 코드를 만들어냅니다.

---

## 3. 효과가 검증된 작업 유형

| 작업 | 효과 | 팁 |
|---|---|---|
| **테스트 작성** | ★★★ | 기존 Service에 단위 테스트 추가. "경계값·예외 케이스 포함" 명시 |
| **DTO·매퍼 보일러플레이트** | ★★★ | 반복적이고 기계적 — AI의 최적 영역 |
| **예외 처리 일원화** | ★★☆ | `@ControllerAdvice` 기반 통일 작업을 모듈 단위로 |
| **JPA 쿼리 진단** | ★★☆ | N+1 의심 로그를 주고 fetch join/EntityGraph 제안받기 |
| **버전 마이그레이션** | ★★☆ | Boot 2→3 같은 대규모 기계적 변경. 모듈 단위로 자르기 |
| **설정 클래스 작성** | ★☆☆ | Security 설정 등은 반드시 사람이 리뷰 — 보안 직결 |

반대로 **트랜잭션 경계 설계, 동시성 제어, 보안 설정**은 AI 제안을 출발점으로만 쓰고 최종 판단은 사람이 해야 하는 영역입니다. `@Transactional`의 전파 속성 하나가 장애로 이어질 수 있습니다.

---

## 4. 실전 워크플로우 예시 — 신규 API 추가

1. **계획**: "주문 취소 API를 추가하려고 한다. 기존 `OrderService` 구조를 읽고 구현 계획을 먼저 제시하라. 코드는 아직 쓰지 마라."
2. **테스트 먼저**: 계획 합의 후 실패하는 테스트부터 작성시킵니다 (`OrderCancelServiceTest`).
3. **구현**: 테스트를 통과하는 최소 구현 → `./gradlew test` 통과 확인까지 에이전트가 자체 반복.
4. **리뷰**: diff를 사람이 리뷰. 특히 트랜잭션 경계와 예외 처리를 중점 확인.

"계획 먼저, 코드는 나중" 패턴은 레이어가 많은 Spring에서 특히 중요합니다. 계획 없이 시작하면 Controller에 비즈니스 로직이 들어간 코드를 받게 됩니다.

---

## 5. 마치며

Spring 실무에서 AI 에이전트의 가치는 "어려운 코드를 대신 짜주는 것"보다 **테스트·보일러플레이트·마이그레이션 같은 부피 큰 작업을 위임하고, 사람은 설계와 트랜잭션·보안 같은 판단에 집중**하게 해주는 데 있습니다. 규칙을 설정 파일로 영속화하고, 테스트로 검증 루프를 만들어주면 에이전트는 꽤 믿을 만한 백엔드 페어가 됩니다.

---

**관련 글**

- [대규모 레거시 코드베이스에 AI 에이전트 도입하기 — 전략과 함정]({% post_url 2026-06-10-ai-agent-large-codebase %}) — 모듈 단위 범위 설정 전략
- [AI가 짠 코드, 어떻게 믿을 것인가 — 검증 전략]({% post_url 2026-06-10-verify-ai-generated-code %}) — 테스트 기반 검증 체계
- [디버깅 파트너 — AI와 함께 버그 헌팅하는 법]({% post_url 2026-06-05-ai-debugging-partner %}) — 백엔드 버그 추적 워크플로우
- [AGENTS.md — Claude Code·Codex·Gemini CLI를 관통하는 공통 설정 표준]({% post_url 2026-06-10-agents-md-cross-tool-standard %}) — 프로젝트 규칙 영속화
