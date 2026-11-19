/* ---------- map labels ----------
   Each label is [name, lat, lon, sizeClass]. Country size classes set the zoom
   level at which a country first becomes eligible: L=1x, M=2x, S=3.5x, T=6x.
   Labels that would overlap a higher-priority label are hidden, so the map
   stays readable at every zoom level. */
const ZCLASS={L:0.8,M:1,S:1.3,T:1.8};
const LBL_CONTINENTS=[
  ['North America',50,-102],['South America',-15,-58],['Europe',54,20],['Africa',6,20],
  ['Asia',50,95],['Oceania',-30,158],['Antarctica',-80,30]
];
const LBL_OCEANS=[
  ['Pacific Ocean',3,-140],['Pacific Ocean',-10,-165],['Atlantic Ocean',22,-42],['Atlantic Ocean',-22,-15],
  ['Indian Ocean',-17,80],['Arctic Ocean',83,60],['Southern Ocean',-62,0]
];
const LBL_SEAS=[
  ['Mediterranean Sea',35,18],['Caribbean Sea',15,-75],['Gulf of Mexico',25,-90],['Bay of Bengal',14,89],
  ['Arabian Sea',15,65],['South China Sea',13,114],['North Sea',56,3],['Black Sea',43.3,34],
  ['Hudson Bay',60,-85],['Baltic Sea',58,19],['Red Sea',20,38],['Sea of Japan',40,134]
];
const LBL_REGIONS=[
  ['Scandinavia',64,15],['British Isles',54,-4],['Western Europe',48,5],['Eastern Europe',52,30],['Balkans',43,21],
  ['Middle East',28,45],['Central Asia',44,66],['Siberia',63,105],['Southeast Asia',12,103],['East Asia',36,118],
  ['South Asia',24,78],['Sahara',24,12],['West Africa',11,-4],['Horn of Africa',8,46],['Central Africa',0,22],
  ['Southern Africa',-21,24],['Central America',14,-88],['Caribbean',19,-73],['Amazon Basin',-5,-63],
  ['Patagonia',-47,-70],['Great Plains',42,-101],['Arctic Canada',70,-100],['Caucasus',42,45],['Himalayas',29,85]
];
const LBL_COUNTRIES=[
  // North & Central America, Caribbean
  ['Canada',60,-100,'L'],['United States',39,-98,'L'],['Mexico',24,-102,'L'],['Greenland',74,-41,'L'],
  ['Cuba',22,-79,'M'],['Guatemala',15.5,-90.3,'S'],['Honduras',14.8,-86.5,'S'],['Nicaragua',12.8,-85,'S'],
  ['Costa Rica',10,-84,'S'],['Panama',8.6,-80,'S'],['El Salvador',13.8,-88.9,'T'],['Belize',17.2,-88.7,'T'],
  ['Dominican Rep.',19,-70.5,'S'],['Haiti',19,-72.6,'T'],['Jamaica',18.1,-77.3,'T'],['Bahamas',24.5,-77,'T'],
  // South America
  ['Brazil',-10,-52,'L'],['Argentina',-37,-65,'L'],['Colombia',4,-73,'M'],['Peru',-9,-75,'M'],['Chile',-30,-71,'M'],
  ['Bolivia',-17,-64.5,'M'],['Venezuela',7,-66,'M'],['Ecuador',-1.5,-78.3,'S'],['Paraguay',-23.3,-58.4,'S'],
  ['Uruguay',-32.8,-56,'S'],['Guyana',4.8,-58.9,'S'],['Suriname',4,-56,'T'],
  // Europe
  ['Iceland',65,-18,'M'],['Ireland',53.2,-8,'S'],['United Kingdom',54,-2.5,'M'],['Norway',62,9,'M'],['Sweden',62,16,'M'],
  ['Finland',64,27,'M'],['Denmark',56,9.5,'T'],['Netherlands',52.2,5.5,'T'],['Belgium',50.6,4.6,'T'],
  ['Luxembourg',49.8,6.1,'T'],['France',47,2,'M'],['Spain',40,-4,'M'],['Portugal',39.6,-8,'S'],['Germany',51,10.4,'M'],
  ['Poland',52,19.5,'M'],['Italy',42.8,12.5,'M'],['Switzerland',46.8,8.2,'T'],['Austria',47.5,14.3,'S'],
  ['Czechia',49.8,15.5,'S'],['Slovakia',48.7,19.5,'T'],['Hungary',47,19.5,'S'],['Romania',46,25,'M'],
  ['Bulgaria',42.7,25.3,'S'],['Greece',39,22,'S'],['Serbia',44,21,'S'],['Croatia',45.2,15.6,'T'],
  ['Bosnia & Herz.',44,17.8,'T'],['Slovenia',46.1,14.8,'T'],['Albania',41,20,'T'],['North Macedonia',41.6,21.7,'T'],
  ['Montenegro',42.8,19.3,'T'],['Lithuania',55.3,23.9,'S'],['Latvia',56.9,24.9,'S'],['Estonia',58.7,25.5,'S'],
  ['Belarus',53.5,28,'M'],['Ukraine',49,32,'M'],['Moldova',47,28.5,'T'],['Cyprus',35,33,'T'],['Malta',35.9,14.4,'T'],
  // Africa
  ['Morocco',32,-6.5,'M'],['Algeria',28,3,'L'],['Tunisia',34,9.5,'S'],['Libya',27,17,'L'],['Egypt',26,30,'L'],
  ['Western Sahara',24.5,-13,'T'],['Mauritania',20,-10.5,'M'],['Mali',17,-3,'M'],['Niger',17,9,'M'],['Chad',15,19,'M'],
  ['Sudan',15,30,'L'],['South Sudan',7,30,'M'],['Ethiopia',8,40,'M'],['Eritrea',15.4,39,'T'],['Djibouti',11.8,42.6,'T'],
  ['Somalia',5,46,'M'],['Kenya',0.5,38,'M'],['Uganda',1.5,32.3,'S'],['Tanzania',-6,35,'M'],['Rwanda',-2,30,'T'],
  ['Burundi',-3.4,29.9,'T'],['DR Congo',-3,23,'L'],['Congo',-1,15,'S'],['Gabon',-0.8,11.7,'S'],['Cameroon',6,12.5,'S'],
  ['Central African Rep.',6.6,20.5,'S'],['Nigeria',9.5,8,'M'],['Benin',9.5,2.3,'T'],['Togo',8.6,1,'T'],['Ghana',7.9,-1.2,'S'],
  ['Ivory Coast',7.5,-5.5,'S'],['Liberia',6.4,-9.4,'T'],['Sierra Leone',8.5,-11.8,'T'],['Guinea',10.5,-11,'S'],
  ['Senegal',14.5,-14.5,'S'],['Burkina Faso',12.3,-1.6,'S'],['Angola',-12,17.5,'M'],['Zambia',-14,28,'M'],
  ['Malawi',-13.2,34,'T'],['Mozambique',-18,35,'M'],['Zimbabwe',-19,30,'S'],['Namibia',-22,17,'M'],['Botswana',-22,24,'S'],
  ['South Africa',-30,25,'L'],['Lesotho',-29.6,28.2,'T'],['Eswatini',-26.5,31.5,'T'],['Madagascar',-19,47,'M'],
  // Middle East
  ['Turkey',39,35,'M'],['Syria',35,38.5,'S'],['Lebanon',33.9,35.8,'T'],['Israel',31.2,35,'T'],['Jordan',31,36.5,'T'],
  ['Iraq',33,44,'M'],['Iran',32,54,'L'],['Saudi Arabia',24,45,'L'],['Kuwait',29.3,47.7,'T'],['Qatar',25.3,51.2,'T'],
  ['UAE',24,54.3,'T'],['Oman',21,57,'S'],['Yemen',15.5,48,'S'],['Georgia',42,43.5,'T'],['Armenia',40.2,45,'T'],
  ['Azerbaijan',40.3,47.7,'T'],
  // Asia
  ['Russia',61,95,'L'],['Kazakhstan',48,67,'L'],['Uzbekistan',41.5,64,'M'],['Turkmenistan',39,59,'M'],
  ['Kyrgyzstan',41.2,74.5,'S'],['Tajikistan',38.8,71,'S'],['Afghanistan',34,66,'M'],['Pakistan',30,70,'M'],
  ['India',22,79,'L'],['Nepal',28.3,84,'S'],['Bhutan',27.4,90.4,'T'],['Bangladesh',24,90,'S'],['Sri Lanka',7.8,80.7,'S'],
  ['Mongolia',46.5,103,'L'],['China',35,103,'L'],['North Korea',40,127,'S'],['South Korea',36.5,128,'S'],
  ['Japan',37,138,'M'],['Taiwan',23.7,121,'T'],['Myanmar',21,96,'M'],['Thailand',15,101,'M'],['Laos',19.5,102.5,'S'],
  ['Vietnam',15,107.5,'M'],['Cambodia',12.5,105,'S'],['Malaysia',4,102,'S'],['Singapore',1.35,103.8,'T'],
  ['Brunei',4.5,114.7,'T'],['Indonesia',-2,115,'L'],['Philippines',12,122,'M'],['Papua New Guinea',-6,144,'M'],
  // Oceania
  ['Australia',-25,134,'L'],['New Zealand',-42,173,'M'],['Fiji',-17.8,178,'T']
];

const LBL_STYLE={
  continent:{px:14,caps:true,ls:2.5,weight:700,fill:'#7d725c',op:.85,halo:'#ebe6d6',minZ:0,maxZ:2.6,pri:0},
  ocean:{px:12,caps:true,ls:3,weight:600,italic:true,fill:'#5588ac',op:.9,halo:'#cfe6f5',minZ:0,maxZ:3.5,pri:1},
  sea:{px:10,caps:false,ls:0.5,weight:500,italic:true,fill:'#5588ac',op:.9,halo:'#cfe6f5',minZ:2.4,maxZ:99,pri:2},
  region:{px:10,caps:true,ls:1.2,weight:600,fill:'#8a7f66',op:.85,halo:'#ebe6d6',minZ:2,maxZ:5,pri:4},
country:{px:9.5,caps:false,ls:0,weight:700,fill:'#454a52',op:1,halo:'#ebe6d6',minZ:0.8,maxZ:99,pri:3}
};
const LABELS=[];let lblG=null;


function buildLabels(group){
  lblG=group;LABELS.length=0;
  const add=(kind,name,lat,lon,minZ)=>{
    const st=LBL_STYLE[kind],[x,y]=toXY(lat,lon);
    const el=document.createElementNS(NS,'text');
    el.setAttribute('x',x);el.setAttribute('y',y);
    el.setAttribute('text-anchor','middle');el.setAttribute('dominant-baseline','central');
    el.setAttribute('font-family','system-ui,-apple-system,Segoe UI,Roboto,sans-serif');
    el.setAttribute('font-weight',st.weight);if(st.italic)el.setAttribute('font-style','italic');
    el.setAttribute('fill',st.fill);el.setAttribute('fill-opacity',st.op);
    el.setAttribute('stroke',st.halo);el.setAttribute('stroke-linejoin','round');el.setAttribute('paint-order','stroke');
    el.setAttribute('pointer-events','none');el.setAttribute('display','none');
    const text=st.caps?name.toUpperCase():name;
    el.textContent=text;group.appendChild(el);
    LABELS.push({el,x,y,kind,st,len:text.length,minZ:minZ==null?st.minZ:minZ,seq:LABELS.length});
  };
  LBL_CONTINENTS.forEach(a=>add('continent',a[0],a[1],a[2]));
  LBL_OCEANS.forEach(a=>add('ocean',a[0],a[1],a[2]));
  LBL_SEAS.forEach(a=>add('sea',a[0],a[1],a[2]));
  LBL_REGIONS.forEach(a=>add('region',a[0],a[1],a[2]));
  LBL_COUNTRIES.forEach(a=>add('country',a[0],a[1],a[2],ZCLASS[a[3]]));
  // priority: continents > oceans > seas > regions > countries (bigger countries first)
  LABELS.sort((a,b)=>a.st.pri-b.st.pri||a.minZ-b.minZ||a.seq-b.seq);
}

function updateLabels(){
  if(!lblG)return;

  const W=svg.clientWidth||600;
  const k=vb.w/W;
  const z=1000/vb.w;
  const mapRect=svg.getBoundingClientRect();
  const placed=[];

  for(const L of LABELS){
let ok=z>=L.minZ&&z<L.st.maxZ;

    if(!ok){
      L.el.setAttribute('display','none');
      continue;
    }

    let px=L.st.px;

    if(L.kind==='country'){
      px*=1+Math.min(.35,Math.log2(Math.max(1,z))*.1);
    }

    L.el.setAttribute('font-size',px*k);
    L.el.setAttribute('stroke-width',3*k);
    L.el.setAttribute('letter-spacing',L.st.ls*k);
    L.el.setAttribute('display','inline');

    const r=L.el.getBoundingClientRect();

    if(r.right<mapRect.left||r.left>mapRect.right||
       r.bottom<mapRect.top||r.top>mapRect.bottom){
      L.el.setAttribute('display','none');
      continue;
    }

    const overlaps=placed.some(p=>
      r.left<p.right&&r.right>p.left&&
      r.top<p.bottom&&r.bottom>p.top
    );

    if(overlaps){
      L.el.setAttribute('display','none');
    }else{
      placed.push(r);
    }
  }
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
svg.innerHTML=`
  <rect x="-2000" y="-2000" width="5000" height="4500" fill="#cfe6f5"/>
  <path d="${g}" stroke="#b7d3e6" stroke-width=".6" vector-effect="non-scaling-stroke" fill="none"/>
  <path d="${MAPDATA.land}" fill="#ebe6d6" stroke="#b5ad94" stroke-width=".7" vector-effect="non-scaling-stroke"/>
  <path d="${MAPDATA.borders}" fill="none" stroke="#cfc8b2" stroke-width=".5" vector-effect="non-scaling-stroke"/>
  <g id="countryLabels"></g>
  <g id="layer"></g>
`;
  layer=svg.querySelector('#layer');
  buildLabels(svg.querySelector('#countryLabels'));
  setView(vb);
})();
function clampView(v){v.w=Math.max(30,Math.min(1000,v.w));v.h=v.w*ASP;v.x=Math.max(-60,Math.min(1060-v.w,v.x));v.y=Math.max(-padY(),Math.min(500+padY()-v.h,v.y));return v}
function setView(v){vb=clampView({...v});svg.setAttribute('viewBox',`${vb.x} ${vb.y} ${vb.w} ${vb.h}`);updateLabels();drawMarkers()}
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
