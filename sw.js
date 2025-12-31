const CACHE_NAME = 'momentum-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/donors.html',
  '/tracker.css',
  '/script.js'
  // Add your other CSS/JS files
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
