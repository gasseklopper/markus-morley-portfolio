import {
  animationFrame,
  animationFrameLoop,
  createCleanupBag,
  on,
  prefersReducedMotion,
  timeout,
} from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";
import { cleanupHomeHeroTrail } from "./home-hero.cleanup";
import { createHomeHeroConfig, homeHeroImages } from "./home-hero.config";
import { queryHomeHeroDom } from "./home-hero.dom";
import { bindHomeHeroEffectEvents } from "./home-hero.events";
import {
  createHomeHeroPatterns,
  type HomeHeroPatternKey,
} from "./home-hero.patterns";
import { createHomeHeroState } from "./home-hero.state";

export const setupHomeHeroAnimations = async (root: HTMLElement) => {
  if (prefersReducedMotion()) {
    return () => undefined;
  }

  const { gsap } = await loadGsap({ scrollTrigger: false });
  const { heroSection, speedIndicator, effectLinks } = queryHomeHeroDom(root);

  if (!heroSection || !speedIndicator) {
    return () => undefined;
  }

  const config = createHomeHeroConfig();
  const PATTERNS = createHomeHeroPatterns(config);
  const cleanupBag = createCleanupBag();

  const animateTextColumns = () => {
    const tl = gsap.timeline();
    tl.to(root.querySelectorAll(".text-item"), {
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
      root.querySelectorAll(".rotated-item"),
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

  timeout(animateTextColumns, 200, cleanupBag);

  const state = createHomeHeroState();
  const { trail, imagePool } = state;

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
  let currentEffect: HomeHeroPatternKey = "flame";
  let imageIndex = 0;
  let cleanupSpeedTimeout: (() => void) | undefined;
  let cleanupMoveTimeout: (() => void) | undefined;
  let cleanupScrollTimeout: (() => void) | undefined;

  const isInContainer = (x: number, y: number) => {
    const rect = heroSection.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
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
    smoothedSpeed =
      smoothedSpeed * (1 - config.speedSmoothingFactor) +
      norm * config.speedSmoothingFactor;
    lastMoveTime = now;

    if (config.showSpeedIndicator) {
      const effectName = PATTERNS[currentEffect].name;
      speedIndicator.textContent = `${effectName} Intensity: ${(smoothedSpeed * 100).toFixed(0)}%`;
      speedIndicator.style.opacity = "1";
      cleanupSpeedTimeout?.();
      cleanupSpeedTimeout = timeout(() => {
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
    const imageSrc = homeHeroImages[imageIndex];
    imageIndex = (imageIndex + 1) % homeHeroImages.length;

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

      timeout(() => {
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

      animationFrame(() => {
        imageContainer.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
        fragments.forEach((fragment) => {
          const revealTime = pattern.revealTiming(
            fragment.index,
            fragments.length,
          );
          const delay = revealTime * config.staggerRange;
          timeout(() => {
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
        timeout(() => {
          imgObj.element.remove();
        }, config.outDuration);
      } else {
        const { element, fragments, pattern: imagePattern } = imgObj;
        if (imagePattern && fragments) {
          const pattern = PATTERNS[imagePattern];
          fragments.forEach((fragment) => {
            const collapseTime = pattern.collapseTiming(
              fragment.index,
              fragments.length,
            );
            const delay = collapseTime * config.staggerRange;
            timeout(() => {
              fragment.collapse();
            }, delay);
          });
        }

        element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
        element.style.transform = "translate3d(-50%, -50%, 0) scale(0)";
        timeout(() => returnToPool(element), config.outDuration);
      }

      lastRemovalTime = now;
    }
  };

  bindHomeHeroEffectEvents(
    effectLinks,
    (effect) => {
      currentEffect = effect;
    },
    cleanupBag,
  );

  const onMouseOver = (e: MouseEvent) => {
    mouseX = lastMouseX = prevMouseX = e.clientX;
    mouseY = lastMouseY = prevMouseY = e.clientY;
    isCursorInContainer = isInContainer(mouseX, mouseY);
  };

  cleanupBag.add(on(document, "mouseover", onMouseOver));

  const onMouseMove = (e: MouseEvent) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    isCursorInContainer = isInContainer(mouseX, mouseY);
    if (isCursorInContainer && hasMovedAtAll()) {
      isMoving = true;
      cleanupMoveTimeout?.();
      cleanupMoveTimeout = timeout(() => {
        isMoving = false;
      }, 100);
    }
  };

  cleanupBag.add(on(document, "mousemove", onMouseMove));

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

  cleanupBag.add(
    on(heroSection, "touchstart", onTouchStart, { passive: true }),
  );
  cleanupBag.add(on(heroSection, "touchmove", onTouchMove, { passive: true }));
  cleanupBag.add(on(heroSection, "touchend", onTouchEnd));

  const onDocumentTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!isInContainer(t.clientX, t.clientY)) {
      isCursorInContainer = false;
      isTouching = false;
    }
  };

  cleanupBag.add(
    on(document, "touchstart", onDocumentTouchStart, { passive: true }),
  );

  const onScroll = () => {
    isCursorInContainer = isInContainer(mouseX, mouseY);
    if (isCursorInContainer) {
      isScrolling = true;
      cleanupScrollTimeout?.();
      cleanupScrollTimeout = timeout(() => {
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
      animationFrame(() => {
        if (isScrolling) createScrollTrailImage();
        scrollTicking = false;
      });
    }
  };

  cleanupBag.add(on(window, "scroll", onScroll, { passive: true }));
  cleanupBag.add(on(window, "scroll", onScrollThrottled, { passive: true }));

  const animate = () => {
    if (isMoving || isTouching || isScrolling) createTrailImage();
    removeOldImages();
  };

  animationFrameLoop(animate, cleanupBag);

  return () => {
    cleanupSpeedTimeout?.();
    cleanupMoveTimeout?.();
    cleanupScrollTimeout?.();
    cleanupBag.run();
    cleanupHomeHeroTrail(trail);
  };
};
