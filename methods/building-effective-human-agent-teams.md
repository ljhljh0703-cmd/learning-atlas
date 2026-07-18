---
created: 2026-06-26
updated: 2026-06-28
type: learning
tags: [AI, agent, collaboration, harness, anthropic]
source: https://claude.com/blog/building-effective-human-agent-teams
category: method
---

# Building Effective Human-Agent Teams — 인간-에이전트 협업 팀 구축 방법론

*Kristen Swanson (Anthropic Education Team)*

> ✅ **확정 (Confirmed 2026-06-28)**: 초안은 외부 AI(Antigravity)가 작성. 2026-06-27 vault Claude 출처 검증 + 2026-06-28 Codex 심층 재조사 → vault Claude 1차 출처(원문 전문) 대조 ③Gate 통과(주장 9건 전수 원문 일치, 환각 0건). 원문 실존(2026-06-24, Kristen Swanson). Multiplayer agents·Doer-Verifier·North Star·Roster·Lessons & Missteps 원문 일치. **단 "Attention Budgeting" 은 원문 미등장 — vault 조어(개념만 차용, 원문 근거 = 아래 §보강 communication hygiene + CLAUDE.md §5.6).** 헌법 이식 패치 → adopt-human-agent-teams-rules-2026-06-26 (archived, 일부 merged).

---

## 정직한 판단 (Honest Assessment)

| 질문 | 선택지 |
| :--- | :--- |
| **AI NPC blueprint 레이어** | 해당 없음 (인간-에이전트 협업/오케스트레이션 방법론) |
| **직접 적용 vs 개념 수확** | **직접 적용** 및 **개념 수확** (Sub-brain 운영 및 에이전트 하네스 구조 고도화에 즉시 적용 가능) |
| **시급성** | **지금 / 중기** (다중 AI 분업[당시 3-AI, 현행 2-AI] 및 에이전트 자율화의 정합성 확보를 위해 즉시 참고 필요) |

> [!NOTE]
> 본 연구는 게임 내 NPC 설계가 아닌, **생산성 및 소프트웨어 개발 도메인에서 인간과 다중 에이전트가 협업하는 아키텍처**를 다룹니다. 따라서 Tolaria Vault의 당시 3-AI(Claude-Gemini-Codex — 현행 2-AI Claude+Codex) 협업 구도와 에이전트 자율성 제어(Doer-Verifier)에 직결되는 실제적 교훈을 제공합니다.

---

## 한 줄 요약

> AI와 일하는 방식은 "싱글 플레이어(1인 1챗)"에서 동일한 워크스페이스 내에서 공동의 목표를 달성하기 위해 역할과 도구를 나누어 협업하는 "멀티플레이어(인간-에이전트 팀)" 게임 형태로 진화하고 있습니다.

---

## 핵심 개념

### 1. Multiplayer Agents (멀티플레이어 에이전트)
*   **정의**: 단일 사용자와의 1:1 채팅에 머물지 않고, 여러 명의 인간 팀원들과 동시에 상호작용하며 협업하는 AI 에이전트입니다.
*   **동작 환경**: 슬랙(Slack)이나 Claude Tag 등 협업이 이루어지는 실시간 공간에 직접 상주합니다.
*   **특성**: 
    *   인간 팀원에게 종속되지 않는 **독자적인 보안 크리덴셜(credentials)**을 가집니다.
    *   팀의 장기 목표를 달성하기 위해 튜닝되는 **지속성 메모리(persistent memory)**를 보유합니다.
    *   작업을 수행할 수 있는 다양한 **전문 스킬(skills)과 도구(tools)**를 갖추고 있습니다.

### 2. Work in Public & Clear Boundaries (공개 협업과 명확한 보안 경계)
*   에이전트의 상황 인지는 오직 **기록되고 검색 가능한 텍스트**(코드, 문서, 슬랙 채널, 회의록)에 의존합니다. "기록되지 않은 것은 존재하지 않는다"는 원칙이 지배합니다.
*   개별 문서 단위의 복잡한 공유 설정(결정 피로 야기) 대신, **워크스페이스 레벨의 명확하고 거시적인 보안 경계(security boundaries)**를 획정하여 에이전트에게 투명하게 맥락을 주입합니다.

### 3. Role Specialization & Roster (역할 전문화와 단일 명부 관리)
*   인간과 에이전트는 **동일한 명부(roster), 단일 산출물, 공통 협업 스레드**를 공유합니다.
*   에이전트들은 각각 고유한 역할(예: 데이터 분석, 디자인 표준 Enforcer, QA/테스트, 릴리스 매니저)을 부여받아 독립적인 스케줄로 작동하며, 인간은 고차원적인 전략을 수립하고 결과물을 검토합니다.

### 4. North Star Driven Proactivity (북극성 기반 주도성)
*   단순히 지시받은 태스크를 수동적으로 처리하는 것을 넘어, 비즈니스 미션과 연계된 **북극성(North Star) 장기 목표**를 에이전트와 공유합니다.
*   특정 권한을 위임받은 에이전트가 북극성 달성을 위해 **주도적으로 하위 프로젝트나 개선안을 제안(proactive proposal)**하도록 유도합니다.

### 5. Measured Autonomy & Verification (점진적 자율성과 검증 구조)
*   에이전트의 신뢰도(reliability) 실측 결과에 비례하여 자율성(autonomy)을 단계적으로 확장합니다.
*   결과물의 일관성을 유지하기 위해 자동화된 검증(테스트, 스타일 가이드 루브릭)을 적용하며, **"Doer-Verifier(실행자-검증자)"** 하네스 구조를 활용하여 결과물의 결함을 상호 교차 필터링합니다.

---

## 해결하는 문제 (선행 연구/전통적 방식의 한계)
1.  **컨텍스트 파편화**: 개별 팀원이 각자의 챗창에서 개인 AI 비서를 구동함으로써 발생하는 팀 내 지식 파편화와 중복 작업을 해결합니다.
2.  **수동적 도구 한계**: 인간이 매 턴 명령을 내릴 때만 동작하는 일회성 인터랙션의 한계를 극복하고, 에이전트가 독자적으로 백그라운드 스케줄에 따라 움직이며 주도적으로 제안하는 협업을 가능케 합니다.
3.  **판단 피로**: 공유 권한의 미세 제어(ACL)로 인한 인지 부하를 보안 경계의 일반화를 통해 제거합니다.

---

## 해법의 핵심 트릭 (Key Tricks)
*   **Doer-Verifier Pattern**: 한 에이전트에게 수행(Do)을 맡기고, 다른 에이전트에게 검증(Verify)을 맡기는 이중 구조를 슬롯화하여 품질 저하(drift)를 원천 차단합니다.
*   **Attention Budgeting (주의력 예산제)** ⚠️ *명칭은 vault 조어 — 원문 미등장*: 원문 표현은 "treat human attention as the scarce resource it is — batch questions into a single pass, repeat key context, limit how many things each human sees at once". 일부 팀은 *통신 batch/elevate 전담 에이전트* 또는 *일일 작업량 guardrail* 도 둠. **이 개념은 이미 CLAUDE.md §5.6 (Decision-Ask Batching, 🔒 2026-06-27 LOCKED) 으로 헌법 구현됨** — 재유도 말고 §5.6 참조.
*   **Lessons & Missteps Track**: 매주 에이전트가 자신의 실수와 배운 점을 정리한 주간 보고서를 작성하게 함으로써, 행동을 자가 교정하고 동일한 오류를 예방하도록 훈련합니다.

---

## 보강 — 운영 체크리스트 + Sub-brain 적용 (③Gate 2026-06-28, 원문 전문 대조)

### 원문 5문항 체크리스트 (§"Questions to ask")
인간-에이전트 팀 도입 전 자문. Sub-brain 디스패치·게이트 설계에 가장 재사용도 높은 부분.

1. 에이전트·인간이 필요한 정보/접근권이 **공개적이고 검색 가능**한가?
2. 팀 **roster(인간+에이전트)** 와 각자의 ownership 을 글로 쓸 수 있는가?
3. 각 역할이 직무에 필요한 **도구 권한**을 실제로 가지고 있는가?
4. 핵심 산출물을 검증할 **rubric/test** 가 있는가?
5. 모두가 참조할 **North Star** 가 문서화돼 있는가?

### Sub-brain 적용 규칙
- **Autonomy Ledger** — 자율성은 에이전트 단위 총점이 아니라 **task type 별 earned autonomy** 로 관리(원문 line 296–297 "which kinds of tasks each agent has earned autonomy on... per task type"). 예: 문서 요약 PASS 5회 ≠ 코드 변경 자동 승인. `Proof-ready` 가 general acceptance 를 함의하지 않음 — 레인마다 게이트 이력 별개.
- **Model-change retest** — 모델·도구·권한 레이어가 바뀌면 기존 skill/prompt/gate 를 그대로 신뢰 말고 대표 task 재실행(원문 line 271–274). 더 똑똑한 모델엔 낡은 guardrail 이 창의적 해결을 막을 수 있음. 모델을 스왑하는 vault 에 직결(당시 로스터 Claude/Gemini/Codex — 현행 Claude/Codex).
- **Human-only decision boundary** — 에이전트는 backlog triage·complexity scoring·medium/low 변경을 맡되, **hard tradeoff·owner 없는 결정은 인간에게 직접 상신**(원문 line 307–310). Sub-brain: 외부 AI 가 gate evidence 를 만들어도 `accepted` 판정은 작가 verdict.
- **Roster = 역할 + memory + credentials/tool + scope + verification** — roster 항목을 "에이전트 이름"이 아니라 5요소로 정의(원문 line 161–166: 데이터분석=BigQuery, QA=Playwright MCP, 복잡도↑ 시 release manager 추가, 코드유지=triage/planning/coding/review/reporting 분할).
- **Communication hygiene** — 질문 batch + 핵심 맥락 반복 + 인간이 한 번에 보는 항목 수 제한. **단 이건 CLAUDE.md §5.6 (Decision-Ask Batching) 으로 이미 헌법 구현** — 재유도 X, §5.6 참조.

### 단일작가 vault caveat (원문은 enterprise/team 지향)
직접 이식 가능: searchable artifacts · 명확 roster · 역할/도구 매칭 · task-type autonomy ledger · Doer-Verifier · decision-ask batching.
**직접 이식 금지**: ① 일일 작업량 cap(단일작가 vault 부적합, §5.6 도 미도입 명시) ② 회사 전체 public default ③ *외부 AI 의 주간 자가회고* — Sub-brain 은 회고/승격 분석을 vault Claude 단독 권한으로 유보(Dual-Track Protocol).

---

## 내 생각 — AI NPC 및 Sub-brain 관점

### 직접적 연결: [높음]
*   **다중 AI 협업 모델의 정당성 확보**: Anthropic이 실증한 "인간-에이전트 단일 명부와 역할 특화"는 흡수 당시(2026-06) Tolaria Vault가 추구하던 `Claude(두뇌/감독) - Gemini(손발) - Codex(실행)` 3-AI 분업 구조와 궤를 같이했습니다(현행 = Claude+Codex 2-AI — 원리는 유지).
*   **Doer-Verifier의 정교화**: `workflows/dual-track-review.md`에 명시된 외부 AI의 작업물 반영 가드 및 `dispatch-builder` 내의 `done-gate` 검증 로직은 Anthropic의 Doer-Verifier 철학과 일치합니다.
*   **주의력 보호의 중요성**: 에이전트가 사용자에게 과도한 질문이나 컨텍스트 노이즈를 유발하지 않도록 "질문을 일괄 배치 처리"하고 "가장 임팩트 있는 이슈만 상신"하는 통신 가이드라인은 향후 다중 AI 협업 시 반드시 반영해야 할 메타 규칙입니다.

### 개념적 수확
1.  **명부(Roster)의 명시적 정의**: 에이전트가 자신이 맡은 역할과 책임 범위를 명확히 인식하게 하는 `skill.md` 기반의 스코프 정의가 에이전트 수의 확장에 따른 혼란을 방지하는 핵심 열쇠임을 확인하였습니다.
2.  **공개 문서화의 중요성 (No-Context Cave)**: 에이전트의 지능은 전적으로 '접근 가능한 텍스트'의 양과 질에 비례하므로, Sub-brain 내부의 SSOT 문서와 progress 로그 관리가 에이전트 성능의 절대적 천장(ceiling)을 결정한다는 점을 재확인하였습니다.

### 블루프린트 연결
*   **Layer 5 (Orchestration & Governance)**: 다중 AI 협업 시 에이전트가 인간의 한정된 주의력을 갉아먹지 않도록 통신을 배치화(batching)하고 게이트를 두는 'Attention-aware Router' 로직 설계에 반영 가능합니다.

---

## 열린 질문
*   멀티플레이어 에이전트가 다수의 인간과 동시에 슬랙에서 소통할 때, 인간 간의 의견 충돌(A 팀원은 X를, B 팀원은 Y를 지시)이 발생할 경우 에이전트는 어떤 합의(Consensus) 알고리즘이나 거버넌스 룰을 통해 이를 중재해야 하는가?
*   Doer-Verifier 구조에서 Verifier 자체가 환각(hallucination)을 일으켜 올바른 작업을 반려하거나, 혹은 잘못된 작업을 통과시키는 '공동 실패(Collusion/Shared Failure)' 시나리오를 어떻게 정량적으로 제어할 것인가?

---

## 다음 학습 후보
*   **[Doer-Verifier Agent Harness Design](https://www.anthropic.com/engineering/harness-design-long-running-apps)** — Anthropic이 제시하는 장기 실행 앱을 위한 구체적인 하네스 구조와 검증 루브릭 설계법 학습.
*   **[Equipping Agents with Real-World Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)** — 에이전트가 독자적 크리덴셜과 도구를 가지고 실무를 수행할 때 필요한 skill file 설계 표준 학습.
*   **[Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)** — 에이전트에게 방대한 정보 중 핵심 컨텍스트만 정교하게 필터링하여 토큰 효율을 극대화하는 기법 연구.

---

## 연결된 페이지

*   agent-harness — 에이전트 하네스 설계 표준
*   [GOAL 프레임워크와 에이전트 OS 아키텍처 (GOAL Framework & AIOS)](goal-framework-ops.md) — GOAL 프레임워크 운영 규칙
*   [Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](kuku-second-brain.md) — 에이전트 거버넌스 및 E2EE 지식베이스
*   adopt-human-agent-teams-rules-2026-06-26 — 헌법 및 하네스 이식 패치 (archived, 일부 merged)
