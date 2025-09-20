import { component$ } from "@builder.io/qwik"
import Navigation2 from "./navigation2"

export const Header = component$(() => {
  return (
    <header>
      <Navigation2 />
    </header>
  )
})

export default Header
