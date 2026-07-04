---
created: 2026-06-29
updated: 2026-06-29
type: learning
tags: [design, html-publish, css-effects, clean-room, porting, parkdal]
source: "https://github.com/DavidHDev/react-bits"
authors: [David Haz]
year: 2026
category: method
---
<!-- React Bits 효과 카탈로그를 clean-room behavior-level로 html-publish primitive에 이식하는 방법 -->

# React Bits → 디자인 효과 primitive 이식법 (clean-room)

> 출처: `DavidHDev/react-bits` (clone commit `f292047`, 135 컴포넌트 효과 라이브러리). ③Gate 2026-06-29 — 외부 Codex 해체 → vault Claude 1차출처(repo clone) 대조. **흡수 = 코드 복붙 아니라 *방법(porting harness)+패턴 카탈로그*.** 라이선스 **MIT + Commons Clause**(컴포넌트 자체 재판매·번들 재배포 제한)라 *clean-room 재구현*이 유일 안전 경로.

## 한 줄
React Bits의 알맹이는 "화려한 컴포넌트 묶음"이 아니라 **효과를 prop schema로 노출하고 preview/code/export까지 닫는 디자인 실험대 구조** — 의존성(React/GSAP/Three/OGL)은 버리고 *single-file HTML friendly primitive*로 재설계해 html-publish에 흡수한다(ParkDal 토큰 확장 X, L6 인터랙션 선택지 확장 O).

## 핵심 = clean-room behavior-level 이식 방법
외부 디자인 라이브러리는 계속 나온다. 고정 porting harness 없으면 Codex/Claude가 화려한 코드를 복붙해 토큰 위반·HTML bloat·라이선스 위험을 만든다. 절차:
1. 원본 컴포넌트의 *목적·사용자 지각 효과*만 기록. props/API/파일구조/클래스명/구현코드는 버림.
2. 우리 슬롯 계약에 맞는 `data-effect` 이름을 새로 정함(`--fx-*` 네임스페이스).
3. CSS-first 구현, JS는 CSS 변수 주입 등 최소 DOM 보조만.
4. reduced-motion·keyboard focus·no-layout-shift를 gate에 넣음.
5. 빌드 시 *참조된 effect만* 인라인(전역 포함 금지).
6. 출처는 learning/RETURN 노트에만 표기(컴포넌트 재배포 X).

## 의존성 triage (135 컴포넌트, 흡수 우선순위)
| Tier | 수 | HTML 흡수 |
|---|---:|---|
| CSS/DOM/무의존 | 30 | **1순위** (CSS 변수·pointer·canvas·자족 DOM) |
| `motion` | 19 | CSS transition/WAAPI로 재구현 |
| `gsap` | 28 | 드물게·base 의존성화 금지 |
| WebGL/Three/OGL | 52 | hero 한정·opt-in·lazy·static fallback |
| heavy/special | 6+ | publish 파이프라인 회피(matter/face-api/R3F 등) |

## 8-point 디자인 게이트 (효과 허용 전)
purpose(무슨 의미?) · slot(어디?) · layer(CSS만/tiny JS/canvas/WebGL?) · token 준수(rogue 색·폰트 금지) · motion budget(none/subtle/hero-only) · fallback(reduced-motion·print·mobile) · performance(무한 rAF 금지, hero-only·gated 예외) · taste check(warm authority·정밀·one wow, novelty 더미 X).

## 흡수 안 함
React Bits 전역 설치 / shadcn·jsrepo·MCP registry / 대형 컴포넌트 팩 복사 / Commons Clause 컴포넌트 ParkDal 포트팩 재배포 / WebGL 배경 기본화 / Tailwind를 single-file HTML 요구사항화 / "효과 가용성"이 페이지 목적 우선.

## 반영처 (학습→반영 루프) — ✅ 적용 완료 (2026-06-29)
상위 5효과(`spotlight-card`·`glare-hover`·`edge-blur`·`logo-loop`·`noise`)의 clean-room 코드가 html-publish 에 **반영됨**(작가 명시 merge): `skills/html-publish/effects.yml` + `templates/html/_effects.css`(192줄) + `_effects.js`(134줄, logo-loop 무한루프 cap 적용) + `docs/_effects-preview.html` + GUIDE/preflight/build.py(`apply_effects` opt-in 후처리)/lint.py(`lint_effects` + color-lint var-driven 확장). 검증=회귀0(effects 미선언 무영향·멱등)·positive(data-effect 주입·CSS/JS 인라인)·lint 정합. 패치 html-effect-primitives-2026-06-29(merged). **사용**=group yml 에 `effects:` opt-in(미선언 시 무영향). ParkDal 토큰 불변(`--fx-*` 격리).

## 관련
design-taste(효과는 taste의 medium choice 인스턴스) · design-index · [Codex Product Work Shift — 구현은 싸지고, 판단이 귀해진다](codex-product-work-shift.md)(specialty tool bridge·medium gate와 같은 "외부도구 흡수≠설치" 결) · [외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md)(infra-0: 해체 흡수, 설치 X) · 스킬 후보 `html-effect-primitives`(작가 승인 대기).
