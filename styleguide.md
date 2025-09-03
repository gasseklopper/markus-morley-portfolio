# About Page Style Guide

This document outlines the design tokens and Tailwind utility classes used on the
About page. All styles are centralised in `src/routes/about/styleguide.ts` and
consumed by the page for consistent styling.

## Colors

- `text1`/`text2`: primary and secondary text colors.
- `surface1`-`surface4`: background surfaces and gradients.
- `primary`: accent color used for timeline bullets.

## Typography

- Hero title: `text-4xl font-bold`.
- Section titles: `text-3xl font-bold`.
- Resume subheadings: `text-2xl font-bold`.
- Body text: `text-sm` for hero description, `text-base` elsewhere.

## Layout

- Page container: `mx-auto max-w-5xl px-4 py-16`.
- Hero section: `h-72 w-full` with gradient overlay.
- Work grid: `grid gap-8 sm:grid-cols-2`.
- Resume timeline: `space-y-6 border-l pl-6`.

## Components

- **Hero**: image with gradient overlay and text block.
- **Work Cards**: `rounded-lg bg-surface2 p-6 shadow` and hover state.
- **Resume**: vertical timeline with bullet indicators and lists.
- **Links**: consistent spacing using `ml-1 underline` style.

Refer to `src/routes/about/styleguide.ts` for the exact Tailwind class tokens
used by each component.
