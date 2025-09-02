import {
  component$,
  $,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
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
  const isDark = useSignal(false);
  const cursorEnabled = useSignal(true);
  const boxLayout = useSignal(false);
  const rtlLayout = useSignal(false);
  const overlayOn = useSignal(false);
  const reducedMotion = useSignal(false);
  const panelRef = useSignal<HTMLElement>();

  useStylesScoped$(`
      .panel {
        position: fixed;
        top: 0;
        right: 0;
        width: 320px;
        max-width: 100%;
        height: 100vh;
        background: var(--color-bg);
        color: var(--color-text);
        padding: 1rem;
        overflow-y: auto;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 1000;
      }

      .close-btn {
        align-self: flex-end;
        background: transparent;
        border: none;
        color: var(--color-text);
        font-size: 1.25rem;
        cursor: pointer;
      }

      .group {
        margin-bottom: 1rem;
      }

      .group-title {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 700;
        color: var(--color-text);
      }

      .btn-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }

      .btn {
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        background: var(--color-bg);
        border: 1px solid var(--color-text);
        color: var(--color-text);
        cursor: pointer;
        transition:
          background 0.2s ease,
          border-color 0.2s ease,
          transform 0.1s ease;
      }

      .btn:hover {
        background: var(--color-primary);
        color: var(--color-bg);
      }

      .btn[aria-pressed="true"] {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: var(--color-bg);
        transform: translateY(1px);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      select {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        background: var(--color-bg);
        border: 1px solid var(--color-text);
        color: var(--color-text);
        font-size: 0.875rem;
      }

      select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
      }

      @media (max-width: 640px) {
        .panel {
          width: 100%;
        }
      }
    `);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const storedTheme = localStorage.getItem(themeStorageKey);
    const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? siteConfig.theme_preferences.dark
      : siteConfig.theme_preferences.light;
    const currentTheme = storedTheme ?? defaultTheme;
    if (!storedTheme) {
      localStorage.setItem(themeStorageKey, currentTheme);
    }
    isDark.value = currentTheme === siteConfig.theme_preferences.dark;
    document.documentElement.setAttribute("data-theme", currentTheme);

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
      if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
        onClose$();
      }
    }),
  );

  const toggleTheme$ = $(() => {
    isDark.value = !isDark.value;
    const newTheme = isDark.value
      ? siteConfig.theme_preferences.dark
      : siteConfig.theme_preferences.light;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(themeStorageKey, newTheme);
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
    <aside ref={panelRef} class="panel" role="dialog" aria-label="UI settings">
      <button
        type="button"
        class="close-btn"
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

      <section class="group" aria-labelledby="cursor-title">
        <h2 id="cursor-title" class="group-title">
          Cursor
        </h2>
        <label class="sr-only" for="cursor-select">
          Cursor
        </label>
        <select
          id="cursor-select"
          onChange$={toggleCursor$}
          value={cursorEnabled.value ? "true" : "false"}
        >
          <option value="true">Enable</option>
          <option value="false">Disable</option>
        </select>
      </section>

      <section class="group" aria-labelledby="mode-title">
        <h2 id="mode-title" class="group-title">
          Mode
        </h2>
        <div class="btn-grid">
          <button
            type="button"
            class="btn"
            aria-pressed={!isDark.value}
            onClick$={toggleTheme$}
          >
            Light
          </button>
          <button
            type="button"
            class="btn"
            aria-pressed={isDark.value}
            onClick$={toggleTheme$}
          >
            Dark
          </button>
        </div>
      </section>

      <section class="group" aria-labelledby="direction-title">
        <h2 id="direction-title" class="group-title">
          Direction
        </h2>
        <div class="btn-grid">
          <button
            type="button"
            class="btn"
            aria-pressed={!rtlLayout.value}
            onClick$={toggleDirection$}
          >
            LTR
          </button>
          <button
            type="button"
            class="btn"
            aria-pressed={rtlLayout.value}
            onClick$={toggleDirection$}
          >
            RTL
          </button>
        </div>
      </section>

      <section class="group" aria-labelledby="layout-title">
        <h2 id="layout-title" class="group-title">
          Layout
        </h2>
        <div class="btn-grid">
          <button
            type="button"
            class="btn"
            aria-pressed={!boxLayout.value}
            onClick$={toggleLayout$}
          >
            Full
          </button>
          <button
            type="button"
            class="btn"
            aria-pressed={boxLayout.value}
            onClick$={toggleLayout$}
          >
            Box
          </button>
        </div>
      </section>

      <section class="group" aria-labelledby="overlay-title">
        <h2 id="overlay-title" class="group-title">
          Overlay
        </h2>
        <div class="btn-grid">
          <button
            type="button"
            class="btn"
            aria-pressed={overlayOn.value}
            onClick$={toggleOverlay$}
          >
            On
          </button>
          <button
            type="button"
            class="btn"
            aria-pressed={!overlayOn.value}
            onClick$={toggleOverlay$}
          >
            Off
          </button>
        </div>
      </section>

      <section class="group" aria-labelledby="motion-title">
        <h2 id="motion-title" class="group-title">
          Motion
        </h2>
        <div class="btn-grid">
          <button
            type="button"
            class="btn"
            aria-pressed={!reducedMotion.value}
            onClick$={toggleMotion$}
          >
            Normal
          </button>
          <button
            type="button"
            class="btn"
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
