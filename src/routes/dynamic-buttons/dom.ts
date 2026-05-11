export type DynamicButtonZone = {
  zone: HTMLElement;
  button: HTMLElement;
  label: HTMLElement;
};

export const queryDynamicButtonDom = (root: HTMLElement): DynamicButtonZone[] =>
  Array.from(root.querySelectorAll<HTMLElement>(".dynamic-buttons__mag-zone"))
    .map((zone) => {
      const button = zone.querySelector<HTMLElement>(
        ".dynamic-buttons__mag-btn",
      );
      const label = zone.querySelector<HTMLElement>(".dynamic-buttons__label");

      if (!button || !label) return undefined;

      return { zone, button, label };
    })
    .filter((zone): zone is DynamicButtonZone => Boolean(zone));
