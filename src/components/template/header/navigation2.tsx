import {
  Signal,
  component$,
  useSignal,
  useStylesScoped$,
} from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
import headerData from "./data"
import styles from "./navigation.css?inline"
import { isFeatureEnabled, type FeatureFlag } from "~/utils/feature-flags"
import PrefferencesToggle from "./prefferences-toggle"


export const MobileMenu = component$<{ openSig: Signal<boolean> }>(({ openSig }) => {
  useStylesScoped$(styles)
  return (
    <div id="mobile-menu" hidden={!openSig.value} class="flex lg:hidden">
      <div class="flex flex-col w-full">
        {(
          headerData.nav as
          | { name: string; link: string; flag?: string }[]
          | undefined
        )
          ?.filter(
            (item) =>
              !item.flag || isFeatureEnabled(item.flag as FeatureFlag),
          )
          .map((item) => (
            <div key={item.link} class="mx-auto flex max-w-xs flex-col space-y-4 font-mono text-sm leading-6 font-bold text-white bg-amber-800">
              <Link href={item.link} class="flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                {item.name}
              </Link>
            </div>
          ))}
      </div>
    </div>
  )
})


export default component$(() => {
  useStylesScoped$(styles)
  const menuOpen = useSignal(false)
  const isOpen = useSignal(false)
  return (
    <nav class="bg-gray-800/50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="shrink-0 flex" >
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" class="size-10  self-center" width={32} height={32} />
              {headerData.logo_text && <p class="text-xl font-bold self-center p-4">{headerData.logo_text}</p>}
            </div>
            <div class="hidden lg:block">
              <ul class="ml-10 flex items-baseline space-x-4">
                {(
                  headerData.nav as
                  | { name: string; link: string; flag?: string }[]
                  | undefined
                )
                  ?.filter(
                    (item) =>
                      !item.flag || isFeatureEnabled(item.flag as FeatureFlag),
                  )
                  .map((item) => (
                    <li key={item.link}>
                      <Link href={item.link} class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div class="hidden lg:block">
            <div class="flex md:ml-6">
              <button type="button" class="ml-4 flex items-center relative mr-4 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 justify-center">
                {/* <span class="absolute -inset-2.5"></span> */}
                <span class="sr-only">View notifications</span>
                <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 26" class="size-6" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a7 7 0 0 0-7 7v6c0 .6-.2 1.2-.6 1.6L3 19h18l-1.4-2.4c-.4-.4-.6-1-.6-1.6V9a7 7 0 0 0-7-7z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19a3 3 0 0 0 6 0" />
                </svg>
              </button>
              <button onClick$={() => (isOpen.value = !isOpen.value)} type="button" class="relative rounded-full p-1 mr-4 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                {/* <span class="absolute -inset-1.5"></span> */}
                <span class="sr-only">Open settings</span>
                <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" class="size-6" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09c0-.66-.39-1.26-1-1.51a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06c.45-.45.58-1.14.33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.66 0 1.26-.39 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.45.45 1.14.58 1.82.33.61-.25 1-.85 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51.68.25 1.37.12 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.45.45-.58 1.14-.33 1.82.25.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1z" />
                </svg>
              </button>
              <el-dropdown class="relative ml-3">
                <button class="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                  {/* <span class="absolute -inset-1.5"></span> */}
                  <span class="sr-only">Open user menu</span>
                  <svg width="32" height="32" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="32" cy="24" r="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 48A16 12 0 0 1 48 48" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </button>

                <el-menu anchor="bottom end" popover="auto" class="w-48 origin-top-right rounded-md bg-gray-800 py-1 outline-1 -outline-offset-1 outline-white/10 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden">Your profile</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden">Settings</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden">Sign out</a>
                </el-menu>
              </el-dropdown>
            </div>
          </div>
          {/* <div class="-mr-2 flex md:hidden">
            <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 in-aria-expanded:hidden">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 not-in-aria-expanded:hidden">
                <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div> */}
          <div class="-mr-2 flex lg:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen.value ? 'true' : 'false'}
              onClick$={() => (menuOpen.value = !menuOpen.value)}
            >
              <span class="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!menuOpen.value ? (
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={1.5} aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                // X icon
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={1.5} aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* <el-disclosure id="mobile-menu" hidden class="block md:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <a href="#" aria-current="page" class="block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white">Dashboard</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Team</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Projects</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Calendar</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">Reports</a>
        </div>
        <div class="border-t border-white/10 pt-4 pb-3">
          <div class="flex items-center px-5">
            <div class="shrink-0">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-10 rounded-full outline -outline-offset-1 outline-white/10" width={256} height={256} />
            </div>
            <div class="ml-3">
              <div class="text-base/5 font-medium text-white">Tom Cook</div>
              <div class="text-sm font-medium text-gray-400">tom@example.com</div>
            </div>
            <button type="button" class="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
                <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white">Your profile</a>
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white">Settings</a>
            <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white">Sign out</a>
          </div>
        </div>
      </el-disclosure> */}

      {/* Mobile panel */}
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MobileMenu
          openSig={menuOpen}
        />
      </div>
      {!isOpen.value ? (
        <></>
      ) : (
        <>

            <div class="">
              <aside class="fixed top-0 right-0 w-2xl bg-amber-300 z-40" role="dialog" aria-label="UI settings">
                <button
                  type="button"
                  class="close-btn"
                  aria-label="Close settings"
                  onClick$={() => (isOpen.value = !isOpen.value)}
                >
                  <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={1.5} aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <PrefferencesToggle />
              </aside>
          </div>
        </>
      )}
    </nav>
  )
})
