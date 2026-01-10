import {
	component$,
	Slot,
	createContextId,
	useContextProvider,
	useStyles$,
} from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
import styles from "./card.scss?inline"

export type CardVariation = "primary" | "secondary" | "clean"

type CardCtx = {
	variation: CardVariation
}

const CardContext = createContextId<CardCtx>("ui.card.ctx")

/** Root: owns styling/variation and overall container behavior */
export const CardRoot = component$<{
	variation?: CardVariation
	class?: string
	/** Optional: make the whole card clickable */
	href?: string
	/** For external links etc. */
	target?: HTMLAnchorElement["target"]
	rel?: HTMLAnchorElement["rel"]
}>((props) => {
	useStyles$(styles)

	const variation = props.variation ?? "primary"
	useContextProvider(CardContext, { variation })

	const cls = `card card--${variation} ${props.class ?? ""}`.trim()

	// If href is provided, wrap content in a Link for "clickable card" UX
	if (props.href) {
		return (
			<Link href={props.href} class={cls} target={props.target} rel={props.rel}>
				<Slot />
			</Link>
		)
	}

	return (
		<div class={cls}>
			<Slot />
		</div>
	)
})

/** Regions */
export const CardHead = component$(() => <div class="card__head"><Slot /></div>)
export const CardBody = component$(() => <div class="card__body"><Slot /></div>)
export const CardFooter = component$(() => <div class="card__footer"><Slot /></div>)

/** Primitives (optional building blocks) */
export const CardImage = component$<{
	src: string
	alt?: string
	width?: number
	height?: number
}>((props) => {
	return (
		<div class="card__image-wrapper">
			<img
				class="card__image"
				src={props.src}
				alt={props.alt ?? ""}
				width={props.width}
				height={props.height}
				loading="lazy"
			/>
		</div>
	)
})

export const CardTagline = component$(() => <div class="card__tagline"><Slot /></div>)
export const CardHeadline = component$(() => <h3 class="card__headline"><Slot /></h3>)
export const CardDescription = component$(() => <p class="card__description"><Slot /></p>)
export const CardDate = component$(() => <div class="card__date"><Slot /></div>)

/**
 * Link primitive:
 * - Use inside footer or body.
 * - If you want "whole card clickable", prefer Card.Root href=...
 */
export const CardLink = component$<{
	href: string
	class?: string
}>((props) => {
	return (
		<Link href={props.href} class={["card__link", props.class].filter(Boolean).join(" ")}>
			<Slot />
		</Link>
	)
})

/** Optional: Tags / badges */
export const CardTag = component$<{
	tone?: "default" | "muted" | "success" | "warning"
}>((props) => {
	const tone = props.tone ?? "default"
	return <span class={`card__tag card__tag--${tone}`}><Slot /></span>
})

/** Convenience namespace export */
export const Card = {
	Root: CardRoot,
	Head: CardHead,
	Body: CardBody,
	Footer: CardFooter,
	Image: CardImage,
	Tagline: CardTagline,
	Headline: CardHeadline,
	Description: CardDescription,
	Date: CardDate,
	Link: CardLink,
	Tag: CardTag,
}
