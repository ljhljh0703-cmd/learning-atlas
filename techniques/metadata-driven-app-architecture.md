---
created: 2026-07-18
updated: 2026-07-18
type: learning
tags: [metadata-driven, low-code, doctype, app-architecture, erp, frappe, schema-runtime, wheel-reuse]
source:
  - https://github.com/frappe/erpnext
  - https://github.com/frappe/frappe
authors: [Frappe Technologies]
year: 2026
category: technique
---

<!-- ERPNext/Frappe DocType = 메타데이터 1정의가 DB+API+UI+권한+훅을 런타임 구동하는 골격. 정형 앱 바퀴 재발명 방지 레퍼런스 -->

# 메타데이터 기반 앱 아키텍처 (ERPNext/Frappe DocType 골격)

> **왜 이 노트**: 작가 "ERP가 대세 — 구조 위주로 분석해 다양한 도메인 응용 골격 파악, 나중에 ERP/정형앱 솔루션 필요할 때 **바퀴 재발명 방지**." ERPNext(⭐37k)의 진짜 자산은 회계·재고 기능이 아니라 그 밑의 **Frappe DocType 엔진** — ERP에 안 묶이는 *일반 골격*으로 추출한다.

## 한 줄 요약

> **하나의 메타데이터 정의(DocType)가 DB 스키마 + REST CRUD API + 리스트/폼 UI + 역할 권한 + 서버 훅을 *런타임에* 전부 구동**한다(코드젠 아님). 도메인(회계·재고·HR·CRM…)은 *메타데이터 차이일 뿐* 엔진은 하나 — 그래서 어떤 정형 도메인 앱도 바퀴 재발명 없이 얹는다.

## 구조 골격 (핵심)

**DocType = 의미론적 데이터 모델 정의**(presentation 아닌 meaning). 1개 DocType JSON에서 자동 생성:

| 생성물 | 내용 |
|---|---|
| **DB 레이어** | MariaDB/PostgreSQL 테이블 스키마 |
| **REST API** | 전 모델 CRUD 엔드포인트 자동 |
| **UI** | 리스트·폼 뷰 자동(Vue 기반 Frappe UI) |
| **권한** | DocType에 묶인 role-based 접근제어 |
| **서버 훅** | 비즈니스 로직 커스터마이징 컨트롤러 메서드 |

**구성 요소**: Fields(타입+검증) · Links(DocType 간 관계/FK) · Child Tables(중첩 문서) · Hooks(서버 이벤트 핸들러) · Workflows(상태·승인 체인) · Reports(무코드 리포트).

**결정적 성질 = 런타임 스키마 구동**: 메타데이터를 *실행 시점에 해석*(컴파일·코드젠 X). DocType 정의를 읽어 DB 쿼리·API 라우트·UI 폼을 동적 구성 → **스키마 바꾸면 앱 즉시 반영**. 철학: *"The best code is the one that is not written"* · convention over configuration.

## 🧩 다도메인 응용 골격 (바퀴 재발명 방지)

ERPNext의 회계·재고·제조·HR·CRM·프로젝트 모듈이 **전부 같은 DocType 엔진** 위 = 도메인 = 메타데이터 세트. 그래서 이 골격은 ERP를 넘어 재사용:

- **정형 트랜잭션 앱이면 무엇이든**: 취업 관리 CRM(회사·JD·연락처·단계) · 게임 데이터 백오피스(아이템·NPC·퀘스트·드롭테이블) · 제품 재고·주문 · 실험 로그.
- **판정선(이 골격을 쓸 때)**: 데이터가 *레코드+폼+관계+워크플로우*로 표현되고, DB/API/UI/권한을 직접 짜야 하는 상황 → **직접 짜지 말고 메타데이터 엔진(Frappe 또는 이 패턴)을 얹는다.**
- **안 맞는 곳**: 비정형·창작·그래프 지식(= vault 자체). 아래 한계 참조.

## 🔬 한계·비판 (채택 전 검증)

- **GPL-3.0 전염(ERPNext)** — copyleft. 작가 게임/폐쇄 제품에 ERPNext *코드*를 통합하면 GPL 전염 위험. (단 Frappe *Framework* 는 MIT — 프레임워크만 쓰는 건 상대적 안전. 라이선스 경계 확인 필수.)
- **런타임 해석 오버헤드** — 유연하지만 고성능·대규모 복잡쿼리엔 코드젠/직접구현 대비 느릴 수 있음. 성능 임계 앱엔 재검토.
- **Frappe 락인** — MariaDB·Vue·특유 컨벤션 생태계에 묶임. infra-0 관점: 풀스택 서버 프레임워크(무서버 vault와 정반대 축).
- **도메인 적합성 좁음** — *정형 트랜잭션*에 강하고 비정형·지식그래프·창작엔 부적합. "만능"으로 읽으면 오적용.

## 🔀 이미 수용한 지점과의 delta

이 세션에서 **"메타데이터→시스템 생성"** 패턴이 반복 등장했다 — 그 계보에서 ERPNext의 위치:

| 사례 | 메타데이터가 생성하는 것 | delta |
|---|---|---|
| [open-lovable teardown — 레퍼런스 흡수→디벨롭 엔진 + 3대 프롬프트 패턴](../methods/open-lovable-teardown.md) | 스키마/검색좌표 → 코드 | *생성 시점 1회*(에이전트가 코드 뱉음) |
| [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) schema packs | 페이지 타입 택소노미 | *문서 분류*만 |
| [MemoHarness — 경험에서 학습하는 에이전트 하네스](memoharness-experience-learning.md) | 6차원 config → 하네스 | *제어 파라미터* |
| **ERPNext DocType** | **DB+API+UI+권한+훅 (런타임 완결)** | ⭐**가장 완결된 풀스택 런타임 구동** — 이 계보의 성숙 극점 |
| vault frontmatter | type·tags·provenance·카테고리 | 메타-first 사고는 동일하나 *앱 생성 X, 문서/그래프* |

→ **순수 신규 = "단일 메타 정의가 풀스택을 *런타임에* 완결 구동"이라는 골격.** vault엔 이 완결형이 없다(문서 도메인이라 불요) — 트랜잭션 앱이 필요할 때 꺼내 쓸 *상보적* 지식.

## 🌿 시너지 가지뻗기 (park — 적용 트리거)

> [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md): 즉시 반영처 없음(작가 현재 정형앱 프로젝트 없음). **park + 트리거**:

1. **취업/제품 CRM·백오피스 필요 시** → 이 골격 채택(직접 DB/API/UI 짜지 말 것). Frappe(MIT) 우선 검토. → remote-subbrain-outpost-plan 진단·솔루션 표면이 정형 데이터면 여기 연결.
2. **게임 데이터 관리 필요 시** (hwiglija-tower-gdd·libgdx-rogue-os) → 아이템/NPC/퀘스트를 DocType식 메타 스키마로. 단 게임 런타임과 분리(백오피스 한정).
3. **persistence 계약과 배선** — "DB 정해줘/persistence" 발화 시 *메타데이터 기반 엔진*을 옵션으로 제시(정형·워크플로우 데이터일 때).

## 선행 관점

vault는 *지식/그래프* 도메인에서 이미 메타데이터-first(frontmatter·카테고리·링크). ERPNext는 *트랜잭션* 도메인의 메타-first. **두 도메인은 상보** — vault가 ERPNext를 삼키는 게 아니라, "정형앱이면 이 골격 / 지식이면 vault"로 라우팅. 작가는 이미 메타데이터-first 사고를 하므로, ERP 필요 시 *사고를 트랜잭션 도메인으로 확장*만 하면 됨(제로부터 학습 X).

## 관계
- [토스 앱빌더 (Deus) — 웹 기반 UI 디자인 툴](../methods/toss-appbuilder.md) — low-code 앱빌더 인접(국내 사례).
- [open-lovable teardown — 레퍼런스 흡수→디벨롭 엔진 + 3대 프롬프트 패턴](../methods/open-lovable-teardown.md)·[GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md)·[MemoHarness — 경험에서 학습하는 에이전트 하네스](memoharness-experience-learning.md) — "메타데이터→시스템" 계보.
- persistence — persistence 계약의 엔진 옵션.
