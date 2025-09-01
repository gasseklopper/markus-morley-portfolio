import { component$ } from "@builder.io/qwik";
import headerData from "./data";
import { PrefferencesToggle } from "./prefferences-toggle";
import Navigation2 from "./navigation2"

export const Header = component$(() => {
  return (
    <header>

      {headerData.nav?.length && (
        <>
          <Navigation2 />
        </>
      )}
      <PrefferencesToggle />
    </header>
  );
});

export default Header;
