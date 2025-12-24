// src/hooks/useGsapReveal.ts
import { useVisibleTask$ } from "@builder.io/qwik"

export const useGsapReveal = () => {
	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(async ({ cleanup }) => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		if (reduce) return

		const gsapMod = await import("gsap")
		const stMod = await import("gsap/ScrollTrigger")
		const gsap = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod
		const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default

		gsap.registerPlugin(ScrollTrigger)

		const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))

		const animations = els.map((el) => {
			const y = Number(el.dataset.y ?? 18)
			const duration = Number(el.dataset.duration ?? 0.55)
			const start = el.dataset.start ?? "top 85%"
			const end = el.dataset.end ?? "top 55%"

			return gsap.fromTo(
				el,
				{ autoAlpha: 0, y },
				{
					autoAlpha: 1,
					y: 0,
					duration,
					ease: "power2.out",
					scrollTrigger: {
						trigger: el,
						start,
						end,
						toggleActions: "play none play reverse",
					},
				}
			)
		})

		cleanup(() => {
			animations.forEach((a) => a.kill())
			ScrollTrigger.getAll().forEach((t: { kill: () => any }) => t.kill())
		})
	})
}