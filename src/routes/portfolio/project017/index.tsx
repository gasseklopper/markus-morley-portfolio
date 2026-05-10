import { $, component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./password-forge.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import {
  type CharacterSetName,
  MIN_LENGTH,
  createPassword,
  getActiveCharacterSetCount,
} from "./password-forge-model";

type CopyState = "idle" | "copied" | "error";

export default component$(() => {
  useStylesScoped$(styles);

  const length = useSignal(16);
  const includeUpper = useSignal(true);
  const includeLower = useSignal(true);
  const includeDigits = useSignal(true);
  const includeSymbols = useSignal(true);
  const password = useSignal("");
  const copyState = useSignal<CopyState>("idle");
  const toggleWarning = useSignal<string | null>(null);

  const handleLengthChange = $((event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const parsed = Number.parseInt(input.value, 10);
    const safeValue = Number.isNaN(parsed)
      ? MIN_LENGTH
      : Math.max(MIN_LENGTH, parsed);
    length.value = safeValue;
    password.value = createPassword({
      length: length.value,
      includeUpper: includeUpper.value,
      includeLower: includeLower.value,
      includeDigits: includeDigits.value,
      includeSymbols: includeSymbols.value,
    });
    copyState.value = "idle";
  });

  const handleCharacterSetToggle = $(
    (event: Event, setName: CharacterSetName) => {
      const input = event.target as HTMLInputElement | null;
      if (!input) return;

      const nextOptions = {
        length: length.value,
        includeUpper: setName === "upper" ? input.checked : includeUpper.value,
        includeLower: setName === "lower" ? input.checked : includeLower.value,
        includeDigits:
          setName === "digits" ? input.checked : includeDigits.value,
        includeSymbols:
          setName === "symbols" ? input.checked : includeSymbols.value,
      };

      if (getActiveCharacterSetCount(nextOptions) === 0) {
        toggleWarning.value = "Keep at least one character set active.";
        input.checked = true;
        return;
      }

      toggleWarning.value = null;
      includeUpper.value = nextOptions.includeUpper;
      includeLower.value = nextOptions.includeLower;
      includeDigits.value = nextOptions.includeDigits;
      includeSymbols.value = nextOptions.includeSymbols;
      password.value = createPassword(nextOptions);
      copyState.value = "idle";
    },
  );

  const regenerate = $(() => {
    password.value = createPassword({
      length: length.value,
      includeUpper: includeUpper.value,
      includeLower: includeLower.value,
      includeDigits: includeDigits.value,
      includeSymbols: includeSymbols.value,
    });
    copyState.value = "idle";
  });

  if (!password.value) {
    password.value = createPassword({
      length: length.value,
      includeUpper: includeUpper.value,
      includeLower: includeLower.value,
      includeDigits: includeDigits.value,
      includeSymbols: includeSymbols.value,
    });
  }

  const handleCopy = $(async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(password.value);
      copyState.value = "copied";
      window.setTimeout(() => {
        copyState.value = "idle";
      }, 2400);
    } catch (error) {
      console.error("Clipboard copy failed", error);
      copyState.value = "error";
    }
  });

  return (
    <div class="brutal-page">
      <section class="hero">
        <div class="hero__badge">Project 017</div>
        <h1 class="hero__title">ASCII Password Forge</h1>
        <p class="hero__lead">
          A brutalist utility that forges uncompromising ASCII passwords. Built
          for teams that want a tactile, trustworthy security ritual.
        </p>
        <dl class="hero__meta">
          <div>
            <dt>Discipline</dt>
            <dd>Frontend Engineering</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>Security UX &amp; micro-interactions</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>Qwik, Modern CSS</dd>
          </div>
        </dl>
      </section>

      <section class="generator" aria-labelledby="password-forge">
        <header class="generator__header">
          <h2 id="password-forge">Generate resilient credentials</h2>
          <p>
            Toggle the ingredients, set your length, and carve out a password
            with at least twelve ASCII characters. Copy happens instantly.
          </p>
        </header>

        <div class="generator__panel">
          <div class="password-display" aria-live="polite">
            <span
              class="password-display__value"
              aria-label="Generated password"
            >
              {password.value}
            </span>
            <div class="password-display__actions">
              <button
                type="button"
                class="password-display__copy"
                onClick$={handleCopy}
              >
                Copy
              </button>
              <span
                class={`copy-state copy-state--${copyState.value}`}
                aria-live="assertive"
              >
                {copyState.value === "copied"
                  ? "Copied to clipboard."
                  : copyState.value === "error"
                    ? "Clipboard blocked — copy manually."
                    : ""}
              </span>
            </div>
          </div>
          <div class="generator__controls">
            <label class="control control--range">
              <span>Password length</span>
              <div class="control__range">
                <input
                  type="range"
                  min={MIN_LENGTH}
                  max={40}
                  value={length.value}
                  onInput$={handleLengthChange}
                  aria-valuemin={MIN_LENGTH}
                  aria-valuemax={40}
                  aria-valuenow={length.value}
                />
                <output>{length.value}</output>
              </div>
            </label>

            <fieldset class="control-grid" aria-describedby="toggle-warning">
              <legend>Character sets</legend>
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  checked={includeUpper.value}
                  onChange$={(event) =>
                    handleCharacterSetToggle(event, "upper")
                  }
                />
                <span>Uppercase</span>
              </label>
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  checked={includeLower.value}
                  onChange$={(event) =>
                    handleCharacterSetToggle(event, "lower")
                  }
                />
                <span>Lowercase</span>
              </label>
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  checked={includeDigits.value}
                  onChange$={(event) =>
                    handleCharacterSetToggle(event, "digits")
                  }
                />
                <span>Digits</span>
              </label>
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  checked={includeSymbols.value}
                  onChange$={(event) =>
                    handleCharacterSetToggle(event, "symbols")
                  }
                />
                <span>Symbols</span>
              </label>
            </fieldset>
            <p
              id="toggle-warning"
              class="control__warning"
              role="status"
              aria-live="polite"
            >
              {toggleWarning.value}
            </p>
          </div>
          <div class="generator__actions">
            <button
              type="button"
              class="button button--primary"
              onClick$={regenerate}
            >
              Forge another password
            </button>
          </div>
        </div>
      </section>

      <section class="details" aria-labelledby="brutal-details">
        <h2 id="brutal-details">Why this matters</h2>
        <div class="details__grid">
          <article>
            <h3>Minimum strength baked in</h3>
            <p>
              Every password respects the twelve character floor and ensures
              balanced representation from each active character set. The forge
              rejects weak mixes so teams can deliver secure defaults without
              thinking twice.
            </p>
          </article>
          <article>
            <h3>Clipboard ritual</h3>
            <p>
              The copy trigger flashes feedback the moment the password hits
              your clipboard. No extra dialogs, no second guessing—just press
              once and paste where it matters.
            </p>
          </article>
          <article>
            <h3>Bold brutal aesthetic</h3>
            <p>
              The interface leans on oversized typography, vivid gradients, and
              industrial textures that celebrate utility. It is unapologetically
              loud, guiding attention directly to the generator.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
});

export const head = buildHead(
  "Project 017 - Markus Morley personal portfolio",
  `${siteConfig.metadata.title} — Brutalist password generator with clipboard copy actions and a minimum length of twelve ASCII characters.`,
);
