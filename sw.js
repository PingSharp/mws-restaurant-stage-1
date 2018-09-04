let staticCacheName = 'c2';

/**
 * init cache
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll([
        '/',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'css/responsive.css',
        'img/1_small.jpg',
        'img/1.jpg',
        'img/404-page-not-found.jpg',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
      ]);
    })
  );
});

/**
 * Delete old cache if new cache name is not equal to older one
 * (tidy up cache)
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('c') &&
            cacheName != staticCacheName;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Check if response is already stored in cache
 * Yes --> send this to user
 * No  --> query URL & store cache & send to user
 * If URL is not reachable & response is not in cache
 * then send 404 page
 */
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).then(function (resp) {
        caches.open(staticCacheName).then(function (cache) {
          cache.add(event.request.url);
        });
        return resp;
      }).catch(function () {
        return caches.match('img/404-page-not-found.jpg');
      });
    })
  );
});
