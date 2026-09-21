/* Signed cells and their multilinear pieces. Both views use the same column convention. */
GU.lab("la-det", function (root) {
  var K=GU.labkit;
  root.innerHTML='<div class="lab-head"><span class="lab-title">What changes when a cell leans, flips, or collapses?</span><span class="lab-hint">drag tips · 3D: drag empty space to rotate · views auto-fit</span></div>'+
    '<div class="lsq-views"><div><div class="lab-view-caption">2D · one sheet, 25 equal-mass source cells</div><div class="stage"><canvas data-area aria-label="Drag two columns to change signed area"></canvas></div></div>'+
    '<div><div class="lab-view-caption">3D · signed volume and coordinate pieces</div><div class="stage"><canvas data-volume aria-label="Drag three columns to change signed volume"></canvas></div></div></div>'+
    '<div class="panel"><div class="btnrow qr-controls"><label>Edit <select data-dimension><option value="2">2D sheet</option><option value="3">3D box</option></select></label>'+
    '<label>Show <select data-piece><option value="all">whole cell</option><option value="0">first coordinate piece</option><option value="1">second coordinate piece</option><option value="2">third coordinate piece (3D)</option></select></label></div>'+
    '<div class="btnrow"><button type="button" data-shear>shear</button><button type="button" data-swap>swap columns</button><button type="button" data-collapse>collapse</button><button type="button" data-thin>thin</button><button type="button" data-reset>worked examples</button><button type="button" data-camera>reset camera</button></div>'+
    '<details><summary>Edit matrix entries (rows of A)</summary><div data-cells style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-width:360px"></div><div data-input-error role="status"></div></details>'+
    '<div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div>';
  var get=function(n){return root.querySelector('[data-'+n+']');};
  var dimension=get('dimension'), piece=get('piece'), out=get('out'), verdict=get('verdict'), cells=get('cells'), error=get('input-error');
  dimension.value='2';piece.value='all';
  var sheet=[[2,1],[1,3]], box=[[2,1,1],[1,2,0],[0,1,2]], left,right, inputs=[];
  var colors=['--u','--v','--w'];
  function add(a,b){return a.map(function(x,i){return x+b[i];});}
  function mul(a,t){return a.map(function(x){return x*t;});}
  function terms(a){return a.length===2?[a[0][0]*a[1][1],-a[0][1]*a[1][0]]:
    [a[0][0]*(a[1][1]*a[2][2]-a[2][1]*a[1][2]),-a[0][1]*(a[1][0]*a[2][2]-a[2][0]*a[1][2]),a[0][2]*(a[1][0]*a[2][1]-a[2][0]*a[1][1])];}
  function signedPieces(a){return a.map(function(x,i){var number=fmt(i?Math.abs(x):x);if(piece.value===String(i))number='<strong>'+number+'</strong>';return (i?(x<0?' − ':' + '):'')+number;}).join('');}
  function sum(a){return a.reduce(function(s,x){return s+x;},0);}
  function fmt(x){return x!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e5)?x.toExponential(3):K.f(x,3);}
  function vectors(a){return a.map(function(v){return '('+v.map(fmt).join(', ')+')';}).join(' · ');}
  function factor(a){return Math.min(1,4.2/Math.max(1,...a[0].map(function(_,i){return a.reduce(function(s,v){return s+Math.abs(v[i]);},0);})));}
  function current(){return dimension.value==='2'?sheet:box;}
  function sync(){
    var a=current(), n=a.length;cells.style.gridTemplateColumns='repeat('+n+',minmax(0,1fr))';
    inputs.forEach(function(input,k){var i=Math.floor(k/3),j=k%3;input.hidden=i>=n||j>=n;
      input.setAttribute('aria-label','row '+(i+1)+', column '+(j+1));
      if(!input.hidden&&document.activeElement!==input)input.value=String(a[j][i]);});
  }
  function orientation(d){return d===0?'computed zero: collapsed in this arithmetic':d>0?'positive orientation':'negative orientation';}
  function refresh(){
    sync();var ta=terms(sheet),tv=terms(box),da=sum(ta),dv=sum(tv),a=current(),d=a.length===2?da:dv;
    out.innerHTML='<b>2D columns</b> '+vectors(sheet)+'<br>det A = '+fmt(da)+' · area = '+fmt(Math.abs(da))+' · '+orientation(da)+
      '<br>signed pieces: '+signedPieces(ta)+' = '+fmt(da)+
      '<br>density multiplier = '+(da===0?'undefined in 2D after collapse':fmt(1/Math.abs(da)))+
      '<br><b>3D columns</b> '+vectors(box)+'<br>det A = '+fmt(dv)+' · volume = '+fmt(Math.abs(dv))+' · '+orientation(dv)+
      '<br>signed pieces: '+signedPieces(tv)+' = '+fmt(dv);
    verdict.className='verdict'+(d===0?' bad':'');
    verdict.textContent=d===0?'Computed zero determinant. The collapse preset has exactly repeated columns: ambient volume vanishes even though edges remain. No finite full-dimensional density multiplier exists.':
      'Nonzero determinant: '+(d<0?'orientation reversed. ':'orientation preserved. ')+(Math.abs(d)<1e-4?'Thin is not collapsed: read the nonzero value even below pixel resolution. ':'')+
      'Shears preserve volume; swapping reverses its sign. Outlines show the whole cell; a selected filled piece can overlap or cancel other pieces. Coordinates, not screen angles, define the geometry.';
    if(left)left.render();if(right)right.render();
  }
  for(var k=0;k<9;k++){
    var input=document.createElement('input');input.type='number';input.step='any';input.style.minWidth='0';input.style.width='100%';
    (function(control,index){control.addEventListener('input',function(){
      var value=Number(control.value), a=current(), i=Math.floor(index/3),j=index%3;
      if(control.value.trim()===''||!Number.isFinite(value)||Math.abs(value)>1000){error.textContent='Enter a finite coordinate between −1000 and 1000.';return;}
      error.textContent='';a[j][i]=value;refresh();
    });})(input,k);cells.appendChild(input);inputs.push(input);
  }
  function component(a){var b=a.map(function(v){return v.slice();});if(piece.value!=='all')b[0]=b[0].map(function(x,i){return i===+piece.value?x:0;});return b;}
  function face2(a,p,scale,fill,stroke){var u=mul(a[0],scale),v=mul(a[1],scale);p.poly([[0,0],u,add(u,v),v],fill,stroke);}
  refresh();
  left=K.plot(get('area'),{span:5,handles:function(){var s=factor(sheet);return sheet.map(function(v,i){return {v:mul(v,s),set:function(x){sheet[i]=mul(x,1/s);refresh();}};});},draw:function(p){
    var s=factor(sheet),c=K.css(sum(terms(sheet))<0?'--warn':'--accent');
    p.line([-5,0],[5,0],K.css('--grid'));p.line([0,-5],[0,5],K.css('--grid'));
    face2([[1,0],[0,1]],p,s,null,K.css('--ink-3'));
    var part=component(sheet),pc=K.css(sum(terms(part))<0?'--warn':'--accent');
    face2(sheet,p,s,null,c);face2(part,p,s,K.mix(pc,18),pc);
    for(var i=1;i<5;i++){var t=i/5;p.line(mul(sheet[0],t*s),mul(add(mul(sheet[0],t),sheet[1]),s),K.mix(c,45));p.line(mul(sheet[1],t*s),mul(add(mul(sheet[1],t),sheet[0]),s),K.mix(c,45));}
    for(var j=0;j<5;j++)for(var l=0;l<5;l++){var v=mul(add(mul(sheet[0],(j+.5)/5),mul(sheet[1],(l+.5)/5)),s);p.dot(v[0],v[1],K.css('--ink-3'),2);}
    sheet.forEach(function(v,i){var w=mul(v,s),color=K.css(colors[i]);p.arrow(w,color,'a'+(i+1));p.dot(w[0],w[1],color,6);});
  }});
  function drawBox(p,a,s,fill,stroke){
    var v=[[0,0,0]];for(var mask=1;mask<8;mask++){var x=[0,0,0];for(var i=0;i<3;i++)if(mask&(1<<i))x=add(x,a[i]);v.push(mul(x,s));}
    [[0,1,3,2],[4,5,7,6],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]].forEach(function(face){p.poly(face.map(function(i){return v[i];}),fill,stroke);});
  }
  right=K.plot3(get('volume'),{span:5,azimuth:2.3,elevation:.4,handles:function(){var s=factor(box);return box.map(function(v,i){return {v:mul(v,s),set:function(x){box[i]=mul(x,1/s);refresh();}};});},draw:function(p){
    var s=factor(box),c=K.css(sum(terms(box))<0?'--warn':'--accent');p.axes();
    var part=component(box),pc=K.css(sum(terms(part))<0?'--warn':'--accent');
    drawBox(p,box,s,null,K.mix(c,65));drawBox(p,part,s,K.mix(pc,9),pc);
    box.forEach(function(v,i){p.arrow(mul(v,s),K.css(colors[i]),'a'+(i+1));p.dot(mul(v,s),K.css(colors[i]),6);});
  }});
  dimension.addEventListener('change',function(){error.textContent='';refresh();});piece.addEventListener('change',refresh);
  get('shear').onclick=function(){var a=current();a[1]=add(a[1],a[0]);refresh();};
  get('swap').onclick=function(){var a=current(),t=a[0];a[0]=a[1];a[1]=t;refresh();};
  get('collapse').onclick=function(){var a=current();a[a.length-1]=a[0].slice();refresh();};
  get('thin').onclick=function(){if(dimension.value==='2')sheet=[[1,0],[1,1e-6]];else box=[[1,0,0],[0,1,0],[1,1,1e-6]];refresh();};
  get('reset').onclick=function(){sheet=[[2,1],[1,3]];box=[[2,1,1],[1,2,0],[0,1,2]];piece.value='all';error.textContent='';refresh();};
  get('camera').onclick=right.resetCamera;
});
