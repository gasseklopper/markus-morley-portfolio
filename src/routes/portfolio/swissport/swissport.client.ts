import { prefersReducedMotion } from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";
import { cleanupSwissportAnimations } from "./swissport.cleanup";
import { swissportConfig } from "./swissport.config";
import { querySwissportDom } from "./swissport.dom";

export const setupSwissportAnimations = async (root: HTMLElement) => {
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
      sections,
      revealItems,
      numberItems,
      mapSection,
      mapNodes,
      routeLines,
      reelSection,
      reelTrack,
      screenshots,
      finale,
      finaleItems,
    } = querySwissportDom(root);
    const isCompactViewport = window.matchMedia(
      swissportConfig.compactViewportQuery,
    ).matches;

    gsap.set(heroTitle, { yPercent: 18, opacity: 0, filter: "blur(14px)" });
    gsap.set(heroLines, { y: 34, opacity: 0 });
    gsap.set(metaItems, { y: 24, opacity: 0 });
    gsap.set(sections, { y: 64, opacity: 0 });
    gsap.set(revealItems, { y: 42, opacity: 0 });
    gsap.set(numberItems, { yPercent: 40, opacity: 0 });
    gsap.set(mapNodes, { scale: 0.7, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set(routeLines, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(screenshots, { y: 34, opacity: 0, rotateX: -5 });
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
        duration: 1.15,
      })
      .to(
        heroLines,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
        },
        "-=0.78",
      )
      .to(
        metaItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.74,
          stagger: 0.055,
        },
        "-=0.54",
      );

    if (hero) {
      gsap.to(hero, {
        "--hero-wash": "0.84",
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    sections.forEach((section, index) => {
      gsap.to(section, {
        y: 0,
        opacity: 1,
        duration: 0.88,
        delay: (index % 3) * 0.035,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    });

    revealItems.forEach((item, index) => {
      gsap.to(item, {
        y: 0,
        opacity: 1,
        duration: 0.78,
        delay: index * 0.012,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });
    });

    numberItems.forEach((item) => {
      gsap.to(item, {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        ease: "expo.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    if (mapSection) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: mapSection,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })
        .to(routeLines, {
          scaleX: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
        })
        .to(
          mapNodes,
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: "back.out(1.8)",
          },
          "-=0.58",
        );
    }

    screenshots.forEach((screen, index) => {
      gsap.to(screen, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.85,
        delay: index * 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: screen,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      const image = screen.querySelector("img");
      if (image) {
        gsap.to(image, {
          scale: 1.07,
          ease: "none",
          scrollTrigger: {
            trigger: screen,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    if (reelTrack && reelSection && !isCompactViewport) {
      const getDistance = () =>
        Math.max(0, reelTrack.scrollWidth - window.innerWidth + 72);

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
        "--finale-signal": "1",
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
    cleanupSwissportAnimations(ctx);
  };
};
