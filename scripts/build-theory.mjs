import {readdir,readFile,writeFile,mkdir,cp} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
const root=path.resolve(fileURLToPath(new URL("..",import.meta.url)));
const contentRoot=path.join(root,"content"),output=path.join(root,"public","theory");
await mkdir(output,{recursive:true});
const files=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory())await walk(full);else if(e.name.endsWith(".md")&&e.name!=="README.md")files.push(full);}}
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
await cp(path.join(contentRoot,"assets"),path.join(output,"assets"),{recursive:true});
console.log("Built "+lessons.length+" lessons for revision "+revision);
