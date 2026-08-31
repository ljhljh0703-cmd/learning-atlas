---
created: 2026-08-25
updated: 2026-08-25
type: learning
category: technique
source: three-x-harness-delta RETURN (Codex 2026-08-25)
---
<!-- Post-Training Strategy Lock(arXiv 2608.19072) — 실행 반복 ≠ 전략 수정, 전략 재검토를 여는 방아쇠(작가 선택 checkpoint). 자동 전환 아님. 본문 = Codex 자산 바이트 보존(origin_sha256), frontmatter만 vault 갱신. -->

# AI Post-Training Strategy Lock — 실행 반복은 전략 수정이 아니다

## 1. Fetch

X 공식 oEmbed는 본문이 잘렸지만, 공개 색인에서 연결 논문 arXiv 2608.19072를 확인하고 v1 23쪽 PDF를 전건 분석했다.

## 2. Honest Assessment

- AI NPC 연결: 자율 성장·훈련 계획에 높음.
- 적용: 모든 장기 agent loop에 직접.
- 시급성: 높음.
- 판정: `ABSORB_HIGH_PRIORITY_DELTA`.

## 3. Categorize

AI가 AI를 post-train하는 실행 궤적에서 `execution-level capability`와 `strategy-level capability`를 분리한 경험 분석이다.

## 4. Extract

### 두 능력

- Execution level: 선택한 전략 안에서 code 수정, data 혼합, hyperparameter 조정, 오류 복구.
- Strategy level: evidence가 쌓일 때 objective family, data-source type, stage structure 등 상위 접근을 다시 선택.

### 관찰 결과

- 공개 PostTrainBench trajectory 1,338개, 20 agent-model configurations, trajectory당 H100 80GB 10시간 budget.
- 900개 trajectory가 학습을 시작했고 5,111번 training, 평균 trajectory당 3.82 training·13.80 evaluation.
- 3,557개 연속 training pair 중 상위 전략 차이는 74개, 2.08%뿐이었다.
- Claude Code trajectory는 초기 전략의 80.7%가 full SFT, Codex CLI는 89.6%가 PEFT로 scaffold별 기본 선택이 달랐다.

### 세 개 intervention

1. Experience-driven scaffold: GSM8K +12.6pt, HumanEval +40.8pt. 실행은 개선됐지만 전략은 거의 고정.
2. Human planning guidance: AIME의 시작 전략을 바꾸고 best run pass@8 13.33%를 냈지만 표본 30문제라 variance 안이며, 실행 후 다시 local loop로 수렴.
3. 추가 reasoning compute: 쉬운 task에는 효과가 있었지만 AIME는 baseline 대비 7.9배 token으로 한 문제 추가에 그쳤고 variance 범위였다.

결론은 “전략을 바꿀 능력이 없다”가 아니다. 사람 지시가 있으면 이해하고 실행했다. 부족한 것은 증거가 생겼을 때 **스스로 전략 선택을 다시 여는 initiation mechanism**이다.

## 5. Reflect

Vault의 loop engineering은 실행·검증·다음 단계 선택을 보유하지만, local repair와 strategy revision을 명시적으로 다른 state로 기록하지 않는다. 이 논문의 실질적인 신규 델타는 `Strategy Reopen Checkpoint`다.

그러나 자동 전략 전환으로 흡수하면 사용자 선택권과 충돌한다. 올바른 적용은 다음이다.

```text
evidence of plateau/regression
→ 현재 strategy의 가정과 누적 비용 표시
→ 유지 포함 2~3개 선택지로 축소
→ 작가 결정
→ 선택된 candidate branch만 실행
```

에이전트의 역할은 전략을 몰래 바꾸는 것이 아니라, local loop가 된 사실을 감지하고 더 좋은 선택을 할 수 있게 option space를 줄이는 것이다.

## 6. Connect

- `recursive-self-improvement`: research taste·objective selection bottleneck의 trajectory-level 실증.
- `harness-edit-claim-card`: bounded edit 이전에 target strategy 자체를 재검토하는 상위 checkpoint.
- `loop-engineering`: 실행 루프와 전략 루프의 2층 분리.
- `HCL`: HCL은 후보 하네스 commit을 Gate하고, 본 논문은 후보 strategy를 다시 생성할 시점을 다룬다.

## 7. Suggest Next

장기 실행에서 아래 항목을 advisory로 기록한다.

- `strategy_id`
- `strategy_assumptions`
- `evidence_against_strategy`
- `local_adjustment_count`
- `best_result_so_far`와 최근 regression
- `remaining_budget`
- `reopen_recommended`
- `surviving_options`
- `user_decision`

프로젝트별 plateau 기준은 사전에 정한다. 전역 숫자를 임의로 만들지 않는다. strategy reopen은 계획 변경 제안이며 권위·skill·실행 상태를 자동 수정하지 않는다.

## 8. Update

Vault 변경 0. 논문의 대규모 corpus는 observational이라 특정 agent나 scaffold가 lock-in의 원인이라고 인과 주장할 수 없다. 전략 분류도 objective/data/stage의 거친 세 축이다. 그 한계를 보존하면서 `execution loop ≠ strategy loop`와 사용자 선택 checkpoint만 흡수 후보로 남긴다.

