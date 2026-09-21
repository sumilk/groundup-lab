import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

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

// Marking must use the same complete exercise shown in the lesson, not an older fixture.
for (const [bank, file] of [["01-span", "01-vectors-spaces-bases.md"],
  ["02-elimination", "02-systems-elimination-subspaces.md"],
  ["03-projection", "03-projections-least-squares.md"],
  ["04-qr", "04-orthonormal-bases-qr.md"],
  ["05-determinant", "05-determinants-volume.md"]]) {
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
}
console.log("Validated LA near-singular and degenerate labs, elimination regression, and marking prompts.");
