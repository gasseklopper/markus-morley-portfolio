import { component$, useStore, $, useOnWindow } from "@builder.io/qwik";
import footerData from "./data";

export const Footer = component$(() => {
  const state = useStore({ showScroll: false });

  useOnWindow(
    "scroll",
    $(() => {
      state.showScroll = window.scrollY > 100;
    }),
  );

  return (
    <footer class="mt-12 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div class="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-8 md:flex-row md:justify-between">
        <div class="flex flex-col gap-4">
          <a href="/" class="flex items-center gap-2" aria-label="Home">
            {footerData.brand?.logo && (
              <img
                src={footerData.brand.logo}
                alt=""
                width="32"
                height="32"
                class="h-8 w-auto"
              />
            )}
            <span class="font-semibold">{footerData.brand?.text}</span>
          </a>
          {footerData.promo && (
            <p class="text-sm">
              <a href={footerData.promo.link} class="underline">
                {footerData.promo.bodytext}
              </a>
            </p>
          )}
        </div>
        <nav aria-label="Footer" class="flex flex-col gap-8 sm:flex-row">
          <ul class="space-y-2">
            {footerData.nav?.column1?.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  class="text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <ul class="space-y-2">
            {footerData.nav?.column2?.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  class="text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div class="flex flex-col gap-4">
          {footerData.subscription?.enable && (
            <form class="flex" aria-label="Email subscription">
              <label for="footer-email" class="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder={footerData.subscription.input_placeholder}
                class="rounded-l-md bg-white px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                type="submit"
                class="rounded-r-md bg-blue-600 px-4 py-2 text-white dark:bg-blue-500"
              >
                {footerData.subscription.button_label}
              </button>
            </form>
          )}
          <ul class="flex gap-4" aria-label="Social media">
            {footerData.social?.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  aria-label={item.name}
                  class="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  {item.abbr}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {state.showScroll && (
        <button
          aria-label="Scroll to top"
          onClick$={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          class="fixed right-4 bottom-4 rounded-full bg-blue-600 p-3 text-white shadow-lg"
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </footer>
  );
});

export default Footer;
