/* Lab: arrow arithmetic — addition as a parallelogram, scaling as a stretch. */
GU.lab("la-vectors", function (root) {
  var K = GU.labkit, css = K.css, f = K.f, sw = K.sw;

  var s = K.shell(root, {
    title: "Arrow arithmetic",
    hint: "drag the ● arrowheads · hold shift for fine control"
  });

  s.panel.innerHTML =
    '<div class="ctl"><label><span>scalar <em>c</em> on <strong style="color:var(--u)">u</strong></span>' +
    '<span class="val" data-cv>1.00</span></label>' +
    '<input type="range" data-c min="-2.5" max="2.5" step="0.05" value="1"></div>' +
    '<div class="readout" data-out></div>' +
    '<div class="btnrow"><button type="button" data-par>parallelogram</button>' +
    '<button type="button" data-t2t>tip-to-tail</button>' +
    '<button type="button" data-reset>reset</button></div>' +
    '<label class="togg"><input type="checkbox" data-snap checked> snap to quarter-units</label>';

  var q = function (sel) { return s.panel.querySelector(sel); };
  var sC = q("[data-c]"), sCv = q("[data-cv]"), snap = q("[data-snap]"), out = q("[data-out]");

  var u = [2, 1], v = [-1, 2], mode = "par";

  var P = K.plot(s.canvas, {
    span: 4.2,
    snap: function () { return snap.checked; },
    handles: function () {
      return [{ v: u, set: function (p) { u = p; } }, { v: v, set: function (p) { v = p; } }];
    },
    draw: function (P) {
      var c = +sC.value;
      var sum = [u[0] + v[0], u[1] + v[1]];
      var cu = [c * u[0], c * u[1]];
      P.grid();

      if (mode === "par") {
        P.poly([[0, 0], u, sum, v], K.mix(css("--w"), 12), null);
        P.line(u, sum, css("--v"), [4, 4], 1.3);
        P.line(v, sum, css("--u"), [4, 4], 1.3);
      } else {
        P.arrow(v, css("--v"), null, { fx: u[0], fy: u[1], w: 2, dash: [5, 4] });
      }

      P.line([-9 * u[0], -9 * u[1]], [9 * u[0], 9 * u[1]], css("--u"), [2, 6], 1);
      P.arrow(cu, css("--w"), "cu", { w: 3.2 });
      P.arrow(sum, css("--w"), "u+v", { w: 2 });
      P.arrow(u, css("--u"), "u");
      P.arrow(v, css("--v"), "v");
      P.dot(u[0], u[1], css("--u"), 4.5);
      P.dot(v[0], v[1], css("--v"), 4.5);

      sCv.textContent = f(c);
      out.innerHTML =
        sw(css("--u")) + '<span class="k">u   </span>= (' + f(u[0]) + ", " + f(u[1]) + ")<br>" +
        sw(css("--v")) + '<span class="k">v   </span>= (' + f(v[0]) + ", " + f(v[1]) + ")<br>" +
        sw(css("--w")) + '<span class="k">u+v </span>= (' + f(sum[0]) + ", " + f(sum[1]) + ")<br>" +
        sw(css("--w")) + '<span class="k">cu  </span>= (' + f(cu[0]) + ", " + f(cu[1]) + ")";
    }
  });

  sC.addEventListener("input", P.render);
  snap.addEventListener("change", P.render);
  q("[data-par]").onclick = function () { mode = "par"; P.render(); };
  q("[data-t2t]").onclick = function () { mode = "t2t"; P.render(); };
  q("[data-reset]").onclick = function () { u = [2, 1]; v = [-1, 2]; sC.value = 1; P.render(); };
});
