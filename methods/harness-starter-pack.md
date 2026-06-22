---
created: 2026-05-05
updated: 2026-05-05
type: learning
tags: [ai-architecture, agent-orchestration, harness, workflow]
---

# Harness AI 스타터팩: 에이전트 설계 표준 (Starter Pack)

본 문서는 `revfactory/harness`의 핵심 철학을 바탕으로, 새로운 프로젝트나 복잡한 AI 작업을 설계할 때 필수적으로 검토해야 할 **에이전트 아키텍처 스타터팩**입니다. [고성능 AI 오케스트레이션 및 명령 표준 (Advanced Orchestration)](advanced-ai-orchestration.md) 및 [Plan-and-Execute](plan-and-execute-skill.md)의 상위 설계 가이드라인 역할을 하며, [Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md)의 자율성 철학과 [MiroFish + OASIS — 거대 시뮬레이션 세계 reference architecture](../techniques/mirofish-oasis.md)의 시뮬레이션 비전을 구체화하는 토대입니다.

---

## 1. 하네스 설계 4대 원칙 (Core Pillars)

1.  **메타 레이어 (Meta-Factory/CEO-Executives)**: 문제를 직접 풀기 전에, "이 문제를 풀기 위한 최적의 팀 구조와 스킬은 무엇인가?"를 먼저 설계한다. 단일 작업 단위를 넘어 조직 운영 관점(Zero-Headcount Company)의 CEO-Executive Team 아키텍처를 지향한다.
2.  **패턴 기반 협업 (Pattern-based)**: 단순 프롬프팅 대신 6가지 협업 패턴(Expert Pool, Producer-Reviewer, CEO-Executives 등) 중 하나를 명시적으로 선택한다.
3.  **점진적 노출 (Progressive Disclosure)**: 모든 정보를 한꺼번에 주지 않는다. 필요할 때만 호출할 수 있는 **스킬(Skill/Tool)** 단위로 정보를 쪼개어 컨텍스트를 최적화한다.
4.  **피드백 루프 (Evolutionary Growth)**: 작업 완료 후 실제 결과와 설계의 차이(Delta)를 기록하여 다음 세션의 하네스를 강화한다.

---

## 2. 프로젝트 유형별 하네스 추천 (Recommendation Logic)

| 프로젝트 성격 | 추천 패턴 | 핵심 스킬(Skill) 구성 |
| :--- | :--- | :--- |
| **전문 연구/조사** | Expert Pool + Pipeline | `fetch_source`, `analyze_delta`, `synthesize_report` |
| **콘텐츠 제작/코딩** | Producer-Reviewer | `draft_content`, `lint_checker`, `consistency_verify` |
| **복잡한 의사결정** | Supervisor + Fan-out | `decompose_task`, `parallel_eval`, `merge_decision` |
| **대규모 데이터 정리** | Hierarchical Delegation | `recursive_split`, `summarize_chunk`, `update_graph` |
| **조직/비즈니스 자동화** | CEO-Executives Orchestration | `market_research`, `ops_automation`, `dev_deploy`, `secret_guard` |

---

## 3. 필수 세팅 체크리스트 (Initial Setup)

- [ ] **에이전트 역할 정의**: 누가(Who) 무엇을(What) 담당하는가? (Single Responsibility)
- [ ] **협업 패턴 명시**: 어떤 순서와 논리로 소통하는가?
- [ ] **도구(Skill) 바인딩**: 에이전트가 사용할 수 있는 전용 도구는 무엇인가?
- [ ] **검증 프로토콜**: "성공"의 기준은 무엇이며, 누가 검토하는가?

---

## 4. 진화(Evolution) 프로토콜
작업이 끝날 때마다 다음을 기록한다:
*   "이번 설계에서 부족했던 점은?"
*   "다음에는 어떤 에이전트/스킬이 추가되어야 하는가?"
*   이 피드백은 즉시 해당 프로젝트의 `AGENTS.md`나 하네스 설정에 반영한다.
