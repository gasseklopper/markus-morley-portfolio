import { useSignal, useVisibleTask$, type Signal } from "@builder.io/qwik";

import type { Notification } from "./notifications-panel";

const NOTIFICATIONS_STORAGE_KEY = "notifications-state";
const NOTIFICATIONS_EVENT = "notifications:update";

type NotificationState = Pick<Notification, "unread"> | undefined;

const countUnread = (notifications: ReadonlyArray<NotificationState>) =>
  notifications.reduce(
    (total, item) => (item?.unread ? total + 1 : total),
    0,
  );

export const useNotificationBadge = (
  defaultNotifications: ReadonlyArray<Notification>,
): Signal<number> => {
  const unreadCount = useSignal(
    defaultNotifications.filter((item) => item.unread).length,
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const readFromStorage = () => {
      try {
        const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        if (!stored) {
          unreadCount.value = defaultNotifications.filter(
            (item) => item.unread,
          ).length;
          return;
        }

        const parsed = JSON.parse(stored) as NotificationState[];
        if (Array.isArray(parsed)) {
          unreadCount.value = countUnread(parsed);
        }
      } catch (error) {
        console.error(error);
        unreadCount.value = defaultNotifications.filter(
          (item) => item.unread,
        ).length;
      }
    };

    const handleUpdate = (event: Event) => {
      const customEvent =
        event as CustomEvent<NotificationState[] | undefined>;
      const items = customEvent.detail;

      if (Array.isArray(items)) {
        unreadCount.value = countUnread(items);
        return;
      }

      readFromStorage();
    };

    readFromStorage();
    window.addEventListener(NOTIFICATIONS_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(NOTIFICATIONS_EVENT, handleUpdate);
    };
  });

  return unreadCount;
};

