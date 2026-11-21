const CACHE='finanzen-v62';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png','./favicon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  // App-Seite: Netz zuerst (für Updates), sonst Cache
  if(req.mode==='navigate'){ e.respondWith(fetch(req).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put('./index.html',c)); return r; }).catch(()=>caches.match('./index.html'))); return; }
  // Alles andere (Icons, Schriften, Excel-Bibliothek): Cache zuerst, dann Netz und merken
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{ if(r.ok||r.type==='opaque'){ const c=r.clone(); caches.open(CACHE).then(x=>x.put(req,c)); } return r; })));
});
