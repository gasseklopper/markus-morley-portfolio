import {
  $,
  component$,
  useComputed$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./shopping-ledger.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const STORAGE_KEY = "mm-shopping-ledger-v1";
const LEDGER_LIMIT = 320;

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const formatDateTag = (isoDate: string) => {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return isoDate;
  }
};

type ShoppingItem = {
  id: string;
  label: string;
  addedAt: string;
};

type ShoppingList = {
  id: string;
  name: string;
  createdAt: string;
  items: ShoppingItem[];
};

type LedgerEntry = {
  id: string;
  label: string;
  timestamp: string;
};

type StorageSnapshot = {
  version: number;
  lists: ShoppingList[];
  ledger: LedgerEntry[];
  settings: {
    windowDays: number;
  };
  activeListId: string | null;
};

const seedSnapshot: StorageSnapshot = {
  version: 1,
  lists: [
    {
      id: createId(),
      name: "Neo Market Ritual",
      createdAt: new Date().toISOString(),
      items: [
        { id: createId(), label: "Chromatic citrus", addedAt: new Date().toISOString() },
        { id: createId(), label: "Midnight oat milk", addedAt: new Date().toISOString() },
        { id: createId(), label: "Umami ramen kit", addedAt: new Date().toISOString() },
      ],
    },
    {
      id: createId(),
      name: "Studio Snack Arsenal",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      items: [
        { id: createId(), label: "Neon trail mix", addedAt: new Date().toISOString() },
        { id: createId(), label: "Sparkling yuzu", addedAt: new Date().toISOString() },
      ],
    },
  ],
  ledger: [
    { id: createId(), label: "Chromatic citrus", timestamp: new Date().toISOString() },
    { id: createId(), label: "Umami ramen kit", timestamp: new Date().toISOString() },
    { id: createId(), label: "Sparkling yuzu", timestamp: new Date().toISOString() },
    { id: createId(), label: "Midnight oat milk", timestamp: new Date().toISOString() },
    {
      id: createId(),
      label: "Chromatic citrus",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    },
  ],
  settings: {
    windowDays: 30,
  },
  activeListId: null,
};

export default component$(() => {
  useStylesScoped$(styles);

  const lists = useSignal<ShoppingList[]>(seedSnapshot.lists);
  const ledger = useSignal<LedgerEntry[]>(seedSnapshot.ledger);
  const activeListId = useSignal<string | null>(seedSnapshot.lists[0]?.id ?? null);
  const newListName = useSignal("");
  const newItemName = useSignal("");
  const feedback = useSignal<string | null>(null);
  const feedbackTimeout = useSignal<number | null>(null);
  const timeWindowDays = useSignal<number>(seedSnapshot.settings.windowDays);
  const settingsOpen = useSignal(false);

  const showFlash = $(
    (message: string) => {
      feedback.value = message;
      if (typeof window !== "undefined") {
        if (feedbackTimeout.value) {
          window.clearTimeout(feedbackTimeout.value);
        }
        feedbackTimeout.value = window.setTimeout(() => {
          feedback.value = null;
          feedbackTimeout.value = null;
        }, 2800);
      }
    },
  );

  const pushItemToActiveList = $(
    (label: string) => {
      const targetId = activeListId.value;
      if (!targetId) return false;

      const trimmed = label.trim();
      if (!trimmed) return false;

    const timestamp = new Date().toISOString();
    let updated = false;

    const updatedLists = lists.value.map((list) => {
      if (list.id !== targetId) {
        return list;
      }
      updated = true;
      return {
        ...list,
        items: [
          ...list.items,
          {
            id: createId(),
            label: trimmed,
            addedAt: timestamp,
          },
        ],
      };
    });

    if (!updated) return false;

    lists.value = updatedLists;
    ledger.value = [
      { id: createId(), label: trimmed, timestamp },
      ...ledger.value,
    ].slice(0, LEDGER_LIMIT);

    return true;
  },
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      activeListId.value = seedSnapshot.lists[0]?.id ?? null;
      return;
    }
    try {
      const parsed = JSON.parse(stored) as StorageSnapshot;
      if (parsed && parsed.version === 1) {
        lists.value = parsed.lists ?? [];
        ledger.value = parsed.ledger ?? [];
        activeListId.value = parsed.activeListId ?? parsed.lists?.[0]?.id ?? null;
        timeWindowDays.value = parsed.settings?.windowDays ?? seedSnapshot.settings.windowDays;
      }
    } catch (error) {
      console.error("Failed to parse stored shopping ledger", error);
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    if (typeof window === "undefined") return;
    track(() => lists.value);
    track(() => ledger.value);
    track(() => timeWindowDays.value);
    track(() => activeListId.value);

    const snapshot: StorageSnapshot = {
      version: 1,
      lists: lists.value,
      ledger: ledger.value,
      settings: {
        windowDays: timeWindowDays.value,
      },
      activeListId: activeListId.value,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  });

  const currentList = useComputed$(() =>
    lists.value.find((list) => list.id === activeListId.value) ?? null,
  );

  const totalLists = useComputed$(() => lists.value.length);
  const totalItems = useComputed$(() =>
    lists.value.reduce((acc, list) => acc + list.items.length, 0),
  );

  const frequentItems = useComputed$(() => {
    const days = timeWindowDays.value;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const counts = new Map<string, { count: number; last: number }>();

    for (const entry of ledger.value) {
      const time = new Date(entry.timestamp).getTime();
      if (Number.isNaN(time) || time < cutoff) continue;
      const existing = counts.get(entry.label) ?? { count: 0, last: 0 };
      counts.set(entry.label, {
        count: existing.count + 1,
        last: Math.max(existing.last, time),
      });
    }

    return Array.from(counts.entries())
      .map(([label, meta]) => ({ label, ...meta }))
      .sort((a, b) => {
        if (b.count === a.count) {
          return b.last - a.last;
        }
        return b.count - a.count;
      })
      .slice(0, 12);
  });

  const handleCreateList = $(async (event: Event) => {
    event.preventDefault();
    const trimmed = newListName.value.trim();
    if (!trimmed) {
      await showFlash("Name your list before storing it");
      return;
    }
    const timestamp = new Date().toISOString();
    const list: ShoppingList = {
      id: createId(),
      name: trimmed,
      createdAt: timestamp,
      items: [],
    };
    lists.value = [list, ...lists.value];
    activeListId.value = list.id;
    newListName.value = "";
    await showFlash("List staged in local storage");
  });

  const handleAddItem = $(async (event: Event) => {
    event.preventDefault();
    const trimmed = newItemName.value.trim();
    if (!trimmed) {
      await showFlash("Type a topic to add it");
      return;
    }
    const added = await pushItemToActiveList(trimmed);
    if (added) {
      newItemName.value = "";
      await showFlash(`Added ${trimmed}`);
    } else {
      await showFlash("Select or create a list first");
    }
  });

  const handleChipAdd = $(async (label: string) => {
    const added = await pushItemToActiveList(label);
    if (added) {
      await showFlash(`Summoned ${label}`);
    } else {
      await showFlash("Create or focus a list first");
    }
  });

  const handleRemoveItem = $(async (itemId: string) => {
    const targetId = activeListId.value;
    if (!targetId) return;
    let removed = false;
    const updatedLists = lists.value.map((list) => {
      if (list.id !== targetId) return list;
      const filtered = list.items.filter((item) => item.id !== itemId);
      if (filtered.length !== list.items.length) {
        removed = true;
      }
      return { ...list, items: filtered };
    });

    if (removed) {
      lists.value = updatedLists;
      await showFlash("Removed entry");
    }
  });

  const handleWindowChange = $((event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const parsed = Number.parseInt(input.value, 10);
    if (Number.isNaN(parsed)) return;
    const safe = Math.min(120, Math.max(7, parsed));
    timeWindowDays.value = safe;
  });

  const handleSelectList = $(async (id: string) => {
    activeListId.value = id;
    await showFlash("Focused list updated");
  });

  const toggleSettings = $(() => {
    settingsOpen.value = !settingsOpen.value;
  });

  return (
    <div class="shopping-lab">
      <section class="lab-hero">
        <span class="lab-hero__badge">Shopping Intelligence Lab</span>
        <h1 class="lab-hero__title">Bold brutal grocery rituals engineered for real life</h1>
        <p class="lab-hero__lead">
          Stage every grocery mission inside a resilient offline workspace. Name a list, we tag it with
          today&apos;s date, and your topics persist locally across light, dark, neon, or pastel moods.
          Summon fresh items, recall your most used picks within a custom window, and remix the weeknight
          run without losing momentum.
        </p>
        <dl class="lab-hero__meta">
          <div>
            <dt>Catalogued Lists</dt>
            <dd>{totalLists.value.toString().padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>Topics Captured</dt>
            <dd>{totalItems.value.toString().padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>Offline Sync</dt>
            <dd>Local Storage</dd>
          </div>
        </dl>
      </section>

      <section class="lab-panels">
        <div class="lab-shell">
          <div class="lab-shell__grid">
            <aside class="lab-sidebar">
              <header class="lab-sidebar__header">
                <h2>List Library</h2>
                <p>
                  Every new list starts with a name and today&apos;s date tag. Switch contexts, store presets,
                  and keep snacks, studio stock, and neon dinner runs aligned.
                </p>
              </header>

              <form preventdefault:submit onSubmit$={handleCreateList} class="lab-sidebar__form">
                <label class="lab-field" for="list-name">
                  <span>List Name</span>
                  <input
                    id="list-name"
                    name="list-name"
                    type="text"
                    autoComplete="off"
                    placeholder="Night market sweep"
                    class="lab-input"
                    value={newListName.value}
                    onInput$={(event) => {
                      const target = event.target as HTMLInputElement | null;
                      newListName.value = target?.value ?? "";
                    }}
                  />
                </label>
                <button type="submit" class="lab-button">
                  <span>Create List</span>
                </button>
                {feedback.value && <span class="lab-flash">{feedback.value}</span>}
              </form>

              <div class="lab-list" role="list">
                {lists.value.length === 0 ? (
                  <p class="lab-canvas__empty">No lists yet — name one to begin.</p>
                ) : (
                  lists.value.map((list) => (
                    <button
                      key={list.id}
                      type="button"
                      class="lab-list__item"
                      data-active={(list.id === activeListId.value).toString()}
                      onClick$={() => handleSelectList(list.id)}
                    >
                      <span class="lab-list__title">{list.name}</span>
                      <span class="lab-list__meta">
                        <span class="lab-tag">{formatDateTag(list.createdAt)}</span>
                        <span>{`${list.items.length} topics`}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </aside>

            <main class="lab-canvas">
              <div class="lab-canvas__header">
                <h3>
                  {currentList.value
                    ? `${currentList.value.name}`
                    : "Select a list to orchestrate it"}
                </h3>
                <button type="button" class="lab-button secondary" onClick$={toggleSettings}>
                  <span>{settingsOpen.value ? "Hide settings" : "Adjust settings"}</span>
                </button>
              </div>

              {currentList.value ? (
                <div class="lab-stack">
                  <article class="lab-card">
                    <header class="lab-card__title">
                      <span>Current topics</span>
                      <span class="lab-tag">{formatDateTag(currentList.value.createdAt)}</span>
                    </header>
                    <div class="lab-card__body">
                      {currentList.value.items.length === 0 ? (
                        <p class="lab-canvas__empty">Nothing pinned yet — add a topic.</p>
                      ) : (
                        <ul class="lab-items">
                          {currentList.value.items.map((item) => (
                            <li key={item.id} class="lab-item">
                              <span>{item.label}</span>
                              <span class="lab-item__meta">
                                <span>{formatDateTag(item.addedAt)}</span>
                                <button
                                  type="button"
                                  class="lab-item__remove"
                                  onClick$={() => handleRemoveItem(item.id)}
                                >
                                  Remove
                                </button>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>

                  <article class="lab-card">
                    <header class="lab-card__title">
                      <span>Add a fresh topic</span>
                      <span>{`Tracks last ${timeWindowDays.value} day window`}</span>
                    </header>
                    <div class="lab-card__body">
                      <form preventdefault:submit onSubmit$={handleAddItem} class="lab-stack">
                        <label class="lab-field" for="item-name">
                          <span>New Topic</span>
                          <input
                            id="item-name"
                            name="item-name"
                            type="text"
                            autoComplete="off"
                            placeholder="Hyperlocal produce"
                            class="lab-input"
                            value={newItemName.value}
                            onInput$={(event) => {
                              const target = event.target as HTMLInputElement | null;
                              newItemName.value = target?.value ?? "";
                            }}
                          />
                        </label>
                        <button type="submit" class="lab-button">
                          <span>Add to list</span>
                        </button>
                      </form>

                      <div class="lab-stack">
                        <h4 class="lab-card__title">
                          <span>Most used</span>
                          <span>{`Seen in the last ${timeWindowDays.value} days`}</span>
                        </h4>
                        {frequentItems.value.length === 0 ? (
                          <p class="lab-canvas__empty">
                            Your history within this window is clear — add new topics to build momentum.
                          </p>
                        ) : (
                          <div class="lab-frequency">
                            {frequentItems.value.map((entry) => (
                              <button
                                key={entry.label}
                                type="button"
                                class="lab-chip"
                                onClick$={() => handleChipAdd(entry.label)}
                              >
                                <strong>{entry.label}</strong>
                                <span>{`×${entry.count}`}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                <div class="lab-canvas__empty">
                  Focus a list to orchestrate topics and summon your most used favorites.
                </div>
              )}

              {settingsOpen.value && (
                <section class="lab-settings">
                  <header class="lab-card__title">
                    <span>Frequency window</span>
                    <span>{`${timeWindowDays.value} day horizon`}</span>
                  </header>
                  <label>
                    <span>Adjust lookback days</span>
                    <input
                      class="lab-range"
                      type="range"
                      min="7"
                      max="120"
                      value={timeWindowDays.value}
                      onInput$={handleWindowChange}
                    />
                  </label>
                  <label>
                    <span>Manual override</span>
                    <input
                      class="lab-input"
                      type="number"
                      min="7"
                      max="120"
                      value={timeWindowDays.value}
                      onInput$={handleWindowChange}
                    />
                  </label>
                  <p>
                    Tune how far back we look when surfacing repeat topics. Extend the horizon for pantry
                    staples, or tighten it for limited-edition neon finds.
                  </p>
                </section>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(
  "Project 018 - Markus Morley personal portfolio",
  `${siteConfig.metadata.title} — Brutalist shopping list atelier that stores lists in local storage, tags them with creation dates, and suggests frequently used topics within an adjustable window.`,
);
