---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [knowledge-brain, agent-harness, vault-first, knowledge-graph, compiled-truth, dream-cycle, thin-harness-fat-skills, model-independent, clean-room, convergence]
source: https://github.com/garrytan/gbrain
authors: [Garry Tan]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "2종 세팅해") — Claude 작성, clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드 복제 X). 흡수 범위 = *개념·철학*(인프라 코드 X — infra-0).

# GBrain — 개인 AI 지식 브레인 production 정본

Garry Tan(YC President/CEO)의 MIT 오픈소스 개인 AI 지식 브레인. 본인 OpenClaw/Hermes 에이전트 뒤에서 실가동(146K pages·24K people·66 cron). markdown git repo 를 system of record 로 두고 Postgres(PGLite WASM, 서버리스)로 동기화 → 하이브리드 검색 + 자가배선 지식그래프 + 합성(`gbrain think`)을 한 박스로. 표어: **"search 는 raw page, brain 은 *답*을 준다."**

**왜 중요한가** — Sub-brain 과 *정확히 같은 도메인의 상용급 구현*. [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md)·[opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](opencode-agent-harness.md)·[The New SDLC With Vibe Coding (Google / Addy Osmani)](../methods/google-new-sdlc-vibe-coding.md) 를 잇는 외부 ground-truth. 단 신규성은 좁다(작가가 이미 무에서 도달) — 가치 = ① *설계 검증* ② compiled-truth/timeline 2존 *차용*.

## 1. Sub-brain 과의 강한 수렴 (= 작가 아키텍처 정당화)

작가가 독립적으로 도달한 것을 상용급이 재발명 = 강한 정당성 신호:

- **brain-first lookup** ("외부 API 전 brain 부터, 필수") ≡ vault-first ①Dispatch / 절대룰 5번.
- **자가배선 그래프**(쓸 때마다 `wikilink`에서 typed edge 추출, **LLM 호출 0**) ≡ wikilink + graphify. gbrain 은 +31.4 P@5 lift 를 실측 보고.
- **dream cycle**(야간 cron: 중복제거·citation 수리·모순감지·compiled truth 재합성) ≡ nightly-updater + dual-track 회고.
- **thin harness, fat skills**(harness=비밀소스·모델 아님 / markdown=code / skill=파라미터 method call) ≡ agent-harness 철학과 사실상 동일. → §6 ground-truth 로 등재.
- **brain vs memory vs session 3계층 라우팅** ≡ vault(세상·자기지식) ↔ Claude memory(작가 선호·운영) ↔ 세션.
- **CLAUDE.md 20,000줄→200줄(포인터 전용)** 일화 ≡ RTK·"포인터 전용 hot".
- 거버넌스: origin/provenance·archive-only·"두 skill 이 같은 page 생성=coverage 위반" ≡ 작가 스킬 자가성장 규율.

## 2. 🌟 차용: compiled-truth + timeline 2존 구조

한 페이지를 두 존으로 가른다 — `---` 한 줄로 분리:

- **위쪽 = compiled truth** (현재 합성, **REWRITE**) — Executive Summary·State·Assessment·Trajectory. 증거 바뀌면 *통째 재작성*(append X). 검색이 더 높게 가중.
- **아래쪽 = timeline** (증거 추적, **APPEND-only·불변**) — `날짜 | 사건 [Source: 누가·채널·시각]`. 틀렸으면 *수정 말고 새 정정 항목 추가*.
- **철칙**: compiled 의 모든 주장은 timeline 항목으로 추적가능해야 함. "200개 timeline 을 읽지 않고 30초에 state 파악."

**Sub-brain 응용** — 작가는 현재 이걸 *파일 단위*로 가른다(me/identity=재작성 ↔ log/progress=append). 2존은 그걸 *페이지 내부*로 통합하는 패턴. me/* 권위 페이지(특히 identity)나 관계(`relationships/`) 페이지에 "현재 합성 + 증거 trail" 구조로 응용 여지. → §"학습→반영" 참조.

## 3. 기타 학습가치 개념 (대조용, 차용 보류)

- **latent vs deterministic 이분법** — "지능은 latent, 신뢰는 deterministic. 800명 좌석배치를 LLM에 시키면 plausible 한 환각" ≡ Karpathy #1/게이트 철학의 다른 어휘.
- **gap analysis** — 답변 끝에 *brain 이 모르는 것·stale·모순*을 능동 명시(`gbrain think` 의 차별점). ≡ lint/reflect 의 능동 버전.
- **모순감지 정량화** — Wilson 95% CI 로 "도입할지"를 vibes 아닌 evidence 로(CI 하한 <5%=현 스코프 충분 / >15%=큰 수술 착수). ≡ "수렴≠도입" 검증규율의 통계 버전.

## 4. ⚠ 가드 (cold-verify — 수렴≠도입)

- **인프라 대부분은 infra-0 위반** — PGLite·BullMQ(Minions queue)·OAuth 2.1·reranker·cron 데몬·multi-user 스코프는 상용 SaaS 운영용. 로컬 Obsidian 무서버 vault 엔 과잉(Karpathy #2). 흡수 = *개념*이지 코드 아님.
- **guardrail seam = fail-open / observe-only** — gbrain 가드레일은 *관찰만*, 절대 차단·재작성 안 함, 에러나면 통과(fail-open). ⚠ vault ③Gate(**fail-safe**)와 **철학 정반대** — [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md)에서 박제한 "Adversary fail-open vs vault fail-safe 분기"의 또 한 사례.
- **메타발견 정합** — gbrain 의 신규 delta(dream cycle 자동화·모순 정량·합성 측정)도 결국 **측정·자동화축**. hot "반복 미도입 delta = 측정·자동화축" 가설을 또 확증([Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](../methods/loop-engineering.md)·[Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](../methods/gnosis-self-improving-agent.md) 와 같은 수렴점). infra-0 경계 재평가는 6/28 phase2.

## 5. 학습→반영 (학습→반영 루프)

- **#1 (즉시·이 페이지)**: thin-harness-fat-skills → agent-harness §6 외부 ground-truth 1줄 추가(수렴 #N).
- **#2 (backlog·반영처=me/* 페이지)**: compiled-truth+timeline 2존을 identity 또는 관계 페이지에 적용할지 = *작가 결정 대기*. 트리거 = me/* 페이지가 append 누적으로 "state 파악에 전체 통독 필요" 체감 시. 지금 강제 X(현 me/* 는 짧아 2존 불요 — Karpathy #2).
