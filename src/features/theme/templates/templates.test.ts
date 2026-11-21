import { describe, expect, it } from 'vitest';
import { COLOR_TOKENS, DEFAULT_THEME } from '../model';
import { isEditableColor } from '../conversion';
import { isThemeConfig } from '../storage';
import { createPreset, findPresetId, templates } from './index';
import { LEGACY_DEFAULT_PALETTES } from '../legacy-default';
import { exportThemeCss } from '../export-css';

describe('HeroUI v3 template registry', () => {
  it('exposes unique data-driven template ids, including original and new styles', () => {
    const ids = templates.map((template) => template.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      'default', 'heroui-builder', 'violet', 'ocean', 'forest', 'autumn', 'coffee',
      'emerald', 'winter', 'sunset', 'rose', 'midnight', 'slate',
    ]);
  });


  it('reproduces the exact official Theme Builder export without changing the library defaults', () => {
    const builder = createPreset('heroui-builder');
    const library = createPreset('default');
    expect(builder.palettes.light).toEqual(LEGACY_DEFAULT_PALETTES.light);
    expect(builder.palettes.dark).toEqual(LEGACY_DEFAULT_PALETTES.dark);
    expect(builder.palettes.dark.background).toBe('oklch(12.00% 0.0015 253.83)');
    expect(library.palettes.dark.background).toBe('oklch(12% 0.005 285.823)');
    expect(builder.palettes.light.background).toBe('oklch(97.02% 0.0015 253.83)');
    expect(builder.palettes.dark['surface-tertiary']).toBe('oklch(27.21% 0.0023 253.83)');
    expect(builder.radius).toBe(8);
    expect(builder.fieldRadius).toBe(12);
    expect(exportThemeCss(builder)).toContain('--background: oklch(12.00% 0.0015 253.83);');
    expect(exportThemeCss(builder)).toContain('--scrollbar: oklch(70.50% 0.0015 253.83);');
    expect(findPresetId(builder)).toBe('heroui-builder');
    expect(findPresetId(library)).toBe('default');
  });

  it('keeps exact original defaults and fully valid Light and Dark palettes', () => {
    expect(createPreset()).toEqual(DEFAULT_THEME);
    for (const template of templates) {
      const theme = createPreset(template.name);
      expect(isThemeConfig(theme)).toBe(true);
      expect(findPresetId(theme)).toBe(template.name);
      expect(Object.keys(theme.palettes.light).sort()).toEqual([...COLOR_TOKENS].sort());
      expect(Object.keys(theme.palettes.dark).sort()).toEqual([...COLOR_TOKENS].sort());
      for (const mode of ['light', 'dark'] as const) {
        const palette = template.value[mode];
        expect(Object.keys(palette).every((token) => COLOR_TOKENS.includes(token as typeof COLOR_TOKENS[number]))).toBe(true);
        expect(Object.values(palette).every((color) => isEditableColor(color))).toBe(true);
      }
    }
  });

  it('rebuilds a fresh independent theme on every selection and detects edits', () => {
    const first = createPreset('autumn');
    first.palettes.light.accent = '#000000';
    const fresh = createPreset('autumn');
    expect(fresh.palettes.light.accent).not.toBe('#000000');
    expect(findPresetId(first)).toBe('custom');
    expect(findPresetId(fresh)).toBe('autumn');
  });

  it('makes different theme identities visible beyond changing only the accent', () => {
    for (const template of templates.filter((x) => x.name !== 'default')) {
      const theme = createPreset(template.name);
      expect(theme.palettes.light.background).not.toBe(DEFAULT_THEME.palettes.light.background);
      expect(theme.palettes.dark.background).not.toBe(DEFAULT_THEME.palettes.dark.background);
      expect(theme.palettes.dark.surface).not.toBe(DEFAULT_THEME.palettes.dark.surface);
      expect(theme.palettes.light.focus).toBe(theme.palettes.light.accent);
      expect(theme.palettes.dark.focus).toBe(theme.palettes.dark.accent);
    }
  });
});
