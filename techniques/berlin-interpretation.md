---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [game-design, roguelike, genre-definition, planning, libgdx-rogue-os]
source:
  - https://www.roguebasin.com/index.php?title=Berlin_Interpretation
authors: [International Roguelike Development Conference (IRDC) 2008, RogueBasin Community]
year: 2008
category: technique
---

<!-- 로그라이크 장르 정의 표준 문서 'Berlin Interpretation' 학습 노트 — libgdx-rogue-os 기획 정체성 근거 -->

# Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준

*International Roguelike Development Conference (IRDC) 2008 / RogueBasin 커뮤니티 문서*

2008년 베를린에서 열린 제1회 IRDC 참가자들의 합의로 정리된 로그라이크 장르 정의 프레임. 단일 저자의 논문이 아니라 *커뮤니티 합의 문서*이며, "무엇이 로그라이크인가"를 판단하는 분석 격자로 널리 인용된다.

---

## 한 줄 요약

> 로그라이크다움(roguelikeness)을 절대 규칙이 아니라 **high value / low value factor 가중치 합**으로 보는 장르 유사도 측정 프레임 — 어떤 작품이 전통 로그라이크에 얼마나 가까운지를 비교·서술하게 해준다.

---

## 핵심 개념

### 1. High value factors (장르 정체성의 무게중심)
- **Random environment generation** — 매 판 절차적 생성, 재플레이성의 핵심
- **Permadeath** — 영구사. 세이브-스컴 차단, 판당 의사결정의 영속적 비대칭
- **Turn-based** — 시간이 아니라 턴 단위. 사고할 시간 보장
- **Grid-based** — 격자 위 이동/전투
- **Non-modal** — 모든 행동이 같은 화면/같은 모드에서 (별도 전투화면 전환 없음)
- **Complexity / resource management / hack'n'slash / exploration & discovery**

### 2. Low value factors (있으면 더 로그라이크답지만 필수 아님)
- 단일 플레이어 캐릭터, 몬스터도 플레이어와 같은 규칙, 전술적 도전, ASCII 디스플레이, 던전, 숫자로 드러나는 상태값 등

### 3. 측정 프레임으로서의 성격
- 각 factor 충족 여부로 "이 게임이 얼마나 로그라이크인가"를 *서술*한다. Berlin Interpretation 자체가 "이건 로그라이크 아님"을 선언하는 심판이 아니라 **비교 어휘**다. (현대 로그라이트 논쟁의 출발점)

---

## 기술 스택 / 사용법

해당 없음 — 정의 프레임. 기획·포트폴리오 서술에서 *장르 좌표*로 사용.

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: 해당 없음 (게임 AI blueprint 가 아니라 장르 기획 프레임)
- **적용 가치**: 개념 수확 + 기획 근거 (코드 아님)
- **시급성**: 장기 (포트폴리오·기획서 서두)

### 직접적 연결: 중간 (기획 정체성 앵커)
libgdx-rogue-os 는 Grid-based · Turn-based · Permadeath · Non-modal 을 *전부* 충족하는 구조다. Berlin Interpretation 의 high value factor 와 프로젝트 시스템을 1:1 대응시키면 "이 작품은 변형 로그라이트가 아니라 **Pure Roguelike 계보**"라는 주장을 *객관적 어휘*로 뒷받침할 수 있다.

### 개념적 수확
- **Permadeath = 자원 관리의 영속적 비대칭**: 영구사는 단순 하드코어 옵션이 아니라, 매 판 의사결정에 되돌릴 수 없는 무게를 주는 *기획 아키텍처*. → 전투·자원 설계의 긴장 근거.
- **Non-modal 원칙**: 전투/탐험을 같은 격자·같은 모드에서 처리한다는 제약은 곧 [헤드리스 검증](../methods/automated-playtesting-shooterbot.md)·[공유 distance field](dijkstra-maps.md) 와 잘 맞는다 (별도 전투 씬 분리가 없으니 모델이 단일).

### 주의 (억지 인용 금지)
- Berlin Interpretation 은 *커뮤니티 합의 문서*지 피어리뷰 학술이 아니다. 포트폴리오에서 "학술적 정의"로 포장하지 말 것. 학술 강도가 필요하면 아래 *다음 학습 후보* 의 Game Studies 논문으로 보강.

---

## 열린 질문

- "Non-modal" 을 엄격히 지키면서 풍부한 NPC 대화([Fixed-Persona SLM](slm-dynamic-content-generation.md))를 넣을 때, 대화 UI 가 modal 로 흘러가는 경계는 어디인가?
- Permadeath 와 메타 진행(meta-progression)을 얼마나 섞으면 "로그라이트"로 미끄러지는가 — 프로젝트의 의도 좌표는?

---

## 다음 학습 후보

- **Cartlidge, "Genre, Prototype Theory and the Berlin Interpretation of Roguelikes"** (Game Studies 24(3), 2024) — Berlin Interpretation 을 프로토타입 이론으로 재해석한 *피어리뷰* 논문. 학술 보강용 1순위.
- **John Harris, *Exploring Roguelike Games*** (CRC Press, 2021) Ch.9 — Berlin Interpretation 챕터, 역사적 맥락.
- [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](unpredictability-of-gameplay.md) — 로그라이크의 무작위성을 디자인 변수로 분해.

---

## 연결된 페이지

- libgdx-rogue-os — 본 프레임을 기획 정체성 근거로 사용하는 프로젝트
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) — Grid-based·Non-modal 과 정합하는 적 AI
- [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](unpredictability-of-gameplay.md) — Permadeath·random generation 의 디자인 이론적 짝
