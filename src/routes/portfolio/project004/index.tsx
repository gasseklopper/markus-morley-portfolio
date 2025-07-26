import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return (
    <>
      <h1>Project 004</h1>
      <p>Dummy content for project 004.</p>
    </>
  );
});

export const head = buildHead(`Project 004 - ${siteConfig.metadata.title}`);
