/* Sanitized Markdown; notes remain text. This reader needs no API key. */
(() => {
  const $ = id => document.getElementById(id);
  let lessons = [], current = null, revision = "", renderId = 0, mermaidPromise;
  const memory = new Map();
  function get(key) { try { return localStorage.getItem(key) || ""; } catch { return memory.get(key) || ""; } }
  function put(key,value) { memory.set(key,value); try { localStorage.setItem(key,value); return true; } catch { return false; } }
  function escapeHTML(text) { return text.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
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
    $("lessons").replaceChildren(); let lastTrack;
    for(const lesson of lessons.filter(l=>(l.title+" "+l.track+" "+l.markdown).toLowerCase().includes(query))) {
      if(lesson.track!==lastTrack) {const h=document.createElement("h2");h.textContent=lesson.track;$("lessons").append(h);lastTrack=lesson.track;}
      const link=document.createElement("a");link.href="#"+encodeURIComponent(lesson.path);
      link.textContent=(get("read:"+lesson.path)==="yes"?"✓ ":"")+lesson.title;
      if(current?.path===lesson.path) link.setAttribute("aria-current","page");
      $("lessons").append(link);
    }
  }
  function rewriteLinks(lesson) {
    const base=new URL("/content/"+lesson.path,location.origin);
    $("article").querySelectorAll("a[href],img[src]").forEach(el=>{
      const attr=el.tagName==="IMG"?"src":"href",raw=el.getAttribute(attr);
      if(/^(https?:|mailto:|#)/i.test(raw)) return;
      const resolved=new URL(raw,base),candidate=decodeURIComponent(resolved.pathname.replace(/^\/content\//,""));
      if(el.tagName==="IMG"&&resolved.pathname.startsWith("/content/assets/")) el.setAttribute(attr,"assets/"+resolved.pathname.split("/assets/")[1]);
      else if(lessons.some(l=>l.path===candidate)) el.setAttribute(attr,"#"+encodeURIComponent(candidate));
      else el.setAttribute(attr,"https://github.com/sumilk/groundup-lab/blob/main"+resolved.pathname);
    });
  }
  async function show() {
    const token=++renderId;let selected="";try{selected=decodeURIComponent(location.hash.slice(1));}catch{}
    current=lessons.find(l=>l.path===selected)||lessons[0];
    if(!current){$("status").textContent="No authored lessons found.";return;}
    const lesson=current,idx=lessons.indexOf(lesson);
    document.title=lesson.title+" — GroundUp Lab";
    $("source").href="https://github.com/sumilk/groundup-lab/blob/main/content/"+lesson.path;
    $("notes").value=get("notes:"+lesson.path);$("read").checked=get("read:"+lesson.path)==="yes";
    $("previous").disabled=idx===0;$("next").disabled=idx===lessons.length-1;
    $("status").textContent=(idx+1)+" / "+lessons.length+" · "+lesson.track+" · "+revision;
    $("saved").textContent="";nav();
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
  }
  $("search").addEventListener("input",nav);
  $("notes").addEventListener("input",()=>{if(current)$("saved").textContent=put("notes:"+current.path,$("notes").value)?"Notes saved in this browser.":"Storage unavailable; notes last only this session.";});
  $("read").addEventListener("change",()=>{if(current){put("read:"+current.path,$("read").checked?"yes":"");nav();}});
  $("previous").onclick=()=>{const n=lessons.indexOf(current);if(n>0)location.hash=encodeURIComponent(lessons[n-1].path);};
  $("next").onclick=()=>{const n=lessons.indexOf(current);if(n<lessons.length-1)location.hash=encodeURIComponent(lessons[n+1].path);};
  $("print").onclick=()=>window.print();
  $("prompt").onclick=async()=>{
    if(!current)return;
    const text="Tutor me on "+current.title+". Ask one question at a time. Require an attempt before hints and evidence for derivation, implementation, and transfer.\n\nMy attempt:\n"+$("notes").value+"\n\nLesson:\n"+current.markdown;
    try{await navigator.clipboard.writeText(text);$("saved").textContent="Prompt copied. Paste it into your LLM chat.";}
    catch{$("saved").textContent="Clipboard unavailable; copy your notes and Markdown source manually.";}
  };
  window.addEventListener("hashchange",show);
  fetch("catalog.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})
    .then(data=>{lessons=data.lessons;revision=data.revision||"authored lessons";return show();})
    .catch(error=>{$("status").textContent="Could not load lessons: "+error.message+". Use the repository theory index.";});
})();
