import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$, useNavigate } from "@builder.io/qwik-city";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = (ev) => {
  ev.status(404);
};

export const useServerTime = routeLoader$(() => {
  // This will re-execute in the server when the page refreshes.
  return Date.now();
});

export default component$(() => {
  const nav = useNavigate();
  const serverTime = useServerTime();

  return (
    <div class="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you were looking for does not exist.</p>
      <p>
        <Link href="/">Return Home</Link>
      </p>
      <div>
        <Link reload>Refresh (better accessibility)</Link>
        <button onClick$={() => nav()}>Refresh</button>
        <p>Server time: {serverTime.value}</p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "404 - Page Not Found",
};
