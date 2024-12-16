const CACHE_NAME = 'pwa-task-manager';

const urlsToCache = [
    './',
    'index.html',
    'service-worker.js',
    'manifest.json',
    'offline.html',
    'images/image.png',

    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.0.0/pouchdb.min.js'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME
        }).map(cacheName => caches.delete(cacheName))
      ))
    );
  });

  function isOnline() {
    return navigator.onLine;
}

  self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if(isOnline()){
                  return fetch(event.request);
                }
                if (cachedResponse) {
                    return cachedResponse;
                }
                return caches.match('/offline.html');  // Si tienes una página offline personalizada

            })
            .catch(() => {
                // Si ocurre un error con la red (cuando no hay conexión), devolver un recurso predeterminado (opcional)
                return caches.match('/offline.html');  // Si tienes una página offline personalizada
            })
    );
  });

  function monitorOnlineStatus() {
    setInterval(() => {
      if (isOnline()) {
        caches.open(CACHE_NAME)
            .then(cache => {
          return cache.keys().then(keys => {
              if (keys.length === 0) {
            return cache.addAll(urlsToCache);
              }
          });
            })
      } else {
      }
    }, 500);
  }

  monitorOnlineStatus();