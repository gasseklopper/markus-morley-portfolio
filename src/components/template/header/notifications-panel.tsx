import { component$, $, useSignal, useVisibleTask$, type PropFunction } from "@builder.io/qwik";
import OverlayPanel from "./overlay-panel";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread?: boolean;
};

export const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "New project feedback",
    message: "Jordan left comments on your Dribble shot.",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Design sync",
    message: "Reminder: Design systems sync starts in 30 minutes.",
    timestamp: "1h ago",
  },
  {
    id: "3",
    title: "Portfolio views",
    message: "Your portfolio reached 1.2k visits this week. Keep it up!",
    timestamp: "Yesterday",
  },
];

export const NotificationsPanel = component$<{ onClose$: PropFunction<() => void> }>(
  ({ onClose$ }) => {
    const items = useSignal<Notification[]>(defaultNotifications);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      const stored = window.localStorage.getItem("notifications-state");
      if (stored) {
        try {
          const parsed: Notification[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            items.value = parsed;
          }
        } catch (error) {
          console.error(error);
        }
      }

      window.dispatchEvent(
        new CustomEvent<Notification[]>("notifications:update", {
          detail: items.value,
        }),
      );
    });

    const markAllAsRead$ = $(() => {
      const updated = items.value.map((item) => ({
        ...item,
        unread: false,
      }));
      items.value = updated;
      window.localStorage.setItem("notifications-state", JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent<Notification[]>("notifications:update", {
          detail: updated,
        }),
      );
    });

    const toggleUnread$ = $((id: string) => {
      const updated = items.value.map((item) =>
        item.id === id
          ? {
              ...item,
              unread: !item.unread,
            }
          : item,
      );
      items.value = updated;
      window.localStorage.setItem("notifications-state", JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent<Notification[]>("notifications:update", {
          detail: updated,
        }),
      );
    });

    return (
      <OverlayPanel
        eyebrow="Stay updated"
        title="Notifications"
        description="Catch up on the latest activity across your projects."
        onClose$={onClose$}
        triggerSelector="[data-notifications-toggle]"
        closeLabel="Close notifications"
      >
        <div class="flex items-center justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-4 py-3 text-sm text-[var(--text2)] shadow-[0_12px_36px_var(--surface-shadow)]">
          <span class="font-medium">{items.value.filter((item) => item.unread).length} unread</span>
          <button
            type="button"
            onClick$={markAllAsRead$}
            class="rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-[var(--primary)] transition-colors duration-200 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-2)]"
          >
            Mark all as read
          </button>
        </div>
        <ul class="flex flex-col gap-3">
          {items.value.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                onClick$={() => toggleUnread$(notification.id)}
                class={[
                  "flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300",
                  notification.unread
                    ? "border-[var(--primary)] bg-[var(--surface-glass-2)] text-[var(--text1)]"
                    : "border-[var(--surface-border)] bg-[var(--surface-glass-1)] text-[var(--text2)] hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-2)] hover:text-[var(--text1)]",
                ]}
              >
                <div class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] text-[var(--primary)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width={1.5}
                    class="size-5"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M20 7.5l-8 9-4-4.5"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-sm font-semibold text-[var(--text1)]">
                      {notification.title}
                    </p>
                    <span class="text-xs text-[var(--text3)]">{notification.timestamp}</span>
                  </div>
                  <p class="mt-1 text-sm text-[var(--text2)]">{notification.message}</p>
                  <span class="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text3)]">
                    {notification.unread ? (
                      <>
                        <span class="size-2 rounded-full bg-[var(--primary)]" aria-hidden="true" />
                        New
                      </>
                    ) : (
                      "Tap to toggle unread"
                    )}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </OverlayPanel>
    );
  },
);

export default NotificationsPanel;
