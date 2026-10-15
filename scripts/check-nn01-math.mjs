/* Behavioral checks for NN01's actual student-facing evaluator and references.
   The VM exposes local definitions only in this test; production exports and
   saved-state keys are unchanged. Run directly or through nn:check. */
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const source = read("public/theory/labs/nn-01.js");
const window = {GU: {lab() {}}, addEventListener() {}};
const instrumented = source.replace(/\}\)\(\);\s*$/, "GU.checkNN01 = {compileNet, REG, KATAS, PF, pulseApprox, cylinderGeometry, makeNeuron};\n})();");
assert.notEqual(instrumented, source, "Test instrumentation must reach the lab closure");
vm.runInNewContext(instrumented, {window, Math, Set, console});
const {compileNet, REG, KATAS, PF, pulseApprox, cylinderGeometry, makeNeuron} = window.GU.checkNN01;
const bits = n => Array.from({length: 2 ** n}, (_, k) => Array.from({length: n}, (_, j) => (k >> j) & 1));

// Run the actual reference programs through the same restricted compiler as the UI.
for (const id of ["diamond", "outside", "twosq", "hex", "ring", "two"]) {
  const challenge = REG.find(c => c.id === id);
  const net = compileNet(challenge.sol, ["x1", "x2"], ["step"]);
  const points = [];
  // Binary fractions make these rational boundary probes exact in floating point.
  for (let ix = -24; ix <= 24; ix++) for (let iy = -24; iy <= 24; iy++) points.push([ix / 8, iy / 8]);
  points.push([.999, 0], [1.001, 0], [1.999, 0], [2.001, 0]);
  for (const [x1, x2] of points) assert.equal(net.run({x1, x2}) >= .5, challenge.t(x1, x2), `${id} at (${x1},${x2})`);
  if (id === "ring") {
    assert.equal(net.layers, 2);
    const natural = challenge.sol.replace("out = step(O + 0.25*Q - 4.25)", "A = step(O - 4)\nB = step(Q - 1)\nout = step(A + B - 2)");
    const deep = compileNet(natural, ["x1", "x2"], ["step"]);
    assert.equal(deep.layers, 3);
    for (const [x1, x2] of points) assert.equal(deep.run({x1, x2}) >= .5, challenge.t(x1, x2), `natural ring at (${x1},${x2})`);
  }
}

// The shallow impossibility argument must use real input witnesses, not only abstract counts.
const shallow = REG.find(c => c.id === "shallow");
for (const [x1, x2, d, s] of [[-1,1,4,2],[1.5,0,2,4],[.25,.5,3,3]]) {
  const env = {x1, x2}; compileNet(shallow.starter, ["x1","x2"], ["step"]).run(env);
  assert.equal(env.D, d); assert.equal(env.S, s);
}

// Exercise the supplied kata implementations and their own behavioral tests.
for (const kata of KATAS) {
  const neuron = makeNeuron();
  const fn = vm.runInNewContext(kata.js + ";" + kata.fn, {Math, neuron});
  for (const [name, check] of kata.tests) assert(check(fn, neuron), `${kata.id}: ${name}`);
  if (kata.id === "parity") for (let n = 1; n <= 8; n++) for (const x of bits(n)) assert.equal(fn(x), x.reduce((a,b) => a+b,0) % 2);
  if (kata.id === "oja") {
    const first = fn([2],[1],1), next = fn(first,[1],1);
    assert.equal(first[0], -4); assert.equal(next[0], 56, "Discrete Oja can overshoot");
  }
}

// The raw pulse evaluator is zero at its final edge, including for nonzero targets.
const L = 2 * Math.PI;
for (const K of [1, 4, 12, 63]) {
  assert.equal(pulseApprox(() => 7, K, L, L), 0);
  assert.equal(pulseApprox(() => 7, K, L + .1, L), 0);
  assert.equal(pulseApprox(() => 7, K, L - 1e-8, L), 7);
  for (let j = 0; j <= 2000; j++) {
    const x = j * L / 2000;
    assert(Math.abs(pulseApprox(PF.sin, K, x, L) - Math.sin(x)) <= Math.PI / K + 1e-12);
  }
}
const pulse = compileNet("a = step(x1 - 2)\nb = step(x1 - 5)\nout = 1.5*(a - b)", ["x1"], ["step"]);
for (const [x1, expected] of [[1,0],[2,1.5],[3,1.5],[5,0],[6,0]]) assert.equal(pulse.run({x1}), expected);

// Use the normals/offset actually consumed by the cylinder heat map and curve.
function fraction(N, r, angle) {
  const g = cylinderGeometry(N), x = r * Math.cos(angle), y = r * Math.sin(angle);
  return g.cos.filter((c,k) => c*x+g.sin[k]*y <= g.offset+1e-14).length / N;
}
for (const N of [3,8,32,128]) for (const a of [0,.1,.5,1,2,3]) assert.equal(fraction(N,1,a), 1, "Circumscribed polygon must include the closed unit disc");
const limit = r => .5 + Math.asin(1/r)/Math.PI;
for (const r of [1.5,2,4,10]) {
  const measured = Array.from({length:360}, (_,k) => fraction(128,r,2*Math.PI*k/360)).reduce((a,b) => a+b,0)/360;
  assert(Math.abs(measured-limit(r)) < .002, `Finite cylinder at radius ${r}`);
}
assert(2*limit(3)-.5 > 2/3, "Limiting overlapping tails create the documented false positive");
assert(fraction(4096,3,0)+fraction(4096,3,Math.PI)-.5 > 2/3, "More edges do not fix the union rule");

console.log("Validated NN01 reference networks, closed-ring boundaries, kata implementations, pulse endpoints, and cylinder geometry/tail counterexample.");
