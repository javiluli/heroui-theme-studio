import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const docs = ".heroui-docs/react/components";
const description = readFileSync("src/features/theme/token-descriptions.ts", "utf8");
const editable = new Set([...description.matchAll(/^  "(--[^"]+)":/gm)].map((match) => match[1]));
const styles = join(dirname(require.resolve("@heroui/styles/themes/default/variables.css")), "../..");
const readStyle = (file) => readFileSync(join(styles, file), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "");
const theme = readStyle("themes/default/variables.css") + readStyle("themes/shared/theme.css");
const utilities = readStyle("utilities/index.css");
const cssRefs = (css) => [...css
  .replace(/var\((--[\w-]+),\s*var\(--[\w-]+\)\)/g, "var($1)")
  .matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]);
const aliases = new Map();
for (const [, name, value] of theme.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)) {
  aliases.set(name, [...(aliases.get(name) ?? []), ...cssRefs(value)]);
}
// The preview maps the editable scrollbar color to HeroUI's scrollbar utility.
aliases.set("--scrollbar-color", ["--scrollbar"]);
const rules = new Map();
for (const match of utilities.matchAll(/@utility\s+([\w-]+)\s*\{/g)) {
  const start = match.index + match[0].length;
  let end = start;
  let depth = 1;
  for (; end < utilities.length && depth > 0; end++) {
    if (utilities[end] === "{") depth++;
    if (utilities[end] === "}") depth--;
  }
  assert.equal(depth, 0, `Unclosed CSS utility ${match[1]}`);
  rules.set(match[1], utilities.slice(start, end - 1));
}
// Styles of native slots actually composed by these gallery examples.
const slots = {
  "avatar-group": ["avatar.css"],
  "button-group": ["button.css"],
  "color-picker": ["color-area.css", "color-field.css", "color-input-group.css", "color-slider.css", "color-swatch.css"],
  "color-swatch-picker": ["color-swatch.css"],
  "checkbox-group": ["checkbox.css", "label.css"],
  "color-field": ["color-input-group.css", "field-error.css"],
  "date-field": ["date-input-group.css", "field-error.css"],
  "date-picker": ["date-input-group.css", "calendar.css"],
  "date-range-picker": ["date-input-group.css", "range-calendar.css"],
  "dropdown": ["list-box-item.css"],
  "disclosure-group": ["disclosure.css"],
  "fieldset": ["input-group.css", "label.css"],
  "form": ["input.css", "label.css", "field-error.css"],
  "list-box": ["list-box-item.css"],
  "number-field": ["label.css", "field-error.css"],
  "radio-group": ["radio.css"],
  "select": ["list-box-item.css"],
  "tag-group": ["tag.css"],
  "text-field": ["input.css", "label.css", "description.css", "field-error.css"],
  "time-field": ["date-input-group.css"],
  "toggle-button-group": ["toggle-button.css"],
};

function utilityRefs(utility, seen = new Set()) {
  const name = utility.split(":").at(-1).split("/")[0];
  if (seen.has(name)) return [];
  seen.add(name);
  if (rules.has(name)) return componentRefs(rules.get(name), seen);
  if (name === "font-sans") return ["--font-sans"];
  const radius = /^rounded-(?:(?:[trblse]|ss|se|es|ee|tl|tr|bl|br)-)?([\w-]+)$/.exec(name);
  if (radius) return [`--radius-${radius[1]}`];
  const semantic = /^(?:bg|text|border(?:-[xystrble])?|ring-offset|ring|outline|decoration|fill|stroke|caret|divide|from|via|to)-([\w-]+)$/.exec(name);
  return semantic ? [`--color-${semantic[1]}`] : [];
}

function componentRefs(css, seen = new Set()) {
  return [...cssRefs(css), ...[...css.matchAll(/@apply\s+([^;]+);/g)]
    .flatMap(([, values]) => values.trim().split(/\s+/).flatMap((value) => utilityRefs(value, new Set(seen))))];
}

function editableRefs(name, seen = new Set()) {
  if (editable.has(name)) return [name];
  if (seen.has(name)) return [];
  seen.add(name);
  return (aliases.get(name) ?? []).flatMap((value) => editableRefs(value, seen));
}

const catalog = readdirSync(docs, { recursive: true })
  .filter((file) => file.endsWith(".mdx") && file !== "index.mdx")
  .map((file) => {
    const mdx = readFileSync(join(docs, file), "utf8");
    const name = /^title: (.+)$/m.exec(mdx)?.[1].trim();
    assert(name, `Missing HeroUI title in ${file}`);
    const style = /^  styles: (.+)$/m.exec(mdx)?.[1].trim();
    const slug = basename(file, ".mdx");
    const related = slots[slug] ?? [];
    const refs = [style, ...related].filter(Boolean).flatMap((file) => componentRefs(readStyle(`components/${file}`)));
    return [slug, { name, style, related, tokens: [...new Set(refs.flatMap((ref) => editableRefs(ref)))].sort() }];
  })
  .sort(([, a], [, b]) => a.name.localeCompare(b.name, "en"));

assert.equal(new Set(catalog.map(([slug]) => slug)).size, catalog.length, "Duplicate HeroUI component docs");
assert(editable.has("--accent") && editable.has("--font-sans"), "Unable to read editable tokens");

const lines = catalog.map(([slug, { name, style, related, tokens }]) =>
  `  "${slug}": { name: "${name}", ${style ? `style: "${style}", ` : ""}${related.length ? `related: ${JSON.stringify(related)}, ` : ""}tokens: ${JSON.stringify(tokens)} },`);
writeFileSync("src/features/playground/inspection/react-component-sources.ts", [
  "// Generated from official HeroUI React MDX and installed @heroui/styles.",
  "// Refresh the docs with heroui agents-md, then run node scripts/update-react-catalog.mjs.",
  'import type { EditableThemeVariable } from "../../theme/token-descriptions";',
  "",
  "export const REACT_COMPONENT_SOURCES = {",
  ...lines,
  "} as const satisfies Record<string, { name: string; style?: string; related?: readonly string[]; tokens: readonly EditableThemeVariable[] }>;",
  "",
].join("\n"));
