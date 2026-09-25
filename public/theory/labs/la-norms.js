/* Induced norm geometry: all coordinates share one scale. */
GU.lab("la-norms", function(root) {
  var K = GU.labkit;
  root.innerHTML = '<div class="lab-head"><span class="lab-title">Which input is amplified most?</span><span class="lab-hint">choose a norm · predict · reveal</span></div>' +
    '<div class="lsq-views"><div><p class="lab-caption">Input p-unit ball and unit probe x.</p><div class="stage"><canvas data-input aria-label="Input norm ball and probe"></canvas></div></div><div><p class="lab-caption">Image of the same ball and Ax. Same coordinate scale.</p><div class="stage"><canvas data-output aria-label="Image of the norm ball under A"></canvas></div></div></div>' +
    '<div class="panel"><div class="btnrow"><button data-example>Worked matrix</button><button data-shear>Shear</button><button data-rankone>Rank one</button><button data-zero>Zero</button></div>' +
    '<label>Vector norm <select data-norm><option value="1">1 · total absolute size</option><option value="2">2 · Euclidean length</option><option value="inf">∞ · largest coordinate</option></select></label>' +
    '<label>Probe angle (degrees) <input data-angle type="range" min="0" max="360" step="1" value="45"></label><label><input data-reveal type="checkbox"> Reveal induced norm</label>' +
    '<details open><summary>Edit A, row by row (entries −4 to 4)</summary><div data-cells class="svd-cells"></div><p data-error role="status"></p></details>' +
    '<div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div>';
  var get = function(name) { return root.querySelector('[data-' + name + ']'); };
  var A = [[1,-2],[3,0]], norm = get('norm'), angle = get('angle'), reveal = get('reveal');
  var inputs = [], left, right;
  norm.value = '1'; angle.value = '45'; reveal.checked = false;
  function length(v) { return norm.value === '1' ? Math.abs(v[0])+Math.abs(v[1]) : norm.value === 'inf' ? Math.max(Math.abs(v[0]),Math.abs(v[1])) : Math.hypot(...v); }
  function unit(t) { var v = [Math.cos(t),Math.sin(t)], n = length(v); return v.map(function(x) { return x/n; }); }
  function probe() { return unit(Number(angle.value)*Math.PI/180); }
  function mv(v) { return A.map(function(row) { return row[0]*v[0]+row[1]*v[1]; }); }
  function induced() {
    if (norm.value === '1') return Math.max(Math.abs(A[0][0])+Math.abs(A[1][0]),Math.abs(A[0][1])+Math.abs(A[1][1]));
    if (norm.value === 'inf') return Math.max(...A.map(function(row) { return Math.abs(row[0])+Math.abs(row[1]); }));
    return K.svd2(A).s[0];
  }
  function refresh() {
    inputs.forEach(function(input,k) { if (document.activeElement !== input) input.value = String(A[Math.floor(k/2)][k%2]); });
    get('out').innerHTML = 'A = [ '+A[0].join(', ')+' ; '+A[1].join(', ')+' ]<br>p = '+norm.value+' · angle = '+angle.value+'°<br>‖x‖p = 1 · ‖Ax‖p = '+K.f(length(mv(probe())),5) +
      (reveal.checked ? '<br>Induced norm ‖A‖p = '+K.f(induced(),5) : '<br>Predict the maximum output p-norm, then reveal.');
    get('verdict').textContent = induced() === 0 ? 'Zero map: every probe is killed and every induced norm is zero.' : 'The probe measures one direction. The induced norm maximizes over all p-unit inputs. A rank-one map can still have a positive norm.';
    if (left) left.render(); if (right) right.render();
  }
  function changed() { reveal.checked = false; refresh(); }
  for (var k=0;k<4;k++) {
    var input = document.createElement('input'); input.type = 'number'; input.step = 'any'; input.min = '-4'; input.max = '4';
    input.setAttribute('aria-label','Norm matrix row '+(Math.floor(k/2)+1)+' column '+(k%2+1));
    (function(control,j) { control.addEventListener('input',function() {
      var v = Number(control.value);
      if (control.value.trim() === '' || !Number.isFinite(v) || Math.abs(v)>4) { get('error').textContent = 'Enter a finite number between −4 and 4.'; return; }
      get('error').textContent = ''; A[Math.floor(j/2)][j%2] = v; changed();
    }); })(input,k);
    get('cells').appendChild(input); inputs.push(input);
  }
  function draw(p, output) {
    p.span = Math.max(1.6,1.3*K.svd2(A).s[0]*Math.SQRT2);
    if (p.W && p.H) p.unit = Math.min(p.W,p.H)/(2*p.span);
    p.grid(); var ball = [];
    for (var i=0;i<160;i++) { var v = unit(i*Math.PI/80); ball.push(output ? mv(v) : v); }
    p.poly(ball,null,K.css('--accent'));
    p.arrow(output ? mv(probe()) : probe(),K.css('--u'),output ? 'Ax' : 'x');
    if (output && induced() === 0) p.dot(0,0,K.css('--accent'),5);
  }
  left = K.plot(get('input'),{span:6,handles:function() { return []; },draw:function(p) { draw(p,false); }});
  right = K.plot(get('output'),{span:6,handles:function() { return []; },draw:function(p) { draw(p,true); }});
  var presets = {example:[[1,-2],[3,0]],shear:[[1,2],[0,1]],rankone:[[1,2],[0,0]],zero:[[0,0],[0,0]]};
  Object.keys(presets).forEach(function(name) { get(name).onclick = function() { A = presets[name].map(function(row) { return row.slice(); }); get('error').textContent = ''; changed(); }; });
  norm.addEventListener('change',changed); angle.addEventListener('input',changed); reveal.addEventListener('change',refresh);
  [get('input'),get('output')].forEach(function(canvas) { canvas.addEventListener('gu-theme',refresh); });
  refresh();
});
