import { describe, expect, it } from "vitest";
import { COLOR_TOKENS } from "../../theme/model";
import { getComponentVariableGuide, type ReactComponentSlug } from "./component-variable-map";
import { REACT_COMPONENT_SOURCES } from "./react-component-sources";

const editable = new Set<string>([
  ...COLOR_TOKENS.map((token) => "--" + token),
  "--radius",
  "--field-radius",
  "--font-sans",
]);

describe("HeroUI component variable guides", () => {
  it("uses official source links and editable tokens for every React component", () => {
    for (const slug of Object.keys(REACT_COMPONENT_SOURCES) as ReactComponentSlug[]) {
      const guide = getComponentVariableGuide(slug);
      expect(guide.documentation).toBe("https://heroui.com/en/docs/react/components/" + slug);
      if (guide.source) {
        expect(guide.source).toMatch(/^https:\/\/github\.com\/heroui-inc\/heroui\/blob\/v3\/packages\/styles\/components\/.+\.css$/);
      }
      for (const part of guide.parts) {
        for (const token of part.kind === "derived" ? part.sources : part.variables) {
          expect(editable.has(token)).toBe(true);
        }
      }
    }
  });

  it("resolves both semantic CSS aliases and composed styles", () => {
    expect(getComponentVariableGuide("badge").parts).toContainEqual(expect.objectContaining({
      kind: "reference",
      variables: expect.arrayContaining(["--success", "--success-foreground"]),
    }));
    expect(getComponentVariableGuide("form").parts).toContainEqual(expect.objectContaining({
      kind: "reference",
      variables: expect.arrayContaining(["--field-radius", "--danger"]),
    }));
    expect(getComponentVariableGuide("scroll-shadow").parts).toContainEqual(expect.objectContaining({
      kind: "reference",
      variables: expect.arrayContaining(["--scrollbar-thumb"]),
    }));
  });

  it("keeps derived properties separate and shares secondary button uses with ButtonGroup", () => {
    const input = getComponentVariableGuide("input").parts;
    expect(input.some((part) => part.kind === "derived" && part.variable === "--field-border-focus")).toBe(true);
    expect(input.some((part) => part.kind === "direct" && part.context === "secondary" && part.variables.includes("--default"))).toBe(true);
    const button = getComponentVariableGuide("button").parts;
    expect(button.some((part) => part.kind === "derived" && part.variable === "--accent-hover")).toBe(true);
    const group = getComponentVariableGuide("button-group").parts;
    expect(group.filter((part) => "context" in part && part.context === "secondary")).toEqual(
      button.filter((part) => "context" in part && part.context === "secondary"),
    );
  });
});
