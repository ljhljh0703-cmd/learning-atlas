---
created: 2026-07-25
updated: 2026-09-02
type: learning
category: method
tags: [harness, evaluation, held-out, transfer, promotion-gate, attempt-budget, skill-quality]
source: ["https://arxiv.org/abs/2607.12227", "https://arxiv.org/abs/2608.27454"]
year: 2026
---
<!-- "같은 문제를 여러 번 풀어 오른 점수"와 "다른 문제에도 전이되는 하네스 개선"을 분리하는 승격 판정 계약. -->

# 하네스 개선 판정 계약 (Vault-lite)

> **철칙**: **하네스 이득 ≠ 같은 과제 점수 상승.**
>
> 후보를 `무스킬 1회(B0)` 하고만 비교해 승격하지 않는다. **고정 하네스에 같은 시도 예산을 준 것(B1)** 과 비교하고, 설계에 쓰지 않은 held-out 에서 `pass@1` 이 남아야 재사용 가능한 개선이다.

## 왜 필요한가

후보 하네스에 K번 시도를 주고 점수가 오르면 개선처럼 보인다. 그러나 **고정 하네스에 똑같이 K번 재시도를 줘도 오른다**. 그 차이를 안 빼면 측정한 것은 *탐색 이득(search gain)*이지 하네스 이득이 아니다. vault 는 이미 `with-skill vs no-skill` 을 하고 있었는데, 그게 정확히 **B0 만 비교하는 형태**였다.

## 1. Scope tier — 요구 강도를 스킬 위험도에 맞춘다

| Tier | 대상 | 최소 요구 |
|---|---|---|
| **S** | 개인용·저위험·좁은 skill | 실사용 1회 + correctness evidence + 작가 판단. **transfer 는 N/A 사유 명시로 면제 가능** |
| **M** | 반복 사용·다중 프로젝트 skill | B0/B1/H 비교 + unseen task·utterance 1개 이상 |
| **G** | 글로벌 routing·고위험·권위·publish | discovery/validation/transfer 분리 + 다중 negative + 비용·회귀 측정 + HITL |

> 과적용 가드 — vault 대부분의 skill 은 **S**다. 전건에 G 를 요구하면 아무것도 승격 못 한다.

## 2. Data split — 발견에 쓴 케이스는 점수에서 뺀다

- `discovery` — 결함 발견·description/harness 수정에 사용. **최종 점수 제외.**
- `validation` — 후보 variant 선택에 사용. **최종 점수 제외.**
- `transfer` — 설계·선택 중 **열람 금지**. 최종 `pass@1` 과 regression 만 측정.

각 케이스에 `case_id` · `split` · `exposure` · `expected_route/result` · `risk` 기록.

## 3. Matched arms — 시도 예산을 맞춘다

| Arm | 하네스 | 시도 예산 | 목적 |
|---|---|---:|---|
| **B0** | 기존/무스킬 | 1 | direct baseline |
| **B1-P** | 기존/무스킬 고정 | K parallel | 단순 repeated sampling |
| **B1-S** | 기존/무스킬 고정 | K sequential | retry·refinement |
| **H** | 후보 하네스 | K | 하네스 delta |

> **최소 판정은 `H vs B1`.** `H vs B0` 만으로 승격 금지.

### 3.1 지식 우회 격리 — 평가받는 수행자에게 뒷받침 지식을 보여주지 않는다 🆕 2026-08-31

**철칙: 스킬의 완결성을 재는 arm 에서는 그 스킬을 낳은 지식층을 수행자에게 숨긴다.**

| Arm | 수행자가 보는 것 | 무엇을 재나 |
|---|---|---|
| **H-solo** | 과제 맥락 + 후보 스킬 | **승격의 주 판정.** 스킬이 지식을 실제로 컴파일했나 |
| **H-wiki** | 과제 맥락 + 후보 스킬 + 뒷받침 지식(vault 노트·패턴) | 보조. 여기서만 통과하면 **스킬이 아니라 지식이 푼 것** |

- `H-wiki` 만 통과 = 스킬 미완성 판정. 승격 금지.
- 지식층은 *후보를 만드는 쪽*(제안자·정리자)은 봐도 된다. 숨기는 대상은 **평가받는 수행자**뿐이다.
- ⚠️ **적용 스코프 = 스킬 평가 arm 한정.** 실제 프로젝트 작업의 vault 조회를 막는 규칙이 아니다(① Dispatch 철칙과 충돌 금지).

**근거**(WikiSkill, arXiv:2608.27454): 제안자만 지식층을 볼 때 48.7%→63.7%로 올랐으나, **수행 agent 까지 보게 하자 63.7%→60.9%로 내려갔다.** 저자 해석 = 수행자가 지식층에서 답을 직접 얻으면 rollout 이 *스킬의 결함을 드러내는 신호*로서 쓸모를 잃는다. ⚠️ 저자 보고 수치이며 공식 코드 부재로 독립 재현 안 됨 — 방향은 채택하되 수치는 근거로 쓰지 않는다.

**§3 의 다른 확장과 축이 다르다 — 겹치지 않는다.** 2026-08-25 후보 [ACES — 스킬 문서 점수와 실제 에이전트 성능을 분리한다](aces-skill-evaluation.md) 의 `H-iso/H-group` 은 **미끼 스킬**을 넣어 *라우팅 프리미엄*을 분리한다. 본 절의 `H-solo/H-wiki` 는 **뒷받침 지식**을 넣어 *지식 의존*을 분리한다. 셋은 배타가 아니라 각각 다른 누수를 본다.


## 4. 지표

- **Primary**: held-out `pass@1` · wrong-route/error rate · regression count
- **Secondary**: `pass@K` · time-to-first-useful-artifact · user correction rate
- **Cost**: input/output 토큰 · tool calls · wall-clock · model calls · 달러 추정 **또는 명시적 `not measured`**
- **Integrity**: artifact hash · model/config/version · attempt index · feedback visibility
- **Skill provenance** 🆕 2026-08-31: `evolved_by_model`(그 스킬을 만든 모델) · `validated_on_models` · `known_negative_transfer` · `model_specific_workaround`. **「모델 독립」은 선언이 아니라 `만든 모델 × 쓸 모델 × 과제군` 으로 검증되는 주장이다.** 근거(WikiSkill, arXiv:2608.27454): 약한 모델이 만든 스킬이 강한 모델에 잘 전이된 조합이 있는가 하면, 반대로 **한 조합에서는 no-skill 50.5% 를 18.1% 로 떨어뜨렸다**(작은 모델용 우회로·분절 절차가 강한 모델의 end-to-end 실행을 막고 tool 예산을 태움). ⚠️ **§2 의 `transfer` 와 혼동 금지** — §2 는 *트리거 문구*의 분리(열람 금지 코퍼스)이고, 본 항은 *모델 간* 이식이다. 이름이 같을 뿐 축이 다르다.
- **Historical retention** 🆕 2026-08-25: `historical_anchor_loss` — 후보가 *과거* 고정 사례를 얼마나 깎았나. **현재 이득만 재면 하네스 갱신이 과거 능력을 잠식하는 것을 못 본다**([Harness Continual Learning — 하네스도 과거를 잊는다](../techniques/harness-continual-learning.md) 저자 보고: 가소성 우선 설정에서 망각 10.94, 더 자유로운 갱신이 오히려 최종 성능을 낮춘 sweep 존재). 함께 기록할 것 = `changed_component`(I/M/C/R 중 어디를 바꿨나) · `commit_decision`. ⚠️ **anchor PASS 는 무망각 증명이 아니다** — anchor 가 유한하면 held-out 과거 사례의 망각은 남는다. 그리고 *새 평가 기준을 설계한 사례*는 anchor 가 아니라 `discovery` 로 분리한다(자기 기준으로 자기를 통과시키지 않기).

## 5. Routing 적응 — 3결과를 따로 본다

기존 agent-skill-quality-gate §Routing-contract eval 의 `INVOKE / PROPOSE / BYPASS` 를 그대로 쓰되 split 을 얹는다.

- `INVOKE` — 고신뢰 동등 의도에서 가장 구체적 skill 선택
- `PROPOSE` — 누적 맥락일 때 **silent invoke 없이** 사용자 언어 intent 역제안
- `BYPASS` — 약함·무관·이웃 발화에서 trigger stealing 0

> **사용자 교정 발화는 `discovery` 로 보낸다.** 최종 `transfer` 에는 *의미가 같고 표현이 다른 새 발화*만 넣는다. (교정 발화로 최종 점수를 매기면 자기채점이다.)

## 6. 승격 규칙

```text
usefulness      = 후보가 특정 실제 작업을 개선함
generalization  = 설계에 쓰지 않은 case 에서도 B1 보다 나음
```

- **S** = usefulness + HITL 로 active 가능.
- **M/G** = generalization 증거 없으면 **provisional 유지**.
- `pass@K` 만 오르고 `pass@1`·비용·회귀가 개선 안 되면 **search gain 이지 harness gain 아님**.
- **task-specific fact 는 project memory/runbook 으로.** global harness 승격 금지 — 일반 전략만 올린다.

## 6.5 진단 순서 — capability 를 steering 보다 먼저 본다 🆕 2026-08-31

**철칙: 실패가 구조적 capability gap 인지 먼저 확인하고, capability 가 존재할 때만 steering 문구를 조정한다.**

"프롬프트를 고쳐보자"가 기본 반응이 되는 것을 막는다.

| patch 종류 | 무엇을 바꾸나 | 저자 보고 fix rate | 저자 보고 regression |
|---|---|---|---|
| **Capability** | 실행 가능한 tool·middleware·control flow | 55% | **8%** |
| **Steering** | prompt·description 등 문구 | 58% | **17%** |

→ fix rate 는 비슷한데 **regression 은 steering 이 2배 이상**이다. 문구를 고치면 다른 데가 깨진다.

**Harness Edit Claim Card 확장(shadow 사용)**: `failure_layer = capability | steering | unknown` + `why_not_other_layer` 두 필드만 추가해 관측한다. 아직 판정 기준으로 승격하지 않는다.

⛔ **AutoSaddler 설치 0.** 공개 V2 는 fake harness·Meta-ARE/GAIA2 만 지원하고 논문 실험은 V1 이라 범위가 다르다. 에이전트가 active harness 를 자동 수정하거나 EvoDAG 를 권위 memory 로 승격하지 않는다.
⚠️ 위 수치는 **저자 자기보고**(GAIA2 +9.0pp·SWE-Bench Pro +9.6pp·Terminal-Bench 2.0 +10.0pp)다. vault 사실로 인용하지 말 것.

<!-- 출처: AutoSaddler(arXiv 2608.23041 · microsoft/AutoSaddler MIT, HEAD 30e20ce) — ten-x 해체분석 S8, ③Gate 2026-08-26 「보강 후보」. dedup: `capability|steering` vault grep 0건 = 비중복. -->

## 7. STOP

- `discovery` 케이스를 `transfer` 로 재사용
- verifier 정답·테스트 출력을 후보 설계자에게 노출
- **시도·비용 예산이 다른 arm 을 직접 비교**
- 한 번의 성공 실행으로 global contract 승격
- `not measured` 를 숨기고 일반화 주장

## 냉정 (과신 가드)

- **논문 실험을 재현하지 않았다.** 유료 API·E2B·벤치 데이터·장시간 런타임 필요. 검증한 것은 공개 코드 syntax 91/91 · Terminal-Bench split 45/10/34(union 89, overlap 0) · 링크 13×200/1×403 까지다.
- 원문 Table 2 의 `pass@1` 의미가 모호한 채로 남아 있다 — **해소하지 않고 보존**했다.
- **"하네스 진화는 무의미"는 이 논문의 결론이 아니다.** 과잉 일반화 금지. 주장은 *측정 방법이 틀렸다*이지 *개선이 없다*가 아니다.
- 본 계약은 **Vault-lite 각색**이며 full benchmark 재현이 아니다. 파일럿 0회.

## delta / synergy

- **agent-skill-quality-gate**: 같은 날 흡수한 MSCE 의 *evidence-closure*(발견증거 ⊥ 검증증거)가 원리라면, 본 계약은 그 **실행 형태**다 — split 이름·arm 표·승격 규칙까지 구체화. 두 흡수가 같은 지점에서 만난다.
- **gate-eval-set-v0**: anchor 케이스도 *평가자에게 보이는 것* 과 *평가자 전용 held-out* 을 나눠야 한다(같은 논리를 평가자 자신에게 적용).
- **hermes-loop** ⑤ Distill: `usefulness`(1회 유용) 와 `generalization`(전이) 를 구분 — 현행 승격 요건은 전자만 본다.
- **선행**: vault 는 이미 arms×models×tasks×N·worst-of-N·hidden judge·frozen anchor·provisional+pilot+HITL 을 보유. **없던 것은 `B1`(고정 하네스 동일 예산) 이라는 baseline 하나와 split 분리다.**

> 🆕 확장 후보 (2026-08-25): [ACES — 스킬 문서 점수와 실제 에이전트 성능을 분리한다](aces-skill-evaluation.md) — H arm 을 H-iso(target만)/H-group(target+고정 decoy)으로 쪼개 `content_lift ⊥ routing_premium` 분리 측정. 본 계약(B0/B1/H)을 교체하지 않는 additive arm. 다음 M/G급 skill shadow pilot 에서만 시험.
