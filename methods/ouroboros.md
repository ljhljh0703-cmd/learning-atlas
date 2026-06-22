---
created: 2026-05-03
updated: 2026-06-16
type: learning
category: methods
source: https://github.com/Q00/ouroboros
tags: [ouroboros, agent-os, spec-first, evaluation-gate, nine-minds, claude-code, codex]
---

# Ouroboros — Spec-First Agent OS

> Q00/ouroboros, MIT, PyPI `ouroboros-ai`, Python 3.12+. *"Stop prompting. Start specifying."*
> AI 코딩의 병목은 AI 능력이 아니라 인간 명료성이라는 가설 위의 runtime layer. Claude Code / Codex CLI / OpenCode / Hermes 4개 환경에서 작동.

## 1. 핵심 루프

```
Interview -> Seed -> Execute -> Evaluate -> Evolve
   ^                                          |
   +-- 다음 generation seed 가 됨 (진화) ----+
```

| 단계 | 무엇 |
|------|------|
| Interview | Socratic 질문으로 숨은 가정 노출 (12 가정 / Ambiguity 0.19→0.15) |
| Seed | 답변을 immutable spec 으로 결정화 (acceptance criteria + ontology + constraints) |
| Execute | Double Diamond (Discover → Define → Design → Deliver) |
| Evaluate | 3-stage gate: Mechanical($0) → Semantic → Multi-Model Consensus |
| Evolve | "What do we still not know?" → 다음 generation seed |

수렴 조건: ontology similarity ≥ 0.95.
지속 모드: `ooo ralph` — 세션 경계 넘어 stateless evolve, EventStore lineage 재구성.

## 2. Nine Minds — 사고 모드 분리 (on-demand 로드)

| 에이전트 | 역할 | 핵심 질문 |
|---------|------|----------|
| Socratic Interviewer | 질문만, 절대 build 안함 | "무엇을 가정하고 있나?" |
| Ontologist | 본질 발견 | "이게 정말 무엇인가?" |
| Seed Architect | 대화→spec 결정화 | "완전하고 모호하지 않은가?" |
| Evaluator | 3-stage 검증 | "올바른 것을 만들었나?" |
| Contrarian | 모든 가정 도전 | "반대가 참이라면?" |
| Hacker | 비관습적 경로 | "어떤 제약이 진짜인가?" |
| Simplifier | 복잡성 제거 | "가장 단순한 해법은?" |
| Researcher | 코딩 멈추고 조사 | "실제 증거가 무엇인가?" |
| Architect | 구조적 원인 식별 | "처음부터 짜면 이렇게 만들 것인가?" |

→ 9 mode 가 동시 활성 X. *한 작업* 을 *다른 사고 모드* 로 보는 역할 분리.

## 3. 3-Stage Evaluate Gate

| 단계 | 비용 | 무엇 |
|------|------|------|
| Mechanical | $0 | 단위 테스트, 컴파일, 정적 분석, syntactic 검증 |
| Semantic | LLM 1 호출 | 의미 검증, spec 준수 여부 |
| Multi-Model Consensus | LLM N 호출 | 여러 모델 합의 도달 시에만 통과 |

Ambiguity ≤ 0.2 게이트: spec 자체가 모호하면 코드 실행 차단.

## 4. 우리 워크플로우와의 비교

| 차원 | Ouroboros | 우리 (CLAUDE.md / hwigi-tower) |
|------|-----------|-------------------------------|
| 명세 우선 | Interview→Seed | design-brief + design-agenda + GDD §0.6 PILLARS |
| Immutable spec | seed.yaml | GDD §2 잠긴 D-NNN |
| 평가 gate | 3-stage 자동 | Unity EditMode test (Mechanical) + 작가 검토 (수동) |
| 진화 loop | ralph 자율 수렴 | 매 토픽 manual |
| 9 minds | on-demand 로드 | 3-AI 분업 (Claude/Gemini/Codex), mode 명시 X |
| Ambiguity 점수 | 정량 ≤ 0.2 | 정성 (Pillar 점검만) |
| Lineage | EventStore stateless | progress.md append 수동 |

## 5. 흡수 결과 (즉시 반영)

### 5.1 design-agenda 토픽 프롬프트에 Mode 라인 추가
hwigi-tower 와 mirofish-lab 의 모든 디벨롭 토픽 프롬프트에 Mode/Anti-Mode 명시.
패턴:
```
# Mode: <적합한 mind 1-2개>
# Anti-Mode: <피해야 할 mind, 보통 Architect 가 잠긴 결정과 충돌하니 명시>
```
토큰 추가 거의 없음, 답변 질↑.

### 5.2 design-journal 항목에 Ambiguity 점수 추가 (선택)
0.0-1.0 정성 평가. 0.2 초과면 토픽 close 거부, 추가 디벨롭 필요.

### 5.3 마감 후 검토 (보류)
- 3-stage evaluate gate 자동화 (mirofish-lab 첫 후보)
- ralph 지속 evolve (mirofish-lab 야간 시뮬 자동화)
- ouroboros-ai 본 패키지 도입 (학습 비용 크니 EXP-001 결과 검증 후)

## 6. 흡수 안 함

- "Stop prompting" 철학 자체 — 우리는 prompt 도 유지. brief + agenda + journal 가 이미 *spec-first* 정신
- ouroboros-ai PyPI 본체 — Python 3.12 환경 + MCP 등록 비용 vs hwigi-tower 마감 D-15
- EventStore — progress.md append 가 현재 임계 충분

## 7. 출처

- Repo: github.com/Q00/ouroboros (MIT)
- PyPI: ouroboros-ai
- 학습 일자: 2026-05-03
- 트리거: 작가가 Codex 개발 진행 중 *spec-first* 패턴 검토 요청

## 8. 델타 — 2026-06-16 재조우 (작가 재공유, repo 진화 확인)

repo README 기준 2026-05-03 이후 신규. **backfill 대상 = PAL Router 만**(나머지는 우리 "본체 미도입" 결정과 무관 → 참조만, 미흡수).

### 8.1 ⭐ PAL Router — 3-tier 비용 최적화 (1x / 10x / 30x) ← 차용 후보
`routing/` 의 핵심. 작업 난도에 따라 모델 티어(1x/10x/30x 비용)를 라우팅 — 싼 작업은 싼 티어, 어려운 것만 비싼 티어. (정확한 티어↔모델 매핑·트리거 로직은 본 재조우에서 deep-fetch 안 함 — README grain 까지만 기록, 생성 X.)
- **우리와의 연결**: CLAUDE.md §4 비용지침(Research=Gemini Pro / Review=Flash / Execution=Claude / Routine=GPT-mini)의 *정량 라우팅 버전*. claude-max-cost-shift 맥락(소량=Claude 직접, 대량·반복만 오프로딩)과 동형.
- **학습→반영(backlog)**: §4 비용지침은 *헌법(LOCKED)* → 직접 수정 X. PAL 의 "난도→티어" 정량 매핑을 §4 에 차용할지는 **패치 스테이징 후 작가 merge** 대상. 현재는 후보 등재만(Claude Max 결제로 §4 재검토 보류 중 — log#2026-06-16).

### 8.2 미흡수 (참조용, repo 진화 기록만)
- 런타임 확장 4→8종(+Gemini/Kiro/Copilot/Pi), `bigbang/` brownfield explorer(기존 코드베이스 분석), 배포 확장(standalone CLI `install.sh` + pip/uv/pipx extras + Claude Code 마켓 플러그인 — **마켓 전용 아님, CLI 독립 작동**), ⭐4.6k.
- 우리 결정 불변(§5.3·§6): ouroboros-ai 본체 미도입. 위 델타는 그 결정에 영향 없음.
