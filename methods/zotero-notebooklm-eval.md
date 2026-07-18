---
created: 2026-06-02
updated: 2026-06-16
type: learning
tags: [vault-architecture, decision-archive, zotero, notebooklm, mcp, risk-verification, open-notebook, tts, podcast-generation, self-hosted]
source: 작가 발화 "차세대 LLM Wiki 시스템 고도화 제안서" (2026-06-02)
authors: [gemini (제안), claude (검증)]
year: 2026
category: method
---

# Zotero + NotebookLM 통합 제안 검증 archive

> 제안 수용 X (원안). *부분 추출* 만 채택. 본 노트는 *왜 거부했는지* + *언제 재검토할지* 의 archive.

## 0. 한 줄

존재하지 않는 문제 (스토리지 한계) 에 대한 과잉 엔지니어링. vault 본질 (나 자신) 과 mismatch. *frontmatter 컨벤션 강화* 로 동일 목적 달성. 외부 SaaS·비공식 스크래퍼 도입 X.

## 1. 제안 요지 (2026-06-02)

원 제안:
- **Zotero** — 논문·웹페이지·동영상 원본 보관 + 메타데이터
- **Zotero MCP** — Claude Code 에서 semantic 검색·컬렉션 생성
- **notebooklm-py** — NotebookLM 제어 권한 획득, 인포그래픽·PPT 자동 생성
- **단일 터미널** (Claude Code) 에서 모든 명령

기대 효과: "Gold In, Gold Out", 완벽한 source tracking, 비용 절감

## 2. 검증 결과 — 4 단계 리스크

### 2.1 🔴 R1: 스토리지 한계 주장이 *팩트 미스*

조사 데이터 (2026-06-02 측정):

| 항목 | 실제 크기 |
|---|---|
| Sub brain 전체 | 190M |
| raw/ | 54M |
| raw/papers/ (PDF 17개) | 53M |
| wiki/learnings/ | 784K |

→ Obsidian Sync 무료 1GB 의 **19% 사용**. "한계" 부재. 제안서가 가정한 문제가 *현실에 없음*

### 2.2 🔴 R2: vault 철학 파괴

vault CLAUDE.md §0: *"나는 관리자, LLM은 기록자"*, vault 주제 = *"나 자신"*. 외부 지식 aggregator 아님.

NotebookLM 에 me/identity / values / reflections 업로드 = Google 학습 데이터·보관 정책 적용 = *돌이킬 수 없는* 개인정보 외주.

### 2.3 🔴 R3: notebooklm-py = 비공식 스크래퍼, ToS 회색지대

- NotebookLM 공식 API **없음** (2026-06 기준)
- `notebooklm-py` = 세션 쿠키 / 내부 endpoint 역공학
- Google ToS §"Automated queries" 위반 가능 — 계정 정지 위험
- Google UI 변경 시 *전체 파이프라인 깨짐*

→ vault 핵심 파이프라인을 *비공식 스크래퍼* 위에 얹는 것

### 2.4 🔴 R4: vault 도메인 mismatch

- Zotero = *학술 인용 그래프* 도구
- vault = *경험·관계·정체성* 그래프
- `learnings/techniques/` 32 페이지 = 작가가 *직접 읽고 자기 언어로 정리* — Zotero+NotebookLM 자동화는 이 *주체적 정리 행위* 를 외주화

### 2.5 🟡 Major (R5-R7 요약)

- **R5 4-AI 분업 붕괴** — NotebookLM 자리 없음, 헌법 갱신 강요
- **R6 Zotero 자체 비용** — 무료 300MB 만 (Obsidian 1GB 보다 적음). 6GB $60/yr, 무제한 $120/yr. "무료" misleading
- **R7 false simplicity** — Claude Code → Zotero MCP → Zotero app → cloud / notebooklm-py → Google → vault file watcher = 6 단계 직렬, 복잡도 *은폐* 만

## 3. 도입 트리거 (재검토 조건)

아래 *하나라도* 충족 시 본 노트 §2 의 검증 결과를 *처음부터* 재평가:

### Trigger A — 스토리지 임계
- `raw/papers/` 가 **500MB 돌파** (현재 53M → 약 10x)
- 또는 vault 전체가 **800MB 돌파** (현재 190M → 약 4x, Obsidian Sync 1GB 임계 근접)
- 또는 작가가 Obsidian Sync 유료 plan 결제 시점

### Trigger B — 도메인 전환
- 학술 *논문 작성* 비중이 vault 활동의 50%+ 도달
  - 측정: `workflows/paper-write.md` 호출 빈도 / 월
  - 또는 `applications/` 가 *논문 출판* 트랙 추가
- 또는 작가가 *대학원·연구직* 트랙 본격 진입

### Trigger C — 컨텍스트 한계 명확화
- Claude Projects / Gemini Gems / graphify 로 *명백히 해결 안 되는* 컨텍스트 문제가 *반복적으로* 발생
- 측정: 동일 학습 자료를 *3 회 이상* 처음부터 다시 설명해야 하는 빈도
- 또는 NotebookLM 의 *audio overview* / *mind map* 같은 native 기능이 vault 운영 직접 가치 입증

→ 3 트리거 *전부* 미충족 동안: 본 결정 (도입 보류) 유지

### 3.5 open-notebook 재조우 (2026-06-16, 작가 재공유)

[lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) (31k★) = **셀프호스트·프라이버시 NotebookLM 대안**(Docker, FastAPI+Next.js+SurrealDB, LangChain 18+ 프로바이더, Ollama 로컬 추론).

- **거부 사유 일부 해소**: ✅ R2(개인정보 Google 외주) — 셀프호스트+로컬 Ollama 라 데이터 안 나감 / ✅ R3(notebooklm-py 비공식 스크래퍼·ToS) — 공식 Docker+REST API 라 소멸.
- **불변**: ❌ R1(없는 스토리지 문제)·R4(도메인 mismatch)·R7(인프라 부담은 *오히려 악화* — 직접 띄워 유지). → **도입 보류 결정 유지**.
- **Trigger C 발동 시 정답 갱신**: 연구자료 audio overview/팟캐스트화 가치가 입증되면, Google NotebookLM 대신 **open-notebook 셀프호스트가 R2/R3-safe 정답**.

### 3.6 🔧 개념 참고 — 미래 "TTS 삽입 앱" 개발 시 꺼낼 것 (도입 X, 아키텍처 패턴만)

open-notebook 이 *어떻게* 텍스트→오디오를 했나의 **개념 grain**(구현 세부 deep-fetch 안 함, 환각 방지). 나중에 TTS 삽입 앱 개발 시 참조:

- **멀티화자 팟캐스트 생성 (1~4명)** — 단일 TTS 출력이 아니라 *화자 프로파일별* 라인 분배 → 대화형 오디오. (Google 2화자 제약 대비 차별점.)
- **프로바이더 추상화 (LangChain)** — TTS/LLM 백엔드를 18+ 어댑터로 갈아끼움. *벤더 락인 회피* 설계 → 우리가 앱 만들 때도 TTS 엔진(로컬/클라우드) 스왑 가능 구조 권장.
- **셀프호스트 + Docker compose** — 오디오 생성 파이프라인을 로컬 서비스로. 프라이버시·비용 통제.
- **멀티모달 입력 → 오디오** (PDF·웹·영상 → 팟캐스트) = 소스 정규화 후 TTS 단계 분리.

→ 키워드(검색용): TTS 앱 / 팟캐스트 생성 / 멀티화자 / audio overview / 화자 프로파일. 실제 개발 착수 시 이 패턴 + open-notebook repo 재해체(그때 deep-fetch).

## 4. *부분 채택* 한 통찰

제안서 통째 거부 X. 가치 있는 부분 *추출*:

| 통찰 | 채택 방식 |
|---|---|
| "출처 추적 단절" 문제 | `wiki/스테이징 영역` patch 작성 — `learnings/` frontmatter 5 필드 (source/authors/year/doi/local_pdf) 컨벤션 |
| "메타데이터 보존" | 동상 — frontmatter 로 충족 |
| "AI 컨텍스트 윈도우 제약" 인식 | 작가 stack 의 *기존* 도구 활용 — Claude Projects (긴 연구), Gemini Gems (반복 토픽), `/graphify` (대규모 자료 그래프화), Claude Code MCP (CodeGraph) |
| MCP 활용 발상 | 작가 *이미* MCP 운영 중 (CodeGraph, Tolaria, Figma, PlayMCP 등). 새 MCP 도입은 *명확한 트리거* 후에만 |

## 5. 작가에게 주는 가드 (당시 Gemini 발화 패턴 학습)

본 제안서는 *Gemini 가 자주 하는 실수 패턴* 의 사례. 향후 유사 제안 사전 차단용:

1. **존재하지 않는 문제에 솔루션 제시** — "한계가 있다" 주장 시 *실측 데이터* 요구
2. **외부 SaaS 의존 권유** — vault 철학 (작가 본인 = 권위) 과 충돌. 매번 vault CLAUDE.md §0 으로 사전 검토
3. **비공식 API / 스크래퍼** — *공식 지원 여부* 명시 안 한 도구는 *기본 거부*
4. **"단순화" 라는 수사로 복잡도 은폐** — 의존성 그래프 그려 *실제 깨질 수 있는 지점* 카운트
5. **vault 도메인 재정의 시도** — "외부 지식 aggregator" / "academic research hub" 류 전환 제안은 본질 변경. 작가 명시 발화 없이는 거부

→ Karpathy #1 (Surface Assumptions) 의 *vault 운영 버전*

## 6. 연결

- [Odysseus — 자가 호스팅 AI 워크스테이션 참조 구현](odysseus.md) §7.2 — Gemini backwards mapping 차단 사례 (com2us). 본 노트는 *vault 자체* 에 대한 backwards proposal 차단 사례. 둘 다 같은 패턴
- risk-verification-report — vault 운영 리스크 일반 (R-04 AI 결정 origin 표기, R-05 review trigger 등)
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — #1, #2, #3 모두 본 검증의 근거
- graphify — NotebookLM 의 "여러 소스 통합 대화" 의 *작가 stack 등가물*
- `wiki/스테이징 영역` — 본 결정의 부분 채택 patch

## 7. 운영 메모

- 2026-06-02 작가 결정: "제안 수용한다" — *이때 수용한 것은* §4 부분 채택. 원안 X
- 본 노트 자체는 *결정 archive*. 트리거 없으면 갱신 X
- 트리거 도달 시: 본 노트 §2 (리스크 4종) 데이터 재측정 → 여전히 유효하면 보류 유지, 일부 무효화 시 *그 부분만* 재검토
