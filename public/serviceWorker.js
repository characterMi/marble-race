const assets = [
  "/marble-race/",
  "/marble-race/trophy/scene.gltf",
  "/marble-race/trophy/scene.bin",
  "/marble-race/trophy/textures/Object001_mtl_baseColor.jpeg",
  "/marble-race/fonts/Nunito-ExtraLight.ttf",
];

// add index.js and index.css

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
