---
created: 2026-07-04
updated: 2026-07-04
type: learning
tags: [agent-harness, mobile, accessibility, tooling]
source: https://github.com/lycorp-jp/sim-use
authors: [lycorp-jp]
year: 2026
category: method
---
<!-- sim-use: iOS/Android 화면을 accessibility outline + @N alias handle로 압축해 LLM에 노출하는 모바일 agent 하네스. browser-harness/video-use의 형제. -->
# sim-use — 모바일 화면을 "structured perception + action handle"로 압축하는 agent 하네스

> 흡수 대상 = **패턴(원칙)**, 도구 자체 아님. sim-use는 새 agent 아키텍처도 AI NPC 인지 시스템도 아니다 — vault 기존 [browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness](browser-harness.md) / [video-use — 영상을 *읽는* 에이전트 스킬](video-use.md) / [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md)와 같은 *structured-perception 계열*의 모바일 modality 형제다. Codex read-only teardown → vault Claude ③Gate 통과 후 승격.

## 한 줄 요약

sim-use(github lycorp-jp/sim-use)는 Swift CLI로 iOS Simulator·Android 화면을 raw screenshot이 아니라 **accessibility tree → token-compressed outline**으로 LLM에 노출하고, outline의 `@N` alias를 그대로 `tap @N` 같은 action handle로 되돌려주는 도구다. LLM agent 자체가 아니라 *agent가 쓰는 mobile observation/action substrate*.

계열 위치:
- [browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness](browser-harness.md) — browser/CDP surface
- [video-use — 영상을 *읽는* 에이전트 스킬](video-use.md) — transcript + timeline surface
- [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md) — deterministic trace/test as sensor
- **sim-use** — iOS Simulator / Android accessibility surface + HID/bridge action

## 핵심 알맹이 3

### 1. Structured perception — accessibility tree → compact outline

iOS 경로: `AccessibilityFetcher → typed AccessibilityElement tree → OutlineFormatter → text outline + structured entries/lists → OutlineCache`. raw AX tree를 그대로 주지 않고 `App: ...`, `[Top]`, `[Content]`, `@N Button "..."` 같은 압축 outline으로 바꾼다. README는 `~16x` compaction / `~300ms`를 주장(**source-reported, 미검증** — 이번 teardown에서 live device 측정 X. 코드 구조상 방향은 타당).

Android는 host에서 직접 tree를 긁지 않고 기기 안에 bridge APK를 설치: `android init`(bridge APK 설치 → AccessibilityService 활성 → on-device HTTP server 기동 → adb-shell ContentProvider로 bearer token → adb forward) 후 `ui`가 `GET /a11y_tree_full` → AndroidOutlineRenderer → OutlineCache.

### 2. Selector ladder + observe-act-verify hard loop

action은 2종:
- **cache-backed alias** (`@N`, `#N`, `#N@M`) — 직전 `ui` 결과에서 resolve. 최속, 단 stale 위험.
- **live selector** (`#<id>`, `--label`, `--value`, regex/contains) — 느리지만 안정.

selector ladder 우선순위: `@N`(fast) → `#<id>`(stable) → label/value/regex → raw coordinate(fallback). 번들 skill 문서도 같은 우선순위를 가르친다.

**⚠ 핵심 한계가 코드에 박혀 있음**: `OutlineAliasResolver`는 "**drift detection 없음(BY DESIGN)**"을 명시한다. 즉 `tap @N`은 *직전 screen에 대해서만* 안전하다. 화면이 바뀌면 alias가 다른 것을 가리킬 수 있다. 따라서 **action 뒤 반드시 `ui`/screenshot으로 재검증(observe → act → verify)이 강제**다. navigation 후 `ui` 재실행이 규칙(repo `pitfalls.md`).

### 3. Side-effect retry discipline

mobile command는 side effect(tap/type이 두 번 들어가면 안 됨)가 있으므로, per-device daemon이 request 수신 여부가 불확실할 때 **자동 재실행을 거부**한다(ambiguous post-delivery failure 시 no auto-resend). JSON envelope는 `{"ok":true,"data":...}` / `{"ok":false,"error":...,"hint":...}`로 통일. crash banner 감지 시 자동 relaunch 없이 STOP·사용자 보고.

## 한계 / Red Flags

1. **Accessibility-blind** — canvas/gameplay/3D/WebGL scene은 accessibility tree에 안 잡혀 semantic outline이 빈약. 게임 플레이 자동화엔 raw coordinate fallback 수준으로 전락.
2. **무거운 build 의존** — fresh clone에 `build_products/XCFrameworks` 없음 → `swift test` 실패(이번 teardown 실측). idb-derived Meta FB XCFrameworks(`FBControlCore`/`FBDeviceControl`/`FBSimulatorControl`/`XCTestBootstrap`)를 `./scripts/build.sh dev`로 선행 빌드해야 함. CI도 Xcode 26.x 고정(Xcode 27 SimulatorKit 제거 회피).
3. **Android bridge 권한 표면** — loopback binding(127.0.0.1)·bearer token·shell UID-gated ContentProvider·0600 host cache는 있으나, ADB + AccessibilityService + on-device HTTP server 조합. 개발용 emulator/기기 전제. 개인 실기기에 `android init` 금지(작가 명시 승인 없이).
4. **autonomous agent 아님** — planner/reasoner/repair loop 없음. agent runtime이 아니라 agent가 쓰는 도구.
5. `@N` alias staleness = #2와 동일한 항구적 위험.

## 학습→반영 루프 (Apply-or-Park)

CLAUDE.md §학습→반영 루프 exit 강제 = 3-way 택1. 본 학습의 판정:

- **(a) 원칙만 반영 — game work (hwigi-tower)**: 도구 채택 X. 가져올 것은 **원칙 1줄** —
  > *raw frame을 LLM에 던지지 말고, 게임 state를 `scene graph + interactable ids + recent event ledger + screenshot on demand`로 압축하라.*
  또한 observe-act-verify + STOP + selector-ladder-with-named-risk 패턴은 어떤 UI 자동화에도 이식 가능. 이는 sim-use 도구가 아니라 [browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness](browser-harness.md)/[Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md)가 이미 vault에 세운 structured-perception 원칙의 모바일 재확인이다.
- **(b) PARK — 모바일 smoke-QA**: hwigi-tower/모바일 빌드의 로그인·설정·메뉴·스토어·튜토리얼 *native UI* smoke test(accessibility 붙은 화면 한정)를 backlog로 파킹. **지금 도입 X**. 트리거: *실제 모바일 빌드 QA 니즈 발생 + accessibility label 존재 확인 시*. 도입 시에도 sandbox(iOS Simulator 1개 smoke → Android는 별도 emulator만) 순서, Unity/게임 화면엔 기대 금지.
- **(c) 순수참조 격리**: gameplay/Unity/3D 자동화 적용성 = 낮음(4/10, source-reported). NPC 인지·행동 평가엔 무관 — 순수 지식으로만 보존.

## Skill Candidate (보류 — 작가 승인 대기)

Codex가 `mobile-simulator-agent-harness-teardown` 스킬 후보를 제안(basis: paper-study·browser-harness·video-use·playwright-e2e-agent-harness). **미승격** — 모바일 QA 니즈가 실제로 반복될 때 재검토(현재 infra-0 유지, Karpathy #2).

## Source Anchors (Codex clone, commit a8bd3da, 2026-07-03)

- `Package.swift:7,155-169` — macOS 14+ package, local binary XCFramework targets.
- `Sources/SimUseCore/PlatformRouter.swift:29-60` — UUID→iOS / emulator·serial→Android 라우팅.
- `Sources/iOSSimBackend/Normalizer/OutlineFormatter.swift:366-453` — outline text 렌더 + `@N`/`#N`/`#<id>` 라인 포맷.
- `Sources/SimUseCore/OutlineAliasResolver.swift:114-241` — alias parse/resolve (drift detection 없음 명시).
- `Sources/AndroidBackend/Verbs/AndroidDeviceController.swift:146-184` — 6-step bridge bootstrap.
- `bridge/.../HttpServer.kt:48-65` — 127.0.0.1 바인딩; `ActionRouter.kt:76` — non-ping endpoint 인증 요구.
- `Sources/SimUseCore/Daemon/DaemonClient.swift:127-138` — ambiguous 전달 실패 시 no auto-resend.
- `skills/sim-use/SKILL.md:22-52,104-113` — observe-act-verify loop, STOP 조건.
- 원본 packet: `~/Documents/Codex/2026-07-04/sim-use-analysis/outputs/` (RETURN + asset + SHA256SUMS).
