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
