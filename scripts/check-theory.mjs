import assert from "node:assert/strict";
import {readFile,access} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(fileURLToPath(new URL("..",import.meta.url)));
const catalog=JSON.parse(await readFile(path.join(root,"public/theory/catalog.json"),"utf8"));
const runtime=JSON.parse(await readFile(path.join(root,"public/theory/lab-runtime.json"),"utf8"));
assert(catalog.lessons.length>=20,"Expected at least 20 authored lessons");
assert(new Set(catalog.lessons.map(l=>l.path)).size===catalog.lessons.length,"Duplicate lesson");
assert(runtime.revision===catalog.revision,"Lesson and lab runtime revisions differ");
assert(runtime.labs.length>0,"Expected browser labs");
assert(new Set(runtime.labs.map(l=>l.task)).size===runtime.labs.length,"Duplicate browser lab task");
assert(runtime.runner.includes("__lab_code"),"Browser runner is missing its injected-code entrypoint");
for(const lesson of catalog.lessons){
  assert(lesson.markdown===await readFile(path.join(root,"content",lesson.path),"utf8"),"Stale catalog: "+lesson.path);
  const base=path.dirname(path.join(root,"content",lesson.path));
  const withoutCode=lesson.markdown.replace(/(^[ \t]*(\x60{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\2[ \t]*$)/gm,"");
  for(const match of withoutCode.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)){
    const target=match[1].split("#")[0];
    if(!target||/^[a-z]+:/i.test(target))continue;
    await access(path.resolve(base,target));
  }
  const exerciseLinks=[...lesson.markdown.matchAll(/\]\(\.\.\/\.\.\/labs\/exercises\.py\)/g)].length;
  const browserLabs=runtime.labs.filter(lab=>lab.lesson===lesson.path);
  assert(!exerciseLinks||browserLabs.length,"Lesson exercise link has no browser lab: "+lesson.path);
  if(browserLabs.length){
    assert(exerciseLinks===browserLabs.length,
      "Browser lab/exercise-link count differs: "+lesson.path);
    for(const browserLab of browserLabs){
      assert(browserLab.starter.includes("def "+browserLab.function+"("),"Starter has wrong function: "+browserLab.task);
      assert(runtime.checks.includes('"'+browserLab.task+'"'),"Checks omit browser task: "+browserLab.task);
    }
  }
}
const html=await readFile(path.join(root,"public/theory/index.html"),"utf8");
for(const id of ["search","lessons","article","notes","read","previous","next","prompt","status",
  "python-lab","python-code","python-tabs","python-test","python-run","python-stop","python-reset","python-close","python-output"])
  assert(html.includes('id="'+id+'"'));
new Function(await readFile(path.join(root,"public/theory/reader.js"),"utf8"));
new Function(await readFile(path.join(root,"public/theory/python-worker.js"),"utf8"));
console.log("Validated catalog freshness, lesson links, browser labs, UI anchors, and JavaScript syntax.");
