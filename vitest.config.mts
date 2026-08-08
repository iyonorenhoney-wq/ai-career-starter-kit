import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    // 採点ロジックはブラウザAPIに依存しないため node 環境で十分
    environment: "node",
    include: ["lib/__tests__/**/*.test.ts"],
  },
});
