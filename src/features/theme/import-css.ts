import { MODES, isThemeToken, type ThemeConfig, type ThemeMode, type ThemeOverrides } from "./model";
import { isThemeValue } from "./conversion";
import type { ThemePlatform } from "./export-css";

export const MINIMAL_THEME_CSS: Record<ThemePlatform, string> = {
  web: `[data-theme="light"] {
  --accent: #2563EB;
}`,
  native: `@layer theme {
  :root {
    @variant light {
      --accent: #2563EB;
    }
  }
}`,
};

function blockMode(selector: string): ThemeMode | "shared" | null {
  const selectors = selector.trim().split(/\s*,\s*/);
  for (const mode of MODES) {
    if (selectors.some((part) => part === "." + mode || part === "@variant " + mode ||
      part.replace(/['"]/g, "") === `[data-theme=${mode}]`)) return mode;
  }
  if (selectors.some((part) => part === ".default" || part.replace(/['"]/g, "") === "[data-theme=default]")) return "light";
  if (selectors.includes(":root") || selector.trim() === "@theme") return "shared";
  return null;
}

/** Read declarations from named HeroUI theme blocks and keep approved CSS values verbatim. */
export function parseThemeCss(source: string): ThemeConfig {
  if (!source.trim()) throw new Error("Paste your theme CSS first.");
  if (source.length > 100_000) throw new Error("The CSS exceeds the 100 KB limit.");

  const blocks: Record<ThemeMode | "shared", ThemeOverrides> = { shared: {}, light: {}, dark: {} };
  for (const [, selector, body] of source.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const mode = blockMode(selector);
    if (!mode) continue;
    for (const declaration of body.split(";")) {
      const match = /^\s*--([a-z][a-z0-9-]*)\s*:\s*([\s\S]+?)\s*$/.exec(declaration);
      if (!match) continue;
      const [, name, value] = match;
      const token = name === "scrollbar" ? "scrollbar-thumb" : name;
      if (!isThemeToken(token)) continue;
      if (name === "scrollbar" && value === "var(--scrollbar-thumb)") continue;
      if (!isThemeValue(token, value)) throw new Error(`Invalid CSS value for --${name} in the ${mode} block.`);
      blocks[mode][token] = value;
    }
  }
  if (!Object.values(blocks).some((block) => Object.keys(block).length)) {
    throw new Error("No editable HeroUI variables found in a theme block.");
  }
  return {
    name: "Imported CSS theme",
    overrides: {
      light: { ...blocks.shared, ...blocks.light },
      dark: { ...blocks.shared, ...blocks.dark },
    },
  };
}
