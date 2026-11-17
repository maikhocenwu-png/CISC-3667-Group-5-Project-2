const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- state ---------- */
const S={mode:30,list:[],i:0,score:0,res:[],hint:false,phase:'name',pin:null,nameScore:0,nameOK:false,cur:null,picked:false};

/* ---------- scene drawing ---------- */
function fallbackSvg(l){
  const a=ART[l.id];
  if(!a)return '<div class="noimg"><b>Photo coming soon</b></div>';
  const c={s1:a.sky[0],s2:a.sky[1],g:a.g};
  return `<svg viewBox="0 0 400 260" role="img" aria-label="Placeholder drawing of a landmark"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.s1}"/><stop offset="1" stop-color="${c.s2}"/></linearGradient></defs><rect width="400" height="260" fill="url(#sg)"/><rect y="200" width="400" height="60" fill="${c.g}"/>${a.a(c)}</svg>`;
}
const EXTS=['jpg','jpeg','png','webp','JPG','PNG','jfif','avif'];
function setScene(l){
  const box=$('scene');box.innerHTML='';
  const urls=(l.img?[l.img]:[]).concat(EXTS.map(e=>`images/${l.id}.${e}`));
  const img=new Image();img.alt='Photo of a landmark. Which one is it?';img.decoding='async';
  let k=0;
  img.onerror=()=>{
    if(S.cur!==l)return;
    if(++k<urls.length){img.src=urls[k];return}
    box.innerHTML=fallbackSvg(l)+'<div class="placeholder-note">No photo found yet. Save one as <code>images/'+esc(l.id)+'.jpg</code></div>';
  };
  img.src=urls[0];box.appendChild(img);
}

/* ---------- map ---------- */
const svg=$('map'),wrap=$('mapwrap');
const NS='http://www.w3.org/2000/svg';
let ASP=.75,layer;
const padY=()=>1000*ASP/2-250;
const homeView=()=>({x:0,y:-padY(),w:1000});
let vb={...homeView(),h:750};
function measure(){const r=svg.getBoundingClientRect();if(r.width>0&&r.height>0)ASP=r.height/r.width}
(function buildMap(){
  let g='';
  for(let lon=-150;lon<=180;lon+=30){const x=(lon+180)/360*1000;g+=`M${x} 0V500`}
  for(let lat=-60;lat<=60;lat+=30){const y=(90-lat)/180*500;g+=`M0 ${y}H1000`}
  svg.innerHTML=`<rect x="-2000" y="-2000" width="5000" height="4500" fill="#cfe6f5"/><path d="${g}" stroke="#b7d3e6" stroke-width=".6" vector-effect="non-scaling-stroke" fill="none"/><path d="${MAPDATA.land}" fill="#ebe6d6" stroke="#b5ad94" stroke-width=".7" vector-effect="non-scaling-stroke"/><path d="${MAPDATA.borders}" fill="none" stroke="#cfc8b2" stroke-width=".5" vector-effect="non-scaling-stroke"/><g id="layer"></g>`;
  layer=svg.querySelector('#layer');
  setView(vb);
})();
function clampView(v){v.w=Math.max(30,Math.min(1000,v.w));v.h=v.w*ASP;v.x=Math.max(-60,Math.min(1060-v.w,v.x));v.y=Math.max(-padY(),Math.min(500+padY()-v.h,v.y));return v}
function setView(v){vb=clampView({...v});svg.setAttribute('viewBox',`${vb.x} ${vb.y} ${vb.w} ${vb.h}`);drawMarkers()}
function toXY(lat,lon){return [(lon+180)/360*1000,(90-lat)/180*500]}
function drawMarkers(){
  if(!layer)return;const k=vb.w/Math.max(300,svg.clientWidth||600)*1.6;let h='';
  const a=S.phase==='reveal'&&S.cur?toXY(S.cur.lat,S.cur.lon):null;
  const p=S.pin?toXY(S.pin.lat,S.pin.lon):null;
  if(a&&p)h+=`<line x1="${p[0]}" y1="${p[1]}" x2="${a[0]}" y2="${a[1]}" stroke="#333" stroke-width="${2*k}" stroke-dasharray="${6*k} ${4*k}"/>`;
  if(p)h+=`<circle cx="${p[0]}" cy="${p[1]}" r="${7*k}" fill="#2563eb" stroke="#fff" stroke-width="${2.5*k}"/>`;
  if(a)h+=`<circle cx="${a[0]}" cy="${a[1]}" r="${12*k}" fill="#e5484d" fill-opacity=".25"/><circle cx="${a[0]}" cy="${a[1]}" r="${7*k}" fill="#e5484d" stroke="#fff" stroke-width="${2.5*k}"/>`;
  layer.innerHTML=h;
}
let anim=0;
function animateTo(t,ms=700){
  cancelAnimationFrame(anim);const f={...vb},t0=performance.now();
  const ease=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
  (function step(now){const u=Math.min(1,(now-t0)/ms),e=ease(u);
    setView({x:f.x+(t.x-f.x)*e,y:f.y+(t.y-f.y)*e,w:f.w+(t.w-f.w)*e});
    if(u<1)anim=requestAnimationFrame(step)})(t0);
}
function fitTo(points){
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const w=Math.max((maxX-minX)*1.7,(maxY-minY)*1.7/ASP,90);
  return {x:(minX+maxX)/2-w/2,y:(minY+maxY)/2-w*ASP/2,w};
}
function zoomAt(f,cx,cy){
  const w=Math.max(30,Math.min(1000,vb.w/f)),r=w/vb.w;
  setView({x:cx-(cx-vb.x)*r,y:cy-(cy-vb.y)*r,w});
}
const clientToSvg=(cx,cy)=>{const r=svg.getBoundingClientRect();return [vb.x+(cx-r.left)/r.width*vb.w,vb.y+(cy-r.top)/r.height*vb.h]};
const pts=new Map();let moved=0,startPinch=0,downAt=null;
svg.addEventListener('pointerdown',e=>{svg.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;if(pts.size===1)downAt={x:e.clientX,y:e.clientY};if(pts.size===2){const [a,b]=[...pts.values()];startPinch=Math.hypot(a.x-b.x,a.y-b.y)}cancelAnimationFrame(anim)});
svg.addEventListener('pointermove',e=>{
  const p=pts.get(e.pointerId);if(!p)return;
  const r=svg.getBoundingClientRect();
  if(pts.size===1){const dx=e.clientX-p.x,dy=e.clientY-p.y;moved+=Math.abs(dx)+Math.abs(dy);if(moved>6)setView({x:vb.x-dx/r.width*vb.w,y:vb.y-dy/r.height*vb.h,w:vb.w});}
  else if(pts.size===2){
    p.x=e.clientX;p.y=e.clientY;const [a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);
    if(startPinch>0){const [cx,cy]=clientToSvg((a.x+b.x)/2,(a.y+b.y)/2);zoomAt(d/startPinch,cx,cy);startPinch=d}moved=99;
  }
  p.x=e.clientX;p.y=e.clientY;
});
const endPtr=e=>{
  const wasOne=pts.size===1;pts.delete(e.pointerId);
  if(wasOne&&moved<=6&&downAt&&e.type==='pointerup'&&S.phase==='pin'){
    const [x,y]=clientToSvg(e.clientX,e.clientY);
    if(x>=0&&x<=1000&&y>=0&&y<=500){S.pin={lat:90-y/500*180,lon:x/1000*360-180};$('confirm').disabled=false;drawMarkers()}
  }
  if(pts.size<2)startPinch=0;
};
svg.addEventListener('pointerup',endPtr);svg.addEventListener('pointercancel',endPtr);
svg.addEventListener('wheel',e=>{e.preventDefault();const [cx,cy]=clientToSvg(e.clientX,e.clientY);zoomAt(e.deltaY<0?1.25:.8,cx,cy)},{passive:false});
$('zin').onclick=()=>zoomAt(1.6,vb.x+vb.w/2,vb.y+vb.h/2);
$('zout').onclick=()=>zoomAt(1/1.6,vb.x+vb.w/2,vb.y+vb.h/2);
$('zreset').onclick=()=>animateTo(homeView(),400);

/* ---------- scoring ---------- */
function km(a,b,c,d){const R=6371,t=x=>x*Math.PI/180,dl=t(c-a),dn=t(d-b);const h=Math.sin(dl/2)**2+Math.cos(t(a))*Math.cos(t(c))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const mapPoints=d=>d<25?500:Math.round(500*Math.exp(-d/1500));
const fmt=n=>Math.round(n).toLocaleString('en-US');

/* ---------- flow ---------- */
const show=(id,on)=>$(id).classList.toggle('hidden',!on);
function screen(n){['start','game','end'].forEach(s=>show(s,s===n));window.scrollTo(0,0)}
function bestLabel(){[30,10].forEach(m=>{const b=store.get('lm30-best-'+m);$('best'+m).textContent=b?`Best: ${fmt(b)} pts`:''})}
function startGame(mode){
  S.mode=mode;S.list=mode===30?shuffle(LANDMARKS):shuffle(LANDMARKS).slice(0,10);S.i=0;S.score=0;S.res=[];
  screen('game');round();
}
function round(){
  const l=S.cur=S.list[S.i];S.hint=false;S.pin=null;S.phase='name';S.picked=false;S.nameScore=0;S.nameOK=false;
  $('rnd').textContent=`${S.i+1}/${S.list.length}`;$('score').textContent=fmt(S.score);$('prog').style.width=(S.i/S.list.length*100)+'%';
  setScene(l);
  const others=shuffle(LANDMARKS.filter(x=>x!==l)).slice(0,3);
  $('opts').innerHTML=shuffle([l,...others]).map((o,k)=>`<button class="opt" type="button" data-n="${esc(o.name)}"><kbd>${k+1}</kbd><span>${esc(o.name)}</span></button>`).join('');
  $('opts').querySelectorAll('.opt').forEach(b=>b.onclick=()=>pick(b));
  $('hintOut').innerHTML='';show('hintBtn',true);
  show('nameFb',false);show('toMap',false);show('nameCard',true);show('mapCard',false);show('result',false);
  $('q').focus({preventScroll:true});
  window.scrollTo(0,0);
}
$('hintBtn').onclick=()=>{if(S.picked)return;S.hint=true;show('hintBtn',false);$('hintOut').innerHTML=`Country<span class="tag">${esc(S.cur.country)}</span> <span style="margin-left:6px">(max 250 pts for this one)</span>`};
function pick(btn){
  if(S.picked)return;S.picked=true;
  const l=S.cur,ok=btn.dataset.n===l.name;
  S.nameOK=ok;S.nameScore=ok?(S.hint?250:500):0;
  $('opts').querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(b.dataset.n===l.name)b.classList.add('good');else if(b===btn)b.classList.add('bad')});
  const fb=$('nameFb');fb.className='feedback '+(ok?'good':'bad');
  fb.textContent=ok?`Correct! +${S.nameScore} points`:`Not quite. It was the ${l.name}.`;
  show('hintBtn',false);show('toMap',true);$('toMap').focus({preventScroll:false});
}
$('toMap').onclick=()=>{
  S.phase='pin';S.pin=null;show('nameCard',false);show('mapCard',true);show('legend',false);show('pinRow',true);show('maphint',true);
  $('mapQ').textContent=`Where is the ${S.cur.name}?`;$('confirm').disabled=true;
  measure();setView(homeView());$('mapQ').focus({preventScroll:true});window.scrollTo(0,0);
};
$('confirm').onclick=()=>reveal(false);
$('skipPin').onclick=()=>reveal(true);
function reveal(skipped){
  const l=S.cur;if(skipped)S.pin=null;
  S.phase='reveal';
  let d=null,mp=0;
  if(S.pin){d=km(S.pin.lat,S.pin.lon,l.lat,l.lon);mp=mapPoints(d)}
  const tot=S.nameScore+mp;S.score+=tot;
  S.res.push({n:l.name,ok:S.nameOK,hint:S.hint,d,np:S.nameScore,mp,tot});
  $('score').textContent=fmt(S.score);
  show('pinRow',false);show('maphint',false);show('legend',true);
  $('mapQ').textContent=`${l.name}: ${l.place}, ${l.country}`;
  $('sName').textContent=S.nameScore;$('sMap').textContent=mp;$('sTot').textContent=tot;
  $('dist').textContent=d==null?'You skipped the map.':`Your pin was ${fmt(d)} km (${fmt(d*0.621371)} mi) away.`;
  $('rName').textContent=l.name;$('rMeta').textContent=`${l.place}, ${l.country} · ${l.year}`;$('rFact').textContent=l.fact;$('rCredit').textContent=l.credit||'';
  $('next').textContent=S.i+1>=S.list.length?'See final score →':'Next landmark →';
  show('result',true);
  const a=toXY(l.lat,l.lon);
  drawMarkers();
  animateTo(fitTo(S.pin?[a,toXY(S.pin.lat,S.pin.lon)]:[a,[a[0]+30,a[1]+22]]),900);
  $('mapQ').focus({preventScroll:true});
  wrap.scrollIntoView({behavior:'smooth',block:'start'});
}
$('next').onclick=()=>{S.i++;if(S.i>=S.list.length)finish();else round()};

function finish(){
  const max=S.list.length*1000,pct=S.score/max;
  const title=pct>=.85?'Globetrotter!':pct>=.6?'Seasoned explorer':pct>=.35?'Curious traveller':'Armchair tourist';
  $('prog').style.width='100%';
  $('endTitle').textContent=title;$('endScore').textContent=`${fmt(S.score)} / ${fmt(max)}`;
  const named=S.res.filter(r=>r.ok).length;
  $('endSub').textContent=`${named} of ${S.list.length} landmarks named correctly`;
  const key='lm30-best-'+S.mode,prev=+store.get(key)||0;
  if(S.score>prev){store.set(key,S.score);if(prev)$('endSub').textContent+=' · New best!'}
  $('review').innerHTML='<tr><th>#</th><th>Landmark</th><th>Name</th><th class="n">Distance</th><th class="n">Pts</th></tr>'+S.res.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.n)}</td><td class="${r.ok?'ok':'no'}">${r.ok?'✓':'✗'}${r.hint?' <small>(hint)</small>':''}</td><td class="n">${r.d==null?'–':fmt(r.d)+' km'}</td><td class="n">${r.tot}</td></tr>`).join('');
  $('copied').textContent='';bestLabel();screen('end');
}
$('again').onclick=()=>screen('start');
$('copy').onclick=async()=>{
  const max=S.list.length*1000;
  const txt=`Landmark Guesser: ${fmt(S.score)}/${fmt(max)} (${S.res.filter(r=>r.ok).length}/${S.list.length} named)\n`+S.res.map(r=>(r.ok?'✅':'❌')).join('');
  try{await navigator.clipboard.writeText(txt);$('copied').textContent='Copied!'}catch(e){$('copied').textContent=txt.replace(/\n/g,' · ')}
};
$('play30').onclick=()=>startGame(30);
$('play10').onclick=()=>startGame(10);
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT')return;
  if(S.phase==='name'&&!$('game').classList.contains('hidden')&&!S.picked&&/^[1-4]$/.test(e.key)){const b=$('opts').querySelectorAll('.opt')[+e.key-1];if(b)pick(b)}
});
bestLabel();

window.addEventListener('resize',()=>{if($('mapCard').classList.contains('hidden'))return;measure();setView(vb)});
