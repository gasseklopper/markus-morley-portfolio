import { component$ } from "@builder.io/qwik";
import headerData from "./data";
import { Navigation } from "./navigation";
import { PrefferencesToggle } from "./prefferences-toggle";
import Navigation2 from "./navigation2"

export const Header = component$(() => {
  return (
    <header>

      {headerData.nav?.length && (
        <>
          {/* <Navigation /> */}
          <Navigation2 />
        </>
      )}
      <PrefferencesToggle />
    </header>
  );
});

export default Header;
