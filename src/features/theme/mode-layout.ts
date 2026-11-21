import type { ModeSettings, ThemeConfig, ThemeMode } from "./model";
import { FONT_STACKS } from "./typography";

/** Limit imported font declarations to a known stack or a font variable. */
export function isAllowedFontSans(value: unknown): value is string {
  return typeof value === "string" &&
    (Object.values(FONT_STACKS).includes(value as typeof FONT_STACKS[keyof typeof FONT_STACKS]) ||
      /^var\(--font-[\w-]+\)$/.test(value));
}

export function getModeSettings(theme: ThemeConfig, mode: ThemeMode): ModeSettings {
  return theme.modeSettings?.[mode] ?? {
    radius: theme.radius,
    fieldRadius: theme.fieldRadius,
    fontSans: FONT_STACKS[theme.fontFamily],
  };
}

export function pixelsToRem(value: number): string {
  return Number((value / 16).toFixed(6)) + "rem";
}
