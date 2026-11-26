import { DEFAULT_THEME, MODES, THEME_TOKENS, type ThemeConfig } from '../model';
import type { ThemeTemplate } from './types';
import { defaultTheme } from './default';
import { sky } from './sky';
import { lavender } from './lavender';
import { mint } from './mint';
import { netflix } from './netflix';
import { uber } from './uber';
import { spotify } from './spotify';
import { coinbase } from './coinbase';
import { airbnb } from './airbnb';
import { discord } from './discord';
import { rabbit } from './rabbit';
import { heroV2 } from './hero-v2';

export const templates = [
  defaultTheme,
  sky,
  lavender,
  mint,
  netflix,
  uber,
  spotify,
  coinbase,
  airbnb,
  discord,
  rabbit,
  heroV2,
] as const satisfies readonly ThemeTemplate[];

export type PresetId = (typeof templates)[number]['name'];
export const PRESET_LABELS: Record<PresetId, string> = Object.fromEntries(
  templates.map((template) => [template.name, template.label]),
) as Record<PresetId, string>;

export function createPreset(id: PresetId = "default"): ThemeConfig {
  if (id === "default") return DEFAULT_THEME;
  const template: ThemeTemplate = templates.find((entry) => entry.name === id)!;
  const { layout, light, dark } = template.value;
  return {
    name: template.label,
    overrides: {
      light: { ...light, ...layout },
      dark: { ...dark, ...layout },
    },
  };
}

export function findPresetId(theme: ThemeConfig): PresetId | "custom" {
  const preset = templates.find(({ label }) => label === theme.name);
  if (!preset) return "custom";
  const { overrides } = createPreset(preset.name);
  return MODES.every((mode) => THEME_TOKENS.every((token) => theme.overrides[mode][token] === overrides[mode][token]))
    ? preset.name : "custom";
}
