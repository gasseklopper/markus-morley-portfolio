import { component$ } from "@builder.io/qwik"
import siteConfig from "~/config/siteConfig.json"
import { buildHead } from "~/utils/head"
import { useGsapAnimations } from "~/hooks/useGsapAnimations"
import portfolioPages from "~/config/portfolio-pages.json"
import { Card, CardVariation} from "./card"

type PortfolioPage = (typeof portfolioPages)[number]

const getProjectBadge = (page: PortfolioPage) => {
  if (page.path === "/portfolio/color-theme") {
    return "Design Tokens"
  }

  if (page.path === "/portfolio/farbkasten") {
    return "Creative Coding"
  }

  if (page.path.startsWith("/portfolio/generative-art")) {
    return page.path === "/portfolio/generative-art" ? "Generative Hub" : "Experiment"
  }

  if (page.name.toLowerCase().includes("project")) {
    return "Case Study"
  }

  return "Case Study"
}

export default component$(() => {
  useGsapAnimations()

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
            key={index}
          >
            {/* <Card
              imageAlt={page.image?.alt || page.name}
              imageWidth={800}
              imageHeight={300}
              imageSrc={page.image?.src}
              headline={page.name}
              description={page.description}
              href={page.path}
              ctaText="View Project"
              variation={page.variation as PortfolioCardProps["variation"]}
              tagline={getProjectBadge(page)}
            /> */}
            <Card.Root variation={page.variation as CardVariation}>
              <Card.Image src={page.image?.src || ""} alt={page.image?.alt || page.name} width={800} height={450} />

              <Card.Body>
                <Card.Tagline>{getProjectBadge(page)}</Card.Tagline>
                <Card.Headline>{page.name}</Card.Headline>
                <Card.Description>{page.description}</Card.Description>
              </Card.Body>

              <Card.Footer>
                <Card.Date>12.12.2023</Card.Date>
                <Card.Link href={page.path}>Read more</Card.Link>
              </Card.Footer>
            </Card.Root>
          </div>
        ))}
      </section>
    </div>
  )
})


export const head = buildHead(`Basic Start - ${siteConfig.metadata.title}`)
