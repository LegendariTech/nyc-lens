import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname as pathDirname, resolve } from "node:path";
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
export default defineConfig({
  test: {
    // Global test config (will be inherited by projects)
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    globals: true,
    env: {
      TZ: 'UTC'
    },
    projects: [
      {
        resolve: {
          alias: {
            "@": resolve(__dirname, "src")
          }
        },
        test: {
          name: 'unit',
          environment: "happy-dom",
          setupFiles: ["./vitest.setup.ts"],
          css: true,
          globals: true,
          include: ["src/**/*.test.{ts,tsx}"],
          env: {
            TZ: 'UTC'
          }
        }
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          // Note: The plugin automatically handles test discovery from Storybook's "stories" config
          storybookTest({
            configDir: path.join(__dirname, '.storybook')
          })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
          // No 'include' needed - storybookTest plugin handles this automatically
        }
      }
    ]
  }
});