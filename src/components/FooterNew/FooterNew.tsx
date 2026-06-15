import {
  component$,
  useSignal,
  $,
  useVisibleTask$,
  useStyles$,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { loadGsap } from "~/utils/gsapClient";
import styles from "./footerNew.scss?inline";

const cvDownloadHref = "/assets/cv/markus-morley-cv-2026_1506.pdf";

export const FooterNew = component$(() => {
  useStyles$(styles);
  const footerLayoutRef = useSignal<HTMLElement>();
  const footerRef = useSignal<HTMLElement>();
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    if (!footerLayoutRef.value) return;

    const { gsap } = await loadGsap();

    const el = footerLayoutRef.value;

    gsap.set(el, {
      opacity: 0,
      y: 140,
      scaleY: 0.92,
      transformOrigin: "top center",
      clipPath: "inset(100% 0% 0% 0% round 18px 18px 0 0)",
      willChange: "transform, opacity, clip-path",
    });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      scaleY: 1,
      clipPath: "inset(0% 0% 0% 0% round 18px 18px 0 0)",
      duration: 3,
      ease: "sine.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  });

  const moveSticky = $(async (e: MouseEvent, el: HTMLElement) => {
    const { gsap } = await loadGsap({ scrollTrigger: false });
    const text = el.querySelector(".sticky-link__text") as HTMLElement;
    if (!text) return;

    const sticky = Number(el.dataset.sticky || 8);

    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const x = (offsetX - rect.width / 2) / sticky;
    const y = (offsetY - rect.height / 2) / sticky;

    gsap.to(text, {
      x,
      y,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  const enterSticky = $(async (e: MouseEvent, el: HTMLElement) => {
    const { gsap } = await loadGsap({ scrollTrigger: false });
    const text = el.querySelector(".sticky-link__text") as HTMLElement;
    if (!text) return;

    const sticky = Number(el.dataset.sticky || 8);

    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    gsap.to(text, {
      x: (offsetX - rect.width / 2) / sticky,
      y: (offsetY - rect.height / 2) / sticky,
      duration: 0.12,
      ease: "power2.out",
    });
  });

  const leaveSticky = $(async (el: HTMLElement) => {
    const { gsap } = await loadGsap({ scrollTrigger: false });
    const text = el.querySelector(".sticky-link__text") as HTMLElement;
    if (!text) return;

    gsap.to(text, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  return (
    <section>
      <div class="footer" ref={footerRef} id="site-footer">
        <div class="footer__layout-container" ref={footerLayoutRef}>
          <div class="footer__ambient" aria-hidden="true" />
          <div class="footer__orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div class="footer__headlayout footer__headlayout--intro">
            <div class="footer__logo">{/* <h2>MARKUS MORLEY</h2> */}</div>
            <div class="footer__slogan">
              <h2>MARKUS MORLEY</h2>
            </div>
            <div class="footer__header">
              <ul class="footer__submenu-list"></ul>
            </div>
            <div class="footer__content">
              <a
                class="footer__cv-download"
                href={cvDownloadHref}
                download="markus-morley-cv-2026_1506.pdf"
                aria-label="Download Markus Morley CV as PDF"
              >
                <span aria-hidden="true">PDF</span>
                Download CV
              </a>
            </div>
          </div>
          <div class="footer__headlayout footer__headlayout--links">
            <div class="footer__logo">
              <h2></h2>
            </div>
            <div class="footer__slogan">
              <h2></h2>
            </div>
            <div class="footer__header">
              <ul class="footer-links">
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="/"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Home</span>
                  </a>
                </li>
                <li>
                  <Link
                    class="sticky-link"
                    data-sticky="1"
                    href="/about"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">About</span>
                  </Link>
                </li>
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="/datenschutz"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Datenschutz</span>
                  </a>
                </li>
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="/portfolio"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Portfolio</span>
                  </a>
                </li>
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="/impressum"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Impressum</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="footer__content">
              <ul class="footer-links">
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="https://www.instagram.com/yelrom_/"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="https://www.linkedin.com/in/markus-morley/"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Linkedin</span>
                  </a>
                </li>
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="https://github.com/gasseklopper"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Github</span>
                  </a>
                </li>
                <li>
                  <a
                    class="sticky-link"
                    data-sticky="1"
                    href="https://www.behance.net/markusmorley"
                    onMouseMove$={(e, el) => moveSticky(e, el)}
                    onMouseEnter$={(e, el) => enterSticky(e, el)}
                    onMouseLeave$={(_, el) => leaveSticky(el)}
                  >
                    <span class="sticky-link__text">Research</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="footer__footer">
            <div class="footer__name">
              <h2>(c) 2026</h2>
            </div>
          </div>
        </div>
        <div class="footer__navigation">
          <ul class="">
            {/* <li>
                <a href="/">
                  <span class="">(c) 2026 Markus Morley.</span>
                </a>
              </li> */}
            <li>
              <Link href="/datenschutz">
                <span class="">Datenschutz</span>
              </Link>
            </li>
            <li>
              <Link href="/impressum">
                <span>Impressum</span>
              </Link>
            </li>
            <li>
              <Link href="/portfolio">
                <span>Portfolio</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
});
