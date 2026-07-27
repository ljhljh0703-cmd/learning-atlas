---
created: 2026-07-22
updated: 2026-07-22
type: learning
tags: [methods, harness, dispatch, verification, generalization]
source: W29 dual-track 회고 — uzmap-forge memory + Penelope Build Week 회고 2-프로젝트 수렴
---
<!-- 제약을 상류의 구체물로 못 박는 두 default — 늦은 리뷰가 아니라 조기·기계적 증명. W29 회고 승격. -->

# 제약을 상류로 — 계약을 늦은 리뷰가 아니라 조기·구체물로 증명하라

## 왜 이 노트인가 (출처·수렴)

2026-W29 dual-track 회고에서 서로 무관한 두 프로젝트가 **같은 실패/성공 축**으로 수렴했다:

- **uzmap-forge**(레거시 맵 포맷 재구현, Cowork Claude memory) — 일반화 픽스처를 *선정 시점에* 게이트로 걸자 엔진 갭이 즉시 드러났고, 해체원장→컨포먼스 자동생성으로 값 발명을 *기계적으로* 차단했다.
- **Penelope Build Week 회고**(`/tmp` 외부 제출 프로젝트, 별도 산출) — 이식성(2번째 세계)을 최종일에 붙이고 제품 검증을 evidence/safety 뒤로 미룬 것이 최대 지연 요인(`agent_missed_gate`)이었다.

공통 메타: **제약(일반화·무발명·검증)을 "나중에 리뷰로 잡겠다"는 약속으로 두지 말고, 상류에서 구체물(두 번째 인스턴스·기계 원장)로 못 박아라.** 늦게 잡을수록 재작업·압축이 커진다. 두 default 로 증류한다.

---

## Default 1 — 일반화 계약은 *두 번째 구체 인스턴스*로 조기 증명 (PCU-1)

**cause:** "이건 임의의 X를 받는다"는 일반화 주장을 단일 인스턴스로 만들고, 두 번째 인스턴스는 확장으로 미룬다 →
**guard:** 일반화/이식성 주장은 **스케줄 후반부 진입 전에** *같은 런타임을 통과하는* 두 번째 구체 인스턴스로 증명한다. 하나만 돌 때는 "일반적"이라 말하지 않는다 →
**observable:** 두 번째 세계/맵/데이터셋이 첫 것과 **동일 게이트**를 통과한 커밋이 패키징/마감 구간보다 앞선다.

**근거(실측):**
- uzmap — 장르가 다른 제2맵을 게이트 픽스처로 *고르자마자* 사전 프로브만으로 엔진 갭 2건(lexer 개행 관용·산술 암시 승격)이 노출. "다른 어휘를 두드리는 표본" 선정 기준이 *선정 순간에* 밥값을 했다.
- Penelope — 이식성(Oz 팩·창작자 JSON import)이 마지막 날(7/21 16:21) 커밋으로 압축, "임의 창작자 세계 온보딩 용이성"이 가장 약한 증거로 남음. 조기 2-인스턴스였다면 그 주장이 제품과 함께 굳었을 것.

> 과적용 가드(Karpathy #2): 한 세계도 end-to-end로 돌기 전에 계약부터 추상화하지 말 것. **하나를 먼저 굳히고, 그 계약을 두 번째로 *조기* 검증**한다. "추상화 먼저"가 아니라 "두 번째 인스턴스 먼저".

---

## Default 2 — 값 발명은 *원장→컨포먼스 자동생성*으로 기계 차단 (PCU-2)

**cause:** 원작/사양 사실을 사람이 옮겨 적고, 구현·검증이 그 값을 "성실히" 지킬 거라 신뢰한다(약한 구현자일수록 발명 위험↑) →
**guard:** 원작 사실을 기계 추출 **원장(JSON)** 으로 박고, **테스트가 원장을 읽어 케이스를 생성**하게 한다. 원장 갱신 = 테스트 자동 추종 → 구현도 검증도 값을 발명할 수 없다 →
**observable:** 테스트 픽스처가 원장 파일에서 파생됨(하드코딩된 기대값 아님). 원장 한 줄 바꾸면 관련 케이스가 자동 변한다.

**근거(실측):** uzmap — 17종 기계 추출 원장 + 원장을 읽는 컨포먼스 테스트. Sonnet급 약한 구현자에게 위임할 때의 핵심 안전장치. "발명 금지"를 규율(말)이 아니라 데이터 흐름(구조)으로 강제.

> **인접 노트와의 델타**: [파생 원장 규율 (Derived Ledger Discipline)](derived-ledger-discipline.md)("생성기 없는 원장은 SSOT가 아니다")가 *원장의 권위 축*이라면, PCU-2 는 그 **컨포먼스-생성 코롤라리** — 원장을 테스트가 *소비*해 케이스를 파생시키는 메커니즘. 중복 아님, 같은 원리의 검증측 반쪽.

---

## 아직 승격 안 함 (watch — recurrence 미달)

W29 회고에서 관측됐으나 3-인스턴스 임계 전이라 **memory 원본 보존 + 감시**만:

- **plan-diff**: 마스터 플랜류가 병렬 구현 진행을 미반영해 "완료된 웨이브를 다음 작업으로 지시" — uzmap(운용델타) + Penelope 회고 §3.5, **2-프로젝트 독립 관측**. 가드 후보: "계획 문서 작성 시 repo Progress 최신 엔트리와 diff 대조". 3번째 관측 시 승격 검토.
- **claude-codex-handoff (core-first)**: Claude 지시·게이트 / Codex 구현, 정본 코어 확정 전 구현 착수 금지 — eldritch-seoul memory + Penelope(논지-우선) 수렴. memory 자체가 "더 많은 근거 후 vault Claude 게이트, 지금 스킬 생성 X"로 명시. watch 유지.

---

## 연결
- [파생 원장 규율 (Derived Ledger Discipline)](derived-ledger-discipline.md) — PCU-2 의 권위 축 짝(원장 SSOT)
- [레거시 바이너리 포맷 재구현 방법론](legacy-binary-format-reimplementation.md) — uzmap-forge 방법론 정본(PCU-2 의 clean-room·수요주도 커버리지 맥락)
- [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) — "안 열림≠보호맵" = 구체 검증 상류 이동의 동류
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — #2 단순성(과추상 가드) · #4 검증가능 성공기준(원장=기준)
- [Deterministic Core, Fuzzy Edge — 안티슬롭 아키텍처 원칙](deterministic-core-fuzzy-edge.md) — 결정론 코어가 상태 소유 = 제약 상류화의 아키텍처판
- dispatch-builder — 약한 구현자 위임 시 PCU-1·PCU-2 를 done-gate 조립에 참조
