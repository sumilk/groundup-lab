import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {checkLesson} from "./check-textbook-standard.mjs";
import {buildFigures} from "./figures/build.mjs";

const source = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const noop = () => {};
function element() {
  return {value: "1", checked: true, children: [], events: {}, style: {},
    classList: {add: noop, remove: noop}, setAttribute: noop,
    appendChild(child) { this.children.push(child); },
    addEventListener(name, fn) { this.events[name] = fn; }};
}

// Exercise the actual lab callbacks without needing a canvas or browser install.
function mount(name) {
  const elements = {};
  const root = {querySelector: key => elements[key] ||= element()};
  let options, plot;
  const views = [];
  const kit = {css: x => x, f: String, sw: () => "", mix: noop,
    shell: () => ({panel: root, canvas: {}}),
    plot(canvas, opts) {
      options = opts;
      plot = {grid: noop, axes: noop, poly: noop, line: noop, arrow: noop, dot: noop,
        resetCamera: noop,
        render: () => opts.draw(plot)};
      const view = plot;
      view.render = () => opts.draw(view);
      views.push({options: opts, plot: view});
      plot.render();
      return plot;
    }};
  kit.plot3 = kit.plot;
  kit.chart = (canvas, getSpec) => {
    const view = {render() {
      const spec = getSpec();
      assert(spec.x[1] > spec.x[0] && spec.y[1] > spec.y[0]);
      for (const series of spec.series || [])
        assert(series.points.every(point => point.every(Number.isFinite)));
    }};
    view.render(); return view;
  };
  kit.heatmap = (canvas, getSpec) => {
    const view = {render() {
      const spec = getSpec();
      assert(spec.limit > 0);
      assert(spec.matrix.every(row => row.every(Number.isFinite)));
    }};
    view.render(); return view;
  };
  vm.runInNewContext(source("public/theory/labs/svdkit.js"), {GU: {labkit: kit}});
  vm.runInNewContext(source(`public/theory/labs/${name}.js`), {
    GU: {lab: (id, callback) => callback(root), labkit: kit},
    document: {createElement: element, activeElement: null}
  });
  return {
    elements,
    set(...vectors) { vectors.forEach((v, i) => options.handles()[i].set(v)); plot.render(); },
    click(key) { elements[`[data-${key}]`].onclick(); },
    setInView(index, ...vectors) {
      const view = views[index];
      vectors.forEach((v, i) => view.options.handles()[i].set(v));
      views.forEach(v => v.plot.render());
    },
    verdict: () => elements["[data-verdict]"].innerHTML || elements["[data-verdict]"].textContent,
    readout: () => elements["[data-out]"].innerHTML
  };
}

const map = mount("la-map");
map.set([1, 0], [1, 0.01]);
assert.match(map.verdict(), /Full rank/);
assert.match(map.verdict(), /Near-singular/);
map.set([0.1, 0], [0, 0.1]);
assert.match(map.verdict(), /Full rank/);
assert.doesNotMatch(map.verdict(), /Near-singular/);
map.click("rank1");
assert.match(map.verdict(), /Rank 1/);
map.click("zero");
assert.match(map.verdict(), /Rank 0/);

const picture = mount("la-picture");
picture.set([1, 1], [0, 0.01], [0, 1]);
assert.match(picture.verdict(), /Exactly one solution/);
assert.match(picture.verdict(), /-100, 100/);
picture.click("sing");
assert.match(picture.verdict(), /No solution/);
picture.click("fit");
assert.match(picture.verdict(), /Infinitely many/);
picture.set([0, 0], [0, 0], [0, 0]);
assert.match(picture.verdict(), /every input in ℝ²/);
picture.set([0, 0], [0, 0], [0, 1]);
assert.match(picture.verdict(), /No solution/);

const span = mount("la-span");
span.set([1, 0], [1, 0.01]);
assert.match(span.verdict(), /Independent/);
span.click("dep");
assert.match(span.verdict(), /Dependent/);
span.set([0, 0], [0, 0]);
assert.match(span.verdict(), /just \{0\}/);

const basis = mount("la-basis");
basis.set([1, 0], [1, 0.01], [0, 1]);
assert.match(basis.verdict(), /Valid basis/);
assert.match(basis.verdict(), /-100/);
basis.click("deg");
assert.match(basis.verdict(), /Not a basis/);
basis.set([0, 0], [0, 0], [0, 0]);
assert.match(basis.verdict(), /Only the origin/);

const bench = mount("la-elim");
const large = 2 ** 40;
const fixture = [[1, large, 0, large], [1 / large, 2, 0, 2], [0, 0, 1, 3]];
bench.elements["[data-cells]"].children.forEach((input, index) => {
  input.value = String(fixture[Math.floor(index / 4)][index % 4]);
  input.events.input();
});
bench.click("step");
assert.equal(Number(bench.elements["[data-cells]"].children[5].value), 1);
bench.click("rref");
assert.match(bench.verdict(), /x = \(0, 1, 3\)/);

const projection = mount("la-project");
projection.elements["[data-metric]"].checked = false;
projection.elements["[data-c1]"].value = String(1 / 3);
projection.elements["[data-c2]"].value = String(1 / 3);
projection.set([1, 1, 0], [1, 0, 1], [0, 1, 1]);
assert.match(projection.readout(), /p = \(0.333/, "plane projection must be computed");
projection.click("collapse");
assert.match(projection.verdict(), /span a line, not a plane/);
projection.click("zero");
assert.match(projection.verdict(), /Zero subspace/);
projection.click("line");
projection.elements["[data-metric]"].checked = true;
projection.elements["[data-reveal]"].checked = true;
projection.set([2, 0, 0], [1, 1, 0]);
assert.match(projection.readout(), /p = \(0.4, 0.4, 0\)/);

const leastSquares = mount("la-lsq");
assert.match(leastSquares.readout(), /intercept, slope\) = \(1.1666666666666667, 0.5\)/);
leastSquares.click("equal");
assert.match(leastSquares.verdict(), /Fitted heights are unique; intercept and slope are not/);
leastSquares.click("exact");
assert.match(leastSquares.readout(), /‖r‖² = 0/);
leastSquares.setInView(0, [0, 1], [1, 2], [2, 2]);
assert.match(leastSquares.readout(), /‖r‖² = 0.166666666666666/);

const gs = mount("la-gramschmidt");
assert.doesNotMatch(gs.verdict(), /Stopped/);
gs.click("near");
assert.match(gs.verdict(), /Classical directions overlap/);
assert.match(gs.readout(), /7.07e-1/);
assert.match(gs.readout(), /1.00e-4/);
gs.elements["[data-precision]"].value = "64";
gs.elements["[data-precision]"].events.change();
assert.doesNotMatch(gs.verdict(), /Classical directions overlap/);
gs.click("dependent");
assert.match(gs.verdict(), /classical column 2, modified column 2/);
gs.click("zero");
assert.match(gs.verdict(), /classical column 1, modified column 1/);
gs.click("reset");
gs.elements["[data-count]"].value = "2";
gs.elements["[data-count]"].events.change();
gs.click("end");
assert.match(gs.elements["[data-stage]"].textContent, /Step 5 \/ 5/);
gs.setInView(0, [1, 0, 0], [0, 1, 0]);
assert.doesNotMatch(gs.verdict(), /Stopped/);

const determinant = mount("la-det");
assert.match(determinant.readout(), /det A = 5/);
assert.match(determinant.readout(), /det A = 7/);
determinant.click("shear");
assert.match(determinant.readout(), /det A = 5/);
determinant.click("swap");
assert.match(determinant.readout(), /det A = -5/);
determinant.click("collapse");
assert.match(determinant.verdict(), /Computed zero determinant/);
determinant.click("thin");
assert.match(determinant.verdict(), /Thin is not collapsed/);
assert.match(determinant.readout(), /1.000e-6/);
determinant.elements["[data-dimension]"].value = "3";
determinant.elements["[data-dimension]"].events.change();
determinant.click("collapse");
assert.match(determinant.verdict(), /Computed zero determinant/);
determinant.click("thin");
assert.match(determinant.verdict(), /Thin is not collapsed/);
determinant.click("reset");
determinant.click("shear");
assert.match(determinant.readout(), /det A = 7/);
determinant.click("swap");
assert.match(determinant.readout(), /det A = -7/);
for (const piece of ["0", "1", "2", "all"]) {
  determinant.elements["[data-piece]"].value = piece;
  determinant.elements["[data-piece]"].events.change();
  assert.match(determinant.readout(), /det A = -7/);
}
determinant.click("reset");
const cell = determinant.elements["[data-cells]"].children[0];
cell.value = "3"; cell.events.input();
assert.match(determinant.readout(), /det A = 11/);
cell.value = ""; cell.events.input();
assert.match(determinant.elements["[data-input-error]"].textContent, /finite coordinate/);
assert.match(determinant.readout(), /det A = 11/);

// Eigenline classification and iteration failure states exercise the real callbacks.
const eigen = mount("la-eigen");
const reveal = () => { eigen.elements["[data-reveal]"].checked = true; eigen.elements["[data-reveal]"].events.change(); };
reveal(); assert.match(eigen.verdict(), /Two distinct real eigenvalues/);
for (const [preset, text] of [["shear", /one eigenline/], ["scalar", /every line/], ["rotation", /No real invariant line/], ["collapse", /Two distinct real/]]) {
  eigen.click(preset); reveal(); assert.match(eigen.verdict(), text);
}
eigen.click("flip"); eigen.elements["[data-angle]"].value = "0"; eigen.elements["[data-angle]"].events.input();
assert.match(eigen.readout(), /λ̂ = -2/);
assert.match(eigen.readout(), /‖Av − λ̂v‖ = 0/);
const eigenCell = eigen.elements["[data-cells]"].children[0];
eigenCell.value = ""; eigenCell.events.input();
assert.match(eigen.elements["[data-error]"].textContent, /finite entry/);
const power = mount("la-power");
function choose(key, value) { const e = power.elements[`[data-${key}]`]; e.value=value; e.events.change(); }
choose("preset", "rotation"); power.click("jump");
assert.match(power.readout(), /updates = 20/);
assert(Math.abs(Number(power.readout().split("log₁₀ raw length = ")[1])) < 1e-12);
choose("preset", "stable"); choose("start", "second"); power.click("step");
assert.match(power.readout(), /log₁₀ raw length = 0.605/);
assert.match(power.verdict(), /temporary growth/);
choose("preset", "separated");
assert.match(power.verdict(), /not a certificate of dominance/);
power.click("jump"); assert.match(power.readout(), /λ̂ = 1/);
choose("preset", "zero"); power.click("step");
assert.match(power.verdict(), /next normalized vector is undefined/);
assert.match(power.readout(), /log₁₀ raw length = −∞/);
choose("preset", "negative"); choose("start", "first"); power.click("step");
assert.match(power.readout(), /line change = 0/);
assert.match(power.readout(), /λ̂ = -2/);
choose("preset", "close"); choose("start", "mixed"); power.click("jump");
assert.doesNotMatch(power.verdict(), /Small computed residual/);

// Link geometry, directional readings, and exact degeneracies in Module 7.
const quadratic = mount("la-quadform");
assert.match(quadratic.verdict(), /Positive definite/);
function quadraticInput(name, value) {
  const control = quadratic.elements[`[data-${name}]`];
  control.value = String(value); control.events.input();
}
quadraticInput("axis", 0); quadraticInput("probe", 90);
assert.match(quadratic.readout(), /R = 3/);
quadraticInput("probe", 0); assert.match(quadratic.readout(), /R = 1/);
quadratic.click("saddle");
assert.match(quadratic.verdict(), /null space is only the origin/);
// The default probe is 45 degrees relative to the axes: zero value, residual one.
assert.match(quadratic.readout(), /residual norm = 1/);
quadratic.click("flat"); assert.match(quadratic.verdict(), /two parallel lines/);
quadraticInput("probe", 120);
assert.match(quadratic.readout(), /residual norm = /);
quadratic.click("negative"); assert.match(quadratic.verdict(), /Negative definite/);
quadratic.click("isotropic"); assert.match(quadratic.verdict(), /every direction is an eigenvector/);
assert.match(quadratic.readout(), /residual norm = 0/);
quadratic.click("zero"); assert.match(quadratic.verdict(), /zero set is the entire plane/);
assert.match(quadratic.verdict(), /level sets are empty/);
assert.match(quadratic.elements["[data-pivots]"].textContent, /Stop: first pivot/);
quadratic.click("bowl");
quadraticInput("first", -2); quadraticInput("second", 0);
assert.match(quadratic.verdict(), /Negative semidefinite, singular/);
quadraticInput("first", 0); quadraticInput("second", 2);
assert.match(quadratic.verdict(), /Positive semidefinite, singular/);
quadratic.setInView(0, [1,0]);
assert.match(quadratic.readout(), /φ = 0°/);

// Module 8: real callbacks must remain truthful at rank and variance boundaries.
const singular = mount("la-svd");
assert.match(singular.verdict(), /Two computed positive channels/);
singular.click("thin");assert.match(singular.verdict(), /tolerance discards a positive computed gain/);
assert.match(singular.readout(), /numerical rank = 1/);
singular.elements["[data-tolerance]"].value="0.0000000001";
singular.elements["[data-tolerance]"].events.change();
assert.match(singular.readout(), /numerical rank = 2/);
singular.click("rankone");assert.match(singular.verdict(), /line segment/);
singular.click("zero");assert.match(singular.verdict(), /collapses to a point/);
singular.click("isotropic");assert.match(singular.verdict(), /not uniquely identified/);
singular.click("reflection");assert.match(singular.readout(), /σ = \(3, 1\)/);
singular.elements["[data-reveal]"].checked=true;singular.elements["[data-reveal]"].events.change();
singular.elements["[data-truncate]"].checked=true;singular.elements["[data-truncate]"].events.change();
singular.setInView(1,[1,0],[0,0]);assert.match(singular.verdict(), /rank one/);
const singularCell=singular.elements["[data-cells]"].children[0];
singularCell.value='';singularCell.events.input();assert.match(singular.elements["[data-error]"].textContent,/finite number/);
const approximation=mount("la-approx");
function approximationRank(k){const c=approximation.elements["[data-rank]"];c.value=String(k);c.events.input();}
approximation.click("ranktwo");approximationRank(1);assert.match(approximation.readout(),/squared error = 9/);
approximationRank(2);assert.match(approximation.verdict(),/All positive channels retained/);
approximation.click("zero");assert.match(approximation.readout(),/undefined \(zero total\)/);
approximation.click("flat");approximationRank(0);assert.match(approximation.readout(),/squared error = 24/);
approximationRank(6);assert.match(approximation.readout(),/Frobenius error = 0/);
const pca=mount("la-pca");assert.match(pca.verdict(),/Centered PCA/);
pca.elements["[data-center]"].checked=false;pca.elements["[data-center]"].events.change();
assert.match(pca.verdict(),/not centered explained variance/);
pca.elements["[data-center]"].checked=true;pca.elements["[data-center]"].events.change();
pca.click("isotropic");assert.match(pca.verdict(),/every line/);
pca.click("identical");assert.match(pca.verdict(),/fractions are undefined/);
assert.match(pca.readout(),/candidate error² = 0/);
pca.click("line");assert.match(pca.readout(),/optimal error² = /);
pca.elements["[data-reveal]"].checked=true;pca.elements["[data-reveal]"].events.change();
// Exact hand fixture plus two mean observations: error stays 2; variances use N=6.
const cloud=[[ -2,0],[2,0],[0,-1],[0,1],[0,0],[0,0]];
pca.setInView(0,...cloud);
assert.match(pca.readout(),/optimal error² = 2/);
pca.elements["[data-angle]"].value='45';pca.elements["[data-angle]"].events.input();
assert(Math.abs(Number(pca.readout().match(/candidate error² = ([^<]+)/)[1])-5)<1e-12);

// LA09: check prediction/reveal, scale invariance, and singular failure paths.
const norms = mount("la-norms");
assert.match(norms.readout(), /Predict the maximum/);
norms.elements["[data-reveal]"].checked = true;
norms.elements["[data-reveal]"].events.change();
assert.match(norms.readout(), /Induced norm ‖A‖p = 4/);
norms.elements["[data-norm]"].value = 'inf';
norms.elements["[data-norm]"].events.change();
assert.equal(norms.elements["[data-reveal]"].checked, false);
norms.elements["[data-reveal]"].checked = true;
norms.elements["[data-reveal]"].events.change();
assert.match(norms.readout(), /Induced norm ‖A‖p = 3/);
norms.click("zero");
assert.match(norms.verdict(), /Zero map/);
norms.elements["[data-reveal]"].checked = true;
norms.elements["[data-reveal]"].events.change();
assert.match(norms.readout(), /Induced norm ‖A‖p = 0/);
norms.click("rankone");
norms.elements["[data-norm]"].value = '2';
norms.elements["[data-norm]"].events.change();
norms.elements["[data-reveal]"].checked = true;
norms.elements["[data-reveal]"].events.change();
assert(Math.abs(Number(norms.readout().match(/Induced norm ‖A‖p = ([^<]+)/)[1])-Math.sqrt(5))<1e-12);

const condition = mount("la-condition");
function revealCondition() {
  condition.elements["[data-reveal]"].checked = true;
  condition.elements["[data-reveal]"].events.change();
}
function conditionNumber(label) {
  return Number(condition.readout().split(label+' = ')[1].split('<')[0]);
}
assert.match(condition.readout(), /Predict the residual/);
revealCondition();
assert.equal(conditionNumber('Relative forward error'), 1);
assert.equal(conditionNumber('Relative residual'), 1e-6);
const eta = conditionNumber('Normwise backward error η₂');
assert(Math.abs(eta-1e-6/(Math.SQRT2+1))<1e-11);
condition.click('scaled');
assert.equal(condition.elements["[data-reveal]"].checked, false);
revealCondition();
assert.equal(conditionNumber('Absolute residual ‖r‖₂'), 1);
assert.equal(conditionNumber('Relative forward error'), 1);
assert.equal(conditionNumber('Normwise backward error η₂'), eta);
condition.click('benign');revealCondition();
assert.equal(conditionNumber('Relative forward error'), 1e-6);
condition.click('singular');revealCondition();
assert.match(condition.verdict(), /inconsistent/);
assert.doesNotMatch(condition.readout(), /NaN/);
condition.elements["[data-angle]"].value = '0';
condition.elements["[data-angle]"].events.input();revealCondition();
assert.match(condition.verdict(), /infinitely many solutions/);

// Numerical geometry helper: audit paired equations and reconstruction independently.
const svdMath={};vm.runInNewContext(source("public/theory/labs/svdkit.js"),{GU:{labkit:svdMath}});
for(const A of [[[1,2],[0,1]],[[-3,0],[0,1]],[[1,2],[0,0]],[[0,0],[0,0]],[[2,0],[0,2]],[[1,0],[0,1e-10]]]){
  const {U,s,Vt}=svdMath.svd2(A), reconstructed=svdMath.truncate(U,s,Vt,2);
  assert(s[0]>=s[1] && s[1]>=0);
  for(let i=0;i<2;i++)for(let j=0;j<2;j++){
    assert(Math.abs(reconstructed[i][j]-A[i][j])<1e-12);
    assert(Math.abs(U[0][i]*U[0][j]+U[1][i]*U[1][j]-(i===j?1:0))<1e-12);
    assert(Math.abs(Vt[i][0]*Vt[j][0]+Vt[i][1]*Vt[j][1]-(i===j?1:0))<1e-12);
  }
}

// Lessons upgraded to the textbook-quality standard get its mechanical gate.
const UPGRADED = new Set(["01-span", "02-elimination", "09-conditioning"]);

// Marking must use the same complete exercise shown in the lesson, not an older fixture.
for (const [bank, file] of [["01-span", "01-vectors-spaces-bases.md"],
  ["02-elimination", "02-systems-elimination-subspaces.md"],
  ["03-projection", "03-projections-least-squares.md"],
  ["04-qr", "04-orthonormal-bases-qr.md"],
  ["05-determinant", "05-determinants-volume.md"],
  ["06-eigen", "06-eigenvalues-diagonalization.md"],
  ["07-spectral", "07-spectral-theorem-quadratic-forms.md"],
  ["08-svd", "08-svd-low-rank.md"],
  ["09-conditioning", "09-norms-conditioning-stability.md"]]) {
  const entries = {};
  vm.runInNewContext(source(`public/theory/answers/${bank}.js`), {
    GU: {answers: (key, data) => Object.assign(entries, data)}
  });
  const md = source(`content/02-linear-algebra/${file}`);
  const prompts = [...md.matchAll(/^> \*\*Practice[^\n]*\n>\n> \*\*Hint:\*\* ([^\n]+)/gm)];
  assert.equal(prompts.length, (md.match(/^> \*\*Practice/gm) || []).length,
    `${file}: every practice prompt needs an authored offline hint`);
  assert(prompts.every(p => p[1].trim().length > 25), `${file}: empty hint`);
  const headers = [...md.matchAll(/^\*\*([A-Z]\d+) · [^\n]+?\*\*/gm)];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i], entry = entries[header[1]];
    const statement = md.slice(header.index, headers[i + 1]?.index ?? md.length)
      .split(/^## |^> \*\*Practice|^\*\*What to bring/m)[0].trim();
    assert.equal(entry.statement, statement, `${bank}/${header[1]} marking prompt is stale`);
    assert(entry.plain && entry.solution, `${bank}/${header[1]} missing reference`);
  }
  if (UPGRADED.has(bank)) checkLesson({file, markdown: md, entries});
}

// Generated figures must match their source scripts (node scripts/figures/build.mjs).
for (const [name, svg] of Object.entries(await buildFigures()))
  assert.equal(source(`content/assets/${name}.svg`), svg, `figure ${name} is stale; run node scripts/figures/build.mjs`);
console.log("Validated LA near-singular and degenerate labs, elimination regression, and marking prompts.");
