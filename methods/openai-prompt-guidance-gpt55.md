---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [openai, gpt-5.5, prompting, agents, workflow]
source: https://developers.openai.com/api/docs/guides/prompt-guidance?model=gpt-5.5
category: method
---

# GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅

*OpenAI*

[GPT-5.5은 이전 모델들보다 추론 능력이 비약적으로 향상되어, 구체적인 프로세스를 일일이 지시하는 대신 '최종 결과(Outcome)'와 '성공 기준'을 정의하는 것만으로도 고품질의 결과물을 낼 수 있습니다. 본 가이드는 GPT-5.5에 최적화된 새로운 프롬프팅 패러다임을 다룹니다.]

---

## 한 줄 요약

> 과정(Process)이 아닌 목적지(Outcome)를 묘사하여 모델의 추론 공간을 확보하고 효율성을 극대화하는 프롬프팅 전략.

---

## 핵심 개념

### 1. 결과 중심 프롬프팅 (Outcome-First Prompting)
- "어떻게(How)"를 상세히 설명하는 대신, **"무엇이(What) 성공인가"**에 집중합니다.
- 지나치게 상세한 단계별 지시는 오히려 모델에게 노이즈가 되어 추론 범위를 좁힐 수 있습니다.

### 2. 의사결정 규칙 (Decision Rules)
- 무조건적인 `ALWAYS`, `NEVER` 보다는 모델이 판단할 수 있는 **판단 근거**를 제공합니다.
- 예: "정보가 부족하여 명확한 리스크가 있을 때만 질문하라" (무조건 질문 금지).

### 3. 검색 예산 및 종료 규칙 (Stop Rules)
- 도구 사용 시 "충분한 증거가 확보되었는가?"를 자문하게 하여 불필요한 루프와 레이턴시를 방지합니다.

---

## 추천 프롬프트 구조 (Modular Block)

1.  **Role**: 역할 및 컨텍스트 (1-2문장)
2.  **Personality**: 톤(성격) 및 협업 스타일 (진행 우선 vs 질문 우선)
3.  **Goal**: 사용자에게 보여질 최종 목표
4.  **Success Criteria**: 작업이 완료되었음을 판단하는 기준
5.  **Constraints**: 정책, 안전, 증거의 한계
6.  **Output**: 형식, 길이, 대상
7.  **Stop Rules**: 중단, 도움 요청, 폴백 조건

---

## 내 생각 — AI NPC 관점

### 직접적 연결: [높음]

- **마타이오스(NPC) 프롬프트 최적화**: 이전의 장황한 "너는 누구고, 어떻게 말해야 해" 식의 프롬프트를 **"마타이오스가 이 대화를 통해 달성해야 할 정서적 목표"**와 **"금지선"** 중심으로 슬림화할 수 있습니다.
- **W1-2 on-device 모델 검증**: SEED 0.5B 같은 작은 모델에서도 이 '결과 중심' 구조를 적용하면 추론 노이즈를 줄여 성능을 끌어올릴 수 있을 것으로 기대됩니다.

### 개념적 수확

1.  **Preamble 전략**: 도구 사용 전 1-2문장으로 현재 상황을 요약하게 하는 것은 사용자의 대기 경험(Perceived Performance)을 개선하는 훌륭한 패턴입니다. (Warp 터미널 작업 시 유용)
2.  **Phase 파라미터 활용**: `commentary`와 `final_answer`를 구분하여 에이전트의 중간 사고 과정과 최종 대사를 분리 관리할 수 있습니다.

### 블루프린트 연결

- **Layer 2 (대화)**: NPC 대사 생성 프롬프트를 'Success Criteria' 기반으로 재설계하여, 서사적 목적 달성 여부를 에이전트가 스스로 판단하게 함.

---

## 열린 질문

- 'Outcome-First' 방식이 0.5B 크기의 초소형 모델에서도 성능 향상을 가져올까? 아니면 거대 모델(Haiku/4o-mini 이상)에서만 유효한가?
- 'Stop Rules'를 NPC의 '침묵'이나 '대화 종료' 시점에 어떻게 적용할 수 있을까?

---

## 다음 학습 후보

- **[Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md)** — 본 가이드의 기술적 실천 판 (이미 학습됨)
- **[structured-outputs](prompt-pattern-structured-output-gate.md)** — Success Criteria를 기계가 읽을 수 있는 형태로 구현하는 법
- **Prompt Caching 전략** — Modular Block 구조에서 고정된 섹션(Role, Success Criteria)을 캐싱하여 비용 최적화

---

## 연결된 페이지

- [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md)
- [OpenAI Codex CLI — 로컬 에이전틱 코딩 엔진](openai-codex-cli.md)
- hwiglija-tower-design-agenda
