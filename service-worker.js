const CACHE_NAME = 'dream-workshop-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/reset.css',
  './js/main.js',
  './js/data.js',
  './js/draw.js',
  './js/npc.js',
  './js/dialogue.js',
  './js/playerData.js',
  './js/audioManager.js',
  './js/config.js',
  './js/llm.js',
  './js/requests.js',
  './js/tutorialManager.js',
  './js/attendanceData.js',
  './js/asset-list.js',
  './assets/images/game_logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            // console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // POST 요청 등은 캐싱하지 않음
  if (event.request.method !== 'GET') return;
  
  // API 요청 등은 캐싱하지 않도록 제외
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});

