import {
  component$,
  $,
  useSignal,
  useVisibleTask$,
  useOnWindow,
  type PropFunction,
} from "@builder.io/qwik";
import handleOverlayScrimPointerDown, {
  isOverlayToggleForwarded,
} from "./overlay-scrim-handler";
import {
  themeStorageKey,
  cursorAnimationKey,
  layoutKey,
  layoutDirectionPreferenceKey,
  overlayPreferenceKey,
  motionPreferenceKey,
} from "../../theme/preference-scripts";
import siteConfig from "~/config/siteConfig.json";

export const PrefferencesToggle = component$<{
  onClose$: PropFunction<() => void>;
}>(({ onClose$ }) => {
  const themes = ["light", "dark", "neon", "pastell"] as const;
  type Theme = typeof themes[number];
  const currentTheme = useSignal<Theme>("light");
  const cursorEnabled = useSignal(true);
  const boxLayout = useSignal(false);
  const rtlLayout = useSignal(false);
  const overlayOn = useSignal(false);
  const reducedMotion = useSignal(false);
  const panelRef = useSignal<HTMLElement>();
  const portalRootRef = useSignal<HTMLElement>();
  const isAnimatingIn = useSignal(false);
  const isClosing = useSignal(false);
  const PANEL_TRANSITION_MS = 520;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const root = portalRootRef.value;
    if (root && root.parentElement !== document.body) {
      document.body.appendChild(root);
    }

    const storedTheme = localStorage.getItem(themeStorageKey) as Theme | null;
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const theme = storedTheme && themes.includes(storedTheme) ? storedTheme : preferredTheme;
    if (!storedTheme) {
      localStorage.setItem(themeStorageKey, theme);
    }
    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);

    const storedCursor = localStorage.getItem(cursorAnimationKey);
    const defaultCursor = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "false"
      : siteConfig.theme_preferences.cursor;
    const currentCursor = storedCursor ?? defaultCursor;
    if (!storedCursor) {
      localStorage.setItem(cursorAnimationKey, currentCursor);
    }
    cursorEnabled.value = currentCursor !== "false";
    document.documentElement.setAttribute("data-cursor", currentCursor);

    const storedLayout = localStorage.getItem(layoutKey);
    const defaultLayout = siteConfig.theme_preferences.layout;
    const currentLayout = storedLayout ?? defaultLayout;
    if (!storedLayout) {
      localStorage.setItem(layoutKey, currentLayout);
    }
    boxLayout.value = currentLayout === "box";
    document.documentElement.setAttribute("data-layout", currentLayout);

    const storedDirection = localStorage.getItem(layoutDirectionPreferenceKey);
    const defaultDirection = siteConfig.theme_preferences.layout_direction;
    const currentDirection = storedDirection ?? defaultDirection;
    if (!storedDirection) {
      localStorage.setItem(layoutDirectionPreferenceKey, currentDirection);
    }
    rtlLayout.value = currentDirection === "rtl";
    document.documentElement.setAttribute(
      "data-layout-direction",
      currentDirection,
    );

    const storedOverlay = localStorage.getItem(overlayPreferenceKey);
    const defaultOverlay = siteConfig.theme_preferences.overlay;
    const currentOverlay = storedOverlay ?? defaultOverlay;
    if (!storedOverlay) {
      localStorage.setItem(overlayPreferenceKey, currentOverlay);
    }
    overlayOn.value = currentOverlay === "on";
    document.documentElement.setAttribute("data-overlay", currentOverlay);

    const storedMotion = localStorage.getItem(motionPreferenceKey);
    const defaultMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "reduce"
      : siteConfig.theme_preferences.motion;
    const currentMotion = storedMotion ?? defaultMotion;
    if (!storedMotion) {
      localStorage.setItem(motionPreferenceKey, currentMotion);
    }
    reducedMotion.value = currentMotion === "reduce";
    document.documentElement.setAttribute("data-motion", currentMotion);
    if (currentMotion === "reduce") {
      document.documentElement.setAttribute("data-cursor", "false");
      localStorage.setItem(cursorAnimationKey, "false");
      cursorEnabled.value = false;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      isAnimatingIn.value = true;
      return;
    }

    const raf = requestAnimationFrame(() => {
      isAnimatingIn.value = true;
    });

    return () => {
      cancelAnimationFrame(raf);
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

    const timeout = reducedMotion.value ? 0 : PANEL_TRANSITION_MS;

    setTimeout(() => {
      onClose$();
    }, timeout);
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
      if (isOverlayToggleForwarded(event)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        panelRef.value &&
        !panelRef.value.contains(target) &&
        !target?.closest("[data-preferences-toggle]")
      ) {
        if (isClosing.value) {
          return;
        }

        startClose$();
      }
    }),
  );

  const setTheme$ = $((theme: Theme) => {
    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(themeStorageKey, theme);
  });

  const toggleCursor$ = $(() => {
    cursorEnabled.value = !cursorEnabled.value;
    const newValue = cursorEnabled.value ? "true" : "false";
    document.documentElement.setAttribute("data-cursor", newValue);
    localStorage.setItem(cursorAnimationKey, newValue);
  });

  const toggleLayout$ = $(() => {
    boxLayout.value = !boxLayout.value;
    const newValue = boxLayout.value ? "box" : "full";
    document.documentElement.setAttribute("data-layout", newValue);
    localStorage.setItem(layoutKey, newValue);
  });

  const toggleDirection$ = $(() => {
    rtlLayout.value = !rtlLayout.value;
    const newValue = rtlLayout.value ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-layout-direction", newValue);
    localStorage.setItem(layoutDirectionPreferenceKey, newValue);
  });

  const toggleOverlay$ = $(() => {
    overlayOn.value = !overlayOn.value;
    const newValue = overlayOn.value ? "on" : "off";
    document.documentElement.setAttribute("data-overlay", newValue);
    localStorage.setItem(overlayPreferenceKey, newValue);
  });

  const toggleMotion$ = $(() => {
    reducedMotion.value = !reducedMotion.value;
    const newValue = reducedMotion.value ? "reduce" : "normal";
    document.documentElement.setAttribute("data-motion", newValue);
    localStorage.setItem(motionPreferenceKey, newValue);
    const cursorValue = reducedMotion.value ? "false" : "true";
    document.documentElement.setAttribute("data-cursor", cursorValue);
    localStorage.setItem(cursorAnimationKey, cursorValue);
    cursorEnabled.value = cursorValue === "true";
  });

  const sectionClasses =
    "flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-5 shadow-[0_16px_50px_var(--surface-shadow)] transition-colors duration-300";
  const sectionTitleClasses =
    "text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text3)]";
  const toggleButtonClass =
    "group relative flex items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-4 py-3 text-sm font-semibold text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-2)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)] aria-[pressed=true]:border-[var(--primary)] aria-[pressed=true]:bg-[var(--surface-glass-2)] aria-[pressed=true]:text-[var(--text1)] aria-[pressed=true]:shadow-[0_18px_48px_var(--surface-shadow)]";

  return (
    <div
      ref={portalRootRef}
      class="fixed inset-0 z-[3000] flex justify-end"
    >
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
        aria-label="UI settings"
      >
        <header class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text3)]">
              Personalize
            </p>
            <h1 class="text-2xl font-semibold text-[var(--text1)]">
              Interface settings
            </h1>
          </div>
          <button
            type="button"
            class="group relative flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
            aria-label="Close settings"
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span class="sr-only">Close settings</span>
          </button>
        </header>

        <section class={sectionClasses} aria-labelledby="cursor-title">
          <div class="space-y-1">
            <p class={sectionTitleClasses} id="cursor-title">
              Cursor
            </p>
            <p class="text-sm text-[var(--text2)]">
              Switch between animated and minimal cursor experiences.
            </p>
          </div>
          <label class="sr-only" for="cursor-select">
            Cursor preference
          </label>
          <select
            id="cursor-select"
            onChange$={toggleCursor$}
            value={cursorEnabled.value ? "true" : "false"}
            class="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-4 py-3 text-sm font-semibold text-[var(--text2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 focus:border-[var(--primary)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
          >
            <option value="true">Enable</option>
            <option value="false">Disable</option>
          </select>
        </section>

        <section class={sectionClasses} aria-labelledby="theme-title">
          <div class="space-y-1">
            <p class={sectionTitleClasses} id="theme-title">
              Theme
            </p>
            <p class="text-sm text-[var(--text2)]">
              Explore the color stories that match your current vibe.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                class={toggleButtonClass}
                aria-pressed={currentTheme.value === t}
                onClick$={() => setTheme$(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </section>

        <section class={sectionClasses} aria-labelledby="direction-title">
          <div class="space-y-1">
            <p class={sectionTitleClasses} id="direction-title">
              Direction
            </p>
            <p class="text-sm text-[var(--text2)]">
              Choose the reading direction that feels natural to you.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={!rtlLayout.value}
              onClick$={toggleDirection$}
            >
              LTR
            </button>
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={rtlLayout.value}
              onClick$={toggleDirection$}
            >
              RTL
            </button>
          </div>
        </section>

        <section class={sectionClasses} aria-labelledby="layout-title">
          <div class="space-y-1">
            <p class={sectionTitleClasses} id="layout-title">
              Layout
            </p>
            <p class="text-sm text-[var(--text2)]">
              Swap between immersive full width and framed box layouts.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={!boxLayout.value}
              onClick$={toggleLayout$}
            >
              Full
            </button>
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={boxLayout.value}
              onClick$={toggleLayout$}
            >
              Box
            </button>
          </div>
        </section>

        <section class={sectionClasses} aria-labelledby="overlay-title">
          <div class="space-y-1">
            <p class={sectionTitleClasses} id="overlay-title">
              Overlay
            </p>
            <p class="text-sm text-[var(--text2)]">
              Add a soft atmospheric layer for glassy depth on pages.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={overlayOn.value}
              onClick$={toggleOverlay$}
            >
              On
            </button>
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={!overlayOn.value}
              onClick$={toggleOverlay$}
            >
              Off
            </button>
          </div>
        </section>

        <section class={sectionClasses} aria-labelledby="motion-title">
          <div class="space-y-1">
            <p class={sectionTitleClasses} id="motion-title">
              Motion
            </p>
            <p class="text-sm text-[var(--text2)]">
              Tune animations to match your comfort level.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={!reducedMotion.value}
              onClick$={toggleMotion$}
            >
              Normal
            </button>
            <button
              type="button"
              class={toggleButtonClass}
              aria-pressed={reducedMotion.value}
              onClick$={toggleMotion$}
            >
              Reduce
            </button>
          </div>
        </section>
      </aside>
    </div>
  );
});

export default PrefferencesToggle;
