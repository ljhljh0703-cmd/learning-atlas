---
created: 2026-07-25
updated: 2026-07-25
type: learning
category: methods
tags: [video-generation, ai-filmmaking, prompt-craft, consistency, teardown]
source: "higgsfield.ai/community — 프로젝트 상세 '4K Blockbuster Breakdown' (adilinthewild) 실독. 로그인 불요(공개). 커머셜 대조군 EMERALD FRAGRANCE(thomas_lundstrom)"
---
<!-- AI 영상 생성을 '슬롯머신 아닌 연출된 공예'로 다루는 일관성·프롬프트 방법론 (Higgsfield breakdown 해체). -->

# Higgsfield 영상 프롬프트 공예 (AI Filmmaking as Directed Craft)

> ⚠️ **provisional** — Claude 브라우저 실독·제안, 작가 컨펌 전. **범위 정직**: 완전 방법론은 "Breakdown/Academy" *교육형* 프로젝트에만 노출(4K Blockbuster = 플래그십). 일반 프로젝트는 영상+통계뿐 → 사실상 n=1 심층 샘플. PK-015 부활 = 작가 실제 영상작업 착수 시 추가 샘플 심층.

## 핵심 철학
**"AI를 슬롯머신이 아니라 *연출된 공예*로."** 1인·무크루로 studio-scale 액션 단편(13,491 생성·937,489 크레딧≈$42K·141.6GB)을 뽑되, 무작위 뽑기가 아니라 *통제된 파이프라인*으로. → 이 한 줄이 vault 프롬프트 규율(deny-first·하드컨트랙트)과 정확히 동형.

## 방법 5부 (재사용 골격)

1. **에셋 우선 일관성 (anti-drift 핵심)** — 촬영 *전에* 재사용 에셋 전부 생성: 캐릭터 시트·소품 시트·로케이션 플레이트. **단일 얼굴 시트로 identity drift 차단**, 의상 변형(찢긴 옷 등)·역앵글 플레이트(대화컷 배경 고정) 미리 제작. 모든 에셋 **@tag 명명 + 레퍼런스 라이브러리(Elements)에 미러링** → 프롬프트가 레퍼런스에 자동 매칭, 샷 간 어긋남 0.
2. **Style Prefix = 재사용 프롬프트 템플릿** — 모든 샷 프롬프트 앞에 붙는 다축 스타일 락(아래 §템플릿). 공유 시네마틱 룩(anamorphic 21:9·핸드헬드·in-camera 전환)을 전 컷에 강제.
3. **하드 positive 락** — headcount·화면 지오메트리·소품 상태·180° 축을 *프롬프트에 명시적으로 써넣음*(확률에 맡기지 않음). = vault 하드컨트랙트/deny-first의 영상판.
4. **Claude + 커스텀 프롬프트빌딩 스킬** — 스크립트 + 커스텀 Seedance 스킬 로드한 Claude가 *평문 연출 지시 → 구조화 Seedance 2.0 프롬프트*로 번역. = dispatch-builder·[스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](spec-to-prompt-closed-loop.md)의 영상 생성 적용.
5. **반복 = 진짜 방법** — 4K 배치 생성 → 각 배치 최고 몇 초만 추출 → stitch. 씬별 폴더로 수백 생성 관리. in-camera 전환은 dust whiteout에 숨기고, diegetic 사운드만(음악은 후반).

## Style Prefix 템플릿 (다축 락 — 작가 영상작업 시 인스턴스화)
```
Style: <해상도·화면비>. Photoreal live-action — no 3D/game-engine/animated read.
Cinematography: <장르 언어 — 크래시줌·POV 옵틱스 등>
Lighting: <동기부여된 단일 광원들>
Color: <월드별 그레이드 + 채도 액센트 1>
Camera: <물리 렌즈 성격 · 컷당 FOV 고정 · mid-segment drift 금지>
Skin: <pore-level realism>
Acting: <micro-pause·startle 등 근육 단위 연기>
Physics: <중력·관성·질량·입자 거동 준수>
Continuity: <캐릭터·소품·환경 레퍼런스에 락, identity drift 금지>
Audio: <환경 SFX + 대사만, 음악 X>
```

## 검증 — delta·시너지 (흡수 4대 규율)
- **① 한계**: n=1 심층 샘플. 크레딧 $42K = 개인엔 비현실적(댓글 다수 지적) → *비용 프론티어* 자료지 재현 레시피 아님. 특정 툴(Seedance/Elements) 종속.
- **② delta vs vault**: 하드락·Claude-번역은 vault 하드컨트랙트/dispatch-builder **확증 + 영상 신규 도메인 적용**. **에셋 우선 @tag 일관성 락 = 영상용 신규 기법**(vault 미보유 — 창작/게임 캐릭터 일관성 우려와 개념 동형이나 영상 파이프라인 각도는 없었음).
- **③ 시너지**: SKILL M2(비주얼 목업)에 Style Prefix + 하드락 이식 가능. 캐릭터 일관성은 [픽셀아트 게임 에셋 제작 심화](../techniques/pixel-art-game-assets.md)·창작 온톨로지와 교차.
- **④ 선행**: vault 프롬프트 규율이 이미 상류(deny-first·spec-to-prompt) → 영상은 그 규율의 *적용처*.

## 반영처 후보 (승격 시)
- SKILL M2 — Style Prefix 다축 락 + 하드 positive 락 프리셋.
- 작가 실제 영상 생성 작업 착수 시 = 본 5부 골격 인스턴스화.
- 관련: dispatch-builder(프롬프트 컴파일 동형) · PK-015.
