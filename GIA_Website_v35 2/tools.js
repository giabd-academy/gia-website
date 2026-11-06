/* ===== GIA tools: shared lead submit ===== */
(function(){
  var CFG={apiKey:"AIzaSyAQRyQkxjAWEwgh5nn11Bmo72ke9-bYciQ",authDomain:"gia-erp.firebaseapp.com",projectId:"gia-erp",storageBucket:"gia-erp.firebasestorage.app",messagingSenderId:"951435359568",appId:"1:951435359568:web:347edd9a6364611e83e855"};
  var DB=null; try{ if(typeof firebase!=="undefined"){ if(!firebase.apps||!firebase.apps.length) firebase.initializeApp(CFG); DB=firebase.firestore(); } }catch(e){}
  window.giaChips=function(root){ (root||document).querySelectorAll(".tl-chips").forEach(function(g){ if(g._b) return; g._b=1; g.addEventListener("click",function(e){ var c=e.target.closest(".tl-chip"); if(!c) return; g.querySelectorAll(".tl-chip").forEach(function(x){x.classList.remove("on");}); c.classList.add("on"); if(g.onpick) g.onpick(c.getAttribute("data-v")); }); }); };
  window.giaChip=function(name){ var c=document.querySelector('.tl-chips[data-name="'+name+'"] .tl-chip.on'); return c?c.getAttribute("data-v"):""; };
  /* opts: {type, course, message, box (element id of lead block)} */
  window.giaSubmitLead=async function(boxId, opts){
    var box=document.getElementById(boxId); var q=function(s){return box.querySelector(s);};
    var name=(q('[name="name"]').value||"").trim(), phone=(q('[name="phone"]').value||"").trim(), msg=q(".tl-msg");
    if(!name||!/^[0-9+\-\s]{8,}$/.test(phone)){ msg.textContent=L("Please enter your name and a valid phone / WhatsApp number.","お名前と有効な電話番号 / WhatsApp番号を入力してください。","আপনার নাম ও সঠিক ফোন / WhatsApp নম্বর দিন।"); return false; }
    var cons=q('[name="consent"]'); if(cons&&!cons.checked){ msg.textContent=L("Please tick the consent box.","同意欄にチェックしてください。","সম্মতির ঘরে টিক দিন।"); return false; }
    var btn=q("button"); btn.disabled=true; var old=btn.innerHTML; btn.innerHTML=L("Sending…","送信中…","পাঠানো হচ্ছে…"); msg.textContent="";
    var d={ref:"GIA-WEB-"+String(Date.now()).slice(-6),type:opts.type,name:name,phone:phone,email:((q('[name="email"]')||{}).value||"").trim(),address:((q('[name="address"]')||{}).value||"").trim(),
      course:opts.course||"",service:opts.service||"",message:opts.message||"",extra:opts.extra||{},source:"Website",status:"New",imported:false,createdAt:new Date().toISOString()};
    try{ if(!DB) throw new Error("offline"); await DB.collection("web_leads").add(d);
      if(window.giaTrack) giaTrack("generate_lead",{type:opts.type});
      q(".tl-form").style.display="none"; var ok=q(".tl-ok"); ok.classList.add("show"); var r=ok.querySelector(".ref"); if(r) r.textContent=d.ref; return true;
    }catch(e){ msg.textContent=L("Could not send online right now. Please WhatsApp +8801830150171.","現在送信できません。WhatsApp（+8801830150171）でご連絡ください。","এখন পাঠানো যাচ্ছে না। WhatsApp করুন: +8801830150171"); btn.disabled=false; btn.innerHTML=old; return false; }
  };
  window.giaLeadBlock=function(id,title,sub,btn){
    return '<div class="tl-lead" id="'+id+'"><div class="tl-form"><h3>'+title+'</h3><p>'+sub+'</p><div class="tl-grid"><div class="tl-f"><input name="name" placeholder="'+L('Your name *','お名前 *','আপনার নাম *')+'"></div><div class="tl-f"><input name="phone" placeholder="'+L('Phone / WhatsApp *','電話 / WhatsApp *','ফোন / WhatsApp *')+'" inputmode="tel"></div><div class="tl-f"><input name="email" placeholder="'+L('Email (optional)','メール（任意）','ইমেইল (ঐচ্ছিক)')+'"></div><div class="tl-f"><input name="address" placeholder="'+L('District (optional)','地区（任意）','জেলা (ঐচ্ছিক)')+'"></div></div><label class="cons"><input type="checkbox" name="consent" checked> '+L('I agree that Galaxy International Academy may contact me and keep these details as per the ','Galaxy International Academyからの連絡および、','Galaxy International Academy আমার সাথে যোগাযোগ করতে ও এই তথ্য রাখতে পারবে — ')+'<a href="privacy.html" style="color:#ffd77a;text-decoration:underline">'+L('Privacy Policy','プライバシーポリシー','গোপনীয়তা নীতি')+'</a>'+L('.','に基づく情報の保管に同意します。',' অনুযায়ী, এতে আমি সম্মত।')+'</label><button class="btn gold btn-apply" type="button">'+btn+' <span class="arw">→</span></button><div class="tl-msg"></div></div><div class="tl-ok"><div class="em">🎉</div><h3>'+L('Thank you!','ありがとうございます！','ধন্যবাদ!')+'</h3><p>'+L('Our counsellor will contact you soon. Reference: ','担当者よりご連絡します。受付番号：','আমাদের কাউন্সেলর শীঘ্রই যোগাযোগ করবেন। রেফারেন্স: ')+'<b class="ref" style="color:#ffd77a"></b></p></div></div>';
  };
})();
