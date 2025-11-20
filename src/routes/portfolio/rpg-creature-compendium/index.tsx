import { $, component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import { Form, Link, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import styles from "./rpg-creature-compendium.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import {
  abilityLabels,
  collectCreatureSummaries,
  fetchCreatureFromRoots,
  normalizeCreature,
  resolveIdentifierFromSummaries,
  type NormalizedCreature,
} from "./creature-utils";

type CreatureSearchResult = {
  ok: boolean;
  creature?: NormalizedCreature;
  message?: string;
};

export const useCreatureSummaries = routeLoader$(async () => {
  return await collectCreatureSummaries();
});

export const useCreatureSearch = routeAction$<CreatureSearchResult>(async (form) => {
  const queryValue = typeof form.query === "string" ? form.query : "";
  const trimmed = queryValue.trim();

  if (!trimmed) {
    return { ok: false, message: "Enter a creature name or identifier to begin." } satisfies CreatureSearchResult;
  }

  const summaries = await collectCreatureSummaries();
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
    const actionRunning = track(() => searchAction.isRunning);
    const result = track(() => searchAction.value);

    if (actionRunning) {
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
          {creature.value && (
            <div class="detail-actions">
              <Link
                id="detail-link"
                aria-label={`View detailed profile for ${creature.value.name}`}
                href={`/portfolio/rpg-creature-compendium/${encodeURIComponent(creature.value.identifier)}`}
              >
                View details
              </Link>
            </div>
          )}
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
