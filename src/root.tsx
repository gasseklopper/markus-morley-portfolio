import { component$, isDev, useVisibleTask$ } from "@builder.io/qwik"
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city"
import { RouterHead } from "./components/router-head/router-head"
import { registerSW } from "virtual:pwa-register"
import siteConfig from "./config/siteConfig.json"
import { Footer } from "./components/template/footer"
import { Header } from "./components/template/header"
import { PreferenceScripts } from "./components/theme/preference-scripts"
import { Overlay } from "./components/theme/overlay"
import { Cursor } from "./components/theme/cursor"
import { LocalhostOutline } from "./components/dev-outline/dev-outline"

import "./global.css"
import "./styles/layout.scss"

export default component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if ("serviceWorker" in navigator) {
      registerSW({ immediate: true })
    }
  })

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
        {isDev && <LocalhostOutline />}

        <div class="flex flex-col min-h-screen">
          <header class="bg-slate-700 p-4">
            <Header />
          </header>
          <main class="flex-grow p-4"> <RouterOutlet /></main>
          <footer class="bg-slate-700  p-4">
            <Footer />
          </footer>
        </div>
        <Overlay />
        <Cursor />
      </body>
    </QwikCityProvider>
  )
})
