---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [tool-use, toolformer, api-call, parser, structured-output, papers]
source:
  - https://doi.org/10.48550/arXiv.2302.04761
  - arXiv:2302.04761
category: technique
---

# Toolformer: Language Models Can Teach Themselves to Use Tools (Schick et al. 2023)

*Timo Schick, Jane Dwivedi-Yu, Roberto Dessì, Roberta Raileanu, Maria Lomeli, Luke Zettlemoyer, Nicola Cavedon, Thomas Scialom*

언어 모델이 스스로 외부 API 호출 스키마를 텍스트 내에 자연스럽게 삽입하여 정밀 수학 연산이나 외부 도구를 사용할 수 있도록 하는 자가 학습 기법.

---

## 한 줄 요약

> LLM이 자연어 문맥 생성 중에 외부 연산기 호출 스키마 토큰을 자발적으로 삽입하고 그 반환값을 추론에 녹여내어, 언어 모델 특유의 계산 왜곡 및 할루시네이션(Hallucination)을 기술적으로 극복하는 기법.

---

## 핵심 개념

### 1. API Call Insertion (API 호출 토큰 삽입)
* **메커니즘**: 모델이 출력을 생성하는 도중, 계산이나 검증이 필요한 지점에서 `[Calculator(3 * 5)]`와 같은 특정 호출 마커를 출력.
* **통합**: 시스템이 이 마커를 파싱하여 외부 엔진(계산기, DB, 전투 처리기)에 넘기고, 반환된 값 `15`를 다시 컨텍스트에 주입하여 모델이 출력을 안정적으로 이어가게 만듦.

### 2. Self-Supervised Bootstrapping
* 어떤 시점에 외부 도구를 호출하는 것이 적절한지 모델 스스로가 데이터셋 내에서 호출 전후의 Perplexity 개선 메트릭을 평가하여 자율적으로 학습하는 구조.

---

## 기술 스택 / 사용법
* **적용 스키마 예시**:
  `"Isabella는 칼을 휘둘러 고블린을 공격했다. [CombatResolver(Attack, Isabella, Goblin, Sword) -> Damage: 12] 고블린은 12의 치명타를 입고 비틀거렸다."`

---

## 내 생각 — libgdx-rogue-os 적용 관점

### 1. 멘탈 모델 (Mental Model)
* AI가 게임의 상세 룰이나 수학적 확률 연산(명중 보정, 데미지 공식)을 어설프게 모사하며 말로 지어내지 않고, 확정적인 API 스키마 토큰을 던져 **게임 코어 엔진(adapter/resolver)에게 주도권을 위임**하는 외주/협업 모델.

### 2. 논리적 맹점 (Logical Blind Spots)
* 7B 이하의 경량 로컬 SLM 환경에서는 문맥 정합성과 괄호 쌍(`[...]`), 쉼표 위치 등 구조화된 스키마 무결성(Well-formedness)을 사수하는 능력이 불안정하다. 프롬프팅만으로는 100% 규격화된 출력을 보장하기 힘들며, 이는 런타임에 파싱 예외(Parsing Exception)를 야기함.

### 3. 기회비용 및 임계점 (Opportunity Cost & Threshold)
* 부정확하거나 임의로 변경된 스키마 출력을 잡기 위한 고도의 밸리데이터 파서 및 예외 복구(Fallback) 코드를 게임 엔진 단에 상시 배치해야 하는 개발 공수적 부담.

### 4. 처참한 실패 시나리오 (Catastrophic Failure Scenarios)
* 몬스터 AI가 플레이어의 공격을 처리하는 도중 토큰 생성 에러로 잘못된 형태의 데미지 인자(예: `[CombatResolver(Attack, NaN, -999)]`)를 방출하고, 이를 파서가 걸러내지 못해 게임 코어의 플레이어 HP 상태가 오염되어 캐릭터가 무적으로 변하거나 런타임 NullPointerException 크래시로 게임이 프리징되는 시나리오.

---

## 깊이 판별 질문 (Depth-Check Questions)

1. LLM이 뱉은 잘못 형성된(Malformed) API 호출 텍스트를 게임 엔진 단에서 파싱하여 안전하게 롤백하기 위한 문법적 검증기(Parser Validator)의 정규식 혹은 토크나이저 한계 극복 기법은 무엇인가?
2. Toolformer 구조를 차용해 API 반환값이 모델의 다음 토큰 생성에 미치는 영향을 제어할 때 발생하는 지연 시간을 프레임 대기 루프에서 어떻게 마스킹(Masking)할 것인가?
3. API 호출 토큰에 게임 내 기밀 데이터(예: 아직 밝혀지지 않은 안개 너머의 맵 좌표 등)가 유출(Leakage)되는 보안 위협을 막기 위한 콘텍스트 샌드박싱 방식은 무엇인가?

---

## 다음 학습 후보

* [Pattern: Structured Output Gate (구조화 출력 게이트)](../methods/prompt-pattern-structured-output-gate.md) — 구조화된 출력을 보장하는 JSON 스키마 가드레일 기법
* **LangChain Tool Calling parser specs** — 실무 툴 파싱 엔진의 예외 fallbacks 및 구조 벤치마크
* [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md) (OliverS) — 로컬 모델 상에서의 컨텍스트 적용 연동 스터디
