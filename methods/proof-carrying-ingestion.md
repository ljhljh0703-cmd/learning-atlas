---
created: 2026-07-11
updated: 2026-07-11
type: learning
tags: [ingestion, provenance, knowledge-base, retractability, evidence, gate]
source: "Tencent/WeKnora @38aacc3 (MIT, v0.6.3) — Codex 해체분석(addendum)"
authors: [tencent]
year: 2026
category: method
---
<!-- Codex WeKnora trust-boundary audit ③Gate 흡수(2026-07-11) — 생성지식 provenance/retractability(db-write 안전과 별개 축). -->

# Proof-Carrying Ingestion — 생성지식 provenance·회수성

> ③Gate 통과(2026-07-11). WeKnora(MIT, 코드 5클레임 실검증) 신뢰경계 감사에서 추출. [보안 및 DB 아키텍처 가이드라인 (Security & DB Guidelines)](security-db-guidelines.md)·[DB 에이전트 안전 게이트 + 안전·멱등 API 계약](db-agent-safety-and-api-contract.md)는 *DB write 안전*만 커버 — 본 노트는 *생성된 지식의 출처·회수성* 축(다른 문제).

## 1. 문제 — 기계가 만든 지식 편집은 회수·감사 가능해야
KB에 AI/자동 파이프라인이 페이지를 편집·요약·링크할 때, "누가·무엇으로·어느 리비전에서 만들었나"가 없으면 잘못된 생성지식을 되돌릴 수 없다.

## 2. 3 요구사항 (WeKnora 코드 실증)
- **mutation_log (append-only)** — 기계 생성 페이지 편집을 append-only 로그로, **revision 카운터 보존**(덮어쓰기 아님). 잘못된 생성분 회수 가능.
- **persisted evaluation artifact** — 평가 결과를 corpus fingerprint + model/config id와 함께 영구 저장(in-memory map만 두면 재현·감사 불가).
- **source_anchors (provenance 라벨)** — summary-level vs chunk-level provenance를 *비균질* 라벨링. 요약이 어느 chunk에서 왔는지 추적.

## 3. 반영 (Apply-or-Park)
- **① Applied**: 본 노트(정본, 참조). vault의 게이트 문화(RETURN·③Gate·use-ledger)가 이미 provenance frontmatter로 부분 실천 — 본 노트는 *생성지식 KB* 맥락의 형식화.
- **② Park(트리거)**: 다음 장문 intake 시 preview→anchor→parent-context→source-state 실행 / 사설 KB 파일럿 시 mutation_log 도입.
- **drop**: WeKnora finding#5(secure defaults: 이미지 digest pin·secret rotation·tenant/SSRF) = [보안 및 DB 아키텍처 가이드라인 (Security & DB Guidelines)](security-db-guidelines.md) §1 중복.
- **STOP**: WeKnora deploy/fork·벡터 DB 도입·vault 자동쓰기 금지(헌법 정합).

## 4. Anti-overclaim
WeKnora MIT·코드 5클레임 실검증(evaluation.go·wiki_page.go 등 file:line). "enterprise-ready"·벤치는 unverified 유지.
