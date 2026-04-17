import { component$, Slot } from "@builder.io/qwik"

export const BoxBasicHeader = component$(() => {
	return <h3 class="h3"><Slot /></h3>
})