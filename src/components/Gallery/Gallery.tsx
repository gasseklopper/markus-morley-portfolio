import { component$, $, useSignal, useTask$, useStyles$ } from "@builder.io/qwik"
import styles from "./gallery.scss?inline"

type GalleryImage = {
	src: string
	alt: string
}

const images: GalleryImage[] = [
	{
		src: "/assets/images/photography/black/Template_index_014.jpg",
		alt: "Black and white gallery image 1",
	},
	{
		src: "/assets/images/photography/black/Template_index_016.jpg",
		alt: "Black and white gallery image 2",
	},
	{
		src: "/assets/images/photography/black/Template_index_019.jpg",
		alt: "Black and white gallery image 3",
	},
	{
		src: "/assets/images/photography/black/Template_index_011.jpg",
		alt: "Black and white gallery image 4",
	},
	{
		src: "/assets/images/photography/black/Template_index_012.jpg",
		alt: "Black and white gallery image 5",
	},
]

export const Gallery = component$(() => {
	useStyles$(styles)

	const currentIndex = useSignal(0)
	const visibleCount = useSignal(3)

	useTask$(() => {
		if (typeof window !== "undefined") {
			const updateVisibleCount = () => {
				visibleCount.value = window.innerWidth < 768 ? 1 : 3
			}

			updateVisibleCount()
			window.addEventListener("resize", updateVisibleCount)

			return () => window.removeEventListener("resize", updateVisibleCount)
		}
	})

	const maxIndex = Math.max(0, images.length - visibleCount.value)

	const goPrev = $(() => {
		currentIndex.value = Math.max(0, currentIndex.value - 1)
	})

	const goNext = $(() => {
		currentIndex.value = Math.min(maxIndex, currentIndex.value + 1)
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
							<span>{String(maxIndex + 1).padStart(2, "0")}</span>
						</div>

						<button
							class="gallery__button"
							onClick$={goNext}
							disabled={currentIndex.value >= maxIndex}
							aria-label="Next images"
						>
							→
						</button>
					</div>
				</div>

				<div class="gallery__viewport">
					<div
						class="gallery__track"
						style={{ transform: translateX }}
					>
						{images.map((image) => (
							<figure class="gallery__slide" key={image.src}>
								<img
									src={image.src}
									alt={image.alt}
									loading="lazy"
									decoding="async"
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