/* ===========================================================================
   checker.js — per-exercise answer checking.
   ---------------------------------------------------------------------------
   Three grades of check, in order of how much you should trust them:

     1. deterministic   typed answers compared in JS — exact, instant, offline
     2. model-marked    your written argument marked against a reference proof
                        that is injected into the prompt, so the marking is
                        anchored rather than re-derived each time
     3. reference       the worked solution, gated behind an attempt

   An answers file registers content with GU.answers(pageKey, {A1: {...}}).
   Field types: num, vec, ratio (equal up to a nonzero scalar), set, choice.

   The host page supplies GU_MARK(system, messages, opts) -> Promise<{text}>.
   Without it, grade 2 is hidden and 1 and 3 still work.
   =========================================================================== */
(function (global) {
  "use strict";

  var GU = global.GU = global.GU || {};
  var BANK = {};
  var WKEY = "gu.work.v1";

  GU.answers = function (page, data) { BANK[page] = Object.assign(BANK[page] || {}, data); };

  /* ------------------------------------------------------------- storage -- */
  function readWork() {
    try { return JSON.parse(localStorage.getItem(WKEY) || "{}"); } catch (e) { return {}; }
  }
  function saveWork(page, id, patch) {
    var all = readWork();
    all[page] = all[page] || {};
    all[page][id] = Object.assign(all[page][id] || {}, patch, { updated: Date.now() });
    try { localStorage.setItem(WKEY, JSON.stringify(all)); } catch (e) {}
    return all[page][id];
  }
  function getWork(page, id) { return (readWork()[page] || {})[id] || {}; }
  GU.work = { all: readWork, key: WKEY };

  /* -------------------------------------------------------------- values -- */
  function num(s) {
    s = String(s == null ? "" : s).trim().replace(/√/g, "sqrt").replace(/π/g, "pi").replace(/−/g, "-");
    if (!s) return NaN;
    var probe = s.replace(/sqrt/g, "#").replace(/\bpi\b/g, "#");
    if (!/^[-+*/^(). 0-9#]+$/.test(probe)) return NaN;
    var expr = s.replace(/sqrt/g, "Math.sqrt").replace(/\bpi\b/g, "Math.PI").replace(/\^/g, "**");
    try {
      var v = Function('"use strict";return (' + expr + ");")();
      return (typeof v === "number" && isFinite(v)) ? v : NaN;
    } catch (e) { return NaN; }
  }
  function vec(s) {
    var t = String(s == null ? "" : s).trim();
    /* strip one enclosing bracket pair — but only when it really is enclosing,
       so that "1, 1, -sqrt(2)" keeps the parentheses that belong to sqrt */
    var opens = (t.match(/[([{]/g) || []).length, closes = (t.match(/[)\]}]/g) || []).length;
    if (/^[([{]/.test(t) && /[)\]}]$/.test(t) && opens === closes) t = t.slice(1, -1);
    var parts = /[,;]/.test(t) ? t.split(/[,;]/) : t.split(/\s+/);
    return parts.map(function (p) { return p.trim(); })
      .filter(function (p) { return p !== ""; })
      .map(num);
  }
  var TOL = 1e-6;
  function close(a, b) { return Math.abs(a - b) <= TOL * (1 + Math.abs(b)); }

  function cmpNum(got, ans) { var g = num(got); return !isNaN(g) && close(g, ans); }
  function cmpVec(got, ans) {
    var g = vec(got);
    return g.length === ans.length && g.every(function (x, i) { return !isNaN(x) && close(x, ans[i]); });
  }
  /* A dependency relation is only defined up to a nonzero scalar. */
  function cmpRatio(got, ans) {
    var g = vec(got);
    if (g.length !== ans.length || g.some(isNaN)) return false;
    var pivot = 0;
    for (var i = 1; i < ans.length; i++) if (Math.abs(ans[i]) > Math.abs(ans[pivot])) pivot = i;
    if (Math.abs(ans[pivot]) < TOL) return false;
    var k = g[pivot] / ans[pivot];
    if (!isFinite(k) || Math.abs(k) < 1e-9) return false;
    return ans.every(function (a, j) { return close(g[j], k * a); });
  }
  function cmpSet(got, ans) {
    var g = vec(got);
    if (g.length !== ans.length || g.some(isNaN)) return false;
    var pool = ans.slice();
    return g.every(function (x) {
      for (var i = 0; i < pool.length; i++) if (close(x, pool[i])) { pool.splice(i, 1); return true; }
      return false;
    });
  }

  function check(field, raw) {
    switch (field.type) {
      case "num": return cmpNum(raw, field.ans);
      case "vec": return cmpVec(raw, field.ans);
      case "ratio": return cmpRatio(raw, field.ans);
      case "set": return cmpSet(raw, field.ans);
      case "choice": return String(raw) === String(field.ans);
      default: return false;
    }
  }

  var PLACEHOLDER = {
    num: "a number — 17/7 and sqrt(2) are fine",
    vec: "comma-separated, e.g. 4, -9",
    ratio: "coefficients, any nonzero multiple counts",
    set: "all values, comma-separated"
  };

  /* ------------------------------------------------------------------ UI -- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function typeset(el) {
    if (global.MathJax && global.MathJax.typesetPromise) global.MathJax.typesetPromise([el]).catch(function () {});
    else if (global.renderMathInElement) {
      try {
        global.renderMathInElement(el, {
          delimiters: [{ left: "\\[", right: "\\]", display: true },
                       { left: "\\(", right: "\\)", display: false }],
          throwOnError: false
        });
      } catch (e) {}
    }
  }

  function build(page, id, ex, host) {
    var saved = getWork(page, id);
    var panel = document.createElement("div");
    panel.className = "chk";

    var fieldsHtml = (ex.fields || []).map(function (fl, i) {
      var v = (saved.fields && saved.fields[fl.id] != null) ? esc(saved.fields[fl.id]) : "";
      if (fl.type === "choice") {
        return '<div class="chk-f" data-f="' + fl.id + '"><label>' + fl.label + "</label>" +
          '<select data-in>' + '<option value="">—</option>' +
          fl.opts.map(function (o) {
            return '<option value="' + esc(o) + '"' + (v === esc(o) ? " selected" : "") + ">" + esc(o) + "</option>";
          }).join("") + "</select><span class=\"chk-mk\"></span></div>";
      }
      return '<div class="chk-f" data-f="' + fl.id + '"><label>' + fl.label + "</label>" +
        '<input data-in value="' + v + '" placeholder="' + (PLACEHOLDER[fl.type] || "") + '">' +
        '<span class="chk-mk"></span></div>';
    }).join("");

    var canMark = typeof global.GU_MARK === "function";
    panel.innerHTML =
      (fieldsHtml ? '<div class="chk-fields">' + fieldsHtml + "</div>" : "") +
      '<div class="chk-actions">' +
      (fieldsHtml ? '<button type="button" class="primary chk-go">Check answer</button>' : "") +
      (canMark ? '<button type="button" class="chk-mark' + (fieldsHtml ? "" : " primary") + '">' +
        (ex.proof ? "Mark my proof" : "Mark my working") + "</button>" : "") +
      '<button type="button" class="chk-sol" disabled>Show solution</button>' +
      '<span class="chk-msg"></span></div>' +
      '<div class="chk-work"' + (ex.proof || saved.working ? "" : " hidden") + '>' +
      '<textarea rows="4" placeholder="' +
      (ex.proof ? "Write the argument out. Every step you would not want questioned."
                : "Optional: show your working and have it marked.") +
      '">' + esc(saved.working || "") + "</textarea></div>" +
      '<div class="chk-out" hidden></div>' +
      '<div class="chk-solution" hidden></div>';

    host.appendChild(panel);

    var q = function (s) { return panel.querySelector(s); };
    var msg = q(".chk-msg"), solBtn = q(".chk-sol"), work = q(".chk-work"), ta = work.querySelector("textarea");
    var out = q(".chk-out"), solBox = q(".chk-solution");

    function unlock(why) {
      solBtn.disabled = false;
      solBtn.title = why || "";
      var s = panel.querySelector(".chk-skip");
      if (s) s.remove();
    }
    if (saved.attempted) unlock();
    if (saved.revealed) { solBtn.disabled = false; }

    /* --- grade 1 ------------------------------------------------------- */
    var go = q(".chk-go");
    if (go) {
      go.onclick = function () {
        var vals = {}, wrong = [], blank = 0;
        (ex.fields || []).forEach(function (fl) {
          var row = panel.querySelector('.chk-f[data-f="' + fl.id + '"]');
          var input = row.querySelector("[data-in]");
          var mark = row.querySelector(".chk-mk");
          var raw = input.value;
          vals[fl.id] = raw;
          if (!String(raw).trim()) { blank++; mark.textContent = ""; row.className = "chk-f"; return; }
          var ok = check(fl, raw);
          row.className = "chk-f " + (ok ? "ok" : "no");
          mark.textContent = ok ? "✓" : "✗";
          if (!ok) wrong.push(fl);
        });
        var answered = (ex.fields || []).length - blank;
        var allRight = wrong.length === 0 && blank === 0;
        saveWork(page, id, { fields: vals, attempted: true, correct: allRight });
        unlock();
        if (blank === (ex.fields || []).length) { msg.textContent = "Nothing entered yet."; msg.className = "chk-msg"; return; }
        if (allRight) {
          msg.textContent = "All correct.";
          msg.className = "chk-msg ok";
        } else {
          msg.className = "chk-msg no";
          var hint = wrong.length && ex.hints && ex.hints[wrong[0].id];
          msg.innerHTML = (answered - wrong.length) + " of " + answered + " right." +
            (hint ? " <span class=\"h\">" + hint + "</span>" : "");
          if (hint) typeset(msg);
        }
      };
    }

    /* --- grade 2 ------------------------------------------------------- */
    var markBtn = q(".chk-mark");
    if (markBtn) {
      var ctl = null;
      markBtn.onclick = function () {
        if (work.hidden) { work.hidden = false; ta.focus(); return; }
        var attempt = ta.value.trim();
        if (!attempt) { ta.focus(); msg.textContent = "Write something to mark first."; msg.className = "chk-msg"; return; }
        saveWork(page, id, { working: attempt, attempted: true });
        unlock();

        var system = (global.GU_BRIEF || "") + "\n\n" + (global.GU_GRADE_BRIEF || "") +
          "\n\nTHE EXERCISE (" + id + "):\n" + ex.statement +
          "\n\nA CORRECT REFERENCE SOLUTION, for your eyes only — mark the student against it, " +
          "quote from it only when you have already named where their own argument fails, and never " +
          "paste it wholesale:\n" + (ex.reference || ex.plain || "(none supplied)");

        out.hidden = false;
        out.textContent = "Marking…";
        markBtn.disabled = true;
        ctl = new AbortController();
        global.GU_MARK(system, [{ role: "user", content: "MY ATTEMPT:\n\n" + attempt }], {
          signal: ctl.signal,
          exercise: id,
          page: page,
          onText: function (whole) { out.textContent = whole; }
        }).then(function (r) {
          out.textContent = r.text;
          saveWork(page, id, { marked: r.text });
        }).catch(function (e) {
          out.textContent = (e && e.text) || "";
          msg.textContent = (e && e.message) || "Marking failed.";
          msg.className = "chk-msg no";
          if (!out.textContent) out.hidden = true;
        }).then(function () { markBtn.disabled = false; ctl = null; });
      };
    }

    /* --- grade 3 ------------------------------------------------------- */
    solBtn.onclick = function () {
      if (!solBox.hidden) { solBox.hidden = true; solBtn.textContent = "Show solution"; return; }
      solBox.innerHTML = '<span class="sol-tag">Reference solution</span>' + ex.solution;
      solBox.hidden = false;
      solBtn.textContent = "Hide solution";
      typeset(solBox);
      saveWork(page, id, { revealed: true });
    };

    if (!saved.attempted && !saved.revealed) {
      solBtn.title = "Check an answer or have your working marked first";
      var skip = document.createElement("button");
      skip.type = "button";
      skip.className = "chk-skip";
      skip.textContent = "reveal without attempting";
      skip.onclick = function () {
        saveWork(page, id, { revealed: true, skipped: true });
        skip.remove();
        solBtn.disabled = false;
        solBtn.click();
      };
      q(".chk-actions").appendChild(skip);
    }
  }

  /* ----------------------------------------------------------------- boot -- */
  GU.mountCheckers = function (page) {
    var bank = BANK[page];
    if (!bank) return 0;
    var n = 0;
    document.querySelectorAll(".ex").forEach(function (el) {
      var head = el.querySelector(".ex-h");
      if (!head) return;
      var id = head.textContent.trim().split(/[\s·]/)[0];
      var ex = bank[id];
      if (!ex || el.querySelector(".chk")) return;
      build(page, id, ex, el);
      n++;
    });
    return n;
  };
})(window);
