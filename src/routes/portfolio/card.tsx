import {
	component$,
	Slot,
	createContextId,
	useContextProvider,
	useStyles$,
	useContext,
} from "@builder.io/qwik"
import type { QwikIntrinsicElements } from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
import styles from "./card.scss?inline"

export type CardVariation = "primary" | "secondary" | "clean"

type CardCtx = {
	variation: CardVariation
	isClickable: boolean
}

type DivProps = QwikIntrinsicElements["div"]
type AnchorProps = QwikIntrinsicElements["a"]

export type CardRootProps =
	| ({ as?: "div"; variation?: "primary" | "secondary" | "clean" } & DivProps)
	| ({ as: "a"; href: string; variation?: "primary" | "secondary" | "clean" } & AnchorProps)

const CardContext = createContextId<CardCtx>("ui.card.ctx")

/** Root: owns styling/variation and overall container behavior */
export const CardRoot = component$<CardRootProps>((props) => {
	useStyles$(styles)

	const variation = props.variation ?? "primary"
	const isClickable = props.as === "a";

	useContextProvider(CardContext, { variation, isClickable })

	const cls = `card card--${variation} ${props.class ?? ""}`.trim()

	// If href is provided, wrap content in a Link for "clickable card" UX
	if (props.as === "a") {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { href, variation: _v, as: _as, ...rest } = props;
		return (
			<Link href={href} class={cls} {...rest}>
				<Slot />
			</Link>
		)
	}

	/**
	 * IMPORTANT:
	 * Even if your union says the div-branch doesn't have href,
	 * at runtime consumers can still pass it (or spread an object with it).
	 * So we MUST strip it before spreading to <div>.
	 */
	const { ...rest0 } = props;

	// remove link-ish props defensively
	const {...rest } = rest0 as DivProps & {
		href?: unknown
		target?: unknown
		rel?: unknown
	};

	return (
		<div class={cls} {...rest}>
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
	const ctx = useContext(CardContext)
	const cls = ["card__link", props.class].filter(Boolean).join(" ")

	// If the whole card is already a link, do NOT render another <a>/<Link>
	if (ctx.isClickable) {
		return (
			<span class={cls} aria-hidden="true">
			 	<Slot />
			</span>
		)
	}

	return (
		<Link href={props.href} class={cls}>
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
