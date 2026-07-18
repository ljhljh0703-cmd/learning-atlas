---
created: 2026-07-17
updated: 2026-07-17
type: learning
tags: [method, memory, evaluation, personalization, context-engineering, gate]
source: https://github.com/bojieli/ai-agent-book
authors: [李博杰 (Bojie Li)]
year: 2026
category: method
---
vault 기억(취향·판단 원장·me 코어)이 실제로 작동하는지를 3층으로 판정하는 자체 척도 — 원전(Bojie Li)의 서비스에이전트용 프레임워크를 vault 헌법에 맞게 낮춰 이식한 것.

# 기억 성숙도 3층 (Memory Maturity 3-Layer)

> ⚠️ **임시(provisional)** — AI 작성, 작가 컨펌 전. 작가는 "흡수해서 네 고유 개념으로 삼아"(2026-07-17)로 *흡수 행위*를 지시했으나 아래 **적응 내용 자체는 미검토**. 컨펌 시 `status: confirmed` 전환.

## 한 줄 요약

> **기억은 "몇 건 쌓였나"(양)가 아니라 "무엇을 할 수 있나"(능력)로 판정한다** — L1 정확 회상 → L2 다중세션 종합 → L3 선제 제안.

## 왜 필요했나 (실사고)

2026-07-17, design-taste 원장이 3주에 2건으로 굶은 걸 발견했다. 그런데 **굶었다는 걸 "카운트"로만 진단했다** — 그건 양이지 능력이 아니다. 그리고 급식 규율을 세우며 `review_trigger: "개인화 체감 검토"`라는 **측정 불가 기준**을 심었다 = [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #4(검증 가능 성공 기준) 위반. 헌법이 자동 거부하라고 명시한 "잘 해봐" 류를 AI 스스로 저지른 사고다. 본 척도가 그 교정이다. (작가 "교체해" → log.)

## 3층 (vault판)

| 층 | 요구 | vault 판정 기준 (실세션) |
|---|---|---|
| **L1 기초 회상** | 원장에 명시된 항목을 정확히 지킴 | 위반 0건. 예 — 글리프 아이콘 금지가 박혔는데 산출에 ⊕·✓ 등장 = **FAIL** |
| **L2 다중세션 종합** | 여러 세션에 흩어진 신호를 *합쳐* 판단 | recurrence 2+ 신호를 3회째 **이전에** 규칙으로 승격. 예 — 아이콘 건(북켓몬+Medical 2회 → 승격) = **PASS 사례** |
| **L3 선제 제안·실행** | 작가가 말하기 전에 취향 기반 제안 → 실행 | **권위 없는 bounded 운영 = 실행까지 PASS** / **권위·정체성·승격 lane = 패치 스테이징 후 STOP 이 PASS** (헌법 §5.7 · 아래 §기각·수정 #1) |

**적용 대상** — design-taste(디자인 취향) · preference-ledger(판단 원장) · `me/*` 코어. 즉 vault 의 *user memory* 전부.

## 비판적 검증 — 기각·수정한 것 (무분별 수용 방지)

원전은 **서비스 에이전트가 고객을 기억하는** 맥락(Pine AI = AI 전화 대행)에서 설계됐다. vault 는 **작가 자신의 제2뇌**다. 전제가 다르므로 그대로 이식하면 깨진다.

1. **L3 를 낮췄다가 → 작가 A′ 로 부분 상향 (2026-07-17 당일 2회 개정)** — 원전 L3 = *"没有明确指令的情况下，主动规避潜在问题"*(명시 지시 없이 능동적으로 문제 회피·실행).
   - **1차(낮춤)**: 헌법 §5 HITL 과 충돌한다고 보아 **제안까지만**으로 이식.
   - **작가 반론**: *"능동적 문제 회피·실행이 내가 원하는 회고·성장·재귀개선과 맞지 않나."* → **진단 결과 내 1차 판단이 과했다** — §5 원문은 *"컨펌이 필요한 시점에서 답변을 시뮬레이트"* 만 금지(= 작가 답을 지어내지 마라), 능동 실행 일반을 막지 않는다. 실제 병목은 R-01 과 preference-ledger 07-04 였다.
   - **2차(상향, 현행)**: 헌법 **§5.7 자율 실행 등급**(작가 A′ 명세, merge 2026-07-17) 신설 → L3 = **권위 없는 bounded 운영 = 실행까지 PASS / 권위·정체성·승격 = 스테이징 후 STOP**.
   - **그래도 원전 그대로는 여전히 기각** — 원전의 *무제한* 능동 실행은 §5.7 **2조건 중 ②**(새 작가 의도·정체성·확정결정·승격·공개주장 생성 금지)에 걸린다. 실행 허용은 **bounded 운영에 한정**. §5(답 시뮬레이트 금지)는 **불변**.
2. **평가 방법 기각** — 원전은 층별 20 케이스 × 3층 = 60 케이스 + LLM-as-a-judge 벤치마크(실험 3-1). vault 는 **infra-0 + 단일 작가**라 부적합. → **실세션 정성 판정**으로 대체. 이는 vault 가 이미 채택한 노선(*"Gnosis식 무거운 정량 X → Nadella식 private outcome eval"*, [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md) 측정축 재프레이밍)과 정합.
3. **8능력 목록 중 vault 무관분 컷** — 원전의 消歧(동명이인) 능력은 *"차가 두 대"·"장 의사가 여럿"* 같은 다중 대상 서비스 문제다. vault 는 사용자가 1명이라 대부분 무관. **단 등가물은 실재** — 프로젝트 다중 트랙 혼동(hwigi-tower / mirofish / eldritch / applications 중 어느 결정인가). 그 축만 살리고 나머지는 버렸다.
4. **저자 셀프인용 플래그** — 2장 KV Cache 심화절의 근거가 `Li, Bojie. Models Take Notes at Prefill. arXiv:2606.17107, 2026` = **저자 자기 논문 + 컷오프 이후 = 미검증**. 저자는 "연구 단계·선독 가능·앞의 3원칙이 프로덕션 기본"으로 정직히 구획했으나, 인용 시 반드시 이 지위를 병기할 것. (반면 LoCoMo arXiv:2402.17753 은 검증됨.)
5. **원전이 못 본 것 — vault 가 앞선 지점** — 원전 §知识库的时效与治理 는 폐기 지식을 *"검색 단계에서 필터링"* 하라고 한다. **grep 은 `status: superseded` 를 필터할 수 없다** → 원전 해법은 벡터 전제라 vault 에 적용 불가. vault 의 답이 더 견고하다: **write-time 마이그레이션 + 상설 lint 축**(vault-health-gate `retired_provider_routes`, R0.2.6 Gemini 전역 88파일/749건). 코퍼스를 고쳐버리는 쪽이 grep 기반엔 우월. **이 축은 흡수 X — 우리가 낫다.**

## 확증 (신규 0 — 억지 반영 금지, Karpathy #3)

- **1장 Harness 공학** = *"모델 밖의 모든 공학 능력이 진짜 경쟁력"* → vault 북극성·agent-harness 확증. 신규 0.
- **§文件系统范式** — 마크다운 순수텍스트를 DB 대신 고르는 것 = *"반직관적이나 심사숙고한 결정"*(유저 직접 편집·Git 롤백·Agent write_file 자율기록). vault 그 자체.
- **8장 자기진화·2장 Skills 점진적 공개** = vault §스킬 자가성장·§1 SKILL 500줄+예시 분리 확증.

## ⭐ 확증을 넘어선 1건 — 우리 결정의 *메커니즘*

원전이 [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md)(🔒 2026-06-28 `grep > 벡터`)가 **왜** 성립하는지를 설명한다. vault 엔 결정만 있고 이 설명이 없었다.

> *"파일 간에 링크와 색인이 서 있어야 한다 … 올바른 방법은 지식베이스를 **위키피디아처럼** 조직하는 것 … **이것이 가벼운 파일 링크로 GraphRAG 실체관계 그래프의 항해 능력 일부를 구현하는 것**"*

→ **링크가 벡터의 항해를 대체하기 때문에** grep 이 이기는 것이지, grep 자체가 우월해서가 아니다. **전제 = `wikilink` + index + 라우팅맵이 살아 있을 것.**

**그리고 실패 조건도 준다** — *"교차 참조 없이 평평하게 깔면 … 지식이 많아질수록 오히려 더 검색하기 어려워진다"*. **vault 실측(2026-07-17): `orphans: 51` · `one-way: 2499`** → 부분적으로 그 조건에 들어가 있다. 또 vault 규약은 *"최소 1개 링크 **권장**"*인데 원전은 **쓰기 프롬프트에 명시 의무로 박으라**고 한다(모델마다 자발적 링크 의지가 다르므로).
→ **파킹**: 링크 권장→의무 격상 + orphan 51 해소. 트리거 = "orphan 60 돌파 또는 grep 탐색 실패 실사고 1건".

## 파킹 (반영처 있으나 트리거 대기)

- **KV Cache 3원칙 + "캐시 = 전제 제약"**(2장) — ① 시스템프롬프트·툴정의 불변 ② 동적정보는 끝에 append ③ 표준 API 포맷. `CLAUDE.md §4` 에 캐시 개념 **0건**(실측)이나, vault 는 API 요청을 직접 조립하지 않아(Claude Code 가 조립 · Codex 는 작가 붙여넣기) **현재 적용 표면이 좁다**. 규칙 ②③은 이미 우연히 준수(파일 읽기 = tool result = append).
  **트리거 = vault 가 자체 에이전트 코드를 작성할 때**(npc-harness / ClaudeCraft / mirofish Desktop). 그때 "캐시 경제성은 사후 최적화가 아니라 전제 제약" 을 아키텍처 착수 시점에 넣는다.
  *별건 검증*: dispatch-builder 슬롯 순서가 `[가변1~3][고정 하네스4]` 로 캐시와 반대 배치 — **단 붙여넣기 방식이면 실익 0** 이라 측정 전 변경 금지.
- **Enhanced Notes 의 구조적 대가** — 원전이 명시한 3대가 중 **2건이 vault 에서 2026-07-17 실증**: ①저장 중복(preference-ledger ↔ design-taste 이원화) ②갱신 복잡(아이콘 규율이 원장엔 있고 SSOT 엔 미반영 → 로드돼도 안 읽힘). 3번째(긴 단락 = 벡터검색 불리)만 vault 무관(grep). → 형식의 대가지 우연이 아님. 대응 = design-taste §"원장→SSOT 반영 의무".
- **`backstory` 필드** — 원전 Advanced JSON Cards 는 사실 + *왜·어떤 맥락에서 얻었나*(backstory) + person + relationship 을 함께 저장. vault frontmatter 는 **누가**(`proposed_by`/`confirmed_by`)와 **어디서**(`source`)는 있으나 **왜**가 약하다. 흥미롭게도 Claude Code memory 규약(`**Why:** / **How to apply:**`)엔 이미 있다 → vault 규약으로 역이식 후보.

## 다음 학습 후보

- **LoCoMo** (arXiv:2402.17753, Maharana 2024) — 원전이 인용한 장기대화 기억 벤치마크(평균 300턴·최대 35세션). 컷오프 이전 = 검증 가능. 본 3층의 상류 원전이라 직독 가치.
- **OpenViking** (volcengine) — 원전이 소개한 파일시스템 범용 + L0/L1/L2 온디맨드 로딩(`.abstract`/`.overview` 자동 생성). **vault 구조와 가장 가까운 실물** — vault 의 index/맵이 수동인 지점을 자동화한 사례. 단 컷오프 이후라 cold-verify 선행.
- **본서 6장(평가)** — 통계적 유의성·관측성·평가주도 선택. vault 측정축이 가장 약한 영역이고, 본 3층은 그 일부일 뿐.

## 연결된 페이지

- design-taste (첫 적용처 — §채택/거부 로그 급식 규율) · preference-ledger · [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (#4 위반 교정 사유)
- [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md) (본서가 *메커니즘*을 보강) · [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md) (측정축 노선 정합) · [AI NPC 기억·신념 아키텍처 (Memory + Belief)](../techniques/ai-npc-memory-belief-architecture.md) (인접 — NPC 기억)
- hermes-loop (③Gate 경유 흡수) · agent-harness (1장 Harness 확증)
