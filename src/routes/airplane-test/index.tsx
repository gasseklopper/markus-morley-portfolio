import { component$ } from "@builder.io/qwik";
import { AirplaneViewportTest } from "~/components/airplane-test/AirplaneViewportTest";
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return <AirplaneViewportTest />;
});

export const head = buildHead(`Airplane Test - ${siteMetadata.title}`);
