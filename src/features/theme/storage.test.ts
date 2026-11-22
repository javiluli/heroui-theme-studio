import { afterEach, describe, expect, it, vi } from 'vitest';
import { LEGACY_DEFAULT_PALETTES } from './legacy-default';
import { loadTheme, STORAGE_KEY } from './storage';
import { createPreset } from './templates';

afterEach(() => vi.unstubAllGlobals());

describe('legacy color migration', () => {
  it('restores the latest valid older theme when newer records cannot be read', () => {
    const saved = createPreset();
    saved.palettes.light.accent = '#123456';
    const entries: Record<string, string> = {
      [STORAGE_KEY]: '{',
      'hero-theme-studio:theme:v6': JSON.stringify({ palettes: null }),
      'hero-theme-studio:theme:v5': JSON.stringify(saved),
    };
    vi.stubGlobal('window', { localStorage: {
      getItem(key: string) { return entries[key] ?? null; },
    } });

    expect(loadTheme().palettes.light.accent).toBe('#123456');
  });

  it('repairs legacy defaults but preserves explicitly edited colors', () => {
    const old = {
      ...createPreset(),
      palettes: {
        light: { ...LEGACY_DEFAULT_PALETTES.light, accent: '#123456' },
        dark: { ...LEGACY_DEFAULT_PALETTES.dark },
      },
    };
    vi.stubGlobal('window', { localStorage: {
      getItem(key: string) { return key === 'hero-theme-studio:theme:v5' ? JSON.stringify(old) : null; },
    } });
    const theme = loadTheme();
    expect(theme.palettes.dark.background).toBe('oklch(12% 0.005 285.823)');
    expect(theme.palettes.light.background).toBe('oklch(0.9702 0 0)');
    expect(theme.palettes.light.accent).toBe('#123456');
    expect(theme.palettes.dark.scrollbar).toBe('var(--scrollbar-thumb)');
  });

  it('keeps v6 native and v7 custom colors unchanged', () => {
    const native = createPreset();
    vi.stubGlobal('window', { localStorage: {
      getItem(key: string) { return key === 'hero-theme-studio:theme:v6' ? JSON.stringify(native) : null; },
    } });
    expect(loadTheme().palettes.dark.background).toBe('oklch(12% 0.005 285.823)');
    vi.unstubAllGlobals();

    const saved = createPreset();
    saved.palettes.dark.background = '#050606';
    saved.palettes.dark['field-border'] = '#3978BF80';
    vi.stubGlobal('window', { localStorage: {
      getItem(key: string) { return key === STORAGE_KEY ? JSON.stringify(saved) : null; },
    } });
    expect(loadTheme().palettes.dark.background).toBe('#050606');
    expect(loadTheme().palettes.dark['field-border']).toBe('#3978BF80');
  });
});
