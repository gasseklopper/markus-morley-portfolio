import { component$, type PropFunction } from "@builder.io/qwik";
import OverlayPanel from "./overlay-panel";

const quickLinks = [
  {
    id: "profile",
    label: "Your profile",
    description: "Manage the story you share with collaborators.",
    href: "#",
  },
  {
    id: "settings",
    label: "Account settings",
    description: "Update security, notifications, and billing details.",
    href: "#",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Jump back into the latest workspaces you've touched.",
    href: "#",
  },
];

const insights = [
  {
    id: "followers",
    value: "2.3k",
    label: "Followers",
  },
  {
    id: "views",
    value: "48k",
    label: "Monthly views",
  },
  {
    id: "invites",
    value: "5",
    label: "Pending invites",
  },
];

export const AccountPanel = component$<{ onClose$: PropFunction<() => void> }>(
  ({ onClose$ }) => {
    return (
      <OverlayPanel
        eyebrow="Signed in as"
        title="Markus Morley"
        description="Review your profile and manage workspace access."
        onClose$={onClose$}
        triggerSelector="[data-account-toggle]"
        closeLabel="Close account menu"
        ariaLabel="Account menu"
      >
        <section class="flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-5 shadow-[0_16px_50px_var(--surface-shadow)]">
          <div class="flex items-center gap-4">
            <div class="flex size-14 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] text-2xl font-semibold text-[var(--primary)]">
              MM
            </div>
            <div>
              <p class="text-lg font-semibold text-[var(--text1)]">Markus Morley</p>
              <p class="text-sm text-[var(--text2)]">markus.morley@studio.com</p>
              <span class="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text3)]">
                Pro workspace
              </span>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            {insights.map((item) => (
              <div
                key={item.id}
                class="flex flex-col gap-1 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-3 py-3 text-center"
              >
                <span class="text-lg font-semibold text-[var(--text1)]">{item.value}</span>
                <span class="text-xs uppercase tracking-[0.25em] text-[var(--text3)]">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section class="flex flex-col gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-5 shadow-[0_16px_50px_var(--surface-shadow)]">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text3)]">
            Quick navigation
          </p>
          <ul class="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  class="flex flex-col gap-1 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] px-4 py-3 text-[var(--text2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-glass-2)] hover:text-[var(--text1)] focus:outline-none focus-visible:ring focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface1)]"
                >
                  <span class="text-sm font-semibold text-[var(--text1)]">{link.label}</span>
                  <span class="text-xs text-[var(--text3)]">{link.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section class="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-glass-1)] p-5 text-sm text-[var(--text2)] shadow-[0_16px_50px_var(--surface-shadow)]">
          <p class="font-semibold text-[var(--text1)]">Need a break?</p>
          <p class="mt-1 text-sm text-[var(--text2)]">
            Sign out to switch accounts or take a breather. We'll keep your workspace ready for when you return.
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-glass-2)] px-4 py-2 text-sm font-semibold text-[var(--text1)] shadow-[0_12px_36px_var(--surface-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width={1.5}
                class="size-5"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 16l-4-4 4-4" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 12h12a4 4 0 0 1 0 8H9"
                />
              </svg>
              Sign out
            </button>
            <a
              href="#"
              class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text3)] transition-colors duration-200 hover:text-[var(--text1)]"
            >
              Switch accounts
            </a>
          </div>
        </section>
      </OverlayPanel>
    );
  },
);

export default AccountPanel;
