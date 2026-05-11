export type ScrollTransitionSlide = {
  image: string;
  label: string;
  kicker: string;
  title: string;
  copy: string;
};

export const scrollTransitionSlides: ScrollTransitionSlide[] = [
  {
    image: "/assets/images/photography/black/Template_index_03_12.jpg",
    label: "First",
    kicker: "Image",
    title: "Section transition",
    copy: "A responsive SVG mask grid opens column by column while scroll progress drives the next photographic layer into view.",
  },
  {
    image: "/assets/images/photography/black/Template_index_015.jpg",
    label: "Second",
    kicker: "Image",
    title: "Column grid",
    copy: "Each column shuffles vertically before revealing, giving the transition a controlled rhythm without feeling too mechanical.",
  },
  {
    image: "/assets/images/photography/black/Template_index_018.jpg",
    label: "Third",
    kicker: "Image",
    title: "ScrollTrigger",
    copy: "GSAP, ScrollTrigger, and Lenis stay inside the browser-only Qwik task so the route remains resumable.",
  },
];
