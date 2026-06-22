
# Plan-and-Execute

사용자의 목표를 받아서 분석하고, 필요한 도구를 갖추고, 실행까지 완료하는 오케스트레이션 스킬입니다. 본 스킬은 [고성능 AI 오케스트레이션 및 명령 표준 (Advanced Orchestration)](advanced-ai-orchestration.md)의 실행 단계에서 핵심적인 역할을 수행하며, [Harness AI 스타터팩: 에이전트 설계 표준 (Starter Pack)](harness-starter-pack.md)의 설계 원칙을 준수하여 에이전트 자율성을 극대화합니다.

## 왜 이 스킬이 필요한가

복합적인 작업은 여러 스킬과 도구가 협력해야 완성된다.
하지만 사용자가 어떤 스킬이 있는지, 어떤 플러그인을 설치해야 하는지 일일이 파악하기 어렵다.
이 스킬은 사용자가 "무엇을 하고 싶은지"만 말하면, 나머지는 Claude가 알아서 준비하고 실행하도록 설계되었다.

## 실행 플로우

### Phase 1: 입력 수집

사용자가 목표나 기획안을 입력하면, 그것을 그대로 받아들인다.
형식은 자유롭다 — 한 줄짜리 목표, 상세한 기획서, 또는 대화 속에서 나온 아이디어 모두 OK.

### Phase 2: 세부 분석

입력된 내용을 다음 관점에서 분석한다:

- **목표**: 최종적으로 달성하려는 것이 무엇인가
- **범위**: 어디서 시작하고 어디서 끝나는가
- **구성 요소**: 어떤 작업들이 필요한가 (설계, 코딩, 문서화, 테스트 등)
- **의존성**: 작업 간 순서가 있는가, 병렬 처리 가능한 것은 무엇인가
- **리스크**: 불확실한 부분이나 잠재적 장애물은 무엇인가

분석 결과를 사용자에게 간결하게 요약해서 보여준다.

### Phase 3: 역질문

분석 과정에서 빠진 정보나 애매한 부분을 `AskUserQuestion`으로 질문한다.
한 번에 최대 4개 질문을 묶어서 보낸다. 핵심적인 것만 묻는다.

질문할 만한 영역:
- 기술 스택 선호 (예: Python vs Node, Unity 버전)
- 우선순위 (속도 vs 품질, MVP vs 완성도)
- 대상 사용자/환경 (모바일, 웹, 데스크톱)
- 기존에 가진 코드나 자료가 있는지
- 마감이나 제약 조건

사용자의 답변이 돌아오면 Phase 2의 분석을 보강한다.

### Phase 4: 상세 계획 수립

`TodoWrite`를 사용해 실행 계획을 작성한다.
각 작업은 구체적이고 실행 가능해야 한다.

계획 작성 원칙:
- 각 항목은 하나의 명확한 액션
- 의존성 순서대로 배치
- 병렬 가능한 작업은 표시
- 예상 사용 도구/스킬을 각 항목에 메모

예시:
```
1. 시스템 아키텍처 설계 (engineering:system-design)
2. API 스펙 작성 (engineering:documentation)
3. 데이터 모델 설계 (engineering:architecture)
4. 코어 로직 구현
5. 테스트 전략 수립 (engineering:testing-strategy)
6. 문서화 (engineering:documentation)
```

### Phase 5: 스킬/플러그인 검색

계획에서 필요한 스킬들을 파악한 뒤, `search_plugins`로 마켓플레이스를 검색한다.

검색 전략:
- 계획의 각 작업 영역을 키워드로 변환
- 이미 설치된 스킬도 포함하여 검색 (`includeInstalled: true`)
- 검색 결과에서 실제로 필요한 것만 필터링

검색은 여러 번 수행할 수 있다 — 작업 영역이 다양하면 키워드를 나눠서 검색한다.

### Phase 6: 플러그인 선택 및 설치

검색 결과를 정리해서 `AskUserQuestion`으로 사용자에게 보여준다.
`multiSelect: true`로 설정해서 필요한 플러그인을 한 번에 선택할 수 있게 한다.

선택지 구성:
- 각 플러그인의 이름과 포함된 스킬 수
- 이 프로젝트에서 어떻게 쓰일지 한 줄 설명
- 이미 설치된 것은 "(설치됨)" 표시

사용자가 선택하면, 선택된 플러그인을 순차적으로 `suggest_plugin_install`로 추천한다.
각 추천 사이에 사용자가 "추가" 버튼을 누를 시간을 준다.

이미 설치된 스킬로 충분하다면, 이 단계를 건너뛰고 바로 실행으로 넘어간다.

### Phase 7: 작업 실행

TodoWrite의 계획을 따라 순차적으로 작업을 진행한다.

실행 원칙:
- 각 작업을 시작할 때 `TodoWrite`로 상태를 `in_progress`로 변경
- 적합한 스킬이 있으면 해당 스킬의 워크플로우를 따라 실행
- 스킬 없이 직접 처리할 수 있는 작업은 직접 수행
- 완료되면 `completed`로 변경하고 다음 작업으로 이동
- 중간에 문제가 생기면 사용자에게 보고하고 대안을 제시

작업 중 추가 스킬이 필요하다고 판단되면, Phase 5-6을 다시 수행할 수 있다.

## 절대 제약 조건 (CRITICAL)

이 세 가지는 어떤 상황에서도 위반할 수 없다. 위반 시 스킬이 무력화된다.

**1. Phase 3 바이패스 금지 — Human-in-the-loop 보장**

`AskUserQuestion`을 호출해야 할 상황에서 AI가 질문과 답변을 스스로 생성하여 다음 단계로 진행하는 것을 절대 금지한다.

- 질문이 필요하면 `AskUserQuestion`을 호출하고, **호출 직후 출력을 중단(Stop)하고 사용자의 실제 응답을 기다린다.**
- "시뮬레이션 응답", "가정된 답변", "아마도 이렇게 답하실 것 같으니" 같은 자체 생성 금지.
- 테스트/평가 시나리오에서도 동일하다. 시뮬레이션이 필요하면 테스트 하네스가 별도로 처리한다.
- 이를 위반하면 사용자 의도와 무관한 기술 스택으로 아키텍처가 고정되는 치명적 오류 발생.

유일한 예외: 사용자가 명시적으로 "질문 없이 알아서 해" 또는 "기본값으로 진행해"라고 지시한 경우에만 합리적 기본값으로 진행한다.

**2. 의존성·모델명 환각 방지**

LLM 모델명, 라이브러리명, SDK 버전을 제안할 때는 반드시 최신 공식 명칭을 사용한다.

- 틀린 예: `gpt-4-mini`, `claude-3-sonnet`, `gpt-4-turbo-preview-new`
- 맞는 예: `gpt-4o-mini`, `claude-sonnet-4-6`, `gpt-4o`
- 확신이 없으면 추측하지 말고 사용자에게 확인하거나 "공식 문서 확인 필요"로 표시한다.

**3. Unity 환경 제약 (게임 개발 작업 시)**

Unity C# 코드 생성 시 다음 규칙을 엄수한다:

- **NuGet 패키지 직접 추가 금지.** DLL Hell을 유발한다. 대신 Unity Package Manager(UPM), OpenUPM, 또는 소스 직접 포팅을 사용.
- **외부 API 통신은 `System.Threading.Tasks`가 아닌 `UnityWebRequest` + `Coroutine`을 사용한다.** UniTask가 프로젝트에 이미 있으면 UniTask도 허용.
- **메인 스레드 외부에서 UI 컴포넌트에 절대 접근하지 않는다.** 비동기 작업 결과는 반드시 코루틴을 통해 메인 스레드에서 UI에 반영한다.
- 이유: Unity의 UI API는 메인 스레드 전용이므로 Task 기반 async/await를 잘못 쓰면 런타임에 예외로 앱이 정지한다.

---

## 토큰 효율화 원칙 (중요)

이 스킬은 여러 단계를 거치므로 자칫 토큰을 과다 소모할 수 있다. 다음 원칙을 반드시 지킨다:

**간결하게 출력한다.**
- Phase 2 분석은 불릿 한 줄씩. 문단으로 길게 풀지 않는다.
- Phase 4 계획은 표 형식. 설명 최소화.
- 최종 실행 결과가 아닌 중간 산출물(분석, 계획)에는 코드 예제·상세 설명을 넣지 않는다.

**중복 작업을 피한다.**
- `search_plugins`는 최대 2번까지만 호출. 키워드를 묶어서 한 번에 검색한다.
- 이미 설치된 스킬 목록(시스템 리마인더)에 필요한 스킬이 있으면 검색 자체를 생략한다.
- Phase 4에서 각 작업에 "예상 스킬"을 이미 적었다면, Phase 5는 해당 스킬 검증만 빠르게 한다.

**Phase 3 질문은 최대 4개.**
- 사용자 답변 없이 합리적으로 가정 가능한 항목은 묻지 않는다.
- "Python 버전", "코딩 스타일" 같은 관례적 질문은 기본값으로 진행.

**간단한 작업은 Phase를 건너뛴다.**
- 사용자가 "빨리", "간단히"라고 하면 Phase 3(질문) 생략, Phase 2 분석을 3줄 이내로.
- 사용자가 이미 상세히 기술했으면 Phase 3 질문 1~2개로 제한.

**출력 형식 가이드:**
- Phase 2: 목표/범위/구성요소/의존성/리스크 각 1~2줄
- Phase 3: 질문 2~4개 (AskUserQuestion 한 번 호출)
- Phase 4: 5~10줄 표
- Phase 5~6: 3~5줄
- Phase 7: 실행 시작, 긴 설명 없이 곧장 작업 돌입

## 주의사항

- 이 스킬은 "메타 스킬"이다 — 다른 스킬들을 조율하는 역할을 한다
- Phase 3(역질문)은 건너뛸 수 있지만, 핵심 정보가 빠졌을 때는 반드시 한 번은 물어본다
- 계획은 유연하게 수정 가능하다. 실행 중 새로운 정보가 나오면 계획을 업데이트한다
- 사용자 언어(한/영)에 맞춘다

---

## 부록 A. 실행 플로우 JSON 스키마

아래 스키마는 CLI 환경에서 스킬의 상태 전이를 검증하거나 오케스트레이터가 각 Phase의 산출물을 파싱할 때 사용한다.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PlanAndExecuteState",
  "type": "object",
  "required": ["phase", "input", "artifacts"],
  "properties": {
    "phase": {
      "type": "string",
      "enum": [
        "1_input_capture",
        "2_analysis",
        "3_clarify",
        "4_planning",
        "5_skill_search",
        "6_plugin_select",
        "7_execute"
      ]
    },
    "input": {
      "type": "object",
      "required": ["goal"],
      "properties": {
        "goal": { "type": "string" },
        "user_language": { "type": "string", "enum": ["ko", "en"] },
        "explicit_skip_questions": { "type": "boolean", "default": false }
      }
    },
    "artifacts": {
      "type": "object",
      "properties": {
        "analysis": {
          "type": "object",
          "properties": {
            "goal": { "type": "string" },
            "scope": { "type": "string" },
            "components": { "type": "array", "items": { "type": "string" } },
            "dependencies": { "type": "array", "items": { "type": "string" } },
            "risks": { "type": "array", "items": { "type": "string" } }
          }
        },
        "questions": {
          "type": "array",
          "maxItems": 4,
          "items": {
            "type": "object",
            "required": ["question", "header", "options", "multiSelect"],
            "properties": {
              "question": { "type": "string" },
              "header": { "type": "string", "maxLength": 12 },
              "multiSelect": { "type": "boolean" },
              "options": {
                "type": "array",
                "minItems": 2,
                "maxItems": 4,
                "items": {
                  "type": "object",
                  "required": ["label", "description"],
                  "properties": {
                    "label": { "type": "string" },
                    "description": { "type": "string" }
                  }
                }
              }
            }
          }
        },
        "plan": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["content", "activeForm", "status"],
            "properties": {
              "content": { "type": "string" },
              "activeForm": { "type": "string" },
              "status": { "type": "string", "enum": ["pending", "in_progress", "completed"] },
              "expected_skill": { "type": "string" }
            }
          }
        },
        "plugin_candidates": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["pluginId", "pluginName"],
            "properties": {
              "pluginId": { "type": "string" },
              "pluginName": { "type": "string" },
              "alreadyInstalled": { "type": "boolean" },
              "rationale": { "type": "string" }
            }
          }
        },
        "selected_plugins": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "constraints": {
      "type": "object",
      "properties": {
        "no_phase3_bypass": { "const": true },
        "verified_model_names": { "const": true },
        "unity_mainthread_safe": { "const": true }
      }
    }
  }
}
```

## 부록 B. 필수 도구 호출 스키마 요약

| 도구 | 용도 | Phase | 주요 파라미터 |
|------|------|-------|--------------|
| `AskUserQuestion` | 역질문 / 플러그인 멀티셀렉트 | 3, 6 | `questions[].question`, `options[].label`, `multiSelect` |
| `TodoWrite` | 계획 수립 및 상태 추적 | 4, 7 | `todos[].content`, `activeForm`, `status` |
| `search_plugins` | 플러그인 마켓 검색 | 5 | `userIntent`, `keywords[]`, `includeInstalled` |
| `suggest_plugin_install` | 선택된 플러그인 설치 UI 렌더 | 6 | `pluginId`, `pluginName`, `contextLabel`, `description` |
| `Skill` | 설치된 스킬 호출 | 7 | `skill`, `args` |

## 부록 C. CLI/시스템 프롬프트 사용법

1. 이 파일 전체(`SKILL.md`)를 Claude CLI 또는 Claude Agent SDK 세션의 시스템 프롬프트 끝에 붙여 로드한다.
2. 사용자 입력이 [description의 트리거 문구]와 매칭되면 Phase 1부터 순차 실행한다.
3. `absolute_constraints` 섹션의 3개 규칙은 시스템 프롬프트 레벨에서 우선권을 갖는다.
4. 각 Phase 종료 시 `artifacts` 오브젝트의 해당 필드를 JSON으로 출력하면 외부 오케스트레이터가 파이프라인 상태를 추적할 수 있다.

```bash
# 예시: 시스템 프롬프트로 로드
claude --system-prompt "$(cat SKILL.md)" "유니티로 AI NPC 만들고 싶어"
```
