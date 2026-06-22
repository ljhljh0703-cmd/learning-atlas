---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [codex, cli, rust, agents, workflow]
source: https://github.com/openai/codex
category: method
---

# OpenAI Codex CLI — 로컬 에이전틱 코딩 엔진

*OpenAI*

[OpenAI Codex CLI는 로컬 환경에서 실행되는 터미널 기반 코딩 에이전트입니다. 단순한 코드 완성을 넘어, 로컬 파일을 읽고 셸 명령을 실행하며 Git 워크플로우를 관리하는 'Peer Programmer' 역할을 수행합니다.]

---

## 한 줄 요약

> 사용자의 로컬 컨텍스트를 완벽히 파악하고 **Research -> Plan -> Execute** 루프를 자율적으로 수행하는 터미널 특화 에이전트.

---

## 핵심 개념

### 1. Research -> Plan -> Execute 루프
- 단순히 코드를 짜는 것이 아니라, 먼저 환경을 **조사(Research)**하고, 수행할 단계를 **계획(Plan)**한 뒤, 실제로 **실행(Execute)**합니다.
- `update_plan` 도구를 통해 현재 진행 상황을 추적하며 장기 작업을 수행합니다.

### 2. .codex/skills (모듈형 능력)
- 특정 도메인(React, Rust, Unity 등)에 특화된 지침이나 지식을 별도의 'Skill' 파일로 분리하여 관리할 수 있습니다.
- 거대한 단일 프롬프트 대신, 필요할 때마다 필요한 기술을 로드하는 구조입니다.

### 3. AGENTS.md 기반 거버넌스
- 프로젝트 루트의 `AGENTS.md`를 읽어 프로젝트 특화 컨벤션, 아키텍처 패턴, 선호 도구를 파악합니다.
- 시스템 프롬프트와 사용자 지침 사이의 'Project-Specific DNA' 역할을 합니다.

---

## 기술 스택 / 사용법

- **언어**: Rust (고성능 로컬 실행)
- **빌드 시스템**: Bazel
- **주요 도구**:
  - `apply_patch`: Responses API 내장 diff 포맷으로 파일 수정.
  - `shell_command`: 로컬 터미널 명령 실행.
  - `rg` (ripgrep): 초고속 파일 검색 및 탐색.

### 기본 사용 패턴
```bash
# 특정 작업 지시
codex "Fix the failing tests in src/auth"

# 코드 리팩토링 및 검증
codex "Refactor the memory management in Layer 3 and verify with tests"
```

---

## 내 생각 — AI NPC 관점

### 직접적 연결: [중간]

- AI NPC 자체의 로직보다는, **AI NPC를 개발하는 작가의 도구**로서의 가치가 압도적입니다.
- 하지만 Codex CLI의 `skills` 구조와 `Research-Plan-Execute` 루프는 NPC의 'Thinking Loop' 설계에 직접적인 영감을 줄 수 있습니다.

### 개념적 수확

1. **에이전트 거버넌스 (AGENTS.md)**: AI에게 모든 것을 가르치려 하지 말고, "우리 프로젝트만의 독특한 규칙"만 전달하는 효율적인 협업 방식.
2. **도구의 위계**: `apply_patch`와 같은 구조화된 편집 도구가 단순 텍스트 덮어쓰기보다 훨씬 안전하고 토큰 효율적임.

### 블루프린트 연결

- **Layer 5 (서사 통합)**: 개발 단계에서 Codex CLI를 사용하여 NPC의 대사 데이터셋을 대량 생성하거나 검증하는 파이프라인 구축 가능.

---

## 열린 질문

- `.codex/skills`를 사용하여 NPC의 페르소나별 'Voice Skill'을 로컬에서 미리 테스트해 볼 수 있을까?
- Bazel 빌드 시스템이 대규모 NPC 시뮬레이션 환경 구축에 필수적일까?

---

## 다음 학습 후보

- **[Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md)** — Codex CLI를 최적으로 다루는 프롬프팅 기법 (이미 학습됨)
- **Aider (aider.chat)** — Codex CLI와 유사한 오픈소스 에이전틱 에디팅 도구 비교
- **MCP (Model Context Protocol)** — 에이전트에게 더 많은 로컬 도구를 연결하는 표준 규약

---

## 연결된 페이지

- [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md)
- hwiglija-tower-AGENTS
- hwiglija-tower-progress
