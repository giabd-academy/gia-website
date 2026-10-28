/* ===== GIA Teacher app ===== */
(function(){
"use strict";
var CFG={apiKey:"AIzaSyAQRyQkxjAWEwgh5nn11Bmo72ke9-bYciQ",authDomain:"gia-erp.firebaseapp.com",projectId:"gia-erp",storageBucket:"gia-erp.firebasestorage.app",messagingSenderId:"951435359568",appId:"1:951435359568:web:347edd9a6364611e83e855"};
var LS={lang:"gia_t_lang",sel:"gia_t_sel",sound:"gia_t_sound"};
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
var T={
 en:{loginSub:"Approve student attendance, batch-wise",email:"Email",pw:"Password",login:"Log in",forgot:"Forgot password?",hint:"Use the email & password the office gave you. Never share your password.",install:"Install app",
  queue:"Pending",cls:"Class",report:"Report",me:"Me",mine:"My batches",all:"All",pending:"Pending",approved:"Approved",rejected:"Rejected",notYet:"Not yet",
  present:"Present",late:"Late",absent:"Absent",reject:"Reject",approveAll:"Approve all as Present",noPending:"All clear! No pending check-ins.",in:"In",out:"Out",minLate:"min late",noGps:"No GPS",far:"far",dateMis:"time mismatch",manual:"by teacher",
  rejectWhy:"Reason (student will see):",rejectDef:"Photo not clear / not in class",confirmAll:"Approve {0} students as Present?",saved:"Saved",errSave:"Could not save — check internet",
  newCI:"new check-in",tapCompare:"Tap photo to compare",selfie:"Selfie",regPhoto:"Registered photo",noReg:"No registered photo",close:"Close",
  month:"This month",total:"All time",students:"Students",notif:"Notifications",enable:"Enable",on:"On",sound:"Sound",logout:"Log out",help:"How it works",
  helpTxt:"Students check in with a live selfie from the GIA Student app. You see it here instantly (keep the app open — it rings and notifies). Check the face and the time, then tap Present / Late, or Reject. Students who forget can be marked from the Class tab. Approved attendance goes to the office system automatically.",
  errLogin:"Email or password is wrong",errAccess:"Your email does not have access yet. Ask the admin: Settings → Staff Users → set your login email.",errNet:"Could not connect",resetSent:"Password reset link sent to your email",enterEmail:"Enter your email first",
  welcome:"Welcome",swipeHint:"Swipe right = Present · left = Reject",avg:"Batch average",rank:"Top students",needHelp:"Needs attention",theme:"App theme",routine:"Class routine",next7:"Next 7 days",addChg:"Class off / Extra class",chgType:"Type",cOff:"Class off",cHol:"Holiday",cExtra:"Extra class",cTime:"Time change",date:"Date",time:"Time",reason:"Reason (students will see)",alsoPost:"Also post a notice to students",saveChg:"Save",upChg:"Upcoming changes",noSched:"Routine not set yet — ask the office (Class Schedule).",chgSaved:"Saved — students will see it",post:"Post",newPost:"New class post",toBatch:"To batch",allBatches:"All students",ptTitle:"Title",ptBody:"Message",addPhoto:"Add photo",pinTop:"Pin on top",publish:"Publish",myPosts:"My posts",posted:"Posted to students",noPosts:"No posts yet",del:"Delete",edit:"Edit",confirmDel:"Delete this post?",needTitle:"Write a title and message",leaves:"Leave requests",leave:"Leave",onLeave:"On leave",approve:"Approve",newLeave:"new leave request",leaveWhy:"Reason (student will see):",batchesN:"batches",today:"Today",lastSync:"Office data",noBatch:"No batch assigned to your name — showing all batches"},
 bn:{loginSub:"ব্যাচ অনুযায়ী শিক্ষার্থীর উপস্থিতি অনুমোদন",email:"ইমেইল",pw:"পাসওয়ার্ড",login:"লগইন",forgot:"পাসওয়ার্ড ভুলে গেছেন?",hint:"অফিস থেকে দেওয়া ইমেইল ও পাসওয়ার্ড দিন। পাসওয়ার্ড কাউকে দেবেন না।",install:"অ্যাপ ইনস্টল",
  queue:"অপেক্ষমাণ",cls:"ক্লাস",report:"রিপোর্ট",me:"আমি",mine:"আমার ব্যাচ",all:"সব",pending:"অপেক্ষমাণ",approved:"অনুমোদিত",rejected:"বাতিল",notYet:"এখনো না",
  present:"উপস্থিত",late:"দেরি",absent:"অনুপস্থিত",reject:"বাতিল",approveAll:"সবাইকে উপস্থিত দিন",noPending:"সব ঠিক! কোনো অপেক্ষমাণ চেক-ইন নেই।",in:"প্রবেশ",out:"বের",minLate:"মিনিট দেরি",noGps:"লোকেশন নেই",far:"দূরে",dateMis:"সময় মেলেনি",manual:"শিক্ষক দিয়েছেন",
  rejectWhy:"কারণ (শিক্ষার্থী দেখবে):",rejectDef:"ছবি পরিষ্কার না / ক্লাসে ছিল না",confirmAll:"{0} জনকে উপস্থিত দেবেন?",saved:"সেভ হয়েছে",errSave:"সেভ হয়নি — ইন্টারনেট দেখুন",
  newCI:"নতুন চেক-ইন",tapCompare:"মেলাতে ছবিতে ট্যাপ করুন",selfie:"সেলফি",regPhoto:"রেজিস্টার্ড ছবি",noReg:"রেজিস্টার্ড ছবি নেই",close:"বন্ধ",
  month:"এই মাস",total:"সর্বমোট",students:"শিক্ষার্থী",notif:"নোটিফিকেশন",enable:"চালু করুন",on:"চালু",sound:"শব্দ",logout:"লগআউট",help:"কীভাবে কাজ করে",
  helpTxt:"শিক্ষার্থী GIA Student অ্যাপ থেকে লাইভ সেলফি দিয়ে চেক-ইন করে। সাথে সাথে এখানে দেখাবে (অ্যাপ খোলা রাখুন — শব্দ ও নোটিফিকেশন আসবে)। মুখ ও সময় দেখে উপস্থিত / দেরি দিন, অথবা বাতিল করুন। কেউ ভুলে গেলে ক্লাস ট্যাব থেকে দিন। অনুমোদিত উপস্থিতি অটো অফিস সিস্টেমে চলে যায়।",
  errLogin:"ইমেইল বা পাসওয়ার্ড ভুল",errAccess:"আপনার ইমেইলে এখনো অ্যাক্সেস নেই। অ্যাডমিনকে বলুন: Settings → Staff Users-এ আপনার লগইন ইমেইল দিতে।",errNet:"সংযোগ হয়নি",resetSent:"পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে",enterEmail:"আগে ইমেইল লিখুন",
  welcome:"স্বাগতম",swipeHint:"ডানে সোয়াইপ = উপস্থিত · বামে = বাতিল",avg:"ব্যাচ গড়",rank:"সেরা শিক্ষার্থী",needHelp:"মনোযোগ দরকার",theme:"অ্যাপ থিম",routine:"ক্লাস রুটিন",next7:"আগামী ৭ দিন",addChg:"ক্লাস বন্ধ / অতিরিক্ত ক্লাস",chgType:"ধরন",cOff:"ক্লাস বন্ধ",cHol:"ছুটি",cExtra:"অতিরিক্ত ক্লাস",cTime:"সময় পরিবর্তন",date:"তারিখ",time:"সময়",reason:"কারণ (শিক্ষার্থীরা দেখবে)",alsoPost:"শিক্ষার্থীদের নোটিশও পাঠান",saveChg:"সেভ",upChg:"আসন্ন পরিবর্তন",noSched:"রুটিন এখনো সেট হয়নি — অফিসকে বলুন (Class Schedule)।",chgSaved:"সেভ হয়েছে — শিক্ষার্থীরা দেখবে",post:"পোস্ট",newPost:"নতুন ক্লাস পোস্ট",toBatch:"কোন ব্যাচে",allBatches:"সব শিক্ষার্থী",ptTitle:"শিরোনাম",ptBody:"বার্তা",addPhoto:"ছবি যোগ",pinTop:"উপরে পিন",publish:"পোস্ট করুন",myPosts:"আমার পোস্ট",posted:"শিক্ষার্থীদের কাছে পোস্ট হয়েছে",noPosts:"এখনো কোনো পোস্ট নেই",del:"মুছুন",edit:"এডিট",confirmDel:"এই পোস্ট মুছবেন?",needTitle:"শিরোনাম ও বার্তা লিখুন",leaves:"ছুটির আবেদন",leave:"ছুটি",onLeave:"ছুটিতে",approve:"অনুমোদন",newLeave:"নতুন ছুটির আবেদন",leaveWhy:"কারণ (শিক্ষার্থী দেখবে):",batchesN:"টি ব্যাচ",today:"আজ",lastSync:"অফিস ডেটা",noBatch:"আপনার নামে কোনো ব্যাচ নেই — সব ব্যাচ দেখানো হচ্ছে"}
};
var lang=lsGet(LS.lang)||"en";function t(k){return (T[lang]&&T[lang][k])||T.en[k]||k;}
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function ld(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function tsDate(x){if(!x)return null;if(typeof x.toDate==="function")return x.toDate();if(x.seconds)return new Date(x.seconds*1000);var d=new Date(x);return isNaN(d)?null:d;}
function hm(d){return d?d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"—";}
function norm(s){return String(s||"").toLowerCase().replace(/^(mr|mrs|ms|md|miss)\.?\s+/,"").replace(/[^a-z0-9ঀ-৿]+/g," ").trim();}
var SCHED={},CHGS=[],LEAVES=[],LUNSUB=null,LPRIMED=false,THUMBS={},app=null,auth=null,fdb=null,USER=null,R=null,NAME="",MY=[],KEYMAP={},SEL=lsGet(LS.sel)||"mine",DATE=ld(),REQS=[],UNSUB=null,PRIMED=false,TAB="queue",FRESH={},PHOTOS={},FOLLOW=true;
function init(){try{app=firebase.apps.length?firebase.app():firebase.initializeApp(CFG);auth=firebase.auth(app);fdb=firebase.firestore(app);}catch(e){}}
var THEMES=[["glass","Sakura Glass","linear-gradient(160deg,#062e27,#0f2544)","rgba(255,255,255,.75)"],["washi","Washi Zen","#f7f2e7","#1a1512"],["neo","Neo Tokyo","#07070d","linear-gradient(90deg,#ff2e88,#00e5ff)"],["clay","Origami Clay","#e9f7f1","#1d9e75"],["urushi","Urushi Gold","#0d0a08","linear-gradient(90deg,#b8902a,#e2c15a)"],["classic","Classic","#f2f6f5","#0e7c66"]];
function curTheme(){var v=lsGet("gia_t_theme")||"glass";return THEMES.some(function(x){return x[0]===v;})?v:"glass";}
function applyTheme(){var b=document.body,th=curTheme();["glass","t-washi","t-neo","t-clay","t-urushi"].forEach(function(c){b.classList.remove(c);});if(th==="glass")b.classList.add("glass");else if(th!=="classic")b.classList.add("t-"+th);}
function themePicker(){var cur=curTheme();return '<div class="card"><b>🎨 '+t("theme")+'</b><div class="thGrid">'+THEMES.map(function(x){return '<button class="thO'+(x[0]===cur?" on":"")+'" data-th="'+x[0]+'"><div class="thS" style="background:'+x[2]+'"><i style="top:10px;background:'+x[3]+'"></i><i style="top:27px;right:24px;background:'+x[3]+';opacity:.6"></i></div>'+x[1]+'</button>';}).join("")+'</div></div>';}
function applyStatic(){applyTheme();document.documentElement.lang=lang;var els=document.querySelectorAll("[data-t]");for(var i=0;i<els.length;i++)els[i].textContent=t(els[i].getAttribute("data-t"));}
function toast(m){var el=document.createElement("div");el.className="toast";el.textContent=m;document.body.appendChild(el);setTimeout(function(){el.remove();},3200);}
async function doLogin(){var em=$("in_email").value.trim(),pw=$("in_pw").value,er=$("lerr"),b=$("btnLogin");er.textContent="";if(!em||!pw)return;b.disabled=true;
  try{await auth.signInWithEmailAndPassword(em,pw);primeAudio();}catch(e){er.textContent=/network/i.test(e.code||"")?t("errNet"):t("errLogin");var c=document.querySelector(".lcard");c.classList.add("shake");setTimeout(function(){c.classList.remove("shake");},500);}
  finally{b.disabled=false;}}
async function forgot(){var em=$("in_email").value.trim();if(!em){$("lerr").textContent=t("enterEmail");return;}try{await auth.sendPasswordResetEmail(em);toast(t("resetSent"));}catch(e){$("lerr").textContent=t("errNet");}}
async function onUser(u){
  USER=u;if(!u){if(UNSUB){UNSUB();UNSUB=null;}if(LUNSUB){LUNSUB();LUNSUB=null;}$("main").hidden=true;$("login").hidden=false;return;}
  try{var s=await fdb.collection("gia_teach").doc("roster").get();R=s.exists?s.data():{teachers:{},batches:[]};}
  catch(e){$("lerr").textContent=/permission/i.test(String(e.code||e.message))?t("errAccess"):t("errNet");await auth.signOut();return;}
  NAME=(R.teachers||{})[String(u.email||"").toLowerCase()]||u.email;
  var n=norm(NAME);MY=(R.batches||[]).filter(function(b){var tn=norm(b.teacher);return tn&&n&&(tn===n||tn.indexOf(n)>=0||n.indexOf(tn)>=0);}).map(function(b){return b.name;});
  KEYMAP={};(R.batches||[]).forEach(function(b){(b.students||[]).forEach(function(s){if(s.key)KEYMAP[s.key]={s:s,b:b};});});
  if(SEL==="mine"&&!MY.length)SEL="all";
  loadSched();
  fdb.collection("gia_teach").doc("thumbs").get().then(function(x){THUMBS=(x.exists&&x.data().map)||{};render();}).catch(function(){});
  listenLeaves();
  $("login").hidden=true;$("main").hidden=false;$("fDate").value=DATE;listen();render();
}
function listenLeaves(){if(LUNSUB){LUNSUB();LUNSUB=null;}LPRIMED=false;var since=new Date();since.setDate(since.getDate()-7);
  LUNSUB=fdb.collection("leave_requests").where("date",">=",ld(since)).onSnapshot(function(sn){var prev={};LEAVES.forEach(function(r){prev[r.id]=1;});
    LEAVES=sn.docs.map(function(d){var x=d.data();x.id=d.id;return x;});var fresh=LEAVES.filter(function(r){return r.status==="Pending"&&!prev[r.id]&&inMine(r);});
    if(LPRIMED&&fresh.length){beep();toast("🌴 "+fresh.length+" "+t("newLeave")+": "+fresh.map(function(r){return sOf(r).name;}).join(", "));try{navigator.vibrate&&navigator.vibrate([100,60,100]);}catch(e){}}
    LPRIMED=true;badge();render();},function(){});}
async function decideLeave(id,st){var r=LEAVES.find(function(x){return x.id===id;});if(!r)return;var note="";if(st==="Rejected"){note=prompt(t("leaveWhy"),"");if(note===null)return;}
  var upd={status:st,note:note,by:NAME,byEmail:USER.email,at:new Date().toISOString()};try{await fdb.collection("leave_requests").doc(id).update(upd);Object.assign(r,upd);badge();render();}catch(e){toast(t("errSave"));}}
function leaveCard(r){var s=sOf(r),th=THUMBS[r.key];return '<div class="card req lvq"><div class="pics">'+(th?'<img src="'+th.d+'" alt="">':'<div class="noimg">🌴</div>')+'</div><div class="info"><b>'+esc(s.name)+'</b><div class="mut">'+esc(s.sid)+' · '+esc(bOf(r))+'</div><div>📅 <b>'+esc(r.date)+'</b></div><div class="mut" style="margin:4px 0">'+esc(r.reason||"")+'</div><div class="acts"><button class="btn sm" data-lv="'+esc(r.id)+'" data-m="Approved">✓ '+t("approve")+'</button><button class="btn sm bad" data-lv="'+esc(r.id)+'" data-m="Rejected">✗</button></div></div></div>';}
function listen(){
  if(UNSUB){UNSUB();UNSUB=null;}PRIMED=false;REQS=[];setLive(false);
  UNSUB=fdb.collection("att_requests").where("date","==",DATE).onSnapshot(function(sn){
    var prev={};REQS.forEach(function(r){prev[r.id]=r.status;});
    REQS=sn.docs.map(function(d){var x=d.data();x.id=d.id;return x;});
    var fresh=REQS.filter(function(r){return r.status==="Pending"&&!(r.id in prev)&&inMine(r);});
    if(PRIMED&&DATE===ld()&&fresh.length){fresh.forEach(function(r){FRESH[r.id]=1;});ring(fresh);}
    PRIMED=true;setLive(true);badge();render();
  },function(e){setLive(false);toast(t("errNet"));});
}
function setLive(on){var l=$("live");if(l){l.className="live"+(on?"":" off");l.textContent=on?"● LIVE":"○ …";}}
function bOf(r){var m=KEYMAP[r.key];return m?m.b.name:(r.batch||"");}
function sOf(r){var m=KEYMAP[r.key];return m?m.s:{name:r.name||"?",sid:r.sid||"",photoKey:""};}
function inMine(r){return !MY.length||MY.indexOf(bOf(r))>=0;}
function inSel(r){if(SEL==="all")return true;if(SEL==="mine")return inMine(r);return bOf(r)===SEL;}
function selBatches(){var all=(R.batches||[]);if(SEL==="all")return all;if(SEL==="mine")return all.filter(function(b){return MY.indexOf(b.name)>=0;});return all.filter(function(b){return b.name===SEL;});}
/* ---- notifications ---- */
var AC=null;function primeAudio(){try{var A=window.AudioContext||window.webkitAudioContext;if(A&&!AC)AC=new A();if(AC&&AC.state==="suspended")AC.resume();}catch(e){}}
function beep(){if(lsGet(LS.sound)==="0"||!AC)return;try{[0,.16].forEach(function(dl,i){var o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.frequency.value=i?1175:880;g.gain.setValueAtTime(.0001,AC.currentTime+dl);g.gain.exponentialRampToValueAtTime(.15,AC.currentTime+dl+.02);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+dl+.15);o.start(AC.currentTime+dl);o.stop(AC.currentTime+dl+.16);});}catch(e){}}
function ring(fresh){beep();try{navigator.vibrate&&navigator.vibrate([150,80,150]);}catch(e){}
  var body=fresh.map(function(r){return sOf(r).name+" ("+bOf(r)+")";}).join(", ");toast("📸 "+fresh.length+" "+t("newCI")+": "+body);
  try{if(window.Notification&&Notification.permission==="granted"){var opt={body:body,icon:"icon-192.png",badge:"icon-192.png",tag:"gia-att",renotify:true};if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(function(reg){reg.showNotification("📸 "+fresh.length+" "+t("newCI"),opt);});else new Notification("📸 "+fresh.length+" "+t("newCI"),opt);}}catch(e){}}
function badge(){var n=REQS.filter(function(r){return r.status==="Pending"&&inMine(r);}).length+LEAVES.filter(function(r){return r.status==="Pending"&&inMine(r);}).length;try{if(navigator.setAppBadge){n?navigator.setAppBadge(n):navigator.clearAppBadge();}}catch(e){}document.title=(n?"("+n+") ":"")+"GIA Teacher";}
/* ---- render ---- */
function lateBy(r){var b=KEYMAP[r.key]&&KEYMAP[r.key].b;var st=b&&b.start;var d=tsDate(r.inTs)||tsDate(r.inAt);if(st==null||!d)return 0;var lm=Number(R.lateMin)||15,v=d.getHours()*60+d.getMinutes()-st;return v>lm?v:0;}
function distTag(r){if(r.manual)return '<span class="tag">✍ '+t("manual")+'</span>';if(r.inDist==null)return '<span class="tag">📍 '+t("noGps")+'</span>';var d=Number(r.inDist),far=R.geo&&d>(Number(R.radius)||300);return '<span class="tag '+(far?"bad":"ok")+'">📍 '+(d>=1000?(d/1000).toFixed(1)+" km":Math.round(d)+" m")+(far?" "+t("far"):"")+'</span>';}
function render(){
  applyStatic();if(!R)return;
  $("hName").textContent=t("welcome")+", "+NAME;
  $("hSub").textContent=(MY.length?MY.length+" "+t("batchesN")+" · "+MY.join(", "):t("all"))+" · "+(DATE===ld()?t("today"):DATE);
  var pend=function(f){return REQS.filter(function(r){return r.status==="Pending"&&f(r);}).length;};
  var chips=[["mine",t("mine"),pend(inMine)],["all",t("all"),pend(function(){return true;})]].concat((R.batches||[]).map(function(b){return [b.name,b.name,pend(function(r){return bOf(r)===b.name;})];}));
  if(!MY.length)chips.shift();
  $("chips").innerHTML=chips.map(function(c){return '<button class="chip'+(SEL===c[0]?" on":"")+'" data-sel="'+esc(c[0])+'">'+esc(c[1])+(c[2]?'<span class="n">'+c[2]+'</span>':'')+'</button>';}).join("");
  var tp=pend(inSel);
  $("tabs").innerHTML=[["queue","⏳"],["cls","👥"],["post","📢"],["report","📊"],["me","⚙"]].map(function(x){return '<button class="'+(TAB===x[0]?"on":"")+'" data-tab="'+x[0]+'"><i>'+x[1]+'</i>'+t(x[0])+(x[0]==="queue"&&tp?'<span class="badge">'+tp+'</span>':'')+'</button>';}).join("");
  $("view").innerHTML=({queue:vQueue,cls:vClass8,post:vPost,report:vReport8,me:vMe}[TAB])();
  if(TAB==="post"){bindPost();if(!MYPOSTS)loadMyPosts();}
}
function statsBar(){var L=REQS.filter(inSel),c={Pending:0,Approved:0,Rejected:0};L.forEach(function(r){c[r.status]=(c[r.status]||0)+1;});var tot=0;selBatches().forEach(function(b){tot+=(b.students||[]).length;});var done={};L.forEach(function(r){done[r.key]=1;});var ny=0;selBatches().forEach(function(b){(b.students||[]).forEach(function(s){if(!done[s.key])ny++;});});
  return '<div class="stats"><div class="st p"><b>'+c.Pending+'</b><span>⏳ '+t("pending")+'</span></div><div class="st a"><b>'+c.Approved+'</b><span>✅ '+t("approved")+'</span></div><div class="st r"><b>'+c.Rejected+'</b><span>✗ '+t("rejected")+'</span></div><div class="st n"><b>'+ny+'</b><span>🚫 '+t("notYet")+'</span></div></div>';}
function reqCard(r){var s=sOf(r),io=tsDate(r.inTs)||tsDate(r.inAt),oo=tsDate(r.outTs)||tsDate(r.outAt),lt=lateBy(r),mis=r.inTs&&ld(tsDate(r.inTs))!==r.date;
  var st=r.status==="Approved"?'<span class="tag ok">✅ '+esc(t((r.mark||"Present").toLowerCase()))+(r.by?" · "+esc(r.by):"")+'</span>':r.status==="Rejected"?'<span class="tag bad">✗ '+t("rejected")+(r.note?" — "+esc(r.note):"")+'</span>':'';
  return '<div class="card req '+esc(r.status)+(FRESH[r.id]&&r.status==="Pending"?" new":"")+'"><div class="pics">'+(r.inPhoto?'<img src="'+r.inPhoto+'" data-zoom="'+esc(r.id)+'" data-w="in" alt="">':'<div class="noimg">✍</div>')+(r.outPhoto?'<img src="'+r.outPhoto+'" data-zoom="'+esc(r.id)+'" data-w="out" alt="">':'')+'</div>'+
   '<div class="info"><b>'+esc(s.name)+'</b><div class="mut">'+esc(s.sid)+' · '+esc(bOf(r))+'</div><div>🟢 '+t("in")+' <b>'+hm(io)+'</b>'+(oo?' · 🔴 '+t("out")+' <b>'+hm(oo)+'</b>':'')+'</div>'+
   '<div class="tags">'+distTag(r)+(lt?'<span class="tag warn">⏰ '+lt+' '+t("minLate")+'</span>':'')+(mis?'<span class="tag bad">⚠ '+t("dateMis")+'</span>':'')+(r.inCode?'<span class="tag">#'+esc(r.inCode)+'</span>':'')+st+'</div>'+
   '<div class="acts"><button class="btn sm" data-dec="'+esc(r.id)+'" data-m="Present">✓ '+t("present")+'</button><button class="btn sm warn" data-dec="'+esc(r.id)+'" data-m="Late">⏰ '+t("late")+'</button><button class="btn sm bad" data-dec="'+esc(r.id)+'" data-m="Rejected">✗</button></div></div></div>';}
function vQueue(){var L=REQS.filter(function(r){return inSel(r)&&r.status==="Pending";}).sort(function(a,b){return String(a.inAt||"").localeCompare(String(b.inAt||""));});
  var done=REQS.filter(function(r){return inSel(r)&&r.status!=="Pending";}).sort(function(a,b){return String(b.at||"").localeCompare(String(a.at||""));});
  var LV=LEAVES.filter(function(r){return inSel(r)&&r.status==="Pending";}).sort(function(a,b){return String(a.date).localeCompare(String(b.date));});
  return statsBar()+(L.length?'<div class="swHint">👆 '+t("swipeHint")+'</div>':'')+(LV.length?'<h4 class="mut" style="margin:4px 4px 8px">🌴 '+t("leaves")+' ('+LV.length+')</h4>'+LV.map(leaveCard).join(""):'')+(L.length?'<div class="bulk"><span class="mut">'+t("tapCompare")+'</span><button class="btn sm" id="bulkBtn">✅ '+t("approveAll")+' ('+L.length+')</button></div>'+L.map(reqCard).join(""):'<div class="card empty"><div class="big">🎉</div>'+t("noPending")+'</div>')+
   (done.length?'<h4 class="mut" style="margin:16px 4px 8px">'+t("approved")+' / '+t("rejected")+' ('+done.length+')</h4>'+done.map(reqCard).join(""):'');}
async function loadSched(){try{var a=await fdb.collection("gia_teach").doc("schedule").get();SCHED=(a.exists&&a.data().schedules)||{};}catch(e){}try{var sn=await fdb.collection("class_changes").limit(100).get();CHGS=sn.docs.map(function(d){var x=d.data();x.id=d.id;return x;});}catch(e){}render();}
var WDN={en:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],bn:["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"]};
function addD(s,n){var d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return ld(d);}
function t12(x){if(!x)return "";var p=x.split(":").map(Number);return ((p[0]%12)||12)+":"+String(p[1]).padStart(2,"0")+(p[0]<12?" AM":" PM");}
function dInfo(b,ds){var sc=SCHED[b];if(!sc)return null;var r={on:!!(sc.days||[])[new Date(ds+"T12:00:00").getDay()],start:sc.start,type:""};CHGS.filter(function(c){return c.date===ds&&(!c.batch||c.batch===b);}).forEach(function(c){r=(c.type==="off"||c.type==="holiday")?{on:false,type:c.type,reason:c.reason}:{on:true,start:c.start||sc.start,type:c.type,reason:c.reason};});return r;}
function schedCard(bs){var td=ld();return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><b>🗓 '+t("routine")+'</b><button class="btn sm" id="chgBtn">➕ '+t("addChg")+'</button></div>'+bs.map(function(b){var sc=SCHED[b.name];if(!sc)return '<div class="mut" style="margin-top:8px">'+esc(b.name)+': '+t("noSched")+'</div>';
   return '<div style="margin-top:10px"><div class="mut" style="font-size:.78rem">'+esc(b.name)+' · '+t12(sc.start)+(sc.end?' – '+t12(sc.end):'')+(sc.room?' · '+esc(sc.room):'')+'</div><div class="wkT">'+[0,1,2,3,4,5,6].map(function(i){var d=addD(td,i),x=dInfo(b.name,d);return '<div class="wdT '+(x.on?(x.type?"ex":"on"):(x.type?"hol":"off"))+(i===0?" now":"")+'" title="'+esc(x.reason||"")+'"><span>'+WDN[lang][new Date(d+"T12:00:00").getDay()]+'</span><b>'+d.slice(8)+'</b></div>';}).join("")+'</div></div>';}).join("")+
   (function(){var names=bs.map(function(b){return b.name;}),up=CHGS.filter(function(c){return c.date>=td&&(!c.batch||names.indexOf(c.batch)>=0);}).sort(function(a,b){return String(a.date).localeCompare(String(b.date));}).slice(0,6);
     return up.length?'<div class="mut" style="margin:12px 0 4px;font-weight:700">'+t("upChg")+'</div>'+up.map(function(c){return '<div class="row"><div class="rowInfo">'+esc(c.date)+' · '+esc(c.batch||"All")+'<small>'+({off:"🚫",holiday:"🎌",extra:"➕",time:"⏰"}[c.type]||"")+' '+esc(c.reason||"")+(c.start?' · '+t12(c.start):'')+'</small></div>'+(c.byEmail===String(USER.email).toLowerCase()?'<button class="btn sm bad" data-cd="'+esc(c.id)+'">🗑</button>':'')+'</div>';}).join(""):"";})()+'</div>';}
function openChg(){var bs=(MY.length?(R.batches||[]).filter(function(b){return MY.indexOf(b.name)>=0;}):(R.batches||[]));var z=$("zoom");
  z.innerHTML='<div class="card" style="width:min(420px,94vw);color:var(--ink)"><b>➕ '+t("addChg")+'</b><label class="fl">'+t("toBatch")+'<select id="cgB">'+bs.map(function(b){return '<option>'+esc(b.name)+'</option>';}).join("")+'</select></label><label class="fl">'+t("chgType")+'<select id="cgT"><option value="off">🚫 '+t("cOff")+'</option><option value="extra">➕ '+t("cExtra")+'</option><option value="time">⏰ '+t("cTime")+'</option><option value="holiday">🎌 '+t("cHol")+'</option></select></label><label class="fl">'+t("date")+'<input type="date" id="cgD" value="'+ld()+'"></label><label class="fl">'+t("time")+'<div style="display:flex;gap:6px"><input type="time" id="cgS"><input type="time" id="cgE"></div></label><label class="fl">'+t("reason")+'<input id="cgR" maxlength="200"></label><label class="chk" style="margin-top:8px"><input type="checkbox" id="cgP" checked> 📢 '+t("alsoPost")+'</label><div class="acts"><button class="btn sm" id="cgGo">'+t("saveChg")+'</button><button class="btn sm ghost" id="cgX">'+t("close")+'</button></div></div>';
  z.hidden=false;$("cgX").onclick=function(){z.hidden=true;};$("cgGo").onclick=saveChg;}
async function saveChg(){var g=function(i){return ($(i)||{}).value||"";},ty=g("cgT");if(!g("cgD"))return;if((ty==="extra"||ty==="time")&&!g("cgS")){toast(t("time")+"?");return;}
  var doc={date:g("cgD"),batch:g("cgB"),type:ty,start:g("cgS"),end:g("cgE"),reason:g("cgR").trim().slice(0,200),by:NAME,byEmail:String(USER.email).toLowerCase(),at:new Date().toISOString()};
  try{await fdb.collection("class_changes").add(doc);if($("cgP").checked){var ttl={off:"🚫 Class off",holiday:"🎌 Holiday",extra:"➕ Extra class",time:"⏰ Class time changed"}[ty]+" — "+doc.date;await fdb.collection("posts").add({batch:doc.batch,title:ttl,body:(doc.reason||"")+(doc.start?" ("+t12(doc.start)+(doc.end?" – "+t12(doc.end):"")+")":""),by:NAME,byEmail:doc.byEmail,byRole:"Teacher",at:new Date().toISOString(),pin:false});MYPOSTS=null;}
    $("zoom").hidden=true;toast("✅ "+t("chgSaved"));loadSched();}catch(e){toast(t("errSave"));}}
async function delChg(id){if(!confirm("?"))return;try{await fdb.collection("class_changes").doc(id).delete();loadSched();}catch(e){toast(t("errSave"));}}
function vClass(){var by={},lv={};REQS.forEach(function(r){by[r.key]=r;});LEAVES.forEach(function(r){if(r.date===DATE&&r.status==="Approved")lv[r.key]=r;});var bs=selBatches();if(!bs.length)return '<div class="card empty">—</div>';
  return schedCard(bs)+statsBar()+bs.map(function(b){return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><b>👥 '+esc(b.name)+'</b><span class="mut">'+esc([b.course,b.time||b.shift].filter(Boolean).join(" · "))+'</span></div>'+
   (b.students||[]).map(function(s){var r=by[s.key],tag=!r?(lv[s.key]?'<span class="tag lv">🌴 '+t("onLeave")+'</span>':'<span class="tag">'+t("notYet")+'</span>'):r.status==="Approved"?'<span class="tag ok">'+esc(t((r.mark||"Present").toLowerCase()))+'</span>':r.status==="Rejected"?'<span class="tag bad">'+t("rejected")+'</span>':'<span class="tag warn">⏳</span>';
     var io=r&&(tsDate(r.inTs)||tsDate(r.inAt));
     return '<div class="row"><div class="av">'+(r&&r.inPhoto?'<img src="'+r.inPhoto+'" alt="">':(THUMBS[s.key]?'<img src="'+THUMBS[s.key].d+'" alt="">':esc((s.name||"?").charAt(0))))+'</div><div class="rowInfo">'+esc(s.name)+'<small>'+esc(s.sid)+(io?' · '+t("in")+' '+hm(io):'')+'</small></div>'+tag+
      ((!r||r.status==="Rejected")&&s.key?'<div class="mb"><button class="P" data-man="'+esc(s.key)+'" data-m="Present" title="'+t("present")+'">P</button><button class="L" data-man="'+esc(s.key)+'" data-m="Late" title="'+t("late")+'">L</button><button class="A" data-man="'+esc(s.key)+'" data-m="Absent" title="'+t("absent")+'">A</button></div>':'')+'</div>';}).join("")+'</div>';}).join("");}
function pc(o){return o&&o.t?Math.round((o.p+o.l*0.5)/o.t*100):null;}
function vReport(){var bs=selBatches();
  return bs.map(function(b){return '<div class="card"><b>📊 '+esc(b.name)+'</b> <span class="mut">'+esc(R.month||"")+'</span><table><thead><tr><th>'+t("students")+'</th><th>P</th><th>L</th><th>A</th><th>'+t("month")+'</th><th>'+t("total")+'</th></tr></thead><tbody>'+
   (b.students||[]).map(function(s){var m=s.m||{},a=s.all||{},p1=pc(m),p2=pc(a),cl=function(p){return p==null?"":(p<60?"lo":p<80?"mi":"hi");};return '<tr><td>'+esc(s.name)+'</td><td>'+(m.p||0)+'</td><td>'+(m.l||0)+'</td><td>'+(m.a||0)+'</td><td class="pct '+cl(p1)+'">'+(p1==null?"—":p1+"%")+'</td><td class="pct '+cl(p2)+'">'+(p2==null?"—":p2+"%")+'</td></tr>';}).join("")+'</tbody></table></div>';}).join("")+
   '<div class="mut" style="text-align:center;font-size:.72rem">'+t("lastSync")+': '+esc(String(R.updatedAt||"").slice(0,16).replace("T"," "))+'</div>';}
var MYPOSTS=null,PIMG=null;
function vPost(){var bs=(MY.length?(R.batches||[]).filter(function(b){return MY.indexOf(b.name)>=0;}):(R.batches||[]));
  return '<div class="card"><b>📢 '+t("newPost")+'</b><label class="fl">'+t("toBatch")+'<select id="pbBatch">'+bs.map(function(b){return '<option>'+esc(b.name)+'</option>';}).join("")+'<option value="">'+t("allBatches")+'</option></select></label>'+
   '<label class="fl">'+t("ptTitle")+'<input id="pbTitle" maxlength="120"></label><label class="fl">'+t("ptBody")+'<textarea id="pbBody" rows="4" maxlength="2000"></textarea></label>'+
   '<div class="prow"><label class="btn sm ghost">📷 '+t("addPhoto")+'<input type="file" id="pbImg" accept="image/*" hidden></label><label class="chk"><input type="checkbox" id="pbPin"> 📌 '+t("pinTop")+'</label></div><div id="pbPrev"></div><button class="btn" id="pbGo">'+t("publish")+'</button></div>'+
   '<h4 class="mut" style="margin:14px 4px 8px">'+t("myPosts")+'</h4>'+(MYPOSTS===null?'<div class="card empty">…</div>':(MYPOSTS.length?MYPOSTS.map(function(p){return '<div class="card"><div class="mut" style="font-size:.75rem">'+esc(String(p.at||"").slice(0,16).replace("T"," "))+' · '+esc(p.batch||t("allBatches"))+(p.editedAt?' · edited':'')+'</div><b>'+(p.pin?"📌 ":"")+esc(p.title)+'</b><p style="margin:6px 0;white-space:pre-wrap">'+esc(p.body)+'</p>'+(p.image?'<img src="'+p.image+'" style="width:100%;border-radius:12px">':'')+'<div class="acts"><button class="btn sm ghost" data-pe="'+esc(p.id)+'">✏ '+t("edit")+'</button><button class="btn sm bad" data-pd="'+esc(p.id)+'">🗑 '+t("del")+'</button></div></div>';}).join(""):'<div class="card empty">'+t("noPosts")+'</div>'));}
function bindPost(){var f=$("pbImg");if(!f)return;f.onchange=function(){var fl=f.files&&f.files[0];if(!fl)return;var rd=new FileReader();rd.onload=function(){var im=new Image();im.onload=function(){var mx=900,s=Math.min(1,mx/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);PIMG=c.toDataURL("image/jpeg",.72);$("pbPrev").innerHTML='<img src="'+PIMG+'" style="width:100%;border-radius:12px;margin:8px 0">';};im.src=rd.result;};rd.readAsDataURL(fl);};
  $("pbGo").onclick=publishPost;}
async function publishPost(){var ti=$("pbTitle").value.trim(),bo=$("pbBody").value.trim();if(!ti||!bo){toast(t("needTitle"));return;}
  var doc={batch:$("pbBatch").value,title:ti.slice(0,120),body:bo.slice(0,2000),by:NAME,byEmail:String(USER.email).toLowerCase(),byRole:"Teacher",at:new Date().toISOString(),pin:$("pbPin").checked};if(PIMG)doc.image=PIMG;
  $("pbGo").disabled=true;try{await fdb.collection("posts").add(doc);PIMG=null;toast("✅ "+t("posted"));confetti();await loadMyPosts();}catch(e){toast(t("errSave"));}finally{var b=$("pbGo");if(b)b.disabled=false;}}
async function loadMyPosts(){try{var sn=await fdb.collection("posts").where("byEmail","==",String(USER.email).toLowerCase()).limit(50).get();MYPOSTS=sn.docs.map(function(d){var x=d.data();x.id=d.id;return x;}).sort(function(a,b){return String(b.at).localeCompare(String(a.at));});}catch(e){MYPOSTS=[];}if(TAB==="post")render();}
async function editPost(id){var p=(MYPOSTS||[]).find(function(x){return x.id===id;});if(!p)return;var ti=prompt(t("ptTitle"),p.title);if(ti===null)return;var bo=prompt(t("ptBody"),p.body);if(bo===null)return;
  try{await fdb.collection("posts").doc(id).update({title:ti.trim().slice(0,120),body:bo.trim().slice(0,2000),editedAt:new Date().toISOString()});await loadMyPosts();}catch(e){toast(t("errSave"));}}
async function delPost(id){if(!confirm(t("confirmDel")))return;try{await fdb.collection("posts").doc(id).delete();await loadMyPosts();}catch(e){toast(t("errSave"));}}
function vClass8(){var by={},lv={};REQS.forEach(function(r){by[r.key]=r;});LEAVES.forEach(function(r){if(r.date===DATE&&r.status==="Approved")lv[r.key]=r;});var bs=selBatches();if(!bs.length)return '<div class="card empty">—</div>';
  return schedCard(bs)+statsBar()+bs.map(function(b){return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><b>👥 '+esc(b.name)+'</b><span class="mut">'+esc([b.course,b.time||b.shift].filter(Boolean).join(" · "))+'</span></div><div class="rgrid">'+
   (b.students||[]).map(function(s,i){var r=by[s.key],st=!r?(lv[s.key]?"lv":"ny"):r.status==="Approved"?(r.mark==="Late"?"late":r.mark==="Absent"?"abs":"ok"):r.status==="Rejected"?"rej":"pen";
     var img=r&&r.inPhoto?r.inPhoto:(THUMBS[s.key]?THUMBS[s.key].d:"");
     var lab={ok:t("present"),late:t("late"),abs:t("absent"),rej:t("rejected"),pen:"⏳",lv:t("onLeave"),ny:t("notYet")}[st];
     return '<div class="rt st-'+st+'" style="animation-delay:'+(i*.03)+'s"><div class="rav">'+(img?'<img src="'+img+'" alt="">':'<span>'+esc((s.name||"?").charAt(0))+'</span>')+'</div><b>'+esc((s.name||"").split(" ")[0])+'</b><small>'+esc(lab)+'</small>'+((st==="ny"||st==="rej")&&s.key?'<div class="mb"><button class="P" data-man="'+esc(s.key)+'" data-m="Present">P</button><button class="L" data-man="'+esc(s.key)+'" data-m="Late">L</button><button class="A" data-man="'+esc(s.key)+'" data-m="Absent">A</button></div>':'')+'<div class="row" style="display:none"></div></div>';}).join("")+'</div></div>';}).join("");}
function vReport8(){var bs=selBatches();
  return bs.map(function(b){var L=(b.students||[]).map(function(s){return {s:s,p:pc(s.m),a:pc(s.all)};}),vals=L.filter(function(x){return x.p!=null;}).map(function(x){return x.p;}),avg=vals.length?Math.round(vals.reduce(function(a,c){return a+c;},0)/vals.length):null;
    L.sort(function(x,y){return (y.p==null?-1:y.p)-(x.p==null?-1:x.p);});
    return '<div class="card"><div class="repH"><div class="avgR" style="--p:'+(avg||0)+'"><b>'+(avg==null?"—":avg+"%")+'</b></div><div><b>📊 '+esc(b.name)+'</b><div class="mut">'+t("avg")+' · '+esc(R.month||"")+'</div></div></div>'+
     L.map(function(x,i){var c=x.p==null?"":(x.p<60?"lo":x.p<80?"mi":"hi");return '<div class="hb"><span class="hbN">'+(i<3&&x.p!=null?["🥇","🥈","🥉"][i]+" ":"")+esc(x.s.name)+'</span><div class="hbT"><i class="'+c+'" style="width:'+(x.p||0)+'%"></i></div><b class="pct '+c+'">'+(x.p==null?"—":x.p+"%")+'</b></div>';}).join("")+
     '<table style="display:none"><tbody>'+L.map(function(){return "<tr></tr>";}).join("")+'</tbody></table></div>';}).join("")+'<div class="mut" style="text-align:center;font-size:.72rem">'+t("lastSync")+': '+esc(String(R.updatedAt||"").slice(0,16).replace("T"," "))+'</div>';}
function swipeFx(){var el=null,x0=0,y0=0,dx=0,act=false;
  document.addEventListener("pointerdown",function(e){var c=e.target.closest&&e.target.closest(".req.Pending");if(!c||e.target.closest("button,img"))return;el=c;x0=e.clientX;y0=e.clientY;dx=0;act=false;},{passive:true});
  document.addEventListener("pointermove",function(e){if(!el)return;dx=e.clientX-x0;var dy=e.clientY-y0;if(!act&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy))act=true;if(!act)return;el.style.transition="none";el.style.transform="translateX("+dx+"px) rotate("+(dx/40)+"deg)";el.classList.toggle("swR",dx>60);el.classList.toggle("swL",dx<-60);},{passive:true});
  document.addEventListener("pointerup",function(){if(!el)return;var c=el,id=(c.querySelector("[data-dec]")||{}).getAttribute?c.querySelector("[data-dec]").getAttribute("data-dec"):null;el=null;c.style.transition="transform .3s";
    if(act&&dx>110&&id){c.style.transform="translateX(120%)";try{navigator.vibrate&&navigator.vibrate(30);}catch(e){}setTimeout(function(){decide(id,"Present");},200);}
    else if(act&&dx<-110&&id){c.style.transform="";c.classList.remove("swL","swR");decide(id,"Rejected");}
    else{c.style.transform="";c.classList.remove("swL","swR");}},{passive:true});}
function vMe(){var perm=(window.Notification&&Notification.permission)||"na";
  return '<div class="card meT"><div class="meTAv">'+esc((NAME||"T").charAt(0))+'</div><div><b>'+esc(NAME)+'</b><small>'+esc(USER&&USER.email)+'</small></div></div><div class="card"><div class="kv"><div><span>'+t("email")+'</span>'+esc(USER&&USER.email)+'</div><div><span>'+t("mine")+'</span>'+esc(MY.join(", ")||"—")+'</div></div>'+(MY.length?'':'<div class="mut" style="margin-top:8px">ℹ '+t("noBatch")+'</div>')+'</div>'+
   '<div class="card"><div class="row"><span style="flex:1">🔔 '+t("notif")+'</span>'+(perm==="granted"?'<span class="tag ok">'+t("on")+'</span>':perm==="na"?'<span class="tag">—</span>':'<button class="btn sm" id="nBtn">'+t("enable")+'</button>')+'</div>'+
   '<div class="row"><span style="flex:1">🔊 '+t("sound")+'</span><button class="sw'+(lsGet(LS.sound)!=="0"?" on":"")+'" id="sBtn"><i></i></button></div>'+
   '<div class="row"><span style="flex:1">🌐 Language</span><button class="btn sm ghost" id="lBtn">EN / বাংলা</button></div></div>'+
   themePicker()+'<div class="card"><b>💡 '+t("help")+'</b><p class="mut" style="line-height:1.6">'+t("helpTxt")+'</p></div>'+
   '<button class="btn ghost" id="outBtn">'+t("logout")+'</button>';}
/* ---- actions ---- */
function confetti(){var C=["#0e7c66","#c9a24a","#c0392b","#2e86de","#ff7aa2"];var w=document.createElement("div");w.className="confetti";for(var i=0;i<46;i++){var e=document.createElement("i");e.style.left=Math.random()*100+"%";e.style.background=C[i%C.length];e.style.animationDelay=(Math.random()*.4)+"s";w.appendChild(e);}document.body.appendChild(w);setTimeout(function(){w.remove();},2600);}
function pendLeft(){return REQS.filter(function(r){return inSel(r)&&r.status==="Pending";}).length;}
async function decide(id,m){var r=REQS.find(function(x){return x.id===id;});if(!r)return;var upd;
  if(m==="Rejected"){var why=prompt(t("rejectWhy"),t("rejectDef"));if(why===null)return;upd={status:"Rejected",mark:"",note:why,by:NAME,byEmail:USER.email,at:new Date().toISOString()};}
  else upd={status:"Approved",mark:m,note:"",by:NAME,byEmail:USER.email,at:new Date().toISOString()};
  try{var card=document.querySelector('[data-dec="'+id+'"]');card=card&&card.closest(".req");if(card&&r.status==="Pending"){card.classList.add("leaving");await new Promise(function(z){setTimeout(z,280);});}
    var before=pendLeft();await fdb.collection("att_requests").doc(id).update(upd);Object.assign(r,upd);delete FRESH[id];badge();render();if(before>0&&pendLeft()===0)confetti();try{navigator.vibrate&&navigator.vibrate(25);}catch(e){}}catch(e){toast(t("errSave"));}}
async function bulk(){var L=REQS.filter(function(r){return inSel(r)&&r.status==="Pending";});if(!L.length||!confirm(t("confirmAll").replace("{0}",L.length)))return;
  var upd={status:"Approved",mark:"Present",note:"",by:NAME,byEmail:USER.email,at:new Date().toISOString()};
  try{var b=fdb.batch();L.forEach(function(r){b.update(fdb.collection("att_requests").doc(r.id),upd);});await b.commit();L.forEach(function(r){Object.assign(r,upd);delete FRESH[r.id];});badge();render();toast("✅ "+t("saved"));confetti();}catch(e){toast(t("errSave"));}}
async function manual(key,m){var x=KEYMAP[key];if(!x)return;var id=key+"_"+DATE;
  var doc={key:key,sid:x.s.sid||"",name:x.s.name||"",batch:x.b.name,course:x.b.course||"",date:DATE,status:"Approved",mark:m,manual:true,by:NAME,byEmail:USER.email,at:new Date().toISOString(),inAt:new Date().toISOString()};
  try{await fdb.collection("att_requests").doc(id).set(doc);var ex=REQS.find(function(r){return r.id===id;});if(ex)Object.assign(ex,doc);else{doc.id=id;REQS.push(doc);}render();}catch(e){toast(t("errSave"));}}
async function regPhoto(pk){if(!pk)return null;if(pk in PHOTOS)return PHOTOS[pk];try{var s=await fdb.collection("gia_storage").doc(pk).get();var v=s.exists?JSON.parse(s.data().value||"{}").data:null;PHOTOS[pk]=v||null;return PHOTOS[pk];}catch(e){PHOTOS[pk]=null;return null;}}
async function zoom(id,w){var r=REQS.find(function(x){return x.id===id;});if(!r)return;var s=sOf(r),z=$("zoom"),src=w==="out"?r.outPhoto:r.inPhoto;
  z.innerHTML='<div class="cmp"><figure><img src="'+src+'" alt=""><figcaption>'+t("selfie")+'</figcaption></figure><figure id="zReg"><div class="mut">…</div></figure></div><b>'+esc(s.name)+' · '+esc(s.sid)+'</b><button class="btn sm ghost" id="zX">'+t("close")+'</button>';z.hidden=false;
  $("zX").onclick=function(){z.hidden=true;};var p=(THUMBS[r.key]&&THUMBS[r.key].d)||null;var f=$("zReg");if(f)f.innerHTML=p?'<img src="'+p+'" alt=""><figcaption>'+t("regPhoto")+'</figcaption>':'<figcaption>'+t("noReg")+'</figcaption>';}
function onClick(e){var el=e.target.closest("[data-th],#chgBtn,[data-cd],[data-pe],[data-pd],[data-lv],[data-sel],[data-tab],[data-dec],[data-man],[data-zoom],#bulkBtn,#nBtn,#sBtn,#lBtn,#outBtn");if(!el)return;primeAudio();
  if(el.dataset.sel!=null){SEL=el.dataset.sel;lsSet(LS.sel,SEL);render();return;}
  if(el.dataset.tab){TAB=el.dataset.tab;render();window.scrollTo(0,0);return;}
  if(el.dataset.th){lsSet("gia_t_theme",el.dataset.th);render();return;}
  if(el.id==="chgBtn"){openChg();return;}
  if(el.dataset.cd){delChg(el.dataset.cd);return;}
  if(el.dataset.pe){editPost(el.dataset.pe);return;}
  if(el.dataset.pd){delPost(el.dataset.pd);return;}
  if(el.dataset.lv){decideLeave(el.dataset.lv,el.dataset.m);return;}
  if(el.dataset.dec){decide(el.dataset.dec,el.dataset.m);return;}
  if(el.dataset.man){manual(el.dataset.man,el.dataset.m);return;}
  if(el.dataset.zoom){zoom(el.dataset.zoom,el.dataset.w);return;}
  if(el.id==="bulkBtn")bulk();
  if(el.id==="nBtn"){try{Notification.requestPermission().then(render);}catch(x){}}
  if(el.id==="sBtn"){lsSet(LS.sound,lsGet(LS.sound)==="0"?"1":"0");render();}
  if(el.id==="lBtn")toggleLang();
  if(el.id==="outBtn")auth.signOut();}
function toggleLang(){lang=lang==="en"?"bn":"en";lsSet(LS.lang,lang);applyStatic();render();}
var deferred=null;window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;$("installBtn").hidden=false;});
window.GIAT={loadSched:function(){return loadSched();},saveChg:saveChg,openChg:openChg,_sched:function(){return {SCHED:SCHED,CHGS:CHGS};},publishPost:publishPost,loadMyPosts:loadMyPosts,_state:function(){return {MYPOSTS:MYPOSTS,R:R,NAME:NAME,MY:MY,REQS:REQS,SEL:SEL,TAB:TAB,LEAVES:LEAVES,THUMBS:THUMBS};},decideLeave:decideLeave,decide:decide,bulk:bulk,manual:manual,zoom:zoom};
function boot(){lsSet("gia_app_role","teacher");init();applyStatic();swipeFx();
  setTimeout(function(){var sp=$("splash");if(sp){sp.classList.add("out");setTimeout(function(){sp.remove();},700);}},950);
  $("btnLogin").onclick=doLogin;$("in_pw").addEventListener("keydown",function(e){if(e.key==="Enter")doLogin();});$("btnForgot").onclick=forgot;
  $("pwEye").onclick=function(){var i=$("in_pw");i.type=i.type==="password"?"text":"password";};$("btnLang").onclick=toggleLang;
  $("fDate").onchange=function(){DATE=this.value||ld();FOLLOW=DATE===ld();FRESH={};listen();render();};
  $("btnBell").onclick=function(){primeAudio();if(window.Notification&&Notification.permission!=="granted"){Notification.requestPermission().then(render);}else{TAB="queue";render();}};
  $("installBtn").onclick=async function(){if(deferred){deferred.prompt();try{await deferred.userChoice;}catch(e){}deferred=null;$("installBtn").hidden=true;}};
  document.addEventListener("click",onClick);
  setInterval(function(){if(USER&&FOLLOW&&DATE!==ld()){DATE=ld();$("fDate").value=DATE;FRESH={};listen();render();}},60000);
  try{if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});}catch(e){}
  if(auth)auth.onAuthStateChanged(onUser);
}
/* ===== v9 · monthly class-day calendar for teachers ===== */
var MCAL={off:0};
var MN9T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function monthCal9(bs){
  var base=new Date(ld()+"T12:00:00");base.setDate(1);base.setMonth(base.getMonth()+MCAL.off);
  var y=base.getFullYear(),m=base.getMonth(),dim=new Date(y,m+1,0).getDate(),first=new Date(y,m,1).getDay(),td=ld();
  var ym=y+"-"+String(m+1).padStart(2,"0");
  return '<div class="card mc9"><div class="mc9H"><button class="btn sm" data-mc="-1">‹</button><b>📅 '+MN9T[m]+' '+y+'</b><button class="btn sm" data-mc="1">›</button></div>'+bs.map(function(b){
    if(!SCHED[b.name])return "";var n=0,cells="";
    for(var d=1;d<=dim;d++){var ds=ym+"-"+String(d).padStart(2,"0"),x=dInfo(b.name,ds)||{on:false};if(x.on)n++;
      cells+='<i class="'+(x.on?(x.type==="extra"?"ex":"on"):(x.type?"hol":"off"))+(ds===td?" now":"")+'" title="'+esc(x.reason||"")+'">'+d+'</i>';}
    return '<div class="mc9B"><div class="mc9T"><span>'+esc(b.name)+'</span><b>'+n+' '+(lang==="bn"?"দিন ক্লাস":"class days")+'</b></div><div class="mc9G">'+WDN[lang].map(function(w){return '<i class="w">'+w.slice(0,2)+'</i>';}).join("")+Array(first+1).join("<i></i>")+cells+'</div></div>';}).join("")+'</div>';
}
(function(){var _sc=schedCard;schedCard=function(bs){var h=_sc.apply(this,arguments);try{h+=monthCal9(bs);}catch(e){}return h;};})();
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-mc]");if(!b)return;MCAL.off+=+b.getAttribute("data-mc");render();});

/* ===== v10 · new themes: GIA Night (matches website) + Soft Pro (clean light) ===== */
(function(){
  try{
    if(!THEMES.some(function(x){return x[0]==="night";})){
      THEMES.unshift(["soft","Soft Pro","#f4f5fb","linear-gradient(90deg,#5b5bf0,#8a7cff)"]);
      THEMES.unshift(["night","GIA Night","linear-gradient(160deg,#050b18,#1c3a63)","linear-gradient(90deg,#d4a531,#c0392b)"]);
    }
    var KEY=(typeof LS!=="undefined"&&LS.theme)?LS.theme:"gia_t_theme";
    curTheme=function(){ var v=lsGet(KEY); if(!v) return "soft"; return THEMES.some(function(x){return x[0]===v;})?v:"soft"; };
    var _ap=applyTheme;
    applyTheme=function(){ var b=document.body; ["t-night","t-soft","t-urushi","t-clay"].forEach(function(c){b.classList.remove(c);});
      var r=_ap.apply(this,arguments), th=curTheme();
      if(th==="night") b.classList.add("t-urushi","t-night"); else if(th==="soft") b.classList.add("t-clay","t-soft");
      var m=document.querySelector('meta[name="theme-color"]'); if(m&&th==="night") m.setAttribute("content","#050b18"); if(m&&th==="soft") m.setAttribute("content","#f4f5fb");
      return r; };
    applyTheme();
  }catch(e){}
})();

/* Illustrations from unDraw (https://undraw.co) by Katerina Limpitsouni — free to use, no attribution required (unDraw license). */
var GIA_ILL={
girl:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 582.8 640.7"><g transform="translate(-730.1 -282.7)"><path d="M966.9,643.3C874.0,685.6,754.3,682.6,754.3,682.6H624.8V657.9c52.7-14.7,125.7-23.8,206.4-23.8a945.7,945.7,0,0,1,135.7,9.3Z" transform="translate(190.3 127.5)" opacity="0.1"></path><path d="M1186.6,708.0c0,44.7-130.4,80.9-291.4,80.9s-291.4-36.2-291.4-80.9c0-22.3,32.4-42.5,85-57.1v24.7H818.3s119.6,2.9,212.6-39.2C1123.5,649.8,1186.6,676.8,1186.6,708.0Z" transform="translate(126.3 134.5)" opacity="0.1"></path><rect width="123.9" height="124.2" transform="translate(934.8 338.5)" fill="#090814"></rect><path d="M694.7,561.9s10.2,35.9-7.7,38.4a70.1,70.1,0,0,0-30.7,12.8l33.3,43.6H751.2l38.4-38.4s-51.3-38.4-41.0-61.5S694.7,561.9,694.7,561.9Z" transform="translate(286.1 -135.5)" fill="#ed9da0"></path><path d="M536.2,554.6l59.0,20.5,41.0,2.5-2.5-35.9-84.6-25.0Z" transform="translate(460.0 318.1)" fill="#ed9da0"></path><path d="M688.2,685.3s0,35.9,5.1,35.9,74.4-7.7,94.9,0S839.6,700.7,824.2,685.3s-40.5-38.4-56.1-33.3-79.8,17.9-79.8,17.9Z" transform="translate(383.7 179.8)" fill="#2f2e41"></path><path d="M654.7,651.4s-30.7,61.5-10.2,66.7,43.6-2.5,46.1-5.1,38.4-12.8,43.6-7.7,5.1-20.5,5.1-20.5Z" transform="translate(228.6 180.3)" fill="#2f2e41"></path><path d="M667.6,630.4s-48.7,66.7-12.8,84.6,207.8,17.9,220.6,0,17.9-74.4,0-79.5S667.6,630.4,667.6,630.4Z" transform="translate(241.4 116.6)" fill="#2f2e41"></path><path d="M667.6,630.4s-48.7,66.7-12.8,84.6,207.8,17.9,220.6,0,17.9-74.4,0-79.5S667.6,630.4,667.6,630.4Z" transform="translate(241.4 116.6)" opacity="0.2"></path><ellipse cx="59.0" cy="59.0" rx="59.0" ry="59.0" transform="translate(942.4 326.2)" fill="#ed9da0"></ellipse><path d="M648.0,571.6l51.3-10.2s12.8,41.0,53.8,33.3,51.3-33.3,51.3-33.3,30.7,12.8,33.3,12.8,35.9,12.8,35.9,20.5-38.4,84.6-38.4,84.6l5.1,138.5-189.8-5.1L663.4,676.8Z" transform="translate(261.0 -93.9)" fill="currentColor"></path><path d="M647.5,580.4s-15.3,135.9-5.1,146.2,51.3,38.4,51.3,38.4v-30.7L673.2,695.8l20.5-89.8Z" transform="translate(233.2 -36.0)" fill="#ed9da0"></path><path d="M746.2,579.4s-8.9,139.8-8.9,144.9S714.1,747.5,706.5,747.5s-12.8-12.8-12.8-12.8l17.9-20.5L698.8,608.9Z" transform="translate(400.1 -38.9)" fill="#ed9da0"></path><path d="M790.4,649.4s115.4-64.1,118.0,0-59.0,89.8-59.0,89.8-159.0,47.7-165.5,30.2-19.2-45.6-8.9-48.2,23.0-7.7,28.2-2.5S772.5,680.2,772.5,680.2Z" transform="translate(331.5 87.4)" fill="#2f2e41"></path><path d="M768.0,626.0S744.9,636.3,737.2,644,696.2,664.5,696.2,664.5" transform="translate(407.8 103.0)" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" opacity="0.2"></path><path d="M695.0,569.0l-15.4-5.1s-56.4,59.0-38.4,74.4,28.2,20.5,33.3,25.6,30.7,7.7,30.7,7.7Z" transform="translate(229.4 -86.2)" fill="currentColor"></path><path d="M725.1,568.3l23.0,5.1s17.9,38.4,23.0,43.6-7.7,2.5-15.3,12.8-15.4,28.2-30.7,28.2S689.2,632.5,689.2,632.5Z" transform="translate(386.6 -72.7)" fill="currentColor"></path><path d="M750.9,661.4s-97.5-69.2-130.8-17.9S763.7,764.0,789.4,774.3s48.7,20.5,48.7,20.5,23.0-56.4,23.0-66.7-17.9-10.2-23.0-10.2-28.2-5.1-33.3-12.8S750.9,661.4,750.9,661.4Z" transform="translate(163.2 98.4)" fill="#2f2e41"></path><path d="M635.9,629.2s25.6,20.5,48.7,25.6,30.7,17.9,30.7,17.9" transform="translate(224.3 112.7)" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" opacity="0.2"></path><path d="M644.9,615.8l2.0,108.6a13.6,13.6,0,0,0,13.7,13.3l202.1-2.2A13.6,13.6,0,0,0,876.3,722.7l6.1-106.3a13.6,13.6,0,0,0-13.5-14.3H658.5a13.6,13.6,0,0,0-13.6,13.8Z" transform="translate(251.5 29.6)" fill="#090814"></path><g transform="translate(885.1 282.7)"><path d="M662.1,702.5c5.5-12.1,12.9-23.5,16.4-36.4,4.2-15.4,2.5-31.7,2.0-47.7a149.8,149.8,0,0,1,3.5-42.1,72.4,72.4,0,0,1,20.8-36.2c26.8-24,53.2-25.7,86.1-15.7,12.9,3.9,26.7,11.4,29.9,24.5.484,1.9.7,4.0,1.2,6,2.6,9.7,12.7,15.9,16.3,25.4,4.6,12.2-2.5,25.6-3.4,38.7-1.1,15.2,6.4,29.7,13.8,43.1,4.4,7.9,8.9,16.4,8.5,25.5a32.3,32.3,0,0,1-4.4,14.1,53.7,53.7,0,0,1-45.1,25.8,28.3,28.3,0,0,1-16.9-3.9c-8.0-5.5-10.3-16.6-8.6-26.2s6.5-18.2,10.3-27.2c1.1-2.7,2.2-5.5,3.2-8.3a57.4,57.4,0,1,0-37.8,6.4,77.7,77.7,0,0,1-3.7,43.2,163.3,163.3,0,0,1-18.1,31.6,43.7,43.7,0,0,1-11.5,12.9,41.0,41.0,0,0,1-9.8,4.2c-14.4,4.6-6.9,8.4-22.0,6.3s-30.0-11.1-35.1-25.5C653.0,728.7,656.6,714.7,662.1,702.5Z" transform="translate(-655.4 -518.6)" fill="#090814"></path><ellipse cx="62.6" cy="35.4" rx="62.6" ry="35.4" transform="translate(46.6 22.3)" fill="#090814"></ellipse></g></g></svg>',
boy:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 712.4"><g transform="translate(-503.8 -308.7)"><g transform="translate(503.8 895.7)"><path d="M159.1,787.3c1.1,7.0,5.2,12.3,9.0,17.2l45.9,58.2c3.6,4.6,7.6,9.5,12.6,10.8,10.3,2.7,18.7-10.5,27.5-18.3,31.5-27.7,74.6,14.4,110.2-1.6,14.2-6.4,25.8-21.7,40.3-26.9,38.4-13.7,71.0,47.1,110.7,50.2,13.0.985,25.8-4.3,38.3-9.7l83.1-35.5c5.7-2.4,11.6-4.9,17.7-5.0,10.2-.177,19.7,6.4,29.3,11.1,38.7,19.0,81.7,8.7,121.5-5.6s79.8-33.0,121.0-29.9c10.7.808,24.8.128,27.7-13.9,1.7-8.3-21.7.4-27.2-4.1s7.5-23.2,1.1-24.0c-36.9-4.6-74.6-4.7-110.7,6.9-18.7,6.0-37.1,15.2-56.3,17.0-20.0,1.9-39.9-4.1-59.6-9.6-49.8-13.9-100.4-24.6-151.3-22.4-90.4,3.9-179.4,48.5-269.3,35.6a229.2,229.2,0,0,1-76.2-25.5c-12.1-6.5-11.6,16.6-23.9,24.4-4.0,2.5-14.5-21.1-17.7-16.6A23.1,23.1,0,0,0,159.1,787.3Z" transform="translate(-158.8 -751.5)" fill="#f2f2f2"></path></g><path d="M165.8,780.6l26.2,3.2,15.3-75.4L177.9,691.0,139.6,732.5Z" transform="translate(440.8 171.6)" fill="#ed9da0"></path><path d="M617.5,425.1l-63.4,56.8S431.7,509.3,462.3,471.0c17.3-21.6,15.0-54.5,9.7-79.0a205.0,205.0,0,0,0-9.7-32.5s157.4-95.0,135.5-22.9c-6.4,21.4-7.3,37.9-5.4,50.5C597.0,417.0,617.5,425.1,617.5,425.1Z" transform="translate(341.0 156.6)" fill="#ed9da0"></path><path d="M347.1,419.9V644.0l215.3-17.4L526.4,398.1s-50.0,42.4-94.8,47.9S347.1,419.9,347.1,419.9Z" transform="translate(437.7 176.0)" fill="#e1e7ef"></path><path d="M595.5,391.3l26.3,9.8s30.6,19.7,142.1,34.9c0,0,16.3,0,27.3,52.4l139.9,186.9s67.7,50.2,10.9,100.5L817,789.8s72.1-68.8-37.1-71.0l20.2-16.9s-31.7-29.5-38.2-48.1-60.1-39.3-60.1-39.3l6.5,157.4-98.4,15.2L595.6,494.1a194.5,194.5,0,0,1,2.3-41.3c2.9-17.3,1.7-41.4-2.3-54.4-.786-2.4.338-5.1-.084-7.0C595.4,391.0,596.1,391.6,595.5,391.3Z" transform="translate(339.0 155.4)" fill="#3f3d56"></path><path d="M469.0,401.3,330.2,437.4s-20.7-13.1-45.9,89.6l-88.5,159.6s-51.4,50.2-12.0,92.8,88.5,21.8,88.5,21.8-44.8-69.9,33.8-87.4l29.5-37.1,133.3,15.3-3.3-192.3,3.7-22.4a222.6,222.6,0,0,0,0-73.2Z" transform="translate(346.3 155.2)" fill="#3f3d56"></path><path d="M238.2,489.0l-13.1,9.8L422.9,549.2V529.5Z" transform="translate(439.5 174.6)" fill="#e4e6ed"></path><path d="M623.7,485.7l13.1,9.8L425.9,549.1V529.4Z" transform="translate(436.6 174.7)" fill="#e4e6ed"></path><path d="M212.8,489.0l183.6,42.6,13.1,266.7L248.9,748.1Z" transform="translate(439.7 174.6)" fill="currentColor"></path><path d="M645.9,489.0,450.3,533.9l10.9,267.8,181.4-55.7Z" transform="translate(436.2 174.6)" fill="currentColor"></path><path d="M489.1,553.3s32.0,19.7,65.7,0l6.5,272.1H508.7Z" transform="translate(340.6 153.0)" fill="currentColor"></path><path d="M489.1,553.3s32.0,19.7,65.7,0l6.5,272.1H508.7Z" transform="translate(340.6 153.0)" opacity="0.1"></path><path d="M339.3,506.7V514.4l180.3,36.0S427.8,516.5,339.3,506.7Z" transform="translate(342.8 153.7)" fill="#d6d6e3"></path><path d="M716.9,502.3v7.6L522.3,550.4S628.4,512.1,716.9,502.3Z" transform="translate(340.1 153.7)" fill="#d6d6e3"></path><path d="M778.9,723.0l-5.7,1.5S736.1,692.0,688.7,741.3,704.5,814.7,704.5,814.7s65.0,2.7,85.4-9.2a89.8,89.8,0,0,1,28.4-11.0,29.0,29.0,0,0,0,15.9-8.9h0a38.0,38.0,0,0,0,9.5-31.3h0a38.0,38.0,0,0,0-27.9-31.1h0A72.0,72.0,0,0,0,778.9,723.0Z" transform="translate(337.9 150.6)" fill="#ed9da0"></path><path d="M291.2,728.4s43.7-39.3,97.2,26.2-41.5,66.7-41.5,66.7-51.4,11.9-71.0-30.6S291.2,728.4,291.2,728.4Z" transform="translate(343.8 150.5)" fill="#ed9da0"></path><path d="M786.3,720.3s50.8,14.8,39.9,73.4l30.7-3.3,6.4-29.8-13.1-41.5-25.1-9.8Z" transform="translate(336.2 150.7)" fill="#3f3d56"></path><ellipse cx="99.0" cy="99.0" rx="99.0" ry="99.0" transform="translate(769.2 358.5)" fill="#ed9da0"></ellipse><path d="M580.5,229.8s25.9-49.5-31.0-54.0c0,0-48.5-44.0-98.0-8.0,0,0-27,0-41.7,30.5,0,0-21.2-8.0-25.9,13.5,0,0-15.5,45.0,0,85.5s20.7,45.0,20.7,45.0-25.5-84.9,36.6-89.4,131.7-43.3,136.9,6.1S590.9,320.8,590.9,320.8,640.1,250.1,580.5,229.8Z" transform="translate(374.4 155.1)" fill="#090814"></path></g></svg>',
teacher:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 692.7"><g transform="translate(-482.7 -115)"><g transform="translate(539.4 115)"><g transform="translate(0)"><g transform="translate(27.7 15.7)"><rect width="686.1" height="427.2" rx="7.2" transform="translate(0)" fill="#e6e6e6"></rect><rect width="670.2" height="413.0" rx="7.2" transform="translate(8.6 7.1)" fill="#fff"></rect></g><path d="M7.1,0H736.1a7.1,7.1,0,0,1,7.1,7.1v8.0a7.1,7.1,0,0,1-7.1,7.1H7.1A7.1,7.1,0,0,1,0,15.2V7.1A7.1,7.1,0,0,1,7.1,0Z" fill="#e6e6e6"></path></g><g transform="translate(129.1 83.9)"><rect width="485" height="181" rx="16" transform="translate(0.1 129.2)" fill="#f2f2f2"></rect><path d="M21.5,0A21.5,21.5,0,1,1,0,21.5,21.5,21.5,0,0,1,21.5,0Z" transform="translate(0 7.5)" fill="currentColor"></path><rect width="279" height="29" rx="14.5" transform="translate(93.1 0.2)" fill="currentColor"></rect><rect width="392" height="13" rx="6.5" transform="translate(93.1 44.2)" fill="#e6e6e6"></rect><rect width="174" height="14" rx="7" transform="translate(93.1 72.2)" fill="#e6e6e6"></rect></g></g><g transform="translate(482.7 379.9)"><path d="M15.1,488.6c0,.783.2,1.4.444,1.4H237.1c.248,0,.444-.628.4-1.4s-.2-1.4-.444-1.4H15.6C15.3,487.1,15.1,487.8,15.1,488.6Z" transform="translate(-15.1 -62.1)" fill="#f2f2f2"></path><path d="M101.4,279.4l-1.8,38.7L70.2,301.2,74,279.4Z" transform="translate(37.6 -232.3)" fill="#ed9da0"></path><path d="M341.2,543.1l2.7,5.7s15.8,21.0,6.0,24.4-14.9-20-14.9-20l-2.5-3.2Z" transform="translate(-165.9 -343.5)" fill="#ed9da0"></path><path d="M319.9,421.4l2.6-1.1s3.0,1.1,3.0,5.8-3.7,73.7-3.7,73.7l7.5,37.8L319,539.6l-16.0-34.9Z" transform="translate(-162.8 -330.8)" fill="#575a89"></path><path d="M319.9,421.4l1.8-1.1s5.6-1.3,5.4,18.5-5.4,61.0-5.4,61.0l20.3,32.6-13.2,9.4-26-37.3Z" transform="translate(-162.8 -330.8)" fill="#2f2e41"></path><path d="M308.9,543.4s6.7,7.4,5.7,16-7.6,174.9-7.6,174.9l3.7,18.9-35.9.945-.945-121.9L248.4,754.3l-33.2-.945L238.0,539.7Z" transform="translate(-153.8 -343.1)" fill="#090814"></path><path d="M313.1,773.7l8.5,8.5s19.8,3.7,15.1,10.4-53.8-1.8-53.8-1.8l.945-15.1Z" transform="translate(-160.8 -367.3)" fill="#2f2e41"></path><path d="M244.6,773.7l8.5,8.5s19.8,3.7,15.1,10.4-53.8-1.8-53.8-1.8l.945-15.1Z" transform="translate(-153.7 -367.3)" fill="#2f2e41"></path><circle cx="22.6" cy="22.6" r="22.6" transform="translate(102.2 11.2)" fill="#ed9da0"></circle><path d="M69.1,293.2l27.4,19.8,4.7-14.1,8.5,22.6-4.7,40.6Z" transform="translate(37.7 -233.7)" fill="currentColor"></path><path d="M265.8,383.7l27.3,41.5,1.1-34.7,3.3,2.6a15.5,15.5,0,0,1,5.9,12.2h0l13.2,12.2-4.7,47.2-.945,55.7s5.6,4.7,3.7,7.5S305.4,537.7,296.9,537.7s-61.4-6.6-61.4-10.4,1.8-52.9,1.8-52.9V408.2l22.6-17.0Z" transform="translate(-155.9 -327.0)" fill="#2f2e41"></path><path d="M36.4,464.2l12.2,17.9,4.7-20.8-5.6-3.7Z" transform="translate(41.1 -250.7)" fill="#ed9da0"></path><rect width="52.4" height="1.8" transform="matrix(0.3, -0.9, 0.9, 0.3, 119.0, 289.8)" opacity="0.2"></rect><path d="M269.5,332.2s2.8-14.1,18.9-11.3l-1.8.945s15.1-1.8,13.2,6.6c0,0,12.2,7.5,9.4,16.0a96.1,96.1,0,0,0-3.7,15.1l-2.8-2.8s-2.8-18.9-19.8-17.0c-12.7,1.4-17.9,7.4-19.2,11.7a38.3,38.3,0,0,1-2.3,5.9l-1.0.233S254.4,336.9,269.5,332.2Z" transform="translate(-158.3 -320.5)" fill="#090814"></path><path d="M244.2,409.9l-8.6-.4-1.7,1.3a56.6,56.6,0,0,0-5.6,6.6c-1.8,2.8-26.4,71.8-26.4,71.8a24.0,24.0,0,0,0,1.8,12.2C206.4,508.2,229.1,548,229.1,548l17.0-10.4-22.6-46.3,16.0-22.6Z" transform="translate(-152.4 -329.7)" fill="#2f2e41"></path></g></g></svg>'
};
/* original GIA characters (SVG, anime-style) — girl, boy, teacher-f, teacher-m */
var GIA_CHR=(function(){
  function eyes(y,iris){ var e='';[80,120].forEach(function(x){ e+='<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="11.5" fill="#fff"/><ellipse cx="'+x+'" cy="'+(y+1.5)+'" rx="7" ry="9.5" fill="'+iris+'"/><ellipse cx="'+x+'" cy="'+(y+3)+'" rx="4" ry="5.5" fill="#1d1430"/><circle cx="'+(x-2.5)+'" cy="'+(y-3)+'" r="2.6" fill="#fff"/><circle cx="'+(x+3)+'" cy="'+(y+5)+'" r="1.2" fill="#fff" opacity=".8"/><path d="M'+(x-10)+' '+(y-9)+' Q'+x+' '+(y-15)+' '+(x+10)+' '+(y-8)+'" stroke="#1d1430" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }); return e; }
  function head(skin,y){ return '<path d="M62 92 C60 60 80 48 100 48 C120 48 140 60 138 92 C138 120 122 136 100 136 C78 136 62 120 62 92Z" fill="'+skin+'"/>'+
    '<ellipse cx="72" cy="'+(y+16)+'" rx="7" ry="4" fill="#ff8fab" opacity=".45"/><ellipse cx="128" cy="'+(y+16)+'" rx="7" ry="4" fill="#ff8fab" opacity=".45"/><path d="M94 '+(y+22)+' Q100 '+(y+27)+' 106 '+(y+22)+'" stroke="#a0404f" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; }
  function hoodie(c1,c2,c3){ return '<path d="M40 200 C40 160 62 140 100 138 C138 140 160 160 160 200Z" fill="'+c1+'"/><path d="M70 146 C78 160 122 160 130 146 C124 140 112 137 100 137 C88 137 76 140 70 146Z" fill="'+c2+'"/>'+
    '<path d="M92 156 L90 182 M108 156 L110 182" stroke="'+c3+'" stroke-width="2.5" stroke-linecap="round"/><circle cx="90" cy="184" r="2.6" fill="'+c3+'"/><circle cx="110" cy="184" r="2.6" fill="'+c3+'"/>'; }
  var bgG='<defs><radialGradient id="cbgA" cx=".5" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ebe4ff"/></radialGradient><radialGradient id="cbgB" cx=".5" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfeaff"/></radialGradient><radialGradient id="cbgC" cx=".5" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcf3e9"/></radialGradient></defs>';
  var star='<path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8Z" fill="#ffd66b"/>';
  var girl='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">'+bgG+'<circle cx="100" cy="100" r="96" fill="url(#cbgA)"/>'+
    '<g transform="translate(36 40)">'+star+'</g><g transform="translate(168 64) scale(.7)">'+star+'</g>'+
    '<path d="M54 100 C46 60 70 40 100 40 C132 40 156 60 146 104 C152 140 150 170 136 182 L64 182 C50 170 48 140 54 100Z" fill="#3b2550"/>'+
    '<circle cx="100" cy="30" r="17" fill="#3b2550"/><circle cx="94" cy="26" r="5" fill="#57386f" opacity=".7"/>'+
    hoodie("#b49cff","#9c84f5","#ffffff")+head("#ffe4d4",92)+
    '<path d="M60 92 C62 62 84 50 104 52 C96 60 92 70 86 72 C82 66 80 64 78 70 C72 76 66 82 60 92Z" fill="#3b2550"/><path d="M140 92 C138 64 120 52 102 52 C112 60 116 70 124 74 C126 68 130 70 132 76 C136 80 138 86 140 92Z" fill="#3b2550"/>'+
    '<path d="M100 52 C98 62 94 68 88 72" stroke="#57386f" stroke-width="2" fill="none"/>'+eyes(96,"#7c4dff")+
    '<g transform="translate(130 50) rotate(15)">'+star+'</g>'+
    '<g transform="rotate(-8 100 178)"><rect x="66" y="166" width="68" height="24" rx="3" fill="#ff8fb1"/><rect x="66" y="166" width="10" height="24" fill="#ff6f9b"/><rect x="80" y="172" width="44" height="3" rx="1.5" fill="#fff" opacity=".8"/></g></svg>';
  var boy='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">'+bgG+'<circle cx="100" cy="100" r="96" fill="url(#cbgB)"/>'+
    '<g transform="translate(34 50)">'+star+'</g><g transform="translate(166 46) scale(.8)">'+star+'</g>'+
    '<path d="M40 200 C40 162 60 144 84 140 L84 200Z M160 200 C160 162 140 144 116 140 L116 200Z" fill="#d4a531"/>'+
    hoodie("#2b4f86","#203d6b","#d4a531")+'<rect x="56" y="150" width="9" height="50" rx="4" fill="#c0392b"/><rect x="135" y="150" width="9" height="50" rx="4" fill="#c0392b"/>'+head("#f8d6bd",94)+
    '<path d="M58 96 C52 58 78 40 104 42 C132 42 152 60 142 98 C140 86 134 76 126 72 C128 80 124 82 120 76 C116 84 108 84 104 76 C98 84 88 82 86 74 C80 80 72 82 70 74 C64 80 60 88 58 96Z" fill="#26213a"/>'+
    '<path d="M104 42 C112 30 126 32 130 40" fill="#26213a"/>'+eyes(98,"#3d6fd6")+
    '<path d="M70 82 l16 -3 M114 79 l16 3" stroke="#26213a" stroke-width="3.4" stroke-linecap="round"/>'+
    '<g transform="rotate(6 100 182)"><rect x="62" y="170" width="76" height="22" rx="3" fill="#ffffff"/><rect x="62" y="170" width="76" height="6" fill="#5b8def"/><text x="100" y="188" font-size="9" text-anchor="middle" font-weight="800" fill="#2b4f86" font-family="Arial">JLPT N5</text></g></svg>';
  function teacher(hair,long,c1,c2){ return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">'+bgG+'<circle cx="100" cy="100" r="96" fill="url(#cbgC)"/>'+
    (long?'<path d="M56 100 C50 58 76 42 100 42 C128 42 152 58 144 102 C148 132 144 150 136 160 L64 160 C56 150 52 132 56 100Z" fill="'+hair+'"/>':'')+
    '<path d="M40 200 C40 160 62 140 100 138 C138 140 160 160 160 200Z" fill="'+c1+'"/><path d="M86 138 L100 170 L114 138Z" fill="#fff"/>'+(long?'':'<path d="M96 146 l4 30 l4 -30z" fill="'+c2+'"/>')+
    head(long?"#f6d3bb":"#eec7a8",94)+
    (long?'<path d="M60 94 C64 62 86 50 108 54 C98 62 84 74 60 94Z M140 94 C136 66 122 54 104 54 C116 64 126 76 140 94Z" fill="'+hair+'"/>':'<path d="M62 90 C58 56 84 44 104 44 C128 44 146 58 138 90 C130 72 118 66 100 66 C84 66 70 74 62 90Z" fill="'+hair+'"/>')+
    eyes(98,"#2e8b6e")+'<circle cx="80" cy="98" r="14" fill="none" stroke="#2b1d3a" stroke-width="2.4"/><circle cx="120" cy="98" r="14" fill="none" stroke="#2b1d3a" stroke-width="2.4"/><path d="M94 98 h12" stroke="#2b1d3a" stroke-width="2.4"/>'+
    '<g transform="rotate(-6 146 172)"><rect x="128" y="146" width="36" height="46" rx="4" fill="#fff" stroke="'+c1+'" stroke-width="3"/><path d="M134 158 h24 M134 166 h24 M134 174 h16" stroke="#9fd8bd" stroke-width="3" stroke-linecap="round"/><path d="M136 182 l5 5 l10 -10" stroke="#1d9e75" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>'; }
  return {girl:girl,boy:boy,tf:teacher("#4a2c22",1,"#1d9e75","#d4a531"),tm:teacher("#2a2321",0,"#0e7c66","#d4a531")};
})();

/* ===== v12 · Guru-style teacher greeting card with character ===== */
(function(){
  function kind(){return lsGet("gia_t_chr")||"ill";}
  function greet(){var h=new Date().getHours();return lang==="bn"?(h<12?"শুভ সকাল":h<17?"শুভ দুপুর":"শুভ সন্ধ্যা"):(h<12?"Good morning":h<17?"Good afternoon":"Good evening");}
  function card(){var L=REQS.filter(inSel),p=L.filter(function(r){return r.status==="Pending";}).length,a=L.filter(function(r){return r.status==="Approved";}).length,st=0;selBatches().forEach(function(b){st+=(b.students||[]).length;});
    return '<div class="card tgx"><div class="tgT"><small>'+greet()+',</small><b>'+esc(NAME)+' 👋</b><span>'+(lang==="bn"?"আজকের ক্লাস প্রস্তুত":"Ready to teach today?")+'</span>'+
      '<div class="tgS"><div><b>'+p+'</b><span>'+(lang==="bn"?"অপেক্ষমাণ":"Pending")+'</span></div><div><b>'+a+'</b><span>'+(lang==="bn"?"অনুমোদিত":"Approved")+'</span></div><div><b>'+st+'</b><span>'+(lang==="bn"?"শিক্ষার্থী":"Students")+'</span></div></div></div>'+
      '<button class="tgChr ill" id="tgChr" title="Tap to change">'+(kind()==="ill"?GIA_ILL.teacher:(GIA_CHR[kind()]||GIA_CHR.tf))+'</button></div>';}
  var _r=render;render=function(){var x=_r.apply(this,arguments);try{if(TAB==="queue"||TAB==="cls"){var v=$("view");if(v&&!v.querySelector(".tgx"))v.insertAdjacentHTML("afterbegin",card());}}catch(e){}return x;};
  document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#tgChr")){lsSet("gia_t_chr",{ill:"tf",tf:"tm",tm:"ill"}[kind()]||"ill");render();}});
})();

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();

/* v58 cinematic cyberpunk login FX */
(function(){
  var LINES=[["SYS","GIA//OFFICE kernel v58 loaded"],["NET","secure channel · TLS 1.3 · firebase"],["AUTH","awaiting operator credentials"]];
  function bg(host){
    if(!host||host.querySelector(".cyBg")) return;
    var b=document.createElement("div"); b.className="cyBg";
    var pts=""; for(var i=0;i<26;i++){ pts+='<i class="pt" style="left:'+(Math.random()*100)+'%;top:'+(60+Math.random()*50)+'%;animation-duration:'+(8+Math.random()*12)+'s;animation-delay:-'+(Math.random()*12)+'s;opacity:'+(.3+Math.random()*.6)+'"></i>'; }
    b.innerHTML='<div class="sky"></div><div class="sun"></div><div class="city"></div><div class="hz"></div><div class="grid"></div>'+pts+'<div class="scan"></div><div class="vig"></div>';
    host.insertBefore(b,host.firstChild);
    var h=document.createElement("div"); h.className="cyHud";
    h.innerHTML='<i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i><div class="tl">GIA · SECURE NODE<br>LAT 22.33N · LNG 91.81E</div><div class="tr">ENCRYPTION · AES-256<br>STATUS · <span class="blink">ARMED</span></div><div class="bl">AGRABAD · CHATTOGRAM<br><span class="cyClock">--:--:--</span></div><div class="br">銀河国際アカデミー<br>ACCESS LEVEL · STAFF</div>';
    host.insertBefore(h,b.nextSibling);
  }
  function glitch(el){ if(!el||el.querySelector(".cyGlitch")) return; var t=el.textContent.trim(); el.innerHTML='<span class="cyGlitch" data-t="'+t.replace(/"/g,"&quot;")+'">'+t+'</span>'; }
  function boot(card,before){
    if(!card||card.querySelector(".cyBoot")) return; var d=document.createElement("div"); d.className="cyBoot"; card.insertBefore(d,before||null);
    var li=0,ch=0,out=[];
    (function step(){ if(li>=LINES.length){ d.innerHTML=out.join("<br>")+' <span class="cur"></span>'; return; }
      var L=LINES[li], full="> ["+L[0]+"] "+L[1]; ch++; var cur=full.slice(0,ch);
      d.innerHTML=out.concat(cur.replace("["+L[0]+"]","<b>["+L[0]+"]</b>")).join("<br>")+'<span class="cur"></span>';
      if(ch>=full.length){ out.push(full.replace("["+L[0]+"]","<b>["+L[0]+"]</b>")); li++; ch=0; setTimeout(step,260); } else setTimeout(step,18+Math.random()*30); })();
  }
  function clock(){ var n=new Date(), s=[n.getHours(),n.getMinutes(),n.getSeconds()].map(function(x){return String(x).padStart(2,"0");}).join(":"); document.querySelectorAll(".cyClock").forEach(function(e){ e.textContent=s+" BST"; }); }
  function init(){
    var lg=document.getElementById("login"); if(!lg) return; bg(lg); var c=lg.querySelector(".lcard");
    var h=c&&c.querySelector("h1"); if(h) glitch(h);
    var who=/teacher/i.test(location.pathname)?"TEACHER":"STUDENT";
    LINES=[["SYS","GIA//"+who+" app online"],["NET","secure channel · firebase"],["AUTH","enter your credentials"]];
    boot(c,c&&c.querySelector("label"));
    lg.querySelectorAll(".cyHud .br").forEach(function(e){ e.innerHTML="銀河国際アカデミー<br>ACCESS · "+who; });
    clock(); setInterval(clock,1000);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
