import { afterEach, describe, expect, it, vi } from "vitest";
import { getNextDelay } from "./get-next-delay";

describe("getNextDelay", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a value between the inclusive bounds", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const result = getNextDelay(1000, 2000);
    expect(result).toBe(1500);
  });

  it("swaps min/max when provided in reverse", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = getNextDelay(2000, 1000);
    expect(result).toBe(1000);
  });

  it("returns 0 when bounds are not finite", () => {
    expect(getNextDelay(Number.NaN, Number.POSITIVE_INFINITY)).toBe(0);
  });

  it("returns the bound when both are equal", () => {
    expect(getNextDelay(1600, 1600)).toBe(1600);
  });
});
