---
created: 2026-08-13
updated: 2026-08-13
type: learning
tags: [technique, agent-memory, failure-distillation, self-improvement, held-out-eval, gate]
source: https://arxiv.org/abs/2509.25140
authors: [Google Research]
year: 2026
category: technique
---
<!-- 실패 궤적을 '재사용 가능한 예방 규칙'으로 증류하는 에이전트 메모리 — 원문 보관이 아니라 전략 증류가 핵심. -->

# ReasoningBank — 실패를 *예방 규칙*으로 증류하는 에이전트 메모리

> ⚠️ **임시(provisional)** — 작가 컨펌 전. 아래 수치는 **논문 저자 보고값**이며 본 vault 는 독립 재현하지 않았다(대형 벤치 환경·API 필요). Codex 검증 범위는 `python3 -m compileall` PASS 까지다.

## 1. 한 줄 델타

> 저장 단위는 **raw trajectory 도 chain-of-thought 원문도 아니다** — `title/description/content` 를 가진 **고수준 전략과 예방 힌트**다. 흡수할 것은 "추론 과정을 저장한다"가 아니라 `실패 → 원인 → 재사용 가능한 예방 규칙` 의 **증류**다.

원 게시물은 "실패 궤적도 기억하고 추론 과정 자체를 저장한다"고 요약했는데, 원전은 더 좁고 더 유용하다. 이 교정이 이 자산의 절반이다.

## 2. 메커니즘 (6단계 루프)

1. 기존 memory 에서 관련 항목을 embedding 으로 검색
2. agent 가 task trajectory 실행
3. ground truth 또는 **LLM-as-a-judge** 가 success/failure 신호 생성
4. 성공 → 전이 가능한 전략 / 실패 → counterfactual pitfall + 예방 규칙, **최대 3개** 추출
5. 새 memory append → 다음 task 에서 재검색
6. **MaTTS** = 같은 task 의 병렬 trajectory 비교 또는 순차 재검토에서 얻은 *contrastive signal* 을 memory 로 되먹임

## 3. 저자 보고 결과 (독립 재현 X)

| 벤치 | no-memory | ReasoningBank | 비고 |
|---|---|---|---|
| WebArena (Gemini-2.5-flash) SR | 40.5 | **48.8** | 평균 step 9.7 → 8.3 |
| WebArena + MaTTS(k=5) | — | **51.8** | step 7.9 |
| SWE-Bench-Verified resolve | 34.2 | **38.8** | 평균 step 30.3 → 27.5 |
| total token | 50,847.4 | 53,054.5 | **+4.3%** (공짜 아님) |

**⭐ 가장 값진 두 ablation** — 이게 표의 개선치보다 중요하다.
- **실패를 넣는 것 *자체*는 이득이 아니다**(WebArena-Shopping): ReasoningBank 46.5(success only) → **49.7**(with failures)로 올랐지만, 같은 조건에서 AWM 은 44.4 → **42.2 로 악화**. 즉 이득은 "실패를 넣어서"가 아니라 **"실패를 어떤 형식으로 증류했는지"**에서 온다.
- **양보다 관련성**: 검색 memory 1개일 때 49.7 → 2/3/4개에서 **46.0 / 45.5 / 44.4 로 단조 하락**. 컨텍스트에 memory 를 쌓을수록 나빠졌다. ([UI Skills — Design Engineer용 라우팅 + MUST/NEVER 교정 게이트 skill 모음 (ibelick)](../methods/ui-skills-ibelick.md) `"smallest useful context, prefer 1 never >3"` · vault RTK 와 **독립 수렴**.)

## 4. Content Contract (흡수 단위)

`Failure-Distilled Strategy Memory` — 실패를 이 스키마로 접어야 재사용된다.

```yaml
trigger:             # 어떤 상황에서 불러올지
outcome_signal:      # success | failure | ambiguous
failure_class:       # spec | tool | memory | prompt | code | environment
diagnosis:           # 관측 가능한 원인
preventive_strategy: # 다음 실행에서 할 행동
evidence_anchor:     # 로그/테스트/RETURN 위치
scope:               # 적용 가능한 task family
counterexample:      # 적용하면 안 되는 조건
expires_or_review:   # 재검토 시점
```

🚫 **금지 5종**: hidden chain-of-thought 전문 저장 · 실패 로그를 정제 없이 memory 투입 · **judge 한 번의 판정을 사실로 승격** · 관련성 검증 없이 다수 memory 를 프롬프트에 누적 · authority note 자동 rewrite.

## 5. 한계 (격상 금지)

- **correctness 신호가 LLM-as-a-judge 에 의존**한다. 논문도 모호한 task 와 judge error 를 한계로 인정. → vault 교훈 *"보고된 자동 PASS 가 PASS 조차 아닐 수 있다"* 와 정확히 같은 급소.
- **consolidation 이 얕다** — 새 항목 direct append 수준. decay·conflict resolution·authority·provenance 는 **연구 범위 밖**. vault 는 이 축들을 이미 더 강하게 갖고 있다(`superseded` 격리 보존 · origin 표기 · `review_trigger`).
- repo 는 WebArena/SWE-Bench 실행 코드를 주지만 **독립 단위 테스트·CI 재현 패키지가 없다**.
- raw reasoning/trajectory 저장은 개인정보·비밀·긴 컨텍스트·hidden reasoning 누출 위험.

## 6. 반영 (학습→반영 루프)

- 🔗 **vault Gate 반송 포맷** — 지금도 `.vault-gated` 마커에 판정을 남기지만, 형식은 *그 패킷 이야기*다. §4 계약은 그걸 **다음 실행에 걸리는 예방 규칙 + 반증 명령**으로 접으라고 한다. 이건 헌법 §5.6 *"파괴 옵션 = 반증 명령 동반 의무"* 와 lessons 증류 규율의 **외부 확증**이다 — 새 룰 아님. `preventive_strategy` + `counterexample` 쌍이 곧 "규칙 + 그 규칙을 뒤집는 조건".
- 🔗 **[기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md)** — L1~L3 성숙도는 *언제 승격하나*를 다룬다. §4 는 *무엇을 적어야 재사용되나*를 다뤄 상보. `expires_or_review` 가 vault `review_trigger` 와 동형.
- 🟡 **backlog — 게임 자동 QA**: seed/trace 와 실패 원인을 묶어 다음 test selection 을 바꾸되 **gameplay code 를 LLM memory 가 직접 수정하지 않는다**. 트리거 = 자동 QA 레인 착수 시.
- 🟡 **backlog — 장기 NPC**: 적용 가능하나 **author canon/world state 와 분리된 advisory memory** 여야 한다([AI NPC 기억·신념 아키텍처 (Memory + Belief)](ai-npc-memory-belief-architecture.md) 경계 상속). 트리거 = NPC 메모리 프로토타입.
- ❌ **억지 반영 금지**: 지금 vault 에 embedding 검색 레이어를 넣는 근거가 아니다(헌법 §검색방법 grep/그래프>벡터 🔒 유지). §3 의 "관련성>양" 은 오히려 RTK 를 강화한다.

**파일럿 설계(미실행)** — 같은 task family held-out 20건에서 `no-memory / success-only / success+failure` 3분기 비교. 정확도·step·token·**negative transfer**·중복 memory 를 함께 본다. AWM 이 실패 주입으로 악화된 선례가 있으므로 negative transfer 관측이 필수 축.

## 7. 연결된 페이지

- [Neo4j Agent Memory — Context Graph 기반 에이전트 메모리 입문](../methods/neo4j-agent-memory-context-graph.md) (추론 계층 · `explicit ⟂ inferred` 결정 추적 계약 — 무엇을 노드로 남길지) · [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) · [Memora — 추상화·구체성 조화 메모리 표현](memora-harmonic-memory.md) · [memory-bank (conversation-memory layer) 해체](../methods/memory-bank.md)
- agent-harness (RSI ①Extract~④Recur — 실패 증류의 vault 구현체) · lessons (횡단 교훈 = 이미 돌고 있는 증류 표면)
- [UI Skills — Design Engineer용 라우팅 + MUST/NEVER 교정 게이트 skill 모음 (ibelick)](../methods/ui-skills-ibelick.md) (최소 컨텍스트 라우팅 — §3 "양보다 관련성" 과 독립 수렴)
