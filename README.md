# Learning Atlas

> **한 사람의 학습을 카탈로그가 아니라 지식 그래프로 운영하는 공개 허브.** 노트가 노드, 링크가 엣지다.
> 모든 글은 비공개 second-brain(Obsidian vault)에서 **누출 게이트를 통과한 것만** 공개 repo로 단방향 export 된다.
> 정제·게이트 파이프라인은 [`tools/`](tools/)에 전부 공개해 뒀다. 무엇을 어떻게 거르는지 숨기지 않는다.

**182편** · Techniques 80 · Methods 100 · 경험 서사 2

## 🔬 Techniques

*논문 · 아키텍처 · 알고리즘 · 연구 기법* — 80편

### 🎮 게임 · 로그라이크 · NPC AI <sub>23편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [DCSS(Dungeon Crawl Stone Soup) 던전 디자인 — 다층·위험보상·함정·상호작용](techniques/dcss-dungeon-design.md) | https://github.com/crawl/crawl | 2026-06-22 |
| [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](techniques/woc-ai-gamedev-teardown.md) | https://github.com/levy-street/world-of-claud… | 2026-06-22 |
| [Nemotron-Personas-Korea — 활용 레포트](techniques/nemotron-personas-korea.md) | https://huggingface.co/datasets/nvidia/Nemotr… | 2026-06-17 |
| [Werewolf LLM (Xu et al. 2023, Tsinghua)](techniques/werewolf-llm.md) | https://github.com/xuyuzhuang11/Werewolf | 2026-06-16 |
| [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](techniques/dijkstra-maps.md) |  | 2026-06-10 |
| [DVM — 추론/결정/발화 분리형 소셜추론 NPC 결정 체인](techniques/dvm-decision-chain-npc.md) |  | 2026-06-10 |
| [Mini-Mafia — 기만/탐지/폭로 분해 벤치마크 + NPC 기만 데이터셋](techniques/mini-mafia-benchmark.md) |  | 2026-06-10 |
| [적 아키타입 디자인 패턴 — "스탯 묶음"이 아니라 "전술 질문"](techniques/enemy-archetype-design-patterns.md) |  | 2026-06-08 |
| [SPD UI Clean-Room — 5개 클래스의 *역할*만](techniques/spd-ui-clean-room.md) |  | 2026-06-08 |
| [Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준](techniques/berlin-interpretation.md) |  | 2026-06-07 |
| [Cellular Automata 동굴 생성 (+ BSP 합성) — 정합성 보장형 격자 지형](techniques/cellular-automata-bsp-mapgen.md) |  | 2026-06-07 |
| [Data-Oriented Design & Flecs — 컴포넌트를 조밀 배열로 정렬하는 ECS](techniques/ecs-data-oriented-design.md) |  | 2026-06-07 |
| [적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](techniques/enemy-decision-making.md) |  | 2026-06-07 |
| [Recursive Shadowcasting — 격자 로그라이크 FOV 의 표준](techniques/fov-recursive-shadowcasting.md) |  | 2026-06-07 |
| [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](techniques/slm-dynamic-content-generation.md) |  | 2026-06-07 |
| [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](techniques/unpredictability-of-gameplay.md) |  | 2026-06-07 |
| [Unity ML-Agents — Unity 환경을 RL 학습장으로 쓰는 오픈 툴킷](techniques/unity-ml-agents.md) | https://github.com/Unity-Technologies/ml-agents | 2026-05-23 |
| [Study: Mathaios - The Brevity-First NPC Case](techniques/mathaios-study.md) |  | 2026-05-08 |
| [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](techniques/clever-hans-ntom.md) |  | 2026-04-25 |
| [Mafia Game Refinement (Ri et al. 2022, JAIST)](techniques/mafia-game-refinement.md) |  | 2026-04-25 |
| [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](techniques/role-llm.md) |  | 2026-04-25 |
| [Generative Agents (Park et al. 2023) — AI NPC의 성경](techniques/generative-agents.md) |  | 2026-04-24 |
| [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](techniques/emotion-models-circumplex-pad.md) | https://en.wikipedia.org/wiki/PAD_emotional_s… | 2026-04-22 |

### 🤖 에이전트 하네스 · 자가개선 <sub>8편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [GBrain — 개인 AI 지식 브레인 production 정본](techniques/gbrain.md) | https://github.com/garrytan/gbrain | 2026-06-17 |
| [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](techniques/goose-agent-harness.md) | https://github.com/aaif-goose/goose | 2026-06-17 |
| [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](techniques/hermes-agent.md) |  | 2026-06-17 |
| [Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](techniques/jawcode.md) | https://github.com/lidge-jun/jawcode | 2026-06-17 |
| [Oh My OpenAgent (OmO) — opencode 위 하네스 레이어](techniques/oh-my-openagent.md) | https://github.com/code-yeongyu/oh-my-openagent | 2026-06-17 |
| [opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](techniques/opencode-agent-harness.md) | https://github.com/sst/opencode | 2026-06-17 |
| [Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](techniques/ralph.md) | https://github.com/snarktank/ralph | 2026-06-17 |
| [에이전트 스크립트 해체 — steipete/agent-scripts](techniques/agent-scripts.md) |  | 2026-06-13 |

### 🧠 AI · LLM 연구 <sub>28편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [MLXP — Kubernetes LLM Serving 최적화 (NAVER, 정지윤·장혁진)](techniques/mlxp-k8s-llm-serving.md) | MLXP - Kubernetes LLM Serving 최적화 기술 도입기 | 2026-06-18 |
| [Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)](techniques/emergence-world.md) | https://github.com/EmergenceAI/Emergence-World | 2026-06-17 |
| [geobench — GEO 가시성 벤치마크 (측정 엄밀성 정본)](techniques/geobench.md) | https://github.com/NomaDamas/geobench | 2026-06-17 |
| [MiroFish + OASIS — 거대 시뮬레이션 세계 reference architecture](techniques/mirofish-oasis.md) | https://github.com/666ghj/MiroFish | 2026-06-17 |
| [Singulari-Tea Codex — LLM 서사 시뮬레이션 아키텍처 사례](techniques/singulari-tea-codex.md) | https://github.com/lemos999/Singulari-Tea-Cod… | 2026-06-17 |
| [Understand-Anything — Karpathy-wiki→그래프 플러그인 (graphify 비교)](techniques/understand-anything.md) | https://github.com/Egonex-AI/Understand-Anything | 2026-06-17 |
| [SubQ 및 SSA 아키텍처: 초거대 컨텍스트의 실현 (Subquadratic Intelligence)](techniques/subq-ssa-architecture.md) | https://subq.ai/introducing-subq | 2026-06-16 |
| [MinSync — 증분 벡터 인덱싱 기법 (경량 흡수 + 응용 대비 기록)](techniques/minsync-incremental-indexing.md) | https://github.com/NomaDamas/MinSync | 2026-06-15 |
| [Teaching Claude Why — 에이전트 정렬을 위한 헌법적 이유(Deliberation) 교육](techniques/teaching-claude-why.md) | https://www.anthropic.com/research/teaching-c… | 2026-06-14 |
| [Recursive Self-Improvement — "When AI builds itself" (Anthropic)](techniques/recursive-self-improvement.md) | https://www.anthropic.com/institute/recursive… | 2026-06-09 |
| [Toolformer: Language Models Can Teach Themselves to Use Tools (Schick et al. 2023)](techniques/toolformer-api-call-insertion.md) |  | 2026-06-07 |
| [Brain-inspired Warm-up (Cheon et al., 2026)](techniques/brain-inspired-warmup.md) |  | 2026-05-03 |
| [CocoIndex — Incremental Data Pipeline for AI Agents](techniques/cocoindex.md) | https://github.com/cocoindex-io/cocoindex | 2026-05-03 |
| [eLLM — CPU 만으로 GPU 보다 빠른 long-context LLM 추론](techniques/ellm.md) | https://github.com/lucienhuangfu/eLLM | 2026-05-03 |
| [GPT-5.5 Cyber Capabilities Evaluation — UK AISI 보고서](techniques/gpt55-cyber-capabilities.md) | https://www.aisi.gov.uk/blog/our-evaluation-o… | 2026-04-30 |
| [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](techniques/graphrag.md) | https://github.com/microsoft/graphrag | 2026-04-28 |
| [OASIS: Open Agent Social Interaction Simulations with One Million Agents](techniques/oasis.md) | https://github.com/camel-ai/oasis | 2026-04-28 |
| [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](techniques/zep-graphiti.md) | https://arxiv.org/abs/2501.13956 | 2026-04-28 |
| [AI Scientist v1 + v2 — 자율 과학 연구 에이전트 (정식 논문 학습)](techniques/ai-scientist-paper.md) |  | 2026-04-25 |
| [LLM in a Flash (Alizadeh et al. 2023, Apple)](techniques/llm-in-a-flash.md) |  | 2026-04-25 |
| [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](techniques/sakana-ai-scientist.md) | https://www.chosun.com/english/industry-en/20… | 2026-04-24 |
| [Activation Steering — 추론 시점 행동 조작](techniques/activation-steering.md) | https://arxiv.org/abs/2312.06681 | 2026-04-22 |
| [Emotion Concepts and their Function in a Large Language Model](techniques/anthropic-emotions-2026.md) | https://transformer-circuits.pub/2026/emotion… | 2026-04-22 |
| [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](techniques/anthropic-model-welfare.md) | https://www.anthropic.com/research/exploring-… | 2026-04-22 |
| [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](techniques/persona-vectors-2025.md) | https://www.anthropic.com/research/persona-ve… | 2026-04-22 |
| [Taking AI Welfare Seriously — Layer 0의 학술 토대](techniques/taking-ai-welfare-seriously.md) | https://arxiv.org/abs/2411.00986 | 2026-04-22 |
| [Parcae — Stable Looped Language Models](techniques/parcae-looped-lm.md) | https://github.com/sandyresearch/parcae | 2026-04-21 |
| [Gemini Agentic RAG & Sufficient Context Implementation](techniques/gemini-agentic-rag.md) |  |  |

### 🎨 디자인 · 프론트엔드 <sub>18편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [PerfectPixel Studio — AI × 결정론적 후처리 스프라이트 파이프라인](techniques/perfectpixel-sprite-pipeline.md) | https://github.com/gykim80/perfectpixel-studio | 2026-06-22 |
| [Apple 디자인 역분석 — 왜 좋아하나 · 어떻게 내게 적용하나 · 무엇을 더할까](techniques/apple-design-teardown.md) | https://www.apple.com/kr/iphone-17-pro/ | 2026-06-19 |
| [Awesome Design MD — DESIGN.md(Google Stitch) 포맷 + 55 실사이트 시스템](techniques/awesome-design-md-teardown.md) | https://github.com/VoltAgent/awesome-design-md | 2026-06-19 |
| [Brand Tone References (아카이브 — 검증 토큰값)](techniques/brand-tone-references.md) | https://github.com/VoltAgent/awesome-design-md | 2026-06-17 |
| [text-to-lottie — 에이전트 Lottie 생성 하네스 (diffusion studio)](techniques/text-to-lottie.md) | https://github.com/diffusionstudio/lottie | 2026-06-17 |
| [광고·영상 제작 파이프라인 (실전)](techniques/ad-video-production-pipeline.md) | https://github.com/alexmcdonnell-airtable/hyp… | 2026-06-16 |
| [Brand Identity Generation — 3-route 방법론](techniques/brand-identity-generation.md) | https://github.com/alexmcdonnell-airtable/hyp… | 2026-06-16 |
| [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](techniques/editorial-grid-design-canon.md) | https://github.com/alexmcdonnell-airtable/hyp… | 2026-06-16 |
| [HTML PPT Studio (html-ppt) — 현행 teardown](techniques/html-ppt-studio-teardown.md) | https://github.com/lewislulu/html-ppt-skill | 2026-06-16 |
| [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](techniques/hyperframes.md) | https://github.com/heygen-com/hyperframes | 2026-06-16 |
| [NYT-discipline Data Visualization](techniques/nyt-data-viz.md) | https://github.com/alexmcdonnell-airtable/hyp… | 2026-06-16 |
| [PerfectPixel Studio — AI 스프라이트 후처리 파이프라인 해체](techniques/perfectpixel-studio.md) | https://github.com/gykim80/perfectpixel-studio | 2026-06-15 |
| [디자인 해체 — designlang.app 랜딩 페이지 (Landing Teardown)](techniques/designlang-app-teardown.md) |  | 2026-06-13 |
| [충실 추출 — Manavarya09/design-extract (designlang)](techniques/design-extract.md) | https://github.com/Manavarya09/design-extract | 2026-06-10 |
| [픽셀아트 게임 에셋 제작 심화](techniques/pixel-art-game-assets.md) |  | 2026-06-09 |
| [Comnyang 랜딩 Teardown — "무라이브러리 모션" 아키텍처](techniques/comnyang-landing-teardown.md) |  | 2026-06-08 |
| [픽셀아트 제작 기법 + 연구](techniques/pixel-art-techniques.md) |  | 2026-06-08 |
| [getdesign.md AI 디자인 시스템 분석 보고서](techniques/getdesign-teardown.md) |  |  |

### 🧰 도구 · 방법론 <sub>3편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [Anthropic 데이터 자동화 및 스킬 아키텍처 분석](techniques/anthropic-automation-teardown.md) |  | 2026-06-14 |
| [deep-interview 해체분석 및 Sub-brain 이식 전략](techniques/deep-interview.md) |  | 2026-06-14 |
| [헤드룸 해체 및 Sub-brain 응용/강화 전략 — headroom-ai (chopratejas/headroom)](techniques/headroom-teardown.md) | https://github.com/chopratejas/headroom | 2026-06-13 |

## 🛠️ Methods

*도구 · 워크플로우 · 방법론 · 스킬* — 100편

### 🎮 게임 · 로그라이크 · NPC AI <sub>3편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](methods/automated-playtesting-shooterbot.md) |  | 2026-06-07 |
| [Claude Code Game Studios — Claude Code 를 게임 스튜디오로 변환하는 49 agent 템플릿](methods/claude-code-game-studios.md) | https://github.com/Donchitos/Claude-Code-Game… | 2026-05-03 |
| [Codex Game Dev Pipeline Lessons](methods/codex-game-dev-pipeline-lessons.md) |  |  |

### 🤖 에이전트 하네스 · 자가개선 <sub>32편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [Matt Pocock의 에이전틱 워크플로우 (하네스 공학)](methods/matt-pocock-agentic-workflow.md) | https://www.aihero.dev/ | 2026-06-22 |
| [FableCodex — Fable 규율을 Codex 워크플로우로 구현한 플러그인](methods/fablecodex.md) | https://github.com/baskduf/FableCodex | 2026-06-21 |
| [하네스 이력 — Harness History](methods/harness-history.md) |  | 2026-06-21 |
| [지식 하네스 레지스트리 — Knowledge Harness Registry](methods/knowledge-harness-registry.md) |  | 2026-06-21 |
| [agbrowse](methods/agbrowse.md) | https://github.com/lidge-jun/agbrowse | 2026-06-19 |
| [Autoresearch — Karpathy의 자동 연구 루프](methods/autoresearch-karpathy.md) | https://github.com/karpathy/autoresearch | 2026-06-18 |
| [AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)](methods/autoresearch-llhls-abr.md) | AI 에이전트가 코드를 실험하고 개선하는 법 | 2026-06-18 |
| [스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](methods/spec-to-prompt-closed-loop.md) | 스펙만 바꾸면 프롬프트가 따라옵니다 - 답변 생성 모델 자동화 파이프라인 | 2026-06-18 |
| [Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)](methods/factory-ai.md) | https://docs.factory.ai/welcome | 2026-06-17 |
| [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](methods/gnosis-self-improving-agent.md) | https://www.youtube.com/watch?v=73H_ZCxbH7o | 2026-06-17 |
| [Loop Engineering (Addy Osmani) — 하네스 위 한 층, 스케줄 발동 loop (vault 수렴 ground-truth #6)](methods/loop-engineering.md) | https://addyosmani.com/blog/loop-engineering/ | 2026-06-17 |
| [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](methods/playwright-e2e-agent-harness.md) | https://www.youtube.com/watch?v=wo0Rsh9hlTo | 2026-06-17 |
| [Ponytail — "게으른 시니어 개발자"를 13개 코딩 에이전트에 이식하는 portable behavioral skill](methods/ponytail.md) | https://github.com/DietrichGebert/ponytail | 2026-06-17 |
| [The New SDLC With Vibe Coding (Google / Addy Osmani)](methods/google-new-sdlc-vibe-coding.md) | https://drive.google.com/file/d/1wNEl8FMpTso8… | 2026-06-16 |
| [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](methods/karpathy-guidelines.md) | https://github.com/forrestchang/andrej-karpat… | 2026-06-16 |
| [Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](methods/ml-intern.md) | https://github.com/huggingface/ml-intern | 2026-06-16 |
| [Ouroboros — Spec-First Agent OS](methods/ouroboros.md) | https://github.com/Q00/ouroboros | 2026-06-16 |
| [Superpowers 해체분석 (obra/superpowers)](methods/superpowers-teardown.md) | https://github.com/obra/superpowers | 2026-06-16 |
| [Claude Code 런타임 내부 (Layer C)](methods/claude-code-runtime-internals.md) | https://code.claude.com/docs/en/ | 2026-06-15 |
| [Dynamic Workflows — 작업마다 하네스 (Claude Code)](methods/dynamic-workflows-harness.md) | https://claude.com/blog/a-harness-for-every-t… | 2026-06-15 |
| [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](methods/forge-spec-gate.md) | https://github.com/SihyeonJeon/why-was-fable-… | 2026-06-15 |
| [Fable 5 프롬프팅 (공식 가이드)](methods/fable-5-prompting.md) | https://platform.claude.com/docs/ko/build-wit… | 2026-06-13 |
| [GOAL 프레임워크와 에이전트 OS 아키텍처 (GOAL Framework & AIOS)](methods/goal-framework-ops.md) |  | 2026-06-13 |
| [pi 코딩 에이전트 CLI](methods/pi-coding-agent.md) | https://github.com/earendil-works/pi/tree/mai… | 2026-05-27 |
| [CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](methods/codegraph.md) | https://github.com/colbymchenry/codegraph | 2026-05-24 |
| [고성능 AI 오케스트레이션 및 명령 표준 (Advanced Orchestration)](methods/advanced-ai-orchestration.md) |  | 2026-05-05 |
| [Harness AI 스타터팩: 에이전트 설계 표준 (Starter Pack)](methods/harness-starter-pack.md) |  | 2026-05-05 |
| [browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness](methods/browser-harness.md) | https://github.com/browser-use/browser-harness | 2026-05-03 |
| [DOT Studio + Dance of Tal — Figma-style Choreography for AI Agents](methods/dot-studio.md) | https://github.com/dance-of-tal/dot-studio | 2026-05-03 |
| [OpenAI Codex CLI — 로컬 에이전틱 코딩 엔진](methods/openai-codex-cli.md) | https://github.com/openai/codex | 2026-04-30 |
| [Codex CLI Prompting — 내재화 노트](methods/codex-cli-prompting.md) | https://developers.openai.com/cookbook/exampl… | 2026-04-28 |
| [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](methods/everything-claude-code.md) | https://github.com/affaan-m/everything-claude… | 2026-04-24 |

### 🧠 AI · LLM 연구 <sub>12편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [insane-search 해체 분석 — 포기를 모르는 웹 접근 아키텍처](methods/insane-search.md) | https://github.com/fivetaku/insane-search | 2026-06-21 |
| [codebase-memory-mcp](methods/codebase-memory-mcp.md) | https://github.com/DeusData/codebase-memory-mcp | 2026-06-20 |
| [llm-wiki (fivetaku)](methods/llm-wiki.md) | https://github.com/fivetaku/llm-wiki | 2026-06-20 |
| [Academic Research Skills (ARS) — 작가 거버넌스·검증 철학의 학술논문 도메인 쌍둥이](methods/academic-research-skills.md) | https://github.com/imbad0202/academic-researc… | 2026-06-18 |
| [Graph DB / Neo4j — 지식 누적 노트 (학습 진행형)](methods/graph-db-neo4j.md) | https://neo4j.com/docs/ | 2026-06-18 |
| [시뮬레이션 구축 Building Blocks (체크리스트)](methods/simulation-building-blocks.md) |  | 2026-06-17 |
| [Agent Sim/Ops Patterns (vault-adjacent)](methods/agent-sim-ops-patterns.md) | https://github.com/alexmcdonnell-airtable/hyp… | 2026-06-16 |
| [Zotero + NotebookLM 통합 제안 검증 archive](methods/zotero-notebooklm-eval.md) | 작가 발화 "차세대 LLM Wiki 시스템 고도화 제안서" | 2026-06-16 |
| [SCA-Gate & Spike 1A RAG Failure Defense Specification](methods/sca-gate-specification.md) |  | 2026-06-14 |
| [claude-ads — 전문 광고 감사/전략 에이전트 스킬](methods/claude-ads.md) | https://github.com/AgriciDaniel/claude-ads | 2026-04-30 |
| [free-claude-code — Claude Code를 대체 LLM 프로바이더로 라우팅하는 프록시](methods/free-claude-code.md) | https://github.com/Alishahryar1/free-claude-code | 2026-04-24 |
| [TransformerLens — mech-interp 실습 라이브러리](methods/transformerlens.md) | https://github.com/TransformerLensOrg/Transfo… | 2026-04-22 |

### 🎨 디자인 · 프론트엔드 <sub>16편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [slides-grab](methods/slides-grab.md) | https://github.com/NomaDamas/slides-grab | 2026-06-20 |
| [UI Skills — Design Engineer용 라우팅 + MUST/NEVER 교정 게이트 skill 모음 (ibelick)](methods/ui-skills-ibelick.md) | https://github.com/ibelick/ui-skills | 2026-06-18 |
| [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](methods/ui-ux-pro-max-skill.md) | https://github.com/nextlevelbuilder/ui-ux-pro… | 2026-06-18 |
| [DESIGN.md 컴포저 — 레버 조립 템플릿](methods/design-md-composer.md) | https://github.com/VoltAgent/awesome-design-md | 2026-06-17 |
| [Aseprite 자동화 — 픽셀아트 에디터의 헤드리스 CLI·Lua 스크립팅 (AI 게임 에셋 파이프라인 표면)](methods/aseprite-automation.md) | https://github.com/aseprite/aseprite | 2026-06-16 |
| [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](methods/awesome-design-md.md) | https://github.com/VoltAgent/awesome-design-md | 2026-06-16 |
| [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](methods/design-md.md) | https://github.com/google-labs-code/design.md | 2026-06-16 |
| [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](methods/diagram-design-skill.md) | https://github.com/cathrynlavery/diagram-design | 2026-06-16 |
| [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](methods/hyperframes-skill-pattern.md) | https://github.com/heygen-com/hyperframes/blo… | 2026-06-16 |
| [Kami (紙) — AI 문서 생성 시스템 운영 teardown](methods/kami-document-system.md) | https://github.com/tw93/Kami | 2026-06-16 |
| [sprite-gen 해체 — component-row 스프라이트 아틀라스 생산 파이프라인 (hatch-pet 일반화판)](methods/sprite-gen-skill.md) | https://github.com/aldegad/sprite-gen | 2026-06-16 |
| [Comnyang 랜딩 해체분석 (Comnyang Teardown)](methods/comnyang-landing-teardown.md) | https://comnyang.com | 2026-06-12 |
| [trysmooth.ai 랜딩 해체분석 (Trysmooth Teardown)](methods/trysmooth-landing-teardown.md) | https://www.trysmooth.ai/ko | 2026-06-12 |
| [HTML/CSS/JS Premium Interaction & Animation Learnings](methods/html-interaction-learnings.md) |  | 2026-06-09 |
| [Open Design — DESIGN.md 를 런타임에 소비하는 로컬-퍼스트 디자인 엔진](methods/open-design.md) | https://github.com/nexu-io/open-design | 2026-06-04 |
| [프리미엄 UI/UX 심리학 전략 (Premium Design Methods)](methods/premium-ui-ux-strategies.md) |  | 2026-05-05 |

### 🧰 도구 · 방법론 <sub>37편</sub>

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [im-not-strange-ai — Sunny 7 보조 패스 (humanize-korean 확장)](methods/im-not-strange-ai.md) | https://github.com/itssosunny/im-not-strange-ai | 2026-06-20 |
| [Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](methods/humanize-korean.md) | https://github.com/epoko77-ai/im-not-ai | 2026-06-18 |
| [Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](methods/kuku-second-brain.md) | https://github.com/kuku-mom/kuku | 2026-06-18 |
| [리서치는 전문 통독 — 인접한 것까지 뽑아 박제](methods/research-thoroughly-extract-adjacent.md) |  | 2026-06-18 |
| [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](methods/verifier-claims-need-regate.md) |  | 2026-06-18 |
| [WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](methods/webfetch-is-lossy-clone-for-fidelity.md) |  | 2026-06-18 |
| [Scrapling — 차단·동적 페이지를 뚫는 적응형 스크래핑 (on-demand escalation 도구)](methods/scrapling.md) | https://github.com/d4vinci/Scrapling | 2026-06-17 |
| [Apify Agent Skills](methods/apify-agent-skills.md) | https://github.com/apify/agent-skills | 2026-06-16 |
| [Pattern: Structured Output Gate (구조화 출력 게이트)](methods/prompt-pattern-structured-output-gate.md) |  | 2026-06-05 |
| [Odysseus — 자가 호스팅 AI 워크스테이션 참조 구현](methods/odysseus.md) | https://github.com/pewdiepie-archdaemon/odysseus | 2026-06-02 |
| [전문가급 탐구 및 기술 블로그 표준 (Expert Inquiry & Writing Standards)](methods/expert-inquiry-framework.md) |  | 2026-05-05 |
| [보안 및 DB 아키텍처 가이드라인 (Security & DB Guidelines)](methods/security-db-guidelines.md) |  | 2026-05-05 |
| [Swing Skills: AI 사고 스킬 세트 (Cognitive Skills)](methods/swing-skills.md) |  | 2026-05-05 |
| [video-use — 영상을 *읽는* 에이전트 스킬](methods/video-use.md) | https://github.com/browser-use/video-use | 2026-05-03 |
| [OpenAI Hatch Pet Skill — 에이전틱 에셋 팩토리](methods/openai-hatch-pet-skill.md) | https://aiagentsdirectory.com/skills/openai-o… | 2026-04-30 |
| [GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅](methods/openai-prompt-guidance-gpt55.md) | https://developers.openai.com/api/docs/guides… | 2026-04-30 |
| [Prompt Engineering Pattern Library (Hub)](methods/prompt-engineering.md) |  | 2026-04-30 |
| [Pattern: Agent Brief Governance (AGENTS.md)](methods/prompt-pattern-agent-brief-governance.md) |  | 2026-04-30 |
| [Pattern: Multi-Agent Audit (병렬 위임 감사)](methods/prompt-pattern-multi-agent-audit.md) |  | 2026-04-30 |
| [Pattern: Outcome-First (결과 중심 정의)](methods/prompt-pattern-outcome-first.md) |  | 2026-04-30 |
| [Pattern: State Serialization (상태 직렬화 매니페스트)](methods/prompt-pattern-state-serialization.md) |  | 2026-04-30 |
| [Pattern: Visual Anchor Consistency (비주얼 앵커 일관성)](methods/prompt-pattern-visual-anchor.md) |  | 2026-04-30 |
| [Warp Terminal — 에이전틱 터미널 환경](methods/warp-terminal.md) | https://github.com/warpdotdev/warp | 2026-04-30 |
| [토스 앱빌더 (Deus) — 웹 기반 UI 디자인 툴](methods/toss-appbuilder.md) |  | 2026-04-26 |
| [토스 앱인토스 — 콘솔 앱 등록 가이드](methods/toss-console-workspace.md) |  | 2026-04-26 |
| [토스 앱인토스 다크패턴 방지 정책](methods/toss-dark-pattern-policy.md) |  | 2026-04-26 |
| [토스 앱인토스 — 그래픽 리소스 가이드](methods/toss-graphic-resources.md) |  | 2026-04-26 |
| [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](methods/toss-miniapp-branding.md) |  | 2026-04-26 |
| [토스 앱인토스 — 서비스 오픈 프로세스](methods/toss-onboarding-process.md) |  | 2026-04-26 |
| [토스 앱인토스 — 플랫폼 개요](methods/toss-overview.md) |  | 2026-04-26 |
| [토스 앱인토스 — 사업자 등록 가이드](methods/toss-register-business.md) |  | 2026-04-26 |
| [토스 앱인토스 해상도 가이드](methods/toss-resolution.md) |  | 2026-04-26 |
| [토스 앱인토스 — 서비스 오픈 정책](methods/toss-service-policy.md) |  | 2026-04-26 |
| [토스 UX 라이팅 가이드 — 보이스톤](methods/toss-ux-writing.md) |  | 2026-04-26 |
| [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](methods/secall.md) | https://github.com/hang-in/seCall | 2026-04-22 |
| [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](methods/ai-employee-obsidian-stack.md) |  |  |
| [Plan-and-Execute](methods/plan-and-execute-skill.md) |  |  |

## 📖 경험 서사

*경험과 지식이 함께 엮인 학습 (부트캠프 등)* — 2편

| 글 | 출처 | 최종 수정 |
|----|------|-----------|
| [프로덕트 디자인 & UX 라이팅 — 학습 정리](narrative/product-design-and-ux-writing.md) |  | 2026-04-22 |
| [AI 엔지니어 NLP 부트캠프](narrative/bootcamp-ai-nlp.md) | 멋쟁이사자처럼 AI 엔지니어 NLP 교육과정 | 2026-04-20 |

---

이 README는 자동 생성된다. vault가 자라면 게이트를 통과한 새 글이 그대로 따라 올라온다. 파이프라인: `tools/export.py`(vault→정제·누출 게이트) → `tools/build_index.py`(주제별 목차). 원칙은 [`tools/PIPELINE.md`](tools/PIPELINE.md).
