---
created: 2026-07-21
updated: 2026-07-21
tags: [agent-skills, skill-wiki, multimodal, distillation, retrieval, grep-vs-vector, provenance, teardown]
type: learning
source: [https://arxiv.org/abs/2606.29538]
authors: ["Yijia Fan", "Zonglin Di", "Zimo Wen", "et al."]
year: 2026
category: technique
---
<!-- RESOURCE2SKILL(arXiv 2606.29538) 해체 — 멀티모달 자료(영상·레포·글)→provenance 붙은 계층 Skill Wiki 증류→grep+계층 검색. 작가 vault 아키텍처의 벤치마크판. grep>벡터·영상 비대체성 실측. -->

# Multimodal Resource → Skill Wiki (RESOURCE2SKILL 해체)

> **정체**: 튜토리얼 영상·레포·논문·아티팩트를 *실행가능 스킬*로 증류해 provenance·택소노미 붙은 **계층적 Skill Wiki**로 만들고, 추론 때 **grep(BM25)+계층 → LM 선택**으로 검색·조합, 부족하면 온라인 획득. 7 저작 도메인에서 무스킬 대비 **+11.9pp**, 28셀 중 26 우위. 출처: Fan 외, arXiv 2606.29538 (2026-06, v4). read-only 해체 2026-07-21.
> **왜 중요**: 이건 *작가 vault 아키텍처의 벤치마크판*이다 — 아래 §vault delta 참조.

## 실제 메커니즘
1. **증류 파이프라인**: 자료 검색 → *결정론적 모달리티 추출*(영상=키프레임 / 레포=AST 코드영역 / 글=문단 / 아티팩트=렌더 이미지) → 비전-LM이 구조화 JSON 증류 → **5 수용 게이트**(완전성·provenance·중복제거·모달 일관성·구조 실행성) + SHA1 skill_id.
2. **스킬 엔트리 `(p, x_text, x_visual, x_code, m)`** — 택소노미 경로 + 구조화 산문(메커니즘·적용조건·입출력·기대효과) + 비주얼 + 실행 코드 + 메타(태그·provenance·검증). 디스크 `skills_wiki/<도메인>/<id>/{source,text,visual,code,meta.json}`.
3. **검색 = hierarchy-then-LM (MetaBrowse)**: BM25가 이름+태그+적용성+**택소노미 경로**로 top-20 → LM이 5개 선택(맞는 게 없으면 0개). 코드는 MCP로 *직접 실행*(LM 번역 없음), 참조전용 스킬은 에이전트 코드생성 가이드.
4. **온라인 획득**: 오프라인 풀 부족 시 *같은 연산자*로 표적 검색→증류→검증→별도 온라인 풀(오프/온 분리로 갭필 vs 무한 컨텍스트 확장 격리).

## 아블레이션 골드 ★
- **영상이 대체 불가능** — 빼면 −9.5pp(68.9→59.4). **영상-only(66.8%) > 3-소스-무영상(59.4%)**. 영상은 텍스트·코드가 못 잡는 *시간적 조작·시각 효과*를 담음.
- **멀티모달**: text+visual+code가 text-only 대비 +3.9pp(visual·code 각 ~2pp 독립).
- **검색: 계층-then-LM(68.9) ≫ 밀집 임베딩(60.0)** — grep/BM25가 벡터 RAG를 ~9pp 압도. (BM25+리랭크 64.2, 랜덤 58.0.)
- **계층**: 평평 리스트도 무스킬 +9.1pp, 계층은 +2.5pp 추가.
- **스킬 스케일링**: ~200–400개 포화(초기=공통 조작, 후기=도메인 갭필).
- **온라인 획득**: 표준 +0.7pp(미미), *갭-스트레스* **+21.6pp** — 표적 갭필러지 일반 부스터 아님.

## 냉정 평가 (흡수 규율 ①한계)
- **단단**: 7도메인·아블레이션·인간 A/B(85.5% 승) 견실. grep>벡터·영상 비대체성·계층 이득은 실측.
- **경계**: ①**판정 의존** — 점수가 GPT 비전 저지 경유(인간 일치도 α=0.58=보통). +11.9pp는 *심미 루브릭 저지 측정치*지 태스크 성공률 아님 → 인플레 위험. ②**일반화 한정(저자 명시)** — *프로그래밍 도구 인터페이스 + 공개 절차 콘텐츠*가 있는 저작 도메인만(PPT·Blender·Unreal 등). 범용 에이전트 스킬 주장 아님. ③**파라미터 바인딩이 진짜 병목** — "스킬은 에이전트가 파라미터를 바인딩하는 능력만큼만 유용"(Excel 수식·Blender 파라 실패).

## vault delta / synergy ★ (핵심 — 이 논문 = vault의 벤치마크판)
이번 세션 자체가 데모 — 영상(Pantry Depths)·레포(OpenMMO/gostop/recart)·논문(J-lens)을 provenance 붙은 techniques로 증류한 게 RESOURCE2SKILL 파이프라인의 *수동 실행*.
- **이미 하는 것(선행 ④)**: provenance frontmatter · ③Gate(=5 수용 게이트) · grep+graphify 계층 검색(=hierarchy-then-LM) · hermes-loop ⑤Distill·온라인 획득 등가 · skill-curator · [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) · [지식 하네스 레지스트리 — Knowledge Harness Registry](../methods/knowledge-harness-registry.md).
- **외부 검증**: **[Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md)**(grep>벡터, vault 벡터 미도입 선택)를 이 논문이 재확인(계층+BM25 ≫ 밀집 임베딩 ~9pp). vault 검색 독트린 정당화.
- **훔칠 것(vault에 없는 것, 3개)**: ①**멀티모달 스킬 포맷** — SKILL.md가 text+meta 위주라 *visual/code 바디 분리*가 약함(논문: 각 ~2pp). ②**영상 비대체성** — vault가 영상 자료를 덜 씀(작가 게임영상 분석이 이 신호). ③**파라미터 바인딩**을 스킬 품질의 진짜 축으로. → [지식 하네스 레지스트리 — Knowledge Harness Registry](../methods/knowledge-harness-registry.md)에 비권위 참조 후보로 반영(2026-07-21).
- **북극성**: "인간 멀티모달 자료 → 재사용 스킬 → 작가 작업 수행" = 파트너 텔로스의 정확한 메커니즘을 벤치마크로 정당화.
- **반영**: [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) ①Apply — knowledge-harness-registry 비권위 참조. paper-study full-archive 미실행(경량 흡수).
