const assets = [
  "/marble-race",
  "/marble-race/trophy/scene.gltf",
  "/marble-race/fonts/Nunito-ExtraLight.ttf",
  "/marble-race/assets/index-71fa28c1.css",
  "/marble-race/assets/index-899976a7.js",
  "/marble-race/assets/troika-three-text.esm-a5d68b75.js",
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
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        caches.open("assets").then((cache) => {
          cache.put(e.request, networkResponse.clone());

          return networkResponse;
        });
      });

      return response || fetchPromise;
    })
  );
});
