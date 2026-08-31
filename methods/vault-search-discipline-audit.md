---
created: 2026-08-26
updated: 2026-08-26
type: learning
tags: [vault, search-discipline, dedup, use-ledger, audit]
source: "CLAUDE.md §4 감사 이력 이관 — 정본 패치 [[.proposed-patches/claude-md-resident-trim-2026-08-19]] 변경 A"
---
<!-- CLAUDE.md §4 검색 규율의 판정 이력·실측 근거 보관소. 규율 본문과 재검토 조건은 CLAUDE.md 에 상주한다 — 여기 있는 건 근거뿐이다. -->

# vault 검색 규율 — 감사 이력

> **이 문서는 규율이 아니다.** 규율 본문(개념-dedup 2-패스 · 역인출 1패스)과 그 `review_trigger` 는 `CLAUDE.md` §4 에 **상주**한다. 여기에는 *그 판정이 어떤 데이터에서 나왔는가*만 있다.
> 이관 근거 = `/doctor` 2026-08-19 진단(CLAUDE.md 약 21,592 토큰). **운영 규칙·금칙은 1줄도 옮기지 않았다** — 옮긴 것은 판정 이력·실측 근거뿐이다.

## §dedup2-1차 — 1차 검토 2026-08-13 (규율 유지)

**모집단 11건 = hit 7 · miss 2 · n/a 2.** 폐기 조건 `hit 0` 미충족 — 즉 수동 규율이 반사로 붙었다는 실증.

hit 사례는 **언어를 건너는 확장**에 몰렸다 — `권한 단계` 1패스 무결과 → `allowed tools` 확장이 대비 지점을 잡음. 1패스가 **구조적으로** 못 잡는 유형이다.

`P3` = 기전 교체 후 merge 완료 2026-08-13(원안 전제가 실측에서 깨짐 → use-ledger 축만 정식화).

<!-- proposed_by: claude · confirmed_by: pending — 판정은 규율 자신이 정한 기준을 데이터에 적용한 것이며 규율 내용은 무변경 -->

## §P3-전제반증 — 2026-08-13 실측

P3 는 [지식 하네스 레지스트리 — Knowledge Harness Registry](knowledge-harness-registry.md) 를 *활성화*(신설 0)해 검색이 "응용처+사용여부"를 반환하게 하는 안이었다.

그런데 그 registry 의 `ai_harness:` 태깅은 **1,127 md 중 6건**(registry 자신 포함 → 실질 5건)이고 **전건 `last_reviewed: 2026-06-21`**(생성일에서 무변경). 활성화할 모집단이 없으므로 P3 원안은 *활성화*가 아니라 **대량 backfill** 이 되고, 이는 §learnings 출처 frontmatter 의 "기존 페이지 일괄 backfill 금지"·Karpathy #3 과 정면 충돌한다.

반면 P3 의 나머지 절반인 **`use-ledger` 역인출은 이미 작동 중**(31 use-line · 고유 개념 57 · `grep "<개념>" wiki/use-ledger.md` 로 사용처 즉시 반환).

- **판정 근거**: 태깅률 5/1127 + `last_reviewed` 전건 미갱신.
- **반증 명령**: `grep -rl "^ai_harness:" wiki/ | wc -l` 이 6 을 넘거나 `grep -r "last_reviewed" wiki/ | grep -v 2026-06-2` 가 결과를 내면 본 판정은 무효다.

## §revlookup-1차 — 1차 검토 2026-08-25 (규율 유지)

**모집단 11건 = hit 10 · miss 1.** 폐기 조건 `hit 0` 미충족이고, hit 비율은 dedup2 1차(11건 중 hit 7)보다 높다.

hit 사례는 *개념이 적혀만 있고 일한 적 없음*을 잡는 데 몰렸다. 08-25 에는 `harness-gain-evaluation-contract` 역인출 0 → 그 미사용 개념이 곧바로 HCL 의 유일한 반영처가 된 사례가 나왔다(**미사용 판정이 폐기가 아니라 재배치로 이어진 첫 건**).

<!-- proposed_by: claude · confirmed_by: pending — 판정은 규율이 스스로 정한 기준을 데이터에 적용한 것이며 규율 내용은 무변경 -->

## §P3-미해결 — registry 축 경위

원안이 전제한 [지식 하네스 레지스트리 — Knowledge Harness Registry](knowledge-harness-registry.md) 활성화는 태깅 6/1,127 · `last_reviewed` 전건 무변경으로 **모집단이 없어 채택하지 않았다.**

그러나 그 노드는 `provenance: user_authored` 라 **archive·삭제 대상이 아니다**(§Archive-Only 상속). 활성화도 폐기도 아닌 상태다.

CLAUDE.md §4 의 해당 항은 P3 의 *use-ledger 축만* 정식화한 것이고 **응용처 추천(어디에 쓸 수 있나)은 여전히 미구현**이다.

<!-- proposed_by: claude · confirmed_by: user · confirmed_date: 2026-08-13 (작가 명시 "머지해") · 정본 p3-use-ledger-reverse-lookup-2026-08-13 -->

## 관계

- 규율 본문·재검토 조건 = `CLAUDE.md` §4 (상주)
- 계측 원장 = use-ledger (`dedup2:` · `revlookup:` 토큰)
- 근거 = [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md) (grep > 벡터 불변)


## B2 이관 — dedup2·역인출 절차 원문·부연 (§dedup2-원문 · §계측-함정 · §revlookup-부연)

> 정본 이관 2026-08-29 (T1/T2 계층화 B2). CLAUDE.md 비용·모델 절의 dedup2·역인출 항이 본 절을 가리킨다. 원문 무변경 수록 — 각 항목 머리의 [#n] = CLAUDE.md 섹션 번호(분류표 기준).

- **[#2]** **개념-dedup 2-패스** 🔒 (P1, 2026-07-18 · merged 2026-07-26): **새 *개념* 노트·결정을 구축하기 전** dedup은 키워드 grep 1회로 끝내지 않는다 — grep은 표현이 다르면 같은 개념을 놓친다(실측: `greedy 아카이브` 4 vs `best-so-far` 7 = 동일 개념·grep 교집합 어긋남). 따라서 ① 키워드 grep → ② **동의·상위표현 2~3개 확장 grep**(개념을 다른 말로 재질의) → ③ graphify L2 query(L2 healthy 시). **적용 스코프 한정**: *개념 중복 판정*에만. *파일명·정확어·기계적 lookup*엔 미적용(과적용 가드 — RTK 유지). 근거: [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md)(grep>벡터 불변) + `스테이징 영역` 배경 실측.

- **[#2]** **계측 (merge 조건, 2026-07-26 작가 지시)**: 2-패스를 돌린 세션은 use-ledger use-line 끝에 **`dedup2: hit`**(확장 grep·L2 가 1패스에서 놓친 기존 노트를 실제로 잡음) 또는 **`dedup2: miss`**(확장했으나 신규 개념 확인) 1토큰을 붙인다. 집계 = `grep -c "· dedup2:" wiki/use-ledger.md` (구분자 `· ` 포함 — 안 넣으면 원장의 규약 설명 줄까지 세어 +1 부풀려진다. 2026-07-26 실측 교정). 새 파일·훅·스크립트 0(기존 원장에 편승 — 원장을 늘리면 그 원장이 또 stale 해진다).

- **[#2]** **역인출 1패스** 🔒 (P3, 2026-08-13): 개념을 *새로 쓰기 전*이 아니라 **이미 있는 개념을 꺼내 쓸 때**는, 그 개념이 *지금까지 어디서 실제로 쓰였는지*를 1회 조회한다 — `grep -c "<개념>" wiki/use-ledger.md`. 결과가 **0 이면 그 개념은 vault 에 적혀만 있고 일한 적이 없다**(= 8주 무사용 강등 후보의 조기 신호). 결과가 있으면 그 use-line 의 `failed:`·`missing:` 칸을 먼저 읽는다 — **같은 개념으로 이미 실패한 지점이 거기 적혀 있다.** **적용 스코프 한정**: *기존 개념을 실제 작업에 투입할 때*에만. 신규 개념 구축은 위 2-패스, 파일명·정확어 조회는 미적용(과적용 가드 — RTK 유지). 새 파일·훅·스크립트 **0**(기존 원장에 편승). 위 dedup2 와 대칭 — dedup2=*쓰기 전 중복 확인* / 역인출=*쓰기 전 사용 이력 확인*, 같은 원장 반대 방향.

- **[#2]** **계측**: 역인출을 돌린 세션은 use-line 끝에 **`revlookup: hit`**(과거 실패·미사용을 실제로 잡음) 또는 **`revlookup: miss`**(조회했으나 새 정보 없음) 1토큰. 집계 = `grep -c "· revlookup:" wiki/use-ledger.md` (**구분자 `· ` 포함 필수** — 안 넣으면 규약 설명 줄까지 세어 부풀려진다, dedup2 에서 실측 교정한 함정).

- **[#2]** <!-- proposed_by: claude · confirmed_by: user · confirmed_date: 2026-08-13 (작가 명시 "머지해") · 정본 p3-use-ledger-reverse-lookup-2026-08-13 -->
