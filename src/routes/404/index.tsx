import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="page">
      <h1>404 - Page Not Found</h1>
      <p>The resource you requested could not be found.</p>
      <p>
        <Link href="/">Return Home</Link>
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "404 - Page Not Found",
};
