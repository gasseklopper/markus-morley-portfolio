export const STORAGE_KEY = "mm-shopping-ledger-v1";
export const LEDGER_LIMIT = 320;

export type ItemState = "idle" | "complete" | "skip";

export type ShoppingItem = {
  id: string;
  label: string;
  addedAt: string;
  state: ItemState;
};

export type ShoppingList = {
  id: string;
  name: string;
  createdAt: string;
  items: ShoppingItem[];
};

export type StoredShoppingItem = Omit<ShoppingItem, "state"> & {
  state?: unknown;
};
export type StoredShoppingList = Omit<ShoppingList, "items"> & {
  items?: StoredShoppingItem[];
};

export type LedgerEntry = {
  id: string;
  label: string;
  timestamp: string;
};

export type StorageSnapshot = {
  version: number;
  lists: StoredShoppingList[];
  ledger: LedgerEntry[];
  settings: {
    windowDays: number;
  };
  activeListId: string | null;
};

export const ITEM_STATE_SEQUENCE: ItemState[] = ["idle", "complete", "skip"];
export const ITEM_STATE_ICON: Record<ItemState, string> = {
  idle: "\u2610",
  complete: "\u2714",
  skip: "\u2716",
};
export const ITEM_STATE_LABEL: Record<ItemState, string> = {
  idle: "Mark item as collected",
  complete: "Mark item as missing",
  skip: "Reset item status",
};

export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createLedgerEntry = (
  label: string,
  timestamp = new Date().toISOString(),
): LedgerEntry => ({
  id: createId(),
  label,
  timestamp,
});

export const createShoppingItem = (
  label: string,
  timestamp = new Date().toISOString(),
): ShoppingItem => ({
  id: createId(),
  label,
  addedAt: timestamp,
  state: "idle",
});

export const createShoppingList = (
  name: string,
  timestamp = new Date().toISOString(),
): ShoppingList => ({
  id: createId(),
  name,
  createdAt: timestamp,
  items: [],
});

export const getNextItemState = (current: ItemState) => {
  const index = ITEM_STATE_SEQUENCE.indexOf(current);
  if (index === -1 || index === ITEM_STATE_SEQUENCE.length - 1) {
    return ITEM_STATE_SEQUENCE[0];
  }
  return ITEM_STATE_SEQUENCE[index + 1];
};

export const coerceItemState = (value: unknown): ItemState => {
  switch (value) {
    case "complete":
    case "skip":
    case "idle":
      return value;
    default:
      return "idle";
  }
};

export const normalizeListCollection = (
  lists: StoredShoppingList[],
): ShoppingList[] =>
  lists.map((list) => ({
    ...list,
    items: (list.items ?? []).map(
      (item): ShoppingItem => ({
        ...item,
        state: coerceItemState(item.state),
      }),
    ),
  }));

export const serializeListCollection = (
  lists: ShoppingList[],
): StoredShoppingList[] =>
  lists.map((list) => ({
    ...list,
    items: list.items.map((item) => ({
      ...item,
    })),
  }));

export const formatDateTag = (isoDate: string) => {
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

export const clampWindowDays = (value: number) =>
  Math.min(120, Math.max(7, value));

export const getFrequentItems = (
  ledger: LedgerEntry[],
  days: number,
  now = Date.now(),
) => {
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  const counts = new Map<string, { count: number; last: number }>();

  for (const entry of ledger) {
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
};

export const createSeedSnapshot = (): StorageSnapshot => {
  const now = new Date();
  const timestamp = now.toISOString();
  const olderTimestamp = new Date(
    now.getTime() - 1000 * 60 * 60 * 24 * 6,
  ).toISOString();

  const neoMarket: ShoppingList = {
    id: createId(),
    name: "Neo Market Ritual",
    createdAt: timestamp,
    items: [
      createShoppingItem("Chromatic citrus", timestamp),
      createShoppingItem("Midnight oat milk", timestamp),
      createShoppingItem("Umami ramen kit", timestamp),
    ],
  };
  const studioSnacks: ShoppingList = {
    id: createId(),
    name: "Studio Snack Arsenal",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    items: [
      createShoppingItem("Neon trail mix", timestamp),
      createShoppingItem("Sparkling yuzu", timestamp),
    ],
  };

  return {
    version: 1,
    lists: [neoMarket, studioSnacks],
    ledger: [
      createLedgerEntry("Chromatic citrus", timestamp),
      createLedgerEntry("Umami ramen kit", timestamp),
      createLedgerEntry("Sparkling yuzu", timestamp),
      createLedgerEntry("Midnight oat milk", timestamp),
      createLedgerEntry("Chromatic citrus", olderTimestamp),
    ],
    settings: {
      windowDays: 30,
    },
    activeListId: null,
  };
};
