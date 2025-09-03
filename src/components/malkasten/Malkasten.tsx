import {
  $,
  component$,
  noSerialize,
  type NoSerialize,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

export const Malkasten = component$(() => {
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
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

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
      const clientX =
        ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
      const clientY =
        ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x: clientX, y: clientY };
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
    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchmove", draw);
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);

    return () => {
      window.removeEventListener("resize", resize);
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
    <div class="relative h-96 w-full sm:h-[600px]">
      <img
        src="/assets/images/image_malkasten.png"
        alt="Portrait"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        class="absolute inset-0 h-full w-full cursor-crosshair"
      />
      <div class="absolute top-4 left-4 flex gap-2">
        <button
          type="button"
          onClick$={() => (color.value = "#000")}
          class="h-6 w-6 rounded-full border border-black bg-black"
        />
        <button
          type="button"
          onClick$={() => (color.value = "#fff")}
          class="h-6 w-6 rounded-full border border-black bg-white"
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
          class="h-6 w-6 rounded-full border border-black"
          style="background: var(--brand)"
        />
      </div>
      <button
        type="button"
        onClick$={reset}
        class="absolute top-4 right-4 rounded bg-white/80 px-3 py-1 text-sm"
      >
        Reset
      </button>
    </div>
  );
});

export default Malkasten;
