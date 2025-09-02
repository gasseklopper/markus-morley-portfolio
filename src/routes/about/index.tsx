import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page relative">
      <div>
        <div>
          <img src="/assets/images/heros/image.png" alt="Applicant" />
          <div class="absolute inset-0 bg-[linear-gradient(25deg,black_5%,gray_60%,white_90%,teal)] bg-cover bg-center mix-blend-multiply" />
        </div>
        <div class="px-4 sm:px-0">
          <h1 class="text-base/7 font-semibold text-white">About</h1>
          <p class="mt-1 max-w-2xl text-sm/6 text-gray-400">
            This page gives information about the site.
          </p>
        </div>
      </div>

      <section class="mt-8 px-4 sm:px-0">
        <h2 class="text-3xl font-bold text-white">Hi, I'm Markus Morley</h2>
        <p class="mt-4 text-gray-300">
          I'm passionate about coding digital experiences and crafting user
          interfaces. Based in Frankfurt am Main, I dedicate my professional
          life to designing, developing, and bringing to life innovative digital
          solutions.
        </p>
      </section>

      <section class="mt-8 px-4 sm:px-0">
        <h2 class="text-3xl font-bold text-white">What I Do</h2>
        <div class="mt-6 space-y-8 text-gray-300">
          <div>
            <h3 class="text-xl font-semibold text-white">Design</h3>
            <p class="mt-2">
              I have a deep love for design. Whether it’s creating visually
              stunning layouts or ensuring seamless user experiences, I strive to
              merge creativity with functionality in every project. My design
              philosophy is rooted in understanding user needs and crafting
              intuitive, engaging interfaces.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white">Prototyping</h3>
            <p class="mt-2">
              Building UX prototypes is a core part of my work. I transform ideas
              into interactive prototypes that allow for early user testing and
              feedback. This iterative process helps refine the user experience
              and ensures that the final product meets user expectations.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white">
              Large-Scale Digital Projects
            </h3>
            <p class="mt-2">
              I develop and manage large-scale digital projects, leveraging
              modern technologies to create high-performance applications. My
              expertise spans from initial concept to final deployment, ensuring
              each project is executed with precision and meets the highest
              standards of quality.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white">Development</h3>
            <p class="mt-2">
              Specializing in frontend development, I create robust components
              using atomic design principles. This methodology allows for the
              development of scalable and maintainable user interfaces by
              breaking down designs into their simplest, reusable parts.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white">My Mission</h3>
            <p class="mt-2">
              My goal is to bridge the gap between design and development,
              creating digital experiences that are not only visually appealing
              but also highly functional. I am committed to continuous learning
              and staying updated with the latest industry trends to deliver
              cutting-edge solutions.
            </p>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-white">Forward</h3>
            <p class="mt-2">
              I look forward to collaborating with like-minded professionals and
              organizations to push the boundaries of what’s possible in the
              digital space. Let's create something extraordinary together!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(`About - ${siteConfig.metadata.title}`);
