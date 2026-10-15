/* Behavioral checks for NN02's student-facing math core, network builders and kata references.
   The VM exposes local definitions only in this test; production exports and saved-state keys
   are unchanged. Run directly or through check-neural-networks.mjs. */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const source = read("public/theory/labs/nn-02.js");
const window = {GU: {lab() {}}, addEventListener() {}};
const names = ["primeImplicants", "essentialPIs", "minCovers", "kmapAnalyse", "truthFromRows", "termUnit", "KMAP_PRESETS",
  "parityNet", "parityCheck", "netStats", "netOut", "bestSingleUnit", "checkerNet", "checkerTarget", "checkerFormula", "checkerMismatch",
  "checkerProbes", "crossingFailures", "circErr", "inscErr", "bestPolygon", "polyGrid", "smallestN", "bottleneck",
  "uatNet", "uatEval", "uatBound", "uatMeasure", "cubeDivided", "cylFrac", "cylGap", "cylFirstFire",
  "sawK", "deepSaw", "sawInterp", "interpEval", "sawMaxErr", "sawSignChanges", "sawCapacity", "KATAS", "makeHelpers", "resetHelpers", "QUIZ"];
const instrumented = source.replace(/\}\)\(\);\s*$/, `GU.checkNN02 = {${names.join(", ")}};\n})();`);
assert.notEqual(instrumented, source, "Test instrumentation must reach the lab closure");
vm.runInNewContext(instrumented, {window, Math, Set, console});
const X = window.GU.checkNN02;
const deq = (a, b, m) => assert.deepEqual(JSON.parse(JSON.stringify(a)), b, m);
const near = (a, b, t = 5e-5) => Math.abs(a - b) <= t;
const bits = (k, n) => Array.from({length: n}, (_, j) => (k >> (n - 1 - j)) & 1);

/* Karnaugh maps: prime implicants, essentials and minimum covers of every preset. */
const preset = name => X.truthFromRows(X.KMAP_PRESETS.find(p => p[0].startsWith(name))[1]);
{
  const k = X.kmapAnalyse(preset("Worked"));
  deq(k.pis.map(p => p.pat).sort(), ["-0-0", "-1-1", "0--1", "00--"]);
  deq(k.essential.map(p => p.pat).sort(), ["-0-0", "-1-1"]);
  assert.equal(k.coverSize, 3); assert.equal(k.reducedUnits, 4); assert.equal(k.plainUnits, 11);
  deq(k.covers.map(c => c.map(p => p.pat).sort().join("+")).sort(), ["-0-0+-1-1+0--1", "-0-0+-1-1+00--"]);
  deq(X.termUnit([2, 0, 2, 0]), {w: [0, -1, 0, -1], b: 0});
  deq(X.termUnit([2, 1, 2, 1]), {w: [0, 1, 0, 1], b: -2});
  deq(X.termUnit([0, 2, 2, 1]), {w: [-1, 0, 0, 1], b: -1});
  const par = X.kmapAnalyse(preset("Parity"));
  assert.equal(par.pis.length, 8); assert(par.pis.every(p => p.lits === 4)); assert.equal(par.coverSize, 8);
  const one = X.kmapAnalyse(preset("Constant 1"));
  deq(one.pis.map(p => p.pat), ["----"]); assert.equal(one.coverSize, 1); assert.equal(one.reducedUnits, 2);
  const zero = X.kmapAnalyse(preset("All zero"));
  assert.equal(zero.pis.length, 0); assert.equal(zero.coverSize, 0); assert.equal(zero.reducedUnits, 1);
  const maj = X.kmapAnalyse(preset("At least 3"));
  assert.equal(maj.pis.length, 4); assert.equal(maj.essential.length, 4); assert.equal(maj.coverSize, 4);
  // Section 2 Core practice: ĀC̄ + AC.
  const g = X.kmapAnalyse(X.truthFromRows([0, 1, 4, 5, 10, 11, 14, 15]));
  deq(g.pis.map(p => p.pat).sort(), ["0-0-", "1-1-"]); assert.equal(g.reducedUnits, 3);
  // Every cover found really covers exactly the true rows, for random tables.
  let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let t = 0; t < 200; t++) {
    const truth = Array.from({length: 16}, () => (rnd() < .5 ? 1 : 0)), a = X.kmapAnalyse(truth);
    for (const cover of a.covers) {
      const m = cover.reduce((s, p) => s | p.mask, 0);
      for (let r = 0; r < 16; r++) assert.equal(!!(m & (1 << r)), !!truth[r]);
    }
  }
}

/* Parity: the n = 6 table of Section 3 and exhaustive correctness for n = 2..10. */
{
  const want = {dnf: [33, 224, 33, 2, true, null], count: [7, 42, 7, 2, true, 49], tree3: [15, 30, 15, 6, false, null], tree2: [10, 25, 10, 6, false, null], ltree: [17, 32, 17, 6, true, 92]};
  for (const [k, [u, c, b, d, lay, dense]] of Object.entries(want)) {
    const s = X.netStats(X.parityNet(6, k));
    deq([s.units, s.connections, s.biases, s.depth, s.layered], [u, c, b, d, lay], `parity n=6 ${k}`);
    if (k !== "dnf") assert.equal(s.dense, dense, `dense ${k}`);
  }
  assert.equal(X.netStats(X.parityNet(6, "dnf")).dense, 6 * 32 + 32 + 32 + 1);
  assert.equal(X.netStats(X.parityNet(12, "dnf")).units, 2049);
  for (let n = 2; n <= 10; n++) for (const k of ["dnf", "count", "tree3", "tree2", "ltree"]) {
    const net = X.parityNet(n, k), r = X.parityCheck(net, n), s = X.netStats(net);
    assert.equal(r.right, r.total, `parity ${k} n=${n}`);
    const L = Math.ceil(Math.log2(n));
    if (k === "dnf") deq([s.units, s.connections], [2 ** (n - 1) + 1, (n + 1) * 2 ** (n - 1)]);
    if (k === "count") deq([s.units, s.connections, s.depth, s.dense], [n + 1, n * n + n, 2, (n + 1) ** 2]);
    if (k === "tree3") deq([s.units, s.connections, s.depth, s.layered], [3 * (n - 1), 6 * (n - 1), 2 * L, (n & (n - 1)) === 0]);
    if (k === "tree2") deq([s.units, s.connections, s.depth], [2 * (n - 1), 5 * (n - 1), 2 * L]);
    if (k === "ltree") assert(s.layered && s.depth === 2 * L, `layered tree n=${n}`);
  }
  // One unit fails for every n >= 2 (exhaustive integer search up to n = 6).
  for (let n = 2; n <= 6; n++) { const b = X.bestSingleUnit(n); assert(b.right < 2 ** n); assert.equal(X.parityCheck(X.parityNet(n, "one", b), n).right, b.right); }
}

/* Checkerboards: 57/19/18/61 at 8+8, exact cell by cell and on every boundary probe. */
{
  const counts = {and: 57, count: 19, skip: 18, xor: 61};
  for (const [k, u] of Object.entries(counts)) {
    const net = X.checkerNet(8, 8, k), s = X.netStats(net);
    assert.equal(s.units, u, `checker ${k} units`);
    assert.equal(X.checkerMismatch(net, 8, 8).area, 0, `checker ${k} exact`);
    for (const p of X.checkerProbes(8, 8)) assert.equal(X.netOut(net, p), X.checkerTarget(8, 8, p[0], p[1]), `${k} probe ${p}`);
    for (let i = 0; i <= 64; i++) for (let j = 0; j <= 64; j++) { const p = [i / 8, j / 8]; assert.equal(X.netOut(net, p), X.checkerTarget(8, 8, p[0], p[1]), `${k} grid ${p}`); }
    if (k === "count") { assert.equal(s.connections, 50); assert(s.layered); assert.equal(s.depth, 3); }
    if (k === "xor") assert.equal(s.depth, 9);
  }
  const f = X.checkerFormula(8, 8); deq([f.and, f.count, f.skip, f.xor, f.xorDepth, f.oddCells], [57, 19, 18, 61, 9, 40]);
  const f3 = X.checkerFormula(3, 3); deq([f3.and, f3.count, f3.skip, f3.xor], [15, 9, 8, 21]);
  for (let a = 1; a <= 5; a++) for (let b = 1; b <= 5; b++) for (const k of ["and", "count", "skip", "xor"]) {
    const net = X.checkerNet(a, b, k);
    assert.equal(X.checkerMismatch(net, a, b).area, 0); assert.equal(X.netStats(net).units, X.checkerFormula(a, b)[k]);
  }
  // Adversarial one hidden layer: default weights miss the 16 odd–odd cells; every crossing keeps a wrong quarter.
  const sh = X.checkerNet(8, 8, "shallow");
  assert.equal(X.checkerMismatch(sh, 8, 8).area, 16);
  let seed = 3; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let t = 0; t < 60; t++) {
    const s = {alpha: Array.from({length: 8}, () => rnd() * 4 - 2), beta: Array.from({length: 8}, () => rnd() * 4 - 2), gamma: rnd() * 6 - 3};
    const c = X.crossingFailures(X.checkerNet(8, 8, "shallow", s), 8, 8);
    assert.equal(c.fails.length, c.total, "crossing obstruction");
  }
}

/* Polygon formulas and bottleneck floors. */
{
  assert(near(X.circErr(8), 0.1721, 1e-4)); assert(near(X.inscErr(8), 0.3132, 1e-4));
  assert(X.circErr(33) <= 0.01 && X.circErr(32) > 0.01); assert.equal(X.smallestN(0.01, "circ"), 33);
  for (const N of [8, 32, 128]) {
    const b = X.bestPolygon(N);
    assert(near(b.d, b.dStar, 1e-6)); assert(b.err < X.circErr(N) && b.err < X.inscErr(N));
    assert(near(X.polyGrid(N, "circ", 600), X.circErr(N), 0.01));
  }
  const all = X.bottleneck(3, [1, 2, 3], [1, 2, 3]); assert.equal(all.floor, 0); assert.equal(all.codes, 16);
  const drop = X.bottleneck(3, [1, 3], [1, 2, 3]); assert.equal(drop.floor, 4); assert.equal(drop.codes, 12);
  const two = X.bottleneck(3, [1, 3], [1, 3]); assert.equal(two.floor, 6); assert.equal(two.codes, 9); assert(near(two.agreement, 10 / 16, 1e-12));
  assert.equal(X.bottleneck(3, [1, 3, 2.25], [1, 2, 3]).floor, 1);
  for (const d of [.1, .5, .75, 1]) assert(near(X.bottleneck(3, [1, 3, 2 + d], [1, 2, 3]).floor, 4 * d, 1e-12));
}

/* Universal approximation numbers of Section 7. */
let xyStep10;
{
  const n10 = X.uatNet("xy", "step", 10);
  assert.equal(n10.hidden, 22); assert(near(X.uatBound("xy", "step", 10), 0.4, 1e-12));
  xyStep10 = X.uatMeasure(n10, 101, -1, 1).max;
  assert(xyStep10 <= 0.4 && near(xyStep10, 0.2, 0.01), `xy step K=10 measured ${xyStep10}`);
  assert(near(X.uatMeasure(n10, 41, -1, 1).max, 0.2, 0.01));
  assert.equal(X.uatNet("xy", "step", 80).hidden, 162); assert(near(X.uatBound("xy", "step", 80), 0.05, 1e-12));
  const r7 = X.uatNet("xy", "relu", 7), m7 = X.uatMeasure(r7, 101, -1, 1).max;
  assert.equal(r7.hidden, 14); assert(near(X.uatBound("xy", "relu", 7), 2 / 49, 1e-12));
  assert(m7 <= 2 / 49 && near(m7, 0.020, 0.002), `xy relu K=7 measured ${m7}`);
  for (const key of ["xy", "diff", "sum", "xy2"]) for (const act of ["step", "relu"]) for (const K of [3, 10, 37]) {
    const m = X.uatMeasure(X.uatNet(key, act, K), 61, -1, 1).max;
    assert(m <= X.uatBound(key, act, K) + 1e-12, `${key} ${act} K=${K}`);
  }
  assert(X.uatMeasure(r7, 101, -2, 2).max > 1, "extrapolation must fail outside the box");
  // Revised core checkpoint: scale the actual ridge construction to 3xy.
  for (const [act, K, hidden] of [["step", 600, 1202], ["relu", 18, 36]]) {
    const net = X.uatNet("xy", act, K);
    assert.equal(net.hidden, hidden);
    assert(3 * X.uatBound("xy", act, K) <= .02);
    assert(3 * X.uatBound("xy", act, K - 1) > .02);
    assert(3 * X.uatMeasure(net, 41, -1, 1).max <= .02);
  }
  for (const q of [x => .75 * x, x => 1 + 2 * x - x * x, x => 0]) assert(near(X.cubeDivided(q), 1, 1e-12));
}

/* Cylinder tails and scale invariance. */
{
  assert(near(X.cylGap(2, 1, 3, 0), 0.4646, 1e-4)); assert(near(X.cylGap(3, 1, 3, 0), 0.5359, 1e-4)); assert(near(X.cylGap(100, 1, 3, 0), 0.9491, 1e-4));
  assert.equal(X.cylFirstFire(1, 3, 0), 3);
  for (const c of [.25, 2, 7]) for (const K of [2, 3, 100]) assert(near(X.cylGap(K, c, 3 * c, 0), X.cylGap(K, 1, 3, 0), 1e-12));
  // Finite edges converge to the limit fraction on average over directions.
  const avg = (N, r) => Array.from({length: 720}, (_, k) => X.cylFrac(r * Math.cos(2 * Math.PI * k / 720), r * Math.sin(2 * Math.PI * k / 720), 0, 1, N)).reduce((a, b) => a + b) / 720;
  for (const r of [1.5, 3]) assert(near(avg(256, r), .5 + Math.asin(1 / r) / Math.PI, .003));
  assert.equal(X.cylFrac(.3, .2, 0, 1, 8), 1);
}

/* Sawtooth: deep construction exact; interpolants with m = 2^k exact and m = 2^k − 2 at least ½ off. */
{
  deq(X.sawCapacity(6, 3), {pieces: 4096, maxKNotRuledOut: 12});
  deq(X.sawCapacity(5, 2), {pieces: 243, maxKNotRuledOut: 7});
  for (let k = 1; k <= 8; k++) {
    const P = 2 ** k;
    for (let j = 0; j <= 16 * P; j++) assert(near(X.deepSaw(k, j / (16 * P)), X.sawK(j / (16 * P), k), 1e-12));
    for (let i = 0; i <= P; i++) assert.equal(X.sawK(i / P, k), i % 2);
    // Equality at 1/2 admits a zero-hidden-unit constant, so strictness matters.
    let constantError = 0;
    for (let j = 0; j <= 16 * P; j++) constantError = Math.max(constantError, Math.abs(.5 - X.sawK(j / (16 * P), k)));
    assert.equal(constantError, .5);
    assert(X.sawMaxErr(k, P) < 1e-9, `m = 2^k exact for k=${k}`);
    assert.equal(X.sawSignChanges(k, P), P);
    if (k >= 2) { assert(X.sawMaxErr(k, P - 2) >= .5, `m = 2^k - 2 fails for k=${k}`); assert(X.sawSignChanges(k, P - 2) < P); }
    assert.equal(X.sawInterp(k, 37).units.length, 37);
  }
}

/* Kata references pass their own tests and respect the call limits. */
for (const kata of X.KATAS) {
  const H = X.makeHelpers();
  const fn = vm.runInNewContext(kata.js + ";" + kata.fn, {Math, neuron: H.neuron, step: H.step, relu: H.relu});
  for (const [name, check] of kata.tests) { X.resetHelpers(H); assert(check(fn, H), `${kata.id}: ${name}`); }
  const starter = vm.runInNewContext(kata.starter + ";" + kata.fn, {Math, neuron: H.neuron, step: H.step, relu: H.relu});
  assert(kata.tests.some(([, check]) => { X.resetHelpers(H); try { return !check(starter, H); } catch { return true; } }), `${kata.id}: starter must fail a test`);
  if (kata.id === "ptree") for (let n = 1; n <= 8; n++) for (let k = 0; k < 2 ** n; k++) { H.neuron.reset(); const x = bits(k, n); assert.equal(fn(x), x.reduce((a, b) => a + b, 0) % 2); assert(H.neuron.calls() <= 3 * (n - 1)); }
  if (kata.id === "checker") { H.neuron.reset(); fn(3.5, 4.5); assert.equal(H.neuron.calls(), 19); }
  if (kata.id === "saw") { H.relu.reset(); fn(5, .3); assert.equal(H.relu.calls(), 10); }
  if (kata.id === "xy") { H.step.reset(); fn(.1, .2, 20); assert.equal(H.step.calls(), 42); }
}
assert.equal(X.QUIZ.length, 12);
for (const q of X.QUIZ) assert(q.a >= 0 && q.a < q.o.length && q.why.length > 20);

/* Replaced checkpoints archive old attempts without resetting other student work. */
{
  const bankSource = read("public/theory/answers/nn-02-network-expressivity.js");
  const pageID = "nn-02-network-expressivity";
  const original = {[pageID]: {K1: {done: true}, K3: {old: "parity"}, K6: {old: "checkerboard"}}, other: {A1: "keep"}};
  const saved = new Map([["gu.work.v1", JSON.stringify(original)], ["notes", "keep my notes"]]);
  let bank;
  const localStorage = {getItem: k => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, v)};
  const run = storage => vm.runInNewContext(bankSource, {localStorage: storage, GU: {answers(id, b) {assert.equal(id, pageID); bank = b;}}});
  run(localStorage);
  deq(JSON.parse(saved.get("nn02:checkpoint-previous:v1")), {K3: original[pageID].K3, K6: original[pageID].K6});
  const active = JSON.parse(saved.get("gu.work.v1"));
  deq(active, {[pageID]: {K1: {done: true}}, other: {A1: "keep"}});
  assert.equal(saved.get("notes"), "keep my notes");
  active[pageID].K3 = {new: "ridge work"};
  saved.set("gu.work.v1", JSON.stringify(active));
  run(localStorage);
  deq(JSON.parse(saved.get("gu.work.v1")), active, "migration is idempotent");
  deq(bank.K3.fields.map(f => f.ans), [600, 1202, 18, 36]);
  deq(bank.K6.fields.map(f => f.ans), [31, 10, 32]);
  assert(bank.A11.fields.every(f => /lower bound/.test(f.label)), "A11 grades bounds, not unproved optima");
  const failing = new Map([["gu.work.v1", JSON.stringify(original)]]);
  run({getItem: k => failing.get(k) ?? null, setItem(k, v) {if (k === "nn02:checkpoint-previous:v1") throw Error("quota"); failing.set(k, v);}});
  deq(JSON.parse(failing.get("gu.work.v1")), original, "failed archive preserves active work");
  assert(!failing.has("nn02:checkpoint-version"));
}

console.log(`Validated NN02 k-map covers, parity table (n=6, dense 92) and n=2..10 networks, checkerboards 57/19/18/61 with probes and the crossing obstruction, ` +
  `polygon and bottleneck floors, ridge bounds (xy step K=10 measured ${xyStep10.toFixed(3)}), cylinder tails, sawtooth separation, and ${X.KATAS.length} kata references.`);
