/* LA01 figures: vectors, span, independence, bases, sums and affine sets.

   Every drawing is computed from the numbers used in the lesson text, and the
   small assertions below fail the build if a label and its geometry disagree. */
import {C, figure, panel, text, add, sub, scale, dot, norm, fmt} from "./svgkit.mjs";

const check = (ok, what) => { if (!ok) throw new Error("la01 figure arithmetic: " + what); };
const same = (a, b) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < 1e-12);
const comb = (cs, vs) => vs.reduce((s, v, i) => add(s, scale(cs[i], v)), vs[0].map(() => 0));
const tuple = v => "(" + v.map(x => fmt(x)).join(", ") + ")";
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
/* A 2-D panel whose data box is the bounding box of projected 3-D points. */
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
    patch: (o, u, v, [s0, s1], [t0, t1], opts) => p.polygon([
      add(o, add(scale(s0, u), scale(t0, v))), add(o, add(scale(s1, u), scale(t0, v))),
      add(o, add(scale(s1, u), scale(t1, v))), add(o, add(scale(s0, u), scale(t1, v)))].map(T), opts),
    axes(len = 3, {color = C.axis} = {}) {
      [[len, 0, 0, "x"], [0, len, 0, "y"], [0, 0, len, "z"]].forEach(([a, b, c, n]) => {
        p.line(T([0, 0, 0]), T([a, b, c]), {color, width: 1.5, dash: "5 5"});
        p.label(T([a * 1.08, b * 1.08, c * 1.08]), n, {color: C.muted, size: 15, dx: -4, dy: 5});
      });
    },
  };
}

export default {
  /* §1: one vector as an arrow, a translated arrow, a point, and a function on {1, 2}. */
  "la01-vector-views"() {
    const v = [3, -1], tail = [-2, 2], head = add(tail, v);
    check(same(sub(head, tail), v), "translated arrow keeps its displacement");
    const a = panel({x: 40, y: 80, w: 390, h: 250, xmin: -3, xmax: 4, ymin: -2, ymax: 3, title: "arrow: a displacement"});
    a.grid(1).axes();
    a.arrow([0, 0], v, {color: C.teal, label: "v = (3, −1)", dx: -40, dy: 26});
    a.arrow(tail, head, {color: C.orange, dash: "8 6", label: "same v, drawn from (−2, 2)", at: 0, dx: -12, dy: -14, size: 15});
    const b = panel({x: 460, y: 80, w: 190, h: 250, xmin: -1, xmax: 4, ymin: -2, ymax: 3, title: "point: a location"});
    b.grid(1).axes();
    b.point(v, {color: C.teal, r: 7, label: "(3, −1)", dx: -58, dy: 26});
    const c = panel({x: 680, y: 80, w: 190, h: 250, xmin: 0, xmax: 3, ymin: -2, ymax: 4, title: "function: i ↦ v(i)"});
    c.axes();
    c.polygon([[0.6, 0], [1.4, 0], [1.4, 3], [0.6, 3]], {fill: C.teal, opacity: 0.45});
    c.polygon([[1.6, 0], [2.4, 0], [2.4, -1], [1.6, -1]], {fill: C.teal, opacity: 0.45});
    c.label([1, 3], "v(1) = 3", {color: C.ink, size: 15, anchor: "middle", dy: -8});
    c.label([2, -1], "v(2) = −1", {color: C.ink, size: 15, anchor: "middle", dy: 20});
    c.label([1, 0], "1", {color: C.muted, size: 14, anchor: "middle", dy: 18});
    c.label([2, 0], "2", {color: C.muted, size: 14, anchor: "middle", dy: -8});
    return figure({
      id: "la01-views", w: 900, h: 400,
      title: "The list (3, −1) drawn in three further views",
      desc: "Left: the arrow from the origin to (3,−1), and an identical arrow drawn from (−2,2) to (1,1). Middle: the single point (3,−1). Right: a bar chart of the function sending index 1 to 3 and index 2 to −1.",
      caption: "Same two numbers, three readings. Moving the arrow's tail does not change the vector.",
    }, [text(450, 40, "The list v = (3, −1) of View 1, drawn in Views 2, 3 and 4", {color: C.label, size: 18, anchor: "middle"}), a.svg(), b.svg(), c.svg()]);
  },

  /* §2: axiom (7) as a scaled parallelogram, and the |a| scaling that breaks axiom (8). */
  "la01-axioms-pictured"() {
    const u = [1, 2], v = [2, -1], s = 2;
    check(same(scale(s, add(u, v)), add(scale(s, u), scale(s, v))), "axiom 7 example");
    const a = panel({x: 40, y: 80, w: 400, h: 270, xmin: -0.8, xmax: 6.8, ymin: -2.6, ymax: 4.6, title: "axiom (7): 2(u + v) = 2u + 2v"});
    a.grid(1).axes();
    a.polygon([[0, 0], scale(s, u), scale(s, add(u, v)), scale(s, v)], {fill: C.purple, opacity: 0.12, dash: "6 5"});
    a.polygon([[0, 0], u, add(u, v), v], {fill: C.teal, opacity: 0.3, stroke: C.teal});
    a.arrow([0, 0], u, {color: C.teal, label: "u", dx: -20, dy: 0});
    a.arrow([0, 0], v, {color: C.teal, label: "v", dx: -4, dy: 22});
    a.arrow([0, 0], scale(s, add(u, v)), {color: C.orange});
    a.label([3.1, 0.35], "2(u + v) = (6, 2)", {color: C.orange, size: 16});
    a.point(scale(s, u), {color: C.purple, label: "2u = (2, 4)", dx: 8, dy: 4});
    a.point(scale(s, v), {color: C.purple, label: "2v = (4, −2)", dx: 8, dy: 16});
    const w = [2, 1];
    const b = panel({x: 470, y: 80, w: 400, h: 270, xmin: -3.2, xmax: 5.2, ymin: -2.2, ymax: 3.4, title: "a⋆w = |a|w breaks axiom (8), w = (2, 1)"});
    b.grid(1).axes();
    b.line([0, 0], scale(-1.6, w), {color: C.dim, width: 3, dash: "4 6"});
    b.label(scale(-1.5, w), "never reached", {color: C.muted, size: 14, dx: -8, dy: -10});
    b.arrow([0, 0], w, {color: C.teal, label: "1⋆w = w", at: 0.5, dx: 4, dy: 26});
    b.arrow(w, scale(2, w), {color: C.orange, label: "(−1)⋆w = w too", at: 0.5, dx: -140, dy: -14});
    b.point(scale(2, w), {color: C.orange, label: "sum (4, 2)", dx: 10, dy: 20});
    b.point([0, 0], {color: C.pink, r: 7, label: "(1 + (−1))⋆w = 0⋆w = 0", dx: 10, dy: 24});
    return figure({
      id: "la01-axioms", w: 900, h: 420,
      title: "Axiom 7 as a scaled parallelogram, and an operation that fails axiom 8",
      desc: "Left: the parallelogram on u=(1,2) and v=(2,−1) and the same parallelogram scaled by 2, whose diagonal is 2(u+v)=(6,2). Right: with the rule a⋆w=|a|w for w=(2,1), 1⋆w plus (−1)⋆w lands at (4,2), but (1+(−1))⋆w is the origin.",
      caption: "Distributivity says scaling a whole parallelogram scales its sides. |a| scaling of w only reaches a ray.",
    }, [a.svg(), b.svg()]);
  },

  /* §3: the parallelogram rule and a tip-to-tail combination 2u − v. */
  "la01-parallelogram"() {
    const u = [3, 1], v = [1, 2], s = add(u, v), d = sub(scale(2, u), v);
    check(same(s, [4, 3]) && same(d, [5, 0]), "u+v and 2u−v");
    const a = panel({x: 40, y: 70, w: 400, h: 290, xmin: -0.6, xmax: 5.2, ymin: -0.6, ymax: 3.6, title: "u + v: either order, same tip"});
    a.grid(1).axes();
    a.polygon([[0, 0], u, s, v], {fill: C.purple, opacity: 0.16, stroke: C.purple, width: 1.5});
    a.arrow(u, s, {color: C.orange, dash: "7 5", width: 3});
    a.arrow(v, s, {color: C.teal, dash: "7 5", width: 3});
    a.arrow([0, 0], u, {color: C.teal, label: "u = (3, 1)", dx: -6, dy: 22});
    a.arrow([0, 0], v, {color: C.orange, label: "v = (1, 2)", dx: -86, dy: -4});
    a.arrow([0, 0], s, {color: C.ink, width: 3, label: "u + v = (4, 3)", dx: -40, dy: -12});
    const b = panel({x: 470, y: 70, w: 400, h: 290, xmin: -0.6, xmax: 6.8, ymin: -1, ymax: 3, title: "2u − v, tip to tail"});
    b.grid(1).axes();
    b.arrow([0, 0], scale(2, u), {color: C.teal, label: "2u = (6, 2)", dx: -90, dy: -10});
    b.arrow(scale(2, u), d, {color: C.orange, label: "−v = (−1, −2)", at: 0.5, dx: 8, dy: 0});
    b.arrow([0, 0], d, {color: C.ink, width: 3, label: "2u − v = (5, 0)", dx: -60, dy: 24});
    return figure({
      id: "la01-para", w: 900, h: 420,
      title: "The parallelogram rule and a tip-to-tail combination",
      desc: "Left: u=(3,1) and v=(1,2) with dashed copies placed tip to tail in both orders; both reach u+v=(4,3), the far corner of the parallelogram. Right: 2u=(6,2) followed by −v=(−1,−2) reaches 2u−v=(5,0).",
      caption: "Addition places arrows tip to tail; scaling stretches or reverses one arrow along its own line.",
    }, [a.svg(), b.svg()]);
  },

  /* §4: bounded combinations of an independent pair versus a collapsed pair. */
  "la01-span-collapse"() {
    const u = [2, 1], v = [1, 2], t = [4, 5], vd = [-4, -2];
    check(same(comb([1, 2], [u, v]), t), "(4,5) = u + 2v");
    const corners = [[-2, -2], [2, -2], [2, 2], [-2, 2]].map(([a, b]) => comb([a, b], [u, v]));
    const a = panel({x: 40, y: 70, w: 400, h: 300, xmin: -7, xmax: 7, ymin: -7, ymax: 7, title: "u = (2, 1), v = (1, 2): a plane"});
    a.grid(1, {width: 1}).axes();
    a.polygon(corners, {fill: C.purple, opacity: 0.22, stroke: C.purple, width: 2});
    a.arrow([0, 0], u, {color: C.teal, label: "u", dx: 4, dy: 18});
    a.arrow(u, t, {color: C.orange, label: "2v", at: 0.5, dx: 8, dy: 4});
    a.point(t, {color: C.ink, r: 6, label: "(4, 5) = u + 2v", dx: -40, dy: -12});
    a.label([-6.6, -6.2], "shaded: a, b ∈ [−2, 2]", {color: C.label, size: 14});
    const b = panel({x: 470, y: 70, w: 400, h: 300, xmin: -7, xmax: 7, ymin: -7, ymax: 7, title: "u = (2, 1), v = (−4, −2): a line"});
    b.grid(1, {width: 1}).axes();
    b.fullLine([0, 0], u, {color: C.purple, width: 7});
    b.arrow([0, 0], u, {color: C.teal, label: "u", dx: 2, dy: -10});
    b.arrow([0, 0], vd, {color: C.orange, label: "v = −2u", dx: -30, dy: 24});
    b.point(t, {color: C.pink, r: 6, label: "(4, 5) not reachable", dx: -70, dy: -14});
    b.label([1.2, -5.4], "every combination is (a − 2b)u", {color: C.label, size: 14});
    b.label([1.2, -6.3], "span = the line y = x/2", {color: C.label, size: 14});
    return figure({
      id: "la01-collapse", w: 900, h: 430,
      title: "An independent pair fills a plane; a collapsed pair fills only a line",
      desc: "Left: the parallelogram of combinations au+bv with a and b between −2 and 2 for u=(2,1), v=(1,2); the target (4,5) is reached as u plus 2v. Right: with v=(−4,−2)=−2u every combination lies on the line y=x/2, and (4,5) is off it.",
      caption: "Letting a, b range over all of ℝ, the left region grows to the whole plane; the right one never leaves its line.",
    }, [a.svg(), b.svg()]);
  },

  /* §4: a plane through the origin in R^3 and a point off it. */
  "la01-span-plane"() {
    const P3 = view3(24, 24), a = [1, 0, 1], b = [0, 1, 1], w = [2, 3, 5], off = [1, 1, 1], above = [1, 1, 2];
    check(same(comb([2, 3], [a, b]), w) && same(comb([1, 1], [a, b]), above), "plane points");
    const pts = [[0, 0, 0], [2.6, 0, 0], [0, 3.8, 0], [0, 0, 5.4], comb([-0.4, -0.4], [a, b]), comb([2.5, 3.5], [a, b]), comb([2.5, -0.4], [a, b]), comb([-0.4, 3.5], [a, b])];
    const s = panel3({x: 30, y: 50, w: 500, h: 340, points: pts, P3, pad: 0.3});
    s.axes(2.4);
    s.patch([0, 0, 0], a, b, [-0.4, 2.5], [-0.4, 3.5], {fill: C.purple, opacity: 0.2, stroke: C.purple, width: 1.5});
    s.arrow([0, 0, 0], a, {color: C.teal, label: "a", dx: -18, dy: 0, size: 17});
    s.arrow([0, 0, 0], b, {color: C.teal, label: "b", dx: 6, dy: 18, size: 17});
    s.arrow([0, 0, 0], scale(2, a), {color: C.orange, width: 3, dash: "7 5", label: "2a", at: 0.7, dx: -30, dy: 0});
    s.arrow(scale(2, a), w, {color: C.orange, width: 3, dash: "7 5", label: "3b", at: 0.5, dx: -8, dy: -12});
    s.point(w, {color: C.ink, r: 6, label: "(2, 3, 5)", dx: 10, dy: 4});
    s.line(off, above, {color: C.pink, width: 2.5, dash: "4 4"});
    s.point(above, {color: C.purple, r: 5, label: "(1, 1, 2)", dx: 10, dy: -4});
    s.point(off, {color: C.pink, r: 6, label: "(1, 1, 1)", dx: 14, dy: 26});
    const col = 560, line = (i, str, color = C.ink) => text(col, 110 + i * 34, str, {color, size: 16});
    return figure({
      id: "la01-plane", w: 900, h: 440,
      title: "The span of two vectors in three-space is a plane through the origin",
      desc: "An oblique view of the plane spanned by a=(1,0,1) and b=(0,1,1). The point (2,3,5) is reached by walking 2a and then 3b. The point (1,1,1) sits directly below the plane point (1,1,2), which has the same x and y, so (1,1,1) is not in the span.",
      caption: "span{a, b} = {(s, t, s + t)}: the plane z = x + y. A point is in it exactly when its z equals x + y.",
    }, [text(450, 36, "span{(1, 0, 1), (0, 1, 1)} in ℝ³", {color: C.label, size: 18, anchor: "middle"}), s.p.svg(),
      line(0, "a = (1, 0, 1),  b = (0, 1, 1)", C.teal),
      line(1, "s·a + t·b = (s, t, s + t)"),
      line(2.3, "target (2, 3, 5):"), line(3.3, "  s = 2, t = 3, and z = 2 + 3 = 5  ✓", C.orange),
      line(4.6, "target (1, 1, 1):"), line(5.6, "  s = 1, t = 1 force z = 2, not 1  ✗", C.pink),
      line(6.9, "dashed pink: from (1, 1, 1) up to the", C.muted), line(7.6, "plane point (1, 1, 2) above it", C.muted)]);
  },

  /* §5: a dependent triple lies in one plane; a pairwise-independent triple can still be dependent. */
  "la01-dependent-triple"() {
    const P3 = view3(22, 24), v1 = [1, 1, 0], v2 = [0, 1, 1], v3 = [1, 3, 2], w3 = [2, 2, 3];
    check(same(comb([1, 2], [v1, v2]), v3), "v3 = v1 + 2 v2");
    check(dot(w3, [1, -1, 1]) !== 0 && dot(v3, [1, -1, 1]) === 0, "(2,2,3) off the plane, (1,3,2) on it");
    const pts = [[0, 0, 0], [2.4, 0, 0], [0, 3.4, 0], [0, 0, 3.4], comb([-0.4, -0.4], [v1, v2]), comb([2.9, 2.5], [v1, v2]), comb([2.9, -0.7], [v1, v2]), comb([-0.4, 2.5], [v1, v2]), w3];
    const s = panel3({x: 30, y: 70, w: 520, h: 320, points: pts, P3, pad: 0.3, title: "v₃ = v₁ + 2v₂ lies in the plane of v₁, v₂"});
    s.axes(2);
    s.patch([0, 0, 0], v1, v2, [-0.4, 2.9], [-0.7, 2.5], {fill: C.purple, opacity: 0.2, stroke: C.purple, width: 1.5});
    s.arrow([0, 0, 0], v1, {color: C.teal, label: "v₁", dx: 4, dy: 20, size: 17});
    s.arrow([0, 0, 0], v2, {color: C.teal, label: "v₂", at: 0.6, dx: 10, dy: 18, size: 17});
    s.arrow(v1, v3, {color: C.teal, width: 2.5, dash: "6 5", label: "2v₂", at: 0.55, dx: 8, dy: 16});
    s.arrow([0, 0, 0], v3, {color: C.ink, width: 3, label: "v₃ = (1, 3, 2)", dx: 8, dy: 16});
    s.line(w3, scale(2, v1), {color: C.pink, width: 2, dash: "4 4"});
    s.point(scale(2, v1), {color: C.pink, r: 4, label: "(2, 2, 0) = 2v₁", dx: 10, dy: 16, size: 14});
    s.arrow([0, 0, 0], w3, {color: C.orange, width: 3, label: "(2, 2, 3): off the plane", dx: -40, dy: -12});
    const e1 = [1, 0], e2 = [0, 1], d = [1, 1];
    const b = panel({x: 590, y: 70, w: 290, h: 300, xmin: -0.5, xmax: 1.7, ymin: -0.5, ymax: 1.8, title: "pairwise independent, jointly dependent"});
    b.grid(0.5, {width: 1}).axes();
    b.arrow([0, 0], e1, {color: C.teal, label: "(1, 0)", dx: -20, dy: 24});
    b.arrow([0, 0], e2, {color: C.teal, label: "(0, 1)", dx: -58, dy: 4});
    b.arrow([0, 0], d, {color: C.orange, label: "(1, 1)", dx: 6, dy: -6});
    b.line(e1, d, {color: C.muted, dash: "5 5"});
    b.line(e2, d, {color: C.muted, dash: "5 5"});
    b.label([-0.4, 1.6], "(1, 0) + (0, 1) − (1, 1) = 0", {color: C.label, size: 15});
    return figure({
      id: "la01-triple", w: 920, h: 440,
      title: "Dependence means some vector adds no new direction",
      desc: "Left: an oblique view of the plane spanned by v1=(1,1,0) and v2=(0,1,1); v3=(1,3,2) equals v1 plus 2 v2 and lies in the plane, while (2,2,3) points out of it, three units above the plane point (2,2,0). Right: in the plane, (1,0), (0,1) and (1,1) are pairwise non-parallel, yet (1,1) is the sum of the other two.",
      caption: "Three vectors in ℝ³ are dependent when one of them lies in the plane (or line) spanned by the others.",
    }, [s.p.svg(), b.svg()]);
  },

  /* §6: the exchange procedure, one inserted vector and one removed vector per step. */
  "la01-exchange-lemma"() {
    const u1 = [1, 1, 0], u2 = [0, 1, 1], w1 = [1, 0, 0], w2 = [0, 1, 0], w3 = [0, 0, 1];
    check(same(sub(u1, w1), w2), "w2 = u1 − w1");
    check(same(add(add(scale(-1, u1), u2), w1), w3), "w3 = −u1 + u2 + w1");
    const chip = (x, y, name, vec, kind) => {
      const col = kind === "u" ? C.teal : kind === "gone" ? C.pink : C.orange;
      const out = [`<rect x="${x}" y="${y}" width="150" height="54" rx="12" fill="${col}" fill-opacity="${kind === "gone" ? 0.08 : 0.16}" stroke="${col}" stroke-width="2"${kind === "gone" ? ' stroke-dasharray="6 5"' : ""}/>`,
        text(x + 75, y + 23, name, {color: kind === "gone" ? C.muted : C.ink, size: 17, anchor: "middle", weight: 600}),
        text(x + 75, y + 44, tuple(vec), {color: C.label, size: 14, anchor: "middle"})];
      if (kind === "gone") out.push(`<path d="M${x + 12} ${y + 46}L${x + 138} ${y + 8}" stroke="${C.pink}" stroke-width="3"/>`);
      return out;
    };
    const rows = [
      {label: "start", note: "w₁, w₂, w₃ span ℝ³", list: [["w₁", w1, "w"], ["w₂", w2, "w"], ["w₃", w3, "w"]]},
      {label: "insert u₁", note: "w₂ = u₁ − w₁ is in span(u₁, w₁): remove w₂", list: [["u₁", u1, "u"], ["w₁", w1, "w"], ["w₂", w2, "gone"], ["w₃", w3, "w"]]},
      {label: "insert u₂", note: "w₃ = −u₁ + u₂ + w₁ is in span(u₁, u₂, w₁): remove w₃", list: [["u₁", u1, "u"], ["u₂", u2, "u"], ["w₁", w1, "w"], ["w₃", w3, "gone"]]},
      {label: "result", note: "still spans ℝ³; each u pushed out one w, so 2 ≤ 3", list: [["u₁", u1, "u"], ["u₂", u2, "u"], ["w₁", w1, "w"]]},
    ];
    const parts = [text(450, 40, "Exchange: independent u₁ = (1, 1, 0), u₂ = (0, 1, 1) into spanning e₁, e₂, e₃", {color: C.label, size: 18, anchor: "middle"})];
    rows.forEach((r, i) => {
      const y = 70 + i * 86;
      parts.push(text(40, y + 33, r.label, {color: C.label, size: 16}));
      r.list.forEach(([n, v, k], j) => parts.push(chip(150 + j * 164, y, n, v, k)));
      parts.push(text(150, y + 74, r.note, {color: C.muted, size: 14.5}));
    });
    return figure({
      id: "la01-exchange", w: 900, h: 470,
      title: "The exchange lemma swaps in one independent vector at a time",
      desc: "Four rows of vector lists. Start with w1=(1,0,0), w2=(0,1,0), w3=(0,0,1). Inserting u1=(1,1,0) makes w2=u1−w1 redundant, so it is removed. Inserting u2=(0,1,1) makes w3=−u1+u2+w1 redundant, so it is removed. The result u1, u2, w1 still spans three-space.",
      caption: "The removed vector is always a w: a u cannot lie in the span of the u's before it, because the u's are independent.",
    }, parts);
  },

  /* §7: four candidate subsets of the plane and the rule each one breaks. */
  "la01-subspace-tests"() {
    const box = {xmin: -2.6, xmax: 2.6, ymin: -2.6, ymax: 2.6};
    const mk = (x, title) => { const p = panel({x, y: 80, w: 200, h: 220, ...box, title}); p.grid(1, {width: 1}).axes(); return p; };
    const a = mk(30, "y = 3x: subspace");
    a.fullLine([0, 0], [1, 3], {color: C.teal, width: 4});
    a.arrow([0, 0], [0.5, 1.5], {color: C.orange, width: 3});
    a.arrow([0, 0], [-0.6, -1.8], {color: C.orange, width: 3});
    a.label([0.6, -1.9], "sums, multiples", {color: C.label, size: 13});
    a.label([0.6, -2.35], "stay on it", {color: C.label, size: 13});
    const b = mk(250, "y = 3x + 1: misses 0");
    b.fullLine([0, 1], [1, 3], {color: C.orange, width: 4});
    b.raw(`<circle cx="${b.P([0, 0])[0]}" cy="${b.P([0, 0])[1]}" r="9" fill="none" stroke="${C.pink}" stroke-width="3"/>`);
    b.label([0.25, -0.5], "0 is not on it", {color: C.pink, size: 13});
    const c = mk(470, "x ≥ 0: fails c = −1");
    c.polygon([[0, -2.6], [2.6, -2.6], [2.6, 2.6], [0, 2.6]], {fill: C.teal, opacity: 0.22, stroke: C.teal, width: 1});
    c.arrow([0, 0], [1.5, 1], {color: C.teal, width: 3, label: "v", dx: 2, dy: -6});
    c.arrow([0, 0], [-1.5, -1], {color: C.pink, width: 3, label: "−v", dx: -30, dy: 14});
    const d = mk(690, "xy = 0: fails addition");
    d.line([-2.6, 0], [2.6, 0], {color: C.teal, width: 4}).line([0, -2.6], [0, 2.6], {color: C.teal, width: 4});
    d.arrow([0, 0], [1, 0], {color: C.orange, width: 3});
    d.arrow([0, 0], [0, 1], {color: C.orange, width: 3});
    d.point([1, 1], {color: C.pink, r: 6, label: "(1, 0) + (0, 1)", dx: -20, dy: -30, size: 13});
    d.label([1, 1], "= (1, 1) is off", {color: C.pink, size: 13, dx: -20, dy: -14});
    return figure({
      id: "la01-subtests", w: 920, h: 380,
      title: "Which subsets of the plane are subspaces",
      desc: "Four panels. The line y=3x contains the origin and keeps sums and multiples. The line y=3x+1 misses the origin. The half-plane x≥0 contains v but not −v. The union of the two axes contains (1,0) and (0,1) but not their sum (1,1).",
      caption: "A subspace contains 0 and is closed under addition and scaling; each failing set breaks exactly one visible rule.",
    }, [a.svg(), b.svg(), c.svg(), d.svg()]);
  },

  /* §8: a skewed basis grid; one point read in two coordinate systems. */
  "la01-skewed-grid-coordinates"() {
    const b1 = [2, 1], b2 = [-1, 1], v = [4, 5], c = [3, 2];
    check(same(comb(c, [b1, b2]), v), "v = 3 b1 + 2 b2");
    const p = panel({x: 60, y: 50, w: 780, h: 330, xmin: -2.5, xmax: 9.5, ymin: -1, ymax: 6.2});
    p.grid(1, {width: 1});
    p.grid(1, {M: [[b1[0], b2[0]], [b1[1], b2[1]]], color: C.purple, width: 1.4, range: [-8, 8]});
    p.axes();
    p.arrow([0, 0], b1, {color: C.teal, label: "b₁ = (2, 1)", dx: 0, dy: 22});
    p.arrow([0, 0], b2, {color: C.teal, label: "b₂ = (−1, 1)", dx: -110, dy: 0});
    p.arrow(b1, scale(3, b1), {color: C.orange, width: 3, dash: "7 5", label: "3b₁", at: 0.6, dx: 4, dy: 22});
    p.arrow(scale(3, b1), v, {color: C.orange, width: 3, dash: "7 5", label: "+ 2b₂", at: 0.5, dx: 10, dy: 4});
    p.point(v, {color: C.ink, r: 7});
    tag(p, v, "v", {dx: -26, dy: -8, size: 17});
    tag(p, [6.4, 1.3], "standard coordinates: (4, 5)", {size: 16});
    tag(p, [6.4, 0.75], "coordinates in B: (3, 2)", {color: C.purple, size: 16});
    return figure({
      id: "la01-skew", w: 900, h: 430,
      title: "A skewed basis grid gives the same point different coordinates",
      desc: "The faint square grid is the standard basis; the purple grid is made of the lines along b1=(2,1) and b2=(−1,1). The point v=(4,5) sits at the purple grid crossing reached by 3 steps along b1 and 2 steps along b2.",
      caption: "Reading [v]_B off the purple grid is solving 2c₁ − c₂ = 4, c₁ + c₂ = 5. The point did not move; only its description changed.",
    }, [p.svg()]);
  },

  /* §9: a direct sum (plane plus a line) and a non-direct sum (two planes sharing a line). */
  "la01-direct-sum"() {
    const P3 = view3(34, 20);
    const a = [1, 1, 0], b = [0, 1, 1], wdir = [1, 0, 1], x = [3, 4, 5], u = comb([1, 3], [a, b]), w = scale(2, wdir);
    check(same(add(u, w), x) && same(u, [1, 4, 3]), "(3,4,5) = (1,4,3) + (2,0,2)");
    const pts1 = [[0, 0, 0], x, comb([-0.6, -0.6], [a, b]), comb([1.8, 3.6], [a, b]), comb([1.8, -0.6], [a, b]), comb([-0.6, 3.6], [a, b]), scale(2.6, wdir), scale(-0.8, wdir)];
    const L = panel3({x: 30, y: 70, w: 420, h: 300, points: pts1, P3, title: "ℝ³ = U ⊕ Y: one way to split x"});
    L.patch([0, 0, 0], a, b, [-0.6, 1.8], [-0.6, 3.6], {fill: C.purple, opacity: 0.18, stroke: C.purple, width: 1.5});
    L.axes(2.2);
    L.line(scale(-0.8, wdir), [0, 0, 0], {color: C.orange, width: 2, dash: "4 5"});
    L.line([0, 0, 0], scale(2.6, wdir), {color: C.orange, width: 3});
    L.label(scale(-0.8, wdir), "Y = span{(1, 0, 1)}, dashed below U", {color: C.orange, size: 14, dx: -60, dy: 22});
    L.label(comb([-0.6, 3.6], [a, b]), "U", {color: C.purple, size: 18, dx: 6, dy: 20});
    L.line(u, x, {color: C.muted, dash: "5 5"});
    L.line(w, x, {color: C.muted, dash: "5 5"});
    L.arrow([0, 0, 0], u, {color: C.teal, label: "u = (1, 4, 3)", dx: 6, dy: 18});
    L.arrow([0, 0, 0], w, {color: C.orange, label: "w = (2, 0, 2)", dx: -100, dy: 22});
    L.arrow([0, 0, 0], x, {color: C.ink, width: 3, label: "x = (3, 4, 5)", dx: 8, dy: -6});
    const R = panel3({x: 470, y: 70, w: 420, h: 300, points: [[0, 0, 0], [2.4, 0, 0], [0, 2.8, 0], [0, 0, 2.4], [2.4, 2.8, 0], [0, 2.8, 2.4], [0, -0.6, 0]], P3, title: "U + Y not direct: overlap counted twice"});
    R.patch([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 2.4], [-0.6, 2.8], {fill: C.teal, opacity: 0.16, stroke: C.teal, width: 1.5});
    R.patch([0, 0, 0], [0, 1, 0], [0, 0, 1], [-0.6, 2.8], [0, 2.4], {fill: C.orange, opacity: 0.16, stroke: C.orange, width: 1.5});
    R.line([0, -0.6, 0], [0, 2.8, 0], {color: C.pink, width: 5});
    R.label([2.4, 0, 0], "U: z = 0", {color: C.teal, size: 15, dx: -30, dy: 22});
    R.label([0, 0, 2.4], "Y: x = 0", {color: C.orange, size: 15, dx: 8, dy: 4});
    R.label([0, 2.8, 0], "U ∩ Y = y-axis", {color: C.pink, size: 15, dx: -40, dy: -14});
    return figure({
      id: "la01-dsum", w: 920, h: 440,
      title: "A direct sum splits each vector once; a sum with overlap does not",
      desc: "Left: an oblique view of the plane U spanned by (1,1,0) and (0,1,1) and the line Y spanned by (1,0,1). The vector x=(3,4,5) is the diagonal of the parallelogram on u=(1,4,3) in U and w=(2,0,2) in Y. Right: the planes z=0 and x=0 meet along the y-axis, so their sum is all of three-space but has dimension 2+2−1.",
      caption: "Left: U ∩ Y = {0}, so x = u + w in exactly one way. Right: dim(U + Y) = 2 + 2 − 1 = 3; the shared line allows many splittings.",
    }, [L.p.svg(), R.p.svg()]);
  },

  /* §10: two recipes for one destination from dependent columns. */
  "la01-two-recipes"() {
    const v1 = [1, 0], v2 = [0, 1], v3 = [1, 1], w = [5, 4];
    check(same(comb([5, 4, 0], [v1, v2, v3]), w) && same(comb([4, 3, 1], [v1, v2, v3]), w), "two recipes");
    const p = panel({x: 60, y: 60, w: 780, h: 320, xmin: -0.8, xmax: 10, ymin: -0.6, ymax: 4.8});
    p.grid(1).axes();
    p.arrow([0, 0], [5, 0], {color: C.teal, width: 4, label: "5v₁", at: 0.5, dx: -10, dy: 24});
    p.arrow([5, 0], w, {color: C.teal, width: 4, label: "4v₂", at: 0.5, dx: 10, dy: 4});
    p.arrow([0, 0], [4, 0], {color: C.orange, width: 3, dash: "7 5"});
    p.arrow([4, 0], [4, 3], {color: C.orange, width: 3, dash: "7 5", label: "3v₂", at: 0.5, dx: -40, dy: 4});
    p.arrow([4, 3], w, {color: C.orange, width: 3, dash: "7 5", label: "1·v₃", at: 0.4, dx: -52, dy: -4});
    p.point(w, {color: C.ink, r: 7, label: "w = (5, 4)", dx: 12, dy: -8});
    p.label([6.4, 3.0], "t = 0: c = (5, 4, 0)", {color: C.teal, size: 16});
    p.label([6.4, 2.4], "t = 1: c = (4, 3, 1)", {color: C.orange, size: 16});
    p.label([6.4, 1.6], "difference (−1, −1, 1)", {color: C.label, size: 16});
    p.label([6.4, 1.1], "satisfies Vc = 0", {color: C.label, size: 16});
    return figure({
      id: "la01-recipes", w: 900, h: 430,
      title: "Dependent columns give several recipes for one vector",
      desc: "With columns v1=(1,0), v2=(0,1), v3=(1,1), the target w=(5,4) is reached by the solid path 5 v1 then 4 v2, and by the dashed path 4 v1, 3 v2, then one v3. The two coefficient lists differ by (−1,−1,1), a relation among the columns.",
      caption: "Vc = w has the solutions c = (5 − t, 4 − t, t); every pair of them differs by a multiple of (−1, −1, 1).",
    }, [text(450, 40, "V = [v₁ v₂ v₃] = [[1, 0, 1], [0, 1, 1]] (rows), w = (5, 4)", {color: C.label, size: 18, anchor: "middle"}), p.svg()]);
  },

  /* §11: the angle and shadow of the dot product; cross-talk among three unit features. */
  "la01-cosine"() {
    const u = [2, 1], v = [1, 3], proj = scale(dot(u, v) / dot(u, u), u);
    check(dot(u, v) === 5 && same(proj, u) && Math.abs(dot(sub(v, proj), u)) < 1e-12, "projection of v on u is u");
    check(Math.abs(dot(u, v) / (norm(u) * norm(v)) - Math.SQRT1_2) < 1e-12, "cos = 1/√2");
    const a = panel({x: 40, y: 70, w: 420, h: 300, xmin: -0.6, xmax: 3.6, ymin: -1.1, ymax: 3.5, title: "u = (2, 1), v = (1, 3): cos θ = 5/(√5·√10) = 1/√2"});
    a.grid(1).axes();
    a.fullLine([0, 0], u, {color: C.dim, width: 1.5, dash: "4 6"});
    const t0 = Math.atan2(u[1], u[0]), t1 = Math.atan2(v[1], v[0]);
    a.curve(t => [0.7 * Math.cos(t), 0.7 * Math.sin(t)], t0, t1, {color: C.orange, width: 2.5});
    a.label([0.62, 0.72], "θ = 45°", {color: C.orange, size: 15});
    a.line(v, proj, {color: C.muted, dash: "5 5"});
    a.rightAngle(proj, scale(-1, u), sub(v, proj), {size: 0.2});
    a.arrow([0, 0], u, {color: C.teal, label: "u", dx: 6, dy: 20});
    a.arrow([0, 0], v, {color: C.purple, label: "v", dx: -20, dy: 0});
    a.label([-0.5, -0.65], "shadow of v on u: (u·v)/‖u‖ = √5", {color: C.label, size: 14});
    a.label([-0.5, -0.95], "Cauchy–Schwarz: √5 ≤ ‖v‖ = √10", {color: C.label, size: 14});
    const f = [[1, 0], [-0.5, Math.sqrt(3) / 2], [-0.5, -Math.sqrt(3) / 2]], x = add(f[0], f[1]);
    const reads = f.map(g => dot(g, x));
    check(Math.abs(reads[0] - 0.5) < 1e-12 && Math.abs(reads[1] - 0.5) < 1e-12 && Math.abs(reads[2] + 1) < 1e-12, "readouts");
    const b = panel({x: 490, y: 70, w: 390, h: 300, xmin: -1.4, xmax: 1.6, ymin: -1.3, ymax: 1.3, title: "x = f₁ + f₂: readouts fᵢ·x"});
    b.grid(0.5, {width: 1}).axes();
    b.curve(t => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, {color: C.dim, width: 1.5, dash: "3 5"});
    b.arrow([0, 0], f[0], {color: C.teal, label: "f₁ · x = 1/2", dx: -40, dy: 24});
    b.arrow([0, 0], f[1], {color: C.teal, label: "f₂ · x = 1/2", dx: -100, dy: -6});
    b.arrow([0, 0], f[2], {color: C.pink, label: "f₃ · x = −1", dx: -100, dy: 14});
    b.arrow([0, 0], x, {color: C.ink, width: 3, label: "x = (1/2, √3/2)", dx: 8, dy: -4});
    return figure({
      id: "la01-cos", w: 920, h: 430,
      title: "The dot product measures angle and overlap",
      desc: "Left: u=(2,1) and v=(1,3) meet at 45 degrees; dropping a perpendicular from v to the line of u lands exactly at u, so the shadow has length √5. Right: three unit vectors 120 degrees apart; the activation x=f1+f2 reads 1/2 on f1 and on f2, and −1 on the inactive f3.",
      caption: "Right: each active feature reads 1/2, not 1, and the inactive one reads −1: overlap between directions is cross-talk.",
    }, [a.svg(), b.svg()]);
  },

  /* §12: an affine line is a translate of a subspace; affine combinations stay on it. */
  "la01-subspace-vs-affine"() {
    const p0 = [1, 0], q0 = [0, 1], d = sub(q0, p0), mid = scale(0.5, add(p0, q0)), s = add(p0, q0);
    check(same(d, [-1, 1]) && mid[0] + mid[1] === 1 && s[0] + s[1] === 2, "affine checks");
    const p = panel({x: 60, y: 60, w: 780, h: 320, xmin: -2.4, xmax: 2.8, ymin: -1.6, ymax: 2.2});
    p.grid(0.5, {width: 1}).axes();
    p.fullLine([0, 0], d, {color: C.purple, width: 3, dash: "8 6"});
    p.fullLine(p0, d, {color: C.teal, width: 4});
    p.label([1.05, 2.0], "dashed: S = span{(−1, 1)}, x + y = 0", {color: C.purple, size: 15});
    p.label([1.05, 1.72], "solid: x₀ + S with x₀ = p, x + y = 1", {color: C.teal, size: 15});
    p.arrow([0, 0], d, {color: C.purple, width: 3, label: "q − p = (−1, 1) ∈ S", dx: -150, dy: -8});
    p.point(p0, {color: C.teal, r: 6, label: "p = (1, 0)", dx: 8, dy: 22});
    p.point(q0, {color: C.teal, r: 6, label: "q = (0, 1)", dx: -86, dy: -8});
    p.point(mid, {color: C.green, r: 6, label: "½p + ½q = (½, ½)", dx: 12, dy: 6});
    p.point(s, {color: C.pink, r: 6, label: "p + q = (1, 1): x + y = 2", dx: 10, dy: -8});
    p.point([0, 0], {color: C.ink, r: 4});
    return figure({
      id: "la01-affine", w: 900, h: 430,
      title: "An affine line is a subspace translated away from the origin",
      desc: "The dashed purple line x+y=0 is the subspace S spanned by (−1,1). The teal line x+y=1 is S shifted by the anchor p=(1,0). The displacement q−p between two points on the teal line lies in S. The midpoint (1/2,1/2) stays on the teal line; the sum (1,1) leaves it.",
      caption: "Coefficients summing to 1 keep a combination on x₀ + S; the plain sum p + q has coefficients summing to 2.",
    }, [p.svg()]);
  },

  /* §13: coordinates of (0, 1) in the basis (1, 0), (1, ε) grow like 1/ε. */
  "la01-near-collapse"() {
    const v = [0, 1], mk = (x, eps) => {
      const b2 = [1, eps], c = [-1 / eps, 1 / eps];
      check(same(comb(c, [[1, 0], b2]), v), "coordinates at ε=" + eps);
      const p = panel({x, y: 90, w: 410, h: 250, xmin: -4.8, xmax: 1.6, ymin: -0.7, ymax: 1.7, title: `ε = ${eps}: [v]_B = (${fmt(c[0])}, ${fmt(c[1])})`});
      p.grid(1, {M: [[1, 1], [0, eps]], color: C.purple, width: 1, range: [-12, 12]}).axes();
      p.arrow([0, 0], [1, 0], {color: C.teal, label: "b₁", dx: -6, dy: 22});
      p.arrow([0, 0], b2, {color: C.teal, label: "b₂", dx: 4, dy: -8});
      p.arrow([0, 0], scale(c[0], [1, 0]), {color: C.orange, width: 3, dash: "7 5", label: `${fmt(c[0])}·b₁`, at: 0.5, dx: -10, dy: 22});
      p.arrow(scale(c[0], [1, 0]), v, {color: C.orange, width: 3, dash: "7 5", label: `+ ${fmt(c[1])}·b₂`, at: 0.45, dx: -70, dy: -10});
      p.point(v, {color: C.ink, r: 6, label: "v = (0, 1)", dx: 8, dy: -8});
      return p;
    };
    return figure({
      id: "la01-near", w: 900, h: 420,
      title: "Nearly parallel basis vectors can force huge coordinates",
      desc: "Two panels with b1=(1,0) and b2=(1,ε). For ε=0.5 the point (0,1) needs coordinates (−2,2); for ε=0.25 it needs (−4,4). The dashed path walks far left along b1 and back along b2, and the purple coordinate cells become long and thin.",
      caption: "[v]_B = (−1/ε, 1/ε): halving ε doubles both coordinates, and at ε = 0 no recipe exists.",
    }, [text(450, 40, "b₁ = (1, 0), b₂ = (1, ε), v = (0, 1)", {color: C.label, size: 18, anchor: "middle"}), mk(30, 0.5).svg(), mk(460, 0.25).svg()]);
  },
};
