import { useEffect, useState } from "react";
import { Button, Label, ListBox, NumberField, Select } from "@heroui/react";
import { RotateCcw } from "lucide-react";
import {
  LENGTH_TOKENS,
  type LengthToken,
  type ThemeMode,
  type ThemeOverrides,
  type ThemeToken,
} from "../model";
import { FONT_STACKS } from "../typography";
import type { EditableThemeVariable } from "../token-descriptions";
import { EditorTokenTarget } from "./EditorTokenTarget";

const lengths = Object.keys(LENGTH_TOKENS) as LengthToken[];
const fonts = [
  { id: "system", label: "Inter / system" },
  { id: "rounded", label: "Rounded" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Monospace" },
] as const;

export function ThemeSettingsPanel({
  overrides,
  mode,
  highlightedVariable,
  onToken,
}: {
  overrides: ThemeOverrides;
  mode: ThemeMode;
  highlightedVariable: EditableThemeVariable | null;
  onToken: (token: ThemeToken, value?: string) => void;
}) {
  const [pixels, setPixels] = useState<Partial<Record<LengthToken, number>>>(
    {},
  );
  useEffect(() => {
    // A computed font size resolves CSS lengths without layout rounding.
    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;visibility:hidden;pointer-events:none";
    document.body.append(probe);
    const computed = getComputedStyle(probe);
    setPixels(
      Object.fromEntries(
        lengths.map((token) => {
          probe.style.fontSize = `var(--${token}, 0px)`;
          return [token, Number.parseFloat(computed.fontSize)];
        }),
      ),
    );
    probe.remove();
  }, [mode, overrides]);

  const font = overrides["font-sans"];
  const selectedFont = fonts.find(({ id }) => FONT_STACKS[id] === font);
  const reset = (token: ThemeToken) => (
    <Button
      size="sm"
      isIconOnly
      variant="ghost"
      aria-label={`Reset --${token}`}
      isDisabled={overrides[token] === undefined}
      onPress={() => onToken(token)}
    >
      <RotateCcw size={14} aria-hidden="true" />
    </Button>
  );

  return (
    <section className="space-y-2" aria-labelledby="theme-appearance">
      <h3 id="theme-appearance" className="text-sm font-semibold">
        Radii, borders and typography
      </h3>
      <div className="@container/lengths">
        <div className="grid items-start gap-2 @min-[18rem]/lengths:grid-cols-2">
          {lengths.map((token) => (
            <EditorTokenTarget
              key={token}
              variable={`--${token}`}
              highlighted={highlightedVariable === `--${token}`}
              className="min-w-0"
            >
              <NumberField
                fullWidth
                value={pixels[token] ?? NaN}
                minValue={0}
                maxValue={Math.max(LENGTH_TOKENS[token], pixels[token] || 0)}
                formatOptions={{ maximumFractionDigits: 2 }}
                onChange={(next) => {
                  if (Number.isFinite(next)) onToken(token, next + "px");
                }}
              >
                <Label>
                  <span className="wrap-anywhere text-xs font-medium">
                    <code>--{token}</code>{" "}
                    <span className="text-muted">px</span>
                  </span>
                </Label>
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input inputMode="decimal" />
                  <NumberField.IncrementButton />
                </NumberField.Group>
              </NumberField>
              {overrides[token] !== undefined && (
                <div className="flex justify-end">{reset(token)}</div>
              )}
            </EditorTokenTarget>
          ))}
        </div>
      </div>
      <EditorTokenTarget
        variable="--font-sans"
        highlighted={highlightedVariable === "--font-sans"}
      >
        <div className="flex min-w-0 items-end gap-1">
          <div className="min-w-0 flex-1">
            <Select
              fullWidth
              selectedKey={selectedFont?.id ?? null}
              placeholder={font ?? "HeroUI default"}
              onSelectionChange={(key) => {
                const option = fonts.find(({ id }) => id === key);
                if (option) onToken("font-sans", FONT_STACKS[option.id]);
              }}
            >
              <Label>
                <code>--font-sans</code>
              </Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {fonts.map(({ id, label }) => (
                    <ListBox.Item key={id} id={id} textValue={label}>
                      {label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          {reset("font-sans")}
        </div>
      </EditorTokenTarget>
    </section>
  );
}
