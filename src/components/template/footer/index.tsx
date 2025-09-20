import { component$, useStore, $, useOnWindow } from "@builder.io/qwik";
import footerData from "./data";

export const Footer = component$(() => {
  const state = useStore({ showScroll: false });

  useOnWindow(
    "scroll",
    $(() => {
      state.showScroll = window.scrollY > 100;
    }),
  );

  return (
    <footer class="layout-shell relative w-full overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[radial-gradient(circle_at_bottom,_var(--surface2)_0%,_var(--surface1)_80%)] px-6 py-12 text-[var(--text2)] shadow-[0_32px_120px_var(--surface-shadow)] transition-colors duration-300 md:px-12">
      <div class="flex flex-col gap-12 md:flex-row md:justify-between">
        <div class="flex max-w-sm flex-col gap-5">
          <a
            href="/"
            class="group inline-flex items-center gap-3 text-[var(--text1)] transition-colors duration-300"
            aria-label="Home"
          >
            {footerData.brand?.logo && (
              <img
                src={footerData.brand.logo}
                alt=""
                width="32"
                height="32"
                class="size-12 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-2 shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 group-hover:border-[var(--primary)] group-hover:shadow-[0_18px_45px_var(--surface-shadow)]"
              />
            )}
            <span class="text-lg font-semibold tracking-tight">
              {footerData.brand?.text}
            </span>
          </a>
          {footerData.promo && (
            <p class="text-sm leading-relaxed">
              <a
                href={footerData.promo.link}
                class="text-[var(--primary)] underline decoration-[var(--primary)]/60 underline-offset-4 transition-colors duration-300 hover:text-[color-mix(in_srgb,_var(--primary)_85%,_var(--brand-core)_15%)]"
              >
                {footerData.promo.bodytext}
              </a>
            </p>
          )}
        </div>
        <nav
          aria-label="Footer"
          class="grid flex-1 gap-8 text-sm sm:grid-cols-2 md:max-w-xl"
        >
          <ul class="space-y-3">
            {footerData.nav?.column1?.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  class="inline-flex items-center text-[var(--text2)] transition-colors duration-300 hover:text-[var(--primary)] hover:underline hover:decoration-[var(--primary)]/60"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <ul class="space-y-3">
            {footerData.nav?.column2?.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  class="inline-flex items-center text-[var(--text2)] transition-colors duration-300 hover:text-[var(--primary)] hover:underline hover:decoration-[var(--primary)]/60"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div class="flex flex-col gap-6">
          {footerData.subscription?.enable && (
            <form
              class="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-1 shadow-[0_12px_36px_var(--surface-shadow)] transition-colors duration-300 focus-within:border-[var(--primary)] focus-within:shadow-[0_18px_45px_var(--surface-shadow)]"
              aria-label="Email subscription"
            >
              <label for="footer-email" class="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder={footerData.subscription.input_placeholder}
                class="w-full flex-1 rounded-full bg-transparent px-4 py-2 text-sm text-[var(--text1)] placeholder:text-[var(--text3)] focus:outline-none"
              />
              <button
                type="submit"
                class="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--brand-inverted)] shadow-[0_18px_50px_var(--brand-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,_var(--primary)_85%,_var(--brand-core)_15%)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
              >
                {footerData.subscription.button_label}
              </button>
            </form>
          )}
          <ul class="flex items-center gap-3" aria-label="Social media">
            {footerData.social?.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  aria-label={item.name}
                  class="grid size-10 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-2)] text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                >
                  {item.abbr}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {state.showScroll && (
        <button
          aria-label="Scroll to top"
          onClick$={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          class="fixed right-4 bottom-4 rounded-full border border-[var(--surface-border)] bg-[var(--primary)] p-3 text-[var(--brand-inverted)] shadow-[0_24px_60px_var(--brand-glow)] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </footer>
  );
});

export default Footer;
