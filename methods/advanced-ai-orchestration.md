---
created: 2026-05-05
updated: 2026-05-05
type: learning
tags: [ai-orchestration, team-create, claude-code, ddd, workflow]
---

# 고성능 AI 오케스트레이션 및 명령 표준 (Advanced Orchestration)

본 문서는 [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) 및 `TeamCreate` 철학을 바탕으로, AI 에이전트 팀을 병렬로 운용하고 대규모 작업을 효율적으로 처리하기 위한 운영 표준입니다. 이 시스템은 [Plan-and-Execute](plan-and-execute-skill.md) 및 [Harness AI 스타터팩: 에이전트 설계 표준 (Starter Pack)](harness-starter-pack.md)과 상호 보완적으로 작동합니다.

---

## 1. 에이전트 팀 생성 및 운영 (TeamCreate)
복잡한 기능 구현 시, 단일 AI가 아닌 **특화된 전문가 팀**을 생성하여 병렬 리뷰 및 수정을 진행한다.

*   **스캐폴딩 원칙**: 필요한 파일/폴더 구조를 먼저 만들고 로직은 비워둔 상태에서 팀을 투입한다.
*   **전문가 팀 구성 예시**:
    1.  **팀원 1 (보안)**: API 키, XSS, 환경변수 안전성 검증.
    2.  **팀원 2 (성능)**: `use cache`, 리렌더링, 최적화 검증.
    3.  **팀원 3 (아키텍처)**: 의존성 방향(app→features→shared→ui), import 경로 검증.
    4.  **팀원 4 (기술)**: 가용 SKILL 탐색 및 적용.
*   **운영 규칙**: 
    - 각 팀원은 변경 전 **Plan Approval**을 반드시 받는다. (Missing Manual: 자율성의 경계 설정)
    - 작업이 끝난 팀원은 즉시 종료하여 토큰 소모 및 컨텍스트 혼선을 최소화한다.

---

## 2. 핵심 명령어 및 자율 운영 가드레일 (Missing Manual)
| 명령어 | 모드 | 설명 |
| :--- | :--- | :--- |
| `/re` | Research & Execute | 리서치 후 단독 구현 (솔로 모드) |
| `/ret` | Research & Execute as a Team | 큰 범위 작업을 위한 에이전트 팀 모드 |
| `/rr` | Review (Free) | GLM 4.7 Flash 등을 활용한 무료 코드 리뷰 |
| `/rrr` | Review (Deep) | 유료 모델을 활용한 고해상도 심층 리뷰 |
| `/cp` | Commit & Push | 현재 세션에서 변경된 파일만 안전하게 Push |
| `/simplify` | Review Parallel | 재사용성/품질/효율 3개 에이전트 병렬 리뷰 |
| `/batch` | Mass Migration | 5~30개 작업 분할, 병렬 마이그레이션 및 PR 생성 |

### 2.1 자율 운영을 위한 필수 가드레일
에이전트가 조직 규모의 작업을 수행할 때 발생할 수 있는 보안 및 운영 리스크를 사전 차단한다.
*   **환경 격리 (Secret Guard)**: `.env` 파일을 에이전트의 직접 읽기 범위에서 제외하거나, Secret Key 유출 방지를 위한 필터링 SKILL을 최우선 바인딩한다.
*   **자율성 임계치 (Decision Gate)**: 특정 예산 소모나 시스템 파괴적 변경 시 반드시 인간(CEO)의 컨펌을 거치는 `Human-in-the-loop` 게이트를 설정한다.
*   **Audit Logging**: 에이전트 팀의 모든 활동을 `progress.md`에 정밀 기록하여 사후 추적성을 확보한다.

---

## 3. 구조적 설계 (DDD & Phase)
AI의 컨텍스트 최적화와 할루시네이션 감소를 위해 **도메인 주도 설계(DDD)**를 채택한다.

*   **DDD 실천**: 유저/결제/주문 등 도메인별 분류, 모델/레포/서비스 계층화.
*   **작업 구조 (Documentation)**:
    - `requirements.md`: 무엇을 만들 것인가 (요구사항)
    - `plan.md`: 어떤 단계로 만들 것인가 (전략)
    - `progress.md`: 어디까지 했는가 (추적)
    - `CLAUDE.md`: 지켜야 할 규칙과 원칙 (컨벤션)

---

## 4. 토큰 절감 및 최적화 전략
*   **RTK (Reduce Token Kontext)**: 토큰 절감을 위한 상시 최적화 모드.
*   **Context Requires**: 프런트엔드 마크다운에 "컴포넌트 재사용" 명시하여 중복 코드 방지.
*   **Noisy Command 필터링**: 불필요한 출력 억제로 토큰 소모 최소화.
