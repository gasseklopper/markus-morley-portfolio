// src/utils/gsapClient.ts
type LoadGsapOptions = {
  scrollTrigger?: boolean;
  customEase?: boolean;
  customWiggle?: boolean;
  splitText?: boolean;
};

let gsapPromise: Promise<any> | undefined;
let scrollTriggerPromise: Promise<any> | undefined;
let customEasePromise: Promise<any> | undefined;
let customWigglePromise: Promise<any> | undefined;
let splitTextPromise: Promise<any> | undefined;
const registeredPlugins = new Set<any>();

const getModuleExport = (mod: any, exportName: string) =>
  mod?.[exportName] ?? mod?.default ?? mod;

const loadGsapCore = () => {
  gsapPromise ??= import("gsap").then((mod) => getModuleExport(mod, "gsap"));
  return gsapPromise;
};

const registerPlugin = (gsap: any, plugin: any) => {
  if (!plugin || registeredPlugins.has(plugin)) return;

  gsap.registerPlugin(plugin);
  registeredPlugins.add(plugin);
};

export async function loadGsap(options: LoadGsapOptions = { scrollTrigger: true }) {
  const gsap = await loadGsapCore();
  const shouldLoadScrollTrigger = options.scrollTrigger ?? true;

  const [ScrollTrigger, CustomEase, CustomWiggle, SplitText] = await Promise.all([
    shouldLoadScrollTrigger
      ? (scrollTriggerPromise ??= import("gsap/ScrollTrigger").then((mod) =>
          getModuleExport(mod, "ScrollTrigger"),
        ))
      : undefined,
    options.customEase
      ? (customEasePromise ??= import("gsap/CustomEase").then((mod) =>
          getModuleExport(mod, "CustomEase"),
        ))
      : undefined,
    options.customWiggle
      ? (customWigglePromise ??= import("gsap/CustomWiggle").then((mod) =>
          getModuleExport(mod, "CustomWiggle"),
        ))
      : undefined,
    options.splitText
      ? (splitTextPromise ??= import("gsap/SplitText").then((mod) =>
          getModuleExport(mod, "SplitText"),
        ))
      : undefined,
  ]);

  registerPlugin(gsap, ScrollTrigger);
  registerPlugin(gsap, CustomEase);
  registerPlugin(gsap, CustomWiggle);
  registerPlugin(gsap, SplitText);

  return { gsap, ScrollTrigger, CustomEase, CustomWiggle, SplitText };
}
