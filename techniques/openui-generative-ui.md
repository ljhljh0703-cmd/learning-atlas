---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [openui, generative-ui, streaming-ui, llm-output-format, token-efficiency, ui-dsl, component-library]
source:
  - https://discuss.pytorch.kr/t/openui-json-ui-ui/11072
  - https://github.com/thesysdev/openui
  - https://www.openui.com/
authors: [thesysdev]
year: 2026
category: technique
---
<!-- OpenUI Lang 해체 — JSON 대신 스트리밍 UI DSL로 생성형 UI 토큰을 압축하는 패턴 -->

# OpenUI Lang — JSON 대신 스트리밍 UI DSL로 생성형 UI를 압축하는 패턴

## 핵심
LLM이 UI를 만들 때 verbose JSON 트리 대신, 사람이 미리 정의한 컴포넌트 라이브러리(registry)로 제한된 line-oriented DSL을 스트리밍 출력하게 하고, 렌더러가 이를 즉시 React 컴포넌트로 복원한다. 핵심 아키텍처:

```
component library -> schema에서 생성한 system prompt -> compact UI DSL 스트림 -> parser -> renderer -> error repair loop
```

## 왜 유효한가 (검증됨)
- 공식 repo clone(commit `ab151299dab1e958eb96ecc76e0d33bbc9cf7f8f`, 2026-07-04) 벤치마크 원문 대조 확인: 7개 UI 시나리오 합산 토큰 — OpenUI Lang 4800 / YAML 9122 / Vercel JSON-Render 10180 / Thesys C1 JSON 9948 (OpenUI Lang이 -47~53% 절감). **단 source-reported, 독립 재실행 안 함** — "항상 낫다/latency 절반" 같은 일반화는 과장(Anti-Overclaim).
- DSL 예시: `root = Stack([title, table])` 식 line 단위 assignment. JSON key 반복·중첩 괄호 제거, forward reference/hoisting 허용, root에서 안 닿는 statement는 버려짐.
- v0.5는 정적 UI를 넘어 reactive state(`$variable`)·two-way binding·tool call까지 확장 — tool/mutation은 allowlist·read-only 기본·explicit gate 없이 열면 위험.

## Sub-brain 적용 지점
- **HTML Agent/포트폴리오 발행**: raw HTML을 LLM에 바로 맡기지 말고 `Hero/EvidenceStrip/CaseStudySection/...` 같은 project-specific 컴포넌트 레지스트리 → compact DSL → renderer 변환.
- **AI NPC 운영/디버그 UI**: `NPCStatePanel/MemoryTimeline/RelationshipMatrix/GoalStack` 등 read-only 기본 inspector 패널.
- **Game Demo Video Spec**: 영상 분석 결과를 `root = GameSpec([loop, assets, mechanics, gates])` 식 compact DSL로 뽑아 asset/impl ticket·QA gate 분리.
- **Sub-brain RETURN/Gate 대시보드**: `SourceStatus/NoveltyMatrix/GateChecklist/HashManifest` 같은 고정 블록으로 RETURN 구조 안정화 — 토큰 절감 + Gate 판독 안정성 동시 확보.

## 제안 Gate 규칙
Component Contract Gate(registry 밖 이름 fail/repair) · Reachability Gate(root 미도달 statement 경고) · Streaming Gate(root/skeleton 우선 렌더) · Token Efficiency Gate(JSON/MD/DSL 비교 실측) · Parser Error Loop Gate(같은 오류 2-3회 반복 시 fallback) · Tool/Mutation Gate(read-only/mutation 분리, allowlist) · Anti-Overclaim Gate.

## 도입 적합/부적합
- 적합: 반복 생성형 UI, agent control panel, video-to-game-spec, RETURN dashboard, portfolio/case-study 생성기, NPC memory inspector.
- 부적합: 1회성 정적 페이지, 사람이 세밀 편집해야 하는 고급 디자인, 컴포넌트 라이브러리 미확립 상태, tool/mutation 권한 모델 미정리 상태.

## Skill Candidate (미승인 — 참고만)
`skills/openui-generative-ui/SKILL.md` 후보 제안(component library 정의 → prompt 생성 → DSL 생성 → parser/renderer 검증 → error repair → token/streaming gate 기록). **미승인** — 실제 사용처(HTML Agent 등)에서 1회 이상 적용 후 스킬화 여부 재검토.

## 관련
- [충실 추출 — Manavarya09/design-extract (designlang)](design-extract.md) — 인접하지만 다른 영역(디자인 토큰 추출, 본 패턴과 목적 상이)
- design-index · [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](../methods/ui-ux-pro-max-skill.md) · [UI Skills — Design Engineer용 라우팅 + MUST/NEVER 교정 게이트 skill 모음 (ibelick)](../methods/ui-skills-ibelick.md)

## 다음 학습 후보 (미착수)
Tambo AI · Hashbrown · A2UI · Vercel json-render · CopilotKit OpenGenUI · AG-UI
