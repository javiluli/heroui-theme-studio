import type { ThemeTemplate } from "./types";
import { LEGACY_DEFAULT_PALETTES } from "../legacy-default";

/**
 * Exact 31 light/dark color tokens copied from the official HeroUI Theme
 * Builder's "Default" CSS export (supplied by the user, November 2026).
 * These colors are different from the shipped @heroui/styles defaults.
 */
export const themeBuilder = {
  name: "heroui-builder",
  label: "HeroUI Theme Builder",
  description: "Default theme from the official HeroUI Theme Builder",
  value: {
    light: LEGACY_DEFAULT_PALETTES.light,
    dark: LEGACY_DEFAULT_PALETTES.dark,
    layout: {
      radius: 8,
      fieldRadius: 12,
      fontFamily: "system",
    },
  },
} as const satisfies ThemeTemplate;
