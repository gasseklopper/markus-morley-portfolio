import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import { AboutProfile } from "~/components/about/about-profile";
import {
  AboutExpertise,
  type ExpertiseItem,
} from "~/components/about/about-expertise";
import ImgHero from "~/media/assets/images/heros/image.png?jsx";

const expertiseItems: ExpertiseItem[] = [
  {
    title: "Engineering at Scale",
    description:
      "Delivering large-scale, performant frontend architectures for SaaS, fintech, and enterprise products.",
  },
  {
    title: "Design-Engineering Bridge",
    description:
      "Turning prototypes into production code with pixel-perfect fidelity.",
  },
  {
    title: "Leadership & Mentorship",
    description:
      "Setting coding standards, mentoring juniors, driving cross-functional collaboration.",
  },
  {
    title: "Impact & Performance",
    description:
      "Optimizing applications for speed, scalability, and long-term maintainability.",
  },
  {
    title: "My Mission",
    description:
      "My goal is to bridge the gap between design and development, creating digital experiences that are not only visually appealing but also highly functional. I am committed to continuous learning and staying updated with the latest industry trends to deliver cutting-edge solutions.",
  },
  {
    title: "Forward",
    description:
      "I look forward to collaborating with like-minded professionals and organizations to push the boundaries of what’s possible in the digital space. Let's create something extraordinary together!",
  },
];

const rawToolStackCore = [
  "React",
  "Next.js",
  "TypeScript",
  "GraphQL",
  "Tailwind CSS",
  "Node.js",
  "Web Components",
];

const rawToolStackAlso = [
  "Figma",
  "Adobe Creative Suite",
  "Sketch",
];

const rawToolStackSupporting = [
  "Jira",
  "Scrum",
  "GitHub",
  "Storybook",
  "Jest",
  "Cypress",
];

const rawToolStackCMS = [
  "Astro",
  "Contentful",
  "Adobe Experience Manager",
  "TanStack Query/Table",
];


// ----------------------------------------------
// Sample data (replace with CMS/JSON)
// ----------------------------------------------
interface Role {
  company: string
  title: string
  period: string
  location: string
  bullets: string[]
  tech: string[]
}

const experience: Role[] = [
  {
    company: "Freelance / Contract",
    title: "Creative Developer / Senior Frontend Engineer",
    period: "2020 – 2023",
    location: "Remote / EU",
    bullets: [
      "Delivered scalable web apps & design systems for SaaS, fintech and e‑commerce",
      "Drove performance optimisations; lighthouse +35–45% across key properties",
      "Partnered with design to translate Figma prototypes into production",
    ],
    tech: ["React", "Next.js", "TypeScript", "GraphQL", "TanStack", "Contentful"],
  },
  {
    company: "[Company Name]",
    title: "Senior Frontend Engineer / Product Engineer",
    period: "2018 – 2020",
    location: "Frankfurt am Main",
    bullets: [
      "Led FE architecture for large‑scale platform (thousands of DAU)",
      "Introduced component library & DX tooling; delivery time −30%",
      "Mentored juniors; set standards & code review rituals",
    ],
    tech: ["React", "Next.js", "TypeScript", "Jest", "Cypress", "Storybook"],
  },
  {
    company: "[Company Name]",
    title: "Frontend Developer / UI Engineer",
    period: "2014 – 2018",
    location: "—",
    bullets: [
      "Built accessible, responsive interfaces for enterprise SaaS",
      "Integrated REST/GraphQL APIs; implemented web performance budgets",
    ],
    tech: ["React", "Redux", "Sass", "Webpack", "GraphQL"],
  },
]

interface EducationItem {
  school: string
  credential: string
  period: string
  notes?: string
}

const education: EducationItem[] = [
  {
    school: "Hochschule Darmstadt",
    credential: "Diploma — Visual Communication / Interactive Media",
    period: "2006 – 2010",
    notes: "Focus on prototyping, interactive systems & photography",
  },
]

interface ExhibitionItem { year: string; venue: string; title: string }
const exhibitions: ExhibitionItem[] = [
  { year: "2023", venue: "[Gallery] Frankfurt", title: "Hybrid Analog – Fractal Photonics" },
  { year: "2022", venue: "[Gallery] London", title: "Generative Landscapes" },
  { year: "2021", venue: "[Festival] Wiesbaden", title: "Light + Code" },
];

// const rawToolStack2 = [
//   "Adobe CC",
//   "Adobe Experience Manager",
//   "Airbnb CSS / Sass Styleguide",
//   "Airbnb's ESLint config",
//   "Anime.js",
//   "Atom",
//   "Atomic Design",
//   "Babel",
//   "BasicLightbox",
//   "basicGrid",
//   "BEM",
//   "Brackets",
//   "Browserify",
//   "BrowserStack",
//   "Browsersync",
//   "caniuse.com",
//   "Chrome Developer Tools",
//   "CodePen",
//   "Color Profiles",
//   "CSS Tricks Almanac",
//   "CSS3",
//   "ECMA",
//   "Edge",
//   "Emmet",
//   "eslint",
//   "EZ",
//   "Firefox",
//   "Flaticon",
//   "Foundation",
//   "GitHub Desktop",
//   "GitHub",
//   "Google Chrome",
//   "Google Fonts",
//   "GreenSock-JS",
//   "Gulp",
//   "Handlebars",
//   "HTML5",
//   "InVision",
//   "jsfiddle.net",
//   "Mac",
//   "Malvid",
//   "Modernizr",
//   "Muzli",
//   "NPM",
//   "Nunjucks",
//   "Placeholder",
//   "Prepros",
//   "prettier",
//   "React",
//   "Rest API",
//   "Safari",
//   "Sass/SCSS",
//   "Sketch",
//   "Skeleton",
//   "SMACSS",
//   "Spectre.css",
//   "Semantic UI",
//   "Storybook",
//   "stylelint",
//   "Typo3",
//   "TypeKit",
//   "Unsplash",
//   "Visual Studio Code",
//   "webpack",
//   "Windows",
//   "YARN",
// ];
// console.log(rawToolStack2);


export const Pill = component$((props: { label: string }) => {
  return (
    <span class="inline-flex items-center rounded-full border bg-slate-50 px-3 py-1 text-xs shadow-sm">
      {props.label}
    </span>
  )
})

export const SectionTitle = component$((props: { label: string; sub?: string; icon?: 'building' | 'cap' | 'sparkles' }) => {
  return (
    <div class="flex items-start gap-3">
      <div class="p-2 rounded-xl shadow-sm bg-white/60 backdrop-blur">
        {/* tiny inline icons */}
        {props.icon === 'building' && (
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M6 10h12M10 6h4M10 14h4M10 18h4" />
          </svg>
        )}
        {props.icon === 'cap' && (
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M21 10v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-6" />
          </svg>
        )}
        {props.icon === 'sparkles' && (
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M5 3l1.5 3L10 7l-3.5 1L5 11 3.5 8 0 7l3.5-1L5 3zm14 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zM9 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
          </svg>
        )}
      </div>
      <div>
        <h2 class="text-xl font-semibold tracking-tight">{props.label}</h2>
        {props.sub && <p class="mt-0.5 text-sm text-muted-foreground">{props.sub}</p>}
      </div>
    </div>
  )
});

const toolStack = Array.from(new Set(rawToolStackCore)).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

export default component$(() => {
  useStyles$(styles);

  const tab = useSignal<'experience' | 'education' | 'exhibitions'>("experience")
  const showExpo = useSignal(false);

  return (
    <div class="page relative text-[var(--text1)]">
      {/* Hero */}
      <section class="relative overflow-hidden rounded-b-3xl border-b-4 border-l-4 border-[var(--text1)] bg-[var(--surface1)] text-[var(--text1)] shadow-[12px_12px_0_0_var(--surface3)]">
        <div
          class="absolute inset-0 bg-[linear-gradient(135deg,var(--surface2)_0%,transparent_60%)]"
          aria-hidden="true"
        />
        <div
          class="absolute -top-24 right-16 h-64 w-64 rotate-6 border-4 border-[var(--text1)] bg-[var(--primary)] opacity-70 mix-blend-screen md:right-32"
          aria-hidden="true"
        />
        <div class="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-12">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.6em] text-[var(--text3)]">
              Statement
            </p>
            <h1 class="mt-4 text-5xl font-black uppercase leading-[0.9] md:text-6xl">
              Brutalist design & code for fearless brands.
            </h1>
            <p class="mt-6 max-w-xl text-base text-[var(--text2)] md:text-lg">
              Senior Frontend Engineer with 10+ years experience building scalable digital products.
            </p>
          </div>
          <div class="flex flex-col items-start gap-6 md:items-end">
            <div class="inline-flex items-center gap-3 rounded-md border border-[var(--text1)] bg-[var(--surface1)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.35em]">
              <span class="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" aria-hidden="true" />
              Available for collaborations
            </div>
            <div class="relative -rotate-3 overflow-hidden border-4 border-[var(--text1)] bg-[var(--surface2)] shadow-[10px_10px_0_0_var(--text1)] transition hover:rotate-0">
              <ImgHero alt="Markus Morley portrait" class="h-48 w-40 object-cover md:h-60 md:w-48" />
              <div class="absolute inset-x-0 bottom-0 bg-[var(--surface1)]/80 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text1)]">
                About
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutProfile />

      <div class="layout-shell py-16">
        {/* Intro */}
        <section>
          <h2 class="text-3xl font-bold text-[var(--text1)]">
            Hi, I'm Markus Morley
          </h2>
          <p class="mt-4 text-[var(--text2)]">
            I'm passionate about coding digital experiences and crafting user
            interfaces. Based in Frankfurt am Main, I dedicate my professional
            life to designing, developing, and bringing to life innovative
            digital solutions.
          </p>
        </section>

        <AboutExpertise
          class="mt-20"
          items={expertiseItems}
          description="My approach blends research-led design exploration with code that ships. Each engagement flexes between discovery, prototyping, and resilient delivery so brands feel fearless across every touchpoint."
        />

        {/* Tool Core */}
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-[var(--text1)]">Core Skills</h2>
          {/* <p class="mt-4 text-[var(--text2)]">
            A curated set of tools, frameworks, and platforms I rely on to
            design, build, and refine digital products.
          </p> */}
          <ul class="mt-8 flex list-none flex-wrap gap-3 p-0" aria-label="Tool stack">
            {toolStack.map((tool) => (
              <li key={tool}>
                <span class="inline-flex rounded-full border border-[var(--surface3)] bg-[var(--surface2)] px-4 py-2 text-sm font-medium text-[var(--text2)] shadow-sm transition hover:border-[var(--surface4)] hover:bg-[var(--surface3)] hover:text-[var(--text1)]">
                  {tool}
                </span>
              </li>
            ))}
          </ul>
        </section>

        { /* CMS & Platforms */}
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-[var(--text1)]">CMS & Platforms</h2>
          {/* <p class="mt-4 text-[var(--text2)]">
            A curated set of tools, frameworks, and platforms I have experience with.
          </p> */}
          <ul class="mt-8 flex list-none flex-wrap gap-3 p-0" aria-label="Tool stack">
            {rawToolStackCMS.map((tool) => (
              <li key={tool}>
                <span class="inline-flex rounded-full border border-[var(--surface3)] bg-[var(--surface2)] px-4 py-2 text-sm font-medium text-[var(--text2)] shadow-sm transition hover:border-[var(--surface4)] hover:bg-[var(--surface3)] hover:text-[var(--text1)]">
                  {tool}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Also Experienced With  */}
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-[var(--text1)]">Design & Prototyping</h2>
          {/* <p class="mt-4 text-[var(--text2)]">
            A curated set of tools, frameworks, and platforms I have experience with.
          </p> */}
          <ul class="mt-8 flex list-none flex-wrap gap-3 p-0" aria-label="Tool stack">
            {rawToolStackAlso.map((tool) => (
              <li key={tool}>
                <span class="inline-flex rounded-full border border-[var(--surface3)] bg-[var(--surface2)] px-4 py-2 text-sm font-medium text-[var(--text2)] shadow-sm transition hover:border-[var(--surface4)] hover:bg-[var(--surface3)] hover:text-[var(--text1)]">
                  {tool}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Supporting Tools */}
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-[var(--text1)]">Supporting Tools</h2>
          {/* <p class="mt-4 text-[var(--text2)]">
            A curated set of tools, frameworks, and platforms I have experience with.
          </p> */}
          <ul class="mt-8 flex list-none flex-wrap gap-3 p-0" aria-label="Tool stack">
            {rawToolStackSupporting.map((tool) => (
              <li key={tool}>
                <span class="inline-flex rounded-full border border-[var(--surface3)] bg-[var(--surface2)] px-4 py-2 text-sm font-medium text-[var(--text2)] shadow-sm transition hover:border-[var(--surface4)] hover:bg-[var(--surface3)] hover:text-[var(--text1)]">
                  {tool}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Resume */}
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Tabs header */}
          <h2 class="text-3xl font-bold text-[var(--text1)]">Resume</h2>
          <div class="mb-6">
            <div class="grid w-full grid-cols-3 overflow-hidden rounded-2xl border bg-white/60 shadow-sm backdrop-blur">
              {(['experience', 'education', 'exhibitions'] as const).map((key) => (
                <button
                  key={key}
                  onClick$={() => (tab.value = key)}
                  class={{
                    'px-4 py-2 text-sm font-medium transition': true,
                    'bg-white shadow-sm': tab.value === key,
                    'text-muted-foreground hover:bg-white/50': tab.value !== key,
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          {tab.value === 'experience' && (
            <div class="grid gap-4 md:gap-6 lg:grid-cols-2">
              {experience.map((role) => (
                <div key={role.title} class="rounded-2xl border bg-gradient-to-b from-white/70 to-white/40 shadow-sm">
                  <div class="p-5 pb-2">
                    <div class="flex items-center justify-between">
                      <h3 class="text-base font-semibold leading-tight">{role.title}</h3>
                      <span class="text-xs text-muted-foreground">{role.period}</span>
                    </div>
                    <div class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      {/* building icon */}
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M6 10h12M10 6h4M10 14h4M10 18h4" /></svg>
                      {role.company}
                      <span class="mx-1">•</span>
                      <span>{role.location}</span>
                    </div>
                  </div>
                  <div class="p-5 pt-0">
                    <ul class="list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
                      {role.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <div class="mt-4 flex flex-wrap gap-2">
                      {role.tech.map((t) => (
                        <Pill key={t} label={t} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {tab.value === 'education' && (
            <div class="rounded-2xl border bg-gradient-to-b from-white/70 to-white/40 shadow-sm">
              <div class="p-6">
                <SectionTitle label="Education" sub="Formal studies & credentials" icon="cap" />
                <div class="mt-4 grid gap-4">
                  {education.map((e) => (
                    <div key={e.credential} class="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <h3 class="font-medium">{e.credential}</h3>
                        <p class="text-sm text-muted-foreground">{e.school}</p>
                        {e.notes && <p class="mt-1 text-sm">{e.notes}</p>}
                      </div>
                      <div class="text-sm text-muted-foreground md:text-right">{e.period}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Exhibitions */}
          {tab.value === 'exhibitions' && (
            <div class="rounded-2xl border bg-gradient-to-b from-white/70 to-white/40 shadow-sm">
              <div class="p-6">
                <SectionTitle label="Exhibitions" sub="Selected shows & festivals" icon="sparkles" />
                <div class="mt-4">
                  <button
                    class="w-full rounded-xl border px-4 py-2 text-left text-sm hover:bg-white/60"
                    onClick$={() => (showExpo.value = !showExpo.value)}
                  >
                    {showExpo.value ? 'Hide list' : 'View list'}
                  </button>
                  <div class={{ 'grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3': true, hidden: !showExpo.value }}>
                    {exhibitions.map((ex) => (
                      <div key={ex.title} class="rounded-xl border bg-white/60 p-3">
                        <div class="text-xs text-muted-foreground">{ex.year}</div>
                        <div class="font-medium leading-tight">{ex.title}</div>
                        <div class="text-xs text-muted-foreground">{ex.venue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div class="mt-10 flex flex-col items-center gap-3">
            <p class="max-w-xl text-center text-sm text-muted-foreground">
              Interested in collaborating? I build robust, elegant frontends and scalable design systems for ambitious teams.
            </p>
            <div class="flex gap-3">
              <a href="/contact" class="rounded-2xl border bg-white px-4 py-2 shadow-sm hover:bg-white/80">Get in touch</a>
              <a href="/portfolio" class="rounded-2xl border px-4 py-2 hover:bg-white/60">View portfolio</a>
              <a href="/cv.pdf" class="rounded-2xl bg-black px-4 py-2 text-white hover:opacity-90">Download CV</a>
            </div>
          </div>
        </div>


        {/* Resume */}
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-[var(--text1)]">Resume</h2>
          <ul class="mt-8 space-y-6 border-l border-[var(--surface4)] pl-6 text-[var(--text2)]">
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">01.01.2021 - 30.06.2021:</span>{" "}
              Creative Developer / Frontend-Developer
              <a href="https://hauserlacour.de" class="ml-1 underline">
                hauserlacour.de
              </a>
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">01.07.2021 - 01.01.2022:</span>{" "}
              Accenture / Senior Product Engineer / Frontend-Developer
              <a href="https://accenture.com" class="ml-1 underline">
                accenture.com
              </a>
              – TypeScript, Next.js, D3.js
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">01.07.2021 - 01.01.2022:</span> Sinner
              Schrader / Product Engineer / Frontend-Developer
              <a href="https://sinnerschrader.com" class="ml-1 underline">
                sinnerschrader.com
              </a>
              – TypeScript, React, Web Components
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2021:</span> synbionik.com
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">01.09.2017 - 31.12.2020:</span>
              UX-Designer / Frontend-Developer
              <a href="https://comwrap.com" class="ml-1 underline">
                comwrap.com
              </a>
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2020:</span> Digital Thinking Concepts
              and Tools Workshop
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2020:</span> Adobe Experience Manager
              – Frontend Developer (HTML5/CSS3/JavaScript/Webpack)
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2020:</span> UX Design Theory Workshop
              – XDi
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2020:</span> Adobe Experience Manager
              – Core Components Workshop (HTL/Java/CSS/Webpack/JavaScript)
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2019:</span> "Wie präsentiere ich
              richtig" – Kommunikations/Körpersprache Workshop
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2019:</span> Udacity Certificate –
              React Developer (HTML5/CSS3/JavaScript/React/React
              Native/Ajax/Redux)
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2018:</span> css.conf / js.conf.eu –
              Berlin
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2018:</span> Udacity Certificate –
              Frontend Developer (HTML5/Responsive/ARIA/CSS3/JavaScript)
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2017:</span> Malvid Atomic Design
              Components Library Workshop (BEM/SCSS/Nunjucks/JavaScript ECMA6)
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2016:</span> Webdesign – Dieter Roosen
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2015:</span> Digital Operator – Frank
              Weinert
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2015:</span> Webdesign – Stefanie
              Koesling
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2014:</span> Retouching – Maggi &
              Thommy Rezept Ideen
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2014:</span> CleverPrinting
              Colormanagement Certificate
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2012:</span> Digital Operator – Dieter
              Roosen
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2011:</span> Webdesign – friedrich und
              ruppel – hauser lacour
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2011:</span> Digital Operator –
              Stefanie Koesling
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2011:</span> Digital Operator – Becker
              Lacour
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2010:</span> Digital Operator – Thomas
              Goos
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2010:</span> Kulissen Bau – Andreas
              Kopp
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2008 - 2014:</span> Fotoassistent –
              Bernd Mayer
              <a href="http://berndmayer.com" class="ml-1 underline">
                berndmayer.com
              </a>
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2014:</span> Phase One – Lighting for
              Digital Cameras
            </li>
            <li class="relative">
              <span class="absolute top-1 -left-3 h-2 w-2 rounded-full bg-[var(--primary)]"></span>
              <span class="font-semibold">2013:</span> Phase One – Capture One
              Digital Operator Workshop
            </li>
          </ul>

          <h3 class="mt-12 text-2xl font-bold text-[var(--text1)]">
            Education
          </h3>
          <ul class="mt-4 list-disc space-y-2 pl-5 text-[var(--text2)]">
            <li>
              2008-2014: Visuele Kommunikation – Photography/Painting/Digitale
              Medien – HFG, Offenbach a.M.
            </li>
            <li>
              2006-2008: Photographer – Photography Peter Behrens Schule –
              Darmstadt
            </li>
            <li>
              2003-2006: Informationstechnischer Assistent – Werner-von-Siemens
              Schule, Frankfurt am Main
            </li>
          </ul>

          <h3 class="mt-12 text-2xl font-bold text-[var(--text1)]">
            Exhibitions
          </h3>
          <ul class="mt-4 list-disc space-y-2 pl-5 text-[var(--text2)]">
            <li>
              2019: Matias Hidalgo – Fashion Photography – New Talents –
              Vogue.it
            </li>
            <li>
              2019: Matias Hidalgo – Documentation Photography – Kunstverein
              Lola Montez, Frankfurt
            </li>
            <li>
              2015: Rainer Buchman Porsche 911 „bb Moonracer“ – Fashion
              Photography, Buch
            </li>
            <li>
              2014: Ernst and Young Benefitt Auktion Neue Talente – Painting –
              Museum für Angewandte Kunst
            </li>
            <li>
              2013: Streetart – Photography – Kunstverein Lola Montez, Frankfurt
            </li>
            <li>
              2012: 8 Portrait Fotoschau Deutschlands – Photography – Landtag,
              Dresden
            </li>
            <li>
              2012: Ein Stück vom Kuchen – Photography – Kunstverein Lola
              Montez, Frankfurt
            </li>
            <li>2011: Satelite – Photography – Satelite, Berlin</li>
            <li>
              2011: Und das soll Kunst sein – Painting – Kunstverein Lola
              Montez, Frankfurt
            </li>
            <li>
              2011: Gallus Calling – Painting – Projektraum Balken, Frankfurt
            </li>
            <li>2010: V2 – Photography – Sixt Gallusviertel, Frankfurt</li>
            <li>2009: V1 – Soundperformance – Landungsbrücken, Frankfurt</li>
            <li>
              2009: The City Loves You – Photography – Kunstverein Lola Montez,
              Frankfurt
            </li>
            <li>
              2008: faites le jeu! – Painting – besetztes Haus Westend,
              Frankfurt
            </li>
          </ul>
        </section>
      </div>


    </div>
  );
});

export const head = buildHead(`About - ${siteConfig.metadata.title}`);
