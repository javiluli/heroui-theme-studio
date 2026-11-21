import type { ThemeTemplate } from './types';

/** Cool emerald and bright neutrals. Only official HeroUI v3 CSS tokens are defined. */
export const emerald = {
  name: "emerald",
  label: "Emerald",
  description: "Cool emerald and bright neutrals",
  value: {
    light: {
      accent: "#137D58",
      "accent-foreground": "#FFFFFF",
      focus: "#137D58",
      background: "#F4FFF9",
      foreground: "#143A2D",
      muted: "#587767",
      surface: "#FFFFFF",
      "surface-foreground": "#143A2D",
      "surface-secondary": "#E5F9EB",
      "surface-secondary-foreground": "#143A2D",
      "surface-tertiary": "#D8F3E2",
      "surface-tertiary-foreground": "#143A2D",
      border: "#BCE5CF",
      separator: "#BCE5CF",
      scrollbar: "#BCE5CF",
      default: "#D8F3E2",
      "default-foreground": "#143A2D",
      "field-background": "#FFFFFF",
      "field-foreground": "#143A2D",
      "field-placeholder": "#587767",
      overlay: "#FFFFFF",
      "overlay-foreground": "#143A2D",
      segment: "#FFFFFF",
      "segment-foreground": "#143A2D"
    },
    dark: {
      accent: "#55D69E",
      "accent-foreground": "#092F1E",
      focus: "#55D69E",
      background: "#071A12",
      foreground: "#EDFFF4",
      muted: "#A6CCB6",
      surface: "#132D20",
      "surface-foreground": "#EDFFF4",
      "surface-secondary": "#1A3B2B",
      "surface-secondary-foreground": "#EDFFF4",
      "surface-tertiary": "#224935",
      "surface-tertiary-foreground": "#EDFFF4",
      border: "#346648",
      separator: "#346648",
      scrollbar: "#346648",
      default: "#224935",
      "default-foreground": "#EDFFF4",
      "field-background": "#193728",
      "field-foreground": "#EDFFF4",
      "field-placeholder": "#A6CCB6",
      overlay: "#132D20",
      "overlay-foreground": "#EDFFF4",
      segment: "#2D5840",
      "segment-foreground": "#EDFFF4"
    },
    layout: {
      radius: 8,
      fieldRadius: 12
    }
  }
} as const satisfies ThemeTemplate;
