---
created: 2026-04-23
updated: 2026-04-25
type: learning
tags: [ai-agent, autonomous-research, sakana-ai, llm, tree-search, agentic, paper-study]
source:
  - https://arxiv.org/abs/2408.06292
  - https://arxiv.org/abs/2504.08066
  - https://github.com/SakanaAI/AI-Scientist
  - https://github.com/SakanaAI/AI-Scientist-v2
category: technique
---

# AI Scientist v1 + v2 — 자율 과학 연구 에이전트 (정식 논문 학습)

> **AI NPC blueprint와의 직결성: 간접-중간.** v1 = 고정 템플릿 기반 "파이프라인 자동화". v2 = 템플릿 제거 + tree search로 "탐색적 창작"에 근접. v2의 **progressive agentic tree-search + experiment manager + VLM feedback** 구조는 NPC의 **서사 분기 탐색 + 일관성 검증기**로 직접 이식 가능한 발상.
> 분류: technique (아키텍처 정독), 적용성: 중간, 시급성: 중기.
> 본 페이지는 [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md)(사건·개요) 와 짝을 이루는 **논문·코드 정독 버전**.

---

## 한 줄 요약

**v1 (2408.06292, 2024-08)**: LLM 5단계 파이프라인(아이디어→구현→분석→문서화→평가)으로 **고정 ML 템플릿 11종**(nanoGPT / 2d_diffusion / grokking / MACE / earthquake-prediction / mobilenetV3 / probes / seir / sketch_rnn / tensorf / nanoGPT_lite)에서 완결 논문 자율 생성. 논문당 ~$15, automated reviewer가 near-human 정확도.

**v2 (2504.08066, 2025-04)**: **템플릿 제거** + **progressive agentic tree search** + **experiment manager agent** + **VLM figure feedback**. ICLR workshop peer review 통과(최초). 단, Sakana 자진 철회.

---

## 저장소 실제 구조 (2025-12 기준)

**v1 `SakanaAI/AI-Scientist`** — 13.4k stars, Jupyter Notebook 주력
```
ai_scientist/
├── generate_ideas.py        ← 1단계: 아이디어 생성
├── perform_experiments.py   ← 2·3단계: 구현·실행
├── perform_writeup.py       ← 4단계: LaTeX 집필
├── perform_review.py        ← 5단계: 자동 리뷰어
├── llm.py                   ← LLM 추상화
└── fewshot_examples/
templates/ (11개)
launch_scientist.py          ← 엔트리 포인트
review_ai_scientist/         ← 자기평가 실험
review_iclr_bench/           ← ICLR 리뷰어 벤치마크
example_papers/              ← 생성된 논문 샘플
```

**v2 `SakanaAI/AI-Scientist-v2`** — 5.8k stars, Python
```
ai_scientist/
├── perform_ideation_temp_free.py   ← 템플릿-프리 아이디어 (핵심 변화)
├── perform_writeup.py / perform_icbinb_writeup.py
├── perform_plotting.py             ← 플로팅 분리
├── perform_vlm_review.py + vlm.py  ← VLM 시각 검토 (신규)
├── perform_llm_review.py
└── treesearch/                     ← 트리 탐색 엔진 (신규)
    ├── agent_manager.py            ← Experiment Manager 실체
    ├── parallel_agent.py           ← 병렬 워커
    ├── interpreter.py              ← 코드 실행 sandbox
    ├── journal.py / journal2report.py  ← 연구 저널 → 리포트 변환
    ├── log_summarization.py
    └── bfts_utils.py               ← Best-First Tree Search 유틸
bfts_config.yaml                     ← 트리 탐색 설정
launch_scientist_bfts.py             ← 엔트리 (BFTS = Best-First Tree Search)
```

**핵심 발견:**
- "experiment manager agent" = `treesearch/agent_manager.py` 로 실체화
- "tree search" = **Best-First Tree Search (BFTS)** 으로 명명
- v2의 신규 레이어 = `treesearch/` 서브모듈 전체 + `perform_vlm_review.py`
- "저널" 패턴: 에이전트가 실험 과정을 journal에 기록 → journal2report.py가 논문 초안 변환

### BFTS 설정 실제 수치 (`bfts_config.yaml`)

| 파라미터 | 값 | 의미 |
|---------|----|----|
| `num_workers` | 4 | 병렬 에이전트 워커 수 |
| `stage1_max_iters` | 20 | 아이디어 단계 최대 반복 |
| `stage2/3_max_iters` | 12 | 탐색·개선 단계 |
| `stage4_max_iters` | 18 | 집필 단계 |
| `steps` | 5 | 개선 iteration 횟수 |
| `multi_seed_eval.num_seeds` | 3 | 결과 안정성 검증 |
| `search.max_debug_depth` | 3 | 디버깅 재귀 최대 깊이 |
| `search.debug_prob` | 0.5 | 디버깅 시도 확률 |
| `search.num_drafts` | 3 | 동시 draft 개수 |
| `code.model` | claude-3-5-sonnet | 코드 작성 |
| `feedback.model` | gpt-4o | 에러·trace 해석 |
| `vlm_feedback.model` | gpt-4o | figure 시각 검토 |
| `exec.timeout` | 3600s | 코드 실행 timeout |

→ **멀티 LLM 분업**: Claude가 코드 쓰고, GPT-4o가 평가·VLM 피드백. **같은 모델에 의존하면 blind spot 공유** 문제를 우회.

---

## 핵심 개념

### 1. 5단계 파이프라인 (v1)

```
Idea Generation (아이디어 생성)
  └─ 선행 연구 탐색 + 새로움 검증 (Semantic Scholar API)
Implementation (실험 코드 작성/수정)
  └─ Aider 기반 코드 에디팅 에이전트가 template 파일 수정
Experiment Execution (실험 실행)
  └─ 자동 실행 + 결과 수집 + 실패 시 재시도
Analysis (결과 분석)
  └─ metric 해석, figure 생성 (matplotlib)
Documentation (논문 집필)
  └─ LaTeX 템플릿에 writeup (Introduction → Conclusion)
Evaluation (자동 리뷰어)
  └─ ICLR review rubric 기반 자기평가 루프
```

### 2. Progressive Agentic Tree Search (v2 신규)

v1의 선형 파이프라인을 **트리 탐색**으로 교체:
- 각 노드 = 연구 상태(가설/코드/중간결과)
- 확장 = 여러 실험 변주 동시 시도
- 가지치기 = experiment manager agent가 유망/불가 판정
- 깊이 제한 + 예산 제한(토큰·시간·실행비용)

→ 이것이 곧 "자율 탐색" 의 실체. v1은 template에 갇혀 있었다면 v2는 **열린 공간** 탐색.

### 3. Experiment Manager Agent (v2 신규)

트리 전체를 감독하는 **메타 에이전트**:
- 각 branch의 진행 상황 모니터링
- 자원 할당 (어느 가지에 compute 더 줄지)
- 실패한 branch 조기 종료
- 새 branch 생성 트리거

→ **autoresearch의 "밤새 루프"** ([Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md))에 **계층적 감독자** 추가한 구조. Claude Code의 sub-agent 패턴과 동족.

### 4. VLM Figure Feedback (v2 신규)

Vision-Language Model이 생성된 matplotlib figure를 **이미지로 직접 검토**:
- "x축 레이블이 잘림", "legend 겹침" 같은 시각적 결함 감지
- 텍스트 기반 코드 리뷰로는 못 잡는 layout/aesthetics 문제
- 수정 지시를 코드 에이전트에게 피드백

→ 내 관점: **NPC가 생성한 장면/대사의 "시각·정서 검증기"** 로 이식 가능. "이 장면이 플레이어에게 어떻게 보일까"를 VLM이 판정.

### 5. Automated Reviewer

ICLR review rubric 내재화:
- Soundness / Presentation / Contribution / Rating
- v1에서 near-human 정확도 주장
- v2는 이것을 tree search의 **scoring function**으로도 재활용 (이중 역할)

→ 자기평가 = **생성기/평가기 분리**의 정석. Self-Refine·Reflexion 계보.

---

## v1 → v2 진화 핵심

| 축 | v1 (2024-08) | v2 (2025-04) |
|----|-------------|-------------|
| 도메인 | 고정 ML 템플릿 3종 | 열린 ML 탐색 (cross-domain) |
| 탐색 방식 | 선형 파이프라인 | Progressive agentic tree search |
| 사람 의존 | human-written templates 필요 | **템플릿 없음** (zero-shot 가까움) |
| 감독 | 파이프라인 고정 | **Experiment manager agent** |
| Figure 검증 | 텍스트 기반 | **VLM 시각 피드백** |
| 최고 성과 | automated reviewer near-human | **ICLR workshop peer review 통과** (최초) |
| 성공률 | 높음 (template 덕) | **낮음** (open exploration 대가) |
| 비용 | ~$15/paper | 공개 안 됨 (추정 더 큼) |

**저자 본인들의 평가 (v2 repo 중요 메모):**
> "v2 isn't necessarily better than v1 — v1 = well-defined templates, high success; v2 = open-ended exploration, lower success"

→ **용도 분리**. 파이프라인 자동화는 v1, 진짜 탐색은 v2.

---

## 해결하는 문제

1. **연구 병목의 자동화**: 문헌조사·구현·분석·집필 각 단계 수작업 제거
2. **아이디어 고갈 문제**: LLM이 대량의 후보 가설 생성 + 새로움 검증
3. **재현성 부담**: 모든 실험 자동 로깅
4. **scaling 창작**: 인간 과학자 1명 → 병렬 수십 branch 탐색

---

## 해법의 핵심 트릭

- **Aider를 코드 에디터로 차용**: 에이전트가 파일 diff 수준에서 작업 (전체 rewrite 아닌 패치)
- **Semantic Scholar API로 grounding**: 아이디어가 이미 존재하는지 자동 검증 → hallucinated novelty 방지
- **tree search의 budget-bounded expansion**: 무한 탐색 방지
- **생성기-평가기 분리**: 같은 LLM을 역할만 바꿔서 writer / reviewer로 활용
- **VLM 이중화**: 텍스트-only로 잡히지 않는 visual defect 탐지 레이어

---

## 수치적 결과

**v1:**
- NanoGPT / 2D Diffusion / Grokking 템플릿에서 end-to-end 논문 생성
- 논문당 ~$15 API 비용
- Automated reviewer가 인간 리뷰어와 상관관계 높음 (논문 표 참조)

**v2:**
- ICLR 2025 workshop 제출 3편 중 1편 통과
- 평균 점수 6.33 (인간 제출물 상위 55% 수준)
- **최초로 peer-reviewed venue에서 AI 단독 저자 논문 심사 통과**

---

## 기술 스택

- **런타임**: Linux + NVIDIA GPU + CUDA + PyTorch
- **LLM**: OpenAI (GPT-4o 계열), Anthropic Claude, Claude-Bedrock, Google Vertex
- **코드 편집**: Aider
- **문헌 탐색**: Semantic Scholar API
- **논문 작성**: LaTeX 템플릿
- **오픈소스 여부**: v1(13.4k⭐) / v2(5.8k⭐) 둘 다 공개. 2025-12-19 최근 push
- **v2 핵심 모델**: claude-3-5-sonnet (코드) + gpt-4o (feedback·VLM·report) — **교차 검증용 멀티 LLM**
- **보안 경고**: LLM이 생성한 코드를 직접 실행 — sandbox 권고

---

## 내 생각 — AI NPC 관점

### A. v2 아키텍처의 NPC 이식 매핑

| AI Scientist v2 | AI NPC 대응 |
|----------------|------------|
| Idea node | 서사 분기 후보 (plot branch) |
| Tree search | 가능 서사 공간 탐색 |
| Experiment manager | **서사 일관성 감독 에이전트** (주인공 정체성·세계관 violation 차단) |
| Code agent (Aider) | 대사/장면 생성기 |
| VLM figure feedback | **장면 시각·정서 검증기** (플레이어 관점 시뮬레이션) |
| Automated reviewer | **서사 품질 평가기** (긴장감·개연성·몰입감 rubric) |
| Semantic Scholar | **월드 bible / 캐논 DB** (이미 발생한 사건 grounding) |

→ **"AI Novelist/Dramaturg"** 가설([Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md))의 구체 설계도. v2 구조를 거의 1:1 복제 가능.

### B. Layer 0 업데이트 근거 강화

자진 철회는 단순 윤리 제스처 아닌 **저자성 스펙트럼 표명**. NPC도 같은 질문 — "플레이어-NPC 공동 서사의 저자는?" → ai-npc-blueprint Layer 0에 "저자성/창작 권리" 축 **정식 추가 필요**.

### C. v1/v2 교훈 — 탐색 vs 파이프라인 분리

내 프로젝트에 직접 시사:
- **북켓몬 추천 튜닝** = v1형 (고정 파이프라인, 반복 실행, 비용 최소)
- **NPC 서사 생성** = v2형 (열린 탐색, 실패 허용, 메타 감독 필수)

→ 두 모드를 **같은 시스템 안에서 스위치**로 두는 설계. Sub brain + seCall과 유사한 "기억/탐색 분리" 패턴.

### D. Journal → Report 변환 패턴

v2의 `journal.py` + `journal2report.py` = **"과정 기록 → 산출물 생성"** 의 분리.
- Journal: 실험 중 실시간 로그 (가설·시도·실패·결과)
- Report: 최종 논문 (선택·정리·narrativize)

→ **Sub brain의 `raw/sessions/` → `wiki/` 파이프라인과 동형**. 내가 이미 seCall로 하고 있는 일의 구조와 같음. NPC 설계에서도 "플레이어 세션 로그 → 서사 요약" 분리에 이식 가능.

### E. VLM feedback의 일반화

"생성물의 본래 modality로 다시 검증" 원칙:
- 논문 → figure는 VLM이 본다
- 소설 → 낭독 TTS로 듣고 리듬 검증? (Audio LM 피드백)
- NPC 대사 → TTS + 감정 classifier로 정서 검증
- 코드 → 실행 trace LM이 본다

→ 일반 원칙: **생성 modality ≠ 검증 modality** 를 다르게 두면 blind spot 줄어든다.

---

## 열린 질문

- v2의 tree search는 **width × depth** 실제 parameter가 얼마? 논문 Table 참조 필요
- Experiment manager의 **decision policy**는 학습된 것인지 프롬프트 규칙인지 (논문 본문 확인)
- VLM figure feedback이 잡은 **구체 결함 예시** (supplementary에 있을 듯)
- Automated reviewer의 self-reference bias — v2 tree scoring에 쓰일 때 순환 문제 어떻게 해결?
- 자진 철회된 논문의 **실제 주제와 기여**: pub.sakana.ai/ai-scientist-v2/paper 본문 확보
- $15/paper는 v1 수치 — v2는 몇 배? tree search의 실제 budget?
- 3편 중 1편 통과 — 나머지 2편의 탈락 사유 (논문 부록)
- LLM-written code 직접 실행의 **sandbox 구현 수준** (repo README 경고)

---

## 다음 학습 후보

- v2 본 논문 pub.sakana.ai/ai-scientist-v2/paper **본문 PDF 정독** (현재는 repo/abstract 수준만 확보)
- Sakana 공식 블로그 sakana.ai/ai-scientist-first-publication/ **철회 서술** 직독
- **Aider** (paulg/aider) — 에이전트 코드 에디터의 표준. `learnings/methods/aider.md` 후보
- **Self-Refine / Reflexion / CRITIC** — 자기평가 루프의 학술 계보
- **Semantic Scholar API** — 문헌 grounding의 표준 도구
- **Tree search agent 계열** — Tree of Thoughts, Language Agent Tree Search (LATS)
- ICLR 2025 workshop 통과 논문 **본문 확보** (어떤 주제, 어떤 결과였는지)

---

## 적용 아이디어

### 단기 (1~2주)
- paper-write 에 **v1 5단계 파이프라인**을 참고 아키텍처로 명시
- [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md) 와의 차이 표를 그 문서에 포함 (실험 루프 vs 논문 루프)
- 본 페이지의 "NPC 이식 매핑 표"를 ai-npc-blueprint Layer 설계에 반영

### 중기 (1~3개월)
- **미니 AI Scientist v1** 로컬 실행 실험 — NanoGPT 템플릿으로 1편 생성해보고 구조 체감
- 그 경험을 바탕으로 **북켓몬 추천 자동 튜닝** 파이프라인 이식 (5단계 중 Implementation+Analysis만 차용)
- ai-npc-blueprint Layer 0에 **저자성/창작 권리** 축 추가 커밋

### 장기 (6개월+)
- **"AI Dramaturg"** 최소 프로토타입:
  - Experiment manager → 서사 감독 에이전트
  - Tree search → 분기 3개 동시 생성
  - Automated reviewer → 서사 rubric 자체 작성
  - VLM feedback → 장면 이미지 감정 검증 (Stable Diffusion + VLM)
- 결과를 `projects/ai-dramaturg/` 로 기록

---

## 연결된 페이지

- [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md) — 본 페이지의 사건·개요 자매. 기자 보도 기반
- [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md) — 같은 DNA. "실험 루프" vs 본 논문 "논문 루프 + tree search"
- [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](../methods/everything-claude-code.md) — experiment manager = ECC의 sub-agent 감독 패턴과 동종
- ai-npc-vision — 자율 창작의 선행 도메인
- ai-npc-blueprint — Layer 0 저자성 축 + v2 아키텍처 이식 매핑
- [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) / [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) — 자진 철회의 윤리 해석 프레임
- [Parcae — Stable Looped Language Models](parcae-looped-lm.md) — 루프형 LLM 계열 (tree search도 루프의 변종)
- paper-write — 5단계 파이프라인 참고

---

## 출처

- **v1 논문**: Lu, Lu, Lange, Foerster, Clune, Ha. "The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery." arXiv:2408.06292 (2024-08)
- **v2 논문**: Yamada, Lange, Lu, Hu, Lu, Foerster, Clune, Ha. "The AI Scientist-v2: Workshop-Level Automated Scientific Discovery via Agentic Tree Search." arXiv:2504.08066 (2025-04-10)
- **코드**: github.com/SakanaAI/AI-Scientist, github.com/SakanaAI/AI-Scientist-v2
- **블로그**: sakana.ai/ai-scientist-first-publication/
- **v2 본문 PDF**: pub.sakana.ai/ai-scientist-v2/paper (미확보)
- 학습일: 2026-04-23
- 정독 수준: abstract + repo README + 핵심 아키텍처 요약 (본문 정독 미완 — 다음 학습 후보에 명시)
- **2026-04-25 본문 보강**: Nature 651, p.914-917 (2026-03-26 published) 본문 정독

---

## 본문 보강 (Nature 2026 published 버전)

### Automated Reviewer가 인간 리뷰어와 통계적 동급 (놀라움)

NeurIPS 2021 consistency study와 비교 (Table 1):

| 지표 | Human (NeurIPS) | Automated (pre-cutoff) | Automated (post-cutoff) |
|------|----------------|------------------------|-------------------------|
| Balanced acc | 0.66 | **0.69 ± 0.04** | 0.66 ± 0.03 |
| F1 | 0.49 | **0.62 ± 0.09** | **0.67 ± 0.09** |
| AUC | 0.65 | 0.69 ± 0.09 | 0.65 ± 0.10 |
| FPR | 0.17 | 0.45 | 0.52 |
| FNR | 0.52 | **0.17** | **0.17** |

**핵심:**
- F1, AUC, balanced accuracy에서 Automated가 인간 **초과 또는 동급** (z-test p=0.319 pre / 0.921 post — 유의차 없음)
- FNR이 인간 0.52 → AI 0.17 (AI가 좋은 논문 덜 떨어뜨림)
- FPR은 인간 0.17 → AI 0.45 (AI가 나쁜 논문 더 통과시킴)
- knowledge cutoff 후 데이터에서도 성능 유지 — data contamination 영향 미미

→ **인간 리뷰의 일관성이 낮다**는 점도 보여줌 (NeurIPS 2014 실험 이래 알려진 문제). AI가 "더 정확"이라기보다 "더 일관" 쪽에 가까울 가능성.

### ICLR 2025 ICBINB workshop 통과의 정확한 조건

- **3편 제출, 1편 6.33 (6/7/6) — workshop accept 임계 초과**
- workshop acceptance rate 70% (메인 32%) — 낮은 바
- 통과한 논문은 **negative result** (workshop 주제와 정합)
- 사전 합의대로 **자진 철회** — 발표 전제 X
- IRB H24-02652 + ICLR 리더십 + 워크숍 조직위 모두 사전 동의
- 리뷰어들은 "AI 생성물이 섞여 있다"는 사실은 알고 있었으나 **어느 것인지는 몰랐음**

### 자체 인간 평가 결과 (Sakana 팀 내부)

3편 중:
- 1편 = workshop 바 통과
- 0편 = ICLR 메인 컨퍼런스 바 통과
- → **메인 학회 수준은 아직 멀었다** (저자 명시)

### 모델 발전과 paper score 강한 상관

R² = 0.517, p < 0.00001. Sonnet-3.5 → Sonnet-3.7 → Sonnet-4 → o3로 가면서 단조 증가. **"foundation model 좋아지면 자동으로 좋아짐"** = 시스템 디자인 외 변수가 큼.

### 4-stage Tree Search 명세 (Fig 1a)

1. Preliminary investigation
2. Hyperparameter tuning
3. Research agenda execution
4. Ablation studies

각 stage 끝에 best checkpoint를 다음 stage seed로. Tree node 색깔: Non-buggy / Buggy / Hyperparameter / Ablation / Replication / Aggregation / Best.

### 한계 명시 (저자 자가 진술)

1. naive/underdeveloped ideas
2. 핵심 아이디어 잘못 구현
3. 방법론 깊이 부족
4. 실험 구현 오류
5. main text와 appendix figure 중복
6. inaccurate citation hallucination
7. **"AI가 쉽게 속는다 + overconfidently wrong"** — 해결 어려움 명시

→ [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) 의 ToM 한계와 같은 결의 경고.

### 미래 작업 (저자 명시)

> "the length of tasks that AI can reliably complete is doubling every 7 months"

→ 5년 안에 메인 학회 통과 가능 시사. 도메인 확장:
- automated chemistry lab
- 인간이 실험 수행 + AI가 설계/분석
- 단, computational experiment만 현재 가능

### 윤리 측면 (Nature 본문에서 명시한 5가지 위험)

1. peer review 시스템 과부하
2. 연구 자격 인플레이션
3. 타인 아이디어 무단 활용
4. 과학자 일자리 소실
5. 비윤리/위험 실험 수행 가능성

→ Sakana의 자진 철회가 이 5가지 중 1, 3에 대한 직접 응답. [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) 와 결을 같이 함.

---

## 본문 정독에서 새로 발견한 NPC 함의

### G. Reviewer ensemble + meta-review 패턴

5개 review 앙상블 + area chair meta-review = **NPC dialogue quality 검증**에 그대로 이식 가능. NPC 응답을 5개 다른 perspective LLM이 평가 + 1개 메타 평가자가 최종 결정. [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](role-llm.md) 의 dialogue engineering과 결합.

### H. "Always reject" baseline의 교훈

NeurIPS는 acceptance rate 낮아 "always reject" 전략이 65% accuracy. 이건 **메트릭 함정** — balanced accuracy / F1로 봐야 함. NPC 평가에서도 "기본값 거부"가 score 높을 수 있음 → 평가 메트릭 신중 선택.

### I. Negative result가 통과한 사실

Workshop 주제 정합 = "흥미로운 negative result". → **NPC 시스템 평가도 실패 사례 documentation이 가치**. 내 ai-scientist 위키에 실패 모드 명시는 옳은 방향.

### J. Self-assessment의 정직함

Sakana 자가 평가: "메인 통과 0편" 명시. **창작자 정직성**의 모범. values 의 정직성 축 + [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) 의 책임 윤리.
