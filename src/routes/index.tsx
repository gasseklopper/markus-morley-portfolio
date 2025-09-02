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
    <div class="page bg-white text-black dark:bg-black dark:text-white">
      <section class="min-h-screen flex flex-col justify-end border-b border-black dark:border-white p-8 md:p-20">
        <h1 class="text-6xl md:text-8xl font-bold uppercase">Markus Morley</h1>
        <p class="mt-4 text-xl">Senior KI Frontend Product Engineer</p>
        <p class="mt-4 max-w-xl text-sm md:text-base">
          I'm passionate about coding digital experiences and crafting user
          interfaces. Based in Frankfurt am Main, I dedicate my professional
          life to designing, developing, and bringing to life innovative
          digital solutions.
        </p>
        <a
          href="/portfolio"
          class="mt-8 inline-block border-2 border-black dark:border-white px-6 py-3 text-sm font-semibold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          View Portfolio
        </a>
      </section>

      <section class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black dark:divide-white">
        {workItems.map((item) => (
          <div key={item.title} class="p-8">
            <h2 class="text-3xl font-bold uppercase">{item.title}</h2>
            <p class="mt-4 text-sm md:text-base">{item.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);

