# Markus Morley Portfolio

Personal site built with [Qwik City](https://qwik.dev/qwikcity/overview/) and deployed to Netlify Edge Functions. The application uses [Vite](https://vitejs.dev/) and includes a PWA service worker with offline caching.

Useful links:

- [Qwik documentation](https://qwik.dev/)
- [Community Discord](https://qwik.dev/chat)
- [GitHub repository](https://github.com/QwikDev/qwik)
- [@QwikDev on X](https://twitter.com/QwikDev)

---

## Dependencies

- [normalize.css](https://necolas.github.io/normalize.css/) - ensures consistent base styling across browsers.

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    ├── styles/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. See `src/routes/index.scss` for an example of using SCSS variables in a route. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `src/styles`: Global styles and SCSS variables.

- `src/utils`: Shared helpers. For example `src/utils/head.ts` provides a
  `buildHead()` function used across routes to create `DocumentHead` values.
- `src/config/portfolio-pages.json`: List of individual portfolio pages used for the portfolio listing and sitemap. Each entry provides a `name`, `path`, `title` and `description`.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Routes

This starter includes a few basic routes:

- `/` - Home page
- `/about` - About section
- `/portfolio` - Portfolio listing

A sitemap is generated at `/sitemap.xml` using Qwik City.
Route metadata is defined via a shared `buildHead()` helper to keep pages consistent. Individual portfolio pages are defined in `src/config/portfolio-pages.json` and included in the sitemap.
Each portfolio entry also specifies a title and description used by the respective page.

## Scripts

- `npm start` - run the dev server with server-side rendering.
- `npm run preview` - preview a production build locally.
- `npm run build` - generate client and server output.
- `npm run fmt` - format all files with Prettier.
- `npm run lint` - check code quality with ESLint.
- `npm run cypress.open` - open Cypress component test runner.
- `npm run cypress.run` - run Cypress component tests in headless mode.
- `npm run cypress.install` - download the Cypress binary if missing.

## Service Worker

The project uses `vite-plugin-pwa` to provide offline support. Failed requests route to `/404` and both HTML and JSON responses are cached separately.

## Deployment

The site is configured for Netlify Edge Functions. Install the Netlify CLI (`npm i -g netlify-cli`) to preview with `netlify dev` and deploy using:

```shell
netlify deploy --build
```

Add `--prod` to publish to production.

## Preference scripts

User preferences for theme, layout and motion are applied on first page load via
inline scripts. These scripts set `data-*` attributes on the `<html>` element so
the UI reflects saved settings before Qwik hydrates. The bundled component
`PreferenceScripts` lives in `src/components/theme/preference-scripts.tsx` and is
injected in `src/root.tsx`. Default values for theme, cursor and layout settings
come from `src/config/siteConfig.json` so they can be customized per site.
