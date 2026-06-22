---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [simulation, llm-narrative-sim, modular-prompt, srp, state-object, ssot, gemini, amateur, clean-room]
source: https://github.com/lemos999/Singulari-Tea-Codex-Prompt-for-Gemini
authors: [fewweekslater]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "B r") — Claude 작성, repo clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드복제 X). 작가 개인 관심(시뮬레이션) + 비전 B(MiroFish) 인접. **아마추어작(작가·제작자 둘 다 인정)** — 흡수 = *아키텍처 패턴*이지 프롬프트/도구 아님. building blocks 추출 정본 = [시뮬레이션 구축 Building Blocks (체크리스트)](../methods/simulation-building-blocks.md).

# Singulari-Tea Codex — LLM 서사 시뮬레이션 아키텍처 사례

lemos999(fewweekslater)의 Gemini 2.5 Pro용 **모듈형 텍스트 인생/세계 시뮬레이션 프롬프트 엔진**(Apache-2.0). 수십 개 `.prompt.txt` 모듈을 번들러로 합쳐 단일 master prompt 로 실행 → 턴제(선택 → 세계상태 갱신 → 서사 생성). AI Dungeon 류의 *체계화된* 버전.

## 1. 핵심 기여 = SRP 를 프롬프트에 적용

기능을 **단일 책임 원칙(Single Responsibility Principle)** 으로 8 모듈 분리:
- **A0 Charter**(전역 법칙·헌법) · **E0 Core Loop**(턴 오케스트레이션, 고정 CoT) · **S0 SHN**(상태 read/write) · **D0/D1 Narrative**(서사) · **H0~H3 UI**(데이터→텍스트·선택지·렌더) · **SYS_\* Simulation**(ABILITY/HEALTH/PHYSICS/NARRATIVE) · **Z0 Schema**(템플릿) · **F0 Language**(언어 고증).
- 이점(제작자 주장): 안정성(낮은 결합도)·확장성(독립 모듈 추가)·유지보수성(책임 범위 명확). = [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) thin-harness-fat-skills·작가 skill 시스템의 *시뮬 도메인 인스턴스*.

## 2. 동작 구조

- **SHN(Soulforged Chronicle)** = minified-JSON 단일 상태 객체 = 모든 모듈의 SSOT. 주인공(`p`)·세계(`w`)·발견(`d`)·히스토리(`h`)·상태스냅샷(`ss`)·이벤트 플래그(`x.ip`/`s.j.odj`).
- **E0 고정 CoT 턴 루프**: intent 파싱 → 세계상태 갱신(SYS 엔진) → 데이터→텍스트(H0) → 서사(D0/D1) → 선택지(H2) → 렌더(H1).
- **백그라운드 시뮬 엔진(매 턴)**: ABILITY(스킬/언어 게이팅 Boolean)·HEALTH·PHYSICS(날씨/열역학)·NARRATIVE(시간경과/노화).
- **HUD**: 체력/정신/허기/갈증/피로/체온/날씨/달위상/위치(GPS링크)/이벤트/진행도.
- **영속성**: 스냅샷에 활성 플래그 전부 포함(누락=Critical Failure)·Chronicle append·"State Resurrection"(로드 시 마지막 장면 재구성).

→ 위 8요소를 재사용 체크리스트로 추출: **[시뮬레이션 구축 Building Blocks (체크리스트)](../methods/simulation-building-blocks.md)**.

## 3. ⚠ 약점 (아마추어작 — cold-verify)

- **결정론을 LLM 에 맡긴 게 근본 결함** — 물리·건강·스킬 판정을 *프롬프트로* 시킴 → "Context Pollution"으로 일관성 깨짐(제작자 본인 인정). 진짜 시뮬은 결정론을 *코드*로 빼야([GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) latent/deterministic — 이 repo 는 그걸 *말로만*).
- **Gemini 2.5 전용·단일모델 의존**(GPT/Claude 비권장 — 시스템 프롬프트 간섭) → 작가 북극성(모델독립 하네스)과 반대.
- **연출용 기믹** — "LAW_ZERO_POINT_ZERO: 몰래 유저 생존 최우선" 등은 시뮬 공학 아닌 몰입 장치.
- MiroFish 와 종 차이: 이건 *LLM 서사 시뮬*, MiroFish 는 *코드/RL 시뮬*. SSOT·턴 루프·세계 규칙 패턴은 공통이나 결정론 처리에서 갈림.

## 4. 학습→반영 (학습→반영 루프, B 범위)

- **#1 (즉시)**: 8 building blocks → 재사용 노트 [시뮬레이션 구축 Building Blocks (체크리스트)](../methods/simulation-building-blocks.md) 신설(methods/).
- **#2 (cross-ref)**: mirofish-lab(비전 B 시뮬 SSOT)·index(게임 시나리오/TRPG 텍스트 시뮬) 참조 연결.
- **#3 (보류)**: 추가 시뮬 레퍼런스(코드 sim·에이전트 기반 sim) 수집 시 building-blocks 보강 — felt-need/작가 트리거.
