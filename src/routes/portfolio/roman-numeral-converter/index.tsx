import {
  $, 
  component$,
  useComputed$,
  useSignal,
  useStylesScoped$,
} from "@builder.io/qwik";
import styles from "./roman-numeral.scss?inline";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const ROMAN_NUMERALS: ReadonlyArray<[string, number]> = [
  ["M", 1000],
  ["CM", 900],
  ["D", 500],
  ["CD", 400],
  ["C", 100],
  ["XC", 90],
  ["L", 50],
  ["XL", 40],
  ["X", 10],
  ["IX", 9],
  ["V", 5],
  ["IV", 4],
  ["I", 1],
];

type ConversionState = {
  status: "idle" | "invalid" | "valid";
  roman: string | null;
  decimal: number | null;
  message: string | null;
};

type ConversionHistoryEntry = {
  decimal: number;
  roman: string;
  timestamp: string;
};

const convertToRoman = (num: number) => {
  let remainder = Math.trunc(num);
  let result = "";

  for (const [roman, value] of ROMAN_NUMERALS) {
    while (remainder >= value) {
      result += roman;
      remainder -= value;
    }
  }

  return result;
};

const evaluateDecimalInput = (value: string): ConversionState => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      status: "idle",
      roman: null,
      decimal: null,
      message: "Enter an integer between 1 and 3,999 to preview the Roman numeral.",
    };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      status: "invalid",
      roman: null,
      decimal: null,
      message: "Only whole numbers are supported in this converter.",
    };
  }

  const decimal = Number.parseInt(trimmed, 10);
  if (Number.isNaN(decimal) || decimal < 1 || decimal > 3999) {
    return {
      status: "invalid",
      roman: null,
      decimal: null,
      message: "Choose a value from 1 to 3,999 — Roman numerals do not extend beyond that range.",
    };
  }

  return {
    status: "valid",
    roman: convertToRoman(decimal),
    decimal,
    message: "Ready to save this conversion to your history.",
  };
};

const BASIC_PAIRS: ReadonlyArray<[string, number]> = [
  ["I", 1],
  ["IV", 4],
  ["V", 5],
  ["IX", 9],
  ["X", 10],
  ["XL", 40],
  ["L", 50],
  ["XC", 90],
  ["C", 100],
  ["CD", 400],
  ["D", 500],
  ["CM", 900],
  ["M", 1000],
];

const formatTimestamp = (isoDate: string) => {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  } catch (error) {
    console.warn("Unable to format timestamp", error);
    return isoDate;
  }
};

export default component$(() => {
  useStylesScoped$(styles);

  const decimalInput = useSignal("36");
  const history = useSignal<ConversionHistoryEntry[]>([]);
  const conversion = useComputed$(() => evaluateDecimalInput(decimalInput.value));

  const handleSubmit = $((event: Event) => {
    event.preventDefault();
    const state = evaluateDecimalInput(decimalInput.value);
    if (state.status !== "valid" || !state.roman || state.decimal === null) {
      return;
    }

    const timestamp = new Date().toISOString();
    const filtered = history.value.filter((entry) => entry.decimal !== state.decimal);
    history.value = [
      { decimal: state.decimal, roman: state.roman, timestamp },
      ...filtered,
    ].slice(0, 6);
  });

  return (
    <div class="converter-page layout-shell">
      <section class="hero-card">
        <div class="hero-intro">
          <p class="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--primary)]">
            Roman Numeral Converter
          </p>
          <h1>Quickly translate decimal numbers into classical numerals.</h1>
          <p>
            A responsive utility inspired by coding interview warmups. Type any whole number between 1 and
            3,999 to see the additive and subtractive notation rendered instantly, then stash your favourite
            conversions for later reference.
          </p>
        </div>

        <div class="converter-shell">
          <article class="converter-card">
            <header>
              <h2>Live conversion</h2>
              <p>
                Preview the numeral as you type. Submit the form to add the translation to a personal history
                log, perfect for preparing slides, puzzles, or kata practice.
              </p>
            </header>

            <form class="converter-form" preventdefault:submit onSubmit$={handleSubmit}>
              <label for="decimal-input">Decimal value</label>
              <div class="converter-input-row">
                <input
                  id="decimal-input"
                  class="converter-input"
                  type="number"
                  min={1}
                  max={3999}
                  inputMode="numeric"
                  value={decimalInput.value}
                  onInput$={(_, element) => {
                    decimalInput.value = element.value;
                  }}
                  aria-describedby="decimal-feedback"
                  aria-invalid={conversion.value.status === "invalid"}
                  placeholder="e.g. 2024"
                />
                <button
                  type="submit"
                  class="converter-button"
                  disabled={conversion.value.status !== "valid"}
                >
                  Save conversion
                </button>
              </div>
            </form>

            <div class="converter-output" aria-live="polite">
              {conversion.value.status === "valid" && conversion.value.roman ? (
                <>
                  <strong>{conversion.value.roman}</strong>
                  <span>Roman numeral</span>
                </>
              ) : (
                <>
                  <strong>—</strong>
                  <span>Waiting for input</span>
                </>
              )}
            </div>

            {conversion.value.message && (
              <p
                id="decimal-feedback"
                class="feedback"
                data-state={conversion.value.status}
              >
                {conversion.value.message}
              </p>
            )}
          </article>

          <article class="converter-card">
            <header>
              <h2>Recent history</h2>
              <p>
                The converter stores your six most recent submissions, deduplicated by decimal value. Each
                entry includes a timestamp from your current locale.
              </p>
            </header>
            {history.value.length === 0 ? (
              <p class="feedback" data-state="idle">
                Try saving a conversion to build a quick-reference list.
              </p>
            ) : (
              <ol class="history-list">
                {history.value.map((entry) => (
                  <li key={entry.decimal} class="history-item">
                    <div class="history-item-header">
                      <span aria-label={`Decimal value ${entry.decimal}`}>{entry.decimal}</span>
                      <time dateTime={entry.timestamp}>{formatTimestamp(entry.timestamp)}</time>
                    </div>
                    <strong aria-label={`Roman numeral ${entry.roman}`}>{entry.roman}</strong>
                  </li>
                ))}
              </ol>
            )}
          </article>
        </div>
      </section>

      <aside class="legend-card">
        <header>
          <h2>Roman building blocks</h2>
          <p class="text-sm text-[var(--text3)]">
            The converter uses a greedy algorithm built on standard subtractive pairs. Each symbol is paired
            with the decimal value it represents.
          </p>
        </header>
        <div class="legend-grid">
          {BASIC_PAIRS.map(([symbol, value]) => (
            <span key={symbol}>
              <strong>{symbol}</strong>
              <small>{value}</small>
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
});

export const head = buildHead(
  `Roman Numeral Converter - ${siteConfig.metadata.title}`,
  "Interactive Roman numeral converter with live preview, validation, and history log.",
);
