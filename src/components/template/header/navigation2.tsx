import {
  $,
  component$,
  noSerialize,
  type NoSerialize,
  useSignal,
  useStyles$,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik"
import { Link, useLocation } from "@builder.io/qwik-city"
import styles from "./navigation.scss?inline"
import { FeatureFlag, isFeatureEnabled } from "~/utils/feature-flags"
import { loadGsap } from "~/utils/gsapClient"
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

export default component$(() => {
  useStyles$(styles)

  const navItems = getFilteredNavItems()
  const location = useLocation()

  const isMenuOpen = useSignal(false)
  const isAnimating = useSignal(false)
  const currentPathname = useSignal("")

  const navRef = useSignal<HTMLElement>()
  const menuRef = useSignal<HTMLElement>()
  const menuBgPathRef = useSignal<SVGPathElement>()
  const toggleMenuRef = useSignal<HTMLElement>()
  const toggleCloseRef = useSignal<HTMLElement>()
  const menuLogoRef = useSignal<HTMLElement>()
  const menuInfoRef = useSignal<HTMLElement>()
  const menuLinksWrapRef = useSignal<HTMLElement>()

  const openTlRef = useSignal<NoSerialize<any>>()
  const closeTlRef = useSignal<NoSerialize<any>>()

  const openMenu$ = $(() => {
    if (isAnimating.value || isMenuOpen.value || !openTlRef.value) return
    isAnimating.value = true
    isMenuOpen.value = true
    openTlRef.value?.restart()
  })

  const closeMenu$ = $(() => {
    const closeTl = closeTlRef.value

    if (!isMenuOpen.value || !closeTl) return
    if (closeTl.isActive()) return

    openTlRef.value?.pause()
    isAnimating.value = true
    closeTl.restart()
  })

  const toggleMenu$ = $(() => {
    if (isMenuOpen.value) {
      closeMenu$()
      return
    }

    openMenu$()
  })

  useTask$(async ({ track }) => {
    const pathname = track(() => location.url.pathname)

    if (!currentPathname.value) {
      currentPathname.value = pathname
      return
    }

    if (pathname === currentPathname.value) return

    currentPathname.value = pathname
    await closeMenu$()
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const { gsap, SplitText } = await loadGsap({
      scrollTrigger: false,
      splitText: true,
    })

    const nav = navRef.value
    const menu = menuRef.value
    const menuBg = menuBgPathRef.value
    const toggleMenu = toggleMenuRef.value
    const toggleClose = toggleCloseRef.value
    const menuLogo = menuLogoRef.value
    const menuInfoItems = menuInfoRef.value?.querySelectorAll("p, h3, h6")
    const menuLinks = menuLinksWrapRef.value?.querySelectorAll("a")

    if (
      !nav ||
      !menu ||
      !menuBg ||
      !toggleMenu ||
      !toggleClose ||
      !menuLogo ||
      !menuInfoItems ||
      !menuLinks
    ) {
      return
    }

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

    gsap.set(menu, { autoAlpha: 1, pointerEvents: "none" })
    gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } })
    gsap.set(toggleMenu, { opacity: 1 })
    gsap.set(toggleClose, { opacity: 0 })
    gsap.set(menuLogo, { opacity: 0 })
    gsap.set(menuInfoItems, { opacity: 0, y: 100 })
    /////
    const splits: any[] = []
    const hoverCleanups: Array<() => void> = []

    menuLinks.forEach((link) => {
      const split = new SplitText(link as Element, {
        type: "chars",
        charsClass: "char",
      })

      splits.push(split)

      split.chars.forEach((charEl: HTMLElement, index: number) => {
        const text = charEl.textContent ?? ""

        charEl.innerHTML = `
      <span class="char__line"></span>
      <span class="char__glyph">${text === " " ? "&nbsp;" : text}</span>
    `

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
      })
    })

    /////
    // const splits: SplitText[] = []
    // menuLinks.forEach((link) => {
    //   const split = new SplitText(link as Element, {
    //     type: "chars",
    //     charsClass: "char",
    //   })
    //   splits.push(split)
    //   gsap.set(split.chars, { opacity: 0, x: "750%" })
    // })

    const menuLinksChars = splits.flatMap((split) => split.chars)

    const openTl = gsap.timeline({
      paused: true,
      onStart: () => {
        nav.classList.add("is-menu-open")
        menu.classList.add("is-open")
        gsap.set(menuLinks, { opacity: 1 })
        splits.forEach(split => {
          gsap.set(split.chars, { opacity: 0, x: "750%" })
        })
        gsap.set(menu, { pointerEvents: "auto" })
      },
      onComplete: () => {
        isAnimating.value = false
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
        0
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
        "-=0.75"
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
        "-=0.35"
      )
      .to(menuLinksChars, {
        duration: 0.65,
        opacity: 0,
      }, 0.45)

      .to(menuLinksChars, {
        duration: 1.5,
        opacity: 1,
        x: "0%",
        ease: "elastic.out(1, 0.25)",
        stagger: 0.01,
      }, ">") // start when previous ends

      .to(menuLinksChars, {
        duration: 0.75,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.01,
      }, "<0.2") // start 0.2s after previous starts

    const closeTl = gsap.timeline({
      paused: true,
      onStart: () => {
        gsap.set(menuBg, { attr: { d: CLOSE_START } })
      },
      onComplete: () => {
        nav.classList.remove("is-menu-open")
        menu.classList.remove("is-open")
        gsap.set(menu, { pointerEvents: "none" })
        gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } })
        gsap.set(menuLogo, { opacity: 0 })
        gsap.set(menuInfoItems, { opacity: 0, y: 100 })
        splits.forEach((split) => {
          gsap.set(split.chars, { opacity: 0, x: "750%" })
        })

        isMenuOpen.value = false
        isAnimating.value = false
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
        0
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
        "<"
      )
      .to(menuBg, {
        duration: 0.5,
        attr: { d: CLOSE_HIDDEN },
        ease: "power3.out",
      })

    openTlRef.value = noSerialize(openTl)
    closeTlRef.value = noSerialize(closeTl)

    cleanup(() => {
      openTl.kill()
      closeTl.kill()
      nav.classList.remove("is-menu-open")
      hoverCleanups.forEach((fn) => fn())
      splits.forEach((split) => split.revert())
    })
  })

  return (
    <nav ref={navRef} class="navigation" id="site-header" aria-label="Primary navigation">
      <div class="navigation__logo">
        <a href="">
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            class="size-full"
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
        </a>
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
          <span ref={toggleMenuRef} class="navigation__toggle-menu">
            Menu
          </span>
          <span ref={toggleCloseRef} class="navigation__toggle-close">
            Close
          </span>
        </button>
      </div>

      <div ref={menuRef} id="site-menu" class="menu" aria-hidden={!isMenuOpen.value}>
        <svg class="menu__bg-svg" viewBox="0 0 1131 861" preserveAspectRatio="none">
          <path ref={menuBgPathRef} fill="var(--surfaceAccent)" />
        </svg>

        <div ref={menuLogoRef} class="menu__logo">
          <Link href="/" onClick$={closeMenu$}>
            Logo
          </Link>
        </div>

        <div ref={menuInfoRef} class="menu__col menu__col-info">
          <p>Get in touch</p>
          <h3>m-morley@gmx.de</h3>
          <h3>+49 177 371 6791</h3>
          <h6>Loewenstrasse 1</h6>
          <h6>63067 Offenbach</h6>
        </div>

        <div ref={menuLinksWrapRef} class="menu__col menu__col-links">
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



// import {
//   Signal,
//   component$,
//   useStyles$,
//   useVisibleTask$,
//   useSignal,
//   $,
// } from "@builder.io/qwik"
// import { Link } from "@builder.io/qwik-city"
// import headerData from "./data"
// import styles from "./navigation.scss?inline"
// import { isFeatureEnabled, type FeatureFlag } from "~/utils/feature-flags"
// import gsap from "gsap"
// import SplitText from "gsap/dist/SplitText"

// type NavItem = {
//   name: string
//   link: string
//   flag?: string
// }

// const getNavItems = () =>
//   (Array.isArray(headerData.nav) ? headerData.nav : []) as NavItem[]

// const excludedNavLinks = new Set(["/datenschutz", "/impressum"])

// const isExcludedNavItem = (item: NavItem) =>
//   excludedNavLinks.has(item.link.toLowerCase())

// const getFilteredNavItems = () =>
//   getNavItems().filter(
//     (item) =>
//       !isExcludedNavItem(item) &&
//       (!item.flag || isFeatureEnabled(item.flag as FeatureFlag)),
//   )

// export const MobileMenu = component$<{
//   openSig: Signal<boolean>
//   navItems: ReadonlyArray<NavItem>
// }>(
//   ({ openSig, navItems }) => {
//     useStyles$(styles)
//     return (
//       <div
//         id="mobile-menu"
//         hidden={!openSig.value}
//         class="mt-4 w-full lg:hidden"
//       >
//         <div
//           class="flex flex-col gap-3 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-4 text-[var(--text2)] shadow-[0_20px_70px_var(--surface-shadow)] backdrop-blur-lg transition-colors duration-300"
//         >
//           {navItems.map((item) => (
//             <Link
//               key={item.link}
//               href={item.link}
//               class="flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-4 py-2 text-sm font-semibold text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-2)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
//             >
//               {item.name}
//             </Link>
//           ))}
//         </div>
//       </div>
//     )
//   },
// )

// export default component$(() => {
//   useStyles$(styles)



//   const navItems = getFilteredNavItems()
//   const isMenuOpen = useSignal(false);


//   const openMenu$ = $(() => {
//     isMenuOpen.value = true
//     console.log("Menu clicked")
//   })

//   const closeMenu = $(() => {
//     isMenuOpen.value = false
//     console.log("Close clicked")
//   });

//   useVisibleTask$(({ track }) => {
//     track(() => isMenuOpen.value);
//     gsap.registerPlugin(SplitText)

//     const menuBgSvg = document.querySelector(".menu__bg-svg") as SVGSVGElement
//     console.log("Menu background SVG element:", menuBgSvg)

//     const svgWidth = menuBgSvg.viewBox.baseVal.width
//     const svgHeight = menuBgSvg.viewBox.baseVal.height
//     const svgCenterX = svgWidth / 2

//     const OPEN_HIDDEN = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 Z`
//     const OPEN_BULGE = `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 Z`
//     const OPEN_FULL = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 Z`

//     const CLOSE_START = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} Z`
//     const CLOSE_BULGE = `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} Z`
//     const CLOSE_HIDDEN = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} Z`;

//     if (isMenuOpen.value) {
//       gsap.to(".menu", {
//         autoAlpha: 1,
//         y: 0,
//         duration: 0.6,
//       })

//       gsap.to("#menu-bg-path", {
//         attr: {
//           d: "m1131,0 q565.5,430.5 0,861 l0,0 L1131,861 Z",
//         },
//         duration: 0.8,
//       })
//     } else {
//       gsap.to(".menu", {
//         autoAlpha: 0,
//         y: -20,
//         duration: 0.4,
//       })

//       gsap.to("#menu-bg-path", {
//         attr: {
//           d: "m1131,0 q565.5,0 0,0 l0,0 L1131,0 Z",
//         },
//         duration: 0.6,
//       })
//     }
//   })


//   return (
//     <>
//       <nav class="navigation" id="site-header" aria-label="Primary navigation">

//         <div class="navigation__logo">
//           <a href="">
//             <svg
//               viewBox="0 0 1024 1024"
//               xmlns="http://www.w3.org/2000/svg"
//               class="size-full"
//               fill="none"
//             >
//               <rect x="92" y="92" width="280" height="280" fill="currentColor" />
//               <rect x="92" y="372" width="280" height="280" fill="currentColor" />
//               <rect x="92" y="652" width="280" height="280" fill="currentColor" />
//               <rect x="372" y="92" width="280" height="280" fill="currentColor" />
//               <rect x="372" y="372" width="280" height="280" fill="currentColor" />
//               <rect x="652" y="92" width="280" height="280" fill="currentColor" />
//               <rect x="652" y="372" width="280" height="280" fill="currentColor" />
//               <rect x="652" y="652" width="280" height="280" fill="currentColor" />
//             </svg>
//           </a>
//         </div>

//         <div class="navigation__toggle">
//           {!isMenuOpen.value && (
//             <p class="navigation__toggle-menu">
//               <button onClick$={openMenu$} aria-expanded={isMenuOpen.value} aria-controls="site-menu">
//                 Menu
//               </button>
//             </p>
//           )}
//           {isMenuOpen.value && (
//             <p class="navigation__toggle-close">
//               <button onClick$={closeMenu} aria-expanded={isMenuOpen.value} aria-controls="site-menu">
//                 Close
//               </button>
//             </p>
//           )}
//         </div>

//         <div class="menu">
//           <svg
//             class="menu__bg-svg"
//             viewBox="0 0 1131 861"
//             preserveAspectRatio="none"
//             xmlns:xlink="http://www.w3.org/2000/svg"
//           >
//             <path
//               id="menu-bg-path"
//               fill="#f0eeee"
//               d="m1131,0 q565.5,0 0,0 l0,0 L1131,0 Z"
//             />
//           </svg>

//           <div class="menu__logo">
//             <a href="">
//               <svg
//                 viewBox="0 0 1024 1024"
//                 xmlns="http://www.w3.org/2000/svg"
//                 class="size-full"
//                 fill="none"
//               >
//                 <rect x="92" y="92" width="280" height="280" fill="currentColor" />
//                 <rect x="92" y="372" width="280" height="280" fill="currentColor" />
//                 <rect x="92" y="652" width="280" height="280" fill="currentColor" />
//                 <rect x="372" y="92" width="280" height="280" fill="currentColor" />
//                 <rect x="372" y="372" width="280" height="280" fill="currentColor" />
//                 <rect x="652" y="92" width="280" height="280" fill="currentColor" />
//                 <rect x="652" y="372" width="280" height="280" fill="currentColor" />
//                 <rect x="652" y="652" width="280" height="280" fill="currentColor" />
//               </svg>
//             </a>
//           </div>

//           <div class="menu__col menu__col-info">
//             <p>Get in touch</p>
//             <h3>m-morley@gmx.de</h3>
//             <h3>+49 177 371 6791</h3>
//             <br />
//             <h6>Loewenstrasse 1</h6>
//             <h6>63067 Offenbach</h6>
//           </div>

//           <div class="menu__col menu__col-links">
//             {navItems.length > 0 && (
//               <>
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.link}
//                     href={item.link}
//                     class=""
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//               </>
//             )}
//           </div>
//         </div>
//       </nav>
//       <section class="hero-new">purple</section>
//       {/* <nav class="navClass" id="site-header" aria-label="Primary navigation">
//         <div class="navClass__container">
//           <div class="navClass__logo" aria-hidden="true">
//             <div class="navClass__logo-icon" aria-hidden="true">
//               <svg
//                 viewBox="0 0 1024 1024"
//                 xmlns="http://www.w3.org/2000/svg"
//                 class="size-full"
//                 fill="none"
//               >
//                 <rect x="92" y="92" width="280" height="280" fill="currentColor" />
//                 <rect x="92" y="372" width="280" height="280" fill="currentColor" />
//                 <rect x="92" y="652" width="280" height="280" fill="currentColor" />
//                 <rect x="372" y="92" width="280" height="280" fill="currentColor" />
//                 <rect x="372" y="372" width="280" height="280" fill="currentColor" />
//                 <rect x="652" y="92" width="280" height="280" fill="currentColor" />
//                 <rect x="652" y="372" width="280" height="280" fill="currentColor" />
//                 <rect x="652" y="652" width="280" height="280" fill="currentColor" />
//               </svg>
//             </div>
//             <div class="navClass__logo-text">
//               {headerData.logo_text && (
//                 <p class="">
//                   {headerData.logo_text}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div class="navClass__menu">
//             {navItems.length > 0 && (
//               <div class="">
//                 <ul class="">
//                   {navItems.map((item) => (
//                     <li key={item.link}>
//                       <Link
//                         href={item.link}
//                         class=""
//                       >
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav> */}
//     </>
//   )
// })
