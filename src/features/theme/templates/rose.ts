import type { ThemeTemplate } from './types';

/** Soft pink and muted surfaces. Only official HeroUI v3 CSS tokens are defined. */
export const rose = {
  name: "rose",
  label: "Rose",
  description: "Soft pink and muted surfaces",
  value: {
    light: {
      accent: "#B43D77",
      "accent-foreground": "#FFFFFF",
      focus: "#B43D77",
      background: "#FFF8FB",
      foreground: "#372130",
      muted: "#856878",
      surface: "#FFFFFF",
      "surface-foreground": "#372130",
      "surface-secondary": "#F9EAF2",
      "surface-secondary-foreground": "#372130",
      "surface-tertiary": "#F1DBE7",
      "surface-tertiary-foreground": "#372130",
      border: "#E7CDDC",
      separator: "#E7CDDC",
      scrollbar: "#E7CDDC",
      default: "#F1DBE7",
      "default-foreground": "#372130",
      "field-background": "#FFFFFF",
      "field-foreground": "#372130",
      "field-placeholder": "#856878",
      overlay: "#FFFFFF",
      "overlay-foreground": "#372130",
      segment: "#FFFFFF",
      "segment-foreground": "#372130"
    },
    dark: {
      accent: "#F19BC5",
      "accent-foreground": "#401C31",
      focus: "#F19BC5",
      background: "#1F141B",
      foreground: "#FFF1F8",
      muted: "#D0B1C1",
      surface: "#30212A",
      "surface-foreground": "#FFF1F8",
      "surface-secondary": "#3D2A36",
      "surface-secondary-foreground": "#FFF1F8",
      "surface-tertiary": "#4C3643",
      "surface-tertiary-foreground": "#FFF1F8",
      border: "#674859",
      separator: "#674859",
      scrollbar: "#674859",
      default: "#4C3643",
      "default-foreground": "#FFF1F8",
      "field-background": "#362530",
      "field-foreground": "#FFF1F8",
      "field-placeholder": "#D0B1C1",
      overlay: "#30212A",
      "overlay-foreground": "#FFF1F8",
      segment: "#5A3E4D",
      "segment-foreground": "#FFF1F8"
    },
    layout: {
      radius: 14,
      fieldRadius: 18
    }
  }
} as const satisfies ThemeTemplate;
