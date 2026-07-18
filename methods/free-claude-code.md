---
created: 2026-04-24
updated: 2026-04-24
type: learning
tags: [tooling, proxy, llm, local-llm, claude-code, cost-optimization, openai-compatible]
source: https://github.com/Alishahryar1/free-claude-code
category: method
---

# free-claude-code — Claude Code를 대체 LLM 프로바이더로 라우팅하는 프록시

*Alishahryar1 / Python 3.14 / MIT*

> **AI NPC blueprint와의 직결성: 없음.** 개발 비용/실험 속도 도구로서의 유용성: **중간**.
> 분류: method (도구), 적용성: 간접, 시급성: 단기 실험.

Claude Code CLI/VSCode가 보내는 Anthropic API 호출을 **NVIDIA NIM / OpenRouter / DeepSeek / LM Studio / llama.cpp**로 투명 전달하는 로컬 프록시 서버. env 2개만 바꾸면 끝.

---

## 한 줄 요약

> `ANTHROPIC_BASE_URL=http://localhost:8082` 설정만으로 Claude Code가 무료/로컬 LLM을 쓰게 만드는 uvicorn 프록시. Opus/Sonnet/Haiku를 각기 다른 모델·프로바이더로 라우팅 가능.

---

## 핵심 관찰

### 1. 작동 방식 (단순)

```
Claude Code ──► Free Claude Code Proxy (:8082) ──► NIM / OR / DeepSeek / LM Studio / llama.cpp
(Anthropic API)      (Anthropic ↔ OpenAI 번역)            (OpenAI 호환 API)
```

- Anthropic 포맷 ↔ OpenAI 포맷 양방향 번역
- SSE 스트리밍 유지
- `<think>` 태그 / `reasoning_content`를 Claude thinking block으로 변환

### 2. Per-Model Routing

한 프록시 안에서 Opus/Sonnet/Haiku 각각을 다른 모델·프로바이더로:

```dotenv
MODEL_OPUS="nvidia_nim/moonshotai/kimi-k2.5"
MODEL_SONNET="open_router/deepseek/deepseek-r1-0528:free"
MODEL_HAIKU="lmstudio/unsloth/GLM-4.7-Flash-GGUF"
MODEL="nvidia_nim/z-ai/glm4.7"  # fallback
```

→ "비싼 작업 = 무료 NIM, 로컬 가능한 작업 = LM Studio" 식 비용 최적화.

### 3. 5개 프로바이더 비교

| 프로바이더 | 비용 | 속도제한 | 용도 |
|-----------|------|----------|------|
| NVIDIA NIM | 무료 | 40 req/min | 데일리 드라이버 |
| OpenRouter | 무료/유료 | 가변 | 모델 다양성 |
| DeepSeek | 종량제 | - | 직접 API |
| LM Studio | 무료 로컬 | 무제한 | 프라이버시·오프라인 |
| llama.cpp | 무료 로컬 | 무제한 | 경량 로컬 |

### 4. 요청 최적화 5종

"trivial API 호출"을 로컬에서 intercept:
- quota probe
- title generation
- prefix detection
- suggestion
- filepath extraction

→ 쿼터·지연시간 모두 절감. 잘 설계된 프록시.

### 5. Discord/Telegram 봇 내장

트리 기반 스레딩, 세션 영속, 음성 메모 전사(Whisper), `/stop` `/clear` `/stats` 명령.
→ 원격 자율 코딩 — 흥미롭지만 내 용도엔 부수.

### 6. 안전장치

- `ANTHROPIC_AUTH_TOKEN`으로 프록시 자체 인증 가능 (공개망 운용 시)
- Subagent 차단: `Task` 도구 intercept → `run_in_background=False` 강제. 런어웨이 서브에이전트 방지.
- 스마트 rate limit: rolling-window throttle + 429 exponential backoff

### 7. 패키지 설치 지원

```bash
uv tool install git+https://github.com/Alishahryar1/free-claude-code.git
fcc-init && free-claude-code
```

→ clone 없이 시스템 도구로 설치 가능.

---

## 정직한 평가

### 이게 진짜로 해결하는 것

- Claude 구독료·API 비용을 **실험 단계에서** 줄인다
- 로컬 모델(LM Studio)로 **오프라인 / 프라이버시** 시나리오 열림
- 여러 모델을 Claude Code 인터페이스로 **통일**해서 비교 가능

### 이게 해결 못 하는 것

- **Anthropic Claude의 품질은 못 따라옴** — Kimi K2.5, GLM-4.7, DeepSeek R1이 좋긴 하지만 Sonnet 4.6/Opus 4.7 수준은 아님
- **Claude Code 자체의 기능성**은 유지되지만, 내부 prompt들이 Claude 모델 가정으로 튜닝됐기 때문에 **도구 사용 품질 저하** 가능
- 공식 Anthropic 인증 경로가 아님 → **업데이트 깨질 위험 상존**

### 윤리·법적 고려

- **MIT 라이선스**, 사용 자체는 합법
- Claude Code는 Anthropic 소유 — 약관상 "제3자 프록시로 다른 모델 라우팅"이 명시적으로 허용되는지 **불명확**. 개인 실험 수준이면 대체로 회색지대.
- 상업적 배포·서비스 운영 시 위험 — 내 프로젝트(북켓몬·hyunsoo-bot 등)에 이것을 조립해 넣는 건 **부적절**
- → **개인 학습·실험용으로만.** 프로덕션 절대 금지.

---

## 내 프로젝트 적용 구상

### 직접 연결

| 프로젝트 / 상황 | 적용 가능성 | 판단 |
|-----------------|-----------|------|
| 북켓몬 PoC | **부적절** | 서비스에 넣는 건 위험. Claude Code 개발 단계 비용 절감 용도는 가능. |
| hyunsoo-bot | **부적절** | 이미 Gemini 2.0 Flash로 구동. 프록시 추가 의미 없음. |
| 슈퍼센트 지원 작업 | **중립** | 당시 Claude/Gemini 분업 구조로 이미 비용 관리(현행 2-AI 동일 원리). 프록시 불필요. |
| Sub brain 일상 개발 | **가능** | **진짜 후보.** 일상 Claude Code 세션에서 경량 작업에 LM Studio 라우팅. |
| seCall 위키 생성 | **강한 대체 관계** | seCall이 이미 `--backend ollama|lmstudio|gemini` 지원. 굳이 free-claude-code 중첩 불필요. |

### 가장 현실적인 활용 경로

**"Haiku 수준 작업 = LM Studio 로컬, 중요 작업 = 실제 Claude"** 하이브리드.

```dotenv
MODEL_OPUS="anthropic-passthrough"       # 그대로 Anthropic에 (중요 작업)
MODEL_SONNET="anthropic-passthrough"
MODEL_HAIKU="lmstudio/GLM-4.7-Flash"      # 트리비얼 작업 무료화
```

→ 단, free-claude-code가 "passthrough" 모드를 공식 지원하는지 확인 필요. 아니면 두 개의 Claude Code alias를 운용 (`claude-free`, `claude-real`).

### 구체적 실험 아이디어 3

1. **"Ideation 세션은 무료 모델로"** — 발상(ideation) 초반엔 정확도보다 다양성 — Kimi K2.5 (NIM 무료)로 브레인스토밍 → 결론만 실제 Claude로 검증
2. **로컬 LM Studio + MacBook M-series 체감 테스트** — 오프라인에서 Sub brain 글쓰기 도우미로 실용성 측정. 비행기·카페 등 오프라인 환경 활용.
3. **Discord 봇 → 원격 Claude Code** — 흥미롭지만 현재 필요 없음. 장기 관찰 항목.

### 위험 요약

- **업데이트 리스크**: Claude Code 버전 올라가면 프록시가 깨질 수 있음
- **품질 저하**: Anthropic 튜닝된 prompt가 타 모델에서 엉뚱한 출력
- **ToS 회색지대**: 장기 의존 금지
- **내 창작물에 끼워넣기 금지**: 북켓몬·hyunsoo-bot 같은 "내 이름 걸린 프로덕트"에 포함 불가

---

## 개념적 수확

### 1. "Drop-in Replacement" 패턴

2개 env 바꾸는 것만으로 전체 LLM 백엔드 교체 — **인터페이스 표준화의 힘**.
내가 만들 NPC/게임 시스템도 LLM 백엔드를 **교체 가능한 슬롯**으로 설계하면 유사한 자유도 확보.

### 2. Per-Task Model Routing 철학

Opus/Sonnet/Haiku를 같은 모델이 아니라 **작업 성격별**로 쪼갠다는 발상.
→ ai-npc-blueprint Layer 1 기반 모델 선택도 NPC 행동마다 다를 수 있다는 힌트 (성찰 = 고퀄, 일상 대화 = 경량).

### 3. "Trivial 요청 intercept" 설계

5종 잔재 요청을 로컬에서 처리 — **LLM 호출을 "필요할 때만"으로 좁히는** 아키텍처 원칙.
내 당시 Claude/Gemini 분업 규칙(현행 Claude/Codex — CLAUDE.md)과 같은 철학. "호출 자체가 비싸다, 호출을 줄여라".

### 4. Loguru + Ruff + Ty + Pytest 스택

파이썬 현대적 도구 레퍼런스로도 가치 있음. 개인 프로젝트 스택 참고.

---

## 열린 질문

- free-claude-code가 **passthrough 모드**(특정 모델은 실제 Anthropic으로) 공식 지원하는가? 소스 읽어봐야 함.
- LM Studio + MacBook M-series 로컬에서 **도구 사용(tool use) 정확도**가 실용 수준인가?
- Claude Code 내부 prompt가 Claude 전용 어휘에 의존할 때 타 모델 성능 저하 정도는 벤치 필요
- Anthropic이 이 레포를 알고 있는가 / 조치한 적 있는가 (legal 관점)
- seCall의 LM Studio 백엔드와 free-claude-code LM Studio 라우팅을 동시 돌리면 GPU 경합 관리는?
- "Anthropic-passthrough" 없는 한, 중요 작업용과 실험용 **Claude Code 두 개를 alias 분리 운용**이 정답인가?

---

## 다음 학습 후보

- **Claude Code 내부 구조 / MCP 프로토콜 스펙** — 프록시 가능성의 원천 이해
- **OpenAI API ↔ Anthropic API 포맷 번역** 세부 — 내가 직접 유사 프록시 쓸 수 있는 수준까지
- **Kimi K2.5 / GLM-4.7 / DeepSeek R1 기술 문서** — 무료로 쓸 만한 실제 모델 품질 파악
- **LM Studio / llama.cpp 로컬 추론 성능 벤치** — 맥북 M-series에서 현실적 성능
- **LiteLLM / Ollama 프록시와의 비교** — 경쟁 프로젝트 지형

---

## 적용 아이디어

### 단기 (이번 주)
- **건너뛰기 권장.** 슈퍼센트 지원 작업·첫 reflection 작성이 우선순위 (회고 결과).
- 단, 10분 투자로 OpenRouter 무료 키 발급 후 `claude-free` alias 하나만 세팅해두는 정도는 무해.

### 중기 (이달)
- seCall 도입 후 **안정화되면** 실험. 두 도구 동시 도입은 리스크.
- LM Studio로 이미 쓰고 있다면 자연스럽게 통합 시도.

### 장기
- **내 NPC 시스템의 "모델 슬롯" 설계**에 이 패턴 차용 — env로 백엔드 교체 가능한 구조로.
- 오프라인 Sub brain 글쓰기 보조 (비행기·여행 시)

---

## 결론 — 지금 도입해야 하나?

**지금은 아니다.** 이유:

1. 회고 결과 "소화·실행 주간" 권고 — 새 도구 도입은 우선순위 낮음
2. seCall이 먼저 (훨씬 Sub brain 직결)
3. 품질/ToS 리스크 대비 이득이 "개인 실험" 수준
4. 내 실제 프로젝트(북켓몬, hyunsoo-bot, 슈퍼센트)에 직접 편입 **부적절**

**학습 가치는 있다.** 개념적 수확 4가지 — 특히 "drop-in 슬롯 설계", "per-task routing", "trivial intercept" — 내 NPC 블루프린트 설계 사고에 자산.

→ **지식으로 보관, 도입 보류.**

---

## 연결된 페이지

- [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) — 위키 생성 백엔드에 이미 LM Studio/Ollama/Gemini 지원. 기능 중첩 관찰.
- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — "작은 교체 가능 부품으로 LLM 워크플로우" 철학의 동종
- ai-npc-blueprint — Layer 1 "교체 가능한 기반 모델 슬롯" 설계 힌트
- professional — 분업(당시 Claude/Gemini) 맥락에서 추가 백엔드 고려 대상

---

## 출처

- 저장소: <https://github.com/Alishahryar1/free-claude-code>
- 라이선스: MIT
- 스택: Python 3.14, uv, uvicorn, Loguru, Ruff, Ty, Pytest
