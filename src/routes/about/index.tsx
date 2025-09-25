import { component$, useStyles$ } from "@builder.io/qwik";
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

const toolStack = Array.from(new Set(rawToolStackCore)).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

export default component$(() => {
  useStyles$(styles);
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
