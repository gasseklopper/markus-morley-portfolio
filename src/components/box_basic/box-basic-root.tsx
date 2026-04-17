import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik"
import styles from "./box-basic-root.scss?inline";

export interface BoxBasicRootProps {
	tone?: "default" | "brand" | "danger"
	size?: "sm" | "md" | "lg"
}

export const BoxBasicRoot = component$<BoxBasicRootProps>((props) => {
	useStylesScoped$(styles);
	return (
		<div
			class={[
				"box_basic",
				props.tone && `box_basic--${props.tone}`,
				props.size && `box_basic--${props.size}`,
			]}
		>
			<div class="box_basic__body">
				<Slot />
			</div>
		</div>
	)
})