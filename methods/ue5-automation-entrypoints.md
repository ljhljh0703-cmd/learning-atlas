---
created: 2026-08-02
updated: 2026-08-02
type: learning
category: methods
tags: [unreal-engine, ue5, automation, mcp, ci, qa-automation]
---
<!-- UE5에 AI·자동화를 붙이는 공식 진입점 지도. -->

# UE5 자동화·AI 접점 진입점 지도

> ⚠️ **임시(provisional).** 출처는 대부분 Epic 공식 문서라 신뢰도는 높다. **문서 기반 정리이며 실기 검증은 미수행** — 읽은 것과 할 수 있는 것을 구분한다.

## 0. 왜 이게 우리 직무인가

`[추정]` 사내 AI 툴링 직무의 상위 범위가 "UE5 기반 게임 기술 R&D + AI"인 경우가 많다. AI 워크플로우를 만든다는 건 결국 **엔진·빌드·에셋·테스트 파이프라인 어딘가에 자동화를 꽂는 것**이다. 어디에 꽂을 수 있는지의 지도가 아래다.

---

## 1. ⭐ 최우선 — Epic 공식 `Unreal MCP` (UE 5.8, Experimental)

`[확인]` https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor

**언리얼 에디터 프로세스 안에 MCP 서버가 내장된다.** 로컬 HTTP(`http://127.0.0.1:8000/mcp`)로 MCP 호환 에이전트가 에디터를 직접 조작한다.

- 지원 클라이언트: **Claude Code, Cursor, VS Code, Gemini, Codex**, MCP Inspector
- 노출 툴: 액터 스폰·설정 / 라이팅 / 머티리얼 인스턴스 생성 / **Slate 위젯 인스펙션** / **오토메이션 테스트 실행** / 개발자 커스텀 툴 확장
- 켜는 법: `Edit > Plugins` → "Unreal MCP" → `Editor Preferences > Model Context Protocol`에서 auto-start → `ModelContextProtocol.GenerateClientConfig ClaudeCode`
- 상태: **Experimental**(배포 빌드 주의), 동일 머신 접속만


### 커스텀/서드파티 MCP (전부 GitHub 실존 확인)

| 리포 | 특징 | UE | ★ |
|---|---|---|---|
| ⭐ `runreal/unreal-mcp` | **플러그인 불필요** — UE 내장 Python Remote Execution만 사용. 툴 20종(python 실행, 에셋 list/export/search/**validate**, 액터 CRUD, 콘솔) | 5.4+ | 106 |
| `remiphilippe/mcp-unreal` | Go 단일 바이너리, 툴 49종. **헤드리스 빌드·테스트**까지 노출 | 5.7 | 53 |
| `chongdashu/unreal-mcp` | C++ 플러그인 + Python 서버. 블루프린트 노드 그래프까지 | 5.5+ | 2.0k |
| `flopperam/unreal-engine-mcp` | 오픈소스 기본 툴셋 + 유료 호스팅 병행 | 5.5~5.7 | 924 |
| `kvick-games/UnrealMCP` | TCP → Claude Desktop. "VERY WIP" 자기고지 | 5.5 | 587 |

**학습 순서 `[추정]`**: `runreal`(원리 이해, 코드 작아 통독 가능) → **Epic 공식 5.8**(프로덕션 방향) → `remiphilippe`(에이전트에 무엇까지 열지의 설계 참고).
⚠️ **공식(5.8)이 서드파티를 빠르게 대체할 가능성이 높다.** 사내 툴을 서드파티 플러그인 위에 깊게 짜기 전에 공식 확장 API(custom tool 등록)를 먼저 검토할 것.

---

## 2. Python for Unreal — MCP 없이 붙이는 가장 짧은 길

| 문서 | URL |
|---|---|
| Scripting and Automating the Unreal Editor (허브 — Blueprint/Python/**Remote Control**/Editor Scripting Utilities 4갈래) | https://dev.epicgames.com/documentation/unreal-engine/scripting-and-automating-the-unreal-editor |
| Scripting the Unreal Editor Using Python | https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python |
| Python Editor Script Plugin API | https://dev.epicgames.com/documentation/unreal-engine/API/PluginIndex/PythonScriptPlugin |
| Epic 공식 무료 코스 | https://dev.epicgames.com/community/learning/courses/wk4/utilizing-python-for-editor-scripting-in-unreal-engine |
| 실전 팁(커뮤니티) | https://ryandowlingsoka.com/unreal/python-in-unreal/ |

**Python Remote Execution** — 외부 프로세스(Maya/Blender/LLM 에이전트)가 UE 에디터에 파이썬을 밀어넣는 프로토콜(UDP 디스커버리 → TCP 커맨드). 엔진에 `remote_execution.py`가 동봉된다. `[확인]`
→ 튜토리얼 https://tianc377.github.io/posts/RemoteExecutionBetweenUnrealandDCC/

**에디터 UI 툴 만들기**
- Editor Utility Widgets — https://dev.epicgames.com/documentation/en-us/unreal-engine/editor-utility-widgets-in-unreal-engine
- Scriptable Tools System(BP로 에디터 모드 작성) — https://dev.epicgames.com/documentation/en-us/unreal-engine/scriptable-tools-system-in-unreal-engine

---

## 3. 빌드·CI 툴체인 (여기가 AI 붙이기 좋은 지점)

| 도구 | 무엇 | URL |
|---|---|---|
| **UnrealBuildTool (UBT)** | C# 빌드 시스템. `.Build.cs` / `.Target.cs` | https://dev.epicgames.com/documentation/unreal-engine/unreal-build-tool-in-unreal-engine |
| **Unreal Automation Tool (UAT)** | `RunUAT BuildCookRun` — 빌드·쿡·패키징·배포 오케스트레이터 | https://dev.epicgames.com/documentation/unreal-engine/unreal-automation-tool-overview-for-unreal-engine |
| **BuildGraph** | XML DSL로 빌드 그래프 선언 → 병렬·분산 | https://dev.epicgames.com/documentation/en-us/unreal-engine/buildgraph |
| **Horde** | Epic 자체 CI/CD(오픈소스 동봉). Fortnite를 굴리는 물건 | https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-build-automation-for-unreal-engine |
| ⭐ **Horde Build Health** | **빌드 깨짐 자동 분류·담당자 지목** | https://dev.epicgames.com/documentation/unreal-engine/horde-build-health-for-unreal-engine |
| **UBA** (Unreal Build Accelerator) | 분산 C++/셰이더 컴파일 | https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-unreal-build-accelerator-and-remote-compilation-tutorial-for-unreal-engine |
| **Commandlet** | 에디터를 헤드리스 CLI로 구동(`-run=<Commandlet>`) | https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/UCommandlet |
| World Partition Builder Commandlet | 오픈월드 대량 배치 처리(MMORPG 직결) | https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-builder-commandlet-reference |

`[추정]` **"빌드 실패 로그 → LLM 요약 → 담당자 지목"** 은 Horde Build Health가 이미 뼈대를 제공하므로 신입이 붙일 수 있는 가장 값싼 실증 과제다. 단 사내가 Horde를 쓰는지 먼저 확인해야 한다(미확인).

---

## 4. 자동화 테스트 — QA에 AI를 붙이는 좌표

| 프레임워크 | 성격 | URL |
|---|---|---|
| Automation Test Framework | 유닛/기능 테스트 총론 | https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-test-framework-in-unreal-engine |
| **Automation Spec** | BDD 스타일(`Describe/It`) | https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-spec-in-unreal-engine |
| Functional Testing | 레벨에 배치하는 인게임 시나리오 | https://dev.epicgames.com/documentation/en-us/unreal-engine/functional-testing-in-unreal-engine |
| ⭐ **Gauntlet** | **빌드 배포 → 디바이스 실행 → 결과 수집**까지 자동화(성능·장기세션·멀티클라이언트) | https://dev.epicgames.com/documentation/en-us/unreal-engine/gauntlet-automation-framework-in-unreal-engine |
| 현업 종합 정리(2025) | UE 테스트 프레임워크 선택 기준 | https://andrewfray.wordpress.com/2025/04/09/the-topography-of-unreal-test-automation-in-2025/ |

`[추정]` MMORPG에서 임팩트 큰 조합 = **Gauntlet(장기 세션·서버 부하) + Horde Build Health(실패 자동 분류) + LLM 요약**. UE 5.8 Unreal MCP가 "오토메이션 테스트 실행"을 툴로 노출하므로 **에이전트가 테스트를 돌리고 실패를 요약하는 루프**는 공식 경로로 이미 가능하다.

> 🔗 vault 기존 자산과의 접점 — [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md)(E2E 하네스 설계 원리)·[Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](automated-playtesting-shooterbot.md)(봇 플레이테스트)·[Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md)(done-gate). **테스트 자동화의 *설계 규율*은 이미 있고, 없던 건 UE라는 *표면*뿐이다.**

---

## 5. 에셋 파이프라인 · 버전관리

- **Interchange Framework**(신형 임포트 파이프라인, 확장 가능) — https://dev.epicgames.com/documentation/en-us/unreal-engine/interchange-framework-in-unreal-engine · 커스텀 파이프라인 작성 https://dev.epicgames.com/documentation/unreal-engine/interchange-development-guides
- **Data Validation / Editor Validator** — 에셋 네이밍·설정 규칙을 커밋 전 자동 검사. `runreal/unreal-mcp`의 `asset validate` 툴이 이 계층. ⚠️ 전용 공식 문서 URL **미확인**(Editor Scripting Utilities 허브에서 진입)
- **Perforce** — UE 공식 https://dev.epicgames.com/documentation/en-us/unreal-engine/using-perforce-as-source-control-for-unreal-engine · UnrealGameSync https://www.perforce.com/blog/vcs/how-to-use-unrealgamesync
- `[추정]` 대형 UE5 MMO 표준 스택 = **Perforce Helix Core + UnrealGameSync + Horde + BuildGraph + UBA** 5종 세트.

---

## 6. 게임 내 AI를 UE5에 꽂는 스택 (참고 — 우리 축은 아님)

- **NVIDIA ACE Game Agent SDK + UE5 플러그인 3종**(ASR·SLM·TTS, 전부 온디바이스 RTX, Blueprint 지원) — https://developer.nvidia.com/blog/build-on-device-ai-companions-with-the-nvidia-ace-game-agent-sdk-and-unreal-engine-5-plugins/ · https://github.com/NVIDIA/game-agent-sdk `[확인]` ⚠️ 리포 README엔 UE 플러그인 명시 없음 — 배포 경로 별도 확인 필요
- **ML Deformer**(뉴럴넷 디폼) — https://dev.epicgames.com/documentation/unreal-engine/ml-deformer-framework-in-unreal-engine
- 크래프톤 PUBG 엘라이가 NVIDIA ACE 기반 온디바이스 sLM으로 **응답 0.8초 미만**을 달성했다는 보도가 이 스택의 실증. `[확인, 보도]`

---

## 7. 반영 (학습→반영 루프)

- **미확인 목록**: 사내 UE 버전 / Horde·Perforce 사용 여부 / 사내에 이미 있는 에디터 툴 / Data Validation 공식 문서 URL / UGS Epic 공식 문서 URL.
