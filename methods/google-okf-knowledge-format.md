---
created: 2026-06-27
updated: 2026-06-27
type: learning
tags: [okf, knowledge-format, agent, markdown, frontmatter, interop, interoperability, standard, google-cloud]
source:
  - https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf
  - https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing
  - https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/
authors: [Sam McVeety, Amir Hormati]
year: 2026
category: method
---
<!-- 구글 OKF(Open Knowledge Format) v0.1 표준 해체 + Sub-brain 대조 + 상호운용성·표준 역학 학습 노트. -->

# Google Open Knowledge Format (OKF) v0.1 — 에이전트 지식 표준

> **출처·자기검증 정직**: 1차 출처(SPEC.md/블로그/해설) 3종 통독. (1) **2026-06-12 발표**(컷오프 이후) → 첫 점검 시 vault Claude가 "환각 의심" 1차 오판 → 웹 재검증으로 정정([검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md)가 *나에게도* 적용). (2) 초판에서 "vault가 OKF보다 *앞섰다*"고 썼다가 작가 푸시백으로 정정 — *범주 오류였음*(아래 §4). cold-verify-before-adopt를 *내 자체 주장*에 안 적용한 사례.

## 한 줄 요약
> OKF = AI 에이전트 지식을 **마크다운 + YAML frontmatter + 마크다운 링크 그래프** 번들로 표준화한 vendor-neutral *상호운용 포맷*. Sub-brain vault와 **수렴 진화**(독립적으로 같은 구조 도달) — 즉 vault 방향이 Google에게 외부 검증받은 셈이며, vault가 OKF에서 *배울 핵심 = 상호운용성*.

## 1. 정의
- Google Cloud(Sam McVeety·Amir Hormati) 2026-06-12 공개. Apache-2.0. repo `GoogleCloudPlatform/knowledge-catalog/okf`(SPEC.md 정본).
- **"format, not platform"** — SDK·런타임·쿼리언어·벤더계정 0. *번들 = 디렉토리*(tarball·git·filesystem). 인간 작성본을 에이전트가 그대로 읽음.

## 2. 스펙 핵심
- **개념 = 마크다운 파일 1개**, *파일 경로 = concept identity*. 디렉토리 = taxonomy.
- **frontmatter**: `type`(유일 필수) + 예약 queryable 6종 `type`·`title`·`description`·`resource`·`tags`·`timestamp`. 그 외 producer 자유.
- **예약 파일명**: `index.md`(progressive disclosure) · `log.md`(변경 이력).
- **링크 = 표준 마크다운 링크** `[label](/tables/customers.md)` → 관계 그래프.
- **원칙**: minimally-opinionated(type만 강제) · producer/consumer 독립(포맷=계약) · 후방호환 성장.

## 3. Sub-brain ↔ OKF 대조 (수렴 진화)
| 축 | OKF v0.1 | Sub-brain | 관계 |
|---|---|---|---|
| 개념=파일 | path=identity | kebab-case .md | 정합 |
| `index.md` | progressive disclosure | `wiki/index.md` | **동일** |
| `log.md` | 변경 이력 | `wiki/log.md` | **동일** |
| `type` 필수 | ✔ | frontmatter `type:` | 정합 |
| 예약필드 | type/title/description/resource/tags/timestamp | type/created/updated/tags/source | 부분 정합(resource↔source·timestamp↔created/updated) |
| 링크 그래프 | 표준 md링크 `[x](path)` | Obsidian `wikilink` | **차이**(interop 변환 필요) |

→ vault는 OKF를 *모르고* 독립 도달 = **수렴 진화**. 핵심 함의: "내가 만든 방식이 틀리지 않았다"는 *외부 ground-truth*(같은 가치 = goose-harness-groundtruth·[The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) 계열).

## 4. 상호운용성 & 표준 역학 (확장 개념 — cold-verify로 도출)
"vault가 OKF보다 앞섰다"가 **왜 틀린 프레임인가**, 그리고 *진짜* 배울 것:

- **범주 차이 = 표준 vs 1인 운영**. OKF = *상호운용 표준*(서로 다른 producer/consumer가 번역 없이 교환하는 최소 공통 규약). `type`만 필수인 건 *약점이 아니라 채택 최적화*(표준은 적게 강제할수록 채택률↑). vault = 작가 1인 운영 시스템(규약 풍부 = 1인 최적화). **trade-off지 우열 아님.**
- **표준의 가치 = 합의·네트워크 효과**, 기능 수 X. Google이 밀고 다수가 채택하면 OKF가 이김. 기능 많다고 표준이 되는 게 아니다.
- **상호운용성(Interoperability) = OKF 코어 가치이자 vault의 결핍**. vault는 *작가만* 읽는 폐쇄계. OKF는 *어떤 에이전트든* 읽음(producer/consumer 독립). vault가 OKF에서 배울 1순위 = "내 지식을 *다른 에이전트도* 읽게 만드는 것".
- **수렴 진화의 효용** = 검증. vault 방향이 외부 표준과 일치 → 자신감 + 면접 서사. 단 *서사는 "앞섰다" 금지* → "수렴 + 거버넌스 실무 경험"으로(과장은 역효과).

## 5. OKF가 표준화 안 한 영역 — vault의 *사적* 운영 규약 (≠ 표준 해결)
OKF v0.1이 open design space로 둔 3종에 대해 vault엔 *자체* 규약이 있음. **단 이는 "표준 수준 해결"이 아니라 *vault 안에서만 유효한 사적 규약*** — 여러 producer 합의가 필요한 표준화는 별개 난제:
- contradiction → `⚠️ Contradiction: A는 X, B는 Y. 미해결.`
- trust tiers → `status`(provisional/confirmed/superseded)·origin(`proposed_by`/`confirmed_by`)·`provenance`·`review_trigger`.
- typed relationships → 커스텀 관계 키(`related_to`·`belongs_to`).

→ 가치 = OKF 향후 버전이 이 영역 표준화 시 *참고 가능한 실무 사례*를 vault가 이미 굴려봤다는 것(입력 후보). 우월성 주장 X.

## 6. 학습→반영 (학습→반영 루프)
1. **반영처 1 — Learning Atlas(대외 위성·vault외, hot.md Track 3) OKF-export 모드**(상호운용성 흡수의 실천): Atlas가 이미 vault→public markdown 변환 운영. **OKF 정합 export** 추가(wikilink→상대 md링크 변환[격리 `enterprise-ontology`의 `wikilink-to-okf.py` 발상 유효] + 예약필드 매핑 source→resource·created→timestamp) → 작가 지식이 *OKF 호환 번들*로 = 다른 에이전트도 읽는 상호운용 자산. backlog(felt-need 실측, infra-0 가드).
2. **반영처 2 — 면접/포폴 서사**: "markdown+frontmatter+graph 지식 시스템을 Google 표준과 *독립 수렴* + 거버넌스(모순·신뢰·provenance) 실무 운영." ("앞섰다" X.)
3. **과적용 가드(Karpathy #2/#3)**: vault를 OKF로 *리팩토링 금지* — wikilink=Obsidian 코어. OKF는 *export 타깃*이지 구조 교체 X. type만 강제하는 OKF로 vault frontmatter 다운그레이드 금지.

## 연결된 페이지
- Learning Atlas(대외 위성·vault외, hot.md Track 3) — vault→public export(OKF 정합 모드 후보 = 상호운용성 실천)
- cold-verify-before-adopt · [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) — 본 노트 2회 자기정정 메타교훈
- goose-harness-groundtruth · [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) — 외부 ground-truth 수렴 계열
- CLAUDE.md — vault frontmatter·index·log·contradiction 규약(OKF 대응물)
