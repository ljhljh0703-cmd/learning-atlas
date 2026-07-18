---
created: 2026-07-17
updated: 2026-07-17
type: learning
tags: [self-improving-agents, rsi, scaffold, harness, skill, godel-machine, evaluation, survey]
source: https://arxiv.org/abs/2607.13104
authors: [Zhe Ren, Yimeng Chen, Dandan Guo, Guowei Rong, Tonghui Li, R. B. Xiong, Qingfeng Lan, Wenyi Wang, Li Nanbo, Yibo Yang, Mingchen Zhuge, Jürgen Schmidhuber]
year: 2026
category: technique
---
<!-- 자기개선 에이전트 분야를 A=(θ,Σ) 단일 형식으로 통합한 서베이. vault 가 하는 모든 자기개선은 Σ-개선이라는 좌표를 준다. -->

# Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)

*Ren·Chen·Guo 외 12인 — Jilin Univ / KAUST / Univ. of Alberta / IDSIA (교신 라인 = Mingchen Zhuge, Jürgen Schmidhuber). 2026-07-14 제출.*

서베이다 — 새 실험도, 새 벤치마크도, 자체 수치도 없다. 이 논문이 파는 건 **어휘**다. 흩어진 self-correction·meta-prompting·self-play·memory evolution 을 하나의 형식 `A_t = (θ_t, Σ_t)` 로 묶고, "무엇을 바꾸는가(update target)"와 "무엇이 바꾸게 하는가(signal)" 두 축으로 분야 전체를 재배열한다.

---

## 1. 한 줄 요약

> 에이전트를 **모델(θ) + 스캐폴드(Σ)** 로 쪼개고, 자기개선을 *스스로 유발한 갱신 연산자 `U`* 로 정의하면 — 이 분야의 거의 모든 기법이 "θ를 고치나 Σ를 고치나 / 신호를 어디서 얻나" 두 질문의 조합으로 정리된다.

---

## 2. 핵심 개념

### 2.1 형식 — `A_t = (θ_t, Σ_t)`, `Σ = (p, m, T, g)`

에이전트 설정 = 파운데이션 모델 파라미터 `θ` + 운영 스캐폴드 `Σ`. 그리고 Σ 는 다시 넷으로 분해된다.

| 기호 | 실체 |
|---|---|
| `p` | 구조적 프롬프트·시스템 지시 |
| `m` | 메모리와 그 읽기·쓰기 정책 |
| `T` | 툴 집합 + 호출 인터페이스 |
| `g` | 라우팅·스케줄링·안전 제약 등 제어 로직 |

여기에 **일시적 실행 상태 `X_t`**(KV 캐시·중간 계획·작업 메모리)를 명시적으로 분리한 게 이 형식의 핵심 칼질이다. `X_t` 는 과제 경계를 넘으면 버려지므로 **에이전트의 본질적 구성이 아니다**. 대화 히스토리가 쌓이는 건 자기개선이 아니라는 뜻 — 자기개선은 `θ` 또는 `Σ` 에 *지속되는* 변경을 커밋할 때만 성립한다.

논문은 스캐폴드를 최근 통칭 **agent harness** 라 부른다고 각주로 인정하면서도, "모델을 둘러싼 *수정 가능한 구조*"를 강조하려 scaffold 를 택했다고 밝힌다.

### 2.2 자기개선 = 자기유발 갱신 연산자 `U`

```
A_{t+1} = U( A_{1:t},  E(π_{θ_t,Σ_t}; Σ_t, C_t) )
```

- `E` = 에이전트가 *자기 정책을 실행해서* 학습 신호를 뽑는 절차(궤적·비평·검증 결과·제안 패치).
- `Σ_t` 가 `E` 의 인자로 들어가 있는 게 의도적이다 — 에이전트가 **자기 프롬프트 템플릿을 비평하거나 자기 툴 설정을 감사하는** 직접 자기점검을 허용하려고.
- `U` 는 그 신호를 받아 `θ` 나 `Σ` 에 **지속 변경을 커밋**한다.

**자기참조의 두 모드**가 갈린다.
1. **간접(분포 수준)** — 정책을 실행해 데이터·평가·선호를 만들고, 그걸 외부 최적화 절차가 소비해 `θ` 를 바꾼다. 행동이 *미래 파라미터를 결정하는 데이터를 빚는다*.
2. **직접(행위 수준)** — 에이전트가 행동으로 자기 정의를 편집한다. 프롬프트 수정·메모리 재조직·툴 재구성. `Σ` 를 직접 고친다.

### 2.3 ⭐ Skill = 재사용 가능한 `U` 의 인스턴스

vault 관점에서 이 논문의 가장 값나가는 문단이다.

> "A skill's identity is **the update it encodes**; the substrate only names where it is stored."

- 스킬 = 에이전트가 *보유하고 재사용하는, 이름 붙은 자기 설정 갱신*. 저장 기판(툴 `T` / 지시 `p` / 메모리 `m` / 가중치 `θ` / 제어 `g`)은 **정체성이 아니라 주소**일 뿐이다. 그래서 "skill" 은 taxonomy 의 기판 축과 **직교**한다.
- **재사용의 두 형태**: ① 반복 호출되는 루틴 ② **설치형(installer)** — 딱 한 번 적용되지만 남기는 지속 변경에 가치가 있고, 에이전트·세션 간 이식 가능한 산출물로 남는다.
- **두 스코프**:
  - *object-level* — 과제·세계 상태에 작용(예: 나무 캐기 루틴). 계층적 RL 의 option 에 대응. `U` 는 *획득 시점*에 일어나고 호출 시점엔 없다.
  - *meta-level* — **에이전트 자신의 설정 `A_t` 에 작용**(툴을 새로 쓰기, 프롬프트 리팩터, 경험을 메모리로 통합, 자기 스캐폴드 패치). 자기개선에선 이쪽이 본체.
- 그리고 결정타: meta-level 스킬은 `A_t` 에 작용하면서 *자신도 `A_t` 로 직렬화*되므로 — **연산자가 자기 피연산자의 일부가 된다.** 그 스킬이 다시 개선되면 자기참조 루프(개선자가 개선 대상과 함께 진화)가 복원된다.
- **스킬 라이브러리 = 직렬화된 갱신들의 저장소 + 그 위의 인출 정책**. 같은 store-and-retrieve 구조가 툴 라우팅과 메모리 조직 양쪽에 반복 등장하는 이유가 이거라고 설명한다.

### 2.4 두 경로 — 속도·가역성의 구조적 비대칭

| | **θ 개선**(파라미터) | **Σ 개선**(스캐폴드) |
|---|---|---|
| 속도 | 느림 | 빠름 |
| 가역성 | 낮음 | 높음 |
| 비용 | 큼 | 작음 |
| 전이 | 도메인 넘어 amortize | 맥락 의존 |
| 표현 | 가중치에 흡수(불투명) | **명시적·검사 가능** |
| RL 대응 | 표준 정책 최적화 | **고전 RL 에 대응물 없음** — 상태·행동 공간과 MDP 자체를 바꿈 |

§9.1 의 문장이 이 표의 요점을 압축한다.

> "a bad prompt is easily reverted, but **a regression absorbed into model parameters is notoriously difficult to trace**."

그리고 파라메트릭 통합(distillation·fine-tune)은 **손실 압축**이라고 못 박는다 — 궤적을 가중치로 증류하면 모델이 *평균 케이스*로 편향되고, 탐색 중 발견한 **드물지만 결정적인 에러 복구 전략이 버려진다**. 그래서 `θ` 갱신은 기존 안전 경계를 무효화하며 적대적 재검증을 요구한다.

### 2.5 신호 분류

**θ 경로 (§5)** — ① *내재적 생성 시연*(자기가 만든 데모·데이터셋) ② *내재적 평가 피드백*(스칼라·선호쌍·일관성·비평) ③ *외재적 탐색 경험*(환경 궤적·실행 결과·world model 롤아웃).

**Σ 경로 (§6)** — 프롬프트(스칼라 → 질적 비평 → 개체군 진화 → **텍스트 그래디언트**로 신호가 구조화될수록 자동화됨) / 메모리(object·structure·processing 3축, CRUD 를 신호 구동으로) / 툴(라우팅·정제·자율 생성 = "Tool Governance Metacognition") / **풀 스캐폴드**(코드베이스 전체를 가변 기판으로 — ADAS·Gödel Agent·DGM·Huxley-Gödel Machine·Live-SWE-Agent·AlphaEvolve).

풀 스캐폴드의 형식은 vault 의 패치 규율과 소름 돋게 같은 모양이다.

```
Σ̃_{t+1} = Σ_t ⊕ Δ_t            # 현재 에이전트가 자기 코드에 패치를 생성
Σ_{t+1} = Σ̃_{t+1}  if V(Σ̃)=1   # 검증기(유닛테스트·회귀·안전검사)가 통과시킨 것만 커밋
        = Σ_t      otherwise    # 아니면 원상 유지
```

---

## 3. 실패 모드 (논문이 실명으로 나열한 것)

- **모델 붕괴·지식 거품** — 자기 생성 데이터로 재귀 학습하면 결함을 내면화하고, 다양성이 좁아져 *기존 편향을 강화할 뿐 새 능력이 안 생긴다*.
- **자기일관성의 함정** — "맞는 추론은 자기들끼리 일치한다"는 전제. **모델이 확신에 차서 틀리면 반복 샘플링이 같은 오답으로 수렴**한다. 오차가 샘플 간 상관되면 이 계열 전부가 취약.
- **언어를 통한 reward hacking** — 고전 RL 보다 쉽다. **검증기의 명세 자체가 언어 객체라서 에이전트가 조작할 수 있기 때문.** LLM judge 의 프롬프트 허점을 찔러 과제는 안 풀고 판정 조건만 만족시킨다.
- **능력 퇴행** — 좁은 외재 보상으로 RL 을 오래 돌리면 사전학습이 준 넓은 역량이 침식된다.
- **환각 동역학** — world model 이 그럴듯하지만 틀린 전이를 지어내고, 정책이 그걸 착취하도록 학습된다.
- **비평자 편향 과최적화** — 평가자가 개선 대상 정책과 밀착돼 있으면 공통 사각을 강화한다.

---

## 4. ⭐ 비평자 = 통치되는 인프라 (§9.1)

이 절이 vault 게이트 철학과 정면으로 만난다. 논문 주장 그대로:

- **닫힌 루프 안의 비평자는 수동적 벤치마크가 아니라 공격 표면이다.** 에이전트가 비평자를 상대로 최적화하는 순간 지름길을 찾을 유인이 생긴다.
- 따라서 **에이전트 능력의 천장은 대개 비평자의 exploit 저항성이 결정한다.**
- **제안하는 역할과 수용하는 역할을 한 주체가 겸하면 self-confirming loop 로 붕괴한다.** → 비평자는 생성자에서 분리.
- 비평자도 진화할 수 있지만 **자기가 평가하는 에이전트의 무제약 통제 아래 두면 안 된다.** 진화는 *단조 변경*(순수 추가형 테스트 생성 등)으로 제한하고 **human audit trail 로 게이트**.

**안전 = 계층적 게이팅** — 자기개선 에이전트는 **보호된 런타임에서 실행되는 신뢰할 수 없는 코드**로 취급하라. 풀 스캐폴드 체제에선 일회성 프롬프트 인젝션 같은 *일시적* 익스플로잇이, 오염된 메모리·탈취된 툴 로직이 안정 갱신으로 **커밋되면서 지속적 아키텍처 취약점으로 진화**한다. 그래서 커밋 전 검증기 게이트(기능 정확성·툴 권한 경계·상태 교란 견고성)를 통과해야 하고, 개선은 명시된·상시 감사되는 안전 경계 *안에서만* 허용된다.

---

## 5. 평가 프로토콜 (§8) — vault 에 가장 불편한 절

논문이 요구하는 보고 항목:

1. **최고점이 아니라 궤적을 보고하라** — `m_t` 를 반복 t 에 걸쳐, **고정 예산 `B_max`** 안에서. 체크포인트·수용 기준·조기중단 규칙을 명시. 없으면 무한 반복이 평가 분포에 과적합돼 peak 만 부풀린다.
2. **개선 신호 바깥으로의 전이를 시험하라** — 최적화 데이터와 겹치지 않는 held-out. 안전장치 2종 = 비공개 과제셋(hidden) 또는 **모델 컷오프 이후 생성된 과제**(temporally shifted).
3. **자원과 감독을 회계하라** — compute·토큰·wall-clock. 그리고: **"any reliance on external human oversight fundamentally compromises the 'self' in self-improvement."** HITL 을 썼으면 **그 규모와 양식을 정량 보고**하라.
4. **안정성·회귀·안전을 시간축으로 추적하라** — 평균 성공률이 아니라 *이미 풀었던 과제의 회귀율*·tail-risk·안전 위반.
5. **judge 를 쓸 거면** 모델 버전·프롬프트·루브릭·노출 증거를 전부 공개하고, **judge 예산을 에이전트 예산과 분리**하라(안 그러면 에이전트가 는 건지 평가자가 꼼꼼해진 건지 구분 불가). 그리고 **갱신을 구동한 judge 로 최종 보고하지 마라** — 다른 judge·직교 루브릭으로.

---

## 6. 내 생각 — Sub-brain 관점

### 6.1 직접적 연결: **높음** (단 AI NPC 연결은 **해당 없음**)

paper-study §2 정직 판정: AI NPC blueprint 레이어 = **해당 없음**. 이 논문은 NPC 인지가 아니라 *에이전트 운영 시스템*이다. 억지 연결 안 한다. 대신 **vault 자신이 이 논문의 대상**이다 — 북극성("작가의 모든 AI 가 학습·진화하는 운영 토대")이 정확히 SI-FMA 의 Σ 경로다. 직접 적용 vs 개념 수확 = **개념(어휘·좌표)**. 시급성 = **지금**(단 반영은 park, §7).

### 6.2 좌표 하나 — **vault 의 자기개선은 전부 Σ-개선이다**

vault Claude 는 `θ` 를 못 건드린다. 모델 라우팅(§4 비용 지침)은 θ 를 *고르는* 것이지 *바꾸는* 게 아니다. 그러므로 헌법·스킬·메모리·워크플로우·hot.md·게이트 — vault 가 하는 모든 진화는 `Σ = (p, m, T, g)` 위에서 일어난다. 이건 결핍이 아니라 논문 §9.1 이 *권장하는* 배치다: **"환경 피드백이 노이즈일 때는 갱신을 스캐폴드 안에 가두고 실행 테스트로 검증하라. 파라메트릭 통합은 행동이 안정적임이 입증될 때까지 미뤄라."** 단일 작가 vault 의 피드백은 정확히 저-신호·고-노이즈다.

→ vault 매핑: `p` = CLAUDE.md·hot.md 주입 표면 / `m` = wiki 전체 + preference-ledger + memory/ / `T` = skills/ + MCP + graphify / `g` = §5.7 3레인·③Gate·HITL·worktree-accept.

### 6.3 skill = U 렌즈가 실제로 무언가를 바꾼다

vault 의 `skills/` 는 지금 *폴더·SKILL.md 파일*로 정체성이 정의된다. 논문 렌즈로 보면 그건 **기판(주소)이지 정체성이 아니다**. 스킬의 정체성 = *그것이 인코딩하는 갱신*.

이 렌즈가 즉시 설명해주는 것 2가지.
- **"설치형 스킬"이라는 범주가 vault 에 이름 없이 이미 있다** — 한 번 적용되고 지속 변경만 남기는 것(헌법 패치·backfill·정합 복원). vault 는 이걸 "스킬"로 안 세고 있어서 `.incubator` 후보 판정 시 "반복 호출되나?"만 묻는다. 논문은 재사용의 두 형태 중 하나를 통째로 놓치고 있다고 말한다.
- **meta-level vs object-level 구분이 skill-curator 의 결측 축**이다. `graphify`(object-level: 그래프를 만든다) 와 `codex-gate`(meta-level: vault 설정을 바꾼다)를 같은 라이프사이클(mtime 30/90일)로 관리하는 게 맞는지는 최소한 *질문*은 된다.

### 6.4 §5.7 과 §9.1 의 독립 수렴 — 그리고 그 한계

2026-07-17 merge 된 헌법 §5.7(2조건·3레인)과 이 논문 §9.1 은 **서로 모르는 채 같은 결론에 도달**했다.

| 논문 §9.1 | vault |
|---|---|
| 제안 역할 ≠ 수용 역할, 겸하면 self-confirming loop | §5.7 L-STAGE(제안까지만) / L-HITL(수용은 작가) |
| 비평자 진화는 *단조 변경* + human audit trail | 기록 규율 — AI 추론 취향 = candidate only |
| 신뢰할 수 없는 코드 + 보호된 런타임 + 검증기 게이트 통과분만 커밋 | worktree-accept — done-gate 통과 diff 만 apply, 실패 시 본 repo untouched |
| 가역적 Σ 에 갱신을 가두고 검증 | §5.7 조건 ① 가역·격리·복구 가능 |

⚠️ **과장 가드**: 이건 *수렴*이지 *검증*이 아니다. 논문은 vault 를 모르고, vault 를 측정하지 않았다. "논문이 우리 헌법을 입증했다"는 주장은 금지 — 말할 수 있는 건 "독립적으로 같은 실패 모드를 지목했다"까지다.

그리고 §5.7 에 **없는** 축이 논문에 하나 있다: **"비평자의 exploit 저항성이 능력 천장"**. vault 의 비평자 = ③Gate, 그리고 그 Gate 를 도는 것도 Claude 다. §5.7 은 *레인*(누가 결정하나)은 나눴지만 *게이트 자체의 착취 저항성*은 다루지 않는다. [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md) 가 이미 인접 자리에서 같은 통증을 기록한 바 있다.

### 6.5 측정 — 대부분 [EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md) 가 이미 먹었다. 남은 건 하나다

§8 을 처음 읽으면 "vault 는 개선을 측정하지 않는다"고 쓰고 싶어진다. **틀렸다.** 2026-07-04 [EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md) 흡수가 §8 의 알맹이를 이미 vault 좌표로 옮겨놨다 — 그리고 이 서베이는 **그것을 독립적으로 재확인**해준다.

| §8 요구 | vault 현황 |
|---|---|
| 최고점 말고 궤적 | ✅ edge-bench §1 learning-curve 지표로 흡수(best_score·plateau·breakthrough) |
| 갱신 구동 judge ≠ 보고 judge / criteria-hacking 차단 | ✅ **반영 완료** — ③Gate = "hidden judge + trajectory auditor"(edge-bench Apply diff (a)) |
| 중간 상태 관측 | ✅ auto-eval snapshot 개념 흡수 |
| telemetry 필드 | ⏸ EdgeBench-lite 로 **PARK**(트리거 = 다중 시도 telemetry 가 실제 필요해지는 첫 실전 루프) |
| **회귀율** — 이미 풀었던 게 깨졌나 | ❌ **없다. edge-bench 에도 없다.** |

두 논문이 겹치지 않는 지점이 정확히 **회귀율**이다. edge-bench 의 지표는 전부 *전진* 축(best-so-far·delta_best·breakthrough)이고, 이 서베이 §8.1.1 이 추가로 요구하는 건 *후퇴* 축 — "track **regression rates on previously solved tasks**, tail-risk, safety violations across iterations, rather than relying exclusively on mean success rates". vault-health-gate 는 *구조* 건강(broken_links·graph_freshness)을 보지 *과거에 되던 것의 회귀*를 보지 않는다.

**HITL 항목은 범주 차이로 기각.** 논문은 "any reliance on external human oversight fundamentally compromises the 'self' in self-improvement" 라고 못 박는다 — 즉 vault 는 논문 기준으로 애초에 self-improving agent 가 **아니다**(§5 HITL 철칙 = 불변). 이건 결함이 아니라 다른 범주다. §8 프로토콜을 통째로 이식하려는 시도는 범주 오류 + Karpathy #2 위반. 회귀율만 HITL 과 무관하게 성립한다 — 작가가 루프에 있든 없든 "예전에 되던 게 깨졌나"는 셀 수 있다.

### 6.6 인접 노드 대비 델타

- **[Agentic RL Self-Evolving Agents (arXiv 2607.01120)](agentic-rl-self-evolving-agents.md)** (2607.01120, Ant Group) — 겹치지 **않는다**. 그쪽은 *배포 운영 기판*(ATDP·data proxy·control plane), 좁고 구현적. 이쪽은 *분야 전체의 형식·계보·평가*, 넓고 정의적. 그쪽 "multi-surface adaptation" 표(memory/skill/harness/tool/model/rollback/no-op)는 이 논문 Σ=(p,m,T,g) 분해의 **운영판 사촌**이다. 같이 읽으면 좌표(이 논문) + 배선(그 논문).
- **[Red Queen Gödel Machine — 평가자까지 같이 진화시키는 자기개선](red-queen-godel-machine.md)** — Gödel machine 계보를 공유. 이 논문은 그걸 *역사 절*로 다루고 DGM·HGM·Gödel Agent 까지 최신 계보를 이어붙인다.
- **[기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md)**(07-17 신설) — 논문 §6.2.3 의 CRUD(선택적 증류·retrieval gating·scheduled review·attenuation·다단 pruning)가 L1~L3 성숙도 판정의 *어휘 상위집합*. 특히 "over-writing inflates retrieval noise, under-writing sacrifices long-term capability" = 원장 굶주림/과적재 양방향 진단과 동형.
- **[EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md)**(ByteDance-Seed) — §8 의 **최근접 이웃**. 겹침 큼(궤적>최고점·judge 분리·criteria-hacking)이나 **독립 출처의 수렴**이라 상호 보강. 유일한 델타 = **회귀율**(§6.5). edge-bench 는 *어떻게 측정하나*(SForge 2-컨테이너·auto-eval), 이 서베이는 *무엇을 보고해야 하나*(회귀·tail-risk·비용·HITL 정량·judge 독립성).
- **agent-harness** — 논문이 각주로 "scaffold ≡ agent harness(최근 통칭)"이라 인정. 우리 H-01~17 은 논문 어휘로 `g`(제어 로직) 대부분 + `p` 일부.
- exact duplicate 없음 (`2607.13104`·`SI-FMA`·`skill as reusable update operator`·`Tool Governance Metacognition`·`textual gradient` = vault 미보유).

---

## 7. 학습→반영 루프 판정 (게이트 exit 3-way)

헌법 §"학습→반영 루프" 강제 exit — **①반영 diff / ②파킹+이름붙은 트리거 / ③순수참조** 중 택1 필수.

| 수확 | 판정 | 사유·트리거 |
|---|---|---|
| skill = U 렌즈 (설치형·meta/object 스코프) | **② Park** | 반영처 = skill-curator §라이프사이클 + hermes-loop ⑤. **트리거: 다음 skill-curator 실행 시** — 그때 "설치형/meta-level 축을 추가할까"를 1회 판정. 지금 헌법·워크플로우 수정 = §5.7 L-STAGE 이고, 근거는 서베이 1편뿐이라 스테이징도 이르다. |
| **회귀율** 결측 (§6.5) — edge-bench 도 못 덮는 유일한 델타 | **② Park** | 반영처 = [EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md) 의 **기존 PARK("EdgeBench-lite" telemetry 필드)에 합류** — 새 파킹 신설 X, 그 필드 목록에 회귀 축(`regressed_previously_passing`) 1개 추가 제안으로 얹는다. **트리거 = edge-bench 의 기존 트리거를 그대로 상속**(다중 시도 telemetry 가 실제 필요해지는 첫 실전 루프 / 작가의 EdgeBench-lite pilot 지시). 증거 0인 상태로 9번째 다이제스트 축 신설 = Karpathy #2 위반. |
| §9.1 ↔ §5.7 수렴 | **③ 순수참조** | 이미 merge 된 §5.7 을 바꿀 근거가 아니다. *외부 독립 수렴 기록*으로서만 가치. 반영 diff 0. |
| 역사 계보(Gödel machine·FWP·success-story) | **③ 순수참조** | 반영처 없음(순수 지식). |
| §8 평가 프로토콜 전체 | **③ 순수참조 + 범주 차이 선언** | vault = HITL 철칙 시스템 → 자율 self-improvement 평가 프로토콜 통째 이식은 범주 오류(§6.5). 회귀율 1건만 위에서 park. |

**반영 diff = 0건.** 정직 선언 — 이 세션에서 이 논문으로 vault 를 고치지 않았고, 고칠 근거도 아직 없다.

---

## 8. Anti-Overclaim (게이트 가드)

- ❌ "이 논문이 새 SOTA/기법을 냈다" → **서베이다.** 자체 실험·자체 벤치마크·자체 수치 **0**.
- ❌ "GLoW 가 실환경 상호작용 100–800× 절감" 을 이 논문 성과로 인용 → **인용의 인용**(Kim & Hwang 2026 원출처). 이 서베이는 재현하지 않았다. 노트 안 유일한 수치성 주장이며 **offline 미검증**.
- ❌ "이 논문이 vault 헌법을 검증했다" → 수렴이지 검증 아님(§6.4).
- ❌ "self-improving agent 가 배포 단계에 도달했다" → abstract 의 *주장*. 본문 §9 는 "완전 개방형 재귀적 자기개선은 여전히 grand challenge" 라고 스스로 제한한다.
- ⚠️ **저자 편향 고지** — Schmidhuber 가 교신 저자이고 §2 역사 절은 그의 계보(1987 self-referential·1991 FWP·1994 success-story·2003 Gödel machine·2015 learning to think)를 반복 자기인용하며 뼈대로 삼는다. 역사 서술의 *비중*은 중립 서베이로 읽지 말 것. 다만 인용 자체가 부정확하다는 증거는 통독 범위에서 발견 못 함.
- ⚠️ 컷오프 이후(2026-07-14) 자료 — 1차 출처 직접 취득으로 검증(arXiv abs + HTML 전문 + PDF SHA256 `896642aa…`).

---

## 9. 열린 질문

- vault 의 ③Gate 는 얼마나 exploit-resistant 한가? 제안자도 Claude, 게이트도 Claude 인 구조는 논문이 지목한 self-confirming loop 와 어디서 갈라지는가 — "작가가 최종 수용" 하나로 충분한가?
- 논문의 "**비평자 진화는 단조 변경만**"(순수 추가형) 을 vault 에 옮기면: ③Gate 규칙은 *추가*만 되고 *완화*는 못 하게 해야 하는가? §5.7 은 자율을 *확대*하는 방향이었는데 — 긴장이 있나?
- "설치형 스킬"을 `.incubator` 승격 기준에 넣으면 8주 무사용 강등 규칙이 깨진다(설치형은 원래 한 번 쓰고 안 쓴다). 어떻게 재정의하나?

---

## 10. 다음 학습 후보

- ~~**Darwin Gödel Machine (Zhang et al. 2026c)**~~ → ✅ **흡수 완료 2026-07-17** = [Darwin Gödel Machine — 증명 대신 경험, 단일 진화 대신 아카이브](darwin-godel-machine.md)(arXiv 2505.22954 v3). 수확 = node 114 게이트 무력화 실증 + 아카이브=엔진 ablation.
- ~~**Huxley-Gödel Machine (Wang et al. 2026a)**~~ → ✅ **흡수 완료 2026-07-17** = [Huxley-Gödel Machine — 점수가 높은 놈이 좋은 조상은 아니다](huxley-godel-machine.md). ⚠️ **자기인용 고지**: HGM 저자 8인 중 **5인**(Wang·Li Nanbo·Yimeng Chen·Zhuge·Schmidhuber)이 **본 서베이 저자와 동일** — 본 서베이가 HGM 을 후속으로 배치한 것은 독립 지목이 아니다. 수확은 §6.5 "회귀율"과 **다른 축**이었다(회귀=후퇴 감지 / CMP=조상 가치 재평가).
- **ACE — Agentic Context Engineering (Zhang et al. 2025i, arXiv 2510.04618)** — 이미 [Agentic RL Self-Evolving Agents (arXiv 2607.01120)](agentic-rl-self-evolving-agents.md) §ACE 델타에 *2차 인용*으로만 들어와 있고 **원논문 미독·"18,282→122 토큰 collapse" 미검증** 상태. 이 서베이가 §6.1.2·§6.2.3 양쪽에서 독립 인용 → 원문 통독으로 미결 부채 청산할 시점.
- **Live-SWE-Agent (Xia et al. 2025)** — 런타임에 자기 스캐폴드(특히 툴)를 실시간 진화. §9.2 Direction 1(test-time continual adaptation) 의 유일한 구현체.
- **Agent-as-a-Judge (Zhuge et al. 2024b)** — 본 서베이 공저자 라인. §4 "비평자 = 통치 인프라" 의 구현 쪽 원출처.

---

## 11. 연결된 페이지

- [Agentic RL Self-Evolving Agents (arXiv 2607.01120)](agentic-rl-self-evolving-agents.md) — 운영 기판(ATDP·control plane). 본 노트의 짝: 좌표 ↔ 배선
- [EdgeBench — 환경 학습을 "시간-점수 곡선"으로 측정하는 벤치마크](../methods/edge-bench.md) — §8 측정의 최근접 이웃. 회귀율 park 가 그쪽 EdgeBench-lite 에 합류
- [Red Queen Gödel Machine — 평가자까지 같이 진화시키는 자기개선](red-queen-godel-machine.md) · [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md) — Gödel 계보 / 검증자 신뢰 문제
- agent-harness · hermes-loop · [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) · [Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md)
- CLAUDE.md §5.7 자율 실행 등급 — §6.4 수렴 대상
