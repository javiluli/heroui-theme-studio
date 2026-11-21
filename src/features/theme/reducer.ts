import type { ColorToken, ThemeConfig, ThemeMode } from './model';

export function changeColor(
  theme: ThemeConfig,
  mode: ThemeMode,
  token: ColorToken,
  value: string,
  syncModes: boolean,
): ThemeConfig {
  return {
    ...theme,
    palettes: {
      light: syncModes || mode === 'light' ? { ...theme.palettes.light, [token]: value } : theme.palettes.light,
      dark: syncModes || mode === 'dark' ? { ...theme.palettes.dark, [token]: value } : theme.palettes.dark,
    },
  };
}
