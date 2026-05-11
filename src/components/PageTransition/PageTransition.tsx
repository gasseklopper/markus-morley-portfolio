import {
	$,
	component$,
	useOnDocument,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik"
import { loadGsap } from "~/utils/gsapClient"

export const PageTransition = component$(() => {
	const overlayRef = useSignal<HTMLDivElement>()
	const pathRef = useSignal<SVGPathElement>()
	const transitionId = useSignal(0)

	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(async () => {
		const { gsap } = await loadGsap({ scrollTrigger: false })
		const path = pathRef.value
		const overlay = overlayRef.value
		if (!path || !overlay) return

		const length = path.getTotalLength()

		gsap.set(overlay, { display: "none", opacity: 0 })
		gsap.set(path, {
			strokeDasharray: length,
			strokeDashoffset: length,
			strokeWidth: 2,
		})
	})

	useOnDocument(
		"qviewTransition",
		$(async (event: Event) => {
			const { gsap } = await loadGsap({ scrollTrigger: false })
			const transition = (event as CustomEvent<any>).detail
			const currentTransitionId = transitionId.value + 1
			transitionId.value = currentTransitionId

			const overlay = overlayRef.value
			const path = pathRef.value
			if (!overlay || !path) return

			const length = path.getTotalLength()

			gsap.killTweensOf([overlay, path])

			const hideOverlay = () => {
				if (transitionId.value !== currentTransitionId) return

				gsap.killTweensOf([overlay, path])
				gsap.set(overlay, { display: "none", opacity: 0 })
				gsap.set(path, {
					strokeDasharray: length,
					strokeDashoffset: length,
					strokeWidth: 2,
				})
			}

			gsap.set(overlay, { display: "grid", opacity: 1 })
			gsap.set(path, {
				strokeDasharray: length,
				strokeDashoffset: length,
				strokeWidth: 2,
			})

			try {
				await transition.ready.catch(() => undefined)

				if (transitionId.value !== currentTransitionId) return

				// keep old page visible under overlay, hide new page completely
				document.documentElement.animate(
					[
						{ opacity: 1, transform: "scale(1)" },
						{ opacity: 0.96, transform: "scale(0.985)" },
					],
					{
						duration: 700,
						easing: "cubic-bezier(0.32, 0, 0.67, 0)",
						fill: "forwards",
						pseudoElement: "::view-transition-old(root)",
					},
				)

				document.documentElement.animate(
					[
						{ opacity: 0.96, transform: "scale(1.015)" },
						{ opacity: 1, transform: "scale(1)" },
					],
					{
						duration: 700,
						easing: "cubic-bezier(0.33, 1, 0.68, 1)",
						fill: "forwards",
						pseudoElement: "::view-transition-new(root)",
					},
				)

				await new Promise<void>((resolve) => {
					const tl = gsap.timeline({ onComplete: resolve })

					tl.to(path, {
						strokeDashoffset: 0,
						strokeWidth: 300,
						duration: 1.4,
						ease: "power2.inOut",
					})

					// hold a bit if you want
					tl.to({}, { duration: 0.1 })

					// fade overlay out only near the end
					tl.to(
						overlay,
						{
							opacity: 0,
							duration: 0.45,
							ease: "power2.inOut",
						},
						"-=0.1",
					)
				})

				if (transitionId.value !== currentTransitionId) return

				// now reveal the new page AFTER overlay animation is done
				const revealAnimation = document.documentElement.animate(
					[
						{ opacity: 0, transform: "scale(1.015)" },
						{ opacity: 1, transform: "scale(1)" },
					],
					{
						duration: 450,
						easing: "cubic-bezier(0.22, 1, 0.36, 1)",
						fill: "forwards",
						pseudoElement: "::view-transition-new(root)",
					},
				)

				await revealAnimation.finished.catch(() => undefined)
			} finally {
				hideOverlay()
			}
		}),
	)

	return (
		<div ref={overlayRef} class="page-transition" aria-hidden="true">
			<svg
				class="page-transition__svg"
				viewBox="0 0 1316 664"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid slice"
			>
				<path
					ref={pathRef}
					d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
					stroke="var(--black)"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	)
})
