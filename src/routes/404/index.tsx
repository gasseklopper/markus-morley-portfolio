import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  const refinedTitle = siteConfig.page_404.title
    .replace(/^404\s*-\s*/i, "")
    .trim();

  return (
    <div class="page text-[var(--text1)]">
      <section class="layout-shell relative mt-10 flex min-h-[70vh] flex-col justify-center overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--surface2)_92%,transparent)_0%,_var(--surface1)_68%)] px-6 py-16 shadow-[0_32px_120px_var(--surface-shadow)] transition-colors duration-300 md:mt-16 md:px-12">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -left-32 -top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,_color-mix(in_srgb,var(--primary)_45%,transparent)_0%,_transparent_70%)] opacity-70 blur-3xl md:-left-40 md:-top-36 md:h-80 md:w-80"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_color-mix(in_srgb,var(--tertiary)_38%,transparent)_0%,_transparent_70%)] opacity-40 blur-3xl md:-right-32 md:h-96 md:w-96"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute left-[-40%] top-1/2 h-px w-[160%] -translate-y-1/2 rotate-[18deg] bg-[color-mix(in_srgb,var(--surface5)_45%,transparent)] opacity-60"
        />

        <div class="relative grid gap-12 lg:grid-cols-[320px_1fr]">
          <div class="flex flex-col gap-8">
            <span class="inline-flex items-center justify-center self-start rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.38em] text-[var(--text3)] shadow-[0_12px_36px_var(--surface-shadow)] transition-colors duration-300">
              404
            </span>
            <h1 class="text-4xl font-semibold leading-tight md:text-5xl">
              We couldn’t find that page
            </h1>
            <p class="max-w-xl text-base text-[var(--text2)] md:text-lg">
              {siteConfig.page_404.description}
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <Link
                href={siteConfig.page_404.link.url}
                class="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--brand-inverted)] shadow-[0_18px_50px_var(--brand-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,_var(--primary)_85%,_var(--brand-core)_15%)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
              >
                {siteConfig.page_404.link.text}
              </Link>
              <Link
                href="/portfolio"
                class="inline-flex items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-2)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
              >
                View portfolio
              </Link>
            </div>
          </div>

          <div class="relative">
            <div class="group relative overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-glass-1)] shadow-[0_24px_80px_var(--surface-shadow)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_32px_120px_var(--surface-shadow)]">
              <div
                aria-hidden="true"
                class="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,color-mix(in_srgb,var(--primary)_32%,var(--surface1)_68%)_0%,color-mix(in_srgb,var(--tertiary)_30%,var(--surface1)_70%)_40%,color-mix(in_srgb,var(--surface1)_85%,transparent)_100%)] transition-transform duration-500 group-hover:scale-105"
              />
              <div class="relative flex min-h-[260px] flex-col justify-end gap-10 rounded-[2.5rem] p-10 text-[var(--text1)] transition-colors duration-300 md:min-h-[320px] md:p-14">
                <div class="flex flex-col gap-3 text-right md:text-left">
                  <span class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text3)]">
                    Status
                  </span>
                  <p class="text-3xl font-semibold uppercase tracking-tight md:text-4xl">
                    {refinedTitle}
                  </p>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--text3)]">
                  <span>Error code 404</span>
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(
  siteConfig.page_404.title,
  siteConfig.page_404.description,
);
