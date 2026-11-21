import type { ThemeTemplate } from './types';

/** Mineral neutrals and an indigo accent. Only official HeroUI v3 CSS tokens are defined. */
export const slate = {
  name: "slate",
  label: "Slate",
  description: "Mineral neutrals and an indigo accent",
  value: {
    light: {
      accent: "#4A6093",
      "accent-foreground": "#FFFFFF",
      focus: "#4A6093",
      background: "#F8FAFC",
      foreground: "#232D3A",
      muted: "#677382",
      surface: "#FFFFFF",
      "surface-foreground": "#232D3A",
      "surface-secondary": "#EEF1F5",
      "surface-secondary-foreground": "#232D3A",
      "surface-tertiary": "#E4E9EF",
      "surface-tertiary-foreground": "#232D3A",
      border: "#D3DAE3",
      separator: "#D3DAE3",
      scrollbar: "#D3DAE3",
      default: "#E4E9EF",
      "default-foreground": "#232D3A",
      "field-background": "#FFFFFF",
      "field-foreground": "#232D3A",
      "field-placeholder": "#677382",
      overlay: "#FFFFFF",
      "overlay-foreground": "#232D3A",
      segment: "#FFFFFF",
      "segment-foreground": "#232D3A"
    },
    dark: {
      accent: "#A0B5DB",
      "accent-foreground": "#1B293E",
      focus: "#A0B5DB",
      background: "#11171E",
      foreground: "#F1F4F8",
      muted: "#AAB4C2",
      surface: "#202A34",
      "surface-foreground": "#F1F4F8",
      "surface-secondary": "#293541",
      "surface-secondary-foreground": "#F1F4F8",
      "surface-tertiary": "#34414E",
      "surface-tertiary-foreground": "#F1F4F8",
      border: "#465767",
      separator: "#465767",
      scrollbar: "#465767",
      default: "#34414E",
      "default-foreground": "#F1F4F8",
      "field-background": "#24303D",
      "field-foreground": "#F1F4F8",
      "field-placeholder": "#AAB4C2",
      overlay: "#202A34",
      "overlay-foreground": "#F1F4F8",
      segment: "#3B4B59",
      "segment-foreground": "#F1F4F8"
    },
    layout: {
      radius: 6,
      fieldRadius: 9
    }
  }
} as const satisfies ThemeTemplate;
