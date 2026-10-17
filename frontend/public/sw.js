const CACHE_NAME = 'rccg-parish-portal-v2';
const STATIC_ASSETS = [
  '/manifest.json',
  '/pwa-icon.svg',
  '/rccg_official_logo.png',
  '/glorious_church_logo.png'
];

// Install Event - Cache only app shell icons & manifest, NEVER index.html
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event - Purge all outdated caches (including v1 with cached index.html)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // API calls: Network first
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Navigation requests (HTML documents): NETWORK FIRST
  // Always fetch fresh index.html from network to obtain latest Vite build hashes
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request) || caches.match('/index.html'))
    );
    return;
  }

  // JS/CSS assets: Guard against HTML MIME type response for script requests
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const contentType = response.headers.get('content-type') || '';
          // If server returned HTML (e.g. 404 rewrite) instead of JS, do NOT serve as JS
          if (url.pathname.endsWith('.js') && contentType.includes('text/html')) {
            console.warn('[SW] Intercepted invalid text/html for script:', url.pathname);
            return new Response('/* Error: Expected JS but server returned HTML */', {
              status: 404,
              statusText: 'Not Found',
              headers: { 'Content-Type': 'application/javascript' }
            });
          }
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Other static assets (images, media, fonts): Cache-first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
      );
    })
  );
});
