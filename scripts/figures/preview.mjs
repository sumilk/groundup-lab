/* Render generated figures to PNG for visual review (macOS Quick Look).
   node scripts/figures/preview.mjs <outdir> [name-prefix]
   Each figure is padded onto a square canvas because Quick Look thumbnails are square. */
import {writeFile, mkdir} from "node:fs/promises";
import {execFileSync} from "node:child_process";
import path from "node:path";
import {buildFigures} from "./build.mjs";
const [out, prefix = ""] = process.argv.slice(2);
if (!out) { console.error("usage: preview.mjs <outdir> [prefix]"); process.exit(1); }
await mkdir(out, {recursive: true});
for (const [name, svg] of Object.entries(await buildFigures())) {
  if (!name.startsWith(prefix)) continue;
  const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number);
  const side = Math.max(w, h), inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const square = `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}" viewBox="0 0 ${side} ${side}"><rect width="${side}" height="${side}" fill="#ffffff"/><g transform="translate(${(side - w) / 2},${(side - h) / 2})">${inner}</g></svg>`;
  const file = path.join(out, name + ".svg");
  await writeFile(file, square);
  execFileSync("qlmanage", ["-t", "-s", String(side), "-o", out, file], {stdio: "ignore"});
  console.log(path.join(out, name + ".svg.png"));
}
