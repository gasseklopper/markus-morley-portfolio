import { component$ } from "@builder.io/qwik";

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
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'miami')
      )`;
  return <script dangerouslySetInnerHTML={themeScript} />;
});

export const CursorAnimationScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-cursor',
        localStorage.getItem('${cursorAnimationKey}') ??
        (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'false' : 'true')
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const LayoutScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-layout',
        localStorage.getItem('${layoutKey}') ?? 'box'
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const LayoutDirectionScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-direction',
        localStorage.getItem('${layoutDirectionPreferenceKey}') ?? 'ltr'
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const OverlayScript = component$(() => {
  const script = `
    document.firstElementChild
      .setAttribute('data-overlay',
        localStorage.getItem('${overlayPreferenceKey}') ?? 'off'
      )`;
  return <script dangerouslySetInnerHTML={script} />;
});

export const ReduceMotionScript = component$(() => {
  const reduceMotion = `
    document.firstElementChild
      .setAttribute('cursor-animation',
        localStorage.getItem('123') ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'lights2')
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
