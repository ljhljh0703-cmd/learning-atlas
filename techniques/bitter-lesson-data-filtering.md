---
created: 2026-07-04
updated: 2026-07-04
type: learning
tags: [pretraining, data-filtering, scaling-laws, paper]
source: https://arxiv.org/abs/2605.19407
authors: [Mohri, Duchi, Hashimoto]
year: 2026
doi: arXiv:2605.19407
category: technique
---
<!-- 데이터 필터링의 이득은 compute·capacity·pool-size 의존적 — 스탠퍼드 scaling study 흡수 노트 (순수 참조) -->

# A Bitter Lesson for Data Filtering — 필터가 아니라 원본 풀의 정보량이 이기는 구간

*Christopher Mohri, John Duchi, Tatsunori Hashimoto (Stanford). arXiv 2605.19407, v1 preprint.*

> 흡수 경로: research-relay(Codex direct-depth) → ③Gate → learnings/techniques archive.
> **이 노트는 "순수 참조(pure reference)"다.** 아래 §반영 판정 참조 — 작가는 사전학습을 하지 않으므로 반영처가 약하다. 억지 apply-diff 를 만들지 않는다.

## 0. 한 줄 정의

대규모 사전학습에서 compute·모델 용량·원본 풀 크기가 충분하면, 강한 품질 필터로 줄인 데이터보다 필터링하지 않은 Common Crawl 풀을 오래 학습하는 쪽이 더 낮은 validation loss 에 도달할 수 있다는 **scaling study**. Sutton 의 "Bitter Lesson"(2019) 은 프레이밍으로 인용될 뿐, 에세이의 재진술이 아니라 실측 실험 논문이다.

## 1. 핵심 주장 3가지

### (1) 필터링의 이득은 compute·capacity·pool-size 의존적 — 교차점이 존재한다

- 작은 모델·낮은 compute 에서는 필터된 데이터가 유리하다.
- **≥330M params + 충분한 optimization steps** 를 주면, 필터링하지 않은 CC 풀이 모든 비교 필터를 앞서는 **crossing point** 가 나타난다.
- pool size 를 키우면 no-filter 승리에 필요한 compute threshold 도 커진다(670M pool ≈ 1 epoch, 2B pool ≈ 3 epochs, 10B pool ≈ 10 epochs 수준으로 언급 — **모두 source-reported (미검증)**).
- 240T-token DCLM-Pool 전체 규모에서 unfiltered CC 가 RefinedWeb 을 이기는 compute threshold ≈ **1e30 FLOPs** 로 예측.
  - ⚠️ **이 1e30 FLOPs 는 직접 학습이 아니라 EXTRAPOLATION 이다.** 또한 이 주장을 뒷받침하는 인용 URL 2건(xAI grok-4 model card, Epoch AI 2030 forecast)이 캡처 시점에 **404** 였다 — "현재 frontier compute" 대비 문장은 1차 출처 재확인 미완. 수치를 확정 사실로 읽지 말 것.

### (2) 큰 모델은 junk 에 robust — "나쁜 데이터" ≠ 균일하게 나쁘다

- 670M CC 풀에 두 종류 저품질 데이터를 주입: random strings(3~8자 무작위 소문자 단어)와 shuffled documents(단어 순서를 섞은 CC 문서).
- 15M 모델은 junk 주입으로 손실 격차가 남지만, 330M/1B 로 갈수록 격차가 닫힌다.
- **shuffled-word 문서는 단어 순서가 깨져도 unigram/co-occurrence 통계 신호가 남아** 있어, 충분히 큰 모델은 이를 흡수한다. 작은 모델은 이 신호를 분리 흡수하지 못해 interference 를 겪는다.
- 함의: aggressive 필터는 이 **recoverable 한 long-tail signal 을 함께 삭제**할 위험이 있다. 필터 품질은 "나쁜 문서 제거율"이 아니라 "테스트 입력 주변의 유용한 신호를 얼마나 덜 지우는가"로 봐야 한다.

### (3) 정직한 경계 — 필터링 무용론이 아니다

- **small/local model 은 여전히 필터링·dedup·high-quality corpus 가 필요하다.** compute 가 bottleneck 이면 필터링은 중요하다.
- main metric 은 **validation NLL 단독**(C4, FineWeb-Edu, Cosmopedia). user-facing instruction following, factuality, safety, contamination, legal risk 는 **직접 보장하지 않는다.**
- 잘못된 사실처럼 target conditional distribution 을 오염시키는 데이터는 여전히 harmful 할 수 있다. "no filter" 는 독성·개인정보·저작권·명백한 허위정보 필터를 버리자는 뜻이 아니다(논문은 post-training/safety stage 미포함).

## 2. 실험 설정 (source-reported, 미검증)

- 원천: DCLM-Pool 의 pre-2023 Common Crawl, 전체 240T GPT-NeoX tokens. 실험 subset ≈ 670M~10B tokens random sample.
- 모델: Llama-style dense transformer, 15M~7B params. 학습 코드 Meta Lingua 기반.
- 필터별 잔존율: English 28.2% / Repetition 45.3% / Stop-word 50.4% / RefinedWeb 재현 13% / DCLM-Baseline 2.1%.
- 1B 모델 unfiltered pool 평균 NLL 3.37 도달, model scaling plateau 아직 불명확.
- 코드 repo 는 public 이나 full one-command reproduction 아님(외부 DCLM/cluster/preprocessed files 의존). 재현성 PASS 로 주장하지 않는다.

## 3. 반영 판정 (게이트 exit 3-way) — ③ 순수 참조 정직 선언

작가는 **자체 사전학습을 하지 않는다.** 따라서 이 학습의 apply-target 은 약하다 — 빌더·SSOT·게임·워크플로우 중 직접 반영할 시스템이 없다. 억지 apply-diff 를 만들지 않고 **"반영처 없음(순수 지식)"** 을 정직하게 선언한다(Karpathy #2/#3, [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) 과적용 가드).

다만 개념 수확 1건은 vault 큐레이션 철학과 대조된다: 이 논문의 "compute-rich pretraining 에서는 aggressive 필터가 long-tail 을 지운다"는 결론을 **vault 에 곧장 no-filter 로 적용하면 안 된다.** vault 는 사람이 읽는 SSOT 이지 compute-rich pretraining corpus 가 아니므로 여전히 Gate 와 큐레이션이 우선이다. 이 대조 자체가 유일한 반영 = "vault 필터링 규율은 이 논문의 예외가 아님을 재확인"(메타 참조).

## 4. 연결

- [Parcae — Stable Looped Language Models](parcae-looped-lm.md) — FineWeb-Edu 기반 pretraining 노트(본 논문의 validation set 중 하나가 FineWeb-Edu). aggressive vs loose 필터링 corpus 설계 대조.
- vault 큐레이션 철학 — quality filter 가 proxy 를 optimize 하다 signal 을 잃는 Goodhart 구조와 연결. 단 vault 는 no-filter 미적용(§3).

## 5. 다음 학습 후보

DCLM(DataComp-LM, 본 논문이 의존하는 풀·필터 원천) · RefinedWeb/FineWeb/FineWeb-Edu 필터 설계 비교 · scaling laws with repeated data(epoching 배경) · data selection survey(반대편 taxonomy).
