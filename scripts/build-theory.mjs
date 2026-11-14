import {readdir,readFile,writeFile,mkdir,cp} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
const root=path.resolve(fileURLToPath(new URL("..",import.meta.url)));
const contentRoot=path.join(root,"content"),output=path.join(root,"public","theory");
await mkdir(output,{recursive:true});
const TRACK_META={
  "00-foundations":{title:"Foundations",blurb:"Mathematical language, proof habits and floating-point reality.",
    overview:"The habits everything else depends on: reading and writing precise mathematical statements, reasoning about scale and approximation, and knowing when floating-point arithmetic will betray you. The second half covers the working environment of research: version control, tests, measurement and reproducible experiments."},
  "01-python":{title:"Python",blurb:"Objects, aliasing, iteration and streaming computation.",
    overview:"Python as a research instrument rather than a scripting language. Start with how names, objects and mutation really behave, move through NumPy shapes, strides and vectorization, and finish with the engineering that keeps experiments correct: data contracts, concurrency, testing, packaging and resumable sweeps."},
  "02-linear-algebra":{title:"Linear Algebra",blurb:"Vector spaces to the SVD, conditioning and numerical stability.",
    overview:"Everything in machine learning is downstream of linear algebra. This track builds it from span and bases through projections, eigenvalues and the SVD to conditioning and stability, with draggable figures and proofs. Later modules turn the same tools on real models: matrix calculus, backpropagation as adjoints, low-rank structure, attention as a bilinear map, and spectra of trained networks."},
  "03-optimization":{title:"Optimization",blurb:"Gradients, convexity, SGD, adaptive methods and constraints.",
    overview:"How models are actually trained, and what can be guaranteed about it. From derivatives as local approximations and convex analysis through stochastic gradient descent, nonconvex training dynamics, adaptive methods and schedules, to constrained, second-order, bilevel and distributed optimization."},
  "04-dsa":{title:"Data Structures & Algorithms",blurb:"Invariants, search, graphs and dynamic programming.",
    overview:"Algorithms argued from invariants, not memorized. Complexity and correctness proofs, hashing, sorting and search, trees and graphs, dynamic programming, and the randomized, streaming, external-memory and nearest-neighbour methods that show up inside modern ML systems."},
  "05-probability-statistics":{title:"Probability & Statistics",blurb:"Random variables to causal inference, diffusion and conformal prediction.",
    overview:"The largest track in the library. It runs from finite probability and random variables through Gaussians, limit theorems, estimation and testing to the statistics modern ML needs: rigorous evaluation, calibration and conformal prediction, latent variables and the ELBO, diffusion, causal inference and empirical processes. Every lesson has hints, a prediction-and-reveal experiment and a checked answer bank."},
  "06-information-learning-decision":{title:"Information, Learning & Decisions",blurb:"Entropy, KL divergence, generalization bounds and decision rules.",
    overview:"Why models generalize, and how predictions become decisions. Entropy, cross-entropy and KL divergence; PAC learning, VC dimension, stability and PAC-Bayes bounds; online learning and regret; and the decision theory of costs, abstention, value of information and distribution shift."},
  "07-classical-ml":{title:"Classical Machine Learning",blurb:"Regression, classification, kernels, trees and honest evaluation.",
    overview:"Classical models as baselines every larger model must beat. Problem specification and leakage-free splits, linear and logistic models, kernels and SVMs, trees and boosting, Gaussian processes, clustering and dimensionality reduction, and careful model selection, calibration and comparison."},
  "08-pytorch":{title:"PyTorch",blurb:"Tensors, autograd and training loops that behave.",
    overview:"PyTorch from the tensor up: storage, dtypes, broadcasting and einsum; modules and autograd; custom gradients you can verify; and the engineering of trustworthy training loops, including mixed precision, checkpointing, profiling and gradient accumulation."},
  "09-deep-learning-core":{title:"Deep Learning: Core",blurb:"From the threshold unit to transformers and generative models.",
    overview:"A complete first course in neural networks, built from a university lecture series. It starts with the threshold unit and what networks can represent, then derives learning, backpropagation and optimization, and moves through convolutional and recurrent networks to attention, transformers, large language models, autoencoders, VAEs, diffusion, GANs and graph networks."},
  "10-deep-learning-advanced":{title:"Deep Learning: Advanced",blurb:"Signal propagation, self-supervision, adaptation and interpretability.",
    overview:"What decides whether a deep network trains and what it learns. Initialization and signal propagation, normalization and residual pathways, state-space models, self-supervised and contrastive learning, efficient adaptation, mixture-of-experts, modern diffusion and flow matching, interpretability and robustness."},
  "11-nlp":{title:"Natural Language Processing",blurb:"Text representations, tokens and language models.",
    overview:"Language as data. Unicode and normalization, lexical baselines, n-gram models, structured decoding, embeddings, tokenizer design, retrieval and reranking, corpus curation, and how to evaluate generated text and audit benchmarks for contamination."},
  "12-llm-systems":{title:"LLM Systems",blurb:"Causal transformers, training and inference systems.",
    overview:"Building and running large language models. A correct decoder-only model from primitives, pretraining data flow and scaling laws; GPU memory hierarchies, kernels and memory-efficient attention; quantization and distributed training; and inference systems: KV caches, continuous batching, speculative decoding and post-training pipelines."},
  "13-reinforcement-learning":{title:"Reinforcement Learning",blurb:"MDPs, Bellman equations, policy gradients and RLHF.",
    overview:"Sequential decision making from bandits and Bellman equations to the methods behind modern post-training. Temporal-difference learning, off-policy evaluation, policy gradients, actor-critic and PPO, then preference data, reward modelling, RLHF, DPO, verifiable rewards and test-time search."},
  "14-agentic-systems":{title:"Practical AI Systems",blurb:"Retrieval, tools, evaluation and deployment.",
    overview:"Building AI systems that can be trusted in production. Task contracts and baselines, retrieval and grounded generation, context and memory, tool use and orchestration, multi-agent coordination, evaluation of agent trajectories, cost-quality routing, and observable, controlled deployment."},
  "15-research-practice":{title:"Research Practice",blurb:"Paper reading, reproduction, experiments and defense.",
    overview:"Turning knowledge into research. Reading papers as claims, choosing baselines, designing experiments and ablations, reproducing results faithfully and diagnosing discrepancies, then designing, executing, writing up and defending an original extension."}
};
const AVAILABLE_TRACKS=new Set(["02-linear-algebra","05-probability-statistics"]);
/* Tracks whose pages are full lessons; elsewhere a page is an early overview being expanded. */
const FULL_LESSON_TRACKS=new Set([...AVAILABLE_TRACKS,"09-deep-learning-core"]);
const files=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,e.name);if(e.isDirectory())await walk(full);else if(e.name.endsWith(".md")&&e.name!=="README.md"&&!e.name.startsWith("_"))files.push(full);}}
await walk(contentRoot);
const lessons=[];
for(const file of files.sort()){
  const markdown=await readFile(file,"utf8"),title=markdown.match(/^# (.+)$/m)?.[1];
  if(!title)throw new Error("Missing H1: "+file);
  const relative=path.relative(contentRoot,file).split(path.sep).join("/");
  const trackId=relative.split("/")[0];
  const id=markdown.match(/^---\r?\n[\s\S]*?^id:\s*(\S+)\s*$[\s\S]*?\r?\n---/m)?.[1]||null;
  lessons.push({path:relative,track:trackId.replace(/-/g," "),trackId,status:FULL_LESSON_TRACKS.has(trackId)?"full":"preview",title,markdown,...(id?{id}:{})});
}
/* Public status shown by the reader. "available": substantial lessons published (still expanding);
   "in-development": some pages published, most of the track still being written; "planned": nothing published yet. */
const plainText=text=>text.replace(/\[([^\]]*)\]\([^)]*\)/g,"$1").replace(/[`*_]/g,"").trim();
/* Public roadmap from each track's _plan.md: the "Module map" table, grouped by the "### Part" sections
   whose module briefs carry `handle: X` lines. A module counts as published when a lesson in the track has
   the same front-matter id or the same file number (LA01 <-> 02-linear-algebra/01-...). */
async function readPlan(trackId){
  let source;
  try{source=await readFile(path.join(contentRoot,trackId,"_plan.md"),"utf8");}catch{return {modules:[],parts:[]};}
  const lines=source.split(/\r?\n/),modules=[];
  const mapStart=lines.findIndex(line=>/^##\s.*module map/i.test(line));
  if(mapStart>=0){
    let columns=null;
    for(const line of lines.slice(mapStart+1)){
      if(/^##\s/.test(line))break;
      if(!line.startsWith("|"))continue;
      const cells=line.split("|").slice(1,-1).map(cell=>cell.trim());
      if(!columns){columns=cells.map(cell=>cell.toLowerCase());continue;}
      if(/^[-: ]+$/.test(cells.join("")))continue;
      const at=name=>cells[columns.indexOf(name)]||"";
      const handle=at("handle");
      if(!/^[A-Z]+\d+$/.test(handle))continue;
      modules.push({handle,title:plainText(at("module")),hours:Number(at("hours"))||null,
        prerequisites:at("prerequisites").split(/[,;]/).map(item=>item.trim()).filter(item=>/^[A-Z]+\d+$/.test(item))});
    }
  }
  const parts=[];let part=null;
  for(const line of lines){
    const heading=line.match(/^###\s+Part\s+([IVXLC]+)\s*[·:.-]\s*(.+)$/);
    if(heading){part={label:"Part "+heading[1],title:plainText(heading[2]),thesis:"",handles:[]};parts.push(part);continue;}
    if(!part)continue;
    if(/^##\s/.test(line)){part=null;continue;}
    const thesis=line.match(/^\*Thesis:\s*(.+?)\*\s*$/);
    if(thesis&&!part.thesis)part.thesis=plainText(thesis[1]);
    const brief=line.match(/handle:\s*([A-Z]+\d+)/);
    if(brief){
      part.handles.push(brief[1]);
      const id=line.match(/`id:\s*([^`\s]+)`/)?.[1];
      const module=modules.find(m=>m.handle===brief[1]);
      if(module&&id)module.id=id;
    }
  }
  return {modules,parts:parts.filter(p=>p.handles.length)};
}
const plans={};
for(const e of (await readdir(contentRoot,{withFileTypes:true})).filter(e=>e.isDirectory()&&/^\d\d-/.test(e.name)))plans[e.name]=await readPlan(e.name);
const handleTrack={};
for(const [trackId,plan] of Object.entries(plans))for(const m of plan.modules)handleTrack[m.handle.replace(/\d+$/,"")]=trackId;
const tracks=[];
for(const e of (await readdir(contentRoot,{withFileTypes:true})).filter(e=>e.isDirectory()&&/^\d\d-/.test(e.name)).sort((a,b)=>a.name.localeCompare(b.name))){
  const meta=TRACK_META[e.name]||{title:e.name.replace(/^\d\d-/,"").replace(/-/g," "),blurb:"",overview:""};
  const own=lessons.filter(l=>l.trackId===e.name);
  const plan=plans[e.name],used=new Set();
  const modules=plan.modules.map(m=>{
    const number=Number(m.handle.match(/\d+$/)[0]);
    const lesson=own.find(l=>m.id&&l.id===m.id)||own.find(l=>Number(l.path.split("/")[1].match(/^\d+/)?.[0])===number);
    if(lesson)used.add(lesson.path);
    return {handle:m.handle,title:m.title,hours:m.hours,
      ...(lesson?{lesson:lesson.path,status:lesson.status==="full"?"published":"early"}:{status:"planned"})};
  });
  const buildsOn=[...new Set(plan.modules.flatMap(m=>m.prerequisites).map(h=>handleTrack[h.replace(/\d+$/,"")]).filter(t=>t&&t<e.name))].sort();
  tracks.push({id:e.name,number:e.name.slice(0,2),title:meta.title,blurb:meta.blurb,overview:meta.overview||"",lessons:own.length,
    status:!own.length?"planned":AVAILABLE_TRACKS.has(e.name)?"available":"in-development",
    modules,parts:plan.parts.map(({label,title,thesis,handles})=>({label,title,thesis,handles})),
    extras:own.filter(l=>!used.has(l.path)).map(l=>l.path),buildsOn});
}
let revision="local";try{revision=execFileSync("git",["rev-parse","--short","HEAD"],{cwd:root,encoding:"utf8"}).trim();}catch{}
await writeFile(path.join(output,"catalog.json"),JSON.stringify({revision,tracks,lessons},null,2)+"\n");
const labsRoot=path.join(root,"labs");
// Lab code lives in topic packages: labs/<topic>/{exercises,reference,checks}.py.
// labs/exercises.py and labs/reference.py only re-export them for the CLI.
// Same topic rules as labs/registry.py: all three modules, a name Python can import,
// no clash with a module in labs/, and no lab modules in a directory without __init__.py.
const TOPIC_MODULES=["exercises","reference","checks"];
const PYTHON_KEYWORDS=new Set(("False None True and as assert async await break class continue def del elif else except "+
  "finally for from global if import in is lambda nonlocal not or pass raise return try while with yield").split(" "));
const labEntries=await readdir(labsRoot,{withFileTypes:true});
const takenNames=new Set(labEntries.filter(e=>e.isFile()&&e.name.endsWith(".py")).map(e=>e.name.slice(0,-3)));
const labTopics=[],topicProblems=[];
for(const e of labEntries.filter(e=>e.isDirectory()&&e.name!=="__pycache__"&&!e.name.startsWith(".")).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)){
  const files=await readdir(path.join(labsRoot,e.name)),where="labs/"+e.name;
  const present=TOPIC_MODULES.filter(name=>files.includes(name+".py"));
  if(!files.includes("__init__.py")){
    if(present.length)topicProblems.push(where+" has "+present.map(name=>name+".py").join(", ")+" but no __init__.py, so it is not a topic package; add one");
    continue;
  }
  if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(e.name)||PYTHON_KEYWORDS.has(e.name)){
    const suggestion=e.name.replace(/[^A-Za-z0-9_]/g,"_").replace(/^[0-9_]+/,"");
    topicProblems.push(where+": a topic name must be a Python identifier that is not a keyword"+
      (suggestion&&!PYTHON_KEYWORDS.has(suggestion)?", e.g. "+suggestion:""));
  }
  else if(takenNames.has(e.name))topicProblems.push(where+" clashes with labs/"+e.name+".py; choose another topic name");
  const missing=TOPIC_MODULES.filter(name=>!present.includes(name)).map(name=>name+".py");
  if(missing.length)topicProblems.push(where+" is missing "+missing.join(", "));
  labTopics.push(e.name);
}
if(topicProblems.length)throw new Error("labs/ has "+topicProblems.length+" problem(s):\n  - "+topicProblems.join("\n  - "));
if(!labTopics.length)throw new Error("No lab topic packages found under labs/");
const readLab=async relative=>({file:"labs/"+relative,source:await readFile(path.join(labsRoot,relative),"utf8")});
const readRole=role=>Promise.all(labTopics.map(topic=>readLab(topic+"/"+role+".py")));
const [registrySource,exerciseSources,referenceSources,topicCheckSources,checkHelpers,runnerSource]=await Promise.all([
  readFile(path.join(labsRoot,"registry.json"),"utf8"),
  readRole("exercises"),
  readRole("reference"),
  readRole("checks"),
  readLab("check_helpers.py"),
  readFile(path.join(labsRoot,"browser_runner.py"),"utf8")
]);
const topLevelDefs=source=>[...source.matchAll(/^def ([A-Za-z_]\w*)\s*\(/gm)];
const definingFiles=(sources,name)=>sources.filter(({source})=>topLevelDefs(source).some(match=>match[1]===name)).map(({file})=>file);
// A lab's starter comes from the exercises.py of the topic whose reference.py solves it.
// Learners may define same-named helpers in other topics; those are not the starter.
const starterSource=name=>{
  const [referenceFile]=definingFiles(referenceSources,name);
  return exerciseSources.find(({file})=>file===referenceFile.replace(/reference\.py$/,"exercises.py"));
};
function extractFunction(sources,name){
  const owners=sources.filter(({source})=>topLevelDefs(source).some(match=>match[1]===name));
  if(!owners.length)throw new Error("Missing Python function: "+name);
  if(owners.length>1)throw new Error("Python function "+name+" is defined in more than one file: "+owners.map(o=>o.file).join(", "));
  const {source}=owners[0],matches=topLevelDefs(source);
  const index=matches.findIndex(match=>match[1]===name);
  const start=matches[index].index;
  const end=index+1<matches.length?matches[index+1].index:source.length;
  return source.slice(start,end).trimEnd();
}
// labs/registry.json is the one list of labs: it drives these browser labs, and
// labs/registry.py builds the CLI's CHECKS from it with the same structural rules.
// Report every problem at once; never drop an entry quietly.
function registryProblems(registry){
  if(!Array.isArray(registry)||!registry.length)return ["the top level must be a non-empty JSON array of lab entries"];
  const problems=[],required=["task","lesson","title","function","check"];
  const allowed=new Set([...required,"supportFunctions"]);
  const firstSeen={task:new Map(),function:new Map(),check:new Map()};
  registry.forEach((entry,index)=>{
    const number=index+1;
    if(!entry||typeof entry!=="object"||Array.isArray(entry)){problems.push("entry "+number+" is not a JSON object");return;}
    const label="entry "+number+(typeof entry.task==="string"?" ('"+entry.task+"')":"");
    for(const field of required)
      if(typeof entry[field]!=="string"||!entry[field].trim())problems.push(label+" needs a non-empty string '"+field+"'");
    const unknown=Object.keys(entry).filter(key=>!allowed.has(key)).sort();
    if(unknown.length)problems.push(label+" has unknown field(s): "+unknown.join(", "));
    const support=entry.supportFunctions??[];
    if(!Array.isArray(support)||!support.every(name=>typeof name==="string"&&name))
      problems.push(label+" 'supportFunctions' must be a list of function names");
    for(const [field,seen] of Object.entries(firstSeen)){
      const value=entry[field];
      if(typeof value!=="string"||!value)continue;
      if(seen.has(value))problems.push("duplicate "+field+" '"+value+"' in entries "+seen.get(value)+" and "+number);
      else seen.set(value,number);
    }
  });
  if(problems.length)return problems;
  const definedOnce=(label,where,sources,name)=>{
    const files=definingFiles(sources,name);
    if(!files.length)problems.push(label+": no "+where+" defines '"+name+"'");
    else if(files.length>1)problems.push(label+": '"+name+"' is defined in more than one file: "+files.join(", "));
    return files.length===1;
  };
  const checkSignature=name=>new RegExp("^def "+name+"\\s*\\(\\s*m\\s*\\)","m");
  for(const entry of registry){
    const label="task '"+entry.task+"'";
    if(!lessons.some(lesson=>lesson.path===entry.lesson))problems.push(label+": lesson content/"+entry.lesson+" does not exist");
    if(definedOnce(label,"labs/<topic>/reference.py",referenceSources,entry.function)){
      const home=starterSource(entry.function);
      if(!topLevelDefs(home.source).some(match=>match[1]===entry.function))
        problems.push(label+": "+home.file+" has no starter '"+entry.function+"' to match its reference solution");
    }
    if(definedOnce(label,"labs/<topic>/checks.py",topicCheckSources,entry.check)&&
       !topicCheckSources.some(({source})=>checkSignature(entry.check).test(source)))
      problems.push(label+": '"+entry.check+"' must be a public function taking one argument m");
    for(const name of entry.supportFunctions||[])definedOnce(label+" support","labs/<topic>/reference.py",referenceSources,name);
  }
  // A lab is unregistered if its check is, or if a public function has both a starter and
  // a reference but no entry. Other functions in exercises.py, such as helpers learners
  // write for themselves, are not labs and are ignored.
  const functions=new Set(registry.map(entry=>entry.function)),checks=new Set(registry.map(entry=>entry.check));
  const publicDefs=sources=>new Set(sources.flatMap(({source})=>topLevelDefs(source).map(match=>match[1])).filter(name=>!name.startsWith("_")));
  const referenced=publicDefs(referenceSources);
  for(const {file,source} of exerciseSources)for(const [,name] of topLevelDefs(source))
    if(!name.startsWith("_")&&referenced.has(name)&&!functions.has(name))
      problems.push("starter '"+name+"' in "+file+" has a reference solution but no registry entry; add an entry for it");
  for(const {file,source} of topicCheckSources)for(const [,name] of source.matchAll(/^def ([A-Za-z]\w*)\s*\(\s*m\s*\)/gm))
    if(!checks.has(name))problems.push("check '"+name+"' in "+file+" is not registered; add an entry for it");
  return problems;
}
let registry;
try{registry=JSON.parse(registrySource);}catch(error){throw new Error("labs/registry.json is not valid JSON: "+error.message);}
const problems=registryProblems(registry);
if(problems.length)throw new Error("labs/registry.json has "+problems.length+" problem(s):\n  - "+problems.join("\n  - "));
// The browser execs the checks as one standalone source, so inline the shared helpers
// and every topic's checks into a single flat namespace, dropping the imports between
// lab modules, then add CHECKS in registry order. Flattening needs unique top-level names.
function bundleChecks(parts){
  const owner=new Map();
  for(const {file,source} of parts)for(const match of source.matchAll(/^(?:def ([A-Za-z_]\w*)|([A-Za-z_]\w*)\s*=)/gm)){
    const name=match[1]||match[2];
    if(owner.has(name))throw new Error("Check name "+name+" is defined in both "+owner.get(name)+" and "+file);
    owner.set(name,file);
  }
  const labImport=/^from labs(?:\.\w+)* import (?:\([^)]*\)|[^\n]*)\n/gm;
  const body=parts.map(({file,source})=>"# ---- "+file+" ----\n"+source.replace(labImport,"")).join("\n\n");
  const leftover=body.match(/^[ \t]*(?:from[ \t]+(?:labs\b|\.)|import[ \t]+labs\b)[^\n]*/m);
  if(leftover)throw new Error("Check modules may import other lab modules only as single or parenthesized 'from labs.<module> import ...' lines: "+leftover[0]);
  return "# Generated by scripts/build-theory.mjs from labs/check_helpers.py, labs/*/checks.py and labs/registry.json.\n"+body;
}
const checksRegistry={file:"labs/registry.json",
  source:"CHECKS = {\n"+registry.map(entry=>"    "+JSON.stringify(entry.task)+": "+entry.check+",\n").join("")+"}\n"};
const checksSource=bundleChecks([checkHelpers,...topicCheckSources,checksRegistry]);
const browserLabs=registry.map(entry=>{
  const support=(entry.supportFunctions||[]).map(name=>extractFunction(referenceSources,name)).join("\n\n");
  return {
    lesson:entry.lesson,
    task:entry.task,
    function:entry.function,
    title:entry.title,
    starter:"import math\nimport random\n\n"+extractFunction([starterSource(entry.function)],entry.function)+"\n",
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
