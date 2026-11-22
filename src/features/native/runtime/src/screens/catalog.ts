import type { nativeExamples } from "./native-examples";

export type NativeExample = keyof typeof nativeExamples;

export const catalogGroups = [
  { name: "Actions", examples: ["Button", "CloseButton", "LinkButton", "PressableFeedback"] },
  { name: "Forms", examples: ["Checkbox", "ControlField", "FieldError", "Input", "InputGroup", "InputOTP", "RadioGroup", "SearchField", "Select", "Slider", "Switch", "TextArea", "TextField"] },
  { name: "Layout", examples: ["Avatar", "Card", "Chip", "Description", "Label", "ListGroup", "Separator", "Surface", "Typography"] },
  { name: "Navigation", examples: ["Accordion", "ScrollShadow", "Tabs", "TagGroup"] },
  { name: "Overlays", examples: ["BottomSheet", "Dialog", "Menu", "Popover"] },
  { name: "Feedback", examples: ["Alert", "Skeleton", "SkeletonGroup", "Spinner", "Toast"] },
] as const satisfies readonly { name: string; examples: readonly NativeExample[] }[];

export function exampleLabel(name: NativeExample) {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function findCatalogGroups(query: string, category: string) {
  const normalized = query.toLowerCase().replace(/\s+/g, "");
  return catalogGroups
    .filter((group) => category === "All" || group.name === category)
    .map(({ name, examples }) => ({
      name,
      examples: examples.filter((example) => example.toLowerCase().includes(normalized)),
    }))
    .filter(({ examples }) => examples.length > 0);
}
