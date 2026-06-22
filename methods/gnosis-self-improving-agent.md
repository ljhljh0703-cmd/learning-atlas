---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [AI, agent-harness, self-improvement, constitution, memory-architecture, ground-truth, measurement]
source: https://www.youtube.com/watch?v=73H_ZCxbH7o
authors: [Gnosis]
year: 2026
category: method
---

# Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)

*NotebookLM 가벼운 브리핑 → ③Gate PASS(자체평가·외부벤치 아님을 발표자가 직접 반복 강조 = 정직). **전 수치는 자체 시뮬레이션 — "주장"으로만 박제, 격상 금지.***

Gnosis 는 "AI 가 LLM 가중치를 바꾸지 않고 외부 기억·스킬·가치 레이어만 갱신해 점진 성장"하는 프레임워크다. **학습 가치의 본체는 새 개념이 아니라 — Sub-brain 이 직접 시행착오로 도달한 구조(헌법·메모리·자가개선 루프·HITL 게이트)를 누군가 독립적으로 *정식화*했다는 외부 확증**이다([The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md)·[goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md)·[opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](../techniques/opencode-agent-harness.md)·[Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)](factory-ai.md)에 이은 #5, 그리고 *가장 강한 수렴* — Gnosis ≈ vault 의 청사진).

---

## 한 줄 요약

> "가중치 불변 + 외부 헌법/메모리/스킬 레이어 + 3중 자가개선 루프 + 정량 하드게이트(CIB)" = Sub-brain 의 설계를 학술/엔지니어링으로 옮긴 것. vault 아키텍처의 수렴 증거 #5(최강).

---

## 확증 매핑 — Gnosis → vault (거의 1:1, 재서술 X)

1. **가중치 불변·외부 레이어 성장** → 북극성(Agent=Model+Harness, 진화하는 AI 운영 토대) 자체. agent-harness.
2. **3중 루프** Inner(초/분·에피소드 평가) / Outer(시간/일·스킬 승강·Fitness Auditor) / Meta(수개월·헌법 재설계) → hermes-loop + 주간 dual-track-review + 헌법 편집(Meta=헌법 손댐). agent-harness-rsi-brief ②Apply.
3. **Meta Loop 헌법변경 = HITL 없인 절대 실행 X** → **R-01 HITL 스테이징**(CLAUDE.md — AI 자체 헌법 merge 금지). *동일 안전철학.*
4. **5계층 메모리** L1 일화·L2 의미·L3 절차/스킬·L4 가치/헌법·L5 정체성 → wiki 구조: experiences/ · learnings/ · skills/ · CLAUDE.md 헌법 · me/identity. *같은 분리.*
5. **선택적 주입**("관련된 것만·압축 통찰 먼저") → RTK + Progressive Disclosure + "주입 표면" 원칙([goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) MOIM 계열).
6. **CIB 하드게이트**(헌법 점수 0.95 미만이면 학습 차단) → ③Gate + HITL 스테이징(헌법 미통과 산출 흡수 X). *정성↔정량 차이만, 철학 동일.*
7. **헌법 = 절대/원칙/전략 3층 YAML** → CLAUDE.md(북극성 / 🔒 LOCKED / 컨벤션) 3층 등가.
8. **인간 역할 = 교사·코치·헌법 수호자**(결제자 X) → 작가 = "관리자, LLM은 기록자" + HITL + design-journal 큐레이션.
9. **FedPer**(조직 Base 공유 / 개인 Delta 로컬 유지) → 3-AI 분업의 Base(헌법 공유)/Delta(에이전트별 특화) 분리 렌즈.

---

## 진짜 새것 (vault delta — 측정축 1개)

> vault 최약체 스탯 **측정·평가**를 정확히 찌르는 단 하나의 신규 축. 단 *지도이지 도입 대상 아님*(아래 반영 참조).

1. **정량 자가평가 게이트** — vault 게이트는 전부 정성적(pass/fail·`review_trigger`)인데 Gnosis 는 수치 임계:
   - **Coherence Index(CI)** = 시스템 일관성 측정 지표(0~1).
   - **CIB(Constitutional Invariant Boundary)**: 학습 시 헌법 점수가 *단 한 시나리오라도* 0.95 미만 → 학습 차단(hard gate).
   - **Growth Rate Regulator**(의료 모니터링 비유): Fitness 가 7일 내 +0.2 이상 급등하거나 하락 → 사람 경보 + 즉시 CIB 호출("과속 성장"·오류 차단).
   - **Stagnation**: 30일간 CI 변화 <0.02 → 정체 판단 → 사람에게 알리고 커리큘럼 재설계.
   - 1,000 에피소드 도달 → Meta Loop(헌법 자체 재설계, HITL 필수) 발동.
2. **Ablation 확증재** — CIB 제거 시 헌법 준수율 98.7%→71.3%(자체 시뮬). = 우리 하드게이트(③Gate/HITL)가 *왜 필요한지*의 외부 정량 근거(단 자체평가 caveat).

---

## 한계·미검증 (격상 금지 — 발표자 직접 인정)

- **전 수치 = 자체 시뮬레이션**(9.97점·98.7%·86% 토큰절감[타 연구 인용]) — 외부 제3자 벤치 X. 발표자 반복 강조. 비용절감=자체 추정.
- **L3**: 수렴성 수학증명이 L-smooth·강볼록 *강한 가정* 위 — 실제 LLM 환경 완전 작동 검증 부족.
- **L1**: 헌법(테스트 시나리오) 작성 비용·도메인 전문성 필요. **L2**: Outer Loop N(배치) 수동 튜닝. **L4**: 1년 장기 외부 검증 부족.
- → Gnosis 는 *벤치 증거*가 아니라 *설계 수렴 증거*로만 취급.

---

## 반영 (학습→반영 루프)

- ✅ **확증분(매핑 9축)** = 이미 vault 보유 → 흡수만, 재서술 X(#3). 의미 = 북극성 정당화 강화(독립 수렴 #5, 최강).
- ✅ **측정축 도입 = X 확정 (NotebookLM 검증 외주, 2026-06-17 — grounded)**: 작가 직감("엉터리 같은데") + 검증 명세서 → **종합 판정 "지금 도입 가치 없음"**. 근거 = 정량 레이어 온전 도입 시 ChromaDB/SQLite/NetworkX/APScheduler 필수 → infra-0 완전 파괴인데, **정성 ③Gate + review_trigger 만으로 동일 안전철학(단절 방지·정체성 유지) 충분 근사**. 내 사전 추정("지도이지 도입 아님")을 *데이터로 확정*.
  - **메커니즘별 판정**: B2 CI·B5 3중루프·B6 FedPer = **기각**(metrics 인프라 / 이질 AI Base 상이로 무의미) · B3 성장률 레귤레이터 = **지도보관**(개념만) · **B1 CIB·B4 Stagnation = 개념만 근사**(수동 ③Gate / 월 review_trigger 강화 — 수치 임계 X) · B7 5계층 라벨링 = **저가치**(마크다운 YAML 라벨 가능하나 의미론적 자동주입 불가 = 라벨만 남음).
  - **→ agent-harness-rsi-brief §6 정량게이트 각주 backlog = 닫음**(검증이 "도입 가치 없음"으로 답). brief 미터치.
- 🚩 **red-flag (검증 추가)**: MadCat = "사내 11부서 운영" 주장 외 소스/아키텍처 미공개 → 제3자 확인 불가 *단일벤더 편향*. 전 수치(9.97·98.7%·86%) = 내부 시뮬 자가평가 — 발표자 직접 "외부 제3자 검증 아님" 인정. **수치 흡수 X**(R-04 환각 고착 차단), caveat 으로만.
- 🧭 **측정축 재프레이밍 ([Nadella 2026-06-15 차용](loop-engineering.md))**: Gnosis 의 *무거운 정량 인프라*(CIB·Coherence Index DB) 말고, 측정 공백의 *가벼운* 대안 = **"private evals — 외부 벤치가 아니라 *작가가 신경 쓰는 outcome 몇 개*를 추적"**. Gnosis 자체평가가 깐 것은 "자체평가를 *보편 효과로 주장*"한 것이지 private eval 자체가 아님(Nadella: 외부 벤치가 오히려 틀린 타깃). → infra-0 에 맞는 측정 방향 후보, **6/28 phase2 입력**(hot.md SCHEDULED CHECKS).

---

## 다음 학습 후보

- **Piaget 조절(accommodation) vs 동화(assimilation)** — Gnosis 가 "성장=기존 이해의 재구조화(조절)"로 프레이밍. 우리 "학습→반영 루프"가 *동화*(노트 추가)에 그치지 않고 *조절*(기존 SSOT 재구조화)까지 가는지 자기점검 렌즈.
- **연합학습(FedPer) Base/Delta** — 멀티-AI(Claude/Gemini/Codex) 지식 공유를 Base(헌법)/Delta(에이전트 특화) 로 분리하는 설계 깊이 팔 때.

---

## 연결된 페이지

- [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) · [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) · [opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](../techniques/opencode-agent-harness.md) · [Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)](factory-ai.md) · agent-harness (Agent=Model+Harness 수렴 ground-truth 군 — Gnosis=#5 최강)
- hermes-loop (3중 루프 = Dispatch~Curate) · agent-harness-rsi-brief (②Apply·Meta Loop) · dual-track-review (Outer Loop=주간 회고)
- CLAUDE.md (헌법 3층·R-01 HITL 스테이징 = Meta Loop HITL) · [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (#2 측정축 도입 자제)
