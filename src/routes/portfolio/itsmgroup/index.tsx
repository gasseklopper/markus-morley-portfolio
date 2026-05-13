import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./itsmgroup.scss?inline";
import { buildPortfolioHead } from "~/utils/head";
import { createMountedClientEffect } from "~/utils/browserClient";
import { setupItsmgroupAnimations } from "./itsmgroup.client";

const liveUrl = "https://www.itsmgroup.com/";

const metaItems = [
  ["Source", "itsmgroup.com"],
  ["Focus", "Service management"],
  ["Format", "Motion case study"],
  ["Output", "Portfolio page"],
];

const processSections = [
  {
    number: "01",
    eyebrow: "Planning",
    title: "A broad consulting website becomes a focused project story.",
    copy: "The source site spans focus topics, ServiceNow, trainings, knowledge, company content, and customer contact routes. The portfolio page turns that range into a controlled narrative with clear milestones.",
    detail: "Scope mapping / content inventory / route planning",
  },
  {
    number: "02",
    eyebrow: "Design Thinking",
    title: "Complex B2B offerings need fast orientation.",
    copy: "The presentation treats every section as a decision aid: what problem is solved, who benefits, where the user can go next, and how the brand promise becomes interface behavior.",
    detail: "Problem framing / user tasks / evidence hierarchy",
  },
  {
    number: "03",
    eyebrow: "Customer Integration",
    title: "Contact, training, and service routes stay close to intent.",
    copy: "Customer paths are brought forward through visible service cards, training entry points, knowledge prompts, and direct calls to the live source. The page keeps business conversion and support needs inside the same experience.",
    detail: "Lead paths / training flow / knowledge entry",
  },
  {
    number: "04",
    eyebrow: "Design System",
    title: "A technical brand can still feel crisp and human.",
    copy: "The visual system uses a light operating-room surface, deep teal structure, red signal moments, precise borders, and reusable cards for service families, chapters, and deployment notes.",
    detail: "Color tokens / card rules / content modules",
  },
  {
    number: "05",
    eyebrow: "Information Architecture",
    title: "Focus topics and ServiceNow capabilities get separate lanes.",
    copy: "The live site organizes agile transformation, digital transformation, information security, process transformation, service management, and ServiceNow capabilities. The case study reflects that structure without reproducing the full menu tree.",
    detail: "Navigation lanes / service taxonomy / topic grouping",
  },
  {
    number: "06",
    eyebrow: "UX and UI",
    title: "The interface favors scanning, comparison, and confident next steps.",
    copy: "The page avoids a decorative landing-page treatment and instead uses a working case-study layout: dense enough for consulting content, spacious enough to keep the reading rhythm calm.",
    detail: "Scannability / rhythm / action clarity",
  },
  {
    number: "07",
    eyebrow: "Frontend Architecture",
    title: "Qwik route structure keeps the case study isolated and shippable.",
    copy: "The implementation follows the existing portfolio pattern with scoped styles, a client-only animation setup, typed DOM queries, and a registry entry for cards, SEO, and sitemap flow.",
    detail: "Qwik / scoped SCSS / portfolio config",
  },
  {
    number: "08",
    eyebrow: "GSAP Motion",
    title: "The animation language borrows the ambition of test-codex.",
    copy: "Scroll progress, staged reveals, pinned horizontal movement, service graph activation, and finale glow bring the same GSAP confidence into a more polished consulting presentation.",
    detail: "ScrollTrigger / pinned reel / reveal choreography",
  },
  {
    number: "09",
    eyebrow: "QA and Performance",
    title: "Motion gets a fallback and layout gets hard constraints.",
    copy: "The route respects reduced motion, uses semantic sections, avoids text overlap on compact screens, and keeps fixed-format UI elements stable with aspect ratios and responsive limits.",
    detail: "Reduced motion / responsive QA / stable frames",
  },
  {
    number: "10",
    eyebrow: "Deployment",
    title: "The page is registered as a finished portfolio case study.",
    copy: "The final step adds the route to the portfolio data source with a preview image, metadata, date, category, status, and technology tags so it appears in the existing portfolio overview.",
    detail: "Route / metadata / preview / live CTA",
  },
];

const serviceFamilies = [
  ["Agile Transformation", "Agile service management, scaling agile, and method training."],
  ["Digital Transformation", "Process digitization, consulting, and organizational change."],
  ["Information Security", "Compliance, risk, identity access, and security operations."],
  ["Service Management", "ITSM, enterprise service management, HR, customer service, and ITIL."],
  ["ServiceNow", "Consulting, implementation, managed services, UX design, and training."],
  ["Knowledge", "Assessments, guides, webinars, tutorials, and event-driven learning."],
];

const reelCards = [
  ["Planning", "Turn broad navigation into a ten-step delivery narrative."],
  ["Design", "Create a precise, calm visual system for consulting content."],
  ["Integration", "Keep customer tasks visible beside brand and service proof."],
  ["System", "Model topics, capabilities, trainings, and knowledge as reusable UI."],
  ["Motion", "Use GSAP for orientation, emphasis, and controlled momentum."],
  ["Deployment", "Register the page in portfolio data and ship the route."],
];

export default component$(() => {
  const rootRef = useSignal<HTMLElement>();

  useStylesScoped$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    await createMountedClientEffect(cleanup, () => {
      const root = rootRef.value;
      return root ? setupItsmgroupAnimations(root) : undefined;
    });
  });

  return (
    <main class="itsmgroup" data-itsmgroup ref={rootRef}>
      <div class="itsmgroup__progress" aria-hidden="true">
        <span data-progress />
      </div>

      <section
        class="itsmgroup__hero"
        data-hero
        aria-labelledby="itsmgroup-title"
      >
        <nav class="itsmgroup__nav" aria-label="Project navigation">
          <a href="/portfolio">Portfolio</a>
          <a href={liveUrl} target="_blank" rel="noreferrer">
            itsmgroup.com
          </a>
        </nav>

        <div class="itsmgroup__hero-copy">
          <p class="itsmgroup__eyebrow" data-hero-line>
            Case study / iTSM Group
          </p>
          <h1 id="itsmgroup-title" data-hero-title>
            Service management staged as a product system.
          </h1>
          <p data-hero-line>
            A portfolio presentation for the iTSM Group website, shaped around
            planning, design thinking, customer integration, design systems,
            ServiceNow clarity, GSAP motion, QA, and deployment.
          </p>
          <div class="itsmgroup__hero-actions" data-hero-line>
            <a href="#planning">Explore process</a>
            <a href={liveUrl} target="_blank" rel="noreferrer">
              Open live source
            </a>
          </div>
        </div>

        <div class="itsmgroup__browser" aria-label="iTSM Group page model">
          <div class="itsmgroup__browser-top" data-hero-panel>
            <span />
            <span />
            <span />
            <strong>iTSM Group</strong>
          </div>
          <div class="itsmgroup__browser-body" data-hero-panel>
            <div class="itsmgroup__browser-copy">
              <span>From IT to Service Management</span>
              <strong>Services and processes on the next level</strong>
              <p>Focus topics, ServiceNow excellence, trainings, knowledge.</p>
            </div>
            <div class="itsmgroup__browser-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div class="itsmgroup__browser-grid" data-hero-panel>
            {["Fokus", "ServiceNow", "Trainings", "Knowledge"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div class="itsmgroup__meta" aria-label="Project facts">
          {metaItems.map(([label, value]) => (
            <div class="itsmgroup__meta-item" key={label} data-hero-panel>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section class="itsmgroup__statement" aria-label="Project positioning">
        <p data-reveal>
          The live site is a large service-management ecosystem. This portfolio
          page turns it into a guided build story with ten visible delivery
          moments.
        </p>
      </section>

      <section class="itsmgroup__process" aria-labelledby="itsmgroup-process">
        <div class="itsmgroup__section-heading" data-reveal>
          <p class="itsmgroup__eyebrow">Ten-section process</p>
          <h2 id="itsmgroup-process">From strategy to deployment.</h2>
        </div>
        <div class="itsmgroup__process-grid">
          {processSections.map((section) => (
            <article
              class="itsmgroup__process-card"
              id={section.number === "01" ? "planning" : undefined}
              key={section.number}
              data-process-section
            >
              <span class="itsmgroup__number" data-number>
                {section.number}
              </span>
              <p class="itsmgroup__eyebrow">{section.eyebrow}</p>
              <h3>{section.title}</h3>
              <p>{section.copy}</p>
              <strong>{section.detail}</strong>
            </article>
          ))}
        </div>
      </section>

      <section
        class="itsmgroup__system"
        aria-labelledby="itsmgroup-system-title"
      >
        <div class="itsmgroup__section-heading itsmgroup__section-heading--dark" data-reveal>
          <p class="itsmgroup__eyebrow">System model</p>
          <h2 id="itsmgroup-system-title">
            Topics, platform work, training, and knowledge connect.
          </h2>
        </div>
        <div class="itsmgroup__system-board" aria-hidden="true">
          <span class="itsmgroup__system-line itsmgroup__system-line--one" data-system-line />
          <span class="itsmgroup__system-line itsmgroup__system-line--two" data-system-line />
          <span class="itsmgroup__system-line itsmgroup__system-line--three" data-system-line />
          {["Focus", "ServiceNow", "Trainings", "Knowledge", "Customer", "Deployment"].map((item, index) => (
            <div
              class={`itsmgroup__system-node itsmgroup__system-node--${index + 1}`}
              key={item}
              data-system-node
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section class="itsmgroup__services" aria-labelledby="itsmgroup-services">
        <div class="itsmgroup__section-heading" data-reveal>
          <p class="itsmgroup__eyebrow">Content architecture</p>
          <h2 id="itsmgroup-services">The service model is broad by design.</h2>
        </div>
        <div class="itsmgroup__service-grid">
          {serviceFamilies.map(([title, copy], index) => (
            <article class="itsmgroup__service-card" key={title} data-stack-card>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        class="itsmgroup__reel-section"
        data-reel-section
        aria-labelledby="itsmgroup-reel"
      >
        <div class="itsmgroup__reel-copy" data-reveal>
          <p class="itsmgroup__eyebrow">Motion score</p>
          <h2 id="itsmgroup-reel">
            The process moves like a controlled consulting workshop.
          </h2>
        </div>
        <div class="itsmgroup__reel-viewport">
          <div class="itsmgroup__reel-track" data-reel-track>
            {reelCards.map(([title, copy], index) => (
              <article class="itsmgroup__reel-card" key={title} data-stack-card>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section class="itsmgroup__delivery" aria-labelledby="itsmgroup-delivery">
        <div class="itsmgroup__delivery-copy" data-reveal>
          <p class="itsmgroup__eyebrow">QA and deployment</p>
          <h2 id="itsmgroup-delivery">
            The route ships with the same discipline as the story.
          </h2>
          <p>
            Scoped styling, client-only animation, a portfolio preview, SEO
            metadata, reduced-motion handling, and a direct link back to the
            source site make the case study feel finished inside the existing
            project.
          </p>
        </div>
        <div class="itsmgroup__delivery-panel" data-reveal>
          {["Qwik route", "Scoped SCSS", "GSAP client", "Portfolio registry"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section
        class="itsmgroup__finale"
        data-finale
        aria-labelledby="itsmgroup-finale"
      >
        <p class="itsmgroup__eyebrow" data-finale-item>
          Deployment
        </p>
        <h2 id="itsmgroup-finale" data-finale-item>
          A complete portfolio case study for iTSM Group.
        </h2>
        <p data-finale-item>
          The presentation is now a dedicated portfolio route with ten process
          chapters, an independent visual system, and GSAP motion inspired by
          the test-codex page.
        </p>
        <div class="itsmgroup__finale-actions" data-finale-item>
          <a href={liveUrl} target="_blank" rel="noreferrer">
            Visit itsmgroup.com
          </a>
          <a href="/portfolio">Back to portfolio</a>
        </div>
      </section>
    </main>
  );
});

export const head = buildPortfolioHead("/portfolio/itsmgroup");
