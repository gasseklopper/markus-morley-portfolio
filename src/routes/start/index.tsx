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
          {/* layout left */}
          <div class="hero__layout-left">
            <div class="hero__teaser-big" style={{ height: "800px" }}>
              <h2>Hero Teaser</h2>
              <p>This is the hero teaser content.</p>
            </div>
            <div class="hero__teaser-big" style={{ height: "1200px" }}>
              <h2>Hero Teaser</h2>
              <p>This is the hero teaser content video.</p>
              <video class="hero__video" src="/assets/135191d3.mp4" muted="" loop="" playsinline="" ></video>
            </div>
            <div class="hero__teaser-3-column">
              <div class="hero__base_card">
                <h2>Shift5 Partners with Anduril on Army's Next Generation Command and Control Initiative</h2>
                <p>
                  Operational Intelligence Platform Integrates with Lattice Mesh to Deliver Near Real-Time Vehicle Health Data for Enhanced Mission Readiness
                </p>
              </div>
              <div class="hero__base_card">
                <h2>Card 2</h2>
                <p>This is the content for Card 2.</p>
              </div>
              <div class="hero__base_card">
                <h2>Card 3</h2>
                <p>This is the content for Card 3.</p>
              </div>
            </div>
          </div>

          {/* layout right */}
          <div class="hero__layout-right">
            <div class="hero__teaser-right-top">
              <h2>Hero Content</h2>
              <p>Powering actionable
                insights for America’s
                defense and
                transportation systems.</p>
            </div>
            <div class="hero__teaser-right-middle">
              {/* <h2>Hero Content</h2> */}
              <p>System Status</p>
              <li>01. GPS</li>
              <li>02. Radar</li>
              <li>03. Engines</li>
              <li>04. Electrical</li>
              <li>05. Fuel</li>
              <li>06. Electronic Warfare</li>
              <li>07. Countermeasures</li>
              <li>08. Environmental</li>
              <li>09. Communications</li>
              <li>10. Flight Data Links</li>
            </div>
            <div class="hero__teaser-right-bottom">
              <a class="" href="/contact" >
                <svg role="presentation"
                  class="cta-arrow-icon"
                  viewBox="0 0 132 132"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M112.967 19.8906L19.9668 111.891"
                    stroke="currentColor"
                    stroke-width="20"
                    style="will-change: stroke-dashoffset; stroke-dashoffset: 0px; stroke-dasharray: 131;">
                  </path>
                  <path
                    d="M110 27L110 106"
                    stroke="currentColor"
                    stroke-width="20"
                    style="will-change: stroke-dashoffset; stroke-dashoffset: 0px; stroke-dasharray: 79;">
                  </path>
                  <path
                    d="M106.498 23L26.9993 23.4458"
                    stroke="currentColor"
                    stroke-width="20"
                    style="will-change: stroke-dashoffset; stroke-dashoffset: 0px; stroke-dasharray: 79;">
                  </path>
                </svg>
              </a>
              <p>Contact</p>
            </div>
          </div>


        </div>
      </section>
    </div>
  )
})

export const head = buildHead(`Start - ${siteConfig.metadata.title}`)
