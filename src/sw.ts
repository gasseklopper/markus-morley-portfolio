/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

// Fonts to cache for offline use
const FONT_ASSETS = [
  "/fonts/Barlow-Bold.woff",
  "/fonts/Barlow-Medium.woff",
  "/fonts/Barlow-Light.woff",
  "/fonts/Barlow-SemiBold.woff",
];

// self.__WB_MANIFEST is injected at build time with the files to precache
precacheAndRoute([
  ...self.__WB_MANIFEST,
  ...FONT_ASSETS.map((url) => ({ url, revision: null })),
]);

self.skipWaiting();
clientsClaim();

self.addEventListener("fetch", (event: FetchEvent) => {
  if (event.request.method !== "GET") {
    return;
  }

  const acceptHeader = event.request.headers.get("Accept") || "";

  if (acceptHeader.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open("html-cache").then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((resp) => resp || caches.match("/404")),
        ),
    );
    return;
  }

  if (acceptHeader.includes("application/json")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open("data-cache").then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request) as Promise<Response>),
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request) as Promise<Response>),
  );
});
