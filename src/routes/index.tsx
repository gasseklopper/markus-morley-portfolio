import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.scss?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1 class="title_barlowBold">Hi 👋 barlowBold</h1>
      <h1 class="title_barlowMedium">Hi 👋 barlowMedium</h1>
      <h1 class="title_barlowLight">Hi 👋 barlowLight</h1>
      <h1 class="title_barlowSemibold">Hi 👋 barlowSemibold</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
