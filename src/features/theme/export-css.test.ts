import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { colorToHex, cssColorValue, getThemeVariables, hexToOklch, isEditableColor, makeThemeIndependent } from './conversion';
import { exportThemeCss } from './export-css';
import { changeColor } from './reducer';
import { COLOR_TOKENS } from './model';
import { createPreset } from './templates';
import { isThemeConfig } from './storage';
import { NATIVE_COLOR_LINKS, withNativeColorLinks } from './native-color-links';

function cssVariables(block: string) {
  return Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
}

function editableAliases(variables: Record<string, string>) {
  return Object.fromEntries(COLOR_TOKENS.flatMap((token) => {
    const source = COLOR_TOKENS.find((candidate) => variables[token] === `var(--${candidate})`);
    return source ? [[token, source]] : [];
  }));
}

/**
 * The reference CSS provided by the user is the exact public editing contract.
 * No invented variables, Pro-only component tokens, or text scale controls.
 */
describe('HeroUI v3 OSS theme contract', () => {
  it('uses the supplied official CSS defaults exactly', () => {
    const theme = createPreset();
    expect(theme.radius).toBe(8);
    expect(theme.fieldRadius).toBe(12);
    expect(theme.palettes.light.accent).toBe('oklch(0.6204 0.195 253.83)');
    expect(theme.palettes.dark.background).toBe('oklch(12% 0.005 285.823)');
    expect(theme.palettes.light['field-border']).toBe('transparent');
    expect(theme.palettes.light['field-placeholder']).toBe('var(--muted)');
    expect(theme.palettes.dark['surface-tertiary-foreground']).toBe('var(--foreground)');
  });

  it('matches all editable links against the installed HeroUI React CSS in each mode', () => {
    const require = createRequire(import.meta.url);
    const css = readFileSync(require.resolve('@heroui/styles/themes/default/variables.css'), 'utf8');
    const linked = withNativeColorLinks(createPreset('heroui-builder'));
    for (const mode of ['light', 'dark'] as const) {
      const heading = mode === 'light' ? 'Light' : 'Dark';
      const block = css.split(`/* == ${heading} Theme Variables == */`)[1].split('/* Calculated Colors */')[0];
      const variables = cssVariables(block);
      const links = editableAliases(variables);
      expect(variables.scrollbar).toBe('var(--scrollbar-thumb)');
      expect(variables['scrollbar-thumb']).toBe('color-mix(in oklch, var(--foreground) 15%, transparent)');
      expect(NATIVE_COLOR_LINKS[mode]).toEqual({ ...links, scrollbar: 'foreground' });
      for (const token of Object.keys(NATIVE_COLOR_LINKS[mode]) as (typeof COLOR_TOKENS)[number][]) {
        expect(linked.palettes[mode][token]).toBe(variables[token]);
      }
    }
  });

  it('matches the shared aliases against the installed HeroUI Native CSS and excludes the web scrollbar', () => {
    const requireNative = createRequire(new URL('../native/runtime/package.json', import.meta.url));
    const css = readFileSync(join(dirname(requireNative.resolve('heroui-native/styles')), 'variables.css'), 'utf8');
    const nativeExport = exportThemeCss(withNativeColorLinks(createPreset('heroui-builder')), 'native');
    for (const mode of ['light', 'dark'] as const) {
      const variant = `@variant ${mode} {`;
      const variables = cssVariables(css.split(variant)[1].split('}')[0]);
      const linkedExport = cssVariables(nativeExport.split(variant)[1].split('}')[0]);
      const { scrollbar, ...links } = NATIVE_COLOR_LINKS[mode];
      expect(editableAliases(variables)).toEqual(links);
      expect(editableAliases(linkedExport)).toEqual(links);
      expect(variables.scrollbar).toBeUndefined();
      expect(linkedExport.scrollbar).toBeUndefined();
      expect(scrollbar).toBe('foreground');
    }
  });

  it('exports ONLY the approved theme tokens in both modes plus 3 geometry/font variables', () => {
    const css = exportThemeCss(createPreset());
    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('.default,');
    expect(css).toContain('--radius: 0.5rem;');
    expect(css).toContain('--field-radius: 0.75rem;');
    expect(css).toContain('--font-sans:');
    for (const token of [...COLOR_TOKENS, 'radius', 'field-radius', 'font-sans']) {
      expect(css.match(new RegExp('--' + token + ':', 'g'))?.length).toBe(2);
    }
    const names = [...css.matchAll(/^\s*(--[a-z-]+):/gm)].map((match) => match[1]);
    const allowed = new Set([...COLOR_TOKENS.map((token) => '--' + token), '--radius','--field-radius','--font-sans']);
    expect([...new Set(names)].sort()).toEqual([...allowed].sort());
    for (const banned of ['--border-width', '--field-border-width', '--text-xs', '--text-sm--line-height', '--ring-offset-width', '--disabled-opacity']) {
      expect(css).not.toContain(banned + ':');
    }
    expect(css).toContain('color-scheme: dark;');
  });

  it('keeps original OKLCH precision until user edits it', () => {
    const css = exportThemeCss(createPreset());
    expect(css).toContain('--accent: oklch(0.6204 0.195 253.83);');
    expect(css).toContain('--background: oklch(12% 0.005 285.823);');
    expect(css).toContain('--focus: var(--accent);');
    expect(css).toContain('--scrollbar: var(--scrollbar-thumb);');
    expect(cssColorValue('#000000')).toMatch(/^oklch\(/);
    expect(hexToOklch('#FFFFFF')).toMatch(/^oklch\(/);
    expect(colorToHex('oklch(100% 0 0)')).toBe('#FFFFFF');
    expect(colorToHex(createPreset().palettes.dark.background)).toBe('#060607');
    expect(colorToHex('var(--foreground)', createPreset().palettes.dark)).toBe(colorToHex('var(--snow)'));
    expect(isEditableColor('var(--foreground)')).toBe(true);
    expect(isEditableColor('var(--untrusted)')).toBe(false);
  });

  it('applies the same approved variables as the web export for each mode', () => {
    const theme = createPreset();
    theme.modeSettings = { dark: { radius: 6.5, fieldRadius: 10, fontSans: 'var(--font-inter)' } };
    const [lightCss, darkCss] = [...exportThemeCss(theme).matchAll(/\{([^}]+)\}/g)].map(([, css]) => css);
    for (const [mode, css] of [['light', lightCss], ['dark', darkCss]] as const) {
      const variables = getThemeVariables(theme, mode);
      const exported = Object.fromEntries(Object.entries(cssVariables(css)).map(([name, value]) => ['--' + name, value]));
      expect(variables).toEqual(exported);
    }
    expect(getThemeVariables(theme, 'light')['--font-sans']).toContain('Inter');
    expect(getThemeVariables(theme, 'dark')['--font-sans']).toBe('var(--font-inter)');
  });

  it('preserves independent Light and Dark colors', () => {
    const original = makeThemeIndependent(createPreset());
    const edit = changeColor(original, 'light', 'focus', '#123456', false);
    expect(edit.palettes.light.focus).toBe('#123456');
    expect(edit.palettes.dark.focus).toBe(original.palettes.dark.focus);
    const synced = changeColor(original, 'light', 'accent', '#AABBCC', true);
    expect(synced.palettes.light.accent).toBe('#AABBCC');
    expect(synced.palettes.dark.accent).toBe('#AABBCC');
    expect(synced.palettes.light.focus).toBe(original.palettes.light.accent);
    expect(synced.palettes.dark.focus).toBe(original.palettes.dark.accent);
    const textEdit = changeColor(original, 'dark', 'foreground', '#99AAAA', false);
    expect(textEdit.palettes.dark['field-foreground']).toBe(original.palettes.dark.foreground);
    expect(textEdit.palettes.dark.scrollbar).toBe(original.palettes.dark.scrollbar);
    expect(exportThemeCss(original)).not.toContain('--focus: var(--accent);');
    expect(makeThemeIndependent(createPreset('heroui-builder'))).toEqual(createPreset('heroui-builder'));
    const linked = withNativeColorLinks(original);
    expect(NATIVE_COLOR_LINKS.light).toEqual({
      focus: 'accent', 'field-placeholder': 'muted', 'overlay-foreground': 'foreground',
      scrollbar: 'foreground', 'surface-foreground': 'foreground',
      'surface-secondary-foreground': 'foreground', 'surface-tertiary-foreground': 'foreground',
    });
    expect(NATIVE_COLOR_LINKS.dark).toEqual({
      ...NATIVE_COLOR_LINKS.light, 'field-foreground': 'foreground', 'segment-foreground': 'foreground',
    });
    expect(exportThemeCss(linked)).toContain('--focus: var(--accent);');
    expect(linked.palettes.light['field-foreground']).toBe(original.palettes.light['field-foreground']);
    expect(linked.palettes.dark['field-foreground']).toBe('var(--foreground)');
    expect(linked.palettes.dark.scrollbar).toBe('var(--scrollbar-thumb)');
  });

  it('validates every actual color and geometry token', () => {
    const broken = createPreset();
    broken.palettes.dark['field-placeholder'] = 'not a color';
    expect(isThemeConfig(broken)).toBe(false);
    const invalidRadius = createPreset();
    invalidRadius.fieldRadius = -3;
    expect(isThemeConfig(invalidRadius)).toBe(false);
    expect(isThemeConfig(createPreset())).toBe(true);
    expect(isEditableColor('oklch(0.6 0.2 200)')).toBe(true);
  });
});
