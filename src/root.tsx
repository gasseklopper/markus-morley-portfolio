import { component$, isDev, useVisibleTask$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { registerSW } from "virtual:pwa-register";
import siteConfig from "./config/siteConfig.json";
import { Footer } from "./components/template/footer";
import { Header } from "./components/template/header";

import "./global.css";

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if ("serviceWorker" in navigator) {
      registerSW({ immediate: true });
    }
  });

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
        <meta name="robots" content="index" />
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
      </head>
      <body lang="en">
        <Header />
        <RouterOutlet />
        <Footer />
      </body>
    </QwikCityProvider>
  );
});
