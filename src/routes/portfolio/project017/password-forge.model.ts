import { MIN_LENGTH, PASSWORD_CHARACTER_SETS } from "./password-forge.config";

const MAX_UINT32_EXCLUSIVE = 0x100000000;

export type CharacterSetName = keyof typeof PASSWORD_CHARACTER_SETS;

export type PasswordOptions = {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeDigits: boolean;
  includeSymbols: boolean;
};

export const getActiveCharacterSetCount = ({
  includeUpper,
  includeLower,
  includeDigits,
  includeSymbols,
}: PasswordOptions) =>
  [includeUpper, includeLower, includeDigits, includeSymbols].filter(Boolean)
    .length;

export const coercePasswordLength = (value: number) =>
  Number.isNaN(value) ? MIN_LENGTH : Math.max(MIN_LENGTH, value);

export const createPasswordOptions = (
  current: PasswordOptions,
  setName: CharacterSetName,
  enabled: boolean,
): PasswordOptions => ({
  ...current,
  includeUpper: setName === "upper" ? enabled : current.includeUpper,
  includeLower: setName === "lower" ? enabled : current.includeLower,
  includeDigits: setName === "digits" ? enabled : current.includeDigits,
  includeSymbols: setName === "symbols" ? enabled : current.includeSymbols,
});

const secureRandomInt = (upperBound: number) => {
  if (upperBound <= 0) return 0;
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi || !cryptoApi.getRandomValues) {
    throw new Error("Secure random generator unavailable");
  }

  const rangeLimit = Math.floor(MAX_UINT32_EXCLUSIVE / upperBound) * upperBound;
  const buffer = new Uint32Array(1);

  let randomValue = 0;
  do {
    cryptoApi.getRandomValues(buffer);
    randomValue = buffer[0] ?? 0;
  } while (randomValue >= rangeLimit);

  return randomValue % upperBound;
};

const shuffleCharacters = (chars: string[]) => {
  for (let index = chars.length - 1; index > 0; index--) {
    const randomIndex = secureRandomInt(index + 1);
    [chars[index], chars[randomIndex]] = [chars[randomIndex], chars[index]];
  }
  return chars.join("");
};

export const createPassword = ({
  length,
  includeUpper,
  includeLower,
  includeDigits,
  includeSymbols,
}: PasswordOptions) => {
  const activeSets: string[] = [];

  if (includeUpper) activeSets.push(PASSWORD_CHARACTER_SETS.upper);
  if (includeLower) activeSets.push(PASSWORD_CHARACTER_SETS.lower);
  if (includeDigits) activeSets.push(PASSWORD_CHARACTER_SETS.digits);
  if (includeSymbols) activeSets.push(PASSWORD_CHARACTER_SETS.symbols);

  const setsToUse =
    activeSets.length > 0
      ? activeSets
      : [PASSWORD_CHARACTER_SETS.upper, PASSWORD_CHARACTER_SETS.digits];
  const guaranteedCharacters = setsToUse.map((set) => {
    const randomIndex = secureRandomInt(set.length);
    return set[randomIndex] ?? "";
  });

  const pool = setsToUse.join("");
  const remainingCharacters: string[] = [];
  const targetLength = Math.max(MIN_LENGTH, length);

  for (let index = guaranteedCharacters.length; index < targetLength; index++) {
    const randomIndex = secureRandomInt(pool.length);
    remainingCharacters.push(pool[randomIndex] ?? "");
  }

  return shuffleCharacters([...guaranteedCharacters, ...remainingCharacters]);
};
