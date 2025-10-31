import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import { HeroSection } from "~/components/home/hero-section";

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

  return (
    <div class="page">
      <div class="home-hero">
        <HeroSection />

        <section class="home-hero__intro" aria-labelledby="intro-title">
          <div class="home-hero__intro-shell">
            <p class="home-hero__badge">Available for collaborations</p>
            <h2 id="intro-title">Fearless digital experiences crafted with precision.</h2>
            <p>
              I blend research-led design exploration with resilient engineering to help brands move boldly. From
              Frankfurt am Main, I build the prototypes, systems, and large-scale platforms that turn possibility into
              product reality.
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
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);
