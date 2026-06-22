---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [prompt-pattern, consistency, visual, anchor]
category: method
---

# Pattern: Visual Anchor Consistency (비주얼 앵커 일관성)

## 🎯 적용 상황 (Problem)
- 이미지 생성 AI를 이용해 같은 캐릭터의 여러 동작이나 상태를 만들 때, 매 생성마다 캐릭터의 외형(색상, 옷, 이목구비)이 조금씩 변하는 '캐릭터 표류(Character Drift)' 현상이 발생할 때.
- 텍스트 묘사만으로는 복잡한 캐릭터 디자인의 일관성을 유지하기 힘들 때.

## 🛠️ 솔루션 (Instruction)
"가장 기준이 되는 **'정석 이미지(Canonical Image)'**를 먼저 확정하고, 모든 후속 생성 시 이 이미지를 시각적 참조(Visual Reference)로 강제하라."

1. **Phase 1 (Anchor)**: 캐릭터의 핵심 특징이 모두 담긴 베이스 이미지를 생성하여 고정한다.
2. **Phase 2 (Reference)**: 세부 동작(걷기, 공격, 슬픔 등)을 생성할 때, "이 캐릭터는 [Anchor Image]와 동일한 특징을 가져야 한다"는 지시와 함께 이미지를 함께 주입한다.
3. **Phase 3 (Unified Output)**: 생성된 결과물들을 하나의 규격(예: 8x9 그리드)으로 통합하여 기술적 정합성을 맞춘다.

## 📊 실험 및 관측 (Evidence)
- **OpenAI Hatch Pet**: 이 패턴을 통해 72프레임의 애니메이션 전반에서 캐릭터의 일관성을 90% 이상 유지함.
- **hwigi-tower (제안)**: 마타이오스의 S0(정상) 이미지를 앵커로 잡고, S4(붕괴) 상태를 생성할 때 이를 참조하면 '원래 모습이 일그러진' 느낌을 정확히 연출 가능.

## ⚠️ 트레이드오프
- 앵커 이미지가 잘못 잡히면 모든 애니메이션이 어색해짐. 초기에 최적의 앵커를 뽑는 데 시간이 소요됨.

---

## 🚀 Skill 화를 위한 메타데이터
- **Version**: 1.0
- **Target Models**: DALL-E 3, Midjourney, Stable Diffusion, GPT-4o (Vision-capable)
- **Primary Use**: Character design, Game assets, Consistent branding
