export const featureFlags = {
  konzept: import.meta.env.PUBLIC_FEATURE_KONZEPT === "true",
};

export type FeatureFlag = keyof typeof featureFlags;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return featureFlags[flag];
};

export const isKonzeptEnabled = () => featureFlags.konzept;
