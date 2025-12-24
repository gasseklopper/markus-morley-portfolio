import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import { useGsapAnimations } from "~/hooks/useGsapAnimations";
import { Card } from "./card"

export default component$(() => {
  useGsapAnimations();

  return (
    <div class="basic-start">
      <section class="basic-start-grid" aria-label="Golden ratio grid layout">
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <Card
            imageAlt="a alt text for this image clean"
            imageWidth={800}
            imageHeight={300}
            imageSrc="../assets/images/photography/image.png"
            headline="European pollution regulations: the first Euro 7 technical requirements have been published!"
            description="The first package of Euro 7 implementing regulations was officially published at the beginning of September. It marks a crucial step in the European strategy to reduce polluting emissions from light road vehicles."
            href="#"
            ctaText="View Project"
            variation="clean"
            tagline="Puplications"
          />
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <Card
            imageAlt="a alt text for this image clean"
            imageWidth={800}
            imageHeight={300}
            imageSrc="../assets/images/photography/image5.png"
            headline="UTAC announces major global facility investments to support next-generation mobility"
            description="Significant upgrades across UTAC’s international network strengthen electric motor, tyre, durability and driveline testing capabilities"
            href="#"
            ctaText="View Project"
            variation="clean"
            tagline="Puplications"
          />
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <Card
            headline="Weather Safe: An Innovative Project to Enhance Automotive Safety in Adverse Weather Conditions"
            href="#"
            ctaText="View Project"
            variation="primary"
            tagline="tagline"
          />
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <Card
            imageAlt="a alt text for this image second"
            imageWidth={100}
            imageHeight={100}
            imageSrc="../assets/images/photography/image2.png"
            headline="Weather Safe: An Innovative Project to Enhance Automotive Safety in Adverse Weather Conditions"
            description="---"
            href="#"
            ctaText="View Project"
            variation="secondary"
            tagline="Puplications"
          />
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <Card
            headline="Weather Safe: An Innovative Project to Enhance Automotive Safety in Adverse Weather Conditions"
            description="---"
            href="#"
            ctaText="View Project"
            variation="secondary"
            tagline="Puplications"
          />
        </div>
      </section>
      <section class="basic-start-grid-1" aria-label="Golden ratio grid layout">
        <div class="basic-start-column" data-anim="fade">
          <div class="basic-start-content">
            <strong class="basic-start-name">Portfolio</strong>
            <span>Interaction Designer </span>
            <span>Rhein-Main-Gebiet </span>
            <span></span>
            <span></span>
            <span></span>
            <span>10+ Jahre digitale Produkte & Erlebnisse</span>
          </div>
        </div>
      </section>
      <section class="basic-start-grid" aria-label="Golden ratio grid layout">
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <div class="basic-start-content">
            <img
              src="../assets/images/photography/image.png"
              alt=""
              height="100"
              width="500"
            />
          </div>
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <div class="basic-start-content">
            <img
              src="../assets/images/photography/image2.png"
              alt=""
              height="100"
              width="500"
            />
          </div>
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <div class="basic-start-content">
            <img
              src="../assets/images/photography/image.png"
              alt=""
              height="100"
              width="500"
            />
          </div>
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <div class="basic-start-content">
            <img
              src="../assets/images/photography/image2.png"
              alt=""
              height="100"
              width="500"
            />
          </div>
        </div>
        <div
          class="basic-start-column"
          data-anim="reveal"
          data-y="12"
          data-duration="0.7"
        >
          <div class="basic-start-content">
            <img
              src="../assets/images/photography/image2.png"
              alt=""
              height="100"
              width="500"
            />
          </div>
        </div>
      </section>

    </div>
  );
});


export const head = buildHead(`Basic Start - ${siteConfig.metadata.title}`);
