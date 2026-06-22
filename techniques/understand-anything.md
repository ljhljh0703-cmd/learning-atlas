---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [knowledge-graph, graphify-comparison, karpathy-wiki, multi-agent, tree-sitter, guided-tour, superpowers, industry-convergence, clean-room]
source: https://github.com/Egonex-AI/Understand-Anything
authors: [Yuxiang Lin, Egonex]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "배울만한 거 배워. A로") — Claude 작성, repo clean-room 전문통독 + graphify 페이지 대조 grounding 기반 ③Gate PASS(출처 실존·환각0·코드복제 X). **흡수 = graphify 비교 + 진짜 delta만**(도구 자체는 graphify 중복 → infra-0).

# Understand-Anything — Karpathy-wiki→그래프 플러그인 (graphify 비교)

Egonex 의 멀티플랫폼 플러그인(Claude Code/Codex/Cursor/Copilot/Gemini/opencode/pi 등 17종, MIT, TS/pnpm). "any codebase/knowledge base → 인터랙티브 지식그래프 + React 대시보드". **superpowers 방법론으로 제작**(docs/superpowers/plans+specs, [Superpowers 해체분석 (obra/superpowers)](../methods/superpowers-teardown.md)). tree-sitter(결정론)+LLM(의미) 하이브리드, 멀티에이전트 파이프라인.

**왜 봤나** — `/understand-knowledge` 가 **Karpathy-패턴 LLM wiki(= 작가 Sub-brain 구조)를 그래프화**한다 → graphify의 직접 기능 경쟁 도구. 비교로 graphify 선택을 검증하고 *진짜 delta*만 흡수.

## 1. `/understand-knowledge` 5단계 (graphify 와 같은 일)

작가 vault 3층(raw/ · wiki .md+wikilink · CLAUDE.md schema · index.md · log.md)을 그대로 탐지:
1. **DETECT** — `index.md`+wikilink .md 다수 = Karpathy wiki 시그널.
2. **SCAN(결정론, `parse-knowledge-base.py`)** — wikilink·index.md 카테고리·heading·frontmatter LLM 없이 추출 → base 그래프.
3. **ANALYZE(LLM, article-analyzer subagent)** — 암묵 관계·엔티티·claim 추론(배치 10-15·동시 3).
4. **MERGE** — dedup(대소문자)·타입 정규화·index.md 카테고리→layer·**index.md 순서→가이드 투어**.
5. **SAVE** — 검증(dangling 엣지 제거). `kind:"knowledge"`→force-directed 레이아웃.

## 2. 🎯 정직한 비교 — graphify 가 코어에서 더 강하다

대조 결과(환각 주의 — graphify 페이지 실확인): 내가 처음 delta 로 의심한 "암묵 관계 추론/엔티티 추출"은 **graphify 에 이미 있다**. graphify 가 오히려 풍부:

| 축 | graphify (작가) | understand-knowledge |
|---|---|---|
| 하이브리드 | tree-sitter + LLM ✅ | 동일 ✅ |
| 암묵 관계 추론 | **Inferred Relations** ✅ | implicit relationships ✅ (대등) |
| 엔티티/의도 노드 | LLM Semantic Layer ✅ | entity/claim ✅ (대등) |
| **신뢰도 태깅** | **EXTRACTED/INFERRED/AMBIGUOUS** ✅ | ❌ 없음(merge만) |
| **God Nodes**(중추 개념) | ✅ | ❌ |
| 커뮤니티 | **Leiden** ✅ | clustering(불명확) |
| 증분/충돌해결 | Δ-processing·Git merge driver·LLM dedup ✅ | 증분 ✅, 충돌해결 약함 |
| 검색/소비 | MCP query 도구(에이전트 항해) | React 대시보드(인간 시각) |

→ **graphify 선택 정당화**: 작가 코어가 신뢰도 태깅·God Nodes·Leiden·MCP·시맨틱 충돌해결에서 트렌딩 경쟁 도구보다 앞섬.

## 3. 진짜 delta (understand 가 가진 것 — 흡수가치)

graphify 대비 understand 고유 = 대부분 *소비/교육 레이어*:
- **가이드 투어** 🌟 — index.md 순서를 *의존성 정렬 학습 경로*로. graphify 는 *그래프*를 주지만 understand 는 *읽는 순서*를 줌(온보딩 각). → vault navigation/graphify 출력 보강 아이디어.
- **diff 임팩트** — 변경 노드→영향 서브그래프(commit 전 ripple 확인). graphify shortest-path 로 근사 가능.
- **graceful degradation** — LLM 배치 실패해도 결정론 scan base 는 멀쩡한 그래프(fail-safe robustness).
- **페르소나 적응 UI**(junior/PM/power) + **domain view**(business flow 별도 그래프).
- **에이전트가 `intermediate/` 디스크 기록·context 미반환**(RTK) — 작가 원칙과 동일(확증).

## 4. 🗝️ 업계 수렴 확증 + 가드

- **수렴 확증** — 독립 트렌딩 도구가 "Karpathy wiki → 그래프"를 정확히 구현 = **vault-as-graph 접근 강한 정당화**([GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md)·claude-obsidian 에 이은 N번째). 게다가 graphify 가 더 정교 = 도구 선택 자신감.
- **가드(cold-verify)**: 도구 도입 = graphify 중복·infra-0(tree-sitter/pnpm/React). 흡수 = 비교 + 가이드투어/graceful degradation 개념. **delta 검증 교훈**: 처음 "암묵 추론"을 delta 로 의심했으나 graphify 실대조로 *이미 보유* 확인 — 비교는 추측 말고 1차 대조(text-to-lottie 오분석 교훈 연속선).

## 5. 학습→반영 (학습→반영 루프)

- **#1 (즉시)**: graphify 선택 검증 = 본 페이지 + graphify cross-ref(트렌딩 경쟁 도구보다 코어 우위 확인).
- **#2 (조건부 backlog)**: **가이드 투어**(index.md→의존성 정렬 학습 경로)를 graphify 출력 또는 vault navigation 에 적용 검토 — 트리거 = vault 온보딩/탐색 마찰 체감 시. 지금 강제 X(graphify 이미 충분, Karpathy #2).
