declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';

// self.__WB_MANIFEST is injected at build time with the files to precache
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match("/404") as Promise<Response>)
  );
});