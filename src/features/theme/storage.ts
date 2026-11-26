import { isThemeValue } from "./conversion";
import { DEFAULT_THEME, MODES, isThemeToken, type ThemeConfig, type ThemeMode, type ThemeOverrides } from "./model";
import { LEGACY_DEFAULT_PALETTES } from "./legacy-default";
import { FONT_STACKS } from "./typography";

const STORAGE_PREFIX = "hero-theme-studio:theme:v";
const MODE_KEY = "hero-theme-studio:mode";

// v6/v7 stored these resolved defaults alongside actual edits.
const formerDefaults: Record<string, readonly [string, string?]> = {
  "accent": ["oklch(0.6204 0.195 253.83)"],
  "accent-foreground": ["oklch(0.9911 0 0)"],
  "background": ["oklch(0.9702 0 0)", "oklch(12% 0.005 285.823)"],
  "border": ["oklch(90% 0.004 286.32)", "oklch(28% 0.006 286.033)"],
  "danger": ["oklch(0.6532 0.2328 25.74)", "oklch(0.594 0.1967 24.63)"],
  "danger-foreground": ["oklch(0.9911 0 0)"],
  "default": ["oklch(94% 0.001 286.375)", "oklch(27.4% 0.006 286.033)"],
  "default-foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "field-background": ["oklch(100% 0 0)", "oklch(0.2103 0.0059 285.89)"],
  "field-border": ["transparent"],
  "field-foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "field-placeholder": ["oklch(0.5517 0.0138 285.94)", "oklch(70.5% 0.015 286.067)"],
  "focus": ["oklch(0.6204 0.195 253.83)"],
  "foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "muted": ["oklch(0.5517 0.0138 285.94)", "oklch(70.5% 0.015 286.067)"],
  "overlay": ["oklch(100% 0 0)", "oklch(0.2103 0.0059 285.89)"],
  "overlay-foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "scrollbar": ["oklch(87.10% 0.0015 253.83)", "oklch(70.50% 0.0015 253.83)"],
  "segment": ["oklch(100% 0 0)", "oklch(0.3964 0.01 285.93)"],
  "segment-foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "separator": ["oklch(92% 0.004 286.32)", "oklch(25% 0.006 286.033)"],
  "success": ["oklch(0.7329 0.1935 150.81)"],
  "success-foreground": ["oklch(0.2103 0.0059 285.89)"],
  "surface": ["oklch(100% 0 0)", "oklch(0.2103 0.0059 285.89)"],
  "surface-foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "surface-secondary": ["oklch(0.9524 0.0013 286.37)", "oklch(0.257 0.0037 286.14)"],
  "surface-secondary-foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "surface-tertiary": ["oklch(0.9373 0.0013 286.37)", "oklch(0.2721 0.0024 247.91)"],
  "surface-tertiary-foreground": ["oklch(0.2103 0.0059 285.89)", "oklch(0.9911 0 0)"],
  "warning": ["oklch(0.7819 0.1585 72.33)", "oklch(0.8203 0.1388 76.34)"],
  "warning-foreground": ["oklch(0.2103 0.0059 285.89)"],
};

export function loadThemeMode(): ThemeMode {
  try { return localStorage.getItem(MODE_KEY) === "light" ? "light" : "dark"; }
  catch { return "dark"; }
}

export function saveThemeMode(mode: ThemeMode) {
  try { localStorage.setItem(MODE_KEY, mode); }
  catch { /* Storage can be disabled. */ }
}

export function loadTheme(): ThemeConfig {
  for (const version of [8, 7, 6, 5, 4, 3]) {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + version);
      if (!stored) continue;
      const data = JSON.parse(stored);
      const modes = version === 8 ? data.overrides : data.palettes;
      if (!modes?.light || !modes.dark) continue;
      const overrides: ThemeConfig["overrides"] = { light: {}, dark: {} };
      for (const mode of MODES) {
        const values: ThemeOverrides = overrides[mode];
        for (const [name, value] of Object.entries(modes[mode])) {
          const token = name === "scrollbar" ? "scrollbar-thumb" : name;
          if (!isThemeToken(token) || !isThemeValue(token, value)) continue;
          if (version < 8 && data.name !== "HeroUI Theme Builder") {
            const former = formerDefaults[name];
            const snapshot = LEGACY_DEFAULT_PALETTES[mode][token as keyof typeof LEGACY_DEFAULT_PALETTES.light];
            const baseline = mode === "dark" ? former?.[1] ?? former?.[0] : former?.[0];
            if (value === baseline || (version <= 5 && value === snapshot)) continue;
          }
          if (token !== "scrollbar-thumb" || value !== "var(--scrollbar-thumb)") values[token] = value;
        }
        if (version === 8) continue;
        const settings = data.modeSettings?.[mode] ?? data;
        const { radius, fieldRadius, fieldRadiusScale } = settings;
        if (typeof radius === "number" && radius >= 0 && (radius !== 8 || settings !== data)) values.radius = radius + "px";
        if (typeof fieldRadius === "number" && fieldRadius >= 0 && (fieldRadius !== 12 || values.radius !== undefined)) {
          values["field-radius"] = fieldRadius + "px";
        } else if (typeof fieldRadiusScale === "number" && fieldRadiusScale >= 0 && fieldRadiusScale !== 1.5) {
          values["field-radius"] = `calc(var(--radius) * ${fieldRadiusScale})`;
        }
        const font = settings.fontSans ?? FONT_STACKS[data.fontFamily as keyof typeof FONT_STACKS];
        if (isThemeValue("font-sans", font) && (font !== FONT_STACKS.system || settings !== data)) values["font-sans"] = font;
      }
      return { name: typeof data.name === "string" ? data.name.slice(0, 80) : DEFAULT_THEME.name, overrides };
    } catch { /* Try the preceding version if a saved entry is unreadable. */ }
  }
  return DEFAULT_THEME;
}

export function saveTheme(theme: ThemeConfig) {
  try { localStorage.setItem(STORAGE_PREFIX + 8, JSON.stringify(theme)); }
  catch { /* Storage can be disabled. */ }
}
