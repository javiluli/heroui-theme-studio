import { useCallback, useRef, useState } from "react";
import { type ThemeConfig, type ThemeMode, type ThemeToken } from "./model";
import { createPreset, findPresetId, type PresetId } from "./templates";
import { loadTheme, loadThemeMode, saveTheme, saveThemeMode } from "./storage";

export function useThemeEditor() {
  const [theme, setTheme] = useState(loadTheme);
  const [mode, setActiveMode] = useState(loadThemeMode);
  const latest = useRef(theme);

  const updateTheme = useCallback((next: ThemeConfig) => {
    latest.current = next;
    setTheme(next);
    saveTheme(next);
  }, []);

  const setMode = (next: ThemeMode) => {
    setActiveMode(next);
    saveThemeMode(next);
  };

  const setToken = useCallback((token: ThemeToken, value?: string) => {
    const current = latest.current;
    const overrides = { ...current.overrides[mode] };
    if (value === undefined) delete overrides[token];
    else overrides[token] = value;
    updateTheme({ ...current, overrides: { ...current.overrides, [mode]: overrides } });
  }, [mode, updateTheme]);

  const applyPreset = (preset: PresetId) => updateTheme(createPreset(preset));

  return { theme, mode, setMode, selectedPreset: findPresetId(theme), setToken, importTheme: updateTheme, applyPreset };
}
