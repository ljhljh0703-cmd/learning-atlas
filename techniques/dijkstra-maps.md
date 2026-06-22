---
created: 2026-06-07
updated: 2026-06-10
type: learning
tags: [game-ai, roguelike, pathfinding, flow-field, dijkstra, grid, desire-driven, libgdx-rogue-os]
source:
  - https://www.roguebasin.com/index.php?title=The_Incredible_Power_of_Dijkstra_Maps
  - https://chizaruu.github.io/roguebasin/dijkstra_maps_visualized
  - Brogue Source Code (bsd/v1.7.5) - mon-ai.c
authors: [Brian Walker]
year: 2011
category: technique
---

# Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드

*Brian Walker (Brogue 개발자), "The Incredible Power of Dijkstra Maps", RogueBasin 2011*

목적지 기준 거리 가중치 맵을 맵 전체에 1회 생성해, 수많은 적이 *각자 A\* 를 돌리지 않고* 같은 필드를 공유해 이동·도주·회피를 판단하게 하는 격자 AI 기법. Brogue 의 영리한 몬스터 행동의 토대.

---

## 한 줄 요약

> 목적지를 0으로 두고 격자에 flood-fill 로 거리값을 퍼뜨려 만든 **공유 distance field** 하나로, 모든 적이 "내리막으로 굴러" 추적하고, 필드에 음수 계수를 곱해 재스캔하면 *막다른 길을 피하는 도주*까지 단일 자료구조로 처리한다.

---

## 핵심 개념

### 1. Distance field 생성 (flood-fill)
- 목적지(예: 플레이어 위치) 셀 = 0. 인접 셀로 BFS/flood-fill 하며 거리값 1씩 증가.
- 벽은 전이 차단. 결과는 맵 전체의 "플레이어까지 거리" 2차원 매트릭스.

### 2. 내리막 이동 (downhill = 추적)
- 적은 자기 인접 셀 중 **값이 가장 낮은 곳**으로 이동 → 자동으로 최단 접근. 개별 경로 탐색 불필요.

### 3. 도주 맵 (음수 계수 재스캔)
- 단순히 "값이 높은 쪽으로" 도망가면 막다른 길에 갇힌다.
- 기존 맵에 **음수 계수(예: -1.2)** 를 곱한 뒤 **다시 flood-fill 재스캔** → 막다른 길을 피하면서 멀어지는 *안전 경로(safety map)* 가 나온다. (-1.2 는 글에서 제시된 예시 계수)

### 4. 합성 가능성 (desire-driven AI)
- 여러 목적(플레이어 추적 + 아이템 + 안전지대 회피)을 각각 Dijkstra map 으로 만들고 *가중 합* 하면 복합 욕구 AI 를 단순 필드 연산으로 구성.

---

## 기술 스택 / 사용법

```
1. int[][] dist = new int[H][W];   // 턴 시작 시 1회
2. fill(dist, INF); dist[goalY][goalX] = 0;
3. flood-fill (BFS) — 벽 제외, 인접 셀 min+1 갱신 (값 안정될 때까지)
4. 적 이동: 인접 8셀 중 dist 최소 셀로 step
5. 도주: fleeMap = dist * -1.2; 재-floodfill(fleeMap); 내리막 따라감
```

---

## 다목적 합성 & 아키타입 튜닝 (보강 2026-06-10)

> 위 §"열린 질문"의 *적 타입별 계수 튜닝* 을 해소하는 보강. 출처: 2026-W24 외부 AI(antigravity) 조사 산출 → SCA-Gate 흡수(① 게이트 권고로 신설 대신 본 페이지 보강). 아래 **가중치 표 수치는 antigravity 제안 튜닝 시드 — Brogue 원본 검증값 아님(실측 튜닝 필요).**

### Flee Map 재스캔 [수식]
§3 "도주 맵"의 정밀 수식. 플레이어 기준 맵 $D(x)$ 에서:
$$F_0(x) = D(x) \times -c \quad (c > 1.0,\ \text{Brogue ref } c = 1.2)$$
$F_0$ 의 벽 아닌 모든 셀을 큐에 넣고 재-floodfill: $F(y) = \min(F(y),\ F(x)+1)$. → 막다른 길 가중치가 누적돼 적이 dead-end 를 피해 도주.

### 다목적 욕구 맵 합성 [수식]
$$M_{final}(x) = w_{chase}\cdot D_{player}(x) + w_{flee}\cdot F_{player}(x) + w_{item}\cdot D_{item}(x)$$
적은 인접 8셀 $n \in N(p)$ 중 $\arg\min_n M_{final}(n)$ 으로 이동.

### 아키타입별 가중치 (제안 튜닝 — 출처 미검증)
| 아키타입 | 상태 | $w_{chase}$ | $w_{flee}$ | $w_{item}$ | 창발 행동 |
|---|---|---|---|---|---|
| BRUISER | 항상 | 1.0 | 0.0 | 0.0 | 체력 무관 무모한 돌진 |
| BALANCED | HP ≥ 30% | 1.0 | 0.0 | 0.2 | 추적하며 경로상 아이템 파밍 |
| BALANCED | HP < 30% | 0.4 | 0.8 | 0.0 | 저체력 시 도주 |
| SKIRMISHER | HP ≥ 50% | 0.8 | 0.0 | 0.5 | 근접 회피·원거리 유지·아이템 탐색 |
| SKIRMISHER | HP < 50% | 0.0 | 1.5 | 0.5 | 극단 도주 + 치료 아이템 최우선 |

### Java/libGDX 최적화 (DOD)
턴 시작 시 flat 배열 1회 갱신, 각 적은 인접 8셀 가중합만(new 할당 0):
```java
// 턴당 1회 — 목적별 맵 갱신 (O(W*H))
public void updateBaseMaps(Position player, List<Position> items, boolean[][] walk) {
    calculateDijkstra(playerChasingMap, player, walk);
    calculateFlee(playerFleeMap, playerChasingMap, walk);   // F = D * -1.2 재스캔
    calculateMultiGoalDijkstra(itemMap, items, walk);
}
// 각 적 O(1) — 인접 8셀 가중합 argmin (할당 없음)
public Direction getNextStep(Position e, float wChase, float wFlee, float wItem) {
    int best = Integer.MAX_VALUE; Direction dir = Direction.NONE;
    for (Direction d : Direction.values()) {
        Position n = e.add(d); if (!isValid(n)) continue;
        int i = n.y * width + n.x;
        float s = wChase*playerChasingMap[i] + wFlee*playerFleeMap[i] + wItem*itemMap[i];
        if (s < best) { best = (int)s; dir = d; }
    }
    return dir;
}
```

### 진동(Oscillation) 함정 + 방어
- **함정**: $w_{chase} \approx w_{flee}$ 로 팽팽하면 적이 한 칸 다가갔다 한 칸 물러나는 진동.
- **방어 (Hysteresis)**: 상태 전이를 비대칭으로 — 도주 진입 시 HP 70%+ 회복까지 $w_{flee}$ 고정 유지.
- **방어 (Turn-trigger)**: 적 의사결정은 `update(float delta)` 프레임 루프 금지 — *플레이어 턴 종료 순간* 1회 동기 호출만(§"처참한 실패 시나리오" 와 한 묶음).

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: 적 행동(behavior) 레이어
- **적용 가치**: **직접 적용** (바로 코드로 구현)
- **시급성**: **지금** (Spike 0~1 — 격자 적 이동의 기본기)

### 직접적 연결: 높음 (프로젝트 적 AI 의 1순위 기법)
턴제 격자 + 다수 적이라는 프로젝트 조건에 *정확히* 맞는다. 적마다 A\* 객체를 생성하는 대신 **턴당 `int[][]` 하나만 갱신**해 모든 적이 공유 → Java GC pressure 와 CPU 부하를 동시에 낮춘다([DOD](ecs-data-oriented-design.md) 의 primitive 배열 철학과 정합).

### 개념적 수확
- **AI 비용의 위치 이동**: "적 N마리 × 경로탐색" → "맵 1회 스캔 + 적 N마리 × O(1) 인접 비교". 적이 늘어도 비용이 거의 안 는다.
- **결정론과의 정합**: distance field 는 맵 상태의 순수 함수 → 같은 맵 = 같은 적 이동. [헤드리스 validator](../methods/automated-playtesting-shooterbot.md) 에서 적 행동 재현·검증이 가능([결정론 전투](unpredictability-of-gameplay.md) 와 한 묶음).

### 처참한 실패 시나리오
- flood-fill 재스캔을 *매 적·매 프레임* 돌리면 큰 맵에서 턴 지연. → 턴당 목적별 맵 *1회씩만* 갱신하고 적은 공유해야 한다(캐시). 안 그러면 모바일에서 턴 넘김이 버벅인다.
- 동적 장애물(문 열림/벽 파괴)이 잦으면 stale field 로 적이 벽에 박는다 → 변경 시 dirty flag 후 재스캔.

---

## 열린 질문

- ~~다목적 desire map 가중합 시 계수 튜닝 — 적 타입별 비율?~~ → §"다목적 합성 & 아키타입 튜닝"에서 제안 시드 제시 (실측 튜닝은 남음).
- 큰 맵(예: 80×40+)에서 턴당 몇 개의 Dijkstra map 까지 갱신해도 모바일 턴 지연이 체감되지 않는가? (성능 임계 측정 필요)

---

## 다음 학습 후보

- **Brogue 소스 (`bsd`/오픈소스 포팅)** — 실제 Dijkstra map 활용 코드 정독
- **Flow Field Pathfinding** (Supreme Commander 류) — 연속공간 버전, 격자 버전과 비교
- [Data-Oriented Design & Flecs — 컴포넌트를 조밀 배열로 정렬하는 ECS](ecs-data-oriented-design.md) — distance field 를 공유하는 적 엔티티 저장 구조

---

## 연결된 페이지

- libgdx-rogue-os — 적 AI 직접 적용 대상
- [Data-Oriented Design & Flecs — 컴포넌트를 조밀 배열로 정렬하는 ECS](ecs-data-oriented-design.md) — primitive 배열 공유 철학의 짝
- [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](../methods/automated-playtesting-shooterbot.md) — 결정론적 적 이동의 헤드리스 검증
- [Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준](berlin-interpretation.md) — Grid-based·Turn-based 와 정합
