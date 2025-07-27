import {
  component$,
  isDev,
  useVisibleTask$,
  useOnDocument,
  $,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  useNavigate,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { registerSW } from "virtual:pwa-register";
import siteConfig from "./config/siteConfig.json";
import { Footer } from "./components/template/footer";
import { Header } from "./components/template/header";
import { PreferenceScripts } from "./components/theme/preference-scripts";
import { Overlay } from "./components/theme/overlay";
import { Cursor } from "./components/theme/cursor";

import "./global.css";
import "./styles/layout.scss";

export default component$(() => {
  const nav = useNavigate();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if ("serviceWorker" in navigator) {
      registerSW({ immediate: true });
    }
  });

  useOnDocument(
    "click",
    $((e: Event) => {
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;
      e.preventDefault();
      if (document.startViewTransition) {
        document.startViewTransition(() => nav(href));
      } else {
        nav(href);
      }
    }),
  );

  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={siteConfig.metadata.author} />
        <meta name="description" content={siteConfig.metadata.description} />
        <meta name="content" content={siteConfig.metadata.description} />
        <meta property="og:image" content={siteConfig.metadata.image} />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.webmanifest`}
          />
        )}
        <RouterHead />
        <PreferenceScripts />
      </head>
      <body lang="en">
        <Header />
        <RouterOutlet />
        <Footer />
        <Overlay />
        <Cursor />
      </body>
    </QwikCityProvider>
  );
});
