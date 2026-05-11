import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head"
import { setupScrollTransition } from "./scroll-transition.client"

import "./scroll-transition.scss"

const slides = [
  {
    image: "/assets/images/photography/black/Template_index_03_12.jpg",
    label: "First",
    kicker: "Image",
    title: "Section transition",
    copy: "A responsive SVG mask grid opens column by column while scroll progress drives the next photographic layer into view.",
  },
  {
    image: "/assets/images/photography/black/Template_index_015.jpg",
    label: "Second",
    kicker: "Image",
    title: "Column grid",
    copy: "Each column shuffles vertically before revealing, giving the transition a controlled rhythm without feeling too mechanical.",
  },
  {
    image: "/assets/images/photography/black/Template_index_018.jpg",
    label: "Third",
    kicker: "Image",
    title: "ScrollTrigger",
    copy: "GSAP, ScrollTrigger, and Lenis stay inside the browser-only Qwik task so the route remains resumable.",
  },
]

export default component$(() => {
  const rootRef = useSignal<HTMLElement>()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const root = rootRef.value
    if (!root) return

    const lifecycle = {
      disposed: false,
      dispose: undefined as (() => void) | undefined,
    }

    cleanup(() => {
      lifecycle.disposed = true
      lifecycle.dispose?.()
    })

    lifecycle.dispose = await setupScrollTransition(root)
    if (lifecycle.disposed) lifecycle.dispose()
  })

  return (
    <article class="scroll-transition" ref={rootRef}>
      <section class="scroll-transition__spacer" aria-labelledby="scroll-transition-title">
        <div>
          <p class="scroll-transition__eyebrow">Qwik / GSAP / ScrollTrigger</p>
          <h1 id="scroll-transition-title">
            On-Scroll SVG Mask Transitions
            <span>Column Grid</span>
          </h1>
        </div>
        <span class="scroll-transition__hint">Scroll down</span>
      </section>

      <section class="scroll-transition__stage" aria-label="Column grid image transition">
        <div class="scroll-transition__layers">
          <img
            class="scroll-transition__reduced-image"
            src={slides[0].image}
            alt=""
            width="1600"
            height="1100"
          />
          {slides.map((slide, index) => {
            const maskId = `scroll-transition-mask-${index + 1}`

            return (
              <svg
                class="scroll-transition__layer"
                key={slide.image}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <mask id={maskId} maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="100" height="100" fill="#000000" />
                    <g data-blinds="" />
                  </mask>
                </defs>
                <image
                  href={slide.image}
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  preserveAspectRatio="xMidYMid slice"
                  mask={`url(#${maskId})`}
                />
              </svg>
            )
          })}

          <div class="scroll-transition__progress" aria-hidden="true">
            {slides.map((slide) => (
              <div class="scroll-transition__segment" key={slide.label}>
                <div class="scroll-transition__fill" />
              </div>
            ))}
          </div>

          <div class="scroll-transition__texts">
            {slides.map((slide) => (
              <div class="scroll-transition__text" key={slide.label}>
                <h2>
                  {slide.label}
                  <span>{slide.kicker}</span>
                </h2>
                <p class="scroll-transition__title">{slide.title}</p>
                <p class="scroll-transition__copy">{slide.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="scroll-transition__spacer scroll-transition__spacer--end">
        <h2>Scroll Transition Testpage</h2>
      </section>
    </article>
  )
})

export const head = buildHead(`Scroll Transition - ${siteMetadata.title}`)
