/* ============================================================
   AirFloor | Building-height control
   Unit toggle (Floors | Meters | Feet) + draggable slider + numeric field.
   Source of truth = FLOOR COUNT (integer 2..120), mirrored to window.__floors.
   Calls the global hook window.applyFloors(n) on every committed change
   (n = integer 2..120, or null when the field is cleared).
   Uses Motion (window.Motion) for spring animations, with a CSS-transition
   fallback and prefers-reduced-motion support. Idempotent: initHeightControl()
   is safe to call more than once.
   Conversions: 1 floor = 3.32 m (app PER_FLOOR); 1 m = 3.28084 ft.
   ============================================================ */
function initHeightControl(){
  var root = document.getElementById('step2');
  if(!root) return;
  var field = root.querySelector('#pFloors');
  if(!field) return;

  /* idempotency: if already wired, just re-sync layout and bail */
  if(root.__hcInit){ if(typeof root.__hcRender==='function') root.__hcRender(false); return; }
  root.__hcInit = true;

  /* ---- constants ---- */
  var MINF=2, MAXF=120, PER=3.32, M2FT=3.28084;
  var UNITS = {
    floors:{ suffix:'floors', ph:'24',  toU:function(f){return f;},          fromU:function(v){return v;} },
    meters:{ suffix:'m',      ph:'80',  toU:function(f){return f*PER;},       fromU:function(v){return v/PER;} },
    feet:{   suffix:'ft',     ph:'260', toU:function(f){return f*PER*M2FT;},  fromU:function(v){return v/(PER*M2FT);} }
  };
  var ORDER = ['floors','meters','feet'];

  /* ---- elements ---- */
  var seg      = root.querySelector('.hc-seg');
  var segBtns  = Array.prototype.slice.call(root.querySelectorAll('.hc-seg-btn'));
  var glider   = root.querySelector('.hc-seg-glider');
  var slider   = root.querySelector('.hc-slider');
  var rail     = root.querySelector('.hc-rail');
  var fill     = root.querySelector('.hc-fill');
  var thumb    = root.querySelector('.hc-thumb');
  var suffixEl = root.querySelector('.hc-suffix');
  var approx   = root.querySelector('.hc-approx');
  var scaleMin = root.querySelector('.hc-scale-min');
  var scaleMax = root.querySelector('.hc-scale-max');
  if(!slider||!rail||!fill||!thumb) return;

  /* ---- helpers ---- */
  var clamp   = function(v,a,b){ return v<a?a:(v>b?b:v); };
  var roundI  = function(v){ return Math.round(v); };
  var reduced = function(){ return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var word    = function(){ return (window.__floorsWord||'floors'); };
  /* keep only digits and a single decimal point (guards "1.2.3" -> "1.2") */
  var sanitizeNum = function(s){
    s = String(s==null?'':s).replace(/[^0-9.]/g,'');
    var i = s.indexOf('.');
    if(i>=0) s = s.slice(0,i+1) + s.slice(i+1).replace(/\./g,'');
    return s;
  };

  /* ---- state ---- */
  var unit='floors';
  var floors=null;        /* canonical count 2..120, or null = unset */
  var committed=false;

  /* seed from an existing value (window.__floors wins, else the field) */
  (function(){
    var w=window.__floors, v;
    if(typeof w==='number' && isFinite(w)) v=w;
    else v=parseFloat(sanitizeNum(field.value));
    if(isFinite(v) && v>0){ floors=clamp(roundI(v),MINF,MAXF); committed=true; }
  })();

  /* ---- unit math ---- */
  function dispVal(f,u){ return roundI(UNITS[u].toU(f)); }
  function fracOf(f){ return (f-MINF)/(MAXF-MINF); }
  function railW(){ return rail.getBoundingClientRect().width || 1; }
  function xOf(f){ return fracOf(f)*railW(); }
  function floorsFromClientX(cx){
    var r=rail.getBoundingClientRect();
    var x=clamp(cx-r.left,0,r.width);
    return clamp(roundI(MINF + (x/(r.width||1))*(MAXF-MINF)),MINF,MAXF);
  }

  /* ---- animation primitives (Motion spring | CSS-transition fallback) ---- */
  var thumbAnim=null, fillAnim=null, gliderAnim=null;
  function moveThumb(x,spring){
    var m=window.Motion;
    if(thumbAnim && thumbAnim.stop) thumbAnim.stop();
    if(spring && !reduced() && m && m.animate){
      thumb.style.transition='none';
      thumbAnim=m.animate(thumb,{x:x},{type:'spring',visualDuration:.38,bounce:.28});
    } else {
      thumb.style.transition=(spring && !reduced())?'transform .38s cubic-bezier(.5,1.3,.4,1)':'none';
      thumb.style.transform='translateX('+x+'px)';
    }
  }
  function setFill(pct,spring){
    var m=window.Motion;
    if(fillAnim && fillAnim.stop) fillAnim.stop();
    if(spring && !reduced() && m && m.animate){
      fill.style.transition='none';
      fillAnim=m.animate(fill,{width:pct+'%'},{type:'spring',visualDuration:.4,bounce:.18});
    } else {
      fill.style.transition=(spring && !reduced())?'width .4s cubic-bezier(.5,1.2,.4,1)':'none';
      fill.style.width=pct+'%';
    }
  }
  function moveGlider(spring){
    if(!glider) return;
    var btn=root.querySelector('.hc-seg-btn[aria-checked="true"]')||segBtns[0];
    if(!btn) return;
    var x=btn.offsetLeft, w=btn.offsetWidth, m=window.Motion;
    if(w<4) return;                 /* not laid out yet; a later relayout will place it */
    if(gliderAnim && gliderAnim.stop){ gliderAnim.stop(); gliderAnim=null; }
    if(spring && !reduced() && m && m.animate){
      glider.style.transition='none';
      var ga=m.animate(glider,{x:x,width:w},{type:'spring',visualDuration:.35,bounce:.2});
      gliderAnim=ga;
      if(ga.then) ga.then(function(){ if(gliderAnim===ga) gliderAnim=null; }, function(){});
    } else {
      /* no Motion (or instant): CSS transition for user actions, instant for layout sync */
      glider.style.transition=(spring && !reduced())
        ?'transform .35s cubic-bezier(.5,1.3,.4,1), width .35s cubic-bezier(.5,1.3,.4,1)':'none';
      glider.style.transform='translateX('+x+'px)';
      glider.style.width=w+'px';
    }
  }

  /* ---- app hook (rAF-throttled so continuous drag stays smooth) ---- */
  var applyPending=false;
  function scheduleApply(){
    if(applyPending) return;
    applyPending=true;
    (window.requestAnimationFrame||function(cb){return setTimeout(cb,16);})(function(){
      applyPending=false;
      callApply();
    });
  }
  function callApply(){
    try{
      if(typeof window.applyFloors==='function') window.applyFloors(committed?floors:null);
    }catch(e){}
  }
  function flushApply(){ applyPending=false; callApply(); }

  /* ---- text + ARIA ---- */
  function ariaText(){
    if(!committed) return 'No height set';
    if(unit==='floors') return floors+' floors';
    return dispVal(floors,unit)+' '+UNITS[unit].suffix+' (approx '+floors+' '+word()+')';
  }
  function setField(){ field.value = committed ? String(dispVal(floors,unit)) : ''; }
  function setPlaceholder(){ field.setAttribute('placeholder', UNITS[unit].ph); }

  /* ---- render (visual truth). freeX={x,pct} lets the thumb/fill follow the finger during drag ---- */
  function render(spring,freeX){
    var f=(floors==null)?MINF:floors;
    if(freeX){ moveThumb(freeX.x,false); setFill(freeX.pct,false); }
    else{ moveThumb(xOf(f),spring); setFill(committed?fracOf(f)*100:0,spring); }

    slider.classList.toggle('hc-unset', !committed);
    if(suffixEl) suffixEl.textContent = (unit==="floors")?word():UNITS[unit].suffix;

    if(approx){
      if(committed && unit!=='floors'){ approx.hidden=false; approx.textContent='approx '+floors+' '+word(); }
      else approx.hidden=true;
    }
    if(scaleMin) scaleMin.textContent = dispVal(MINF,unit)+(unit==='floors'?'':' '+UNITS[unit].suffix);
    if(scaleMax) scaleMax.textContent = dispVal(MAXF,unit)+(unit==='floors'?'':' '+UNITS[unit].suffix);

    thumb.setAttribute('aria-valuemin', String(MINF));
    thumb.setAttribute('aria-valuemax', String(MAXF));
    thumb.setAttribute('aria-valuenow', String(committed?floors:MINF));
    thumb.setAttribute('aria-valuetext', ariaText());
  }

  /* ---- commit a floor count ---- */
  function commit(nf,opts){
    opts=opts||{};
    floors=clamp(roundI(nf),MINF,MAXF);
    committed=true;
    window.__floors=floors;
    if(opts.setField!==false) setField();
    render(opts.spring!==false);
    if(opts.apply!==false) scheduleApply();
  }

  /* ---- unit selection (keeps the same underlying floor count) ---- */
  function selectUnit(u,spring){
    if(!UNITS[u]) u='floors';
    if(spring===undefined) spring=true;
    unit=u;
    segBtns.forEach(function(b){
      var on=b.getAttribute('data-unit')===u;
      b.setAttribute('aria-checked', on?'true':'false');
      b.tabIndex = on?0:-1;
    });
    setPlaceholder();
    if(committed) setField(); else field.value='';
    moveGlider(spring);
    render(spring);
  }

  /* ============================ events ============================ */

  /* toggle: click + roving arrow keys (radiogroup) */
  segBtns.forEach(function(b){
    b.addEventListener('click', function(){ selectUnit(b.getAttribute('data-unit')); });
  });
  if(seg){
    seg.addEventListener('keydown', function(e){
      var idx=ORDER.indexOf(unit); if(idx<0) idx=0;
      if(e.key==='ArrowRight'||e.key==='ArrowDown') idx=(idx+1)%ORDER.length;
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp') idx=(idx-1+ORDER.length)%ORDER.length;
      else return;
      e.preventDefault();
      selectUnit(ORDER[idx]);
      var nb=root.querySelector('.hc-seg-btn[data-unit="'+ORDER[idx]+'"]'); if(nb) nb.focus();
    });
  }

  /* numeric field: typing updates the slider (no caret-jumping rewrite mid-type) */
  field.addEventListener('input', function(){
    var raw=sanitizeNum(field.value);
    if(raw===''){
      if(committed){ committed=false; window.__floors=null; render(false); scheduleApply(); }
      return;
    }
    var num=parseFloat(raw);
    if(!isFinite(num)) return;
    var f=clamp(roundI(UNITS[unit].fromU(num)),MINF,MAXF);   /* interpret typed value in the active unit */
    floors=f; committed=true; window.__floors=f;
    render(true);            /* glide the thumb; do NOT setField() while typing */
    scheduleApply();
  });
  function normalizeField(){ if(committed) setField(); render(true); }   /* snap display on blur/change */
  field.addEventListener('change', normalizeField);
  field.addEventListener('blur',   normalizeField);

  /* slider: pointer drag (mouse + touch + pen) with pointer capture */
  var dragging=false, pend=false, startX=0, startY=0, curPid=null;
  function liveDrag(cx){
    var r=rail.getBoundingClientRect();
    var x=clamp(cx-r.left,0,r.width);
    var pct=(x/(r.width||1))*100;
    var f=floorsFromClientX(cx);
    floors=f; committed=true; window.__floors=f;
    setField();
    render(false,{x:x,pct:pct});   /* thumb/fill follow the finger, value snaps to a floor */
    scheduleApply();
  }
  function beginDrag(cx){
    dragging=true; pend=false;
    slider.classList.add('hc-drag');
    try{ slider.setPointerCapture(curPid); }catch(_){}
    liveDrag(cx);
    try{ thumb.focus({preventScroll:true}); }catch(_){ if(thumb.focus) thumb.focus(); }
  }
  slider.addEventListener('pointerdown', function(e){
    if(e.button!=null && e.button!==0 && e.pointerType==='mouse') return;
    /* don't hijack taps on the min/max scale labels */
    if(e.target && e.target.closest && e.target.closest('.hc-scale')) return;
    curPid=e.pointerId; startX=e.clientX; startY=e.clientY;
    if(e.pointerType==='mouse'){ beginDrag(e.clientX); e.preventDefault(); }
    else { pend=true; }   /* touch: wait to see if the gesture is horizontal (drag) or vertical (page scroll) */
  });
  slider.addEventListener('pointermove', function(e){
    if(dragging){ liveDrag(e.clientX); if(e.cancelable) e.preventDefault(); return; }
    if(pend){
      var dx=Math.abs(e.clientX-startX), dy=Math.abs(e.clientY-startY);
      if(dx>6 && dx>=dy){ beginDrag(e.clientX); if(e.cancelable) e.preventDefault(); }
      else if(dy>8){ pend=false; }   /* vertical intent: hand the gesture to the page scroller */
    }
  });
  function endDrag(){
    if(pend){ beginDrag(startX); }   /* a plain tap (no drag) sets the value at the tapped point */
    if(!dragging) return;
    dragging=false; pend=false;
    slider.classList.remove('hc-drag');
    try{ slider.releasePointerCapture(curPid); }catch(_){}
    commit(floors,{spring:true});   /* spring-snap thumb to the exact floor position */
    flushApply();
  }
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', function(){ pend=false; if(dragging){ dragging=false; slider.classList.remove('hc-drag'); try{ slider.releasePointerCapture(curPid); }catch(_){} commit(floors,{spring:true}); flushApply(); } });

  /* keyboard on the thumb (role=slider): arrows +/-1, PageUp/Down +/-10, Home/End */
  thumb.addEventListener('keydown', function(e){
    var k=e.key, base=committed?floors:MINF, step=0;
    if(k==='ArrowRight'||k==='ArrowUp') step=1;
    else if(k==='ArrowLeft'||k==='ArrowDown') step=-1;
    else if(k==='PageUp') step=10;
    else if(k==='PageDown') step=-10;
    else if(k==='Home'){ e.preventDefault(); commit(MINF,{spring:true}); flushApply(); return; }
    else if(k==='End'){ e.preventDefault(); commit(MAXF,{spring:true}); flushApply(); return; }
    else return;
    e.preventDefault();
    commit(base+step,{spring:true});
    flushApply();
  });

  /* Relayout on viewport resize (horizontal geometry changes). Internal reflows
     (approx chip, number) never move the toggle/rail X positions, so we deliberately
     do NOT use a ResizeObserver: it would fire mid-toggle and clobber an in-flight
     glider spring. Also skip the glider while it is animating to a new unit. */
  function relayout(){
    if(dragging) return;
    if(!gliderAnim) moveGlider(false);
    render(false);
  }
  if(window.__hcResize) window.removeEventListener('resize', window.__hcResize);
  window.__hcResize=relayout;
  window.addEventListener('resize', relayout);

  /* idempotent re-render hook */
  root.__hcRender=function(sp){ moveGlider(sp); render(sp); };

  /* ---- initial paint (instant; springs are reserved for user actions) ---- */
  selectUnit('floors', false);
  setField();
  var settle=function(){ moveGlider(false); render(false); };
  (window.requestAnimationFrame||function(cb){return setTimeout(cb,16);})(function(){
    settle();
    if(committed) flushApply();     /* if a value already existed, sync the app once */
  });
  /* re-measure once webfonts change the button metrics */
  if(document.fonts && document.fonts.ready && document.fonts.ready.then){
    document.fonts.ready.then(settle).catch(function(){});
  }
}

/* expose + safety-net auto-init (idempotent; an explicit call from app init() is preferred) */
if(typeof window!=='undefined'){
  window.initHeightControl=initHeightControl;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ initHeightControl(); });
  else initHeightControl();
}