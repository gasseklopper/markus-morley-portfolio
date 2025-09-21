import { component$, type QwikIntrinsicElements } from "@builder.io/qwik";

type SectionProps = QwikIntrinsicElements["section"];

export interface ExpertiseItem {
  title: string;
  description: string;
}

export interface AboutExpertiseProps extends SectionProps {
  heading?: string;
  kicker?: string;
  description?: string;
  items: ExpertiseItem[];
}

export const AboutExpertise = component$<AboutExpertiseProps>(
  ({
    heading = "What I Do",
    kicker = "Capabilities",
    description =
      "Bridging brutalist aesthetics with engineered precision across every engagement.",
    items,
    ...sectionProps
  }) => {
    const { class: className, ...restSectionProps } = sectionProps;

    return (
      <section
        {...restSectionProps}
        class={["w-full", className].filter(Boolean).join(" ")}
      >
        <div class="mx-auto w-full max-w-6xl">
          <div class="relative overflow-hidden rounded-[2.5rem] border border-[var(--surface-border)] bg-[radial-gradient(circle_at_top_left,var(--surface-glass-1)_0%,var(--surface1)_65%)] shadow-[0_30px_80px_-40px_var(--surface-shadow)]">
            <div
              class="pointer-events-none absolute inset-x-12 -top-40 h-80 rounded-full bg-[radial-gradient(circle,var(--primary)_0%,transparent_65%)] opacity-20 blur-3xl"
              aria-hidden="true"
            />
            <div class="relative grid gap-12 p-10 sm:p-12 lg:grid-cols-[320px_1fr] lg:gap-16 lg:p-16">
              <div class="max-w-md space-y-6">
                <span class="inline-flex items-center rounded-full border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface-glass-2)_65%,transparent)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text3)]">
                  {kicker}
                </span>
                <div>
                  <h2 class="text-3xl font-semibold text-[var(--text1)] sm:text-4xl">
                    {heading}
                  </h2>
                  <p class="mt-4 text-base leading-relaxed text-[var(--text2)]">
                    {description}
                  </p>
                </div>
                <p class="text-sm uppercase tracking-[0.35em] text-[color-mix(in_srgb,var(--text3)_80%,transparent)]">
                  Hybrid designer & technologist
                </p>
              </div>
              <div class="grid gap-6 sm:grid-cols-2">
                {items.map((item, index) => (
                  <article
                    key={item.title}
                    class="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface-glass-1)_82%,transparent)] p-6 text-[var(--text2)] shadow-[0_18px_40px_-28px_var(--surface-shadow)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_35%,var(--surface-border))] hover:bg-[color-mix(in_srgb,var(--surface-glass-2)_88%,transparent)] hover:text-[var(--text1)]"
                  >
                    <div class="flex items-baseline justify-between gap-4">
                      <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface-glass-2)_80%,transparent)] text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)] transition-colors duration-300 group-hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--surface-border))] group-hover:text-[var(--brand-inverted)] group-hover:bg-[color-mix(in_srgb,var(--primary)_30%,var(--surface-glass-2))]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span class="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--text3)]">
                        Focus Area
                      </span>
                    </div>
                    <div class="mt-6 space-y-3 text-left">
                      <h3 class="text-xl font-semibold text-[var(--text1)]">
                        {item.title}
                      </h3>
                      <p class="text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div class="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--text3)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--primary)]">
                      <span>Explore</span>
                      <span aria-hidden="true" class="text-base">
                        →
                      </span>
                    </div>
                    <div
                      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                      style={{
                        background:
                          "radial-gradient(circle at top,var(--primary) 0%,transparent 55%)",
                      }}
                      aria-hidden="true"
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
