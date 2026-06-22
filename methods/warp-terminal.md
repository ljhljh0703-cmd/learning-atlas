---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [warp, terminal, rust, ai-agent, productivity]
source: https://github.com/warpdotdev/warp
category: method
---

# Warp Terminal — 에이전틱 터미널 환경

*Warp*

[Warp은 터미널에서 태어난 '에이전틱 개발 환경'입니다. 단순히 명령어를 입력하는 창을 넘어, AI 에이전트가 내장되어 이슈 트리아지부터 코드 구현, PR 리뷰까지 자율적으로 수행할 수 있는 현대적인 워크스페이스를 지향합니다.]

---

## 한 줄 요약

> AI 에이전트(Warp AI)와 팀 협업 도구(Warp Drive)가 터미널 핵심 로직에 통합된 고성능 Rust 기반 현대적 터미널.

---

## 핵심 개념

### 1. Agentic Workflow (Oz Agents)
- 내장된 에이전트뿐만 아니라 **BYOA(Bring Your Own Agent)**를 지원하여 Claude Code, Codex, Gemini CLI 등을 터미널 내에서 자유롭게 활용할 수 있습니다.
- 'Oz 에이전트'는 이슈 분석, 사양 작성, 코드 구현 및 리뷰를 자율적으로 수행합니다.

### 2. Warp Drive
- 팀 단위로 자주 사용하거나 기억하기 어려운 명령어를 저장하고 공유할 수 있는 협업 레이어입니다.
- 개인의 노하우를 팀의 자산으로 즉시 전환할 수 있게 돕습니다.

### 3. Block-Based UI & Search
- 명령어 입력과 출력을 하나의 '블록' 단위로 취급하여, 결과값 내 검색, 복사, 공유가 매우 용이합니다.

---

## 기술 스택 / 사용법

- **언어**: 98.2% Rust (Tokio, NuShell, Alacritty 기반)
- **UI**: 자체 구축된 `warpui` 크레이트 및 WASM 활용 (웹에서도 터미널 세션 확인 가능)
- **AI**: GPT 모델 기반 (OpenAI 후원), `.agents/skills`를 통한 에이전트 능력 확장

### 주요 사용 패턴
*   **Warp AI 호출**: 터미널 내에서 자연어로 명령어 생성 및 에러 디버깅.
*   **Agent 작업 관찰**: `build.warp.dev`를 통해 에이전트의 작업 과정을 실시간으로 모니터링.

---

## Application: Evals Pipeline (OQ-004)

Warp 환경에서 Codex CLI를 활용하여 **on-device LLM 검증 자동화**를 수행합니다.

1.  **자동화된 검증**: Codex CLI가 작성한 코드가 `test-platform PlayMode`를 통해 실제 합격선에 도달했는지 Warp 블록 단위로 실행 및 모니터링합니다.
2.  **On-device 모델 측정**: HyperCLOVA X SEED 0.5B의 출력 결과가 `design-agenda` 토픽 10의 기준(자연도, 지연, 일관성)을 만족하는지 Warp AI를 통해 1차 스크리닝하고 로그를 Warp Drive에 박제합니다.
3.  **Next Action**: `W1-2 (~05-04)` 통합 시점에 Warp 내에서 `run_evals.sh`를 실행하여 fallback 여부를 최종 결정합니다.

---

## 내 생각 — AI NPC 관점

### 직접적 연결: [중간]

- **hwigi-tower** 개발 시, Codex CLI나 Gemini CLI를 Warp 내에서 실행하면 에이전트의 출력 결과를 블록 단위로 관리하고 팀원(또는 나중에 다시)과 공유하기 매우 좋습니다.
*   특히 에이전트의 실패 패턴을 Warp Drive에 기록해 두면 다음 세션에서 같은 실수를 반복하지 않도록 가이드할 수 있습니다.

### 개념적 수확

1. **Terminal as an Agentic Host**: 터미널은 단순한 I/O 창이 아니라, 에이전트가 서식하고 활동하는 '플랫폼'으로 진화하고 있습니다.
2. **BYOA 전략**: 특정 AI 모델에 종속되지 않고, 작업의 성격에 따라 최적의 에이전트(Codex, Claude 등)를 선택하여 사용하는 유연성.

### 블루프린트 연결

- **Layer 5 (서사 통합)**: Warp의 블록 공유 기능을 활용해 NPC와의 대사 로그 중 흥미로운 지점만 추출하여 `wiki/reflections`로 빠르게 옮기는 워크플로우를 구축할 수 있습니다.

---

## 열린 질문

- Warp의 WASM 기술을 활용해 게임 내 '콘솔창'을 웹이나 모바일 앱에서 원격으로 모니터링할 수 있을까?
- `.agents/skills` 구조가 Codex의 `.codex/skills`와 어떻게 상호 호환되거나 차별화되는가?

---

## 다음 학습 후보

- **[OpenAI Codex CLI — 로컬 에이전틱 코딩 엔진](openai-codex-cli.md)** — Warp 내에서 실행할 강력한 코딩 에이전트 중 하나.
- **NuShell (nushell.sh)** — Warp의 하단 로직에 영감을 준 데이터 중심 셸.
- **Wasm Runtime (Wasmtime)** — Warp의 웹 이식성을 가능케 하는 핵심 기술.

---

## 연결된 페이지

- [OpenAI Codex CLI — 로컬 에이전틱 코딩 엔진](openai-codex-cli.md)
- [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md)
