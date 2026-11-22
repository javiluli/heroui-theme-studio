import { Switch, useThemeColor } from "heroui-native";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

// Match the built-in thumb inset where Reanimated's logical offset fails on web.
const thumbInset = 2;

export function PreviewSwitch({ isSelected, ...props }: Omit<ComponentProps<typeof Switch>, "children">) {
  const selectedColor = useThemeColor("accent-foreground");
  return (
    <Switch isSelected={isSelected} {...props}>
      {Platform.OS === "web" ? (
        <Switch.Thumb
          isAnimatedStyleActive={false}
          style={{
            start: isSelected ? "auto" : thumbInset,
            end: isSelected ? thumbInset : "auto",
            backgroundColor: isSelected ? selectedColor : "white",
          }}
        />
      ) : <Switch.Thumb />}
    </Switch>
  );
}
