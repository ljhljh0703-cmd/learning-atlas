---
created: 2026-08-25
updated: 2026-08-25
type: learning
category: method
source: three-x-harness-delta RETURN (Codex 2026-08-25)
---
<!-- ACES(arXiv 2608.20614, NVIDIA) — 스킬 문서 점수와 실제 성능 기여는 상관 0 · content lift ⊥ routing premium. 설치 0. 본문 = Codex 자산 바이트 보존(origin_sha256), frontmatter만 vault 갱신. -->

# ACES — 스킬 문서 점수와 실제 에이전트 성능을 분리한다

## 1. Fetch

X 공식 oEmbed로 게시물을 확인하고 arXiv v1 15쪽 PDF를 전건 분석했다. 공개 구현 `NVIDIA/SkillEvaluator`는 HEAD `009aa300be7925c7ba75760592baeb941cc29ba8`, Apache-2.0, v0.2.1이다. Python syntax compile은 통과했고 135개 test 파일을 확인했지만 의존성 설치와 기능 테스트는 하지 않았다.

## 2. Honest Assessment

- AI NPC 연결: 평가·routing 층에 간접.
- 적용: 현행 하네스·skill Gate에 직접.
- 시급성: 다음 M/G급 skill 평가 시 높음.
- 판정: `ABSORB_DELTA_HIGH / DO_NOT_INSTALL_YET`.

## 3. Categorize

스킬을 문서가 아니라 실행 가능한 capability artifact로 평가하는 repository-native continuous evaluation 방법론이다.

## 4. Extract

### 핵심 구조

1. Tier 1: schema·license·PII·Unicode·security 등 정적 검사.
2. Tier 2: 기존 catalog와 semantic overlap 검사.
3. Tier 3: 같은 task/model/harness/sandbox/scorer에서 target skill을 넣은 arm과 뺀 arm을 실행.
4. 각 실행을 ATIF(Agent Trajectory Interchange Format)로 정규화.
5. accuracy, goal accuracy, expected behavior, skill execution, efficiency, security를 함께 평가.
6. `Skill Lift = with-skill reward - baseline reward`로 주변 조건에서의 한계 기여도를 보고.

### 신규 실험 델타

- **Isolation lift**: target skill만 보이는 상태에서 내용 자체의 기여도를 측정.
- **Group lift**: target과 support/decoy skill을 함께 보여 routing·선택까지 포함한 기여도를 측정.
- `routing premium = Lift_group - Lift_isolation`.
- baseline을 빈 workspace로 만들지 않고 reference/support skill을 고정해 “절차 내용 효과”와 “참조가 있다는 효과”를 분리한다.

### 저자 보고

- 58개 production skill, 4개 primary harness, 947 paired cases.
- 평균 composite lift 0.2134, outcome-only lift 0.1799.
- 689 positive, 171 zero, 87 negative cases.
- 문서 정적 점수와 live lift의 Spearman 상관은 Tier 1 -0.0181, Tier 2 -0.0266으로 0과 구분되지 않았다.
- visible skill이 1→20으로 늘 때 평균 wall time 258→451초. 50개는 stress condition이며 pass rate 0.55, wall time 1,290초.

## 5. Reflect

Vault에는 이미 B0/B1/H, held-out split, 비용·회귀 측정이 있어 “with vs without” 자체는 중복이다. 신규로 남길 것은 네 가지다.

1. `content_lift`와 `routing_premium` 분리.
2. 빈 baseline 대신 고정 reference decoy 사용.
3. static scan PASS를 runtime quality 증거로 사용하지 않음.
4. 모델·하네스 업데이트 후 lift를 다시 측정. 강한 모델에서는 baseline이 올라 skill의 한계효용이 줄 수 있다.

평균 lift가 양수여도 87개 case가 악화됐다. 따라서 aggregate score보다 negative-lift trajectory가 수정 후보를 찾는 데 더 가치 있다.

## 6. Connect

- `harness-gain-evaluation-contract`: 기존 B0/B1/H를 대체하지 않고 isolation/group arm을 추가하는 후보.
- `agent-gpa`: ATIF trace에서 정확한 실패 위치와 수정 component를 찾는 후속 진단.
- `context-engineering-five-roles`: visible skill 수 증가에 따른 attention/routing rent의 정량 근거.

## 7. Suggest Next

다음 M/G급 skill 하나를 대상으로만 소형 shadow pilot을 한다.

```text
B1-fixed reference set
H-iso = target only
H-group = target + fixed support/decoys
content_lift = H-iso - B1
routing_premium = H-group - H-iso
```

동일 task·model·attempt budget을 유지하고 negative case의 trace를 우선 읽는다. 공개 SkillEvaluator 전체 설치는 Harbor, agent credential, LLM grader, 추가 scanner 의존성이 필요하므로 파일럿 발화 전에는 하지 않는다.

## 8. Update

Vault 변경·도구 설치 0. 신규 skill 후보도 없다. 기존 하네스 평가 계약에 들어갈 `routing premium` reference patch 후보만 남긴다. 논문의 내부 enterprise raw trajectories는 비공개이며 harness coverage가 불균형하므로 저자 수치를 일반 법칙으로 사용하지 않는다.

