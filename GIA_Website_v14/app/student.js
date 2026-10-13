var sha256=function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;n<64;p++)if(!o[p]){for(d=0;d<313;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;d<64;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=d<16?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;d<8;d++)l[d]=l[d]+r[d]|0}for(d=0;d<8;d++)for(e=3;e+1;e--){var y=l[d]>>e*8&255;i+=(y<16?0:"")+y.toString(16)}return i};
function _utf8(t){try{return unescape(encodeURIComponent(t));}catch(e){return String(t);}}
/* ===== GIA Student app v2 ===== */
(function(){
"use strict";
var CFG={apiKey:"AIzaSyAQRyQkxjAWEwgh5nn11Bmo72ke9-bYciQ",authDomain:"gia-erp.firebaseapp.com",projectId:"gia-erp",storageBucket:"gia-erp.firebasestorage.app",messagingSenderId:"951435359568",appId:"1:951435359568:web:347edd9a6364611e83e855"};
var PHONE="+8801830150171", WA="8801830150171", SITE="../";
var LS={key:"gia_stu_key",cache:"gia_stu_cache",notices:"gia_stu_notices",lang:"gia_stu_lang",seen:"gia_stu_seen",cfg:"gia_stu_cfg",selfie:"gia_stu_selfie",dark:"gia_stu_dark",quiz:"gia_stu_quiz",leaves:"gia_stu_leaves",ci:"gia_stu_ci"};
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
var T={
 en:{sid:"Student ID",phone:"Phone number (given at admission)",login:"Log in",loginSub:"Galaxy International Academy",loginHint:"Only you can see your own information. Problem? Call the office.",offline:"Offline — showing last saved data",install:"Install app",
  home:"Home",fees:"Fees",att:"Attendance",notices:"Notices",more:"More",
  hello:"Hello",totalFee:"Total fee",paid:"Paid",due:"Due",paidPct:"of fee paid",attendance:"Attendance",nextInst:"Next installment",none:"Nothing yet",
  inst:"Installments",payHist:"Payment history",receipt:"Receipt",cls:"My class",teacher:"Teacher",shift:"Shift / time",start:"Start date",course:"Course",batch:"Batch",enroll:"Admission date",
  present:"Present",late:"Late",absent:"Absent",total:"Total classes",recent:"Recent classes",
  myTests:"My exams",progress:"My progress",jlpt:"JLPT / exam",visa:"Visa",app:"School application",docs:"Documents",stage:"Stage",
  noNotice:"No notices right now",tools:"Study tools",mock:"JLPT N5 mock test",check:"Document checklist",elig:"Eligibility check",web:"Website",
  contact:"Contact office",call:"Call",wa:"WhatsApp",logout:"Log out",updated:"Updated",errNF:"Student ID or phone number did not match. Use the phone number you gave at admission.",errNet:"Could not connect. Check internet and try again.",errFill:"Enter Student ID and phone number",
  overdue:"Overdue",pending:"Pending",paidS:"Paid",waitMsg:"Loading…",allStu:"All students",
  todayAtt:"Today's attendance",checkIn:"Check in with selfie",checkOut:"Check out with selfie",ciPending:"Waiting for teacher approval",ciApproved:"Approved by teacher",ciRejected:"Rejected",ciDone:"Done for today — see you next class!",ciOff:"Selfie check-in is turned off by the office",
  inT:"In",outT:"Out",camTitleIn:"Check-in selfie",camTitleOut:"Check-out selfie",camHint:"Keep your face inside the circle, good light, no mask",shoot:"Take photo",retake:"Retake",submit:"Submit",locating:"Finding your location…",locOk:"Location found",locFar:"You are far from the academy",locNo:"Location not available",camErr:"Camera could not open. Allow camera permission in browser settings and try again.",sending:"Sending…",sent:"Submitted! Waiting for teacher approval.",farBlock:"You must be at the academy to check in.",already:"Today's attendance is already marked by your teacher.",
  myCheckins:"My check-ins (last 7 days)",leave:"Leave",leaveReq:"Apply for leave",leaveDate:"Date",leaveWhy:"Reason",leaveSend:"Send request",leaveSent:"Leave request sent to your teacher",leaveMine:"My leave requests",cancel:"Cancel",cancelled:"Cancelled",leaveErr:"Pick a date and write a reason",leaveDup:"You already sent a request for this date",payOnline:"Pay online",payTitle:"Online payment",paySoon:"Coming soon",payMaint:"Under maintenance",payOffice:"Pay at office",nextClass:"Class starts in",inProgress:"Class in progress",badges:"Achievements",bStreak:"5-day streak",bStar:"Star attendee",bKana:"Kana champ",bFee:"Fees clear",bFirst:"First check-in",streak:"day streak",jlptCd:"days to JLPT",wod:"Word of the day",kana:"Kana quiz",kanaQ:"Which romaji is this?",score:"Score",next:"Next",idCard:"Digital student ID",showOffice:"Show this card at the office",dark:"Dark mode",notif:"Approval alerts",notifOn:"On",enable:"Enable",tapFlip:"tap to see meaning",correct:"Correct!",wrong:"Oops — it was",approvedMsg:"Your attendance was approved ✅",rejectedMsg:"Your check-in was rejected"},
 bn:{sid:"স্টুডেন্ট আইডি",phone:"ফোন নম্বর (ভর্তির সময় দেওয়া)",login:"লগইন",loginSub:"গ্যালাক্সি ইন্টারন্যাশনাল একাডেমি",loginHint:"শুধু আপনি আপনার তথ্য দেখতে পারবেন। সমস্যা হলে অফিসে কল করুন।",offline:"অফলাইন — শেষ সেভ করা তথ্য দেখানো হচ্ছে",install:"অ্যাপ ইনস্টল",
  home:"হোম",fees:"ফি",att:"উপস্থিতি",notices:"নোটিশ",more:"আরও",
  hello:"স্বাগতম",totalFee:"মোট ফি",paid:"পরিশোধ",due:"বকেয়া",paidPct:"ফি পরিশোধ হয়েছে",attendance:"উপস্থিতি",nextInst:"পরের কিস্তি",none:"এখনো কিছু নেই",
  inst:"কিস্তি",payHist:"পেমেন্টের ইতিহাস",receipt:"রসিদ",cls:"আমার ক্লাস",teacher:"শিক্ষক",shift:"শিফট / সময়",start:"শুরুর তারিখ",course:"কোর্স",batch:"ব্যাচ",enroll:"ভর্তির তারিখ",
  present:"উপস্থিত",late:"দেরি",absent:"অনুপস্থিত",total:"মোট ক্লাস",recent:"সাম্প্রতিক ক্লাস",
  myTests:"আমার পরীক্ষা",progress:"আমার অগ্রগতি",jlpt:"JLPT / পরীক্ষা",visa:"ভিসা",app:"স্কুলে আবেদন",docs:"কাগজপত্র",stage:"ধাপ",
  noNotice:"এখন কোনো নোটিশ নেই",tools:"পড়ার টুলস",mock:"JLPT N5 মক টেস্ট",check:"কাগজপত্রের চেকলিস্ট",elig:"যোগ্যতা যাচাই",web:"ওয়েবসাইট",
  contact:"অফিসে যোগাযোগ",call:"কল",wa:"হোয়াটসঅ্যাপ",logout:"লগআউট",updated:"আপডেট",errNF:"স্টুডেন্ট আইডি বা ফোন নম্বর মেলেনি। ভর্তির সময় দেওয়া নম্বর দিন।",errNet:"সংযোগ হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।",errFill:"স্টুডেন্ট আইডি ও ফোন নম্বর দিন",
  overdue:"মেয়াদোত্তীর্ণ",pending:"বাকি",paidS:"পরিশোধিত",waitMsg:"লোড হচ্ছে…",allStu:"সব শিক্ষার্থী",
  todayAtt:"আজকের উপস্থিতি",checkIn:"সেলফি দিয়ে চেক-ইন",checkOut:"সেলফি দিয়ে চেক-আউট",ciPending:"শিক্ষকের অনুমোদনের অপেক্ষায়",ciApproved:"শিক্ষক অনুমোদন করেছেন",ciRejected:"বাতিল হয়েছে",ciDone:"আজকের কাজ শেষ — পরের ক্লাসে দেখা হবে!",ciOff:"অফিস সেলফি চেক-ইন বন্ধ রেখেছে",
  inT:"প্রবেশ",outT:"বের",camTitleIn:"চেক-ইন সেলফি",camTitleOut:"চেক-আউট সেলফি",camHint:"মুখ বৃত্তের ভেতরে রাখুন, আলো ভালো রাখুন, মাস্ক খুলুন",shoot:"ছবি তুলুন",retake:"আবার তুলুন",submit:"জমা দিন",locating:"আপনার লোকেশন খোঁজা হচ্ছে…",locOk:"লোকেশন পাওয়া গেছে",locFar:"আপনি একাডেমি থেকে দূরে",locNo:"লোকেশন পাওয়া যায়নি",camErr:"ক্যামেরা খোলেনি। ব্রাউজার সেটিংসে ক্যামেরার অনুমতি দিয়ে আবার চেষ্টা করুন।",sending:"পাঠানো হচ্ছে…",sent:"জমা হয়েছে! শিক্ষকের অনুমোদনের অপেক্ষায়।",farBlock:"চেক-ইন করতে একাডেমিতে থাকতে হবে।",already:"আজকের উপস্থিতি শিক্ষক আগেই দিয়েছেন।",
  myCheckins:"আমার চেক-ইন (শেষ ৭ দিন)",leave:"ছুটি",leaveReq:"ছুটির আবেদন",leaveDate:"তারিখ",leaveWhy:"কারণ",leaveSend:"আবেদন পাঠান",leaveSent:"ছুটির আবেদন শিক্ষকের কাছে গেছে",leaveMine:"আমার ছুটির আবেদন",cancel:"বাতিল",cancelled:"বাতিল করা",leaveErr:"তারিখ ও কারণ দিন",leaveDup:"এই তারিখে আগেই আবেদন করেছেন",payOnline:"অনলাইনে পেমেন্ট",payTitle:"অনলাইন পেমেন্ট",paySoon:"শীঘ্রই আসছে",payMaint:"রক্ষণাবেক্ষণ চলছে",payOffice:"অফিসে পেমেন্ট দিন",nextClass:"ক্লাস শুরু হবে",inProgress:"ক্লাস চলছে",badges:"অর্জন",bStreak:"৫ দিনের ধারা",bStar:"সেরা উপস্থিতি",bKana:"কানা চ্যাম্পিয়ন",bFee:"ফি পরিশোধিত",bFirst:"প্রথম চেক-ইন",streak:"দিনের ধারা",jlptCd:"দিন বাকি JLPT",wod:"আজকের শব্দ",kana:"কানা কুইজ",kanaQ:"এটার রোমাজি কোনটি?",score:"স্কোর",next:"পরেরটি",idCard:"ডিজিটাল স্টুডেন্ট আইডি",showOffice:"অফিসে এই কার্ড দেখান",dark:"ডার্ক মোড",notif:"অনুমোদনের নোটিফিকেশন",notifOn:"চালু",enable:"চালু করুন",tapFlip:"অর্থ দেখতে ট্যাপ করুন",correct:"সঠিক!",wrong:"ভুল — সঠিক ছিল",approvedMsg:"আপনার উপস্থিতি অনুমোদিত হয়েছে ✅",rejectedMsg:"আপনার চেক-ইন বাতিল হয়েছে"}
};
var WORDS=[["水","みず","mizu","water","পানি"],["食べる","たべる","taberu","to eat","খাওয়া"],["学校","がっこう","gakkou","school","স্কুল"],["先生","せんせい","sensei","teacher","শিক্ষক"],["友達","ともだち","tomodachi","friend","বন্ধু"],["本","ほん","hon","book","বই"],["電車","でんしゃ","densha","train","ট্রেন"],["行く","いく","iku","to go","যাওয়া"],["来る","くる","kuru","to come","আসা"],["見る","みる","miru","to see","দেখা"],["大きい","おおきい","ookii","big","বড়"],["小さい","ちいさい","chiisai","small","ছোট"],["今日","きょう","kyou","today","আজ"],["明日","あした","ashita","tomorrow","আগামীকাল"],["仕事","しごと","shigoto","work / job","কাজ"],["お金","おかね","okane","money","টাকা"],["日本","にほん","nihon","Japan","জাপান"],["時間","じかん","jikan","time","সময়"],["名前","なまえ","namae","name","নাম"],["家","いえ","ie","house","বাড়ি"],["飲む","のむ","nomu","to drink","পান করা"],["話す","はなす","hanasu","to speak","কথা বলা"],["書く","かく","kaku","to write","লেখা"],["読む","よむ","yomu","to read","পড়া"],["新しい","あたらしい","atarashii","new","নতুন"],["高い","たかい","takai","expensive / tall","দামি / উঁচু"],["安い","やすい","yasui","cheap","সস্তা"],["朝","あさ","asa","morning","সকাল"],["夜","よる","yoru","night","রাত"],["駅","えき","eki","station","স্টেশন"],["病院","びょういん","byouin","hospital","হাসপাতাল"],["勉強","べんきょう","benkyou","study","পড়াশোনা"],["天気","てんき","tenki","weather","আবহাওয়া"],["元気","げんき","genki","healthy / fine","ভালো আছি"],["ありがとう","ありがとう","arigatou","thank you","ধন্যবাদ"],["山","やま","yama","mountain","পাহাড়"],["川","かわ","kawa","river","নদী"],["車","くるま","kuruma","car","গাড়ি"],["雨","あめ","ame","rain","বৃষ্টি"],["花","はな","hana","flower","ফুল"]];
var KANA="あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa をwo んn".split(" ").map(function(x){return [x.charAt(0),x.slice(1)];});
var lang=lsGet(LS.lang)||"en", tab="home", D=null, N=[], fdb=null, ACFG=null, TODAY=null, HIST=null, pollT=null, PAY=null, LEAVES=null, ANIM=false, KSTREAK=0;
function t(k){return (T[lang]&&T[lang][k])||T.en[k]||k;}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function money(n,cur){n=Number(n||0);var s=Math.round(n).toLocaleString("en-IN");return (cur&&cur!=="BDT"?cur+" ":"৳ ")+s;}
function digits(x){return String(x||"").replace(/[^0-9]/g,"");}
function keyOf(sid,phone){var d=digits(phone).slice(-10);if(!sid||d.length<6)return "";return sha256(_utf8("gia|"+String(sid).trim().toLowerCase()+"|"+d));}
function $(id){return document.getElementById(id);}
function ld(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function ldAdd(s,n){var d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return ld(d);}
function today(){return ld();}
function tsDate(x){if(!x)return null;if(typeof x.toDate==="function")return x.toDate();if(x.seconds)return new Date(x.seconds*1000);var d=new Date(x);return isNaN(d)?null:d;}
function hm(d){return d?d.toLocaleTimeString(lang==="bn"?"bn-BD":"en-GB",{hour:"2-digit",minute:"2-digit"}):"—";}
function initFB(){if(fdb)return fdb;try{if(window.firebase){var app=firebase.apps.length?firebase.app():firebase.initializeApp(CFG);fdb=firebase.firestore(app);}}catch(e){}return fdb;}
function SV(){try{return firebase.firestore.FieldValue.serverTimestamp();}catch(e){return new Date().toISOString();}}
function applyStatic(){document.documentElement.lang=lang==="bn"?"bn":"en";var els=document.querySelectorAll("[data-t]");for(var i=0;i<els.length;i++)els[i].textContent=t(els[i].getAttribute("data-t"));document.body.classList.toggle("dark",lsGet(LS.dark)==="1");}
async function fetchDoc(k){var f=initFB();if(!f)throw new Error("net");var s=await f.collection("student_portal").doc(k).get();return s.exists?s.data():null;}
async function fetchNotices(){try{var f=initFB();if(!f)return null;var s=await f.collection("student_portal").doc("notices").get();return s.exists?(s.data().list||[]):[];}catch(e){return null;}}
async function fetchCfg(){try{var f=initFB();if(!f)return;f.collection("student_portal").doc("payinfo").get().then(function(p){PAY=p.exists?p.data():null;}).catch(function(){});var s=await f.collection("student_portal").doc("config").get();if(s.exists){ACFG=s.data().att||null;lsSet(LS.cfg,JSON.stringify(ACFG));}}catch(e){}}
function attRef(date){var f=initFB();return f&&f.collection("att_requests").doc(lsGet(LS.key)+"_"+(date||today()));}
async function fetchToday(){try{var r=attRef();if(!r)return;var s=await r.get();var prev=TODAY;TODAY=s.exists?s.data():null;
  if(prev&&TODAY&&prev.status==="Pending"&&TODAY.status!=="Pending")alertStatus(TODAY);}catch(e){}}
async function fetchHist(){try{var f=initFB();if(!f)return;var days=[];for(var i=0;i<7;i++)days.push(ldAdd(today(),-i));var ss=await Promise.all(days.map(function(d){return attRef(d).get().catch(function(){return null;});}));HIST=ss.map(function(s,i){return s&&s.exists?Object.assign({date:days[i]},s.data()):{date:days[i]};});}catch(e){}}
function confetti(){var C=["#c0392b","#c9a24a","#1e9e6a","#2e86de","#ff7aa2"];var w=document.createElement("div");w.className="confetti";for(var i=0;i<46;i++){var e=document.createElement("i");e.style.left=Math.random()*100+"%";e.style.background=C[i%C.length];e.style.animationDelay=(Math.random()*.4)+"s";e.style.transform="rotate("+Math.random()*360+"deg)";w.appendChild(e);}document.body.appendChild(w);setTimeout(function(){w.remove();},2600);}
function alertStatus(r){if(r.status==="Approved")confetti();var m=r.status==="Approved"?t("approvedMsg"):t("rejectedMsg")+(r.note?" — "+r.note:"");toast(m);try{navigator.vibrate&&navigator.vibrate([120,60,120]);}catch(e){}
  try{if(window.Notification&&Notification.permission==="granted"){if(navigator.serviceWorker&&navigator.serviceWorker.ready){navigator.serviceWorker.ready.then(function(reg){reg.showNotification("GIA Student",{body:m,icon:"icon-192.png",tag:"att"});});}else new Notification("GIA Student",{body:m,icon:"icon-192.png"});}}catch(e){}}
function toast(m){var el=document.createElement("div");el.className="toast";el.textContent=m;document.body.appendChild(el);setTimeout(function(){el.classList.add("out");},3200);setTimeout(function(){el.remove();},3800);}
async function login(){
  var sid=$("in_sid").value.trim(), ph=$("in_phone").value.trim(), er=$("lerr");er.textContent="";
  if(!sid||digits(ph).length<6){er.textContent=t("errFill");return;}
  var k=keyOf(sid,ph), b=$("btnLogin");b.disabled=true;b.textContent=t("waitMsg");
  try{var doc=await fetchDoc(k);if(!doc){er.textContent=t("errNF");$("login").querySelector(".lcard").classList.add("shake");setTimeout(function(){$("login").querySelector(".lcard").classList.remove("shake");},500);return;}
    lsSet(LS.key,k);lsSet(LS.cache,JSON.stringify(doc));D=doc;var n=await fetchNotices();if(n){N=n;lsSet(LS.notices,JSON.stringify(n));}
    await Promise.all([fetchCfg(),fetchToday()]);showMain();
  }catch(e){er.textContent=t("errNet");}
  finally{b.disabled=false;b.textContent=t("login");}
}
async function refresh(){
  var k=lsGet(LS.key);if(!k)return;
  try{var doc=await fetchDoc(k);if(!doc){logout();return;}D=doc;lsSet(LS.cache,JSON.stringify(doc));$("offline").hidden=true;}
  catch(e){$("offline").hidden=false;}
  var n=await fetchNotices();if(n){N=n;lsSet(LS.notices,JSON.stringify(n));}
  await Promise.all([fetchCfg(),fetchToday()]);if(tab==="att")await fetchHist();
  render();
}
function logout(){["key","cache","notices","selfie"].forEach(function(k){lsSet(LS[k],null);});D=null;TODAY=null;HIST=null;$("main").hidden=true;$("login").hidden=false;}
function dat(){return (D&&D.data)||{};}
function myNotices(){var c=(dat().course||"");return (N||[]).filter(function(n){return !n.course||n.course===c;}).sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||String(b.date).localeCompare(String(a.date));});}
function unseen(){var s=lsGet(LS.seen)||"";return myNotices().filter(function(n){return n.date>s;}).length;}
var TABS=[["home","🏠"],["fees","💳"],["att","📅"],["notices","📢"],["more","✨"]];
function showMain(){$("login").hidden=true;$("main").hidden=false;render();startPoll();}
function startPoll(){clearInterval(pollT);pollT=setInterval(function(){if(TODAY&&TODAY.status==="Pending"&&document.visibilityState!=="hidden"){fetchToday().then(function(){if(tab==="home")render();});}},30000);}
function render(){
  var d=dat();applyStatic();
  $("hName").textContent=d.name||(D&&D.name)||"—";
  $("hSub").textContent=[d.sid||(D&&D.sid),d.course].filter(Boolean).join(" · ");
  var u=unseen();
  $("tabs").innerHTML=TABS.map(function(x){return '<button class="'+(tab===x[0]?"on":"")+'" data-tab="'+x[0]+'"><i>'+x[1]+'</i><span>'+t(x[0])+(x[0]==="notices"&&u?'<span class="badge">'+u+'</span>':'')+'</span></button>';}).join("");
  var bs=$("tabs").querySelectorAll("button");for(var i=0;i<bs.length;i++)bs[i].onclick=function(){go(this.getAttribute("data-tab"));};
  var v=$("view");
  if(!D.data){v.innerHTML=legacy();bind();return;}
  v.innerHTML='<div class="fade">'+({home:vHome,fees:vFees,att:vAtt,notices:vNotices,more:vMore}[tab]||vHome)()+'</div>';
  bind();
  if(tab==="home"&&!ANIM){ANIM=true;var cs=v.querySelectorAll(".cntv[data-v]"),cur=dat().currency;for(var j=0;j<cs.length;j++)(function(el){var to=+el.getAttribute("data-v"),i=0;var st=function(){i++;el.textContent=money(to*Math.min(1,1-Math.pow(1-i/30,3)),cur);if(i<30)requestAnimationFrame(st);};st();})(cs[j]);}
}
function bind(){var lo=$("btnOut");if(lo)lo.onclick=logout;
  var a=document.querySelectorAll("[data-act]");for(var i=0;i<a.length;i++)a[i].onclick=function(){ACT[this.getAttribute("data-act")](this);};}
var ACT={
  ci:function(){openCam("in");},co:function(){openCam("out");},
  flip:function(el){el.classList.toggle("flipped");},
  kana:function(el){kanaAnswer(el.getAttribute("data-v"));},
  knext:function(){QZ=null;render();},
  pay:function(){payModal();},
  leave:function(){leaveSubmit();},
  lvc:function(el){leaveCancel(el.getAttribute("data-d"));},
  dark:function(){lsSet(LS.dark,lsGet(LS.dark)==="1"?"0":"1");render();},
  notif:function(){try{Notification.requestPermission().then(function(){render();});}catch(e){}},
  lang:function(){toggleLang();}
};
function go(x){tab=x;if(x==="notices")lsSet(LS.seen,today());if(x==="att"&&!HIST){fetchHist().then(function(){if(tab==="att")render();});}if(x==="att"&&!LEAVES){fetchLeaves().then(function(){if(tab==="att")render();});}render();window.scrollTo(0,0);}
function instState(i){var s=String(i.status||"").toLowerCase();if(s==="paid")return["p-ok",t("paidS")];if(i.due&&i.due<today())return["p-bad",t("overdue")];return["p-warn",t("pending")];}
function nextInst(d){var L=(d.installments||[]).filter(function(i){return String(i.status).toLowerCase()!=="paid";}).sort(function(a,b){return String(a.due).localeCompare(String(b.due));});return L[0];}
function streak(){var r=((dat().attendance||{}).recent||[]),n=0;for(var i=0;i<r.length;i++){if(r[i].status==="Present"||r[i].status==="Late")n++;else break;}return n;}
function jlptDays(){var now=new Date();now.setHours(0,0,0,0);function firstSun(y,m){var d=new Date(y,m,1);while(d.getDay()!==0)d.setDate(d.getDate()+1);return d;}var y=now.getFullYear(),c=[firstSun(y,6),firstSun(y,11),firstSun(y+1,6)];for(var i=0;i<c.length;i++){if(c[i]>=now)return [Math.round((c[i]-now)/864e5),c[i]];}return [0,now];}
function wod(){var d=new Date(),i=(d.getFullYear()*372+d.getMonth()*31+d.getDate())%WORDS.length;return WORDS[i];}
/* ---- check-in card ---- */
function ciCard(){
  var cfg=ACFG||{};
  if(cfg.enabled===false)return '<div class="card ci off"><h3>📸 '+t("todayAtt")+'</h3><div class="empty">'+t("ciOff")+'</div></div>';
  var r=TODAY,io=r&&(tsDate(r.inTs)||tsDate(r.inAt)),oo=r&&(tsDate(r.outTs)||tsDate(r.outAt));
  if(!r)return '<div class="card ci"><div class="ciRow"><div><h3>📸 '+t("todayAtt")+'</h3><p class="muted">'+esc(new Date().toLocaleDateString(lang==="bn"?"bn-BD":"en-GB",{weekday:"long",day:"numeric",month:"long"}))+'</p></div><div class="pulse">●</div></div><button class="btn big" data-act="ci">📷 '+t("checkIn")+'</button></div>';
  var st=r.status==="Approved"?'<span class="pill p-ok">✅ '+t("ciApproved")+(r.mark&&r.mark!=="Present"?" · "+esc(t(r.mark.toLowerCase())):"")+'</span>':r.status==="Rejected"?'<span class="pill p-bad">✗ '+t("ciRejected")+(r.note?" — "+esc(r.note):"")+'</span>':'<span class="pill p-warn">⏳ '+t("ciPending")+'</span>';
  var pics=(r.inPhoto?'<img src="'+r.inPhoto+'" alt="">':'')+(r.outPhoto?'<img src="'+r.outPhoto+'" alt="">':'');
  var canOut=!oo&&r.status!=="Rejected"&&!r.manual;
  return '<div class="card ci st-'+esc(r.status)+'"><h3>📸 '+t("todayAtt")+'</h3><div class="ciBody">'+(pics?'<div class="ciPics">'+pics+'</div>':'')+'<div><div class="ciTimes">🟢 '+t("inT")+' <b>'+hm(io)+'</b>'+(oo?'<br>🔴 '+t("outT")+' <b>'+hm(oo)+'</b>':'')+'</div>'+st+'</div></div>'+
   (canOut?'<button class="btn big ghost" data-act="co">📷 '+t("checkOut")+'</button>':(oo?'<div class="done">🎉 '+t("ciDone")+'</div>':''))+'</div>';
}
function myLeaveDates(){try{return JSON.parse(lsGet(LS.leaves)||"[]");}catch(e){return [];}}
async function fetchLeaves(){var f=initFB();if(!f)return;var ds=myLeaveDates().filter(function(d){return d>=ldAdd(today(),-30);});try{var ss=await Promise.all(ds.map(function(d){return f.collection("leave_requests").doc(lsGet(LS.key)+"_L_"+d).get().catch(function(){return null;});}));LEAVES=ss.map(function(x,i){return x&&x.exists?Object.assign({date:ds[i]},x.data()):null;}).filter(Boolean).sort(function(a,b){return String(b.date).localeCompare(String(a.date));});}catch(e){LEAVES=[];}}
async function leaveSubmit(){var dt=($("lv_date")||{}).value,rs=(($("lv_why")||{}).value||"").trim();if(!dt||rs.length<3){toast("⚠ "+t("leaveErr"));return;}
  if(myLeaveDates().indexOf(dt)>=0&&(LEAVES||[]).some(function(l){return l.date===dt&&l.status!=="Cancelled";})){toast(t("leaveDup"));return;}
  var d=dat(),b=$("lv_btn");b.disabled=true;
  try{await initFB().collection("leave_requests").doc(lsGet(LS.key)+"_L_"+dt).set({key:lsGet(LS.key),sid:String(d.sid||""),name:String(d.name||"").slice(0,120),batch:String(d.batch||""),date:dt,reason:rs.slice(0,300),createdTs:SV(),status:"Pending"});
    var L=myLeaveDates();if(L.indexOf(dt)<0)L.push(dt);lsSet(LS.leaves,JSON.stringify(L.slice(-40)));toast("✅ "+t("leaveSent"));await fetchLeaves();render();}
  catch(e){b.disabled=false;toast(/permission/i.test(String(e&&(e.code||e.message)))?t("leaveDup"):"⚠ "+t("errNet"));}}
async function leaveCancel(dt){try{await initFB().collection("leave_requests").doc(lsGet(LS.key)+"_L_"+dt).update({status:"Cancelled"});await fetchLeaves();render();}catch(e){toast("⚠ "+t("errNet"));}}
function payBtn(){return PAY&&PAY.status!=="off"?'<button class="btn paybtn" data-act="pay">💳 '+t("payOnline")+' <span class="soon">'+t("paySoon")+'</span></button>':'';}
function payModal(){var M=(PAY&&PAY.methods&&PAY.methods.length?PAY.methods:["bKash","Nagad","Card"]),ic={bKash:"🟣",Nagad:"🟠",Rocket:"🟪",Card:"💳"};var m=document.createElement("div");m.className="sheet";
  m.innerHTML='<div class="sheetIn"><div class="grab"></div><h3>💳 '+t("payTitle")+'</h3><div class="maint"><div class="gear">⚙</div><b>🛠 '+t("payMaint")+'</b><p>'+esc((PAY&&PAY.msg)||"Online payment is under maintenance. Please pay at the office.")+'</p></div><div class="pm">'+M.map(function(x){return '<div class="pmi"><span>'+(ic[x]||"💠")+'</span>'+esc(x)+'<em>'+t("paySoon")+'</em></div>';}).join("")+'</div><a class="btn" href="tel:'+PHONE+'">📞 '+t("payOffice")+'</a><button class="btn ghost" id="sheetX">OK</button></div>';
  document.body.appendChild(m);requestAnimationFrame(function(){m.classList.add("on");});var close=function(){m.classList.remove("on");setTimeout(function(){m.remove();},300);};$("sheetX").onclick=close;m.onclick=function(e){if(e.target===m)close();};}
function badges(){var d=dat(),a=d.attendance||{},q=JSON.parse(lsGet(LS.quiz)||'{"r":0}'),B=[];
  if(lsGet(LS.ci)||TODAY)B.push(["📸",t("bFirst")]);if(streak()>=5)B.push(["🔥",t("bStreak")]);if(a.total>=5&&(a.pct||0)>=90)B.push(["🏅",t("bStar")]);if(q.r>=20)B.push(["🈁",t("bKana")]);if(d.fee&&d.due<=0)B.push(["💎",t("bFee")]);
  return B.length?'<div class="badges">'+B.map(function(b,i){return '<span class="bdg" style="animation-delay:'+(i*.08)+'s">'+b[0]+' '+esc(b[1])+'</span>';}).join("")+'</div>':'';}
function nextClass(){var c=dat().cls||{},m=String(c.time||"").match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);if(!m)return "";var h=+m[1],mi=+(m[2]||0),ap=(m[3]||"").toLowerCase();if(ap==="pm"&&h<12)h+=12;if(ap==="am"&&h===12)h=0;
  var now=new Date(),st=h*60+mi,cur=now.getHours()*60+now.getMinutes(),df=st-cur;if(df>0&&df<=600)return '<div class="nextc"><span class="dotp"></span>⏰ '+t("nextClass")+' <b>'+(df>=60?Math.floor(df/60)+"h ":"")+(df%60)+"m"+'</b> · '+esc(c.time)+'</div>';if(df<=0&&df>-120)return '<div class="nextc live"><span class="dotp"></span>🏫 '+t("inProgress")+' · '+esc(c.time)+'</div>';return "";}
function vHome(){
  var d=dat(),a=d.attendance||{},pct=d.fee?Math.min(100,Math.round(d.paid/d.fee*100)):0,ni=nextInst(d),nn=myNotices().slice(0,2),sk=streak(),jl=jlptDays(),w=wod();
  return '<div class="card hero"><div class="orb o1"></div><div class="orb o2"></div><h2>'+t("hello")+', '+esc((d.name||"").split(" ")[0])+' 👋</h2><p>'+esc([d.course,d.batch].filter(Boolean).join(" · "))+'</p>'+
   '<div class="stats"><div class="stat"><b class="cntv" data-v="'+(d.fee||0)+'">'+money(d.fee,d.currency)+'</b><span>'+t("totalFee")+'</span></div><div class="stat"><b class="cntv" data-v="'+(d.paid||0)+'">'+money(d.paid,d.currency)+'</b><span>'+t("paid")+'</span></div><div class="stat"><b class="cntv" data-v="'+(d.due||0)+'">'+money(d.due,d.currency)+'</b><span>'+t("due")+'</span></div></div></div>'+
   nextClass()+ciCard()+badges()+
   '<div class="minis"><div class="mini"><b>🔥 '+sk+'</b><span>'+t("streak")+'</span></div><div class="mini"><b>🗾 '+jl[0]+'</b><span>'+t("jlptCd")+'</span></div><div class="mini"><b>'+(a.total?(a.pct||0)+'%':'—')+'</b><span>'+t("attendance")+'</span></div></div>'+
   '<div class="card"><h3>💳 '+pct+'% '+t("paidPct")+'</h3><div class="bar"><i style="width:'+pct+'%"></i></div>'+
   (ni?'<div class="row"><div>'+t("nextInst")+'<small>'+esc(ni.title)+' · '+esc(ni.due)+'</small></div><b>'+money(ni.amount,d.currency)+'</b></div>':'')+(d.due>0?payBtn():'')+'</div>'+
   '<div class="card wod" data-act="flip"><div class="wodIn"><div class="wf"><small>🌸 '+t("wod")+'</small><div class="jp">'+esc(w[0])+'</div><div class="kn">'+esc(w[1])+'</div><small class="muted">'+t("tapFlip")+'</small></div><div class="wb"><div class="rm">'+esc(w[2])+'</div><div class="mn">'+esc(lang==="bn"?w[4]:w[3])+'</div></div></div></div>'+
   (d.cls&&d.cls.name?'<div class="card"><h3>🏫 '+t("cls")+'</h3><div class="grid2">'+kv(t("batch"),d.cls.name)+kv(t("teacher"),d.cls.teacher)+kv(t("shift"),[d.cls.shift,d.cls.time].filter(Boolean).join(" "))+kv(t("start"),d.cls.start)+'</div></div>':'')+
   (nn.length?'<div class="card"><h3>📢 '+t("notices")+'</h3>'+nn.map(function(n){return '<div class="row"><div>'+(n.pin?"📌 ":"")+esc(n.title)+'<small>'+esc(n.date)+'</small></div></div>';}).join("")+'</div>':'')+
   '<div class="out">'+t("updated")+': '+esc(String(D.updatedAt||"").slice(0,16).replace("T"," "))+'</div>';
}
function kv(k,v){return '<div class="kv"><span>'+esc(k)+'</span>'+esc(v||"—")+'</div>';}
function vFees(){
  var d=dat(),I=d.installments||[],P=d.payments||[];
  return '<div class="card"><div class="grid2">'+kv(t("totalFee"),money(d.fee,d.currency))+kv(t("paid"),money(d.paid,d.currency))+kv(t("due"),money(d.due,d.currency))+kv(t("enroll"),d.enroll)+'</div>'+payBtn()+'</div>'+
   '<div class="card"><h3>🗓 '+t("inst")+'</h3>'+(I.length?I.map(function(i){var s=instState(i);return '<div class="row"><div>'+esc(i.title||"—")+'<small>'+esc(i.due)+'</small></div><div style="text-align:right"><b>'+money(i.amount,d.currency)+'</b><br><span class="pill '+s[0]+'">'+s[1]+'</span></div></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>'+
   '<div class="card"><h3>🧾 '+t("payHist")+'</h3>'+(P.length?P.map(function(p){return '<div class="row"><div>'+esc(p.date)+'<small>'+esc(p.method||"")+(p.receipt?' · '+t("receipt")+' '+esc(p.receipt):'')+'</small></div><b style="color:var(--ok)">'+money(p.amount,d.currency)+'</b></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>';
}
function vAtt(){
  var d=dat(),a=d.attendance||{},T2=d.tests||[];
  var st={Present:"P",Late:"L",Absent:"A",Leave:"V"};
  var hist=(HIST||[]).map(function(r){var s=r.status,io=tsDate(r.inTs)||tsDate(r.inAt),oo=tsDate(r.outTs)||tsDate(r.outAt);var p=!s?'<span class="pill p-mut">—</span>':s==="Approved"?'<span class="pill p-ok">✅ '+esc(t((r.mark||"Present").toLowerCase()))+'</span>':s==="Rejected"?'<span class="pill p-bad">✗</span>':'<span class="pill p-warn">⏳</span>';return '<div class="row"><div>'+esc(r.date)+(s?'<small>'+t("inT")+' '+hm(io)+(oo?' · '+t("outT")+' '+hm(oo):'')+'</small>':'')+'</div>'+p+'</div>';}).join("");
  var ring=a.total?(a.pct||0):0;
  return '<div class="card"><div class="ringWrap"><div class="ring" style="--p:'+ring+'"><b>'+(a.total?ring+'%':'—')+'</b></div><div class="grid2" style="flex:1">'+kv(t("present"),a.present||0)+kv(t("late"),a.late||0)+kv(t("absent"),a.absent||0)+kv(t("leave"),a.leave||0)+'</div></div></div>'+lvCard()+
   '<div class="card"><h3>📸 '+t("myCheckins")+'</h3>'+(HIST?hist:'<div class="empty">'+t("waitMsg")+'</div>')+'</div>'+
   '<div class="card"><h3>'+t("recent")+'</h3>'+((a.recent||[]).length?'<div class="dots">'+a.recent.slice().reverse().map(function(r){return '<div class="dot d-'+esc(r.status)+'" title="'+esc(r.date+" "+r.status)+'">'+(st[r.status]||"?")+'</div>';}).join("")+'</div><div class="out" style="margin-top:8px;text-align:left">P='+t("present")+' · L='+t("late")+' · A='+t("absent")+' · V='+t("leave")+'</div>':'<div class="empty">'+t("none")+'</div>')+'</div>'+
   '<div class="card"><h3>📝 '+t("myTests")+'</h3>'+(T2.length?T2.map(function(x){var ok=/pass/i.test(x.status),bad=/fail/i.test(x.status);return '<div class="row"><div>'+esc([x.exam,x.level].filter(Boolean).join(" "))+'<small>'+esc(x.date)+(x.score?' · '+esc(x.score):'')+'</small></div><span class="pill '+(ok?"p-ok":bad?"p-bad":"p-mut")+'">'+esc(x.status||"—")+'</span></div>';}).join(""):'<div class="empty">'+t("none")+'</div>')+'</div>'+
   ((d.jlpt||d.visa||d.app||d.docs||d.stage)?'<div class="card"><h3>🎯 '+t("progress")+'</h3><div class="grid2">'+(d.stage?kv(t("stage"),d.stage):'')+(d.jlpt?kv(t("jlpt"),d.jlpt):'')+(d.docs?kv(t("docs"),d.docs):'')+(d.app?kv(t("app"),d.app):'')+(d.visa?kv(t("visa"),d.visa):'')+'</div></div>':'');
}
function lvCard(){var mx=ldAdd(today(),30),L=LEAVES;
  return '<div class="card lv"><h3>🌴 '+t("leaveReq")+'</h3><div class="lvf"><label>'+t("leaveDate")+'<input type="date" id="lv_date" min="'+today()+'" max="'+mx+'" value="'+today()+'"></label><label>'+t("leaveWhy")+'<textarea id="lv_why" rows="2" maxlength="300" placeholder="e.g. sick / family program"></textarea></label><button class="btn" id="lv_btn" data-act="leave">📨 '+t("leaveSend")+'</button></div>'+
   (L&&L.length?'<h4 class="muted" style="margin:14px 0 4px">'+t("leaveMine")+'</h4>'+L.map(function(l){var p=l.status==="Approved"?'<span class="pill p-ok">✅ '+t("ciApproved")+'</span>':l.status==="Rejected"?'<span class="pill p-bad">✗ '+t("ciRejected")+(l.note?" — "+esc(l.note):"")+'</span>':l.status==="Cancelled"?'<span class="pill p-mut">'+t("cancelled")+'</span>':'<span class="pill p-warn">⏳ '+t("pending")+'</span> <button class="lnk" data-act="lvc" data-d="'+esc(l.date)+'">'+t("cancel")+'</button>';return '<div class="row"><div>'+esc(l.date)+'<small>'+esc(l.reason||"")+'</small></div><div style="text-align:right">'+p+'</div></div>';}).join(""):"")+'</div>';}
function vNotices(){
  var L=myNotices();
  return L.length?L.map(function(n){return '<div class="card notice'+(n.pin?" pin":"")+'"><b>'+(n.pin?"📌 ":"")+esc(n.title)+'</b><br><small>'+esc(n.date)+' · '+esc(n.course||t("allStu"))+'</small><p>'+esc(n.body)+'</p></div>';}).join(""):'<div class="card empty">'+t("noNotice")+'</div>';
}
/* ---- kana quiz ---- */
var QZ=null;
function newQ(){var a=KANA[Math.floor(Math.random()*KANA.length)],opts=[a[1]];while(opts.length<4){var o=KANA[Math.floor(Math.random()*KANA.length)][1];if(opts.indexOf(o)<0)opts.push(o);}opts.sort(function(){return Math.random()-.5;});return {k:a[0],a:a[1],o:opts,ans:null};}
function kanaAnswer(v){if(!QZ||QZ.ans)return;QZ.ans=v;KSTREAK=v===QZ.a?KSTREAK+1:0;if(KSTREAK&&KSTREAK%5===0)confetti();var s=JSON.parse(lsGet(LS.quiz)||'{"r":0,"n":0}');s.n++;if(v===QZ.a)s.r++;lsSet(LS.quiz,JSON.stringify(s));try{navigator.vibrate&&navigator.vibrate(v===QZ.a?30:[60,40,60]);}catch(e){}render();}
function vKana(){if(!QZ)QZ=newQ();var s=JSON.parse(lsGet(LS.quiz)||'{"r":0,"n":0}');
  return '<div class="card"><div class="ciRow"><h3>🈁 '+t("kana")+'</h3><span class="pill p-mut">'+t("score")+' '+s.r+'/'+s.n+'</span></div><div class="kanaBig">'+QZ.k+'</div><div class="muted" style="text-align:center;margin-bottom:8px">'+t("kanaQ")+'</div><div class="kopts">'+QZ.o.map(function(o){var c=QZ.ans?(o===QZ.a?" ok":(o===QZ.ans?" bad":"")):"";return '<button class="kopt'+c+'" data-act="kana" data-v="'+o+'">'+o+'</button>';}).join("")+'</div>'+
   (QZ.ans?'<div class="kres">'+(QZ.ans===QZ.a?"🎉 "+t("correct"):"😅 "+t("wrong")+" <b>"+QZ.a+"</b>")+'</div><button class="btn" data-act="knext">'+t("next")+' →</button>':'')+'</div>';}
function bars(sid){var h="",s=String(sid||"GIA");for(var i=0;i<s.length*3;i++){var c=s.charCodeAt(i%s.length)+i*7;h+='<i style="width:'+(1+c%3)+'px;margin-right:'+(1+(c>>2)%3)+'px"></i>';}return h;}
function vMore(){
  var d=dat(),sf=lsGet(LS.selfie),perm=(window.Notification&&Notification.permission)||"default";
  return '<div class="idc"><div class="idTop"><img src="../logomark.png" onerror="this.style.display=\'none\'" alt=""><div><b>Galaxy International Academy</b><small>銀河国際アカデミー</small></div></div><div class="idMid">'+(sf?'<img class="idPh" src="'+sf+'" alt="">':'<div class="idPh ini">'+esc((d.name||"?").charAt(0))+'</div>')+'<div><div class="idN">'+esc(d.name||"")+'</div><div class="idS">'+esc(d.sid||"")+'</div><div class="idC">'+esc([d.course,d.batch].filter(Boolean).join(" · "))+'</div><div class="idC">'+t("enroll")+': '+esc(d.enroll||"—")+'</div></div></div><div class="idBar">'+bars(d.sid)+'</div><div class="idFoot">'+t("idCard")+' · '+t("showOffice")+'</div></div>'+
   vKana()+
   '<div class="card"><h3>📚 '+t("tools")+'</h3><div class="links"><a href="'+SITE+'n5-mock-test.html"><span>📝</span>'+t("mock")+'</a><a href="'+SITE+'checklist.html"><span>✅</span>'+t("check")+'</a><a href="'+SITE+'eligibility.html"><span>🎌</span>'+t("elig")+'</a><a href="'+SITE+'"><span>🌐</span>'+t("web")+'</a></div></div>'+
   '<div class="card"><h3>☎ '+t("contact")+'</h3><div class="links"><a href="tel:'+PHONE+'"><span>📞</span>'+t("call")+' '+PHONE+'</a><a href="https://wa.me/'+WA+'" target="_blank" rel="noopener"><span>💬</span>'+t("wa")+'</a></div></div>'+
   '<div class="card"><div class="row"><span>🌙 '+t("dark")+'</span><button class="sw'+(lsGet(LS.dark)==="1"?" on":"")+'" data-act="dark"><i></i></button></div>'+
   (window.Notification?'<div class="row"><span>🔔 '+t("notif")+'</span>'+(perm==="granted"?'<span class="pill p-ok">'+t("notifOn")+'</span>':'<button class="btn sm" data-act="notif">'+t("enable")+'</button>')+'</div>':'')+
   '<div class="row"><span>🌐 Language</span><button class="btn sm ghost" data-act="lang">EN / বাংলা</button></div></div>'+
   '<div class="out"><button id="btnOut">'+t("logout")+'</button></div>';
}
function legacy(){var h=D.html||{};return '<div class="card">'+(h.i||"")+'</div><div class="card">'+(h.p||"")+'</div><div class="card">'+(h.a||"")+'</div><div class="out"><button id="btnOut">'+t("logout")+'</button></div>';}
/* ---- camera (live only — gallery upload not allowed) ---- */
var CAM={stream:null,geo:null,mode:"in",photo:null,code:""};
function haversine(a,b,c,d){var R=6371000,r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,h=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)*Math.sin(y/2);return 2*R*Math.asin(Math.sqrt(h));}
function camClose(){try{CAM.stream&&CAM.stream.getTracks().forEach(function(x){x.stop();});}catch(e){}CAM.stream=null;var m=$("cam");if(m)m.remove();}
async function openCam(mode){
  CAM.mode=mode;CAM.photo=null;CAM.geo=null;CAM.code=Math.random().toString(36).slice(2,6).toUpperCase();
  var m=document.createElement("div");m.id="cam";m.className="cam";
  m.innerHTML='<div class="camTop"><b>'+t(mode==="in"?"camTitleIn":"camTitleOut")+'</b><button class="ib" id="camX">✕</button></div><div class="camView"><video id="camV" playsinline autoplay muted></video><img id="camP" hidden alt=""><div class="oval"></div><div class="cnt" id="camC"></div><div class="flash" id="camF"></div></div><div class="camInfo"><span id="camGeo">📍 '+t("locating")+'</span><small>'+t("camHint")+'</small></div><div class="camBtns" id="camB"><button class="shoot" id="camS" aria-label="'+t("shoot")+'"><i></i></button></div><canvas id="camK" hidden></canvas>';
  document.body.appendChild(m);$("camX").onclick=camClose;
  getGeo();
  try{CAM.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:720},height:{ideal:960}},audio:false});$("camV").srcObject=CAM.stream;}
  catch(e){$("camGeo").textContent="⚠ "+t("camErr");$("camB").innerHTML='<button class="btn" id="camX2">OK</button>';$("camX2").onclick=camClose;return;}
  $("camS").onclick=countdown;
}
function getGeo(){if(!navigator.geolocation){setGeo(null);return;}navigator.geolocation.getCurrentPosition(function(p){setGeo({lat:+p.coords.latitude.toFixed(6),lng:+p.coords.longitude.toFixed(6),acc:Math.round(p.coords.accuracy)});},function(){setGeo(null);},{enableHighAccuracy:true,timeout:12000,maximumAge:30000});}
function setGeo(g){CAM.geo=g;var c=ACFG||{},el=$("camGeo");CAM.dist=null;if(g&&c.lat!=null&&c.lng!=null)CAM.dist=Math.round(haversine(g.lat,g.lng,c.lat,c.lng));
  if(!el)return;if(!g){el.textContent="📍 "+t("locNo");el.className="warn";return;}
  if(CAM.dist!=null&&CAM.dist>(c.radius||300)){el.textContent="📍 "+t("locFar")+" ("+(CAM.dist>=1000?(CAM.dist/1000).toFixed(1)+" km":CAM.dist+" m")+")";el.className="bad";}
  else{el.textContent="📍 "+t("locOk")+(CAM.dist!=null?" · "+CAM.dist+" m":"")+" (±"+g.acc+" m)";el.className="ok";}}
function countdown(){var n=3,c=$("camC");$("camS").disabled=true;c.textContent=n;c.classList.add("on");var iv=setInterval(function(){n--;if(n>0){c.textContent=n;}else{clearInterval(iv);c.classList.remove("on");c.textContent="";capture();}},800);}
function capture(){
  var v=$("camV"),k=$("camK"),W=480,H=640;k.width=W;k.height=H;var x=k.getContext("2d");if(!x)return;
  var vw=v.videoWidth||W,vh=v.videoHeight||H,s=Math.max(W/vw,H/vh),dw=vw*s,dh=vh*s;
  x.drawImage(v,(W-dw)/2,(H-dh)/2,dw,dh);
  var d=dat(),now=new Date(),g=CAM.geo;
  var grd=x.createLinearGradient(0,H-118,0,H);grd.addColorStop(0,"rgba(15,37,68,0)");grd.addColorStop(.35,"rgba(15,37,68,.82)");grd.addColorStop(1,"rgba(15,37,68,.95)");x.fillStyle=grd;x.fillRect(0,H-118,W,118);
  x.fillStyle="#c9a24a";x.fillRect(0,H-4,W,4);
  x.fillStyle="#fff";x.font="bold 20px sans-serif";x.fillText((d.name||"").slice(0,30),14,H-78);
  x.font="15px sans-serif";x.fillText((d.sid||"")+"  ·  "+(CAM.mode==="in"?"CHECK-IN":"CHECK-OUT")+"  ·  #"+CAM.code,14,H-55);
  x.fillText(now.toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}),14,H-33);
  x.fillStyle="rgba(255,255,255,.75)";x.font="13px sans-serif";x.fillText(g?("📍 "+g.lat+", "+g.lng+(CAM.dist!=null?"  ("+CAM.dist+" m)":"")):"📍 no location",14,H-13);
  x.fillStyle="rgba(255,255,255,.9)";x.font="bold 14px sans-serif";x.textAlign="right";x.fillText("GIA",W-14,26);x.textAlign="left";
  CAM.photo=k.toDataURL("image/jpeg",.62);
  var f=$("camF");f.classList.add("on");setTimeout(function(){f.classList.remove("on");},250);
  $("camP").src=CAM.photo;$("camP").hidden=false;$("camV").hidden=true;
  try{CAM.stream.getTracks().forEach(function(x){x.stop();});}catch(e){}
  $("camB").innerHTML='<button class="btn ghost" id="camR">↺ '+t("retake")+'</button><button class="btn" id="camOk">✓ '+t("submit")+'</button>';
  $("camR").onclick=function(){var md=CAM.mode;camClose();openCam(md);};$("camOk").onclick=submitCam;
}
async function submitCam(){
  var c=ACFG||{},b=$("camOk");
  if(c.requireGeo&&c.lat!=null&&(CAM.dist==null||CAM.dist>(c.radius||300))){toast("⚠ "+t("farBlock"));return;}
  b.disabled=true;b.textContent=t("sending");
  var d=dat(),ref=attRef(),nowIso=new Date().toISOString();
  try{
    if(CAM.mode==="in"){
      await ref.set({key:lsGet(LS.key),sid:String(d.sid||D.sid||""),name:String(d.name||D.name||"").slice(0,120),batch:String(d.batch||""),course:String(d.course||""),date:today(),inAt:nowIso,inTs:SV(),inPhoto:CAM.photo,inGeo:CAM.geo||null,inDist:CAM.dist==null?null:CAM.dist,inCode:CAM.code,device:String(navigator.userAgent||"").slice(0,150),status:"Pending"});
    } else {
      await ref.update({outAt:nowIso,outTs:SV(),outPhoto:CAM.photo,outGeo:CAM.geo||null,outDist:CAM.dist==null?null:CAM.dist});
    }
    lsSet(LS.selfie,CAM.photo);lsSet(LS.ci,"1");camClose();toast("✅ "+t("sent"));try{navigator.vibrate&&navigator.vibrate(80);}catch(e){}
    await fetchToday();HIST=null;render();
  }catch(e){b.disabled=false;b.textContent=t("submit");
    if(/permission/i.test(String(e&&(e.code||e.message)))){await fetchToday();if(TODAY){camClose();toast(t("already"));render();return;}}
    toast("⚠ "+t("errNet"));}
}
function toggleLang(){lang=lang==="en"?"bn":"en";lsSet(LS.lang,lang);applyStatic();if(D)render();}
var deferred=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;$("installBtn").hidden=false;});
async function install(){if(deferred){deferred.prompt();try{await deferred.userChoice;}catch(e){}deferred=null;$("installBtn").hidden=true;}}
window.GIA={toggleLang:toggleLang,refresh:refresh,install:install,_keyOf:keyOf,_state:function(){return {D:D,N:N,tab:tab,TODAY:TODAY,HIST:HIST,CAM:CAM,ACFG:ACFG};},go:go,_capture:capture,_submit:submitCam,_open:openCam,_kana:kanaAnswer};
function boot(){
  lsSet("gia_app_role","student");
  setTimeout(function(){var sp=$("splash");if(sp){sp.classList.add("out");setTimeout(function(){sp.remove();},700);}},950);
  try{ACFG=JSON.parse(lsGet(LS.cfg)||"null");}catch(e){}
  applyStatic();
  $("btnLogin").onclick=login;
  $("in_phone").addEventListener("keydown",function(e){if(e.key==="Enter")login();});
  try{var q=new URLSearchParams(location.search).get("id");if(q)$("in_sid").value=q;}catch(e){}
  var k=lsGet(LS.key),c=lsGet(LS.cache);
  if(k&&c){try{D=JSON.parse(c);N=JSON.parse(lsGet(LS.notices)||"[]");}catch(e){D=null;}if(D){showMain();refresh();}}
  window.addEventListener("online",refresh);
  document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&D)fetchToday().then(function(){if(tab==="home")render();});});
  try{if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});}catch(e){}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
