---
created: 2026-04-26
updated: 2026-06-16
type: learning
tags: [learning, methods, agent-harness, autonomous, review, doom-loop, hf]
source: https://github.com/huggingface/ml-intern
category: method
authors: Hugging Face
---

# Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처

> 출처: https://github.com/huggingface/ml-intern (HF 공식)
> 학습 동기: archetype 두 개 빌드 후 *프로덕션 자율 에이전트* 의 실제 구조 정독.

## 한 줄 요약

논문 읽고 모델 학습·배포까지 자율 수행하는 ML 엔지니어 에이전트. **submission_loop + ContextManager + ToolRouter + Doom Loop Detector + REVIEW.md** 의 5축. 우리 NPC harness 설계의 *프로덕션 검증된* 짝.

## 5 핵심 컴포넌트

### 1. submission_loop (agent_loop.py)

```
Operation queue → handler → run_agent
  ↓ 최대 300 iteration
  LLM call → tool_calls 파싱 → approval check → ToolRouter 실행 → ContextManager 추가 → 반복
```

**키 포인트:**
- 최대 300 iteration **명시 한도** (우리 SKILL.md §3 복잡도 예산과 동형)
- approval check 가 **destructive 또는 sandbox 작업**에 자동 발동
- 모든 단계 event_queue 로 외부 publish

### 2. ContextManager — 자동 compaction

- message history (litellm.Message[])
- **170k 토큰 임계 → 자동 compaction**
- 세션 자동 HF 업로드 (재현·감사)

→ 우리 NPC harness Memory Stream과 다른 층. NPC memory ≠ agent context. 둘 다 필요.

### 3. ToolRouter

HF docs / repos / datasets / jobs / papers / planning / **MCP server tools** 통합 라우터. 모든 tool spec 단일 진입점.

→ 우리 npc-harness 의 references/ on-demand 로딩과 동형 (서로 다른 추상화 층).

### 4. ★ Doom Loop Detector

**가장 큰 발견.** 에이전트가 같은 tool 패턴 반복 → 자동 검출 → corrective prompt 주입.

```
같은 도구 N 회 반복 호출 → 패턴 검출 → 시스템 메시지로 "다른 접근 시도" 주입
```

NPC 변형: NPC가 같은 응답 패턴 반복 / 같은 reflection 무한 / chapter goal 정체 → **자동 stuck 검출 + 작가 호출**. 우리 BEHAVIOR.md §4 의 "stuck 3 회차" 보다 훨씬 정교.

### 5. ★ REVIEW.md — 진짜 보석

P0/P1/P2 severity + 엄격 절차의 코드 리뷰 표준. **이걸 npc-eval BEHAVIOR.md에 직접 이식 가능.**

핵심 룰:
- **P0** = 머지 차단 / **P1** = 고치는 게 좋음 / **P2** = 정보
- **Default bias: rigor, not speed** — "false negative = 프로덕션 버그 / false positive = 1 round trip"
- **Investigate before posting** — "diff 만 스캔해서 spot한 finding은 false positive 가능성 ↑"
- **P1 cap = 3** — 더 발견하면 "plus N similar" — 노이즈 차단
- **Re-review convergence** — 이전 리뷰에서 P1 이미 flag된 건 재포스트 금지
- **Verification bar** — 모든 행동 주장은 `file:line` 인용 필수. "이게 X 깨짐" 인용 없으면 미포스트.
- **Summary shape** 강제:
  ```
  2 P0, 3 P1
  Verdict: changes requested
  ```
- **Hold the line on P0** — 작성자가 polite하다고 P0 약화 금지

## 16 events (event_queue)

```
processing / ready / assistant_chunk / assistant_message / assistant_stream_end /
tool_call / tool_output / tool_log / tool_state_change / approval_required /
turn_complete / error / interrupted / compacted / undo_complete / shutdown
```

→ NPC harness 도 events publish하면 작가 dashboard 가능. 지금은 file write 만.

## 디렉토리 구조

```
agent/
├── core/         # agent_loop, tools, session
├── context_manager/
├── tools/
├── prompts/
├── sft/          # supervised fine-tuning
├── utils/
├── config.py
└── main.py
configs/main_agent_config.json   # MCP server 등록
backend/ frontend/               # 별도 UI 층
REVIEW.md                        # 코드 리뷰 헌장
```

## NPC harness/eval 직접 차용 후보

### 1. ★★★ REVIEW.md → npc-eval BEHAVIOR.md 보강

지금 우리 BEHAVIOR.md "Honest First" 는 추상. ml-intern REVIEW.md 형태로 구체화:

| 우리가 추가할 것 | 출처 |
|------|------|
| **P0/P1/P2 severity 강제** | REVIEW.md §Severity |
| **"default bias: rigor"** 명시 | §Default bias |
| **Verification bar** — 모든 finding은 NPC 응답 turn 번호 인용 | §Verification bar |
| **P1 cap = 3** — 노이즈 차단 | §P1 cap |
| **Re-review convergence** — 이미 flag된 anti-pattern 재포스트 금지 | §Re-review |
| **Verdict** 한 줄 강제 (ready / changes / discussion) | §Summary shape |
| **"Hold the line on P0"** — 작가 호의에 흔들리지 말 것 | §Default bias |

→ npc-eval 에 **즉시 차용**. M1 시작 전.

### 2. ★★ Doom Loop Detector → npc-harness 자동 stuck 검출

지금 우리 BEHAVIOR.md §4 = "정체 3 회차 → 작가 호출" (수동). ml-intern의 패턴 검출 알고리즘 차용:

```
NPC 응답 N개 = 같은 임베딩 cluster?
  yes → "다른 접근 시도" prompt 자동 주입
  3 회 반복 → 작가 호출
```

→ M1 운영 시 도입.

### 3. ★ Event queue → harness observability

지금 우리 file write 만. ml-intern 16 events 패턴 차용 → 작가 실시간 dashboard 가능 (M2 진입 시 가치).

### 4. Approval gate → welfare-gate withdrawal trigger 동형

ml-intern: destructive ops에 user 승인 wait. 우리 welfare-gate: withdrawal trigger 시 작가 호출. **동형 패턴**, 구현 세부 ml-intern 코드 정독 가치.

## 비교 — 두 archetype + ECC + ml-intern

| 차원 | npc-harness/eval | Schematic | Karpathy | ECC | ml-intern |
|------|---|---|---|---|---|
| **archetype** | 도메인 + overlay 합성 | 도메인 (다이어그램) | overlay (코딩 행동) | 범용 카탈로그 156 | **자율 에이전트 풀스택** |
| **표면적** | 29 파일 | 400 SKILL + refs | 65 줄 | 거대 | 풀 코드베이스 |
| **새 인사이트** | — | 6 패턴 (A 입력) | 4 원칙 (B 입력) | 4 영역 (D 부품) | **Doom Loop + REVIEW.md + events** |
| **즉시 차용** | — | A 빌드 완료 | B 빌드 완료 | 단계적 | **REVIEW.md → npc-eval (즉시)** |

ml-intern 은 **운영 패턴** 의 보석함. archetype 합성 후 *동작* 단계 청사진.

## 제한·주의

- HF 생태계 강결합 (HF docs/datasets/jobs/papers tool들). 우리는 차용 안 함.
- Anthropic API 종속 (config 디폴트). 우리는 model-agnostic 유지.
- 300 iteration 한도는 ML 작업 기준. NPC 회차 단위는 다른 차원 (chapter / session).
- backend/ frontend/ UI 층은 NPC 게임 UI와 무관.

## 즉시 액션 (이 학습 직후)

1. **npc-eval BEHAVIOR.md 보강** — P0/P1/P2 severity + Verification bar + P1 cap + Verdict 강제 → 별도 단계로 진행
2. ml-intern `agent/core/agent_loop.py` 코드 정독 (Doom Loop 알고리즘 세부) — M1 시작 전
3. `configs/main_agent_config.json` MCP 등록 패턴 학습 → C 단계 (seCall MCP) 직접 입력

## 연결

- 두 archetype 표본: [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) · [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md)
- 비교 대상: [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) (ECC — 범용 카탈로그 vs 자율 에이전트 풀스택)
- 우리 빌드 결과: `skills/npc-harness/` · `skills/npc-eval/` (위키엔 ai-npc-game 인프라 섹션)
- C 단계 (다음): [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) MCP 등록 — ml-intern config 패턴 직접 활용
- 학술 정신 일치: [AI Scientist v1 + v2 — 자율 과학 연구 에이전트 (정식 논문 학습)](../techniques/ai-scientist-paper.md) (Sakana 자가 평가 정직) ≈ ml-intern REVIEW.md "Hold the line on P0"
