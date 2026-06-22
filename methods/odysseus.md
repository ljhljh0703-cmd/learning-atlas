---
created: 2026-06-02
updated: 2026-06-02
type: learning
tags: [self-hosted, workstation, platform, os, local-first, fastapi, docker, cross-platform, job-application-reference]
source: https://github.com/pewdiepie-archdaemon/odysseus
category: method
---

# Odysseus — 자가 호스팅 AI 워크스테이션 참조 구현

> 향후 작가가 *개인 AI 플랫폼 / 워크스테이션* 을 구축할 때 참고할 패턴 카탈로그. com2us 같은 JD 매핑은 무관 — 본 노트는 **플랫폼 빌더의 시선** 으로만 정리.

## 한 줄

FastAPI + SQLite + ChromaDB + 로컬 LLM 서빙 (vLLM/llama.cpp/Ollama) 을 *Linux / macOS / Windows / Docker* 4 환경 모두에서 동일 코드베이스로 굴리는 단일 프로세스 워크스페이스. *코드 그 자체* 보다 *OS·인프라 추상화 레이어* 가 본 학습의 핵심.

## 왜 저장하는가 (작가 관점)

- 작가는 이미 `sub-brain-engine/` 을 운영 — 개인 RAG/agent 워크스테이션을 *직접 만들* 가능성이 높음
- Odysseus 는 그 *참조 아키텍처*: 같은 문제 (cross-platform, atomic state, agent sandbox, PIM 통합) 를 *어떤 추상화로* 풀었는지 봄
- 산출물은 패턴 추출이 목적. 코드 통째 포팅은 #2 (Simplicity First) 위배

---

## 1. Cross-Platform OS 추상화 (★ 최고 가치 패턴)

`core/platform_compat.py` (203 줄) — **stdlib + ctypes 만** 으로 Windows / POSIX 차이 흡수. 외부 의존성 0 (psutil X, pywinpty X).

### 핵심 함수 5종

| 함수 | POSIX | Windows | 왜 중요한가 |
|---|---|---|---|
| `safe_chmod` | `os.chmod` | no-op | secret 파일 0o600. Windows 는 ACL 로 대체되므로 raise 대신 silent skip |
| `detached_popen_kwargs` | `start_new_session=True` | `CREATE_NEW_PROCESS_GROUP \| DETACHED_PROCESS` | 백그라운드 모델 서빙 / 콘솔 닫혀도 살아남는 child |
| `pid_alive` | `os.kill(pid, 0)` | `OpenProcess + GetExitCodeProcess` (ctypes) | **Windows 의 `os.kill(pid, 0)` 은 *프로세스를 죽인다*** — CPython 이 TerminateProcess 호출. 작가가 직접 cross-platform daemon 만들 때 *반드시 알아야 할 함정* |
| `kill_process_tree` | `killpg` → `kill` 폴백 | `taskkill /T /F` | 자식 프로세스 트리 전체 종료 |
| `find_bash` / `run_script_argv` | `/bin/bash` | Git for Windows `bash.exe` 후보 3 경로 probe | `.sh` wrapper 를 verbatim 재사용 가능 (Windows 도) |

→ **추출 패턴**: "OS 차이 흡수는 한 모듈에 집중, 호출부는 `os.name == "nt"` 검사 금지". 작가의 향후 워크스테이션 코드에 그대로 차용.

### 자가 워크스테이션 빌드 시 시사

- macOS 전용 / Linux 전용으로 시작했다가 *나중에 Windows 지원* 추가는 흔한 경로. 처음부터 `platform_compat.py` 같은 모듈 자리 비워두면 비용 절감
- Windows 의 함정 사례 (`os.kill(pid, 0)` = kill, `npm.cmd` 확장자, bash 부재) 는 *경험치 자산* — 학습 시 메모해 둘 것

---

## 2. Atomic 상태 저장 (★ 두 번째 가치 패턴)

`core/atomic_io.py` (43 줄) — JSON / text 영구 저장의 *유일한* 진입점.

```python
def atomic_write_json(path, data, *, indent=None):
    tmp = f"{path}.tmp.{os.getpid()}"  # PID 접미사 = 동시 저장 충돌 회피
    with open(tmp, "w") as f:
        json.dump(data, f, indent=indent)
        f.flush()
        os.fsync(f.fileno())            # 디스크까지 강제 flush
    os.replace(tmp, path)                # POSIX 에서 atomic (같은 FS)
```

### 왜 이 패턴이 워크스테이션의 *필수*인가

- `auth.json` (password DB), `sessions.json`, `settings.json`, `integrations.json` 같은 *live state* 가 `open("w") + json.dump` 중간에 kill / OOM / power loss → **truncated 파일 = data loss**
- 작가의 vault 도 동일 위험 (Tolaria 가 frontmatter 갱신 중 죽으면 노트 손실)
- 패턴 자체는 30 줄. *모든* JSON 저장에 도입 비용 0
- 한계: `os.replace` 는 *같은 파일시스템* 에서만 atomic. cross-FS rename 은 fallback 필요

→ **추출 패턴**: 작가 sub-brain-engine / Tolaria fork 에 첫날 도입할 것.

---

## 3. 3-OS 설치 트리오 (Linux systemd / macOS launchd / Windows ps1)

Odysseus 가 *동일 앱* 을 4 가지 방식으로 배포:

### 3.1 Linux: `odysseus-ui.service` (18 줄 systemd unit)

```ini
[Unit]
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/USER/odysseus-ui
ExecStart=/home/USER/odysseus-ui/venv/bin/uvicorn app:app --port 8000
Restart=always
RestartSec=3
EnvironmentFile=-/home/USER/odysseus-ui/.env
```

**시사**: systemd unit 은 작가 데스크탑·서버 양쪽에 *부팅 시 자동* 가능. `Restart=always + RestartSec=3` 만 있으면 crash loop 회복.

### 3.2 macOS: `start-macos.sh` (139 줄)

- Homebrew deps 자동 설치 (idempotent)
- venv 생성 + `pip install -r requirements.txt`
- `setup.py` 실행 (DB 마이그레이션 등)
- uvicorn 을 **port 7860** 으로 실행 — *7000 은 AirPlay 가 잡음* (작가 경험치 메모)
- `build-macos-app.sh` 는 `.app` 번들 래퍼 생성 → Spotlight 검색 가능

### 3.3 Windows: `launch-windows.ps1` (79 줄)

- `python -m venv venv` → `Activate.ps1` → `pip install` → `python setup.py` → `uvicorn`
- "safe to re-run" 강조: idempotent 보장이 *Windows UX 의 진입 장벽 해소*
- Git for Windows = `bash.exe` 제공 = agent 의 shell tool 동작

### 3.4 Docker (recommended): `docker-compose.yml` (140 줄, 4 서비스)

핵심 패턴들:

- **127.0.0.1 기본 바인드**: `"${APP_BIND:-127.0.0.1}:${APP_PORT:-7000}:7000"` — LAN 노출 *명시적 opt-in*
- **PUID/PGID 호스트 유저 매핑**: bind-mount 한 `./data` 가 호스트에서 *편집 가능* 한 권한으로 남음 (Docker 의 가장 짜증나는 함정)
- **host.docker.internal:host-gateway**: 컨테이너 → 호스트의 Ollama 직접 호출
- **캐시 분리 볼륨**: `./data/huggingface` (모델), `./data/local` (Cookbook 설치한 vLLM·llama-cpp-python 등 Python CLI). *컨테이너 재생성에도 살아남음*
- **SearXNG 로컬 프록시**: 외부 검색 쿼리를 본인 호스트에서 익명화 (Google/Bing 직접 호출 X)
- **헬스체크 + depends_on**: `chromadb` 와 `searxng` 가 healthy 해야 메인 앱 부팅

→ **추출 패턴**: 작가가 *플랫폼* 만들 때 "127.0.0.1 default + 명시적 LAN opt-in" + "PUID/PGID 매핑" 은 필수 기본값.

---

## 4. 컴포넌트별 *재사용 가능* 패턴 (작가 플랫폼 빌드 시)

### 4.1 모델 서빙 — Cookbook / llmfit

- 하드웨어 (VRAM/RAM) 스캔 → GGUF/FP8/AWQ 적합도 스코어 → 클릭 다운로드 → vLLM/llama.cpp 백그라운드 서빙
- llmfit 자체는 단독 학습 가치 (`learnings/techniques/llmfit.md` 신설 후보)
- **시사**: 작가 워크스테이션이 *여러 디바이스* (M-series Mac / GPU 데스크탑 / 노트북) 에 걸치면 이 추상화가 가치 高. *단일 디바이스* 라면 과잉

### 4.2 Agent Sandbox — opencode + MCP

- `opencode` (anomalyco) 기반: shell / file / browser (Playwright) 도구를 *MCP 도구* 로 노출
- MCP server 자동 탐지 + npx 캐시 확인 (없으면 startup log 메시지로 skip — 멀티분 npm download 회피)
- **시사**: 작가가 Hermes-차용 에이전트 만들 때 MCP 도구 격리 패턴 참고. *세이프티* 는 admin gating + per-user privileges 로 풀이

### 4.3 메모리 — ChromaDB + fastembed (ONNX)

- 임베딩 서버 없음. fastembed 가 ONNX 로 *프로세스 내* 임베딩 → 외부 API 0
- 기본 모델: `sentence-transformers/all-MiniLM-L6-v2` (가벼움)
- vector + keyword 하이브리드 검색
- **시사**: 작가의 vault/sub-brain-engine 의 *기본 임베딩 인프라* 로 적합. OpenAI embedding API 의존 끊기 첫 단계

### 4.4 검색 — SearXNG 로컬 프록시

- Brave/Google/Tavily/Serper API key 들 *전부 선택*. SearXNG 가 70+ 검색엔진 메타 검색
- 컨테이너 부팅 시 secret 자동 생성 (`secrets.token_urlsafe(48)`) → settings.yml 템플릿 치환
- **시사**: 작가 워크스테이션의 *검색* 은 SearXNG 한 컨테이너로 통일. 비용 0, 추적 회피

### 4.5 PIM 통합 (Email / Calendar / Notes)

- IMAP/SMTP per-account routing + CalDAV (Radicale / Nextcloud / Apple / Fastmail)
- ntfy 컨테이너 = push 알림
- **시사**: *플랫폼* 이 되려면 PIM 통합이 핵심. 작가가 만든다면 이 4 채널 (mail / cal / note / push) 이 최소 구성

### 4.6 인증 모델

- 첫 부팅 시 admin 계정 자동 생성 + 임시 비번 *터미널 출력* (Docker 는 `docker compose logs`)
- per-user privileges: non-admin = shell / Python / file read/write 기본 차단
- `AUTH_ENABLED=true` + `LOCALHOST_BYPASS=false` 가 안전 기본값
- **시사**: "localhost 만 bypass" 토글은 *개발 편의 + 배포 안전* 동시 달성하는 깔끔한 룰

---

## 5. 의도적으로 *훔치지 말아야 할* 부분

작가 플랫폼은 작가 vault (Markdown + frontmatter) 위에 얹힐 가능성 高. Odysseus 의 다음은 *맥락 안 맞음*:

- **Document editor 멀티탭** — 작가는 Obsidian + Tolaria 가 권위. 자체 에디터 X
- **Image / Theme editor** — 워크스테이션 범위 outside
- **Compare (멀티모델 blind test)** — 작가의 3-AI 분업 (Claude/Gemini/Codex) 모델은 이미 다름
- **Deep Research (Tongyi DeepResearch 이식)** — Claude/Gemini 의 native research 가 훨씬 강력
- **FastAPI 단일 프로세스 구조 자체** — 작가 vault 가 *파일시스템 기반* 이라면 long-running 서버 *불요* 할 수도. MCP 서버 분산 패턴이 더 정합

→ Karpathy #3 (Surgical) 준수. *부분 차용*, 통째 X.

---

## 6. 작가 플랫폼 빌드 시 즉시 차용 우선순위

| 우선 | 패턴 | 도입 비용 | 가치 |
|---|---|---|---|
| 1 | `atomic_io.py` (atomic JSON write) | 30 줄 | data loss 차단 — **트리거 충족 시** (§6.1) |
| 2 | `platform_compat.py` 의 Windows pid_alive / process tree kill 패턴 | 100 줄 | cross-platform daemon 시 *함정 회피* |
| 3 | Docker compose 의 127.0.0.1 default + PUID/PGID 매핑 | compose 파일만 | 보안·편의 동시 |
| 4 | ChromaDB + fastembed (ONNX) 임베딩 in-process | 의존성 2개 | 외부 임베딩 API 의존 끊기 |
| 5 | systemd unit + macOS launchd 트리오 (3 환경 부팅 자동) | 각 ~20 줄 | "내 PC 켜면 워크스테이션 떠 있음" |
| 6 | SearXNG 로컬 검색 프록시 | 컨테이너 1개 | 검색 비용 0 + 추적 회피 |
| 7 | per-user privileges + admin gating + localhost bypass 토글 | auth 모델 | 작가가 가족·동료 공유 시 안전 기본값 |

→ 1-3 은 *어떤 워크스테이션이든* 도입. 4-7 은 작가가 만들 플랫폼 *기능 범위* 결정 후.

### 6.1 atomic_io 도입 트리거 (2026-06-02 작가 결정)

2026-06-02 vault 코드 5종 조사 결과 — *현 시점* 도입 보류 결정. 작가 코드 (sub-brain-engine / skills 5종) 가 *상시 mutate 되는 live JSON state* 를 보유하지 않음. Markdown 노트는 Tolaria 관할로 손대지 않음. 도입은 *문제를 찾아다니는 솔루션* 이 되므로 #2 (Simplicity First) 위배.

**도입 트리거** (아래 *하나라도* 충족 시 = `atomic_io.py` 30 줄을 *해당 도구* utility 로 즉시 도입):

1. **`sub-brain-engine/` 가 실제 Python 백엔드로 굳어지고** session / index / cache JSON 을 디스크에 쓰기 시작 (현재는 shell + HTML 만)
2. **vault 처리 스크립트 신설** — 자동 frontmatter 갱신 봇, 주간 회고 자동 누적기, hot.md 자동 갱신 등 작가 Python 도구가 *상시* JSON 상태 저장
3. **Hermes 차용 agent 가 실제 코드로 구현** — memory / working set / scratch state 가 디스크 영구화
4. **applications/<company>/progress.md 자동 append 도구 작성** — 외부 AI 의 progress 갱신 자동화 시 race condition 위험 → atomic + lock 필요
5. **3-AI 분업의 공유 상태 파일 신설** — Claude/Gemini/Codex 가 같은 JSON 을 동시 갱신할 수 있는 구조 등장 시

**도입 시 즉시 할 일**:
- `core/atomic_io.py` (Odysseus 원본 30 줄 그대로 복붙, license MIT 인용 주석 1 줄)
- 모든 `with open(path, "w")` + `json.dump` 패턴을 `atomic_write_json(path, data)` 로 교체
- 임시 파일 (`*.tmp.{pid}`) 이 git 추적 안되도록 `.gitignore` 1 줄 추가

**한계 명시**:
- `os.replace` 는 *같은 파일시스템* 에서만 atomic. cross-FS (tmp → 외장 디스크) 면 fallback 필요. 작가 단일 머신 환경에서는 안 마주칠 케이스
- 빈도 매우 높은 write (초당 100+회) 면 `fsync` 비용 누적 — 그 경우 *별도 패턴* (WAL 등) 필요

**도입 *안 함* 결정 사례** (현재 적용):
- `skills/html-publish/build.py` 의 `out.write_text(html)` 2 지점 — 빌더 idempotent + Git 추적 + 실패 시 즉시 눈에 띔 = atomic 의 *진짜 가치* (silent corruption 차단) 적용 안 됨. **재실행으로 회복 가능한 파생물에는 도입 X**

---

## 7. AI 직군 취업 공부 관점 (작가 장기 트랙)

작가는 AI Model / RL / AI infra / agent platform 직군 지원을 *지속* 할 것. 본 노트는 **그 학습 자산** 으로도 기능 — 단 com2us 사례 (Gemini 의 backwards mapping) 재발 방지를 위해 *정합 vs 무관* 명시.

### 7.1 ✅ 정합 직군 (Odysseus 패턴이 *직접* 어필 가능)

| 직군 카테고리 | Odysseus 의 어떤 부분이 가치 | 비고 |
|---|---|---|
| **AI Infra / MLOps** | Cookbook (llmfit) + vLLM/llama.cpp/Ollama 멀티 백엔드 서빙 + Docker compose 멀티 서비스 + 헬스체크 | "로컬 모델 서빙 파이프라인 운영" 직접 매핑 |
| **On-Device / Edge AI** | 하드웨어 스캔 → 적합 모델 선택 → 양자화 (GGUF/FP8/AWQ) → ONNX (fastembed) | "다양한 디바이스 대응" 경험 자산 |
| **Agent Platform / LLM Application** | opencode sandbox + MCP 자동 탐지 + agent loop + tool security | Anthropic / OpenAI / Hugging Face 같은 *agent 플랫폼* 기업 |
| **AI Developer Tools / DX** | 3-OS 설치 트리오 + atomic state + cross-platform 추상화 | Cursor / Continue / Windsurf 류 *AI dev tool* 회사 |
| **Personal AI / PIM Agent** | Email (IMAP/SMTP) + CalDAV + ChromaDB 메모리 통합 | Mem / Reflect / Granola 류 *비서형 AI* 스타트업 |
| **RAG / Vector Search Infra** | ChromaDB + fastembed in-process + vector+keyword 하이브리드 | 임베딩 인프라 / vector DB 회사 |

### 7.2 ❌ 무관 직군 (억지 매핑 금지 — com2us 재발 방지)

| 직군 | 왜 무관 | Gemini 가 자주 실수하는 매핑 |
|---|---|---|
| **게임 AI / RL 시뮬레이션** (DQN/PPO/MuZero/MCTS) | Odysseus 는 LLM chat 워크스페이스, RL 환경 X. Replay buffer ≠ RAG | "ChromaDB 로 플레이 로그", "MCP 로 게임 UI 래핑" — 둘 다 backwards |
| **컴퓨터 비전 / 모델 학습** | 학습 파이프라인 X, *서빙* 만 | "fastembed 로 ONNX 경험" 정도가 한계 |
| **딥러닝 리서치 (논문)** | 알고리즘 기여 0, 시스템 통합만 | 무관 |
| **데이터 엔지니어링** | ETL / 대규모 파이프라인 X | 무관 |
| **NLP / 음성** (모델 학습) | TTS/STT 는 *호출만* (서비스 통합) | "TTS 서비스 통합" 정도가 한계 |

### 7.3 직군별 어필 시 *실제* 사용 방식

정합 직군에 어필할 때도 **Odysseus 통째** 가 아니라 *특정 패턴* 만 카드화:

- "로컬 LLM 서빙 파이프라인 경험" 어필 → Cookbook (llmfit) + vLLM/llama.cpp 다중 백엔드 분석 *학습* 노트
- "Cross-platform agent runtime 설계" 어필 → `platform_compat.py` 패턴 + Windows 함정 카탈로그 *직접 구현* 한 경험
- "Agent sandbox 보안" 어필 → opencode + MCP 도구 격리 패턴 + per-user privileges 모델 *분석*
- "On-device 임베딩" 어필 → ChromaDB + fastembed (ONNX) *를 작가 sub-brain-engine 에 도입* 한 결과물

→ **포트폴리오 룰**: 학습 노트 단독은 약함. *작가 본인 프로젝트* (sub-brain-engine / vault / 향후 워크스테이션) 에 *부분 차용 + 결과물* 이 진짜 자산. Odysseus 자체는 *참조 사례* 로만 인용.

### 7.4 다음 액션 (작가 결정)

- 정합 직군 JD 발생 시 본 §7.1 표에서 *해당 패턴* 만 골라 strategy.md 에 인용
- Gemini / Codex 가 다시 "Odysseus 의 X를 Y직군에 매핑하자" 제안 시 §7.2 표로 사전 차단
- 작가가 sub-brain-engine 에 §6 우선순위 1-3 항목 도입 시 *그 자체로* 포트폴리오 자산. Odysseus 학습 노트가 *왜 그 패턴 골랐는지* 의 archive 역할

---

## 8. 다음 학습 후보 (작가 결정)

- **llmfit** — VRAM-aware 모델 적합 스코어링. 멀티 디바이스 운영 시 가치
- **opencode** — agent shell sandbox 패턴. Hermes 차용과 비교 학습 가능
- **Tongyi DeepResearch** — 다단계 리서치 루프. 작가는 Claude/Gemini 가 이미 강하므로 *학습 자료* 로만
- **fastembed / ONNX runtime** — 프로세스 내 임베딩 패턴. 작가 vault RAG 의 기본 후보

---

## 연결

- [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](ai-employee-obsidian-stack.md) — 작가의 obsidian 기반 AI 직원 스택 비전과 *직접 보완*
- [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](../techniques/hermes-agent.md) — agent 자가성장. Odysseus 의 정적 agent 구조와 대비 학습
- [CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](codegraph.md) — codegraph 도 자체 SQLite 인덱스 보유 — 데이터 평면 분리 패턴 비교
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — *부분 차용, 통째 X* 의 #3 (Surgical) 근거

## 운영 메모

- 2026-06-02 작가 결정: "제미나이 개소리 (com2us 카드 매핑) 무시. 학습 자산만, 워크스테이션·OS 관점 위주, 향후 플랫폼 구축 참고용". → 본 노트 com2us 관련 섹션 0, 플랫폼 빌더 lens 100%
- review_trigger: 작가가 *직접 워크스테이션 / 플랫폼 빌드* 착수 시점. 그 전엔 참조만
