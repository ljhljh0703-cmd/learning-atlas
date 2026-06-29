---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [game-dev, asset-generation, sprite, tilemap, codex, pixel-art, methodology]
source: https://github.com/0x0funky/agent-sprite-forge
authors: [0x0funky]
year: 2026
category: method
---
<!-- 한국어 원라인 헤더. agent-sprite-forge — Codex-first 2D 게임 에셋(스프라이트+맵/타일/프롭) 생성 방법론 해체 학습 노트. -->

# agent-sprite-forge — Codex가 image_gen으로 그리고 스크립트가 다듬는 2D 게임 에셋 워크플로우

*0x0funky, MIT, 2026. clone 통독(1차 출처). 한국어 README 포함.*

> ⚠️ **임시 (provisional)** — clone 통독 + ③Gate(출처·환각·clean-room) 후 흡수. 작가 컨펌 전 권위 인용 X.
> ⚠️ **cold-verify (백엔드 가용성)**: 이미지 생성은 **Codex 내장 `image_gen`에 위임**(`~/.codex/skills/` 설치, 스크립트는 `$CODEX_HOME/generated_images/` 읽음). **작가 Codex Desktop에 image_gen이 있는지 미확인** = 설치 가용성의 게이트. 없으면 *방법론+후처리 스크립트만* 차용(no-hf-image-gen-recommend 정합 — 새 이미지 백엔드 강권 X).

---

## 한 줄 요약

> "에이전트가 에셋 계획을 세우고, image_gen이 raw를 그리고, 결정론적 Python이 키잉·슬라이싱·QC·아틀라스 조립" — [OpenGame — 프롬프트 하나로 플레이 가능한 웹게임을 짓는 자가진화 에이전트 프레임워크](../techniques/opengame.md) asset_protocol을 *전담·심화*한 독립 도구. ClaudeCraft 의 **타일·아이템 에셋 병목**과 정확히 맞물림.

---

## 0. 정체·아키텍처

- **2개 Codex 스킬**: `generate2dsprite`(캐릭터·적·스펠·프롭·FX·GIF) + `generate2dmap`(베이크/레이어드 raster·타일맵·프롭팩·충돌/존·Godot/Unity 씬 와이어링).
- **분업**: raw 아트 = Codex 내장 `image_gen`(필수 — Three.js/Canvas/SVG/PIL 드로잉 금지) / Python(numpy+Pillow) = **후처리 전담**(magenta 키잉·프레임 분할·bbox 정렬·아틀라스 조립·QC·GIF·프롭팩 추출·레이어드 프리뷰). **API 키 0**(후처리는 순수 로컬).
- 설치 = repo clone → `pip install -r requirements.txt` → `cp skills/* ~/.codex/skills/`. Godot/Unity 프로토타입 씬까지 산출.

## 1. 전이 가능한 알맹이 (방법론 = 백엔드 무관)

### 1.1 Magenta-key 워크플로우
- 항상 solid `#FF00FF` 배경에 생성 → chroma-key로 투명화. 모델 무관·견고(어떤 이미지 모델이든).

### 1.2 멀티로우 그리드 > 싱글로우 스트립 (핵심 규칙)
- 캐릭터/바디 애니는 **절대 1xN 금지**(가로 드리프트·불균일 크롭). 4f→2x2 / 6f→2x3 / 9f→3x3 / 16f→4x4 **중앙정렬 그리드**로 생성 → QC 후 *결정론적으로* 엔진 스트립/아틀라스 조립.
- 프레임 봉쇄: 셀 경계 침범 0 · 셀마다 동일 bbox·스케일 · feet 앵커 고정.

### 1.3 Body-only + FX 분리
- 히어로 공격/캐스트 = **바디 전용 시트**. slash arc·muzzle·projectile·impact = *별도 FX 시트*로 런타임 레이어. (고정셀에서 wide FX가 바디를 쪼그라뜨리는 것 방지.)

### 1.4 프롭 분류 → 생성 전략 (맵의 핵심)
- 모든 런타임 오브젝트를 5종 분류: `compact_prop`(square pack OK) / `wide_or_long` / `tall_or_large` / `collision_bearing` / `tileset_or_strip_piece`.
- **square 프롭팩(2x2/3x3/4x4)은 compact만.** 플랫폼·바닥·벽·사다리·문·긴 함정·충돌정렬 오브젝트는 1x3/1x4 스트립·custom wide·one-by-one·tileset 아틀라스로. (혼합 금지.)

### 1.5 레이어 분리 계약 (맵)
- base/foundation 레이어 = *비상호작용 지형 아트만*(바닥·길·물·절벽·타일셋). 런타임 오브젝트(프롭·문·픽업·액터·충돌)는 **반드시 별도 레이어/프롭/메타데이터**. 게임플레이 오브젝트를 배경에 baked 금지.

### 1.6 Reference → Post-Reference 생산 게이트
- base → 컨텍스트에 *보이게*(`view_image`) → dressed/stage reference 목업(후보 ≤9, 주석·화살표·라벨 0) → 오브젝트 리스트(id·타입·위치·충돌역할) → 최종 *별도* 에셋 + placement/collision/scene-hook 메타 + QA 프리뷰. **"reference 목업은 체크포인트지 산출물 아님."**
- **충돌은 픽셀과 독립**(엔진이 tile collision 쓸 때만 예외).

### 1.7 map_mode 분류 + 장르 라우팅
- tile/scene/side_scroll/grid/room_chunk/baked 6종 → 장르로 자동 선택. roguelike dungeon → `room_chunk_mode`(ClaudeCraft 직결).

### 1.8 QC 규율
- edge-touch 거부 · 셀간 스케일 일관 · 바디 높이 idle/run의 10-15% 이내 · 실패 시 *재처리 vs 재생성* 판단.

---

## 내 생각 — 작가 시스템 정합·시너지

### 직접적 연결: **높음** (에셋 병목 직격)
world-of-claudecraft-direction B 전환의 **타일·바닥아이템 스프라이트 부재**가 현 ClaudeCraft 병목(canvas.ts: 캐릭터=스프라이트 ✅ / 타일·아이템=glyph `fillText` ❌, manifest에 타일/아이템 에셋 0). agent-sprite-forge `generate2dmap`(타일셋·프롭팩·room_chunk) + `generate2dsprite`(아이템=compact prop)이 *정확히 그 빈칸*을 메우는 방법론.

### vs 작가 기존 에셋 자산
- **pixel-art-pipeline / [PerfectPixel Studio — AI × 결정론적 후처리 스프라이트 파이프라인](../techniques/perfectpixel-sprite-pipeline.md) (PerfectPixel, Gemini키)** = 작가 현행. 캐릭터 스프라이트엔 충분(player/enemy 완료). **빈 곳 = 맵/타일/프롭/충돌·레이어 분리** — agent-sprite-forge가 *그 부분*을 채움(상보, 대체 아님).
- **[OpenGame — 프롬프트 하나로 플레이 가능한 웹게임을 짓는 자가진화 에이전트 프레임워크](../techniques/opengame.md) asset_protocol** = 게임 파이프라인에 *내장된* 에셋 규칙(key 일관성 3층·dual tileset). agent-sprite-forge = *전담·심화*(프롭 5분류·레이어 계약·reference 게이트·후처리 스크립트 실물). OpenGame이 "무엇을" 지정하면 이건 "어떻게 안전하게 양산"을 줌.

### 3-AI 분업 정합 (큰 함의)
- Codex-first라 **작가 3-AI 분업과 정합**: Codex = 게임 코드 *+ 에셋 생성*(image_gen 있으면). → ② Asset 병목의 "작가가 PerfectPixel 수동 실행" 의존이 *Codex 한 디스패치*로 흡수 가능.
- **단 게이트 = 작가 Codex Desktop의 image_gen 가용성**(cold-verify 미확인). 있으면 설치 검토, 없으면 방법론+후처리 스크립트만 harvest(PerfectPixel 출력에 적용).

### 반영처 (학습→반영 루프)
- → game-studio-pipeline-brief **② Asset 노드 업그레이드**(타일/프롭 방법론 + 프롭 5분류 + 레이어 분리 계약 + reference 게이트).
- → ClaudeCraft 타일·아이템 에셋 슬라이스: PerfectPixel(또는 Codex image_gen) 생성 시 §1.2~1.5 규율 적용 + 후처리 스크립트(magenta-key·prop-pack 추출) 차용.

---

## 열린 질문
- 작가 Codex Desktop에 `image_gen` 내장? (설치 가용성 게이트 — 작가 확인 필요)
- 있으면: agent-sprite-forge 설치 vs 방법론만 harvest? (도구 도입 = cold-verify-before-adopt·외부도구 정책 → 작가 결정)
- 후처리 스크립트(numpy/Pillow)는 백엔드 무관 — PerfectPixel 출력에도 바로 쓸 수 있나? (magenta-key 전제 일치 여부 확인)

## 다음 학습 후보
- **PerfectPixel 출력 포맷** — magenta-key·그리드 호환성 대조(harvest 적용 가능성 실측).
- **Tiled JSON / LDtk / Godot TileMap 포맷** — agent-sprite-forge 타일 산출 타깃(작가 libgdx/canvas 매핑).
- **OpenGame asset_protocol 대조** — 두 에셋 방법론 병합 시 중복/델타.

## 연결된 페이지
- [OpenGame — 프롬프트 하나로 플레이 가능한 웹게임을 짓는 자가진화 에이전트 프레임워크](../techniques/opengame.md) · pixel-art-pipeline · [PerfectPixel Studio — AI × 결정론적 후처리 스프라이트 파이프라인](../techniques/perfectpixel-sprite-pipeline.md) · game-studio-pipeline-brief · world-of-claudecraft-direction · no-hf-image-gen-recommend · cold-verify-before-adopt
