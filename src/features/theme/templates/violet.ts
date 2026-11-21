import type { ThemeTemplate } from './types';

/** Violet on cool surfaces. Only official HeroUI v3 CSS tokens are defined. */
export const violet = {
  name: "violet",
  label: "Violet",
  description: "Violet on cool surfaces",
  value: {
    light: {
      accent: "#7648CC",
      "accent-foreground": "#FFFFFF",
      focus: "#7648CC",
      background: "#FAF8FF",
      foreground: "#211632",
      muted: "#6B607A",
      surface: "#FFFFFF",
      "surface-foreground": "#211632",
      "surface-secondary": "#F1ECFA",
      "surface-secondary-foreground": "#211632",
      "surface-tertiary": "#E8DFF5",
      "surface-tertiary-foreground": "#211632",
      border: "#E1D6ED",
      separator: "#E1D6ED",
      scrollbar: "#E1D6ED",
      default: "#E8DFF5",
      "default-foreground": "#211632",
      "field-background": "#FFFFFF",
      "field-foreground": "#211632",
      "field-placeholder": "#6B607A",
      overlay: "#FFFFFF",
      "overlay-foreground": "#211632",
      segment: "#FFFFFF",
      "segment-foreground": "#211632"
    },
    dark: {
      accent: "#B99AFF",
      "accent-foreground": "#211435",
      focus: "#B99AFF",
      background: "#120F1C",
      foreground: "#F8F4FF",
      muted: "#B5AACA",
      surface: "#20192D",
      "surface-foreground": "#F8F4FF",
      "surface-secondary": "#2B233B",
      "surface-secondary-foreground": "#F8F4FF",
      "surface-tertiary": "#342945",
      "surface-tertiary-foreground": "#F8F4FF",
      border: "#49395D",
      separator: "#49395D",
      scrollbar: "#49395D",
      default: "#342945",
      "default-foreground": "#F8F4FF",
      "field-background": "#241B32",
      "field-foreground": "#F8F4FF",
      "field-placeholder": "#B5AACA",
      overlay: "#20192D",
      "overlay-foreground": "#F8F4FF",
      segment: "#40314F",
      "segment-foreground": "#F8F4FF"
    },
    layout: {
      radius: 12,
      fieldRadius: 14
    }
  }
} as const satisfies ThemeTemplate;
