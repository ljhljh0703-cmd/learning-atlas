---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [game, teardown, ai-npc, streamer-game, backrooms, memory-architecture, viewer-control]
source: "YouTube @akarolls channel (45 videos + 54 shorts scan, 2026-07-06)"
authors: [akarolls]
year: 2026
category: technique
---
<!-- YouTube 공개 자료만으로 역기획한 실제 출시 AI 스트리머 게임(SIA) teardown — AI NPC 무능력·기억 구조 설계 레퍼런스 -->

# SIA (YouTube AI 스트리머 게임) 역기획 — 사례 연구

## 정체
`@akarolls` 채널이 만드는 실제 프로젝트. 백룸 호러 로그라이트 안에서, 플레이어는 캐릭터를 직접 조작하지 않고 **초보 AI 스트리머 Sia에게 조언만 하는 시청자** 역할. Sia의 오해·패닉·뒤늦은 반응이 버그가 아니라 재미 루프 그 자체. Codex가 42개 핵심 영상 메타데이터·캡션·프레임을 수집·확신도 라벨링(visible/source-reported/strong_inference/weak_inference/not_implemented/unknown)해 역설계.

## 왜 훔칠 가치가 있나
- **조작자가 아닌 시청자 프레임**: 직접 조작 대신 조언/응원/장난 — AI NPC 게임에서 "불완전한 AI 제어"를 결함이 아니라 정체성으로 전환하는 검증된 패턴.
- **죽음 = 방송 종료**: 실패를 표준 게임오버가 아니라 콘텐츠·팔로워 결과로 재정의.
- **보조 인터랙션 레이어**: 조언만으로는 반복피로 → 인벤토리 정리·업그레이드 같은 "직접 만지는" 서브루프 병행(추론만 아니라 확인된 시스템).
- **메모리 유니버스**: Discord 대화 → 임베딩 → PCA 3D 투영 → 시맨틱 클러스터링 → 검색 하이라이트 → 삭제 시 블랙홀 애니메이션 → 다이어리 → 페르소나 형성. 단, "메모리→실제 게임 행동 반영"은 2026-07-05 시점 명시적으로 **작업 중(미구현)** — 이 경계를 넘겨짚지 말 것.
- **구현 순서 제안**: 결정론적 NPC+챗파서 → 가시적 불확실성/지연 반응 추가 → 메모리를 1급 아티팩트로 먼저 만들고(검색·클러스터·승급·삭제·다이어리) → 그 다음에만 페르소나/메모리를 평가 게이트 하에 행동 정책에 연결.

## 저작권/재현 경계
Sia 캐릭터·이름·목소리·아바타·로고·정확한 UI·노래/MV·"Backrooms Run" 브랜딩·다이어리 텍스트·Discord 커뮤니티 자산은 **모방 금지**. 훔칠 것은 패턴(뷰어 전용 조작, 무능력의 가시화, 메모리 검사가능성)이지 표현이 아님.

## 미확인 사항 (Do Not Claim)
LLM provider, 임베딩 모델, 벡터 DB 제품, 삭제 방식(hard/soft/tombstone), PCA 계산 시점(실시간/오프라인), 메모리가 실제 런타임 행동 선택에 쓰이는지 여부 — 전부 미확인. 확정 사실처럼 인용 금지.

## 활용처
- backrooms-escape-pre-gdd — 백룸 소재 자체는 무관한 별개 신규작이지만, "무능력이 재미가 되는" 프레임은 §5 레퍼런스 인터뷰 시 검토 후보.
- ai-npc-engine — 메모리 유니버스(임베딩→클러스터→다이어리→페르소나) 설계는 Memory Stream/Reflection 레이어 참조 대상. 단 "메모리가 게임 행동에 연결"은 SIA도 아직 미구현이라는 점에서 ai-npc-engine의 현재 리스크(장기 미검증)와 동형 — 낙관 경계 사례로도 유용.

원 산출물(전 확신도 라벨·영상별 근거·구현 스펙·티켓): `~/Documents/Codex/2026-07-06/sia-youtube-reverse/outputs/` (asset.md/implementation-spec.md/tickets.md, SHA256SUMS 검증 완료).
