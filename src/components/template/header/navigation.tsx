import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import headerData from "./data";

export const Navigation = component$(() => {
  return (
    <nav>
      <ul>
        {headerData.nav?.map((item) => (
          <li key={item.link}>
            <Link href={item.link}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

export default Navigation;
