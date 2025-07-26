import { component$ } from "@builder.io/qwik";
import headerData from "./data";
import { Navigation } from "./navigation";

export const Header = component$(() => {
  return (
    <header>
      {headerData.logo_text && <h1>{headerData.logo_text}</h1>}
      {headerData.nav?.length && <Navigation />}
    </header>
  );
});

export default Header;
