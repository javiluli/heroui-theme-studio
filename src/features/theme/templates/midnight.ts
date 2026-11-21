import type { ThemeTemplate } from './types';

/** Midnight blue and high contrast. Only official HeroUI v3 CSS tokens are defined. */
export const midnight = {
  name: "midnight",
  label: "Midnight",
  description: "Midnight blue and high contrast",
  value: {
    light: {
      accent: "#3459AB",
      "accent-foreground": "#FFFFFF",
      focus: "#3459AB",
      background: "#F7F8FD",
      foreground: "#182342",
      muted: "#576586",
      surface: "#FFFFFF",
      "surface-foreground": "#182342",
      "surface-secondary": "#E9EDF8",
      "surface-secondary-foreground": "#182342",
      "surface-tertiary": "#DEE6F5",
      "surface-tertiary-foreground": "#182342",
      border: "#CAD4EA",
      separator: "#CAD4EA",
      scrollbar: "#CAD4EA",
      default: "#DEE6F5",
      "default-foreground": "#182342",
      "field-background": "#FFFFFF",
      "field-foreground": "#182342",
      "field-placeholder": "#576586",
      overlay: "#FFFFFF",
      "overlay-foreground": "#182342",
      segment: "#FFFFFF",
      "segment-foreground": "#182342"
    },
    dark: {
      accent: "#91B5FF",
      "accent-foreground": "#102041",
      focus: "#91B5FF",
      background: "#090E1C",
      foreground: "#F4F7FF",
      muted: "#A3B0CF",
      surface: "#141C30",
      "surface-foreground": "#F4F7FF",
      "surface-secondary": "#1C2840",
      "surface-secondary-foreground": "#F4F7FF",
      "surface-tertiary": "#263550",
      "surface-tertiary-foreground": "#F4F7FF",
      border: "#374765",
      separator: "#374765",
      scrollbar: "#374765",
      default: "#263550",
      "default-foreground": "#F4F7FF",
      "field-background": "#19263A",
      "field-foreground": "#F4F7FF",
      "field-placeholder": "#A3B0CF",
      overlay: "#141C30",
      "overlay-foreground": "#F4F7FF",
      segment: "#30425E",
      "segment-foreground": "#F4F7FF"
    },
    layout: {
      radius: 8,
      fieldRadius: 10
    }
  }
} as const satisfies ThemeTemplate;
