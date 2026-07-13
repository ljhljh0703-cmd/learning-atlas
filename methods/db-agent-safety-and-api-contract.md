---
created: 2026-07-09
updated: 2026-07-09
type: learning
tags: [database, api, safety-gate, idempotency, agent-tooling, sql]
source: [https://github.com/prisma/prisma, https://datatracker.ietf.org/doc/rfc10008/]
authors: [prisma, IETF]
year: 2026
category: method
---
<!-- Codex 2패킷(prisma·RFC10008 QUERY) ③Gate 흡수 — DB 에이전트 안전 게이트 + 안전멱등 API 계약. -->

# DB 에이전트 안전 게이트 + 안전·멱등 API 계약

> ③Gate 통과(2026-07-09). Prisma/RFC는 wholesale 채택 아님 — 에이전트 운영 계약 델타만.

## 1. DB 에이전트 안전 패턴 (Prisma `9acd8dc`, Apache-2.0)

Prisma = ORM 복사 대상이 아니라 **성숙한 DB-agent 계약 번들**:

- **`dangerous_db_action_gate`** (최고가치): `db drop`·`push --force-reset`·`migrate reset` = AI safety checkpoint. 명시적 consent 토큰(`PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION`) 필요. → Codex/Claude DB 도구·NPC 영속화에 직접 재사용.
- **`schema_contract`**: durable schema ↔ 환경별 connection/config **분리**(융합 금지).
- **`generated_client_gate`**: schema 변경은 generated types/client 갱신 + 의존 테스트 refresh까지가 1단위.
- **`typed_sql_escape_hatch`**: 손SQL 유지 + 생성된 param/result 타입(SQL 표현력 + 컴파일타임 계약). 가장 강한 SQL 델타.
- **`query_shape_telemetry`**: SQL comment로 model/action/query shape 기록(값 없이) → NPC replay/evidence에서 사용자 데이터 유출 없이 행동 분석.
- **`adapter_boundary`**: DB 벤더/런타임 차이를 작은 adapter shape 뒤로.

**비채택**: Prisma를 기본 DB 아키텍처로 강제 X. repo 레이아웃 복사 X. preview 기능(TypedSQL 안정화 전)은 pin+acceptance 없이 의존 X.

## 2. 안전·멱등 API 계약 (RFC 10008 QUERY, Proposed Standard 2026-06)

read↔mutate 경계 표준화:

- `GET` = URI 주소 조회 · `QUERY` = 안전/멱등 read(구조화 request body 허용) · `POST` = 처리·mutate(비안전).
- 에이전트/NPC 규칙: **read-only state·memory·evidence·provenance·graph·replay lookup = query 의미론 / mutate만 command 엔드포인트**.
- wire 지원 불확실 시 POST 호환하되 safe/idempotent 계약 + evidence 필드 보존. 공개 전 CORS/proxy/cache 테스트.
- ⚠ errata 9013/9016 = 예시 영향. 본문 §2/§3 의미론과 IANA 등록(`QUERY` safe/idempotent, `Accept-Query`)은 authoritative, 예시는 맹복사 금지.

## 3. Apply-or-Park

- **① Applied**: 본 노드 신설. `db-agent-safety-gate`·`safe-idempotent-agent-api-contract` = skill 후보(park, 실행형).
- **② Parked**: skill 화 = 실사용 1회 입증 후(hermes-loop ⑤ 2-레인). 트리거 = 첫 DB 도구/NPC 영속화 dispatch.
- **▸NPC**: evidence/replay API 경계에 직접 적용. **▸게임개발** 세이브/상태 DB. **▸창작** 무관.
