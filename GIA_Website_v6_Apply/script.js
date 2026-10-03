
document.addEventListener('DOMContentLoaded',function(){
  var els=[].slice.call(document.querySelectorAll('.card,.ccard,.founder,.head,.tlrow,.panel,.pricebox,.cta,.vframe,.videowrap'));
  els.forEach(function(e){e.classList.add('reveal');});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.12});els.forEach(function(e){io.observe(e);});}else{els.forEach(function(e){e.classList.add('in');});}
  var cs=[].slice.call(document.querySelectorAll('[data-count]'));
  function run(el){var t=parseFloat(el.getAttribute('data-count'))||0,suf=el.getAttribute('data-suf')||'',st=performance.now(),d=1500;function s(n){var p=Math.min(1,(n-st)/d),e=1-Math.pow(1-p,3),v=Math.floor(t*e);if(p>=1)v=t;el.textContent=v.toLocaleString('en-IN')+suf;if(p<1)requestAnimationFrame(s);}requestAnimationFrame(s);}
  if('IntersectionObserver' in window){var co=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){run(x.target);co.unobserve(x.target);}});},{threshold:.4});cs.forEach(function(c){co.observe(c);});}else{cs.forEach(run);}
  var menu=document.getElementById('m');if(menu)menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');});});
});
