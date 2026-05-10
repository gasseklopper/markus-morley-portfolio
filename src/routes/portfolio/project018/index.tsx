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
import * as ledgerModel from "./shopping-ledger-model";
import type {
  LedgerEntry,
  ShoppingList,
  StorageSnapshot,
} from "./shopping-ledger-model";

export default component$(() => {
  const seedSnapshot = ledgerModel.createSeedSnapshot();

  useStylesScoped$(styles);

  const lists = useSignal<ShoppingList[]>(
    ledgerModel.normalizeListCollection(seedSnapshot.lists),
  );
  const ledger = useSignal<LedgerEntry[]>(seedSnapshot.ledger);
  const activeListId = useSignal<string | null>(
    seedSnapshot.lists[0]?.id ?? null,
  );
  const newListName = useSignal("");
  const newItemName = useSignal("");
  const feedback = useSignal<string | null>(null);
  const feedbackTimeout = useSignal<number | null>(null);
  const timeWindowDays = useSignal<number>(seedSnapshot.settings.windowDays);
  const settingsOpen = useSignal(false);

  const showFlash = $((message: string) => {
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
  });

  const pushItemToActiveList = $((label: string) => {
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
          ledgerModel.createShoppingItem(trimmed, timestamp),
        ],
      };
    });

    if (!updated) return false;

    lists.value = updatedLists;
    ledger.value = [
      ledgerModel.createLedgerEntry(trimmed, timestamp),
      ...ledger.value,
    ].slice(0, ledgerModel.LEDGER_LIMIT);

    return true;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(ledgerModel.STORAGE_KEY);
    if (!stored) {
      activeListId.value = seedSnapshot.lists[0]?.id ?? null;
      return;
    }
    try {
      const parsed = JSON.parse(stored) as StorageSnapshot;
      if (parsed && parsed.version === 1) {
        const normalizedLists = ledgerModel.normalizeListCollection(
          parsed.lists ?? [],
        );
        lists.value = normalizedLists;
        ledger.value = parsed.ledger ?? [];
        const fallbackActiveId = normalizedLists[0]?.id ?? null;
        activeListId.value =
          parsed.activeListId &&
          normalizedLists.some((list) => list.id === parsed.activeListId)
            ? parsed.activeListId
            : fallbackActiveId;
        timeWindowDays.value =
          parsed.settings?.windowDays ?? seedSnapshot.settings.windowDays;
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
      lists: ledgerModel.serializeListCollection(lists.value),
      ledger: ledger.value,
      settings: {
        windowDays: timeWindowDays.value,
      },
      activeListId: activeListId.value,
    };

    window.localStorage.setItem(
      ledgerModel.STORAGE_KEY,
      JSON.stringify(snapshot),
    );
  });

  const currentList = useComputed$(
    () => lists.value.find((list) => list.id === activeListId.value) ?? null,
  );

  const totalLists = useComputed$(() => lists.value.length);
  const totalItems = useComputed$(() =>
    lists.value.reduce((acc, list) => acc + list.items.length, 0),
  );

  const frequentItems = useComputed$(() =>
    ledgerModel.getFrequentItems(ledger.value, timeWindowDays.value),
  );

  const handleCreateList = $(async (event: Event) => {
    event.preventDefault();
    const trimmed = newListName.value.trim();
    if (!trimmed) {
      await showFlash("Name your list before storing it");
      return;
    }
    const timestamp = new Date().toISOString();
    const list = ledgerModel.createShoppingList(trimmed, timestamp);
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

  const handleRemoveFrequentItem = $(async (label: string) => {
    const currentLedger = ledger.value;
    const filtered = currentLedger.filter((entry) => entry.label !== label);

    if (filtered.length === currentLedger.length) {
      await showFlash("No matching history to clear");
      return;
    }

    ledger.value = filtered;
    await showFlash(`Cleared history for ${label}`);
  });

  const handleToggleItemState = $((itemId: string) => {
    const targetId = activeListId.value;
    if (!targetId) return;

    lists.value = lists.value.map((list) => {
      if (list.id !== targetId) return list;

      return {
        ...list,
        items: list.items.map((item) => {
          if (item.id !== itemId) return item;

          return {
            ...item,
            state: ledgerModel.getNextItemState(item.state),
          };
        }),
      };
    });
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

  const handleRemoveList = $(async (listId: string) => {
    const existingLists = lists.value;
    const filtered = existingLists.filter((list) => list.id !== listId);

    if (filtered.length === existingLists.length) {
      return;
    }

    lists.value = filtered;

    if (activeListId.value === listId) {
      activeListId.value = filtered[0]?.id ?? null;
    }

    await showFlash("List removed");
  });

  const handleWindowChange = $((event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const parsed = Number.parseInt(input.value, 10);
    if (Number.isNaN(parsed)) return;
    const safe = ledgerModel.clampWindowDays(parsed);
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
        <h1 class="lab-hero__title">
          Bold brutal grocery rituals engineered for real life
        </h1>
        <p class="lab-hero__lead">
          Stage every grocery mission inside a resilient offline workspace. Name
          a list, we tag it with today&apos;s date, and your topics persist
          locally across light, dark, neon, or pastel moods. Summon fresh items,
          recall your most used picks within a custom window, and remix the
          weeknight run without losing momentum.
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
                  Every new list starts with a name and today&apos;s date tag.
                  Switch contexts, store presets, and keep snacks, studio stock,
                  and neon dinner runs aligned.
                </p>
              </header>

              <form
                preventdefault:submit
                onSubmit$={handleCreateList}
                class="lab-sidebar__form"
              >
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
                {feedback.value && (
                  <span class="lab-flash">{feedback.value}</span>
                )}
              </form>

              <div class="lab-list" role="list">
                {lists.value.length === 0 ? (
                  <p class="lab-canvas__empty">
                    No lists yet — name one to begin.
                  </p>
                ) : (
                  lists.value.map((list) => (
                    <div
                      key={list.id}
                      class="lab-list__item"
                      data-active={(list.id === activeListId.value).toString()}
                    >
                      <button
                        type="button"
                        class="lab-list__select"
                        onClick$={() => handleSelectList(list.id)}
                      >
                        <span class="lab-list__title">{list.name}</span>
                        <span class="lab-list__meta">
                          <span class="lab-tag">
                            {ledgerModel.formatDateTag(list.createdAt)}
                          </span>
                          <span>{`${list.items.length} topics`}</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        class="lab-list__remove"
                        onClick$={() => handleRemoveList(list.id)}
                      >
                        Remove
                      </button>
                    </div>
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
                <button
                  type="button"
                  class="lab-button secondary"
                  onClick$={toggleSettings}
                >
                  <span>
                    {settingsOpen.value ? "Hide settings" : "Adjust settings"}
                  </span>
                </button>
              </div>

              {currentList.value ? (
                <div class="lab-stack">
                  <article class="lab-card">
                    <header class="lab-card__title">
                      <span>Current topics</span>
                      <span class="lab-tag">
                        {ledgerModel.formatDateTag(currentList.value.createdAt)}
                      </span>
                    </header>
                    <div class="lab-card__body">
                      {currentList.value.items.length === 0 ? (
                        <p class="lab-canvas__empty">
                          Nothing pinned yet — add a topic.
                        </p>
                      ) : (
                        <ul class="lab-items">
                          {currentList.value.items.map((item) => (
                            <li
                              key={item.id}
                              class="lab-item"
                              data-state={item.state}
                            >
                              <button
                                type="button"
                                class="lab-item__toggle"
                                aria-label={`${ledgerModel.ITEM_STATE_LABEL[item.state]} for ${item.label}`}
                                onClick$={() => handleToggleItemState(item.id)}
                              >
                                <span aria-hidden="true">
                                  {ledgerModel.ITEM_STATE_ICON[item.state]}
                                </span>
                              </button>
                              <span class="lab-item__label">{item.label}</span>
                              <span class="lab-item__meta">
                                <span>
                                  {ledgerModel.formatDateTag(item.addedAt)}
                                </span>
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
                      <form
                        preventdefault:submit
                        onSubmit$={handleAddItem}
                        class="lab-stack"
                      >
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
                              const target =
                                event.target as HTMLInputElement | null;
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
                            Your history within this window is clear — add new
                            topics to build momentum.
                          </p>
                        ) : (
                          <div class="lab-frequency">
                            {frequentItems.value.map((entry) => (
                              <div class="lab-chip" key={entry.label}>
                                <button
                                  type="button"
                                  class="lab-chip__action"
                                  onClick$={() => handleChipAdd(entry.label)}
                                >
                                  <strong>{entry.label}</strong>
                                  <span>{`×${entry.count}`}</span>
                                </button>
                                <button
                                  type="button"
                                  class="lab-chip__remove"
                                  aria-label={`Remove ${entry.label} from most used`}
                                  onClick$={() =>
                                    handleRemoveFrequentItem(entry.label)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                <div class="lab-canvas__empty">
                  Focus a list to orchestrate topics and summon your most used
                  favorites.
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
                    Tune how far back we look when surfacing repeat topics.
                    Extend the horizon for pantry staples, or tighten it for
                    limited-edition neon finds.
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
