import { InputOTP } from "heroui-native";
import type { ComponentProps } from "react";
import { View } from "react-native";

export function PreviewInputOTP(props: ComponentProps<typeof InputOTP>) {
  // Hide the duplicate browser text while keeping the input tappable and focusable.
  return <View className="web:[&_input]:opacity-0"><InputOTP {...props} /></View>;
}
