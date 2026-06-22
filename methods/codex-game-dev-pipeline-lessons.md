# Codex Game Dev Pipeline Lessons

> "Unity Hwigi Tower의 시행착오를 정밀 분석하여, libGDX Rogue OS의 무결성 파이프라인을 구축한다."

---

## 1. 목적
이전 Unity 프로젝트인 `hwigi-tower` 개발 세션에서 Codex 에이전트와 파이프라인이 겪었던 한계와 실책을 기록하고, 이를 해결하기 위한 운영 권장 기준을 새 프로젝트 `libgdx-rogue-os`에 적용하여 개발 효율과 빌드 안정성을 높이고 초기 실패 가능성을 낮춘다.

## 2. 언제 참고하는가
* Codex 에이전트가 개발 세션을 종료하고 Handoff(인계) 문서를 갱신할 때.
* 릴리즈 빌드 배포 단계에서 검증 체크리스트를 실행할 때.
* 에이전트 다중 협업 세션을 열어 병렬 개발 팀(Harness)을 꾸릴 때.

## 3. 회고 및 분석 (Hwigi Tower Lessons)

### 1) 좋은 점 (Keep)
* **세션 분리 & PM 진행 세션**: 고수준 설계(PM/Gemini)와 실무 구현(Codex)의 계층을 엄격히 분리하여 작업 범위를 한정한 점.
* **pushed commit + APK path 보고**: 커밋 후 빌드된 아티팩트의 경로를 일관되게 명시하여 사용자가 검증 가능하도록 리포팅한 점.
* **Targeted Tests**: 광범위한 테스트 대신 특정 버그 영역을 겨냥한 타겟 테스트를 수행하여 수정 효율을 높인 점.
* **Release Checklist**: 배포 전 검증 목록을 확인해 단순 빌드 오류를 런타임 진입 전에 걸러낸 점.
* **Sub-brain progress 기록**: 세션 종료 시 progress 마크다운에 진행 기록을 자율적으로 append-only 누적한 점.

### 2) 나쁜 점 (Problem)
* **Context 누적**: 긴 대화로 인한 컨텍스트 포화 현상으로 에이전트의 이전 기억이 유실되어 동일한 버그가 반복적으로 재생산됨.
* **Main Dirty Worktree 혼선**: 임시 코드를 커밋 없이 작업 공간에 방치하여 의존성 충돌 및 빌드 깨짐이 발생함.
* **Screenshot / Device Smoke 과신**: 단순 스크린샷 렌더링 검사(Device smoke test)만으로 빌드 성공을 판단하여, 실제 터치 조작 시 발생하는 논리적 예외를 잡아내지 못함.
* **Synthetic Test의 한계**: 단순 무작위 난수 기반의 단위 테스트만 통과한 채 릴리즈했다가, 실제 유저 플레이 동선의 갇힘이나 기하학적 턴 꼬임(Deadlock)이 발생하는 경로를 누락함.
* **Unity Hidden State**: 유니티 씬 및 프리팹 내부에 기획자가 모르는 메타데이터가 숨어 있어 코덱스가 소스코드만 고쳐서는 절대 고칠 수 없는 버그가 생김.
* **이벤트/전투 Route Contract 붕괴**: 전투 씬으로 전환되는 시점의 데이터 계약 구조가 깨져 이전 상태 정보가 손실되는 사고 발생.

---

## 4. libGDX Rogue OS 권장 운영 규칙 (Action Item)

새 프로젝트 구동을 위한 권장 운영 수칙입니다.

### 1) Builds/ 디렉토리 고정 배포
* 모든 최종 플랫폼 아티팩트(Desktop Jar, Android APK)는 반드시 리포지토리 루트 하위의 `Builds/` 디렉토리에만 생성되도록 Gradle 타스크를 구성할 것을 권장한다. 빌드 경로 혼선으로 인한 릴리즈 누수를 원천 차단한다.

### 2) Device Smoke Test 통과 불가 시 N/A 기록
* 기기 에뮬레이터 오동작이나 특정 하드웨어 불능으로 터치 검증 등이 불가능한 상황은 개발 Blocker(차단 에러)가 아니다. 이를 억지로 뚫기 위해 시간을 낭비하지 말고, 보고서에 **"Device unavailable - Marked N/A"**로 기록한 뒤 Headless JUnit 검증 신뢰도에 의존한다.

### 3) User Path Fixture의 테스트명 영구 박제
* 실제 유저 시나리오에서 갇힘이나 이벤트 붕괴 현상이 감지되면, 해당 시나리오를 고정한 테스트 데이터를 구성하고, 테스트명을 `test_user_path_[구체적인 실패 경로 명칭]`으로 작성해 JUnit에 회귀 방지장치로 박아 넣는다.

### 4) "보이는 UI 상태"와 "게임 모델 상태"의 엄격한 분리
* 텍스트 렌더링에 표시되는 값(UI 화면)과 실제 메모리에 있는 캐릭터 HP 값(Model)은 완전히 일방향 단절되어야 한다. 모델이 갱신된 뒤 뷰가 이를 호출해 동기화할 뿐, 뷰에 그려진 값을 긁어와 게임 논리 계산의 인풋으로 쓰는 행위를 금지한다.

### 5) 10줄 규격 Handoff (컨텍스트 제어)
* 세션 인계 시 Codex 에이전트는 불필요한 서술형 보고서 대신, **10줄 요약 + 현재 블록커 + 다음 지연 명령**만으로 이루어진 초압축 메시지 프로토콜을 사용하도록 조율한다.

---

## 5. Codex 작업 전 체크리스트
- [ ] Builds/ 폴더 이외의 엉뚱한 임시 경로에 빌드 아티팩트가 생성되지는 않는가?
- [ ] 세션 종료 시 생성된 Handoff 브리핑 문서가 10줄 규격을 만족하는가?
- [ ] 새로 발견된 유저 버그 시나리오가 JUnit User Path 테스트 코드로 추가되었는가?

## 6. 관련 문서 링크
- libgdx-headless-test-first-workflow
- validator-first-roguelike-development
- libgdx-rogue-os-progress
- libgdx-rogue-os-knowledge-brief
