---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [agentic-search, retrieval, grep, vector-rag, harness, llm, benchmark]
source: https://arxiv.org/abs/2605.15184
authors: [Sahil Sen, Akhil Kasturi, Elias Lumer, Anmol Gulati, Vamse Kumar Subbiah]
year: 2026
doi: arXiv:2605.15184
category: technique
---
<!-- "Is Grep All You Need?" — 에이전트 검색에서 grep > 벡터 RAG 실증 + 하네스 지배성 (arXiv 2605.15184). -->

# Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)

> 출처: WebFetch arXiv abstract 검증(컷오프 2026-01 이후 논문 → cold-verify). 본 노트는 abstract 수준 — 전문 통독 시 보강.

## 한 줄 요약
> LLM 에이전트 검색에서 **grep(lexical)이 벡터 RAG보다 일반적으로 높은 정확도**. 단 *더 큰 변수는 하네스 설계·tool-calling 스타일* — "검색 방법"보다 "하네스"가 점수를 지배.

## 핵심 발견
- **Exp1**: 116문항(LongMemEval) × 4 하네스(Chronos·Claude Code·Codex·Gemini CLI), inline/file-based tool 결과. → "grep generally yields higher accuracy than vector retrieval."
- **Exp2**: 무관한 대화 이력을 점증 주입해 *방해물 강건성* 평가.
- ⚠️ **결정적 뉘앙스 (overclaim 가드)**: "overall scores still depend strongly on which harness and tool-calling style is used, even when the underlying conversation data are the same." → **하네스 설계가 검색 방법 선택을 압도하는 교란 변수**. "grep이 항상 이긴다"가 아니라 "하네스가 검색을 재구성한다".

## Sub-brain 연관 (강화 지점)
1. **[codebase-memory-mcp](../methods/codebase-memory-mcp.md) 설계 검증**: 그 도구가 순수 벡터 RAG에 안 기대고 grep/lexical/그래프/구조 **11-signal 융합**(번들 nomic 벡터는 1신호)을 쓴 게 *옳은 엔지니어링*임을 외부 실증. 노트의 "AI 임베딩 과장" caveat = 약점 의심이 아니라 **검증된 강점**으로 재해석.
2. **vault lookup 철학 검증**: vault 는 grep + graphify(그래프) lookup, *벡터 RAG 아님*(RTK·token-minimal). 본 논문이 이 선택을 뒷받침. [Google Open Knowledge Format (OKF) v0.1 — 에이전트 지식 표준](../methods/google-okf-knowledge-format.md)(markdown+graph·no vector)과 일관.
3. **agent-harness 직격**: "하네스가 에이전트 검색을 재구성" + "하네스 > 검색방법" = 북극성(모델독립 하네스) 명제의 *검색 도메인* 외부 확증. 도구의 가치 본질 = 검색알고리즘이 아니라 *하네스 통합*(예: PreToolUse hook).

## 학습→반영 ([학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md))
**3곳 merged (작가 명시 2026-06-28):**
- **반영처 1**: [codebase-memory-mcp](../methods/codebase-memory-mcp.md) §번들 시맨틱 caveat 외부검증 박제 ✅.
- **반영처 2**: CLAUDE.md §"불변 규율" **검색 방법(grep/그래프>벡터) 규율** 신설 ✅ — vault lookup grep+graphify=검증된 선택.
- **반영처 3**: agent-harness §**"검색방법 < 하네스 설계"** 신설(LOCKED) ✅ — 도구 평가축=하네스 통합 품질. + dispatch-builder **검색·RAG 설계 가드**(grep/메타 우선·벡터 1신호, 사주 RAG 자기보정) ✅.
- **과적용 가드**: "grep이 벡터보다 절대 우월"로 *과장 금지* — 논문 자체가 하네스 교란을 강조. vault가 벡터 RAG를 *안 쓰는* 현 선택의 *근거 보강*이지 벡터 전면 부정 아님.

## 연결된 페이지
- [codebase-memory-mcp](../methods/codebase-memory-mcp.md) · agent-harness · graphify · [Google Open Knowledge Format (OKF) v0.1 — 에이전트 지식 표준](../methods/google-okf-knowledge-format.md) · cold-verify-before-adopt

## 사설 KB production release-gate (park addendum, 2026-07-11 codex-gate)
<!-- private-knowledge-base-8-layers PARK 델타(grep>vector 재도출은 중복, release-gate만 신규). 트리거 발동 전 참조. -->
> ⚠ **조건부** — vault는 grep+router+graphify 유지(벡터 RAG 미도입, 본 규율 불변). 아래는 *만약* 사설 KB/RAG 파일럿이 greenlight될 때만 적용하는 production release-gate 체크(검색 품질 *너머*의 축):
- **ACL leakage rate**(권한 밖 문서 노출) · **authorized recall@k**(권한 내 재현율) · **evidence-provenance**(응답↔소스 추적) · **replay**(질의 재현) · corpus ownership·identity/ingestion control·bounded-agent state machine.
- 근거: production RAG는 retrieval 정확도가 아니라 *ACL·provenance·retractability*에서 깨진다. 트리거: RAG 파일럿 greenlight 시. (지금 신규 SSOT/결정 X.)
