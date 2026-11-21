import { useState, type CSSProperties } from "react";
import { Button, ColorSwatch, Label, ListBox, Select, Switch, ToggleButton, ToggleButtonGroup, Tooltip } from "@heroui/react";
import { Check, Copy, RotateCcw, ClipboardPaste, Globe2, Info, Smartphone } from "lucide-react";
import {
  COLOR_TOKENS,
  TOKEN_GROUPS,
  type ColorToken,
  type ThemeConfig,
  type ThemeMode,
} from "../model";
import { createPreset, PRESET_LABELS, templates, type PresetId } from "../templates";
import { exportThemeCss, type ThemePlatform } from "../export-css";
import { ColorControl } from "./ColorControl";
import { colorToHex } from "../conversion";
import { ThemeSettingsPanel } from "./ThemeSettingsPanel";
import { getModeSettings } from "../mode-layout";
import { NATIVE_COLOR_LINKS } from "../native-color-links";
import type { EditableThemeVariable } from "../token-descriptions";

const linkExplanations: Partial<Record<ColorToken, string>> = {
  accent: "Focus indicators follow the brand color.",
  foreground: "Text across surfaces and overlays follows the main text color.",
  muted: "Field placeholders follow the secondary text color.",
};

interface EditorPanelProps {
  platform: ThemePlatform;
  onPlatformChange: (platform: ThemePlatform) => void;
  theme: ThemeConfig;
  mode: ThemeMode;
  useNativeLinks: boolean;
  onToggleNativeLinks: (enabled: boolean) => void;
  highlightedVariable: EditableThemeVariable | null;
  selectedPreset: PresetId | "custom";
  onPreset: (preset: PresetId) => void;
  onColor: (token: ColorToken, color: string) => void;
  onPreviewColor: (token: ColorToken, color: string) => void;
  onClearColorPreview: (token: ColorToken) => void;
  onRadius: (value: number) => void;
  onFieldRadius: (value: number) => void;
  onFontFamily: (value: ThemeConfig["fontFamily"]) => void;
  onReset: () => void;
  onImportCss: () => void;
}

const presets = templates.map(({ name, label }) => {
  const { light, dark } = createPreset(name).palettes;
  return {
    key: name,
    label,
    accent: { light: colorToHex(light.accent, light), dark: colorToHex(dark.accent, dark) },
  };
});

/** Layout utilities never target HeroUI BEM classes or override its component CSS. */
export function EditorPanel({
  platform,
  onPlatformChange,
  theme,
  mode,
  useNativeLinks,
  onToggleNativeLinks,
  highlightedVariable,
  selectedPreset,
  onPreset,
  onColor,
  onPreviewColor,
  onClearColorPreview,
  onRadius,
  onFieldRadius,
  onFontFamily,
  onReset,
  onImportCss,
}: EditorPanelProps) {
  const palette = theme.palettes[mode];
  const [copy, setCopy] = useState<{ theme: ThemeConfig; platform: ThemePlatform; status: "done" | "error" }>();
  const copyStatus = copy?.theme === theme && copy.platform === platform ? copy.status : "idle";
  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(exportThemeCss(theme, platform));
      setCopy({ theme, platform, status: "done" });
    } catch {
      setCopy({ theme, platform, status: "error" });
    }
  };
  const nativeLinks = platform === "web" ? NATIVE_COLOR_LINKS[mode] : { ...NATIVE_COLOR_LINKS[mode], scrollbar: undefined };
  const linkSources = [...new Set(Object.values(nativeLinks))].filter((source) => source !== undefined).sort();

  return (
    <aside
      className={`flex min-h-0 min-w-0 flex-col gap-3 ${platform === "web" ? "@[56rem]/studio:sticky @[56rem]/studio:top-[4.5rem] @[56rem]/studio:max-h-[calc(100dvh-5.5rem)]" : ""}`}
      aria-label="Theme editor"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-1 gap-y-2 px-2">
        <div
          className="flex items-center gap-1 sm:gap-2"
          role="group"
          aria-label="Theme actions"
        >
          <Tooltip>
            <Button
              size="md"
              isIconOnly
              variant="outline"
              aria-label="Reset theme"
              onPress={onReset}
            >
              <RotateCcw aria-hidden="true" />
            </Button>
            <Tooltip.Content>Reset theme</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Button
              size="md"
              isIconOnly
              variant="outline"
              aria-label={`Copy CSS ${platform === "web" ? "Web" : "Native"}`}
              onPress={copyCss}
            >
              {copyStatus === "done" ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
            </Button>
            <Tooltip.Content>Copy theme CSS</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Button
              size="md"
              isIconOnly
              variant="outline"
              aria-label="Import CSS"
              onPress={onImportCss}
            >
              <ClipboardPaste aria-hidden="true" />
            </Button>
            <Tooltip.Content>Import CSS</Tooltip.Content>
          </Tooltip>
          <span className="sr-only" role="status">
            {copyStatus === "done" ? "CSS copied" : ""}
          </span>
        </div>
        <div className="ms-auto flex shrink-0">
          <ToggleButtonGroup size="sm" aria-label="Theme platform" selectionMode="single" disallowEmptySelection
            selectedKeys={[platform]} onSelectionChange={(keys) => {
              const selected = [...keys][0];
              if (selected === "web" || selected === "native") onPlatformChange(selected);
            }}>
            <ToggleButton id="web">
              <span className="hidden sm:inline-flex"><Globe2 size={14} aria-hidden="true" /></span>
              Web
            </ToggleButton>
            <ToggleButton id="native">
              <span className="hidden sm:inline-flex"><Smartphone size={14} aria-hidden="true" /></span>
              Native
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <section aria-label="Theme settings"
        className="scrollbar max-h-96 min-h-0 min-w-0 overflow-y-auto overscroll-contain @[56rem]/studio:max-h-none [@media(hover:hover)]:[&:not(:hover,:focus-within)]:[--scrollbar-color:transparent_transparent]"
        data-scrollbar="thin">
        <div className="flex flex-col gap-2 px-2 pb-0">
          <div>
            <Select
              selectedKey={selectedPreset === "custom" ? null : selectedPreset}
              onSelectionChange={(key) => {
                if (key) onPreset(String(key) as PresetId);
              }}
              placeholder="Custom theme"
            >
              <Label>Theme preset</Label>
              <Select.Trigger>
                <Select.Value>
                  <span className="flex min-w-0 items-center gap-2">
                    <ColorSwatch size="xs" color="#000000"
                      style={{ "--color-swatch-current": "var(--accent)" } as CSSProperties} aria-hidden="true" />
                    <span className="truncate">{selectedPreset === "custom" ? "Custom theme" : PRESET_LABELS[selectedPreset]}</span>
                  </span>
                </Select.Value>
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={presets}>
                  {(item) => (
                    <ListBox.Item id={item.key} textValue={item.label}>
                      <ColorSwatch size="xs" color={item.accent[mode]} aria-hidden="true" />
                      <span>{item.label}</span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Switch
              size="sm"
              isSelected={useNativeLinks}
              onChange={onToggleNativeLinks}
            >
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Label>HeroUI token links</Label>
              </Switch.Content>
            </Switch>
            <Tooltip delay={200}>
              <Button
                size="sm"
                isIconOnly
                variant="ghost"
                aria-label="About HeroUI token links"
              >
                <Info size={15} aria-hidden="true" />
              </Button>
              <Tooltip.Content placement="right">
                <div className="max-w-80 space-y-3 text-xs leading-snug">
                  <p>
                    <strong>
                      HeroUI defaults for {platform === "native" ? "Native" : "Web"} · {" "}
                      {mode === "light" ? "Light" : "Dark"}
                    </strong>
                  </p>
                  <p>
                    These are HeroUI’s default color links for this mode. When enabled, each group follows its main token, so changing that color updates the whole group.
                  </p>
                  <p>
                    Linked controls are hidden automatically. Turn off token links to show them and edit each color independently.
                  </p>
                  <div className="space-y-3">
                    {linkSources.map((source) => {
                      const dependents = COLOR_TOKENS.filter(
                        (token) => nativeLinks[token] === source,
                      );
                      return (
                        <section key={source} aria-labelledby={`linked-colors-${source}`}
                          className="space-y-1 border-t border-separator pt-2">
                          <h3 id={`linked-colors-${source}`} className="text-sm font-semibold text-foreground">
                            <code>--{source}</code>
                          </h3>
                          {linkExplanations[source] && <p>{linkExplanations[source]}</p>}
                          <ul className="list-disc space-y-0.5 ps-4">
                            {dependents.map((token) => (
                              <li key={token} className="wrap-anywhere">
                                <code>--{token}</code>
                                {token === "scrollbar" && <span> · main text color at 15% opacity</span>}
                              </li>
                            ))}
                          </ul>
                        </section>
                      );
                    })}
                  </div>
                </div>
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>

        {copyStatus === "error" && (
          <p className="px-2 pt-2 text-xs text-danger" role="alert">
            Could not copy CSS. Use Export CSS instead.
          </p>
        )}

        <div className="flex flex-col gap-5 px-2 pt-4 pb-3">
          {TOKEN_GROUPS.map((group) => (
            <section
              className="space-y-2"
              key={group.title}
              aria-label={group.title}
            >
              <h3 className="text-sm font-semibold">{group.title}</h3>

              <div className="grid grid-cols-2 items-stretch gap-2">
                {group.tokens.filter((token) => platform === "web" || token !== "scrollbar").map((token) => {
                  if (useNativeLinks && nativeLinks[token]) return null;
                  return <ColorControl
                    key={token}
                    token={token}
                    value={palette[token]}
                    hex={colorToHex(palette[token], palette)}
                    highlighted={highlightedVariable === `--${token}`}
                    onChange={onColor}
                    onPreview={onPreviewColor}
                    onClearPreview={onClearColorPreview}
                  />;
                })}
              </div>
            </section>
          ))}

          <ThemeSettingsPanel
            {...getModeSettings(theme, mode)}
            highlightedVariable={highlightedVariable}
            onRadius={onRadius}
            onFieldRadius={onFieldRadius}
            onFontFamily={onFontFamily}
          />
          {platform === "native" && (
            <p className="text-xs text-muted">The selected font applies to the preview. Configure individual weights in your Expo app.</p>
          )}
        </div>
      </section>
    </aside>
  );
}
