# Storybook Setup

Storybook is now configured for your BBL Club project! 🎉

## What is Storybook?

Storybook is a development environment for UI components. It allows you to:
- Develop components in isolation
- Test different states and variants
- Document component APIs
- Check accessibility (a11y) compliance
- Share components with your team

## Running Storybook

### Start the development server:
```bash
npm run storybook
```

This will start Storybook on **http://localhost:6006**

### Build static Storybook:
```bash
npm run build-storybook
```

This creates a static build in `storybook-static/` that you can deploy.

## Current Setup

### ✅ Configured Features:
- **Next.js Integration** - Works with your Next.js App Router setup
- **Tailwind CSS** - Your global styles and theme are loaded
- **Vite** - Fast HMR and build times
- **Accessibility Testing** - Built-in a11y checks with `@storybook/addon-a11y`
- **Documentation** - Auto-generated docs from your stories
- **Dark Theme** - Storybook UI and Docs page use dark theme matching your app
- **Background Switcher** - Test components on light/dark backgrounds

### 📁 File Structure:
```
.storybook/
├── main.ts          # Main configuration
├── preview.ts       # Global decorators and parameters
└── vitest.setup.ts  # Vitest integration

src/
├── components/
│   └── ui/
│       ├── Switch.tsx         # Component
│       └── Switch.stories.tsx # Stories
└── stories/         # Example stories from Storybook
```

## Creating Stories

### Story Format (CSF 3.0):

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'UI/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'primary',
  },
};

export const WithCustomRender: Story = {
  render: (args) => (
    <div className="p-4">
      <YourComponent {...args} />
    </div>
  ),
};
```

## Switch Component Example

Your Switch component already has a complete story file at:
`src/components/ui/Switch.stories.tsx`

It includes:
- ✅ All size variants (sm, md, lg)
- ✅ Checked/unchecked states
- ✅ Disabled states
- ✅ With label examples
- ✅ Form examples
- ✅ Size comparison

## Tips

### 1. **Organize Stories by Category**
Use the `title` field to organize:
```tsx
title: 'UI/Switch'        // UI category
title: 'Forms/Input'      // Forms category
title: 'Layout/Header'    // Layout category
```

### 2. **Use Controls**
Controls let you interact with component props in real-time:
```tsx
argTypes: {
  size: {
    control: 'select',
    options: ['sm', 'md', 'lg'],
  },
  disabled: {
    control: 'boolean',
  },
}
```

### 3. **Test Accessibility**
Click the "Accessibility" tab in Storybook to see a11y violations.

### 4. **Document Your Components**
Add JSDoc comments to your component props - they'll show up in the Docs tab:
```tsx
interface Props {
  /** Size variant of the component */
  size?: 'sm' | 'md' | 'lg';
}
```

### 5. **Use Backgrounds Addon**
Switch between light/dark backgrounds using the toolbar button.

### 6. **Dark Theme by Default**
Storybook is configured with a dark theme to match your app:
- **Canvas view** - Dark background by default
- **Docs page** - Dark theme for better component visibility
- **UI colors** - Match your HSL color tokens
- All configured in `.storybook/preview.ts`

## Next Steps

1. **Create more stories** - Add stories for other components
2. **Clean up examples** - Delete the `src/stories/` folder if you don't need the examples
3. **Share with team** - Deploy Storybook to share with designers/developers
4. **CI Integration** - Add visual regression testing with Chromatic

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Story Format (CSF)](https://storybook.js.org/docs/api/csf)
- [Next.js Integration](https://storybook.js.org/docs/get-started/frameworks/nextjs)
- [Accessibility Testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)

## Troubleshooting

### Port already in use?
```bash
npm run storybook -- -p 6007
```

### Styles not loading?
Make sure `globals.css` is imported in `.storybook/preview.ts`

### Component not found?
Check that your story file matches the pattern in `.storybook/main.ts`:
```
"../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
```

---

Happy component development! 🚀

