export type Cleanup = () => void;

type EventTargetLike = {
  addEventListener: EventTarget["addEventListener"];
  removeEventListener: EventTarget["removeEventListener"];
};

export const createCleanupBag = () => {
  const cleanups: Cleanup[] = [];

  return {
    add(cleanup: Cleanup | undefined | null) {
      if (cleanup) cleanups.push(cleanup);
    },
    run() {
      while (cleanups.length > 0) {
        cleanups.pop()?.();
      }
    },
  };
};

export const on = <T extends Event>(
  target: EventTargetLike,
  type: string,
  listener: (event: T) => void,
  options?: boolean | AddEventListenerOptions,
): Cleanup => {
  target.addEventListener(type, listener as EventListener, options);

  return () => {
    target.removeEventListener(type, listener as EventListener, options);
  };
};

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const observeElementResize = (
  element: Element,
  callback: ResizeObserverCallback | (() => void),
): Cleanup => {
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(callback as ResizeObserverCallback);
    observer.observe(element);
    return () => observer.disconnect();
  }

  const onResize = () => {
    (callback as () => void)();
  };

  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
};
