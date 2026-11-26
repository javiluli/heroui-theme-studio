import { getThemeVariables, MODES, type ThemeConfig } from "./model";

export type ThemePlatform = "web" | "native";

const webSelectors = {
  light: ':root:not(.dark):not([data-theme="dark"]),\n.light,\n.default,\n[data-theme="light"],\n[data-theme="default"]',
  dark: '.dark,\n[data-theme="dark"]',
};

export function exportThemeCss(theme: ThemeConfig, platform: ThemePlatform = "web"): string {
  const native = platform === "native";
  const blocks = MODES.flatMap((mode) => {
    const variables = getThemeVariables(theme.overrides[mode], native);
    if (native) delete variables["--font-sans"];
    const entries = Object.entries(variables);
    if (!entries.length) return [];
    const indent = native ? "    " : "";
    const selector = native ? "@variant " + mode : webSelectors[mode];
    return [[
      indent + selector + " {",
      ...entries.map(([name, value]) => indent + "  " + name + ": " + value + ";"),
      indent + "}",
    ].join("\n")];
  }).join("\n\n");

  const notes = [native
    ? "/* HeroUI Native · add after heroui-native/styles in global.css. */"
    : "/* HeroUI React v3 · add after @heroui/styles. */"];
  if (MODES.some((mode) => theme.overrides[mode]["font-sans"])) {
    notes.push(native
      ? "/* Configure custom font weights through Expo and Uniwind. */"
      : "/* Load any custom fonts used by --font-sans in your application. */");
  }
  const content = blocks && native ? "@layer theme {\n  :root {\n" + blocks + "\n  }\n}" : blocks;
  return notes.join("\n") + "\n\n" + (content || "/* Uses the default theme variables. */") + "\n";
}
