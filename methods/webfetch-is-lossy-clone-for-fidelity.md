---
created: 2026-06-16
updated: 2026-06-18
type: learning
tags: [method, webfetch, clone, fidelity, learning-intake, operating-principle]
category: method
---

# WebFetch 는 lossy 요약 — 충실 학습은 clone 통독

*작가 운영 원칙 (메모리 → 그래프 승격 2026-06-18). 학습 흡수 시 상시 적용.*

WebFetch 는 페이지를 *작은 빠른 모델이 요약*해서 반환한다 — verbatim 이 아니라 압축본. GitHub repo 의 큰 파일(예 22~70KB 스킬 JSON)을 WebFetch 로 보면 핵심(철학·엔지니어링·수치)이 통째로 누락될 수 있다. 작가가 "임의 축소했냐"고 지적한 실사고(2026-06-16, hyperagent-public-skills).

---

## Why

단순 요약을 "학습 흡수"로 오인하면 vault 에 부실·왜곡 지식이 박힌다(작가 신뢰 손상 + 후행 결정 오염).

## How to apply

- 전문 충실이 필요한 학습(논문·repo·스킬 흡수)은 **`git clone`(/tmp 등 vault 밖) 후 실제 파일 Read** 또는 research-relay 충실(depth) 모드.
- WebFetch 는 *빠른 사실 확인·존재 검증·소량 스팟체크*에만. 다건/대용량 흡수엔 부적합.
- 토큰 절약 시: clone 후 `jq`/python 으로 핵심 필드만 추출(중복·스크립트 제외)해 Read.
- 학습 결과 보고 시 "요약본"인지 "전문 통독"인지 출처 정직 표기.

---

## 연결된 페이지

- [리서치는 전문 통독 — 인접한 것까지 뽑아 박제](research-thoroughly-extract-adjacent.md) (전문 통독 원칙 — 본 원칙의 짝) · paper-study (clone 통독 워크플로우) · research-relay (충실 외주 모드)
