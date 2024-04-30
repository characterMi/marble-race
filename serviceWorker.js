const assets = [
  "/marble-race",
  "/marble-race/trophy",
  "/marble-race/fonts/Nunito-ExtraLight.ttf",
  "/marble-race/assets/index-71fa28c1.css",
  "/marble-race/assets/index-e60a125b.js",
  "/marble-race/assets/troika-three-text.esm-be5e8175.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("assets").then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(e.request);
      }
    })
  );
});
