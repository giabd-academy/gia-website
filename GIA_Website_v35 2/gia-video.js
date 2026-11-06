/* GIA cinematic video player — controls never cover the video while it plays */
(function(){
  var I={play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    vol:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',
    mute:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4zm15.6 3 2.1-2.1-1.4-1.4-2.1 2.1-2.1-2.1-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 2.1-2.1 2.1 2.1 1.4-1.4z"/></svg>',
    fs:'<svg viewBox="0 0 24 24"><path d="M5 5h5V3H3v7h2zm9-2v2h5v5h2V3zM5 14H3v7h7v-2H5zm14 5h-5v2h7v-7h-2z"/></svg>'};
  function fmt(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}
  document.querySelectorAll("[data-gv]").forEach(function(f){
    var v=f.querySelector("video");if(!v)return;
    var big=f.querySelector(".gv-big"),pp=f.querySelector(".gv-pp"),pr=f.querySelector(".gv-prog"),bar=pr&&pr.querySelector("i"),tm=f.querySelector(".gv-time"),mu=f.querySelector(".gv-mute"),fs=f.querySelector(".gv-fs"),tap=f.querySelector(".gv-tap"),fl=f.querySelector(".gv-flash"),hideT;
    if(big)big.innerHTML=I.play;if(pp)pp.innerHTML=I.play;if(mu)mu.innerHTML=I.vol;if(fs)fs.innerHTML=I.fs;
    function ui(){f.classList.toggle("playing",!v.paused&&!v.ended);if(pp)pp.innerHTML=v.paused?I.play:I.pause;}
    function wake(){f.classList.add("show");clearTimeout(hideT);if(!v.paused)hideT=setTimeout(function(){f.classList.remove("show");},2200);}
    function flash(){if(!fl)return;fl.innerHTML=v.paused?I.pause:I.play;fl.classList.remove("on");void fl.offsetWidth;fl.classList.add("on");}
    function toggle(){if(v.paused||v.ended){var p=v.play();if(p&&p.catch)p.catch(function(){v.muted=true;if(mu)mu.innerHTML=I.mute;v.play();});}else v.pause();}
    if(big)big.addEventListener("click",function(e){e.stopPropagation();f.classList.add("started");toggle();});
    if(pp)pp.addEventListener("click",function(e){e.stopPropagation();toggle();wake();});
    if(tap)tap.addEventListener("click",function(){if(!f.classList.contains("started"))return;if(!v.paused&&!f.classList.contains("show")){wake();return;}flash();toggle();wake();});
    f.addEventListener("mousemove",function(){if(f.classList.contains("started"))wake();});
    v.addEventListener("play",function(){f.classList.add("started");ui();wake();});
    v.addEventListener("pause",function(){ui();f.classList.add("show");clearTimeout(hideT);});
    v.addEventListener("ended",function(){ui();f.classList.remove("started");f.classList.remove("show");});
    v.addEventListener("timeupdate",function(){if(bar)bar.style.width=((v.currentTime/(v.duration||1))*100)+"%";if(tm)tm.textContent=fmt(v.currentTime)+" / "+fmt(v.duration);});
    v.addEventListener("loadedmetadata",function(){if(tm)tm.textContent="0:00 / "+fmt(v.duration);});
    if(pr)pr.addEventListener("click",function(e){e.stopPropagation();var r=pr.getBoundingClientRect();if(v.duration)v.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*v.duration;wake();});
    if(mu)mu.addEventListener("click",function(e){e.stopPropagation();v.muted=!v.muted;mu.innerHTML=v.muted?I.mute:I.vol;wake();});
    if(fs)fs.addEventListener("click",function(e){e.stopPropagation();var el=f;if(document.fullscreenElement){document.exitFullscreen();return;}if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();});
    var io=("IntersectionObserver" in window)?new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting&&!v.paused)v.pause();});},{threshold:.15}):null;if(io)io.observe(f);
  });
})();
