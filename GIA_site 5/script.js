/* Galaxy International Academy — Glassmorphism / Futuristic */
(function(){
'use strict';
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= language ================= */
var LANG_KEY='gia_lang';
function applyLang(lang){
  document.documentElement.setAttribute('data-lang',lang);
  document.documentElement.setAttribute('lang',lang==='bn'?'bn':(lang==='ja'?'ja':'en'));
  document.querySelectorAll('[data-en]').forEach(function(el){
    var v=el.getAttribute('data-'+lang);
    if(v!=null) el.textContent=v;
  });
  document.querySelectorAll('.langbtn').forEach(function(b){
    b.classList.toggle('on', b.getAttribute('data-l')===lang);
  });
  try{localStorage.setItem(LANG_KEY,lang);}catch(e){}
  splitChars();
  buildRotator();
  if(quizStarted) renderQuiz();
}
document.querySelectorAll('.langbtn').forEach(function(b){
  b.addEventListener('click',function(){applyLang(b.getAttribute('data-l'));});
});

/* ================= mobile nav ================= */
var ntog=document.getElementById('ntog'), menu=document.getElementById('m');
if(ntog&&menu){
  ntog.addEventListener('click',function(){ menu.classList.toggle('open'); ntog.textContent=menu.classList.contains('open')?'✕':'☰'; });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){ menu.classList.remove('open'); ntog.textContent='☰'; });
  });
}

/* ================= headline letter reveal ================= */
function splitChars(){
  document.querySelectorAll('.chars').forEach(function(el){
    var txt=el.textContent, frag=document.createDocumentFragment(), i=0;
    txt.split('').forEach(function(ch){
      var s=document.createElement('span');
      s.className='char'; s.textContent=(ch===' '?' ':ch);
      s.style.animationDelay=(i*0.04)+'s'; i++;
      frag.appendChild(s);
    });
    el.textContent=''; el.appendChild(frag);
  });
}

/* ================= rotating line ================= */
var rotWords={
  en:['study','work','live','grow'],
  ja:['学び','働き','暮らし','成長する'],
  bn:['পড়া','কাজ','থাকা','বেড়ে ওঠা']
};
var rotI=0, rotTimer=null;
function buildRotator(){
  var r=document.getElementById('rotator'); if(!r) return;
  var lang=document.documentElement.getAttribute('data-lang')||'en';
  var w=(rotWords[lang]||rotWords.en);
  var pre={en:'A place to ',ja:'日本で ',bn:'জাপানে '}[lang];
  var suf={en:' — in Japan.',ja:' 場所へ。',bn:' — এক নতুন শুরু।'}[lang];
  r.innerHTML=pre+'<b id="rotWord"></b>'+suf;
  var el=document.getElementById('rotWord');
  el.textContent=w[rotI%w.length];
  if(rotTimer) clearInterval(rotTimer);
  if(reduce) return;
  rotTimer=setInterval(function(){
    var lg=document.documentElement.getAttribute('data-lang')||'en';
    var ws=rotWords[lg]||rotWords.en;
    var t=document.getElementById('rotWord'); if(!t) return;
    t.style.opacity=0;
    setTimeout(function(){ rotI++; t.textContent=ws[rotI%ws.length]; t.style.opacity=1; },250);
  },2600);
}

/* ================= cursor spotlight ================= */
var spot=document.getElementById('spot');
if(spot&&!reduce&&window.matchMedia('(pointer:fine)').matches){
  var sx=0,sy=0,cx=0,cy=0,shown=false;
  window.addEventListener('mousemove',function(e){
    sx=e.clientX; sy=e.clientY;
    if(!shown){shown=true;spot.style.opacity=1;}
  });
  (function loop(){ cx+=(sx-cx)*0.09; cy+=(sy-cy)*0.09;
    spot.style.left=cx+'px'; spot.style.top=cy+'px';
    requestAnimationFrame(loop); })();
}

/* ================= magnetic buttons ================= */
if(!reduce){
  document.querySelectorAll('.mag').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect();
      var x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      btn.style.transform='translate('+(x*0.24)+'px,'+(y*0.38)+'px)';
    });
    btn.addEventListener('mouseleave',function(){ btn.style.transform=''; });
  });
}

/* ================= 3D tilt ================= */
if(!reduce){
  document.querySelectorAll('.tilt').forEach(function(c){
    c.addEventListener('mousemove',function(e){
      var r=c.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
      c.style.transform='perspective(800px) rotateY('+(px*7)+'deg) rotateX('+(-py*7)+'deg) translateY(-6px)';
    });
    c.addEventListener('mouseleave',function(){ c.style.transform=''; });
  });
}

/* ================= reveal on scroll ================= */
/* legacy inner pages: opt their content blocks into the reveal animation */
document.querySelectorAll('.card,.ccard,.panel,.founder,.pricebox,.cdetail>*,.sec,.tlrow,.faq details,.feewrap,.videowrap')
  .forEach(function(el){ el.classList.add('reveal'); });
var io=new IntersectionObserver(function(en){
  en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

/* ================= counters ================= */
function animCount(el){
  var target=parseFloat(el.getAttribute('data-count'))||0;
  var suf=el.getAttribute('data-suf')||'';
  var t0=null, dur=1700;
  function step(ts){ if(!t0)t0=ts;
    var p=Math.min((ts-t0)/dur,1);
    var v=Math.floor(target*(0.5-Math.cos(p*Math.PI)/2));
    el.textContent=v.toLocaleString()+suf;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
var cio=new IntersectionObserver(function(en){
  en.forEach(function(x){ if(x.isIntersecting){ animCount(x.target); cio.unobserve(x.target); } });
},{threshold:0.5});
document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

/* ================= flight route ================= */
var fio=new IntersectionObserver(function(en){
  en.forEach(function(x){
    if(!x.isIntersecting) return;
    var sec=x.target.closest('.flight')||x.target;
    sec.classList.add('is-in');
    var fg=x.target.querySelector('.route-fg');
    if(fg){ fg.style.transition='stroke-dashoffset 2.6s ease';
      requestAnimationFrame(function(){ fg.style.strokeDashoffset='0'; }); }
    var fly=document.getElementById('flyAnim');
    if(fly&&fly.beginElement){ try{ fly.beginElement(); }catch(e){} }
    fio.unobserve(x.target);
  });
},{threshold:0.35});
document.querySelectorAll('.flightbox').forEach(function(el){ fio.observe(el); });

/* ================= pathway quiz ================= */
var quizStarted=false, quizStep=0, quizScore={study:0,work:0,lang:0};
var QUIZ={
 en:{q:[
   {t:'What is your main goal?',a:[['Study at a school in Japan','study'],['Work in Japan (SSW)','work'],['Just learn the language','lang']]},
   {t:'How soon do you want to go?',a:[['Within a year','work'],['In 1–2 years','study'],['No rush yet','lang']]},
   {t:'Your current Japanese level?',a:[['None / absolute beginner','lang'],['Some basics (N5-ish)','study'],['I can hold a conversation','work']]}
 ],
 r:{study:['🎓','Study in Japan','A student-visa pathway suits you best. Start with N5/N4 while we prepare your admission and COE.','course-n5.html'],
    work:['🛠','SSW / Work Pathway','The Specified Skilled Worker route fits you. Begin with JFT-Basic and skill-test training.','visa-ssw.html'],
    lang:['🗣','Japanese Course First','Start with our Japanese courses and daily Kaiwa — then decide your pathway with confidence.','courses.html']},
 res:'Your best match', view:'Explore this →', again:'Retake the check'},
 ja:{q:[
   {t:'一番の目標は何ですか？',a:[['日本の学校で学ぶ','study'],['日本で働く（特定技能）','work'],['語学だけ学びたい','lang']]},
   {t:'いつ頃、日本へ行きたいですか？',a:[['1年以内','work'],['1〜2年後','study'],['まだ急がない','lang']]},
   {t:'今の日本語レベルは？',a:[['まったくの初心者','lang'],['基礎が少し（N5程度）','study'],['会話ができる','work']]}
 ],
 r:{study:['🎓','日本留学','留学ビザの道が最適です。N5/N4から始め、入学手続きとCOEを準備します。','course-n5.html'],
    work:['🛠','特定技能・就労','就労の道が向いています。JFT-Basicと技能試験対策から始めましょう。','visa-ssw.html'],
    lang:['🗣','まずは日本語コース','日本語コースと毎日の会話から始め、自信を持って進路を決めましょう。','courses.html']},
 res:'あなたに最適な道', view:'詳しく見る →', again:'もう一度診断する'},
 bn:{q:[
   {t:'আপনার মূল লক্ষ্য কী?',a:[['জাপানের স্কুলে পড়া','study'],['জাপানে কাজ করা (SSW)','work'],['শুধু ভাষা শেখা','lang']]},
   {t:'কত দ্রুত যেতে চান?',a:[['এক বছরের মধ্যে','work'],['১–২ বছরের মধ্যে','study'],['এখনো তাড়া নেই','lang']]},
   {t:'বর্তমান জাপানি লেভেল কী?',a:[['একদম নতুন','lang'],['কিছু বেসিক জানি (N5)','study'],['কথা বলতে পারি','work']]}
 ],
 r:{study:['🎓','জাপানে পড়াশোনা','স্টুডেন্ট ভিসার পথ আপনার জন্য সেরা। N5/N4 দিয়ে শুরু করুন, ভর্তি ও COE আমরা দেখব।','course-n5.html'],
    work:['🛠','SSW / কাজের পথ','SSW রুট আপনার জন্য উপযুক্ত। JFT-Basic ও স্কিল টেস্ট প্রস্তুতি দিয়ে শুরু করুন।','visa-ssw.html'],
    lang:['🗣','আগে জাপানি কোর্স','জাপানি কোর্স ও প্রতিদিনের কাইওয়া দিয়ে শুরু করুন — এরপর আত্মবিশ্বাসে পথ ঠিক করুন।','courses.html']},
 res:'আপনার সেরা মিল', view:'বিস্তারিত দেখুন →', again:'আবার চেক করুন'}
};
function renderQuiz(){
  var box=document.getElementById('quiz'); if(!box) return;
  var lang=document.documentElement.getAttribute('data-lang')||'en';
  var Q=QUIZ[lang]||QUIZ.en, bar=document.getElementById('quizbar');
  if(quizStep<Q.q.length){
    if(bar) bar.style.width=(quizStep/Q.q.length*100)+'%';
    var q=Q.q[quizStep];
    var h='<div class="quiz-q">'+q.t+'</div><div class="quiz-opts">';
    q.a.forEach(function(a){ h+='<button class="quiz-opt" data-k="'+a[1]+'">'+a[0]+'</button>'; });
    box.innerHTML=h+'</div>';
    box.querySelectorAll('.quiz-opt').forEach(function(b){
      b.addEventListener('click',function(){
        quizScore[b.getAttribute('data-k')]++; quizStep++; renderQuiz();
      });
    });
  } else {
    if(bar) bar.style.width='100%';
    var best='study', mx=-1;
    for(var k in quizScore){ if(quizScore[k]>mx){ mx=quizScore[k]; best=k; } }
    var r=Q.r[best];
    box.innerHTML='<div class="quiz-result"><div class="rico">'+r[0]+'</div>'+
      '<div class="eyebrow" style="margin-bottom:4px"><b></b><span>'+Q.res+'</span></div>'+
      '<h3 class="gt">'+r[1]+'</h3><p>'+r[2]+'</p>'+
      '<a class="btn grad mag" href="'+r[3]+'">'+Q.view+'</a>'+
      '<br><button class="quiz-restart" id="qagain">'+Q.again+'</button></div>';
    var ag=document.getElementById('qagain');
    if(ag) ag.addEventListener('click',function(){
      quizStep=0; quizScore={study:0,work:0,lang:0}; renderQuiz();
    });
  }
}
var qio=new IntersectionObserver(function(en){
  en.forEach(function(x){ if(x.isIntersecting&&!quizStarted){ quizStarted=true; renderQuiz(); qio.unobserve(x.target); } });
},{threshold:0.25});
var qEl=document.getElementById('quiz'); if(qEl) qio.observe(qEl);

/* ================= sakura petals ================= */
function petals(){
  var cv=document.getElementById('petals'); if(!cv||reduce) return;
  var ctx=cv.getContext('2d'), P=[], W=0, H=0;
  function size(){ var r=cv.parentElement.getBoundingClientRect();
    var dpr=Math.min(window.devicePixelRatio||1,2);
    W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr;
    cv.style.width=W+'px'; cv.style.height=H+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); }
  size(); window.addEventListener('resize',size);
  for(var i=0;i<22;i++) P.push({
    x:Math.random()*W, y:Math.random()*H, s:5+Math.random()*6,
    vy:0.35+Math.random()*0.7, vx:-0.3+Math.random()*0.6,
    rot:Math.random()*6.28, vr:-0.025+Math.random()*0.05, o:0.35+Math.random()*0.45
  });
  function draw(x,y,s,rot,o){
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.globalAlpha=o;
    var g=ctx.createLinearGradient(-s,-s,s,s);
    g.addColorStop(0,'#ffd0e0'); g.addColorStop(1,'#ff9ec4');
    ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(0,0);
    ctx.bezierCurveTo(s*0.5,-s*0.5,s,-s*0.2,s,s*0.3);
    ctx.bezierCurveTo(s,s*0.7,s*0.4,s,0,s*0.8);
    ctx.bezierCurveTo(-s*0.4,s,-s,s*0.7,-s,s*0.3);
    ctx.bezierCurveTo(-s,-s*0.2,-s*0.5,-s*0.5,0,0);
    ctx.fill(); ctx.restore();
  }
  (function loop(){
    ctx.clearRect(0,0,W,H);
    P.forEach(function(p){
      p.y+=p.vy; p.x+=p.vx+Math.sin(p.y*0.018)*0.35; p.rot+=p.vr;
      if(p.y>H+14){ p.y=-14; p.x=Math.random()*W; }
      if(p.x>W+14) p.x=-14; if(p.x<-14) p.x=W+14;
      draw(p.x,p.y,p.s,p.rot,p.o);
    });
    requestAnimationFrame(loop);
  })();
}

/* ================= holographic Fuji (Three.js r128) ================= */
function fuji(){
  var cv=document.getElementById('fuji');
  if(!cv || typeof THREE==='undefined') return;
  try{
    var host=cv.parentElement, b=host.getBoundingClientRect();
    var renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.setSize(b.width,b.height,false);
    var scene=new THREE.Scene();
    var cam=new THREE.PerspectiveCamera(42,b.width/b.height,0.1,120);
    cam.position.set(0,1.7,9.4); cam.lookAt(0,1.2,0);

    scene.add(new THREE.AmbientLight(0xffffff,0.7));
    var d1=new THREE.DirectionalLight(0x4de3ff,1.1); d1.position.set(-5,5,5); scene.add(d1);
    var d2=new THREE.DirectionalLight(0x9d7cff,0.9); d2.position.set(5,3,3); scene.add(d2);

    var grp=new THREE.Group(); scene.add(grp);

    /* glowing sun disc */
    var sun=new THREE.Mesh(new THREE.CircleGeometry(1.55,56),
      new THREE.MeshBasicMaterial({color:0xff5b47,transparent:true,opacity:0.85}));
    sun.position.set(2.5,3.2,-5); grp.add(sun);
    var halo=new THREE.Mesh(new THREE.RingGeometry(1.6,2.5,56),
      new THREE.MeshBasicMaterial({color:0xff5b47,transparent:true,opacity:0.14,side:THREE.DoubleSide}));
    halo.position.copy(sun.position); grp.add(halo);

    /* mountain — solid translucent body */
    var body=new THREE.Mesh(new THREE.ConeGeometry(3.4,3.7,7,1,true),
      new THREE.MeshStandardMaterial({color:0x14243f,flatShading:true,roughness:0.85,metalness:0.15,
        transparent:true,opacity:0.92,side:THREE.DoubleSide}));
    body.position.y=0.15; grp.add(body);

    /* wireframe overlay — holographic look */
    var wire=new THREE.Mesh(new THREE.ConeGeometry(3.44,3.74,7,5,true),
      new THREE.MeshBasicMaterial({color:0x4de3ff,wireframe:true,transparent:true,opacity:0.3}));
    wire.position.y=0.15; grp.add(wire);

    /* snow cap */
    var cap=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.3,7,1,true),
      new THREE.MeshStandardMaterial({color:0xeef5ff,flatShading:true,roughness:0.55,
        emissive:0x4de3ff,emissiveIntensity:0.22,side:THREE.DoubleSide}));
    cap.position.y=1.4; grp.add(cap);

    /* orbiting rings */
    var rings=[];
    for(var i=0;i<3;i++){
      var rg=new THREE.Mesh(new THREE.TorusGeometry(2.6+i*0.55,0.012,8,90),
        new THREE.MeshBasicMaterial({color:i===1?0x9d7cff:(i===2?0xffd479:0x4de3ff),transparent:true,opacity:0.5-i*0.1}));
      rg.rotation.x=Math.PI/2.1+i*0.12; rg.position.y=-0.85-i*0.16;
      grp.add(rg); rings.push(rg);
    }

    /* particle field */
    var pc=260, pos=new Float32Array(pc*3);
    for(var j=0;j<pc;j++){
      var a=Math.random()*Math.PI*2, rad=2.2+Math.random()*4.2;
      pos[j*3]=Math.cos(a)*rad;
      pos[j*3+1]=-1.4+Math.random()*5.6;
      pos[j*3+2]=Math.sin(a)*rad;
    }
    var pg=new THREE.BufferGeometry();
    pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
    var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9fd8ff,size:0.045,transparent:true,opacity:0.65}));
    grp.add(pts);

    /* mouse parallax */
    var tx=0,ty=0,mx=0,my=0;
    var stage=document.getElementById('stage');
    if(stage&&!reduce){
      stage.addEventListener('mousemove',function(e){
        var r=host.getBoundingClientRect();
        tx=((e.clientX-r.left)/r.width-0.5)*0.55;
        ty=((e.clientY-r.top)/r.height-0.5)*0.32;
      });
      stage.addEventListener('mouseleave',function(){ tx=0; ty=0; });
    }
    function resize(){
      var n=host.getBoundingClientRect();
      renderer.setSize(n.width,n.height,false);
      cam.aspect=n.width/n.height; cam.updateProjectionMatrix();
    }
    window.addEventListener('resize',resize);

    var t=0;
    (function render(){
      t+=0.005;
      mx+=(tx-mx)*0.055; my+=(ty-my)*0.055;
      grp.rotation.y=Math.sin(t)*0.16+mx;
      grp.rotation.x=my*0.42;
      grp.position.y=Math.sin(t*1.25)*0.09;
      wire.rotation.y=t*0.26;
      pts.rotation.y=-t*0.13;
      rings.forEach(function(r,i){ r.rotation.z=t*(0.3+i*0.16)*(i%2?-1:1); });
      halo.scale.setScalar(1+Math.sin(t*2)*0.045);
      renderer.render(scene,cam);
      requestAnimationFrame(render);
    })();
  }catch(e){ /* no WebGL — hero still works */ }
}

/* ================= SSW sector detail modal (visa-ssw page) ================= */
(function(){
  var modal=document.getElementById('secModal'); if(!modal) return;
  var mjp=modal.querySelector('.mjp'), mtitle=modal.querySelector('.mtitle'),
      mdesc=modal.querySelector('.mdesc'), mtasks=modal.querySelector('.mtasks');
  function lang(){ return document.documentElement.getAttribute('data-lang')||'en'; }
  function open(sec){
    var L=lang(), jp=sec.querySelector('.jp'), h=sec.querySelector('h3');
    if(mjp) mjp.textContent=jp?jp.textContent:'';
    if(mtitle) mtitle.textContent=h?h.textContent:'';
    if(mdesc) mdesc.textContent=sec.getAttribute('data-desc-'+L)||sec.getAttribute('data-desc-en')||'';
    if(mtasks){
      var tasks=(sec.getAttribute('data-tasks-'+L)||sec.getAttribute('data-tasks-en')||'').split('|').filter(Boolean);
      mtasks.innerHTML='';
      tasks.forEach(function(x){ var li=document.createElement('li'); li.textContent=x; mtasks.appendChild(li); });
    }
    modal.classList.add('open'); document.body.style.overflow='hidden';
  }
  function close(){ modal.classList.remove('open'); document.body.style.overflow=''; }
  document.querySelectorAll('.sec').forEach(function(s){ s.addEventListener('click',function(){ open(s); }); });
  var ov=modal.querySelector('.ov'), x=modal.querySelector('.x');
  if(ov) ov.addEventListener('click',close);
  if(x) x.addEventListener('click',close);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&modal.classList.contains('open')) close(); });
})();

/* ================= video play / sound toggles ================= */
document.querySelectorAll('.videowrap').forEach(function(w){
  var v=w.querySelector('video'); if(!v) return;
  var play=w.querySelector('.play'), un=w.querySelector('.unmute');
  if(play) play.addEventListener('click',function(){
    if(v.paused){ v.play(); play.textContent='❚❚'; } else { v.pause(); play.textContent='▶'; }
  });
  if(un) un.addEventListener('click',function(){
    v.muted=!v.muted; un.textContent=v.muted?'🔇':'🔊';
  });
});

/* ================= scroll progress + back to top ================= */
var prog=document.createElement('div'); prog.className='scrollprog'; document.body.appendChild(prog);
var top=document.createElement('button'); top.className='totop'; top.setAttribute('aria-label','Back to top'); top.textContent='↑';
top.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });
document.body.appendChild(top);
window.addEventListener('scroll',function(){
  var h=document.documentElement;
  var sc=h.scrollTop/Math.max(h.scrollHeight-h.clientHeight,1);
  prog.style.width=(sc*100)+'%';
  top.classList.toggle('show',h.scrollTop>520);
},{passive:true});

/* ================= init ================= */
var saved='en'; try{ saved=localStorage.getItem(LANG_KEY)||'en'; }catch(e){}
applyLang(saved);
petals();
fuji();
})();
