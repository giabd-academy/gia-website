/* v28 dark hero: floating glyphs + course switcher (all courses equal) */
(function(){
  var dh=document.getElementById("dh"); if(!dh) return;
  var lang=function(){ try{ return localStorage.getItem("gia_lang")||document.documentElement.lang||"en"; }catch(e){ return "en"; } };
  var C=[
    {k:"JLPT N5",h:"course-n5.html",en:["Beginner · Starter","3–6 months"],bn:["শুরু থেকে","৩–৬ মাস"],ja:["初級 · 入門","3〜6か月"]},
    {k:"JLPT N4",h:"course-n4.html",en:["Foundation","4–6 months"],bn:["ফাউন্ডেশন","৪–৬ মাস"],ja:["基礎","4〜6か月"]},
    {k:"JLPT N3",h:"course-n3.html",en:["Preparation","6–8 months"],bn:["প্রস্তুতি","৬–৮ মাস"],ja:["準備","6〜8か月"]},
    {k:"JLPT N2",h:"course-n2.html",en:["Advanced","On request"],bn:["অ্যাডভান্সড","চাহিদা অনুযায়ী"],ja:["上級","応相談"]},
    {k:"JFT-Basic",h:"course-jft.html",en:["SSW / Job track","3–6 months"],bn:["SSW / চাকরি","৩–৬ মাস"],ja:["特定技能 / 就職","3〜6か月"]},
    {k:"Kaiwa",h:"course-kaiwa.html",en:["Speaking & interview","Ongoing"],bn:["কথা বলা ও ইন্টারভিউ","চলমান"],ja:["会話・面接","随時"]},
    {k:"Student Visa",h:"visa-ssw.html",en:["Admission · COE · visa","Full support"],bn:["ভর্তি · COE · ভিসা","পূর্ণ সহায়তা"],ja:["入学 · COE · ビザ","フルサポート"]},
    {k:"SSW",h:"visa-ssw.html",en:["Work in Japan","Full support"],bn:["জাপানে কাজ","পূর্ণ সহায়তা"],ja:["日本で働く","フルサポート"]}
  ], i=0;
  var box=document.getElementById("dhCourses"), info=document.getElementById("dhInfo");
  box.innerHTML=C.map(function(c,j){return '<button type="button" role="tab" data-i="'+j+'">'+c.k+'</button>';}).join("");
  var VIEW={en:"View course →",bn:"কোর্স দেখুন →",ja:"コースを見る →"};
  function set(n){ i=(n+C.length)%C.length; var c=C[i], L=lang(), t=c[L]||c.en;
    info.href=c.h; info.innerHTML='<span><b>'+c.k+'</b> · '+t[0]+'</span><span>⏱ '+t[1]+'</span><em>'+(VIEW[L]||VIEW.en)+'</em>';
    document.getElementById("dhOrbL").textContent=C[(i-1+C.length)%C.length].k; document.getElementById("dhOrbR").textContent=C[(i+1)%C.length].k;
    box.querySelectorAll("button").forEach(function(b){ var on=+b.dataset.i===i; b.classList.toggle("on",on); b.setAttribute("aria-selected",on); }); }
  box.addEventListener("click",function(e){ var b=e.target.closest("button"); if(b){ set(+b.dataset.i); stop(); } });
  dh.querySelectorAll(".dhOrb").forEach(function(b){ b.onclick=function(){ set(i+ +b.dataset.go); stop(); }; });
  document.querySelectorAll(".langbtn").forEach(function(b){ b.addEventListener("click",function(){ setTimeout(function(){ set(i); },30); }); });
  var auto=setInterval(function(){ set(i+1); },4000); function stop(){ clearInterval(auto); }
  set(0);
  /* glyphs */
  var W=["あ","カ","日本","学","N5","N4","N3","JFT","✈ DAC→NRT","🌸","さくら","ビザ","がんばって","漢字","SSW","語","夢","東京","COE ✓","合格","会話"];
  var gb=document.getElementById("dhGlyphs"), spot=document.getElementById("dhSpot"), N=window.innerWidth<700?12:24, G=[], mx=-999, my=-999;
  for(var k=0;k<N;k++){ var e=document.createElement("span"), t=W[k%W.length]; e.textContent=t;
    e.className="dhGl"+(/[぀-ヿ一-龯]/.test(t)?" jp":"")+(k%5===0?" box":"")+(k%7===0?" hi":""); e.style.fontSize=(14+Math.random()*24)+"px"; gb.appendChild(e);
    G.push({e:e,x:Math.random(),y:Math.random()*.8,vx:(Math.random()-.5)*.00025,vy:(Math.random()-.5)*.00025-.00006,r:Math.random()*20-10,vr:(Math.random()-.5)*.02,ox:0,oy:0}); }
  var vis=true; if("IntersectionObserver" in window) new IntersectionObserver(function(es){ vis=es[0].isIntersecting; }).observe(dh);
  var red=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  function tick(){ if(vis&&!red){ var w=dh.clientWidth,h=dh.clientHeight;
      G.forEach(function(g){ g.x+=g.vx; g.y+=g.vy; g.r+=g.vr; if(g.x<-.08)g.x=1.05; if(g.x>1.08)g.x=-.05; if(g.y<-.08)g.y=.85; if(g.y>.9)g.y=-.05;
        var px=g.x*w, py=g.y*h, dx=px-mx, dy=py-my, d=Math.sqrt(dx*dx+dy*dy)||1, tx=0, ty=0; if(d<160){ var f=(160-d)/160*40; tx=dx/d*f; ty=dy/d*f; }
        g.ox+=(tx-g.ox)*.08; g.oy+=(ty-g.oy)*.08; g.e.style.transform="translate3d("+(px+g.ox)+"px,"+(py+g.oy)+"px,0) rotate("+g.r+"deg)"; }); }
    requestAnimationFrame(tick); }
  G.forEach(function(g){ g.e.style.transform="translate3d("+(g.x*dh.clientWidth)+"px,"+(g.y*dh.clientHeight)+"px,0)"; }); tick();
  dh.addEventListener("pointermove",function(ev){ var r=dh.getBoundingClientRect(); mx=ev.clientX-r.left; my=ev.clientY-r.top; spot.style.left=mx+"px"; spot.style.top=my+"px"; });
  dh.addEventListener("pointerleave",function(){ mx=my=-999; spot.style.left="50%"; spot.style.top="40%"; });
})();
