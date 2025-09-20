import { component$ } from "@builder.io/qwik";
import ImgHeroPortrait from "~/media/assets/images/heros/image.png?jsx";

const biographyItems = [
  { label: "Name", value: "Michel Hark" },
  { label: "Nationality", value: "Germany" },
  { label: "Phone", value: "+49 170 874 302" },
  { label: "Email", value: "info@example.com" },
  { label: "Experience", value: "10+ years" },
  { label: "Freelance", value: "Available" },
  { label: "Website", value: "michel.hark.de" },
  { label: "Language", value: "German, English" },
];

const services = [
  {
    title: "Design",
    description: "Creative interaction design for my client who don't love.",
  },
  {
    title: "Development",
    description: "Creative interaction design for my client who don't love.",
  },
  {
    title: "Marketing",
    description: "Creative interaction design for my client who don't love.",
  },
];

export const AboutProfile = component$(() => {
  return (
    <section class="relative mx-auto mt-16 w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#202859] via-[#1c2149] to-[#151935] px-6 py-12 text-white shadow-2xl md:px-12">
      <div class="grid gap-12 lg:grid-cols-[320px_1fr] lg:items-start">
        <div class="relative flex flex-col items-center gap-6 rounded-[2.5rem] bg-[#272f65]/70 px-8 py-10 text-center backdrop-blur">
          <div class="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white/20 bg-white/10">
            <ImgHeroPortrait
              alt="Adam Hark portrait"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h2 class="text-2xl font-semibold">Adam Hark</h2>
            <p class="mt-1 text-sm uppercase tracking-widest text-white/70">
              Back-End Developer
            </p>
          </div>
          <a
            class="inline-flex items-center justify-center rounded-full bg-[#fdd446] px-6 py-3 text-sm font-semibold text-[#121429] shadow-lg shadow-[#fdd446]/40 transition hover:-translate-y-0.5 hover:bg-[#ffe27d] hover:shadow-xl"
            href="#download-cv"
          >
            Download CV
          </a>
          <div class="flex flex-col items-center gap-3 text-sm text-white/60">
            <span class="font-semibold uppercase tracking-[0.3em] text-white/50">
              Follow me
            </span>
            <div class="flex items-center gap-3">
              <span class="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 shadow-inner">
                in
              </span>
              <span class="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 shadow-inner">
                dr
              </span>
              <span class="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 shadow-inner">
                be
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-12">
          <article class="rounded-[2.5rem] bg-white/5 p-8 text-sm text-white/80 shadow-lg shadow-black/20 backdrop-blur">
            <header class="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.4em] text-[#fdd446]">
                  Biography
                </p>
                <h3 class="text-3xl font-semibold text-white">Biography</h3>
              </div>
            </header>
            <p class="max-w-3xl leading-relaxed">
              Hi, my name is Michel Hark and I began using WordPress when first began. I've
              spent most of my professional life over the last ten years designing,
              programming and operating WordPress sites go beyond with exclusive design.
              Apart from this I love to travel, mentor designers, review design websites and
              read books on everything related to design. I have also given lectures in
              various educational institutions. So I love creating creative content, and you
              can find most of my works here.
            </p>
            <dl class="mt-8 grid gap-4 sm:grid-cols-2">
              {biographyItems.map((item) => (
                <div key={item.label} class="flex flex-col gap-1 rounded-2xl bg-white/5 p-4">
                  <dt class="text-xs font-semibold uppercase tracking-wide text-white/60">
                    {item.label}
                  </dt>
                  <dd class="text-base font-medium text-white">{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article class="rounded-[2.5rem] bg-white/5 p-8 text-white/80 shadow-lg shadow-black/20 backdrop-blur">
            <header class="mb-8 flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.4em] text-[#fdd446]">
                  My Services
                </p>
                <h3 class="text-3xl font-semibold text-white">My Services</h3>
              </div>
            </header>
            <div class="grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  class="group relative flex flex-col gap-3 rounded-3xl bg-[#272f65]/70 p-6 text-sm text-white/70 transition duration-300 hover:-translate-y-1 hover:bg-[#313b86]/80"
                >
                  <span class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-semibold text-white/80">
                    {service.title[0]}
                  </span>
                  <h4 class="text-xl font-semibold text-white">{service.title}</h4>
                  <p class="leading-relaxed">{service.description}</p>
                  <span class="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#fdd446]">
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.22 14.78a.75.75 0 0 1 0-1.06L10.94 8l-5.72-5.72a.75.75 0 1 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
});

export default AboutProfile;
