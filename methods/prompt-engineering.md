---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [prompt-engineering, cookbook, patterns, skills]
category: method
---

# Prompt Engineering Pattern Library (Hub)

> **Philosophy**: "The model is not the bottleneck; the prompt is." (Khairallah)
> 모델에 종속되지 않는 **범용 프롬프트 기술 아카이브**. 상황별 최적의 패턴을 수집하고, 향후 독립적인 'Skill'로 빌드업하여 외부 공유를 목표로 함.

---

## 1. 아키텍처 및 철학 (Patterns)

| 카테고리 | 설명 | 패턴 목록 |
|----------|------|-----------|
| **Orchestration** | 에이전트의 사고 흐름 및 위임 제어 | [Pattern: Agent Brief Governance (AGENTS.md)](prompt-pattern-agent-brief-governance.md), [Pattern: Multi-Agent Audit (병렬 위임 감사)](prompt-pattern-multi-agent-audit.md) |
| **Reasoning** | 논리적 추론 및 문제 해결 능력 강화 | [Pattern: Outcome-First (결과 중심 정의)](prompt-pattern-outcome-first.md) |
| **Constraints** | 출력 형식 및 보안 가드레일 | [Pattern: Structured Output Gate (구조화 출력 게이트)](prompt-pattern-structured-output-gate.md) |
| **Persistence** | 세션 간 상태 및 기억 유지 | [Pattern: State Serialization (상태 직렬화 매니페스트)](prompt-pattern-state-serialization.md) |
| **Consistency** | 캐릭터 및 자산의 시각적/서사적 일관성 | [Pattern: Visual Anchor Consistency (비주얼 앵커 일관성)](prompt-pattern-visual-anchor.md) |
| **Persona/Standard** | 역할 정의 및 표준 프레임워크 | **[Pattern] Khairallah 6-Elements** |

### 1.1 주요 패턴 상세

#### **[Pattern] Khairallah 6-Elements**
모든 고해상도 프롬프트 작성을 위한 표준 6요소 프레임워크입니다.
1.  **Role**: 에이전트에게 부여할 구체적인 전문가 페르소나 (예: "Senior Agentic Architect")
2.  **Context**: 작업의 배경, 목표, 현재 상태 및 사용 가능한 리소스
3.  **Task**: 수행해야 할 명확하고 행동 중심적인 작업 지시
4.  **Format**: 결과물의 구조 및 형식 (예: Markdown, JSON, 특정 파일 템플릿)
5.  **Constraints**: 반드시 지켜야 할 규칙, 금지 사항, 보안 가드레일
6.  **Few-Shot**: 에이전트의 이해를 돕기 위한 실제 예시(Input-Output 쌍)

---

## 2. Skill 빌드업 로드맵

1.  **Phase 1: Archive** — 개별 패턴을 위키에 기록 및 프로젝트 적용 검증
2.  **Phase 2: Template** — 패턴들을 묶어 `SKILL.md` 포맷으로 구조화
3.  **Phase 3: Export** — 외부 LLM/에이전트(Codex, Claude Code 등)가 즉시 로드 가능한 라이브러리 형태로 배포

---

## 3. 관련 학습 (Sources)

- [GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅](openai-prompt-guidance-gpt55.md) — 결과 중심 패러다임
- [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md) — 에이전트 실행 규약
- [claude-ads — 전문 광고 감사/전략 에이전트 스킬](claude-ads.md) — 3계층 위임 구조
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — 행동 overlay 패턴

---

## 연결된 페이지

- index
- log
