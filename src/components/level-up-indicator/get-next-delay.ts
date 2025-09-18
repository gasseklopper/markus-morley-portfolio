/**
 * Returns the next randomized delay between the provided bounds.
 * Bounds are normalized so `min` <= `max` and clamped to >= 0.
 */
export const getNextDelay = (min: number, max: number): number => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return 0;
  }
  const low = Math.max(0, Math.min(min, max));
  const high = Math.max(Math.max(min, max), low);
  if (high === low) {
    return low;
  }
  return low + Math.random() * (high - low);
};

export default getNextDelay;
