import {
  $,
  component$,
  useOnDocument,
  useOnWindow,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
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

type PatternKey = "flame" | "venetian" | "liquid" | "curtain" | "hexagon" | "zoomsplit";

export default component$(() => {
  useStyles$(styles);

  const heroRef = useSignal<HTMLElement>();
  const speedRef = useSignal<HTMLElement>();

  const currentEffect = useSignal<PatternKey>("flame");
  const mouseX = useSignal(0);
  const mouseY = useSignal(0);
  const lastMouseX = useSignal(0);
  const lastMouseY = useSignal(0);
  const prevMouseX = useSignal(0);
  const prevMouseY = useSignal(0);
  const isMoving = useSignal(false);
  const isTouching = useSignal(false);
  const isScrolling = useSignal(false);
  const isCursorInContainer = useSignal(false);

  const speedTimeout = useSignal<number | undefined>(undefined);
  const moveTimeout = useSignal<number | undefined>(undefined);
  const scrollTimeout = useSignal<number | undefined>(undefined);
  const rafId = useSignal(0);

  const isMobile =
    typeof navigator !== "undefined" &&
    (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (typeof window !== "undefined" && window.innerWidth <= 768));

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

  const PATTERN_KEYS: readonly PatternKey[] = [
    "flame",
    "venetian",
    "curtain",
    "hexagon",
    "liquid",
    "zoomsplit",
  ];

  const PATTERN_LABELS: Record<PatternKey, string> = {
    flame: "Flame",
    venetian: "Venetian",
    curtain: "Curtain",
    hexagon: "Hexagon",
    liquid: "Liquid",
    zoomsplit: "Zoom Split",
  };

  const inContainer$ = $((x: number, y: number) => {
    const el = heroRef.value;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });

  const setEffect$ = $((effect: PatternKey) => {
    currentEffect.value = effect;
  });

  useOnDocument(
    "mouseover",
    $((event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      mouseX.value = lastMouseX.value = prevMouseX.value = x;
      mouseY.value = lastMouseY.value = prevMouseY.value = y;
      inContainer$(x, y).then((inside) => {
        isCursorInContainer.value = inside;
      });
    }),
  );

  useOnDocument(
    "mousemove",
    $((event: MouseEvent) => {
      prevMouseX.value = mouseX.value;
      prevMouseY.value = mouseY.value;
      mouseX.value = event.clientX;
      mouseY.value = event.clientY;
      inContainer$(mouseX.value, mouseY.value).then((inside) => {
        isCursorInContainer.value = inside;
        if (inside && Math.hypot(mouseX.value - prevMouseX.value, mouseY.value - prevMouseY.value) > 0) {
          isMoving.value = true;
          if (moveTimeout.value) window.clearTimeout(moveTimeout.value);
          moveTimeout.value = window.setTimeout(() => {
            isMoving.value = false;
          }, 100);
        }
      });
    }),
  );

  useOnDocument(
    "touchstart",
    $((event: TouchEvent) => {
      const touch = event.touches[0];
      inContainer$(touch.clientX, touch.clientY).then((inside) => {
        if (!inside) {
          isCursorInContainer.value = false;
          isTouching.value = false;
        }
      });
    }),
  );

  useOnWindow(
    "scroll",
    $(() => {
      inContainer$(mouseX.value, mouseY.value).then((inside) => {
        if (inside) {
          isScrolling.value = true;
          if (scrollTimeout.value) window.clearTimeout(scrollTimeout.value);
          scrollTimeout.value = window.setTimeout(() => {
            isScrolling.value = false;
          }, 100);
        }
      });
    }),
  );

  const onTouchStart$ = $((event: TouchEvent) => {
    const touch = event.touches[0];
    prevMouseX.value = mouseX.value;
    prevMouseY.value = mouseY.value;
    mouseX.value = touch.clientX;
    mouseY.value = touch.clientY;
    lastMouseX.value = mouseX.value;
    lastMouseY.value = mouseY.value;
    isCursorInContainer.value = true;
    isTouching.value = true;
  });

  const onTouchMove$ = $((event: TouchEvent) => {
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - prevMouseX.value);
    const dy = Math.abs(touch.clientY - prevMouseY.value);
    prevMouseX.value = mouseX.value;
    prevMouseY.value = mouseY.value;
    mouseX.value = touch.clientX;
    mouseY.value = touch.clientY;
    isCursorInContainer.value = true;
    if (dy > dx) return;
  });

  const onTouchEnd$ = $(() => {
    isTouching.value = false;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const heroEl = heroRef.value;
    const speedEl = speedRef.value;
    if (!heroEl || !speedEl) {
      return;
    }

    const { gsap } = await import("gsap");

    const patterns: Record<PatternKey, Pattern> = {
      flame: {
        name: "Flame Trail",
        create: (_container, imageSrc, _size) => {
          void _container;
          void _size;
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
        create: (_container, imageSrc, _size) => {
          void _container;
          void _size;
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
        create: (_container, imageSrc, _size) => {
          void _container;
          void _size;
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
        create: (_container, imageSrc, _size) => {
          void _container;
          void _size;
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
        create: (_container, imageSrc, _size) => {
          void _container;
          void _size;
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
        create: (_container, imageSrc, _size) => {
          void _container;
          void _size;
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
    };

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

    type TrailItem = {
      element: HTMLElement;
      rotation?: number;
      removeTime: number;
      isFlame?: boolean;
      fragments?: Fragment[];
      pattern?: PatternKey;
    };

    const trail: TrailItem[] = [];
    let lastRemovalTime = 0;
    let lastTouchImageTime = 0;
    let lastScrollTime = 0;
    let lastMoveTime = Date.now();
    let smoothedSpeed = 0;
    let maxSpeed = 0;
    let imageIndex = 0;
    const imagePool: HTMLElement[] = [];

    const hasMovedEnough = () => {
      const dx = mouseX.value - lastMouseX.value;
      const dy = mouseY.value - lastMouseY.value;
      return Math.hypot(dx, dy) > config.mouseThreshold;
    };

    const hasMovedAtAll = () => {
      const dx = mouseX.value - prevMouseX.value;
      const dy = mouseY.value - prevMouseY.value;
      return Math.hypot(dx, dy) > config.minMovementForImage;
    };

    const calculateSpeed = () => {
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt <= 0) return 0;
      const dist = Math.hypot(mouseX.value - prevMouseX.value, mouseY.value - prevMouseY.value);
      const raw = dist / dt;
      if (raw > maxSpeed) maxSpeed = raw;
      const norm = Math.min(raw / (maxSpeed || 0.5), 1);
      smoothedSpeed = smoothedSpeed * (1 - config.speedSmoothingFactor) + norm * config.speedSmoothingFactor;
      lastMoveTime = now;

      if (config.showSpeedIndicator) {
        const effectName = patterns[currentEffect.value].name;
        speedEl.textContent = `${effectName} Intensity: ${(smoothedSpeed * 100).toFixed(0)}%`;
        speedEl.style.opacity = "1";
        if (speedTimeout.value !== undefined) window.clearTimeout(speedTimeout.value);
        speedTimeout.value = window.setTimeout(() => {
          speedEl.style.opacity = "0";
        }, 1500);
      }

      return smoothedSpeed;
    };

    const createImageElement = () => {
      if (imagePool.length > 0) return imagePool.pop()!;
      const el = document.createElement("div");
      el.className = "trail-image";
      return el;
    };

    const returnToPool = (element: HTMLElement) => {
      if (element.parentNode) element.parentNode.removeChild(element);
      element.innerHTML = "";
      element.style.cssText = "";
      element.className = "trail-image";
      if (imagePool.length < 20) imagePool.push(element);
    };

    const createImage = (speed = 0.5) => {
      const imageSrc = images[imageIndex];
      imageIndex = (imageIndex + 1) % images.length;

      const size = config.minImageSize + (config.maxImageSize - config.minImageSize) * speed;
      const pattern = patterns[currentEffect.value];

      if (currentEffect.value === "flame") {
        const img = document.createElement("img");
        img.className = "trail-img";
        const rotFactor = 1 + speed * (config.maxRotationFactor - 1);
        const rot = (Math.random() - 0.5) * config.baseRotation * rotFactor;

        img.src = imageSrc;
        img.width = img.height = size;
        const rect = heroEl.getBoundingClientRect();
        const x = mouseX.value - rect.left;
        const y = mouseY.value - rect.top;
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
        img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;
        heroEl.appendChild(img);

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
        const rect = heroEl.getBoundingClientRect();
        const x = mouseX.value - rect.left;
        const y = mouseY.value - rect.top;

        imageContainer.style.cssText = `
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          transform: translate3d(-50%, -50%, 0) scale(0);
          transition: transform ${config.inDuration}ms ${config.easing.scale};
        `;

        const fragments = pattern.create(imageContainer, imageSrc, size);
        fragments.forEach((fragment) => imageContainer.appendChild(fragment.element));

        heroEl.appendChild(imageContainer);

        requestAnimationFrame(() => {
          imageContainer.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
          fragments.forEach((fragment) => {
            const revealTime = pattern.revealTiming(fragment.index, fragments.length);
            const delay = revealTime * config.staggerRange;
            window.setTimeout(() => fragment.reveal(), delay);
          });
        });

        trail.push({
          element: imageContainer,
          fragments,
          pattern: currentEffect.value,
          removeTime: Date.now() + config.imageLifespan,
        });
      }
    };

    const createTrailImage = () => {
      if (!isCursorInContainer.value) return;
      if ((isMoving.value || isTouching.value) && hasMovedEnough() && hasMovedAtAll()) {
        lastMouseX.value = mouseX.value;
        lastMouseY.value = mouseY.value;
        const speed = calculateSpeed();
        createImage(speed);
        prevMouseX.value = mouseX.value;
        prevMouseY.value = mouseY.value;
      }
    };

    const createTouchTrailImage = () => {
      if (!isCursorInContainer.value || !isTouching.value || !hasMovedAtAll()) return;
      const now = Date.now();
      if (now - lastTouchImageTime < config.touchImageInterval) return;
      lastTouchImageTime = now;
      const speed = calculateSpeed();
      createImage(speed);
      prevMouseX.value = mouseX.value;
      prevMouseY.value = mouseY.value;
    };

    const createScrollTrailImage = () => {
      if (!isCursorInContainer.value || !isScrolling.value) return;
      lastMouseX.value += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
      lastMouseY.value += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
      createImage(0.5);
      lastMouseX.value = mouseX.value;
      lastMouseY.value = mouseY.value;
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
          (imgObj.element as HTMLElement).style.transform = `translate(-50%, -50%) rotate(${nextRotation}deg) scale(0)`;
          window.setTimeout(() => {
            imgObj.element.remove();
          }, config.outDuration);
        } else {
          const { element, fragments, pattern: imagePattern } = imgObj;
          if (imagePattern && fragments) {
            const pattern = patterns[imagePattern];
            fragments.forEach((fragment) => {
              const collapseTime = pattern.collapseTiming(fragment.index, fragments.length);
              const delay = collapseTime * config.staggerRange;
              window.setTimeout(() => fragment.collapse(), delay);
            });
          }
          element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
          element.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
          window.setTimeout(() => returnToPool(element), config.outDuration);
        }

        lastRemovalTime = now;
      }
    };

    const loop = () => {
      if (isMoving.value || isTouching.value || isScrolling.value) {
        createTrailImage();
        if (isTouching.value) createTouchTrailImage();
        if (isScrolling.value) {
          const now = Date.now();
          if (now - lastScrollTime >= config.scrollThreshold) {
            lastScrollTime = now;
            createScrollTrailImage();
          }
        }
      }
      removeOldImages();
      rafId.value = requestAnimationFrame(loop);
    };

    rafId.value = requestAnimationFrame(loop);

    cleanup(() => {
      window.clearTimeout(timeoutId);
      if (speedTimeout.value !== undefined) window.clearTimeout(speedTimeout.value);
      if (moveTimeout.value !== undefined) window.clearTimeout(moveTimeout.value);
      if (scrollTimeout.value !== undefined) window.clearTimeout(scrollTimeout.value);
      cancelAnimationFrame(rafId.value);
      trail.forEach((item) => item.element.remove());
    });
  });

  return (
    <div class="page home-hero">
      <div class="hero-viewport">
        <header class="hero-header">
          <div class="hero-header__container">
            <nav class="hero-effects" aria-label="Trail effects">
              <ul>
                {PATTERN_KEYS.map((effect) => (
                  <li key={effect}>
                    <button
                      type="button"
                      class={{ active: currentEffect.value === effect }}
                      onClick$={() => setEffect$(effect)}
                      aria-pressed={currentEffect.value === effect}
                    >
                      {PATTERN_LABELS[effect]}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <section
          class="hero-section"
          aria-labelledby="hero-title"
          ref={heroRef}
          onTouchStart$={onTouchStart$}
          onTouchMove$={onTouchMove$}
          onTouchEnd$={onTouchEnd$}
        >
          <div class="hero-core">
            <h1 id="hero-title">Markus Morley — Brutalist design &amp; code for fearless brands.</h1>
            <p>
              Hybrid designer &amp; front-end engineer from Frankfurt am Main, weaving research-led storytelling with resilient product delivery.
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

          <div class="speed-indicator" ref={speedRef} />
        </section>
      </div>

      <section class="home-hero__intro" aria-labelledby="intro-title">
        <div class="home-hero__intro-shell">
          <p class="home-hero__badge">Available for collaborations</p>
          <h2 id="intro-title">Fearless digital experiences crafted with precision.</h2>
          <p>
            I blend research-led design exploration with resilient engineering to help brands move boldly. From Frankfurt am Main, I build the prototypes, systems, and large-scale platforms that turn possibility into product reality.
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
