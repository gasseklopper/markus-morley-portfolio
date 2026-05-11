# Asset Boundaries

Use `public/assets` for runtime-addressable files that are referenced by URL, such as portfolio previews, gallery photography, favicons, and p5 or D3 demo inputs.

Use `src/media/assets` for assets imported through the bundler, especially optimized Qwik image imports such as `?jsx`.

Current scan notes:

- No byte-identical files are shared between `public/assets` and `src/media/assets`.
- The duplicate icon PNGs under `public/assets` are intentional manifest/favicon aliases.
- `public/assets/images/photography/image2.png` is reused as `public/assets/portfolio/color-theme/preview.png`.
- `public/assets/images/photography/image5.png` is reused as `public/assets/portfolio/generative-art/preview.png`.

Before adding new route assets, prefer `public/assets/portfolio/<project>/preview.png` for cards and keep route-specific imported media under `src/media/assets/<area>/`.
