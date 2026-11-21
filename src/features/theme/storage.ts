import { COLOR_TOKENS, MODES, type ThemeConfig, type ThemeMode } from './model';
import { LEGACY_DEFAULT_PALETTES } from './legacy-default';
import { createPreset } from './templates';
import { isEditableColor } from './conversion';
import { isAllowedFontSans } from './mode-layout';

/** v7 retains custom colors across both native HeroUI and Theme Builder presets. */
export const STORAGE_KEY = 'hero-theme-studio:theme:v7';
const LINK_PREFERENCE_KEY = 'hero-theme-studio:native-color-links';
const MODE_PREFERENCE_KEY = 'hero-theme-studio:mode';

export function loadThemeMode(): ThemeMode {
  try { return window.localStorage.getItem(MODE_PREFERENCE_KEY) === 'light' ? 'light' : 'dark'; }
  catch { return 'dark'; }
}

export function saveThemeMode(mode: ThemeMode): void {
  try { window.localStorage.setItem(MODE_PREFERENCE_KEY, mode); }
  catch { /* Private sessions may block storage. */ }
}

export function loadNativeColorLinks(): boolean {
  try { return window.localStorage.getItem(LINK_PREFERENCE_KEY) !== 'off'; }
  catch { return true; }
}

export function saveNativeColorLinks(enabled: boolean): void {
  try { window.localStorage.setItem(LINK_PREFERENCE_KEY, enabled ? 'on' : 'off'); }
  catch { /* Private sessions may block storage. */ }
}

export function isThemeConfig(value: unknown): value is ThemeConfig {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Partial<ThemeConfig>;
  if (typeof data.name !== 'string' || data.name.length > 80) return false;
  if (!Number.isFinite(data.radius) || data.radius! < 0 || data.radius! > 32) return false;
  if (!Number.isFinite(data.fieldRadius) || data.fieldRadius! < 0 || data.fieldRadius! > 48) return false;
  if (!['system', 'rounded', 'serif', 'mono'].includes(data.fontFamily ?? '')) return false;
  if (data.modeSettings !== undefined) {
    if (!data.modeSettings || typeof data.modeSettings !== 'object' || Array.isArray(data.modeSettings)) return false;
    for (const mode of MODES) {
      const settings = data.modeSettings[mode];
      if (settings === undefined) continue;
      if (typeof settings !== 'object' || settings === null) return false;
      if (!Number.isFinite(settings.radius) || settings.radius < 0 || settings.radius > 32) return false;
      if (!Number.isFinite(settings.fieldRadius) || settings.fieldRadius < 0 || settings.fieldRadius > 48) return false;
      if (!isAllowedFontSans(settings.fontSans)) return false;
    }
  }
  if (!data.palettes || typeof data.palettes !== 'object') return false;
  return MODES.every((mode) => {
    const palette = data.palettes?.[mode];
    return palette && COLOR_TOKENS.every((token) => isEditableColor(palette[token]));
  });
}

function migrateStoredTheme(raw: unknown, legacy: boolean): ThemeConfig | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const data = raw as Record<string, unknown>;
  const base = createPreset();
  const modes = data.palettes as Record<string, unknown> | undefined;
  if (!modes || typeof modes !== 'object') return null;
  const palettes = { light: { ...base.palettes.light }, dark: { ...base.palettes.dark } };
  for (const mode of MODES) {
    const original = modes[mode];
    if (!original || typeof original !== 'object') return null;
    for (const token of COLOR_TOKENS) {
      const value = (original as Record<string, unknown>)[token];
      if (isEditableColor(value)) {
        palettes[mode][token] = legacy && value === LEGACY_DEFAULT_PALETTES[mode][token]
          ? base.palettes[mode][token] : value;
      }
    }
    // Previously absent contract tokens get their nearest semantic predecessor.
    const old = original as Record<string, unknown>;
    if (!isEditableColor(old.focus) && isEditableColor(old.accent)) palettes[mode].focus = old.accent;
    if (!isEditableColor(old['field-placeholder']) && isEditableColor(old.muted)) {
      palettes[mode]['field-placeholder'] = old.muted;
    }
  }
  const next: ThemeConfig = {
    name: typeof data.name === 'string' ? data.name : base.name,
    radius: typeof data.radius === 'number' ? data.radius : 8,
    fieldRadius: typeof data.fieldRadius === 'number'
      ? data.fieldRadius
      : Math.round((typeof data.radius === 'number' ? data.radius : 8) *
        (typeof data.fieldRadiusScale === 'number' ? data.fieldRadiusScale : 1.5)),
    fontFamily: ['system', 'rounded', 'serif', 'mono'].includes(String(data.fontFamily))
      ? data.fontFamily as ThemeConfig['fontFamily'] : 'system',
    palettes,
    ...(data.modeSettings !== undefined ? { modeSettings: data.modeSettings as ThemeConfig['modeSettings'] } : {}),
  };
  return isThemeConfig(next) ? next : null;
}

export function loadTheme(): ThemeConfig {
  if (typeof window === 'undefined') return createPreset();
  let storage: Storage;
  try { storage = window.localStorage; }
  catch { return createPreset(); }

  for (const version of [7, 6, 5, 4, 3]) {
    try {
      const stored = storage.getItem(version === 7 ? STORAGE_KEY : `hero-theme-studio:theme:v${version}`);
      if (!stored) continue;
      const migrated = migrateStoredTheme(JSON.parse(stored) as unknown, version <= 5);
      if (migrated) return migrated;
    } catch {
      // A damaged record must not mask a recoverable theme saved under an older key.
    }
  }
  return createPreset();
}

export function saveTheme(theme: ThemeConfig): void {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(theme)); }
  catch { /* Private sessions may block storage. */ }
}
