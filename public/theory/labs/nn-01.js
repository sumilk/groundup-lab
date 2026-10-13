/* ===========================================================================
   labs/nn-01.js — NN01 "Connectionism and the threshold unit".

   The ten hands-on labs of the lecture-1 lab page, ported into the reader:
   overview/progress, history, McCulloch–Pitts, Hebb, perceptron, regions,
   cylinders, pulses, code katas, problems progress, and the review quiz.
   Three lesson-only figures sit beside them: the heat/cold illusion, Turing's
   B-type links, and multilayer Boolean networks.

   Each lab registers with GU.lab(id, host => …). State lives in localStorage
   under "nn01:"; every read and write is guarded so private windows still work.
   =========================================================================== */
(function () {
  "use strict";
  var GU = window.GU = window.GU || {};
  if (!GU.lab) return;

  /* ------------------------------------------------------------ styling -- */
  var CSS = [
    ".nn1{--n-bg:var(--surface);--n-surface:var(--paper);--n-surface2:var(--surface-2);--n-ink:var(--ink);--n-muted:var(--ink-2);--n-line:var(--rule);",
    "--n-fire:#C2185B;--n-fire-soft:#F6D7E3;--n-calm:#1A7884;--n-calm-soft:#D2EBEE;--n-warn:#C27500;--n-ok:#2E7D32;--n-bad:#C62828;--n-code:var(--surface-2);",
    "font-family:var(--sans);font-size:14.5px;line-height:1.55;color:var(--n-ink);padding:16px 18px 18px}",
    ":root[data-theme='dark'] .nn1{--n-fire:#FF5996;--n-fire-soft:#4A1E33;--n-calm:#4CC0CD;--n-calm-soft:#153C43;--n-warn:#F2A93B;--n-ok:#6FCB74;--n-bad:#FF6B6B}",
    "@media (prefers-color-scheme:dark){:root:not([data-theme='light']) .nn1{--n-fire:#FF5996;--n-fire-soft:#4A1E33;--n-calm:#4CC0CD;--n-calm-soft:#153C43;--n-warn:#F2A93B;--n-ok:#6FCB74;--n-bad:#FF6B6B}}",
    ".nn1 p{margin:.5em 0}.nn1 h3{font:600 15px/1.3 var(--sans);margin:18px 0 6px}.nn1 a{color:var(--n-calm)}",
    ".nn1 code{font-family:var(--mono);font-size:.88em;background:var(--n-code);padding:.05em .3em;border-radius:3px}",
    ".nn1 .intro{max-width:72ch;margin:0 0 6px}.nn1 .intro.muted{color:var(--n-muted)}",
    ".nn1 .bench{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;margin-top:14px;align-items:start}",
    ".nn1 .bench.wide-left{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}",
    ".nn1 .npanel{background:var(--n-surface);border:1px solid var(--n-line);border-radius:8px;padding:14px}",
    ".nn1 .plot{width:100%;max-width:560px}",
    ".nn1 .plot canvas{display:block;border-radius:6px;background:var(--n-surface);border:1px solid var(--n-line);touch-action:manipulation}",
    ".nn1 .cap{font-size:12.5px;color:var(--n-muted);margin-top:6px}",
    ".nn1 .btn{font:500 13px var(--sans);color:var(--n-ink);background:transparent;border:1px solid var(--n-ink);padding:6px 12px;border-radius:5px;cursor:pointer}",
    ".nn1 .btn:hover{background:var(--n-surface2);color:var(--n-ink)}",
    ".nn1 .btn.primary{background:var(--n-ink);color:var(--n-surface)}.nn1 .btn.primary:hover{opacity:.9;color:var(--n-surface)}",
    ".nn1 .btn.small{padding:3px 9px;font-size:12px}",
    ".nn1 .btn[aria-pressed='true']{background:var(--n-fire);border-color:var(--n-fire);color:#fff}",
    ".nn1 .btn:disabled{opacity:.45;cursor:default}",
    ".nn1 .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}",
    ".nn1 label.ctl{display:grid;grid-template-columns:96px 1fr 56px;gap:10px;align-items:center;font-size:13px;margin:6px 0}",
    ".nn1 label.ctl output{font-family:var(--mono);font-size:12.5px;text-align:right}",
    ".nn1 input[type=range]{width:100%;accent-color:var(--n-fire)}",
    ".nn1 select{font:inherit;font-size:13px;color:var(--n-ink);background:var(--n-surface);border:1px solid var(--n-line);border-radius:5px;padding:5px 8px}",
    ".nn1 .readout{font-family:var(--mono);font-size:12.5px;background:var(--n-surface2);border-radius:5px;padding:9px 11px;white-space:pre-wrap;line-height:1.5}",
    ".nn1 .status{font-weight:600}.nn1 .status.ok{color:var(--n-ok)}.nn1 .status.bad{color:var(--n-bad)}.nn1 .status.meh{color:var(--n-warn)}",
    ".nn1 .quiz{margin-top:20px;max-width:780px}.nn1 .quiz h3{margin-top:0}",
    ".nn1 .q{padding:12px 0;border-top:1px solid var(--n-line)}.nn1 .q-text{margin:0 0 8px;font-weight:500}",
    ".nn1 .q-n{font-family:var(--mono);color:var(--n-muted);margin-right:10px;font-weight:400}",
    ".nn1 .q-opts{display:grid;gap:6px}",
    ".nn1 .opt{text-align:left;font:inherit;font-size:13.5px;color:var(--n-ink);background:var(--n-surface);border:1px solid var(--n-line);border-radius:6px;padding:7px 11px;cursor:pointer}",
    ".nn1 .opt:hover:not(:disabled){border-color:var(--n-ink);color:var(--n-ink)}.nn1 .opt:disabled{cursor:default;opacity:1}",
    ".nn1 .opt.right{border-color:var(--n-ok);background:color-mix(in srgb,var(--n-ok) 12%,var(--n-surface))}",
    ".nn1 .opt.wrong{border-color:var(--n-bad);background:color-mix(in srgb,var(--n-bad) 10%,var(--n-surface))}",
    ".nn1 .q-why{font-size:13px;color:var(--n-muted);margin:8px 0 0}",
    ".nn1 .quiz-foot{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:13px;color:var(--n-muted)}",
    ".nn1 .sortlist{list-style:none;padding:0;margin:10px 0}",
    ".nn1 .sortlist li{display:grid;grid-template-columns:62px 1fr auto;gap:12px;align-items:center;padding:9px 11px;border:1px solid var(--n-line);border-radius:6px;margin:6px 0;background:var(--n-surface)}",
    ".nn1 .sortlist li .yr{font-family:var(--mono);font-size:12px;color:var(--n-muted)}",
    ".nn1 .sortlist li.good,.nn1 .sorter .item.good{border-color:var(--n-ok)}.nn1 .sortlist li.badpos,.nn1 .sorter .item.badpos{border-color:var(--n-bad)}",
    ".nn1 .sortlist li .idea{display:block;font-size:12.5px;color:var(--n-muted)}",
    ".nn1 .updown{display:flex;gap:4px;flex-wrap:wrap}",
    ".nn1 .sorter{display:grid;gap:8px;margin-top:10px}",
    ".nn1 .sorter .item{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:7px 11px;background:var(--n-surface);border:1px solid var(--n-line);border-radius:6px;font-size:13px}",
    ".nn1 .neuron svg{width:100%;height:auto;display:block}",
    ".nn1 .neuron .soma{fill:var(--n-surface2);stroke:var(--n-ink);stroke-width:2;transition:fill .2s}",
    ".nn1 .neuron.firing .soma{fill:var(--n-fire)}",
    ".nn1 .neuron .wire{stroke:var(--n-line);stroke-width:3;fill:none}.nn1 .neuron .wire.on{stroke:var(--n-ink)}.nn1 .neuron .wire.inh.on{stroke:var(--n-bad)}",
    ".nn1 .neuron .axon{stroke:var(--n-ink);stroke-width:3;fill:none}",
    ".nn1 .neuron .spike{fill:var(--n-fire);opacity:0}",
    ".nn1 .neuron.firing .spike{animation:nn1spike 1.1s linear infinite}",
    "@keyframes nn1spike{0%{transform:translateX(0);opacity:1}90%{opacity:1}100%{transform:translateX(150px);opacity:0}}",
    "@media (prefers-reduced-motion:reduce){.nn1 .neuron.firing .spike{animation:none;opacity:1}}",
    ".nn1 .neuron text{font-family:var(--mono);font-size:13px;fill:var(--n-ink)}.nn1 .neuron.firing .theta{fill:#fff}",
    ".nn1 .neuron text.lbl{font-family:var(--sans);font-size:11px;fill:var(--n-muted)}",
    ".nn1 .inputs{display:grid;gap:8px}.nn1 .inputs .inp{display:grid;grid-template-columns:22px 70px 1fr;gap:10px;align-items:center}.nn1 .inputs .inp b{font-family:var(--mono)}",
    ".nn1 table.tt{border-collapse:collapse;font-family:var(--mono);font-size:12.5px;margin-top:8px}",
    ".nn1 table.tt th,.nn1 table.tt td{padding:3px 10px;border-bottom:1px solid var(--n-line);text-align:center;background:none}",
    ".nn1 table.tt td.y{color:var(--n-ok)}.nn1 table.tt td.n{color:var(--n-bad)}",
    ".nn1 .chips{display:flex;flex-wrap:wrap;gap:6px}",
    ".nn1 .chip{font:500 12.5px var(--sans);border:1px solid var(--n-line);background:var(--n-surface);color:var(--n-ink);border-radius:999px;padding:4px 11px;cursor:pointer}",
    ".nn1 .chip[aria-pressed='true']{border-color:var(--n-ink);background:var(--n-ink);color:var(--n-surface)}",
    ".nn1 .chip.solved::after{content:' \\2713';color:var(--n-ok)}.nn1 .chip[aria-pressed='true'].solved::after{color:#9BE3A0}",
    ".nn1 .editor{width:100%;min-height:280px;font:400 12.5px/1.55 var(--mono);color:var(--n-ink);background:var(--n-code);border:1px solid var(--n-line);border-radius:6px;padding:11px;resize:vertical;tab-size:2;white-space:pre;overflow:auto}",
    ".nn1 .err{color:var(--n-bad);font-family:var(--mono);font-size:12.5px;white-space:pre-wrap}",
    ".nn1 .tests{list-style:none;padding:0;margin:8px 0;font-size:13px}",
    ".nn1 .tests li{padding:4px 0;border-bottom:1px solid var(--n-line);display:grid;grid-template-columns:22px 1fr;gap:6px}",
    ".nn1 .tests li.p::before{content:'\\2713';color:var(--n-ok);font-weight:700}.nn1 .tests li.f::before{content:'\\2717';color:var(--n-bad);font-weight:700}",
    ".nn1 .tests li small{grid-column:2;color:var(--n-muted);font-family:var(--mono);font-size:11.5px}",
    ".nn1 pre.sol{font:400 12px/1.5 var(--mono);background:var(--n-code);border:1px solid var(--n-line);border-radius:6px;padding:11px;overflow-x:auto;margin:8px 0;white-space:pre}",
    ".nn1 .notice{border-left:3px solid var(--n-warn);padding:8px 12px;background:var(--n-surface2);font-size:13px;margin:10px 0}",
    ".nn1 .sw{display:inline-block;width:12px;height:12px;border-radius:2px;margin-right:6px;vertical-align:-1px}",
    ".nn1 .legend{display:flex;flex-wrap:wrap;gap:16px;font-size:12.5px;color:var(--n-muted)}",
    ".nn1 .navlist{list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px}",
    ".nn1 .navlist button{width:100%;display:grid;grid-template-columns:24px 1fr 16px;text-align:left;font:13px var(--sans);color:var(--n-muted);background:var(--n-surface);border:1px solid var(--n-line);border-radius:6px;padding:6px 9px}",
    ".nn1 .navlist button .n{font-family:var(--mono);font-size:12px}.nn1 .navlist button.done{color:var(--n-ink)}",
    ".nn1 .navlist button.done::after{content:'\\2713';color:var(--n-ok);font-weight:600}",
    ".nn1 .bar{height:4px;background:var(--n-line);border-radius:2px;margin-top:6px;overflow:hidden}",
    ".nn1 .bar span{display:block;height:100%;width:0;background:var(--n-fire);transition:width .4s}",
    ".nn1 .tl{border-collapse:collapse;font-family:var(--mono);font-size:12.5px;margin-top:6px}",
    ".nn1 .tl th{font-weight:500;text-align:left;padding:3px 10px 3px 0;color:var(--n-muted);white-space:nowrap;background:none;border:none}",
    ".nn1 .tl td{padding:2px;border:none;background:none}",
    ".nn1 .tl .cell{width:28px;height:24px;border:1px solid var(--n-line);border-radius:4px;background:var(--n-surface);display:block;padding:0}",
    ".nn1 .tl .cell.on{background:var(--n-fire);border-color:var(--n-fire)}",
    ".nn1 .tl .cell.out.on{background:var(--n-calm);border-color:var(--n-calm)}",
    ".nn1 .netsvg{width:100%;height:auto;display:block;background:var(--n-surface);border:1px solid var(--n-line);border-radius:6px}",
    ".nn1 .netsvg text{font-family:var(--mono);font-size:12px;fill:var(--n-ink)}",
    ".nn1 .netsvg .edge{stroke:var(--n-line);stroke-width:2}.nn1 .netsvg .edge.on{stroke:var(--n-ink)}",
    ".nn1 .netsvg .node{fill:var(--n-surface2);stroke:var(--n-ink);stroke-width:1.6}.nn1 .netsvg .node.on{fill:var(--n-fire)}",
    ".nn1 .netsvg .node.on + text,.nn1 .netsvg text.onlabel{fill:#fff}",
    ".nn1 .netsvg .w{font-size:11px;fill:var(--n-muted)}",
    "@media (max-width:820px){.nn1 .bench,.nn1 .bench.wide-left{grid-template-columns:minmax(0,1fr)}}"
  ].join("\n");
  function injectCSS() {
    if (document.getElementById("nn1-style")) return;
    var s = document.createElement("style");
    s.id = "nn1-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------- helpers -- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("nn01:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("nn01:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function debounce(f, ms) { var t; return function () { var a = arguments; clearTimeout(t); t = setTimeout(function () { f.apply(null, a); }, ms); }; }
  function theme(el) {
    var s = getComputedStyle(el); var g = function (n) { return s.getPropertyValue(n).trim(); };
    return { surface: g("--n-surface"), surface2: g("--n-surface2"), ink: g("--n-ink"), muted: g("--n-muted"), line: g("--n-line"),
      fire: g("--n-fire"), fireSoft: g("--n-fire-soft"), calm: g("--n-calm"), calmSoft: g("--n-calm-soft"), warn: g("--n-warn"), ok: g("--n-ok"), bad: g("--n-bad") };
  }
  function rgb(h) { h = (h || "#000").replace("#", ""); if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join(""); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function fit(cv, aspect) {
    var w = Math.max(200, cv.parentElement.clientWidth - 2), h = Math.round(w * aspect), d = window.devicePixelRatio || 1;
    cv.width = Math.round(w * d); cv.height = Math.round(h * d); cv.style.width = w + "px"; cv.style.height = h + "px";
    var ctx = cv.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0); return { ctx: ctx, w: w, h: h };
  }
  /* One resize listener for every mounted lab; labs whose host has left the page are dropped. */
  var redraws = [];
  function onRedraw(host, f) { redraws.push({ host: host, f: f }); }
  var redrawAll = debounce(function () {
    redraws = redraws.filter(function (r) { return r.host.isConnected; });
    redraws.forEach(function (r) { try { r.f(); } catch (e) { console.error(e); } });
  }, 120);
  window.addEventListener("resize", redrawAll);
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redrawAll); } catch (e) {}
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function corrData(n, seed) {
    var r = mulberry(seed), out = [];
    for (var i = 0; i < n; i++) {
      var u = Math.max(1e-9, r()), v = r();
      var z1 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v), z2 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
      out.push([1.7320508 * z1, 0.8660254 * z1 + 0.5 * z2]);
    }
    return out;
  }
  var PC_ANGLE = Math.atan2(0.5352, 1); // principal direction of cov [[3,1.5],[1.5,1]]
  function angTo(v) { var a = Math.abs(Math.atan2(v[1], v[0]) - PC_ANGLE) * 180 / Math.PI; a = a % 180; return Math.min(a, 180 - a); }
  var fmt = function (v, d) { return (Math.abs(v) < 5e-13 ? 0 : v).toFixed(d === undefined ? 2 : d); };
  function frame(w, h, x0, x1, y0, y1, pad) {
    pad = pad === undefined ? 8 : pad;
    var sx = (w - 2 * pad) / (x1 - x0), sy = (h - 2 * pad) / (y1 - y0);
    return { X: function (x) { return pad + (x - x0) * sx; }, Y: function (y) { return h - pad - (y - y0) * sy; },
      ix: function (px) { return x0 + (px - pad) / sx; }, iy: function (py) { return y0 + (h - pad - py) / sy; }, pad: pad };
  }
  function axes(ctx, F, w, h, T, x0, x1, y0, y1) {
    ctx.strokeStyle = T.line; ctx.lineWidth = 1; ctx.beginPath();
    if (x0 < 0 && x1 > 0) { ctx.moveTo(F.X(0), 0); ctx.lineTo(F.X(0), h); }
    if (y0 < 0 && y1 > 0) { ctx.moveTo(0, F.Y(0)); ctx.lineTo(w, F.Y(0)); }
    ctx.stroke();
  }
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function button(label, cls, onclick) { var b = el("button", cls || "btn small", label); b.type = "button"; if (onclick) b.onclick = onclick; return b; }

  /* Every lab gets the reader's chrome (title + hint) and a scoped body. */
  function mountShell(host, title, hint, html) {
    injectCSS();
    host.innerHTML = '<div class="lab-head"><span class="lab-title"></span><span class="lab-hint"></span></div><div class="nn1"></div>';
    host.querySelector(".lab-title").textContent = title;
    host.querySelector(".lab-hint").textContent = hint || "";
    var body = host.querySelector(".nn1");
    body.innerHTML = html;
    return { body: body, $: function (s) { return body.querySelector(s); }, $$: function (s) { return Array.prototype.slice.call(body.querySelectorAll(s)); } };
  }

  /* ------------------------------------------------------------ progress -- */
  var SECTIONS = [
    ["history", "A brief history"], ["mp", "McCulloch–Pitts"], ["hebb", "Hebbian learning"], ["perceptron", "The perceptron"],
    ["regions", "Building regions"], ["cylinder", "Polygons to cylinders"], ["pulses", "Pulses and regression"],
    ["katas", "Code katas"], ["problems", "Paper problems"], ["quiz", "Review quiz"]
  ];
  var LAB_OF = { history: "nn-history", mp: "nn-mp", hebb: "nn-hebb", perceptron: "nn-perceptron", regions: "nn-regions",
    cylinder: "nn-cylinder", pulses: "nn-pulses", katas: "nn-katas", problems: "nn-problems", quiz: "nn-quiz" };
  function progress() { return store.get("progress", {}); }
  function markDone(id) {
    var p = progress(); if (p[id]) return;
    p[id] = true; store.set("progress", p);
    window.dispatchEvent(new Event("nn01-progress"));
  }

  /* ---------------------------------------------------------------- quiz -- */
  function renderQuiz(container, title, qs, key, onComplete) {
    var saved = store.get("quiz:" + key, {});
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
     0. OVERVIEW — legend, progress and lab index
     ========================================================================= */
  GU.lab("nn-overview", function (host) {
    var S = mountShell(host, "Ten labs for this chapter", "progress is kept in this browser",
      '<p class="intro">Ten hands-on labs follow the chapter in order: from Aristotle\'s laws of association, through McCulloch–Pitts, Hebb and Rosenblatt, to networks that carve out any region you like. Wire neurons, train perceptrons, write networks and check them against a target.</p>' +
      '<div class="legend"><span><i class="sw" style="background:var(--n-fire)"></i>fires, output 1, class 1</span>' +
      '<span><i class="sw" style="background:var(--n-calm)"></i>target, class 0</span>' +
      '<span><i class="sw" style="background:var(--n-warn)"></i>fires where it shouldn\'t</span></div>' +
      '<p class="cap" style="margin-top:12px"><span data-count>0 of 10 labs done</span></p><div class="bar"><span data-bar></span></div>' +
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
      if (!host.isConnected) { window.removeEventListener("nn01-progress", render); return; }
      var p = progress(), n = SECTIONS.filter(function (s) { return p[s[0]]; }).length;
      S.$$("[data-nav] button").forEach(function (b) { b.classList.toggle("done", !!p[b.dataset.id]); });
      S.$("[data-count]").textContent = n + " of " + SECTIONS.length + " labs done";
      S.$("[data-bar]").style.width = (100 * n / SECTIONS.length) + "%";
    }
    window.addEventListener("nn01-progress", render);
    render();
  });

  /* =========================================================================
     1. HISTORY
     ========================================================================= */
  var TL = [
    { y: "c. 350 BC", n: "Aristotle", i: "Four laws of association: contiguity, frequency, similarity, contrast." },
    { y: "1749", n: "David Hartley", i: "Observations on Man: memories as tiny vibrations (\"vibratiuncles\") linked to current senses." },
    { y: "1873", n: "Alexander Bain", i: "Mind and Body: the information is in the connections. Neural groupings." },
    { y: "1943", n: "McCulloch and Pitts", i: "Neurons as threshold logic units computing propositions. No learning rule." },
    { y: "1948", n: "Alan Turing", i: "B-type \"unorganised machines\": NAND networks with learnable connection modifiers." },
    { y: "1949", n: "Donald Hebb", i: "Neurons that fire together wire together: w ← w + ηxy." },
    { y: "1958", n: "Frank Rosenblatt", i: "The perceptron: a trainable machine of threshold units. Error-correction and its convergence proofs followed by 1962." },
    { y: "1969", n: "Minsky and Papert", i: "\"Perceptrons\": a single unit cannot compute XOR, so networks are required." },
    { y: "1986", n: "Rumelhart, Hinton, McClelland", i: "Parallel Distributed Processing: the requirements of a connectionist system." }
  ];
  var VN = [
    ["Program and data sit in a memory separate from the processor", "v"],
    ["All world knowledge is stored in the connections between units", "c"],
    ["Many simple non-linear processing units work in parallel", "c"],
    ["A central processor fetches and executes instructions one by one", "v"],
    ["Changing the behaviour means changing connection strengths", "c"],
    ["Changing the behaviour means rewriting the instructions", "v"]
  ];
  GU.lab("nn-history", function (host) {
    var S = mountShell(host, "Lab 1 · A brief history", "order the milestones, then sort the statements",
      '<p class="intro">Associationism said we learn by linking ideas. Connectionism said those links live in the connections between neurons. Put the milestones in order, from earliest to latest.</p>' +
      '<div class="bench wide-left"><div><ol class="sortlist" data-tl></ol>' +
      '<div class="row"><button class="btn primary" type="button" data-check>Check order</button><button class="btn" type="button" data-shuffle>Shuffle</button><span class="status" data-tlstatus></span></div></div>' +
      '<div class="npanel"><h3 style="margin-top:0">Von Neumann or connectionist?</h3><p class="cap" style="margin-top:4px">The two machines store a program in different places. Assign each statement.</p>' +
      '<div class="sorter" data-vn></div><p class="status" data-vnstatus></p></div></div><div class="quiz" data-quiz></div>');
    var tlOrder = store.get("tl-order", null), tlRevealed = false;
    function shuffleTL() {
      tlOrder = TL.map(function (_, i) { return i; });
      for (var i = tlOrder.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = tlOrder[i]; tlOrder[i] = tlOrder[j]; tlOrder[j] = t; }
      if (tlOrder.every(function (v, i) { return v === i; })) { var s = tlOrder[0]; tlOrder[0] = tlOrder[1]; tlOrder[1] = s; }
      tlRevealed = false; store.set("tl-order", tlOrder); S.$("[data-tlstatus]").textContent = ""; renderTL();
    }
    function renderTL(check) {
      var ul = S.$("[data-tl]"); ul.innerHTML = "";
      tlOrder.forEach(function (idx, pos) {
        var it = TL[idx], li = el("li");
        if (check) li.className = idx === pos ? "good" : "badpos";
        li.innerHTML = '<span class="yr">' + ((tlRevealed || (check && idx === pos)) ? it.y : "?") + "</span><span><b>" + it.n + '</b><span class="idea">' + it.i + "</span></span>";
        var ud = el("span", "updown");
        var up = button("↑"), dn = button("↓");
        up.setAttribute("aria-label", "Move " + it.n + " earlier"); up.disabled = pos === 0;
        dn.setAttribute("aria-label", "Move " + it.n + " later"); dn.disabled = pos === tlOrder.length - 1;
        up.onclick = function () { var t = tlOrder[pos - 1]; tlOrder[pos - 1] = tlOrder[pos]; tlOrder[pos] = t; store.set("tl-order", tlOrder); renderTL(); };
        dn.onclick = function () { var t = tlOrder[pos + 1]; tlOrder[pos + 1] = tlOrder[pos]; tlOrder[pos] = t; store.set("tl-order", tlOrder); renderTL(); };
        ud.append(up, dn); li.appendChild(ud); ul.appendChild(li);
      });
    }
    if (!tlOrder || tlOrder.length !== TL.length) shuffleTL(); else renderTL();
    S.$("[data-shuffle]").onclick = shuffleTL;
    S.$("[data-check]").onclick = function () {
      var right = tlOrder.filter(function (v, i) { return v === i; }).length, st = S.$("[data-tlstatus]");
      if (right === TL.length) { tlRevealed = true; renderTL(true); st.textContent = "All in order."; st.className = "status ok"; markDone("history"); }
      else { renderTL(true); st.textContent = right + " of " + TL.length + " in the right place. Green ones are fixed."; st.className = "status meh"; }
    };
    var vnAns = store.get("vn", {});
    function renderVN() {
      var box = S.$("[data-vn]"); box.innerHTML = ""; var right = 0, done = 0;
      VN.forEach(function (row, i) {
        var d = el("div", "item"), a = vnAns[i];
        if (a) { done++; if (a === row[1]) { right++; d.classList.add("good"); } else d.classList.add("badpos"); }
        var s = el("span", null, row[0]), g = el("span", "updown");
        [["v", "Von Neumann"], ["c", "Connectionist"]].forEach(function (kl) {
          var b = button(kl[1]); b.setAttribute("aria-pressed", a === kl[0] ? "true" : "false");
          b.onclick = function () { vnAns[i] = kl[0]; store.set("vn", vnAns); renderVN(); };
          g.appendChild(b);
        });
        d.append(s, g); box.appendChild(d);
      });
      var st = S.$("[data-vnstatus]");
      if (done === VN.length) { st.textContent = right === VN.length ? "All six correct." : right + " of 6 correct. Red ones need another look."; st.className = "status " + (right === VN.length ? "ok" : "meh"); }
      else st.textContent = "";
    }
    renderVN();
    renderQuiz(S.$("[data-quiz]"), "Checkpoint", [
      { q: "Who first proposed that the information is stored in the connections, which is the core claim of connectionism?", o: ["Aristotle", "Alexander Bain", "David Hartley", "Alan Turing"], a: 1, why: "Bain, in <em>Mind and Body</em> (1873). Hartley (1749) anticipated linking memories to senses, but nobody yet knew about neurons." },
      { q: "Roughly how many connections are there between neurons in the human brain?", o: ["1 million", "5 billion", "80 billion", "100 trillion"], a: 3, why: "On the order of 10¹⁴ synapses. 80 billion is roughly the number of neurons. Bain's 1873 estimate of 5,000 million <em>fibres</em> counted wires, not synapses." },
      { q: "Which of these is <em>not</em> one of Aristotle's four laws of association?", o: ["Contrast", "Frequency", "Causality", "Similarity"], a: 2, why: "The four are contiguity, frequency, similarity and contrast. Cause and effect was added by later associationists such as Hume." },
      { q: "Why did Bain eventually recant his own theory?", o: ["Experiments showed neurons were not connected", "He calculated the brain would need too many neurons and connections", "Hebb proved him wrong", "He could not explain inhibition"], a: 1, why: "By 1903 he believed storing every association would need an implausible number of neurons and connections." },
      { q: "In a connectionist machine, where does the \"program\" live?", o: ["In a separate instruction memory", "In the processor's control unit", "In the connections between units", "In the input data"], a: 2, why: "There is no separate program store: the pattern of connections is the program, and it may also serve as memory." }
    ], "history");
  });

  /* =========================================================================
     2. MCCULLOCH–PITTS
     ========================================================================= */
  var MP_CH = [
    { id: "and", name: "A AND B", vars: 2, f: function (a, b) { return a && b; } },
    { id: "or", name: "A OR B", vars: 2, f: function (a, b) { return a || b; } },
    { id: "andnot", name: "A AND NOT B", vars: 2, f: function (a, b) { return a && !b; } },
    { id: "maj", name: "At least 2 of 3", vars: 3, f: function (a, b, c) { return (a + b + c) >= 2; } },
    { id: "and3not", name: "A AND B AND NOT C", vars: 3, f: function (a, b, c) { return a && b && !c; } },
    { id: "nor", name: "NOT A AND NOT B", vars: 2, f: function (a, b) { return !a && !b; } }
  ];
  GU.lab("nn-mp", function (host) {
    var S = mountShell(host, "Lab 2 · McCulloch–Pitts neurons", "pick a challenge, set synapses and θ",
      '<p class="intro">Signals come in through the dendrites to the soma, and one axon carries the output. In the 1943 model, each active excitatory input adds 1. The neuron fires when the sum reaches its threshold θ, and <em>any</em> active inhibitory input vetoes firing outright. Pick a challenge, then set input types and θ until every row of the truth table matches.</p>' +
      '<div class="row chips" role="group" aria-label="Challenges" data-ch></div>' +
      '<div class="bench"><div class="npanel neuron" data-neuron><svg viewBox="0 0 440 230" role="img" aria-label="Neuron diagram">' +
      '<text class="lbl" x="18" y="18">dendrites</text><text class="lbl" x="180" y="62">soma</text><text class="lbl" x="300" y="98">axon</text>' +
      '<path class="wire" data-w="0" d="M40 50 C110 50 130 105 175 112"/><path class="wire" data-w="1" d="M40 115 L175 115"/><path class="wire" data-w="2" d="M40 180 C110 180 130 125 175 118"/>' +
      '<circle cx="30" cy="50" r="13" fill="var(--n-surface2)" stroke="var(--n-ink)"/><text x="25" y="55">A</text>' +
      '<circle cx="30" cy="115" r="13" fill="var(--n-surface2)" stroke="var(--n-ink)"/><text x="25" y="120">B</text>' +
      '<circle cx="30" cy="180" r="13" fill="var(--n-surface2)" stroke="var(--n-ink)"/><text x="25" y="185">C</text>' +
      '<g data-m="0"></g><g data-m="1"></g><g data-m="2"></g>' +
      '<circle class="soma" cx="210" cy="115" r="34"/><text class="theta" x="196" y="120" data-theta>θ=2</text>' +
      '<path class="axon" d="M244 115 L400 115"/><path d="M400 108 L414 115 L400 122 Z" fill="var(--n-ink)"/>' +
      '<circle class="spike" cx="250" cy="115" r="6"/><text x="380" y="145" data-out>y = 0</text></svg>' +
      '<p class="cap">Arrowheads mark excitatory synapses. Bars mark inhibitory ones.</p></div>' +
      '<div><div class="inputs" data-inputs></div>' +
      '<label class="ctl"><span>Threshold θ</span><input type="range" min="0" max="3" step="1" value="0" data-th><output data-tho>0</output></label>' +
      '<p class="cap" data-goal></p><table class="tt" data-tt></table><p class="status" data-status></p></div></div>' +
      '<div class="quiz" data-quiz></div>');
    var mpSolved = store.get("mp-solved", {}), mpCh = MP_CH[0];
    var mpState = { type: ["exc", "exc", "off"], val: [1, 1, 0], th: 0 };
    function mpFire(vals) {
      var s = 0;
      for (var i = 0; i < 3; i++) {
        if (mpState.type[i] === "off") continue;
        if (mpState.type[i] === "inh" && vals[i]) return 0;
        if (mpState.type[i] === "exc" && vals[i]) s++;
      }
      return s >= mpState.th ? 1 : 0;
    }
    function renderChips() {
      var c = S.$("[data-ch]"); c.innerHTML = "";
      MP_CH.forEach(function (ch) {
        var b = el("button", "chip" + (mpSolved[ch.id] ? " solved" : ""), ch.name); b.type = "button";
        b.setAttribute("aria-pressed", ch === mpCh ? "true" : "false");
        b.onclick = function () { mpCh = ch; renderChips(); render(); };
        c.appendChild(b);
      });
    }
    function renderInputs() {
      var box = S.$("[data-inputs]"); box.innerHTML = "";
      ["A", "B", "C"].forEach(function (n, i) {
        var d = el("div", "inp");
        var v = button(mpState.val[i] ? "1" : "0"); v.setAttribute("aria-pressed", mpState.val[i] ? "true" : "false"); v.setAttribute("aria-label", "Toggle input " + n);
        v.onclick = function () { mpState.val[i] ^= 1; renderInputs(); render(); };
        var sel = el("select"); sel.setAttribute("aria-label", "Synapse type for " + n);
        [["exc", "excitatory"], ["inh", "inhibitory"], ["off", "not connected"]].forEach(function (kl) { var o = el("option", null, kl[1]); o.value = kl[0]; if (mpState.type[i] === kl[0]) o.selected = true; sel.appendChild(o); });
        sel.onchange = function () { mpState.type[i] = sel.value; render(); };
        d.append(el("b", null, n), v, sel); box.appendChild(d);
      });
    }
    function render() {
      var fire = mpFire(mpState.val);
      S.$("[data-neuron]").classList.toggle("firing", !!fire);
      S.$("[data-out]").textContent = "y = " + fire; S.$("[data-theta]").textContent = "θ=" + mpState.th;
      var ends = [[175, 112], [175, 115], [175, 118]];
      for (var i = 0; i < 3; i++) {
        var w = S.$('[data-w="' + i + '"]');
        w.setAttribute("class", "wire" + (mpState.type[i] === "inh" ? " inh" : "") + (mpState.val[i] && mpState.type[i] !== "off" ? " on" : ""));
        w.style.strokeDasharray = mpState.type[i] === "off" ? "4 6" : "";
        var m = S.$('[data-m="' + i + '"]'), x = ends[i][0], y = ends[i][1];
        m.innerHTML = mpState.type[i] === "exc" ? '<path d="M' + (x - 12) + " " + (y - 7) + " L" + x + " " + y + " L" + (x - 12) + " " + (y + 7) + '" fill="none" stroke="var(--n-ink)" stroke-width="2"/>'
          : mpState.type[i] === "inh" ? '<path d="M' + (x - 4) + " " + (y - 10) + " L" + (x - 4) + " " + (y + 10) + '" stroke="var(--n-bad)" stroke-width="4"/>' : "";
      }
      var ch = mpCh, rows = [], n = ch.vars;
      for (var k = 0; k < (1 << n); k++) { var bits = []; for (var j = n - 1; j >= 0; j--) bits.push((k >> j) & 1); while (bits.length < 3) bits.push(0); rows.push(bits); }
      var allOk = true, html = "<tr><th>A</th><th>B</th>" + (n === 3 ? "<th>C</th>" : "") + "<th>target</th><th>yours</th></tr>";
      rows.forEach(function (r) {
        var t = ch.f(r[0], r[1], r[2]) ? 1 : 0, y = mpFire(r); if (t !== y) allOk = false;
        html += "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td>" + (n === 3 ? "<td>" + r[2] + "</td>" : "") + "<td>" + t + '</td><td class="' + (t === y ? "y" : "n") + '">' + y + "</td></tr>";
      });
      if (n === 2 && mpState.type[2] !== "off") allOk = false;
      S.$("[data-tt]").innerHTML = html;
      S.$("[data-goal]").textContent = n === 2 ? "Two-input challenge: leave C not connected." : "Three-input challenge.";
      var st = S.$("[data-status]");
      if (allOk) { st.textContent = "Every row matches."; st.className = "status ok"; if (!mpSolved[ch.id]) { mpSolved[ch.id] = true; store.set("mp-solved", mpSolved); renderChips(); } }
      else { st.textContent = n === 2 && mpState.type[2] !== "off" ? "Disconnect C for a two-input gate." : "Some rows differ."; st.className = "status meh"; }
      if (Object.keys(mpSolved).length >= 4) markDone("mp");
      if (ch.id === "nor" && !allOk) S.$("[data-goal]").textContent = "Two-input challenge. Hint: what does a threshold of 0 do?";
    }
    S.$("[data-th]").oninput = function (e) { mpState.th = +e.target.value; S.$("[data-tho]").textContent = mpState.th; render(); };
    renderChips(); renderInputs(); render();
    renderQuiz(S.$("[data-quiz]"), "Checkpoint", [
      { q: "A McCulloch–Pitts neuron has threshold 2, excitatory inputs A and B, and inhibitory input C. All three are active. What is the output?", o: ["1, since the excitatory sum reaches 2", "0, since any active inhibitory input vetoes firing", "1, since inhibition only subtracts 1", "It depends on timing"], a: 1, why: "In the 1943 model, inhibition is absolute: one active inhibitory synapse prevents firing whatever the other inputs are." },
      { q: "What did the McCulloch–Pitts model lack, which Hebb later tried to supply?", o: ["Inhibition", "Thresholds", "A learning mechanism", "Networks with loops"], a: 2, why: "The weights and thresholds were fixed by design. Nothing in the model explained how they could change with experience." },
      { q: "How did McCulloch and Pitts propose that networks could hold memory?", o: ["Through weight changes", "Through loops that keep activity circulating", "Through inhibitory synapses", "Through the threshold value"], a: 1, why: "Loopy networks can \"remember\", an idea Kubie had proposed in 1930 to explain memory in the nervous system." },
      { q: "What did McCulloch and Pitts claim about their networks when supplied with a tape?", o: ["They were proven Turing complete", "They were claimed to be equivalent to Turing machines, without a proof", "They could only compute linear functions", "They needed learning to be universal"], a: 1, why: "They claimed Turing equivalence but did not prove it themselves, which is one of the standard criticisms of the paper." }
    ], "mp");
  });

  /* =========================================================================
     2b. The heat/cold illusion (lesson figure)
     ========================================================================= */
  GU.lab("nn-heatcold", function (host) {
    var STEPS = 9;
    var S = mountShell(host, "Figure · Heat from a brief cold touch", "toggle receptor cells, read the sensations",
      '<p class="intro">Each unit is a McCulloch–Pitts neuron with a one-step synaptic delay. Unit <b>a</b> relays the cold receptor; unit <b>b</b> fires when cold was present two steps ago but has just stopped. Heat is felt one step after the heat receptor fires <em>or</em> after <b>b</b> fires; cold is felt only after cold has lasted two steps.</p>' +
      '<div class="row chips" data-presets></div><div style="overflow-x:auto"><table class="tl" data-grid></table></div>' +
      '<div class="readout" data-read style="margin-top:10px"></div>');
    var heat = new Array(STEPS).fill(0), cold = new Array(STEPS).fill(0);
    var PRESETS = [
      ["Brief cold touch", function () { heat.fill(0); cold.fill(0); cold[1] = 1; }],
      ["Sustained cold", function () { heat.fill(0); cold.fill(0); cold[1] = cold[2] = cold[3] = 1; }],
      ["Real heat", function () { heat.fill(0); cold.fill(0); heat[2] = 1; }],
      ["Clear", function () { heat.fill(0); cold.fill(0); }]
    ];
    PRESETS.forEach(function (p) { S.$("[data-presets]").appendChild(button(p[0], "chip", function () { p[1](); render(); })); });
    PRESETS[0][1]();
    function simulate() {
      var a = [], b = [], H = [], C = [];
      for (var t = 0; t < STEPS; t++) {
        a[t] = t >= 1 ? cold[t - 1] : 0;                                   // relay of the cold receptor
        b[t] = t >= 1 ? (a[t - 1] && !cold[t - 1] ? 1 : 0) : 0;            // a excites, cold inhibits (absolute)
        H[t] = t >= 1 ? (heat[t - 1] || b[t - 1] ? 1 : 0) : 0;             // threshold 1: OR
        C[t] = t >= 1 ? (a[t - 1] && cold[t - 1] ? 1 : 0) : 0;             // threshold 2: AND
      }
      return { a: a, b: b, H: H, C: C };
    }
    function render() {
      var s = simulate(), g = S.$("[data-grid]");
      var rows = [["heat receptor 1", heat, true, ""], ["cold receptor 2", cold, true, ""], ["unit a (relay)", s.a, false, ""], ["unit b (cold stopped)", s.b, false, ""],
        ["heat felt 3", s.H, false, " out"], ["cold felt 4", s.C, false, " out"]];
      var html = "<tr><th>t</th>" + heat.map(function (_, t) { return '<th style="text-align:center">' + t + "</th>"; }).join("") + "</tr>";
      rows.forEach(function (r, ri) {
        html += "<tr><th>" + r[0] + "</th>" + r[1].map(function (v, t) {
          return '<td><button type="button" class="cell' + r[3] + (v ? " on" : "") + '" data-r="' + ri + '" data-t="' + t + '"' + (r[2] ? "" : " disabled") + ' aria-label="' + r[0] + " at t=" + t + ": " + v + '"></button></td>';
        }).join("") + "</tr>";
      });
      g.innerHTML = html;
      g.querySelectorAll("button.cell:not([disabled])").forEach(function (b) {
        b.onclick = function () { var arr = b.dataset.r === "0" ? heat : cold; arr[+b.dataset.t] ^= 1; render(); };
      });
      var heatAt = s.H.map(function (v, t) { return v ? t : null; }).filter(function (v) { return v != null; });
      var coldAt = s.C.map(function (v, t) { return v ? t : null; }).filter(function (v) { return v != null; });
      S.$("[data-read]").textContent = "heat felt at t = " + (heatAt.join(", ") || "never") + "\ncold felt at t = " + (coldAt.join(", ") || "never") +
        "\nrule: H(t) = h(t−1) OR [c(t−3) AND NOT c(t−2)];  C(t) = c(t−2) AND c(t−1)";
    }
    render();
  });

  /* =========================================================================
     2c. Turing's B-type links (lesson figure)
     ========================================================================= */
  GU.lab("nn-btype", function (host) {
    var S = mountShell(host, "Figure · Training a B-type machine by setting modifiers", "toggle the four modifiers, or let the search find them",
      '<p class="intro">Two NAND units. Every connection passes through a B-type link. In Turing\'s definition a link\'s modifier puts it in one of two modes: <b>on</b>, where the link passes the <em>negation</em> of its input, or <b>off</b>, where its output is stuck at 1 and the connection is effectively cut. N1 reads A and B; N2 reads N1 and A. Nothing about the units changes: training means choosing the four modifiers.</p>' +
      '<div class="bench"><div><svg class="netsvg" viewBox="0 0 440 210" data-svg role="img" aria-label="B-type network diagram"></svg>' +
      '<div class="row" data-mods></div></div>' +
      '<div><label class="ctl"><span>Target</span><select data-target></select><span></span></label>' +
      '<table class="tt" data-tt></table><p class="status" data-status></p>' +
      '<div class="row"><button class="btn" type="button" data-search>Search all 16 settings</button></div><div class="readout" data-read></div></div></div>');
    var mods = [1, 1, 1, 0]; // L1 A→N1, L2 B→N1, L3 N1→N2, L4 A→N2 ; 1 = on (inverts), 0 = off (stuck at 1)
    var nand = function (x, y) { return x && y ? 0 : 1; };
    var link = function (on, x) { return on ? 1 - x : 1; };
    function run(m, A, B) { var n1 = nand(link(m[0], A), link(m[1], B)); return { n1: n1, out: nand(link(m[2], n1), link(m[3], A)) }; }
    var TARGETS = [["A OR B", function (a, b) { return a | b; }], ["A", function (a) { return a; }], ["B", function (a, b) { return b; }], ["constant 0", function () { return 0; }],
      ["A AND B", function (a, b) { return a & b; }], ["NOT A", function (a) { return 1 - a; }], ["A XOR B", function (a, b) { return a ^ b; }]];
    TARGETS.forEach(function (t, i) { var o = el("option", null, t[0]); o.value = i; S.$("[data-target]").appendChild(o); });
    var names = ["L1 A→N1", "L2 B→N1", "L3 N1→N2", "L4 A→N2"];
    function draw(A, B) {
      var r = run(mods, A, B), on = function (v) { return v ? " on" : ""; };
      var wire = function (x1, y1, x2, y2, pass, sig, label) {
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        return '<line class="edge' + on(pass && sig) + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>' +
          '<rect x="' + (mx - 22) + '" y="' + (my - 10) + '" width="44" height="20" rx="4" fill="' + (pass ? "var(--n-ok)" : "var(--n-bad)") + '" opacity=".9"/>' +
          '<text class="onlabel" x="' + mx + '" y="' + (my + 4) + '" text-anchor="middle" style="font-size:10px">' + (pass ? "on: ¬" : "off: 1") + "</text>" +
          '<text class="w" x="' + mx + '" y="' + (my - 14) + '" text-anchor="middle">' + label + "</text>";
      };
      S.$("[data-svg]").innerHTML =
        wire(50, 60, 200, 80, mods[0], A, "L1") + wire(50, 150, 200, 100, mods[1], B, "L2") +
        wire(230, 90, 360, 110, mods[2], r.n1, "L3") + wire(50, 60, 360, 120, mods[3], A, "L4") +
        '<circle class="node' + on(A) + '" cx="40" cy="60" r="16"/><text x="40" y="64" text-anchor="middle"' + (A ? ' class="onlabel"' : "") + ">A</text>" +
        '<circle class="node' + on(B) + '" cx="40" cy="150" r="16"/><text x="40" y="154" text-anchor="middle"' + (B ? ' class="onlabel"' : "") + ">B</text>" +
        '<circle class="node' + on(r.n1) + '" cx="215" cy="90" r="20"/><text x="215" y="94" text-anchor="middle"' + (r.n1 ? ' class="onlabel"' : "") + ">N1</text>" +
        '<circle class="node' + on(r.out) + '" cx="380" cy="115" r="20"/><text x="380" y="119" text-anchor="middle"' + (r.out ? ' class="onlabel"' : "") + ">N2</text>" +
        '<text class="w" x="215" y="128" text-anchor="middle">NAND</text><text class="w" x="380" y="153" text-anchor="middle">NAND · output</text>' +
        '<text class="w" x="20" y="200">showing A=' + A + ", B=" + B + "</text>";
    }
    var showA = 1, showB = 1;
    function render() {
      var box = S.$("[data-mods]"); box.innerHTML = "";
      names.forEach(function (n, i) {
        var b = button(n + ": " + (mods[i] ? "on (invert)" : "off (stuck at 1)")); b.setAttribute("aria-pressed", mods[i] ? "true" : "false");
        b.onclick = function () { mods[i] ^= 1; render(); }; box.appendChild(b);
      });
      var t = TARGETS[+S.$("[data-target]").value][1], ok = true, html = "<tr><th>A</th><th>B</th><th>target</th><th>N2</th><th></th></tr>";
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(function (ab) {
        var y = run(mods, ab[0], ab[1]).out, tv = t(ab[0], ab[1]); if (y !== tv) ok = false;
        html += "<tr><td>" + ab[0] + "</td><td>" + ab[1] + "</td><td>" + tv + '</td><td class="' + (y === tv ? "y" : "n") + '">' + y + '</td><td><button type="button" class="btn small" data-show="' + ab.join("") + '">show</button></td></tr>';
      });
      S.$("[data-tt]").innerHTML = html;
      S.$$("[data-show]").forEach(function (b) { b.onclick = function () { showA = +b.dataset.show[0]; showB = +b.dataset.show[1]; draw(showA, showB); }; });
      var st = S.$("[data-status]"); st.textContent = ok ? "These modifiers realise the target." : "Some rows differ."; st.className = "status " + (ok ? "ok" : "meh");
      draw(showA, showB);
    }
    S.$("[data-target]").onchange = function () { S.$("[data-read]").textContent = ""; render(); };
    S.$("[data-search]").onclick = function () {
      var t = TARGETS[+S.$("[data-target]").value][1], found = [];
      for (var k = 0; k < 16; k++) {
        var m = [k & 1, (k >> 1) & 1, (k >> 2) & 1, (k >> 3) & 1];
        if ([[0, 0], [0, 1], [1, 0], [1, 1]].every(function (ab) { return run(m, ab[0], ab[1]).out === t(ab[0], ab[1]); })) found.push(m);
      }
      if (found.length) { mods = found[0].slice(); render(); }
      S.$("[data-read]").textContent = found.length
        ? found.length + " of 16 settings work. First found: " + found[0].map(function (v, i) { return "L" + (i + 1) + "=" + (v ? "on" : "off"); }).join(", ") + "."
        : "No setting of these four modifiers works. This is Copeland and Proudfoot's point: with links that can only invert or cut, some functions are out of reach of a given B-type machine. Two modifiers in series on each connection (invert twice = pass) fixes it.";
    };
    render();
  });

  /* =========================================================================
     3. HEBB
     ========================================================================= */
  GU.lab("nn-hebb", function (host) {
    var S = mountShell(host, "Lab 3 · Hebbian learning, and why it explodes", "run both rules on the same data",
      '<p class="intro">Hebb\'s rule <code>w ← w + η·x·y</code> with <code>y = w·x</code> only ever reinforces what already fires, so the weights grow without bound. One fix is Sanger\'s generalized Hebbian rule. With a single output it reduces to Oja\'s rule <code>w ← w + η·y·(x − y·w)</code>, where the subtracted term acts as forgetting. Run both on the same correlated data.</p>' +
      '<div class="bench"><div><div class="plot"><canvas data-scatter></canvas></div><p class="cap">Data cloud, with the direction each rule has learned. The Hebb arrow is drawn at unit length because its true length leaves the screen.</p></div>' +
      '<div><div class="plot"><canvas data-norm></canvas></div><p class="cap">Weight length |w| on a log scale.</p>' +
      '<label class="ctl"><span>η</span><input type="range" min="0.002" max="0.03" step="0.002" value="0.01" data-eta><output data-etao>0.010</output></label>' +
      '<div class="row"><button class="btn primary" type="button" data-run>Run 600 steps</button><button class="btn" type="button" data-reset>Reset</button></div>' +
      '<div class="readout" data-read></div></div></div><div class="quiz" data-quiz></div>');
    var HDATA = corrData(300, 7), hb;
    function reset() {
      hb = { w: [0.3, 0.1], o: [0.3, 0.1], t: 0, hist: [[Math.hypot(.3, .1), Math.hypot(.3, .1)]], run: false, rng: mulberry(11) };
      S.$("[data-run]").textContent = "Run 600 steps"; draw();
    }
    function step(eta) {
      var x = HDATA[Math.floor(hb.rng() * HDATA.length)];
      var y = hb.w[0] * x[0] + hb.w[1] * x[1]; hb.w = [hb.w[0] + eta * y * x[0], hb.w[1] + eta * y * x[1]];
      var yo = hb.o[0] * x[0] + hb.o[1] * x[1]; hb.o = [hb.o[0] + eta * yo * (x[0] - yo * hb.o[0]), hb.o[1] + eta * yo * (x[1] - yo * hb.o[1])];
      hb.t++; hb.hist.push([Math.hypot(hb.w[0], hb.w[1]), Math.hypot(hb.o[0], hb.o[1])]);
    }
    function draw() {
      var T = theme(S.body);
      (function () {
        var cv = S.$("[data-scatter]"), f = fit(cv, 1), ctx = f.ctx, w = f.w, h = f.h, F = frame(w, h, -6, 6, -6, 6);
        ctx.clearRect(0, 0, w, h); axes(ctx, F, w, h, T, -6, 6, -6, 6);
        ctx.fillStyle = T.muted; ctx.globalAlpha = .45; HDATA.forEach(function (p) { ctx.beginPath(); ctx.arc(F.X(p[0]), F.Y(p[1]), 2, 0, 7); ctx.fill(); }); ctx.globalAlpha = 1;
        var arrow = function (v, col, scale, label, dash) {
          var n = Math.hypot(v[0], v[1]) || 1, L = scale ? 4.5 : Math.min(5.5, n * 4.5), ux = v[0] / n * L, uy = v[1] / n * L;
          ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.setLineDash(dash || []);
          ctx.beginPath(); ctx.moveTo(F.X(0), F.Y(0)); ctx.lineTo(F.X(ux), F.Y(uy)); ctx.stroke(); ctx.setLineDash([]);
          var a = Math.atan2(-(F.Y(uy) - F.Y(0)), F.X(ux) - F.X(0)), px = F.X(ux), py = F.Y(uy);
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 10 * Math.cos(a - .4), py + 10 * Math.sin(a - .4)); ctx.lineTo(px - 10 * Math.cos(a + .4), py + 10 * Math.sin(a + .4)); ctx.fill();
          ctx.font = "600 12px " + getComputedStyle(S.body).fontFamily; ctx.fillText(label, px + 6, py - 6);
        };
        arrow(hb.w, T.fire, true, "Hebb", [6, 4]); arrow(hb.o, T.calm, false, "Oja");
      })();
      (function () {
        var cv = S.$("[data-norm]"), f = fit(cv, .62), ctx = f.ctx, w = f.w, h = f.h, pad = 34;
        ctx.clearRect(0, 0, w, h);
        var maxT = 600, maxL = Math.max(2, Math.ceil(Math.log10(Math.max.apply(null, hb.hist.map(function (r) { return r[0]; }).concat([10]))))), minL = -1;
        var X = function (t) { return pad + (t / maxT) * (w - pad - 10); }, Y = function (v) { return h - 22 - ((Math.log10(Math.max(v, 1e-3)) - minL) / (maxL - minL)) * (h - 34); };
        ctx.strokeStyle = T.line; ctx.fillStyle = T.muted; ctx.font = "11px " + getComputedStyle(document.documentElement).getPropertyValue("--mono"); ctx.lineWidth = 1;
        for (var L = minL; L <= maxL; L += Math.max(1, Math.ceil((maxL - minL) / 6))) { ctx.beginPath(); ctx.moveTo(pad, Y(Math.pow(10, L))); ctx.lineTo(w - 10, Y(Math.pow(10, L))); ctx.stroke(); ctx.fillText("1e" + L, 2, Y(Math.pow(10, L)) + 4); }
        ctx.fillText("step", w - 40, h - 6);
        [[0, T.fire], [1, T.calm]].forEach(function (kc) {
          ctx.strokeStyle = kc[1]; ctx.lineWidth = 2.2; ctx.setLineDash(kc[0] === 0 ? [6, 4] : []); ctx.beginPath();
          hb.hist.forEach(function (r, t) { var x = X(t), y = Y(r[kc[0]]); if (t) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke();
        });
        ctx.setLineDash([]);
      })();
      var nh = Math.hypot(hb.w[0], hb.w[1]), no = Math.hypot(hb.o[0], hb.o[1]);
      S.$("[data-read]").textContent = "step " + hb.t + "\nHebb |w| = " + (nh < 1e6 ? nh.toFixed(3) : nh.toExponential(2)) + "   angle to main axis " + angTo(hb.w).toFixed(1) + "°\nOja  |w| = " + no.toFixed(3) + "   angle to main axis " + angTo(hb.o).toFixed(1) + "°";
    }
    function loop() {
      if (!hb.run || !host.isConnected) return;
      var eta = +S.$("[data-eta]").value;
      for (var i = 0; i < 4 && hb.t < 600; i++) step(eta);
      draw();
      if (hb.t >= 600) { hb.run = false; S.$("[data-run]").textContent = "Done"; markDone("hebb"); return; }
      requestAnimationFrame(loop);
    }
    S.$("[data-run]").onclick = function () { if (hb.t >= 600) reset(); hb.run = !hb.run; S.$("[data-run]").textContent = hb.run ? "Pause" : "Resume"; if (hb.run) loop(); };
    S.$("[data-reset]").onclick = reset;
    S.$("[data-eta]").oninput = function (e) { S.$("[data-etao]").textContent = (+e.target.value).toFixed(3); };
    reset(); onRedraw(host, draw);
    renderQuiz(S.$("[data-quiz]"), "Checkpoint", [
      { q: "Hebbian learning is…", o: ["Fundamentally stable since stronger connections will enforce themselves", "Fundamentally unstable since there is no reduction in weights", "Fundamentally stable since learning is unbounded", "Fundamentally unstable since weights compete for adjustment"], a: 1, why: "Strong connections reinforce themselves, nothing ever shrinks them, and there is no competition, so learning is unbounded." },
      { q: "In the simulation, both rules end up pointing along the same direction. What is it?", o: ["The mean of the data", "The direction of greatest variance, the first principal component", "A random direction set by the initial weights", "The x₁ axis"], a: 1, why: "Both rules grow fastest along the eigenvector with the largest eigenvalue of the input covariance. Oja's rule also keeps |w| at 1, so it extracts the first principal component." },
      { q: "What does the extra term −η·y²·w in Oja's (single-output Sanger) rule do?", o: ["Speeds learning up", "Acts as forgetting that keeps |w| bounded near 1", "Makes the rule supervised", "Adds inhibition between outputs"], a: 1, why: "It shrinks w in proportion to how strongly the unit is responding, which balances Hebbian growth." },
      { q: "In Hebb's 1949 statement, what changes when cell A repeatedly helps fire cell B?", o: ["B's threshold drops", "\"Some growth process or metabolic change\" increases A's efficiency at firing B", "A grows a second axon", "B starts inhibiting A"], a: 1, why: "Hebb did not specify a mechanism. The synaptic and calcium story of long-term potentiation came decades later." }
    ], "hebb");
  });

  /* =========================================================================
     4. PERCEPTRON
     ========================================================================= */
  var GATES = [
    { id: "and", n: "AND", t: [0, 0, 0, 1] }, { id: "or", n: "OR", t: [0, 1, 1, 1] }, { id: "nand", n: "NAND", t: [1, 1, 1, 0] }, { id: "nor", n: "NOR", t: [1, 0, 0, 0] },
    { id: "anb", n: "x₁ AND NOT x₂", t: [0, 0, 1, 0] }, { id: "xor", n: "XOR", t: [0, 1, 1, 0] }
  ];
  var CORNERS = [[0, 0], [0, 1], [1, 0], [1, 1]];
  GU.lab("nn-perceptron", function (host) {
    var S = mountShell(host, "Lab 4 · The perceptron", "set gates by hand, then watch the rule learn",
      '<p class="intro">A perceptron fires when <code>w₁x₁ + w₂x₂ + b ≥ 0</code>. That is a line through the plane, with everything on one side firing. First set the weights by hand for each Boolean gate. Then watch Rosenblatt\'s rule <code>w ← w + η(d − y)x</code> find a line by itself.</p>' +
      '<h3>Gates by hand</h3><div class="row chips" role="group" aria-label="Gates" data-gates></div>' +
      '<div class="bench"><div class="plot"><canvas data-gate></canvas><p class="cap">Filled dots should fire, hollow dots should not. A red ring marks a mistake.</p></div>' +
      '<div><label class="ctl"><span>w₁</span><input type="range" min="-3" max="3" step="0.1" value="1" data-w1><output data-w1o></output></label>' +
      '<label class="ctl"><span>w₂</span><input type="range" min="-3" max="3" step="0.1" value="1" data-w2><output data-w2o></output></label>' +
      '<label class="ctl"><span>bias b</span><input type="range" min="-4" max="2" step="0.1" value="0.5" data-b><output data-bo></output></label>' +
      '<p class="status" data-gstatus></p><p class="cap" data-ghint></p></div></div>' +
      '<h3>Rosenblatt\'s rule at work</h3><p class="intro muted">Click the plot to add points of the selected class, or generate a set. Use Step to process one sample at a time.</p>' +
      '<div class="bench"><div class="plot"><canvas data-learn style="cursor:crosshair"></canvas></div><div>' +
      '<div class="row" role="group" aria-label="Class to add"><span class="cap" style="margin:0">Add class:</span><button class="btn small" type="button" aria-pressed="true" data-c1>1 (fires)</button><button class="btn small" type="button" aria-pressed="false" data-c0>0</button></div>' +
      '<div class="row"><button class="btn small" type="button" data-gsep>Separable set</button><button class="btn small" type="button" data-gxor>XOR-like set</button><button class="btn small" type="button" data-gclear>Clear</button></div>' +
      '<label class="ctl"><span>η</span><input type="range" min="0.05" max="1" step="0.05" value="0.2" data-leta><output data-letao>0.20</output></label>' +
      '<div class="row"><button class="btn" type="button" data-step>Step</button><button class="btn primary" type="button" data-train>Train</button><button class="btn" type="button" data-lreset>Reset weights</button></div>' +
      '<div class="readout" data-lread></div></div></div><div class="quiz" data-quiz></div>');
    var gate = GATES[0], gateSolved = store.get("gate-solved", {});
    function renderGateChips() {
      var c = S.$("[data-gates]"); c.innerHTML = "";
      GATES.forEach(function (g) {
        var b = el("button", "chip" + (gateSolved[g.id] ? " solved" : ""), g.n); b.type = "button"; b.setAttribute("aria-pressed", g === gate ? "true" : "false");
        b.onclick = function () { gate = g; renderGateChips(); drawGate(); }; c.appendChild(b);
      });
    }
    function drawGate() {
      var T = theme(S.body), w1 = +S.$("[data-w1]").value, w2 = +S.$("[data-w2]").value, b = +S.$("[data-b]").value;
      S.$("[data-w1o]").textContent = w1.toFixed(1); S.$("[data-w2o]").textContent = w2.toFixed(1); S.$("[data-bo]").textContent = b.toFixed(1);
      var cv = S.$("[data-gate]"), f = fit(cv, 1), ctx = f.ctx, w = f.w, h = f.h, r = [-0.6, 1.6], F = frame(w, h, r[0], r[1], r[0], r[1]);
      ctx.clearRect(0, 0, w, h);
      var st = 4; ctx.fillStyle = T.fireSoft;
      for (var px = 0; px < w; px += st) for (var py = 0; py < h; py += st) { var x = F.ix(px + st / 2), y = F.iy(py + st / 2); if (w1 * x + w2 * y + b >= 0) ctx.fillRect(px, py, st, st); }
      axes(ctx, F, w, h, T, r[0], r[1], r[0], r[1]);
      if (Math.abs(w2) > 1e-9 || Math.abs(w1) > 1e-9) {
        ctx.strokeStyle = T.fire; ctx.lineWidth = 2; ctx.beginPath();
        if (Math.abs(w2) > Math.abs(w1)) { ctx.moveTo(F.X(r[0]), F.Y(-(w1 * r[0] + b) / w2)); ctx.lineTo(F.X(r[1]), F.Y(-(w1 * r[1] + b) / w2)); }
        else { ctx.moveTo(F.X(-(w2 * r[0] + b) / w1), F.Y(r[0])); ctx.lineTo(F.X(-(w2 * r[1] + b) / w1), F.Y(r[1])); }
        ctx.stroke();
      }
      var ok = 0;
      CORNERS.forEach(function (c, i) {
        var t = gate.t[i], yv = (w1 * c[0] + w2 * c[1] + b) >= 0 ? 1 : 0, X = F.X(c[0]), Y = F.Y(c[1]);
        ctx.lineWidth = 2.5; ctx.strokeStyle = T.ink; ctx.fillStyle = t ? T.ink : T.surface; ctx.beginPath(); ctx.arc(X, Y, 9, 0, 7); ctx.fill(); ctx.stroke();
        if (yv !== t) { ctx.strokeStyle = T.bad; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(X, Y, 15, 0, 7); ctx.stroke(); } else ok++;
        ctx.fillStyle = T.muted; ctx.font = "12px " + getComputedStyle(document.documentElement).getPropertyValue("--mono"); ctx.fillText("(" + c[0] + "," + c[1] + ")", X + 14, Y + 18);
      });
      var s = S.$("[data-gstatus]"); s.textContent = ok + " of 4 corners correct"; s.className = "status " + (ok === 4 ? "ok" : "meh");
      if (ok === 4 && !gateSolved[gate.id]) { gateSolved[gate.id] = true; store.set("gate-solved", gateSolved); renderGateChips(); }
      if (["and", "or", "nand"].every(function (k) { return gateSolved[k]; })) markDone("perceptron");
      S.$("[data-ghint]").textContent = gate.id === "xor" ? "The best any single line can do here is 3 of 4. The two firing corners sit on one diagonal and the two silent ones on the other, so no line separates them. That is why Minsky and Papert said networks are needed." : "";
    }
    ["[data-w1]", "[data-w2]", "[data-b]"].forEach(function (s) { S.$(s).addEventListener("input", drawGate); });
    renderGateChips(); drawGate(); onRedraw(host, drawGate);

    function genSep() {
      var r = Math.random, a = r() * Math.PI * 2, n = [Math.cos(a), Math.sin(a)], c = (r() - .5) * .6, pts = [];
      while (pts.length < 30) { var x = [r() * 2 - 1, r() * 2 - 1], z = n[0] * x[0] + n[1] * x[1] - c; if (Math.abs(z) < .08) continue; pts.push([x[0], x[1], z > 0 ? 1 : 0]); }
      return pts;
    }
    function genXor() {
      var r = Math.random, pts = [];
      for (var i = 0; i < 32; i++) { var qx = i % 2, qy = (i >> 1) % 2; pts.push([(qx ? .5 : -.5) + (r() - .5) * .6, (qy ? .5 : -.5) + (r() - .5) * .6, qx ^ qy]); }
      return pts;
    }
    var LP = { pts: store.get("lp-pts", null), w: [0, 0], b: 0, idx: 0, epoch: 0, mist: 0, last: null, run: null, conv: false, cls: 1, cur: -1 };
    if (!LP.pts) LP.pts = genSep();
    function stopRun() { if (LP.run) { clearInterval(LP.run); LP.run = null; } S.$("[data-train]").textContent = "Train"; }
    function lpReset() { stopRun(); LP.w = [0, 0]; LP.b = 0; LP.idx = 0; LP.epoch = 0; LP.mist = 0; LP.last = null; LP.conv = false; LP.cur = -1; drawLearn(); }
    function lpStep() {
      if (!LP.pts.length || LP.conv) return;
      var eta = +S.$("[data-leta]").value, p = LP.pts[LP.idx]; LP.cur = LP.idx;
      var y = (LP.w[0] * p[0] + LP.w[1] * p[1] + LP.b) >= 0 ? 1 : 0, e = p[2] - y;
      if (e !== 0) { LP.w = [LP.w[0] + eta * e * p[0], LP.w[1] + eta * e * p[1]]; LP.b += eta * e; LP.mist++; }
      LP.idx++;
      if (LP.idx >= LP.pts.length) { LP.epoch++; LP.last = LP.mist; if (LP.mist === 0) LP.conv = true; LP.mist = 0; LP.idx = 0; }
    }
    S.$("[data-step]").onclick = function () { stopRun(); lpStep(); drawLearn(); };
    S.$("[data-train]").onclick = function () {
      if (LP.run) { stopRun(); return; }
      S.$("[data-train]").textContent = "Pause";
      var fast = matchMedia("(prefers-reduced-motion: reduce)").matches;
      LP.run = setInterval(function () {
        if (!host.isConnected) { clearInterval(LP.run); return; }
        for (var i = 0; i < (fast ? 50 : 1); i++) { lpStep(); if (LP.conv || LP.epoch >= 200) break; }
        drawLearn(); if (LP.conv || LP.epoch >= 200) stopRun();
      }, 45);
    };
    S.$("[data-lreset]").onclick = lpReset;
    S.$("[data-gsep]").onclick = function () { LP.pts = genSep(); store.set("lp-pts", LP.pts); lpReset(); };
    S.$("[data-gxor]").onclick = function () { LP.pts = genXor(); store.set("lp-pts", LP.pts); lpReset(); };
    S.$("[data-gclear]").onclick = function () { LP.pts = []; store.set("lp-pts", LP.pts); lpReset(); };
    S.$("[data-leta]").oninput = function (e) { S.$("[data-letao]").textContent = (+e.target.value).toFixed(2); };
    function setCls(c) { LP.cls = c; S.$("[data-c1]").setAttribute("aria-pressed", c === 1 ? "true" : "false"); S.$("[data-c0]").setAttribute("aria-pressed", c === 0 ? "true" : "false"); }
    S.$("[data-c1]").onclick = function () { setCls(1); }; S.$("[data-c0]").onclick = function () { setCls(0); };
    S.$("[data-learn]").addEventListener("click", function (ev) {
      var rect = ev.currentTarget.getBoundingClientRect(), F = frame(rect.width, rect.height, -1.1, 1.1, -1.1, 1.1);
      var x = F.ix(ev.clientX - rect.left), y = F.iy(ev.clientY - rect.top);
      if (Math.abs(x) > 1.1 || Math.abs(y) > 1.1) return;
      LP.pts.push([x, y, LP.cls]); store.set("lp-pts", LP.pts); LP.conv = false; drawLearn();
    });
    function drawLearn() {
      var T = theme(S.body), cv = S.$("[data-learn]"), f = fit(cv, 1), ctx = f.ctx, w = f.w, h = f.h, F = frame(w, h, -1.1, 1.1, -1.1, 1.1);
      ctx.clearRect(0, 0, w, h);
      var w1 = LP.w[0], w2 = LP.w[1], b = LP.b, st = 5; ctx.fillStyle = T.fireSoft;
      if (w1 || w2 || b) for (var px = 0; px < w; px += st) for (var py = 0; py < h; py += st) { if (w1 * F.ix(px + 2) + w2 * F.iy(py + 2) + b >= 0) ctx.fillRect(px, py, st, st); }
      axes(ctx, F, w, h, T, -1.1, 1.1, -1.1, 1.1);
      if (Math.abs(w1) + Math.abs(w2) > 1e-9) {
        ctx.strokeStyle = T.fire; ctx.lineWidth = 2; ctx.beginPath();
        if (Math.abs(w2) > Math.abs(w1)) { ctx.moveTo(F.X(-1.1), F.Y(-(w1 * -1.1 + b) / w2)); ctx.lineTo(F.X(1.1), F.Y(-(w1 * 1.1 + b) / w2)); }
        else { ctx.moveTo(F.X(-(w2 * -1.1 + b) / w1), F.Y(-1.1)); ctx.lineTo(F.X(-(w2 * 1.1 + b) / w1), F.Y(1.1)); }
        ctx.stroke();
      }
      var wrong = 0;
      LP.pts.forEach(function (p, i) {
        var X = F.X(p[0]), Y = F.Y(p[1]), y = (w1 * p[0] + w2 * p[1] + b) >= 0 ? 1 : 0; if (y !== p[2]) wrong++;
        ctx.lineWidth = 2;
        if (p[2]) { ctx.fillStyle = T.fire; ctx.beginPath(); ctx.arc(X, Y, 5.5, 0, 7); ctx.fill(); } else { ctx.strokeStyle = T.calm; ctx.strokeRect(X - 5, Y - 5, 10, 10); }
        if (i === LP.cur) { ctx.strokeStyle = T.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X, Y, 11, 0, 7); ctx.stroke(); }
      });
      var msg = "epoch " + LP.epoch + "   w = (" + fmt(w1) + ", " + fmt(w2) + ")   b = " + fmt(b) + "\nmisclassified now: " + wrong + " of " + LP.pts.length;
      if (LP.last != null) msg += "\nmistakes in last full epoch: " + LP.last;
      if (LP.conv) msg += "\nConverged: an epoch with no mistakes."; else if (LP.epoch >= 200) msg += "\nStopped after 200 epochs. Is this set linearly separable?";
      S.$("[data-lread]").textContent = msg;
    }
    drawLearn(); onRedraw(host, drawLearn);
    renderQuiz(S.$("[data-quiz]"), "Checkpoint", [
      { q: "Under Rosenblatt's rule, what happens to the weights when the perceptron classifies a sample correctly?", o: ["They grow slightly", "Nothing, since d − y = 0", "They shrink slightly", "The bias resets"], a: 1, why: "The update is proportional to the error (d − y), so correct outputs leave the weights untouched." },
      { q: "Rosenblatt proved the rule converges when…", o: ["the learning rate is small enough", "the classes are linearly separable", "the data is normalised", "there are fewer samples than weights"], a: 1, why: "Convergence in a finite number of updates is guaranteed only for linearly separable data. Try the XOR-like set and the rule never settles." },
      { q: "What is the difference between a \"linear\" and an \"affine\" function of the inputs?", o: ["None", "Affine adds a constant offset, the bias. Linear must map 0 to 0", "Affine functions are non-linear", "Linear functions allow thresholds"], a: 1, why: "w·x is linear. w·x + b is affine. The perceptron computes an affine function and then applies the threshold." },
      { q: "In Rosenblatt's simplified perceptron, which weights are learned?", o: ["Sensor to association weights", "Association to response weights", "Both", "Neither, since they were wired by hand"], a: 1, why: "Association units combine sensory input with fixed weights. Only the response units' weights are learnable." },
      { q: "Which of these two-input Boolean functions can a single perceptron <em>not</em> compute?", o: ["NAND", "NOR", "XNOR", "x₁ AND NOT x₂"], a: 2, why: "XNOR, like XOR, puts its two firing corners on a diagonal, so it is not linearly separable." }
    ], "perceptron");
  });

  /* =========================================================================
     4b. Multilayer Boolean networks (lesson figure)
     ========================================================================= */
  var BNETS = [
    { id: "gates", n: "Single gates", inputs: ["X", "Y"], note: "Three separate one-unit networks: AND needs both inputs (threshold 2), OR needs one (threshold 1), and NOT X is weight −1 with threshold 0.",
      layers: [[{ n: "AND", w: { X: 1, Y: 1 }, T: 2 }, { n: "OR", w: { X: 1, Y: 1 }, T: 1 }, { n: "NOT X", w: { X: -1 }, T: 0 }]], outs: ["AND", "OR", "NOT X"] },
    { id: "xor", n: "XOR, one hidden layer", inputs: ["X", "Y"], note: "Hidden unit h₁ is X OR Y; h₂ is NOT X OR NOT Y (that is, NAND). The output ANDs them: fire only if at least one input is on and not both.",
      layers: [[{ n: "h₁", w: { X: 1, Y: 1 }, T: 1 }, { n: "h₂", w: { X: -1, Y: -1 }, T: -1 }], [{ n: "XOR", w: { "h₁": 1, "h₂": 1 }, T: 2 }]], outs: ["XOR"] },
    { id: "formula", n: "(A·X̄·Z + A·Ȳ)·(X·Y + X·Z)", inputs: ["X", "Y", "Z", "A"], note: "Layer 1 builds the four AND terms, layer 2 ORs them in pairs, and the output ANDs the two brackets: three layers of threshold units for an arbitrary formula.",
      layers: [[{ n: "p₁", w: { A: 1, X: -1, Z: 1 }, T: 2 }, { n: "p₂", w: { A: 1, Y: -1 }, T: 1 }, { n: "p₃", w: { X: 1, Y: 1 }, T: 2 }, { n: "p₄", w: { X: 1, Z: 1 }, T: 2 }],
        [{ n: "q₁", w: { "p₁": 1, "p₂": 1 }, T: 1 }, { n: "q₂", w: { "p₃": 1, "p₄": 1 }, T: 1 }], [{ n: "f", w: { "q₁": 1, "q₂": 1 }, T: 2 }]], outs: ["f"],
      ref: function (v) { return ((v.A && !v.X && v.Z) || (v.A && !v.Y)) && ((v.X && v.Y) || (v.X && v.Z)) ? 1 : 0; } }
  ];
  GU.lab("nn-boolean-mlp", function (host) {
    var S = mountShell(host, "Figure · Networks of threshold units compute Boolean functions", "toggle inputs; numbers on edges are weights, numbers in nodes are thresholds",
      '<div class="row chips" data-presets></div><p class="intro" data-note></p>' +
      '<div class="bench wide-left"><div><svg class="netsvg" data-svg role="img" aria-label="Network diagram"></svg><div class="row" data-inputs></div></div>' +
      '<div style="overflow-x:auto"><table class="tt" data-tt></table><p class="status" data-status></p></div></div>');
    var net = BNETS[0], vals = {};
    function evaluate(v) {
      var all = Object.assign({}, v);
      net.layers.forEach(function (layer) { layer.forEach(function (u) { var z = 0; Object.keys(u.w).forEach(function (k) { z += u.w[k] * all[k]; }); all[u.n] = z >= u.T ? 1 : 0; }); });
      return all;
    }
    function presets() {
      var c = S.$("[data-presets]"); c.innerHTML = "";
      BNETS.forEach(function (b) { var x = el("button", "chip", b.n); x.type = "button"; x.setAttribute("aria-pressed", b === net ? "true" : "false"); x.onclick = function () { net = b; vals = {}; presets(); render(); }; c.appendChild(x); });
    }
    function render() {
      net.inputs.forEach(function (k) { if (vals[k] == null) vals[k] = 1; });
      S.$("[data-note]").textContent = net.note;
      var all = evaluate(vals), cols = [net.inputs].concat(net.layers.map(function (l) { return l.map(function (u) { return u.n; }); }));
      var W = 460, H = Math.max(180, 70 * Math.max.apply(null, cols.map(function (c) { return c.length; }))), pos = {};
      cols.forEach(function (col, ci) { col.forEach(function (n, ri) { pos[n] = [40 + ci * (W - 80) / Math.max(1, cols.length - 1), (ri + .5) * H / col.length]; }); });
      var svg = "";
      net.layers.forEach(function (layer) {
        layer.forEach(function (u) {
          Object.keys(u.w).forEach(function (k) {
            var a = pos[k], b = pos[u.n], mx = a[0] + (b[0] - a[0]) * .62, my = a[1] + (b[1] - a[1]) * .62;
            svg += '<line class="edge' + (all[k] ? " on" : "") + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>' +
              '<text class="w" x="' + mx + '" y="' + (my - 4) + '" text-anchor="middle">' + u.w[k] + "</text>";
          });
        });
      });
      Object.keys(pos).forEach(function (n) {
        var p = pos[n], isIn = net.inputs.indexOf(n) >= 0, unit = null;
        net.layers.forEach(function (l) { l.forEach(function (u) { if (u.n === n) unit = u; }); });
        svg += '<circle class="node' + (all[n] ? " on" : "") + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (isIn ? 15 : 19) + '"/>' +
          '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle"' + (all[n] ? ' class="onlabel"' : "") + ">" + (isIn ? n : unit.T) + "</text>" +
          (isIn ? "" : '<text class="w" x="' + p[0] + '" y="' + (p[1] + 33) + '" text-anchor="middle">' + n + "</text>");
      });
      var s = S.$("[data-svg]"); s.setAttribute("viewBox", "0 0 " + W + " " + (H + 16)); s.innerHTML = svg;
      var box = S.$("[data-inputs]"); box.innerHTML = "";
      net.inputs.forEach(function (k) { var b = button(k + " = " + vals[k]); b.setAttribute("aria-pressed", vals[k] ? "true" : "false"); b.onclick = function () { vals[k] ^= 1; render(); }; box.appendChild(b); });
      var n = net.inputs.length, html = "<tr>" + net.inputs.map(function (k) { return "<th>" + k + "</th>"; }).join("") + net.outs.map(function (k) { return "<th>" + k + "</th>"; }).join("") + (net.ref ? "<th>formula</th>" : "") + "</tr>", agree = true;
      for (var r = 0; r < (1 << n); r++) {
        var v = {}; net.inputs.forEach(function (k, j) { v[k] = (r >> (n - 1 - j)) & 1; });
        var a = evaluate(v), cur = net.inputs.every(function (k) { return v[k] === vals[k]; });
        html += "<tr" + (cur ? ' style="outline:2px solid var(--n-fire)"' : "") + ">" + net.inputs.map(function (k) { return "<td>" + v[k] + "</td>"; }).join("") +
          net.outs.map(function (k) { return '<td class="' + (a[k] ? "y" : "") + '">' + a[k] + "</td>"; }).join("");
        if (net.ref) { var rv = net.ref(v); if (rv !== a.f) agree = false; html += '<td class="' + (rv === a.f ? "y" : "n") + '">' + rv + "</td>"; }
        html += "</tr>";
      }
      S.$("[data-tt]").innerHTML = html;
      var st = S.$("[data-status]");
      if (net.ref) { st.textContent = agree ? "The network agrees with the formula on all 16 inputs." : "Mismatch with the formula."; st.className = "status " + (agree ? "ok" : "bad"); }
      else st.textContent = "";
    }
    presets(); render();
  });

  /* =========================================================================
     5. REGIONS — tiny network language
     ========================================================================= */
  function tokenize(s, li) {
    var t = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) { var m = s.slice(i).match(/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i); if (!m) throw err(li, "Bad number"); t.push({ t: "num", v: parseFloat(m[0]) }); i += m[0].length; continue; }
      if (/[A-Za-z_]/.test(c)) { var m2 = s.slice(i).match(/^[A-Za-z_]\w*/); t.push({ t: "id", v: m2[0] }); i += m2[0].length; continue; }
      if ("+-*/^(),".indexOf(c) >= 0) { t.push({ t: "op", v: c }); i++; continue; }
      if (c === "−") { t.push({ t: "op", v: "-" }); i++; continue; }
      throw err(li, 'Unexpected character "' + c + '"');
    }
    return t;
  }
  function err(li, msg) { return { line: li + 1, msg: msg }; }
  var FUNS = { step: [1, function (z) { return z >= 0 ? 1 : 0; }, true], relu: [1, function (z) { return Math.max(0, z); }], abs: [1, Math.abs], sin: [1, Math.sin], cos: [1, Math.cos], sqrt: [1, Math.sqrt], min: [-1, Math.min], max: [-1, Math.max] };
  function compileNet(src, inputs, allowed) {
    var vars = new Set(inputs), depth = {}, prog = [], units = 0, graph = [], used;
    inputs.forEach(function (v) { depth[v] = 0; });
    src.split("\n").forEach(function (raw, li) {
      var line = raw.replace(/#.*/, "").trim(); if (!line) return;
      var m = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/); if (!m) throw err(li, "Expected   name = expression");
      var name = m[1];
      if (inputs.indexOf(name) >= 0) throw err(li, name + " is an input and can't be reassigned");
      if (FUNS[name]) throw err(li, name + " is a function name");
      var toks = tokenize(m[2], li), p = 0; used = new Set();
      var peek = function () { return toks[p]; }, next = function () { return toks[p++]; };
      var expect = function (v) { var k = next(); if (!k || k.v !== v) throw err(li, 'Expected "' + v + '"'); };
      var bin = function (l, r, f) { return { f: f, d: Math.max(l.d, r.d) }; };
      // let, not var: each closure must capture its own operands.
      function expr() { var n = term(); while (peek() && (peek().v === "+" || peek().v === "-")) { let op = next().v, r = term(), l = n; n = op === "+" ? bin(l, r, function (e) { return l.f(e) + r.f(e); }) : bin(l, r, function (e) { return l.f(e) - r.f(e); }); } return n; }
      function term() { var n = unary(); while (peek() && (peek().v === "*" || peek().v === "/")) { let op = next().v, r = unary(), l = n; n = op === "*" ? bin(l, r, function (e) { return l.f(e) * r.f(e); }) : bin(l, r, function (e) { return l.f(e) / r.f(e); }); } return n; }
      function unary() { if (peek() && peek().v === "-") { next(); var u = unary(); return { f: function (e) { return -u.f(e); }, d: u.d }; } if (peek() && peek().v === "+") { next(); return unary(); } return power(); }
      function power() { var b = primary(); if (peek() && peek().v === "^") { next(); var ex = unary(); return bin(b, ex, function (e) { return Math.pow(b.f(e), ex.f(e)); }); } return b; }
      function primary() {
        var t = next(); if (!t) throw err(li, "The expression ends too early");
        if (t.t === "num") { var v = t.v; return { f: function () { return v; }, d: 0 }; }
        if (t.v === "(") { var n = expr(); expect(")"); return n; }
        if (t.t === "id") {
          if (peek() && peek().v === "(") {
            var F = FUNS[t.v]; if (!F) throw err(li, "Unknown function " + t.v + "()");
            if (allowed && allowed.indexOf(t.v) < 0) throw err(li, "Only " + allowed.join(", ") + "() is allowed in this lab");
            next(); var args = [];
            if (peek() && peek().v !== ")") { args.push(expr()); while (peek() && peek().v === ",") { next(); args.push(expr()); } }
            expect(")");
            if (F[0] > 0 && args.length !== F[0]) throw err(li, t.v + "() takes " + F[0] + " argument");
            if (!args.length) throw err(li, t.v + "() needs an argument");
            var fn = F[1], d = Math.max.apply(null, args.map(function (a) { return a.d; })) + (F[2] ? 1 : 0); if (F[2]) units++;
            if (args.length === 1) { var a = args[0]; return { f: function (e) { return fn(a.f(e)); }, d: d, inner: F[2] ? a.f : null }; }
            return { f: function (e) { return fn.apply(null, args.map(function (x) { return x.f(e); })); }, d: d };
          }
          if (!vars.has(t.v)) throw err(li, '"' + t.v + '" is not defined yet');
          used.add(t.v);
          var nm = t.v; return { f: function (e) { return e[nm]; }, d: depth[nm] };
        }
        throw err(li, 'Unexpected "' + t.v + '"');
      }
      var node = expr(); if (p < toks.length) throw err(li, 'Unexpected "' + toks[p].v + '"');
      vars.add(name); depth[name] = node.d; prog.push([name, node.f]);
      // aff: the affine part of the line — the argument of a top-level step(), or the whole line for a plain sum.
      graph.push({ name: name, deps: Array.from(used), step: !!node.inner, d: node.d, aff: node.inner || node.f });
    });
    if (!vars.has("out")) throw { line: null, msg: "Define the network output:   out = ..." };
    return { run: function (env) { for (var i = 0; i < prog.length; i++) env[prog[i][0]] = prog[i][1](env); return env.out; }, units: units, layers: depth.out, graph: graph, inputs: inputs };
  }
  var REG = [
    { id: "diamond", n: "Diamond", brief: "A worked design: the region |x₁| + |x₂| ≤ 1. The starter is a complete network. Run it and check that it scores 100%.",
      t: function (a, b) { return Math.abs(a) + Math.abs(b) <= 1; }, acc: .99,
      starter: "# A worked design: four edges, then AND\nh1 = step(-x1 - x2 + 1)   # top right\nh2 = step( x1 - x2 + 1)   # top left\nh3 = step( x1 + x2 + 1)   # bottom left\nh4 = step(-x1 + x2 + 1)   # bottom right\nout = step(h1 + h2 + h3 + h4 - 4)\n", sol: null },
    { id: "outside", n: "Outside the square", brief: "The region outside the square |x₁| ≤ 1, |x₂| ≤ 1. Keep the four hidden units of the square exactly as they are and change only the output unit. Hint: De Morgan.",
      t: function (a, b) { return !(Math.abs(a) <= 1 && Math.abs(b) <= 1); }, acc: .99,
      starter: "# The square's four fences, unchanged\nh1 = step(-x1 + 1)\nh2 = step(-x2 + 1)\nh3 = step( x1 + 1)\nh4 = step( x2 + 1)\nout = step(h1 + h2 + h3 + h4 - 4)   # this is the square: change only this line\n",
      sol: "h1 = step(-x1 + 1)\nh2 = step(-x2 + 1)\nh3 = step( x1 + 1)\nh4 = step( x2 + 1)\n# NOT(all four) = at least one fails = at most three fire\nout = step(3 - h1 - h2 - h3 - h4)\n" },
    { id: "twosq", n: "Two squares, 6 fences", brief: "Two squares at the same height: −3 ≤ x₁ ≤ −1 and 1 ≤ x₁ ≤ 3, both with −1 ≤ x₂ ≤ 1. Use at most 9 threshold units by sharing the top and bottom fences between the two AND units.",
      t: function (a, b) { return Math.abs(b) <= 1 && ((a >= -3 && a <= -1) || (a >= 1 && a <= 3)); }, acc: .99, maxUnits: 9,
      starter: "# Shared fences\nt = step(1 - x2)     # top\nu = step(1 + x2)     # bottom\n# Left square sides\na1 = step(-1 - x1)   # x1 <= -1\n# a2 = ...\n\nout = step(t + u - 2)\n",
      sol: "t = step(1 - x2)\nu = step(1 + x2)\na1 = step(-1 - x1)\na2 = step(x1 + 3)\nb1 = step(x1 - 1)\nb2 = step(3 - x1)\nA = step(a1 + a2 + t + u - 4)\nB = step(b1 + b2 + t + u - 4)\nout = step(A + B - 1)\n" },
    { id: "hex", n: "Hexagon in 7 units", brief: "A six-sided region. Vertices are at (±1, 0) and (±0.5, ±1). Use at most 7 threshold units.",
      t: function (a, b) { return Math.abs(b) <= 1 && 2 * Math.abs(a) + Math.abs(b) <= 2; }, acc: .99, maxUnits: 7,
      starter: "# Hexagon with vertices (±1, 0) and (±0.5, ±1)\n# One unit per edge, then an AND.\nh1 = step(1 - x2)        # top edge: x2 <= 1\n# h2 = ...\n\nout = step(h1 - 1)\n",
      sol: "h1 = step(1 - x2)\nh2 = step(1 + x2)\nh3 = step(2 - 2*x1 - x2)\nh4 = step(2 - 2*x1 + x2)\nh5 = step(2 + 2*x1 - x2)\nh6 = step(2 + 2*x1 + x2)\nout = step(h1 + h2 + h3 + h4 + h5 + h6 - 6)\n" },
    { id: "ring", n: "Diamond with a hole", brief: "Paper problem 3: the ring 1 ≤ |x₁| + |x₂| ≤ 2. It is not convex, so one AND is not enough. Bonus: once it works, try to make it with one hidden layer, so the readout says 2 threshold layers.",
      t: function (a, b) { var s = Math.abs(a) + Math.abs(b); return s >= 1 && s <= 2; }, acc: .99,
      starter: "# Outer diamond |x1| + |x2| <= 2\no1 = step(2 - x1 - x2)\no2 = step(2 - x1 + x2)\no3 = step(2 + x1 - x2)\no4 = step(2 + x1 + x2)\n\n# Inner diamond |x1| + |x2| <= 1\n# i1 = ...\n\nout = step(o1 + o2 + o3 + o4 - 4)\n",
      sol: "o1 = step(2 - x1 - x2)\no2 = step(2 - x1 + x2)\no3 = step(2 + x1 - x2)\no4 = step(2 + x1 + x2)\ni1 = step(1 - x1 - x2)\ni2 = step(1 - x1 + x2)\ni3 = step(1 + x1 - x2)\ni4 = step(1 + x1 + x2)\n\n# Two-layer version: inside outer AND NOT inside inner\n# A = step(o1 + o2 + o3 + o4 - 4)\n# B = step(i1 + i2 + i3 + i4 - 4)\n# out = step(A - B - 1)\n\n# One hidden layer: every inner half-plane sits inside its outer one,\n# so the output can weigh the counts directly.\nO = o1 + o2 + o3 + o4\nI = i1 + i2 + i3 + i4\nout = step(O - 0.25*I - 3.25)\n" },
    { id: "two", n: "Two separate shapes", brief: "Paper problem 4: the diamond |x₁ + 1| + |x₂| ≤ 1 together with the square 1 ≤ x₁ ≤ 2, −0.5 ≤ x₂ ≤ 0.5. AND each shape, then OR the results.",
      t: function (a, b) { return (Math.abs(a + 1) + Math.abs(b) <= 1) || (a >= 1 && a <= 2 && Math.abs(b) <= .5); }, acc: .99,
      starter: "# Diamond centred at (-1, 0)\nd1 = step(-x1 - x2)          # (x1+1) + x2 <= 1\n# d2 = ...\n\n# Square 1 <= x1 <= 2, -0.5 <= x2 <= 0.5\ns1 = step(x1 - 1)\n# s2 = ...\n\nout = step(d1 - 1)\n",
      sol: "d1 = step(-x1 - x2)\nd2 = step(-x1 + x2)\nd3 = step(2 + x1 - x2)\nd4 = step(2 + x1 + x2)\ns1 = step(x1 - 1)\ns2 = step(2 - x1)\ns3 = step(x2 + 0.5)\ns4 = step(0.5 - x2)\nD = step(d1 + d2 + d3 + d4 - 4)     # AND\nS = step(s1 + s2 + s3 + s4 - 4)     # AND\nout = step(D + S - 1)               # OR\n" },
    { id: "shallow", n: "Same shapes, one hidden layer", brief: "Paper problem 5: the same two shapes, but the output must read the first-layer units directly, giving 2 threshold layers. With only these 8 units no weights are exact, so the bar is 95%. Work out where your error comes from.",
      t: function (a, b) { return (Math.abs(a + 1) + Math.abs(b) <= 1) || (a >= 1 && a <= 2 && Math.abs(b) <= .5); }, acc: .95, maxLayers: 2,
      starter: "d1 = step(-x1 - x2)\nd2 = step(-x1 + x2)\nd3 = step(2 + x1 - x2)\nd4 = step(2 + x1 + x2)\ns1 = step(x1 - 1)\ns2 = step(2 - x1)\ns3 = step(x2 + 0.5)\ns4 = step(0.5 - x2)\n\n# Plain sums are allowed: they become output weights\nD = d1 + d2 + d3 + d4\nS = s1 + s2 + s3 + s4\nout = step(D + S - 6)\n",
      sol: "d1 = step(-x1 - x2)\nd2 = step(-x1 + x2)\nd3 = step(2 + x1 - x2)\nd4 = step(2 + x1 + x2)\ns1 = step(x1 - 1)\ns2 = step(2 - x1)\ns3 = step(x2 + 0.5)\ns4 = step(0.5 - x2)\nD = d1 + d2 + d3 + d4\nS = s1 + s2 + s3 + s4\n# (D,S) = (4,2) and (2,4) must fire but (3,3) must not:\n# that needs a > b and b > a at once. No weights on these\n# 8 units are exact, so give up the diamond's top and bottom\n# tips, where S = 2. About 98.6%:\nout = step(D + 2*S - 10)\n" },
    { id: "circle", n: "Circle, fewest units", brief: "Approximate the disc of radius 1.5 to 97% agreement. Only step() is allowed. How few units can you use?",
      t: function (a, b) { return a * a + b * b <= 2.25; }, acc: .97,
      starter: "# Disc of radius 1.5: try a polygon around it\nh1 = step(1.5 - x1)\nh2 = step(1.5 + x1)\nh3 = step(1.5 - x2)\nh4 = step(1.5 + x2)\nout = step(h1 + h2 + h3 + h4 - 4)\n",
      sol: "# Octagon around the circle: 9 units, about 98.9%\nc = 0.70711\nh1 = step(1.5 - x1)\nh2 = step(1.5 + x1)\nh3 = step(1.5 - x2)\nh4 = step(1.5 + x2)\nh5 = step(1.5 - c*x1 - c*x2)\nh6 = step(1.5 - c*x1 + c*x2)\nh7 = step(1.5 + c*x1 - c*x2)\nh8 = step(1.5 + c*x1 + c*x2)\nout = step(h1+h2+h3+h4+h5+h6+h7+h8 - 8)\n" }
  ];
  REG[0].sol = REG[0].starter;
  GU.lab("nn-regions", function (host) {
    var S = mountShell(host, "Lab 5 · Building regions with a network", "write a network; the plot scores it as you type",
      '<p class="intro">Write a network as a list of neurons. Each line is <code>name = expression</code>, the inputs are <code>x1</code> and <code>x2</code>, and <code>step(z)</code> is a threshold unit that outputs 1 when z ≥ 0. You may use <code>+ − * /</code>, numbers, parentheses and earlier names. The last thing you define must be <code>out</code>. The plot updates as you type and scores agreement with the target over the square [−3, 3]².</p>' +
      '<div class="row chips" role="group" aria-label="Region challenges" data-chips></div><p class="intro" data-brief></p>' +
      '<div class="bench wide-left"><div><textarea class="editor" spellcheck="false" aria-label="Network code" data-code></textarea>' +
      '<div class="row"><button class="btn" type="button" data-reset>Restore starter</button><button class="btn" type="button" data-sol>Show a solution</button></div><div class="err" data-err></div></div>' +
      '<div><div class="plot"><canvas data-canvas></canvas></div>' +
      '<div class="row" style="font-size:12px;color:var(--n-muted);gap:14px"><span><i class="sw" style="background:var(--n-fire)"></i>both</span><span><i class="sw" style="background:var(--n-calm-soft);border:1px solid var(--n-calm)"></i>missed target</span><span><i class="sw" style="background:var(--n-warn)"></i>extra</span></div>' +
      '<div class="readout" data-read></div><p class="status" data-status></p></div></div>' +
      '<h3>Your network, drawn</h3><p class="cap">Read from your code as you type. Numbers on edges are weights (teal when negative), numbers in nodes are biases, and plain sums such as <code>D = d1 + d2</code> are folded into the weights of the unit that reads them. Click anywhere on the plot to probe that point: inputs show their values and the units that fire turn magenta.</p>' +
      '<svg class="netsvg" data-net role="img" aria-label="Diagram of the network you wrote, with weights and biases"></svg><p class="cap" data-netinfo></p><div class="quiz" data-quiz></div>');
    var regCh = REG[0], regSolved = store.get("reg-solved", {}), regCode = store.get("reg-code", {});
    var G = 150, LO = -3, HI = 3;
    function renderChips() {
      var c = S.$("[data-chips]"); c.innerHTML = "";
      REG.forEach(function (ch) { var b = el("button", "chip" + (regSolved[ch.id] ? " solved" : ""), ch.n); b.type = "button"; b.setAttribute("aria-pressed", ch === regCh ? "true" : "false"); b.onclick = function () { regCh = ch; load(); }; c.appendChild(b); });
    }
    function load() { renderChips(); S.$("[data-brief]").textContent = regCh.brief; S.$("[data-code]").value = regCode[regCh.id] != null ? regCode[regCh.id] : regCh.starter; run(); }
    function paint(ctx, w, h, colourAt) {
      var img = new ImageData(G, G);
      for (var j = 0; j < G; j++) for (var i = 0; i < G; i++) {
        var x = LO + (HI - LO) * (i + .5) / G, y = HI - (HI - LO) * (j + .5) / G, c = colourAt(x, y), k = 4 * (j * G + i);
        img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = 255;
      }
      var off = document.createElement("canvas"); off.width = G; off.height = G; off.getContext("2d").putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false; ctx.drawImage(off, 0, 0, w, h);
    }
    function run() {
      var T = theme(S.body), src = S.$("[data-code]").value; regCode[regCh.id] = src; store.set("reg-code", regCode);
      var cv = S.$("[data-canvas]"), f = fit(cv, 1), ctx = f.ctx, w = f.w, h = f.h; ctx.clearRect(0, 0, w, h);
      var net;
      try { net = compileNet(src, ["x1", "x2"], ["step"]); S.$("[data-err]").textContent = ""; }
      catch (e) {
        S.$("[data-err]").textContent = (e.line ? "Line " + e.line + ": " : "") + (e.msg || String(e));
        var cC0 = rgb(T.calmSoft), cB0 = rgb(T.surface); paint(ctx, w, h, function (x, y) { return regCh.t(x, y) ? cC0 : cB0; });
        S.$("[data-status]").textContent = ""; S.$("[data-read]").textContent = "Fix the error to see your region."; return;
      }
      drawNet(net);
      var cF = rgb(T.fire), cW = rgb(T.warn), cC = rgb(T.calmSoft), cB = rgb(T.surface), agree = 0, bad = false;
      paint(ctx, w, h, function (x, y) {
        var o; try { o = net.run({ x1: x, x2: y }); } catch (e) { o = 0; }
        if (!isFinite(o)) bad = true;
        var n = o >= .5, t = regCh.t(x, y); if (n === t) agree++;
        return n && t ? cF : n ? cW : t ? cC : cB;
      });
      var F = frame(w, h, LO, HI, LO, HI, 0); axes(ctx, F, w, h, T, LO, HI, LO, HI);
      if (probe) { ctx.strokeStyle = T.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(F.X(probe[0]), F.Y(probe[1]), 7, 0, 7); ctx.moveTo(F.X(probe[0]) - 11, F.Y(probe[1])); ctx.lineTo(F.X(probe[0]) + 11, F.Y(probe[1])); ctx.moveTo(F.X(probe[0]), F.Y(probe[1]) - 11); ctx.lineTo(F.X(probe[0]), F.Y(probe[1]) + 11); ctx.stroke(); }
      ctx.fillStyle = T.muted; ctx.font = "11px " + getComputedStyle(document.documentElement).getPropertyValue("--mono");
      ctx.fillText("x₁", w - 18, F.Y(0) - 6); ctx.fillText("x₂", F.X(0) + 6, 12);
      [-2, -1, 1, 2].forEach(function (v) { ctx.fillText(v, F.X(v) - 4, F.Y(0) + 14); ctx.fillText(v, F.X(0) + 4, F.Y(v) + 4); });
      var acc = agree / (G * G), problems = [];
      if (acc < regCh.acc) problems.push("agreement below " + (regCh.acc * 100).toFixed(0) + "%");
      if (regCh.maxUnits && net.units > regCh.maxUnits) problems.push("uses " + net.units + " units, the limit is " + regCh.maxUnits);
      if (regCh.maxLayers && net.layers > regCh.maxLayers) problems.push(net.layers + " threshold layers, the limit is " + regCh.maxLayers);
      if (!(net.layers >= 1)) problems.push("the output should be a step() unit");
      S.$("[data-read]").textContent = "agreement      " + (acc * 100).toFixed(2) + "%\nthreshold units " + net.units + "\nthreshold layers " + net.layers + (net.layers >= 1 ? "  (" + (net.layers - 1) + " hidden + output)" : "") + (bad ? "\nwarning: some outputs were not finite" : "");
      var st = S.$("[data-status]");
      if (!problems.length) {
        st.textContent = regCh.id === "ring" && net.layers <= 2 ? "Solved, and with one hidden layer." : regCh.id === "circle" ? "Solved with " + net.units + " units." : "Solved."; st.className = "status ok";
        if (!regSolved[regCh.id]) { regSolved[regCh.id] = true; store.set("reg-solved", regSolved); renderChips(); }
      } else { st.textContent = "Not yet: " + problems.join("; ") + "."; st.className = "status meh"; }
      if (Object.keys(regSolved).length >= 4) markDone("regions");
    }
    var probe = null, lastNet = null;
    var fw = function (v) { var r = Math.round(v * 1000) / 1000; return (r < 0 ? "−" : "") + String(Math.abs(r)); };
    /* Measure each line's weights by evaluating its affine part on unit inputs, then fold plain
       sums into the units that read them, so the drawing shows only real threshold units. */
    function structure(net) {
      var lin = {}, units = net.inputs.slice(), nonlinear = [];
      net.inputs.forEach(function (k) { var c = {}; c[k] = 1; lin[k] = { c: c, b: 0 }; });
      net.graph.forEach(function (g) {
        // Constants (lines with no inputs, such as c = 0.70711) are held at their value; only the other dependencies vary.
        var isConst = function (k) { return lin[k] && !Object.keys(lin[k].c).length; };
        var vary = g.deps.filter(function (k) { return !isConst(k); });
        var at = function (vals) { var env = {}; g.deps.forEach(function (k) { if (isConst(k)) env[k] = lin[k].b; }); vary.forEach(function (k, i) { env[k] = vals[i]; }); return g.aff(env); };
        var zero = vary.map(function () { return 0; }), b0 = at(zero), w = vary.map(function (_, i) { var v = zero.slice(); v[i] = 1; return at(v) - b0; });
        var affine = isFinite(b0) && w.every(isFinite) && Math.abs(at(vary.map(function () { return 1; })) - b0 - w.reduce(function (s, x) { return s + x; }, 0)) < 1e-9 &&
          vary.every(function (_, i) { var v = zero.slice(); v[i] = 2; return Math.abs(at(v) - b0 - 2 * w[i]) < 1e-9; });
        var c = {}, b = b0;
        if (affine) vary.forEach(function (k, i) { var src = lin[k]; b += w[i] * src.b; Object.keys(src.c).forEach(function (u) { c[u] = (c[u] || 0) + w[i] * src.c[u]; }); });
        else { nonlinear.push(g.name); vary.forEach(function (k) { c[k] = NaN; }); }
        Object.keys(c).forEach(function (u) { if (Math.abs(c[u]) < 1e-12) delete c[u]; });
        g.eff = { c: c, b: b, affine: affine };
        if (g.step || !affine || g.name === "out") { units.push(g.name); var self = {}; self[g.name] = 1; lin[g.name] = { c: self, b: 0 }; }
        else lin[g.name] = { c: c, b: b };
      });
      return { units: units, nonlinear: nonlinear };
    }
    function drawNet(net) {
      lastNet = net;
      var st = structure(net), info = {}, col = {}, cols = [];
      net.graph.forEach(function (g) { info[g.name] = g; });
      st.units.forEach(function (k) {
        var g = info[k];
        col[k] = !g ? 0 : 1 + Math.max.apply(null, Object.keys(g.eff.c).map(function (u) { return col[u] != null ? col[u] : 0; }).concat([0]));
      });
      st.units.forEach(function (k) { (cols[col[k]] = cols[col[k]] || []).push(k); });
      cols = cols.filter(Boolean);
      var W = 680, rows = Math.max.apply(null, cols.map(function (c) { return c.length; })), Hh = Math.max(170, 54 * rows + 20), pos = {};
      cols.forEach(function (c, ci) { c.forEach(function (k, ri) { pos[k] = [66 + ci * (W - 140) / Math.max(1, cols.length - 1), 12 + (ri + .5) * (Hh - 24) / c.length]; }); });
      var env = null;
      if (probe) { env = { x1: probe[0], x2: probe[1] }; try { net.run(env); } catch (e) { env = null; } }
      var fires = function (k) { return env && (net.inputs.indexOf(k) >= 0 ? null : env[k] >= .5); };
      var svg = "", labels = "", fanIn = {}, fanOut = {};
      st.units.forEach(function (k) { var g = info[k]; if (g) Object.keys(g.eff.c).forEach(function (u) { fanIn[k] = (fanIn[k] || 0) + 1; fanOut[u] = (fanOut[u] || 0) + 1; }); });
      var halo = "paint-order:stroke;stroke:var(--n-surface);stroke-width:3px;";
      st.units.forEach(function (k) {
        var g = info[k]; if (!g) return;
        Object.keys(g.eff.c).forEach(function (u) {
          if (!pos[u]) return;
          var a = pos[u], b = pos[k], wv = g.eff.c[u], on = env && (net.inputs.indexOf(u) >= 0 || env[u] >= .5);
          svg += '<line class="edge' + (on ? " on" : "") + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"' + (wv < 0 ? ' style="stroke:var(--n-calm)"' : "") + "/>";
          // put the label where the edges fan apart: near the target when the source feeds many units, else near the source
          var t = (fanOut[u] || 1) >= (fanIn[k] || 1) ? 0.74 : 0.26, lx = a[0] + (b[0] - a[0]) * t, ly = a[1] + (b[1] - a[1]) * t;
          labels += '<text class="w" x="' + lx + '" y="' + (ly - 3) + '" text-anchor="middle" style="' + halo + (wv < 0 ? "fill:var(--n-calm)" : "") + '">' + (isNaN(wv) ? "?" : fw(wv)) + "</text>";
        });
      });
      st.units.forEach(function (k) {
        var p = pos[k], g = info[k], isIn = !g, on = fires(k), isOut = k === "out";
        var stroke = isOut ? "var(--n-fire)" : isIn ? "var(--n-muted)" : g.step ? "var(--n-calm)" : "var(--n-warn)";
        svg += '<circle class="node' + (on ? " on" : "") + '" cx="' + p[0] + '" cy="' + p[1] + '" r="17" style="stroke:' + stroke + '"' + (g && !g.step ? ' stroke-dasharray="4 3"' : "") + "/>";
        var inside = isIn ? (env ? fw(isIn ? env[k] : 0) : k) : (g.eff.affine ? fw(g.eff.b) : "f");
        labels += '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" style="font-size:11px' + (on ? ";fill:#fff" : "") + '">' + esc(String(inside)) + "</text>";
        labels += isIn ? '<text class="w" x="' + (p[0] - 22) + '" y="' + (p[1] + 4) + '" text-anchor="end" style="' + halo + '">' + esc(k) + "</text>"
          : '<text class="w" x="' + (p[0] + 21) + '" y="' + (p[1] - 13) + '" style="' + halo + '">' + esc(k) + "</text>";
      });
      var el2 = S.$("[data-net]"); el2.setAttribute("viewBox", "0 0 " + W + " " + Hh); el2.innerHTML = svg + labels;
      var stepUnits = st.units.filter(function (k) { return info[k] && info[k].step; }).length;
      S.$("[data-netinfo]").textContent = (cols.length - 1) + " layer" + (cols.length === 2 ? "" : "s") + " of units · " + stepUnits + " threshold unit" + (stepUnits === 1 ? "" : "s") +
        (st.nonlinear.length ? " · not affine, drawn with ?: " + st.nonlinear.join(", ") : "") +
        (probe ? " · probe (" + fw(probe[0]) + ", " + fw(probe[1]) + "): output " + (env && env.out >= .5 ? "fires" : "silent") : " · click the plot to probe a point");
    }
    S.$("[data-canvas]").style.cursor = "crosshair";
    S.$("[data-canvas]").addEventListener("click", function (ev) {
      var rect = ev.currentTarget.getBoundingClientRect(), F = frame(rect.width, rect.height, LO, HI, LO, HI, 0);
      probe = [Math.round(F.ix(ev.clientX - rect.left) * 100) / 100, Math.round(F.iy(ev.clientY - rect.top) * 100) / 100];
      run();
    });
    var code = S.$("[data-code]");
    code.addEventListener("input", debounce(run, 350));
    code.addEventListener("keydown", function (e) { if (e.key === "Tab" && !e.shiftKey && !e.altKey) { e.preventDefault(); var s = code.selectionStart; code.setRangeText("  ", s, code.selectionEnd, "end"); } });
    S.$("[data-reset]").onclick = function () { code.value = regCh.starter; run(); };
    S.$("[data-sol]").onclick = function () { if (confirm("Replace your code with a solution?")) { code.value = regCh.sol; run(); } };
    load(); onRedraw(host, run);
    renderQuiz(S.$("[data-quiz]"), "Checkpoint", [
      { q: "How many threshold perceptrons does an MLP need to model a hexagonal decision region in 2D?", o: ["6", "7", "12", "13"], a: 1, why: "Six units, one per edge, plus one output unit that ANDs them." },
      { q: "In the edge–AND–OR construction, what does modelling the union of two separate polygons require?", o: ["One more unit in the first layer", "A third layer that ORs the two polygon outputs", "Sigmoid activations", "Nothing extra"], a: 1, why: "Layer 1 draws edges, layer 2 ANDs them into polygons, and layer 3 ORs the polygons. A single hidden layer can only approximate it, which is why the \"one hidden layer\" challenge sets 95%." },
      { q: "A regular N-gon region in 2D, built from edges and an AND, uses how many threshold units?", o: ["N", "N + 1", "2N", "N²"], a: 1, why: "One unit per edge and one AND at the output." },
      { q: "For an MNIST classifier, where does the decision boundary live?", o: ["In 2 dimensions", "In 10 dimensions", "In 784 dimensions", "In 28 dimensions"], a: 2, why: "Each 28×28 image is a point in 784-dimensional space. The same edge-AND-OR logic applies there with hyperplanes instead of lines." }
    ], "regions");
  });

  /* =========================================================================
     6. CYLINDER
     ========================================================================= */
  GU.lab("nn-cylinder", function (host) {
    var S = mountShell(host, "Lab 6 · From polygons to cylinders", "vary N and the count threshold τ",
      '<p class="intro">This is paper problem 6 made visible. Take a regular N-gon around the unit circle, with one threshold unit per edge. Instead of AND-ing them, look at <em>how many</em> fire. Inside, all N do. Far away, the count falls towards N/2, never to zero. Thresholding that count at τ·N gives the output region.</p>' +
      '<div class="bench"><div><div class="plot"><canvas data-heat></canvas></div><p class="cap">Shading shows the fraction of units firing. The magenta area is where the output fires.</p></div>' +
      '<div><label class="ctl"><span>N edges</span><input type="range" min="3" max="64" step="1" value="8" data-n><output data-no></output></label>' +
      '<label class="ctl"><span>τ</span><input type="range" min="0.52" max="1" step="0.005" value="1" data-t><output data-to></output></label>' +
      '<div class="plot"><canvas data-curve></canvas></div><p class="cap">Fraction firing against distance r from the centre. Solid: this N, averaged over directions. Dashed: the N → ∞ limit ½ + arcsin(1/r)/π.</p>' +
      '<div class="readout" data-read></div><p class="cap">Task: with N ≥ 32, choose τ so that the output region is a disc of radius about 2.</p><p class="status" data-status></p></div></div>' +
      '<div class="quiz" data-quiz></div>');
    function draw() {
      var T = theme(S.body), N = +S.$("[data-n]").value, tau = +S.$("[data-t]").value;
      S.$("[data-no]").textContent = N; S.$("[data-to]").textContent = tau.toFixed(3);
      var cs = [], sn = []; for (var k = 0; k < N; k++) { cs.push(Math.cos(2 * Math.PI * k / N)); sn.push(Math.sin(2 * Math.PI * k / N)); }
      var d = Math.cos(Math.PI / N), thr = tau * N - 1e-9, mono = getComputedStyle(document.documentElement).getPropertyValue("--mono");
      (function () {
        var cv = S.$("[data-heat]"), f = fit(cv, 1), ctx = f.ctx, w = f.w, h = f.h, R = 4, GG = 180, img = new ImageData(GG, GG), cF = rgb(T.fire), cS = rgb(T.surface), cI = rgb(T.calm);
        for (var j = 0; j < GG; j++) for (var i = 0; i < GG; i++) {
          var x = -R + 2 * R * (i + .5) / GG, y = R - 2 * R * (j + .5) / GG, c = 0;
          for (var q = 0; q < N; q++) if (x * cs[q] + y * sn[q] <= d) c++;
          var frac = c / N, k4 = 4 * (j * GG + i), col;
          if (c >= thr) col = cF; else { var a = Math.max(0, Math.min(1, (frac - .5) / .5)) * .55; col = cS.map(function (v, z) { return Math.round(v * (1 - a) + cI[z] * a); }); }
          img.data[k4] = col[0]; img.data[k4 + 1] = col[1]; img.data[k4 + 2] = col[2]; img.data[k4 + 3] = 255;
        }
        var off = document.createElement("canvas"); off.width = GG; off.height = GG; off.getContext("2d").putImageData(img, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(off, 0, 0, w, h);
        var F = frame(w, h, -R, R, -R, R, 0); ctx.strokeStyle = T.ink; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(F.X(0), F.Y(0), (F.X(1) - F.X(0)), 0, 7); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = T.muted; ctx.font = "11px " + mono; ctx.fillText("unit circle (dashed)", 8, h - 8);
      })();
      (function () {
        var cv = S.$("[data-curve]"), f = fit(cv, .6), ctx = f.ctx, w = f.w, h = f.h, pad = 34, rmax = 5;
        var X = function (r) { return pad + (r / rmax) * (w - pad - 10); }, Y = function (v) { return h - 22 - ((v - .4) / .6) * (h - 32); };
        ctx.clearRect(0, 0, w, h); ctx.strokeStyle = T.line; ctx.fillStyle = T.muted; ctx.font = "11px " + mono;
        [.5, .75, 1].forEach(function (v) { ctx.beginPath(); ctx.moveTo(pad, Y(v)); ctx.lineTo(w - 10, Y(v)); ctx.stroke(); ctx.fillText(v.toFixed(2), 2, Y(v) + 4); });
        [1, 2, 3, 4].forEach(function (r) { ctx.fillText(r, X(r) - 3, h - 6); }); ctx.fillText("r", w - 14, h - 6);
        ctx.strokeStyle = T.muted; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath();
        for (var r = 0; r <= rmax; r += .02) { var v = r <= 1 ? 1 : .5 + Math.asin(1 / r) / Math.PI; if (r) ctx.lineTo(X(r), Y(v)); else ctx.moveTo(X(r), Y(v)); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = T.fire; ctx.lineWidth = 2; ctx.beginPath(); var A = 90;
        for (var r2 = 0; r2 <= rmax; r2 += .04) {
          var s = 0;
          for (var a = 0; a < A; a++) { var ph = 2 * Math.PI * (a + .5) / A, x = r2 * Math.cos(ph), y = r2 * Math.sin(ph); for (var q = 0; q < N; q++) if (x * cs[q] + y * sn[q] <= d) s++; }
          var val = s / (A * N); if (r2) ctx.lineTo(X(r2), Y(val)); else ctx.moveTo(X(r2), Y(val));
        }
        ctx.stroke();
        ctx.strokeStyle = T.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, Y(tau)); ctx.lineTo(w - 10, Y(tau)); ctx.stroke(); ctx.fillStyle = T.ink; ctx.fillText("τ", w - 20, Y(tau) - 4);
      })();
      var rStar = tau >= 1 ? null : 1 / Math.sin(Math.PI * (tau - .5));
      S.$("[data-read]").textContent = "units: " + N + " edges + 1 output = " + (N + 1) + "\noutput fires when at least " + Math.ceil(tau * N - 1e-9) + " of " + N + " edge units fire\n" +
        (rStar ? "limit radius of the output region (N → ∞): r* = 1 / sin(π(τ − ½)) = " + rStar.toFixed(2) : "τ = 1: the output is the AND, exactly the polygon");
      var st = S.$("[data-status]");
      if (N >= 32 && rStar && Math.abs(rStar - 2) < .12) { st.textContent = "Radius " + rStar.toFixed(2) + " with τ = " + tau.toFixed(3) + ". The exact value is τ = ⅔."; st.className = "status ok"; markDone("cylinder"); }
      else st.textContent = "";
    }
    ["[data-n]", "[data-t]"].forEach(function (s) { S.$(s).addEventListener("input", draw); });
    draw(); onRedraw(host, draw);
    renderQuiz(S.$("[data-quiz]"), "Checkpoint", [
      { q: "As N → ∞, what fraction of the edge units fire for a point very far from the centre?", o: ["0", "¼", "½", "1"], a: 2, why: "½ + arcsin(1/r)/π tends to ½ as r → ∞: each unit sees a half-plane, and far away roughly half of them face towards the point." },
      { q: "Why is this \"cylinder\" useful for the universal-approximation argument?", o: ["Its output is exactly a polygon", "The summed count is high on a disc and falls to a constant baseline elsewhere, so several cylinders can be added and thresholded together", "It needs fewer units than the AND construction", "It works without thresholds"], a: 1, why: "Because the far-field baseline is the same constant N/2 for every cylinder, you can sum many of them, subtract the baseline, and threshold once. That gives arbitrary regions with a single hidden layer, at the cost of very many units." },
      { q: "With τ = 1, what does the output compute?", o: ["A disc", "The AND of all edges, the N-gon itself", "Nothing ever fires", "The complement of the polygon"], a: 1, why: "Requiring all N units to fire is the edge-and-AND construction." }
    ], "cylinder");
  });

  /* =========================================================================
     7. PULSES
     ========================================================================= */
  var PF = { sin: function (x) { return Math.sin(x); }, bump: function (x) { return Math.exp(-Math.pow(x - Math.PI, 2)); }, saw: function (x) { return ((x / Math.PI) % 1) * 2 - 1; } };
  GU.lab("nn-pulses", function (host) {
    var S = mountShell(host, "Lab 7 · Pulses and regression", "choose a target and the number of pulses",
      '<p class="intro">Two threshold units and a summing output give a square pulse: <code>step(x − T₁) − step(x − T₂)</code> is 1 only between T₁ and T₂. Scale each pulse by the function\'s height and add them up, and you can approximate any function of one variable. Narrower pulses mean a better fit but more neurons.</p>' +
      '<div class="bench"><div class="plot"><canvas data-canvas></canvas></div><div>' +
      '<label class="ctl"><span>Target</span><select data-f><option value="sin">sin x</option><option value="bump">bump e^−(x−π)²</option><option value="saw">sawtooth</option></select><span></span></label>' +
      '<label class="ctl"><span>Pulses K</span><input type="range" min="1" max="100" step="1" value="6" data-k><output data-ko></output></label>' +
      '<div class="readout" data-read></div><p class="cap">Task: get the maximum error on sin x below 0.05. Note how many threshold units the pulse-by-pulse construction needs, and how many the shared-edge version needs.</p><p class="status" data-status></p></div></div>' +
      '<div class="quiz" data-quiz></div>');
    function draw() {
      var T = theme(S.body), K = +S.$("[data-k]").value; S.$("[data-ko]").textContent = K;
      var key = S.$("[data-f]").value, f = PF[key], L = 2 * Math.PI, dx = L / K;
      var approx = function (x) { var i = Math.min(K - 1, Math.max(0, Math.floor(x / dx))); return f((i + .5) * dx); };
      var cv = S.$("[data-canvas]"), fi = fit(cv, .75), ctx = fi.ctx, w = fi.w, h = fi.h, F = frame(w, h, -.2, L + .2, -1.35, 1.35, 10);
      ctx.clearRect(0, 0, w, h); axes(ctx, F, w, h, T, -.2, L + .2, -1.35, 1.35);
      ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      if (K <= 40) for (var i = 0; i <= K; i++) { ctx.beginPath(); ctx.moveTo(F.X(i * dx), F.Y(-1.3)); ctx.lineTo(F.X(i * dx), F.Y(1.3)); ctx.stroke(); }
      ctx.fillStyle = T.fireSoft;
      for (var j = 0; j < K; j++) { var hg = f((j + .5) * dx); ctx.fillRect(F.X(j * dx), Math.min(F.Y(0), F.Y(hg)), F.X((j + 1) * dx) - F.X(j * dx), Math.abs(F.Y(hg) - F.Y(0))); }
      ctx.strokeStyle = T.fire; ctx.lineWidth = 2; ctx.beginPath();
      for (var m = 0; m < K; m++) { var hgt = f((m + .5) * dx); if (m === 0) ctx.moveTo(F.X(0), F.Y(hgt)); else ctx.lineTo(F.X(m * dx), F.Y(hgt)); ctx.lineTo(F.X((m + 1) * dx), F.Y(hgt)); }
      ctx.stroke();
      ctx.strokeStyle = T.calm; ctx.lineWidth = 2.2; ctx.beginPath(); var maxE = 0;
      for (var s = 0; s <= 1200; s++) {
        var x = L * s / 1200, y = f(x);
        if (key === "saw" && s > 0 && Math.abs(y - f(L * (s - 1) / 1200)) > 1) ctx.moveTo(F.X(x), F.Y(y)); else if (s) ctx.lineTo(F.X(x), F.Y(y)); else ctx.moveTo(F.X(x), F.Y(y));
        if (!(key === "saw" && Math.abs((x / Math.PI) % 1) < 1e-3)) maxE = Math.max(maxE, Math.abs(y - approx(x)));
      }
      ctx.stroke();
      ctx.fillStyle = T.muted; ctx.font = "11px " + getComputedStyle(document.documentElement).getPropertyValue("--mono"); ctx.fillText("0", F.X(0) - 3, F.Y(0) + 14); ctx.fillText("2π", F.X(L) - 8, F.Y(0) + 14);
      S.$("[data-read]").textContent = "pulses K = " + K + ", width " + dx.toFixed(3) + "\nmax |error| = " + maxE.toFixed(4) + "\npulse by pulse: 2K = " + (2 * K) + " threshold units + 1 summing output\nshared edges: K + 1 = " + (K + 1) + " threshold units + 1 summing output";
      var st = S.$("[data-status]");
      if (key === "sin" && maxE < .05) { st.textContent = "Below 0.05 with K = " + K + "."; st.className = "status ok"; markDone("pulses"); } else st.textContent = "";
    }
    ["[data-k]", "[data-f]"].forEach(function (s) { S.$(s).addEventListener("input", draw); });
    draw(); onRedraw(host, draw);
    renderQuiz(S.$("[data-quiz]"), "Checkpoint", [
      { q: "Neighbouring pulses share an edge. How can the network use fewer than 2K threshold units?", o: ["It can't", "Telescoping: Σ hₖ[step(x−Tₖ) − step(x−Tₖ₊₁)] = Σ (hₖ − hₖ₋₁)·step(x−Tₖ), so K+1 units suffice", "Use sigmoids", "Drop every other pulse"], a: 1, why: "Each internal threshold appears twice, once rising and once falling. Merging the pair into one unit with weight hₖ − hₖ₋₁ gives a staircase with K+1 units." },
      { q: "How many neurons does a network of sinusoidal (y = sin z) activations need to model y = cos(2x) exactly?", o: ["3", "floor(π/2) or ceil(π/2)", "Infinite", "None of the above"], a: 3, why: "One neuron is enough, since cos(2x) = sin(2x + π/2), with weight 2 and bias π/2. None of the other options is one." },
      { q: "To halve the maximum error on a smooth function with this piecewise-constant construction, you need roughly…", o: ["the same number of units", "twice as many units", "four times as many units", "exponentially more"], a: 1, why: "The error of a piecewise-constant fit scales with pulse width times slope, so halving the width roughly halves the error. In d dimensions, the count grows like (1/ε)ᵈ." }
    ], "pulses");
  });

  /* =========================================================================
     8. KATAS
     ========================================================================= */
  var BOOL = { AND: [0, 0, 0, 1], OR: [0, 1, 1, 1], NAND: [1, 1, 1, 0], XOR: [0, 1, 1, 0] }, BX = [[0, 0], [0, 1], [1, 0], [1, 1]];
  var near = function (a, b, t) { return Math.abs(a - b) < (t || 1e-6); };
  function classifies(r, X, d) { return X.every(function (x, i) { return ((x.reduce(function (s, v, j) { return s + v * r.w[j]; }, 0) + r.b) >= 0 ? 1 : 0) === d[i]; }); }
  function allBits(n) { var out = []; for (var k = 0; k < (1 << n); k++) { var row = []; for (var j = 0; j < n; j++) row.push((k >> j) & 1); out.push(row); } return out; }
  function makeNeuron() {
    var calls = 0;
    var f = function (w, b, x) { calls++; var z = b; for (var i = 0; i < w.length; i++) z += w[i] * x[i]; return z >= 0 ? 1 : 0; };
    f.reset = function () { calls = 0; }; f.calls = function () { return calls; }; return f;
  }
  function ojaRun(f) { var D = corrData(400, 3), r = mulberry(5), w = [.5, .2]; for (var t = 0; t < 4000; t++) w = f(w, D[Math.floor(r() * D.length)], .005); return w; }
  var KATAS = [
    { id: "mp", n: "McCulloch–Pitts", fn: "mp", prompt: "Write <code>mp(excitatory, inhibitory, threshold)</code>. Both input lists hold 0s and 1s. Return 1 if no inhibitory input is active and the number of active excitatory inputs is at least the threshold, otherwise 0.",
      starter: "function mp(excitatory, inhibitory, threshold) {\n  // excitatory, inhibitory: arrays of 0/1\n  return 0;\n}\n",
      tests: [["AND: mp([1,1], [], 2) is 1", function (f) { return f([1, 1], [], 2) === 1; }], ["AND: mp([1,0], [], 2) is 0", function (f) { return f([1, 0], [], 2) === 0; }], ["OR: mp([0,1], [], 1) is 1", function (f) { return f([0, 1], [], 1) === 1; }],
        ["Absolute veto: mp([1,1,1], [1], 2) is 0", function (f) { return f([1, 1, 1], [1], 2) === 0; }], ["Inactive inhibitor: mp([1,1], [0], 2) is 1", function (f) { return f([1, 1], [0], 2) === 1; }], ["Threshold 0 fires with no input: mp([0], [], 0) is 1", function (f) { return f([0], [], 0) === 1; }]],
      js: "function mp(excitatory, inhibitory, threshold) {\n  if (inhibitory.some(v => v === 1)) return 0;\n  const s = excitatory.reduce((a, v) => a + v, 0);\n  return s >= threshold ? 1 : 0;\n}",
      py: "def mp(excitatory, inhibitory, threshold):\n    if any(inhibitory):\n        return 0\n    return int(sum(excitatory) >= threshold)" },
    { id: "perc", n: "Perceptron training", fn: "perceptronTrain", prompt: "Write <code>perceptronTrain(X, d, eta, maxEpochs)</code> using Rosenblatt's sequential rule. Start from zero weights and bias. For each sample, compute y = 1 if w·x + b ≥ 0, then update w ← w + η(d − y)x and b ← b + η(d − y). Stop after an epoch with no mistakes, or after maxEpochs. Return <code>{w, b, epochs, converged}</code>.",
      starter: "function perceptronTrain(X, d, eta, maxEpochs) {\n  const w = new Array(X[0].length).fill(0);\n  let b = 0;\n  let epochs = 0, converged = false;\n  // your loop here\n  return { w, b, epochs, converged };\n}\n",
      tests: [["Learns AND", function (f) { var r = f(BX, BOOL.AND, 1, 100); return r.converged === true && classifies(r, BX, BOOL.AND); }], ["Learns OR", function (f) { var r = f(BX, BOOL.OR, 1, 100); return r.converged && classifies(r, BX, BOOL.OR); }],
        ["Learns NAND", function (f) { var r = f(BX, BOOL.NAND, 0.5, 100); return r.converged && classifies(r, BX, BOOL.NAND); }], ["Reports converged = false on XOR", function (f) { return f(BX, BOOL.XOR, 1, 100).converged === false; }],
        ["Never exceeds maxEpochs", function (f) { return f(BX, BOOL.XOR, 1, 37).epochs <= 37; }], ["Learns 3-input majority", function (f) { var X = allBits(3), d = X.map(function (x) { return x[0] + x[1] + x[2] >= 2 ? 1 : 0; }), r = f(X, d, 1, 200); return r.converged && classifies(r, X, d); }]],
      js: "function perceptronTrain(X, d, eta, maxEpochs) {\n  const w = new Array(X[0].length).fill(0);\n  let b = 0, epochs = 0, converged = false;\n  while (epochs < maxEpochs && !converged) {\n    let mistakes = 0;\n    X.forEach((x, i) => {\n      const z = x.reduce((s, v, j) => s + v * w[j], b);\n      const err = d[i] - (z >= 0 ? 1 : 0);\n      if (err !== 0) {\n        mistakes++;\n        x.forEach((v, j) => { w[j] += eta * err * v; });\n        b += eta * err;\n      }\n    });\n    epochs++;\n    converged = mistakes === 0;\n  }\n  return { w, b, epochs, converged };\n}",
      py: "import numpy as np\n\ndef perceptron_train(X, d, eta=1.0, max_epochs=100):\n    X, d = np.asarray(X, float), np.asarray(d)\n    w, b = np.zeros(X.shape[1]), 0.0\n    for epoch in range(1, max_epochs + 1):\n        mistakes = 0\n        for x, t in zip(X, d):\n            err = t - int(w @ x + b >= 0)\n            if err:\n                w += eta * err * x\n                b += eta * err\n                mistakes += 1\n        if mistakes == 0:\n            return w, b, epoch, True\n    return w, b, max_epochs, False" },
    { id: "oja", n: "Oja's rule", fn: "ojaStep", prompt: "Write <code>ojaStep(w, x, eta)</code>, which returns a <em>new</em> weight array after one update y = w·x, w ← w + η·y·(x − y·w). Do not modify the input. The tests then run your rule on correlated data and check that |w| settles near 1 along the principal direction.",
      starter: "function ojaStep(w, x, eta) {\n  return w.slice();\n}\n",
      tests: [["One step: ojaStep([1,0], [1,1], 0.1) = [1, 0.1]", function (f) { var r = f([1, 0], [1, 1], 0.1); return near(r[0], 1) && near(r[1], 0.1); }], ["Leaves the input array unchanged", function (f) { var w = [1, 0]; f(w, [1, 1], .1); return w[0] === 1 && w[1] === 0; }],
        ["|w| settles within 0.1 of 1", function (f) { var w = ojaRun(f); return Math.abs(Math.hypot(w[0], w[1]) - 1) < .1; }],
        ["Points within 6° of the principal direction", function (f) { return angTo(ojaRun(f)) < 6; }]],
      js: "function ojaStep(w, x, eta) {\n  const y = w.reduce((s, v, i) => s + v * x[i], 0);\n  return w.map((v, i) => v + eta * y * (x[i] - y * v));\n}",
      py: "import numpy as np\n\ndef oja_step(w, x, eta):\n    y = w @ x\n    return w + eta * y * (x - y * w)" },
    { id: "xor", n: "XOR network", fn: "xorNet", prompt: "Write <code>xorNet(a, b)</code> using only the provided helper <code>neuron(weights, bias, inputs)</code>, which returns 1 when w·x + b ≥ 0. Use at most 3 neurons per call, and no if-statements on the inputs.",
      starter: "function xorNet(a, b) {\n  // const h1 = neuron([.., ..], .., [a, b]);\n  return 0;\n}\n",
      tests: BX.map(function (ab, i) { return ["xorNet(" + ab[0] + ", " + ab[1] + ") is " + BOOL.XOR[i], function (f) { return f(ab[0], ab[1]) === BOOL.XOR[i]; }]; })
        .concat([["Uses between 1 and 3 neurons per call", function (f, N) { N.reset(); f(1, 0); var c = N.calls(); return c >= 1 && c <= 3; }]]),
      js: "function xorNet(a, b) {\n  const or   = neuron([1, 1], -1, [a, b]);   // a OR b\n  const nand = neuron([-1, -1], 1.5, [a, b]); // NOT (a AND b)\n  return neuron([1, 1], -2, [or, nand]);    // AND\n}",
      py: "def neuron(w, b, x):\n    return int(sum(wi * xi for wi, xi in zip(w, x)) + b >= 0)\n\ndef xor_net(a, b):\n    h_or = neuron([1, 1], -1, [a, b])\n    h_nand = neuron([-1, -1], 1.5, [a, b])\n    return neuron([1, 1], -2, [h_or, h_nand])" },
    { id: "parity", n: "Parity in n+1 neurons", fn: "parityNet", prompt: "Write <code>parityNet(bits)</code>, which returns 1 when an odd number of bits are on. Use one hidden layer of at most <em>n</em> neurons feeding one output neuron, so n + 1 calls to <code>neuron</code>. The minterm (DNF) construction needs 2ⁿ⁻¹ + 1 units. Find something much smaller. Hint: a unit can count.",
      starter: "function parityNet(bits) {\n  const n = bits.length;\n  // hidden layer: n neurons reading bits\n  // output: one neuron reading the hidden layer\n  return 0;\n}\n",
      tests: [2, 3, 4, 5, 6].map(function (n) { return ["Correct on all " + (1 << n) + " inputs for n = " + n, function (f) { return allBits(n).every(function (x) { return f(x) === (x.reduce(function (a, v) { return a + v; }, 0) % 2); }); }]; })
        .concat([["At most n + 1 neurons for n = 6", function (f, N) { N.reset(); f([1, 0, 1, 1, 0, 0]); return N.calls() <= 7 && N.calls() >= 2; }]]),
      js: "function parityNet(bits) {\n  const n = bits.length, ones = bits.map(() => 1);\n  // h_k fires when at least k bits are on\n  const h = [];\n  for (let k = 1; k <= n; k++) h.push(neuron(ones, -k, bits));\n  // alternating sum h1 - h2 + h3 - ... is 1 for odd counts, 0 for even\n  const alt = h.map((_, i) => (i % 2 === 0 ? 1 : -1));\n  return neuron(alt, -1, h);\n}",
      py: "import numpy as np\n\ndef parity_net(bits):\n    bits = np.asarray(bits)\n    n = len(bits)\n    h = (bits.sum() >= np.arange(1, n + 1)).astype(int)  # n counting units\n    alt = np.where(np.arange(n) % 2 == 0, 1, -1)\n    return int(alt @ h - 1 >= 0)" }
  ];
  GU.lab("nn-katas", function (host) {
    var S = mountShell(host, "Lab 8 · Code katas", "JavaScript, tested in your browser; Ctrl/Cmd+Enter runs",
      '<p class="intro">Implement the chapter\'s models in JavaScript and run the tests in your browser. Each solution reveal also shows the NumPy version, so you can rebuild it in Python. Your code is saved in this browser.</p>' +
      '<div class="notice" hidden data-notice>This page can\'t run code in this browser, so the tests are unavailable. You can still read each task and reveal the solutions.</div>' +
      '<div class="row chips" role="group" aria-label="Katas" data-chips></div>' +
      '<div class="bench wide-left"><div><p class="intro" data-prompt></p><textarea class="editor" spellcheck="false" aria-label="Kata code" style="min-height:320px" data-code></textarea>' +
      '<div class="row"><button class="btn primary" type="button" data-run>Run tests</button><button class="btn" type="button" data-reset>Restore starter</button></div></div>' +
      '<div><ul class="tests" data-results></ul><p class="status" data-status></p><details data-sol><summary class="cap" style="cursor:pointer;color:var(--n-calm)">Reveal solution</summary><div data-solbody></div></details></div></div>');
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
      var N = makeNeuron(), fn;
      try { fn = (new Function("neuron", "corrData", '"use strict";\n' + src + "\n;return (typeof " + kata.fn + "==='function')?" + kata.fn + ":undefined;"))(N, corrData); }
      catch (e) { st.textContent = "Your code has an error: " + e.message; st.className = "status bad"; return; }
      if (!fn) { st.textContent = "Define a function named " + kata.fn + "."; st.className = "status bad"; return; }
      var pass = 0;
      kata.tests.forEach(function (t) {
        var li = el("li"), ok = false, msg = "";
        try { N.reset(); ok = !!t[1](fn, N); } catch (e) { msg = e.message; }
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

  /* =========================================================================
     9. PAPER PROBLEMS — progress over the lesson's A-exercises
     The problems themselves are the lesson's checked exercises A1–A9; this
     lab counts how many have been attempted in the answer checker.
     ========================================================================= */
  GU.lab("nn-problems", function (host) {
    var S = mountShell(host, "Lab 9 · Paper problems", "the problems are exercises A1–A9 below",
      '<p class="intro">Work these with pen and paper. Open a hint only when you\'re stuck, and check your answer against the solution afterwards. Each problem below has typed checks where the answer is a number, a model-marked box for your written argument, and a gated reference solution.</p>' +
      '<div class="readout" data-read></div><div class="row"><button class="btn" type="button" data-go>Go to problem 1</button></div>');
    var BANK = "nn-01-connectionism-threshold-unit";
    function render() {
      if (!host.isConnected) { document.removeEventListener("click", later, true); return; }
      var work = {}; try { work = (JSON.parse(localStorage.getItem("gu.work.v1") || "{}")[BANK]) || {}; } catch (e) {}
      var ids = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"], tried = ids.filter(function (id) { return work[id] && work[id].attempted; });
      S.$("[data-read]").textContent = tried.length + " of 9 problems attempted" + (tried.length ? " (" + tried.join(", ") + ")" : "") + ". Four attempts complete this lab.";
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

  /* =========================================================================
     10. FINAL QUIZ
     ========================================================================= */
  GU.lab("nn-quiz", function (host) {
    var S = mountShell(host, "Lab 10 · Review quiz", "mixed questions across the whole lecture",
      '<p class="intro">Mixed questions across the whole chapter, including details from the reading list.</p><div class="quiz" data-quiz></div>');
    renderQuiz(S.$("[data-quiz]"), "Twelve questions", [
      { q: "In Turing's 1948 B-type machines, what made the network learnable?", o: ["Real-valued weights", "A \"modifier\" on each connection that could switch it between passing a (negated) signal and fixing the output at 1", "Backpropagation", "Inhibitory synapses"], a: 1, why: "Each connection had a modifier. Learning meant setting the modifiers, which was itself to be done by an A-type machine." },
      { q: "Hartley (1749) proposed that memories are…", o: ["Stored in synapses", "Small vibrations (\"vibratiuncles\") in the same brain regions as sensations", "Chemical traces", "Located in the heart"], a: 1, why: "Hartley's vibration theory predates any knowledge of neurons." },
      { q: "Which of these is in the PDP list of requirements for a connectionist system?", o: ["A central clock", "A learning rule by which patterns of connectivity are modified by experience", "A symbolic rule base", "A separate program memory"], a: 1, why: "Rumelhart, Hinton and McClelland (1986) list processing units, activation state, output functions, connectivity, a propagation rule, an activation rule, a learning rule and an environment." },
      { q: "Rosenblatt's original (unsimplified) perceptron organised cells as…", o: ["Input → output only", "Sensors → association area A1 → A2 → response cells, with feedback between A and R", "A fully connected recurrent net", "A single threshold unit"], a: 1, why: "The feedback between A and R cells enforced mutually exclusive outputs. The simplified model kept only fixed association weights and learnable response weights." },
      { q: "What does a 1-D perceptron with weight w > 0 and bias b fire for?", o: ["x ≤ −b/w", "x ≥ −b/w", "x ≥ b/w", "All x"], a: 1, why: "wx + b ≥ 0 gives x ≥ −b/w. In one dimension the \"line\" is a single threshold point." },
      { q: "McCulloch and Pitts showed that a network with inhibition and delays can produce which perceptual effect?", o: ["Colour constancy", "A brief cold stimulus felt as heat", "Depth perception", "Pain suppression"], a: 1, why: "Their heat and cold receptor network fires \"heat\" for a cold touch that is quickly removed, an illusion of perception built from Boolean units." },
      { q: "Who said \"neurons that fire together wire together\", in substance?", o: ["Bain", "Hebb", "Rosenblatt", "Hartley"], a: 1, why: "Hebb (1949, p. 62). The slogan is not in his book; it was coined decades later as a summary. Bain anticipated the idea about 75 years earlier." },
      { q: "Why do we need networks of perceptrons at all?", o: ["Single perceptrons train too slowly", "A single perceptron only draws one linear boundary, so functions like XOR are out of reach", "Single perceptrons cannot use real inputs", "Networks need fewer weights"], a: 1, why: "Minsky and Papert's point: individual units are weak computational elements." },
      { q: "An MLP of threshold units built from edges, ANDs and ORs can represent…", o: ["Only convex regions", "Only polygons", "Any region, to arbitrary precision", "Only regions in 2D"], a: 2, why: "MLPs are universal classifiers: any decision boundary can be captured to arbitrary precision." },
      { q: "Which statement about the threshold activation θ(z) used in this chapter is right?", o: ["θ(z) = 1 if z > 0 only", "θ(z) = 1 if z ≥ 0, else 0", "θ(z) = z", "θ(z) = sign(z) ∈ {−1, 1}"], a: 1, why: "Here the unit fires on z ≥ 0, so points exactly on the boundary fire. The worked diamond design relies on this." },
      { q: "Viewing transcription, captioning and game-playing as \"boxes\", the key claim is that…", o: ["They need different kinds of networks", "Each box is a function, and a neural network can approximate it", "They are not computable", "They need symbolic AI"], a: 1, why: "Interesting AI tasks are functions, and MLPs are universal approximators of functions." },
      { q: "Bain's 1873 estimate of about 1,000 million cells and 5,000 million fibres was checked against how many \"acquisitions\" at the upper end?", o: ["2,000", "200,000", "20 million", "5 billion"], a: 1, why: "200,000, which still left 5,000 cells and 25,000 fibres per grouping (Mind and Body, pp. 106–107). His own count of a learned life was tens of thousands of acquisitions." }
    ], "final", function () { markDone("quiz"); });
  });
})();
