---
created: 2026-06-09
updated: 2026-06-28
type: learning
category: methods
tags: [html, css, animation, svg, pixel-perfect, premium-ui]
---

# HTML/CSS/JS Premium Interaction & Animation Learnings

This document registers user UI/UX design preferences, trial-and-error processes, technical solutions, and design guidelines for HTML, CSS, and SVG/JS animation. All AI agents must reference this document when implementing or tweaking UI elements to ensure a premium user experience and maintain structural consistency across projects.

---

## 1. Profile Box & SVG Frame Alignment

### ❌ The Trial-and-Error / Mistakes
- **The Issue**: A mismatch (gap of 3px to 4px) between the static profile box border and the dynamic animating red SVG frame. The profile photo background and edges bled outside the red animating stroke.
- **Why it failed**: 
  1. The wrapper container (`.photo`) used a physical CSS border (`border: 1px solid var(--rule)`). Under `box-sizing: border-box`, this contracted the inner content box by 2px (from 168x210px to 166x208px).
  2. The SVG container had `width: 100%; height: 100%` and `inset: 0`, stretching it to the content box (166x208px). However, the viewBox and rect coordinates were hardcoded (`viewBox="0 0 168 210"`, `x="2" y="2" width="164" height="206"`), meaning the SVG coordinates scaled down, creating an inset gap of around 1.98px inside the content box.
  3. The profile image occupied the full content box (166x208px), showing through the gap between the red stroke and the container border.

###  The Premium Solution
- **CSS (Inset Box-Shadow instead of Border)**:
  Avoid physical borders on containers hosting overlaying SVG frame animations. Instead, use an inset box-shadow:
  ```css
  .photo {
    width: 168px; height: 210px;
    box-shadow: inset 0 0 0 1px var(--rule); /* Simulated border */
    position: relative; overflow: hidden;
  }
  ```
  This keeps the content area at 100% of the box dimensions (168x210px), allowing the image and SVG to occupy the exact same outer boundaries.
- **JavaScript (Dynamic Client Dimensions & Stroke Outer-Edge Alignment)**:
  Read the container client dimensions dynamically, set the viewBox 1:1, and inset the rect path by exactly **half of the stroke-width** (e.g. 1px inset for a 2px stroke):
  ```javascript
  const w = photo.clientWidth || 168;
  const h = photo.clientHeight || 210;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', '1'); r.setAttribute('y', '1');
  r.setAttribute('width', (w - 2).toString());
  r.setAttribute('height', (h - 2).toString());
  ```
  - This places the outer edge of the 2px stroke exactly at `0px` and `w` (the boundary).
  - The 2px red animating stroke completely overlays and hides the 1px inset grey box-shadow when active.
  - The outer boundaries of the container, image, and stroke match perfectly on both desktop (168x210px) and mobile (120x150px) layouts.

---

## 2. Infinite Chasing (Marquee) Loop Animation

### ❌ The Trial-and-Error / Mistakes
- **The Issue**: Having the border drawing animation complete once and stop (`forwards`) can make the UI feel static after initial load.
- **Why it failed**: Trying to loop a stroke-dash offset using absolute pixels (e.g. `stroke-dashoffset: 748`) in CSS works only for a fixed screen size. When the container resizes (e.g., to 120x150px on mobile), the path perimeter changes, causing a visual "jump" or mismatch at the loop boundary.

###  The Premium Solution
- **SVG normalization via `pathLength`**:
  Always add `pathLength="100"` to the `<rect>` (or path) to normalize the total perimeter to 100 units, making all dash calculations percentage-based and independent of viewport scaling:
  ```javascript
  r.setAttribute('pathLength', '100');
  ```
- **CSS infinite chase loop**:
  Use a linear, repeating keyframe animation moving `stroke-dashoffset` from 100 to 0:
  ```css
  .photo-frame rect {
    stroke-dasharray: 30 70; /* 30% segment, 70% gap */
    stroke-dashoffset: 100;
    animation: frame-chase 3.2s linear infinite;
  }
  @keyframes frame-chase {
    to { stroke-dashoffset: 0; }
  }
  ```
  This creates a continuous, seamless clockwise chase.
- **Micro-Interaction (Hover Speed Up)**:
  To make the UI feel responsive and premium, accelerate the loop speed on hover (e.g., by 2x) while keeping it infinite:
  ```css
  .photo:hover .photo-frame rect {
    animation: frame-chase 1.6s linear infinite; /* 2x faster on hover */
  }
  ```

---

## 3. General UI/UX Principles for Workspace Tasks
1. **0.05-Second First Impression**: Any visual gap, subpixel misalignments, or stretched media instantly degrades perceived quality. Ensure pixel-perfect borders and aspect ratios.
2. **Never Use Exploding/Distracting Animations**: Keep animations smooth, subtle, and context-aware (e.g., linear chasing lines, subtle zooms on load, smooth speed transitions).
3. **Responsive Consistency**: Any animation or layout fix must scale gracefully between desktop fixed canvases and mobile screen sizes without visual glitches or boundary jumps. Use normalized parameters (`pathLength`, `inset box-shadow`, client-side JS boundary queries) to ensure consistency.
