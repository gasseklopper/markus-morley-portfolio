import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./impressum.scss?inline";
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="imprint-page page">
      <section class="imprint-page__hero" aria-labelledby="imprint-title">
        <div class="imprint-page__shell">
          <p class="imprint-page__eyebrow">Legal Notice</p>
          <h1 id="imprint-title">Impressum</h1>
          <p class="imprint-page__intro">
            Angaben gemäß § 5 TMG sowie Kontaktinformationen und die
            verantwortliche Person für die Inhalte dieser Website.
          </p>
        </div>
      </section>

      <section class="imprint-page__content" aria-label="Impressum Angaben">
        <div class="imprint-page__shell imprint-page__layout">
          <aside class="imprint-page__summary">
            <p>Kontakt</p>
            <a href="mailto:kontakt@markusmorley.de">
              kontakt@markusmorley.de
            </a>
          </aside>

          <div class="imprint-page__cards">
            <article class="imprint-card imprint-card--lead">
              <span class="imprint-card__label">Angaben gemäß § 5 TMG</span>
              <div>
                <h2>Markus Morley</h2>
                <p>Webentwickler</p>
              </div>
            </article>

            <article class="imprint-card">
              <span class="imprint-card__label">E-Mail</span>
              <div>
                <h2>Kontakt</h2>
                <p>
                  E-Mail:
                  <a href="mailto:kontakt@markusmorley.de">
                    kontakt@markusmorley.de
                  </a>
                </p>
              </div>
            </article>

            <article class="imprint-card">
              <span class="imprint-card__label">Inhalt</span>
              <div>
                <h2>Verantwortlich</h2>
                <p>
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
                  <br />
                  Markus Morley
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(`Impressum - ${siteMetadata.title}`);
