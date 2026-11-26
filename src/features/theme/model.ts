export const MODES = ["light", "dark"] as const;
export type ThemeMode = (typeof MODES)[number];

export const TOKEN_GROUPS = [
  { title: "Brand and actions", tokens: ["accent", "accent-foreground", "default", "default-foreground", "focus", "link"] },
  {
    title: "Page and surfaces",
    tokens: [
      "background", "foreground", "muted",
      "surface", "surface-foreground",
      "surface-secondary", "surface-secondary-foreground",
      "surface-tertiary", "surface-tertiary-foreground",
      "overlay", "overlay-foreground", "backdrop",
    ],
  },
  { title: "Forms", tokens: ["field-background", "field-foreground", "field-placeholder", "field-border"] },
  {
    title: "Status colors",
    tokens: ["success", "success-foreground", "warning", "warning-foreground", "danger", "danger-foreground"],
  },
  { title: "Borders and segments", tokens: ["border", "separator", "scrollbar-thumb", "segment", "segment-foreground"] },
] as const;

export const COLOR_TOKENS = TOKEN_GROUPS.flatMap(({ tokens }) => [...tokens]);
export type ColorToken = (typeof COLOR_TOKENS)[number];

export const LENGTH_TOKENS = {
  radius: 32,
  "field-radius": 48,
  "border-width": 8,
  "field-border-width": 8,
} as const;
export type LengthToken = keyof typeof LENGTH_TOKENS;

export type ThemeToken = ColorToken | LengthToken | "font-sans";
export type ThemeOverrides = Partial<Record<ThemeToken, string>>;

export interface ThemeConfig {
  name: string;
  overrides: Record<ThemeMode, ThemeOverrides>;
}

export const DEFAULT_THEME: ThemeConfig = {
  name: "HeroUI Default",
  overrides: { light: {}, dark: {} },
};

export const THEME_TOKENS: readonly ThemeToken[] = [
  ...COLOR_TOKENS, ...Object.keys(LENGTH_TOKENS) as LengthToken[], "font-sans",
];

export function isThemeToken(token: string): token is ThemeToken {
  return (THEME_TOKENS as readonly string[]).includes(token);
}

export function getThemeVariables(overrides: ThemeOverrides, native = false): Record<string, string> {
  return Object.fromEntries(Object.entries(overrides)
    .filter(([token]) => !native || token !== "scrollbar-thumb")
    .map(([token, value]) => ["--" + token, value]));
}
