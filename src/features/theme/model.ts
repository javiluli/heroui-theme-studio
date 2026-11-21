export const MODES = ["light", "dark"] as const;
export type ThemeMode = (typeof MODES)[number];

/** Exact user-selected, public HeroUI v3 theme variables. Do not add calculated tokens. */
export const COLOR_TOKENS = [
  "accent",
  "accent-foreground",
  "background",
  "border",
  "danger",
  "danger-foreground",
  "default",
  "default-foreground",
  "field-background",
  "field-border",
  "field-foreground",
  "field-placeholder",
  "focus",
  "foreground",
  "muted",
  "overlay",
  "overlay-foreground",
  "scrollbar",
  "segment",
  "segment-foreground",
  "separator",
  "success",
  "success-foreground",
  "surface",
  "surface-foreground",
  "surface-secondary",
  "surface-secondary-foreground",
  "surface-tertiary",
  "surface-tertiary-foreground",
  "warning",
  "warning-foreground",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];
export type Palette = Record<ColorToken, string>;

export interface ModeSettings {
  radius: number;
  fieldRadius: number;
  fontSans: string;
}

export interface ThemeConfig {
  name: string;
  radius: number;
  fieldRadius: number;
  fontFamily: "system" | "rounded" | "serif" | "mono";
  palettes: Record<ThemeMode, Palette>;
  /** Optional independent Light/Dark CSS geometry and font, for imported themes. */
  modeSettings?: Partial<Record<ThemeMode, ModeSettings>>;
}

export const TOKEN_GROUPS: ReadonlyArray<{ title: string; tokens: readonly ColorToken[] }> = [
  {
    title: "Brand and actions",
    tokens: ["accent", "accent-foreground", "focus", "default", "default-foreground"],
  },
  {
    title: "Page and surfaces",
    tokens: [
      "background", "foreground", "muted",
      "surface", "surface-foreground",
      "surface-secondary", "surface-secondary-foreground",
      "surface-tertiary", "surface-tertiary-foreground",
      "overlay", "overlay-foreground",
    ],
  },
  {
    title: "Borders and fields",
    tokens: [
      "border", "separator", "scrollbar",
      "field-background", "field-foreground", "field-placeholder", "field-border",
    ],
  },
  {
    title: "Status colors",
    tokens: [
      "success", "success-foreground",
      "warning", "warning-foreground",
      "danger", "danger-foreground",
    ],
  },
  {
    title: "Segments",
    tokens: ["segment", "segment-foreground"],
  },
];

/** Canonical values and aliases from installed @heroui/styles 3.2.7. */
const light: Palette = {
  accent: "oklch(0.6204 0.195 253.83)",
  "accent-foreground": "var(--snow)",
  background: "oklch(0.9702 0 0)",
  border: "oklch(90% 0.004 286.32)",
  danger: "oklch(0.6532 0.2328 25.74)",
  "danger-foreground": "var(--snow)",
  default: "oklch(94% 0.001 286.375)",
  "default-foreground": "var(--eclipse)",
  "field-background": "var(--white)",
  "field-border": "transparent",
  "field-foreground": "oklch(0.2103 0.0059 285.89)",
  "field-placeholder": "var(--muted)",
  focus: "var(--accent)",
  foreground: "var(--eclipse)",
  muted: "oklch(0.5517 0.0138 285.94)",
  overlay: "var(--white)",
  "overlay-foreground": "var(--foreground)",
  scrollbar: "var(--scrollbar-thumb)",
  segment: "var(--white)",
  "segment-foreground": "var(--eclipse)",
  separator: "oklch(92% 0.004 286.32)",
  success: "oklch(0.7329 0.1935 150.81)",
  "success-foreground": "var(--eclipse)",
  surface: "var(--white)",
  "surface-foreground": "var(--foreground)",
  "surface-secondary": "oklch(0.9524 0.0013 286.37)",
  "surface-secondary-foreground": "var(--foreground)",
  "surface-tertiary": "oklch(0.9373 0.0013 286.37)",
  "surface-tertiary-foreground": "var(--foreground)",
  warning: "oklch(0.7819 0.1585 72.33)",
  "warning-foreground": "var(--eclipse)",
};

const dark: Palette = {
  accent: "oklch(0.6204 0.195 253.83)",
  "accent-foreground": "var(--snow)",
  background: "oklch(12% 0.005 285.823)",
  border: "oklch(28% 0.006 286.033)",
  danger: "oklch(0.594 0.1967 24.63)",
  "danger-foreground": "var(--snow)",
  default: "oklch(27.4% 0.006 286.033)",
  "default-foreground": "var(--snow)",
  "field-background": "oklch(0.2103 0.0059 285.89)",
  "field-border": "transparent",
  "field-foreground": "var(--foreground)",
  "field-placeholder": "var(--muted)",
  focus: "var(--accent)",
  foreground: "var(--snow)",
  muted: "oklch(70.5% 0.015 286.067)",
  overlay: "oklch(0.2103 0.0059 285.89)",
  "overlay-foreground": "var(--foreground)",
  scrollbar: "var(--scrollbar-thumb)",
  segment: "oklch(0.3964 0.01 285.93)",
  "segment-foreground": "var(--foreground)",
  separator: "oklch(25% 0.006 286.033)",
  success: "oklch(0.7329 0.1935 150.81)",
  "success-foreground": "var(--eclipse)",
  surface: "oklch(0.2103 0.0059 285.89)",
  "surface-foreground": "var(--foreground)",
  "surface-secondary": "oklch(0.257 0.0037 286.14)",
  "surface-secondary-foreground": "var(--foreground)",
  "surface-tertiary": "oklch(0.2721 0.0024 247.91)",
  "surface-tertiary-foreground": "var(--foreground)",
  warning: "oklch(0.8203 0.1388 76.34)",
  "warning-foreground": "var(--eclipse)",
};

export const DEFAULT_THEME: ThemeConfig = {
  name: "HeroUI Default",
  radius: 8,
  fieldRadius: 12,
  fontFamily: "system",
  palettes: { light, dark },
};
