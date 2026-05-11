// src/hooks/useGsapReveal.ts
import { useVisibleTask$ } from "@builder.io/qwik"
import { loadGsap } from "~/utils/gsapClient"

export const useGsapReveal = () => {
	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(async ({ cleanup }) => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		if (reduce) return

		const { gsap, ScrollTrigger } = await loadGsap()

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
