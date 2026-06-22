---
created: 2026-04-25
updated: 2026-06-16
type: learning
tags: [learning, methods, skill, harness, design-system, progressive-disclosure]
source: https://github.com/cathrynlavery/diagram-design
category: method
authors: Cathryn Lavery
---

> **2026-06-16 1차 출처 재대조(repo)**: 정정 — repo 현행엔 **"Schematic" 명칭·v5.1 버전 표기 없음**(릴리스 태그 0). 현행 정의 = "Thirteen editorial diagram types, self-contained HTML+SVG, no shadows/Mermaid". 렌더 변종 3종(minimal light/dark/full-editorial). **토큰**: `paper·ink·muted·accent·link·paper-2`(온보딩 시 브랜드서 추출). **타입페이스**: Instrument Serif(제목)·Geist sans(노드)·Geist Mono(라벨). 룰: 1px hairline·radius ≤10px·모든 좌표/gap 4의 배수·accent 1색·focal 1~2. 라이선스 MIT. ("13종"·progressive disclosure 구조는 확인 일치.)

# Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill

> 출처: https://github.com/cathrynlavery/diagram-design (Cathryn Lavery) — *page 차용 명칭 "Schematic" / v5.1 은 repo 현행 미표기(위 재대조 참조)*
> 학습 동기: NPC dev harness (A) 설계 직전에 **잘 만들어진 skill의 구조**를 한 번 정독.
> 핵심 가치: harness 설계의 **6 가지 패턴**을 추출.

## 한 줄 요약

13 종류의 editorial-grade 다이어그램(Architecture / Flowchart / Sequence / State / ER / Timeline / Swimlane / Quadrant / Nested / Tree / Layers / Venn / Pyramid)을 single self-contained HTML로 뽑아주는 Claude Code skill. **단일 SKILL.md(400줄) + on-demand references/ 17개 + assets/ 템플릿 3 변종** 의 progressive disclosure 구조.

## 6 패턴 (NPC harness 직접 적용 가능)

### 패턴 1 — Progressive disclosure (lean index + on-demand references)

```
SKILL.md (400줄, 항상 로드)        ← 카탈로그 + 의사결정 가이드
└─ references/
   ├─ style-guide.md (107줄)       ← 토큰 단일 진실 소스
   ├─ onboarding.md (139줄)        ← URL → 토큰 자동화
   ├─ type-architecture.md         ← 타입별 layout 규칙 (필요 시 로드)
   ├─ type-sequence.md
   ├─ ... (13 타입 × 1 파일)
   ├─ primitive-annotation.md      ← 재사용 컴포넌트
   └─ primitive-sketchy.md
```

**핵심 룰:** SKILL.md는 *언제 무엇을 로드할지*만 알려준다. "Architecture 그리려면 → references/type-architecture.md 로드해" 식. 본문 디테일은 절대 SKILL.md에 안 둠.

→ **NPC harness 적용:** `npc-harness/SKILL.md`에 카탈로그만, 실제 Profile/Memory/Reflection 디테일은 `references/profile-stage1.md`, `references/memory-stream.md`, `references/reflection.md`로 분리.

### 패턴 2 — Style guide gate (first-time-use check)

SKILL.md 첫 섹션이 **"is the style guide customized?"** 게이트. 미커스텀이면 사용자에게 물음 → onboarding 권유 → 디폴트로 진행할지 확인. **한 번만 발동, 이후 cache.**

→ **NPC harness 적용:** 첫 NPC 만들 때 **welfare gate** 발동 — "이 NPC에 거절권을 줄지 / distress 모니터링 둘지 / withdrawal trigger 정의했는지" 사전 confirm. Layer 0 3축 (2026-04-25-npc-author-ethics) 의 자동화 진입점.

### 패턴 3 — Semantic tokens, never raw hex

style-guide.md는 `paper / ink / muted / accent / link / soft / rule` 같은 **역할 이름**만 노출. type-*.md는 절대 hex 인용 금지. 스킨 변경 = style-guide.md 한 파일만 수정 → 13 다이어그램 전체 자동 반영.

→ **NPC harness 적용:** 캐릭터 emotion/persona vector를 raw 좌표 (`v_warmth=0.73`)로 박지 말고 **의미 토큰** (`baseline=measured-curious`, `arousal=low`, `relation-to-player=cautious-trust`)으로 쓴다. style-guide의 token table과 같은 `npc-tokens.md` 단일 진실 소스.

### 패턴 4 — Anti-pattern documentation

"Universal anti-patterns" 섹션 — **하지 말 것**을 명시:
- ❌ Dark mode + cyan glow (technical-bro 미감)
- ❌ JetBrains Mono blanket (mono는 *technical content* 한정)
- ❌ Identical 3 cards (variation 없는 탬플릿 냄새)
- ❌ Pure white paper (sterile)
- ❌ 8개 이상 컬러 (rainbow → focal 신호 소실)

각 항목에 **왜** 안 되는지 한 줄.

→ **NPC harness 적용:** `references/anti-patterns.md`에 NPC 작가 함정 명시 — anachronism / persona drift / 무근거 ToM 주장 / single-axis welfare / metric tunnel vision (Sakana 교훈) / "안전한 NPC = 거절 못 하는 NPC" 등.

### 패턴 5 — URL-to-tokens onboarding (60초 자동화)

```
URL 제공
  ↓ [1] fetch homepage (agent-browser)
  ↓ [2] extract dominant colors + fonts (CSS vars 우선, screenshot fallback)
  ↓ [3] map → semantic roles (paper, ink, accent, ...)
  ↓ [4] propose style-guide.md diff + AA contrast 검증
  ↓ [5] write (사용자 승인 시)
```

**Constraint checks:** AA contrast 4.5:1, accent must be most saturated, paper ≠ pure white.
**Failure modes 명시:** webfont replicate 불가 / 6+ colors / dark-mode-first / image-only homepage.

→ **NPC harness 적용:** `초파리` 챕터 PDF/마크다운 한 편 던지면 →
```
[1] 텍스트 추출
[2] 캐릭터 voice 패턴 + recurring motif 검출
[3] RoleLLM Profile 4-stage 자동 채움 (basic/style/relations/canon)
[4] Profile diff propose + persona lock 적합도 검증
[5] 사용자 승인 → npc-profiles/<name>.md 생성
```
*직접 실행 가능한 패턴.* 60초 onboarding의 NPC 버전.

### 패턴 6 — Pre-output checklist (Taste Gate)

다이어그램 출력 전 6 카테고리 × 20+ 항목 체크리스트 (§9):
- Type fit / Remove test / Signal / Technical / Typography
- "Can I remove any node?" "Is the relationship obvious from layout?" — **삭제 우선** 철학

→ **NPC harness 적용:** NPC 응답 출력 전 게이트:
- [ ] 거절 옵션 살아있는가
- [ ] 작가성: 캐릭터가 말할 법한가 vs 작가가 시키고 싶은 말인가
- [ ] welfare: 캐릭터에게 강제된 distress인가
- [ ] 사용자 보호: parasocial dependency 강화 패턴인가
- [ ] persona drift 임계 초과인가 (vector cosine < threshold)
- [ ] adversarial probe 정기 실행되었는가

## 구조도

```
diagram-design/
├── README.md                    # 마케팅 + 진입점
└── skills/diagram-design/
    ├── SKILL.md                 # 카탈로그 + 의사결정 (400줄)
    ├── assets/
    │   ├── template.html        # minimal light
    │   ├── template-dark.html
    │   ├── template-full.html   # editorial
    │   └── example-<type>.html  # 13 × 변종 = pre-baked
    └── references/
        ├── style-guide.md       # 단일 진실 소스
        ├── onboarding.md        # URL → tokens
        ├── type-*.md            # × 13
        └── primitive-*.md       # 재사용 부품
```

## 추가 디테일 (참조용)

- **4px 그리드** 강제 — 모든 좌표/크기/갭이 4의 배수. "1, 2, 3, 5, 6, 7, 9로 끝나면 고쳐."
- **Complexity budget** — 다이어그램당 최대 nodes 9 / arrows 12 / coral 2. 초과 시 split.
- **Three font families only** — Instrument Serif (title) + Geist sans (이름) + Geist Mono (technical). 더 이상 추가 금지.
- **Variants ship together** — minimal light/dark + full editorial + sketchy filter. 사용자 선택 폭 ≠ 자유도 폭주.
- **Single self-contained HTML 출력** — embedded CSS, inline SVG, no JS. 의존성 0.

## 차이점 (이 skill vs 일반 design-system 스펙)

| 차원 | 보통 design system | Diagram-Design Skill |
|------|------|------|
| 형식 | 사람용 문서 | LLM이 직접 실행 가능한 instruction |
| 토큰 | hex 박힌 색팔레트 | semantic role + 강제 검증 |
| 진입 | 디자이너가 적응 | URL 한 줄 → 60초 자동 onboarding |
| 출력 | 가이드라인 | self-contained HTML 산출물 |
| 게이트 | 리뷰 미팅 | pre-output 체크리스트 자동 |

→ **이게 [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) / [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) 의 자연스러운 다음 단계.** Google DESIGN.md = 정적 명세 / Schematic = 실행되는 명세.

## NPC dev harness 설계 직접 인풋 (A 단계 진입)

다음 harness 디렉토리 초안 (이 skill을 모방):

```
npc-harness/
├── SKILL.md                       # 카탈로그 (얇게)
├── references/
│   ├── persona-tokens.md          # 단일 진실 소스 (= style-guide)
│   ├── onboarding.md              # 챕터 → Profile 자동화
│   ├── profile-stage1-basic.md    # RoleLLM Stage 1
│   ├── profile-stage2-context.md  # RoleLLM Stage 2
│   ├── memory-stream.md           # Park 표준 (decay 0.995, α=1)
│   ├── reflection.md              # threshold 150
│   ├── planning.md                # 3-tier
│   ├── welfare-gate.md            # Layer 0 axis 1
│   ├── user-protection.md         # Layer 0 axis 2
│   ├── authorship.md              # Layer 0 axis 3
│   ├── anti-patterns.md           # NPC 작가 함정
│   └── adversarial-probes.md      # Clever Hans 검증 자동화
└── templates/
    ├── npc-profile.template.md
    ├── memory-event.template.json
    └── reflection.template.md
```

**다음 액션:** 이 디렉토리 초안 사용자 컨펌 → A 단계 시작.

## 연결

- 비슷한 구조: [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) (Google DESIGN.md — 정적 명세 형) · [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) (큐레이션 69종)
- 진입 비교: [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) (skill harness 종합 — D 단계 평가 대상)
- 직접 활용: NPC dev harness (A 단계) 의 reference 구조 표본
- 패턴 1 (progressive disclosure): NPC 도메인 모든 reference 분리에 적용
- 패턴 2 (gate): 2026-04-25-npc-author-ethics welfare gate 자동화 진입점
- 패턴 5 (URL onboarding): 초파리 챕터 → [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](../techniques/role-llm.md) Profile 자동 추출
- 패턴 6 (taste gate): ai-npc-blueprint Layer 0 3축 출력 전 검증
