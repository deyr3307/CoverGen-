// CoverGen PWA Service Worker
const CACHE_NAME = 'covergen-pwa-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/app-icon.jpg',
  '/manifest.json'
];

// Install Event - cache the core shells of the app
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((err) => console.warn('Service worker pre-cache failed:', err))
  );
});

// Activate Event - clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network First with Cached Fallback strategy to ensure zero stale client screens
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip requests from browser extensions or metrics API endpoints (non-GET, third party)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Avoid intercepting the Gemini generating model API
  if (requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return index.html for navigation HTML page requests when offline
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});
