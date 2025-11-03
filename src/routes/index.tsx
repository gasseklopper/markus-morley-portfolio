import { component$, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import styles from "./index.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

interface WorkItem {
  title: string;
  description: string;
}

const workItems: WorkItem[] = [
  {
    title: "Design Systems",
    description:
      "I build unapologetic, personality-packed design systems that balance experimentation with accessibility and usability standards.",
  },
  {
    title: "Prototyping",
    description:
      "Rapid UX prototyping lets me transform ideas into tangible experiences quickly, gathering feedback that sharpens every interaction.",
  },
  {
    title: "Large-Scale Projects",
    description:
      "I guide complex initiatives from concept to launch, shaping resilient architectures that support fearless digital storytelling.",
  },
  {
    title: "Hybrid Development",
    description:
      "Bridging design and engineering, I craft scalable front-end foundations using atomic principles and progressive tooling.",
  },
];

type Fragment = {
  element: HTMLElement;
  index: number;
  reveal: () => void;
  collapse: () => void;
};

type Pattern = {
  name: string;
  create: (container: HTMLElement, imageSrc: string, size: number) => Fragment[];
  revealTiming: (index: number, total: number) => number;
  collapseTiming: (index: number, total: number) => number;
};

export default component$(() => {
  useStyles$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    async ({ cleanup }) => {
      const { gsap } = await import("gsap");
      const heroSection = document.querySelector<HTMLElement>(".hero-section");
      const speedIndicator = document.querySelector<HTMLElement>(".speed-indicator");

      if (!heroSection || !speedIndicator) {
        return;
      }

      const animateTextColumns = () => {
        const tl = gsap.timeline();
        tl.to(".text-item", {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: {
            amount: 3,
            from: "start",
          },
        }).to(
          ".rotated-item",
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2,
          },
          "-=2",
        );
      };

      const timeoutId = window.setTimeout(animateTextColumns, 200);

      const isMobile =
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

      const config = {
        imageCount: 14,
        imageLifespan: 600,
        removalDelay: 16,
        mouseThreshold: isMobile ? 20 : 40,
        scrollThreshold: 50,
        inDuration: 600,
        outDuration: 800,
        inEasing: "cubic-bezier(.07,.5,.5,1)",
        outEasing: "cubic-bezier(.87, 0, .13, 1)",
        touchImageInterval: 40,
        minMovementForImage: isMobile ? 3 : 5,
        baseImageSize: isMobile ? 180 : 240,
        minImageSize: isMobile ? 120 : 160,
        maxImageSize: isMobile ? 260 : 340,
        baseRotation: 30,
        maxRotationFactor: 3,
        speedSmoothingFactor: 0.25,
        showSpeedIndicator: true,
        staggerRange: 50,
        easing: {
          scale: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          reveal: "cubic-bezier(0.87, 0, 0.13, 1)",
        },
      } as const;

      const images = [
        "../assets/images/photography/black/Black_001-min.jpg",
        "../assets/images/photography/black/Template_index_01.jpg",
        "../assets/images/photography/black/Template_index_02.jpg",
        "../assets/images/photography/black/Template_index_03.jpg",
        "../assets/images/photography/black/Template_index_04.jpg",
        "../assets/images/photography/black/Template_index_05.jpg",
        "../assets/images/photography/black/Template_index_06.jpg",
        "../assets/images/photography/black/Template_index_07.jpg",
        "../assets/images/photography/black/Template_index_08.jpg",
        "../assets/images/photography/black/Template_index_09.jpg",
        "../assets/images/photography/black/Template_index_010.jpg",
        "../assets/images/photography/black/Template_index_011.jpg",
        "../assets/images/photography/black/Template_index_012.jpg",
        "../assets/images/photography/black/Template_index_013.jpg",
        "../assets/images/photography/black/Template_index_014.jpg",
        "../assets/images/photography/black/Template_index_015.jpg",
        "../assets/images/photography/black/Template_index_016.jpg",
        "../assets/images/photography/black/Template_index_017.jpg",
        "../assets/images/photography/black/Template_index_018.jpg",
        "../assets/images/photography/black/Template_index_019.jpg",
        "../assets/images/photography/black/Template_index_020.jpg",
      ];

      const PATTERNS = {
        flame: {
          name: "Flame Trail",
          create: (_container, imageSrc, size) => {
            void size;
            const img = document.createElement("img");
            img.className = "trail-img";
            img.src = imageSrc;
            img.width = img.height = 0;
            return [
              {
                element: img,
                index: 0,
                reveal: () => undefined,
                collapse: () => undefined,
              },
            ];
          },
          revealTiming: () => 0,
          collapseTiming: () => 0,
        },
        venetian: {
          name: "Venetian Blinds",
          create: (_container, imageSrc, size) => {
            void size;
            const fragments: Fragment[] = [];
            const stripCount = 12;
            const stripHeight = 100 / stripCount;
            for (let i = 0; i < stripCount; i++) {
              const fragment = document.createElement("div");
              fragment.className = "image-fragment";
              const bg = document.createElement("div");
              bg.className = "fragment-bg";
              bg.style.backgroundImage = `url(${imageSrc})`;
              const y = i * stripHeight;
              fragment.style.cssText = `
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transform: translate3d(0, 0, 0) rotateX(90deg);
                transform-origin: 50% ${y + stripHeight / 2}%;
                clip-path: polygon(0% ${y}%, 100% ${y}%, 100% ${y + stripHeight}%, 0% ${y + stripHeight}%);
                transition: transform ${config.inDuration}ms ${config.easing.reveal};
              `;
              fragment.appendChild(bg);
              fragments.push({
                element: fragment,
                index: i,
                reveal: () => {
                  fragment.style.transform = "translate3d(0, 0, 0) rotateX(0deg)";
                },
                collapse: () => {
                  fragment.style.transform = "translate3d(0, 0, 0) rotateX(-90deg)";
                },
              });
            }
            return fragments;
          },
          revealTiming: (i, total) => Math.abs(i - total / 2) * 0.08,
          collapseTiming: (i) => i * 0.04,
        },
        liquid: {
          name: "Liquid Drops",
          create: (_container, imageSrc, size) => {
            void size;
            const fragments: Fragment[] = [];
            const positions = [
              { x: 25, y: 20, r: 16 },
              { x: 70, y: 15, r: 12 },
              { x: 45, y: 35, r: 18 },
              { x: 15, y: 55, r: 14 },
              { x: 80, y: 45, r: 15 },
              { x: 55, y: 70, r: 20 },
              { x: 30, y: 80, r: 13 },
              { x: 75, y: 75, r: 17 },
            ];
            positions.forEach((pos, i) => {
              const fragment = document.createElement("div");
              fragment.className = "image-fragment";
              const bg = document.createElement("div");
              bg.className = "fragment-bg";
              bg.style.backgroundImage = `url(${imageSrc})`;
              fragment.style.cssText = `
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                clip-path: circle(0% at ${pos.x}% ${pos.y}%);
                transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
              `;
              fragment.appendChild(bg);
              fragments.push({
                element: fragment,
                index: i,
                reveal: () => {
                  fragment.style.clipPath = `circle(${pos.r}% at ${pos.x}% ${pos.y}%)`;
                },
                collapse: () => {
                  fragment.style.clipPath = `circle(0% at ${pos.x}% ${pos.y}%)`;
                },
              });
            });
            return fragments;
          },
          revealTiming: (i, total) => (i / total) * 0.4,
          collapseTiming: (i, total) => ((total - 1 - i) / total) * 0.25,
        },
        curtain: {
          name: "Curtain Sweep",
          create: (_container, imageSrc, size) => {
            void size;
            const fragments: Fragment[] = [];
            const stripCount = 10;
            for (let i = 0; i < stripCount; i++) {
              const fragment = document.createElement("div");
              fragment.className = "image-fragment";
              const bg = document.createElement("div");
              bg.className = "fragment-bg";
              bg.style.backgroundImage = `url(${imageSrc})`;
              const x = (i / stripCount) * 100;
              const w = 100 / stripCount;
              fragment.style.cssText = `
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                clip-path: polygon(${x + w / 2}% 0%, ${x + w / 2}% 0%, ${x + w / 2}% 100%, ${x + w / 2}% 100%);
                transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
              `;
              fragment.appendChild(bg);
              fragments.push({
                element: fragment,
                index: i,
                reveal: () => {
                  fragment.style.clipPath = `polygon(${x}% 0%, ${x + w}% 0%, ${x + w}% 100%, ${x}% 100%)`;
                },
                collapse: () => {
                  fragment.style.clipPath = `polygon(${x + w / 2}% 0%, ${x + w / 2}% 0%, ${x + w / 2}% 100%, ${x + w / 2}% 100%)`;
                },
              });
            }
            return fragments;
          },
          revealTiming: (i, total) => (i / total) * 0.6,
          collapseTiming: (i, total) => ((total - 1 - i) / total) * 0.3,
        },
        hexagon: {
          name: "Hexagon Bloom",
          create: (_container, imageSrc, size) => {
            void size;
            const fragments: Fragment[] = [];
            const hexagons = [
              { x: 50, y: 50, size: 20 },
              { x: 25, y: 25, size: 15 },
              { x: 75, y: 25, size: 15 },
              { x: 85, y: 50, size: 15 },
              { x: 75, y: 75, size: 15 },
              { x: 25, y: 75, size: 15 },
              { x: 15, y: 50, size: 15 },
            ];
            hexagons.forEach((hex, i) => {
              const fragment = document.createElement("div");
              fragment.className = "image-fragment";
              const bg = document.createElement("div");
              bg.className = "fragment-bg";
              bg.style.backgroundImage = `url(${imageSrc})`;
              const s = hex.size;
              const x = hex.x;
              const y = hex.y;
              const hexShape = `polygon(${x - s * 0.5}% ${y - s * 0.87}%, ${x + s * 0.5}% ${y - s * 0.87}%, ${x + s}% ${y}%, ${x + s * 0.5}% ${y + s * 0.87}%, ${x - s * 0.5}% ${y + s * 0.87}%, ${x - s}% ${y}%)`;
              fragment.style.cssText = `
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                clip-path: polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%);
                transition: clip-path ${config.inDuration}ms ${config.easing.reveal};
              `;
              fragment.appendChild(bg);
              fragments.push({
                element: fragment,
                index: i,
                reveal: () => {
                  fragment.style.clipPath = hexShape;
                },
                collapse: () => {
                  fragment.style.clipPath = `polygon(${x}% ${y}%, ${x}% ${y}%, ${x}% ${y}%)`;
                },
              });
            });
            return fragments;
          },
          revealTiming: (i) => (i === 0 ? 0 : 0.2 + (i - 1) * 0.06),
          collapseTiming: (i) => (i === 0 ? 0.3 : (i - 1) * 0.04),
        },
        zoomsplit: {
          name: "Zoom Split",
          create: (_container, imageSrc, size) => {
            void size;
            const fragments: Fragment[] = [];
            const gridSize = 3;
            for (let row = 0; row < gridSize; row++) {
              for (let col = 0; col < gridSize; col++) {
                const fragment = document.createElement("div");
                fragment.className = "image-fragment";
                const bg = document.createElement("div");
                bg.className = "fragment-bg";
                bg.style.backgroundImage = `url(${imageSrc})`;
                const x = (col / gridSize) * 100;
                const y = (row / gridSize) * 100;
                const w = 100 / gridSize;
                const h = 100 / gridSize;
                fragment.style.cssText = `
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  clip-path: polygon(${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%);
                  transition: clip-path ${config.inDuration}ms ${config.easing.scale};
                `;
                fragment.appendChild(bg);
                fragments.push({
                  element: fragment,
                  index: row * gridSize + col,
                  reveal: () => {
                    fragment.style.clipPath = `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`;
                  },
                  collapse: () => {
                    fragment.style.clipPath = `polygon(${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%, ${x + w / 2}% ${y + h / 2}%)`;
                  },
                });
              }
            }
            return fragments;
          },
          revealTiming: (i, total) => {
            const gridSize = Math.sqrt(total);
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const centerX = (gridSize - 1) / 2;
            const centerY = (gridSize - 1) / 2;
            const distance = Math.hypot(col - centerX, row - centerY);
            return distance * 0.15;
          },
          collapseTiming: (i, total) => {
            const gridSize = Math.sqrt(total);
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const centerX = (gridSize - 1) / 2;
            const centerY = (gridSize - 1) / 2;
            const distance = Math.hypot(col - centerX, row - centerY);
            return distance * 0.08;
          },
        },
      } satisfies Record<
        "flame" | "venetian" | "liquid" | "curtain" | "hexagon" | "zoomsplit",
        Pattern
      >;

      type PatternKey = keyof typeof PATTERNS;

      const trail: Array<{
        element: HTMLElement;
        rotation?: number;
        removeTime: number;
        isFlame?: boolean;
        fragments?: Fragment[];
        pattern?: PatternKey;
      }> = [];

      let mouseX = 0;
      let mouseY = 0;
      let lastMouseX = 0;
      let lastMouseY = 0;
      let prevMouseX = 0;
      let prevMouseY = 0;
      let isMoving = false;
      let isCursorInContainer = false;
      let isTouching = false;
      let lastRemovalTime = 0;
      let lastTouchImageTime = 0;
      let lastScrollTime = 0;
      let lastMoveTime = Date.now();
      let isScrolling = false;
      let scrollTicking = false;
      let smoothedSpeed = 0;
      let maxSpeed = 0;
      let currentEffect: PatternKey = "flame";
      let imageIndex = 0;
      const imagePool: HTMLElement[] = [];
      let speedTimeout: number | undefined;
      let moveTimeout: number | undefined;
      let scrollTimeout: number | undefined;
      let animationFrameId = 0;

      const isInContainer = (x: number, y: number) => {
        const rect = heroSection.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      };

      const hasMovedEnough = () => {
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        return Math.hypot(dx, dy) > config.mouseThreshold;
      };

      const hasMovedAtAll = () => {
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        return Math.hypot(dx, dy) > config.minMovementForImage;
      };

      const calculateSpeed = () => {
        const now = Date.now();
        const dt = now - lastMoveTime;
        if (dt <= 0) return 0;
        const dist = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
        const raw = dist / dt;
        if (raw > maxSpeed) maxSpeed = raw;
        const norm = Math.min(raw / (maxSpeed || 0.5), 1);
        smoothedSpeed = smoothedSpeed * (1 - config.speedSmoothingFactor) + norm * config.speedSmoothingFactor;
        lastMoveTime = now;

        if (config.showSpeedIndicator) {
          const effectName = PATTERNS[currentEffect].name;
          speedIndicator.textContent = `${effectName} Intensity: ${(smoothedSpeed * 100).toFixed(0)}%`;
          speedIndicator.style.opacity = "1";
          if (speedTimeout !== undefined) window.clearTimeout(speedTimeout);
          speedTimeout = window.setTimeout(() => {
            speedIndicator.style.opacity = "0";
          }, 1500);
        }

        return smoothedSpeed;
      };

      const createImageElement = () => {
        if (imagePool.length > 0) {
          return imagePool.pop()!;
        }
        const element = document.createElement("div");
        element.className = "trail-image";
        return element;
      };

      const returnToPool = (element: HTMLElement) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        element.innerHTML = "";
        element.style.cssText = "";
        element.className = "trail-image";
        if (imagePool.length < 20) {
          imagePool.push(element);
        }
      };

      const createImage = (speed = 0.5) => {
        const imageSrc = images[imageIndex];
        imageIndex = (imageIndex + 1) % images.length;

        const size =
          config.minImageSize + (config.maxImageSize - config.minImageSize) * speed;
        const pattern = PATTERNS[currentEffect];

        if (currentEffect === "flame") {
          const img = document.createElement("img");
          img.className = "trail-img";
          const rotFactor = 1 + speed * (config.maxRotationFactor - 1);
          const rot = (Math.random() - 0.5) * config.baseRotation * rotFactor;

          img.src = imageSrc;
          img.width = img.height = size;
          const rect = heroSection.getBoundingClientRect();
          const x = mouseX - rect.left;
          const y = mouseY - rect.top;
          img.style.left = `${x}px`;
          img.style.top = `${y}px`;
          img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
          img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;
          heroSection.appendChild(img);

          window.setTimeout(() => {
            img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
          }, 10);

          trail.push({
            element: img,
            rotation: rot,
            removeTime: Date.now() + config.imageLifespan,
            isFlame: true,
          });
        } else {
          const imageContainer = createImageElement();
          const rect = heroSection.getBoundingClientRect();
          const x = mouseX - rect.left;
          const y = mouseY - rect.top;

          imageContainer.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            transform: translate3d(-50%, -50%, 0) scale(0);
            transition: transform ${config.inDuration}ms ${config.easing.scale};
          `;

          const fragments = pattern.create(imageContainer, imageSrc, size);
          fragments.forEach((fragment) => {
            imageContainer.appendChild(fragment.element);
          });

          heroSection.appendChild(imageContainer);

          requestAnimationFrame(() => {
            imageContainer.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
            fragments.forEach((fragment) => {
              const revealTime = pattern.revealTiming(fragment.index, fragments.length);
              const delay = revealTime * config.staggerRange;
              window.setTimeout(() => {
                fragment.reveal();
              }, delay);
            });
          });

          trail.push({
            element: imageContainer,
            fragments,
            pattern: currentEffect,
            removeTime: Date.now() + config.imageLifespan,
          });
        }
      };

      const createTrailImage = () => {
        if (!isCursorInContainer) return;
        if ((isMoving || isTouching) && hasMovedEnough() && hasMovedAtAll()) {
          lastMouseX = mouseX;
          lastMouseY = mouseY;
          const speed = calculateSpeed();
          createImage(speed);
          prevMouseX = mouseX;
          prevMouseY = mouseY;
        }
      };

      const createTouchTrailImage = () => {
        if (!isCursorInContainer || !isTouching || !hasMovedAtAll()) return;
        const now = Date.now();
        if (now - lastTouchImageTime < config.touchImageInterval) return;
        lastTouchImageTime = now;
        const speed = calculateSpeed();
        createImage(speed);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      };

      const createScrollTrailImage = () => {
        if (!isCursorInContainer || !isScrolling) return;
        lastMouseX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
        lastMouseY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
        createImage(0.5);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      };

      const removeOldImages = () => {
        const now = Date.now();
        if (now - lastRemovalTime < config.removalDelay || !trail.length) return;
        if (now >= trail[0].removeTime) {
          const imgObj = trail.shift();
          if (!imgObj) return;

          if (imgObj.isFlame) {
            imgObj.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
            const nextRotation = (imgObj.rotation ?? 0) + 360;
            imgObj.element.style.transform = `translate(-50%, -50%) rotate(${nextRotation}deg) scale(0)`;
            window.setTimeout(() => {
              imgObj.element.remove();
            }, config.outDuration);
          } else {
            const { element, fragments, pattern: imagePattern } = imgObj;
            if (imagePattern && fragments) {
              const pattern = PATTERNS[imagePattern];
              fragments.forEach((fragment) => {
                const collapseTime = pattern.collapseTiming(fragment.index, fragments.length);
                const delay = collapseTime * config.staggerRange;
                window.setTimeout(() => {
                  fragment.collapse();
                }, delay);
              });
            }

            element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
            element.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
            window.setTimeout(() => returnToPool(element), config.outDuration);
          }

          lastRemovalTime = now;
        }
      };

      const effectLinks = Array.from(
        document.querySelectorAll<HTMLAnchorElement>("[data-effect]"),
      );

      const onEffectClick = (event: MouseEvent) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLAnchorElement | null;
        if (!target) return;
        effectLinks.forEach((link) => link.classList.remove("active"));
        target.classList.add("active");
        currentEffect = target.dataset.effect as PatternKey;
      };

      effectLinks.forEach((link) => {
        link.addEventListener("click", onEffectClick);
      });

      const onMouseOver = (e: MouseEvent) => {
        mouseX = lastMouseX = prevMouseX = e.clientX;
        mouseY = lastMouseY = prevMouseY = e.clientY;
        isCursorInContainer = isInContainer(mouseX, mouseY);
        document.removeEventListener("mouseover", onMouseOver);
      };

      document.addEventListener("mouseover", onMouseOver);

      const onMouseMove = (e: MouseEvent) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        isCursorInContainer = isInContainer(mouseX, mouseY);
        if (isCursorInContainer && hasMovedAtAll()) {
          isMoving = true;
          if (moveTimeout !== undefined) window.clearTimeout(moveTimeout);
          moveTimeout = window.setTimeout(() => {
            isMoving = false;
          }, 100);
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      const onTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        isCursorInContainer = true;
        isTouching = true;
        lastMoveTime = Date.now();
      };

      const onTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const dx = Math.abs(touch.clientX - prevMouseX);
        const dy = Math.abs(touch.clientY - prevMouseY);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        isCursorInContainer = true;
        if (dy > dx) return;
        createTouchTrailImage();
      };

      const onTouchEnd = () => {
        isTouching = false;
      };

      heroSection.addEventListener("touchstart", onTouchStart, { passive: true });
      heroSection.addEventListener("touchmove", onTouchMove, { passive: true });
      heroSection.addEventListener("touchend", onTouchEnd);

      const onDocumentTouchStart = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!isInContainer(t.clientX, t.clientY)) {
          isCursorInContainer = false;
          isTouching = false;
        }
      };

      document.addEventListener("touchstart", onDocumentTouchStart, {
        passive: true,
      });

      const onScroll = () => {
        isCursorInContainer = isInContainer(mouseX, mouseY);
        if (isCursorInContainer) {
          isScrolling = true;
          if (scrollTimeout !== undefined) window.clearTimeout(scrollTimeout);
          scrollTimeout = window.setTimeout(() => {
            isScrolling = false;
          }, 100);
        }
      };

      const onScrollThrottled = () => {
        const now = Date.now();
        if (now - lastScrollTime < config.scrollThreshold) return;
        lastScrollTime = now;
        if (!scrollTicking && isCursorInContainer) {
          scrollTicking = true;
          requestAnimationFrame(() => {
            if (isScrolling) createScrollTrailImage();
            scrollTicking = false;
          });
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("scroll", onScrollThrottled, { passive: true });

      const animate = () => {
        if (isMoving || isTouching || isScrolling) createTrailImage();
        removeOldImages();
        animationFrameId = window.requestAnimationFrame(animate);
      };

      animationFrameId = window.requestAnimationFrame(animate);

      cleanup(() => {
        window.clearTimeout(timeoutId);
        if (speedTimeout !== undefined) window.clearTimeout(speedTimeout);
        if (moveTimeout !== undefined) window.clearTimeout(moveTimeout);
        if (scrollTimeout !== undefined) window.clearTimeout(scrollTimeout);
        window.cancelAnimationFrame(animationFrameId);
        effectLinks.forEach((link) => link.removeEventListener("click", onEffectClick));
        document.removeEventListener("mouseover", onMouseOver);
        document.removeEventListener("mousemove", onMouseMove);
        heroSection.removeEventListener("touchstart", onTouchStart);
        heroSection.removeEventListener("touchmove", onTouchMove);
        heroSection.removeEventListener("touchend", onTouchEnd);
        document.removeEventListener("touchstart", onDocumentTouchStart);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", onScrollThrottled);
        trail.forEach((item) => item.element.remove());
      });
    },
    {
      strategy: "document-ready",
    },
  );

  return (
    <div class="page home-hero">
      <div class="hero-viewport">
        <header class="hero-header">
          <div class="hero-header__container">
            <nav class="hero-effects" aria-label="Trail effects">
              <ul>
                <li>
                  <a href="#" data-effect="flame" class="active">
                    Flame
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="venetian">
                    Venetian
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="curtain">
                    Curtain
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="hexagon">
                    Hexagon
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="liquid">
                    Liquid
                  </a>
                </li>
                <li>
                  <a href="#" data-effect="zoomsplit">
                    Zoom Split
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <section class="hero-section" aria-labelledby="hero-title">
          <div class="hero-core">
            <h1 id="hero-title">Markus Morley — Brutalist design & code for fearless brands.</h1>
            <p>
              Hybrid designer & front-end engineer from Frankfurt am Main, weaving research-led storytelling
              with resilient product delivery.
            </p>
          </div>

          <div class="hero-text-columns" aria-hidden="true">
            <div class="hero-text-column">
              <span class="text-item">Brutalism</span>
              <span class="text-item">Intuition</span>
              <span class="text-item">Source</span>
              <span class="text-item">Awareness</span>
              <span class="text-item">Presence</span>
              <span class="text-item">Breath</span>
              <span class="text-item">Flow</span>
              <span class="text-item">Surrender</span>
              <span class="text-item">Process</span>
              <span class="text-item">Emergence</span>
              <span class="text-item">Channel</span>
              <span class="text-item">Receptivity</span>
              <span class="text-item">Simplicity</span>
              <span class="text-item">Clarity</span>
              <span class="text-item">Vulnerability</span>
            </div>

            <div class="hero-text-column">
              <span class="text-item">Listening</span>
              <span class="text-item">Frequency</span>
              <span class="text-item">Vibration</span>
              <span class="text-item">Resonance</span>
              <span class="text-item">Energy</span>
              <span class="text-item">Field</span>
              <span class="text-item">Dimension</span>
              <span class="text-item">Consciousness</span>
              <span class="text-item">Unity</span>
              <span class="text-item">Form</span>
              <span class="text-item">Function</span>
              <span class="text-item">Beauty</span>
              <span class="text-item">Harmony</span>
              <span class="text-item">Balance</span>
              <span class="text-item">Proportion</span>
            </div>

            <div class="hero-text-column">
              <span class="text-item">Design Systems</span>
              <span class="text-item">Texture</span>
              <span class="text-item">Possibility</span>
              <span class="text-item">Potential</span>
              <span class="text-item">Transformation</span>
              <span class="text-item">Evolution</span>
              <span class="text-item">Prototyping</span>
              <span class="text-item">Awakening</span>
              <span class="text-item">Creation</span>
              <span class="text-item">Truth</span>
              <span class="text-item">Nature</span>
              <span class="text-item">Wonder</span>
              <span class="text-item">Mystery</span>
              <span class="text-item">Cosmos</span>
              <span class="text-item">Collaboration</span>
            </div>
          </div>

          <div class="hero-rotated-text" aria-hidden="true">
            <span class="rotated-item">Inspiration</span>
            <span class="rotated-item">Discovery</span>
            <span class="rotated-item">Expression</span>
            <span class="rotated-item">Liberation</span>
            <span class="rotated-item">Manifestation</span>
          </div>

          <svg
            class="hero-svg hero-wordmark"
            viewBox="0 0 1200 320"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="52%"
              dominant-baseline="middle"
              text-anchor="middle"
              textLength="88%"
              lengthAdjust="spacingAndGlyphs"
            >
              MORLEY
            </text>
          </svg>


          <div class="speed-indicator" />
        </section>
      </div>

      <section class="home-hero__intro" aria-labelledby="intro-title">
        <div class="home-hero__intro-shell">
          <p class="home-hero__badge">Available for collaborations</p>
          <h2 id="intro-title">Fearless digital experiences crafted with precision.</h2>
          <p>
            I blend research-led design exploration with resilient engineering to help brands move boldly. From
            Frankfurt am Main, I build the prototypes, systems, and large-scale platforms that turn possibility
            into product reality.
          </p>
        </div>
      </section>

      <section class="home-hero__work" aria-label="Areas of focus">
        {workItems.map((item) => (
          <article key={item.title} class="home-hero__work-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
});

export const head = buildHead(siteConfig.metadata.title);
