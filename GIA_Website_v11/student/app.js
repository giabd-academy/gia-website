var sha256=function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;n<64;p++)if(!o[p]){for(d=0;d<313;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;d<64;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=d<16?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;d<8;d++)l[d]=l[d]+r[d]|0}for(d=0;d<8;d++)for(e=3;e+1;e--){var y=l[d]>>e*8&255;i+=(y<16?0:"")+y.toString(16)}return i};
function _utf8(t){try{return unescape(encodeURIComponent(t));}catch(e){return String(t);}}
/* ===== GIA Student app ===== */
(function(){
"use strict";
var CFG={apiKey:"AIzaSyAQRyQkxjAWEwgh5nn11Bmo72ke9-bYciQ",authDomain:"gia-erp.firebaseapp.com",projectId:"gia-erp",storageBucket:"gia-erp.firebasestorage.app",messagingSenderId:"951435359568",appId:"1:951435359568:web:347edd9a6364611e83e855"};
var PHONE="+8801830150171", WA="8801830150171", SITE="../";
var LS={key:"gia_stu_key",cache:"gia_stu_cache",notices:"gia_stu_notices",lang:"gia_stu_lang",seen:"gia_stu_seen"};
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
var T={
 en:{sid:"Student ID",phone:"Phone number (given at admission)",login:"Log in",loginSub:"Galaxy International Academy",loginHint:"Only you can see your own information. Problem? Call the office.",offline:"Offline — showing last saved data",install:"Install app",
  home:"Home",fees:"Fees",att:"Attendance",tests:"Tests",notices:"Notices",more:"More",
  hello:"Hello",totalFee:"Total fee",paid:"Paid",due:"Due",paidPct:"of fee paid",attendance:"Attendance",nextInst:"Next installment",none:"Nothing yet",
  inst:"Installments",payHist:"Payment history",receipt:"Receipt",cls:"My class",teacher:"Teacher",shift:"Shift / time",start:"Start date",course:"Course",batch:"Batch",enroll:"Admission date",
  present:"Present",late:"Late",absent:"Absent",total:"Total classes",recent:"Recent classes",
  myTests:"My exams",progress:"My progress",jlpt:"JLPT / exam",visa:"Visa",app:"School application",docs:"Documents",stage:"Stage",
  noNotice:"No notices right now",tools:"Study tools",mock:"JLPT N5 mock test",check:"Document checklist",elig:"Eligibility check",web:"Website",
  contact:"Contact office",call:"Call",wa:"WhatsApp",logout:"Log out",updated:"Updated",errNF:"Student ID or phone number did not match. Use the phone number you gave at admission.",errNet:"Could not connect. Check internet and try again.",errFill:"Enter Student ID and phone number",
  overdue:"Overdue",pending:"Pending",paidS:"Paid",lang:"বাংলা",waitMsg:"Loading…",allStu:"All students",pinned:"Pinned"},
 bn:{sid:"স্টুডেন্ট আইডি",phone:"ফোন নম্বর (ভর্তির সময় দেওয়া)",login:"লগইন",loginSub:"গ্যালাক্সি ইন্টারন্যাশনাল একাডেমি",loginHint:"শুধু আপনি আপনার তথ্য দেখতে পারবেন। সমস্যা হলে অফিসে কল করুন।",offline:"অফলাইন — শেষ সেভ করা তথ্য দেখানো হচ্ছে",install:"অ্যাপ ইনস্টল",
  home:"হোম",fees:"ফি",att:"উপস্থিতি",tests:"পরীক্ষা",notices:"নোটিশ",more:"আরও",
  hello:"স্বাগতম",totalFee:"মোট ফি",paid:"পরিশোধ",due:"বকেয়া",paidPct:"ফি পরিশোধ হয়েছে",attendance:"উপস্থিতি",nextInst:"পরের কিস্তি",none:"এখনো কিছু নেই",
  inst:"কিস্তি",payHist:"পেমেন্টের ইতিহাস",receipt:"রসিদ",cls:"আমার ক্লাস",teacher:"শিক্ষক",shift:"শিফট / সময়",start:"শুরুর তারিখ",course:"কোর্স",batch:"ব্যাচ",enroll:"ভর্তির তারিখ",
  present:"উপস্থিত",late:"দেরি",absent:"অনুপস্থিত",total:"মোট ক্লাস",recent:"সাম্প্রতিক ক্লাস",
  myTests:"আমার পরীক্ষা",progress:"আমার অগ্রগতি",jlpt:"JLPT / পরীক্ষা",visa:"ভিসা",app:"স্কুলে আবেদন",docs:"কাগজপত্র",stage:"ধাপ",
  noNotice:"এখন কোনো নোটিশ নেই",tools:"পড়ার টুলস",mock:"JLPT N5 মক টেস্ট",check:"কাগজপত্রের চেকলিস্ট",elig:"যোগ্যতা যাচাই",web:"ওয়েবসাইট",
  contact:"অফিসে যোগাযোগ",call:"কল",wa:"হোয়াটসঅ্যাপ",logout:"লগআউট",updated:"আপডেট",errNF:"স্টুডেন্ট আইডি বা ফোন নম্বর মেলেনি। ভর্তির সময় দেওয়া নম্বর দিন।",errNet:"সংযোগ হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।",errFill:"স্টুডেন্ট আইডি ও ফোন নম্বর দিন",
  overdue:"মেয়াদোত্তীর্ণ",pending:"বাকি",paidS:"পরিশোধিত",lang:"English",waitMsg:"লোড হচ্ছে…",allStu:"সব শিক্ষার্থী",pinned:"পিন করা"}
};
var lang=lsGet(LS.lang)||"en", tab="home", D=null, N=[], fdb=null;
function t(k){return (T[lang]&&T[lang][k])||T.en[k]||k;}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function money(n,cur){n=Number(n||0);var s=Math.round(n).toLocaleString("en-IN");return (cur&&cur!=="BDT"?cur+" ":"৳ ")+s;}
function digits(x){return String(x||"").replace(/[^0-9]/g,"");}
function keyOf(sid,phone){var d=digits(phone).slice(-10);if(!sid||d.length<6)return "";return sha256(_utf8("gia|"+String(sid).trim().toLowerCase()+"|"+d));}
function $(id){return document.getElementById(id);}
function today(){return new Date().toISOString().slice(0,10);}
function initFB(){if(fdb)return fdb;try{if(window.firebase){var app=firebase.apps.length?firebase.app():firebase.initializeApp(CFG);fdb=firebase.firestore(app);}}catch(e){}return fdb;}
function applyStatic(){document.documentElement.lang=lang==="bn"?"bn":"en";var els=document.querySelectorAll("[data-t]");for(var i=0;i<els.length;i++)els[i].textContent=t(els[i].getAttribute("data-t"));}
async function fetchDoc(k){var f=initFB();if(!f)throw new Error("net");var s=await f.collection("student_portal").doc(k).get();return s.exists?s.data():null;}
async function fetchNotices(){try{var f=initFB();if(!f)return null;var s=await f.collection("student_portal").doc("notices").get();return s.exists?(s.data().list||[]):[];}catch(e){return null;}}
async function login(){
  var sid=$("in_sid").value.trim(), ph=$("in_phone").value.trim(), er=$("lerr");er.textContent="";
  if(!sid||digits(ph).length<6){er.textContent=t("errFill");return;}
  var k=keyOf(sid,ph), b=$("btnLogin");b.disabled=true;b.textContent=t("waitMsg");
  try{var doc=await fetchDoc(k);if(!doc){er.textContent=t("errNF");return;}
    lsSet(LS.key,k);lsSet(LS.cache,JSON.stringify(doc));D=doc;var n=await fetchNotices();if(n){N=n;lsSet(LS.notices,JSON.stringify(n));}showMain();
  }catch(e){er.textContent=t("errNet");}
  finally{b.disabled=false;b.textContent=t("login");}
}
async function refresh(){
  var k=lsGet(LS.key);if(!k)return;
  try{var doc=await fetchDoc(k);if(!doc){logout();return;}D=doc;lsSet(LS.cache,JSON.stringify(doc));$("offline").hidden=true;}
  catch(e){$("offline").hidden=false;}
  var n=await fetchNotices();if(n){N=n;lsSet(LS.notices,JSON.stringify(n));}
  render();
}
function logout(){lsSet(LS.key,null);lsSet(LS.cache,null);lsSet(LS.notices,null);D=null;$("main").hidden=true;$("login").hidden=false;}
function myNotices(){var c=(dat().course||"");return (N||[]).filter(function(n){return !n.course||n.course===c;}).sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||String(b.date).localeCompare(String(a.date));});}
function dat(){return (D&&D.data)||{};}
function unseen(){var s=lsGet(LS.seen)||"";return myNotices().filter(function(n){return n.date>s;}).length;}
var TABS=[["home","🏠"],["fees","💳"],["att","📅"],["notices","📢"],["more","☰"]];
function showMain(){$("login").hidden=true;$("main").hidden=false;render();}
function render(){
  var d=dat();applyStatic();
  $("hName").textContent=d.name||(D&&D.name)||"—";
  $("hSub").textContent=[d.sid||(D&&D.sid),d.course].filter(Boolean).join(" · ");
  var u=unseen();
  $("tabs").innerHTML=TABS.map(function(x){return '<button class="'+(tab===x[0]?"on":"")+'" data-tab="'+x[0]+'"><i>'+x[1]+'</i><span>'+t(x[0])+(x[0]==="notices"&&u?'<span class="badge">'+u+'</span>':'')+'</span></button>';}).join("");
  var bs=$("tabs").querySelectorAll("button");for(var i=0;i<bs.length;i++)bs[i].onclick=function(){go(this.getAttribute("data-tab"));};
  var v=$("view");
  if(!D.data){v.innerHTML=legacy();return;}
  v.innerHTML=({home:vHome,fees:vFees,att:vAtt,notices:vNotices,more:vMore}[tab]||vHome)();
  var lo=$("btnOut");if(lo)lo.onclick=logout;
}
function go(x){tab=x;if(x==="notices")lsSet(LS.seen,today());render();window.scrollTo(0,0);}
function instState(i){var s=String(i.status||"").toLowerCase();if(s==="paid")return["p-ok",t("paidS")];if(i.due&&i.due<today())return["p-bad",t("overdue")];return["p-warn",t("pending")];}
function nextInst(d){var L=(d.installments||[]).filter(function(i){return String(i.status).toLowerCase()!=="paid";}).sort(function(a,b){return String(a.due).localeCompare(String(b.due));});return L[0];}
function vHome(){
  var d=dat(),a=d.attendance||{},pct=d.fee?Math.min(100,Math.round(d.paid/d.fee*100)):0,ni=nextInst(d),nn=myNotices().slice(0,2);
  return '<div class="card hero"><h2>'+t("hello")+', '+esc((d.name||"").split(" ")[0])+' 👋</h2><p>'+esc([d.course,d.batch].filter(Boolean).join(" · "))+'</p>'+
   '<div class="stats"><div class="stat"><b>'+money(d.fee,d.currency)+'</b><span>'+t("totalFee")+'</span></div><div class="stat"><b>'+money(d.paid,d.currency)+'</b><span>'+t("paid")+'</span></div><div class="stat"><b>'+money(d.due,d.currency)+'</b><span>'+t("due")+'</span></div></div></div>'+
   '<div class="card"><h3>💳 '+pct+'% '+t("paidPct")+'</h3><div class="bar"><i style="width:'+pct+'%"></i></div>'+
   (ni?'<div class="row"><div>'+t("nextInst")+'<small>'+esc(ni.title)+' · '+esc(ni.due)+'</small></div><b>'+money(ni.amount,d.currency)+'</b></div>':'')+'</div>'+
   '<div class="card"><h3>📅 '+t("attendance")+'</h3>'+(a.total?'<div class="bar"><i style="width:'+(a.pct||0)+'%;background:'+((a.pct||0)>=80?"var(--ok)":(a.pct||0)>=60?"var(--warn)":"var(--red)")+'"></i></div><div class="row"><span>'+(a.pct||0)+'%</span><small>'+t("present")+' '+a.present+' · '+t("late")+' '+a.late+' · '+t("absent")+' '+a.absent+'</small></div>':'<div class="empty">'+t("none")+'</div>')+'</div>'+
   (d.cls&&d.cls.name?'<div class="card"><h3>🏫 '+t("cls")+'</h3><div class="grid2">'+kv(t("batch"),d.cls.name)+kv(t("teacher"),d.cls.teacher)+kv(t("shift"),[d.cls.shift,d.cls.time].filter(Boolean).join(" "))+kv(t("start"),d.cls.start)+'</div></div>':'')+
   (nn.length?'<div class="card"><h3>📢 '+t("notices")+'</h3>'+nn.map(function(n){return '<div class="row"><div>'+(n.pin?"📌 ":"")+esc(n.title)+'<small>'+esc(n.date)+'</small></div></div>';}).join("")+'</div>':'')+
   '<div class="out">'+t("updated")+': '+esc(String(D.updatedAt||"").slice(0,16).replace("T"," "))+'</div>';
}
function kv(k,v){return '<div class="kv"><span>'+esc(k)+'</span>'+esc(v||"—")+'</div>';}
function vFees(){
  var d=dat(),I=d.installments||[],P=d.payments||[];
  return '<div class="card"><div class="grid2">'+kv(t("totalFee"),money(d.fee,d.currency))+kv(t("paid"),money(d.paid,d.currency))+kv(t("due"),money(d.due,d.currency))+kv(t("enroll"),d.enroll)+'</div></div>'+
   '<div class="card"><h3>🗓 '+t("inst")+'</h3>'+(I.length?I.map(function(i){var s=instState(i);return '<div class="row"><div>'+esc(i.title||"—")+'<small>'+esc(i.due)+'</small></div><div style="text-align:right"><b>'+money(i.amount,d.currency)+'</b><br><span class="pill '+s[0]+'">'+s[1]+'</span></div></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>'+
   '<div class="card"><h3>🧾 '+t("payHist")+'</h3>'+(P.length?P.map(function(p){return '<div class="row"><div>'+esc(p.date)+'<small>'+esc(p.method||"")+(p.receipt?' · '+t("receipt")+' '+esc(p.receipt):'')+'</small></div><b style="color:var(--ok)">'+money(p.amount,d.currency)+'</b></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>';
}
function vAtt(){
  var d=dat(),a=d.attendance||{},T2=d.tests||[];
  var st={Present:"P",Late:"L",Absent:"A"};
  return '<div class="card"><h3>📅 '+t("attendance")+(a.total?' — '+(a.pct||0)+'%':'')+'</h3><div class="grid2">'+kv(t("present"),a.present||0)+kv(t("late"),a.late||0)+kv(t("absent"),a.absent||0)+kv(t("total"),a.total||0)+'</div></div>'+
   '<div class="card"><h3>'+t("recent")+'</h3>'+((a.recent||[]).length?'<div class="dots">'+a.recent.slice().reverse().map(function(r){return '<div class="dot d-'+esc(r.status)+'" title="'+esc(r.date+" "+r.status)+'">'+(st[r.status]||"?")+'</div>';}).join("")+'</div><div class="out" style="margin-top:8px;text-align:left">P='+t("present")+' · L='+t("late")+' · A='+t("absent")+'</div>':'<div class="empty">'+t("none")+'</div>')+'</div>'+
   '<div class="card"><h3>📝 '+t("myTests")+'</h3>'+(T2.length?T2.map(function(x){var ok=/pass/i.test(x.status),bad=/fail/i.test(x.status);return '<div class="row"><div>'+esc([x.exam,x.level].filter(Boolean).join(" "))+'<small>'+esc(x.date)+(x.score?' · '+esc(x.score):'')+'</small></div><span class="pill '+(ok?"p-ok":bad?"p-bad":"p-mut")+'">'+esc(x.status||"—")+'</span></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>'+
   ((d.jlpt||d.visa||d.app||d.docs||d.stage)?'<div class="card"><h3>🎯 '+t("progress")+'</h3><div class="grid2">'+(d.stage?kv(t("stage"),d.stage):'')+(d.jlpt?kv(t("jlpt"),d.jlpt):'')+(d.docs?kv(t("docs"),d.docs):'')+(d.app?kv(t("app"),d.app):'')+(d.visa?kv(t("visa"),d.visa):'')+'</div></div>':'');
}
function vNotices(){
  var L=myNotices();
  return L.length?L.map(function(n){return '<div class="card notice'+(n.pin?" pin":"")+'"><b>'+(n.pin?"📌 ":"")+esc(n.title)+'</b><br><small>'+esc(n.date)+' · '+esc(n.course||t("allStu"))+'</small><p>'+esc(n.body)+'</p></div>';}).join(""):'<div class="card empty">'+t("noNotice")+'</div>';
}
function vMore(){
  return '<div class="card"><h3>📚 '+t("tools")+'</h3><div class="links"><a href="'+SITE+'n5-mock-test.html"><span>📝</span>'+t("mock")+'</a><a href="'+SITE+'checklist.html"><span>✅</span>'+t("check")+'</a><a href="'+SITE+'eligibility.html"><span>🎌</span>'+t("elig")+'</a><a href="'+SITE+'"><span>🌐</span>'+t("web")+'</a></div></div>'+
   '<div class="card"><h3>☎ '+t("contact")+'</h3><div class="links"><a href="tel:'+PHONE+'"><span>📞</span>'+t("call")+' '+PHONE+'</a><a href="https://wa.me/'+WA+'" target="_blank" rel="noopener"><span>💬</span>'+t("wa")+'</a></div></div>'+
   '<div class="card"><div class="grid2">'+kv(t("sid"),dat().sid||D.sid)+kv(t("course"),dat().course)+'</div></div>'+
   '<div class="out"><button id="btnOut">'+t("logout")+'</button></div>';
}
function legacy(){ /* doc synced by an older office version: show its HTML */
  var h=D.html||{};return '<div class="card">'+(h.i||"")+'</div><div class="card">'+(h.p||"")+'</div><div class="card">'+(h.a||"")+'</div><div class="out"><button id="btnOut">'+t("logout")+'</button></div>';
}
function toggleLang(){lang=lang==="en"?"bn":"en";lsSet(LS.lang,lang);applyStatic();if(D)render();}
var deferred=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;$("installBtn").hidden=false;});
async function install(){if(deferred){deferred.prompt();try{await deferred.userChoice;}catch(e){}deferred=null;$("installBtn").hidden=true;}}
window.GIA={toggleLang:toggleLang,refresh:refresh,install:install,_keyOf:keyOf,_state:function(){return {D:D,N:N,tab:tab};},go:go};
function boot(){
  applyStatic();
  $("btnLogin").onclick=login;
  $("in_phone").addEventListener("keydown",function(e){if(e.key==="Enter")login();});
  try{var q=new URLSearchParams(location.search).get("id");if(q)$("in_sid").value=q;}catch(e){}
  var k=lsGet(LS.key),c=lsGet(LS.cache);
  if(k&&c){try{D=JSON.parse(c);N=JSON.parse(lsGet(LS.notices)||"[]");}catch(e){D=null;}if(D){showMain();refresh();}}
  if(window.addEventListener){window.addEventListener("online",refresh);}
  try{if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});}catch(e){}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
