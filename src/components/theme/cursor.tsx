import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { loadGsap } from "~/utils/gsapClient"

export const Cursor = component$(() => {
  const cursorRef = useSignal<HTMLDivElement>()
  const enabled = useSignal(true)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const update = () => {
      enabled.value =
        document.documentElement.getAttribute("data-cursor") !== "false"
    }

    update()

    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-cursor"],
    })

    cleanup(() => observer.disconnect())
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup, track }) => {
    track(() => enabled.value)

    let disposed = false
    cleanup(() => {
      disposed = true
    })

    const { gsap } = await loadGsap({ scrollTrigger: false })
    if (disposed) return

    const cursorEl = cursorRef.value
    if (!cursorEl || !enabled.value) return

    const particleEls = Array.from(
      cursorEl.querySelectorAll<HTMLElement>(".cursor__particle"),
    )

    let activeTarget: HTMLElement | null = null

    gsap.set(cursorEl, {
      xPercent: -50,
      yPercent: -50,
      width: 6,
      height: 6,
    })

    let toX = gsap.quickTo(cursorEl, "x", {
      duration: 0.2,
      ease: "power3.out",
    })

    let toY = gsap.quickTo(cursorEl, "y", {
      duration: 0.2,
      ease: "power3.out",
    })

    const resetQuickTo = () => {
      toX = gsap.quickTo(cursorEl, "x", {
        duration: 0.2,
        ease: "power3.out",
      })
      toY = gsap.quickTo(cursorEl, "y", {
        duration: 0.2,
        ease: "power3.out",
      })
    }

    const getInteractiveTarget = (node: EventTarget | null) => {
      if (!(node instanceof HTMLElement)) return null

      const target = node.closest<HTMLElement>(
        "a, button, [data-cursor-hover]",
      )

      if (!target) return null
      if (target.closest(".page-transition")) return null

      return target
    }

    const burstParticles = () => {
      particleEls.forEach((particle, index) => {
        const angle = (Math.PI * 2 * index) / particleEls.length
        const distance = 14 + Math.random() * 36

        gsap.killTweensOf(particle)

        gsap.set(particle, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
        })

        gsap.to(particle, {
          x: Math.cos(angle) * (distance + 11),
          y: Math.sin(angle) * (distance + 18),
          scale: 5,
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
        })

        gsap.to(particle, {
          x: Math.cos(angle) * (distance + 38),
          y: Math.sin(angle) * (distance + 38),
          scale: 0,
          opacity: 0,
          duration: 0.35,
          delay: 0.08,
          ease: "power3.out",
        })
      })
    }

    const growCursorToTarget = (target: HTMLElement) => {
      activeTarget = target

      const rect = target.getBoundingClientRect()
      const paddingX = 16
      const paddingY = 8

      gsap.to(cursorEl, {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: Math.max(rect.width + paddingX, 24),
        height: Math.max(rect.height + paddingY, 24),
        duration: 0.25,
        ease: "power3.out",
      })

      burstParticles()
    }

    const resetCursor = () => {
      activeTarget = null

      gsap.to(cursorEl, {
        width: 6,
        height: 6,
        duration: 0.25,
        ease: "power3.out",
      })
    }

    const handleMove = (e: MouseEvent) => {
      if (activeTarget && document.contains(activeTarget)) {
        const rect = activeTarget.getBoundingClientRect()

        toX(rect.left + rect.width / 2)
        toY(rect.top + rect.height / 2)
        return
      }

      if (activeTarget && !document.contains(activeTarget)) {
        activeTarget = null
        resetCursor()
      }

      toX(e.clientX)
      toY(e.clientY)
    }

    const handlePointerOver = (e: PointerEvent) => {
      const target = getInteractiveTarget(e.target)
      if (!target) return

      if (target === activeTarget) return
      growCursorToTarget(target)
    }

    const handlePointerOut = (e: PointerEvent) => {
      const fromTarget = getInteractiveTarget(e.target)
      if (!fromTarget) return

      const toTarget = getInteractiveTarget(e.relatedTarget)
      if (fromTarget === toTarget) return

      resetCursor()
    }

    const handleLeave = () => {
      activeTarget = null

      gsap.to(cursorEl, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        duration: 0.6,
        ease: "power3.inOut",
      })
    }

    const handleEnter = () => {
      toX = gsap.quickTo(cursorEl, "x", {
        duration: 0.6,
        ease: "power3.inOut",
      })
      toY = gsap.quickTo(cursorEl, "y", {
        duration: 0.6,
        ease: "power3.inOut",
      })

      gsap.delayedCall(0.6, resetQuickTo)
    }

    window.addEventListener("mousemove", handleMove)
    document.addEventListener("pointerover", handlePointerOver)
    document.addEventListener("pointerout", handlePointerOut)
    document.addEventListener("mouseleave", handleLeave)
    document.addEventListener("mouseenter", handleEnter)

    cleanup(() => {
      window.removeEventListener("mousemove", handleMove)
      document.removeEventListener("pointerover", handlePointerOver)
      document.removeEventListener("pointerout", handlePointerOut)
      document.removeEventListener("mouseleave", handleLeave)
      document.removeEventListener("mouseenter", handleEnter)
    })
  })

  return enabled.value ? (
    <div ref={cursorRef} class="cursor" aria-hidden="true">
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
      <span class="cursor__particle" />
    </div>
  ) : null
})

export default Cursor
