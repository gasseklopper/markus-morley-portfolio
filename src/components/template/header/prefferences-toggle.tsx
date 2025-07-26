import { component$, $, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  themeStorageKey,
  cursorAnimationKey,
  layoutKey,
  layoutDirectionPreferenceKey,
  overlayPreferenceKey,
  motionPreferenceKey,
} from "../../theme/preference-scripts";
import siteConfig from "~/config/siteConfig.json";

export const PrefferencesToggle = component$(() => {
  const isDark = useSignal(false);
  const cursorEnabled = useSignal(true);
  const boxLayout = useSignal(false);
  const rtlLayout = useSignal(false);
  const overlayOn = useSignal(false);
  const reducedMotion = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const storedTheme = localStorage.getItem(themeStorageKey);
    const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? siteConfig.theme_preferences.dark
      : siteConfig.theme_preferences.light;
    const currentTheme = storedTheme ?? defaultTheme;
    if (!storedTheme) {
      localStorage.setItem(themeStorageKey, currentTheme);
    }
    isDark.value = currentTheme === siteConfig.theme_preferences.dark;
    document.documentElement.setAttribute("data-theme", currentTheme);

    const storedCursor = localStorage.getItem(cursorAnimationKey);
    const defaultCursor = window.matchMedia("(prefers-reduced-motion: reduce)").matches
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
    const defaultMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "reduce"
      : siteConfig.theme_preferences.motion;
    const currentMotion = storedMotion ?? defaultMotion;
    if (!storedMotion) {
      localStorage.setItem(motionPreferenceKey, currentMotion);
    }
    reducedMotion.value = currentMotion === "reduce";
    document.documentElement.setAttribute("data-motion", currentMotion);
  });

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
  });

  return (
    <div>
      <button type="button" onClick$={toggleTheme$}>
        {isDark.value ? "Light" : "Dark"} Mode
      </button>
      <button type="button" onClick$={toggleCursor$}>
        {cursorEnabled.value ? "Disable" : "Enable"} Cursor
      </button>
      <button type="button" onClick$={toggleLayout$}>
        {boxLayout.value ? "Full" : "Box"} Layout
      </button>
      <button type="button" onClick$={toggleDirection$}>
        {rtlLayout.value ? "LTR" : "RTL"} Direction
      </button>
      <button type="button" onClick$={toggleOverlay$}>
        {overlayOn.value ? "Overlay Off" : "Overlay On"}
      </button>
      <button type="button" onClick$={toggleMotion$}>
        {reducedMotion.value ? "Normal" : "Reduce"} Motion
      </button>
    </div>
  );
});

export default PrefferencesToggle;
