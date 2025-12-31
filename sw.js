const CACHE_NAME = 'momentum-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/donors.html',
  '/tracker.css',
  '/tracker.js',
  '/donate.css',
  '/thirdcs.css',
  '/trp.css',
  '/manifest.json',
  '/og11.png',
  '/og12.png'
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
      .catch(() => {
        return caches.match('/index.html');
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
