export const treemapConfig = {
  datasetUrl:
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  colorPalette: [
    "#38bdf8",
    "#22d3ee",
    "#a855f7",
    "#f472b6",
    "#f97316",
    "#facc15",
    "#4ade80",
    "#2dd4bf",
    "#818cf8",
    "#e879f9",
    "#fb7185",
    "#f59e0b",
  ],
  minWidth: 360,
  minHeight: 460,
  heightRatio: 0.625,
  legendMinWidth: 320,
  legendMaxWidth: 720,
  legendRectSize: 18,
  legendPadding: 12,
  legendColumnWidth: 180,
  legendRowHeight: 32,
} as const;

export const treemapCaseStudyStyles = `
  .project-page {
    gap: clamp(2rem, 4vw, 3rem);
    padding-block: clamp(2.5rem, 5vw, 4rem) clamp(4rem, 8vw, 6rem);
  }

  .case-study-content {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    width: min(1080px, 100%);
  }

  .case-study-intro {
    display: grid;
    gap: 1rem;
    justify-items: center;
    text-align: center;
  }

  .case-study-intro h1 {
    color: var(--text1, #f8fafc);
  }

  .case-study-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    color: var(--text3, #94a3b8);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.32em;
  }

  .case-study-description {
    font-size: clamp(1rem, 0.9rem + 0.4vw, 1.15rem);
    line-height: 1.7;
    color: var(--text2, #e2e8f0);
    max-width: 72ch;
  }

  .case-study-layout {
    display: grid;
    gap: clamp(2rem, 5vw, 3rem);
    grid-template-columns: minmax(0, 1fr);
  }

  .case-study-notes {
    display: grid;
    gap: 1.25rem;
    padding: clamp(1.5rem, 3vw, 2.25rem);
    border-radius: 1.5rem;
    border: 1px solid color-mix(in srgb, var(--surface-border, #1e293b) 55%, transparent);
    background: color-mix(in srgb, var(--surface-glass-1, #1e293b) 90%, transparent);
    box-shadow: 0 24px 90px rgba(15, 23, 42, 0.35);
  }

  .case-study-notes h2 {
    text-transform: uppercase;
    letter-spacing: 0.24em;
    font-size: 0.95rem;
    color: var(--text1, #f8fafc);
  }

  .case-study-notes p {
    text-align: left;
    max-width: none;
    color: var(--text2, #e2e8f0);
  }

  .open-demo-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    align-self: start;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--primary, #38bdf8) 85%, transparent);
    color: var(--brand-inverted, #0f172a);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    box-shadow: 0 18px 60px color-mix(in srgb, var(--primary, #38bdf8) 45%, transparent);
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .open-demo-link:hover,
  .open-demo-link:focus-visible {
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--primary, #38bdf8) 95%, var(--brand-core, #0ea5e9) 5%);
    box-shadow: 0 24px 80px color-mix(in srgb, var(--primary, #38bdf8) 55%, transparent);
  }

  .visual-wrapper {
    justify-self: center;
    width: 100%;
  }
`;
