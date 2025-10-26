export const FCC_TEST_SCRIPT_ID = "fcc-testable-projects";
export const FCC_TEST_SCRIPT_SRC = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";

type FccTestSuiteApi = {
  destroy?: () => void;
  close?: () => void;
  removeUI?: () => void;
  unload?: () => void;
  unmount?: () => void;
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

  globalWindow.__fccTestSuite = undefined;
};
