import {
	component$,
	$,
	useSignal,
	useComputed$,
	useVisibleTask$,
	useOnWindow,
	useStyles$,
} from "@builder.io/qwik"
import styles from "./gallery.scss?inline"

type GalleryImage = {
	src: string
	alt: string
	width: number
	height: number
}

const images: GalleryImage[] = [
	{
		src: "/assets/images/photography/black/Template_index_014.jpg",
		alt: "Black and white gallery image 1",
		width: 941,
		height: 557,
	},
	{
		src: "/assets/images/photography/black/Template_index_016.jpg",
		alt: "Black and white gallery image 2",
		width: 941,
		height: 557,
	},
	{
		src: "/assets/images/photography/black/Template_index_019.jpg",
		alt: "Black and white gallery image 3",
		width: 941,
		height: 557,
	},
	{
		src: "/assets/images/photography/black/Template_index_011.jpg",
		alt: "Black and white gallery image 4",
		width: 941,
		height: 557,
	},
	{
		src: "/assets/images/photography/black/Template_index_012.jpg",
		alt: "Black and white gallery image 5",
		width: 941,
		height: 557,
	},
]

export const Gallery = component$(() => {
	useStyles$(styles)

	const currentIndex = useSignal(0)
	const visibleCount = useSignal(3)

	const updateVisibleCount = $(() => {
		const count = window.innerWidth < 768 ? 1 : 3
		visibleCount.value = count
		currentIndex.value = Math.min(
			currentIndex.value,
			Math.max(0, images.length - count),
		)
	})

	// Browser width must be measured after both SSR resume and client-side mounts.
	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(() => updateVisibleCount())
	useOnWindow("resize", updateVisibleCount)

	const maxIndex = useComputed$(() =>
		Math.max(0, images.length - visibleCount.value),
	)

	const goPrev = $(() => {
		currentIndex.value = Math.max(0, currentIndex.value - 1)
	})

	const goNext = $(() => {
		currentIndex.value = Math.min(maxIndex.value, currentIndex.value + 1)
	})

	const translateX = `translate3d(-${currentIndex.value * (100 / visibleCount.value)}%, 0, 0)`

	return (
		<section class="gallery-section" aria-label="Image gallery">
			<div class="gallery">
				<div class="gallery__header">
					<div class="gallery__headline">
						<h2>Gallery</h2>
						<p>Selected black and white works</p>
					</div>

					<div class="gallery__controls">
						<button
							type="button"
							class="gallery__button"
							onClick$={goPrev}
							disabled={currentIndex.value === 0}
							aria-label="Previous images"
						>
							←
						</button>

						<div class="gallery__meta" aria-live="polite">
							<span>{String(currentIndex.value + 1).padStart(2, "0")}</span>
							<span>/</span>
							<span>{String(maxIndex.value + 1).padStart(2, "0")}</span>
						</div>

						<button
							type="button"
							class="gallery__button"
							onClick$={goNext}
							disabled={currentIndex.value >= maxIndex.value}
							aria-label="Next images"
						>
							→
						</button>
					</div>
				</div>

				<div class="gallery__viewport">
					<div class="gallery__track" style={{ transform: translateX }}>
						{images.map((image) => (
							<figure class="gallery__slide" key={image.src}>
								<img
									src={image.src}
									alt={image.alt}
									loading="lazy"
									decoding="async"
									width={image.width}
									height={image.height}
								/>
							</figure>
						))}
					</div>
				</div>

				<div class="gallery__footer">
					<p>Photography</p>
					<h4>Black Series</h4>
				</div>
			</div>
		</section>
	)
})
