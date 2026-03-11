import { component$, useSignal, $, useVisibleTask$, useStyles$ } from "@builder.io/qwik";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./footerNew.scss?inline"



export const FooterNew = component$(
  () => {
    useStyles$(styles)
    const footerLayoutRef = useSignal<HTMLElement>()
    const footerRef = useSignal<HTMLElement>()
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      if (!footerLayoutRef.value) return

      gsap.registerPlugin(ScrollTrigger)

      const el = footerLayoutRef.value

      gsap.set(el, {
        opacity: 0,
        y: 140,
        scaleY: 0.92,
        transformOrigin: "top center",
        clipPath: "inset(100% 0% 0% 0% round 18px 18px 0 0)",
        willChange: "transform, opacity, clip-path",
      })

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
          once: true
        },
      })
    })

    const moveSticky = $((e: MouseEvent, el: HTMLElement) => {
      const text = el.querySelector('.sticky-link__text') as HTMLElement
      if (!text) return

      const sticky = Number(el.dataset.sticky || 8)

      const rect = el.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      const x = (offsetX - rect.width / 2) / sticky
      const y = (offsetY - rect.height / 2) / sticky

      gsap.to(text, {
        x,
        y,
        duration: 0.4,
        ease: 'power2.out'
      })
    })

    const enterSticky = $((e: MouseEvent, el: HTMLElement) => {
      const text = el.querySelector('.sticky-link__text') as HTMLElement
      if (!text) return

      const sticky = Number(el.dataset.sticky || 8)

      const rect = el.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      gsap.to(text, {
        x: (offsetX - rect.width / 2) / sticky,
        y: (offsetY - rect.height / 2) / sticky,
        duration: 0.12,
        ease: 'power2.out'
      })
    })

    const leaveSticky = $((el: HTMLElement) => {
      const text = el.querySelector('.sticky-link__text') as HTMLElement
      if (!text) return

      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    })


    return (
      <section>
        <div class="footer" ref={footerRef}>
          <div class="footer__layout-container" ref={footerLayoutRef}>
            <div class="footer__headlayout">
              <div class="footer__logo">
                <h2>MARKUS MORLEY</h2>
              </div>
              <div class="footer__slogan">
                <h2>Product Engineer</h2>
              </div>
              <div class="footer__header">
                <ul class="footer__submenu-list">

                </ul>
              </div>
              <div class="footer__content">
                <ul class="footer__submenu-list">

                </ul>
              </div>
            </div>
            <div class="footer__headlayout">
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
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/About"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">About</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/Contact"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">Contact</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="sticky-link"
                      data-sticky="1"
                      href="/Portfolio"
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
                      href="/404"
                      onMouseMove$={(e, el) => moveSticky(e, el)}
                      onMouseEnter$={(e, el) => enterSticky(e, el)}
                      onMouseLeave$={(_, el) => leaveSticky(el)}
                    >
                      <span class="sticky-link__text">404</span>
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
                      href="/"
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
                      href="/About"
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
                      href="/Contact"
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
                      href="/Portfolio"
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
                <h2>MORLEY</h2>
              </div>
            </div>
          </div>
          <div class="footer__navigation">
            <ul class="">
              <li>
                <a href="/">
                  <span class="sticky-link__text">©2026 Markus Morley.</span>
                </a>
              </li>
              <li>
                <a href="/Privacy-Policy">
                  <span class="sticky-link__text">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="/License-Agreement">
                  <span >License Agreement</span>
                </a>
              </li>
              <li>
                <a href="/Terms-of-Use">
                  <span >Terms of Use</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
);
