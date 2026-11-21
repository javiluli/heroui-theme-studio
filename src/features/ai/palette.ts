import type { AIColors, ThemeDraft, ThemeProposal } from './model';
import { previousThemeForRequest } from './direction';
import { findStyleReference } from './style-references';

/**
 * Deterministic color harmony: a model chooses a small design direction, while
 * this module creates distinct light/dark palettes, accessible text, and
 * consistent semantic roles. Tune hue, saturation and luminance here.
 */
const COLOR_CUES: ReadonlyArray<{ pattern: RegExp; hue: number }> = [
  { pattern: /\b(?:lavanda|lila|lavender)\b/i, hue: 264 },
  { pattern: /\b(?:azul petr[oó]leo|petr[oó]leo)\b/i, hue: 192 },
  { pattern: /\b(?:azul marino|navy)\b/i, hue: 227 },
  { pattern: /\b(?:coral|salm[oó]n)\b/i, hue: 12 },
  { pattern: /\b(?:terracota|terracotta|arcilla)\b/i, hue: 17 },
  { pattern: /\b(?:oliva|olive)\b/i, hue: 85 },
  { pattern: /\b(?:verde bosque|forest green)\b/i, hue: 136 },
  { pattern: /\b(?:verde esmeralda|esmeralda|emerald)\b/i, hue: 155 },
  { pattern: /\b(?:violeta|morado|p[uú]rpura|purple|violet)\b/i, hue: 278 },
  { pattern: /\b(?:azul|blue|oc[eé]ano)\b/i, hue: 214 },
  { pattern: /\b(?:verde|green|bosque)\b/i, hue: 153 },
  { pattern: /\b(?:rosa|rosado|fucsia|pink|magenta)\b/i, hue: 329 },
  { pattern: /\b(?:rojo|red|granate)\b/i, hue: 2 },
  { pattern: /\b(?:naranja|orange)\b/i, hue: 25 },
  { pattern: /\b(?:amarillo|yellow|dorado|gold)\b/i, hue: 47 },
  { pattern: /\b(?:turquesa|cyan|cian|teal)\b/i, hue: 182 },
  { pattern: /\b(?:marr[oó]n|brown|beige)\b/i, hue: 33 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function hslToHex(hue: number, saturation: number, lightness: number): string {
  const h = ((hue % 360) + 360) % 360;
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs((h / 60) % 2 - 1));
  const [r, g, b] = h < 60 ? [chroma, x, 0] :
    h < 120 ? [x, chroma, 0] :
      h < 180 ? [0, chroma, x] :
        h < 240 ? [0, x, chroma] :
          h < 300 ? [x, 0, chroma] : [chroma, 0, x];
  const offset = l - chroma / 2;
  return '#' + [r, g, b].map((channel) => Math.round((channel + offset) * 255)
    .toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function hexToHsl(hex: string): { hue: number; saturation: number; lightness: number } {
  const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const maximum = Math.max(r, g, b);
  const minimum = Math.min(r, g, b);
  const d = maximum - minimum;
  const l = (maximum + minimum) / 2;
  let h = 0;
  if (d !== 0) {
    if (maximum === r) h = ((g - b) / d) % 6;
    else if (maximum === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { hue: h, saturation: s * 100, lightness: l * 100 };
}

export function contrastRatio(a: string, b: string): number {
  const luminance = (color: string) => {
    const parts = [1, 3, 5].map((start) => parseInt(color.slice(start, start + 2), 16) / 255);
    const linear = parts.map((part) => part <= 0.04045 ? part / 12.92 : ((part + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const aL = luminance(a);
  const bL = luminance(b);
  return (Math.max(aL, bL) + 0.05) / (Math.min(aL, bL) + 0.05);
}

/**
 * Only treat a HEX as the accent when it is not explicitly assigned to a
 * background/surface. The literal color wins over LLM guesses and brand cues.
 */
function accentClause(text: string): string | undefined {
  const accent = /\b(?:acento|accent|color principal|color primario)\b([^,.;\n]*)/i.exec(text);
  return accent?.[1].split(/\b(?:fondos?|backgrounds?|superficies?|surfaces?|bordes?|borders?|texto|foreground|foco|focus)\b/i)[0];
}

export function getRequestedAccentHex(text: string): string | null {
  const explicit = accentClause(text);
  if (explicit !== undefined) return explicit.match(/#[0-9a-f]{6}\b/i)?.[0].toUpperCase() ?? null;
  const matches = [...text.matchAll(/#[0-9a-f]{6}\b/gi)];
  if (matches.length !== 1) return null;
  if (/\b(?:fondos?|backgrounds?|superficies?|surfaces?|bordes?|borders?|texto|foreground|foco|focus)\b[^#\n]{0,28}#[0-9a-f]{6}\b/i.test(text)) return null;
  return matches[0][0].toUpperCase();
}

export function getExplicitHue(text: string): number | null {
  const hex = getRequestedAccentHex(text);
  if (hex) return hexToHsl(hex).hue;
  const accentText = accentClause(text)
    ?? text.replace(/\b(?:fondos?|backgrounds?|superficies?|surfaces?)\b[^,.;\n]*/gi, '');
  for (const cue of COLOR_CUES) if (cue.pattern.test(accentText)) return cue.hue;
  return null;
}

export function isBlackThemeRequest(text: string): boolean {
  return /\b(?:negro|negra|black|oled|amoled|pure black)\b/i.test(text) ||
    /#000000\b/i.test(text);
}

/** Explicit user color requests override the model, preventing repetitive outputs. */
export function composeThemeProposal(
  instruction: string,
  draft: ThemeDraft,
  previous?: ThemeProposal,
): ThemeProposal {
  const reference = findStyleReference(instruction);
  const context = previousThemeForRequest(instruction, previous);
  const explicitlyRequestedAccent = getRequestedAccentHex(instruction);
  const explicitHue = getExplicitHue(instruction);
  const blackRequested = isBlackThemeRequest(instruction) &&
    !(explicitlyRequestedAccent === '#000000' && !/\b(?:fondo|background|oled|amoled)\b/i.test(instruction));
  const backgroundOnly = /\b(?:fondo|background|superficie|modo oscuro|oled|amoled)\b/i.test(instruction);
  const monochromeBlack = blackRequested && explicitHue === null && !backgroundOnly;

  // Like the official HeroUI Theme Builder, retain hue, chroma (saturation),
  // lightness and neutral temperature as independent design decisions.
  // An explicit color/reference always overrides the model's accent.
  const referenceAccent = reference ? hexToHsl(reference.accent) : null;
  const modelAccent = hexToHsl(draft.accent);
  const previousLightAccent = context ? hexToHsl(context.light.accent) : null;
  const previousDarkAccent = context ? hexToHsl(context.dark.accent) : null;
  const basis = previousLightAccent && explicitHue === null ? previousLightAccent : modelAccent;
  const hue = monochromeBlack ? 0
    : explicitHue ?? (referenceAccent?.hue ?? basis.hue);

  // Real neutral swatches influence the surface temperature. Previously all
  // neutrals were forced to a minimum saturation and the brand hue.
  const neutralFromModel = hexToHsl(reference?.neutral ??
    (context && !/\b(?:neutro|neutral|gris|grises|gray|grey|c[aá]lido|fr[ií]o)\b/i.test(instruction)
      ? context.light.border
      : draft.neutral));
  const warm = /\b(?:c[aá]lid[oa]s?|warm)\b/i.test(instruction);
  const cool = /\b(?:fr[ií][oa]s?|cool)\b/i.test(instruction);
  const neutralHue = reference ? 0 : warm ? 34 : cool ? 215 : neutralFromModel.hue;
  const high = /\b(?:alto contraste|contraste alto|high contrast|accesible|accessibility)\b/i.test(instruction) ||
    draft.contrast === 'high';
  const soft = !high && (/\b(?:suave|pastel|apagado|soft|muted)\b/i.test(instruction) || draft.contrast === 'soft');
  const desaturate = /\b(?:menos saturad[oa]|reduce? la saturaci[oó]n|desaturad[oa])\b/i.test(instruction);
  const saturate = /\b(?:m[aá]s saturad[oa]|aumenta la saturaci[oó]n|ne[oó]n|neon|vibrante|vibrant)\b/i.test(instruction);
  const saturationFactor = desaturate ? 0.65 : saturate ? 1.2 : soft ? 0.8 : 1;
  const toneSaturation = monochromeBlack ? 0 : clamp(
    basis.saturation * saturationFactor * (high ? 1.03 : 1), 0, 96,
  );
  const neutralSaturation = monochromeBlack || reference ? 0
    : warm || cool ? clamp(neutralFromModel.saturation, 6, 18)
    : clamp(neutralFromModel.saturation * 0.65, 0, 18);
  const neutral = (saturation: number, lightness: number) =>
    hslToHex(neutralHue, saturation, lightness);
  const statusColor = (statusHue: number, mode: 'light' | 'dark') =>
    hslToHex(statusHue, soft ? 53 : 69, mode === 'light' ? 42 : 66);
  const darkStyle = blackRequested ? 'black' : reference?.defaultDarkStyle
    ?? (/\b(?:carb[oó]n|charcoal|grafito|graphite)\b/i.test(instruction) ? 'charcoal' : draft.darkStyle);
  const neutralDepth = neutralFromModel.lightness / 100;
  const darkBackground = blackRequested ? '#000000' : reference?.darkBackground ??
    neutral(darkStyle === 'charcoal' ? neutralSaturation / 2 : neutralSaturation, darkStyle === 'charcoal' ? 7 + neutralDepth * 4 : 8 + neutralDepth * 8);
  const darkSurface = blackRequested ? '#111111' : reference?.darkSurface ??
    neutral(darkStyle === 'charcoal' ? neutralSaturation / 2 : neutralSaturation, 13 + neutralDepth * 10);
  const useReferenceAccent = referenceAccent !== null && explicitlyRequestedAccent === null &&
    explicitHue === null && !monochromeBlack;

  // Honor the model's chosen brightness: distinct colors shouldn't collapse
  // onto the same hard-coded 43% (light) / 69% (dark) lightness.
  // Clamp only for usable themed components; foregrounds are derived later.
  const lightLightness = clamp(basis.lightness, high ? 29 : 32, high ? 45 : 57);
  const darkLightness = clamp(
    Math.max(previousDarkAccent && explicitHue === null ? previousDarkAccent.lightness : basis.lightness + 17, 60),
    55, 78,
  );
  const lightAccent = monochromeBlack
    ? hslToHex(0, 0, 17)
    : explicitlyRequestedAccent ?? (useReferenceAccent
      ? hslToHex(hue, referenceAccent.saturation, clamp(referenceAccent.lightness, 32, 39))
      : hslToHex(hue, toneSaturation, lightLightness));
  const darkAccent = monochromeBlack
    ? hslToHex(0, 0, 88)
    : explicitlyRequestedAccent ?? (useReferenceAccent && reference
      ? reference.accent : hslToHex(hue, toneSaturation, darkLightness));
  const light: AIColors = {
    background: neutral(neutralSaturation * 0.7, high ? 98 : 92 + neutralDepth * 6),
    foreground: neutral(15, 13),
    surface: neutral(neutralSaturation / 2, high ? 100 : 98 + neutralDepth * 2),
    accent: lightAccent,
    muted: neutral(10, high ? 34 : 39),
    border: neutral(neutralSaturation / 2, 84),
    success: statusColor(151, 'light'),
    warning: statusColor(38, 'light'),
    danger: statusColor(3, 'light'),
  };
  const dark: AIColors = {
    background: darkBackground,
    foreground: '#F6F6F8',
    surface: darkSurface,
    accent: darkAccent,
    muted: neutral(9, 75),
    border: neutral(neutralSaturation / 2, 30),
    success: statusColor(151, 'dark'),
    warning: statusColor(38, 'dark'),
    danger: statusColor(3, 'dark'),
  };
  const radius = /\b(?:sin bordes redondeados|esquinas rectas|square corners)\b/i.test(instruction)
    ? 0
    : /\b(?:muy redondeado|muy redondeados|rounded)\b/i.test(instruction)
      ? Math.max(14, draft.radius) : draft.radius;

  if (contrastRatio(light.foreground, light.background) < 4.5 ||
    contrastRatio(dark.foreground, dark.background) < 4.5) {
    throw new Error('Could not ensure adequate text contrast.');
  }
  return {
    name: draft.name,
    description: draft.description,
    radius,
    light,
    dark,
  };
}
