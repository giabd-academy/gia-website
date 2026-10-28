/* GIA Office service worker — network first, offline fallback to last copy */
const C="gia-office-v57";
self.addEventListener("install",e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./manifest.webmanifest","./icon-192.png"])).catch(()=>{})); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{ const u=new URL(e.request.url); if(e.request.method!=="GET"||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{}); return r; }).catch(()=>caches.match(e.request).then(m=>m||caches.match("./index.html")))); });
