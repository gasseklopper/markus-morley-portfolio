import { generativeArtConfig } from "./generative-art.config";
import {
  createDownloadButton,
  queryGenerativeArtDom,
} from "./generative-art.dom";
import {
  advanceBubble,
  createBubble,
  randomColor,
  shouldRecycleBubble,
  type Bubble,
} from "./generative-art.model";

const drawBubble = (context: CanvasRenderingContext2D, bubble: Bubble) => {
  context.beginPath();
  context.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2, false);
  context.fillStyle = bubble.color;
  context.fill();
  context.closePath();

  context.beginPath();
  context.arc(
    bubble.x - bubble.r / 3,
    bubble.y - bubble.r / 3,
    bubble.r / 3,
    0,
    Math.PI * 2,
    false,
  );
  context.fillStyle = bubble.highlight;
  context.fill();
  context.closePath();
};

export const setupGenerativeArt = (root: HTMLElement) => {
  const { canvas } = queryGenerativeArtDom(root);
  if (!canvas) return undefined;

  const context = canvas.getContext("2d");
  if (!context) return undefined;

  canvas.width = window.innerWidth;
  canvas.height =
    window.innerHeight * generativeArtConfig.viewportHeightMultiplier;

  const width = canvas.width;
  const height = canvas.height;
  const bubbles: Bubble[] = [];
  let animationFrameId = 0;

  const button = createDownloadButton(
    canvas,
    generativeArtConfig.downloadFileName,
  );
  canvas.parentElement?.appendChild(button);

  const draw = () => {
    context.fillStyle = randomColor();

    for (let index = 0; index < bubbles.length; index++) {
      const current = bubbles[index];
      advanceBubble(current);
      drawBubble(context, current);

      if (shouldRecycleBubble(current, width, height)) {
        bubbles.splice(index, 1);
        if (bubbles.length < generativeArtConfig.minimumBubbleCount) {
          bubbles.splice(index, 0, createBubble(width, height));
        }
      }
    }
    animationFrameId = requestAnimationFrame(draw);
  };

  while (bubbles.length < generativeArtConfig.initialBubbleCount) {
    bubbles.push(createBubble(width, height));
  }
  draw();

  return () => {
    cancelAnimationFrame(animationFrameId);
    button.remove();
  };
};
