// @ts-nocheck
import { defineConfig } from "cypress";
import { rm } from "node:fs/promises";

const runArtifactFolders = ["cypress/screenshots", "cypress/videos"];

export default defineConfig({
  trashAssetsBeforeRuns: false,
  component: {
    setupNodeEvents(on) {
      on("before:run", async () => {
        await Promise.all(
          runArtifactFolders.map((folder) =>
            rm(folder, { force: true, recursive: true }),
          ),
        );
      });
    },
    devServer: {
      framework: "cypress-ct-qwik",
      bundler: "vite",
    },
  },
});
