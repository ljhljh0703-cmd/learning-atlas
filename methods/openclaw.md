---
created: 2026-08-13
updated: 2026-08-13
type: learning
tags: [ai-agent, openclaw, messaging-agent, personal-assistant, gateway, skills, multi-agent, security, byo-model]
source: "https://github.com/openclaw/openclaw README(main) + docs.openclaw.ai + DigitalOcean·Wikipedia 개요 (2026-08-13 fetch)"
---
<!-- OpenClaw(개인 AI 어시스턴트 프레임워크) 파악 — 메신저 네이티브 에이전트·로컬 게이트웨이·스킬·멀티에이전트. clean-room 요약(README 원문 복붙 아님). 작가 명시 세팅 지시(2026-08-13)로 승격, 단 내용은 문서기반 파악(실사용 미검증). -->

# OpenClaw (methods)

## 1. 한 줄
**자기 기기에서 돌리는 1인용(single-user) 개인 AI 어시스턴트 프레임워크.** 이미 쓰는 메신저(Slack·Telegram·WhatsApp·Discord·Signal·iMessage·Teams·Matrix 등 20+)를 UI로 삼아, 로컬 에이전트가 답하고 실제 작업을 수행한다. 챗봇이 아니라 **로컬·상시·멀티채널 에이전트**. BYO 모델(OpenAI/Anthropic/로컬), MIT.

## 2. 아키텍처 (핵심 = Gateway 컨트롤 플레인)
- **Gateway** — 로컬 우선 단일 컨트롤 플레인(WebSocket `ws://127.0.0.1:18789`, 데몬). 세션·채널·툴·이벤트·cron·webhook을 한 곳에서 관리. "제품은 어시스턴트, Gateway는 컨트롤 플레인일 뿐."
- **Pi agent 런타임** — RPC 모드, 툴 스트리밍·블록 스트리밍. (Mario Zechner의 `pi-mono` 기반.)
- **클라이언트** — CLI(`openclaw …`)·WebChat·macOS 메뉴바 앱·iOS/Android 노드.
- **Channels** — 메신저 연동(Slack=Bolt, Telegram=grammY, WhatsApp=Baileys, Discord=discord.js …). 그룹 라우팅·mention 게이팅·per-channel 청킹.
- **Nodes** — 기기-로컬 실행자(macOS/iOS/Android): `system.run`·카메라·화면녹화·알림·`location.get`·Canvas. "exec는 Gateway가 사는 곳에서, 기기 액션은 기기에서."
- **Tools** — 관리형 Chrome 브라우저 제어(CDP)·Canvas(A2UI 에이전트 구동 시각 워크스페이스)·cron/wakeup·webhook·Gmail Pub/Sub.
- **Multi-agent 라우팅** — 인바운드 채널/계정/피어를 격리된 에이전트(워크스페이스+세션)로 라우팅. **`sessions_*` 툴**(list/history/send/spawn, reply-back ping-pong)로 에이전트 간 협업.
- **Workspace + Skills** — `~/.openclaw/workspace`, 주입 프롬프트 `AGENTS.md`·`SOUL.md`·`TOOLS.md`, 스킬 `workspace/skills/<name>/SKILL.md`. **ClawHub** 레지스트리(에이전트가 스킬 자동 검색·설치, 설치 게이팅).

## 3. 보안 모델 (도입 시 핵심)
- **인바운드 DM = 신뢰 불가 입력(untrusted).** 프롬프트 인젝션 전제.
- **DM pairing 기본** — 모르는 발신자는 pairing 코드만 받고 메시지 미처리(allowlist 승인 후 처리). 공개 오픈은 명시 opt-in.
- **샌드박스** — `main` 세션은 호스트에서 툴 실행(혼자 쓸 땐 풀 액세스). 그룹/채널(non-main)은 per-session **Docker 샌드박스** 권장, bash를 Docker로. 툴 allowlist/denylist(예: 샌드박스는 browser·nodes·cron·gateway 거부).
- **elevated bash** 토글(`/elevated`), Tailscale Serve/Funnel·SSH 터널(원격), Gateway는 loopback 강제.

## 4. 모델·런타임·기원
- 모델 = BYO. OpenAI(ChatGPT/Codex OAuth)·Anthropic(claude-opus)·로컬. 모델 failover/rotation. 설정 `~/.openclaw/openclaw.json`. 런타임 Node≥22, macOS/Linux/Windows(WSL2).
- 기원 = **Peter Steinberger(steipete)** + 커뮤니티, "Molty(우주 랍스터 AI)"용. 2025-11 공개, Warelay→Moltbot(Anthropic 상표 이슈)→**OpenClaw** 개명. 바이럴(72h 6만 스타). 스폰서 OpenAI·Vercel·Blacksmith·Convex.

## 5. 정직 평가 (Honest Assessment)
- **관련성 = 높음(작가 도메인 정중앙).** 메신저 네이티브 에이전트 + 스킬 + 멀티에이전트 + 워크스페이스(AGENTS/SOUL/TOOLS/SKILL) = **작가 Sub brain·Hermes 하네스가 쓰는 패턴의 성숙한 프로덕트 레퍼런스.** `sessions_*`(에이전트간·spawn·reply-back) ≈ 작가의 Doer/Verifier 디스패치+RETURN, ClawHub ≈ skills/curator/incubator, 주입 프롬프트 ≈ hot.md injection surface·AGENTS 하드계약.
- **회사 도입 ≠ 개인 실험 — 실증 근거 있음.** vault [게임업계 사내 AI 조직·도구 지형 (2025~2026)](game-industry-ai-org-landscape.md) 관측 = **넥슨이 오픈클로 전사도입을 중단**(가능≠지속가능). untrusted DM·호스트 액세스라 사내 데이터/보안정책과 충돌 + 조직 스케일 지속가능성 이슈. KRAFTON JD도 "회사 데이터·PII·키·보안 엄수" 명시. → **개인 실험은 저마찰, 회사 적용은 반드시 게이트(보안·지속가능성).**
- 과장 가드: 문서기반 파악(실사용 미검증). 실제 Slack 연동·안정성·조직 스케일은 도입 후 실측 필요.

## 6. 학습→반영 루프 ([학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md))
1. **FDE Slack 자동화 실험** — OpenClaw Slack(Bolt) 채널로 요약·액션아이템 도구 → KRAFTON AI FDE 업무예시(메일·Slack 요약·액션아이템) 충족. **Cofathon식 검증계약 먼저**(스레드→액션아이템 N개·근거 인용 없으면 버림→RED부터)로 붙이면 "Slack 안 해봤다"가 "Slack 자동화도 검증까지 닫았다"로 전환. → 면접 이후 개인 실험(회사 도입 아님).
2. **하네스 레퍼런스 흡수** — 작가 자체 harness/skills 대조 후보: 워크스페이스 주입파일 규약·ClawHub식 스킬 레지스트리·`sessions_*` 격리 라우팅. (신규 구축 아님 — 기존 agent-harness·skill-curator와 대조용.)
3. **보안 패턴** — untrusted-input·sandbox non-main·tool allowlist/denylist → dispatch-builder·clean-room·worktree-accept 가드와 대조.
4. **사내 AX 배포와 연결** — [사내 AI 도구 배포·운영·측정 플레이북](internal-ai-enablement-playbook.md)("라이선스 뿌리기 ≠ 확산", 넥슨 오픈클로 중단 사례)와 함께 읽으면 "도구 도입 가능 ≠ 조직 지속 도입" 판정 근거.

## 7. 관계
- hermes-loop·agent-harness (에이전트 하네스 — OpenClaw = 그 패턴의 프로덕트 사례) · skill-curator (ClawHub 대조) · dispatch-builder (sessions_* 대조) · [게임업계 사내 AI 조직·도구 지형 (2025~2026)](game-industry-ai-org-landscape.md) (넥슨 오픈클로 전사도입 중단) · [사내 AI 도구 배포·운영·측정 플레이북](internal-ai-enablement-playbook.md) (사내 AI 배포·확산 격차).
