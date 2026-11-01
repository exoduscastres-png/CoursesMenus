const CACHE = "menusaison-v1";
const RESSOURCES = ["./", "./index.html", "./widget.html", "./css/style.css", "./css/widget.css", "./js/app.js", "./js/data/season.js", "./js/data/recipes.js", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(RESSOURCES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(rep => {
      if (rep) return rep;
      return fetch(e.request).then(res => {
        // mettre en cache les ressources same-origin pour l'usage hors ligne
        if (e.request.url.startsWith(self.location.origin)) {
          const copie = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copie));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
