import { component$, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const navLinks = [
  { label: "Capabilities", href: "#services" },
  { label: "Highlights", href: "#projects" },
  { label: "Approach", href: "#approach" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const stats = [
  { value: "12+", label: "Years shaping digital brands" },
  { value: "48", label: "End-to-end products launched" },
  { value: "4.9", label: "Average partner rating" },
  { value: "15", label: "Awards & global features" },
];

const services = [
  {
    title: "Brand orchestration",
    description:
      "Narrative-rich design languages that scale across every touchpoint while staying unmistakably yours.",
    points: ["Identity systems", "Motion principles", "Messaging architecture"],
  },
  {
    title: "Product direction",
    description:
      "Immersive product journeys built on research, rapid prototyping, and measurable customer outcomes.",
    points: ["Experience strategy", "High fidelity prototyping", "Design ops consulting"],
  },
  {
    title: "Launch acceleration",
    description:
      "Cross-functional leadership guiding teams from the first moodboard to high-impact, post-launch iteration.",
    points: ["Roadmapping", "Creative leadership", "Team enablement"],
  },
];

const caseStudies = [
  {
    title: "Aurora Markets",
    summary: "Immersive fintech platform that transformed complex investing into an intuitive ritual.",
    result: "+212% customer retention",
    accent: "violet",
  },
  {
    title: "Lumen Health",
    summary: "Reimagined patient onboarding with adaptive storytelling and modular UI foundations.",
    result: "42% faster sign-ups",
    accent: "amber",
  },
  {
    title: "Northwave",
    summary: "Crafted a multi-sensory brand universe for a global outdoor collective expanding into urban markets.",
    result: "Global launch in 6 weeks",
    accent: "aqua",
  },
];

const testimonials = [
  {
    quote:
      "Markus creates environments where bold ideas feel safe to explore. Our brand voice finally matches the ambition of our product.",
    name: "Arielle Santos",
    role: "Chief Brand Officer, Lumen Health",
  },
  {
    quote:
      "He shifted our team from shipping features to shipping experiences. Velocity increased, but so did purpose.",
    name: "Devon Wright",
    role: "Head of Product, Aurora Markets",
  },
  {
    quote:
      "From concept to launch, Markus is the calm in the chaos. Every deliverable is intentional and deeply considered.",
    name: "Noah Becker",
    role: "Founder, Northwave Collective",
  },
];

const approachSteps = [
  {
    title: "Discovery sprint",
    description:
      "Immersive workshops surface truth, define success metrics, and map an inspiring north star together.",
    deliverable: "Vision brief, research synthesis",
  },
  {
    title: "Design alchemy",
    description:
      "Narrative, interaction, and systems thinking merge into layered concepts tested with real humans early and often.",
    deliverable: "Interactive prototypes, brand atlas",
  },
  {
    title: "Empowered launch",
    description:
      "Documentation, rituals, and rituals empower teams to iterate confidently long after launch day.",
    deliverable: "Enablement playbooks, metrics framework",
  },
];

const marqueeBrands = [
  "Adobe",
  "Spotify",
  "Notion",
  "Vercel",
  "Figma",
  "Canva",
  "Headspace",
  "Webflow",
];

export default component$(() => {
  useStyles$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const animatedElements = document.querySelectorAll<HTMLElement>("[data-animate]");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      animatedElements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          const delay = target.dataset.animateDelay ?? "0s";
          target.style.setProperty("--delay", delay);
          target.classList.add("is-visible");
          observer.unobserve(target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    animatedElements.forEach((element) => {
      const el = element as HTMLElement;
      const delay = el.dataset.animateDelay ?? "0s";
      el.style.setProperty("--delay", delay);
      observer.observe(el);
    });

    cleanup(() => {
      observer.disconnect();
    });
  });

  return (
    <div class="page portfolio">
      <header class="site-header" data-animate>
        <div class="site-header__brand">
          <span class="site-header__logo" aria-hidden="true">
            <span>M</span>
            <span>M</span>
          </span>
          <span class="site-header__title">Markus Morley</span>
        </div>
        <nav class="site-header__nav" aria-label="Primary">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a class="site-header__cta" href="#contact">
          Start a project
        </a>
      </header>

      <main>
        <section class="hero" id="top">
          <div class="hero__background" aria-hidden="true">
            <span class="hero__glow hero__glow--one" />
            <span class="hero__glow hero__glow--two" />
          </div>

          <div class="hero__layout">
            <div class="hero__content" data-animate>
              <p class="hero__eyebrow">Portfolio 2024</p>
              <h1>
                Signature digital universes for brands that dare to lead their category.
              </h1>
              <p class="hero__intro">
                I help founders and teams choreograph every moment of their product and brand experience—from the
                first spark of a concept to launches that feel cinematic.
              </p>
              <div class="hero__actions">
                <a class="button button--primary" href="#projects">
                  View selected work
                </a>
                <a class="button button--ghost" href="#approach">
                  How collaboration works
                </a>
              </div>
              <div class="hero__meta" role="list">
                <div class="hero__meta-item" role="listitem">
                  <span class="hero__meta-label">Currently partnering with</span>
                  <span class="hero__meta-value">visionary founders & design-led teams</span>
                </div>
                <div class="hero__meta-item" role="listitem">
                  <span class="hero__meta-label">Recent spotlight</span>
                  <span class="hero__meta-value">Featured by Adobe Creative Residency</span>
                </div>
              </div>
            </div>

            <div class="hero__media" data-animate data-animate-delay="0.15s">
              <div class="hero__media-surface">
                <span class="hero__badge">Multi-sensory designer & art director</span>
                <div class="hero__media-core">
                  <p>
                    Crafting magnetic touchpoints where story, motion, and utility feel inseparable.
                  </p>
                  <ul>
                    <li>Global perspective, Frankfurt & beyond</li>
                    <li>Hybrid design & engineering mindset</li>
                    <li>Always exploring the edges of play</li>
                  </ul>
                </div>
                <div class="hero__orbit hero__orbit--one" aria-hidden="true" />
                <div class="hero__orbit hero__orbit--two" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section class="metrics" aria-label="Key impact metrics">
          <div class="section-shell">
            <div class="metrics__grid">
              {stats.map((item) => (
                <article key={item.label} class="metrics__card" data-animate>
                  <span class="metrics__value">{item.value}</span>
                  <p>{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section class="services" id="services" aria-labelledby="services-title">
          <div class="section-shell">
            <div class="section-header" data-animate>
              <p class="section-eyebrow">Capabilities</p>
              <h2 id="services-title">A full-spectrum practice tuned for modern brand ecosystems.</h2>
              <p class="section-intro">
                Every engagement blends art direction, systems thinking, and hands-on product craft. We design the rules and the
                moments that break them.
              </p>
            </div>
            <div class="services__grid">
              {services.map((service, index) => (
                <article
                  key={service.title}
                  class="service-card"
                  data-animate
                  data-animate-delay={`${(index + 1) * 0.1}s`}
                >
                  <header>
                    <span class="service-card__index">0{index + 1}</span>
                    <h3>{service.title}</h3>
                  </header>
                  <p>{service.description}</p>
                  <ul>
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section class="projects" id="projects" aria-labelledby="projects-title">
          <div class="section-shell">
            <div class="section-header" data-animate>
              <p class="section-eyebrow">Selected highlights</p>
              <h2 id="projects-title">Moments where imagination met measurable growth.</h2>
            </div>
            <div class="projects__grid">
              {caseStudies.map((project, index) => (
                <article
                  key={project.title}
                  class={`project-card project-card--${project.accent}`}
                  data-animate
                  data-animate-delay={`${(index + 1) * 0.12}s`}
                >
                  <div class="project-card__body">
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                  </div>
                  <footer>
                    <span>{project.result}</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section class="marquee" aria-label="Brands & collaborators">
          <div class="marquee__track" data-animate>
            {marqueeBrands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
            {marqueeBrands.map((brand) => (
              <span key={`${brand}-duplicate`}>{brand}</span>
            ))}
          </div>
        </section>

        <section class="approach" id="approach" aria-labelledby="approach-title">
          <div class="section-shell">
            <div class="section-header" data-animate>
              <p class="section-eyebrow">Approach</p>
              <h2 id="approach-title">A rhythm that turns vision into velocity.</h2>
              <p class="section-intro">
                Purposeful rituals keep momentum high and decisions human. Each phase is collaborative, transparent, and grounded
                in real-world feedback.
              </p>
            </div>
            <div class="approach__timeline">
              {approachSteps.map((step, index) => (
                <article
                  key={step.title}
                  class="approach__step"
                  data-animate
                  data-animate-delay={`${(index + 1) * 0.1}s`}
                >
                  <span class="approach__index">Phase {index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <span class="approach__deliverable">{step.deliverable}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section class="testimonials" id="testimonials" aria-labelledby="testimonials-title">
          <div class="section-shell">
            <div class="section-header" data-animate>
              <p class="section-eyebrow">Voices</p>
              <h2 id="testimonials-title">Partners on the journey.</h2>
            </div>
            <div class="testimonials__grid">
              {testimonials.map((testimonial, index) => (
                <figure
                  key={testimonial.name}
                  class="testimonial"
                  data-animate
                  data-animate-delay={`${(index + 1) * 0.08}s`}
                >
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <figcaption>
                    <span class="testimonial__name">{testimonial.name}</span>
                    <span class="testimonial__role">{testimonial.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section class="cta" id="contact" aria-labelledby="cta-title">
          <div class="section-shell">
            <div class="cta__surface" data-animate>
              <div class="cta__content">
                <p class="section-eyebrow">Let’s create what’s next</p>
                <h2 id="cta-title">Tell me about the story you are ready to share with the world.</h2>
                <p>
                  Send a note about your product, brand, or idea. I’ll respond within two business days with next steps and
                  possibilities for collaboration.
                </p>
              </div>
              <a class="button button--primary" href="mailto:hello@markusmorley.de">
                hello@markusmorley.de
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer class="site-footer" aria-label="Site footer">
        <div class="site-footer__content">
          <div>
            <span class="site-footer__logo" aria-hidden="true">
              <span>M</span>
              <span>M</span>
            </span>
            <p>Markus Morley — Portfolio 2024</p>
          </div>
          <p>Designed and developed with curiosity in Frankfurt.</p>
          <a href="#top" class="site-footer__back">Back to top</a>
        </div>
      </footer>
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);
