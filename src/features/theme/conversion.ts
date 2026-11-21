import { COLOR_TOKENS, type Palette, type ThemeConfig, type ThemeMode } from './model';
import { LEGACY_DEFAULT_PALETTES } from './legacy-default';
import { getModeSettings, pixelsToRem } from './mode-layout';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const THEME_REFERENCE = /^var\(--(white|black|snow|eclipse|foreground|muted|accent|scrollbar-thumb)\)$/;
const NATIVE_PRIMITIVES: Record<string, string> = {
  white: 'oklch(100% 0 0)',
  black: 'oklch(0% 0 0)',
  snow: 'oklch(0.9911 0 0)',
  eclipse: 'oklch(0.2103 0.0059 285.89)',
};

/** Resolve known HeroUI aliases for the HEX preview only (never alter stored CSS). */
function resolveColor(color: string, palette?: Palette, visited = new Set<string>()): string {
  const reference = THEME_REFERENCE.exec(color);
  if (!reference) return color;
  const token = reference[1];
  if (visited.has(token)) return '#000000';
  visited.add(token);
  if (token === 'scrollbar-thumb') {
    // CSS color-mix uses alpha, which an opaque HEX picker cannot represent.
    return resolveColor(palette?.foreground ?? NATIVE_PRIMITIVES.eclipse, palette, visited);
  }
  const next = NATIVE_PRIMITIVES[token] ?? palette?.[token as keyof Palette];
  return next ? resolveColor(next, palette, visited) : '#000000';
}

/** Snapshot theme aliases before editing so changes to one token stay local. */
export function makeThemeIndependent(theme: ThemeConfig): ThemeConfig {
  const independentPalette = (mode: ThemeMode): Palette => {
    const palette = theme.palettes[mode];
    const next = { ...palette };
    for (const token of COLOR_TOKENS) {
      const color = palette[token];
      // The native scrollbar uses an alpha mix. Use the Builder's standalone color.
      next[token] = color === 'var(--scrollbar-thumb)'
        ? LEGACY_DEFAULT_PALETTES[mode].scrollbar
        : resolveColor(color, palette);
    }
    return next;
  };
  return { ...theme, palettes: { light: independentPalette('light'), dark: independentPalette('dark') } };
}

const OKLCH_COLOR = /^oklch\(\s*(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)$/i;

export function isHexColor(value: unknown): boolean {
  return typeof value === 'string' && HEX_COLOR.test(value);
}

export function isEditableColor(value: unknown): value is string {
  if (value === 'transparent') return true;
  if (typeof value === 'string' && THEME_REFERENCE.test(value)) return true;
  if (isHexColor(value)) return true;
  return typeof value === 'string' && parseOklch(value) !== null;
}

function parseOklch(value: string): { l: number; c: number; h: number } | null {
  const match = OKLCH_COLOR.exec(value);
  if (!match) return null;
  const l = match[1].endsWith('%') ? Number(match[1].slice(0, -1)) / 100 : Number(match[1]);
  const c = Number(match[2]);
  const h = Number(match[3]);
  return l >= 0 && l <= 1 && c >= 0 && c <= 0.5 && Number.isFinite(h) && Math.abs(h) <= 360
    ? { l, c, h }
    : null;
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function delinearize(channel: number): number {
  const c = Math.max(0, Math.min(1, channel));
  const srgb = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, srgb * 255)));
}

/** Transform user-editable HEX values to HeroUI's native OKLCH representation. */
export function hexToOklch(hex: string): string {
  if (!isHexColor(hex)) throw new Error('Invalid 6-digit hex color');
  const r = linearize(parseInt(hex.slice(1, 3), 16));
  const g = linearize(parseInt(hex.slice(3, 5), 16));
  const b = linearize(parseInt(hex.slice(5, 7), 16));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const c = Math.hypot(a, bb);
  const h = c < 0.000001 ? 0 : (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360;
  return 'oklch(' + L.toFixed(8) + ' ' + c.toFixed(8) + ' ' + h.toFixed(5) + ')';
}

/** sRGB preview; never round-trip original OKLCH or CSS references. */
export function colorToHex(color: string, palette?: Palette): string {
  const resolved = resolveColor(color, palette);
  if (isHexColor(resolved)) return resolved.toUpperCase();
  const oklch = parseOklch(resolved);
  if (!oklch) return '#000000';

  const a = oklch.c * Math.cos(oklch.h * Math.PI / 180);
  const b = oklch.c * Math.sin(oklch.h * Math.PI / 180);
  const l = (oklch.l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (oklch.l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (oklch.l - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
  return '#' + rgb.map((channel) => delinearize(channel).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Keep official OKLCH values intact; only convert user-entered HEX values. */
export function cssColorValue(color: string): string {
  return isHexColor(color) ? hexToOklch(color) : color;
}

export function getThemeVariables(theme: ThemeConfig, mode: ThemeMode): Record<string, string> {
  const { radius, fieldRadius, fontSans } = getModeSettings(theme, mode);
  const palette = theme.palettes[mode];
  const properties: Record<string, string> = {};
  for (const token of COLOR_TOKENS) properties['--' + token] = cssColorValue(palette[token]);
  properties['--radius'] = pixelsToRem(radius);
  properties['--field-radius'] = pixelsToRem(fieldRadius);
  properties['--font-sans'] = fontSans;
  return properties;
}
