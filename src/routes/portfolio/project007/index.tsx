import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return (
    <>
      <h1>Project 007</h1>
      <p>Dummy content for project 007.</p>
    </>
  );
});

export const head = buildHead(`Project 007 - ${siteConfig.metadata.title}`);
