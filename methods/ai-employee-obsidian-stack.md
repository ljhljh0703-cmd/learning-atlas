# AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)

---
created: 2026-05-15
updated: 2026-05-15
type: learning
tags: [methods, obsidian, claude, mcp, automation, operations, transcript-loop, founder-stack]
status: archived
source: 작가 공유 (founder 블로그 글, "I gave AI a brain..." — 출처 미상, 작가 큐레이션)
related_to:
  - "claude-obsidian"
  - "graphify"
  - "[seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md)"
---

# AI Employee Obsidian Stack

> "Most people use AI like a temp worker with amnesia."
> 파운더 1인이 Obsidian + Claude Cowork + MCP + 자동 transcription 으로 *AI 직원* 을 만든 5피스 스택.
> **본 페이지는 archive — 작가 vault 와의 *차이점* 만 추출**. 중복 개념은 claude-obsidian 참조.

---

## 1. 5피스 구성 (요약)

| # | 피스 | 역할 | 작가 vault 보유? |
|---|------|------|----------------|
| 1 | **Obsidian vault** (Memory + Home + 도메인 폴더) | 구조화된 지식 베이스 | ✅ 이미 보유 (sub-brain) |
| 2 | **Call transcription → Drive** (Fathom + Zapier) | 자동 transcript 수집 | ❌ 미보유 |
| 3 | **Obsidian MCP** | Claude 가 vault 직접 read/write | ✅ tolaria MCP 보유 |
| 4 | **Claude Cowork + MCP connectors** (Slack/Calendar/Drive/Gmail/ClickUp) | 외부 도구 연결 | 🟡 부분 보유 (Drive/Gmail/Calendar) |
| 5 | **Custom instructions** (1줄: "answer 전 vault 항상 검색") | 자동 컨텍스트 로드 | ✅ CLAUDE.md schema 로 보유 |

---

## 2. 핵심 인사이트 — 작가가 *아직 안 가진* 패턴 3건

### 2.1 자동 Memory Loop (transcription → vault 자동 ingest) ★ 가장 큰 NEW

```
Call (Zoom/Meet/Fathom)
   ↓ 자동 녹취
Fathom → Zapier (watch new transcripts)
   ↓ 자동 routing
Google Drive (Transcripts/ 폴더)
   ↓ daily Claude Cowork pull
Claude (Drive MCP + Obsidian MCP)
   ↓ 자동 추출
[summary] [decisions] [action items + owner + deadline]
   ↓ 자동 write
Obsidian vault (Action Tracker / Decision Log / Client files)
```

**핵심 가치**: 사용자가 *기억 안 해도 시스템이 기억* — "3주 전 통화에서 합의한 배송 정책 변경" 을 본인은 잊었지만 Claude 가 회의록에서 끌어와 답함.

**작가 적용 여지**:
- 작가는 *통화* 가 아닌 *글쓰기·기획 세션* 중심 — 비대칭 적용 필요
- 변형 시나리오:
  - Claude/Gemini 와의 *long-form 대화* → 자동 transcript → vault 자동 ingest (현재는 hot.md 수동 갱신)
  - Cursor/VSCode 코딩 세션 → 자동 progress.md append (현재는 Codex 수동)
  - [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) 이 비슷한 컨셉 (AI 에이전트 세션 검색) — 이미 archive 됨, 본 패턴과 결합 가능

### 2.2 Vault-in-Drive 멀티머신 동기화

> "If your vault lives in a local folder, it's stuck on one machine. Put it in Google Drive (or Dropbox, or iCloud) and it syncs everywhere."

**작가 현황**: vault 가 로컬 (`<vault>`).
**적용 여지**: 작가 멀티머신 사용 여부 확인 필요. 단일 머신이면 *불필요* (#3 Surgical — 가설 적용 금지).
**리스크**: Drive sync 가 .obsidian/ workspace 파일 충돌 유발 가능. 적용 시 sync 제외 규칙 필요.

### 2.3 1줄 Custom Instruction 트릭 (vs 거대 CLAUDE.md)

> "Before answering any question, always search the Obsidian vault for relevant notes."

**작가 현황**: CLAUDE.md (수백 줄) 가 schema 권위. 본 1줄 패턴은 *대조적 미니멀리즘*.
**해석**: 두 패턴은 *충돌 X 보완 O*.
- CLAUDE.md = *어떻게 행동할지* (역할·룰·우선순위)
- 1줄 instruction = *언제 vault 를 읽을지* (행동 트리거)
**작가 적용 여지**: CLAUDE.md 첫 §"대화 시작 시" 가 이미 동일 역할 수행 — 별도 1줄 X. 단, *세션 중간* (대화 중반 새 토픽 발생 시) 자동 재검색 트리거는 부재 → 본 패턴 차용 가능.

---

## 3. 작가에게 *덜 적용되는* 부분 (skip 정당화)

| 원문 요소 | Skip 사유 |
|----------|----------|
| Client Roster / Action Tracker (15인 팀 운영) | 작가는 1인 작가·기획자, 클라이언트 운영 부재 |
| Slack / ClickUp MCP | 작가 도구 스택 외 |
| Sales process / Production workflow / Org structure 문서 | B2B agency 컨텍스트, 작가 컨텍스트 외 |
| Daily brief 자동 생성 | 작가는 hot.md 수동 갱신으로 충분 |

→ 본 article 의 *비즈니스 운영* 컨텍스트는 작가 mirofish-lab / hwiglija-tower-gdd 같은 *창작 프로젝트* 컨텍스트와 다름. 운영 자동화 패턴 (§2.1) 만 추출, 나머지는 archive 후 보류.

---

## 4. 작가 vault 와의 매핑

| article 개념 | 작가 vault 등가물 |
|-------------|----------------|
| Memory file (onboarding doc) | `CLAUDE.md` + `wiki/me/identity.md` + `wiki/me/professional.md` |
| Home page | `wiki/index.md` |
| Action Tracker | `wiki/hot.md` Pending Tasks + 각 SSOT 의 OQ 섹션 |
| Library of frameworks | `workflows/` + `tech/methods/` + `wiki/learnings/methods/` |
| Templates | `templates/` |
| Decision log | 각 SSOT 의 §2 DECISIONS (D-NNN / M-NNN) |
| Client files | (없음 — 비즈니스 컨텍스트 부재) |

→ 작가 vault 는 article 의 *biz-ops 변형* 보다 한 층 더 정교 (D-NNN 잠금, vision/blueprint 분리, SSOT-PATCH 워크플로우 등). 본 article 은 *시작 단계 가이드* 로 가치 있음 — 누군가에게 sub-brain 컨셉 소개 시 reference 로 활용 가능.

---

## 5. 액션 결정 (작가 확정 2026-05-15)

- ⏸ **AI 대화 transcript 자동 ingest** (§2.1) — **deferred**. infra 작업, 별도 design 세션 필요. ROI 높음으로 평가, 차후 재검토.
- ❌ **Vault-in-Drive sync** (§2.2) — **skip 확정**. 작가 단일 머신 운용. sync 복잡도·`.obsidian/workspace*` 충돌 리스크 회피. 멀티머신 전환 시 재검토.
- ✅ **세션 중간 vault 재검색 트리거** (§2.3) — **적용 완료**. `CLAUDE.md` §"대화 시작 시" → 하위 §"세션 중 새 토픽 진입 시" 신설.

→ 본 article 의 학습 결과 처리 종료. 차후 §2.1 응용 design 시 본 페이지 재참조.

---

## 6. 연결

- 개념 권위: claude-obsidian — Compounding Knowledge Engine, Hot Cache, Multi-layered Retrieval
- 인접 도구: graphify (지식 그래프 구조화), [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) (AI 세션 검색)
- 워크플로우 인접: `workflows/page-index-automation.md` (PDF → 트리 인덱스), `workflows/paper-study.md`
- 운영 schema: `CLAUDE.md` (작가 vault 권위 schema)
- 잠재 응용: mirofish-lab EXP 결과 자동 ingest, hwiglija-tower-progress Codex 자동 append 와 결합 가능
