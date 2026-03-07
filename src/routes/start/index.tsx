import { component$, useSignal, $, useStyles$ } from "@builder.io/qwik"
import baseStyles from "../index.scss?inline"
import styles from "./start.scss?inline"
import siteConfig from "~/config/siteConfig.json"
import { buildHead } from "~/utils/head"



const images = [
  {
    src: "/assets/images/photography/black/Template_index_014.jpg",
    alt: "Black and white gallery image 1",
  },
  {
    src: "/assets/images/photography/black/Template_index_016.jpg",
    alt: "Black and white gallery image 2",
  },
  {
    src: "/assets/images/photography/black/Template_index_019.jpg",
    alt: "Black and white gallery image 3",
  },
]


export default component$(() => {
  useStyles$(baseStyles)
  useStyles$(styles)

  const currentIndex = useSignal(0)

  const goPrev = $(() => {
    currentIndex.value =
      currentIndex.value === 0 ? images.length - 1 : currentIndex.value - 1
  })

  const goNext = $(() => {
    currentIndex.value =
      currentIndex.value === images.length - 1 ? 0 : currentIndex.value + 1
  })

  return (
    <div class="page">
      <section>
        <div class="footer">
          <div class="footer__layout-container">
            <div class="footer__header">
                  <ul class="submenu-list">
                    <li class="submenu-item -p2">
                    <a class="item-link" href="/cyber-ew"><span>Cyber</span><span class="-slash"><span>/</span></span><span>EW</span></a>
                  </li>
                    <li class="submenu-item -p2">
                      <a class="item-link" href="/predictive-maintenance"><span>Predictive Maintenance</span></a>
                    </li>
                    <li class="submenu-item -p2">
                      <a class="item-link" href="/compliance"><span>Compliance</span></a>
                    </li>
                    <li class="submenu-item -p2">
                      <a class="item-link" href="/research"><span>Research</span></a>
                    </li>
                  </ul>
            </div>
            <div class="footer__content">
              <div class="footer__phone">
                <p>phone: 123-456-7890</p>
              </div>
              <div class="footer__linkedin">
                <p>linked</p>
              </div>
              <div class="footer__email">
                <p>email: info@example.com</p>
              </div>
            </div>
            <div class="footer__footer">
              <div class="footer__phone">
                <p>phone: 123-456-7890</p>
              </div>
              <div class="footer__linkedin">
                <p>linked</p>
              </div>
              <div class="footer__email">
                <p>email: info@example.com</p>
              </div>
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
              {/* <div class="hero__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
              </div> */}
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
      {/* gallery */}
      <section>
        <div class="gallery">
          <div class="gallery__header">
            <div class="gallery__headline">
              <h2>Gallery</h2>
              <p>some text</p>
            </div>
            <div class="gallery__controls">
              <button
                class="gallery__button"
                onClick$={goPrev}
                aria-label="Previous image"
              >
                ←
              </button>

              <div class="gallery__meta">
                <span>
                  {String(currentIndex.value + 1).padStart(2, "0")}
                </span>
                <span>/</span>
                <span>{String(images.length).padStart(2, "0")}</span>
              </div>

              <button
                class="gallery__button"
                onClick$={goNext}
                aria-label="Next image"
              >
                →
              </button>
            </div>
          </div>

          <div class="gallery__content">
            <div class="gallery__card">
              <img src="../assets/images/photography/black/Template_index_014.jpg" alt="" />
            </div>
            <div class="gallery__card">
              <img src="../assets/images/photography/black/Template_index_016.jpg" alt="" />
            </div>
            <div class="gallery__card">
              <img src="../assets/images/photography/black/Template_index_019.jpg" alt="" />
            </div>
          </div>
          <div class="gallery__footer">
            <p>some text</p>
            <h4>twtwtw  </h4>
          </div>
        </div>
      </section>
      {/* teaser */}
      <section>
        <div class="teaser">
          {/* layout left */}
          <div class="teaser__layout-left">
            <div class="teaser__teaser-big">
              <img src="../assets/images/photography/black/Template_index_011.jpg" alt="" />
            </div>
            <div class="teaser__teaser-right-bottom">
              <p>date</p>
              <p>tag</p>
              <p> I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.</p>
              <h2>Shift5</h2>
              <a class="" href="/contact" >read more
              </a>
            </div>
          </div>

          {/* layout right */}
          <div class="teaser__layout-right">
            <div class="teaser__teaser-2-column">
              <div class="teaser__base_card">
                <h2>Design Systems</h2>
                <p>
                  I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
                </p>
              </div>
              <div class="teaser__base_card">
                <h2>Prototyping</h2>
                <p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Large-Scale Projects</h2>
                <p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Design Systems</h2>
                <p>
                  I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
                </p>
              </div>
              <div class="teaser__base_card">
                <h2>Prototyping</h2>
                <p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Large-Scale Projects</h2>
                <p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Design Systems</h2>
                <p>
                  I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
                </p>
              </div>
              <div class="teaser__base_card">
                <h2>Prototyping</h2>
                <p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Large-Scale Projects</h2>
                <p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Design Systems</h2>
                <p>
                  I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
                </p>
              </div>
              <div class="teaser__base_card">
                <h2>Prototyping</h2>
                <p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Large-Scale Projects</h2>
                <p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Design Systems</h2>
                <p>
                  I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
                </p>
              </div>
              <div class="teaser__base_card">
                <h2>Prototyping</h2>
                <p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Large-Scale Projects</h2>
                <p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
              </div>
              <div class="teaser__base_card">
                <h2>Hybrid Development</h2>
                <p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
              </div>
            </div>
          </div>


        </div>
      </section>
      {/* get in touch */}
      <section>
        <div class="getintouch">
          <div class="getintouch__header">
            <h4>Get in touch to learn more.</h4>

          </div>
          <div class="getintouch__content">
            <div class="getintouch__phone">

              <p>phone: 123-456-7890</p>
            </div>
            <div class="getintouch__linkedin">
              <p>linked</p>
            </div>
            <div class="getintouch__email">
              <p>email: info@example.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})

export const head = buildHead(`Start - ${siteConfig.metadata.title}`)
