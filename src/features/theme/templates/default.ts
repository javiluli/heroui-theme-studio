import type { ThemeTemplate } from './types';

/** Valores predeterminados del paquete @heroui/styles, sin overrides del Theme Builder. */
export const defaultTheme = {
  name: "default",
  label: "HeroUI Library Default",
  description: "Valores nativos de @heroui/styles, sin personalizaciones",
  value: {
    light: {},
    dark: {},
    layout: {}
  }
} as const satisfies ThemeTemplate;
