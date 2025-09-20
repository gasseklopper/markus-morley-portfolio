import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

interface WorkItem {
  title: string;
  description: string;
}

const workItems: WorkItem[] = [
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
      <section class="relative h-72 w-full overflow-hidden rounded-b-xl">
        <img
          src="/assets/images/heros/image.png"
          alt="Applicant"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-tr from-[var(--surface1)] via-[var(--surface2)] to-transparent" />
        <div class="absolute bottom-6 left-6">
          <h1 class="text-4xl font-bold text-[var(--text1)]">About</h1>
          <p class="mt-2 max-w-xl text-sm text-[var(--text2)]">
            This page gives information about the site.
          </p>
        </div>
      </section>

      <div class="mx-auto max-w-5xl px-4 py-16">
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

        {/* What I Do */}
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-[var(--text1)]">What I Do</h2>
          <div class="mt-8 grid gap-8 sm:grid-cols-2">
            {workItems.map((item) => (
              <div
                key={item.title}
                class="rounded-lg bg-[var(--surface2)] p-6 shadow transition hover:bg-[var(--surface3)]"
              >
                <h3 class="text-xl font-semibold text-[var(--text1)]">
                  {item.title}
                </h3>
                <p class="mt-2 text-[var(--text2)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Stack */}
        <section class="mt-16">
          <h2 class="text-3xl font-bold text-[var(--text1)]">Tool Stack</h2>
          <p class="mt-4 text-[var(--text2)]">
            A curated set of tools, frameworks, and platforms I rely on to
            design, build, and refine digital products.
          </p>
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
