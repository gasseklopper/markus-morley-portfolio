import { component$ } from "@builder.io/qwik";
import { PrefferencesToggle } from "../template/header/prefferences-toggle";
import siteConfig from "~/config/siteConfig.json";

export const themeStorageKey = "theme-preference";
export const cursorAnimationKey = "theme-cursor-preference";
export const layoutKey = "theme-layout-preference";
export const isSettingsOpenKey = "theme-settings-preference";
export const motionPreferenceKey = "theme-motion-preference";
export const layoutDirectionPreferenceKey = "theme-layout-direction-preference";
export const overlayPreferenceKey = "theme-overlay-preference";

const createPreferenceScript = (
  key: string,
  attr: string,
  defaultValue: string,
) => `
    (() => {
      const stored = localStorage.getItem('${key}');
      const value = stored ?? ${JSON.stringify(defaultValue)};
      if (!stored) localStorage.setItem('${key}', value);
      document.firstElementChild.setAttribute('${attr}', value);
    })();`;

export const ThemeScript = component$(() => {
  const themeScript = `
    (() => {
      const themes = ['light','dark','neon','pastell'];
      const stored = localStorage.getItem('${themeStorageKey}');
      const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const value = stored && themes.includes(stored) ? stored : preferred;
      if (!stored) localStorage.setItem('${themeStorageKey}', value);
      document.firstElementChild.setAttribute('data-theme', value);
    })();`;
  return <script dangerouslySetInnerHTML={themeScript} />;
});

export const CursorAnimationScript = component$(() => {
  const script = `
    (() => {
      const stored = localStorage.getItem('${cursorAnimationKey}');
      const defaultValue = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'false' : '${siteConfig.theme_preferences.cursor}';
      const value = stored ?? defaultValue;
      if (!stored) localStorage.setItem('${cursorAnimationKey}', value);
      document.firstElementChild.setAttribute('data-cursor', value);
    })();`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const LayoutScript = component$(() => {
  return (
    <script
      dangerouslySetInnerHTML={createPreferenceScript(
        layoutKey,
        "data-layout",
        siteConfig.theme_preferences.layout,
      )}
    />
  );
});

export const LayoutDirectionScript = component$(() => {
  return (
    <script
      dangerouslySetInnerHTML={createPreferenceScript(
        layoutDirectionPreferenceKey,
        "data-layout-direction",
        siteConfig.theme_preferences.layout_direction,
      )}
    />
  );
});

export const OverlayScript = component$(() => {
  return (
    <script
      dangerouslySetInnerHTML={createPreferenceScript(
        overlayPreferenceKey,
        "data-overlay",
        siteConfig.theme_preferences.overlay,
      )}
    />
  );
});

export const ReduceMotionScript = component$(() => {
  const reduceMotion = `
    (() => {
      const stored = localStorage.getItem('${motionPreferenceKey}');
      const defaultValue = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : '${siteConfig.theme_preferences.motion}';
      const value = stored ?? defaultValue;
      if (!stored) localStorage.setItem('${motionPreferenceKey}', value);
      document.firstElementChild.setAttribute('data-motion', value);
      if (value === 'reduce') {
        document.firstElementChild.setAttribute('data-cursor', 'false');
        localStorage.setItem('${cursorAnimationKey}', 'false');
      }
    })();`;
  return <script dangerouslySetInnerHTML={reduceMotion} />;
});

/**
 * Combine all startup scripts into a single component. This allows the root
 * document to inject a single component which contains all required
 * preference scripts on first load.
 */
export const PreferenceScripts = component$(() => {
  return (
    <>
      <ThemeScript />
      <CursorAnimationScript />
      <LayoutScript />
      <LayoutDirectionScript />
      <OverlayScript />
      <ReduceMotionScript />
    </>
  );
});

export { PrefferencesToggle };
