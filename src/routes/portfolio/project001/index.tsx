import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return (
    <>
      <h1>Project 001</h1>
      <p>Dummy content for project 001.</p>
    </>
  );
});

export const head = buildHead(
  `Project 001 - ${siteConfig.metadata.title}`,
  "Dummy content for project 001.",
);
