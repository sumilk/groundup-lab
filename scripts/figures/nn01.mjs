/* NN01 figures: threshold networks drawn next to the regions they carve out.
   Each figure takes one network spec and draws both panels from it: the region
   is shaded by evaluating the network on a grid, so the picture cannot disagree
   with the weights printed on the diagram. */
import {C, figure, panel, text} from "./svgkit.mjs";

const H = z => (z >= 0 ? 1 : 0);
const fmtNum = v => (v < 0 ? "−" + Math.abs(v) : String(v));

/** Evaluate a layered spec {inputs, layers:[[{n, w:{name:weight}, b}]]} at a point. */
function evaluate(spec, values) {
  const env = {...values};
  for (const layer of spec.layers)
    for (const u of layer) env[u.n] = H(Object.entries(u.w).reduce((s, [k, w]) => s + w * env[k], u.b));
  return env;
}

/** Shade the region where the network's output fires, cell by cell, then draw edge lines. */
function regionPanel(spec, box, {lines = []} = {}) {
  const p = panel(box);
  const out = spec.layers.at(-1)[0].n, N = 120;
  const dx = (box.xmax - box.xmin) / N, dy = (box.ymax - box.ymin) / N;
  p.grid(1).axes();
  // Run-length encode the firing cells: runs along each row, then identical rows merged into one block.
  const rows = [];
  for (let j = 0; j < N; j++) {
    const runs = [];
    for (let i = 0; i < N; i++) {
      const fires = evaluate(spec, {"x₁": box.xmin + (i + 0.5) * dx, "x₂": box.ymin + (j + 0.5) * dy})[out];
      if (fires && runs.length && runs.at(-1)[1] === i) runs.at(-1)[1] = i + 1;
      else if (fires) runs.push([i, i + 1]);
    }
    rows.push(JSON.stringify(runs));
  }
  let d = "";
  for (let j0 = 0; j0 < N;) {
    let j1 = j0 + 1;
    while (j1 < N && rows[j1] === rows[j0]) j1++;
    for (const [i0, i1] of JSON.parse(rows[j0])) {
      const [px0, py1] = p.P([box.xmin + i0 * dx, box.ymin + j0 * dy]), [px1, py0] = p.P([box.xmin + i1 * dx, box.ymin + j1 * dy]);
      d += `M${px0.toFixed(1)} ${py0.toFixed(1)}H${px1.toFixed(1)}V${py1.toFixed(1)}H${px0.toFixed(1)}Z`;
    }
    j0 = j1;
  }
  if (d) p.raw(`<path d="${d}" fill="${C.pink}" fill-opacity="0.32"/>`);
  for (const {p: a, d, label, at} of lines) {
    p.fullLine(a, d, {color: C.teal, width: 2, dash: "6 5"});
    if (label) p.label(at, label, {color: C.teal, size: 15});
  }
  for (const v of [-2, 2].filter(v => v > box.xmin && v < box.xmax)) p.label([v, 0], fmtNum(v), {color: C.label, size: 13, dx: -6, dy: 18});
  for (const v of [-2, 2].filter(v => v > box.ymin && v < box.ymax)) p.label([0, v], fmtNum(v), {color: C.label, size: 13, dx: 6, dy: 5});
  p.label([box.xmax, 0], "x₁", {color: C.label, size: 14, dx: -22, dy: -8});
  p.label([0, box.ymax], "x₂", {color: C.label, size: 14, dx: 8, dy: 16});
  return p.svg();
}

/** Node-link diagram: weights on the edges, biases inside the nodes. */
function networkPanel(spec, {x, y, w, h}) {
  const cols = [spec.inputs, ...spec.layers.map(l => l.map(u => u.n))];
  const pos = {};
  cols.forEach((col, ci) => col.forEach((n, ri) => {
    pos[n] = [x + 30 + ci * (w - 60) / (cols.length - 1), y + (ri + 0.5) * h / col.length];
  }));
  const parts = [];
  spec.layers.forEach((layer, li) => layer.forEach(u => Object.entries(u.w).forEach(([k, wt]) => {
    const [x0, y0] = pos[k], [x1, y1] = pos[u.n];
    parts.push(`<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${wt > 0 ? C.dim : C.purple}" stroke-width="1.8"/>`);
    if (li > 0 && wt === 1) return;            // later layers: unlabelled edges have weight 1
    const t = 0.42, lx = x0 + (x1 - x0) * t, ly = y0 + (y1 - y0) * t;
    parts.push(`<rect x="${lx - 12}" y="${ly - 10}" width="24" height="17" rx="4" fill="${C.bg}"/>`);
    parts.push(text(lx, ly + 3, fmtNum(wt), {color: wt > 0 ? C.label : C.purple, size: 12, anchor: "middle"}));
  })));
  for (const n of spec.inputs) {
    const [cx, cy] = pos[n];
    parts.push(`<circle cx="${cx}" cy="${cy}" r="17" fill="${C.bg}" stroke="${C.label}" stroke-width="2"/>`);
    parts.push(text(cx, cy + 5, n, {color: C.ink, size: 15, anchor: "middle"}));
  }
  for (const layer of spec.layers) for (const u of layer) {
    const [cx, cy] = pos[u.n];
    parts.push(`<circle cx="${cx}" cy="${cy}" r="18" fill="${C.bg}" stroke="${u === spec.layers.at(-1)[0] ? C.pink : C.teal}" stroke-width="2.4"/>`);
    parts.push(text(cx, cy + 5, fmtNum(u.b), {color: C.ink, size: 14, anchor: "middle"}));
    parts.push(text(cx + 24, cy + 5, u.n, {color: C.label, size: 14}));
  }
  parts.push(text(x + w / 2, y + h + 26, "edges: weights (unlabelled = 1) · nodes: biases · fire when sum + bias ≥ 0",
    {color: C.muted, size: 13, anchor: "middle"}));
  return parts.join("\n  ");
}

const SQUARE_UNITS = [
  {n: "h₁", w: {"x₁": -1}, b: 1}, {n: "h₂", w: {"x₂": -1}, b: 1},
  {n: "h₃", w: {"x₁": 1}, b: 1}, {n: "h₄", w: {"x₂": 1}, b: 1}
];
const squareLines = [
  {p: [1, 0], d: [0, 1], label: "h₁: x₁ ≤ 1", at: [1.08, 2.3]}, {p: [0, 1], d: [1, 0], label: "h₂: x₂ ≤ 1", at: [-2.9, 1.18]},
  {p: [-1, 0], d: [0, 1], label: "h₃: x₁ ≥ −1", at: [-2.75, -2.3]}, {p: [0, -1], d: [1, 0], label: "h₄: x₂ ≥ −1", at: [1.15, -1.32]}
];
const box = {x: 40, y: 70, w: 380, h: 330, xmin: -3, xmax: 3, ymin: -3, ymax: 3};
const net = {x: 450, y: 70, w: 400, h: 340};

export default {
  /* §7: a convex region is an AND of half-planes. */
  "nn01-square-network"() {
    const spec = {inputs: ["x₁", "x₂"], layers: [SQUARE_UNITS, [{n: "y", w: {"h₁": 1, "h₂": 1, "h₃": 1, "h₄": 1}, b: -4}]]};
    return figure({
      id: "nn01-square", w: 900, h: 500,
      title: "A square as four fences and an AND",
      desc: "Left: the square with corners at (±1, ±1) shaded, with its four edge lines labelled h1 to h4. Right: the 2–4–1 network. Each hidden unit has weight ±1 from one input and bias 1; the output has weight 1 from each hidden unit and bias −4, so it fires only when all four fire.",
      caption: "2–4–1: the output fires only when h₁ + h₂ + h₃ + h₄ ≥ 4, that is, inside all four fences.",
    }, [regionPanel(spec, box, {lines: squareLines}), networkPanel(spec, net)]);
  },

  /* §7: the complement keeps the same hidden layer and changes only the output (De Morgan). */
  "nn01-outside-square"() {
    const spec = {inputs: ["x₁", "x₂"], layers: [SQUARE_UNITS, [{n: "y", w: {"h₁": -1, "h₂": -1, "h₃": -1, "h₄": -1}, b: 3}]]};
    return figure({
      id: "nn01-outside", w: 900, h: 500,
      title: "Everything outside the square: same fences, new output",
      desc: "Left: the whole plane shaded except the closed square with corners at (±1, ±1). Right: the same four hidden units as the square network; only the output changes, to weights −1 and bias 3, so it fires when at most three hidden units fire.",
      caption: "NOT(h₁ AND h₂ AND h₃ AND h₄) = NOT h₁ OR … OR NOT h₄: fire when at most three fences agree.",
    }, [regionPanel(spec, box, {lines: squareLines}), networkPanel(spec, net)]);
  },

  /* §7 and A10: two disjoint squares that share their top and bottom fences. */
  "nn01-two-squares-shared"() {
    const hidden = [
      {n: "a₁", w: {"x₁": -1}, b: -1}, {n: "a₂", w: {"x₁": 1}, b: 3},
      {n: "t", w: {"x₂": -1}, b: 1}, {n: "u", w: {"x₂": 1}, b: 1},
      {n: "b₁", w: {"x₁": 1}, b: -1}, {n: "b₂", w: {"x₁": -1}, b: 3}
    ];
    const spec = {inputs: ["x₁", "x₂"], layers: [hidden,
      [{n: "A", w: {"a₁": 1, "a₂": 1, "t": 1, "u": 1}, b: -4}, {n: "B", w: {"b₁": 1, "b₂": 1, "t": 1, "u": 1}, b: -4}],
      [{n: "y", w: {"A": 1, "B": 1}, b: -1}]]};
    const lines = [
      {p: [-1, 0], d: [0, 1]}, {p: [-3, 0], d: [0, 1]}, {p: [1, 0], d: [0, 1]}, {p: [3, 0], d: [0, 1]},
      {p: [0, 1], d: [1, 0], label: "t: x₂ ≤ 1 (shared)", at: [-3.9, 1.25]}, {p: [0, -1], d: [1, 0], label: "u: x₂ ≥ −1 (shared)", at: [-3.9, -1.55]}
    ];
    return figure({
      id: "nn01-twosq", w: 900, h: 500,
      title: "Two squares, six fences: sharing edges",
      desc: "Left: two shaded squares, from −3 to −1 and from 1 to 3 along x1, both between −1 and 1 along x2, with the shared top and bottom lines labelled t and u. Right: a 2–6–2–1 network. Units a1, a2 bound the left square, b1, b2 the right one, and t, u are read by both AND units A and B; the output ORs A and B.",
      caption: "2–6–2–1 instead of 2–8–2–1: the top and bottom fences are wired into both AND units.",
    }, [regionPanel(spec, {x: 40, y: 70, w: 380, h: 330, xmin: -4, xmax: 4, ymin: -4, ymax: 4}, {lines}), networkPanel(spec, net)]);
  },
};
