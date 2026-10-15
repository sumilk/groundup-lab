/* NN02 figures: what a network can represent.
   Every network drawn here is also built as data and evaluated, so the counts
   printed under a diagram (units, connections, depth) and every shaded region
   or plotted curve come from the mathematics, not from hand-entered numbers. */
import {C, figure, panel, text} from "./svgkit.mjs";

const r2 = v => Math.round(v * 100) / 100;
const H = z => (z >= 0 ? 1 : 0);
const relu = z => Math.max(0, z);
const minus = s => String(s).replace(/-/g, "−");
const fmtW = v => (v === 0.5 ? "½" : v === -0.5 ? "−½" : v > 0 ? "+" + v : minus(v));
const fmtB = v => (v === 0.5 ? "½" : v === -0.5 ? "−½" : minus(v));
const heading = (s, w = 900) => text(w / 2, 44, s, {color: C.label, size: 18, anchor: "middle"});
const label = (x, y, s, o = {}) => text(x, y, s, {color: C.label, size: 14, anchor: "middle", ...o});
const path = (d, {color = C.muted, width = 2, fill = "none", dash, opacity} = {}) =>
  `<path d="${d}" stroke="${color}" stroke-width="${width}" fill="${fill}"${dash ? ` stroke-dasharray="${dash}"` : ""}${opacity !== undefined ? ` fill-opacity="${opacity}"` : ""}/>`;
const circle = (x, y, r, {stroke = C.teal, fill = C.bg, width = 2.4, dash} = {}) =>
  `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const box = (x, y, w, h, {stroke = C.teal, fill = C.bg, rx = 10, width = 2.2, dash, opacity} = {}) =>
  `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${rx}" fill="${fill}"${opacity !== undefined ? ` fill-opacity="${opacity}"` : ""} stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
function arrow(x0, y0, x1, y1, {color = C.dim, width = 2, head = 9, dash} = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  const bx = x1 - ux * head, by = y1 - uy * head;
  return `<path d="M${r2(x0)} ${r2(y0)}L${r2(bx)} ${r2(by)}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""} fill="none"/>` +
    `<path d="M${r2(x1)} ${r2(y1)}L${r2(bx - uy * head * .5)} ${r2(by + ux * head * .5)}L${r2(bx + uy * head * .5)} ${r2(by - ux * head * .5)}Z" fill="${color}"/>`;
}
/** Arrow between two circles of radius ra and rb (stops at the rims). */
function link(a, b, {ra = 16, rb = 16, ...o} = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  return arrow(a[0] + ux * ra, a[1] + uy * ra, b[0] - ux * rb, b[1] - uy * rb, o);
}
/** A weight label on a small background chip, a fraction t along a→b. */
function chip(a, b, s, {t = 0.45, color = C.label, size = 13, w = 26} = {}) {
  const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
  return `<rect x="${r2(x - w / 2)}" y="${r2(y - 10)}" width="${w}" height="17" rx="4" fill="${C.bg}"/>` + text(x, y + 3.5, s, {color, size, anchor: "middle"});
}

/* ---------- networks as data ---------- */
/** {inputs:[names], units:[{n, w:{src: weight}, b, act?}]}, units in topological order. */
function run(net, x) {
  const env = {...x};
  for (const u of net.units) {
    const z = Object.entries(u.w).reduce((s, [k, w]) => s + w * env[k], u.b);
    env[u.n] = u.act === "relu" ? relu(z) : u.act === "linear" ? z : H(z);
  }
  return env;
}
function stats(net) {
  const depth = Object.fromEntries(net.inputs.map(n => [n, 0]));
  let conns = 0;
  for (const u of net.units) {
    const ins = Object.entries(u.w).filter(([, w]) => w !== 0);
    conns += ins.length;
    depth[u.n] = 1 + Math.max(...ins.map(([k]) => depth[k]));
  }
  const strict = net.units.every(u => Object.entries(u.w).every(([k, w]) => w === 0 || depth[k] === depth[u.n] - 1));
  return {units: net.units.length, conns, depth: depth[net.units.at(-1).n], depths: depth, strict};
}
const bitsOf = (r, n) => [...Array(n).keys()].map(i => (r >> (n - 1 - i)) & 1);
function assertComputes(net, n, f, names) {
  for (let r = 0; r < 2 ** n; r++) {
    const b = bitsOf(r, n), x = Object.fromEntries(names.map((nm, i) => [nm, b[i]]));
    const y = run(net, x)[net.units.at(-1).n];
    if (y !== f(b, r)) throw new Error(`network disagrees with target on row ${r}`);
  }
}
const sub = i => String(i).split("").map(c => "₀₁₂₃₄₅₆₇₈₉"[c]).join("");
const xs = n => [...Array(n).keys()].map(i => "x" + sub(i + 1));
const parity = b => b.reduce((s, v) => s + v, 0) % 2;

function dnfParity(n) {
  const X = xs(n), units = [];
  for (let r = 0; r < 2 ** n; r++) {
    const b = bitsOf(r, n);
    if (!parity(b)) continue;
    units.push({n: "a" + r, w: Object.fromEntries(X.map((x, i) => [x, b[i] ? 1 : -1])), b: -b.reduce((s, v) => s + v, 0), pattern: b.join("")});
  }
  units.push({n: "y", w: Object.fromEntries(units.map(u => [u.n, 1])), b: -1});
  return {inputs: X, units};
}
function countingParity(n) {
  const X = xs(n), units = [];
  for (let k = 1; k <= n; k++) units.push({n: "c" + sub(k), w: Object.fromEntries(X.map(x => [x, 1])), b: -k});
  units.push({n: "y", w: Object.fromEntries(units.map((u, i) => [u.n, i % 2 ? -1 : 1])), b: -1});
  return {inputs: X, units};
}
/** Three-unit XOR block (OR, NAND, then AND) reading a and b, output named out. */
const xorBlock = (a, b, out) => [
  {n: out + ".or", w: {[a]: 1, [b]: 1}, b: -1}, {n: out + ".nand", w: {[a]: -1, [b]: -1}, b: 1},
  {n: out, w: {[out + ".or"]: 1, [out + ".nand"]: 1}, b: -2}];
function treeParity(n) {
  let vals = xs(n), units = [], k = 0;
  const rounds = [];
  while (vals.length > 1) {
    const next = [], blocks = [];
    for (let i = 0; i + 1 < vals.length; i += 2) {
      const out = "z" + (++k); units.push(...xorBlock(vals[i], vals[i + 1], out)); next.push(out); blocks.push([vals[i], vals[i + 1], out]);
    }
    if (vals.length % 2) next.push(vals.at(-1));
    rounds.push(blocks); vals = next;
  }
  return {inputs: xs(n), units, rounds, out: vals[0]};
}

/* ---------- plotting helpers ---------- */
const sup = s => String(s).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] ?? (c === "-" ? "⁻" : c)).join("");
const polyline = (pts, o) => path(pts.map(([x, y], i) => (i ? "L" : "M") + r2(x) + " " + r2(y)).join(""), o);
const lerpHex = (a, b, t) => {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
};
/** Sequential ramp from the card colour through blue and teal to ink. */
const RAMP = ["#16263d", C.blue, C.teal, C.ink];
function ramp(t) {
  t = Math.max(0, Math.min(1, t));
  const s = t * (RAMP.length - 1), i = Math.min(RAMP.length - 2, Math.floor(s));
  return lerpHex(RAMP[i], RAMP[i + 1], s - i);
}

/** Shade a scalar field on a panel: quantize to `levels` colours, then merge equal runs along rows and down columns. */
function heat(p, f, {xmin, xmax, ymin, ymax, N = 48, lo, hi, levels = 10}) {
  const dx = (xmax - xmin) / N, dy = (ymax - ymin) / N, lvl = v => Math.max(0, Math.min(levels - 1, Math.floor((v - lo) / (hi - lo) * levels)));
  const d = Array.from({length: levels}, () => "");
  let open = new Map();
  const close = ([i0, i1, k], j0, j1) => {
    const [px0, py1] = p.P([xmin + i0 * dx, ymin + j0 * dy]), [px1, py0] = p.P([xmin + i1 * dx, ymin + j1 * dy]);
    d[k] += `M${r2(px0)} ${r2(py0)}h${r2(px1 - px0)}v${r2(py1 - py0)}h${r2(px0 - px1)}z`;
  };
  for (let j = 0; j <= N; j++) {
    const runs = [];
    if (j < N) for (let i = 0; i < N; i++) {
      const k = lvl(f(xmin + (i + .5) * dx, ymin + (j + .5) * dy));
      if (runs.length && runs.at(-1)[2] === k) runs.at(-1)[1] = i + 1; else runs.push([i, i + 1, k]);
    }
    const next = new Map();
    for (const r of runs) { const key = r.join(); next.set(key, open.has(key) ? open.get(key) : {r, j0: j}); }
    for (const [key, o] of open) if (!next.has(key)) close(o.r, o.j0, j);
    open = next;
  }
  d.forEach((s, k) => { if (s) p.raw(`<path d="${s}" fill="${ramp((k + .5) / levels)}" shape-rendering="crispEdges"/>`); });
}
/** Shade a ridge field g(w·x) exactly: each colour band is a strip between two lines w·x = t, clipped to the panel. */
function ridgeBands(p, wv, g, {tmin, tmax, lo, hi, levels, clipId}) {
  const lvl = t => Math.max(0, Math.min(levels - 1, Math.floor((g(t) - lo) / (hi - lo) * levels)));
  const M = 4000, ts = [tmin];
  for (let i = 1; i <= M; i++) {
    let a = tmin + (i - 1) * (tmax - tmin) / M, b = tmin + i * (tmax - tmin) / M;
    if (lvl(a) === lvl(b)) continue;
    const ka = lvl(a);
    for (let it = 0; it < 40; it++) { const m = (a + b) / 2; if (lvl(m) === ka) a = m; else b = m; }
    ts.push((a + b) / 2);
  }
  ts.push(tmax);
  const n2 = wv[0] ** 2 + wv[1] ** 2, dir = [-wv[1] * 4, wv[0] * 4], at = t => [wv[0] * t / n2, wv[1] * t / n2];
  const out = [];
  for (let i = 0; i + 1 < ts.length; i++) {
    const a = at(ts[i]), b = at(ts[i + 1]), k = lvl((ts[i] + ts[i + 1]) / 2);
    const pts = [[a[0] - dir[0], a[1] - dir[1]], [a[0] + dir[0], a[1] + dir[1]], [b[0] + dir[0], b[1] + dir[1]], [b[0] - dir[0], b[1] - dir[1]]].map(q => p.P(q).map(v => v.toFixed(1)).join(" "));
    out.push(`<path d="M${pts.join("L")}Z" fill="${ramp((k + .5) / levels)}" stroke="${ramp((k + .5) / levels)}" stroke-width=".6"/>`);
  }
  p.raw(`<g clip-path="url(#${clipId})">${out.join("")}</g>`);
}
/** Shade the set {f = 1} on a panel by sampling, run-length encoded like NN01. */
function shadeSet(p, f, {xmin, xmax, ymin, ymax, N = 160, color = C.pink, opacity = .32}) {
  const dx = (xmax - xmin) / N, dy = (ymax - ymin) / N, rows = [];
  for (let j = 0; j < N; j++) {
    const runs = [];
    for (let i = 0; i < N; i++) {
      if (!f(xmin + (i + .5) * dx, ymin + (j + .5) * dy)) continue;
      if (runs.length && runs.at(-1)[1] === i) runs.at(-1)[1] = i + 1; else runs.push([i, i + 1]);
    }
    rows.push(JSON.stringify(runs));
  }
  let d = "";
  for (let j0 = 0; j0 < N;) {
    let j1 = j0 + 1;
    while (j1 < N && rows[j1] === rows[j0]) j1++;
    for (const [i0, i1] of JSON.parse(rows[j0])) {
      const [px0, py1] = p.P([xmin + i0 * dx, ymin + j0 * dy]), [px1, py0] = p.P([xmin + i1 * dx, ymin + j1 * dy]);
      d += `M${px0.toFixed(1)} ${py0.toFixed(1)}H${px1.toFixed(1)}V${py1.toFixed(1)}H${px0.toFixed(1)}Z`;
    }
    j0 = j1;
  }
  if (d) p.raw(`<path d="${d}" fill="${color}" fill-opacity="${opacity}"/>`);
}

/** A rectangular plotting frame with explicit pixel box and data ranges (x may be log). */
function frame({x, y, w, h, xmin, xmax, ymin, ymax, xlog, ylog}) {
  const tx = v => (xlog ? Math.log10(v) : v), ty = v => (ylog ? Math.log10(v) : v);
  const X = v => x + (tx(v) - tx(xmin)) / (tx(xmax) - tx(xmin)) * w;
  const Y = v => y + h - (ty(v) - ty(ymin)) / (ty(ymax) - ty(ymin)) * h;
  return {X, Y, x, y, w, h};
}
const logLabel = k => (k === 0 ? "1" : k === 1 ? "10" : "10" + sup(k));


/* ---------- convex cells of a line arrangement ---------- */
/** Keep the part of a convex polygon where sgn·(a x + b y − c) ≥ 0. */
function clipHalf(poly, [a, b, c], sgn) {
  const out = [], f = q => sgn * (a * q[0] + b * q[1] - c);
  poly.forEach((P, i) => {
    const Q = poly[(i + 1) % poly.length], fp = f(P), fq = f(Q);
    if (fp >= 0) out.push(P);
    if (fp * fq < 0) { const t = fp / (fp - fq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
  });
  return out;
}
const signedArea = p => p.reduce((s, q, i) => s + q[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * q[1], 0) / 2;
/** Every nonempty sign pattern of the lines inside the window is one cell. */
function cellsOf(lines, W) {
  const cells = [];
  for (let m = 0; m < 2 ** lines.length; m++) {
    let poly = W;
    lines.forEach((l, i) => { if (poly.length) poly = clipHalf(poly, l, (m >> i) & 1 ? 1 : -1); });
    if (poly.length >= 3 && Math.abs(signedArea(poly)) > 1e-9) cells.push(signedArea(poly) > 0 ? poly : poly.slice().reverse());
  }
  return cells;
}
/** A label point deep inside a convex polygon: the grid point farthest from its edges. */
function poleOf(poly) {
  const d = q => Math.min(...poly.map((a, i) => { const b = poly[(i + 1) % poly.length], ex = b[0] - a[0], ey = b[1] - a[1];
    return (ex * (q[1] - a[1]) - ey * (q[0] - a[0])) / Math.hypot(ex, ey); }));
  const X = poly.map(q => q[0]), Y = poly.map(q => q[1]);
  let best = [-1, null];
  for (let i = 0; i <= 40; i++) for (let j = 0; j <= 40; j++) {
    const q = [Math.min(...X) + (Math.max(...X) - Math.min(...X)) * i / 40, Math.min(...Y) + (Math.max(...Y) - Math.min(...Y)) * j / 40], v = d(q);
    if (v > best[0]) best = [v, q];
  }
  return best[1];
}
const fmtNum = v => minus(Math.abs(v - Math.round(v)) < 1e-6 ? String(Math.round(v)) : v.toFixed(2));

export default {
  /* Opening: six-bit parity three ways. */
  "nn02-parity-three-ways"() {
    const n = 6, dnf = dnfParity(n), cnt = countingParity(n), tree = treeParity(n);
    assertComputes(dnf, n, parity, xs(n)); assertComputes(cnt, n, parity, xs(n)); assertComputes(tree, n, parity, xs(n));
    const S = [stats(dnf), stats(cnt), stats(tree)];
    const parts = [heading("Six-bit parity, three constructions", 960)];
    const top = 110, gap = 44, inY = i => top + i * gap, X = xs(n);
    const colX = [20, 340, 660];
    // --- DNF ---
    {
      const x0 = colX[0], ix = x0 + 34, hx = x0 + 150, ox = x0 + 268;
      const shown = [0, 1, 2, 30, 31].map(i => dnf.units[i]), hidden = dnf.units.length - 1;
      const hy = [0, 1, 2, 4, 5].map(i => top - 6 + i * 47);
      X.forEach((nm, i) => shown.forEach((u, k) => parts.push(path(`M${ix + 15} ${inY(i)}L${hx - 34} ${hy[k]}`, {color: u.w[nm] > 0 ? C.dim : "#3d2c55", width: 1.2}))));
      shown.forEach((u, k) => parts.push(link([hx + 34, hy[k]], [ox, inY(2.5)], {ra: 0, rb: 19, color: C.dim, width: 1.6})));
      parts.push(text(hx, top - 6 + 3 * 47 + 6, "⋮", {color: C.label, size: 20, anchor: "middle"}));
      shown.forEach((u, k) => parts.push(box(hx - 34, hy[k] - 13, 68, 26, {stroke: C.teal, rx: 13}),
        text(hx, hy[k] + 5, u.pattern, {color: C.ink, size: 13, anchor: "middle"})));
      parts.push(text(hx, top - 6 + 5 * 47 + 36, `${hidden} AND units, one per odd row`, {color: C.teal, size: 13, anchor: "middle"}),
        text(hx, top - 6 + 5 * 47 + 54, "each pill: the one row it accepts", {color: C.muted, size: 13, anchor: "middle"}));
      parts.push(circle(ox, inY(2.5), 19, {stroke: C.pink}), text(ox, inY(2.5) + 5, fmtB(dnf.units.at(-1).b), {color: C.ink, size: 14, anchor: "middle"}),
        text(ox, inY(2.5) + 38, "OR", {color: C.label, size: 13, anchor: "middle"}));
    }
    // --- counting ---
    {
      const x0 = colX[1], ix = x0 + 34, hx = x0 + 150, ox = x0 + 268;
      cnt.units.slice(0, n).forEach((u, k) => X.forEach((nm, i) => parts.push(path(`M${ix + 15} ${inY(i)}L${hx - 17} ${inY(k)}`, {color: C.dim, width: 1.2}))));
      cnt.units.slice(0, n).forEach((u, k) => {
        const w = cnt.units.at(-1).w[u.n];
        parts.push(link([hx, inY(k)], [ox, inY(2.5)], {ra: 17, rb: 19, color: w > 0 ? C.teal : C.purple, width: 1.8}),
          chip([hx, inY(k)], [ox, inY(2.5)], fmtW(w), {t: .42, color: w > 0 ? C.teal : C.purple}));
      });
      cnt.units.slice(0, n).forEach((u, k) => parts.push(circle(hx, inY(k), 17), text(hx, inY(k) + 5, fmtB(u.b), {color: C.ink, size: 13, anchor: "middle"})));
      parts.push(circle(ox, inY(2.5), 19, {stroke: C.pink}), text(ox, inY(2.5) + 5, fmtB(cnt.units.at(-1).b), {color: C.ink, size: 14, anchor: "middle"}),
        text(hx, top - 6 + 5 * 47 + 36, "cₖ = θ(x₁+⋯+x₆ − k), k = 1…6 from the top", {color: C.teal, size: 13, anchor: "middle"}),
        text(hx, top - 6 + 5 * 47 + 54, "edges in: weight 1 · nodes: biases", {color: C.muted, size: 13, anchor: "middle"}));
    }
    // --- tree of XOR blocks ---
    {
      const x0 = colX[2], ix = x0 + 34, cx = [x0 + 120, x0 + 195, x0 + 268];
      const pos = Object.fromEntries(X.map((nm, i) => [nm, [ix, inY(i)]]));
      tree.rounds.forEach((blocks, r) => blocks.forEach(([a, b, out]) => {
        pos[out] = [cx[r], (pos[a][1] + pos[b][1]) / 2];
      }));
      tree.rounds.forEach(blocks => blocks.forEach(([a, b, out]) => {
        for (const s of [a, b]) parts.push(link(pos[s], pos[out], {ra: s.startsWith("x") ? 15 : 18, rb: 18, color: C.dim, width: 1.8}));
      }));
      tree.rounds.forEach(blocks => blocks.forEach(([, , out]) => {
        const [x, y] = pos[out];
        parts.push(box(x - 18, y - 16, 36, 32, {stroke: out === tree.out ? C.pink : C.orange, rx: 8}), text(x, y + 6, "⊕", {color: C.ink, size: 17, anchor: "middle"}),
          text(x, y - 22, out.replace(/\d+/, d => sub(d)), {color: C.label, size: 13, anchor: "middle"}));
      }));
      parts.push(text(x0 + 150, top - 6 + 5 * 47 + 36, "⊕ = OR, NAND → AND: 3 units each", {color: C.orange, size: 13, anchor: "middle"}),
        text(x0 + 150, top - 6 + 5 * 47 + 54, "each ⊕ adds two layers; z₃ waits", {color: C.muted, size: 13, anchor: "middle"}));
    }
    // inputs and counts
    colX.forEach((x0, c) => {
      X.forEach((nm, i) => parts.push(circle(x0 + 34, inY(i), 15, {stroke: C.label}), text(x0 + 34, inY(i) + 5, nm, {color: C.ink, size: 13, anchor: "middle"})));
      const s = S[c];
      parts.push(text(x0 + 150, 84, ["DNF (AND–OR)", "counting", "tree of XOR blocks"][c], {color: C.ink, size: 16, anchor: "middle", weight: 600}),
        box(x0 + 30, 440, 240, 58, {stroke: C.axis, rx: 10, width: 1.5}),
        text(x0 + 150, 464, `${s.units} units · ${s.conns} connections`, {color: C.ink, size: 15, anchor: "middle"}),
        text(x0 + 150, 486, `depth ${s.depth}`, {color: C.label, size: 14, anchor: "middle"}));
    });
    return figure({id: "nn02-par3", w: 960, h: 560, title: "Six-bit parity three ways",
      desc: `Three threshold networks for six-bit parity side by side, each checked on all 64 inputs. Left, the DNF network: ${dnf.units.length - 1} hidden AND units, one per odd-weight input pattern (five are drawn, with an ellipsis), feeding an OR output; ${S[0].units} units, ${S[0].conns} connections, depth ${S[0].depth}. Middle, the counting network: six hidden units c1 to c6 with biases −1 to −6 reading all inputs with weight 1, and an output with alternating weights +1 and −1 and bias −1; ${S[1].units} units, ${S[1].conns} connections, depth ${S[1].depth}. Right, a tree of five three-unit XOR blocks pairing (x1,x2), (x3,x4), (x5,x6), then the first two results, then that result with the carried z3; ${S[2].units} units, ${S[2].conns} connections, depth ${S[2].depth}.`,
      caption: "Same function on all 64 inputs; the sizes differ because the constructions differ."}, parts);
  },

  /* §1: depth, skip connections, and strict layering for the two-unit XOR. */
  "nn02-depth-layers"() {
    const skip = {inputs: ["x₁", "x₂"], units: [{n: "h", w: {"x₁": 1, "x₂": 1}, b: -2}, {n: "y", w: {"x₁": 1, "x₂": 1, "h": -2}, b: -1}]};
    const layered = {inputs: ["x₁", "x₂"], units: [{n: "p₁", w: {"x₁": 1}, b: -0.5}, {n: "h", w: {"x₁": 1, "x₂": 1}, b: -2},
      {n: "p₂", w: {"x₂": 1}, b: -0.5}, {n: "y", w: {"p₁": 1, "p₂": 1, "h": -2}, b: -1}]};
    const xor = b => b[0] ^ b[1];
    assertComputes(skip, 2, xor, skip.inputs); assertComputes(layered, 2, xor, layered.inputs);
    const A = stats(skip), B = stats(layered);
    const parts = [heading("One XOR, drawn with and without skip connections")];
    const posL = {"x₁": [100, 130], "x₂": [100, 350], h: [240, 240], y: [385, 240]};
    const posR = {"x₁": [540, 130], "x₂": [540, 350], "p₁": [680, 130], h: [680, 240], "p₂": [680, 350], y: [820, 240]};
    const draw = (net, pos, st, curved) => {
      for (const u of net.units) for (const [k, w] of Object.entries(u.w)) {
        const a = pos[k], b = pos[u.n], col = w > 0 ? C.dim : C.purple;
        const isSkip = st.depths[u.n] - st.depths[k] > 1;
        if (isSkip && curved) {
          const c = [(a[0] + b[0]) / 2 + 30, a[1] < b[1] ? a[1] - 40 : a[1] + 40];
          const L = Math.hypot(b[0] - c[0], b[1] - c[1]), ux = (b[0] - c[0]) / L, uy = (b[1] - c[1]) / L;
          const e = [b[0] - ux * 19, b[1] - uy * 19], s0 = [a[0] + 16, a[1] + (a[1] < b[1] ? -4 : 4)];
          parts.push(path(`M${r2(s0[0])} ${r2(s0[1])}Q${r2(c[0])} ${r2(c[1])} ${r2(e[0] - ux * 9)} ${r2(e[1] - uy * 9)}`, {color: C.orange, width: 2, dash: "7 4"}),
            arrow(e[0] - ux * 10, e[1] - uy * 10, e[0], e[1], {color: C.orange}));
          const m = [(s0[0] + 2 * c[0] + e[0]) / 4, (s0[1] + 2 * c[1] + e[1]) / 4];
          parts.push(chip(m, m, fmtW(w), {t: 0, color: C.orange}));
        } else {
          parts.push(link(a, b, {ra: 17, rb: 19, color: col}), chip(a, b, fmtW(w), {t: .5, color: w > 0 ? C.label : C.purple}));
        }
      }
      for (const nm of net.inputs) parts.push(circle(...pos[nm], 17, {stroke: C.label}), text(pos[nm][0], pos[nm][1] + 5, nm, {color: C.ink, size: 15, anchor: "middle"}));
      for (const u of net.units) {
        const [x, y] = pos[u.n];
        parts.push(circle(x, y, 19, {stroke: u.n === "y" ? C.pink : C.teal}), text(x, y + 5, fmtB(u.b), {color: C.ink, size: 14, anchor: "middle"}),
          text(x, y - 27, u.n, {color: C.label, size: 15, anchor: "middle"}));
      }
    };
    draw(skip, posL, A, true); draw(layered, posR, B, false);
    for (const [nm, [x, y]] of Object.entries(posL)) parts.push(text(nm.startsWith("x") ? x - 26 : x, nm.startsWith("x") ? y + 5 : y + 42, `depth ${A.depths[nm]}`, {color: C.teal, size: 13, anchor: nm.startsWith("x") ? "end" : "middle"}));
    [540, 680, 820].forEach((x, d) => parts.push(text(x, 400, `depth ${d}`, {color: C.teal, size: 13, anchor: "middle"})));
    parts.push(path("M450 80V420", {color: C.axis, width: 1.5}),
      text(245, 448, `${A.units} units · ${A.conns} connections · depth ${A.depth}`, {color: C.ink, size: 15, anchor: "middle"}),
      text(245, 470, "dashed: skip connections (depth 0 → 2)", {color: C.orange, size: 13, anchor: "middle"}),
      text(680, 448, `${B.units} units · ${B.conns} connections · depth ${B.depth}`, {color: C.ink, size: 15, anchor: "middle"}),
      text(680, 470, "p₁, p₂ = θ(x − ½) copy the inputs forward", {color: C.muted, size: 13, anchor: "middle"}));
    return figure({id: "nn02-depth", w: 900, h: 530, title: "Depth and strict layering for a two-unit XOR",
      desc: `Left: inputs x1 and x2, hidden unit h = θ(x1 + x2 − 2) and output y = θ(x1 + x2 − 2h − 1). The output reads both inputs directly through skip connections and reads h with weight −2. Depths 0, 0, 1 and 2 are written beside x1, x2, h and y; ${A.units} units and ${A.conns} connections. Right: the same function strictly layered, with copying units p1 = θ(x1 − ½) and p2 = θ(x2 − ½) beside h, and y = θ(p1 + p2 − 2h − 1); every arrow joins neighbouring columns; ${B.units} units and ${B.conns} connections. Both networks are checked on all four inputs.`,
      caption: "Weights on edges, biases in nodes. Depth counts arrows on the longest path from an input to the output."}, parts);
  },

  /* §2: Karnaugh map grouping and the reduced AND–OR network. */
  "nn02-kmap"() {
    const ones = new Set([0, 1, 2, 3, 5, 7, 8, 10, 13, 15]), gray = [0, 1, 3, 2], V = ["A", "B", "C", "D"];
    const f = (b, r) => (ones.has(r) ? 1 : 0);
    const groups = [
      {name: "B̄D̄", pat: "-0-0", color: C.orange, inset: 4},
      {name: "BD", pat: "-1-1", color: C.teal, inset: 4},
      {name: "ĀD", pat: "0--1", color: C.purple, inset: 9}];
    const matches = (pat, r) => bitsOf(r, 4).every((b, i) => pat[i] === "-" || +pat[i] === b);
    // Each group as an AND unit: +1 on plain literals, −1 on negated ones, bias −(number of plain literals).
    const units = groups.map(g => ({n: g.name, w: Object.fromEntries([...g.pat].map((c, i) => [V[i], c === "-" ? 0 : c === "1" ? 1 : -1]).filter(([, w]) => w)),
      b: -[...g.pat].filter(c => c === "1").length}));
    const net = {inputs: V, units: [...units, {n: "f", w: Object.fromEntries(units.map(u => [u.n, 1])), b: -1}]};
    assertComputes(net, 4, f, V);
    for (const g of groups) { g.rows = [...Array(16).keys()].filter(r => matches(g.pat, r)); if (!g.rows.every(r => ones.has(r))) throw new Error("not an implicant"); }
    const covered = new Set(groups.flatMap(g => g.rows));
    if (covered.size !== ones.size) throw new Error("groups do not cover f");
    const parts = [heading("Group the true cells, then wire one AND per group")];
    const mx = 100, my = 110, cs = 68;
    const cellXY = r => { const ab = r >> 2, cd = r & 3; return [mx + gray.indexOf(cd) * cs, my + gray.indexOf(ab) * cs]; };
    parts.push(text(mx - 14, my - 14, "AB \\ CD", {color: C.label, size: 13, anchor: "end"}));
    gray.forEach((g, i) => parts.push(text(mx + i * cs + cs / 2, my - 12, g.toString(2).padStart(2, "0"), {color: C.label, size: 14, anchor: "middle"}),
      text(mx - 12, my + i * cs + cs / 2 + 5, g.toString(2).padStart(2, "0"), {color: C.label, size: 14, anchor: "end"})));
    for (let r = 0; r < 16; r++) {
      const [x, y] = cellXY(r), on = ones.has(r);
      parts.push(`<rect x="${x}" y="${y}" width="${cs}" height="${cs}" fill="${on ? "#14283c" : C.bg}" stroke="${C.axis}" stroke-width="1.5"/>`,
        text(x + cs / 2, y + cs / 2 + 16, on ? "1" : "0", {color: on ? C.ink : C.dim, size: 19, anchor: "middle", weight: on ? 600 : undefined}),
        text(x + cs / 2, y + 30, String(r), {color: C.muted, size: 13, anchor: "middle"}));
    }
    // Group outlines: cyclic intervals of rows and columns; wrapping pieces run off the map edge and are clipped.
    const intervals = pos => {
      const s = [...new Set(pos)].sort((a, b) => a - b);
      if (s.at(-1) - s[0] === s.length - 1) return [[s[0], s.at(-1), false, false]];
      const lo = s.filter(p => s.includes(p - 1) || p === 0 && !s.includes(1) || p === 0), hi = s.filter(p => !lo.includes(p));
      return [[Math.min(...lo), Math.max(...lo), true, false], [Math.min(...hi), Math.max(...hi), false, true]];
    };
    parts.push(`<defs><clipPath id="nn02-kmap-clip"><rect x="${mx - 1}" y="${my - 1}" width="${4 * cs + 2}" height="${4 * cs + 2}"/></clipPath></defs><g clip-path="url(#nn02-kmap-clip)">`);
    for (const g of groups) {
      const cells = g.rows.map(cellXY).map(([x, y]) => [(x - mx) / cs, (y - my) / cs]);
      for (const [r0, r1, rlo, rhi] of intervals(cells.map(c => c[1])))
        for (const [c0, c1, clo, chi] of intervals(cells.map(c => c[0]))) {
          const x0 = mx + (clo ? -1 : c0) * cs + g.inset, x1 = mx + (chi ? 5 : c1 + 1) * cs - g.inset;
          const y0 = my + (rlo ? -1 : r0) * cs + g.inset, y1 = my + (rhi ? 5 : r1 + 1) * cs - g.inset;
          parts.push(box(x0, y0, x1 - x0, y1 - y0, {stroke: g.color, fill: g.color, opacity: .1, rx: 16, width: 3}));
        }
    }
    parts.push("</g>");
    groups.forEach((g, i) => parts.push(box(mx - 40, 412 + i * 26 - 13, 18, 16, {stroke: g.color, fill: g.color, opacity: .25, rx: 4, width: 2}),
      text(mx - 14, 412 + i * 26, `${g.name}  (${g.pat.replace(/-/g, "–")})  rows ${g.rows.join(", ")}`, {color: g.color, size: 14})));
    // the reduced network
    const pos = {A: [540, 130], B: [540, 205], C: [540, 280], D: [540, 355], [units[2].n]: [710, 150], [units[0].n]: [710, 245], [units[1].n]: [710, 340], f: [845, 245]};
    const chips = [];
    for (const u of net.units) for (const [k, w] of Object.entries(u.w)) {
      const g = groups.find(q => q.name === u.n), col = u.n === "f" ? C.dim : g.color;
      parts.push(link(pos[k], pos[u.n], {ra: 17, rb: 19, color: col, width: 2}));
      if (u.n !== "f") chips.push(chip(pos[k], pos[u.n], fmtW(w), {t: .75, color: col}));
    }
    parts.push(...chips);
    for (const nm of V) parts.push(circle(...pos[nm], 17, {stroke: nm === "C" ? C.dim : C.label, dash: nm === "C" ? "4 4" : undefined}),
      text(pos[nm][0], pos[nm][1] + 5, nm, {color: nm === "C" ? C.dim : C.ink, size: 15, anchor: "middle"}));
    parts.push(text(512, 285, "unread", {color: C.dim, size: 13, anchor: "end"}));
    for (const u of net.units) {
      const [x, y] = pos[u.n], g = groups.find(q => q.name === u.n);
      parts.push(circle(x, y, 19, {stroke: g ? g.color : C.pink}), text(x, y + 5, fmtB(u.b), {color: C.ink, size: 14, anchor: "middle"}),
        text(x, y > 300 ? y + 40 : y - 27, g ? `AND ${u.n}` : "OR", {color: g ? g.color : C.pink, size: 14, anchor: "middle"}));
    }
    const st = stats(net);
    parts.push(text(690, 420, `${st.units} units instead of ${ones.size + 1}`, {color: C.ink, size: 15, anchor: "middle", weight: 600}),
      text(690, 442, "edges into f have weight 1 · nodes: biases", {color: C.muted, size: 13, anchor: "middle"}));
    return figure({id: "nn02-kmap", w: 900, h: 520, title: "Karnaugh map grouping and the reduced network",
      desc: `A four-by-four Karnaugh map with rows AB and columns CD in Gray-code order 00, 01, 11, 10; each cell shows its row number ABCD and the value of f, which is 1 on rows ${[...ones].join(", ")}. Three groups are outlined: B̄D̄ (pattern -0-0, rows ${groups[0].rows.join(", ")}) wraps around the four corners; BD (pattern -1-1, rows ${groups[1].rows.join(", ")}) is the middle two-by-two block; ĀD (pattern 0--1, rows ${groups[2].rows.join(", ")}) is the two-by-two block in the top two rows and middle two columns. Beside it, the reduced network: AND unit B̄D̄ with weights −1 on B and D and bias 0, AND unit BD with weights +1 on B and D and bias −2, AND unit ĀD with weight −1 on A, +1 on D and bias −1, and an OR output with bias −1. Input C is not read. ${st.units} units in total, checked on all 16 rows.`,
      caption: "f = B̄D̄ + BD + ĀD: three AND terms and an OR replace one AND per true row."}, parts);
  },

  /* §3: unit and connection counts against n. */
  "nn02-parity-growth"() {
    const ns = [...Array(15).keys()].map(i => i + 2);
    const cons = [
      {name: "DNF", color: C.pink, make: dnfParity},
      {name: "counting", color: C.teal, make: countingParity},
      {name: "XOR tree", color: C.orange, make: n => treeParity(n)}];
    // Count by building every network (n ≤ 12) and check against the closed forms used beyond that.
    const closed = {DNF: n => [2 ** (n - 1) + 1, (n + 1) * 2 ** (n - 1)], counting: n => [n + 1, n * n + n], "XOR tree": n => [3 * (n - 1), 6 * (n - 1)]};
    for (const c of cons) for (const n of ns.filter(n => n <= 12)) {
      const s = stats(c.make(n)), [u, k] = closed[c.name](n);
      if (s.units !== u || s.conns !== k) throw new Error(`${c.name} n=${n}: ${s.units}/${s.conns} vs ${u}/${k}`);
    }
    const F = frame({x: 120, y: 80, w: 700, h: 300, xmin: 2, xmax: 16, ymin: 1, ymax: 1e6, ylog: true});
    const parts = [heading("Parity network size against the number of inputs")];
    for (let k = 0; k <= 6; k++) parts.push(path(`M${F.x} ${r2(F.Y(10 ** k))}H${F.x + F.w}`, {color: C.grid, width: 1.2}),
      text(F.x - 10, F.Y(10 ** k) + 5, logLabel(k), {color: C.label, size: 13, anchor: "end"}));
    for (const n of [2, 4, 6, 8, 10, 12, 14, 16]) parts.push(path(`M${r2(F.X(n))} ${F.y + F.h}v6`, {color: C.axis}), text(F.X(n), F.y + F.h + 22, String(n), {color: C.label, size: 13, anchor: "middle"}));
    parts.push(path(`M${F.x} ${F.y}V${F.y + F.h}H${F.x + F.w}`, {color: C.axis, width: 2}));
    for (const c of cons) for (const [j, dash] of [[0, undefined], [1, "7 5"]]) {
      parts.push(polyline(ns.map(n => [F.X(n), F.Y(closed[c.name](n)[j])]), {color: c.color, width: 2.6, dash}));
      for (const n of ns) parts.push(circle(F.X(n), F.Y(closed[c.name](n)[j]), 2.6, {stroke: c.color, fill: c.color, width: 1}));
    }
    const d16 = closed.DNF(16);
    parts.push(text(F.X(16) - 6, F.Y(d16[1]) - 10, `${d16[1].toLocaleString("en-US")} connections`, {color: C.pink, size: 13, anchor: "end"}),
      text(F.X(16) - 10, F.Y(d16[0]) - 12, `${d16[0].toLocaleString("en-US")} units`, {color: C.pink, size: 13, anchor: "end"}));
    // legend
    const lx = F.x + 20, ly = F.y + 18;
    parts.push(box(lx - 10, ly - 16, 238, 112, {stroke: C.axis, rx: 8, width: 1.2}));
    cons.forEach((c, i) => parts.push(path(`M${lx} ${ly + i * 22}h26`, {color: c.color, width: 3}), text(lx + 36, ly + i * 22 + 5, c.name, {color: c.color, size: 14})));
    parts.push(path(`M${lx} ${ly + 70}h26`, {color: C.label, width: 2.6}), text(lx + 36, ly + 75, "units", {color: C.label, size: 13}),
      path(`M${lx + 100} ${ly + 70}h26`, {color: C.label, width: 2.6, dash: "7 5"}), text(lx + 136, ly + 75, "connections", {color: C.label, size: 13}));
    parts.push(text(F.x + F.w / 2, F.y + F.h + 46, "number of inputs n", {color: C.label, size: 14, anchor: "middle"}));
    return figure({id: "nn02-pgrowth", w: 900, h: 480, title: "Parity network sizes on a logarithmic axis",
      desc: `Units (solid) and connections (dashed) against n from 2 to 16, on a logarithmic vertical axis from 1 to one million. DNF: 2^(n−1)+1 units and (n+1)·2^(n−1) connections, straight lines reaching ${d16[0]} units and ${d16[1]} connections at n = 16. Counting: n+1 units and n²+n connections. XOR tree: 3(n−1) units and 6(n−1) connections. The counting and tree curves stay below a few hundred.`,
      caption: "A straight line on a logarithmic axis is exponential growth: the DNF size doubles with each extra input."}, parts);
  },

  /* §4: Shannon's count for n = 10. */
  "nn02-shannon-count"() {
    const n = 10, bound = s => Math.log2(n + s) + s * (4 + 2 * Math.log2(n + s)), target = 2 ** n;
    let sFirst = 1; while (bound(sFirst) <= target) sFirst++;
    let lo = sFirst - 1, hi = sFirst; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (bound(m) > target) hi = m; else lo = m; }
    const sCross = (lo + hi) / 2, a = 2 ** n / (4 * n), b = 2 ** n / n;
    const F = frame({x: 120, y: 80, w: 700, h: 300, xmin: 0, xmax: 120, ymin: 0, ymax: 2400});
    const parts = [heading("Too few small circuits for ten inputs")];
    for (let v = 0; v <= 2400; v += 400) parts.push(path(`M${F.x} ${r2(F.Y(v))}H${F.x + F.w}`, {color: C.grid, width: 1.2}),
      text(F.x - 10, F.Y(v) + 5, String(v), {color: C.label, size: 13, anchor: "end"}));
    for (let s = 0; s <= 120; s += 20) parts.push(path(`M${r2(F.X(s))} ${F.y + F.h}v6`, {color: C.axis}), text(F.X(s), F.y + F.h + 22, String(s), {color: C.label, size: 13, anchor: "middle"}));
    parts.push(path(`M${F.x} ${F.y}V${F.y + F.h}H${F.x + F.w}`, {color: C.axis, width: 2}));
    for (const [v, nm] of [[a, "2ⁿ/(4n) = " + a], [b, "2ⁿ/n = " + b]])
      parts.push(path(`M${r2(F.X(v))} ${F.y}V${F.y + F.h}`, {color: C.purple, width: 1.8, dash: "5 5"}), text(F.X(v) + 6, F.y + 16, nm, {color: C.purple, size: 13}));
    parts.push(path(`M${F.x} ${r2(F.Y(target))}H${F.x + F.w}`, {color: C.orange, width: 2.4}),
      text(F.x + 10, F.Y(target) + 22, "log₂(number of functions) = 2¹⁰ = 1024", {color: C.orange, size: 14}));
    const pts = []; for (let s = 1; s <= 120; s++) pts.push([F.X(s), F.Y(bound(s))]);
    parts.push(polyline(pts, {color: C.teal, width: 3}),
      text(F.X(80), F.Y(bound(84)) - 14, "log₂(circuits with s gates) ≤", {color: C.teal, size: 14, anchor: "end"}),
      text(F.X(80), F.Y(bound(84)) + 4, "log₂(n+s) + s(4 + 2log₂(n+s))", {color: C.teal, size: 14, anchor: "end"}));
    parts.push(circle(F.X(sCross), F.Y(target), 6, {stroke: C.ink, fill: C.ink}),
      text(F.X(sCross) + 12, F.Y(target) + 24, `crossing at s ≈ ${sCross.toFixed(1)}; first whole s above: ${sFirst}`, {color: C.ink, size: 14}),
      text(F.x + F.w / 2, F.y + F.h + 46, "number of gates s", {color: C.label, size: 14, anchor: "middle"}),
      text(F.x - 10, F.y - 16, "bits", {color: C.label, size: 13, anchor: "end"}));
    return figure({id: "nn02-shannon", w: 900, h: 480, title: "Shannon's counting bound for ten inputs",
      desc: `The upper bound log2(n+s) + s(4 + 2 log2(n+s)) on the base-2 logarithm of the number of fan-in-two circuits with s gates, for n = 10 and s from 1 to 120, rising from about ${bound(1).toFixed(0)} to about ${bound(120).toFixed(0)}. A horizontal line at 1024 marks log2 of the number of Boolean functions of ten inputs. The curve crosses it at s ≈ ${sCross.toFixed(1)}; s = ${sFirst} is the first whole number of gates whose bound exceeds 1024. Dashed vertical lines mark 2^n/(4n) = ${a} and 2^n/n = ${b}.`,
      caption: `Left of the crossing there are fewer than 2¹⁰²⁴ circuits, too few to compute every function of ten inputs.`}, parts);
  },
  /* §5: cells of an arrangement of lines, added one at a time. */
  "nn02-arrangement-cells"() {
    // Four lines a·x = c in general position (chosen so every cell is visible in the window [−1, 1]²).
    const L = [[-0.776, 0.631, -0.024], [-0.076, 0.997, 0.418], [0.95, 0.312, -0.405], [0.501, 0.866, 0.271]];
    const W = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const parts = [heading("Each new line crosses every earlier one", 960)];
    const counts = [];
    const sizes = [[25, 140], [180, 140], [335, 140], [490, 140], [650, 285]];
    sizes.forEach(([x, w], k) => {
      const lines = L.slice(0, k), cells = cellsOf(lines, W);
      counts.push(cells.length);
      const want = 1 + k + k * (k - 1) / 2;
      if (cells.length !== want) throw new Error(`arrangement ${k}: ${cells.length} cells, expected ${want}`);
      const top = k === 4 ? 82 : 155, p = panel({x, y: top, w, h: w, xmin: -1, xmax: 1, ymin: -1, ymax: 1});
      p.raw(`<rect x="${r2(p.box.x)}" y="${r2(p.box.y)}" width="${r2(p.box.w)}" height="${r2(p.box.h)}" fill="#0d1a2b" stroke="${C.axis}" stroke-width="1.5"/>`);
      lines.forEach(([a, b, c], i) => {
        const n2 = a * a + b * b;
        p.fullLine([a * c / n2, b * c / n2], [-b, a], {color: i === k - 1 ? C.orange : C.teal, width: i === k - 1 ? 3 : 2});
      });
      // crossings of the newest line with the earlier ones
      if (k > 1) for (const [a, b, c] of lines.slice(0, -1)) {
        const [A, B, Cc] = lines.at(-1), det = a * B - b * A;
        p.point([(c * B - b * Cc) / det, (a * Cc - c * A) / det], {color: C.orange, r: 4});
      }
      // number the cells in reading order of their label points
      const labelled = cells.map(poly => ({poly, at: poleOf(poly)})).sort((u, v) => (v.at[1] - u.at[1]) || (u.at[0] - v.at[0]));
      labelled.forEach(({at}, i) => p.label(at, String(i + 1), {color: C.ink, size: k === 4 ? 15 : 13, anchor: "middle", dy: 5}));
      parts.push(p.svg(), text(x + w / 2, top + w + 28, `${k} line${k === 1 ? "" : "s"}: ${cells.length} cell${cells.length === 1 ? "" : "s"}`,
        {color: C.ink, size: 15, anchor: "middle", weight: 600}));
    });
    parts.push(text(327, 380, `cells for N = 0, 1, 2, 3, 4: ${counts.join(", ")} = 1 + N + N(N−1)/2`, {color: C.label, size: 15, anchor: "middle"}));
    return figure({id: "nn02-arr", w: 960, h: 470, title: "Cells of an arrangement of lines",
      desc: `Five panels showing the same window as four lines in general position are added one at a time. The newest line is drawn in orange with dots where it crosses the earlier lines. The cells, found by intersecting the window with every combination of half-planes, are numbered in each panel: ${counts.join(", ")} cells for 0 to 4 lines. The last panel is drawn larger.`,
      caption: "A new line meets the k−1 earlier lines in k−1 points, passes through k cells, and splits each one in two."}, parts);
  },

  /* §5: the 8+8 checkerboard and its 19-unit network. */
  "nn02-checkerboard"() {
    const a = [...Array(8).keys()].map(i => i + 0.5), alt = i => (i % 2 ? -1 : 1);
    const units = [
      ...a.map((ai, i) => ({n: "v" + sub(i + 1), w: {"x₁": 1}, b: -ai})),
      ...a.map((aj, j) => ({n: "u" + sub(j + 1), w: {"x₂": 1}, b: -aj}))];
    const sums = Object.fromEntries([...a.map((_, i) => ["v" + sub(i + 1), alt(i)]), ...a.map((_, j) => ["u" + sub(j + 1), alt(j)])]);
    units.push({n: "A", w: {...sums}, b: -1}, {n: "B", w: {...sums}, b: -2}, {n: "out", w: {A: 1, B: -1}, b: -1});
    const net = {inputs: ["x₁", "x₂"], units}, st = stats(net);
    const fires = (x1, x2) => run(net, {"x₁": x1, "x₂": x2}).out;
    // count target cells by evaluating the network at each cell's centre
    const edges = [0, ...a, 8], mids = edges.slice(0, -1).map((e, i) => (e + edges[i + 1]) / 2);
    let target = 0;
    mids.forEach((x, k) => mids.forEach((y, m) => { const f = fires(x, y); target += f; if (f !== (k + m) % 2) throw new Error("checkerboard mismatch"); }));
    const parts = [heading("An exact 8+8 checkerboard with 19 threshold units")];
    const p = panel({x: 40, y: 80, w: 350, h: 350, xmin: 0, xmax: 8, ymin: 0, ymax: 8});
    shadeSet(p, fires, {xmin: 0, xmax: 8, ymin: 0, ymax: 8, N: 160, opacity: .42});
    for (const v of a) { p.line([v, 0], [v, 8], {color: C.teal, width: 1.4}); p.line([0, v], [8, v], {color: C.teal, width: 1.4}); }
    p.raw(`<rect x="${r2(p.box.x)}" y="${r2(p.box.y)}" width="${r2(p.box.w)}" height="${r2(p.box.h)}" fill="none" stroke="${C.axis}" stroke-width="2"/>`);
    for (const v of [0, 4, 8]) { p.label([v, 0], String(v), {color: C.label, size: 13, anchor: "middle", dy: 20}); p.label([0, v], String(v), {color: C.label, size: 13, anchor: "end", dx: -8, dy: 5}); }
    p.label([8, 0], "x₁", {color: C.label, size: 14, dx: 14, dy: 20}); p.label([0, 8], "x₂", {color: C.label, size: 14, anchor: "middle", dy: -10});
    parts.push(p.svg(), text(215, 486, `${mids.length}×${mids.length} = ${mids.length ** 2} cells, ${target} shaded (k + m odd)`, {color: C.ink, size: 15, anchor: "middle"}));
    // network schematic
    const gx = 600, ax = 740, ox = 845, vy = i => 92 + i * 19, uy = j => 270 + j * 19;
    const pos = {"x₁": [470, vy(3.5)], "x₂": [470, uy(3.5)], A: [ax, 200], B: [ax, 330], out: [ox, 265]};
    a.forEach((_, i) => { pos["v" + sub(i + 1)] = [gx, vy(i)]; pos["u" + sub(i + 1)] = [gx, uy(i)]; });
    for (const u of units.slice(0, 16)) parts.push(link(pos[Object.keys(u.w)[0]], pos[u.n], {ra: 17, rb: 8, color: C.dim, width: 1.2, head: 6}));
    for (const nm of ["A", "B"]) for (const [k, w] of Object.entries(units.find(u => u.n === nm).w))
      parts.push(path(`M${pos[k][0] + 8} ${pos[k][1]}L${pos[nm][0] - 19} ${pos[nm][1]}`, {color: w > 0 ? C.teal : C.purple, width: 1.1}));
    parts.push(link(pos.A, pos.out, {ra: 19, rb: 19, color: C.dim}), link(pos.B, pos.out, {ra: 19, rb: 19, color: C.purple}),
      chip(pos.A, pos.out, "+1", {t: .5}), chip(pos.B, pos.out, "−1", {t: .5, color: C.purple}));
    for (const u of units.slice(0, 16)) parts.push(circle(...pos[u.n], 8, {stroke: u.n.startsWith("v") ? C.teal : C.blue, width: 1.8}));
    parts.push(text(gx, vy(0) - 16, "v₁ … v₈", {color: C.teal, size: 13, anchor: "middle"}), text(gx, uy(7) + 28, "u₁ … u₈", {color: C.blue, size: 13, anchor: "middle"}));
    for (const nm of ["x₁", "x₂"]) parts.push(circle(...pos[nm], 17, {stroke: C.label}), text(pos[nm][0], pos[nm][1] + 5, nm, {color: C.ink, size: 14, anchor: "middle"}));
    for (const u of units.slice(16)) {
      const [x, y] = pos[u.n];
      parts.push(circle(x, y, 19, {stroke: u.n === "out" ? C.pink : C.orange}), text(x, y + 5, fmtB(u.b), {color: C.ink, size: 14, anchor: "middle"}),
        text(x, y - 27, u.n === "out" ? "output" : u.n, {color: C.label, size: 14, anchor: "middle"}));
    }
    parts.push(text(660, 462, "vᵢ = θ(x₁ − aᵢ) and uᵢ = θ(x₂ − aᵢ), with aᵢ = i − ½", {color: C.label, size: 13, anchor: "middle"}),
      text(660, 486, `${st.units} units · ${st.conns} connections · depth ${st.depth}`, {color: C.ink, size: 15, anchor: "middle"}),
      text(ax + 52, 404, "edges into A, B:", {color: C.label, size: 13, anchor: "middle"}),
      text(ax + 52, 422, "+1 teal, −1 purple", {color: C.label, size: 13, anchor: "middle"}),
      text(ax, 168 - 22, "p₁ + p₂ ≥ 1", {color: C.muted, size: 13, anchor: "middle"}), text(ax, 362 + 22, "p₁ + p₂ ≥ 2", {color: C.muted, size: 13, anchor: "middle"}));
    return figure({id: "nn02-cb", w: 900, h: 540, title: "The 8+8 checkerboard and a 19-unit network",
      desc: `Left: the window from 0 to 8 in both coordinates, cut by eight vertical and eight horizontal lines at 0.5, 1.5, …, 7.5 into ${mids.length ** 2} cells; the ${target} cells where k + m is odd are shaded, by evaluating the network below on a grid. Right: the network. Sixteen line units v1 to v8 = θ(x1 − a_i) and u1 to u8 = θ(x2 − a_j) feed two units A and B with alternating weights +1, −1, +1, …, so both read p1 + p2, the sum of the two alternating sums; A has bias −1 and B bias −2. The output has weight +1 from A, −1 from B and bias −1. ${st.units} units and ${st.conns} connections, strictly layered.`,
      caption: "p₁ and p₂ are k mod 2 and m mod 2; A − B = 1 exactly when one of them is 1."}, parts);
  },

  /* §5: the crossing obstruction. */
  "nn02-crossing"() {
    const w1 = [0.3, 1], w2 = [1, -0.45];
    let w3 = [1, 0.85];
    const dotw = (w, v) => w[0] * v[0] + w[1] * v[1];
    const inRegion = v => dotw(w1, v) * dotw(w2, v) > 0;
    const parts = [heading("At a crossing, opposite points cancel every line through p")];
    const p = panel({x: 40, y: 75, w: 400, h: 380, xmin: -1.45, xmax: 1.45, ymin: -1.38, ymax: 1.38});
    // rays of the two target lines, sorted by angle; shade the sectors inside the region
    const ang = w => Math.atan2(w[0], -w[1]);
    const rays = [ang(w1), ang(w1) + Math.PI, ang(w2), ang(w2) + Math.PI].map(t => (t + 2 * Math.PI) % (2 * Math.PI)).sort((a, b) => a - b);
    const R = 1, sectors = [];
    rays.forEach((t0, i) => {
      const t1 = i + 1 < rays.length ? rays[i + 1] : rays[0] + 2 * Math.PI, tm = (t0 + t1) / 2;
      sectors.push({t0, t1, tm, inside: inRegion([Math.cos(tm), Math.sin(tm)])});
    });
    for (const s of sectors.filter(s => s.inside)) {
      const [cx, cy] = p.P([0, 0]), r = R * p.scale;
      const a = [cx + r * Math.cos(s.t0), cy - r * Math.sin(s.t0)], b = [cx + r * Math.cos(s.t1), cy - r * Math.sin(s.t1)];
      p.raw(`<path d="M${r2(cx)} ${r2(cy)}L${r2(a[0])} ${r2(a[1])}A${r2(r)} ${r2(r)} 0 0 0 ${r2(b[0])} ${r2(b[1])}Z" fill="${C.pink}" fill-opacity="0.35"/>`);
    }
    p.ellipse([[1, 0], [0, 1]], {r: R, color: C.label, width: 2});
    p.fullLine([0, 0], [-w1[1], w1[0]], {color: C.teal, width: 2.5}).fullLine([0, 0], [-w2[1], w2[0]], {color: C.teal, width: 2.5})
      .fullLine([0, 0], [-w3[1], w3[0]], {color: C.blue, width: 2, dash: "7 5"});
    const sIn = sectors.find(s => s.inside), sOut = sectors.find(s => !s.inside);
    let u = [Math.cos(sIn.tm), Math.sin(sIn.tm)];
    if (dotw(w1, u) < 0) u = [-u[0], -u[1]];          // name the pair so that ℓ₁ fires at p + εu
    if (dotw(w3, u) > 0) w3 = [-w3[0], -w3[1]];       // orient the hidden unit so it fires at p − εu instead
    const uo = [Math.cos(sOut.tm), Math.sin(sOut.tm)], eps = 0.7;
    const pts = [[eps * u[0], eps * u[1]], [-eps * u[0], -eps * u[1]]];
    p.point(pts[0], {color: C.pink, r: 7}).point(pts[1], {color: C.pink, r: 7});
    pts.forEach((q, i) => p.label(q, i ? "p − εu" : "p + εu", {color: C.ink, size: 15, dx: q[0] > 0 ? 12 : -12, dy: q[1] > 0 ? -8 : 20, anchor: q[0] > 0 ? "start" : "end"}));
    for (const sg of [1, -1]) p.raw(`<circle cx="${r2(p.P([sg * eps * uo[0], sg * eps * uo[1]])[0])}" cy="${r2(p.P([sg * eps * uo[0], sg * eps * uo[1]])[1])}" r="6" fill="${C.bg}" stroke="${C.label}" stroke-width="2.4"/>`);
    p.point([0, 0], {color: C.ink, r: 5}).label([0, 0], "p", {color: C.ink, size: 16, dx: 9, dy: 18});
    // label the three lines near the window edge
    const edgeLabel = (w, s, col) => { const d = [-w[1], w[0]], t = 1.32 / Math.max(Math.abs(d[0]), Math.abs(d[1]) * 1.05); p.label([d[0] * t, d[1] * t], s, {color: col, size: 15, dx: 6, dy: d[1] > 0 ? 16 : -6}); };
    edgeLabel(w1, "ℓ₁", C.teal); edgeLabel(w2, "ℓ₂", C.teal); edgeLabel(w3, "ℓ₃ (hidden)", C.blue);
    parts.push(p.svg());
    // table: θ(w·(±εu)) for each line through p
    const tx = 480, ty = 120, rows = [["ℓ₁", w1, C.teal], ["ℓ₂", w2, C.teal], ["ℓ₃", w3, C.blue]];
    parts.push(text(tx, ty, "unit through p", {color: C.label, size: 14}), text(tx + 150, ty, "at p+εu", {color: C.label, size: 14, anchor: "middle"}),
      text(tx + 240, ty, "at p−εu", {color: C.label, size: 14, anchor: "middle"}), text(tx + 320, ty, "sum", {color: C.label, size: 14, anchor: "middle"}),
      path(`M${tx} ${ty + 10}H${tx + 350}`, {color: C.axis, width: 1.5}));
    rows.forEach(([nm, w, col], i) => {
      const hp = H(dotw(w, pts[0])), hm = H(dotw(w, pts[1])), y = ty + 38 + i * 30;
      if (hp + hm !== 1) throw new Error("antipodal points on the same side");
      parts.push(text(tx, y, `θ(w·(x−p)) on ${nm}`, {color: col, size: 14}), text(tx + 150, y, String(hp), {color: C.ink, size: 15, anchor: "middle"}),
        text(tx + 240, y, String(hm), {color: C.ink, size: 15, anchor: "middle"}), text(tx + 320, y, String(hp + hm), {color: C.ink, size: 15, anchor: "middle", weight: 600}));
    });
    const lines = ["Each line through p puts exactly one of the pair", "on its firing side, so the two output scores", "add up to the same constant C for every u.",
      "", "● filled pair: both in the region ⇒ C ≥ 0", "○ hollow pair: both outside ⇒ C < 0", "", "No single hidden layer can satisfy both."];
    lines.forEach((s, i) => s && parts.push(text(tx, 250 + i * 22, s, {color: i === 4 ? C.pink : i === 7 ? C.ink : C.label, size: 14, weight: i === 7 ? 600 : undefined})));
    return figure({id: "nn02-cross", w: 900, h: 500, title: "The crossing obstruction",
      desc: "Left: two solid lines cross at a point p inside a small circle; the two opposite sectors where both units agree are shaded, as at a checkerboard crossing. A dashed third hidden line also passes through p. Two filled antipodal points p + εu and p − εu lie in the two shaded sectors, and a hollow antipodal pair lies in the unshaded sectors. Right: a table of θ(w·(x − p)) for the three lines through p at p + εu and p − εu; for every line one value is 1 and the other 0, so each sum is 1.",
      caption: "z(p+εu) + z(p−εu) does not depend on u, yet the filled pair needs it ≥ 0 and the hollow pair < 0."}, parts);
  },

  /* §6: disagreement area of regular polygons with the unit disc. */
  "nn02-disc-error"() {
    const circ = N => N * Math.tan(Math.PI / N) - Math.PI, insc = N => Math.PI - (N / 2) * Math.sin(2 * Math.PI / N), asym = N => Math.PI ** 3 / (3 * N * N);
    const F = frame({x: 130, y: 80, w: 680, h: 300, xmin: 3, xmax: 128, ymin: 3e-4, ymax: 4, xlog: true, ylog: true});
    const parts = [heading("Polygon error falls like 1/N²")];
    for (let k = -3; k <= 0; k++) parts.push(path(`M${F.x} ${r2(F.Y(10 ** k))}H${F.x + F.w}`, {color: C.grid, width: 1.2}),
      text(F.x - 10, F.Y(10 ** k) + 5, k === 0 ? "1" : "10" + sup(k), {color: C.label, size: 13, anchor: "end"}));
    for (const N of [3, 4, 8, 16, 32, 64, 128]) parts.push(path(`M${r2(F.X(N))} ${F.y}V${F.y + F.h}`, {color: C.grid, width: 1}),
      text(F.X(N), F.y + F.h + 22, String(N), {color: C.label, size: 13, anchor: "middle"}));
    parts.push(path(`M${F.x} ${F.y}V${F.y + F.h}H${F.x + F.w}`, {color: C.axis, width: 2}));
    const Ns = []; for (let N = 3; N <= 128; N++) Ns.push(N);
    parts.push(polyline(Ns.map(N => [F.X(N), F.Y(asym(N))]), {color: C.ink, width: 1.8, dash: "6 5"}),
      polyline(Ns.map(N => [F.X(N), F.Y(insc(N))]), {color: C.orange, width: 3}),
      polyline(Ns.map(N => [F.X(N), F.Y(circ(N))]), {color: C.teal, width: 3}));
    const mark = (N, v, col, s, dx, dy, anchor = "start") => parts.push(circle(F.X(N), F.Y(v), 5.5, {stroke: col, fill: col, width: 1}),
      text(F.X(N) + dx, F.Y(v) + dy, s, {color: col, size: 14, anchor}));
    mark(8, insc(8), C.orange, `N = 8: ${insc(8).toFixed(4)}`, 10, -10);
    mark(8, circ(8), C.teal, `N = 8: ${circ(8).toFixed(4)}`, -10, 22, "end");
    mark(33, circ(33), C.teal, `N = 33: ${circ(33).toFixed(4)} ≤ 0.01`, -10, 24, "end");
    parts.push(text(F.X(40), F.Y(insc(40)) - 14, "inscribed: π − (N/2)sin(2π/N)", {color: C.orange, size: 14}),
      text(F.X(3.3), F.Y(2.4e-3), "circumscribed: N tan(π/N) − π", {color: C.teal, size: 14}),
      text(F.X(3.3), F.Y(2.4e-3) + 20, "dashed: asymptote π³/(3N²)", {color: C.ink, size: 14}),
      text(F.x + F.w / 2, F.y + F.h + 46, "number of sides N (N + 1 threshold units)", {color: C.label, size: 14, anchor: "middle"}),
      text(F.x - 10, F.y - 16, "area", {color: C.label, size: 13, anchor: "end"}));
    return figure({id: "nn02-disc", w: 900, h: 480, title: "Disagreement area of polygons with the unit disc",
      desc: `Log–log plot of disagreement area against the number of sides N from 3 to 128. The circumscribed polygon's error N tan(π/N) − π (teal) and the inscribed polygon's error π − (N/2) sin(2π/N) (orange) both fall with slope −2, the inscribed line about twice as high. A dashed asymptote π³/(3N²) lies on the circumscribed line. Marked values: N = 8 gives ${circ(8).toFixed(4)} circumscribed and ${insc(8).toFixed(4)} inscribed; N = 33 gives ${circ(33).toFixed(4)} circumscribed.`,
      caption: "Slope −2 on log–log axes: doubling N divides the error by about four."}, parts);
  },

  /* §6: one missing first-layer line merges cells and sets an error floor. */
  "nn02-bottleneck"() {
    const all = [1, 2, 3], present = {x1: [1, 3], x2: [1, 2, 3]};
    const target = (x1, x2) => (all.filter(t => x1 >= t).length + all.filter(t => x2 >= t).length) % 2;
    const code = (x1, x2) => [...present.x1.map(t => H(x1 - t)), ...present.x2.map(t => H(x2 - t))].join("");
    // integrate over a fine grid: area of target-1 and target-0 parts of each code region
    const N = 400, d = 4 / N, acc = {};
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const x = (i + .5) * d, y = (j + .5) * d, c = code(x, y), t = target(x, y);
      const e = acc[c] ??= {a1: 0, a0: 0, x0: 9, x1: -9, y0: 9, y1: -9};
      e[t ? "a1" : "a0"] += d * d; e.x0 = Math.min(e.x0, x - d / 2); e.x1 = Math.max(e.x1, x + d / 2); e.y0 = Math.min(e.y0, y - d / 2); e.y1 = Math.max(e.y1, y + d / 2);
    }
    const codes = Object.values(acc), floor = codes.reduce((s, e) => s + Math.min(e.a1, e.a0), 0);
    const merged = codes.filter(e => Math.min(e.a1, e.a0) > 1e-9);
    const parts = [heading("A missing first-layer line sets an error floor")];
    const p = panel({x: 50, y: 80, w: 360, h: 360, xmin: 0, xmax: 4, ymin: 0, ymax: 4});
    shadeSet(p, target, {xmin: 0, xmax: 4, ymin: 0, ymax: 4, N: 4, opacity: .4});
    for (const t of present.x1) p.line([t, 0], [t, 4], {color: C.teal, width: 2.5});
    for (const t of present.x2) p.line([0, t], [4, t], {color: C.teal, width: 2.5});
    p.line([2, 0], [2, 4], {color: C.label, width: 2, dash: "4 6"});
    for (const e of merged) {
      const g = .06;
      p.polygon([[e.x0 + g, e.y0 + g], [e.x1 - g, e.y0 + g], [e.x1 - g, e.y1 - g], [e.x0 + g, e.y1 - g]], {fill: C.orange, opacity: .16, stroke: C.orange, width: 3});
      const [cx, cy] = p.P([(e.x0 + e.x1) / 2, (e.y0 + e.y1) / 2]);
      p.raw(box(cx - 32, cy - 12, 64, 22, {stroke: C.orange, fill: C.bg, rx: 6, width: 1.2}));
      p.raw(text(cx, cy + 4, `error ${fmtNum(Math.min(e.a1, e.a0))}`, {color: C.orange, size: 13, anchor: "middle"}));
    }
    p.raw(`<rect x="${r2(p.box.x)}" y="${r2(p.box.y)}" width="${r2(p.box.w)}" height="${r2(p.box.h)}" fill="none" stroke="${C.axis}" stroke-width="2"/>`);
    for (const v of [0, 1, 2, 3, 4]) { p.label([v, 0], String(v), {color: C.label, size: 13, anchor: "middle", dy: 20}); p.label([0, v], String(v), {color: C.label, size: 13, anchor: "end", dx: -8, dy: 5}); }
    p.label([4, 0], "x₁", {color: C.label, size: 14, dx: 8, dy: 20}); p.label([2, 4], "x₁ = 2 missing", {color: C.label, size: 13, anchor: "middle", dy: -8});
    parts.push(p.svg());
    const tx = 470, singles = codes.length - merged.length;
    const info = [
      [`first layer: ${present.x1.length + present.x2.length} line units`, C.teal],
      ["x₁ = 1, 3 and x₂ = 1, 2, 3 (solid)", C.label],
      ["x₁ = 2 is not in the first layer (dashed)", C.label], ["", C.label],
      [`${codes.length} code regions:`, C.ink],
      [`${singles} single cells, error 0`, C.label],
      [`${merged.length} merged pairs, half in, half out:`, C.orange],
      ["min(A¹, A⁰) = 1 each, whatever g does", C.orange], ["", C.label],
      ["shaded pink: target cells (k + m odd)", C.pink]];
    info.forEach(([s, col], i) => s && parts.push(text(tx, 120 + i * 24, s, {color: col, size: 15})));
    parts.push(box(tx - 10, 372, 330, 46, {stroke: C.orange, rx: 10}),
      text(tx + 155, 401, `irreducible error = ${fmtNum(floor)} (of 16)`, {color: C.ink, size: 17, anchor: "middle", weight: 600}));
    return figure({id: "nn02-bneck", w: 900, h: 510, title: "Irreducible error from a missing line",
      desc: `The 3+3 checkerboard on the window from 0 to 4, with target cells (k + m odd) shaded. Five first-layer lines are drawn solid: x1 = 1 and 3, and x2 = 1, 2 and 3; the line x1 = 2 is dashed because it is missing from the first layer. The two middle columns therefore merge, giving ${codes.length} code regions: ${singles} single cells and ${merged.length} merged pairs spanning x1 from 1 to 3 in each row, outlined in orange. Each merged pair is half target and half not, so it costs area 1 whatever the later layers do. Computed on a 400-by-400 grid, the floor is ${fmtNum(floor)} out of 16.`,
      caption: "Later layers see only the code, so each merged region gets one label: at least a quarter of the window is wrong."}, parts);
  },
  /* §7.2: xy as two ridges, and the error of the 22-unit staircase network. */
  "nn02-ridge-xy"() {
    const g = t => t * t / 4, K = 10, lo = -2, hi = 2, D = (hi - lo) / K;
    const T = [...Array(K + 1).keys()].map(i => lo + i * D), h = [...Array(K).keys()].map(i => g(lo + (i + .5) * D));
    // Collect the skyline into one threshold unit per edge: coefficient of θ(t − Tᵢ).
    const coef = T.map((_, i) => (i < K ? h[i] : g(hi)) - (i > 0 ? h[i - 1] : 0));
    // θ(0) = 1: a point exactly on an edge belongs to the block on its right (tolerance guards against rounding of grid sums).
    const S = t => T.reduce((s, Ti, i) => s + coef[i] * H(t - Ti + 1e-9), 0);
    const N = (x, y) => S(x + y) - S(x - y), units = 2 * T.length;
    let maxE = 0, maxAt;
    for (let i = 0; i <= 40; i++) for (let j = 0; j <= 40; j++) {
      const x = -1 + i / 20, y = -1 + j / 20, e = Math.abs(x * y - N(x, y));
      if (e > maxE + 1e-12) { maxE = e; maxAt = [x, y]; }
    }
    const emax = Math.ceil(maxE * 20 - 1e-9) / 20;
    const parts = [heading("xy as a difference of two ridges")];
    const box0 = {xmin: -1, xmax: 1, ymin: -1, ymax: 1};
    const panes = [
      {x: 20, f: (x, y) => x * y, lo: -1, hi: 1, title: "xy"},
      {x: 235, ridge: [1, 1], lo: -1, hi: 1, title: "(x+y)²/4"},
      {x: 450, ridge: [1, -1], lo: -1, hi: 1, title: "(x−y)²/4"},
      {x: 700, f: (x, y) => Math.abs(x * y - N(x, y)), lo: 0, hi: emax, title: `|xy − N(x, y)|`}];
    for (const q of panes) {
      const p = panel({x: q.x, y: 100, w: 180, h: 180, ...box0, title: q.title});
      if (q.ridge) ridgeBands(p, q.ridge, g, {tmin: -2, tmax: 2, lo: q.lo, hi: q.hi, levels: 20, clipId: `clip-${q.x}-100`});
      else heat(p, q.f, {...box0, N: 45, lo: q.lo, hi: q.hi, levels: q.lo < 0 ? 20 : 8});
      p.raw(`<rect x="${r2(p.box.x)}" y="${r2(p.box.y)}" width="${r2(p.box.w)}" height="${r2(p.box.h)}" fill="none" stroke="${C.axis}" stroke-width="1.5"/>`);
      p.label([-1, -1], "−1", {color: C.label, size: 13, anchor: "middle", dy: 18}).label([1, -1], "1", {color: C.label, size: 13, anchor: "middle", dy: 18});
      parts.push(p.svg());
    }
    parts.push(text(217, 197, "=", {color: C.ink, size: 24, anchor: "middle"}), text(432, 197, "−", {color: C.ink, size: 24, anchor: "middle"}));
    // colour scales
    const scale = (x, w, lo, hi, levels, ticks, s) => {
      for (let k = 0; k < levels; k++) parts.push(`<rect x="${r2(x + k * w / levels)}" y="318" width="${r2(w / levels + .4)}" height="14" fill="${ramp((k + .5) / levels)}"/>`);
      parts.push(`<rect x="${x}" y="318" width="${w}" height="14" fill="none" stroke="${C.axis}"/>`);
      for (const v of ticks) parts.push(text(x + (v - lo) / (hi - lo) * w, 350, fmtNum(v), {color: C.label, size: 13, anchor: "middle"}));
      parts.push(text(x + w / 2, 372, s, {color: C.muted, size: 13, anchor: "middle"}));
    };
    scale(110, 450, -1, 1, 20, [-1, -0.5, 0, 0.5, 1], "colour scale for the three function panels");
    scale(700, 180, 0, emax, 8, [0, emax / 2, emax], "error");
    parts.push(text(310, 410, "each ridge is constant along one family of diagonals", {color: C.label, size: 14, anchor: "middle"}),
      text(790, 404, `${units} threshold units (K = ${K})`, {color: C.label, size: 14, anchor: "middle"}),
      text(790, 424, `max error on a 41×41 grid: ${maxE.toFixed(2)}`, {color: C.ink, size: 14, anchor: "middle"}),
      text(790, 444, `at the corner (${maxAt.map(fmtNum).join(", ")})`, {color: C.label, size: 14, anchor: "middle"}));
    return figure({id: "nn02-ridge", w: 900, h: 500, title: "xy from two ridge functions",
      desc: `Four heat maps on the square from −1 to 1, on a sequential colour ramp from dark blue through teal to near white. First, xy, a saddle. Then, after an equals sign, the ridge (x+y)²/4, constant along lines x + y = constant, and after a minus sign the ridge (x−y)²/4, constant along lines x − y = constant; these three share one colour scale from −1 to 1. Last, on its own scale from 0 to ${fmtNum(emax)}, the error |xy − N(x, y)| of the ${units}-unit network N(x, y) = S(x+y) − S(x−y), where S is the ${K}-block midpoint skyline of t²/4 on [−2, 2] with edges −2 + 0.4i and an endpoint unit at t = 2. The largest error on a 41-by-41 grid is ${maxE.toFixed(2)}, at the corner (${maxAt.map(fmtNum).join(", ")}).`,
      caption: `xy = ¼(x+y)² − ¼(x−y)²: two skylines of ${K + 1} units each give a one-hidden-layer network.`}, parts);
  },

  /* §7.2: cylinder excesses add up along a row of discs. */
  "nn02-cylinder-tails"() {
    const E = K => { let s = 0; for (let j = 0; j < K; j++) s += Math.asin(1 / Math.abs(1.5 - 3 * j)) / Math.PI; return s; };
    let first = 1; while (E(first) < 0.5) first++;
    const F = frame({x: 120, y: 80, w: 700, h: 300, xmin: 1, xmax: 200, ymin: 0, ymax: 1.1, xlog: true});
    const parts = [heading("Faint tails add up: total excess at the first gap")];
    for (let v = 0; v <= 1.0001; v += 0.25) parts.push(path(`M${F.x} ${r2(F.Y(v))}H${F.x + F.w}`, {color: C.grid, width: 1.2}),
      text(F.x - 10, F.Y(v) + 5, fmtNum(v), {color: C.label, size: 13, anchor: "end"}));
    for (const K of [1, 2, 3, 5, 10, 20, 50, 100, 200]) parts.push(path(`M${r2(F.X(K))} ${F.y + F.h}v6`, {color: C.axis}), text(F.X(K), F.y + F.h + 22, String(K), {color: C.label, size: 13, anchor: "middle"}));
    parts.push(path(`M${F.x} ${F.y}V${F.y + F.h}H${F.x + F.w}`, {color: C.axis, width: 2}),
      path(`M${F.x} ${r2(F.Y(0.5))}H${F.x + F.w}`, {color: C.orange, width: 2.2, dash: "7 5"}),
      text(F.x + F.w - 4, F.Y(0.5) + 22, "½: the firing threshold", {color: C.orange, size: 14, anchor: "end"}));
    const Ks = []; for (let K = 1; K <= 200; K++) Ks.push(K);
    parts.push(polyline(Ks.map(K => [F.X(K), F.Y(E(K))]), {color: C.teal, width: 3}));
    for (const K of Ks.filter(K => K <= 10)) parts.push(circle(F.X(K), F.Y(E(K)), 3, {stroke: C.teal, fill: C.teal, width: 1}));
    const mark = (K, col, s, dx, dy, anchor = "start") => parts.push(circle(F.X(K), F.Y(E(K)), 6, {stroke: col, fill: col, width: 1}), text(F.X(K) + dx, F.Y(E(K)) + dy, s, {color: col, size: 14, anchor}));
    mark(2, C.ink, `K = 2: ${E(2).toFixed(3)}, rejected`, 10, 22);
    mark(first, C.pink, `K = ${first}: ${E(first).toFixed(3)}, a gap point fires`, -12, -14, "end");
    mark(100, C.ink, `K = 100: ${E(100).toFixed(3)}`, -10, -14, "end");
    parts.push(text(F.x + F.w / 2, F.y + F.h + 46, "number of discs K (logarithmic axis)", {color: C.label, size: 14, anchor: "middle"}),
      text(F.x + 4, F.y - 14, "Σ arcsin(1/|1.5 − 3j|)/π over j = 0 … K−1", {color: C.teal, size: 14}));
    return figure({id: "nn02-cyl", w: 900, h: 480, title: "Cylinder tails add up along a row of discs",
      desc: `Total excess E(K), the sum over j from 0 to K−1 of arcsin(1/|1.5 − 3j|)/π, at the gap point x1 = 1.5 of a row of K unit discs centred at 0, 3, 6, …, for K from 1 to 200 on a logarithmic axis. A dashed line marks ½. E(2) = ${E(2).toFixed(3)} lies below it; E(${first}) = ${E(first).toFixed(3)} is the first value above it, so a point in a gap fires; E(100) = ${E(100).toFixed(3)}. On the logarithmic axis the curve keeps rising almost in a straight line.`,
      caption: "Each excess fades like ρ/(πr), but their sum grows like ln K and passes ½ at K = 3."}, parts);
  },

  /* §8: the sawtooth, its deep network, and the crossings of ½. */
  "nn02-sawtooth"() {
    const t = x => 2 * Math.min(x, 1 - x), tk = (k, x) => { for (let i = 0; i < k; i++) x = t(x); return x; };
    const k = 3;
    const units = [{n: "a₁", w: {x: 1}, b: 0, act: "relu"}, {n: "b₁", w: {x: 1}, b: -0.5, act: "relu"}];
    for (let l = 2; l <= k; l++) {
      const pa = "a" + sub(l - 1), pb = "b" + sub(l - 1);
      units.push({n: "a" + sub(l), w: {[pa]: 2, [pb]: -4}, b: 0, act: "relu"}, {n: "b" + sub(l), w: {[pa]: 2, [pb]: -4}, b: -0.5, act: "relu"});
    }
    units.push({n: "y", w: {["a" + sub(k)]: 2, ["b" + sub(k)]: -4}, b: 0, act: "linear"});
    const net = {inputs: ["x"], units};
    for (let i = 0; i <= 1000; i++) { const x = i / 1000; if (Math.abs(run(net, {x}).y - tk(k, x)) > 1e-9) throw new Error("deep net differs from the sawtooth"); }
    // teeth = interior local maxima; crossings of ½ found on a grid fine enough to resolve every piece
    const M = 4096, teeth = kk => { let c = 0; for (let i = 1; i < M; i++) { const a = tk(kk, (i - 1) / M), b = tk(kk, i / M), d = tk(kk, (i + 1) / M); if (b > a && b >= d) c++; } return c; };
    const cross = []; for (let i = 0; i < M; i++) { const a = tk(k, i / M) - .5, b = tk(k, (i + 1) / M) - .5; if (a * b < 0 || (a === 0 && i > 0)) cross.push((i + a / (a - b)) / M); }
    const parts = [heading("Folding doubles the teeth; a shallow network must add them one at a time")];
    // t^∘k is linear between the knots i/2ᵏ (Lemma 2), so the knots draw it exactly
    const curve = (F, kk, col) => polyline([...Array(2 ** kk + 1).keys()].map(i => [F.X(i / 2 ** kk), F.Y(tk(kk, i / 2 ** kk))]), {color: col, width: 2.6});
    const axes = (F, s) => {
      parts.push(path(`M${F.x} ${F.y}V${F.y + F.h}H${F.x + F.w}`, {color: C.axis, width: 1.8}),
        text(F.x - 8, F.y + 5, "1", {color: C.label, size: 13, anchor: "end"}), text(F.x - 8, F.y + F.h + 5, "0", {color: C.label, size: 13, anchor: "end"}),
        text(F.x + F.w, F.y + F.h + 18, "1", {color: C.label, size: 13, anchor: "middle"}), text(F.x + F.w / 2, F.y - 12, s, {color: C.ink, size: 15, anchor: "middle"}));
    };
    [["t", 1, C.teal], ["t∘t", 2, C.blue], ["t∘t∘t", 3, C.orange]].forEach(([nm, kk, col], i) => {
      const F = frame({x: 70 + i * 280, y: 88, w: 220, h: 110, xmin: 0, xmax: 1, ymin: 0, ymax: 1});
      parts.push(curve(F, kk, col)); axes(F, `${nm}: ${teeth(kk)} ${teeth(kk) === 1 ? "tooth" : "teeth"}, ${2 ** kk} pieces`);
    });
    // deep width-2 network
    const cols = [60, 160, 260, 360, 450], pos = {x: [cols[0], 375]};
    for (let l = 1; l <= k; l++) { pos["a" + sub(l)] = [cols[l], 320]; pos["b" + sub(l)] = [cols[l], 430]; }
    pos.y = [cols[4], 375];
    const chips = [];
    for (const u of units) for (const [s, w] of Object.entries(u.w)) {
      const neg = w < 0;
      parts.push(link(pos[s], pos[u.n], {ra: 18, rb: 19, color: neg ? C.purple : C.dim, width: 1.8}));
      chips.push(chip(pos[s], pos[u.n], fmtW(w), {t: s === "x" ? .5 : .3, color: neg ? C.purple : C.label}));
    }
    parts.push(...chips);
    parts.push(circle(...pos.x, 18, {stroke: C.label}), text(pos.x[0], pos.x[1] + 5, "x", {color: C.ink, size: 15, anchor: "middle"}));
    for (const u of units) {
      const [x, y] = pos[u.n];
      parts.push(circle(x, y, 19, {stroke: u.n === "y" ? C.pink : C.teal}), text(x, y + 5, u.n === "y" ? "Σ" : fmtB(u.b), {color: C.ink, size: 14, anchor: "middle"}),
        text(x, u.n.startsWith("b") ? y + 38 : y - 27, u.n, {color: C.label, size: 14, anchor: "middle"}));
    }
    parts.push(text(255, 495, `ReLU(z), ReLU(z − ½) per layer; next layer reads 2, −4`, {color: C.label, size: 13, anchor: "middle"}),
      text(255, 515, `${units.length - 1} hidden units in ${k} layers of width 2`, {color: C.ink, size: 14, anchor: "middle"}));
    // crossings of ½
    const F = frame({x: 560, y: 300, w: 300, h: 150, xmin: 0, xmax: 1, ymin: 0, ymax: 1});
    parts.push(path(`M${F.x} ${r2(F.Y(.5))}H${F.x + F.w}`, {color: C.label, width: 1.6, dash: "6 5"}), curve(F, k, C.orange));
    for (const c of cross) parts.push(circle(F.X(c), F.Y(.5), 4.5, {stroke: C.pink, fill: C.pink, width: 1}));
    axes(F, `t∘t∘t crosses ½ at ${cross.length} points`);
    parts.push(text(F.x + F.w / 2, 495, `a shallow ReLU net with error <½ needs ≥ ${cross.length} pieces,`, {color: C.label, size: 13, anchor: "middle"}),
      text(F.x + F.w / 2, 515, `so at least ${cross.length - 1} units`, {color: C.ink, size: 14, anchor: "middle"}));
    return figure({id: "nn02-saw", w: 900, h: 580, title: "The sawtooth and its deep network",
      desc: `Top: the tent map t(x) = 2 min(x, 1 − x) on [0, 1] and its compositions t∘t and t∘t∘t, with ${teeth(1)}, ${teeth(2)} and ${teeth(3)} teeth and 2, 4 and 8 linear pieces. Bottom left: the deep ReLU network for k = 3. Input x feeds a first layer computing ReLU(x) and ReLU(x − ½); each later layer reads its two inputs with weights 2 and −4 and computes ReLU(z) and ReLU(z − ½); the output is 2a3 − 4b3. It has ${units.length - 1} hidden units in 3 layers of width 2 and is checked against t∘t∘t. Bottom right: t∘t∘t with a dashed line at ½ and its ${cross.length} crossings of that level marked.`,
      caption: `Deep: ${2 * k} hidden units compute t∘t∘t exactly. Shallow error <½ requires at least ${2 ** k - 1} hidden units; this lower bound does not prove attainability.`}, parts);
  },

  /* §9: a first layer narrower than the input collapses a direction. */
  "nn02-width-collapse"() {
    const w = [1 / Math.sqrt(5), 2 / Math.sqrt(5)], v = [2 / Math.sqrt(5), -1 / Math.sqrt(5)];
    if (Math.abs(w[0] * v[0] + w[1] * v[1]) > 1e-12 || Math.abs(Math.hypot(...v) - 1) > 1e-12) throw new Error("v must be a unit null vector of w");
    const target = x => x[0] ** 2 + x[1] ** 2;
    const parts = [heading("A one-unit first layer cannot tell 0 from v")];
    const box0 = {xmin: -1, xmax: 1, ymin: -1, ymax: 1};
    const L = panel({x: 60, y: 90, w: 300, h: 300, ...box0, title: "target x₁² + x₂²: circles"});
    const R = panel({x: 520, y: 90, w: 300, h: 300, ...box0, title: "any network after one unit: lines"});
    for (const p of [L, R]) p.raw(`<rect x="${r2(p.box.x)}" y="${r2(p.box.y)}" width="${r2(p.box.w)}" height="${r2(p.box.h)}" fill="#0d1a2b" stroke="${C.axis}" stroke-width="1.5"/>`);
    const levels = [0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];
    L.raw(`<g clip-path="url(#clip-60-90)">`);
    for (const c of levels) L.ellipse([[1, 0], [0, 1]], {r: Math.sqrt(c), n: 120, color: c === 1 ? C.orange : ramp(0.3 + 0.6 * c / 2), width: c === 1 ? 2.6 : 1.8});
    L.raw("</g>");
    for (let c = -1.4; c <= 1.40001; c += 0.2) {
      const isZero = Math.abs(c) < 1e-9;
      R.fullLine([w[0] * c, w[1] * c], v, {color: isZero ? C.orange : ramp(0.3 + 0.3 * (c + 1.4) / 1.4), width: isZero ? 2.6 : 1.8});
    }
    R.arrow([0, 0], [w[0] * .6, w[1] * .6], {color: C.pink, width: 3, label: "w", dx: 8, dy: 4, size: 15});
    R.rightAngle([0, 0], w, v, {size: .1});
    for (const p of [L, R]) {
      p.point([0, 0], {color: C.ink, r: 6}).point(v, {color: C.ink, r: 6});
      p.label([0, 0], "0", {color: C.ink, size: 15, dx: -14, dy: -8});
      p.label(v, "v", {color: C.ink, size: 15, dx: -6, dy: 22});
    }
    L.label([0, 0], `target ${fmtNum(target([0, 0]))}`, {color: C.teal, size: 14, dx: -14, dy: 22, anchor: "end"});
    L.label(v, `target ${fmtNum(target(v))}`, {color: C.teal, size: 14, dx: 12, dy: -10});
    R.label([0, 0], "same value", {color: C.orange, size: 14, dx: -14, dy: 22, anchor: "end"}).label(v, "at both", {color: C.orange, size: 14, dx: 12, dy: -10});
    parts.push(L.svg(), R.svg(), text(440, 245, "vs", {color: C.label, size: 18, anchor: "middle"}),
      text(210, 425, "0 and v lie on different circles", {color: C.label, size: 14, anchor: "middle"}),
      text(670, 425, `w = (1, 2)/√5, v = (2, −1)/√5, w·v = 0`, {color: C.label, size: 14, anchor: "middle"}));
    return figure({id: "nn02-width", w: 900, h: 490, title: "A one-unit first layer collapses a direction",
      desc: "Left: on the square from −1 to 1, circular level sets of x1² + x2², with the unit circle highlighted; the origin is marked with target value 0 and the unit vector v = (2, −1)/√5 on the unit circle with target value 1. Right: the level sets of any network whose first layer is one unit with weight vector w = (1, 2)/√5: parallel lines perpendicular to w, drawn with an arrow for w and a right-angle mark. The origin and v lie on the same highlighted line, so the network gives them the same value.",
      caption: "Whatever follows the first layer, f(0) = f(v); the target differs by 1, so one of them is off by at least ½."}, parts);
  },

  /* §10: product of sums versus sum of products. */
  "nn02-spn"() {
    const k = 3, X = xs(2 * k);
    // expand Π (x_{2i−1} + x_{2i}) by choosing one variable from each bracket
    const monos = [];
    for (let m = 0; m < 2 ** k; m++) monos.push([...Array(k).keys()].map(i => 2 * i + ((m >> (k - 1 - i)) & 1)));
    const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(17);
    for (let trial = 0; trial < 20; trial++) {
      const x = X.map(() => rnd() * 4 - 2), fact = [...Array(k).keys()].reduce((p, i) => p * (x[2 * i] + x[2 * i + 1]), 1);
      const exp = monos.reduce((s, mo) => s + mo.reduce((p, i) => p * x[i], 1), 0);
      if (Math.abs(fact - exp) > 1e-9) throw new Error("expansion is wrong");
    }
    const parts = [heading("The same polynomial, factored and expanded")];
    // left: ΠΣ
    const inY = i => 110 + i * 56, lx = 70, sx = 200, px = 320;
    const sumPos = [...Array(k).keys()].map(i => [sx, (inY(2 * i) + inY(2 * i + 1)) / 2]);
    sumPos.forEach((s, i) => { parts.push(link([lx, inY(2 * i)], s, {ra: 17, rb: 20}), link([lx, inY(2 * i + 1)], s, {ra: 17, rb: 20}), link(s, [px, inY(2.5)], {ra: 20, rb: 22, color: C.dim})); });
    sumPos.forEach(([x, y]) => parts.push(circle(x, y, 20, {stroke: C.teal}), text(x, y + 7, "+", {color: C.ink, size: 20, anchor: "middle"})));
    parts.push(circle(px, inY(2.5), 22, {stroke: C.pink}), text(px, inY(2.5) + 6, "×", {color: C.ink, size: 20, anchor: "middle"}));
    // right: ΣΠ
    const rx = 500, mx = 670, ox = 840, my = i => 96 + i * 46;
    monos.forEach((mo, j) => mo.forEach(i => parts.push(path(`M${rx + 17} ${inY(i)}L${mx - 44} ${my(j)}`, {color: C.dim, width: 1.2}))));
    monos.forEach((mo, j) => parts.push(link([mx + 44, my(j)], [ox, inY(2.5)], {ra: 0, rb: 22, color: C.dim, width: 1.6})));
    monos.forEach((mo, j) => parts.push(box(mx - 44, my(j) - 15, 88, 30, {stroke: C.orange, rx: 15}), text(mx, my(j) + 5, mo.map(i => X[i]).join(""), {color: C.ink, size: 14, anchor: "middle"})));
    parts.push(circle(ox, inY(2.5), 22, {stroke: C.pink}), text(ox, inY(2.5) + 7, "+", {color: C.ink, size: 20, anchor: "middle"}));
    for (const x0 of [lx, rx]) X.forEach((nm, i) => parts.push(circle(x0, inY(i), 17, {stroke: C.label}), text(x0, inY(i) + 5, nm, {color: C.ink, size: 14, anchor: "middle"})));
    const nL = k + 1, nR = monos.length + 1;
    parts.push(path("M440 80V470", {color: C.axis, width: 1.5}),
      text(220, 450, `ΠΣ: ${k} sums, 1 product = ${nL} units`, {color: C.ink, size: 15, anchor: "middle"}),
      text(220, 472, "(x₁+x₂)(x₃+x₄)(x₅+x₆)", {color: C.label, size: 14, anchor: "middle"}),
      text(670, 470, `ΣΠ: ${monos.length} products, 1 sum = ${nR} units`, {color: C.ink, size: 15, anchor: "middle"}));
    return figure({id: "nn02-spn", w: 900, h: 530, title: "Product of sums versus sum of products",
      desc: `Left: inputs x1 to x6 feed three sum units computing x1+x2, x3+x4 and x5+x6, which feed one product unit: ${nL} units. Right: the expanded form, found by choosing one variable from each bracket: ${monos.length} product units for the monomials ${monos.map(mo => mo.map(i => "x" + (i + 1)).join("")).join(", ")}, each reading three inputs, feeding one sum unit: ${nR} units. Both have depth 2 and are checked to compute the same polynomial.`,
      caption: `Both circuits have depth 2. Expanding ${k} two-term sums costs 2${sup(k)} products: a gate-order comparison.`}, parts);
  },

  /* §11: Radon's theorem in the plane, the two four-point cases. */
  "nn02-radon"() {
    const tri = [[-1.4, -1.1], [1.5, -0.9], [0.1, 1.5]], inner = [0.05, -0.15];
    const bary = (p, [a, b, c]) => { const d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
      const l1 = ((b[1] - c[1]) * (p[0] - c[0]) + (c[0] - b[0]) * (p[1] - c[1])) / d, l2 = ((c[1] - a[1]) * (p[0] - c[0]) + (a[0] - c[0]) * (p[1] - c[1])) / d; return [l1, l2, 1 - l1 - l2]; };
    if (!bary(inner, tri).every(l => l > 0)) throw new Error("inner point is not inside the triangle");
    const quad = [[-1.3, -0.8], [1.2, -1.2], [1.4, 0.9], [-0.9, 1.3]];
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    if (!quad.every((q, i) => cr(q, quad[(i + 1) % 4], quad[(i + 2) % 4]) > 0)) throw new Error("quadrilateral is not convex");
    // intersection of the diagonals q0q2 and q1q3
    const [a, b, c, d] = quad, den = (a[0] - c[0]) * (b[1] - d[1]) - (a[1] - c[1]) * (b[0] - d[0]);
    const s = ((a[0] - b[0]) * (b[1] - d[1]) - (a[1] - b[1]) * (b[0] - d[0])) / den;
    const X = [a[0] + s * (c[0] - a[0]), a[1] + s * (c[1] - a[1])];
    const parts = [heading("Four points: some labelling has crossing hulls")];
    const box0 = {xmin: -1.8, xmax: 1.8, ymin: -1.6, ymax: 1.8};
    const L = panel({x: 50, y: 80, w: 360, h: 340, ...box0}), R = panel({x: 490, y: 80, w: 360, h: 340, ...box0});
    L.polygon(tri, {fill: C.pink, opacity: .2, stroke: C.pink, width: 2.5});
    // put each label on the side away from the configuration's centre
    const away = (q, ctr) => { const dx = q[0] - ctr[0], dy = q[1] - ctr[1], L0 = Math.hypot(dx, dy); return {dx: 20 * dx / L0, dy: -20 * dy / L0 + 6, anchor: "middle"}; };
    const ct = [0, 1, 2].map(i => tri.reduce((s0, q) => s0 + q[i] / 3, 0));
    tri.forEach(q => L.point(q, {color: C.pink, r: 9}).label(q, "1", {color: C.pink, size: 16, ...away(q, ct)}));
    L.point(inner, {color: C.bg, r: 9}).raw(`<circle cx="${r2(L.P(inner)[0])}" cy="${r2(L.P(inner)[1])}" r="9" fill="${C.bg}" stroke="${C.label}" stroke-width="3"/>`)
      .label(inner, "0", {color: C.label, size: 16, dx: 13, dy: 6});
    R.polygon(quad, {fill: C.dim, opacity: .08, stroke: C.dim, width: 1.5, dash: "3 5"});
    R.line(a, c, {color: C.pink, width: 3}).line(b, d, {color: C.label, width: 3, dash: "8 5"});
    const cq = [0, 1].map(i => quad.reduce((s0, q) => s0 + q[i] / 4, 0));
    [a, c].forEach(q => R.point(q, {color: C.pink, r: 9}).label(q, "1", {color: C.pink, size: 16, ...away(q, cq)}));
    [b, d].forEach(q => R.raw(`<circle cx="${r2(R.P(q)[0])}" cy="${r2(R.P(q)[1])}" r="9" fill="${C.bg}" stroke="${C.label}" stroke-width="3"/>`)
      .label(q, "0", {color: C.label, size: 16, ...away(q, cq)}));
    R.point(X, {color: C.orange, r: 6}).label(X, "crossing point", {color: C.orange, size: 14, dx: 12, dy: -10});
    L.point(inner, {color: C.orange, r: 4}).label(inner, "hulls meet here", {color: C.orange, size: 14, anchor: "middle", dy: -20});
    parts.push(L.svg(), R.svg(),
      text(230, 450, "one point inside the triangle of the others", {color: C.ink, size: 15, anchor: "middle"}),
      text(670, 450, "convex position: the two diagonals cross", {color: C.ink, size: 15, anchor: "middle"}));
    return figure({id: "nn02-radon", w: 900, h: 510, title: "Radon's theorem for four points in the plane",
      desc: `Two four-point configurations. Left: three points labelled 1 form a shaded triangle and a fourth point labelled 0 lies inside it, so the convex hulls of the two classes meet at the inner point and no line separates them. Right: four points in convex position; the diagonal joining the two points labelled 1 (solid) and the diagonal joining the two points labelled 0 (dashed) cross at a marked point (${X.map(v => v.toFixed(2)).join(", ")}), computed as the intersection of the two segments.`,
      caption: "A firing set is a half-plane and contains its convex hull, so neither labelling is produced by one unit."}, parts);
  },
};
