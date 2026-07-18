---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [tool, second-brain, governance, hitl, ai-proposal, markdown-vault, indexer, wikilink, provenance, cjk, agent-world, voxel-graph, deterministic-agents, rpg-status, e2ee, encrypted-sync, signed-commits, ground-truth, clean-room]
source: https://github.com/kuku-mom/kuku
authors: [kuku-mom]
year: 2026
category: method
---

<!-- Kuku(kuku-mom) 전문통독 — 작가 Sub-brain 거버넌스를 제품화한 오픈소스 Markdown 앱. AI=제안만/merge=인간을 도구 레지스트리 차단으로 *하드 강제*. HITL 스테이징·AI 결정 origin·CJK 인덱서의 외부 ground-truth. + Agent World(vault를 복셀 RPG 마을로·노트 stats→직업). clean-room(MIT). 도구 도입 아닌 개념 수확. -->

# Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)

*kuku-mom, MIT, Tauri + SolidJS macOS 앱 (Rust 47% / TS 40% / Go) · GitHub clone 전문통독(clean-room)*

> ⚠️ **분류(paper-study §2 정직판정)**: AI NPC blueprint **해당 없음** · **개념 수확**(도구 도입 X — 작가 SSOT=Obsidian+CLI, infra-0 철학) · 시급성 **중기**(거버넌스 성찰 자료). kuku는 *작가가 손수 도달한 vault 운영 철학이 독립 제품으로 구현된* 드문 외부 확증. goose/opencode가 "하네스" 정본이듯, kuku는 **"AI 협업 거버넌스" 정본**.

---

## 한 줄 요약

> "노트는 portable·private·AI에 유용하게" — 로컬 `.md` vault에 검색·그래프·AI를 얹되, **AI는 읽고·검색하고·제안만, 편집은 approval+diff를 거친다**. 작가의 HITL 스테이징·AI 결정 origin·Dual-Track을 *앱 레벨로 강제 구현*한 외부 ground-truth.

---

## 핵심 개념

### 1. ★ AI 권한 분리 = 규율이 아닌 *도구 레지스트리 차단* (최대 delta)
`knowledge/ai_tools.ts`가 AI 도구를 두 리스트로 가른다:
- **ALLOWED** (`KNOWLEDGE_AI_TOOL_NAMES`): `memory_search`·`memory_context`·`wiki_search`·`wiki_read`·`knowledge_context`·`memory_propose`·`wiki_propose_page`·`wiki_propose_update` — *읽기 + 제안*만.
- **FORBIDDEN** (`FORBIDDEN_KNOWLEDGE_AI_TOOL_NAMES`): `memory_commit`·`memory_write`·`memory_delete`·`knowledge_apply_decision_document`·`wiki_write_page`·`wiki_commit`·`wiki_apply_decision_document` — *commit/write/delete/apply*.

→ AI가 apply/commit을 **호출 자체 못 함**. 작가는 같은 원칙(CLAUDE.md R-01 HITL 스테이징 "AI 자체 merge 금지")을 *규율(soft discipline)* 로 강제하는데, kuku는 *도구 부재(hard enforcement)* 로 강제. external-ai-grant-hardcontract(외부 AI는 명시 제약만 지킴)의 제품 해법 = "지킬 거라 믿지 말고 능력 자체를 뺀다".

### 2. Decision 문서 = pending→resolved 거버넌스 노드
AI 제안은 `decision` 블록(`question`·`selected_option_id` ∈ {yes,no,other}·`other_text`)을 동반. 마크다운에 ` ```kuku-decision ` fenced 코드블록 + YAML(`proposalId`·`targetChangeId`·`status`·`selectedOptionId`·`resolvedAt`)로 영속. 에러코드 `NOT_PENDING`·`DOCUMENT_CHANGED`로 상태머신 가드.
→ 작가 `proposed_by/confirmed_by/status: provisional|confirmed` + `스테이징 영역/`의 *제품화*. "결정 문서를 accept/reject/revise → 이후 AI 대화가 더 나은 맥락 상속" = 작가 북극성("진화하는 AI 운영 토대")과 동형.

### 3. Checksum 핀 provenance + optimistic concurrency
- **source_refs** 스키마: `path`·`section_path[]`·`range{start_line,end_line}`·`checksum`·`captured_at` — 출처를 *라인 범위 + 체크섬* 단위로 핀.
- **mutation.rs** `MutationOp`: `ReplaceFile{expected_checksum, before_excerpt}`·`DeleteFile{expected_checksum}` → 적용 직전 checksum 불일치 시 `DOCUMENT_CHANGED` 충돌(`ConflictItem{expected, actual}`). `MutationApplyResult`: Applied / PartiallyApplied(applied·failed·skipped).
→ 작가 출처 추적 frontmatter(`source: URL`)의 *고해상도 버전* + "같은 파일 동시 편집 금지"(soft)의 *체크섬 가드(hard)*. 단 작가는 Zotero 회피 철학으로 *의도적 경량* — 이건 delta이지 채택 대상 아님.

### 4. ChatMode 능력 스코핑 (시스템 프롬프트 + 도구 게이팅 이중)
`prompts.rs build_system_prompt`: **Ask**(읽기전용) / **Agent**(읽기 + 도구로 편집 제안) / **Inline**(active 파일만, *"Never create, delete, move, or rename files in Inline mode"*). 모드별 능력이 프롬프트 + 도구 노출 둘로 강제. → 작가 역할별 권한 분리(당시 3-AI Claude/Gemini/Codex — 현행 2-AI)의 *단일 AI 모드별* 판.

### 5. CJK-aware 인덱서 (`kuku-indexer` crate)
- `wikilink.rs`: `alias` 추출 시 **코드영역 마스킹**(fenced/inline 코드 내 wikilink 무시) + ordinal.
- `extract.rs`: `FrontmatterEntry`·`Section`·`ExtractedChunk`(CHUNK_MAX_CHARS/OVERLAP) — frontmatter 인지 섹션·청킹(FTS용).
- `normalize.rs`: `contains_cjk`·`is_cjk_char` — **한국어/CJK 1급 처리**.
→ graphify(그래프 인덱서)의 인접 ground-truth. 코드영역 마스킹·CJK 정규화는 작가 한글 vault 관심사 정합 확증.

### 6. ★ Agent World — vault를 살아있는 복셀 RPG 마을로 (게임·시뮬 직결 delta)
`voxel_graph` 플러그인(Three.js): 그래프 뷰의 *대안 렌더러*. **folder=섬, note=집(image-to-3D 3D 모델·cel/ink 툰셰이딩), wikilink=다리 + 글로우 데이터 펄스**. 노트당 **거주 에이전트 1명**, 그래프 stats로 중세 RPG 직업 결정(`classForNode`, 결정론):

| 조건 | 직업 | 잡(village prop 상호작용) |
|---|---|---|
| linkCount ≥ 10 | 귀족(noble) | 광장 순찰 |
| linkCount ≥ 7 | 기사(knight) | 광장서 검술 훈련 |
| 본문 길이 ≥ 5,000자 | 마법사(wizard) | 집에서 공부 |
| linkCount ≥ 4 | 레인저(ranger) | 장작 패기·둘레 순찰 |
| isOrphan | 농민(peasant) | 밭 갈기 |
| else (stableNoise roll) | 마을사람/농민/레인저 | 시장 좌판 등 |

- **거동**: walk/inside/work/pause/idle state machine + **boids separation steering**(서로 겹쳐 서지 않음) + 광장 집결 + 링크된 노트로 다리 건너 방문. 기사·레인저는 섬 둘레 다구간 순찰.
- **성능**: `InstancedMesh` 배칭(집 변형당 draw call 1 — 대형 vault도 빠름) + 에이전트 캡(초과 시 *고차수 허브 우선* 유지, stableNoise 안정 선택).
→ 노트의 *그래프 통계*(차수·길이·고아)를 **결정론적 에이전트 직업 + 잡 + steering**으로 변환. 시각화이지 창발 사회 시뮬은 아니나(코스메틱), "데이터→결정론 에이전트 거동" 패턴은 작가 게임 AI([적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](../techniques/enemy-decision-making.md)·[Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](../techniques/dijkstra-maps.md))·learning-gains-as-rpg-status(지식 강화를 RPG status로)·[Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md)(에이전트 사회)와 정통으로 닿는다.

### 7. Encrypted Sync — E2EE 다기기 동기화 (`kuku.sync.v1`, 순수 지식 축)
서버가 **평문을 절대 안 받는다**(proto 헤더 명시): 파일 경로·파일명·Markdown 본문·평문 해시·passphrase·언랩된 workspace 키 전부 미수신. 작가가 *안 가진* 축(현 vault=로컬+git, 단일 사용자) → 도입 아닌 *교양/보안 패턴 수확*.
- **키 계층(envelope wrapping)**: account root key → recovery phrase 또는 trusted device로 wrap / workspace key → passphrase-derived 또는 device key로 wrap. `kdf_params_json`(Argon2류 KDF 파라미터) + `encrypted_envelope` bytes(절대 평문 키 미포함). 서버는 opaque bytes만 저장.
- **객체**: 콘텐츠=암호화 object(서버생성 `object_id`·`ciphertext_sha256`만 — 평문 해시 X). presigned 업/다운로드 배치(S3). 서버는 ciphertext만 중계.
- **★ Signed commits + head CAS** — `SyncCommit`: client생성 commit_id(canonical signed payload), parent_commit_ids, author_device_id, monotonic device_seq, `body_object_id`(암호화 본문 별도 다운), **device signature**, server_seq. `PublishCommit{expected_head_commit_id}` = head **compare-and-swap**(낙관적 동시성). → 로컬 `mutation.rs expected_checksum` 가드의 *분산 다기기 버전* = 같은 낙관적 동시성 패턴.
- **★ no-plaintext 불변 *테스트*** — `no_plaintext_test.go` `requireNoPlaintextMarkers`: 서버 가시 표면(storage key·object candidate·cleanup report·presigned URL)이 평문 마커(이메일·파일명·"passphrase"·workspace 이름) 포함 시 *테스트 실패*. → 개념 #1(FORBIDDEN 도구)·#3(checksum 가드)과 **같은 철학의 3번째 인스턴스**: *신뢰 말고 구조로 막고 + 불변을 테스트로 강제*.
→ **메타패턴 수확(거버넌스로 환류)**: kuku 전반의 일관 원리 = **"don't trust discipline — remove capability + assert invariant by test"**(권한차단·checksum·평문금지 3종). 작가 HITL(soft 규율)을 *구조+테스트*로 끌어올리는 방향 시사(단 외부 CLI 제약, external-ai-grant-hardcontract 등가).

---

## 기술 스택 / 구조

```
apps/   desktop(Tauri+SolidJS macOS) · web(Astro) · server(Go+Postgres)
crates/ kuku-ai(Desktop AI 런타임: session/mutation/prompts/tools/provider[gemini,remote])
        kuku-indexer(markdown 추출·검색·wikilink·CJK normalize)
        kuku-contract(Rust RPC 계약)
packages/contract(protobuf) · infra/docker(local/preview/prod, Cloudflare Tunnel)
```
- 위키 온톨로지: `WikiPageType` = source·concept·entity·synthesis / `WikiPageStatus` = active·archived·superseded (작가 state machine 동형).
- 설치: macOS(Homebrew `kuku-mom/kuku/kuku`). Win/Linux 준비 중. self-host 가능(Go+Postgres+Docker).

---

## 내 생각 — vault 거버넌스 + Agent World 관점

### 직접 적용성: **낮음** (도구 도입 X)
작가 SSOT는 Obsidian + CLI(당시 Claude/Gemini/Codex — 현행 Claude/Codex)이고 infra-0 철학([Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](loop-engineering.md) Automations 미도입 결정과 같은 결). kuku는 Tauri 앱·Go 서버·Postgres = 초중량 → 도입은 felt-need 미검증(cold-verify-before-adopt). **가치는 도구가 아니라 "내 거버넌스가 독립 제품으로 검증됐다"는 확증** + Agent World의 패턴 수확.

### 개념 수확 (이식 가능 발상)
1. **하드 강제 > 소프트 규율** — FORBIDDEN 도구 리스트로 AI가 commit/apply를 *호출 불가*. 작가 환경(외부 CLI)엔 도구 배제가 불가하나, external-ai-grant-hardcontract(금지축 실명 재진술)가 등가 해법임을 재확인 + per-turn 주입([goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) MOIM)으로 강화 가능.
2. **★ vault 그래프 stats → 결정론적 RPG 에이전트** (Agent World) — 노트 차수·길이·고아를 직업·잡·steering으로 매핑(`classForNode`). 작가는 *학습 성장*을 RPG status로 이미 프레이밍(learning-gains-as-rpg-status) — kuku는 *vault 구조 자체*를 RPG 마을로 공간화. 둘은 같은 발상의 시간축(status) vs 공간축(town) 판. + class-from-data + boids steering + job state machine = 작가 게임 결정론 AI([적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](../techniques/enemy-decision-making.md)·[Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](../techniques/dijkstra-maps.md)) 패턴의 비게임 적용 실례. 단 *코스메틱 시각화*이지 창발 사회 시뮬([Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md))은 아님 — 둘의 경계(시각화 ↔ 창발) 인지가 수확.
2. **decision 노드 = 스테이징 영역의 인라인판** — 결정을 *문서 안 fenced 블록*으로 박아 pending→resolved 추적. 작가는 별도 `스테이징 영역/` 파일로 분리 — 둘 다 유효, 분리형이 grep·archive 친화.
3. **checksum 충돌 가드** — 외부 AI 동시편집 위험(작가 soft 룰)의 hard 버전. 단 infra-0이라 채택 대신 *인지*만.

### 반영처 (학습→반영 루프, 루프)
- 대부분 **확증**(작가 기존 자산이 옳았다는 외부 ground-truth) → 신규 룰 0. 억지 반영 금지(순수 확증 지식, 과적용 가드).
- 🟡 **consideration backlog (도입 아님, 성찰 입력)**: ① 하드강제 vs 소프트규율 스펙트럼 = 작가 HITL이 soft인 이유(외부 CLI 제약)를 명시한 1줄 가치 / ② checksum 핀 provenance = 출처 추적 고해상도 옵션(Zotero 트리거 도달 시 재고) / ③ **메타패턴 "구조차단 + 불변 테스트"**(kuku 3종: FORBIDDEN 도구·checksum·no-plaintext test) = HITL을 *규율→구조+테스트*로 올리는 방향. 둘 다 infra-0 유지 = 현행. 트리거 = 작가가 "거버넌스 하드닝" 명시 요청 시.
- ⚪ **순수 지식(반영처 0)**: Encrypted Sync(E2EE envelope·signed commit·CAS) = 작가 단일사용자 로컬 vault엔 felt-need 0 → 보안 패턴 교양으로만 흡수(억지 반영 X, 과적용 가드 준수).
- 🔗 **확증 링크**: goose-harness-groundtruth(하네스 정본) 옆에 *거버넌스 정본*으로 나란히. [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](ai-employee-obsidian-stack.md)(Obsidian AI 스택)의 제품 인스턴스.

---

## 열린 질문

- decision 노드의 `targetChangeId` ↔ mutation plan 연결(제안→적용 추적)의 정확한 배선은? (apply 경로 `editor_apply.ts` 미정독 — 필요 시 후속 clone.)
- `kuku-ai/provider`에 gemini·remote만 — 로컬 모델/Claude 경로는? (provider/mod.rs 미정독.)
- self-improving context의 "더 나은 맥락 상속" 구체 메커니즘(resolved decision이 다음 세션 컨텍스트로 주입되는 경로) = README 주장, 코드 검증 미완.

---

## 다음 학습 후보

- **kuku `editor_apply.ts` + `service.ts`** — 제안→승인→파일 mutation 적용 경로 정독(거버넌스 배선 완결).
- **Obsidian Smart Composer / Copilot 플러그인** — 같은 "vault + AI 제안" 문제의 경쟁 구현 대조.
- **CRDT/Yjs 동기화** — kuku encrypted sync(key envelope·signed commit)의 충돌해소 기반 기술.

---

## 연결된 페이지

- CLAUDE.md (HITL 스테이징·AI 결정 origin·Dual-Track — kuku가 제품 확증) · goose-harness-groundtruth (하네스 정본 ↔ 본 페이지 거버넌스 정본) · [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](ai-employee-obsidian-stack.md) (Obsidian AI 스택) · graphify (인덱서 인접)
- [지식 하네스 레지스트리 — Knowledge Harness Registry](knowledge-harness-registry.md) · [llm-wiki (fivetaku)](llm-wiki.md) — 지식 거버넌스·세컨드브레인 운영 패턴 자매(본 페이지=제품 거버넌스 확증 / registry=코드지식 레지스트리 / llm-wiki=위키 스키마 원리)
- *(external-ai-grant-hardcontract·cold-verify-before-adopt·learning→반영 루프 = 작가 운영 메모리, 본 학습이 외부 확증)*
