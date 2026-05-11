export const FCC_TEST_SCRIPT_ID = "fcc-testable-projects";
export const FCC_TEST_SCRIPT_SRC = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";

type FccTestSuiteApi = {
  destroy?: () => void;
  close?: () => void;
  removeUI?: () => void;
  unload?: () => void;
  unmount?: () => void;
};

const clearFccStorage = (storage: Storage) => {
  for (let index = storage.length - 1; index >= 0; index--) {
    const key = storage.key(index);

    if (!key) {
      continue;
    }

    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes("fcc") ||
      normalizedKey.includes("freecodecamp") ||
      normalizedKey.includes("testable-project")
    ) {
      storage.removeItem(key);
    }
  }
};

export const resetFccTestSuiteUI = () => {
  const globalWindow = window as typeof window & {
    __fccTestSuite?: FccTestSuiteApi | undefined;
  };

  const runner = globalWindow.__fccTestSuite;
  runner?.destroy?.();
  runner?.removeUI?.();
  runner?.close?.();
  runner?.unload?.();
  runner?.unmount?.();

  document
    .querySelectorAll<HTMLElement>('[id^="fcc_test_suite"]')
    .forEach((node) => node.remove());

  clearFccStorage(window.localStorage);
  clearFccStorage(window.sessionStorage);

  globalWindow.__fccTestSuite = undefined;
};
