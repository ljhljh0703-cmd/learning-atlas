// 주형 유니버스(구 마을 이력서)의 은하, 작업, 링크 정본 config입니다.
// v20 리테마: 표현 레이어(이름·테마색·아이콘)만 변경 — status/link/stage/hook/domains/recent 데이터 불변.
const VILLAGE_RESUME_CONFIG = {
  resumeHref: "./Resume_LeeJuHyeong.html",
  // v38: [도메인 태그] + 제품 정체 + 수치 포맷으로 재구성(작가 확정 2026-07-11 — "dry-run이 왜 좋은지 일반 채용담당은 모른다" 피드백 대응)
  kpiTicker: [
    { tag: "추천 시스템", text: "AI 도서 큐레이션 — Top-5 Precision 100% · Bad Rate 0%", source: "북켓몬" },
    { tag: "의료 RAG", text: "내과 자문 챗봇 — EM 0.71 · BERTScore 0.73", source: "알려줄고양" },
    { tag: "AI 트레이딩", text: "퀀트 자동매매 봇 — dry-run 평가 100%", source: "현수봇" },
    { tag: "게임 검증", text: "퍼즐 디펜스 — 몬테카를로 200판 · 회피 불가 스폰 0.00%", source: "지켜줘! 젤리 패닉" },
    { tag: "지식 그래프", text: "학습 아카이브 — 182편 매주 자동 발행 · 누출 0", source: "Learning Atlas" }
  ],
  intro: {
    title: "주형 유니버스",
    copy: "주형 유니버스에 오신 걸 환영합니다. 은하를 눌러 작업을 둘러보세요.",
    note: "은하를 누르면 그 안의 작업을 볼 수 있어요."
  },
  onboarding: {
    storageKey: "jw_seen_intro",
    iconsReady: true,
    // v27 워싱 완료
    entry: {
      title: "주형 유니버스 — 인터랙티브 이력서",
      body: "AI 응용 엔지니어 이주형의 실제 작업을 은하로 둘러보는 공간이에요. 모든 은하는 라이브 프로젝트로 이어지고, 곳곳에 작은 게임 퀘스트가 숨어 있어요. 게임은 나중에 언제든 열 수 있어요.",
      startLabel: "🎮 콘텐츠 체험하기 (약 3분)",
      skipLabel: "바로 조회하기"
    },
    steps: [
      {
        id: "sub-brain",
        title: "① Sub-brain — 제 지식을 굴리는 엔진",
        body: "공부하고 결정한 걸 흩어두지 않고 하나의 지식 그래프로 운영해요. 검증하는 엔진과 기록하는 엔진의 역할을 나누고, 충돌이 나면 단일 기준(SSOT)으로 정리해요. 이 유니버스의 학습 은하가 그 지식이 밖으로 나온 창구예요.",
        anchor: {
          label: "학습 은하에서 실제로 보기",
          group: "board"
        }
      },
      {
        id: "harness",
        title: "② Agent Harness — AI에게 일을 맡기는 계약",
        body: "범용 자동화 하나가 아니라, 도메인마다 다른 실패 조건을 읽고 그에 맞는 위임 계약과 검증 지표를 설계해요. 만드는 쪽(Doer)과 검증하는 쪽(Verifier)을 나눠서, 모델을 바꿔 껴도 계약이 남아 품질이 유지돼요.",
        anchor: {
          label: "StarLink에서 실제로 보기",
          group: "lab",
          member: "starlink"
        }
      },
      {
        id: "gate",
        title: "③ Evaluation Gate — 받은 결과를 그대로 안 믿어요",
        body: "AI가 준 산출을 바로 수용하지 않아요. 경로·검증 노트·해시를 묶은 증거 꾸러미로 포장해, 기계가 자동으로 볼 수 있는 검사와 사람의 판단을 나눠서 통과시켜요. 이 유니버스도 그렇게 검증하고 붙였어요.",
        ctaLabel: "유니버스 탐험 시작",
        anchor: {
          label: "북켓몬 케이스에서 실제로 보기",
          group: "lab",
          member: "bookemon"
        }
      }
    ],
    resultSummary: "방금 셋을 다 보셨어요. 정리하면 — 저는 지식을 단일 기준으로 운영하고(Sub-brain), 도메인별 AI 하네스를 설계하고(Agent Harness), 산출을 증거로 검증(Evaluation Gate)하는 AI 엔지니어예요.",
    skillCard: {
      filename: "주형-역량카드.png",
      name: "이주형",
      role: "도메인마다 다른 실패 조건을 읽고, 그에 맞는 AI 하네스를 설계·검증하는 AI 엔지니어",
      competencies: [
        "Sub-brain — 지식을 단일 기준(SSOT)으로 운영",
        "Agent Harness — 도메인별 AI 위임 계약 설계 (Doer·Verifier 분리)",
        "Evaluation Gate — 산출을 증거로 검증 (머신체크 + 사람 판단)"
      ],
      representativeLink: "Learning Atlas — github.com/ljhljh0703-cmd/learning-atlas"
    }
  },
  groups: [
    {
      id: "plaza",
      label: "관제 스테이션",
      status: "landmark",
      mapLabel: "관제소",
      // v35 T4: 지도 라벨 서브텍스트(2D hover·3D 라벨) — "공개/일부 공개" 대체, 은하 성격·기술 요약
      subLabel: "감상 가이드",
      theme: "#ffd166",
      x: 50,
      y: 50,
      w: 24,
      h: 14,
      representative: {
        kind: "plaza",
        sprite: "water-fountain.png",
        label: "관제 스테이션",
        stage: "안내"
      },
      members: []
    },
    {
      id: "lab",
      label: "평가·RAG 은하",
      status: "hero",
      mapLabel: "평가·RAG",
      subLabel: "RAG · 추천 · 평가",
      theme: "#4ecdc4",
      x: 42,
      y: 19,
      w: 52,
      h: 24,
      representative: {
        kind: "building",
        sprite: "business-building.png",
        label: "평가·RAG 은하",
        stage: "입장가능"
      },
      members: [
        {
          slug: "bookemon",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/AI-Book-Curation/portfolio.html",
          label: "북켓몬",
          hook: "추천이 왜 맞는지, 룰을 하나씩 꺼서 증명했습니다 — 60초면 그 표를 다 봅니다.",
          stage: "데모(오프라인 평가 완료)",
          domains: ["rag", "recsys", "eval"],
          evidenceAxes: {
            problem: "단순 코사인 유사도 추천의 리텐션 한계, 대규모 유저·도서 매칭의 O(N²) 복잡도 — 정확도와 레이턴시가 동시에 임계점을 넘는 구조.",
            decision: "Qdrant 도입으로 매칭을 O(N·K)로 최적화. 쿼리 변형 4종·리트리버 3종·룰 on/off를 각각 평가해 llm_search_query·dense·룰 재정렬 채택(dense+BM25 RRF는 Top-10/20 급락으로 기각). 선호·대중성·최신성 결합 수식 S_personal 직접 설계, 임베딩은 KURE vs CLOVA 벤치로 선택.",
            result: "[실측] 룰 ablation으로 Top-5 Bad Rate 15.56%→2.22%·Precision 84.44%→97.78%(오프라인 18쿼리). 최종 운영 조합(llm_search_query·dense·룰 재정렬) Top-5 Precision 100%·Bad Rate 0%·평균 지연 577ms. KURE vs CLOVA Precision@50 91.14% vs 90.09%(+590ms). LightFM(test) 긍정 선호 90.52%·비선호 노출 1.45%."
          },
          teaser: "추천 수식을 직접 설계하고 ablation으로 증명한 도서 큐레이션.",
          resumeSlug: "bookmon"
        },
        {
          slug: "medical-chatbot",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/Medical-Chatbot/portfolio.html",
          label: "알려줄고양",
          hook: "같은 의료 질문을 세 가지 모드로 통제 비교 — 어디까지 믿어도 되는지 수치로 답합니다.",
          stage: "데모",
          domains: ["rag", "eval"],
          evidenceAxes: {
            problem: "의료 자문은 오답 비용이 크다 — 생성이 그럴듯한 것만으로는 신뢰할 수 없고, 근거 인용과 응급 상황 차단을 구조로 보장해야 한다.",
            decision: "Qwen2.5-7B를 QLoRA(r=16·4-bit nf4)로 내과 도메인에 적응, Dense+BM25 Hybrid RAG로 근거를 인용. 설계 기여도는 Mode A/B/C 3원 통제 비교로 분리 검증, RedFlag 응급 키워드는 안내문이 아닌 코드(Emergency Exit)로 차단.",
            result: "[실측] 객관식 EM 0.71 · 서술형 BERTScore 0.73. 안전선을 UX 라이팅과 코드 양쪽에 내장."
          },
          teaser: "EM 0.71 · BERTScore 0.73 — 3원 통제로 측정한 의료 RAG.",
          resumeSlug: "medical-rag"
        },
        {
          slug: "starlink",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/StarLink/portfolio.html",
          label: "StarLink",
          hook: "보청기 사용자가 직접 만든 실시간 통역 — 실기기에서 도는 데모로 확인합니다.",
          stage: "작동 프로토타입",
          domains: ["realtime"],
          evidenceAxes: {
            problem: "청각장애인에게 외국어 대면 대화는 이중 장벽 — 기존 통역 앱은 폰 화면을 손에 들고 봐야 한다. 화면 없이 보청기로 듣는 핸즈프리 통역이 필요.",
            decision: "Gemini Live가 연속 스트리밍 모델임을 파악해 turn-taking 인프라를 비활성화. LiveKit의 AVAudioSession 리셋을 LKRTCAudioSession 수동 락으로 막아 보청기 라우팅 보존, 재유입 에코는 반이중 마이크 제어(500ms 버퍼)로 차단.",
            result: "13개 디버깅 포스트모템 끝에 번역+음성출력+보청기 라우팅 연속 동작. EN·JA·ZH→KO 3개 언어쌍, MFi 보청기·AirPods·BT 지원. 작동 프로토타입 — 'sub-second 지연'은 설계 목표이며 독립 벤치마크 미수행."
          },
          teaser: "보청기로 듣는 핸즈프리 실시간 통역 — 당사자가 만든 접근성 AI.",
          resumeSlug: "starlink"
        }
      ]
    },
    {
      id: "workshop",
      label: "에이전트 은하",
      status: "construction",
      mapLabel: "에이전트",
      subLabel: "Agent Harness · 자동화",
      theme: "#a78bfa",
      x: 21,
      y: 51,
      w: 30,
      h: 42,
      representative: {
        kind: "building",
        sprite: "house-3.png",
        label: "에이전트 은하",
        stage: "일부 입장가능"
      },
      members: [
        {
          slug: "g-sight",
          group: "workshop",
          status: "construction",
          link: "",
          label: "G-Sight",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중",
          domains: ["agent"]
        },
        {
          slug: "pm-agent",
          group: "workshop",
          status: "construction",
          link: "",
          label: "PM-Agent",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중",
          domains: ["agent"]
        },
        {
          slug: "policy-axis",
          group: "workshop",
          status: "construction",
          link: "",
          label: "POLICY-AXIS",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중",
          domains: ["agent"]
        },
        {
          slug: "mapae",
          group: "workshop",
          status: "construction",
          link: "",
          label: "Mapae",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중",
          domains: ["agent"]
        },
        {
          slug: "agent-forge",
          group: "workshop",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/agent-forge/portfolio.html",
          label: "AgentForge",
          hook: "아이디어 한 줄을 넣으면 게임이 나옵니다 — 그 전 과정을 Codex CLI가 오케스트레이션합니다.",
          stage: "작동 프로토타입",
          recent: true,
          domains: ["agent", "gameai"],
          evidenceAxes: {
            problem: "AI 게임 생성 파이프라인",
            decision: "Codex CLI 오케스트레이션·self-contained 배포",
            result: "브라우저 플레이 게임 2종 (작동 프로토타입)"
          },
          // v22 1차안 — 작가 워싱 예정
          teaser: "생성된 게임 2종을 라이브에서 바로 플레이할 수 있습니다.",
          resumeSlug: "agent-forge"
        },
        {
          slug: "hyunsubot",
          group: "workshop",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/hyunsoo-bot/portfolio.html",
          label: "현수봇 / QuantLeap",
          hook: "LLM이 사라고 해도 통계 게이트가 막으면 사지 않습니다 — 안전장치부터 설계한 자동매매.",
          stage: "작동 프로토타입 · dry-run",
          recent: true,
          domains: ["agent"],
          evidenceAxes: {
            problem: "LLM에게 매매를 통째로 맡기면 비결정성·환각이 실손실로 직결 — 자율성과 안전성이 상충한다.",
            decision: "판단(LLM·JSON 스키마)과 실행(결정론적 코드)을 분리한 model+harness 구조. 리스크 레이어+HITL 승인을 비협상 안전장치로 두고, 재귀개선 루프가 로그를 분석해 전략을 갱신.",
            result: "[실측·모의] dry-run 평가 100% 통과 — 실 P&L·수익률은 주장하지 않는다(작동 프로토타입). 시크릿은 코드에 0(별도 repo 분리)."
          },
          teaser: "판단은 LLM, 실행은 코드 — dry-run 100%의 자동매매 에이전트.",
          resumeSlug: "hyunsoo-bot"
        },
        {
          slug: "asset-forge",
          group: "workshop",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/codex-asset-forge/",
          label: "Codex Asset Forge",
          hook: "생성 이미지는 아직 게임 자산이 아닙니다 — 자산이 되기까지 전 단계를 자동화하고 측정했습니다.",
          stage: "케이스스터디 (공개 draft — DRAFT_NOT_ACCEPTED 라벨 유지)",
          domains: ["agent", "gameai"],
          recent: true,
          evidenceAxes: {
            problem: "생성 이미지는 게임 자산이 아님 — 투명·프레임·좌표·충돌 정보가 없고, 실제 화면에 그려졌다는 증거도 없음. 같은 스타일 반복 생성·후처리가 진짜 병목.",
            decision: "image_gen raw → magenta key → grid slice → atlas → manifest → runtime proof 단일 흐름. 엔진이 읽을 frame·anchor·collision·proof 상태를 manifest 계약으로 보증 — 생성 모델을 믿지 않고 생성 뒤 모든 단계를 측정 가능하게.",
            result: "AgentForge 5 atlases·27 frames 빌드 PASS. ClaudeCraft 가시 맵 tile/item 스프라이트 11/11 렌더 증명(Playwright)·glyph 폴백 0. 기술 게이트 PASS ≠ 최종 아트 품질·재미(Do-not-claim 명시, MIT)."
          },
          teaser: "5 atlases · 27 frames · 11/11 ClaudeCraft 스프라이트 렌더 증명.",
          resumeSlug: "asset-forge",
          claimBoundary: "최종 아트 품질·사용자 수용·완전 자동화·상용 출시·재미 검증 무주장 (케이스 페이지 §07)"
        }
      ]
    },
    {
      id: "game",
      label: "AI 게임 은하",
      status: "construction",
      mapLabel: "AI 게임",
      subLabel: "게임 AI · Unity/Godot/JS",
      theme: "#fb7185",
      x: 78,
      y: 51,
      w: 31,
      h: 36,
      representative: {
        kind: "building",
        sprite: "old-coffee-shop.png",
        label: "AI 게임 은하",
        stage: "일부 입장가능"
      },
      members: [
        {
          slug: "rocketdan",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/ai-npc-social-reasoning-harness/",
          label: "AI 사회추론 시뮬레이션",
          hook: "늑대인간 7인 게임에 AI들을 앉히고 같은 판을 반복했습니다 — 시드 고정 결과표로 확인합니다.",
          stage: "탐색 연구 (claim gate 미통과·탐색적 경향)",
          recent: true,
          domains: ["gameai", "eval"],
          evidenceAxes: {
            problem: "LLM NPC의 발화 '그럴듯함'과 실제 사회추론을 분리 검증해야 한다. Werewolf-LLM 계보를 이어받되 인문학 스캐폴드·시드 고정 비교·raw/display 경계·출력 품질 gate를 명시적으로 분리.",
            decision: "발화·여론·수혜자 분석·심문 전략을 NPC의 공개 추론 frame으로 구조화(인문학 기반). 같은 seed·같은 7인 역할 구성에서 baseline vs scaffold를 비교하고, 강한 성능 주장은 claim gate로 통제.",
            result: "최종 RT2.3(N=20)은 품질 통제 하 양의 방향 — strong claim gate 미통과로 일반적 우월성 주장이 아닌 탐색적 경향으로만 보고(정직). 다음 단계: 독립 human annotation·belief-state table·다중 모델 재현."
          },
          teaser: "인문학을 학습한 AI는 늑대인간 게임에서 더 잘 추리할까.",
          resumeSlug: "rocket-sim"
        },
        {
          slug: "hwigi-tower",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/hwigi-tower-portfolio/Docs/Portfolio/hwigi-tower-steam-portfolio.html",
          label: "회귀자는 탑을 오른다",
          hook: "매 판 다른 말을 하는 AI NPC를 매 판 같은 규칙으로 묶었습니다 — 폰에서 도는 로그라이크.",
          stage: "작동 프로토타입 (playable vertical slice)",
          domains: ["gameai"],
          evidenceAxes: {
            problem: "SLM 도입 시 BPE 토큰 매칭 오류와 비결정적 생성으로 밸런스 시뮬 재현 검증 불가, 지연이 인터랙션 임계점 초과.",
            decision: "EXAONE 3.5 2.4B + QLoRA(r=32·α=64) 대화 학습. Seed 기반 결정론 생성·Deterministic Caching 재현성. Mataios=결정론 동행자(장식 NPC 아님, 플레이어/동행자 행동 분리). ML-Agents=전투 설계 프로브(AttackSpam·SkillSpam 열화 전략 노출→결정론 동행자 정책). 멀티에이전트 생산 파이프라인(clean worktree·evidence gate·아티팩트 SHA·배포검증).",
            result: "플레이어블 Unity 6 Android 프로토타입(루트·이벤트·2인 전투·보상·상점/휴식·보스) → 공개 포폴 HTML·AI NPC 케이스·APK 패키징. 26턴+ 멀티턴 한국어 유지율 100%·BIW 차단·토크나이저 진단 증거. RoguelikeSim headless + RunPolicy 5종 + BalanceMetrics 정량 집계."
          },
          teaser: "SLM 비결정성을 결정론으로 통제한 AI NPC 게임.",
          resumeSlug: "hwigi",
          claimBoundary: "프로토타입(상용 출시 아님) · ML-Agents=전투 설계 프로브(shipped runtime RL 아님) · ONNX 런타임 연결 아님 · AI NPC=EXAONE/QLoRA 대화 학습 케이스(fully on-device 배포 아님) · all Unity tests green/device smoke 미주장 · 최종 스토리 미완"
        },
        {
          slug: "jelly-panic",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/jelly-panic/",
          label: "지켜줘! 젤리 패닉",
          hook: "\"모든 위협은 예고된다\" — 반사신경 대신 수읽기를 겨루는 순수 JS 퍼즐 디펜스",
          stage: "공개 데모 (single HTML)",
          recent: true,
          domains: ["gameai"],
          evidenceAxes: {
            problem: "'반사신경 대신 수읽기'가 성립하려면 모든 위협이 예고돼야 함 — 회피 불가 스폰이 조금이라도 있으면 규칙 자체가 무너짐.",
            decision: "coverability 룰로 배치 가능성 보장. 결정론 로직 테스트 90건·DOM smoke 16건·몬테카를로 200판을 릴리스 게이트로 소스와 함께 공개. 룰이 막은 불공정 조건은 counterfactual 시뮬(후보 셀 19.1%)로 확인.",
            result: "몬테카를로 200판 회피 불가 스폰 0.00% [실측]. 의존성 0 단일 HTML 공개 데모."
          },
          teaser: "결정론 로직 테스트 90/90 · DOM smoke 16/16 · 몬테카를로 200판 회피 불가 스폰 0.00%.",
          resumeSlug: "jelly-panic"
        },
        {
          slug: "bone-trail",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/bone-trail/",
          label: "Bone Trail (libGDX 로그라이크)",
          hook: "원작 코드를 뜯어 규칙과 화면을 분리했습니다 — AI와 함께 현대화한 Java 로그라이크.",
          stage: "프로토타입 (libGDX)",
          domains: ["gameai"],
          evidenceAxes: {
            problem: "SPD 원작 기반 대형 Java/libGDX 코드베이스를 AI 보조로 현대화할 때, 게임 규칙이 렌더링과 얽혀 있으면 리팩토링 회귀를 사람이 잡을 수 없음.",
            decision: "게임 규칙을 렌더링과 분리해 결정론 모델 테스트로 헤드리스 검증. 멀티세션 AI 협업은 evidence ledger·dispatch·handoff로 감사 가능하게 관리. GPLv3 준수(원작 자산·코드 소유 무주장).",
            result: "실플레이 피드백을 UI 요구사항으로 되돌린 AI-assisted 소스 기반 UI 현대화 케이스. 게임 페이지 + 기술 케이스 공개."
          },
          teaser: "libGDX(Java)로 직접 구현한 로그라이크 — 플레이 빌드·기술 해설 공개.",
          resumeSlug: "bone-trail"
        },
        {
          slug: "backroom",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/backroom-level-0-godot/",
          label: "BackRoom Level 0 (고돗 백룸)",
          hook: "안전해 보이는 길이 함정입니다 — 선택을 기억하는 8개 방, 3개 엔딩의 클릭 공포.",
          stage: "프로토타입 (Godot 4 web)",
          domains: ["gameai"],
          evidenceAxes: {
            problem: "클릭 공포에서 '선택이 의미 있다'를 성립시키려면 상태 기억·멀티엔딩이 필요하지만, 엔딩 분기×재진입 조합이 늘수록 수동 QA로는 회귀 검증 불가.",
            decision: "8개 방·A/B/C 엔딩·상태 플래그를 개발 요구사항으로 고정. route validator(8방 도달성)와 Godot headless A/B/C QA를 릴리스 게이트로. 위험해 보이는 길이 진짜 단서로, 안전해 보이는 길이 함정으로 이어지는 정보 설계.",
            result: "플레이어의 선택·재진입을 기억하는 상태 시스템 + 엔딩 3종 도달성 headless 회귀 검증. Godot 4 Web 공개 프로토타입."
          },
          teaser: "Godot으로 직접 구현한 백룸 Level 0 — 플레이 빌드·포트폴리오 해설 공개.",
          resumeSlug: "backroom"
        }
      ]
    },
    {
      id: "studio",
      label: "콘텐츠·디자인 은하",
      status: "construction",
      mapLabel: "콘텐츠·디자인",
      subLabel: "디자인 시스템 · 영상 프로덕션",
      theme: "#34d399",
      x: 29,
      y: 83,
      w: 36,
      h: 22,
      representative: {
        kind: "building",
        sprite: "house-2.png",
        label: "콘텐츠·디자인 은하",
        stage: "일부 입장가능"
      },
      members: [
        {
          slug: "trubins-vd",
          group: "studio",
          status: "open",
          link: "https://drive.google.com/drive/folders/16JMXhJDQXnXAU25yAsdQzRe00YRrEjZr?hl=ko",
          label: "트루빈스 VD",
          hook: "누적 17.18억 매출 — 2년 연속 KPI 초과의 제안 PM.",
          stage: "포트폴리오 자료 (Google Drive)",
          domains: ["designtool"],
          evidenceAxes: {
            problem: "B2B 영상·콘텐츠 제안은 리드타임과 수주율 싸움 — 제안서 완성 5일은 병목.",
            decision: "LLM 기반 리서치·레퍼런스·초안 구조화 사이클로 제안 프로세스 재설계. 5개 직군(디자이너·PD·AE·개발자) 협업 라이프사이클 단독 책임.",
            result: "[실측] 제안서 5일→2일 단축. 누적 매출 17.18억 원, KPI 2년 연속 초과(2022 155%·2023 121%). 2024는 9월 퇴사로 부분연도(초과 미포함)."
          },
          details: [
            "PM 총 성과 1,718,731,531원 (2년 6개월)",
            "2022 개인 KPI 3억 — 155% 달성 · 2023 개인 KPI 7억 — 121% 달성 · 2024 10억 — 40% (9월 퇴사, 부분연도)",
            "전략 수립·가설 검증·리서치 → AI 페르소나 시뮬레이션으로 BM·이벤트 반응 사전 검증으로 확장",
            "데이터 기반 B2C·B2B 콘텐츠 기획 → Pandas+LLM 하이브리드로 정량(D1/D7·ARPPU)·정성(유저 심리) 결합 의사결정 구조 설계",
            "디자인·개발·사업·영업 크로스 협업 → FE·BE·AI 3개 직군 팀장으로 협업 리드 (Java Spring Boot · Python FastAPI · React/Vite)",
            "Office·Figma 문서/와이어프레임 기획 → AI 에이전트 6종(HC 운영·기획 검증·페르소나 수집·라이브 운영·법률 검토·글로벌 사업성) 명세서 직접 작성·구현"
          ],
          resumeSlug: "vd-content-video"
        },
        {
          slug: "writing",
          group: "studio",
          status: "open",
          link: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&x_csa=%7B%22fromUi%22%3A%22kb%22%7D&pkid=1&os=36344656&qvt=0&query=%EC%9E%91%EA%B0%80%20%EC%9D%B4%EC%A3%BC%ED%98%95",
          label: "글 작가 활동",
          hook: "장편소설 「초파리」·동화 5편 출간 — 5년의 집필, 내러티브 설계의 원천.",
          stage: "네이버 인물 등록 작가",
          domains: ["content"],
          details: [
            "장편소설 「초파리」 출간 (2024.10–2025.02, 핌) — 복학생 '현수'가 비트코인을 접하며 겪는 사건. 청년 문제와 코인을 결합한 서사",
            "동화 「선글라스」 외 4편 출간 (2022.04–2022.11, 풍경놀이터)",
            "동화에세이 「별로 간 소년」 출간 (2021.09–2021.11, 풍경놀이터) — 청년농인 동화에세이 수록",
            "카카오 브런치 에세이 정기 연재 (2021.11–2022.11) — 브런치 작가 등록"
          ],
          resumeSlug: "writing"
        },
        {
          slug: "vds",
          group: "studio",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/VDS/",
          label: "VDS (Vibe Design Studio)",
          hook: "디자인 시스템을 골라 복붙 한 번이면 끝 — 바이브 코더를 위한 스튜디오.",
          stage: "작동(공개 도구)",
          recent: true,
          domains: ["designtool"],
          evidenceAxes: {
            problem: "바이브 코더용 디자인 시스템",
            decision: "6페이지 도구·카탈로그/프리셋/효과 DB",
            result: "공개 도구 배포"
          },
          teaser: "디렉토리 38·카탈로그 77·프리셋 33·효과 66 — 복붙 DESIGN.md."
        }
      ]
    },
    {
      id: "hall",
      label: "어바웃 코어",
      status: "construction",
      mapLabel: "어바웃",
      subLabel: "일하는 원칙 · 경력",
      theme: "#f4a261",
      x: 71,
      y: 83,
      w: 36,
      h: 22,
      representative: {
        kind: "building",
        sprite: "house-1.png",
        label: "어바웃 코어",
        stage: "일부 입장가능"
      },
      members: [
        {
          slug: "sim-thesis",
          group: "hall",
          status: "construction",
          link: "",
          label: "시뮬레이션 통합",
          hook: "어바웃 코어 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "sub-brain-os",
          group: "hall",
          status: "open",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas",
          label: "sub-brain 지식 OS (Learning Atlas)",
          hook: "이 포트폴리오를 만든 시스템 — 매주 스스로 갱신되는 공개 지식 그래프.",
          stage: "운영 중(매주 자동 갱신)",
          domains: ["agent"],
          evidenceAxes: {
            problem: "학습이 채팅창에서 휘발되고 개인 노트는 재사용이 안 됨 — 공개하자니 로컬 경로·API 키·실명 누출 위험이 발행을 막음.",
            decision: "개인 지식그래프(Sub-brain)를 graph-native로 공개 발행 — [[wikilink]]→상대링크 2-pass 변환·자동 인덱스 파이프라인. 공개 전 누출 탐지·차단 HARD 백스톱(로컬 경로·API 키·실명/이메일) + 4중 안전검증(원격 부재·공개트리 0·visibility·소스 무수정).",
            result: "약 182편 공개 운영(매주 자동 갱신)·누출 0. '이 포트폴리오를 만든 시스템' 자체가 메타 자산."
          },
          teaser: "graph-native·누출게이트·RSI 거버넌스 — 182편·누출 0."
        }
      ]
    },
    {
      id: "board",
      label: "학습 은하",
      status: "board",
      mapLabel: "학습",
      subLabel: "지식 그래프 · 주간 갱신",
      theme: "#60a5fa",
      x: 87,
      y: 18,
      w: 20,
      h: 28,
      representative: {
        kind: "sign",
        sprite: "sign-1.png",
        label: "학습 은하",
        stage: "Learning Atlas"
      },
      atlas: {
        label: "Learning Atlas 전체 보기",
        link: "https://github.com/ljhljh0703-cmd/learning-atlas",
        note: "공개 학습 노트를 모아 둔 지식 허브"
      },
      learningCards: [
        {
          slug: "derived-ledger-discipline",
          tag: "도구",
          title: "파생 원장 규율",
          date: "2026-07-20",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/methods/derived-ledger-discipline.md",
          hook: "원본에서 뽑은 파생물을 권위로 쓸 때 커버리지·생성기·반증 절차를 요구하는 검증 규율"
        },
        {
          slug: "handdraw-story-video",
          tag: "디자인",
          title: "Handdraw Story Video",
          date: "2026-07-19",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/techniques/handdraw-story-video.md",
          hook: "컬러 원화에서 잉크 선을 추출하고 선·채색 wipe 타임라인으로 숏폼 서사를 만드는 레시피"
        },
        {
          slug: "styleseed",
          tag: "디자인",
          title: "StyleSeed",
          date: "2026-07-19",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/methods/styleseed.md",
          hook: "디자인을 고정 룩이 아니라 job별 문법·레퍼런스 컴파일러·픽셀 게이트로 다루는 방법론"
        },
        {
          slug: "ontology-design-primer",
          tag: "도구",
          title: "온톨로지 설계 입문",
          date: "2026-07-19",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/methods/ontology-design-primer.md",
          hook: "인물·세력·장소를 엔티티와 관계로 나눠 이야기 세계를 질의 가능한 구조로 만드는 레슨"
        },
        {
          slug: "12-factor-agents",
          tag: "하네스",
          title: "12-Factor Agents",
          date: "2026-07-18",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/techniques/12-factor-agents.md",
          hook: "LLM 앱에서 프롬프트·컨텍스트·제어흐름을 개발자가 소유해야 한다는 프로덕션 원칙 정리"
        },
        {
          slug: "cerebras-knowledge-base",
          tag: "하네스",
          title: "Cerebras Knowledge Base",
          date: "2026-07-18",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/techniques/cerebras-knowledge-base.md",
          hook: "full-text·vector·IDF·age-decay를 RRF로 융합하는 실전 지식베이스 검색 레시피"
        },
        {
          slug: "deep-document-understanding-deepdoc",
          tag: "AI·LLM",
          title: "Deep Document Understanding",
          date: "2026-07-18",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/methods/deep-document-understanding-deepdoc.md",
          hook: "검색 전에 OCR·레이아웃·표 구조를 보존해 설명 가능한 청크를 만드는 수집축 메모"
        }
      ],
      members: []
    }
  ]
};

if (typeof window !== "undefined") {
  window.VILLAGE_RESUME_CONFIG = VILLAGE_RESUME_CONFIG;
}

if (typeof module !== "undefined") {
  module.exports = VILLAGE_RESUME_CONFIG;
}
