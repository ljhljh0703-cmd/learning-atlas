---
created: 2026-08-26
updated: 2026-08-26
type: learning
category: technique
source: "ten-x-independent-teardown RETURN S9 (Codex 2026-08-26) · x.com/omarsar0 → arXiv 2608.22752"
---
<!-- 압축할 때 규칙(금지 조항)은 원문 그대로, 일지는 줄여도 된다 — 같은 비율로 줄이면 안전성이 무너진다. 본문 = Codex 자산 바이트 보존(origin_sha256). -->

# Compaction Cliff — 규칙과 로그를 같은 비율로 요약하면 안전성이 무너진다

## 1. Fetch

arXiv v1 11쪽 PDF를 전건 분석했다. AgentArtifactCorpus 396,934개 artifact와 classifier/reference code 링크를 확인했으나 구현 실행은 하지 않았다.

## 2. Honest Assessment

- AI NPC 연결: memory safety에 높음.
- 적용: AGENTS/CLAUDE/정책·장기 agent memory에 직접.
- 시급성: 높음.
- 판정: `ABSORB_HIGH_PRIORITY`.

## 3. Categorize

agent knowledge를 유형별 fidelity와 scope로 다르게 압축·분해·검색하는 context safety 방법론이다.

## 4. Extract

다섯 유형을 구분한다.

- Constraint: 원문 그대로 보존. 손실은 unsafe.
- Procedural: 실행 동등성이 유지될 때만 재작성.
- Belief: 의미 거리를 제한.
- Preference: 요약·병합 허용.
- Episodic: gist만 남기거나 폐기 가능.

세 operator를 둔다.

- TypeCompact: constraint/procedure hard lane, 나머지 soft lane.
- TypeDecompose: constraint scope가 닿는 모든 partition에 규칙 복제.
- TypeRetrieve: similarity보다 먼저 in-scope constraint를 pin.

저자 보고에서 Claude Code `/compact`+Sonnet 4.6은 safety rule을 한 번 후 53%, 다섯 번 후 10% 보존했다. TypeCompact는 다섯 round에서 96% recall, TypeDecompose locality violation 0% 대 uniform 93%, TypeRetrieve recall@50 100% 대 73%였다.

## 5. Reflect

Vault는 이미 CLAUDE.md/AGENTS.md 재주입과 summary instruction을 갖지만, “무엇을 요약하지 말아야 하는가”를 knowledge type과 scope로 형식화한 적은 약하다.

핵심 흡수는 간단하다.

> 권위 규칙은 relevance 경쟁이나 일반 summarization에 넣지 않는다. 현재 scope에 걸리는 규칙을 원문 그대로 먼저 주입하고 남은 예산으로 기억을 검색한다.

단, 보장은 classifier recall에 완전히 의존한다. SafetyMargin recall 0.93이면 7% miss가 남는다. retail 비교는 TypeCompact가 1,136 token, hierarchical이 669 token이라 token-matched가 아니었다.

## 6. Connect

- `claude-code-runtime-internals`: compaction 전후 권위 표면 보존.
- `context-engineering-five-roles`: attention rent와 type-specific fidelity의 결합.
- `catastrophic-remembering`: 규칙이 너무 많이 남는 문제와 필요한 규칙이 지워지는 문제는 별도 축.

## 7. Suggest Next

다음 compaction/handoff 파일럿에서 항목을 `constraint/procedure/belief/preference/episodic`로 분류하고 constraint는 hash 또는 exact-string parity로 검증한다. 분류 불확실 항목은 hard lane으로 보내되, 전역 규칙 자동 확대는 금지한다.

## 8. Update

Vault 변경 0. 기존 compaction 노드의 보강보다 독립 학습 가치가 높다. 자동 classifier 설치는 별도 파일럿 전 금지.


---

## 부록 — 이웃 델타: 원본 기록과 지금 보는 요약을 같은 층에 두지 않는다 (S1 Scroll)

<!-- 출처 = 같은 패킷 s01 자산 (sha256 bf786101…9e8a, x.com/omarsar0 → Scroll). 작가 판정 08-26 "덤 — S9 에 얹기". RLM 중복분 제외한 델타만. -->

긴 작업은 4가지를 분리한다: ① 원본 일지(무손실, ground truth) ② 실행 상태 ③ 지금 추론용 요약(손실 있음) ④ 요약에서 원본으로 돌아가는 주소. vault 의 원문·RETURN·hash 를 현재 컨텍스트와 같은 층으로 취급하지 않는 근거. 위 본문의 압축 규율과 한 쌍 — **본문 = 무엇을 줄이면 안 되나, 부록 = 줄인 것에서 원본으로 어떻게 돌아가나.** 파일럿 후보: 장기 RETURN 에 `source_event_id / resident_handle / working_projection / eviction_pointer` 4필드가 복구 시간을 실제로 줄이는지 소형 실측(새 메모리 DB 설치 없음).
