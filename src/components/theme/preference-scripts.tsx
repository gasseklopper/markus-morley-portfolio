import { component$ } from "@builder.io/qwik";
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
    document.firstElementChild
      .setAttribute('data-theme',
        localStorage.getItem('${themeStorageKey}') ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? '${siteConfig.theme_preferences.dark}' : '${siteConfig.theme_preferences.light}')
      )`;
  return <script dangerouslySetInnerHTML={themeScript} />;
});

export const CursorAnimationScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-cursor',
        localStorage.getItem('${cursorAnimationKey}') ??
        (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'false' : '${siteConfig.theme_preferences.cursor}')
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const LayoutScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-layout',
        localStorage.getItem('${layoutKey}') ?? '${siteConfig.theme_preferences.layout}'
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const LayoutDirectionScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-layout-direction',
        localStorage.getItem('${layoutDirectionPreferenceKey}') ?? '${siteConfig.theme_preferences.layout_direction}'
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const OverlayScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-overlay',
        localStorage.getItem('${overlayPreferenceKey}') ?? '${siteConfig.theme_preferences.overlay}'
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const ReduceMotionScript = component$(() => {
  const reduceMotion = `
    document.firstElementChild
      .setAttribute('data-motion',
        localStorage.getItem('${motionPreferenceKey}') ??
        (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : '${siteConfig.theme_preferences.motion}')
      )`;
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
