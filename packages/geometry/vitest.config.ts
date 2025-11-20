import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@tessera/math": new URL("../math/src/index.ts", import.meta.url).pathname,
    },
  },
});

