// 주형 유니버스(구 마을 이력서)의 은하, 작업, 링크 정본 config입니다.
// v20 리테마: 표현 레이어(이름·테마색·아이콘)만 변경 — status/link/stage/hook/domains/recent 데이터 불변.
const VILLAGE_RESUME_CONFIG = {
  resumeHref: "./Resume_LeeJuHyeong.html",
  kpiTicker: [
    { text: "최종 운영 조합 Top-5 Precision 100% · Bad Rate 0%", source: "북켓몬" },
    { text: "EM 0.71 · BERTScore 0.73 — 3원 통제 평가", source: "알려줄고양" },
    { text: "dry-run 평가 100% — 실 P&L 무주장", source: "현수봇" },
    { text: "몬테카를로 200판 회피 불가 스폰 0.00%", source: "지켜줘! 젤리 패닉" },
    { text: "학습 노트 182편 공개 · 누출 0", source: "Learning Atlas" }
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
        icon: "./assets/tutorial/sub-brain.png",
        title: "① Sub-brain — 제 지식을 굴리는 엔진",
        body: "공부하고 결정한 걸 흩어두지 않고 하나의 지식 그래프로 운영해요. 검증하는 엔진과 기록하는 엔진의 역할을 나누고, 충돌이 나면 단일 기준(SSOT)으로 정리해요. 이 유니버스의 학습 은하가 그 지식이 밖으로 나온 창구예요.",
        anchor: {
          label: "학습 은하에서 실제로 보기",
          group: "board"
        }
      },
      {
        id: "harness",
        icon: "./assets/tutorial/harness.png",
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
        icon: "./assets/tutorial/gate.png",
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
          hook: "추천 파이프라인 다이어그램 + 룰 ON/OFF ablation 비교표를 60초 안에.",
          stage: "데모(오프라인 평가 완료)",
          domains: ["rag", "recsys", "eval"],
          evidenceAxes: {
            problem: "단순 코사인 유사도 추천의 리텐션 한계, 대규모 유저·도서 매칭의 O(N²) 복잡도 — 정확도와 레이턴시가 동시에 임계점을 넘는 구조.",
            decision: "Qdrant 도입으로 매칭을 O(N·K)로 최적화. 쿼리 변형 4종·리트리버 3종·룰 on/off를 각각 평가해 llm_search_query·dense·룰 재정렬 채택(dense+BM25 RRF는 Top-10/20 급락으로 기각). 선호·대중성·최신성 결합 수식 S_personal 직접 설계, 임베딩은 KURE vs CLOVA 벤치로 선택.",
            result: "[실측] 룰 ablation으로 Top-5 Bad Rate 15.56%→2.22%·Precision 84.44%→97.78%(오프라인 18쿼리). 최종 운영 조합(llm_search_query·dense·룰 재정렬) Top-5 Precision 100%·Bad Rate 0%·평균 지연 577ms. KURE vs CLOVA Precision@50 91.14% vs 90.09%(+590ms). LightFM(test) 긍정 선호 90.52%·비선호 노출 1.45%."
          },
          teaser: "추천 수식을 직접 설계하고 ablation으로 증명한 도서 큐레이션."
        },
        {
          slug: "medical-chatbot",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/Medical-Chatbot/portfolio.html",
          label: "알려줄고양",
          hook: "Mode A/B/C 3원 통제 비교 결과 + RedFlag 안전필터 코드 설계.",
          stage: "데모",
          domains: ["rag", "eval"],
          evidenceAxes: {
            problem: "의료 자문은 오답 비용이 크다 — 생성이 그럴듯한 것만으로는 신뢰할 수 없고, 근거 인용과 응급 상황 차단을 구조로 보장해야 한다.",
            decision: "Qwen2.5-7B를 QLoRA(r=16·4-bit nf4)로 내과 도메인에 적응, Dense+BM25 Hybrid RAG로 근거를 인용. 설계 기여도는 Mode A/B/C 3원 통제 비교로 분리 검증, RedFlag 응급 키워드는 안내문이 아닌 코드(Emergency Exit)로 차단.",
            result: "[실측] 객관식 EM 0.71 · 서술형 BERTScore 0.73. 안전선을 UX 라이팅과 코드 양쪽에 내장."
          },
          teaser: "EM 0.71 · BERTScore 0.73 — 3원 통제로 측정한 의료 RAG."
        },
        {
          slug: "starlink",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/StarLink/portfolio.html",
          label: "StarLink",
          hook: "실기기 통역 데모 + WebRTC 보청기 라우팅 아키텍처 다이어그램.",
          stage: "작동 프로토타입",
          domains: ["realtime"],
          evidenceAxes: {
            problem: "청각장애인에게 외국어 대면 대화는 이중 장벽 — 기존 통역 앱은 폰 화면을 손에 들고 봐야 한다. 화면 없이 보청기로 듣는 핸즈프리 통역이 필요.",
            decision: "Gemini Live가 연속 스트리밍 모델임을 파악해 turn-taking 인프라를 비활성화. LiveKit의 AVAudioSession 리셋을 LKRTCAudioSession 수동 락으로 막아 보청기 라우팅 보존, 재유입 에코는 반이중 마이크 제어(500ms 버퍼)로 차단.",
            result: "13개 디버깅 포스트모템 끝에 번역+음성출력+보청기 라우팅 연속 동작. EN·JA·ZH→KO 3개 언어쌍, MFi 보청기·AirPods·BT 지원. 작동 프로토타입 — 'sub-second 지연'은 설계 목표이며 독립 벤치마크 미수행."
          },
          teaser: "보청기로 듣는 핸즈프리 실시간 통역 — 당사자가 만든 접근성 AI."
        }
      ]
    },
    {
      id: "workshop",
      label: "에이전트 은하",
      status: "construction",
      mapLabel: "에이전트",
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
          hook: "AI 게임 스튜디오 — Codex CLI 오케스트레이션 (작동 프로토타입)",
          stage: "작동 프로토타입",
          recent: true,
          domains: ["agent", "gameai"],
          evidenceAxes: {
            problem: "AI 게임 생성 파이프라인",
            decision: "Codex CLI 오케스트레이션·self-contained 배포",
            result: "브라우저 플레이 게임 2종 (작동 프로토타입)"
          },
          // v22 1차안 — 작가 워싱 예정
          teaser: "생성된 게임 2종을 라이브에서 바로 플레이할 수 있습니다."
        },
        {
          slug: "hyunsubot",
          group: "workshop",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/hyunsoo-bot/portfolio.html",
          label: "현수봇 / QuantLeap",
          hook: "model+harness 아키텍처 다이어그램 + dry-run 백테스트 리포트.",
          stage: "작동 프로토타입 · dry-run",
          recent: true,
          domains: ["agent"],
          evidenceAxes: {
            problem: "LLM에게 매매를 통째로 맡기면 비결정성·환각이 실손실로 직결 — 자율성과 안전성이 상충한다.",
            decision: "판단(LLM·JSON 스키마)과 실행(결정론적 코드)을 분리한 model+harness 구조. 리스크 레이어+HITL 승인을 비협상 안전장치로 두고, 재귀개선 루프가 로그를 분석해 전략을 갱신.",
            result: "[실측·모의] dry-run 평가 100% 통과 — 실 P&L·수익률은 주장하지 않는다(작동 프로토타입). 시크릿은 코드에 0(별도 repo 분리)."
          },
          teaser: "판단은 LLM, 실행은 코드 — dry-run 100%의 자동매매 에이전트."
        },
        {
          slug: "asset-forge",
          group: "workshop",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/codex-asset-forge/",
          label: "Codex Asset Forge",
          hook: "생성 이미지를 게임 자산으로 바꾸는 자동화 파이프라인",
          stage: "케이스스터디 (공개 draft — DRAFT_NOT_ACCEPTED 라벨 유지)",
          domains: ["agent", "gameai"],
          recent: true,
          teaser: "5 atlases · 27 frames · 11/11 ClaudeCraft 스프라이트 렌더 증명."
        }
      ]
    },
    {
      id: "game",
      label: "AI 게임 은하",
      status: "construction",
      mapLabel: "AI 게임",
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
          hook: "7인 늑대인간 시뮬 데모 + 시드 고정 하네스 결과표(RT2.3)를 한 화면에.",
          stage: "탐색 연구 (claim gate 미통과·탐색적 경향)",
          recent: true,
          domains: ["gameai", "eval"],
          evidenceAxes: {
            problem: "LLM NPC의 발화 '그럴듯함'과 실제 사회추론을 분리 검증해야 한다. Werewolf-LLM 계보를 이어받되 인문학 스캐폴드·시드 고정 비교·raw/display 경계·출력 품질 gate를 명시적으로 분리.",
            decision: "발화·여론·수혜자 분석·심문 전략을 NPC의 공개 추론 frame으로 구조화(인문학 기반). 같은 seed·같은 7인 역할 구성에서 baseline vs scaffold를 비교하고, 강한 성능 주장은 claim gate로 통제.",
            result: "최종 RT2.3(N=20)은 품질 통제 하 양의 방향 — strong claim gate 미통과로 일반적 우월성 주장이 아닌 탐색적 경향으로만 보고(정직). 다음 단계: 독립 human annotation·belief-state table·다중 모델 재현."
          },
          teaser: "인문학을 학습한 AI는 늑대인간 게임에서 더 잘 추리할까."
        },
        {
          slug: "hwigi-tower",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/hwigi-tower-portfolio/Docs/Portfolio/hwigi-tower-steam-portfolio.html",
          label: "회귀자는 탑을 오른다",
          hook: "Unity 6 Android 로그라이크 플레이어블 프로토타입 + AI NPC 학습 케이스 (vertical slice)",
          stage: "작동 프로토타입 (playable vertical slice)",
          domains: ["gameai"],
          evidenceAxes: {
            problem: "SLM 도입 시 BPE 토큰 매칭 오류와 비결정적 생성으로 밸런스 시뮬 재현 검증 불가, 지연이 인터랙션 임계점 초과.",
            decision: "EXAONE 3.5 2.4B + QLoRA(r=32·α=64) 대화 학습. Seed 기반 결정론 생성·Deterministic Caching 재현성. Mataios=결정론 동행자(장식 NPC 아님, 플레이어/동행자 행동 분리). ML-Agents=전투 설계 프로브(AttackSpam·SkillSpam 열화 전략 노출→결정론 동행자 정책). 멀티에이전트 생산 파이프라인(clean worktree·evidence gate·아티팩트 SHA·배포검증).",
            result: "플레이어블 Unity 6 Android 프로토타입(루트·이벤트·2인 전투·보상·상점/휴식·보스) → 공개 포폴 HTML·AI NPC 케이스·APK 패키징. 26턴+ 멀티턴 한국어 유지율 100%·BIW 차단·토크나이저 진단 증거. RoguelikeSim headless + RunPolicy 5종 + BalanceMetrics 정량 집계."
          },
          teaser: "SLM 비결정성을 결정론으로 통제한 AI NPC 게임."
        },
        {
          slug: "jelly-panic",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/jelly-panic/",
          label: "지켜줘! 젤리 패닉",
          hook: "\"모든 위협은 예고된다\" — 반사신경 대신 수읽기를 겨루는 순수 JS 퍼즐 디펜스",
          stage: "공개 데모",
          recent: true,
          domains: ["gameai"],
          teaser: "결정론 로직 테스트 90/90 · DOM smoke 16/16 · 몬테카를로 200판 회피 불가 스폰 0.00%."
        },
        {
          slug: "bone-trail",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/bone-trail/",
          label: "Bone Trail (libGDX 로그라이크)",
          hook: "libGDX 로그라이크 (AI Game suite)",
          stage: "공개 데모",
          domains: ["gameai"],
          teaser: "libGDX(Java)로 직접 구현한 로그라이크 — 플레이 빌드·기술 해설 공개."
        },
        {
          slug: "backroom",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/backroom-level-0-godot/portfolio.html",
          label: "BackRoom Level 0 (고돗 백룸)",
          hook: "고돗 백룸 (AI Game suite)",
          stage: "공개 데모",
          domains: ["gameai"],
          teaser: "Godot으로 직접 구현한 백룸 Level 0 — 플레이 빌드·포트폴리오 해설 공개."
        }
      ]
    },
    {
      id: "studio",
      label: "콘텐츠·디자인 은하",
      status: "construction",
      mapLabel: "콘텐츠·디자인",
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
          status: "construction",
          link: "",
          label: "트루빈스 VD",
          hook: "누적 17억 케이스 정리 예정",
          stage: "공사중",
          domains: ["designtool"]
        },
        {
          slug: "writing",
          group: "studio",
          status: "construction",
          link: "",
          label: "글 작가 활동",
          hook: "콘텐츠·디자인 스튜디오 공개 준비 중",
          stage: "공사중",
          domains: ["content"]
        },
        {
          slug: "vds",
          group: "studio",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/VDS/",
          label: "VDS (Vibe Design Studio)",
          hook: "바이브 코더용 디자인 시스템 스튜디오 (공개 도구)",
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
          hook: "지식그래프(LLM-Wiki) 약 180편 공개 발행·자동 인덱스 (Phase 1 라이브)",
          stage: "운영 중(매주 자동 갱신)",
          domains: ["agent"],
          teaser: "graph-native·누출게이트·RSI 거버넌스 — 182편·누출 0."
        }
      ]
    },
    {
      id: "board",
      label: "학습 은하",
      status: "board",
      mapLabel: "학습",
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
          slug: "google-okf-knowledge-format",
          tag: "방법론",
          title: "Google OKF v0.1",
          date: "2026-06-27",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/methods/google-okf-knowledge-format.md",
          hook: "마크다운·frontmatter·링크 그래프 기반 에이전트 지식 표준을 Sub-brain 운영과 대조"
        },
        {
          slug: "codebase-memory-mcp",
          tag: "도구",
          title: "codebase-memory-mcp",
          date: "2026-06-28",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/methods/codebase-memory-mcp.md",
          hook: "코드 레포를 지식 그래프로 인덱싱하는 MCP 서버를 CodeGraph와 대조"
        },
        {
          slug: "agentic-search-grep-vs-vector",
          tag: "기술",
          title: "Grep vs Vector RAG",
          date: "2026-06-28",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas/blob/main/techniques/agentic-search-grep-vs-vector.md",
          hook: "에이전트 검색에서 grep·그래프·하네스 설계가 갖는 의미를 정리"
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
