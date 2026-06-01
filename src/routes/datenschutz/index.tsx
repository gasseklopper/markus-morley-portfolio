import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./datenschutz.scss?inline";
import { siteMetadata } from "~/config/site";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="privacy-page page">
      <section class="privacy-page__hero" aria-labelledby="privacy-title">
        <div class="privacy-page__shell">
          <p class="privacy-page__eyebrow">Legal</p>
          <h1 id="privacy-title">Datenschutz</h1>
          <p class="privacy-page__intro">
            Der Schutz personenbezogener Daten ist wichtig. Diese Seite fasst
            zusammen, welche Daten beim Besuch dieser Website verarbeitet werden
            und wie Sie Ihre Rechte wahrnehmen können.
          </p>
        </div>
      </section>

      <section class="privacy-page__content" aria-label="Datenschutzerklärung">
        <div class="privacy-page__shell privacy-page__grid">
          <aside class="privacy-page__toc" aria-label="Inhalt">
            <p>Inhalt</p>
            <a href="#verantwortlicher">Verantwortlicher</a>
            <a href="#server-logfiles">Server-Logfiles</a>
            <a href="#kontakt">Kontaktaufnahme</a>
            <a href="#rechte">Ihre Rechte</a>
          </aside>

          <div class="privacy-page__sections">
            <article id="verantwortlicher" class="privacy-card">
              <span class="privacy-card__number">01</span>
              <div>
                <h2>Verantwortlicher</h2>
                <p>
                  Verantwortlicher dieser Website ist Markus Morley,
                  Webentwickler. Der Schutz Ihrer Daten hat für uns einen hohen
                  Stellenwert.
                </p>
              </div>
            </article>

            <article id="server-logfiles" class="privacy-card">
              <span class="privacy-card__number">02</span>
              <div>
                <h2>Server-Logfiles</h2>
                <p>
                  Beim Besuch dieser Website werden automatisch technische
                  Informationen in sogenannten Server-Logfiles erfasst. Diese
                  Daten lassen keine Rückschlüsse auf Ihre Person zu und dienen
                  ausschließlich der Bereitstellung der Website.
                </p>
              </div>
            </article>

            <article id="kontakt" class="privacy-card">
              <span class="privacy-card__number">03</span>
              <div>
                <h2>Kontaktaufnahme</h2>
                <p>
                  Personenbezogene Daten verarbeiten wir nur, wenn Sie uns diese
                  freiwillig, etwa per E-Mail, mitteilen. Ihre Angaben verwenden
                  wir ausschließlich zur Bearbeitung Ihrer Anfrage.
                </p>
              </div>
            </article>

            <article id="rechte" class="privacy-card privacy-card--contact">
              <span class="privacy-card__number">04</span>
              <div>
                <h2>Ihre Rechte</h2>
                <p>
                  Sie haben das Recht auf Auskunft, Berichtigung oder Löschung
                  Ihrer gespeicherten Daten. Wenden Sie sich dazu jederzeit an
                  <a href="mailto:kontakt@markusmorley.de">
                    kontakt@markusmorley.de
                  </a>
                  .
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(`Datenschutz - ${siteMetadata.title}`);
