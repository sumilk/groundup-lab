/* Sanitized Markdown; notes remain text. This reader needs no API key. */
(() => {
  const $ = id => document.getElementById(id);
  let lessons = [], tracks = [], current = null, revision = "", renderId = 0, mermaidPromise;
  let labRuntime = {labs: []}, currentLabs = [], currentLab = null, lastLabTrigger = null, pythonWorker = null, pythonReady = null;
  let pythonRequestId = 0, pythonExecutionId = 0, pythonBusy = false;
  const pythonRequests = new Map();
  const memory = new Map();
  function get(key) { try { return localStorage.getItem(key) || ""; } catch { return memory.get(key) || ""; } }
  function put(key,value) { memory.set(key,value); try { localStorage.setItem(key,value); return true; } catch { return false; } }
  /* Track folders were resequenced (deep learning split into core/advanced); carry path-keyed notes and read marks over once. */
  (function migrateTrackPaths() {
    const moves=[["15-neural-networks/","09-deep-learning-core/"],["09-deep-learning/","10-deep-learning-advanced/"],["10-nlp/","11-nlp/"],["11-llm-systems/","12-llm-systems/"],["12-reinforcement-learning/","13-reinforcement-learning/"],["13-agentic-systems/","14-agentic-systems/"],["14-research-practice/","15-research-practice/"]];
    try {
      if (localStorage.getItem("migrated:track-paths-2026-10")) return;
      const keys=[];for(let i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));
      for(const key of keys) for(const prefix of ["tutor:notes:","notes:","read:"]) {
        if(!key.startsWith(prefix))continue;
        const move=moves.find(([from])=>key.slice(prefix.length).startsWith(from));
        if(!move)break;
        const target=prefix+move[1]+key.slice(prefix.length+move[0].length);
        if(!localStorage.getItem(target))localStorage.setItem(target,localStorage.getItem(key));
        localStorage.removeItem(key);break;
      }
      localStorage.setItem("migrated:track-paths-2026-10","yes");
    } catch {}
  })();
  function escapeHTML(text) { return text.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function labKey(part,task) { return "python-lab:"+part+":"+task; }
  function renderPythonOutput(output,state) {
    $("python-output").textContent=output||"No output.";
    $("python-output").classList.toggle("pass",state==="pass");
    $("python-output").classList.toggle("fail",state==="fail");
  }
  function setPythonBusy(busy) {
    pythonBusy=busy;
    $("python-test").disabled=busy;
    $("python-run").disabled=busy;
    $("python-reset").disabled=busy;
    $("python-stop").disabled=!busy;
    $("python-tabs").querySelectorAll("button").forEach(button=>button.disabled=busy);
  }
  function rejectPythonRequests(message) {
    const error=new Error(message);
    for(const {reject} of pythonRequests.values())reject(error);
    pythonRequests.clear();
  }
  function discardPythonWorker(message) {
    if(pythonWorker)pythonWorker.terminate();
    pythonWorker=null;pythonReady=null;
    rejectPythonRequests(message);
  }
  function createPythonWorker() {
    pythonWorker=new Worker("python-worker.js");
    pythonWorker.onmessage=event=>{
      const pending=pythonRequests.get(event.data.id);
      if(!pending)return;
      pythonRequests.delete(event.data.id);
      if(event.data.ok)pending.resolve(event.data);
      else pending.reject(new Error(event.data.output||"Python worker failed."));
    };
    pythonWorker.onerror=event=>{
      discardPythonWorker(event.message||"Python worker failed to load.");
    };
  }
  function callPythonWorker(type,payload={}) {
    return new Promise((resolve,reject)=>{
      const id=++pythonRequestId;
      pythonRequests.set(id,{resolve,reject});
      pythonWorker.postMessage({id,type,...payload});
    });
  }
  async function ensurePythonRuntime() {
    if(pythonReady)return pythonReady;
    if(!pythonWorker)createPythonWorker();
    const supportByTask=Object.fromEntries(labRuntime.labs.map(lab=>[lab.task,lab.support||""]));
    pythonReady=callPythonWorker("init",{
      checks:labRuntime.checks,
      runner:labRuntime.runner,
      supportByTask
    });
    try{return await pythonReady;}
    catch(error){discardPythonWorker(error.message);throw error;}
  }
  function stopPythonExecution(message="Execution stopped. The next run will start a fresh Python runtime.") {
    pythonExecutionId++;
    discardPythonWorker(message);
    setPythonBusy(false);
    if(currentLab){
      renderPythonOutput(message,"fail");
      put(labKey("output",currentLab.task),message);
      put(labKey("result",currentLab.task),"fail");
      $("python-status").textContent=message;
    }
  }
  function renderLabTabs() {
    $("python-tabs").replaceChildren();
    $("python-tabs").hidden=currentLabs.length<2;
    for(const lab of currentLabs){
      const button=document.createElement("button");
      button.type="button";
      button.setAttribute("aria-pressed",String(currentLab?.task===lab.task));
      button.textContent=lab.title;
      button.disabled=pythonBusy;
      button.addEventListener("click",()=>loadLab(lab));
      $("python-tabs").append(button);
    }
  }
  function loadLab(lab) {
    if(pythonBusy&&currentLab&&currentLab.task!==lab.task)stopPythonExecution("Execution stopped because the exercise changed.");
    currentLab=lab;
    $("python-title").textContent=currentLab.title;
    $("python-task").textContent="python -m labs.checks "+currentLab.task;
    const hasSavedCode=get(labKey("saved",currentLab.task))==="yes";
    $("python-code").value=hasSavedCode?get(labKey("code",currentLab.task)):currentLab.starter;
    const output=get(labKey("output",currentLab.task))||"No run yet.";
    renderPythonOutput(output,get(labKey("result",currentLab.task)));
    $("python-status").textContent="Python runs in a browser worker. The first run downloads the runtime; later runs reuse it.";
    $("python-saved").textContent=hasSavedCode?"Restored your locally saved implementation.":"Starter code loaded.";
    setPythonBusy(false);
    renderLabTabs();
  }
  function closeLabPanel() {
    if(pythonBusy)stopPythonExecution("Execution stopped because the lab was closed.");
    $("python-lab").hidden=true;
    document.body.classList.remove("lab-open");
    if(lastLabTrigger?.isConnected)lastLabTrigger.focus();
  }
  function configureLab(lesson) {
    const nextLabs=labRuntime.labs.filter(lab=>lab.lesson===lesson.path);
    if(pythonBusy&&currentLab&&!nextLabs.some(lab=>lab.task===currentLab.task))stopPythonExecution("Execution stopped because the lesson changed.");
    currentLabs=nextLabs;
    currentLab=currentLabs[0]||null;
    $("python-lab").hidden=true;
    document.body.classList.remove("lab-open");
    if(currentLab)loadLab(currentLab);
    else renderLabTabs();
  }
  function openCurrentLab(task,trigger) {
    const lab=currentLabs.find(candidate=>candidate.task===task)||currentLab;
    if(!lab)return;
    if(trigger)lastLabTrigger=trigger;
    if(currentLab?.task!==lab.task)loadLab(lab);
    $("python-lab").hidden=false;
    document.body.classList.add("lab-open");
    window.setTimeout(()=>$("python-code").focus(),80);
  }
  async function executeCurrentLab(mode) {
    if(!currentLab||pythonBusy)return;
    const lab=currentLab,code=$("python-code").value,executionId=++pythonExecutionId;
    put(labKey("code",lab.task),code);
    put(labKey("saved",lab.task),"yes");
    setPythonBusy(true);
    renderPythonOutput("Loading Python runtime…","");
    $("python-status").textContent="Preparing the local Python runtime…";
    try{
      await ensurePythonRuntime();
      if(currentLab?.task!==lab.task||executionId!==pythonExecutionId)return;
      renderPythonOutput(mode==="test"?"Running behavioral checks…":"Running code…","");
      $("python-status").textContent=mode==="test"?"Running "+lab.task+" checks…":"Executing your code…";
      const result=await callPythonWorker("execute",{task:lab.task,code,mode});
      if(currentLab?.task!==lab.task||executionId!==pythonExecutionId)return;
      const state=result.passed?"pass":"fail";
      renderPythonOutput((result.output||"No output.").trimEnd(),state);
      put(labKey("output",lab.task),(result.output||"No output.").trimEnd());
      put(labKey("result",lab.task),state);
      $("python-status").textContent=result.passed
        ?(mode==="test"?"All behavioral checks passed.":"Code executed successfully.")
        :(mode==="test"?"Checks failed. Read the traceback, revise, and run again.":"Execution raised an error.");
    }catch(error){
      if(currentLab?.task!==lab.task||executionId!==pythonExecutionId)return;
      const message=error instanceof Error?error.message:String(error);
      renderPythonOutput(message,"fail");
      put(labKey("output",lab.task),message);
      put(labKey("result",lab.task),"fail");
      $("python-status").textContent=message;
    }finally{
      if(currentLab?.task===lab.task&&executionId===pythonExecutionId)setPythonBusy(false);
    }
  }
  function protectMath(markdown) {
    const entries = [], code = [];
    const codePattern = /(^[ \t]*(\x60{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\2[ \t]*$)|(\x60+)([^\n]*?)\3/gm;
    let text = markdown.replace(codePattern, value => {code.push(value); return "CODETOKEN"+(code.length-1)+"END";});
    text = text.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|(?<!\\)\$([^\n$]+?)(?<!\\)\$/g,
      (full,d1,d2,i1,i2) => {
        entries.push({tex:d1??d2??i1??i2,display:d1!==undefined||d2!==undefined});
        return '<span data-formula="'+(entries.length-1)+'"></span>';
      });
    return {text:text.replace(/CODETOKEN(\d+)END/g,(_,i)=>code[Number(i)]),entries};
  }
  function nav() {
    const query = $("search").value.toLowerCase();
    $("lessons").replaceChildren();
    const matches=lessons.filter(l=>(l.title+" "+l.track+" "+l.markdown).toLowerCase().includes(query));
    const site=window.GroundUpSite;
    const groups=site?site.tracksOf({tracks,lessons}):[];
    if(!groups.length){
      let lastTrack;
      for(const lesson of matches){
        if(lesson.track!==lastTrack){const h=document.createElement("h2");h.textContent=lesson.track;$("lessons").append(h);lastTrack=lesson.track;}
        $("lessons").append(lessonLink(lesson));
      }
      return;
    }
    for(const track of groups){
      const own=matches.filter(l=>(l.trackId||l.track)===track.id);
      const titleHit=(track.title+" "+track.blurb).toLowerCase().includes(query);
      if(!own.length&&!(track.status==="planned"&&(!query||titleHit)))continue;
      const h=document.createElement("h2");
      const head=document.createElement("a");
      head.href="#track/"+encodeURIComponent(track.id);
      head.textContent=track.number+" "+track.title;
      h.append(head);
      if(track.status!=="available")h.insertAdjacentHTML("beforeend",site.badge(track.status));
      $("lessons").append(h);
      if(!own.length){
        const soon=document.createElement("a");
        soon.className="nav-placeholder";
        soon.href="#track/"+encodeURIComponent(track.id);
        soon.textContent="Under development: see what's planned";
        $("lessons").append(soon);
      }
      own.forEach(lesson=>$("lessons").append(lessonLink(lesson)));
    }
  }
  function lessonLink(lesson) {
    const link=document.createElement("a");link.href="#"+encodeURIComponent(lesson.path);
    link.textContent=(get("read:"+lesson.path)==="yes"?"✓ ":"")+lesson.title;
    if(lesson.status==="preview"){
      const tag=document.createElement("span");
      tag.className="nav-tag";tag.textContent="early";tag.title="Early version: being expanded into a full lesson";
      link.append(" ",tag);
    }
    if(current?.path===lesson.path) link.setAttribute("aria-current","page");
    return link;
  }
  function rewriteLinks(lesson) {
    const base=new URL("/content/"+lesson.path,location.origin);
    let exerciseLinkIndex=0;
    $("article").querySelectorAll("a[href],img[src]").forEach(el=>{
      const attr=el.tagName==="IMG"?"src":"href",raw=el.getAttribute(attr);
      if(/^(https?:|mailto:|#)/i.test(raw)) return;
      const resolved=new URL(raw,base),candidate=decodeURIComponent(resolved.pathname.replace(/^\/content\//,""));
      if(el.tagName==="A"&&currentLabs.length&&resolved.pathname==="/labs/exercises.py"){
        const lab=currentLabs[Math.min(exerciseLinkIndex++,currentLabs.length-1)];
        const button=document.createElement("button");
        button.type="button";
        button.className="inline-lab-button";
        button.textContent=currentLabs.length>1?"Open Python lab: "+lab.title:"Open runnable Python lab";
        button.addEventListener("click",()=>openCurrentLab(lab.task,button));
        el.replaceWith(button);
        return;
      }
      if(el.tagName==="IMG"&&resolved.pathname.startsWith("/content/assets/")) el.setAttribute(attr,"assets/"+resolved.pathname.split("/assets/")[1]);
      else if(lessons.some(l=>l.path===candidate)) el.setAttribute(attr,"#"+encodeURIComponent(candidate));
      else el.setAttribute(attr,"https://github.com/sumilk/groundup-lab/blob/main"+resolved.pathname);
    });
  }
  function interactiveSpec(text) {
    const spec={},lines=text.split(/\r?\n/);
    for(const line of lines){
      const match=line.match(/^\s*([A-Za-z][\w-]*)\s*:\s*(.*)$/);
      if(match)spec[match[1].toLowerCase()]=match[2].trim();
    }
    if(!spec.lab){
      const bare=lines.map(line=>line.trim()).find(Boolean);
      if(bare)spec.lab=bare;
    }
    return spec;
  }
  function mountInteractives() {
    [...$("article").querySelectorAll("code.language-lab,code.language-interactive")].forEach(code=>{
      const block=code.closest("pre")||code;
      const spec=interactiveSpec(code.textContent);
      const host=document.createElement("div");
      block.replaceWith(host);
      if(window.GroundUpInteractives&&spec.lab&&window.GroundUpInteractives.mount(spec.lab,host,spec))return;
      const fallback=document.createElement("p");
      fallback.className="lab-missing";
      fallback.textContent="Lab \""+(spec.lab||"unnamed")+"\" could not be started; the surrounding text carries the same argument.";
      host.replaceWith(fallback);
    });
  }
  const answerBanks=new Set();
  function loadAnswers(key) {
    if(answerBanks.has(key))return Promise.resolve(true);
    return new Promise(resolve=>{
      const script=document.createElement("script");
      script.src="answers/"+encodeURIComponent(key)+".js";
      script.onload=()=>{answerBanks.add(key);resolve(true);};
      script.onerror=()=>resolve(false);
      document.head.appendChild(script);
    });
  }
  const EXERCISE=/^([ABCMK]\d+)\s*(?:·|\.|—|$)/;
  const LEVELS=["foundation","core","stretch","checkpoint"];
  function exerciseHead(label) {
    /* "A1 · Foundation · paper — arithmetic and recipes." */
    const split=label.split(/\s+—\s+/);
    const parts=split[0].split("·").map(part=>part.trim()).filter(Boolean);
    const name=(split.slice(1).join(" — ")||"").replace(/\.$/,"");
    const head=document.createElement("div");
    head.className="ex-head";
    const id=document.createElement("span");
    id.className="ex-h ex-id";
    id.textContent=parts[0]||label;
    head.append(id);
    parts.slice(1).forEach(tag=>{
      const chip=document.createElement("span");
      const slug=tag.toLowerCase().replace(/[^a-z]/g,"");
      chip.className="ex-tag "+(LEVELS.includes(slug)?"lvl-"+slug:"mode-"+slug);
      chip.textContent=tag;
      head.append(chip);
    });
    if(name){
      const title=document.createElement("span");
      title.className="ex-name";
      title.textContent=name;
      head.append(title);
    }
    return head;
  }
  function wrapExercises() {
    [...$("article").children].forEach(node=>{
      if(node.tagName!=="P")return;
      const strong=node.firstElementChild;
      if(!strong||strong.tagName!=="STRONG"||!EXERCISE.test(strong.textContent.trim()))return;
      const box=document.createElement("div");
      box.className="ex";
      node.replaceWith(box);
      const head=exerciseHead(strong.textContent.trim());
      strong.remove();
      if(node.firstChild&&node.firstChild.nodeType===3)
        node.firstChild.nodeValue=node.firstChild.nodeValue.replace(/^\s+/,"");
      box.append(head,node);
      let next=box.nextElementSibling;
      while(next&&!/^H[1-6]$/.test(next.tagName)&&!next.classList.contains("ex")&&!next.classList.contains("lab")){
        const lead=next.tagName==="P"?next.firstElementChild:null;
        if(lead&&lead.tagName==="STRONG"&&EXERCISE.test(lead.textContent.trim()))break;
        const move=next;next=next.nextElementSibling;box.append(move);
      }
    });
    /* group runs of exercises so the set reads as one object */
    let run=null;
    [...$("article").children].forEach(node=>{
      if(node.classList&&node.classList.contains("ex")){
        if(!run){run=document.createElement("div");run.className="exgrid";node.replaceWith(run);run.append(node);}
        else run.append(node);
      }else if(!(node.classList&&node.classList.contains("exgrid"))){run=null;}
    });
  }
  const PRACTICE=/^Practice\s*[—-]\s*([A-Za-z]+)\s*:?/;
  function stylePractice() {
    [...$("article").querySelectorAll("blockquote")].forEach(quote=>{
      const rows=[...quote.children].filter(child=>child.tagName==="P");
      const matched=rows.filter(row=>row.firstElementChild&&row.firstElementChild.tagName==="STRONG"
        &&PRACTICE.test(row.firstElementChild.textContent.trim()));
      if(!matched.length)return;
      const set=document.createElement("div");
      set.className="practice-set";
      const caption=document.createElement("span");
      caption.className="practice-cap";
      caption.textContent="Practice";
      set.append(caption);
      let previousLine=null;
      rows.forEach(row=>{
        const strong=row.firstElementChild;
        if(strong&&/^Hint\s*:$/.test(strong.textContent.trim())&&previousLine){
          strong.remove();
          const details=document.createElement("details");
          details.className="practice-hint";
          const summary=document.createElement("summary");
          summary.textContent="Hint";
          details.append(summary,row);
          previousLine.append(details);
          return;
        }
        const level=strong&&PRACTICE.exec(strong.textContent.trim());
        const line=document.createElement("div");
        line.className="practice-row";
        if(level){
          const chip=document.createElement("span");
          const slug=level[1].toLowerCase();
          chip.className="ex-tag "+(LEVELS.includes(slug)?"lvl-"+slug:"mode-"+slug);
          chip.textContent=level[1];
          strong.remove();
          if(row.firstChild&&row.firstChild.nodeType===3)
            row.firstChild.nodeValue=row.firstChild.nodeValue.replace(/^[\s:]+/,"");
          line.append(chip);
        }
        line.append(row);
        set.append(line);
        previousLine=level?line:null;
      });
      quote.replaceWith(set);
    });
  }
  function renderProgress(key) {
    if(!key||!window.GU||!window.GU.work)return;
    let line=document.getElementById("progress-line");
    if(!line){
      line=document.createElement("span");
      line.id="progress-line";
      line.className="progress-line";
      line.setAttribute("role","status");
      document.querySelector(".toolbar").append(line);
    }
    const total=$("article").querySelectorAll(".chk").length;
    const work=(window.GU.work.all()||{})[key]||{};
    const ids=Object.keys(work);
    const attempted=ids.filter(id=>work[id]&&work[id].attempted).length;
    const right=ids.filter(id=>work[id]&&work[id].correct).length;
    line.textContent=total?attempted+" of "+total+" exercises attempted · "+right+" fully right":"";
  }
  async function mountCheckers(lesson) {
    const front=lesson.markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const key=front&&front[1].match(/^answers:\s*(\S+)\s*$/m)?.[1];
    if(!key||!window.GU||!window.GU.mountCheckers)return;
    if(!await loadAnswers(key))return;
    try{window.GU.mountCheckers(key);}catch{}
    renderProgress(key);
    let queued=false;
    $("article").addEventListener("click",()=>{
      if(queued)return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;renderProgress(key);});
    });
  }
  /* ---- colour theme: system, light, dark ---- */
  const THEMES=["system","light","dark"];
  function applyTheme(mode){
    const root=document.documentElement;
    if(mode==="system")root.removeAttribute("data-theme");
    else root.setAttribute("data-theme",mode);
    const button=$("theme");
    if(button){
      button.textContent="Theme: "+mode;
      button.setAttribute("aria-label","Colour theme: "+mode+". Activate to change.");
    }
    const headerButton=$("site-theme");
    if(headerButton){
      headerButton.textContent=mode==="light"?"☀":mode==="dark"?"☾":"◐";
      headerButton.title="Theme: "+mode;
      headerButton.setAttribute("aria-label","Colour theme: "+mode+". Activate to change.");
    }
    document.querySelectorAll(".lab canvas").forEach(canvas=>{
      canvas.dispatchEvent(new Event("gu-theme"));
    });
    window.dispatchEvent(new Event("resize"));
  }
  function initTheme(){
    let mode=get("theme");
    if(!THEMES.includes(mode))mode="system";
    applyTheme(mode);
    const cycle=()=>{
      const next=THEMES[(THEMES.indexOf(get("theme")||"system")+1)%THEMES.length];
      put("theme",next);
      applyTheme(next);
    };
    if($("theme"))$("theme").onclick=cycle;
    if($("site-theme"))$("site-theme").onclick=cycle;
  }
  async function show() {
    const token=++renderId;let selected="";try{selected=decodeURIComponent(location.hash.slice(1));}catch{}
    const site=window.GroundUpSite;
    if(site&&!lessons.some(l=>l.path===selected)&&site.render(selected,{tracks,lessons,labs:labRuntime.labs})){
      if(!$("python-lab").hidden)closeLabPanel();
      $("status").textContent="";
      return;
    }
    window.scrollTo(0,0);
    current=lessons.find(l=>l.path===selected)||lessons[0];
    if(!current){$("status").textContent="No authored lessons found.";return;}
    const lesson=current,idx=lessons.indexOf(lesson);
    configureLab(lesson);
    document.title=lesson.title+" — GroundUp Lab";
    $("source").href="https://github.com/sumilk/groundup-lab/blob/main/content/"+lesson.path;
    $("notes").value=get("notes:"+lesson.path);$("read").checked=get("read:"+lesson.path)==="yes";
    $("previous").disabled=idx===0;$("next").disabled=idx===lessons.length-1;
    $("status").textContent=(idx+1)+" / "+lessons.length+" · "+lesson.track+" · "+revision;
    $("saved").textContent="";nav();
    const banner=site?site.lessonBanner(lesson,{tracks,lessons}):"";
    $("lesson-banner").innerHTML=banner;$("lesson-banner").hidden=!banner;
    const body=lesson.markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,"");
    if(!window.marked||!window.DOMPurify){$("article").innerHTML="<pre>"+escapeHTML(body)+"</pre>";$("status").textContent+=" · Renderer unavailable; showing Markdown.";return;}
    const p=protectMath(body);
    $("article").innerHTML=DOMPurify.sanitize(marked.parse(p.text),{ADD_ATTR:["data-formula"]});
    $("article").querySelectorAll("[data-formula]").forEach(node=>{
      const formula=p.entries[Number(node.dataset.formula)];if(!formula)return;
      if(window.katex) katex.render(formula.tex,node,{displayMode:formula.display,throwOnError:false,trust:false,strict:"warn"});
      else node.textContent=(formula.display?"$$":"$")+formula.tex+(formula.display?"$$":"$");
    });
    rewriteLinks(lesson);
    const diagrams=[...$("article").querySelectorAll("code.language-mermaid")];
    if(diagrams.length)try{
      mermaidPromise ||= import("https://cdn.jsdelivr.net/npm/mermaid@12/dist/mermaid.esm.min.mjs");
      const {default:mermaid}=await mermaidPromise;if(token!==renderId)return;
      mermaid.initialize({startOnLoad:false,securityLevel:"strict",theme:"default"});
      const nodes=diagrams.map(code=>{const n=document.createElement("pre");n.className="mermaid";n.textContent=code.textContent;code.parentElement.replaceWith(n);return n;});
      await mermaid.run({nodes});
    }catch{if(token===renderId)$("status").textContent+=" · Diagram rendering failed; see Markdown source.";}
    if(token!==renderId)return;
    mountInteractives();
    wrapExercises();
    stylePractice();
    if(window.GroundUpTutor)window.GroundUpTutor.mount(lesson.path);
    mountCheckers(lesson);
  }
  initTheme();
  $("search").addEventListener("input",nav);
  $("notes").addEventListener("input",()=>{if(current)$("saved").textContent=put("notes:"+current.path,$("notes").value)?"Notes saved in this browser.":"Storage unavailable; notes last only this session.";});
  $("read").addEventListener("change",()=>{if(current){put("read:"+current.path,$("read").checked?"yes":"");nav();}});
  $("previous").onclick=()=>{const n=lessons.indexOf(current);if(n>0)location.hash=encodeURIComponent(lessons[n-1].path);};
  $("next").onclick=()=>{const n=lessons.indexOf(current);if(n<lessons.length-1)location.hash=encodeURIComponent(lessons[n+1].path);};
  $("print").onclick=()=>window.print();
  $("python-code").addEventListener("input",()=>{
    if(!currentLab)return;
    const durable=put(labKey("code",currentLab.task),$("python-code").value);
    put(labKey("saved",currentLab.task),"yes");
    $("python-saved").textContent=durable?"Implementation saved in this browser.":"Implementation saved for this tab session.";
  });
  $("python-code").addEventListener("keydown",event=>{
    if(event.key==="Tab"){
      event.preventDefault();
      const editor=$("python-code");
      editor.setRangeText("    ",editor.selectionStart,editor.selectionEnd,"end");
      editor.dispatchEvent(new Event("input"));
    }else if(event.key==="Enter"&&(event.ctrlKey||event.metaKey)){
      event.preventDefault();
      executeCurrentLab("test");
    }
  });
  $("python-test").onclick=()=>executeCurrentLab("test");
  $("python-run").onclick=()=>executeCurrentLab("run");
  $("python-stop").onclick=()=>stopPythonExecution();
  $("python-close").onclick=closeLabPanel;
  $("python-reset").onclick=()=>{
    if(!currentLab||!window.confirm("Reset this exercise to its current starter code? Your saved implementation and output will be replaced."))return;
    $("python-code").value=currentLab.starter;
    put(labKey("code",currentLab.task),currentLab.starter);
    put(labKey("saved",currentLab.task),"yes");
    put(labKey("output",currentLab.task),"");
    put(labKey("result",currentLab.task),"");
    renderPythonOutput("No run yet.","");
    $("python-saved").textContent="Starter code restored and saved locally.";
    $("python-status").textContent="Reset complete. Run the behavioral checks when ready.";
    $("python-code").focus();
  };
  $("prompt").onclick=async()=>{
    if(!current)return;
    const text="Tutor me on "+current.title+". Ask one question at a time. Require an attempt before hints and evidence for derivation, implementation, and transfer.\n\nMy attempt:\n"+$("notes").value+"\n\nLesson:\n"+current.markdown;
    try{await navigator.clipboard.writeText(text);$("saved").textContent="Prompt copied. Paste it into your LLM chat.";}
    catch{$("saved").textContent="Clipboard unavailable; copy your notes and Markdown source manually.";}
  };
  window.addEventListener("hashchange",show);
  Promise.all([
    fetch("catalog.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}),
    fetch("lab-runtime.json",{cache:"no-cache"})
      .then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})
      .catch(error=>({labs:[],loadError:error.message}))
  ])
    .then(([data,runtime])=>{
      lessons=data.lessons;tracks=data.tracks||[];revision=data.revision||"authored lessons";labRuntime=runtime;
      return show().then(()=>{if(runtime.loadError)$("status").textContent+=" · Runnable labs unavailable: "+runtime.loadError;});
    })
    .catch(error=>{$("status").textContent="Could not load lessons: "+error.message+". Use the repository theory index.";});
})();
