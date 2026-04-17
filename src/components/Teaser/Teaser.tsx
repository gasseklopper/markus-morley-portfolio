import { component$, useStyles$ } from "@builder.io/qwik"
import styles from "./teaser.scss?inline"
import { BoxBasic } from "../box_basic"
import portfolioPages from "~/config/portfolio-pages.json"
import { getProjectBadge } from "~/routes/portfolio"
import { Card, CardVariation } from "~/routes/portfolio/card"
import { useGsapAnimations } from "~/hooks/useGsapAnimations"

export const Teaser = component$(() => {
	useStyles$(styles)
	useGsapAnimations()

	return (
		<section>
			<div class="teaser">
				{/* layout left */}
				<div class="teaser__layout-left">
					<div class="teaser__teaser-big">
						<img src="../assets/images/photography/black/Template_index_011.jpg" alt="" />
					</div>
					<div class="teaser__teaser-right-bottom">
						<p>date</p>
						<p>tag</p>
						<p> I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.</p>
						<h2>Shift5</h2>
						<a class="" href="/contact" >read more
						</a>
					</div>
				</div>

				{/* layout right */}
				<div class="teaser__layout-right">
					<div class="teaser__teaser-2-column">
						<BoxBasic.Root tone="brand" size="lg">
							{/* <BoxBasic.Root > */}
							<BoxBasic.Subheader>Featured</BoxBasic.Subheader>
							<BoxBasic.Header>Design System Card</BoxBasic.Header>
							<BoxBasic.Body>
								Reusable, typed, and scalable compound component structure.
							</BoxBasic.Body>
							{/* <BoxBasic.Button>
          <button>Explore</button>
        </BoxBasic.Button> */}
						</BoxBasic.Root>
						{portfolioPages.slice(0, 8).map((page, index) => (
							<div
								class="basic-start-column"
								data-anim="reveal"
								data-y="12"
								data-duration="0.7"
								key={page.path + index}
							>
								<Card.Root variation={page.variation as CardVariation} href={page.path} as="a">
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

					</div>
				</div>


			</div>
		</section>
	)
})