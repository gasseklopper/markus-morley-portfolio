import {
  createCleanupBag,
  observeElementResize,
  prefersReducedMotion,
  timeout,
} from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";
import { cleanupScrollTransition } from "./cleanup";
import { scrollTransitionConfig } from "./config";
import { queryScrollTransitionDom } from "./dom";
import { createBlinds, type BlindSet } from "./patterns";

export const setupScrollTransition = async (root: HTMLElement) => {
  if (prefersReducedMotion()) {
    root.classList.add("scroll-transition--reduced");
    return () => undefined;
  }

  const { gsap, ScrollTrigger } = await loadGsap();
  const lenisMod = await import("lenis");
  const Lenis = (lenisMod as any).default ?? lenisMod;
  const cleanupBag = createCleanupBag();
  const isTouch = window.matchMedia(
    scrollTransitionConfig.touchPointerQuery,
  ).matches;
  const lenis = new Lenis({
    lerp: 0.15,
    smoothWheel: true,
    smoothTouch: !isTouch,
  });

  let blindsSets: BlindSet[] = [];
  let master: gsap.core.Timeline | undefined;
  let cleanupResizeTimeout: (() => void) | undefined;

  const openBlinds = ({ cells, rows, cols }: BlindSet) => {
    const ordered: SVGRectElement[] = [];

    for (let x = 0; x < cols; x++) {
      const column: SVGRectElement[] = [];

      for (let y = 0; y < rows; y++) {
        column.push(cells[y * cols + x]);
      }

      ordered.push(...gsap.utils.shuffle(column));
    }

    return gsap.timeline().to(ordered, {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      stagger: { each: 0.02 },
    });
  };

  const textIn = (el: Element) =>
    gsap.fromTo(
      el,
      {
        autoAlpha: 0,
        clipPath: "inset(18% 0% 0% 0%)",
        y: 52,
      },
      {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        y: 0,
        duration: 2.8,
        ease: "power4.out",
      },
    );

  const textOut = (el: Element) =>
    gsap.to(el, {
      autoAlpha: 0,
      clipPath: "inset(0% 0% 55% 0%)",
      y: -28,
      duration: 2,
      ease: "power3.inOut",
    });

  const buildMasterTimeline = () => {
    if (master) master.kill();

    const { texts, stage } = queryScrollTransitionDom(root);
    if (!stage) return;

    master = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 2.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    blindsSets.forEach((set, index) => {
      master?.add(openBlinds(set));

      const text = texts[index];
      if (text) {
        master?.add(textIn(text), "-=0.3");
        master?.add(textOut(text), "+=0.8");
      }
    });
  };

  const updateLayout = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const vbWidth = 100;
    const vbHeight = (height / width) * 100;
    blindsSets = [];

    queryScrollTransitionDom(root).layers.forEach((svg) => {
      svg.setAttribute("viewBox", `0 0 ${vbWidth} ${vbHeight}`);

      const maskRect = svg.querySelector("mask rect");
      maskRect?.setAttribute("width", String(vbWidth));
      maskRect?.setAttribute("height", String(vbHeight));

      const img = svg.querySelector("image");
      img?.setAttribute("width", String(vbWidth));
      img?.setAttribute("height", String(vbHeight));

      const result = createBlinds(svg.querySelector("g[data-blinds]"));
      if (result) blindsSets.push(result);
    });

    buildMasterTimeline();
  };

  const initProgressBar = () => {
    const { progressFills, stage } = queryScrollTransitionDom(root);
    if (!stage) return undefined;

    return ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self: { progress: number }) => {
        const totalSteps = progressFills.length;

        progressFills.forEach((fill: HTMLElement, index: number) => {
          const progress = Math.max(
            0,
            Math.min(1, (self.progress - index / totalSteps) * totalSteps),
          );
          fill.style.width = `${progress * 100}%`;
        });
      },
    });
  };

  const onResize = () => {
    cleanupResizeTimeout?.();

    cleanupResizeTimeout = timeout(() => {
      ScrollTrigger.refresh();
      updateLayout();
    }, scrollTransitionConfig.resizeDebounce);
  };

  const lenisUpdate = () => ScrollTrigger.update();
  const tick = (time: number) => lenis.raf(time * 1000);

  lenis.on("scroll", lenisUpdate);
  gsap.ticker.add(tick);
  updateLayout();
  const progressTrigger = initProgressBar();
  observeElementResize(root, onResize, cleanupBag);

  return () => {
    cleanupResizeTimeout?.();
    cleanupScrollTransition(
      cleanupBag.run,
      () => gsap.ticker.remove(tick),
      () => progressTrigger?.kill(),
      () => master?.kill(),
      () => {
        ScrollTrigger.getAll().forEach((trigger: any) => {
          if (root.contains(trigger.trigger)) trigger.kill();
        });
      },
      () => lenis.destroy(),
    );
  };
};
