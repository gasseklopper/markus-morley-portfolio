import { component$, useVisibleTask$ } from "@builder.io/qwik";

interface Fragment {
  element: HTMLElement;
  index: number;
  reveal: () => void;
  collapse: () => void;
}

interface Pattern {
  name: string;
  create: (container: HTMLElement, imageSrc: string, size: number) => Fragment[];
  revealTiming: (index: number, total: number) => number;
  collapseTiming: (index: number, total: number) => number;
}

const IMAGES = [
  "https://assets.codepen.io/7558/cr-blurry-orange-small-001.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-002.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-003.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-004.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-005.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-006.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-007.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-008.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-009.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-010.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-011.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-012.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-013.jpg",
  "https://assets.codepen.io/7558/cr-blurry-orange-small-014.jpg",
] as const;

const PATTERNS: Record<string, Pattern> = {
  flame: {
    name: "Flame Trail",
    create: (_container, imageSrc) => {
      const img = document.createElement("img");
      img.className = "trail-img";
      img.src = imageSrc;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.left = "0";
      img.style.top = "0";
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
      const fragments: Fragment[] = [];
      const rows = 5;

      for (let i = 0; i < rows; i++) {
        const fragment = document.createElement("div");
        fragment.className = "image-fragment";
        fragment.style.width = `${size}px`;
        fragment.style.height = `${size / rows}px`;
        fragment.style.top = `${(size / rows) * i}px`;
        fragment.style.left = "0";

        const fragmentBg = document.createElement("div");
        fragmentBg.className = "fragment-bg";
        fragmentBg.style.backgroundImage = `url(${imageSrc})`;
        fragmentBg.style.backgroundSize = `${size}px`;
        fragmentBg.style.backgroundPosition = `0 -${(size / rows) * i}px`;
        fragment.appendChild(fragmentBg);

        fragments.push({
          element: fragment,
          index: i,
          reveal: () => undefined,
          collapse: () => undefined,
        });
      }

      return fragments;
    },
    revealTiming: (index, total) => index * (300 / total),
    collapseTiming: (index, total) => index * (250 / total),
  },
  curtain: {
    name: "Curtain Reveal",
    create: (_container, imageSrc, size) => {
      const fragments: Fragment[] = [];
      const cols = 5;

      for (let i = 0; i < cols; i++) {
        const fragment = document.createElement("div");
        fragment.className = "image-fragment";
        fragment.style.width = `${size / cols}px`;
        fragment.style.height = `${size}px`;
        fragment.style.left = `${(size / cols) * i}px`;
        fragment.style.top = "0";

        const fragmentBg = document.createElement("div");
        fragmentBg.className = "fragment-bg";
        fragmentBg.style.backgroundImage = `url(${imageSrc})`;
        fragmentBg.style.backgroundSize = `${size}px`;
        fragmentBg.style.backgroundPosition = `-${(size / cols) * i}px 0`;
        fragment.appendChild(fragmentBg);

        fragments.push({
          element: fragment,
          index: i,
          reveal: () => undefined,
          collapse: () => undefined,
        });
      }

      return fragments;
    },
    revealTiming: (index, total) => index * (350 / total),
    collapseTiming: (index, total) => index * (300 / total),
  },
  hexagon: {
    name: "Hexagon Tiles",
    create: (container, imageSrc, size) => {
      const fragments: Fragment[] = [];
      const rows = 4;
      const cols = 4;
      const fragmentWidth = size / cols;
      const fragmentHeight = size / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const fragment = document.createElement("div");
          fragment.className = "image-fragment";
          fragment.style.width = `${fragmentWidth}px`;
          fragment.style.height = `${fragmentHeight}px`;
          fragment.style.left = `${fragmentWidth * col}px`;
          fragment.style.top = `${fragmentHeight * row}px`;

          const fragmentBg = document.createElement("div");
          fragmentBg.className = "fragment-bg";
          fragmentBg.style.backgroundImage = `url(${imageSrc})`;
          fragmentBg.style.backgroundSize = `${size}px`;
          fragmentBg.style.backgroundPosition = `-${fragmentWidth * col}px -${fragmentHeight * row}px`;
          fragment.appendChild(fragmentBg);

          container.appendChild(fragment);

          fragments.push({
            element: fragment,
            index: row * cols + col,
            reveal: () => undefined,
            collapse: () => undefined,
          });
        }
      }

      return fragments;
    },
    revealTiming: (index, total) => Math.sin((index / total) * Math.PI) * 400,
    collapseTiming: (index, total) => Math.sin((index / total) * Math.PI) * 350,
  },
  liquid: {
    name: "Liquid Distortion",
    create: (_container, imageSrc, size) => {
      const fragments: Fragment[] = [];
      const rows = 3;
      const cols = 3;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const fragment = document.createElement("div");
          fragment.className = "image-fragment";
          fragment.style.width = `${size / cols}px`;
          fragment.style.height = `${size / rows}px`;
          fragment.style.left = `${(size / cols) * col}px`;
          fragment.style.top = `${(size / rows) * row}px`;
          fragment.style.borderRadius = "50%";

          const fragmentBg = document.createElement("div");
          fragmentBg.className = "fragment-bg";
          fragmentBg.style.backgroundImage = `url(${imageSrc})`;
          fragmentBg.style.backgroundSize = `${size}px`;
          fragmentBg.style.backgroundPosition = `-${(size / cols) * col}px -${(size / rows) * row}px`;
          fragment.appendChild(fragmentBg);

          fragments.push({
            element: fragment,
            index: row * cols + col,
            reveal: () => undefined,
            collapse: () => undefined,
          });
        }
      }

      return fragments;
    },
    revealTiming: (index, total) => (index / total) * 400,
    collapseTiming: (index, total) => (1 - index / total) * 350,
  },
  zoomsplit: {
    name: "Zoom Split",
    create: (_container, imageSrc, size) => {
      const fragments: Fragment[] = [];
      const halves = 2;

      for (let i = 0; i < halves; i++) {
        const fragment = document.createElement("div");
        fragment.className = "image-fragment";
        fragment.style.width = `${size}px`;
        fragment.style.height = `${size / halves}px`;
        fragment.style.top = `${(size / halves) * i}px`;
        fragment.style.left = "0";

        const fragmentBg = document.createElement("div");
        fragmentBg.className = "fragment-bg";
        fragmentBg.style.backgroundImage = `url(${imageSrc})`;
        fragmentBg.style.backgroundSize = `${size}px`;
        fragmentBg.style.backgroundPosition = `0 -${(size / halves) * i}px`;
        fragment.appendChild(fragmentBg);

        fragments.push({
          element: fragment,
          index: i,
          reveal: () => undefined,
          collapse: () => undefined,
        });
      }

      return fragments;
    },
    revealTiming: (index, total) => index * (250 / total),
    collapseTiming: (index, total) => index * (220 / total),
  },
};

export const HeroSection = component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const runAnimation = async () => {
      const { gsap } = await import("gsap");
      const heroSection = document.querySelector<HTMLElement>(".hero-section");
      const speedIndicator = document.querySelector<HTMLElement>(".speed-indicator");

      if (!heroSection || !speedIndicator) {
        return () => undefined;
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

      const data: {
        trails: HTMLElement[];
        mouse: { x: number; y: number };
        isPointerDown: boolean;
        currentPattern: Pattern;
        lastImage: number;
        lastTouchTime: number;
        speed: number;
        lastMousePos: { x: number; y: number } | null;
      } = {
        trails: [],
        mouse: { x: 0, y: 0 },
        isPointerDown: false,
        currentPattern: PATTERNS.flame,
        lastImage: 0,
        lastTouchTime: 0,
        speed: 0,
        lastMousePos: null,
      };

      const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".hero-effects a"));
      const navLinkHandlers: Array<{ element: HTMLAnchorElement; handler: (event: MouseEvent) => void }> = [];

      const setPattern = (patternName: string) => {
        const pattern = PATTERNS[patternName];
        if (!pattern) return;
        data.currentPattern = pattern;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.effect === patternName);
        });
      };

      const updateSpeedIndicator = (speed: number) => {
        if (!config.showSpeedIndicator || !speedIndicator) return;
        const normalizedSpeed = Math.min(1, speed / 60);
        speedIndicator.style.opacity = normalizedSpeed > 0.02 ? "0.8" : "0";
        speedIndicator.textContent = `Trail velocity: ${(normalizedSpeed * 100).toFixed(0)}%`;
      };

      const createTrail = (event: PointerEvent | MouseEvent | TouchEvent) => {
        const rect = heroSection.getBoundingClientRect();
        let clientX: number;
        let clientY: number;

        if (event instanceof TouchEvent) {
          const touch = event.touches[0] ?? event.changedTouches[0];
          if (!touch) return;
          clientX = touch.clientX;
          clientY = touch.clientY;
        } else {
          clientX = (event as PointerEvent | MouseEvent).clientX;
          clientY = (event as PointerEvent | MouseEvent).clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const distance = data.lastMousePos
          ? Math.hypot(x - data.lastMousePos.x, y - data.lastMousePos.y)
          : Infinity;

        if (distance < config.minMovementForImage) return;

        const size =
          config.minImageSize + Math.random() * (config.maxImageSize - config.minImageSize);
        const image = IMAGES[data.lastImage % IMAGES.length];
        data.lastImage++;

        const trail = document.createElement("div");
        trail.className = "trail-image";
        trail.style.width = `${size}px`;
        trail.style.height = `${size}px`;
        trail.style.left = `${x - size / 2}px`;
        trail.style.top = `${y - size / 2}px`;
        trail.style.transform = `rotate(${(Math.random() - 0.5) * config.baseRotation * config.maxRotationFactor}deg)`;

        const fragments = data.currentPattern.create(trail, image, size);
        fragments.forEach((fragment) => trail.appendChild(fragment.element));

        heroSection.appendChild(trail);
        data.trails.push(trail);

        gsap.fromTo(
          trail,
          {
            opacity: 0,
            scale: 0.6,
          },
          {
            opacity: 1,
            scale: 1,
            duration: config.inDuration / 1000,
            ease: config.easing.scale,
          },
        );

        fragments.forEach((fragment, index) => {
          const total = fragments.length;
          gsap.fromTo(
            fragment.element,
            {
              clipPath: "inset(0 100% 0 0)",
            },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: config.inDuration / 1000,
              ease: config.easing.reveal,
              delay: data.currentPattern.revealTiming(index, total) / 1000,
            },
          );
        });

        window.setTimeout(() => {
          fragments.forEach((fragment, index) => {
            const total = fragments.length;
            gsap.to(fragment.element, {
              clipPath: "inset(0 100% 0 0)",
              duration: config.outDuration / 1000,
              ease: config.outEasing,
              delay: data.currentPattern.collapseTiming(index, total) / 1000,
            });
          });

          gsap.to(trail, {
            opacity: 0,
            scale: 0.8,
            duration: config.outDuration / 1000,
            ease: config.outEasing,
            onComplete: () => {
              trail.remove();
              data.trails = data.trails.filter((t) => t !== trail);
            },
          });
        }, config.imageLifespan);

        data.lastMousePos = { x, y };
      };

      const pointerMoveHandler = (event: PointerEvent | MouseEvent) => {
        data.mouse.x = event.clientX;
        data.mouse.y = event.clientY;

        if (!data.isPointerDown && event instanceof MouseEvent) {
          createTrail(event);
        }
      };

      const pointerDownHandler = (event: PointerEvent | MouseEvent) => {
        data.isPointerDown = true;
        createTrail(event);
      };

      const pointerUpHandler = () => {
        data.isPointerDown = false;
      };

      const touchMoveHandler = (event: TouchEvent) => {
        const now = Date.now();
        if (now - data.lastTouchTime < config.touchImageInterval) return;
        data.lastTouchTime = now;
        createTrail(event);
      };

      const updateTrailSpeed = () => {
        if (!data.lastMousePos) {
          requestAnimationFrame(updateTrailSpeed);
          return;
        }

        const dx = data.mouse.x - data.lastMousePos.x;
        const dy = data.mouse.y - data.lastMousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        data.speed = data.speed * (1 - config.speedSmoothingFactor) + distance * config.speedSmoothingFactor;
        updateSpeedIndicator(data.speed);
        requestAnimationFrame(updateTrailSpeed);
      };

      navLinks.forEach((link) => {
        const handler = (event: MouseEvent) => {
          event.preventDefault();
          const effect = link.dataset.effect;
          if (effect) {
            setPattern(effect);
          }
        };
        link.addEventListener("click", handler);
        navLinkHandlers.push({ element: link, handler });
      });

      heroSection.addEventListener("pointermove", pointerMoveHandler);
      heroSection.addEventListener("pointerdown", pointerDownHandler);
      window.addEventListener("pointerup", pointerUpHandler);
      heroSection.addEventListener("touchmove", touchMoveHandler, { passive: true });

      updateTrailSpeed();

      const cleanupFn = () => {
        window.clearTimeout(timeoutId);
        navLinkHandlers.forEach(({ element, handler }) => element.removeEventListener("click", handler));
        heroSection.removeEventListener("pointermove", pointerMoveHandler);
        heroSection.removeEventListener("pointerdown", pointerDownHandler);
        window.removeEventListener("pointerup", pointerUpHandler);
        heroSection.removeEventListener("touchmove", touchMoveHandler);
        data.trails.forEach((trail) => trail.remove());
      };

      return cleanupFn;
    };

    let disposed = false;
    void runAnimation().then((cleanupFn) => {
      if (disposed && cleanupFn) {
        cleanupFn();
      }
      cleanup(() => {
        disposed = true;
        cleanupFn?.();
      });
    });
  });

  return (
    <div class="hero-viewport">
      <header class="hero-header">
        <div class="hero-header__container">
          <a class="hero-logo" href="#" aria-label="Markus Morley logo">
            <span class="hero-logo__circles" aria-hidden="true">
              <span class="hero-logo__circle hero-logo__circle--left" />
              <span class="hero-logo__circle hero-logo__circle--right" />
            </span>
          </a>

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

          <nav class="hero-social" aria-label="Social links">
            <ul>
              <li>
                <a href="https://instagram.com/filipz__" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://x.com/filipz" target="_blank" rel="noreferrer">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/filipzrnzevic" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section class="hero-section" aria-labelledby="hero-title">
        <div class="hero-core">
          <h1 id="hero-title">Markus Morley — Brutalist design &amp; code for fearless brands.</h1>
          <p>
            Hybrid designer &amp; front-end engineer from Frankfurt am Main, weaving research-led storytelling
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
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          class="hero-svg letter-f"
          aria-hidden="true"
        >
          <g fill="currentColor">
            <path d="m.585938.410156h5.595702v1.341794h-3.41016c-.18359 0-.33007.04688-.43945.14063-.10547.08984-.1582.21484-.1582.375 0 .16797.05273.30078.1582.39844.10938.09375.25586.14062.43945.14062h3.41016v1.34766h-3.35156c-.20313 0-.36328.05859-.48047.17578s-.17578.27734-.17578.48047v4.18945h-1.587892z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          class="hero-svg letter-l"
          aria-hidden="true"
        >
          <g fill="currentColor">
            <path d="m6.96094.410156h1.58789v6.585934c0 .21094.05664.375.16992.49219.11719.11328.2793.16992.48633.16992h3.35152v1.3418h-5.59566z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          class="hero-svg letter-a"
          aria-hidden="true"
        >
          <g fill="currentColor">
            <path d="m14.9941.410156h2.543l2.2793 8.589844h-1.6816l-.17-.65039c-.0117-.05078-.041-.11914-.0878-.20508-.043-.08594-.1192-.16601-.2286-.24023-.1093-.07813-.2519-.11719-.4277-.11719h-1.9922c-.25 0-.4277.06445-.5332.19336-.1055.125-.1758.24805-.2109.36914l-.1641.65039h-1.6113zm.1993 5.302734c-.0118.07031-.0176.13281-.0176.1875 0 .14844.043.27734.1289.38672.0859.10547.2422.1582.4687.1582h.9082c.2266 0 .3829-.05273.4688-.1582.0859-.10938.1289-.23828.1289-.38672 0-.05469-.0059-.11719-.0176-.1875l-.8789-3.82617c-.0078-.04297-.0254-.08008-.0527-.11133-.0235-.03125-.0586-.04687-.1055-.04687-.0859 0-.1367.05273-.1523.1582z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          class="hero-svg letter-m"
          aria-hidden="true"
        >
          <g fill="currentColor">
            <path d="m20.4141.410156h1.5879l1.1367 1.271484c.0703.07813.1465.13867.2285.18164.082.03906.1621.0586.2402.0586.1602 0 .3164-.08008.4688-.24024l1.1426-1.271484h1.6054v8.589844h-1.582v-5.53125c0-.14453-.0371-.25781-.1113-.33984-.0704-.08594-.1621-.12891-.2754-.12891-.125 0-.252.07227-.3809.2168l-.8555.99609h-.0117l-.8496-.96094c-.1133-.13672-.2422-.20507-.3867-.20507-.1055 0-.1934.04101-.2637.12304-.0703.07813-.1054.18946-.1054.33399v5.49609h-1.5879z" />
          </g>
        </svg>

        <svg
          fill="none"
          height="9"
          viewBox="0 0 34 9"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
          class="hero-svg letter-e"
          aria-hidden="true"
        >
          <g fill="currentColor">
            <path d="m27.9961.410156h5.5957v1.341794h-3.4102c-.1836 0-.33.04688-.4394.14063-.1055.08984-.1582.21484-.1582.375 0 .16797.0527.30078.1582.39844.1094.09375.2558.14062.4394.14062h3.4102v1.34766h-3.3516c-.2031 0-.3632.05859-.4804.17578s-.1758.27734-.1758.48047v2.18554c0 .20313.0586.36524.1758.48633.1172.11719.2773.17578.4804.17578h3.3516v1.3418h-5.5957z" />
          </g>
        </svg>

        <div class="touch-instruction">Swipe your finger to see the magic unfold</div>
        <div class="cursor-hint">
          Move your cursor to create dynamic trails | Click the nav to switch trail effects
        </div>
        <div class="speed-indicator" />
      </section>
    </div>
  );
});

export default HeroSection;
