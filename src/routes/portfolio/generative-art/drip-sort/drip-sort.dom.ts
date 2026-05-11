import { dripSortConfig } from "./drip-sort.config";

export const queryDripSortDom = (root: HTMLElement) => ({
  canvas: root.querySelector<HTMLCanvasElement>(`#${dripSortConfig.canvasId}`),
});

export const createDripSortDownloadButton = (canvas: HTMLCanvasElement) => {
  const button = document.createElement("button");
  button.style.top = "110px";
  button.style.position = "fixed";
  button.style.left = "110px";
  button.style.zIndex = "100";
  button.style.width = "150px";
  button.style.height = "150px";
  button.style.borderRadius = "50%";
  button.style.backgroundColor = "transparent";
  button.style.border = "5px solid #000";
  button.style.cursor = "pointer";
  button.style.color = "black";
  button.style.fontSize = "30px";
  button.style.fontFamily = "Arial";
  button.style.fontWeight = "bold";
  button.innerText = dripSortConfig.buttonLabel;
  button.onclick = () => {
    const link = document.createElement("a");
    link.download = dripSortConfig.downloadFileName;
    link.href = canvas.toDataURL();
    link.click();
  };

  return button;
};
