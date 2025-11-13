import { $, component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import styles from "./rpg-creature-compendium.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import { API_ROOTS, resolveApiUrl } from "./api-config";

type CreatureSummary = {
  id?: number;
  index?: string;
  name?: string;
  slug?: string;
};

type RawProficiency = {
  value?: number;
  bonus?: number;
  modifier?: number;
  mod?: number;
  proficiency?: { name?: string };
  skill?: { name?: string };
  name?: string;
};

type RawCreature = {
  id?: number | string;
  index?: string;
  name?: string;
  slug?: string;
  type?: string;
  creature_type?: string;
  alignment?: string;
  armor_class?: number | string | Array<number | { value?: number; type?: string; name?: string }>;
  hit_points?: number | string;
  speed?: string | Record<string, string | number>;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  ability_scores?: Partial<Record<AbilityKey, number>>;
  stats?: Array<{ name?: string; stat?: string; ability?: string; score?: number; base_stat?: number; value?: number }>;
  proficiencies?: RawProficiency[];
  skills?: RawProficiency[];
  saving_throws?: RawProficiency[];
  damage_resistances?: string[];
  damage_immunities?: string[];
  damage_vulnerabilities?: string[];
  condition_immunities?: Array<{ name?: string } | string>;
  image?: string;
  portrait?: string;
  images?: string[];
};

type AbilityKey = "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";

type NormalizedCreature = {
  id: string;
  name: string;
  type: string;
  alignment: string;
  armorClass: string;
  hitPoints: string;
  speed: string;
  abilityScores: Record<AbilityKey, string>;
  proficiencies: string[];
  specialDefense: string;
  imageUrl?: string;
};

const hasDetailedStats = (creature: RawCreature): boolean => {
  if (!creature) return false;

  const defensesPresent =
    (Array.isArray(creature.damage_resistances) && creature.damage_resistances.length > 0) ||
    (Array.isArray(creature.damage_immunities) && creature.damage_immunities.length > 0) ||
    (Array.isArray(creature.damage_vulnerabilities) && creature.damage_vulnerabilities.length > 0) ||
    (Array.isArray(creature.condition_immunities) && creature.condition_immunities.length > 0);

  const proficienciesPresent =
    (Array.isArray(creature.proficiencies) && creature.proficiencies.length > 0) ||
    (Array.isArray(creature.skills) && creature.skills.length > 0) ||
    (Array.isArray(creature.saving_throws) && creature.saving_throws.length > 0);

  const abilityDataPresent =
    typeof creature.strength === "number" ||
    typeof creature.dexterity === "number" ||
    typeof creature.constitution === "number" ||
    typeof creature.intelligence === "number" ||
    typeof creature.wisdom === "number" ||
    typeof creature.charisma === "number" ||
    (creature.ability_scores && Object.keys(creature.ability_scores).length > 0) ||
    (Array.isArray(creature.stats) && creature.stats.length > 0);

  return (
    creature.armor_class != null ||
    creature.hit_points != null ||
    creature.speed != null ||
    defensesPresent ||
    proficienciesPresent ||
    abilityDataPresent
  );
};

const RESOURCE_PATHS = ["/creatures/", "/creature/", "/monsters/"];
const IDENTIFIER_QUERIES = ["id", "name", "slug", "index", "search", "q"];

const buildIdentifierPaths = (identifier: string): string[] => {
  const encoded = encodeURIComponent(identifier);
  const paths: string[] = [];
  for (const prefix of RESOURCE_PATHS) {
    paths.push(`${prefix}${encoded}`);
  }
  for (const query of IDENTIFIER_QUERIES) {
    paths.push(`/creatures?${query}=${encoded}`);
  }
  return paths;
};

const expandCandidatePaths = (creature: RawCreature): string[] => {
  const identifiers = new Set<string>();
  if (creature.id != null) identifiers.add(`${creature.id}`);
  if (creature.index) identifiers.add(creature.index);
  if (creature.slug) identifiers.add(creature.slug);
  if (creature.name) identifiers.add(creature.name);

  const paths: string[] = [];
  identifiers.forEach((id) => {
    buildIdentifierPaths(id).forEach((path) => paths.push(path));
  });

  return paths;
};

const generateIdentifierVariants = (value: string): string[] => {
  const variants = new Set<string>();
  const trimmed = value.trim();
  if (!trimmed) return [];

  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const spaced = trimmed.replace(/[_-]+/g, " ");
  const titleCased = spaced.replace(/\b(\w)/g, (match) => match.toUpperCase());

  [
    trimmed,
    trimmed.toLowerCase(),
    trimmed.toUpperCase(),
    slug,
    spaced,
    titleCased,
  ].forEach((entry) => {
    const normalized = entry.trim();
    if (normalized) {
      variants.add(normalized);
    }
  });

  return Array.from(variants);
};

const searchRootForCreature = async (
  root: string,
  identifier: string,
  rawInput: string,
): Promise<{ creature: RawCreature; detailed: boolean } | null> => {
  const visited = new Set<string>();
  const queue: string[] = [];

  const enqueue = (path: string) => {
    const url = resolveApiUrl(root, path);
    if (!visited.has(url) && !queue.includes(url)) {
      queue.push(url);
    }
  };

  const baseIdentifiers = new Set<string>([
    ...generateIdentifierVariants(identifier),
    ...generateIdentifierVariants(rawInput),
  ]);

  baseIdentifiers.forEach((value) => {
    buildIdentifierPaths(value).forEach(enqueue);
  });

  let fallback: RawCreature | null = null;

  while (queue.length > 0) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const json = await attemptJson(response);
      const creature = unwrapCreature(json);
      if (!creature) continue;

      if (hasDetailedStats(creature)) {
        return { creature, detailed: true };
      }

      if (!fallback) {
        fallback = creature;
      }

      expandCandidatePaths(creature).forEach(enqueue);
    } catch (error) {
      console.error("Failed request", url, error);
    }
  }

  return fallback ? { creature: fallback, detailed: false } : null;
};

const fetchCreatureFromRoots = async (
  identifier: string,
  rawInput: string,
): Promise<RawCreature | null> => {
  let fallback: RawCreature | null = null;

  for (const root of API_ROOTS) {
    const result = await searchRootForCreature(root, identifier, rawInput);
    if (!result) continue;

    if (result.detailed) {
      return result.creature;
    }

    if (!fallback) {
      fallback = result.creature;
    }
  }

  return fallback;
};

const abilityLabels: Record<AbilityKey, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma",
};

const formatArmorClass = (value: RawCreature["armor_class"]): string => {
  if (Array.isArray(value)) {
    const formatted = value
      .map((entry) => {
        if (typeof entry === "number") {
          return entry.toString();
        }
        const score = entry?.value ?? entry?.name;
        if (score == null) return "";
        if (entry?.type) {
          return `${score} (${entry.type})`;
        }
        return `${score}`;
      })
      .filter(Boolean);
    return formatted.length > 0 ? formatted.join(", ") : "—";
  }
  if (value == null) return "—";
  if (typeof value === "number") return value.toString();
  return `${value}`;
};

const formatSpeed = (speed: RawCreature["speed"]): string => {
  if (!speed) return "—";
  if (typeof speed === "string") return speed;
  const entries = Object.entries(speed)
    .map(([mode, distance]) => {
      if (distance == null || distance === "") return "";
      const prettyMode = mode.replace(/_/g, " ");
      return `${prettyMode} ${distance}`;
    })
    .filter(Boolean);
  return entries.length > 0 ? entries.join(", ") : "—";
};

type ImmunityEntry = string | { name?: string };

const formatSpecialDefense = (creature: RawCreature): string => {
  const sections: string[] = [];
  const pushSection = (
    label: string,
    value?: string | ImmunityEntry[] | null,
  ) => {
    if (!value) return;
    const items: ImmunityEntry[] = Array.isArray(value) ? value : [value];
    const clean = items
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        return item.name ?? "";
      })
      .filter(Boolean);
    if (clean.length > 0) {
      sections.push(`${label}: ${clean.join(", ")}`);
    }
  };

  pushSection("Resistances", creature.damage_resistances ?? null);
  pushSection("Immunities", creature.damage_immunities ?? null);
  pushSection("Vulnerabilities", creature.damage_vulnerabilities ?? null);
  pushSection("Condition", creature.condition_immunities ?? null);

  return sections.length > 0 ? sections.join(" • ") : "—";
};

const extractAbilityScore = (creature: RawCreature, key: AbilityKey): string => {
  const direct = creature[key];
  if (typeof direct === "number") return direct.toString();

  const abilityScores = creature.ability_scores?.[key];
  if (typeof abilityScores === "number") return abilityScores.toString();

  const statFromArray = creature.stats?.find((stat) => {
    const name = stat.name?.toLowerCase();
    const ability = stat.ability?.toLowerCase();
    const statKey = stat.stat?.toLowerCase();
    return name === key || ability === key || statKey === key;
  });
  if (statFromArray) {
    const numeric =
      statFromArray.base_stat ??
      statFromArray.value ??
      statFromArray.score ??
      (typeof statFromArray.name === "string" && /\d+/.test(statFromArray.name)
        ? Number.parseInt(statFromArray.name, 10)
        : undefined);
    if (numeric != null && !Number.isNaN(numeric)) {
      return numeric.toString();
    }
  }

  return "—";
};

const formatProficiency = (entry: RawProficiency): string | null => {
  const label = entry.proficiency?.name ?? entry.skill?.name ?? entry.name;
  if (!label) return null;
  const modifier = entry.value ?? entry.bonus ?? entry.modifier ?? entry.mod;
  if (modifier == null) return label;
  const sign = modifier >= 0 ? "+" : "";
  return `${label}: ${sign}${modifier}`;
};

const normalizeCreature = (creature: RawCreature): NormalizedCreature => {
  const idValue = creature.id ?? creature.index ?? "";
  const abilityScores: Record<AbilityKey, string> = {
    strength: extractAbilityScore(creature, "strength"),
    dexterity: extractAbilityScore(creature, "dexterity"),
    constitution: extractAbilityScore(creature, "constitution"),
    intelligence: extractAbilityScore(creature, "intelligence"),
    wisdom: extractAbilityScore(creature, "wisdom"),
    charisma: extractAbilityScore(creature, "charisma"),
  };

  const profArrays = [creature.proficiencies, creature.skills, creature.saving_throws].filter(
    (arr): arr is RawProficiency[] => Array.isArray(arr)
  );

  const proficiencies = profArrays
    .flatMap((arr) => arr.map(formatProficiency))
    .filter((entry): entry is string => Boolean(entry));

  const imageUrl = creature.image ?? creature.portrait ?? creature.images?.[0];

  return {
    id: `${idValue ?? ""}`,
    name: creature.name ?? "Unknown Creature",
    type: creature.type ?? creature.creature_type ?? "—",
    alignment: creature.alignment ?? "—",
    armorClass: formatArmorClass(creature.armor_class),
    hitPoints: creature.hit_points != null ? `${creature.hit_points}` : "—",
    speed: formatSpeed(creature.speed),
    abilityScores,
    proficiencies,
    specialDefense: formatSpecialDefense(creature),
    imageUrl,
  };
};

const attemptJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch (error) {
    console.error("Failed to parse JSON", error);
    return null;
  }
};

const SUMMARY_ARRAY_KEYS = ["results", "creatures", "data", "entries", "items", "monsters"];

const extractSummaries = (payload: unknown): CreatureSummary[] | null => {
  const collect = (input: unknown): CreatureSummary[] => {
    if (!input) return [];
    if (Array.isArray(input)) {
      return input.filter((item): item is CreatureSummary => item != null && typeof item === "object");
    }
    if (typeof input !== "object") return [];
    const record = input as Record<string, unknown>;
    for (const key of SUMMARY_ARRAY_KEYS) {
      if (Array.isArray(record[key])) {
        return (record[key] as unknown[]).filter((item): item is CreatureSummary =>
          item != null && typeof item === "object",
        );
      }
    }
    return [];
  };

  const results = collect(payload);
  return results.length > 0 ? results : null;
};

const unwrapCreature = (payload: unknown): RawCreature | null => {
  if (!payload) return null;
  if (Array.isArray(payload)) {
    return (payload.find((item) => item && typeof item === "object") as RawCreature) ?? null;
  }
  if (typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  const objectKeys = ["creature", "result", "data", "entry"];
  for (const key of objectKeys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as RawCreature;
    }
    if (Array.isArray(value) && value.length > 0) {
      return value[0] as RawCreature;
    }
  }

  for (const key of SUMMARY_ARRAY_KEYS) {
    const arrayValue = record[key];
    if (Array.isArray(arrayValue) && arrayValue.length > 0) {
      return arrayValue[0] as RawCreature;
    }
  }

  return record as RawCreature;
};

const collectCreatureSummaries = async (): Promise<CreatureSummary[]> => {
  const registry = new Map<string, CreatureSummary>();

  const register = (entry: CreatureSummary) => {
    const candidates = [
      entry.slug?.toLowerCase(),
      entry.index?.toLowerCase(),
      entry.name?.toLowerCase(),
      entry.id != null ? `${entry.id}` : undefined,
    ].filter(Boolean) as string[];

    candidates.forEach((key) => {
      if (!registry.has(key)) {
        registry.set(key, entry);
      }
    });
  };

  for (const root of API_ROOTS) {
    try {
      const listUrl = resolveApiUrl(root, "/creatures");
      const response = await fetch(listUrl);
      if (!response.ok) continue;
      const json = await attemptJson(response);
      const list = extractSummaries(json);
      if (!list) continue;
      list.forEach(register);
    } catch (error) {
      console.error("Failed to load creature summaries", error);
    }
  }

  return Array.from(registry.values());
};

const resolveIdentifierFromSummaries = (
  input: string,
  summaries: CreatureSummary[] | null,
): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  if (!summaries || summaries.length === 0) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  const match = summaries.find((item) => {
    const candidates = [
      item.name?.toLowerCase(),
      item.slug?.toLowerCase(),
      item.index?.toLowerCase(),
      item.id != null ? `${item.id}` : undefined,
    ].filter(Boolean) as string[];
    return candidates.includes(lower);
  });

  if (!match) return trimmed;
  if (match.id != null) return `${match.id}`;
  if (match.index) return match.index;
  if (match.slug) return match.slug;
  if (match.name) return match.name;
  return trimmed;
};

type CreatureSearchResult = {
  ok: boolean;
  creature?: NormalizedCreature;
  message?: string;
};

export const useCreatureSummaries = routeLoader$(async () => {
  return await collectCreatureSummaries();
});

export const useCreatureSearch = routeAction$(async (form, event) => {
  const queryValue = typeof form.query === "string" ? form.query : "";
  const trimmed = queryValue.trim();

  if (!trimmed) {
    return { ok: false, message: "Enter a creature name or identifier to begin." } satisfies CreatureSearchResult;
  }

  const summaries = await event.resolveValue(useCreatureSummaries);
  const identifier = resolveIdentifierFromSummaries(trimmed, summaries);
  const creature = await fetchCreatureFromRoots(identifier ?? trimmed, trimmed);

  if (!creature) {
    return {
      ok: false,
      message: `No creature found for “${trimmed}”.`,
    } satisfies CreatureSearchResult;
  }

  return {
    ok: true,
    creature: normalizeCreature(creature),
  } satisfies CreatureSearchResult;
});

export default component$(() => {
  useStylesScoped$(styles);

  const searchValue = useSignal("");
  const status = useSignal<"idle" | "loading" | "error">("idle");
  const errorMessage = useSignal<string | null>(null);
  const creature = useSignal<NormalizedCreature | null>(null);
  const searchAction = useCreatureSearch();
  const summaries = useCreatureSummaries();

  const handleClear = $(() => {
    searchValue.value = "";
    creature.value = null;
    errorMessage.value = null;
    status.value = "idle";
  });

  useTask$(({ track }) => {
    const actionStatus = track(() => searchAction.status);
    const result = track(() => searchAction.value);

    if (actionStatus === "running") {
      status.value = "loading";
      errorMessage.value = null;
      return;
    }

    if (!result) {
      status.value = "idle";
      return;
    }

    if (result.ok && result.creature) {
      creature.value = result.creature;
      errorMessage.value = null;
      status.value = "idle";
      return;
    }

    creature.value = null;
    status.value = "error";
    errorMessage.value = result.message ?? "Unable to find that creature.";
  });

  return (
    <div id="app" class="page">
      <header>
        <h1 id="title">RPG Creature Compendium</h1>
        <p class="subtitle">
          Search for monsters by name or numeric identifier using the freeCodeCamp RPG Creature API. View essential lore, combat
          statistics, and proficiency highlights instantly.
        </p>
      </header>

      <section class="search-card" aria-labelledby="title">
        <Form class="search-form" action={searchAction} aria-label="Search creatures">
          <div class="search-input-group">
            <label for="search-input">Creature name or ID</label>
            <input
              id="search-input"
              name="query"
              type="text"
              value={searchValue.value}
              list="creature-suggestions"
              onInput$={(event) => (searchValue.value = (event.target as HTMLInputElement).value)}
              placeholder="e.g. Pyrolysk or 27"
              autocomplete="off"
              disabled={status.value === "loading"}
            />
            <datalist id="creature-suggestions">
              {(summaries.value ?? [])
                .slice(0, 25)
                .map((entry) => {
                  const optionValue =
                    entry.name ?? entry.slug ?? entry.index ?? (entry.id != null ? `${entry.id}` : null);
                  if (!optionValue) return null;
                  return <option key={optionValue} value={optionValue} />;
                })}
            </datalist>
          </div>
          <div class="actions">
            <button id="search-button" type="submit" disabled={status.value === "loading"}>
              {status.value === "loading" ? "Searching…" : "Search"}
            </button>
            <button id="clear-button" type="button" onClick$={handleClear}>
              Clear
            </button>
          </div>
        </Form>
        {errorMessage.value && <p class="alert" role="status">{errorMessage.value}</p>}
        {!errorMessage.value && status.value === "loading" && <p class="status-line">Fetching creature profile…</p>}
      </section>

      <section class="content-grid">
        <article class="profile-card">
          <div class={`image-frame ${status.value === "loading" ? "skeleton" : ""}`}>
            {creature.value?.imageUrl ? (
              <img
                id="creature-image"
                src={creature.value.imageUrl}
                alt={`Illustration of ${creature.value.name}`}
                width={512}
                height={640}
              />
            ) : (
              <div class="empty-state">
                <h2 class="empty-title">Awaiting your search</h2>
                <p class="empty-body">
                  Start by typing a creature name like <strong>Pyrolysk</strong> or any numeric identifier. Artwork will appear here
                  when data is available.
                </p>
              </div>
            )}
          </div>
          <div class="meta-grid">
            <div>
              <span class="meta-label">Creature Name</span>
              <p id="creature-name" class="meta-value">
                {creature.value?.name ?? "—"}
              </p>
            </div>
            <div>
              <span class="meta-label">Creature ID</span>
              <p id="creature-id" class="meta-value">
                {creature.value?.id ?? "—"}
              </p>
            </div>
          </div>
        </article>

        <article class="stats-card">
          <div class="details-grid">
            <div class="detail-row">
              <span class="detail-label">Type</span>
              <span id="type" class="detail-value">
                {creature.value?.type ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Alignment</span>
              <span id="alignment" class="detail-value">
                {creature.value?.alignment ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Armor Class</span>
              <span id="armor-class" class="detail-value">
                {creature.value?.armorClass ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Hit Points</span>
              <span id="hit-points" class="detail-value">
                {creature.value?.hitPoints ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Speed</span>
              <span id="speed" class="detail-value">
                {creature.value?.speed ?? "—"}
              </span>
            </div>
          </div>

          <div>
            <p class="section-title">Ability scores</p>
            <div class="abilities-grid">
              {Object.entries(abilityLabels).map(([key, label]) => (
                <div key={key} class="ability-card">
                  <span class="ability-label">{label}</span>
                  <span id={key as AbilityKey} class="ability-score">
                    {creature.value?.abilityScores[key as AbilityKey] ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p class="section-title">Special defense</p>
            <p id="special-defense" class="detail-value">
              {creature.value?.specialDefense ?? "—"}
            </p>
          </div>

          <div>
            <p class="section-title">Proficiencies</p>
            <div id="proficiencies">
              {creature.value?.proficiencies.length ? (
                creature.value.proficiencies.map((entry) => (
                  <span key={entry} class="proficiency-chip">
                    {entry}
                  </span>
                ))
              ) : (
                <span class="detail-value">—</span>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
});

export const head = buildHead(
  `RPG Creature Compendium - ${siteConfig.metadata.title}`,
  "Search the freeCodeCamp RPG Creature API for monsters by name or identifier and instantly review their core statistics.",
);
