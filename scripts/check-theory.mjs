import assert from "node:assert/strict";
import {readFile,access,readdir} from "node:fs/promises";
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
for(const id of ["search","lessons","article","notes","read","previous","next","prompt","status","theme",
  "python-lab","python-code","python-tabs","python-test","python-run","python-stop","python-reset","python-close","python-output"])
  assert(html.includes('id="'+id+'"'));
new Function(await readFile(path.join(root,"public/theory/reader.js"),"utf8"));
new Function(await readFile(path.join(root,"public/theory/python-worker.js"),"utf8"));
const labFiles=(await readdir(path.join(root,"public/theory/labs"))).filter(name=>name.endsWith(".js")).sort();
const labSources=await Promise.all(labFiles.map(name=>readFile(path.join(root,"public/theory/labs",name),"utf8")));
for(const name of labFiles)assert(html.includes('src="labs/'+name+'"'),"Reader does not load labs/"+name);
for(const source of labSources)new Function(source);
new Function(await readFile(path.join(root,"public/theory/interactives.js"),"utf8"));
new Function(await readFile(path.join(root,"public/theory/tutor.js"),"utf8"));
for(const file of ["interactives.js","tutor.js","checker.js","labs/core.js"])assert(html.includes('src="'+file+'"'),"Reader does not load "+file);
new Function(await readFile(path.join(root,"public/theory/checker.js"),"utf8"));
for(const lesson of catalog.lessons){
  const front=lesson.markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const bank=front&&front[1].match(/^answers:\s*(\S+)\s*$/m)?.[1];
  if(!bank)continue;
  const source=await readFile(path.join(root,"public/theory/answers",bank+".js"),"utf8");
  new Function(source);
  assert(source.includes('GU.answers("'+bank+'"'),"Answer bank registers a different key than "+bank);
  const entries=new Set([...source.matchAll(/^([A-Z]\d+): \{/gm)].map(match=>match[1]));
  for(const exercise of lesson.markdown.matchAll(/^\*\*([A-Z]\d+) · ([^*]*?)\*\*/gm)){
    assert(entries.has(exercise[1]),"Exercise "+exercise[1]+" has no entry in answer bank "+bank);
    assert(/ · /.test(exercise[2]) && / — /.test(exercise[2]),
      "Exercise "+exercise[1]+" header must read \"id · level · mode — name.\" in "+lesson.path);
  }
}
const registered=new Set(labSources.flatMap(source=>[...source.matchAll(/GU\.lab\("([^"]+)"/g)].map(match=>match[1])));
assert(registered.size>0,"No interactive labs are registered");
for(const lesson of catalog.lessons){
  for(const block of lesson.markdown.matchAll(/^[ \t]*(?:\x60{3,}|~{3,})(?:lab|interactive)[ \t]*\n([\s\S]*?)^[ \t]*(?:\x60{3,}|~{3,})[ \t]*$/gm)){
    const body=block[1];
    const named=body.match(/^[ \t]*lab:[ \t]*(\S+)[ \t]*$/m)?.[1]||body.split(/\r?\n/).map(line=>line.trim()).find(Boolean);
    assert(named,"Lab block without a lab name: "+lesson.path);
    assert(registered.has(named),"Lesson names an unregistered lab: "+named+" in "+lesson.path);
  }
}
console.log("Validated catalog freshness, lesson links, browser labs, interactive figures, UI anchors, and JavaScript syntax.");
