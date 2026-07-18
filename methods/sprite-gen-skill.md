---
created: 2026-06-16
updated: 2026-07-13
type: learning
tags: [assets, sprite, game-art, pipeline, image-gen, skill, codex, hitl, runtime-manifest]
source: https://github.com/aldegad/sprite-gen
authors: [aldegad]
year: 2026
category: method
---

# sprite-gen 해체 — component-row 스프라이트 아틀라스 생산 파이프라인 (hatch-pet 일반화판)

> ✅ confirmed (작가 잠금 2026-06-16) — Claude clone 전문통독 해체, ③Gate PASS(코드-문서 일치, 환각 0, clean-room).

캐릭터 이미지 1장 + 숫자 요청(JSON) → **상태(state)별 가로 strip 1개씩** image-gen 생성 → 크로마 알파 제거 → connected-component로 포즈 추출 → 고정 cell 재배치 → 런타임 manifest로 기술되는 투명 아틀라스. [OpenAI Hatch Pet Skill — 에이전틱 에셋 팩토리](openai-hatch-pet-skill.md)에서 영감받았으나 **펫 8×9 고정 격자 → 가변 state·가변 cell·게임 일반화**. Apache-2.0.

## 한 줄

> "한 장 들어가서, 엔진이 바로 먹는 스프라이트 아틀라스가 나온다." image-gen의 마지막 10%(망가진 프레임)는 **큐레이션 웹뷰**가 사람 손에 넘김 — *파이프라인이 노동, 사람이 취향*.

## 파이프라인 (component-row, 유일 정식 경로)

```
sprite-request.json (숫자 SSoT)
  → prepare: layout-guide + prompt 생성
  → image-gen: state당 raw/<state>.png strip 1장
  → extract: 크로마제거 → connected components → fit_to_cell
  → frames/<state>/frame-N.png + frames-manifest.json
  → (옵션) curate 웹뷰 → curation.json (비파괴 sidecar)
  → compose: sprite-sheet-alpha.png + manifest.json.frame_layout (런타임 SSoT)
```

스크립트 = *숨은 import 아니라 명시적 파이프라인 명령*, 각 1잡. 코드 검증함: `connected_components`/`fit_to_cell`/`extract_component_frames`/`extract_slot_frames` 실존, compose가 `frame_layout`·`game_input`·`degraded_static_fallback:false` 기록. 의존성 = Pillow 단일.

## 가져갈 핵심 패턴 (방법론)

1. **숫자 SSoT 1파일이 모든 단계 구동** — `sprite-request.json`의 cell·chroma·states를 프롬프트·추출·아틀라스·QA가 전부 같은 출처에서 재생성. `256`은 변수지 숨은 상수 아님. (우리 libGDX level-pack JSON SSoT와 동형 — [Data-Oriented Design & Flecs — 컴포넌트를 조밀 배열로 정렬하는 ECS](../techniques/ecs-data-oriented-design.md) 결.)
2. **런타임 manifest = 절대 사각형 계약** — `frame_layout.rows.<state>[i]={x,y,w,h}`. *엔진은 사각형만 샘플, 격자를 추측하거나 런타임에 알파에서 프레임 복원 금지*. 게임 코드와 에셋 사이 기계가독 계약. (libGDX TextureAtlas 소비 방식과 직결 — 반영처 ↓.)
3. **idle-anchor 정체성 소유권** — `identity=accepted idle anchor / motion=layout guide / base=anchor 만들 때만 쓰고 폐기`. anchor 생긴 뒤 base를 row에 재첨부하면 모델이 정체성을 다시 풀어 drift 증폭. **BLOCKING 게이트**(base가 full-body·정확한 비율/스타일·식별 일치일 때만 lock, "일단 충분" 불가).
4. **content-based 추출 > slot-based** — 포즈를 blob으로 찾아 x-center 정렬·노이즈 흡수 후 fit. frame 수 못 찾으면 row **block**(silent fallback 0, `--allow-slot-fallback`은 디버그 전용·`slots-explicit` 보고).
5. **비파괴 큐레이션 sidecar** — `curation.json`(selected 인덱스 + per-frame affine: rotate/scale/dx/dy). 원본 PNG 안 건드림, compose가 결정론적으로 bake. HITL 취향 게이트를 *파일 하나*로 가역화. 웹뷰는 채팅이 못 보여주는 이미지 후보를 *나란히 비교*하는 범용 picker로도 씀(스프라이트 아님 — 아이콘/로고 시안에도).
6. **정직한 experimental 라벨** — idle/jump/attack/wave = stable, walk/run cyclic locomotion = motion QA 통과 전엔 `experimental`. 약한 walk를 MVP와 같은 status로 *조용히 승격 금지*. 9·12프레임은 default 아님(검증서 duplicate/empty/slot-collapse 증가 — 정직 보고). = Karpathy #4(검증가능 성공기준) + 과대약속 차단.
7. **single-writer run-dir lock** — `.sprite-gen.lock`로 2 에이전트(Claude+Codex 병렬) 한 캐릭터 폴더 동시 쓰기 차단, atomic temp+replace. 우리 CLAUDE.md "같은 파일 동시 편집 금지"의 코드 구현 사례.
8. **inverse 경로** — `unpack_atlas_run`(완성 시트→큐레이터 run-dir 복원, grid>manifest>auto-detect 우선순위) / `export_curated_pngs`(가구 등 정지 세트→이름 PNG). 배포된 에셋 사후 편집 가능.

## 학습→반영 (학습→반영 루프)

- **✅ 반영 완료 = libgdx-rogue-os-art-guide §7.5** (2026-06-16): 패턴 #2(manifest frame_layout 절대사각형 계약, "엔진은 격자 추측 금지")를 게임 art-guide 의 *에셋→엔진 export 계약*으로 배선. 단 repo 실제 loader 포맷은 verification-pending(코드 확인 전 데이터포맷 잠금 X). image-gen 파이프라인 자체는 현 손-픽셀아트 게임엔 미적용(향후 AI 스프라이트 도입 시).
- **반영처 = 분업 규율**: 패턴 #7(run-dir lock)은 외부 AI 동시쓰기 사고(log agy)의 *코드 레벨 예방 사례* — 순수 참조, 추가 배선 불요.
- 그 외(#1 숫자SSoT·#6 정직라벨)는 이미 vault 보유 원칙의 외부 확증재 → 흡수만.

## v1.56.13 delta 감사 (③Gate 2026-07-13, Codex clone 재통독)

<!-- 2026-06-16 흡수 이후 87커밋 델타 + 결함 감사. 원 노드 원리 무변경 — 신규 정보만 병합. proposed_by: codex(via RETURN), confirmed_by: user 2026-07-13. asset SHA-256 99a9e091… 검증. -->

- **저장 = PASS, 설치 = NOT INSTALLED.** 본 노드는 2026-06-16 confirmed 로 정상 배선(design-index·libGDX art-guide). 지식 저장 ≠ 실행도구 설치 — 여전히 미설치.
- **업데이트 = MATERIAL DELTA.** 추정 baseline `34852ae…`→`v1.56.13`/`2500c151…`: **87 commits, 193 files, +14,405/−3,451**. 원격 검증 — 최신 release `v1.56.13`(200), GitHub Actions run success, 13/13 outbound URL 200. ⚠ baseline 은 원 노트에 source SHA 부재라 흡수일 직전 커밋 추정(증명된 checkout 아님).
- **흡수 판정 = 신규 독립 노드 X, 본 노드 delta 갱신 O.** YCbCr/projection/centroid/3-pass loop 원리는 이미 [PerfectPixel Studio — AI 스프라이트 후처리 파이프라인 해체](../techniques/perfectpixel-studio.md)·본 노드에 존재.
- **정적 코드 감사로 확인된 결함(CONFIRMED, 채택 전 STOP):**
  1. **correction-loop rank 결함** — `candidate_rank` 가 과다검출 frame 수를 우대 → 자동 `preserved_best` 신뢰 금지(exact-frame correctness 우선 정렬 전까지).
  2. **package/CLI mismatch** — 문서화된 `sprite-gen` 콘솔 명령 실존 가정 금지, pinned repo wrapper 사용.
  3. **default histogram threshold `0.0`** · **provenance 필드가 request/runtime manifest 에 부재** · **curator loopback 기본 + 미인증 POST 표면**.
- **APPLY NOW (포폴):** 후보 큐레이터 + variant-sheet slicer. **PILOT(게임):** 마스코트·몬스터·초상·simple 4-frame action. **PARK:** 자동 correction(위 rank 결함).

**🅿️ Park — pixel-art-pipeline P0 router 재편(작가 판정 대기):** Codex 제안 = pixel-art-pipeline 을 provider-neutral 단일 router 로, sprite-gen 을 raw 이후 정리·분할·큐레이션·simple compose 의 P0 middle layer 로 배치(`$imagegen → sprite-gen → Aseprite(optional) → final manifest → consumer`, PerfectPixel = advanced-motion 대안 레인). **이건 active skill 계약 변경이라 흡수만으로 자동 적용 X** — 작가 승인 후 별도 반영. 근거 자산: `~/Documents/Codex/2026-07-13/sprite-gen/…asset-skill-topology-evidence.md`.

## 연결

- [OpenAI Hatch Pet Skill — 에이전틱 에셋 팩토리](openai-hatch-pet-skill.md) — 직계 부모(8×9 고정 펫 → sprite-gen 가변 일반화). 차이: content-based cut·idle-anchor·curation·inverse·runtime manifest.
- [픽셀아트 게임 에셋 제작 심화](../techniques/pixel-art-game-assets.md) · [픽셀아트 제작 기법 + 연구](../techniques/pixel-art-techniques.md) · [PerfectPixel Studio — AI 스프라이트 후처리 파이프라인 해체](../techniques/perfectpixel-studio.md) — 에셋 제작 결.
- libgdx-rogue-os-art-guide — 게임 반영처.
- [광고·영상 제작 파이프라인 (실전)](../techniques/ad-video-production-pipeline.md) — 이미지 생성 모델 라우팅(GPT Image 2·Nano Banana) 보유처.
