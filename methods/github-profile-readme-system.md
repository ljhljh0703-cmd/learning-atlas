---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [github-profile, readme, svg, portfolio, claim-evidence, done-gate, recruiting]
source: https://github.com/ljhljh0703-cmd/ljhljh0703-cmd
category: method
---
<!-- GitHub 프로필 README+애니 SVG 카드를 "기술 검증 표면"으로 짓는 재사용 시스템 (작가 프로필 역기획) -->

# GitHub Profile README 구축 시스템

작가 본인 프로필(`ljhljh0703-cmd`)을 Codex가 역기획해 자산화한 것. ③Gate PASS 2026-07-06 (SHA·라인·렌더·claim정직 실측 일치). 원본 자산 588줄 → 재사용 코어만 증류.

## 0. 핵심 원리 — "예쁜 README"가 아니다

프로필은 홈페이지가 아니라 **기술 평가자가 30초 안에 판단하는 압축형 포트폴리오 표면**. 4겹 구조:

1. **포지셔닝** — PM 성과 + AI 전환을 첫 화면에 한 문장·수치로 고정
2. **증거** — 프로젝트마다 실측 수치·stage 라벨·claim boundary를 카드 안에
3. **시각** — 각 프로젝트의 *실제 메커니즘*을 SVG+CSS 모션으로 압축(장식 X)
4. **검증** — 참조·파싱·외부리소스·누출·raw 200·렌더·픽셀변화 전수 게이트

100% 재현 = `README.md + assets/*.svg` 재구성. 100% 초과 = *다음 작업자가 새 프로젝트를 같은 품질·검증으로 확장* 가능.

## 1. README 아키텍처

읽기 순서: `배너 → 한 문단 포지셔닝 → 대표 프로젝트 그리드(5개) → 함께 보기 → 수치 읽는 법 → 모션 노트`.

- **배너** = 이름/영문/타깃롤 + 한 줄 thesis + 정직선("측정하지 않은 것은 측정 전이라고 씁니다") + 히어로 수치 4개(비즈니스 성과·KPI·기술측정·도메인 브릿지). *5개 이상 금지*.
- **인트로 문단** = `[이전 권위]로 [기간] 동안 [성과]를 책임 → 지금은 그 판단을 코드로 → [기술 표면]까지 직접 만들고 측정`. 짧게(배너가 증거를 이미 지님).
- **프로젝트 그리드** = GitHub-safe HTML `<table>` + `<picture>`(light/dark SVG 쌍). 마크다운 그리드는 이미지 카드 제어 약함.

## 2. 프로젝트 카드 8슬롯 스키마 (불변)

카드마다 정확히 8개 텍스트 노드:

```yaml
project_card:
  title: ""
  subtitle: ""
  primary_metric: ""       # 실측 수치
  metric_context: ""       # 어떻게 쟀나
  decision_or_mechanism: ""
  proof_capability: ""     # 어떤 엔지니어링 역량을 증명
  stage_label: ""          # demo·prototype·dry-run·exploratory
  cta: "포트폴리오 →"
```

**카드 룰**: 클릭 없이 3질문에 답할 것 — ①이게 뭔가 ②무엇이 측정/한정됐나 ③어떤 역량을 증명하나. *수치·boundary·역량 없는 카드 = 시각 북마크(증거 아님)*.

## 3. SVG 모션 문법 — 메커니즘 우선

전 SVG가 같은 keyframe 어휘 공유, 카드는 필요한 클래스만 활성. 자산: banner 920×210(텍스트 16·keyframe 20), card 440×176(텍스트 8·keyframe 20). 전부 self-contained(외부 폰트·이미지·스크립트 0).

| keyframe 계열 | 용도 |
|---|---|
| `sigPulse` | 강조 펄스, 노드/신호 |
| `sigSwapDn/Up/BadOut` | 랭킹 rerank·후보 필터 |
| `sigFlow` | 신호/오디오/데이터 흐름 |
| `sigDrawC*/A*/Chk/X` | 단계 평가·게이트 드로잉 |
| `sigSeg/Ring/Sus` | 소셜그래프·의심 전파 |
| `sigDot/Hitl/GateHold/KFlick` | 에이전트 결정 경로·HITL 게이트 |

**철칙: 모션은 프로젝트의 실제 메커니즘을 인코딩. 장식 모션은 기각.** (예: 북켓몬=랭킹 rerank, medical-rag=triage 게이트·red-flag 차단, 현수봇=결정 펄스→리스크/HITL 게이트.)

접근성: 모든 SVG에 `@media (prefers-reduced-motion:reduce){*{animation:none!important}}`. 모든 `<img alt>`는 시각 카드와 같은 증거 요약 문자열(GitHub는 빠르게 스캔·이미지 로드 실패 대비).

## 4. Claim/Evidence 정책

[포트폴리오 포지셔닝 피드백 (멋사 멘토)](../narrative/portfolio-positioning-feedback.md) 반-과장 원칙의 프로필판.

| Claim 유형 | 허용 표기 |
|---|---|
| 실측 지표 | `[metric] [실측]` |
| 데모(비프로덕션) | `데모`·`작동 프로토타입` |
| 오프라인 평가 | `오프라인 평가 완료` |
| dry-run | `dry-run`·`모의` |
| claim gate 실패 | `탐색 연구`·`claim gate 미통과`·`탐색적 경향` |

**금지**: 프로덕션 신뢰성(미검증 시)·의료 안전성 과장·dry-run→수익성·N=20→과학적 타당성·"완전 자동 AI"(HITL 있으면)·소스 없는 정확 수치.

강한 카피 = `[metric] + [측정 방법] + [의미] + [boundary]`. ("AI 도서 추천 서비스 개발"보다 "정확도 84.44→97.78% [실측] · 룰 ablation·18쿼리 오프라인"이 강함 — 설계 선택+검증법 노출.)

## 5. Done-Gate (커밋 전, 프로필 repo 루트에서)

- **G1 참조 무결성** — README의 `assets/*.svg` 참조 집합 == `assets/` 실제 파일 집합
- **G2 XML 유효성** — `xml.dom.minidom.parse` 전 SVG
- **G3 외부 리소스 스캔** — `rg 'url\(' assets/*.svg` + `rg 'https?://'`(xmlns 제외) → 출력 0 기대
- **G4 로컬경로/이메일 누출** — `grep -rn 'Users/author\|@gmail' assets/` → 출력 0
- **G5 스코프 체크** — `git status/diff` → 의도한 README/assets 변경만(README frozen이면 미등장)
- **G6 live raw 검증** — `raw.githubusercontent.com/.../main/$p` 전 SVG → 전부 `200`
- **G7 렌더+애니** — headless Chrome: 전 이미지 `complete:true`·`naturalWidth/Height>0`, t1/t2 스크린샷 RGB diff ≠ 0(배너/카드 내부)

## 6. 확장 프로토콜 (새 카드 추가 시)

1. live URL(또는 명시된 non-live 상태) 없으면 카드 추가 금지
2. 8슬롯 먼저 채움 → 3. 메커니즘 맞는 모션 모티프 1개 → 4. light/dark 쌍 → 5. 그리드 추가 → 6. Done-Gate 전건 재실행 → 7. 대표 5개 초과 시 하나를 "전체 저장소 보기"로 이동.

## 7. 실패 모드

| 실패 | 증상 | 수정 |
|---|---|---|
| 깨진 이미지 | README 참조하나 파일 없음 | G6 raw 루프 |
| 장식 모션 | 예쁘나 프로젝트 무의미 | 그리기 전 모션↔메커니즘 매핑 |
| claim 인플레 | "production"·"safe" 무증거 | stage 라벨·boundary |
| 다크모드 깨짐 | light 자산만 존재 | `<picture>` dark source·양쪽 검증 |
| 외부 참조 차단 | SVG가 원격 폰트/이미지 참조 | CSS 임베드·벡터 직접 |
| 커밋 메타 누출 | git 로컬 이메일 자동 | GitHub noreply 아이덴티티 선설정 |
| 자산 드리프트 | README↔assets 불일치 | G1 참조 무결성 |

## 스킬화 (완료 — 2026-07-06)

github-profile-asset-builder 스킬로 구축(작가 명시 지시). 본 노드 = 정본 방법론 지식, 스킬 = 실행판(검증된 배너·카드 SVG 템플릿 + `done-gates.sh` G1~G7 내장). 실제 자산 = Fable 제작·Codex 검증(RETURN `pass_with_risk`, commit `db0bbec`).

## 학습→반영

- 반영처 = 작가 GitHub 프로필(이미 이 시스템으로 구축됨) + 취업 포지셔닝([포트폴리오 포지셔닝 피드백 (멋사 멘토)](../narrative/portfolio-positioning-feedback.md)). claim/evidence 정책은 bespoke-html-direction HTML 카피에도 전이 가능.
- 원본 자산(588줄, SHA `8f143f4c…29`) = `~/Documents/Codex/2026-07-06/new-chat/outputs/` (외부·stale 예정 — 본 노드가 vault 정본).
