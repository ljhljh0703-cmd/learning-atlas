---
created: 2026-07-18
updated: 2026-07-18
type: learning
tags: [rsi, self-improvement, overseer, observability, utility-function, scaffold, godel-machine, safety]
source: https://arxiv.org/abs/2504.15228
authors: [Maxime Robeyns, Martin Szummer, Laurence Aitchison]
year: 2025
category: technique
---
<!-- SICA: DGM/HGM 의 공통 조상 베이스라인. 메타=타깃 구분 제거·greedy 아카이브·비동기 overseer·다기준 효용. vault 델타 = "실행 중 감시"(overseer)와 다기준 효용. -->

# Self-Improving Coding Agent (SICA) — DGM·HGM 의 공통 조상

*Maxime Robeyns · Martin Szummer · Laurence Aitchison (Bristol 라인). v2 2025-05-16, workshop paper. [DGM](darwin-godel-machine.md)·[HGM](huxley-godel-machine.md) 이 코드까지 물려받은 원형.*

self-improvement 시리즈 4번째. [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md)·[Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다](huxley-godel-machine.md) 두 노트에서 연속 1순위로 올렸고 작가가 집었다. DGM repo 가 "built upon SICA"는 아니지만, **DGM/HGM 논문 둘 다 SICA 를 명시 베이스라인**으로 쓴다.

> **먼저 — 내 추천 정정**: 나는 [Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다](huxley-godel-machine.md) §9 에서 SICA 를 *"아카이브 없는 단일 에이전트"* 라고 소개했다. **틀렸다.** SICA 는 아카이브를 **가진다**(Algorithm 1: "using the archive of A≤i"). 다만 그 아카이브를 **greedy 하게** 쓴다 — best-so-far 한 놈을 다음 메타에이전트로 뽑는다(hill-climbing). 그래서 SICA 는 "아카이브 없음"이 아니라 **"아카이브를 즉시 성과로만 읽는" 원형**이다. 이게 오히려 더 정확하고 vault 에 더 아프다(§5).

---

## 1. 한 줄 요약

> [survey](self-improving-agents-survey.md) 어휘로 Σ-개선(가중치 동결)만 하는 자기개선 코딩 에이전트. **메타에이전트와 타깃에이전트의 구분을 없앤 최초**(ADAS 는 둘이 분리). 아카이브에서 **best-so-far 를 greedy 하게** 뽑아 자기 코드를 고친다. DGM(아카이브 열린탐색)·HGM(clade 가중선택)이 정확히 이 greedy 선택을 고치려고 나왔다.

---

## 2. 핵심 3

### 2.1 메타=타깃 통합 (ADAS 와의 결별)

ADAS 는 *타깃 에이전트*(과제 수행)와 *메타 에이전트*(타깃 개선)가 **분리**돼 있다 → 메타는 타깃을 고칠 뿐 **자기를 안 고친다** = 진짜 자기개선 아님. 게다가 ADAS 메타는 DSL 로 쓰인 **forward 함수 하나만** 편집.

SICA 는 그 구분을 없앴다 — **하나의 에이전트가 과제도 풀고 자기 Python 코드베이스 전체도 고친다**. 동기: 코딩 능력 향상이 다음 개선 단계에서 *재활용*돼 복리로 쌓이길 기대(survey 의 "자기개선=코딩 과제 → 하류 향상이 메타 능력 향상으로 직결" 논리의 원형).

### 2.2 ⭐ 다기준 효용 함수 (vault 가 안 쓰는 축)

"best 에이전트"를 점수만으로 안 정한다. 명시적 3항 가중:

```
U = w_score·p_score + w_cost·(1 − min(1, cost/$10)) + w_time·(1 − min(1, time/300s))
    w_score=0.5, w_cost=0.25, w_time=0.25
```

- 문제당 비용 상한 $10, 타임아웃 300초.
- 타임아웃 시 부분점수: `U_final = U·(1−τ)`, τ=0.5.
- 가중치 갱신을 안 하므로 이 점수는 **다음 메타에이전트·베이스에이전트 선택에만** 쓰인다.

→ 점수 절반, **비용·시간이 절반**. "좋은 에이전트 = 정확할 뿐 아니라 싸고 빨라야". 실제로 초기 개선의 상당 부분이 정확도가 아니라 *편집 속도·비용*에서 나왔다(§3).

### 2.3 ⭐ 비동기 Overseer — 실행 *중* 감시 (DGM/HGM 엔 없는 것)

이게 SICA 의 진짜 차별점이다. DGM·HGM 의 안전장치는 전부 **사후**(샌드박스·통과 후 아카이브 등재)인데, SICA 는 **실행 중**을 본다.

- **별도 스레드에서 도는 LLM** 이 주기적으로(논문 "기본 30초, 또는 key event") 실행 상태를 판정.
- 병리적 행동·과제 이탈·루프를 감지 → **notify**(현재 에이전트나 그 부모의 컨텍스트에 메시지 인라인) 또는 심각하면 **force-cancel**.
- overseer 는 **다른 LLM** 을 쓸 수 있다(생성자와 평가자 분리 — DGM node 114·HGM MPM·survey §9.1 이 독립적으로 요구한 그 원리).
- overseer 에게 주는 입력 = **callgraph**(에이전트·서브에이전트 실행 트리) + event stream(LLM 메시지·툴콜·서브에이전트 콜) — verbose 는 truncate.

논문의 안전 프레이밍: **관찰가능성(observability)이 1차 안전 완화**. 단 정직하게 못 박는다 — *"for recursively self-improving systems where the model weights are also updated, observability mechanisms, on their own, are clearly inadequate."* Σ-only 라서 관찰로 버티는 것이지, θ 까지 바꾸면 관찰만으론 부족하다고 스스로 인정.

---

## 3. 수치 — 조건 붙여서

**메인 실행 (15 iteration, ~$7,000 API)**

| 벤치마크 | iter 0 → 15 |
|---|---|
| SWE-Bench Verified (50 무작위 subset) | **0.17 → 0.51** (논문 초록·결론은 "17%→53%" — 표는 0.51, 본문 산문은 53%. §7 주의) |
| 파일 편집(synthetic) | 0.82 → 0.91 |
| 심볼 위치(codebase nav) | 0.35 → 0.40 (저자: 데이터 품질 낮음 자인) |
| LiveCodeBench (50) | 0.65 → 0.71 |
| 문제당 평균 시간 | 130s → 114s (약간 감소) |

- SWE-Bench 향상의 상당 부분이 **파일 편집 속도·비용 개선**에서 왔다(저자 §5.1 자인) — 5분 타임아웃 때문에 초기 점수가 모델 실력보다 낮게 찍힌 것을 편집 효율화가 회복한 측면. "순수 추론력 향상"으로 읽지 말 것.
- 자기발견 예: iter 9 에 AST 기반 심볼 탐색기 구현(벤치가 Python 위주라는 걸 이용했을 수 있음 — 저자 자인).

### 3.1 ⭐ 스캐폴드가 강한 모델을 **해쳤다** (§4.1)

vault 가 가장 새겨야 할 실측. AIME 2024·GPQA Diamond 로 추론 태스크 평가:

- **o3-mini(high) 단독** = AIME 87% / GPQA 79%.
- **에이전트 시스템 전체**(Sonnet 3.5 메인 + o3-mini 추론 서브) = 두 벤치 평균 **76%**.

즉 **스캐폴드를 씌우니 강한 추론 모델의 성능이 떨어졌다.** 저자 분석: 메인 에이전트가 그냥 o3-mini 서브에게 위임만 하고 시스템을 못 살렸고, 더 나아가 *"reasoning 을 유도하려는 조잡한 구성요소(iter 4·6)가 오히려 reasoning 모델의 CoT 를 끊어서 성능을 떨어뜨렸을 수 있다"*.

→ **스캐폴드는 항상 플러스가 아니다.** 모델이 이미 잘하는 영역에선 scaffold 가 마이너스일 수 있다(Figure 4 "Agent Framework Saturation").

---

## 4. repo 대조 — 논문에 없는 것 2

clone 통독(commit `ed8275d`, `base_agent/src` = 26,671 LOC). paper-study §1 "가능하면 직접 접근"의 값.

**(가) overseer 기본 간격: 논문 30초 vs 코드 60초.**
논문 §3.1: *"The overseer is called every **30s** by default."*
코드(`base_agent/src/oversight/overseer.py:165`): `def __init__(self, model: Model = Model.SONNET_37, check_interval: float = **60.0**)`.
→ 2배 차이. 또 overseer 기본 모델이 코드엔 **Sonnet 3.7** 로 박혀 있다(논문은 "다른 LLM 을 쓸 수 있다"고만). 사소하지만 "논문=코드"로 인용하면 틀린다.

**(나) 공개 repo = 논문 "초기 에이전트"보다 이미 커져 있다.**
논문 §3.1 초기 에이전트 = 서브에이전트 3종(coding·problem-solver·reasoning). repo `base_agent/src/agents/implementations/` = **6종**(coder·problem_solver·reasoner·**archive_explorer**·**main_orchestrator**·**review_committee_member**). 그리고 `tools/committee_design.py` 에 **`meta_improvement_review_committee`** 툴이 있다 — 개선 제안을 **구현 전에** 리뷰어 에이전트 패널이 비평(최대 3회 반복). ⚠️ **이게 iter-0 초기 장비인지 자기발견인지 통독 범위에서 확증 못 함** — 공개 repo 는 "reference framework"라 다듬어진 버전이라 둘 다 가능. 단정 금지. (자기발견이면 SICA 가 스스로 *판정 패널*을 만든 것 = vault ③Gate 의 자기발견 등가물이라 흥미롭지만, 확증 전엔 주장 안 함.)

> 위 2건 = 결함 아니라 **재현/인용 주의**. 논문 결과 반증 0.

---

## 5. 내 생각 — Sub-brain 관점

### 5.1 직접적 연결: **높음** · AI NPC = 해당 없음 · 알고리즘 이식 = 불가

paper-study §2 판정: AI NPC = 해당 없음. 직접 적용 vs 개념 = **개념**. 시급성 = 지금. 이식 불가($7,000·15 iter·Docker·자동 벤치 루프 = infra-0 충돌, vault 는 SWE-bench 안 품).

### 5.2 ⭐ SICA 가 시리즈의 빈칸을 메운다 — greedy 아카이브의 실물

세 논문을 순서로 읽으니 계보가 완성된다.

| | 아카이브 | 선택 | vault 대응 |
|---|---|---|---|
| **SICA** | 있음 | **best-so-far greedy**(즉시 효용) | ← **vault 가 지금 하는 것** |
| DGM | 있음(전부 보존) | 열린탐색(0 아닌 확률로 아무나) | Archive-only invariant |
| HGM | 있음 | **clade 가중**(후손 집계=CMP) | (미도입) |

**vault 는 SICA 다.** [Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다](huxley-godel-machine.md) §5.2 에서 "vault 는 즉시 성과로만 판정한다"(use-ledger 8주·curator mtime)고 진단했는데, SICA 가 **그 greedy 선택의 실행 가능한 원형**이다. 그리고 SICA §5.1 이 그 대가를 실측으로 보고한다.

> **path dependency** (SICA §5.1): *"initial feature ideas would often heavily influence later feature ideas as variations on the same theme... poor quality initial suggestions lowering the quality of subsequent feature suggestions."*

이게 vault 에 그대로 있다 — hot.md `current_topic` 과 `스테이징 영역` 가 세션 간 사고를 한 방향으로 고착시킨다. SICA 가 이 고착으로 고생했고(그래서 DGM 이 열린탐색을, HGM 이 clade 선택을 붙였다), vault 는 아직 SICA 단계다. **단 vault 엔 작가가 있다** — path dependency 를 깨는 건 vault 에선 알고리즘이 아니라 작가의 방향 전환이다(§5 HITL). 이건 결함이 아니라 *다른 해법*.

### 5.3 ⭐ Overseer = vault 에 진짜 없는 것 (사후 게이트 vs 실행 중 감시)

vault 의 모든 게이트는 **사후**다 — ③Gate(RETURN 후), done-gate(편집 후), worktree-accept(완료 후), vault-health-gate(주기). **실행 *중* 개입은 0.** SICA 의 overseer 는 별도 스레드에서 **돌아가는 중**에 루프·이탈을 잡아 notify/cancel 한다.

vault 에 이게 필요한 자리가 정확히 하나 있다 — **Codex 장기 위임**. vault Claude 자신은 세션이 짧고 작가가 실시간으로 보므로 overseer 불요(작가가 overseer다). 하지만 Codex 헤드리스 자동 실행(worktree-accept)은 **완료될 때까지 아무도 안 본다** — done-gate 는 *끝난 뒤에만* 판정한다. SICA overseer = 그 사이를 메우는 "실행 중 감시자".

⚠️ 단 vault 원칙과의 긴장: overseer 도입 = infra 추가 = infra-0·Karpathy #2 와 충돌. 그리고 vault 의 worktree-accept 는 이미 "실패하면 본 repo untouched"라 *실행 중* 개입 없이도 안전하다(피해가 격리됨). overseer 의 값은 안전이 아니라 **비용 절감**(가망 없는 Codex run 을 일찍 죽여 토큰 아낌)이다 — SICA 효용함수가 cost/time 을 절반 넣은 것과 같은 동기. → **park**(§6), 반영 아님.

### 5.4 다기준 효용 — vault 는 품질만 잰다

SICA U = score·0.5 + cost·0.25 + time·0.25. vault 의 판정(use-ledger·curator·게이트)은 **품질/사용여부만** 본다 — 토큰 비용·시간을 효용에 안 넣는다. RTK 가 "비용 아껴라"라고 규율로 있지만 *판정 기준*엔 없다. 흥미로운 비대칭이나, vault 는 단일 작가라 $ 압력이 다르고(Claude Max 정액), 이식 억지는 Karpathy #2. → 순수참조.

### 5.5 인접 노드 델타

- **[Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md)** — SICA 의 greedy 아카이브를 열린탐색으로 교체한 직후속. DGM 논문이 SICA 를 "most similar concurrent work"로 지목하고 유일 차이 = 열린탐색이라 명시. **SICA 읽고 나야 DGM 의 ablation("w/o open-ended")이 무엇의 실물인지 보인다.**
- **[Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다](huxley-godel-machine.md)** — SICA 를 실측 베이스라인으로 씀(Table 2: SICA 가 SWE-Verified-60 에서 **컨텍스트 초과 무한루프로 죽음**). SICA §5.1 의 path-dependency·fixation 이 HGM MPM 의 동기.
- **[Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md)** — SICA = Σ-only(가중치 동결) 자기개선의 교과서 사례. survey §6.4 풀스캐폴드.
- **agent-observability-inbox** — SICA overseer 의 callgraph+event stream = 그 노드의 관측 어휘와 같은 계열(사후 inbox vs 실행중 overseer).
- **agent-harness** — SICA 서브에이전트 컨텍스트 격리(반환 시 컨텍스트 폐기, 요약만 전달) = vault dispatch/RTK 의 원형.
- exact duplicate 없음(`2504.15228`·`SICA`·`asynchronous overseer`·다기준 U = vault 미보유).

---

## 6. 학습→반영 루프 판정 (게이트 exit 3-way)

| 수확 | 판정 | 사유·트리거 |
|---|---|---|
| **runtime overseer for Codex 장기 위임** (§5.3) | **② Park** | 반영처 = worktree-accept 프로토콜 / agent-observability-inbox. **트리거: Codex 헤드리스 run 이 *완료 전 개입이 필요할 만큼* 길어지거나 비용 폭주한 사건 1건.** 지금은 worktree-accept(사후 격리)로 충분·infra-0. 값은 안전 아닌 비용절감이라 급하지 않음. |
| **greedy 아카이브 → path dependency** (§5.2) | **② Park — [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md)·[Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다](huxley-godel-machine.md) park 에 합류**(신설 X) | SICA 는 그 park("아카이브=엔진, 계보 집계")의 *병 증상*을 실물로 준다. 별도 항목 X — 기존 park 의 근거 보강. 트리거 상속. |
| 다기준 효용(cost/time) (§5.4) | **③ 순수참조** | 단일 작가·정액제라 이식 억지 = Karpathy #2. |
| overseer 다른-LLM 분리 | **③ 순수참조** | DGM node 114·HGM·survey §9.1 이 이미 준 "생성자≠평가자" 원리의 반복. 신규 diff 없음. |
| scaffold 가 강한 모델 해침 (§3.1) | **③ 순수참조 + 하네스 철학 보강** | agent-harness "과한 스캐폴드 경계" 의 외부 실측 근거. 반영 diff 아님(기존 원칙 지지). |
| repo 재현 주의 (§4) | **③ 순수참조** | vault 에서 SICA 실행 0. |

**반영 diff = 0건.** → **self-improvement 시리즈 4편 연속 0-diff.** 이건 실패가 아니라 **범주 신호** — 4편 다 *자율 RSI 시스템*이고 vault 는 *HITL-bound* 라 알고리즘이 아니라 어휘·진단을 준다. 다만 park 가 쌓인다(edge-bench EdgeBench-lite / gate-scripts-lock / archive=engine·clade / overseer). **⚠️ 다음 self-improvement 논문 흡수 전, park 백로그를 1회 합산 검토할 것**(review_trigger 에 박음) — 개별 park 는 각자 트리거 미발화지만, 4편이 같은 방향(vault 는 greedy·사후·품질만 판정)을 가리키면 그 *수렴 자체*가 작가 상신감일 수 있다.

---

## 7. Anti-Overclaim (게이트 가드)

- ❌ "17%→53%" 를 full SWE-Bench 로 → **50문제 무작위 subset**. 표 값은 0.51(본문 산문 53%, 초록 53% — subset·5분 타임아웃 하).
- ❌ SWE-Bench 향상 = 추론력 향상 → **상당 부분이 편집 속도·비용 개선**(저자 §5.1 자인). 5분 타임아웃이 초기 점수를 눌렀다가 효율화로 회복한 측면.
- ❌ "스캐폴드는 항상 도움" → **§4.1: 강한 추론 모델(o3-mini 87/79%)에 스캐폴드 씌우니 76% 로 하락.** scaffold saturation.
- ❌ "SICA = 아카이브 없음" (**내가 저지른 오류**) → 아카이브 있음, **greedy 선택**(best-so-far).
- ❌ "SICA 가 Gödel machine 근사" → SICA 는 그런 주장 안 함. Σ-only·greedy hill-climb. GM 근사 주장은 HGM.
- ⚠️ **논문 30s vs 코드 60s** overseer 간격(§4 가). "논문=코드" 인용 금지.
- ⚠️ committee 툴이 iter-0 인지 자기발견인지 **미확증**(§4 나). "SICA 가 스스로 판정 패널을 발명" 주장 금지.
- ⚠️ **workshop paper** — full conference 논문 아님. DGM(ICLR)·HGM(ICLR oral)보다 증거 등급 낮음. v2 통독.

---

## 8. 열린 질문

- vault 의 worktree-accept(사후 격리)로 정말 충분한가, 아니면 Codex 장기 run 에 SICA식 실행-중 overseer 가 토큰을 아끼나? 데이터가 없다 — 첫 "가망없는 Codex run 이 끝까지 돈" 사건이 답을 준다.
- SICA 가 강한 모델에서 손해 본 것(§3.1)이 vault 에도? vault 는 Opus 에 무거운 CLAUDE.md·hot.md 주입 표면을 씌운다 — 그게 **강한 모델의 판단을 끊는** scaffold saturation 인 적은 없나? (주입 표면 = 안전장치지만 SICA 는 그게 마이너스일 수 있다고 실측.)
- 4편 연속 0-diff — park 백로그(4건)가 같은 방향을 가리킨다. 이건 "vault 를 SICA→DGM→HGM 축으로 진화시켜라"는 신호인가, 아니면 "vault 는 HITL 이라 그 축이 애초에 무관"이라는 신호인가?

---

## 9. 다음 학습 후보

- **ADAS (Hu et al. 2025)** — **3편 연속** 후보(DGM·HGM·SICA 전부의 조상 베이스라인). 고정 메타에이전트 = "Claude 제안 + Claude 게이트" vault 구조의 정확한 대조군. **3연속 = 강한 갭 신호. 1순위.**
- **Gödel Agent (Yin et al. 2024)** — SICA 가 "범용 코딩 에이전트 아님(action_adjust_logic 같은 특수 툴)"으로 구분한 대상. monkey-patching 자기수정 = vault 의 "게이트 스크립트 수정 가능성"(DGM §5.3 park)과 직접 관련.
- **Voyager (Wang et al. 2023)** — survey·다수가 skill library 원형으로 인용. object-level skill(§survey 2.3)의 교과서. vault skill=U 렌즈(survey park)와 연결.
- **ACE 원논문 (arXiv 2510.04618)** — **4편 연속** 미독 부채. 이제 절대 우선.
- **AlphaEvolve (Novikov et al. 2025)** — SICA·survey 가 "θ 까지 건드리는 다음 단계"로 인용. Σ→θ 경계.

---

## 10. 연결된 페이지

- [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) — SICA 의 greedy 를 열린탐색으로 교체한 직후속. "most similar concurrent work"
- [Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다](huxley-godel-machine.md) — SICA 를 베이스라인으로(Table 2 컨텍스트 초과 사망). MPM 동기 = SICA path-dependency
- [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) — Σ-only 자기개선 교과서 사례
- agent-observability-inbox — overseer callgraph+event stream 의 관측 어휘 계열
- agent-harness — 서브에이전트 컨텍스트 격리 = dispatch/RTK 원형. scaffold saturation = 과한 하네스 경계 실측
- hermes-loop · [Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md)
