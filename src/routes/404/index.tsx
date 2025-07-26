import { component$ } from "@builder.io/qwik";
import {
  Link,
  routeLoader$,
  useNavigate,
} from "@builder.io/qwik-city";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export const useServerTime = routeLoader$(() => {
  return Date.now();
});

export default component$(() => {
  const nav = useNavigate();
  const serverTime = useServerTime();

  return (
    <div class="page">
      <h1>{siteConfig.page_404.title}</h1>
      <p>{siteConfig.page_404.description}</p>
      <p>
        <Link href={siteConfig.page_404.link.url}>{siteConfig.page_404.link.text}</Link>
      </p>
      <div>
        <Link reload>Refresh (better accessibility)</Link>
        <button onClick$={() => nav()}>Refresh</button>
        <p>Server time: {serverTime.value}</p>
      </div>
    </div>
  );
});

export const head = buildHead(
  siteConfig.page_404.title,
  siteConfig.page_404.description,
);
