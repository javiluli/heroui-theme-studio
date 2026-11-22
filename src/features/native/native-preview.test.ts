import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { catalogGroups, findCatalogGroups } from "./runtime/src/screens/catalog";

it("keeps all 39 official Native catalog components represented", () => {
  const source = readFileSync(new URL("./runtime/src/screens/native-examples.tsx", import.meta.url), "utf8");
  expect(source).toContain('from "heroui-native"');
  expect(source).toContain('from "react-native"');
  expect(source).not.toContain('from "@heroui/react"');
  const examples = source.slice(source.indexOf("export const nativeExamples"));
  const names = [...examples.matchAll(/^  (\w+):/gm)].map((match) => match[1]);
  expect(catalogGroups.flatMap(({ examples }) => [...examples]).sort()).toEqual([...names].sort());
  expect(names.sort()).toEqual([
    "Accordion", "Alert", "Avatar", "BottomSheet", "Button", "Card", "Checkbox", "Chip", "CloseButton",
    "ControlField", "Description", "Dialog", "FieldError", "Input", "InputGroup", "InputOTP", "Label", "LinkButton",
    "ListGroup", "Menu", "Popover", "PressableFeedback", "RadioGroup", "ScrollShadow", "SearchField", "Select",
    "Separator", "Skeleton", "SkeletonGroup", "Slider", "Spinner", "Surface", "Switch", "Tabs", "TagGroup", "TextArea",
    "TextField", "Toast", "Typography",
  ]);
});

it("finds spaced component names and applies the category filter", () => {
  expect(findCatalogGroups(" input OTP ", "Forms")).toEqual([{ name: "Forms", examples: ["InputOTP"] }]);
  expect(findCatalogGroups("input OTP", "Overlays")).toEqual([]);
  expect(findCatalogGroups("not a component", "All")).toEqual([]);
});
