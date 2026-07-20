---
created: 2026-07-19
updated: 2026-07-19
type: learning
tags: [ontology, knowledge-modeling, entity-relationship, cardinality, progressive-lesson, creative-ontology]
source: https://github.com/microsoft/Ontology-Playground (docs/authoring-guide.md + .github/skills/ontology-school-path-generator)
category: method
---
<!-- 온톨로지 설계 입문 — MS Ontology-Playground 설계 규율(조각1)을 progressive 레슨 포맷(조각2)으로 작가가 공부하도록 기여 -->

# 온톨로지 설계 입문 — 개념 1개씩 쌓아 만드는 이야기 세계 온톨로지

> **이건 작가님이 공부하시라고 만든 레슨**입니다. MS Ontology-Playground의 *설계 규율*(엔티티/관계/카디널리티)을 같은 repo의 *교육-as-코드* 포맷으로 엮음. 예제 = **이야기 세계 온톨로지**(인물·세력·장소·유물·사건) — 작가님 myth-forge-entry-schema·eldritch-seoul 창작 온톨로지에 그대로 적용 가능한 벡터로 골랐습니다.
>
> **포맷**: 개념 스텝당 1개 · `+ 이번에 생긴 것`(diff) · 스텝당 퀴즈 · `##`=슬라이드 경계.

관련 — [Handdraw Story Video — 잉크 추출 커널 + 손그림 스토리 비트 문법](../techniques/handdraw-story-video.md) (같은 세션 MS 해체 계보) · lesson-demo-idle-combat-progressive (같은 포맷 첫 데모) · myth-forge-entry-schema (작가 창작 온톨로지 적용처) · [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](../techniques/zep-graphiti.md)·[Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](../techniques/graphrag.md) (지식그래프 계열) · graphify

---

## Step 0 — 온톨로지가 왜 필요한가

작가님은 이미 인물·개념·플롯을 문서로 적는다. 자유 텍스트다. 사람은 읽지만 — **기계는 "이 인물이 저 세력에 속한다"를 못 안다.**

**온톨로지 = 세계를 "타입 있는 명사(엔티티) + 이름 있는 관계"로 적은 것.** 그러면 "A세력에 속한 모든 인물", "이 유물을 거쳐간 사건들" 같은 걸 *질의*할 수 있다.

`+ 이번에 생긴 것`: **없음(출발점).** 목적 = 자유 텍스트와 *구조화된 지식*의 차이를 느끼는 것.

> 🧩 **퀴즈 0** — "설정 위키에 다 적어놨는데 왜 온톨로지?" 한 문장 답은? *(정답 방향: 위키는 사람이 읽고, 온톨로지는 기계가 *질의*한다. 관계를 명시하면 "묻을 수 있는" 세계가 된다.)*

---

## Step 1 — 엔티티 타입: 세계를 명사로 자른다

먼저 세계의 **개념을 명사로** 뽑는다. 각 엔티티 타입은:

```
EntityType {
  id           URL-safe 슬러그, 온톨로지 내 유일   (character)
  name         단수 명사, Title Case              (Character / 인물)
  description  한 문장, 관사로 시작                 ("이야기에 등장하는 한 인물.")
  icon         이모지 하나                         (🧍)
  color        구분되는 hex                        (#c0392b)
  properties[] 프로퍼티 배열                        (Step 2)
}
```

이야기 세계 출발 엔티티 3종: **Character(인물 🧍)** · **Faction(세력 🏴)** · **Place(장소 🗺️)**.

`+ 이번에 생긴 것`: **명사 경계.** 이제 세계가 "무엇들로 이루어졌나"가 명시됨. 관계도 질의도 전부 이 명사 위에 선다.

> 🧩 **퀴즈 1** — "배신"은 엔티티 타입일까? *(정답: 애매 — 대개 아니다. 배신은 *사건(Event)*의 한 종류거나 *관계*다. 엔티티는 **지속하는 명사**(인물·장소), 일어나는 일은 Event로. → Step 5에서 다시.)*

---

## Step 2 — 프로퍼티 + 식별자: 엔티티에 속성을 달고, 딱 하나로 지목한다

각 엔티티 타입에 프로퍼티를 단다:

```
Property {
  name          camelCase, 서술적          (trueName, allegiance, birthYear)
  type          string|integer|decimal|date|datetime|boolean|enum
  isIdentifier  엔티티당 정확히 1개만 true   ← 핵심 규율
  unit?         "USD","kg" 등              (필요 시)
  values?       type=enum이면 허용값 배열
}
```

Character 예: `id(식별자)` · `name` · `trueName`(진명) · `status(enum: living|dead|undead)` · `birthYear(integer)`.

**철칙 — 엔티티당 식별자(isIdentifier) 정확히 1개.** 이게 "이 인물이 그 인물과 같은가"(엔티티 해소)를 판정하는 열쇠. 0개면 중복을 못 잡고, 2개면 어느 게 진짜 열쇠인지 모른다.

`+ 이번에 생긴 것`: **정체성(identity).** 엔티티가 이제 *구별 가능*해짐. Step 3의 관계가 "누구→누구"를 가리킬 수 있게 됨(식별자로).

> 🧩 **퀴즈 2** — 인물의 식별자로 `name`(이름)을 쓰면 왜 위험? *(정답: 동명이인·개명·가명. 이름은 변하고 겹친다. 안정적 슬러그/UUID를 식별자로, 이름은 표시용 프로퍼티로.)*

---

## Step 3 — 관계: 엔티티를 능동동사로 잇는다

엔티티 사이를 **이름 있는 관계**로 잇는다:

```
Relationship {
  id           소문자 슬러그
  name         능동동사 (belongsTo/rules/betrays/guards) ← "관계2" 같은 이름 금지
  from         출발 엔티티 id
  to           도착 엔티티 id
  cardinality  (Step 4)
  description  링크를 설명하는 한 문장
  attributes[] 관계 자체가 갖는 프로퍼티 (예: since=배신 시점)
}
```

이야기 세계 관계 예:
- `Character —belongsTo→ Faction` ("인물은 한 세력에 속한다")
- `Faction —controls→ Place` ("세력은 장소를 지배한다")
- `Character —betrays→ Faction` (attributes: `since` = 배신 시점)

**능동동사가 핵심** — `betrays`는 방향과 의미를 다 담는다. `relation1`, `hasFaction` 같은 이름은 세계를 못 읽게 만든다.

`+ 이번에 생긴 것`: **질의 가능성.** 이제 "A세력을 배신한 모든 인물", "이 장소를 지배하는 세력" 을 물을 수 있다. Step 0의 약속이 여기서 실현.

> 🧩 **퀴즈 3** — `Character —hasEnemy→ Character` 는 좋은 관계일까? *(정답: 방향이 애매(적대는 보통 상호). 능동·비대칭 동사로 다시 — 예: `feudsWith`(상호 명시) 또는 `hunts`(일방). 대칭 관계는 카디널리티·방향을 의식적으로 정해야 — Step 4.)*

---

## Step 4 — 카디널리티: 관계의 "몇 대 몇"을 못 박는다

관계마다 **몇 개가 몇 개에 붙는지**를 정한다:

| 카디널리티 | 의미 | 이야기 예 |
|---|---|---|
| one-to-one | A ↔ B 정확히 하나씩 | 인물 ↔ 진명(trueName) |
| one-to-many | A 하나 → B 여럿 | 세력 → 소속 인물들 |
| many-to-one | A 여럿 → B 하나 | 인물들 → 소속 세력 |
| many-to-many | 양방향 다중 | 인물 ↔ 참여한 사건들 |

`Character —belongsTo→ Faction` 은 **many-to-one**(여러 인물이 한 세력에). 반대 방향 `Faction —hasMember→ Character` 는 **one-to-many**. 같은 링크의 두 시선.

`+ 이번에 생긴 것`: **제약(constraint).** "인물은 세력을 **하나만**" 같은 규칙이 명시됨 → 데이터가 어긋나면 검증기가 잡는다. 세계의 *법칙*이 스키마에 박힌다.

> 🧩 **퀴즈 4** — "한 인물이 여러 세력에 이중첩자로 속한다"를 허용하려면 `belongsTo`의 카디널리티를? *(정답: many-to-many로 열되, 관계 attributes에 `isSecret`·`since`를 달아 이중성을 표현. 카디널리티는 *세계의 규칙*을 코드화하는 결정.)*

---

## Step 5 — 설계 휴리스틱 + 검증: 읽히는 온톨로지로 만든다

기술적으로 맞아도 *읽히지 않으면* 쓸모없다. MS authoring-guide의 휴리스틱:

- **엔티티 5~8개** — 너무 많으면 그래프가 안 읽힘(더 크면 하위 온톨로지로 분할).
- **엔티티당 프로퍼티 3~8개** — 인스펙터 가독성 vs 정보량 균형.
- **관계는 엔티티당 평균 1~2개** — 실 뭉치 방지.
- **색은 타입마다 구별되게**(재사용 금지), **설명은 한 문장**.
- **엔티티 = 지속 명사 / 사건 = Event 엔티티 / 관계 = 동사** — Step 1 퀴즈의 "배신" 은 여기서 정리: 지속 상태면 `betrays` 관계, 특정 순간이면 `BetrayalEvent` 엔티티.

**검증 체크**: ① 모든 엔티티에 식별자 1개? ② 관계 이름 전부 능동동사? ③ 카디널리티 다 지정? ④ 고아 엔티티(관계 0개) 없나? ⑤ 한 화면에 그래프가 읽히나?

`+ 이번에 생긴 것`: **가독성·검증 규율.** 완성된 온톨로지가 이제 *남에게(그리고 기계에게) 읽히는* 물건이 됨.

> 🧩 **퀴즈 5** — 이야기 세계에 엔티티가 20개로 불었다. 규율상 어떻게? *(정답: 하위 온톨로지로 분할 — 예 "정치 온톨로지"(세력·장소·조약) / "인물 온톨로지"(인물·유물·사건). 5~8 규율은 한 그래프의 인지 한계.)*

---

## 마무리 — 쌓인 것 한눈에

| 스텝 | 개념 | 가능해진 것 |
|---|---|---|
| 0 | 온톨로지란 | 텍스트→질의 가능한 세계 |
| 1 | 엔티티 타입 | 세계를 명사로 자름 |
| 2 | 프로퍼티+식별자 | 엔티티 구별 가능 |
| 3 | 관계(능동동사) | "누가 누구를" 질의 |
| 4 | 카디널리티 | 세계 법칙을 제약으로 |
| 5 | 휴리스틱+검증 | 읽히는·검증되는 온톨로지 |

**핵심 한 줄** — 온톨로지 설계 = *지속 명사(엔티티)와 능동동사(관계)로 세계를 자르고, 식별자로 지목하고, 카디널리티로 법칙을 박고, 5~8개로 읽히게 유지*.

## 작가님 작업에 적용하기 (형식 도입 아님 — 규율만)

- **창작 온톨로지** myth-forge-entry-schema·eldritch-seoul 인물/개념/플롯을 이 규율로 조이면: 각 인물에 *식별자 1개*, 관계를 *능동동사*로("소속"이 아니라 `섬긴다/배신한다"), 카디널리티로 세계 규칙 명시(예: "별은 한 번만 실종된다"=one-time Event).
- **RDF/OWL은 미도입** — 작가 §4(형식 시맨틱웹 미채택)와 결이 다름. 여기서 배우는 건 *모델링 규율*이지 툴 스택이 아니다. graphify가 이미 그래프 축을 담당.
- **다음** — 이 규율로 eldritch-seoul 온톨로지를 실제로 한 번 그려보면 "공부"가 "체화"로. (원하시면 별도 작업.)
