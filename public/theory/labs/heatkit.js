/* A diverging matrix heatmap. Supply a common limit to compare residuals honestly. */
(function(){
  var K=GU.labkit;
  K.heatmap=function(canvas,specification){
    var ctx=canvas.getContext('2d');
    function render(){
      var spec=specification(),matrix=spec.matrix,rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height),dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      var size=Math.min(w-16,h-46),cw=size/matrix[0].length,ch=size/matrix.length,ox=(w-size)/2,oy=8,limit=spec.limit||1;
      function color(v){return 'color-mix(in srgb, '+K.css(v<0?'--v':'--u')+' '+Math.min(100,100*Math.abs(v)/limit)+'%, '+K.css('--paper')+')';}
      matrix.forEach(function(row,i){row.forEach(function(v,j){ctx.fillStyle=color(v);ctx.fillRect(ox+j*cw,oy+i*ch,cw,ch);ctx.strokeStyle=K.css('--rule');ctx.strokeRect(ox+j*cw,oy+i*ch,cw,ch);});});
      for(var j=0;j<60;j++){ctx.fillStyle=color(limit*(2*j/59-1));ctx.fillRect(ox+j*size/60,oy+size+10,size/60+1,7);}
      ctx.fillStyle=K.css('--ink-2');ctx.font='10px sans-serif';ctx.textAlign='left';ctx.fillText(K.f(-limit,2),ox,oy+size+31);ctx.textAlign='center';ctx.fillText('0',ox+size/2,oy+size+31);ctx.textAlign='right';ctx.fillText(K.f(limit,2),ox+size,oy+size+31);
    }
    canvas.addEventListener('gu-theme',render);window.addEventListener('resize',render);
    if(window.ResizeObserver)new ResizeObserver(render).observe(canvas);
    render();return {render:render};
  };
})();
