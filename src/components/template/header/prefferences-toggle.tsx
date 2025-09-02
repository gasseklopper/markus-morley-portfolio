import {
  component$,
  $,
  useSignal,
  useVisibleTask$,
  useOnWindow,
  type PropFunction,
} from "@builder.io/qwik";
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

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
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
  });

  useOnWindow(
    "keydown",
    $((event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose$();
      }
    }),
  );

  useOnWindow(
    "pointerdown",
    $((event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        panelRef.value &&
        !panelRef.value.contains(target) &&
        !target?.closest("[data-preferences-toggle]")
      ) {
        onClose$();
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

  return (
    <aside
      ref={panelRef}
      class="fixed top-0 right-0 z-[1000] flex h-screen w-full max-w-full flex-col gap-4 overflow-y-auto bg-[var(--color-bg)] p-4 text-[var(--color-text)] shadow-[-2px_0_8px_rgba(0,0,0,0.5)] sm:w-80"
      role="dialog"
      aria-label="UI settings"
    >
      <button
        type="button"
        class="cursor-pointer self-end border-0 bg-transparent text-xl text-[var(--color-text)]"
        aria-label="Close settings"
        onClick$={onClose$}
      >
        <svg
          class="size-6"
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
      </button>

      <section class="space-y-2" aria-labelledby="cursor-title">
        <h2
          id="cursor-title"
          class="text-base font-bold text-[var(--color-text)]"
        >
          Cursor
        </h2>
        <label class="sr-only" for="cursor-select">
          Cursor
        </label>
        <select
          id="cursor-select"
          onChange$={toggleCursor$}
          value={cursorEnabled.value ? "true" : "false"}
          class="w-full rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
        >
          <option value="true">Enable</option>
          <option value="false">Disable</option>
        </select>
      </section>

      <section class="space-y-2" aria-labelledby="theme-title">
        <h2
          id="theme-title"
          class="text-base font-bold text-[var(--color-text)]"
        >
          Theme
        </h2>
        <div class="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t}
              type="button"
              class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              aria-pressed={currentTheme.value === t}
              onClick$={() => setTheme$(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section class="space-y-2" aria-labelledby="direction-title">
        <h2
          id="direction-title"
          class="text-base font-bold text-[var(--color-text)]"
        >
          Direction
        </h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={!rtlLayout.value}
            onClick$={toggleDirection$}
          >
            LTR
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={rtlLayout.value}
            onClick$={toggleDirection$}
          >
            RTL
          </button>
        </div>
      </section>

      <section class="space-y-2" aria-labelledby="layout-title">
        <h2
          id="layout-title"
          class="text-base font-bold text-[var(--color-text)]"
        >
          Layout
        </h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={!boxLayout.value}
            onClick$={toggleLayout$}
          >
            Full
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={boxLayout.value}
            onClick$={toggleLayout$}
          >
            Box
          </button>
        </div>
      </section>

      <section class="space-y-2" aria-labelledby="overlay-title">
        <h2
          id="overlay-title"
          class="text-base font-bold text-[var(--color-text)]"
        >
          Overlay
        </h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={overlayOn.value}
            onClick$={toggleOverlay$}
          >
            On
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={!overlayOn.value}
            onClick$={toggleOverlay$}
          >
            Off
          </button>
        </div>
      </section>

      <section class="space-y-2" aria-labelledby="motion-title">
        <h2
          id="motion-title"
          class="text-base font-bold text-[var(--color-text)]"
        >
          Motion
        </h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={!reducedMotion.value}
            onClick$={toggleMotion$}
          >
            Normal
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            aria-pressed={reducedMotion.value}
            onClick$={toggleMotion$}
          >
            Reduce
          </button>
        </div>
      </section>
    </aside>
  );
});

export default PrefferencesToggle;
