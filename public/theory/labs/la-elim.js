/* Lab: elimination by hand on an augmented system — pivots, free columns,
   and the verdict, recomputed after every legal row operation. */
GU.lab("la-elim", function (root) {
  var K = GU.labkit, f = K.f;
  var ROWS = 3, COLS = 4, TOL = 1e-9;
  var START = [[1, 2, 1, 4], [2, 3, -1, 3], [3, 5, 0, 7]];
  var M = START.map(function (row) { return row.slice(); });
  var inputs = [], log = [];

  root.innerHTML =
    '<div class="lab-head"><span class="lab-title">Elimination bench</span>' +
    '<span class="lab-hint">edit any entry · apply row operations · the shaded column is the right-hand side</span></div>' +
    '<div class="lab-body elim-body"><div class="elim-stage">' +
    '<div class="mat"><div class="rail"></div><div class="cells" data-cells></div><div class="rail r"></div></div>' +
    '<div class="oprow"><label data-oplabel>operation</label>' +
    '<select data-op><option value="add">add (c × row i) to row j</option>' +
    '<option value="swap">swap row i and row j</option>' +
    '<option value="scale">scale row i by c</option></select></div>' +
    '<div class="oprow"><span>i</span><select data-i></select><span>j</span><select data-j></select>' +
    '<span>c</span><input type="number" data-c value="-1" step="0.5"><button type="button" data-apply>apply</button></div>' +
    '<div class="log" data-log></div></div>' +
    '<div class="panel"><div class="readout" data-out></div><div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-step>eliminate one column</button>' +
    '<button type="button" data-rref>full RREF</button></div>' +
    '<div class="btnrow"><button type="button" data-reset>reset</button>' +
    '<button type="button" data-incons>make inconsistent</button>' +
    '<button type="button" data-free>make a free column</button></div></div></div>';

  var q = function (sel) { return root.querySelector(sel); };
  var cells = q("[data-cells]"), out = q("[data-out]"), verdict = q("[data-verdict]"), logEl = q("[data-log]");
  var opEl = q("[data-op]"), iEl = q("[data-i]"), jEl = q("[data-j]"), cEl = q("[data-c]");

  var uid = "elim" + Math.random().toString(36).slice(2, 7);
  opEl.id = uid + "-op";
  q("[data-oplabel]").setAttribute("for", opEl.id);

  cells.style.gridTemplateColumns = "repeat(" + COLS + ", auto)";
  for (var r = 0; r < ROWS; r++) {
    inputs[r] = [];
    for (var c = 0; c < COLS; c++) {
      var box = document.createElement("input");
      box.type = "number";
      box.step = "1";
      box.id = uid + "-" + r + "-" + c;
      box.setAttribute("aria-label", "row " + (r + 1) + ", column " + (c + 1));
      if (c === COLS - 1) box.classList.add("aug");
      (function (rr, cc, el) {
        el.addEventListener("input", function () {
          var value = parseFloat(el.value);
          M[rr][cc] = isFinite(value) ? value : 0;
          analyse();
        });
      })(r, c, box);
      cells.appendChild(box);
      inputs[r][c] = box;
    }
  }
  [iEl, jEl].forEach(function (select, index) {
    for (var r = 1; r <= ROWS; r++) {
      var option = document.createElement("option");
      option.value = String(r - 1);
      option.textContent = String(r);
      select.appendChild(option);
    }
    select.value = String(index);
    select.setAttribute("aria-label", index ? "second row" : "first row");
  });

  function note(text) {
    log.unshift(text);
    log = log.slice(0, 12);
    logEl.innerHTML = log.map(function (line) { return "<div>" + line + "</div>"; }).join("");
  }
  function paint() {
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
      if (document.activeElement !== inputs[r][c]) {
        inputs[r][c].value = String(Math.round(M[r][c] * 1000) / 1000);
      }
    }
  }

  /* elimination on a copy: pivot columns and a reduced form */
  function reduce(matrix, width) {
    var A = matrix.map(function (row) { return row.slice(); });
    var pivots = [], row = 0;
    for (var col = 0; col < width && row < ROWS; col++) {
      var best = row;
      for (var k = row + 1; k < ROWS; k++) if (Math.abs(A[k][col]) > Math.abs(A[best][col])) best = k;
      if (Math.abs(A[best][col]) <= TOL) continue;
      var swap = A[row]; A[row] = A[best]; A[best] = swap;
      var pivot = A[row][col];
      for (var cc = 0; cc < COLS; cc++) A[row][cc] /= pivot;
      for (var rr = 0; rr < ROWS; rr++) {
        if (rr === row) continue;
        var factor = A[rr][col];
        if (factor !== 0) for (var c2 = 0; c2 < COLS; c2++) A[rr][c2] -= factor * A[row][c2];
        A[rr][col] = 0;
      }
      pivots.push(col);
      row++;
    }
    return { form: A, pivots: pivots };
  }

  /* pivots of the matrix as it stands, so the marks track the student's own moves */
  function livePivots() {
    var marks = [], lastColumn = -1;
    for (var r = 0; r < ROWS; r++) {
      var lead = -1;
      for (var c = 0; c < COLS; c++) if (Math.abs(M[r][c]) > TOL) { lead = c; break; }
      if (lead > lastColumn && lead > -1 && lead < COLS - 1) { marks.push([r, lead]); lastColumn = lead; }
      else if (lead > -1) lastColumn = Math.max(lastColumn, lead);
    }
    return marks;
  }

  function analyse() {
    var coefficient = reduce(M, COLS - 1), augmented = reduce(M, COLS);
    var rankA = coefficient.pivots.length, rankAug = augmented.pivots.length;
    var unknowns = COLS - 1, free = [];
    for (var c = 0; c < unknowns; c++) if (coefficient.pivots.indexOf(c) < 0) free.push("x" + (c + 1));

    for (var r = 0; r < ROWS; r++) for (var c2 = 0; c2 < COLS; c2++) inputs[r][c2].classList.remove("piv");
    livePivots().forEach(function (mark) { inputs[mark[0]][mark[1]].classList.add("piv"); });

    out.innerHTML =
      '<span class="k">rank A    </span>= ' + rankA + "<br>" +
      '<span class="k">rank [A|b]</span>= ' + rankAug + "<br>" +
      '<span class="k">unknowns  </span>= ' + unknowns + "<br>" +
      '<span class="k">free      </span>= ' + (free.length ? free.join(", ") : "none") + "<br>" +
      '<span class="k">pivot cols</span>= ' +
      (coefficient.pivots.length ? coefficient.pivots.map(function (c) { return c + 1; }).join(", ") : "—");

    if (rankAug > rankA) {
      verdict.className = "verdict bad";
      verdict.innerHTML = "<strong>No solution.</strong> A pivot sits in the right-hand column, so a row reads " +
        "0 = nonzero. In column language: <strong>b</strong> is outside the span of the columns of A.";
    } else if (rankA === unknowns) {
      var solution = [];
      for (var i = 0; i < unknowns; i++) {
        var index = coefficient.pivots.indexOf(i);
        solution.push(f(index < 0 ? 0 : coefficient.form[index][COLS - 1]));
      }
      verdict.className = "verdict";
      verdict.innerHTML = "<strong>Exactly one solution:</strong> x = (" + solution.join(", ") + "). " +
        "No free columns, so the columns of A are independent and the recipe for <strong>b</strong> is unique.";
    } else {
      verdict.className = "verdict warnish";
      verdict.innerHTML = "<strong>Infinitely many solutions.</strong> " + free.length + " free " +
        (free.length === 1 ? "variable" : "variables") + " (" + free.join(", ") + "), so the solution set is a " +
        free.length + "-dimensional affine set: one particular solution plus the null space.";
    }
    paint();
  }

  function stepOnce() {
    var row = 0;
    for (var col = 0; col < COLS - 1; col++) {
      var best = row, k;
      for (k = row + 1; k < ROWS; k++) if (Math.abs(M[k][col]) > Math.abs(M[best][col])) best = k;
      if (Math.abs(M[best][col]) <= TOL) continue;
      var dirty = false;
      for (k = row + 1; k < ROWS; k++) if (M[k][col] !== 0) dirty = true;
      if (!dirty) { row++; continue; }
      if (best !== row) {
        var swap = M[row]; M[row] = M[best]; M[best] = swap;
        note("swap R" + (row + 1) + " ↔ R" + (best + 1) + "  (partial pivoting)");
      }
      for (k = row + 1; k < ROWS; k++) {
        var factor = M[k][col] / M[row][col];
        if (factor === 0) continue;
        for (var c = 0; c < COLS; c++) M[k][c] -= factor * M[row][c];
        M[k][col] = 0;
        note("R" + (k + 1) + " ← R" + (k + 1) + " − " + f(factor, 3) + "·R" + (row + 1));
      }
      analyse();
      return;
    }
    note("already in echelon form — nothing left to clear below a pivot");
    analyse();
  }

  q("[data-apply]").onclick = function () {
    var i = Number(iEl.value), j = Number(jEl.value), c = parseFloat(cEl.value), k;
    if (!isFinite(c)) c = 0;
    var op = opEl.value;
    if (op === "swap") {
      if (i === j) { note("swapping a row with itself does nothing"); return; }
      var swap = M[i]; M[i] = M[j]; M[j] = swap;
      note("swap R" + (i + 1) + " ↔ R" + (j + 1));
    } else if (op === "scale") {
      if (Math.abs(c) <= TOL) { note("scaling by 0 is not a legal row operation — it is not reversible"); return; }
      for (k = 0; k < COLS; k++) M[i][k] *= c;
      note("R" + (i + 1) + " ← " + f(c, 3) + "·R" + (i + 1));
    } else {
      if (i === j) { note("adding a multiple of a row to itself is a scaling — use scale instead"); return; }
      for (k = 0; k < COLS; k++) M[j][k] += c * M[i][k];
      note("R" + (j + 1) + " ← R" + (j + 1) + " + " + f(c, 3) + "·R" + (i + 1));
    }
    analyse();
  };
  q("[data-step]").onclick = stepOnce;
  q("[data-rref]").onclick = function () {
    M = reduce(M, COLS).form.map(function (row) {
      return row.map(function (value) { return Math.abs(value) < 1e-12 ? 0 : value; });
    });
    note("reduced row echelon form");
    analyse();
  };
  q("[data-reset]").onclick = function () {
    M = START.map(function (row) { return row.slice(); });
    log = []; logEl.innerHTML = "";
    note("reset — R3 = R1 + R2, so watch what the third row becomes");
    analyse();
  };
  q("[data-incons]").onclick = function () {
    M = [[1, 2, 1, 4], [2, 3, -1, 3], [3, 5, 0, 9]];
    note("right-hand side moved off the span: R3 no longer equals R1 + R2");
    analyse();
  };
  q("[data-free]").onclick = function () {
    M = [[1, 2, 3, 6], [2, 4, 6, 12], [1, 1, 1, 3]];
    note("column 3 is now a combination of the others — expect a free variable");
    analyse();
  };

  note("reset — R3 = R1 + R2, so watch what the third row becomes");
  analyse();
});
