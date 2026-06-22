---
created: 2026-04-21
updated: 2026-06-18
type: learning
tags: [AI, research-methodology, automation, karpathy, nanochat, tool]
source: https://github.com/karpathy/autoresearch
category: methodology
---

# Autoresearch — Karpathy의 자동 연구 루프

*Andrej Karpathy*

> "AI 에이전트에게 작지만 진짜인 LLM 학습 환경을 주고, 밤새 자율 실험하게 한다."

**이것은 "기술"이 아니라 "연구 방법론/도구"다.** 다른 learnings 페이지와 결이 다름.

> 🌟 **프로덕션 확증 (2026-06-18)**: 아래 "방법론 이식 가능" 가설이 실제로 확인됨 — NAVER 가 이 패턴을 *LLM 학습이 아닌 미디어 ABR 도메인*에 이식해 QoE 17.1% 자율 향상. 다단게이트·escalation vein 포함: [AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)](autoresearch-llhls-abr.md).

---

## 한 줄 요약

> 에이전트가 `train.py`를 편집 → 5분 학습 → 메트릭 개선 시 유지, 아니면 롤백. 이걸 밤새 100+회 반복.

---

## 핵심 철학

### 1. "사람이 아닌 에이전트가 코드를 고친다"

전통 ML 연구: 사람이 Python 파일 편집 → 실험 → 분석 → 다시 편집
Autoresearch: 사람은 `program.md`(자연어 지침)만 쓰고, 에이전트가 실제 편집

### 2. 공정성 = 고정 시간 예산

**모든 실험은 정확히 5분.** 아키텍처 변형들이 "같은 compute 예산"에서 경쟁하므로 비교 가능.

### 3. 극단적 미니멀리즘

- 단일 GPU (분산 학습 없음)
- 파일 3개가 전부
- 에이전트가 수정 가능한 파일은 `train.py` **하나뿐**

---

## 구조

```
prepare.py   — 데이터 준비, 상수 (불변)
train.py     — 모델, 옵티마이저, 학습 루프 (에이전트가 수정)
program.md   — 에이전트 지침 (사람이 편집)
```

**루프:**

```
[program.md 읽기]
      ↓
[train.py 수정]
      ↓
[5분 학습]
      ↓
[bits-per-byte 측정]
      ↓
   개선됐나?
    ↓       ↓
   Yes     No
    ↓       ↓
  유지    롤백
    ↓       ↓
   [다음 반복]
```

---

## 기술 스택

- Python 3.10+, PyTorch
- Optimizer: Muon + AdamW
- GPU: NVIDIA (H100 기본, 작은 GPU 튜닝 가이드 있음)
- 패키지 관리: `uv`

```bash
uv sync
uv run prepare.py   # 1회, 약 2분
uv run train.py     # 실험 1회 (5분)
```

에이전트 구동 예:
> "program.md 보고 새 실험 하나 돌려줘"

---

## 내 생각 — 연구/논문 관점

### 논문 작업의 어느 부분을 커버하나

| 논문 단계 | Autoresearch |
|----------|-------------|
| 문제 정의 | ❌ 사람의 역할 |
| 실험/ablation | ✅ 핵심 |
| 로그/메트릭 기록 | ✅ 자동 |
| 결과 해석 | 부분 (로그 기반) |
| **논문 글쓰기** | ❌ 별도 |

즉, **"실험의 경험적 증거"를 뽑는 공장**. 글쓰기는 별도 워크플로우 필요 (Zotero + Overleaf + 나 자신).

### 내 비전과의 연결

**AI NPC 직접 적용: 낮음.**
- Autoresearch는 LLM 사전학습 대상. NPC는 추론/상호작용 레이어.
- 하지만 **방법론은 이식 가능**.

**이식 가능한 것:**
1. **고정 예산 실험** — "페르소나 일관성" 평가를 5분 자동화 스크립트로 만들 수 있다면 같은 루프 적용 가능
2. **에이전트가 코드 수정하는 연구 루프** — 북켓몬 추천 파이프라인의 하이퍼파라미터(가중치 50/30/20 등)를 자동 튜닝하는 소형 autoresearch 변형 제작 가능
3. **`program.md` 패턴** — 에이전트 지침을 자연어 마크다운으로 관리 = 내가 만든 Sub brain과 같은 DNA

### "만류귀종" 관점

Karpathy는 연구 방법론에서도 **"단일 파일, 자연어 지침, 자동 루프"**를 밀고 있다.
values의 융합/단순함 선호와 정합. 이 저장소 자체가 "어떻게 일할 것인가"의 교본.

---

## 실행 조건

- **GPU 필요** — 지금 로컬 환경에 H100급이 없다면, 클라우드(Lambda, Vast.ai) 또는 작은 모델로 축소 버전 먼저
- **대안:** 코드만 읽기 — 핵심은 300줄 남짓. train.py 한 파일 정독이 가장 큰 학습

---

## 다음 학습 후보

- **nanochat** (Karpathy) — autoresearch의 기반 코드
- **Muon optimizer** — train.py에서 쓰는 비표준 옵티마이저
- **bits-per-byte** 메트릭 — 언어 모델 평가 지표
- **논문 글쓰기 워크플로우** (별도 주제): Overleaf + Zotero + 저자 경험 수집

---

## 적용 아이디어

### 단기: 코드 정독 + 방법론 흡수
- `train.py` 한 파일 정독
- `program.md` 포맷을 내 방식대로 써보기 (NPC 실험용 `program.md` 초안)

### 중기: 축소 autoresearch
- 북켓몬 추천 가중치 자동 튜닝 (작은 버전)
- 또는 현수봇 페르소나 프롬프트 A/B 자동 비교

### 장기: NPC 연구 논문
- "Persona consistency under memory compression" 같은 주제
- autoresearch 방법론 차용, NPC 도메인 메트릭 정의

---

## 연결된 페이지

- ai-npc-blueprint — 메타 적용 (방법론)
- bookemon — 자동 튜닝 적용 후보
- hyunsoo-bot — 페르소나 A/B 자동화 후보
- values — 단순함/융합 선호
- goals — 연구자 궤도
