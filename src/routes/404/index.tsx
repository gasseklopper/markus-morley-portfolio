import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  Link,
  routeLoader$,
  useLocation,
  useNavigate,
} from "@builder.io/qwik-city";
import { themeStorageKey } from "~/components/theme/preference-scripts";
import { notFoundPage } from "~/config/site";
import { buildHead } from "~/utils/head";
import { loadGsap } from "~/utils/gsapClient";
import "./not-found.scss";

export const useServerTimeLoader = routeLoader$(() => new Date().toISOString());

const particleImages = [
  "/assets/portfolio/oststern/preview.jpg",
  "/assets/portfolio/swissport/preview.jpg",
  "/assets/portfolio/test-codex/ChatGPT Image 16. Mai 2026, 22_34_32.png",
  "/assets/images/photography/portrait/Portrait_043.jpg",
  "/assets/portfolio/generative-art/preview.png",
  "/assets/portfolio/farbkasten/preview.png",
  "/assets/images/photography/black/Template_index_017.jpg",
  "/assets/portfolio/color-palette/preview.png",
  "/assets/images/photography/venedig/IMG_2094.jpg",
  "/assets/portfolio/project017/preview.png",
  "/assets/portfolio/drip-sort/preview.png",
  "/assets/portfolio/connected-agents/preview.png",
];

const particles = particleImages.map((src, index) => ({
  src,
  size: 86 + (index % 4) * 24,
  x: 12 + ((index * 23) % 76),
  y: 12 + ((index * 31) % 70),
  rotate: (index % 2 === 0 ? 1 : -1) * (6 + index * 2),
}));

const themeOptions = ["light", "dark", "neon", "pastell"] as const;
type ThemeName = (typeof themeOptions)[number];

const formatThemeName = (theme: ThemeName) =>
  theme.charAt(0).toUpperCase() + theme.slice(1);

export default component$(() => {
  const serverTime = useServerTimeLoader();
  const nav = useNavigate();
  const location = useLocation();
  const currentTheme = useSignal<ThemeName | undefined>();
  const refinedTitle = notFoundPage.title.replace(/^404\s*-\s*/i, "").trim();
  const formattedServerTime = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(serverTime.value));

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const storedTheme = localStorage.getItem(themeStorageKey) as ThemeName | null;
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const theme =
      storedTheme && themeOptions.includes(storedTheme)
        ? storedTheme
        : preferredTheme;

    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);

    if (!storedTheme) {
      localStorage.setItem(themeStorageKey, theme);
    }

    const observer = new MutationObserver(() => {
      const nextTheme = document.documentElement.getAttribute(
        "data-theme",
      ) as ThemeName | null;

      if (nextTheme && themeOptions.includes(nextTheme)) {
        currentTheme.value = nextTheme;
      }
    });

    observer.observe(document.documentElement, { attributes: true });
    cleanup(() => observer.disconnect());
  });

  const setTheme$ = $((theme: ThemeName) => {
    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(themeStorageKey, theme);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const root = document.querySelector<HTMLElement>("[data-not-found-page]");
    const stage = root?.querySelector<HTMLElement>("[data-particle-stage]");
    const particleNodes = root
      ? Array.from(root.querySelectorAll<HTMLElement>("[data-particle]"))
      : [];

    if (!root || !stage || particleNodes.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap } = await loadGsap({ scrollTrigger: false });
    const context = gsap.context(() => {
      gsap.set(particleNodes, {
        transformOrigin: "50% 50%",
        xPercent: -50,
        yPercent: -50,
      });

      gsap.fromTo(
        "[data-404-kicker], [data-404-title], [data-404-copy], [data-404-actions]",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.08,
        },
      );

      gsap.fromTo(
        particleNodes,
        { autoAlpha: 0, scale: 0.2, rotate: -18 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: (index: number) => particles[index]?.rotate ?? 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: { each: 0.045, from: "center" },
        },
      );

      particleNodes.forEach((particle, index) => {
        gsap.to(particle, {
          scale: index % 2 === 0 ? 1.035 : 0.965,
          duration: 3.2 + index * 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      const xSetter = particleNodes.map((particle) =>
        gsap.quickTo(particle, "x", { duration: 0.7, ease: "power3.out" }),
      );
      const ySetter = particleNodes.map((particle) =>
        gsap.quickTo(particle, "y", { duration: 0.7, ease: "power3.out" }),
      );
      const rotationSetter = particleNodes.map((particle) =>
        gsap.quickTo(particle, "rotate", {
          duration: 0.7,
          ease: "power3.out",
        }),
      );

      const moveParticles = (event: PointerEvent) => {
        const bounds = stage.getBoundingClientRect();
        const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

        particleNodes.forEach((_, index) => {
          const depth = 12 + (index % 5) * 8;
          const direction = index % 2 === 0 ? 1 : -1;
          xSetter[index](pointerX * depth * direction);
          ySetter[index](pointerY * depth * -direction);
          rotationSetter[index]((particles[index]?.rotate ?? 0) + pointerX * 12);
        });
      };

      const burstParticles = () => {
        gsap.to(particleNodes, {
          scale: (index: number) => (index % 2 === 0 ? 1.08 : 0.94),
          duration: 0.45,
          stagger: { amount: 0.18, from: "random" },
          ease: "back.out(2)",
          overwrite: "auto",
        });
      };

      const settleParticles = () => {
        gsap.to(particleNodes, {
          x: 0,
          y: 0,
          rotate: (index: number) => particles[index]?.rotate ?? 0,
          scale: 1,
          duration: 0.9,
          stagger: { amount: 0.16, from: "center" },
          ease: "elastic.out(1, 0.55)",
          overwrite: "auto",
        });
      };

      stage.addEventListener("pointermove", moveParticles);
      stage.addEventListener("pointerenter", burstParticles);
      stage.addEventListener("pointerleave", settleParticles);

      cleanup(() => {
        stage.removeEventListener("pointermove", moveParticles);
        stage.removeEventListener("pointerenter", burstParticles);
        stage.removeEventListener("pointerleave", settleParticles);
      });
    }, root);

    cleanup(() => context.revert());
  });

  return (
    <div class="page not-found-page text-[var(--text1)]" data-not-found-page>
      <section class="not-found-shell layout-shell">
        <div class="not-found-copy">
          <span class="not-found-kicker" data-404-kicker>
            404 / missing route
          </span>
          <h1 data-404-title>This page slipped out of the composition.</h1>
          <p data-404-copy>
            {notFoundPage.description} I have pulled a few live portfolio
            fragments into the canvas so the dead end still behaves like a
            designed moment.
          </p>
          <div class="not-found-actions" data-404-actions>
            <Link
              href={notFoundPage.link.url}
              class="not-found-button not-found-button--primary"
            >
              {notFoundPage.link.text}
            </Link>
            <Link href="/portfolio" class="not-found-button">
              View portfolio
            </Link>
            <button
              type="button"
              onClick$={() => nav()}
              class="not-found-button"
            >
              Refresh
            </button>
          </div>
          <dl class="not-found-meta" aria-label="404 diagnostics">
            <div>
              <dt>Status</dt>
              <dd>{refinedTitle}</dd>
            </div>
            <div>
              <dt>Last render</dt>
              <dd>{formattedServerTime}</dd>
            </div>
            <div>
              <dt>Path</dt>
              <dd>{location.url.pathname}</dd>
            </div>
          </dl>
        </div>

        <div class="not-found-stage-wrap">
          <div class="not-found-stage" data-particle-stage aria-hidden="true">
            <div class="not-found-orbit not-found-orbit--one" />
            <div class="not-found-orbit not-found-orbit--two" />
            <strong class="not-found-code">404</strong>
            {particles.map((particle, index) => (
              <span
                key={particle.src}
                class="not-found-particle"
                data-particle
                style={{
                  "--particle-image": `url("${particle.src}")`,
                  "--particle-size": `${particle.size}px`,
                  "--particle-x": `${particle.x}%`,
                  "--particle-y": `${particle.y}%`,
                  "--particle-rotate": `${particle.rotate}deg`,
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </span>
            ))}
          </div>
          <div class="not-found-reset-panel">
            <span>Interaction study</span>
            <p>Move across the canvas to scatter the image particles.</p>
            <Link reload href={location.url.pathname}>
              Reload path
            </Link>
          </div>
          <div class="not-found-theme-switcher" aria-label="Theme options">
            <span>Theme</span>
            <div class="not-found-theme-options">
              {themeOptions.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  data-theme-option={theme}
                  aria-pressed={currentTheme.value === theme}
                  onClick$={() => setTheme$(theme)}
                >
                  {formatThemeName(theme)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(notFoundPage.title, notFoundPage.description);
