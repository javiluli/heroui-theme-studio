import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ThemeSettingsPanel } from "../features/theme/components/ThemeSettingsPanel";
import { COLOR_TOKENS, TOKEN_GROUPS } from "../features/theme/model";
import { FONT_STACKS } from "../features/theme/typography";

const source = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");

describe("Reusable layout wrappers", () => {
  it("centralizes the shared width and keeps Flex/Grid generic", () => {
    const container = source("../components/layout/Container.tsx");
    const flex = source("../components/layout/Flex.tsx");
    const grid = source("../components/layout/Grid.tsx");
    const index = source("../components/layout/index.ts");
    const app = source("./App.tsx");

    expect(container).toContain("w-full px-4 lg:px-5");
    expect(container).not.toContain("max-w-7xl");
    expect(flex).toContain("flex min-w-0");
    expect(grid).toContain("grid min-w-0");
    for (const name of ["Container", "Flex", "Grid"]) {
      expect(index).toContain(`export { ${name} }`);
      expect(app).toContain(`<${name}`);
    }
    for (const wrapper of [container, flex, grid]) {
      expect(wrapper).toContain("children");
      expect(wrapper).toContain("className");
      expect(wrapper).not.toMatch(/header:|sidebar:|assistant:|overlay:/);
      expect(wrapper).not.toContain("ReactNode");
    }
    expect(app).not.toContain("max-w-7xl");
    expect(app).not.toContain("STUDIO_LAYOUT");
    expect(app).not.toMatch(/\b(?:header|sidebar|assistant|overlay)=\{/);
  });

  it("composes the header, editor, preview and assistant directly in App", () => {
    const app = source("./App.tsx");
    const gallery = source("../features/playground/ComponentGallery.tsx");
    const website = source("../features/website/RealWebsite.tsx");

    expect((app.match(/<Container>/g) || []).length).toBe(2);
    expect(app).toContain('<header className="sticky top-0 z-30');
    expect(app).toContain("<StudioHeader");
    expect(app).toContain("grid-cols-[24rem_minmax(0,1fr)]");
    expect(app).toContain("<EditorPanel");
    expect(app).toMatch(/<main[\s\S]*<StudioViews page=\{page\} onNavigate=\{navigate\}>/);
    expect(app).toContain('page === "components" ? "max-w-334" : "max-w-6xl"');
    expect(app).toMatch(/<EditorPanel[\s\S]*<main\s+id="main-content"/);
    expect(app).toMatch(/<ComponentGallery\s+layout=\{page === "collage" \? "collage" : "list"\}\s*\/>/);
    expect(app).toContain("<RealWebsite />");
    expect(gallery).toContain("<ComponentIndex gallery={gallery}");
    expect(gallery).not.toMatch(/2xl:grid-cols-2/);
    expect(website).toContain("@container w-full min-w-0");
  });

  it("reveals the themed menu scrollbars on hover or keyboard focus", () => {
    const editor = source("../features/theme/components/EditorPanel.tsx");
    const index = source("../features/playground/components/ComponentIndex.tsx");
    const styles = source("./styles.css");

    expect(editor).toContain('className="scrollbar max-h-96 min-h-0 min-w-0 overflow-y-auto');
    for (const menu of [editor, index]) {
      expect(menu).toContain('data-scrollbar="thin"');
      expect(menu).toContain("[@media(hover:hover)]:[&:not(:hover,:focus-within)]:[--scrollbar-color:transparent_transparent]");
      expect(menu).not.toContain("[scrollbar-color:");
      expect(menu).not.toContain("::-webkit-scrollbar");
    }
    expect(editor).toContain("@[56rem]/studio:sticky");
    expect(editor).toContain("@[56rem]/studio:max-h-[calc(100dvh-5.5rem)]");
    expect(styles.replace(/\r\n/g, "\n")).toBe('@import "tailwindcss";\n@import "@heroui/styles";\n');
  });

  it("uses a native-width popover, wrapping token names and keeping HSB state stable", () => {
    const editor = source("../features/theme/components/EditorPanel.tsx");
    const control = source("../features/theme/components/ColorControl.tsx");

    expect(editor).toContain("grid grid-cols-2 items-stretch gap-2");
    expect(TOKEN_GROUPS.flatMap(({ tokens }) => tokens).sort()).toEqual([...COLOR_TOKENS].sort());
    expect(editor).toContain('platform === "web" || token !== "scrollbar"');
    expect(control).toContain("<ColorPicker");
    expect(control).toContain("value={pickerColor}");
    expect(control).toContain("setPickerColor(next.toFormat(\"hsb\"))");
    expect(control).toContain("parseColor(hex).toFormat(\"hsb\")");
    expect(control).toContain("hex === lastSentHex.current");
    expect(control).toContain("<ColorPicker.Trigger");
    expect(control).toContain("<ColorPicker.Popover");
    expect(control).toContain("ref={clearOnClose}");
    expect(control).toContain('token === "overlay"');
    expect(control).toContain("<ColorSwatch");
    expect(control).toContain("<ColorArea");
    expect(control).toContain("<ColorSlider");
    expect(control).toContain("wrap-anywhere");
    expect(control).toContain("--{token}");
    expect(control).toContain('"#00000000"');
    expect(control).toContain('onPress={() => onChange(token, "transparent")}');
    expect(control.match(/onChangeEnd=\{commitColor\}/g)).toHaveLength(2);
    expect(control).not.toContain("w-64");
    expect(control).not.toContain("w-72");
    expect(control).not.toContain("<Input");
    expect(control).not.toContain("<TextField");
    expect(control).not.toContain("<ColorField");
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

    expect(app).toContain('page === "native" ? "min-h-dvh" : "min-h-screen"');
    expect(app).toContain("w-full bg-background text-foreground");
    expect(app).toContain("max-lg:hidden");
    expect(app.indexOf("<AIGeneratorPanel")).toBeGreaterThan(app.indexOf("</main>"));
    expect(editor).toContain("@[56rem]/studio:sticky");
    expect(editor).toContain("@[56rem]/studio:top-[4.5rem]");
    expect(editor).toContain("overscroll-contain");
    expect(editor).not.toContain("{navigation}");
    expect(chat).toContain("sticky top-0");
    expect(chat).toContain("lg:w-[398px]");
    expect(chat).not.toContain("fixed inset-y-0");
  });

  it("renders editable radius fields with chevrons and independent reset buttons", () => {
    const html = renderToStaticMarkup(createElement(ThemeSettingsPanel, {
      radius: 8, fieldRadius: 12, fontSans: FONT_STACKS.system, highlightedVariable: null,
      onRadius: () => {}, onFieldRadius: () => {}, onFontFamily: () => {},
    }));
    const inputIds = [...html.matchAll(/<input\b(?=[^>]*data-slot="number-field-input")[^>]*\sid="([^"]+)"/g)];
    expect(inputIds).toHaveLength(2);
    for (const [, id] of inputIds) expect(html).toContain(`for="${id}"`);
    expect(html.match(/<button\b[^>]+slot="increment"/g)).toHaveLength(2);
    expect(html.match(/<button\b[^>]+slot="decrement"/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Reset --radius"');
    expect(html).toContain('aria-label="Reset --field-radius"');
  });
});
