export type ConversionState = {
  status: "idle" | "invalid" | "valid";
  roman: string | null;
  decimal: number | null;
  message: string | null;
};

export type ConversionHistoryEntry = {
  decimal: number;
  roman: string;
  timestamp: string;
};

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

export const BASIC_PAIRS: ReadonlyArray<[string, number]> = [
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

export const convertToRoman = (num: number) => {
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

export const evaluateDecimalInput = (value: string): ConversionState => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      status: "idle",
      roman: null,
      decimal: null,
      message:
        "Enter an integer between 1 and 3,999 to preview the Roman numeral.",
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
      message:
        "Choose a value from 1 to 3,999 — Roman numerals do not extend beyond that range.",
    };
  }

  return {
    status: "valid",
    roman: convertToRoman(decimal),
    decimal,
    message: "Ready to save this conversion to your history.",
  };
};

export const formatTimestamp = (isoDate: string) => {
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

export const saveConversion = (
  history: readonly ConversionHistoryEntry[],
  entry: ConversionHistoryEntry,
) => {
  const filtered = history.filter((item) => item.decimal !== entry.decimal);
  return [entry, ...filtered].slice(0, 6);
};
