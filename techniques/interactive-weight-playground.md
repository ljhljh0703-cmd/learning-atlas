---
updated: 2026-06-22
---

# Interactive Weight Playground — "수식을 만져서 이해시키기"

> 트리거: 포폴/문서에 가중합·점수식·랭킹 로직이 있는데 "수식만 보면 왜 중요한지 모르겠다"는 피드백. 작가 확정 평가: **"슬라이더로 가중치 보여주는 것 베스트."**

## 문제
`S = w₁·S_personal + w₂·S_pop + w₃·S_recency` 같은 식은 **정적으로 보면 "그래서 뭐?"**. 비전문가 면접관은 가중치가 결과를 어떻게 바꾸는지 상상 못 한다.

## 해법 (패턴)
1. **고정 후보 N개**(예: 책 6권), 각 항목에 점수 컴포넌트(S_personal/S_pop/S_recency 등) 값을 부여. → 예시 데이터, 정직 라벨 필수("실측 eval 아님").
2. **슬라이더 3개**(w₁/w₂/w₃, 0~100) → 합으로 정규화 → `final = Σ wᵢ·sᵢ` 실시간 계산.
3. **실시간 재정렬 + 막대 + 1위 하이라이트** → 같은 후보인데 1위가 바뀌는 걸 눈으로.
4. **프리셋 버튼**(콜드스타트/웜/신간중심/올인)으로 극단 대비를 한 클릭에.
5. **테이크어웨이 1줄**: "같은 N개인데 1위가 바뀐다 — 결과를 정하는 건 모델이 아니라 기획자가 설계한 수식."

## 정직성
- 후보·컴포넌트 점수는 **예시 데이터**임을 명시. 실제 성능 지표(Precision·Bad Rate 등)와 분리 라벨.
- 수식 구조·가중치 의미는 실제 설계와 일치시킬 것(거짓 구조 금지).

## 구현 메모 (self-contained)
- **⚠ 클래스 네임스페이스 필수(교훈)**: 기존 페이지에 컴포넌트를 삽입할 땐 모든 클래스에 고유 접두사(`rl-` 등)를 붙인다. 제네릭명(`.bk`·`.info`·`.br`·`.tt`·`.sc` 등)은 기존 CSS와 충돌해 *다른 섹션을 깨뜨린다*. 실제 사고: `.bk`가 북켓몬 임베딩 벤치마크의 `.bench-metric .bk` 라벨과 충돌 → display:grid+흰배경이 라벨에 먹어 글자 세로 깨짐. → `.rl-bk` 등으로 격리해 수정. 삽입 후 **인접 섹션까지 렌더 회귀 확인** 필수.
- vanilla JS IIFE(전역 오염 0, 기존 reveal IO와 분리), CSS는 페이지 토큰(`--brand`/`--accent`/`--line`...) 재사용 → 시리즈 톤 자동 일치.
- `prefers-reduced-motion` 가드, range thumb `-webkit`/`-moz` 양쪽.
- 막대 width transition만(레이아웃 reflow 최소).

## 적용 이력
- 2026-06-22 **북켓몬 포폴**(AI-Book-Curation) 수식 박스 직하 삽입 → GitHub Pages 재배포. 같은 6권이 웜→미드나잇, 신간중심→트렌드코리아로 1위 전환.

## 참조
- design-taste (느낌→방향) · [HTML/CSS/JS Premium Interaction & Animation Learnings](../methods/html-interaction-learnings.md) · 적용 파일: `북켓몬/북켓몬-포트폴리오.html` · 공개: https://ljhljh0703-cmd.github.io/AI-Book-Curation/portfolio.html
