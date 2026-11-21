/** Only props actually supported by HeroUI React v3. */
export const SIZES = [
  { key: "sm", label: "Small" },
  { key: "md", label: "Medium" },
  { key: "lg", label: "Large" },
] as const;

export const BUTTON_VARIANTS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "tertiary", label: "Tertiary" },
  { key: "outline", label: "Outline" },
  { key: "ghost", label: "Ghost" },
  { key: "danger", label: "Danger" },
  { key: "danger-soft", label: "Danger soft" },
] as const;

export const CHIP_VARIANTS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "tertiary", label: "Tertiary" },
  { key: "soft", label: "Soft" },
] as const;

export const CHIP_COLORS = [
  { key: "default", label: "Default" },
  { key: "accent", label: "Accent" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "danger", label: "Danger" },
] as const;

export type Size = (typeof SIZES)[number]["key"];
export type ChipVariant = (typeof CHIP_VARIANTS)[number]["key"];
export type ChipColor = (typeof CHIP_COLORS)[number]["key"];
