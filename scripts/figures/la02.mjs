/* LA02 figures: systems, elimination, the four subspaces, elementary matrices and LU.

   Every drawing is computed from the numbers used in the lesson text, and the
   assertions below fail the build if a drawn point does not satisfy the
   equation or recipe its label claims. */
import {C, figure, panel, text, add, sub, scale, dot, mv, fmt} from "./svgkit.mjs";

const check = (ok, what) => { if (!ok) throw new Error("la02 figure arithmetic: " + what); };
const close = (a, b) => Math.abs(a - b) < 1e-9;
const same = (a, b) => a.length === b.length && a.every((x, i) => close(x, b[i]));
const comb = (cs, vs) => vs.reduce((s, v, i) => add(s, scale(cs[i], v)), vs[0].map(() => 0));
const matmul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));
const heading = (s, w = 900) => text(w / 2, 40, s, {color: C.label, size: 18, anchor: "middle"});
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/* A text label on a dark backing so it stays readable over grid lines. */
function tag(p, at, s, {color = C.ink, size = 15, dx = 0, dy = 0} = {}) {
  const [x, y] = p.P(at), w = 0.56 * size * [...s].length + 10;
  p.raw(`<rect x="${(x + dx - 5).toFixed(1)}" y="${(y + dy - size).toFixed(1)}" width="${w.toFixed(1)}" height="${(size + 8).toFixed(1)}" rx="5" fill="${C.bg}" fill-opacity="0.85"/>`);
  p.label(at, s, {color, size, dx, dy});
}

/* Orthographic view of R^3: x toward the viewer and left, y to the right, z up. */
function view3(az = 32, el = 20) {
  const a = az * Math.PI / 180, e = el * Math.PI / 180;
  return ([x, y, z]) => [-x * Math.sin(a) + y * Math.cos(a), z * Math.cos(e) - (x * Math.cos(a) + y * Math.sin(a)) * Math.sin(e)];
}
function panel3({x, y, w, h, points, P3, pad = 0.4, title}) {
  const q = points.map(P3), xs = q.map(p => p[0]), ys = q.map(p => p[1]);
  const p = panel({x, y, w, h, xmin: Math.min(...xs) - pad, xmax: Math.max(...xs) + pad,
    ymin: Math.min(...ys) - pad, ymax: Math.max(...ys) + pad, title});
  const T = v => P3(v);
  return {
    p,
    arrow: (a, b, o) => p.arrow(T(a), T(b), o),
    line: (a, b, o) => p.line(T(a), T(b), o),
    point: (a, o) => p.point(T(a), o),
    label: (a, s, o) => p.label(T(a), s, o),
    tag: (a, s, o) => tag(p, T(a), s, o),
    /* Parallelogram o + s u + t v, s in [s0,s1], t in [t0,t1]. */
    patch: (o, u, v, [s0, s1], [t0, t1], opts) => p.polygon([
      add(o, add(scale(s0, u), scale(t0, v))), add(o, add(scale(s1, u), scale(t0, v))),
      add(o, add(scale(s1, u), scale(t1, v))), add(o, add(scale(s0, u), scale(t1, v)))].map(T), opts),
    /* Dashed drop from a point to the floor z = 0: the depth cue. */
    drop(a, color = C.muted) { p.line(T(a), T([a[0], a[1], 0]), {color, width: 1.5, dash: "3 4"}); p.point(T([a[0], a[1], 0]), {color, r: 3}); },
    axes(len = [3, 3, 3], {neg = 0} = {}) {
      [[len[0], 0, 0, "x"], [0, len[1], 0, "y"], [0, 0, len[2], "z"]].forEach(([a, b, c, n]) => {
        p.line(T([-neg * a, -neg * b, -neg * c]), T([a, b, c]), {color: C.axis, width: 2});
        p.label(T([a * 1.07, b * 1.07, c * 1.07]), n, {color: C.label, size: 16, dx: -4, dy: 5});
      });
    },
  };
}

/* A matrix drawn as numbers between brackets. opts.box: [[i,j],...] boxed entries;
   opts.shade: column indices shaded; opts.bar: draw an augmentation bar before this column. */
function matrix(x, y, M, {cw = 40, rh = 30, size = 16, box = [], shade = [], bar, color = C.ink, hi = []} = {}) {
  const m = M.length, n = M[0].length, out = [];
  const W = n * cw + 16, H = m * rh + 10;
  for (const j of shade) out.push(`<rect x="${x + 8 + j * cw}" y="${y}" width="${cw}" height="${H}" fill="${C.orange}" fill-opacity="0.13"/>`);
  out.push(`<path d="M${x + 7} ${y}H${x}V${y + H}H${x + 7}" stroke="${C.muted}" stroke-width="2" fill="none"/>`);
  out.push(`<path d="M${x + W - 7} ${y}H${x + W}V${y + H}H${x + W - 7}" stroke="${C.muted}" stroke-width="2" fill="none"/>`);
  if (bar !== undefined) out.push(`<path d="M${x + 8 + bar * cw} ${y + 4}V${y + H - 4}" stroke="${C.muted}" stroke-width="1.5"/>`);
  M.forEach((row, i) => row.forEach((v, j) => {
    const cx = x + 8 + (j + 0.5) * cw, cy = y + 5 + (i + 0.5) * rh + size * 0.35;
    const isHi = hi.some(([a, b]) => a === i && b === j);
    out.push(text(cx, cy, typeof v === "string" ? v : fmt(v), {color: isHi ? C.orange : color, size, anchor: "middle", weight: isHi ? 600 : undefined}));
    if (box.some(([a, b]) => a === i && b === j))
      out.push(`<rect x="${cx - cw / 2 + 4}" y="${cy - size - 1}" width="${cw - 8}" height="${size + 9}" rx="5" fill="none" stroke="${C.teal}" stroke-width="2"/>`);
  }));
  return {svg: out, w: W, h: H};
}
const arrowRight = (x0, x1, y, label, color = C.label) => [
  `<path d="M${x0} ${y}H${x1 - 9}" stroke="${color}" stroke-width="2"/>`,
  `<path d="M${x1} ${y}L${x1 - 10} ${y - 5}L${x1 - 10} ${y + 5}Z" fill="${color}"/>`,
  ...(label ? [].concat(label).map((s, k) => text((x0 + x1) / 2, y - 10 - 18 * ([].concat(label).length - 1 - k), s, {color, size: 14, anchor: "middle"})) : []),
];
/* Exact-enough fraction formatting for matrix entries. */
function frac(v) {
  for (const d of [1, 2, 3, 4, 5, 6, 8]) {
    const n = Math.round(v * d);
    if (close(n / d, v)) return d === 1 ? String(n).replace("-", "−") : `${n < 0 ? "−" : ""}${Math.abs(n)}/${d}`;
  }
  return v.toFixed(2);
}

export default {
  /* §1: 2x − y = 1, x + y = 5 as two lines and as a recipe 2a₁ + 3a₂ = b. */
  "la02-row-column"() {
    const a1 = [2, 1], a2 = [-1, 1], b = [1, 5], x = [2, 3];
    check(same(comb(x, [a1, a2]), b), "2a1 + 3a2 = b");
    check(close(2 * x[0] - x[1], 1) && close(x[0] + x[1], 5), "(2,3) on both lines");
    const L = panel({x: 40, y: 80, w: 390, h: 290, xmin: -1, xmax: 5, ymin: -1, ymax: 6, title: "row picture: two lines"});
    L.grid(1).axes();
    L.fullLine([0, -1], [1, 2], {color: C.teal, width: 3});
    L.fullLine([0, 5], [1, -1], {color: C.orange, width: 3});
    tag(L, [3.2, 5.4], "2x − y = 1", {color: C.teal});
    tag(L, [3.4, 1.6], "x + y = 5", {color: C.orange});
    L.point(x, {color: C.ink, r: 6});
    tag(L, x, "(2, 3)", {dx: -62, dy: -6});
    const R = panel({x: 470, y: 80, w: 390, h: 290, xmin: -1.5, xmax: 5, ymin: -0.5, ymax: 6, title: "column picture: 2a₁ + 3a₂ = b"});
    R.grid(1).axes();
    R.arrow([0, 0], a1, {color: C.teal, width: 3});
    R.arrow(a1, scale(2, a1), {color: C.teal, width: 3});
    tag(R, [2.1, 0.55], "2a₁ = 2·(2, 1)", {color: C.teal, dx: 4, dy: 12});
    const s = scale(2, a1);
    R.arrow(s, add(s, a2), {color: C.orange, width: 3});
    R.arrow(add(s, a2), add(s, scale(2, a2)), {color: C.orange, width: 3});
    R.arrow(add(s, scale(2, a2)), b, {color: C.orange, width: 3});
    tag(R, add(s, scale(1.5, a2)), "3a₂ = 3·(−1, 1)", {color: C.orange, dx: 10, dy: 4});
    R.arrow([0, 0], b, {color: C.ink, width: 3, dash: "7 5"});
    R.point(b, {color: C.ink, r: 5});
    tag(R, b, "b = (1, 5)", {dx: -92, dy: -4});
    return figure({
      id: "la02-rc", w: 900, h: 430,
      title: "One system in the row picture and the column picture",
      desc: "Left: the lines 2x − y = 1 and x + y = 5 cross at (2, 3). Right: two copies of the column (2, 1) followed by three copies of the column (−1, 1) reach b = (1, 5).",
      caption: "The same numbers (2, 3) are a crossing point on the left and a recipe on the right.",
    }, [L.svg(), R.svg()]);
  },

  /* §1: the map x ↦ Ax carries the standard grid to the grid of a₁, a₂. */
  "la02-linear-map"() {
    const A = [[2, -1], [1, 1]], x = [2, 3], b = mv(A, x);
    check(same(b, [1, 5]), "A(2,3) = (1,5)");
    const L = panel({x: 40, y: 80, w: 330, h: 290, xmin: -1, xmax: 4, ymin: -1, ymax: 4, title: "input: the standard grid"});
    L.grid(1).axes();
    L.polygon([[0, 0], [1, 0], [1, 1], [0, 1]], {fill: C.purple, opacity: 0.3, stroke: C.purple, width: 2});
    L.arrow([0, 0], [1, 0], {color: C.teal, width: 3, label: "e₁", dx: -8, dy: 22});
    L.arrow([0, 0], [0, 1], {color: C.orange, width: 3, label: "e₂", dx: -28, dy: 8});
    L.point(x, {color: C.ink, r: 6});
    tag(L, x, "x = (2, 3)", {dx: 10, dy: -8});
    const R = panel({x: 440, y: 80, w: 430, h: 290, xmin: -4, xmax: 6, ymin: -1, ymax: 6, title: "output: the image grid"});
    R.grid(1, {color: "#10262f"});
    R.grid(1, {M: A, color: C.grid, width: 1.8});
    R.axes();
    R.polygon([[0, 0], [2, 1], [1, 2], [-1, 1]], {fill: C.purple, opacity: 0.3, stroke: C.purple, width: 2});
    R.arrow([0, 0], [2, 1], {color: C.teal, width: 3, label: "a₁ = Ae₁ = (2, 1)", dx: 6, dy: 18});
    R.arrow([0, 0], [-1, 1], {color: C.orange, width: 3});
    tag(R, [-1, 1], "a₂ = Ae₂ = (−1, 1)", {color: C.orange, dx: -150, dy: -12});
    R.point(b, {color: C.ink, r: 6});
    tag(R, b, "Ax = 2a₁ + 3a₂ = (1, 5)", {dx: 10, dy: -8});
    return figure({
      id: "la02-map", w: 900, h: 430,
      title: "A linear map is decided by the images of e₁ and e₂",
      desc: "Left: the standard grid with e1, e2, the unit square and the point x = (2, 3). Right: the image grid spanned by a1 = (2, 1) and a2 = (−1, 1); the unit square becomes the parallelogram on a1 and a2, and x lands on Ax = (1, 5), two steps along a1 and three along a2.",
      caption: "Squares go to parallelograms; the point 2 across and 3 up lands 2 steps along a₁ and 3 along a₂.",
    }, [text(405, 230, "x ↦ Ax", {color: C.label, size: 17, anchor: "middle"}), L.svg(), R.svg()]);
  },

  /* §2: unit square under B, then A; equals the square under AB. */
  "la02-composition"() {
    const A = [[1, 1], [0, 2]], B = [[2, 0], [1, 1]], AB = matmul(A, B);
    check(same(AB.flat(), [3, 1, 2, 2]), "AB = [[3,1],[2,2]]");
    check(same(matmul(B, A).flat(), [2, 2, 1, 3]), "BA = [[2,2],[1,3]]");
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
    const box = {xmin: -0.6, xmax: 4.6, ymin: -0.6, ymax: 4.6};
    const mk = (x, title) => { const p = panel({x, y: 80, w: 260, h: 260, ...box, title}); p.grid(1, {width: 1}).axes(); return p; };
    const P0 = mk(30, "unit square");
    P0.polygon(sq, {fill: C.purple, opacity: 0.3, stroke: C.purple});
    P0.arrow([0, 0], [1, 0], {color: C.teal, width: 3, label: "e₁", dx: -6, dy: 22});
    P0.arrow([0, 0], [0, 1], {color: C.orange, width: 3, label: "e₂", dx: -26, dy: 6});
    const P1 = mk(320, "after B");
    P1.polygon(sq.map(v => mv(B, v)), {fill: C.purple, opacity: 0.3, stroke: C.purple});
    P1.arrow([0, 0], mv(B, [1, 0]), {color: C.teal, width: 3});
    tag(P1, mv(B, [1, 0]), "Be₁ = (2, 1)", {color: C.teal, dx: 8, dy: 18});
    P1.arrow([0, 0], mv(B, [0, 1]), {color: C.orange, width: 3});
    tag(P1, mv(B, [0, 1]), "Be₂ = (0, 1)", {color: C.orange, dx: -96, dy: -6});
    const P2 = mk(610, "after A: the image under AB");
    P2.polygon(sq.map(v => mv(AB, v)), {fill: C.purple, opacity: 0.3, stroke: C.purple});
    P2.arrow([0, 0], mv(AB, [1, 0]), {color: C.teal, width: 3});
    tag(P2, mv(AB, [1, 0]), "(3, 2)", {color: C.teal, dx: 8, dy: 16});
    P2.arrow([0, 0], mv(AB, [0, 1]), {color: C.orange, width: 3});
    tag(P2, mv(AB, [0, 1]), "(1, 2)", {color: C.orange, dx: -64, dy: -6});
    return figure({
      id: "la02-comp", w: 900, h: 430,
      title: "Composition: B first, then A, is the product AB",
      desc: "Three panels. The unit square; its image under B = [[2,0],[1,1]], the parallelogram with sides (2,1) and (0,1); and the image of that under A = [[1,1],[0,2]], the parallelogram with sides (3,2) and (1,2), which are the columns of AB = [[3,1],[2,2]].",
      caption: "The final sides (3, 2) and (1, 2) are the columns of AB. Doing A first gives the different matrix BA.",
    }, [P0.svg(), P1.svg(), P2.svg(),
      ...arrowRight(292, 318, 210, "B"), ...arrowRight(582, 608, 210, "A")]);
  },

  /* §3: R₂ ← R₂ − ½R₁ in both pictures. */
  "la02-elimination-shear"() {
    const E = [[1, 0], [-0.5, 1]], a1 = [2, 1], a2 = [-1, 1], b = [1, 5];
    const [e1, e2, eb] = [a1, a2, b].map(v => mv(E, v));
    check(same(e1, [2, 0]) && same(e2, [-1, 1.5]) && same(eb, [1, 4.5]), "sheared columns");
    check(same(comb([2, 3], [e1, e2]), eb), "recipe survives the shear");
    const L = panel({x: 40, y: 80, w: 380, h: 290, xmin: -1, xmax: 5, ymin: -1, ymax: 6, title: "row picture: x + y = 5 turns into y = 3"});
    L.grid(1).axes();
    L.fullLine([0, -1], [1, 2], {color: C.teal, width: 3});
    L.fullLine([0, 5], [1, -1], {color: C.orange, width: 2.5, dash: "7 6"});
    L.fullLine([0, 3], [1, 0], {color: C.pink, width: 3});
    tag(L, [3.1, 5.3], "2x − y = 1", {color: C.teal});
    tag(L, [3.9, 0.3], "old: x + y = 5", {color: C.orange});
    tag(L, [3.0, 3.25], "new: (3/2)y = 9/2", {color: C.pink});
    L.point([2, 3], {color: C.ink, r: 6});
    tag(L, [2, 3], "(2, 3)", {dx: -60, dy: -8});
    const R = panel({x: 470, y: 80, w: 390, h: 290, xmin: -2, xmax: 5, ymin: -0.8, ymax: 6, title: "column picture: the plane is sheared"});
    R.grid(1, {color: "#10262f"});
    R.grid(1, {M: E, color: C.grid, width: 1.6});
    R.axes();
    R.arrow([0, 0], a1, {color: C.dim, width: 2, dash: "5 5"});
    R.arrow([0, 0], a2, {color: C.dim, width: 2, dash: "5 5"});
    R.arrow([0, 0], b, {color: C.dim, width: 2, dash: "5 5"});
    R.label(b, "b", {color: C.muted, dx: 6, dy: -4});
    R.arrow([0, 0], e1, {color: C.teal, width: 3});
    tag(R, e1, "Sa₁ = (2, 0)", {color: C.teal, dx: -10, dy: 26});
    R.arrow([0, 0], e2, {color: C.orange, width: 3});
    tag(R, e2, "Sa₂ = (−1, 1.5)", {color: C.orange, dx: -60, dy: -12});
    R.arrow([0, 0], eb, {color: C.ink, width: 3});
    tag(R, eb, "Sb = (1, 4.5)", {dx: 10, dy: 10});
    return figure({
      id: "la02-shear", w: 900, h: 430,
      title: "Elimination step R₂ ← R₂ − ½R₁ in the row and column pictures",
      desc: "Left: the line x + y = 5 (dashed) is replaced by the horizontal line (3/2)y = 9/2, that is y = 3, which passes through the same crossing point (2, 3) with 2x − y = 1. Right: the shear E = [[1,0],[−1/2,1]] moves the columns (2,1) and (−1,1) to (2,0) and (−1,1.5) and b = (1,5) to (1,4.5); faint dashed arrows show the originals and the skewed grid shows the sheared plane.",
      caption: "Row picture: the second line turns about (2, 3). Column picture: one shear moves a₁, a₂ and b together.",
    }, [L.svg(), R.svg()]);
  },

  /* §3: three planes through (1, 2, −1), and the recipe 1·a₁ + 2·a₂ − 1·a₃ = b. */
  "la02-three-planes"() {
    const N = [[2, 1, 1], [4, 1, 0], [-2, 2, 1]], rhs = [3, 6, 1], s = [1, 2, -1];
    N.forEach((n, i) => check(close(dot(n, s), rhs[i]), "solution on plane " + i));
    const cols = [0, 1, 2].map(j => N.map(r => r[j]));
    check(same(comb(s, cols), rhs), "column recipe");
    const P3 = view3(69, 30);
    const dirs = N.map(n => {
      const helper = Math.abs(n[2]) < 0.9 * Math.hypot(...n) ? [0, 0, 1] : [1, 0, 0];
      const u = cross(n, helper), v = cross(n, u);
      const nu = Math.hypot(...u), nv = Math.hypot(...v);
      return [scale(1 / nu, u), scale(1 / nv, v)];
    });
    const h = 1.35, cols3 = [C.teal, C.orange, C.purple];
    const pts = [[0, 0, 0], [2.6, 0, 0], [0, 3.4, 0], [0, 0, 2], [-2.3, 0, 0], [0, -3, 0], [0, 0, -1.8]];
    dirs.forEach(([u, v]) => [[-h, -h], [h, -h], [h, h], [-h, h]].forEach(([a, c]) => pts.push(add(s, add(scale(a, u), scale(c, v))))));
    const L = panel3({x: 30, y: 70, w: 440, h: 320, points: pts, P3, pad: 0.2, title: "row picture: three planes, one point"});
    L.axes([2.6, 3.4, 2], {neg: 0.9});
    dirs.forEach(([u, v], i) => {
      L.patch(s, u, v, [-h, h], [-h, h], {fill: cols3[i], opacity: 0.22, stroke: cols3[i], width: 1.5});
      N.forEach((n, k) => check(close(dot(n, add(s, u)), dot(n, s)) || k !== i, "patch direction lies in its plane"));
    });
    L.drop(s);
    L.point(s, {color: C.ink, r: 6});
    L.tag(s, "(1, 2, −1)", {dx: 12, dy: 18});
    const names = ["2x + y + z = 3", "4x + y = 6", "−2x + 2y + z = 1"];
    names.forEach((nm, i) => L.p.raw(text(40, 360 + i * 20 - 40, "■ " + nm, {color: cols3[i], size: 14})));
    const Q3 = view3(40, 18);
    const path = [[0, 0, 0], cols[0], add(cols[0], scale(2, cols[1])), rhs];
    const qpts = [[0, 0, 0], [5, 0, 0], [0, 7, 0], [0, 0, 3.4], [0, 0, -2.4], ...path, [3, 6, 0], [2, 4, 0]];
    const R = panel3({x: 490, y: 70, w: 380, h: 320, points: qpts, P3: Q3, pad: 0.3, title: "column picture: 1·a₁ + 2·a₂ − 1·a₃ = b"});
    R.axes([5, 7, 3.4]);
    R.arrow(path[0], path[1], {color: C.teal, width: 3});
    R.tag(scale(0.55, path[1]), "a₁ = (2, 4, −2)", {color: C.teal, dx: -70, dy: 20});
    R.arrow(path[1], path[2], {color: C.orange, width: 3});
    R.tag(scale(0.5, add(path[1], path[2])), "+ 2a₂, a₂ = (1, 1, 2)", {color: C.orange, dx: 12, dy: 20});
    R.arrow(path[2], path[3], {color: C.purple, width: 3});
    R.tag(path[3], "− a₃, a₃ = (1, 0, 1)", {color: C.purple, dx: 10, dy: -14});
    R.arrow([0, 0, 0], rhs, {color: C.ink, width: 3, dash: "7 5"});
    R.drop(rhs);
    R.tag(rhs, "b = (3, 6, 1)", {dx: 10, dy: 12});
    return figure({
      id: "la02-planes", w: 900, h: 440,
      title: "A 3×3 system: three planes meet in one point; three columns build b",
      desc: "Left: an oblique view with x, y and z axes of patches of the planes 2x + y + z = 3, 4x + y = 6 and −2x + 2y + z = 1, all passing through (1, 2, −1); a dashed drop line connects that point to the floor z = 0. Right: the tip-to-tail path a1 = (2,4,−2), then plus 2a2 with a2 = (1,1,2), then minus a3 with a3 = (1,0,1), ending at b = (3,6,1).",
      caption: "Pivots 2, −1, −4 are all nonzero, so the planes share exactly one point.",
    }, [L.p.svg(), R.p.svg()]);
  },

  /* §4: the record of the 3×4 elimination. */
  "la02-rref-record"() {
    const M0 = [[1, 2, 1, 3, 4], [2, 4, 4, 10, 10], [1, 2, -1, -1, 2]];
    const addRow = (M, i, j, c) => M.map((r, k) => k === i ? r.map((x, t) => x + c * M[j][t]) : r.slice());
    const M1 = addRow(addRow(M0, 1, 0, -2), 2, 0, -1);
    const M2 = addRow(M1, 2, 1, 1);
    const M3 = addRow(M2.map((r, k) => k === 1 ? r.map(x => x / 2) : r), 0, 1, -1);
    check(same(M3.flat(), [1, 2, 0, 1, 3, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0]), "RREF of the worked example");
    const xp = [3, 0, 1, 0];
    M0.forEach(r => check(close(dot(r.slice(0, 4), xp), r[4]), "particular solution"));
    const opts = {cw: 30, rh: 30, size: 15, bar: 4};
    const a = matrix(20, 120, M0, opts), b = matrix(250, 120, M1, {...opts, box: [[0, 0]]});
    const c = matrix(480, 120, M2, {...opts, box: [[0, 0], [1, 2]]});
    const d = matrix(710, 120, M3, {...opts, box: [[0, 0], [1, 2]], shade: [1, 3]});
    return figure({
      id: "la02-rref", w: 900, h: 330,
      title: "The worked 3×4 elimination, one stage per matrix",
      desc: "Four augmented matrices joined by arrows. From [1 2 1 3 | 4; 2 4 4 10 | 10; 1 2 −1 −1 | 2], the operations R2 − 2R1 and R3 − R1 give [1 2 1 3 | 4; 0 0 2 4 | 2; 0 0 −2 −4 | −2]; R3 + R2 gives a zero third row; halving R2 and R1 − R2 give the RREF [1 2 0 1 | 3; 0 0 1 2 | 1; 0 0 0 0 | 0]. Pivots are boxed and the free columns 2 and 4 are shaded.",
      caption: "Pivots (boxed) in columns 1 and 3; free columns 2 and 4 (shaded). The last row reads 0 = 0, so the system is consistent.",
    }, [heading("Elimination of [A | b] to reduced row echelon form"),
      a.svg, b.svg, c.svg, d.svg,
      ...arrowRight(186, 246, 165, ["R₂ − 2R₁", "R₃ − R₁"]),
      ...arrowRight(416, 476, 165, "R₃ + R₂"),
      ...arrowRight(646, 706, 165, ["½R₂", "R₁ − R₂"]),
      text(100, 250, "[A | b]", {color: C.label, size: 15, anchor: "middle"}),
      text(790, 250, "reduced [A | b]: pivots 1, 3", {color: C.label, size: 15, anchor: "middle"})]);
  },

  /* §5: the three outcomes with the shared line x + 2y = 4. */
  "la02-three-outcomes"() {
    check(close(2 + 2 * 1, 4) && close(3 * 2 - 1, 5), "(2,1) on both lines");
    const box = {xmin: -1, xmax: 5, ymin: -1, ymax: 4};
    const mk = (x, title) => { const p = panel({x, y: 80, w: 270, h: 250, ...box, title}); p.grid(1, {width: 1}).axes(); return p; };
    const base = p => { p.fullLine([4, 0], [-2, 1], {color: C.teal, width: 3}); };
    const A = mk(25, "exactly one solution");
    base(A); A.fullLine([0, -5], [1, 3], {color: C.orange, width: 3});
    A.point([2, 1], {color: C.ink, r: 6}); tag(A, [2, 1], "(2, 1)", {dx: 10, dy: 18});
    tag(A, [3.3, 3.3], "3x − y = 5", {color: C.orange, dx: -110, dy: 0});
    const B = mk(315, "no solution");
    base(B); B.fullLine([2.5, 0], [-2, 1], {color: C.orange, width: 3});
    check(close(2 * 2.5 + 0, 5), "(2.5,0) on 2x + 4y = 5");
    tag(B, [-0.8, 1.05], "2x + 4y = 5", {color: C.orange});
    tag(B, [2.2, 1.8], "parallel: 0 = −3", {color: C.pink});
    const Cp = mk(605, "infinitely many");
    Cp.fullLine([4, 0], [-2, 1], {color: C.orange, width: 7});
    base(Cp);
    tag(Cp, [0, 3.4], "2x + 4y = 8: same line", {color: C.orange});
    Cp.point([4, 0], {color: C.ink, r: 5}); tag(Cp, [4, 0], "(4, 0)", {dx: -20, dy: -12});
    return figure({
      id: "la02-out", w: 900, h: 400,
      title: "Three outcomes for a 2×2 system",
      desc: "Each panel shows the line x + 2y = 4. Left: it crosses 3x − y = 5 at (2, 1). Middle: 2x + 4y = 5 is parallel and never meets it. Right: 2x + 4y = 8 is the same line, drawn thick underneath, so every point such as (4, 0) solves the system.",
      caption: "Teal: x + 2y = 4 in every panel. Orange: the second equation. One point, none, or a whole line.",
    }, [A.svg(), B.svg(), Cp.svg()]);
  },

  /* §6: x + y + z = 3, x + 2y + 3z = 4; solutions (2,1,0) + t(1,−2,1). */
  "la02-solution-set"() {
    const n1 = [1, 1, 1], n2 = [1, 2, 3], xp = [2, 1, 0], s = [1, -2, 1];
    check(close(dot(n1, xp), 3) && close(dot(n2, xp), 4), "particular point");
    check(close(dot(n1, s), 0) && close(dot(n2, s), 0), "null direction");
    const P3 = view3(53, 42);
    const t0 = -1.2, t1 = 1.4;
    const pts = [[0, 0, 0], [3.4, 0, 0], [0, 3.4, 0], [0, 0, 2.6], add(xp, scale(t0, s)), add(xp, scale(t1, s)), scale(t0, s), scale(t1, s)];
    const u1 = cross(n1, s), u2 = cross(n2, s);
    const hu = 1.3;
    [u1, u2].forEach(u => [t0, t1].forEach(t => [-hu, hu].forEach(k => pts.push(add(add(xp, scale(t, s)), scale(k / Math.hypot(...u), u))))));
    const L = panel3({x: 40, y: 70, w: 560, h: 330, points: pts, P3, pad: 0.25});
    /* Draw each plane as a half-strip on its own side of the shared line, so the
       two planes read as an opened book in this view. */
    const side = u => { const ps = P3(s), pu = P3(u); return Math.sign(ps[0] * pu[1] - ps[1] * pu[0]); };
    const w1 = scale(side(u1) / Math.hypot(...u1), u1), w2 = scale(-side(u2) / Math.hypot(...u2), u2);
    check(close(dot(n1, w1), 0) && close(dot(n2, w2), 0), "strip directions lie in their planes");
    L.patch(xp, s, w1, [t0, t1], [0, hu], {fill: C.teal, opacity: 0.22, stroke: C.teal, width: 1.2});
    L.patch(xp, s, w2, [t0, t1], [0, hu], {fill: C.orange, opacity: 0.22, stroke: C.orange, width: 1.2});
    L.axes([3.4, 3.4, 2.6], {neg: 0});
    L.line(scale(t0, s), scale(t1, s), {color: C.purple, width: 3, dash: "8 6"});
    L.line(add(xp, scale(t0, s)), add(xp, scale(t1, s)), {color: C.ink, width: 4});
    L.arrow([0, 0, 0], s, {color: C.purple, width: 3});
    L.tag(s, "s = (1, −2, 1)", {color: C.purple, dx: -10, dy: -12});
    L.arrow([0, 0, 0], xp, {color: C.pink, width: 2.5, dash: "5 4"});
    L.point(xp, {color: C.ink, r: 6});
    L.tag(xp, "xₚ = (2, 1, 0)", {dx: 12, dy: 22});
    L.point([0, 0, 0], {color: C.muted, r: 4});
    L.tag(scale(t0, s), "N(A): the line through 0", {color: C.purple, dx: -30, dy: 24});
    L.tag(add(xp, scale(t1, s)), "solutions: xₚ + N(A)", {color: C.ink, dx: 10, dy: 4});
    const key = [
      text(630, 150, "■ x + y + z = 3", {color: C.teal, size: 15}),
      text(630, 176, "■ x + 2y + 3z = 4", {color: C.orange, size: 15}),
      text(630, 216, "The planes meet in the solid line.", {color: C.label, size: 14}),
      text(630, 240, "It is parallel to the dashed null", {color: C.label, size: 14}),
      text(630, 262, "line and passes through xₚ.", {color: C.label, size: 14}),
      text(630, 300, "Axes are drawn over the planes;", {color: C.muted, size: 14}),
      text(630, 322, "xₚ lies on the floor z = 0.", {color: C.muted, size: 14}),
    ];
    return figure({
      id: "la02-sol", w: 900, h: 440,
      title: "The solution set is a particular point plus the null space",
      desc: "An oblique view with x, y and z axes. Strips of the planes x + y + z = 3 and x + 2y + 3z = 4 meet along a solid line through xp = (2, 1, 0). A dashed line through the origin, spanned by s = (1, −2, 1), is the null space; the solution line is parallel to it.",
      caption: "Same direction, different position: the solution line is the null-space line shifted to pass through xₚ.",
    }, [L.p.svg(), ...key]);
  },

  /* §7: Strang's four-subspace diagram for the worked 3×4 matrix. */
  "la02-four-subspaces"() {
    const A = [[1, 2, 1, 3], [2, 4, 4, 10], [1, 2, -1, -1]];
    const rows = [[1, 2, 0, 1], [0, 0, 1, 2]], nulls = [[-2, 1, 0, 0], [-1, 0, -2, 1]], left = [-3, 1, 1];
    nulls.forEach(v => check(mv(A, v).every(x => close(x, 0)), "null vector"));
    check([0, 1, 2, 3].every(j => close(dot(left, A.map(r => r[j])), 0)), "left null vector");
    rows.forEach(r => nulls.forEach(v => check(close(dot(r, v), 0), "row ⊥ null")));
    check(same(mv(A, rows[0]), [8, 20, 4]), "A times first row-space vector");
    const parts = [heading("The four subspaces of A = [1 2 1 3; 2 4 4 10; 1 2 −1 −1], rank 2")];
    const rect = (x, y, w, h, col, rot) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${col}" fill-opacity="0.16" stroke="${col}" stroke-width="2.5" transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"/>`;
    // input side
    parts.push(text(210, 78, "input space ℝ⁴", {color: C.label, size: 16, anchor: "middle"}));
    parts.push(rect(80, 100, 220, 130, C.teal, -8), rect(90, 250, 220, 130, C.purple, -8));
    parts.push(text(190, 140, "row space C(Aᵀ)", {color: C.teal, size: 16, anchor: "middle", weight: 600}),
      text(190, 164, "dimension r = 2", {color: C.ink, size: 15, anchor: "middle"}),
      text(190, 188, "(1, 2, 0, 1), (0, 0, 1, 2)", {color: C.label, size: 14, anchor: "middle"}));
    parts.push(text(200, 300, "null space N(A)", {color: C.purple, size: 16, anchor: "middle", weight: 600}),
      text(200, 324, "dimension n − r = 2", {color: C.ink, size: 15, anchor: "middle"}),
      text(200, 348, "(−2, 1, 0, 0), (−1, 0, −2, 1)", {color: C.label, size: 14, anchor: "middle"}));
    parts.push(`<path d="M292 226l14 -2l2 14" stroke="${C.muted}" stroke-width="2" fill="none"/>`,
      text(318, 246, "90°", {color: C.muted, size: 13}));
    // output side
    parts.push(text(690, 78, "output space ℝ³", {color: C.label, size: 16, anchor: "middle"}));
    parts.push(rect(590, 100, 220, 130, C.orange, 8), rect(600, 262, 200, 100, C.pink, 8));
    parts.push(text(700, 140, "column space C(A)", {color: C.orange, size: 16, anchor: "middle", weight: 600}),
      text(700, 164, "dimension r = 2", {color: C.ink, size: 15, anchor: "middle"}),
      text(700, 188, "(1, 2, 1), (1, 4, −1)", {color: C.label, size: 14, anchor: "middle"}));
    parts.push(text(700, 300, "left null space N(Aᵀ)", {color: C.pink, size: 16, anchor: "middle", weight: 600}),
      text(700, 324, "dimension m − r = 1", {color: C.ink, size: 15, anchor: "middle"}),
      text(700, 346, "(−3, 1, 1)", {color: C.label, size: 14, anchor: "middle"}));
    parts.push(`<path d="M606 236l-12 -6l-4 13" stroke="${C.muted}" stroke-width="2" fill="none"/>`,
      text(612, 250, "90°", {color: C.muted, size: 13}));
    // arrows
    parts.push(...arrowRight(330, 575, 170, ["xᵣ = (1, 2, 0, 1) ↦ Axᵣ = (8, 20, 4)"], C.teal));
    parts.push(`<path d="M335 318C470 318 520 246 586 246" stroke="${C.purple}" stroke-width="2" fill="none"/>`,
      `<circle cx="594" cy="246" r="6" fill="${C.ink}"/>`,
      text(580, 272, "0 of ℝ³", {color: C.ink, size: 15, anchor: "end"}),
      text(430, 344, "x_null in N(A) ↦ 0", {color: C.purple, size: 14, anchor: "middle"}));
    parts.push(text(200, 405, "2 + 2 = 4 = n", {color: C.label, size: 15, anchor: "middle"}), text(700, 405, "2 + 1 = 3 = m", {color: C.label, size: 15, anchor: "middle"}));
    return figure({
      id: "la02-four", w: 900, h: 450,
      title: "The four fundamental subspaces of the worked 3×4 matrix",
      desc: "Schematic diagram. In R4, the row space (dimension 2, basis (1,2,0,1), (0,0,1,2)) and the null space (dimension 2, basis (−2,1,0,0), (−1,0,−2,1)) meet at a right angle. In R3, the column space (dimension 2, basis (1,2,1), (1,4,−1)) and the left null space (dimension 1, basis (−3,1,1)) meet at a right angle. An arrow sends the row-space vector (1,2,0,1) to A times it, (8,20,4), in the column space; another sends null-space vectors to 0.",
      caption: "A diagram, not to scale: the boxes stand for subspaces, and the right angles come from the dot product.",
    }, parts);
  },

  /* §8: three elementary 2×2 matrices acting on the unit square. */
  "la02-elementary-maps"() {
    const Ps = [[0, 1], [1, 0]], D = [[1, 0], [0, 3]], S = [[1, 0], [-2, 1]];
    check(same(mv(S, [1, 0]), [1, -2]) && same(mv(S, [1, 1]), [1, -1]), "shear corners");
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
    const box = {xmin: -1.2, xmax: 2.2, ymin: -2.4, ymax: 3.4};
    const mk = (x, title, M) => {
      const p = panel({x, y: 90, w: 250, h: 270, ...box, title}); p.grid(1, {width: 1}).axes();
      p.polygon(sq, {fill: C.dim, opacity: 0.15, stroke: C.dim, width: 1.5, dash: "5 4"});
      p.polygon(sq.map(v => mv(M, v)), {fill: C.purple, opacity: 0.3, stroke: C.purple});
      p.arrow([0, 0], mv(M, [1, 0]), {color: C.teal, width: 3});
      p.arrow([0, 0], mv(M, [0, 1]), {color: C.orange, width: 3});
      return p;
    };
    const a = mk(40, "swap R₁ ↔ R₂", Ps);
    tag(a, [0, 1], "e₁ ↦ (0, 1)", {color: C.teal, dx: -40, dy: -14}); tag(a, [1, 0], "e₂ ↦ (1, 0)", {color: C.orange, dx: -30, dy: 26});
    const b = mk(325, "R₂ ← 3R₂", D);
    tag(b, [0, 3], "e₂ ↦ (0, 3)", {color: C.orange, dx: 10, dy: 6}); tag(b, [1, 0], "e₁", {color: C.teal, dx: 6, dy: 22});
    const c = mk(610, "R₂ ← R₂ − 2R₁", S);
    tag(c, [1, -2], "e₁ ↦ (1, −2)", {color: C.teal, dx: -40, dy: 26}); tag(c, [0, 1], "e₂ ↦ (0, 1)", {color: C.orange, dx: 8, dy: -8});
    return figure({
      id: "la02-elem", w: 900, h: 440,
      title: "Elementary matrices as maps of the plane",
      desc: "Three panels, each with the unit square dashed and its image shaded. The swap [[0,1],[1,0]] reflects the square across the line y = x. Scaling row 2 by 3, diag(1,3), stretches it to height 3. Subtracting 2 times row 1 from row 2, [[1,0],[−2,1]], shears it into the parallelogram with corners (0,0), (1,−2), (1,−1) and (0,1).",
      caption: "A reflection, a stretch, a shear: none flattens the square, so each is invertible.",
    }, [a.svg(), b.svg(), c.svg()]);
  },

  /* §9: A → E₂₁A → E₃₁E₂₁A → U, and L collecting the multipliers. */
  "la02-lu-flow"() {
    const A = [[2, 1, 1], [4, 1, 0], [-2, 2, 1]];
    const E21 = [[1, 0, 0], [-2, 1, 0], [0, 0, 1]], E31 = [[1, 0, 0], [0, 1, 0], [1, 0, 1]], E32 = [[1, 0, 0], [0, 1, 0], [0, 3, 1]];
    const A1 = matmul(E21, A), A2 = matmul(E31, A1), U = matmul(E32, A2);
    const L = [[1, 0, 0], [2, 1, 0], [-1, -3, 1]];
    check(same(U.flat(), [2, 1, 1, 0, -1, -2, 0, 0, -4]), "U");
    check(same(matmul(L, U).flat(), A.flat()), "LU = A");
    const o = {cw: 34, rh: 30, size: 16};
    const parts = [heading("Elimination as E₃₂E₃₁E₂₁A = U, and its undoing A = LU")];
    const xs = [30, 250, 470, 690];
    [[A, [], "A"], [A1, [[1, 0]], "E₂₁A"], [A2, [[2, 0]], "E₃₁E₂₁A"], [U, [[2, 1]], "U"]].forEach(([M, hi, nm], k) => {
      const m = matrix(xs[k], 80, M, {...o, hi});
      parts.push(m.svg, text(xs[k] + m.w / 2, 200, nm, {color: C.label, size: 15, anchor: "middle"}));
    });
    parts.push(...arrowRight(154, 246, 125, ["E₂₁: R₂ − 2R₁", "ℓ₂₁ = 2"], C.teal));
    parts.push(...arrowRight(374, 466, 125, ["E₃₁: R₃ + R₁", "ℓ₃₁ = −1"], C.teal));
    parts.push(...arrowRight(594, 686, 125, ["E₃₂: R₃ + 3R₂", "ℓ₃₂ = −3"], C.teal));
    const Lm = matrix(380, 270, L, {...o, hi: [[1, 0], [2, 0], [2, 1]]});
    parts.push(Lm.svg, text(380 + Lm.w / 2, 390, "L: the multipliers in place", {color: C.orange, size: 15, anchor: "middle"}));
    parts.push(`<path d="M745 215C745 300 640 318 540 318" stroke="${C.orange}" stroke-width="2" fill="none"/>`,
      `<path d="M530 318l11 -6v12z" fill="${C.orange}"/>`,
      text(700, 300, "multiply U by L", {color: C.orange, size: 14}));
    parts.push(`<path d="M372 318C200 318 90 290 90 222" stroke="${C.orange}" stroke-width="2" fill="none"/>`,
      `<path d="M90 212l-6 12h12z" fill="${C.orange}"/>`,
      text(150, 300, "…and recover A = LU", {color: C.orange, size: 14}));
    return figure({
      id: "la02-lu", w: 900, h: 440,
      title: "LU factorization records and undoes elimination",
      desc: "Top row: A = [2 1 1; 4 1 0; −2 2 1], then E21 A with the (2,1) entry cleared using multiplier 2, then E31 E21 A with the (3,1) entry cleared using multiplier −1, then U = [2 1 1; 0 −1 −2; 0 0 −4] with the (3,2) entry cleared using multiplier −3. Bottom: L = [1 0 0; 2 1 0; −1 −3 1] holds those multipliers in the positions they cleared, and multiplying U by L gives back A.",
      caption: "Each highlighted entry is the one just cleared. L writes each multiplier where it was used; LU = A.",
    }, parts);
  },

  /* §10: three-digit elimination without pivoting solves the wrong second equation. */
  "la02-unpivoted-rows"() {
    const eps = 1e-4;
    const exact = [1 / (1 - eps), (1 - 2 * eps) / (1 - eps)];
    check(close(eps * exact[0] + exact[1], 1) && close(exact[0] + exact[1], 2), "exact solution on both lines");
    const wrong = [0, 1];
    check(close(eps * wrong[0] + wrong[1], 1), "(0,1) on the first line");
    check(close(2 - (wrong[0] + wrong[1]), 1), "residual 1 in second equation");
    const p = panel({x: 140, y: 70, w: 520, h: 310, xmin: -0.8, xmax: 2.6, ymin: -0.4, ymax: 2.4});
    p.grid(0.5).axes();
    p.fullLine([0, 1], [1, -eps], {color: C.teal, width: 3});
    p.fullLine([0, 2], [1, -1], {color: C.orange, width: 3});
    p.fullLine([0, 0], [0, 1], {color: C.pink, width: 3, dash: "8 6"});
    tag(p, [-0.75, 1.25], "10⁻⁴x + y = 1", {color: C.teal});
    tag(p, [1.55, 0.62], "x + y = 2", {color: C.orange});
    tag(p, [0.05, 2.25], "x = 0: what unpivoted", {color: C.pink});
    tag(p, [0.05, 2.05], "elimination solved", {color: C.pink});
    p.point(exact, {color: C.ink, r: 6});
    tag(p, exact, "true ≈ (1.00, 1.00)", {dx: 12, dy: -14});
    p.point(wrong, {color: C.pink, r: 6});
    tag(p, wrong, "computed (0, 1)", {color: C.pink, dx: -140, dy: 22});
    return figure({
      id: "la02-unpiv", w: 900, h: 440,
      title: "Unpivoted elimination on a three-digit machine",
      desc: "Row picture of 10^−4 x + y = 1, a nearly horizontal line, and x + y = 2. They cross near (1, 1), the true solution to three digits. The dashed vertical line x = 0 is the second equation the unpivoted three-digit elimination effectively solved; it meets the first line at the computed answer (0, 1).",
      caption: "Multiplier 10⁴ swamps the second row; rounding keeps the first equation and replaces the second by x = 0.",
    }, [p.svg(),
      text(680, 150, "without pivoting:", {color: C.label, size: 15}),
      text(680, 174, "ℓ = 10⁴, ρ = 10⁴", {color: C.pink, size: 15}),
      text(680, 214, "with pivoting:", {color: C.label, size: 15}),
      text(680, 238, "ℓ = 10⁻⁴, answer (1.00, 1.00)", {color: C.teal, size: 15})]);
  },
};
