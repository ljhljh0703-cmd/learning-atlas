---
created: 2026-06-22
updated: 2026-06-22
type: learning
tags: [game-design, roguelike, dcss, dungeon, traps, risk-reward, claudecraft]
source: https://github.com/crawl/crawl
authors: [DCSS Dev Team (Stone Soup)]
doi: null
category: technique
---

# DCSS(Dungeon Crawl Stone Soup) 던전 디자인 — 다층·위험보상·함정·상호작용

오픈소스 로그라이크 정본 DCSS의 던전 구조 학습. ClaudeCraft F-006 Phase C(R-010~013) 반영 목적 — 작가 요구 타깃(다층·함정·퍼즐/위험보상·상호작용)에 한정 추출. **DCSS 전체(신 ~30·주문 수백·종족·직업)는 이식 대상 아님**(과적용 가드, Karpathy #2).

> 학습 방식: 공식 manual(`crawl-ref/docs/crawl_manual.rst`) WebFetch 4각도 + repo shallow clone 소스 직접 통독(`dungeon-feature-type.h`·`branch-data.h`·`traps.cc`). 분기·함정 enum은 **소스 직접(정확)**, 구조/위험보상 서술은 manual 기반. 효과 수치·확률은 미추출(패턴 학습 목적).

## §1 다층·분기 구조

- **분기 시스템**(소스 `branch-data.h` 확정): 본선 `Dungeon` + 선택적 테마 분기 — `Lair`·`Orcish Mines`·`Snake Pit`·`Swamp`·`Shoals`·`Spider Nest`·`Slime Pits`·`Vaults`·`Crypt`·`Tomb`·`Elven Halls`·`Depths` + 고위험 `Abyss`·`Pandemonium`·`Realm of Zot`. 선형 진행이 아닌 **다분기 트리**.
- **계단**: `>`(하강)·`<`(상승) 양방향. **1층에서 `<` = 던전 영구 탈출**(비가역 결정). 인접 몹은 층 이동 시 따라옴(적·아군 모두 — 위협 연속성).
- **OOD(out-of-depth) 몹**: 얕은 층에 가끔 강적 출현. manual 명시 "버그 아님 — 랜덤성 디자인 목표". 효과 = 긴장·생존 시 기억에 남는 캐릭터 유대, 얕은 층도 trivial 안 됨.
- **Zot clock**: 한 구역에 너무 오래 머물면 Zot이 감지해 영구 체력 손상 → **무한 파밍 차단·시간 압박**(Abyss에선 무효).
- **룬 게이트**: 분기 *바닥*에 룬 → 3개 모아야 엔드게임(Zot) 진입. 분기는 "선택적이나 전략적 필수".

## §2 위험-보상 (작가 핵심 요구: "어려울수록 좋은 보상")

- **Vault(봉인 보물방)**: handmade `.des` 모듈(repo `dat/des/` 144 디렉토리: `altar`·`branches`·`portals`·`serial`·`sprint` 등). 랜덤 생성이 못 만드는 구조적 챌린지 + 테마 몰입 + **loot 가드(강적 수호) → "안전 vs 탐욕" 선택 강제"**.
- **깊이 ∝ 난이도 ∝ 보상**: 선택적 위험지대(분기 깊은 곳·고위험 분기)일수록 좋은 전리품. 강제 grinding 대신 *계산된 모험*.
- 고위험 옵션 콘텐츠: Ziggurat·Pandemonium·Abyss(재시도·공략 가능한 반복 도전 — 작가 "재시도+반복+공략" 요구와 정합).

## §3 함정 17종 → 5 카테고리 (소스 `dungeon-feature-type.h` enum 직접)

전체 enum: `MECHANICAL`·`SPEAR`·`BOLT`·`SHAFT`·`TELEPORT`(+`_PERMANENT`)·`WEB`·`NET`·`ALARM`·`ZOT`·`DISPERSAL`·`PLATE`·`TYRANT`·`ARCHMAGE`·`HARLEQUIN`·`DEVOURER`·`SHADOW`.

| 카테고리 | 함정 | 메커니즘(소스 `traps.cc` 확인) |
|---|---|---|
| 피해형 | MECHANICAL·SPEAR·BOLT | 직접 데미지 발사 |
| 이동 교란 | **SHAFT**·TELEPORT | SHAFT=다음 층 강제 추락(위험+빠른 진행 *양면*) / TELEPORT=랜덤 전이 |
| 포박 | NET·WEB | LOF 조건 포박, 행동 제약(탈출 굴림) |
| 유인 | **ALARM** | `noisy(40)` 소음 → 주변 몹 유인, 발동 후 1회성 파괴 |
| 고위험 랜덤 | **ZOT**·DISPERSAL | ZOT=랜덤 악효과(몹도 트리거해 플레이어 노림) / DISPERSAL=주변 몹 전이 |

- **탐지·우회 전술층**: known(발견된) 함정은 회피 가능(`shaft` 등 "알려진 함정엔 안 떨어짐"). → 탐색 보상 + 우회 vs 횡단 판단.

## §4 상호작용 features (소스 `dungeon-feature-type.h` + manual)

- **제단(altar)**: `<`/`>`로 신 신앙 진입(부담+은혜 trade).
- **상점(shop)**: 구매만(판매 불가).
- **archway/portal**: 테마 일회성 공간 진입.
- **문**: 일반(걸어서 개방)/sealed/**runed door**(조건부 — 위험 경고 신호).
- 계단·분수 등 맵 상호작용 타일.

## §5 ClaudeCraft 반영 (학습→반영 루프)

Phase C 슬라이스별 반영 포인트:

- **R-010 다층**: stairs `>` 하강 + 층 깊이 ∝ 난이도 스케일 + **OOD 몹**(가끔 강적 = 긴장). 1층 영구탈출식 비가역 선택은 옵션.
- **R-013 숨겨진 요소·위험보상**: **봉인 보물방**(vault = 강적 수호 + greed 선택) + 함정 5카테고리 중 **SHAFT(추락)·ALARM(유인)·피해형** 우선 이식. 퍼즐 방 = vault식 모듈 콘텐츠로. "어려울수록 좋은 보상" = 봉인방 난이도 ∝ loot.
- **R-012 적 다양성**: OOD 출현 메커니즘 = 적 다양성+긴장. [적 아키타입 디자인 패턴 — "스탯 묶음"이 아니라 "전술 질문"](enemy-archetype-design-patterns.md)·[적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](enemy-decision-making.md)과 결합(외관+행동 차별).
- **R-011 인벤/스킬 UI**: DCSS 던전 디자인과 직접 무관(별개 트랙).
- **과적용 가드**: 신앙/주문/종족 등 DCSS 깊이 시스템 이식 X. 작가 타깃 4축만.

## 관련

[적 아키타입 디자인 패턴 — "스탯 묶음"이 아니라 "전술 질문"](enemy-archetype-design-patterns.md) · [적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](enemy-decision-making.md) · [DVM — 추론/결정/발화 분리형 소셜추론 NPC 결정 체인](dvm-decision-chain-npc.md) · [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) · [Recursive Shadowcasting — 격자 로그라이크 FOV 의 표준](fov-recursive-shadowcasting.md) · index
