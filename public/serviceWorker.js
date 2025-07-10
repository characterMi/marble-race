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
    caches
      .match(event.request) // searching in the cache
      .then((response) => {
        if (response) {
          // The request is in the cache
          return response; // cache hit
        } else {
          // We need to go to the network
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              return caches.open("marble-race-game").then((cache) => {
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

          return fetchPromise; // cache miss
        }
      })
  );
});
