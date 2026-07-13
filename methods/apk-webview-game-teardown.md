---
created: 2026-07-04
updated: 2026-07-04
type: learning
tags: [reverse-engineering, apk, webview, unity, game-teardown, ip-guardrail]
year: 2026
category: method
---
<!-- APK/WebView 게임 정적 해체 방법론 (IP 가드레일 박제 — 제3자 콘텐츠 0, 기법만 추상 기술) -->

# APK/WebView 게임 정적 해체 방법론

*출처: Codex APK 역기획 세션(2026-07-04) 방법론 추출. **이 노트는 방법론만 담는다** — 특정 제3자 앱의 콘텐츠 표·함수 맵·번들 모델 테이블은 일절 옮기지 않는다(§6 IP 가드레일).*

> ⚠️ **METHODOLOGY ONLY / IP-GATED.** 자원·가구·레시피 개수, 함수명, 번들 모델 구조 등 제3자 산출물의 *내용*은 이 노트에 존재하지 않는다. 아래는 재현 가능한 *절차*와 판정 기준의 추상 기술이다.

## 0. 목적

배포된 Android APK(특히 WebView 래핑 게임)를 **정적으로** 해체해 (a) 엔진/래퍼 정체, (b) 릴리스 준비 상태, (c) 아키텍처·루프 형태를 clean-room 으로 파악하는 절차. 산출은 학습 자산화이며 proprietary source 재구성/복제가 아니다.

## 1. 절차 (6단계)

### (1) 소스 확보 + 해시 락
- 컨테이너/APK 를 다운로드하고 즉시 **SHA-256 을 기록**한다(container, APK, 내부 JS/CSS 번들 각각). 이후 모든 분석은 이 해시로 고정된 아티팩트 기준 — 재현·증거 정직성의 앵커.

### (2) `aapt dump badging` / `xmltree` — 매니페스트 정적 판독
- `badging`: package 이름, label, **target SDK**, launch Activity 확인.
- `xmltree` (AndroidManifest): `debuggable`, `allowBackup`, `extractNativeLibs` 플래그 + 선언된 권한(permissions) + Activity/Provider/Receiver 목록.

### (3) `apksigner verify --verbose --print-certs` — 서명 검증
- v2 서명 검증 통과 여부 + **서명 인증서가 debug 인증서인가 release 인증서인가**를 판정. debug cert = 스토어 배포 불가 신호.

### (4) `zipinfo -1` on `lib/` — native-ABI vs WebView 분류
- 아카이브에 `lib/` native 라이브러리 엔트리가 **있으면 native ABI 게임**(Unity/Godot/libGDX 등), **없으면 WebView 래퍼** 후보.
- WebView 래퍼면 assets 내 정적 웹 자산(`index.html`/JS/CSS)의 존재·서빙(HTTP 200)으로 Capacitor/Cordova 계열 신호를 잡는다. native 모듈 부재 + Capacitor/Cordova runtime + 얇은 MainActivity = WebView 래퍼 판정.

### (5) 엔진/래퍼 결정 트리 + 릴리스 준비 WARN 리스트
- **결정 트리**: native ABI 有 → 네이티브 엔진 분기(Unity/Godot/libGDX) / native ABI 無 + 웹 자산 有 → WebView 래퍼(Capacitor/Cordova) / 그 외 → 추가 조사.
- **릴리스 준비 WARN(추상)**: debug 빌드로 서명됨 · 실제 원격 API 가 없는데 `INTERNET` 권한 선언 · `allowBackup=true` 미검토 · 외부 CDN 자산(폰트 등) 404 · 스토어/릴리스 미준비.

### (6) IP 가드레일 (박제) — 아래 §6

## 2. 도구 가용성 한계 (정직 기록)

정적 매니페스트/서명/아카이브 분석은 `aapt`·`apksigner`·`zipinfo` 로 충분히 수행된다. 그러나 다음은 이번 방법론 검증에서 **NOT RUN**: 에뮬레이터/실기기 설치 스모크, 동적 렌더 QA, `jadx`/`apktool` 풀 디컴파일(PATH 부재). 즉 이 방법론은 **정적 해체**를 커버하며 동적/풀 디컴파일은 별도 도구 확보가 전제다.

## 2.5 Unity Mono 빌드 분기 (BA_TCG delta 2026-07-04)

WebView 래퍼가 아니라 **native 엔진(Unity)** 으로 판정되면 정적 해체 경로가 갈린다:
- **Unity Mono 빌드**: `Assembly-CSharp.dll` 을 `ilspycmd`(ILSpy) 등으로 managed 디컴파일 → 클래스/메서드 *역할*·규칙 상수·카드/데이터 카탈로그의 *개수·구조*만 추출. ZIP SHA-256 락 → `unzip -t` 무결성 → `app.info`(회사/제품명) → 디컴파일 순. (BA_TCG 0.11 = Unity Mono, 48k+ 줄 디컴파일 실증.)
- **Unity IL2CPP 빌드**: managed 디컴파일 불가(네이티브 컴파일) → 난이도 급상승, 별도 도구(Il2CppDumper 등) 전제.
- **§6 IP 가드 그대로 적용**: 디컴파일해도 *역할·구조·개수·앵커*만 — 카드 텍스트·전체 코드·저작권 콘텐츠(예: 팬게임의 원작 IP 테마 자산)는 vault 반입 금지. 라이선스 미확인 팬빌드는 케이스 태그 1줄까지만.

## 2.6 영상 인테이크 병행 (BA_TCG YouTube 데모, 2026-07-06 delta)

정적 빌드 디컴파일과 별개로, 팬게임 공개 데모 **영상**을 병행 인테이크하면 UI/UX·릴리스 신호·유저 피드백을 IP 위험 없이 추가 확보 가능:

- **파이프라인**: yt-dlp 메타데이터/영상 다운로드 → ffprobe(해상도·코덱·길이) → 1fps 프레임 추출 → scene-change 프레임 분리 → contact sheet 합성 → 선별 프레임 tesseract OCR(스타일라이즈 UI 텍스트는 노이즈 많음 — PARTIAL 감안) → 댓글 캡처(유저 리서치 입력이지 규칙의 authority 아님).
- **소스 락 권고**: YouTube 메타데이터/영상/댓글 파일 + (허용 시) 링크된 빌드 파일을 SHA-256 으로 락한 뒤 분석 착수.
- **clean-room 카테고리 분리** — §6 IP 가드에 대응하는 영상 인테이크판: `observed behavior`(영상에서 직접 관찰) / `inferred system`(관찰로부터 추론) / `source-reported`(제작자 설명·description) / `comment-reported`(댓글 — 미검증) / `forbidden IP content`(카드 원화·텍스트·캐릭터 자산 — vault 반입 금지). 5분류로 evidence 등급을 명시적으로 나눠 §6 위반(구현물 그대로 옮겨적기)을 막는다.
- **정적+영상 결합 이점**: 정적 디컴파일이 클래스/구조/개수를 주는 반면, 영상은 보드 레이아웃·턴 전환 피드백·카드/컬렉션 UI·FX/컷인 패턴·릴리스 준비도·팬 피드백(모바일/APK 요청·번역·밸런스 불만)을 준다 — 상호 보완.
- **§6 그대로 적용**: 영상에서도 카드 원화·정확한 텍스트·캐릭터 자산은 반입 금지. 역할·구조·타임라인 앵커·UX 마찰 후보만 추출.

<!-- source: external_ai (via codex) `2026-07-06-ba-tcg-youtube-video-intake-RETURN.md` — 실제 풀 티어다운은 미수행, 인테이크 feasibility + 방법론 델타만. status: provisional -->

## 2.7 라이브 웹 SPA 변형 + 8-Atom 분해 프레임 (AOS 해체 2026-07-06 merge)

*출처: Codex `aos-ggplab-teardown` 세션(2026-07-06), 대상은 배포된 APK가 아닌 라이브 React SPA(팬메이드 보드게임 웹앱). 기존 §1 6단계는 APK 전제 — 웹 SPA는 번들/네트워크 계층이 달라 별도 절차 병기.*

### 웹 SPA 해체 절차 (APK 대신)
1. `curl -I` + 브라우저 오픈으로 가용성/타이틀 확인 → 즉시 다운로드 번들(JS/CSS) SHA-256 해시 락.
2. `/api/*` 엔드포인트를 정적 라우트 스캔이 아닌 **실측 probe**로 확인(health/leaderboard/save 등) — 응답 스키마·상태값까지 기록.
3. 데스크톱+모바일 스크린샷으로 레이아웃 실측(모바일 crop/fit 리스크는 별도 QA 플래그).
4. **⚠️ §6 IP 가드레일 재확인** — 이번 소스 세션 산출물 중 minified 번들의 난독화 변수명·file:line 근거를 제시한 부분이 있었으나, §6 "흡수 금지: 함수 맵(함수명·시그니처)"에 정면 저촉되어 **본 merge에서 제외**했다. 웹 SPA 해체도 clean-room 원칙(동작 관찰로 재구성, 변수명/라인 인용 금지) 동일 적용.

### 8-Atom 분해 프레임 (룰 헤비 보드/카드/텍스트 게임 공통 — 구조만 차용, 원작 콘텐츠명 제외)
- **State Atom**: 게임 상태를 원자 필드로 완전 분해(맵/턴/페이즈/플레이어/보드/임시상태/로그/최종점수).
- **Rule Atom**: `legalMoves(state) -> applyMove(state, move) -> nextState` 계약. AI/UI/리플레이 전부 이 계약만 호출 — "적당히 진행해"류 자유생성 금지가 핵심.
- **Phase Atom**: 진행 단계를 UI 상단 상시 노출("외워서 하는 게임"이 아니라 "상태가 알려주는 게임").
- **Map/Scenario Atom**: 콘텐츠 데이터를 엔진과 분리된 데이터팩으로(엔진 1개에 시나리오 교체).
- **AI Atom**: 성격을 대사가 아닌 선택 가중치(성향 프로필)로 — 재현 가능한 행동 차이. (ai-npc-game 방향과 정합)
- **UI Atom**: 상태 비은닉(중요 수치 항상 노출) + 현재 행동만 하단 압축.
- **Feedback Atom**: 선택 전 합법 선택지, 선택 후 비용/보상/로그/되돌리기 범위 노출.
- **Persistence Atom**: 로컬+서버 이중 저장, 버그 신고 시 상태 스냅샷 동봉.

### 신규 델타 (muranyi-tesana-game-harness와 구분)
- **학습가중치 런타임 핫스왑**: 코드 재배포 없이 `learned-weights.json` 같은 외부 파일로 AI 가중치만 교체(self-play/유저로그 튜닝을 코드 변경 없이 반영).
- **LLM = candidate-id selector, never state authority**: `legalActions -> scoredCandidates -> LLM이 후보 id 중 1개 선택(JSON) -> 검증 실패/타임아웃 시 휴리스틱 폴백`. 자유 서술/판정 금지, 유한 후보 중 택1만 — [Muranyi-3 (Tesana) — 프롬프트→게임 product/studio 하네스 스터디](../techniques/muranyi-tesana-game-harness.md) 'LLM tie-breaker'를 구체 계약으로 보강.

<!-- source: external_ai (via codex) `aos-ggplab-teardown` — 핵심 패턴은 기존 흡수분(muranyi/apk/ai-npc-game)과 동형, 8-Atom·핫스왑·selector 계약만 신규. IP 위반 소재(함수명/라인) 배제 merge. status: provisional -->

## 6. IP 가드레일 규칙 (박제 — 비협상)

**철칙: 행동에서 재구성한 것만 vault 에 들어온다. 구현물을 읽고 옮기면 clean-room 이 아니다.**

- 아키텍처·엔진·루프 형태는 **추상적으로** 기술한다("오프라인 싱글플레이어 자원관리 루프" 수준까지만).
- 제3자의 정확한 콘텐츠 표(자원/아이템/레시피 개수·목록), 함수 맵(함수명·시그니처), 번들 모델 테이블을 **vault 에 옮겨 적지 않는다.**
- **clean-room 정의**: *동작(behavior)* 으로부터 impl 을 읽지 않고 재구성하는 것. minified 번들을 읽고 그 모델을 옮겨 적는 것은 clean-room 이 **아니다.**
- 흡수 금지: minified JS 를 재사용 소스로 · 디컴파일된 proprietary 코드 · 정확한 절차적 모델 코드 / 저작권 있는 구현 세부.

## 7. Learn→Apply (반영처)

- **릴리스 준비 절반** → toss 미니게임 릴리스 체크리스트에 공급(debug 빌드/불필요 INTERNET 권한/allowBackup 검토 항목).
- **엔진 분류 절반** → game-studio-pipeline-brief / AI 생성 게임 QA 루브릭에 공급(엔진·래퍼 판정 단계).
- 반영은 위 두 갈래 모두 *방법론 항목*으로만 이식한다 — 케이스별 콘텐츠는 §6에 의해 반입 금지.
