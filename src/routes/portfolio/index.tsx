import { component$ } from "@builder.io/qwik";
import { buildHead } from "~/utils/head";
import { useGsapAnimations } from "~/hooks/useGsapAnimations";
import { portfolioPages } from "~/config/portfolio";
import { Card, CardVariation } from "./card";

export default component$(() => {
  useGsapAnimations();

  return (
    <div class="basic-start">
      <section class="basic-start-grid-1" aria-label="Golden ratio grid layout">
        <div class="basic-start-column" data-anim="fade">
          <div class="basic-start-content">
            <strong class="basic-start-name">Portfolio</strong>
            <span>Interaction Designer </span>
            <span>Rhein-Main-Gebiet </span>
            <span></span>
            <span></span>
            <span></span>
            <span>10+ Jahre digitale Produkte & Erlebnisse</span>
          </div>
        </div>
      </section>
      <section class="basic-start-grid" aria-label="Golden ratio grid layout">
        {portfolioPages.map((page, index) => (
          <div
            class="basic-start-column"
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
                <Card.Tagline>{page.badge}</Card.Tagline>
                <Card.Headline>{page.name}</Card.Headline>
                <Card.Description>{page.description}</Card.Description>
              </Card.Body>

              <Card.Footer>
                <Card.Date>{page.date}</Card.Date>
                <Card.Link href={page.path}>Read more</Card.Link>
              </Card.Footer>
            </Card.Root>
          </div>
        ))}
      </section>
    </div>
  );
});

export const head = buildHead(
  "Portfolio - Markus Morley Portfolio",
  "Selected interaction design, frontend, and creative coding work by Markus Morley.",
);
