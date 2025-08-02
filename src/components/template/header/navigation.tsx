import { component$, $, useSignal, useVisibleTask$, useStylesScoped$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import gsap from "gsap";
import headerData from "./data";
import styles from "./navigation.css?inline";

export const Navigation = component$(() => {
  useStylesScoped$(styles);

  const isOpen = useSignal(false);
  const menuRef = useSignal<HTMLElement>();
  const tl = useSignal<gsap.core.Timeline>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const menu = menuRef.value;
    if (!menu) return;
    const items = menu.querySelectorAll("li");
    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
      onReverseComplete: () => {
        gsap.set(menu, { pointerEvents: "none" });
      },
    });
    timeline.set(menu, { autoAlpha: 0, pointerEvents: "none" });
    timeline.to(menu, { autoAlpha: 1, pointerEvents: "auto", duration: 0.3 });
    timeline.from(items, { y: 40, opacity: 0, stagger: 0.1, duration: 0.4 }, "-=0.1");
    tl.value = timeline;
    cleanup(() => timeline.kill());
  });

  const toggleMenu = $(() => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      tl.value?.play(0);
      document.body.style.overflow = "hidden";
    } else {
      tl.value?.reverse();
      document.body.style.removeProperty("overflow");
    }
  });

  return (
    <>
      <button
        type="button"
        class={`burger ${isOpen.value ? "hidden" : ""}`}
        aria-label="Menu"
        aria-controls="main-menu"
        aria-expanded={isOpen.value ? "true" : "false"}
        onClick$={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>
      <nav
        id="main-menu"
        ref={menuRef}
        class="menu"
        aria-hidden={isOpen.value ? "false" : "true"}
      >
        <button
          type="button"
          class="close"
          aria-label="Close menu"
          onClick$={toggleMenu}
        >
          <span />
          <span />
        </button>
        <ul>
          {headerData.nav?.map((item) => (
            <li key={item.link}>
              <Link href={item.link} onClick$={toggleMenu}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
});

export default Navigation;
