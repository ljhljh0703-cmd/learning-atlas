---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [openai, agents, skills, assets, factory-pattern, states]
source: https://aiagentsdirectory.com/skills/openai-openai-skills-hatch-pet
category: method
---

# OpenAI Hatch Pet Skill — 에이전틱 에셋 팩토리

*OpenAI*

[Hatch Pet은 시각적 입력(이미지, 텍스트 묘사 등)을 받아 'Codex 호환 애니메이션 펫 스프라이트시트'로 변환, 검증, 패키징하는 전문 에이전틱 스킬입니다. 정적인 이미지를 상태(State)를 가진 디지털 생명체로 전환하는 가교 역할을 합니다.]

---

## 한 줄 요약

> 복잡한 그래픽 작업과 메타데이터 생성을 **Outcome-First** 관점에서 자동화하여, 즉시 실행 가능한 '상태 기반 에이전트 에셋'을 뱉어내는 **팩토리 패턴 스킬**.

## 기술 세부 사양 (Technical Spec)

### 1. 스프라이트시트 아틀라스 (8x9 Geometry)
- **그리드**: 8열 × 9행 (총 72프레임)
- **애니메이션 매핑 (표준)**:
    - **Row 0**: Idle (대기/숨쉬기)
    - **Row 1**: Walk (이동)
    - **Row 2**: Run (빠른 이동)
    - **Row 3**: Sleep / Rest (휴식)
    - **Row 4**: Interact / Play (상호작용)
    - **Row 5**: Happy / Celebrate (기쁨)
    - **Row 6**: Sad / Bored (슬픔)
    - **Row 7**: Special Action A (예: 먹기, 회전)
    - **Row 8**: Special Action B (예: 사라짐, 변신)
- **포맷**: PNG (투명 배경 필수), 프레임당 128x128 또는 256x256 권장.

### 2. `pet.json` 메타데이터
펫의 정체성과 애니메이션 정보를 담는 DNA 파일입니다.
```json
{
  "name": "Niblet",
  "species": "Axolotl",
  "description": "A tiny friend who loves debugging.",
  "personality": "Curious",
  "rarity": "Common",
  "atlas": "atlas.png",
  "frame_dimensions": { "width": 128, "height": 128 }
}
```

---

## 핵심 메커니즘

### 1. 상태 스키마 정의 (State-to-Manifest)
- 펫의 기분(Happiness), 배고픔(Hunger) 등 **상태 변수**를 정의하고, 이를 `pet.json`이라는 매니페스트 파일에 직렬화(Serialization)합니다.
- 스킬 자체는 상태를 저장하지 않고, **에셋이 상태를 담을 수 있는 그릇(Schema)**을 설계합니다.

### 2. 컴포지션 (Composability)
- 이미지 생성(`$imagegen`) 같은 기존 시스템 스킬을 직접 구현하지 않고 **호출(Compose)**하여 사용합니다.
- 생성된 이미지를 후처리 스크립트와 검증 엔진으로 연결하는 **오케스트레이션**이 핵심입니다.

### 3. 기술적 정밀도 (Validation Engine)
- 단순 생성이 아닌, 8x9 그리드 규격 준수 여부, 투명도 보정 등 '실행 가능성'을 보장하는 자동 검증 단계를 포함합니다.

---

## 내 생각 — AI NPC 관점

### 직접적 연결: [높음]

- **hwigi-tower NPC 에셋 파이프라인**: 마타이오스의 외형이나 훼손 상태(S0-S4)를 텍스트로만 묘사하는 대신, 이 스킬의 패턴을 빌려 **상태별 시각적 에셋을 자동 생성하고 검증하는 'NPC Hatchery'**로 확장할 수 있습니다.
- **상태 직렬화**: 우리가 `reflections.emotion_pad`를 SQLite에 저장하는 방식은 Hatch Pet의 `pet.json` 전략과 완벽히 동형(Isomorphic)입니다.

### 개념적 수확

1.  **에이전틱 유틸리티 (Agentic Utility)**: 에이전트가 "대화"만 하는 것이 아니라, 특정 규격을 만족하는 **'전문 산출물'**을 만들어내는 도구가 될 수 있음을 보여줍니다.
2.  **Outcome-First의 실체**: 사용자에게 "그리드 크기는 어떻게 할까요?"라고 묻지 않고, **"작동하는 펫"**이라는 결과를 위해 하위 기술 결정을 에이전트가 자율적으로 내립니다.

### 블루프린트 연결

- **Layer 1 (캐릭터 정의)**: NPC의 외형 에셋을 상태 머신과 결합하여 자동 패키징하는 'Asset Factory' 레이어로 활용.

---

## 다음 학습 후보

- **OpenAI Agents SDK** — 이 스킬들이 실제로 구동되는 하단 프레임워크.
- **[Pattern: State Serialization (상태 직렬화 매니페스트)](prompt-pattern-state-serialization.md)** — Hatch Pet의 매니페스트 전략을 일반화한 패턴 (신규 제안).

---

## 연결된 페이지

- [Prompt Engineering Pattern Library (Hub)](prompt-engineering.md)
- [GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅](openai-prompt-guidance-gpt55.md)
- hwiglija-tower-gdd
