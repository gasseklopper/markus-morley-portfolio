import { component$, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import gentlyStyles from "./gently.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const workItems = [
  {
    id: "gently",
    background:
      "/public/assets/images/photography/venedig/IMG_2039.jpg",
    lines: [
      { text: "sjksl", className: "text-left", accentClass: "color-1" },
      { text: "Scroll", className: "text-center", accentClass: "color-0" },
      { text: "Down", className: "text-right", accentClass: "color-2" },
    ],
    images: [
      {
        src: "/public/assets/images/photography/venedig/IMG_1939.jpg",
        alt: "Monochrome desktop setup with ambient lighting.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1905.jpg",
        alt: "Designer adjusting colorful post-it notes on a board.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1903.jpg",
        alt: "Close-up of glowing keyboard keys.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1882.jpg",
        alt: "Creative mood board illuminated with neon lights.",
      },
    ],
  },
  {
    id: "ambient",
    background:
      "/public/assets/images/photography/venedig/IMG_1859.jpg",
    lines: [
      { text: "Ambient", className: "text-left", accentClass: "color-3" },
      { text: "Motion", className: "text-center", accentClass: "color-1" },
      { text: "Study", className: "text-right", accentClass: "color-2" },
    ],
    images: [
      {
        src: "/public/assets/images/photography/venedig/IMG_1841.jpg",
        alt: "Gradient light wash across geometric shapes.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1846.jpg",
        alt: "Designer sketching storyboard frames.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1859.jpg",
        alt: "Laptop screen showing scroll-triggered animation timeline.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1862.jpg",
        alt: "Atmospheric lighting on a minimalist sculpture.",
      },
    ],
  },
  {
    id: "horizon",
    background:
      "/public/assets/images/photography/venedig/IMG_2063.jpg",
    lines: [
      { text: "Future", className: "text-left", accentClass: "color-2" },
      { text: "Scroll", className: "text-center", accentClass: "color-0" },
      { text: "Lab", className: "text-right", accentClass: "color-1" },
    ],
    images: [
      {
        src: "/public/assets/images/photography/venedig/IMG_1869.jpg",
        alt: "Vibrant installation with moving projections.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1882.jpg",
        alt: "Team collaborating around illuminated wall.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1905.jpg",
        alt: "Soft focus on color gradients in a studio.",
      },
      {
        src: "/public/assets/images/photography/venedig/IMG_1939.jpg",
        alt: "Close-up of tactile prototype components.",
      },
    ],
  },
];

export default component$(() => {
  useStylesScoped$(gentlyStyles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const workSection = document.querySelector<HTMLElement>("[data-work=\"section\"]");
    const workItemsElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-work=\"item\"]"),
    );

    if (!workSection || workItemsElements.length === 0) {
      return;
    }

    const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("lenis"),
    ]);

    gsap.registerPlugin(ScrollTrigger);

    const ghostContainer = document.createElement("div");
    ghostContainer.className = "ghost_work-container";
    workSection.appendChild(ghostContainer);

    const ghostItems = workItemsElements.map(() => {
      const ghostItem = document.createElement("div");
      ghostItem.className = "ghost_work-item";
      ghostItem.style.cssText = "width: 100%; height: 300vh;";
      ghostContainer.appendChild(ghostItem);
      return ghostItem;
    });

    const getBaseScrollTrigger = (ghostItem: HTMLElement) => ({
      trigger: ghostItem,
      scrub: true,
      start: "top bottom",
      end: "+200vh top",
    });

    type ImageInitialPosition = {
      scale?: number;
      y?: string;
      rotateZ?: string;
      zIndex?: number;
    };

    const getImageInitialPosition = (index: number, imageIndex: number): ImageInitialPosition => {
      const positions: Record<number, ImageInitialPosition> = {
        0: {
          scale: 0.8,
          y: index % 2 === 0 ? "175vh" : "-120vh",
          rotateZ: index % 2 === 0 ? "-5deg" : "5deg",
          zIndex: index % 2 === 0 ? 3 : 1,
        },
        1: {
          scale: 0.8,
          y: index % 2 === 0 ? "-225vh" : "300vh",
          zIndex: index % 2 === 0 ? 1 : 3,
          rotateZ: index % 2 === 0 ? "5deg" : "-5deg",
        },
        2: {
          scale: 0.8,
          y: index % 2 === 0 ? "300vh" : "-120vh",
          zIndex: 3,
          rotateZ: "5deg",
        },
        3: {
          scale: 0.8,
          y: index % 2 === 0 ? "-100vh" : "175vh",
          zIndex: 1,
          rotateZ: "-5deg",
        },
      };

      return positions[imageIndex] ?? positions[0];
    };

    const getImageFinalPosition = (index: number, imageIndex: number) => ({
      scale: 1,
      y:
        index % 2 === 0
          ? imageIndex % 2 === 0
            ? "2vh"
            : "-2vh"
          : imageIndex % 2 === 0
            ? "-2vh"
            : "2vh",
      rotateZ:
        index % 2 === 0
          ? imageIndex % 2 === 0
            ? "2.5deg"
            : "-2.5deg"
          : imageIndex % 2 === 0
            ? "-2.5deg"
            : "2.5deg",
    });

    const ctx = gsap.context(() => {
      gsap.set(workItemsElements, {
        position: "fixed",
        top: "0",
        clipPath: "inset(0 0% 0 100%)",
      });

      workItemsElements.forEach((element, index) => {
        const lines = element.querySelectorAll<HTMLElement>("[data-line]");
        const itemBackground = element.querySelector<HTMLElement>("[data-work=\"item-background\"]");
        const itemContainer = element.querySelector<HTMLElement>("[data-work=\"item-container\"]");
        const itemOverlay = element.querySelectorAll<HTMLElement>("[data-work=\"item-overlay\"]");
        const itemImages = Array.from(
          element.querySelectorAll<HTMLElement>("[data-work=\"item-image\"]"),
        );

        if (!itemBackground || !itemContainer) {
          return;
        }

        gsap.set(itemBackground, { scale: 1.2 });
        gsap.set(itemContainer, { xPercent: 40 });

        gsap.to(element, {
          clipPath: "inset(0 0 0 0%)",
          scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
          markers: false,
        });

        gsap.to(itemContainer, {
          xPercent: 0,
          scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
          markers: false,
        });

        gsap.to(itemBackground, {
          scale: 1,
          scrollTrigger: getBaseScrollTrigger(ghostItems[index]),
          markers: false,
        });

        [0, 1].forEach((i) => {
          const line = lines[i];
          if (!line) return;

          gsap.set(line, {
            zIndex: 2,
            opacity: 0.9,
          });

          gsap.from(line, {
            opacity: i === 0 ? 0.95 : 0.5,
            yPercent: i === 0 ? 125 : -125,
            ease: "power2.inOut",
            duration: 1.25,
            scrollTrigger: {
              trigger: ghostItems[index],
              scrub: true,
              start: "-25% top",
              end: "15% top",
              toggleActions: "play reverse restart reverse",
              markers: false,
            },
          });
        });

        itemImages.forEach((image, imageIndex) => {
          gsap.set(image, getImageInitialPosition(index, imageIndex));
          gsap.to(image, {
            ...getImageFinalPosition(index, imageIndex),
            scrollTrigger: {
              trigger: ghostItems[index],
              scrub: true,
              start: "5% top",
              end: "50% top",
              markers: false,
            },
          });
        });

        gsap.to(itemBackground, {
          filter: "brightness(0.2) blur(7.5px)",
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: "20% top",
            end: "55% top",
            markers: false,
          },
        });

        gsap.to(element, {
          xPercent: index === workItemsElements.length - 1 ? 0 : -40,
          yPercent: index === workItemsElements.length - 1 ? -40 : 0,
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: "100% bottom",
            toggleActions: "play reverse play reverse",
            markers: false,
          },
        });

        gsap.to(itemOverlay, {
          opacity: 0.85,
          scrollTrigger: {
            trigger: ghostItems[index],
            scrub: true,
            start: "100% bottom",
            toggleActions: "play reverse play reverse",
             markers: false,
          },
        });
      });
    }, workSection);

    let lenis: { destroy: () => void } | null = null;

    try {
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.05,
        wheelMultiplier: 0.7,
      });
    } catch (error) {
      console.error("Failed to initialize Lenis", error);
    }

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      ghostContainer.remove();
      lenis?.destroy();
    };
  });

  return (
    <div class="page gently-scroll-page">
      <div class="page-shell overflow-x-hidden">
        <a
          class="button_reference fix-bottom-left"
          href="https://moussamamadou.github.io/scroll-trigger-gsap-gently/"
          target="_blank"
          rel="noreferrer"
        >
          View original concept
        </a>

        <nav class="nav" aria-label="Project navigation">
          <div class="nav_top-wrapper">
            <div class="nav_top">
              <a class="nav_link" href="/portfolio">
                Portfolio Home
              </a>
              <a class="nav_link" href="https://greensock.com/scrolltrigger/" target="_blank" rel="noreferrer">
                ScrollTrigger Docs
              </a>
            </div>
            <div class="nav_top-line" aria-hidden="true" />
          </div>
        </nav>

        <section class="hero_section sticky" aria-labelledby="hero-title">
          <div class="hero_container">
            <div class="hero_image-wrapper" aria-hidden="true">
              <img
                src="/public/assets/images/photography/venedig/IMG_2063.jpg"
                loading="lazy"
                sizes="100vw"
                width={4140}
                height={2760}
                // srcset="/public/assets/images/photography/venedig/IMG_1523.jpg 500w, /public/assets/images/photography/venedig/IMG_1523.jpg 800w, /public/assets/images/photography/venedig/IMG_1523.jpg 1080w, /public/assets/images/photography/venedig/IMG_1523.jpg 1600w, /public/assets/images/photography/venedig/IMG_1523.jpg 2000w, /public/assets/images/photography/venedig/IMG_1523.jpg 2600w, /public/assets/images/photography/venedig/IMG_1523.jpg 4140w"
                alt="Ambient lighting across fabric backdrop"
                class="hero_image"
              />
            </div>
            <div class="hero_texts" id="hero-title">
              <div class="line-wrapper">
                <div class="line" data-line>
                  Gently
                </div>
              </div>
              <div class="line-wrapper">
                <div class="line text-center" data-line>
                  <span class="color-0">Scroll</span>
                </div>
              </div>
              <div class="line-wrapper">
                <div class="line text-right" data-line>
                  Down
                </div>
              </div>
            </div>
          </div>
        </section>

        <main class="work_section" data-work="section">
          <div class="work_container">
            {workItems.map((item, index) => (
              <article key={item.id} class="work_item" data-work="item" aria-label={`${item.id} showcase`}>
                <div class="work_item-background" data-work="item-background" aria-hidden="true">
                  <img src={item.background} alt="" loading="lazy" width={2400} height={1600} />
                </div>
                <div class="work_item-overlay" data-work="item-overlay" aria-hidden="true" />
                <div class="work_item-wrapper" data-work="item-container">
                  <div class="work_text">
                    <div class="work_text-title">
                      {item.lines.map((line, lineIndex) => (
                        <div key={`${item.id}-line-${line.text}`} class="line-wrapper">
                          <div
                            class={`line ${line.className}`}
                            data-line={lineIndex < 2 ? "true" : undefined}
                          >
                            <span class={line.accentClass}>{line.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div class="work_item-images">
                    {item.images.map((image, imageIndex) => (
                      <figure key={`${item.id}-image-${imageIndex}`} class="work_item-image">
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading={index === 0 && imageIndex < 2 ? "eager" : "lazy"}
                          width={900}
                          height={1200}
                          data-work="item-image"
                        />
                      </figure>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        <footer class="footer_section" aria-labelledby="footer-title">
          <div class="footer_container">
            <div class="footer_image-wrapper" aria-hidden="true">
              <img
                src="/public/assets/images/photography/venedig/IMG_2094.jpg"
                alt=""
                loading="lazy"
                width={2400}
                height={1600}
                class="footer_image"
              />
            </div>
            <div class="footer_texts" id="footer-title">
              <div class="line-wrapper">
                <div class="line text-left" data-line>
                  <span class="color-1">Scroll</span>
                </div>
              </div>
              <div class="line-wrapper">
                <div class="line text-center" data-line>
                  <span class="color-2">Rhythms</span>
                </div>
              </div>
              <div class="line-wrapper">
                <div class="line text-right" data-line>
                  Crafted
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
});

export const head = buildHead(
  `Project 016 – Scroll Trigger Study | ${siteConfig.metadata.title}`,
  "Immersive GSAP ScrollTrigger and Lenis powered gallery exploring ambient motion design in a sticky hero layout.",
);
