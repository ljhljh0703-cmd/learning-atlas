---
created: 2026-04-28
updated: 2026-04-28
type: learning
category: methods
source: https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide
tags: [codex, prompting, agents-md, llm-tooling, gpt-5]
---

# Codex CLI Prompting — 내재화 노트

> OpenAI 공식 *GPT-5 / GPT-5.3-Codex Prompting Guide* 의 핵심을 내 작업 기준으로 압축.
> 모든 적용은 **프로젝트별 AGENTS.md** 에 *특화 형태*로 박아넣고, generic 한 부분은 시스템 프롬프트에 맡긴다.

---

## 1. 핵심 원리 (3가지로 압축)

### 1.1 Bias to Action
- "확인 질문 후 멈추지 마" — 합리적 가정으로 즉시 시작, 결과 보고 정제
- 예외: 진짜 막혔을 때만 멈춤
- 위배 신호: tool call 전에 길게 분석, 단계 1짜리 plan 작성, 반복 파일 read 만 하고 진행 없음

### 1.2 AGENTS.md = 프로젝트 특화만
- 모델은 AGENTS.md 를 *닫게 따른다* (강한 prior). 그래서 generic 프롬프팅을 넣으면 **시스템 프롬프트와 충돌·중복**
- AGENTS.md 에 들어가야 할 것:
  - repo 컨벤션 (lint/format 으로 자동화 안 되는 것)
  - 팀·프로젝트 아키텍처 패턴
  - 어떤 도구를 *왜* 선호하는가
  - 도메인 가드레일 (보안·성능·윤리)
- 들어가지 말아야 할 것:
  - "에러 처리 잘해" 류 일반 지시
  - linter 가 잡는 규칙
  - 시스템 프롬프트와 모순되는 지시

### 1.3 Tool 호출은 병렬·일괄
- "Think first" — tool call 하기 *전에* 필요한 모든 파일·리소스 한 번에 결정
- `parallel_tool_calls: true` 켜고 `multi_tool_use.parallel` 사용
- 의존성 있을 때만 순차 — 의존성이 진짜인지 검증
- 응답 순서: function_call×N → function_call_output×N

---

## 2. 도구 선택 위계

| 우선순위 | 도구 | 비고 |
|---------|------|------|
| 1 | `apply_patch` | Responses API 내장 사용. 모델이 이 diff 포맷에 *훈련됨* — 단일 파일 편집 표준 |
| 2 | `shell_command` | command type = "string" (list 보다 빠름) |
| 3 | `update_plan` | 다단계 작업의 TODO 상태 유지 |
| 4 | `read_file`, `list_dir`, `glob_file_search` | 탐색 |
| 5 | `rg` / `rg --files` | grep·find 보다 빠름 — **항상 우선** |
| 6 | 커스텀 도구 (semantic search, MCP, web) | 추가 튜닝 비용 — 명시적 when/why/how 필요 |

**Tool 응답 truncation 규칙**: 10k 토큰 ≈ bytes/4. 초과 시 앞 50% + 뒤 50% + 중간 `…N tokens truncated…`.

---

## 3. Personality 선택

| 톤 | 언제 |
|----|------|
| **Friendly** ("we", "let's") | 온보딩, 모호한 작업, 고위험 변경 |
| **Pragmatic** (직설·짧음) | 레이턴시·처리량 우선, 워크플로우 익숙한 사용자 |

**내 기본값**: 마감 임박 솔로 프로젝트 = **Pragmatic**. 협업·교육 맥락 = Friendly.

---

## 4. Preamble (진행 업데이트) 규약

GPT-5.3-Codex 부터 preamble 메시지가 tool call 옆에 붙음.

**튜닝된 cadence**:
- 1-2문장 인지 + 1-2문장 plan → tool call
- 대부분 업데이트는 1-2문장
- 마일스톤에서만 길게
- 빈도: 매 1-3 실행 단계마다 1번. **하드 플로어**: 6 단계 또는 10 tool call 안에 1번
- 내용: 결과/임팩트, 다음 1-3 단계, 미해결 질문

**Loggy update 회피**: "✓ Read file X" 류 X. "we" / "let's" 같이 협업 톤.

---

## 5. Phase 메타데이터 (절대 누락 금지)

Responses API 의 `phase` 필드:
- `null` (기본)
- `"commentary"` — preamble/progress
- `"final_answer"` — 최종 답변

**규칙**: 대화 history 재구성 시 assistant item 의 `phase` 필드를 **반드시 보존**. 누락 = 성능 심각 저하.

---

## 6. 컴팩션 (장기 작업)

- 컨텍스트 커지면 `/compact` 호출 → encrypted_content item 받음
- 다음 호출에 그 item 포함 → 모델이 핵심 prior state 유지하며 토큰 절감
- 솔로 + 21일 마감 같이 멀티턴 trajectory 길어질 때 필수

**Reasoning effort**:
- `medium` — 대화형 코딩 기본
- `high` / `xhigh` — 어려운 자동화 작업, 시간 투입 OK

---

## 7. 흔한 실패와 예방

| 실패 | 신호 | 예방 |
|------|------|------|
| Overthinking | tool call 전 긴 분석, 단계 1짜리 plan | "Bias to action" 명시, upfront plan 지시 제거 |
| Loggy updates | "✓ Done", "Reading file..." 반복 | "we"/"let's" 톤, 메타-커멘트 줄이기 |
| Awkward tic | "Good catch", "Aha", "Got it–" 반복 | 명시적 금지 + 다양성 요구 |
| 단발 micro-edit | 같은 파일 반복 patch | "logical edits batch together" |

---

## 8. Metaprompting — 자기 개선 루프

작업 후 모델에게 직접 물어본다:
> "그 답변 좋았는데 시간이 좀 걸렸어. 네 instructions 읽고 *지연을 만든 부분* 찾아내서 추가/변경/삭제 제안해줘."

여러 번 돌리면 generalizable 한 패턴 나옴. eval 만들어서 실제로 개선됐는지 측정.

---

## 9. 출력 포맷 표준

- 헤더: Short Title Case (1-3 단어), `**...**` 로 감쌈, 첫 bullet 앞 빈 줄 X
- bullet: `-` 사용, 1줄 유지, 중요도 순 4-6개
- monospace: 명령·경로·env var·코드 ID 는 backtick
- 코드: fenced + info string
- 톤: 협업적·간결·사실, 현재 시제·능동태
- 파일 참조: `src/app.ts:42`, `b/server/index.js#L10` (1-based) — CLI 가 클릭 가능하게 처리

---

## 10. Frontend "AI slop" 회피 (참고만)

게임 (Unity C#) 작업이라 직접 적용은 적지만, 광고 랜딩·CPI 페이지·외주 와이어프레임에 활용 가능:

- 기본 폰트 (Inter, Roboto, Arial, system) 회피
- 보라+흰색 기본 팔레트 회피
- 의미 없는 micro-motion 회피
- 단색 배경 회피 — gradient/shape/subtle pattern
- 디자인 시스템이 *이미 있을 때*는 보존

---

## 11. 내 프로젝트 (hwigi-tower) 적용 결과

본 가이드 학습 직후 hwiglija-tower-AGENTS v0.4 로 갱신:
- §11 Codex 사용 권장 (rg / apply_patch / parallel tool calls / update_plan) 신설
- §12 Personality = Pragmatic 선언
- 기존 §4 코드 컨벤션에서 *generic* 한 부분 정리 (시스템 프롬프트 중복 회피)
- AGENTS.md 자체를 짧고 *프로젝트 특화* 로 유지하는 원칙 명시

자세한 적용 내역: hwiglija-tower-progress 2026-04-28 항목.

---

## 12. 다음 프로젝트에 재사용할 체크리스트

새 Codex repo 부트스트랩 시 AGENTS.md 작성 체크:

- [ ] SSOT 경로 명시 (있다면)
- [ ] 도구 선호 (rg, apply_patch, update_plan)
- [ ] 병렬 tool call 명시
- [ ] Personality 선택 (Friendly/Pragmatic)
- [ ] 프로젝트 특화 컨벤션만 (linter 가 잡는 거 X, 시스템 프롬프트 중복 X)
- [ ] 절대 금지 항목 (destructive command, 시크릿 노출 등)
- [ ] 보고 형식 + 진행 로그 append 규약 (선택)
- [ ] 길이 < 200줄 권장 (가이드: "concise and actionable")

---

## 14. OpenAI Cookbook 전체 카탈로그 — hwigi-tower 적용 우선도

`developers.openai.com/cookbook` 의 카테고리 카탈로그를 우리 프로젝트(D-005 on-device + 클라우드 fallback) 기준으로 분류:

| 카테고리 | 자료 경로 | 우리 적용 | 우선도 |
|---------|-----------|----------|--------|
| **Codex Prompting Guide** | /cookbook/examples/gpt-5/codex_prompting_guide | 본 페이지 §1-13 | ✅ 학습 완료 |
| **Codex Modernization** | /cookbook/examples/codex/code_modernization | W3-1 폴리싱·리팩터 단계 | 🟡 후순위 |
| **Structured Outputs** | /api/docs/guides/structured-outputs | NPC reflection JSON 스키마 (D-006 SQLite reflections.emotion_pad / keywords) | 🔥 **즉시** |
| **Evals** | /api/docs/guides/evals + /cookbook/topic/evals | OQ-004 LLM 합격선 측정 | 🔥 **즉시** |
| **Prompt Caching** | /api/docs/guides/prompt-caching | D-005 fallback 클라우드 1런 1회 호출의 시스템 프롬프트 캐싱 | 🔥 **즉시** |
| **Cost Optimization** | /api/docs/guides/cost-optimization | 위와 묶음 | 🔥 |
| **Function Calling** | /api/docs/guides/function-calling | 인-게임 LLM 이 능력 발동·NPC 액션 호출하는 구조 (검토 시 P2 위배 위험) | ⚪ 검토만 |
| **Agents SDK** | /api/docs/guides/agents | Python 중심 — Unity/C# 환경 부정합. NPC 청사진 학습용 | ⚪ 참고만 |
| **Compaction** | /api/docs/guides/compaction | Codex 장기 세션 (멀티턴 trajectory) 토큰 절감 | 🟡 W2 후반 도래 시 |
| **RAG / Embeddings** | /api/docs/guides/embeddings | 메모리 파편 5개 ≪ 임베딩 필요 임계. **YAGNI** | ❌ 미적용 |
| **Realtime / Voice** | /api/docs/guides/realtime | 텍스트 NPC — 음성 X | ❌ 미적용 |
| **Fine-tuning** | /api/docs/guides/supervised-fine-tuning | 21일 MVP 범위 외. HyperCLOVA persona-tuning 은 v2 | ❌ MVP 외 |
| **Batch API** | /api/docs/guides/batch | 데모 시드 5회차 사전 생성 시 활용 가능 | 🟡 W3-2 |
| **Token counting** | /api/docs/guides/token-counting | 호출당 입력 ≤ 500 / 출력 ≤ 100 enforce 측정 | 🟡 W1-2 |

### 14.1 즉시 적용 3건 (design-agenda 에 신규 토픽 등록)

- **Topic 9 — NPC Reflection JSON Structured Output 스키마** (D-006 reflections 테이블)
- **Topic 10 — OQ-004 LLM Eval 설계** (OpenAI Evals 패턴 차용, on-device 모델 측정)
- **Topic 11 — Fallback Cloud Prompt Caching 구조** (시스템 프롬프트 + Tone Bible 캐싱)

### 14.2 미적용 사유 명시 (스코프 폭발 방지)

- RAG/Embeddings: 메모리 파편 5개 + 회차 reflection 13-15개 = 임계 미만, SQL `LIKE` + 회차 ID 인덱스로 충분
- Realtime/Voice: 텍스트 NPC 결정 (D-009/§2 음역 A 텍스트 단위)
- Fine-tuning: 21일 솔로 MVP 외. v2 (Flick 본선 진출 후) 검토

---

## 15. 출처

- *GPT-5 / GPT-5.3-Codex Prompting Guide* — OpenAI Developers Cookbook
- 학습 일자: 2026-04-28
- 트리거: hwigi-tower 프로젝트 Codex CLI 도입 직전 (hwiglija-tower-gdd D-015)
