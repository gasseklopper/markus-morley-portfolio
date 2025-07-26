import { component$ } from "@builder.io/qwik";
import headerData from "./data";

export const Header = component$(() => {
  return (
    <header>
      {headerData.logo_text && <h1>{headerData.logo_text}</h1>}
      {headerData.nav?.length && (
        <nav>
          <ul>
            {headerData.nav.map((item) => (
              <li key={item.link}>
                <a href={item.link}>{item.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
});

export default Header;
