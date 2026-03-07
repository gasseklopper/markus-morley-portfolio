import { component$, useStyles$ } from "@builder.io/qwik"
import baseStyles from "../index.scss?inline"
import styles from "./start.scss?inline"
import siteConfig from "~/config/siteConfig.json"
import { buildHead } from "~/utils/head"

export default component$(() => {
  useStyles$(baseStyles)
  useStyles$(styles)
  return (
    <div class="page">
      <h1>Start</h1>
      <p>start</p>
      <section>
        <div class="hero">
          <div class="hero__layout-left">
            <div class="hero__teaser-big" style={{ height: "800px" }}>
              <h2>Hero Teaser</h2>
              <p>This is the hero teaser content.</p>
            </div>
            <div class="hero__teaser-big" style={{ height: "800px" }}>
              <h2>Hero Teaser</h2>
              <p>This is the hero teaser content.</p>
            </div>
          </div>
          <div class="hero__layout-right">
            <div class="hero__teaser-small bg-gray-400" style={{ height: "400px" }}>
              <h2>Hero Content</h2>
              <p>Powering actionable
                insights for America’s
                defense and
                transportation systems.</p>
            </div>
            <div class="hero__teaser-small bg-black" style={{ height: "400px" }}>
              <h2>Hero Content</h2>
              <p>System Status

                01. GPS
                02. Radar
                03. Engines
                04. Electrical
                05. Fuel
                06. Electronic Warfare
                07. Countermeasures
                08. Environmental
                09. Communications
                10. Flight Data Links</p>
            </div>
            <div class="hero__teaser-small bg-red-800" style={{ height: "600px" }}>
              <h2>Hero Content</h2>
              <p>This is the hero content.</p>
            </div>
          </div>


        </div>
      </section>
    </div>
  )
})

export const head = buildHead(`Start - ${siteConfig.metadata.title}`)
