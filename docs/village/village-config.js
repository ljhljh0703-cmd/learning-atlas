// 마을 이력서의 건물, 작업, 링크 정본 config입니다.
const VILLAGE_RESUME_CONFIG = {
  resumeHref: "./Resume_LeeJuHyeong.html",
  intro: {
    title: "주형 월드",
    copy: "주형 월드에 오신 걸 환영합니다. 건물을 눌러 작업을 둘러보세요.",
    note: "건물을 누르면 그 안의 작업을 볼 수 있어요."
  },
  onboarding: {
    storageKey: "jw_seen_intro",
    iconsReady: true,
    entry: {
      title: "주형 월드에 오신 걸 환영해요",
      body: "여긴 제가 AI와 함께 일하는 방식을 직접 걸어보는 마을이에요. 건물마다 실제 프로젝트가 있고, 다 둘러보면 제가 무엇을 할 수 있는 사람인지 한눈에 정리돼요.",
      startLabel: "체험 시작",
      skipLabel: "바로 둘러보기"
    },
    steps: [
      {
        id: "sub-brain",
        icon: "./assets/tutorial/sub-brain.png",
        title: "① Sub-brain — 제 지식을 굴리는 엔진",
        body: "공부하고 결정한 걸 흩어두지 않고 하나의 지식 그래프로 운영해요. 검증하는 엔진과 기록하는 엔진의 역할을 나누고, 충돌이 나면 단일 기준(SSOT)으로 정리해요. 이 마을의 게시판이 그 지식이 밖으로 나온 창구예요.",
        anchor: {
          label: "게시판에서 실제로 보기",
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
        body: "AI가 준 산출을 바로 수용하지 않아요. 경로·검증 노트·해시를 묶은 증거 꾸러미로 포장해, 기계가 자동으로 볼 수 있는 검사와 사람의 판단을 나눠서 통과시켜요. 이 마을도 그렇게 검증하고 붙였어요.",
        ctaLabel: "마을 둘러보기 시작",
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
      label: "입구/광장",
      status: "landmark",
      mapLabel: "입구",
      theme: "#7a1f2d",
      x: 50,
      y: 50,
      w: 24,
      h: 14,
      representative: {
        kind: "plaza",
        sprite: "water-fountain.png",
        label: "입구/광장",
        stage: "안내"
      },
      members: []
    },
    {
      id: "lab",
      label: "평가·RAG 연구소",
      status: "hero",
      mapLabel: "연구소",
      theme: "#566978",
      x: 42,
      y: 19,
      w: 52,
      h: 24,
      representative: {
        kind: "building",
        sprite: "business-building.png",
        label: "평가·RAG 연구소",
        stage: "입장가능"
      },
      members: [
        {
          slug: "bookemon",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/AI-Book-Curation/portfolio.html",
          label: "북켓몬",
          hook: "추천 수식 직접 설계·ablation 검증 (Precision 97.8%)",
          stage: "입장가능",
          evidenceAxes: {
            problem: "추천 작업",
            decision: "추천 수식 직접 설계·ablation 검증",
            result: "Precision 97.8%"
          }
        },
        {
          slug: "medical-chatbot",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/Medical-Chatbot/portfolio.html",
          label: "의료 자문 챗봇",
          hook: "RAG 정공법 + 3원 통제 (EM 0.71·BERT 0.73)",
          stage: "입장가능",
          evidenceAxes: {
            problem: "의료 자문 챗봇",
            decision: "RAG 정공법 + 3원 통제",
            result: "EM 0.71·BERT 0.73"
          }
        },
        {
          slug: "starlink",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/StarLink/portfolio.html",
          label: "StarLink",
          hook: "실시간 통역·보청기 라우팅 (작동 프로토타입)",
          stage: "작동 프로토타입",
          evidenceAxes: {
            problem: "실시간 통역·보청기 라우팅",
            decision: "작동 프로토타입",
            result: "요약 준비 중"
          }
        }
      ]
    },
    {
      id: "workshop",
      label: "에이전트 공방",
      status: "construction",
      mapLabel: "공방",
      theme: "#7c532e",
      x: 21,
      y: 51,
      w: 30,
      h: 42,
      representative: {
        kind: "building",
        sprite: "house-3.png",
        label: "에이전트 공방",
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
          stage: "공사중"
        },
        {
          slug: "pm-agent",
          group: "workshop",
          status: "construction",
          link: "",
          label: "PM-Agent",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "policy-axis",
          group: "workshop",
          status: "construction",
          link: "",
          label: "POLICY-AXIS",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "mapae",
          group: "workshop",
          status: "construction",
          link: "",
          label: "Mapae",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "agentforge",
          group: "workshop",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/agent-forge/portfolio.html",
          label: "AgentForge",
          hook: "AI 게임 스튜디오 — Codex CLI 오케스트레이션 (작동 프로토타입)",
          stage: "작동 프로토타입",
          evidenceAxes: {
            problem: "AI 게임 생성 파이프라인",
            decision: "Codex CLI 오케스트레이션·self-contained 배포",
            result: "브라우저 플레이 게임 2종 (작동 프로토타입)"
          }
        },
        {
          slug: "hyunsubot",
          group: "workshop",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/hyunsoo-bot/portfolio.html",
          label: "현수봇",
          hook: "재귀개선 자동매매 (model+harness) · dry-run 기본·실 P&L 미주장",
          stage: "dry-run",
          evidenceAxes: {
            problem: "자동매매 재귀개선 (model+harness)",
            decision: "RSI 루프·dry-run eval",
            result: "dry-run eval 100% (실 P&L 미주장)"
          }
        }
      ]
    },
    {
      id: "game",
      label: "AI 게임존",
      status: "construction",
      mapLabel: "게임",
      theme: "#605e9c",
      x: 78,
      y: 51,
      w: 31,
      h: 36,
      representative: {
        kind: "building",
        sprite: "old-coffee-shop.png",
        label: "AI 게임존",
        stage: "일부 입장가능"
      },
      members: [
        {
          slug: "rogueos",
          group: "game",
          status: "construction",
          link: "",
          label: "로그라이크(RogueOS)",
          hook: "AI Game suite 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "hwigi-tower",
          group: "game",
          status: "construction",
          link: "",
          label: "회귀자타워",
          hook: "AI Game suite 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "godot-backroom",
          group: "game",
          status: "construction",
          link: "",
          label: "고돗백룸",
          hook: "AI Game suite 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "rocketdan",
          group: "game",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/ai-npc-social-reasoning-harness/",
          label: "로켓단 (사회추론 시뮬)",
          hook: "늑대인간 LLM NPC 평가 — 탐색적 연구 (N=20)",
          stage: "탐색적 연구 (N=20)",
          evidenceAxes: {
            problem: "사회추론 LLM NPC 평가",
            decision: "늑대인간 시뮬 하네스·N=20 탐색",
            result: "탐색적 연구 (N=20)"
          }
        }
      ]
    },
    {
      id: "studio",
      label: "콘텐츠·디자인 스튜디오",
      status: "construction",
      mapLabel: "스튜디오",
      theme: "#768d4a",
      x: 29,
      y: 83,
      w: 36,
      h: 22,
      representative: {
        kind: "building",
        sprite: "house-2.png",
        label: "콘텐츠·디자인 스튜디오",
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
          stage: "공사중"
        },
        {
          slug: "writing",
          group: "studio",
          status: "construction",
          link: "",
          label: "글 작가 활동",
          hook: "콘텐츠·디자인 스튜디오 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "vds",
          group: "studio",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/VDS/",
          label: "VDS (Vibe Design Studio)",
          hook: "바이브 코더용 디자인 시스템 스튜디오 (공개 도구)",
          stage: "작동(공개 도구)",
          evidenceAxes: {
            problem: "바이브 코더용 디자인 시스템",
            decision: "6페이지 도구·카탈로그/프리셋/효과 DB",
            result: "공개 도구 배포"
          }
        }
      ]
    },
    {
      id: "hall",
      label: "마을 회관 About",
      status: "construction",
      mapLabel: "회관",
      theme: "#7a1f2d",
      x: 71,
      y: 83,
      w: 36,
      h: 22,
      representative: {
        kind: "building",
        sprite: "house-1.png",
        label: "마을 회관 About",
        stage: "일부 입장가능"
      },
      members: [
        {
          slug: "sim-thesis",
          group: "hall",
          status: "construction",
          link: "",
          label: "시뮬레이션 통합",
          hook: "마을 회관 About 공개 준비 중",
          stage: "공사중"
        },
        {
          slug: "sub-brain-os",
          group: "hall",
          status: "open",
          link: "https://github.com/ljhljh0703-cmd/learning-atlas",
          label: "sub-brain 지식 OS (Learning Atlas)",
          hook: "지식그래프(LLM-Wiki) 약 180편 공개 발행·자동 인덱스 (Phase 1 라이브)",
          stage: "Phase 1 라이브"
        }
      ]
    },
    {
      id: "board",
      label: "학습 게시판",
      status: "board",
      mapLabel: "게시판",
      theme: "#3f6b57",
      x: 87,
      y: 18,
      w: 20,
      h: 28,
      representative: {
        kind: "sign",
        sprite: "sign-1.png",
        label: "학습 게시판",
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
