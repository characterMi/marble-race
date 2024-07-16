const assets = [
  "/marble-race",
  "/marble-race/trophy/scene.gltf",
  "/marble-race/trophy/scene.bin",
  "/marble-race/trophy/textures/Object001_mtl_baseColor.jpeg",
  "/marble-race/fonts/Nunito-ExtraLight.ttf",
  "/marble-race/assets/index-7f579878.js",
  "/marble-race/assets/index-ca01007b.css",
  "troika-three-text.esm-4a861bd8.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("assets").then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Even if the response is in the cache, we fetch it
      // and update the cache for future usage
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          return caches.open("assets").then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch((e) => {
          console.error(e);

          return new Response(
            "Network error and no cached data available. see the browser's console for more information",
            {
              status: 503,
              statusText: "Service Unavailable.",
            }
          );
        });
      // We use the currently cached version if it's there
      return response || fetchPromise; // cached or a network fetch
    })
  );
});
