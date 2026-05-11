import { dripSortConfig } from "./drip-sort.config";
import {
  createDripSortDownloadButton,
  queryDripSortDom,
} from "./drip-sort.dom";
import {
  advanceDrip,
  createDrip,
  shouldRecycleDrip,
  type Drip,
} from "./drip-sort.model";

export const setupDripSort = (root: HTMLElement) => {
  const { canvas } = queryDripSortDom(root);
  if (!canvas) return undefined;

  const context = canvas.getContext("2d");
  if (!context) return undefined;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * dripSortConfig.viewportHeightMultiplier;

  const width = canvas.width;
  const height = canvas.height;
  const drips: Drip[] = [];
  let animationFrameId = 0;

  const button = createDripSortDownloadButton(canvas);
  canvas.parentElement?.appendChild(button);

  while (drips.length < dripSortConfig.dripCount) {
    drips.push(createDrip(width, height));
  }

  const draw = () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    drips.sort((a, b) => a.shade - b.shade);
    for (let index = 0; index < drips.length; index++) {
      const drip = drips[index];
      advanceDrip(drip, index, drips.length, width);
      context.fillStyle = `rgb(${drip.shade},${drip.shade},${drip.shade})`;
      context.fillRect(drip.x, drip.y, drip.width, drip.height);

      if (shouldRecycleDrip(drip, height)) {
        drips[index] = createDrip(width, height);
        drips[index].y = -drips[index].height;
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  draw();

  return () => {
    cancelAnimationFrame(animationFrameId);
    button.remove();
  };
};
