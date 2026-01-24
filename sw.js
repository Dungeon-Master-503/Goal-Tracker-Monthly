// 1. Change this version every time you deploy breaking/visible changes
const CACHE_NAME = 'momentum-v4';

// 2. (Optional but recommended) – list of core assets to pre-cache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/indexa.html',
  '/indexb.html',
  '/indexc.html',
  '/indexd.html',
  '/donors.html',
  '/tracker.css',
  '/tracker.js',
  '/donate.css',
  '/thirdcs.css',
  '/trp.css',
  '/manifest.json',
  '/og11.png',
  '/og12.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  // Force this SW to become active immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Delete old cache versions
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      )
    )
  );

  // Start controlling current open pages
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Return cached if available
      }
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // Clone the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Return index.html as fallback for offline navigation
        return caches.match('/index.html');
      });
    })
  );
});

// Handle background sync for data persistence
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_DATA' });
        });
      })
    );
  }
});
