/* Site chrome around the lesson reader: landing page, track status pages, legal page.
   reader.js owns routing and calls GroundUpSite.render(route, data) for non-lesson hashes. */
(() => {
  "use strict";
  const AUTHOR = {
    name: "Sumil Khosla",
    initials: "SK",
    role: "Author, illustrator & maintainer",
    github: "https://github.com/sumilk",
    handle: "@sumilk",
    linkedin: "https://www.linkedin.com/in/sumil-khosla-376b679/"
  };
  const STATUS = {
    "available": {label: "Available", detail: "Published and still expanding"},
    "in-development": {label: "In development", detail: "Some pages published; more being written"},
    "planned": {label: "Coming soon", detail: "Planned; no lessons published yet"}
  };
  const LANDING_SECTIONS = ["home", "curriculum", "roadmap", "pro", "about"];

  const esc = text => String(text).replace(/[&<>"']/g, c =>
    ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
  const lessonHref = lesson => "#" + encodeURIComponent(lesson.path);
  const badge = status => {
    const s = STATUS[status] || STATUS["in-development"];
    return '<span class="status-badge status-' + esc(status) + '" title="' + esc(s.detail) + '">' + esc(s.label) + "</span>";
  };

  /* Older catalogs have no track list; derive one so the page still renders. */
  function tracksOf(data) {
    if (data.tracks && data.tracks.length) return data.tracks;
    const seen = new Map();
    data.lessons.forEach(lesson => {
      const id = lesson.trackId || lesson.track;
      if (!seen.has(id)) seen.set(id, {id, number: String(id).slice(0, 2), title: lesson.track, blurb: "", lessons: 0, status: "in-development"});
      seen.get(id).lessons++;
    });
    return [...seen.values()];
  }
  const lessonsIn = (data, track) => data.lessons.filter(l => (l.trackId || l.track) === track.id);

  function stats(data) {
    const figures = data.lessons.reduce((n, l) => n + (l.markdown.match(/^\s*```(?:lab|interactive)\b/gm) || []).length, 0);
    return [
      [data.lessons.length, "lessons"],
      [(data.labs || []).length, "runnable Python labs"],
      [figures, "interactive figures"],
      [tracksOf(data).length, "tracks"]
    ].filter(([n]) => n > 0);
  }

  const HERO_ART = `
<svg class="hero-art" viewBox="0 0 420 340" role="img" aria-label="Two vectors u and v on a grid, with their sum u + v completing a parallelogram">
  <defs>
    <pattern id="hgrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" class="g"/></pattern>
    <marker id="hu" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fu"/></marker>
    <marker id="hv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fv"/></marker>
    <marker id="hw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fw"/></marker>
  </defs>
  <rect width="420" height="340" fill="url(#hgrid)"/>
  <path d="M0 270H420M90 0V340" class="ax"/>
  <path d="M90 270L330 90" class="sw" marker-end="url(#hw)"/>
  <path d="M90 270L270 210L330 90L150 150Z" class="par"/>
  <path d="M90 270L270 210" class="su" marker-end="url(#hu)"/>
  <path d="M90 270L150 150" class="sv" marker-end="url(#hv)"/>
  <path d="M270 210L330 90M150 150L330 90" class="dash"/>
  <text x="182" y="262" class="tu">u</text><text x="96" y="200" class="tv">v</text><text x="238" y="194" class="tw">u + v</text>
  <circle cx="90" cy="270" r="4" class="o"/>
</svg>`;

  const ICONS = {
    read: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
    derive: '<path d="M5 19 19 5M7 5h4M5 7v4M15 17h4"/>',
    implement: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    explain: '<path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v7c0 1.4-1.1 2.5-2.5 2.5H10l-4 4v-4h0c-1.1 0-2-.9-2-2z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'
  };
  const icon = name => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>";

  function trackCard(data, track) {
    const own = lessonsIn(data, track);
    const href = "#track/" + encodeURIComponent(track.id);
    const modules = track.modules || [];
    const done = modules.filter(m => m.status !== "planned").length;
    const count = modules.length
      ? (done ? done + " of " + modules.length + " modules" : modules.length + " modules planned")
      : own.length ? own.length + (own.length === 1 ? " page" : " pages") : "No lessons yet";
    return '<a class="track-card is-' + esc(track.status) + '" data-status="' + esc(track.status) + '" href="' + href + '">' +
      '<span class="track-num">' + esc(track.number) + "</span>" +
      '<span class="track-body"><span class="track-title">' + esc(track.title) + "</span>" +
      (track.blurb ? '<span class="track-blurb">' + esc(track.blurb) + "</span>" : "") +
      '<span class="track-meta">' + badge(track.status) + '<span class="track-count">' + esc(count) + "</span></span></span></a>";
  }

  function landing(data) {
    const tracks = tracksOf(data);
    const start = data.lessons.find(l => (l.trackId || "").startsWith("02-")) || data.lessons[0];
    const counts = {available: 0, "in-development": 0, planned: 0};
    tracks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return `
<section class="hero" id="landing-home">
  <div class="hero-copy">
    <p class="eyebrow">An independent study library</p>
    <h1>Learn AI from the <em>ground&nbsp;up</em>.</h1>
    <p class="lede">A rigorous, self-paced route from mathematical language to LLM systems. Every idea is derived, drawn as a figure you can drag, and implemented in Python that runs right in your browser.</p>
    <div class="cta-row">
      ${start ? `<a class="btn btn-primary" href="${lessonHref(start)}">Start learning <span aria-hidden="true">→</span></a>` : ""}
      <a class="btn btn-ghost" href="#curriculum">Explore the curriculum</a>
    </div>
    <dl class="stats">${stats(data).map(([n, label]) => `<div><dt>${esc(n)}</dt><dd>${esc(label)}</dd></div>`).join("")}</dl>
    <p class="fine">Free to read. No account needed. Your notes, code and progress stay in this browser.</p>
  </div>
  <div class="hero-figure">${HERO_ART}<p class="hero-caption">Figures in the lessons are live: drag a vector and watch the span, projection or eigen-direction respond.</p></div>
</section>

<section class="band" id="landing-method">
  <div class="section-head"><p class="eyebrow">The method</p><h2>Read. Derive. Implement. Explain.</h2>
  <p>Each lesson is built so that understanding is something you can demonstrate, not just something you feel.</p></div>
  <div class="feature-grid">
    <div class="feature">${icon("read")}<h3>Read the argument</h3><p>Long-form lessons written in textbook style: definitions first, nothing hand-waved, prerequisites linked rather than assumed.</p></div>
    <div class="feature">${icon("derive")}<h3>Derive it yourself</h3><p>Graded exercises (foundation, core, stretch and checkpoint) with instant answer checks, hints and worked solutions.</p></div>
    <div class="feature">${icon("implement")}<h3>Implement and test</h3><p>Write the function in an in-browser Python editor and run the same behavioural checks used by the local lab suite.</p></div>
    <div class="feature">${icon("explain")}<h3>Explain it back</h3><p>Write predictions and derivations beside the lesson. With the Pro AI tutor, get a strict review of your reasoning.</p></div>
  </div>
</section>

<section class="section" id="landing-curriculum">
  <div class="section-head"><p class="eyebrow">Curriculum</p><h2>${tracks.length} tracks, one continuous path</h2>
  <p>From foundations through linear algebra, optimization and probability to deep learning, language models, reinforcement learning and production AI systems.</p></div>
  <div class="roadmap" id="landing-roadmap" role="group" aria-label="Filter tracks by status">
    <button type="button" class="chip" data-filter="all" aria-pressed="true">All <span>${tracks.length}</span></button>
    <button type="button" class="chip" data-filter="available" aria-pressed="false">${badge("available")} <span>${counts.available}</span></button>
    <button type="button" class="chip" data-filter="in-development" aria-pressed="false">${badge("in-development")} <span>${counts["in-development"]}</span></button>
    <button type="button" class="chip" data-filter="planned" aria-pressed="false">${badge("planned")} <span>${counts.planned}</span></button>
  </div>
  <div class="dev-note" role="note"><strong>Built in the open, one track at a time.</strong> Most of this library is still under development. Tracks marked <em>In development</em> have early pages you can read today; they will grow into full lessons with figures, checked exercises and labs. Tracks marked <em>Coming soon</em> are planned. Open any track to see its full outline and the status of every module.</div>
  <div class="track-grid">${tracks.map(t => trackCard(data, t)).join("")}</div>
</section>

<section class="band" id="landing-pro">
  <div class="pro-wrap">
    <div class="pro-copy">
      <p class="eyebrow">GroundUp Lab <span class="pro-badge">Pro</span></p>
      <h2>An AI tutor that lives in the margin</h2>
      <p>Ask about any paragraph, figure or exercise and get an exact answer anchored right there. Submit a proof and get told precisely where the argument leaks, not just whether it is right.</p>
      <ul class="checks">
        <li>Ask about any passage with the <b>?</b> chip; threads stay pinned to that spot</li>
        <li>Strict marking of written working and proofs</li>
        <li>Hints on demand: the first move, never the whole answer</li>
        <li>Choose your model: Claude, OpenAI-compatible, or your own gateway</li>
      </ul>
      <p class="fine">Pro is in <strong>early access</strong> and is not on sale yet. During early access you can connect your own model API key from any lesson's toolbar; the key is stored only in your browser.</p>
    </div>
    <div class="plans">
      <div class="plan"><h3>Free</h3><p class="price">Free · forever</p><ul>
        <li>Every published lesson</li><li>Interactive figures</li><li>In-browser Python labs and checks</li><li>Answer checking and solutions</li><li>Local notes and progress</li></ul>
        ${start ? `<a class="btn btn-ghost" href="${lessonHref(start)}">Start reading</a>` : ""}</div>
      <div class="plan plan-pro"><h3>Pro <span class="pro-badge">Early access</span></h3><p class="price">Pricing coming soon</p><ul>
        <li>Everything in Free</li><li>AI tutor on every passage</li><li>Proof and working review</li><li>Hints that don't spoil</li><li>Bring your own model</li></ul>
        ${start ? `<a class="btn btn-primary" href="${lessonHref(start)}">Try it in a lesson</a>` : ""}</div>
    </div>
  </div>
</section>

<section class="section" id="landing-about">
  <div class="about">
    <div class="avatar" aria-hidden="true">${esc(AUTHOR.initials)}</div>
    <div>
      <p class="eyebrow">About the author</p>
      <h2>${esc(AUTHOR.name)}</h2>
      <p class="role">${esc(AUTHOR.role)}</p>
      <p>GroundUp Lab is written, illustrated and engineered by ${esc(AUTHOR.name)}. It started as a personal route to research-engineer fluency in machine learning, the long way round: proving the linear algebra, deriving the estimators and implementing every algorithm before trusting a library with it. It is now published so others can take the same path.</p>
      <p>Every lesson, exercise, figure and lab on this site is original work unless credited otherwise. Some writing and code were produced with AI assistance and then reviewed and edited by the author.</p>
      <div class="cta-row"><a class="btn btn-primary" href="${AUTHOR.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a class="btn btn-ghost" href="${AUTHOR.github}" target="_blank" rel="noopener">GitHub · ${esc(AUTHOR.handle)}</a><a class="btn btn-ghost" href="#legal">Copyright &amp; permissions</a></div>
    </div>
  </div>
</section>`;
  }

  const MODULE_STATUS = {
    published: {label: "Published", cls: "status-available"},
    early: {label: "Early version", cls: "status-in-development"},
    planned: {label: "Coming soon", cls: "status-planned"}
  };
  const trackHref = track => "#track/" + encodeURIComponent(track.id);
  const lessonByPath = (data, path) => data.lessons.find(l => l.path === path);

  function moduleRow(data, module) {
    const s = MODULE_STATUS[module.status] || MODULE_STATUS.planned;
    const lesson = module.lesson && lessonByPath(data, module.lesson);
    const title = lesson
      ? `<a href="${lessonHref(lesson)}">${esc(module.title)}</a>`
      : `<span>${esc(module.title)}</span>`;
    return `<li class="module is-${esc(module.status)}"><span class="module-handle">${esc(module.handle)}</span>
      <span class="module-title">${title}</span>
      <span class="module-meta">${module.hours ? `<span class="module-hours" title="Estimated study hours">${esc(module.hours)}h</span>` : ""}<span class="status-badge ${s.cls}">${esc(s.label)}</span></span></li>`;
  }

  function trackPage(data, id) {
    const tracks = tracksOf(data);
    const track = tracks.find(t => t.id === id);
    if (!track) return `<section class="page-narrow"><h1>Track not found</h1><p><a href="#curriculum">Back to the curriculum</a></p></section>`;
    const own = lessonsIn(data, track);
    const index = tracks.indexOf(track), prev = tracks[index - 1], next = tracks[index + 1];
    const modules = track.modules || [];
    const count = status => modules.filter(m => m.status === status).length;
    const published = count("published"), early = count("early"), planned = count("planned");
    const hours = modules.reduce((n, m) => n + (m.hours || 0), 0);
    const extras = (track.extras || []).map(path => lessonByPath(data, path)).filter(Boolean);
    const firstModule = modules.find(m => m.lesson);
    const start = (firstModule && lessonByPath(data, firstModule.lesson)) || extras[0] || own[0];
    const buildsOn = (track.buildsOn || []).map(t => tracks.find(x => x.id === t)).filter(Boolean);
    const ready = tracks.filter(t => t.status === "available" && t.id !== track.id);

    const notice = track.status === "planned"
      ? `<div class="placeholder"><div class="placeholder-icon" aria-hidden="true">${icon("spark")}</div><h2>This section is under development</h2>
         <p>No lessons in <strong>${esc(track.title)}</strong> have been published yet. The full outline is below; lessons will appear as they are written, each with derivations, interactive figures, checked exercises and runnable labs.</p>
         ${ready.length ? `<p>While you wait, these tracks are ready: ${ready.map(t => `<a href="${trackHref(t)}">${esc(t.title)}</a>`).join(" and ")}.</p>` : ""}</div>`
      : track.status === "in-development"
        ? `<div class="placeholder slim"><h2>This section is under development</h2><p>Some pages are readable now. Modules marked <span class="status-badge status-planned">Coming soon</span> are planned and outlined but not yet written; <span class="lesson-tag">Early version</span> pages are being expanded into full lessons.</p></div>`
        : `<div class="placeholder slim ok"><h2>Published and expanding</h2><p>The core lessons in this track are published. Modules marked Coming soon extend it further and are being written.</p></div>`;

    const progress = modules.length ? `
  <div class="track-progress" role="img" aria-label="${published} published, ${early} early version, ${planned} coming soon, out of ${modules.length} modules">
    <div class="bar"><span class="seg-published" style="width:${(published / modules.length * 100).toFixed(2)}%"></span><span class="seg-early" style="width:${(early / modules.length * 100).toFixed(2)}%"></span></div>
    <div class="legend">${[[published, "published", "seg-published"], [early, "early version", "seg-early"], [planned, "coming soon", "seg-planned"]].filter(([n]) => n).map(([n, label, cls]) => `<span><i class="${cls}"></i>${n} ${label}</span>`).join("")}</div>
  </div>` : "";

    const facts = [
      [own.length, own.length === 1 ? "page to read now" : "pages to read now"],
      modules.length ? [modules.length, "modules planned"] : null,
      hours ? ["~" + hours, "study hours (est.)"] : null
    ].filter(Boolean);

    const extrasBox = extras.length ? `
  <section class="overview-box">
    <h2>Read now: introductory ${extras.length === 1 ? "overview" : "overviews"}</h2>
    <p>${extras.length === 1 ? "This page covers" : "These pages cover"} the essentials of the track in compact form. ${extras.length === 1 ? "Its" : "Their"} material will be folded into the detailed modules below as they are written.</p>
    <ol class="lesson-list">${extras.map(l => `<li><a href="${lessonHref(l)}"><span class="lesson-title">${esc(l.title)}</span><span class="lesson-tag">Early version</span><span aria-hidden="true" class="arrow">→</span></a></li>`).join("")}</ol>
  </section>` : "";

    const parts = (track.parts || []).length ? track.parts : (modules.length ? [{label: "", title: "Modules", thesis: "", handles: modules.map(m => m.handle)}] : []);
    const roadmap = parts.length ? `
  <section class="module-map">
    <h2>What this track covers</h2>
    ${parts.map(part => {
      const rows = part.handles.map(h => modules.find(m => m.handle === h)).filter(Boolean);
      return `<div class="part"><h3>${part.label ? `<span class="part-label">${esc(part.label)}</span>` : ""}${esc(part.title)}</h3>
      ${part.thesis ? `<p class="part-thesis">${esc(part.thesis.charAt(0).toUpperCase() + part.thesis.slice(1))}</p>` : ""}
      <ol class="modules">${rows.map(m => moduleRow(data, m)).join("")}</ol></div>`;
    }).join("")}
    <p class="fine">Module outlines and study-hour estimates are planning targets and may change as lessons are written.</p>
  </section>` : (own.length ? `<ol class="lesson-list">${own.map(l =>
      `<li><a href="${lessonHref(l)}"><span class="lesson-title">${esc(l.title)}</span>${l.status === "preview" ? '<span class="lesson-tag">Early version</span>' : ""}<span aria-hidden="true" class="arrow">→</span></a></li>`).join("")}</ol>` : "");

    return `<section class="page-narrow track-page">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a> / <a href="#curriculum">Curriculum</a> / <span>${esc(track.title)}</span></nav>
  <p class="eyebrow">Track ${esc(track.number)}</p>
  <h1>${esc(track.title)} ${badge(track.status)}</h1>
  ${track.blurb ? `<p class="lede">${esc(track.blurb)}</p>` : ""}
  ${track.overview ? `<p class="track-overview">${esc(track.overview)}</p>` : ""}
  <dl class="track-facts">${facts.map(([n, label]) => `<div><dt>${esc(n)}</dt><dd>${esc(label)}</dd></div>`).join("")}</dl>
  ${progress}
  ${start ? `<div class="cta-row"><a class="btn btn-primary" href="${lessonHref(start)}">Start with “${esc(start.title)}” <span aria-hidden="true">→</span></a></div>` : ""}
  ${buildsOn.length ? `<p class="builds-on"><span>Builds on</span>${buildsOn.map(t => `<a class="chip-link" href="${trackHref(t)}">${esc(t.number)} ${esc(t.title)}</a>`).join("")}</p>` : ""}
  ${notice}
  ${extrasBox}
  ${roadmap}
  <nav class="pager" aria-label="Other tracks">${prev ? `<a href="${trackHref(prev)}">← ${esc(prev.title)}</a>` : "<span></span>"}${next ? `<a href="${trackHref(next)}">${esc(next.title)} →</a>` : ""}</nav>
</section>`;
  }

  function legalPage() {
    return `<section class="page-narrow legal">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a> / <span>Legal</span></nav>
  <h1 id="landing-legal">Copyright &amp; permissions</h1>
  <p><strong>Copyright © 2026 ${esc(AUTHOR.name)}. All rights reserved.</strong></p>
  <p>GroundUp Lab is an educational project developed and curated by ${esc(AUTHOR.name)}, including its original lesson text, exercises, illustrations, interactive figures and project-specific software, subject to any applicable third-party rights.</p>
  <p><strong>No general reuse licence is granted.</strong> You are welcome to read and study the material on this site for personal learning. Unless a separate licence applies, permission is required to reproduce, redistribute, modify, or incorporate the original GroundUp Lab materials or code into another project or course. To ask for permission, contact the author on <a href="${AUTHOR.linkedin}" target="_blank" rel="noopener">LinkedIn</a> or <a href="${AUTHOR.github}" target="_blank" rel="noopener">GitHub (${esc(AUTHOR.handle)})</a>.</p>
  <h2>Third-party materials</h2>
  <p>University course names, lecture references, research papers, external libraries (including Marked, DOMPurify, KaTeX, Mermaid and Pyodide), fonts, datasets and other third-party material remain the property of their respective rights holders and are governed by their own licences and terms. No ownership is claimed over them.</p>
  <h2>AI assistance</h2>
  <p>Parts of GroundUp Lab were written or coded with AI assistance and reviewed by the author. Copyright eligibility depends on applicable law and the nature of human authorship; this notice does not assert exclusive rights over material that is not legally copyrightable.</p>
  <h2 id="landing-legal-privacy">Privacy</h2>
  <p>There are no accounts and no analytics on this site. Reading progress, notes, code you write in the labs, and tutor threads are stored only in your browser's local storage, and clearing site data removes them. Fonts and rendering libraries are loaded from public CDNs (Google Fonts, jsDelivr), which receive standard request information. If you connect a model for the Pro AI tutor, your API key is stored in your browser and sent only to the endpoint you choose, along with the passage and question you ask about.</p>
  <h2 id="landing-legal-disclaimer">Disclaimer</h2>
  <p>The material is provided for education, as is, without warranty of any kind. Much of the library is still under development: pages may change, contain errors, or be reorganised. Self-assessment features such as "I have read this lesson", answer checks and passing tests are study aids, not certification of mastery. AI tutor responses can be wrong; verify them against the lesson.</p>
  <p class="fine">Last updated October 2026.</p>
</section>`;
  }

  function wireLanding(root) {
    const chips = [...root.querySelectorAll(".roadmap .chip")];
    chips.forEach(chip => chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      chips.forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
      root.querySelectorAll(".track-card").forEach(card => {
        card.hidden = filter !== "all" && card.dataset.status !== filter;
      });
    }));
  }

  function scrollTo(id) {
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView({block: "start"});
    else window.scrollTo(0, 0);
  }

  /* Back to the lesson reader: hide the landing and status pages. */
  function leave() {
    document.body.classList.remove("view-site");
    document.getElementById("landing").hidden = true;
    document.getElementById("page").hidden = true;
    document.querySelectorAll(".site-nav a").forEach(a => {
      if (a.dataset.route === "library") a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  /* Returns true when the route is a site page (not a lesson). */
  function render(route, data) {
    const landingNode = document.getElementById("landing"), page = document.getElementById("page");
    let mode = null, anchor = null;
    if (!route || LANDING_SECTIONS.includes(route)) { mode = "landing"; anchor = !route || route === "home" ? null : "landing-" + route; }
    else if (route === "legal" || route.startsWith("legal-")) { mode = "legal"; anchor = route === "legal" ? null : "landing-" + route; }
    else if (route.startsWith("track/")) mode = "track";
    const active = mode === "landing" ? (route || "home") : mode === "track" ? "curriculum" : mode === "legal" ? "" : "library";
    document.querySelectorAll(".site-nav a").forEach(a => {
      if (a.dataset.route === active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (!mode) { leave(); return false; }
    document.body.classList.add("view-site");
    if (mode === "landing") {
      if (landingNode.dataset.rendered !== "yes") {
        landingNode.innerHTML = landing(data);
        landingNode.dataset.rendered = "yes";
        wireLanding(landingNode);
      }
      landingNode.hidden = false; page.hidden = true;
      document.title = "GroundUp Lab — Learn AI from the ground up";
    } else {
      page.innerHTML = mode === "legal" ? legalPage() : trackPage(data, decodeURIComponent(route.slice(6)));
      page.hidden = false; landingNode.hidden = true;
      const h1 = page.querySelector("h1");
      document.title = (h1 ? h1.childNodes[0].textContent.trim() : "GroundUp Lab") + " — GroundUp Lab";
    }
    requestAnimationFrame(() => scrollTo(anchor));
    return true;
  }

  function lessonBanner(lesson, data) {
    const track = tracksOf(data).find(t => t.id === lesson.trackId);
    const trackLink = track ? `<a href="#track/${encodeURIComponent(track.id)}">${esc(track.title)}</a>` : "this track";
    if (lesson.status === "preview")
      return `<span class="status-badge status-in-development">Under development</span><p><strong>Early version.</strong> This page is an introductory overview that is being expanded into a full lesson with derivations, figures and checked exercises. Expect changes. See what else is published in ${trackLink}.</p>`;
    if (track && track.status === "in-development")
      return `<span class="status-badge status-in-development">Track in development</span><p>This lesson is complete; more lessons in ${trackLink} are on the way.</p>`;
    return "";
  }

  window.GroundUpSite = {render, leave, lessonBanner, tracksOf, badge, STATUS};
})();
