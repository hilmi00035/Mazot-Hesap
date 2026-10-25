const C='mazot-v3',O='mazot-ocr';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==O).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.hostname==='cdn.jsdelivr.net'){
  e.respondWith(caches.open(O).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}))));
  return;
 }
 if(u.origin!==location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(C);
  const m=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x}).catch(()=>null);
  if(m){e.waitUntil(net);return m}
  const x=await net;
  if(x)return x;
  if(r.mode==='navigate'){const f=(await c.match('./index.html'))||(await c.match('./'));if(f)return f}
  return new Response('Çevrimdışı',{status:503});
 })());
});
