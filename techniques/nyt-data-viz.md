---
created: 2026-06-16
updated: 2026-08-11
type: learning
tags: [data-viz, charts, d3, editorial, nyt, design-system]
category: technique
source: https://github.com/alexmcdonnell-airtable/hyperagent-public-skills
---

<!-- NYT/Upshot급 데이터 시각화 규율 — 정적 차트 + 인터랙티브 D3 대시보드. 포트폴리오·리포트 차트 품질 상향. -->

> 출처: hyperagent-public-skills `nyt-data-viz` skill 전문 직접 파악(2026-06-16, 70KB 최대 파일). 기본 Plotly/Chart.js 출력을 NYT graphics desk급으로 끌어올리는 하우스 규율. 포폴/리포트의 모든 차트에 적용.

# NYT-discipline Data Visualization

## 5 Core Rules (모든 차트)
1. **Color** — 중요 시리즈에 hero accent 1개, 나머지 회색. monotonic-luminance sequential ramp만(rainbow/jet 금지). diverging은 의미 있는 0 있을 때만. categorical ≤ ~7 hue, 초과 시 small-multiple.
2. **Typography** — Playfair Display(display serif) + Libre Franklin(sans 라벨/주석) + Source Serif 4(본문). **모든 숫자 라벨에 `tabular-nums`**(자릿수 흔들림 방지).
3. **Chart choice** — 시계열=line 먼저, bar 둘째, **pie 금지·dual y-axis 금지·bar는 0부터**. ~5 시리즈 초과 → small multiples.
4. **Annotation** — 선언형 헤드라인(라벨 아닌 *문장*) + 단위·기간 명시 subtitle + source 라인. **시리즈를 끝점에 직접 라벨**(범례 X). 변곡점 제자리 주석. 인간적 축 라벨.
5. **Archie Tse rule** — 핵심 정보는 인터랙션 없이 보여야. **375px 모바일 먼저 테스트**.

## Interactive D3 — 버그방지 5종 (현장서 잡힌 실버그)
- **A. Hit-layer 좌표공간** — 투명 hover `<rect>`를 marks와 *같은 margin-translate된 `<g>`*에 append. svg root에 붙이면 `d3.pointer`가 root 좌표 반환 → `delaunay.find()`가 엉뚱한 mark 검색.
- **B. Pixel 아닌 proximity** — 2~3px 점을 hover시키지 말 것. marks 위 Delaunay → 최근접 snap.
- **C. Gliding anchored tooltip** — tooltip을 hovered mark 박스에 anchor + `left/top` CSS transition(커서 아래 순간이동 X). 점 없는 line/bump엔 highlight marker 1개 이동.
- **D. Domain이 max를 덮어야** — 손으로 친 round cap이 outlier를 캔버스 밖으로(실버그: goals 축 10 cap이 12골 경기 은폐). `d3.max`로 domain.
- **E. Legible 주석** — 주석 텍스트에 paper색 halo(`paint-order:stroke fill`), trough/edge 라벨은 leader line으로 데이터서 들어올림. 축 tick과 같은 컬럼 공유 X.

## 참조 graphic (패널별 1개 실NYT 매핑)
connected scatterplot("Driving Shifts Into Reverse" — 양 축 monotonic일 때만) · small multiples("How Different Groups Spend Their Day", 직접 라벨·공유 축·범례無) · beeswarm(COVID vaccination tracker, 1점=1레코드·단일 muted hue) · bump(리더 accent·추격 회색).

## Pre-publish 체크 (요지)
domain=`d3.max`(D) · hover rect를 marks `<g>`에(A) · voronoi proximity(B) · gliding tooltip(C) · halo+leader 주석(E) · connected-scatter는 양축 monotonic만 · inline `<script>` `node --check` + 데이터 `JSON.parse` · headless 가능하면 desktop+375px 스크린샷 · 에디토리얼 텍스트는 초안 본능의 ~절반으로 컷.

## 상류 델타 — 의미 계약(semantic chart contract) <!-- 2026-08-11 codex-gate: Flint(microsoft/flint-chart, commit 84a8e8d) -->

위 5규율은 *출력 표현*을 다룬다. 그 상류에 **의미를 먼저 고정하고 축·집계를 기계가 파생시키는 층**이 하나 더 있다 — vault 전역에 부재했던 델타(`semantic chart` grep 0건).

```text
field meaning + aggregation role + zero baseline + unit/format + sensitivity/provenance
→ compiler → backend output → validator/render QA
```

- **선언이 규칙을 파생한다** — 필드에 의미·집계 역할을 선언하면 "Price 는 합계 금지 · Temperature 는 zero축 회피 · Rank 는 ordinal" 이 사람 기억이 아니라 registry 에서 결정론적으로 나온다. 위 5규율 #3(`bar는 0부터`)은 그 파생 결과 *하나*를 손으로 적어둔 것에 해당한다.
- **parity 검증** — 같은 데이터셋을 두 backend 로 컴파일해 *의미·축·집계가 일치하는지* 대조한다. 렌더 결과가 예뻐 보이는 것과 의미가 보존된 것은 다르다.
- **민감도는 필드 속성** — local data file 참조가 기본 허용인 도구는 민감 데이터에 별도 차단 플래그가 필요하다.

⚠️ 출처 수치 교정: 게시물·README 의 `70+ semantic types` 는 pinned registry 실측 **44 entries**, backend 도 3종(Plotly·Excel 은 library lane). 테스트 1,012 PASS·typecheck/build PASS 는 검사 commit 에서 실행 확인, 그 외 성능 주장은 `source-reported`. **도입 결정 아님** — 계약만 흡수(도구 설치·MCP 연결 보류).

## 적용
포폴/리포트/슬라이드의 차트에 적용. [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](editorial-grid-design-canon.md)(그리드·타이포)와 한 쌍 — canon=레이아웃, 본 규율=데이터. 산출=PublishWebpage용 self-contained HTML(임베드 미디어는 공개 URL 먼저).
