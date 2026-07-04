---
created: 2026-06-08
updated: 2026-06-08
type: learning
tags: [ui-architecture, clean-room, spd, libgdx-rogue-os, roguelike]
source:
  - https://github.com/00-Evan/shattered-pixel-dungeon
authors: [00-Evan (Shattered Pixel)]
year: 2024
category: technique
---

<!-- SPD UI clean-room 학습 — GameScene/PixelScene/StatusPane/Toolbar/GameLog 역할만. GPL 코드 복사 X -->

# SPD UI Clean-Room — 5개 클래스의 *역할*만

*Shattered Pixel Dungeon (00-Evan, GPLv3) UI 아키텍처 참조*

> ⚠️ **Clean-room 원칙**: SPD 는 GPLv3. 본 노트는 *책임 분리(역할) 개념*만 정리하며 **코드·아트·텍스트·메서드 시그니처를 복사하지 않는다.** libgdx-rogue-os 구현은 이 역할 분리를 *발상으로만* 참고하고 독립 작성한다.
>
> 검증된 클래스 계층: `Gizmo → Group → Scene → PixelScene → GameScene` (UI 컴포넌트는 GameScene 이 보유).

---

## 5개 클래스 역할

### 1. PixelScene — 픽셀아트 씬 *기반 클래스*
- 모든 게임 씬의 부모. **픽셀 퍼펙트 렌더 토대** 제공 — 카메라/줌·스케일 정규화, 픽셀 폰트·텍스트 설정, 씬 전환 공통 스캐폴딩.
- 역할 한 줄: *"무엇을 그리든 픽셀 단위로 일관되게 보이게 하는 바닥."*

### 2. GameScene — 인게임 *오케스트레이터* (PixelScene 상속)
- 메인 플레이 화면. **월드 렌더 + UI + 입력을 한데 묶는 허브.**
  - 월드: 타일·물·벽·가스·이펙트·몹/히어로 스프라이트 배치.
  - UI 컴포넌트(StatusPane·Toolbar·GameLog 등)를 *소유·배치*.
  - 입력 라우팅(셀 선택 → 행동), 게임 루프 틱·액터 스케줄, 시야/안개 갱신.
- 역할 한 줄: *"세계 그리기·UI·입력을 조립하는 중앙 허브."*

### 3. StatusPane — 상단 HUD *표시*
- 히어로 상태 읽기 전용 표시: 초상/아바타, HP 바, 깊이(층), 위험도 지표, 경험치·버프 등.
- 역할 한 줄: *"히어로/런 상태를 보여주기만 하는 위쪽 패널."*

### 4. Toolbar — 하단 *행동 버튼*
- 빠른 액션 버튼: 탐색/대기, 휴식, 인벤토리, 맥락 버튼 등. **탭 → 게임 행동으로 변환.**
- 역할 한 줄: *"플레이어 입력을 행동으로 바꾸는 아래쪽 바."*

### 5. GameLog — 이벤트 *텍스트 로그*
- 게임 사건 메시지 스트림 렌더(전투 결과·획득·상태 변화), 색 강조·자동 스크롤·페이드.
- 역할 한 줄: *"무슨 일이 있었는지 흘려보내는 읽기 전용 로그."*

---

## 핵심 분리 패턴 (libgdx-rogue-os 적용 발상)

```
PixelScene (렌더 토대)
   └─ GameScene (허브: 월드+UI+입력)
        ├─ StatusPane  (상태 → 표시)      ← 읽기 전용
        ├─ Toolbar     (입력 → 행동)      ← 입력 변환
        └─ GameLog     (사건 → 로그)      ← 읽기 전용
```

- **표시(StatusPane/GameLog)와 입력(Toolbar)을 분리**, 씬 허브(GameScene)가 모델과 UI를 매개.
- 우리 프로젝트는 현재 `RogueOsGame` 한 클래스가 렌더·HUD·입력을 다 안고 있음. SPD식 *역할 분리*는 이걸 쪼갤 때의 참조 골격 — 단 **헤드리스 model 은 이 UI 층과 완전 격리 유지**(validator-first 정체성). UI 는 model 의 *순수 함수 출력*을 표시만.

---

## 연결된 페이지
- libgdx-rogue-os — UI 층 설계 시 참조
- roguelike-mechanics-spd — SPD 전투·메커니즘 (별도 학습)
- [Data-Oriented Design & Flecs — 컴포넌트를 조밀 배열로 정렬하는 ECS](ecs-data-oriented-design.md) — model 데이터 층 (UI 와 격리되는 쪽)
