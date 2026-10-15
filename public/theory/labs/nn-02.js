/* ===========================================================================
   labs/nn-02.js — NN02 "What a network can represent".

   Ten activities: overview/progress, Karnaugh maps, parity three ways, exact
   checkerboards, polygon nets and bottlenecks, universal approximation by
   ridges, cylinder tails, the sawtooth depth separation, code katas, paper
   problems and the review quiz.

   Each lab registers with GU.lab(id, host => …). State lives in localStorage
   under "nn02:"; every read and write is guarded so private windows still work.
   The math core (k-map, network builders, formulas) is pure and is exercised
   by scripts/check-nn02-math.mjs.
   =========================================================================== */
(function () {
  "use strict";
  var GU = window.GU = window.GU || {};
  if (!GU.lab) return;

  /* ------------------------------------------------------------ styling -- */
  var CSS = [
    ".nn2{--n-bg:var(--surface);--n-surface:var(--paper);--n-surface2:var(--surface-2);--n-ink:var(--ink);--n-muted:var(--ink-2);--n-line:var(--rule);",
    "--n-fire:#C2185B;--n-fire-soft:#F6D7E3;--n-calm:#1A7884;--n-calm-soft:#D2EBEE;--n-warn:#C27500;--n-ok:#2E7D32;--n-bad:#C62828;--n-violet:#6A4FB3;--n-code:var(--surface-2);",
    "font-family:var(--sans);font-size:14.5px;line-height:1.55;color:var(--n-ink);padding:16px 18px 18px}",
    ":root[data-theme='dark'] .nn2{--n-fire:#FF5996;--n-fire-soft:#4A1E33;--n-calm:#4CC0CD;--n-calm-soft:#153C43;--n-warn:#F2A93B;--n-ok:#6FCB74;--n-bad:#FF6B6B;--n-violet:#A993F0}",
    "@media (prefers-color-scheme:dark){:root:not([data-theme='light']) .nn2{--n-fire:#FF5996;--n-fire-soft:#4A1E33;--n-calm:#4CC0CD;--n-calm-soft:#153C43;--n-warn:#F2A93B;--n-ok:#6FCB74;--n-bad:#FF6B6B;--n-violet:#A993F0}}",
    ".nn2 p{margin:.5em 0}.nn2 h3{font:600 15px/1.3 var(--sans);margin:18px 0 6px}.nn2 a{color:var(--n-calm)}",
    ".nn2 code{font-family:var(--mono);font-size:.88em;background:var(--n-code);padding:.05em .3em;border-radius:3px}",
    ".nn2 .intro{max-width:72ch;margin:0 0 6px}.nn2 .intro.muted{color:var(--n-muted)}",
    ".nn2 .bench{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;margin-top:14px;align-items:start}",
    ".nn2 .bench.wide-left{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}",
    ".nn2 .bench>*{min-width:0}",
    ".nn2 .npanel{background:var(--n-surface);border:1px solid var(--n-line);border-radius:8px;padding:14px}",
    ".nn2 .plot{width:100%;max-width:560px}",
    ".nn2 .plot canvas{display:block;border-radius:6px;background:var(--n-surface);border:1px solid var(--n-line);touch-action:manipulation}",
    ".nn2 .cap{font-size:12.5px;color:var(--n-muted);margin-top:6px}",
    ".nn2 .btn{font:500 13px var(--sans);color:var(--n-ink);background:transparent;border:1px solid var(--n-ink);padding:6px 12px;border-radius:5px;cursor:pointer}",
    ".nn2 .btn:hover{background:var(--n-surface2);color:var(--n-ink)}",
    ".nn2 .btn.primary{background:var(--n-ink);color:var(--n-surface)}.nn2 .btn.primary:hover{opacity:.9;color:var(--n-surface)}",
    ".nn2 .btn.small{padding:3px 9px;font-size:12px}",
    ".nn2 .btn[aria-pressed='true']{background:var(--n-fire);border-color:var(--n-fire);color:#fff}",
    ".nn2 .btn:disabled{opacity:.45;cursor:default}",
    ".nn2 .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}",
    ".nn2 label.ctl{display:grid;grid-template-columns:104px minmax(0,1fr) 64px;gap:10px;align-items:center;font-size:13px;margin:6px 0}",
    ".nn2 label.ctl output{font-family:var(--mono);font-size:12.5px;text-align:right}",
    ".nn2 input[type=range]{width:100%;accent-color:var(--n-fire)}",
    ".nn2 select{font:inherit;font-size:13px;color:var(--n-ink);background:var(--n-surface);border:1px solid var(--n-line);border-radius:5px;padding:5px 8px;max-width:100%}",
    ".nn2 input.num{font:inherit;font-size:13px;width:96px;color:var(--n-ink);background:var(--n-surface);border:1px solid var(--n-line);border-radius:5px;padding:4px 7px}",
    ".nn2 .readout{font-family:var(--mono);font-size:12.5px;background:var(--n-surface2);border-radius:5px;padding:9px 11px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.5}",
    ".nn2 .status{font-weight:600}.nn2 .status.ok{color:var(--n-ok)}.nn2 .status.bad{color:var(--n-bad)}.nn2 .status.meh{color:var(--n-warn)}",
    ".nn2 .quiz{margin-top:20px;max-width:780px}.nn2 .quiz h3{margin-top:0}",
    ".nn2 .q{padding:12px 0;border-top:1px solid var(--n-line)}.nn2 .q-text{margin:0 0 8px;font-weight:500}",
    ".nn2 .q-n{font-family:var(--mono);color:var(--n-muted);margin-right:10px;font-weight:400}",
    ".nn2 .q-opts{display:grid;gap:6px}",
    ".nn2 .opt{text-align:left;font:inherit;font-size:13.5px;color:var(--n-ink);background:var(--n-surface);border:1px solid var(--n-line);border-radius:6px;padding:7px 11px;cursor:pointer}",
    ".nn2 .opt:hover:not(:disabled){border-color:var(--n-ink);color:var(--n-ink)}.nn2 .opt:disabled{cursor:default;opacity:1}",
    ".nn2 .opt.right{border-color:var(--n-ok);background:color-mix(in srgb,var(--n-ok) 12%,var(--n-surface))}",
    ".nn2 .opt.wrong{border-color:var(--n-bad);background:color-mix(in srgb,var(--n-bad) 10%,var(--n-surface))}",
    ".nn2 .q-why{font-size:13px;color:var(--n-muted);margin:8px 0 0}",
    ".nn2 .quiz-foot{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:13px;color:var(--n-muted)}",
    ".nn2 table.tt{border-collapse:collapse;font-family:var(--mono);font-size:12.5px;margin-top:8px}",
    ".nn2 table.tt th,.nn2 table.tt td{padding:3px 9px;border-bottom:1px solid var(--n-line);text-align:center;background:none}",
    ".nn2 table.tt td.y{color:var(--n-ok)}.nn2 table.tt td.n{color:var(--n-bad)}.nn2 table.tt tr.cur td{background:var(--n-surface2)}",
    ".nn2 .chips{display:flex;flex-wrap:wrap;gap:6px}",
    ".nn2 .chip{font:500 12.5px var(--sans);border:1px solid var(--n-line);background:var(--n-surface);color:var(--n-ink);border-radius:999px;padding:4px 11px;cursor:pointer}",
    ".nn2 .chip[aria-pressed='true']{border-color:var(--n-ink);background:var(--n-ink);color:var(--n-surface)}",
    ".nn2 .chip.solved::after{content:' \\2713';color:var(--n-ok)}.nn2 .chip[aria-pressed='true'].solved::after{color:#9BE3A0}",
    ".nn2 .editor{width:100%;min-height:300px;font:400 12.5px/1.55 var(--mono);color:var(--n-ink);background:var(--n-code);border:1px solid var(--n-line);border-radius:6px;padding:11px;resize:vertical;tab-size:2;white-space:pre;overflow:auto;box-sizing:border-box}",
    ".nn2 .tests{list-style:none;padding:0;margin:8px 0;font-size:13px}",
    ".nn2 .tests li{padding:4px 0;border-bottom:1px solid var(--n-line);display:grid;grid-template-columns:22px 1fr;gap:6px}",
    ".nn2 .tests li.p::before{content:'\\2713';color:var(--n-ok);font-weight:700}.nn2 .tests li.f::before{content:'\\2717';color:var(--n-bad);font-weight:700}",
    ".nn2 .tests li small{grid-column:2;color:var(--n-muted);font-family:var(--mono);font-size:11.5px}",
    ".nn2 pre.sol{font:400 12px/1.5 var(--mono);background:var(--n-code);border:1px solid var(--n-line);border-radius:6px;padding:11px;overflow-x:auto;margin:8px 0;white-space:pre}",
    ".nn2 .notice{border-left:3px solid var(--n-warn);padding:8px 12px;background:var(--n-surface2);font-size:13px;margin:10px 0}",
    ".nn2 .pred{border-left:3px solid var(--n-fire);padding:8px 12px;background:var(--n-surface2);font-size:13.5px;margin:10px 0}",
    ".nn2 .pred p{margin:.3em 0}.nn2 .pred .pred-out{color:var(--n-ink)}",
    ".nn2 .limits{font-size:12.5px;color:var(--n-muted);border-top:1px dashed var(--n-line);padding-top:8px;margin-top:14px}",
    ".nn2 .sw{display:inline-block;width:12px;height:12px;border-radius:2px;margin-right:6px;vertical-align:-1px}",
    ".nn2 .legend{display:flex;flex-wrap:wrap;gap:14px;font-size:12.5px;color:var(--n-muted)}",
    ".nn2 .navlist{list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px}",
    ".nn2 .navlist button{width:100%;display:grid;grid-template-columns:24px 1fr 16px;text-align:left;font:13px var(--sans);color:var(--n-muted);background:var(--n-surface);border:1px solid var(--n-line);border-radius:6px;padding:6px 9px;cursor:pointer}",
    ".nn2 .navlist button .n{font-family:var(--mono);font-size:12px}.nn2 .navlist button.done{color:var(--n-ink)}",
    ".nn2 .navlist button.done::after{content:'\\2713';color:var(--n-ok);font-weight:600}",
    ".nn2 .bar{height:4px;background:var(--n-line);border-radius:2px;margin-top:6px;overflow:hidden}",
    ".nn2 .bar span{display:block;height:100%;width:0;background:var(--n-fire);transition:width .4s}",
    ".nn2 .netsvg{width:100%;height:auto;display:block;background:var(--n-surface);border:1px solid var(--n-line);border-radius:6px}",
    ".nn2 .netsvg text{font-family:var(--mono);font-size:11px;fill:var(--n-ink)}",
    ".nn2 .netsvg .edge{stroke:var(--n-line);stroke-width:1.3}.nn2 .netsvg .edge.neg{stroke:var(--n-calm);opacity:.55}.nn2 .netsvg .edge.on{stroke:var(--n-ink);opacity:1}",
    ".nn2 .netsvg .node{fill:var(--n-surface2);stroke:var(--n-ink);stroke-width:1.3}.nn2 .netsvg .node.on{fill:var(--n-fire)}.nn2 .netsvg .node.pass{stroke-dasharray:3 2}",
    ".nn2 .netsvg .w{font-size:10px;fill:var(--n-muted)}",
    ".nn2 table.kmap{border-collapse:separate;border-spacing:4px;font-family:var(--mono);font-size:12px}",
    ".nn2 table.kmap th{font-weight:500;color:var(--n-muted);padding:0 4px;background:none;border:none}",
    ".nn2 table.kmap td{padding:0;border:none;background:none}",
    ".nn2 .kc{width:54px;height:46px;border:1px solid var(--n-line);border-radius:6px;background:var(--n-surface);color:var(--n-ink);font:600 15px var(--mono);position:relative;cursor:pointer;padding:0}",
    ".nn2 .kc.on{background:var(--n-fire-soft);border-color:var(--n-fire)}",
    ".nn2 .kc .ix{position:absolute;left:4px;top:2px;font:400 10px var(--mono);color:var(--n-muted)}",
    ".nn2 .kc .dots{position:absolute;bottom:3px;left:0;right:0;display:flex;gap:2px;justify-content:center}",
    ".nn2 .kc .dots i{width:7px;height:7px;border-radius:50%;display:block}",
    ".nn2 .kc.hl{outline:3px solid var(--n-ink);outline-offset:1px}",
    ".nn2 .canrow{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:10px}",
    ".nn2 .canrow canvas{display:block;border-radius:6px;border:1px solid var(--n-line);background:var(--n-surface)}",
    ".nn2 .scroll{overflow-x:auto;max-width:100%}",
    "@media (max-width:820px){.nn2 .bench,.nn2 .bench.wide-left{grid-template-columns:minmax(0,1fr)}.nn2 .canrow{grid-template-columns:minmax(0,1fr)}.nn2 .kc{width:44px;height:40px}.nn2 label.ctl{grid-template-columns:88px minmax(0,1fr) 56px}}"
  ].join("\n");
  function injectCSS() {
    if (document.getElementById("nn2-style")) return;
    var s = document.createElement("style");
    s.id = "nn2-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------- helpers -- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("nn02:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("nn02:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function debounce(f, ms) { var t; return function () { var a = arguments; clearTimeout(t); t = setTimeout(function () { f.apply(null, a); }, ms); }; }
  function theme(elm) {
    var s = getComputedStyle(elm); var g = function (n) { return s.getPropertyValue(n).trim(); };
    return { surface: g("--n-surface"), surface2: g("--n-surface2"), ink: g("--n-ink"), muted: g("--n-muted"), line: g("--n-line"),
      fire: g("--n-fire"), fireSoft: g("--n-fire-soft"), calm: g("--n-calm"), calmSoft: g("--n-calm-soft"), warn: g("--n-warn"), ok: g("--n-ok"), bad: g("--n-bad"), violet: g("--n-violet") };
  }
  function rgb(h) {
    h = (h || "#000").trim();
    var m = h.match(/^rgba?\(([^)]+)\)/);
    if (m) { var p = m[1].split(/[ ,/]+/).map(parseFloat); return [p[0] | 0, p[1] | 0, p[2] | 0]; }
    h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h.slice(0, 6), 16); if (!isFinite(n)) return [128, 128, 128];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) { t = Math.max(0, Math.min(1, t)); return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; }
  function fit(cv, aspect) {
    var w = Math.max(200, cv.parentElement.clientWidth - 2), h = Math.round(w * aspect), d = window.devicePixelRatio || 1;
    cv.width = Math.round(w * d); cv.height = Math.round(h * d); cv.style.width = w + "px"; cv.style.height = h + "px";
    var ctx = cv.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0); return { ctx: ctx, w: w, h: h };
  }
  /* One resize/theme listener for every mounted lab; labs whose host has left the page are dropped. */
  var redraws = [];
  function onRedraw(host, f) { redraws.push({ host: host, f: f }); }
  var redrawAll = debounce(function () {
    redraws = redraws.filter(function (r) { return r.host.isConnected; });
    redraws.forEach(function (r) { try { r.f(); } catch (e) { console.error(e); } });
  }, 120);
  window.addEventListener("resize", redrawAll);
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redrawAll); } catch (e) {}
  try { new MutationObserver(redrawAll).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] }); } catch (e) {}
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var fmt = function (v, d) { return (Math.abs(v) < 5e-13 ? 0 : v).toFixed(d === undefined ? 2 : d); };
  function frame(w, h, x0, x1, y0, y1, pad) {
    pad = pad === undefined ? 8 : pad;
    var sx = (w - 2 * pad) / (x1 - x0), sy = (h - 2 * pad) / (y1 - y0);
    return { X: function (x) { return pad + (x - x0) * sx; }, Y: function (y) { return h - pad - (y - y0) * sy; },
      ix: function (px) { return x0 + (px - pad) / sx; }, iy: function (py) { return y0 + (h - pad - py) / sy; }, pad: pad };
  }
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function button(label, cls, onclick) { var b = el("button", cls || "btn small", label); b.type = "button"; if (onclick) b.onclick = onclick; return b; }
  function monoFont() { return getComputedStyle(document.documentElement).getPropertyValue("--mono") || "monospace"; }
  /* Paint a G1×G2 image of colours onto the whole canvas. */
  function paintImage(ctx, w, h, G1, G2, colourAt) {
    var img = new ImageData(G1, G2);
    for (var j = 0; j < G2; j++) for (var i = 0; i < G1; i++) {
      var c = colourAt(i, j), k = 4 * (j * G1 + i);
      img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = 255;
    }
    var off = document.createElement("canvas"); off.width = G1; off.height = G2; off.getContext("2d").putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(off, 0, 0, w, h);
  }

  /* Every lab gets the reader's chrome (title + hint) and a scoped body. */
  function mountShell(host, title, hint, html) {
    injectCSS();
    host.innerHTML = '<div class="lab-head"><span class="lab-title"></span><span class="lab-hint"></span></div><div class="nn2"></div>';
    host.querySelector(".lab-title").textContent = title;
    host.querySelector(".lab-hint").textContent = hint || "";
    var body = host.querySelector(".nn2");
    body.innerHTML = html;
    return { body: body, $: function (s) { return body.querySelector(s); }, $$: function (s) { return Array.prototype.slice.call(body.querySelectorAll(s)); } };
  }

  /* A prediction prompt: the outcome stays hidden until the reader commits (or explicitly skips). */
  function predictBox(box, o) {
    box.className = "pred";
    box.innerHTML = "<p><strong>Predict first.</strong> " + o.q + '</p><div class="row" data-in></div><p class="pred-out" hidden></p>';
    var row = box.querySelector("[data-in]"), out = box.querySelector(".pred-out"), revealed = false;
    function show(guess, silent) {
      var ans = o.answer(); revealed = true; out.hidden = false;
      var ok = guess == null ? null : (o.choices ? guess === ans : Math.abs(guess - ans) <= (o.tol || 0));
      out.innerHTML = (guess == null ? "" : ok ? "<strong>Your prediction holds.</strong> " : "<strong>Not this time.</strong> ") + o.explain(guess, ans);
      if (o.onReveal && !silent) o.onReveal(ok);
    }
    if (o.choices) o.choices.forEach(function (c, i) { row.appendChild(button(c, "btn small", function () { show(i); })); });
    else {
      var inp = el("input", "num"); inp.type = "number"; inp.setAttribute("aria-label", "Your prediction"); row.appendChild(inp);
      row.appendChild(button("Check", "btn small primary", function () { if (inp.value !== "") show(+inp.value); }));
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && inp.value !== "") show(+inp.value); });
    }
    row.appendChild(button("Show without predicting", "btn small", function () { show(null); }));
    return {
      reset: function () { revealed = false; out.hidden = true; },
      revealed: function () { return revealed; },
      update: function () { if (revealed) show(null, true); }
    };
  }

  /* ------------------------------------------------------------ progress -- */
  var SECTIONS = [
    ["kmap", "Karnaugh maps"], ["parity", "Parity three ways"], ["checker", "Exact checkerboards"], ["polygon", "Polygons and bottlenecks"],
    ["uat", "Universal approximation"], ["cylinder", "Cylinder tails"], ["sawtooth", "The sawtooth"],
    ["katas", "Code katas"], ["problems", "Paper problems"], ["quiz", "Review quiz"]
  ];
  var LAB_OF = { kmap: "nn-kmap", parity: "nn-parity-builder", checker: "nn-checkerboard", polygon: "nn-polygon-net", uat: "nn-uat",
    cylinder: "nn-cylinder-tails", sawtooth: "nn-sawtooth", katas: "nn02-katas", problems: "nn02-problems", quiz: "nn02-quiz" };
  function progress() { return store.get("progress", {}); }
  function markDone(id) {
    var p = progress(); if (p[id]) return;
    p[id] = true; store.set("progress", p);
    window.dispatchEvent(new Event("nn02-progress"));
  }

  /* ---------------------------------------------------------------- quiz -- */
  function renderQuiz(container, title, qs, key, onComplete) {
    var revision = JSON.stringify(qs.map(function (q) { return [q.q, q.o, q.a]; }));
    var saved = store.get("quiz:" + key, {});
    if (store.get("quiz-revision:" + key, null) !== revision) {
      if (Object.keys(saved).length) store.set("quiz-previous:" + key, {revision: store.get("quiz-revision:" + key, null), answers: saved});
      saved = {}; store.set("quiz:" + key, saved); store.set("quiz-revision:" + key, revision);
    }
    container.innerHTML = "<h3>" + title + "</h3>";
    var boxes = [];
    var foot = el("div", "quiz-foot"), score = el("span"), reset = button("Reset answers");
    foot.append(score, reset);
    function update() {
      var answered = Object.keys(saved).length, right = qs.filter(function (q, i) { return saved[i] === q.a; }).length;
      score.textContent = answered ? right + " of " + qs.length + " correct" + (answered < qs.length ? ", " + (qs.length - answered) + " to go" : "") : qs.length + " questions";
      if (answered === qs.length && onComplete) onComplete(right);
    }
    qs.forEach(function (q, i) {
      var box = el("div", "q");
      box.innerHTML = '<p class="q-text"><span class="q-n">' + (i + 1) + "</span>" + q.q + '</p><div class="q-opts"></div><p class="q-why" hidden></p>';
      var opts = box.querySelector(".q-opts"), why = box.querySelector(".q-why");
      function answer(j, silent) {
        saved[i] = j;
        Array.prototype.forEach.call(opts.children, function (b, k) { b.disabled = true; if (k === q.a) b.classList.add("right"); if (k === j && j !== q.a) b.classList.add("wrong"); });
        why.hidden = false; why.innerHTML = (j === q.a ? "<strong>Correct.</strong> " : "<strong>Not quite.</strong> ") + q.why;
        if (!silent) store.set("quiz:" + key, saved);
        update();
      }
      q.o.forEach(function (o, j) { var b = el("button", "opt"); b.type = "button"; b.innerHTML = o; b.addEventListener("click", function () { answer(j, false); }); opts.appendChild(b); });
      boxes.push({ answer: answer }); container.appendChild(box);
    });
    container.appendChild(foot);
    reset.addEventListener("click", function () { saved = {}; store.set("quiz:" + key, saved); renderQuiz(container, title, qs, key, onComplete); });
    boxes.forEach(function (b, i) { if (saved[i] != null) b.answer(saved[i], true); });
    update();
  }

  /* =========================================================================
     MATH CORE — pure functions, no DOM. Checked by scripts/check-nn02-math.mjs.
     ========================================================================= */

  /* ---- Karnaugh maps (4 inputs, row index = binary ABCD, A most significant) ---- */
  var KV = ["A", "B", "C", "D"];
  var GRAY = [0, 1, 3, 2];
  function patRows(p) { // p: array of 4 entries in {0,1,2}; 2 = free
    var rows = [];
    for (var r = 0; r < 16; r++) {
      var ok = true;
      for (var v = 0; v < 4; v++) { var bit = (r >> (3 - v)) & 1; if (p[v] !== 2 && p[v] !== bit) { ok = false; break; } }
      if (ok) rows.push(r);
    }
    return rows;
  }
  function patString(p) { return p.map(function (c) { return c === 2 ? "-" : String(c); }).join(""); }
  function patTerm(p) {
    var s = "";
    p.forEach(function (c, v) { if (c === 1) s += KV[v]; else if (c === 0) s += KV[v] + "̄"; });
    return s || "1";
  }
  function isImplicant(truth, p) { var rows = patRows(p); return rows.length > 0 && rows.every(function (r) { return truth[r]; }); }
  /* Every one of the 3^4 patterns is tested; an implicant is prime when no fixed position can be freed. */
  function primeImplicants(truth) {
    var out = [];
    for (var code = 0; code < 81; code++) {
      var p = [], c = code;
      for (var v = 0; v < 4; v++) { p.unshift(c % 3); c = Math.floor(c / 3); }
      if (!isImplicant(truth, p)) continue;
      var prime = p.every(function (x, v) { if (x === 2) return true; var q = p.slice(); q[v] = 2; return !isImplicant(truth, q); });
      if (prime) {
        var rows = patRows(p), mask = 0; rows.forEach(function (r) { mask |= 1 << r; });
        out.push({ pat: patString(p), p: p, term: patTerm(p), rows: rows, mask: mask, lits: p.filter(function (x) { return x !== 2; }).length });
      }
    }
    out.sort(function (a, b) { return a.lits - b.lits || (a.pat < b.pat ? 1 : -1); });
    return out;
  }
  function essentialPIs(truth, pis) {
    var ess = [];
    for (var r = 0; r < 16; r++) {
      if (!truth[r]) continue;
      var cov = pis.filter(function (pi) { return pi.mask & (1 << r); });
      if (cov.length === 1 && ess.indexOf(cov[0]) < 0) ess.push(cov[0]);
    }
    return ess;
  }
  /* Exact minimum cover by branch and bound over the prime implicants; also collects every minimum cover. */
  function minCovers(truth, pis) {
    var need = 0; for (var r = 0; r < 16; r++) if (truth[r]) need |= 1 << r;
    if (!need) return { size: 0, covers: [[]] };
    var best = pis.length + 1, found = [];
    function rec(unc, chosen, start) {
      if (!unc) {
        if (chosen.length < best) { best = chosen.length; found = []; }
        if (chosen.length === best) found.push(chosen.slice());
        return;
      }
      if (chosen.length + 1 > best) return;
      var row = -1, cands = null;
      for (var r2 = 0; r2 < 16; r2++) if (unc & (1 << r2)) {
        var c = pis.filter(function (pi) { return pi.mask & (1 << r2); });
        if (!cands || c.length < cands.length) { cands = c; row = r2; }
      }
      cands.forEach(function (pi) { chosen.push(pi); rec(unc & ~pi.mask, chosen); chosen.pop(); });
    }
    rec(need, []);
    var seen = {}, covers = [];
    found.forEach(function (cv) { var k = cv.map(function (pi) { return pi.pat; }).sort().join("|"); if (!seen[k]) { seen[k] = 1; covers.push(cv); } });
    return { size: best, covers: covers };
  }
  /* One AND unit per term: +1 on plain literals, −1 on negated ones, bias −(number of plain literals). */
  function termUnit(p) {
    var w = p.map(function (c) { return c === 1 ? 1 : c === 0 ? -1 : 0; }), plain = p.filter(function (c) { return c === 1; }).length;
    return { w: w, b: -plain };
  }
  function kmapAnalyse(truth) {
    var trueRows = truth.reduce(function (s, v) { return s + (v ? 1 : 0); }, 0);
    var pis = primeImplicants(truth), ess = essentialPIs(truth, pis), mc = minCovers(truth, pis);
    return { trueRows: trueRows, plainUnits: trueRows + 1, pis: pis, essential: ess, cover: mc.covers[0], covers: mc.covers, coverSize: mc.size, reducedUnits: mc.size + 1 };
  }
  function truthFromRows(rows) { var t = new Array(16).fill(0); rows.forEach(function (r) { t[r] = 1; }); return t; }
  var KMAP_PRESETS = [
    ["Worked example", [0, 1, 2, 3, 5, 7, 8, 10, 13, 15]],
    ["Parity (failure)", [1, 2, 4, 7, 8, 11, 13, 14]],
    ["Constant 1 (degenerate)", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
    ["All zero (degenerate)", []],
    ["At least 3 of 4", [7, 11, 13, 14, 15]]
  ];

  /* ---- generic feedforward threshold networks ---- */
  // n inputs are nodes 0..n−1; units are listed in topological order and unit j is node n+j. The last unit is the output.
  function Net(n) { return { n: n, units: [] }; }
  function addUnit(net, src, w, b, tag) { net.units.push({ src: src, w: w, b: b, tag: tag || "" }); return net.n + net.units.length - 1; }
  function evalNet(net, x, buf) {
    var v = buf || new Float64Array(net.n + net.units.length), n = net.n, U = net.units;
    for (var i = 0; i < n; i++) v[i] = x[i];
    for (var j = 0; j < U.length; j++) { var u = U[j], z = u.b, s = u.src, w = u.w; for (var k = 0; k < s.length; k++) z += w[k] * v[s[k]]; v[n + j] = z >= 0 ? 1 : 0; }
    return v;
  }
  function netOut(net, x, buf) { var v = evalNet(net, x, buf); return net.units.length ? v[net.n + net.units.length - 1] : v[0]; }
  function netStats(net) {
    var n = net.n, N = n + net.units.length, depth = new Array(N).fill(0), conn = 0, layered = true;
    net.units.forEach(function (u, j) {
      var d = 0; u.src.forEach(function (s, k) { if (u.w[k] !== 0) { conn++; d = Math.max(d, depth[s]); } });
      depth[n + j] = d + 1;
    });
    net.units.forEach(function (u, j) { u.src.forEach(function (s, k) { if (u.w[k] !== 0 && depth[s] !== depth[n + j] - 1) layered = false; }); });
    var L = depth[N - 1], widths = [n];
    for (var l = 1; l <= L; l++) widths.push(0);
    for (var j2 = 0; j2 < net.units.length; j2++) widths[depth[n + j2]] = (widths[depth[n + j2]] || 0) + 1;
    var dense = null;
    if (layered) { dense = 0; for (var l2 = 1; l2 <= L; l2++) dense += widths[l2 - 1] * widths[l2] + widths[l2]; }
    return { units: net.units.length, connections: conn, biases: net.units.length, params: conn + net.units.length, depth: L, layered: layered, dense: dense, widths: widths, nodeDepth: depth };
  }
  function bitsOf(k, n) { var x = []; for (var j = 0; j < n; j++) x.push((k >> (n - 1 - j)) & 1); return x; }
  function popcount(k) { var c = 0; while (k) { c += k & 1; k >>= 1; } return c; }

  /* ---- parity constructions ---- */
  function xorBlock(net, a, b, kind) {
    if (kind === 2) { var h = addUnit(net, [a, b], [1, 1], -2, "AND"); return addUnit(net, [a, b, h], [1, 1, -2], -1, "XOR"); }
    var o = addUnit(net, [a, b], [1, 1], -1, "OR"), q = addUnit(net, [a, b], [-1, -1], 1, "NAND");
    return addUnit(net, [o, q], [1, 1], -2, "AND");
  }
  /* Pairing rule: pair values in order; an odd value is carried to the next round.
     In the layered version each waiting round costs two pass-through units θ(x − ½). */
  function xorTree(net, leaves, kind, layered) {
    var vals = leaves.slice();
    while (vals.length > 1) {
      var next = [];
      for (var i = 0; i + 1 < vals.length; i += 2) next.push(xorBlock(net, vals[i], vals[i + 1], kind));
      if (vals.length % 2) {
        var v = vals[vals.length - 1];
        if (layered) { v = addUnit(net, [v], [1], -0.5, "pass"); v = addUnit(net, [v], [1], -0.5, "pass"); }
        next.push(v);
      }
      vals = next;
    }
    return vals[0];
  }
  var PARITY_KINDS = [
    ["dnf", "DNF: AND per odd row, then OR"], ["count", "counting units"], ["tree3", "tree of three-unit XOR blocks"],
    ["tree2", "tree of two-unit XOR blocks (skips)"], ["ltree", "layered three-unit tree (pass-through)"], ["one", "one threshold unit (attempt)"]
  ];
  function parityNet(n, kind, single) {
    var net = Net(n), ins = []; for (var i = 0; i < n; i++) ins.push(i);
    if (kind === "dnf") {
      var ands = [];
      for (var r = 0; r < (1 << n); r++) {
        if (popcount(r) % 2 === 0) continue;
        var x = bitsOf(r, n), w = x.map(function (b) { return b ? 1 : -1; });
        ands.push(addUnit(net, ins.slice(), w, -popcount(r), "AND"));
      }
      addUnit(net, ands, ands.map(function () { return 1; }), -1, "OR");
    } else if (kind === "count") {
      var cs = [];
      for (var k = 1; k <= n; k++) cs.push(addUnit(net, ins.slice(), ins.map(function () { return 1; }), -k, "c" + k));
      addUnit(net, cs, cs.map(function (_, i2) { return i2 % 2 ? -1 : 1; }), -1, "out");
    } else if (kind === "tree3") xorTree(net, ins, 3, false);
    else if (kind === "tree2") xorTree(net, ins, 2, false);
    else if (kind === "ltree") xorTree(net, ins, 3, true);
    else if (kind === "one") { var s = single || bestSingleUnit(n); addUnit(net, ins.slice(), s.w.slice(), s.b, "unit"); }
    return net;
  }
  function parityCheck(net, n) {
    var buf = new Float64Array(net.n + net.units.length), right = 0;
    for (var r = 0; r < (1 << n); r++) if (netOut(net, bitsOf(r, n), buf) === popcount(r) % 2) right++;
    return { right: right, total: 1 << n };
  }
  /* The best single threshold unit with weights in {−1,0,1} and integer bias, by exhaustive search (n ≤ 6).
     Whatever weights are used, fixing x₃…xₙ reduces the unit to one on (x₁,x₂) that must compute XOR or XNOR. */
  function bestSingleUnit(n) {
    var best = { w: new Array(n).fill(0), b: 0, right: -1 };
    if (n > 6) { best.w = new Array(n).fill(1); best.b = -1; best.right = null; return best; }
    var total = Math.pow(3, n), X = [], P = [];
    for (var r = 0; r < (1 << n); r++) { X.push(bitsOf(r, n)); P.push(popcount(r) % 2); }
    for (var code = 0; code < total; code++) {
      var w = [], c = code; for (var i = 0; i < n; i++) { w.push((c % 3) - 1); c = Math.floor(c / 3); }
      for (var b = -n; b <= n; b++) {
        var right = 0;
        for (var r2 = 0; r2 < X.length; r2++) { var z = b; for (var i2 = 0; i2 < n; i2++) z += w[i2] * X[r2][i2]; if ((z >= 0 ? 1 : 0) === P[r2]) right++; }
        if (right > best.right) best = { w: w.slice(), b: b, right: right };
      }
    }
    return best;
  }

  /* ---- exact checkerboards: a vertical lines x₁ = i − ½, b horizontal lines x₂ = j − ½, window [0,a]×[0,b] ---- */
  function checkerTarget(a, b, x1, x2) {
    var k = 0, m = 0;
    for (var i = 1; i <= a; i++) if (x1 >= i - 0.5) k++;
    for (var j = 1; j <= b; j++) if (x2 >= j - 0.5) m++;
    return (k + m) % 2;
  }
  function altSigns(n) { var s = []; for (var i = 0; i < n; i++) s.push(i % 2 ? -1 : 1); return s; }
  var CHECKER_KINDS = [["and", "one AND per cell, then OR"], ["count", "count, then compare (layered)"], ["skip", "count, with a skip connection"],
    ["xor", "XOR tree over the line units"], ["shallow", "one hidden layer (adversarial)"]];
  function checkerNet(a, b, kind, sh) {
    var net = Net(2), v = [], u = [];
    for (var i = 1; i <= a; i++) v.push(addUnit(net, [0], [1], -(i - 0.5), "v" + i));
    for (var j = 1; j <= b; j++) u.push(addUnit(net, [1], [1], -(j - 0.5), "u" + j));
    var lines = v.concat(u), alt = altSigns(a).concat(altSigns(b));
    if (kind === "and") {
      var ands = [];
      for (var k = 0; k <= a; k++) for (var m = 0; m <= b; m++) {
        if ((k + m) % 2 === 0) continue;
        var src = [], w = [], plain = 0;
        if (k >= 1) { src.push(v[k - 1]); w.push(1); plain++; }
        if (k < a) { src.push(v[k]); w.push(-1); }
        if (m >= 1) { src.push(u[m - 1]); w.push(1); plain++; }
        if (m < b) { src.push(u[m]); w.push(-1); }
        ands.push(addUnit(net, src, w, -plain, "cell"));
      }
      addUnit(net, ands, ands.map(function () { return 1; }), -1, "OR");
    } else if (kind === "count") {
      var A = addUnit(net, lines, alt, -1, "A"), B = addUnit(net, lines, alt, -2, "B");
      addUnit(net, [A, B], [1, -1], -1, "out");
    } else if (kind === "skip") {
      var c = addUnit(net, lines, alt, -2, "c");
      addUnit(net, lines.concat([c]), alt.concat([-2]), -1, "out");
    } else if (kind === "xor") xorTree(net, lines, 3, false);
    else if (kind === "shallow") {
      sh = sh || { alpha: altSigns(a), beta: altSigns(b), gamma: -1 };
      addUnit(net, lines, sh.alpha.concat(sh.beta), sh.gamma, "out");
    }
    return net;
  }
  function checkerFormula(a, b) {
    var odd = 0; for (var k = 0; k <= a; k++) for (var m = 0; m <= b; m++) if ((k + m) % 2) odd++;
    var n = a + b;
    return { and: n + odd + 1, count: n + 3, skip: n + 2, xor: n + 3 * (n - 1), xorDepth: 1 + 2 * Math.ceil(Math.log2(n) - 1e-12), oddCells: odd };
  }
  function cellEdges(a) { var e = [0]; for (var i = 1; i <= a; i++) e.push(i - 0.5); e.push(a); return e; }
  /* Exact mismatched area: every unit is constant on each cell, so evaluating the cell centre is exact. */
  function checkerMismatch(net, a, b) {
    var ex = cellEdges(a), ey = cellEdges(b), bad = 0, buf = new Float64Array(net.n + net.units.length), wrongCells = [];
    for (var i = 0; i + 1 < ex.length; i++) for (var j = 0; j + 1 < ey.length; j++) {
      var cx = (ex[i] + ex[i + 1]) / 2, cy = (ey[j] + ey[j + 1]) / 2;
      if (netOut(net, [cx, cy], buf) !== checkerTarget(a, b, cx, cy)) { bad += (ex[i + 1] - ex[i]) * (ey[j + 1] - ey[j]); wrongCells.push([i, j]); }
    }
    return { area: bad, total: a * b, wrongCells: wrongCells };
  }
  /* Boundary probes: points exactly on the lines and at every crossing (θ(0) = 1 puts them on the far side). */
  function checkerProbes(a, b) {
    var pts = [];
    for (var i = 1; i <= a; i++) for (var j = 0; j <= 2 * b; j++) pts.push([i - 0.5, j / 2]);
    for (var j2 = 1; j2 <= b; j2++) for (var i2 = 0; i2 <= 2 * a; i2++) pts.push([i2 / 2, j2 - 0.5]);
    return pts;
  }
  function checkerProbeScore(net, a, b) {
    var pts = checkerProbes(a, b), buf = new Float64Array(net.n + net.units.length), ok = 0;
    pts.forEach(function (p) { if (netOut(net, p, buf) === checkerTarget(a, b, p[0], p[1])) ok++; });
    return { ok: ok, total: pts.length };
  }
  /* The crossing obstruction, observed: at each crossing, is some quarter-cell mislabelled? */
  function crossingFailures(net, a, b) {
    var buf = new Float64Array(net.n + net.units.length), fails = [], total = 0, e = 0.25;
    for (var i = 1; i <= a; i++) for (var j = 1; j <= b; j++) {
      total++;
      var px = i - 0.5, py = j - 0.5, wrong = false;
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (s) { var q = [px + s[0] * e, py + s[1] * e]; if (netOut(net, q, buf) !== checkerTarget(a, b, q[0], q[1])) wrong = true; });
      if (wrong) fails.push([px, py]);
    }
    return { fails: fails, total: total };
  }

  /* ---- polygon nets for the unit disc ---- */
  function circErr(N) { return N * Math.tan(Math.PI / N) - Math.PI; }
  function inscErr(N) { return Math.PI - (N / 2) * Math.sin(2 * Math.PI / N); }
  /* Best regular N-gon with apothem d ∈ [cos(π/N), 1]: disagreement = N d² tan(π/N) − π + 2N·seg(d),
     seg(d) = arccos d − d√(1−d²). Its derivative 2N(d tan(π/N) − 2√(1−d²)) is increasing, so a golden-section
     search finds the minimiser; it agrees with the root d* = 2/√(4 + tan²(π/N)). */
  function bestPolygon(N) {
    var t = Math.tan(Math.PI / N), f = function (d) { return N * d * d * t - Math.PI + 2 * N * (Math.acos(d) - d * Math.sqrt(1 - d * d)); };
    var lo = Math.cos(Math.PI / N), hi = 1, g = (Math.sqrt(5) - 1) / 2;
    var x1 = hi - g * (hi - lo), x2 = lo + g * (hi - lo), f1 = f(x1), f2 = f(x2);
    for (var it = 0; it < 200; it++) {
      if (f1 < f2) { hi = x2; x2 = x1; f2 = f1; x1 = hi - g * (hi - lo); f1 = f(x1); }
      else { lo = x1; x1 = x2; f1 = f2; x2 = lo + g * (hi - lo); f2 = f(x2); }
    }
    var d = (lo + hi) / 2;
    return { d: d, err: f(d), dStar: 2 / Math.sqrt(4 + t * t) };
  }
  function polyOffset(N, type) { return type === "circ" ? 1 : type === "insc" ? Math.cos(Math.PI / N) : bestPolygon(N).d; }
  function polyExact(N, type) { return type === "circ" ? circErr(N) : type === "insc" ? inscErr(N) : bestPolygon(N).err; }
  function polyAsym(N, type) { var a = Math.pow(Math.PI, 3) / (3 * N * N); return type === "circ" ? a : type === "insc" ? 2 * a : null; }
  function inPoly(N, d, x, y) { for (var k = 0; k < N; k++) { var p = 2 * Math.PI * k / N; if (x * Math.cos(p) + y * Math.sin(p) > d) return false; } return true; }
  /* Sampled estimate of the disagreement area on the window [−1.5,1.5]² (area 9). */
  function polyGrid(N, type, G) {
    var d = polyOffset(N, type), bad = 0, R = 1.5;
    for (var i = 0; i < G; i++) for (var j = 0; j < G; j++) {
      var x = -R + 2 * R * (i + 0.5) / G, y = -R + 2 * R * (j + 0.5) / G;
      if (inPoly(N, d, x, y) !== (x * x + y * y <= 1)) bad++;
    }
    return bad / (G * G) * (2 * R) * (2 * R);
  }
  function smallestN(eps, type) { for (var N = 3; N < 200000; N++) if (polyExact(N, type) <= eps) return N; return null; }

  /* ---- bottlenecks: an a+a checkerboard on [0,a+1]² with candidate lines at 1..a ---- */
  /* Exact irreducible error for axis-parallel first-layer lines: each code region is an x-interval × y-interval. */
  function bottleneck(a, xs, ys) {
    var W = a + 1;
    function cuts(list) {
      var c = list.filter(function (p) { return p > 0 && p < W; }).slice().sort(function (p, q) { return p - q; });
      var out = [0]; c.forEach(function (p) { if (p !== out[out.length - 1]) out.push(p); }); out.push(W); return out;
    }
    var bx = cuts(xs), by = cuts(ys), regions = [], floor = 0;
    for (var i = 0; i + 1 < bx.length; i++) for (var j = 0; j + 1 < by.length; j++) {
      var A1 = 0, A0 = 0;
      for (var ci = 0; ci <= a; ci++) for (var cj = 0; cj <= a; cj++) {
        var ox = Math.max(0, Math.min(bx[i + 1], ci + 1) - Math.max(bx[i], ci)), oy = Math.max(0, Math.min(by[j + 1], cj + 1) - Math.max(by[j], cj));
        var ar = ox * oy; if (!ar) continue;
        if ((ci + cj) % 2) A1 += ar; else A0 += ar;
      }
      regions.push({ x0: bx[i], x1: bx[i + 1], y0: by[j], y1: by[j + 1], A1: A1, A0: A0, label: A1 >= A0 ? 1 : 0 });
      floor += Math.min(A1, A0);
    }
    return { codes: regions.length, floor: floor, area: W * W, agreement: 1 - floor / (W * W), regions: regions };
  }

  /* ---- universal approximation by ridges on [−1,1]² ---- */
  // Each ridge: coefficient c, direction a, one-variable g on [lo,hi], Lipschitz constant lip and max|g″| = g2 there.
  var UAT_T = {
    xy: { name: "xy", f: function (x, y) { return x * y; }, ridges: [
      { a: [1, 1], c: 1, g: function (t) { return t * t / 4; }, lo: -2, hi: 2, lip: 1, g2: 0.5 },
      { a: [1, -1], c: -1, g: function (t) { return t * t / 4; }, lo: -2, hi: 2, lip: 1, g2: 0.5 }] },
    diff: { name: "x² − y²", f: function (x, y) { return x * x - y * y; }, ridges: [
      { a: [1, 0], c: 1, g: function (t) { return t * t; }, lo: -1, hi: 1, lip: 2, g2: 2 },
      { a: [0, 1], c: -1, g: function (t) { return t * t; }, lo: -1, hi: 1, lip: 2, g2: 2 }] },
    sum: { name: "x² + y²", f: function (x, y) { return x * x + y * y; }, ridges: [
      { a: [1, 0], c: 1, g: function (t) { return t * t; }, lo: -1, hi: 1, lip: 2, g2: 2 },
      { a: [0, 1], c: 1, g: function (t) { return t * t; }, lo: -1, hi: 1, lip: 2, g2: 2 }] },
    xy2: { name: "xy²", f: function (x, y) { return x * y * y; }, ridges: [
      { a: [1, 1], c: 1, g: function (t) { return t * t * t / 6; }, lo: -2, hi: 2, lip: 2, g2: 2 },
      { a: [1, -1], c: 1, g: function (t) { return t * t * t / 6; }, lo: -2, hi: 2, lip: 2, g2: 2 },
      { a: [1, 0], c: 1, g: function (t) { return -t * t * t / 3; }, lo: -1, hi: 1, lip: 1, g2: 2 }] }
  };
  /* Step skyline with midpoint heights and the endpoint correction: K blocks become K+1 threshold units.
     ReLU interpolant at K+1 equally spaced knots: K ReLU units plus a constant. */
  function buildRidge(r, act, K) {
    var D = (r.hi - r.lo) / K, units = [], c0 = 0;
    if (act === "step") {
      var prev = 0;
      for (var i = 0; i < K; i++) { var h = r.g(r.lo + (i + 0.5) * D); units.push({ T: r.lo + i * D, c: h - prev }); prev = h; }
      units.push({ T: r.hi, c: r.g(r.hi) - prev });
    } else {
      c0 = r.g(r.lo); var sPrev = 0;
      for (var i2 = 0; i2 < K; i2++) {
        var s = (r.g(r.lo + (i2 + 1) * D) - r.g(r.lo + i2 * D)) / D;
        units.push({ T: r.lo + i2 * D, c: s - sPrev }); sPrev = s;
      }
    }
    return { a: r.a, c: r.c, c0: c0, units: units };
  }
  function uatNet(key, act, K) {
    var T = UAT_T[key], ridges = T.ridges.map(function (r) { return buildRidge(r, act, K); });
    return { key: key, act: act, K: K, ridges: ridges, hidden: ridges.reduce(function (s, r) { return s + r.units.length; }, 0) };
  }
  function uatEval(net, x, y) {
    var total = 0, relu = net.act !== "step";
    for (var q = 0; q < net.ridges.length; q++) {
      var r = net.ridges[q], t = r.a[0] * x + r.a[1] * y, s = r.c0;
      for (var i = 0; i < r.units.length; i++) { var z = t - r.units[i].T; s += r.units[i].c * (relu ? (z > 0 ? z : 0) : (z >= 0 ? 1 : 0)); }
      total += r.c * s;
    }
    return total;
  }
  function uatBound(key, act, K) {
    return UAT_T[key].ridges.reduce(function (s, r) { var D = (r.hi - r.lo) / K; return s + Math.abs(r.c) * (act === "step" ? r.lip * D / 2 : D * D / 8 * r.g2); }, 0);
  }
  /* Largest error on a G×G grid of [lo,hi]²: a sampled estimate, not the true supremum. */
  function uatMeasure(net, G, lo, hi) {
    var f = UAT_T[net.key].f, mx = 0, inBox = 0;
    for (var i = 0; i < G; i++) for (var j = 0; j < G; j++) {
      var x = lo + (hi - lo) * i / (G - 1), y = lo + (hi - lo) * j / (G - 1), e = Math.abs(uatEval(net, x, y) - f(x, y));
      if (e > mx) mx = e;
      if (Math.abs(x) <= 1 && Math.abs(y) <= 1 && e > inBox) inBox = e;
    }
    return { max: mx, inBox: inBox };
  }
  /* The z² failure: D[e] = −⅔e(−1) + ⁴⁄₃e(−½) − ⁴⁄₃e(½) + ⅔e(1) is 1 for e = x³ − q whenever q is quadratic. */
  function cubeDivided(q) { var e = function (x) { return x * x * x - q(x); }; return -2 / 3 * e(-1) + 4 / 3 * e(-0.5) - 4 / 3 * e(0.5) + 2 / 3 * e(1); }

  /* ---- cylinder tails ---- */
  /* Fraction of the edge units of a disc (centre (cx,0), radius ρ) that fire at (px,py).
     N = 0 is the limit ½ + arcsin(ρ/r)/π; finite N counts tangent lines with r·cos(α − φ_k) ≤ ρ. */
  function cylFrac(px, py, cx, rho, N) {
    var dx = px - cx, dy = py, r = Math.sqrt(dx * dx + dy * dy);
    if (r <= rho) return 1;
    if (!N) return 0.5 + Math.asin(rho / r) / Math.PI;
    var beta = Math.acos(rho / r), alpha = Math.atan2(dy, dx), s = N / (2 * Math.PI);
    var failing = Math.ceil((alpha + beta) * s) - Math.floor((alpha - beta) * s) - 1;
    return (N - failing) / N;
  }
  function cylExcess(px, py, K, rho, s, N) { var t = 0; for (var j = 0; j < K; j++) t += cylFrac(px, py, j * s, rho, N) - 0.5; return t; }
  function cylGap(K, rho, s, N) { return cylExcess(s / 2, 0, K, rho, s, N); }
  function cylFirstFire(rho, s, N, cap) {
    cap = cap || 2000000; var t = 0;
    for (var K = 1; K <= cap; K++) { t += cylFrac(s / 2, 0, (K - 1) * s, rho, N) - 0.5; if (t >= 0.5) return K; }
    return null;
  }

  /* ---- the sawtooth ---- */
  function tent(x) { return 2 * Math.min(x, 1 - x); }
  function sawK(x, k) { for (var i = 0; i < k; i++) x = tent(x); return x; }
  /* Lemma 1: k hidden layers of width 2, each computing ReLU(z) and ReLU(z − ½); 2k units. */
  function deepSaw(k, x, relu) {
    relu = relu || function (z) { return z > 0 ? z : 0; };
    var z = x; for (var i = 0; i < k; i++) z = 2 * relu(z) - 4 * relu(z - 0.5);
    return z;
  }
  /* One-hidden-layer candidate: the ReLU interpolant of t^∘k at m+1 equally spaced knots (m units). */
  function sawInterp(k, m) {
    var c0 = sawK(0, k), units = [], prev = 0;
    for (var i = 0; i < m; i++) { var s = (sawK((i + 1) / m, k) - sawK(i / m, k)) * m; units.push({ t: i / m, c: s - prev }); prev = s; }
    return { c0: c0, units: units, nonzero: units.filter(function (u) { return Math.abs(u.c) > 1e-12; }).length };
  }
  function interpEval(I, x) { var s = I.c0; for (var i = 0; i < I.units.length; i++) { var z = x - I.units[i].t; if (z > 0) s += I.units[i].c * z; } return s; }
  function sawSamples(k, m) {
    var pts = [], G = 4096, p = 1 << k;
    for (var i = 0; i <= G; i++) pts.push(i / G);
    for (var j = 0; j <= p; j++) pts.push(j / p);
    for (var q = 0; q <= m; q++) pts.push(q / m);
    return pts;
  }
  function sawMaxErr(k, m) { var I = sawInterp(k, m), mx = 0; sawSamples(k, m).forEach(function (x) { mx = Math.max(mx, Math.abs(interpEval(I, x) - sawK(x, k))); }); return mx; }
  function sawSignChanges(k, m) {
    var I = sawInterp(k, m), p = 1 << k, c = 0, prev = interpEval(I, 0) - 0.5;
    for (var i = 1; i <= p; i++) { var v = interpEval(I, i / p) - 0.5; if (v * prev < 0) c++; prev = v; }
    return c;
  }

  /* ---- kata helpers: each helper counts its calls so a test can check the network's size ---- */
  function makeNeuron() {
    var calls = 0;
    var f = function (w, b, x) { calls++; var z = b; for (var i = 0; i < w.length; i++) z += w[i] * x[i]; return z >= 0 ? 1 : 0; };
    f.reset = function () { calls = 0; }; f.calls = function () { return calls; }; return f;
  }
  function makeStep() { var calls = 0, f = function (z) { calls++; return z >= 0 ? 1 : 0; }; f.reset = function () { calls = 0; }; f.calls = function () { return calls; }; return f; }
  function makeRelu() { var calls = 0, f = function (z) { calls++; return z > 0 ? z : 0; }; f.reset = function () { calls = 0; }; f.calls = function () { return calls; }; return f; }
  function makeHelpers() { return { neuron: makeNeuron(), step: makeStep(), relu: makeRelu() }; }
  function resetHelpers(H) { H.neuron.reset(); H.step.reset(); H.relu.reset(); }
  function allBits(n) { var out = []; for (var k = 0; k < (1 << n); k++) out.push(bitsOf(k, n)); return out; }
  function atLeastOK(f, signs, r) {
    var res = f(signs.slice(), r); if (!res || !Array.isArray(res.w) || res.w.length !== signs.length || typeof res.b !== "number") return false;
    return allBits(signs.length).every(function (x) {
      var z = res.b, t = 0;
      for (var i = 0; i < x.length; i++) { z += res.w[i] * x[i]; t += signs[i] > 0 ? x[i] : 1 - x[i]; }
      return (z >= 0 ? 1 : 0) === (t >= r ? 1 : 0);
    });
  }
  function checkerPts() { var pts = []; for (var i = 0; i <= 32; i++) for (var j = 0; j <= 32; j++) pts.push([i / 4, j / 4]); return pts; }
  var KATAS = [
    { id: "atleast", n: "At least r literals", fn: "atLeast",
      prompt: "Write <code>atLeast(signs, r)</code>. <code>signs[i]</code> is +1 if input i appears plainly and −1 if it appears negated. Return <code>{w, b}</code> for one threshold unit θ(w·x + b) that fires exactly when at least r of the literals are true. No helper is needed: return the parameters.",
      starter: "function atLeast(signs, r) {\n  // plain literal x_i: weight +1; negated literal (1 - x_i): weight -1\n  const w = signs.map(s => 0);\n  const b = 0;\n  return { w, b };\n}\n",
      tests: [
        ["AND of x1, x2, x3 (r = 3)", function (f) { return atLeastOK(f, [1, 1, 1], 3); }],
        ["OR of x1, x̄2 (r = 1)", function (f) { return atLeastOK(f, [1, -1], 1); }],
        ["at least 2 of x1, x̄2, x̄3, x4", function (f) { return atLeastOK(f, [1, -1, -1, 1], 2); }],
        ["at least 3 of x1, x2, x̄3, x̄4, x5", function (f) { return atLeastOK(f, [1, 1, -1, -1, 1], 3); }],
        ["r = 0 always fires", function (f) { return atLeastOK(f, [1, -1, 1], 0); }],
        ["r = len with negations: NOR of x1, x2", function (f) { return atLeastOK(f, [-1, -1], 2); }],
        ["r > len never fires", function (f) { return atLeastOK(f, [1, -1], 3); }]],
      js: "function atLeast(signs, r) {\n  // Σ_P x_i + Σ_Q (1 - x_i) >= r  ⇔  Σ_P x_i - Σ_Q x_i + (|Q| - r) >= 0\n  const w = signs.map(s => (s > 0 ? 1 : -1));\n  const q = signs.filter(s => s < 0).length;\n  return { w, b: q - r };\n}",
      py: "import numpy as np\n\ndef at_least(signs, r):\n    signs = np.asarray(signs)\n    w = np.where(signs > 0, 1, -1)\n    b = int((signs < 0).sum()) - r\n    return w, b" },
    { id: "ptree", n: "Parity tournament", fn: "parityTree",
      prompt: "Write <code>parityTree(bits)</code>, returning 1 when an odd number of bits are on. Use only <code>neuron(w, b, x)</code> (it returns θ(w·x + b)), pairing values in a knockout tree of XOR blocks. Use at most 3(n − 1) neuron calls. For n = 1 return the bit itself.",
      starter: "function parityTree(bits) {\n  let vals = bits.slice();\n  // while more than one value: pair them, XOR each pair with OR, NAND, AND\n  return vals[0];\n}\n",
      tests: [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return ["Correct on all " + (1 << n) + " inputs for n = " + n, function (f) { return allBits(n).every(function (x) { return f(x) === x.reduce(function (a, v) { return a + v; }, 0) % 2; }); }]; })
        .concat([["At most 3(n − 1) neuron calls for n = 8 and n = 5", function (f, H) {
          return [8, 5].every(function (n) { return allBits(n).every(function (x) { H.neuron.reset(); f(x); return H.neuron.calls() <= 3 * (n - 1); }); });
        }]]),
      js: "function parityTree(bits) {\n  let vals = bits.slice();\n  while (vals.length > 1) {\n    const next = [];\n    for (let i = 0; i + 1 < vals.length; i += 2) {\n      const a = vals[i], b = vals[i + 1];\n      const or = neuron([1, 1], -1, [a, b]);\n      const nand = neuron([-1, -1], 1, [a, b]);\n      next.push(neuron([1, 1], -2, [or, nand]));\n    }\n    if (vals.length % 2) next.push(vals[vals.length - 1]); // carried\n    vals = next;\n  }\n  return vals[0];\n}",
      py: "def neuron(w, b, x):\n    return int(sum(wi * xi for wi, xi in zip(w, x)) + b >= 0)\n\ndef parity_tree(bits):\n    vals = list(bits)\n    while len(vals) > 1:\n        nxt = []\n        for a, b in zip(vals[0::2], vals[1::2]):\n            h_or = neuron([1, 1], -1, [a, b])\n            h_nand = neuron([-1, -1], 1, [a, b])\n            nxt.append(neuron([1, 1], -2, [h_or, h_nand]))\n        if len(vals) % 2:\n            nxt.append(vals[-1])\n        vals = nxt\n    return vals[0]" },
    { id: "checker", n: "19-unit checkerboard", fn: "checker",
      prompt: "Write <code>checker(x1, x2)</code> for the 8+8 checkerboard: lines at 0.5, 1.5, …, 7.5 on both axes, firing when the number of lines at or below the point, on both axes together, is odd. A point exactly on a line counts that line (θ(0) = 1). Use at most 19 <code>neuron</code> calls and no if-statements on the inputs. Hint: the line units fire as a staircase, so an alternating sum counts mod 2.",
      starter: "function checker(x1, x2) {\n  const v = [], u = [];\n  for (let i = 1; i <= 8; i++) {\n    // v.push(neuron([1], ..., [x1]));\n  }\n  return 0;\n}\n",
      tests: [
        ["Correct on a 33×33 grid of [0,8]², including points on lines and crossings", function (f) { return checkerPts().every(function (p) { return f(p[0], p[1]) === checkerTarget(8, 8, p[0], p[1]); }); }],
        ["Correct on 400 random points", function (f) { var r = mulberry(4); for (var i = 0; i < 400; i++) { var x = r() * 8, y = r() * 8; if (f(x, y) !== checkerTarget(8, 8, x, y)) return false; } return true; }],
        ["At most 19 neuron calls per point", function (f, H) { return [[0.3, 7.9], [4, 4], [7.5, 0.5]].every(function (p) { H.neuron.reset(); f(p[0], p[1]); return H.neuron.calls() <= 19 && H.neuron.calls() >= 1; }); }]],
      js: "function checker(x1, x2) {\n  const v = [], u = [], alt = [];\n  for (let i = 1; i <= 8; i++) {\n    v.push(neuron([1], -(i - 0.5), [x1]));\n    u.push(neuron([1], -(i - 0.5), [x2]));\n  }\n  const lines = v.concat(u);\n  for (let i = 0; i < 16; i++) alt.push(i % 2 === 0 ? 1 : -1); // p1 + p2 = (k mod 2) + (m mod 2)\n  const A = neuron(alt, -1, lines);\n  const B = neuron(alt, -2, lines);\n  return neuron([1, -1], -1, [A, B]);\n}",
      py: "import numpy as np\n\ndef checker(x1, x2):\n    a = np.arange(1, 9) - 0.5\n    lines = np.concatenate([(x1 - a >= 0), (x2 - a >= 0)]).astype(int)  # 16 units\n    alt = np.tile([1, -1], 8)\n    s = alt @ lines                 # p1 + p2 in {0, 1, 2}\n    A, B = int(s - 1 >= 0), int(s - 2 >= 0)\n    return int(A - B - 1 >= 0)" },
    { id: "saw", n: "Folded sawtooth", fn: "saw",
      prompt: "Write <code>saw(k, x)</code> computing t^∘k(x), the tent map t(x) = 2·min(x, 1 − x) composed k times, on [0,1]. Use only <code>relu(z)</code> for the nonlinearity, at most 2k calls: each fold is 2·ReLU(z) − 4·ReLU(z − ½).",
      starter: "function saw(k, x) {\n  let z = x;\n  for (let i = 0; i < k; i++) {\n    // one fold\n  }\n  return z;\n}\n",
      tests: [1, 2, 3, 4, 5, 6].map(function (k) { return ["Equals t^∘" + k + " on every j/2^" + (k + 3), function (f) { var p = 1 << (k + 3); for (var j = 0; j <= p; j++) if (Math.abs(f(k, j / p) - sawK(j / p, k)) > 1e-12) return false; return true; }]; })
        .concat([["At most 2k relu calls (k = 7)", function (f, H) { H.relu.reset(); f(7, 0.3); return H.relu.calls() <= 14 && H.relu.calls() >= 1; }]]),
      js: "function saw(k, x) {\n  let z = x;\n  for (let i = 0; i < k; i++) z = 2 * relu(z) - 4 * relu(z - 0.5);\n  return z;\n}",
      py: "import numpy as np\n\ndef saw(k, x):\n    z = np.asarray(x, float)\n    relu = lambda v: np.maximum(v, 0)\n    for _ in range(k):\n        z = 2 * relu(z) - 4 * relu(z - 0.5)\n    return z" },
    { id: "xy", n: "xy from two ridges", fn: "xyNet",
      prompt: "Write <code>xyNet(x, y, K)</code> approximating xy on [−1,1]² as S(x + y) − S(x − y), where S is a K-block midpoint skyline for g(t) = t²/4 on [−2,2] with the endpoint correction. Use only <code>step(z)</code> (θ), at most 2(K + 1) calls. The tests require max error ≤ 4/K on a 41×41 grid.",
      starter: "function xyNet(x, y, K) {\n  const g = t => t * t / 4, lo = -2, hi = 2, D = (hi - lo) / K;\n  function sky(t) {\n    let s = 0;\n    // K+1 step units: heights telescope, plus g(hi) at t = hi\n    return s;\n  }\n  return sky(x + y) - sky(x - y);\n}\n",
      tests: [10, 20].map(function (K) { return ["Max error ≤ 4/K on a 41×41 grid, K = " + K, function (f) { var mx = 0; for (var i = 0; i <= 40; i++) for (var j = 0; j <= 40; j++) { var x = -1 + i / 20, y = -1 + j / 20; mx = Math.max(mx, Math.abs(f(x, y, K) - x * y)); } return mx <= 4 / K + 1e-12; }]; })
        .concat([["At most 2(K + 1) step calls per point (K = 10)", function (f, H) { H.step.reset(); f(0.3, -0.7, 10); return H.step.calls() <= 22 && H.step.calls() >= 1; }],
          ["Uses step units, not the formula x·y", function (f, H) { H.step.reset(); f(0.5, 0.5, 4); return H.step.calls() > 0; }]]),
      js: "function xyNet(x, y, K) {\n  const g = t => t * t / 4, lo = -2, hi = 2, D = (hi - lo) / K;\n  function sky(t) {\n    let s = 0, prev = 0;\n    for (let i = 0; i < K; i++) {\n      const h = g(lo + (i + 0.5) * D);       // midpoint height of block i\n      s += (h - prev) * step(t - (lo + i * D));\n      prev = h;\n    }\n    return s + (g(hi) - prev) * step(t - hi); // endpoint correction\n  }\n  return sky(x + y) - sky(x - y);\n}",
      py: "import numpy as np\n\ndef xy_net(x, y, K):\n    g = lambda t: t * t / 4\n    lo, hi = -2.0, 2.0\n    D = (hi - lo) / K\n    T = np.append(lo + D * np.arange(K), hi)          # K+1 thresholds\n    h = g(lo + D * (np.arange(K) + 0.5))\n    c = np.diff(np.concatenate([[0], h, [g(hi)]]))    # telescoped heights\n    sky = lambda t: c @ (t - T >= 0)\n    return sky(x + y) - sky(x - y)" }
  ];

  /* =========================================================================
     LABS
     ========================================================================= */
  var LIMITS = '<p class="limits"><strong>What this lab cannot measure.</strong> ';

  /* ---- overview ---- */
  GU.lab("nn02-overview", function (host) {
    var S = mountShell(host, "Ten activities", "progress is kept in this browser",
      '<p class="intro">Seven interactive workbenches follow the chapter in order, then code katas, paper problems and a review quiz. Every workbench asks for a prediction before it reveals an outcome, includes a degenerate or adversarial preset, and says what it cannot measure. A tick records activity, not mastery.</p>' +
      '<div class="legend"><span><i class="sw" style="background:var(--n-fire)"></i>fires, output 1, in the target</span>' +
      '<span><i class="sw" style="background:var(--n-calm)"></i>target only (missed)</span>' +
      '<span><i class="sw" style="background:var(--n-warn)"></i>fires where it should not, or unavoidable error</span></div>' +
      '<p class="cap" style="margin-top:12px"><span data-count>0 of 10 activities done</span></p><div class="bar"><span data-bar></span></div>' +
      '<ul class="navlist" data-nav></ul>');
    var nav = S.$("[data-nav]");
    SECTIONS.forEach(function (s, i) {
      var li = el("li"), b = el("button"); b.type = "button"; b.dataset.id = s[0];
      b.innerHTML = '<span class="n">' + (i + 1) + "</span><span>" + s[1] + "</span><span></span>";
      b.onclick = function () {
        var target = document.querySelector('.lab[data-lab="' + LAB_OF[s[0]] + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      li.appendChild(b); nav.appendChild(li);
    });
    function render() {
      if (!host.isConnected) { window.removeEventListener("nn02-progress", render); return; }
      var p = progress(), n = SECTIONS.filter(function (s) { return p[s[0]]; }).length;
      S.$$("[data-nav] button").forEach(function (b) { b.classList.toggle("done", !!p[b.dataset.id]); });
      S.$("[data-count]").textContent = n + " of " + SECTIONS.length + " activities done";
      S.$("[data-bar]").style.width = (100 * n / SECTIONS.length) + "%";
    }
    window.addEventListener("nn02-progress", render);
    render();
  });

  /* ---- §2 Karnaugh map ---- */
  var PALETTE = ["var(--n-fire)", "var(--n-calm)", "var(--n-warn)", "var(--n-ok)", "var(--n-violet)", "#8D6E63", "#00897B", "#5C6BC0"];
  GU.lab("nn-kmap", function (host) {
    var S = mountShell(host, "Karnaugh map to reduced network", "click cells to toggle; pick a preset",
      '<p class="intro">Rows are AB and columns CD, both in Gray-code order 00, 01, 11, 10, so neighbouring cells differ in one input and the map wraps at its edges. The small number in each cell is its row index, the binary number ABCD. The lab tests all 3⁴ = 81 patterns to list every prime implicant, then searches subsets exhaustively for a minimum cover.</p>' +
      '<div class="row chips" data-presets></div>' +
      '<div class="bench"><div><div class="scroll"><table class="kmap" data-map></table></div>' +
      '<p class="cap">Coloured dots mark the terms of the minimum cover containing each cell. Click a prime implicant below to outline its subcube.</p>' +
      '<div class="row chips" data-pis></div></div>' +
      '<div><div data-pred></div><div class="readout" data-read></div><div data-cover hidden><div class="scroll"><table class="tt" data-units></table></div><p class="cap" data-alt></p></div><p class="status" data-status></p></div></div>' +
      LIMITS + 'It counts AND–OR representations only. A smaller network may exist with other hidden units (one threshold unit computes "at least 3 of 4"), and the exhaustive cover search is fast only because n = 4; it says nothing about learning these weights or about circuit speed.</p>');
    var truth = truthFromRows(store.get("kmap", KMAP_PRESETS[0][1])), hl = null, seen = store.get("kmap-seen", {}), info;
    var pred = predictBox(S.$("[data-pred]"), {
      q: "How many units will the reduced network have (cover terms plus the OR output)?",
      answer: function () { return info.reducedUnits; },
      explain: function (g, a) { return "The minimum cover has " + info.coverSize + " term" + (info.coverSize === 1 ? "" : "s") + ", so the reduced network has " + a + " unit" + (a === 1 ? "" : "s") + ", against " + info.plainUnits + " for the plain DNF."; },
      onReveal: function () { seen[truth.join("")] = 1; store.set("kmap-seen", seen); if (Object.keys(seen).length >= 3) markDone("kmap"); render(); }
    });
    KMAP_PRESETS.forEach(function (p) { S.$("[data-presets]").appendChild(button(p[0], "chip", function () { truth = truthFromRows(p[1]); hl = null; pred.reset(); render(); })); });
    function render() {
      store.set("kmap", truth.map(function (v, i) { return v ? i : -1; }).filter(function (i) { return i >= 0; }));
      info = kmapAnalyse(truth);
      var shown = pred.revealed(), cover = info.cover || [];
      var html = '<tr><th>AB \\ CD</th>' + GRAY.map(function (c) { return "<th>" + (c >> 1) + (c & 1) + "</th>"; }).join("") + "</tr>";
      GRAY.forEach(function (rAB) {
        html += "<tr><th>" + (rAB >> 1) + (rAB & 1) + "</th>";
        GRAY.forEach(function (cCD) {
          var idx = rAB * 4 + cCD, dots = "";
          if (shown) cover.forEach(function (pi, t) { if (pi.mask & (1 << idx)) dots += '<i style="background:' + PALETTE[t % PALETTE.length] + '"></i>'; });
          html += '<td><button type="button" class="kc' + (truth[idx] ? " on" : "") + (hl && hl.mask & (1 << idx) ? " hl" : "") + '" data-i="' + idx + '" aria-label="row ' + idx + ", value " + truth[idx] + '"><span class="ix">' + idx + "</span>" + truth[idx] + '<span class="dots">' + dots + "</span></button></td>";
        });
        html += "</tr>";
      });
      S.$("[data-map]").innerHTML = html;
      S.$$(".kc").forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; truth[i] ^= 1; hl = null; render(); }; });
      var pc = S.$("[data-pis]"); pc.innerHTML = "";
      info.pis.forEach(function (pi) {
        var b = button(pi.term + "  " + pi.pat, "chip"); b.setAttribute("aria-pressed", hl && hl.pat === pi.pat ? "true" : "false");
        b.onclick = function () { hl = hl && hl.pat === pi.pat ? null : pi; render(); }; pc.appendChild(b);
      });
      var lines = "true rows: " + info.trueRows + "  →  plain DNF network: " + info.trueRows + " AND units + OR = " + info.plainUnits + " units\n" +
        "prime implicants (" + info.pis.length + "): " + (info.pis.map(function (p) { return p.term + " " + p.pat; }).join(", ") || "none") + "\n" +
        "essential: " + (info.essential.map(function (p) { return p.term; }).join(", ") || "none");
      if (shown) lines += "\nminimum cover: " + (cover.map(function (p) { return p.term; }).join(" + ") || "(empty: no terms)") + "  (" + info.coverSize + " term" + (info.coverSize === 1 ? "" : "s") + ")\n" +
        "reduced network: " + info.coverSize + " AND units + OR = " + info.reducedUnits + " units";
      else lines += "\nminimum cover: hidden until you predict";
      S.$("[data-read]").textContent = lines;
      S.$("[data-cover]").hidden = !shown;
      if (shown) {
        var t = "<tr><th>term</th>" + KV.map(function (v) { return "<th>w_" + v + "</th>"; }).join("") + "<th>bias</th><th>note</th></tr>";
        cover.forEach(function (pi, k) {
          var u = termUnit(pi.p);
          t += '<tr><td><i class="sw" style="background:' + PALETTE[k % PALETTE.length] + '"></i>' + pi.term + "</td>" + u.w.map(function (w) { return "<td>" + (w ? (w > 0 ? "+1" : "−1") : "·") + "</td>"; }).join("") + "<td>" + (u.b ? "−" + (-u.b) : "0") + "</td><td>" + (pi.lits ? "AND of " + pi.lits + " literal" + (pi.lits === 1 ? "" : "s") : "no literals: score 0, always fires") + "</td></tr>";
        });
        t += "<tr><td>OR output</td><td colspan=\"4\">+1 from each term</td><td>−1</td><td>" + (cover.length ? "fires if any term fires" : "no inputs: score −1, never fires") + "</td></tr>";
        S.$("[data-units]").innerHTML = t;
        S.$("[data-alt]").textContent = info.covers.length > 1 ? info.covers.length + " minimum covers exist: " + info.covers.map(function (c) { return c.map(function (p) { return p.term; }).join(" + "); }).join(";  ") : "This minimum cover is unique.";
      }
      var st = S.$("[data-status]");
      if (info.trueRows === 8 && info.pis.length === 8 && info.pis.every(function (p) { return p.lits === 4; })) { st.textContent = "Checkerboard: no two true cells are neighbours, so nothing groups and every term needs all four literals."; st.className = "status bad"; }
      else st.textContent = "";
      pred.update();
    }
    render();
  });

  /* ---- shared network drawing (SVG) ---- */
  function drawNetSVG(svg, net, x, labels) {
    var st = netStats(net), n = net.n, depth = st.nodeDepth, L = Math.max(1, st.depth), cols = [];
    for (var i = 0; i < depth.length; i++) (cols[depth[i]] = cols[depth[i]] || []).push(i);
    var rows = Math.max.apply(null, cols.map(function (c) { return c ? c.length : 0; })), W = 640, H = Math.max(170, rows * 17 + 30);
    var r = Math.max(4, Math.min(11, (H - 30) / rows / 2.6)), pos = [];
    cols.forEach(function (c, d) { if (c) c.forEach(function (node, k) { pos[node] = [36 + d * (W - 72) / L, 15 + (k + 0.5) * (H - 30) / c.length]; }); });
    var vals = x ? evalNet(net, x) : null, edges = "", nodes = "";
    net.units.forEach(function (u, j) {
      u.src.forEach(function (s, k) {
        if (!u.w[k]) return;
        var a = pos[s], b = pos[n + j];
        edges += '<line class="edge' + (u.w[k] < 0 ? " neg" : "") + (vals && vals[s] ? " on" : "") + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
      });
    });
    for (var q = 0; q < depth.length; q++) {
      var p = pos[q], isIn = q < n, u2 = isIn ? null : net.units[q - n], on = vals && vals[q];
      nodes += '<circle class="node' + (on ? " on" : "") + (u2 && u2.tag === "pass" ? " pass" : "") + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '"/>';
      if (isIn) nodes += '<text x="' + (p[0] - r - 3) + '" y="' + (p[1] + 4) + '" text-anchor="end">' + (labels ? labels[q] : "x" + (q + 1)) + "</text>";
      else if (r >= 7 && cols[depth[q]].length <= 12) nodes += '<text class="w" x="' + p[0] + '" y="' + (p[1] - r - 2) + '" text-anchor="middle">' + esc(u2.tag) + "</text>";
    }
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.innerHTML = edges + nodes;
  }

  /* ---- §3 parity builder ---- */
  GU.lab("nn-parity-builder", function (host) {
    var S = mountShell(host, "Parity three ways, built and counted", "choose n and a construction; every input is checked",
      '<p class="intro">The lab builds the actual network as a list of threshold units, evaluates it on all 2ⁿ inputs, and measures it: units, nonzero connections, biases, parameters, depth (longest path), whether every arrow joins neighbouring layers, and the dense parameter count a library would store when it does. The tree pairs values in order and carries an odd one; the layered tree copies a waiting value with two pass-through units θ(x − ½) per round.</p>' +
      '<div data-pred></div><div class="row chips" data-presets></div>' +
      '<div class="bench"><div>' +
      '<label class="ctl"><span>inputs n</span><input type="range" min="2" max="12" step="1" value="6" data-n><output data-no></output></label>' +
      '<label class="ctl"><span>construction</span><select data-c></select><span></span></label>' +
      '<div class="readout" data-read></div><p class="status" data-status></p>' +
      '<h3>All constructions at this n</h3><div class="scroll"><table class="tt" data-table></table></div></div>' +
      '<div><svg class="netsvg" data-svg role="img" aria-label="Network diagram"></svg><div class="row" data-bits></div><p class="cap" data-svgcap></p></div></div>' +
      LIMITS + 'It counts parameters and checks correctness exhaustively. It does not measure whether training would find these weights, and it does not time anything: a wide shallow layer and a deep narrow chain run very differently on real hardware. The one-unit search covers weights in {−1,0,1} only; the impossibility for every real weight is the XOR argument.</p>');
    PARITY_KINDS.forEach(function (k) { var o = el("option", null, k[1]); o.value = k[0]; S.$("[data-c]").appendChild(o); });
    var n = 6, kind = "dnf", probe = 0, verified = store.get("parity-verified", {});
    S.$("[data-c]").value = kind;
    var pred = predictBox(S.$("[data-pred]"), {
      q: "How many units does the three-unit XOR tree use for n = 12, and is it strictly layered?",
      choices: ["22 units, layered", "33 units, not layered", "33 units, layered", "2049 units, layered"],
      answer: function () { return 1; },
      explain: function () { var st = netStats(parityNet(12, "tree3")); return "Measured: " + st.units + " units = 3(n − 1), depth " + st.depth + ", strictly layered: " + (st.layered ? "yes" : "no") + ". 12 → 6 → 3 → 2 → 1: in the round with 3 values one waits, so an arrow skips two layers."; }
    });
    [["n = 6 table", function () { n = 6; kind = "dnf"; }], ["DNF at n = 12 (2049 units)", function () { n = 12; kind = "dnf"; }],
      ["One unit (failure)", function () { n = 3; kind = "one"; }], ["Layered tree, n = 5", function () { n = 5; kind = "ltree"; }]].forEach(function (p) {
      S.$("[data-presets]").appendChild(button(p[0], "chip", function () { p[1](); probe = 0; S.$("[data-n]").value = n; S.$("[data-c]").value = kind; render(); }));
    });
    function render() {
      S.$("[data-no]").textContent = n;
      var single = kind === "one" ? bestSingleUnit(n) : null, net = parityNet(n, kind, single), st = netStats(net), chk = parityCheck(net, n);
      var lines = "units " + st.units + "   connections " + st.connections + "   biases " + st.biases + "   parameters " + st.params +
        "\ndepth " + st.depth + " (longest path in arrows)   strictly layered: " + (st.layered ? "yes" : "no") +
        "\ndense parameter count: " + (st.dense == null ? "— (not strictly layered)" : st.dense + "  (layer widths " + st.widths.join(", ") + ")") +
        "\nexhaustive check: correct on " + chk.right + " of " + chk.total + " inputs";
      if (kind === "one") lines += single.right == null ? "\nsearch skipped for n > 6; θ(Σx − 1) shown" : "\nbest unit found: w = (" + single.w.join(", ") + "), b = " + single.b;
      S.$("[data-read]").textContent = lines;
      var s = S.$("[data-status]");
      if (chk.right === chk.total) {
        s.textContent = "Computes " + n + "-bit parity on every input."; s.className = "status ok";
        verified[kind] = 1; store.set("parity-verified", verified); if (Object.keys(verified).length >= 3) markDone("parity");
      } else { s.textContent = "Wrong on " + (chk.total - chk.right) + " inputs. Fix x₃ … xₙ to 0: any single unit becomes a unit on (x₁, x₂) that would have to compute XOR, which no half-plane does."; s.className = "status bad"; }
      var t = "<tr><th>construction</th><th>units</th><th>connections</th><th>biases</th><th>depth</th><th>layered</th><th>dense</th></tr>";
      ["dnf", "count", "tree3", "tree2", "ltree"].forEach(function (k) {
        var s2 = netStats(parityNet(n, k)), name = PARITY_KINDS.filter(function (p) { return p[0] === k; })[0][1];
        t += "<tr" + (k === kind ? ' class="cur"' : "") + '><td style="text-align:left">' + name + "</td><td>" + s2.units + "</td><td>" + s2.connections + "</td><td>" + s2.biases + "</td><td>" + s2.depth + "</td><td>" + (s2.layered ? "yes" : "no") + "</td><td>" + (s2.dense == null ? "—" : s2.dense) + "</td></tr>";
      });
      S.$("[data-table]").innerHTML = t;
      var svg = S.$("[data-svg]"), bits = S.$("[data-bits]"); bits.innerHTML = "";
      if (n <= 6) {
        if (probe >= (1 << n)) probe = 0;
        var x = bitsOf(probe, n);
        drawNetSVG(svg, net, x); svg.style.display = "";
        x.forEach(function (b, i) { var bt = button("x" + (i + 1) + " = " + b); bt.setAttribute("aria-pressed", b ? "true" : "false"); bt.onclick = function () { probe ^= 1 << (n - 1 - i); render(); }; bits.appendChild(bt); });
        S.$("[data-svgcap]").textContent = "Columns are depths; magenta units fire on the probe input (" + x.join("") + ", " + popcount(probe) + " on), output " + netOut(net, x) + ". Teal edges carry negative weights; dashed circles are pass-through units.";
      } else { svg.style.display = "none"; S.$("[data-svgcap]").textContent = "The diagram is drawn for n ≤ 6; the counts and the exhaustive check still run."; }
      pred.update();
    }
    var slow = debounce(render, 60);
    S.$("[data-n]").addEventListener("input", function (e) { n = +e.target.value; slow(); });
    S.$("[data-c]").addEventListener("change", function (e) { kind = e.target.value; render(); });
    render();
  });

  /* ---- §5 checkerboard ---- */
  GU.lab("nn-checkerboard", function (host) {
    var S = mountShell(host, "Exact checkerboards", "choose a grid and a construction; the plot evaluates the real network",
      '<p class="intro">Vertical lines x₁ = i − ½ (i = 1…a) and horizontal lines x₂ = j − ½ cut the window [0,a]×[0,b]. With k lines at or left of the point and m at or below it, the target fires when k + m is odd. Every construction starts from the a + b line units. The adversarial preset lets the output read the line units directly, one hidden layer, with weights you choose.</p>' +
      '<div data-pred></div><div class="row chips" data-presets></div>' +
      '<div class="bench"><div class="plot"><canvas data-cv></canvas><div class="legend" style="margin-top:6px"><span><i class="sw" style="background:var(--n-fire)"></i>both fire</span><span><i class="sw" style="background:var(--n-calm-soft);border:1px solid var(--n-calm)"></i>missed</span><span><i class="sw" style="background:var(--n-warn)"></i>extra</span><span>× crossing with a wrong quarter-cell</span></div></div><div>' +
      '<label class="ctl"><span>vertical a</span><input type="range" min="1" max="8" step="1" value="8" data-a><output data-ao></output></label>' +
      '<label class="ctl"><span>horizontal b</span><input type="range" min="1" max="8" step="1" value="8" data-b><output data-bo></output></label>' +
      '<label class="ctl"><span>construction</span><select data-c></select><span></span></label>' +
      '<div data-sh hidden><label class="ctl"><span>α on v-lines</span><select data-al><option value="alt">alternating +1, −1</option><option value="plus">all +1</option><option value="rand">random ±1</option></select><span></span></label>' +
      '<label class="ctl"><span>β on u-lines</span><select data-be><option value="alt">alternating +1, −1</option><option value="plus">all +1</option><option value="rand">random ±1</option></select><span></span></label>' +
      '<label class="ctl"><span>bias γ</span><input type="range" min="-4" max="4" step="0.5" value="-1" data-g><output data-go></output></label>' +
      '<div class="row"><button class="btn small" type="button" data-reroll>Re-roll random signs</button></div></div>' +
      '<div class="readout" data-read></div><p class="status" data-status></p></div></div>' +
      LIMITS + 'It checks exact correctness (cell by cell, plus probes on every line) and counts units. It does not show that 18 or 19 units are minimal—that is the theorem—and the adversarial preset explores only output weights on the line units, while the crossing obstruction covers every one-hidden-layer network. It measures nothing about training.</p>');
    CHECKER_KINDS.forEach(function (k) { var o = el("option", null, k[1]); o.value = k[0]; S.$("[data-c]").appendChild(o); });
    var a = 8, b = 8, kind = "count", seed = 1, used = store.get("checker-used", {});
    S.$("[data-c]").value = kind;
    var pred = predictBox(S.$("[data-pred]"), {
      q: "The output reads only the 16 line units (one hidden layer). With the best choice of weights and bias, how small can the mismatched area get?",
      choices: ["0: some weights make it exact", "positive for every choice of weights"],
      answer: function () { return 1; },
      explain: function () { return "Positive. At each crossing the two antipodal scores add to one constant C, but opposite sectors carry equal target labels, forcing C ≥ 0 and C < 0 at once. Try the one-hidden-layer construction: every crossing keeps a wrong quarter-cell, whatever α, β and γ."; },
      onReveal: function () { used.pred = 1; store.set("checker-used", used); maybeDone(); }
    });
    function maybeDone() { if (used.pred && ["and", "count", "skip", "xor", "shallow"].filter(function (k) { return used[k]; }).length >= 3 && used.shallow) markDone("checker"); }
    [["8+8, counting (19)", function () { a = 8; b = 8; kind = "count"; }], ["8+8, skip (18)", function () { a = 8; b = 8; kind = "skip"; }],
      ["3+3, AND per cell", function () { a = 3; b = 3; kind = "and"; }], ["One hidden layer (adversarial)", function () { a = 8; b = 8; kind = "shallow"; S.$("[data-g]").value = -1; }],
      ["1+1: a single crossing", function () { a = 1; b = 1; kind = "shallow"; }]].forEach(function (p) {
      S.$("[data-presets]").appendChild(button(p[0], "chip", function () { p[1](); S.$("[data-a]").value = a; S.$("[data-b]").value = b; S.$("[data-c]").value = kind; draw(); }));
    });
    function signs(mode, len, r) { var s = []; for (var i = 0; i < len; i++) s.push(mode === "alt" ? (i % 2 ? -1 : 1) : mode === "plus" ? 1 : (r() < 0.5 ? -1 : 1)); return s; }
    function draw() {
      a = +S.$("[data-a]").value; b = +S.$("[data-b]").value; kind = S.$("[data-c]").value;
      S.$("[data-ao]").textContent = a; S.$("[data-bo]").textContent = b; S.$("[data-go]").textContent = (+S.$("[data-g]").value).toFixed(1);
      S.$("[data-sh]").hidden = kind !== "shallow";
      var r = mulberry(seed), sh = { alpha: signs(S.$("[data-al]").value, a, r), beta: signs(S.$("[data-be]").value, b, r), gamma: +S.$("[data-g]").value };
      var net = checkerNet(a, b, kind, sh), st = netStats(net), mm = checkerMismatch(net, a, b), pr = checkerProbeScore(net, a, b), cf = crossingFailures(net, a, b), fm = checkerFormula(a, b);
      used[kind] = 1; store.set("checker-used", used); maybeDone();
      var T = theme(S.body), cv = S.$("[data-cv]"), f = fit(cv, b / a > 1.4 ? 1.3 : b / a < 0.6 ? 0.6 : b / a), ctx = f.ctx, w = f.w, h = f.h, F = frame(w, h, 0, a, 0, b, 0);
      var G1 = Math.min(320, Math.round(w)), G2 = Math.min(320, Math.round(h)), buf = new Float64Array(net.n + net.units.length);
      var cF = rgb(T.fire), cW = rgb(T.warn), cC = rgb(T.calmSoft), cB = rgb(T.surface);
      paintImage(ctx, w, h, G1, G2, function (i, j) {
        var x = a * (i + 0.5) / G1, y = b - b * (j + 0.5) / G2, o = netOut(net, [x, y], buf), t = checkerTarget(a, b, x, y);
        return o && t ? cF : o ? cW : t ? cC : cB;
      });
      ctx.strokeStyle = T.ink; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; ctx.beginPath();
      for (var i = 1; i <= a; i++) { ctx.moveTo(F.X(i - 0.5), 0); ctx.lineTo(F.X(i - 0.5), h); }
      for (var j = 1; j <= b; j++) { ctx.moveTo(0, F.Y(j - 0.5)); ctx.lineTo(w, F.Y(j - 0.5)); }
      ctx.stroke(); ctx.globalAlpha = 1;
      ctx.strokeStyle = T.ink; ctx.lineWidth = 2;
      cf.fails.forEach(function (p) { var X = F.X(p[0]), Y = F.Y(p[1]); ctx.beginPath(); ctx.moveTo(X - 4, Y - 4); ctx.lineTo(X + 4, Y + 4); ctx.moveTo(X + 4, Y - 4); ctx.lineTo(X - 4, Y + 4); ctx.stroke(); });
      var lines = "units " + st.units + "   connections " + st.connections + "   depth " + st.depth + "   strictly layered: " + (st.layered ? "yes" : "no") +
        "\nmismatched area: " + fmt(mm.area, 2) + " of " + (a * b) + " square units (" + fmt(100 * mm.area / (a * b), 1) + "%), computed exactly cell by cell" +
        "\nboundary probes on the lines: " + pr.ok + " of " + pr.total + " correct" +
        "\ncrossings with a wrong quarter-cell: " + cf.fails.length + " of " + cf.total +
        "\nformulas at " + a + "+" + b + ": AND per cell " + fm.and + " (" + fm.oddCells + " odd cells), counting " + fm.count + ", skip " + fm.skip + ", XOR tree " + fm.xor + " (depth " + fm.xorDepth + ")";
      S.$("[data-read]").textContent = lines;
      var s = S.$("[data-status]");
      if (mm.area === 0 && pr.ok === pr.total) { s.textContent = "Exact: every cell and every boundary probe agrees."; s.className = "status ok"; }
      else { s.textContent = kind === "shallow" ? "Not exact, and no choice of α, β, γ can be: every crossing must keep a wrong quarter-cell." : "Not exact."; s.className = "status bad"; }
      pred.update();
    }
    ["[data-a]", "[data-b]", "[data-g]"].forEach(function (q) { S.$(q).addEventListener("input", draw); });
    ["[data-c]", "[data-al]", "[data-be]"].forEach(function (q) { S.$(q).addEventListener("change", draw); });
    S.$("[data-reroll]").onclick = function () { seed++; S.$("[data-al]").value = "rand"; S.$("[data-be]").value = "rand"; draw(); };
    draw(); onRedraw(host, draw);
  });

  /* ---- §6 polygon nets and bottlenecks ---- */
  var BOTTLE_PRESETS = [
    ["All lines (floor 0)", function () { return { a: 3, xs: [1, 2, 3], ys: [1, 2, 3], extra: null }; }],
    ["Drop x₁ = 2 (floor 4)", function () { return { a: 3, xs: [1, 3], ys: [1, 2, 3], extra: null }; }],
    ["Keep only 1 and 3 (floor 6)", function () { return { a: 3, xs: [1, 3], ys: [1, 3], extra: null }; }],
    ["Extra line at 2 + δ", function () { return { a: 3, xs: [1, 3], ys: [1, 2, 3], extra: 2.25 }; }],
    ["Random lines (failure)", null]
  ];
  GU.lab("nn-polygon-net", function (host) {
    var S = mountShell(host, "Polygon nets and bottlenecks", "disc: vary N; bottleneck: choose the first layer",
      '<p class="intro"><strong>Disc.</strong> A regular N-gon network uses N edge units and one AND, N + 1 threshold units. Circumscribed polygons have edge offset 1, inscribed ones cos(π/N); the best regular N-gon chooses the offset that minimises disagreement area. <strong>Bottleneck.</strong> On the 3+3 checkerboard (lines at 1, 2, 3 on [0,4]²), choose which lines the first layer contains. Points with the same first-layer code get the same label from any later layers, so each code region costs min(area in, area out).</p>' +
      '<div class="row chips" data-modes></div><div data-pred></div>' +
      '<div class="bench"><div class="plot"><canvas data-cv></canvas><div class="legend" style="margin-top:6px" data-legend></div></div><div>' +
      '<div data-disc><label class="ctl"><span>sides N</span><input type="range" min="3" max="128" step="1" value="8" data-n><output data-no></output></label>' +
      '<label class="ctl"><span>polygon</span><select data-t><option value="circ">circumscribed</option><option value="insc">inscribed</option><option value="best">best regular N-gon</option></select><span></span></label>' +
      '<label class="ctl"><span>target ε</span><input class="num" type="number" min="0.00001" step="0.001" value="0.01" data-eps><span></span></label></div>' +
      '<div data-bott hidden><div class="row chips" data-bpre></div>' +
      '<label class="ctl"><span>grid</span><select data-ga><option value="2">2+2 on [0,3]²</option><option value="3" selected>3+3 on [0,4]²</option><option value="4">4+4 on [0,5]²</option></select><span></span></label>' +
      '<div class="row" data-xl></div><div class="row" data-yl></div>' +
      '<label class="ctl"><span><input type="checkbox" data-ex> extra x₁ =</span><input type="range" min="0.05" max="3.95" step="0.05" value="2.25" data-ep><output data-epo></output></label></div>' +
      '<div class="readout" data-read></div><p class="status" data-status></p></div></div>' +
      LIMITS + 'Disagreement area ignores how far apart boundaries are, and the grid estimate is a sample of the window [−1.5,1.5]², not proof. The bottleneck floor is exact for these axis-parallel first layers; it is a bound on what later layers can do, not a measurement of what training would reach.</p>');
    var mode = store.get("poly-mode", "disc"), bp = BOTTLE_PRESETS[1][1](), used = store.get("poly-used", {});
    function mark(k) { used[k] = 1; store.set("poly-used", used); if (used.disc && used.bott && used.pred) markDone("polygon"); }
    var predBox = S.$("[data-pred]"), predDisc, predBott;
    function setupPred() {
      if (mode === "disc") predDisc = predictBox(predBox, {
        q: "Double N. By what factor does the circumscribed polygon's disagreement area shrink?",
        choices: ["about 2", "about 4", "about 8", "it does not shrink"],
        answer: function () { return 1; },
        explain: function () { var N = +S.$("[data-n]").value; return "Measured at N = " + N + ": " + fmt(circErr(N), 5) + " → " + fmt(circErr(2 * N), 5) + " at N = " + (2 * N) + ", a factor of " + fmt(circErr(N) / circErr(2 * N), 3) + ". The error is π³/(3N²) + O(N⁻⁴), so doubling N divides it by about 4."; },
        onReveal: function () { mark("pred"); }
      });
      else predBott = predictBox(predBox, {
        q: "Drop the line x₁ = 2 from the 3+3 first layer. What is the smallest disagreement area any later layers can reach?",
        choices: ["0", "2", "4", "8"],
        answer: function () { return 2; },
        explain: function () { var r = bottleneck(3, [1, 3], [1, 2, 3]); return "Floor " + fmt(r.floor, 2) + " with " + r.codes + " codes: the columns [1,2] and [2,3] merge, and each of the four merged codes is half in and half out of the target."; },
        onReveal: function () { mark("pred"); }
      });
    }
    [["disc", "Disc"], ["bott", "Bottleneck"]].forEach(function (m) {
      var b = button(m[1], "chip", function () { mode = m[0]; store.set("poly-mode", mode); setupPred(); render(); }); b.dataset.m = m[0]; S.$("[data-modes]").appendChild(b);
    });
    BOTTLE_PRESETS.forEach(function (p, i) {
      S.$("[data-bpre]").appendChild(button(p[0], "chip", function () {
        if (p[1]) bp = p[1](); else { var r = mulberry(Date.now() % 100000); bp = { a: 3, xs: [r() * 4, r() * 4, r() * 4].map(function (v) { return Math.round(v * 20) / 20; }), ys: [r() * 4, r() * 4, r() * 4].map(function (v) { return Math.round(v * 20) / 20; }), extra: null, random: true }; }
        syncBott(); render();
      }));
    });
    function syncBott() {
      S.$("[data-ga]").value = bp.a; S.$("[data-ex]").checked = bp.extra != null; if (bp.extra != null) S.$("[data-ep]").value = bp.extra;
      S.$("[data-ep]").max = bp.a + 0.95;
      [["[data-xl]", "xs", "x₁"], ["[data-yl]", "ys", "x₂"]].forEach(function (q) {
        var box = S.$(q[0]); box.innerHTML = "";
        box.appendChild(el("span", "cap", (q[1] === "xs" ? "vertical" : "horizontal") + " lines:"));
        if (bp.random) { box.appendChild(el("span", "cap", bp[q[1]].map(function (v) { return q[2] + " = " + v.toFixed(2); }).join(", "))); return; }
        for (var i = 1; i <= bp.a; i++) (function (i) {
          var on = bp[q[1]].indexOf(i) >= 0, b = button(q[2] + " = " + i); b.setAttribute("aria-pressed", on ? "true" : "false");
          b.onclick = function () { var L = bp[q[1]], k = L.indexOf(i); if (k >= 0) L.splice(k, 1); else L.push(i); syncBott(); render(); };
          box.appendChild(b);
        })(i);
      });
    }
    S.$("[data-ga]").onchange = function () { var a = +S.$("[data-ga]").value, all = []; for (var i = 1; i <= a; i++) all.push(i); bp = { a: a, xs: all.slice(), ys: all.slice(), extra: null }; syncBott(); render(); };
    S.$("[data-ex]").onchange = function () { bp.extra = S.$("[data-ex]").checked ? +S.$("[data-ep]").value : null; render(); };
    S.$("[data-ep]").oninput = function () { if (S.$("[data-ex]").checked) bp.extra = +S.$("[data-ep]").value; render(); };
    function renderDisc() {
      var T = theme(S.body), N = +S.$("[data-n]").value, type = S.$("[data-t]").value, d = polyOffset(N, type);
      S.$("[data-no]").textContent = N;
      var cv = S.$("[data-cv]"), f = fit(cv, 1), ctx = f.ctx, w = f.w, h = f.h, R = 1.5, G = Math.min(300, Math.round(w)), F = frame(w, h, -R, R, -R, R, 0);
      var cF = rgb(T.fire), cW = rgb(T.warn), cC = rgb(T.calmSoft), cB = rgb(T.surface);
      paintImage(ctx, w, h, G, G, function (i, j) { var x = -R + 2 * R * (i + 0.5) / G, y = R - 2 * R * (j + 0.5) / G, p = inPoly(N, d, x, y), t = x * x + y * y <= 1; return p && t ? cF : p ? cW : t ? cC : cB; });
      ctx.strokeStyle = T.ink; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(F.X(0), F.Y(0), F.X(1) - F.X(0), 0, 7); ctx.stroke(); ctx.setLineDash([]);
      var exact = polyExact(N, type), grid = polyGrid(N, type, 240), asym = polyAsym(N, type), eps = Math.max(1e-6, +S.$("[data-eps]").value || 0.01), Nmin = smallestN(eps, type);
      var lines = "threshold units: " + N + " edges + 1 AND = " + (N + 1) + "\nedge offset (apothem): " + fmt(d, 5) +
        "\nexact disagreement area: " + fmt(exact, 5) + " square units" + (type === "best" ? "  (numerical minimiser)" : "") +
        "\ngrid estimate (240×240 samples of [−1.5,1.5]²): " + fmt(grid, 4) +
        "\n" + (asym ? (type === "circ" ? "π³/(3N²)" : "2π³/(3N²)") + " = " + fmt(asym, 5) + "   relative error of the asymptote: " + fmt(100 * (asym - exact) / exact, 2) + "%" : "error × N² = " + fmt(exact * N * N, 3) + "  (compare π³/3 ≈ 10.335 for circumscribed)") +
        "\nsmallest N with exact error ≤ " + eps + ": " + (Nmin == null ? "beyond 200000" : Nmin + "  (" + (Nmin + 1) + " units)");
      S.$("[data-read]").textContent = lines;
      S.$("[data-legend]").innerHTML = '<span><i class="sw" style="background:var(--n-fire)"></i>polygon ∩ disc</span><span><i class="sw" style="background:var(--n-calm-soft);border:1px solid var(--n-calm)"></i>disc only</span><span><i class="sw" style="background:var(--n-warn)"></i>polygon only</span><span>dashed: unit circle</span>';
      S.$("[data-status]").textContent = N === 3 ? "Degenerate end: a triangle. Its error, " + fmt(exact, 3) + ", is far from the asymptote; the N⁻² law is a large-N statement." : "";
      S.$("[data-status]").className = "status meh";
      mark("disc");
    }
    function renderBott() {
      var T = theme(S.body), a = bp.a, Wd = a + 1, xs = bp.xs.slice(); if (bp.extra != null) xs.push(bp.extra);
      S.$("[data-epo]").textContent = (+S.$("[data-ep]").value).toFixed(2);
      var res = bottleneck(a, xs, bp.ys), cv = S.$("[data-cv]"), f = fit(cv, 1), ctx = f.ctx, w = f.w, h = f.h, F = frame(w, h, 0, Wd, 0, Wd, 0), G = Math.min(320, Math.round(w));
      var cF = rgb(T.fireSoft), cB = rgb(T.surface), cW = rgb(T.warn);
      paintImage(ctx, w, h, G, G, function (i, j) {
        var x = Wd * (i + 0.5) / G, y = Wd - Wd * (j + 0.5) / G, t = (Math.floor(x) + Math.floor(y)) % 2, reg = null;
        for (var q = 0; q < res.regions.length; q++) { var r = res.regions[q]; if (x >= r.x0 && x < r.x1 && y >= r.y0 && y < r.y1) { reg = r; break; } }
        var unavoidable = reg && Math.min(reg.A1, reg.A0) > 0 && t !== reg.label;
        return unavoidable ? mix(cW, t ? cF : cB, 0.25) : t ? cF : cB;
      });
      ctx.strokeStyle = T.ink; ctx.lineWidth = 2.2; ctx.beginPath();
      xs.forEach(function (p) { if (p > 0 && p < Wd) { ctx.moveTo(F.X(p), 0); ctx.lineTo(F.X(p), h); } });
      bp.ys.forEach(function (p) { if (p > 0 && p < Wd) { ctx.moveTo(0, F.Y(p)); ctx.lineTo(w, F.Y(p)); } });
      ctx.stroke();
      ctx.strokeStyle = T.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath();
      for (var i = 1; i <= a; i++) { if (xs.indexOf(i) < 0) { ctx.moveTo(F.X(i), 0); ctx.lineTo(F.X(i), h); } if (bp.ys.indexOf(i) < 0) { ctx.moveTo(0, F.Y(i)); ctx.lineTo(w, F.Y(i)); } }
      ctx.stroke(); ctx.setLineDash([]);
      S.$("[data-read]").textContent = "first-layer units: " + (xs.length + bp.ys.length) + "\ndistinct codes (regions): " + res.codes +
        "\nirreducible error Σ min(A¹, A⁰): " + fmt(res.floor, 3) + " square units = " + fmt(100 * res.floor / res.area, 2) + "% of the window (" + res.area + ")" +
        "\nbest agreement any later layers can reach: " + fmt(100 * res.agreement, 2) + "%" + (bp.extra != null ? "\nextra line at x₁ = " + bp.extra.toFixed(2) + (a === 3 && bp.xs.indexOf(2) < 0 && bp.extra > 1 && bp.extra < 3 ? "  (δ = " + fmt(Math.abs(bp.extra - 2), 2) + ", floor 4δ = " + fmt(4 * Math.abs(bp.extra - 2), 2) + ")" : "") : "");
      S.$("[data-legend]").innerHTML = '<span><i class="sw" style="background:var(--n-fire-soft);border:1px solid var(--n-fire)"></i>target cell</span><span><i class="sw" style="background:var(--n-warn)"></i>unavoidable error (minority of a merged code)</span><span>solid: first-layer line; dotted: missing line</span>';
      var s = S.$("[data-status]"); s.textContent = res.floor === 0 ? "Floor 0: later layers can still be exact." : "No later layers, of any depth, width or activation, can do better than this."; s.className = "status " + (res.floor === 0 ? "ok" : "bad");
      mark("bott");
    }
    function render() {
      S.$$("[data-modes] .chip").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.m === mode ? "true" : "false"); });
      S.$("[data-disc]").hidden = mode !== "disc"; S.$("[data-bott]").hidden = mode !== "bott";
      if (mode === "disc") renderDisc(); else renderBott();
      var p = mode === "disc" ? predDisc : predBott; if (p) p.update();
    }
    ["[data-n]", "[data-eps]"].forEach(function (q) { S.$(q).addEventListener("input", render); });
    S.$("[data-t]").addEventListener("change", render);
    syncBott(); setupPred(); render(); onRedraw(host, render);
  });

  /* ---- §7 universal approximation by ridges ---- */
  GU.lab("nn-uat", function (host) {
    var S = mountShell(host, "Ridges: one hidden layer approximates", "pick a target, an activation and K",
      '<p class="intro">Each target is written as a sum of ridges c·g(a·x): xy = ¼(x+y)² − ¼(x−y)², x² ± y² along the axes, and xy² = [(x+y)³ + (x−y)³ − 2x³]/6. Each ridge g is approximated on its interval by a K-block step skyline (midpoint heights plus the endpoint correction, K + 1 threshold units) or by a ReLU interpolant at K + 1 knots (K units). The output is a summing unit.</p>' +
      '<div class="row chips" data-modes></div><div data-pred></div>' +
      '<div data-ridge><div class="bench"><div>' +
      '<label class="ctl"><span>target</span><select data-tg><option value="xy">xy</option><option value="diff">x² − y²</option><option value="sum">x² + y²</option><option value="xy2">xy²</option></select><span></span></label>' +
      '<label class="ctl"><span>activation</span><select data-act><option value="step">threshold (step skyline)</option><option value="relu">ReLU (interpolant)</option></select><span></span></label>' +
      '<label class="ctl"><span>blocks K</span><input type="range" min="2" max="100" step="1" value="10" data-k><output data-ko></output></label>' +
      '<label class="ctl"><span>domain</span><select data-dom><option value="box">the box [−1,1]²</option><option value="ext">extrapolate to [−2,2]²</option></select><span></span></label>' +
      '</div><div><div class="readout" data-read></div><p class="status" data-status></p></div></div>' +
      '<div class="canrow"><div><canvas data-c0></canvas><p class="cap">target</p></div><div><canvas data-c1></canvas><p class="cap">network</p></div><div><canvas data-c2></canvas><p class="cap">|error| (dashed: the box)</p></div></div></div>' +
      '<div data-poly hidden><div class="bench"><div class="plot"><canvas data-cp></canvas><p class="cap">x³ (teal), your quadratic q (magenta) and the error x³ − q (amber), on [−1,1]. Dots mark −1, −½, ½, 1.</p></div><div>' +
      '<p class="intro">With activation z², one hidden layer computes c₀ + Σ cⱼ(wⱼx + bⱼ)², a quadratic however wide it is. Choose any quadratic q = q₀ + q₁x + q₂x².</p>' +
      '<label class="ctl"><span>q₀</span><input type="range" min="-1" max="1" step="0.01" value="0" data-q0><output data-q0o></output></label>' +
      '<label class="ctl"><span>q₁</span><input type="range" min="-1" max="2" step="0.01" value="0.75" data-q1><output data-q1o></output></label>' +
      '<label class="ctl"><span>q₂</span><input type="range" min="-1" max="1" step="0.01" value="0" data-q2><output data-q2o></output></label>' +
      '<div class="row"><button class="btn small" type="button" data-best>Best quadratic ¾x</button></div>' +
      '<div class="readout" data-pread></div></div></div></div>' +
      LIMITS + 'The measured maximum is sampled on a 101×101 grid, so it can miss the true supremum; the guaranteed bound is the proof\'s. The theorem and this lab say nothing about how many units training would need, whether gradient descent finds these weights, generalization from samples, or behaviour outside the box (see the extrapolate preset).</p>');
    var mode = "ridge", used = store.get("uat-used", {});
    function mark(k) { used[k] = 1; store.set("uat-used", used); if (used.step && used.relu && (used.poly || used.ext) && used.pred) markDone("uat"); }
    var pred = predictBox(S.$("[data-pred]"), {
      q: "Double K. By what factors do the guaranteed errors of the step network and of the ReLU network shrink?",
      choices: ["½ and ½", "½ and ¼", "¼ and ¼", "¼ and ½"], answer: function () { return 1; },
      explain: function () {
        var key = S.$("[data-tg]").value, K = +S.$("[data-k]").value;
        return "For " + UAT_T[key].name + " at K = " + K + ": step bound " + fmt(uatBound(key, "step", K), 4) + " → " + fmt(uatBound(key, "step", 2 * K), 4) + ", ReLU bound " + fmt(uatBound(key, "relu", K), 5) + " → " + fmt(uatBound(key, "relu", 2 * K), 5) + ". A skyline's error is λΔ/2, linear in the block width; an interpolant's is Δ²·max|g″|/8.";
      },
      onReveal: function () { mark("pred"); }
    });
    [["ridge", "Ridge network"], ["poly", "Polynomial activation z² (failure)"]].forEach(function (m) {
      var b = button(m[1], "chip", function () { mode = m[0]; render(); }); b.dataset.m = m[0]; S.$("[data-modes]").appendChild(b);
    });
    [["xy, step, K = 10", function () { set("xy", "step", 10, "box"); }], ["xy, step, K = 80", function () { set("xy", "step", 80, "box"); }],
      ["xy, ReLU, K = 7", function () { set("xy", "relu", 7, "box"); }], ["Extrapolate (failure)", function () { set("xy", "relu", 7, "ext"); }]].forEach(function (p) {
      S.$("[data-modes]").appendChild(button(p[0], "chip", function () { mode = "ridge"; p[1](); render(); }));
    });
    function set(t, a, K, d) { S.$("[data-tg]").value = t; S.$("[data-act]").value = a; S.$("[data-k]").value = K; S.$("[data-dom]").value = d; }
    function heat(cv, lo, hi, val, vmax, pos, neg, zero) {
      var f = fit(cv, 1), G = 101;
      paintImage(f.ctx, f.w, f.h, G, G, function (i, j) {
        var x = lo + (hi - lo) * i / (G - 1), y = hi - (hi - lo) * j / (G - 1), v = val(x, y) / vmax;
        return v >= 0 ? mix(zero, pos, Math.min(1, v)) : mix(zero, neg, Math.min(1, -v));
      });
      if (lo < -1) { var F = frame(f.w, f.h, lo, hi, lo, hi, 0), T = theme(S.body); f.ctx.strokeStyle = T.ink; f.ctx.setLineDash([4, 3]); f.ctx.strokeRect(F.X(-1), F.Y(1), F.X(1) - F.X(-1), F.Y(-1) - F.Y(1)); f.ctx.setLineDash([]); }
    }
    function renderRidge() {
      var key = S.$("[data-tg]").value, act = S.$("[data-act]").value, K = +S.$("[data-k]").value, ext = S.$("[data-dom]").value === "ext";
      S.$("[data-ko]").textContent = K;
      var net = uatNet(key, act, K), lo = ext ? -2 : -1, hi = ext ? 2 : 1, ms = uatMeasure(net, 101, lo, hi), bound = uatBound(key, act, K), f = UAT_T[key].f;
      var T = theme(S.body), zero = rgb(T.surface), pos = rgb(T.fire), neg = rgb(T.calm), warn = rgb(T.warn);
      var vmax = 0; for (var i = 0; i <= 20; i++) for (var j = 0; j <= 20; j++) vmax = Math.max(vmax, Math.abs(f(lo + (hi - lo) * i / 20, lo + (hi - lo) * j / 20)));
      heat(S.$("[data-c0]"), lo, hi, f, vmax, pos, neg, zero);
      heat(S.$("[data-c1]"), lo, hi, function (x, y) { return uatEval(net, x, y); }, vmax, pos, neg, zero);
      var emax = Math.max(1e-9, ms.max);
      heat(S.$("[data-c2]"), lo, hi, function (x, y) { return Math.abs(uatEval(net, x, y) - f(x, y)); }, emax, warn, warn, zero);
      var lines = "hidden units: " + net.hidden + "  (" + net.ridges.length + " ridges × " + (act === "step" ? "(K + 1)" : "K") + ")" +
        "\nmeasured max |error| in the box (101×101 grid, sampled): " + fmt(ms.inBox, 4) +
        (ext ? "\nmeasured max |error| on [−2,2]²: " + fmt(ms.max, 4) + "  — nothing is promised outside the box" : "") +
        "\nguaranteed bound in the box: " + fmt(bound, 4) + "   measured / bound: " + fmt(ms.inBox / bound, 3);
      S.$("[data-read]").textContent = lines;
      var s = S.$("[data-status]");
      if (ext) { s.textContent = "Outside the box the ridges extend unchanged, so the error grows to " + fmt(ms.max, 2) + "."; s.className = "status bad"; mark("ext"); }
      else { s.textContent = ms.inBox <= bound + 1e-12 ? "Within the guaranteed bound everywhere it was sampled." : "Above the bound: report this."; s.className = "status " + (ms.inBox <= bound + 1e-12 ? "ok" : "bad"); }
      mark(act);
    }
    function renderPoly() {
      var q0 = +S.$("[data-q0]").value, q1 = +S.$("[data-q1]").value, q2 = +S.$("[data-q2]").value, q = function (x) { return q0 + q1 * x + q2 * x * x; };
      ["0", "1", "2"].forEach(function (k) { S.$("[data-q" + k + "o]").textContent = (+S.$("[data-q" + k + "]").value).toFixed(2); });
      var T = theme(S.body), cv = S.$("[data-cp]"), f = fit(cv, 0.75), ctx = f.ctx, w = f.w, h = f.h, F = frame(w, h, -1.1, 1.1, -1.3, 1.3, 10);
      ctx.clearRect(0, 0, w, h); ctx.strokeStyle = T.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(F.X(0), 0); ctx.lineTo(F.X(0), h); ctx.moveTo(0, F.Y(0)); ctx.lineTo(w, F.Y(0));
      [0.25, -0.25].forEach(function (v) { ctx.moveTo(F.X(-1.1), F.Y(v)); ctx.lineTo(F.X(1.1), F.Y(v)); }); ctx.stroke();
      var mx = 0;
      [[function (x) { return x * x * x; }, T.calm], [q, T.fire], [function (x) { return x * x * x - q(x); }, T.warn]].forEach(function (c) {
        ctx.strokeStyle = c[1]; ctx.lineWidth = 2; ctx.beginPath();
        for (var i = 0; i <= 400; i++) { var x = -1 + i / 200, y = c[0](x); if (i) ctx.lineTo(F.X(x), F.Y(y)); else ctx.moveTo(F.X(x), F.Y(y)); }
        ctx.stroke();
      });
      for (var i = 0; i <= 2000; i++) { var x = -1 + i / 1000; mx = Math.max(mx, Math.abs(x * x * x - q(x))); }
      ctx.fillStyle = T.ink; [-1, -0.5, 0.5, 1].forEach(function (x) { ctx.beginPath(); ctx.arc(F.X(x), F.Y(x * x * x - q(x)), 3.5, 0, 7); ctx.fill(); });
      S.$("[data-pread]").textContent = "max |x³ − q| on [−1,1] (2001 samples): " + fmt(mx, 4) +
        "\ndivided difference D[x³ − q] = " + fmt(cubeDivided(q), 6) + "  (always 1 for a quadratic q)" +
        "\nlower bound: 1 ≤ 4·max|e| at the four points, so error ≥ ¼ for every width" +
        "\nvalues at −1, −½, ½, 1: " + [-1, -0.5, 0.5, 1].map(function (x) { return fmt(x * x * x - q(x), 3); }).join(", ");
      mark("poly");
    }
    function render() {
      S.$$("[data-modes] .chip").forEach(function (b) { if (b.dataset.m) b.setAttribute("aria-pressed", b.dataset.m === mode ? "true" : "false"); });
      S.$("[data-ridge]").hidden = mode !== "ridge"; S.$("[data-poly]").hidden = mode !== "poly";
      if (mode === "ridge") renderRidge(); else renderPoly();
      pred.update();
    }
    S.$("[data-k]").addEventListener("input", debounce(render, 30));
    ["[data-tg]", "[data-act]", "[data-dom]"].forEach(function (q) { S.$(q).addEventListener("change", render); });
    ["[data-q0]", "[data-q1]", "[data-q2]"].forEach(function (q) { S.$(q).addEventListener("input", render); });
    S.$("[data-best]").onclick = function () { S.$("[data-q0]").value = 0; S.$("[data-q1]").value = 0.75; S.$("[data-q2]").value = 0; render(); };
    render(); onRedraw(host, render);
  });

  /* ---- §7 cylinder tails ---- */
  GU.lab("nn-cylinder-tails", function (host) {
    var S = mountShell(host, "Adding cylinders fails", "grow the row of discs and watch the gap",
      '<p class="intro">K discs of radius ρ sit in a row with centres 0, s, 2s, …. Each disc\'s edge units fire on a fraction ½ + arcsin(ρ/r)/π of directions at distance r > ρ (in the limit of many edges), and 1 inside. The proposed rule fires when Σⱼ (fractionⱼ − ½) ≥ ½. The test point is the first gap, x₁ = s/2.</p>' +
      '<div data-pred></div><div class="row chips" data-presets></div>' +
      '<div class="bench"><div class="plot"><canvas data-cv></canvas><div class="legend" style="margin-top:6px"><span><i class="sw" style="background:var(--n-calm)"></i>total excess (darker = larger)</span><span><i class="sw" style="background:var(--n-fire)"></i>rule fires inside a disc</span><span><i class="sw" style="background:var(--n-warn)"></i>false positive</span><span>dot: gap point</span></div></div><div>' +
      '<label class="ctl"><span>discs K</span><input type="range" min="1" max="100" step="1" value="2" data-k><output data-ko></output></label>' +
      '<label class="ctl"><span>spacing s/ρ</span><input type="range" min="2.2" max="8" step="0.1" value="3" data-s><output data-so></output></label>' +
      '<label class="ctl"><span>scale</span><input type="range" min="0.25" max="4" step="0.05" value="1" data-sc><output data-sco></output></label>' +
      '<label class="ctl"><span>edges per disc</span><select data-e><option value="0">limit N → ∞</option><option value="8">N = 8</option><option value="16">N = 16</option><option value="64">N = 64</option></select><span></span></label>' +
      '<div class="readout" data-read></div><p class="status" data-status></p></div></div>' +
      '<p class="intro muted">Two repairs are valid: threshold each cylinder first (one more hidden layer, NN01\'s exact polygons), or use the ridge construction of this section.</p>' +
      LIMITS + 'The false-positive area is a grid estimate in the drawn window only, and with K > 6 the discs beyond the window still contribute to the excess. The lab tests one proposed construction; it says nothing about networks built another way, or about training.</p>');
    var used = store.get("cyl-used", {});
    function mark(k) { used[k] = 1; store.set("cyl-used", used); if (used.fire && used.scale && used.pred) markDone("cylinder"); }
    var pred = predictBox(S.$("[data-pred]"), {
      q: "Discs of radius 1, spacing 3. With three discs in the row, does the gap point x₁ = 1.5 fire?",
      choices: ["no, it is outside every disc", "yes"], answer: function () { return 1; },
      explain: function () { return "Total excess " + fmt(cylGap(2, 1, 3, 0), 4) + " with two discs, then " + fmt(cylGap(3, 1, 3, 0), 4) + " with three: the third disc, 4.5 away, adds arcsin(1/4.5)/π ≈ 0.071 and the total crosses ½."; },
      onReveal: function () { mark("pred"); }
    });
    [["K = 2 (correct)", 2], ["K = 3 (first failure)", 3], ["K = 100", 100]].forEach(function (p) {
      S.$("[data-presets]").appendChild(button(p[0], "chip", function () { S.$("[data-k]").value = p[1]; S.$("[data-s]").value = 3; draw(); }));
    });
    S.$("[data-presets]").appendChild(button("Thinner cylinders (scale ¼)", "chip", function () { S.$("[data-sc]").value = 0.25; draw(); }));
    function draw() {
      var K = +S.$("[data-k]").value, sr = +S.$("[data-s]").value, sc = +S.$("[data-sc]").value, N = +S.$("[data-e]").value, rho = sc, s = sr * sc;
      S.$("[data-ko]").textContent = K; S.$("[data-so]").textContent = sr.toFixed(1); S.$("[data-sco]").textContent = sc.toFixed(2);
      var shown = Math.min(K, 6), x0 = -s, x1 = (shown - 1) * s + s, half = (x1 - x0) / 4;
      var T = theme(S.body), cv = S.$("[data-cv]"), f = fit(cv, 0.5), ctx = f.ctx, w = f.w, h = f.h, F = frame(w, h, x0, x1, -half, half, 0);
      var G1 = Math.min(280, Math.round(w)), G2 = Math.round(G1 / 2), cS = rgb(T.surface), cC = rgb(T.calm), cF = rgb(T.fire), cW = rgb(T.warn), fp = 0;
      paintImage(ctx, w, h, G1, G2, function (i, j) {
        var x = x0 + (x1 - x0) * (i + 0.5) / G1, y = half - 2 * half * (j + 0.5) / G2, e = cylExcess(x, y, K, rho, s, N), inside = false;
        for (var q = 0; q < K; q++) { var dx = x - q * s; if (dx * dx + y * y <= rho * rho) { inside = true; break; } }
        if (e >= 0.5) { if (!inside) fp++; return inside ? cF : cW; }
        return mix(cS, cC, Math.max(0, e) / 0.5 * 0.7);
      });
      ctx.strokeStyle = T.ink; ctx.lineWidth = 1;
      for (var q = 0; q < shown; q++) { ctx.beginPath(); ctx.arc(F.X(q * s), F.Y(0), F.X(rho) - F.X(0), 0, 7); ctx.stroke(); }
      ctx.fillStyle = T.ink; ctx.beginPath(); ctx.arc(F.X(s / 2), F.Y(0), 4, 0, 7); ctx.fill();
      var gap = cylGap(K, rho, s, N), first = cylFirstFire(rho, s, N, 200000), fpArea = fp / (G1 * G2) * (x1 - x0) * 2 * half;
      S.$("[data-read]").textContent = "total excess at the gap point (" + fmt(s / 2, 2) + ", 0): " + fmt(gap, 4) + (gap >= 0.5 ? "  ≥ ½: fires (false positive)" : "  < ½: correctly silent") +
        "\nfirst K at which the gap point fires: " + (first == null ? "beyond 200000" : first) + (N ? "  (N = " + N + " edges)" : "  (limit)") +
        "\nfalse-positive area in the window (grid estimate): " + fmt(fpArea, 3) + " square units of " + fmt((x1 - x0) * 2 * half, 1) +
        "\nratio ρ/r at the gap: " + fmt(rho / (s / 2), 4) + "  — unchanged by the scale slider";
      var st = S.$("[data-status]");
      st.textContent = gap >= 0.5 ? "The tails of " + K + " cylinders add up past ½ in the gap." : K >= 2 ? "Correct so far. Add discs." : "One disc alone is fine.";
      st.className = "status " + (gap >= 0.5 ? "bad" : "ok");
      if (gap >= 0.5) mark("fire");
      if (sc !== 1) mark("scale");
      pred.update();
    }
    ["[data-k]", "[data-s]", "[data-sc]"].forEach(function (q) { S.$(q).addEventListener("input", debounce(draw, 30)); });
    S.$("[data-e]").addEventListener("change", draw);
    draw(); onRedraw(host, draw);
  });

  /* ---- §8 the sawtooth ---- */
  function sawCapacity(L, width) {
    return {pieces: Math.pow(width + 1, L), maxKNotRuledOut: Math.floor(L * Math.log2(width + 1) + 1e-9)};
  }
  GU.lab("nn-sawtooth", function (host) {
    var S = mountShell(host, "The sawtooth: depth against width", "fold k times; give a shallow network m units",
      '<p class="intro">The deep network folds k times with 2 ReLU units per layer, 2k units in all, and computes t^∘k exactly. The shallow candidate is the one-hidden-layer construction this lab tries: the ReLU interpolant of t^∘k at m + 1 equally spaced knots, which uses m units. The theorem says every one-hidden-layer ReLU network approximating t^∘k with uniform error strictly below ½ needs m ≥ 2ᵏ − 1.</p>' +
      '<div data-pred></div><div class="row chips" data-presets></div>' +
      '<div class="bench"><div class="plot"><canvas data-cv></canvas><p class="cap">t^∘k (teal), shallow candidate (magenta), level ½ (dashed). Dots mark the grid i/2ᵏ.</p></div><div>' +
      '<label class="ctl"><span>folds k</span><input type="range" min="1" max="8" step="1" value="3" data-k><output data-ko></output></label>' +
      '<label class="ctl"><span>shallow m</span><input type="range" min="1" max="300" step="1" value="5" data-m><output data-mo></output></label>' +
      '<div class="readout" data-read></div><p class="status" data-status></p>' +
      '<h3>Pieces at depth L</h3><label class="ctl"><span>layers L</span><input type="range" min="1" max="12" step="1" value="3" data-L><output data-Lo></output></label>' +
      '<label class="ctl"><span>width m′</span><input type="range" min="1" max="16" step="1" value="2" data-w><output data-wo></output></label><div class="readout" data-calc></div></div></div>' +
      LIMITS + 'The candidate\'s error is sampled (4096 points plus the grid and knots). The lab shows one shallow construction failing; the lower bound for every shallow network is the theorem. It does not show that training would find the deep weights (see C1), and it measures no hardware cost of depth.</p>');
    var used = store.get("saw-used", {});
    function mark(k) { used[k] = 1; store.set("saw-used", used); if (used.exact && used.fail && used.pred) markDone("sawtooth"); }
    var pred = predictBox(S.$("[data-pred]"), {
      q: "For k = 6, how many hidden units must any one-hidden-layer ReLU network have to approximate t^∘6 with uniform error strictly below ½?",
      answer: function () { return 63; },
      explain: function () { return "At least 2⁶ − 1 = 63: the grid i/64 has 65 alternating values, so g − ½ needs 64 zeros in 64 different pieces. The deep network uses 2·6 = 12 units."; },
      onReveal: function () { mark("pred"); }
    });
    [["m = 2ᵏ (exact)", function (k) { return 1 << k; }, "exact"], ["m = 2ᵏ − 2 (must fail)", function (k) { return Math.max(1, (1 << k) - 2); }, "fail"], ["m = 1 (degenerate)", function () { return 1; }, "fail"]].forEach(function (p) {
      S.$("[data-presets]").appendChild(button(p[0], "chip", function () { var k = +S.$("[data-k]").value; S.$("[data-m]").value = Math.min(300, p[1](k)); draw(); }));
    });
    function draw() {
      var k = +S.$("[data-k]").value, m = +S.$("[data-m]").value, P = 1 << k;
      S.$("[data-ko]").textContent = k; S.$("[data-mo]").textContent = m;
      var I = sawInterp(k, m), err = sawMaxErr(k, m), sc = sawSignChanges(k, m), deepOK = true;
      for (var j = 0; j <= P * 8; j++) if (Math.abs(deepSaw(k, j / (P * 8)) - sawK(j / (P * 8), k)) > 1e-12) deepOK = false;
      var T = theme(S.body), cv = S.$("[data-cv]"), f = fit(cv, 0.6), ctx = f.ctx, w = f.w, h = f.h, F = frame(w, h, 0, 1, -0.15, 1.15, 10);
      ctx.clearRect(0, 0, w, h); ctx.strokeStyle = T.muted; ctx.setLineDash([5, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(F.X(0), F.Y(0.5)); ctx.lineTo(F.X(1), F.Y(0.5)); ctx.stroke(); ctx.setLineDash([]);
      [[function (x) { return sawK(x, k); }, T.calm, 2.4], [function (x) { return interpEval(I, x); }, T.fire, 1.8]].forEach(function (c) {
        ctx.strokeStyle = c[1]; ctx.lineWidth = c[2]; ctx.beginPath();
        var M = Math.max(800, 4 * P);
        for (var i = 0; i <= M; i++) { var x = i / M, y = c[0](x); if (i) ctx.lineTo(F.X(x), F.Y(y)); else ctx.moveTo(F.X(x), F.Y(y)); }
        ctx.stroke();
      });
      if (P <= 64) { ctx.fillStyle = T.ink; for (var q = 0; q <= P; q++) { ctx.beginPath(); ctx.arc(F.X(q / P), F.Y(sawK(q / P, k)), 2.5, 0, 7); ctx.fill(); } }
      S.$("[data-read]").textContent = "deep network: " + (2 * k) + " ReLU units in " + k + " layers of width 2, exact on the dyadic grid: " + (deepOK ? "yes" : "NO") +
        "\ntheorem: with uniform error strictly below ½ needs m ≥ 2ᵏ − 1 = " + (P - 1) + " units" +
        "\nshallow candidate: m = " + m + " units (" + I.nonzero + " with nonzero weight), max |error| (sampled) = " + fmt(err, 4) +
        "\nsign changes of g − ½ on the grid i/2ᵏ: " + sc + " (with uniform error strictly below ½ needs " + P + ")";
      var st = S.$("[data-status]");
      if (err < 0.5) { st.textContent = "Sampled error <½ with " + m + " units" + (m >= P - 1 ? ", consistent with the bound." : " — below the bound: report this."); st.className = "status " + (m >= P - 1 ? "ok" : "bad"); if (m === P) mark("exact"); }
      else { st.textContent = "Error ≥ ½" + (m < P - 1 ? ": no one-hidden-layer network this size can do better than ½." : " for this candidate."); st.className = "status bad"; if (m < P - 1 && k >= 2) mark("fail"); }
      var L = +S.$("[data-L]").value, wd = +S.$("[data-w]").value, capacity = sawCapacity(L, wd), pieces = capacity.pieces;
      S.$("[data-Lo]").textContent = L; S.$("[data-wo]").textContent = wd;
      S.$("[data-calc]").textContent = "at most (m′ + 1)ᴸ = " + (wd + 1) + "^" + L + " = " + (pieces < 1e15 ? pieces.toLocaleString("en-US") : pieces.toExponential(3)) + " pieces with " + (L * wd) + " hidden units\n2ᵏ = " + P + " pieces needed for error <½, k = " + k + ": " + (pieces >= P ? "not ruled out by this bound" : "impossible") + "\nlargest k not ruled out: " + capacity.maxKNotRuledOut + "\nThis necessary bound supplies no construction at that k. At error ≤½, the constant output ½ already works.";
      pred.update();
    }
    ["[data-k]", "[data-m]", "[data-L]", "[data-w]"].forEach(function (q) { S.$(q).addEventListener("input", draw); });
    draw(); onRedraw(host, draw);
  });

  /* ---- §12 code katas ---- */
  GU.lab("nn02-katas", function (host) {
    var S = mountShell(host, "Code katas", "JavaScript, tested in your browser; Ctrl/Cmd+Enter runs",
      '<p class="intro">Five constructions from the chapter. The helpers <code>neuron(w, b, x)</code>, <code>step(z)</code> and <code>relu(z)</code> count their calls, so each test checks the size of your network as well as its answers. Each solution reveal also shows a NumPy version. Your code is saved in this browser.</p>' +
      '<div class="notice" hidden data-notice>This page can\'t run code in this browser, so the tests are unavailable. You can still read each task and reveal the solutions.</div>' +
      '<div class="row chips" role="group" aria-label="Katas" data-chips></div>' +
      '<div class="bench wide-left"><div><p class="intro" data-prompt></p><textarea class="editor" spellcheck="false" aria-label="Kata code" data-code></textarea>' +
      '<div class="row"><button class="btn primary" type="button" data-run>Run tests</button><button class="btn" type="button" data-reset>Restore starter</button></div></div>' +
      '<div><ul class="tests" data-results></ul><p class="status" data-status></p><details data-sol><summary class="cap" style="cursor:pointer;color:var(--n-calm)">Reveal solution</summary><div data-solbody></div></details></div></div>' +
      LIMITS + 'Call counts measure network size, not speed, and the tests sample finite grids; passing them is evidence, not a proof of correctness on every real input.</p>');
    var canEval = true; try { canEval = (new Function("return 2"))() === 2; } catch (e) { canEval = false; }
    if (!canEval) S.$("[data-notice]").hidden = false;
    var kata = KATAS[0], kataCode = store.get("kata-code", {}), kataPass = store.get("kata-pass", {});
    function renderChips() {
      var c = S.$("[data-chips]"); c.innerHTML = "";
      KATAS.forEach(function (k) { var b = el("button", "chip" + (kataPass[k.id] ? " solved" : ""), k.n); b.type = "button"; b.setAttribute("aria-pressed", k === kata ? "true" : "false"); b.onclick = function () { kata = k; load(); }; c.appendChild(b); });
    }
    function load() {
      renderChips(); S.$("[data-prompt]").innerHTML = kata.prompt; S.$("[data-code]").value = kataCode[kata.id] != null ? kataCode[kata.id] : kata.starter;
      S.$("[data-results]").innerHTML = ""; S.$("[data-status]").textContent = ""; S.$("[data-sol]").open = false;
      S.$("[data-solbody]").innerHTML = '<p class="cap">JavaScript</p><pre class="sol">' + esc(kata.js) + '</pre><p class="cap">NumPy</p><pre class="sol">' + esc(kata.py) + "</pre>";
    }
    function run() {
      var src = S.$("[data-code]").value; kataCode[kata.id] = src; store.set("kata-code", kataCode);
      var ul = S.$("[data-results]"), st = S.$("[data-status]"); ul.innerHTML = "";
      if (!canEval) { st.textContent = "Code can't run in this browser."; st.className = "status bad"; return; }
      var H = makeHelpers(), fn;
      try { fn = (new Function("neuron", "step", "relu", '"use strict";\n' + src + "\n;return (typeof " + kata.fn + "==='function')?" + kata.fn + ":undefined;"))(H.neuron, H.step, H.relu); }
      catch (e) { st.textContent = "Your code has an error: " + e.message; st.className = "status bad"; return; }
      if (!fn) { st.textContent = "Define a function named " + kata.fn + "."; st.className = "status bad"; return; }
      var pass = 0;
      kata.tests.forEach(function (t) {
        var li = el("li"), ok = false, msg = "";
        try { resetHelpers(H); ok = !!t[1](fn, H); } catch (e) { msg = e.message; }
        if (ok) pass++;
        li.className = ok ? "p" : "f"; li.innerHTML = "<span>" + esc(t[0]) + "</span>" + (msg ? "<small>" + esc(msg) + "</small>" : ""); ul.appendChild(li);
      });
      st.textContent = pass + " of " + kata.tests.length + " tests pass."; st.className = "status " + (pass === kata.tests.length ? "ok" : "meh");
      if (pass === kata.tests.length && !kataPass[kata.id]) { kataPass[kata.id] = true; store.set("kata-pass", kataPass); renderChips(); }
      if (Object.keys(kataPass).length >= 3) markDone("katas");
    }
    var code = S.$("[data-code]");
    S.$("[data-run]").onclick = run;
    S.$("[data-reset]").onclick = function () { code.value = kata.starter; kataCode[kata.id] = kata.starter; store.set("kata-code", kataCode); };
    code.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && !e.shiftKey && !e.altKey) { e.preventDefault(); var s = code.selectionStart; code.setRangeText("  ", s, code.selectionEnd, "end"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); e.stopPropagation(); run(); }
    });
    load();
  });

  /* ---- §14 paper problems: progress over the lesson's A-exercises ---- */
  GU.lab("nn02-problems", function (host) {
    var S = mountShell(host, "Paper problems", "the problems are exercises A1–A12 below",
      '<p class="intro">Work these with pen and paper. Open a hint only when you\'re stuck, and check your answer against the solution afterwards. Each problem below has typed checks where the answer is a number, a model-marked box for your written argument, and a gated reference solution.</p>' +
      '<div class="readout" data-read></div><div class="row"><button class="btn" type="button" data-go>Go to problem A1</button></div>');
    var BANK = "nn-02-network-expressivity";
    function render() {
      if (!host.isConnected) { document.removeEventListener("click", later, true); return; }
      var work = {}; try { work = (JSON.parse(localStorage.getItem("gu.work.v1") || "{}")[BANK]) || {}; } catch (e) {}
      var ids = []; for (var i = 1; i <= 12; i++) ids.push("A" + i);
      var tried = ids.filter(function (id) { return work[id] && work[id].attempted; });
      S.$("[data-read]").textContent = tried.length + " of 12 problems attempted" + (tried.length ? " (" + tried.join(", ") + ")" : "") + ". Four attempts complete this lab.";
      if (tried.length >= 4) markDone("problems");
    }
    var later = function () { setTimeout(render, 50); };
    document.addEventListener("click", later, true);
    S.$("[data-go]").onclick = function () {
      var head = Array.prototype.find.call(document.querySelectorAll(".ex .ex-id"), function (n) { return n.textContent.trim() === "A1"; });
      if (head) head.closest(".ex").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    render();
  });

  /* ---- §15 review quiz ---- */
  var QUIZ = [
    {
        "q": "One threshold unit fires when at least 2 of x₁, x̄₂, x̄₃ are true. What are its weights and bias?",
        "o": [
            "(1, −1, −1) and bias 0",
            "(1, 1, 1) and bias −2",
            "(1, −1, −1) and bias −2",
            "(1, −1, −1) and bias 2"
        ],
        "a": 0,
        "why": "Plain literals get +1 and negated ones −1, and the bias is |Q| − r = 2 − 2 = 0. At (1,0,0) all three literals are true and the score is 1 ≥ 0."
    },
    {
        "q": "For f = 1 on rows {0, 1, 2, 3, 5, 7, 8, 10, 13, 15}, how many terms does a minimum cover need, and how many units does the reduced network have?",
        "o": [
            "4 terms, 5 units",
            "3 terms, 4 units",
            "2 terms, 3 units",
            "10 terms, 11 units"
        ],
        "a": 1,
        "why": "B̄D̄ (only cover of row 8) and BD (only cover of row 13) are essential; rows 1 and 3 need one more term, ĀD or ĀB̄. Three AND units plus the OR."
    },
    {
        "q": "Why does every AND–OR network for n-bit parity need 2ⁿ⁻¹ hidden units, while the counting network needs only n?",
        "o": [
            "Parity has 2ⁿ⁻¹ prime implicants that overlap",
            "Every implicant of parity names all n inputs, and the counting units θ(Σx − k) are not ANDs of literals",
            "Counting networks use real weights, which AND units cannot",
            "The counting network is deeper"
        ],
        "a": 1,
        "why": "Flipping an input that a term omits flips parity, so each term covers one true row. The bound is for AND hidden units only; units that count escape it, still at depth 2."
    },
    {
        "q": "A piece-count bound does not rule out a network of width 3 and six hidden layers for a target. What has been established?",
        "o": [
            "That such a network exists",
            "Only that this necessary bound does not exclude it",
            "That training will find its weights",
            "That six layers is the exact minimum"
        ],
        "a": 1,
        "why": "An upper bound on the number of pieces gives a necessary condition on size. A matching construction is needed to prove an achievable minimum."
    },
    {
        "q": "How many cells do 5 lines in general position make in the plane?",
        "o": [
            "10",
            "11",
            "15",
            "16"
        ],
        "a": 3,
        "why": "Φ(5,2) = C(5,0) + C(5,1) + C(5,2) = 1 + 5 + 10 = 16. Each new line crosses every earlier one and adds one cell per piece it is cut into."
    },
    {
        "q": "Why can no one-hidden-layer threshold network represent the 8+8 checkerboard exactly, however wide?",
        "o": [
            "It has too many cells",
            "At a crossing, z(p+εu) + z(p−εu) is the same constant C for every direction u, but opposite sectors share a label, forcing both C ≥ 0 and C < 0",
            "Its boundary is not on any line",
            "One hidden layer cannot have 16 units"
        ],
        "a": 1,
        "why": "Each hidden unit through p contributes exactly once to the antipodal pair. This is the crossing obstruction; with a second hidden layer, 18 or 19 units suffice."
    },
    {
        "q": "In the 3+3 checkerboard on [0,4]², the first layer omits the line x₁ = 2. What is the smallest disagreement area any later layers can reach?",
        "o": [
            "0, with enough later layers",
            "2",
            "4",
            "8"
        ],
        "a": 2,
        "why": "Columns [1,2] and [2,3] share codes. Each of the four merged codes is half in and half out of the target, so each costs at least 1. Later layers see only the code."
    },
    {
        "q": "What does the one-hidden-layer universal approximation theorem guarantee?",
        "o": [
            "A small network for every continuous target",
            "That gradient descent finds an accurate network",
            "For each continuous f on a box and each ε > 0, some network with a summing output is within ε everywhere on the box",
            "Accuracy on and outside the box"
        ],
        "a": 2,
        "why": "The theorem asserts existence on a closed bounded box under uniform error. It gives no practical size guarantee independent of the target and does not guarantee learning, generalization, or behavior outside the box."
    },
    {
        "q": "Which expression tends to θ(z) for every fixed z≠0 as k grows?",
        "o": [
            "tanh(kz)",
            "[1+tanh(kz)]/2",
            "ReLU(kz)",
            "The constant ½"
        ],
        "a": 1,
        "why": "tanh tends to −1 for negative inputs and +1 for positive inputs. Shifting and scaling gives the binary limit. At zero it remains ½, so this is not uniform approximation across the jump."
    },
    {
        "q": "The deep network computes t^∘6 with 12 ReLU units. How many units must a one-hidden-layer ReLU network have to approximate it with uniform error strictly below ½?",
        "o": [
            "At least 12",
            "At least 32",
            "At least 63",
            "At least 64"
        ],
        "a": 2,
        "why": "t^∘6 alternates between 0 and 1 on 65 grid points, so g − ½ has 64 zeros in different linear pieces: m + 1 ≥ 64, m ≥ 63 = 2⁶ − 1."
    },
    {
        "q": "Every path from x ∈ ℝ³ to the output passes through a first layer of 2 units, of any activation. What follows?",
        "o": [
            "Nothing, if later layers are wide enough",
            "The network is constant along some line direction v ≠ 0",
            "The network can only output two values",
            "It is a linear function"
        ],
        "a": 1,
        "why": "W ∈ ℝ²ˣ³ has a nonzero null vector v by rank–nullity, so W(x + τv) + b = Wx + b and nothing downstream can tell x from x + τv."
    },
    {
        "q": "A sigmoid output never equals zero. Can it still approximate the constant-zero target to arbitrary uniform accuracy on a box?",
        "o": [
            "No: zero is outside its exact range",
            "Yes: a sufficiently negative constant bias makes the output uniformly small",
            "Only with a discontinuous hidden layer",
            "Only if the box omits its boundary"
        ],
        "a": 1,
        "why": "Exact representation requires a value in the range; arbitrary approximation can reach limiting values in the closure. A zero input weight and increasingly negative bias give a constant output approaching zero."
    }
];
  GU.lab("nn02-quiz", function (host) {
    var S = mountShell(host, "Review quiz", "calculation, construction and interpretation",
      '<p class="intro">Twelve questions. Every answer follows from this chapter, and every option carries an explanation once you answer.</p><div class="quiz" data-quiz></div>');
    renderQuiz(S.$("[data-quiz]"), "Twelve questions", QUIZ, "quiz", function (right) { if (right === 12) markDone("quiz"); });
  });
})();
