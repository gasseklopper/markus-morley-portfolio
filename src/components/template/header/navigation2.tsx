import {
	$,
	component$,
	noSerialize,
	type NoSerialize,
	useSignal,
	useStyles$,
	useTask$,
	useOnWindow,
	useVisibleTask$,
} from "@builder.io/qwik"
import { Link, useLocation } from "@builder.io/qwik-city"
import styles from "./navigation.scss?inline"
import { FeatureFlag, isFeatureEnabled } from "~/utils/feature-flags"
import {
	setupNavigationAnimations,
	type NavigationRuntime,
} from "./navigation.client"
import headerData from "./data"

type NavItem = {
	name: string
	link: string
	flag?: string
}

const getNavItems = () =>
	(Array.isArray(headerData.nav) ? headerData.nav : []) as NavItem[]

const excludedNavLinks = new Set(["/datenschutz", "/impressum"])

const isExcludedNavItem = (item: NavItem) =>
	excludedNavLinks.has(item.link.toLowerCase())

const getFilteredNavItems = () =>
	getNavItems().filter(
		(item) =>
			!isExcludedNavItem(item) &&
			(!item.flag || isFeatureEnabled(item.flag as FeatureFlag)),
	)

const MarkIcon = component$(() => (
	<svg
		viewBox="0 0 1024 1024"
		xmlns="http://www.w3.org/2000/svg"
		class="size-full"
		aria-hidden="true"
	>
		<rect x="92" y="92" width="280" height="280" fill="currentColor" />
		<rect x="92" y="372" width="280" height="280" fill="currentColor" />
		<rect x="92" y="652" width="280" height="280" fill="currentColor" />
		<rect x="372" y="92" width="280" height="280" fill="currentColor" />
		<rect x="372" y="372" width="280" height="280" fill="currentColor" />
		<rect x="652" y="92" width="280" height="280" fill="currentColor" />
		<rect x="652" y="372" width="280" height="280" fill="currentColor" />
		<rect x="652" y="652" width="280" height="280" fill="currentColor" />
	</svg>
))

export default component$(() => {
	useStyles$(styles)

	const navItems = getFilteredNavItems()
	const location = useLocation()

	const isMenuOpen = useSignal(false)
	const currentPathname = useSignal(location.url.pathname)
	const navRef = useSignal<HTMLElement>()
	const runtime = useSignal<NoSerialize<NavigationRuntime>>()

	const closeMenu$ = $(() => {
		isMenuOpen.value = false
		runtime.value?.close()
	})

	const toggleMenu$ = $(() => {
		isMenuOpen.value = !isMenuOpen.value
		if (isMenuOpen.value) runtime.value?.open()
		else runtime.value?.close()
	})

	useOnWindow(
		"keydown",
		$((event: KeyboardEvent) => {
			if (event.key === "Escape" && isMenuOpen.value) {
				void closeMenu$()
				navRef.value
					?.querySelector<HTMLButtonElement>(".navigation__toggle-button")
					?.focus()
			}
		}),
	)

	useTask$(({ track }) => {
		const pathname = track(() => location.url.pathname)
		if (pathname === currentPathname.value) return
		currentPathname.value = pathname
		isMenuOpen.value = false
		runtime.value?.close()
	})

	// SplitText and SVG timelines require mounted DOM nodes.
	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(async ({ cleanup }) => {
		const nav = navRef.value
		if (!nav) return
		const controller = new AbortController()
		let animation: NavigationRuntime | undefined
		cleanup(() => {
			controller.abort()
			animation?.cleanup()
			runtime.value = undefined
		})
		try {
			animation = await setupNavigationAnimations(nav, controller.signal)
			if (controller.signal.aborted) {
				animation?.cleanup()
				return
			}
			runtime.value = noSerialize(animation)
			if (isMenuOpen.value) animation?.open()
		} catch (error) {
			console.error("Menu animation could not be initialized", error)
		}
	})

	return (
		<nav
			ref={navRef}
			class={{ navigation: true, "is-menu-open": isMenuOpen.value }}
			id="site-header"
			aria-label="Primary navigation"
		>
			<div class="navigation__logo">
				<Link href="/" aria-label="Markus Morley home">
					<MarkIcon />
				</Link>
			</div>

			<div class="navigation__toggle">
				<button
					class="navigation__toggle-button"
					aria-expanded={isMenuOpen.value}
					aria-controls="site-menu"
					aria-label={isMenuOpen.value ? "Close menu" : "Open menu"}
					type="button"
					onClick$={toggleMenu$}
				>
					<span class="navigation__toggle-menu">Menu</span>
					<span class="navigation__toggle-close">Close</span>
				</button>
			</div>

			<div
				id="site-menu"
				class={{ menu: true, "is-open": isMenuOpen.value }}
				inert={!isMenuOpen.value}
				aria-hidden={!isMenuOpen.value}
			>
				<svg
					class="menu__bg-svg"
					viewBox="0 0 1131 861"
					preserveAspectRatio="none"
				>
					<path
						d="M1131,861 Q565.5,861 0,861 L0,0 L1131,0 Z"
						fill="var(--surfaceAccent)"
					/>
				</svg>

				<div class="menu__logo">
					<Link href="/" onClick$={closeMenu$} aria-label="Markus Morley home">
						<MarkIcon />
					</Link>
				</div>

				<div class="menu__col menu__col-info">
					<p>Get in touch</p>
					<h3>m-morley@gmx.de</h3>
					<h3>linkedin.com/in/markus-morley</h3>
				</div>

				<div class="menu__col menu__col-links">
					{navItems.map((item) => (
						<Link key={item.link} href={item.link} onClick$={closeMenu$}>
							{item.name}
						</Link>
					))}
				</div>
			</div>
		</nav>
	)
})
