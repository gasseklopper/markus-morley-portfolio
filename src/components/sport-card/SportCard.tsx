import { component$, useStylesScoped$ } from "@builder.io/qwik"
import styles from "./SportCard.css?inline"

export const SportCard = component$(() => {
	useStylesScoped$(styles)
	return (
		<div class="sport-card">
			<h2 class="top-text">DON'T STOP</h2>
			<h1 class="moving-text">MOVING</h1>
			<div class="runner-wrapper">
				{/* eslint-disable-next-line qwik/jsx-img */}
				<img src="/assets/images/runner.png" alt="Running athlete" class="runner" />
			</div>
			<div class="ground" />
		</div>
	)
})

export default SportCard