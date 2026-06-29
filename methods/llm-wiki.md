---
created: 2026-06-20
updated: 2026-06-20
type: learning
tags: [wiki, knowledge-graph, routing, provenance, llm-ops, index-design]
source: https://github.com/fivetaku/llm-wiki
authors: [fivetaku]
year: 2026
category: method
---

# llm-wiki (fivetaku)

Karpathy "LLM Wiki" 패턴 구현 템플릿. Claude Code 전용 마크다운 위키 워크스페이스.
raw 소스를 LLM이 합성·유지하는 영구 지식 베이스 — 매 질문마다 재검색하는 RAG가 아니라 한 번 합성하고 최신 상태로 누적.

MIT 공개. 실제 콘텐츠는 없음(공유용 템플릿). 배울 것은 **설계 아키텍처** 자체.

기존 vault 연결: index.md (카탈로그 → 라우터로 전환 대상)·CLAUDE.md (Sub brain 헌법 — provenance·Contradiction 패턴 흡수 대상)

---

## 핵심 아키텍처 — 3-Layer

```
raw   (불변 원본, LLM 읽기만)
wiki  (LLM 소유, LLM이 씀)
schema(CLAUDE.md = 위키 운영 규약)
```

레이어를 절대 섞지 않는다. raw는 수정·삭제 금지. schema는 CLAUDE.md 하나. 이 분리가 "원본이 어디 있는지"를 항상 명확하게 한다.

---

## 1. 라우터/MOC 아키텍처 ★★★ (가장 큰 배움)

**핵심 통찰**: `index.md`는 "모든 페이지 목록(카탈로그)"이 아니라 **"어디로 갈지 정하는 라우터(MOC)"**다.

### 현재 우리의 문제

우리 `wiki/index.md`는 344줄 카탈로그다. query할 때마다 통째로 읽어야 한다. 페이지가 쌓일수록 토큰이 선형 증가한다.

### fivetaku의 해법: 2단 라우팅

```
질문
 │
 ▼ Phase A — Route (~2K 토큰, 페이지 안 읽음)
index.md (주제 라우터) + aliases.md → "어느 타입/샤드?" 결정
 │
 ▼ Phase B — Search (지정 샤드만)
indexes/{type}.md (타입 인덱스) → 후보 선별 → 페이지 본문 + 1홉
```

**Phase A 불변식**: 라우터+aliases만 읽고 샤드를 결정. **샤드는 절대 읽지 않는다.** 이를 어기면 샤딩의 토큰 절감이 사라진다.

### 샤딩 규칙 (≤50K 토큰)

타입 인덱스가 커지면 **정본명 첫 글자로 분할**:
- `indexes/entities-a-m.md`, `indexes/entities-n-z.md`
- 한글 정본은 둘째 샤드(-n-z)에 모음
- 라우터의 분할 키 표를 샤드와 동기화 (lint가 점검)

### aliases.md — 정본화 (라우팅 키)

표기 흔들림 해소:
```markdown
| 표기/별칭 | 정본명 | 타입 |
|-----------|--------|------|
| Parasite, 기생충 | 기생충 | entity |
| 샬라메 | Timothée Chalamet | entity |
```

정본명 **첫 글자가 샤드 키**. query 전에 aliases.md로 정본화 후 라우팅.

---

## 2. 4동사 분리 — ingest/compile/query/lint ★★

**ingest(수집)↔compile(위키화)를 명시적으로 분리**한다.

| 동사 | 역할 | 산출 |
|------|------|------|
| `/ingest` | 소스를 inbox에 저장만 | `10-inbox/{date}-{slug}.md` |
| `/compile` | inbox → 위키 페이지 합성 + raw 이동 | `30-wiki/` 페이지 다수 |
| `/query` | 2단 라우팅으로 답 + 파일백 | 답변 + `50-queries/` |
| `/lint` | 모순·고아·인덱스 정합·갭 점검 | 리포트 |

inbox에 남아 있으면 = 미처리. raw로 이동한 것 = 처리 완료. **시각적 추적 가능**.

우리 시스템은 ingest와 compile이 암묵적으로 합쳐져 있다. 명시적으로 분리하면 "아직 위키화 안 한 소스" 추적이 된다.

---

## 3. provenance 4등급 강제 ★★

모든 사실 주장에 출처 역링크 + 등급 필수:

| 등급 | 의미 |
|------|------|
| `extracted` | 원본에서 직접 추출 |
| `inferred` | LLM 추론·합성 (단정 금지, 확인 대상) |
| `ambiguous` | 정본·사실이 모호 |
| `web-enriched` | lazy 생성 시 웹 보강 (tier: auto와 짝) |

`inferred`/`ambiguous`는 단정 금지. 사람 확인 후 `extracted`로 승격.

우리 `proposed_by/confirmed_by`는 결정 추적 용도. fivetaku는 **모든 사실 주장 단위**로 provenance를 붙인다. 다른 레벨의 강제.

---

## 4. Contradiction 명시 블록 ★

소스 충돌 시 덮어쓰지 말고 양쪽 보존:

```markdown
> ⚠️ Contradiction: A는 X라 하고 B는 Y라 한다. 미해결.
```

`/lint`가 `grep -rn "⚠️ Contradiction" wiki/`로 전수 추적. 모순을 시각화하고 추적 가능하게.

우리 시스템에는 이 패턴이 없다. 학습 페이지에서 서로 다른 출처가 충돌할 때 암묵적으로 처리한다.

---

## 5. Lazy 생성 + tier 승격 ★

- **≥2회 등장**한 엔티티만 자체 페이지. 1회는 상위 페이지에 plain text 씨앗.
- 씨앗이 있으면 질문 시 즉석 생성 (`tier: auto`, `provenance: web-enriched`)
- `auto-generated.md` 대장에 등록 (미검수 표시)
- 사람 확인 시 `reviewed`로 승격 → 인덱스·대장·frontmatter 세 곳 동기화

→ 우리 graphify의 노드 생성과 유사하지만, tier 관리와 대장이 없다.

---

## 6. 소크라테스 게이트 ★

compile 시 LLM이 **수동 수용자가 아니라 비판자**로 동작:
- 소스를 읽은 뒤 모순·약점·근거 부족을 능동적으로 짚어 되묻는다
- `inferred`/`ambiguous` 주장은 사람 확인 후에만 확정
- 대량 자동 생성 후 lint로 스폿체크

우리의 HITL 스테이징과 방향이 같지만, **질문 레벨**이 다르다. 우리는 SSOT 변경 시 HITL. 저쪽은 사실 주장 단위 HITL.

---

## 7. SessionStart Hook (bash, 외부 의존 0) ★

`.claude/settings.json` + `.claude/hooks/session-start.sh`:
- 위키가 비어 있으면: 온보딩 안내
- 데이터 있으면: 콘텐츠 수·inbox 미처리 파일 목록 자동 주입
- 순수 bash, 외부 의존 0, 항상 exit 0 (세션 비차단)

우리는 `wiki/hot.md`를 **수동으로 읽는** 방식. 이 hook은 세션 시작 시 자동 주입이다.

---

## 8. query 파일백 — 탐색의 누적 ★

좋은 query 결과를 `50-queries/{slug}.md`에 저장:
- 탐색이 채팅에 휘발되지 않음
- 관련 페이지에 `링크` 연결
- 주제 라우터 「저장된 쿼리」절에 등재

우리의 hot.md가 현재 작업 상태 기록이라면, 이것은 **가치 있는 질의 결과 누적**. 비슷하지만 명시적 폴더 구분이 없다.

---

## 9. 페이지 당 ~1,500 토큰 상한

모든 위키 페이지는 ~1,500 토큰 이하. 넘으면 쪼개서 `링크`로 연결. 이것이 샤딩과 함께 "위키 크기와 query 토큰 비용 분리"의 핵심.

우리 일부 페이지(CLAUDE.md, 대형 learnings)는 이 상한을 훨씬 넘는다. 의도적 선택이지만 query 비용이 따른다.

---

## 10. Scale Modes (성장 경로 내재)

| 단계 | 페이지 수 | 구조 |
|------|---------|------|
| Lite | ~수십 | 주제 라우터가 카탈로그 겸함 |
| Standard | ~수백 | 타입별 indexes/{type}.md 분리 |
| Full | 수천+ | 타입 인덱스 첫 글자 샤딩 + 선택적 RAG |

성장 경로가 **처음부터 설계에 박혀 있어서** 데이터가 쌓이면 자연스럽게 진화한다.

---

## 상위호환 전략 — 우리가 추가로 가져야 할 것

fivetaku의 강점(라우팅·provenance·분리 원칙)을 흡수하되, 우리의 강점(실제 콘텐츠·멀티 에이전트·산출물 생성·정체성·Hermes Loop·실 프로젝트)은 유지.

fivetaku가 못 하는 것:
- 산출물 생성 (html-publish·pptx·graphify)
- 정체성 기반 (me/identity 앵커)
- 멀티 에이전트 분업 (Claude·Gemini·Codex)
- 학습→산출물 반영 루프
- 실 프로젝트 운용 (hwigi-tower·applications)
- Hermes Loop (외부 산출물 검증·흡수)
- D-NNN 의사결정 추적

우리가 흡수해야 할 fivetaku 패턴:
1. **wiki/index.md 라우터화** (Phase A/B, 카탈로그→라우터)
2. **Contradiction 명시 블록** (wiki에 모순 발견 시 표준화)
3. **query 파일백** (가치 있는 대화 결과 wiki/ 위치 지정)
4. **aliases.md** (wikilink 표기 정본화)
5. **provenance 등급** (learnings 페이지에 점진 적용)

---

## 학습→반영 루프

**반영처 5곳 (우선순위 순):**

1. **index.md 라우터화** — 가장 크고 중요. 현재 344줄 카탈로그 → Phase A/B 라우터 구조로 전환. 별도 작업 spec 필요. `index-router-spec`로 스테이징.

2. **CLAUDE.md (Sub brain) Contradiction 블록 추가** — `## 위키 페이지 컨벤션` 섹션에 "충돌하는 출처는 `⚠️ Contradiction:` 블록으로 명시" 규칙 1줄 추가. 외과적. HITL 스테이징 경유.

3. **CLAUDE.md (Sub brain) query 파일백 위치 지정** — 가치 있는 대화 결과를 `wiki/reflections/` 또는 `wiki/queries/` 에 저장하는 convention 추가. 현재 암묵적.

4. **index 페이지들 provenance 등급 점진 추가** — 새 학습 페이지부터 `provenance: extracted` frontmatter 의무화 (이미 `source/authors/year` 있음 — 등급만 추가). 기존은 다음 갱신 시 backfill.

5. **aliases 개념 도입** — wikilink 표기가 흔들리는 곳(예: codegraph/CodeGraph, graphify/Graphify) `wiki/aliases.md` 신설. 소규모면 단일 파일로 충분.
