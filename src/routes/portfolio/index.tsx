import { component$ } from "@builder.io/qwik";
import { buildHead } from "~/utils/head";
import { useGsapAnimations } from "~/hooks/useGsapAnimations";
import { portfolioPages } from "~/config/portfolio";
import { Card, CardVariation } from "./card";

export default component$(() => {
  useGsapAnimations();

  return (
    <main class="portfolio-index">
      <section class="portfolio-hero" aria-labelledby="portfolio-title">
        <div class="portfolio-hero__content" data-anim="fade">
          <p class="portfolio-hero__eyebrow">Selected work</p>
          <h1 id="portfolio-title">Portfolio</h1>
          <p class="portfolio-hero__intro">
            Interaction design, frontend architecture, creative coding, and
            case studies from 10+ years of building digital products.
          </p>
        </div>
        <div class="portfolio-hero__aside" data-anim="fade" data-y="8">
          <span>Interaction Designer</span>
          <span>Rhein-Main-Gebiet</span>
          <span>{portfolioPages.length} Projekte</span>
        </div>
      </section>

      <section class="portfolio-grid" aria-label="Portfolio projects">
        {portfolioPages.map((page, index) => (
          <div
            class="portfolio-grid__item"
            data-anim="reveal"
            data-y="12"
            data-duration="0.7"
            key={page.path + index}
          >
            <Card.Root
              variation={page.variation as CardVariation}
              href={page.path}
              as="a"
            >
              {page.preview.image ? (
                <Card.Image
                  src={page.preview.image.src}
                  alt={page.preview.image.alt}
                  width={800}
                  height={450}
                />
              ) : null}

              <Card.Body>
                <div class="card__meta">
                  <Card.Tagline>{page.badge}</Card.Tagline>
                  <span class="card__status">{page.status}</span>
                </div>
                <Card.Headline>{page.name}</Card.Headline>
                <Card.Description>{page.description}</Card.Description>
                <div class="card__tags" aria-label={`${page.name} technologies`}>
                  {page.tech.slice(0, 3).map((tech) => (
                    <Card.Tag key={tech}>{tech}</Card.Tag>
                  ))}
                </div>
              </Card.Body>

              <Card.Footer>
                <div>
                  <Card.Date>{page.date}</Card.Date>
                  <span class="card__category">{page.category}</span>
                </div>
                <Card.Link href={page.path}>Open case</Card.Link>
              </Card.Footer>
            </Card.Root>
          </div>
        ))}
      </section>
    </main>
  );
});

export const head = buildHead(
  "Portfolio - Markus Morley Portfolio",
  "Selected interaction design, frontend, and creative coding work by Markus Morley.",
);
