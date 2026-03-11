import { component$, useStyles$ } from "@builder.io/qwik"
import styles from "./getInTouch.scss?inline"

export const GetInTouch = component$(() => {
	useStyles$(styles)

	return (
		<section>
			<div class="getintouch">
				<div class="getintouch__header">
					<h4>Get in touch to learn more.</h4>

				</div>
				<div class="getintouch__content">
					<div class="getintouch__phone">

						<p>phone: 123-456-7890</p>
					</div>
					<div class="getintouch__linkedin">
						<p>linked</p>
					</div>
					<div class="getintouch__email">
						<p>email: info@example.com</p>
					</div>
				</div>
			</div>
		</section>
	)
})