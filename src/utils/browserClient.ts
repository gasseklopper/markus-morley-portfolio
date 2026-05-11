export type Cleanup = () => void;
export type CleanupBag = ReturnType<typeof createCleanupBag>;

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

export const onMany = <T extends Event>(
  targets: Iterable<EventTargetLike>,
  type: string,
  listener: (event: T) => void,
  options?: boolean | AddEventListenerOptions,
): Cleanup => {
  const cleanupBag = createCleanupBag();

  for (const target of targets) {
    cleanupBag.add(on(target, type, listener, options));
  }

  return cleanupBag.run;
};

export const timeout = (
  callback: () => void,
  delay: number,
  cleanupBag?: CleanupBag,
): Cleanup => {
  const id = window.setTimeout(callback, delay);
  const cleanup = () => window.clearTimeout(id);
  cleanupBag?.add(cleanup);
  return cleanup;
};

export const interval = (
  callback: () => void,
  delay: number,
  cleanupBag?: CleanupBag,
): Cleanup => {
  const id = window.setInterval(callback, delay);
  const cleanup = () => window.clearInterval(id);
  cleanupBag?.add(cleanup);
  return cleanup;
};

export const animationFrame = (
  callback: FrameRequestCallback,
  cleanupBag?: CleanupBag,
): Cleanup => {
  const id = window.requestAnimationFrame(callback);
  const cleanup = () => window.cancelAnimationFrame(id);
  cleanupBag?.add(cleanup);
  return cleanup;
};

export const animationFrameLoop = (
  callback: FrameRequestCallback,
  cleanupBag?: CleanupBag,
): Cleanup => {
  let frameId = 0;
  let disposed = false;

  const tick: FrameRequestCallback = (time) => {
    if (disposed) return;
    callback(time);
    frameId = window.requestAnimationFrame(tick);
  };

  frameId = window.requestAnimationFrame(tick);

  const cleanup = () => {
    disposed = true;
    window.cancelAnimationFrame(frameId);
  };

  cleanupBag?.add(cleanup);
  return cleanup;
};

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const observeElementResize = (
  element: Element,
  callback: ResizeObserverCallback | (() => void),
  cleanupBag?: CleanupBag,
): Cleanup => {
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(callback as ResizeObserverCallback);
    observer.observe(element);
    const cleanup = () => observer.disconnect();
    cleanupBag?.add(cleanup);
    return cleanup;
  }

  const onResize = () => {
    (callback as () => void)();
  };

  window.addEventListener("resize", onResize);
  const cleanup = () => window.removeEventListener("resize", onResize);
  cleanupBag?.add(cleanup);
  return cleanup;
};

export const createMountedClientEffect = async (
  registerCleanup: (cleanup: Cleanup) => void,
  setup: () => Cleanup | Promise<Cleanup | undefined> | undefined,
) => {
  const lifecycle = {
    disposed: false,
    dispose: undefined as Cleanup | undefined,
  };

  registerCleanup(() => {
    lifecycle.disposed = true;
    lifecycle.dispose?.();
  });

  lifecycle.dispose = (await setup()) ?? undefined;
  if (lifecycle.disposed) lifecycle.dispose?.();
};
