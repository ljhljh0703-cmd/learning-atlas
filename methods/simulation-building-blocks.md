---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [simulation, building-blocks, checklist, ssot, turn-loop, world-engine, save-load, methodology]
category: method
---

> ✅ **confirmed** (2026-06-17, 작가 "필요한 것들 모아보게" → "B r" → "B로 다 빨아먹어") — 작가 시뮬레이션 프로젝트의 *출발 체크리스트*. **시드 2건**: [Singulari-Tea Codex — LLM 서사 시뮬레이션 아키텍처 사례](../techniques/singulari-tea-codex.md)(LLM 프롬프트형) + [Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md)(코드 기반 에이전트 사회형). 확장형(추가 sim 레퍼런스 흡수 시 보강). 전건 정설 아님.

# 시뮬레이션 구축 Building Blocks (체크리스트)

**코어 8요소**(1~8, 거의 모든 시뮬 공통) + **사회 규모 5요소**(9~13, 에이전트 사회/멀티에이전트 시뮬 한정). 코드/RL 시뮬(mirofish-lab)에도 1·2·3·5·7은 공통, 4·6은 표현 레이어 특화.

> **시드 대비**: [Singulari-Tea Codex — LLM 서사 시뮬레이션 아키텍처 사례](../techniques/singulari-tea-codex.md)=LLM이 다 함(프롬프트형, 결정론 약함) ↔ [Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md)=메커니즘은 코드·LLM은 추론만(권장형). **결정론을 코드로 빼는 게 핵심 갈림**(블록 3).

## 1. 단일 상태 객체 = SSOT 🔒 1순위
- 시뮬 전체 상태를 담는 *하나의* 구조(JSON / DB). 모든 모듈이 read/write 하는 유일 진실원천.
- 구획: 주체(주인공/에이전트)·세계·발견/지식·히스토리·상태 스냅샷·플래그.
- = 작가 SSOT 철학·[GBrain — 개인 AI 지식 브레인 production 정본](../techniques/gbrain.md) compiled-truth. **이게 없으면 상태가 흩어져 일관성 붕괴.**
- 규모 커지면 *다층 인지 스택*으로 분화([Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md) 6층): 영속 정체성 앵커(Soul, 절대 요약X) → 장기기억 → 요약(배치) → 다이어리 → 대화이력 → 관계그래프. Soul=불변앵커가 작가 me/identity 와 동형.

## 2. 결정론적 턴 루프 (고정 순서)
- 한 턴의 처리 순서를 *고정*: intent 파싱 → 세계상태 갱신 → 데이터→표현 → 서사/결과 → 선택/행동지 → 렌더.
- 순서가 흔들리면 상태/출력 손상. 오케스트레이터 1개가 흐름 통제(Singulari E0).

## 3. 세계 규칙 엔진 (매 턴 실행, 결정론 지향)
- 도메인 규칙을 독립 엔진으로: 능력/스킬 게이팅 · 건강/컨디션 · 물리(날씨·열역학·시간) · 시간경과(노화·상태변화).
- **핵심 교훈**: 이 부분은 *코드/결정론*으로 빼라 — LLM 에 맡기면([Singulari-Tea Codex — LLM 서사 시뮬레이션 아키텍처 사례](../techniques/singulari-tea-codex.md) 의 실수) Context Pollution 으로 깨진다([GBrain — 개인 AI 지식 브레인 production 정본](../techniques/gbrain.md) latent/deterministic). **모범 = [Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md)**: needs·경제·투표·위치·쿨다운 전부 Python, LLM 은 추론·툴선택만.

## 4. 데이터↔표현 분리 (LLM 시뮬 특화)
- 수치/구조 상태(결정론) ↔ 서술/프레젠테이션(LLM 생성) 을 별 단계로.
- 숫자는 엔진이, 묘사는 서사 모듈이. 섞으면 둘 다 망가짐.

## 5. 게이팅 / 제약 필터
- 자유도 ≠ 무제한. 스킬 부족 시 행동 실패·자격/언어/자원으로 가능행동 제한.
- 출력 = Boolean 또는 가능행동 집합. 제약이 시뮬에 *무게*를 줌.

## 6. 구조 고정·내용 유동 템플릿 (출력 계약)
- 출력 구조(HUD·선택지 N블록·포맷)는 FIXED, 내용은 FLUID.
- 예: 선택지 정확히 N개, 고정 마크업, 상태판 항목 고정. = 작가 UI 계약·출력 규율.

## 7. 영속성 (세이브/로드)
- 상태 스냅샷 직렬화(활성 플래그 *전부* 포함 — 누락=치명) + 히스토리 append + 로드 시 마지막 장면/상태 재구성("resurrection").
- = 작가 Dual-Track(progress append)·[Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](../techniques/ralph.md) 외부 메모리(git/progress/state).

## 8. 가시화 (상태판 HUD)
- 핵심 상태를 매 턴 사용자에게 노출(체력·환경·위치·진행도 등). 시뮬이 *돌아가고 있음*을 보여줌.

---

## 사회 규모 블록 (9~13) — 멀티에이전트/에이전트 사회 시뮬 한정
시드 = [Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md). 단일 주인공 시뮬엔 불필요(Karpathy #2).

## 9. Tools-as-only-interface 🌟
- 에이전트는 *툴 콜로만* 세계에 영향(이동·말·투표·거래·공격 전부 툴). → 전 행동 observable·measurable·replayable. 툴은 위치/권한/쿨다운 게이팅.
- = 블록 5(게이팅)의 극단. 관측가능성·재현성의 토대 — 측정(블록 13)의 전제.

## 10. Needs 시스템 (감쇠 압력)
- 핵심 자원(에너지·지식·영향력 등)을 시간당 감쇠시켜 *행동 압력* 생성. 임계 도달 시 패널티/사망.
- **감쇠가 동기를 만든다** — 가만히 있으면 손해라야 에이전트가 움직임. 단일 주인공 시뮬에도 응용가(생존 압력).

## 11. 다층 인지 + 정체성 앵커
- 블록 1의 사회 규모판: Soul(영속 신념, 절대 요약X) + 장기기억 + 요약 + 다이어리 + 관계그래프(신뢰·감정톤). 장기(15일+) 일관성·정체성 유지의 핵심.

## 12. 창발 사회 시스템 (경제·거버넌스·관계)
- **경제**: 동료심사로 획득하는 자원(evidence 필수=날조 차단), 소비·거래·절도 → 진짜 이해관계. **거버넌스**: 살아있는 규칙(헌법)+투표(임계%)+집행, 강제 권위 없이 *쓸지 말지가 창발*. **반응형 상호작용**: overhearing 반경 → 비스크립트 다자 대화.
- 핵심: *규칙 틀만 주고 결과는 안 정함*("No scripts, no fixed outcomes").

## 13. 측정 (열린 사회 점수판)
- 고립 벤치 대신 *다차원 부분 점수판*([Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md) AWI 9종: 인구·치안·탐험·거버넌스순응·표현·사회망·경제 Gini·헌법성장).
- **모델 발산 측정**: 환경 고정·*모델만 교체*해 행동 차이 관찰 = 작가 agent-harness-rsi-brief ②Apply 매트릭스의 사회 규모판.

---

## 적용 가드
- **종 구분**: LLM 서사 시뮬([Singulari-Tea Codex — LLM 서사 시뮬레이션 아키텍처 사례](../techniques/singulari-tea-codex.md)) vs 코드/RL·에이전트 사회 시뮬([Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](../techniques/emergence-world.md)·mirofish-lab) — 코어 1·2·3·5·7 공통, 결정론 처리 방식이 갈림(프롬프트 X→코드 O). 사회 규모 블록 9~13은 멀티에이전트 한정.
- **과적용 금지**(Karpathy #2): 작은/단일주인공 시뮬에 13요소 다 X. 1(SSOT)·2(턴 루프)는 필수, 나머지는 규모 따라. 사회 블록은 다중 에이전트일 때만.
- **확장 트리거**: 추가 sim 레퍼런스(RL 환경·경제 sim·물리 엔진 등) 흡수 시 보강. **현재 시드 2건**(프롬프트형+코드형). RL/물리 시드는 아직 — 흡수 시 블록 3·9 강화 예상.
- **구현 인스턴스**: [MiroFish + OASIS — 거대 시뮬레이션 세계 reference architecture](../techniques/mirofish-oasis.md) §2.3 = 소셜미디어 멀티에이전트 시뮬(OASIS)이 블록 1·2·3·4·9·11·13 에 1:1 매핑된 실측 사례. 한국화 응용 = mirofish-korean-sim-blueprint.
