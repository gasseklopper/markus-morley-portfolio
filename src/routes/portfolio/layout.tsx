import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import styles from "./layout.scss?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="basic-start-layout">
      <Slot />
    </div>
  );
});
