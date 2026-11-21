import type { EditableThemeVariable } from "../../theme/token-descriptions";
import { REACT_COMPONENT_SOURCES } from "./react-component-sources";

export type ReactComponentSlug = keyof typeof REACT_COMPONENT_SOURCES;

type VariablePart = {
  part: string;
  context?: string;
} & (
  | { kind: "direct" | "reference"; variables: readonly EditableThemeVariable[] }
  | { kind: "derived"; variable: `--${string}`; sources: readonly EditableThemeVariable[] }
);

export interface ComponentVariableGuide {
  title: string;
  source?: string;
  documentation?: string;
  relatedStyles?: readonly string[];
  note?: string;
  parts: readonly VariablePart[];
}

const buttonCss = "https://github.com/heroui-inc/heroui/blob/v3/packages/styles/components/button.css";
const buttonFocus = { part: "Focus ring", kind: "direct", variables: ["--focus"] } as const;
const secondaryButton = [
  { part: "Background", context: "secondary", kind: "direct", variables: ["--default"] },
  { part: "Text and icons", context: "secondary", kind: "derived",
    variable: "--accent-soft-foreground", sources: ["--accent", "--foreground"] },
  { part: "Hover background", context: "secondary", kind: "derived",
    variable: "--default-hover", sources: ["--default", "--default-foreground"] },
] as const satisfies readonly VariablePart[];

// Concrete uses confirmed in HeroUI v3 component CSS. Definitions live in token-descriptions.ts.
const DETAILED_GUIDES: Partial<Record<ReactComponentSlug, ComponentVariableGuide>> = {
  "input": {
    title: "Input",
    source: "https://github.com/heroui-inc/heroui/blob/v3/packages/styles/components/input.css",
    parts: [
      { part: "Field background", context: "primary", kind: "direct", variables: ["--field-background"] },
      { part: "Field background", context: "secondary", kind: "direct", variables: ["--default"] },
      { part: "Input text", kind: "direct", variables: ["--field-foreground"] },
      { part: "Placeholder text", kind: "direct", variables: ["--field-placeholder"] },
      { part: "Default border", kind: "direct", variables: ["--field-border"] },
      { part: "Corner radius", kind: "direct", variables: ["--field-radius"] },
      { part: "Hover background", context: "primary", kind: "derived",
        variable: "--field-hover", sources: ["--field-background", "--field-foreground"] },
      { part: "Focus background", context: "primary", kind: "derived",
        variable: "--field-focus", sources: ["--field-background"] },
      { part: "Hover background", context: "secondary", kind: "derived",
        variable: "--default-hover", sources: ["--default", "--default-foreground"] },
      { part: "Hover border", kind: "derived",
        variable: "--field-border-hover", sources: ["--field-border", "--field-foreground"] },
      { part: "Focus border", kind: "derived",
        variable: "--field-border-focus", sources: ["--field-border", "--field-foreground"] },
      { part: "Focus ring", kind: "direct", variables: ["--focus"] },
      { part: "Invalid-state outline and focus ring", kind: "direct", variables: ["--danger"] },
    ],
  },
  "button": {
    title: "Button",
    source: buttonCss,
    documentation: "https://heroui.com/en/docs/react/components/button",
    parts: [
      { part: "Background", context: "primary", kind: "direct", variables: ["--accent"] },
      { part: "Text and icons", context: "primary", kind: "direct", variables: ["--accent-foreground"] },
      ...secondaryButton,
      { part: "Background", context: "tertiary", kind: "direct", variables: ["--default"] },
      { part: "Hover background", context: "primary", kind: "derived",
        variable: "--accent-hover", sources: ["--accent", "--accent-foreground"] },
      { part: "Outline", context: "outline", kind: "direct", variables: ["--border"] },
      buttonFocus,
      { part: "Corner radius", kind: "direct", variables: ["--radius"] },
      { part: "Background", context: "danger", kind: "direct", variables: ["--danger"] },
      { part: "Text and icons", context: "danger", kind: "direct", variables: ["--danger-foreground"] },
      { part: "Hover background", context: "danger", kind: "derived",
        variable: "--danger-hover", sources: ["--danger", "--danger-foreground"] },
      { part: "Hover background", context: "ghost", kind: "direct", variables: ["--default"] },
      { part: "Hover background", context: "outline, mixed with transparency", kind: "direct", variables: ["--default"] },
      { part: "Text and icons", context: "ghost / outline", kind: "direct", variables: ["--default-foreground"] },
      { part: "Soft background", context: "danger-soft", kind: "derived",
        variable: "--danger-soft", sources: ["--danger"] },
      { part: "Text and icons", context: "danger-soft", kind: "derived",
        variable: "--danger-soft-foreground", sources: ["--danger", "--foreground"] },
    ],
  },
  "button-group": {
    title: "ButtonGroup · direct buttons",
    source: "https://github.com/heroui-inc/heroui/blob/v3/packages/styles/components/button-group.css",
    documentation: "https://heroui.com/en/docs/react/components/button-group",
    note: "The group shares its variant with Copy and Reset. The separator inherits the text color.",
    parts: [
      ...secondaryButton,
      buttonFocus,
      { part: "Outer corner radius", kind: "direct", variables: ["--radius"] },
    ],
  },
  "tabs": {
    title: "Tabs",
    source: "https://github.com/heroui-inc/heroui/blob/v3/packages/styles/components/tabs.css",
    parts: [
      { part: "Tab list background", context: "primary", kind: "direct", variables: ["--default"] },
      { part: "Selection indicator", context: "primary", kind: "direct", variables: ["--segment"] },
      { part: "Active tab text", context: "primary", kind: "direct", variables: ["--segment-foreground"] },
      { part: "Inactive text", kind: "direct", variables: ["--muted"] },
      { part: "Indicator line", context: "secondary", kind: "direct", variables: ["--accent"] },
      { part: "Active tab text", context: "secondary", kind: "direct", variables: ["--foreground"] },
      { part: "Tab list border", context: "secondary", kind: "direct", variables: ["--border"] },
      { part: "Corner radius", context: "primary", kind: "direct", variables: ["--radius"] },
    ],
  },
};

const sourcePath = "https://github.com/heroui-inc/heroui/blob/v3/packages/styles/components/";

export function getComponentVariableGuide(slug: ReactComponentSlug): ComponentVariableGuide {
  const doc = REACT_COMPONENT_SOURCES[slug];
  const detailed = DETAILED_GUIDES[slug];
  const knownParts = detailed?.parts ?? [];
  const knownTokens = new Set(knownParts.flatMap((part) => part.kind === "derived" ? part.sources : part.variables));
  const remaining = doc.tokens.filter((token) => !knownTokens.has(token));
  return {
    title: doc.name,
    documentation: `https://heroui.com/en/docs/react/components/${slug}`,
    source: "style" in doc ? sourcePath + doc.style : undefined,
    relatedStyles: "related" in doc ? doc.related : undefined,
    ...detailed,
    parts: remaining.length ? [...knownParts, { part: "CSS dependency", kind: "reference", variables: remaining }] : knownParts,
  };
}
