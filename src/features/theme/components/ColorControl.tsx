import { memo, useState, type CSSProperties } from "react";
import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  Label,
  Popover,
  parseColor,
  type Color,
} from "@heroui/react";
import { RotateCcw, Shuffle } from "lucide-react";
import type { ColorToken } from "../model";
import { readColorHex } from "../conversion";
import { TOKEN_DESCRIPTIONS } from "../token-descriptions";
import { EditorTokenTarget } from "./EditorTokenTarget";

interface ColorControlProps {
  token: ColorToken;
  value?: string;
  highlighted?: boolean;
  onChange: (token: ColorToken, color?: string) => void;
}

function pickerHex(color: Color): string {
  const format = Math.round(color.getChannelValue("alpha") * 255) === 255 ? "hex" : "hexa";
  return color.toString(format).toUpperCase();
}

/** Color tiles use HeroUI's native picker; only layout lives in our wrappers. */
export const ColorControl = memo(function ColorControl({
  token,
  value,
  highlighted,
  onChange,
}: ColorControlProps) {
  const [pickerColor, setPickerColor] = useState(() => parseColor("#000000").toFormat("hsb"));
  const [originalHex, setOriginalHex] = useState("#000000");
  const [overlayBackground, setOverlayBackground] = useState<string>();
  const openPicker = () => {
    const color = getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim();
    const hex = readColorHex(color);
    setOriginalHex(hex);
    setPickerColor(parseColor(hex).toFormat("hsb"));
    if (token === "overlay") setOverlayBackground(color);
  };

  const commitColor = (next: Color) => {
    const hex = pickerHex(next);
    if (hex !== originalHex) {
      setOriginalHex(hex);
      onChange(token, hex);
    }
  };

  const applyRgbColor = (next: Color) => {
    const adjusted = next.withChannelValue("alpha", pickerColor.getChannelValue("alpha")).toFormat("hsb");
    setPickerColor(adjusted);
    commitColor(adjusted);
  };

  const shuffleColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 50 + Math.floor(Math.random() * 50);
    const lightness = 40 + Math.floor(Math.random() * 30);
    applyRgbColor(parseColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`));
  };

  return (
    <EditorTokenTarget
      variable={`--${token}`}
      highlighted={highlighted}
      className="min-w-0 rounded-(--field-radius) border border-separator bg-surface text-surface-foreground focus-within:border-focus"
    >
      <ColorPicker
        value={pickerColor}
        onChange={(color) => setPickerColor(color.toFormat("hsb"))}
      >
        <ColorPicker.Trigger
          className="w-full min-w-0"
          aria-label={`Edit color for --${token}`}
          onPress={openPicker}
        >
          <span className="flex min-h-12 w-full min-w-0 items-center gap-2 p-2 text-left">
            <span className="shrink-0 rounded-md ring-1 ring-foreground/20" aria-hidden="true">
              <ColorSwatch
                color={pickerColor}
                shape="square"
                size="md"
                style={{ "--color-swatch-current": `var(--${token})` } as CSSProperties}
              />
            </span>
            <code className="min-w-0 wrap-anywhere text-xs leading-4 font-medium">
              --{token}
            </code>
          </span>
        </ColorPicker.Trigger>

        <ColorPicker.Popover
          placement="bottom end"
          style={token === "overlay" ? {
            "--overlay": overlayBackground,
          } as CSSProperties : undefined}
        >
          <Popover.Dialog aria-label={`Edit --${token}`}>
            <div className="flex min-w-0 w-full flex-col gap-3 p-1">
              <code className="min-w-0 break-all whitespace-normal text-xs font-semibold text-foreground">
                --{token}
              </code>
              <ColorArea
                aria-label="Saturation and brightness"
                className="max-w-full"
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                onChangeEnd={commitColor}
              >
                <ColorArea.Thumb />
              </ColorArea>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <ColorSlider aria-label="Hue" channel="hue" colorSpace="hsb" onChangeEnd={commitColor}>
                    <ColorSlider.Track>
                      <ColorSlider.Thumb />
                    </ColorSlider.Track>
                  </ColorSlider>
                </div>
                <Button isIconOnly size="sm" variant="tertiary" aria-label="Shuffle color" onPress={shuffleColor}>
                  <Shuffle size={16} aria-hidden="true" />
                </Button>
              </div>
              {(token === "field-border" || token === "backdrop" || token === "scrollbar-thumb") && (
                <ColorSlider channel="alpha" onChangeEnd={commitColor}>
                  <Label>Alpha</Label>
                  <ColorSlider.Output />
                  <ColorSlider.Track>
                    <ColorSlider.Thumb />
                  </ColorSlider.Track>
                </ColorSlider>
              )}
              <ColorField
                slot={null}
                aria-label={`Hex color for --${token}`}
                value={pickerColor}
                onChange={(next) => { if (next) applyRgbColor(next); }}
              >
                <ColorField.Group variant="secondary">
                  <ColorField.Prefix><ColorSwatch color={pickerColor} size="xs" /></ColorField.Prefix>
                  <ColorField.Input placeholder="Hex color" />
                </ColorField.Group>
              </ColorField>
              <p className="max-w-64 text-xs leading-relaxed text-overlay-foreground">{TOKEN_DESCRIPTIONS[`--${token}`]}</p>
              {value !== undefined && (
                <Button slot="close" size="sm" variant="ghost" onPress={() => onChange(token)}>
                  <RotateCcw size={14} aria-hidden="true" /> Reset color
                </Button>
              )}
            </div>
          </Popover.Dialog>
        </ColorPicker.Popover>
      </ColorPicker>
    </EditorTokenTarget>
  );
});
