import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "../index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="page relative">
    <div>
      <div class="">
        <img src="/assets/images/heros/image.png" alt="Applicant" />
        <div class="absolute inset-0 bg-[linear-gradient(25deg,black_5%,gray_60%,white_90%,teal)] bg-cover bg-center mix-blend-multiply" >
        </div>
      </div>
      <div class="px-4 sm:px-0">
          <h1 class="text-base/7 font-semibold text-white">About</h1>
          <p class="mt-1 max-w-2xl text-sm/6 text-gray-400">This page gives information about the site.</p>
      </div>

    </div>



      <h1>About</h1>
      <p>This page gives information about the site.</p>
    </div>
  );
});

export const head = buildHead(`About - ${siteConfig.metadata.title}`);
