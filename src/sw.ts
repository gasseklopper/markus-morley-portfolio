declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

// self.__WB_MANIFEST is injected at build time with the files to precache
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event;

  // cache navigations (HTML documents)
  if (request.destination === "document") {
    event.respondWith(
      caches.open("html-cache").then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch {
          return (await caches.match("/404")) as Response;
        }
      }),
    );
    return;
  }

  // cache JSON data requests
  if (request.headers.get("Accept")?.includes("application/json")) {
    event.respondWith(
      caches.open("data-cache").then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("{}", {
            headers: { "Content-Type": "application/json" },
          });
        }
      }),
    );
    return;
  }

  // fallback for other requests
  event.respondWith(
    fetch(request).catch(() => caches.match("/404") as Promise<Response>),
  );
});
