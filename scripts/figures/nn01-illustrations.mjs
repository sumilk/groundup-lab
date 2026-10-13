/* NN01 illustrations: original drawings for the history, the units, and the
   constructions. Diagrams are drawn schematically; every plotted curve or region
   is computed from the formula named in the lesson. */
import {C, figure, panel, text} from "./svgkit.mjs";

const r2 = v => Math.round(v * 100) / 100;
const heading = (s, w = 900) => text(w / 2, 44, s, {color: C.label, size: 18, anchor: "middle"});

function arrow(x0, y0, x1, y1, {color = C.dim, width = 2.2, head = 10, dash} = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  const bx = x1 - ux * head, by = y1 - uy * head;
  return `<path d="M${r2(x0)} ${r2(y0)}L${r2(bx)} ${r2(by)}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""} fill="none"/>` +
    `<path d="M${r2(x1)} ${r2(y1)}L${r2(bx - uy * head * .5)} ${r2(by + ux * head * .5)}L${r2(bx + uy * head * .5)} ${r2(by - ux * head * .5)}Z" fill="${color}"/>`;
}
/** An inhibitory ending: a line that stops in a bar across it. */
function inhibit(x0, y0, x1, y1, {color = C.pink, width = 2.2} = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  return `<path d="M${r2(x0)} ${r2(y0)}L${r2(x1)} ${r2(y1)}" stroke="${color}" stroke-width="${width}"/>` +
    `<path d="M${r2(x1 - uy * 9)} ${r2(y1 + ux * 9)}L${r2(x1 + uy * 9)} ${r2(y1 - ux * 9)}" stroke="${color}" stroke-width="4"/>`;
}
const circle = (x, y, r, {stroke = C.teal, fill = C.bg, width = 2.4, dash} = {}) =>
  `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const box = (x, y, w, h, {stroke = C.teal, fill = C.bg, rx = 10, width = 2.2, dash} = {}) =>
  `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const path = (d, {color = C.muted, width = 2, fill = "none", dash, opacity} = {}) =>
  `<path d="${d}" stroke="${color}" stroke-width="${width}" fill="${fill}"${dash ? ` stroke-dasharray="${dash}"` : ""}${opacity !== undefined ? ` fill-opacity="${opacity}"` : ""}/>`;
const label = (x, y, s, o = {}) => text(x, y, s, {color: C.label, size: 14, anchor: "middle", ...o});

export default {
  /* Opening: three tasks drawn as boxes with an input and an output. */
  "nn01-tasks-are-functions"() {
    const parts = [heading("Three tasks, one shape: something in, something out")];
    const rows = [110, 210, 310];
    // speech: a waveform
    let d = "M70 110";
    for (let i = 0; i <= 120; i++) d += `L${70 + i * 1.5} ${r2(110 - 26 * Math.sin(i / 3.2) * Math.exp(-((i - 60) ** 2) / 900))}`;
    parts.push(path(d, {color: C.teal, width: 2.4}));
    // image: a tiny landscape
    parts.push(box(78, 172, 160, 78, {stroke: C.label, rx: 6}), path("M84 244L130 196L160 222L186 200L232 244Z", {color: C.green, fill: C.green, opacity: .35}),
      circle(210, 190, 11, {stroke: C.orange, fill: C.orange}));
    // game: a 4x4 board
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
      parts.push(`<rect x="${110 + i * 20}" y="${272 + j * 20}" width="20" height="20" fill="${(i + j) % 2 ? C.dim : C.bg}" stroke="${C.dim}"/>`);
    parts.push(circle(140, 302, 6, {stroke: C.ink, fill: C.ink}), circle(160, 322, 6, {stroke: C.pink, fill: C.bg}));
    const outs = [["\"turn the lights on\"", "transcription"], ["\"a hill at sunset\"", "caption"], ["move: c3 → d4", "next move"]];
    rows.forEach((y, k) => {
      parts.push(arrow(268, y, 360, y, {color: C.muted}), box(365, y - 30, 170, 60, {stroke: C.pink}),
        text(450, y + 6, "f(x)", {color: C.ink, size: 20, anchor: "middle", italic: true}),
        arrow(540, y, 630, y, {color: C.muted}), text(645, y + 2, outs[k][0], {color: C.ink, size: 17}),
        text(645, y + 24, outs[k][1], {color: C.muted, size: 14}));
    });
    parts.push(label(150, 380, "input x", {size: 15}), label(450, 380, "a network computes f", {size: 15}), label(720, 380, "output f(x)", {size: 15}));
    return figure({id: "nn01-tasks", w: 900, h: 450, title: "Tasks as functions",
      desc: "Three rows. A speech waveform goes into a box labelled f(x) and comes out as a transcription. A small landscape picture goes in and comes out as a caption. A board position goes in and comes out as the next move.",
      caption: "Transcription, captioning and game play are all functions: the job is to build a machine that can become any of them."}, parts);
  },

  /* §1: Aristotle's four laws, one small picture each. */
  "nn01-four-laws"() {
    const parts = [heading("Aristotle's four laws of association")];
    const cx = [130, 340, 560, 770], y = 210;
    // contiguity: two events close in time on a time line
    parts.push(path(`M50 ${y + 60}H210`, {color: C.dim}), label(130, y + 82, "time →", {size: 12}),
      circle(110, y, 22, {stroke: C.orange, fill: C.orange}), path(`M114 ${y - 14}L104 ${y + 2}H112L106 ${y + 14}L118 ${y - 2}H110Z`, {color: C.bg, fill: C.bg, width: 1}),
      circle(160, y, 22, {stroke: C.blue}), path(`M152 ${y - 8}Q158 ${y} 152 ${y + 8}M159 ${y - 12}Q168 ${y} 159 ${y + 12}M166 ${y - 15}Q177 ${y} 166 ${y + 15}`, {color: C.blue, width: 2}),
      path(`M110 ${y + 30}V${y + 60}M160 ${y + 30}V${y + 60}`, {color: C.dim, dash: "3 3"}));
    // frequency: the link thickens with repetition
    [1, 3, 7].forEach((w, i) => parts.push(path(`M${280} ${y - 50 + i * 50}H${400}`, {color: C.teal, width: w}),
      circle(272, y - 50 + i * 50, 8, {stroke: C.label}), circle(408, y - 50 + i * 50, 8, {stroke: C.label}),
      text(420, y - 45 + i * 50, ["once", "often", "always"][i], {color: C.muted, size: 12})));
    // similarity: two similar shapes recall each other
    parts.push(path("M515 180l25 -40l25 40Z", {color: C.purple, fill: C.purple, opacity: .3}),
      path("M560 255l22 -36l22 36Z", {color: C.purple, fill: C.purple, opacity: .3}),
      path("M545 190Q575 210 575 220", {color: C.muted, dash: "4 4"}));
    // contrast: opposite recalls opposite
    parts.push(circle(740, y, 30, {stroke: C.ink, fill: C.ink}), circle(810, y, 30, {stroke: C.ink, fill: C.bg}),
      path(`M772 ${y}H778`, {color: C.muted}));
    ["contiguity", "frequency", "similarity", "contrast"].forEach((s, i) => parts.push(text(cx[i], 340, s, {color: C.ink, size: 18, anchor: "middle", weight: 600})));
    ["close in space or time", "repetition strengthens", "alike recalls alike", "opposite recalls opposite"].forEach((s, i) =>
      parts.push(label(cx[i], 364, s, {size: 13, color: C.muted})));
    return figure({id: "nn01-laws", w: 900, h: 420, title: "Aristotle's four laws of association",
      desc: "Four small pictures. Contiguity: lightning and thunder close together on a time line. Frequency: three links between two dots, getting thicker from once to always. Similarity: two similar triangles. Contrast: a black and a white disc.",
      caption: "Each law says when two ideas become linked. None of them says where the link is kept."}, parts);
  },

  /* §1: Bain's Fig. 2 idea, redrawn: three fibres, pairwise meeting cells. */
  "nn01-bain-groupings"() {
    const parts = [heading("Bain's groupings: one cell for each pair of fibres")];
    const fibres = [["a", 140], ["b", 240], ["c", 340]], cells = [["X", "a + b → x", 0, 1], ["Y", "a + c → y", 0, 2], ["Z", "b + c → z", 1, 2]];
    fibres.forEach(([n, y]) => parts.push(circle(110, y, 18, {stroke: C.label}), label(110, y + 5, n, {size: 16, color: C.ink})));
    cells.forEach(([n, rule, i, j], k) => {
      const cy = 140 + k * 100;
      parts.push(arrow(128, fibres[i][1], 452, cy - 6, {color: C.teal}), arrow(128, fibres[j][1], 452, cy + 6, {color: C.teal}),
        circle(475, cy, 22, {stroke: C.orange}), label(475, cy + 5, n, {size: 16, color: C.ink}),
        arrow(497, cy, 610, cy, {color: C.orange}), text(625, cy + 5, rule, {color: C.ink, size: 16}));
    });
    parts.push(text(625, 380, "three fibres, six branches, three cells", {color: C.muted, size: 14}));
    return figure({id: "nn01-bain", w: 900, h: 430, title: "Bain's neural groupings",
      desc: "Three input fibres a, b and c on the left. Each pair sends a branch to its own meeting cell: a and b to X, a and c to Y, b and c to Z. Each cell produces a different output.",
      caption: "Redrawn from the idea of Bain's Fig. 2 (1873): different combinations of the same inputs give different outputs."}, parts);
  },

  /* §1: von Neumann machine against a connectionist network. */
  "nn01-von-neumann-vs-network"() {
    const parts = [heading("Where is the program?")];
    parts.push(box(70, 110, 140, 70, {stroke: C.orange}), label(140, 152, "processor", {color: C.ink, size: 16}),
      box(70, 250, 140, 110, {stroke: C.blue}), label(140, 285, "memory", {color: C.ink, size: 16}),
      box(88, 300, 104, 22, {stroke: C.dim, rx: 4}), label(140, 316, "program", {size: 12}),
      box(88, 328, 104, 22, {stroke: C.dim, rx: 4}), label(140, 344, "data", {size: 12}),
      arrow(125, 182, 125, 248, {color: C.muted}), arrow(155, 248, 155, 182, {color: C.muted}),
      label(260, 225, "fetch, execute,", {size: 13, color: C.muted}), label(260, 243, "one step at a time", {size: 13, color: C.muted}),
      label(140, 395, "von Neumann machine", {size: 16, color: C.ink, weight: 600}));
    const nodes = [[520, 130], [600, 100], [690, 140], [770, 115], [540, 230], [630, 210], [720, 240], [800, 220], [570, 320], [670, 330], [760, 320]];
    const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [4, 8], [5, 9], [6, 10], [8, 9], [9, 10], [1, 6], [5, 2], [7, 10], [0, 5]];
    edges.forEach(([i, j], k) => parts.push(path(`M${nodes[i][0]} ${nodes[i][1]}L${nodes[j][0]} ${nodes[j][1]}`, {color: C.teal, width: 1 + (k * 7 % 5) * .8})));
    nodes.forEach(([x, y]) => parts.push(circle(x, y, 12, {stroke: C.ink})));
    parts.push(label(660, 395, "connectionist network", {size: 16, color: C.ink, weight: 600}),
      label(660, 375, "line thickness = connection strength", {size: 13, color: C.muted}));
    return figure({id: "nn01-vn", w: 900, h: 450, title: "A von Neumann machine and a connectionist network",
      desc: "Left: a processor box above a memory box that holds both program and data, joined by fetch arrows. Right: eleven units joined by connections of different thickness, with no separate program store.",
      caption: "In the network, what the machine knows is the pattern of connection strengths."}, parts);
  },

  /* §2: a schematic neuron and the unit that abstracts it. */
  "nn01-neuron-anatomy"() {
    const parts = [heading("A neuron, and the unit that stands for it")];
    // dendrites
    const den = [[60, 120], [70, 200], [60, 290], [110, 90], [110, 330]];
    den.forEach(([x, y]) => parts.push(path(`M${x} ${y}Q${(x + 190) / 2} ${(y + 210) / 2 + (y < 210 ? 20 : -20)} 190 210`, {color: C.teal, width: 3})));
    parts.push(circle(215, 210, 38, {stroke: C.orange, fill: "#2a1c0f"}), label(215, 215, "soma", {color: C.ink, size: 14}),
      path("M253 210C330 205 380 215 470 210", {color: C.ink, width: 4}),
      path("M470 210l30 -22M470 210l32 0M470 210l30 22", {color: C.ink, width: 3}),
      circle(503, 188, 5, {stroke: C.orange, fill: C.orange}), circle(505, 210, 5, {stroke: C.orange, fill: C.orange}), circle(503, 232, 5, {stroke: C.orange, fill: C.orange}),
      label(90, 360, "dendrites gather input", {size: 14}), label(215, 270, "sums it up", {size: 13, color: C.muted}),
      label(360, 192, "one axon carries the output", {size: 14}), label(505, 268, "synapses on", {size: 13, color: C.muted}),
      label(505, 284, "other neurons", {size: 13, color: C.muted}));
    // the abstract unit
    const ux = 740, uy = 210;
    [[600, 130, "x₁", "w₁"], [600, 210, "x₂", "w₂"], [600, 290, "x₃", "w₃"]].forEach(([x, y, n, w]) =>
      parts.push(circle(x, y, 15, {stroke: C.label}), label(x, y + 5, n, {size: 14, color: C.ink}),
        arrow(616, y, ux - 34, uy + (y - uy) * .25, {color: C.teal}), label(660, (y + uy) / 2 - 6, w, {size: 13, color: C.teal})));
    parts.push(circle(ux, uy, 32, {stroke: C.orange}), label(ux, uy - 2, "Σ ≥ T", {color: C.ink, size: 15}),
      arrow(ux + 32, uy, 860, uy, {color: C.ink}), label(850, uy - 12, "y", {size: 16, color: C.ink}),
      label(ux, 360, "threshold unit", {size: 15, color: C.ink, weight: 600}),
      path("M560 60V380", {color: C.dim, dash: "5 6", width: 1.5}));
    return figure({id: "nn01-neuron", w: 900, h: 430, title: "A neuron and a threshold unit",
      desc: "Left: a schematic neuron with five dendrites converging on a soma and one long axon ending in three synaptic terminals. Right: the abstraction, three inputs x1 to x3 with weights w1 to w3 feeding a unit that fires y when the weighted sum reaches the threshold T.",
      caption: "Dendrites become weighted inputs, the soma becomes a sum and a threshold, and the axon becomes the output y."}, parts);
  },

  /* §2: the four McCulloch–Pitts building blocks. */
  "nn01-mp-gates"() {
    const parts = [heading("McCulloch–Pitts building blocks (one step of delay each)")];
    const cols = [110, 315, 520, 725];
    const unit = (x, T, outLabel) => [circle(x + 40, 210, 24, {stroke: C.orange}), label(x + 40, 215, String(T), {color: C.ink, size: 16}),
      arrow(x + 64, 210, x + 115, 210, {color: C.ink}), label(x + 98, 196, outLabel, {size: 13, color: C.ink})];
    const inp = (x, y, n) => [circle(x - 60, y, 14, {stroke: C.label}), label(x - 60, y + 5, n, {size: 13, color: C.ink})];
    // delay
    parts.push(...inp(cols[0], 210, "A"), arrow(cols[0] - 46, 210, cols[0] + 14, 210, {color: C.teal}), ...unit(cols[0], 1, "A(t−1)"));
    // OR
    parts.push(...inp(cols[1], 170, "A"), ...inp(cols[1], 250, "B"), arrow(cols[1] - 46, 170, cols[1] + 20, 200, {color: C.teal}),
      arrow(cols[1] - 46, 250, cols[1] + 20, 220, {color: C.teal}), ...unit(cols[1], 1, "A ∨ B"));
    // AND
    parts.push(...inp(cols[2], 170, "A"), ...inp(cols[2], 250, "B"), arrow(cols[2] - 46, 170, cols[2] + 20, 200, {color: C.teal}),
      arrow(cols[2] - 46, 250, cols[2] + 20, 220, {color: C.teal}), ...unit(cols[2], 2, "A ∧ B"));
    // AND-NOT
    parts.push(...inp(cols[3], 170, "A"), ...inp(cols[3], 250, "B"), arrow(cols[3] - 46, 170, cols[3] + 20, 200, {color: C.teal}),
      inhibit(cols[3] - 46, 250, cols[3] + 12, 224), ...unit(cols[3], 1, "A ∧ ¬B"));
    ["delay", "OR", "AND", "AND-NOT"].forEach((s, i) => parts.push(text(cols[i] + 20, 320, s, {color: C.ink, size: 18, anchor: "middle", weight: 600})));
    ["copies its input", "threshold 1", "threshold 2", "B is a veto"].forEach((s, i) => parts.push(label(cols[i] + 20, 344, s, {size: 13, color: C.muted})));
    parts.push(arrow(300, 380, 350, 380, {color: C.teal}), text(360, 385, "excitatory", {color: C.label, size: 13}),
      inhibit(470, 380, 520, 380), text(535, 385, "inhibitory (absolute veto)", {color: C.label, size: 13}));
    return figure({id: "nn01-mpg", w: 900, h: 440, title: "McCulloch–Pitts building blocks",
      desc: "Four small nets. Delay: one excitatory input into a unit with threshold 1. OR: two excitatory inputs, threshold 1. AND: two excitatory inputs, threshold 2. AND-NOT: A excitatory and B inhibitory, threshold 1. A legend shows arrows for excitatory synapses and bars for inhibitory ones.",
      caption: "Numbers in the circles are thresholds. Wire these four blocks together and any logical formula can be built."}, parts);
  },

  /* §2: the heat/cold net as wiring. */
  "nn01-heatcold-wiring"() {
    const parts = [heading("The heat/cold illusion as a five-unit net")];
    const P = {h: [90, 130], c: [90, 300], a: [300, 330], b: [470, 250], H: [700, 150], Cc: [700, 330]};
    const node = (k, name, T, stroke) => [circle(P[k][0], P[k][1], 26, {stroke}), label(P[k][0], P[k][1] + 5, T, {color: C.ink, size: 15}),
      label(P[k][0], P[k][1] + 46, name, {size: 13})];
    parts.push(arrow(116, 130, 674, 148, {color: C.teal}), arrow(116, 300, 274, 326, {color: C.teal}),
      arrow(326, 322, 446, 262, {color: C.teal}), inhibit(114, 292, 438, 255),
      arrow(494, 240, 676, 162, {color: C.teal}), arrow(326, 334, 674, 334, {color: C.teal}), path("M104 324Q400 455 680 352", {color: C.teal, width: 2.2, dash: "6 5"}),
      ...node("h", "heat receptor", "h", C.label), ...node("c", "cold receptor", "c", C.label), ...node("a", "a: relay", "1", C.orange),
      ...node("b", "b: cold just stopped", "1", C.orange), ...node("H", "feels HOT", "1", C.pink), ...node("Cc", "feels COLD", "2", C.blue),
      text(760, 210, "H(t) = h(t−1) ∨ b(t−1)", {color: C.ink, size: 14}), text(760, 232, "b(t) = a(t−1) ∧ ¬c(t−1)", {color: C.ink, size: 14}),
      text(760, 254, "C(t) = a(t−1) ∧ c(t−1)", {color: C.ink, size: 14}));
    return figure({id: "nn01-hc", w: 1000, h: 440, title: "The McCulloch–Pitts heat/cold net",
      desc: "Two receptors on the left, heat and cold. The cold receptor excites relay unit a, which excites unit b, while the cold receptor also inhibits b. The heat receptor and b both excite the heat-sensation unit with threshold 1. Unit a and the cold receptor both excite the cold-sensation unit with threshold 2.",
      caption: "A brief cold touch reaches the HOT unit through b; a sustained one reaches the COLD unit, which needs a and c together."}, parts);
  },

  /* §3: Turing's A-type unit and B-type link. */
  "nn01-turing-btype"() {
    const parts = [heading("Turing's unorganised machines")];
    // A-type unit
    parts.push(circle(160, 210, 34, {stroke: C.orange}), label(160, 215, "NAND", {color: C.ink, size: 15}),
      arrow(60, 170, 130, 195, {color: C.teal}), arrow(60, 250, 130, 225, {color: C.teal}), arrow(194, 210, 260, 210, {color: C.ink}),
      label(160, 290, "A-type unit", {color: C.ink, size: 16, weight: 600}), label(160, 312, "two inputs, chosen at random;", {size: 13, color: C.muted}),
      label(160, 330, "output = NAND one tick later", {size: 13, color: C.muted}));
    // B-type link
    const bx = 380;
    parts.push(box(bx, 160, 200, 100, {stroke: C.purple, dash: "6 4"}), label(bx + 100, 150, "B-type link", {color: C.purple, size: 14}),
      arrow(320, 210, bx + 40, 210, {color: C.teal}), label(330, 200, "D", {size: 14, color: C.ink}),
      circle(bx + 100, 210, 26, {stroke: C.orange}), label(bx + 100, 215, "?", {color: C.ink, size: 16}),
      arrow(bx + 126, 210, 650, 210, {color: C.ink}), label(640, 200, "E", {size: 14, color: C.ink}),
      arrow(bx + 100, 300, bx + 100, 238, {color: C.purple}), label(bx + 100, 318, "modifier C", {size: 13, color: C.purple}));
    parts.push(box(680, 120, 190, 70, {stroke: C.green}), text(695, 148, "on:  E = NOT D", {color: C.ink, size: 15}), text(695, 172, "passes (negated)", {color: C.muted, size: 13}),
      box(680, 220, 190, 70, {stroke: C.pink}), text(695, 248, "off: E = 1", {color: C.ink, size: 15}), text(695, 272, "connection cut", {color: C.muted, size: 13}),
      label(775, 330, "training = setting modifiers", {size: 14, color: C.ink}));
    return figure({id: "nn01-turing", w: 900, h: 410, title: "Turing's A-type unit and B-type link",
      desc: "Left: an A-type unit, a NAND gate with two randomly chosen inputs. Middle: a B-type link, a small device on a connection from D to E controlled by a modifier C. Right: its two modes, on, where E is NOT D, and off, where E is stuck at 1.",
      caption: "A NAND unit ignores an input stuck at 1, so the 'off' mode cuts the connection. Learning means choosing the modes."}, parts);
  },

  /* §4: Hebb's knob growth, before and after. */
  "nn01-hebb-knobs"() {
    const parts = [heading("Hebb's guess: active contacts grow")];
    const scene = (x0, r, title, note) => {
      const out = [circle(x0 + 230, 210, 50, {stroke: C.blue, fill: "#0e1d33"}), label(x0 + 230, 215, "cell B", {color: C.ink, size: 14})];
      [[150, -40], [210, 0], [270, 40]].forEach(([y, dy], i) => {
        out.push(path(`M${x0 + 30} ${y}C${x0 + 90} ${y} ${x0 + 120} ${210 + dy * .6} ${x0 + 172} ${210 + dy * .6}`, {color: C.teal, width: 3}),
          circle(x0 + 178, 210 + dy * .6, i === 1 ? r : 6, {stroke: C.orange, fill: C.orange}));
      });
      out.push(label(x0 + 30, 130, "cell A", {size: 13, color: C.teal}), text(x0 + 150, 330, title, {color: C.ink, size: 16, anchor: "middle", weight: 600}),
        label(x0 + 150, 354, note, {size: 13, color: C.muted}));
      return out;
    };
    parts.push(...scene(40, 6, "before", "small knob: A rarely fires B"), arrow(400, 210, 480, 210, {color: C.muted}),
      label(440, 196, "A keeps", {size: 12, color: C.muted}), label(440, 232, "firing B", {size: 12, color: C.muted}),
      ...scene(500, 14, "after", "bigger knob: A's 'efficiency' rises"),
      text(450, 395, "In the model: w ← w + η · x · y", {color: C.ink, size: 16, anchor: "middle"}));
    return figure({id: "nn01-knobs", w: 900, h: 430, title: "Synaptic knob growth",
      desc: "Two scenes. Before: three axon branches of cell A end in small knobs on cell B. After A has repeatedly helped fire B, the middle knob has grown much larger. Below, the mathematical version of the rule.",
      caption: "Hebb (1949, p. 63): knobs grow when one cell repeatedly helps fire another. He admitted there was no direct evidence."}, parts);
  },

  /* §4: Hebb and Oja weight lengths, computed from the averaged equations. */
  "nn01-hebb-vs-oja"() {
    const Cm = [[3, 1.5], [1.5, 1]], eta = 0.01, steps = 400;
    let wh = [0.3, 0.1], wo = [0.3, 0.1];
    const mv = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
    const H = [], O = [];
    for (let t = 0; t <= steps; t++) {
      H.push([t, Math.log10(Math.hypot(...wh))]); O.push([t, Math.log10(Math.hypot(...wo))]);
      const ch = mv(Cm, wh), co = mv(Cm, wo), q = wo[0] * co[0] + wo[1] * co[1];
      wh = [wh[0] + eta * ch[0], wh[1] + eta * ch[1]];
      wo = [wo[0] + eta * (co[0] - q * wo[0]), wo[1] + eta * (co[1] - q * wo[1])];
    }
    const ymax = Math.ceil(Math.max(...H.map(q => q[1])));
    const X = t => 120 + t / steps * 700, Y = v => 350 - (v + 1) / (ymax + 1) * 260;
    const out = [];
    for (let k = -1; k <= ymax; k++) out.push(path(`M120 ${r2(Y(k))}H820`, {color: C.grid, width: 1.2}),
      text(108, Y(k) + 5, k === 0 ? "1" : "10" + (k < 0 ? "⁻¹" : "⁰¹²³⁴⁵⁶⁷⁸⁹"[k]), {color: C.label, size: 13, anchor: "end"}));
    [0, 100, 200, 300, 400].forEach(t => out.push(text(X(t), 372, String(t), {color: C.label, size: 13, anchor: "middle"})));
    out.push(path(H.map(([t, v], i) => (i ? "L" : "M") + r2(X(t)) + " " + r2(Y(v))).join(""), {color: C.pink, width: 3}),
      path(O.map(([t, v], i) => (i ? "L" : "M") + r2(X(t)) + " " + r2(Y(v))).join(""), {color: C.teal, width: 3}),
      text(X(250), Y(H[250][1]) - 16, "Hebb: |w| grows like e^(λ₁ηt)", {color: C.pink, size: 15, anchor: "end"}),
      text(X(300), Y(O[300][1]) - 12, "Oja: |w| → 1", {color: C.teal, size: 15}),
      text(60, 90, "|w|", {color: C.label, size: 14}));
    return figure({id: "nn01-hvo", w: 900, h: 450, title: "Hebb versus Oja: weight length over time",
      desc: "Weight length on a logarithmic axis against update step, from the averaged equations with correlation matrix [[3, 1.5], [1.5, 1]] and learning rate 0.01. The Hebb curve rises in a straight line on the log axis; the Oja curve levels off at length 1.",
      caption: "Averaged updates, C = [[3, 1.5], [1.5, 1]], η = 0.01: a straight line on a log axis is exponential growth."}, [heading("Hebb grows without bound; Oja settles at length 1"), ...out, text(470, 398, "update step", {color: C.label, size: 14, anchor: "middle"})]);
  },

  /* §5: Rosenblatt's photoperceptron. */
  "nn01-photoperceptron"() {
    const parts = [heading("Rosenblatt's photoperceptron (1958)")];
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++)
      parts.push(`<rect x="${60 + i * 22}" y="${130 + j * 22}" width="20" height="20" rx="3" fill="${(i * 7 + j * 3) % 5 === 0 ? C.orange : "#14243a"}" stroke="${C.dim}"/>`);
    const col = (x, n, color) => [...Array(n).keys()].map(k => [x, 120 + k * (180 / (n - 1))]);
    const A1 = col(330, 5), A2 = col(500, 6), R = [[680, 160], [680, 260]];
    const rng = (k => () => (k = (k * 16807) % 2147483647) / 2147483647)(7);
    A1.forEach(([x, y]) => { for (let s = 0; s < 3; s++) parts.push(path(`M${192} ${150 + Math.floor(rng() * 6) * 22}L${x - 14} ${y}`, {color: C.dim, width: 1.2})); });
    A2.forEach(([x, y]) => { for (let s = 0; s < 2; s++) { const [ax, ay] = A1[Math.floor(rng() * 5)]; parts.push(path(`M${ax + 14} ${ay}L${x - 14} ${y}`, {color: C.dim, width: 1.2})); } });
    A2.forEach(([x, y], k) => parts.push(arrow(x + 14, y, R[k < 3 ? 0 : 1][0] - 22, R[k < 3 ? 0 : 1][1], {color: C.teal, width: 1.8, head: 8})));
    parts.push(path("M680 182V238", {color: C.pink, width: 2.5, dash: "5 4"}), label(735, 214, "mutual", {size: 12, color: C.pink}), label(735, 230, "inhibition", {size: 12, color: C.pink}));
    A1.forEach(([x, y]) => parts.push(circle(x, y, 13, {stroke: C.label})));
    A2.forEach(([x, y]) => parts.push(circle(x, y, 13, {stroke: C.orange})));
    R.forEach(([x, y], k) => parts.push(circle(x, y, 22, {stroke: C.pink}), label(x, y + 5, "R" + (k + 1), {color: C.ink, size: 14})));
    [["retina (S points)", 125], ["projection units A₁", 330], ["association units A₂", 500], ["responses R", 680]].forEach(([s, x]) =>
      parts.push(label(x, 345, s, {size: 14, color: C.ink})));
    parts.push(label(415, 375, "fixed, random connections", {size: 13, color: C.muted}), label(590, 375, "learnable", {size: 13, color: C.teal}));
    return figure({id: "nn01-photo", w: 900, h: 420, title: "Rosenblatt's photoperceptron",
      desc: "A six by six retina of sensory points on the left feeds a column of projection units through random connections, which feed a column of association units, which feed two response units. The two responses inhibit each other.",
      caption: "Only the connections into the response units learn; the simplified perceptron keeps one layer of fixed association units."}, parts);
  },

  /* §5: AND and OR are separable; XOR is not. */
  "nn01-xor-corners"() {
    const parts = [heading("Four corners, one line")];
    const cases = [["AND", [0, 0, 0, 1], [[-0.2, 1.7], [1.7, -0.2]]], ["OR", [0, 1, 1, 1], [[-0.2, 0.7], [0.7, -0.2]]], ["XOR", [0, 1, 1, 0], null]];
    cases.forEach(([name, t, line], k) => {
      const p = panel({x: 40 + k * 285, y: 100, w: 250, h: 240, xmin: -0.5, xmax: 1.5, ymin: -0.5, ymax: 1.5, title: name});
      p.axes();
      if (line) p.line(line[0], line[1], {color: C.orange, width: 3});
      else { p.line([-0.3, 0.6], [0.6, -0.3], {color: C.orange, width: 2, dash: "6 5"}); p.line([0.4, 1.3], [1.3, 0.4], {color: C.orange, width: 2, dash: "6 5"}); }
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach((c, i) => p.point(c, {color: t[i] ? C.pink : C.label, r: t[i] ? 10 : 7}));
      parts.push(p.svg());
    });
    parts.push(text(185, 380, "one line separates", {color: C.muted, size: 14, anchor: "middle"}), text(470, 380, "one line separates", {color: C.muted, size: 14, anchor: "middle"}),
      text(755, 380, "needs two lines: a network", {color: C.pink, size: 14, anchor: "middle"}));
    return figure({id: "nn01-xor", w: 900, h: 430, title: "AND and OR are linearly separable; XOR is not",
      desc: "Three panels of the unit square's corners. Large pink dots fire, small grey dots do not. For AND and OR a single orange line separates firing from silent corners. For XOR the firing corners lie on one diagonal and two dashed lines are needed.",
      caption: "XOR's firing corners sit on one diagonal and its silent corners on the other, so no single line can split them."}, parts);
  },

  /* §6: the story so far, as a timeline. */
  "nn01-timeline"() {
    const parts = [heading("The story so far")];
    const ev = [["c. 350 BC", "Aristotle", "laws of association"], ["1749", "Hartley", "vibratiuncles"], ["1873", "Bain", "information in connections"],
      ["1930", "Kubie", "loops as memory"], ["1943", "McCulloch & Pitts", "threshold logic units"], ["1948", "Turing", "unorganised machines"],
      ["1949", "Hebb", "learning postulate"], ["1958", "Rosenblatt", "the perceptron"], ["1969", "Minsky & Papert", "limits of one layer"], ["1986", "PDP group", "connectionist manifesto"]];
    const x0 = 105, x1 = 795, y = 210;
    parts.push(path(`M${x0} ${y}H${x1}`, {color: C.dim, width: 3}));
    ev.forEach(([yr, who, what], i) => {
      const x = x0 + i * (x1 - x0) / (ev.length - 1), up = i % 2 === 0, ty = up ? y - 82 : y + 50;
      parts.push(path(`M${x} ${y}V${up ? y - 20 : y + 20}`, {color: C.dim}), circle(x, y, 7, {stroke: i < 3 ? C.blue : i < 7 ? C.teal : C.orange, fill: i < 3 ? C.blue : i < 7 ? C.teal : C.orange}),
        text(x, ty, yr, {color: C.label, size: 13, anchor: "middle"}), text(x, ty + 18, who, {color: C.ink, size: 14, anchor: "middle", weight: 600}),
        text(x, ty + 35, what, {color: C.muted, size: 12, anchor: "middle"}));
    });
    parts.push(text(150, 360, "● ideas about the mind", {color: C.blue, size: 13}), text(380, 360, "● models of the neuron and of learning", {color: C.teal, size: 13}),
      text(680, 360, "● limits, and networks", {color: C.orange, size: 13}));
    return figure({id: "nn01-tl", w: 900, h: 410, title: "A timeline from associationism to connectionist networks",
      desc: "A horizontal timeline with ten events: Aristotle's laws, Hartley 1749, Bain 1873, Kubie 1930, McCulloch and Pitts 1943, Turing 1948, Hebb 1949, Rosenblatt 1958, Minsky and Papert 1969, and the PDP group 1986.",
      caption: "Not to scale: two thousand years of ideas, then four decades in which the neuron became a machine."}, parts);
  },

  /* §7: what each layer computes. */
  "nn01-layers-compute"() {
    const parts = [heading("What each layer of threshold units computes")];
        const titles = ["layer 1: fences (lines)", "layer 2: AND → enclosures", "layer 3: OR → unions"];
    [0, 1, 2].forEach(k => {
      const p = panel({x: 40 + k * 285, y: 90, w: 250, h: 250, xmin: -3, xmax: 3, ymin: -3, ymax: 3, title: titles[k]});
      p.grid(1);
      const tri = [[-2.5, -1.5], [-0.5, -1.5], [-1.5, 1.2]], sq = [[0.6, 0.4], [2.4, 0.4], [2.4, 2.2], [0.6, 2.2]];
      if (k === 0) for (const poly of [tri, sq]) poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]; p.fullLine(a, [b[0] - a[0], b[1] - a[1]], {color: C.teal, width: 2}); });
      if (k >= 1) { p.polygon(tri, {fill: C.pink, opacity: k === 2 ? .35 : .25, stroke: C.pink}); }
      if (k === 1) p.polygon(sq, {fill: C.purple, opacity: .25, stroke: C.purple});
      if (k === 2) p.polygon(sq, {fill: C.pink, opacity: .35, stroke: C.pink});
      parts.push(p.svg());
    });
    parts.push(text(185, 380, "each unit: which side?", {color: C.muted, size: 14, anchor: "middle"}),
      text(470, 380, "inside all of a group's fences?", {color: C.muted, size: 14, anchor: "middle"}),
      text(755, 380, "inside any enclosure?", {color: C.muted, size: 14, anchor: "middle"}));
    return figure({id: "nn01-layers", w: 900, h: 430, title: "Lines, then convex pieces, then unions",
      desc: "Three panels. The first shows several straight lines, one per first-layer unit. The second shows a triangle and a square, each the intersection of half-planes computed by an AND unit. The third shows both shaded in the same colour, their union computed by an OR unit.",
      caption: "Fences, then enclosures, then unions: three layers can describe any region made of convex pieces."}, parts);
  },

  /* §8: regular polygons converge to a circle, with unit counts. */
  "nn01-polygons-to-circle"() {
    const parts = [heading("More fences, rounder pen")];
    [3, 6, 12, 48].forEach((N, k) => {
      const p = panel({x: 30 + k * 215, y: 80, w: 195, h: 195, xmin: -2.05, xmax: 2.05, ymin: -2.05, ymax: 2.05});
      p.ellipse([[1, 0], [0, 1]], {color: C.dim, width: 1.5, dash: "4 4"});
      const R = 1 / Math.cos(Math.PI / N), pts = [...Array(N).keys()].map(i => [R * Math.cos(2 * Math.PI * (i + .5) / N), R * Math.sin(2 * Math.PI * (i + .5) / N)]);
      p.polygon(pts, {fill: C.pink, opacity: .28, stroke: C.pink, width: 2});
      const area = N * Math.tan(Math.PI / N), excess = (area - Math.PI) / Math.PI * 100;
      parts.push(p.svg(), text(30 + k * 215 + 97, 305, `N = ${N}: ${N + 1} units`, {color: C.ink, size: 15, anchor: "middle", weight: 600}),
        text(30 + k * 215 + 97, 327, `area ${excess.toFixed(1)}% too big`, {color: C.muted, size: 13, anchor: "middle"}));
    });
    return figure({id: "nn01-poly", w: 900, h: 400, title: "Regular polygons approaching the unit circle",
      desc: "Four panels with a dashed unit circle and a shaded regular polygon around it, with 3, 6, 12 and 48 sides. Below each, the number of threshold units and how much larger the polygon's area is than the circle's: 65.4, 10.3, 2.3 and 0.1 percent.",
      caption: "Area excess N·tan(π/N)/π − 1: each doubling of N cuts the error about fourfold, one more unit per edge."}, parts);
  },

  /* §9: skylines approximating sin x. */
  "nn01-skylines"() {
    const parts = [heading("A skyline of pulses approaches a curve")], errs = [];
    [4, 12, 48].forEach((K, k) => {
      const L = 2 * Math.PI, dx = L / K;
      const p = panel({x: 30 + k * 290, y: 80, w: 260, h: 220, xmin: 0, xmax: L, ymin: -1.2, ymax: 1.2});
      p.axes();
      let maxE = 0;
      for (let i = 0; i < K; i++) {
        const h = Math.sin((i + .5) * dx);
        p.polygon([[i * dx, 0], [(i + 1) * dx, 0], [(i + 1) * dx, h], [i * dx, h]], {fill: C.pink, opacity: .3, stroke: C.pink, width: 1.2});
        for (let s = 0; s <= 40; s++) { const x = i * dx + s * dx / 40; maxE = Math.max(maxE, Math.abs(Math.sin(x) - h)); }
      }
      p.curve(t => [t, Math.sin(t)], 0, L, {color: C.teal, width: 2.5});
      errs.push(maxE.toFixed(3));
      parts.push(p.svg(), text(30 + k * 290 + 130, 330, `K = ${K}: ${K + 1} threshold units`, {color: C.ink, size: 15, anchor: "middle", weight: 600}),
        text(30 + k * 290 + 130, 352, `max error ${maxE.toFixed(3)}`, {color: C.muted, size: 13, anchor: "middle"}));
    });
    return figure({id: "nn01-sky", w: 900, h: 410, title: "Pulse approximations of sin x",
      desc: `Three panels approximating sin x on 0 to 2π with 4, 12 and 48 flat-topped pulses at midpoint heights. The maximum errors shown below are ${errs.join(", ")}.`,
      caption: "Midpoint heights on [0, 2π]: the error falls in proportion to 1/K (staircase form, K + 1 units)."}, parts);
  },
};
