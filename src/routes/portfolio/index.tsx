import { component$ } from "@builder.io/qwik"
import siteConfig from "~/config/siteConfig.json"
import { buildHead } from "~/utils/head"
import { useGsapAnimations } from "~/hooks/useGsapAnimations"

export default component$(() => {
  useGsapAnimations()

  return (
    <div class="basic-start">
      <section class="basic-start-grid-1" aria-label="Golden ratio grid layout">
        <div class="basic-start-column" data-anim="fade">
          <div class="basic-start-content">
            <strong class="basic-start-name">Portfolio</strong>
            <span>Interaction Designer  </span>
            <span>Rhein-Main-Gebiet </span>
            <span></span>
            <span></span>
            <span></span>
            <span>10+ Jahre digitale Produkte & Erlebnisse</span>
          </div>
        </div>
      </section>
      <section class="basic-start-grid" aria-label="Golden ratio grid layout">
        <div class="basic-start-column" data-anim="reveal" data-y="12" data-duration="0.7">
          <div class="basic-start-content">
            <img src="../assets/images/photography/image.png" alt="" height="100" width="500" />
          </div>
        </div>
        <div class="basic-start-column" data-anim="reveal" data-y="12" data-duration="0.7">
          <div class="basic-start-content">
            <img src="../assets/images/photography/image2.png" alt="" height="100" width="500" />
          </div>
        </div>
        <div class="basic-start-column" data-anim="reveal" data-y="12" data-duration="0.7">
          <div class="basic-start-content">
            <img src="../assets/images/photography/image.png" alt="" height="100" width="500" />
          </div>
        </div>
        <div class="basic-start-column" data-anim="reveal" data-y="12" data-duration="0.7">
          <div class="basic-start-content">
            <img src="../assets/images/photography/image2.png" alt="" height="100" width="500" />
          </div>
        </div>
        <div class="basic-start-column" data-anim="reveal" data-y="12" data-duration="0.7">
          <div class="basic-start-content">
            <img src="../assets/images/photography/image2.png" alt="" height="100" width="500" />
          </div>
        </div>
      </section>
    </div>
  )
})

export const head = buildHead(`Basic Start - ${siteConfig.metadata.title}`)
