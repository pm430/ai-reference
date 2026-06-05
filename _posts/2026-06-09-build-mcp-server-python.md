---
layout: post
title: "MCP 서버 직접 만들기 — Python으로 나만의 도구 등록하기"
categories: skills-mcp
tags: [MCP, Model Context Protocol, Python, Claude Code, SDK, Smithery]
date: 2026-06-09 10:00:00 +0900
excerpt: "MCP를 *사용*만 하셨다면, 이번엔 *만들어* 보세요. Python SDK로 stdio MCP 서버를 구현하고, Claude Code에 등록해 실제 도구로 사용하는 전 과정을 다룹니다."
---

## 1. 왜 MCP 서버를 직접 만들어야 하는가

MCP는 **"도구와 AI 사이의 표준 통신 규약"** 입니다. Smithery 같은 레지스트리에서 이미 수천 개의 서버를 받아 쓸 수 있지만, *우리 팀에만 있는 내부 시스템* 은 등록되어 있지 않습니다.

직접 만들 줄 알면, 다음이 가능해집니다.

- **내부 API** (사내 결제 시스템, 사내 검색엔진, 사내 DB) 를 AI에게 직접 노출
- **레거시 CLI 도구** 를 표준 인터페이스로 감싸 다른 팀과 공유
- **반복 작업** (코드 생성, 배포, 보고서 작성) 을 AI 도구로 등록

이 글에서는 **Python SDK** 로 가장 단순한 stdio 서버를 만들고, Claude Code에 등록해 실제로 호출하는 전 과정을 보여드립니다.

---

## 2. MCP 프로토콜 핵심 — 알아야 할 만큼만

MCP는 **JSON-RPC 2.0** 기반의 단순한 프로토콜입니다. 다음 4가지만 알면 됩니다.

| 개념 | 의미 |
| --- | --- |
| **Host** | AI 에이전트(예: Claude Code) |
| **Client** | Host 안에서 서버에 연결하는 매개체 |
| **Server** | 도구를 노출하는 프로세스 |
| **Transport** | stdio (표준 입출력) 또는 HTTP+SSE |

**통신 흐름 (stdio 기준)**:

```
[Host] → stdin  → [Server]
[Host] ← stdout ← [Server]
```

매우 단순합니다. **프로세스 한 개를 띄우고, JSON-RPC 메시지를 stdin/stdout 으로 주고받는** 것만으로 도구가 됩니다.

### 서버가 노출할 수 있는 3가지

1. **Tools**: 모델이 *호출 가능한 함수*. 가장 자주 씀.
2. **Resources**: 모델이 *읽을 수 있는 데이터*. 파일, DB row 등.
3. **Prompts**: 미리 정의된 *프롬프트 템플릿*.

이번 글에서는 **Tools 만** 다룹니다. 다른 두 개는 필요할 때 확장할 수 있습니다.

---

## 3. 사전 준비

```bash
# Python 3.10+ 권장
python --version

# 프로젝트 디렉토리 생성
mkdir my-mcp-server
cd my-mcp-server

# uv (빠른 패키지 매니저) 권장, 없으면 pip
pip install mcp
```

Claude Code가 이미 설치되어 있다고 가정합니다. 설치 방법은 [이 사이트의 AI CLI 설치 가이드]({% post_url 2026-05-07-ai-cli-tools-installation %})를 참고하세요.

---

## 4. How: 5단계로 만드는 MCP 서버

### Step 1. 프로젝트 구조

```text
my-mcp-server/
├── pyproject.toml
├── src/
│   └── my_mcp/
│       ├── __init__.py
│       └── server.py
└── README.md
```

```toml
# pyproject.toml
[project]
name = "my-mcp-server"
version = "0.1.0"
dependencies = ["mcp[cli]>=1.0"]
```

### Step 2. 서버 코드 — 사내 검색을 흉내내는 도구

```python
# src/my_mcp/server.py
from mcp.server.fastmcp import FastMCP

# FastMCP 는 SDK 의 고수준 헬퍼. 데코레이터로 도구 등록.
mcp = FastMCP("my-company-tools")

# 가상의 사내 문서 DB (실제로는 DB/API 호출)
DOCS_DB = {
    "결제": "결제 시스템 문서: orderId 기반 멱등성 키 사용. 동시 요청은 Redis 분산 락.",
    "인증": "인증 시스템 문서: JWT 1시간, Refresh Token 30일. /api/auth/refresh 로 갱신.",
    "배포": "배포 가이드: main 브랜치 머지 시 GitHub Actions 가 staging 자동 배포.",
}


@mcp.tool()
def search_internal_docs(query: str, top_k: int = 1) -> str:
    """사내 기술 문서에서 키워드로 검색한다.

    Args:
        query: 검색할 키워드 (예: '결제', '인증')
        top_k: 반환할 상위 결과 수 (기본 1)

    Returns:
        가장 관련성 높은 문서 본문. 매칭이 없으면 빈 문자열.
    """
    for key, body in DOCS_DB.items():
        if query in key or key in query:
            return body
    return ""


@mcp.tool()
def list_doc_topics() -> list[str]:
    """사내 문서의 모든 토픽 목록을 반환한다."""
    return list(DOCS_DB.keys())


if __name__ == "__main__":
    # stdio transport 로 실행
    mcp.run(transport="stdio")
```

핵심 포인트:

| 요소 | 설명 |
| --- | --- |
| `@mcp.tool()` | 이 함수를 *도구로 노출* 한다는 표시 |
| Docstring | 모델이 *언제, 어떻게* 호출할지 판단하는 근거. 매우 중요 |
| Type hints | 입력·출력 타입으로 JSON schema 자동 생성 |
| `mcp.run(transport="stdio")` | 표준 입출력으로 통신 시작 |

### Step 3. 로컬 테스트 — MCP Inspector 로 빠르게 확인

```bash
# MCP Inspector: 개발자가 도구를 인터랙티브하게 테스트할 수 있는 도구
mcp dev src/my_mcp/server.py
```

브라우저가 열리면 다음을 확인할 수 있습니다.

- 등록된 도구 목록 (`search_internal_docs`, `list_doc_topics`)
- 각 도구의 JSON schema (자동 생성된 모습)
- 실제 호출해 보기 → 결과 확인

**이 단계에서 동작을 확인하지 않고 Claude Code 에 등록하면, 문제 발생 시 원인이 서버인지 클라이언트인지 모호해집니다.** 반드시 먼저 테스트하세요.

### Step 4. Claude Code에 등록

`~/.claude/mcp_servers.json` (또는 프로젝트 루트의 `.mcp.json`) 에 다음을 추가:

```json
{
  "mcpServers": {
    "my-company-tools": {
      "command": "python",
      "args": ["/absolute/path/to/my-mcp-server/src/my_mcp/server.py"],
      "env": {}
    }
  }
}
```

> **중요**: `args` 의 경로는 **절대 경로**여야 합니다. 상대 경로일 경우 Claude Code가 제대로 찾지 못합니다.

Claude Code를 재시작하면, 도구 목록에 우리가 만든 두 도구가 표시됩니다.

```text
> 사용 가능한 도구를 알려줘.

다음 도구를 사용할 수 있습니다:
- search_internal_docs(query, top_k)
- list_doc_topics()
```

### Step 5. 실제 호출 테스트

Claude Code 안에서 자연어로 요청:

```text
> 결제 시스템의 멱등성 처리 방식이 어떻게 돼?
```

Claude는 다음 흐름으로 답을 찾습니다.

```text
[Thought] 사내 문서를 검색해야겠다.
[Action]  search_internal_docs(query="결제")
[Observation] 결제 시스템 문서: orderId 기반 멱등성 키 사용. ...
[Final Answer] 사내 문서에 따르면, orderId 기반 멱등성 키를 사용하고 ...
```

이게 바로 MCP가 추구하는 *에이전트의 도구 사용* 패턴입니다. 우리가 만든 단순한 dict 조회도, Claude 입장에서는 다른 도구들과 똑같이 통합됩니다.

---

## 5. Smithery에 발행 — 다른 팀과 공유 (선택)

만든 서버를 팀이 공유하려면 **Smithery** 에 발행할 수 있습니다.

```bash
# smithery CLI 설치
npm install -g @smithery/cli

# 발행
smithery publish
```

발행 절차는 Smithery 문서를 따르되, 다음을 미리 준비해 두세요.

- **README.md**: 설치·설정·사용 예시
- **server.json**: Smithery 가 인식하는 메타데이터
- **라이선스**: 명시적 LICENSE 파일
- **시맨틱 버전**: 호환성 보장을 위해 `0.1.0` 같은 형식 사용

사내용이라면 발행하지 않고 Git 내부에서만 관리해도 충분합니다.

---

## 6. 흔한 실수 — 디버깅 팁

### 서버가 호출되지 않을 때

1. **경로 확인**: `mcp_servers.json` 의 경로가 절대 경로인지
2. **권한 확인**: 서버 파일이 실행 가능한지 (`chmod +x`)
3. **로그 확인**: `mcp dev` 로 단독 실행해 stderr 에 에러가 없는지

### 모델이 도구를 호출하지 않을 때

1. **Docstring 확인**: 도구 설명이 모호하면 모델이 "다른 도구로도 가능" 이라 판단해 호출을 건너뜁니다.
2. **이름이 직관적인지**: `do_thing_2` 같은 이름은 `search_internal_docs` 보다 호출률이 현저히 낮습니다.
3. **파라미터 명세**: `top_k: int = 1` 처럼 *기본값을 명시*하면 모델이 덜 망설입니다.

### 응답이 느릴 때

- 외부 API 호출이 있는 도구는 **타임아웃** 을 명시적으로 관리
- 대용량 결과는 **요약해서 반환** (Context Engineering 의 Selection 원칙)
- 가능하면 **캐시** 를 두어 같은 입력에 대해 빠르게 응답

---

## 7. 한 단계 더 — Tools 외에 Resources/Prompts 활용

### Resources — 파일이나 DB row 노출

```python
@mcp.resource("docs://{topic}")
def get_doc_resource(topic: str) -> str:
    """사내 문서 전문을 반환한다."""
    return DOCS_DB.get(topic, "")
```

모델은 이 리소스를 *필요할 때 직접 읽을 수 있습니다*. "결제 문서 전문 보여줘" 같은 요청에 적합합니다.

### Prompts — 재사용 가능한 프롬프트 템플릿

```python
@mcp.prompt()
def code_review(code: str) -> str:
    """주어진 코드를 리뷰하는 표준 프롬프트를 반환한다."""
    return f"""다음 코드를 리뷰해줘. 다음 관점에서 검토한다:
1. 버그 가능성
2. 가독성
3. 테스트 커버리지
4. 보안 이슈

코드:
```python
{code}
```"""
```

모델은 이 프롬프트를 호출해 *구조화된 리뷰 템플릿* 을 즉시 활용할 수 있습니다.

---

## 8. 마치며

MCP 서버를 직접 만드는 것은 **API 한 개를 더 만드는 것만큼 자연스러운 일**이 되고 있습니다. 사내에 *AI가 호출할 만한 도구* 가 늘어날수록, 에이전트가 할 수 있는 일이 기하급수적으로 늘어납니다.

핵심 흐름을 다시 정리합니다.

1. **`@mcp.tool()`** 데코레이터로 도구 등록
2. **Docstring 과 타입 힌트** 를 잘 작성 (모델이 이걸 보고 호출 결정)
3. **`mcp dev`** 로 단독 테스트
4. **`mcp_servers.json`** 에 절대 경로로 등록
5. **Claude Code** 안에서 자연어로 호출 확인

처음 한 번만 직접 만들어 보면, 이후로는 *반복 작업이 보일 때마다 "이거 MCP 서버로 감싸면 AI가 해주겠는데?"* 라는 생각이 자연스럽게 듭니다. 그게 Context Engineering이 강조하는 *도구화* 의 시작점입니다.

---

**관련 포스트:**

- [Smithery: 왜 써야 하고, 어떻게 MCP 서버를 자동 설치할까?]({% post_url 2026-05-11-smithery-mcp-registry %})
- [2026 AI 트렌드: LLM을 넘어 에이전틱 워크플로우로]({% post_url 2026-05-18-mcp-the-future-of-ai-tooling %})
- [Anthropic 공식 Skills 저장소]({% post_url 2026-05-07-anthropic-skills %})
- [AI 코딩 에이전트 CLI 설치 가이드 (Claude Code, Gemini, Codex, Ollama)]({% post_url 2026-05-07-ai-cli-tools-installation %})
- [Context Engineering — AI에게 무엇을 주고, 무엇을 뺄 것인가]({% post_url 2026-06-08-context-engineering %})
