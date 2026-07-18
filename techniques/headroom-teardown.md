---
created: 2026-06-13
updated: 2026-06-13
type: learning
tags: [headroom, context-compression, token-saving, ccr, cache-alignment, content-router, sub-brain, reasoning-budget]
category: technique
source: https://github.com/chopratejas/headroom
authors: [chopratejas]
year: 2026
---

<!-- chopratejas/headroom 컨텍스트 압축 분석 및 Sub-brain 비교/응용 연구서입니다. -->

# 헤드룸 해체 및 Sub-brain 응용/강화 전략 — headroom-ai (chopratejas/headroom)

> ✅ **확정(confirmed) 2026-06-14** — 세션 내 ③Gate 통과 + 작가 수용. (외부 미검증 세부는 본문 표기 유지.)

> **한줄**: 로컬 컨텍스트의 기계적 압축(CCR)과 프레임워크 수준의 캐시 제어를 해체하여, Sub-brain의 마크다운 지식 그래프 및 하네스(Harness)에 무손실·고효율 지식 복원 체계로 응용하고 강화하는 스펙.

---

## 1. headroom-ai 핵심 아키텍처 (GPT 레포 대조 검증 — `[✓]`=레포확증 / `[⚠]`=미검증)

> 패키지 `headroom-ai` v0.25.0 (Apache-2.0, Python ≥3.10). 슬로건 "The context compression layer for AI agents" — AI 에이전트가 읽는 tool output·log·RAG chunk·file·conversation history를 LLM 도달 *전* 압축. **3 진입점**: SDK(`compress()`/`HeadroomClient`) · Proxy(`headroom proxy`) · MCP server(`headroom_compress`/`headroom_retrieve`/`headroom_stats`). `[✓ README/pyproject.toml]`

### 1) ContentRouter (라우팅 — 파이프라인 중심) `[✓ content_router.py]`
*   현재 기본 파이프라인 = **CacheAligner → ContentRouter** (구 trailing context-management stage 는 코드상 retired).
*   콘텐츠 타입 감지 후 적합 compressor 로 라우팅: JSON array→SmartCrusher · code→CodeCompressor · logs→LogCompressor · search→SearchCompressor · HTML→HTMLExtractor · plain text→Kompress/passthrough. mixed content 는 섹션 분할 후 개별 압축·재조립.
*   기본값: `enable_kompress/smart_crusher/search/log/html=True`, **`enable_code_aware=False`**(코드는 pass-through 우선).

### 2) CCR (Compress-Cache-Retrieve) — 가역성 (Reversibility) `[✓ ccr.mdx]`
*   **작동**: 압축 시 원본을 로컬 캐시에 저장하고 압축 결과에 hash marker 를 남김.
*   **역복원**: 에이전트가 `headroom_retrieve(hash=...)` 툴을 호출해 원본 복원. `query` 파라미터를 주면 전체 복원 대신 **BM25 검색으로 관련 subset 만** 반환. 기본 TTL = proxy 300초(`HEADROOM_CCR_TTL_SECONDS` 조정, MCP 1시간).

### 3) Content-Aware Compressors
*   **SmartCrusher** `[✓ architecture.mdx]` (정정 — 초안의 "k1/k2 단축키 alias" 는 **오류**): JSON array tool output 에서 field-level statistics · Kneedle 기반 bigram coverage · anomaly/error 항목 보존 · constant field factoring 수행. item retention split = array start 30% / end 15% / importance 55%, error item 은 budget 무관 보존. (벤치 87.6% 압축, 정답 4/4 유지.)
*   **CodeCompressor** `[⚠ 동작 미검증]`: code→CodeCompressor 라우팅은 존재하나 **기본 비활성**(`enable_code_aware=False`). 초안의 "Tree-sitter AST stub화"는 GPT 미확인 — 단정 보류.
*   **Kompress** `[⚠ 모델 미검증]`: plain text 용 compressor 로 실존(`kompress_model` config, `enable_kompress=True`). 단 초안의 "ModernBERT `kompress-v2-base` binary keep/discard classifier" 는 GPT 가 HF model card 미열람 — 미확정.

### 4) CacheAligner (KV 캐시 재사용 정렬) `[✓ architecture.mdx]`
*   **작동**: 타임스탬프·UUID·세션 토큰 등 매 호출 변경되어 provider prefix cache 를 깨뜨리는 dynamic content 를 프롬프트 후미로 옮겨 prefix cache hit 율을 높임 (overhead sub-ms).

### 5) 안전장치 `[✓ compress.py]`
*   **token inflation guard**: 압축 후 토큰이 오히려 늘면 원본 메시지로 되돌림. **fallback**: 파이프라인 예외 시 원본 반환(token stats 0).

---

## 2. 수학적 정량 비교 모델 (Mathematical Model)

> 🔴 **GPT 재검증 결과(2026-06-13): 아래 비용 수식(η·P(R)·θ·멀티턴 누적 패널티)은 레포에 근거 없음 — Gemini 합성 가설로 격리.** 실제 레포는 수식 대신 *실측 벤치마크*를 제공한다:
> - 워크로드 절감: Code search 17,765→1,408(92%) · SRE 디버깅 65,694→5,118(92%) · 이슈 triage 54,174→14,761(73%) · 코드베이스 탐색 78,502→41,254(47%) `[✓ README]`
> - SmartCrusher JSON: 10,144→1,260(87.6%), 정답 4/4 유지 · HTML 추출: 181페이지 F1 0.919/precision 0.879/recall 0.982(94.9%) `[✓ benchmarks.mdx]`
> - 프로덕션 텔레메트리: 50,000+ proxy 세션, P50 52ms, 누적 1.4B tokens saved `[✓ benchmarks.mdx]`
>
> → 아래 수식은 *우리의 멀티턴 과금 우려를 정식화한 사고실험*으로만 보존(레포 주장 아님). 실측 검증 대상.

### 1) 토큰 압축률 (Compression Efficiency)
압축된 토큰 수 $T_{compressed}$ 와 원본 토큰 수 $T_{original}$ 의 비율은 다음과 같습니다:
$$\eta = 1 - \frac{T_{compressed}}{T_{original}}$$

### 2) CCR 포함 총 토큰 소모량 공식 (Single-turn vs Multi-turn)
단일 턴(Single-turn) 환경에서의 총 소모 토큰 $T_{total}$ 은 복구 확률 $P(R)$ 및 고정 API 오버헤드 토큰 $T_{tool\_overhead}$ 에 의해 다음과 같이 모델링됩니다:
$$T_{total\_single} = T_{compressed} + P(R) \cdot (T_{original} + T_{tool\_overhead})$$

그러나 실제 에이전트 환경인 **멀티턴(Multi-turn) 세션**에서는 1회라도 원본을 복원($Retrieve$)하는 순간, 복원된 $T_{original}$이 이후의 모든 턴($N$회)의 대화 이력(History Context)에 누적되어 반복적으로 과금되는 **누적 패널티**가 발생합니다:
$$T_{total\_real} = T_{compressed} + P(R) \cdot \sum_{i=1}^{N} (T_{original\_i} + T_{tool\_overhead\_i})$$

### 3) 비용 실효 임계점 (Threshold $\theta$ 와 맹점)
단일 턴 관점의 임계 상한선 $\theta_{single}$ 은 다음과 같습니다:
$$\theta_{single} \approx \frac{\eta \cdot T_{original}}{T_{original} + T_{tool\_overhead}}$$

하지만 멀티턴 환경에서는 턴 수 $N$에 비례하여 패널티가 가중되므로 실질 임계 상한선 $\theta_{real}$ 은 $\theta_{single}$ 보다 **비약적으로 낮게 형성**됩니다:
$$\theta_{real} \ll \theta_{single}$$
즉, 복원 툴을 1~2회 이상 사용하는 에이전트의 경우, 토큰 압축으로 인한 이득보다 멀티턴 누적으로 인한 비용 폭증이 더 크므로, 기계적 압축(CCR)의 실효 사용 구간은 매우 좁게 제한됩니다.

> **⚠ [검증 필요 (Pending Verification)]**:
> 본 수식 모델 및 임계치 $\theta_{real}$의 실효 경계 조건은 순수 대수학적 가설이며, 실제 멀티턴 에이전트 대화 로그를 기반으로 한 실증적 데이터 측정 검증이 수반되어야 합니다.

---

## 3. 심층 탐구 및 논리적 맹점 (Deep Inquiry & Blindspots)

*   **Blind Omission (알 수 없는 누락)**: `Kompress-base`가 핵심 정보(예: 로그 내의 특정 hex 에러 코드 등)를 노이즈로 분류해 소거하면, LLM은 "정보가 유실되었다"는 사실 자체를 인지하지 못해 복원 툴(`headroom_retrieve`)을 호출할 기회조차 얻지 못하고 확신 편향적 환각(Hallucination)에 빠집니다.
*   **기회비용 (Overhead)**: 로컬 기기에서 매번 ModernBERT와 AST 파서를 돌리는 하드웨어 자원 점유 비용, 그리고 복원 툴을 1회 호출할 때마다 API Round Trip이 추가되어 에이전트의 최종 대기 시간이 늘어나는 시간적 기회비용이 존재합니다.

---

## 4. Sub-brain 응용 및 강화 전략 (Application & Enhancement)

### 1) 마크다운 기반의 "Anchor-based Semantic CCR" (가역적 앵커 압축)
*   **기본 응용**: `Token-Minimal Startup` 정책에 따라 `log.md`, `progress.md` 등의 데이터를 슬라이싱하되, 잘려 나간 하단부에 주석 마커를 배치합니다.
*   **강화 (Summary Drift 방지)**: 고정된 라인 범위(L141-L500)를 사용하면 파일 Prepend/Append 시 포인터가 즉시 어긋나는(Drift) 치명적인 유지보수 결함이 생깁니다. 이를 방지하기 위해 **"앵커 메타-요약(Anchor-based Pointer)"** 방식을 채택합니다.
    *   *예시*: `<!-- CCR-Pointer: #2026-W22-Sprint (Godot Spike-0 완결 및 HUD UI 2프로필 responsive HUD 레이아웃 고도화 이력 포함) -->`
    *   *효과*: 파일 라인 번호가 동적으로 바뀌어도 특정 마크다운 헤더(#)나 날짜 태그에 바인딩되므로 포인터 무결성이 지켜지며, 에이전트가 1줄 요약을 보고 유실된 맥락이 필요하다고 판단할 때만 `view_file`로 해당 섹션 앵커를 정밀 쿼리할 수 있게 만듭니다.

### 2) Prompt Layering을 통한 KV 캐시 극대화 (CacheAligner의 이식)
*   **응용**: 가변 파라미터(현재 시간, absolute path 등)를 프롬프트의 가장 최하단(Suffix)에 배치합니다.
*   **강화**: `dispatch-builder`가 생성하는 프롬프트를 3개 레이어로 고정 분할하여 구조화하되, 캐시 무력화를 방지합니다.
    *   **Layer 1 (Static Prefix - 80%)**: 변하지 않는 헌법(CLAUDE.md — 당시 GEMINI.md 포함, RETIRED 2026-07-04), locked GDD, core workflows.
    *   **Layer 2 (Semistatic Middle - 15%)**: hot-cache 로그, progress 현황 (이 영역은 매 턴 변조되기보다 세션 단위로 변동 빈도를 최소화해야 Layer 1의 캐시 이득이 완전히 보존됨).
    *   **Layer 3 (Dynamic Suffix - 5%)**: 현재 시간, cursor 위치, 이번 turn의 ad-hoc query.

### 3) Dual-Track 기반의 "Rule Distillation" (headroom learn의 강화)
*   **응용**: 실패한 에이전트 세션을 분석하여 규칙을 보완하는 개념을 차용합니다.
*   **강화**: 헤드룸의 `headroom learn`처럼 에러 로그 분석 후 규칙을 무차별 append하여 모순을 발생시키는 대신, 우리의 **Dual-Track Review Protocol**을 활용해 지식을 필터링합니다.
    *   에이전트가 실패(컴파일/테스트 에러 등)할 때마다 그 원인과 팁을 `Memory.md`에 `[Rule Candidate]` 마커와 함께 append합니다.
    *   주간 회고 시점에 정본 Claude가 Candidate들을 수집해 **규칙 모순 검사(Logical Conflict Check)**를 실행하고, 안전한 규칙만 헌법(당시 `CLAUDE.md`/`GEMINI.md`/`AGENTS.md` — 현행 `CLAUDE.md`/`AGENTS.md`)에 격상 반영합니다.
