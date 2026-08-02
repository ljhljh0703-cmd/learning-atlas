---
created: 2026-08-02
updated: 2026-08-02
type: learning
category: methods
tags: [ai-enablement, internal-platform, llm-gateway, governance, dev-productivity, measurement, wemade-xr]
---
<!-- 사내 AI 도구 배포·운영·측정 플레이북 — JD "AI 도구의 사내 배포 및 운영 관리" 정면 대응 자료. -->

# 사내 AI 도구 배포·운영·측정 플레이북

> ⚠️ **임시(provisional).** 벤더 자사 홍보 수치는 `⚠벤더편향`으로 표시했다. **숫자를 그대로 옮기지 말 것** — 이 노트의 결론 자체가 "남의 숫자를 인용하지 말고 사내에서 직접 계측하라"다.

## 0. 철칙

> **라이선스를 뿌리는 것과 확산은 별개다. 전담 오너십 없이 사내 AI 도구는 정착하지 않는다.**

`[확인]` Plaid의 실측 표현이 정확하다 — *"Enable it in Okta, and they will come"은 통하지 않는다.* (https://plaid.com/blog/ai-coding-adoption-plaid/)

---

## 1. 롤아웃 방법론 — 남이 이미 검증한 전술

### Plaid (자사 제품 아님 = 편향 낮음) `[확인]`
저비용 고효과 전술 목록. **신입이 첫 분기에 그대로 실행 가능하다.**
1. 도구 파일럿의 **법무·보안 사전 정렬** → 검토 기간 수 주 → 수 일
2. ⭐ **자사 코드베이스로 찍은 1~3분 사내 데모 영상** (벤더 제공 일반 영상은 효과 없음)
3. 팀별 **사용률·리텐션 대시보드**
4. **엔지니어링 매니저 타깃** 교육 (개별 엔지니어보다 레버가 크다)
5. 전사 **"AI Day" 워크숍**
6. **이탈(churn) 사용자에게 선제 DM**으로 불만 청취
7. 기존 IDE 대체 강요 없이 **병용 허용**

결과(자기보고): 엔지니어 75%+ 정기 사용, AI Day 참여 80%+, 만족도 90%+.

### Atlassian — 분기별 4일 사내 부트캠프 `[확인]` `⚠벤더편향`
Day1 외부 연사 + 사내 얼리어답터 사례 / Day2 도구 심화 / Day3 **7개 트랙 빌드데이**(프로토타입→프로덕션, 고객 테스트, 엔드투엔드 에이전트, **평가(eval) 기법**) / Day4 데모 쇼케이스(**실패 공유 포함**).
교훈 — 이론 교육이 아니라 **직접 만들게 해야 한다**.

### 벤더 공식 롤아웃 플레이북 `[확인]` `⚠벤더편향` (그래도 체크리스트로 유용)
- Anthropic Claude Enterprise Administrator Guide — https://claude.com/resources/tutorials/claude-enterprise-administrator-guide
  4단계: ①기술 세팅(SSO/SCIM·보안리뷰·시트) ②변화관리·런칭(**성공지표 정의 · 챔피언 식별** · 커뮤니케이션) ③이네이블먼트·교육 ④확산·임팩트 측정. 파일럿 2~4주 → 점진 확대.
- GitHub "Roll out at scale" — https://docs.github.com/en/copilot/tutorials/roll-out-at-scale
  라이선스 셀프서브 / **AI 매니저(챔피언) 지정** / 미사용자 리마인드 / 기능·모델 파일럿 / 다운스트림 임팩트 설계.

> 🔗 **위메이드 맥락** — 사내에 이미 **"AI 챔피언 협의체"**가 있다(stories.wemade.com AI 챔피언 노트 #1). 위 두 플레이북의 "챔피언 식별" 단계를 회사가 **이미 밟아 놓은 상태**다. 우리 팀이 붙을 자리는 그다음 — 플랫폼·계측·거버넌스. `[추정]`

### 🇰🇷 국내·게임 도메인 최근접 사례
**LINE Games "Nexus AI"** (AWS 기술블로그, 2025-12) — https://aws.amazon.com/ko/blogs/tech/linegames-ai-agent-for-accelerating-game-publishing
게임 퍼블리싱 사내 지원 에이전트. Bedrock Knowledge Base + Agents, **Confluence 크롤링 파이프라인**(Step Functions), **Unity/Unreal 엔진 타입 메타데이터 필터링**, 시맨틱 캐싱으로 반복 질문 100~300ms.
⚠️ **본문의 응답시간·문의 36% 감소·만족도 4.3 등은 프로덕션 실측이 아니라 목표치**다. 인용 시 반드시 "목표"로 표기.

기타: 카카오 「AI Native: 실행과 확산 사례집」 https://tech.kakao.com/posts/746 · 한컴테크 AI 코딩 어시스턴트 도입 가이드(국내 10개사 비교) https://tech.hancom.com/ai-coding-assistant-guide/

---

## 2. ⭐ 레퍼런스 아키텍처 — Cloudflare 사내 AI 스택

`[확인]` `⚠벤더편향`(전 구성요소가 자사 제품) — https://blog.cloudflare.com/internal-ai-engineering-stack/
**공개된 사내 AI 플랫폼 아키텍처 중 가장 구체적이다.** 3계층 구조가 그대로 설계 템플릿이 된다.

| 계층 | 구성 |
|---|---|
| **플랫폼** | 인증(제로트러스트) / **LLM 라우팅·비용통제(AI Gateway)** / 추론 / **MCP 포털**(13개 프로덕션 MCP 서버, 182개 툴을 Backstage·GitLab·Jira에 연결) / 샌드박스 코드 실행 |
| **지식** | 서비스 카탈로그(서비스 2,055개·팀 375개) / **약 3,900개 레포에 `AGENTS.md` 자동 생성** |
| **집행** | 모든 MR에 AI 코드 리뷰어 자동 적용 / 사내 표준(Engineering Codex)을 에이전트가 인용 |

**운영 설계 포인트(그대로 훔칠 것)**
- 프로바이더 키는 **서버사이드에만** 보관 — 사용자는 키를 못 본다
- SSO → JWT → 프록시 → AI Gateway 경로
- **이메일을 익명 UUID로 매핑** — 비용 귀속은 하되 프로바이더엔 신원 미노출
- 모델 카탈로그 **매시간 갱신 + ZDR 자동 강제**
- MCP 툴 스키마를 **2개 포털 툴로 접어 요청당 약 15,000 토큰 절감** ← 같은 계열 기법 = Anthropic "Code execution with MCP"

> 🔗 **작가 vault와의 동형** — `AGENTS.md` 자동 생성 = Sub-brain의 라우팅 맵 · Engineering Codex 인용 = 헌법 §근거 인용 의무 · MCP 툴 접기 = **RTK/progressive disclosure 그 자체**. **이미 하고 있는 걸 조직 규모로 옮기는 것**이라고 말할 수 있다.

---

## 3. 게이트웨이·거버넌스 도구 (실존 확인)

| 도구 | URL | 비고 |
|---|---|---|
| **LiteLLM** | https://github.com/BerriAI/litellm · https://docs.litellm.ai/docs/proxy/users | ★53.8k. 100+ 프로바이더, **Virtual Keys**, 스펜드 트래킹, 레이트리밋, 가드레일, 어드민 대시보드 |
| **Portkey Gateway** | https://github.com/Portkey-AI/gateway | ★12.1k, MIT. 1,600+ 모델, 50+ 가드레일, 자체호스팅 |
| **Cloudflare AI Gateway** | https://developers.cloudflare.com/ai-gateway/ | 캐싱·레이트리밋·분석·모델 폴백 |
| **Kong AI Gateway** | https://developer.konghq.com/ai-gateway/ | 기존 API 게이트웨이 자산 있는 조직에 적합 |
| **Langfuse** | https://github.com/langfuse/langfuse | 오픈소스 LLM 옵저버빌리티/평가/프롬프트 관리. OTel·LiteLLM 연동 |
| 국내 검토기 | https://tech.osci.kr/ai-gateway-architecture-and-security/ | 한국어 아키텍처·보안 관점 |

⭐ **`LiteLLM + Langfuse`가 자체 구축의 사실상 표준 조합**이다. 가상 키·팀별 예산·감사 로그·비용 대시보드를 **몇 시간 안에 데모 가능** → 입사 초기 성과물로 최적. `[추정]`

### 코딩 에이전트를 조직 정책으로 통제하는 표면 (Claude Code 기준)
`[확인]` `⚠벤더편향` — https://code.claude.com/docs/en/admin-setup
JD 문구를 문장 대 문장으로 대응시킬 수 있는 유일한 수준의 실무 문서다.
- 정책 전달 우선순위(관리콘솔 > OS 정책 > 파일 > 사용자 설정), 권한 룰은 병합되며 **사용자가 추가는 가능하나 제거는 불가**
- 강제 가능 항목: 권한 룰 / 권한 우회 모드 차단 / **OS 레벨 샌드박스 + 네트워크 도메인 allowlist** / **조직 공통 CLAUDE.md 강제 주입** / **MCP 서버 allow·deny** / 플러그인·훅 제한 / 로그인 조직 강제 / 사용 가능 모델 제한 / 최소·최대 버전 강제
- ⭐ **설계 통찰**: *"WebFetch를 막아도 Bash가 열려 있으면 curl로 나간다"* — 권한 룰과 샌드박스는 **다른 계층**이고 네트워크 통제는 OS 레벨에서 해야 한다.
- 게이트웨이 문서 세트 — 개요 `/gateways` · 서드파티 `/llm-gateway` · **조직 롤아웃 `/llm-gateway-rollout`** · 프로토콜 `/llm-gateway-protocol` · 개발자별 스펜드 캡 `/claude-apps-gateway-spend-limits`
  - 게이트웨이가 주는 것 4가지: **자격증명 서버사이드 보관 / 개인·팀 사용량 귀속 / 예산·레이트리밋 일원화 / 전 요청 감사 로깅**. 트레이드오프 = *"게이트웨이가 우리가 운영해야 할 인프라가 된다"*.
- 계측 — OTel `/monitoring-usage`. `cost.usage`·`token.usage`·`lines_of_code.count`·`pull_request.count`·`commit.count`·`active_time.total` + `user_prompt`/`tool_decision`/`api_error` 이벤트. `OTEL_RESOURCE_ATTRIBUTES`로 **팀별 비용 대시보드**. 프롬프트·응답 로깅은 기본 off → DLP 정책과 맞춰 결정.

### 보안 표준
- **OWASP GenAI Security Project** — https://genai.owasp.org/ · **Top 10 for Agentic Applications (2026)** https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- **MCP 최신 사양** — https://github.com/modelcontextprotocol/modelcontextprotocol · `[추정]` **MCP 서버 allowlist 관리 = 사내 AI 권한 관리** 그 자체다.
- Microsoft Purview DSPM for AI — 섀도우 AI 탐지 + 프롬프트/응답 감사 + DLP의 상용 레퍼런스. 자체 구축 시 **요구사항 목록으로 역산**해 쓸 것.

---

## 4. ⭐⭐ 효과 측정 — 이 노트에서 가장 중요한 절

### 프레임워크
- **SPACE**(Satisfaction/Performance/Activity/Communication/Efficiency), ACM Queue 2021 — https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/
  원칙: **단일 지표 금지, 최소 3개 차원 동시 측정.**
- **DORA 2025 State of AI-assisted Software Development** — https://dora.dev/dora-report-2025/ · **AI Capabilities Model** https://dora.dev/ai/capabilities-model/report/
  표본 약 5,000명 + 정성 인터뷰 100시간+. AI 사용 90%, 생산성 향상 체감 80%+, **반면 AI 생성 코드를 거의/전혀 신뢰하지 않음 30%**. AI 도입은 처리량·제품성과와 **양(+)**, **배포 안정성과는 여전히 음(−)**.
  > 🔑 **한 줄 결론 = 우리 팀의 논리 무기**: **"AI는 팀을 고치지 않는다. 이미 있는 것을 증폭한다."** 테스트 자동화·버전관리 성숙도·빠른 피드백 루프가 없으면 도구 배포는 불안정성만 키운다.
  AI Capabilities Model 7종(정책 명문화·사내 컨텍스트 연결·기본기 우선·안전망 강화·**내부 플랫폼 투자**·최종 사용자 중심 등)은 **AI 인에이블먼트 팀 로드맵 항목으로 그대로 사용 가능**.
- **DX Core 4** `⚠벤더편향` — https://getdx.com/dx-core-4/ · AI 측정 https://getdx.com/research/measuring-ai-code-assistants-and-agents/
  실무적으로 유용한 3가지: ① **선도 조직도 실사용률 약 60%** — 100% 목표는 비현실적 ② **에이전트를 따로 재지 말고 팀 산출물에 포함**해 측정 ③ 하향식 강제·개인 평가 사용 금지.

### 독립 연구 (수치 인용 전 반드시 읽을 것)
- **METR RCT (2025-07)** `[확인]` **편향 없음(독립 비영리)** — https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
  숙련 오픈소스 개발자가 AI 사용 시 **실제로는 19% 느려졌는데 스스로는 20% 빨라졌다고 인식**.
- ⚠️ **METR 후속 (2026-02)** — https://metr.org/blog/2026-02-24-uplift-update/
  **"19% 느려짐"만 인용하면 오래된 정보다.** 후속 연구(개발자 57명·800+ 태스크)에서 기존 참가자 −18%(CI −38%~+9%), 신규 −4%(CI −15%~+9%)로 **통계적 결론 불가**. 시급 $50에도 AI 없이 일할 개발자 모집이 어려워졌고, 참가자 30~50%가 AI 유리한 태스크를 의도적으로 제출하지 않아 **선택편향으로 설계를 바꾸는 중**. METR 본인들이 "효과 크기에 대한 매우 약한 증거"라고 명시.
- Google 사내 RCT `⚠벤더편향` — arXiv:2410.12944. 엔지니어 96명, 완료 시간 **약 21% 단축**(신뢰구간 넓음).
- Copilot 3개 필드실험 `⚠벤더편향` — Management Science 2025. 완료 태스크 **약 26% 증가**, **주니어일수록 효과가 크고 시니어는 작다**.
- MIT NANDA "95%가 ROI 못 냄" `[추정]` **피어리뷰 아님, 방법론 논쟁 있음.** 경영진 슬로건으로는 강력하나 **엔지니어링 근거로 쓰지 말 것.**

> 🔑 **종합 판단 `[추정]`** — 현재 공개 증거로는 "AI 도구가 조직 생산성을 몇 % 올린다"를 **단정할 수 없다**. 신입으로서 가장 안전하고 설득력 있는 포지션: **벤더 수치를 옮기지 말고, 사내에서 DORA 4지표 + SPACE 다차원 + 사용률·리텐션·비용을 직접 계측하는 파이프라인을 만든다. 계측 자체가 산출물이 된다.**
> 🔗 vault 동형 = [하네스 개선 판정 계약 (Vault-lite)](harness-gain-evaluation-contract.md) (하네스 이득 ≠ 같은 과제 점수 상승). **작가는 이미 이 사고를 갖고 있다.**

---

## 5. 컨텍스트·에이전트 엔지니어링 최신 1차 자료 (2025~2026)

**Anthropic 엔지니어링** — 전부 JD 우대사항("Context/Prompt/Harness/Loop 엔지니어링")의 공식판
- Effective context engineering for AI agents (2025-09) — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Effective harnesses for long-running agents** (2025-11) — https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- ⭐ **Demystifying evals for AI agents** (2026-01) — https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents ← "이 도구가 실제로 되는가"를 판정하는 방법론
- ⭐ **Scaling Managed Agents: Decoupling the brain from the hands** (2026-04) — https://www.anthropic.com/engineering/managed-agents ← 사내 에이전트 플랫폼 아키텍처 최신
- Writing effective tools for agents (2025-09) · **Code execution with MCP** (2025-11) · Agent Skills (2025-10) · Building effective agents (2024-12) · Multi-agent research system (2025-06)
- 실무 — Claude Code best practices https://www.anthropic.com/engineering/claude-code-best-practices · 샌드박싱 https://www.anthropic.com/engineering/claude-code-sandboxing · auto mode https://www.anthropic.com/engineering/claude-code-auto-mode
- 교육 — Anthropic Academy 무료 코스 https://anthropic.skilljar.com/claude-code-in-action ← **사내 교육 커리큘럼을 0부터 만들지 말고 이걸 래핑**

**OpenAI** — A practical guide to building agents · AI in the Enterprise · **Identifying and scaling AI use cases**(유스케이스 발굴 프레임) · Managing AI investments in the agentic era(지출 통제) → https://openai.com/business/guides-and-resources/
**Google** — The AI agent handbook(한국어판 있음) https://cloud.google.com/resources/content/intl/ko-kr/ai-agent-handbook · Kaggle Introduction to Agents 화이트페이퍼

---

## 6. 반영 (학습→반영 루프)

- **즉시 반영** — wemade-xr-internship-study-atlas P0/P1의 근거. Day-1 질문 3번(사내 AI 스택 배포·권한·비용 관리 주체)과 5번(3개월 평가 기준)은 §3·§4에서 나왔다.
- **파킹(트리거)** — LiteLLM+Langfuse 로컬 데모 구축 = **사내가 이미 게이트웨이를 쓰는지 확인 후**(중복 구축 방지). 트리거 = Day-1 질문 3번 응답.
- **vault 반영 후보** — 헌법 §"비용·모델 운용 지침"에 *"조직 스케일 = 게이트웨이·귀속·감사가 개인 스케일의 RTK를 대체한다"* 한 줄 추가는 **작가 승인 후**(L-STAGE — 헌법 변경은 패치 스테이징).
