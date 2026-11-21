import { ArrowUpRight } from "lucide-react";
import { TOKEN_DESCRIPTIONS, type EditableThemeVariable } from "../../theme/token-descriptions";
import { useThemeStudio } from "../../theme/ThemeStudioContext";
import type { ComponentVariableGuide } from "./component-variable-map";

export function ComponentVariables({ guide }: { guide: ComponentVariableGuide }) {
  const { openEditorToken, selectedVariable } = useThemeStudio();
  const uses = new Map<EditableThemeVariable, Set<string>>();
  for (const part of guide.parts) {
    const context = part.context ? ` · ${part.context}` : "";
    const derived = part.kind === "derived" ? ` via ${part.variable}` : "";
    for (const variable of part.kind === "direct" ? part.variables : part.sources) {
      const existing = uses.get(variable) ?? new Set<string>();
      if (part.part) existing.add(part.part + context + derived);
      uses.set(variable, existing);
    }
  }

  return (
    <section aria-label={`Tokens for ${guide.title}`} className="space-y-2 border-t border-separator px-3 pt-3 pb-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted [&_a]:underline [&_a]:underline-offset-2">
        <a href="https://heroui.com/en/docs/react/getting-started/colors" target="_blank" rel="noreferrer">HeroUI colors</a>
        {guide.documentation && <a href={guide.documentation} target="_blank" rel="noreferrer">API</a>}
        {guide.source && <a href={guide.source} target="_blank" rel="noreferrer">CSS for {guide.title.split(" · ")[0]}</a>}
        {guide.relatedStyles?.map((file) => (
          <a key={file} href={`https://github.com/heroui-inc/heroui/blob/v3/packages/styles/components/${file}`} target="_blank" rel="noreferrer">{file}</a>
        ))}
      </div>
      {guide.note && <p className="text-xs text-muted">{guide.note}</p>}
      {uses.size === 0 && <p className="text-xs text-muted">This component does not reference editable tokens directly. The example inherits colors and typography.</p>}
      <ul className="grid min-w-0 gap-x-5 md:grid-cols-2">
        {[...uses].map(([variable, contexts]) => (
          <li key={variable} className="min-w-0 border-b border-separator py-1.5 text-xs">
            <button type="button" aria-current={selectedVariable === variable || undefined} className="inline-flex min-h-6 max-w-full cursor-pointer items-center gap-1 text-left font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-focus aria-[current=true]:underline"
              title={`Go to ${variable} in the editor`} onClick={() => openEditorToken(variable)}>
              <code className="min-w-0 wrap-break-word">{variable}</code><ArrowUpRight size={12} className="shrink-0" aria-hidden="true" />
            </button>
            <p className="leading-snug">{TOKEN_DESCRIPTIONS[variable]}</p>
            {contexts.size > 0 && <p className="mt-0.5 wrap-break-word leading-snug text-muted">{[...contexts].join(" / ")}.</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
