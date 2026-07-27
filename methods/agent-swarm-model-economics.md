---
created: 2026-07-21
updated: 2026-07-21
type: learning
category: method
tags: [agent-swarm, multi-agent, model-routing, cost-economics, orchestration, planner-worker, teardown]
source: ["https://cursor.com/ko/blog/agent-swarm-model-economics"]
authors: [Cursor]
year: 2026
---
<!-- Cursor "Agent Swarm Model Economics"(SQLite 재구성 실험) 해체. 프런티어 플래너+싼 워커 계층 스웜의 달러 실증 + 6대 조율 실패모드. 작가 §4 비용·모델 라우팅 독트린의 하드넘버 뒷받침. ⚠벤더편향(Cursor=Composer 판매)·n=1. -->

# 에이전트 스웜 모델 경제학 (Cursor 해체)

> **정체**: 에이전트 스웜 = **계층형(프런티어 플래너 + 싸고 빠른 워커)**, 트리가 태스크 윤곽에 맞춰 확장. 핵심 통찰 = **"스웜이 스케일하는 건 병렬성이 아니라 *컨텍스트 효율* 때문일 수 있다."** 중심 테제 = *프런티어 지능은 몇 순간(분해·설계·트레이드오프)만 필요, 플래너가 모호함을 상세 지시로 바꾸면 싼 워커가 그냥 따른다.* 출처: Cursor 블로그 SQLite 재구성 실험, read-only 해체 2026-07-21.

## 하드넘버 (SQLite 재구성, 4h 통과율 + 비용) ★
| 구성 | 통과율 | 총비용 |
|---|---|---|
| GPT-5.5 양쪽 | 85% | $10,565 |
| Grok 4.5 양쪽 | 2h 내 실패 | — |
| **Opus 4.8 플래너 + Composer 2.5 워커** | **100%** | **$1,339** |
| Fable 5 플래너 + Composer 워커 | 100% | $1,607 |

- **플래너 = 토큰 ~5%인데 비용 67% / 워커 = 토큰 95%인데 비용 33%.** (프런티어 플래닝: 토큰 적지만 토큰당 비쌈. 워커: 대량이나 쌈.)
- 워커 토큰 비용: GPT-5.5 이중역할 $9,373 vs Opus-플래닝 하 Composer 워커 $411 (≈23×).
- 코드 효율: 신 아키텍처가 동일 테스트 통과에 필요한 코드 대폭 절감(Opus믹스 4,645줄 vs 구 19,013줄).

## 비직관 통찰 ★ — 플래너 품질의 하류 레버리지
더 싼 플래너(Fable 5)는 *플래너 단계* 비용은 약간 낮지만, **워커가 몇 배 더 토큰을 쓰게 만들어 총비용 상승.** → **좋은 플래너 = 명확한 스펙 = 워커 덜 헤맴 = 총액 저렴.** 모델 라우팅에서 "플래너에 싼 모델" 최적화는 국소적 오류일 수 있다 — 플래너는 *총 시스템 비용의 상류 레버*.

## 스케일 조율 6대 실패모드 (~1000 commits/sec) — 오케스트레이션 교훈
1. **Split-brain 설계**(플래너들이 같은 개념 제각각 재구현) → 설계결정 중앙화(플래너에게 중앙 설계 지시).
2. **플래너 경합**(상태 인식 충돌) → 컴파일러 검증되는 공유 설계문서.
3. **머지 충돌**: 구 70,000+ → 신 <1,000/4h.
4. **메가파일**(핫스팟 1파일 7,771충돌/1,173에이전트 → 신 최악 47) → 에이전트가 비대파일 플래그, 외부 조정자 리팩터.
5. **경직화**(코어 코드 회피) → 의도적 breaking change + 컴파일러 에러로 전파.
6. **계층 리뷰**(대화이력 vs 출력 vs 코드베이스만 = 서로 다른 오류 클래스 포착).

## 냉정 평가
- **벤더 편향 ★**: Cursor가 **Composer(싼 워커 모델)를 판다.** "Opus 플래너 + Composer 워커 최적" 결론엔 자사 제품 피치가 섞임. 숫자는 실측이나 실험 설계·모델선택에 이해관계. (단 플래너-워커 분업 *원리*는 벤더 무관하게 성립.)
- **n=1 벤치**(SQLite 재구성, 코딩 특화). 타 도메인 일반화 미입증. 블로그(비심사), "부정행위 없음"은 사후 수동 확인.
- GPT-5.6 Sol = "통제불능 피드백 루프" 롤백. "spec as prompt"는 견고한 의도명세 아직 부재(자인). 워커는 머지충돌 해결 취약(중재자 필요).

## vault delta / synergy
- **§4 비용·모델 라우팅 독트린의 달러 실증** ★ — CLAUDE.md §4 "복잡=대형 / 결정적·반복=싼 모델·외주"를 숫자로 뒷받침. **"플래너 품질=워커 총비용 상류 레버"**는 vault에 없던 정교화(§4에 크로스레퍼런스 반영 2026-07-21).
- **멀티에이전트 오케스트레이션**: 6대 실패모드+해법이 [Pattern: Multi-Agent Audit (병렬 위임 감사)](prompt-pattern-multi-agent-audit.md)·[Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)](factory-ai.md)·[NaverMadCat — 에이전트 "회사" 운영 델타 (조직·라이프사이클·HR·비용)](naver-madcat-agent-org.md)·Workflow/harness-factory 설계에 직접 이식(특히 split-brain=공유 설계문서, 계층 리뷰=다관점).
- **spec-as-prompt / 확률적 컴파일러** → [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md)·[스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](spec-to-prompt-closed-loop.md)·[The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) 계열(추상화 상승: 줄→블록→함수→파일→스펙).
- **반영**: [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) ①Apply(§4 크로스레퍼런스) + ②Park(스웜/Workflow 설계 시 6 실패모드 인출). 억지 반영 X — 작가 vault는 소규모 단일작가라 1000 commits/sec 스케일 무관, *분업 원리·플래너 레버·실패모드*만 취함.
