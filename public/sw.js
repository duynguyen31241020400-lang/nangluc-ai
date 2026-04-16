const CACHE_NAME = "lumiq-ai-competition-v2";
const ASSETS_TO_CACHE = ["/", "/assessment", "/learn/math", "/manifest.json"];

self.addEventListener("install", (event) => {
  // Take control immediately without waiting for old SW to become inactive.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );
});

self.addEventListener("activate", (event) => {
  // Delete all caches that don't match the current version.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Network-first: always try the network, fall back to cache only when offline.
  // This ensures every deploy is picked up immediately on the demo device.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});
