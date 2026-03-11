import { component$, useStyles$ } from "@builder.io/qwik"
import styles from "./teaser.scss?inline"


export const Teaser = component$(() => {
	useStyles$(styles)


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
						<div class="teaser__base_card">
							<h2>Design Systems</h2>
							<p>
								I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
							</p>
						</div>
						<div class="teaser__base_card">
							<h2>Prototyping</h2>
							<p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Large-Scale Projects</h2>
							<p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Hybrid Development</h2>
							<p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Design Systems</h2>
							<p>
								I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
							</p>
						</div>
						<div class="teaser__base_card">
							<h2>Prototyping</h2>
							<p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Large-Scale Projects</h2>
							<p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Hybrid Development</h2>
							<p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Design Systems</h2>
							<p>
								I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
							</p>
						</div>
						<div class="teaser__base_card">
							<h2>Prototyping</h2>
							<p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Large-Scale Projects</h2>
							<p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Hybrid Development</h2>
							<p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Design Systems</h2>
							<p>
								I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
							</p>
						</div>
						<div class="teaser__base_card">
							<h2>Prototyping</h2>
							<p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Large-Scale Projects</h2>
							<p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Hybrid Development</h2>
							<p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Design Systems</h2>
							<p>
								I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.
							</p>
						</div>
						<div class="teaser__base_card">
							<h2>Prototyping</h2>
							<p>Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Large-Scale Projects</h2>
							<p>I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.</p>
						</div>
						<div class="teaser__base_card">
							<h2>Hybrid Development</h2>
							<p>Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.</p>
						</div>
					</div>
				</div>


			</div>
		</section>
	)
})