import { Slider } from "heroui-native";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

export function PreviewSliderThumb({ label, value, max, step, onChange }: {
  label: string;
  value: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  // React Native Web forwards key events, but the native slider only handles gestures.
  const onKeyDown: ComponentProps<typeof Slider.Thumb>["onKeyDown"] = (event) => {
    const values: Partial<Record<string, number>> = {
      ArrowLeft: value - step,
      ArrowDown: value - step,
      ArrowRight: value + step,
      ArrowUp: value + step,
      Home: 0,
      End: max,
    };
    const next = values[event.nativeEvent.key];
    if (typeof next !== "number") return;
    event.preventDefault();
    onChange(Math.min(max, Math.max(0, next)));
  };

  const isWeb = Platform.OS === "web";
  return <Slider.Thumb tabIndex={isWeb ? 0 : undefined} onKeyDown={isWeb ? onKeyDown : undefined}
    accessibilityLabel={label} aria-valuemin={0}
    aria-valuemax={max} aria-valuenow={value} />;
}
