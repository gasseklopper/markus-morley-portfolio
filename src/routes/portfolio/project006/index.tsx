import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return (
    <>
      <h1>Project 006</h1>
      <p>Dummy content for project 006.</p>
    </>
  );
});

export const head = buildHead(`Project 006 - ${siteConfig.metadata.title}`);
