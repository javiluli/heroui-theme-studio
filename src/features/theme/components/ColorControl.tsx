import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  Label,
  Tooltip,
  parseColor,
  type Color,
} from "@heroui/react";
import { Info, RotateCcw, Shuffle } from "lucide-react";
import type { ColorToken } from "../model";
import { cssColorValue } from "../conversion";
import { TOKEN_DESCRIPTIONS } from "../token-descriptions";
import { EditorTokenTarget } from "./EditorTokenTarget";

interface ColorControlProps {
  token: ColorToken;
  value: string;
  resetValue: string;
  hex: string;
  highlighted?: boolean;
  onChange: (token: ColorToken, color: string) => void;
  onPreview: (token: ColorToken, color: string) => void;
  onClearPreview: (token: ColorToken) => void;
}

function pickerHex(color: Color): string {
  const format = Math.round(color.getChannelValue("alpha") * 255) === 255 ? "hex" : "hexa";
  return color.toString(format).toUpperCase();
}

/** Color tiles use HeroUI's native picker; only layout lives in our wrappers. */
export const ColorControl = memo(function ColorControl({
  token,
  value,
  resetValue,
  hex,
  highlighted,
  onChange,
  onPreview,
  onClearPreview,
}: ColorControlProps) {
  // Keep HSB throughout dragging; sending rounded HEX back as the controlled
  // picker value on every pointer move made hue and thumb positions jump.
  const [pickerColor, setPickerColor] = useState<Color>(() =>
    parseColor(hex).toFormat("hsb"),
  );
  const lastSentHex = useRef<string | null>(null);
  const [overlayBackground, setOverlayBackground] = useState<string>();
  const clearOnClose = useCallback((element: HTMLElement | null) => {
    if (!element) onClearPreview(token);
  }, [onClearPreview, token]);

  useEffect(() => {
    // The parent reflects our own edits as HEX. Don't replace the active HSB
    // object with that rounded HEX while the user is dragging the picker.
    const ownEdit = hex === lastSentHex.current;
    lastSentHex.current = null;
    if (!ownEdit) setPickerColor(parseColor(hex).toFormat("hsb"));
  }, [hex, value]);

  const changeColor = (next: Color) => {
    setPickerColor(next.toFormat("hsb"));
    const selectedHex = pickerHex(next);
    onPreview(token, selectedHex === hex ? value : selectedHex);
  };

  const commitColor = (next: Color) => {
    const selectedHex = pickerHex(next);
    if (selectedHex !== hex) {
      lastSentHex.current = selectedHex;
      onChange(token, selectedHex);
    } else onClearPreview(token);
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
      className="@container/color-tile min-w-0 rounded-(--field-radius) bg-default text-default-foreground"
    >
      <div className="grid min-h-full min-w-0 grid-cols-1 items-center @min-[10.5rem]/color-tile:grid-cols-[minmax(0,1fr)_auto]">
        <ColorPicker
          value={pickerColor}
          onChange={changeColor}
        >
          <ColorPicker.Trigger
            className="w-full min-w-0"
            aria-label={`Edit color for --${token}`}
            onPress={() => {
              setPickerColor(parseColor(hex).toFormat("hsb"));
              if (token === "overlay") setOverlayBackground(cssColorValue(value));
            }}
          >
            <span className="flex min-h-9 w-full min-w-0 items-center gap-1 px-1 py-1.5 text-left">
              <span className="shrink-0" aria-hidden="true">
                <ColorSwatch
                  color={pickerColor}
                  size="xs"
                  style={{ "--color-swatch-current": `var(--${token})` } as CSSProperties}
                />
              </span>
              <span className="min-w-0 wrap-anywhere text-xs leading-tight font-medium">
                --{token}
              </span>
            </span>
          </ColorPicker.Trigger>

          <ColorPicker.Popover
            ref={clearOnClose}
            placement="bottom end"
            style={token === "overlay" ? {
              "--overlay": overlayBackground ?? cssColorValue(value),
            } as CSSProperties : undefined}
          >
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
              {token === "field-border" && (
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
            </div>
          </ColorPicker.Popover>
        </ColorPicker>
        <div className="flex justify-end">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={`Reset --${token}`}
            isDisabled={value === resetValue}
            onPress={() => onChange(token, resetValue)}
          >
            <RotateCcw size={14} aria-hidden="true" />
          </Button>
          <Tooltip delay={200}>
            <Button isIconOnly size="sm" variant="ghost" aria-label={`About --${token}`}>
              <Info size={14} aria-hidden="true" />
            </Button>
            <Tooltip.Content placement="right">
              <div className="max-w-56 space-y-1 leading-relaxed">
                <strong><code>--{token}</code></strong>
                <p>{TOKEN_DESCRIPTIONS[`--${token}`]}</p>
              </div>
            </Tooltip.Content>
          </Tooltip>
        </div>
      </div>
    </EditorTokenTarget>
  );
});
