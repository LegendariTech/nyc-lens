import { themeQuartz } from 'ag-grid-community';

// Convert global CSS tokens to hex for ag-grid
// --background: 0 0% 13% → hsl(0, 0%, 13%) → #212121
// --foreground: 0 0% 93% → hsl(0, 0%, 93%) → #ededed
export const myTheme = themeQuartz.withParams({
  backgroundColor: "#212121",
  browserColorScheme: "dark",
  chromeBackgroundColor: {
    ref: "foregroundColor",
    mix: 0.07,
    onto: "backgroundColor"
  },
  foregroundColor: "#ededed",
  headerFontSize: 14
});


