import { useCallback, useMemo, useRef, useState } from "react";
import { type ColorToken, type ThemeConfig, type ThemeMode } from "./model";
import { createPreset, findPresetId, type PresetId } from "./templates";
import {
  isThemeConfig, loadNativeColorLinks, loadTheme, loadThemeMode,
  saveNativeColorLinks, saveTheme, saveThemeMode,
} from "./storage";
import { changeColor } from "./reducer";
import { FONT_STACKS } from "./typography";
import { getModeSettings } from "./mode-layout";
import { makeThemeIndependent } from "./conversion";
import { withNativeColorLinks } from "./native-color-links";

export function useThemeEditor() {
  const [theme, setTheme] = useState(() => makeThemeIndependent(loadTheme()));
  const [mode, setActiveMode] = useState(loadThemeMode);
  const [syncModes, setSyncModes] = useState(false);
  const [useNativeLinks, setUseNativeLinks] = useState(loadNativeColorLinks);
  const [selectedPreset, setSelectedPreset] = useState<PresetId | "custom">(
    () => findPresetId(theme),
  );
  const previewTheme = useMemo(() => useNativeLinks ? withNativeColorLinks(theme) : theme, [useNativeLinks, theme]);
  const setMode = useCallback((next: ThemeMode) => {
    setActiveMode(next);
    saveThemeMode(next);
  }, []);
  const toggleNativeLinks = useCallback((enabled: boolean) => {
    setUseNativeLinks(enabled);
    saveNativeColorLinks(enabled);
  }, []);
  const latestTheme = useRef(theme);
  const updateTheme = useCallback((update: (current: ThemeConfig) => ThemeConfig) => {
    const next = update(latestTheme.current);
    if (next === latestTheme.current) return;
    // Only confirmed edits reach storage, including when the page reloads immediately.
    latestTheme.current = next;
    saveTheme(next);
    setTheme(next);
  }, []);

  const setColor = useCallback(
    (token: ColorToken, color: string) => {
      setSelectedPreset("custom");
      updateTheme((current) =>
        changeColor(current, mode, token, color, syncModes),
      );
    },
    [mode, syncModes, updateTheme],
  );

  const setRadius = useCallback(
    (radius: number) => {
      setSelectedPreset("custom");
      updateTheme((current) =>
        current.modeSettings
          ? {
              ...current,
              modeSettings: {
                ...current.modeSettings,
                [mode]: { ...getModeSettings(current, mode), radius },
              },
            }
          : { ...current, radius },
      );
    },
    [mode, updateTheme],
  );

  const setFieldRadius = useCallback(
    (fieldRadius: number) => {
      setSelectedPreset("custom");
      updateTheme((current) =>
        current.modeSettings
          ? {
              ...current,
              modeSettings: {
                ...current.modeSettings,
                [mode]: { ...getModeSettings(current, mode), fieldRadius },
              },
            }
          : { ...current, fieldRadius },
      );
    },
    [mode, updateTheme],
  );

  const setFontFamily = useCallback(
    (fontFamily: ThemeConfig["fontFamily"]) => {
      setSelectedPreset("custom");
      updateTheme((current) =>
        current.modeSettings
          ? {
              ...current,
              fontFamily,
              modeSettings: {
                ...current.modeSettings,
                [mode]: {
                  ...getModeSettings(current, mode),
                  fontSans: FONT_STACKS[fontFamily],
                },
              },
            }
          : { ...current, fontFamily },
      );
    },
    [mode, updateTheme],
  );

  const importTheme = useCallback((next: ThemeConfig) => {
    if (!isThemeConfig(next)) return;
    updateTheme(() => makeThemeIndependent(next));
    setSelectedPreset("custom");
  }, [updateTheme]);

  const applyPreset = useCallback((preset: PresetId) => {
    updateTheme(() => makeThemeIndependent(createPreset(preset)));
    setSelectedPreset(preset);
  }, [updateTheme]);

  const reset = useCallback(() => {
    updateTheme(() => makeThemeIndependent(createPreset()));
    setSelectedPreset("default");
  }, [updateTheme]);

  return {
    theme,
    previewTheme,
    useNativeLinks,
    toggleNativeLinks,
    mode,
    setMode,
    syncModes,
    setSyncModes,
    selectedPreset,
    setColor,
    setRadius,
    setFieldRadius,
    setFontFamily,
    importTheme,
    applyPreset,
    reset,
  };
}
