---
created: 2026-06-05
updated: 2026-06-05
type: learning
tags: [prompt-pattern, structured-output, constraints, guardrail]
category: method
---

<!-- 프롬프트 패턴: LLM 출력을 스키마 유효 구조로 강제하는 게이트 -->

# Pattern: Structured Output Gate (구조화 출력 게이트)

> ⚠️ **임시 (provisional)** — Claude 가 Hub 의 빈 "Constraints" 슬롯을 채우려 신설. 작가 컨펌 전.

## 🎯 적용 상황 (Problem)
- LLM 출력을 코드가 *직접 소비*해야 하는데(파싱·함수 호출·DB 적재), 자유 서술이 섞여 파싱이 깨질 때.
- AI NPC 가 액션·감정·대사를 반환하는데 형식이 매 호출마다 흔들려 다운스트림이 불안정할 때.
- "JSON 으로 줘"라고만 했더니 코드 펜스·설명 문장·trailing comma 가 끼어들 때.

## 🛠️ 솔루션 (Instruction)
"형식을 *요청*하지 말고, 유효한 형식만 *통과*시키는 게이트를 세워라." 3중 방어를 순서대로 건다.

```markdown
# 1. Schema 명시 (계약)
Output MUST match this schema. No prose, no code fence, no trailing comma.
{
  "action": "<enum: move|talk|idle>",   // 허용값 고정
  "emotion": { "valence": <float -1..1>, "arousal": <float 0..1> },
  "line": "<string, 1문장>"
}

# 2. 실패 모드 선제 차단 (Negative Constraints)
- 스키마 외 키 추가 금지
- 모르면 추측 금지 → "action": "idle" 로 폴백
- 설명·인사·마크다운 래퍼 금지

# 3. 게이트 (런타임 검증)
파싱 실패 또는 스키마 불일치 시 → 출력 폐기 + 1회 재요청
("이전 출력이 스키마 위반. 위반 항목: <X>. 스키마만 다시.")
```

핵심은 #3 — 프롬프트는 형식을 *유도*할 뿐 보장하지 못한다. 코드 측 검증 게이트가 실제 보장을 만든다. 가능하면 모델 네이티브 기능(function calling / JSON mode / constrained decoding)으로 #1·#3 을 강제하고, SLM 처럼 그 기능이 없으면 프롬프트 계약 + 외부 validator 로 대체한다.

## 📊 관측 (Evidence)
- 일반: 네이티브 structured output(function calling·JSON schema)은 프롬프트만으로 "JSON 줘"보다 파싱 실패율을 크게 낮춘다 — 형식 강제가 디코딩 단계로 내려가기 때문.
- SLM(HyperCLOVA 0.5B 등): 네이티브 JSON mode 부재 시, 짧은 스키마 + 폴백값 명시 + 1회 재시도 게이트 조합이 형식 안정성에 효과적 (cf. [Pattern: Outcome-First (결과 중심 정의)](prompt-pattern-outcome-first.md) 의 SLM 관측과 동선 일치).
- *프로젝트 검증 TBD*: hwiglija-tower-gdd NPC 출력(감정 벡터·액션) 실측치는 구현 후 backfill.

## ⚠️ 트레이드오프
- 스키마를 너무 빡빡하게 잠그면 NPC 표현의 *생동감*이 깎인다 — 자유 텍스트 필드(`line`)는 열어두고 *제어 필드*(action/emotion)만 게이트.
- 재시도 게이트는 지연·토큰 비용 추가 → on-device NPC 에선 재시도 횟수 1회로 캡.

## 🔗 관계
- 상위: [Prompt Engineering Pattern Library (Hub)](prompt-engineering.md) (Hub, Constraints 카테고리)
- 인접: [Pattern: State Serialization (상태 직렬화 매니페스트)](prompt-pattern-state-serialization.md) (게이트 통과 출력을 세션 상태로 직렬화 — 출력→영속 동선)
- 출처 동선: [GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅](openai-prompt-guidance-gpt55.md) (결과 중심 패러다임), structured JSON 로깅 검증 (별도 노트 없음)

---

## 🚀 Skill 화를 위한 메타데이터
- **Version**: 0.1 (provisional)
- **Target Models**: 네이티브 우선(GPT-5+, Claude 3+ function calling/JSON mode), SLM 은 프롬프트+validator 대체
- **Primary Use**: AI NPC 출력 파싱, 에이전트 함수 호출, 구조화 로깅

---

## 연결된 페이지
- [Research Claim Gate — 주장을 증거 등급에 묶는 운영법](research-claim-gate.md) · [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) · [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md) — 게이트 기반 검증 방법론 자매(본 패턴=출력 *구조* 강제 / research-claim=증거 등급 / forge=spec·test / playwright=E2E 관측)
- [Ouroboros — Spec-First Agent OS](ouroboros.md) (Evaluate 게이트 단계) · agent-harness (하네스 검증 레이어)
