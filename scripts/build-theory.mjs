import {readdir,readFile,writeFile,mkdir,cp} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
const root=path.resolve(fileURLToPath(new URL("..",import.meta.url)));
const contentRoot=path.join(root,"content"),output=path.join(root,"public","theory");
await mkdir(output,{recursive:true});
const files=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory())await walk(full);else if(e.name.endsWith(".md")&&e.name!=="README.md"&&!e.name.startsWith("_"))files.push(full);}}
await walk(contentRoot);
const lessons=[];
for(const file of files.sort()){
  const markdown=await readFile(file,"utf8"),title=markdown.match(/^# (.+)$/m)?.[1];
  if(!title)throw new Error("Missing H1: "+file);
  const relative=path.relative(contentRoot,file).split(path.sep).join("/");
  lessons.push({path:relative,track:relative.split("/")[0].replace(/-/g," "),title,markdown});
}
let revision="local";try{revision=execFileSync("git",["rev-parse","--short","HEAD"],{cwd:root,encoding:"utf8"}).trim();}catch{}
await writeFile(path.join(output,"catalog.json"),JSON.stringify({revision,lessons},null,2)+"\n");
const labsRoot=path.join(root,"labs");
const [registrySource,exerciseSource,referenceSource,checksSource,runnerSource]=await Promise.all([
  readFile(path.join(labsRoot,"browser_labs.json"),"utf8"),
  readFile(path.join(labsRoot,"exercises.py"),"utf8"),
  readFile(path.join(labsRoot,"reference.py"),"utf8"),
  readFile(path.join(labsRoot,"checks.py"),"utf8"),
  readFile(path.join(labsRoot,"browser_runner.py"),"utf8")
]);
const registry=JSON.parse(registrySource);
function extractFunction(source,name){
  const matches=[...source.matchAll(/^def ([A-Za-z_]\w*)\s*\(/gm)];
  const index=matches.findIndex(match=>match[1]===name);
  if(index<0)throw new Error("Missing Python function: "+name);
  const start=matches[index].index;
  const end=index+1<matches.length?matches[index+1].index:source.length;
  return source.slice(start,end).trimEnd();
}
const browserLabs=registry.map(entry=>{
  if(!lessons.some(lesson=>lesson.path===entry.lesson))throw new Error("Browser lab has missing lesson: "+entry.lesson);
  const support=(entry.supportFunctions||[]).map(name=>extractFunction(referenceSource,name)).join("\n\n");
  return {
    lesson:entry.lesson,
    task:entry.task,
    function:entry.function,
    title:entry.title,
    starter:"import math\nimport random\n\n"+extractFunction(exerciseSource,entry.function)+"\n",
    support
  };
});
await writeFile(path.join(output,"lab-runtime.json"),JSON.stringify({
  revision,
  checks:checksSource,
  runner:runnerSource,
  labs:browserLabs
},null,2)+"\n");
await cp(path.join(contentRoot,"assets"),path.join(output,"assets"),{recursive:true});
console.log("Built "+lessons.length+" lessons and "+browserLabs.length+" browser labs for revision "+revision);
