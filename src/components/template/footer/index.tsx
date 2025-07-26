import { component$ } from "@builder.io/qwik";
import footerData from "./data";

export const Footer = component$(() => {
  return (
    <footer>
      {footerData.promo && (
        <p>
          <a href={footerData.promo.link}>{footerData.promo.bodytext}</a>
        </p>
      )}
      {footerData.email && (
        <p>
          Email: <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
        </p>
      )}
      {footerData.mobile && (
        <p>
          Phone: <a href={`tel:${footerData.mobile}`}>{footerData.mobile}</a>
        </p>
      )}
      {footerData.open_date && <p>{footerData.open_date}</p>}
      {footerData.open_time && <p>{footerData.open_time}</p>}
      {footerData.address?.name && (
        <p>
          Address:{" "}
          {footerData.address.link ? (
            <a href={footerData.address.link}>{footerData.address.name}</a>
          ) : (
            footerData.address.name
          )}
        </p>
      )}
      {footerData.copyright?.enable && (
        <p>
          {footerData.copyright.label}{" "}
          {footerData.copyright.link ? (
            <a href={footerData.copyright.link}>
              {footerData.copyright.company}
            </a>
          ) : (
            footerData.copyright.company
          )}
        </p>
      )}
    </footer>
  );
});

export default Footer;
