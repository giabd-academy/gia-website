/* =========================================================
   GIA WEBSITE SETTINGS — ei file edit korlei site update hobe
   ========================================================= */
window.GIA_CONFIG = {
  // ---- Analytics (ID dile automatic chalu hobe, faka rakhle bondho) ----
  GA4_ID: "",          // e.g. "G-XXXXXXXXXX"  (Google Analytics 4)
  FB_PIXEL_ID: "",     // e.g. "123456789012345" (Meta / Facebook Pixel)


  // ---- Seminars (date YYYY-MM-DD). Purono gulo automatic hide hoye jabe ----
  SEMINARS: [
    { id: "sem-2610", date: "2026-10-24", time: "4:00 PM", title: "Study in Japan — April 2027 Intake", mode: "Offline", venue: "GIA Office, Agrabad, Chattogram" },
    { id: "sem-2611", date: "2026-11-14", time: "8:00 PM", title: "SSW / Work in Japan — Full Guide", mode: "Online", venue: "Facebook Live / Zoom" }
  ]
};
(function(){
  var C = window.GIA_CONFIG;
  if (C.GA4_ID) {
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + C.GA4_ID; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function(){ dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", C.GA4_ID);
  }
  if (C.FB_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq("init", C.FB_PIXEL_ID); fbq("track", "PageView");
  }
  // conversion helper — form submit hole call hoy
  window.giaTrack = function(name, data){ try{ if(window.gtag) gtag("event", name, data||{}); if(window.fbq) fbq("track", "Lead", data||{}); }catch(e){} };
})();

window.L=function(en,ja,bn){var l=document.documentElement.getAttribute('data-lang');if(!l||l==='en'){try{l=localStorage.getItem('gia_lang')||l;}catch(e){}}return l==='ja'?ja:(l==='bn'?bn:en);};
