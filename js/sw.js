var cacheName = 'cache20180508';
var filesToCache = [
  '/checksheet/',
  '/checksheet/css/style.css',
  '/checksheet/js/main.js',
  'https://unpkg.com/onsenui@2.9.2/css/onsenui.min.css',
  'https://unpkg.com/onsenui@2.9.2/css/onsen-css-components.min.css',
  'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js',
  'https://unpkg.com/onsenui@2.9.2/js/onsenui.min.js',
  'https://unpkg.com/dexie@2.0.3/dist/dexie.js',
  'https://unpkg.com/onsenui@2.9.2/css/ionicons/css/ionicons.min.css',
  'https://unpkg.com/onsenui@2.9.2/css/material-design-iconic-font/css/material-design-iconic-font.min.css',
  'https://unpkg.com/dexie@2.0.3/dist/dexie.js',
  'https://unpkg.com/onsenui@2.9.2/css/ionicons/css/ionicons.min.css',
  'https://unpkg.com/onsenui@2.9.2/css/material-design-iconic-font/css/material-design-iconic-font.min.css',
  'https://unpkg.com/onsenui@2.9.2/css/font_awesome/css/font-awesome.min.css',
  'https://unpkg.com/onsenui@2.9.2/css/font_awesome/fonts/fontawesome-webfont.woff2?v=4.7.0'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});