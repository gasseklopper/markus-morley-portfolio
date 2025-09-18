import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import LevelUpIndicator, {
  type LevelUpIndicatorHandle,
  type LevelUpIntensity,
} from "~/components/level-up-indicator/level-up-indicator";

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
  const enabled = useSignal(true);
  const intensity = useSignal<LevelUpIntensity>("default");
  const color = useSignal("#65f0ff");
  const intervalMin = useSignal(6000);
  const intervalMax = useSignal(8000);
  const ariaLive = useSignal<"off" | "polite">("off");
  const indicatorHandle = useSignal<LevelUpIndicatorHandle | undefined>(undefined);

  const triggerCelebrate = $(async () => {
    await indicatorHandle.value?.celebrate?.();
  });

  return (
    <div class="page bg-[var(--surface1)] text-[var(--text1)]">
      <LevelUpIndicator
        enabled={enabled.value}
        intensity={intensity.value}
        color={color.value}
        intervalMinMs={intervalMin.value}
        intervalMaxMs={intervalMax.value}
        ariaLive={ariaLive.value}
        celebrateRef={indicatorHandle}
      />

      <div class="fixed bottom-6 right-6 z-[10000] w-[min(320px,calc(100vw-3rem))] rounded-2xl border border-white/10 bg-[rgba(8,22,28,0.82)] p-5 text-xs font-medium uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--text1)_85%,transparent)] shadow-[0_18px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <h2 class="text-[0.75rem] font-semibold text-[color-mix(in_srgb,var(--text1)_90%,transparent)]">
          Level-up indicator demo
        </h2>
        <div class="mt-4 flex flex-col gap-3 text-[0.68rem] normal-case tracking-normal">
          <label class="flex items-center justify-between gap-3">
            <span class="text-[color-mix(in_srgb,var(--text1)_75%,transparent)]">Enabled</span>
            <input
              type="checkbox"
              class="h-4 w-4 accent-[#65f0ff]"
              checked={enabled.value}
              onInput$={$((event) => {
                const input = event.target as HTMLInputElement;
                enabled.value = input.checked;
              })}
            />
          </label>
          <label class="flex items-center justify-between gap-3">
            <span class="text-[color-mix(in_srgb,var(--text1)_75%,transparent)]">Intensity</span>
            <select
              class="min-w-[120px] rounded-lg border border-white/10 bg-[rgba(12,32,40,0.6)] px-2 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--text1)_85%,transparent)] focus:outline-none focus:ring-2 focus:ring-[#65f0ff]/60"
              value={intensity.value}
              onInput$={$((event) => {
                const select = event.target as HTMLSelectElement;
                intensity.value = select.value as LevelUpIntensity;
              })}
            >
              <option value="subtle">Subtle</option>
              <option value="default">Default</option>
              <option value="loud">Loud</option>
            </select>
          </label>
          <label class="flex items-center justify-between gap-3">
            <span class="text-[color-mix(in_srgb,var(--text1)_75%,transparent)]">Accent</span>
            <input
              type="color"
              class="h-7 w-16 cursor-pointer rounded border border-white/10 bg-transparent"
              value={color.value}
              onInput$={$((event) => {
                const input = event.target as HTMLInputElement;
                color.value = input.value;
              })}
            />
          </label>
          <div class="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2">
            <span class="text-[color-mix(in_srgb,var(--text1)_75%,transparent)]">Interval</span>
            <div class="flex items-center gap-2">
              <input
                type="number"
                min={0}
                class="w-20 rounded-lg border border-white/10 bg-[rgba(12,32,40,0.6)] px-2 py-1 text-[0.7rem] focus:outline-none focus:ring-2 focus:ring-[#65f0ff]/60"
                value={intervalMin.value}
                onInput$={$((event) => {
                  const input = event.target as HTMLInputElement;
                  const parsed = Number.parseInt(input.value, 10);
                  const safe = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
                  intervalMin.value = safe;
                  if (intervalMin.value > intervalMax.value) {
                    intervalMax.value = intervalMin.value;
                  }
                })}
              />
              <span class="text-[color-mix(in_srgb,var(--text1)_55%,transparent)]">to</span>
              <input
                type="number"
                min={0}
                class="w-20 rounded-lg border border-white/10 bg-[rgba(12,32,40,0.6)] px-2 py-1 text-[0.7rem] focus:outline-none focus:ring-2 focus:ring-[#65f0ff]/60"
                value={intervalMax.value}
                onInput$={$((event) => {
                  const input = event.target as HTMLInputElement;
                  const parsed = Number.parseInt(input.value, 10);
                  const safe = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
                  intervalMax.value = safe;
                  if (intervalMin.value > intervalMax.value) {
                    intervalMin.value = intervalMax.value;
                  }
                })}
              />
            </div>
          </div>
          <label class="flex items-center justify-between gap-3">
            <span class="text-[color-mix(in_srgb,var(--text1)_75%,transparent)]">Aria live</span>
            <select
              class="min-w-[120px] rounded-lg border border-white/10 bg-[rgba(12,32,40,0.6)] px-2 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--text1)_85%,transparent)] focus:outline-none focus:ring-2 focus:ring-[#65f0ff]/60"
              value={ariaLive.value}
              onInput$={$((event) => {
                const select = event.target as HTMLSelectElement;
                ariaLive.value = select.value as "off" | "polite";
              })}
            >
              <option value="off">Off</option>
              <option value="polite">Polite</option>
            </select>
          </label>
          <button
            class="mt-1 inline-flex items-center justify-center rounded-full border border-[#65f0ff]/40 bg-[#65f0ff]/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#aef6ff] transition hover:bg-[#65f0ff]/20"
            onClick$={triggerCelebrate}
          >
            Celebrate now
          </button>
        </div>
      </div>

      <section class="flex min-h-screen flex-col justify-end border-b border-[var(--text1)] p-8 md:p-20">
        <h1 class="text-6xl font-bold uppercase md:text-8xl">Markus Morley</h1>
        <p class="mt-4 text-xl">Senior KI Frontend Product Engineer</p>
        <p class="mt-4 max-w-xl text-sm md:text-base">
          I'm passionate about coding digital experiences and crafting user
          interfaces. Based in Frankfurt am Main, I dedicate my professional
          life to designing, developing, and bringing to life innovative digital
          solutions.
        </p>
        <a
          href="/portfolio"
          class="mt-8 inline-block border-2 border-[var(--text1)] px-6 py-3 text-sm font-semibold uppercase transition-colors hover:bg-[var(--text1)] hover:text-[var(--surface1)]"
        >
          View Portfolio
        </a>
      </section>

      <section class="grid divide-y divide-[var(--text1)] md:grid-cols-2 md:divide-x md:divide-y-0">
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
