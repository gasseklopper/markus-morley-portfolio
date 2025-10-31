declare module "p5.brush" {
  import type p5 from "p5";

  type HatchOptions = {
    rand?: number;
    continuous?: boolean;
    gradient?: number;
  };

  const brush: {
    instance: (p: p5) => void;
    noField: () => void;
    set: (name: string) => void;
    scaleBrushes: (scale: number) => void;
    stroke: (color: string) => void;
    strokeWeight: (weight: number) => void;
    noFill: () => void;
    setHatch: (name: string, color: string, weight: number) => void;
    hatch: (spacing: number, angle: number, options?: HatchOptions) => void;
    polygon: (points: number[][]) => void;
    spline: (points: number[][], tension?: number) => void;
    circle: (x: number, y: number, diameter: number) => void;
  };

  export = brush;
}
