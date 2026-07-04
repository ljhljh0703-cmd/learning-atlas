---
created: 2026-07-04
updated: 2026-07-04
type: learning
tags: [toss, engineering-culture, design, technical-writing, ux-writing, job-hunting]
source: https://toss.tech
year: 2026
category: method
---
<!-- Toss Tech 블로그 전 직무(디자인/PM/TW/ML/서버/데이터 등) 문화를 한 장으로 압축한 지도 — 개별 딥다이브 아님 -->
# Toss Tech Culture Map — 전 직무 공통 운영 원리 지도

> 이 노트는 2026-07-04 Codex 가 해체한 Toss Tech 블로그 9개 카테고리 intake 를 **하나로 합친 지도**다.
> 9개 패킷은 ~70% 중복이라 개별 노트 대신 이 map 하나로 승격했다. 딥다이브가 아니라 **heading-level 지도** — 개별 기법은 필요할 때 원문/PARK 백로그에서 판다.
> 관련 정본: [토스 앱인토스 — 플랫폼 개요](toss-overview.md) · [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md). 원고 적용: juhyeong-voice. 다중에이전트 적용: agent-harness.

## 1. 한 줄 결론 (전 직무 공통 문법)

Toss 블로그의 모든 직무 글은 같은 재프레이밍을 반복한다 — **"장인정신·산출물"에서 "문제 정의 → 가장 작은 검증 → 시스템화 → 팀 전체 전파"로**. 디자인·PM·TW·ML·서버·데이터·FE·클라이언트가 각자 언어만 다를 뿐, 뼈대는 동일하다. 즉 이 지도의 재사용 가치는 "토스가 뭘 쓰는가"가 아니라 "어떤 문제를 어떤 순서로 다루는가"다.

## 2. 직무 지도 (high-signal 4 + reference-only 5)

**high-signal (원리 델타가 큰 4개축):**

| 축 | 한 줄 재정의 |
|---|---|
| **Design** | 화면 장식이 아니라 문제정의(Product Design)·확장가능한 정체성 시스템(Visual)·사용자를 만나는 조직운영(UX Research)·팀 언어 시스템(UX Writing)의 묶음. AI 는 디자이너를 대체하는 게 아니라 "시안"을 "작동하는 시스템"으로 바꾸는 번역 도구. |
| **Product (언더커버 사일로)** | 성공담이 아니라 *실패·제약을 포함한 문제풀이를 독자가 다시 풀게 하는* 러닝쉐어 포맷. 지표와 사용자 심리를 항상 함께 본다. |
| **TPM · TW** | 문서 = AI 가 읽는 조직맥락 SSOT interface(사람이 찾아 읽는 저장소가 아님). 문서화 실패 = 의지 문제가 아니라 기준·owner·최신성 부재의 구조 문제. TPM = 일정 공유자가 아니라 팀 사이 *회색지대를 문제로 재정의하는 해결자*. |
| **ML** | 4축 교차 카테고리 — ①Product-ML(광고/추천/신원확인) ②MLOps/플랫폼(Feature Store·Trainkit·서빙·GPU MIG) ③AI-tooling(Software 3.0 하네스·MCP·Flowise) ④Trust-ML(FacePay·FedLPA·신분증). "모델 직무"가 아니라 운영 지도. |

**reference-only (지도만, 딥다이브 보류):**

| 축 | 인덱스 한 줄 |
|---|---|
| Server · Security | 금융 서버 = 장기 변경구조 + 검증가능 안전성 + 관측가능 장애대응 + 보안 점진 상향. 키워드: PQC(양자내성), 제로트러스트, LLM 취약점 분석, Node.js 취약점 upstream 기여. (59글, Slash 18) |
| Frontend · QA · Node | 프레임워크 선택이 아니라 *빠른 변경 속에 품질·DX 유지하는 운영 체계*. QA = 검수 인력이 아니라 조직 전체가 실행하는 테스트 플랫폼. (88글, Slash 13) |
| Data | 조직이 같은 숫자를 믿게 하는 분석 프레임(TUES·MTVi·A/B·PANDA) + 그 숫자를 실시간·정합·복구가능하게 공급하는 플랫폼(Spark Connect·StarRocks·Flink/RocksDB·Kafka·CDC/Iceberg). (32글) |
| DevRel · DevOps | 엔지니어가 더 빨리 배우고·안전하게 배포하고·적게 실수하게 하는 조직운영. DevRel(AI Surf Day·SLASH·Tockerthon) + DevOps(하이브리드클라우드·service mesh·K8s·SRE). (16글, Slash 8) |
| Client (Android/iOS) | 거의 노이즈 — 의존성·모듈화·앱시작 성능·Rally 애니메이션 등 네이티브 운영. 고유 8글, 원리 델타 없음. |

## 3. 재사용 1순위 — Toss 원고 구조 (내 블로그용)

전 직무 글에 반복되는 원고 뼈대. **작가 자신의 블로그·회고·포트폴리오 원고화에 가장 재사용성 높은 산출물.**

1. **문제 장면** — 모두가 그냥 넘기던 불편/오해를 연다.
2. **스케일 압력** — 조직·사용자·트래픽이 커지며 기존 방식이 왜 깨졌나.
3. **실패 노출** — 실패/예상 밖 장면을 숨기지 않는다(성공담 금지).
4. **문제 재정의(분해)** — 기능 요구가 아니라 사용자·조직·도구 조건으로 쪼갠다.
5. **증거** — 숫자·사용장면·운영변화 중 하나로 결과를 보인다.
6. **남은 리스크** — 자동화 이후에도 사람이 책임질 영역을 남긴다.
7. **"적용해보기"** — 독자가 자기 프로젝트에서 바로 점검할 질문으로 닫는다.

→ juhyeong-voice 로 워싱 시 이 7단 스캐폴드를 골격으로 쓴다. 단 Toss 문체/브랜드 모방 금지 — *구조만* 차용.

## 4. 포지셔닝/취업 델타 (job-hunting)

- **repo-over-resume**: 디자이너/개발자가 시안·설명문 대신 *작동하는 앱/레포*를 전달하면 설계-구현 번역비용이 준다(`deadend`). → 포트폴리오는 결과 산출물보다 작동 증거.
- **AI = 추상화 설계 역량**: "개발자는 AI 에게 대체되는가" 글의 결론은 대체가 아니라 *업무를 추상화하는 역량*으로 이동(`will-ai-replace-developers`). career messaging 에 활용 가능하되 과장 금지.
- **역할 재프레임**: TW = 지식시스템 설계자, TPM = 회색지대 해결자. 작가가 지원서에서 자기 역할을 "산출물 담당"이 아니라 "시스템·기준·owner 설계"로 서술하는 앵글.

## 5. AI/MCP/하네스 델타

- **Software 3.0 조직 하네스**(`harness-for-team-productivity`): LLM 을 개인 도구가 아니라 executable SSOT + context layering + marketplace/workflow 배포로. → agent-harness 와 강한 중복, *조직 생산성 저점 상향* 언어만 델타.
- **내부 MCP = 도구 계약**(`internal-mcp-server`, `tosspayments-mcp`): "문서를 RAG 에 넣기"가 아니라 API/결제 연동을 *도구 스키마·검색단위·토큰예산·transport·결과 eval* 문제로. 
- **PANDA = LLM 앞 SSOT**: 데이터 어시스턴트도 LLM 이전에 신뢰가능한 정본 데이터 계층이 먼저.
- **skill-quality rubric**: 사내 AI 스킬을 품질 기준으로 관리 — vault 스킬 큐레이터와 연결점.

## 6. UX Writing 확장 (기존 스킬 너머)

기존 [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md) 은 제품/UI 카피 윤문 스킬로 *유지*. 이번 델타는 그 밖의 확장 방향 — **중복 승격 금지, 확장 앵글만**:

- **에러 메시지 시스템**(`introducing-toss-error-message-system`): 좋은 문장이 아니라 사용자가 *다음 행동을 할 수 있게* 하는 시스템. 사용자는 자기와 관련된 정보만 본다.
- **팀 언어 시스템**(`27192`): UX Writer 병목 대신 팀 전체가 같은 기준으로 쓰게.
- **비조작적 마케팅 문구**(`Marketing_Writing`): 클릭률을 높이되 FOMO·압박 없이 핵심 보상 + 가벼운 행동으로.

## 7. 무결성 caveat (박제 — 승격 시 반드시 유지)

- **모든 수치는 source-reported (미검증)**. 예: 토독 40,000+ 유효페이지·월 1000명, 토스페이스 이모지 3600개, 유스카드 130만장, 바이럴 K 0.4→0.7, 만보기 첫날 100만명·7개월 실패·1억 비용, 매일 방문 55%. 전부 원문 주장이며 독립 검증 안 함. 보편 법칙으로 승격 금지.
- **대부분 Slash 항목은 metadata-only** — article URL 이 SLASH 세션 페이지(영상/PDF)로 리다이렉트. 본문형 딥다이브로 승격하려면 별도 영상/PDF intake 필요.
- **heading-level 추론** — 전문(full-text) 해체가 아니라 제목/헤딩/메타 기반 지도. 개별 기법의 실제 구현 디테일은 원문 확인 필요.
- **TDS/브랜드 no-copy** — Toss 시각요소·TDS 컴포넌트·토스페이스·문체 복제 금지. *원칙만 번역.*
- **캡처 유효기간 = 2026-07-04 KST 한정** (Toss 블로그는 time-sensitive).

## 8. 명명된 딥다이브 백로그 (PARK)

아래는 지도에서 확인만 하고 **파킹** — 트리거 = *특정 프로젝트가 그 기법을 실제로 필요로 할 때*. 그전엔 순수 지식으로만 둔다(Karpathy #2, 억지 흡수 금지).

| 후보 | 무엇 | 발동 트리거 |
|---|---|---|
| `feature-store-trainkit` | MLOps 플랫폼 — feature store + 학습 파이프라인, train-serving skew, PIT join | ML 파이프라인 실제 구축 시 |
| `internal-mcp-server` | Swagger/API 스펙을 MCP 도구로 변환한 사내 자동화 | vault/게임에 MCP 도구 계약 설계 시 |
| `da-assistant-panda` | LLM 앞단 SSOT 데이터 계층(PANDA) | 데이터 어시스턴트/신뢰 데이터 레이어 필요 시 |
| `facepay` (history-of-face-recognition) | 금융 생체인식 = 결제 신뢰 인프라(anti-spoofing·임계값·A/B) | 신뢰/보안 UX 설계가 프로젝트 축이 될 때 |

## 학습→반영 (Absorb-to-Apply)

이 지도는 *노트*로 끝나지 않는다. 구체 반영처:

1. **juhyeong-voice 블로그 스캐폴드** — §3 Toss 7단 원고 구조를 juhyeong-voice 의 블로그/회고 원고 골격 옵션으로 등록(구조만, 문체 모방 X). ← 즉시 반영 가능한 1순위.
2. **applications/*/resume 포지셔닝** — §4 를 지원서 self-framing 앵글로: 산출물 담당 → 시스템·기준·owner 설계자, repo-over-resume, AI=추상화 역량.
3. **[토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md) / domains** — §6 확장 앵글(에러 메시지 시스템·팀 언어 시스템·비조작 마케팅)은 기존 스킬 *중복 승격 없이* 확장 backlog 로만. 마케팅 문구는 domains/marketing 라우팅.
4. **agent-harness** — §5 Software 3.0 조직 하네스·MCP 도구계약·TPM식 회색지대 구조화를 다중에이전트(Claude/Codex) dispatch 규율의 참조 델타로. 기존 하네스와 중복이라 *조직 생산성 언어만* 흡수.
5. **PARK (§8)** — 4개 딥다이브는 반영처 없음(순수 지식). 트리거 발동 전까지 흡수 0.
