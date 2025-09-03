export const aboutStyles = {
  page: "page relative text-text1",
  hero: {
    section: "relative h-72 w-full overflow-hidden rounded-b-xl",
    image: "h-full w-full object-cover",
    overlay:
      "absolute inset-0 bg-gradient-to-tr from-surface1 via-surface2 to-transparent",
    content: "absolute bottom-6 left-6",
    title: "text-4xl font-bold text-text1",
    description: "mt-2 max-w-xl text-sm text-text2",
  },
  container: "mx-auto max-w-5xl px-4 py-16",
  intro: {
    heading: "text-3xl font-bold text-text1",
    paragraph: "mt-4 text-text2",
  },
  whatIDo: {
    section: "mt-16",
    heading: "text-3xl font-bold text-text1",
    grid: "mt-8 grid gap-8 sm:grid-cols-2",
    card: "rounded-lg bg-surface2 p-6 shadow transition hover:bg-surface3",
    cardTitle: "text-xl font-semibold text-text1",
    cardDesc: "mt-2 text-text2",
  },
  resume: {
    section: "mt-16",
    heading: "text-3xl font-bold text-text1",
    timeline: "mt-8 space-y-6 border-l border-surface4 pl-6 text-text2",
    item: "relative",
    bullet: "absolute top-1 -left-3 h-2 w-2 rounded-full bg-primary",
    subHeading: "font-semibold",
  },
  resumeSubHeading: "mt-12 text-2xl font-bold text-text1",
  resumeList: "mt-4 list-disc space-y-2 pl-5 text-text2",
  link: "ml-1 underline",
};
