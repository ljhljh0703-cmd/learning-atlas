---
created: 2026-06-04
updated: 2026-06-04
type: learning
tags: [design-system, tooling, agent, local-first, mcp, frontend, DESIGN.md]
source: https://github.com/nexu-io/open-design
authors: [nexu-io]
year: 2026
category: method
---

> **2026-06-16 1차 출처 재대조(repo)**: 핵심 확인 일치(3계층·매 렌더 active DESIGN.md 소비·MCP). 현행 규모 정정 — MCP **22+ 에이전트**(21+ → 갱신), Skills **100+**, Design Systems **150** 브랜드, Plugins **261**. DESIGN.md = 9섹션(color/typography/spacing/layout/components/motion/voice/brand/anti-patterns). 번들 템플릿(guizang-ppt·html-ppt)은 원저자 MIT 유지.

# Open Design — DESIGN.md 를 런타임에 소비하는 로컬-퍼스트 디자인 엔진

*nexu-io (Apache-2.0)*

Anthropic 의 폐쇄형 Claude Design (2026-04 출시) 에 대한 *오픈소스·로컬-퍼스트 대안*. 이미 내 머신에 깔린 코딩 에이전트 (Claude Code, Cursor, Copilot 등 22+) 를 *디자인 엔진* 으로 쓴다. 클라우드·벤더 종속 없음.

> **포지셔닝 주의**: 이건 [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) 처럼 *포맷* 도, [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) 처럼 *레퍼런스 컬렉션* 도 아니다. **DESIGN.md 를 실제로 읽어 산출물을 뽑는 *실행 엔진/앱*** 이다. 세 페이지는 포맷 → 사례집 → 런타임의 삼각 구도.
> 분류: method (도구). NPC blueprint 직결성: 없음. 적용성: **직접** (현재 parkdal-design-system-spec + html-publish 작업과 같은 아키텍처). 시급성: 지금~중기.

---

## 한 줄 요약

> 디자인 지능을 *Skills (워크플로우) · Design Systems (DESIGN.md 브랜드 계약) · Plugins (자동화)* 3 계층으로 쪼개 portable 하게 배포하고, 로컬 CLI 에이전트가 매 렌더마다 active `DESIGN.md` 를 읽어 프로토타입·덱·대시보드·영상을 뽑는 로컬-퍼스트 스튜디오.

---

## 핵심 개념

### 1. 3-계층 분산 아키텍처 (모놀리식 도구 거부)

| 계층 | 내용 | 규모 |
|------|------|------|
| **Skills** | 재사용 디자인 워크플로우 (랜딩·덱·대시보드 등 task 템플릿) | 100+ |
| **Design Systems** | `DESIGN.md` 로 코드화된 브랜드 계약 (Linear·Stripe·Apple·Tesla 등) | 150+ |
| **Plugins** | 합성 가능한 자동화 | 261 공식 |

→ 브랜드 추가 = `DESIGN.md` 한 장 드롭. 빌드 스텝·테마 엔진 없음. ([DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) 의 "plain text 자체완결" 철학을 *배포 단위* 로 끌어올린 것.)

### 2. 핵심 루프 (편집 = regenerate 가 아님)

```
Brief → Plugin → Direction → Design System → Artifact → Handoff → Memory
```

1. 브리프 제출 (home/CLI)
2. Plugin picker 가 task 템플릿 제시
3. 시각 방향 lock (또는 큐레이션된 옵션 선택)
4. 에이전트가 active `DESIGN.md` 읽고 첫 산출물 emit
5. 산출물이 *sandboxed iframe* 으로 스트림 — **in-place 편집** (처음부터 재생성 X)
6. code (React/Next/Vue) · PPTX · PDF · MP4 · HTML 로 export
7. 확정 산출물·스크린샷이 *다음 세션 default* 로 = Memory

→ #6→#7 의 "확정본이 default 가 된다" = vault 의 *승격 (promote)* 패턴과 동형. 외부 산출물이 권위로 흡수되는 구조.

### 3. DESIGN.md = "living contract" (JSON 테마 객체 아님)

매 렌더가 active `DESIGN.md` 9-섹션 스키마 (palette·type·spacing·layout·components·motion·voice·brand·anti-patterns) 를 읽음. 150 개 번들 시스템 간 *단일 스위치* 가 모든 하위 산출물을 재형성. **anti-slop** 지향 (브랜드 거버넌스로 LLM 의 "밋밋한 평균" 출력 차단).

→ 포맷 디테일은 [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) / [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) 9-섹션 표 참조. 여기선 *엔진이 이걸 런타임 진실로 쓴다* 는 점만.

### 4. 로컬-퍼스트 + MCP 멀티-에이전트

- **저장**: `.od/app.sqlite` (better-sqlite3) + `.od/projects/<id>/`. 텔레메트리 0.
- **에이전트 어댑터**: MCP 서버로 21+ CLI 연동 (Claude Code, Cursor, Copilot, Hermes, Kimi 등).
- **BYOK 프록시**: `/api/proxy/{anthropic,openai,azure,google,ollama}/stream` — SSRF 방어 포함. 자기 키로 자기 모델.
- **셸**: Electron + sandboxed renderer. Next.js 16 / Node 24 / Express.

### 5. 산출물 타입 폭

웹·모바일·데스크톱 프로토타입, 라이브 대시보드, 피치덱, 이미지, **영상 (HyperFrames)**, 오디오. → 영상 렌더가 [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) 라는 점이 직접 연결 ([Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](hyperframes-skill-pattern.md) 의 frame-adapter 패턴).

---

## 기술 스택 / 사용법

```
Frontend : Next.js 16 (TS, React 18)
Backend  : Node 24 · Express · SQLite (better-sqlite3)
Desktop  : Electron + sandboxed renderer
Export   : HTML · PDF · PPTX · MP4(HyperFrames) · Markdown · ZIP
Agents   : 21+ CLI via MCP server
License  : Apache-2.0 (번들 guizang-ppt / html-ppt 는 MIT 유지)
```

규모 (스냅샷): ★58.4k · fork 6.6k · commit 1,949 · 최신 릴리스 v0.9.0 (2026-06-02, in-app Model Router 도입).

---

## 내 생각 — 적용 관점

### 직접적 연결: **높음 (현재 작업)**

parkdal-design-system-spec (PDD) + html-publish `build.py`/`lint.py` 연동 설계가 *정확히 같은 아키텍처* 다 — "디자인 토큰 명세를 렌더 타임에 읽어 산출물을 빌드하고 제약을 lint 한다". open-design 은 이 발상이 **★58k 규모로 검증된 패턴** 임을 보여준다. 내가 혼자 발명하는 게 아니라 업계 표준 계보 위에 있음.

### 개념적 수확

1. **"엔진은 얇게, 계약은 데이터로"** — 도구 로직(build.py)에 브랜드를 하드코딩하지 말고 PDD 를 *유일한 가변 데이터* 로. open-design 의 150 시스템 단일 스위치 = PDD 교체만으로 전체 톤 전환 가능한 설계 목표.
2. **in-place 편집 > regenerate** — 산출물을 매번 새로 뽑지 말고 *수정 가능 상태로 유지*. html-publish 퍼블리셔도 "재빌드"보다 "토큰 diff 반영" 지향이 토큰 효율적 ([DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) 의 `diff` CLI 와 같은 발상).
3. **확정본 → default = Memory** — 루프 #7 이 Dual-Track 의 *승격* 과 동형. 외부 산출물이 확정되면 vault 권위로 흡수되는 CLAUDE.md §0순위 철학의 디자인 버전.
4. **스펙 파일 가족의 런타임화** — [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) 에서 본 `AGENTS.md ↔ DESIGN.md` 짝이, 여기선 *실제로 돌아가는 앱* 의 입력으로 구현됨. 가설이 제품이 된 사례.

### 갤럽 강점 연결

traits "전략" — design-md(포맷)·awesome-design-md(사례)·open-design(엔진) 3 자를 *하나의 워크플로우* 로 조합 평가. 개별 도구가 아니라 삼각 구도로 보는 게 수확률 핵심.

---

## 열린 질문

- PDD 가 open-design 의 `DESIGN.md` 스키마와 *호환* 되게 설계하면, 내 vault 산출물을 open-design 엔진으로도 뽑을 수 있나? (이식성 vs 독자 규격의 트레이드오프)
- 로컬-퍼스트 SQLite 저장 모델이 Obsidian vault (Markdown 파일) 와 충돌 없이 공존하나
- html-publish 가 이미 deterministic 빌드를 하는데 open-design 을 *도입* 할 가치 vs *패턴만 차용* 할 가치 — 후자가 #2 Simplicity 정합
- BYOK 프록시의 SSRF 방어 구현이 내 보안 가이드라인 ([보안 및 DB 아키텍처 가이드라인 (Security & DB Guidelines)](security-db-guidelines.md)) 과 비교해 참고할 점

---

## 다음 학습 후보

- **Claude Design (Anthropic 원본)** — open-design 이 대안으로 삼은 폐쇄형 원점. 무엇을 베끼고 무엇을 거부했나
- **Google Stitch** — DESIGN.md 표준의 또 다른 발상지 ([awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) §5 미해결 후보)
- **MCP 디자인 어댑터 패턴** — 21+ 에이전트를 하나의 엔진에 붙이는 어댑터 설계 (내 3-AI 분업에 시사)
- **HyperFrames 심화** — open-design 영상 export 의 실제 동작 ([Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) 보강)

---

## 연결된 페이지

- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) — DESIGN.md *포맷 스펙* (open-design 이 소비하는 입력 규격)
- [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) — 브랜드별 DESIGN.md *사례집* (open-design 의 150 시스템과 같은 계보)
- parkdal-design-system-spec — 내 vault 의 *같은 아키텍처* 구현 (PDD + html-publish)
- [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) · [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](hyperframes-skill-pattern.md) — open-design 의 영상 export 엔진
- kami-design-system — PDD 의 또 다른 입력 소스
- index — 메타 도구 컬렉션
