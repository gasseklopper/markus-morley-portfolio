import type { gsap } from "gsap"
import type { SplitText as SplitTextInstance } from "gsap/SplitText"
import { loadGsap } from "~/utils/gsapClient"
import { prefersReducedMotion } from "~/utils/browserClient"

export type NavigationRuntime = {
	open: () => void
	close: () => void
	cleanup: () => void
}

export const setupNavigationAnimations = async (
	nav: HTMLElement,
	signal: AbortSignal,
): Promise<NavigationRuntime | undefined> => {
	const { gsap, SplitText } = await loadGsap({
		scrollTrigger: false,
		splitText: true,
	})
	if (signal.aborted) return
	const menu = nav.querySelector<HTMLElement>(".menu")
	const menuBg = nav.querySelector<SVGPathElement>(".menu__bg-svg path")
	const toggleMenu = nav.querySelector<HTMLElement>(".navigation__toggle-menu")
	const toggleClose = nav.querySelector<HTMLElement>(
		".navigation__toggle-close",
	)
	const toggleButton = nav.querySelector<HTMLButtonElement>(
		".navigation__toggle-button",
	)
	const menuLogo = nav.querySelector<HTMLElement>(".menu__logo")
	const menuInfoItems = nav.querySelectorAll<HTMLElement>(
		".menu__col-info p, .menu__col-info h3, .menu__col-info h6",
	)
	const menuLinks =
		nav.querySelectorAll<HTMLAnchorElement>(".menu__col-links a")
	if (!menu || !menuBg || !toggleMenu || !toggleClose || !menuLogo) return

	let openTl!: gsap.core.Timeline
	let closeTl!: gsap.core.Timeline
	const splits: SplitTextInstance[] = []
	const hoverCleanups: Array<() => void> = []
	const context = gsap.context(() => {
		const svg = menuBg.ownerSVGElement
		const viewBox = svg?.viewBox.baseVal
		const svgWidth = viewBox?.width ?? 1131
		const svgHeight = viewBox?.height ?? 861
		const svgCenterX = svgWidth / 2

		const OPEN_HIDDEN = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 Z`
		const OPEN_BULGE = `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 Z`
		const OPEN_FULL = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 Z`

		const CLOSE_START = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} Z`
		const CLOSE_BULGE = `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} Z`
		const CLOSE_HIDDEN = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} Z`

		gsap.set(menu, { autoAlpha: 0, pointerEvents: "none" })
		gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } })
		gsap.set(toggleMenu, { opacity: 1 })
		gsap.set(toggleClose, { opacity: 0 })
		gsap.set(menuLogo, { opacity: 0 })
		gsap.set(menuInfoItems, { opacity: 0, y: 100 })

		menuLinks.forEach((link) => {
			const split = new SplitText(link as Element, {
				type: "chars",
				charsClass: "char",
			})

			splits.push(split)

			split.chars.forEach((charEl: HTMLElement, index: number) => {
				const text = charEl.textContent ?? ""

				const line = document.createElement("span")
				line.className = "char__line"
				const glyph = document.createElement("span")
				glyph.className = "char__glyph"
				glyph.textContent = text === " " ? "\u00a0" : text
				charEl.replaceChildren(line, glyph)

				if (index % 2 !== 0) {
					charEl.classList.add("char--front")
				}
			})

			gsap.set(split.chars, {
				opacity: 0,
				x: "750%",
			})

			const lines = split.chars
				.map((char: HTMLElement) => char.querySelector(".char__line"))
				.filter(Boolean) as HTMLElement[]

			gsap.set(lines, {
				scaleX: 0,
				transformOrigin: "left center",
			})

			const onEnter = () => {
				gsap.killTweensOf(lines)

				gsap.set(lines, {
					transformOrigin: "left center",
				})

				gsap.to(lines, {
					scaleX: 1,
					duration: 0.116,
					ease: "bounce.inOut",
					stagger: 0.116,
				})
			}

			const onLeave = () => {
				gsap.killTweensOf(lines)

				gsap.set(lines, {
					transformOrigin: "right center",
				})

				gsap.to(lines, {
					scaleX: 0,
					duration: 0.16,
					ease: "power2.inOut",
					stagger: 0.025,
				})
			}

			link.addEventListener("mouseenter", onEnter)
			link.addEventListener("mouseleave", onLeave)

			hoverCleanups.push(() => {
				link.removeEventListener("mouseenter", onEnter)
				link.removeEventListener("mouseleave", onLeave)
				gsap.killTweensOf(lines)
			})
		})

		const menuLinksChars = splits.flatMap((split) => split.chars)

		openTl = gsap.timeline({
			paused: true,
			onStart: () => {
				gsap.set(menu, { autoAlpha: 1 })
				gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } })
				gsap.set(menuLinks, { opacity: 1 })
				splits.forEach((split) => {
					gsap.set(split.chars, { opacity: 0, x: "750%" })
				})
				gsap.set(menu, { pointerEvents: "auto" })
			},
			onComplete: () => {
				if (document.activeElement === toggleButton)
					menuLinks[0]?.focus({ preventScroll: true })
			},
		})

		openTl
			.to(toggleMenu, {
				duration: 0.25,
				opacity: 0,
				ease: "none",
			})
			.to(
				toggleClose,
				{
					duration: 0.25,
					opacity: 1,
					ease: "none",
					delay: 0.25,
				},
				0,
			)
			.to(menuBg, {
				duration: 0.5,
				attr: { d: OPEN_BULGE },
				ease: "power4.in",
			})
			.to(menuBg, {
				duration: 0.5,
				attr: { d: OPEN_FULL },
				ease: "power4.out",
			})
			.to(
				menuLogo,
				{
					duration: 0.1,
					opacity: 1,
					ease: "none",
				},
				"-=0.75",
			)
			.to(
				menuInfoItems,
				{
					duration: 0.75,
					opacity: 1,
					y: 0,
					ease: "power3.out",
					stagger: 0.075,
				},
				"-=0.35",
			)
			.to(
				menuLinksChars,
				{
					duration: 0.65,
					opacity: 0,
				},
				0.45,
			)

			.to(
				menuLinksChars,
				{
					duration: 1.5,
					opacity: 1,
					x: "0%",
					ease: "elastic.out(1, 0.25)",
					stagger: 0.01,
				},
				">",
			) // start when previous ends

			.to(
				menuLinksChars,
				{
					duration: 0.75,
					opacity: 1,
					ease: "power2.out",
					stagger: 0.01,
				},
				"<0.2",
			) // start 0.2s after previous starts

		closeTl = gsap.timeline({
			paused: true,
			onStart: () => {
				gsap.set(menuBg, { attr: { d: CLOSE_START } })
			},
			onComplete: () => {
				gsap.set(menu, { autoAlpha: 0, pointerEvents: "none" })
				gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } })
				gsap.set(menuLogo, { opacity: 0 })
				gsap.set(menuInfoItems, { opacity: 0, y: 100 })
				splits.forEach((split) => {
					gsap.set(split.chars, { opacity: 0, x: "750%" })
				})

				if (menu.contains(document.activeElement))
					toggleButton?.focus({ preventScroll: true })
			},
		})

		closeTl
			.to(toggleClose, {
				duration: 0.3,
				opacity: 0,
				ease: "none",
			})
			.to(
				toggleMenu,
				{
					duration: 0.3,
					opacity: 1,
					ease: "none",
					delay: 0.25,
				},
				0,
			)
			.to(menuLogo, { duration: 0.3, opacity: 0 })
			.to(menuLinks, { duration: 0.3, opacity: 0 }, "<")
			.to(menuInfoItems, { duration: 0.3, opacity: 0 }, "<")
			.to(
				menuBg,
				{
					duration: 0.5,
					attr: { d: CLOSE_BULGE },
					ease: "power3.in",
				},
				"<",
			)
			.to(menuBg, {
				duration: 0.5,
				attr: { d: CLOSE_HIDDEN },
				ease: "power3.out",
			})
	}, nav)

	let isOpen = false
	const handleTab = (event: KeyboardEvent) => {
		if (!isOpen || event.key !== "Tab") return
		const focusable = [
			toggleButton,
			...menu.querySelectorAll<HTMLElement>("button, a[href]"),
		].filter(
			(element) =>
				element &&
				!element.closest("[inert]") &&
				element.getClientRects().length > 0,
		)
		const first = focusable[0]
		const last = focusable[focusable.length - 1]
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault()
			last?.focus()
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault()
			first?.focus()
		}
	}
	nav.addEventListener("keydown", handleTab)

	return {
		open() {
			if (isOpen) return
			isOpen = true
			closeTl.pause()
			openTl.restart()
			if (prefersReducedMotion()) openTl.progress(1).pause()
		},
		close() {
			if (!isOpen) return
			isOpen = false
			openTl.pause()
			closeTl.restart()
			if (prefersReducedMotion()) closeTl.progress(1).pause()
		},
		cleanup() {
			nav.removeEventListener("keydown", handleTab)
			hoverCleanups.forEach((cleanup) => cleanup())
			context.revert()
			splits.forEach((split) => split.revert())
		},
	}
}
