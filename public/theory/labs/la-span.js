/* Lab: span explorer — the plane, and the moment it collapses to a line. */
GU.lab("la-span", function (root) {
  var K = GU.labkit, css = K.css, f = K.f, sw = K.sw;

  var s = K.shell(root, {
    title: "Span explorer",
    hint: "drag u and v · the sliders move the output point"
  });

  s.panel.innerHTML =
    '<div class="ctl"><label><span>coefficient <em>a</em></span><span class="val" data-av>1.00</span></label>' +
    '<input type="range" data-a min="-2" max="2" step="0.02" value="1"></div>' +
    '<div class="ctl"><label><span>coefficient <em>b</em></span><span class="val" data-bv>1.00</span></label>' +
    '<input type="range" data-b min="-2" max="2" step="0.02" value="1"></div>' +
    '<div class="readout" data-out></div>' +
    '<div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-dep>make dependent</button>' +
    '<button type="button" data-reset>reset</button></div>' +
    '<label class="togg"><input type="checkbox" data-lat checked> show integer lattice</label>';

  var q = function (sel) { return s.panel.querySelector(sel); };
  var sa = q("[data-a]"), sb = q("[data-b]"), sav = q("[data-av]"), sbv = q("[data-bv]");
  var lat = q("[data-lat]"), out = q("[data-out]"), verd = q("[data-verdict]");

  var u = [2, 0.5], v = [-0.5, 2];

  var P = K.plot(s.canvas, {
    span: 5.4,
    handles: function () {
      return [{ v: u, set: function (p) { u = p; } }, { v: v, set: function (p) { v = p; } }];
    },
    draw: function (P) {
      var a = +sa.value, b = +sb.value;
      var det = u[0] * v[1] - u[1] * v[0];
      var dep = Math.abs(det) < 0.06;
      var N = 2;
      P.grid();

      if (!dep) {
        P.poly([
          [N * u[0] + N * v[0], N * u[1] + N * v[1]],
          [N * u[0] - N * v[0], N * u[1] - N * v[1]],
          [-N * u[0] - N * v[0], -N * u[1] - N * v[1]],
          [-N * u[0] + N * v[0], -N * u[1] + N * v[1]]
        ], K.mix(css("--accent"), 11), K.mix(css("--accent"), 45));
      } else {
        var base = Math.hypot(u[0], u[1]) > 1e-6 ? u : v;
        P.line([-9 * base[0], -9 * base[1]], [9 * base[0], 9 * base[1]], css("--warn"), null, 3);
      }

      if (lat.checked) {
        for (var i = -N; i <= N; i++) {
          for (var j = -N; j <= N; j++) {
            P.dot(i * u[0] + j * v[0], i * u[1] + j * v[1], css("--ink-3"), 3);
          }
        }
      }

      var w = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
      P.line([0, 0], [a * u[0], a * u[1]], css("--u"), [5, 4], 1.6);
      P.line([a * u[0], a * u[1]], w, css("--v"), [5, 4], 1.6);
      P.arrow(u, css("--u"), "u");
      P.arrow(v, css("--v"), "v");
      P.dot(u[0], u[1], css("--u"), 4.5);
      P.dot(v[0], v[1], css("--v"), 4.5);
      P.dot(w[0], w[1], css("--w"), 6.5);

      sav.textContent = f(a); sbv.textContent = f(b);
      out.innerHTML =
        sw(css("--u")) + '<span class="k">u      </span>= (' + f(u[0]) + ", " + f(u[1]) + ")<br>" +
        sw(css("--v")) + '<span class="k">v      </span>= (' + f(v[0]) + ", " + f(v[1]) + ")<br>" +
        sw(css("--w")) + '<span class="k">au+bv  </span>= (' + f(w[0]) + ", " + f(w[1]) + ")<br>" +
        '<span class="k">det    </span>= ' + f(det, 3);

      if (dep) {
        verd.className = "verdict bad";
        verd.innerHTML = "<strong>Dependent.</strong> det ≈ 0, so v is a multiple of u. The span has " +
          "collapsed from a plane to a line — every reachable point lies on it, whatever a and b you choose.";
      } else {
        verd.className = "verdict";
        verd.innerHTML = "<strong>Independent.</strong> det ≠ 0, so span{u,v} = all of ℝ². " +
          "The shaded box is only what |a|,|b| ≤ 2 reaches; unbounded coefficients fill the plane.";
      }
    }
  });

  sa.addEventListener("input", P.render);
  sb.addEventListener("input", P.render);
  lat.addEventListener("change", P.render);
  q("[data-dep]").onclick = function () { v = [-1.2 * u[0], -1.2 * u[1]]; P.render(); };
  q("[data-reset]").onclick = function () {
    u = [2, 0.5]; v = [-0.5, 2]; sa.value = 1; sb.value = 1; P.render();
  };
});
