---
created: 2026-06-13
updated: 2026-06-13
type: learning
tags: [goal-framework, agentic-os, aios, scaffolding, swarm-architecture, agent-harness]
category: method
---

# GOAL 프레임워크와 에이전트 OS 아키텍처 (GOAL Framework & AIOS)

> ⚠️ **임시(provisional)** — Gemini 영상 해체분석 기반. 작가 명시 컨펌 전. 방법론(§2~4)은 흡수 가치 확정, 출처는 영상 1건.

> **한줄**: Fable 5 추론 역량을 극대화하기 위해 고안된 '목표 지향형' 제어 프레임워크(GOAL) 및 동적 스웜(Swarm) 아키텍처의 설계 명세.
> **핵심 사상**: 세부 명령(Orders) 대신 목표(Outcome)와 제약(Guardrails)을 주어 인간의 인지적 한계를 뛰어넘는 최적의 자율 실행 경로를 탐색함.

---

## 1. 에이전트 OS (AIOS) 데이터 흐름 및 파이프라인

영상에 제시된 AIOS는 고도화된 콘텍스트 접지(Grounding)와 비동기 백그라운드 자동화를 결합한 형태의 업무 프레임워크입니다.

### 1) I/O 흐름 및 구조
*   **입력 레이어**: 로컬 시스템 폴더(AIOS 코드)와 옵시디언 볼트(Obsidian Vault) 내의 사용자 핵심 지식(성공 사례, 오퍼 명세, 오디언스 분석 등)을 원천 데이터로 삼음.
*   **오케스트레이션 레이어**: 최상단의 Orchestrator 에이전트가 작업을 수령하고 분배를 총괄함.
*   **실행 레이어 (Sub-agents)**: 주 작업용 에이전트들이 스폰되어 데이터 매핑 및 실제 코드 작성을 수행함.
*   **검증 레이어 (Checker agents)**: 결과물의 품질과 기준 부합 여부를 검사하기 위해 3선 디스패치 형태로 구동됨.
*   **출력 레이어**: 브라우저 내의 실제 패널이나 슬라이드 오버(slide over) 형태로 연동되어 '콘텐츠 카드' 및 UI 아티팩트를 매일 밤 백그라운드 스케줄러로 비동기 갱신함.

---

## 2. GOAL 프레임워크 규격 및 단계별 제어 프롬프트

### 1) GOAL 4대 원칙의 정의
*   **G (Ground everything in truth)**: 추론 시작 전, 로컬 지식(Obsidian)과 실제 데이터를 완벽하게 읽고 매핑하도록 강제함.
*   **O (Outcome not orders)**: 모호한 지시 대신 테스트 가능하고 구체적인 완료 조건(Finish Line)을 정의함.
*   **A (Autonomy over the path)**: 도구 선택, 파일 수정 경로 등 상세 실행 로직을 에이전트의 판단에 완전히 위임함.
*   **L (Loop in proof)**: 자율 실행 과정이 탈선하지 않도록 Before & After 시각적 검증 및 실데이터 테스트 피드백 루프를 배선함.

### 2) 단계별 게이트(Gate) 및 제어 프롬프트 지시어

| 단계 | 진입 조건 (Entry Gate) | 검증 및 진출 조건 (Exit Gate) | 가드레일 지시어 (Prompt Guardrails) |
|---|---|---|---|
| **G (Ground)** | Obsidian Vault 경로 및 시스템 폴더 정보 전달. | 타겟 폴더 내 모든 소스 파일에 대한 에이전트의 구조 파악 및 인덱싱 완료. | `"read all of it yourself before asking anything"` |
| **O (Outcome)** | 명확한 완료 조건 미비 시, 에이전트가 사용자에게 직접 역면접(Interview) 수행. | 5~7개 문항 이하의 인터뷰 완료 및 구체적인 성공 기준(Acceptance Criteria) 확정. | `"ask me one question at a time"`, `"keep the interview short five to seven questions then stop"` |
| **A (Autonomy)** | 진실성 데이터 및 합의된 성공 기준 확보. | 파일 수정 범위와 구체적인 실행 계획안(Diff draft) 수립. | `"figure out the layout and the words yourself don't ask me"` (단, 파괴적 결정은 보류) |
| **L (Loop)** | 코드 작성 및 로컬 렌더링/빌드가 시도되는 시점. | 실제 데이터 기반의 테스트 결과 및 Before & After 시연 성공. | `"check in with me before any big or hard to undo decisions"`, `"show me before and after"` |

---

## 3. 기존 Sub-brain 대비 개념적 맹점 및 보완 설계

영상에 제시된 시스템은 매력적이나, 안전성 관점에서 두 가지 치명적인 결함이 존재하므로 Sub-brain 이식 시 보완이 필수적입니다.

### 맹점 1: 자기 평가 루프의 오류 (Self-Evaluation Blind Spot)
*   **위험성**: Orchestrator가 Sub-agent를 검증하기 위해 하위에 Checker 에이전트를 자율적으로 스폰하는 구조는, 에이전트 내부의 동일한 논리적 결함(Bias)이 검증 단계에도 투영되어 오류를 '성공'으로 오분류하는 할루시네이션 루프(Hallucination loop)에 빠질 수 있음.
*   **보완 설계**: Checker 에이전트의 판단 결과는 최종 반영(Commit/Merge) 단계 직전에 반드시 **인간의 확인(HITL Staging Gate)** 또는 하드코딩된 정적 린터(Linter)의 통과를 필수 조건으로 제약함.

### 맹점 2: 최소 권한 원칙(Least Privilege) 위반
*   **위험성**: "레이아웃과 단어는 직접 알아서 하고 나에게 묻지 마라"는 무제한적 쓰기 자율성은 운영체제의 코어 지침이나 권한 밖의 핵심 시스템 파일을 임의로 변형하는 심각한 오염을 유발할 수 있음.
*   **보완 설계**: 외부 에이전트(Codex 등)가 접근할 수 있는 경로를 엄격히 제한하고, 변경된 이력을 실시간으로 추적하는 이원화 기록 프로토콜(Dual-logging) 및 섀도우 볼트(Shadow Vault) 메커니즘을 배선함.

---

## 4. Sub-brain 에이전트 하네스(harness)에 차용할 3대 기여 포인트

1.  **3심제 위계 구조 (Hierarchical Swarm)**: 작업을 분배하는 Orchestrator, 실제 작업을 이행하는 Sub-agents, 독립된 컨텍스트에서 오직 검증만 전담하는 Checker agents의 위계를 스캐폴딩에 도입하여 병렬 처리와 객관적 검증 능력을 높임.
2.  **초기 역면접(Reverse-Interview) 초기화 패턴**: 작업을 지시할 때 에이전트가 "한 번에 하나씩, 최대 5~7개"의 핵심 질문을 통해 사용자의 암묵적 요구사항을 테스트 가능한 명세로 컴파일하고, 이를 단일 '마스터 프롬프트(master prompt)'로 출력하여 승인을 받는 인터뷰 루프를 도입함.
3.  **옵시디언 볼트를 활용한 진실 접지 (Absolute Grounding)**: 에이전트의 작동 지식을 외부의 불확실한 웹 정보나 학습 데이터에 의존하지 않고, 로컬 지식 그래프(Obsidian Vault) 내의 검증된 텍스트 자산만을 절대적인 진실 공급원(SSOT)으로 규정하여 읽게 강제함으로써 할루시네이션을 최소화함.
