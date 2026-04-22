const CACHE_NAME = "presse-app-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/app.html",
  "/css/style.css",
  "/js/app.js",
  "/js/auth.js",
  "/js/supabase.js"
];

// 📦 INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 🔄 FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});