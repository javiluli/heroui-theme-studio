import { COLOR_TOKENS, DEFAULT_THEME, type ColorToken, type Palette, type ThemeConfig, type ThemeMode } from "./model";

function findNativeLinks(mode: ThemeMode) {
  const links: Partial<Record<ColorToken, ColorToken>> = {};
  const palette = DEFAULT_THEME.palettes[mode];
  for (const token of COLOR_TOKENS) {
    // HeroUI derives scrollbar-thumb from foreground at 15% opacity.
    const alias = palette[token] === "var(--scrollbar-thumb)" ? "var(--foreground)" : palette[token];
    const source = COLOR_TOKENS.find((candidate) => alias === `var(--${candidate})`);
    if (source) links[token] = source;
  }
  return links;
}

// Only links between editable tokens in @heroui/styles' default theme, by mode.
export const NATIVE_COLOR_LINKS = { light: findNativeLinks("light"), dark: findNativeLinks("dark") };

export function withNativeColorLinks(theme: ThemeConfig): ThemeConfig {
  const linkedPalette = (mode: ThemeMode): Palette => {
    const palette = { ...theme.palettes[mode] };
    for (const token of COLOR_TOKENS) {
      if (NATIVE_COLOR_LINKS[mode][token]) palette[token] = DEFAULT_THEME.palettes[mode][token];
    }
    return palette;
  };
  return { ...theme, palettes: { light: linkedPalette("light"), dark: linkedPalette("dark") } };
}
