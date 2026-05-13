import { prefersReducedMotion } from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";
import { cleanupItsmgroupAnimations } from "./itsmgroup.cleanup";
import { itsmgroupConfig } from "./itsmgroup.config";
import { queryItsmgroupDom } from "./itsmgroup.dom";

export const setupItsmgroupAnimations = async (root: HTMLElement) => {
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
      heroPanels,
      revealItems,
      sections,
      numbers,
      systemNodes,
      systemLines,
      stackCards,
      reelSection,
      reelTrack,
      finale,
      finaleItems,
    } = queryItsmgroupDom(root);
    const isCompactViewport = window.matchMedia(
      itsmgroupConfig.compactViewportQuery,
    ).matches;

    gsap.set(heroTitle, { yPercent: 22, opacity: 0, filter: "blur(14px)" });
    gsap.set(heroLines, { y: 30, opacity: 0 });
    gsap.set(heroPanels, { y: 42, opacity: 0, rotateX: -7 });
    gsap.set(revealItems, { y: 44, opacity: 0 });
    gsap.set(sections, { y: 58, opacity: 0 });
    gsap.set(numbers, { yPercent: 45, opacity: 0 });
    gsap.set(systemNodes, { scale: 0.72, opacity: 0 });
    gsap.set(systemLines, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(stackCards, { y: 36, opacity: 0, rotate: -1.5 });
    gsap.set(finaleItems, { y: 36, opacity: 0 });

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
        duration: 1.1,
      })
      .to(
        heroLines,
        { y: 0, opacity: 1, duration: 0.76, stagger: 0.07 },
        "-=0.72",
      )
      .to(
        heroPanels,
        { y: 0, opacity: 1, rotateX: 0, duration: 0.82, stagger: 0.08 },
        "-=0.48",
      );

    if (hero) {
      gsap.to(hero, {
        "--hero-shift": "1",
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
        duration: 0.72,
        delay: index * 0.01,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });
    });

    sections.forEach((section, index) => {
      gsap.to(section, {
        y: 0,
        opacity: 1,
        duration: 0.86,
        delay: (index % 4) * 0.035,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    });

    numbers.forEach((number) => {
      gsap.to(number, {
        yPercent: 0,
        opacity: 1,
        duration: 0.82,
        ease: "expo.out",
        scrollTrigger: {
          trigger: number,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    if (systemNodes.length) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: systemNodes[0].closest("section"),
            start: "top 68%",
            toggleActions: "play none none reverse",
          },
        })
        .to(systemLines, {
          scaleX: 1,
          duration: 0.84,
          stagger: 0.08,
          ease: "power2.out",
        })
        .to(
          systemNodes,
          {
            scale: 1,
            opacity: 1,
            duration: 0.66,
            stagger: 0.06,
            ease: "back.out(1.7)",
          },
          "-=0.52",
        );
    }

    stackCards.forEach((card, index) => {
      gsap.to(card, {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.78,
        delay: index * 0.055,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });
    });

    if (reelTrack && reelSection && !isCompactViewport) {
      const getDistance = () =>
        Math.max(0, reelTrack.scrollWidth - window.innerWidth + 80);

      gsap.to(reelTrack, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: reelSection,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight, getDistance())}`,
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    if (finale) {
      gsap.to(finale, {
        "--finale-power": "1",
        ease: "none",
        scrollTrigger: {
          trigger: finale,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(finaleItems, {
        y: 0,
        opacity: 1,
        duration: 0.82,
        stagger: 0.09,
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
    cleanupItsmgroupAnimations(ctx);
  };
};
