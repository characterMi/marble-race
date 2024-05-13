const assets = [
  "/marble-race",
  "/marble-race/trophy/scene.gltf",
  "/marble-race/trophy/scene.bin",
  "/marble-race/trophy/textures/Object001_mtl_baseColor.jpeg",
  "/marble-race/fonts/Nunito-ExtraLight.ttf",
  "/marble-race/assets/index-8b678066.js",
  "/marble-race/assets/index-71fa28c1.css",
  "/marble-race/assets/troika-three-text.esm-ed55d9e9.js",
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
