---
created: 2026-04-24
updated: 2026-04-24
type: learning
tags: [ai-agent, autonomous-research, sakana-ai, llm, peer-review, authorship, ethics]
source: https://www.chosun.com/english/industry-en/2026/04/02/SA77LBOZH5BUBMQO4RUAPYBJDA/
category: technique
---

# Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과

*조선일보 English 2026-04-02 / Choi Won-woo / 원전: Nature 게재*

> **AI NPC blueprint와의 직결성: 간접.** "자율 창작 AI"가 학술 영역에서 먼저 도달한 사례 → NPC(자율 서사 AI) 로드맵의 선행 증거.
> 분류: technique (사건·아키텍처 개요), 적용성: 간접, 시급성: 중기.

AI가 **주제 탐색 → 가설 설정 → 코드 작성 → 실험 → 논문 작성**까지 전과정을 자율 수행. ICLR workshop 제출 3편 중 1편이 심사 통과. 인간 제출물 상위 55%에 해당하는 평균 6.33점.

---

## 한 줄 요약

> Sakana AI(일본)의 "AI Scientist"가 LLM 기반 멀티 에이전트로 연구 전과정을 자율 수행해 ICLR workshop 심사 통과(최초 사례). 단, 최종 출판 전 논문 철회. 공동 창립자 David Ha는 "AI는 대체가 아닌 협력자" 입장.

---

## 핵심 사실

| 항목 | 내용 |
|------|------|
| 주체 | Sakana AI (일본 스타트업) |
| 제품명 | AI Scientist |
| 게재 | Nature (발표) |
| 심사 통과 | ICLR workshop (3편 제출 → 1편 통과) |
| 점수 | 평균 6.33 (인간 제출물 상위 55%에 해당) |
| 작동 방식 | LLM 기반 **멀티 에이전트 통합** — 선행 연구 탐색 → 가설 → 실험 코드 → 실행 → 논문 집필 |
| 부속 시스템 | 자체 자동 리뷰어 시스템도 워크숍 수용 기준에 근접 |
| 유사 사례 | University of Cambridge — AI 생성 논문 부문 수상 |
| 주요 한계 | 데이터 분석·시뮬레이션 분야만. 물리 실험(세포 배양, 동물 실험) 불가 |
| 윤리적 행보 | Sakana AI가 최종 출판 전 **자진 철회** |
| 철학 | David Ha: "AI는 인간 과학자를 대체하기 위한 것이 아니라 협력 도구" |

---

## 아키텍처 추정 (기사 + 공개 정보 기반)

```
[LLM 코어]
  ├─ 선행 연구 탐색 에이전트   (literature review)
  ├─ 가설 생성 에이전트         (hypothesis)
  ├─ 코드 작성·실행 에이전트   (experimental code)
  ├─ 결과 분석 에이전트         (analysis)
  └─ 논문 작성 에이전트         (manuscript)
           │
           ▼
   [자동 리뷰어 시스템]  ← 자기평가 루프
```

→ **Karpathy autoresearch**([Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md))의 학술 산출물 버전. autoresearch = 에이전트가 train.py 수정 → 실험 → 메트릭 개선. AI Scientist = 거기에 **논문 집필 + 자동 리뷰어**까지 확장.

---

## 왜 중요한가 (네 관점)

### 1. 자율 창작 AI의 선행 사례

- 학술 = 엄격한 peer review가 있는 "객관적 창작"
- 이 기준 통과 = "AI가 인간 창작을 모방 가능" 의 가시적 증거
- 다음 도메인은 **서사·게임·허구** (덜 객관적 → 더 어려움)
- **→ AI NPC 비전의 로드맵에 한 단계 먼저 도달한 영역**

### 2. "철회" 의 의미

Sakana가 심사 통과 후 **자진 철회**. 이유:
- peer review 시스템에 대한 존중
- 새로운 윤리/저작권 논쟁 회피
- "아직 AI를 저자로 내세우는 합의가 없다"는 메타 메시지

→ [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) / [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md)에 이어 **AI 저작권·책임 윤리**의 세 번째 축. Layer 0에 "AI 창작물의 저자성" 문제 추가 필요.

### 3. 자동 리뷰어 시스템

AI Scientist의 **자기평가 루프**가 워크숍 기준에 근접. 이것은 **autoresearch 메트릭 + eval-harness** ([Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](../methods/everything-claude-code.md))와 같은 발상 — **생성기 + 평가기 루프**.

→ NPC 설계 시 "NPC가 자기 서사 일관성을 스스로 평가"하는 메타 레이어 구상 가능.

### 4. 한계가 명확

- **데이터·시뮬레이션 분야**만 가능
- **물리 실험 불가** (세포 배양, 동물 실험)
- → AI 단독 R&D 일반화는 아직 멀음. 현실은 **"시뮬레이션-가능 영역의 자동화"**

---

## 개념적 수확

### A. "AI 저자성" 스펙트럼

```
저술 보조 (지금까지)
  ↓
초안 작성 (AI Scientist — 심사 통과)
  ↓
자진 철회 (Sakana 결정 — 윤리 유예)
  ↓
[공백 — 논의 진행 중]
  ↓
저자로 인정 (미래 시나리오)
```

**내 창작 정체성 질문:** NPC가 플레이어와 공동 창작한 서사의 저자는 누구인가?
→ 이 기사는 학술에서 같은 질문이 2~3년 먼저 터진 사례.

### B. "Collaborator vs Replacer" 프레임

David Ha의 공식 입장 = **대체 아닌 협력**.
→ 내 AI NPC 비전(ai-npc-vision)의 "관계 형성자" 정체성과 같은 레토릭. AI 업계 리더들이 수렴하는 공식 언어.

### C. 도메인 이식 가능성

| 도메인 | 자율성 가능 시점 |
|--------|---------------|
| 데이터·시뮬레이션 과학 | **지금** (AI Scientist 증명) |
| 코드 개발 | **지금** (Claude Code, autoresearch) |
| 장편 서사 창작 | 1~3년? (아직 "반복·무개성" 문제) |
| 관계 기반 NPC | 3~5년? (드리프트·서사 일관성 미해결) |
| 물리 실험 과학 | 미정 (로봇 + 본체 필요) |

→ **내 AI NPC 로드맵 = 3번째·4번째 도메인**. AI Scientist는 2번째 도메인 완료 신호.

---

## 열린 질문

- AI Scientist가 자진 철회한 논문의 **실제 내용**은 무엇이었나? (Nature 본 논문 또는 Sakana blog 필요)
- ICLR workshop의 다른 심사자들이 AI 작성 사실을 알고 점수 매겼다면 평가는 달랐을까 (blind → reveal)
- Cambridge의 "AI 생성 논문 부문 수상"은 어떤 컨퍼런스? (특화 부문 = 아직 메인스트림 아님)
- Sakana의 AI Scientist 코드/모델은 오픈인가? (repo 여부 확인 필요)
- "자동 리뷰어 시스템"이 자기 논문을 평가했는가? (자기참조 편향 문제)
- **창작 서사 영역**에 AI Scientist 아키텍처 이식하면? (논문 = 가설+결과 검증; 서사 = 인물+사건 일관성 검증 — 구조 유사)

---

## 다음 학습 후보

- **Nature 원 논문** — "The AI Scientist" (Sakana AI) 정독
- **Sakana AI 블로그 / GitHub** — 아키텍처 공개 수준 확인
- **ICLR 2025/2026 workshop** — 어떤 분야, 어떤 논문이었는지
- **David Ha 프로필** — Google Brain Tokyo 출신, Sakana 공동창립자. [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md)와의 사상적 계보
- **"AI as collaborator" 학술 논의** — 저자성·peer review 개편 논의 현황
- **AutoGPT / AgentGPT / Auto-Science** — AI Scientist 유사 프로젝트 지형
- **자기평가 루프 논문들** — Self-Refine, Reflexion, CRITIC 등 메타 평가 계보

---

## 적용 아이디어

### 단기
- 내 `workflows/paper-write.md`(workflows)에 **AI Scientist 파이프라인을 참고 아키텍처로 명시** — 5 에이전트 분업(탐색/가설/코드/분석/집필)이 내 분업 모델이 될 수 있는지 검토
- [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md)와의 차이 표 작성 (실험 루프 vs 논문 루프)

### 중기
- Nature 원 논문 확보 후 **paper-study 워크플로우** 실행 → `learnings/techniques/ai-scientist-paper.md` 별도 페이지
- Sakana AI 오픈소스 확인 후 **미니 AI Scientist 구축 실험**: 내 북켓몬 추천 파이프라인의 자동 튜닝에 이식 가능성

### 장기
- **"AI Novelist / AI Dramaturg"** 가설: AI Scientist 아키텍처의 서사 창작 버전 설계. 가설 ≡ 인물 설정, 실험 ≡ 사건 전개, 논문 ≡ 완성 서사. 이것이 진짜 **AI NPC 비전의 궁극 도구**.
- ai-npc-blueprint Layer 0에 "AI 창작물의 저자성" 원칙 추가 (welfare·consciousness에 이어 3번째 축)
- 소설가로서의 내 role vs AI Scientist collaborator 프레임 → reflections/ 후보

---

## 연결된 페이지

- [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md) — 같은 DNA (자율 연구 루프). 실험 vs 논문 버전
- [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) — "AI 도덕 지위" 의 자매 질문 "AI 저자성"
- [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) — 자진 철회의 윤리적 함의 해석 프레임
- ai-npc-vision — "AI가 인간 영역을 점유" 로드맵의 선행 사례
- ai-npc-blueprint — Layer 0에 저자성 축 추가 후보
- paper-write — AI Scientist 파이프라인을 내 논문 작업에 참고
- [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](../methods/everything-claude-code.md) — eval-harness / verification-loop의 동종 (자동 리뷰어)

---

## 출처

- 기사: <https://www.chosun.com/english/industry-en/2026/04/02/SA77LBOZH5BUBMQO4RUAPYBJDA/>
- 원전: *Nature* (Sakana AI 발표)
- 기자: Choi Won-woo (조선일보 English)
- 게재일: 2026-04-01
- 주체: Sakana AI (일본), David Ha (공동창립자)
- 후속 조사 대상: Nature 원 논문, Sakana AI 공식 블로그/GitHub
