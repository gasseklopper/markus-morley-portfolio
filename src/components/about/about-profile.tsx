import { component$, useStylesScoped$ } from "@builder.io/qwik";
import ImgHeroPortrait from "~/media/assets/images/heros/image.png?jsx";
import styles from "./about-profile.css?inline";

type BiographyItem = {
  label: string;
  value: string;
};

type Service = {
  title: string;
  description: string;
};

type SocialLink = {
  name: string;
  href: string;
  abbr: string;
};

const biographyItems: BiographyItem[] = [
  { label: "Name", value: "Markus Morley" },
  { label: "Role", value: "Senior Frontend Engineer" },
  { label: "Location", value: "Frankfurt am Main, Germany" },
  { label: "Email", value: "hello@markusmorley.de" },
  { label: "Experience", value: "10+ years" },
  { label: "Freelance", value: "Available" },
  { label: "Website", value: "markusmorley.de" },
  { label: "Languages", value: "German, English" },
];

const services: Service[] = [
  {
    title: "Product Design & Prototyping",
    description:
      "Figma, design systems, rapid iteration. Crafting user-centric designs and interactive prototypes that align with business goals and user needs.",
  },
  {
    title: "Frontend Engineering",
    description:
      "React, Next.js, TypeScript, GraphQL. Crafting performant, accessible, and scalable web applications with modern frameworks and best practices.",
  },
  {
    title: "Scalable Design Systems",
    description:
      "Building and maintaining component libraries for enterprise teams. Scaling design language and component libraries that empower teams with accessible tokens, documentation, and governance.",
  },
];

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/markus-morley/",
    abbr: "Li",
  },
  {
    name: "GitHub",
    href: "https://github.com/gasseklopper",
    abbr: "Gh",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/yelrom_/",
    abbr: "In",
  },
];

export const AboutProfile = component$(() => {
  useStylesScoped$(styles);
  return (
    <section class="about-profile layout-shell relative mt-16 w-full overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-[radial-gradient(circle_at_top,_var(--surface2)_0%,_var(--surface1)_70%)] px-6 py-12 text-[var(--text1)] shadow-[0_32px_120px_var(--surface-shadow)] transition-colors duration-300 md:px-12">
      <div class="about-profile__layout flex flex-col gap-12">
        <div class="relative flex flex-col items-center gap-6 rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-8 py-10 text-center shadow-[0_20px_60px_var(--surface-shadow)] backdrop-blur-md transition-colors duration-300">
          <div class="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[var(--primary)] bg-[var(--surface1)] shadow-[0_15px_45px_var(--surface-shadow)]">
            <ImgHeroPortrait
              alt="Portrait of Markus Morley"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-[var(--text1)]">Markus Morley</h2>
            <p class="mt-1 text-sm font-medium uppercase tracking-[0.4em] text-[var(--text3)]">
              Senior Frontend Engineer
            </p>
          </div>
          <a
            class="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--brand-inverted)] shadow-[0_18px_45px_var(--brand-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,_var(--primary)_85%,_var(--brand-core)_15%)] hover:shadow-[0_22px_60px_var(--brand-glow)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
            href="#download-cv"
          >
            Download CV
          </a>
          <div class="flex flex-col items-center gap-3 text-sm text-[var(--text3)]">
            <span class="font-semibold uppercase tracking-[0.3em] text-[var(--text3)]">
              Follow me
            </span>
            <div class="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Follow Markus on ${social.name}`}
                  class="grid h-10 w-10 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-2)] text-[var(--text2)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,_var(--surface1)_35%,_transparent)] transition-all duration-300 hover:scale-105 hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                >
                  <span class="text-xs font-semibold uppercase tracking-widest">
                    {social.abbr}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div class="about-profile__details flex flex-col gap-12">
          <article class="about-profile__biography rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-8 text-[var(--text2)] shadow-[0_20px_70px_var(--surface-shadow)] transition-colors duration-300">
            <header class="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--primary)]">
                  Markus Morley
                </p>
                <h3 class="text-3xl font-semibold text-[var(--text1)]">Senior Frontend Engineer & Product Designer</h3>
              </div>
            </header>

            <dl class="about-profile__facts mt-8 gap-4">
              {biographyItems.map((item) => (
                <div
                  key={item.label}
                  class="flex flex-col gap-1 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-4 transition-colors duration-300"
                >
                  <dt class="text-xs font-semibold uppercase tracking-wide text-[var(--text3)]">
                    {item.label}
                  </dt>
                  <dd class="text-base font-semibold text-[var(--text1)]">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p class="max-w-3xl text-base leading-relaxed text-[var(--text2)]">
              Bridging design and engineering to craft scalable, performant, and user-focused digital experiences.
            </p>
          </article>

          <article class="about-profile__services rounded-[2.5rem] border border-[var(--surface-border)] bg-[var(--surface-glass-2)] p-8 text-[var(--text2)] shadow-[0_20px_70px_var(--surface-shadow)] transition-colors duration-300">
            <header class="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--primary)]">
                  My Services
                </p>
                <h3 class="text-3xl font-semibold text-[var(--text1)]">My Services</h3>
              </div>
            </header>
            <div class="about-profile__services-grid gap-6">
              {services.map((service) => (
                <div
                  key={service.title}
                  class="group relative flex h-full flex-col gap-4 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-6 text-[var(--text2)] shadow-[0_16px_60px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_24px_80px_var(--surface-shadow)]"
                >
                  <span class="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] text-2xl font-semibold text-[var(--primary)] shadow-[0_8px_24px_var(--surface-shadow)] transition-colors duration-300">
                    {service.title[0]}
                  </span>
                  <h4 class="text-xl font-semibold text-[var(--text1)]">{service.title}</h4>
                  <p class="leading-relaxed text-[var(--text2)]">{service.description}</p>
                  <span class="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)] transition-colors duration-300 group-hover:text-[var(--brand-core)]">
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.22 14.78a.75.75 0 0 1 0-1.06L10.94 8l-5.72-5.72a.75.75 0 1 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
});

export default AboutProfile;
