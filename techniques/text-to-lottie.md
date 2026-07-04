---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [lottie, skottie, text-to-lottie, agent-skill, thin-harness-fat-skills, verification-grounding, live-preview, slots, clean-room]
source: https://github.com/diffusionstudio/lottie
authors: [diffusion studio]
year: 2026
category: technique
---

<!-- text-to-lottie(diffusion studio) 전문통독 재분석 — 코딩 에이전트가 skill로 Lottie를 생성하고 라이브 Skia 플레이어로 검증하는 하네스. 기존 GPT 외주 오분석(agentic-lottie-html-integration) 대체. clean-room. -->

> ✅ **confirmed** (2026-06-17, 작가 "A ㄱㄱ" — 전면 재작성) — vault Claude *repo 직접 clean-room 통독* 기반 ③Gate PASS. **기존 agentic-lottie-html-integration(GPT 외주, 2026-06-12)를 대체** — 그건 repo 미독 일반 Lottie 지식 합성이라 정체·아키텍처를 오분석했고, repo SKILL 이 *금지한 안티패턴(hand-rolled lottie-web viewer)*을 정답으로 박았음. 본 페이지가 정정.

# text-to-lottie — 에이전트 Lottie 생성 하네스 (diffusion studio)

repo 실명 = **`text-to-lottie`**(diffusion studio, YC F24 영상 SDK 회사). 정체 = **코딩 에이전트(Claude Code/Codex 등)가 *skill*로 production Lottie 애니메이션을 생성하고, 로컬 Skia(Skottie) 라이브 플레이어로 *검증*하는 프레임워크**. `npx skills add diffusionstudio/lottie` 로 skill 설치. SolidJS 앱 + canvaskit-wasm.

**왜 중요** — [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md)에서 배운 **thin-harness-fat-skills 의 실물 인스턴스**(SKILL.md 가 절차·판단, 앱이 deterministic 렌더·검증 토대). 특히 *검증 프로토콜*이 작가 agent-harness H-14 verification-grounding·[Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](../methods/playwright-e2e-agent-harness.md) OBSERVE 매체와 같은 패턴의 production 사례.

## 1. 아키텍처 = skill + 라이브 플레이어 하네스

- **deliverable ≠ lottie.json 만이 아님** — 뷰어 세팅 + 브라우저 프리뷰 + 검증까지가 산출. SKILL.md 핵심 규율: **"절대 직접 viewer 만들지 마라"** — 공식 GitHub 플레이어 프로젝트만 써라(`npx degit diffusionstudio/lottie`). slot·`?frame`·Skottie 배선은 *그 프로젝트 안에서만* 성립. lottie-web 으로 갈아끼우거나 커스텀 HTML 만들면 *조용히 발산*하고 검증이 무효. (← 기존 vault 페이지가 정확히 이 금지된 짓을 정답으로 박았던 부분.)
- **폴더 = 라우팅 규약** — `public/projects/<project-slug>/<scene-N>/lottie.json`(+옵션 `controls.json`·이미지). slug=URL 세그먼트, scene 정렬=trailing `-N`(regex `/-(\d+)$/`), `lottie.json` 없는 scene 폴더는 조용히 drop. 이미지는 bare filename 으로 `assets[].p` 참조.
- **라이브 업데이트** — Vite 플러그인(`vite-plugins/scenes.ts`)이 폴더 트리 watch → 폴더 add/remove/rename 은 HMR 로 사이드바 즉시 갱신. 단 *내용* 편집은 active scene 자동 reload 안 됨(재방문 필요). self-write echo 는 byte 대조로 필터(에이전트 외부 편집만 reload).
- **write-back = disk 가 source of truth** — UI 슬라이더/slot 편집 시 `/__scenes/lottie` 로 POST → scene 의 lottie.json 덮어씀. **재편집 전 disk 에서 re-read** 필수(화면 값이 이미 다를 수 있음).

## 2. slots — 라이브 속성 패널 (Skottie 네이티브)

editable 속성 = Skottie native **slot** 기능. re-parse 0, 다음 프레임에 반영.
- **slot 선언**: top-level `"slots"` 객체(키=slot ID), 속성에 inline 값 대신 `"sid": "<id>"` 지정. slot 의 `"p"`=기본값.
- **자동 발견**: 앱이 Skottie `getSlotInfo()` 로 slot 자동 탐지 → 어디 따로 나열 안 해도 패널 등장.
- **타입→컨트롤 매핑**: scalar→slider · color(RGBA 0–1)→color picker · vec2 `[x,y]`→숫자 2칸 · text→텍스트 입력.
- **`controls.json` 사이드카(옵션)**: slot 은 ID·타입만 노출 → label·slider min/max/step 은 scene 폴더의 `controls.json` 으로 보강(없으면 slot ID + 0–100 fallback).
- **강제 규칙**: *모든 산출물은 최소 background color control 1개를 노출*해야 함.

## 3. 🌟 검증 프로토콜 (작가 H-14 / OBSERVE 매체 직결)

SKILL.md 검증 절차 = 작가 verification-grounding 의 구체 인스턴스:
- **URL 로 프레임 핀**: `/<project>/<scene>?frame=N` → frame N 으로 seek **+ pause**(정지 → 깨끗한 스크린샷). frame 없으면 autoplay. canvas = `<canvas id="main-canvas">`.
- **`/__context` 엔드포인트**: `GET /__context` → 전체 project/scene 트리(+mtime) + active scene + **라이브 재생상태**(경과시간으로 *계산된* current frame). 브라우저가 discrete 이벤트에만 POST(heartbeat) → GET 이 elapsed 로 frame 산출(스트리밍 X). **스크린샷 추측 대신 이걸 읽어라** — 파일 안착 확인·active scene·playhead·frame count(`live.totalFrames`).
- **스크린샷 전략**: 새 scene → 3장(frame `0`·중간 `op/2`·마지막 `op-1`)으로 시작/중간/끝 포즈. 작은 편집 → 관심 영역 1~2장.
- **프롬프트 충실도뿐 아니라 *아티팩트* 헌팅** — "요청과 맞나"를 넘어 미완성으로 보이게 하는 문제까지. = 작가 [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](../methods/playwright-e2e-agent-harness.md) trace·Fable 실렌더러 RUN-OBSERVE 정신.

## 4. 프롬프트 가이드 5원칙 (creative·dispatch 적용가)

1. **ground the model** — SVG·실데이터·스크린샷 제공 시 결과 급상승(구체 에셋 기반).
2. **모션디자인 용어** — ease-in/out/in-out 등으로 타이밍·움직임 기술.
3. **카메라 오퍼레이터처럼** — push/pan/zoom·rig 모션을 group transform 으로 시뮬레이션 요청.
4. **필요한 control 명시 요청** — 기본은 background color 만 노출 → 다른 속성 편집하려면 명시 요청.
5. **FPS·duration 명시** — 특정 프레임레이트·길이 필요 시 프롬프트에 frame count 포함.

## 5. 저수준 Lottie/Skottie 제약 (기존 페이지에서 건진 부분 — repo 확인됨)

- **group wrapper 필수**: shape layer(`ty: 4`) 하위 geometry+fill 은 반드시 `"ty": "gr"` 그룹 `it[]` 안에. flat list = blank canvas(에러 없이 안 보임). (SKILL 예제·`defaultLottie()` 확인.)
- **색상 = 0~1 정규화 RGBA**(0~255 X). keyframe scalar 도 `s` 배열 형태.
- **필수 top-level**: `v`·`fr`·`ip`/`op`·`w`/`h`. 유효 JSON(주석·trailing comma X), `node -e JSON.parse` 검증.

## 6. ⚠ 가드 & 학습→반영 (학습→반영 루프)

- **infra 가드**: 앱 자체(SolidJS·canvaskit-wasm 설치)는 온디맨드 — Lottie 산출이 *실제 필요할 때만* `degit` 로 스캐폴드. 상시 vault 도입 X(infra-0).
- **반영 #1 (즉시)**: 검증 프로토콜(`?frame` 핀 + `/__context` 읽기 + 3프레임 스윕 + 아티팩트 헌팅) = agent-harness H-14 modality 의 *Lottie/시각 산출* 인스턴스로 연결.
- **반영 #2 (조건부)**: html-publish/creative 에서 Lottie 인터랙션 필요 시 — *이 하네스가 정답 경로*(comnyang식 hand-rolled lottie-web 스크롤 X → skill+Skia 검증). 트리거 = 작가 포트폴리오/게임UI 에 Lottie 모션 실제 채택 시.
- **반영 #3 (즉시·메타)**: GPT 외주가 *repo 미독 일반지식 합성 → confirmed 박제* 한 사고 사례. verifier-claims-need-regate·연구 충실통독 규율 재확인 — 외주 산출의 "정체 자체 오분석"은 ③Gate 에서 *repo 1차 대조* 없이 못 잡는다.
