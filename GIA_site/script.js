
document.addEventListener('DOMContentLoaded',function(){
  var els=[].slice.call(document.querySelectorAll('.card,.ccard,.founder,.head,.tlrow,.panel,.pricebox,.cta,.vframe,.videowrap'));
  els.forEach(function(e){e.classList.add('reveal');});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.12});els.forEach(function(e){io.observe(e);});}else{els.forEach(function(e){e.classList.add('in');});}
  var cs=[].slice.call(document.querySelectorAll('[data-count]'));
  function run(el){var t=parseFloat(el.getAttribute('data-count'))||0,suf=el.getAttribute('data-suf')||'',st=performance.now(),d=1500;function s(n){var p=Math.min(1,(n-st)/d),e=1-Math.pow(1-p,3),v=Math.floor(t*e);if(p>=1)v=t;el.textContent=v.toLocaleString('en-IN')+suf;if(p<1)requestAnimationFrame(s);}requestAnimationFrame(s);}
  if('IntersectionObserver' in window){var co=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){run(x.target);co.unobserve(x.target);}});},{threshold:.4});cs.forEach(function(c){co.observe(c);});}else{cs.forEach(run);}
  var menu=document.getElementById('m');if(menu)menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');});});
});

/* ===== Language switch: English / 日本語 / বাংলা ===== */
(function(){
  function apply(lang){
    document.documentElement.setAttribute('data-lang',lang);
    document.querySelectorAll('[data-en]').forEach(function(el){
      var v=el.getAttribute('data-'+lang); if(v!==null) el.textContent=v;
    });
    document.querySelectorAll('[data-en-ph]').forEach(function(el){
      var v=el.getAttribute('data-'+lang+'-ph'); if(v!==null) el.setAttribute('placeholder',v);
    });
    document.querySelectorAll('.langbtn').forEach(function(b){
      b.classList.toggle('on', b.getAttribute('data-l')===lang);
    });
    try{localStorage.setItem('gia_lang',lang);}catch(e){}
  }
  function init(){
    document.querySelectorAll('.langbtn').forEach(function(b){
      b.addEventListener('click',function(){apply(b.getAttribute('data-l'));});
    });
    var saved='en'; try{saved=localStorage.getItem('gia_lang')||'en';}catch(e){}
    apply(saved);
  }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
})();

/* ===== SSW sector detail modal ===== */
(function(){
  var modal=document.getElementById('secModal');
  if(!modal) return;
  var mjp=modal.querySelector('.mjp'),mtitle=modal.querySelector('.mtitle'),mdesc=modal.querySelector('.mdesc'),mtasks=modal.querySelector('.mtasks');
  function lang(){return document.documentElement.getAttribute('data-lang')||'en';}
  function open(sec){
    var L=lang(),jp=sec.querySelector('.jp'),h=sec.querySelector('h3');
    mjp.textContent=jp?jp.textContent:'';
    mtitle.textContent=h?h.textContent:'';
    mdesc.textContent=sec.getAttribute('data-desc-'+L)||sec.getAttribute('data-desc-en')||'';
    var tasks=(sec.getAttribute('data-tasks-'+L)||sec.getAttribute('data-tasks-en')||'').split('|').filter(Boolean);
    mtasks.innerHTML='';
    tasks.forEach(function(x){var li=document.createElement('li');li.textContent=x;mtasks.appendChild(li);});
    modal.classList.add('open');document.body.style.overflow='hidden';
  }
  function close(){modal.classList.remove('open');document.body.style.overflow='';}
  document.querySelectorAll('.sec').forEach(function(s){s.addEventListener('click',function(){open(s);});});
  modal.querySelector('.ov').addEventListener('click',close);
  modal.querySelector('.x').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('open'))close();});
})();
