---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [style-transfer, image-reference, semantic-region, preproduction, design, diffusion]
source: https://arxiv.org/abs/2603.10354
authors: [Boyu He, Yunfan Ye, Chang Liu, Weishang Wu, Fang Liu, Zhiping Cai]
year: 2026
doi: arXiv:2603.10354
category: technique
---
<!-- StyleGallery(arXiv 2603.10354) — 제어축을 프롬프트 텍스트→이미지 레퍼런스 세트로 이동. region별 시맨틱 스타일 전이. concept prepass지 production 아님. -->

# Semantic Style-Gallery Prepass (StyleGallery, arXiv 2603.10354)

Codex ③Gate PASS 2026-07-06(무결성 재발행·SHA 3/3·commit `bd31294` 재검증). **미실행 개념 노트** — 스택(SD1.5+DINOv2+DepthAnything, 4090) 재현 0, 아래는 방법·경계·코드앵커만.

## 0. 신규 델타 (vault 결여분)

제어축을 **프롬프트 텍스트 → 이미지 레퍼런스 세트**로 이동. 스타일을 단일 이미지/문구가 아닌 *큐레이션 다중 exemplar 갤러리*로 취급 + **region-by-region** 시맨틱 매칭. vault의 [이미지 프롬프트 컴파일러 규칙 — gpt-image-2 긍정형 제약 체계](../methods/image-prompt-compiler-rules.md)(프롬프트 텍스트 제약)를 *이미지-레퍼런스 regional 제어*로 보완. 기존 픽셀아트/스프라이트 파이프라인의 **앞단 prepass**(대체 아님).

## 1. 방법 (3-stage, training-free)

1. **시맨틱 region 분할** — DDIM inversion T스텝 → UNet 중간 피처 → adaptive weighting → PCA+K-means → depth/SAM으로 refine.
2. **클러스터 매칭** — content↔style 클러스터 유사도 3소스: 통계(UNet/self-attn) + 시맨틱(DINOv2) + 위치(최소외접원). 구현식 `0.25·combined_sim + dinov2_sim + 0.125·overlap`. 다중 레퍼런스는 클러스터별 pool(전역 평균 blur 아님).
3. **스타일 전이 최적화** — regional style loss(매칭 마스크 + self-attn Q/K/V) + global content loss(Q vs Q_c). content weight `lambda_c=0.26`, `eta=0.05`, Adam latent 최적화.

코드 앵커: `pipeline.py:138-216`(클러스터링)·`291-315`(DINOv2 토큰)·`317-410`(매칭식)·`455-570`(150스텝 최적화)·`572-614`(regional loss)·`demo.py:65-80`(CLI 기본값).

## 2. 경계 (핵심 — asset 방어 양호)

- **concept/style prepass지 production 아님.** DOM 구조·타이포·반응형·접근성·IA·인터랙션·성능 **미해결**.
- sprite-sheet native X · palette lock X · engine import contract X · 레퍼런스 라이선스 검증 X(기본).
- 잘못된 클러스터 마스크 = stylization 부분 붕괴(semantic leakage). 추상 구조에서 region 오병합.
- 수치(Style 0.5337·FID 16.889·User 4.43 등)·"CVPR 2026"·LCM 가속(150→28스텝, 30s→8s)은 전부 **source-reported**(미재현).

## 3. 적용 (prepass 위치)

- **게임 아트디렉션**: 프로젝트별 `style_refs/{terrain,characters,ui,fx,mood}/` → region별 concept still(프롬프트-only 아님) → concept-only 게이트(실루엣 보존·leakage·팔레트·크롭). 다운스트림 = 기존 팔레트락/lint/provenance/engine 게이트.
- **bespoke HTML**(bespoke-html-direction): 실제 스크린샷/와이어프레임 = content anchor + 스타일 레퍼런스 갤러리 → hero/section media concept. **단 토큰 harvest는 human review 후만**, 생성 raster text·fake UI 금지, concept≠production UI 라벨.
- **금지**: 웹페이지 스크린샷 통째 style-transfer해서 페이지로 출하 · 단일 락 스타일 표준화(bespoke 정합) · "implemented gameplay/production UI/real screenshot" 오칭.

## 4. 관계

- [이미지 프롬프트 컴파일러 규칙 — gpt-image-2 긍정형 제약 체계](../methods/image-prompt-compiler-rules.md) — 프롬프트 텍스트 제약(본 노트 = 이미지-레퍼런스 regional 보완).
- bespoke-html-direction — 비주얼 소스 레이어(단일 락 금지 정합).
- **skill 후보** `semantic-style-gallery-prepass`(park — GPU 실현성 OQ 미해결, 실사용 입증 후 승격). backend-agnostic "style gallery + region matching + human override" 패턴만 먼저 차용 가능(스택 실행 없이).
