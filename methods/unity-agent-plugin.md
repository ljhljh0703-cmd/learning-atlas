---
created: 2026-09-24
updated: 2026-09-24
type: learning
category: method
tags: [unity, agent-plugin, game-dev, skills, license, reproducibility]
source: https://github.com/Unity-Technologies/unity-agent-plugin
---
<!-- Unity 공식 Agent Plugin 해체 요약 — 교체재가 아니라 Unity 6 전용 지식층. 31개 스킬 흡수 지도 · 라이선스 경계 · Codex 쪽 설치 상태. -->

# Unity 공식 Agent Plugin — Unity 6 전용 지식층

> ⚠️ provisional — 해체·설치 모두 Codex 산출(2026-09-20). Unity 에디터 실행·C# 컴파일은 **미실행**. 출처 = codex-gate-record-2026-09-24 · `unity-agent-plugin-returns/2026-09-20-official-plugin-{teardown,install}/`.

## 한 줄

**Unity 6+ 작업용 공식 분야별 지침 31개 + 선택형 Unity CLI/MCP 실행 경로.** 기존 REST 기반 Unity 자동화를 통째로 대체하지 않는다 — 공식 지침은 *지식층*으로 먼저 읽고, 실행 제어면은 격리 파일럿 뒤 판단한다. AI NPC 기능은 없다(NavMesh·멀티플레이·Vivox 등 주변 구현 보조).

## 31개 스킬 흡수 지도

| 처분 | 스킬 | 이유 |
|---|---|---|
| **공식 우선 참조** | `2d-pixel-perfect` · `manage-sprite-atlas` · `optimize-text-mesh-pro` · `localization` · `validate-urp-render-graph-renderer-feature` · `migrate-birp-to-urp` · `optimize-audio` · `optimize-web` | 버전·파이프라인 함정이 구체적(한글·영문 혼합 폰트 폴백, URP 이행 등 고비용 오류 영역) |
| **기존 실행 모듈 보조** | `ui`·`ui-ugui`·`ui-uitk`·`ui-imgui` · `initialize-ai-navigation` · `physics-3d-collision` · `urp-postprocessing` · `shader-graph-create-custom-node` · `sprite-editor` · `generate-editor-search-query` · `unity-package-management` · `setup-multiplayer-services` | 기능이 겹침 — API·분기·검증 순서만 보강, 실행은 기존 경로 |
| **요구 생길 때만** | `implement-in-app-purchases` · `levelplay-unity-integration` · `build-live-game` · `setup-vivox-voice-chat` · `new-unity-project` · `audio-setup-mixers` · `tilemap-*` 3종 · `sprite-segment-3x3grid` | 계정·SDK·콘텐츠 조건이 없으면 범위만 넓어짐 |
| **격리 파일럿** | `unity-cli` | 지식이 아니라 두 번째 제어면 — 임의 C# 실행·에셋 변경·설치/제거·빌드 권한 |

## 운용 규칙 (원문 §8 요약)

1. **공식 지침 먼저, 실행 도구는 하나만** — 한 작업에서 기존 REST 와 Unity CLI 를 섞지 않는다. 시작 때 어느 쪽인지 적는다.
2. **설치 ≠ 사용** — 플러그인 설치 · CLI 설치 · Pipeline 추가 · MCP 등록은 각각 별도 상태로 기록한다.
3. **버전 + 커밋을 같이 적는다** — 같은 `0.1.6-beta` 인데 커밋마다 수정 내용이 다르다(현지화 키 매칭·물리 문서·frontmatter 4건). **버전 문자열로 내용 동일성을 확인할 수 없다.**
4. **텔레메트리 선결** — CLI 는 분석 동의와 별개로 실행마다 익명 신호를 보낸다. 파일럿 시 `UNITY_NO_CLI_INVOKED_TELEMETRY=1` · `UNITY_NO_CRASH_REPORT=1` · `UNITY_NO_UPDATE_CHECK=1` 기본 검토.
5. **공식 샘플은 참고 입력** — 컴파일·테스트·화면·기기·빌드 증거는 프로젝트에서 다시 만든다.

## 라이선스 경계

**Unity Companion License.** Unity 프로젝트 저작·배포용 사용은 허용, Unity 제공물을 일반 경쟁 제품·서비스에 재사용하는 것은 제한. → 공식 스킬 본문을 **범용 공개 스킬팩으로 통째 복제하지 않는다.** 이 노트도 목록·요약만 둔다.

## 현재 설치 상태 (Codex 쪽 — 2026-09-20)

- 작가 요청 「흡수할 수 있는 스킬은 다 흡수해」 → Codex 가 31개 설치·활성화. `unity@unity-agent-plugin` · ref `ba48956…` 고정 · 경로 `~/.codex/plugins/cache/unity-agent-plugin/unity/0.1.6-beta` · MCP 파일 없음 · Unity CLI·Pipeline·MCP 등록은 **안 함**.
- ⚠️ 해체 보고의 추천(전역 설치 보류)을 뒤집은 결과이고, vault 기본 방침(「설치 말고 해체흡수」 · 「스킬 정본은 vault」)과 어긋난다 — 이 노트가 vault 쪽 정본 요약이다. 설치본은 Codex 전용 사본.
- **되돌리기** = Codex 에서 `unity@unity-agent-plugin` 플러그인 제거(또는 비활성) + marketplace 항목 삭제. 설치 전 상태로 돌아간다.
