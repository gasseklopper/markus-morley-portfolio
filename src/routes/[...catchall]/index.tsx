import { component$ } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = (ev) => {
  ev.status(404);
};

export default component$(() => {
  return (
    <div class="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you were looking for does not exist.</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "404 - Page Not Found",
};
