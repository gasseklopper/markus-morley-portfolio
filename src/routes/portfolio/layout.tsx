import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <Slot />
    </div>
  );
});
