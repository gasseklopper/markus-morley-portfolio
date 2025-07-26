import { createContextId, type Signal } from "@builder.io/qwik";

export const ThemeContext = createContextId<Signal<'light' | 'dark'>>(
  'theme-context',
);
