import { useState, type CSSProperties } from "react";
import {
  Button,
  ColorSwatch,
  ListBox,
  Popover,
  Tabs,
  Tooltip,
} from "@heroui/react";
import {
  Check,
  ChevronDown,
  RotateCcw,
  ClipboardPaste,
  Globe2,
  Moon,
  Smartphone,
  Sun,
} from "lucide-react";
import {
  TOKEN_GROUPS,
  type ThemeToken,
  type ThemeConfig,
  type ThemeMode,
} from "../model";
import { PRESET_LABELS, templates, type PresetId } from "../templates";
import type { ThemeTemplate } from "../templates/types";
import type { ThemePlatform } from "../export-css";
import { ColorControl } from "./ColorControl";
import { ThemeSettingsPanel } from "./ThemeSettingsPanel";
import type { EditableThemeVariable } from "../token-descriptions";

interface EditorPanelProps {
  platform: ThemePlatform;
  theme: ThemeConfig;
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  highlightedVariable: EditableThemeVariable | null;
  selectedPreset: PresetId | "custom";
  onPreset: (preset: PresetId) => void;
  onToken: (token: ThemeToken, value?: string) => void;
  onReset: () => void;
  onImportCss: () => void;
}

const presets = templates.map(({ name, label, value }: ThemeTemplate) => ({
  key: name,
  label,
  accent: value,
}));
const defaultAccent = "oklch(0.6204 0.195 253.83)";

/** Layout utilities never target HeroUI BEM classes or override its component CSS. */
export function EditorPanel({
  platform,
  theme,
  mode,
  onModeChange,
  highlightedVariable,
  selectedPreset,
  onPreset,
  onToken,
  onReset,
  onImportCss,
}: EditorPanelProps) {
  const overrides = theme.overrides[mode];
  const [presetsOpen, setPresetsOpen] = useState(false);
  const presetLabel = selectedPreset === "custom" ? "Custom theme" : PRESET_LABELS[selectedPreset];
  const nextMode = mode === "light" ? "dark" : "light";
  const modeLabel = `Switch to ${nextMode} mode`;
  return (
    <aside
      className={`flex min-h-0 min-w-0 flex-col gap-3 ${platform === "web" ? "@[52rem]/studio:sticky @[52rem]/studio:top-[calc(var(--studio-header-height,3.5625rem)_+_var(--studio-inset))] @[52rem]/studio:max-h-[calc(100dvh_-_var(--studio-header-height,3.5625rem)_-_var(--studio-inset)_-_var(--studio-inset))]" : ""}`}
      aria-label="Theme editor"
    >
      <div className="grid min-w-0 shrink-0 gap-1 px-2">
        <div className="mb-1 w-fit max-w-full">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Theme platform">
              <Tabs.Tab id="web" className="gap-2">
                <Globe2 size={16} aria-hidden="true" />
                Web
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="native" className="gap-2">
                <Smartphone size={16} aria-hidden="true" />
                Native
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="min-w-36 flex-1">
            <Popover isOpen={presetsOpen} onOpenChange={setPresetsOpen}>
              <Button fullWidth size="lg" variant="tertiary" aria-label={`Theme presets, ${presetLabel}`}>
                <span className="flex w-full min-w-0 items-center gap-2 text-left">
                  <span className="shrink-0" aria-hidden="true">
                    <ColorSwatch size="xs" shape="square" color="#000000"
                      style={{ "--color-swatch-current": "var(--accent)" } as CSSProperties} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{presetLabel.replace(/^HeroUI /, "")}</span>
                  <ChevronDown className="shrink-0" aria-hidden="true" />
                </span>
              </Button>
              <Popover.Content placement="bottom start">
                <Popover.Dialog>
                  <div className="w-72 max-w-[calc(100vw-2rem)]">
                    <Popover.Heading>Theme presets</Popover.Heading>
                    <div className="mt-2">
                      <ListBox
                        aria-label="Theme presets"
                        autoFocus
                        layout="grid"
                        className="grid grid-cols-2 gap-1 min-[20rem]:grid-cols-3"
                        items={presets}
                        selectionMode="single"
                        disallowEmptySelection
                        selectedKeys={selectedPreset === "custom" ? [] : [selectedPreset]}
                        onSelectionChange={(keys) => {
                          if (keys === "all") return;
                          const key = [...keys][0];
                          const preset = templates.find((entry) => entry.name === key);
                          if (preset) {
                            onPreset(preset.name);
                            setPresetsOpen(false);
                          }
                        }}
                      >
                        {(item) => (
                          <ListBox.Item id={item.key} textValue={item.label} aria-label={item.label}>
                            {({ isSelected }) => (
                              <span className="relative grid w-full min-w-0 justify-items-center gap-2 text-center">
                                <span className={`rounded-md ring-1 ${isSelected ? "ring-foreground ring-offset-2 ring-offset-overlay" : "ring-foreground/15"}`}
                                  aria-hidden="true">
                                  <ColorSwatch
                                    size="lg"
                                    shape="square"
                                    color="#000000"
                                    style={{ "--color-swatch-current": item.accent[mode].accent ?? defaultAccent } as CSSProperties}
                                  />
                                </span>
                                <span className="min-h-8 text-xs leading-4 font-medium">
                                  {item.label}
                                </span>
                                {isSelected && <Check className="absolute end-0 top-0" size={13} aria-hidden="true" />}
                              </span>
                            )}
                          </ListBox.Item>
                        )}
                      </ListBox>
                    </div>
                  </div>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>
          </div>

          <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Theme actions">
            <Tooltip>
              <Button size="lg" isIconOnly variant="ghost" aria-label={modeLabel} onPress={() => onModeChange(nextMode)}>
                {mode === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
              </Button>
              <Tooltip.Content>{modeLabel}</Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Button size="lg" isIconOnly variant="ghost" aria-label="Reset theme" onPress={onReset}>
                <RotateCcw aria-hidden="true" />
              </Button>
              <Tooltip.Content>Reset theme</Tooltip.Content>
            </Tooltip>
            <Tooltip>
              <Button size="lg" isIconOnly variant="ghost" aria-label="Import CSS" onPress={onImportCss}>
                <ClipboardPaste aria-hidden="true" />
              </Button>
              <Tooltip.Content>Import CSS</Tooltip.Content>
            </Tooltip>
          </div>
        </div>

      </div>
      <section
        aria-label="Theme settings"
        className={`scrollbar min-h-0 min-w-0 overflow-y-auto overscroll-contain @[52rem]/studio:max-h-none [@media(hover:hover)]:[&:not(:hover,:focus-within)]:[--scrollbar-color:transparent_transparent] ${platform === "web" ? "max-h-(--studio-mobile-editor-height)" : "max-h-40"}`}
        data-scrollbar="thin"
      >
        <div className="flex flex-col gap-5 px-2 pt-1 pb-3">
          {TOKEN_GROUPS.map((group) => (
            <section
              className="space-y-2"
              key={group.title}
              aria-label={group.title}
            >
              <h3 className="text-sm font-semibold">{group.title}</h3>

              <div className="grid grid-cols-2 items-stretch gap-2">
                {group.tokens
                  .filter(
                    (token) =>
                      platform === "web" || token !== "scrollbar-thumb",
                  )
                  .map((token) => (
                    <ColorControl
                      key={`${mode}-${token}`}
                      token={token}
                      value={overrides[token]}
                      highlighted={highlightedVariable === `--${token}`}
                      onChange={onToken}
                    />
                  ))}
              </div>
            </section>
          ))}

          <ThemeSettingsPanel
            overrides={overrides}
            mode={mode}
            highlightedVariable={highlightedVariable}
            onToken={onToken}
          />
          {platform === "native" && (
            <p className="text-xs text-muted">
              The selected font applies to the preview. Configure individual
              weights in your Expo app.
            </p>
          )}
        </div>
      </section>
    </aside>
  );
}
