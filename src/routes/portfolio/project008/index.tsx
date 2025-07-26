import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return (
    <>
      <h1>Project 008</h1>
      <p>Dummy content for project 008.</p>
    </>
  );
});

export const head = buildHead(
  `Project 008 - ${siteConfig.metadata.title}`,
  "Dummy content for project 008.",
);
