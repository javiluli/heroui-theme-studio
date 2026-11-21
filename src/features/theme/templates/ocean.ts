import type { ThemeTemplate } from './types';

/** Ocean blues and clean surfaces. Only official HeroUI v3 CSS tokens are defined. */
export const ocean = {
  name: "ocean",
  label: "Ocean",
  description: "Ocean blues and clean surfaces",
  value: {
    light: {
      accent: "#087FA4",
      "accent-foreground": "#FFFFFF",
      focus: "#087FA4",
      background: "#F4FBFF",
      foreground: "#123043",
      muted: "#547185",
      surface: "#FFFFFF",
      "surface-foreground": "#123043",
      "surface-secondary": "#E8F5FA",
      "surface-secondary-foreground": "#123043",
      "surface-tertiary": "#DCEFF5",
      "surface-tertiary-foreground": "#123043",
      border: "#C8E2EC",
      separator: "#C8E2EC",
      scrollbar: "#C8E2EC",
      default: "#DCEFF5",
      "default-foreground": "#123043",
      "field-background": "#FFFFFF",
      "field-foreground": "#123043",
      "field-placeholder": "#547185",
      overlay: "#FFFFFF",
      "overlay-foreground": "#123043",
      segment: "#FFFFFF",
      "segment-foreground": "#123043"
    },
    dark: {
      accent: "#63D7F5",
      "accent-foreground": "#082631",
      focus: "#63D7F5",
      background: "#071923",
      foreground: "#EDFAFE",
      muted: "#9ABBC9",
      surface: "#102B36",
      "surface-foreground": "#EDFAFE",
      "surface-secondary": "#183845",
      "surface-secondary-foreground": "#EDFAFE",
      "surface-tertiary": "#204452",
      "surface-tertiary-foreground": "#EDFAFE",
      border: "#315763",
      separator: "#315763",
      scrollbar: "#315763",
      default: "#204452",
      "default-foreground": "#EDFAFE",
      "field-background": "#122F3B",
      "field-foreground": "#EDFAFE",
      "field-placeholder": "#9ABBC9",
      overlay: "#102B36",
      "overlay-foreground": "#EDFAFE",
      segment: "#244956",
      "segment-foreground": "#EDFAFE"
    },
    layout: {
      radius: 10,
      fieldRadius: 12
    }
  }
} as const satisfies ThemeTemplate;
