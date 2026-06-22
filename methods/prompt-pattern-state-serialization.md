---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [prompt-pattern, state, architecture, persistence]
category: method
---

# Pattern: State Serialization (상태 직렬화 매니페스트)

## 🎯 적용 상황 (Problem)
- 에이전트가 대화 세션이 종료되면 현재의 감정 상태, 관계 지수, 물리적 수치(체력 등)를 잊어버릴 때.
- 에이전트의 '내면 상태'를 외부 시스템(게임 엔진, UI)과 동기화해야 할 때.

## 🛠️ 솔루션 (Instruction)
"에이전트에게 출력의 일부로 **현재 상태를 요약한 JSON 매니페스트**를 강제하고, 이를 영구 저장소에 기록하라."

1. **Schema 정의**: `{ "emotion": "sad", "affinity": 0.8, "tags": ["remembers_betrayal"] }`
2. **Mandate**: "답변 끝에 반드시 현재 상태를 반영한 JSON을 포함하라."
3. **Loop**: 다음 세션 시작 시, 저장된 JSON을 컨텍스트의 최상단에 주입.

## 📊 실험 및 관측 (Evidence)
- **Hatch Pet**: `pet.json`을 통해 펫의 애니메이션과 욕구 수치를 플랫폼 간 이동 및 유지.
- **hwigi-tower**: `reflections` 테이블에 PAD 좌표와 키워드를 저장하여 회차 간 NPC 정체성 유지에 사용 중.

## ⚠️ 트레이드오프
- 출력 토큰 소모 증가. 포맷 파괴 시 시스템 오류 발생 위험 (`[Pattern: Structured Output Gate (구조화 출력 게이트)](prompt-pattern-structured-output-gate.md)` 결합 필수).

---

## 🚀 Skill 화를 위한 메타데이터
- **Version**: 1.0
- **Target Models**: All (Best with Structured Outputs support)
- **Primary Use**: Long-term memory, RPG Stats, NPC Persistence
