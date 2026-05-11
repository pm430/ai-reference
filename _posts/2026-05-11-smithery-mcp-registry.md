---
layout: post
title: "Smithery: 왜 써야 하고, 어떻게 MCP 서버를 자동 설치할까?"
categories: skills-mcp
tags: [MCP, Smithery, Claude, Agent, CLI]
date: 2026-05-11 16:00:00 +0900
excerpt: "수천 개의 MCP 서버를 발견하고 클릭 몇 번으로 에이전트에 연결하는 법, Smithery를 소개합니다."
---

## 1. Smithery란 무엇인가?

**Smithery**는 AI 에이전트의 능력을 확장해주는 **MCP(Model Context Protocol) 서버 전용 레지스트리이자 패키지 매니저**입니다. 수많은 개발자가 공개한 도구(GitHub, Slack, Notion 연동 등)를 검색하고, 복잡한 설정 없이 내 에이전트에 즉시 설치할 수 있게 돕습니다.

- **공식 사이트:** [smithery.ai](https://smithery.ai/)

---

## 2. Why: 왜 Smithery가 필요한가?

MCP 표준이 나오면서 많은 도구가 등장했지만, 이를 실제로 사용하려면 번거로운 과정이 따릅니다.

1. **설정의 자동화**: `claude_desktop_config.json` 파일을 열어 JSON 형식을 직접 맞추고 경로를 설정하는 수동 작업은 오류가 나기 쉽습니다. Smithery는 이를 명령어 한 줄로 자동 처리합니다.
2. **검색의 편리함**: 어떤 MCP 서버가 있는지, 그 서버가 어떤 기능을 제공하는지 일일이 GitHub를 뒤질 필요가 없습니다. Smithery 웹에서 모든 명세를 한눈에 확인할 수 있습니다.
3. **환경 관리**: 다양한 에이전트 환경에서 일관된 MCP 설정을 유지하고 관리할 수 있도록 돕습니다.

---

## 3. How: MCP 서버 설치 및 사용법

### 1단계: Smithery CLI로 설치하기
별도의 설치 없이 `npx`를 통해 즉시 서버를 설치할 수 있습니다. 예를 들어, 메모리 관리 기능을 추가하고 싶다면 다음과 같이 입력합니다.

```bash
npx smithery install @smithery-ai/memory-server
```

### 2단계: Claude Desktop 연동 확인
Smithery를 통해 설치한 서버는 자동으로 Claude Desktop 설정에 반영됩니다.

- **macOS 경로**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows 경로**: `%AppData%\Claude\claude_desktop_config.json`

위 파일을 열어보면 설치한 서버의 경로와 실행 인자가 자동으로 추가된 것을 확인할 수 있습니다.

### 3단계: 환경 변수 설정
Slack이나 Notion처럼 인증이 필요한 서버는 API 키가 필요합니다. `smithery install` 시 터미널에서 입력을 요구하거나, 위 JSON 파일의 `env` 섹션에 직접 키를 넣어야 할 수도 있습니다.

---

## 4. 실전 팁: 문제 해결하기

- **서버가 안 나타나요**: Claude Desktop을 완전히 종료(Quit)한 후 다시 실행해 보세요.
- **설치가 실패해요**: Node.js가 설치되어 있는지 확인하세요. (`node -v`)
- **로그 확인**: 서버 작동이 안 된다면 `%AppData%\Claude\logs\mcp.log` 파일을 통해 오류 메시지를 확인할 수 있습니다.

---

## 5. 핵심 요약

> "복잡한 JSON 편집은 이제 그만, 명령어 한 줄로 AI의 능력을 확장하세요."

Smithery는 MCP 생태계의 '앱스토어'와 같습니다. 내 에이전트에게 새로운 기술을 가르치고 싶다면 지금 바로 Smithery에서 필요한 서버를 검색해 보세요.

---

**관련 포스트:**
- [OpenRouter: 모든 LLM을 하나의 API로]({% post_url 2026-05-11-openrouter-unified-api %}) - 연동된 MCP 도구를 다양한 모델에서 테스트해 보세요.
- [Claude Skill과 Subagent 활용법]({% post_url 2026-05-07-claude-skill-subagent-command %}) - MCP를 활용한 더 깊은 에이전트 확장 개념
