---
created: 2026-06-21
updated: 2026-06-21
type: learning
tags: [ai, harness, knowledge-management, meta-system, fine-tuning, overfitting]
category: method
---

# 지식 하네스 레지스트리 — Knowledge Harness Registry

> **한 줄 정의**: 내가 배운 모든 것을 AI 하네스·튜닝·프롬프트에 선택적으로 연결하는 관리 체계.
> 특정 지식이 유리한 상황에만 활성화하고, 과적합·역효과 감지 시 제외 또는 스코프 축소.

---

## 0. 개념

```
[지식 원천] ──태깅──► [레지스트리] ──활성화 판단──► [하네스/튜닝/프롬프트]
  _craft/theory/              ↑                          ↑
  learnings/                과적합 감지             피드백 루프
  experiences/              역효과 관찰
  wiki/ 전체
```

**원칙**:
- 지식은 *상황 의존적*이다. 게임이론이 하네스에서 유리할 때가 있고 노이즈가 될 때가 있다.
- **등록 ≠ 항상 사용**. 등록은 "후보", 활성화는 "현재 투입".
- 과적합(같은 렌즈로 모든 문제를 보기 시작) 감지 시 즉시 스코프 축소.
- 커스터마이징 자유: 상황별로 조합, 일부만, 또는 전혀 안 쓰는 것도 가능.

---

## 1. 지식 파일 태깅 스키마

모든 지식 파일(이론·경험·학습)에 아래 프론트매터를 **선택적으로** 추가.
정보 없으면 생략 가능. 새로 추가하거나 갱신할 때 적용.

```yaml
ai_harness:
  status: active          # active | scoped | excluded | provisional
  contexts:               # 이 지식이 유효한 작업 맥락 (아래 §2 맥락 코드 참조)
    - harness-design
    - reward-design
  overfitting_risk: low   # low | medium | high
  scope_note: ""          # 스코프 제한 or 주의사항 (status: scoped 일 때 필수)
  last_reviewed: 2026-06-21
```

**status 의미**:
| status | 의미 | 하네스 투입 여부 |
|--------|------|----------------|
| `active` | 해당 맥락에서 기본 투입 | ✅ 자동 |
| `scoped` | 특정 조건에서만. scope_note 필수 | 🟡 조건부 |
| `excluded` | 역효과 확인됨. 재검토 전까지 제외 | ❌ 차단 |
| `provisional` | 실험 중. 적용 시 명시 플래그 | 🔬 실험적 |

---

## 2. 맥락 코드 (Contexts)

하네스에 투입되는 상황을 코드로 정의. 확장 가능.

| 코드 | 설명 |
|------|------|
| `harness-design` | 멀티에이전트 협력 프로토콜, 권한 분리, 위임 설계 |
| `reward-design` | RLHF 보상 함수, 피드백 신호 설계 |
| `alignment` | AI-인간 정렬 구조 이해, HITL 설계 |
| `data-curation` | 학습 데이터 선정·레이블링 기준 |
| `prompt-engineering` | 시스템 프롬프트, 하드컨트랙트, 지시 설계 |
| `character-design` | 소설·게임 인물 설계 |
| `plot-structure` | 서사 구조, 갈등 설계 |
| `social-dynamics` | 집단·관계 배경 설계 |
| `dialogue-design` | 인물 발화 패턴 |
| `world-building` | 세계관·사회 시스템 |
| `game-mechanics` | 게임 규칙·보상 시스템 |
| `trpg-scenario` | TRPG 세션 설계 |

*신규 맥락 추가: 이 표에 한 줄 추가 후 해당 지식 파일 ai_harness.contexts 갱신.*

---

## 3. 과적합 감지 기준

> **과적합(Overfitting)**: 특정 지식(렌즈)을 너무 자주 적용해서 맞지 않는 상황에도 끼워 맞추게 되는 상태.

**감지 신호 (하나라도 해당되면 review):**

| 신호 | 예시 |
|------|------|
| **동일 렌즈 반복** | 최근 5번의 서로 다른 작업에 같은 이론을 "핵심"으로 적용 | 
| **문제 왜곡** | 이론에 맞추려고 문제 자체를 다르게 정의하게 됨 |
| **예측 실패** | 이론이 예측한 것과 실제 결과가 반복적으로 다름 |
| **단순 해결책 차단** | 이론 없이 바로 해결될 것을 이론으로 복잡하게 만듦 |
| **맥락 무시** | "이 이론이 있으니까" 현재 맥락 신호를 무시 |

**과적합 시 조치:**
1. `status: active` → `status: scoped` (특정 맥락에서만)
2. `scope_note`에 "어떤 상황에서만 유효" 명시
3. 역효과 반복 확인 시 `status: excluded`
4. `last_reviewed` 갱신
5. 이 레지스트리 §4에 조치 기록

---

## 4. 활성 레지스트리 (현재 등록된 지식)

> 이 표가 **현재 하네스에 투입 가능한 지식의 단일 진실 소스(SSOT)**.
> 각 항목은 해당 파일의 `ai_harness` 프론트매터와 일치해야 함.

| 파일 | 도메인 | status | 주요 맥락 | 과적합 위험 | history_note |
|------|--------|--------|----------|-----------|-------------|
| game-theory | 경제학/게임이론 | active | harness-design · reward-design · alignment · character-design · social-dynamics | medium | 첫 기록 대기 |
| psychology | 심리학 | active | character-design · data-curation · reward-design | low | 첫 기록 대기 |
| game-design | 게임 디자인 | active | game-mechanics · trpg-scenario · plot-structure | low | 첫 기록 대기 |
| literary-theory | 서사이론 | active | plot-structure · character-design · dialogue-design · world-building | low | 첫 기록 대기 |
| 소설작법-1925 | 한국 소설 작법 | scoped | plot-structure · dialogue-design | low | 첫 기록 대기. 한국어 단편 한정. |
| [insane-search 해체 분석 — 포기를 모르는 웹 접근 아키텍처](insane-search.md) | 웹 접근 우회 | active | data-curation · prompt-engineering | low | 첫 기록 대기. 웹 차단 상황에만. |
| [PerfectPixel Studio — AI × 결정론적 후처리 스프라이트 파이프라인](../techniques/perfectpixel-sprite-pipeline.md) | 신호처리·스프라이트 파이프라인 | active | game-mechanics · world-building · harness-design | low | 픽셀아트 게임 프로젝트 전반 (hwigi-tower 포함, 향후 모든 픽셀 프로젝트). 비픽셀 이미지 작업엔 비투입. |

*새 지식 추가 시: 해당 파일에 `ai_harness:` 프론트매터 추가 → 이 표에 한 줄 등록.*

---

## 5. 활성화 프로토콜 (작업 시작 시)

> **원칙**: 전체 로드 금지. 맥락 코드로 좁혀서 해당 지식만 꺼냄.

```
작업 시작
   │
   ▼
[1] 작업 맥락 코드 결정 (§2 참조)
   예: "인물 설계" → character-design
   │
   ▼
[2] 레지스트리(§4) 에서 해당 맥락 + status: active/scoped 항목만 필터
   예: game-theory · psychology · literary-theory
   │
   ▼
[3] scoped 항목은 scope_note 확인 → 조건 충족 여부 판단
   │
   ▼
[4] 선택된 지식의 핵심 섹션만 로드 (파일 전체 읽기 X — RTK)
   예: game-theory §E(협력 이유) + psychology §C(성격 모델)
   │
   ▼
[5] 작업 중 과적합 신호 감지 시 → 해당 지식 즉시 제외, §4 status 갱신
```

---

## 6. 커스터마이징 (상황별 조합)

**자유 조합 원칙**: 레지스트리는 가능성의 목록. 실제 투입은 매 작업마다 선택.

```
전체 활성화: 레지스트리 §4의 active 전부
부분 활성화: 맥락 코드로 필터
단독 사용:   한 이론만 (예: 이 장면은 게임이론 렌즈만)
비활성화:    이론 없이 직관/경험만 ("이번엔 이론 없이")
실험 조합:   provisional 포함해서 테스트
```

**커마 예시**:

| 상황 | 투입 지식 | 제외 |
|------|---------|------|
| 망원동 단편 인물 설계 | game-theory(내집단·TFT) + psychology(성격·동기) | game-design (게임 맥락 아님) |
| 멀티에이전트 하네스 설계 | game-theory(죄수딜레마·공유지) | 소설작법-1925 (무관) |
| TRPG 세션 설계 | game-design(TRPG특화) + game-theory(보상·신호) | psychology (과잉 분석 리스크) |
| RLHF 보상 설계 | game-theory(공유지·TFT) + psychology(RLHF섹션) | literary-theory |
| 순수 직관 글쓰기 | 없음 | 전부 비활성 |

---

## 7. 신규 지식 등록 절차

새 이론·경험·학습이 생기면:

1. 해당 파일 프론트매터에 `ai_harness:` 블록 추가 (§1 스키마)
2. `status: provisional` 로 시작 (검증 전)
3. §4 레지스트리 표에 한 줄 추가
4. 실제 작업 1~3회 적용 후 효과 판단
5. 효과 있으면 `status: active`, 조건부면 `scoped`, 역효과면 `excluded`

---

## 8. 조치 이력 (과적합·제외 기록)

*변경 발생 시 append.*

| 날짜 | 지식 | 이전 status | 새 status | 사유 |
|------|------|-----------|----------|------|
| — | — | — | — | — |

---

---

## 9. 시뮬레이션 프로토콜

> **트리거**: 작업 시작 전, 아래 발화 감지 시 자동 발동.
> - "시뮬레이션 돌려줘" / "하네스 추천해줘" / "하네스 골라줘"
> - "이 작업에 뭐 쓸까" / "뭐 쓰면 좋을까" / "뭐가 나을까"
> - "어떤 식으로 할지 제안해봐" / "어떻게 접근할까" / "접근 방식 추천해줘"
> **출력**: 텍스트 예측(A) + 점수 매트릭스(B) 동시. Claude가 즉석 생성 + 이력([하네스 이력 — Harness History](harness-history.md)) 참조.

### 9-1. 점수 루브릭 (3축, 각 1~5점)

| 축 | 1점 | 3점 | 5점 |
|----|-----|-----|-----|
| **적합도(Fit)** | 맥락과 무관, 노이즈 | 부분적 관련 | 맥락 코드 완벽 매칭 |
| **품질 기여(Quality)** | 결과물에 영향 없음 | 일부 개선 | 결과물 수준을 결정적으로 끌어올림 |
| **속도(Speed)** | 로드·적용에 큰 오버헤드 | 보통 | 바로 꺼내 쓸 수 있음, 오버헤드 없음 |

**종합 점수**: `(Fit × 0.4) + (Quality × 0.4) + (Speed × 0.2)` — 적합도·품질 우선, 속도 보조.

**추천 판정**:
- 4.0 이상 → ✅ 투입
- 2.5~3.9 → 🟡 조건부 (scope_note 확인)
- 2.4 이하 → ❌ 비투입

### 9-2. 출력 포맷

```
## 시뮬레이션 — [작업명]
맥락 코드: [code1, code2]
참조 이력: [히스토리 패턴 있으면 인용, 없으면 "첫 기록"]

### 텍스트 예측
- [지식명]: [이 작업에 투입하면 무슨 일이 생기는지 1~2줄. 기대효과 + 주의사항.]
- [지식명]: ...

### 점수 매트릭스
| 지식 | 적합도 | 품질 기여 | 속도 | 종합 | 추천 |
|------|--------|---------|------|------|------|
| ...  | x/5    | x/5     | x/5  | x.x  | ✅/🟡/❌ |

### 추천 조합
[최종 투입 조합 1줄 + 이유. 조건부 항목은 어느 섹션만 쓸지 명시.]

### 이력 기록 여부
작업 완료 후 [하네스 이력 — Harness History](harness-history.md)에 실제 결과 append 권장.
```

### 9-3. 이력 반영 규칙 (자동 추천으로 진화)

1. 시뮬레이션 실행 시 → `[하네스 이력 — Harness History](harness-history.md)` 에서 동일·유사 맥락 코드 검색
2. 3회 이상 실적 있는 조합은 점수에 **이력 보정** 적용:
   - 실제 결과가 예측보다 좋았던 지식: +0.5 보정
   - 실제 결과가 예측보다 나빴던 지식: -0.5 보정
3. 10회 이상 동일 맥락 코드 이력 → "패턴 확립" 플래그. 이후엔 이력 기반 자동 추천 우선.
4. 패턴 확립 시 §4 레지스트리 해당 지식의 `history_note` 컬럼 갱신.

---

## 연결

index · agent-harness-rsi · index · hermes-loop · [하네스 이력 — Harness History](harness-history.md)
- [Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](kuku-second-brain.md) · [llm-wiki (fivetaku)](llm-wiki.md) — 지식 거버넌스·세컨드브레인 운영 패턴 자매(본 페이지=코드지식 레지스트리 / kuku=제품 거버넌스 확증 / llm-wiki=위키 스키마 원리)
