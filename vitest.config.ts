import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
});


