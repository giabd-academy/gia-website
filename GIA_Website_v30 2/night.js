/* v29: soft reveal-on-scroll for cards (all pages) */
(function(){ if(!("IntersectionObserver" in window)) return;
  var els=document.querySelectorAll(".bt,.cc,.fc,.card,.sec,.ccard,.tool-card,.blog-card,.founder,.tl-card,.faq details,.head");
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); },{threshold:.12});
  els.forEach(function(el,i){ if(el.closest(".dh")) return; el.classList.add("nv-rv"); el.style.transitionDelay=(i%4)*60+"ms"; io.observe(el); });
})();
