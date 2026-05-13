import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./oststern.scss?inline";
import { buildPortfolioHead } from "~/utils/head";
import { createMountedClientEffect } from "~/utils/browserClient";
import { setupOststernAnimations } from "./oststern.client";

/* eslint-disable qwik/jsx-img */

const liveUrl = "https://oststern.netlify.app/ost_121";

const metaItems = [
  ["Client context", "OstStern 121"],
  ["Project type", "Real-estate microsite"],
  ["Role frame", "Concept, frontend, motion"],
  ["Output", "Responsive live page"],
];

const processSteps = [
  {
    number: "01",
    title: "Planning",
    copy: "Define the page as a focused leasing story: the building, the location, the facts, and the path toward contact all need to be visible without making the experience feel administrative.",
  },
  {
    number: "02",
    title: "Design Thinking",
    copy: "Translate a commercial real-estate offer into an experience that feels clear, premium, and easy to scan for decision makers comparing spaces.",
  },
  {
    number: "03",
    title: "Customer Integration",
    copy: "Keep the customer perspective close to the interface: location advantages, workplace quality, architecture, floor plans, equipment, and contact routes stay in a practical order.",
  },
  {
    number: "04",
    title: "Information Architecture",
    copy: "Structure the microsite around discoverable chapters so visitors can move from atmosphere to concrete facts without losing orientation.",
  },
  {
    number: "05",
    title: "Visual Direction",
    copy: "Use a restrained editorial system with large imagery, direct typographic hierarchy, and strong contrast to make Ostend and the building feel tangible.",
  },
  {
    number: "06",
    title: "Interaction & Motion",
    copy: "Support the page rhythm with motion that clarifies transitions, gives the visual material weight, and keeps long content sections from feeling flat.",
  },
  {
    number: "07",
    title: "Frontend Architecture",
    copy: "Break the experience into robust sections, reusable visual patterns, asset-led layouts, and animation hooks that stay manageable during iteration.",
  },
  {
    number: "08",
    title: "Responsive Experience",
    copy: "Preserve the hierarchy across desktop, tablet, and mobile so maps, tabs, plans, and image sequences remain usable on smaller screens.",
  },
  {
    number: "09",
    title: "QA & Performance",
    copy: "Balance rich imagery with predictable loading behavior, stable layouts, accessible links, and reduced-motion support.",
  },
  {
    number: "10",
    title: "Deployment",
    copy: "Ship the finished microsite as a Netlify-hosted page with direct access to the live customer-facing experience.",
  },
];

const visualMoments = [
  {
    label: "Hero",
    title: "Modernes Arbeiten im Oststern",
    image: "/assets/portfolio/oststern/preview.jpg",
    alt: "Oststern 121 hero image",
  },
  {
    label: "Architecture",
    title: "Ausdrucksstarke Architektur",
    image: "/assets/portfolio/oststern/architecture-1.jpg",
    alt: "Oststern building architecture",
  },
  {
    label: "Workplace",
    title: "Ausstattung and modern workspaces",
    image: "/assets/portfolio/oststern/workspace.jpg",
    alt: "Oststern lobby workspace",
  },
  {
    label: "Planning",
    title: "Planung und Fakten",
    image: "/assets/portfolio/oststern/floorplan.jpg",
    alt: "Oststern floor plan",
  },
];

const deliveryNotes = [
  ["Live Site", "The case study links directly to the deployed Oststern 121 page."],
  ["Motion System", "Scroll-triggered reveals, progress, pinned passage, and parallax are handled client-side."],
  ["Responsive UI", "Desktop gets a cinematic reel; compact screens keep the content scrollable and calm."],
];

export default component$(() => {
  const rootRef = useSignal<HTMLElement>();

  useStylesScoped$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    await createMountedClientEffect(cleanup, () => {
      const root = rootRef.value;
      return root ? setupOststernAnimations(root) : undefined;
    });
  });

  return (
    <main class="oststern" data-oststern ref={rootRef}>
      <div class="oststern__progress" aria-hidden="true">
        <span data-progress />
      </div>

      <section class="oststern__hero" data-hero aria-labelledby="oststern-title">
        <div class="oststern__hero-media" aria-hidden="true">
          <img
            src="/assets/portfolio/oststern/preview.jpg"
            alt=""
            loading="eager"
            sizes="100vw"
          />
        </div>
        <nav class="oststern__nav" aria-label="Project navigation">
          <a href="/portfolio">Portfolio</a>
          <a href={liveUrl} target="_blank" rel="noreferrer">
            Live site
          </a>
        </nav>
        <div class="oststern__hero-content">
          <p class="oststern__eyebrow" data-hero-line>
            Case study / OstStern 121
          </p>
          <h1 id="oststern-title" data-hero-title>
            Modernes Arbeiten im Oststern
          </h1>
          <p data-hero-line>
            A process-led portfolio presentation for a responsive real-estate
            microsite: planning, design thinking, customer integration, motion,
            frontend delivery, and deployment.
          </p>
          <div class="oststern__hero-actions" data-hero-line>
            <a href={liveUrl} target="_blank" rel="noreferrer">
              Open live project
            </a>
            <a href="#process">View process</a>
          </div>
        </div>
        <div class="oststern__meta" aria-label="Project facts">
          {metaItems.map(([label, value]) => (
            <div class="oststern__meta-item" key={label} data-meta-item>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section class="oststern__intro" aria-label="Project positioning">
        <p data-reveal>
          OstStern 121 is presented as a clean commercial experience where
          location, architecture, planning facts, and contact moments work as
          one guided story.
        </p>
      </section>

      <section
        class="oststern__process"
        id="process"
        aria-labelledby="oststern-process"
      >
        <div class="oststern__section-heading" data-reveal>
          <p class="oststern__eyebrow">Process map</p>
          <h2 id="oststern-process">From project intent to deployed page.</h2>
        </div>
        <div class="oststern__timeline">
          {processSteps.map((step) => (
            <article class="oststern__step" key={step.number} data-step>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        class="oststern__showcase"
        data-showcase
        aria-labelledby="oststern-showcase"
      >
        <div class="oststern__showcase-copy" data-reveal>
          <p class="oststern__eyebrow">Page moments</p>
          <h2 id="oststern-showcase">
            Real project visuals, staged as a slow editorial reel.
          </h2>
        </div>
        <div class="oststern__reel-viewport">
          <div class="oststern__reel-track" data-reel-track>
            {visualMoments.map((moment, index) => (
              <figure class="oststern__device" key={moment.label} data-device>
                <img
                  src={moment.image}
                  alt={moment.alt}
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <figcaption>
                  <span>{moment.label}</span>
                  {moment.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section class="oststern__split" aria-labelledby="oststern-customer">
        <div class="oststern__split-copy" data-reveal>
          <p class="oststern__eyebrow">Customer integration</p>
          <h2 id="oststern-customer">
            The page keeps business needs and user questions in the same frame.
          </h2>
          <p>
            Leasing pages need atmosphere, but they also need evidence. The
            Oststern flow brings together urban context, commute information,
            image-led proof points, floor plans, key facts, equipment, and
            contact paths.
          </p>
        </div>
        <figure class="oststern__map" data-parallax>
          <img
            src="/assets/portfolio/oststern/location-map.jpg"
            alt="Map showing the Oststern location in Frankfurt"
            loading="lazy"
          />
        </figure>
      </section>

      <section class="oststern__delivery" aria-labelledby="oststern-delivery">
        <div class="oststern__section-heading" data-reveal>
          <p class="oststern__eyebrow">Delivery notes</p>
          <h2 id="oststern-delivery">Motion only works when the basics hold.</h2>
        </div>
        <div class="oststern__delivery-grid">
          {deliveryNotes.map(([title, copy], index) => (
            <article class="oststern__delivery-card" key={title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="oststern__finale" data-finale aria-labelledby="oststern-finale">
        <p class="oststern__eyebrow" data-finale-item>
          Deployment
        </p>
        <h2 id="oststern-finale" data-finale-item>
          A live, responsive case study with the client page one click away.
        </h2>
        <div class="oststern__finale-actions" data-finale-item>
          <a href={liveUrl} target="_blank" rel="noreferrer">
            Visit OstStern 121
          </a>
          <a href="/portfolio">Back to portfolio</a>
        </div>
      </section>
    </main>
  );
});

export const head = buildPortfolioHead("/portfolio/oststern");
