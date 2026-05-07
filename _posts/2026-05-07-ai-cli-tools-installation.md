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
|---|---|
| Mac | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Mac (Homebrew) | `brew install claude-code` |
| Windows (PowerShell) | `iwr https://claude.ai/install.ps1 -useb \| iex` |
| Windows (WinGet) | `winget install Anthropic.ClaudeCode` |

> npm을 통한 설치(`npm install anthropic`)는 더 이상 권장되지 않습니다.

---

## Gemini CLI (Google)

| OS | 설치 방법 |
|---|---|
| Mac (Homebrew) | `brew install @google/gemini-cli` |
| Mac (MacPorts) | `port install @google/gemini-cli` |
| Mac/Windows (npm) | `npm install -g @google/gemini-cli` |

---

## OpenAI Codex CLI

- **GitHub:** [openai/codex](https://github.com/openai/codex)

| OS | 설치 방법 |
|---|---|
| Mac (Homebrew) | `brew install --cask codex` |
| Mac/Windows (npm) | `npm i -g @openai/codex` |
| Windows | WSL(Ubuntu) 환경에서 Node.js 설치 후 `npm i -g @openai/codex` 권장 |

---

## Ollama CLI

| OS | 설치 방법 |
|---|---|
| Mac/Linux | `brew install ollama` |
| Windows | [ollama.com](https://ollama.com) 에서 설치 파일 다운로드 |

---

## Copilot CLI (GitHub)

| OS | 설치 방법 |
|---|---|
| Mac/Windows (npm) | `npm install -g @github/copilot` |

---

## 기타 커뮤니티 CLI 도구

Node.js 환경에서 Mac/Windows 공통 설치 가능합니다.

| 도구 | 설치 명령어 |
|---|---|
| Amp CLI | `npm install -g amp-cli` |
| AI CLI | `npm install -g @justinhandley/ai-cli` |
