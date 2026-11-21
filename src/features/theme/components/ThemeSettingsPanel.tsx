import { memo } from "react";
import { Button, Label, ListBox, NumberField, Select } from "@heroui/react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { DEFAULT_THEME, type ThemeConfig } from "../model";
import { FONT_STACKS } from "../typography";
import type { EditableThemeVariable } from "../token-descriptions";
import { EditorTokenTarget } from "./EditorTokenTarget";

const fonts = [
  { id: "system", label: "Inter / system" },
  { id: "rounded", label: "Rounded" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Monospace" },
] as const;
const radiusFormat = { maximumFractionDigits: 20 };

function RadiusField({ token, value, max, initial, highlighted, onChange }: {
  token: "radius" | "field-radius";
  value: number;
  max: number;
  initial: number;
  highlighted: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <EditorTokenTarget variable={`--${token}`} highlighted={highlighted} className="min-w-0 rounded-(--field-radius)">
      <div className="flex min-w-0 items-end gap-1">
        <div className="min-w-0 flex-1">
          <NumberField
            value={value}
            minValue={0}
            maxValue={max}
            formatOptions={radiusFormat}
            fullWidth
            onChange={(next) => {
              if (typeof next === "number" && Number.isFinite(next)) onChange(next);
            }}
          >
            <Label><span className="text-xs"><code>--{token}</code> <span className="text-muted">px</span></span></Label>
            <NumberField.Group className="flex">
              <NumberField.Input className="flex-1" inputMode="decimal" />
              <div className="flex h-full shrink-0 flex-col border-s border-field-placeholder/15">
                <NumberField.IncrementButton className="h-1/2 w-6 border-0">
                  <ChevronUp size={11} aria-hidden="true" />
                </NumberField.IncrementButton>
                <NumberField.DecrementButton className="h-1/2 w-6 border-0">
                  <ChevronDown size={11} aria-hidden="true" />
                </NumberField.DecrementButton>
              </div>
            </NumberField.Group>
          </NumberField>
        </div>
        <Button size="sm" isIconOnly variant="ghost" aria-label={`Reset --${token}`} onPress={() => onChange(initial)}>
          <RotateCcw size={14} aria-hidden="true" />
        </Button>
      </div>
    </EditorTokenTarget>
  );
}

export const ThemeSettingsPanel = memo(function ThemeSettingsPanel({
  radius, fieldRadius, fontSans, highlightedVariable, onRadius, onFieldRadius, onFontFamily,
}: {
  radius: number;
  fieldRadius: number;
  fontSans: string;
  highlightedVariable: EditableThemeVariable | null;
  onRadius: (value: number) => void;
  onFieldRadius: (value: number) => void;
  onFontFamily: (value: ThemeConfig["fontFamily"]) => void;
}) {
  const selectedFont = fonts.find((font) => FONT_STACKS[font.id] === fontSans);
  return (
    <section className="space-y-2" aria-label="Radius and typography">
      <h3 className="text-sm font-semibold">Radius and typography</h3>
      <div className="grid grid-cols-2 items-end gap-2">
        <RadiusField token="radius" value={radius} max={32} initial={DEFAULT_THEME.radius} onChange={onRadius} highlighted={highlightedVariable === "--radius"} />
        <RadiusField token="field-radius" value={fieldRadius} max={48} initial={DEFAULT_THEME.fieldRadius} onChange={onFieldRadius} highlighted={highlightedVariable === "--field-radius"} />
      </div>
      <EditorTokenTarget variable="--font-sans" highlighted={highlightedVariable === "--font-sans"} className="rounded-(--field-radius)">
        <Select selectedKey={selectedFont?.id ?? null} placeholder={fontSans}
          onSelectionChange={(key) => {
            const font = fonts.find((option) => option.id === key);
            if (font) onFontFamily(font.id);
          }}
        >
          <Label><code>--font-sans</code></Label>
          <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
          <Select.Popover>
            <ListBox>
              {fonts.map((font) => (
                <ListBox.Item key={font.id} id={font.id} textValue={font.label}>
                  {font.label}<ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </EditorTokenTarget>
    </section>
  );
});
