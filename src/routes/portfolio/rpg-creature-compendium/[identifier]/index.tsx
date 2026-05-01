import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import styles from "../rpg-creature-compendium.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import { abilityLabels, fetchCreatureFromRoots, normalizeCreature, type NormalizedCreature } from "../creature-utils";

export const useCreatureDetail = routeLoader$(async ({ params }) => {
  const identifier = decodeURIComponent(params.identifier ?? "");
  if (!identifier) {
    return { ok: false, message: "Missing creature identifier." } as const;
  }

  const creature = await fetchCreatureFromRoots(identifier, identifier);
  if (!creature) {
    return { ok: false, message: `No creature found for “${identifier}”.` } as const;
  }

  return { ok: true, creature: normalizeCreature(creature) } as const;
});

export default component$(() => {
  useStylesScoped$(styles);
  const result = useCreatureDetail();

  const creature: NormalizedCreature | null = result.value && result.value.ok ? result.value.creature : null;
  const errorMessage = result.value && !result.value.ok ? result.value.message : null;

  return (
    <div id="app" class="page">
      <header>
        <p class="eyebrow">RPG Creature Compendium</p>
        <h1 id="title">Creature details</h1>
        <p class="subtitle">Dive deeper into a single monster profile with full stats and defenses.</p>
      </header>

      <section class="search-card" aria-labelledby="title">
        <div class="actions back-action">
          <Link class="ghost" href="/portfolio/rpg-creature-compendium">
            ← Back to search
          </Link>
        </div>
        {errorMessage && <p class="alert" role="status">{errorMessage}</p>}
      </section>

      <section class="content-grid">
        <article class="profile-card">
          <div class={`image-frame ${!creature ? "skeleton" : ""}`}>
            {creature?.imageUrl ? (
              <img
                id="creature-image"
                src={creature.imageUrl}
                alt={`Illustration of ${creature.name}`}
                width={512}
                height={640}
              />
            ) : (
              <div class="empty-state">
                <h2 class="empty-title">{creature ? "No artwork available" : "Creature not found"}</h2>
                <p class="empty-body">
                  {creature
                    ? "This monster did not include an image in the upstream API."
                    : "Try returning to the search page and selecting another creature."}
                </p>
              </div>
            )}
          </div>
          <div class="meta-grid">
            <div>
              <span class="meta-label">Creature Name</span>
              <p id="creature-name" class="meta-value">
                {creature?.name ?? "—"}
              </p>
            </div>
            <div>
              <span class="meta-label">Creature ID</span>
              <p id="creature-id" class="meta-value">
                {creature?.id ?? "—"}
              </p>
            </div>
          </div>
        </article>

        <article class="stats-card">
          <div class="details-grid">
            <div class="detail-row">
              <span class="detail-label">Type</span>
              <span id="type" class="detail-value">
                {creature?.type ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Alignment</span>
              <span id="alignment" class="detail-value">
                {creature?.alignment ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Armor Class</span>
              <span id="armor-class" class="detail-value">
                {creature?.armorClass ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Hit Points</span>
              <span id="hit-points" class="detail-value">
                {creature?.hitPoints ?? "—"}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Speed</span>
              <span id="speed" class="detail-value">
                {creature?.speed ?? "—"}
              </span>
            </div>
          </div>

          <div>
            <p class="section-title">Ability scores</p>
            <div class="abilities-grid">
              {Object.entries(abilityLabels).map(([key, label]) => (
                <div key={key} class="ability-card">
                  <span class="ability-label">{label}</span>
                  <span id={key as keyof typeof abilityLabels} class="ability-score">
                    {creature?.abilityScores[key as keyof typeof abilityLabels] ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p class="section-title">Special defense</p>
            <p id="special-defense" class="detail-value">
              {creature?.specialDefense ?? "—"}
            </p>
          </div>

          <div>
            <p class="section-title">Proficiencies</p>
            <div id="proficiencies">
              {creature?.proficiencies.length ? (
                creature.proficiencies.map((entry) => (
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

export const head = ({ params }: { params: Record<string, string> }) => {
  const identifier = decodeURIComponent(params.identifier ?? "");
  const title = identifier
    ? `Creature ${identifier} – RPG Creature Compendium - ${siteConfig.metadata.title}`
    : `Creature details - RPG Creature Compendium - ${siteConfig.metadata.title}`;
  return buildHead(title, "Detailed monster statistics sourced from the RPG Creature API.");
};
