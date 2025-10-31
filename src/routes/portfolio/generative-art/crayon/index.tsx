import { component$, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
import type p5Type from "p5";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const styles = `
  .crayon-page {
    display: grid;
    gap: clamp(2rem, 5vw, 3rem);
    padding: clamp(4rem, 12vw, 6rem) clamp(1.5rem, 6vw, 3rem);
    min-height: 100vh;
    color: var(--text1, #f8fafc);
    background: radial-gradient(circle at top left, color-mix(in srgb, var(--surface2, #1f2937) 75%, transparent) 0%, var(--surface1, #0f172a) 60%, color-mix(in srgb, var(--surface3, #334155) 70%, transparent) 100%);
  }

  .crayon-layout {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    align-content: start;
    justify-items: center;
  }

  @media (min-width: 960px) {
    .crayon-layout {
      grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
      align-items: center;
      justify-items: stretch;
    }
  }

  .crayon-copy {
    display: grid;
    gap: clamp(1.5rem, 3vw, 2.25rem);
    padding: clamp(1.5rem, 4vw, 2.5rem);
    border-radius: clamp(1.75rem, 4vw, 2.75rem);
    border: 1px solid color-mix(in srgb, var(--surface-border, #1e293b) 65%, transparent);
    background: color-mix(in srgb, var(--surface-glass-1, rgba(15, 23, 42, 0.85)) 90%, transparent);
    box-shadow: 0 28px 120px rgba(15, 23, 42, 0.45);
    text-align: left;
  }

  .crayon-copy h1 {
    font-size: clamp(2rem, 1.5rem + 1vw, 2.75rem);
    line-height: 1.1;
    color: var(--text1, #f8fafc);
  }

  .crayon-copy p {
    font-size: clamp(1rem, 0.95rem + 0.35vw, 1.15rem);
    line-height: 1.7;
    color: var(--text2, #e2e8f0);
  }

  .interaction-hints {
    display: grid;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: var(--text3, #94a3b8);
  }

  .interaction-hints strong {
    color: var(--text1, #f8fafc);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  .canvas-shell {
    position: relative;
    min-height: clamp(360px, 60vh, 720px);
    width: 100%;
    border-radius: clamp(1.75rem, 4vw, 2.75rem);
    border: 1px solid color-mix(in srgb, var(--surface-border, #1e293b) 65%, transparent);
    overflow: hidden;
    box-shadow: 0 32px 140px rgba(15, 23, 42, 0.55);
    background: color-mix(in srgb, var(--surface-glass-2, rgba(15, 23, 42, 0.7)) 92%, transparent);
    backdrop-filter: blur(16px);
  }

  #canvas-container {
    position: absolute;
    inset: 0;
  }

  .canvas-fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    text-align: center;
    font-size: 0.95rem;
    color: color-mix(in srgb, var(--text2, #e2e8f0) 85%, transparent);
  }
`;

type BrushModule = {
  instance: (p: p5Type) => void;
  noField: () => void;
  set: (name: string) => void;
  scaleBrushes: (scale: number) => void;
  stroke: (color: string) => void;
  strokeWeight: (weight: number) => void;
  noFill: () => void;
  setHatch: (name: string, color: string, weight: number) => void;
  hatch: (spacing: number, angle: number, options?: { rand?: number; continuous?: boolean; gradient?: number }) => void;
  polygon: (points: number[][]) => void;
  spline: (points: number[][], tension?: number) => void;
  circle: (x: number, y: number, diameter: number) => void;
};

type TrailPoint = { x: number; y: number };

type PolygonPoint = {
  x: { c: number; t: number; rest: number; hover: number };
  y: { c: number; t: number; rest: number; hover: number };
};

class CanvasManager {
  private width = window.innerWidth;
  private height = window.innerHeight;
  private trails: TrailPoint[][] = [];
  private activeTrail: TrailPoint[] | null = null;
  private mouse = {
    x: { c: -100, t: -100 },
    y: { c: -100, t: -100 },
    delta: { c: 0, t: 0 },
  };
  private polygonHover = { c: 0, t: 0 };
  private readonly maxTrailLength = 500;
  private t = 0;
  private polygon: PolygonPoint[] = [];
  private app?: p5Type;
  private animationFrame?: number;
  private mouseupTO?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly P5Ctor: typeof p5Type,
    private readonly brush: BrushModule,
    private readonly el: HTMLElement,
  ) {
    this.render = this.render.bind(this);
    this.sketch = this.sketch.bind(this);

    window.addEventListener("resize", this.resize);
    document.addEventListener("mousedown", this.mousedown);
    document.addEventListener("mousemove", this.mousemove);
    document.addEventListener("mouseup", this.mouseup);

    this.resize();
    this.initCanvas();
  }

  private resize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.updateViewportUnits();
    this.polygon = this.initPolygon();
    if (this.app) {
      this.app.resizeCanvas(this.width, this.height, true);
    }
  };

  private updateViewportUnits() {
    const root = document.documentElement;
    root.style.setProperty("--rvw", `${root.clientWidth / 100}px`);
  }

  private initCanvas() {
    this.app = new this.P5Ctor(this.sketch, this.el);
    this.animationFrame = requestAnimationFrame(this.render);
  }

  private initBrush(p: p5Type) {
    this.brush.instance(p);
    p.setup = () => {
      p.createCanvas(this.width, this.height, p.WEBGL);
      p.angleMode(p.DEGREES);
      this.brush.noField();
      this.brush.set("2B");
      this.brush.scaleBrushes(window.innerWidth <= 1024 ? 2.5 : 0.9);
    };
  }

  private sketch(p: p5Type) {
    this.initBrush(p);
    p.draw = () => {
      p.frameRate(30);
      p.translate(-this.width / 2, -this.height / 2);
      p.background("#FC0E49");

      this.brush.stroke("#7A200C");
      this.brush.strokeWeight(1);
      this.brush.noFill();
      this.brush.setHatch("HB", "#7A200C", 1);
      this.brush.hatch(15, 45);
      const time = this.t * 0.01;
      this.brush.polygon(
        this.polygon.map((point, index) => [
          point.x.c + Math.sin(time * (80 + index * 2)) * (30 + index * 5),
          point.y.c + Math.cos(time * (80 + index * 2)) * (20 + index * 5),
        ]),
      );

      this.brush.strokeWeight(1 + 0.005 * this.mouse.delta.c);
      this.trails.forEach((trail) => {
        if (trail.length > 0) {
          this.brush.spline(
            trail.map((point) => [point.x, point.y]),
            1,
          );
        }
      });

      this.brush.noFill();
      this.brush.stroke("#FF7EBE");
      this.brush.setHatch("HB", "#FFAABF", 1);
      this.brush.hatch(5, 30, { rand: 0.1, continuous: true, gradient: 0.3 });
      const r =
        5 +
        0.05 * this.mouse.delta.c +
        this.polygonHover.c * (100 + this.mouse.delta.c * 0.5);
      this.brush.circle(this.mouse.x.c, this.mouse.y.c, r);
    };
  }

  private initPolygon(): PolygonPoint[] {
    const gridSize = { x: 1440, y: 930 };
    const basePolygon: PolygonPoint[] = [
      { x: { c: 0, t: 0, rest: 494, hover: 550 }, y: { c: 0, t: 0, rest: 207, hover: 310 } },
      { x: { c: 0, t: 0, rest: 1019, hover: 860 }, y: { c: 0, t: 0, rest: 137, hover: 290 } },
      { x: { c: 0, t: 0, rest: 1035, hover: 820 }, y: { c: 0, t: 0, rest: 504, hover: 520 } },
      { x: { c: 0, t: 0, rest: 377, hover: 620 }, y: { c: 0, t: 0, rest: 531, hover: 560 } },
    ];

    basePolygon.forEach((point) => {
      point.x.rest = (point.x.rest / gridSize.x) * this.width;
      point.y.rest = (point.y.rest / gridSize.y) * this.height;
      point.x.hover = (point.x.hover / gridSize.x) * this.width;
      point.y.hover = (point.y.hover / gridSize.y) * this.height;
      point.x.t = point.x.c = point.x.rest;
      point.y.t = point.y.c = point.y.rest;
    });

    return basePolygon;
  }

  private render(time: number) {
    this.t = time * 0.001;
    this.mouse.x.c += (this.mouse.x.t - this.mouse.x.c) * 0.08;
    this.mouse.y.c += (this.mouse.y.t - this.mouse.y.c) * 0.08;
    this.mouse.delta.t = Math.hypot(
      this.mouse.x.t - this.mouse.x.c,
      this.mouse.y.t - this.mouse.y.c,
    );
    this.mouse.delta.c += (this.mouse.delta.t - this.mouse.delta.c) * 0.08;
    this.polygonHover.c += (this.polygonHover.t - this.polygonHover.c) * 0.08;

    if (this.activeTrail) {
      this.activeTrail.push({ x: this.mouse.x.c, y: this.mouse.y.c });
      if (this.activeTrail.length > this.maxTrailLength) this.activeTrail.shift();
    }

    this.trails.forEach((trail) => {
      if (this.activeTrail === trail) return;
      trail.shift();
    });

    this.trails = this.trails.filter((trail) => trail && trail.length > 0);

    this.polygon.forEach((point, index) => {
      const easing = Math.max(0.02, 0.07 - index * 0.01);
      point.x.c += (point.x.t - point.x.c) * easing;
      point.y.c += (point.y.t - point.y.c) * easing;
    });

    this.animationFrame = requestAnimationFrame(this.render);
  }

  private mousedown = () => {
    if (this.mouseupTO) clearTimeout(this.mouseupTO);
    const newTrail: TrailPoint[] = [];
    this.trails.push(newTrail);
    this.activeTrail = newTrail;
  };

  private mouseup = () => {
    if (this.mouseupTO) clearTimeout(this.mouseupTO);
    this.mouseupTO = setTimeout(() => {
      this.activeTrail = null;
    }, 300);
  };

  private mousemove = (event: MouseEvent) => {
    const polygonPoints = this.polygon.map((point) => [point.x.c, point.y.c]);
    const isHover = this.inPolygon(event.clientX, event.clientY, polygonPoints);
    this.polygon.forEach((point) => {
      if (isHover) {
        point.x.t = point.x.hover;
        point.y.t = point.y.hover;
      } else {
        point.x.t = point.x.rest;
        point.y.t = point.y.rest;
      }
    });
    this.polygonHover.t = isHover ? 1 : 0;
    this.mouse.x.t = event.clientX;
    this.mouse.y.t = event.clientY;
  };

  private inPolygon(x: number, y: number, polygon: number[][]) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("mousedown", this.mousedown);
    document.removeEventListener("mousemove", this.mousemove);
    document.removeEventListener("mouseup", this.mouseup);
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.app) {
      this.app.remove();
      this.app = undefined;
    }
  }
}

export default component$(() => {
  useStylesScoped$(styles);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const [{ default: P5 }, brushModule] = await Promise.all([
      import("p5"),
      import("p5.brush"),
    ]);

    const brush = (
      (brushModule as { default?: BrushModule }).default ?? brushModule
    ) as BrushModule;

    const container = document.getElementById("canvas-container");
    if (!container) return;

    const manager = new CanvasManager(P5, brush, container);

    cleanup(() => {
      manager.destroy();
    });
  });

  return (
    <section class="crayon-page">
      <div class="crayon-layout">
        <article class="crayon-copy">
          <h1>Crayon — the Qwik.js way</h1>
          <p>
            Painterly p5.js brushes blend with Qwik's streaming hydration. Follow the cursor to animate a floating polygon,
            press and drag to create reactive trails, and watch the highlight ring respond to your motion.
          </p>
          <div class="interaction-hints">
            <strong>Try this</strong>
            <span>Click and drag to sketch flowing splines.</span>
            <span>Move over the central shape to morph its geometry.</span>
            <span>Release the mouse to let trails fade organically.</span>
          </div>
        </article>
        <div class="canvas-shell">
          <div id="canvas-container" aria-live="polite">
            <div class="canvas-fallback">
              Interactive canvas loading… Enable JavaScript to explore the brush playground.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export const head = buildHead(
  `Crayon — the Qwik.js way - ${siteConfig.metadata.title}`,
  "Interactive WebGL sketch that pairs p5.brush trails with responsive pointer physics.",
);
