const CACHE_NAME = 'my-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  // 필요한 다른 파일들 추가
];

// 설치 이벤트에서 파일 캐시하기
self.addEventListener('install', (event) => {
  console.log("서비스 워커 install");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// fetch 이벤트에서 캐시된 파일 반환하기
self.addEventListener('fetch', (event) => {
  console.log("서비스 워커 fetch", event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
  
});

// 활성화 이벤트에서 오래된 캐시 제거하기
self.addEventListener('activate', (event) => {
  console.log("서비스 워커 activate");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 푸시 이벤트 처리하기
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Default title', body: 'Default message' };
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
