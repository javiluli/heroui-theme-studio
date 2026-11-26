import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");

describe("Reusable layout wrappers", () => {
  it("centralizes the shared width and keeps Flex/Grid generic", () => {
    const container = source("../components/layout/Container.tsx");
    const flex = source("../components/layout/Flex.tsx");
    const grid = source("../components/layout/Grid.tsx");
    const index = source("../components/layout/index.ts");
    const studio = source("./App.tsx") + source("./layout/StudioWorkspace.tsx");

    expect(container).toContain("w-full px-4 lg:px-5");
    expect(container).not.toContain("max-w-7xl");
    expect(flex).toContain("flex min-w-0");
    expect(grid).toContain("grid min-w-0");
    for (const name of ["Container", "Flex", "Grid"]) {
      expect(index).toContain(`export { ${name} }`);
      expect(studio).toContain(`<${name}`);
    }
    for (const wrapper of [container, flex, grid]) {
      expect(wrapper).toContain("children");
      expect(wrapper).toContain("className");
      expect(wrapper).not.toMatch(/header:|sidebar:|assistant:|overlay:/);
      expect(wrapper).not.toContain("ReactNode");
    }
    expect(studio).not.toContain("max-w-7xl");
  });

  it("reveals the themed menu scrollbars on hover or keyboard focus", () => {
    const editor = source("../features/theme/components/EditorPanel.tsx");
    const index = source("../features/playground/components/ComponentIndex.tsx");
    const styles = source("./styles.css");

    expect(editor).toContain('scrollbar min-h-0 min-w-0 overflow-y-auto');
    for (const menu of [editor, index]) {
      expect(menu).toContain('data-scrollbar="thin"');
      expect(menu).toContain("[@media(hover:hover)]:[&:not(:hover,:focus-within)]:[--scrollbar-color:transparent_transparent]");
      expect(menu).not.toContain("[scrollbar-color:");
      expect(menu).not.toContain("::-webkit-scrollbar");
    }
    expect(editor).toContain("@[52rem]/studio:sticky");
    expect(editor).toContain("@[52rem]/studio:max-h-[calc(100dvh");
    expect(styles.replace(/\r\n/g, "\n")).toBe('@import "tailwindcss";\n@import "@heroui/styles";\n');
  });

  it("uses a native-width popover, wrapping token names and keeping HSB state stable", () => {
    const editor = source("../features/theme/components/EditorPanel.tsx");
    const control = source("../features/theme/components/ColorControl.tsx");

    expect(editor).toContain("grid grid-cols-2 items-stretch gap-2");
    expect(control).toContain("<ColorPicker");
    expect(control).toContain("value={pickerColor}");
    expect(control).toContain("parseColor(hex).toFormat(\"hsb\")");
    expect(control).toContain("<ColorPicker.Trigger");
    expect(control).toContain("<ColorPicker.Popover");
    expect(control).toContain('token === "overlay"');
    expect(control).toContain("<ColorSwatch");
    expect(control).toContain("<ColorArea");
    expect(control).toContain("<ColorSlider");
    expect(control).toContain("wrap-anywhere");
    expect(control).toContain("--{token}");
    expect(control).toMatch(/token === "field-border"[\s\S]*?<ColorSlider channel="alpha"/);
    expect(control).not.toContain('onPress={() => onChange(token, "transparent")}');
    expect(control.match(/onChangeEnd=\{commitColor\}/g)).toHaveLength(3);
    expect(control).not.toMatch(/(?:^|[\s"])w-(?:64|72)(?=[\s"])/);
    expect(control).not.toContain("<Input");
    expect(control).not.toContain("<TextField");
    expect(control).toContain("<ColorField.Input");
    expect(control).toContain("onPress={shuffleColor}");
    expect(control).not.toContain("<ColorSwatchPicker");
    expect(editor).toContain('<ThemeSettingsPanel');
  });

  it("opens the native HeroUI CSS importer without replacing the user's layout", () => {
    const app = source("./App.tsx");
    const sidebar = source("../features/theme/components/EditorPanel.tsx");
    const importer = source("../features/theme/components/ImportCssPanel.tsx");
    expect(app).toContain("<ImportCssPanel");
    expect(app).toContain("onApply={editor.importTheme}");
    expect(sidebar).toContain("Import CSS");
    expect(sidebar).toContain("onImportCss");
    expect(importer).toContain("<Modal");
    expect(importer).toContain("<TextArea");
    expect(importer).toContain("onPaste=");
    expect(importer).toContain("parseThemeCss");
    expect(importer).not.toContain("dangerouslySetInnerHTML");
  });

  it("preserves the sticky editor and the non-overlaying assistant", () => {
    const app = source("./App.tsx");
    const editor = source("../features/theme/components/EditorPanel.tsx");
    const chat = source("../features/ai/AIGeneratorPanel.tsx");

    expect(app).toContain("w-full bg-background text-foreground");
    expect(app).toContain("max-lg:hidden");
    expect(app.indexOf("<AIGeneratorPanel")).toBeGreaterThan(app.indexOf("</StudioWorkspace>"));
    expect(editor).toContain("@[52rem]/studio:sticky");
    expect(editor).toContain("@[52rem]/studio:top-[calc(var(--studio-header-height");
    expect(editor).toContain("overscroll-contain");
    expect(editor).not.toContain("{navigation}");
    expect(chat).toContain("sticky top-0");
    expect(chat).toContain("lg:w-(--studio-assistant-width)");
    expect(chat).not.toContain("fixed inset-y-0");
  });

});
