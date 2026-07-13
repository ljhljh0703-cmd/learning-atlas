---
created: 2026-07-06
updated: 2026-07-06
type: learning
category: method
tags: [ai-product, pitch, storytelling, prompt-compression, gate, video-teardown]
source:
  - https://www.youtube.com/watch?v=h9EnahTpwqY
  - https://www.youtube.com/watch?v=d_Ftrl3vfV0
authors: ["AgentOS (해설 채널)", "Veronica Hylak (원본 발표자, AI Engineer 컨퍼런스 'Hey AI')"]
year: 2026
---
<!-- YouTube 영상 해체분석 — AI 제품 피치를 Wound/Click/Transformation 3단 압축으로 만드는 법 + AI 작업지시 프롬프트 압축 템플릿 -->

# AI 제품 스토리 압축 게이트 — Wound / Click / Transformation

## 한 줄 요약

복잡한 AI 제품을 설명할 때는 기술 정의로 시작하지 말고, 고객의 상처(Wound)를 먼저 잡고, 누구나 떠올릴 수 있는 이미지(Click)로 제품을 고정한 뒤, 이전/이후 변화(Transformation)를 증거로 보여준다. 이 3단 구조는 마케팅 팁을 넘어 **AI에게 작업을 시킬 때 배경설명을 압축하는 프롬프트 패턴**으로도 쓸 수 있다.

## 핵심 구조

### 1. The Wound — 제품이 아니라 고객의 하루로 시작
기술어("agentic orchestration") 대신 고객의 반복 고통(구체적 장면)으로 시작한다. "불편함"이 아니라 "노트북을 창밖으로 던지고 싶은 순간" 수준의 세기여야 한다. AI 작업 지시에도 적용 — "지금 무엇이 실패하고 있는가"를 먼저 고정하면 모델의 불필요한 옵션 탐색이 준다.

### 2. Make It Click — 즉시 이해되는 이미지
정확성보다 먼저 mental image가 필요하다. 예: "AI 행동의 화재경보기"(≠ "agent observability platform"). 비유는 claim이 아니라 handle — 이후 상세 설명·제약·증거로 반드시 보정해야 한다.

### 3. Show The Transformation — Before/After를 나란히
추상명사("생산성 향상") 대신 관찰 가능한 diff(`30분 -> 10초`)로 보여준다. 실측이 아니면 `expected`/`illustrative`/`unverified`로 표시 의무.

## 고성능 AI 입력토큰 압축용 템플릿

```text
[Wound] 사용자/작업자가 지금 겪는 실패 장면:
[Capability] 내가 가진 기능 또는 만들려는 것:
[Click Image] 누구나 이해할 이미지/비유:
[Transformation] Before -> After / 측정값 또는 관찰 가능한 증거:
[Truth Gate] 검증됨: / 미검증·가정: / 과장 금지선:
[Ask] 이번에 AI가 만들어야 할 산출물:
```

## 판단 게이트 (Overclaim 방지 4항목)

| 항목 | pass | flag | reject |
|---|---|---|---|
| A. Wound Grounding | 실제 근거·장면 있음 | 출처 없는 일반론 | 존재하지 않는 문제를 판매용으로 꾸밈 |
| B. Click Image Safety | handle로 유용, 과장 위험 낮음 | 기능범위를 넓혀 보이게 함 | 못 하는 일을 하는 것처럼 보이게 함 |
| C. Transformation Evidence | 수치/증거/데모 경로 있음 | 수치가 예시인지 실측인지 불명확 | 추상 가치만 있고 변화 증거 없음 |
| D. Anti-Overclaim | 명확성+정직성 공존 | 문구는 좋으나 증거 문장 부족 | narrative가 evidence를 대체 |

## 한계

Wound 중심 서사는 "좋은 제품을 팔리게 하는 법"이지 "나쁜 제품을 좋게 보이게 하는 법"으로 오용 금지. 비유는 실제 감지범위·false positive·integration 조건과 분리해 밝혀야 한다. 연구/기술 문서에서는 정확한 정의·failure mode가 서사 뒤에 반드시 따라와야 한다.

## 학습→반영 루프 (반영처 후보)

- 포트폴리오/README/데모 설명 문구 작성 시 참조 — [포트폴리오 포지셔닝 피드백 (멋사 멘토)](../narrative/portfolio-positioning-feedback.md)·bespoke-html-direction과 병용 가능(서술 3축은 "무엇을 결정했나", 본 노트는 "어떻게 압축해서 전달하나" — 상보적, 중복 아님).
- AI 작업지시 프롬프트 압축(dispatch-builder 등)에 [Wound]-[Ask] 템플릿 참조 가능 — 반영 여부는 별도 판단.
- 판단 게이트(A-D)를 hermes-loop ③Gate 보조 체크리스트로 편입할지는 과잉 확장 우려로 보류(자동 편입 X).

## 다음 학습 후보 (미확정)
- April Dunford positioning 방법론, Jobs To Be Done 인터뷰 프레임 — 보류.
