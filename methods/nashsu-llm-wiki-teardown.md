---
created: 2026-07-25
updated: 2026-07-25
type: learning
category: method
tags: [llm-wiki, knowledge-os, claim-audit, rag, invalidation-ledger, gpl, competitor-teardown]
source: ["https://github.com/nashsu/llm_wiki"]
year: 2026
---
<!-- nashsu/llm_wiki(14.3k★) 소스 고정 해체 — 바이럴 문구 교정 + vault 대비 진짜 델타. 이름만 같은 fivetaku/llm-wiki 와 다른 프로젝트. -->

# nashsu/llm_wiki 해체 — "RAG를 죽였다"는 문구의 실제

> ⚠️ **이름 혼동 주의**: [llm-wiki (fivetaku)](llm-wiki.md)(fivetaku, MIT, 콘텐츠 없는 템플릿)와 **완전히 다른 프로젝트**다. 이쪽은 `nashsu/llm_wiki` — GPL v3, 14,315★, Tauri 데스크톱 제품. 자동 dedup 은 이름만 보고 "중복"으로 판정하므로 **요약만으로 폐기하면 안 되는 사례**다.

## 한 줄

**"RAG를 죽인 신기술"이 아니라 — LLM Wiki 를 설치 가능한 개인 Knowledge OS 로 포장한 첫 대중적 성공 사례.** 원리 면에서 Sub-brain 이 뒤처진 것은 아니다.

## ⭐ Claim Audit — 바이럴 문구 5건 교정

소스 고정(`9b71ade…`, v0.6.3) 후 코드·릴리스·라이선스 실측.

| 홍보 문구 | 실제 |
|---|---|
| "Custom License" | **GNU GPL v3.** GitHub 탐지기가 Other/NOASSERTION 을 반환할 뿐 |
| "100% local" | **local-first 일 뿐.** 설정된 cloud LLM·search·MinerU 가 콘텐츠를 수신할 수 있다 |
| **"traditional RAG destroyed"** | **질의 파이프라인 자체에 optional vector retrieval 포함.** RAG 제거가 아니다 |
| "macOS Apple Silicon + Intel" | v0.6.3 릴리스 감사 결과 **Apple Silicon DMG 단독**. README/빌드 자산 불일치 |
| "recall 58.2% → 71.4%" | **재현 가능한 벤치마크 산출물 없음** |

## Wiki ⊥ RAG — 정확한 모델

반대편이 아니라 **두 층의 합성**이다.

| 층 | 질문 | 구현 |
|---|---|---|
| Knowledge compilation | 원문을 어떤 *지속형* 지식 단위로 바꿀 것인가 | LLM ingest → Markdown wiki·links·summaries·review |
| Retrieval / answering | 질문 시 무엇을 context 로 가져올 것인가 | keyword + graph + **optional vector** + budget |

> 올바른 문장: *"원문 chunk 를 매 질문마다 검색하는 vanilla RAG **앞에**, 검토 가능한 지속형 지식 컴파일 층을 추가했다."*

이득 = query-time 토큰·반복 해석 감소 + 사람이 고칠 수 있는 중간 산출물. 대가 = **ingest-time LLM 비용 · 파생 지식 stale · hallucinated links · update/invalidation 복잡도.**

**vault 함의**: 이 문구가 헌법 §4 `grep > vector` 를 *지지하는 것처럼* 읽히지만 실제로는 아니다 — 그쪽도 벡터를 쓴다. [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md) 의 근거는 그대로 유효하되, **"바이럴 제품이 RAG를 버렸다"를 우리 입장의 외부 확증으로 인용하면 안 된다.**

## 이미 있는 것 (중복 생성 금지)

raw/wiki/schema 3-layer · catalog 아닌 router/MOC 지향 · ingest/compile/query/lint 분리 · provenance·contradiction 보존 · query fileback · token budget·scale mode · 사람 승인 ⊥ LLM 유지보수 역할 분리.
→ 기존 [llm-wiki (fivetaku)](llm-wiki.md) 가 위 원리를 **더 엄격하게** 다룬다.

## 진짜 델타 — 운영면 5종 (park, 검증 전 채택 금지)

1. **API sidecar contract** — vault 원본을 쓰지 않는 read-only search/file/graph endpoint 의 최소 계약.
2. ⭐ **Source invalidation ledger** — source hash 만이 아니라 **`source → generated pages → claims` 영향 범위**를 기록. *(cross-agent-artifact-coherence 의 `source_hash` pin 에서 한 단계 더: 무엇이 stale 인지가 아니라 **무엇까지 stale 인지**. 같은 날 memory-forest 를 중복으로 판정한 근거보다 이쪽이 실질 확장.)*
3. **Graph insight falsification** — gap/bridge/surprise 를 바로 지식으로 승격하지 말고 edge evidence·오탐률을 먼저 평가.
4. **Review queue UX** — 즉시 확인을 강요하지 않되 unresolved 판단을 축적하고 stale/priority/SLA 부착.
5. **Provider privacy mode** — local-only / cloud-allowed / sensitive-deny 를 **프로젝트별**로 명시하는 routing policy.

**패키징 델타(참고, 채택 대상 아님)**: Tauri 데스크톱 UX·설치 릴리스 · source watch + persistent ingest queue + crash recovery · graph 알고리즘의 UI insight 노출 · local API + MCP + companion skill · provider matrix · async review queue · Chrome clipper·multimodal ingest.

## ⚖️ GPL v3 경계

GPL 코드를 직접 섞으면 배포 방식에 copyleft 의무가 생길 수 있다(법률 자문 아님).

- **개념·계약으로 재구현 O** — API schema · invalidation ledger · graph-evidence Gate · review queue state machine.
- **직접 복사 X** — GPL 소스 파일 · 구현 코드 · UI 컴포넌트.
- **도구 자체 사용은 별도 평가** — 외부 앱으로 실행하고 read-only adapter 로 연결하는 것은 코드 병합과 다르다.

## 채택 전 4-Gate (vault 설치·코드 흡수 없이 별도 스냅샷에서)

`Gate A` retrieval baseline · `Gate B` graph insight truth test · `Gate C` incremental update test · `Gate D` agent access/security test.
**이 벤치 없이 현행 lookup 스택 교체 금지.**

## 검증 결과

| 항목 | 결과 |
|---|---|
| GitHub 메타 | PASS — 14,315★ · 1,710 forks · 2026-04-08 생성 · v0.6.3 |
| 소스 링크 | PASS 5/5 HTTP 200 |
| 커밋/태그 고정 | PASS — HEAD `9b71ade…` · tag `v0.6.3` |
| `npm ci` | **FAIL** — package/lock 불일치(`@emnapi/*`) |
| `npm install --package-lock=false` | PASS — 768 packages · 취약점 0 |
| typecheck / test:mocks / build | PASS (1,638 tests) · build 는 large-chunk 경고 |
| `cargo test` | **BLOCKED** — 로컬 `protoc` 부재 |
| Desktop E2E | **NOT RUN** — 바이너리 미설치·유료 호출 0 |

## 냉정 (과신 가드)

- **런타임 ingest/query 품질·지연은 미검증.** 정적 감사까지다.
- Rust 단위 테스트 미실행(`protoc` 부재).
- 저장소가 빠르게 변한다 — 스냅샷 주장은 금방 stale 해진다.
- **바이럴 저장소 1개는 가시성 신호이지 지속 가능한 시장 범주의 증거가 아니다.** 14.3k★ 를 시장 검증으로 읽지 말 것.
- 스킬 후보 `llm-wiki-product-teardown` 제안됐으나 **미승인**(반복 2회 미만).

## delta / synergy

- **[llm-wiki (fivetaku)](llm-wiki.md)**: 이름만 같은 다른 프로젝트. 그쪽 = 원리·템플릿(fivetaku, MIT), 여기 = 제품화·운영면(nashsu, GPL).
- **cross-agent-artifact-coherence**: §델타 2 가 그 계약의 확장 방향(hash pin → 영향 범위 대장).
- **[Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md)**: §Wiki⊥RAG 가 그 근거의 *오용*을 차단한다.
- **PK-007**(원격 Sub brain 전초기지 제품화): 같은 범주의 시장 선례 — 단 ★수를 검증으로 읽지 말 것.
- **정직한 자기평가**: provenance · authority · Gate · multi-agent boundary 는 **Sub-brain 이 더 강하다**. 뒤처진 것은 패키징(설치형 UX·API/MCP·review queue)이다.
