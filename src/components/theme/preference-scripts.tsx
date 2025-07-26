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

export const ThemeScript = component$(() => {
  const themeScript = `
    (() => {
      const stored = localStorage.getItem('${themeStorageKey}');
      const defaultValue = window.matchMedia('(prefers-color-scheme: dark)').matches ? '${siteConfig.theme_preferences.dark}' : '${siteConfig.theme_preferences.light}';
      const value = stored ?? defaultValue;
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
  const script = `
    (() => {
      const stored = localStorage.getItem('${layoutKey}');
      const defaultValue = '${siteConfig.theme_preferences.layout}';
      const value = stored ?? defaultValue;
      if (!stored) localStorage.setItem('${layoutKey}', value);
      document.firstElementChild.setAttribute('data-layout', value);
    })();`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const LayoutDirectionScript = component$(() => {
  const script = `
    (() => {
      const stored = localStorage.getItem('${layoutDirectionPreferenceKey}');
      const defaultValue = '${siteConfig.theme_preferences.layout_direction}';
      const value = stored ?? defaultValue;
      if (!stored) localStorage.setItem('${layoutDirectionPreferenceKey}', value);
      document.firstElementChild.setAttribute('data-layout-direction', value);
    })();`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const OverlayScript = component$(() => {
  const script = `
    (() => {
      const stored = localStorage.getItem('${overlayPreferenceKey}');
      const defaultValue = '${siteConfig.theme_preferences.overlay}';
      const value = stored ?? defaultValue;
      if (!stored) localStorage.setItem('${overlayPreferenceKey}', value);
      document.firstElementChild.setAttribute('data-overlay', value);
    })();`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const ReduceMotionScript = component$(() => {
  const reduceMotion = `
    (() => {
      const stored = localStorage.getItem('${motionPreferenceKey}');
      const defaultValue = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : '${siteConfig.theme_preferences.motion}';
      const value = stored ?? defaultValue;
      if (!stored) localStorage.setItem('${motionPreferenceKey}', value);
      document.firstElementChild.setAttribute('data-motion', value);
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
