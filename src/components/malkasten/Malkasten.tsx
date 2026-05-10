import {
  $,
  component$,
  noSerialize,
  type NoSerialize,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import ImgImageMalkasten from "~/media/assets/images/image_malkasten.png?jsx";
import styles from "./malkasten.scss?inline";

export const Malkasten = component$(() => {
  useStyles$(styles);

  const canvasRef = useSignal<HTMLCanvasElement>();
  const drawing = useSignal(false);
  const ctx = useSignal<NoSerialize<CanvasRenderingContext2D> | null>(null);
  const lastPos = useSignal<{ x: number; y: number } | null>(null);
  const lastTime = useSignal(0);
  const drips = useSignal<
    {
      x: number;
      y: number;
      length: number;
      maxLength: number;
      startTime: number;
      duration: number;
    }[]
  >([]);
  const dripInterval = useSignal<number | null>(null);
  const color = useSignal("#000");

  const reset = $(() => {
    const canvas = canvasRef.value;
    const context = ctx.value;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  // Setup canvas and event listeners when component is visible
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    ctx.value = noSerialize(context);
    color.value = getComputedStyle(document.documentElement)
      .getPropertyValue("--brand")
      .trim();
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    if (dripInterval.value === null) {
      dripInterval.value = window.setInterval(() => {
        const context = ctx.value;
        if (!context) return;
        const now = Date.now();
        drips.value = drips.value.filter((drip) => {
          if (now - drip.startTime > drip.duration || drip.length >= drip.maxLength) {
            return false;
          }
          const growth = Math.min(
            drip.maxLength - drip.length,
            Math.random() * (drip.maxLength / (drip.duration / 500)),
          );
          context.strokeStyle = color.value;
          context.lineWidth = 5;
          context.lineCap = "round";
          context.beginPath();
          context.moveTo(drip.x, drip.y + drip.length);
          context.lineTo(drip.x, drip.y + drip.length + growth);
          context.stroke();
          drip.length += growth;
          return true;
        });
      }, 500);
    }

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        const touch = e.touches[0] ?? e.changedTouches[0];
        return {
          x: (touch?.clientX ?? rect.left) - rect.left,
          y: (touch?.clientY ?? rect.top) - rect.top,
        };
      }

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const addDrip = (
      x: number,
      y: number,
      maxLength: number,
      duration: number,
    ) => {
      drips.value = [
        ...drips.value,
        { x, y, length: 0, maxLength, startTime: Date.now(), duration },
      ];
    };

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing.value = true;
      const { x, y } = getPos(e);
      lastPos.value = { x, y };
      lastTime.value = Date.now();
      context.beginPath();
      context.moveTo(x, y);
      addDrip(x, y, 150, 3000);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!drawing.value) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      const now = Date.now();
      const last = lastPos.value;
      const prev = lastTime.value;
      let speed = 0;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const dt = now - prev;
        speed = dt > 0 ? dist / dt : 0;
      }
      lastPos.value = { x, y };
      lastTime.value = now;

      context.strokeStyle = color.value;
      context.lineWidth = 5;
      context.lineCap = "round";
      context.lineTo(x, y);
      context.stroke();

      context.beginPath();
      context.moveTo(x, y);

      const fast = speed > 0.5;
      const maxLength = fast ? 30 : 150;
      const duration = fast ? 1000 : 3000;
      if (Math.random() < 0.3) {
        addDrip(x, y, maxLength, duration);
      }
    };

    const end = () => {
      drawing.value = false;
      context.beginPath();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("touchmove", draw);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchend", end);
      if (dripInterval.value !== null) {
        clearInterval(dripInterval.value);
        dripInterval.value = null;
      }
    };
  });

  return (
    <div class="malkasten">
      <ImgImageMalkasten
        alt="Portrait"
        class="malkasten__image"
      />
      <canvas
        ref={canvasRef}
        class="malkasten__canvas"
      />
      <div class="malkasten__palette" aria-label="Paint colors">
        <button
          type="button"
          onClick$={() => (color.value = "#000")}
          class="malkasten__swatch malkasten__swatch--black"
          aria-label="Use black paint"
        />
        <button
          type="button"
          onClick$={() => (color.value = "#fff")}
          class="malkasten__swatch malkasten__swatch--white"
          aria-label="Use white paint"
        />
        <button
          type="button"
          onClick$={() =>
            (color.value = getComputedStyle(
              document.documentElement,
            )
              .getPropertyValue("--brand")
              .trim())
          }
          class="malkasten__swatch malkasten__swatch--brand"
          aria-label="Use brand paint"
        />
      </div>
      <button
        type="button"
        onClick$={reset}
        class="malkasten__reset"
      >
        Reset
      </button>
    </div>
  );
});

export default Malkasten;
