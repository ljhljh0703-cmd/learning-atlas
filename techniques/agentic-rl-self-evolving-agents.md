---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [agentic-rl, self-evolving-agents, trajectory, atdp, control-plane, observability, rsi]
source: https://arxiv.org/pdf/2607.01120
authors: [Ran Yan, et al. (Ant Group / HKUST / Tsinghua)]
year: 2026
doi: arXiv:2607.01120
category: technique
---
<!-- 자기진화 에이전트를 "운영 시스템 문제"로 재정의한 논문(ATDP·Data Proxy·Control Plane 3기판). Sub-brain 관측·게이트 회로의 다음 단계 어휘. -->

# Agentic RL Self-Evolving Agents (arXiv 2607.01120)

Codex ③Gate PASS 2026-07-06(SHA 3/3·라인앵커 소스귀속). Ant Group/HKUST/Tsinghua position+architecture 논문.

## 0. 한 줄 결론

"self-evolving agent" = 모델이 제멋대로 자기개조하는 게 **아니라**, 서비스 trajectory를 관측·검열·재생·보상화한 뒤 **memory / skill / harness / tool schema / model weight / rollback / no-op** 중 *어느 표면*을 바꿀지 결정하는 **운영 시스템 문제**로 재정의. Sub-brain의 관측→게이트 회로(AgentSessionRecord·RETURN·③Gate·Hermes)를 정밀화할 어휘를 준다.

## 1. Thesis — deployment/improvement mismatch

production agent는 배포 시 frozen(LLM weight·system prompt·tool·harness). 하루에 수많은 trajectory를 만들지만 그게 자동으로 미래 개선으로 안 이어짐. 저자 정의: *self-evolving agent = 이전 situated experience로 미래 행동이 개선되는 deployed agent* — 단 unrestricted recursive self-modification이 **아니라** 관측→redaction→검증→attribution→**governed update 1종**으로 제한.

## 2. 3 Pillar

### Pillar 1 — ATDP (Agent Trajectory Data Protocol)
execution을 opaque trace가 아닌 **RL-step-grade typed event sequence**로. `e_t = <o_t 관측, h_t 내부/harness state, a_t action, y_t outcome, r_t reward, m_t metadata>`.
설계 원칙 6종: **decision-relevant bounded revelation**(CoT 전문 저장 X, credit assignment에 필요한 만큼만) · framework 초월 unification · credit assignability · **late-bound reward**(원인 record는 immutable, reward field는 나중 보강) · versioned replayability(model id만으론 부족 — harness/tool/index/guardrail/checkpoint) · governed observability(privacy·redaction·eligibility를 처음부터).

### Pillar 2 — Comprehensive Agentic Data Proxy
ATDP가 "무엇을 기록"이면 proxy는 "production에서 어떻게 포착". API gateway가 아니라 *production workload를 governed learning material로 바꾸는 장치*. **핵심 = agent 내부를 뜯지 말고 안정적 I/O 경계에서 잡기**(model call·tool call·retrieval·memory op·file/browser·human approval·final feedback). 명언: *"replay 불가한 trajectory는 신뢰할 학습데이터가 아니다."* replay 3분류 = deterministic / approximate / non-replayable. reward는 약하고 늦음(user reply·test failure·ticket reopen…) → 먼저 capture, 쓸지는 control plane이 결정.

### Pillar 3 — Agent Evolution Control Plane
"언제·어디를·어떻게 바꿀지" 결정 층. agent = `<π policy LLM, H harness, M memory, T tools, G governance>` composite policy. **Multi-surface adaptation(핵심 taxonomy)**:

| 실패 패턴 | intervention surface |
|---|---|
| 좁은 반복 누락 사실 | memory insertion |
| 특정 절차 실패 | skill patch |
| tool routing·retrieval format·guardrail·developer-msg 구조 | harness edit |
| tool arg/schema mismatch | tool schema edit |
| 다수 tenant/task 반복 broad failure | policy/model update |
| 새 update가 regression 유발 | rollback |
| 근거 부족·위험 과다 | **no-op** |

trigger = anecdote 아닌 **trajectory statistics**(evaluator score·correction rate·failure cluster·canary delta·cost/task·drift). 모든 intervention엔 promotion path(shadow eval·retrospective replay·offline regression·canary·rollback·differential monitoring).

**AReaL2.0** = 전체 substrate 아님. *deployed trajectory→online policy weight update* 가지만 구현(gateway로 inference backend만 교체, 나머지 agent service는 유지). 나머지 표면은 미구현 — 논문이 반복 명시.

## 3. Sub-brain 매핑 (실사용 레버)

| 현재 Sub-brain/Hermes | 논문식 확장 |
|---|---|
| raw session export | data proxy raw capture |
| AgentSessionRecord | ATDP trajectory summary + event stream |
| RETURN | gate handoff object |
| ③Gate | control-plane evaluation gate |
| Promote/Distill | memory/skill/harness/tool update 결정 |
| Curate | staged deployment + rollback |
| weekly digest | trajectory statistics / drift / recurrence detector |

**적용 후보(park — 자동채택 금지)**: RETURN/Gate에 `update surface`(memory/skill/harness/tool/model/rollback/no-op) + `trigger basis`(anecdote/recurrence/metric/correction) + `replay class` 항목. → [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) backlog. AI NPC trajectory·Codex event 로그도 같은 추상화 적용 가능.

## 4. Anti-Overclaim (게이트 가드)

- "self-evolving agent 완성" ✗ = architecture proposal + scoped prototype.
- "AReaL2.0이 모든 표면 다룸" ✗ = policy weight branch만.
- "trajectory 모으면 곧바로 RL" ✗ = redaction·eligibility·replay·governance가 먼저.
- "실패는 다 model update 문제" ✗ = 대부분 memory/skill/harness/tool/no-op에서 먼저 판단(model update = 최후 표면).
- "CoT 전문 저장 필요" ✗ = bounded revelation.

## 5. Delta vs 인접 노드

- [Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md) — 거시 "AI가 AI 개발" 거버넌스. 본 논문은 더 좁고 운영적인 *substrate*(다른 고도, cross-link만).
- [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) — 개인 지식브레인 운영. 본 논문은 agent service trajectory를 RL-grade substrate로. 수렴하나 역할 다름.
- exact duplicate 없음(`2607.01120`·`ATDP`·`AReaL2`·`Agentic Data Proxy`·`evolution control plane` vault 미보유).

**skill 후보** `agentic-rl-trajectory-intake`(park, needs approval). **후속 소스**: Agent Data Protocol(ADP) 비교 · AReaL original · AgentPRM · RLDS/D4RL trajectory standard.

## ACE context-as-ledger 델타 (2026-07-11, codex-gate — Lilian Weng)
<!-- lilian-weng "Harness Engineering for Self-Improvement"(lilianweng.github.io, 2026-07-04) MERGE. 대부분 red-queen N-3.5·본 노드 ATDP 중복, ACE 메커니즘만 신규. proposed_by: external_ai (via codex), 판정 by claude. -->
> Lilian Weng 종합(권위 소스, vault 첫 등장). 본 노드 ATDP는 *trajectory* 중심 — ACE는 *prompt-context mutation* 중심(신규 축):
- **Context-as-ledger** (ACE): 컨텍스트를 *stable ID 붙은 itemized bullet*로 → **결정론적 non-LLM merge**(grow-and-refine)로 갱신. LLM 재작성 아닌 delta 적용. bullet마다 helpful/harmful 카운터. `context_delta.tsv` 스키마.
- **동기**: full-rewrite 압축이 컨텍스트를 붕괴시킴 → ledger merge가 보존. (ACE 논문 "18,282→122 토큰 collapse" 인용 — ⚠ **Weng 글 아닌 ACE 원논문 arXiv 2510.04618 귀속·offline 미검증**.)
- 관계: [Red Queen Gödel Machine — 평가자까지 같이 진화시키는 자기개선](red-queen-godel-machine.md) N-3.5 frozen-anchor(중복 — held-out 승격)·agent-harness와 상보. context ledger = shepherd settlement의 컨텍스트판.
- **② Park**: `context_delta.tsv`/`failure_record.tsv` operating deltas = frozen set 생기기 전 evidence-free → Apply-trial 시. skill 기각(red-queen N-3.5 중복).
