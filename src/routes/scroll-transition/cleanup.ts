export const cleanupScrollTransition = (
  cleanupListeners: () => void,
  removeTicker: () => void,
  killProgress: () => void,
  killMaster: () => void,
  killRootTriggers: () => void,
  destroyLenis: () => void,
) => {
  cleanupListeners();
  removeTicker();
  killProgress();
  killMaster();
  killRootTriggers();
  destroyLenis();
};
