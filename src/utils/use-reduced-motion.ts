import { useSignal, useVisibleTask$ } from "@builder.io/qwik";

/**
 * Reactive prefers-reduced-motion flag that only runs on the client.
 */
export const useReducedMotion = () => {
  const reduced = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.value = !!mql?.matches;
    };
    update();

    if (mql) {
      mql.addEventListener("change", update);
      cleanup(() => mql.removeEventListener("change", update));
    }
  });

  return reduced;
};

export default useReducedMotion;
