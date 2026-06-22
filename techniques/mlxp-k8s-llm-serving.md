---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [infra, kubernetes, llm-serving, istio, distributed-inference, lws, fault-isolation, naver]
source: MLXP - Kubernetes LLM Serving 최적화 기술 도입기 (NAVER D2)
authors: [정지윤, 장혁진]
year: 2026
category: technique
---

# MLXP — Kubernetes LLM Serving 최적화 (NAVER, 정지윤·장혁진)

*NAVER D2 발표(클라우드 AI 솔루션 ML 시스템) · NotebookLM 충실(depth) 외주 ④Gate PASS · **순수 인프라 지식**(작가 직접 도메인 아님 — Track3 면접 배경지식 + 미래 인출용 박제)*

네이버 MLXP(ML 플랫폼)에 대규모 LLM 서빙 최적화 2종(KV캐시 기반 **다이나믹 라우팅** + **멀티노드 인퍼런스 LWS**)을 도입하며 Istio 서비스 매시와 부딪힌 네트워크 충돌을 L4/L7 단위로 분해해 푼 트러블슈팅 사례, 그리고 분산추론 그룹의 가용성을 보장하는 **GDB(Group Disruption Budget)** 설계. 학습 가치 = "오픈소스(KServe·LWS) 설치로 끝이 아니라, *서비스 매시와 결합 시 발생하는 충돌을 보안 계층별로 분해*하는 사고"의 1차 사례.

---

## 한 줄 요약

> 쿠버네티스에서 큰 모델을 노드 여러 대에 쪼개 서빙(멀티노드 인퍼런스)할 때, Istio 가 노드 간 평문 TCP 통신을 MTLS 실패로 차단한다 — 이를 *서빙포트는 L7 보호 / 나머지는 Istio 우회+Cilium L4 격리* 투트랙으로 풀고, 그룹 단위 장애격리(GDB)로 가용성을 지켰다.

---

## 1. 두 최적화 기술

- **다이나믹 라우팅** — 요청을 처리할 *최적 팟*으로 보냄. 워크플로우: 클라이언트→Gateway 진입 → Gateway 가 **EPP(Endpoint Picker)**에 최적 팟 요청 → EPP 가 주기 수집 매트릭(**KV캐시 상태** 등) 기반 최적 팟 IP 응답 → Gateway 가 그 팟으로 라우팅.
- **멀티노드 인퍼런스(LWS, LeaderWorkerSet)** — 노드 한 대 capacity 가 모자라도 큰 모델 서빙 가능. LWS = 리더+워커셋을 묶어 배포하는 K8s 리소스. KServe 신규 리소스(LLM Inference Service)로 복잡한 구성 자동화.
- **통신 구조**: 노드 *내부* = NCCL Reduce / 노드 *간* = 파이프라인 패러렐리즘용 일반 TCP + ZMQ 데이터 채널(랜덤 포트).

---

## 2. 트러블슈팅 3종 (Istio 서비스 매시 충돌)

> 핵심 = "포트를 하나씩 열어주는 방식으로는 구조적 해결 불가"(랜덤 포트라서). 보안 계층(L4/L7)별로 분해해야 함.

1. **노드 간 TCP 차단 → 투트랙 보안** — Istio 사이드카가 VLM 의 평문 TCP 를 MTLS 핸드쉐이크 실패로 간주·차단. ZMQ/RPC 가 랜덤 포트라 사전 개방 불가. **해결**: 서빙 포트(8000)만 Istio 인바운드로 가로채 L7(MTLS) 보호 / 나머지(ZMQ·RPC)는 Istio 우회(평문 TCP)하되 **Cilium Network Policy 로 같은 LWS 그룹 라벨 팟끼리만 통신**(L4 격리).
2. **Gateway↔EPP HTTP 500** — EPP 컨테이너 포트 이름이 `GRPC` 라 Istio 가 강제 L7 HTTP/2 파싱 시도→실패. **해결**: Istio `Sidecar` CR 로 EPP 인바운드 프로토콜을 TCP 로 오버라이드(L7 파싱 우회).
3. **EPP 매트릭 수집 HTTP 503** — EPP 가 VLM 팟 IP 직접 접근 시 MTLS 아이덴티티 없어 Istio Passthrough 가 Deny. **해결**: `ServiceEntry` 로 VLM 팟 IP 대역 등록 + `DestinationRule` 로 MTLS 활성화 → EPP 직접 접근에도 자동 MTLS 캡슐화.

---

## 3. GDB (Group Disruption Budget) — 그룹 단위 장애격리

- **문제**: 기존 **PDB(Pod Disruption Budget)**는 *팟 단위*만 보호 → LWS 그룹 경계를 인식 못 함. 그룹 내 팟 하나만 죽어도 그룹 전체 재시작(연쇄 장애). + Volcano **갱 스케줄링**으로 "모든 팟 동시 배치 가능할 때만 일괄 스케줄"은 해결했으나, *드레인/eviction 시점 그룹 보호*는 별개 문제.
- **GDB 설계**: ① 대상 = 라벨 셀렉터 대신 **LWS 네임**으로 그룹 묶음 ② 가용도 기준 = '팟 수'가 아닌 **'그룹 단위(수/퍼센트)'** ③ 효과 = 노드 드레인 시 허용된 수의 그룹만 eviction → 연쇄 그룹 다운 차단.

---

## 한계·미검증 (격상 금지)

- **타임스탬프 없음**: 텍스트 소스 외주 → (블록 n) 대체 표기(정직).
- **자막 오인식 정리됨**(RETURN §6): `LLM`(←LRM), `Inference`(←임포런스), `Eviction`(←이비션), `MTLS Handshake`(←핸드이), `Disruption`(←디스프션), `AuthorizationPolicy`(←어썰어진 폴리시).
- **모델명 `DeepSeek V4`(←딥 V4) = 자막 추정, 박제 X**(verifier-claims-need-regate). 멀티노드가 필요한 "큰 모델" 맥락 예시일 뿐.
- 정량 성능 지표(throughput/latency 개선치) = 소스 미언급.

---

## 반영 (학습→반영 루프)

- ❌ **반영처 없음 (순수 인프라 지식)** — 작가의 현 시스템(로컬 vault·게임·하네스)은 K8s 분산서빙 인프라가 없어 직접 적용처 0. 억지 반영 금지(Karpathy #2/#3).
- 🔗 **약한 개념 연결(흡수만, 룰 신설 X)**: GDB "장애격리 단위를 *그룹*으로 잡는다" 철학 ↔ vault 의 *세션/디스패치 격리 단위* 사고와 동형(개념 정합만, 인프라 차용 아님).
- 💼 **Track3 면접 배경지식**: LLM 서빙 인프라/MLOps 직군 지원 시 "분산추론·서비스매시 충돌"을 이해하는 배경. 이력서 *직접 자산 아님*(작가 경험 X) — talking point 수준.

---

## 연결된 페이지

- [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](../methods/playwright-e2e-agent-harness.md) · [AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)](../methods/autoresearch-llhls-abr.md) (형제 NAVER D2 발표 — 외주 흡수 묶음)
- goals (Track3 면접 배경지식 — MLOps/인프라 직군)
