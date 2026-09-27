import { component$, useComputed$, useSignal } from "@builder.io/qwik";

export const ProjectCounter = component$(() => {
  const count = useSignal(0);
  const doubled = useComputed$(() => count.value * 2);

  return (
    <section aria-label="Project counter">
      <h2>Project counter</h2>
      <div aria-live="polite" aria-atomic="true">
        <p>Count: {count.value}</p>
        <p>Count × 2: {doubled.value}</p>
      </div>
      <button
        type="button"
        aria-label="Decrease count"
        onClick$={() => count.value--}
      >
        -
      </button>
      <button
        type="button"
        aria-label="Increase count"
        onClick$={() => count.value++}
      >
        +
      </button>
      <button type="button" onClick$={() => (count.value = 0)}>
        Reset
      </button>
    </section>
  );
});
