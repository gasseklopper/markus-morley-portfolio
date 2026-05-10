export const MIN_LENGTH = 12;

const ASCII_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ASCII_LOWER = "abcdefghijklmnopqrstuvwxyz";
const ASCII_DIGITS = "0123456789";
const ASCII_SYMBOLS = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~\\\"";
const MAX_UINT32_EXCLUSIVE = 0x100000000;

export type CharacterSetName = "upper" | "lower" | "digits" | "symbols";

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

  if (includeUpper) activeSets.push(ASCII_UPPER);
  if (includeLower) activeSets.push(ASCII_LOWER);
  if (includeDigits) activeSets.push(ASCII_DIGITS);
  if (includeSymbols) activeSets.push(ASCII_SYMBOLS);

  const setsToUse =
    activeSets.length > 0 ? activeSets : [ASCII_UPPER, ASCII_DIGITS];
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
