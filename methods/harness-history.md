---
created: 2026-06-21
updated: 2026-06-21
type: system
tags: [harness, simulation, history, auto-recommend]
---

# 하네스 이력 — Harness History

> **역할**: 시뮬레이션 예측 vs 실제 결과 누적. 패턴이 쌓이면 자동 추천 근거가 됨.
> **쓰기 규칙**: append-only. 기존 항목 수정 금지. 최신 항목이 위.
> **작성 시점**: 작업 완료 후 (또는 세션 종료 전).

---

## 패턴 현황

| 맥락 코드 | 누적 횟수 | 패턴 확립 | 최고 조합 |
|---------|---------|---------|---------|
| — | — | — | — |

*10회 이상 → 패턴 확립. [지식 하네스 레지스트리 — Knowledge Harness Registry](knowledge-harness-registry.md) §9-3 에 따라 자동 추천 전환.*

---

## 이력 항목 스키마

```yaml
- id: SIM-NNN
  date: YYYY-MM-DD
  task: "작업명"
  context_codes: [code1, code2]
  predicted:              # 시뮬레이션 예측 점수
    [지식명]:
      fit: x
      quality: x
      speed: x
      total: x.x
      recommend: active|scoped|excluded
  actual:                 # 작업 후 실제 체감
    [지식명]:
      fit: x
      quality: x
      speed: x
      used: full|partial|none   # 실제로 얼마나 썼나
  user_rating: x          # 1~5, 전체 작업 만족도
  delta_note: ""          # 예측과 달랐던 점. 없으면 생략.
  adjustment: ""          # 이 결과로 status/scope 변경 사항. 없으면 생략.
```

---

## 이력

*첫 기록 대기.*

---

## 패턴 추출 기준

Claude가 이 파일 스캔 시:
- 동일 맥락 코드에서 `actual.used: full` + `user_rating: 4+` 이 3회 이상인 지식 → "강한 긍정 패턴"
- 동일 맥락 코드에서 `actual.used: none` + `user_rating: 3-` 이 2회 이상인 지식 → "노이즈 패턴" → `status: scoped` 검토
- `delta_note`에 같은 지식명이 반복 등장 → 예측 루브릭 보정 필요

패턴 추출 트리거: "패턴 뽑아줘" / "히스토리 분석해줘" / 10회 누적 감지 시.
