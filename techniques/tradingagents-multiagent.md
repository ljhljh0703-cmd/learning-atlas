---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [AI, trading, multi-agent, LLM, langgraph, reflection, memory, BM25, debate, risk-management, hyunsoo-bot]
source: https://github.com/TauricResearch/TradingAgents
authors: [Yijia Xiao, Edward Sun, Di Luo, Wei Wang]
year: 2025
category: technique
---

# TradingAgents — LLM 멀티에이전트로 "트레이딩 회사"를 모사하는 프레임워크

*Tauric Research (Yijia Xiao 외, arXiv 2412.20138, q-fin.TR)*

실제 헤지펀드/트레이딩 회사의 직무 분업(애널리스트 → 리서처 토론 → 트레이더 → 리스크팀 → 포트폴리오 매니저)을 그대로 LLM 에이전트 역할로 분해하고, LangGraph로 묶어 협업·토론하게 만든 오픈소스 프레임워크. **현수봇 흡수원 #1**으로 해체 (선별 흡수, 1순위=반성·기억 루프).

---

## 한 줄 요약

> 단일 LLM "분석 한 방" 대신, 강세/약세·공격/보수 **에이전트 토론**으로 결정을 다관점화하고, **실현수익 회고를 다음 결정에 BM25로 주입**해 거래에서 배우게 만든다.

---

## 정직한 판단 (Honest Assessment)

| 질문 | 답 |
|------|----|
| AI NPC blueprint 레이어? | 직접 매칭 약함 — 단 "역할분담 + 토론 + 기억 회고"는 [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md)·ai-npc-vision의 멀티에이전트 사회 구조와 개념 공유 |
| 직접 적용 vs 개념 수확? | **개념 수확** (코드 직접재사용은 거의 불가 — 아래 미스매치) |
| 시급성? | **지금** — 현수봇 최종 단계 흡수원으로 작가가 지정 |

**코드 직접재사용이 안 되는 이유 (미스매치):**
- **시장**: TradingAgents = 미국 주식(yfinance·Alpha Vantage·SPY 대비 alpha) / 현수봇 = 크립토 선물(Binance·CCXT).
- **호흡**: TradingAgents = 일단위 리서치·**시뮬레이션**(실거래 미실행) / 현수봇 = **실거래 스캘퍼 실시간 루프**.
- **비용/레이턴시**: 한 결정에 애널 4 + 리서처 토론 N라운드 + 리스크 토론 = LLM 호출 수~수십 회 → 스캘퍼 빠른 루프와 상극.

→ 따라서 **개념·메커니즘만 이식**한다. (작가 결정: 선별 흡수, 스캘퍼 빠른 루프 유지)

---

## 핵심 개념

### 1. 직무 분업 = 5 레이어 멀티에이전트 (LangGraph)

```
애널리스트팀 → 리서처 토론 → 리서치매니저 → 트레이더 → 리스크 토론 → 포트폴리오매니저(최종 승인/거부)
```

| 레이어 | 에이전트 | 소스 |
|--------|---------|------|
| 애널리스트 | Fundamentals / Market(기술지표 MACD·RSI) / News / Sentiment(+Social/Reddit/Stocktwits) | `agents/analysts/*` |
| 리서처 | **Bull ↔ Bear** 구조화 토론 | `agents/researchers/{bull,bear}_researcher.py` |
| 리서치 매니저 | 토론 판정·종합 | `agents/managers/research_manager.py` |
| 트레이더 | 종합 → 매매 결정(타이밍·규모) | `agents/trader/trader.py` |
| 리스크팀 | **Aggressive / Conservative / Neutral** 토론 | `agents/risk_mgmt/*_debator.py` |
| 포트폴리오 매니저 | 거래 제안 최종 승인/거부 | `agents/managers/portfolio_manager.py` |

토론을 거치는 점이 핵심 — 단일관점 편향을 강세/약세, 공격/보수 대립으로 상쇄한다.

### 2. 반성·기억 루프 ★ (현수봇 1순위 흡수 대상) — 소스 직접 확인

두 부분으로 구성:

**(a) 결정 로그 (항상 ON)** — `~/.tradingagents/memory/trading_memory.md` (md 파일, append).
- 매 실행 후 **실현수익**(raw + **SPY 대비 alpha**)을 다시 가져옴.
- 한 문단 **회고** 생성 → 동일 티커 최근 결정 + 교차 티커 교훈을 **포트폴리오매니저 프롬프트에 주입**.
- 경로 override: `TRADINGAGENTS_MEMORY_LOG_PATH`.

**(b) `FinancialSituationMemory` — `agents/utils/memory.py` (정정 포인트)**
- 매칭 방식 = **BM25(렉시컬), 벡터 임베딩 아님**. 주석 명시: *"no API calls, no token limits, works offline with any LLM provider."*
- `(situation → recommendation)` 쌍 저장 → 현재 상황 토큰화 후 BM25 top-n 매칭 → 과거 교훈 회수.
- 역할별 메모리 분리(bull/bear/trader/judge/PM 각각).

**`Reflector` (`graph/reflection.py`) 회고 프롬프트 골격:**
1. 결정이 맞았나/틀렸나를 **수익 증감으로 판정**.
2. 기여 요인 분석(기술지표·뉴스·센티먼트·펀더멘털 가중).
3. 틀린 결정엔 구체적 수정안(예: HOLD→BUY).
4. 교훈 요약 → ≤1000토큰 한 문장으로 압축(주입용 쿼리).

> 🔑 **vault 정합**: BM25 채택은 [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md)(grep>벡터 RAG)·[Google Open Knowledge Format (OKF) v0.1 — 에이전트 지식 표준](../methods/google-okf-knowledge-format.md)(no vector) 철학의 **외부 증거**. 무비용·오프라인이라 현수봇 스캘퍼에 그대로 얹기 좋다.

### 3. 구조화 출력 (v0.2.4)
- `agents/schemas.py` (pydantic) — Research Manager·Trader·Portfolio Manager가 구조화 출력. 결정 파싱 신뢰성↑.

### 4. 운영 인프라
- 멀티 프로바이더: OpenAI/Gemini/Claude/Grok/DeepSeek/Qwen/GLM/Ollama/Azure (`llm_clients/`).
- LangGraph **체크포인트 재개**(`--checkpoint`, 티커별 SQLite) — 중단 복구.
- `deep_think_llm`(복잡 추론) / `quick_think_llm`(경량) 2-tier 모델 분리.

---

## 수치적 결과 / 한계

- 논문(arXiv 2412.20138)은 멀티에이전트 토론·반성이 단일 LLM 베이스라인 대비 의사결정 품질을 높인다고 주장하나, README 자체가 **성능은 백본 모델·온도·기간·데이터 품질 등에 좌우되며 투자조언 아님**을 명시(비결정적). → 본 노트는 *아키텍처·메커니즘* 수확이 목적이고, 성능 수치는 cold-verify 대상(컷오프 後 1차출처 미검증, 과장 금지).

---

## 기술 스택 / 사용법

```python
from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG

config = DEFAULT_CONFIG.copy()
config["llm_provider"] = "google"        # 현수봇은 Gemini 사용 → 동일 프로바이더
config["max_debate_rounds"] = 2
ta = TradingAgentsGraph(debug=True, config=config)
_, decision = ta.propagate("NVDA", "2026-01-15")
```

스택: LangGraph · pydantic · rank_bm25 · yfinance/Alpha Vantage · (Reddit/Stocktwits 센티먼트).

---

## 내 생각 — 현수봇 관점

### 직접적 연결: 중간~높음 (개념), 낮음 (코드)

현수봇은 *Gemini 단일분석 + XGBoost 정적판사* 구조라 "거래에서 배우는 루프"가 결핍돼 있다. TradingAgents의 반성·기억 루프가 정확히 그 빈칸을 메운다. 흡수 매핑:

| TradingAgents | → 현수봇 이식 |
|---|---|
| 실현수익 raw + SPY 대비 alpha | 청산 ROE + **BTC 대비 alpha**(크립토 벤치마크) |
| 결정 로그 `trading_memory.md` | `trade_memory.md`(현수봇 repo, append) |
| `Reflector` 회고 프롬프트 | 청산 시 Gemini 회고 1문단(맞음/틀림=ROE 기준) |
| `FinancialSituationMemory`(BM25) | 현재 시장상황 BM25 매칭 → 다음 Gemini 분석에 교훈 주입 |
| Bull/Bear 토론 | (2순위) 단일 Gemini 프롬프트 내 강세/약세 자가토론 |
| 리스크 3파 토론 → PM 승인 | (3순위) Smart Adjuster를 명시적 진입 승인/거부 게이트로 격상 |

페르소나 시너지: 회고 기억은 현수 1인칭("지난번 그 손절 기억하지")과 자연 결합 → ai-npc-vision의 "관계 형성 NPC" 프로토타입을 강화.

**과적용 가드:** 토론 다회 호출을 스캘퍼 메인 루프에 넣지 말 것(레이턴시·비용). BM25 회고 주입은 호출 0 추가라 안전. 풀 LangGraph·fundamentals(주식 재무제표)는 크립토 부적합 → 보류.

### 연결 포인트
- hyunsoo-bot — 흡수 대상 SSOT (반성·기억 루프 통합안은 `스테이징 영역/` 스테이징).
- [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md) — BM25 채택의 철학적 정합(grep>벡터).
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — 기억·반성·계획 루프의 선행 정본(Park 2023).

---

## 다음 학습 후보

1. **Trading-R1** (Tauric, arXiv 2509.11420) — 동일 팀 후속, RL 기반 트레이딩 추론.
2. **두 번째 흡수원 repo** (작가 제공 예정) — 현수봇 흡수 #2.
3. **Generative Agents 재독** ([Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md)) — 반성·기억 메커니즘 원형 대조.
