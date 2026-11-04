/* LA10 figures: pseudoinverse and regularization.
   Every drawn point, line and number is computed from the matrices named in the
   lesson text; the checks below throw if a figure drifts from that mathematics. */
import {C, figure, panel, text, mv, add, scale, dot, norm} from "./svgkit.mjs";

const heading = (s, w = 900) => text(w / 2, 44, s, {color: C.label, size: 18, anchor: "middle"});
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const must = (ok, msg) => { if (!ok) throw new Error("la10 figure check failed: " + msg); };

/* The near-collinear fit of the opening, computed rather than copied. */
function collinear() {
  const X = [[1, 1], [2, 2.01], [3, 2.99]];
  const G = [[0, 0], [0, 0]];
  for (const row of X) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) G[i][j] += row[i] * row[j];
  const [a, b, c] = [G[0][0], G[0][1], G[1][1]];
  const disc = Math.sqrt((a + c) ** 2 - 4 * (a * c - b * b));
  const l1 = (a + c + disc) / 2, l2 = (a + c - disc) / 2;
  const unit = v => scale(1 / norm(v), v);
  const v1 = unit([b, l1 - a]), v2 = unit([b, l2 - a]);
  return {X, s1: Math.sqrt(l1), s2: Math.sqrt(l2), v1, v2};
}

/* Ridge solution of the 2×2 normal equations (XᵀX+λI)w = Xᵀy, computed directly. */
function ridge2(X, y, lam) {
  let a = lam, b = 0, d = lam, r0 = 0, r1 = 0;
  X.forEach((row, i) => { a += row[0] * row[0]; b += row[0] * row[1]; d += row[1] * row[1]; r0 += row[0] * y[i]; r1 += row[1] * y[i]; });
  const det = a * d - b * b;
  return [(d * r0 - b * r1) / det, (a * r1 - b * r0) / det];
}

/* The 32-channel problem of §6 and §9, in SVD coordinates. σᵢ = 10^(−8(i−1)/31), true
   coordinates cᵢ = σᵢ^½, and noise drawn once by Python's random.Random(10).gauss(0, 10⁻⁴/√32)
   (scripts/verify/la10), listed here so the figure is reproducible without Python. */
const NOISE32 = [-1.685949e-05, -8.115715e-06, -1.059333e-05, -5.659372e-06, 1.27583e-05, -3.035724e-05, -5.954791e-06, -8.583831e-06,
  -1.562246e-05, -2.040364e-06, 9.12233e-10, 4.368724e-05, 5.336092e-06, -1.15454e-07, 1.533929e-05, -1.850387e-05,
  -1.062425e-05, 9.776973e-06, -8.870725e-06, -1.740028e-05, -1.020904e-05, -2.39465e-05, 2.02651e-05, 2.240592e-05,
  4.639485e-05, -5.147637e-06, -4.026742e-06, -3.475503e-06, 9.478439e-06, 2.415555e-07, 1.399609e-05, -5.439738e-06];
function problem32() {
  const n = 32, sig = [...Array(n)].map((_, i) => 10 ** (-8 * i / (n - 1))), c = sig.map(s => Math.sqrt(s));
  const beta = sig.map((s, i) => s * c[i] + NOISE32[i]), delta = norm(NOISE32), level = 1e-4 / Math.sqrt(n);
  const sq = v => v * v, sum = a => a.reduce((s, v) => s + v, 0);
  const res = l => Math.sqrt(sum(beta.map((b, i) => sq(l / (sig[i] ** 2 + l) * b))));
  const xnorm = l => Math.sqrt(sum(beta.map((b, i) => sq(sig[i] / (sig[i] ** 2 + l) * b))));
  const err = l => Math.sqrt(sum(beta.map((b, i) => sq(sig[i] / (sig[i] ** 2 + l) * b - c[i]))));
  const tsvdErr = k => Math.sqrt(sum(c.map((ci, i) => sq((i < k ? beta[i] / sig[i] : 0) - ci))));
  must(Math.abs(delta - 9.5675e-5) < 1e-8, "noise norm");
  // Generalized cross-validation with the stable denominator m − df(λ) = Σ λ/(σᵢ²+λ), and the
  // noiseless fitted-value error ‖Ax_λ − Ax‖, a prediction-type target.
  const gcv = l => res(l) ** 2 / sum(sig.map(s => l / (s * s + l))) ** 2;
  const fitErr = l => Math.sqrt(sum(beta.map((b, i) => sq(sig[i] ** 2 / (sig[i] ** 2 + l) * b - sig[i] * c[i]))));
  return {n, sig, c, beta, delta, level, res, xnorm, err, tsvdErr, gcv, fitErr};
}

const SUP = {"-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹"};
const pow10 = k => k === 0 ? "1" : k === 1 ? "10" : "10" + [...String(k)].map(ch => SUP[ch]).join("");
const r2 = v => v.toFixed(2);
/* Name the two coordinate axes of an equal-aspect panel at their visible ends. */
const axisNames = (p, [xmax, ymax], xn, yn, xdy = -8) => {
  p.label([xmax, 0], xn, {color: C.label, size: 15, dx: -24, dy: xdy, italic: true});
  p.label([0, ymax], yn, {color: C.label, size: 15, dx: 8, dy: 18, italic: true});
};

/* A rectangular chart with optional log₁₀ axes; ranges of a log axis are given in log₁₀ units.
   Points outside the range are dropped, and a line breaks where it leaves the range. */
function chart({x, y, w, h, xr, yr, xlog = false, ylog = false}) {
  const lx = v => xlog ? Math.log10(v) : v, ly = v => ylog ? Math.log10(v) : v;
  const X = v => x + (lx(v) - xr[0]) / (xr[1] - xr[0]) * w;
  const Y = v => y + h - (ly(v) - yr[0]) / (yr[1] - yr[0]) * h;
  const ok = ([u, v]) => Number.isFinite(lx(u)) && Number.isFinite(ly(v)) &&
    lx(u) >= xr[0] - 1e-9 && lx(u) <= xr[1] + 1e-9 && ly(v) >= yr[0] - 1e-9 && ly(v) <= yr[1] + 1e-9;
  const parts = [];
  const api = {X, Y, parts, ok,
    frame({xticks = [], yticks = [], xfmt = String, yfmt = String, xlabel, ylabel} = {}) {
      for (const t of yticks) parts.push(`<path d="M${x} ${r2(Y(t))}L${x + w} ${r2(Y(t))}" stroke="${C.grid}" stroke-width="1.2"/>`,
        text(x - 10, Y(t) + 5, yfmt(t), {color: C.label, size: 13, anchor: "end"}));
      for (const t of xticks) parts.push(`<path d="M${r2(X(t))} ${y}L${r2(X(t))} ${y + h}" stroke="${C.grid}" stroke-width="1.2"/>`,
        text(X(t), y + h + 22, xfmt(t), {color: C.label, size: 13, anchor: "middle"}));
      parts.push(`<path d="M${x} ${y + h}L${x + w} ${y + h}M${x} ${y}L${x} ${y + h}" stroke="${C.axis}" stroke-width="2"/>`);
      if (xlabel) parts.push(text(x + w / 2, y + h + 46, xlabel, {color: C.label, size: 14, anchor: "middle"}));
      if (ylabel) parts.push(text(x, y - 14, ylabel, {color: C.label, size: 14}));
      return api;
    },
    line(pts, {color = C.orange, width = 3, dash} = {}) {
      let d = "", pen = false;
      for (const p of pts) {
        if (!ok(p)) { pen = false; continue; }
        d += `${pen ? "L" : "M"}${r2(X(p[0]))} ${r2(Y(p[1]))}`; pen = true;
      }
      if (d) parts.push(`<path d="${d}" stroke="${color}" stroke-width="${width}" fill="none"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`);
      return api;
    },
    dots(pts, {color = C.ink, r = 4, ring = false} = {}) {
      for (const p of pts) if (ok(p)) parts.push(ring
        ? `<circle cx="${r2(X(p[0]))}" cy="${r2(Y(p[1]))}" r="${r}" fill="none" stroke="${color}" stroke-width="2.5"/>`
        : `<circle cx="${r2(X(p[0]))}" cy="${r2(Y(p[1]))}" r="${r}" fill="${color}"/>`);
      return api;
    },
    label(p, s, {color = C.ink, size = 14, dx = 0, dy = 0, anchor = "start"} = {}) {
      parts.push(text(X(p[0]) + dx, Y(p[1]) + dy, s, {color, size, anchor})); return api;
    },
    vline(v, {color = C.dim, width = 1.5, dash = "5 5"} = {}) {
      parts.push(`<path d="M${r2(X(v))} ${y}L${r2(X(v))} ${y + h}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}"/>`); return api;
    },
    hline(v, {color = C.dim, width = 1.5, dash = "5 5"} = {}) {
      parts.push(`<path d="M${x} ${r2(Y(v))}L${x + w} ${r2(Y(v))}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}"/>`); return api;
    },
  };
  return api;
}
const logGrid = (lo, hi, perDecade) => [...Array(Math.round((hi - lo) * perDecade) + 1)].map((_, i) => 10 ** (lo + i / perDecade));
const legend = (x, y, rows) => rows.map(([color, label, dash], i) => [
  `<path d="M${x} ${y + 26 * i - 5}L${x + 28} ${y + 26 * i - 5}" stroke="${color}" stroke-width="3.5"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`,
  text(x + 38, y + 26 * i, label, {color, size: 14})]);

export default {
  /* §1: the solution line of x₁+2x₂=5, the row-space line, and the shortest solution. */
  "la10-min-norm-line"() {
    const a = [1, 2], bval = 5, xdag = scale(bval / dot(a, a), a), free0 = [5, 0], d = [2, -1];
    must(near(dot(a, xdag), bval) && near(dot(a, free0), bval) && near(dot(a, d), 0), "solution line");
    const p = panel({x: 60, y: 70, w: 560, h: 300, xmin: -1.5, xmax: 6, ymin: -1.2, ymax: 3.4});
    p.grid(1).axes();
    axisNames(p, [6, 3.4], "x₁", "x₂");
    p.fullLine([0, 0], a, {color: C.dim, width: 2, dash: "7 6"});
    // Only the arc inside the panel (curves are not clipped): from y = −1.2 on the right to x = −1.5 on the left.
    const R5 = Math.sqrt(5), t0 = Math.asin(-1.2 / R5);
    p.curve(t => [R5 * Math.cos(t), R5 * Math.sin(t)], t0, Math.acos(-1.5 / R5), {color: C.purple, width: 2, dash: "4 5"});
    p.fullLine(xdag, d, {color: C.teal, width: 3.5});
    p.rightAngle(xdag, d, scale(-1, a), {size: 0.28});
    p.arrow(xdag, add(xdag, d), {color: C.orange, width: 3, head: 11});
    p.point(xdag, {color: C.teal, r: 7});
    p.point(free0, {color: C.pink, r: 7});
    p.label(xdag, "(1, 2)", {color: C.teal, dx: -70, dy: 8, size: 17});
    p.label(free0, "(5, 0)", {color: C.pink, dx: -18, dy: 28, size: 17});
    p.label(add(xdag, d), "move by (2, −1)", {color: C.orange, dx: 10, dy: -10, size: 15});
    p.label([2.9, 2.9], "dashed: row space, multiples of (1, 2)", {color: C.muted, size: 14});
    p.label([3.4, 0.62], "x₁ + 2x₂ = 5", {color: C.teal, size: 15});
    return figure({
      id: "la10-line", w: 900, h: 430,
      title: "The shortest solution of x1 + 2x2 = 5",
      desc: "The solution line of x1 + 2x2 = 5 is drawn with the row-space line through the origin in direction (1, 2). They meet at right angles at (1, 2), which is also where the smallest circle about the origin touches the solution line. The solution (5, 0), with the free variable set to zero, lies farther out on the same line. Moving along (2, −1) stays on the line.",
      caption: "Moving along (2, −1) never changes x₁ + 2x₂; the circle of radius √5 touches the line only at (1, 2).",
    }, [heading("Which solution is shortest?"), p.svg(),
      text(650, 150, "Every solution:", {color: C.label, size: 15}),
      text(650, 176, "(1, 2) + t(2, −1)", {color: C.teal, size: 16}),
      text(650, 222, "Squared length:", {color: C.label, size: 15}),
      text(650, 248, "5 + 5t²", {color: C.ink, size: 16}),
      text(650, 294, "t = 0 → (1, 2), length² 5", {color: C.teal, size: 15}),
      text(650, 320, "t = 2 → (5, 0), length² 25", {color: C.pink, size: 15})]);
  },

  /* §2: project in observation space, then take the shortest representative in parameter space. */
  "la10-project-then-shorten"() {
    const col = [1, 2], y = [1, 0], yhat = scale(dot(col, y) / dot(col, col), col), r = [y[0] - yhat[0], y[1] - yhat[1]];
    must(near(yhat[0], 0.2) && near(yhat[1], 0.4) && near(dot(r, col), 0), "projection");
    const s = yhat[0]; // every minimizer has w₁ + w₂ = 1/5
    const wdag = [s / 2, s / 2], wfree = [s, 0];
    must(near(wdag[0] + wdag[1], s) && near(wfree[0] + wfree[1], s), "minimizer line");
    const L = panel({x: 50, y: 86, w: 380, h: 270, xmin: -0.35, xmax: 1.25, ymin: -0.35, ymax: 0.9, title: "Observations: project y onto range(A)"});
    L.grid(0.25).axes();
    axisNames(L, [1.25, 0.9], "y₁", "y₂");
    L.fullLine([0, 0], col, {color: C.blue, width: 3});
    L.label([0.36, 0.86], "range(A): multiples of (1, 2)", {color: C.blue, size: 14});
    L.arrow([0, 0], y, {color: C.ink, width: 3, label: "y = (1, 0)", at: 1, dx: -30, dy: 24, size: 15});
    L.line(y, yhat, {color: C.pink, width: 2.5, dash: "6 5"});
    L.rightAngle(yhat, r, scale(-1, col), {size: 0.07});
    L.point(yhat, {color: C.teal, r: 6, label: "ŷ = (1/5, 2/5)", dx: -116, dy: -6, size: 15});
    L.label([0.62, 0.23], "residual", {color: C.pink, size: 14});
    const R = panel({x: 470, y: 86, w: 380, h: 270, xmin: -0.14, xmax: 0.34, ymin: -0.1, ymax: 0.275, title: "Parameters: shortest w with Aw = ŷ"});
    R.grid(0.05).axes();
    axisNames(R, [0.34, 0.235], "w₁", "w₂");
    R.fullLine([0, 0], [1, 1], {color: C.dim, width: 2, dash: "7 6"});
    R.fullLine(wfree, [1, -1], {color: C.teal, width: 3.5});
    R.rightAngle(wdag, [1, -1], [-1, -1], {size: 0.022});
    R.point(wdag, {color: C.teal, r: 6, label: "w† = (1/10, 1/10)", dx: -150, dy: -6, size: 15});
    R.point(wfree, {color: C.pink, r: 6, label: "(1/5, 0)", dx: 8, dy: 22, size: 15});
    R.label([-0.12, 0.255], "row space: multiples of (1, 1)", {color: C.muted, size: 13});
    R.label([0.165, 0.11], "w₁ + w₂ = 1/5", {color: C.teal, size: 14});
    return figure({
      id: "la10-two", w: 900, h: 430,
      title: "Least squares, then minimum norm",
      desc: "Left: in observation space, y = (1, 0) is projected onto the line of multiples of (1, 2), giving (1/5, 2/5) and a perpendicular residual. Right: in parameter space, every w with w1 + w2 = 1/5 produces that projection; the shortest one, (1/10, 1/10), is where the row-space line of multiples of (1, 1) crosses at right angles. The point (1/5, 0) obtained by setting w2 to zero is also marked.",
      caption: "A = [[1, 1], [2, 2]]. The right panel is drawn at three and a third times the left panel's scale.",
    }, [L.svg(), R.svg()]);
  },

  /* §3: the four-subspace map for the rational 3×3 example, labelled with its actual vectors. */
  "la10-pinv-channels"() {
    const U = [[1, 2, 2], [2, 1, -2], [2, -2, 1]].map(r => r.map(v => v / 3));
    const V = [[2, -1, 2], [2, 2, -1], [-1, 2, 2]].map(r => r.map(v => v / 3));
    const sig = [6, 3, 0], col = (M, j) => M.map(r => r[j]);
    const A = U.map((_, i) => V.map((__, j) => sig.reduce((s, sk, k) => s + U[i][k] * sk * V[j][k], 0)));
    for (let k = 0; k < 3; k++) {
      const Av = mv(A, col(V, k));
      must(Av.every((x, i) => near(x, sig[k] * U[i][k], 1e-12)), "A v_k = σ_k u_k");
    }
    const box = (x, y, w, h, fill, label, sub) => [
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" fill-opacity="0.16" stroke="${fill}" stroke-width="2.5"/>`,
      text(x + w / 2, y + 30, label, {color: fill, size: 17, anchor: "middle", weight: 600}),
      ...sub.map((s, i) => text(x + w / 2, y + 58 + 24 * i, s, {color: C.ink, size: 15, anchor: "middle"}))];
    const arrow = (x0, y0, x1, y1, color, dash) => {
      const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, bx = x1 - 13 * ux, by = y1 - 13 * uy;
      return [`<path d="M${x0} ${y0}L${bx} ${by}" stroke="${color}" stroke-width="3.5"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`,
        `<path d="M${x1} ${y1}L${bx - 6 * uy} ${by + 6 * ux}L${bx + 6 * uy} ${by - 6 * ux}Z" fill="${color}"/>`];
    };
    return figure({
      id: "la10-map", w: 900, h: 470,
      title: "What A and its pseudoinverse do to the four subspaces",
      desc: "Input space on the left splits into the row space, spanned by v1 = (2, 2, −1)/3 and v2 = (−1, 2, 2)/3, and the kernel, spanned by v3 = (2, −1, 2)/3. Output space on the right splits into the range, spanned by u1 = (1, 2, 2)/3 and u2 = (2, 1, −2)/3, and the left kernel, spanned by u3 = (2, −2, 1)/3. A sends v1 to 6u1, v2 to 3u2 and v3 to zero. The pseudoinverse sends u1 back to v1/6, u2 to v2/3 and u3 to zero.",
      caption: "Drawn for the 3×3 example with σ = (6, 3, 0). Each arrow carries one channel; the dashed arrows end at zero.",
    }, [heading("A⁺ reverses each channel A uses, and ignores the rest"),
      text(185, 82, "input space ℝ³", {color: C.label, size: 15, anchor: "middle"}),
      text(715, 82, "output space ℝ³", {color: C.label, size: 15, anchor: "middle"}),
      box(60, 96, 250, 136, C.teal, "row(A)", ["v₁ = (2, 2, −1)/3", "v₂ = (−1, 2, 2)/3"]),
      box(60, 268, 250, 112, C.dim, "ker(A)", ["v₃ = (2, −1, 2)/3"]),
      box(590, 96, 250, 136, C.blue, "range(A)", ["u₁ = (1, 2, 2)/3", "u₂ = (2, 1, −2)/3"]),
      box(590, 268, 250, 112, C.dim, "ker(Aᵀ)", ["u₃ = (2, −2, 1)/3"]),
      arrow(316, 136, 584, 136, C.orange), text(450, 124, "A:  v₁ ↦ 6u₁,  v₂ ↦ 3u₂", {color: C.orange, size: 15, anchor: "middle"}),
      arrow(584, 196, 316, 196, C.purple), text(450, 222, "A⁺:  u₁ ↦ v₁/6,  u₂ ↦ v₂/3", {color: C.purple, size: 15, anchor: "middle"}),
      `<circle cx="450" cy="324" r="20" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`, text(450, 330, "0", {color: C.ink, size: 18, anchor: "middle"}),
      arrow(316, 324, 426, 324, C.orange, "7 6"), text(370, 312, "A", {color: C.orange, size: 15, anchor: "middle"}),
      arrow(584, 324, 474, 324, C.purple, "7 6"), text(530, 312, "A⁺", {color: C.purple, size: 15, anchor: "middle"})]);
  },

  /* §4: two inverses that both solve least squares; only the symmetric A⁺A drops perpendicularly. */
  "la10-oblique-vs-orthogonal"() {
    const w = [0.5, 0.9];
    const orth = scale((w[0] + w[1]) / 2, [1, 1]);   // A⁺A w: projector onto row(A)=span(1,1)
    const obl = [w[0] + w[1], 0];                     // G A w with G=[[1/5,2/5],[0,0]]: GA=[[1,1],[0,0]]
    const A = [[1, 1], [2, 2]];
    must(mv(A, orth).every((x, i) => near(x, mv(A, w)[i])) && mv(A, obl).every((x, i) => near(x, mv(A, w)[i])), "same fit");
    must(near(dot([orth[0] - w[0], orth[1] - w[1]], [1, 1]), 0), "orthogonal drop");
    const p = panel({x: 60, y: 70, w: 560, h: 310, xmin: -0.3, xmax: 1.75, ymin: -0.3, ymax: 1.25});
    p.grid(0.25).axes();
    axisNames(p, [1.75, 0.35], "w₁", "w₂", 20);
    p.fullLine([0, 0], [1, 1], {color: C.teal, width: 3});
    p.fullLine(w, [1, -1], {color: C.dim, width: 2, dash: "7 6"});
    p.arrow(w, orth, {color: C.teal, width: 3, head: 11});
    p.arrow(w, obl, {color: C.pink, width: 3, head: 11});
    p.rightAngle(orth, [1, -1], [-1, -1], {size: 0.07});
    p.point(w, {color: C.ink, r: 6, label: "w = (0.5, 0.9)", dx: -122, dy: -8, size: 15});
    p.point(orth, {color: C.teal, r: 6, label: "A⁺Aw = (0.7, 0.7)", dx: -150, dy: 26, size: 15});
    p.point(obl, {color: C.pink, r: 6, label: "GAw = (1.4, 0)", dx: 12, dy: -14, size: 15});
    p.label([1.12, 0.98], "row(A)", {color: C.teal, size: 15});
    p.label([-0.27, 1.17], "dashed: w + ker(A), same Aw", {color: C.muted, size: 14});
    return figure({
      id: "la10-obl", w: 900, h: 450,
      title: "An oblique inverse and the pseudoinverse",
      desc: "For A = [[1, 1], [2, 2]], the point w = (0.5, 0.9) and every point on the dashed line through it in direction (1, −1) give the same Aw. The pseudoinverse product A+A moves w perpendicularly onto the row-space line to (0.7, 0.7). The free-variable-zero inverse G = [[1/5, 2/5], [0, 0]] gives GA w = (1.4, 0), reached by moving along the same dashed line but not perpendicularly to the row space.",
      caption: "Both moves stay on the dashed line, so neither changes Aw. Only A⁺A is symmetric, and only it lands on the shortest point.",
    }, [heading("Same fit, different representative"), p.svg(),
      text(650, 150, "A⁺A = ½[[1, 1], [1, 1]]", {color: C.teal, size: 15}),
      text(650, 174, "symmetric: perpendicular drop", {color: C.teal, size: 14}),
      text(650, 220, "GA = [[1, 1], [0, 0]]", {color: C.pink, size: 15}),
      text(650, 244, "not symmetric: slanted drop", {color: C.pink, size: 14}),
      text(650, 300, "length 0.99 vs 1.40", {color: C.ink, size: 15})]);
  },

  /* §5.1: the coefficient jump of the opening, read in the right-singular directions. */
  "la10-coefficient-jump"() {
    const {s1, s2, v1, v2} = collinear();
    must(near(s1, 5.28962, 1e-5) && near(s2, 0.0098233, 1e-6), "singular values");
    const wstar = [1, 1], w = [-3, 5], w2 = [-4, 6];
    // w = w* + c v₂ for c ≈ −5.66: confirm the data's extra part lies (almost) along v₂.
    const dw = [w[0] - wstar[0], w[1] - wstar[1]], along = dot(dw, v2);
    must(norm(add(dw, scale(-along, v2))) < 0.02, "w − w* is along v2");
    const p = panel({x: 60, y: 70, w: 560, h: 320, xmin: -5.2, xmax: 2.4, ymin: -0.6, ymax: 7});
    p.grid(1).axes();
    axisNames(p, [2.4, 7], "w₁", "w₂", 20);
    p.fullLine([0, 0], v1, {color: C.blue, width: 2, dash: "7 6"});
    p.fullLine(wstar, v2, {color: C.dim, width: 2, dash: "4 5"});
    p.arrow(wstar, w, {color: C.orange, width: 3, head: 12});
    p.arrow(w, w2, {color: C.pink, width: 3.5, head: 11});
    p.point(wstar, {color: C.teal, r: 7, label: "(1, 1)", dx: 12, dy: 6, size: 16});
    p.point(w, {color: C.orange, r: 6, label: "(−3, 5)", dx: 12, dy: 6, size: 16});
    p.point(w2, {color: C.pink, r: 6, label: "(−4, 6)", dx: 12, dy: 4, size: 16});
    return figure({
      id: "la10-jump", w: 900, h: 450,
      title: "The coefficient jump lies along the weak direction",
      desc: "Coefficient space for the near-collinear fit. The coefficients (1, 1) generate X(1, 1) = (2, 4.01, 5.99). The fitted coefficients (−3, 5) differ from (1, 1) by about −5.66 times v2, the weak right-singular direction (0.707, −0.707). Moving two observations by 0.01 moves the fit again along v2, to (−4, 6).",
      caption: `σ₁ ≈ ${s1.toFixed(3)} and σ₂ ≈ ${s2.toFixed(4)}: whatever reaches the weak channel is divided by σ₂.`,
    }, [heading("Where the coefficients move"), p.svg(),
      text(650, 150, "(1, 1) → (−3, 5):", {color: C.orange, size: 15}),
      text(650, 174, "data part: −0.0556 along u₂", {color: C.ink, size: 14}),
      text(650, 198, "÷ σ₂ → −5.66 along v₂", {color: C.ink, size: 14}),
      text(650, 244, "(−3, 5) → (−4, 6):", {color: C.pink, size: 15}),
      text(650, 268, "change: −0.0139 along u₂", {color: C.ink, size: 14}),
      text(650, 292, "÷ σ₂ → −1.41 along v₂", {color: C.ink, size: 14}),
      text(650, 338, "blue dashed: v₁ ≈ (0.707, 0.707)", {color: C.blue, size: 13}),
      text(650, 360, "grey dashed: v₂ ≈ (0.707, −0.707)", {color: C.muted, size: 13}),
      text(650, 380, "through (1, 1)", {color: C.muted, size: 13})]);
  },

  /* §5.2: ‖A(ε)⁺‖₂ for A(ε)=[[1,1],[1,1+ε]] blows up like 2/|ε| and then drops to 1/2 at ε=0. */
  "la10-pinv-jump"() {
    const pinvNorm = e => {
      const G = [[2, 2 + e], [2 + e, 1 + (1 + e) ** 2]], t = G[0][0] + G[1][1], d = G[0][0] * G[1][1] - G[0][1] ** 2;
      const lmin = (t - Math.sqrt(t * t - 4 * d)) / 2;
      return lmin > 1e-15 ? 1 / Math.sqrt(lmin) : 1 / Math.sqrt(t); // rank one at ε=0: A⁺ has norm 1/σ₁
    };
    must(near(pinvNorm(0), 0.5), "rank-one value");
    must(Math.abs(pinvNorm(0.01) * 0.01 / 2 - 1) < 0.01, "2/ε growth");
    const W = 900, H = 450, x0 = 120, x1 = 640, y0 = 90, y1 = 370, emax = 0.5, lmin = -1, lmax = 3;
    const X = e => x0 + (e + emax) / (2 * emax) * (x1 - x0), Y = v => y1 - (Math.log10(v) - lmin) / (lmax - lmin) * (y1 - y0);
    const parts = [heading("The pseudoinverse jumps when the rank changes", W)];
    for (let k = lmin; k <= lmax; k++) {
      parts.push(`<path d="M${x0} ${Y(10 ** k)}L${x1} ${Y(10 ** k)}" stroke="${C.grid}" stroke-width="1.5"/>`);
      parts.push(text(x0 - 12, Y(10 ** k) + 5, {"-1": "10⁻¹", 0: "1", 1: "10", 2: "10²", 3: "10³"}[k], {color: C.label, size: 14, anchor: "end"}));
    }
    for (const e of [-0.5, -0.25, 0, 0.25, 0.5]) parts.push(text(X(e), y1 + 26, e.toString().replace("-", "−"), {color: C.label, size: 14, anchor: "middle"}));
    parts.push(`<path d="M${x0} ${y1}L${x1} ${y1}M${x0} ${y0}L${x0} ${y1}" stroke="${C.axis}" stroke-width="2"/>`);
    const branch = (a, b) => {
      const pts = [];
      for (let i = 0; i <= 300; i++) {
        const e = a + (b - a) * i / 300, v = pinvNorm(e);
        if (v <= 10 ** lmax) pts.push(`${X(e).toFixed(2)} ${Y(v).toFixed(2)}`);
      }
      return `<path d="M${pts.join("L")}" stroke="${C.orange}" stroke-width="3.5" fill="none"/>`;
    };
    parts.push(branch(-emax, -0.0005), branch(0.0005, emax));
    parts.push(`<path d="M${X(0)} ${y0}L${X(0)} ${y1}" stroke="${C.dim}" stroke-width="1.5" stroke-dasharray="5 5"/>`);
    parts.push(`<circle cx="${X(0)}" cy="${Y(0.5)}" r="7" fill="${C.teal}"/>`);
    parts.push(text(X(0) + 14, Y(0.5) + 5, "ε = 0: rank 1, ‖A⁺‖₂ = 1/2", {color: C.teal, size: 15}));
    parts.push(text(X(0.12), Y(400), "‖A(ε)⁺‖₂ ≈ 2/|ε|", {color: C.orange, size: 15}));
    for (const e of [-1, 1]) { const xe = X(e * 2 / 1000); parts.push(`<path d="M${xe} ${y0 + 22}L${xe} ${y0 - 2}M${xe - 6} ${y0 + 8}L${xe} ${y0 - 2}L${xe + 6} ${y0 + 8}" stroke="${C.orange}" stroke-width="2.5" fill="none"/>`); }
    parts.push(text(X(0) - 14, y0 - 10, "unbounded as ε → 0", {color: C.orange, size: 14, anchor: "end"}));
    parts.push(text((x0 + x1) / 2, y1 + 52, "ε", {color: C.label, size: 16, anchor: "middle", italic: true}));
    parts.push(text(670, 160, "A(ε) = [[1, 1], [1, 1 + ε]]", {color: C.ink, size: 15}),
      text(670, 196, "ε = 0.1:  ‖A⁺‖₂ ≈ 20.5", {color: C.orange, size: 14}),
      text(670, 220, "ε = 0.01: ‖A⁺‖₂ ≈ 200.5", {color: C.orange, size: 14}),
      text(670, 244, "ε = 0:    ‖A⁺‖₂ = 0.5", {color: C.teal, size: 14}));
    must(Math.abs(pinvNorm(0.1) - 20.51) < 0.01 && Math.abs(pinvNorm(0.01) - 200.50) < 0.01, "sidebar values");
    return figure({
      id: "la10-pjump", w: W, h: H,
      title: "The pseudoinverse is discontinuous at a rank change",
      desc: "The 2-norm of the pseudoinverse of A(epsilon) = [[1, 1], [1, 1 + epsilon]] is plotted on a logarithmic axis against epsilon from −0.5 to 0.5. It grows like 2 over the absolute value of epsilon as epsilon approaches zero, about 20.5 at epsilon 0.1 and 200.5 at 0.01, but at epsilon = 0 the matrix has rank one and the norm is exactly 1/2.",
    }, parts);
  },
  /* §6: Picard plot of the 32-channel problem beside the truncated-SVD error for every cutoff. */
  "la10-picard"() {
    const P = problem32(), idx = [...Array(P.n)].map((_, i) => i + 1);
    const firstBelow = P.sig.findIndex(s => s ** 1.5 < P.level);
    must(firstBelow === 13, "exact coefficients reach the noise level at channel 14");
    const errs = [...Array(P.n + 1)].map((_, k) => P.tsvdErr(k));
    const kbest = errs.indexOf(Math.min(...errs));
    must(kbest === 14 && Math.abs(errs[14] - 0.0387) < 5e-4 && Math.abs(errs[32] - 962) < 1, "best cutoff k = 14");
    const L = chart({x: 80, y: 96, w: 360, h: 270, xr: [0.5, 32.5], yr: [-9, 3], ylog: true});
    L.frame({xticks: [1, 8, 16, 24, 32], yticks: [-9, -6, -3, 0, 3].map(k => 10 ** k), yfmt: t => pow10(Math.round(Math.log10(t))),
      xlabel: "channel i", ylabel: "size (log scale)"});
    L.hline(P.level, {color: C.muted, dash: "6 5"});
    L.vline(14.5, {color: C.teal, dash: "3 5"});
    L.line(idx.map(i => [i, P.sig[i - 1]]), {color: C.blue, width: 2.5}).dots(idx.map(i => [i, P.sig[i - 1]]), {color: C.blue, r: 3});
    L.dots(idx.map(i => [i, Math.abs(P.beta[i - 1])]), {color: C.orange, r: 4});
    L.dots(idx.map(i => [i, Math.abs(P.beta[i - 1]) / P.sig[i - 1]]), {color: C.pink, r: 4, ring: true});
    L.label([1, P.level], "noise level per channel", {color: C.muted, size: 13, dx: 4, dy: 18});
    const R = chart({x: 540, y: 96, w: 320, h: 270, xr: [0, 32], yr: [-2, 3], ylog: true});
    R.frame({xticks: [0, 8, 16, 24, 32], yticks: [-2, -1, 0, 1, 2, 3].map(k => 10 ** k), yfmt: t => pow10(Math.round(Math.log10(t))),
      xlabel: "channels kept, k", ylabel: "error ‖x_k − x‖ (log scale)"});
    R.line(errs.map((e, k) => [k, e]), {color: C.purple, width: 2.5}).dots(errs.map((e, k) => [k, e]), {color: C.purple, r: 3});
    R.dots([[14, errs[14]]], {color: C.teal, r: 8, ring: true});
    R.label([14, errs[14]], "k = 14: error 0.039", {color: C.teal, dx: 12, dy: 22});
    return figure({
      id: "la10-picard", w: 900, h: 520,
      title: "Picard plot and truncation error for a 32-channel problem",
      desc: "Left: on a logarithmic axis against channel number, the singular values fall steadily from 1 to 10 to the minus 8. The observed coefficients u_i transpose b fall faster at first, then level off near the noise level of about 1.8 times 10 to the minus 5 from channel 15 on. Their ratios to the singular values first decrease and then grow to several hundred. Right: the error of the truncated-SVD solution against the number of channels kept falls to its minimum 0.039 at k = 14 and then grows to about 960 when all 32 channels are kept.",
      caption: "Once |uᵢᵀb| stops falling with σᵢ, it is mostly noise, and dividing it by σᵢ only adds error.",
    }, [heading("Where the data stop carrying signal"), L.parts, R.parts,
      ...legend(90, 440, [[C.blue, "σᵢ"], [C.orange, "|uᵢᵀb|, observed (dots)"]]),
      ...legend(400, 440, [[C.pink, "|uᵢᵀb| / σᵢ (rings)"], [C.teal, "plateau begins / best k", "3 5"]])]);
  },

  /* §7 and §10: three filters on the same singular-value axis. */
  "la10-filter-factors"() {
    const tau = 1e-2, lam = 1e-4, eta = 1;
    const ridge = s => s * s / (s * s + lam), gd = t => s => 1 - (1 - eta * s * s) ** t;
    must(near(ridge(1e-2), 0.5) && Math.abs(gd(1e4)(1e-2) - (1 - Math.exp(-1))) < 1e-4, "filter values at σ = 10⁻²");
    must(eta <= 1, "η ≤ 1/σ₁² with σ₁ = 1");
    const S = logGrid(-4, 0, 60);
    const F = chart({x: 80, y: 96, w: 500, h: 290, xr: [-4, 0], yr: [0, 1.05], xlog: true});
    F.frame({xticks: [-4, -3, -2, -1, 0].map(k => 10 ** k), xfmt: t => pow10(Math.round(Math.log10(t))), yticks: [0, 0.5, 1],
      xlabel: "singular value σ (log scale)", ylabel: "filter factor f(σ)"});
    F.line([[1e-4, 0], [tau, 0], [tau, 1], [1, 1]], {color: C.teal, width: 3.5});
    for (const t of [1e2, 1e6]) F.line(S.map(s => [s, gd(t)(s)]), {color: C.purple, width: 2, dash: "2 6"});
    F.line(S.map(s => [s, gd(1e4)(s)]), {color: C.purple, width: 3, dash: "8 5"});
    F.line(S.map(s => [s, ridge(s)]), {color: C.orange, width: 3.5});
    F.dots([[1e-2, 0.5]], {color: C.orange, r: 6});
    F.label([1e-2, 0.5], "σ = √λ: f = 1/2", {color: C.orange, dx: 12, dy: 18});
    F.label([1e-3, 0.62], "t = 10⁶", {color: C.purple, size: 13, dx: -64});
    F.label([0.1, 0.62], "t = 10²", {color: C.purple, size: 13, dx: 10});
    return figure({
      id: "la10-filt", w: 900, h: 480,
      title: "Filter factors of truncation, ridge and gradient descent",
      desc: "Filter factor against singular value on a logarithmic axis from 10 to the minus 4 to 1. Truncation at tolerance 0.01 is a step from 0 to 1 at sigma = 0.01. Ridge with lambda = 10 to the minus 4 rises smoothly as sigma squared over sigma squared plus lambda, passing 1/2 at sigma = 0.01. Gradient descent with step 1 after t steps follows 1 minus (1 minus sigma squared) to the power t; at t = 10 to the 4 it is close to the ridge curve, and at t = 10 squared and 10 to the 6 its transition sits at larger and smaller sigma.",
      caption: "Channel i contributes fᵢ · uᵢᵀb/σᵢ along vᵢ. Strong channels pass (f ≈ 1); weak ones are cut or damped.",
    }, [heading("Three ways to treat weak channels"), F.parts,
      ...legend(620, 150, [[C.teal, "truncation, τ = 10⁻²"], [C.orange, "ridge, λ = 10⁻⁴"], [C.purple, "gradient descent, η = 1,", "8 5"]]),
      text(658, 224, "t = 10⁴ steps (dotted: 10², 10⁶)", {color: C.purple, size: 14}),
      text(620, 280, "ridge: f = σ²/(σ² + λ)", {color: C.ink, size: 14}),
      text(620, 306, "GD: f = 1 − (1 − ησ²)ᵗ", {color: C.ink, size: 14}),
      text(620, 332, "t ≈ 1/(ηλ) puts both near σ ≈ √λ", {color: C.muted, size: 13})]);
  },

  /* §9: ridge coefficient paths for the opening fit and its 0.01-perturbed twin. */
  "la10-ridge-paths"() {
    const {X} = collinear(), y1 = [2, 4.05, 5.95], y2 = [2, 4.06, 5.94];
    const w0 = ridge2(X, y1, 0), w0b = ridge2(X, y2, 0), w01 = ridge2(X, y1, 0.01), w01b = ridge2(X, y2, 0.01);
    must(near(w0[0], -3, 1e-6) && near(w0[1], 5, 1e-6) && near(w0b[0], -4, 1e-6) && near(w0b[1], 6, 1e-6), "λ = 0 fits");
    must(Math.abs(w01[0] - 0.960) < 1e-3 && Math.abs(w01[1] - 1.036) < 1e-3 && Math.abs(w01b[0] - 0.950) < 1e-3 && Math.abs(w01b[1] - 1.045) < 1e-3, "λ = 0.01 fits");
    const L = logGrid(-7, 2, 40);
    const F = chart({x: 80, y: 96, w: 500, h: 290, xr: [-7, 2], yr: [-5, 7], xlog: true});
    F.frame({xticks: [-7, -5, -3, -1, 1].map(k => 10 ** k), xfmt: t => pow10(Math.round(Math.log10(t))), yticks: [-4, -2, 0, 2, 4, 6],
      xlabel: "ridge parameter λ (log scale)", ylabel: "coefficient value"});
    F.hline(1, {color: C.muted, dash: "6 5"}).vline(0.01, {color: C.dim});
    F.line(L.map(l => [l, ridge2(X, y1, l)[0]]), {color: C.teal}).line(L.map(l => [l, ridge2(X, y1, l)[1]]), {color: C.orange});
    F.line(L.map(l => [l, ridge2(X, y2, l)[0]]), {color: C.teal, dash: "7 5"}).line(L.map(l => [l, ridge2(X, y2, l)[1]]), {color: C.orange, dash: "7 5"});
    F.label([0.01, 6.2], "λ = 0.01", {color: C.label, size: 13, dx: 6});
    F.label([1e-7, 1], "w* = (1, 1)", {color: C.muted, size: 13, dx: 6, dy: -8});
    return figure({
      id: "la10-paths", w: 900, h: 480,
      title: "Ridge coefficient paths for the near-collinear fit",
      desc: "The two ridge coefficients plotted against lambda on a logarithmic axis from 10 to the minus 7 to 100, for the data y = (2, 4.05, 5.95), solid, and y = (2, 4.06, 5.94), dashed. At small lambda the coefficients approach the least-squares values (−3, 5) and (−4, 6), and the solid and dashed paths are far apart. From about lambda = 10 to the minus 3 the paths merge near (1, 1); at lambda = 0.01 they are (0.960, 1.036) and (0.950, 1.045). For large lambda both coefficients shrink towards zero.",
      caption: "Solid: y = (2, 4.05, 5.95). Dashed: y = (2, 4.06, 5.94). The two data sets disagree only through the weak channel.",
    }, [heading("Damping pulls both fits onto the strong channel"), F.parts,
      ...legend(620, 150, [[C.teal, "w₁"], [C.orange, "w₂"]]),
      text(620, 220, "λ → 0: (−3, 5) and (−4, 6)", {color: C.ink, size: 14}),
      text(620, 246, `λ = 0.01: (${w01[0].toFixed(3)}, ${w01[1].toFixed(3)})`, {color: C.ink, size: 14}),
      text(682, 270, `and (${w01b[0].toFixed(3)}, ${w01b[1].toFixed(3)})`, {color: C.ink, size: 14}),
      text(620, 316, "large λ: both shrink to 0", {color: C.muted, size: 14})]);
  },

  /* §9: the L-curve of the 32-channel problem, and what each choice of λ actually costs. */
  "la10-l-curve"() {
    const P = problem32(), grid = logGrid(-18, 0, 10);
    // Maximum discrete curvature of (log residual, log norm), as in scripts/verify/la10.
    const pts = grid.map(l => [Math.log10(P.res(l)), Math.log10(P.xnorm(l))]);
    let corner = null;
    for (let i = 2; i < grid.length - 2; i++) {
      const [x0, y0] = pts[i - 2], [x1, y1] = pts[i], [x2, y2] = pts[i + 2];
      const k = ((x1 - x0) * (y2 - y1) - (y1 - y0) * (x2 - x1)) /
        (Math.sqrt(((x1 - x0) ** 2 + (y1 - y0) ** 2) * ((x2 - x1) ** 2 + (y2 - y1) ** 2) * ((x2 - x0) ** 2 + (y2 - y0) ** 2)) + 1e-300);
      if (!corner || k > corner.k) corner = {k, l: grid[i]};
    }
    let lo = 1e-18, hi = 1;
    for (let i = 0; i < 300; i++) { const mid = Math.sqrt(lo * hi); if (P.res(mid) < 1.1 * P.delta) lo = mid; else hi = mid; }
    const disc = Math.sqrt(lo * hi);
    const best = grid.reduce((b, l) => P.err(l) < P.err(b) ? l : b, grid[0]);
    must(corner.l > 2e-9 && corner.l < 4e-9 && Math.abs(P.err(corner.l) - 0.209) < 0.01, "L-curve corner");
    must(Math.abs(disc - 2.1e-6) < 1e-7 && Math.abs(P.err(disc) - 0.039) < 1e-3, "discrepancy choice");
    must(best > 5e-7 && best < 8e-7 && Math.abs(P.err(best) - 0.033) < 1e-3, "hindsight best");
    const lams = logGrid(-16, 0, 20);
    const marks = [[corner.l, C.pink, "corner"], [disc, C.teal, "discrepancy"], [best, C.green, "best in hindsight"]];
    const A = chart({x: 80, y: 96, w: 340, h: 280, xr: [-6, 0], yr: [-0.5, 3], xlog: true, ylog: true});
    A.frame({xticks: [-6, -4, -2, 0].map(k => 10 ** k), xfmt: t => pow10(Math.round(Math.log10(t))), yticks: [1, 10, 100, 1000], yfmt: t => pow10(Math.round(Math.log10(t))),
      xlabel: "residual ‖Ax_λ − b‖", ylabel: "solution norm ‖x_λ‖"});
    A.line(lams.map(l => [P.res(l), P.xnorm(l)]), {color: C.orange, width: 3});
    for (const [l, col] of marks) A.dots([[P.res(l), P.xnorm(l)]], {color: col, r: 6});
    A.label([P.res(1e-16), P.xnorm(1e-16)], "λ = 10⁻¹⁶", {color: C.muted, size: 13, dx: 10, dy: 4});
    A.label([P.res(1), P.xnorm(1)], "λ = 1", {color: C.muted, size: 13, dx: -44, dy: -10});
    const B = chart({x: 540, y: 96, w: 320, h: 280, xr: [-12, 0], yr: [-2, 2], xlog: true, ylog: true});
    B.frame({xticks: [-12, -9, -6, -3, 0].map(k => 10 ** k), xfmt: t => pow10(Math.round(Math.log10(t))), yticks: [-2, -1, 0, 1, 2].map(k => 10 ** k), yfmt: t => pow10(Math.round(Math.log10(t))),
      xlabel: "λ", ylabel: "error ‖x_λ − x‖"});
    B.line(logGrid(-12, 0, 20).map(l => [l, P.err(l)]), {color: C.purple, width: 3});
    for (const [l, col] of marks) B.vline(l, {color: col, dash: "4 4"}).dots([[l, P.err(l)]], {color: col, r: 6});
    const sci = l => { const [m, e] = l.toExponential(1).split("e"); return `${m}×10${[...String(Number(e))].map(ch => SUP[ch]).join("")}`; };
    return figure({
      id: "la10-lc", w: 900, h: 590,
      title: "The L-curve and the error of three choices of lambda",
      desc: "Left: for the 32-channel problem, the solution norm against the residual norm on logarithmic axes, as lambda runs from 10 to the minus 16 to 1, makes an L shape. Its point of greatest curvature is at lambda about 3 times 10 to the minus 9. The discrepancy choice, lambda about 2.1 times 10 to the minus 6, and the best choice in hindsight, about 6.3 times 10 to the minus 7, lie a little further along the flat part. Right: the solution error against lambda. The corner choice has error 0.209, the discrepancy choice 0.039 and the best 0.033.",
      caption: "The corner looks decisive on the left, but on the right it is five times worse than the discrepancy choice.",
    }, [heading("A sharp corner is not the same as a good choice"), A.parts, B.parts,
      ...marks.map(([l, col, name], i) => text(90, 474 + 26 * i, `${name}: λ ≈ ${sci(l)}, error ${P.err(l).toFixed(3)}`, {color: col, size: 14}))]);
  },

  /* §10: gradient descent from two starts on A=[[1,0,1],[0,1,1]], b=(2,3), η=0.3. */
  "la10-gd-paths"() {
    const A = [[1, 0, 1], [0, 1, 1]], b = [2, 3], eta = 0.3, n = scale(1 / Math.sqrt(3), [1, 1, -1]);
    const xdag = [1 / 3, 4 / 3, 5 / 3];
    const step = x => { const r = mv(A, x).map((v, i) => v - b[i]); const g = [0, 1, 2].map(j => A[0][j] * r[0] + A[1][j] * r[1]); return x.map((v, j) => v - eta * g[j]); };
    const run = x => { const out = [x]; for (let t = 0; t < 80; t++) out.push(x = step(x)); return out; };
    const coords = x => { const s = dot(x, n), row = x.map((v, j) => v - s * n[j] - xdag[j]); return [s, norm(row)]; };
    const p0 = run([0, 0, 0]), p1 = run([1, 1, 1]);
    must(norm(p0.at(-1).map((v, j) => v - xdag[j])) < 1e-9, "from 0 → x†");
    must(norm(p1.at(-1).map((v, j) => v - [2 / 3, 5 / 3, 4 / 3][j])) < 1e-9, "from (1,1,1) → (2/3,5/3,4/3)");
    must(p1.every(x => near(dot(x, n), 1 / Math.sqrt(3), 1e-12)) && p0.every(x => near(dot(x, n), 0, 1e-12)), "kernel coordinate fixed");
    const F = chart({x: 90, y: 96, w: 500, h: 290, xr: [-0.35, 1.05], yr: [-0.5, 2.4]});
    F.frame({xticks: [0, 0.5, 1], yticks: [0, 1, 2], xlabel: "coordinate along ker A = span(1, 1, −1)", ylabel: "distance of the row-space part from x†"});
    F.hline(0, {color: C.ink, width: 2.5, dash: "1 0"});
    F.line(p0.slice(0, 13).map(coords), {color: C.teal, width: 2}).dots(p0.slice(0, 13).map(coords), {color: C.teal, r: 4});
    F.line(p1.slice(0, 13).map(coords), {color: C.orange, width: 2}).dots(p1.slice(0, 13).map(coords), {color: C.orange, r: 4});
    F.dots([[0, 0]], {color: C.teal, r: 8, ring: true}).dots([[1 / Math.sqrt(3), 0]], {color: C.orange, r: 8, ring: true});
    F.label(coords([0, 0, 0]), "start 0", {color: C.teal, dx: 12, dy: 5});
    F.label(coords([1, 1, 1]), "start (1, 1, 1)", {color: C.orange, dx: 12, dy: 5});
    F.label([0, 0], "x† = (1/3, 4/3, 5/3)", {color: C.teal, dx: -60, dy: 28, size: 13});
    F.label([1 / Math.sqrt(3), 0], "(2/3, 5/3, 4/3)", {color: C.orange, dx: -40, dy: 28, size: 13});
    F.label([0.62, 0], "every solution of Ax = b", {color: C.ink, dx: 14, dy: -10, size: 13});
    return figure({
      id: "la10-gd", w: 900, h: 480,
      title: "Gradient descent from two starting points",
      desc: "Gradient descent with step 0.3 on A = [[1, 0, 1], [0, 1, 1]], b = (2, 3). The horizontal axis is the coordinate along the kernel direction (1, 1, −1)/√3 and the vertical axis is the distance of the row-space part of the iterate from the minimum-norm solution. The horizontal axis itself is the set of all solutions. From 0 the iterates drop straight down at kernel coordinate 0 and reach (1/3, 4/3, 5/3). From (1, 1, 1) they drop straight down at kernel coordinate 1/√3 and reach (2/3, 5/3, 4/3).",
      caption: "The kernel coordinate never changes: every update lies in row(A). Twelve steps are shown from each start.",
    }, [heading("Gradient descent keeps whatever kernel part it starts with"), F.parts,
      text(630, 160, "update: −η Aᵀ(Ax − b)", {color: C.ink, size: 14}),
      text(630, 184, "always lies in row(A)", {color: C.ink, size: 14}),
      text(630, 230, "from 0: limit x†", {color: C.teal, size: 14}),
      text(630, 254, "from (1, 1, 1): limit x† +", {color: C.orange, size: 14}),
      text(630, 278, "(1/3)(1, 1, −1), its kernel part", {color: C.orange, size: 14}),
      text(630, 324, "η = 0.3 ≤ 1/σ₁² = 1/3", {color: C.muted, size: 13})]);
  },

  /* §11: the same 0.01 change in the data, read through three different outputs, with and without ridge. */
  "la10-trust"() {
    const {X} = collinear(), y1 = [2, 4.05, 5.95], y2 = [2, 4.06, 5.94], q = [1, 0];
    const measure = lam => {
      const a = ridge2(X, y1, lam), c = ridge2(X, y2, lam);
      const fa = mv(X, a), fc = mv(X, c);
      return [norm([a[0] - c[0], a[1] - c[1]]), Math.max(...fa.map((v, i) => Math.abs(v - fc[i]))), Math.abs(dot(q, a) - dot(q, c))];
    };
    const m0 = measure(0), m1 = measure(0.01);
    must(near(m0[0], Math.SQRT2, 1e-6) && near(m0[1], 0.01, 1e-6) && near(m0[2], 1, 1e-6), "λ = 0 changes");
    must(Math.abs(m1[0] - 0.0135) < 2e-4 && Math.abs(m1[1] - 0.0022) < 1e-4 && Math.abs(m1[2] - 0.0099) < 2e-4, "λ = 0.01 changes");
    const F = chart({x: 90, y: 96, w: 520, h: 280, xr: [0, 3], yr: [-3, 1], ylog: true});
    F.frame({yticks: [-3, -2, -1, 0, 1].map(k => 10 ** k), yfmt: t => pow10(Math.round(Math.log10(t))), ylabel: "size of the change (log scale)"});
    const names = [["coefficients ‖δw‖", "(y per unit of x)"], ["fitted values at", "observed inputs (y)"], ["prediction at", "x = (1, 0) (y)"]];
    const bw = F.X(0.3) - F.X(0);
    const bar = (g, k, v, color) => {
      const x0 = F.X(g + 0.18 + 0.34 * k), top = F.Y(v), base = F.Y(1e-3);
      return [`<rect x="${r2(x0)}" y="${r2(top)}" width="${r2(bw)}" height="${r2(base - top)}" fill="${color}" fill-opacity="0.85" rx="3"/>`,
        text(x0 + bw / 2, top - 8, v >= 0.1 ? v.toFixed(2) : v.toFixed(4), {color, size: 13, anchor: "middle"})];
    };
    names.forEach(([a, b], g) => {
      F.parts.push(bar(g, 0, m0[g], C.orange), bar(g, 1, m1[g], C.teal),
        text(F.X(g + 0.5), 398, a, {color: C.label, size: 13, anchor: "middle"}), text(F.X(g + 0.5), 416, b, {color: C.label, size: 13, anchor: "middle"}));
    });
    return figure({
      id: "la10-trust", w: 900, h: 480,
      title: "What a 0.01 change in the data moves",
      desc: "Bar chart on a logarithmic axis. The data change from y = (2, 4.05, 5.95) to (2, 4.06, 5.94). Without regularization the coefficients move by 1.41, the fitted values at the observed inputs by at most 0.01, and the prediction at the off-pattern input (1, 0) by 1. With ridge lambda = 0.01 the same three changes are 0.0135, 0.0022 and 0.0099.",
      caption: "Without damping, stable fitted values sit beside unstable coefficients and an unstable off-pattern prediction.",
    }, [heading("One data change, three answers to “how much did it move?”"), F.parts,
      ...legend(650, 150, [[C.orange, "least squares, λ = 0"], [C.teal, "ridge, λ = 0.01"]]),
      text(650, 220, "data change: δy = (0, 0.01, −0.01)", {color: C.ink, size: 14}),
      text(650, 256, "(1, 0) has component 0.707", {color: C.ink, size: 14}),
      text(650, 280, "along the weak direction v₂", {color: C.ink, size: 14}),
      text(650, 312, "compare bars within a group:", {color: C.muted, size: 13}),
      text(650, 332, "the groups have different units", {color: C.muted, size: 13}),
      text(650, 366, "ridge's price: residual 0.055", {color: C.muted, size: 13}),
      text(650, 386, "instead of an exact fit", {color: C.muted, size: 13})]);
  },
  /* §9.3: GCV on the 32-channel problem has two dips; the deeper one ruins the reconstruction. */
  "la10-gcv"() {
    const P = problem32(), grid = logGrid(-16, 0, 50), g = grid.map(P.gcv);
    const mins = grid.filter((l, i) => i > 0 && i < grid.length - 1 && g[i] < g[i - 1] && g[i] < g[i + 1]);
    must(mins.length === 2, "two local minima of GCV");
    const [deep, shallow] = P.gcv(mins[0]) < P.gcv(mins[1]) ? mins : [mins[1], mins[0]];
    must(deep > 5e-14 && deep < 1e-13 && P.err(deep) > 60 && P.err(deep) < 75, "global GCV minimum fails for reconstruction");
    must(shallow > 1.5e-7 && shallow < 3e-7 && Math.abs(P.err(shallow) - 0.037) < 0.002, "local GCV minimum");
    must(P.fitErr(deep) < 1.2e-4 && P.fitErr(shallow) < 1e-4, "both have small fitted-value error");
    const sci = l => { const [m, e] = l.toExponential(1).split("e"); return `${m}×10${[...String(Number(e))].map(ch => SUP[ch]).join("")}`; };
    const lg = t => pow10(Math.round(Math.log10(t)));
    const A = chart({x: 80, y: 96, w: 340, h: 270, xr: [-16, 0], yr: [-11.5, -7], xlog: true, ylog: true});
    A.frame({xticks: [-16, -12, -8, -4, 0].map(k => 10 ** k), xfmt: lg, yticks: [-11, -10, -9, -8, -7].map(k => 10 ** k), yfmt: lg, xlabel: "λ", ylabel: "GCV criterion G(λ)"});
    A.line(grid.map((l, i) => [l, g[i]]), {color: C.orange, width: 3});
    A.dots([[deep, P.gcv(deep)]], {color: C.pink, r: 6}).dots([[shallow, P.gcv(shallow)]], {color: C.teal, r: 6});
    A.label([deep, P.gcv(deep)], "deeper dip", {color: C.pink, dx: -30, dy: 24});
    A.label([shallow, P.gcv(shallow)], "shallower dip", {color: C.teal, dx: -40, dy: 24});
    const B = chart({x: 540, y: 96, w: 320, h: 270, xr: [-16, 0], yr: [-2, 3], xlog: true, ylog: true});
    B.frame({xticks: [-16, -12, -8, -4, 0].map(k => 10 ** k), xfmt: lg, yticks: [-2, -1, 0, 1, 2, 3].map(k => 10 ** k), yfmt: lg, xlabel: "λ", ylabel: "reconstruction error ‖x_λ − x‖"});
    B.line(grid.map(l => [l, P.err(l)]), {color: C.purple, width: 3});
    B.vline(deep, {color: C.pink, dash: "4 4"}).vline(shallow, {color: C.teal, dash: "4 4"});
    B.dots([[deep, P.err(deep)]], {color: C.pink, r: 6}).dots([[shallow, P.err(shallow)]], {color: C.teal, r: 6});
    const row = (y, col, name, l) => text(80, y, `${name}: λ ≈ ${sci(l)}, reconstruction error ${P.err(l) < 1 ? P.err(l).toFixed(3) : P.err(l).toFixed(0)}, fitted-value error ${sci(P.fitErr(l))}`, {color: col, size: 14});
    return figure({
      id: "la10-gcv", w: 900, h: 560,
      title: "Generalized cross-validation with two minima",
      desc: "Left: the GCV criterion for the 32-channel problem against lambda on logarithmic axes has two dips, a deeper one near lambda = 7 times 10 to the minus 14 and a shallower one near 2 times 10 to the minus 7. Right: the reconstruction error against lambda is about 67 at the deeper dip and about 0.037 at the shallower one. The noiseless fitted-value errors at the two dips are both below 10 to the minus 4.",
      caption: "GCV estimates prediction error at the observed inputs. Both dips predict well there; only one reconstructs x.",
    }, [heading("GCV: two dips, and the deeper one is the wrong one for reconstruction"), A.parts, B.parts,
      row(470, C.pink, "deeper dip", deep), row(496, C.teal, "shallower dip", shallow)]);
  },
};
