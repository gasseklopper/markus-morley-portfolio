import {
  component$,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./test-codex.scss?inline";
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head";
import { setupTestCodexAnimations } from "./test-codex.client";

/* eslint-disable qwik/jsx-img */

const frames = [
  {
    number: "01",
    title: "The Waiting Room",
    image: "/assets/images/photography/black/Template_index_014.jpg",
    alt: "High contrast black and white editorial portrait",
    caption: "A quiet threshold where light behaves like a clue.",
  },
  {
    number: "02",
    title: "Blue Wind",
    image: "/assets/images/photography/venedig/IMG_2063.jpg",
    alt: "Soft atmospheric Venice photograph with reflective light",
    caption: "Slow parallax, floating detail, and animation with breath.",
  },
  {
    number: "03",
    title: "Velvet Signal",
    image: "/assets/images/photography/portrait/Portrait_034.jpg",
    alt: "Portrait photograph with soft cinematic contrast",
    caption: "A portrait study that turns hover into a tiny edit suite.",
  },
  {
    number: "04",
    title: "Paper Moon",
    image: "/assets/images/photography/black/Template_index_020.jpg",
    alt: "Black and white abstract photographic scene",
    caption:
      "A masked frame sequence with soft acceleration and a held final beat.",
  },
  {
    number: "05",
    title: "Lantern Drift",
    image: "/assets/images/photography/venedig/IMG_1846.jpg",
    alt: "Atmospheric Venice sky and city detail",
    caption:
      "A color pass where the photograph stays still but the interface feels weathered by light.",
  },
  {
    number: "06",
    title: "Afterimage",
    image: "/assets/images/photography/portrait/Portrait_049.jpg",
    alt: "Portrait detail in soft light",
    caption:
      "A closing portrait beat built around restraint, delayed focus, and a soft tactile hover.",
  },
];

const principles = [
  "Pinned scenes, directional scroll, and elastic micro feedback",
  "Qwik visible task hydration for client-only GSAP timelines",
  "Photographic layers, soft holds, tactile reveals, and editorial pacing",
  "Reduced-motion fallback with the composition intact",
];

const chapters = [
  {
    label: "Atmosphere",
    title: "A nocturne for images, tempo, and negative space.",
    copy: "The page opens like a title card: quiet, wide, and slightly uncanny. The motion waits, then arrives with a deliberate cut.",
  },
  {
    label: "Gesture",
    title: "Micro animations act like a camera assistant.",
    copy: "Cards tilt with restraint, images drift against scroll, and every reveal has a small anticipation before it settles.",
  },
  {
    label: "System",
    title: "The implementation stays resumable until the scene is visible.",
    copy: "Qwik renders the editorial shell first. GSAP is loaded on visibility, then ScrollTrigger takes over the cinematic layer.",
  },
];

const reelFrames = [
  {
    title: "Fog Cut",
    image: "/assets/images/photography/black/Template_index_011.jpg",
    alt: "Black and white photographic frame with strong contrast",
  },
  {
    title: "Quiet Lake",
    image: "/assets/images/photography/venedig/IMG_1859.jpg",
    alt: "Atmospheric Venice photograph",
  },
  {
    title: "Soft Eye",
    image: "/assets/images/photography/portrait/Portrait_021.jpg",
    alt: "Soft portrait detail",
  },
  {
    title: "Red Room",
    image: "/assets/images/photography/black/Template_index_06.jpg",
    alt: "High contrast black and white scene",
  },
  {
    title: "Sky Breath",
    image: "/assets/images/photography/venedig/IMG_1846.jpg",
    alt: "Venice sky and city detail",
  },
  {
    title: "Signal Face",
    image: "/assets/images/photography/portrait/Portrait_034.jpg",
    alt: "Portrait with cinematic contrast",
  },
  {
    title: "Black Pool",
    image: "/assets/images/photography/black/Template_index_020.jpg",
    alt: "Abstract black and white photographic scene",
  },
];

const metrics = [
  ["13", "scroll-linked scenes"],
  ["64", "masked image beats"],
  ["07", "responsive breakpoints"],
];

const treatments = [
  {
    label: "Art Direction",
    title: "The image is treated like a room, not a thumbnail.",
    copy: "Every crop has an entrance, an exit, and a held silence. The design lets texture, blur, and contrast carry as much narrative weight as the text.",
    image: "/assets/images/photography/black/Template_index_018.jpg",
    alt: "Black and white photographic texture study",
  },
  {
    label: "Interaction",
    title: "Pointer motion becomes a small lens test.",
    copy: "Hover does not shout. It bends the frame, breathes the image forward, and then releases with an elastic return that feels physical.",
    image: "/assets/images/photography/portrait/Portrait_021.jpg",
    alt: "Soft portrait detail with shallow focus",
  },
  {
    label: "Scroll Edit",
    title: "ScrollTrigger is used like an edit decision list.",
    copy: "Pinned contact sheets, parallax fragments, and masked image reveals are sequenced as scenes instead of isolated tricks.",
    image: "/assets/images/photography/venedig/IMG_1859.jpg",
    alt: "Atmospheric Venice photograph with water and city light",
  },
];

const motionBeats = [
  [
    "Opening Hold",
    "The hero waits long enough to feel composed before the title rises into frame.",
  ],
  [
    "Mask Reveal",
    "Images uncover from the center with a small contrast shift, like a print arriving in developer.",
  ],
  [
    "Pinned Contact",
    "The horizontal reel turns scrolling into a slow editorial inspection pass.",
  ],
  [
    "Micro Return",
    "Cards always return home with a soft spring so interaction feels handmade.",
  ],
  [
    "Reduced Motion",
    "The composition remains readable when motion is reduced; animation enhances, it does not carry meaning alone.",
  ],
];

const productionNotes = [
  {
    title: "Qwik shell",
    copy: "The markup stays useful before hydration. GSAP enters only when the project is visible, keeping the route direct and resilient.",
  },
  {
    title: "Scoped motion layer",
    copy: "All selectors are rooted in the page container, so timelines stay local to the project and cleanup remains predictable.",
  },
  {
    title: "Responsive pacing",
    copy: "Pinned desktop passages become native scrolling on compact screens, keeping the rhythm without trapping the viewport.",
  },
  {
    title: "Photographic system",
    copy: "Portrait, black-and-white, and Venice frames are mixed as a visual score: heavy contrast, air, interruption, release.",
  },
];

const finaleWords = [
  "Motion",
  "should",
  "feel",
  "edited,",
  "not",
  "decorated.",
];

export default component$(() => {
  useStylesScoped$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const lifecycle = {
      disposed: false,
      dispose: undefined as (() => void) | undefined,
    };

    cleanup(() => {
      lifecycle.disposed = true;
      lifecycle.dispose?.();
    });

    lifecycle.dispose = await setupTestCodexAnimations();
    if (lifecycle.disposed) lifecycle.dispose();
  });

  const title = "test-codex";

  return (
    <main class="test-codex" data-test-codex>
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
          <span>GSAP / ScrollTrigger / Qwik</span>
        </nav>

        <div class="test-codex__hero-grid">
          <div class="test-codex__title-wrap" data-hero-float>
            <p class="test-codex__eyebrow">Motion art direction study</p>
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
            aria-label="Motion notes"
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
          <span data-kinetic-word>surreal</span>
          <span data-kinetic-word>photographic</span>
          <span data-kinetic-word>resumable</span>
        </div>
      </section>

      <section class="test-codex__statement" aria-label="Creative direction">
        <p>
          A photographic motion page built as a small modern art object: surreal
          contrast, soft environmental drift, and frame-by-frame pacing
          translated into scroll.
        </p>
      </section>

      <section class="test-codex__chapters" aria-label="Design chapters">
        {chapters.map((chapter, index) => (
          <article class="test-codex__chapter" key={chapter.label} data-chapter>
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
        <div class="test-codex__section-heading" data-chapter>
          <p class="test-codex__eyebrow">Visual treatment</p>
          <h2 id="test-codex-visual-notes">
            Three image rules keep the piece cinematic.
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

      <section class="test-codex__marquee" aria-label="Motion language">
        <div data-marquee>
          photography as interface / scroll as edit / motion as atmosphere
        </div>
        <div data-marquee>
          masked reveals / pinned passages / tactile hover / cinematic restraint
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
            The page becomes a slow moving contact sheet.
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
            The interaction system is written as a sequence of beats.
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

      <section
        class="test-codex__frames"
        aria-label="Animated photographic frames"
      >
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

      <section class="test-codex__metrics" aria-label="Motion system metrics">
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
          aria-label="Motion should feel edited, not decorated."
        >
          {finaleWords.map((word) => (
            <span class="test-codex__finale-word-mask" key={word}>
              <span data-finale-word>{word}</span>
            </span>
          ))}
        </h2>
        <p data-finale-copy>
          The piece keeps the Qwik page static until visible, then lets GSAP own
          the timeline: title assembly, masked image reveals, scroll-linked
          parallax, and small pointer-responsive image cards.
        </p>
      </section>
    </main>
  );
});

export const head = buildHead(
  `test-codex - ${siteMetadata.title}`,
  "A GSAP and ScrollTrigger powered photographic motion portfolio study built in Qwik.",
);
