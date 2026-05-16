import { createCleanupBag, prefersReducedMotion } from "~/utils/browserClient";
import { loadGsap } from "~/utils/gsapClient";
import { cleanupTestCodexAnimations } from "./test-codex.cleanup";
import { testCodexConfig } from "./test-codex.config";
import { queryTestCodexDom } from "./test-codex.dom";
import { bindTestCodexPointerEvents } from "./test-codex.events";

export const setupTestCodexAnimations = async (root: HTMLElement) => {
  if (prefersReducedMotion()) {
    return () => undefined;
  }

  const { gsap, ScrollTrigger } = await loadGsap();
  const cleanupBag = createCleanupBag();

  const ctx = gsap.context(() => {
    const {
      titleChars,
      plates,
      frameRows,
      floatingImages,
      signalLines,
      chapterCards,
      careerChapterSection,
      careerChapterCards,
      reelTrack,
      reelSection,
      progressBar,
      heroFloat,
      hero,
      statement,
      statementPhrases,
      statementGroups,
      statementLine,
      marqueeItems,
      kineticWords,
      iris,
      metricValues,
      metricLabels,
      finale,
      finaleCopy,
      finaleWords,
      finaleKicker,
      microCards,
    } = queryTestCodexDom(root);
    const isCompactViewport = window.matchMedia(
      testCodexConfig.compactViewportQuery,
    ).matches;

    gsap.set(titleChars, { yPercent: 115, rotate: 3, opacity: 0 });
    gsap.set(plates, { clipPath: "inset(100% 0 0 0)" });
    gsap.set(signalLines, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(chapterCards, { autoAlpha: 0, y: 54, rotateX: -7 });
    gsap.set(careerChapterCards, {
      autoAlpha: 0,
      x: -36,
      y: 34,
      rotateX: -5,
      transformOrigin: "50% 100%",
    });
    gsap.set(statementPhrases, {
      autoAlpha: 0,
      yPercent: 118,
      rotateX: -58,
      rotateZ: 2,
      filter: "blur(18px)",
      transformOrigin: "50% 100%",
    });
    gsap.set(statementGroups, { autoAlpha: 0 });
    gsap.set(statementLine, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(kineticWords, { yPercent: 100, opacity: 0 });
    gsap.set(metricValues, { yPercent: 34, opacity: 0, filter: "blur(12px)" });
    gsap.set(metricLabels, { y: 18, opacity: 0 });
    gsap.set(finaleCopy, { y: 46, opacity: 0 });

    bindTestCodexPointerEvents(root, gsap, microCards, cleanupBag);

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

    const intro = gsap.timeline({
      defaults: { ease: "expo.out" },
    });

    intro
      .to(titleChars, {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.25,
        stagger: 0.035,
      })
      .to(
        plates,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          stagger: 0.1,
        },
        "-=0.85",
      )
      .to(
        signalLines,
        {
          scaleX: 1,
          duration: 0.9,
          stagger: 0.08,
        },
        "-=0.7",
      )
      .to(
        kineticWords,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.06,
        },
        "-=0.7",
      );

    if (iris) {
      gsap.to(iris, {
        rotate: 22,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }

    gsap.to(heroFloat, {
      autoAlpha: 0,
      y: -70,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "55% top",
        end: "bottom top",
        scrub: true,
      },
    });

    floatingImages.forEach((image, index) => {
      gsap.to(image, {
        yPercent: index % 2 === 0 ? -12 : 9,
        rotate: index % 2 === 0 ? -2.5 : 2.5,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    if (statement && statementGroups.length) {
      const statementGroupItems = Array.from(statementGroups).map((group) =>
        Array.from(
          group.querySelectorAll<HTMLElement>("[data-statement-phrase]"),
        ),
      );
      const statementTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: statement,
          start: "top top",
          end: () =>
            `+=${Math.max(
              window.innerHeight * (isCompactViewport ? 5.2 : 4.2),
              statement.offsetHeight * (isCompactViewport ? 4.4 : 3.6),
            )}`,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      statementTimeline
        .to(statement, {
          "--statement-blue-x": "28%",
          "--statement-blue-y": "38%",
          "--statement-glow": "1",
          "--statement-moss-x": "18%",
          "--statement-moss-y": "70%",
          "--statement-orbit-rotate": "16deg",
          "--statement-orbit-scale": "1.04",
          "--statement-orbit-x": "-28%",
          "--statement-orbit-y": "-16%",
          "--statement-red-x": "72%",
          "--statement-red-y": "64%",
          "--statement-shift": "68%",
          duration: 0.55,
          ease: "none",
        })
        .to(
          statementLine,
          {
            scaleX: 1,
            duration: 4.85,
            ease: "none",
          },
          0.04,
        )
        .to(
          statement,
          {
            "--statement-blue-x": "54%",
            "--statement-blue-y": "30%",
            "--statement-glow": "0.35",
            "--statement-moss-x": "78%",
            "--statement-moss-y": "62%",
            "--statement-orbit-rotate": "88deg",
            "--statement-orbit-scale": "1.1",
            "--statement-orbit-x": "42%",
            "--statement-orbit-y": "28%",
            "--statement-red-x": "22%",
            "--statement-red-y": "72%",
            "--statement-shift": "18%",
            duration: 0.5,
            ease: "none",
          },
          4.3,
        );

      statementGroupItems.forEach((phrases, groupIndex) => {
        const enterAt =
          groupIndex === 0 ? 0.08 : groupIndex === 1 ? 1.75 : 3.18;
        const exitAt = groupIndex === 0 ? 1.25 : groupIndex === 1 ? 2.8 : null;
        const group = statementGroups[groupIndex];
        const atmosphere = [
          {
            "--statement-blue-x": "30%",
            "--statement-blue-y": "36%",
            "--statement-moss-x": "16%",
            "--statement-moss-y": "72%",
            "--statement-orbit-rotate": "18deg",
            "--statement-orbit-scale": "1.04",
            "--statement-orbit-x": "-30%",
            "--statement-orbit-y": "-18%",
            "--statement-red-x": "76%",
            "--statement-red-y": "62%",
            "--statement-shift": "64%",
          },
          {
            "--statement-blue-x": "66%",
            "--statement-blue-y": "42%",
            "--statement-moss-x": "38%",
            "--statement-moss-y": "24%",
            "--statement-orbit-rotate": "54deg",
            "--statement-orbit-scale": "1.08",
            "--statement-orbit-x": "18%",
            "--statement-orbit-y": "-34%",
            "--statement-red-x": "30%",
            "--statement-red-y": "68%",
            "--statement-shift": "46%",
          },
          {
            "--statement-blue-x": "48%",
            "--statement-blue-y": "74%",
            "--statement-moss-x": "82%",
            "--statement-moss-y": "48%",
            "--statement-orbit-rotate": "94deg",
            "--statement-orbit-scale": "1.12",
            "--statement-orbit-x": "48%",
            "--statement-orbit-y": "30%",
            "--statement-red-x": "18%",
            "--statement-red-y": "28%",
            "--statement-shift": "22%",
          },
        ][groupIndex];

        statementTimeline
          .to(
            statement,
            {
              ...atmosphere,
              duration: 0.72,
              ease: "none",
            },
            enterAt,
          )
          .to(group, { autoAlpha: 1, duration: 0.01, ease: "none" }, enterAt)
          .to(
            phrases,
            {
              autoAlpha: 1,
              yPercent: 0,
              rotateX: 0,
              rotateZ: 0,
              filter: "blur(0px)",
              duration: 0.62,
              ease: "expo.out",
              stagger: {
                each: 0.08,
                from: "start",
              },
            },
            enterAt,
          )
          .to(
            phrases,
            {
              color: (_index: number, target: HTMLElement) => {
                if (
                  target.classList.contains(
                    "test-codex__statement-phrase--warm",
                  )
                ) {
                  return "#ff7542";
                }

                if (
                  target.classList.contains(
                    "test-codex__statement-phrase--cool",
                  ) ||
                  target.classList.contains(
                    "test-codex__statement-phrase--blend",
                  )
                ) {
                  return "#67bce2";
                }

                return "#f8f4ea";
              },
              textShadow: (_index: number, target: HTMLElement) => {
                if (
                  target.classList.contains(
                    "test-codex__statement-phrase--warm",
                  )
                ) {
                  return "0 0 28px rgba(255, 117, 66, 0.24)";
                }

                if (
                  target.classList.contains(
                    "test-codex__statement-phrase--cool",
                  ) ||
                  target.classList.contains(
                    "test-codex__statement-phrase--blend",
                  )
                ) {
                  return "0 0 34px rgba(103, 188, 226, 0.24)";
                }

                return "0 0 18px rgba(248, 244, 234, 0.1)";
              },
              duration: 0.28,
              stagger: 0.035,
              ease: "none",
            },
            enterAt + 0.32,
          )
          .to(
            phrases,
            {
              yPercent: (index: number) => (index % 2 === 0 ? -6 : 5),
              xPercent: (index: number) => (index % 3 === 0 ? -1.5 : 1.5),
              duration: 0.28,
              ease: "none",
              stagger: {
                each: 0.025,
                from: "center",
              },
            },
            enterAt + 0.64,
          );

        if (exitAt !== null) {
          statementTimeline
            .to(
              phrases,
              {
                autoAlpha: 0,
                yPercent: -118,
                rotateX: 52,
                rotateZ: -2,
                filter: "blur(18px)",
                duration: 0.46,
                ease: "power2.in",
                stagger: {
                  each: 0.055,
                  from: "start",
                },
              },
              exitAt,
            )
            .to(
              group,
              {
                autoAlpha: 0,
                duration: 0.01,
                ease: "none",
              },
              exitAt + 0.54,
            );
        }
      });
    }

    chapterCards.forEach((card, index) => {
      gsap.to(card, {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        delay: index * 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    if (careerChapterSection && careerChapterCards.length) {
      gsap.to(careerChapterCards, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotateX: 0,
        duration: 0.95,
        ease: "power3.out",
        stagger: {
          each: 0.16,
          from: "start",
        },
        scrollTrigger: {
          trigger: careerChapterSection,
          start: "top 76%",
          toggleActions: "play none none reverse",
        },
      });
    }

    marqueeItems.forEach((item, index) => {
      gsap.to(item, {
        xPercent: index % 2 === 0 ? -18 : 18,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    metricValues.forEach((value, index) => {
      const targetValue = Number(
        value.dataset.metricTarget ?? value.textContent ?? 0,
      );
      const counter = { value: 0 };

      value.textContent = "00";

      gsap.to(value, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        delay: index * 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: value,
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(counter, {
        value: targetValue,
        duration: 1.25,
        delay: index * 0.08,
        ease: "power3.out",
        snap: { value: 1 },
        scrollTrigger: {
          trigger: value,
          start: "top 84%",
          toggleActions: "play none none reverse",
          onLeaveBack: () => {
            counter.value = 0;
            value.textContent = "00";
          },
        },
        onUpdate: () => {
          value.textContent = String(Math.round(counter.value)).padStart(
            2,
            "0",
          );
        },
      });
    });

    metricLabels.forEach((label, index) => {
      gsap.to(label, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        delay: 0.18 + index * 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: label,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    if (finale) {
      gsap.to(finale, {
        "--finale-drift": "72%",
        "--finale-glow": "1",
        ease: "none",
        scrollTrigger: {
          trigger: finale,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    gsap.set(finaleWords, { yPercent: 115, rotate: 2, opacity: 0 });
    gsap.set(finaleKicker, { y: 14, opacity: 0, letterSpacing: "0.42em" });

    gsap.to(finaleKicker, {
      y: 0,
      opacity: 1,
      letterSpacing: "0.28em",
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: finale,
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.to(finaleWords, {
      yPercent: 0,
      rotate: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.075,
      ease: "expo.out",
      scrollTrigger: {
        trigger: finale,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.to(finaleCopy, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      delay: 0.35,
      ease: "power3.out",
      scrollTrigger: {
        trigger: finale,
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
    });

    if (reelTrack && reelSection && !isCompactViewport) {
      const getDistance = () =>
        Math.max(0, reelTrack.scrollWidth - window.innerWidth + 48);

      gsap.to(reelTrack, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: reelSection,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight, getDistance())}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    frameRows.forEach((row) => {
      const image = row.querySelector<HTMLElement>("[data-frame-image]");
      const copy = row.querySelectorAll<HTMLElement>("[data-frame-copy]");

      gsap.fromTo(
        image,
        {
          clipPath: "inset(18% 18% 18% 18%)",
          scale: 1.14,
          filter: "grayscale(1) contrast(1.35)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          filter: "grayscale(0.15) contrast(1.05)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 78%",
            end: "top 28%",
            scrub: 0.8,
          },
        },
      );

      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }, root);

  ScrollTrigger.refresh();

  return () => {
    cleanupTestCodexAnimations(ctx, cleanupBag.run);
  };
};
