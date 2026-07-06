L0 마을 이력서에 번들한 이미지와 폰트 출처를 기록합니다.

# Asset Credits

## map-background.png

- Source: generated original raster for this L0 village resume image-map integration.
- Generator/context: author-provided GPT-generated v19 village map with a visible Learning Atlas board district, replacing the earlier placeholder/integration map.
- Date: 2026-07-01
- License/use: project-owned original image for this static resume hub.
- Content constraints: no text, no person/character, no copied game-ripped asset, no external hotlink.
- Use in this project: single background image behind the DOM overlay click zones.

No Stardew Valley original art, game-ripped assets, paid assets, CC-BY/BY-SA/NC/GPL assets, or hotlinked external images are used.

## interiors/*.png

- Files: `assets/interiors/lab.png`, `assets/interiors/workshop.png`, `assets/interiors/game.png`, `assets/interiors/studio.png`, `assets/interiors/hall.png`
- Source: GPT-generated original interior raster images already placed in this project folder before this integration pass.
- Date: 2026-06-22
- License/use: project-owned original interior backgrounds for this static resume hub.
- Content constraints: no text, no people/characters, no copied game-ripped asset, no external hotlink.
- Use in this project: modal background images behind DOM member object overlays.

## board.png

- File: `assets/interiors/board.png`
- Source: GPT-generated original raster image for the v16.1 learning-board prototype.
- Author/owner: 이주형 project.
- Generator/context: Codex built-in image generation from the user direction to retry with an internal GPT image, using the Learning Atlas board/archive-room brief.
- Date: 2026-06-30
- License/use: project-owned original interior background for this static resume hub.
- Content constraints: no readable baked text, no people/characters, no copied game-ripped asset, no external hotlink.
- Use in this project: learning board modal background behind DOM Learning Atlas links.

## tutorial/*.png

- Files: `assets/tutorial/sub-brain.png`, `assets/tutorial/harness.png`, `assets/tutorial/gate.png`
- Source: author-provided GPT-generated original raster icons for the v17 onboarding tutorial.
- Author/owner: 이주형 project.
- Date: 2026-07-01
- License/use: project-owned original tutorial icons for this static resume hub.
- Content constraints: no readable baked text, no people/characters, no copied game-ripped asset, no external hotlink.
- Use in this project: three onboarding tutorial step icons.

## Pretendard

- Source: https://github.com/orioncactus/pretendard
- Author: Kil Hyung-jin / orioncactus
- Package version: 1.3.9
- License: SIL Open Font License 1.1
- Bundled files: `assets/fonts/Pretendard-Regular.woff2`, `assets/fonts/Pretendard-OFL.txt`
- Use in this project: body copy, buttons, guide text, modal copy, and readable UI text.

## Galmuri

- Source: https://github.com/quiple/galmuri
- Author: Lee Minseo / quiple
- Package version: 2.40.3
- License: SIL Open Font License 1.1
- Bundled files: `assets/fonts/Galmuri11.woff2`, `assets/fonts/Galmuri9.woff2`, `assets/fonts/OFL.txt`
- Use in this project: main title, short map labels, badges, and compact code labels.

The font files are self-hosted and loaded through `@font-face`; no external font CDN is used at runtime.

## Go Lucky BGM

- Source: https://opengameart.org/content/go-lucky
- Author: Chasersgaming
- License: CC0 1.0 Universal
- Original files: `golucky.oggvorbis.ogg`, `golucky.mp3_0.mp3`
- Bundled files: `assets/audio/village-bgm.ogg`, `assets/audio/village-bgm.mp3`
- Runtime behavior: the optional BGM toggle is OFF by default and plays only after user activation.

## v21 — 3D 은하 뷰
- Three.js r165 (MIT License, © 2010-2024 Three.js Authors) — `universe-3d.js`에 esbuild로 번들. https://github.com/mrdoob/three.js/blob/dev/LICENSE
- 3D 씬 코드(셰이더·컨트롤·트윈·라벨 투영)는 자작(주형월드 그린필드 빌드 이식).
