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
  welcome:"Welcome",routine:"Class routine",next7:"Next 7 days",addChg:"Class off / Extra class",chgType:"Type",cOff:"Class off",cHol:"Holiday",cExtra:"Extra class",cTime:"Time change",date:"Date",time:"Time",reason:"Reason (students will see)",alsoPost:"Also post a notice to students",saveChg:"Save",upChg:"Upcoming changes",noSched:"Routine not set yet — ask the office (Class Schedule).",chgSaved:"Saved — students will see it",post:"Post",newPost:"New class post",toBatch:"To batch",allBatches:"All students",ptTitle:"Title",ptBody:"Message",addPhoto:"Add photo",pinTop:"Pin on top",publish:"Publish",myPosts:"My posts",posted:"Posted to students",noPosts:"No posts yet",del:"Delete",edit:"Edit",confirmDel:"Delete this post?",needTitle:"Write a title and message",leaves:"Leave requests",leave:"Leave",onLeave:"On leave",approve:"Approve",newLeave:"new leave request",leaveWhy:"Reason (student will see):",batchesN:"batches",today:"Today",lastSync:"Office data",noBatch:"No batch assigned to your name — showing all batches"},
 bn:{loginSub:"ব্যাচ অনুযায়ী শিক্ষার্থীর উপস্থিতি অনুমোদন",email:"ইমেইল",pw:"পাসওয়ার্ড",login:"লগইন",forgot:"পাসওয়ার্ড ভুলে গেছেন?",hint:"অফিস থেকে দেওয়া ইমেইল ও পাসওয়ার্ড দিন। পাসওয়ার্ড কাউকে দেবেন না।",install:"অ্যাপ ইনস্টল",
  queue:"অপেক্ষমাণ",cls:"ক্লাস",report:"রিপোর্ট",me:"আমি",mine:"আমার ব্যাচ",all:"সব",pending:"অপেক্ষমাণ",approved:"অনুমোদিত",rejected:"বাতিল",notYet:"এখনো না",
  present:"উপস্থিত",late:"দেরি",absent:"অনুপস্থিত",reject:"বাতিল",approveAll:"সবাইকে উপস্থিত দিন",noPending:"সব ঠিক! কোনো অপেক্ষমাণ চেক-ইন নেই।",in:"প্রবেশ",out:"বের",minLate:"মিনিট দেরি",noGps:"লোকেশন নেই",far:"দূরে",dateMis:"সময় মেলেনি",manual:"শিক্ষক দিয়েছেন",
  rejectWhy:"কারণ (শিক্ষার্থী দেখবে):",rejectDef:"ছবি পরিষ্কার না / ক্লাসে ছিল না",confirmAll:"{0} জনকে উপস্থিত দেবেন?",saved:"সেভ হয়েছে",errSave:"সেভ হয়নি — ইন্টারনেট দেখুন",
  newCI:"নতুন চেক-ইন",tapCompare:"মেলাতে ছবিতে ট্যাপ করুন",selfie:"সেলফি",regPhoto:"রেজিস্টার্ড ছবি",noReg:"রেজিস্টার্ড ছবি নেই",close:"বন্ধ",
  month:"এই মাস",total:"সর্বমোট",students:"শিক্ষার্থী",notif:"নোটিফিকেশন",enable:"চালু করুন",on:"চালু",sound:"শব্দ",logout:"লগআউট",help:"কীভাবে কাজ করে",
  helpTxt:"শিক্ষার্থী GIA Student অ্যাপ থেকে লাইভ সেলফি দিয়ে চেক-ইন করে। সাথে সাথে এখানে দেখাবে (অ্যাপ খোলা রাখুন — শব্দ ও নোটিফিকেশন আসবে)। মুখ ও সময় দেখে উপস্থিত / দেরি দিন, অথবা বাতিল করুন। কেউ ভুলে গেলে ক্লাস ট্যাব থেকে দিন। অনুমোদিত উপস্থিতি অটো অফিস সিস্টেমে চলে যায়।",
  errLogin:"ইমেইল বা পাসওয়ার্ড ভুল",errAccess:"আপনার ইমেইলে এখনো অ্যাক্সেস নেই। অ্যাডমিনকে বলুন: Settings → Staff Users-এ আপনার লগইন ইমেইল দিতে।",errNet:"সংযোগ হয়নি",resetSent:"পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে",enterEmail:"আগে ইমেইল লিখুন",
  welcome:"স্বাগতম",routine:"ক্লাস রুটিন",next7:"আগামী ৭ দিন",addChg:"ক্লাস বন্ধ / অতিরিক্ত ক্লাস",chgType:"ধরন",cOff:"ক্লাস বন্ধ",cHol:"ছুটি",cExtra:"অতিরিক্ত ক্লাস",cTime:"সময় পরিবর্তন",date:"তারিখ",time:"সময়",reason:"কারণ (শিক্ষার্থীরা দেখবে)",alsoPost:"শিক্ষার্থীদের নোটিশও পাঠান",saveChg:"সেভ",upChg:"আসন্ন পরিবর্তন",noSched:"রুটিন এখনো সেট হয়নি — অফিসকে বলুন (Class Schedule)।",chgSaved:"সেভ হয়েছে — শিক্ষার্থীরা দেখবে",post:"পোস্ট",newPost:"নতুন ক্লাস পোস্ট",toBatch:"কোন ব্যাচে",allBatches:"সব শিক্ষার্থী",ptTitle:"শিরোনাম",ptBody:"বার্তা",addPhoto:"ছবি যোগ",pinTop:"উপরে পিন",publish:"পোস্ট করুন",myPosts:"আমার পোস্ট",posted:"শিক্ষার্থীদের কাছে পোস্ট হয়েছে",noPosts:"এখনো কোনো পোস্ট নেই",del:"মুছুন",edit:"এডিট",confirmDel:"এই পোস্ট মুছবেন?",needTitle:"শিরোনাম ও বার্তা লিখুন",leaves:"ছুটির আবেদন",leave:"ছুটি",onLeave:"ছুটিতে",approve:"অনুমোদন",newLeave:"নতুন ছুটির আবেদন",leaveWhy:"কারণ (শিক্ষার্থী দেখবে):",batchesN:"টি ব্যাচ",today:"আজ",lastSync:"অফিস ডেটা",noBatch:"আপনার নামে কোনো ব্যাচ নেই — সব ব্যাচ দেখানো হচ্ছে"}
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
function applyStatic(){document.body.classList.add("glass");document.documentElement.lang=lang;var els=document.querySelectorAll("[data-t]");for(var i=0;i<els.length;i++)els[i].textContent=t(els[i].getAttribute("data-t"));}
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
  $("view").innerHTML=({queue:vQueue,cls:vClass,post:vPost,report:vReport,me:vMe}[TAB])();
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
  return statsBar()+(LV.length?'<h4 class="mut" style="margin:4px 4px 8px">🌴 '+t("leaves")+' ('+LV.length+')</h4>'+LV.map(leaveCard).join(""):'')+(L.length?'<div class="bulk"><span class="mut">'+t("tapCompare")+'</span><button class="btn sm" id="bulkBtn">✅ '+t("approveAll")+' ('+L.length+')</button></div>'+L.map(reqCard).join(""):'<div class="card empty"><div class="big">🎉</div>'+t("noPending")+'</div>')+
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
function vMe(){var perm=(window.Notification&&Notification.permission)||"na";
  return '<div class="card"><div class="kv"><div><span>'+t("email")+'</span>'+esc(USER&&USER.email)+'</div><div><span>'+t("mine")+'</span>'+esc(MY.join(", ")||"—")+'</div></div>'+(MY.length?'':'<div class="mut" style="margin-top:8px">ℹ '+t("noBatch")+'</div>')+'</div>'+
   '<div class="card"><div class="row"><span style="flex:1">🔔 '+t("notif")+'</span>'+(perm==="granted"?'<span class="tag ok">'+t("on")+'</span>':perm==="na"?'<span class="tag">—</span>':'<button class="btn sm" id="nBtn">'+t("enable")+'</button>')+'</div>'+
   '<div class="row"><span style="flex:1">🔊 '+t("sound")+'</span><button class="sw'+(lsGet(LS.sound)!=="0"?" on":"")+'" id="sBtn"><i></i></button></div>'+
   '<div class="row"><span style="flex:1">🌐 Language</span><button class="btn sm ghost" id="lBtn">EN / বাংলা</button></div></div>'+
   '<div class="card"><b>💡 '+t("help")+'</b><p class="mut" style="line-height:1.6">'+t("helpTxt")+'</p></div>'+
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
function onClick(e){var el=e.target.closest("#chgBtn,[data-cd],[data-pe],[data-pd],[data-lv],[data-sel],[data-tab],[data-dec],[data-man],[data-zoom],#bulkBtn,#nBtn,#sBtn,#lBtn,#outBtn");if(!el)return;primeAudio();
  if(el.dataset.sel!=null){SEL=el.dataset.sel;lsSet(LS.sel,SEL);render();return;}
  if(el.dataset.tab){TAB=el.dataset.tab;render();window.scrollTo(0,0);return;}
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
function boot(){lsSet("gia_app_role","teacher");init();applyStatic();
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
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
