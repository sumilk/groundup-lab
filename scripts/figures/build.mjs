/* Generate lesson figures from the figure scripts in this folder.

   node scripts/figures/build.mjs          write content/assets/<name>.svg
   node scripts/figures/build.mjs --check  fail if any committed figure is stale

   Each script (for example la01.mjs) default-exports {name: () => svg}.
   Names must be unique across scripts; by convention they carry the lesson
   handle as a prefix (la01-exchange-lemma). */
import {readdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(here, "..", "..", "content", "assets");
const check = process.argv.includes("--check");

export async function buildFigures() {
  const figures = {};
  for (const file of (await readdir(here)).filter(f => /^[a-z]+\d+.*\.mjs$/.test(f)).sort()) {
    const module = await import(pathToFileURL(path.join(here, file)).href);
    for (const [name, make] of Object.entries(module.default)) {
      if (figures[name]) throw new Error(`Duplicate figure name ${name} in ${file}`);
      figures[name] = make();
    }
  }
  return figures;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const figures = await buildFigures();
  const stale = [];
  for (const [name, svg] of Object.entries(figures)) {
    const target = path.join(assets, name + ".svg");
    if (check) {
      const current = await readFile(target, "utf8").catch(() => null);
      if (current !== svg) stale.push(name);
    } else await writeFile(target, svg);
  }
  if (stale.length) { console.error("Stale or missing figures: " + stale.join(", ")); process.exit(1); }
  console.log((check ? "Verified " : "Wrote ") + Object.keys(figures).length + " generated figures.");
}
