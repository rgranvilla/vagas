/// <reference types="vitest" />
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  optimizeDeps: {
    include: ["reflect-metadata"],
  },
  test: {
    singleThread: true,
    coverage: {
      provider: "istanbul",
      reportsDirectory: "src/tests/coverage/",
      reporter: ["text", "json", "html"],
    },
  },
});
