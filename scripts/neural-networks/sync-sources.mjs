/* Source sync for the neural-networks lecture track (content/15-neural-networks).

   node scripts/neural-networks/sync-sources.mjs              refresh the manifest, download new slides
   node scripts/neural-networks/sync-sources.mjs --readings   also download course-hosted reading PDFs
   node scripts/neural-networks/sync-sources.mjs --refresh    re-download files already in the cache
   node scripts/neural-networks/sync-sources.mjs --offline    rebuild text from the cache, no network

   The manifest (content/15-neural-networks/_sources.json) is committed: lecture titles,
   dates, and links for every offering. Downloaded slides, readings, and extracted text are
   authoring references only and stay in work/neural-networks/, which is gitignored.

   Text extraction uses pdftotext when installed, else a Python with pypdf
   (set NN_PYTHON to choose the interpreter). Without either, PDFs are still cached. */
import {mkdir, readFile, writeFile, access} from "node:fs/promises";
import {execFileSync} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const manifestPath = path.join(root, "content", "15-neural-networks", "_sources.json");
const cache = path.join(root, "work", "neural-networks");
const SITE = "https://deeplearning.cs.cmu.edu/";
// Most recent offering first: it is the primary schedule; older ones fill in released slides.
const OFFERINGS = ["F26", "S26"];
const args = new Set(process.argv.slice(2));
const offline = args.has("--offline"), refresh = args.has("--refresh"), withReadings = args.has("--readings");

const entities = {amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " "};
const decode = s => s.replace(/&(#?\w+);/g, (m, e) => entities[e] ?? (e[0] === "#" ? String.fromCodePoint(+e.slice(1)) : m));
const text = s => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const cells = row => [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m => m[1]);
const links = (html, base) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
  .map(m => ({label: text(m[2]), url: new URL(decode(m[1]).trim(), base).href}));
const exists = p => access(p).then(() => true, () => false);

async function get(url) {
  const response = await fetch(url, {headers: {"user-agent": "Mozilla/5.0 (groundup-lab source sync)"}});
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

function parseLectures(html, base) {
  const lectures = [];
  for (const [row] of html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)) {
    const c = cells(row);
    const number = text(c[0] || "");
    if (!/^\d+$/.test(number)) continue; // header and break rows
    const topics = [...(c[2] || "").matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(m => text(m[1])).filter(Boolean);
    const media = links(c[3] || "", base);
    lectures.push({
      number: +number,
      date: text(c[1] || ""),
      topics: topics.length ? topics : [text(c[2] || "")],
      slides: media.find(l => /slides/i.test(l.label))?.url ?? null,
      video: media.find(l => /youtu/i.test(l.url))?.url ?? null,
      readings: links(c[4] || "", base)
    });
  }
  return lectures;
}

function parseRecitations(html, base) {
  const recitations = [];
  for (const [row] of html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)) {
    const c = cells(row).map(cell => ({text: text(cell), links: links(cell, base)}));
    if (c.length < 3 || /^recitation$/i.test(c[0].text)) continue;
    const detail = c.slice(2).map(x => x.text).filter(Boolean);
    recitations.push({label: c[0].text, date: c[1].text, detail, links: c.flatMap(x => x.links)});
  }
  return recitations;
}

let extractor;
function findExtractor() {
  if (extractor !== undefined) return extractor;
  const tryRun = (cmd, argv) => { try { execFileSync(cmd, argv, {stdio: "ignore"}); return true; } catch { return false; } };
  if (tryRun("pdftotext", ["-v"])) return extractor = {name: "pdftotext", run: (pdf, out) => execFileSync("pdftotext", ["-layout", pdf, out], {stdio: "ignore"})};
  const python = process.env.NN_PYTHON || "python3";
  if (tryRun(python, ["-I", "-c", "import pypdf"])) return extractor = {name: python + " + pypdf", run: (pdf, out) => execFileSync(python, ["-I", "-c",
    "import sys,pypdf\nr=pypdf.PdfReader(sys.argv[1])\nopen(sys.argv[2],'w',encoding='utf-8').write(''.join(f'\\n=== slide {i+1} ===\\n'+(p.extract_text() or '') for i,p in enumerate(r.pages)))",
    pdf, out], {stdio: "ignore"})};
  return extractor = null;
}

async function cacheFile(url, dir) {
  const target = path.join(dir, decodeURIComponent(url.split("/").pop()).replace(/[^\w.-]+/g, "_"));
  if (!refresh && await exists(target)) return {target, fresh: false};
  if (offline) return {target: null, fresh: false};
  await mkdir(dir, {recursive: true});
  await writeFile(target, Buffer.from(await (await get(url)).arrayBuffer()));
  return {target, fresh: true};
}

const previous = JSON.parse(await readFile(manifestPath, "utf8").catch(() => "{}"));
const manifest = {
  note: "Generated by scripts/neural-networks/sync-sources.mjs. Edit the script, not this file.",
  synced: offline ? previous.synced : new Date().toISOString().slice(0, 10),
  offerings: {}
};
const report = [];
for (const offering of OFFERINGS) {
  const base = SITE + offering + "/";
  let entry = previous.offerings?.[offering];
  if (!offline) {
    try {
      const lectures = parseLectures(await (await get(base + "pages/tables/lectures_table.html")).text(), base);
      const recitations = parseRecitations(await (await get(base + "pages/tables/recitations.html")).text(), base);
      if (!lectures.length) throw new Error("no lecture rows parsed");
      entry = {base, lectures, recitations};
    } catch (error) {
      if (!entry) throw error;
      console.warn(`${offering}: keeping previous manifest entry (${error.message})`);
    }
  }
  if (!entry) continue;
  manifest.offerings[offering] = entry;
  let slides = 0, extracted = 0, readings = 0;
  for (const lecture of entry.lectures) {
    if (lecture.slides && /\.pdf$/i.test(new URL(lecture.slides).pathname)) {
      const {target} = await cacheFile(lecture.slides, path.join(cache, offering, "slides"))
        .catch(error => { console.warn(`${offering} lecture ${lecture.number}: ${error.message}`); return {}; });
      if (target) {
        slides++;
        const out = path.join(cache, offering, "text", `lec${String(lecture.number).padStart(2, "0")}.txt`);
        if (findExtractor() && (refresh || !await exists(out))) {
          await mkdir(path.dirname(out), {recursive: true});
          try { extractor.run(target, out); } catch (error) { console.warn(`${offering} lecture ${lecture.number}: text extraction failed (${error.message.split("\n")[0]})`); }
        }
        if (await exists(out)) extracted++;
      }
    }
    if (withReadings) for (const reading of lecture.readings.filter(r => r.url.startsWith(SITE) && /\.pdf$/i.test(r.url))) {
      try { if ((await cacheFile(reading.url, path.join(cache, offering, "readings"))).target) readings++; }
      catch (error) { console.warn(`${offering} reading: ${error.message}`); }
    }
  }
  report.push(`${offering}: ${entry.lectures.length} lectures, ${entry.recitations.length} recitation rows, ` +
    `${slides} slide decks cached, ${extracted} with text` + (withReadings ? `, ${readings} readings cached` : ""));
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(report.join("\n"));
console.log(findExtractor() ? `Text extracted with ${extractor.name} into ${path.relative(root, cache)}/<offering>/text.`
  : "No PDF text extractor found: install poppler (brew install poppler) or set NN_PYTHON to a Python with pypdf.");
