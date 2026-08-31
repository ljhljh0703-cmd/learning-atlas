---
created: 2026-06-15
updated: 2026-08-27
type: learning
tags: [method, verification, adversarial, hallucination, gate, operating-principle]
category: method
---

# 검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate

*작가 운영 원칙 (메모리 → 그래프 승격 2026-06-18). AI 교차검증 운용 시 상시 적용.*

Adversarial verification(생성자≠검증자)으로 외부 AI(GPT·다른 Claude — 당시 사례 Gemini)에게 교차검증을 시킬 때, **검증자의 주장 ≠ 진실**. 특히 "이 출처는 피싱/맬웨어다", "보안 위험" 같은 *강한 주장*일수록 그대로 믿고 vault 에 반영하기 전에 **1차 출처(WebFetch 공식 docs 등)로 직접 재-③Gate** 한다.

---

## Why

2026-06-15 Gemini 가 [Dynamic Workflows — 작업마다 하네스 (Claude Code)](dynamic-workflows-harness.md) 교차검증에서 `code.claude.com` 을 "피싱 도메인"이라 단언 → WebFetch 직접 확인 결과 정상 공식 Agent SDK docs 였음(환각). 맹신했다면 Layer C 정본 [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md)(code.claude.com 11개 출처)을 훼손할 뻔. **검증자도 환각한다** — dynamic-workflows 가 서술한 self-preferential bias 차단을 *검증자 자신에게* 적용해야 함. [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #1(가정 표면화) 정확한 사례.

## How to apply

1. 검증자 리포트를 받으면 **valid 적발은 선별 반영**하되
2. 가장 강하거나 파괴적인 주장(출처 무효·삭제·보안)은 **반드시 1차 출처 1~2건으로 재확인 후에만 적용**
3. 전수 재검증은 토큰 낭비 — *강한 주장만* 표적 재-Gate
4. 정본 훼손 방향 변경은 특히 보수적으로

---

## 보강 — Trap-fixture로 검증기 자체를 검증 (fable-method 델타, 2026-07-17)

위 원칙이 "검증자의 *긍정* 주장을 믿지 마라"라면, 그 짝 = **심어둔 실패로 검증기가 *부정*을 실제로 잡는지 증명하라**. Sahir619/fable-method 해체(commit `b2a24d5b`)에서 이식 가능한 진짜 델타 = 3종 trap fixture(설치 X, A/B 후보만):

- **S2 authority-conflict trap** — 권위 충돌을 심어두면 검증기가 `AssertionError`로 잡아야 정상(재현 확인).
- **S5 coverage trap** — 테스트가 "all passed"인데 숨은 쌍둥이 버그 존재 → 커버리지 착시 적발.
- **S7 fraudulent-completion trap** — pristine/worked 둘 다 통과하나 worked가 틀린 반올림을 DEBUG로 감춤 → *거짓 완료* 적발.
- + **forced decision artifact**(결정을 명시 산출로 강제)·**domain minimum evidence contract**(도메인별 최소 증거 계약).

⚠ **CAVEAT(cold-verify)**: repo headline `159 runs`·raw transcript·full-suite reproducibility는 커밋 증거보다 과표현(독립 재구성 불가). X article "clone"=overclaim(이식가능=행동 스캐폴드뿐). 무료포함 마감 7/12 = 공식 7/7 공지와 충돌. **skill 설치 X** — Sub-brain 원칙층 대부분 선행구현(agent-harness·dispatch-builder). 트리거: 하네스/검증기 신뢰도 스트레스 테스트 필요 시 3-trap A/B. 출처 `~/Documents/Codex/2026-07-14/fable-method-teardown/`.

## 보강 — 검증 누수 8패턴 (paperthin/mandela 흡수, 2026-08-27)

위 두 절이 *검증자를 의심하라*·*검증기를 함정으로 시험하라*면, 이 절은 **평가 설계 자체가 새는 자리**의 이름표다.
핵심 질문은 "검증자가 따로 있는가"가 아니라 **"바깥의 정답이 독립적으로 들어오는가"**다.

| # | 패턴 | 무슨 뜻인가 | vault 선행 |
|---|---|---|---|
| 1 | **recall, not reason** | 모델이 추론한 게 아니라 외운 걸 뱉었다 | 없음 |
| 2 | **wrong null hypothesis** | 비교 대상(귀무가설)이 틀려서 이겨도 의미 없다 | 없음 |
| 3 | **shared hallucination** | 생성자와 채점자가 같은 착각을 공유한다 | 없음 |
| 4 | **tautology** | 채점자가 만든 칸을 채점자가 채운다 | 절대룰 #7 인접 |
| 5 | **verifier = designer** | 설계한 사람이 검증한다 | S7·절대룰 #7 인접 |
| 6 | **shared-pool bias** | 학습셋과 held-out 이 같은 웅덩이에서 나왔다 | 없음 |
| 7 | **frame injection** | 질문이 답(가설)을 심어 놓는다 | 없음 |
| 8 | **demand characteristics** | 피험자가 무엇을 재는지 눈치챈다 | 없음 |

⛔ **적용 자리** — eval·지표·실험·벤치마크를 *믿기 전에*. 「이걸 어떻게 알 수 있나」를 정하는 순간이 이 검사의 자리다.
🔴 **흡수 경위 메모**: 이 8패턴을 가져온 외부 해체는 "vault 의 이 노트와 겹친다"고 스스로 깎아서 냈다. 실독해보니 **이 노트에 누수 taxonomy 는 없었다**(있는 건 검증자 재-Gate 와 trap fixture 3종). 8 중 6이 신규다. **외부 AI 의 자기 중복 신고도 요약이다** — lessons 「후보 격자도 요약이다」의 반대 방향 사례.

## 보강 — 반론은 목록이 아니라 하나다 (paperthin/hate 흡수, 2026-08-27)

계획·설계·주장을 **망하길 바라는 사람의 눈으로** 먼저 친다. 산출은 `{급소 하나, 첫 못 하나}` — **목록이 아니다.**

1. **떠받치는 가정**을 못박는다 — 이게 무너지면 전체가 선다/무너진다 하는 그것.
2. 아래 축으로 친다:
   - 거짓일 수 있는 **떠받치는 사실**
   - **사후 지어낸 이야기**를 근거로 취급 (confabulation)
   - **비유를 구조 동일성으로 착각** (다른 도메인으로 구조가 옮겨간다고 가정)
   - **미래형 봉합** — 아직 없는 결과에 논증을 기댄다
   - 🔴 가장 날카로운 축 — **원칙을 인용하면서 그 반대를 구현한다**
   - (실증 계획이면) 누수 · 검정력/다중비교 — 참인 가설이 자동 탈락하거나, 거의 0인 검정력이 무엇이든 통과시키는 조건
3. 여러 개가 걸려도 **하나의 뿌리로 접는다** — 그게 무너지면 나머지가 무의미해지는 그것.
4. **첫 못** = 그 가정을 죽일 수 있는 **가장 싼 검사**(시간·비용·표본). 비싼 계획이 굴러가기 *전에* 칠 수 있어야 한다.

⛔ **고치지 말고 친다.** 개선은 다른 반사행동이다. 두 개를 섞으면 둘 다 흐려진다.
✅ 종료 검사 — 급소가 정말 떠받치고 있는가(그게 빠지면 계획이 서지 못하는가) · 첫 못이 정말 계획보다 싼가.

## 연결된 페이지

- hermes-loop (③Gate — 본 원칙이 검증자 단계에 적용) · [Dynamic Workflows — 작업마다 하네스 (Claude Code)](dynamic-workflows-harness.md) (사고 발생 맥락) · [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md) (훼손 위험 정본)
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (#1 가정 표면화)
- [리서치는 전문 통독 — 인접한 것까지 뽑아 박제](research-thoroughly-extract-adjacent.md) · [WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](webfetch-is-lossy-clone-for-fidelity.md) — 학습 충실성 운영 원칙 3종의 자매(검증자 재-Gate / 흡수 깊이 / 출처 충실). 셋 다 "외부 입력을 그대로 믿지 말고 1차로 검증·통독하라"의 다른 국면
