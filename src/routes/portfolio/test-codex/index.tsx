import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./test-codex.scss?inline";
import { buildPortfolioHead } from "~/utils/head";
import { createMountedClientEffect } from "~/utils/browserClient";
import { setupTestCodexAnimations } from "./test-codex.client";

/* eslint-disable qwik/jsx-img */

const frames = [
  {
    number: "01",
    title: "Today",
    image: "/assets/images/photography/black/Template_index_014.jpg",
    alt: "High contrast black and white editorial frame",
    caption:
      "A structured career break focused on family responsibilities, modern frontend learning, machine learning foundations, and data visualization practice.",
  },
  {
    number: "02",
    title: "Accenture Song",
    image: "/assets/images/photography/venedig/IMG_2063.jpg",
    alt: "Soft atmospheric image with reflective light",
    caption:
      "Senior Product Engineer building scalable frontend systems with TypeScript, React, Next.js, headless CMS platforms, design systems, and accessible multi-region interfaces.",
  },
  {
    number: "03",
    title: "Sinner Schrader",
    image: "/assets/images/photography/portrait/Portrait_034.jpg",
    alt: "Portrait detail with soft cinematic contrast",
    caption:
      "Product engineering for enterprise platforms, expanding from hands-on frontend delivery into architecture, consulting, and reusable component systems.",
  },
  {
    number: "04",
    title: "Hauser Lacour",
    image: "/assets/images/photography/black/Template_index_020.jpg",
    alt: "Black and white abstract photographic scene",
    caption:
      "Creative development at the bridge between visual design and frontend engineering, translating brand concepts into high-performance digital experiences.",
  },
  {
    number: "05",
    title: "Comwrap",
    image: "/assets/images/photography/venedig/IMG_1846.jpg",
    alt: "Atmospheric city detail",
    caption:
      "UX design and frontend development for B2C, B2B, and D2C platforms across finance, fintech, pharma, healthcare, and publishing projects.",
  },
  {
    number: "06",
    title: "Education",
    image: "/assets/images/photography/portrait/Portrait_049.jpg",
    alt: "Portrait detail in soft light",
    caption:
      "Udacity nanodegrees, XDi UX certification, freeCodeCamp JavaScript and D3/data visualization work, and visual communication studies in Offenbach.",
  },
];

const principles = [
  "React, TypeScript, Next.js, Web Components, and headless CMS platforms",
  "Design systems, component libraries, accessibility, and responsive UI",
  "UX strategy, prototyping, testing, and design-to-engineering translation",
  "Agile collaboration, client advisory, workshops, and product alignment",
];

const chapters = [
  {
    label: "Product Systems",
    title: "Product surfaces built to scale.",
    copy: "At Accenture Song, Markus built scalable React and TypeScript systems, connected design systems to delivery, and kept quality, accessibility, and performance in the foreground.",
  },
  {
    label: "Architecture",
    title: "Hands-on engineering with system sense.",
    copy: "At Sinner Schrader, the work moved through enterprise frontend platforms, reusable component structures, CMS integration, and architecture decisions that could survive real delivery pressure.",
  },
  {
    label: "Translation",
    title: "Design language translated into interface code.",
    copy: "From Hauser Lacour to comwrap, the recurring thread is the same: visual intent, user journeys, typography, interaction behavior, and frontend implementation moving as one discipline.",
  },
];

const reelFrames = [
  {
    title: "React",
    image: "/assets/images/photography/black/Template_index_011.jpg",
    alt: "Black and white frame representing React frontend systems",
  },
  {
    title: "TypeScript",
    image: "/assets/images/photography/venedig/IMG_1859.jpg",
    alt: "Atmospheric frame representing typed product engineering",
  },
  {
    title: "Next.js",
    image: "/assets/images/photography/portrait/Portrait_021.jpg",
    alt: "Portrait detail representing application architecture",
  },
  {
    title: "Design Systems",
    image: "/assets/images/photography/black/Template_index_06.jpg",
    alt: "High contrast scene representing design systems",
  },
  {
    title: "Accessibility",
    image: "/assets/images/photography/venedig/IMG_1846.jpg",
    alt: "Sky and city detail representing accessibility",
  },
  {
    title: "CMS",
    image: "/assets/images/photography/portrait/Portrait_034.jpg",
    alt: "Portrait with cinematic contrast representing CMS integration",
  },
  {
    title: "D3",
    image: "/assets/images/photography/black/Template_index_020.jpg",
    alt: "Abstract black and white scene representing data visualization",
  },
];

const metrics = [
  ["08", "years product and frontend practice"],
  ["03", "core skill areas"],
  ["05", "selected certifications"],
];

const treatments = [
  {
    label: "Frontend Architecture",
    title: "Interfaces are built as systems, not isolated screens.",
    copy: "TypeScript, React, Next.js, Web Components, and CMS-backed architectures are used to make product surfaces scalable, maintainable, and ready for real teams.",
    image:
      "/assets/portfolio/test-codex/ChatGPT%20Image%2013.%20Mai%202026,%2011_52_35.png",
    alt: "Dark product engineering workspace with code, CMS, and interface preview on large monitors",
  },
  {
    label: "UX and Design Systems",
    title: "Visual fidelity stays connected to usability.",
    copy: "Wireframes, prototypes, design systems, responsive behavior, accessibility, and testing turn product ideas into interfaces that people can actually use.",
    image:
      "/assets/portfolio/test-codex/ChatGPT%20Image%2013.%20Mai%202026,%2011_52_40.png",
    alt: "Design system workspace with mobile wireframes, component controls, sketches, and tablet prototyping",
  },
  {
    label: "Product Alignment",
    title: "The bridge work is technical and human.",
    copy: "Workshops, client advisory, agile collaboration, and design-to-engineering translation keep stakeholders, designers, and developers moving toward the same product.",
    image:
      "/assets/portfolio/test-codex/ChatGPT%20Image%2013.%20Mai%202026,%2011_52_42.png",
    alt: "Product alignment workshop with team discussion, user needs, interface flow, and dashboard code",
  },
];

const motionBeats = [
  [
    "Human-Centered Product",
    "The work starts with user journeys, interaction concepts, and product behavior before it becomes implementation detail.",
  ],
  [
    "Scalable Frontend",
    "Component libraries, micro-frontends, headless CMS integrations, and typed architectures keep large interfaces coherent.",
  ],
  [
    "Design Fidelity",
    "High-fidelity designs from Figma, Adobe XD, and Sketch are translated into production-ready architecture without losing the original intent.",
  ],
  [
    "Cross-Functional Delivery",
    "UX, backend engineering, DevOps, stakeholders, and client teams are connected through clear communication and practical frontend decisions.",
  ],
  [
    "Continuous Learning",
    "Recent focus areas include machine learning foundations, algorithmic thinking, data structures, D3, and JavaScript-based visualization.",
  ],
];

const productionNotes = [
  {
    title: "Accessible UI",
    copy: "Interfaces are judged by how well they work across devices, abilities, and real product contexts, not only by how clean the first screen looks.",
  },
  {
    title: "Component systems",
    copy: "Reusable patterns, atomic design principles, and clear interface contracts make product teams faster without flattening the design.",
  },
  {
    title: "CMS integration",
    copy: "Contentful, Adobe Experience Manager, TYPO3, and frontend templating experience keep editorial systems tied to flexible interfaces.",
  },
  {
    title: "Reliable delivery",
    copy: "Quality, maintainability, performance optimization, and pragmatic collaboration turn ambitious designs into products that ship.",
  },
];

const statementText =
  "Frontend Engineer & Designer focused on human-centered products, scalable systems, turning complex ideas into intuitive digital experiences.";

const statementGroups = [
  {
    phrases: [
      { text: "Frontend Engineer" },
      { text: "& Designer", tone: "blend" },
    ],
  },
  {
    phrases: [
      { text: "focused on" },
      { text: "human-centered", tone: "cool" },
      { text: "products," },
      { text: "scalable", tone: "warm" },
      { text: "systems," },
    ],
  },
  {
    phrases: [
      { text: "turning" },
      { text: "complex ideas" },
      { text: "into" },
      { text: "intuitive", tone: "cool" },
      { text: "digital", tone: "warm" },
      { text: "experiences.", tone: "blend" },
    ],
  },
];

const finaleWords = [
  "Product,",
  "frontend,",
  "and",
  "design",
  "move",
  "together.",
];

export default component$(() => {
  const rootRef = useSignal<HTMLElement>();

  useStylesScoped$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    await createMountedClientEffect(cleanup, () => {
      const root = rootRef.value;
      return root ? setupTestCodexAnimations(root) : undefined;
    });
  });

  const title = "Markus Morley";

  return (
    <main class="test-codex" data-test-codex ref={rootRef}>
      <div class="test-codex__progress" aria-hidden="true">
        <span data-progress />
      </div>
      <div class="test-codex__spotlight" aria-hidden="true" />

      <section
        class="test-codex__hero"
        data-hero
        aria-labelledby="test-codex-title"
      >
        <div class="test-codex__backdrop" aria-hidden="true">
          <img
            src="/assets/images/photography/venedig/IMG_2094.jpg"
            class="test-codex__backdrop-image"
            alt=""
            loading="eager"
            sizes="100vw"
          />
          <div class="test-codex__iris" data-iris />
        </div>

        <nav class="test-codex__nav" aria-label="Project navigation">
          <a href="/portfolio">Portfolio</a>
          <span>CV Storytelling / GSAP / Qwik</span>
        </nav>

        <div class="test-codex__hero-grid">
          <div class="test-codex__title-wrap" data-hero-float>
            <p class="test-codex__eyebrow">Senior Product Engineer</p>
            <h1
              id="test-codex-title"
              class="test-codex__title"
              aria-label={title}
            >
              <span class="test-codex__title-line" data-title-char>
                {title}
              </span>
            </h1>
          </div>

          <div
            class="test-codex__plates"
            aria-label="Professional strengths"
            data-hero-float
          >
            {principles.map((principle, index) => (
              <div key={principle} class="test-codex__plate" data-plate>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{principle}</p>
              </div>
            ))}
          </div>
        </div>

        <div class="test-codex__signal" aria-hidden="true" data-hero-float>
          <span data-signal-line />
          <span data-signal-line />
          <span data-signal-line />
        </div>

        <div class="test-codex__kinetic" aria-hidden="true" data-hero-float>
          <span data-kinetic-word>human-centered</span>
          <span data-kinetic-word>frontend</span>
          <span data-kinetic-word>design systems</span>
        </div>
      </section>

      <section
        class="test-codex__statement"
        aria-label="Professional profile"
        data-statement
      >
        <p aria-label={statementText}>
          {statementGroups.map((group, groupIndex) => (
            <span
              class="test-codex__statement-group"
              aria-hidden="true"
              data-statement-group
              key={`statement-group-${groupIndex}`}
            >
              {group.phrases.map((phrase) => (
                <span
                  class={`test-codex__statement-phrase ${
                    phrase.tone
                      ? `test-codex__statement-phrase--${phrase.tone}`
                      : ""
                  }`}
                  data-statement-phrase
                  key={phrase.text}
                >
                  {phrase.text}
                </span>
              ))}
            </span>
          ))}
        </p>
        <div class="test-codex__statement-line" aria-hidden="true">
          <span data-statement-line />
        </div>
      </section>

      <section
        class="test-codex__chapters"
        aria-label="Career chapters"
        data-chapter-section
      >
        {chapters.map((chapter, index) => (
          <article
            class="test-codex__chapter"
            key={chapter.label}
            data-chapter-card
          >
            <span>
              {String(index + 1).padStart(2, "0")} / {chapter.label}
            </span>
            <h2>{chapter.title}</h2>
            <p>{chapter.copy}</p>
          </article>
        ))}
      </section>

      <section
        class="test-codex__visual-notes"
        aria-labelledby="test-codex-visual-notes"
      >
        <div
          class="test-codex__section-heading test-codex__section-heading--visual"
          data-chapter
        >
          <p class="test-codex__eyebrow">Visual treatment</p>
          <h2 id="test-codex-visual-notes">
            Three modes, one product practice.
          </h2>
        </div>
        <div class="test-codex__visual-grid">
          {treatments.map((treatment, index) => (
            <article
              class="test-codex__visual-card"
              key={treatment.label}
              data-chapter
              data-micro-card
            >
              <figure>
                <img
                  src={treatment.image}
                  alt={treatment.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </figure>
              <div>
                <span>
                  {String(index + 1).padStart(2, "0")} / {treatment.label}
                </span>
                <h3>{treatment.title}</h3>
                <p>{treatment.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section class="test-codex__marquee" aria-label="Professional language">
        <div data-marquee>
          product engineering / frontend architecture / design systems / UX
          strategy
        </div>
        <div data-marquee>
          accessibility / responsive UI / CMS integration / data visualization
        </div>
      </section>

      <section class="test-codex__floating" aria-label="Photographic fragments">
        <figure
          class="test-codex__float test-codex__float--left"
          data-floating-image
        >
          <img
            src="/assets/images/photography/black/Template_index_018.jpg"
            alt="Black and white photographic fragment"
          />
        </figure>
        <figure
          class="test-codex__float test-codex__float--right"
          data-floating-image
        >
          <img
            src="/assets/images/photography/portrait/Portrait_049.jpg"
            alt="Portrait detail in soft light"
          />
        </figure>
      </section>

      <section
        class="test-codex__reel-section"
        data-reel-section
        aria-labelledby="test-codex-reel"
      >
        <div class="test-codex__reel-copy">
          <p class="test-codex__eyebrow">Pinned passage</p>
          <h2 id="test-codex-reel">
            The skill set moves as a slow contact sheet of product craft.
          </h2>
        </div>
        <div class="test-codex__reel-viewport">
          <div class="test-codex__reel-track" data-reel-track>
            {reelFrames.map((frame, index) => (
              <figure
                class="test-codex__reel-card"
                key={frame.title}
                data-micro-card
              >
                <img
                  src={frame.image}
                  alt={frame.alt}
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {frame.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        class="test-codex__motion-board"
        aria-labelledby="test-codex-motion-board"
      >
        <div class="test-codex__section-heading" data-chapter>
          <p class="test-codex__eyebrow">Motion score</p>
          <h2 id="test-codex-motion-board">
            The career reads as a sequence of product and delivery beats.
          </h2>
        </div>
        <div class="test-codex__beat-list">
          {motionBeats.map(([label, copy], index) => (
            <article class="test-codex__beat" key={label} data-chapter>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{label}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="test-codex__frames" aria-label="Animated career frames">
        {frames.map((frame, index) => (
          <article
            key={frame.number}
            class={`test-codex__frame ${index % 2 === 1 ? "test-codex__frame--reverse" : ""}`}
            data-frame-row
          >
            <div class="test-codex__frame-media" data-micro-card>
              <img
                src={frame.image}
                alt={frame.alt}
                width={1200}
                height={1500}
                data-frame-image
              />
            </div>
            <div class="test-codex__frame-copy">
              <span data-frame-copy>{frame.number}</span>
              <h2 data-frame-copy>{frame.title}</h2>
              <p data-frame-copy>{frame.caption}</p>
            </div>
          </article>
        ))}
      </section>

      <section
        class="test-codex__production"
        aria-labelledby="test-codex-production"
      >
        <div class="test-codex__section-heading" data-chapter>
          <p class="test-codex__eyebrow">Production notes</p>
          <h2 id="test-codex-production">
            A motion-heavy page still needs a disciplined build system.
          </h2>
        </div>
        <div class="test-codex__production-grid">
          {productionNotes.map((note, index) => (
            <article
              class="test-codex__production-card"
              key={note.title}
              data-chapter
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{note.title}</h3>
              <p>{note.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="test-codex__metrics" aria-label="Professional metrics">
        {metrics.map(([value, label]) => (
          <div class="test-codex__metric" key={label} data-chapter>
            <strong data-metric-value data-metric-target={value}>
              {value}
            </strong>
            <span data-metric-label>{label}</span>
          </div>
        ))}
      </section>

      <section
        class="test-codex__finale"
        aria-labelledby="test-codex-finale"
        data-finale
      >
        <div class="test-codex__finale-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p class="test-codex__eyebrow" data-finale-kicker>
          Prototype note
        </p>
        <h2
          id="test-codex-finale"
          data-finale-title
          aria-label="Product, frontend, and design move together."
        >
          {finaleWords.map((word) => (
            <span class="test-codex__finale-word-mask" key={word}>
              <span data-finale-word>{word}</span>
            </span>
          ))}
        </h2>
        <p data-finale-copy>
          Markus bridges product engineering, frontend architecture, and design
          practice so teams can move from intent to interface without losing
          clarity, quality, or the human reason for building.
        </p>
      </section>
    </main>
  );
});

export const head = buildPortfolioHead("/portfolio/test-codex");
