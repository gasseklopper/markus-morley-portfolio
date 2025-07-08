import { precacheAndRoute } from 'workbox-precaching';

// self.__WB_MANIFEST is default injection point for pre-cached resources.
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.status === 404) {
        return caches.match('/404');
      }
      return response;
    }).catch(() => caches.match('/404'))
  );
});
