import type { RequestHandler } from "@builder.io/qwik-city";
import { API_ROOTS } from "~/routes/portfolio/rpg-creature-compendium/api-config";

const allowedRoots = API_ROOTS.map((root) => {
  const normalized = root.endsWith("/") ? root : `${root}/`;
  const url = new URL(normalized);
  return {
    origin: url.origin,
    pathname: url.pathname.replace(/\/$/, ""),
  };
});

const isAllowedTarget = (target: URL): boolean =>
  allowedRoots.some(({ origin, pathname }) => {
    if (target.origin !== origin) return false;
    if (!pathname) return true;
    return target.pathname === pathname || target.pathname.startsWith(`${pathname}/`);
  });

const sanitizeTarget = (targetParam: string): URL | null => {
  try {
    const url = new URL(targetParam);
    if (!isAllowedTarget(url)) {
      return null;
    }
    return url;
  } catch (error) {
    void error;
    return null;
  }
};

export const onGet: RequestHandler = async ({ request, send }) => {
  const url = new URL(request.url);
  const targetParam = url.searchParams.get("target");

  if (!targetParam) {
    send(400, { message: "A target query parameter is required." });
    return;
  }

  const target = sanitizeTarget(targetParam);

  if (!target) {
    send(400, { message: "Target must match an allowed creature API root." });
    return;
  }

  let upstream: Response;

  try {
    upstream = await fetch(target);
  } catch (error) {
    console.error("Proxy request failed", target.toString(), error);
    send(502, { message: "Failed to reach the upstream creature API." });
    return;
  }

  const body = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";

  send(upstream.status, body, {
    "Content-Type": contentType,
    "Cache-Control": upstream.headers.get("cache-control") ?? "no-store",
  });
};
