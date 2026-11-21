import type { ThemeTemplate } from './types';

/** Icy blues and glacial gray. Only official HeroUI v3 CSS tokens are defined. */
export const winter = {
  name: "winter",
  label: "Winter",
  description: "Icy blues and glacial gray",
  value: {
    light: {
      accent: "#377DB8",
      "accent-foreground": "#FFFFFF",
      focus: "#377DB8",
      background: "#F7FAFE",
      foreground: "#213448",
      muted: "#667B8E",
      surface: "#FFFFFF",
      "surface-foreground": "#213448",
      "surface-secondary": "#ECF3FA",
      "surface-secondary-foreground": "#213448",
      "surface-tertiary": "#E1EDF6",
      "surface-tertiary-foreground": "#213448",
      border: "#D1E0EB",
      separator: "#D1E0EB",
      scrollbar: "#D1E0EB",
      default: "#E1EDF6",
      "default-foreground": "#213448",
      "field-background": "#FFFFFF",
      "field-foreground": "#213448",
      "field-placeholder": "#667B8E",
      overlay: "#FFFFFF",
      "overlay-foreground": "#213448",
      segment: "#FFFFFF",
      "segment-foreground": "#213448"
    },
    dark: {
      accent: "#91CAFA",
      "accent-foreground": "#0C304E",
      focus: "#91CAFA",
      background: "#0E1823",
      foreground: "#F1F7FC",
      muted: "#B1C2D0",
      surface: "#1B2C3B",
      "surface-foreground": "#F1F7FC",
      "surface-secondary": "#263A4C",
      "surface-secondary-foreground": "#F1F7FC",
      "surface-tertiary": "#304556",
      "surface-tertiary-foreground": "#F1F7FC",
      border: "#425B70",
      separator: "#425B70",
      scrollbar: "#425B70",
      default: "#304556",
      "default-foreground": "#F1F7FC",
      "field-background": "#203346",
      "field-foreground": "#F1F7FC",
      "field-placeholder": "#B1C2D0",
      overlay: "#1B2C3B",
      "overlay-foreground": "#F1F7FC",
      segment: "#3B5367",
      "segment-foreground": "#F1F7FC"
    },
    layout: {
      radius: 6,
      fieldRadius: 10
    }
  }
} as const satisfies ThemeTemplate;
