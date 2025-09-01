import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1>Grid Layout Examples</h1>

      <section>
        <h2>Responsive row via container queries</h2>
        <div class="row demo-row">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
        </div>
      </section>

      <section>
        <h2>Custom column count and gap</h2>
        <div class="row demo-row" style="--columns: 3; --gap: 2rem;">
          <div>A</div>
          <div>B</div>
          <div>C</div>
          <div>D</div>
          <div>E</div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(`Grid Examples - ${siteConfig.metadata.title}`);
