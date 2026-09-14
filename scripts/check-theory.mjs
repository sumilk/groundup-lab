import assert from "node:assert/strict";
import {readFile,access} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(fileURLToPath(new URL("..",import.meta.url)));
const catalog=JSON.parse(await readFile(path.join(root,"public/theory/catalog.json"),"utf8"));
assert(catalog.lessons.length>=20,"Expected at least 20 authored lessons");
assert(new Set(catalog.lessons.map(l=>l.path)).size===catalog.lessons.length,"Duplicate lesson");
for(const lesson of catalog.lessons){
  assert(lesson.markdown===await readFile(path.join(root,"content",lesson.path),"utf8"),"Stale catalog: "+lesson.path);
  const base=path.dirname(path.join(root,"content",lesson.path));
  const withoutCode=lesson.markdown.replace(/(^[ \t]*(\x60{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\2[ \t]*$)/gm,"");
  for(const match of withoutCode.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)){
    const target=match[1].split("#")[0];
    if(!target||/^[a-z]+:/i.test(target))continue;
    await access(path.resolve(base,target));
  }
}
const html=await readFile(path.join(root,"public/theory/index.html"),"utf8");
for(const id of ["search","lessons","article","notes","read","previous","next","prompt","status"])assert(html.includes('id="'+id+'"'));
new Function(await readFile(path.join(root,"public/theory/reader.js"),"utf8"));
console.log("Validated catalog freshness, lesson links, UI anchors, and JavaScript syntax.");
