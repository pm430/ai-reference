---
layout: post
title: "Claude Code 프로젝트 셋업 완전 가이드 — Hooks, Skills, MCP 자동화"
categories: skills-mcp
tags: [Claude Code, Setup, Hooks, Skills, MCP, 자동화]
date: 2026-06-08 10:00:00 +0900
excerpt: "Claude Code를 처음 프로젝트에 도입할 때 설정해야 할 것들을 한 번에 정리합니다. CLAUDE.md 작성부터 Hooks, Skills, MCP 서버 연결까지 실전 셋업 흐름을 다룹니다."
---

## 1. 왜 셋업이 중요한가

Claude Code는 설치 직후부터 동작하지만, 아무런 설정 없이 쓰면 **매번 같은 컨텍스트를 반복 설명**해야 합니다. 프로젝트 언어, 테스트 명령, 팀 컨벤션을 Claude가 모르기 때문입니다.

올바른 셋업은 세 가지를 해결합니다.

- Claude가 프로젝트를 "아는" 상태로 대화를 시작
- 반복 작업을 스킬·훅으로 자동화해 프롬프트 타이핑 줄이기
- 외부 도구(GitHub, Notion, DB 등)를 MCP로 연결해 컨텍스트 스위칭 제거

---

## 2. CLAUDE.md — Claude의 프로젝트 설명서

`CLAUDE.md`는 Claude Code가 대화 시작 시 **자동으로 읽는 지침 파일**입니다. 프로젝트 루트에 두면 됩니다.

### 최소 템플릿

```markdown
# 프로젝트명

## 기술 스택
- 언어: TypeScript 5.x
- 프레임워크: Next.js 14 (App Router)
- DB: PostgreSQL 16 + Prisma ORM

## 로컬 실행
\`\`\`bash
pnpm install
pnpm dev       # 개발 서버 (localhost:3000)
pnpm test      # Vitest 단위 테스트
pnpm lint      # ESLint + Prettier
\`\`\`

## 컨벤션
- 함수명: camelCase, 컴포넌트: PascalCase
- API 응답은 항상 { data, error } 구조
- 주석은 WHY만, WHAT은 코드로 표현

## 금지 사항
- console.log를 커밋에 포함하지 않음
- any 타입 사용 금지
```

### 무엇을 쓰고 무엇을 빼야 하나

| 포함 O | 포함 X |
|---|---|
| 빌드·테스트·실행 명령 | 코드 아키텍처 설명 (코드에서 읽으면 됨) |
| 팀 컨벤션과 금지 패턴 | git 히스토리 요약 |
| 외부 시스템 접근 방법 | 임시 작업 메모 |
| 비자명한 환경 변수 | 일반적인 코딩 원칙 |

---

## 3. Hooks — 이벤트 기반 자동화

Hooks는 Claude Code의 특정 **이벤트에 셸 명령을 연결**합니다. Claude가 뭔가 하기 전/후에 자동으로 실행되므로, 잊어버릴 수 없는 검사나 알림에 씁니다.

### 설정 위치

```
# 프로젝트 범위
.claude/settings.json

# 사용자 전체 범위
~/.claude/settings.json
```

### 기본 구조

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[훅] Bash 실행 전 검사'"
          }
        ]
      }
    ],
    "PostToolUse": [...],
    "Stop": [...]
  }
}
```

### 실전 훅 예시

**파일 저장 후 자동 포맷**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm prettier --write \"$CLAUDE_FILE_PATHS\""
          }
        ]
      }
    ]
  }
}
```

**Claude가 멈출 때 알림**
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude 작업 완료\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**위험한 git 명령 차단**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'push --force' && echo 'BLOCK: force push 금지' && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

> 훅 종료 코드: `0` = 통과, `2` = 차단(Claude 중단), 그 외 = 경고만

---

## 4. Skills — 재사용 가능한 작업 패턴

스킬은 `/명령어` 형태로 호출하는 **마크다운 기반 지침 파일**입니다. 팀 공통 작업을 한 번 정의해두면 누구나 같은 방식으로 실행할 수 있습니다.

### 파일 위치

```
.claude/skills/
  code-review.md      # /code-review 로 호출
  deploy-check.md     # /deploy-check 로 호출
  hotfix.md           # /hotfix 로 호출
```

### 스킬 파일 구조

```markdown
---
name: deploy-check
description: 배포 전 체크리스트를 실행하고 결과를 보고합니다
---

# 배포 전 체크리스트

다음 순서로 검사를 진행하세요.

1. `pnpm test` 실행 → 실패 시 배포 중단
2. `pnpm build` 실행 → 빌드 오류 확인
3. 환경 변수 목록(`ENV_VARS.md`)과 실제 .env 비교
4. CHANGELOG.md에 이번 변경사항 기록 여부 확인

모든 항목 통과 시 "배포 준비 완료"를 출력하세요.
```

### 좋은 스킬 후보

| 상황 | 스킬 예시 |
|---|---|
| PR 리뷰를 일정 형식으로 받고 싶다 | `/code-review` |
| 매번 같은 디버깅 흐름을 따른다 | `/debug-flow` |
| 컴포넌트 생성 패턴이 고정되어 있다 | `/new-component` |
| 보안 검토 항목이 정해져 있다 | `/security-check` |

---

## 5. MCP 서버 — 외부 도구 연결

MCP(Model Context Protocol)는 Claude가 **외부 시스템을 도구처럼 직접 호출**할 수 있게 합니다. GitHub, Notion, DB 등을 연결하면 Claude가 직접 이슈를 읽고, 문서를 업데이트하고, 쿼리를 실행합니다.

### 설정 위치와 구조

```json
// ~/.claude/settings.json (사용자 전체) 또는 .claude/settings.json (프로젝트)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost/mydb"
      }
    }
  }
}
```

### 자주 쓰는 MCP 서버

| MCP 서버 | 무엇을 할 수 있나 |
|---|---|
| `@modelcontextprotocol/server-github` | 이슈·PR 조회, 코멘트, 파일 읽기 |
| `@modelcontextprotocol/server-postgres` | SQL 쿼리 실행, 스키마 탐색 |
| `@modelcontextprotocol/server-filesystem` | 로컬 파일 시스템 접근 범위 제한 |
| `@modelcontextprotocol/server-slack` | 채널 메시지 읽기·전송 |
| Notion MCP | 페이지 생성·업데이트, DB 조회 |

> MCP 서버 레지스트리: [smithery.ai](https://smithery.ai) 에서 커뮤니티 서버를 검색할 수 있습니다.

---

## 6. 권한 설정 — 허용·차단 명령 관리

매번 권한 승인이 뜨면 흐름이 끊깁니다. 안전한 명령은 미리 허용 목록에 추가하세요.

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm *)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)"
    ]
  }
}
```

`/permissions` 명령으로 현재 설정을 확인하거나, `/update-config` 스킬로 대화식으로 수정할 수 있습니다.

---

## 7. 셋업 우선순위 — 어디부터 시작할까

프로젝트에 처음 Claude Code를 도입한다면 이 순서로 진행하세요.

```
1단계: CLAUDE.md 작성
   → 빌드/테스트 명령과 팀 컨벤션 기록
   → 효과: 매 대화마다 컨텍스트 재설명 불필요

2단계: 권한 허용 목록 설정
   → 자주 쓰는 읽기 전용 명령 등록
   → 효과: 승인 팝업 줄어들어 집중력 유지

3단계: 반복 작업을 스킬로 추출
   → PR 리뷰, 컴포넌트 생성 등 고정 패턴부터
   → 효과: 팀 전체 일관성 확보

4단계: MCP 서버 연결
   → GitHub, DB 등 자주 참조하는 시스템부터
   → 효과: 브라우저·터미널 전환 없이 Claude 안에서 해결

5단계: Hooks로 안전망 구축
   → 자동 포맷, 위험 명령 차단, 완료 알림
   → 효과: Claude가 실수해도 자동으로 잡힘
```

---

## 마무리

Claude Code는 설치 직후보다 **셋업 후에 10배 강해집니다**. CLAUDE.md 하나만 잘 써도 컨텍스트 공유 문제가 대부분 해결되고, 스킬과 훅이 더해지면 팀 워크플로우 자체가 자동화됩니다.

`/claude-code-setup` 스킬을 쓰면 현재 프로젝트를 분석해 어떤 자동화를 추가하면 좋을지 Claude가 직접 추천해줍니다.

**관련 글**
- {% post_url 2026-05-07-ai-cli-tools-installation %} — Claude Code 설치 방법
- {% post_url 2026-05-18-mcp-the-future-of-ai-tooling %} — MCP 개념 심화
- {% post_url 2026-05-07-anthropic-skills %} — Anthropic 공식 스킬 목록
