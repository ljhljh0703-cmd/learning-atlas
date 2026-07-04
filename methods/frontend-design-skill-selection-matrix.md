---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [method, design, frontend, html, skill-routing, selection-matrix, gate]
source: https://www.youtube.com/watch?v=gkxv6PCaAhw
authors: [AI Labs (Tech Bridge ko-sub)]
year: 2026
category: method
---
프론트엔드/HTML 작업 전 surface 를 먼저 분류하고 매칭되는 최소 디자인 스킬만 로드하는 선택 게이트.

# Frontend Design Skill Selection Matrix — surface 분류 → 최소 스킬 라우터

## 1. 한 줄 델타

영상이 나열한 디자인 스킬 목록 자체는 새 지식이 아니다. 쓸 자산은 **라우터 하나**다.

> UI/HTML 을 짓기 전에 *surface 를 먼저 분류*하고, 그 surface 에 맞는 디자인 스킬만 *최대 2개*(방향 1 + 구현 1) 로드한다. 무관한 UI 스킬 과적층(over-stacking)을 막는 게이트.

기존 vault 자산이 흩어놓은 원칙을 게이트로 묶는 약한 델타다. 새 method 아님 — *선택 규율*.

## 2. Surface → 최소 스킬 라우터

작업 시작 전 1회 실행.

1. **surface 분류**
   - `marketing` — 랜딩·포트폴리오·공개 페이지·캠페인 (디자인 자체가 제품)
   - `functional` — 대시보드·어드민·앱 셸·설정·툴 (작동이 제품)
   - `mobile` — iOS/Android/RN/Expo
   - `motion` — 스크롤 스토리·타임라인·영상형 히어로·애니 설명

2. **매칭 내부 노드 먼저 로드** (외부 스킬보다 vault 자산 우선)
   - marketing → [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) · [Awesome Design MD — DESIGN.md(Google Stitch) 포맷 + 55 실사이트 시스템](../techniques/awesome-design-md-teardown.md) · [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md) §AI slop
   - functional → 프로젝트 디자인 시스템 (shadcn 은 repo 가 실제로 쓸 때만)
   - mobile → 플랫폼 스킬 (웹 축소 X)
   - motion → [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) · [Comnyang 랜딩 Teardown — "무라이브러리 모션" 아키텍처](../techniques/comnyang-landing-teardown.md), 복잡도가 정당화될 때만 GSAP

3. **디자인 스킬 최대 2개** — 방향 1 (`frontend-design` / [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](ui-ux-pro-max-skill.md) / taste preset) + 구현 1 (shadcn / GSAP / Material 3 / SwiftUI / Expo). taste preset 은 *상호배타* — 하나만.

4. **코드 전 짧은 디자인 플랜** — 주제·청중 / 시각 방향 / 토큰 / 컴포넌트 전략 / 모션 전략 / 검증 뷰포트.

5. **렌더로 검증** (서술 아닌 렌더) — desktop·mobile 스크린샷, 오버랩/텍스트핏, 모션이면 성능 체크.

## 3. 살릴 규칙

- **방향이 코드보다 먼저.** 브리프가 모호하면 에이전트가 구체 주제·청중·시각 방향을 *먼저* 확정.
- **컴포넌트 라이브러리 ≠ 미감.** shadcn 은 컴포넌트 정확성을 풀 뿐, 제품별 방향은 못 푼다.
- **대시보드는 레이아웃 문제 먼저.** 그룹핑·밀도·위계·한 화면에 뭘 담을지가 핵심.
- **모션엔 직무를.** 디폴트 scroll reveal 회피, transform/opacity 우선, 결정적·저비용이면 mp4/CSS.
- **taste preset 은 배타적.** 방향 하나로 빌드를 제약.
- **모바일은 작은 웹 아님.** thumb zone·내비·간격·플랫폼 관용구를 명시 선택.
- **시각 자산은 실제 주제를 드러내야.** placeholder 류로는 공개 페이지에 부족 (구체 도구명은 미검증 — 일반 원칙으로만).

## 4. skill 후보 (incubate 보류)

`html-design-skill-router` — surface 분류 → 최소 스킬 선택 → 디자인 플랜 + 검증 체크리스트 출력. **후보 only.** 실 HTML 작업에서 이 패턴이 1회 더 반복되기 전엔 incubate 안 함 (Hermes ⑤ 기준). 외부 스킬 자동설치·vault 스킬 자동생성 금지.

## 5. 연결

- [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](ui-ux-pro-max-skill.md) — 제품타입→디자인시스템 추천 DB (방향 스킬의 한 옵션, 레버 창고)
- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) / [Awesome Design MD — DESIGN.md(Google Stitch) 포맷 + 55 실사이트 시스템](../techniques/awesome-design-md-teardown.md) — 디자인을 에이전트 가독 계약으로
- [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) / [Comnyang 랜딩 Teardown — "무라이브러리 모션" 아키텍처](../techniques/comnyang-landing-teardown.md) — 모션을 결정적 계약·CSS/mp4 우선으로
- design-index — 본 라우터의 상위 자산 지도
- 적용처: html-publish-guide — HTML 생성 전 surface 분류 + 최대 2스킬 게이트 (백로그)

## 6. 출처 노트

- 영상: https://www.youtube.com/watch?v=gkxv6PCaAhw (AI Labs, 2026-06-27, Tech Bridge 한글자막)
- Codex 가 yt-dlp 자막 + 설명란 링크 16개 실측(200×13/403×1/timeout×1/404×1) 후 추출. vault Claude ③Gate 재검증 통과 (인용 노드 5종 실재 확인, 링크 수치 일치).
- 제외: 설명란 dashboard 스킬 링크 404 (출처 무효) / Higgsfield·Seance 도구명 (독립 출처 미확보 → 일반 원칙으로만).
