import { component$, useVisibleTask$, useStore, useSignal, $ } from "@builder.io/qwik";
import { themeStorageKey } from "~/components/theme/preference-scripts";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

interface Theme {
  name: string;
  description: string;
  colors: { name: string; value: string }[];
}

const themes: Theme[] = [
  {
    name: "Light",
    description: "Bright and clean light palette.",
    colors: [
      { name: "brand-light", value: "#5b6cff" },
      { name: "brand-core-light", value: "#4052ff" },
      { name: "brand-inverted-light", value: "#ffffff" },
      { name: "brand-inverted-highlight1-light", value: "#f0f3ff" },
      { name: "brand-inverted-highlight2-light", value: "#dfe6ff" },
      { name: "primary-light", value: "#0ea5e9" },
      { name: "secondary-light", value: "#22c55e" },
      { name: "tertiary-light", value: "#f59e0b" },
      { name: "quaternary-light", value: "#ef4444" },
      { name: "text1-light", value: "#0f172a" },
      { name: "text2-light", value: "#334155" },
      { name: "text3-light", value: "#475569" },
      { name: "text4-light", value: "#64748b" },
      { name: "surface1-light", value: "#ffffff" },
      { name: "surface2-light", value: "#f8fafc" },
      { name: "surface3-light", value: "#f1f5f9" },
      { name: "surface4-light", value: "#e2e8f0" },
      { name: "surface5-light", value: "#cbd5e1" },
      { name: "surface6-light", value: "#94a3b8" },
      { name: "surface7-light", value: "#64748b" },
      { name: "surface8-light", value: "#475569" },
      { name: "surface-shadow-light", value: "rgba(2, 6, 23, 0.2)" },
      { name: "shadow-strength-light", value: "12" },
    ],
  },
  {
    name: "Dark",
    description: "Moody dark palette.",
    colors: [
      { name: "brand-dark", value: "#7c7eff" },
      { name: "brand-core-dark", value: "#a5b4fc" },
      { name: "brand-inverted-dark", value: "#0b1220" },
      { name: "brand-inverted-highlight1-dark", value: "#111827" },
      { name: "brand-inverted-highlight2-dark", value: "#1f2937" },
      { name: "primary-dark", value: "#22d3ee" },
      { name: "secondary-dark", value: "#4ade80" },
      { name: "tertiary-dark", value: "#fbbf24" },
      { name: "quaternary-dark", value: "#f87171" },
      { name: "text1-dark", value: "#f8fafc" },
      { name: "text2-dark", value: "#e2e8f0" },
      { name: "text3-dark", value: "#cbd5e1" },
      { name: "text4-dark", value: "#94a3b8" },
      { name: "surface1-dark", value: "#0b1220" },
      { name: "surface2-dark", value: "#0f172a" },
      { name: "surface3-dark", value: "#111827" },
      { name: "surface4-dark", value: "#1f2937" },
      { name: "surface5-dark", value: "#334155" },
      { name: "surface6-dark", value: "#475569" },
      { name: "surface7-dark", value: "#64748b" },
      { name: "surface8-dark", value: "#94a3b8" },
      { name: "surface-shadow-dark", value: "rgba(15, 23, 42, 0.55)" },
      { name: "shadow-strength-dark", value: "18" },
    ],
  },
  {
    name: "Neon",
    description: "Bold neon palette.",
    colors: [
      { name: "brand-neon", value: "#22ff88" },
      { name: "brand-core-neon", value: "#00ffcc" },
      { name: "brand-inverted-neon", value: "#071016" },
      { name: "brand-inverted-highlight1-neon", value: "#0a1a22" },
      { name: "brand-inverted-highlight2-neon", value: "#0f2430" },
      { name: "primary-neon", value: "#39ff14" },
      { name: "secondary-neon", value: "#00e5ff" },
      { name: "tertiary-neon", value: "#ff00e5" },
      { name: "quaternary-neon", value: "#ffe700" },
      { name: "text1-neon", value: "#eaffff" },
      { name: "text2-neon", value: "#bff8ff" },
      { name: "text3-neon", value: "#89e6ff" },
      { name: "text4-neon", value: "#59d0f2" },
      { name: "surface1-neon", value: "#000810" },
      { name: "surface2-neon", value: "#021320" },
      { name: "surface3-neon", value: "#061c2b" },
      { name: "surface4-neon", value: "#0b2536" },
      { name: "surface5-neon", value: "#123046" },
      { name: "surface6-neon", value: "#1a3b57" },
      { name: "surface7-neon", value: "#24516f" },
      { name: "surface8-neon", value: "#2e6a8d" },
      { name: "surface-shadow-neon", value: "rgba(0, 229, 255, 0.45)" },
      { name: "shadow-strength-neon", value: "22" },
    ],
  },
  {
    name: "Pastell",
    description: "Soft pastel palette.",
    colors: [
      { name: "brand-pastell", value: "#8bb8e8" },
      { name: "brand-core-pastell", value: "#a7c7eb" },
      { name: "brand-inverted-pastell", value: "#ffffff" },
      { name: "brand-inverted-highlight1-pastell", value: "#f5f9ff" },
      { name: "brand-inverted-highlight2-pastell", value: "#e9f2ff" },
      { name: "primary-pastell", value: "#a3e3dd" },
      { name: "secondary-pastell", value: "#f7c5cc" },
      { name: "tertiary-pastell", value: "#f6e6a7" },
      { name: "quaternary-pastell", value: "#d9c2e9" },
      { name: "text1-pastell", value: "#243043" },
      { name: "text2-pastell", value: "#40506a" },
      { name: "text3-pastell", value: "#5a6a84" },
      { name: "text4-pastell", value: "#7c8aa3" },
      { name: "surface1-pastell", value: "#ffffff" },
      { name: "surface2-pastell", value: "#fbfcff" },
      { name: "surface3-pastell", value: "#f6f9fe" },
      { name: "surface4-pastell", value: "#ecf3fb" },
      { name: "surface5-pastell", value: "#e2ecf7" },
      { name: "surface6-pastell", value: "#d6e3f2" },
      { name: "surface7-pastell", value: "#cbd9ec" },
      { name: "surface8-pastell", value: "#c0cfe6" },
      { name: "surface-shadow-pastell", value: "rgba(36, 48, 67, 0.18)" },
      { name: "shadow-strength-pastell", value: "10" },
    ],
  },
];

const currentVarNames = [
  "brand",
  "brand-core",
  "brand-inverted",
  "brand-inverted-highlight1",
  "brand-inverted-highlight2",
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "text1",
  "text2",
  "text3",
  "text4",
  "surface1",
  "surface2",
  "surface3",
  "surface4",
  "surface5",
  "surface6",
  "surface7",
  "surface8",
  "surface-shadow",
  "shadow-strength",
  "color-bg",
  "color-text",
  "color-primary",
  "cursor-color",
];

export default component$(() => {
  const themeOptions = ["light", "dark", "neon", "pastell"] as const;
  type ThemeName = (typeof themeOptions)[number];
  const currentTheme = useSignal<ThemeName>("light");
  const current = useStore<{ colors: { name: string; value: string }[] }>({
    colors: [],
  });

  const updateCurrentColors = $(() => {
    const styles = getComputedStyle(document.documentElement);
    current.colors = currentVarNames.map((name) => ({
      name,
      value: styles.getPropertyValue(`--${name}`).trim(),
    }));
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const storedTheme = localStorage.getItem(themeStorageKey) as ThemeName | null;
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const theme =
      storedTheme && themeOptions.includes(storedTheme) ? storedTheme : preferredTheme;
    if (!storedTheme) {
      localStorage.setItem(themeStorageKey, theme);
    }
    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);
    updateCurrentColors();
  });

  const setTheme$ = $((theme: ThemeName) => {
    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(themeStorageKey, theme);
    updateCurrentColors();
  });

  return (
    <>
      <div class="mb-8 flex items-center justify-between">
        <h1>Color Theme</h1>
        <div class="flex gap-2">
          {themeOptions.map((t) => (
            <button
              key={t}
              type="button"
              class="cursor-pointer rounded-md border border-[var(--color-text)] bg-[var(--color-bg)] px-3 py-1 text-sm text-[var(--color-text)] transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] aria-[pressed=true]:translate-y-[1px] aria-[pressed=true]:border-[var(--color-primary)] aria-[pressed=true]:bg-[var(--color-primary)] aria-[pressed=true]:text-[var(--color-bg)] aria-[pressed=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              aria-pressed={currentTheme.value === t}
              onClick$={() => setTheme$(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <section class="mb-8">
        <h2>Current</h2>
        <p>Resolved variables from the active theme.</p>
        <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
          {current.colors.map((c) => (
            <div class="flex items-center gap-2" key={c.name}>
              <div class={`h-10 w-10 rounded border bg-[var(--${c.name})]`} />
              <div class="text-sm">
                <div>{c.name}</div>
                <div>{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {themes.map((theme) => (
        <section key={theme.name} class="mb-8">
          <h2>{theme.name}</h2>
          <p>{theme.description}</p>
          <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
            {theme.colors.map((c) => (
              <div class="flex items-center gap-2" key={c.name}>
                <div
                  class="h-10 w-10 rounded border"
                  style={{ background: c.value }}
                />
                <div class="text-sm">
                  <div>{c.name}</div>
                  <div>{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
});

export const head = buildHead(
  `Color Theme - ${siteConfig.metadata.title}`,
  "Color swatches for light, dark, neon and pastell themes.",
);
