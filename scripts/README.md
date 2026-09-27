# Browser regression checks

Start the app at `http://127.0.0.1:5173`, then run `npm run test.e2e`.
The tests cover the homepage's pinned scroll animation, menu/Escape behavior,
and navigation away from and back to the homepage.

`npm run test.firefox` uses Firefox's native WebDriver BiDi protocol because
the installed Cypress 12 cannot connect to current Firefox versions using CDP.
It requires Node 22+ and an installed Firefox; no extra npm package is needed.
Set `FIREFOX_BIN` if Firefox is not at the default Windows installation path.
It starts a separate headless profile and deletes only that temporary profile
afterwards. Set `REDUCED_MOTION=1` to check the static, non-overlapping fallback.

For production verification, run `npm run build.client` and
`npm run build.preview`, start `vite preview` on port 5174, and set
`TEST_URL=http://127.0.0.1:5174/` before running the Firefox check.
Screenshots are saved under `cypress/screenshots/firefox/`.
