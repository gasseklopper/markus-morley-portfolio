import {
  $,
  Signal,
  component$,
  useSignal,
  useStylesScoped$,
  useOnWindow,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import headerData from "./data";
import styles from "./navigation.css?inline";
import { isFeatureEnabled, type FeatureFlag } from "~/utils/feature-flags";
import PrefferencesToggle from "./prefferences-toggle";

type NavItem = {
  name: string;
  link: string;
  flag?: string;
};

const getNavItems = () =>
  (Array.isArray(headerData.nav) ? headerData.nav : []) as NavItem[];

const getFilteredNavItems = () =>
  getNavItems().filter(
    (item) => !item.flag || isFeatureEnabled(item.flag as FeatureFlag),
  );

export const MobileMenu = component$<{ openSig: Signal<boolean> }>(
  ({ openSig }) => {
    useStylesScoped$(styles);
    const navItems = getFilteredNavItems();
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
    );
  },
);

export default component$(() => {
  useStylesScoped$(styles);
  const menuOpen = useSignal(false);
  const isOpen = useSignal(false);
  const navItems = getFilteredNavItems();
  useOnWindow(
    "keydown",
    $((event: KeyboardEvent) => {
      if (event.key === "F10") {
        event.preventDefault();
        isOpen.value = !isOpen.value;
      }
    }),
  );
  return (
    <nav
      class={[
        "layout-shell relative z-[2000] flex w-full flex-col rounded-[2.5rem] border border-[var(--surface-border)] bg-[radial-gradient(circle_at_top,_var(--surface2)_0%,_var(--surface1)_80%)] text-[var(--text1)] shadow-[0_24px_90px_var(--surface-shadow)] backdrop-blur-xl transition-colors duration-300",
        isOpen.value ? "overflow-visible" : "overflow-hidden",
      ].join(" ")}
    >
      <div class="px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex min-h-[4.5rem] items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="flex shrink-0 items-center gap-3">
              <div
                class="flex size-12 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-2 text-[var(--primary)] shadow-[0_12px_36px_var(--surface-shadow)] transition-colors duration-300"
                aria-hidden="true"
              >
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
              {headerData.logo_text && (
                <p class="text-xl font-semibold text-[var(--text1)]">
                  {headerData.logo_text}
                </p>
              )}
            </div>
            {navItems.length > 0 && (
              <div class="hidden lg:block">
                <ul class="ml-10 flex items-center gap-3">
                  {navItems.map((item) => (
                    <li key={item.link}>
                      <Link
                        href={item.link}
                        class="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[var(--text2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-1)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div class="hidden lg:flex items-center gap-4">
            <button
              type="button"
              class="group relative flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
            >
              {/* <span class="absolute -inset-2.5"></span> */}
              <span class="sr-only">View notifications</span>
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="1.5"
                viewBox="0 0 24 26"
                class="size-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 2a7 7 0 0 0-7 7v6c0 .6-.2 1.2-.6 1.6L3 19h18l-1.4-2.4c-.4-.4-.6-1-.6-1.6V9a7 7 0 0 0-7-7z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 19a3 3 0 0 0 6 0"
                />
              </svg>
              <span class="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--primary)] text-xs font-semibold text-[var(--brand-inverted)] shadow-[0_12px_30px_var(--brand-glow)]">
                3
              </span>
            </button>
            <button
              data-preferences-toggle
              onClick$={() => (isOpen.value = !isOpen.value)}
              type="button"
              class="group relative flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
            >
              {/* <span class="absolute -inset-1.5"></span> */}
              <span class="sr-only">Open settings</span>
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                class="size-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09c0-.66-.39-1.26-1-1.51a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06c.45-.45.58-1.14.33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.66 0 1.26-.39 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.45.45 1.14.58 1.82.33.61-.25 1-.85 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51.68.25 1.37.12 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.45.45-.58 1.14-.33 1.82.25.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1z" />
              </svg>
            </button>
            <el-dropdown class="relative">
              <button
                class="group relative flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                {/* <span class="absolute -inset-1.5"></span> */}
                <span class="sr-only">Open user menu</span>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="32"
                    cy="24"
                    r="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 48A16 12 0 0 1 48 48"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <el-menu
                anchor="bottom end"
                popover="auto"
                class="w-52 origin-top-right rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-2 text-[var(--text2)] shadow-[0_20px_60px_var(--surface-shadow)] transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-150 data-[enter]:ease-out data-[leave]:duration-100 data-[leave]:ease-in backdrop-blur-lg"
              >
                <a
                  href="#"
                  class="block rounded-xl px-4 py-2 text-sm font-medium text-[var(--text2)] transition-colors duration-200 hover:bg-[var(--surface-glass-1)] hover:text-[var(--text1)] focus:bg-[var(--surface-glass-1)] focus:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                >
                  Your profile
                </a>
                <a
                  href="#"
                  class="block rounded-xl px-4 py-2 text-sm font-medium text-[var(--text2)] transition-colors duration-200 hover:bg-[var(--surface-glass-1)] hover:text-[var(--text1)] focus:bg-[var(--surface-glass-1)] focus:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                >
                  Settings
                </a>
                <a
                  href="#"
                  class="block rounded-xl px-4 py-2 text-sm font-medium text-[var(--text2)] transition-colors duration-200 hover:bg-[var(--surface-glass-1)] hover:text-[var(--text1)] focus:bg-[var(--surface-glass-1)] focus:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                >
                  Sign out
                </a>
              </el-menu>
            </el-dropdown>
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
          <div class="flex lg:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-2 text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen.value ? "true" : "false"}
              onClick$={() => (menuOpen.value = !menuOpen.value)}
            >
              <span class="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!menuOpen.value ? (
                <svg
                  class="size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width={1.5}
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                // X icon
                <svg
                  class="size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width={1.5}
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div class="px-4 pb-4 sm:px-6 lg:px-8">
        <MobileMenu openSig={menuOpen} />
      </div>
      {isOpen.value && (
        <PrefferencesToggle onClose$={$(() => (isOpen.value = false))} />
      )}
    </nav>
  );
});
