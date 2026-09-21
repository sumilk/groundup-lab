/* Projection as a nearest-point experiment, with a candidate and exact presets. */
GU.lab("la-project", function (root) {
  var K = GU.labkit, f = K.f;
  var s = K.shell(root, {title: 'Can your candidate beat the projection?', hint: 'drag vector tips · drag empty space to rotate · coordinates are 3D'});
  s.panel.innerHTML = '<div class="btnrow"><button type="button" data-line>line</button><button type="button" data-plane>plane</button></div>' +
    '<label class="togg"><input type="checkbox" data-metric> metric G = diag(1,4,1)</label>' +
    '<label>candidate coefficient c₁ <input type="range" data-c1 min="-2" max="2" step="0.02" value="0"></label>' +
    '<label data-second>candidate coefficient c₂ <input type="range" data-c2 min="-2" max="2" step="0.02" value="0"></label>' +
    '<label class="togg"><input type="checkbox" data-reveal> reveal the nearest point</label>' +
    '<div class="readout" data-out></div><div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-collapse>collapse the plane</button><button type="button" data-zero>zero subspace</button><button type="button" data-reset>reset</button><button type="button" data-camera>reset camera</button></div>';
  var q = function (name) { return s.panel.querySelector('[data-' + name + ']'); };
  var metric = q('metric'), reveal = q('reveal'), c1 = q('c1'), c2 = q('c2'), second = q('second'), out = q('out'), verdict = q('verdict');
  var x = [1, 1, 0], u = [1, 0, 1], v = [0, 1, 1], mode = 'plane';
  function add(a, b) { return a.map(function (z, i) { return z + b[i]; }); }
  function scale(a, t) { return a.map(function (z) { return t * z; }); }
  function sub(a, b) { return add(a, scale(b, -1)); }
  function dot(a, b) { return a.reduce(function (sum, z, i) { return sum + z * b[i] * (metric.checked && i === 1 ? 4 : 1); }, 0); }
  function fmt(a) { return '(' + a.map(function (z) { return f(z, 3); }).join(', ') + ')'; }
  function cross(a, b) { return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; }
  var P = K.plot3(s.canvas, {
    span: 3.3,
    handles: function () {
      var h = [{v:x,set:function (a) {x=a;}},{v:u,set:function (a) {u=a;}}];
      if (mode === 'plane') h.push({v:v,set:function (a) {v=a;}});
      return h;
    },
    draw: function (p) {
      p.axes(); second.hidden = mode !== 'plane';
      var a = dot(u,u), d = dot(v,v), b = dot(u,v);
      var pstar, rank, c = cross(u,v), independent = c.some(function (z) { return z !== 0; });
      var determinant = a*d-b*b;
      if (mode === 'plane' && independent) {
        if (determinant <= 1e-12 * a * d || !Number.isFinite(determinant)) {
          p.arrow(u,K.css('--u'),'b₁'); p.arrow(v,K.css('--v'),'b₂'); p.dot(x,K.css('--w'),7,'diamond');
          out.textContent = 'The Gram system is too close to singular for this display.';
          verdict.textContent = 'Numerical rejection, not proof of dependence. Move a generator or use an exact preset.';
          verdict.className = 'verdict bad'; return;
        }
        var h1 = dot(u,x), h2 = dot(v,x);
        pstar = add(scale(u,(d*h1-b*h2)/determinant),scale(v,(a*h2-b*h1)/determinant)); rank = 2;
      } else {
        var base = a !== 0 ? u : (mode === 'plane' ? v : [0,0,0]);
        var norm = dot(base,base); rank = norm === 0 ? 0 : 1;
        pstar = norm === 0 ? [0,0,0] : scale(base,dot(base,x)/norm);
      }
      if (rank === 2) p.poly([add(scale(u,2),scale(v,2)),add(scale(u,-2),scale(v,2)),add(scale(u,-2),scale(v,-2)),add(scale(u,2),scale(v,-2))],K.mix(K.css('--accent'),13),K.css('--accent'));
      else if (rank === 1) {var direction=a !== 0?u:v;p.line(scale(direction,-4),scale(direction,4),K.css('--accent'),null,2);}
      p.arrow(u,K.css('--u'),'b₁'); p.dot(u,K.css('--u'),5);
      if (mode === 'plane') {p.arrow(v,K.css('--v'),'b₂');p.dot(v,K.css('--v'),5);}
      p.arrow(x,K.css('--w'),'x');p.dot(x,K.css('--w'),7,'diamond');
      var candidate = add(scale(u,+c1.value),mode === 'plane'?scale(v,+c2.value):[0,0,0]);
      var difference = sub(x,candidate), residual = sub(x,pstar), error = dot(difference,difference), minimum = dot(residual,residual), gap = sub(candidate,pstar);
      p.dot(candidate,K.css('--warn'),6);p.line(x,candidate,K.css('--warn'),[3,4],2);
      out.innerHTML = 'candidate c = ('+f(+c1.value)+', '+f(mode === 'plane'?+c2.value:0)+')<br>q = '+fmt(candidate)+'<br>‖x − q‖²<sub>G</sub> = '+f(error,4);
      if (reveal.checked) {
        p.arrow(pstar,K.css('--accent'),'p');p.dot(pstar,K.css('--accent'),7,'diamond');p.line(x,pstar,K.css('--accent'),[6,4],2.5);
        out.innerHTML += '<br>p = '+fmt(pstar)+'<br>r = '+fmt(residual)+'<br>minimum = '+f(minimum,4)+'<br>excess = '+f(error-minimum,4)+' = ‖q − p‖²<sub>G</sub> '+f(dot(gap,gap),4)+'<br>⟨b₁,r⟩<sub>G</sub> = '+f(dot(u,residual),6);
        if (mode === 'plane') out.innerHTML += '<br>⟨b₂,r⟩<sub>G</sub> = '+f(dot(v,residual),6);
      }
      verdict.className = 'verdict';
      verdict.textContent = (rank === 0 ? 'Zero subspace: only the origin is reachable. ' : rank === 1 && mode === 'plane' ? 'The generators span a line, not a plane. ' : '') +
        (reveal.checked ? 'Every candidate pays the minimum error plus its squared distance from p. Screen angles depend on the camera; check the metric inner products.' : 'Move the candidate sliders to reduce the error. Predict the nearest point before revealing it.');
    }
  });
  [metric,reveal,c1,c2].forEach(function (e) {e.addEventListener('input',P.render);});
  q('line').onclick=function () {mode='line';P.render();};q('plane').onclick=function () {mode='plane';P.render();};
  q('collapse').onclick=function () {mode='plane';u=[1,0,1];v=[2,0,2];P.render();};
  q('zero').onclick=function () {u=[0,0,0];v=[0,0,0];P.render();};
  q('reset').onclick=function () {x=[1,1,0];u=[1,0,1];v=[0,1,1];mode='plane';c1.value=0;c2.value=0;metric.checked=false;reveal.checked=false;P.render();};
  q('camera').onclick=P.resetCamera;
});
