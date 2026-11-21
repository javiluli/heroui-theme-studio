import { DEFAULT_THEME, type ThemeConfig } from '../model';
import type { ThemeTemplate } from './types';
import { defaultTheme } from './default';
import { themeBuilder } from './theme-builder';
import { violet } from './violet';
import { ocean } from './ocean';
import { forest } from './forest';
import { autumn } from './autumn';
import { coffee } from './coffee';
import { emerald } from './emerald';
import { winter } from './winter';
import { sunset } from './sunset';
import { rose } from './rose';
import { midnight } from './midnight';
import { slate } from './slate';
import { makeThemeIndependent } from '../conversion';

/** Add a template file and register it here: selection/export/storage stay unchanged. */
export const templates = [
  defaultTheme,
  themeBuilder,
  violet,
  ocean,
  forest,
  autumn,
  coffee,
  emerald,
  winter,
  sunset,
  rose,
  midnight,
  slate,
] as const satisfies readonly ThemeTemplate[];

export type PresetId = (typeof templates)[number]['name'];
export const PRESET_LABELS: Record<PresetId, string> = Object.fromEntries(
  templates.map((template) => [template.name, template.label]),
) as Record<PresetId, string>;

export function createPreset(id: PresetId = 'default'): ThemeConfig {
  const template = templates.find((entry) => entry.name === id);
  if (!template) throw new Error('Tema predefinido no encontrado: ' + id);
  return {
    ...DEFAULT_THEME,
    name: id === 'default' ? DEFAULT_THEME.name : template.label,
    ...template.value.layout,
    palettes: {
      light: {...DEFAULT_THEME.palettes.light, ...template.value.light},
      dark: {...DEFAULT_THEME.palettes.dark, ...template.value.dark},
    },
  };
}

/** Detect a persisted preset without adding another storage key to ThemeConfig. */
export function findPresetId(theme: ThemeConfig): PresetId | 'custom' {
  const normalized = JSON.stringify(makeThemeIndependent(theme));
  for (const template of templates) {
    if (normalized === JSON.stringify(makeThemeIndependent(createPreset(template.name)))) return template.name;
  }
  return 'custom';
}
