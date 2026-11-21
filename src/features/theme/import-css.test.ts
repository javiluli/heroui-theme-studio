import { describe, expect, it } from "vitest";
import { COLOR_TOKENS } from "./model";
import { parseThemeCss } from "./import-css";
import { createPreset } from "./templates";
import { exportThemeCss } from "./export-css";
import { getModeSettings } from "./mode-layout";
import { isThemeConfig } from "./storage";

const samples = (mode: "light" | "dark") =>
  COLOR_TOKENS.map((token) => `--${token}: ${token === "accent" ? "oklch(51.33% 0.2355 287.07)" :
    token === "field-border" ? "transparent" : createPreset().palettes[mode][token]};`).join("\n");

const snippet = `@variant light {
  ${samples("light")}
  --radius: 0.25rem;
  --field-radius: 0.5rem;
  --font-sans: var(--font-inter);
}
@variant dark {
  color-scheme: dark;
  ${samples("dark")}
  --radius: 0.35rem;
  --field-radius: 0.75rem;
  --font-sans: var(--font-inter);
}`;

describe("CSS theme import", () => {
  it("imports all token values and independent geometry from @variant blocks", () => {
    const base = createPreset();
    const next = parseThemeCss(snippet, base);
    expect(next.palettes.light.accent).toBe("oklch(51.33% 0.2355 287.07)");
    expect(next.palettes.dark.accent).toBe("oklch(51.33% 0.2355 287.07)");
    expect(getModeSettings(next, "light")).toEqual({radius:4,fieldRadius:8,fontSans:"var(--font-inter)"});
    expect(getModeSettings(next, "dark")).toEqual({radius:5.6,fieldRadius:12,fontSans:"var(--font-inter)"});
    expect(base.palettes.light.accent).not.toBe(next.palettes.light.accent);
    expect(isThemeConfig(next)).toBe(true);
    const exported = exportThemeCss(next);
    expect(exported).toContain("--radius: 0.35rem;");
    expect(exported).toContain("--radius: 0.25rem;");
    expect(exported.match(/--font-sans: var\(--font-inter\);/g)).toHaveLength(2);
    const roundtrip = parseThemeCss(exported, createPreset());
    expect(roundtrip.modeSettings).toEqual(next.modeSettings);
    expect(roundtrip.palettes).toEqual(next.palettes);
  });

  it("recognizes HeroUI selector-based CSS and keeps unsupported variables out", () => {
    const css = `:root, .light, [data-theme="light"] {
      --accent: #123456;
      --unknown-token: red;
      --radius: 8px;
    }
    .dark, [data-theme="dark"] {
      --accent: #654321;
      --radius: 12px;
    }`;
    const imported = parseThemeCss(css, createPreset());
    expect(imported.palettes.light.accent).toBe("#123456");
    expect(imported.palettes.dark.accent).toBe("#654321");
    expect(getModeSettings(imported, "dark").radius).toBe(12);
    expect(Object.keys(imported.palettes.dark)).toHaveLength(COLOR_TOKENS.length);
    expect("--unknown-token" in imported.palettes.dark).toBe(false);
  });

  it("round-trips Native colors and radii while retaining the current Web font and scrollbar", () => {
    const base = createPreset();
    const imported = parseThemeCss(`
      @theme { --radius: 0.5rem; --field-radius: calc(var(--radius) * 1.75); --font-normal: 'Example-Regular'; }
      @layer theme {
        :root {
          @variant light { --accent: oklch(59.89% 0.1808 256.99); --field-border: transparent; }
          @variant dark { --accent: oklch(57.54% 0.2304 263.36); --field-border: transparent; --radius: 1rem; }
        }
      }
    `, base);
    expect(getModeSettings(imported, "light")).toEqual({ radius: 8, fieldRadius: 14, fontSans: getModeSettings(base, "light").fontSans });
    expect(getModeSettings(imported, "dark").radius).toBe(16);
    expect(getModeSettings(imported, "dark").fieldRadius).toBe(28);
    const native = exportThemeCss(imported, "native");
    expect(native).toContain("@layer theme {\n  :root {\n    @variant light {");
    expect(native).toContain("@variant dark {");
    expect(native).not.toMatch(/\[data-theme=|--scrollbar:|--font-sans:|--font-normal:/);
    const expected = [...COLOR_TOKENS.filter((token) => token !== "scrollbar"), "radius", "field-radius"].sort();
    const declarations = [...native.matchAll(/^\s+--([a-z-]+):/gm)].map((match) => match[1]);
    expect(declarations.sort()).toEqual([...expected, ...expected].sort());
    const roundtrip = parseThemeCss(native, base);
    expect(roundtrip.palettes).toEqual(imported.palettes);
    expect(roundtrip.modeSettings).toEqual(imported.modeSettings);
  });

  it("never applies malformed, unsupported, or one-mode CSS", () => {
    expect(() => parseThemeCss("@variant light { --accent: #123456; }", createPreset())).toThrow("dark theme colors");
    expect(() => parseThemeCss(snippet.replace("oklch(51.33% 0.2355 287.07)", "url(https://evil.example/img)"), createPreset())).toThrow("Invalid CSS value");
    expect(() => parseThemeCss(snippet.replace("0.35rem", "100rem"), createPreset())).toThrow("32px");
    expect(() => parseThemeCss(snippet.replace("var(--font-inter)", "url(https://evil.example)"), createPreset())).toThrow("supported font");
  });
});
