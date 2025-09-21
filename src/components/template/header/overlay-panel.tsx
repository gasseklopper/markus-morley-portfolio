import {
  $,
  Slot,
  component$,
  useOnWindow,
  useSignal,
  useVisibleTask$,
  type PropFunction,
} from "@builder.io/qwik";
import handleOverlayScrimPointerDown from "./overlay-scrim-handler";

const PANEL_TRANSITION_MS = 520;

export type OverlayPanelProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  onClose$: PropFunction<() => void>;
  triggerSelector: string;
  closeLabel?: string;
  ariaLabel?: string;
};

export const OverlayPanel = component$<OverlayPanelProps>(
  ({
    eyebrow,
    title,
    description,
    onClose$,
    triggerSelector,
    closeLabel = "Close panel",
    ariaLabel,
  }) => {
    const panelRef = useSignal<HTMLElement>();
    const portalRootRef = useSignal<HTMLElement>();
    const isAnimatingIn = useSignal(false);
    const isClosing = useSignal(false);
    const reduceMotion = useSignal(false);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      const root = portalRootRef.value;
      if (root && root.parentElement !== document.body) {
        document.body.appendChild(root);
      }

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const updateMotion = () => {
        const motionAttr = document.documentElement.getAttribute("data-motion");
        reduceMotion.value = motionAttr === "reduce" || motionQuery.matches;
      };

      updateMotion();

      if (reduceMotion.value) {
        isAnimatingIn.value = true;
      } else {
        requestAnimationFrame(() => {
          isAnimatingIn.value = true;
        });
      }

      const handleMotionChange = () => {
        const previous = reduceMotion.value;
        updateMotion();
        if (!previous && reduceMotion.value) {
          isAnimatingIn.value = true;
        }
      };

      motionQuery.addEventListener("change", handleMotionChange);

      const observer = new MutationObserver(() => {
        const previous = reduceMotion.value;
        updateMotion();
        if (!previous && reduceMotion.value) {
          isAnimatingIn.value = true;
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-motion"],
      });

      return () => {
        motionQuery.removeEventListener("change", handleMotionChange);
        observer.disconnect();
        if (root && root.parentElement === document.body) {
          document.body.removeChild(root);
        }
      };
    });

    const startClose$ = $(() => {
      if (isClosing.value) {
        return;
      }

      isClosing.value = true;
      isAnimatingIn.value = false;

      const delay = reduceMotion.value ? 0 : PANEL_TRANSITION_MS;
      setTimeout(() => {
        onClose$();
      }, delay);
    });

    useOnWindow(
      "keydown",
      $((event: KeyboardEvent) => {
        if (event.key === "Escape") {
          startClose$();
        }
      }),
    );

    useOnWindow(
      "pointerdown",
      $((event: PointerEvent) => {
        if (event.defaultPrevented) {
          return;
        }

        const target = event.target as HTMLElement | null;
        if (
          panelRef.value &&
          !panelRef.value.contains(target) &&
          !target?.closest(triggerSelector)
        ) {
          startClose$();
        }
      }),
    );

    return (
      <div ref={portalRootRef} class="fixed inset-0 z-[3000] flex justify-end">
        <div
          class={[
            "absolute inset-0 bg-gradient-to-l from-[color:color-mix(in_srgb,var(--surface2)_40%,transparent)] via-transparent to-transparent transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isAnimatingIn.value ? "opacity-100" : "opacity-0",
          ]}
          onPointerDown$={$((event: PointerEvent) => {
            handleOverlayScrimPointerDown(event, () => startClose$());
          })}
        />
        <aside
          ref={panelRef}
          class={[
            "relative z-[3001] flex h-[100dvh] w-full max-w-md flex-col gap-6 overflow-y-auto rounded-l-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-6 py-8 text-[var(--text2)] shadow-[0_32px_120px_var(--surface-shadow)] backdrop-blur-2xl transition-[transform,opacity] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] sm:px-8",
            isAnimatingIn.value ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
          ]}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel ?? title}
        >
          <header class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              {eyebrow ? (
                <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text3)]">
                  {eyebrow}
                </p>
              ) : null}
              <h1 class="text-2xl font-semibold text-[var(--text1)]">{title}</h1>
              {description ? (
                <p class="text-sm text-[var(--text2)]">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              class="group relative flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
              aria-label={closeLabel}
              onClick$={startClose$}
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width={1.5}
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="sr-only">{closeLabel}</span>
            </button>
          </header>
          <div class="flex flex-1 flex-col gap-6 pb-4">
            <Slot />
          </div>
        </aside>
      </div>
    );
  },
);

export default OverlayPanel;
