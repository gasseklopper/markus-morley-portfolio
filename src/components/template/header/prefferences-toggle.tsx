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
    const currentTheme =
      storedTheme ?? document.documentElement.getAttribute("data-theme");
    if (currentTheme === siteConfig.theme_preferences.dark) {
      isDark.value = true;
    }
    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);
    }

    const storedCursor = localStorage.getItem(cursorAnimationKey);
    const currentCursor =
      storedCursor ?? document.documentElement.getAttribute("data-cursor");
    if (currentCursor) {
      cursorEnabled.value = currentCursor !== "false";
      document.documentElement.setAttribute("data-cursor", currentCursor);
    }

    const storedLayout = localStorage.getItem(layoutKey);
    const currentLayout =
      storedLayout ?? document.documentElement.getAttribute("data-layout");
    if (currentLayout) {
      boxLayout.value = currentLayout === "box";
      document.documentElement.setAttribute("data-layout", currentLayout);
    }

    const storedDirection = localStorage.getItem(layoutDirectionPreferenceKey);
    const currentDirection =
      storedDirection ??
      document.documentElement.getAttribute("data-layout-direction");
    if (currentDirection) {
      rtlLayout.value = currentDirection === "rtl";
      document.documentElement.setAttribute(
        "data-layout-direction",
        currentDirection,
      );
    }

    const storedOverlay = localStorage.getItem(overlayPreferenceKey);
    const currentOverlay =
      storedOverlay ?? document.documentElement.getAttribute("data-overlay");
    if (currentOverlay) {
      overlayOn.value = currentOverlay === "on";
      document.documentElement.setAttribute("data-overlay", currentOverlay);
    }

    const storedMotion = localStorage.getItem(motionPreferenceKey);
    const currentMotion =
      storedMotion ?? document.documentElement.getAttribute("data-motion");
    if (currentMotion) {
      reducedMotion.value = currentMotion === "reduce";
      document.documentElement.setAttribute("data-motion", currentMotion);
    }
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
