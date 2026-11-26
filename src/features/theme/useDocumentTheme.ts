import { useLayoutEffect } from "react";
import { getThemeVariables, type ThemeConfig, type ThemeMode } from "./model";

/** Use the same root as HeroUI so portals inherit the active overrides. */
export function useDocumentTheme(theme: ThemeConfig, mode: ThemeMode) {
  const overrides = theme.overrides[mode];
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");
    const variables = Object.entries(getThemeVariables(overrides));
    for (const [name, value] of variables) root.style.setProperty(name, value);
    return () => {
      for (const [name] of variables) root.style.removeProperty(name);
    };
  }, [mode, overrides]);
}
