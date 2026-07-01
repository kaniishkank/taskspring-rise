import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/dist/**"],
    // Run tests sequentially to prevent concurrent pooler connection flooding
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
