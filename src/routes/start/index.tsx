import { component$, useSignal, $, useStyles$, useVisibleTask$ } from "@builder.io/qwik"
import baseStyles from "../index.scss?inline"
import styles from "./start.scss?inline"
import siteConfig from "~/config/siteConfig.json"
import { buildHead } from "~/utils/head"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";



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
  const footerLayoutRef = useSignal<HTMLElement>()
  const footerRef = useSignal<HTMLElement>();
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (!footerLayoutRef.value) return

    gsap.registerPlugin(ScrollTrigger)

    const el = footerLayoutRef.value

    gsap.set(el, {
      opacity: 0,
      y: 140,
      scaleY: 0.92,
      transformOrigin: "top center",
      clipPath: "inset(100% 0% 0% 0% round 18px 18px 0 0)",
      willChange: "transform, opacity, clip-path",
    })

    gsap.to(el, {
      opacity: 1,
      y: 0,
      scaleY: 1,
      clipPath: "inset(0% 0% 0% 0% round 18px 18px 0 0)",
      duration: 3,
      ease: "sine.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true
      },
    });
  });

  useVisibleTask$(async () => {
    const footer = footerRef.value
    if (!footer) return

    const cleanup: Array<() => void> = []

    const items = Array.from(
      footer.querySelectorAll<HTMLElement>('.sticky-link')
    )

    const textItems = Array.from(
      footer.querySelectorAll<HTMLElement>('.sticky-link__text')
    )

    const gsapModule = await import('gsap')
    const gsap = gsapModule.gsap

    items.forEach((item, i) => {
      const text = textItems[i]
      if (!text) return

      const sticky = Number(item.dataset.sticky || 8)

      const update = (x: number, y: number, duration: number) => {
        gsap.to(text, {
          x,
          y,
          duration,
          ease: 'power2.out',
          overwrite: true,
        })
      }

      const onMove = (e: MouseEvent) => {
        const rect = item.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        update(
          (offsetX - rect.width / 2) / sticky,
          (offsetY - rect.height / 2) / sticky,
          0.4
        )
      }

      const onEnter = (e: MouseEvent) => {
        const rect = item.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        update(
          (offsetX - rect.width / 2) / sticky,
          (offsetY - rect.height / 2) / sticky,
          0.12
        )
      }

      const onLeave = () => {
        update(0, 0, 0.5)
      }

      item.addEventListener('mousemove', onMove)
      item.addEventListener('mouseenter', onEnter)
      item.addEventListener('mouseleave', onLeave)

      cleanup.push(() => {
        item.removeEventListener('mousemove', onMove)
        item.removeEventListener('mouseenter', onEnter)
        item.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => {
      cleanup.forEach((fn) => fn())
    }
  });
   const moveSticky = $((e: MouseEvent, el: HTMLElement) => {
    const text = el.querySelector('.sticky-link__text') as HTMLElement
    if (!text) return

    const sticky = Number(el.dataset.sticky || 8)

    const rect = el.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const x = (offsetX - rect.width / 2) / sticky
    const y = (offsetY - rect.height / 2) / sticky

    gsap.to(text, {
      x,
      y,
      duration: 0.4,
      ease: 'power2.out'
    })
  })

   const enterSticky = $((e: MouseEvent, el: HTMLElement) => {
    const text = el.querySelector('.sticky-link__text') as HTMLElement
    if (!text) return

    const sticky = Number(el.dataset.sticky || 8)

    const rect = el.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    gsap.to(text, {
      x: (offsetX - rect.width / 2) / sticky,
      y: (offsetY - rect.height / 2) / sticky,
      duration: 0.12,
      ease: 'power2.out'
    })
  })

   const leaveSticky = $((el: HTMLElement) => {
    const text = el.querySelector('.sticky-link__text') as HTMLElement
    if (!text) return

    gsap.to(text, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
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
      {/* footer */}
      <section>
        <div class="footer" ref={footerRef}>
          <div class="footer__layout-container" ref={footerLayoutRef}>
            <div class="footer__headlayout">
              <div class="footer__logo">
                <h2>MARKUS MORLEY</h2>
              </div>
              <div class="footer__slogan">
                <h2>Product Engineer</h2>
              </div>
              <div class="footer__header">
                <ul class="footer__submenu-list">

                </ul>
              </div>
              <div class="footer__content">
                <ul class="footer__submenu-list">

                </ul>
              </div>
            </div>
            <div class="footer__headlayout">
              <div class="footer__logo">
                <h2></h2>
              </div>
              <div class="footer__slogan">
                <h2></h2>
              </div>
              <div class="footer__header">
                <ul class="footer-links">
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Home</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/About"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">About</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/Contact"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Contact</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/Portfolio"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Portfolio</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/404"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">404</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="footer__content">
                <ul class="footer-links">
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/About"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Linkedin</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/Contact"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Github</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/Portfolio"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Research</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="footer__footer">
              <div class="footer__name">
                <h2>MORLEY</h2>
              </div>
            </div>
          </div>
          <div class="footer__navigatiosn">
            <ul class="footer-linkss">
              <li>
                <a  href="/">
                  <span class="sticky-link__text">©2026 Markus Morley.</span>
                </a>
              </li>
              <li>
                <a href="/Privacy-Policy">
                  <span class="sticky-link__text">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a  href="/License-Agreement">
                  <span >License Agreement</span>
                </a>
              </li>
              <li>
                <a  href="/Terms-of-Use">
                  <span >Terms of Use</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* <footer ref={footerRef}>
        <ul class="footer-links">
          <li>
            <a class="sticky-link" data-sticky="1" href="/">
              <span class="sticky-link__text">©2026 Markus Morley.</span>
            </a>
          </li>
          <li>
            <a class="sticky-link" data-sticky="1" href="/Privacy-Policy">
              <span class="sticky-link__text">Privacy Policy</span>
            </a>
          </li>
          <li>
            <a class="sticky-link" data-sticky="2" href="/License-Agreement">
              <span class="sticky-link__text">License Agreement</span>
            </a>
          </li>
          <li>
            <a class="sticky-link" data-sticky="3" href="/Terms-of-Use">
              <span class="sticky-link__text">Terms of Use</span>
            </a>
          </li>
        </ul>
      </footer> */}
    </div>
  )
})

export const head = buildHead(`Start - ${siteConfig.metadata.title}`)
