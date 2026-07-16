// ============================================================
// 주형 유니버스 — 은하 퀘스트 미니게임 6종 (v20)
// 하이퍼캐주얼 장르 clean-room + 도메인 아이템(작가 실제 도구):
//  blast(블록블라스트류·graphify/리랭커) · shooter(고정슈터류·게이트/킬스위치)
//  runner(러너류·발화분석/가면) · merge(2048류·lint/rollback)
//  pair(메모리 카드류·지식 짝맞추기) · survivor(뱀서류·중심 지키기)
// 로직(createLogic)은 순수·시드 결정론 — node에서 결정론 검증 가능.
// 원본: 주형월드 그린필드 빌드(ES 모듈)를 클래식 스크립트로 이식.
// ============================================================
// v24: runner·merge 직관성 폴리시 — 러너 캐릭터/위험물 시각언어 통일 + 머지 슬라이드 트윈·조작 힌트
// v34-A: pair·survivor 신규(6은하 6퀘스트 체제) + 6종 브릿지 카피 원칙 중심 재작성
(function (root) {
"use strict";


// 결정론적 PRNG — 같은 시드면 항상 같은 월드 레이아웃 (mulberry32)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================
// 게임킷 — 하이퍼캐주얼 미니게임 공용 러너.
// 원칙: 게임 로직(createLogic)은 순수(DOM 0) → 노드에서 결정론 테스트 가능.
// 킷은 캔버스 DPR·고정 타임스텝·입력 매핑·주스(파티클/셰이크/플래시)만 담당.
// ============================================================

const KIT = {
  W: 480,
  H: 640,
  font: "-apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
  good: '#4ecdc4',
  bad: '#fb7185',
  ink: '#e8ecf8',
  dim: '#9aa5c4',
  accent: '#ffd166',
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawHUD(ctx, W, H, { lives, left, right }) {
  ctx.save();
  ctx.font = `700 15px ${KIT.font}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = KIT.dim;
  ctx.textAlign = 'left';
  ctx.fillText(left || '', 16, 24);
  ctx.textAlign = 'right';
  ctx.fillText(right || '', W - 16, 24);
  // 생명 하트
  ctx.textAlign = 'center';
  ctx.font = `14px ${KIT.font}`;
  const n = lives == null ? 0 : lives;
  for (let i = 0; i < n; i++) ctx.fillText('❤️', W / 2 - (n - 1) * 11 + i * 22, 24);
  ctx.restore();
}

// 아이템 발동 마이크로카피 토스트 — "아이템 = 실제 내 도구" 각인 순간
function drawToast(ctx, W, H, toast) {
  if (!toast || toast.timer <= 0) return;
  const a = Math.min(1, toast.timer / 0.4);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = `700 13px ${KIT.font}`;
  const tw = ctx.measureText(toast.text).width + 28;
  ctx.fillStyle = 'rgba(13,16,34,0.92)';
  ctx.strokeStyle = toast.color || KIT.accent;
  ctx.lineWidth = 1.5;
  roundRect(ctx, W / 2 - tw / 2, 44, tw, 30, 15);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = toast.color || KIT.accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(toast.text, W / 2, 59);
  ctx.restore();
}

// 인캔버스 아이템 버튼 (로직이 rect·상태 소유 → 결정론 유지)
function drawItemButton(ctx, W, H, rect, { label, sub, gauge, ready, count }) {
  const x = rect.x * W, y = rect.y * H, w = rect.w * W, h = rect.h * H;
  ctx.save();
  ctx.fillStyle = ready ? 'rgba(255,209,102,0.14)' : 'rgba(255,255,255,0.05)';
  ctx.strokeStyle = ready ? KIT.accent : 'rgba(140,160,220,0.3)';
  ctx.lineWidth = ready ? 2 : 1;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.stroke();
  if (gauge != null) {
    ctx.fillStyle = ready ? 'rgba(255,209,102,0.28)' : 'rgba(125,211,252,0.18)';
    roundRect(ctx, x, y, w * Math.min(gauge, 1), h, 10);
    ctx.fill();
  }
  ctx.fillStyle = ready ? KIT.accent : KIT.dim;
  ctx.font = `800 13px ${KIT.font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label + (count != null ? ` ×${count}` : ''), x + w / 2, y + h / 2 - (sub ? 7 : 0));
  if (sub) {
    ctx.font = `10px ${KIT.font}`;
    ctx.fillStyle = KIT.dim;
    ctx.fillText(sub, x + w / 2, y + h / 2 + 10);
  }
  ctx.restore();
}

function inRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

class Particles {
  constructor() { this.list = []; }
  burst(x, y, color, n = 14, speed = 220) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.4 + Math.random() * 0.8);
      this.list.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60,
        life: 0.6 + Math.random() * 0.3, age: 0, color, r: 2 + Math.random() * 3,
      });
    }
  }
  step(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.age += dt;
      if (p.age > p.life) { this.list.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt;
    }
  }
  draw(ctx) {
    for (const p of this.list) {
      ctx.globalAlpha = 1 - p.age / p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// game = { createLogic(seed, lang), draw(ctx, W, H, logic, t) }
// onEnd(result: 'won'|'lost')
function mountGame(canvas, game, seed, lang, { onEnd, reduced } = {}) {
  const W = KIT.W, H = KIT.H;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const logic = game.createLogic(seed, lang);
  const fx = new Particles();
  let shake = 0, flash = 0, flashColor = KIT.good;
  let raf = 0, last = performance.now(), acc = 0, ended = false, t = 0;

  function norm(e) {
    const rect = canvas.getBoundingClientRect();
    return [(e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height];
  }
  // 스와이프 지원 게임(logic.swipe)은 up에서 탭/스와이프 판별, 아니면 down 즉시 탭(반응성)
  let downPos = null;
  function onPointer(e) {
    const [x, y] = norm(e);
    if (logic.point) logic.point(x, y);
    if (logic.swipe) downPos = [x, y];
    else logic.tap(x, y);
  }
  function onUp(e) {
    if (!logic.swipe || !downPos) return;
    const [x, y] = norm(e);
    const dx = x - downPos[0], dy = y - downPos[1];
    downPos = null;
    if (Math.hypot(dx, dy) > 0.055) {
      logic.swipe(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
    } else {
      logic.tap(x, y);
    }
  }
  function onMove(e) {
    if (!logic.point) return;
    const [x, y] = norm(e);
    logic.point(x, y);
  }
  canvas.addEventListener('pointerdown', onPointer);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointermove', onMove);

  function consumeEvents() {
    while (logic.events.length) {
      const ev = logic.events.shift();
      const px = (ev.x != null ? ev.x : 0.5) * W;
      const py = (ev.y != null ? ev.y : 0.5) * H;
      if (ev.type === 'good') fx.burst(px, py, KIT.good, reduced ? 5 : 16);
      if (ev.type === 'bad') { fx.burst(px, py, KIT.bad, reduced ? 4 : 10, 150); shake = reduced ? 0 : 0.28; }
      if (ev.type === 'win') { fx.burst(W / 2, H / 2, KIT.accent, reduced ? 10 : 40, 320); flash = 0.5; flashColor = KIT.good; }
      if (ev.type === 'lose') { flash = 0.4; flashColor = KIT.bad; }
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    let dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    acc += dt;
    const STEP = 1 / 60;
    while (acc >= STEP) {
      if (logic.state.phase === 'playing') logic.step(STEP);
      acc -= STEP;
      t += STEP;
    }
    consumeEvents();
    fx.step(dt);
    if (shake > 0) shake = Math.max(0, shake - dt);
    if (flash > 0) flash = Math.max(0, flash - dt * 1.6);

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * shake * 22, (Math.random() - 0.5) * shake * 22);
    game.draw(ctx, W, H, logic, t);
    fx.draw(ctx);
    ctx.restore();
    if (flash > 0) {
      ctx.globalAlpha = flash * 0.35;
      ctx.fillStyle = flashColor;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    if (!ended && logic.state.phase !== 'playing') {
      ended = true;
      logic.events.push({ type: logic.state.phase === 'won' ? 'win' : 'lose' });
      consumeEvents();
      setTimeout(() => onEnd && onEnd(logic.state.phase), reduced ? 200 : 750);
    }
  }
  raf = requestAnimationFrame(frame);

  return {
    logic,  // 외부(index.html 방향키 등)에서 결정론 로직에 접근하기 위한 참조
    dispose() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPointer);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointermove', onMove);
    },
  };
}

const GAME_blast = (function () {
// ============================================================
// 스타 블라스트 — RAG·검색증강 은하 퀘스트 게임 (보너스 도전 — 콘텐츠 비잠금). (v2: 도메인 아이템)
// 장르: 원터치 블라스트(clean-room).
// 아이템 = 작가의 실제 RAG 방식:
//  · Graphify — 시작 뭉치에서 [[위키링크]]를 hop하며 연결 뭉치 연쇄 추출.
//    전체 스캔이 아니라 그래프 탐색(작가 vault의 RAG 원칙 그대로).
//    그래프에 연결되지 않는 환각 👻은 이때 걸러져 소거된다.
//  · 리랭커 — 보드를 관련도순(같은 색끼리) 재정렬. 무브 소모 없음.
// ============================================================



const COLS = 7, ROWS = 8;
const NCOLORS = 4;
const HALLU = 9; // 환각 블록 값
const COLORS = ['#4ecdc4', '#a78bfa', '#ffd166', '#fb7185'];
const GLYPHS = ['📄', '🔗', '📊', '💡'];
const TARGET = 420;
const MOVES = 22;
const GAUGE_FULL = 18;   // Graphify 충전에 필요한 추출 조각 수
const N_LINKS = 5;       // 보드에 깔리는 위키링크 수

const BX = 0.07, BY = 0.135, BW = 0.86, BH = 0.615;
const BTN_GRAPHIFY = { x: 0.07, y: 0.80, w: 0.41, h: 0.075 };
const BTN_RERANK = { x: 0.52, y: 0.80, w: 0.41, h: 0.075 };

function createLogic(seed, lang = 'ko') {
  const rng = mulberry32(seed);
  const state = {
    phase: 'playing',
    score: 0,
    target: TARGET,
    moves: MOVES,
    lives: null,
    board: [],
    links: [],        // [[c1,r1,c2,r2], ...] — 셀 사이 위키링크(고정 구조)
    gauge: 0,         // Graphify 게이지 (0..GAUGE_FULL)
    armed: false,     // Graphify 발동 대기(다음 탭 = 그래프 추출)
    rerank: 1,
    halluOnBoard: 0,
    toast: null,
    lang,
  };

  const cell = () => Math.floor(rng() * NCOLORS);
  for (let c = 0; c < COLS; c++) {
    state.board[c] = [];
    for (let r = 0; r < ROWS; r++) state.board[c][r] = cell();
  }
  // 위키링크 — 서로 떨어진 셀 쌍 (시드 결정론)
  while (state.links.length < N_LINKS) {
    const a = [Math.floor(rng() * COLS), Math.floor(rng() * ROWS)];
    const b = [Math.floor(rng() * COLS), Math.floor(rng() * ROWS)];
    if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) < 3) continue;
    state.links.push([a[0], a[1], b[0], b[1]]);
  }

  function refillCell() {
    // 환각은 리필에서만 낮은 확률로 유입 (보드 최대 4개)
    if (state.halluOnBoard < 4 && rng() < 0.09) {
      state.halluOnBoard++;
      return HALLU;
    }
    return cell();
  }

  function countHallu() {
    let n = 0;
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r < ROWS; r++) if (state.board[c][r] === HALLU) n++;
    return n;
  }

  function group(c0, r0) {
    const color = state.board[c0][r0];
    if (color == null || color === HALLU) return [];
    const seen = new Set();
    const stack = [[c0, r0]];
    const out = [];
    while (stack.length) {
      const [c, r] = stack.pop();
      const key = c + ',' + r;
      if (seen.has(key)) continue;
      seen.add(key);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
      if (state.board[c][r] !== color) continue;
      out.push([c, r]);
      stack.push([c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]);
    }
    return out;
  }

  function hasMove() {
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r < ROWS; r++)
        if (group(c, r).length >= 2) return true;
    return false;
  }

  function reshuffle() {
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r < ROWS; r++)
        if (state.board[c][r] !== HALLU) state.board[c][r] = cell();
    if (!hasMove()) reshuffle();
  }

  function collapse() {
    for (let c = 0; c < COLS; c++) {
      const col = state.board[c].filter((v) => v != null);
      while (col.length < ROWS) col.unshift(refillCell());
      state.board[c] = col;
    }
    state.halluOnBoard = countHallu();
    if (!hasMove()) reshuffle();
  }

  function toast(text, color) { state.toast = { text, timer: 2.4, color }; }

  // Graphify — 그래프 탐색 추출: 시작 뭉치 → 링크 hop → 연결 뭉치 (BFS)
  function graphExtract(c0, r0, events) {
    const start = group(c0, r0);
    if (start.length < 2) return 0;
    const inSet = new Set(start.map(([c, r]) => c + ',' + r));
    const queue = [start];
    let hops = 0;
    while (queue.length) {
      const g = queue.shift();
      for (const [lc1, lr1, lc2, lr2] of state.links) {
        const aIn = g.some(([c, r]) => c === lc1 && r === lr1);
        const bIn = g.some(([c, r]) => c === lc2 && r === lr2);
        const hopTo = aIn ? [lc2, lr2] : bIn ? [lc1, lr1] : null;
        if (!hopTo) continue;
        if (inSet.has(hopTo[0] + ',' + hopTo[1])) continue;
        const g2 = group(hopTo[0], hopTo[1]);
        if (!g2.length) continue;
        for (const [c, r] of g2) inSet.add(c + ',' + r);
        queue.push(g2);
        hops++;
      }
    }
    // 추출 + 환각 소거(그래프에 연결되지 않는 것들)
    let removed = 0;
    for (const key of inSet) {
      const [c, r] = key.split(',').map(Number);
      state.board[c][r] = null;
      removed++;
      events.push({ type: 'good', x: BX + ((c + 0.5) / COLS) * BW, y: BY + ((r + 0.5) / ROWS) * BH });
    }
    let halluCleared = 0;
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r < ROWS; r++)
        if (state.board[c][r] === HALLU) { state.board[c][r] = null; halluCleared++; }
    state.score += removed * 3 * 2 + halluCleared * 10; // 그래프 추출 2배 + 환각 정화 보너스
    return removed + halluCleared;
  }

  return {
    state,
    events: [],
    cellAt(x, y) {
      const c = Math.floor(((x - BX) / BW) * COLS);
      const r = Math.floor(((y - BY) / BH) * ROWS);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return null;
      return [c, r];
    },
    step(dt) {
      if (state.toast && state.toast.timer > 0) state.toast.timer -= dt;
    },
    tap(x, y) {
      if (state.phase !== 'playing') return;

      // 아이템 버튼
      if (inRect(x, y, BTN_GRAPHIFY)) {
        if (state.gauge >= GAUGE_FULL && !state.armed) {
          state.armed = true;
          toast(state.lang === 'en'
            ? 'graphify armed — tap a group to extract via links'
            : 'graphify 대기 — 뭉치를 탭하면 링크 타고 추출', '#4ecdc4');
        }
        return;
      }
      if (inRect(x, y, BTN_RERANK)) {
        if (state.rerank > 0) {
          state.rerank--;
          const all = [];
          for (let c = 0; c < COLS; c++)
            for (let r = 0; r < ROWS; r++) if (state.board[c][r] != null) all.push(state.board[c][r]);
          all.sort((a, b) => a - b);
          let i = 0;
          for (let c = 0; c < COLS; c++)
            for (let r = 0; r < ROWS; r++) state.board[c][r] = all[i++];
          if (!hasMove()) reshuffle();
          this.events.push({ type: 'good', x: 0.5, y: 0.45 });
          toast(state.lang === 'en' ? 'reranker — reordered by relevance' : '리랭커 — 관련도순 재정렬', '#7dd3fc');
        }
        return;
      }

      const hit = this.cellAt(x, y);
      if (!hit) return;

      // Graphify 발동 상태 — 그래프 추출
      if (state.armed) {
        const n = graphExtract(hit[0], hit[1], this.events);
        if (n === 0) { this.events.push({ type: 'bad', x, y }); return; }
        state.armed = false;
        state.gauge = 0;
        state.moves--;
        toast(state.lang === 'en'
          ? `graphify — ${n} pieces extracted via graph hops`
          : `graphify — 링크 hop으로 ${n}조각 연쇄 추출`, '#4ecdc4');
        collapse();
        if (state.score >= state.target) { state.phase = 'won'; return; }
        if (state.moves <= 0) { state.moves = 0; state.phase = 'lost'; }
        return;
      }

      // 일반 블라스트
      const g = group(hit[0], hit[1]);
      if (g.length < 2) {
        this.events.push({ type: 'bad', x, y });
        return;
      }
      for (const [c, r] of g) state.board[c][r] = null;
      state.score += g.length * g.length * 3;
      state.gauge = Math.min(GAUGE_FULL, state.gauge + g.length);
      state.moves--;
      this.events.push({ type: 'good', x, y });
      collapse();
      if (state.score >= state.target) { state.phase = 'won'; return; }
      if (state.moves <= 0) { state.moves = 0; state.phase = 'lost'; }
    },
  };
}

function draw(ctx, W, H, logic, t) {
  const s = logic.state;
  const cw = (BW * W) / COLS, ch = (BH * H) / ROWS;
  const cx = (c) => BX * W + (c + 0.5) * cw;
  const cy = (r) => BY * H + (r + 0.5) * ch;

  // 보드 프레임
  ctx.strokeStyle = 'rgba(140,160,220,0.25)';
  ctx.lineWidth = 1;
  roundRect(ctx, BX * W - 6, BY * H - 6, BW * W + 12, BH * H + 12, 12);
  ctx.stroke();

  // 위키링크 — Graphify 대기 시 발광
  ctx.save();
  ctx.setLineDash([4, 5]);
  ctx.strokeStyle = s.armed ? 'rgba(78,205,196,0.85)' : 'rgba(200,210,238,0.22)';
  ctx.lineWidth = s.armed ? 2 : 1;
  for (const [c1, r1, c2, r2] of s.links) {
    ctx.beginPath();
    ctx.moveTo(cx(c1), cy(r1));
    ctx.lineTo(cx(c2), cy(r2));
    ctx.stroke();
  }
  ctx.restore();

  // 블록
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const v = s.board[c][r];
      if (v == null) continue;
      const x = BX * W + c * cw, y = BY * H + r * ch;
      if (v === HALLU) {
        ctx.fillStyle = 'rgba(154,165,196,0.10)';
        ctx.strokeStyle = 'rgba(154,165,196,0.55)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.2;
        roundRect(ctx, x + cw * 0.06, y + ch * 0.06, cw * 0.88, ch * 0.88, 8);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = `${Math.floor(ch * 0.4)}px ${KIT.font}`;
        ctx.globalAlpha = 0.75;
        ctx.fillText('👻', x + cw / 2, y + ch / 2 + 1);
        ctx.globalAlpha = 1;
        continue;
      }
      const pulse = 1 + Math.sin(t * 2 + c * 0.7 + r * 0.5) * 0.02;
      ctx.fillStyle = COLORS[v] + '2b';
      ctx.strokeStyle = COLORS[v];
      ctx.lineWidth = 1.5;
      roundRect(
        ctx,
        x + cw * (1 - 0.88 * pulse) / 2,
        y + ch * (1 - 0.88 * pulse) / 2,
        cw * 0.88 * pulse,
        ch * 0.88 * pulse,
        8
      );
      ctx.fill();
      ctx.stroke();
      ctx.font = `${Math.floor(ch * 0.42)}px ${KIT.font}`;
      ctx.fillText(GLYPHS[v], x + cw / 2, y + ch / 2 + 1);
    }
  }

  // 링크 노드 표시(셀 모서리 점)
  ctx.fillStyle = s.armed ? '#4ecdc4' : 'rgba(200,210,238,0.4)';
  for (const [c1, r1, c2, r2] of s.links) {
    for (const [c, r] of [[c1, r1], [c2, r2]]) {
      ctx.beginPath();
      ctx.arc(cx(c), cy(r) - ch * 0.32, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 아이템 버튼
  drawItemButton(ctx, W, H, BTN_GRAPHIFY, {
    label: 'graphify',
    sub: s.lang === 'en' ? 'hop-extract via links' : '링크 hop 연쇄 추출',
    gauge: s.gauge / GAUGE_FULL,
    ready: s.gauge >= GAUGE_FULL || s.armed,
  });
  drawItemButton(ctx, W, H, BTN_RERANK, {
    label: s.lang === 'en' ? 'reranker' : '리랭커',
    sub: s.lang === 'en' ? 'reorder by relevance' : '관련도순 재정렬',
    count: s.rerank,
    ready: s.rerank > 0,
  });

  // 목표 진행 바
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, 16, H - 34, W - 32, 10, 5);
  ctx.fill();
  ctx.fillStyle = KIT.good;
  roundRect(ctx, 16, H - 34, (W - 32) * Math.min(s.score / s.target, 1), 10, 5);
  ctx.fill();

  ctx.font = `11px ${KIT.font}`;
  ctx.fillStyle = KIT.dim;
  ctx.textAlign = 'center';
  ctx.fillText(
    s.lang === 'en' ? 'tap 2+ groups · 👻 hallucinations only fall to graphify' : '같은 조각 2+ 뭉치 탭 · 환각 👻은 graphify로만 정화',
    W / 2,
    H - 48
  );

  drawHUD(ctx, W, H, {
    lives: null,
    left: `✨ ${s.score}/${s.target}`,
    right: `🎯 ${s.moves} ${s.lang === 'en' ? 'moves' : '무브'}`,
  });
  drawToast(ctx, W, H, s.toast);
}
return { createLogic: createLogic, draw: draw };
})();

const GAME_shooter = (function () {
// ============================================================
// 은하 슈터 — AI 에이전트 은하 퀘스트 게임 (보너스 도전 — 콘텐츠 비잠금). (v2: 도메인 아이템)
// 장르: 고정 슈터(갤러그류 clean-room). 적 = 환각·버그.
// 아이템 = 작가의 실제 에이전트 하네스:
//  · 게이트 오픈 — 5킬마다 |z|>1.65 게이트가 열려 4초 더블샷 (QuantLeap 게이트 상수)
//  · 킬스위치 — 방어선 근접 위협 일소 + 편대 리셋 (안전 헌법층, 1회)
// ============================================================



const COLS = 4, ROWS = 3;
const ENEMY_GLYPHS = ['👻', '🐛'];
const GATE_KILLS = 5;
const GATE_TIME = 4;
const BTN_KILLSWITCH = { x: 0.035, y: 0.915, w: 0.30, h: 0.062 };

function createLogic(seed, lang = 'ko') {
  const rng = mulberry32(seed);
  const state = {
    phase: 'playing',
    score: 0,
    total: COLS * ROWS,
    lives: 3,
    time: 45,
    ship: { x: 0.5, y: 0.87 },
    targetX: 0.5,
    bullets: [],
    enemies: [],
    baseY: 0.1,
    gateKills: 0,     // 게이트 게이지 (0..GATE_KILLS)
    gateTime: 0,      // 게이트 오픈 잔여 시간 (더블샷)
    killswitch: 1,
    toast: null,
    lang,
  };
  let elapsed = 0;
  let fireT = 0.3;
  const swayPhase = rng() * Math.PI * 2;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      state.enemies.push({
        c, r,
        alive: true,
        glyph: ENEMY_GLYPHS[Math.floor(rng() * ENEMY_GLYPHS.length)],
        wob: rng() * Math.PI * 2,
      });
    }
  }

  function enemyPos(e) {
    const sway = Math.sin(elapsed * 0.9 + swayPhase) * 0.09;
    return {
      x: 0.245 + e.c * 0.17 + sway + Math.sin(elapsed * 2 + e.wob) * 0.01,
      y: state.baseY + e.r * 0.085,
    };
  }

  function toast(text, color) { state.toast = { text, timer: 2.2, color }; }

  function registerKill(p, events) {
    state.score++;
    events.push({ type: 'good', x: p.x, y: p.y });
    state.gateKills++;
    if (state.gateKills >= GATE_KILLS) {
      state.gateKills = 0;
      state.gateTime = GATE_TIME;
      toast(state.lang === 'en' ? '|z|>1.65 — gate open, double shot' : '|z|>1.65 — 게이트 오픈, 더블샷', '#a78bfa');
    }
  }

  return {
    state,
    events: [],
    enemyPos,
    point(x) { state.targetX = Math.min(Math.max(x, 0.06), 0.94); },
    step(dt) {
      elapsed += dt;
      state.time -= dt;
      if (state.toast && state.toast.timer > 0) state.toast.timer -= dt;
      if (state.gateTime > 0) state.gateTime -= dt;

      // 함선 이동 + 자동 발사 (게이트 오픈 시 더블샷)
      state.ship.x += (state.targetX - state.ship.x) * Math.min(1, dt * 10);
      fireT -= dt;
      if (fireT <= 0) {
        if (state.gateTime > 0) {
          state.bullets.push({ x: state.ship.x - 0.022, y: state.ship.y - 0.035 });
          state.bullets.push({ x: state.ship.x + 0.022, y: state.ship.y - 0.035 });
        } else {
          state.bullets.push({ x: state.ship.x, y: state.ship.y - 0.035 });
        }
        fireT = 0.32;
      }

      // 탄환·명중
      for (let i = state.bullets.length - 1; i >= 0; i--) {
        const b = state.bullets[i];
        b.y -= 0.85 * dt;
        if (b.y < -0.05) { state.bullets.splice(i, 1); continue; }
        for (const e of state.enemies) {
          if (!e.alive) continue;
          const p = enemyPos(e);
          if (Math.hypot(p.x - b.x, (p.y - b.y) * (KIT.H / KIT.W)) < 0.055) {
            e.alive = false;
            state.bullets.splice(i, 1);
            registerKill(p, this.events);
            break;
          }
        }
      }
      if (state.score >= state.total) { state.phase = 'won'; return; }

      // 편대 강하
      state.baseY += (0.014 + elapsed * 0.0012) * dt;
      let lowest = 0;
      for (const e of state.enemies) if (e.alive) lowest = Math.max(lowest, enemyPos(e).y);
      if (lowest > 0.74) {
        state.lives--;
        state.baseY = 0.1;
        this.events.push({ type: 'bad', x: state.ship.x, y: 0.74 });
        if (state.lives <= 0) { state.lives = 0; state.phase = 'lost'; return; }
      }

      if (state.time <= 0) {
        state.time = 0;
        state.phase = state.score >= state.total ? 'won' : 'lost';
      }
    },
    tap(x, y) {
      if (state.phase !== 'playing') return;
      // 킬스위치 버튼
      if (inRect(x, y, BTN_KILLSWITCH)) {
        if (state.killswitch > 0) {
          const targets = state.enemies.filter((e) => e.alive && enemyPos(e).y > 0.42);
          if (targets.length === 0) {
            // 위협 없음 — 소모하지 않는다 (안전장치는 위기에만)
            toast(state.lang === 'en' ? 'no near threats — saved for the crisis' : '근접 위협 없음 — 위기에 아껴두세요', '#9aa5c4');
            return;
          }
          state.killswitch = 0;
          for (const e of targets) {
            const p = enemyPos(e);
            e.alive = false;
            registerKill(p, this.events);
          }
          state.baseY = 0.1;
          toast(
            state.lang === 'en'
              ? `kill-switch — ${targets.length} threats purged, formation reset`
              : `kill-switch — 근접 위협 ${targets.length}기 차단, 편대 리셋`,
            '#fb7185'
          );
          if (state.score >= state.total) state.phase = 'won';
        }
        return;
      }
      this.point(x);
    },
  };
}

function draw(ctx, W, H, logic, t) {
  const s = logic.state;

  // 방어선
  ctx.strokeStyle = 'rgba(167,139,250,0.35)';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(0, 0.78 * H);
  ctx.lineTo(W, 0.78 * H);
  ctx.stroke();
  ctx.setLineDash([]);

  // 적 편대
  ctx.font = `26px ${KIT.font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const e of s.enemies) {
    if (!e.alive) continue;
    const p = logic.enemyPos(e);
    ctx.fillText(e.glyph, p.x * W, p.y * H);
  }

  // 탄환 (게이트 오픈 시 보라)
  ctx.fillStyle = s.gateTime > 0 ? '#a78bfa' : KIT.good;
  for (const b of s.bullets) {
    roundRect(ctx, b.x * W - 2.5, b.y * H - 9, 5, 14, 2.5);
    ctx.fill();
  }

  // 함선
  const sx = s.ship.x * W, sy = s.ship.y * H;
  ctx.save();
  ctx.shadowColor = s.gateTime > 0 ? '#a78bfa' : KIT.accent;
  ctx.shadowBlur = 16;
  ctx.fillStyle = s.gateTime > 0 ? '#a78bfa' : KIT.accent;
  ctx.beginPath();
  ctx.moveTo(sx, sy - 18);
  ctx.lineTo(sx - 15, sy + 12);
  ctx.lineTo(sx + 15, sy + 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#0e1320';
  ctx.beginPath();
  ctx.arc(sx, sy + 2, 4, 0, Math.PI * 2);
  ctx.fill();

  // 게이트 게이지 (우하단)
  drawItemButton(ctx, W, H, { x: 0.665, y: 0.915, w: 0.30, h: 0.062 }, {
    label: s.gateTime > 0 ? 'GATE OPEN' : '|z| gate',
    sub: s.gateTime > 0
      ? (s.lang === 'en' ? `double shot ${s.gateTime.toFixed(1)}s` : `더블샷 ${s.gateTime.toFixed(1)}s`)
      : (s.lang === 'en' ? `${s.gateKills}/5 kills to open` : `5킬마다 게이트 오픈 ${s.gateKills}/5`),
    gauge: s.gateTime > 0 ? s.gateTime / GATE_TIME : s.gateKills / GATE_KILLS,
    ready: s.gateTime > 0,
  });
  // 킬스위치 버튼 (좌하단)
  drawItemButton(ctx, W, H, BTN_KILLSWITCH, {
    label: 'kill-switch',
    sub: s.lang === 'en' ? 'purge near threats' : '근접 위협 일소',
    count: s.killswitch,
    ready: s.killswitch > 0,
  });

  // 조작 힌트
  ctx.font = `11px ${KIT.font}`;
  ctx.fillStyle = KIT.dim;
  ctx.textAlign = 'center';
  ctx.fillText(s.lang === 'en' ? 'drag / tap to steer · auto-fire' : '드래그/탭 = 조준 · 발사는 자동', W / 2, H - 18);

  drawHUD(ctx, W, H, {
    lives: s.lives,
    left: `🎯 ${s.score}/${s.total}`,
    right: `⏱ ${Math.ceil(s.time)}s`,
  });
  drawToast(ctx, W, H, s.toast);
}
return { createLogic: createLogic, draw: draw };
})();

const GAME_runner = (function () {
// ============================================================
// 코스믹 러너 — 게임·사회추론 은하 퀘스트 게임 (보너스 도전 — 콘텐츠 비잠금). (v2: 도메인 아이템)
// 장르: 러너(쿠키런류 clean-room). 원탭 2단 점프.
// 아이템 = AI 사회추론 시뮬레이션 늑대인간 하네스의 실제 축:
//  · 가면 장애물 — 일부 장애물은 블러핑(겉은 진짜와 동일, 실은 통과 가능)
//  · 발화 분석 스캐너(픽업 🔍) — 4초간 가면이 판별되어 반투명으로 보임
//  · 스캐폴드 쉴드 — 피격 1회 무효 (인문학 스캐폴드)
// ============================================================



const GROUND = 0.78;
const GRAVITY = 3.4;
const JUMP_V = -1.16;
const GOAL = 400; // m

function createLogic(seed, lang = 'ko') {
  const rng = mulberry32(seed);
  const state = {
    phase: 'playing',
    dist: 0,
    goal: GOAL,
    lives: 3,
    stars: 0,
    runner: { y: GROUND, vy: 0, jumps: 2, inv: 0 },
    obstacles: [],  // {x, w, h, fly, fake}
    pickups: [],    // {x, y, kind: 'star'|'scan'}
    speed: 0.34,
    scan: 0,        // 발화 분석 잔여 시간
    shield: 1,      // 스캐폴드 쉴드
    toast: null,
    elapsed: 0,     // 시작 범례 오버레이 타이밍용(결정론 값 — 렌더 전용 소비)
    lang,
  };
  let elapsed = 0;
  let spawnT = 1.1;
  let starT = 1.7;
  let scanT = 6.5;

  function toast(text, color) { state.toast = { text, timer: 2.2, color }; }

  return {
    state,
    events: [],
    step(dt) {
      elapsed += dt;
      state.elapsed = elapsed;
      state.speed = 0.34 + Math.min(elapsed * 0.008, 0.16);
      state.dist += state.speed * dt * 52;
      if (state.dist >= state.goal) { state.dist = state.goal; state.phase = 'won'; return; }
      if (state.toast && state.toast.timer > 0) state.toast.timer -= dt;
      if (state.scan > 0) state.scan -= dt;

      // 러너 물리
      const r = state.runner;
      r.vy += GRAVITY * dt;
      r.y += r.vy * dt;
      if (r.y >= GROUND) { r.y = GROUND; r.vy = 0; r.jumps = 2; }
      if (r.inv > 0) r.inv -= dt;

      // 스폰 (시드 결정론) — 지상 장애물 22%는 가면(블러핑)
      spawnT -= dt;
      if (spawnT <= 0) {
        const fly = rng() < 0.3;
        state.obstacles.push({
          x: 1.08,
          w: 0.045 + rng() * 0.03,
          h: fly ? 0.05 : 0.06 + rng() * 0.07,
          fly,
          fake: !fly && rng() < 0.22,
        });
        spawnT = 0.8 + rng() * 0.65 - Math.min(elapsed * 0.004, 0.25);
      }
      starT -= dt;
      if (starT <= 0) {
        state.pickups.push({ x: 1.06, y: GROUND - 0.08 - rng() * 0.22, kind: 'star' });
        starT = 1.3 + rng() * 0.9;
      }
      scanT -= dt;
      if (scanT <= 0) {
        state.pickups.push({ x: 1.06, y: GROUND - 0.1 - rng() * 0.18, kind: 'scan' });
        scanT = 6 + rng() * 3;
      }

      // 이동·충돌
      const rx = 0.22, rw = 0.045, rh = 0.085;
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const o = state.obstacles[i];
        o.x -= state.speed * dt;
        if (o.x < -0.15) { state.obstacles.splice(i, 1); continue; }
        if (o.fake) continue; // 블러핑 — 통과 가능(사회추론: 겉만 위협)
        const oy = o.fly ? GROUND - 0.16 : GROUND;
        const overlapX = Math.abs(o.x - rx) < (o.w + rw) / 2;
        const overlapY = Math.abs((oy - o.h / 2) - (r.y - rh / 2)) < (o.h + rh) / 2;
        if (overlapX && overlapY && r.inv <= 0) {
          if (state.shield > 0) {
            state.shield = 0;
            r.inv = 1.2;
            this.events.push({ type: 'good', x: rx, y: r.y - 0.05 });
            toast(state.lang === 'en' ? 'scaffold shield — one hit absorbed' : '스캐폴드 쉴드 — 피격 1회 무효', '#ffd166');
          } else {
            state.lives--;
            r.inv = 1.2;
            this.events.push({ type: 'bad', x: rx, y: r.y - 0.05 });
            if (state.lives <= 0) { state.lives = 0; state.phase = 'lost'; return; }
          }
        }
      }
      for (let i = state.pickups.length - 1; i >= 0; i--) {
        const p = state.pickups[i];
        p.x -= state.speed * dt;
        if (p.x < -0.1) { state.pickups.splice(i, 1); continue; }
        if (Math.hypot(p.x - rx, (p.y - (r.y - 0.04)) * (KIT.H / KIT.W)) < 0.055) {
          state.pickups.splice(i, 1);
          if (p.kind === 'star') {
            state.stars++;
            this.events.push({ type: 'good', x: p.x, y: p.y });
          } else {
            state.scan = 4;
            this.events.push({ type: 'good', x: p.x, y: p.y });
            toast(state.lang === 'en' ? 'utterance analysis — bluffs revealed 4s' : '발화 분석 — 4초간 가면 판별', '#fb7185');
          }
        }
      }
    },
    tap() {
      const r = state.runner;
      if (state.phase !== 'playing') return;
      if (r.jumps > 0) {
        r.vy = JUMP_V * (r.jumps === 2 ? 1 : 0.88);
        r.jumps--;
      }
    },
  };
}

function draw(ctx, W, H, logic, t) {
  const s = logic.state;
  const gy = GROUND * H;

  // 지면(배경 요소 — 게임 오브젝트와 시각 위계 분리 위해 알파 낮춤)
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = 'rgba(251,113,133,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, gy + 20);
  ctx.lineTo(W, gy + 20);
  ctx.stroke();
  ctx.fillStyle = 'rgba(251,113,133,0.25)';
  const off = (s.dist * 3) % 40;
  for (let x = -off; x < W; x += 40) ctx.fillRect(x, gy + 26, 18, 3);
  ctx.restore();

  // 픽업 — 초록/골드 라디얼 글로우로 "먹을 수 있음" 암시 + "+1" 표기
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of s.pickups) {
    const px = p.x * W, py = p.y * H;
    const glowColor = p.kind === 'star' ? '255,209,102' : '78,205,196';
    const grad = ctx.createRadialGradient(px, py, 0, px, py, 20);
    grad.addColorStop(0, `rgba(${glowColor},0.38)`);
    grad.addColorStop(1, `rgba(${glowColor},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `18px ${KIT.font}`;
    ctx.fillText(p.kind === 'star' ? '⭐' : '🔍', px, py);
    ctx.font = `700 10px ${KIT.font}`;
    ctx.fillStyle = p.kind === 'star' ? KIT.accent : KIT.good;
    ctx.fillText('+1', px + 15, py - 12);
    if (p.kind === 'scan') {
      ctx.strokeStyle = 'rgba(251,113,133,0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, 15 + Math.sin(t * 5) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 장애물 — 위험 시각 언어 통일(빨간 오라+테두리+⚠ 펄스). 스캔 중이면 가면이 반투명으로 판별됨
  const warnPulse = 0.6 + 0.4 * Math.sin(t * 6);
  for (const o of s.obstacles) {
    const oy = o.fly ? GROUND - 0.16 : GROUND;
    const revealed = o.fake && s.scan > 0;
    ctx.globalAlpha = revealed ? 0.32 : 1;
    const ox = o.x * W, ocy = (oy - o.h / 2) * H;
    if (o.fly) {
      const auraR = 20;
      ctx.fillStyle = 'rgba(251,113,133,0.25)';
      ctx.beginPath();
      ctx.arc(ox, ocy, auraR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = KIT.bad;
      ctx.lineWidth = 2;
      if (revealed) ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(ox, ocy, auraR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = `22px ${KIT.font}`;
      ctx.fillText('☄️', ox, ocy);
    } else {
      ctx.fillStyle = 'rgba(251,113,133,0.25)';
      ctx.strokeStyle = KIT.bad;
      ctx.lineWidth = 2;
      if (revealed) ctx.setLineDash([4, 4]);
      roundRect(ctx, (o.x - o.w / 2) * W, (oy - o.h) * H, o.w * W, o.h * H, 5);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = `15px ${KIT.font}`;
      ctx.fillText(revealed ? '👻' : '🐛', ox, ocy);
    }
    if (!revealed) {
      ctx.save();
      ctx.globalAlpha = warnPulse;
      ctx.font = `700 11px ${KIT.font}`;
      ctx.fillStyle = KIT.bad;
      ctx.fillText('⚠', ox, ocy - (o.fly ? 20 : o.h * H / 2 + 12));
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // 러너
  const r = s.runner;
  if (r.inv <= 0 || Math.floor(t * 12) % 2 === 0) {
    const rx = 0.22 * W, ry = r.y * H;
    ctx.save();
    ctx.shadowColor = s.shield > 0 ? KIT.accent : 'transparent';
    ctx.shadowBlur = s.shield > 0 ? 14 : 0;
    ctx.font = `30px ${KIT.font}`;
    ctx.fillText('🐙', rx, ry - 22);
    ctx.restore();
    if (s.shield > 0) {
      ctx.strokeStyle = 'rgba(255,209,102,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry - 22, 24, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 스캔 상태 표시
  if (s.scan > 0) {
    ctx.font = `700 12px ${KIT.font}`;
    ctx.fillStyle = KIT.bad;
    ctx.fillText(
      (s.lang === 'en' ? '🔍 analysis ' : '🔍 발화 분석 ') + s.scan.toFixed(1) + 's',
      W / 2, H * 0.12
    );
  }

  // 진행 바
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, 16, H - 34, W - 32, 10, 5);
  ctx.fill();
  ctx.fillStyle = KIT.bad;
  roundRect(ctx, 16, H - 34, (W - 32) * (s.dist / s.goal), 10, 5);
  ctx.fill();

  ctx.font = `11px ${KIT.font}`;
  ctx.fillStyle = KIT.dim;
  ctx.fillText(
    s.lang === 'en' ? 'some obstacles are bluffs — 🔍 reveals them' : '일부 장애물은 가면(통과 가능) — 🔍가 판별해줍니다',
    W / 2, H - 48
  );

  drawHUD(ctx, W, H, {
    lives: s.lives,
    left: `🏁 ${Math.floor(s.dist)}m/${s.goal}m`,
    right: `⭐ ${s.stars}`,
  });
  drawToast(ctx, W, H, s.toast);

  // 시작 범례 오버레이 — 첫 2.5초 동안만
  if (s.elapsed < 2.5) {
    const boxW = W * 0.86, boxH = 40;
    const boxX = (W - boxW) / 2, boxY = 34;
    const fade = Math.min(1, (2.5 - s.elapsed) / 0.5);
    ctx.save();
    ctx.globalAlpha = 0.9 * fade;
    ctx.fillStyle = 'rgba(13,16,34,0.82)';
    ctx.strokeStyle = 'rgba(140,160,220,0.4)';
    ctx.lineWidth = 1;
    roundRect(ctx, boxX, boxY, boxW, boxH, 10);
    ctx.fill();
    ctx.stroke();
    ctx.font = `700 12px ${KIT.font}`;
    ctx.fillStyle = KIT.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      s.lang === 'en' ? '🐙 = me · ⭐🔍 = eat · red = avoid' : '🐙 = 나 · ⭐🔍 = 먹기 · 빨간 것 = 피하기',
      W / 2, boxY + boxH / 2
    );
    ctx.restore();
  }
}
return { createLogic: createLogic, draw: draw };
})();

const GAME_merge = (function () {
// ============================================================
// 컴포넌트 머지 — 멀티모달·프로덕트 은하 퀘스트 게임 (보너스 도전 — 콘텐츠 비잠금).
// 장르: 머지(2048류 clean-room). 스와이프로 같은 컴포넌트 결합.
// 위계 = VDS 디자인 시스템 그대로: 토큰→버튼→카드→섹션→페이지(클리어)→시스템
// 아이템 = 작가의 실제 제작 도구:
//  · 린트 — 최하위 티어 타일 1개 제거(드리프트 정리, 1회)
//  · 롤백 — 마지막 스와이프 되돌리기(스테이징 revert, 1회)
// ============================================================



const N = 4;
const TIERS = [
  { g: '🎨', ko: '토큰', en: 'token', color: '#60a5fa' },
  { g: '🔘', ko: '버튼', en: 'button', color: '#7dd3fc' },
  { g: '🃏', ko: '카드', en: 'card', color: '#4ecdc4' },
  { g: '📐', ko: '섹션', en: 'section', color: '#a78bfa' },
  { g: '📄', ko: '페이지', en: 'page', color: '#ffd166' },
  { g: '◆', ko: '시스템', en: 'system', color: '#fb7185' },
];
const WIN_TIER = 4; // 페이지

const GX = 0.09, GY = 0.17, GW = 0.82, GH = 0.55;
const BTN_LINT = { x: 0.09, y: 0.80, w: 0.39, h: 0.075 };
const BTN_ROLLBACK = { x: 0.52, y: 0.80, w: 0.39, h: 0.075 };

function createLogic(seed, lang = 'ko') {
  const rng = mulberry32(seed);
  const state = {
    phase: 'playing',
    grid: [],          // [row][col] → null | tierIndex
    swipes: 0,
    best: 0,
    winTier: WIN_TIER,
    lives: null,
    lint: 1,
    rollback: 1,
    prev: null,        // 롤백용 스냅샷
    merged: [],        // 방금 합쳐진 셀 [r,c] — 팝 연출
    toast: null,
    moveSeq: 0,        // 스와이프 카운터(draw 클로저의 애니 타이머 트리거용 — 렌더 전용 소비)
    lastMoves: [],     // [{fromR,fromC,toR,toC,value,merged}] — 슬라이드 트윈용(결정론 값)
    lang,
  };

  for (let r = 0; r < N; r++) state.grid[r] = [null, null, null, null];

  function emptyCells() {
    const out = [];
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) if (state.grid[r][c] == null) out.push([r, c]);
    return out;
  }
  function spawn() {
    const empt = emptyCells();
    if (!empt.length) return;
    const [r, c] = empt[Math.floor(rng() * empt.length)];
    state.grid[r][c] = rng() < 0.9 ? 0 : 1;
  }
  spawn(); spawn();

  function lineOf(dir, i) {
    // dir 기준으로 진행 방향 순서의 셀 좌표 배열
    const out = [];
    for (let k = 0; k < N; k++) {
      if (dir === 'left') out.push([i, k]);
      if (dir === 'right') out.push([i, N - 1 - k]);
      if (dir === 'up') out.push([k, i]);
      if (dir === 'down') out.push([N - 1 - k, i]);
    }
    return out;
  }

  function canMove() {
    if (emptyCells().length) return true;
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const v = state.grid[r][c];
        if (r + 1 < N && state.grid[r + 1][c] === v) return true;
        if (c + 1 < N && state.grid[r][c + 1] === v) return true;
      }
    return false;
  }

  function toast(text, color) { state.toast = { text, timer: 2.4, color }; }

  return {
    state,
    events: [],
    step(dt) {
      if (state.toast && state.toast.timer > 0) state.toast.timer -= dt;
    },
    swipe(dir) {
      if (state.phase !== 'playing') return;
      const snapshot = state.grid.map((row) => row.slice());
      let changed = false;
      state.merged = [];
      const moves = [];  // 이번 스와이프의 from→to 이동 기록(슬라이드 트윈용)

      for (let i = 0; i < N; i++) {
        const cells = lineOf(dir, i);
        // 값과 함께 원래 셀 좌표도 같이 들고 다녀 from→to 매핑 가능하게
        const occupied = cells
          .map(([r, c]) => ({ r, c, v: state.grid[r][c] }))
          .filter((cell) => cell.v != null);
        const out = [];  // {v, from: [{r,c}], mergedInto: bool}
        let k = 0;
        while (k < occupied.length) {
          if (k + 1 < occupied.length && occupied[k].v === occupied[k + 1].v) {
            out.push({ v: occupied[k].v + 1, from: [occupied[k], occupied[k + 1]], merged: true });
            k += 2;
          } else {
            out.push({ v: occupied[k].v, from: [occupied[k]], merged: false });
            k += 1;
          }
        }
        cells.forEach(([r, c], idx) => {
          const slot = idx < out.length ? out[idx] : null;
          const nv = slot ? slot.v : null;
          if (state.grid[r][c] !== nv) changed = true;
          state.grid[r][c] = nv;
          if (slot) {
            for (const src of slot.from) {
              moves.push({ fromR: src.r, fromC: src.c, toR: r, toC: c, value: slot.v, merged: slot.merged });
            }
          }
        });
      }

      if (!changed) return;
      state.prev = snapshot;
      state.swipes++;
      state.moveSeq++;
      state.lastMoves = moves;
      spawn();

      let best = 0;
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) if (state.grid[r][c] != null) best = Math.max(best, state.grid[r][c]);
      if (best > state.best) {
        state.best = best;
        this.events.push({ type: 'good', x: 0.5, y: 0.45 });
        if (best >= 2) {
          const tn = state.lang === 'en' ? TIERS[best].en : TIERS[best].ko;
          toast((state.lang === 'en' ? 'assembled: ' : '조립 완성: ') + TIERS[best].g + ' ' + tn, TIERS[best].color);
        }
      }
      if (best >= WIN_TIER) { state.phase = 'won'; return; }
      if (!canMove()) { state.phase = 'lost'; }
    },
    tap(x, y) {
      if (state.phase !== 'playing') return;
      if (inRect(x, y, BTN_LINT)) {
        if (state.lint > 0) {
          // 최하위 티어 타일 1개 제거 (좌상단부터 — 결정론)
          let lowest = null, pos = null;
          for (let r = 0; r < N; r++)
            for (let c = 0; c < N; c++) {
              const v = state.grid[r][c];
              if (v != null && (lowest == null || v < lowest)) { lowest = v; pos = [r, c]; }
            }
          if (pos) {
            state.lint = 0;
            state.grid[pos[0]][pos[1]] = null;
            state.lastMoves = [];  // 스와이프 아님 — 슬라이드 트윈 대상 아님
            this.events.push({ type: 'good', x: GX + ((pos[1] + 0.5) / N) * GW, y: GY + ((pos[0] + 0.5) / N) * GH });
            toast(state.lang === 'en' ? 'lint — drift removed, space freed' : 'lint — 드리프트 1개 정리, 공간 확보', '#4ecdc4');
          }
        }
        return;
      }
      if (inRect(x, y, BTN_ROLLBACK)) {
        if (state.rollback > 0 && state.prev) {
          state.rollback = 0;
          state.grid = state.prev.map((row) => row.slice());
          state.prev = null;
          state.lastMoves = [];  // 스와이프 아님 — 슬라이드 트윈 대상 아님
          this.events.push({ type: 'good', x: 0.5, y: 0.45 });
          toast(state.lang === 'en' ? 'rollback — last change reverted' : 'rollback — 마지막 변경 되돌림', '#ffd166');
        }
        return;
      }
    },
  };
}

// draw는 로직 밖의 렌더 전용 상태를 클로저에 들고 있다(결정론 검사 대상 아님 — state 밖).
// moveSeq 변화를 감지해 스와이프 직후부터 트윈 타이머를 시작한다.
let mergeAnimSeq = -1;
let mergeAnimStart = null;   // 트윈 시작 시각(draw의 t 기준)
let mergeAnimMoves = [];     // 트윈 중 사용할 이동 스냅샷
const MERGE_SLIDE_MS = 150;
const MERGE_POP_MS = 120;
const MERGE_SPAWN_MS = 200;

function draw(ctx, W, H, logic, t) {
  const s = logic.state;
  const cw = (GW * W) / N, ch = (GH * H) / N;

  // moveSeq 변화 감지 → 새 트윈 시작(클로저 변수 — state 밖, 결정론 무관)
  if (s.moveSeq !== mergeAnimSeq) {
    mergeAnimSeq = s.moveSeq;
    mergeAnimStart = t;
    mergeAnimMoves = s.lastMoves;
  }
  const animT = mergeAnimStart == null ? 999 : t - mergeAnimStart;
  const slideProgress = Math.min(1, animT / (MERGE_SLIDE_MS / 1000));
  const sliding = animT < MERGE_SLIDE_MS / 1000 && mergeAnimMoves.length > 0;

  // 위계 사다리 (상단) — 목표 시각화
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const ladderY = 0.115 * H;
  TIERS.forEach((tier, i) => {
    const lx = (0.14 + i * 0.145) * W;
    const active = i <= s.best;
    const isWin = i === WIN_TIER;
    ctx.globalAlpha = active ? 1 : 0.3;
    ctx.font = `15px ${KIT.font}`;
    ctx.fillText(tier.g, lx, ladderY - 8);
    ctx.font = `${isWin ? 700 : 400} 9.5px ${KIT.font}`;
    ctx.fillStyle = isWin ? KIT.accent : KIT.dim;
    ctx.fillText(s.lang === 'en' ? tier.en : tier.ko, lx, ladderY + 10);
    ctx.globalAlpha = 1;
    if (i < TIERS.length - 1) {
      ctx.fillStyle = KIT.dim;
      ctx.font = `9px ${KIT.font}`;
      ctx.fillText('→', lx + 0.072 * W, ladderY);
    }
  });

  // 그리드 칸(배경 셀) — 항상 그대로
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const x = GX * W + c * cw, y = GY * H + r * ch;
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = 'rgba(140,160,220,0.18)';
      ctx.lineWidth = 1;
      roundRect(ctx, x + 3, y + 3, cw - 6, ch - 6, 10);
      ctx.fill();
      ctx.stroke();
    }
  }

  function cellCenter(r, c) {
    return [GX * W + c * cw + cw / 2, GY * H + r * ch + ch / 2];
  }
  function drawTile(cx, cy, v, scale, alpha) {
    const tier = TIERS[Math.min(v, TIERS.length - 1)];
    const tw = (cw - 10) * scale, th = (ch - 10) * scale;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = tier.color + '26';
    ctx.strokeStyle = tier.color;
    ctx.lineWidth = 1.5 + v * 0.3;
    roundRect(ctx, cx - tw / 2, cy - th / 2, tw, th, 10);
    ctx.fill();
    ctx.stroke();
    ctx.font = `${Math.floor(ch * 0.34 * scale)}px ${KIT.font}`;
    ctx.fillText(tier.g, cx, cy - 8 * scale);
    ctx.font = `700 ${Math.floor(ch * 0.15 * scale)}px ${KIT.font}`;
    ctx.fillStyle = tier.color;
    ctx.fillText(s.lang === 'en' ? tier.en : tier.ko, cx, cy + ch * 0.26 * scale);
    ctx.restore();
  }

  if (sliding) {
    // 슬라이드 트윈 — from → to 로 미끄러지고, merge된 타일은 도착 시 스케일 팝
    const ease = 1 - Math.pow(1 - slideProgress, 2); // ease-out
    for (const mv of mergeAnimMoves) {
      const [fx, fy] = cellCenter(mv.fromR, mv.fromC);
      const [tx, ty] = cellCenter(mv.toR, mv.toC);
      const cx = fx + (tx - fx) * ease;
      const cy = fy + (ty - fy) * ease;
      let scale = 1;
      if (mv.merged && slideProgress >= 1) {
        const popT = Math.min(1, (animT - MERGE_SLIDE_MS / 1000) / (MERGE_POP_MS / 1000));
        scale = 1 + 0.25 * Math.sin(popT * Math.PI);
      }
      drawTile(cx, cy, mv.value, scale, 1);
    }
  } else {
    // 정지 상태 렌더 — merge 팝 잔여 시간 처리 + 새 스폰 페이드인
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const v = s.grid[r][c];
        if (v == null) continue;
        const [cx, cy] = cellCenter(r, c);
        let scale = 1, alpha = 1;
        const mv = mergeAnimMoves.find((m) => m.toR === r && m.toC === c);
        const popT = mv ? (animT - MERGE_SLIDE_MS / 1000) / (MERGE_POP_MS / 1000) : 999;
        if (mv && mv.merged && popT >= 0 && popT < 1) {
          scale = 1 + 0.25 * Math.sin(popT * Math.PI);
        } else if (!mv && animT < MERGE_SPAWN_MS / 1000) {
          // 이번 스와이프로 새로 스폰된 타일(이동 기록에 없음) — 페이드인
          alpha = Math.min(1, animT / (MERGE_SPAWN_MS / 1000));
        }
        drawTile(cx, cy, v, scale, alpha);
      }
    }
  }

  // 첫 스와이프 전 — 조작 힌트(4방향 화살표 + 안내문)
  if (s.moveSeq === 0) {
    const cx = GX * W + GW * W / 2, cy = GY * H + GH * H / 2;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.font = `700 22px ${KIT.font}`;
    ctx.fillStyle = KIT.ink;
    ctx.fillText('←', cx - cw * 0.9, cy);
    ctx.fillText('→', cx + cw * 0.9, cy);
    ctx.fillText('↑', cx, cy - ch * 0.9);
    ctx.fillText('↓', cx, cy + ch * 0.9);
    ctx.restore();
    ctx.font = `700 11px ${KIT.font}`;
    ctx.fillStyle = KIT.dim;
    ctx.textAlign = 'center';
    ctx.fillText(
      s.lang === 'en' ? 'swipe and every piece slides!' : '스와이프하면 모든 조각이 미끄러져요',
      cx, GY * H + GH * H + 18
    );
  }

  // 아이템 버튼
  drawItemButton(ctx, W, H, BTN_LINT, {
    label: 'lint',
    sub: s.lang === 'en' ? 'remove 1 lowest tile' : '최하위 타일 1개 정리',
    count: s.lint,
    ready: s.lint > 0,
  });
  drawItemButton(ctx, W, H, BTN_ROLLBACK, {
    label: 'rollback',
    sub: s.lang === 'en' ? 'undo last swipe' : '마지막 스와이프 되돌리기',
    count: s.rollback,
    ready: s.rollback > 0 && !!s.prev,
  });

  ctx.font = `11px ${KIT.font}`;
  ctx.fillStyle = KIT.dim;
  ctx.textAlign = 'center';
  ctx.fillText(
    s.lang === 'en' ? 'swipe to merge same components' : '스와이프로 같은 컴포넌트를 합치세요',
    W / 2, H - 48
  );

  drawHUD(ctx, W, H, {
    lives: null,
    left: `🧩 ${s.lang === 'en' ? 'best' : '최고'}: ${TIERS[s.best].g} ${s.lang === 'en' ? TIERS[s.best].en : TIERS[s.best].ko}`,
    right: `↔ ${s.swipes}`,
  });
  drawToast(ctx, W, H, s.toast);
}
return { createLogic: createLogic, draw: draw };
})();


const GAME_pair = (function () {
// ============================================================
// 메모리 페어 — 학습 은하 퀘스트 게임 (보너스 도전 — 콘텐츠 비잠금).
// 장르: 카드 뒤집기 짝맞추기(clean-room). 4×3 그리드 12장(6쌍).
// 아이템 없음 — 지식·연결 은유 이모지 6종을 짝지어 60초 내 완성.
// ============================================================



const COLS = 4, ROWS = 3;
const GLYPHS = ['📄', '🔗', '🧠', '📊', '🗂', '✅'];
const TIME_LIMIT = 60;
const MISMATCH_DELAY = 0.8;

const GX = 0.09, GY = 0.16, GW = 0.82, GH = 0.58;

function createLogic(seed, lang = 'ko') {
  const rng = mulberry32(seed);
  const deckValues = [];
  for (let i = 0; i < GLYPHS.length; i++) { deckValues.push(i, i); }
  // Fisher-Yates 셔플 (시드 결정론)
  for (let i = deckValues.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = deckValues[i]; deckValues[i] = deckValues[j]; deckValues[j] = tmp;
  }

  const state = {
    phase: 'playing',
    cards: deckValues.map((v) => ({ v, flipped: false, matched: false })),
    firstIdx: null,
    secondIdx: null,
    resolveTimer: 0,
    pairs: 0,
    total: GLYPHS.length,
    timeLeft: TIME_LIMIT,
    toast: null,
    lang,
  };

  function toast(text, color) { state.toast = { text, timer: 1.6, color }; }

  function cellAt(x, y) {
    const c = Math.floor(((x - GX) / GW) * COLS);
    const r = Math.floor(((y - GY) / GH) * ROWS);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return null;
    return r * COLS + c;
  }

  return {
    state,
    events: [],
    cellAt,
    step(dt) {
      if (state.toast && state.toast.timer > 0) state.toast.timer -= dt;
      if (state.resolveTimer > 0) {
        state.resolveTimer -= dt;
        if (state.resolveTimer <= 0) {
          if (state.firstIdx != null) state.cards[state.firstIdx].flipped = false;
          if (state.secondIdx != null) state.cards[state.secondIdx].flipped = false;
          state.firstIdx = null;
          state.secondIdx = null;
        }
        return;
      }
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        if (state.pairs < state.total) state.phase = 'lost';
      }
    },
    tap(x, y) {
      if (state.phase !== 'playing' || state.resolveTimer > 0) return;
      const idx = cellAt(x, y);
      if (idx == null) return;
      const card = state.cards[idx];
      if (!card || card.matched || card.flipped) return;
      card.flipped = true;
      if (state.firstIdx == null) {
        state.firstIdx = idx;
        return;
      }
      state.secondIdx = idx;
      const a = state.cards[state.firstIdx], b = state.cards[state.secondIdx];
      if (a.v === b.v) {
        a.matched = true; b.matched = true;
        state.pairs++;
        state.firstIdx = null; state.secondIdx = null;
        this.events.push({ type: 'good', x, y });
        toast(state.lang === 'en' ? 'match!' : '짝 맞음!', '#4ecdc4');
        if (state.pairs >= state.total) { state.phase = 'won'; return; }
      } else {
        state.resolveTimer = MISMATCH_DELAY;
        this.events.push({ type: 'bad', x, y });
      }
    },
  };
}

function draw(ctx, W, H, logic, t) {
  const s = logic.state;
  const cw = (GW * W) / COLS, ch = (GH * H) / ROWS;

  ctx.strokeStyle = 'rgba(140,160,220,0.25)';
  ctx.lineWidth = 1;
  roundRect(ctx, GX * W - 6, GY * H - 6, GW * W + 12, GH * H + 12, 12);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < s.cards.length; i++) {
    const card = s.cards[i];
    const c = i % COLS, r = Math.floor(i / COLS);
    const x = GX * W + c * cw, y = GY * H + r * ch;
    const revealed = card.flipped || card.matched;
    if (card.matched) {
      ctx.fillStyle = 'rgba(255,209,102,0.16)';
      ctx.strokeStyle = KIT.accent;
      ctx.lineWidth = 2;
      ctx.shadowColor = KIT.accent;
      ctx.shadowBlur = 10;
    } else if (revealed) {
      ctx.fillStyle = 'rgba(78,205,196,0.14)';
      ctx.strokeStyle = KIT.good;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = 'rgba(140,160,220,0.35)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
    }
    roundRect(ctx, x + cw * 0.06, y + ch * 0.08, cw * 0.88, ch * 0.84, 10);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = `${Math.floor(ch * 0.36)}px ${KIT.font}`;
    ctx.fillStyle = KIT.ink;
    ctx.fillText(revealed ? GLYPHS[card.v] : '❔', x + cw / 2, y + ch / 2);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, 16, H - 34, W - 32, 10, 5);
  ctx.fill();
  ctx.fillStyle = KIT.good;
  roundRect(ctx, 16, H - 34, (W - 32) * Math.min(s.pairs / s.total, 1), 10, 5);
  ctx.fill();

  ctx.font = `11px ${KIT.font}`;
  ctx.fillStyle = KIT.dim;
  ctx.fillText(
    s.lang === 'en' ? 'tap two cards to find a matching pair' : '카드 2장을 뒤집어 같은 짝을 찾으세요',
    W / 2, H - 48
  );

  drawHUD(ctx, W, H, {
    lives: null,
    left: `🃏 ${s.pairs}/${s.total}`,
    right: `⏱ ${Math.ceil(s.timeLeft)}s`,
  });
  drawToast(ctx, W, H, s.toast);
}
return { createLogic: createLogic, draw: draw };
})();

const GAME_survivor = (function () {
// ============================================================
// 코어 서바이버 — 어바웃 코어 은하 퀘스트 게임 (보너스 도전 — 콘텐츠 비잠금).
// 장르: 초미니 뱀서류(clean-room). 30초 생존.
// 코어(⭐)를 드래그/탭으로 이동해 잡음 입자(회색 원)를 피하고,
// 골드 오브(●)를 먹으면 근접 입자를 일소(오토 펄스)한다.
// 반사신경 부담 최소화: 입자 느린 속도 + 스폰 전 예고 링.
// ============================================================



const GOAL_TIME = 30;
const LIVES = 3;
const CORE_R = 15;
const PARTICLE_R = 9;
const ORB_R = 10;
const WARN_TIME = 0.55;
const INV_TIME = 1.0;
const PULSE_RADIUS = 150;

function clamp01(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

function createLogic(seed, lang = 'ko') {
  const rng = mulberry32(seed);
  const state = {
    phase: 'playing',
    elapsed: 0,
    goal: GOAL_TIME,
    lives: LIVES,
    core: { x: 0.5, y: 0.52 },
    targetX: 0.5,
    targetY: 0.52,
    inv: 0,
    pulse: 0,
    particles: [],
    orbs: [],
    toast: null,
    lang,
  };
  let spawnT = 1.2;
  let orbT = 3.5;

  function toast(text, color) { state.toast = { text, timer: 1.6, color }; }

  function spawnParticle() {
    const edge = Math.floor(rng() * 4);
    let x, y;
    if (edge === 0) { x = rng(); y = -0.04; }
    else if (edge === 1) { x = 1.04; y = rng(); }
    else if (edge === 2) { x = rng(); y = 1.04; }
    else { x = -0.04; y = rng(); }
    const tx = 0.28 + rng() * 0.44, ty = 0.28 + rng() * 0.44;
    const dx = tx - x, dy = ty - y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 0.075 + rng() * 0.035; // 화면비 단위/초 — 낮게(반사신경 부담 최소)
    state.particles.push({
      x, y, vx: (dx / dist) * speed, vy: (dy / dist) * speed,
      mode: 'warn', timer: WARN_TIME,
    });
  }
  function spawnOrb() {
    state.orbs.push({
      x: 0.18 + rng() * 0.64, y: 0.2 + rng() * 0.56,
      vx: (rng() - 0.5) * 0.025, vy: (rng() - 0.5) * 0.025,
    });
  }

  return {
    state,
    events: [],
    point(x, y) {
      state.targetX = clamp01(x, 0.07, 0.93);
      state.targetY = clamp01(y, 0.12, 0.88);
    },
    tap(x, y) {
      if (state.phase !== 'playing') return;
      this.point(x, y);
    },
    step(dt) {
      state.elapsed += dt;
      if (state.toast && state.toast.timer > 0) state.toast.timer -= dt;
      if (state.inv > 0) state.inv -= dt;
      if (state.pulse > 0) state.pulse -= dt;

      state.core.x += (state.targetX - state.core.x) * Math.min(1, dt * 8);
      state.core.y += (state.targetY - state.core.y) * Math.min(1, dt * 8);

      spawnT -= dt;
      if (spawnT <= 0) { spawnParticle(); spawnT = 0.85 + rng() * 0.45; }
      orbT -= dt;
      if (orbT <= 0) { spawnOrb(); orbT = 4 + rng() * 2; }

      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        if (p.mode === 'warn') {
          p.timer -= dt;
          if (p.timer <= 0) p.mode = 'active';
          continue;
        }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -0.18 || p.x > 1.18 || p.y < -0.18 || p.y > 1.18) { state.particles.splice(i, 1); continue; }
        const dx = (p.x - state.core.x) * KIT.W, dy = (p.y - state.core.y) * KIT.H;
        if (state.inv <= 0 && Math.hypot(dx, dy) < PARTICLE_R + CORE_R) {
          state.particles.splice(i, 1);
          state.lives--;
          state.inv = INV_TIME;
          this.events.push({ type: 'bad', x: state.core.x, y: state.core.y });
          if (state.lives <= 0) { state.lives = 0; state.phase = 'lost'; return; }
        }
      }

      for (let i = state.orbs.length - 1; i >= 0; i--) {
        const o = state.orbs[i];
        o.x += o.vx * dt; o.y += o.vy * dt;
        if (o.x < 0.08 || o.x > 0.92) o.vx *= -1;
        if (o.y < 0.12 || o.y > 0.88) o.vy *= -1;
        const dx = (o.x - state.core.x) * KIT.W, dy = (o.y - state.core.y) * KIT.H;
        if (Math.hypot(dx, dy) < ORB_R + CORE_R) {
          state.orbs.splice(i, 1);
          state.pulse = 0.4;
          this.events.push({ type: 'good', x: state.core.x, y: state.core.y });
          toast(state.lang === 'en' ? 'pulse — nearby noise cleared' : '오토 펄스 — 근접 입자 일소', '#ffd166');
          for (let j = state.particles.length - 1; j >= 0; j--) {
            const q = state.particles[j];
            if (q.mode !== 'active') continue;
            const qdx = (q.x - state.core.x) * KIT.W, qdy = (q.y - state.core.y) * KIT.H;
            if (Math.hypot(qdx, qdy) < PULSE_RADIUS) {
              state.particles.splice(j, 1);
              this.events.push({ type: 'good', x: q.x, y: q.y });
            }
          }
        }
      }

      if (state.elapsed >= state.goal) { state.elapsed = state.goal; state.phase = 'won'; return; }
    },
  };
}

function draw(ctx, W, H, logic, t) {
  const s = logic.state;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 잡음 입자 — 예고 링(warn) → 활성(회색 원)
  for (const p of s.particles) {
    const px = p.x * W, py = p.y * H;
    if (p.mode === 'warn') {
      const ringT = 1 - p.timer / WARN_TIME;
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = 'rgba(154,165,196,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, PARTICLE_R + ringT * 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      continue;
    }
    ctx.fillStyle = 'rgba(154,165,196,0.4)';
    ctx.strokeStyle = 'rgba(154,165,196,0.75)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(px, py, PARTICLE_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 골드 오브
  for (const o of s.orbs) {
    const ox = o.x * W, oy = o.y * H;
    const pulse = 1 + Math.sin(t * 4) * 0.08;
    ctx.fillStyle = KIT.accent;
    ctx.shadowColor = KIT.accent;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ox, oy, ORB_R * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 코어
  const cx = s.core.x * W, cy = s.core.y * H;
  if (s.inv <= 0 || Math.floor(t * 12) % 2 === 0) {
    ctx.save();
    ctx.shadowColor = s.pulse > 0 ? KIT.accent : '#ffffff';
    ctx.shadowBlur = s.pulse > 0 ? 22 : 12;
    ctx.font = `${Math.floor(CORE_R * 2.1)}px ${KIT.font}`;
    ctx.fillText('⭐', cx, cy);
    ctx.restore();
  }
  if (s.pulse > 0) {
    const pr = (1 - s.pulse / 0.4) * PULSE_RADIUS;
    ctx.save();
    ctx.globalAlpha = s.pulse / 0.4 * 0.6;
    ctx.strokeStyle = KIT.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, pr, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.font = `11px ${KIT.font}`;
  ctx.fillStyle = KIT.dim;
  ctx.fillText(
    s.lang === 'en' ? 'drag/tap to move · gold orb clears nearby noise' : '드래그/탭으로 코어를 이동 · 골드 오브 = 근접 입자 일소',
    W / 2, H - 48
  );

  drawHUD(ctx, W, H, {
    lives: s.lives,
    left: s.lang === 'en' ? 'survive' : '생존',
    right: `⏱ ${Math.ceil(s.goal - s.elapsed)}s`,
  });
  drawToast(ctx, W, H, s.toast);
}
return { createLogic: createLogic, draw: draw };
})();

const JW_GAMES = {
  mountGame: mountGame,
  games: { blast: GAME_blast, shooter: GAME_shooter, runner: GAME_runner, merge: GAME_merge, pair: GAME_pair, survivor: GAME_survivor },
  meta: {
    blast: {
      title: "스타 블라스트",
      howto: "같은 지식 조각 2+ 뭉치를 탭! graphify 게이지가 차면 [[링크]]를 타고 연결 뭉치를 연쇄 추출 — 환각 👻도 그때 걸러집니다.",
      teaserLine: "같은 지식을 연결해 한 번에 꺼내는 방식, 실제로 제가 일하는 방식이에요.",
      bridge: "흩어진 정보는 연결돼 있을 때만 힘이 됩니다. 지식을 그래프로 잇고, 연결을 타고 검색하는 것 — 제가 지식을 다루는 첫 번째 원칙이에요."
    },
    shooter: {
      title: "은하 슈터",
      howto: "드래그/탭 = 조준, 발사는 자동! 5킬마다 |z|>1.65 게이트 더블샷, 위기엔 킬스위치. 편대 전멸이면 클리어.",
      teaserLine: "함부로 쏘지 않는 게이트, 제가 AI 에이전트에 거는 안전장치예요.",
      bridge: "확신이 없으면 행동을 승인하지 않고(게이트), 위험이 보이면 즉시 멈춥니다(킬스위치). AI에게 일을 맡길 때 제가 지키는 두 가지 원칙이에요."
    },
    runner: {
      title: "코스믹 러너",
      howto: "탭 = 점프(2단)! Claude 문어 🐙로 운석을 피하고 별을 모아 400m를 완주하세요. 빨간 테두리 = 위험!",
      teaserLine: "겉모습이 아니라 움직임으로 가려내는 판단이에요.",
      bridge: "위험은 겉모습이 아니라 행동 패턴으로 드러납니다. AI의 산출도 똑같이 — 그럴듯한 말이 아니라 검증된 행동만 믿는 게 제 원칙이에요."
    },
    merge: {
      title: "컴포넌트 머지",
      howto: "스와이프(또는 방향키)로 모든 조각이 한 방향으로 미끄러집니다. 같은 컴포넌트가 만나면 합쳐져요! 📄 페이지 조립이면 클리어.",
      teaserLine: "작은 조각이 합쳐져 시스템이 되는 과정이에요.",
      bridge: "좋은 화면은 한 번에 그리는 게 아니라 작은 단위를 규칙으로 합쳐 만듭니다. 토큰에서 컴포넌트, 페이지까지 — 디자인을 시스템으로 쌓는 방식이에요."
    },
    pair: {
      title: "메모리 페어",
      howto: "카드 2장을 탭해 뒤집으세요! 같은 조각이면 고정, 다르면 잠시 후 다시 닫힙니다. 60초 안에 6쌍을 모두 맞추면 클리어.",
      teaserLine: "흩어진 개념도 짝을 찾으면 지식이 돼요.",
      bridge: "배운 것은 기록하고, 기록한 것은 연결합니다. 짝을 찾은 지식만 오래 남는다는 게 매주 학습을 공개해 온 이유예요."
    },
    survivor: {
      title: "코어 서바이버",
      howto: "드래그/탭으로 코어 ⭐를 움직여 잡음 입자(회색 원)를 피하세요! 골드 오브를 먹으면 근처 입자가 한 번에 사라져요. 30초 생존하면 클리어.",
      teaserLine: "쏟아지는 것들 속에서 중심을 지키는 감각이에요.",
      bridge: "일은 언제나 한꺼번에 몰려옵니다. 중심을 지키면서 지금 잡아야 할 것 하나를 고르는 것 — 제가 일하는 리듬이에요."
    }
  }
};

if (root) { root.JW_GAMES = JW_GAMES; }
if (typeof module !== "undefined") { module.exports = JW_GAMES; }
})(typeof window !== "undefined" ? window : null);
