import { component$, useSignal, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import { loadGsap } from "~/utils/gsapClient";
import styles from "./airplane-viewport-test.scss?inline";

const bannerText = "product engineer";
const bannerLetters = bannerText.split("");
const bannerCells = ["", ...bannerLetters, ""];

export const AirplaneViewportTest = component$(() => {
  useStyles$(styles);

  const viewportRef = useSignal<HTMLElement>();
  const planeRef = useSignal<HTMLElement>();
  const bannerRef = useSignal<HTMLElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const viewport = viewportRef.value;
    const plane = planeRef.value;

    if (!viewport || !plane) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      plane.style.transform = "translate3d(-50%, -50%, 0) rotate(-8deg)";
      return;
    }

    const { gsap } = await loadGsap();
    const flight = { progress: 0, direction: 1 };
    let bounds = viewport.getBoundingClientRect();
    let waveTime = 0;
    const bannerSegments = Array.from(
      bannerRef.value?.querySelectorAll<HTMLElement>("[data-banner-segment]") ?? [],
    );

    const updateBounds = () => {
      bounds = viewport.getBoundingClientRect();
    };

    const placePlane = () => {
      const offscreen = Math.max(plane.offsetWidth * 0.58, 180);
      const startX = flight.direction === 1 ? -offscreen : bounds.width + offscreen;
      const endX = flight.direction === 1 ? bounds.width + offscreen : -offscreen;
      const x = startX + (endX - startX) * flight.progress;
      const centerY = bounds.height / 2;
      const y = centerY + Math.sin(flight.progress * Math.PI * 2) * 34;
      const drift = Math.cos(flight.progress * Math.PI * 2) * 3;
      const bannerLift = Math.sin(flight.progress * Math.PI) * -10;
      const bannerSkew = flight.direction * Math.sin(flight.progress * Math.PI * 2) * 5;
      waveTime += 0.045 * flight.direction;

      gsap.set(plane, {
        x,
        y,
        rotation: drift,
        scaleX: flight.direction,
        xPercent: -50,
        yPercent: -50,
      });

      plane.classList.toggle("airplane-test__plane--reverse", flight.direction === -1);

      if (bannerRef.value) {
        gsap.set(bannerRef.value, {
          skewY: bannerSkew,
          y: bannerLift * 0.3,
        });
      }

      bannerSegments.forEach((segment, index) => {
        const progress = bannerSegments.length <= 1 ? 0 : index / (bannerSegments.length - 1);
        const delay = index * 0.4;
        const wave = Math.sin(waveTime * 5.2 - delay) * 18;
        const curl = Math.cos(waveTime * 4.1 - delay) * 16;
        const depth = Math.sin(waveTime * 4.6 - delay) * 0.28;
        const gravitySag = Math.sin(progress * Math.PI) * 30 + (1 - progress) * 18;
        const gravityLean = (0.5 - progress) * 10;

        gsap.set(segment, {
          y: gravitySag + wave + bannerLift * (index + 1) * 0.05,
          rotation: gravityLean + curl + bannerSkew * (index + 1) * 0.05,
          scaleY: 1 + depth,
          z: Math.sin(waveTime * 4.8 - delay) * 18,
        });
      });
    };

    updateBounds();
    placePlane();

    const tween = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        flight.direction = 1;
      },
    });

    tween
      .set(flight, { progress: 0, direction: 1 })
      .to(flight, {
        progress: 1,
        duration: 7.5,
        ease: "sine.inOut",
        onUpdate: placePlane,
      })
      .to({}, { duration: 1.2 })
      .set(flight, { progress: 0, direction: -1 })
      .to(flight, {
        progress: 1,
        duration: 7.5,
        ease: "sine.inOut",
        onUpdate: placePlane,
      })
      .to({}, { duration: 1.2 });

    const intro = gsap.fromTo(
      viewport.querySelectorAll("[data-flight-intro]"),
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
      },
    );

    window.addEventListener("resize", updateBounds);

    cleanup(() => {
      window.removeEventListener("resize", updateBounds);
      tween.kill();
      intro.kill();
    });
  });

  return (
    <section ref={viewportRef} class="airplane-test" aria-labelledby="airplane-test-title">
      <div class="airplane-test__sky" aria-hidden="true">
        <span class="airplane-test__cloud airplane-test__cloud--one" />
        <span class="airplane-test__cloud airplane-test__cloud--two" />
        <span class="airplane-test__cloud airplane-test__cloud--three" />
      </div>

      <div class="airplane-test__copy">
        <p data-flight-intro class="airplane-test__eyebrow">
          Qwik + GSAP test component
        </p>
        <h1 data-flight-intro id="airplane-test-title">
          Airplane flying an 8
        </h1>
        <p data-flight-intro>
          A rocket-plane loops through the viewport while carrying the product engineer signal.
        </p>
      </div>

      <div ref={planeRef} class="airplane-test__plane" aria-hidden="true">
        <span ref={bannerRef} class="airplane-test__banner">
          <span class="airplane-test__ribbon" aria-hidden="true">
            {bannerCells.map((letter, index) => (
              <span
                key={`ribbon-${index}`}
                data-banner-segment
                class={{
                  "airplane-test__ribbon-segment": true,
                  "airplane-test__ribbon-segment--start": index === 0,
                  "airplane-test__ribbon-segment--end": index === bannerCells.length - 1,
                  "airplane-test__ribbon-segment--space": letter === " ",
                  "airplane-test__ribbon-segment--edge-space": letter === "",
                }}
              >
                {letter && (
                  <span class="airplane-test__letter">{letter === " " ? "\u00a0" : letter}</span>
                )}
              </span>
            ))}
          </span>
        </span>
        <span class="airplane-test__banner-connector" />
        <span class="airplane-test__tow airplane-test__tow--top" />
        <span class="airplane-test__tow airplane-test__tow--bottom" />
        <span class="airplane-test__propeller" />
        <span class="airplane-test__fin" />
        <span class="airplane-test__rocket">
          <span class="airplane-test__cockpit" />
          <span class="airplane-test__stripe" />
          <span class="airplane-test__porthole" />
          <span class="airplane-test__nose" />
        </span>
      </div>
    </section>
  );
});
