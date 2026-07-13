---
created: 2026-07-10
updated: 2026-07-10
type: learning
tags: [icon-library, design-system, vds, icon-grammar, data-to-runtime, license-gate]
source: [https://github.com/dqev/reicon, https://reicon.dev]
authors: [dqev]
year: 2026
category: method
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-10, trimmed) — 외부 icon library를 디자인 시스템에 흡수하는 패턴. -->

# Reicon → VDS Icon Grammar (외부 아이콘 라이브러리 흡수 패턴)

> ③Gate 통과(2026-07-10, 경계 clean·자가 오버클레임 교정). SHA `d5daf44`, 로컬 검증 **2680 아이콘**(사이트 "2700+"는 마케팅 shorthand). **durable kernel만 흡수** — VDS 생산화(pack 페이지·빌드)는 park. bespoke-html-direction 반-lock-in 정합(Reicon을 "모든 산출의 공식 아이콘"으로 강제 금지 = ParkDal lock-in 재현 방지).

## 1. Icon grammar tokens (durable)
24px grid · Outline 기본/Filled active · `currentColor` 틴팅 · stroke 1.5px · props(size/color/weight/strokeWidth). 토큰화:
```yaml
icon: {grid: 24, sizes: [16,20,24,32], default_size: 20, default_weight: Outline, active_weight: Filled, color: currentColor, stroke_width: 1.5, button_rule: "icon-only 버튼=버튼에 aria-label, 아이콘 aria-hidden"}
```

## 2. Data-to-runtime compiler 패턴
`data/icon-data.json` 단일 SSOT → packages(react/vue/svelte/vanilla/figma/vscode)·CDN·website·sitemap·LLM-index를 **생성**. 아이콘셋이 아니라 *data→runtime 컴파일러*. → design-catalog SSOT→multi-target 원리와 동형.

## 3. LLM-icon-index 패턴 (VDS 직결)
`llms-icons.txt` = kebab-case 이름→컴포넌트명, 카테고리별 usage snippet. VDS의 "복붙 DESIGN.md" 가치의 아이콘판 — 디자인 프롬프트가 "여기 아이콘 넣어"(모호) 대신 **정확한 아이콘명** 지시 가능. `icon-data.json → vds-icon-map.json → llms-icons-vds.md → 지시 snippet`.

## 4. 라이선스 게이트 (raw 채택 blocker)
- Root LICENSE = MIT (Dev Chauhan). 단 README Credits: base icons = **Solar Icons CC BY 4.0**(attribution 의무) + **Zappicon License**(미검토). Terms의 "all icons MIT"는 과도.
- **게이트 룰**: 상류 attribution 의무 해결 전 **raw SVG를 VDS/포폴 산출물에 복사 금지**. 1차 사용 = reference + source-backed registry(브라우징 링크·이름/프롬프트 큐레이션). raw 임베드 시 Reicon/Solar/Zappicon NOTICE 행 필수.

## 5. 반영 (Apply-or-Park)
- **① Applied**: 본 노트(패턴). design-taste·bespoke-html-direction·design-catalog와 링크. Lucide는 일반 UI 컨트롤 기본 유지(Reicon = 광역 소스 + Outline/Filled 페어).
- **② Parked(트리거: VDS builder/아이콘축 승인+라이선스 클리어)**: VDS 생산화 전부 — pack 페이지(`design-icons.html`)·`vds-icon-packs.json`·빌드 스크립트·미검증 아이콘명 리스트(§가설 이름, `icon-data.json` 미대조)·`vds-icon-pack-curator` skill 후보. → codex-gate-park-backlog-2026-07-09.
- **환각 가드**: 아이콘 pack 이름 리스트(gamepad2/palette3 등)는 미검증 후보 — verified로 승격 금지. reicon repo 자체 = 신생/니치(내구성 미검증), 흡수 가치는 *패턴*이지 repo 아님.
