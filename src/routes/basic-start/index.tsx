import { component$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  return (
    <div class="basic-start">
      <section class="basic-start-grid-1" aria-label="Golden ratio grid layout">
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_03_12.jpg" alt="" height="1100" width="1300" />
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <strong class="basic-start-name">Markus Morley</strong>
            <span>Interaction Designer  </span>
            <span>Rhein-Main-Gebiet </span>
            <span></span>
            <span></span>
            <span></span>
            <span>10+ Jahre digitale Produkte & Erlebnisse </span>
          </div>
        </div>
      </section>
      <section class="basic-start-grid-2" aria-label="Golden ratio grid layout">
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/image.png" alt="" height="100" width="500" />

          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/image2.png" alt="" height="100" width="500" />

          </div>
        </div>
      </section>
      <section class="basic-start-grid-3" aria-label="Golden ratio grid layout">
        <div class="basic-start-column">
          <div class="basic-start-content">
            <strong>1.</strong>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_05.jpg" alt="" height="100" width="300" />
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <span>Aufgewachsen im Rhein-Main-Gebiet und geprägt von frühen Berührungspunkten mit Gestaltung und Technik, arbeite ich heute seit über 10 Jahren als Interaction Designer. Ich entwickle digitale Produkte und Erlebnisse, die funktional, verständlich und langfristig tragfähig sind.</span>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_06.jpg" alt="" height="100" width="300" />
          </div>
        </div>
      </section>
      <section class="basic-start-grid-4" aria-label="Golden ratio grid layout">
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_08.jpg" alt="" height="100" width="300" />
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_011.jpg" alt="" height="100" width="300" />
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">

          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_09.jpg" alt="" height="100" width="300" />
          </div>
        </div>
      </section>
      <section class="basic-start-grid-5" aria-label="Golden ratio grid layout">
        <div class="basic-start-column">
          <div class="basic-start-content">
            <strong>2.</strong>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_015.jpg" alt="" height="100" width="300" />
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">

            <strong>1fr</strong>
            <span>
              Seit 2016 arbeite ich als Interaction Designer an digitalen Produkten und Plattformen. In verschiedenen Agentur- und Unternehmenskontexten habe ich zahlreiche Projekte von der Konzeption bis zur Umsetzung begleitet.

              Über die Jahre entstanden eine große Anzahl digitaler Projekte, darunter Websites, Interfaces und Markenauftritte für nationale und internationale Auftraggeber. Dabei habe ich sowohl als Designer, als Developer und auch in koordinierender Rolle gearbeitet.</span>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_016.jpg" alt="" height="100" width="950" />
            <strong>1fr</strong>
            <span>golden ratio</span>
          </div>
        </div>
      </section>
      <section class="basic-start-grid" aria-label="Golden ratio grid layout">
        <div class="basic-start-column">
          <div class="basic-start-content">
            <img src="../public/assets/images/photography/black/Template_index_01.jpg" alt="" height="100" width="300" />
            <strong>1fr</strong>
            <span>golden ratio</span>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <strong>1fr</strong>
            <span>golden ratio</span>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <strong>1fr</strong>
            <span>golden ratio</span>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <strong>1fr</strong>
            <span>golden ratio</span>
          </div>
        </div>
        <div class="basic-start-column">
          <div class="basic-start-content">
            <strong>1fr</strong>
            <span>golden ratio</span>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(`Basic Start - ${siteConfig.metadata.title}`);
