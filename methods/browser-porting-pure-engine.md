---
created: 2026-07-14
updated: 2026-07-14
type: learning
tags: [method, browser-port, web-build, purity-gate, deterministic-engine, mime, debugging, recurrence-prevention, uzmap-forge, clean-room]
category: method
source: uzmap-forge 에디터 1차 라이브 뷰포트 구동 사고 연쇄(2026-07-14)
---
<!-- 순수 로직 엔진을 브라우저로 라이브 포팅할 때의 재발방지 규율 — uzmap-forge 뷰포트 구동 사고에서 도출. -->

# 브라우저 포팅: 순수 로직 엔진의 함정과 재발방지

Node용 순수 로직 엔진(파서·VM·sim 등)을 브라우저에서 *라이브* 구동할 때 겪은 시행착오 연쇄와, 그걸 **코드 게이트로 원천 차단**한 규율. (작가 지시 "다음엔 같은 문제 만들지 말고 재발방지".)

## 사고 연쇄 (uzmap-forge 2026-07-14)

에디터 1차 = 브라우저에서 실 엔진(sim/VM/전투/이동) 라이브 구동. 셸(HTML)은 떴는데 엔진이 안 붙음 → 5단계 오진 끝에 진짜 원인 규명.

1. **진짜 원인 = `node:zlib`** — MPQ 리더가 섹터 해제에 `node:zlib.inflateSync` + top-level `import zlib from "node:zlib"`. 브라우저가 `node:` 스킴을 CORS로 거부 → 모듈 체인 붕괴. **화근: "src 순수" 검증을 `node:fs|path|url`만 grep한 부분 검증** — zlib가 빠져나감.
2. **MIME** — 기본 `python -m http.server`가 일부 macOS(Python 3.13)에서 `.js`를 `text/plain` 서빙 → 브라우저가 ES모듈 거부. 셸만 뜨고 스크립트 미실행.
3. **터미널 vs 브라우저 혼동** — 안내의 URL을 사용자가 *터미널*에 입력 + 서버 Ctrl+C. 실행 맥락(서버 창 vs 주소창) 미분리.
4. **HEAD vs GET 오탐** — 서버 MIME를 `curl -I`(HEAD)로 검증했는데 핸들러가 HEAD 미구현 → 에러 HTML 반환 → "MIME 깨졌다" 오판. 브라우저는 GET을 씀.
5. **콘솔 부재** — Chrome 확장 미연결로 브라우저 콘솔 접근 불가 → 원인 규명 지연.

## 재발방지 규율 (코드로 강제 — 문서만 X)

- **철칙: "순수/호환" 주장은 *전수 게이트*로 강제한다. 부분 grep 금지.**
  - 인스턴스: `scripts/build-web.mjs`가 src의 *모든* `node:` import를 스캔해 하나라도 있으면 **빌드 실패**(정규식 `/(?:from|import\()\s*["']node:/`). node:zlib류가 다시 새면 빌드가 막는다. (부분 grep으로 "순수하다"고 단정한 게 사고의 근원 — 검증은 주장의 전체 표면을 덮어야 한다.)
- **순수 대체 우선** — node 내장(zlib 등)은 순수 JS로 대체(예: tinf 이식 DEFLATE `inflate.ts`). 정확성은 *기존 산출(zlib)과 byte 대조* + 실데이터 회귀(실맵 해제)로 게이트. seam(주입) 설계는 좋지만 *top-level import*가 남으면 무의미 — import 자체를 제거해야 브라우저가 산다.
- **웹 서빙 = 전용 서버** — 기본 `http.server` 대신 명시적 MIME dict + 요청 로그 + no-store를 가진 최소 서버(`serve.py`)를 *동봉*. MIME는 `guess_type`(파이썬 버전 편차)에 의존하지 말고 확장자→타입 직접 매핑. 서버가 요청을 찍으면 "어디에 붙었나/무슨 MIME였나"가 즉시 보여 자가진단.
- **콘솔 없이도 보이게** — 브라우저 콘솔 접근이 불확실할 땐 `window.addEventListener("error"/"unhandledrejection")` → 화면 DOM에 에러·스택 노출. 리소스 로드 실패(모듈)와 런타임 예외를 구분 표기. (이게 결국 node:zlib CORS를 화면에 띄워 규명.)
- **실행 안내는 맥락 분리** — "터미널(서버, 켜두고 놔둠)" vs "브라우저(주소창 URL + hard-reload)"를 명시 구분. URL을 코드블록으로 주되 "이건 브라우저 주소창" 라벨.
- **서버 MIME 검증은 GET으로** — HEAD(`curl -I`)는 핸들러 미구현 시 오탐. 브라우저 실경로(GET)로 헤더 확인.

## 일반화

- 이 규율은 uzmap-forge 국한이 아님 — *어떤 순수 로직 코어를 다른 런타임(브라우저/워커/엣지)으로 포팅*할 때 공통. 핵심 = **"플랫폼 순수성"은 신념이 아니라 빌드가 강제하는 불변식**.
- 결정론 코어([WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md) Card A)는 렌더러·플랫폼 독립이 자산 — 단 그 "독립"이 *증명*(게이트)되지 않으면 숨은 node 의존이 배신한다.

## 연결
- 프로젝트 로그: uzmap-forge-progress 2026-07-14
- 관련: [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md)(context/게이트 우선), Karpathy #4(검증 가능 성공 기준 — "순수"의 검증 기준 = 전수 게이트)
