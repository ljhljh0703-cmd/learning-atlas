---
created: 2026-06-09
updated: 2026-06-09
type: learning
tags: [pixel-art, game-asset, animation, tileset, autotile, lighting, bitmap-font, ai-generation, dithering, libgdx]
source:
  - https://libgdx.com/wiki/graphics/2d/2d-animation
  - https://www.aseprite.org/docs/animation/
  - https://doc.mapeditor.org/en/stable/manual/terrain/
  - https://github.com/libgdx/box2dlights
  - https://libgdx.com/wiki/graphics/2d/fonts/bitmap-fonts
  - https://arxiv.org/abs/2410.06236
authors: ["libGDX docs", "Aseprite docs", "Tiled docs", "Ulichney", "Binninger & Sorkine-Hornung", "Zhang et al. (ControlNet)"]
year: 2024
category: technique
---

# 픽셀아트 게임 에셋 제작 심화

> research-relay 2차(GPT) → ③Gate PASS → 흡수. 1차([픽셀아트 제작 기법 + 연구](pixel-art-techniques.md))=기법 일반, 본 노트=게임 에셋 제작 실전(libGDX 적용). 공용 규칙 pixel-art-production-spec, 게임 핸드오프 libgdx-rogue-os-art-guide.

## 1. 애니메이션

- frame timing: `frameDuration = cycleTime / frameCount`. libGDX `Animation<TextureRegion>` 가 frameDuration 기반 재생. 30프레임 cycle 1초 = 30fps = 0.033s/frame.
- 상태 태그: `idle`/`walk`/`attack`/`hit`/`death` 단위로 Aseprite frame tag 분리 → libGDX 에서 tag별 frame 배열을 `Animation` 으로 매핑, state machine 이 `stateTime` 누적.
- 스프라이트 시트: 개별 PNG frame → TexturePacker → `.atlas` → `TextureAtlas.findRegions("slime_walk")`. 파일명 index `_0`,`_1` 규칙(순서 손실 방지).
- smear frame: 빠른 attack impact 직전 1프레임 잔상. trail/arc 색은 공용 highlight ramp 내 제한.
- squash&stretch: 착지/피격 시 높이 1~2px↓·폭 1px↑, 점프/타격 직전 반대. **collision box 는 sprite 변형과 분리 고정**.
- ⚠️ walk/idle/attack 의 표준 frame 수·fps 는 확인 안 됨 — 프로젝트 감각+플레이테스트로 결정.

## 2. 타일셋·오토타일

- 47-blob: 8-neighbor bitmask → tile index. 대각선은 양쪽 직교 이웃 있을 때만 corner 인정. mapping table 명시 고정. ("47"은 커뮤니티 관례, 공식 표준 아님.)
- Wang/terrain set: edge Wang(벽/바닥 경계), corner Wang(모서리·대각). Tiled terrain set 으로 편집. floor variation 은 edge label 유지·내부 pattern 만 변경.
- seamless 검증: 경계 1px 라인 먼저, 2×2/3×3 반복 preview 로 seam·반복얼룩·고립픽셀 확인. Aseprite Tiled Mode.
- dungeon tile grammar: floor base/alt · wall straight/corner in-out · door closed/open/locked · stairs up/down · pit · collision marker. **door/trap/spawn 은 graphic tile 이 아니라 Tiled object property** 로. libGDX 는 render layer 와 collision/object layer 분리.

## 3. 2D 라이팅

- Box2DLights(libGDX): ambient(기본 어둠) + PointLight/ConeLight(torch/projectile/spell). Gaussian blur light map·shadow·culling·colored ambient 지원. **UI/HUD 는 light pass 이후 별도 stage**.
- normal map sprite: diffuse 와 같은 좌표의 normal atlas. shader `normal = normalize(rgb*2.0 - 1.0)`. 중요 prop(벽돌·문·금속·보스·보석)부터 적용, actor 전체 무리 적용 X.
- ambient/그림자 색: 순흑 대신 **공용 dark ramp** 사용(팔레트 톤 유지).

## 4. 폰트·UI 아이콘

- bitmap font(libGDX `BitmapFont`): AngelCode BMFont `.fnt`+PNG. HUD 글자 integer scale, outline/shadow 1px. 폰트 atlas 와 icon atlas 분리.
- 한글: 글리프 多 → 동적/비트맵 폰트 생성 파이프라인 별도 검토.
- 소형 아이콘: Material 24dp grid·20dp live area·2dp padding 준용. 16×16 게임 아이콘은 외곽 1px 여백 + silhouette 우선 + 2~3단계 명암(장식 최소).

## 5. AI 생성 (가드 필수)

- ControlNet: edge/pose/depth/segmentation 조건으로 diffusion 제어 → silhouette·tile boundary 고정해 일관 후보.
- Retro Diffusion: 픽셀아트 특화 생성(웹/Aseprite extension/API). **vendor claim(학습데이터·라이선스)은 production 전 검증 필수**.
- SD-πXL: 목표 해상도 H×W + palette 색 수 n 조건 → low-res quantized 생성.
- **불가침 후처리**: AI 결과 = 초안. 최종 투입 전 ① 공용 palette nearest quantize ② orphan/banding 제거 ③ silhouette·light 일관 ④ frame jitter 정리 ⑤ source provenance release gate.

## 6. 디더링 심화

- ordered/Bayer: 고정 threshold map 반복. shader/애니 재현 쉬움. 격자 패턴 보이니 UI·소형 아이콘엔 과용 X.
- blue-noise/void-and-cluster(Ulichney): 고주파 분포 mask, 격자감 ↓. **애니에선 world-space 고정 mask**(frame마다 바뀌면 shimmer). 8×8/16×16 precomputed mask 를 tile 좌표 고정.
- 용도: fog-of-war·darkness·poison·lava glow·procedural floor noise.

## 7. 관련 연구

- **SD-πXL**(arXiv:2410.06236) — palette 수+해상도 조건 quantized 생성.
- **ControlNet**(arXiv:2302.05543) — spatial condition 으로 생성 제어.
- **Make Your Own Sprites**(DOI 10.1145/3550454.3555482) — aliasing-aware·cell-controllable pixelization.
- **Wang Tiles for Image/Texture**(Cohen et al. 2003) — 소수 tile 비주기 타일링.
- **Void-and-Cluster**(Ulichney 1993, DOI 10.1117/12.152707) — blue-noise dither array.
- **Content-aware Tile Generation**(arXiv:2409.14184, DOI 10.1145/3687981) — boundary inpainting tileable set.
- **Tiled Diffusion**(arXiv:2412.15185, CVPR 2025) — self-tiling pattern 생성.

## 8. 게임 에셋 제작 체크리스트 (actionable)

1. 스펙 고정 — tile/actor/icon 크기 + 공용 palette + ramp + upper-left 광원(pixel-art-production-spec).
2. actor 상태 목록(idle/walk/attack/hit/death) Aseprite frame tag 분리.
3. timing table — 상태별 frameCount·cycleTime·frameDuration.
4. sprite sheet export 규칙(파일명 index) → TexturePacker atlas.
5. libGDX animation binding(state machine, 현재 animation 만 재생).
6. smear(빠른 attack) + squash/stretch(피격/착지), collision box 고정.
7. dungeon tile grammar 분리(render vs collision/object layer).
8. autotile: 단순 경계=47-blob/bitmask, 변이=Wang/terrain set.
9. seamless 검사(3×3 preview).
10. dynamic light(Box2DLights ambient+torch), UI 는 light pass 이후.
11. normal map 중요 prop 부터.
12. HUD 폰트/아이콘 별도 atlas, 소형 아이콘 live area·여백.
13. AI 후보는 control image(silhouette/edge) 기반 제한.
14. AI 결과 palette lock + 수동 정리(orphan/banding/jitter).
15. dithering 용도별 mask 고정(UI 최소, fog/FX 는 Bayer/blue-noise).
16. source provenance 를 release gate 에.

## 9. 출처·신뢰도

- 확실(1차): libGDX(animation/texture-packer/tile-maps/bitmap-font)·Aseprite(animation/frame-duration/sprite-sheet/tilemap/tiled-mode)·Tiled(terrain)·Box2DLights 공식 + 논문 7편(arXiv/ACM/CVF).
- 불확실(GPT §6 정직 표기): walk/idle frame 표준 수치 없음 · 47-blob "47" 관례 · smear/squash 픽셀 수치 보조튜토 · Retro Diffusion vendor claim · AI 생성 일관성(palette lock 전 투입 불가).
- 전체 출처(50개 URL): research-relay 2차 RETURN §5. 리서치 경로 research-relay.
