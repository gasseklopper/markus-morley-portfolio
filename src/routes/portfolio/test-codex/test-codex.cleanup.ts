export const cleanupTestCodexAnimations = (
  ctx: { revert: () => void },
  cleanupListeners: () => void,
) => {
  cleanupListeners();
  ctx.revert();
};
