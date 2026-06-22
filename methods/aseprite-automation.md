---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [assets, pixel-art, sprite, game-art, automation, cli, lua, scripting, tooling, headless]
source: https://github.com/aseprite/aseprite
authors: [Igara Studio (David Capello 외)]
year: 2026
category: method
---

# Aseprite 자동화 — 픽셀아트 에디터의 헤드리스 CLI·Lua 스크립팅 (AI 게임 에셋 파이프라인 표면)

> ✅ confirmed (작가 잠금 2026-06-16) — Claude 통독 견적(공식 `aseprite/api` repo + CLI 문서 직접 확인, 환각 0, clean-room=공개 인터페이스 지식). **초점 = 도구 매뉴얼이 아니라, 에이전트가 GUI 없이 부릴 수 있는 자동화 표면.**

Aseprite = 픽셀아트/애니메이션 스프라이트 에디터의 *사실상 표준*(Igara Studio, C++ GUI). [픽셀아트 제작 기법 + 연구](../techniques/pixel-art-techniques.md)·[픽셀아트 게임 에셋 제작 심화](../techniques/pixel-art-game-assets.md)의 실작업 도구. 핵심 = 손으로 찍는 GUI지만, **CLI 배치 + Lua 스크립팅 + 스프라이트시트 JSON export**로 *에이전트 파이프라인에 편입 가능*하다는 점. 방금 흡수한 [sprite-gen 해체 — component-row 스프라이트 아틀라스 생산 파이프라인 (hatch-pet 일반화판)](sprite-gen-skill.md)(AI 생성 스프라이트)의 **수동·정밀 대척점이자, 같은 "시트+JSON 메타 → 엔진 소비" 계약**.

## 1. 헤드리스 CLI = 배치 자동화 표면 (에이전트 진입점)

`aseprite -b/--batch`로 GUI 없이 구동. 검증한 핵심 플래그(공식 CLI 문서):

- **스프라이트시트 export(엔진 계약)**: `--sheet out.png` + `--data out.json` → PNG 아틀라스 + **기계가독 JSON 메타**(프레임 사각형·tag·slice·duration). `--sheet-type packed|rows|columns`·`--sheet-pack`·`--border-padding`/`--inner-padding`/`--shape-padding`·`--extrude`·`--trim`·`--merge-duplicates`. = [sprite-gen 해체 — component-row 스프라이트 아틀라스 생산 파이프라인 (hatch-pet 일반화판)](sprite-gen-skill.md) §2 "runtime manifest 절대사각형 계약"과 **동일 패턴**(엔진은 JSON 사각형만 샘플, 격자 추측 X).
- **분해/배치**: `--split-layers`·`--split-tags`·`--split-slices`·`--split-grid`·`--frame-range`·`--frame-tag` — 레이어/태그/슬라이스 단위로 쪼개 일괄 출력.
- **introspection(구조 읽기)**: `--list-layers`·`--list-tags`·`--list-slices`·`--list-layer-hierarchy` + `--format json` → 스프라이트 구조를 *프로그램으로 읽어 검증*(에이전트 self-QA에 직결).
- **변환**: `--scale`·`--color-mode`·`--dithering-algorithm`·`--crop`·`--palette`·`--save-as` 포맷변환(ase↔png/gif/...).
- **스크립트 구동**: `--script foo.lua` + `--script-param key=val` → 임의 Lua 헤드리스 실행. `--shell` 대화형 배치.

→ **에이전트 루프 가능**: 생성/편집(Lua) → 시트+JSON export(`--sheet --data`) → 구조 introspection(`--list-* --format json`) 검증 → 엔진 적재. 전부 GUI 0, CI/에이전트에서 스크립트화.

## 2. Lua 스크립팅 API = 프로그래밍식 픽셀 조작

v1.2.10+ Lua 5.3. 전 객체모델 노출 — 자동화 관점 핵심만:

- **진입**: `app.sprite`(활성)·`Sprite(w,h)`/`Sprite{fromFile=...}`(생성/로드)·`app.open`·`Sprite:saveCopyAs()`(export).
- **`app.command.*`** — *모든 GUI 명령을 스크립트로* 호출(`ExportSpriteSheet`·`ExportTileset`·`ImportSpriteSheet`·`ColorQuantization`·`Outline`·`Flip`·`CropSprite` 등 메뉴 전체). GUI에서 되는 건 거의 다 헤드리스 가능.
- **객체**: `Sprite`/`Layer`/`Cel`/`Frame`/`Tag`/`Slice`/`Tileset`/`Tile`/`Image`/`Palette`/`Selection`. 픽셀 직접쓰기·레이어 합성·타일맵까지.
- **내장 `json`** — 메타 직렬화 자체 지원(외부 의존 0).
- **`WebSocket`** 🌟 — Aseprite가 *외부 서비스와 실시간 통신*. 에이전트/LLM 서버 ↔ 에디터 라이브 브리지 가능성(예: 외부 생성결과를 에디터로 푸시).
- **`Events`** — 스프라이트 변경 이벤트 구독(watch 파이프라인).
- **`Dialog`** / **plugin** — HITL 커스텀 UI·메뉴 확장(큐레이션 게이트 자작 가능 — [sprite-gen 해체 — component-row 스프라이트 아틀라스 생산 파이프라인 (hatch-pet 일반화판)](sprite-gen-skill.md) §5 webview의 네이티브 대안).
- 권한: `os.execute`·`io.open`은 사용자 승인 요구(샌드박스 — 무단 파일접근 차단). CLAUDE.md CLI --sandbox 강제 규율과 결.

## 3. AI 게임 개발 관점 — 자동화 견적

- **포지션**: sprite-gen = *AI가 생성*(diffusion, 정체성 drift·motion QA 리스크). Aseprite = *사람/스크립트가 정밀 제작*(결정론·픽셀퍼펙트). 둘 다 종착 = **시트+JSON 메타 계약**. 하이브리드 = AI 초안(sprite-gen) → Aseprite Lua로 팔레트 정규화·트림·태그·시트 재export 정제.
- **결정론 자산 파이프라인**: 손-픽셀아트도 `--sheet --data` 배치로 *재현가능 빌드*화 → 에셋이 코드처럼 버전·CI 가능. [Data-Oriented Design & Flecs — 컴포넌트를 조밀 배열로 정렬하는 ECS](../techniques/ecs-data-oriented-design.md)·level-pack JSON SSoT 결.
- **에이전트 self-QA**: `--list-tags --format json`으로 기대 태그/프레임수 대조 = sprite-gen "정직 experimental 라벨"의 도구판 검증(Karpathy #4).
- **한계**: 비-OSS EULA(상용 라이선스 필요, source-available지만 자유배포 X) · GUI 강점이 본질이라 *순수 헤드리스 생성*보다는 *정제·export·검증* 자동화에 적합 · 픽셀 생성 자체의 "그림 실력"은 도구가 안 줌.

## 학습→반영 (학습→반영 루프)

- **✅ 반영 완료 = libgdx-rogue-os-art-guide §7.5** (2026-06-16): §1 헤드리스 export(`aseprite -b ... --sheet --data --split-tags`)·introspection self-QA(`--list-tags --format json`)를 게임 art-guide 의 *에셋→엔진 export 계약 + DoD*로 배선. **단 repo 실제 loader 포맷(TextureAtlas vs 커스텀 JSON)은 verification-pending** — Codex/작가가 repo 코드 1회 확인 후 `--data` 포맷 잠금(추측 선반영 X, Karpathy #1).
- **반영처 = 에셋 파이프라인 일반**: §1 CLI introspection self-QA 패턴은 향후 AI 에셋 디스패치의 done-gate 재료(hermes-loop ③Gate 도구판).
- 그 외(WebSocket 라이브 브리지·plugin 큐레이션)는 *미래 인출용* 박제 — 현 즉시 반영처 없음(concept-intake-protocol).

## 연결

- [sprite-gen 해체 — component-row 스프라이트 아틀라스 생산 파이프라인 (hatch-pet 일반화판)](sprite-gen-skill.md) — AI 생성 스프라이트 파이프라인(대척·동일 시트+JSON 계약).
- [픽셀아트 제작 기법 + 연구](../techniques/pixel-art-techniques.md) · [픽셀아트 게임 에셋 제작 심화](../techniques/pixel-art-game-assets.md) · [PerfectPixel Studio — AI 스프라이트 후처리 파이프라인 해체](../techniques/perfectpixel-studio.md) — 픽셀아트 제작 지식.
- libgdx-rogue-os-art-guide — 게임 반영처(현 손-픽셀아트 도구).
- [광고·영상 제작 파이프라인 (실전)](../techniques/ad-video-production-pipeline.md) — 이미지 생성 모델 라우팅(AI 초안 공급처).
