/* Step through actual rounded arithmetic; audit reconstruction independently of orthogonality. */
GU.lab("la-gramschmidt", function (root) {
  var K = GU.labkit;
  root.innerHTML = '<div class="lab-head"><span class="lab-title">What survives each subtraction?</span><span class="lab-hint">drag input tips on the left · drag empty space to rotate</span></div>' +
    '<div class="lsq-views"><div><div class="lab-view-caption">Original columns and the current residual</div><div class="stage"><canvas data-input aria-label="Gram-Schmidt subtraction steps"></canvas></div></div>' +
    '<div><div class="lab-view-caption">Completed directions: classical (red), modified (teal)</div><div class="stage"><canvas data-basis aria-label="Classical and modified normalized directions"></canvas></div></div></div>' +
    '<div class="panel"><div class="btnrow qr-controls"><label>Columns <select data-count><option value="2">two</option><option value="3" selected>three</option></select></label>' +
    '<label>Step view <select data-method><option value="c">classical</option><option value="m">modified</option></select></label>' +
    '<label>Arithmetic <select data-precision><option value="64">float64</option><option value="32">float32</option></select></label></div>' +
    '<div class="btnrow"><button type="button" data-prev>Previous step</button><button type="button" data-next>Next step</button><button type="button" data-end>Show final step</button></div>' +
    '<div class="readout" data-stage aria-live="polite"></div><div class="readout" data-out></div><div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-reset>worked example</button><button type="button" data-near>near dependent</button><button type="button" data-dependent>exact dependent</button><button type="button" data-zero>zero column</button><button type="button" data-camera>reset cameras</button></div></div>';
  var get = function (s) {return root.querySelector('[data-'+s+']');};
  var count=get('count'), method=get('method'), precision=get('precision'), stage=get('stage'), out=get('out'), verdict=get('verdict');
  count.value='3';method.value='c';precision.value='64';
  var vectors=[[1,1,0],[1,0,1],[0,1,1]], cursor=0, left, right, results;
  function fmt(v) {return '('+v.map(function(x){return K.f(x,5);}).join(', ')+')';}
  function sci(x) {return Number.isFinite(x)?x.toExponential(2):'—';}
  function dot(a,b) {return a.reduce(function(s,x,i){return s+x*b[i];},0);}
  function factor(modified) {
    var round=precision.value==='32'?Math.fround:function(x){return x;};
    var a=vectors.slice(0,+count.value).map(function(v){return v.map(round);});
    var q=[],r=a.map(function(){return a.map(function(){return 0;});}), trace=[];
    function dp(u,v) {return u.reduce(function(s,x,i){return round(s+round(x*v[i]));},0);}
    for(var j=0;j<a.length;j++) {
      var original=a[j], v=original.slice(), path=[v.slice()];
      trace.push({j:j,v:v.slice(),path:path.slice(),label:'Column '+(j+1)+': start with a'+(j+1)+'.'});
      for(var i=0;i<j;i++) {
        r[i][j]=dp(q[i],modified?v:original);
        if(modified) v=v.map(function(x,k){return round(x-round(r[i][j]*q[i][k]));});
        else v=original.map(function(x,k){
          var total=0;for(var l=0;l<=i;l++)total=round(total+round(r[l][j]*q[l][k]));return round(x-total);
        });
        path.push(v.slice());
        trace.push({j:j,v:v.slice(),path:path.slice(),label:'Column '+(j+1)+': subtract r'+(i+1)+(j+1)+' q'+(i+1)+'; coefficient = '+sci(r[i][j])+'.'});
      }
      var norm=round(Math.sqrt(dp(v,v)));
      if(!Number.isFinite(norm)||norm<=1e-12) return {q:q,r:r,trace:trace,a:a,rejected:j+1};
      r[j][j]=norm;
      q.push(v.map(function(x){return round(x/norm);}));
      trace.push({j:j,v:q[j].slice(),path:path.slice(),normalized:true,label:'Column '+(j+1)+': divide by residual norm '+sci(norm)+' to obtain q'+(j+1)+'.'});
    }
    return {q:q,r:r,trace:trace,a:a};
  }
  function metrics(result) {
    if(result.rejected)return null;
    var q=result.q, overlap=0, unit=0,error=0,scale=0;
    q.forEach(function(u,i){unit=Math.max(unit,Math.abs(dot(u,u)-1));q.slice(i+1).forEach(function(v){overlap=Math.max(overlap,Math.abs(dot(u,v)));});});
    result.a.forEach(function(a,j){a.forEach(function(x,k){var reconstructed=0;q.forEach(function(u,i){reconstructed+=u[k]*result.r[i][j];});error+=(x-reconstructed)**2;scale+=x*x;});});
    return [overlap,unit,Math.sqrt(error/scale)];
  }
  function refresh() {
    results={c:factor(false),m:factor(true)};
    var current=results[method.value];cursor=Math.max(0,Math.min(cursor,current.trace.length-1));
    var t=current.trace[cursor];
    stage.textContent='Step '+(cursor+1)+' / '+current.trace.length+' · '+t.label+' Current vector '+fmt(t.v);
    get('prev').disabled=cursor===0;get('next').disabled=cursor===current.trace.length-1;
    var cm=metrics(results.c),mm=metrics(results.m);
    out.innerHTML='<table><thead><tr><th>Audit (float64 accumulation)</th><th>Classical</th><th>Modified</th></tr></thead><tbody>'+['off-diagonal overlap','unit-length error','relative reconstruction'].map(function(label,i){return '<tr><td>'+label+'</td><td>'+(cm?sci(cm[i]):'rejected')+'</td><td>'+(mm?sci(mm[i]):'rejected')+'</td></tr>';}).join('')+'</tbody></table>';
    verdict.className='verdict';
    if(results.c.rejected||results.m.rejected) {
      verdict.textContent='Stopped: a residual norm is at or below 1e-12 (classical column '+(results.c.rejected||'none')+', modified column '+(results.m.rejected||'none')+'). Do not normalize a missing direction. A tolerance rejection alone does not prove exact dependence.';
    } else if(cm[0]>.01) {
      verdict.className='verdict bad';verdict.textContent='Classical directions overlap: accurate reconstruction does not certify orthogonality. Modified overlap is '+sci(mm[0])+', so inspect it too. The right view shows normalized output directions, not enlarged input residuals.';
    } else {
      verdict.textContent='Compare the three audits separately. With two columns these schedules agree; a third exposes their difference. Try near dependent, then switch precision. Screen angles depend on the camera.';
    }
    if(left)left.render();if(right)right.render();
  }
  refresh();
  left=K.plot3(get('input'),{span:3.2,handles:function(){return vectors.slice(0,+count.value).map(function(v,i){return {v:v,set:function(x){vectors[i]=x;refresh();}};});},draw:function(p){
    p.axes();var t=results[method.value].trace[cursor];
    vectors.slice(0,+count.value).forEach(function(v,i){p.arrow(v,K.css(['--u','--v','--w'][i]),'a'+(i+1));p.dot(v,K.css(['--u','--v','--w'][i]),5);});
    for(var i=1;i<t.path.length;i++)p.line(t.path[i-1],t.path[i],K.css('--accent'),[5,4],2);
    p.arrow(t.v,K.css('--accent'),t.normalized?'q'+(t.j+1):'v');p.dot(t.v,K.css('--accent'),6,'diamond');
  }});
  right=K.plot3(get('basis'),{span:1.8,azimuth:.6,elevation:.5,draw:function(p){
    p.axes();[['c','--u'],['m','--accent']].forEach(function(pair){results[pair[0]].q.forEach(function(q,i){
      if(pair[0]==='c')p.line([0,0,0],q,K.css(pair[1]),[4,4],3);
      p.arrow(q,K.css(pair[1]),pair[0]+(i+1));p.dot(q,K.css(pair[1]),pair[0]==='c'?6:3);
    });});
  }});
  [count,method,precision].forEach(function(control){control.addEventListener('change',function(){cursor=0;refresh();});});
  get('prev').onclick=function(){cursor--;refresh();};get('next').onclick=function(){cursor++;refresh();};get('end').onclick=function(){cursor=99;refresh();};
  get('reset').onclick=function(){vectors=[[1,1,0],[1,0,1],[0,1,1]];count.value='3';precision.value='64';cursor=0;refresh();};
  get('near').onclick=function(){vectors=[[1,1e-4,1e-4],[1,1e-4,0],[1,0,1e-4]];count.value='3';precision.value='32';cursor=99;refresh();};
  get('dependent').onclick=function(){vectors=[[1,0,0],[2,0,0],[0,1,0]];count.value='3';cursor=99;refresh();};
  get('zero').onclick=function(){vectors=[[0,0,0],[1,0,1],[0,1,1]];cursor=0;refresh();};
  get('camera').onclick=function(){left.resetCamera();right.resetCamera();};
});
