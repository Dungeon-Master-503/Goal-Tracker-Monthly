const CACHE_NAME = 'momentum-v3';
const urlsToCache = [
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

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching all files');
      return cache.addAll(urlsToCache).catch(error => {
        console.log('Cache addAll error:', error);
        // Continue even if some files fail
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Return cached if available
      }
      return fetch(event.request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // Clone the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
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

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle background sync for data persistence
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({type: 'SYNC_DATA'});
        });
      })
    );
  }
});
