import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import siteConfig from "~/config/siteConfig.json"
import { buildHead } from "~/utils/head"
import { loadGsap } from "~/utils/gsapClient"

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

type BlindSet = {
  cells: SVGRectElement[]
  rows: number
  cols: number
}

export default component$(() => {
  const rootRef = useSignal<HTMLElement>()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const root = rootRef.value
    if (!root) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) {
      root.classList.add("scroll-transition--reduced")
      return
    }

    const { gsap, ScrollTrigger } = await loadGsap()
    const lenisMod = await import("lenis")
    const Lenis = (lenisMod as any).default ?? lenisMod
    const svgNS = "http://www.w3.org/2000/svg"
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    const lenis = new Lenis({
      lerp: 0.15,
      smoothWheel: true,
      smoothTouch: !isTouch,
    })

    let blindsSets: BlindSet[] = []
    let master: gsap.core.Timeline | undefined
    let resizeTimer: number | undefined

    const getGridCols = () => {
      if (window.innerWidth <= 599) return 6
      if (window.innerWidth <= 1024) return 10
      return 14
    }

    const createBlinds = (group: SVGGElement | null): BlindSet | null => {
      if (!group) return null

      group.innerHTML = ""

      const width = window.innerWidth
      const height = window.innerHeight
      const vbWidth = 100
      const vbHeight = (height / width) * 100
      const cols = getGridCols()
      const rows = Math.max(1, Math.round(cols * (vbHeight / vbWidth)))
      const cellW = vbWidth / cols
      const cellH = vbHeight / rows
      const cells: SVGRectElement[] = []

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const rect = document.createElementNS(svgNS, "rect")
          rect.setAttribute("x", String(x * cellW))
          rect.setAttribute("y", String(y * cellH))
          rect.setAttribute("width", String(cellW))
          rect.setAttribute("height", String(cellH))
          rect.setAttribute("fill", "white")
          rect.setAttribute("shape-rendering", "crispEdges")
          rect.setAttribute("opacity", "0")

          group.appendChild(rect)
          cells.push(rect)
        }
      }

      return { cells, rows, cols }
    }

    const openBlinds = ({ cells, rows, cols }: BlindSet) => {
      const ordered: SVGRectElement[] = []

      for (let x = 0; x < cols; x++) {
        const column: SVGRectElement[] = []

        for (let y = 0; y < rows; y++) {
          column.push(cells[y * cols + x])
        }

        ordered.push(...gsap.utils.shuffle(column))
      }

      return gsap.timeline().to(ordered, {
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.02 },
      })
    }

    const textIn = (el: Element) =>
      gsap.fromTo(el, {
        autoAlpha: 0,
        clipPath: "inset(18% 0% 0% 0%)",
        y: 52,
      }, {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        y: 0,
        duration: 2.8,
        ease: "power4.out",
      })

    const textOut = (el: Element) =>
      gsap.to(el, {
        autoAlpha: 0,
        clipPath: "inset(0% 0% 55% 0%)",
        y: -28,
        duration: 2,
        ease: "power3.inOut",
      })

    const buildMasterTimeline = () => {
      if (master) master.kill()

      const texts = gsap.utils.toArray(root.querySelectorAll(".scroll-transition__text"))
      const stage = root.querySelector(".scroll-transition__stage")
      if (!stage) return

      master = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: 2.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      blindsSets.forEach((set, index) => {
        master?.add(openBlinds(set))

        const text = texts[index]
        if (text) {
          master?.add(textIn(text), "-=0.3")
          master?.add(textOut(text), "+=0.8")
        }
      })
    }

    const updateLayout = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const vbWidth = 100
      const vbHeight = (height / width) * 100
      blindsSets = []

      root.querySelectorAll<SVGSVGElement>(".scroll-transition__layer").forEach((svg) => {
        svg.setAttribute("viewBox", `0 0 ${vbWidth} ${vbHeight}`)

        const maskRect = svg.querySelector("mask rect")
        maskRect?.setAttribute("width", String(vbWidth))
        maskRect?.setAttribute("height", String(vbHeight))

        const img = svg.querySelector("image")
        img?.setAttribute("width", String(vbWidth))
        img?.setAttribute("height", String(vbHeight))

        const result = createBlinds(svg.querySelector("g[data-blinds]"))
        if (result) blindsSets.push(result)
      })

      buildMasterTimeline()
    }

    const initProgressBar = () => {
      const progressFills = Array.from(
        root.querySelectorAll<HTMLElement>(".scroll-transition__fill"),
      )
      const stage = root.querySelector(".scroll-transition__stage")
      if (!stage) return undefined

      return ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self: { progress: number }) => {
          const totalSteps = progressFills.length

          progressFills.forEach((fill: HTMLElement, index: number) => {
            const progress = Math.max(0, Math.min(1, (self.progress - index / totalSteps) * totalSteps))
            fill.style.width = `${progress * 100}%`
          })
        },
      })
    }

    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)

      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh()
        updateLayout()
      }, 250)
    }

    const lenisUpdate = () => ScrollTrigger.update()
    const tick = (time: number) => lenis.raf(time * 1000)

    lenis.on("scroll", lenisUpdate)
    gsap.ticker.add(tick)
    updateLayout()
    const progressTrigger = initProgressBar()
    window.addEventListener("resize", onResize)

    cleanup(() => {
      window.removeEventListener("resize", onResize)
      if (resizeTimer) window.clearTimeout(resizeTimer)
      gsap.ticker.remove(tick)
      progressTrigger?.kill()
      master?.kill()
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (root.contains(trigger.trigger)) trigger.kill()
      })
      lenis.destroy()
    })
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

export const head = buildHead(`Scroll Transition - ${siteConfig.metadata.title}`)
