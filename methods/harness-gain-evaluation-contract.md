---
created: 2026-07-25
updated: 2026-07-25
type: learning
category: method
tags: [harness, evaluation, held-out, transfer, promotion-gate, attempt-budget, skill-quality]
source: ["https://arxiv.org/abs/2607.12227"]
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

## 4. 지표

- **Primary**: held-out `pass@1` · wrong-route/error rate · regression count
- **Secondary**: `pass@K` · time-to-first-useful-artifact · user correction rate
- **Cost**: input/output 토큰 · tool calls · wall-clock · model calls · 달러 추정 **또는 명시적 `not measured`**
- **Integrity**: artifact hash · model/config/version · attempt index · feedback visibility

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
