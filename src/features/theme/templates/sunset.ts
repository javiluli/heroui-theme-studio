import type { ThemeTemplate } from './types';

/** Bright coral and warm sunset tones. Only official HeroUI v3 CSS tokens are defined. */
export const sunset = {
  name: "sunset",
  label: "Sunset",
  description: "Bright coral and warm sunset tones",
  value: {
    light: {
      accent: "#C44965",
      "accent-foreground": "#FFFFFF",
      focus: "#C44965",
      background: "#FFF9F8",
      foreground: "#37212B",
      muted: "#826670",
      surface: "#FFFFFF",
      "surface-foreground": "#37212B",
      "surface-secondary": "#FDEBED",
      "surface-secondary-foreground": "#37212B",
      "surface-tertiary": "#F7DBE1",
      "surface-tertiary-foreground": "#37212B",
      border: "#EDCBD3",
      separator: "#EDCBD3",
      scrollbar: "#EDCBD3",
      default: "#F7DBE1",
      "default-foreground": "#37212B",
      "field-background": "#FFFFFF",
      "field-foreground": "#37212B",
      "field-placeholder": "#826670",
      overlay: "#FFFFFF",
      "overlay-foreground": "#37212B",
      segment: "#FFFFFF",
      "segment-foreground": "#37212B"
    },
    dark: {
      accent: "#FFA7B2",
      "accent-foreground": "#4A1D2B",
      focus: "#FFA7B2",
      background: "#221319",
      foreground: "#FFF0F1",
      muted: "#D4B4BD",
      surface: "#321E26",
      "surface-foreground": "#FFF0F1",
      "surface-secondary": "#422934",
      "surface-secondary-foreground": "#FFF0F1",
      "surface-tertiary": "#503441",
      "surface-tertiary-foreground": "#FFF0F1",
      border: "#664653",
      separator: "#664653",
      scrollbar: "#664653",
      default: "#503441",
      "default-foreground": "#FFF0F1",
      "field-background": "#39252E",
      "field-foreground": "#FFF0F1",
      "field-placeholder": "#D4B4BD",
      overlay: "#321E26",
      "overlay-foreground": "#FFF0F1",
      segment: "#60404D",
      "segment-foreground": "#FFF0F1"
    },
    layout: {
      radius: 14,
      fieldRadius: 16
    }
  }
} as const satisfies ThemeTemplate;
