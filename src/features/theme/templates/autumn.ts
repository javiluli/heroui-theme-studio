import type { ThemeTemplate } from './types';

/** Copper, terracotta, and warm paper. Only official HeroUI v3 CSS tokens are defined. */
export const autumn = {
  name: "autumn",
  label: "Autumn",
  description: "Copper, terracotta, and warm paper",
  value: {
    light: {
      accent: "#AA453A",
      "accent-foreground": "#FFFFFF",
      focus: "#AA453A",
      background: "#FFF9F4",
      foreground: "#36231F",
      muted: "#81695F",
      surface: "#FFFEFB",
      "surface-foreground": "#36231F",
      "surface-secondary": "#F9E9DE",
      "surface-secondary-foreground": "#36231F",
      "surface-tertiary": "#F2DAC9",
      "surface-tertiary-foreground": "#36231F",
      border: "#E9CFC0",
      separator: "#E9CFC0",
      scrollbar: "#E9CFC0",
      default: "#F2DAC9",
      "default-foreground": "#36231F",
      "field-background": "#FFFFFF",
      "field-foreground": "#36231F",
      "field-placeholder": "#81695F",
      overlay: "#FFFEFB",
      "overlay-foreground": "#36231F",
      segment: "#FFFFFF",
      "segment-foreground": "#36231F"
    },
    dark: {
      accent: "#E89B7E",
      "accent-foreground": "#3B1F18",
      focus: "#E89B7E",
      background: "#211714",
      foreground: "#FCF0E7",
      muted: "#CEB0A3",
      surface: "#33231E",
      "surface-foreground": "#FCF0E7",
      "surface-secondary": "#423028",
      "surface-secondary-foreground": "#FCF0E7",
      "surface-tertiary": "#513A30",
      "surface-tertiary-foreground": "#FCF0E7",
      border: "#684C40",
      separator: "#684C40",
      scrollbar: "#684C40",
      default: "#513A30",
      "default-foreground": "#FCF0E7",
      "field-background": "#38261F",
      "field-foreground": "#FCF0E7",
      "field-placeholder": "#CEB0A3",
      overlay: "#33231E",
      "overlay-foreground": "#FCF0E7",
      segment: "#594237",
      "segment-foreground": "#FCF0E7"
    },
    layout: {
      radius: 10,
      fieldRadius: 14
    }
  }
} as const satisfies ThemeTemplate;
