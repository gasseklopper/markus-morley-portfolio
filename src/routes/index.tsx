import { component$, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import { setupHomeHeroAnimations } from "./home-hero.client";

interface WorkItem {
  title: string;
  description: string;
}

const workItems: WorkItem[] = [
  {
    title: "Design Systems",
    description:
      "I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.",
  },
  {
    title: "Prototyping",
    description:
      "Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.",
  },
  {
    title: "Large-Scale Projects",
    description:
      "I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.",
  },
  {
    title: "Hybrid Development",
    description:
      "Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.",
  },
];

export default component$(() => {
  useStyles$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    async ({ cleanup }) => {
      const lifecycle = {
        disposed: false,
        dispose: undefined as (() => void) | undefined,
      };

      cleanup(() => {
        lifecycle.disposed = true;
        lifecycle.dispose?.();
      });

      lifecycle.dispose = await setupHomeHeroAnimations();
      if (lifecycle.disposed) lifecycle.dispose();
    },
    {
      strategy: "document-ready",
    },
  );

  return (
    <div class="page home-hero">
      <div class="hero-viewport">
        <header class="hero-header">
          <div class="hero-header__container">
            <nav class="hero-effects" aria-label="Trail effects">
              <ul>
                <li>
                  <a href="#" data-effect="flame" class="active">
                    Flame
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="venetian">
                    Venetian
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="curtain">
                    Curtain
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="hexagon">
                    Hexagon
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="liquid">
                    Liquid
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="zoomsplit">
                    Zoom Split
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <section class="hero-section" aria-labelledby="hero-title">
          <div class="hero-core">
            <h1 id="hero-title">Markus Morley — Brutalist design & code for fearless brands.</h1>
            <p>
              Hybrid designer & front-end engineer from Frankfurt am Main, weaving research-led storytelling
              with resilient product delivery.
            </p>
          </div>

          <div class="hero-text-columns" aria-hidden="true">
            <div class="hero-text-column">
              <span class="text-item">Brutalism</span>
              <span class="text-item">Intuition</span>
              <span class="text-item">Source</span>
              <span class="text-item">Awareness</span>
              <span class="text-item">Presence</span>
              <span class="text-item">Breath</span>
              <span class="text-item">Flow</span>
              <span class="text-item">Surrender</span>
              <span class="text-item">Process</span>
              <span class="text-item">Emergence</span>
              <span class="text-item">Channel</span>
              <span class="text-item">Receptivity</span>
              <span class="text-item">Simplicity</span>
              <span class="text-item">Clarity</span>
              <span class="text-item">Vulnerability</span>
            </div>

            <div class="hero-text-column">
              <span class="text-item">Listening</span>
              <span class="text-item">Frequency</span>
              <span class="text-item">Vibration</span>
              <span class="text-item">Resonance</span>
              <span class="text-item">Energy</span>
              <span class="text-item">Field</span>
              <span class="text-item">Dimension</span>
              <span class="text-item">Consciousness</span>
              <span class="text-item">Unity</span>
              <span class="text-item">Form</span>
              <span class="text-item">Function</span>
              <span class="text-item">Beauty</span>
              <span class="text-item">Harmony</span>
              <span class="text-item">Balance</span>
              <span class="text-item">Proportion</span>
            </div>

            <div class="hero-text-column">
              <span class="text-item">Design Systems</span>
              <span class="text-item">Texture</span>
              <span class="text-item">Possibility</span>
              <span class="text-item">Potential</span>
              <span class="text-item">Transformation</span>
              <span class="text-item">Evolution</span>
              <span class="text-item">Prototyping</span>
              <span class="text-item">Awakening</span>
              <span class="text-item">Creation</span>
              <span class="text-item">Truth</span>
              <span class="text-item">Nature</span>
              <span class="text-item">Wonder</span>
              <span class="text-item">Mystery</span>
              <span class="text-item">Cosmos</span>
              <span class="text-item">Collaboration</span>
            </div>
          </div>

          <div class="hero-rotated-text" aria-hidden="true">
            <span class="rotated-item">Inspiration</span>
            <span class="rotated-item">Discovery</span>
            <span class="rotated-item">Expression</span>
            <span class="rotated-item">Liberation</span>
            <span class="rotated-item">Manifestation</span>
          </div>

          <svg
            class="hero-svg hero-wordmark"
            viewBox="0 0 1200 320"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="52%"
              dominant-baseline="middle"
              text-anchor="middle"
              textLength="88%"
              lengthAdjust="spacingAndGlyphs"
            >
              MORLEY
            </text>
          </svg>


          <div class="speed-indicator" />
        </section>
      </div>

      <section class="home-hero__intro" aria-labelledby="intro-title">
        <div class="home-hero__intro-shell">
          <p class="home-hero__badge">Available for collaborations</p>
          <h2 id="intro-title">Fearless digital experiences crafted with precision.</h2>
          <p>
            I blend research-led design exploration with resilient engineering to help brands move boldly. From
            Frankfurt am Main, I build the prototypes, systems, and large-scale platforms that turn possibility
            into product reality.
          </p>
        </div>
      </section>

      <section class="home-hero__work" aria-label="Areas of focus">
        {workItems.map((item) => (
          <article key={item.title} class="home-hero__work-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);
