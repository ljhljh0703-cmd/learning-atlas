---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [AI, trading, harness, guardrails, improvement-loop, rsi, codex, mcp, role-separation, postmortem, skill-evolution, hyunsoo-bot]
source: https://github.com/monarchjuno/tradingcodex
authors: [monarchjuno]
year: 2026
category: technique
---

# TradingCodex — "Codex-native 트레이딩 하네스" (자율봇이 아니다)

*monarchjuno (Apache-2.0 open-core)*

핵심 선언: **"It is not an autonomous trading bot."** Codex가 워크플로우를 조율, Django가 영속 서비스 레이어, TradingCodex MCP가 실행 경계. 즉 **모델이 아니라 하네스(harness)가 주인공**인 트레이딩 시스템. **현수봇 흡수원 #2**로 해체 — 수확 1순위 = **improvement loop(재귀개선·성장·학습)** 형식화.

---

## 한 줄 요약

> 트레이딩을 "AI가 알아서 사고팔기"가 아니라 **역할분리 + 결정론 실행경계(가드레일) + 개선루프(회고→스킬진화→검증 테스트화)** 라는 *하네스 운영체제*로 재정의한 시스템.

---

## 정직한 판단 (Honest Assessment)

| 질문 | 답 |
|------|----|
| vault 북극성 연결? | **직접·강함** — agent-harness("Agent=Model+Harness")·[goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md)의 **트레이딩 도메인 결정체**. vault 거버넌스(Hermes Loop·proposed-patch·③Gate fail-safe)와 거의 1:1 동형 |
| 직접 적용 vs 개념 수확? | **개념·구조 수확**(스택은 Codex/Django/MCP라 현수봇과 다름, 패턴은 그대로 이식 가능) |
| 시급성? | **지금** — 현수봇을 "딸깍봇 아님"으로 어필할 포폴 spine의 핵심 근거 |

> 외부 ground-truth 의의: 진지한 트레이딩 시스템이 **harness + guardrail + improvement loop**로 수렴한다는 외부 증거. 작가가 vault에서 독립적으로 도달한 harness 철학이 트레이딩 도메인에서도 옳았음을 보강(억지 아님 — README가 명시적으로 harness/guardrail/improvement 3분류를 채택).

---

## 핵심 개념

### 1. Harness = 운영체제 (top-level)
roles·skills·service state·policy·MCP tools·research memory·artifacts·approvals·execution adapters·audit·**feedback loops** 가 전부 harness 안에 산다. Guardrails와 Improvement는 *구현 버킷이 아니라 components 위의 taxonomy 뷰*.

### 2. 3 plane + 1 실행경계
| Plane | 소유 |
|---|---|
| Codex control plane | workspace 지시·role agents·hooks·라우팅 |
| **MCP 실행경계** | role allowlist·schema·policy·approval·idempotency·audit |
| Django service plane | research memory·policy·orders·approvals·portfolio·audit·Admin/API/web |
| Adapter boundary | paper/stub만(라이브 브로커 초기 core 제외) |

### 3. Agent topology = 1 head-manager + 9 고정 subagent
fundamental / technical / news / macro / instrument / valuation / portfolio / risk / execution. head-manager는 *조율만*(주문 제출 불가). → [TradingAgents — LLM 멀티에이전트로 "트레이딩 회사"를 모사하는 프레임워크](tradingagents-multiagent.md)의 역할분업과 유사하나, **권한 격리(allowlist)가 코드로 강제**되는 점이 차별.

### 4. 실행 라이프사이클 (fail-safe 가드레일)
```text
principal → capability → policy → schema → approval/idempotency → adapter → audit
```
narrow allowlist: `head-manager`는 주문 제출 불가 · `risk-manager`가 approval 소유 · `execution-operator`만 실행 호출. 웹 라우트는 에이전트 스폰·approval·실행 불가. → vault ③Gate **fail-safe 철학**과 동형(cf. goose Adversary=fail-open과 대조).

### 5. ★ Improvement Loop (재귀개선·루프·성장·학습 — 1순위 수확)
Guardrails(막기)와 **분리**된 품질 하위시스템. **"Improvement는 절대 실행을 인가하지 않는다"**(고품질 리포트도 가드레일 경로 필요).

| 영역 | 하는 일 |
|---|---|
| Workflow quality | 올바른 역할팀 라우팅·역할중첩 방지·handoff acceptance(`accepted/revise/blocked/waiting`)·readiness gate |
| Research memory | 출처·as-of·버전·content hash·stale 경고를 workspace md로 보존(DB에 숨기지 않음) |
| **Skill evolution** | `proposal → validation → approval → apply → audit` — *숨은 프롬프트 드리프트 금지* |
| **Postmortems** | 체결뿐 아니라 **거부된 주문·막힌 approval·실패한 정책체크·약한 근거·논지 변경·라우팅 실패**까지. 끝에 구체적 harness/guardrail/skill/validation 개선으로 마감 |
| Validation feedback | 반복 실수를 **회귀 테스트화**(정책 단위테스트·MCP smoke·routing 시나리오·research artifact 품질체크) |

> 🔑 이 5영역이 vault Hermes Loop과 동형: Skill evolution=proposed-patch 스테이징(작가 승인 merge), Postmortem=memory/회고, Validation=③Gate 검증기준. **작가의 지식 OS가 트레이딩 OS로 번역된 형태.**

---

## 기술 스택 / 사용법

- Python 3.14 · Codex(agent orchestration) · Django(service plane·Admin·API·web) · MCP(실행경계) · SQLite(`~/.tradingcodex/state/`).
- 설치는 *빈 워크스페이스에 install.sh*(소스 clone 아님) → Codex 재시작 → `$orchestrate-workflow ...`.
- 공개 주식이 first sleeve, ETF/index·crypto·macro·options·credit·cross-asset로 확장 설계.

---

## 내 생각 — 현수봇 관점 (개선점 = "시장에 적응하는 규칙")

### 직접적 연결: 구조 높음 / 코드 낮음

현수봇은 *분석=주문이 한 흐름*이고 학습루프가 약하다. TradingCodex는 이를 두 축으로 격상하는 청사진을 준다:

| 현수봇 현재 | TradingCodex 흡수 개선 |
|---|---|
| Smart Adjuster(암묵 방어) | **명시적 실행경계**: 분석→정책→approval→audit 분리(스캘퍼는 자동승인이라도 *로그·정책체크 단계 명문화*) |
| 거래 로그만 남김 | **Postmortem 의무화**: 손절·미진입·필터탈락마다 근본원인+개선안 기록(체결 외도 학습) |
| 규칙 수정=코드 직접 변경 | **Skill evolution 절차**: 규칙 변경을 `proposal→validation→approval→apply→audit`로(=현수봇 전략을 숨은 변경 없이 진화) |
| 반복 실수 재발 | **Validation 테스트화**: "변동성 죽을 때 진입 금지" 같은 교훈을 진입 전 자동 체크로 박제 |

**흡수 #1(반성·기억)과의 결합:** TradingAgents 반성·기억 루프가 "거래에서 *배우는*" 엔진이라면, TradingCodex improvement loop는 그 배움을 **규칙·테스트로 *제도화*** 하는 골격. 둘을 합치면 = **재귀개선 루프**(거래→회고→교훈→규칙 proposal→검증→적용→audit→다음 거래). 이것이 "딸깍봇이 아닌, 시장에 적응·성장하도록 진지하게 설계한 시스템"의 실증 구조.

### 포폴 어필 spine (3-way)
- **내 방식(현수봇)**: 페르소나 + 실거래 + 속도(스캘퍼) — 실제 운용한 자율 시스템.
- **외부 참고 #1(TradingAgents)**: 다관점 토론 + 반성·기억(학습 엔진).
- **외부 참고 #2(TradingCodex)**: harness + guardrail + improvement loop(성장·안전 골격).
- **개선점**: 내 봇에 학습 엔진(#1) + 제도화 골격(#2)을 얹어 *재귀개선 자동매매*로 진화 → "한 번 짜고 끝"이 아니라 *루프로 성장하는 규칙*.
→ 상세 spine: `wiki/스테이징 영역`

---

## 다음 학습 후보

1. **현수봇 흡수 통합본** — #1(반성·기억) + #2(improvement loop) 합본 설계 ③Gate.
2. **goose recipes / hooks** ([goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md)) — skill evolution·hook 패턴 대조.
3. **Trading-R1** (Tauric) — RL 트레이딩 추론(반성루프의 학습신호 강화 후보).
