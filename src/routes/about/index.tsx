import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./about.scss?inline";
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head";
import { AboutProfile } from "~/components/about/about-profile";
import {
  AboutExpertise,
  type ExpertiseItem,
} from "~/components/about/about-expertise";

/* eslint-disable qwik/jsx-img */

const expertiseItems: ExpertiseItem[] = [
  {
    title: "Design",
    description:
      "I shape clear, expressive interfaces that balance brand character with usability, accessibility, and measurable product goals.",
  },
  {
    title: "Prototyping",
    description:
      "I turn early ideas into interactive prototypes that make decisions tangible, speed up feedback, and reduce delivery risk.",
  },
  {
    title: "Large-Scale Digital Projects",
    description:
      "I help teams move from concept to production with resilient systems, thoughtful collaboration, and a strong eye for quality.",
  },
  {
    title: "Development",
    description:
      "I build modular frontend experiences with modern frameworks, type-safe tooling, and component patterns that scale.",
  },
  {
    title: "Product Thinking",
    description:
      "I connect design, engineering, and stakeholder needs so the finished product feels useful, coherent, and ready to evolve.",
  },
  {
    title: "Collaboration",
    description:
      "I enjoy working with teams that value craft, momentum, and honest iteration from discovery through launch.",
  },
];

const rawToolStack = [
  "Adobe CC",
  "Adobe Experience Manager",
  "Airbnb CSS / Sass Styleguide",
  "Airbnb's ESLint config",
  "Anime.js",
  "Atom",
  "Atomic Design",
  "Babel",
  "BasicLightbox",
  "basicGrid",
  "BEM",
  "Brackets",
  "Browserify",
  "BrowserStack",
  "Browsersync",
  "caniuse.com",
  "Chrome Developer Tools",
  "CodePen",
  "Color Profiles",
  "CSS Tricks Almanac",
  "CSS3",
  "ECMA",
  "Edge",
  "Emmet",
  "eslint",
  "Firefox",
  "Flaticon",
  "Foundation",
  "GitHub",
  "GitHub Desktop",
  "Google Chrome",
  "Google Fonts",
  "GreenSock-JS",
  "Gulp",
  "Handlebars",
  "HTML5",
  "InVision",
  "jsfiddle.net",
  "Mac",
  "Malvid",
  "Modernizr",
  "Muzli",
  "NPM",
  "Nunjucks",
  "Placeholder",
  "Prepros",
  "prettier",
  "React",
  "Rest API",
  "Safari",
  "Sass/SCSS",
  "Semantic UI",
  "Sketch",
  "Skeleton",
  "SMACSS",
  "Spectre.css",
  "Storybook",
  "stylelint",
  "TypeKit",
  "Typo3",
  "Unsplash",
  "Visual Studio Code",
  "webpack",
  "Windows",
  "YARN",
];

const toolStack = Array.from(new Set(rawToolStack)).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" }),
);

type ResumeHighlight = {
  period: string;
  role: string;
  company: string;
  description: string;
};

type ContactDetail = {
  label: string;
  value: string;
};

type TimelineItem = {
  date: string;
  title: string;
  href?: string;
  linkLabel?: string;
  detail?: string;
};

const contactDetails: ContactDetail[] = [
  {
    label: "Address",
    value: "Offenbach am Main",
  },
  {
    label: "Email",
    value: "m-morley@gmx.de",
  },
];

const resumeHighlights: ResumeHighlight[] = [
  {
    period: "Jul 2025 - Today",
    role: "Career Break",
    company: "Offenbach am Main",
    description:
      "Focused on parental responsibilities and targeted professional development in modern frontend and data-driven technologies.",
  },
  {
    period: "Jul 2022 - Jul 2025",
    role: "Senior Product Engineer",
    company: "Accenture Song, Frankfurt",
    description:
      "Architected scalable frontend systems with TypeScript, React, Next.js, design systems, and headless CMS platforms.",
  },
  {
    period: "Jul 2021 - Jun 2022",
    role: "Product Engineer",
    company: "SinnerSchrader, Frankfurt",
    description:
      "Developed enterprise web applications with TypeScript, React, Web Components, and reusable component systems.",
  },
];

const resumeItems: TimelineItem[] = [
  {
    date: "Jul 2025 - Today",
    title: "Career Break / Personal & Professional Development",
    detail:
      "Parental responsibilities, machine learning foundations, algorithmic thinking, and data visualization with D3.js",
  },
  {
    date: "Jul 2022 - Jul 2025",
    title: "Accenture Song / Senior Product Engineer",
    href: "https://accenture.com",
    linkLabel: "accenture.com",
    detail: "TypeScript, React, Next.js, Contentful, Adobe Experience Manager",
  },
  {
    date: "Jul 2021 - Jun 2022",
    title: "SinnerSchrader / Product Engineer",
    href: "https://sinnerschrader.com",
    linkLabel: "sinnerschrader.com",
    detail: "TypeScript, React, Web Components",
  },
  {
    date: "Jan 2021 - Jun 2021",
    title: "Creative Developer / Frontend Developer",
    href: "https://hauserlacour.de",
    linkLabel: "hauserlacour.de",
  },
  { date: "2021", title: "synbionik.com" },
  {
    date: "Sep 2017 - Dec 2020",
    title: "UX Designer / Frontend Developer",
    href: "https://comwrap.com",
    linkLabel: "comwrap.com",
  },
  { date: "2020", title: "Digital Thinking Concepts and Tools Workshop" },
  {
    date: "2020",
    title: "Adobe Experience Manager Frontend Developer",
    detail: "HTML5, CSS3, JavaScript, Webpack",
  },
  { date: "2020", title: "UX Design Theory Workshop", detail: "XDi" },
  {
    date: "2020",
    title: "Adobe Experience Manager Core Components Workshop",
    detail: "HTL, Java, CSS, Webpack, JavaScript",
  },
  {
    date: "2019",
    title: "Presentation and communication workshop",
    detail: "Communication and body language",
  },
  {
    date: "2019",
    title: "Udacity Certificate: React Developer",
    detail: "HTML5, CSS3, JavaScript, React, React Native, Ajax, Redux",
  },
  { date: "2018", title: "css.conf / js.conf.eu", detail: "Berlin" },
  {
    date: "2018",
    title: "Udacity Certificate: Frontend Developer",
    detail: "HTML5, responsive design, ARIA, CSS3, JavaScript",
  },
  {
    date: "2017",
    title: "Malvid Atomic Design Components Library Workshop",
    detail: "BEM, SCSS, Nunjucks, JavaScript ECMA6",
  },
  { date: "2016", title: "Web design", detail: "Dieter Roosen" },
  { date: "2015", title: "Digital operator", detail: "Frank Weinert" },
  { date: "2015", title: "Web design", detail: "Stefanie Koesling" },
  {
    date: "2014",
    title: "Retouching",
    detail: "Maggi & Thommy recipe ideas",
  },
  { date: "2014", title: "CleverPrinting color management certificate" },
  { date: "2012", title: "Digital operator", detail: "Dieter Roosen" },
  {
    date: "2011",
    title: "Web design",
    detail: "friedrich und ruppel / hauser lacour",
  },
  { date: "2011", title: "Digital operator", detail: "Stefanie Koesling" },
  { date: "2011", title: "Digital operator", detail: "Becker Lacour" },
  { date: "2010", title: "Digital operator", detail: "Thomas Goos" },
  { date: "2010", title: "Set construction", detail: "Andreas Kopp" },
  {
    date: "2008 - 2014",
    title: "Photo assistant",
    detail: "Bernd Mayer",
    href: "http://berndmayer.com",
    linkLabel: "berndmayer.com",
  },
  { date: "2014", title: "Phase One: Lighting for Digital Cameras" },
  { date: "2013", title: "Phase One: Capture One Digital Operator Workshop" },
];

const educationItems = [
  "Nov 2025: freeCodeCamp Legacy JavaScript Algorithms and Data Structures V7 Certification",
  "Oct 2025: freeCodeCamp Data Visualization V8 / D3.js",
  "Oct 2019: Certified UX & Usability Professional, XDi - Experience Design Institut GmbH",
  "Aug 2019: React / React Native Nanodegree, Udacity",
  "Oct 2018: Front-End Web Developer Nanodegree, Udacity",
  "Oct 2014 - Aug 2018: Visual Communication, Hochschule fuer Gestaltung Offenbach",
];

const exhibitionItems = [
  "2019: Matias Hidalgo, fashion photography, New Talents, Vogue.it",
  "2019: Matias Hidalgo, documentary photography, Kunstverein Lola Montez, Frankfurt",
  '2015: Rainer Buchman Porsche 911 "bb Moonracer", fashion photography book',
  "2014: Ernst & Young Benefit Auction New Talents, painting, Museum Angewandte Kunst",
  "2013: Street art, photography, Kunstverein Lola Montez, Frankfurt",
  "2012: 8 Portrait photo show, photography, Landtag Dresden",
  "2012: A Piece of the Cake, photography, Kunstverein Lola Montez, Frankfurt",
  "2011: Satelite, photography, Satelite, Berlin",
  "2011: Is This Supposed to Be Art?, painting, Kunstverein Lola Montez, Frankfurt",
  "2011: Gallus Calling, painting, Projektraum Balken, Frankfurt",
  "2010: V2, photography, Sixt Gallusviertel, Frankfurt",
  "2009: V1, sound performance, Landungsbruecken, Frankfurt",
  "2009: The City Loves You, photography, Kunstverein Lola Montez, Frankfurt",
  "2008: faites le jeu!, painting, occupied house Westend, Frankfurt",
];

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="about-page page relative text-[var(--text1)]">
      <section class="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--surface-border)_80%,transparent)] bg-[radial-gradient(circle_at_top_left,_var(--surface2)_0%,_var(--surface1)_75%)] text-[var(--text1)]">
        <div class="about-page__backdrop" aria-hidden="true">
          <img
            src="/assets/images/photography/venedig/IMG_2094.jpg"
            alt=""
            loading="eager"
            sizes="100vw"
          />
          <div class="about-page__iris" />
        </div>
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--primary)_18%,transparent)_0%,transparent_68%)]"
          aria-hidden="true"
        />
        <div class="layout-shell relative px-6 py-20 sm:px-8 md:px-12 lg:px-16">
          <div class="relative grid items-start gap-12 rounded-[2.5rem] border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface1)_88%,transparent)] px-6 py-12 shadow-[0_28px_120px_-52px_var(--surface-shadow)] backdrop-blur-sm transition-colors duration-300 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,1fr)] lg:gap-20">
            <div class="space-y-10">
              <span class="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--surface-border)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface2)_72%,transparent)] px-4 py-2 text-[11px] font-semibold tracking-[0.35em] text-[var(--text3)] uppercase">
                <span
                  class="h-2 w-2 rounded-full bg-[var(--primary)]"
                  aria-hidden="true"
                />
                Profile
              </span>
              <div class="space-y-6">
                <h1 class="max-w-3xl text-4xl font-extrabold tracking-tight text-[var(--text1)] uppercase sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                  Markus Morley
                </h1>
                <p class="max-w-2xl text-base leading-relaxed text-[var(--text2)] sm:text-lg">
                  I connect design, prototyping, and performant frontend
                  development to create digital experiences with clarity,
                  character, and technical depth.
                </p>
              </div>
              <div class="flex flex-col gap-4 text-[11px] tracking-[0.35em] text-[var(--text3)] uppercase sm:flex-row sm:items-center sm:gap-6">
                <span class="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--surface-border)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface2)_80%,transparent)] px-4 py-3 font-semibold text-[var(--text2)]">
                  <span
                    class="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]"
                    aria-hidden="true"
                  />
                  Available for collaborations
                </span>
                <span class="text-[var(--text3)]">
                  Offenbach am Main / Remote-friendly
                </span>
              </div>
            </div>
            <aside class="flex h-full flex-col justify-between gap-8 rounded-[2rem] border border-[color-mix(in_srgb,var(--surface-border)_75%,transparent)] bg-[color-mix(in_srgb,var(--surface2)_78%,transparent)]/90 p-6 shadow-[0_26px_90px_-55px_var(--surface-shadow)] transition-transform duration-300 hover:-translate-y-1 sm:p-8">
              <header class="space-y-4">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold tracking-[0.38em] text-[var(--text3)] uppercase">
                      Resume
                    </p>
                    <h2 class="mt-2 text-2xl font-semibold tracking-tight text-[var(--text1)] sm:text-3xl">
                      Markus Morley
                    </h2>
                    <p class="mt-1 text-sm font-medium tracking-[0.24em] text-[var(--text3)] uppercase">
                      Senior Product Engineer
                    </p>
                  </div>
                  <span class="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--surface-border)_65%,transparent)] bg-[color-mix(in_srgb,var(--surface1)_92%,transparent)] px-4 py-1.5 text-[11px] font-semibold tracking-[0.32em] text-[var(--text2)] uppercase">
                    Focus
                  </span>
                </div>
                <dl class="grid gap-2 text-sm text-[var(--text2)]">
                  {contactDetails.map((detail) => (
                    <div
                      key={detail.label}
                      class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"
                    >
                      <dt class="text-xs font-semibold tracking-[0.32em] text-[var(--text3)] uppercase">
                        {detail.label}
                      </dt>
                      <dd class="text-right text-sm text-[var(--text2)] sm:text-base">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </header>
              <div class="space-y-4">
                {resumeHighlights.map((item) => (
                  <article
                    key={`${item.period}-${item.company}`}
                    class="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--surface-border)_68%,transparent)] bg-[color-mix(in_srgb,var(--surface1)_96%,transparent)]/95 p-5 shadow-[0_18px_70px_-60px_var(--surface-shadow)]"
                  >
                    <p class="text-[11px] font-semibold tracking-[0.35em] text-[var(--text3)] uppercase">
                      {item.period}
                    </p>
                    <h3 class="mt-2 text-base font-semibold tracking-tight text-[var(--text1)] sm:text-lg">
                      {item.role}
                    </h3>
                    <p class="mt-1 text-sm font-medium text-[var(--text2)]">
                      {item.company}
                    </p>
                    <p class="mt-3 text-sm leading-relaxed text-[var(--text2)]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
              <p class="text-xs tracking-[0.32em] text-[var(--text3)] uppercase">
                Snapshot from the full resume
              </p>
            </aside>
          </div>
        </div>
      </section>

      <AboutProfile />

      <div class="layout-shell py-16">
        <section class="max-w-3xl">
          <h2 class="text-3xl font-semibold tracking-tight text-[var(--text1)] sm:text-4xl">
            Hi, I'm Markus Morley
          </h2>
          <p class="mt-4 text-base leading-relaxed text-[var(--text2)] sm:text-lg">
            I design and code digital experiences for teams that care about
            craft, usability, and resilient delivery. Based in Offenbach am
            Main, I work across product design, frontend architecture, and
            interactive brand experiences.
          </p>
        </section>

        <AboutExpertise
          class="mt-24"
          items={expertiseItems}
          description="My approach blends research-led design exploration with code that ships. Each engagement moves between discovery, prototyping, and resilient delivery so products feel coherent across every touchpoint."
        />

        <section class="mt-24 overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface1)_88%,transparent)] px-6 py-10 shadow-[0_22px_90px_-60px_var(--surface-shadow)] sm:px-10">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-3">
              <span class="text-xs font-semibold tracking-[0.4em] text-[var(--text3)] uppercase">
                Craft
              </span>
              <h2 class="text-3xl font-semibold tracking-tight text-[var(--text1)] sm:text-4xl">
                Tool Stack
              </h2>
            </div>
            <p class="max-w-xl text-sm leading-relaxed text-[var(--text2)] sm:text-base">
              A curated set of tools, frameworks, and platforms I use to design,
              build, and refine digital products.
            </p>
          </div>
          <ul
            class="mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            aria-label="Tool stack"
          >
            {toolStack.map((tool) => (
              <li key={tool}>
                <span class="inline-flex w-full items-center justify-between gap-3 rounded-full border border-[color-mix(in_srgb,var(--surface-border)_75%,transparent)] bg-[color-mix(in_srgb,var(--surface2)_82%,transparent)] px-4 py-2 text-sm font-medium text-[var(--text2)] shadow-[0_8px_24px_-18px_var(--surface-shadow)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--primary)_35%,var(--surface-border))] hover:bg-[color-mix(in_srgb,var(--surface3)_88%,transparent)] hover:text-[var(--text1)]">
                  {tool}
                  <span class="text-[10px] font-semibold tracking-[0.4em] text-[var(--text3)] uppercase">
                    Tool
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section class="mt-24 overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface1)_90%,transparent)] px-6 py-10 text-[var(--text2)] shadow-[0_22px_90px_-60px_var(--surface-shadow)] transition-colors duration-300 sm:px-10">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-3">
              <span class="text-xs font-semibold tracking-[0.4em] text-[var(--text3)] uppercase">
                Experience
              </span>
              <h2 class="text-3xl font-semibold tracking-tight text-[var(--text1)] sm:text-4xl">
                Resume
              </h2>
            </div>
            <p class="max-w-xl text-sm leading-relaxed text-[var(--text2)] sm:text-base">
              A quick view of the collaborations, workshops, and milestones that
              shaped my craft across design and engineering.
            </p>
          </div>

          <ol class="mt-10 space-y-5 border-l border-[color-mix(in_srgb,var(--surface-border)_85%,transparent)] pl-6">
            {resumeItems.map((item) => (
              <li key={`${item.date}-${item.title}`} class="relative">
                <span
                  class="absolute top-2 left-[-19px] h-2 w-2 rounded-full bg-[var(--primary)]"
                  aria-hidden="true"
                />
                <span class="font-semibold text-[var(--text1)]">
                  {item.date}:
                </span>{" "}
                {item.title}
                {item.href && item.linkLabel && (
                  <a
                    href={item.href}
                    class="ml-1 underline decoration-[var(--surface-border)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--text1)]"
                  >
                    {item.linkLabel}
                  </a>
                )}
                {item.detail && <> - {item.detail}</>}
              </li>
            ))}
          </ol>

          <div class="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 class="text-2xl font-semibold tracking-tight text-[var(--text1)]">
                Education
              </h3>
              <ul class="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[var(--text2)] sm:text-base">
                {educationItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 class="text-2xl font-semibold tracking-tight text-[var(--text1)]">
                Exhibitions
              </h3>
              <ul class="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[var(--text2)] sm:text-base">
                {exhibitionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

export const head = buildHead(`About - ${siteMetadata.title}`);
