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

  const accept = event.request.headers.get("Accept") || "";

  if (accept.includes("text/html")) {
    event.respondWith(handleHtml(event.request));
    return;
  }

  if (accept.includes("application/json")) {
    event.respondWith(handleJson(event.request));
    return;
  }

  event.respondWith(handleGeneric(event.request));
});

async function handleHtml(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open("html-cache");
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const fallback = await caches.match("/404");
    return fallback ?? Response.error();
  }
}

async function handleJson(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open("data-cache");
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response(null, { status: 503 });
  }
}

async function handleGeneric(request: Request): Promise<Response> {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const fallback = await caches.match("/404");
    return fallback ?? Response.error();
  }
}
