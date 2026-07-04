---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [game-ai, roguelike, fov, line-of-sight, shadowcasting, grid, libgdx-rogue-os]
source:
  - https://www.roguebasin.com/index.php/FOV_using_recursive_shadowcasting
  - https://www.roguebasin.com/index.php/Comparative_study_of_field_of_view_algorithms_for_2D_grid_based_worlds
authors: [Björn Bergström, Jice]
year: 2001
category: technique
---

<!-- 격자 FOV(recursive shadowcasting) 학습 노트 — libgdx-rogue-os 시야/안개/적 인지 -->

# Recursive Shadowcasting — 격자 로그라이크 FOV 의 표준

*Björn Bergström, "FOV using recursive shadowcasting" (RogueBasin, 2001) · Jice 비교연구(2009)*

시야를 8개 octant 로 나누고 각 octant 를 row/column 단위로 훑으며, 벽이 만든 그림자(shadow) 영역을 재귀적으로 건너뛰어 *중복 방문 없이* 보이는 셀을 계산하는 격자 FOV 알고리즘. 로그라이크에서 "가장 널리 쓰이는 공개 FOV".

---

## 한 줄 요약

> raycasting 이 반경 가장자리 모든 셀로 선을 쏴 시작점 근처를 여러 번 방문하는 낭비를, **8 octant + shadow 영역 재귀 제외**로 바꿔 셀당 1회 방문에 가깝게 만든 시야 계산법.

---

## 핵심 개념

### 1. 8 Octant 분할
- 원형 시야를 대칭 8조각으로 나눠 한 octant 만 구현하고 좌표 변환으로 나머지에 재사용.

### 2. Shadow 재귀 스캔
- octant 를 가까운 row/column 부터 스캔. blocking cell(벽)을 만나면 그 뒤 shadow 영역을 `slope = (x1 - x2) / (y1 - y2)` 로 계산해 가리고, 필요 시 한 칸 바깥에서 새 scan 을 **재귀** 시작.

### 3. 비대칭성(asymmetry) — *가장 중요한 함정*
- Bergström 원본은 **symmetry 를 보장하지 않는다**. 즉 A 에서 B 가 보여도 B 에서 A 가 안 보일 수 있다. 원거리 전투/은신에서 *공정성 문제*로 직결.

---

## 비교 근거 (Jice 비교연구)

같은 맵/시점에서 raycasting·diamond·shadowcasting·permissive(0~8)·digital FOV 를 gameplay·symmetry·performance 로 비교. 핵심 수치(원문 기준, RogueBasin):

| 알고리즘 | symmetry error (indoor/outdoor) | 비고 |
|---|---|---|
| SHADOW | 0.93% / 6.9% | indoor 가장 빠름, overall 추천 |
| PERMISSIVE 0 | 2.14% / 10.95% | permissiveness 낮을수록 symmetry ↓ |
| PERMISSIVE 8 | 0% / 0% | precise permissive 와 동등 |
| DIGITAL | 0% / 0% | 완전 대칭이나 느림 |

- 성능 예시: indoor 80×80 에서 SHADOW 38µs vs DIGITAL 440µs. *일반 가시범위 20×20~40×40 에선 DIGITAL 제외 대부분 충분히 빠름.*
> ⚠️ 위 수치는 RogueBasin 비교연구 페이지 기재값(2026-06-07 fetcher 403 으로 재추출 불가, 글·저자·내용은 실재 확인). 인용 시 "RogueBasin 기준" 명시.

---

## 기술 스택 / 사용법

```java
// 턴 시작/이동 직후 1회
boolean[][] visible  = new boolean[H][W]; // 이번 턴 가시
boolean[][] explored = new boolean[H][W]; // 누적 탐험(안개)
// 8 octant 재귀 스캔 → visible 채우고 explored |= visible
```

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: 시야/인지 + 렌더 양쪽
- **적용 가치**: **직접 적용** (즉시 코드)
- **시급성**: **지금** (로그라이크 근본 — 없으면 안개·적 인지 자체가 불가)

### 직접적 연결: 높음 (두 시스템을 동시에 먹임)
FOV 출력 `visible[][]` 이 ① **렌더(안개/explored)** 와 ② **적 인지**(적이 플레이어를 *보는가* → 그때만 [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) 추적 활성)를 동시에 구동한다. 즉 FOV 가 적 AI 의 *트리거 게이트*다.

### ⚠️ 처참한 실패 시나리오 (비대칭성)
- Bergström FOV 는 비대칭 → **"적이 날 쏘는데 난 그 적이 안 보임"** 불공정 발생. 원거리/은신 비중이 크면 치명적.
- **처방**: ① 시야와 *공격 판정*을 분리해 ranged 엔 별도 LOS 대칭 검사를 붙이거나, ② symmetric shadowcasting(아래 후보)으로 교체. [헤드리스 validator](../methods/automated-playtesting-shooterbot.md) 에 *"A 가 B 를 보면 B 도 A 를 본다"* 회귀 테스트를 둘 것.

### 개념적 수확
- FOV 는 맵 상태의 순수 함수 → [결정론](unpredictability-of-gameplay.md) 정합. 같은 맵·같은 위치 = 같은 시야 → 검증 재현 가능.

---

## 열린 질문

- 모바일 소형/중형 던전(우리 규모)에서 매 이동마다 FOV 재계산 비용이 턴 지연으로 체감되는 맵 크기 임계는?
- ranged 전투 공정성에 symmetric shadowcasting 전환이 *필수*인가, LOS 보정으로 충분한가 — 게임 디자인 의존.

---

## 다음 학습 후보

- **Symmetric Shadowcasting** (Albert Ford, albertford.com) — 대칭 보장 현대판. ranged 공정성 해결 1순위.
- **"New Algorithms for Computing FOV over 2D Grids"** (arXiv:2101.11002) — 학술 정리.
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) — FOV 가 게이트하는 적 추적 AI

---

## 연결된 페이지

- libgdx-rogue-os — 시야/안개/적 인지 직접 적용
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) — FOV 가 트리거하는 적 이동
- [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](../methods/automated-playtesting-shooterbot.md) — symmetry 회귀 검증
- [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](unpredictability-of-gameplay.md) — 결정론적 시야
