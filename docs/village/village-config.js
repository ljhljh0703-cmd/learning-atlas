// 마을 이력서의 건물, 작업, 링크 정본 config입니다.
const VILLAGE_RESUME_CONFIG = {
  resumeHref: "./Resume_LeeJuHyeong.html",
  intro: {
    title: "주형 월드",
    copy: "주형 월드에 오신 걸 환영합니다. 건물을 눌러 작업을 둘러보세요.",
    note: "건물을 누르면 그 안의 작업을 볼 수 있어요."
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
          stage: "입장가능"
        },
        {
          slug: "medical-chatbot",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/Medical-Chatbot/portfolio.html",
          label: "의료 자문 챗봇",
          hook: "RAG 정공법 + 3원 통제 (EM 0.71·BERT 0.73)",
          stage: "입장가능"
        },
        {
          slug: "starlink",
          group: "lab",
          status: "open",
          link: "https://ljhljh0703-cmd.github.io/StarLink/portfolio.html",
          label: "StarLink",
          hook: "실시간 통역·보청기 라우팅 (작동 프로토타입)",
          stage: "작동 프로토타입"
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
        stage: "공사중"
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
          status: "construction",
          link: "",
          label: "AgentForge",
          hook: "Game-PM suite 윤곽 공개 준비 중",
          stage: "공사중"
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
        stage: "공사중"
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
          slug: "hyunsubot",
          group: "game",
          status: "construction",
          link: "",
          label: "현수봇",
          hook: "dry-run 기본·실 P&L 미주장",
          stage: "dry-run"
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
        stage: "공사중"
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
