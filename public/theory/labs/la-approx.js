GU.lab("la-approx",function(root){
  var K=GU.labkit;
  root.innerHTML='<div class="lab-head"><span class="lab-title">Spend a rank budget</span><span class="lab-hint">one fixed color scale · inspect the residual</span></div>'+
    '<div class="approx-maps"><div><p class="lab-caption">Original A</p><canvas data-original aria-label="Original matrix heatmap"></canvas></div><div><p class="lab-caption">Reconstruction Aₖ</p><canvas data-reconstruction aria-label="Rank-constrained reconstruction heatmap"></canvas></div><div><p class="lab-caption">Residual A − Aₖ</p><canvas data-residual aria-label="Residual heatmap on the same fixed scale"></canvas></div></div>'+
    '<div class="lab-body"><div><div class="chart-stage"><canvas data-curve aria-label="Frobenius error versus retained rank"></canvas></div><details><summary>Read matrix entries</summary><pre data-values class="matrix-values"></pre></details></div>'+
    '<div class="panel"><div class="btnrow"><button data-decay>Decaying spectrum</button><button data-flat>Flat spectrum</button><button data-ranktwo>Exact rank two</button><button data-zero>Zero</button></div>'+
    '<label>Retained rank budget <input data-rank type="range" min="0" max="6" step="1" value="1"></label><div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div></div>';
  var get=function(name){return root.querySelector('[data-'+name+']');},rank=get('rank'),s=[6,3,1,.4,.15,.05],views=[],chart;
  rank.value='1';
  var U=Array.from({length:6},function(_,i){return Array.from({length:6},function(_,j){return Math.sqrt((j?2:1)/6)*Math.cos((i+.5)*j*Math.PI/6);});});
  var permutation=[0,2,4,1,3,5],Vt=Array.from({length:6},function(_,j){return permutation.map(function(i){return U[i][j];});});
  var original,reconstruction,residual,limit;
  function recompute(){
    original=K.truncate(U,s,Vt,6);reconstruction=K.truncate(U,s,Vt,Number(rank.value));residual=original.map(function(row,i){return row.map(function(v,j){return v-reconstruction[i][j];});});
    // Keep the scale fixed across all budgets for this fixture, including residual extrema.
    limit=0;for(var k=0;k<=6;k++){var B=K.truncate(U,s,Vt,k);B.forEach(function(row,i){row.forEach(function(v,j){limit=Math.max(limit,Math.abs(v),Math.abs(original[i][j]-v));});});}if(limit===0)limit=1;
  }
  function refresh(){
    recompute();var k=Number(rank.value),energy=s.reduce(function(a,v){return a+v*v;},0),tail=s.slice(k).reduce(function(a,v){return a+v*v;},0),retained=energy?(energy-tail)/energy:null;
    get('out').innerHTML='k = '+k+' · gains = ('+s.join(', ')+')<br>spectral error = '+K.f(s[k]||0,4)+'<br>Frobenius error = '+K.f(Math.sqrt(tail),4)+'<br>squared error = '+K.f(tail,4)+'<br>retained squared energy = '+(retained===null?'undefined (zero total)':K.f(100*retained,2)+'%')+'<br>three-factor entries = '+13*k+' · dense entries = 36';
    get('verdict').textContent=energy===0?'Zero matrix: every reconstruction is exact. Energy fractions are undefined because their denominator is zero.':s.every(function(v){return v===s[0];})?'Flat spectrum: no preferred cutoff. Different retained subspaces can have the same optimal error.':tail===0?'All positive channels retained: the residual is zero up to floating-point reconstruction arithmetic.':'Discarded energy is a sum of squared gains. Inspect the residual on the same color scale before judging what was lost.';
    function rows(M){return M.map(function(row){return row.map(function(v){return K.f(v,3);}).join('  ');}).join('\n');}
    get('values').textContent='Original\n'+rows(original)+'\n\nReconstruction\n'+rows(reconstruction)+'\n\nResidual\n'+rows(residual);
    views.forEach(function(view){view.render();});if(chart)chart.render();
  }
  recompute();
  [['original',function(){return original;}],['reconstruction',function(){return reconstruction;}],['residual',function(){return residual;}]].forEach(function(pair){views.push(K.heatmap(get(pair[0]),function(){return {matrix:pair[1](),limit:limit};}));});
  chart=K.chart(get('curve'),function(){var errors=Array.from({length:7},function(_,k){return [k,Math.hypot(...s.slice(k))];});return {x:[0,6],xTicks:[0,1,2,3,4,5,6],y:[0,Math.max(1,errors[0][1]*1.1)],xLabel:'retained rank k',yLabel:'Frobenius error',series:[{points:errors},{points:errors,scatter:true}],dots:[errors[Number(rank.value)]]};});
  var presets={decay:[6,3,1,.4,.15,.05],flat:[2,2,2,2,2,2],ranktwo:[6,3,0,0,0,0],zero:[0,0,0,0,0,0]};
  Object.keys(presets).forEach(function(name){get(name).onclick=function(){s=presets[name].slice();refresh();};});rank.addEventListener('input',refresh);refresh();
});
