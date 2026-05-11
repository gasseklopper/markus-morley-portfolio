export const queryGenerativeArtDom = (root: HTMLElement) => ({
  canvas: root.querySelector<HTMLCanvasElement>("canvas"),
});

export const createDownloadButton = (
  canvas: HTMLCanvasElement,
  fileName: string,
) => {
  const button = document.createElement("button");
  button.style.top = "110px";
  button.style.position = "fixed";
  button.style.left = "110px";
  button.style.zIndex = "100";
  button.style.width = "150px";
  button.style.height = "150px";
  button.style.borderRadius = "50%";
  button.style.backgroundColor = "transparent";
  button.style.border = "5px solid #fff";
  button.style.cursor = "pointer";
  button.style.color = "white";
  button.style.fontSize = "30px";
  button.style.fontFamily = "Arial";
  button.style.fontWeight = "bold";
  button.innerText = "download";
  button.onclick = () => {
    const data = canvas.toDataURL();
    const link = document.createElement("a");
    link.download = fileName;
    link.href = data;
    link.click();
  };

  return button;
};
