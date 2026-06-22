---
created: 2026-06-20
updated: 2026-06-20
type: learning
tags: [slides, html, presentation, agent-tool, design, pptx, codex]
source: https://github.com/NomaDamas/slides-grab
authors: [NomaDamas]
year: 2026
category: method
---

# slides-grab

에이전트 특화 HTML 슬라이드 프레임워크. NomaDamas(→ [geobench — GEO 가시성 벤치마크 (측정 엄밀성 정본)](../techniques/geobench.md) 동일 작자) 작성, MIT.
**핵심 철학: "HTML is the design language."** 에이전트가 HTML/CSS로 슬라이드를 직접 작성하고, 사용자는 브라우저 에디터에서 bbox로 영역을 선택해 수정 지시. 아웃풋: PDF (안정) / PNG / PPTX (실험적) / Figma (실험적).

기존 vault 연결: SKILL (우리 PPT 스킬)·GUIDE (HTML 외부 공개)·[DESIGN.md 컴포저 — 레버 조립 템플릿](design-md-composer.md) (DESIGN.md 컴포저)

---

## 3단계 파이프라인

| 단계 | 스킬 | 역할 | 주체 |
|------|------|------|------|
| Stage 1 | `slides-grab-plan` | 아웃라인·스타일 승인 → `slide-outline.md` | Codex |
| Stage 2 | `slides-grab-design` | 슬라이드 HTML 생성·검증·비주얼 에디터 | Codex |
| Stage 3 | `slides-grab-export` | PDF·PNG·PPTX 변환 | Codex |

각 단계 완료 전 사용자 명시 승인 필수. 스타일 선정(Stage 1) → HTML 생성(Stage 2) → 에디터 반복(Stage 2) → 변환(Stage 3) 순서 엄격.

슬라이드 규격: **720pt × 405pt (16:9)**. Card news 모드: **720pt × 720pt (1:1, Instagram)**.

---

## Bbox 선택 에디터 ★ (핵심 UX 패턴)

`slides-grab edit` → 브라우저에서 슬라이드 열림 → 사용자가 고치고 싶은 영역을 드래그해 선택 → 텍스트 지시 입력 → Codex가 해당 영역만 수정.

- 선택 영역을 context로 전달 (`editor-codex-prompt.md` 주입)
- validate 통과 후 다음 편집
- "에이전트가 전체를 다시 쓰는 게 아니라 사람이 가리킨 곳만" = 에이전트-인간 협업 UX의 구체 구현

---

## 디자인 시전 전 필수 3종 선언 (pre-design ritual)

HTML 생성 전에 반드시 작성:

1. **visual thesis** — 슬라이드 전체의 무드·재료·에너지 1문장
2. **content plan** — 오프너 → 증거/지지 → 상세/스토리 → 클로즈/CTA
3. **system declaration** — 재사용할 레이아웃 패턴, 배경색 max 2종, 폰트 max 2종, 이미지 중심 vs 텍스트 중심 슬라이드 배분

"시스템 선언 없이 만들면 덱이 흘러간다(drift). 선언이 이터레이션 비용을 낮추는 가장 싸구려 방법."

---

## AI 슬롭 트로프 금지 목록 ★

slides-grab이 명시적으로 anti-pattern으로 박아 놓은 것들:

- 공격적인 풀슬라이드 그라디언트 배경
- 왼쪽 컬러 보더 + 둥근 모서리 "AI 액센트 카드" 기본값
- SVG로 아이콘·이미지 직접 그리기 (→ Lucide 또는 실제 에셋 사용)
- Inter / Roboto / Arial / Fraunces / OS 시스템 폰트 남발 (→ Pretendard 기본)
- 기본 아이콘으로 emoji 사용 (→ 브리프에 명시된 경우만)
- 3×2 "아이콘+제목+2줄 설명" 피처 카드 그리드를 콘텐츠 슬라이드 기본값으로
- 의미 없는 그림자·서브틀 그라디언트·카드 테두리(faux chrome)
- 주제와 안 맞는 스톡 사진·AI 아티팩트 이미지

→ 우리 pptx-deck-builder 및 html-publish에 이 금지 목록 참조 연결 필요.

---

## DESIGN.md → DESIGN.slides.md 전환 패턴 ★

기존 웹 DESIGN.md(마케팅 사이트용: 탑내비·히어로밴드·CTA·푸터)를 슬라이드로 가져올 때:

| 웹 컴포넌트 | 슬라이드 변환 |
|-----------|-------------|
| top-nav | eyebrow strip (얇은 상단 레이블 띠) |
| hero-band | cover layout (커버 슬라이드 레이아웃) |
| CTA 버튼 | kicker text (클로징 슬라이드 텍스트) |
| footer-band 컬럼 | thin footer strip |
| pricing grid | 드롭 (슬라이드에서 불필요) |

변환 결과를 원본 `DESIGN.md` 옆에 `DESIGN.slides.md`로 저장, 원본 불변 유지.

→ [DESIGN.md 컴포저 — 레버 조립 템플릿](design-md-composer.md)에 이 전환 개념 포인터 추가 필요.

---

## god-tibo-imagen (API 키 없는 이미지 생성)

```bash
slides-grab image --slides-dir decks/my-deck --prompt "..."
```

Codex ChatGPT 로그인(`~/.codex/auth.json`)을 재사용해 이미지 생성. OpenAI/Google API 키 불필요. ⚠️ unsupported private backend — 언제든 깨질 수 있음.

대체 provider:
- `--provider codex`: gpt-image-2, `OPENAI_API_KEY` 필요
- `--provider nano-banana`: Gemini `gemini-3-pro-image-preview`, `GOOGLE_API_KEY` 필요

→ [agbrowse](agbrowse.md)의 "web-ai query로 GPT 웹UI 접근" 패턴과 같은 계열 (Codex 로그인 재활용).

---

## validate-before-show 계약

```bash
slides-grab validate --slides-dir <path>   # Playwright 기반
```

생성 후·편집 후 항상 실행. fail 시 자동 수정 후 재실행. validate PASS 전까지 사용자에게 결과 비공개.

→ agent-harness done-gate(exit 0 기준 성공 판정) 패턴과 동일 철학.

---

## 35 bundled 디자인 스타일

30종 (pptx-design-styles 파생) + 5종 오리지널. `slides-grab list-styles` / `preview-styles`로 탐색. 에이전트가 2-3종 shortlist → 사용자 승인 → `style: <id>` outline에 기록.

---

## 리뷰 리트머스 (7문항)

배포 전 체크리스트:
1. 청중이 슬라이드 핵심을 3-5초 안에 파악 가능한가?
2. 각 슬라이드에 하나의 지배적 아이디어만 있는가?
3. 진짜 시각 앵커가 있는가? (장식 아님)
4. 그림자·카드·크롬 없어도 프리미엄해 보이는가?
5. 의미 잃지 않고 제거 가능한 요소가 있는가?
6. 모든 색이 승인된 스타일 스펙에서 왔는가?
7. AI 슬롭 트로프 있는가?

---

## 기존 vault와의 비교

| 기능 | 우리 pptx-deck-builder | slides-grab |
|------|----------------------|-------------|
| HTML → 슬라이드 | △ (html-publish 기반) | ✅ (핵심) |
| Bbox 에디터 | ❌ | ✅ |
| validate 게이트 | ❌ | ✅ (Playwright) |
| DESIGN.md 통합 | ✅ (design-md-composer) | ✅ (+ slides 변환) |
| AI 슬롭 금지 명시 | ❌ | ✅ (8종 실명) |
| 이미지 생성 | ❌ | ✅ (god-tibo-imagen) |
| Card news | ❌ | ✅ (1:1 720pt) |

---

## 학습→반영 루프

**반영처 2곳 (외과 수정):**

1. **SKILL** — pre-design ritual(비주얼 테제·콘텐츠 플랜·시스템 선언) + AI 슬롭 금지 8종 포인터 추가
2. **[DESIGN.md 컴포저 — 레버 조립 템플릿](design-md-composer.md)** — DESIGN.md → DESIGN.slides.md 전환 매핑표 포인터 추가

**도입 여부**: slides-grab은 Codex 중심. 우리 주력은 Claude 직접 HTML 제작(html-publish). 패턴 흡수 우선, 포트폴리오 슬라이드 제작 니즈 발생 시 재검토.
