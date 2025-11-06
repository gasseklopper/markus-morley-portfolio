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
    title: "Design",
    description:
      "I have a deep love for design. Whether it’s creating visually stunning layouts or ensuring seamless user experiences, I strive to merge creativity with functionality in every project. My design philosophy is rooted in understanding user needs and crafting intuitive, engaging interfaces.",
  },
  {
    title: "Prototyping",
    description:
      "Building UX prototypes is a core part of my work. I transform ideas into interactive prototypes that allow for early user testing and feedback. This iterative process helps refine the user experience and ensures that the final product meets user expectations.",
  },
  {
    title: "Large-Scale Digital Projects",
    description:
      "I develop and manage large-scale digital projects, leveraging modern technologies to create high-performance applications. My expertise spans from initial concept to final deployment, ensuring each project is executed with precision and meets the highest standards of quality.",
  },
  {
    title: "Development",
    description:
      "Specializing in frontend development, I create robust components using atomic design principles. This methodology allows for the development of scalable and maintainable user interfaces by breaking down designs into their simplest, reusable parts.",
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
  "EZ",
  "Firefox",
  "Flaticon",
  "Foundation",
  "GitHub Desktop",
  "GitHub",
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
  "Sketch",
  "Skeleton",
  "SMACSS",
  "Spectre.css",
  "Semantic UI",
  "Storybook",
  "stylelint",
  "Typo3",
  "TypeKit",
  "Unsplash",
  "Visual Studio Code",
  "webpack",
  "Windows",
  "YARN",
];

const toolStack = Array.from(new Set(rawToolStack)).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page relative text-[var(--text1)]">
      {/* Hero */}
      <section class="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--surface-border)_80%,transparent)] bg-[radial-gradient(circle_at_top_left,_var(--surface2)_0%,_var(--surface1)_75%)] text-[var(--text1)]">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--primary)_18%,transparent)_0%,transparent_68%)]"
          aria-hidden="true"
        />
        <div class="layout-shell relative px-6 py-20 sm:px-8 md:px-12 lg:px-16">
          <div class="relative grid items-end gap-12 rounded-[2.5rem] border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface1)_86%,transparent)] px-6 py-12 shadow-[0_28px_120px_-50px_var(--surface-shadow)] backdrop-blur-sm transition-colors duration-300 sm:px-10 sm:py-16 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] md:gap-16">
            <div class="space-y-8">
              <span class="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--surface-border)_75%,transparent)] bg-[color-mix(in_srgb,var(--surface2)_70%,transparent)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--text3)]">
                <span class="h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
                Statement
              </span>
              <div class="space-y-6">
                <h1 class="max-w-3xl text-4xl font-extrabold uppercase tracking-tight text-[var(--text1)] sm:text-5xl md:text-6xl md:leading-[1.05]">
                  Brutalist design & code for fearless brands.
                </h1>
                <p class="max-w-2xl text-base leading-relaxed text-[var(--text2)] sm:text-lg">
                  I'm Markus Morley, a hybrid designer and front-end engineer crafting digital experiences with unapologetic personality and pixel-perfect execution.
                </p>
              </div>
              <div class="flex flex-col gap-4 text-[11px] uppercase tracking-[0.35em] text-[var(--text3)] sm:flex-row sm:items-center sm:gap-6">
                <span class="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--surface-border)_75%,transparent)] bg-[color-mix(in_srgb,var(--surface2)_78%,transparent)] px-4 py-3 font-semibold text-[var(--text2)]">
                  <span class="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" aria-hidden="true" />
                  Available for collaborations
                </span>
                <span class="text-[var(--text3)]">
                  Based in Frankfurt · Working with global teams
                </span>
              </div>
            </div>
            <div class="relative flex justify-center md:justify-end">
              <div
                class="pointer-events-none absolute -left-10 top-6 hidden h-24 w-24 rounded-full border border-[color-mix(in_srgb,var(--surface-border)_65%,transparent)] bg-[radial-gradient(circle,var(--primary)_0%,transparent_65%)] opacity-30 blur-md md:block"
                aria-hidden="true"
              />
              <div class="relative overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface2)_85%,transparent)] shadow-[0_26px_80px_-40px_var(--surface-shadow)] transition-transform duration-300 hover:-translate-y-1">
                <ImgHero alt="Markus Morley portrait" class="h-64 w-52 object-cover sm:h-72 sm:w-56 md:h-80 md:w-64" />
                <div class="absolute inset-x-0 bottom-0 bg-[color-mix(in_srgb,var(--surface1)_92%,transparent)]/95 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text2)]">
                  About
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutProfile />

      <div class="layout-shell py-16">
        {/* Intro */}
        <section class="max-w-3xl">
          <h2 class="text-3xl font-semibold tracking-tight text-[var(--text1)] sm:text-4xl">
            Hi, I'm Markus Morley
          </h2>
          <p class="mt-4 text-base leading-relaxed text-[var(--text2)] sm:text-lg">
            I'm passionate about coding digital experiences and crafting user
            interfaces. Based in Frankfurt am Main, I dedicate my professional
            life to designing, developing, and bringing to life innovative
            digital solutions.
          </p>
        </section>

        <AboutExpertise
          class="mt-24"
          items={expertiseItems}
          description="My approach blends research-led design exploration with code that ships. Each engagement flexes between discovery, prototyping, and resilient delivery so brands feel fearless across every touchpoint."
        />

        {/* Tool Stack */}
        <section class="mt-24 overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface1)_88%,transparent)] px-6 py-10 shadow-[0_22px_90px_-60px_var(--surface-shadow)] sm:px-10">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-3">
              <span class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--text3)]">
                Craft
              </span>
              <h2 class="text-3xl font-semibold tracking-tight text-[var(--text1)] sm:text-4xl">
                Tool Stack
              </h2>
            </div>
            <p class="max-w-xl text-sm leading-relaxed text-[var(--text2)] sm:text-base">
              A curated set of tools, frameworks, and platforms I rely on to design, build, and refine digital products.
            </p>
          </div>
          <ul class="mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" aria-label="Tool stack">
            {toolStack.map((tool) => (
              <li key={tool}>
                <span class="inline-flex w-full items-center justify-between gap-3 rounded-full border border-[color-mix(in_srgb,var(--surface-border)_75%,transparent)] bg-[color-mix(in_srgb,var(--surface2)_82%,transparent)] px-4 py-2 text-sm font-medium text-[var(--text2)] shadow-[0_8px_24px_-18px_var(--surface-shadow)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--primary)_35%,var(--surface-border))] hover:bg-[color-mix(in_srgb,var(--surface3)_88%,transparent)] hover:text-[var(--text1)]">
                  {tool}
                  <span class="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text3)]">Tool</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Resume */}
        <section class="mt-24 overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[color-mix(in_srgb,var(--surface1)_90%,transparent)] px-6 py-10 text-[var(--text2)] shadow-[0_22px_90px_-60px_var(--surface-shadow)] transition-colors duration-300 sm:px-10">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-3">
              <span class="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--text3)]">
                Experience
              </span>
              <h2 class="text-3xl font-semibold tracking-tight text-[var(--text1)] sm:text-4xl">
                Resume
              </h2>
            </div>
            <p class="max-w-xl text-sm leading-relaxed text-[var(--text2)] sm:text-base">
              A quick view into the collaborations, workshops, and milestones that shaped my craft across design and engineering.
            </p>
          </div>
          <ol class="mt-10 space-y-5 border-l border-[color-mix(in_srgb,var(--surface-border)_85%,transparent)] pl-6">
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">01.01.2021 - 30.06.2021:</span>{" "}
              Creative Developer / Frontend-Developer
              <a href="https://hauserlacour.de" class="ml-1 underline decoration-[var(--surface-border)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--text1)]">
                hauserlacour.de
              </a>
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">01.07.2021 - 01.01.2022:</span>{" "}
              Accenture / Senior Product Engineer / Frontend-Developer
              <a href="https://accenture.com" class="ml-1 underline decoration-[var(--surface-border)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--text1)]">
                accenture.com
              </a>
              – TypeScript, Next.js, D3.js
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">01.07.2021 - 01.01.2022:</span> Sinner
              Schrader / Product Engineer / Frontend-Developer
              <a href="https://sinnerschrader.com" class="ml-1 underline decoration-[var(--surface-border)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--text1)]">
                sinnerschrader.com
              </a>
              – TypeScript, React, Web Components
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2021:</span> synbionik.com
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">01.09.2017 - 31.12.2020:</span>
              UX-Designer / Frontend-Developer
              <a href="https://comwrap.com" class="ml-1 underline decoration-[var(--surface-border)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--text1)]">
                comwrap.com
              </a>
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2020:</span> Digital Thinking Concepts
              and Tools Workshop
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2020:</span> Adobe Experience Manager
              – Frontend Developer (HTML5/CSS3/JavaScript/Webpack)
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2020:</span> UX Design Theory Workshop
              – XDi
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2020:</span> Adobe Experience Manager
              – Core Components Workshop (HTL/Java/CSS/Webpack/JavaScript)
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2019:</span> "Wie präsentiere ich
              richtig" – Kommunikations/Körpersprache Workshop
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2019:</span> Udacity Certificate –
              React Developer (HTML5/CSS3/JavaScript/React/React
              Native/Ajax/Redux)
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2018:</span> css.conf / js.conf.eu –
              Berlin
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2018:</span> Udacity Certificate –
              Frontend Developer (HTML5/Responsive/ARIA/CSS3/JavaScript)
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2017:</span> Malvid Atomic Design
              Components Library Workshop (BEM/SCSS/Nunjucks/JavaScript ECMA6)
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2016:</span> Webdesign – Dieter Roosen
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2015:</span> Digital Operator – Frank
              Weinert
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2015:</span> Webdesign – Stefanie
              Koesling
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2014:</span> Retouching – Maggi &
              Thommy Rezept Ideen
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2014:</span> CleverPrinting
              Colormanagement Certificate
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2012:</span> Digital Operator – Dieter
              Roosen
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2011:</span> Webdesign – friedrich und
              ruppel – hauser lacour
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2011:</span> Digital Operator –
              Stefanie Koesling
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2011:</span> Digital Operator – Becker
              Lacour
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2010:</span> Digital Operator – Thomas
              Goos
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2010:</span> Kulissen Bau – Andreas
              Kopp
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2008 - 2014:</span> Fotoassistent –
              Bernd Mayer
              <a href="http://berndmayer.com" class="ml-1 underline decoration-[var(--surface-border)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--text1)]">
                berndmayer.com
              </a>
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2014:</span> Phase One – Lighting for
              Digital Cameras
            </li>
            <li class="relative">
              <span class="absolute left-[-19px] top-2 h-2 w-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
              <span class="font-semibold text-[var(--text1)]">2013:</span> Phase One – Capture One
              Digital Operator Workshop
            </li>
          </ol>

          <div class="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 class="text-2xl font-semibold tracking-tight text-[var(--text1)]">
                Education
              </h3>
              <ul class="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[var(--text2)] sm:text-base">
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
            </div>
            <div>
              <h3 class="text-2xl font-semibold tracking-tight text-[var(--text1)]">
                Exhibitions
              </h3>
              <ul class="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-[var(--text2)] sm:text-base">
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

export const head = buildHead(`About - ${siteConfig.metadata.title}`);
