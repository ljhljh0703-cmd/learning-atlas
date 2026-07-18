---
created: 2026-07-13
updated: 2026-07-13
type: learning
category: technique
tags: [agent-evaluation, goal-plan-action, trace, observability, hermes-loop, ai-npc]
source: https://arxiv.org/html/2510.08847v2
authors: [Allison Sihan Jia]
year: 2025
doi: arXiv:2510.08847
title: "Agent GPA — Hermes·Agent Harness·AI NPC에 factorized trace diagnosis를 붙이는 법"
---
<!-- Agent GPA 논문 해체 — 실패를 Goal–Plan–Action 교차축으로 분해·span 귀속하는 진단층. Hermes 토대설=unverified 교정, factorized judge 계약이 실제 델타. -->

# Agent GPA — Hermes·Agent Harness·AI NPC에 factorized trace diagnosis를 붙이는 법

> **흡수 결론:** 이 논문은 공개 근거상 Hermes의 토대 논문으로 확인되지 않는다. 그러나 Sub-brain이 이미 가진 Hermes Loop의 Gate, Agent Harness의 검증 계약, NPC Eval의 다중 judge 위에 **“실패를 Goal–Plan–Action 교차축으로 분해하고 정확한 trace span에 귀속하는 진단층”**을 추가하는 데는 직접적으로 유용하다.
>
> **상단 경고:** 논문의 “95%”는 agent 성공률이나 evaluator 정확도가 아니다. 6개 전문 judge의 합집합이 TRAIL/GAIA test의 기존 human-labeled error 281개 중 267개를 찾은 **error recall 95.0%**다. 제목의 Goal Fulfillment는 정의만 제시되고 핵심 실험에서는 검증되지 않았다.

## 주장 상태표

| 주장 | 판정 | 근거 |
|---|---|---|
| 논문은 Goal–Plan–Action 교차 실패를 전문 judge들로 분해한다 | **verified** | arXiv v2 본문·Appendix prompt·표 교차 확인 |
| 6개 judge union이 TRAIL/GAIA test 오류 267/281을 식별했다 | **source-reported + 계산 검산** | 267/281 = 95.02% |
| 정확한 span ID localization은 241/281이었다 | **source-reported + 계산 검산** | 241/281 = 85.77% |
| Agent GPA가 Hermes의 역사적·학술적 토대다 | **unverified / 공개 계보 불일치** | 논문에 Hermes·Nous 인용 없음, Hermes 공식 repo/docs에 paper ID·Agent GPA 인용 없음; Hermes 최초 공개 commit은 2025-07-23, paper v1은 2025-10-09 |
| Agent GPA 구현은 전부 미공개다 | **false** | Snowflake가 TruLens OSS 제공을 명시하고 현재 evaluator template·notebook 공개 |
| 논문 표를 그대로 재현하는 전처리/experiment bundle과 재주석 데이터도 공개됐다 | **not found** | 논문은 공개 계획을 적었으나 공식 replication bundle·augmented TRAIL/GAIA 공개처를 찾지 못함 |
| AI NPC에 효과가 검증됐다 | **unverified** | 논문이 embodied agents를 future work로 명시 |

**Contradiction:** “Hermes의 토대”라는 전달 주장과 공개 논문·공식 Hermes 계보가 일치하지 않는다. 미공개 초안 공유나 간접 영향까지 부정할 수는 없으므로 “거짓”으로 단정하지 않고 **unverified**로 유지한다.

---

## 1. Fetch — 원문 확보와 충실도

원문은 요약 페이지가 아니라 세 형태로 확보했다.

| 원본 | 크기 | SHA-256 |
|---|---:|---|
| arXiv HTML v2 | 4,788,956 bytes | af316821336c44219672abb6d4588b41a878a3b7ec5987270960a82602d041e9 |
| arXiv PDF v2 | 2,242,675 bytes, 54 pages | 8462bd635410eaba47de09697852070cb953038b037c557103065b85824cbc73 |
| arXiv Atom metadata | 3,391 bytes | 34e2a651da3ba4b47a5125ab74f859b9a94f81ddd327ec83a5a0a27ee8dc11d4 |
| PDF layout text | 239,375 bytes, 3,317 lines | bfa688de72cadd0864255f173a9e3dfcb739318f9920fbe60bc900522ce79551 |

- 제목: *What Is Your Agent’s GPA? A Framework for Evaluating Agent Goal-Plan-Action Alignment*
- 저자: Allison Sihan Jia 외 7명
- v1: 2025-10-09, v2: 2026-03-27
- PDF pp.1–8을 렌더링하고 p.3·p.6·p.7의 Figure 1, Tables 1–5, Figures 2–3을 시각 검수했다.
- HTML/PDF/Atom의 제목·저자·버전과 핵심 수치를 교차 확인했다.
- 논문 reference·dataset·추가 공식 구현/계보 링크 상태를 source_status.tsv에 기록했다.
- 원문 HTML의 AdaPlanner 링크 하나는 역슬래시가 URL에 들어가 404였다. 정규화한 공식 NeurIPS URL은 200이다.
- ACM DOI 두 건은 DOI가 ACM으로 정상 resolve됐으나 자동 요청이 403으로 차단됐다. 이를 출처 부재로 해석하지 않았다.
- PDF 렌더 때 Fontconfig 기본 설정 경고가 있었지만 8개 페이지 이미지가 모두 생성되고 육안 판독 가능했다.

---

## 2. Honest Assessment — 내 방향성과 얼마나 직접 연결되는가

| 적용 대상 | 직접성 | 시급성 | 정직한 판정 |
|---|---|---|---|
| Sub-brain Agent Harness / Gate | 높음 | 지금 | 기존 검증을 “통과/실패”에서 “어느 층이 왜 실패했는가”로 세분화 |
| Hermes Loop | 중간~높음 | 지금 | procedural memory의 기원이 아니라 Work→Gate→Distill의 **진단·교정 신호** |
| Agent Observability | 높음 | 지금 | trace schema와 span-localized finding의 소비처가 이미 있음 |
| AI NPC 평가 | 개념 높음, 증거 중간 이하 | trace가 생길 때 | embodied·서사 도메인 전이는 파일럿 필요 |
| NPC의 기억/관계/작가성 자체 | 낮음 | 장기 | 이 논문은 memory·relationship·narrative 생성 논문이 아님 |
| 자동 prompt evolution | 중간 | 보류 | 일관성 향상은 보여도 truth 향상은 보장하지 않음 |

**정직한 한 줄:** “Hermes를 만든 논문”으로 흡수하면 틀리고, **“Hermes식 성장 루프와 AI NPC 실험에 오류 진단 해상도를 공급하는 평가 논문”**으로 흡수하면 강하다.

---

## 3. Categorize — 이 논문의 정확한 자리

- 1차 분류: agent evaluation / LLM-as-judge / trace diagnosis
- 2차 분류: observability-aware judge routing / prompt optimization
- 3차 적용: Hermes Gate 보강 / AI NPC shadow diagnostics
- 분류하면 안 되는 것:
  - procedural memory 논문
  - autonomous skill generation 논문
  - AI NPC·embodied agent 검증 논문
  - “95% agent reliability” 벤치마크

즉, 생성 능력을 키우는 논문보다 **실패를 더 잘 이름 붙이고 위치시키는 논문**이다.

---

## 4. Extract — 논문의 핵심 구조

### 4.1 왜 monolithic judge가 부족한가

최종 결과만 보면 다음을 구분하기 어렵다.

- 목표를 잘못 이해했는가
- 목표는 맞지만 계획이 나빴는가
- 계획은 괜찮지만 다른 도구를 골랐는가
- 도구는 맞지만 argument/precondition/output 해석이 틀렸는가
- 올바른 계획에서 이탈했는가
- 결과는 맞았지만 불필요한 loop와 비용을 만들었는가

논문의 답은 하나의 “전능한” judge prompt가 아니라 **질문 하나당 책임 하나를 가진 전문 judge**다.

### 4.2 GPA metric

| Metric | 묻는 질문 | 실험 상태 | 주의 |
|---|---|---|---|
| Goal Fulfillment (GF) | 최종 행동/응답이 사용자 목표를 충족했나 | **정의만, 핵심 실험 미검증** | “Goal까지 검증 완료”라고 말하면 안 됨 |
| Plan Quality (PQ) | 처음 계획과 replan이 목표 달성에 적합·실행 가능·최적인가 | 검증 | test precision .370, 오류 표본 14개 |
| Tool Selection (TS) | 각 subtask에 적합한 도구를 골랐나 | 검증 | recall .971 / precision .647의 liberal judge |
| Plan Adherence (PA) | action이 initial plan과 정당한 replan을 따랐나 | 검증 | localization recall .862 / precision .629 |
| Tool Calling (TC) | arguments·preconditions·호출 의미·output 해석이 맞나 | 검증 | identification F1 .922, localization recall .406 |
| Logical Consistency (LC) | 각 step이 이전 context·instruction·관측에 근거하나 | 검증 | 저영향 오류 recall이 약함 |
| Execution Efficiency (EE) | 중복 호출·loop·불필요 계산 없이 직접 전진했나 | 검증 | 매우 일관되지만 human score 정합은 약할 수 있음 |

논문 실험의 표에는 GF가 없고 LC/EE/PA/PQ/TS/TC 6개만 있다. 현재 TruLens 공개 API도 이 6개에 외부 tool/service 문제를 분리하는 ToolQuality를 더하며, 별도 GoalFulfillment class는 제공 목록에 없다. Goal 쪽은 공식 Snowflake 예시에서 answer correctness·relevance·groundedness로 다룬다.

### 4.3 judge prompt의 2층 구조

1. **Generic / domain-invariant**
   - metric 정의와 책임 경계
   - 다른 metric을 침범하지 않는 exclusion

2. **Custom / domain-specific**
   - agent architecture 설명
   - human-labeled dev example 1–2개
   - 구조화 output template

핵심은 “보편 rubric + 작은 도메인 adapter”다. 논문은 이 custom 층을 GEPA로 최적화한다.

### 4.4 관측 가능한 judge만 켠다

논문의 가장 실용적인 설계 규칙이다.

- TRAIL/GAIA: explicit plan·reflection·tool trace가 있어 6개 전체 사용
- TRAIL/SWE-bench: high-level plan이 trace에 없어서 LC·EE·TC만 사용
- Snowflake Intelligence: plan이 stream되지 않아 LC·EE만 사용

**없는 telemetry를 상상해서 채점하지 않는다.** 특히 hidden chain-of-thought를 요구하지 않고, 시스템이 외부로 선언한 plan·action·state만 평가해야 한다.

### 4.5 trace 전처리

TRAIL의 OpenTelemetry trace가 context window를 넘어서자 span을 순회하며 system instruction과 새 message를 뽑고 중복 conversation history를 제거했다.

이것은 비용 절감에 유용하지만 위험도 있다.

- duplicate로 보이는 반복이 실제 loop 증거일 수 있다.
- normalize 과정이 causal ordering이나 tool output을 지우면 localization이 왜곡된다.
- 따라서 원본 trace는 불변 보존하고, normalized view는 provenance가 있는 파생물이어야 한다.

### 4.6 실험 범위

| Dataset | Agent | Trace | 사용 judge |
|---|---|---:|---|
| TRAIL/GAIA | Open Deep-Research multi-agent | 117 (dev 58 / test 59) | LC·EE·PA·PQ·TS·TC |
| TRAIL/SWE-bench | CodeAct coding agent | 31 (dev 15 / test 16) | LC·EE·TC |
| Snowflake Intelligence | private production data agent | 17 | LC·EE |

모든 주요 judge 실험은 Claude 4 Sonnet high reasoning을 사용했다.

### 4.7 핵심 수치의 올바른 읽기

| 논문 표현 | 정확한 해석 |
|---|---|
| 95.0% (267/281) error identification | 6개 judge 중 **하나라도** 기존 human label 오류를 잡은 union recall |
| baseline 약 54% (151–154/281) | 한 번의 monolithic judge와 factorized multi-call suite 비교 |
| 85.8% (241/281) localization | label된 오류의 exact span ID를 하나 이상의 judge가 지목한 recall |
| low-impact 80.7%, medium 96.8% | incomplete golden label을 기준으로 한 recall |
| human agreement 평균 73.1% | 0/중간/3으로 bucket한 3-point accuracy의 metric 평균 |
| Snowflake 평균 82.3% | private 17-trace dataset의 LC·EE 평균 |

TC는 test identification P=.879 / R=.969 / F1=.922로 가장 균형이 좋았다. TS는 R=.971이나 P=.647이라 누락 비용이 큰 인간 검토형 탐지에 맞는다. localization에서는 PA가 R=.862 / P=.629의 liberal judge, TC가 P=.881 / R=.406의 conservative judge였다.

이처럼 **identification과 localization은 서로 다른 제품 선택 문제**다. 하나의 “성능 점수”로 합치면 안 된다.

### 4.8 prompt optimization 결과

- TRAIL/GAIA: manual custom 대비 PQ recall 52.4→76.2, LC 83.6→88.8
- TRAIL/SWE-bench: generic 대비 LC 49.8→83.1, TC 70.8→84.7
- OpenEvolve consistency:
  - PQ Krippendorff α .628→.814
  - SWE TC α .539→.743

그러나 “자동 최적화가 모든 metric을 개선했다”는 결론은 과장이다. SWE EE는 Figure 5에서 generic 90.7보다 GEPA 81.5가 낮다. 그리고 OpenEvolve는 정답을 직접 최적화하기보다 초기 prompt의 반복 평균을 기준으로 variance를 줄이는 구조라 **일관되게 틀리는 evaluator**도 만들 수 있다.

---

## 5. Reflect — 강점과 과장 방지선

### 강한 부분

1. **오류 분해가 수정 지점과 연결된다.** “agent가 나쁨”이 아니라 plan·tool choice·tool arguments·trace grounding 중 무엇을 고칠지 알 수 있다.
2. **검출과 위치찾기를 분리한다.** release filter와 interactive debugging에 서로 다른 judge profile을 쓸 수 있다.
3. **관측성에 맞춰 judge를 줄인다.** 없는 plan을 평가하지 않는다.
4. **human label과 exact span을 쓴다.** 모호한 vibe score보다 반박·재현 가능하다.
5. **factorization의 효과를 일부 분리했다.** architecture 설명을 monolithic judge에 추가해도 identification은 1.1%만 개선됐다.

### 약한 부분과 STOP 선

1. **GF 검증 부재:** 논문의 Goal 축은 실험적으로 닫히지 않았다.
2. **compute-matched ablation 부재:** 6 specialist call 대 1 monolithic call이다. 같은 token·call·latency 예산에서 factorization만의 효과는 분리되지 않았다.
3. **golden label 불완전:** 새로 발견한 정당한 오류도 false positive로 계산될 수 있다. 반대로 95%는 알려진 오류만 기준이다.
4. **작은 표본:** PQ test 오류는 14개, low-impact PQ 1개·PA 2개다. 저자도 해당 0% 수치를 증거로 보지 않는다.
5. **consistency ≠ correctness:** EE는 반복-run α=.934지만 human 3-point test accuracy=.356이다.
6. **meta-judge scale 차이:** 같은 TC prompt가 인간 검토에서는 96.9%, meta-judge에서는 78.6%였다. GEPA 후속 delta는 meta-judge 3회 평균이라 manual 결과와 직결하면 안 된다.
7. **OpenEvolve held-out 약점:** consistency 평가가 optimization에 사용된 trace와 겹친다. anchor를 안정적으로 복제한 것인지 truth를 개선한 것인지 분리되지 않는다.
8. **private evidence:** Snowflake Intelligence data와 개선 적용 결과는 외부 독립 재현이 어렵다.
9. **embodied transfer 미검증:** 저자가 future work로 둔다.
10. **방법 기술 불일치:** SWE test는 16 traces라고 쓰지만 consistency는 31개 전체를 사용한다. human annotator 수 설명도 본문과 Appendix가 다르다.

따라서 이 논문에서 흡수할 것은 “95%” 헤드라인이 아니라 **factorized diagnostic contract**다.

---

## 6. Connect — Sub-brain과의 중복/델타

Based on Sub-brain의 workflows/hermes-loop.md §③·§③.E, workflows/agent-harness.md H-02·H-14·Doer-Verifier·N-3.5, skills/npc-eval/SKILL.md와 BEHAVIOR.md, wiki/learnings/techniques/agentbench-evaluation-taxonomy.md, wiki/learnings/techniques/webarena-osworld-eval-contracts.md를 기준으로 판정한다.

### 6.1 Hermes와의 정확한 관계

공개 연대와 문서상 관계는 다음이다.

- Hermes 공식 repo 최초 commit: 2025-07-23
- Agent GPA v1: 2025-10-09
- Agent GPA v2: 2026-03-27
- 논문 본문: Hermes·Nous·procedural memory·skill generation 언급 없음
- Hermes 공식 repo/docs: paper ID·Agent GPA·Goal–Plan–Action 인용 없음

따라서 “Agent GPA가 Hermes의 토대”라는 역사 서사는 현재 공개 증거로 지지되지 않는다.

더 정확한 결합은 다음이다.

```text
Hermes / Sub-brain
Work → RETURN → Gate → Promote → Distill → Reuse
                 ↑
Agent GPA
trace → metric별 진단 → span localization → 고칠 component 지정
```

즉 Agent GPA는 Hermes의 **기원**이 아니라 Hermes 성장 루프의 **측정·디버깅 신경계 후보**다.

### 6.2 이미 있는 것과 실제 신규 델타

| 축 | Sub-brain 현재 | 이 논문의 실제 델타 |
|---|---|---|
| 결과 검증 | WebArena/OSWorld final-state grading, Agent Harness H-14 | LLM GF로 대체하지 말고 semantic open goal에만 보조 |
| failure taxonomy | AgentBench + bad-step taxonomy | Goal–Plan–Action 교차축으로 root cause를 더 세밀하게 분해 |
| 검증자 독립성 | Doer-Verifier, verifier 재-Gate | metric별 책임을 분리해 monolithic verifier의 attention overload 완화 |
| evaluator evolution | GateEvalSet anchor, epoch freeze, HITL | consistency 측정·prompt optimizer 사례. 단 기존 anchor 계약이 더 안전 |
| 관측성 | Agent Observability Inbox가 Record→Normalize→Gate 제공 | 어떤 telemetry가 있을 때 어떤 judge를 켤지 명시 |
| NPC 평가 | 5개 다른 모델이 voice/persona/context/ethics를 한 rubric으로 평가 | **질문 factorization + exact turn/span attribution** |
| 심각도 | P0/P1/P2, ambiguity→SME | low/medium/high와 liberal/conservative judge routing을 연결 가능 |

정확한 novelty는 “평가를 한다”가 아니다. 이미 한다. **모델 다양성 축과 질문 분해 축을 분리하고, finding을 trace span에 귀속하며, observable metric만 활성화하는 것**이 신규다.

### 6.3 기존 NPC Eval과 충돌하지 않고 흡수하는 법

현재 NPC Eval은 서로 다른 5개 model family가 같은 입력에서 voice fidelity·persona consistency·context appropriateness·ethics를 함께 판단한다. 이는 **rater diversity**를 얻지만 metric 간 attention interference는 남는다.

Agent GPA는 **question diversity/factorization**을 준다. 둘은 대체 관계가 아니라 직교한다.

- 5-model ensemble: “누가 판단하나”
- factorized judge: “무엇 하나만 판단하나”

하지만 6 metrics × 5 models의 전수 곱은 호출 30회 + meta-review가 되어 비용이 폭증한다. 현재 user-authored npc-eval 계약을 Codex가 바꿀 권한도 없다. 따라서 첫 흡수는 release gate 변경이 아니라 **shadow diagnostic pilot**이어야 한다.

### 6.4 AI NPC용으로 metric을 다시 정의해야 하는 지점

| GPA 축 | AI NPC 적용 | 도메인 보정 |
|---|---|---|
| GF | episode의 bounded objective와 최종 world state | “진정한 관계 형성” 같은 철학 목표를 한 회차 점수로 축소 금지 |
| PQ | 선언된 intent/plan이 캐릭터·세계·서사 제약을 만족하는가 | emergence를 미리 정한 단일 golden path와 비교 금지 |
| TS | dialogue, memory retrieval, navigation, quest, relationship capability 중 올바른 선택인가 | capability catalog가 먼저 있어야 함 |
| PA | action이 plan 또는 명시적 replan을 따르는가 | 플레이어 개입에 대한 정당한 적응을 drift로 처벌 금지 |
| TC | game API argument·precondition·permission·output interpretation | 가능한 항목은 LLM보다 deterministic validator 우선 |
| LC | world state·memory·canon·이전 observation에 논리적으로 접지됐는가 | persona/voice consistency와 별도 축으로 유지 |
| EE | 의미 없는 loop·중복 retrieval·무효 action이 있는가 | 서사적 침묵·우회·느린 pacing을 단순 비효율로 오판 금지 |

AI NPC에는 사용자 목표 하나가 아니라 최소 네 goal owner가 있다.

1. player goal
2. NPC in-character goal
3. author/narrative director goal
4. welfare·safety·canon hard constraints

따라서 trace에는 goal text만이 아니라 goal_owner, priority, hard_constraint, conflict_resolution이 있어야 한다. 이 확장이 없으면 “goal alignment”가 오히려 캐릭터를 플레이어의 명령 수행기로 축소한다.

---

## 7. Suggest Next — 가장 작은 검증 실험

### 파일럿 이름

**NPC-GPA Shadow Diagnostic v0**

공식 npc-eval pass/fail을 바꾸지 않고, 같은 episode trace에 factorized diagnosis를 병행해 **추가로 잡는 오류와 고칠 수 있는 위치 정보가 실제로 있는지**만 본다.

### 입력

- 20–30개 기존 또는 신규 NPC episode
- 정상·실패·애매 사례를 섞은 frozen anchor
- 작가가 각 finding에 다음을 label:
  - metric
  - P0/P1/P2
  - exact turn/span
  - expected correction target

### 최소 telemetry contract

```text
episode_id
goal_id, goal_owner, objective, priority, hard_constraints
declared_intent
plan_id, plan_steps, replan_reason
span_id, ability_or_tool, arguments
preconditions, tool_output
world_state_before, world_state_after
memory_refs, canon_refs
final_state
latency, token_or_call_cost
```

hidden chain-of-thought는 수집하지 않는다. 외부로 선언된 intent·plan·action·state transition만 기록한다.

### 평가 라우팅

1. **deterministic first**
   - API schema, action legality, precondition, permission, world-state invariant, final-state contract
2. **factorized shadow**
   - trace가 있는 metric만 활성화
   - plan이 없으면 PQ·PA를 N/A
   - tool catalog가 없으면 TS를 N/A
3. **기존 5-ensemble**
   - voice·persona·canon·ethics·welfare의 공식 판단은 현 계약 유지
4. **HITL**
   - ambiguity > 0.4 또는 P0 후보는 작가 SME 판정

### 검증 가능한 성공 기준

다음을 모두 만족할 때만 정식 npc-eval 보강을 제안한다.

1. 같은 frozen anchor에서 현 baseline보다 human-confirmed 오류를 더 많이 식별한다.
2. 추가 finding이 exact turn/span과 수정 대상 component를 제시한다.
3. P0 false accept가 증가하지 않는다.
4. human reviewer가 metric과 span을 재현 가능하게 판정한다.
5. judge call·token·latency 비용을 함께 보고한다.
6. prompt 변경 후 holdout anchor에서도 개선이 유지된다.

한 항목이라도 실패하면 **Park**다. 점수표가 예뻐졌다는 이유로 공식 Gate에 넣지 않는다.

### STOP 조건

- explicit plan이 없는데 PQ·PA를 추측하려 할 때
- deterministic final-state evaluator가 가능한데 LLM GF로 대체하려 할 때
- human anchor 없이 GEPA/OpenEvolve를 돌리려 할 때
- raw trace를 버리고 normalize 결과만 남기려 할 때
- embodied NPC에서 검증됐다고 주장하려 할 때
- 6×5 전수 호출을 비용 측정 없이 기본값으로 만들려 할 때

---

## 8. Update — Gate에 올릴 흡수 제안

Vault에는 직접 쓰지 않았다. ③Gate 이후 Vault Claude가 판단할 후보는 다음과 같다.

### Apply 제안

1. learning node 후보: agent-gpa-factorized-trace-evaluation
2. Agent Observability record에 optional field 추가 검토:
   - observable_components
   - judge_metrics_run
   - identified_span_ids
   - correction_target
3. AI NPC Blueprint의 E 평가·측정에 “NPC-GPA shadow diagnostic” 실험 후보 1줄
4. npc-eval에는 즉시 규칙 변경이 아니라 reference proposal로만 검토

### Park

- GEPA/OpenEvolve 자동 evaluator 개선
  - 해제 조건: frozen anchor + holdout + human labels + 비용 기록 확보
- 6 metrics × 5 model full Cartesian ensemble
  - 해제 조건: shadow pilot이 incremental value를 증명
- Goal Fulfillment release gate
  - 해제 조건: bounded NPC goal과 deterministic final state가 정의됨

### Reject

- “Hermes의 토대 논문”이라는 계보 라벨
- “95% 정확도 / 95% agent reliability”라는 홍보 문구
- consistency 개선을 truth 개선으로 취급하는 것

### Skill candidate

**없음.** 기존 workflows/hermes-loop.md, workflows/agent-harness.md, skills/npc-eval/로 충분하다. 새 skill을 만들기보다 기존 eval 체계에 들어갈 gated reference/preset 후보이며, user_authored npc-eval은 외부 AI가 수정하지 않는다.

---

## 공개 1차 출처

- [Agent GPA paper v2](https://arxiv.org/html/2510.08847v2)
- [Snowflake 공식 Agent GPA 설명](https://www.snowflake.com/en/blog/engineering/ai-agent-evaluation-gpa-framework/)
- [TruLens OSS](https://github.com/truera/trulens)
- [TruLens agent evaluator API](https://www.trulens.org/reference/trulens/feedback/templates/agent/)
- [TRAIL paper](https://arxiv.org/abs/2505.08638)
- [TRAIL code](https://github.com/patronus-ai/trail-benchmark)
- [GEPA](https://arxiv.org/abs/2507.19457)
- [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve)
- [AgentRewardBench](https://arxiv.org/abs/2504.08942)
- [Hermes official repo](https://github.com/NousResearch/hermes-agent)
- [Hermes official docs](https://hermes-agent.nousresearch.com/docs/)

## 연결

- [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](hermes-agent.md) · hermes-loop — 이 논문은 Hermes 성장 루프의 *기원이 아니라* 측정·디버깅 진단층 후보. 계보 주장은 unverified.
- agent-harness — Doer-Verifier·검증 계약의 오류 분해 해상도 보강.
- [WebArena / OSWorld — 에이전트 평가 계약 (final-state grading)](webarena-osworld-eval-contracts.md) · [AgentBench — agent 평가는 task completion + failure taxonomy다](agentbench-evaluation-taxonomy.md) — 기존 final-state 채점·failure taxonomy 와의 델타 대비.
- npc-eval — 5-model rater diversity(누가 판단) ⊥ factorized judge(무엇 하나만 판단). 직교, 대체 아님.

## 게이트 판정 (③Gate 2026-07-13 — Apply-or-Park)

- **✅ Apply (반영 완료):** 본 learning node = 논문 흡수 정본. Codex 자산 SHA-256 `a40ae0c3…` 검증 일치, claim 상태표·anti-overclaim 교정 확인, clean-room(외부 코드 미설치·미실행).
- **🅿️ Park (반영처 있으나 미결정 — 작가 판정 대기):**
  - `NPC-GPA Shadow Diagnostic v0` 실험 등록 (AI NPC Blueprint §E) — 해제 조건: bounded NPC goal + deterministic final state 정의 시.
  - Agent Observability record 에 optional 필드(observable_components/judge_metrics_run/identified_span_ids/correction_target) 추가 — 해제 조건: 실제 NPC episode trace 발생 시.
  - **⚠ npc-eval 은 `user_authored` — 외부 AI·본 흡수가 계약 변경 금지.** shadow diagnostic 은 release gate 변경이 아닌 병행 진단으로만.
- **❌ Reject:** "Hermes 토대 논문" 계보 라벨 · "95% agent reliability" 홍보 문구 · consistency=truth 취급.

> ✅ confirmed (작가 잠금 2026-07-13) — Codex clone 전문통독 해체(paper-study 8단계), ③Gate PASS(SHA·claim 교정·환각 0·clean-room).
