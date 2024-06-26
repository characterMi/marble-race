const assets = [
  "/marble-race",
  "/marble-race/trophy/scene.gltf",
  "/marble-race/trophy/scene.bin",
  "/marble-race/trophy/textures/Object001_mtl_baseColor.jpeg",
  "/marble-race/fonts/Nunito-ExtraLight.ttf",
];

// add index.js and index.css

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

// self.addEventListener("fetch", (e) => {
//     e.respondWith(
//       caches.match(e.request).then((response) => {
//         const fetchPromise = fetch(e.request).then((networkResponse) => {
//           caches.open("assets").then((cache) => {
//             cache.put(e.request, networkResponse.clone());

//             return networkResponse;
//           });
//         });

//         return response || fetchPromise;
//       })
//     );
//   });
