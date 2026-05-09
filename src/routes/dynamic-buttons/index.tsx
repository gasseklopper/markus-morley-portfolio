import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

import "./dynamic-buttons.scss";

const modalSnippets = [
  `// wiggle loop
gsap.to(btn, {
  rotation: 12,
  duration: 1.5,
  repeat: -1,
  ease: "wiggle({wiggles:8, type:easeOut})"
});

// magnetic pull - overwrite: true kills the wiggle!
zone.addEventListener("mousemove", (e) => {
  const rect = zone.getBoundingClientRect();
  const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
  const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

  gsap.to(btn, {
    x: x * strength,
    y: y * strength,
    duration: 0.4,
    ease: "power2.out",
    overwrite: true
  });
});`,
  `// wiggle loop
gsap.to(btn, {
  rotation: 12,
  duration: 1.5,
  repeat: -1,
  ease: "wiggle({wiggles:8, type:easeOut})"
});

// magnetic pull - overwrite: "auto" keeps the wiggle!
zone.addEventListener("mousemove", (e) => {
  const rect = zone.getBoundingClientRect();
  const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
  const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

  gsap.to(btn, {
    x: x * strength,
    y: y * strength,
    duration: 0.4,
    ease: "power2.out",
    overwrite: "auto"
  });
});`,
  `// no wiggle - simply overwriting x and y.
zone.addEventListener("mousemove", (e) => {
  const rect = zone.getBoundingClientRect();
  const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
  const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

  gsap.to(btn, {
    x: x * strength,
    y: y * strength,
    duration: 0.4,
    ease: "power2.out",
    overwrite: true
  });
});`,
  `// magnetic pull - LONG duration on mousemove
zone.addEventListener("mousemove", (e) => {
  const rect = zone.getBoundingClientRect();
  const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
  const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

  gsap.to(btn, {
    x: x * strength,
    y: y * strength,
    duration: 1.5,
    ease: "power2.out",
    overwrite: false
  });
});`,
];

const demos = [
  {
    title: "magnetic only",
    description: "no wiggle, overwrite: true",
    mode: "true",
    wiggle: "false",
    theme: "summer",
    label: "dynamic",
    code: 2,
  },
  {
    title: "overwrite: false",
    description: "tweens may conflict",
    mode: "false",
    wiggle: "false",
    theme: "danger",
    label: "false",
    code: 3,
  },
  {
    title: "overwrite: true",
    description: "kills all other tweens on target",
    mode: "true",
    wiggle: "true",
    theme: "orange",
    label: "true",
    code: 0,
  },
  {
    title: 'overwrite: "auto"',
    description: "kills only conflicting props",
    mode: "auto",
    wiggle: "true",
    theme: "macha",
    label: "auto",
    code: 1,
  },
];

export default component$(() => {
  const rootRef = useSignal<HTMLElement>();
  const activeSnippet = useSignal<number | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const root = rootRef.value;
    if (!root) return;

    const gsapMod = await import("gsap");
    const customEaseMod = await import("gsap/CustomEase");
    const customWiggleMod = await import("gsap/CustomWiggle");
    const gsap = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;
    const CustomEase =
      (customEaseMod as any).CustomEase ?? (customEaseMod as any).default;
    const CustomWiggle =
      (customWiggleMod as any).CustomWiggle ?? (customWiggleMod as any).default;

    gsap.registerPlugin(CustomEase, CustomWiggle);

    const zones = Array.from(
      root.querySelectorAll<HTMLElement>(".dynamic-buttons__mag-zone"),
    );
    const strength = 0.4;
    const labelStrength = 0.24;
    const disposers: Array<() => void> = [];
    const wiggles: any[] = [];

    zones.forEach((zone) => {
      const btn = zone.querySelector<HTMLElement>(".dynamic-buttons__mag-btn");
      const label = zone.querySelector<HTMLElement>(".dynamic-buttons__label");
      if (!btn || !label) return;

      const mode = zone.dataset.mode ?? "auto";
      const overwrite =
        mode === "true" ? true : mode === "false" ? false : "auto";
      const isFalse = mode === "false";
      const hasWiggle = zone.dataset.wiggle === "true";

      if (hasWiggle) {
        wiggles.push(
          gsap.to(btn, {
            rotation: 12,
            duration: 1.5,
            repeat: -1,
            ease: "wiggle({wiggles:8,type:easeOut})",
          }),
        );
      }

      const move = (event: MouseEvent) => {
        const rect = zone.getBoundingClientRect();
        const mapX = gsap.utils.mapRange(
          rect.left,
          rect.right,
          -rect.width / 2,
          rect.width / 2,
          event.clientX,
        );
        const mapY = gsap.utils.mapRange(
          rect.top,
          rect.bottom,
          -rect.height / 2,
          rect.height / 2,
          event.clientY,
        );

        gsap.to(btn, {
          x: mapX * strength,
          y: mapY * strength,
          duration: isFalse ? 1.5 : 0.4,
          ease: "power2.out",
          overwrite,
        });

        gsap.to(label, {
          x: mapX * labelStrength,
          y: mapY * labelStrength,
          duration: isFalse ? 1.5 : 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const leave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: isFalse ? 0.5 : 0.7,
          ease: isFalse ? "power2.out" : "elastic.out(1,0.4)",
          overwrite,
        });

        gsap.to(label, {
          x: 0,
          y: 0,
          duration: isFalse ? 0.5 : 0.7,
          ease: isFalse ? "power2.out" : "elastic.out(1,0.4)",
          overwrite: true,
        });
      };

      zone.addEventListener("mousemove", move);
      zone.addEventListener("mouseleave", leave);
      disposers.push(() => {
        zone.removeEventListener("mousemove", move);
        zone.removeEventListener("mouseleave", leave);
      });
    });

    cleanup(() => {
      disposers.forEach((dispose) => dispose());
      wiggles.forEach((tween) => tween.kill());
      zones.forEach((zone) => {
        const btn = zone.querySelector<HTMLElement>(
          ".dynamic-buttons__mag-btn",
        );
        const label = zone.querySelector<HTMLElement>(
          ".dynamic-buttons__label",
        );
        if (btn) gsap.killTweensOf(btn);
        if (label) gsap.killTweensOf(label);
      });
    });
  });

  return (
    <main class="dynamic-buttons" ref={rootRef}>
      <header class="dynamic-buttons__header">
        <h1>
          Dynamic tweens <br />
          <code>overwrite: true</code> vs <code>"auto"</code>
        </h1>
      </header>

      <section
        class="dynamic-buttons__demo-area"
        aria-label="GSAP overwrite behavior demos"
      >
        {demos.map((demo) => (
          <div class="dynamic-buttons__demo-col" key={demo.label}>
            <div class="dynamic-buttons__demo-label">
              <b>{demo.title}</b>
              <br />
              {demo.description}
            </div>
            <div
              class="dynamic-buttons__mag-zone"
              data-mode={demo.mode}
              data-wiggle={demo.wiggle}
            >
              <button
                class={`dynamic-buttons__mag-btn dynamic-buttons__mag-btn--${demo.theme}`}
                type="button"
              >
                <div class="dynamic-buttons__bg" />
                <span class="dynamic-buttons__label">{demo.label}</span>
              </button>
            </div>
            <button
              class="dynamic-buttons__code-peek"
              type="button"
              aria-label={`Show code for ${demo.title}`}
              onClick$={() => {
                activeSnippet.value = demo.code;
              }}
            >
              &lt;/&gt;
            </button>
          </div>
        ))}
      </section>

      <div
        class={{
          "dynamic-buttons__modal-overlay": true,
          "dynamic-buttons__modal-overlay--open": activeSnippet.value !== null,
        }}
        role="presentation"
        onClick$={(event) => {
          const target = event.target as HTMLElement | null;

          if (target?.classList.contains("dynamic-buttons__modal-overlay")) {
            activeSnippet.value = null;
          }
        }}
      >
        <div
          class="dynamic-buttons__modal"
          role="dialog"
          aria-modal="true"
          aria-label="GSAP code example"
        >
          <button
            class="dynamic-buttons__modal-close"
            type="button"
            aria-label="Close code example"
            onClick$={() => {
              activeSnippet.value = null;
            }}
          >
            x
          </button>
          <pre>
            <code>
              {activeSnippet.value === null
                ? ""
                : modalSnippets[activeSnippet.value]}
            </code>
          </pre>
        </div>
      </div>
    </main>
  );
});

export const head = buildHead(`Dynamic Buttons - ${siteConfig.metadata.title}`);
