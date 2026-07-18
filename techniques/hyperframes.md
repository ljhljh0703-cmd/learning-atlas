---
created: 2026-05-25
updated: 2026-06-16
type: learning
tags: [html, animation, video-rendering, agent-first, gsap, ffmpeg, puppeteer, deterministic, frame-adapter]
source: https://github.com/heygen-com/hyperframes
category: technique
---

# Hyperframes — HTML→Video 결정론적 렌더링 프레임워크

> *"Write HTML. Render video. Built for agents."* — Heygen (20k★, Apache-2.0, 2026-03 공개)
> 본질: 에이전트가 HTML을 작성하면 결정론적으로 비디오로 렌더링되는 프레임워크. AI-first 워크플로우의 *레퍼런스 구현*.

관련 — [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](../methods/hyperframes-skill-pattern.md) (운영 메타 패턴 추출) · [Unity ML-Agents — Unity 환경을 RL 학습장으로 쓰는 오픈 툴킷](unity-ml-agents.md) (결정론적 시뮬레이션 사상 공통) · [Parcae — Stable Looped Language Models](parcae-looped-lm.md) · [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](hermes-agent.md) (skill 자가성장) · graphify (작가 vault 의 skill 운영 패턴) · [광고·영상 제작 파이프라인 (실전)](ad-video-production-pipeline.md) · design-index

> 🔄 **2026-06-16 clone 전문 재검증**: 본 페이지 본문(§1~5)은 *충실*하나 repo가 크게 진화해 드리프트 — **skills 14→16종(목록·아키텍처 재편)**, **packages 8→11**(+gcp-cloud-run·sdk·sdk-playground), 설치 `npx skills add heygen-com/hyperframes`, Node 22+. **신개념 `frame.md` 추가**(↓ §2.5, 우리 디자인+광고영상 작업 직결). §6 skills·§4 packages 갱신. 본문 코어(frame-adapter·결정론·파이프라인)는 유효.

## 2.5 🆕 frame.md — design.md를 *카메라용으로 뒤집은* 스펙 (2026-06-16 신규, 핵심)

> repo 명제: *"모든 브랜드엔 design.md가 있다. 그런데 카메라용으로 쓰인 건 없다."* `frame.md` = 웹 컨텍스트 디자인 스펙을 *프레임용으로 반전* — 같은 토큰·룰을 AI가 *영상*을 구성할 수 있게 재작성한 **DESIGN.md superset**.

- **정체**: design.md와 *같은 포맷*, 단 영상 medium 기준(scale·web chrome 제거·프레임 밀도). 항상 소문자 `frame.md`(FRAME.md 변이 없음).
- **precedence**: `frame.md` → `design.md` → `DESIGN.md`. 영상/hyperframes 프로젝트는 frame.md가 우선·복수 존재 시 승리.
- **핵심 원칙**(README): "Atoms stay sacred. Composition stays free. Numbers come from the script." (토큰=불가침, 구성=자유, 수치=스크립트서).
- **hyperframes-creative 스킬**이 처리: `references/video-composition.md`(영상 밀도 — "produced, not generated": 8-10 요소/씬·data bar·registration mark·monospace readout)·`house-style.md`("프롬프트 해석해 *진짜 콘텐츠* 생성, 웹페이지처럼 X")·`design-adherence.md`(사후 스펙 검증).
- **🌟 우리 작업 직결**: ParkDal `_tokens.css`/`parkdaldesign.md`(웹 design.md) → **frame.md(영상 반전)** → [광고·영상 제작 파이프라인 (실전)](ad-video-production-pipeline.md)(실제 제작). 즉 작가 광고영상이 ParkDal 톤을 유지하며 영상화하는 *공식 다리*. design.md→frame.md 반전이 design-index §7 "html+ppt 파생"의 *영상 축* 확장. (도입 시 ad-storyboard 실제 영상 단계에서 frame.md 생성.)
- design 템플릿 갤러리: hyperframes.dev/design (Biennale Yellow·BlockFrame·Broadside·Cobalt Grid·Coral 등) — frame.md 예시집.

---

## 1. 정체성과 차별점

| 구분 | Hyperframes | Remotion (경쟁) |
|---|---|---|
| 작성 언어 | 순수 HTML + `data-*` 속성 | React/JSX/TSX |
| 라이센스 | Apache-2.0 (완전 오픈) | Source-available, 유료 라이센스 |
| 빌드 스텝 | 없음 | 있음 |
| 타겟 | AI 에이전트 (primary) + AI-assisted 인간 | 개발자 |
| 명제 | "에이전트는 이미 HTML을 말한다" | React 생태계 통합 |

핵심 베팅 — **DSL 0**. proprietary syntax 없이 브라우저가 이미 가진 시멘틱(HTML/CSS/JS)을 그대로 활용.

---

## 2. 핵심 통찰 4선

### 🎯 통찰 1 — Frame Adapter Pattern (기술적 정수)

모든 애니메이션 런타임(GSAP/CSS/Anime.js/Lottie/Three.js/WAAPI)을 *하나의 계약*으로 묶음.

> **"What should the screen look like at frame N?"**

각 런타임은 wall-clock(실시간)으로 *재생*되는 대신 **seek-driven** 으로 전환됨. 호스트가 프레임 번호를 던지면 어댑터가 그 시점의 DOM 상태를 반환.

```typescript
// 결정론적 시킹 (floating-point drift 차단)
normalizedFrame = clamp(Math.floor(frame), 0, durationFrames);
t = frame / fps;  // wall-clock 금지 — 캐노니컬 클럭

// 런타임별 어댑터 메서드
GSAP:     timeline.seek(timeSeconds)
CSS:      Animation.currentTime = ...  (paused negative-delay fallback)
Anime.js: instance.seek(timeMs)
Lottie:   goToAndStop(timeMs, false)
```

**오케스트레이션 루프** (전체 렌더링이 이 한 덩어리):

```typescript
await adapter.init?.({ compositionId, fps, width, height, rootElement });
const durationFrames = adapter.getDurationFrames();

for (let frame = 0; frame <= durationFrames; frame += 1) {
  await adapter.seekFrame(frame);  // 어댑터가 DOM 갱신
  // Puppeteer가 픽셀 캡처 → FFmpeg 스트림으로 인코딩
}
```

**왜 중요한가** — 게임 AI 의 *deterministic simulation* 사상과 동일. 시드 고정 + 시간 추상화 = 재현 가능. 강화학습 환경 설계에 그대로 적용 (Phase 4 Microfish 시뮬레이션 직결, roadmap 참조).

### 🎯 통찰 2 — HTML이 SSOT (DSL 없음)

순수 HTML + `data-*` 속성. 빌드 스텝 0. 컴포지션의 *모든 상태* 가 HTML에 노출.

```html
<div id="stage"
     data-composition-id="my-video"
     data-width="1920" data-height="1080" data-duration="9">

  <video class="clip" id="clip-1"
         data-start="0" data-duration="5" data-track-index="0"
         src="intro.mp4" muted playsinline></video>

  <img class="clip" id="overlay"
       data-start="2" data-duration="3" data-track-index="1"
       src="logo.png" />

  <audio data-start="0" data-duration="9" data-track-index="2"
         data-volume="0.5" src="music.wav"></audio>

  <script>
    const tl = gsap.timeline({ paused: true });  // 필수: paused
    tl.from("#overlay", { opacity: 0, duration: 1 });
    window.__timelines["my-video"] = tl;  // 필수: 글로벌 등록
  </script>
</div>
```

룰의 본질 — *"브라우저가 이미 가진 시멘틱을 활용, 새 DSL 안 만든다"*. 에이전트 친화의 진짜 이유는 "agents already speak HTML".

### 🎯 통찰 3 — Agent-First 운영 패턴 5종 세트

작가의 vault 운영에 직접 차용 가능한 *문서 아키텍처*가 정확히 5개 파일.

| 파일 | 역할 | 작가 vault 대응 |
|---|---|---|
| `AGENTS.md` | 모든 코딩 에이전트 공용 컨벤션 (bun, oxlint, conventional commits, 결정론 규칙) | 이미 보유 ✅ |
| `CLAUDE.md` | Claude 특화 (이 repo 에선 *shim* 으로 AGENTS.md 참조) | 이미 보유 ✅ |
| `DESIGN.md` | 디자인 시스템 (color tokens, typography, spacing) — Style Guide 와 동급 권위 | **없음** ⚠️ |
| `DOCS_GUIDELINES.md` | 문서 작성 규약 | **없음** ⚠️ |
| `skills/<name>/SKILL.md` | 도메인별 자율 실행 프롬프트 (skills/hyperframes/SKILL.md 가 정수) | 부분 보유 (graphify, html-publish 등) |

→ 작가 vault 는 위성 패턴(SSOT/brief/agenda/journal/progress)이 잘 짜여있지만, **`DESIGN.md` 등가 (vault 의 시각·문서 스타일 SSOT)** 가 비어 있음. html-publish 가이드가 부분 대체 중.

### 🎯 통찰 4 — Skill 의 *5-step 강제 워크플로우*

`skills/hyperframes/SKILL.md` 가 에이전트에게 부과하는 프로토콜 — 자세한 분해는 [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](../methods/hyperframes-skill-pattern.md) 참조.

```
1. Discovery       → 청중·플랫폼·우선순위 확정 (= Karpathy #1 Surface Assumptions)
2. Design System   → design.md 의무 확인 (Hard Gate: "#333 / Roboto 손대면 실패")
3. Prompt Expansion → 브랜드·하우스 스타일 기준으로 의도 grounding
4. Plan             → scene/track/rhythm/timing/layout 선언 후 코드
5. Layout Before Animation → hero frame 정적 HTML+CSS 먼저, 그 다음 GSAP
```

→ 이게 작가의 *위성 패턴 (brief→agenda→외부 LLM 디벨롭[당시 Gemini]→확정→SSOT 반영)* 의 *세부 강제 버전*. SKILL.md 가 에이전트의 *행동 헌법*.

---

## 3. HTML 애니메이션 작성 룰

### 비강요 룰 (Determinism 위반 시 렌더링 실패)
- ❌ `Date.now()`, `Math.random()`, `fetch()` — 시간·외부 의존
- ❌ `repeat: -1` (무한 반복) → 유한 반복 명시
- ❌ `visibility`, `display` 애니메이션, `play()`/`pause()`/`seek()` 호출
- ❌ async/await 안에서 timeline 빌드 (페이지 로드 시점에 동기 빌드)
- ❌ 같은 속성을 여러 timeline 에서 동시 애니메이션

### 강요 룰
- ✅ Clip 은 `class="clip"` + `id` + `data-start` + `data-track-index`
- ✅ Composition 은 `data-composition-id` + `data-width/height/duration`
- ✅ `<video>` 는 `muted playsinline`, 오디오는 별도 `<audio>` (브라우저 정책)
- ✅ Sub-composition 은 `<template>` 으로 감싸기. 루트는 감싸지 *말 것*
- ✅ Timeline 은 `{ paused: true }` 로 빌드 + `window.__timelines["<id>"] = tl` 등록
- ✅ Duration 은 `data-duration` 이 권위, GSAP timeline 길이는 secondary
- ✅ Layout 정적 HTML+CSS 먼저 → 그 다음 `gsap.from()` 으로 *진입 모션* 만 추가 (CSS = 최종 상태 SSOT)
- ✅ 첫 애니메이션은 `t=0` 이 아니라 `0.1-0.3s` offset (캡처 안정성)
- ✅ 결정적 PRNG 필요하면 시드 기반 (mulberry32 등)

### 멀티 씬 룰
- ✅ 씬 간 **항상** 트랜지션 (jump cut 금지)
- ✅ 모든 씬에 entrance 애니메이션 (`gsap.from()`)
- ❌ 중간 씬에 exit 애니메이션 금지 (트랜지션이 exit 역할)
- ✅ 최종 씬만 `gsap.to(..., { opacity: 0 })` 허용

---

## 4. 파이프라인 아키텍처

### 패키지 11종 (2026-06-16 — +gcp-cloud-run·sdk·sdk-playground)
```
packages/
├── core              # 타입·파서·린터·런타임·frame adapter (두뇌)
├── engine            # Puppeteer + FFmpeg seekable capture (실행기)
├── producer          # capture + encode + audio mix 풀 파이프라인
├── player            # 임베드 <hyperframes-player> 웹 컴포넌트
├── studio            # 브라우저 composition 에디터 (React 18)
├── cli               # init/add/preview/render/lint/validate/inspect 등 (npm: hyperframes)
├── shader-transitions # WebGL 트랜지션 컴포넌트
├── aws-lambda        # 서버리스 분산 렌더링(SDK+배포)
├── gcp-cloud-run     # 🆕 GCP Cloud Run 렌더 경로
├── sdk               # 🆕 SDK
└── sdk-playground    # 🆕 SDK 플레이그라운드
```
(registry 블록은 top-level `registry/` — flash-through-white·instagram-follow·data-chart 등. Node 22+, Git LFS로 golden mp4 ~240MB.)

### 데이터 흐름
```
[ HTML composition + assets ]
            │
            ▼
[ lint ] ── 구조 검증 (data-* 속성 누락 등, hyperframeLint.ts)
            │
            ▼
[ validate ] ── 헤드리스 Chrome 으로 JS 에러·누락 에셋 검사
            │
            ▼
┌─────────────────────────────────────────┐
│  engine (Puppeteer 헤드리스 Chrome)      │
│  ┌─────────────────────────────────────┐│
│  │ for frame in 0..durationFrames:     ││
│  │   adapter.seekFrame(frame)          ││
│  │   screenshotService → frame buffer  ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
            │ (raw frames stream)
            ▼
[ FFmpeg streamingEncoder ] ── h.264/h.265/VP9/ProRes
            │
            ▼
[ FFmpeg audioMixer ] ── 트랙별 delay+volume+amix
            │
            ▼
[ output.mp4 ]
```

핵심은 **engine** 의 단순함. 100라인 정도의 시킹 루프가 전부. 복잡도는 *adapter 계층* 에 격리.

---

## 5. 세부 메커니즘 (코드 직접 확인)

### 5.1 FFmpeg 인코딩 (`engine/services/streamingEncoder.ts`)

| 항목 | 값 |
|---|---|
| 코덱 | libx264 / libx265 / libvpx-vp9 / prores_ks (선택 가능) |
| 기본 CRF | **23** (libx264/libx265) |
| 프리셋 | **medium** (software), NVENC/QSV/VAAPI/VideoToolbox GPU 인코더 매핑 |
| 픽셀 포맷 | yuv420p (기본), yuva420p (VP9 alpha), yuv420p10le (HDR PQ/HLG) |
| 프레임레이트 | rational FPS → `fpsToFfmpegArg()` 변환, 입출력 모두 명시 |
| 특수 옵션 | h.264 `-bf 0` (B-frame off, 호환성), `scale=in_range=pc:out_range=tv`, `aq-mode=3` (anti-banding) |
| HDR | mastering display + MaxCLL/MaxFALL SEI |

→ 작가가 직접 ffmpeg 쓸 때 default-good 한 값들. CRF 23 + medium preset = 품질·속도 균형 표준.

### 5.2 Audio Sync (`engine/services/audioMixer.ts`)

- **시킹 정밀도** — *millisecond* (샘플 정밀 아님). `track.start * 1000` → `adelay=${ms}|${ms}`
- **다중 트랙 믹스** — FFmpeg filtergraph `[a0][a1]...[aN]amix=inputs=N:duration=longest`
- **트랙 길이 미스매치** — 짧으면 `apad` (무음 패딩), 길면 `atrim=0:${duration}` (트리밍). 루핑 X
- **트랙별 처리** — trim + volume + delay 개별 적용 후 합성

→ 영상은 frame-perfect, 오디오는 ms-perfect. 비디오 24fps 기준 1 프레임 ≈ 41ms. 일반 영상에선 체감 불가.

### 5.3 Lambda 분산 (`aws-lambda/handler.ts` + `producer/distributed.ts`)

**Step Functions 3-stage state machine, 단일 Lambda 가 액션 디스패치**:

1. **Plan** — composition 분석, duration 프로빙, 렌더링 계획 생성. 옵션으로 오디오 사전 생성. `plan.tar.gz` + `audio.aac` 를 S3 prefix 에 업로드.
2. **RenderChunk** (parallel) — *프레임 단위 아닌 청크 단위* 분산. Step Functions `Map state` 가 청크 인덱스별로 Lambda 동시 호출. 각 워커는 plan hash 로 동일 스펙 보장.
3. **Assemble** — 청크 + 오디오 stitching, 최종 산출물 S3 업로드.

**안전성** — Plan dir 의 content-addressed hash + chunk-by-chunk 결정론으로 *byte-identical retry* 가능 (Temporal / Step Functions / Lambda 에서 안전 재시도).

**핵심 설계** — handler 는 *thin glue*. 무거운 작업(캡처·인코딩)은 OSS primitive 안에. 어댑터 계층이 AWS/Temporal/K8s 통합 격리. 즉 *프레임워크 의존성 없는 분산 가능*.

→ Karpathy #2 (Simplicity First) 의 정수. 라이브러리 코어는 *pure functions on local file paths*, 네트워킹은 어댑터.

### 5.4 Sub-composition 변수 격리 (`docs/concepts/variables.mdx`)

3-tier precedence (낮음 → 높음):

1. **Declared defaults** — `data-composition-variables` JSON 의 default
2. **Per-instance overrides** — sub-comp 호스트 요소의 `data-variable-values`
3. **CLI flag** — `npx hyperframes render --variables '{...}'`

상위 계층이 하위 override. 누락 키는 fallthrough.

**격리** — 런타임이 각 sub-composition 인스턴스마다 *자동 스코프 격리*. 카드 컴포넌트를 5번 박아도 5개 별개 스코프.

**제약** — CLI override 는 *최상위 composition 만*. Sub-comp 변수는 호스트 요소에서만 컨트롤.

```html
<div data-composition-src="compositions/card.html"
     data-variable-values='{"title":"Pro","color":"#ff4d4f"}'></div>
```

### 5.5 Studio (`packages/studio/`) — 부분 확인

React 18 (`createRoot`) + 50-event 캡 telemetry 레이어. composition asset 404 필터링. HMR 설정·timeline scrub 동기화 메커니즘은 entry point 만으로는 미확인 — 빌드 설정(vite.config.ts) + service layer + playback utility 추가 조사 필요.

→ 본 분석 범위에선 **gap** 으로 명시. 작가가 실제 studio 차용 시 추가 발굴.

---

## 6. Agent 운영 아키텍처 — Plugin 3중 지원

`.claude-plugin/` / `.codex-plugin/` / `.cursor-plugin/` 세트로 *세 환경 모두* 마켓플레이스 등록. 동일 `skills/` 디렉터리를 세 환경이 다르게 디스커버.

### Skills 16종 (2026-06-16 재편 — 런타임별→워크플로/영상타입별)
> **아키텍처 전환**: 구 버전의 *런타임별 스킬*(gsap/animejs/css/lottie/three/waapi/tailwind/typegpu)이 **`hyperframes-core`(HTML 계약)·`hyperframes-animation`(전 모션 지식)·`hyperframes-creative`(디자인/내러티브)** 3종으로 *통합*됨. 대신 *영상 타입별 워크플로* 스킬이 신설.

| Skill | 역할 |
|---|---|
| `hyperframes` | 진입 허브(production loop) |
| `hyperframes-core` | HTML composition 계약(data-*·clip·track·sub-comp·variables) |
| `hyperframes-animation` | 전 애니메이션 지식(atomic motion·scene blueprint·transition) — 구 런타임별 통합 |
| `hyperframes-creative` | 비-애니 크리에이티브 — **frame.md/design.md 처리**·팔레트·타이포·내러티브·beat |
| `hyperframes-cli` | CLI dev loop(init/add/lint/validate/inspect/preview/render…) |
| `hyperframes-media` | 멀티 provider TTS(HeyGen/ElevenLabs/Kokoro local)·BGM·전처리 |
| `hyperframes-registry` | registry 블록 설치 |
| `motion-graphics` | 모션그래픽(kinetic type 등) |
| `graphic-overlays` | 재생 영상 위 디자인 오버레이 카드 |
| `embedded-captions` | talking-head 자막(32 visual identity · 2 engine) |
| `faceless-explainer` | 텍스트→내레이션+오디오+섹션 영상 |
| `general-video` | 범용 영상 워크플로 |
| `product-launch-video` | 제품 런칭 영상 |
| `pr-to-video` | GitHub PR → 영상 |
| `website-to-video` | URL/사이트 → 영상 |
| `remotion-to-hyperframes` | Remotion(React) → HTML 포팅 |

→ *얇은 슬라이스*에서 **영상 타입별 end-to-end 워크플로 + 코어/애니/크리에이티브 3분할**로 진화. 콜 사이트 자연어(`/hyperframes`). [광고·영상 제작 파이프라인 (실전)](ad-video-production-pipeline.md)의 영상 타입(launch/faceless/captions/overlay)과 직접 대응.

---

## 7. 작가 vault 차용 항목

확정 차용 2종 — [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](../methods/hyperframes-skill-pattern.md) 페이지로 상세 분리.

| # | 차용 | 상태 |
|---|---|---|
| 1 | 5-step Skill 워크플로우 위계화 | ⏸ 스킵 (2026-05-25) — html-publish 가 이미 80% 등가 구현 + user_authored 잠금. ROI 0. [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](../methods/hyperframes-skill-pattern.md) 만 학습 자산으로 보존 |
| 2 | DESIGN.md 신설 (vault 시각·문서 SSOT) | ✅ 2026-05-25 — design-index (provisional) 신설 |
| 3 | Hard Gate 패턴 | ✅ methods/ 페이지에 포함 |
| 4 | 결정론 룰 → RL 환경 설계 | 🟡 roadmap Phase 4 시점에 차용 |
| 5 | Skill 얇은 슬라이스 원칙 | 🟢 참조용, 적극 차용 미정 |

---

## 8. 의문점 / 추후 조사

| 영역 | 상태 |
|---|---|
| FFmpeg 인코딩 옵션 | ✅ 확인 (§5.1) |
| Audio sync 정밀도 | ✅ 확인 (§5.2, ms-level) |
| Lambda 렌더링 분산 | ✅ 확인 (§5.3, chunk-based Map state) |
| Sub-composition 변수 격리 | ✅ 확인 (§5.4, 3-tier precedence) |
| Studio hot-reload 메커니즘 | 🟡 부분 확인 (§5.5, 추가 발굴 필요) |

---

## 9. 출처

- [GitHub - heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) (Apache-2.0)
- `README.md`, `AGENTS.md`, `CLAUDE.md`, `skills/hyperframes/SKILL.md`
- `docs/quickstart.mdx`, `docs/concepts/frame-adapters.mdx`, `docs/concepts/compositions.mdx`, `docs/concepts/variables.mdx`
- 코드: `packages/engine/src/services/{streamingEncoder, audioMixer}.ts`, `packages/aws-lambda/src/handler.ts`, `packages/producer/src/distributed.ts`, `packages/studio/src/main.tsx`
