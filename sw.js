/* Jogatina: service worker simples. Vai sempre primeiro à rede (para ter a versão nova)
   e usa a cópia guardada quando não há internet. Não mexe em pedidos de outros sites (Firebase). */
const C="jogatina-v2";
const CORE=["./","fonts/bangers.woff2","fonts/figtree.woff2","fonts/bowlby-one.woff2","testa/"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}))});
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  /* páginas: pede sempre a versão nova ao servidor (sem usar a cópia do navegador), para as atualizações chegarem logo */
  const req=r.mode==="navigate"?new Request(r.url,{cache:"no-cache",credentials:"same-origin"}):r;
  e.respondWith(fetch(req).then(res=>{if(res.ok&&res.type==="basic"){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==="navigate"?caches.match("./"):Response.error()))));
});
