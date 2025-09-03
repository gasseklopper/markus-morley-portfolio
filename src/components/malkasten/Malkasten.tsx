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
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX =
        ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
      const clientY =
        ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x: clientX, y: clientY };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      drawing.value = true;
      const { x, y } = getPos(e);
      context.beginPath();
      context.moveTo(x, y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!drawing.value) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      context.strokeStyle = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--brand");
      context.lineWidth = 5;
      context.lineCap = "round";
      context.lineTo(x, y);
      context.stroke();

      // prepare a new path for continuous drawing
      context.beginPath();
      context.moveTo(x, y);

      // occasionally draw a drip downwards
      if (Math.random() < 0.3) {
        const length = 10 + Math.random() * 20;
        context.lineTo(x, y + length);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
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
