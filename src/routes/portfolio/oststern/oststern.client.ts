import { prefersReducedMotion } from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";
import { cleanupOststernAnimations } from "./oststern.cleanup";
import { oststernConfig } from "./oststern.config";
import { queryOststernDom } from "./oststern.dom";

export const setupOststernAnimations = async (root: HTMLElement) => {
  if (prefersReducedMotion()) {
    return () => undefined;
  }

  const { gsap, ScrollTrigger } = await loadGsap();

  const ctx = gsap.context(() => {
    const {
      progressBar,
      hero,
      heroTitle,
      heroLines,
      metaItems,
      revealItems,
      steps,
      showcase,
      reelTrack,
      devices,
      parallaxItems,
      finale,
      finaleItems,
    } = queryOststernDom(root);
    const isCompactViewport = window.matchMedia(
      oststernConfig.compactViewportQuery,
    ).matches;

    gsap.set(heroTitle, { yPercent: 18, opacity: 0, filter: "blur(12px)" });
    gsap.set(heroLines, { y: 30, opacity: 0 });
    gsap.set(metaItems, { y: 24, opacity: 0 });
    gsap.set(revealItems, { y: 46, opacity: 0 });
    gsap.set(steps, { y: 46, opacity: 0 });
    gsap.set(devices, { y: 34, opacity: 0, rotateX: -5 });
    gsap.set(finaleItems, { y: 34, opacity: 0 });

    if (progressBar) {
      gsap.fromTo(
        progressBar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }

    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .to(heroTitle, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.05,
      })
      .to(
        heroLines,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
        },
        "-=0.72",
      )
      .to(
        metaItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.06,
        },
        "-=0.52",
      );

    if (hero) {
      gsap.to(hero, {
        "--hero-dim": "0.72",
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    revealItems.forEach((item, index) => {
      gsap.to(item, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.015,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    });

    steps.forEach((step, index) => {
      gsap.to(step, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        delay: (index % 4) * 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: step,
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });
    });

    devices.forEach((device, index) => {
      gsap.to(device, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.85,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: device,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      const image = device.querySelector("img");
      if (image) {
        gsap.to(image, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: device,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    parallaxItems.forEach((item, index) => {
      gsap.to(item, {
        yPercent: index % 2 === 0 ? -10 : 10,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    if (reelTrack && showcase && !isCompactViewport) {
      const getDistance = () =>
        Math.max(0, reelTrack.scrollWidth - window.innerWidth + 64);

      gsap.to(reelTrack, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: showcase,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight, getDistance())}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    if (finale) {
      gsap.to(finaleItems, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: finale,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, root);

  ScrollTrigger.refresh();

  return () => {
    cleanupOststernAnimations(ctx);
  };
};
