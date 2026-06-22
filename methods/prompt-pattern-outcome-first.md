---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [prompt-pattern, outcome-first, reasoning]
category: method
---

# Pattern: Outcome-First (결과 중심 정의)

## 🎯 적용 상황 (Problem)
- 모델에게 너무 많은 '과정(How-to)'을 지시하여 추론 성능이 저하되거나, 불필요하게 긴 답변이 나올 때.
- 모델이 지엽적인 지시에 갇혀 최종 목표를 놓칠 때.

## 🛠️ 솔루션 (Instruction)
"어떻게 할지 설명하지 말고, **무엇이 성공인지**를 정의하라."

```markdown
# Goal: [최종 목표]
# Success Criteria:
- [기준 1: 결과물의 상태]
- [기준 2: 반드시 포함되어야 할 증거/데이터]
- [기준 3: 독자가 느껴야 할 감정/반응]
# Constraints:
- [절대 금지 사항]
```

## 📊 실험 및 관측 (Evidence)
- **GPT-5.5**: 지시어 길이가 40% 감소했음에도 불구하고 논리적 결점 없는 결과 도출 확인 (2026-04-30).
- **HyperCLOVA 0.5B**: 복잡한 단계 지시보다 '성공 기준' 명시가 포맷 유지에 더 효과적임.

## ⚠️ 트레이드오프
- 모델의 자율성이 높아지므로, '절대 금지 사항(Constraints)'을 더 정교하게 짜야 함.

---

## 🚀 Skill 화를 위한 메타데이터
- **Version**: 1.0
- **Target Models**: All (GPT-5+, Claude 3+, SLMs)
- **Primary Use**: Task planning, Narrative generation
