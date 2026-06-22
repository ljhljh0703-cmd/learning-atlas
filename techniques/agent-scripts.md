---
created: 2026-06-13
updated: 2026-06-13
type: learning
tags: [agent-scripts, agent-rules, agents-md, git-hook, symlink, scaffolding, linter, 1password, sandbox-risk]
category: technique
---

# 에이전트 스크립트 해체 — steipete/agent-scripts

> ✅ **확정(confirmed) 2026-06-14** — 세션 내 ③Gate 통과 + 작가 수용. (외부 미검증 세부는 본문 표기 유지.)

> **한줄**: 로컬의 다중 프로젝트 저장소 간에 동일한 에이전트 지침(AGENTS.md) 및 스킬셋을 중복 없이 공유·강제하기 위해 고안된 심볼릭 링크, 자동 린터, 그리고 비밀키 1Password 연동 시스템.
> **핵심 사상**: 복잡한 규칙은 단일 캐노니컬 저장소에서 관리하며, 하류 프로젝트는 단 한 줄의 '포인터'만 두고 상향 참조하며, 깃 훅(git hooks)을 통해 스킬 형식 검사를 강제함.

---

## 1. 아키텍처 및 연동 흐름 (Infrastructure Architecture)

### 1) 심링크 기반 전역 지침 공유 (Global Rule Sharing)
*   **지침 단일 소스 (SSOT)**: 에이전트 제어용 공통 하드 규칙인 `AGENTS.MD`를 단일 저장소(`agent-scripts`)에서 관리합니다.
*   **글로벌 심링크 바인딩**: 에이전트 툴(Claude Code, Codex 등)이 글로벌하게 참조할 수 있는 설정 디렉토리에 심링크를 배선합니다.
    *   `~/.codex/AGENTS.md` ➔ `~/Projects/agent-scripts/AGENTS.MD`
    *   `~/.claude/CLAUDE.md` ➔ `~/Projects/agent-scripts/AGENTS.MD`
*   **포인터식 하향 적용**: 개별 downstream 프로젝트 저장소에는 지침 전체를 복사하지 않고 단 한 줄의 포인터 지시문만 적어 가볍게 유지합니다.
    ```text
    READ ~/Projects/agent-scripts/AGENTS.MD BEFORE ANYTHING (skip if missing).
    ```

### 2) 전역 스킬셋 관리 (`skills/` 디렉토리)
*   **심링크를 통한 외부 스킬 바인딩**: 여러 개별 리포지토리에 종속된 전용 스킬(birdclaw, discrawl 등)을 `agent-scripts/skills/` 하위에 tracked relative symlink 형식으로 노출시켜 중복 파일 관리 없이 전역 에이전트가 탐색 가능하게 설계했습니다.
    *   예: `skills/discrawl` ➔ `../../discrawl/.agents/skills/discrawl`
*   **글로벌 스킬 연동**: `~/.claude/skills` 등의 에이전트 탐색 경로를 `agent-scripts/skills`로 심링크 맵핑합니다.

---

## 2. 자동화 헬퍼 및 가드레일 (Helpers & Linters)

에이전트가 오작동하거나 규칙을 위반하여 산출물을 커밋하는 것을 물리적으로 제한하기 위한 린트 툴군과 보안 주입 시스템을 제공합니다.

### 1) 커밋 통제기 (`scripts/committer`)
*   **기능**: 에이전트가 임의로 커밋을 실행할 때, 오직 명시된 대상 파일만 스테이징하고 빈 커밋 메시지를 금지하며, 커밋 직전 반드시 스킬 검증 린터를 통과해야만 커밋이 물리적으로 승인되도록 구성합니다.

### 2) 스킬 구조 검증기 (`scripts/validate-skills`)
*   **기능**: 모든 `skills/*/SKILL.md` 내에 적합한 YAML frontmatter가 존재하는지, `name`과 `description`이 포함되어 있으며 description이 큰따옴표(`"`)로 감싸져 있는지 체크합니다.
*   **통합**: 이를 `core.hooksPath` 설정을 통해 git pre-commit hook 등으로 가동하여 린트 실패 시 커밋을 Reject합니다.
    *   `git config core.hooksPath hooks` 설정을 통해 프로젝트별 git hook 위치를 `hooks/` 디렉토리로 바인딩하여 작동을 자동화합니다.

### 3) 1Password 비밀키 연동 (`$one-password` integration)
*   **기능**: AI 에이전트가 로컬 환경에 민감한 API Key나 Secrets를 평문으로 노출하거나 하드코딩하는 것을 방지하기 위해 1Password CLI(`op`)를 연동합니다.
*   **동작 가드**:
    *   Secrets는 1Password Service Account를 통해 `op`로 런타임에 쿼리하여 메모리에만 로드해 사용합니다.
    *   1Password 세션이 interactive timeout으로 만료될 경우, 에이전트가 임의로 프로세스를 중단하거나 잘못된 더미 값을 생성하지 못하도록 Peter(사용자)에게 음성 또는 텍스트(`sag`)로 직접 입력을 고지(Peter Aloud)하고, 세션 해제 시까지 대기 후 안전하게 재시도합니다.

---

## 3. 샌드박스 위험성 및 아키텍처적 한계 (Sandbox Risks)

*   **샌드박스 격리 오류 (Access Denied)**:
    *   에이전트 실행 환경(Claude Code Sandbox, Docker Container, Codex Sandbox 등)이 파일 시스템 격리 모드에서 작동할 경우, 프로젝트 외부 경로(`~/Projects/agent-scripts/...`)에 대한 접근이 원천 차단됩니다.
    *   이때 `READ ~/Projects/agent-scripts/AGENTS.MD` 포인터 지시어는 `FileNotFoundError` 또는 `Permission Denied` 에러를 유발하며, 결과적으로 프로젝트 헌법 자체가 로드되지 않는 **에이전트 무통제(Uncontrolled) 상태**를 야기합니다.
*   **프로젝트 격리 훼손**:
    *   글로벌 설정(`~/.claude/CLAUDE.md`)을 전역 `AGENTS.md`에 심링크하면 개별 리포지토리의 특수 빌드 스펙이나 테스트 명령어가 오염되어, 프로젝트 독립성이 상실됩니다.

---

## 4. Sub-brain 기여 및 적용 포인트 (Takeaways)

1.  **로컬 Scaffolding 패턴으로 선회 (전역 심링크 대체)**:
    *   외부 격리 접근 실패를 예방하기 위해, 프로젝트 외부 파일시스템을 참조하는 절대 경로 포인터 대신 각 프로젝트 저장소 루트에 독립적인 `AGENTS.md`를 자동으로 생성하고 정기 동기화해주는 **로컬 스캐폴딩 배포 스크립트** 방식을 수립합니다.
2.  **git hooks 기반 스킬 린터 이식**: 에이전트가 skills를 임의로 작성하다 구조를 깨뜨리는 것을 감시하기 위해, git commit hook 단에 frontmatter 형식 검사(`validate-skills`)를 도입하는 하네스 보강 전략을 수립합니다.
3.  **1Password CLI 기반 Secrets 관리**: API key 주입 등의 작업 수행 시, 로컬 파일 대신 `op` 명령어를 래핑하여 주입하는 방식을 서브 브레인 야간 헬퍼 스케줄러 등에 적용해 보안 가드레일을 공고히 합니다.
