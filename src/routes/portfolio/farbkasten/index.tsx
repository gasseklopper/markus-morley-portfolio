import { component$ } from "@builder.io/qwik";
import { Malkasten } from "~/components/malkasten/Malkasten";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return (
    <>
      <h1>Farbkasten</h1>
      <p>Paint over the portrait using the brand color.</p>
      <Malkasten />
    </>
  );
});

export const head = buildHead(
  `Farbkasten - ${siteConfig.metadata.title}`,
  "Draw on the image with the brand color.",
);
