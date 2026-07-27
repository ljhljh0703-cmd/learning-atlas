---
created: 2026-07-25
updated: 2026-07-25
type: learning
category: technique
tags: [penelope, gm, adjudication, world-control, absorption-map, decision-record, narrative-engine]
year: 2026
---
<!-- Penelope GM 세계통제 해체의 흡수 맵 — 무엇이 이미 있고 무엇이 진짜 신규인가 + 작가 결정 기록. 재구현 방지가 주목적. -->

# Penelope GM 판정 — 흡수 맵과 결정 기록

> **왜 이 노드가 있나**: 2026-07-19 GM 세계통제 해체(vault Claude 작업)의 산출이 **vault 밖에 6일간 떠 있었다.** RETURN §7 이 `index 등재·graphify·commit 보류`를 명시했고(당시 vault-health STOP), 그대로 방치됐다. **작가가 확정한 결정 1건(D-GM-01)이 SSOT 밖에 있던 상태**를 여기서 해소한다.
>
> 본 노드의 실용 목적은 하나다 — **재구현 방지.** 14 판단 단위 중 9개는 이미 vault·계약에 있다.

## ⭐ 재구현 금지 9종 (이미 존재 — 다시 만들지 말 것)

GM 이론에서 추출한 14 판단 단위(J-01~14) 중 **9개는 기존 자산에 이미 구현돼 있다.**

| 이미 있는 것 | 어디에 |
|---|---|
| 요구조건 게이트 · 수단 게이트 | `preconditionRefs` |
| terminal 실재 | §5.3 |
| fail-forward 기본 | ledger |
| CausalDebt(지연 청구서) | §3.3 |
| 공정 접촉면 | §2.10 |
| 가시성 3분 | AC-PRIV / KnowledgeView |
| 자유입력 → ActionFrame 정규화 | §5.2 |
| bounded 세계 시계 | ActiveWorldSet / §6 |
| 작가 개입 A/B/C | CREATOR-INTERVENTION-PROTOCOL 계약 |

또한 후보 12구조 중 **8개가 재발명 금지** 판정 — WorldAuthority · RequirementGate · ConsequenceLedger · `KarmaDebt`(명칭 역행, **채택 금지**) · ActiveWorldSet · ThreatClock · A·B·C · CausalReceipt.

## 진짜 신규 델타 7종

| # | 델타 | 성격 |
|---|---|---|
| 1 | **ExceptionalSuccessWindow** ★ | 유일한 무-analog. one-shot + effectCeiling{약점노출/경로개방/정보 중 1} |
| 2 | 위험(Risk) 독립축 | 현재 A/B 는 "가치·대가"로만 구분 — 위험이 순위에 묻힘 |
| 3 | DisclosureGeometry 확장 | speaker→volume/distance/LOS/confirmed·potential hearers |
| 4 | 산문/상태 4-태그 taxonomy | 분리 *원리*는 존재, 태그 명명이 net-new |
| 5 | outcomeClass(resolved/opened) | "성공 보장 ≠ 기회 개방"의 결과 의미 분화 |
| 6 | Offscreen agenda executor | 스키마는 있고 **executor·clock-trigger reducer·cascade budget 미구현**. mirofish 에도 없는 진짜 실행 공백 |
| 7 | lenient + redline 판정 정책 명문화 | 관대한 통과 + 하드 레드라인 |

## 작가 결정 기록

### ✅ D-GM-01 — CONFIRMED (user, 2026-07-19)

**ExceptionalSuccessWindow = "문 여는 권리".** 작가 정의 원문:

> *"극적인 연출을 위한 과정이지, 도달하는 결과가 아님."*

채택안 = one-shot + effectCeiling(약점노출/경로개방/정보 중 1택). 기각안 = `outcomeClass=opened` 로만 흡수(상한·one-shot 강제가 약해져 **대성공=신 회귀 위험**).

### 🔧 D-GM-02~07 — defaulted (provisional · 작가 veto 열림)

작가 창작 판단이 아니라 스키마·UX·구현순서 **엔지니어링 결정**이라 개발 트랙 기본값으로 둔 것. 확정 아님.

| 카드 | 기본값 | 내용 |
|---|---|---|
| D-GM-02 위험 표기 | **B** | 위험을 route 서술에 암묵 표기, 필드화 보류 |
| D-GM-03 geometry 범위 | **B** | 축소형(speaker+addressee+confirmed/potential) — volume/distance/LOS 생략 |
| D-GM-04 4-태그 | **A** | taxonomy provisional 채택 |
| D-GM-05 관대+레드라인 | **A** | `adjudicationPolicy{tone:lenient, redline:hard}` 계약화(계약 ③ 기확정분) |
| D-GM-06 구현 순서 | **A** | offscreen agenda executor 1순위 |
| D-GM-07 resolved/opened | **A** | enum 분화 |

> ⚠️ **02·03 이 B(축소형)로 기본값**이라는 점은 짚어둘 만하다. 위험 독립축과 거리·음량 판정을 포기한 선택이므로, 나중에 "왜 안 되지"가 나오면 여기가 원인이다.

## 검증 상태

- **SHA-256 6/6 OK** — O1~O5 + 결정카드 전건 재검증(2026-07-25). RETURN §6.1 인라인 해시와 일치. *별도 `SHA256SUMS.txt` 가 없어 autogate 는 `N/A` 로 표시했으나, 실제로는 검증 가능하고 통과한다.*
- **JSON parse 재현 PASS** — `PENELOPE-GM-CONTRACT.candidate.json` = 23 top keys · acceptanceGates 10. RETURN 주장과 정확히 일치.
- **충돌 0 · 미결 0** — candidate-2.2 밀봉 계약·POST-CORE 와 모순 제안 없음(전부 preserve/extend).
- 합격 기준 **10/10 PASS** — 단 **설계 검증이지 런타임 실측이 아니다.** 실측은 Codex 구현 후.
- IP 경계: **O1 = PRIVATE**(자작 인명·지명·아이템체인 포함). O2~O5 + 카드 = public-safe(고유명 grep 0). 본 노드는 public-safe 범위만 인용했다.

## 냉정 (과신 가드)

- **자기 판정이다.** 10/10 PASS 는 작성자가 스스로 매긴 점수이며 독립 검증이 아니다.
- 런타임 0 — 어느 델타도 실제로 돌아간 적이 없다. 특히 #6 executor 는 "미구현"이 명시돼 있다.
- GM 이론 출처(바바 히데카즈 강좌)는 **외부 타 저작의 느슨 흡수**이며 작가 고유 결정으로 박제하면 안 된다. 참조 노트 = baba-hidekazu-mastering-course(provisional).
- 운영 노트 8편은 **타 저작 번안**이라 판정 표본일 뿐 작가 자작 판정이 아니다.
- defaulted 6건은 작가가 본 적 없는 기본값일 수 있다 — **veto 기회가 아직 열려 있다는 뜻**.

## 외부 산출 위치

`~/Documents/Codex/2026-07-14/openai-build-week-narrative-ontology-harness/repo/private-submission/claude-dispatch/outputs/`
— O1(PRIVATE) · O2 GM-DOCTRINE · O3 ABSORPTION-MAP · O4 CONTRACT.json · O5 ACCEPTANCE-CASES · CREATOR-DECISION-CARDS · O6 RETURN.

## delta / synergy

- **[Involuti 서사 엔진 해체 — 무엇이 무너지는가](involuti-narrative-engine-teardown.md)**: 경쟁 실측과 짝. 그쪽이 *무엇이 무너지나*(외부 제품)라면 여기는 *무엇을 이미 갖췄나*(자산). Involuti 가 FAIL 한 인물 지식경계·정본 보존은 여기 J-단위로 이미 계약돼 있다 — **차별화 주장의 내부 근거**.
- **worldbuilding-to-game-pipeline-vision**(confirmed): 7계약 정본. 본 맵은 그 위의 GM 판정 계층.
- **[CoC 시나리오 해부 v2 — 직접 해체 완료](coc-scenario-anatomy.md)**(provisional): 스켈레톤·ScenarioSource. 정본과 분리 취급.
- **park**: Codex 구현 착수 = 작가 결정 카드 승인 후. 본 노드는 **기록이지 착수 승인이 아니다**.
