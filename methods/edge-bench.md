---
created: 2026-07-04
updated: 2026-07-04
type: learning
tags: [benchmark, agent-evaluation, harness, loop-engineering]
source: https://edge-bench.org/
authors: [ByteDance-Seed]
year: 2026
category: method
---
<!-- EdgeBench: agent가 환경 피드백으로 실제 학습하는지를 최종점수 대신 시간-점수 곡선으로 측정하는 벤치마크·방법론 -->
# EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크

> 흡수 대상 = **방법론(측정축)**. 리더보드·모델 랭킹·수치는 격리(source-reported, 미검증). full run 도입 X — 개념·측정 스키마만 흡수. Codex research-relay 산출을 vault Claude ③Gate 통과 후 승격.

## 한 줄 요약

EdgeBench(edge-bench.org / ByteDance-Seed/EdgeBench)의 핵심은 "AI가 이미 아는가"를 묻는 정적 시험이 아니라, 실행 가능한 환경 안에서 **오래 시도·관찰·개선하며 얼마나 빨리·안정적으로·어느 지점에서 나아지는가**를 시간축으로 기록하는 평가 체계다. 즉 최종 점수가 아니라 `S(t)`(시간 t의 best-so-far 점수) 곡선이 1차 지표다.

## 무엇인가 — Static benchmark가 아니라 environment-learning benchmark

일반 벤치마크는 "정답을 맞히는가"에 가깝다. EdgeBench는 "환경과 오래 상호작용하며 실제로 개선되는가"를 본다. 하네스/외부 AI 운영에서 우리가 알고 싶은 것과 정확히 겹친다.

- agent가 실패 피드백을 읽고 *다음 시도에 반영*했는가? (단순 재시도 vs 실제 개선)
- 어느 시점부터 plateau가 왔는가?
- *숨겨진* 검증 기준에서도 개선이 유지되는가? (criteria-hacking이 아닌 일반화된 개선인가)
- 중간 auto-eval snapshot을 보면 진행 도중 무엇이 좋아졌는가?

작동 루프(사이트 서술): **Attempt(실환경 시험) → Observe(피드백 획득) → Absorb(기록 분석) → Improve(더 나은 계획·산출물)**.

### source-reported 수치 (미검증 — 격리 대상)

아래는 공개 자료 기준 주장이며 독립 재현·peer review 미확인. 내부 사실처럼 흡수 금지.

- 전체 134개 태스크, 초기 공개 51개 + 평가 프레임워크 공개.
- 6개 태스크 계열: Scientific & ML / Systems & SE / Combinatorial Optimization / Professional Knowledge Work / Formal Math & Theorem Proving / Interactive Games & Simulators.
- 태스크당 12시간+ 실행, 일부 확장 실행 72시간+. 인간 전문가 기준 평균 57.2h·최대 320h 노력 태스크.
- 약 38,000시간 상호작용 기록 분석 → 평균 learning curve가 log-sigmoid `S(t)=Smax/(1+(tmid/t)^beta)`에 잘 맞는다고 *주장*.
- ⚠ **log-sigmoid = population-level heuristic**(다중 태스크 평균의 설명틀)이지 개별 태스크 법칙 아님. 개별 곡선은 jagged하고 plateau/점프가 많다. 과잉 일반화 금지.
- 리더보드 모델명·점수 = source claim. 134-task 접근은 공개 51-task보다 넓어 보임. HF dataset viewer는 조사 시점 비활성.

## 핵심 알맹이 3

### 1. 최종 점수보다 learning-curve 지표

단일 최종점수 대신 시간축 개선을 기록한다. 흡수할 지표:

- `best_score(t)` — 해당 시점까지의 최고 점수.
- `delta_best(t)` — 이전 최고점 대비 개선량.
- `time_to_first_valid` / `time_to_threshold` — 첫 유효 산출물·기준점 도달 시간.
- `plateau_duration` — 의미 있는 개선 없이 정체한 시간.
- `breakthrough_count` — 정체 후 큰 폭 개선 횟수.
- `useful_submission_ratio` — 제출 중 최고점 갱신 또는 의미 있는 진단을 만든 비율.
- `agent_visible_score` vs `judge_private_score` — 아래 #2.

해석 초점: "성공/실패"가 아니라 *언제 막혔고 어떤 피드백 이후 개선됐는가*(plateau/breakthrough). 긴 작업에서 마지막 산출물이 항상 최고가 아니므로 best-so-far를 별도 보존한다.

### 2. agent-visible feedback vs hidden judge 분리 (SForge Work/Judge 컨테이너)

SForge는 EdgeBench의 평가 하네스. 핵심 설계 = agent가 작업하는 **Work container**와 숨겨진 평가가 도는 **Judge container**의 분리.

- Work image: skeleton code·문서, agent가 볼 수 있음.
- Judge image: full test suite·evaluation script, agent는 볼 수 없음.
- `sforge-submit`: 현재 산출물 제출 → pass rate·score·실패 항목·요약 반환.
- Host-side history는 auto-eval까지 포함한 전체 기록, agent-visible history는 auto-eval 항목을 숨길 수 있음.

**교훈**: agent에게 *모든 검증 기준을 노출하면 학습이 아니라 criteria-hacking(검증 기준 맞춤)이 된다.* agent-visible feedback과 evaluator-only record를 반드시 분리.

### 3. Auto-eval snapshot (제출 안 한 중간 상태 채점)

agent가 직접 `submit` 하지 않아도 주기적으로 현재 상태를 평가해 sampling point를 남긴다. 장시간 작업의 *진짜 진척*을 최종 산출물 밖에서 관측하는 장치.

## Sub-brain에 가져올 것 / 안 가져올 것

**받아들일 것**: 최종점수보다 learning curve / agent-visible·hidden judge 분리 / auto-eval snapshot / best-so-far scoring / plateau·breakthrough 중심 해석 / 태스크 계열별 coverage.

**받아들이지 말 것**: 전체 EdgeBench 즉시 설치·12h+ full run(Docker/장시간/API 비용) / 리더보드 절대화(source claim) / log-sigmoid 과잉 일반화 / agent 자가개선 자동승격(vault 직접수정 권한 아님 — 흡수·승격은 계속 ③Gate) / 테스트 노출형 평가.

## 학습→반영 루프 (Apply-or-Park)

CLAUDE.md §학습→반영 루프 exit 강제 = 반영 판정 3-way 중 택1. 본 학습의 판정:

- **(a) 즉시 반영 diff — ③Gate 재정의**: ③Gate를 *단순 승인자*가 아니라 "**hidden judge + trajectory auditor**"로 읽는다. Gate는 (i) 모든 판정 기준을 agent에게 노출하지 않고(criteria-hacking 차단), (ii) 산출물 점수만이 아니라 *궤적*(피드백을 다음 시도에 반영했는지, 일반화된 개선인지)을 감사한다. → hermes-loop ③Gate 운영 시 참조하는 렌즈.
- **(b) PARK(파킹 + 이름붙은 트리거) — "EdgeBench-lite"**: agent-harness ledger에 학습 telemetry 필드(`attempt_index` / `agent_visible_score` / `judge_private_score` / `best_score_so_far` / `delta_best` / `artifact_hash` / `feedback_used_in_next_attempt` / `useful_submission`)를 추가하는 metric 제안. **지금 구현 X**(Apply-or-Park 정직 — infra-0 유지, Karpathy #2). 트리거: *하네스에서 다중 시도 telemetry가 실제로 필요해지는 첫 실전 루프 발생 시* 또는 작가가 EdgeBench-lite pilot을 명시 지시 시. pilot 형태(예): 12h 대신 60~120분, agent-visible rubric과 hidden judge rubric 분리, 5~10분 간격 auto-eval snapshot, Gate는 "점수 상승"보다 "criteria-hacking 없는 일반화 개선"을 본다.

## 연결

- **[Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](loop-engineering.md)** — *양방향 counterpart*. Loop Engineering = 루프를 **설계**(DESIGN)하라. EdgeBench = 그 루프가 환경 피드백으로 실제 학습하는지 곡선으로 **측정**(MEASUREMENT)하라. 설계-측정 쌍.
- **agent-harness** — EdgeBench-lite telemetry 필드가 파킹된 반영처(ledger 확장 후보).
- **hermes-loop** — ③Gate를 hidden judge + trajectory auditor로 재해석하는 렌즈.
- **AI NPC / game research** — simulator episode를 "정적 데모"가 아니라 repeated environment interaction으로 보면 NPC 행동 개선 곡선을 만들 수 있다(계열 coverage 응용).

## Source Anchors (Codex clone, commit 856c83d, 2026-07-02)

- `README.md:38-40` — 134 tasks / 51 public / 12h+ loop / log-sigmoid claim.
- `README.md:157-170` — task taxonomy, expert effort, SForge two-container harness.
- `docs/en/guide/introduction.md:17-55` — Work/Judge architecture, iterative evaluation, auto-eval.
- `docs/en/features/iterative-evaluation.md:48-58` — auto-eval sampling point 설계.
- `sforge/harness/judge_server.py:821-845` — admin view vs agent-visible view 분리 history endpoint.
- `sforge/harness/run_evaluation.py:102-120` — ephemeral judge container 평가 경로.
- 원본 packet: `~/Documents/Codex/2026-07-03/edge-bench-study/outputs/` (RETURN + asset + sha256).
