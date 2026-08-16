---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [branding, design-system, brand-identity, trends, portfolio]
category: technique
source: https://github.com/alexmcdonnell-airtable/hyperagent-public-skills
---

<!-- 브랜드 아이덴티티 생성 방법론 — 3 divergent route + 현행 트렌드 + 하드룰. ad-storyboard 브랜드 작업·신규 브랜드에 적용. -->

> 출처: hyperagent-public-skills `brand-book-generator` skill 전문 직접 파악(2026-06-16). 한 줄 앱 설명 → *3 radically distinct 브랜드 route*를 no-scroll bento 1화면으로. 방법론(트렌드·divergence·하드룰)을 흡수 — 산출 템플릿/스크립트는 clean-room(복제 X).

# Brand Identity Generation — 3-route 방법론

## 핵심 절차
한 줄 설명 → **3개 radically different 브랜드 route**(서로 다른 회사처럼) → 각 route: 이름·태그라인·포지셔닝 1문단·tone 3태그·**4색 팔레트(name+hex)**·type spec(display+mono)·voice 1줄 → route별 브랜드 적용 목업 3종(in-app 1:1 / OOH 빌보드 9:16 / merch 3:2, 워드마크를 이미지에 렌더).

## Divergence Rule (3 route 강제 차이)
canvas **VALUE**(셋 다 다크 금지 — light/dark 섞기)·font pairing·surface texture(soft-clay-3D vs flat-raw vs glossy-metal)·accent family·voice. 검증된 trio: **claymorphism(warm) · neo-brutalist hi-vis(stark light) · Y2K chrome(dark metal)**.

## 현행 트렌드에 접지 (stale 기본값 X)
작업 *전에* 그해 트렌드 검색(예 "2026 brand identity trends"). 리믹스 후보: claymorphism(부드러운 3D)·neo-brutalism+hi-vis(acid color·monospace·hard edge)·Y2K/liquid chrome/retrofuture(iridescent·holographic)·maximalism·oversized kinetic variable type·bento grid.

## 🚫 HARD RULES (위반 금지)
- **blue/purple gradient 절대 금지** — indigo→cyan→magenta "aurora"/AI-native mesh gradient 포함. 모두가 쓰는 기본값 = un-designed로 읽힘. 차원/에너지 원하면 claymorphism·chrome/iridescent·hi-vis flat·maximalist clashing flat. warm-sunset/acid gradient은 OK.
- **over-trained look 회피**: warm cream+burnt-orange+serif("Claude look")·generic film-noir·flat gray SaaS minimalism.

## 산출 형식
**no-scroll 100vh hero** bento(logo big·app·merch·bill tall OOH·palette·type·voice). route 토글 = 전체 re-skin(색·폰트·radius)+assemble 애니. 900px 미만서 스크롤 스택. 카피 타이트(데스크톱 뷰포트 안에).

## Brand Mark Generation Verification Lane
<!-- 2026-08-13 codex-gate merge: Nutlope/logocreator pin 268916b2 · APPLY_PIPELINE_PATTERN / PARK_CODE -->

위 §은 *무엇을 만들지*(3 route divergence)를 정한다. 이 §은 *만든 걸 어떻게 검산할지*를 정한다 — 로고 생성 구현체 1건을 해부해 얻은 델타.

```text
brief → mark-type contract → model route(text-bearing | symbol | edit)
→ 4 divergent candidates + per-image cost receipt
→ 글자정확도 / 16·32·128px 식별성 / 단색 / contrast
→ human selection → vector cleanup
→ 상표·명칭 유사성 + source/license review → brand kit export
```

**남길 구현 패턴 3종**
1. **의미 입력을 prompt contract 로 컴파일** — 자유문장 1개가 아니라 mark type(icon-name/icon/wordmark/monogram/emblem/abstract)·style·detail·color·monochrome·reference 로 구조화. 색은 hex 만 던지지 않고 `navy (#19337A)` 처럼 **이름+값을 구체 부위에 결합**. **부정형 대신 긍정형** — "no text" ❌ / "purely graphic symbol with open negative space" ✅. flat 과 3D/gradient 의 depth allowance 분리.
2. **과업별 모델 라우팅** — "최고 모델 하나"가 아니라 실패 유형별 route. **글자 들어가는 mark 는 FLUX 가 아니라 텍스트 추종이 나은 모델로 보낸다**(구현체 주석이 내부 비교 근거를 명시). 429 → 간격 둔 1회 retry → fallback.
3. **비용·보안을 제품 계약으로** — 이미지 1장 = credit 1개 + **실패 시 원자적 refund** · 입력 크기 제한 · reference 는 data URL 만 · 외부 브랜드 import 시 private/loopback/metadata IP 차단 + redirect 마다 재검사(구현체도 인정하듯 DNS check ↔ fetch 사이 **TOCTOU 는 잔존**).

🚫 **`brand-ready` 완료 조건** — AI output 을 그대로 최종 상표로 쓰지 않는다. 글자 정확도 + 작은 크기 식별성 + 단색/역상 contrast + vector path 정리 + **기존 상표·캐릭터 유사성 검토** + 모델 약관·reference 권리 확인 + 사람의 최종 승인. 전부 있어야 완료다.

🅿️ **코드 재사용 = PARK(라이선스 미확인)** — 게시물은 MIT 라 하지만 **pinned HEAD 에 `LICENSE`·`COPYING` 파일이 없다**. "GitHub 공개" ≠ "오픈소스 라이선스 부여". 라이선스가 확인될 때까지 코드 이식 금지, 위 pipeline pattern 만 흡수. (게시물의 "완전 무료" 도 부정확 — self-host 는 API key 필요, 서버 key 경로는 free credit 2개 후 사용자 과금.)

## 적용
- ad-storyboard — 광고의 브랜드 route·톤 분기에 divergence rule + 하드룰 적용.
- **게임 title mark·스토어 아이콘·이벤트 배지** — 위 verification lane 을 그대로. 해커톤/프로토타입의 빠른 visual identity 탐색에도.
- 신규 브랜드/제품 아이덴티티 작업.
- 하드룰(no blue/purple gradient·avoid Claude look)은 **모든 시각 산출의 전역 가드** → design-index 등재.
- 목업 워드마크 렌더: [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](editorial-grid-design-canon.md) §D code→image→reality + Helvetica 함정 동일 적용.
