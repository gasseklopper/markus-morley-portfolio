import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./swissport.scss?inline";
import { buildPortfolioHead } from "~/utils/head";
import { createMountedClientEffect } from "~/utils/browserClient";
import { setupSwissportAnimations } from "./swissport.client";

/* eslint-disable qwik/jsx-img */

const liveUrl = "https://www.swissport.com/en";

const metaItems = [
  ["Client context", "Swissport.com"],
  ["Project type", "Global corporate platform"],
  ["Focus", "Editorial UX, maps, motion"],
  ["Output", "Portfolio case study"],
];

const processSections = [
  {
    number: "01",
    id: "planning",
    eyebrow: "Planning",
    title: "Turning a global aviation platform into a guided story.",
    copy: "The planning frame starts with a broad homepage: corporate navigation, aviation services, global network discovery, customer self-service, media releases, customer trust, and careers. The portfolio page presents that scope as a clear project narrative instead of a flat page recap.",
    detail: "Homepage scope / stakeholder goals / service discovery",
  },
  {
    number: "02",
    id: "design-thinking",
    eyebrow: "Design Thinking",
    title: "Make complex B2B content feel direct, not heavy.",
    copy: "The editorial structure favors scan rhythm: short labels, strong section contrast, visible proof points, and large visual crops. The goal is to help decision makers move from brand confidence to service understanding without digging through every menu branch.",
    detail: "Hierarchy / scannability / decision support",
  },
  {
    number: "03",
    id: "customer-integration",
    eyebrow: "Customer Integration",
    title: "Service routes stay close to the customer task.",
    copy: "Customer login, cargo tracking, contact paths, service filters, and local network discovery are treated as practical business moments. The showcase keeps these conversion and support paths visible inside the same narrative as the brand story.",
    detail: "Customer login / cargo locator / contact paths",
  },
  {
    number: "04",
    id: "design-system",
    eyebrow: "Design System",
    title: "A restrained interface language with aviation signal.",
    copy: "The visual system borrows the clarity of Swissport's public presence without copying it: white space, black typography, confident red signal lines, dense content modules, and reusable editorial patterns for screenshots, data, and process text.",
    detail: "Type scale / red signal / reusable modules",
  },
  {
    number: "05",
    id: "maps",
    eyebrow: "Google Maps Custom Integration",
    title: "A clustered network view for airports, services, and contacts.",
    copy: "The map section presents the intended integration shape: clustered airport markers, region scanning, service filters, and local contact entry points. Without production keys or internal datasets, this portfolio version uses a designed map model that communicates the interaction system.",
    detail: "Cluster markers / service filters / regional drilldown",
  },
  {
    number: "06",
    id: "services",
    eyebrow: "Services Architecture",
    title:
      "Ground operations, cargo, hospitality, and hub handling stay legible.",
    copy: "The service model is grouped into clear families so a visitor can understand Swissport's single-source portfolio quickly. The page separates primary services from detailed capability areas, then uses motion to reveal structure without making it feel mechanical.",
    detail: "Service families / navigation model / content grouping",
  },
  {
    number: "07",
    id: "network",
    eyebrow: "Global Network",
    title: "Six continents and 312 airports become a navigable experience.",
    copy: "The live homepage positions Swissport's global network as a core proof point. In the case study, the network section becomes a pinned editorial moment with route lines, regional clusters, and a slow horizontal reel of captured page states.",
    detail: "312 airports / six continents / local discovery",
  },
  {
    number: "08",
    id: "motion",
    eyebrow: "Motion & GSAP",
    title:
      "Motion supports orientation instead of performing over the content.",
    copy: "The animation system uses scroll progress, measured reveals, pinned passages, screenshot parallax, clustered map activation, and desktop-only horizontal movement. Compact viewports keep the same content available without forcing pinned interactions.",
    detail: "ScrollTrigger / pinned reel / reduced motion",
  },
  {
    number: "09",
    id: "quality",
    eyebrow: "QA, Accessibility & Performance",
    title: "A rich page still has to be stable, readable, and respectful.",
    copy: "The build keeps headings semantic, links explicit, image dimensions stable, and reduced-motion handling in place. The visual layout is designed to avoid overlapping text on mobile while preserving the dense editorial feel on desktop.",
    detail: "Responsive QA / alt text / reduced motion",
  },
  {
    number: "10",
    id: "deployment",
    eyebrow: "Deployment",
    title: "Portfolio registration turns the case study into a shipped page.",
    copy: "The final route is added to the portfolio registry, navigation, sitemap flow, and SEO head helper through the existing configuration pattern. The live Swissport source stays one click away in the page navigation and finale.",
    detail: "Qwik route / portfolio config / live source CTA",
  },
];

const screenshots = [
  {
    label: "Homepage",
    title: "Corporate entry point",
    image: "/assets/portfolio/swissport/preview.jpg",
    alt: "Swissport homepage captured for the portfolio case study",
  },
  {
    label: "Services",
    title: "Supporting global aviation",
    image: "/assets/portfolio/swissport/services.jpg",
    alt: "Swissport services section captured for the portfolio case study",
  },
  {
    label: "Network",
    title: "Navigate our world",
    image: "/assets/portfolio/swissport/network.jpg",
    alt: "Swissport network section captured for the portfolio case study",
  },
  {
    label: "Customers",
    title: "Trust and self-service",
    image: "/assets/portfolio/swissport/customers.jpg",
    alt: "Swissport customer and cargo locator area captured for the portfolio case study",
  },
];

const serviceFamilies = [
  [
    "Airport Ground Operations",
    "Passenger services, ramp handling, fueling, and baggage flows.",
  ],
  [
    "Air Cargo Handling",
    "General cargo, pharma centers, perishables, express, and e-commerce.",
  ],
  [
    "Airport Hospitality",
    "Lounge hospitality and executive aviation with customer-facing polish.",
  ],
  [
    "Hub Handling",
    "A network layer that ties regional airport operations into one service story.",
  ],
];

const mapNodes = [
  ["Europe", "72%", "32%", "90"],
  ["US and Canada", "24%", "38%", "48"],
  ["Latin America", "34%", "66%", "36"],
  ["Africa", "58%", "63%", "28"],
  ["Middle East", "66%", "48%", "34"],
  ["Asia", "79%", "43%", "58"],
  ["Australia", "85%", "72%", "18"],
];

export default component$(() => {
  const rootRef = useSignal<HTMLElement>();

  useStylesScoped$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    await createMountedClientEffect(cleanup, () => {
      const root = rootRef.value;
      return root ? setupSwissportAnimations(root) : undefined;
    });
  });

  return (
    <main class="swissport" data-swissport ref={rootRef}>
      <div class="swissport__progress" aria-hidden="true">
        <span data-progress />
      </div>

      <section
        class="swissport__hero"
        data-hero
        aria-labelledby="swissport-title"
      >
        <div class="swissport__hero-media" aria-hidden="true">
          <img
            src="/assets/portfolio/swissport/preview.jpg"
            alt=""
            loading="eager"
            sizes="100vw"
          />
        </div>
        <nav class="swissport__nav" aria-label="Project navigation">
          <a href="/portfolio">Portfolio</a>
          <a href={liveUrl} target="_blank" rel="noreferrer">
            Swissport.com
          </a>
        </nav>
        <div class="swissport__hero-content">
          <p class="swissport__eyebrow" data-hero-line>
            Case study / Swissport.com
          </p>
          <h1 id="swissport-title" data-hero-title>
            Global aviation, edited for clarity.
          </h1>
          <p data-hero-line>
            An editorial portfolio presentation for Swissport's public website:
            planning, design thinking, customer integration, design system,
            clustered map thinking, GSAP motion, QA, and deployment.
          </p>
          <div class="swissport__hero-actions" data-hero-line>
            <a href="#planning">View process</a>
            <a href={liveUrl} target="_blank" rel="noreferrer">
              Open live site
            </a>
          </div>
        </div>
        <div class="swissport__meta" aria-label="Project facts">
          {metaItems.map(([label, value]) => (
            <div class="swissport__meta-item" key={label} data-meta-item>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section class="swissport__intro" aria-label="Project positioning">
        <p data-reveal>
          A corporate homepage becomes a motion-led case study about service
          architecture, customer routes, and global network discovery.
        </p>
      </section>

      <section class="swissport__process" aria-labelledby="swissport-process">
        <div class="swissport__section-heading" data-reveal>
          <p class="swissport__eyebrow">Ten-section process</p>
          <h2 id="swissport-process">From planning to deployment.</h2>
        </div>
        <div class="swissport__process-grid">
          {processSections.map((section) => (
            <article
              class="swissport__process-card"
              id={section.id}
              key={section.number}
              data-section
            >
              <span class="swissport__number" data-number>
                {section.number}
              </span>
              <p class="swissport__eyebrow">{section.eyebrow}</p>
              <h3>{section.title}</h3>
              <p>{section.copy}</p>
              <strong>{section.detail}</strong>
            </article>
          ))}
        </div>
      </section>

      <section
        class="swissport__split swissport__split--customer"
        aria-labelledby="swissport-customer"
      >
        <div class="swissport__split-copy" data-reveal>
          <p class="swissport__eyebrow">Customer integration</p>
          <h2 id="swissport-customer">
            Business tasks remain visible inside the brand experience.
          </h2>
          <p>
            The page treats customer login, lost and found, cargo tracking,
            service filtering, and local network contact as first-class product
            flows. They are not afterthought links; they are the operational
            reasons the website exists.
          </p>
        </div>
        <figure class="swissport__screen" data-screenshot>
          <img
            src="/assets/portfolio/swissport/customers.jpg"
            alt="Swissport customer logos and cargo locator screenshot"
            loading="lazy"
          />
        </figure>
      </section>

      <section
        class="swissport__map-section"
        data-map-section
        aria-labelledby="swissport-map"
      >
        <div
          class="swissport__section-heading swissport__section-heading--dark"
          data-reveal
        >
          <p class="swissport__eyebrow">Google Maps custom integration</p>
          <h2 id="swissport-map">
            A designed cluster model for a global network.
          </h2>
        </div>
        <div
          class="swissport__map-board"
          aria-label="Clustered airport network concept"
        >
          <span
            class="swissport__route swissport__route--one"
            data-route-line
          />
          <span
            class="swissport__route swissport__route--two"
            data-route-line
          />
          <span
            class="swissport__route swissport__route--three"
            data-route-line
          />
          {mapNodes.map(([label, x, y, count]) => (
            <div
              class="swissport__map-node"
              key={label}
              style={{ left: x, top: y }}
              data-map-node
            >
              <strong>{count}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section class="swissport__services" aria-labelledby="swissport-services">
        <div class="swissport__section-heading" data-reveal>
          <p class="swissport__eyebrow">Services architecture</p>
          <h2 id="swissport-services">
            The service portfolio is broad, so the UI groups it.
          </h2>
        </div>
        <div class="swissport__service-grid">
          {serviceFamilies.map(([title, copy], index) => (
            <article class="swissport__service-card" key={title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        class="swissport__reel-section"
        data-reel-section
        aria-labelledby="swissport-reel"
      >
        <div class="swissport__reel-copy" data-reveal>
          <p class="swissport__eyebrow">Captured page moments</p>
          <h2 id="swissport-reel">
            The live page becomes a slow editorial contact sheet.
          </h2>
        </div>
        <div class="swissport__reel-viewport">
          <div class="swissport__reel-track" data-reel-track>
            {screenshots.map((screen, index) => (
              <figure
                class="swissport__reel-card"
                key={screen.label}
                data-screenshot
              >
                <img
                  src={screen.image}
                  alt={screen.alt}
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <figcaption>
                  <span>{screen.label}</span>
                  {screen.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section class="swissport__quality" aria-labelledby="swissport-quality">
        <div class="swissport__quality-copy" data-reveal>
          <p class="swissport__eyebrow">QA, accessibility and performance</p>
          <h2 id="swissport-quality">Motion-heavy does not mean fragile.</h2>
          <p>
            The implementation keeps its GSAP setup client-only, offers a
            reduced-motion exit, uses semantic sections and headings, loads
            screenshots predictably, and lets compact screens scroll naturally.
          </p>
        </div>
        <div class="swissport__quality-list">
          {[
            "Reduced motion",
            "Responsive reel fallback",
            "Stable image frames",
            "Explicit live-site CTAs",
          ].map((item, index) => (
            <div class="swissport__quality-item" key={item} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section
        class="swissport__finale"
        data-finale
        aria-labelledby="swissport-finale"
      >
        <p class="swissport__eyebrow" data-finale-item>
          Deployment
        </p>
        <h2 id="swissport-finale" data-finale-item>
          A shipped portfolio page with the live Swissport source in reach.
        </h2>
        <p data-finale-item>
          The case study is registered in the portfolio config, appears in the
          route-derived sitemap and navigation flow, and closes with a direct
          path back to the source website.
        </p>
        <div class="swissport__finale-actions" data-finale-item>
          <a href={liveUrl} target="_blank" rel="noreferrer">
            Visit Swissport.com
          </a>
          <a href="/portfolio">Back to portfolio</a>
        </div>
      </section>
    </main>
  );
});

export const head = buildPortfolioHead("/portfolio/swissport");
