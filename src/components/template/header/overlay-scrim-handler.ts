export type HeaderOverlayToggleId =
  | "notifications"
  | "preferences"
  | "account";

const NOTIFICATIONS_TOGGLE_SELECTOR = "[data-notifications-toggle]";
const PREFERENCES_TOGGLE_SELECTOR = "[data-preferences-toggle]";
const ACCOUNT_TOGGLE_SELECTOR = "[data-account-toggle]";

export const HEADER_TOGGLE_SELECTOR = [
  NOTIFICATIONS_TOGGLE_SELECTOR,
  PREFERENCES_TOGGLE_SELECTOR,
  ACCOUNT_TOGGLE_SELECTOR,
].join(",");

const resolveHeaderToggleElement = (
  element: Element | null,
): HTMLElement | null =>
  (element?.closest(HEADER_TOGGLE_SELECTOR) as HTMLElement | null) ?? null;

const getToggleIdFromElement = (
  element: HTMLElement | null,
): HeaderOverlayToggleId | null => {
  if (!element) {
    return null;
  }

  if (element.matches(NOTIFICATIONS_TOGGLE_SELECTOR)) {
    return "notifications";
  }

  if (element.matches(PREFERENCES_TOGGLE_SELECTOR)) {
    return "preferences";
  }

  if (element.matches(ACCOUNT_TOGGLE_SELECTOR)) {
    return "account";
  }

  return null;
};

const findToggleBelowPointer = (event: PointerEvent): HTMLElement | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const scrim = event.currentTarget as HTMLElement | null;
  const container = scrim?.parentElement ?? null;
  const restorePointerEvents: Array<() => void> = [];

  const disablePointerEvents = (element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    const previous = element.style.pointerEvents;
    element.style.pointerEvents = "none";
    restorePointerEvents.push(() => {
      element.style.pointerEvents = previous;
    });
  };

  disablePointerEvents(scrim);
  disablePointerEvents(container);

  const elementBelow = document.elementFromPoint(
    event.clientX,
    event.clientY,
  );

  restorePointerEvents.forEach((restore) => restore());

  return resolveHeaderToggleElement(elementBelow);
};

export const handleOverlayScrimPointerDown = (
  event: PointerEvent,
  startClose: () => void,
) => {
  const directToggle = resolveHeaderToggleElement(
    event.target as Element | null,
  );
  const toggleElement = directToggle ?? findToggleBelowPointer(event);
  const toggleId = getToggleIdFromElement(toggleElement);

  if (toggleId && toggleElement) {
    event.stopPropagation();
    event.preventDefault();

    Promise.resolve().then(() => {
      if (typeof toggleElement.focus === "function") {
        try {
          toggleElement.focus({ preventScroll: true });
        } catch {
          toggleElement.focus();
        }
      }

      toggleElement.click();
    });

    return;
  }

  event.stopPropagation();
  event.preventDefault();
  startClose();
};

export default handleOverlayScrimPointerDown;
