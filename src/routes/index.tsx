import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
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
          <h3 class="text-base/7 font-semibold text-white">Applicant Information</h3>
          <p class="mt-1 max-w-2xl text-sm/6 text-gray-400">Personal details and application.</p>
        </div>
        <div class="mt-6 border-t border-white/10">
          <dl class="divide-y divide-white/10">
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-100">Full name</dt>
              <dd class="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Margot Foster</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-100">Application for</dt>
              <dd class="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Backend Developer</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-100">Email address</dt>
              <dd class="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-100">Salary expectation</dt>
              <dd class="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">$120,000</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-100">About</dt>
              <dd class="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.</dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-100">Attachments</dt>
              <dd class="mt-2 text-sm text-white sm:col-span-2 sm:mt-0">
                <ul role="list" class="divide-y divide-white/5 rounded-md border border-white/10">
                  <li class="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                    <div class="flex w-0 flex-1 items-center">
                      <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5 shrink-0 text-gray-500">
                        <path d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clip-rule="evenodd" fill-rule="evenodd" />
                      </svg>
                      <div class="ml-4 flex min-w-0 flex-1 gap-2">
                        <span class="truncate font-medium text-white">resume_back_end_developer.pdf</span>
                        <span class="shrink-0 text-gray-500">2.4mb</span>
                      </div>
                    </div>
                    <div class="ml-4 shrink-0">
                      <a href="#" class="font-medium text-indigo-400 hover:text-indigo-300">Download</a>
                    </div>
                  </li>
                  <li class="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                    <div class="flex w-0 flex-1 items-center">
                      <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5 shrink-0 text-gray-500">
                        <path d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clip-rule="evenodd" fill-rule="evenodd" />
                      </svg>
                      <div class="ml-4 flex min-w-0 flex-1 gap-2">
                        <span class="truncate font-medium text-white">coverletter_back_end_developer.pdf</span>
                        <span class="shrink-0 text-gray-500">4.5mb</span>
                      </div>
                    </div>
                    <div class="ml-4 shrink-0">
                      <a href="#" class="font-medium text-indigo-400 hover:text-indigo-300">Download</a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <h1 class="title_barlowBold">Hi 👋 barlowBold</h1>
      <h2 class="title_barlowMedium">Hi 👋 barlowMedium</h2>
      <h3 class="title_barlowLight">Hi 👋 barlowLight</h3>
      <h4 class="title_barlowSemibold">Hi 👋 barlowSemibold</h4>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        <div class="bg-red-500 p-4 text-white">Item 1</div>
        <div class="bg-blue-500 p-4 text-white">Item 2</div>
        <div class="bg-blue-500 p-4 text-white">Item 3</div>
        <div class="bg-blue-500 p-4 text-white">Item 4</div>
        <div class="bg-blue-500 p-4 text-white">Item 5</div>
        <div class="bg-blue-500 p-4 text-white">Item 6</div>
        <div class="bg-blue-500 p-4 text-white">Item 7</div>
        <div class="bg-blue-500 p-4 text-white">Item 8</div>
        <div class="bg-blue-500 p-4 text-white">Item 9</div>
        <div class="bg-blue-500 p-4 text-white">Item 10</div>
      </div>
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);
