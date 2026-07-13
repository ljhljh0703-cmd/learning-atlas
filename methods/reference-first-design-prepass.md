---
created: 2026-07-09
updated: 2026-07-10
type: learning
tags: [design, html, bespoke, reference, portfolio, game-ui, typography]
source: [https://verbiolabs.com/claude-guide, https://www.awwwards.com/, https://dribbble.com/, https://uibowl.io/, https://github.com/MengTo/progressive-blur, https://github.com/kuskhan/jetendard]
authors: [VerbioLabs, Awwwards, Dribbble, "UI Bowl", MengTo, kuskhan]
year: 2026
category: method
---
<!-- Codex 6패킷(verbiolabs·awwwards-dribbble·uibowl·mengto·jetendard) ③Gate 흡수 — 레퍼런스 우선 디자인 prepass. -->

# 레퍼런스 우선 디자인 Prepass (bespoke HTML)

> ③Gate 통과(2026-07-09, 무결성 오탐 6건 정정 포함). 전부 참조 input, 복사 output 아님. design-taste·bespoke-html-direction 유동 레버.

## 1. 레퍼런스 트라이어드 (매크로·마이크로·국내)

bespoke 시작 = **1 매크로 + 2-5 마이크로 + 실제 프로젝트 evidence**:

- **Awwwards** = 매크로(hero·scroll·transition·immersive narrative·포트폴리오 구조). 단 모션 과다·콘텐츠 은닉 주의.
- **Dribbble** = 마이크로(컴포넌트 polish·onboarding·mascot·cards·badges·small interaction). 단 실 UX/반응형 결여 흔함.
- **UI Bowl** = 국내 shipped UX evidence. **게임 탭**이 특히 고가치 — reward/BM/mission/shop/gacha/season pass/lobby/tutorial/inventory를 장르·매출·orientation별 노출(게임 UI 역기획 워크플로우).

## 2. Gamified Dense Guide/Portfolio 페이지 (VerbioLabs)

장문 지식을 **게임 매뉴얼 페이지 시스템**으로: mode/level/chapter 스키마 + content atoms + 진행 loop + (선택)companion + contextual funnel + render/link/hash 게이트. 포트폴리오 구조 적용: `identity shell → reviewer mode → project/world map → case-study chapters → proof gates → working principles → contextual CTA`. → skill 후보 `gamified-dense-guide-page`(park). 소스 콘텐츠·정확한 카피·brand·client-only gate 로직 복사 금지.

## 3. Progressive-Blur 프리미티브 (MengTo)

`progressive-blur-edge` = 다층 `backdrop-filter` + `mask` ladder(blur 강도가 viewport/hero edge로 증가). 기존 `edge-blur`의 **고급 variant**(항상켜기 기본값 X). 채택 시 WebKit prefix + `@supports` fallback + a11y(`prefers-reduced-transparency`) + visual/perf 게이트 필수. 기본 `height:65%`·64px blur은 과함.

## 4. 한글 모노스페이스 가독성 게이트 (Jetendard)

`korean-monospace-readability-gate` = 코드블록·터미널·proof 로그·README/AGENTS 발췌·evidence 패널 **한정** 폰트(본문/display 기본값 X). anti-slop-frontend-gate 하위 타이포 서브게이트. 웹폰트 payload·라이선스 reserved-name 검토.

## 5. Apply-or-Park

- **① Applied**: 본 노드 신설(reference triad + 4 프리미티브). design-index에 트라이어드 등재 권장.
  - **`gamified-dense-guide-page` 트리거 발화 → applied (2026-07-10)**: 이력서 게이미파이드 리뉴얼에 §2 verbiolabs 구조 패턴(`identity shell → track mode → project/world map → case-study chapters → proof gates → companion → CTA`) 이식 실증. 근거 = `포트폴리오 리뉴얼/최신화-이력서/RETURN.md` §28~29(하네스 166/166 · ko/en 페어 드리프트 기계 게이트 ⑨ · 햄스터 companion · 로컬 검색 정직 라벨 "외부 호출 0"). **구조만 이식 — 소스 콘텐츠·카피·brand·client-only gate 복사 0** 준수. 사용 계측 = use-ledger 2026-07-10. (skill 승격은 미결 — 1건 실증, `skills/.incubator/` 등록은 작가 판단 대기.)
- **② Parked**: material-explainer-image-system(center 이미지 + outer HTML 레이아웃 분리, Codex-local skill 이미 설치 — vault mirror 결정 보류). 트리거 = 다음 포트폴리오/공개 HTML 작업.
- **▸게임개발/창작** UI·비주얼 트랙. **▸NPC** companion UI 표면(→[AI NPC 기억·신념 아키텍처 (Memory + Belief)](../techniques/ai-npc-memory-belief-architecture.md) §Active Guidance).
