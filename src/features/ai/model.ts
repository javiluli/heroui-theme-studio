import { isHexColor } from '../theme/conversion';
import { extractThemeJson } from './response';
import type { ColorToken, ThemeConfig, ThemeOverrides } from '../theme/model';

export const AI_CORE_TOKENS = [
  'background', 'foreground', 'surface', 'accent', 'muted',
  'border', 'success', 'warning', 'danger',
] as const satisfies readonly ColorToken[];

export type AIToken = (typeof AI_CORE_TOKENS)[number];
export type AIColors = Record<AIToken, string>;

export interface ThemeDraft {
  name: string;
  description: string;
  accent: string;
  neutral: string;
  contrast: 'soft' | 'balanced' | 'high';
  darkStyle: 'black' | 'charcoal' | 'tinted';
  radius: number;
}

export interface ThemeProposal {
  name: string;
  description: string;
  light: AIColors;
  dark: AIColors;
  radius: number;
}

/** The LLM returns seeds and style intent, not dozens of unrelated HEX tokens. */
export function parseThemeDraft(output: string): ThemeDraft {
  const candidate = extractThemeJson(output);
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new Error('The model did not return a valid theme design.');
  }
  const data = candidate as Record<string, unknown>;
  if (typeof data.accent !== 'string' || !isHexColor(data.accent)) throw new Error('The model did not provide a valid accent HEX color.');
  if (typeof data.neutral !== 'string' || !isHexColor(data.neutral)) throw new Error('The model did not provide a valid neutral HEX color.');
  if (!['soft', 'balanced', 'high'].includes(String(data.contrast))) throw new Error('The model did not provide a valid contrast level.');
  if (!['black', 'charcoal', 'tinted'].includes(String(data.darkStyle))) throw new Error('The model did not provide a valid background style.');
  const radius = data.radius;
  if (typeof radius !== 'number' || !Number.isInteger(radius) || radius < 0 || radius > 24) {
    throw new Error('The generated radius must be an integer from 0 to 24.');
  }
  return {
    name: typeof data.name === 'string' && data.name.trim() ? data.name.trim().slice(0, 60) : 'Generated theme',
    description: typeof data.description === 'string' ? data.description.trim().slice(0, 220) : '',
    accent: data.accent.toUpperCase(),
    neutral: data.neutral.toUpperCase(),
    contrast: data.contrast as ThemeDraft['contrast'],
    darkStyle: data.darkStyle as ThemeDraft['darkStyle'],
    radius,
  };
}

export function parseThemeProposal(output: string): ThemeProposal {
  const candidate = extractThemeJson(output);
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw new Error('Invalid proposal.');
  const data = candidate as Record<string, unknown>;
  const getColors = (value: unknown) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('The palette is missing.');
    const tokens = value as Record<string, unknown>;
    const result = {} as AIColors;
    for (const token of AI_CORE_TOKENS) {
      if (typeof tokens[token] !== 'string' || !isHexColor(tokens[token])) throw new Error('Invalid color in ' + token);
      result[token] = (tokens[token] as string).toUpperCase();
    }
    return result;
  };
  if (typeof data.radius !== 'number' || data.radius < 0 || data.radius > 24) throw new Error('Invalid radius.');
  return {
    name: typeof data.name === 'string' ? data.name.slice(0, 60) : 'Generated theme',
    description: typeof data.description === 'string' ? data.description.slice(0, 220) : '',
    radius: Math.round(data.radius),
    light: getColors(data.light),
    dark: getColors(data.dark),
  };
}

function luminance(hex: string): number {
  return [1, 3, 5].map((start) => {
    const n = parseInt(hex.slice(start, start + 2), 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
}

function readableText(hex: string): string {
  return (luminance(hex) + 0.05) / 0.05 > 1.05 / (luminance(hex) + 0.05) ? '#000000' : '#FFFFFF';
}

export function applyThemeProposal(base: ThemeConfig, proposal: ThemeProposal): ThemeConfig {
  const apply = (current: ThemeOverrides, colors: AIColors): ThemeOverrides => ({
    ...current,
    ...colors,
    "accent-foreground": readableText(colors.accent),
    "success-foreground": readableText(colors.success),
    "warning-foreground": readableText(colors.warning),
    "danger-foreground": readableText(colors.danger),
    radius: proposal.radius + "px",
  });
  return {
    name: proposal.name,
    overrides: {
      light: apply(base.overrides.light, proposal.light),
      dark: apply(base.overrides.dark, proposal.dark),
    },
  };
}
