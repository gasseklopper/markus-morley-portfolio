/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from "workbox-precaching";

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

self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match("/404") as Promise<Response>),
  );
});
