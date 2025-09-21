const HEADER_TOGGLE_SELECTOR =
  "[data-notifications-toggle],[data-preferences-toggle],[data-account-toggle]";

export type OverlayScrimPointerEvent = PointerEvent & {
  __overlayToggleForwarded?: true;
};

export const isOverlayToggleForwarded = (
  event: PointerEvent,
): event is OverlayScrimPointerEvent =>
  Boolean((event as OverlayScrimPointerEvent).__overlayToggleForwarded);

export const handleOverlayScrimPointerDown = (
  event: PointerEvent,
  startClose: () => void,
) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest(HEADER_TOGGLE_SELECTOR)) {
    return;
  }

  let toggleBelow: HTMLElement | null = null;

  if (typeof document !== "undefined") {
    const scrim = event.currentTarget as HTMLElement | null;
    const container = scrim?.parentElement;

    if (scrim && container) {
      const previousScrimPointerEvents = scrim.style.pointerEvents;
      const previousContainerPointerEvents = container.style.pointerEvents;

      scrim.style.pointerEvents = "none";
      container.style.pointerEvents = "none";

      const elementBelow = document.elementFromPoint(
        event.clientX,
        event.clientY,
      );

      scrim.style.pointerEvents = previousScrimPointerEvents;
      container.style.pointerEvents = previousContainerPointerEvents;

      toggleBelow = elementBelow?.closest(HEADER_TOGGLE_SELECTOR) as
        | HTMLElement
        | null;
    }
  }

  if (toggleBelow) {
    (event as OverlayScrimPointerEvent).__overlayToggleForwarded = true;
    event.stopPropagation();

    const eventInit: PointerEventInit & MouseEventInit = {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: event.clientX,
      clientY: event.clientY,
      button: event.button,
      buttons: event.buttons,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      pointerType: event.pointerType,
      pointerId: event.pointerId,
      width: event.width,
      height: event.height,
      pressure: event.pressure,
      tangentialPressure: event.tangentialPressure,
      tiltX: event.tiltX,
      tiltY: event.tiltY,
      twist: event.twist,
      isPrimary: event.isPrimary,
      screenX: event.screenX,
      screenY: event.screenY,
      movementX: event.movementX,
      movementY: event.movementY,
    };

    setTimeout(() => {
      toggleBelow?.dispatchEvent(new PointerEvent("pointerdown", eventInit));
      toggleBelow?.dispatchEvent(new PointerEvent("pointerup", eventInit));
      toggleBelow?.dispatchEvent(new MouseEvent("click", eventInit));
    });

    return;
  }

  event.stopPropagation();
  event.preventDefault();
  startClose();
};

export default handleOverlayScrimPointerDown;
