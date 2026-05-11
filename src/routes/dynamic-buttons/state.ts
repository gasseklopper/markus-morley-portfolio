export type DynamicButtonsState = {
  wiggles: Array<{ kill: () => void }>;
};

export const createDynamicButtonsState = (): DynamicButtonsState => ({
  wiggles: [],
});
