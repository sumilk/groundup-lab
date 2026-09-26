/* Mechanical checks for the textbook-quality standard
   (content/_plans.md#textbook-quality-standard, rules C, G and H).

   A track checker calls checkLesson for each lesson it lists as upgraded.
   These checks catch structure and bank-hygiene regressions; they do not
   judge prose quality, which still needs the benchmark audit. */
import assert from "node:assert/strict";

const words = s => (s.match(/\S+/g) || []).length;
const tokens = s => new Set(s.toLowerCase().replace(/^\*\*[^*]*\*\*/, "").match(/[\p{L}\p{N}⁻₀-₉]+/gu) || []);
function jaccard(a, b) {
  let common = 0;
  for (const x of a) if (b.has(x)) common++;
  return common / (a.size + b.size - common || 1);
}
/* Concrete data in a prompt: matrices, diag(...), tuples, and LaTeX matrices. */
function literals(s) {
  const found = s.replace(/\s+/g, "").match(/diag\([^)]*\)|\[\[[^\]]*\](?:,\[[^\]]*\])*\]|\((?:[−\-]?[\d./√⁻¹²³⁴⁵⁶⁷⁸⁹⁰ε]+,){1,}[−\-]?[\d./√⁻¹²³⁴⁵⁶⁷⁸⁹⁰ε]+\)|\\begin\{pmatrix\}.*?\\end\{pmatrix\}/g) || [];
  return new Set(found.map(x => x.replace(/−/g, "-")));
}
/* A bank item duplicates a practice prompt when it reuses all its concrete data
   (at least one literal) or when the wording is largely the same. */
function duplicates(statement, prompt) {
  const a = literals(statement), b = literals(prompt);
  const overlap = jaccard(tokens(statement), tokens(prompt));
  // Two or more shared literals is the same data. A single shared literal counts
  // only when it is fully numeric: diag(1,ε) names a family, [[4,2],[2,3]] a fixture.
  // Tuples made only of 0 and ±1 (e₁, (1,1), …) are too generic to identify a fixture.
  const numeric = x => !/[a-zA-Zε]/.test(x.replace(/diag|begin|end|pmatrix/g, "")) && /[2-9]|\d\d|\./.test(x);
  if (a.size >= 1 && [...a].every(x => b.has(x)) && (a.size >= 2 || numeric([...a][0]))) return "reuses the same data";
  if (overlap > 0.5) return "repeats the wording";
  return null;
}

export function checkLesson({file, markdown, entries}) {
  const label = file.split("/").pop();
  /* Rule C: figure density across numbered teaching sections. */
  const teaching = markdown.split(/^(?=## )/m).filter(sec => /^## [1-9]\d*\. /.test(sec))
    .filter(sec => !/^## \d+\. .*(runnable|Runnable|coding labs|Exercises|Derivations to own|Checkpoint)/.test(sec));
  const withFigure = teaching.filter(sec => /^```lab\b|!\[[^\]]+\]\([^)]+\)/m.test(sec));
  assert(teaching.length > 0, `${label}: no numbered teaching sections found`);
  assert(withFigure.length >= Math.ceil(0.75 * teaching.length),
    `${label}: ${withFigure.length}/${teaching.length} teaching sections have a figure; the standard needs at least three quarters`);
  for (const image of markdown.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g))
    assert(image[1].trim().length >= 20, `${label}: figure ${image[2]} needs descriptive alt text`);

  /* Rule H: no unnumbered section may strand exercises. */
  for (const sec of markdown.split(/^(?=## )/m).filter(sec => /^## (?!\d+\.)/.test(sec)))
    assert(!/^\*\*[ABCMK]\d+ · /m.test(sec), `${label}: exercises in unnumbered section "${sec.split("\n")[0]}"`);

  /* Rule G: a bank item must not re-ask a worked example. It fails when all of its
     concrete data (two or more literals, or one fully numeric literal) already
     appear together in one teaching section or in the lesson's opening. */
  const opening = markdown.split(/^## /m)[0];
  const numericLiteral = x => !/[a-zA-Zε]/.test(x.replace(/diag|begin|end|pmatrix/g, "")) && /[2-9]|\d\d|\./.test(x);
  const sections = [["the opening", opening], ...teaching.map(sec => [sec.split("\n")[0].replace(/^## /, "§"), sec])];
  for (const [id, entry] of Object.entries(entries)) {
    const data = literals(entry.statement);
    if (!data.size || (data.size === 1 && !numericLiteral([...data][0]))) continue;
    for (const [where, text] of sections) {
      const seen = literals(text);
      assert(![...data].every(x => seen.has(x)), `${label} ${id} re-asks a worked example: all its data (${[...data].join(", ")}) appear in ${where}`);
    }
  }

  /* Rule G: bank items are distinct from practice and from each other. */
  const practice = [...markdown.matchAll(/^> \*\*Practice — \w+:\*\* (.+)$/gm)].map(m => m[1]);
  const ids = Object.keys(entries);
  for (const id of ids) {
    const entry = entries[id];
    for (const prompt of practice) {
      const why = duplicates(entry.statement, prompt);
      assert(!why, `${label} ${id} ${why} as section practice: "${prompt.slice(0, 80)}…"`);
    }
    if (id.startsWith("K")) for (const other of ids.filter(o => !o.startsWith("K"))) {
      const why = duplicates(entry.statement, entries[other].statement);
      assert(!why, `${label} checkpoint ${id} ${why} as ${other}`);
    }
    /* Written items need a model solution of real length and explicit marking criteria. */
    if (!entry.fields) {
      assert(words(entry.plain) >= 40, `${label} ${id}: written model answer is only ${words(entry.plain)} words`);
      assert(/Rubric:/.test(entry.plain), `${label} ${id}: written item needs "Rubric:" criteria`);
    } else if (/\b(prove|show that|explain|justify|derive|why)\b/i.test(entry.statement.replace(/^\*\*[^*]*\*\*/, ""))) {
      // Typed fields check the numbers; the written part still needs marking criteria.
      assert(/Rubric:/.test(entry.plain), `${label} ${id}: has a written part (prove/explain/…) but no "Rubric:" criteria`);
    }
  }
  /* Hints must be specific: no field hint repeated more than twice in one bank. */
  const hintCount = {};
  for (const entry of Object.values(entries)) for (const hint of Object.values(entry.hints || {}))
    hintCount[hint] = (hintCount[hint] || 0) + 1;
  for (const [hint, count] of Object.entries(hintCount))
    assert(count <= 2, `${label}: hint repeated ${count} times: "${hint.slice(0, 70)}"`);
  /* Rule G: minimum range of paper practice. */
  const paper = ids.filter(id => id.startsWith("A")).length;
  assert(paper >= 9, `${label}: only ${paper} paper exercises; the standard needs routine drills plus transfer proofs`);
  return {teaching: teaching.length, figures: withFigure.length};
}
