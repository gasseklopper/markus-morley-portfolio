import { component$ } from "@builder.io/qwik";
import { AirplaneViewportTest } from "~/components/airplane-test/AirplaneViewportTest";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return <AirplaneViewportTest />;
});

export const head = buildHead(`Airplane Test - ${siteConfig.metadata.title}`);
