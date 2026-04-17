import {
  $,
  Signal,
  component$,
  useSignal,
  useOnWindow,
  useStyles$,
  useVisibleTask$
} from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
import headerData from "./data"
import styles from "./navigation.scss?inline"
import { isFeatureEnabled, type FeatureFlag } from "~/utils/feature-flags"
import PrefferencesToggle from "./prefferences-toggle"
import NotificationsPanel, { defaultNotifications } from "./notifications-panel"
import AccountPanel from "./account-panel"
import { useNotificationBadge } from "./use-notification-badge"

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

const OVERLAY_BUTTON_BASE_CLASS =
  "group relative flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"

const ACCOUNT_BUTTON_BASE_CLASS =
  "group relative flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"

const ACTIVE_BUTTON_CLASS =
  "border-[var(--primary)] text-[var(--primary)] hover:text-[var(--primary)]"

const composeButtonClass = (baseClass: string, isActive: boolean) =>
  [baseClass, isActive ? ACTIVE_BUTTON_CLASS : ""].filter(Boolean).join(" ")

export const MobileMenu = component$<{
  openSig: Signal<boolean>
  navItems: ReadonlyArray<NavItem>
}>(
  ({ openSig, navItems }) => {
    useStyles$(styles)
    return (
      <div
        id="mobile-menu"
        hidden={!openSig.value}
        class="mt-4 w-full lg:hidden"
      >
        <div
          class="flex flex-col gap-3 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-4 text-[var(--text2)] shadow-[0_20px_70px_var(--surface-shadow)] backdrop-blur-lg transition-colors duration-300"
        >
          {navItems.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              class="flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-4 py-2 text-sm font-semibold text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-2)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    )
  },
)

export default component$(() => {
  useStyles$(styles)
  const menuOpen = useSignal(false)
  const preferencesOpen = useSignal(false)
  const notificationsOpen = useSignal(false)
  const accountOpen = useSignal(false)

  const unreadCount = useNotificationBadge(defaultNotifications)
  const navItems = getFilteredNavItems()

  useOnWindow(
    "keydown",
    $((event: KeyboardEvent) => {
      if (event.key === "F10") {
        event.preventDefault()
        const next = !preferencesOpen.value
        preferencesOpen.value = next
        menuOpen.value = false
        if (next) {
          notificationsOpen.value = false
          accountOpen.value = false
        }
      }
    }),
  )

  const toggleNotifications$ = $(() => {
    const next = !notificationsOpen.value
    notificationsOpen.value = next
    menuOpen.value = false
    if (next) {
      preferencesOpen.value = false
      accountOpen.value = false
    }
  })

  const togglePreferences$ = $(() => {
    menuOpen.value = false
    const next = !preferencesOpen.value
    preferencesOpen.value = next
    if (next) {
      notificationsOpen.value = false
      accountOpen.value = false
    }
  })

  const toggleAccount$ = $(() => {
    const next = !accountOpen.value
    accountOpen.value = next
    menuOpen.value = false
    if (next) {
      notificationsOpen.value = false
      preferencesOpen.value = false
    }
  })

  const toggleMenu$ = $(() => {
    const next = !menuOpen.value
    menuOpen.value = next
    if (next) {
      notificationsOpen.value = false
      preferencesOpen.value = false
      accountOpen.value = false
    }
  })

  const closeNotifications$ = $(() => {
    notificationsOpen.value = false
  })
  const closePreferences$ = $(() => {
    preferencesOpen.value = false
  })
  const closeAccount$ = $(() => {
    accountOpen.value = false
  })
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    let observer: IntersectionObserver | undefined
    let frame = 0

    const connect = () => {
      const footer = document.getElementById("site-footer")
      if (!footer) {
        frame = requestAnimationFrame(connect)
        return
      }

      observer = new IntersectionObserver(([entry]) => {
        document.documentElement.toggleAttribute(
          "data-footer-visible",
          entry.isIntersecting
        )
        // alert("footer visibility changed: " + entry.isIntersecting)
      })

      observer.observe(footer)
    }

    connect()

    cleanup(() => {
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
    })
  })
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    let observer: IntersectionObserver | undefined
    let frame = 0

    const connect = () => {
      const header = document.getElementById("site-header")
      if (!header) {
        frame = requestAnimationFrame(connect)
        return
      }

      observer = new IntersectionObserver(([entry]) => {
        document.documentElement.toggleAttribute(
          "data-header-visible",
          entry.isIntersecting
        )
        // alert("header visibility changed: " + entry.isIntersecting)
      })

      observer.observe(header)
    }

    connect()

    cleanup(() => {
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
    })
  })


  return (
    <nav class="navClass" id="site-header" aria-label="Primary navigation">
      <div class="navClass__container">
        <div class="navClass__logo" aria-hidden="true">
          <div class="navClass__logo-icon" aria-hidden="true">
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              class="size-full"
              fill="none"
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
          </div>
          <div class="navClass__logo-text">
            {headerData.logo_text && (
              <p class="">
                {headerData.logo_text}
              </p>
            )}
          </div>

        </div>
        <div class="navClass__menu">
          {navItems.length > 0 && (
            <div class="">
              <ul class="">
                {navItems.map((item) => (
                  <li key={item.link}>
                    <Link
                      href={item.link}
                      class=""
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
})
