import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page">
      <h1>Datenschutz</h1>
      <p>
        Verantwortlicher dieser Website ist Markus Morley, Webentwickler. Der
        Schutz Ihrer Daten hat für uns einen hohen Stellenwert.
      </p>
      <p>
        Beim Besuch dieser Website werden automatisch technische Informationen
        in sogenannten Server-Logfiles erfasst. Diese Daten lassen keine
        Rückschlüsse auf Ihre Person zu und dienen ausschließlich der
        Bereitstellung der Website.
      </p>
      <p>
        Personenbezogene Daten verarbeiten wir nur, wenn Sie uns diese
        freiwillig, etwa per E-Mail, mitteilen. Ihre Angaben verwenden wir
        ausschließlich zur Bearbeitung Ihrer Anfrage.
      </p>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung oder Löschung Ihrer
        gespeicherten Daten. Wenden Sie sich dazu jederzeit an
        <a href="mailto:kontakt@markusmorley.de"> kontakt@markusmorley.de</a>.
      </p>
    </div>
  );
});

export const head = buildHead(`Datenschutz - ${siteConfig.metadata.title}`);
