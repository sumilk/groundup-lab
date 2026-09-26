/* LA09 figures: norms, conditioning, and numerical stability.
   Every drawn shape is computed from the matrices named in the lesson text. */
import {C, figure, panel, text, mv} from "./svgkit.mjs";

const heading = s => text(450, 44, s, {color: C.label, size: 18, anchor: "middle"});

export default {
  /* §1: the three unit balls are nested, which is the inequality chain. */
  "la09-unit-balls"() {
    const p = panel({x: 250, y: 64, w: 400, h: 310, xmin: -1.35, xmax: 1.35, ymin: -1.2, ymax: 1.2});
    p.grid(0.5).axes();
    p.polygon([[1, 1], [-1, 1], [-1, -1], [1, -1]], {fill: C.orange, opacity: 0.12, stroke: C.orange, width: 3});
    p.ellipse([[1, 0], [0, 1]], {color: C.teal, width: 3, fill: C.teal, opacity: 0.12});
    p.polygon([[1, 0], [0, 1], [-1, 0], [0, -1]], {fill: C.purple, opacity: 0.18, stroke: C.purple, width: 3});
    const u = [0.6, -0.8];
    p.arrow([0, 0], u, {color: C.ink, width: 3});
    p.point(u, {color: C.ink, r: 4});
    p.label(u, "x/5 = (0.6, −0.8)", {color: C.ink, dx: 70, dy: 18});
    return figure({
      id: "la09-balls", w: 900, h: 430,
      title: "Unit balls of the 1-, 2-, and infinity norms",
      desc: "A diamond (1-norm), a disk (2-norm), and a square (infinity norm) are drawn as nested unit balls. The unit vector (0.6, −0.8) lies on the disk, outside the diamond, and inside the square.",
      caption: "The diamond sits inside the disk, which sits inside the square: ‖x‖∞ ≤ ‖x‖₂ ≤ ‖x‖₁.",
    }, [heading("Where does ‖x‖ = 1 lie?"), p.svg(),
      text(60, 150, "‖x‖₁ ≤ 1", {color: C.purple, size: 18, weight: 600}), text(60, 176, "diamond", {color: C.purple, size: 15}),
      text(60, 226, "‖x‖₂ ≤ 1", {color: C.teal, size: 18, weight: 600}), text(60, 252, "disk", {color: C.teal, size: 15}),
      text(60, 302, "‖x‖∞ ≤ 1", {color: C.orange, size: 18, weight: 600}), text(60, 328, "square", {color: C.orange, size: 15}),
      text(690, 150, "For x/5 = (0.6, −0.8):", {color: C.label, size: 15}),
      text(690, 180, "‖·‖₁ = 1.4  outside", {color: C.purple, size: 15}),
      text(690, 206, "‖·‖₂ = 1.0  on the edge", {color: C.teal, size: 15}),
      text(690, 232, "‖·‖∞ = 0.8  inside", {color: C.orange, size: 15})]);
  },

  /* §3: A = diag(1, ε) with ε = 1/4. A small disk of data errors becomes a long ellipse of solution errors. */
  "la09-condition-amplify"() {
    const eps = 0.25, d = 0.2;
    const left = panel({x: 50, y: 80, w: 380, h: 280, xmin: -0.2, xmax: 1.6, ymin: -1.0, ymax: 1.0, title: "Data space: b and b + f, ‖f‖ ≤ δ"});
    left.grid(0.25).axes();
    left.ellipse([[d, 0], [0, d]], {c: [1, 0], color: C.orange, width: 2.5, fill: C.orange, opacity: 0.15});
    left.arrow([0, 0], [1, 0], {color: C.teal, label: "b = e₁", at: 0.4, dx: -20, dy: -12});
    left.arrow([1, 0], [1, d], {color: C.pink, width: 3, head: 9, label: "f = δe₂", dx: 26, dy: -10});
    left.arrow([1, 0], [1 + d, 0], {color: C.blue, width: 3, head: 9, label: "δe₁", dx: 8, dy: 24});
    const right = panel({x: 470, y: 80, w: 380, h: 280, xmin: -0.2, xmax: 1.6, ymin: -1.0, ymax: 1.0, title: "Solution space: x + A⁻¹f"});
    right.grid(0.25).axes();
    right.ellipse([[d, 0], [0, d / eps]], {c: [1, 0], color: C.orange, width: 2.5, fill: C.orange, opacity: 0.15});
    right.arrow([0, 0], [1, 0], {color: C.teal, label: "x = e₁", at: 0.4, dx: -20, dy: -12});
    right.arrow([1, 0], [1, d / eps], {color: C.pink, width: 3, head: 9, label: "(δ/ε)e₂", dx: 30, dy: 16});
    right.arrow([1, 0], [1 + d, 0], {color: C.blue, width: 3, head: 9, label: "δe₁", dx: 8, dy: 24});
    return figure({
      id: "la09-amp", w: 900, h: 430,
      title: "The inverse stretches data errors along the weak direction",
      desc: "Left: a small disk of right-hand-side perturbations around b = e1. Right: its image under the inverse of diag(1, 1/4), an ellipse four times taller than wide around x = e1. A perturbation along e2 grows fourfold, one along e1 does not grow.",
      caption: "Drawn for A = diag(1, ¼): the same-size push f grows 4 = κ₂ times along e₂ and not at all along e₁.",
    }, [left.svg(), right.svg()]);
  },

  /* §4: the smallest singularizing perturbation squashes the image ellipse onto its long axis. */
  "la09-distance-singular"() {
    const th = Math.PI / 6, R = [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];
    const s1 = 1.5, s2 = 0.5;
    const A = [[R[0][0] * s1, R[0][1] * s2], [R[1][0] * s1, R[1][1] * s2]]; // A = R diag(σ₁,σ₂), V = I
    const Asing = [[R[0][0] * s1, 0], [R[1][0] * s1, 0]];
    const u1 = [R[0][0], R[1][0]], u2 = [R[0][1], R[1][1]];
    const L = panel({x: 50, y: 80, w: 380, h: 280, xmin: -1.8, xmax: 1.8, ymin: -1.35, ymax: 1.35, title: "A maps the unit circle to an ellipse"});
    L.grid(0.5).axes();
    L.ellipse([[1, 0], [0, 1]], {color: C.dim, width: 2, dash: "5 5"});
    L.ellipse(A, {color: C.teal, width: 3, fill: C.teal, opacity: 0.12});
    L.arrow([0, 0], [s1 * u1[0], s1 * u1[1]], {color: C.orange, width: 3, label: "σ₁u₁", dx: 4, dy: -6});
    L.arrow([0, 0], [s2 * u2[0], s2 * u2[1]], {color: C.pink, width: 3, head: 10, label: "σ₂u₂", dx: -48, dy: -2});
    const Rp = panel({x: 470, y: 80, w: 380, h: 280, xmin: -1.8, xmax: 1.8, ymin: -1.35, ymax: 1.35, title: "A − σ₂u₂v₂ᵀ: the ellipse collapses"});
    Rp.grid(0.5).axes();
    Rp.ellipse(A, {color: C.dim, width: 2, dash: "5 5"});
    Rp.ellipse(Asing, {color: C.teal, width: 4});
    Rp.arrow([s2 * u2[0], s2 * u2[1]], [0, 0], {color: C.pink, width: 3, head: 10, label: "removed: size σ₂", dx: -150, dy: -18, at: 0});
    Rp.point([0, 0], {color: C.ink, r: 4});
    const probe = mv(Asing, [0, 1]);
    if (Math.hypot(...probe) > 1e-12) throw new Error("singular map should kill v2");
    return figure({
      id: "la09-dist", w: 900, h: 430,
      title: "Distance to a singular matrix is the smallest singular value",
      desc: "Left: A = R diag(1.5, 0.5) maps the unit circle to an ellipse with semi-axes 1.5 and 0.5. Right: subtracting the rank-one piece 0.5 u2 v2 transpose flattens the ellipse onto a segment of half-length 1.5, so the perturbed matrix is singular.",
      caption: "Flattening the ellipse costs exactly its short semi-axis σ₂ = 0.5 in the 2-norm; relative to ‖A‖₂ = 1.5 that is 1/κ₂ = 1/3.",
    }, [L.svg(), Rp.svg()]);
  },

  /* §5: residual lives in data space, error in solution space. A = diag(1, ε), ε = 0.1, x̂ = (1, 1). */
  "la09-residual-vs-error"() {
    const eps = 0.1;
    const L = panel({x: 50, y: 80, w: 380, h: 280, xmin: -0.3, xmax: 1.5, ymin: -0.3, ymax: 1.3, title: "Solution space: forward error ‖x̂ − x‖ = 1"});
    L.grid(0.25).axes();
    L.point([1, 0], {color: C.green, r: 7, label: "x = (1, 0)", dx: 10, dy: 22});
    L.point([1, 1], {color: C.pink, r: 7, label: "x̂ = (1, 1)", dx: 10, dy: -8});
    L.arrow([1, 0], [1, 1], {color: C.pink, width: 3, head: 10, dash: "7 5"});
    const Rp = panel({x: 470, y: 80, w: 380, h: 280, xmin: 0.64, xmax: 1.36, ymin: -0.15, ymax: 0.15 + 0.7 / 3, title: "Data space, zoomed: residual = 0.1"});
    const zoom = Rp.scale / L.scale;
    if (Math.abs(zoom - 3) > 1e-9) throw new Error("data panel should be magnified exactly 3x, got " + zoom);
    Rp.grid(0.05).axes();
    const Axh = mv([[1, 0], [0, eps]], [1, 1]);
    Rp.arrow([1, 0], Axh, {color: C.pink, width: 3, head: 12});
    Rp.point([1, 0], {color: C.green, r: 7, label: "b = (1, 0)", dx: 10, dy: 22});
    Rp.point(Axh, {color: C.pink, r: 7, label: "Ax̂ = (1, 0.1)", dx: 10, dy: -10});
    return figure({
      id: "la09-resid", w: 900, h: 430,
      title: "A small residual can hide a large error",
      desc: "For A = diag(1, 0.1), the candidate (1,1) is a distance 1 from the true solution (1,0) in solution space, but A maps it to (1, 0.1), only 0.1 away from b in data space.",
      caption: "A = diag(1, 0.1) shrinks the miss tenfold (right panel magnified 3×): κ₂ = 10 is the exchange rate between the pictures.",
    }, [L.svg(), Rp.svg()]);
  },

  /* §7: row picture of the unpivoted solve. The returned point satisfies row 1 and ignores row 2. */
  "la09-unpivoted-rows"() {
    const p = panel({x: 60, y: 70, w: 780, h: 300, xmin: -1.2, xmax: 3.2, ymin: -0.4, ymax: 2.4});
    p.grid(0.5).axes();
    // Row 1: εx + y = 1 (indistinguishable from y = 1 at ε = 1e-20). Row 2: x + y = 2.
    p.fullLine([0, 1], [1, 0], {color: C.teal, width: 3});
    p.fullLine([0, 2], [1, -1], {color: C.orange, width: 3});
    p.point([1, 1], {color: C.green, r: 7, label: "exact (1, 1)", dx: 12, dy: -12});
    p.point([0, 1], {color: C.pink, r: 7, label: "unpivoted x̂ = (0, 1)", dx: -190, dy: -14});
    p.line([0, 1], [0, 2], {color: C.pink, width: 2.5, dash: "6 5"});
    p.point([0, 2], {color: C.orange, r: 4});
    p.label([0, 1.55], "vertical gap to row 2 = residual 2 − (0 + 1) = 1", {color: C.pink, size: 15, dx: -330});
    p.label([2.35, 1.0], "row 1: εx + y = 1", {color: C.teal, dy: -12});
    p.label([2.2, -0.2], "row 2: x + y = 2", {color: C.orange, dx: 8});
    return figure({
      id: "la09-rows", w: 900, h: 430,
      title: "An unstable solve lands on one equation and ignores the other",
      desc: "Two lines, the nearly horizontal first row and the diagonal second row, meet at (1,1). Elimination without row exchanges returns (0,1), which lies exactly on the first line but leaves a residual of 1 in the second equation.",
      caption: "The problem is well conditioned (κ₂ ≈ 2.6): the lines cross at a healthy angle. The algorithm lost row 2.",
    }, [heading("Row picture of A = [[ε, 1], [1, 1]], b = (1, 2), ε = 10⁻²⁰"), p.svg()]);
  },

  /* §8: row scaling D = diag(1, 1/ε) rounds the matrix but stretches the data uncertainty. ε = 1/2. */
  "la09-row-scaling"() {
    const eps = 0.5, d = 0.35;
    const L = panel({x: 50, y: 80, w: 380, h: 280, xmin: -1.5, xmax: 1.5, ymin: -1.1, ymax: 1.1, title: "Original: image of A, disk of data errors"});
    L.grid(0.5).axes();
    L.ellipse([[1, 0], [0, eps]], {color: C.teal, width: 3, fill: C.teal, opacity: 0.12});
    L.ellipse([[d, 0], [0, d]], {color: C.orange, width: 2.5, fill: C.orange, opacity: 0.18});
    L.label([1.02, 0.1], "A(unit circle)", {color: C.teal, size: 14});
    L.label([-0.2, -0.75], "data errors ‖f‖ ≤ δ", {color: C.orange, size: 14, anchor: "middle"});
    const R = panel({x: 470, y: 80, w: 380, h: 280, xmin: -1.5, xmax: 1.5, ymin: -1.1, ymax: 1.1, title: "After D = diag(1, 1/ε): DA = I, Df stretched"});
    R.grid(0.5).axes();
    R.ellipse([[1, 0], [0, 1]], {color: C.teal, width: 3, fill: C.teal, opacity: 0.12});
    R.ellipse([[d, 0], [0, d / eps]], {color: C.orange, width: 2.5, fill: C.orange, opacity: 0.18});
    R.label([0.72, 0.8], "DA(circle): a circle", {color: C.teal, size: 14});
    R.label([0.5, -0.45], "Df reaches δ/ε", {color: C.orange, size: 14});
    return figure({
      id: "la09-scale", w: 900, h: 430,
      title: "Row scaling moves the difficulty from the matrix into the data",
      desc: "Left: A = diag(1, 1/2) maps the unit circle to a flat ellipse, and data errors form a small disk. Right: after scaling the second row by 2, the matrix image is a circle, but the same data errors, expressed in scaled units, form an ellipse twice as tall.",
      caption: "Drawn for ε = ½. The scaled matrix is perfectly conditioned, but in scaled units the same data errors are twice as tall.",
    }, [L.svg(), R.svg()]);
  },
  /* §7: binary64 numbers near 1, in units of 2⁻⁵⁴. 1 + 2⁻⁵⁴ lies in the rounding interval of 1. */
  "la09-rounding-near-one"() {
    const p = panel({x: 60, y: 90, w: 780, h: 220, xmin: -3.2, xmax: 6.2, ymin: -1.1, ymax: 1.3});
    p.line([-3.2, 0], [6.2, 0], {color: C.axis, width: 3});
    // Rounding interval of 1: from the midpoint below (1 − 2⁻⁵⁴) to the midpoint above (1 + 2⁻⁵³).
    p.polygon([[-1, -0.18], [2, -0.18], [2, 0.18], [-1, 0.18]], {fill: C.teal, opacity: 0.22, stroke: C.teal, width: 1.5});
    for (const [u, name] of [[-2, "1 − 2⁻⁵³"], [0, "1"], [4, "1 + 2⁻⁵²"]]) {
      p.line([u, -0.3], [u, 0.3], {color: C.ink, width: 3});
      p.label([u, -0.62], name, {color: C.ink, size: 16, anchor: "middle"});
    }
    p.label([4, 0.5], "ticks: binary64 numbers", {color: C.label, size: 15, anchor: "middle"});
    p.point([1, 0], {color: C.pink, r: 7});
    p.label([1.6, -0.62], "1 + t,  t = 2⁻⁵⁴", {color: C.pink, size: 16, anchor: "start"});
    p.arrow([0.92, 0.28], [0.12, 0.28], {color: C.pink, width: 2.5, head: 9});
    p.label([0.5, 0.95], "rounds to 1", {color: C.pink, size: 15, anchor: "middle"});
    p.label([0.5, -1.0], "everything in the shaded band rounds to 1", {color: C.teal, size: 15, anchor: "middle"});
    return figure({
      id: "la09-round", w: 900, h: 400,
      title: "Why 1 + 2⁻⁵⁴ rounds to 1 in binary64",
      desc: "A number line near 1 marked in units of 2 to the minus 54. Binary64 numbers sit at 1 minus 2 to the minus 53, at 1, and at 1 plus 2 to the minus 52. The shaded band of numbers that round to 1 runs from 1 minus 2 to the minus 54 up to 1 plus 2 to the minus 53, and it contains 1 plus 2 to the minus 54.",
      caption: "Above 1 the spacing is 2⁻⁵²; the nearest neighbour of 1 + 2⁻⁵⁴ is 1 itself, so the information in t is gone.",
    }, [text(450, 50, "Binary64 near 1 (horizontal unit = 2⁻⁵⁴)", {color: C.label, size: 18, anchor: "middle"}), p.svg()]);
  },

  /* §2: induced 1- and infinity norms read off the images of the unit diamond and square. */
  "la09-induced-shapes"() {
    const A = [[1, -2], [3, 0]];
    const img = pts => pts.map(q => mv(A, q));
    const diamond = [[1, 0], [0, 1], [-1, 0], [0, -1]], square = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
    const L = panel({x: 50, y: 80, w: 380, h: 290, xmin: -4.4, xmax: 4.4, ymin: -4.4, ymax: 4.4, title: "1-norm: image of the diamond"});
    L.grid(1).axes();
    L.polygon(diamond.map(([u, v]) => [4 * u, 4 * v]), {fill: C.purple, opacity: 0, stroke: C.purple, width: 2, dash: "6 5"});
    L.polygon(diamond, {fill: C.dim, opacity: 0.25, stroke: C.dim, width: 2});
    L.polygon(img(diamond), {fill: C.teal, opacity: 0.18, stroke: C.teal, width: 3});
    L.point(mv(A, [1, 0]), {color: C.orange, r: 6, label: "Ae₁ = (1, 3)", dx: 10, dy: -4});
    L.label([2.3, -3.4], "‖·‖₁ = 4", {color: C.purple, size: 15});
    const R = panel({x: 470, y: 80, w: 380, h: 290, xmin: -4.4, xmax: 4.4, ymin: -4.4, ymax: 4.4, title: "∞-norm: image of the square"});
    R.grid(1).axes();
    R.polygon(square.map(([u, v]) => [3 * u, 3 * v]), {fill: C.orange, opacity: 0, stroke: C.orange, width: 2, dash: "6 5"});
    R.polygon(square, {fill: C.dim, opacity: 0.25, stroke: C.dim, width: 2});
    R.polygon(img(square), {fill: C.teal, opacity: 0.18, stroke: C.teal, width: 3});
    R.point(mv(A, [1, -1]), {color: C.orange, r: 6, label: "A(1, −1) = (3, 3)", dx: -150, dy: -12});
    R.label([1.2, -3.9], "‖·‖∞ = 3", {color: C.orange, size: 15});
    // sanity: the images touch but do not cross the dashed balls
    const l1 = Math.max(...img(diamond).map(([a, b]) => Math.abs(a) + Math.abs(b)));
    const li = Math.max(...img(square).map(([a, b]) => Math.max(Math.abs(a), Math.abs(b))));
    if (l1 !== 4 || li !== 3) throw new Error("induced-norm figure disagrees with the text");
    return figure({
      id: "la09-shapes", w: 900, h: 430,
      title: "Induced norms as the farthest reach of an image",
      desc: "Left: the unit diamond and its image under A = [[1,−2],[3,0]], a parallelogram whose corner (1,3) touches the dashed diamond of radius 4. Right: the unit square and its image, whose corner (3,3) touches the dashed square of radius 3.",
      caption: "Grey: unit ball. Teal: its image under A. Dashed: the smallest ball of the same shape containing the image.",
    }, [L.svg(), R.svg()]);
  },

  /* §5: backward error in the row picture. A = diag(1, 0.1), b = (1, 0), x̂ = (1, 1). */
  "la09-backward-lines"() {
    const t = Math.SQRT2 / (Math.SQRT2 + 1), e = -0.1 * t / 2, f2 = 0.1 * (1 - t);
    const a21 = e, a22 = 0.1 + e; // perturbed second row
    if (Math.abs(a21 + a22 - f2) > 1e-12) throw new Error("perturbed row must pass through x̂");
    const p = panel({x: 60, y: 70, w: 780, h: 300, xmin: -0.6, xmax: 2.6, ymin: -0.4, ymax: 1.5});
    p.grid(0.5).axes();
    p.fullLine([1, 0], [0, 1], {color: C.teal, width: 3});
    p.fullLine([0, 0], [1, 0], {color: C.orange, width: 3, dash: "8 6"});
    p.fullLine([0, f2 / a22], [a22, -a21], {color: C.orange, width: 3});
    p.point([1, 0], {color: C.green, r: 7, label: "x = (1, 0)", dx: 12, dy: 22});
    p.point([1, 1], {color: C.pink, r: 7, label: "x̂ = (1, 1)", dx: -100, dy: -12});
    p.label([1.02, -0.3], "row 1: x = 1 (unchanged)", {color: C.teal, size: 15, dx: 8});
    p.label([1.8, -0.02], "row 2 before: 0.1y = 0", {color: C.orange, size: 15, dy: -10});
    p.label([1.3, 1.02], "row 2 after: −0.029x + 0.071y = 0.041", {color: C.orange, size: 15, dy: 22});
    return figure({
      id: "la09-back", w: 900, h: 430,
      title: "Backward error tilts and shifts the equations to pass through x̂",
      desc: "Row picture for A = diag(1, 0.1) and b = (1, 0). The first row, the vertical line x = 1, is unchanged. The second row, originally the horizontal line y = 0, is tilted and shifted by a small change to its coefficients so that it passes through the candidate (1, 1).",
      caption: "A change of 4% of ‖A‖, but about 40% of the weak row itself, moves the line a long way.",
    }, [text(450, 44, "Row picture of the nearby problem (A + E)x̂ = b + f", {color: C.label, size: 18, anchor: "middle"}), p.svg()]);
  },
};
