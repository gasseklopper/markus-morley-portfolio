import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
  useStyles$,
  type Signal,
} from "@builder.io/qwik";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

/* ------------ Styles ------------ */
const styles = `
  body { margin: 0; }
  .page { font-family: sans-serif; }
  .section {
    height: 100vh;
    position: relative;
    overflow: hidden;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    font-size: 3rem;
    will-change: transform, opacity;
  }
  .parallax {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: inherit;
    will-change: transform;
  }
`;

/* ------------ Utilities ------------ */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------ Main Component ------------ */
export default component$(() => {
  useStyles$(styles);
  const scrollY = useSignal(0);

  // Scroll tracking
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const onScroll = () => (scrollY.value = window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanup(() => window.removeEventListener("scroll", onScroll));
  });

  const sections = [
    { color: "#ff4d4f", text: "First Section" },
    { color: "#52c41a", text: "Second Section" },
    { color: "#1890ff", text: "Third Section" },
  ];

  return (
    <div class="page">
      {sections.map((s, i) => (
        <Section key={i} color={s.color} text={s.text} scroll={scrollY} />
      ))}
    </div>
  );
});

/* ------------ Section Component ------------ */
interface SectionProps {
  color: string;
  text: string;
  scroll: Signal<number>;
}

export const Section = component$<SectionProps>(({ color, text, scroll }) => {
  const ref = useSignal<HTMLElement>();
  const progress = useSignal(0);
  const visible = useSignal(false);
  const parallax = useSignal(0);

  // Viewport detection
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const el = ref.value;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => (visible.value = visible.value || e.isIntersecting),
        ),
      { threshold: 0.1 },
    );
    io.observe(el);
    cleanup(() => io.disconnect());
  });

  // Scroll-based animation
  useTask$(({ track }) => {
    track(() => scroll.value);
    const el = ref.value;
    if (!el || typeof window === "undefined") return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const raw = 1 - (rect.top + rect.height) / (vh + rect.height); // normalized 0‑1
    progress.value = Math.min(Math.max(raw, 0), 1);

    parallax.value = lerp(-50, 50, progress.value); // background parallax
  });

  const opacity = () => (visible.value ? lerp(0, 1, progress.value) : 0);
  const translate = () => (visible.value ? lerp(50, 0, progress.value) : 50);

  return (
    <section ref={ref} class="section" style={{ background: color }}>
      <div
        class="parallax"
        style={{ transform: `translateY(${parallax.value}px)` }}
      />
      <div
        class="content"
        style={{
          opacity: opacity(),
          transform: `translateY(${translate()}px)`,
        }}
      >
        {text}
      </div>
    </section>
  );
});

export const head = buildHead(
  `Project 001 - ${siteConfig.metadata.title}`,
  "Scroll-based parallax animation demo.",
);
