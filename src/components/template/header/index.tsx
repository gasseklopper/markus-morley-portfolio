import { component$ } from "@builder.io/qwik";
import headerData from "./data";
import { Navigation } from "./navigation";
import { ThemeToggle } from "./theme-toggle";

export const Header = component$(() => {
  return (
    <header>
      {headerData.logo_text && <h1>{headerData.logo_text}</h1>}
      {headerData.nav?.length && <Navigation />}
      <ThemeToggle />
    </header>
  );
});

export default Header;
