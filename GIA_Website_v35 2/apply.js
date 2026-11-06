/* ===== GIA Apply Wizard ===== */
(function(){
  var CFG={apiKey:"AIzaSyAQRyQkxjAWEwgh5nn11Bmo72ke9-bYciQ",authDomain:"gia-erp.firebaseapp.com",projectId:"gia-erp",storageBucket:"gia-erp.firebasestorage.app",messagingSenderId:"951435359568",appId:"1:951435359568:web:347edd9a6364611e83e855"};
  var DB=null; try{ if(typeof firebase!=="undefined"){ if(!firebase.apps||!firebase.apps.length) firebase.initializeApp(CFG); DB=firebase.firestore(); } }catch(e){}
  var TYPE=window.APX_TYPE||"course", N=4, step=1, choice="";
  var q=function(s){return document.querySelector(s);}, qa=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
  function val(n){ var el=q('[name="'+n+'"]'); return el?(el.value||"").trim():""; }
  function chip(n){ var c=q('.apx-chips[data-name="'+n+'"] .apx-chip.on'); return c?c.getAttribute("data-v"):""; }
  function setMsg(t){ var m=q("#apxMsg"); if(m) m.textContent=t||""; }

  function render(back){
    qa(".apx-step").forEach(function(s){ s.classList.remove("show","showb"); });
    var cur=q('.apx-step[data-step="'+step+'"]'); if(cur){ cur.classList.add(back?"showb":"show"); }
    qa(".apx-dot").forEach(function(d,i){ d.classList.toggle("on",i+1===step); d.classList.toggle("done",i+1<step); });
    var bar=q(".apx-bar"); if(bar) bar.style.width="calc((100% - 36px) * "+((step-1)/(N-1))+")";
    var bk=q("#apxBack"); if(bk) bk.style.visibility=step>1?"visible":"hidden";
    var nx=q("#apxNext"); if(nx) nx.innerHTML = step<N ? L("Continue","次へ","পরবর্তী")+' <span class="arw">→</span>' : (TYPE==="course"?L("🎓 Submit Application","🎓 申し込みを送信","🎓 আবেদন জমা দিন")+' <span class="arw">→</span>':L("✈️ Book Consultation","✈️ 相談を予約","✈️ কনসাল্টেশন বুক করুন")+' <span class="arw">→</span>');
    var qk=q("#apxQuick"); if(qk) qk.style.display = step===2 ? "" : "none";
    if(step===N) buildReview();
    setMsg("");
    var f=cur&&cur.querySelector("input,select"); if(f&&step>1&&window.innerWidth>700) setTimeout(function(){ try{f.focus({preventScroll:true});}catch(e){} },350);
  }
  function validate(s){
    qa(".apx-f.err").forEach(function(x){x.classList.remove("err");});
    if(s===1 && !choice){ setMsg(TYPE==="course"?L("Please choose a course to continue.","コースを選択してください。","এগিয়ে যেতে একটি কোর্স বাছাই করুন।"):L("Please choose the service you need.","必要なサービスを選択してください。","আপনার দরকারি সার্ভিস বাছাই করুন।")); return false; }
    if(s===2){
      var ok=true;
      if(!val("name")){ q('[name="name"]').closest(".apx-f").classList.add("err"); ok=false; }
      if(!/^[0-9+\-\s]{8,}$/.test(val("phone"))){ q('[name="phone"]').closest(".apx-f").classList.add("err"); ok=false; }
      if(!ok){ setMsg(L("Please enter your name and a valid phone / WhatsApp number.","お名前と有効な電話番号 / WhatsApp番号を入力してください。","আপনার নাম ও সঠিক ফোন / WhatsApp নম্বর দিন।")); return false; }
    }
    if(s===N && q("#apxConsent") && !q("#apxConsent").checked){ setMsg(L("Please tick the consent box to submit.","送信するには同意欄にチェックしてください。","জমা দিতে সম্মতির ঘরে টিক দিন।")); return false; }
    return true;
  }
  function data(){
    var isC=TYPE==="course";
    return { ref:"GIA-WEB-"+String(Date.now()).slice(-6), type:isC?"Course":"Consultancy",
      name:val("name"), phone:val("phone"), email:val("email"), dob:val("dob"), gender:chip("gender"), address:val("address"),
      education:val("education"), passYear:val("passYear"), jpLevel:chip("jpLevel"),
      course:isC?choice:"", shift:isC?chip("shift"):"", mode:isC?chip("mode"):"",
      service:isC?"":choice, intake:isC?"":val("intake"), passport:isC?"":chip("passport"), sponsor:isC?"":chip("sponsor"),
      hear:val("hear"), referral:val("referral"), message:val("message"),
      source:"Website", status:"New", imported:false, createdAt:new Date().toISOString() };
  }
  function buildReview(){
    var d=data(), box=q("#apxReview"); if(!box) return;
    var rows=[[TYPE==="course"?L("Course","コース","কোর্স"):L("Service","サービス","সার্ভিস"),choice],[L("Name","お名前","নাম"),d.name],[L("Phone","電話","ফোন"),d.phone],[L("Email","メール","ইমেইল"),d.email],[L("District","地区","জেলা"),d.address],[L("Education","学歴","শিক্ষা"),[d.education,d.passYear].filter(Boolean).join(" · ")],[L("Japanese level","日本語レベル","জাপানি লেভেল"),d.jpLevel],
      [L("Shift","時間帯","শিফট"),d.shift],[L("Mode","受講方法","মোড"),d.mode],[L("Intake","入学時期","ইনটেক"),d.intake],[L("Passport","パスポート","পাসপোর্ট"),d.passport],[L("Sponsor","経費支弁者","স্পন্সর"),d.sponsor]].filter(function(r){return r[1];});
    box.innerHTML=rows.map(function(r){ return "<div><span>"+r[0]+":</span> <b>"+String(r[1]).replace(/</g,"&lt;")+"</b></div>"; }).join("");
  }
  function confetti(){ var cols=["#d4a531","#0f2544","#c0392b","#4fd1c5","#ff8fb1","#66bb6a"]; for(var i=0;i<70;i++){ var c=document.createElement("div"); c.className="conf"; c.style.left=Math.random()*100+"vw"; c.style.background=cols[i%cols.length]; c.style.animationDelay=(Math.random()*0.6)+"s"; c.style.animationDuration=(2+Math.random()*1.5)+"s"; document.body.appendChild(c); (function(el){ setTimeout(function(){ el.remove(); },4200); })(c); } }
  async function submit(){
    var btn=q("#apxNext"), qk=q("#apxQuick"); if(btn) btn.disabled=true; if(qk) qk.disabled=true; setMsg("");
    var d=data(); if(btn) btn.innerHTML=L("Submitting…","送信中…","জমা হচ্ছে…");
    try{
      if(!DB) throw new Error("offline");
      await DB.collection("web_leads").add(d); if(window.giaTrack) giaTrack("generate_lead",{type:d.type});
      q("#apxRef").textContent=d.ref; q(".apx-progress").style.display="none"; q(".apx-body").style.display="none"; q(".apx-nav").style.display="none";
      q(".apx-done").classList.add("show"); confetti(); window.scrollTo({top:0,behavior:"smooth"});
    }catch(err){ setMsg(L("Could not submit online right now. Please call / WhatsApp +8801830150171.","現在オンライン送信ができません。お電話 / WhatsApp（+8801830150171）でご連絡ください。","এখন অনলাইনে জমা হচ্ছে না। কল / WhatsApp করুন: +8801830150171")); if(btn){btn.disabled=false;} if(qk) qk.disabled=false; render(); }
  }
  window.apxNext=function(){ if(!validate(step)) return; if(step<N){ step++; render(); } else submit(); };
  window.apxBack=function(){ if(step>1){ step--; render(true); } };
  window.apxQuick=function(){ if(!validate(1)) { step=1; render(true); return; } if(!validate(2)) return; submit(); };
  qa(".apx-opt").forEach(function(o){ o.addEventListener("click",function(){ qa(".apx-opt").forEach(function(x){x.classList.remove("sel");}); o.classList.add("sel"); choice=o.getAttribute("data-v"); setMsg(""); setTimeout(function(){ if(step===1){ step=2; render(); } },380); }); });
  qa(".apx-chips").forEach(function(g){ g.addEventListener("click",function(e){ var c=e.target.closest(".apx-chip"); if(!c) return; var on=c.classList.contains("on"); g.querySelectorAll(".apx-chip").forEach(function(x){x.classList.remove("on");}); c.classList.add("on"); }); });
  document.addEventListener("keydown",function(e){ if(e.key==="Enter" && e.target.tagName==="INPUT"){ e.preventDefault(); window.apxNext(); } });
  // prefill from URL
  try{ var p=new URLSearchParams(location.search), want=(p.get("course")||p.get("service")||"").toLowerCase();
    if(want){ var hit=qa(".apx-opt").filter(function(o){ var v=(o.getAttribute("data-v")||"").toLowerCase(); return v.indexOf(want)===0||v.indexOf(want)>=0; })[0]; if(hit){ hit.classList.add("sel"); choice=hit.getAttribute("data-v"); step=2; } } }catch(e){}
  render();
})();
