/* Two linked clocks: normalized direction and accumulated raw log length. */
GU.lab("la-power",function(root){
  var K=GU.labkit;
  root.innerHTML='<div class="lab-head"><span class="lab-title">Where does it point? How large does it get?</span><span class="lab-hint">step, explain, then jump ahead</span></div>'+
    '<div class="lsq-views"><div><div class="lab-view-caption">Direction · unit vectors after normalization</div><div class="stage"><canvas data-direction aria-label="Normalized power iteration trajectory"></canvas></div></div><div><div class="lab-view-caption">Magnitude · log₁₀ of raw length vs iteration (auto-scaled)</div><div class="stage"><canvas data-history aria-label="Raw log length against iteration; values in history table"></canvas></div></div></div>'+
    '<div class="panel"><div class="btnrow"><label>Matrix <select data-preset><option value="separated">separated: 2, 1</option><option value="close">close: 1, 0.98</option><option value="negative">negative: −2, 1</option><option value="equal">equal magnitude: 1, −1</option><option value="rotation">quarter-turn rotation</option><option value="stable">stable shear: 0.5, 0.5</option><option value="zero">zero matrix</option></select></label>'+ 
    '<label>Start <select data-start><option value="mixed">mixed: (1,1)</option><option value="second">second axis: (0,1)</option><option value="first">first axis: (1,0)</option></select></label></div>'+
    '<div class="btnrow"><button data-step>one step</button><button data-jump>20 steps</button><button data-reset>reset</button></div>'+
    '<div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div><details><summary>Iteration history and chart scale</summary><div data-table style="max-height:240px;overflow:auto"></div></details></div>';
  var get=function(n){return root.querySelector('[data-'+n+']');};
  var preset=get('preset'),start=get('start'),out=get('out'),verdict=get('verdict'),left,right;
  preset.value='separated';start.value='mixed';
  var matrices={separated:[[2,0],[0,1]],close:[[1,0],[0,.98]],negative:[[-2,0],[0,1]],equal:[[1,0],[0,-1]],rotation:[[0,-1],[1,0]],stable:[[.5,4],[0,.5]],zero:[[0,0],[0,0]]};
  var a=matrices.separated,x=[Math.SQRT1_2,Math.SQRT1_2],history=[],n=0,log=0,stopped=false,lineChange=null;
  function mv(v){return a.map(function(r){return r[0]*v[0]+r[1]*v[1];});}
  function f(v){return Number.isFinite(v)?(v!==0&&Math.abs(v)<1e-4?v.toExponential(3):K.f(v,5)):'−∞';}
  function diagnostics(){var y=mv(x),l=x[0]*y[0]+x[1]*y[1];return {l:l,r:Math.hypot(y[0]-l*x[0],y[1]-l*x[1])};}
  function record(){var d=diagnostics();history.push({k:n,x:x.slice(),log:log,l:d.l,r:d.r});}
  function refresh(){
    var d=diagnostics();out.innerHTML='A = [ '+a[0].join(', ')+' ; '+a[1].join(', ')+' ]<br>updates = '+n+' · x = ('+x.map(f).join(', ')+')'+
      '<br>λ̂ = '+f(d.l)+' · eigen-residual = '+f(d.r)+'<br>line change = '+(lineChange===null?'—':f(lineChange))+' · log₁₀ raw length = '+f(log);
    verdict.textContent=stopped?'Raw iterate is zero: the next normalized vector is undefined. The left arrow shows the last valid direction.':
      n>=400?'400-step display limit reached. Reset to explore another case.':
      preset.value==='stable'?'Spectral radius 0.5: eventual decay allows temporary growth. Compare the two clocks.':
      d.r<1e-9?'Small computed residual: an approximate eigenpair, not a certificate of dominance. A smaller-eigenline start can stay there forever.':
      'Direction and raw magnitude answer different questions. Negative eigenvalues flip arrows; equal magnitudes and rotations can prevent line convergence.';
    var finite=history.filter(function(h){return Number.isFinite(h.log);}),lo=Math.min(0,...finite.map(function(h){return h.log;})),hi=Math.max(0,...finite.map(function(h){return h.log;}));
    get('table').innerHTML='<p>Horizontal: iteration 0 to '+Math.max(1,n)+'. Vertical log₁₀ range: '+f(lo)+' to '+f(hi)+'. Each +1 means ×10 in length; negative values mean length below 1.</p><table><thead><tr><th>k</th><th>x₁</th><th>x₂</th><th>log₁₀ length</th><th>residual</th></tr></thead><tbody>'+history.map(function(h){return '<tr><td>'+h.k+'</td><td>'+f(h.x[0])+'</td><td>'+f(h.x[1])+'</td><td>'+f(h.log)+'</td><td>'+f(h.r)+'</td></tr>';}).join('')+'</tbody></table>';
    get('step').disabled=get('jump').disabled=stopped||n>=400;
    if(left)left.render();if(right)right.render();
  }
  function reset(){a=matrices[preset.value];x=start.value==='first'?[1,0]:start.value==='second'?[0,1]:[Math.SQRT1_2,Math.SQRT1_2];history=[];n=0;log=0;stopped=false;lineChange=null;record();refresh();}
  function advance(count){for(var i=0;i<count&&!stopped&&n<400;i++){
    var y=mv(x),gain=Math.hypot(...y);n++;
    if(gain===0){log=-Infinity;stopped=true;record();break;}
    y=y.map(function(v){return v/gain;});lineChange=Math.min(Math.hypot(y[0]-x[0],y[1]-x[1]),Math.hypot(y[0]+x[0],y[1]+x[1]));
    x=y;log+=Math.log10(gain);record();
  }refresh();}
  record();
  left=K.plot(get('direction'),{span:1.6,handles:function(){return [];},draw:function(p){
    p.grid();var circle=[];for(var i=0;i<80;i++){var t=i*2*Math.PI/80;circle.push([Math.cos(t),Math.sin(t)]);}p.poly(circle,null,K.css('--ink-3'));
    history.slice(-40).forEach(function(h,i,hs){if(i)p.line(hs[i-1].x,h.x,K.mix(K.css('--accent'),35));p.dot(h.x[0],h.x[1],K.css('--accent'),2);});
    p.arrow(x,K.css('--u'),'x');var d=diagnostics();if(d.r<1e-9)p.line(x.map(function(v){return -1.5*v;}),x.map(function(v){return 1.5*v;}),K.css('--w'),[4,4]);
  }});
  right=K.plot(get('history'),{span:5,handles:function(){return [];},draw:function(p){
    var hs=history.filter(function(h){return Number.isFinite(h.log);}),lo=Math.min(0,...hs.map(function(h){return h.log;})),hi=Math.max(0,...hs.map(function(h){return h.log;}));
    if(hi-lo<.1){hi+=.5;lo-=.5;}
    function point(h){return [-4+8*h.k/Math.max(1,n),-3+6*(h.log-lo)/(hi-lo)];}
    p.line([-4,-3],[-4,3],K.css('--ink-3'));p.line([-4,-3],[4,-3],K.css('--ink-3'));
    var zero=-3+6*(0-lo)/(hi-lo);p.line([-4,zero],[4,zero],K.css('--grid'),[4,4]);
    hs.forEach(function(h,i){var v=point(h);if(i)p.line(point(hs[i-1]),v,K.css('--accent'),null,2);p.dot(v[0],v[1],K.css('--accent'),2);});
    // Numeric endpoints keep the auto-scaled chart interpretable without opening history.
    if(p.ctx){var c=p.ctx;c.save();c.fillStyle=K.css('--ink-3');c.font='11px sans-serif';
      c.fillText('k = 0',p.x2p(-4),p.y2p(-3)-6);c.fillText('k = '+n,p.x2p(3),p.y2p(-3)-6);
      c.fillText(f(hi),p.x2p(-4),p.y2p(3)-6);c.fillText(f(lo),p.x2p(-4),p.y2p(-3)+16);c.restore();}
  }});
  get('step').onclick=function(){advance(1);};get('jump').onclick=function(){advance(20);};get('reset').onclick=reset;
  preset.addEventListener('change',reset);start.addEventListener('change',reset);refresh();
});
