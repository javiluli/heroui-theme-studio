import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ComponentPlayground, PlaygroundControls, PlaygroundPreview } from "./ComponentPlayground";

const source = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");

describe("Component variables UI", () => {
  it("keeps the anchor and heading before the interactive card mounts", () => {
    const html = renderToStaticMarkup(createElement(ComponentPlayground, { slug: "button", children: false }));
    expect(html).toContain('id="example-button"');
    expect(html).toContain('id="example-button-title"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("skeleton--none");
    expect(html).toContain("pb-12 md:pb-11");
    expect(html).toMatch(/grid min-h-\d+ place-items-center/);
    expect(html).not.toContain("contain-intrinsic-size");
    expect(html).not.toContain('data-playground-panel');
  });

  it("places the optional variable guide inside its shared sample card", () => {
    const wrapper = source("./ComponentPlayground.tsx");
    const panel = source("../inspection/ComponentVariables.tsx");
    const tiles = source("../../theme/components/ColorControl.tsx");
    const settings = source("../../theme/components/ThemeSettingsPanel.tsx");
    const target = source("../../theme/components/EditorTokenTarget.tsx");

    expect(wrapper).toContain("getComponentVariableGuide(slug)");
    expect(wrapper).toContain("<ComponentVariables");
    expect(wrapper).not.toContain("Inspeccionar");
    expect(wrapper).not.toContain("VisualInspectorPreview");
    expect(wrapper).toContain("{children}");
    expect(panel).toContain("TOKEN_DESCRIPTIONS[variable]");
    expect(panel).toContain("HeroUI colors");
    expect(panel).toContain("openEditorToken(variable)");
    expect(panel).toContain("md:grid-cols-2");
    expect(panel).not.toContain("selectedIndex");
    expect(tiles).toContain("<EditorTokenTarget");
    expect(target).toContain('id={"theme-token-" + variable.slice(2)}');
    expect(target).toContain("data-highlighted");
    expect(settings).toContain('<RadiusField token="radius"');
    expect(settings).toContain('<RadiusField token="field-radius"');
    expect(settings).toContain("<NumberField.Input");
    expect(panel).not.toContain("dangerouslySetInnerHTML");
  });

  it("places the collapsed inline settings inside the stage before the sample", () => {
    const html = renderToStaticMarkup(createElement(ComponentPlayground, {
      slug: "button",
      children: [
        createElement(PlaygroundControls, { key: "controls", children: "Configuración de prueba" }),
        createElement(PlaygroundPreview, { key: "preview", children: "Muestra de botón" }),
      ],
    }));
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(2);
    expect(html).toContain('data-playground-stage');
    const placeholder = renderToStaticMarkup(createElement(ComponentPlayground, { slug: "button" }));
    const minimum = placeholder.match(/grid (min-h-\d+) place-items-center/)?.[1];
    expect(minimum).toBeDefined();
    expect(html).toContain(`grid ${minimum} min-w-0`);
    expect(html).not.toContain("h-112");
    expect(html).toContain('absolute inset-e-2 top-2');
    expect(html).toContain('aria-controls="example-button-settings"');
    expect(html).toMatch(/id="example-button-settings"[^>]*inert=""[^>]*aria-hidden="true"/);
    expect(html.indexOf('data-playground-settings')).toBeLessThan(html.indexOf("Muestra de botón"));
    expect(html.indexOf("Muestra de botón")).toBeLessThan(html.indexOf('data-playground-panel="tokens"'));
    expect(html).not.toContain("Configuración de prueba");
  });

  it("keeps the collage sample and accessible name with no visible card chrome", () => {
    const html = renderToStaticMarkup(createElement(ComponentPlayground, {
      slug: "button",
      collage: true,
      children: [
        createElement(PlaygroundControls, { key: "controls", children: "Ajustes" }),
        createElement(PlaygroundPreview, { key: "preview", children: "Muestra de botón" }),
      ],
    }));

    expect(html).toContain('aria-labelledby="example-button-title"');
    expect(html).toContain('class="sr-only">Button</h2>');
    expect(html).toContain("Muestra de botón");
    expect(html).not.toMatch(/data-playground-panel=| data-playground-settings=|border-border/);
  });
});
