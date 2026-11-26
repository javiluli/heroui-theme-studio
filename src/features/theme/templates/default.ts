import type { ThemeTemplate } from './types';

/** Valores predeterminados del paquete @heroui/styles, sin overrides del Theme Builder. */
export const defaultTheme = {
  name: "default",
  label: "HeroUI Default",
  value: {
    light: {},
    dark: {}
  }
} as const satisfies ThemeTemplate;
