import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

interface WorkItem {
  title: string;
  description: string;
}

const workItems: WorkItem[] = [
  {
    title: "Design",
    description:
      "I have a deep love for design. Whether it’s creating visually stunning layouts or ensuring seamless user experiences, I strive to merge creativity with functionality in every project.",
  },
  {
    title: "Prototyping",
    description:
      "Building UX prototypes is a core part of my work. I transform ideas into interactive prototypes that allow for early user testing and feedback.",
  },
  {
    title: "Large-Scale Digital Projects",
    description:
      "I develop and manage large-scale digital projects, leveraging modern technologies to create high-performance applications.",
  },
  {
    title: "Development",
    description:
      "Specializing in frontend development, I create robust components using atomic design principles for scalable and maintainable interfaces.",
  },
];

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page bg-surface1 text-text1">
      <section class="border-surface4 flex min-h-screen flex-col justify-end border-b p-8 md:p-20">
        <h1 class="text-6xl font-bold uppercase md:text-8xl">Markus Morley</h1>
        <p class="text-text1 mt-4 text-xl">
          Senior KI Frontend Product Engineer
        </p>
        <p class="text-text2 mt-4 max-w-xl text-sm md:text-base">
          I'm passionate about coding digital experiences and crafting user
          interfaces. Based in Frankfurt am Main, I dedicate my professional
          life to designing, developing, and bringing to life innovative digital
          solutions.
        </p>
        <a
          href="/portfolio"
          class="border-text1 hover:bg-text1 hover:text-surface1 mt-8 inline-block border-2 px-6 py-3 text-sm font-semibold uppercase transition-colors"
        >
          View Portfolio
        </a>
      </section>

      <section class="divide-surface4 grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
        {workItems.map((item) => (
          <div key={item.title} class="p-8">
            <h2 class="text-text1 text-3xl font-bold uppercase">
              {item.title}
            </h2>
            <p class="text-text2 mt-4 text-sm md:text-base">
              {item.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);
