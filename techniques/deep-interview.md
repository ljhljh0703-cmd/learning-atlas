---
created: 2026-06-14
updated: 2026-06-14
type: learning
tags: [deep-interview, socratic-questioning, knowledge-acquisition, staging-first]
category: technique
---

# deep-interview 해체분석 및 Sub-brain 이식 전략

> ✅ **확정(confirmed) 2026-06-14** — 세션 내 ③Gate 통과 + 작가 수용. (외부 미검증 세부는 본문 표기 유지.)

> **한줄**: 사용자의 암묵지를 소크라테스식 질문(Socratic questioning)과 즉시적 마크다운 쓰기 루프를 통해 외부화하는 에이전트-네이티브 지식 추출 절차.
> **서브 브레인 핵심 질문**: 검증 부재 및 파일 트리 오염 리스크를 안고 있는 기계적 인터뷰를 어떻게 staging-first 및 충돌 제어 게이트(Gate)가 배선된 안전한 획득 루프로 격상할 것인가?

---

## 1. deep-interview 핵심 설계 및 루프

### 1) 작동 실체
*   독립 CLI 또는 런타임 코드가 아닌, Claude가 읽고 수행하는 절차형 프롬프트 스킬 (`SKILL.md` 기반).
*   **핵심 루프**: `ASK ➔ LISTEN ➔ WRITE ➔ DEEPEN ➔ REPEAT`
    *   질문을 수집한 뒤 파일에 모아서 쓰는 방식 대신, **매 답변 수신 직후 즉시 파일에 쓰도록 통제**하여 정보 누락과 에이전트의 상태 유실을 방지합니다.

### 2) 세션 초기화 및 depth 표
*   출력 경로: `--output <path>` 지정 시 해당 경로, 프로젝트 내 `CLAUDE.md` 감지 시 루트, 없을 시 기본값인 `~/Documents/interviews/<topic>-<date>/`에 인덱스(`_interview-index.md`)를 생성하여 세션 추적.
*   **depth 분기**: 코드 분기 없이 스킬 내부의 운영 표(Table)로 질문 한계를 정의합니다.
    *   **shallow**: 2~3문항/theme, 3~5라운드 (지식 신속 캡처)
    *   **medium**: 4~6문항/theme, 6~10라운드 (기본 지식 베이스 생성)
    *   **deep**: 8~12문항/theme, 12~20라운드 (전문가 수준 지식 구조화)

---

## 2. 심층 탐구 (Deep Inquiry)

### 1) 멘탈 모델 (Mental Model)
*   **지식의 점진적 구조화**: 대화 히스토리를 평면적으로 누적하는 일반 인터뷰와 달리, 매 라운드마다 지식 그래프의 노드 후보를 마크다운 파일로 파편화하여 고정(Caching)하는 모델입니다. 질문은 정보 수집이 아닌 **지식 구조의 발견 도구**로 정의됩니다.

### 2) 논리적 맹점 (Logical Blindspots)
*   **사용자 입력 검증 부재**: 사용자의 기억 오류, 과장, 모순된 주장을 필터링 없이 그대로 정본으로 기록하여 "허위 정보의 정본화"가 발생할 수 있습니다.
*   **주제 분산 및 폭발 (Topic Explosion)**: 초기 주제가 넓을 경우 테마 분기가 무제한으로 확장되어 정리 불가능한 파일 트리를 초래합니다.
*   **경계 조건 모호성**: 인터뷰 종료 시점의 exit gate 기준이 사용자의 주관적인 완료 신호(`done`) 또는 모호한 "모든 테마 다룸"으로 설정되어 있어 루프가 늘어질 수 있습니다.

### 3) 기회비용 및 임계점 (Opportunity Costs & Thresholds)
*   인터뷰 depth가 깊어질수록 지식 밀도는 올라가나, API RTT(지연 시간) 및 토큰 요금의 누적 패널티, 그리고 사용자의 인지 피로도가 기하급수적으로 증가합니다.
*   *추천 바운더리*: 단순 메모는 `shallow`, 일반 기획은 `medium`, Sub-brain 편입 후보군일 때만 게이트 검증을 수반한 `deep` 모드로 제한해야 실효를 거둡니다.

---

## 3. Sub-brain 응용 및 강화 전략 (Enhancement)

원버전의 직접 파일 쓰기 및 무검증 방식을 개선하여 **staging-first 결합 아키텍처**로 격상합니다.

### 1) Staging-First 격리 배선
*   정본 SSOT 노드에 인터뷰 내용을 직접 편집하지 않으며, 무조건 `wiki/inbox/interviews/<topic>-<date>/` 하위에 임시 생성하여 격리합니다.
*   최종 finalize 및 병합 승인 전까지는 정본 파일 시스템과의 drift를 0으로 통제합니다.

### 2) 수동 병합 게이트(Gate) 및 충돌 제어
인터뷰 완료 시 다음 항목을 통제하는 게이트를 의무적으로 통과시킵니다.
1.  기존 `CLAUDE.md` 및 `GEMINI.md`와의 헌법적 충돌 여부.
2.  `wiki/projects/decisions.md`에 잠금된 locked 의사결정과의 충돌 여부.
3.  기존 위키 노드와의 중복성 검토 및 양방향 링크 제안(`_proposed-links.md` 생성).

### 3) 검증 수준 메타데이터 부여 및 주장 분리
무검증 입력을 보완하기 위해, 생성된 마크다운 상단에 아래의 구조화된 메타데이터와 주장 단위 기록 파일(`_claims.md`)을 강제 빌드합니다.
```yaml
origin: user_interview
verified: false
confidence: provisional
merge_status: staged
```
*   사용자의 미검증 주장은 `_claims.md`로 격리 추출하여, 에이전트가 이를 사실로 착각해 오작동하는 것을 원천 방지합니다.