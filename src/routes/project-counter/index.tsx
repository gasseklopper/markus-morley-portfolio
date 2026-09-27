import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ProjectCounter } from "~/components/project-counter/project-counter";

export default component$(() => <ProjectCounter />);

export const head: DocumentHead = {
  title: "Project counter",
};
