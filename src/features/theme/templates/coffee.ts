import type { ThemeTemplate } from './types';

/** Soft browns, cream, and roasted coffee. Only official HeroUI v3 CSS tokens are defined. */
export const coffee = {
  name: "coffee",
  label: "Coffee",
  description: "Soft browns, cream, and roasted coffee",
  value: {
    light: {
      accent: "#936037",
      "accent-foreground": "#FFFFFF",
      focus: "#936037",
      background: "#FCF8F2",
      foreground: "#342B24",
      muted: "#806B5A",
      surface: "#FFFCF8",
      "surface-foreground": "#342B24",
      "surface-secondary": "#F1E8DC",
      "surface-secondary-foreground": "#342B24",
      "surface-tertiary": "#E9DAC9",
      "surface-tertiary-foreground": "#342B24",
      border: "#DACAB8",
      separator: "#DACAB8",
      scrollbar: "#DACAB8",
      default: "#E9DAC9",
      "default-foreground": "#342B24",
      "field-background": "#FFFFFF",
      "field-foreground": "#342B24",
      "field-placeholder": "#806B5A",
      overlay: "#FFFCF8",
      "overlay-foreground": "#342B24",
      segment: "#FFFFFF",
      "segment-foreground": "#342B24"
    },
    dark: {
      accent: "#D6AD79",
      "accent-foreground": "#352414",
      focus: "#D6AD79",
      background: "#181411",
      foreground: "#F4E9DC",
      muted: "#C0AC99",
      surface: "#29231E",
      "surface-foreground": "#F4E9DC",
      "surface-secondary": "#342C24",
      "surface-secondary-foreground": "#F4E9DC",
      "surface-tertiary": "#42362B",
      "surface-tertiary-foreground": "#F4E9DC",
      border: "#59483A",
      separator: "#59483A",
      scrollbar: "#59483A",
      default: "#42362B",
      "default-foreground": "#F4E9DC",
      "field-background": "#2B241D",
      "field-foreground": "#F4E9DC",
      "field-placeholder": "#C0AC99",
      overlay: "#29231E",
      "overlay-foreground": "#F4E9DC",
      segment: "#493B2E",
      "segment-foreground": "#F4E9DC"
    },
    layout: {
      radius: 14,
      fieldRadius: 16
    }
  }
} as const satisfies ThemeTemplate;
