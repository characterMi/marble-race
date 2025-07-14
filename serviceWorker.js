const assets = [
  "/marble-race/",
  "/marble-race/trophy/scene.gltf",
  "/marble-race/trophy/scene.bin",
  "/marble-race/trophy/textures/Object001_mtl_baseColor.jpeg",
  "/marble-race/fonts/Nunito-ExtraLight.ttf",
  "/marble-race/icons/icon.svg",
  "/marble-race/icons/marble-192.png",
  "/marble-race/app.webmanifest",
  "/marble-race/assets/index-cc21d2b4.js",
  "/marble-race/assets/index-c835803c.css",
  "/marble-race/assets/troika-three-text.esm-e15f6e44.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("marble-race-game").then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open("marble-race-game");

      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) return cachedResponse;

      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        .catch(() => {
          return new Response(
            "Network error and no cached data available. see the browser's console for more information",
            {
              status: 503,
              statusText: "Service Unavailable.",
            }
          );
        });

      return fetchPromise; // cache miss
    })()
  );
});
