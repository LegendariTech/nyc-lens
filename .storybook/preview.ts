import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'hsl(0 0% 13%)',
        },
        {
          name: 'light',
          value: 'hsl(0 0% 100%)',
        },
      ],
    },

    // Set dark theme for docs page
    docs: {
      theme: {
        base: 'dark',
        colorPrimary: 'hsl(142 71% 45%)',
        colorSecondary: 'hsl(142 71% 45%)',

        // UI
        appBg: 'hsl(0 0% 13%)',
        appContentBg: 'hsl(0 0% 13%)',
        appBorderColor: 'hsl(0 0% 22%)',
        appBorderRadius: 8,

        // Typography
        fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontCode: 'monospace',

        // Text colors
        textColor: 'hsl(0 0% 93%)',
        textInverseColor: 'hsl(0 0% 13%)',
        textMutedColor: 'hsl(0 0% 60%)',

        // Toolbar default and active colors
        barTextColor: 'hsl(0 0% 93%)',
        barSelectedColor: 'hsl(142 71% 45%)',
        barBg: 'hsl(0 0% 9.41%)',

        // Form colors
        inputBg: 'hsl(0 0% 18%)',
        inputBorder: 'hsl(0 0% 22%)',
        inputTextColor: 'hsl(0 0% 93%)',
        inputBorderRadius: 6,
      },
    },
  },
};

export default preview;