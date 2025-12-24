import { component$, useStyles$ } from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city";
import styles from "./card.scss?inline";

export interface PortfolioCardProps  {
	variation?: "primary" | "secondary" | "clean"
	imageSrc?: string
	imageWidth?: number
	imageHeight?: number
	imageAlt?: string
	tagline?: string
	href?: string
	headline?: string
	description?: string
	destinationSmall?: string
	date?: string
	ctaText?: string
};

export const Card = component$(
	({
		variation = "primary",
		imageSrc,
		headline = "No Headline Provided",
		description,
		imageAlt,
		imageWidth,
		imageHeight,
		href,
		ctaText,
		tagline,
		date = "12.12.2023",
	}: PortfolioCardProps) => {
		useStyles$(styles);

		return (
			<div class={`card card--${variation}`}>
				{imageSrc && (
					<div class="card__image">
						<img src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} />
					</div>
				)}
				<div class="card__content">
					<div class="card__tagline">{tagline}</div>
					<h3 class="card__headline">{headline}</h3>
					<p class="card__description">{description}</p>
					<div class="card__footer">
						<div class="card__date">{date}</div>
						<Link href={href} class="card__link">
							{ctaText}
						</Link>
					</div>
				</div>
			</div>
		)
	},
)