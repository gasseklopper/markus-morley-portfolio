import { component$, useStyles$ } from "@builder.io/qwik"
// import baseStyles from "../index.scss?inline"
import styles from "./start.scss?inline"
import siteConfig from "~/config/siteConfig.json"
import { buildHead } from "~/utils/head"
import { FooterNew } from "~/components/FooterNew/FooterNew"
import { Gallery } from "~/components/Gallery/Gallery"
import { Hero } from "~/components/Hero/Hero"
import { Teaser } from "~/components/Teaser/Teaser"
import { GetInTouch } from "~/components/GetInTouch/GetInTouch"





export default component$(() => {
  // useStyles$(baseStyles)
  useStyles$(styles)

  return (
    <div class="page">
      {/* Hero */}
      < Hero />
      {/* Gallery */}
      <Gallery />
      {/* Teaser */}
      <Teaser />
      {/* get in touch */}
      <GetInTouch />
      {/* footer */}
      <FooterNew />
    </div>
  )
})

export const head = buildHead(`Start - ${siteConfig.metadata.title}`)
