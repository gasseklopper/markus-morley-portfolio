import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const columnLabels = ["5fr", "3fr", "5fr", "3fr", "5fr"];

export default component$(() => {
  return (
    <section class="basic-start-grid" aria-label="Golden ratio grid layout">
      {columnLabels.map((label, index) => (
        <div key={`${label}-${index}`} class="basic-start-column">
          <div class="basic-start-label">
            <strong>{label}</strong>
            <span>golden ratio</span>
          </div>
        </div>
      ))}
    </section>
  );
});

export const head = buildHead(`Basic Start - ${siteConfig.metadata.title}`);
