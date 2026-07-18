---
created: 2026-07-17
updated: 2026-07-17
type: learning
tags: [rsi, self-improvement, metaproductivity, clade, thompson-sampling, archive, measurement, godel-machine]
source: https://arxiv.org/abs/2510.21614
authors: [Wenyi Wang, Piotr Piękos, Li Nanbo, Firas Laakom, Yimeng Chen, Mateusz Ostaszewski, Mingchen Zhuge, Jürgen Schmidhuber]
year: 2025
category: technique
---
<!-- HGM: "벤치마크 점수 ≠ 자기개선 잠재력"(MPM)을 실증하고, 후손 성과를 계보 단위로 집계(CMP)해 탐색을 이끈 DGM 후속. vault 델타 = 즉시성과 판정의 구조적 오류. -->

# Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다

*Wang · Piękos · **Li Nanbo** · Laakom · **Yimeng Chen** · Ostaszewski · **Mingchen Zhuge** · **Schmidhuber** (KAUST). v3 2025-10-29 · **ICLR 2026 oral**.*

[Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) 직계 후속 — repo 가 DGM 코드베이스 위에 지어졌다고 README 가 명시(Acknowledgement). [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md)·[Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) 두 노트에서 연속 1순위로 올렸고 작가가 집었다.

> ⚠️ **먼저 읽을 것 (§7 이해관계)**: HGM 저자 8인 중 **5인**(Wang·Li Nanbo·Chen·Zhuge·Schmidhuber)이 [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) 저자와 겹친다. 즉 그 서베이가 HGM 을 "DGM 후속·측정 시도"로 배치한 건 **자기인용**이다. 내가 두 노트에서 HGM 을 1순위로 추천한 근거의 일부가 그 배치였다 — **추천 근거 일부가 무효**임을 먼저 밝힌다.

---

## 1. 한 줄 요약

> DGM·SICA 는 *"벤치마크 점수 높은 에이전트가 좋은 자기수정을 낳는다"* 를 암묵 가정한다. HGM 은 그게 **틀렸음을 실측**하고(Metaproductivity–Performance Mismatch), 한 노드의 가치를 그 노드 점수가 아니라 **그 노드가 낳은 후손 전체(clade)의 성과 집계**로 재정의한다.

---

## 2. 핵심 3

### 2.1 ⭐ MPM — Metaproductivity–Performance Mismatch

논문의 심장이다.

> "a high-scoring agent may produce **unproductive descendants**, while a lower-scoring one **seeds lineages that achieve greater long-term gains**."

즉 *지금 잘하는 것*(performance)과 *앞으로 잘 낳는 것*(metaproductivity)은 다른 축이다. DGM/SICA 의 선택 휴리스틱은 전자를 후자의 대리물로 쓰는데, 논문은 그 상관이 **약하다는 걸 수치로** 보인다(§3 Table).

### 2.2 GMP → CMP (측정 가능한 데까지 좁히기)

- **GMP (Global Metaproductivity)** — 이 노드를 확장했을 때 *트리 전체*가 최종적으로 도달할 성능의 기대값. 논문이 명시: **RL 의 Q-value 와 직접 대응**(상태=아카이브, 행동=확장할 노드). 이게 진짜 목표지만 *조작·추정이 너무 넓다*.
- **CMP (Clade-Metaproductivity)** — GMP 를 **그 노드를 뿌리로 한 부분트리(clade)** 로 국소화. Huxley 의 clade(공통 조상 계보) 개념에서.

**추정기는 놀랍게 단순하다** — clade 안 모든 노드의 성공/실패 횟수를 그냥 합친다.

```
CMP̂(a) = n^C_success(a) / ( n^C_success(a) + n^C_failure(a) )
        여기서 n^C_*(a) = Σ over a' ∈ clade(a)
```

장점 2개를 논문이 든다. ① 자기개선 목표와 정렬 — *변변찮은 조상도 후손이 계속 전진하면 가치 있다*. ② **통계적 견고성** — 노드 하나의 결과보다 clade 집계가 표본이 많다(평가가 비싸고 벤치마크가 부분 관측일 때 결정적).

### 2.3 Theorem 1 — 그리고 그 가격표

> **"Under Assumption 1, access to the CMP oracle is sufficient to implement the Gödel Machine."**

멋진 문장이지만 **Assumption 1 을 반드시 같이 읽어야 한다**(논문 §3.1, 4개):

1. 목적함수는 **최종 에이전트만**의 함수 — 종료 전 보상 없음.
2. **repeatable trials** — 임의의 (에이전트, 과제) 쌍의 기대 결과가 *평가 시점·이전 사건과 무관*. 테스트 환경은 매번 리셋.
3. Gödel machine 의 **증명은 예산을 소모하지 않음**.
4. 자기수정 1회 = 예산 **정확히 1단위**.

원래 Gödel machine 은 *단 한 번의 삶*(반복 시행 없음)과 *증명이 실시간 자원을 먹는다*는 걸 명시적으로 다뤘다. HGM 의 Theorem 1 은 **그 두 개를 빼버린 세계**에서 성립한다. 정직하게 말하면 — HGM 은 "Gödel machine 을 근사"했다기보다 **Gödel machine 이 풀던 문제를 훨씬 쉬운 문제로 바꾼 뒤 그 안에서 최적**이다. 논문 스스로 "our scope is specialized with respect to the general setup" 이라 쓴다.

### 2.4 알고리즘 — 확장과 평가의 분리

DGM·SICA 는 세 결정을 **뭉쳐서** 한다: 부모 확장 → 자식 생성 → **그 자식을 즉시 여러 과제로 평가**. 논문의 지적이 날카롭다.

> "once a new agent is generated, it **monopolizes evaluations**, even if older agents appear more promising. For instance, an agent that fails nine tasks in a row continues to consume evaluations, while an older agent with partial successes is ignored."

HGM 은 셋을 쪼갠다 — **선택 정책**(확장할까 평가할까) / **확장 정책**(어느 부모를) / **평가 정책**(어느 에이전트를). 그리고 **평가 단위 = (에이전트, 과제) 쌍 1개**. → 가망 없는 놈에게서 **조기 중단** 가능.

- **확장 정책**: clade 집계로 Thompson Sampling — `a* ~ TS(τ(1+n^C_success), τ(1+n^C_failure))`
- **평가 정책**: 노드 *자체* 성적으로 TS(clade 아님) → clade 안에서 soft-max 를 유도(고성능 노드가 표본을 더 먹어서 CMP̂ 가 clade 최대값 쪽으로 기움)
- **선택 정책**: 무한팔 밴딧의 **UCB-Air** 차용 — `N_t^α ≥ |T_t|` 이면 확장(새 팔 추가), 아니면 평가
- **τ 스케줄러**: 시간에 단조 증가 → 초반 탐색, 후반 분포 극화(exploitation)
- **최종 선택**: best-belief agent = 효용 사후분포의 ε-분위수 최대 노드(정규화 불완전 베타 함수)
- **비동기**: 확장/평가 분리 덕에 CPU 마다 독립 iteration → 병렬

---

## 3. 수치 — 조건 붙여서

**MPM 실증 (Pearson 상관, 추정기 vs 경험적 CMP)**

| 추정기 | SWE-Verified-60 (weighted / un-w) | Polyglot (weighted / un-w) |
|---|---|---|
| SICA | 0.444 / 0.444 | 0.274 / 0.274 |
| DGM | 0.285 / 0.406 | 0.383 / 0.357 |
| **HGM** | **0.778** / 0.512 | **0.626** / **0.873** |

→ DGM·SICA 추정기는 **양의 상관이지만 약함**(0.27~0.44) = MPM 의 증거. HGM 이 크게 앞섬.

**자기개선 능력 (800 평가 예산, best-belief agent)**

| | SWE-Verified-60 Acc / CPU-h | Polyglot Acc / CPU-h |
|---|---|---|
| SICA | 50.0% (+10) / **infinite loop** | 25.4% (+5.1) / 572 |
| DGM | 53.3% (+13.3) / 1231 | 27.1% (+6.8) / 2385 |
| **HGM** | **56.7%** (+16.7) / **517** | **30.5%** (+10.2) / **347** |

- Polyglot 에서 DGM 대비 **6.86× 빠름**, SICA 대비 1.65×. SWE-Verified-60 에서 DGM 대비 2.38×.
- ⚠️ SICA 의 SWE-Verified-60 은 360 평가 후 **"query length out-of-LLM-context-window" 무한루프** — 시간 비교 자체가 성립 안 함(논문 자인).

**인간 대비 (§4.3)**
- full SWE-Verified(500 태스크), **8000 평가**, 초기 에이전트 53.2% → **61.4%**. GPT-5-mini 기반 리더보드 1위, 전체 checked 제출 중 top-10(5× 비싼 백본 대비).
- SWE-Lite 일반화: HGM 최적화체 **40.1%**(filtered, 완전 미관측) / 49.0%(standard). 초기 조상 34.8/44.0, SWE-agent+GPT-5-mini 39.6/47.6.
- GPT-5 로 백본 교체 전이: 47.8 / **57.0** vs SWE-agent(LB 1위) 48.3 / 56.7.

⚠️ 저자가 직접 단 경고: *"higher scores on the leaderboard do not necessarily indicate superior general coding ability—since **both human- and machine-designed agents may overfit** to the benchmark."*

---

## 4. ⭐ repo 대조 — 논문에 없는 것 3

clone 통독(paper-study §1 "가능하면 직접 접근")의 값이 여기서 나온다. commit `013872d`, `run.sh` = `python hgm.py` (플래그 없음 → `config.yaml` 기본값 사용).

**(가) 배포 기본값이 논문 실험 설정과 다르다 — τ 스케줄러가 꺼져 있다.**
논문 §4: *"we employ HGM with an exploration-exploitation scheduler B/b, ε=1, and α=0.6."*
코드(`hgm.py:363`): τ 보정은 **`if opt_cfg.cool_down:` 안에서만** 적용된다.
`config.yaml:23` → **`cool_down: false`**. `config.py:25` 기본값도 `False`.
→ `./run.sh` 그대로 돌리면 **τ 없이** `TS(Beta(1+n_s, 1+n_f))` 순수 톰슨 샘플링이다. 플래그 `--cool_down` 이 존재하므로 논문 설정은 *도달 가능*하지만, **기본 재현 경로가 논문 실험과 일치하지 않는다**. (α=0.6 은 일치.)

**(나) clade 뿌리 감쇠 장치가 있는데 기본값으로 무력화돼 있다.**
`tree.py:45-54` 에 `get_pseudo_decendant_evals(num_pseudo)` 가 있다 — 노드 자신의 평가 수가 `num_pseudo` 이상이면 자기 기여를 `[mean_utility] * num_pseudo` 로 **캡**해서, 많이 평가된 뿌리가 자기 clade 추정을 지배하지 못하게 막는다. **논문 수식엔 이 감쇠가 없다**(단순 합).
그런데 `config.yaml:29` → **`n_pseudo_descendant_evals: 10000`**. 예산이 800 평가인데 10000 이면 `num_evals < num_pseudo` 가 **항상 참** → 캡이 절대 안 걸린다. 즉 **기본 실행에선 논문 수식 그대로**이고, 감쇠 장치는 코드에만 있고 꺼져 있다.

**(다) 모든 경로가 살아있지 않다 — DGM 과 다르다.**
`hgm.py:385-389` 확장 후보 필터:
```python
nodes = [node for node in hgm_utils.nodes.values()
         if np.isfinite(node.mean_utility) and node.mean_utility > 0]
```
`mean_utility` 는 미평가 시 `np.inf`(`tree.py:63`) → **미평가 노드는 확장 불가**(먼저 평가돼야 함, 분리 정책상 자연스러움). 하지만 **`mean_utility > 0`** 때문에 **지금까지 전부 실패한(0점) 노드는 영구히 확장 대상에서 제외**된다.
[Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) 은 *"All agents retain a **non-zero selection probability**, ensuring that any path to improvement remains feasible"* 를 명시적 설계로 내세웠다. HGM 은 그 보장을 버렸다 — 논문 본문에 이 사실이 서술돼 있지 않다(내가 통독 범위에서 못 찾음). **가벼운 긴장**: MPM 명제("낮은 점수가 좋은 계보를 씨뿌릴 수 있다")와 "0점은 잘라낸다"가 같은 방향은 아니다. 물론 1/20 만 맞아도 살아남으므로 *완전* 모순은 아니다.

> 위 3건은 **결함 주장이 아니라 재현 주의사항**이다. 논문 결과가 틀렸다는 근거 0 — 저자들이 실험 시 플래그를 줬을 수 있다. 다만 *"repo 를 clone 해서 run.sh 를 돌리면 논문 설정이 재현된다"* 는 **거짓**이다.

---

## 5. 내 생각 — Sub-brain 관점

### 5.1 직접적 연결: **높음** (AI NPC = 해당 없음). 알고리즘 이식 = **불가**

paper-study §2 정직 판정: AI NPC blueprint = **해당 없음**. 직접 적용 vs 개념 = **개념**. 시급성 = **지금**. HGM 알고리즘 자체는 vault 에 이식 불가 — 800~8000회 자동 평가·Docker·CPU-h 수백 = infra-0 정면 충돌이고, vault 는 SWE-bench 를 풀지 않는다.

### 5.2 ⭐ MPM 이 vault 의 판정 규칙 전부를 겨눈다

이게 이 논문이 vault 에 주는 **유일하고 진짜인** 물건이다.

vault 는 "이게 좋은 학습/스킬/패치인가"를 **전부 즉시 성과**로 판정한다.

| vault 규칙 | 판정 기준 | HGM 진단 |
|---|---|---|
| use-ledger — **8주 무사용 = 강등 후보** | 그 노드 *자신*이 쓰였나 | **MPM 그 자체.** 그 노트가 직접 안 쓰였어도, 그것이 낳은 후속 노트·패치·스킬이 잘 쓰이면 그 노트는 **생산적인 조상**이다 |
| `.incubator` 승격 = **실사용 입증**(무입증 8주 = 강등) | 그 스킬 *자신*의 호출 | 같은 축 |
| [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) L1~L3 | 그 기억 *자신*의 회상·종합 | 같은 축 |
| skill-curator `state: stale`(mtime 30일) → `archived`(90일) | 그 파일 *자신*의 mtime | 같은 축. **가장 순수한 greedy** |

HGM 언어로 옮기면 vault 는 전부 **utility(a)** 로 판정하고 **CMP(a)** 는 한 번도 안 본다. 그리고 HGM 의 실측(0.27~0.44 상관)은 그 대리가 **약하다**고 말한다.

**vault 에 clade 가 이미 있다는 게 결정적이다.** DGM/HGM 은 계보를 만들려고 트리를 명시 구축해야 했지만, vault 의 계보는 **이미 그래프에 있다** — `wikilink` 인용 관계, `스테이징 영역` 의 파생, `related_to` 프론트매터, log.md 의 "이 학습 → 저 반영". graphify 가 그 그래프를 이미 뽑는다. 즉 vault 의 CMP̂ 등가물은 **"이 노드를 조상으로 하는 후속 산출물들이 실제로 쓰였나"** 이고, 계산에 필요한 구조가 이미 존재한다.

구체적 예가 이 세션 안에 있다 — [EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md)(07-04)는 **자기 자신은 8주 가까이 조용**했다. use-ledger 기준으로는 강등 후보에 가깝다. 그런데 오늘 [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) §6.5 와 [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) §5.4 **둘 다** 그 노트 위에서 판정을 내렸다 — 없었으면 나는 "vault 는 측정을 안 한다"고 **틀린 진단**을 박제할 뻔했다. edge-bench 는 utility 는 낮고 **CMP 는 높은** 노드다. 정확히 HGM 이 말하는 그 유형이다.

### 5.3 [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) park 과 합류한다 (새 park 신설 X)

어제 DGM 노트에서 park 한 게 *"아카이브 = 엔진 — 기각안이 디딤돌"* 이었고, 트리거는 *"기각된 패치·후보가 나중에 되살아나 유용했던 사례 1건"* 이었다. HGM 은 **그 park 을 정량화하는 방법**(clade 집계)을 준다. 별도 park 을 만들지 않고 **같은 항목에 방법론으로 얹는다** — 그게 §5.2 표의 use-ledger 축까지 포함하도록 범위만 넓힌다.

그리고 §5.2 의 edge-bench 사례가 **그 트리거의 첫 후보**다. 다만 아직 use-ledger 가 edge-bench 를 *실제로 강등시킨* 건 아니다 — 강등이 일어나야 "규칙이 손해를 냈다"는 실증이 된다. 그래서 여전히 park(트리거 미발화).

### 5.4 Theorem 1 은 vault 에서 **전부 깨진다** — 정직 선언

Assumption 1 의 4개를 vault 에 대보면.

| 가정 | vault |
|---|---|
| 최종 에이전트만이 목적, 종료 전 보상 없음 | ❌ vault 는 **과정 내내** 작가가 가치를 받는다. 종료 자체가 없다 |
| **repeatable trials** — 평가가 시점·이전 사건과 독립 | ❌ vault 작업은 **1회성·비재현**. 같은 논문을 두 번 흡수할 수 없다 |
| 증명이 예산을 안 씀 | ❌ vault 에선 게이트·검증이 곧 토큰(RTK) |
| 자기수정 1회 = 1단위 | ❌ 패치마다 비용이 천차만별 |

→ **Theorem 1 은 vault 에 적용 불가.** "CMP 오라클이면 Gödel machine" 을 vault 맥락에서 인용하는 건 금지. 가져오는 건 **정리가 아니라 휴리스틱**(계보 집계가 즉시 점수보다 낫다)이고, 그건 가정 없이도 쓸 수 있는 *렌즈*다.

### 5.5 인접 노드 델타

- **[Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md)** — 직계 부모(코드까지). DGM = 아카이브를 *유지*하면 좋다(ablation). HGM = 아카이브를 **어떻게 읽을지**(clade 집계). 그리고 HGM 이 DGM 의 선택 휴리스틱을 **정면 반박**한다. 두 노트 같이 읽어야 함.
- **[Red Queen Gödel Machine — 평가자까지 같이 진화시키는 자기개선](red-queen-godel-machine.md)** — RQGM 은 *평가자*를 진화시켜 verifier 포화를 푼다. HGM 은 평가자를 고정하고 *선택 기준*을 고친다. **직교하는 두 수리**(무엇으로 고를까 vs 무엇으로 잴까). 둘 다 DGM 을 부모로 갖는 형제.
- **[EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md)** — 측정 축의 이웃. edge-bench = *시간축* 학습곡선(best-so-far·plateau·breakthrough). HGM = *계보축* 집계. **둘 다 "최종 점수 하나로 판정하지 마라"의 다른 절단면.** 합치면 (시간 × 계보) 2축.
- **[Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md)** — §6.5 에서 park 한 "회귀율"과 **다른 축**이다. 회귀율 = 후퇴 감지. CMP = 조상 가치 재평가. 혼동 금지.
- exact duplicate 없음(`2510.21614`·`HGM`·`CMP`·`Metaproductivity-Performance Mismatch`·`clade` = vault 미보유).

---

## 6. 학습→반영 루프 판정 (게이트 exit 3-way)

| 수확 | 판정 | 사유·트리거 |
|---|---|---|
| **MPM/clade 렌즈** → 즉시성과 판정(use-ledger 8주·incubator·curator mtime)의 구조적 오류 (§5.2) | **② Park — [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) "아카이브=엔진" park 에 합류**(신설 X) | HGM 이 그 park 에 *방법*(계보 집계)을 얹고, 범위를 use-ledger/curator 축까지 넓힌다. **트리거 = 기존 것 상속 + 구체화**: *use-ledger/curator 가 강등시킨 항목이 이후 후속 산출의 디딤돌이었음이 드러나는 사례 1건*. [EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md) 가 첫 후보이나 **아직 강등 안 됨 → 트리거 미발화**. 규칙 변경 = §5.7 **L-STAGE**(스테이징까지만)이고 근거는 아직 vault 실손해 0건. |
| repo 재현 주의 3건 (§4) | **③ 순수참조** | HGM 을 vault 에서 돌릴 계획 0(infra-0). 기록 가치만 — 이 계열 논문을 재현·인용할 때 "run.sh ≠ 논문 설정" 을 알고 있어야 함. |
| Theorem 1 / Assumption 1 | **③ 순수참조 + 적용 불가 선언** | vault 에서 4개 가정 전부 깨짐(§5.4). 반영처 없음. |
| 확장/평가 분리 (§2.4) | **③ 순수참조** | vault 는 자동 평가 루프가 없어 분리할 대상이 없다. 억지 이식 = Karpathy #2. |
| 저자 중복 발견 (§7) | **③ 순수참조 — 단 내 추천 근거 정정** | [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) 의 "다음 후보" 서술에 자기인용 고지 1줄 추가(반영 diff 아님, 정직성 표기). |

**반영 diff = 0건.** 3편 연속 0건 — 정직 선언. 세 논문 다 vault 를 *진단*했지 vault 를 *고칠 근거*는 아직 못 줬다. park 은 여전히 **1건**(DGM 것에 합류, 신설 0).

---

## 7. Anti-Overclaim (게이트 가드)

- ⚠️⚠️ **저자 중복 = 5/8** — HGM 저자(Wang·Piękos·**Li Nanbo**·Laakom·**Yimeng Chen**·Ostaszewski·**Zhuge**·**Schmidhuber**) 중 5인이 [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) 저자. **서베이가 HGM 을 후속으로 배치한 건 자기인용.** "서베이가 독립적으로 HGM 을 지목했다" 는 서술 금지. 내가 2회 연속 1순위로 추천한 근거의 일부가 여기 걸린다.
- ❌ "HGM 이 Gödel machine 을 근사" 를 **무조건** 인용 → **Assumption 1**(반복시행 가능·증명 무비용·단일 목적) 하에서만. 원 Gödel machine 이 명시적으로 다루던 *단일 생애*와 *증명의 시간 비용*을 **제거한** 세계다.
- ❌ "56.7% vs DGM 53.3%" 를 full 벤치마크로 → **SWE-Verified-60**(60태스크 subset). full SWE-Verified 값은 **61.4%**(8000 평가, 초기 53.2% 에서).
- ❌ SICA 와의 CPU-h 비교(SWE-Verified-60) → SICA 가 **컨텍스트 초과 무한루프**로 죽었다(360 평가 후). 시간 비교 무의미(논문 자인).
- ❌ **"human-level 달성"** 을 일반 주장으로 → SWE-bench **Lite**, **checked submissions** 한정, **백본 매칭**(GPT-5-mini) 조건. 저자 자인: *"both human- and machine-designed agents may **overfit**"*.
- ❌ "6.86× 빠름" 을 전체로 → **Polyglot 한정**. SWE-Verified-60 은 2.38×.
- ⚠️ **표↔본문 수치 불일치**: Table 1 의 Polyglot unweighted = **0.873**, 본문 산문은 **"0.8783"**. 사소하나 인용 시 표 값 기준.
- ⚠️ **상관계수의 통계적 취약** — 트리 노드는 독립이 아니다(부모·자식이 평가를 공유). 저자가 target leakage 보정(clade 뿌리 제외·최대 포함 서브트리 제외)을 했다고 밝히나, n 이 작고 노드 의존성이 남는다. Pearson r 을 강한 인과 근거로 인용 금지.
- ⚠️ **`run.sh` ≠ 논문 설정** (§4 가·나). 재현 주장 시 필수 고지.
- ⚠️ Schmidhuber 라인 + KAUST 자금(award 5940). Gödel machine 계보는 이 그룹의 **연구 강령**이기도 하다.

---

## 8. 열린 질문

- vault 의 CMP̂ 를 실제로 계산한다면 clade 는 무엇인가 — `wikilink` 인용? `related_to`? log.md 의 "이 학습 → 저 반영"? **어느 간선이 "낳았다" 인가**가 정의돼야 계보가 선다. graphify 그래프가 이미 있는데 *부모-자식* 방향이 명시적인가?
- HGM 의 평가 정책은 clade 가 아니라 **노드 자체** 성적으로 표본을 배분한다(soft-max 유도). vault 에 옮기면 "잘 쓰이는 노트를 더 자주 재검토" 인데 — 그건 이미 hot.md 가 하는 일 아닌가? 그러면 vault 에 없는 건 **확장 정책**(clade 기반 선택)뿐인가?
- `mean_utility > 0` 컷(§4 다)의 vault 등가물이 있나? "한 번도 안 쓰인 노트는 후속의 조상이 될 수 없다"고 우리가 이미 가정하고 있진 않나?

---

## 9. 다음 학습 후보

- ~~**SICA (Robeyns et al. 2025)**~~ → ✅ **흡수 완료 2026-07-18** = [Self-Improving Coding Agent (SICA) — DGM·HGM 의 공통 조상](self-improving-coding-agent-sica.md). ⚠️ **정정**: "아카이브 없는 단일 에이전트"라 썼으나 **틀림** — SICA 는 아카이브를 *가지되* best-so-far 를 **greedy 하게** 선택(hill-climbing). 그게 오히려 vault 현재 형태의 더 정확한 원형(즉시 성과 판정). HGM Table 2 컨텍스트 초과 사망 = SICA §5.1 path-dependency 의 귀결.
- **ADAS (Hu et al. 2025)** — DGM 의 `w/o self-improve` 정체 = 고정 메타에이전트. "Claude 가 제안하고 Claude 가 게이트" 하는 vault 구조 진단에 직결. (DGM 노트에서도 후보로 올림 — **2회 연속 = 실제 갭 신호**.)
- **Success-Story Algorithm (Schmidhuber & Zhao 1996)** — HGM §5 가 "hindsight 로, 장기 보상률을 못 올린 자기수정 시퀀스를 **되돌린다**" 고 요약. **회귀 축**([Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) §6.5 park)의 30년 된 원형. 짧고 고전.
- **Huxley (1957) clade** — 개념 원출처. 저비용.
- **ACE 원논문 (arXiv 2510.04618)** — 3회 연속 미독 부채. 이제 [Agentic RL Self-Evolving Agents (arXiv 2607.01120)](agentic-rl-self-evolving-agents.md)·survey 2곳에서 인용 중.

---

## 10. 연결된 페이지

- [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md) — 직계 부모(코드 기반). HGM 이 그 선택 휴리스틱을 반박. park 합류처
- [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) — Σ 좌표. **⚠️ 저자 5인 중복(자기인용)**
- [Red Queen Gödel Machine — 평가자까지 같이 진화시키는 자기개선](red-queen-godel-machine.md) — 형제(평가자 진화). HGM 과 직교
- [EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md) — 측정의 시간축. HGM = 계보축. §5.2 의 실사례 당사자
- use-ledger · [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) · skill-curator — MPM 이 겨누는 vault 규칙들
- hermes-loop · [Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md) · graphify
