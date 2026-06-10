---
layout: post
title: "AI 코딩 에이전트 CLI 설치 가이드 (Claude Code, Gemini, Codex, Ollama)"
categories: onboarding
tags: [Claude Code, Gemini CLI, OpenAI Codex, Ollama, 설치]
date: 2026-05-07 13:06:00 +0900
excerpt: "주요 AI 코딩 에이전트 CLI 도구들의 Mac/Windows 설치 방법을 한곳에 정리합니다."
---

## Claude Code (Anthropic)

- **공식 문서:** [code.claude.com/docs](https://code.claude.com/docs/en/overview)
- **GitHub:** [anthropics/claude-code](https://github.com/anthropics/claude-code)

| OS | 설치 방법 |
| --- | --- |
| Mac | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Mac (Homebrew) | `brew install claude-code` |
| Windows (PowerShell) | `iwr https://claude.ai/install.ps1 -useb \| iex` |
| Windows (WinGet) | `winget install Anthropic.ClaudeCode` |

> npm을 통한 설치(`npm install -g @anthropic-ai/claude-code`)는 더 이상 권장되지 않습니다.

---

## Gemini CLI (Google)

| OS | 설치 방법 |
<<<<<<< ours
|---|---|
| Mac (Homebrew) | `brew install gemini-cli` |
=======
| --- | --- |
| Mac (Homebrew) | `brew install @google/gemini-cli` |
>>>>>>> theirs
| Mac (MacPorts) | `port install @google/gemini-cli` |
| Mac/Windows (npm) | `npm install -g @google/gemini-cli` |

---

## OpenAI Codex CLI

- **GitHub:** [openai/codex](https://github.com/openai/codex)

| OS | 설치 방법 |
| --- | --- |
| Mac (Homebrew) | `brew install --cask codex` |
| Mac/Windows (npm) | `npm i -g @openai/codex` |
| Windows | WSL(Ubuntu) 환경에서 Node.js 설치 후 `npm i -g @openai/codex` 권장 |

---

## Ollama CLI

| OS | 설치 방법 |
| --- | --- |
| Mac/Linux | `brew install ollama` |
| Windows | [ollama.com](https://ollama.com) 에서 설치 파일 다운로드 |

---

## Copilot CLI (GitHub)

| OS | 설치 방법 |
| --- | --- |
| Mac/Windows (npm) | `npm install -g @github/copilot` |

---

## 기타 커뮤니티 CLI 도구

Node.js 환경에서 Mac/Windows 공통 설치 가능합니다.

| 도구 | 설치 명령어 |
| --- | --- |
| Amp CLI | `npm install -g amp-cli` |
| AI CLI | `npm install -g @justinhandley/ai-cli` |

---

**관련 글**

- [Claude Code 필수 지식 정리 — 13분 영상으로 입문하고, 핵심만 다시 짚기]({% post_url 2026-06-09-claude-code-essentials-20 %}) — 설치 후 Claude Code 입문 핵심 정리
- [클로드 스킬, 서브에이전트, 커맨드 개념 한번에 이해하기]({% post_url 2026-05-07-claude-skill-subagent-command %}) — 설치 후 알아야 할 핵심 개념
- [Ollama: 왜 로컬 LLM을 써야 하고, 어떻게 시작할까?]({% post_url 2026-05-11-ollama-local-llm %}) — Ollama로 로컬 LLM 시작하기
- [AGENTS.md — Claude Code·Codex·Gemini CLI를 관통하는 공통 설정 표준]({% post_url 2026-06-10-agents-md-cross-tool-standard %}) — 설치 후 도구 공통 설정 파일 표준
