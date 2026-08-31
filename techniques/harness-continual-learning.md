---
created: 2026-08-25
updated: 2026-08-25
type: learning
category: technique
tags: [agent-harness, continual-learning, forgetting, gate, rsi, skill-lifecycle]
source: https://arxiv.org/abs/2608.19013
authors: [Borui Kang, 외 5명]
year: 2026
---
<!-- 하네스를 고쳐 새 작업을 잘하게 만들면 과거 능력이 깎인다 — 그 손실을 재는 축과 커밋 규율. -->

# Harness Continual Learning — 하네스도 과거를 잊는다

> ⚠️ **provisional** — 수치는 전부 **저자 보고**이고 독립 재현 안 됨(v1 preprint · 공개 코드 미확인).

## 한 줄

**새 작업을 잘하게 된 하네스가 과거 작업을 망가뜨린다.** 그래서 *후보 생성*과 *실제 커밋*을 분리해야 한다.

## 무엇을 말하는가

기반 모델은 얼려두고 그 주변의 프롬프트·기억·능력지도·라우팅만 계속 갱신하는 구조를 **하네스**로 정의하고, 그 갱신에서 생기는 망각을 다룬다.

`H = Task Interface + Experience Memory + Capability Map + Adaptive Router`

갱신은 두 단계로 나뉜다. **Continual Optimizer** 가 실행 피드백에서 *격리된 후보* 하네스를 만들고, **Continual Evaluator** 가 세 축을 전부 통과할 때만 커밋한다.

1. 현재 작업이 나아졌는가
2. **과거 anchor 가 보존되는가**
3. 문법·출력형식·도구/환경 유효성이 유지되는가

역사 손실 허용치 `B` 가 안정성과 가소성의 작동점을 정한다.

## 저자 보고 수치

| 스트림 | 기준선 | Stability | Plasticity |
|---|---|---|---|
| ALFWorld | 47.12 | 61.74 (망각 2.64) | 62.98 (망각 10.94) |
| 텍스트 | 45.50 | 52.20 (망각 0.00) | 64.70 (0.07) |
| 멀티모달 | 39.40 | 68.92 (0.22) | 67.96 (0.81) |

별도 retention sweep 에서 **`b=1`(63.46) 이 `b=∞`(60.13) 보다 높았다** — 더 자유롭게 갱신한다고 성능이 올라가지 않는다.

## 왜 이 vault 에 중요한가

이것은 **「AI 가 active skill 을 직접 수정하지 않는다」는 기존 규율의 이론·실험 근거**다. Archive-only 불변식 · `.incubator/` 후보 레인 · Hermes 의 외부 후보 → Gate → 작가 선택 구조가 전부 이 논문의 「후보 생성 ⟂ 상태 커밋」 분리와 동형이다. 근거 없이 지켜온 규율이 아니라 측정된 이유가 있는 규율이었다.

**[Catastrophic Remembering — 규칙은 왜 지워지지 않는가](catastrophic-remembering.md) 과 짝이다.** 그쪽은 *규칙이 안 지워져서* 파일이 부푸는 문제, 이쪽은 *하네스를 고쳐서* 과거 능력이 깎이는 문제다. 대칭이며 서로를 대체하지 않는다 — 지침을 지우지 못하는 것과 지우면 잃는 것은 다른 축이다.

## 한계 (과장 가드)

- **`B=0` 이어도 anchor 가 유한하면 held-out 과거 사례의 망각은 남는다.** anchor PASS 는 전면 무망각 증명이 아니다.
- 저자 보고 단일 preprint · 독립 재현 0 · 공개 코드 미확인.
- 새 평가 기준을 *설계한* 사례는 historical anchor 가 아니라 discovery 로 분리해야 한다(안 그러면 자기 기준으로 자기를 통과시킨다).

## 적용 (Absorb-to-Apply)

**반영 diff** → [하네스 개선 판정 계약 (Vault-lite)](../methods/harness-gain-evaluation-contract.md) 에 `historical_anchor_loss` 축 신설(현재 이득만 재던 계약에 과거 보존 축 추가).

다음 하네스 변경 파일럿에서 후보마다 다섯 필드를 기록한다.

| 필드 | 뜻 |
|---|---|
| `changed_component` | I/M/C/R 중 무엇을 바꿨나 |
| `current_delta` | 지금 작업이 얼마나 나아졌나 |
| `historical_anchor_loss` | 과거 사례가 얼마나 깎였나 |
| `validity` | 형식·도구 유효성 |
| `commit_decision` | 커밋했나, 왜 |

active skill 은 그대로 두고 **candidate copy 에서만** 검사한다.

## 출처 무결성

패킷 `2026-08-21/eight-source-independent-teardown` · SHA256SUMS 10/10 대조 통과(vault Claude 재계산). Codex 는 vault 를 수정하지 않았다.
