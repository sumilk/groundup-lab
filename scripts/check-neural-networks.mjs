/* Checks for the neural-networks lecture track (content/09-deep-learning-core).

   Validates the synced source manifest, that every lecture maps to exactly one module,
   that the module map and detailed briefs agree, that reserved IDs are unique across the
   curriculum, and that any authored lesson matches its brief and passes the
   textbook-standard checks. Run after scripts/neural-networks/sync-sources.mjs. */
import assert from "node:assert/strict";
import {existsSync, readFileSync, readdirSync} from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
import {checkLesson} from "./check-textbook-standard.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const track = path.join(root, "content", "09-deep-learning-core");
const read = p => readFileSync(p, "utf8");
const plan = read(path.join(track, "_plan.md"));
const manifest = JSON.parse(read(path.join(track, "_sources.json")));

/* Manifest shape. */
const offerings = Object.entries(manifest.offerings || {});
assert(offerings.length > 0, "_sources.json has no offerings; run pnpm nn:sync");
for (const [name, offering] of offerings) {
  assert(offering.lectures.length > 0, `${name}: no lectures`);
  assert.equal(new Set(offering.lectures.map(l => l.number)).size, offering.lectures.length, `${name}: duplicate lecture numbers`);
  for (const lecture of offering.lectures) {
    assert(lecture.topics.length && lecture.topics.every(t => t.length), `${name} ${lecture.number}: no topics`);
    for (const url of [lecture.slides, lecture.video, ...lecture.readings.map(r => r.url)].filter(Boolean))
      assert(/^https?:\/\//.test(url), `${name} ${lecture.number}: relative URL ${url}`);
  }
}

/* Lecture references: "F26 9, 10; S26 9". */
function lectureRefs(cell, where) {
  return cell.split(";").map(s => s.trim()).filter(Boolean).flatMap(part => {
    const match = part.match(/^([A-Z]\d\d) (\d+(?:, ?\d+)*)$/);
    assert(match, `${where}: cannot parse lecture reference "${part}"`);
    return match[2].split(",").map(n => `${match[1]} ${+n}`);
  });
}

/* Module map. */
const rows = [...plan.matchAll(/^\| (NN\d\d) \| ([^|]+) \| (\d+) \| ([^|]+) \| ([^|]+) \|$/gm)]
  .map(([, handle, title, hours, prereqs, lectures]) => ({
    handle, title: title.trim(), hours: +hours,
    prereqs: prereqs.split(",").map(s => s.trim()),
    lectures: lectureRefs(lectures, handle)
  }));
assert(rows.length > 0, "Module map not found");
rows.forEach((row, i) => assert.equal(row.handle, "NN" + String(i + 1).padStart(2, "0"), "Module handles must run NN01, NN02, … in order"));
const handles = new Set(rows.map(r => r.handle));
const crossTrack = /^(F|PY|LA|OPT|DS|PS|IL|ML|PT|DLA|NLP|SYS|RL|APP|RP)\d\d$/;
for (const row of rows) for (const p of row.prereqs) {
  if (p.startsWith("NN")) assert(handles.has(p) && p < row.handle, `${row.handle}: prerequisite ${p} must be an earlier module`);
  else assert(crossTrack.test(p), `${row.handle}: unknown prerequisite handle ${p}`);
}
const totalHours = rows.reduce((sum, r) => sum + r.hours, 0);
const scope = plan.match(/\*\*Planned scope:\*\* (\d+) modules and (\d+) estimated study hours/);
assert(scope, "Plan must state its planned scope");
assert.equal(+scope[1], rows.length, "Stated module count differs from the module map");
assert.equal(+scope[2], totalHours, "Stated hours differ from the module map total");

/* Every synced lecture maps to exactly one module or is explicitly excluded. */
const excluded = lectureRefs(plan.match(/^\*\*Lectures excluded from the map:\*\* ([^.]+)\./m)?.[1] ?? "", "excluded list");
const owner = new Map();
for (const [handle, refs] of [...rows.map(r => [r.handle, r.lectures]), ["excluded", excluded]])
  for (const ref of refs) {
    assert(!owner.has(ref), `Lecture ${ref} is mapped twice (${owner.get(ref)} and ${handle})`);
    owner.set(ref, handle);
  }
const known = new Set(offerings.flatMap(([name, o]) => o.lectures.map(l => `${name} ${l.number}`)));
for (const ref of owner.keys()) assert(known.has(ref), `Map references lecture ${ref}, which is not in _sources.json`);
const unmapped = [...known].filter(ref => !owner.has(ref));
assert(!unmapped.length, `Unmapped lectures (extend §3 of the plan): ${unmapped.join(", ")}`);

/* Detailed briefs agree with the map. */
const briefs = new Map();
for (const block of plan.split(/^(?=\*\*Module \d+ — )/m).slice(1)) {
  const header = block.match(/^\*\*Module (\d+) — (.+)\*\*$/m);
  const meta = block.match(/^`handle: (NN\d\d)` · `id: (neural-networks\.[a-z0-9-]+)` · (\d+)h · prerequisites: ([^·]+) · proposed bank: `([^`]+)`$/m);
  assert(header && meta, `Malformed brief header near "${block.slice(0, 60)}"`);
  const [, handle, id, hours, prereqs, bank] = meta;
  assert.equal(handle, "NN" + header[1], `Brief number differs from its handle: ${handle}`);
  const row = rows.find(r => r.handle === handle);
  assert(row, `Brief ${handle} has no module-map row`);
  assert.equal(header[2].trim(), row.title, `${handle}: brief title differs from the module map`);
  assert.equal(+hours, row.hours, `${handle}: brief hours differ from the module map`);
  assert.deepEqual(prereqs.split(",").map(s => s.trim()), row.prereqs, `${handle}: brief prerequisites differ from the module map`);
  assert.equal(bank, `nn-${handle.slice(2)}-${id.split(".")[1]}`, `${handle}: bank must be nn-<NN>-<id slug>`);
  for (const field of ["Spine and derivations", "Readings", "Interactive experiment", "Implementation ladder", "RE gate", "RS gate"])
    assert(new RegExp(`^\\*\\*${field}:\\*\\* \\S`, "m").test(block), `${handle}: missing "${field}"`);
  const lab = block.match(/^\*\*Interactive experiment:\*\* `(nn-[a-z0-9-]+)`/m)?.[1];
  assert(lab, `${handle}: interactive experiment needs an nn- lab ID`);
  assert(!briefs.has(handle), `Duplicate brief ${handle}`);
  briefs.set(handle, {id, bank, lab, hours: +hours});
}
assert.deepEqual([...briefs.keys()], rows.map(r => r.handle), "Every module needs exactly one brief, in order");
for (const key of ["id", "bank", "lab"]) {
  const values = [...briefs.values()].map(b => b[key]);
  assert.equal(new Set(values).size, values.length, `Duplicate ${key} among briefs`);
}

/* Reserved IDs must not collide with any lesson ID or plan reservation elsewhere. */
const foreignIds = new Set();
const contentRoot = path.join(root, "content");
for (const dir of readdirSync(contentRoot, {withFileTypes: true}).filter(d => d.isDirectory() && d.name !== "09-deep-learning-core"))
  for (const file of readdirSync(path.join(contentRoot, dir.name)).filter(f => f.endsWith(".md")))
    for (const m of read(path.join(contentRoot, dir.name, file)).matchAll(/(?:^id: |`id: )([a-z0-9.-]+)/gm)) foreignIds.add(m[1]);
for (const {id} of briefs.values()) assert(!foreignIds.has(id), `${id} is already used outside this track`);

/* Authored lessons. */
const allIds = new Set(foreignIds);
const lessons = readdirSync(track).filter(f => /^\d\d-.*\.md$/.test(f)).sort();
for (const file of lessons) {
  const markdown = read(path.join(track, file));
  const front = Object.fromEntries([...(markdown.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "").matchAll(/^(\w+): (.+)$/gm)].map(m => [m[1], m[2]]));
  allIds.add(front.id);
  const handle = "NN" + file.slice(0, 2), brief = briefs.get(handle);
  assert(brief, `${file}: no brief for ${handle}`);
  assert.equal(front.id, brief.id, `${file}: front-matter id differs from the brief`);
  assert.equal(+front.estimated_hours, brief.hours, `${file}: estimated_hours differs from the brief`);
  assert.equal(file, `${file.slice(0, 2)}-${brief.id.split(".")[1]}.md`, `${file}: filename must be <NN>-<id slug>.md`);
  assert(/^# .+$/m.test(markdown), `${file}: missing H1`);
  if (front.answers) {
    assert.equal(front.answers, brief.bank, `${file}: answers bank differs from the brief`);
    const bankFile = path.join(root, "public", "theory", "answers", front.answers + ".js");
    assert(existsSync(bankFile), `${file}: answer bank ${front.answers}.js is missing`);
    let entries;
    vm.runInNewContext(read(bankFile), {GU: {answers: (key, bank) => { assert.equal(key, front.answers); entries = bank; }}});
    for (let k = 1; k <= 6; k++) assert(entries["K" + k], `${file}: checkpoint K${k} missing`);
    const exercises = [...markdown.matchAll(/^\*\*([ABCMK]\d+) · /gm)].map(m => m[1]);
    assert.deepEqual(Object.keys(entries).sort(), [...exercises].sort(), `${file}: answer bank keys differ from the lesson's exercises`);
    for (const [id, e] of Object.entries(entries)) assert(markdown.includes(e.statement), `${file}: ${id} statement differs from the lesson`);
    checkLesson({file, markdown, entries});
  }
}
for (const file of lessons) {
  const prereqs = read(path.join(track, file)).match(/^prerequisites: \[(.*)\]$/m)?.[1];
  for (const id of (prereqs ?? "").split(",").map(s => s.trim()).filter(Boolean))
    assert(allIds.has(id), `${file}: unresolved prerequisite ${id}`);
}

const lectureCount = offerings.reduce((n, [, o]) => n + o.lectures.length, 0);
await import("./check-nn01-math.mjs");
await import("./check-nn02-math.mjs");
console.log(`Validated ${offerings.length} offerings (${lectureCount} lectures, synced ${manifest.synced}), ` +
  `${rows.length} modules / ${totalHours}h, ${owner.size - excluded.length} mapped and ${excluded.length} excluded lectures, ` +
  `${lessons.length} authored lessons.`);
