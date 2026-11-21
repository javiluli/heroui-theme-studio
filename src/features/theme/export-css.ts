import type { ThemeConfig, ThemeMode } from './model';
import { getThemeVariables } from './conversion';

export type ThemePlatform = 'web' | 'native';

function declarations(theme: ThemeConfig, mode: ThemeMode, platform: ThemePlatform): string[] {
  return [
    ...(mode === 'dark' ? ['color-scheme: dark;'] : []),
    ...Object.entries(getThemeVariables(theme, mode))
      .filter(([name]) => platform === 'web' || (name !== '--scrollbar' && name !== '--font-sans'))
      .map(([name, value]) => name + ': ' + value + ';'),
  ];
}

function webModeCss(theme: ThemeConfig, mode: ThemeMode): string {
  const selectors = mode === 'light'
    ? ':root,\n.light,\n.default,\n[data-theme="light"],\n[data-theme="default"]'
    : '.dark,\n[data-theme="dark"]';
  return [
    selectors + ' {',
    ...declarations(theme, mode, 'web').map((line) => '  ' + line),
    '}',
  ].join('\n');
}

export function exportThemeCss(theme: ThemeConfig, platform: ThemePlatform = 'web'): string {
  if (platform === 'native') {
    const variant = (mode: ThemeMode) => [
      '    @variant ' + mode + ' {',
      ...declarations(theme, mode, 'native').map((line) => '      ' + line),
      '    }',
    ].join('\n');
    return [
      '/* HeroUI Native · add to global.css after heroui-native/styles. */',
      '/* Fuentes: carga las caras en Expo y configura --font-normal, --font-medium, --font-semibold y --font-bold en @theme. */',
      '/* https://heroui.com/en/docs/native/getting-started/theming#custom-fonts */',
      '',
      '@layer theme {',
      '  :root {',
      variant('light'),
      '',
      variant('dark'),
      '  }',
      '}',
      '',
    ].join('\n');
  }
  return [
    '/* HeroUI React v3 · Editable CSS (import after @heroui/styles) */',
    '/* Load the custom font specified in --font-sans in your application. */',
    '',
    webModeCss(theme, 'light'),
    '',
    webModeCss(theme, 'dark'),
    '',
  ].join('\n');
}
