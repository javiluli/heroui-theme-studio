import type { ThemeTemplate } from './types';

/** Deep forest green and earthy tones. Only official HeroUI v3 CSS tokens are defined. */
export const forest = {
  name: "forest",
  label: "Forest",
  description: "Deep forest green and earthy tones",
  value: {
    light: {
      accent: "#19856C",
      "accent-foreground": "#FFFFFF",
      focus: "#19856C",
      background: "#F6FBF8",
      foreground: "#1A3027",
      muted: "#597466",
      surface: "#FFFFFF",
      "surface-foreground": "#1A3027",
      "surface-secondary": "#E9F4EC",
      "surface-secondary-foreground": "#1A3027",
      "surface-tertiary": "#DDEBE1",
      "surface-tertiary-foreground": "#1A3027",
      border: "#C5DED0",
      separator: "#C5DED0",
      scrollbar: "#C5DED0",
      default: "#DDEBE1",
      "default-foreground": "#1A3027",
      "field-background": "#FFFFFF",
      "field-foreground": "#1A3027",
      "field-placeholder": "#597466",
      overlay: "#FFFFFF",
      "overlay-foreground": "#1A3027",
      segment: "#FFFFFF",
      "segment-foreground": "#1A3027"
    },
    dark: {
      accent: "#80D9AF",
      "accent-foreground": "#103A2C",
      focus: "#80D9AF",
      background: "#0D1B16",
      foreground: "#F2F9F4",
      muted: "#ACC4B6",
      surface: "#1A2A22",
      "surface-foreground": "#F2F9F4",
      "surface-secondary": "#24392D",
      "surface-secondary-foreground": "#F2F9F4",
      "surface-tertiary": "#2D4637",
      "surface-tertiary-foreground": "#F2F9F4",
      border: "#385848",
      separator: "#385848",
      scrollbar: "#385848",
      default: "#2D4637",
      "default-foreground": "#F2F9F4",
      "field-background": "#1B3227",
      "field-foreground": "#F2F9F4",
      "field-placeholder": "#ACC4B6",
      overlay: "#1A2A22",
      "overlay-foreground": "#F2F9F4",
      segment: "#355441",
      "segment-foreground": "#F2F9F4"
    },
    layout: {
      radius: 12,
      fieldRadius: 14
    }
  }
} as const satisfies ThemeTemplate;
