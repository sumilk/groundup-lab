/* ===========================================================================
   labs/core.js — the plotting surface every 2-D lab is built on.
   Load this before any la-*.js lab file.
   =========================================================================== */
(function (global) {
  "use strict";
  var GU = global.GU = global.GU || {};

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function f(n, d) {
    var s = Number(n).toFixed(d === undefined ? 2 : d);
    return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
  }
  function sw(c) { return '<span class="swatch" style="background:' + c + '"></span>'; }
  function mix(tokenValue, pct) {
    return "color-mix(in srgb, " + tokenValue + " " + pct + "%, transparent)";
  }

  /* Build the standard lab chrome and hand back the canvas and panel. */
  function shell(el, opts) {
    el.innerHTML =
      '<div class="lab-head"><span class="lab-title">' + opts.title + "</span>" +
      '<span class="lab-hint">' + (opts.hint || "") + "</span></div>" +
      '<div class="lab-body"><div class="stage"><canvas></canvas></div>' +
      '<div class="panel"></div></div>';
    return { canvas: el.querySelector("canvas"), panel: el.querySelector(".panel") };
  }

  /**
   * plot(canvas, {span, handles, draw, onchange, snap})
   *   span     half-width of the visible world, in units
   *   handles  () => [{v:[x,y], set(p)}]   draggable points
   *   draw     (P) => void                 called on every render
   *   snap     () => boolean               quarter-unit snapping
   */
  function plot(canvas, opts) {
    var ctx = canvas.getContext("2d");
    var P = {
      canvas: canvas, ctx: ctx, W: 0, H: 0, unit: 40,
      span: opts.span || 4.2,
      snap: opts.snap || function () { return false; }
    };

    function resize() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      P.W = Math.max(1, Math.round(r.width));
      P.H = Math.max(1, Math.round(r.height));
      canvas.width = P.W * dpr;
      canvas.height = P.H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P.unit = Math.min(P.W, P.H) / (2 * P.span);
      P.render();
    }

    P.x2p = function (x) { return P.W / 2 + x * P.unit; };
    P.y2p = function (y) { return P.H / 2 - y * P.unit; };
    P.p2x = function (p) { return (p - P.W / 2) / P.unit; };
    P.p2y = function (p) { return (P.H / 2 - p) / P.unit; };

    P.grid = function () {
      var c = ctx, lim = Math.ceil(P.span) + 1;
      c.save();
      c.lineWidth = 1;
      c.strokeStyle = css("--grid");
      c.beginPath();
      for (var i = -lim; i <= lim; i++) {
        c.moveTo(Math.round(P.x2p(i)) + .5, 0); c.lineTo(Math.round(P.x2p(i)) + .5, P.H);
        c.moveTo(0, Math.round(P.y2p(i)) + .5); c.lineTo(P.W, Math.round(P.y2p(i)) + .5);
      }
      c.stroke();
      c.strokeStyle = css("--axis"); c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(0, Math.round(P.y2p(0)) + .5); c.lineTo(P.W, Math.round(P.y2p(0)) + .5);
      c.moveTo(Math.round(P.x2p(0)) + .5, 0); c.lineTo(Math.round(P.x2p(0)) + .5, P.H);
      c.stroke();
      c.restore();
    };

    P.arrow = function (v, color, label, o) {
      o = o || {};
      var c = ctx;
      var fx = o.fx || 0, fy = o.fy || 0;
      var x0 = P.x2p(fx), y0 = P.y2p(fy);
      var x1 = P.x2p(v[0] + fx), y1 = P.y2p(v[1] + fy);
      var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
      c.save();
      c.strokeStyle = color; c.fillStyle = color; c.lineCap = "round";
      c.lineWidth = o.w || 2.4;
      if (o.dash) c.setLineDash(o.dash);
      if (L > 1) {
        var head = Math.min(11, L * .32), ux = dx / L, uy = dy / L;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - ux * head * .75, y1 - uy * head * .75); c.stroke();
        c.setLineDash([]);
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x1 - ux * head - uy * head * .42, y1 - uy * head + ux * head * .42);
        c.lineTo(x1 - ux * head + uy * head * .42, y1 - uy * head - ux * head * .42);
        c.closePath(); c.fill();
      }
      if (label) {
        c.setLineDash([]);
        c.font = '600 13px ' + css("--sans").replace(/"/g, "");
        c.textAlign = "center"; c.textBaseline = "middle";
        var lx = x1 + (L > 1 ? (dx / L) * 16 : 16), ly = y1 + (L > 1 ? (dy / L) * 16 : -16);
        c.fillStyle = css("--paper");
        c.beginPath(); c.arc(lx, ly, 10, 0, 6.2832); c.fill();
        c.fillStyle = color; c.fillText(label, lx, ly + .5);
      }
      c.restore();
    };

    P.dot = function (x, y, color, r, shape) {
      var c = ctx, px = P.x2p(x), py = P.y2p(y);
      c.save(); c.fillStyle = color;
      if (shape === "diamond") {
        c.beginPath(); c.moveTo(px, py - r); c.lineTo(px + r, py);
        c.lineTo(px, py + r); c.lineTo(px - r, py); c.closePath(); c.fill();
      } else {
        c.beginPath(); c.arc(px, py, r, 0, 6.2832); c.fill();
      }
      c.restore();
    };

    P.poly = function (pts, fill, stroke) {
      var c = ctx;
      c.save(); c.beginPath();
      pts.forEach(function (p, i) {
        var px = P.x2p(p[0]), py = P.y2p(p[1]);
        if (i) c.lineTo(px, py); else c.moveTo(px, py);
      });
      c.closePath();
      if (fill) { c.fillStyle = fill; c.fill(); }
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); }
      c.restore();
    };

    P.line = function (a, b, color, dash, w) {
      var c = ctx;
      c.save(); c.strokeStyle = color; c.lineWidth = w || 1.5;
      if (dash) c.setLineDash(dash);
      c.beginPath(); c.moveTo(P.x2p(a[0]), P.y2p(a[1])); c.lineTo(P.x2p(b[0]), P.y2p(b[1])); c.stroke();
      c.restore();
    };

    P.render = function () { ctx.clearRect(0, 0, P.W, P.H); opts.draw(P); };

    /* ------------------------------------------------------------ input -- */
    var active = null;
    function at(e) {
      var r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    }
    canvas.addEventListener("pointerdown", function (e) {
      var p = at(e), best = null, bd = 22;
      opts.handles().forEach(function (h) {
        var d = Math.hypot(p[0] - P.x2p(h.v[0]), p[1] - P.y2p(h.v[1]));
        if (d < bd) { bd = d; best = h; }
      });
      if (best) { active = best; canvas.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    canvas.addEventListener("pointermove", function (e) {
      var p = at(e);
      if (!active) {
        var near = opts.handles().some(function (h) {
          return Math.hypot(p[0] - P.x2p(h.v[0]), p[1] - P.y2p(h.v[1])) < 22;
        });
        canvas.style.cursor = near ? "grab" : "crosshair";
        return;
      }
      var st = e.shiftKey ? .02 : (P.snap() ? .25 : .02);
      var lim = P.span - .15;
      var x = Math.max(-lim, Math.min(lim, Math.round(P.p2x(p[0]) / st) * st));
      var y = Math.max(-lim, Math.min(lim, Math.round(P.p2y(p[1]) / st) * st));
      active.set([x, y]);
      canvas.style.cursor = "grabbing";
      if (opts.onchange) opts.onchange();
      P.render();
    });
    function release() { if (active) { active = null; canvas.style.cursor = "grab"; } }
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);

    if (global.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    global.addEventListener("resize", resize);
    try {
      global.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", function () { P.render(); });
    } catch (e) { /* older browsers: theme change just needs a reload */ }

    resize();
    return P;
  }

  GU.labkit = { css: css, f: f, sw: sw, mix: mix, shell: shell, plot: plot };
})(window);
