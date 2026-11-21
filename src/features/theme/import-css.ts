import { COLOR_TOKENS, type ThemeConfig, type ThemeMode, type ModeSettings } from "./model";
import { isEditableColor } from "./conversion";
import { isThemeConfig } from "./storage";
import { getModeSettings, isAllowedFontSans } from "./mode-layout";

const TOKEN_SET = new Set<string>(COLOR_TOKENS);
const MAX_CSS_LENGTH = 100_000;
type ModeDeclarations = Partial<Record<string, string>>;

function detectMode(selector: string): ThemeMode | null {
  const trimmed = selector.trim();
  const variant = /^@variant\s+(light|dark)$/i.exec(trimmed);
  if (variant) return variant[1].toLowerCase() as ThemeMode;
  const selectors = trimmed.split(",").map((value) => value.trim());
  if (selectors.some((value) => value === ".dark" || /^\[data-theme=['"]dark['"]\]$/.test(value))) return "dark";
  if (selectors.some((value) => [":root", ".light", ".default"].includes(value) ||
    /^\[data-theme=['"](?:light|default)['"]\]$/.test(value))) return "light";
  return null;
}

function readModeBlocks(source: string): Record<ThemeMode, ModeDeclarations> {
  const result: Record<ThemeMode, ModeDeclarations> = { light: {}, dark: {} };
  const globalRadius: ModeDeclarations = {};
  // Match declarations only inside recognized theme blocks: never evaluate pasted CSS.
  const blocks = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of source.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(blocks)) {
    const mode = detectMode(match[1]);
    const isGlobalTheme = match[1].trim() === "@theme";
    if (!mode && !isGlobalTheme) continue;
    const declarations = match[2];
    for (const candidate of declarations.split(";")) {
      const item = /^\s*--([a-z][a-z0-9-]*)\s*:\s*([\s\S]*?)\s*$/.exec(candidate.trim());
      if (!item) continue;
      const [, token, value] = item;
      if (mode && (TOKEN_SET.has(token) || ["radius", "field-radius", "font-sans"].includes(token))) {
        result[mode][token] = value.trim();
      }
      if (isGlobalTheme && (token === "radius" || token === "field-radius")) globalRadius[token] = value.trim();
    }
  }
  return { light: { ...globalRadius, ...result.light }, dark: { ...globalRadius, ...result.dark } };
}

function parseRadius(value: string, name: string, max: number): number {
  const match = /^(\d+(?:\.\d+)?)(rem|px)$/i.exec(value);
  if (!match) throw new Error(`--${name} must use rem or px, for example 0.5rem.`);
  const pixels = Number(match[1]) * (match[2].toLowerCase() === "rem" ? 16 : 1);
  if (!Number.isFinite(pixels) || pixels < 0 || pixels > max) {
    throw new Error(`--${name} must be between 0 and ${max}px.`);
  }
  return Number(pixels.toFixed(6));
}

function parseFieldRadius(value: string, radius: number): number {
  const multiplier = /^calc\(\s*var\(--radius\)\s*\*\s*(\d+(?:\.\d+)?)\s*\)$/i.exec(value);
  const length = multiplier ? (radius * Number(multiplier[1])).toFixed(6) + "px" : value;
  return parseRadius(length, "field-radius", 48);
}

/** Parse pasted CSS into the approved theme model, without injecting any stylesheet. */
export function parseThemeCss(source: string, current: ThemeConfig): ThemeConfig {
  if (source.trim().length === 0) throw new Error("Paste your theme CSS first.");
  if (source.length > MAX_CSS_LENGTH) throw new Error("The CSS exceeds the 100 KB limit.");
  const declarations = readModeBlocks(source);
  const palettes = {
    light: { ...current.palettes.light },
    dark: { ...current.palettes.dark },
  };
  const layouts: Partial<Record<ThemeMode, ModeSettings>> = {};
  let importedTokens = 0;
  for (const mode of ["light", "dark"] as const) {
    const values = declarations[mode];
    const count = COLOR_TOKENS.filter((token) => Object.hasOwn(values, token)).length;
    if (!count) throw new Error(`No ${mode} theme colors found. Include both light and dark modes.`);
    importedTokens += count;
    for (const token of COLOR_TOKENS) {
      const value = values[token];
      if (value === undefined) continue;
      if (!isEditableColor(value)) throw new Error(`Invalid CSS value for --${token} in ${mode}: ${String(value).slice(0, 70)}`);
      palettes[mode][token] = value;
    }
    const previous = getModeSettings(current, mode);
    const radius = values.radius === undefined ? previous.radius : parseRadius(values.radius, "radius", 32);
    const fieldRadius = values["field-radius"] === undefined ? previous.fieldRadius : parseFieldRadius(values["field-radius"], radius);
    const fontSans = values["font-sans"] ?? previous.fontSans;
    if (!isAllowedFontSans(fontSans)) {
      throw new Error(`--font-sans is not a supported font in ${mode} mode. Use var(--font-inter) or a font from the editor.`);
    }
    layouts[mode] = { radius, fieldRadius, fontSans };
  }
  if (!importedTokens) throw new Error("No HeroUI variables to import.");
  const result: ThemeConfig = {
    ...current,
    name: "Imported CSS theme",
    radius: Math.round(layouts.light!.radius),
    fieldRadius: Math.round(layouts.light!.fieldRadius),
    palettes,
    modeSettings: layouts,
  };
  if (!isThemeConfig(result)) throw new Error("The CSS theme contains unsupported data.");
  return result;
}
