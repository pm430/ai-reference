---
layout: post
title: "Smithery: MCP 서버 검색부터 설치까지 한 번에"
categories: skills-mcp
tags: [MCP, Smithery, Claude, Agent, CLI]
date: 2026-05-11 16:00:00 +0900
excerpt: "수천 개의 MCP 서버를 발견하고 클릭 몇 번으로 에이전트에 연결하는 법, Smithery를 소개합니다."
---

- **Website:** [smithery.ai](https://smithery.ai/)

## MCP(Model Context Protocol)의 허브, Smithery

Claude와 같은 AI 에이전트가 외부 도구(GitHub, Slack, Notion 등)와 소통할 수 있게 해주는 표준 규격인 MCP가 주목받고 있습니다. 하지만 정작 내가 필요한 서비스를 지원하는 MCP 서버를 어디서 찾고, 어떻게 설치해야 할지 막막할 때가 많습니다.

**Smithery**는 이러한 문제를 해결해주는 **MCP 서버 전용 레지스트리이자 관리 도구**입니다.

## 주요 특징

### 1. 방대한 MCP 레지스트리
Notion, Google Drive, Slack, GitHub 등 인기 서비스부터 실험적인 도구까지, 전 세계 개발자들이 만든 수많은 MCP 서버를 카테고리별로 쉽게 검색할 수 있습니다.

### 2. CLI를 통한 원클릭 설치
복잡한 설정 파일을 수동으로 수정할 필요가 없습니다. 터미널에서 `npx smithery` 명령어를 사용하면 선택한 MCP 서버를 즉시 설치하고 에이전트에 연결할 수 있습니다.

### 3. 인증 및 설정 자동화
OAuth 인증이나 복잡한 환경 변수 설정을 Smithery가 대신 처리해줍니다. "Connect once. Use everywhere"라는 슬로건처럼, 한 번 연결해두면 다양한 에이전트에서 일관되게 사용할 수 있습니다.

## 사용 방법 예시

특정 서비스를 위한 MCP 서버를 설치하고 싶다면 다음과 같은 명령어로 시작할 수 있습니다.

```bash
npx smithery install <mcp-server-name>
```

## 왜 사용해야 하나요?

AI 에이전트의 진정한 강력함은 외부 데이터와 연결될 때 발휘됩니다. Smithery는 그 연결 과정을 획기적으로 단순화하여, 개발자가 도구 설정에 시간을 낭비하지 않고 에이전트의 논리에 집중할 수 있게 도와줍니다.
