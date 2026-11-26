import type { ThemeTemplate } from './types';

// https://v2.heroui.com/docs/customization/colors
// https://github.com/heroui-inc/heroui/blob/v2/packages/core/theme/src/colors/semantic.ts
const sharedColors = {
  accent: '#006FEE',
  'accent-foreground': '#FFFFFF',
  focus: '#006FEE',
  link: '#006FEE', // Link defaults to primary.
  success: '#17C964',
  'success-foreground': '#000000',
  warning: '#F5A524',
  'warning-foreground': '#000000',
  danger: '#F31260',
  'danger-foreground': '#FFFFFF',
  backdrop: 'rgba(0, 0, 0, 0.5)', // Default modal backdrop: overlay at 50%.
};

// content1 supplies both surface and overlay in the v3 migration guide.
// Field colors follow Input (flat); segment colors follow Tabs (solid).
// Muted and scrollbar-thumb inherit v3. The flat Input has no border.
export const heroV2 = {
  name: 'hero-v2',
  label: 'Hero V2 (NextUI Legacy)',
  value: {
    light: {
      ...sharedColors,
      default: '#D4D4D8',
      'default-foreground': '#000000',
      background: '#FFFFFF',
      foreground: '#11181C',
      surface: '#FFFFFF',
      'surface-foreground': '#11181C',
      'surface-secondary': '#F4F4F5',
      'surface-secondary-foreground': '#27272A',
      'surface-tertiary': '#E4E4E7',
      'surface-tertiary-foreground': '#3F3F46',
      overlay: '#FFFFFF',
      'overlay-foreground': '#11181C',
      'field-background': '#F4F4F5',
      'field-foreground': '#000000',
      'field-placeholder': '#71717A',
      border: 'rgba(17, 17, 17, 0.15)',
      separator: 'rgba(17, 17, 17, 0.15)',
      segment: '#FFFFFF',
      'segment-foreground': '#000000',
    },
    dark: {
      ...sharedColors,
      default: '#3F3F46',
      'default-foreground': '#FFFFFF',
      background: '#000000',
      foreground: '#ECEDEE',
      surface: '#18181B',
      'surface-foreground': '#FAFAFA',
      'surface-secondary': '#27272A',
      'surface-secondary-foreground': '#F4F4F5',
      'surface-tertiary': '#3F3F46',
      'surface-tertiary-foreground': '#E4E4E7',
      overlay: '#18181B',
      'overlay-foreground': '#FAFAFA',
      'field-background': '#27272A',
      'field-foreground': '#FFFFFF',
      'field-placeholder': '#A1A1AA',
      border: 'rgba(255, 255, 255, 0.15)',
      separator: 'rgba(255, 255, 255, 0.15)',
      segment: '#3F3F46',
      'segment-foreground': '#FFFFFF',
    },
  },
} as const satisfies ThemeTemplate;
