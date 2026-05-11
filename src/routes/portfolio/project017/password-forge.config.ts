export const MIN_LENGTH = 12;
export const MAX_LENGTH = 40;
export const DEFAULT_LENGTH = 16;
export const COPY_RESET_DELAY = 2400;

export const PASSWORD_CHARACTER_SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:',.<>?/`~\\\"",
} as const;

export const DEFAULT_PASSWORD_OPTIONS = {
  length: DEFAULT_LENGTH,
  includeUpper: true,
  includeLower: true,
  includeDigits: true,
  includeSymbols: true,
} as const;
