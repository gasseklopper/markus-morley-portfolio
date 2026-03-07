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
      <section>
        <div class="hero">
          {/* layout left */}
          <div class="hero__layout-left">
            <div class="hero__teaser-big-about" style={{ height: "800px" }}>
              <p>I blend research-led design exploration with resilient engineering to help brands move boldly. From Frankfurt am Main, I build the prototypes, systems, and large-scale platforms that turn possibility into product reality.</p>
              <h1>Fearless digital experiences crafted with precision.</h1>
            </div>
            <div class="hero__teaser-big" style={{ height: "1200px" }}>
              <img src="../assets/images/photography/black/Template_index_04.jpg" alt="" />
            </div>
            <div class="hero__teaser-3-column">
              <div class="hero__base_card">
                <h2>Design Systems</h2>
                <p>
                  I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
                </p>
              </div>
              <div class="hero__base_card">
                <h2>Prototyping</h2>
                <p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
              </div>
              <div class="hero__base_card">
                <h2>Large-Scale Projects</h2>
                <p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
              </div>
              <div class="hero__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
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
      <section>
        <div class="hero">
          {/* layout left */}
          <div class="hero__layout-left">
            <div class="hero__teaser-big-about" style={{ height: "800px" }}>
              <p>I blend research-led design exploration with resilient engineering to help brands move boldly. From Frankfurt am Main, I build the prototypes, systems, and large-scale platforms that turn possibility into product reality.</p>
              <h1>Fearless digital experiences crafted with precision.</h1>
            </div>
            <div class="hero__teaser-big" style={{ height: "1200px" }}>
              <img src="../assets/images/photography/black/Template_index_04.jpg" alt="" />
            </div>
            <div class="hero__teaser-3-column">
              <div class="hero__base_card">
                <h2>Design Systems</h2>
                <p>
                  I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
                </p>
              </div>
              <div class="hero__base_card">
                <h2>Prototyping</h2>
                <p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
              </div>
              <div class="hero__base_card">
                <h2>Large-Scale Projects</h2>
                <p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
              </div>
              <div class="hero__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
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
