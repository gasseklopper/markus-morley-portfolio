// src/utils/gsapClient.ts
let gsapInstance: any;
let scrollTrigger: any;
let registered = false;

export async function loadGsap() {
  if (gsapInstance && scrollTrigger) {
    return { gsap: gsapInstance, ScrollTrigger: scrollTrigger };
  }

  const gsapMod = await import("gsap");
  const stMod = await import("gsap/ScrollTrigger");

  const gsap = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;
  const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  gsapInstance = gsap;
  scrollTrigger = ScrollTrigger;

  return { gsap, ScrollTrigger };
}
